package com.campuscare.controller;

import com.campuscare.dto.AnalyticsDTO;
import com.campuscare.dto.DashboardStatsDTO;
import com.campuscare.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        DashboardStatsDTO dashboardStats = analyticsService.getAdminDashboardStats();
        AnalyticsDTO analytics = analyticsService.getAdminAnalytics();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIssues", dashboardStats.getTotalIssues());
        summary.put("reportedIssues", dashboardStats.getReportedIssues());
        summary.put("assignedIssues", dashboardStats.getAssignedIssues());
        summary.put("inProgressIssues", dashboardStats.getInProgressIssues());
        summary.put("resolvedIssues", dashboardStats.getResolvedIssues());
        summary.put("closedIssues", dashboardStats.getClosedIssues());
        summary.put("criticalIssues", dashboardStats.getCriticalIssues());
        summary.put("totalUsers", dashboardStats.getTotalUsers());
        summary.put("totalStudents", dashboardStats.getTotalStudents());
        summary.put("totalStaff", dashboardStats.getTotalStaff());
        summary.put("resolutionRate", analytics.getResolutionRate());
        summary.put("averageResolutionHours", analytics.getAverageResolutionHours());
        summary.put("categoryDistribution", analytics.getCategoryDistribution());
        summary.put("priorityDistribution", analytics.getPriorityDistribution());
        summary.put("statusDistribution", analytics.getStatusDistribution());
        summary.put("staffWorkload", analytics.getStaffWorkload());
        summary.put("trendData", analytics.getTrendData());

        return ResponseEntity.ok(summary);
    }
}
