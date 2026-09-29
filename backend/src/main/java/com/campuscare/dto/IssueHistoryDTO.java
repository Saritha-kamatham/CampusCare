package com.campuscare.dto;

import com.campuscare.entity.IssueHistory;
import com.campuscare.entity.IssueStatus;
import com.campuscare.entity.Role;
import java.time.LocalDateTime;

public class IssueHistoryDTO {

    private Long id;
    private Long issueId;
    private Long changedById;
    private String changedByName;
    private Role changedByRole;
    private IssueStatus oldStatus;
    private IssueStatus newStatus;
    private String note;
    private LocalDateTime changedAt;

    public IssueHistoryDTO() {
    }

    public static IssueHistoryDTO fromEntity(IssueHistory history) {
        if (history == null) return null;
        IssueHistoryDTO dto = new IssueHistoryDTO();
        dto.setId(history.getId());
        dto.setIssueId(history.getIssue() != null ? history.getIssue().getId() : null);
        if (history.getChangedBy() != null) {
            dto.setChangedById(history.getChangedBy().getId());
            dto.setChangedByName(history.getChangedBy().getName());
            dto.setChangedByRole(history.getChangedBy().getRole());
        }
        dto.setOldStatus(history.getOldStatus());
        dto.setNewStatus(history.getNewStatus());
        dto.setNote(history.getNote());
        dto.setChangedAt(history.getChangedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIssueId() {
        return issueId;
    }

    public void setIssueId(Long issueId) {
        this.issueId = issueId;
    }

    public Long getChangedById() {
        return changedById;
    }

    public void setChangedById(Long changedById) {
        this.changedById = changedById;
    }

    public String getChangedByName() {
        return changedByName;
    }

    public void setChangedByName(String changedByName) {
        this.changedByName = changedByName;
    }

    public Role getChangedByRole() {
        return changedByRole;
    }

    public void setChangedByRole(Role changedByRole) {
        this.changedByRole = changedByRole;
    }

    public IssueStatus getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(IssueStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public IssueStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(IssueStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}
