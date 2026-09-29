package com.campuscare.controller;

import com.campuscare.dto.*;
import com.campuscare.entity.Role;
import com.campuscare.service.AnalyticsService;
import com.campuscare.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final UserService userService;

    @Autowired
    public AdminController(AnalyticsService analyticsService, UserService userService) {
        this.analyticsService = analyticsService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getAdminDashboardStats() {
        DashboardStatsDTO stats = analyticsService.getAdminDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDTO> getAdminAnalytics() {
        AnalyticsDTO analytics = analyticsService.getAdminAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserDTO>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserDTO> users = userService.searchUsers(role, search, pageable);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/staff")
    public ResponseEntity<UserDTO> createStaff(@Valid @RequestBody RegisterRequest request) {
        UserDTO staff = userService.createStaff(request);
        return new ResponseEntity<>(staff, HttpStatus.CREATED);
    }

    @PutMapping("/users/{id}/toggle-active")
    public ResponseEntity<Map<String, String>> toggleUserActive(@PathVariable Long id) {
        userService.toggleUserActive(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User active status updated successfully");
        return ResponseEntity.ok(response);
    }
}
