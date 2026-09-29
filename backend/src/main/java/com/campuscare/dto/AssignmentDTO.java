package com.campuscare.dto;

import com.campuscare.entity.Assignment;
import java.time.LocalDateTime;

public class AssignmentDTO {

    private Long id;
    private Long issueId;
    private Long staffId;
    private String staffName;
    private String staffDepartment;
    private Long assignedById;
    private String assignedByName;
    private LocalDateTime assignedAt;
    private String status;
    private String notes;

    public AssignmentDTO() {
    }

    public static AssignmentDTO fromEntity(Assignment assignment) {
        if (assignment == null) return null;
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(assignment.getId());
        dto.setIssueId(assignment.getIssue() != null ? assignment.getIssue().getId() : null);
        if (assignment.getStaff() != null) {
            dto.setStaffId(assignment.getStaff().getId());
            dto.setStaffName(assignment.getStaff().getName());
            dto.setStaffDepartment(assignment.getStaff().getDepartment());
        }
        if (assignment.getAssignedBy() != null) {
            dto.setAssignedById(assignment.getAssignedBy().getId());
            dto.setAssignedByName(assignment.getAssignedBy().getName());
        }
        dto.setAssignedAt(assignment.getAssignedAt());
        dto.setStatus(assignment.getStatus());
        dto.setNotes(assignment.getNotes());
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

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getStaffDepartment() {
        return staffDepartment;
    }

    public void setStaffDepartment(String staffDepartment) {
        this.staffDepartment = staffDepartment;
    }

    public Long getAssignedById() {
        return assignedById;
    }

    public void setAssignedById(Long assignedById) {
        this.assignedById = assignedById;
    }

    public String getAssignedByName() {
        return assignedByName;
    }

    public void setAssignedByName(String assignedByName) {
        this.assignedByName = assignedByName;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
