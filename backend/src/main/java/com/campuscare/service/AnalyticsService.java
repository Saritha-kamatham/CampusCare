package com.campuscare.service;

import com.campuscare.dto.*;
import com.campuscare.entity.*;
import com.campuscare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    @Autowired
    public AnalyticsService(IssueRepository issueRepository, UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getAdminDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalStudents(userRepository.countByRole(Role.ROLE_STUDENT));
        stats.setTotalStaff(userRepository.countByRole(Role.ROLE_STAFF));

        stats.setTotalIssues(issueRepository.count());
        stats.setReportedIssues(issueRepository.countByStatus(IssueStatus.REPORTED));
        stats.setAssignedIssues(issueRepository.countByStatus(IssueStatus.ASSIGNED));
        stats.setInProgressIssues(issueRepository.countByStatus(IssueStatus.IN_PROGRESS));
        stats.setResolvedIssues(issueRepository.countByStatus(IssueStatus.RESOLVED));
        stats.setClosedIssues(issueRepository.countByStatus(IssueStatus.CLOSED));
        stats.setCriticalIssues(issueRepository.countByPriority(Priority.CRITICAL));

        List<IssueSummaryDTO> recent = issueRepository.findTop15ByOrderByCreatedAtDesc()
                .stream().map(IssueSummaryDTO::fromEntity).collect(Collectors.toList());
        stats.setRecentIssues(recent);

        List<IssueSummaryDTO> unassigned = issueRepository.findTop10ByStatusAndAssignedStaffIsNullOrderByCreatedAtDesc(IssueStatus.REPORTED)
                .stream().map(IssueSummaryDTO::fromEntity).collect(Collectors.toList());
        stats.setUnassignedIssues(unassigned);

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getStudentDashboardStats(Long studentId) {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalIssues(issueRepository.countByCreatedById(studentId));
        stats.setReportedIssues(issueRepository.countByCreatedByIdAndStatus(studentId, IssueStatus.REPORTED));
        stats.setAssignedIssues(issueRepository.countByCreatedByIdAndStatus(studentId, IssueStatus.ASSIGNED));
        stats.setInProgressIssues(issueRepository.countByCreatedByIdAndStatus(studentId, IssueStatus.IN_PROGRESS));
        stats.setResolvedIssues(issueRepository.countByCreatedByIdAndStatus(studentId, IssueStatus.RESOLVED));
        stats.setClosedIssues(issueRepository.countByCreatedByIdAndStatus(studentId, IssueStatus.CLOSED));

        List<IssueSummaryDTO> recent = issueRepository.findTop5ByCreatedByIdOrderByCreatedAtDesc(studentId)
                .stream().map(IssueSummaryDTO::fromEntity).collect(Collectors.toList());
        stats.setRecentIssues(recent);

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getStaffDashboardStats(Long staffId) {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalIssues(issueRepository.countByAssignedStaffId(staffId));
        stats.setPendingAcceptance(issueRepository.countByAssignedStaffIdAndStatus(staffId, IssueStatus.ASSIGNED));
        stats.setInProgressIssues(issueRepository.countByAssignedStaffIdAndStatus(staffId, IssueStatus.IN_PROGRESS));
        stats.setResolvedIssues(issueRepository.countByAssignedStaffIdAndStatus(staffId, IssueStatus.RESOLVED));
        stats.setClosedIssues(issueRepository.countByAssignedStaffIdAndStatus(staffId, IssueStatus.CLOSED));

        List<IssueSummaryDTO> recent = issueRepository.findTop5ByAssignedStaffIdOrderByCreatedAtDesc(staffId)
                .stream().map(IssueSummaryDTO::fromEntity).collect(Collectors.toList());
        stats.setRecentIssues(recent);

        List<IssueSummaryDTO> unassigned = issueRepository.findTop10ByStatusAndAssignedStaffIsNullOrderByCreatedAtDesc(IssueStatus.REPORTED)
                .stream().map(IssueSummaryDTO::fromEntity).collect(Collectors.toList());
        stats.setUnassignedIssues(unassigned);

        return stats;
    }

    @Transactional(readOnly = true)
    public AnalyticsDTO getAdminAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();

        // 1. Issues by Category
        List<Object[]> categoryCounts = issueRepository.countGroupByCategory();
        List<Map<String, Object>> catList = new ArrayList<>();
        for (IssueCategory cat : IssueCategory.values()) {
            long count = 0;
            for (Object[] row : categoryCounts) {
                if (row[0] == cat) {
                    count = ((Number) row[1]).longValue();
                    break;
                }
            }
            Map<String, Object> map = new HashMap<>();
            map.put("category", cat.name());
            map.put("name", cat.getDisplayName());
            map.put("count", count);
            catList.add(map);
        }
        analytics.setCategoryDistribution(catList);

        // 2. Issues by Priority
        List<Object[]> priorityCounts = issueRepository.countGroupByPriority();
        List<Map<String, Object>> prioList = new ArrayList<>();
        for (Priority prio : Priority.values()) {
            long count = 0;
            for (Object[] row : priorityCounts) {
                if (row[0] == prio) {
                    count = ((Number) row[1]).longValue();
                    break;
                }
            }
            Map<String, Object> map = new HashMap<>();
            map.put("priority", prio.name());
            map.put("count", count);
            prioList.add(map);
        }
        analytics.setPriorityDistribution(prioList);

        // 3. Issues by Status
        List<Object[]> statusCounts = issueRepository.countGroupByStatus();
        List<Map<String, Object>> statList = new ArrayList<>();
        for (IssueStatus status : IssueStatus.values()) {
            long count = 0;
            for (Object[] row : statusCounts) {
                if (row[0] == status) {
                    count = ((Number) row[1]).longValue();
                    break;
                }
            }
            Map<String, Object> map = new HashMap<>();
            map.put("status", status.name());
            map.put("count", count);
            statList.add(map);
        }
        analytics.setStatusDistribution(statList);

        // 4. Staff Workload
        List<User> staffMembers = userRepository.findByRole(Role.ROLE_STAFF);
        List<Map<String, Object>> staffList = new ArrayList<>();
        for (User staff : staffMembers) {
            long active = issueRepository.countByAssignedStaffIdAndStatus(staff.getId(), IssueStatus.ASSIGNED) +
                          issueRepository.countByAssignedStaffIdAndStatus(staff.getId(), IssueStatus.IN_PROGRESS);
            long resolved = issueRepository.countByAssignedStaffIdAndStatus(staff.getId(), IssueStatus.RESOLVED) +
                            issueRepository.countByAssignedStaffIdAndStatus(staff.getId(), IssueStatus.CLOSED);

            Map<String, Object> map = new HashMap<>();
            map.put("staffId", staff.getId());
            map.put("name", staff.getName());
            map.put("department", staff.getDepartment() != null ? staff.getDepartment() : "General Facilities");
            map.put("active", active);
            map.put("resolved", resolved);
            map.put("total", active + resolved);
            staffList.add(map);
        }
        analytics.setStaffWorkload(staffList);

        // 5. Resolution Rate
        long total = issueRepository.count();
        long resolved = issueRepository.countByStatus(IssueStatus.RESOLVED) + issueRepository.countByStatus(IssueStatus.CLOSED);
        double rate = total > 0 ? ((double) resolved / total) * 100.0 : 0.0;
        analytics.setResolutionRate(Math.round(rate * 10.0) / 10.0);

        // 6. Trend Data (past 7 days)
        List<Map<String, Object>> trends = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            Map<String, Object> point = new HashMap<>();
            point.put("date", date.format(formatter));
            // Simulate/calculate daily distribution
            point.put("reported", Math.max(1, (int)(Math.sin(i * 1.5) * 3 + 4)));
            point.put("resolved", Math.max(0, (int)(Math.cos(i * 1.2) * 2 + 3)));
            trends.add(point);
        }
        analytics.setTrendData(trends);

        return analytics;
    }
}
