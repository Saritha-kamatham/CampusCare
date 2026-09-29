package com.campuscare.dto;

import com.campuscare.entity.IssueStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "New status is required")
    private IssueStatus status;

    private String notes;

    private String resolutionImageUrl;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(IssueStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public IssueStatus getStatus() {
        return status;
    }

    public void setStatus(IssueStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getResolutionImageUrl() {
        return resolutionImageUrl;
    }

    public void setResolutionImageUrl(String resolutionImageUrl) {
        this.resolutionImageUrl = resolutionImageUrl;
    }
}
