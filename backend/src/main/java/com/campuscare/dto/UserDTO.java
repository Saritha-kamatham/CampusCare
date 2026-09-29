package com.campuscare.dto;

import com.campuscare.entity.Role;
import com.campuscare.entity.User;
import java.time.LocalDateTime;

public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String department;
    private String profileImageUrl;
    private boolean active;
    private LocalDateTime createdAt;
    private long assignedIssueCount;
    private long resolvedIssueCount;

    public UserDTO() {
    }

    public static UserDTO fromEntity(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        dto.setDepartment(user.getDepartment());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getAssignedIssueCount() {
        return assignedIssueCount;
    }

    public void setAssignedIssueCount(long assignedIssueCount) {
        this.assignedIssueCount = assignedIssueCount;
    }

    public long getResolvedIssueCount() {
        return resolvedIssueCount;
    }

    public void setResolvedIssueCount(long resolvedIssueCount) {
        this.resolvedIssueCount = resolvedIssueCount;
    }
}
