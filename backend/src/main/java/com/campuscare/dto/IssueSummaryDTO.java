package com.campuscare.dto;

import com.campuscare.entity.*;
import java.time.LocalDateTime;

public class IssueSummaryDTO {

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
    private Long createdById;
    private String createdByName;
    private Long assignedStaffId;
    private String assignedStaffName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IssueSummaryDTO() {
    }

    public static IssueSummaryDTO fromEntity(Issue issue) {
        if (issue == null) return null;
        IssueSummaryDTO dto = new IssueSummaryDTO();
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
        if (issue.getCreatedBy() != null) {
            dto.setCreatedById(issue.getCreatedBy().getId());
            dto.setCreatedByName(issue.getCreatedBy().getName());
        }
        if (issue.getAssignedStaff() != null) {
            dto.setAssignedStaffId(issue.getAssignedStaff().getId());
            dto.setAssignedStaffName(issue.getAssignedStaff().getName());
        }
        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());
        return dto;
    }

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
}
