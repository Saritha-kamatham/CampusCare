package com.campuscare.controller;

import com.campuscare.dto.DashboardStatsDTO;
import com.campuscare.security.UserPrincipal;
import com.campuscare.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentController {

    private final AnalyticsService analyticsService;

    @Autowired
    public StudentController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getStudentDashboardStats(@AuthenticationPrincipal UserPrincipal principal) {
        DashboardStatsDTO stats = analyticsService.getStudentDashboardStats(principal.getId());
        return ResponseEntity.ok(stats);
    }
}
