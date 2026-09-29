package com.campuscare.controller;

import com.campuscare.dto.*;
import com.campuscare.entity.IssueCategory;
import com.campuscare.entity.IssueStatus;
import com.campuscare.entity.Priority;
import com.campuscare.entity.Role;
import com.campuscare.security.UserPrincipal;
import com.campuscare.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;

    @Autowired
    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping
    public ResponseEntity<IssueDetailDTO> createIssue(
            @Valid @RequestBody CreateIssueRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        IssueDetailDTO created = issueService.createIssue(request, principal.getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<IssueSummaryDTO>> getIssues(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long staffId,
            @RequestParam(required = false) IssueCategory category,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @AuthenticationPrincipal UserPrincipal principal) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // Security scoping: students can only see their own issues when studentId is passed or by default
        Long effectiveStudentId = studentId;
        Long effectiveStaffId = staffId;

        if (principal.getRole() == Role.ROLE_STUDENT) {
            effectiveStudentId = principal.getId();
        } else if (principal.getRole() == Role.ROLE_STAFF && staffId != null) {
            effectiveStaffId = staffId;
        }

        Page<IssueSummaryDTO> issues = issueService.getIssues(
                effectiveStudentId, effectiveStaffId, category, priority, status, search, pageable
        );
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueDetailDTO> getIssueDetail(@PathVariable Long id) {
        IssueDetailDTO issue = issueService.getIssueDetail(id);
        return ResponseEntity.ok(issue);
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IssueDetailDTO> assignIssue(
            @PathVariable Long id,
            @Valid @RequestBody AssignIssueRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        IssueDetailDTO updated = issueService.assignIssue(id, request, principal.getId());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<IssueDetailDTO> acceptIssue(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        IssueDetailDTO updated = issueService.acceptIssue(id, principal.getId());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/claim")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<IssueDetailDTO> claimIssue(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        IssueDetailDTO updated = issueService.claimIssue(id, principal.getId());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IssueDetailDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        IssueDetailDTO updated = issueService.updateStatus(id, request, principal.getId());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/priority")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IssueDetailDTO> updatePriority(
            @PathVariable Long id,
            @RequestParam Priority priority,
            @AuthenticationPrincipal UserPrincipal principal) {
        IssueDetailDTO updated = issueService.updatePriority(id, priority, principal.getId());
        return ResponseEntity.ok(updated);
    }
}
