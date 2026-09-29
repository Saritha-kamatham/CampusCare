package com.campuscare.dto;

import java.util.List;

public class DashboardStatsDTO {

    // General counters
    private long totalIssues;
    private long reportedIssues;
    private long assignedIssues;
    private long inProgressIssues;
    private long resolvedIssues;
    private long closedIssues;
    private long criticalIssues;

    // Admin-specific
    private long totalUsers;
    private long totalStudents;
    private long totalStaff;

    // Staff-specific
    private long pendingAcceptance;

    // Recent lists
    private List<IssueSummaryDTO> recentIssues;
    private List<IssueSummaryDTO> unassignedIssues;

    public DashboardStatsDTO() {
    }

    public long getTotalIssues() {
        return totalIssues;
    }

    public void setTotalIssues(long totalIssues) {
        this.totalIssues = totalIssues;
    }

    public long getReportedIssues() {
        return reportedIssues;
    }

    public void setReportedIssues(long reportedIssues) {
        this.reportedIssues = reportedIssues;
    }

    public long getAssignedIssues() {
        return assignedIssues;
    }

    public void setAssignedIssues(long assignedIssues) {
        this.assignedIssues = assignedIssues;
    }

    public long getInProgressIssues() {
        return inProgressIssues;
    }

    public void setInProgressIssues(long inProgressIssues) {
        this.inProgressIssues = inProgressIssues;
    }

    public long getResolvedIssues() {
        return resolvedIssues;
    }

    public void setResolvedIssues(long resolvedIssues) {
        this.resolvedIssues = resolvedIssues;
    }

    public long getClosedIssues() {
        return closedIssues;
    }

    public void setClosedIssues(long closedIssues) {
        this.closedIssues = closedIssues;
    }

    public long getCriticalIssues() {
        return criticalIssues;
    }

    public void setCriticalIssues(long criticalIssues) {
        this.criticalIssues = criticalIssues;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public long getPendingAcceptance() {
        return pendingAcceptance;
    }

    public void setPendingAcceptance(long pendingAcceptance) {
        this.pendingAcceptance = pendingAcceptance;
    }

    public List<IssueSummaryDTO> getRecentIssues() {
        return recentIssues;
    }

    public void setRecentIssues(List<IssueSummaryDTO> recentIssues) {
        this.recentIssues = recentIssues;
    }

    public List<IssueSummaryDTO> getUnassignedIssues() {
        return unassignedIssues;
    }

    public void setUnassignedIssues(List<IssueSummaryDTO> unassignedIssues) {
        this.unassignedIssues = unassignedIssues;
    }
}
