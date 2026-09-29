package com.campuscare.service;

import com.campuscare.dto.*;
import com.campuscare.entity.*;
import com.campuscare.exception.BadRequestException;
import com.campuscare.exception.ForbiddenException;
import com.campuscare.exception.ResourceNotFoundException;
import com.campuscare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final IssueHistoryRepository issueHistoryRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    @Autowired
    public IssueService(IssueRepository issueRepository,
                        UserRepository userRepository,
                        AssignmentRepository assignmentRepository,
                        IssueHistoryRepository issueHistoryRepository,
                        CommentRepository commentRepository,
                        NotificationService notificationService) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.issueHistoryRepository = issueHistoryRepository;
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
    }

    private String generateIssueCode() {
        int year = LocalDateTime.now().getYear();
        int randomNum = 1000 + new Random().nextInt(9000);
        String code = "CC-" + year + "-" + randomNum;
        while (issueRepository.findByIssueCode(code).isPresent()) {
            randomNum = 1000 + new Random().nextInt(9000);
            code = "CC-" + year + "-" + randomNum;
        }
        return code;
    }

    @Transactional
    public IssueDetailDTO createIssue(CreateIssueRequest request, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student user not found"));

        Issue issue = new Issue();
        issue.setIssueCode(generateIssueCode());
        issue.setTitle(request.getTitle().trim());
        issue.setDescription(request.getDescription().trim());
        issue.setCategory(request.getCategory());
        issue.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        issue.setLocation(request.getLocation().trim());
        issue.setImageUrl(request.getImageUrl());
        issue.setStatus(IssueStatus.REPORTED);
        issue.setCreatedBy(student);

        issue = issueRepository.save(issue);

        // Record initial history
        IssueHistory history = new IssueHistory(
                issue,
                student,
                null,
                IssueStatus.REPORTED,
                "Issue reported by student " + student.getName()
        );
        issueHistoryRepository.save(history);

        // Notify Admins
        List<User> admins = userRepository.findByRole(Role.ROLE_ADMIN);
        for (User admin : admins) {
            notificationService.sendNotification(
                    admin,
                    issue,
                    "New Issue Reported",
                    "Student " + student.getName() + " reported a new issue: " + issue.getIssueCode() + " - " + issue.getTitle(),
                    NotificationType.NEW_ISSUE
            );
        }

        // Department-Based Routing: Notify all matching staff specialists
        List<User> staffMembers = userRepository.findByRole(Role.ROLE_STAFF);
        for (User staff : staffMembers) {
            if (staff.isActive() && isCategoryRelatedToDepartment(issue.getCategory(), staff.getDepartment())) {
                notificationService.sendNotification(
                        staff,
                        issue,
                        "New " + issue.getCategory().getDisplayName() + " Issue in Your Department",
                        "Ticket #" + issue.getIssueCode() + " (" + issue.getTitle() + ") at " + issue.getLocation() + " requires attention from " + staff.getDepartment() + ". You can claim and resolve it.",
                        NotificationType.NEW_ISSUE
                );
            }
        }

        return getIssueDetail(issue.getId());
    }

    @Transactional(readOnly = true)
    public IssueDetailDTO getIssueDetail(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        IssueDetailDTO dto = IssueDetailDTO.fromEntity(issue);

        // Fetch assignments
        List<AssignmentDTO> assignments = assignmentRepository.findByIssueIdOrderByAssignedAtDesc(issueId)
                .stream().map(AssignmentDTO::fromEntity).collect(Collectors.toList());
        dto.setAssignments(assignments);

        // Fetch history
        List<IssueHistory> histories = issueHistoryRepository.findByIssueIdOrderByChangedAtAsc(issueId);
        List<IssueHistoryDTO> historyDTOs = histories.stream().map(IssueHistoryDTO::fromEntity).collect(Collectors.toList());
        dto.setHistory(historyDTOs);

        // Calculate progression milestones
        for (IssueHistory h : histories) {
            if (h.getNewStatus() == IssueStatus.REPORTED && dto.getReportedTime() == null) {
                dto.setReportedTime(h.getChangedAt());
            } else if (h.getNewStatus() == IssueStatus.ASSIGNED && dto.getAssignedTime() == null) {
                dto.setAssignedTime(h.getChangedAt());
            } else if (h.getNewStatus() == IssueStatus.IN_PROGRESS && dto.getInProgressTime() == null) {
                dto.setInProgressTime(h.getChangedAt());
            } else if (h.getNewStatus() == IssueStatus.RESOLVED && dto.getResolvedTime() == null) {
                dto.setResolvedTime(h.getChangedAt());
            } else if (h.getNewStatus() == IssueStatus.CLOSED && dto.getClosedTime() == null) {
                dto.setClosedTime(h.getChangedAt());
            }
        }

        // Fetch comments
        List<CommentDTO> comments = commentRepository.findByIssueIdOrderByCreatedAtAsc(issueId)
                .stream().map(CommentDTO::fromEntity).collect(Collectors.toList());
        dto.setComments(comments);

        return dto;
    }

    @Transactional(readOnly = true)
    public Page<IssueSummaryDTO> getIssues(Long studentId, Long staffId, IssueCategory category,
                                          Priority priority, IssueStatus status, String search, Pageable pageable) {
        String querySearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return issueRepository.findWithFilters(studentId, staffId, category, priority, status, querySearch, pageable)
                .map(IssueSummaryDTO::fromEntity);
    }

    @Transactional
    public IssueDetailDTO assignIssue(Long issueId, AssignIssueRequest request, Long adminId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        User staff = userRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + request.getStaffId()));

        if (staff.getRole() != Role.ROLE_STAFF) {
            throw new BadRequestException("Selected user is not a staff member.");
        }

        IssueStatus oldStatus = issue.getStatus();
        issue.setAssignedStaff(staff);
        issue.setAssignedAdmin(admin);
        issue.setStatus(IssueStatus.ASSIGNED);
        issue = issueRepository.save(issue);

        // Create assignment record
        Assignment assignment = new Assignment(issue, staff, admin, request.getNote());
        assignmentRepository.save(assignment);

        // Record history
        String note = "Assigned to staff " + staff.getName() + " by Admin " + admin.getName();
        if (request.getNote() != null && !request.getNote().trim().isEmpty()) {
            note += ". Note: " + request.getNote().trim();
        }
        IssueHistory history = new IssueHistory(issue, admin, oldStatus, IssueStatus.ASSIGNED, note);
        issueHistoryRepository.save(history);

        // Send real-time notification to staff
        notificationService.sendNotification(
                staff,
                issue,
                "New Issue Assigned",
                "New issue #" + issue.getIssueCode() + " (" + issue.getTitle() + ") has been assigned to you.",
                NotificationType.ISSUE_ASSIGNED
        );

        // Send real-time notification to student
        notificationService.sendNotification(
                issue.getCreatedBy(),
                issue,
                "Issue Assigned",
                "Your issue #" + issue.getIssueCode() + " has been assigned to " + staff.getName() + ".",
                NotificationType.ISSUE_ASSIGNED
        );

        return getIssueDetail(issueId);
    }

    @Transactional
    public IssueDetailDTO acceptIssue(Long issueId, Long staffId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + staffId));

        if (issue.getAssignedStaff() == null || !issue.getAssignedStaff().getId().equals(staffId)) {
            throw new ForbiddenException("You are not assigned to work on this issue.");
        }

        IssueStatus oldStatus = issue.getStatus();
        issue.setStatus(IssueStatus.IN_PROGRESS);
        issue = issueRepository.save(issue);

        // Record history
        IssueHistory history = new IssueHistory(
                issue,
                staff,
                oldStatus,
                IssueStatus.IN_PROGRESS,
                "Staff member " + staff.getName() + " accepted the assignment and began work."
        );
        issueHistoryRepository.save(history);

        // Real-time notification to student
        notificationService.sendNotification(
                issue.getCreatedBy(),
                issue,
                "Work Started",
                "Your issue #" + issue.getIssueCode() + " is now being worked on by " + staff.getName() + ".",
                NotificationType.STATUS_CHANGED
        );

        return getIssueDetail(issueId);
    }

    @Transactional
    public IssueDetailDTO claimIssue(Long issueId, Long staffId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + staffId));

        if (staff.getRole() != Role.ROLE_STAFF) {
            throw new BadRequestException("Only staff members can claim issues.");
        }

        IssueStatus oldStatus = issue.getStatus();
        issue.setAssignedStaff(staff);
        issue.setStatus(IssueStatus.IN_PROGRESS);
        issue = issueRepository.save(issue);

        Assignment assignment = new Assignment(issue, staff, staff, "Self-assigned / claimed directly by staff member " + staff.getName());
        assignmentRepository.save(assignment);

        IssueHistory history = new IssueHistory(
                issue,
                staff,
                oldStatus,
                IssueStatus.IN_PROGRESS,
                "Ticket claimed from open queue by " + staff.getName() + " and marked IN_PROGRESS."
        );
        issueHistoryRepository.save(history);

        notificationService.sendNotification(
                issue.getCreatedBy(),
                issue,
                "Staff Claimed Your Ticket",
                staff.getName() + " has claimed your ticket and is actively resolving it.",
                NotificationType.STATUS_CHANGED
        );

        return getIssueDetail(issueId);
    }

    @Transactional
    public IssueDetailDTO updateStatus(Long issueId, StatusUpdateRequest request, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Validate permissions
        if (user.getRole() == Role.ROLE_STUDENT) {
            // Students can only close an issue that is RESOLVED
            if (!issue.getCreatedBy().getId().equals(userId)) {
                throw new ForbiddenException("You cannot update the status of another student's issue.");
            }
            if (request.getStatus() != IssueStatus.CLOSED) {
                throw new BadRequestException("Students may only close resolved issues.");
            }
        } else if (user.getRole() == Role.ROLE_STAFF) {
            if (issue.getAssignedStaff() == null || !issue.getAssignedStaff().getId().equals(userId)) {
                throw new ForbiddenException("You are not assigned to this issue.");
            }
        }

        IssueStatus oldStatus = issue.getStatus();
        IssueStatus newStatus = request.getStatus();

        issue.setStatus(newStatus);
        if (newStatus == IssueStatus.RESOLVED) {
            issue.setResolvedAt(LocalDateTime.now());
            if (request.getNotes() != null) {
                issue.setResolutionNotes(request.getNotes().trim());
            }
            if (request.getResolutionImageUrl() != null) {
                issue.setResolutionImageUrl(request.getResolutionImageUrl());
            }
        } else if (newStatus == IssueStatus.CLOSED) {
            issue.setClosedAt(LocalDateTime.now());
        }

        issue = issueRepository.save(issue);

        // History record
        String note = (request.getNotes() != null && !request.getNotes().trim().isEmpty())
                ? request.getNotes().trim()
                : "Status transitioned from " + oldStatus + " to " + newStatus + " by " + user.getName();

        IssueHistory history = new IssueHistory(issue, user, oldStatus, newStatus, note);
        issueHistoryRepository.save(history);

        // Send notifications based on new status
        if (newStatus == IssueStatus.RESOLVED) {
            notificationService.sendNotification(
                    issue.getCreatedBy(),
                    issue,
                    "Issue Resolved",
                    "Your issue #" + issue.getIssueCode() + " (" + issue.getTitle() + ") has been resolved.",
                    NotificationType.ISSUE_RESOLVED
            );
        } else if (newStatus == IssueStatus.CLOSED) {
            notificationService.sendNotification(
                    issue.getCreatedBy(),
                    issue,
                    "Issue Closed",
                    "Issue #" + issue.getIssueCode() + " has been closed.",
                    NotificationType.ISSUE_CLOSED
            );
            if (issue.getAssignedStaff() != null) {
                notificationService.sendNotification(
                        issue.getAssignedStaff(),
                        issue,
                        "Issue Closed",
                        "Issue #" + issue.getIssueCode() + " was marked as CLOSED.",
                        NotificationType.ISSUE_CLOSED
                );
            }
        } else {
            notificationService.sendNotification(
                    issue.getCreatedBy(),
                    issue,
                    "Status Update",
                    "Issue #" + issue.getIssueCode() + " status changed to " + newStatus + ".",
                    NotificationType.STATUS_CHANGED
            );
        }

        return getIssueDetail(issueId);
    }

    @Transactional
    public IssueDetailDTO updatePriority(Long issueId, Priority newPriority, Long adminId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        Priority oldPriority = issue.getPriority();
        issue.setPriority(newPriority);
        issue = issueRepository.save(issue);

        IssueHistory history = new IssueHistory(
                issue,
                admin,
                issue.getStatus(),
                issue.getStatus(),
                "Priority updated from " + oldPriority + " to " + newPriority + " by Admin " + admin.getName()
        );
        issueHistoryRepository.save(history);

        return getIssueDetail(issueId);
    }

    public static boolean isCategoryRelatedToDepartment(IssueCategory category, String department) {
        if (category == null) return false;
        if (department == null || department.trim().isEmpty()) return true;
        String dept = department.toLowerCase().trim();

        switch (category) {
            case WIFI_INTERNET:
                return dept.matches(".*\\b(it|network|networks|infrastructure|computer|internet|wifi)\\b.*")
                        || dept.contains("information technology");
            case ELECTRICAL:
                return dept.matches(".*\\b(electrical|power|wiring|ac|appliance|hardware)\\b.*");
            case CLASSROOM:
                return dept.matches(".*\\b(classroom|media|projector|av|audiovisual)\\b.*")
                        || dept.matches(".*\\b(it|network|networks|infrastructure)\\b.*")
                        || dept.contains("electrical");
            case LABORATORY:
                return dept.matches(".*\\b(lab|laboratory|equipment|instrument|gear)\\b.*");
            case HOSTEL:
                return dept.matches(".*\\b(hostel|dorm|dormitory|residence|housing|facilities|operations)\\b.*");
            case CLEANING:
                return dept.matches(".*\\b(cleaning|sanitation|hygiene|housekeeping|janitor|maintenance|waste)\\b.*")
                        || dept.contains("facilities");
            case LIBRARY:
                return dept.matches(".*\\b(library|books|reading|information services)\\b.*");
            case TRANSPORT:
                return dept.matches(".*\\b(transport|shuttle|bus|fleet|vehicle|transit)\\b.*");
            case SECURITY:
                return dept.matches(".*\\b(security|safety|guard|patrol|surveillance)\\b.*");
            case OTHER:
            default:
                return true;
        }
    }
}
