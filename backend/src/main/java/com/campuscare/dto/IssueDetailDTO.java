package com.campuscare.dto;

import com.campuscare.entity.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class IssueDetailDTO {

    private Long id;
    private String issueCode;
    private String title;
    private String description;
    private IssueCategory category;
    private String categoryDisplayName;
    private Priority priority;
    private IssueStatus status;
    private String location;
    private String imageUrl;
    private String resolutionNotes;
    private String resolutionImageUrl;

    // Users
    private Long createdById;
    private String createdByName;
    private String createdByEmail;
    private String createdByDepartment;
    private String createdByPhone;

    private Long assignedStaffId;
    private String assignedStaffName;
    private String assignedStaffEmail;
    private String assignedStaffDepartment;

    private Long assignedAdminId;
    private String assignedAdminName;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    // Timeline steps info
    private LocalDateTime reportedTime;
    private LocalDateTime assignedTime;
    private LocalDateTime inProgressTime;
    private LocalDateTime resolvedTime;
    private LocalDateTime closedTime;

    // Nested relations
    private List<AssignmentDTO> assignments = new ArrayList<>();
    private List<IssueHistoryDTO> history = new ArrayList<>();
    private List<CommentDTO> comments = new ArrayList<>();

    public IssueDetailDTO() {
    }

    public static IssueDetailDTO fromEntity(Issue issue) {
        if (issue == null) return null;
        IssueDetailDTO dto = new IssueDetailDTO();
        dto.setId(issue.getId());
        dto.setIssueCode(issue.getIssueCode());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setCategory(issue.getCategory());
        dto.setCategoryDisplayName(issue.getCategory() != null ? issue.getCategory().getDisplayName() : null);
        dto.setPriority(issue.getPriority());
        dto.setStatus(issue.getStatus());
        dto.setLocation(issue.getLocation());
        dto.setImageUrl(issue.getImageUrl());
        dto.setResolutionNotes(issue.getResolutionNotes());
        dto.setResolutionImageUrl(issue.getResolutionImageUrl());

        if (issue.getCreatedBy() != null) {
            dto.setCreatedById(issue.getCreatedBy().getId());
            dto.setCreatedByName(issue.getCreatedBy().getName());
            dto.setCreatedByEmail(issue.getCreatedBy().getEmail());
            dto.setCreatedByDepartment(issue.getCreatedBy().getDepartment());
            dto.setCreatedByPhone(issue.getCreatedBy().getPhone());
        }

        if (issue.getAssignedStaff() != null) {
            dto.setAssignedStaffId(issue.getAssignedStaff().getId());
            dto.setAssignedStaffName(issue.getAssignedStaff().getName());
            dto.setAssignedStaffEmail(issue.getAssignedStaff().getEmail());
            dto.setAssignedStaffDepartment(issue.getAssignedStaff().getDepartment());
        }

        if (issue.getAssignedAdmin() != null) {
            dto.setAssignedAdminId(issue.getAssignedAdmin().getId());
            dto.setAssignedAdminName(issue.getAssignedAdmin().getName());
        }

        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());
        dto.setResolvedAt(issue.getResolvedAt());
        dto.setClosedAt(issue.getClosedAt());

        dto.setReportedTime(issue.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIssueCode() {
        return issueCode;
    }

    public void setIssueCode(String issueCode) {
        this.issueCode = issueCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IssueCategory getCategory() {
        return category;
    }

    public void setCategory(IssueCategory category) {
        this.category = category;
    }

    public String getCategoryDisplayName() {
        return categoryDisplayName;
    }

    public void setCategoryDisplayName(String categoryDisplayName) {
        this.categoryDisplayName = categoryDisplayName;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public IssueStatus getStatus() {
        return status;
    }

    public void setStatus(IssueStatus status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public String getResolutionImageUrl() {
        return resolutionImageUrl;
    }

    public void setResolutionImageUrl(String resolutionImageUrl) {
        this.resolutionImageUrl = resolutionImageUrl;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public String getCreatedByDepartment() {
        return createdByDepartment;
    }

    public void setCreatedByDepartment(String createdByDepartment) {
        this.createdByDepartment = createdByDepartment;
    }

    public String getCreatedByPhone() {
        return createdByPhone;
    }

    public void setCreatedByPhone(String createdByPhone) {
        this.createdByPhone = createdByPhone;
    }

    public Long getAssignedStaffId() {
        return assignedStaffId;
    }

    public void setAssignedStaffId(Long assignedStaffId) {
        this.assignedStaffId = assignedStaffId;
    }

    public String getAssignedStaffName() {
        return assignedStaffName;
    }

    public void setAssignedStaffName(String assignedStaffName) {
        this.assignedStaffName = assignedStaffName;
    }

    public String getAssignedStaffEmail() {
        return assignedStaffEmail;
    }

    public void setAssignedStaffEmail(String assignedStaffEmail) {
        this.assignedStaffEmail = assignedStaffEmail;
    }

    public String getAssignedStaffDepartment() {
        return assignedStaffDepartment;
    }

    public void setAssignedStaffDepartment(String assignedStaffDepartment) {
        this.assignedStaffDepartment = assignedStaffDepartment;
    }

    public Long getAssignedAdminId() {
        return assignedAdminId;
    }

    public void setAssignedAdminId(Long assignedAdminId) {
        this.assignedAdminId = assignedAdminId;
    }

    public String getAssignedAdminName() {
        return assignedAdminName;
    }

    public void setAssignedAdminName(String assignedAdminName) {
        this.assignedAdminName = assignedAdminName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public LocalDateTime getReportedTime() {
        return reportedTime;
    }

    public void setReportedTime(LocalDateTime reportedTime) {
        this.reportedTime = reportedTime;
    }

    public LocalDateTime getAssignedTime() {
        return assignedTime;
    }

    public void setAssignedTime(LocalDateTime assignedTime) {
        this.assignedTime = assignedTime;
    }

    public LocalDateTime getInProgressTime() {
        return inProgressTime;
    }

    public void setInProgressTime(LocalDateTime inProgressTime) {
        this.inProgressTime = inProgressTime;
    }

    public LocalDateTime getResolvedTime() {
        return resolvedTime;
    }

    public void setResolvedTime(LocalDateTime resolvedTime) {
        this.resolvedTime = resolvedTime;
    }

    public LocalDateTime getClosedTime() {
        return closedTime;
    }

    public void setClosedTime(LocalDateTime closedTime) {
        this.closedTime = closedTime;
    }

    public List<AssignmentDTO> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<AssignmentDTO> assignments) {
        this.assignments = assignments;
    }

    public List<IssueHistoryDTO> getHistory() {
        return history;
    }

    public void setHistory(List<IssueHistoryDTO> history) {
        this.history = history;
    }

    public List<CommentDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }
}
