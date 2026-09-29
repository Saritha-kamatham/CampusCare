package com.campuscare.service;

import com.campuscare.dto.*;
import com.campuscare.entity.*;
import com.campuscare.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("h2")
@Transactional
public class IssueServiceTest {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testCreateIssue() {
        User student = userRepository.findByEmail("student1@campuscare.com").orElseThrow();

        CreateIssueRequest request = new CreateIssueRequest();
        request.setTitle("Elevator #2 in Science Hall stopped between floors");
        request.setDescription("Elevator motor seized up and alarm button activated.");
        request.setCategory(IssueCategory.ELECTRICAL);
        request.setPriority(Priority.CRITICAL);
        request.setLocation("Science Hall, Floor 3");

        IssueDetailDTO issue = issueService.createIssue(request, student.getId());

        assertNotNull(issue);
        assertNotNull(issue.getId());
        assertTrue(issue.getIssueCode().startsWith("CC-"));
        assertEquals("Elevator #2 in Science Hall stopped between floors", issue.getTitle());
        assertEquals(IssueStatus.REPORTED, issue.getStatus());
        assertEquals(1, issue.getHistory().size());
        assertEquals(IssueStatus.REPORTED, issue.getHistory().get(0).getNewStatus());
    }

    @Test
    void testAssignAndAcceptWorkflow() {
        User admin = userRepository.findByEmail("admin@campuscare.com").orElseThrow();
        User staff = userRepository.findByEmail("staff1@campuscare.com").orElseThrow();
        User student = userRepository.findByEmail("student2@campuscare.com").orElseThrow();

        // 1. Create issue
        CreateIssueRequest createReq = new CreateIssueRequest();
        createReq.setTitle("Leaking water pipe in cafeteria kitchen");
        createReq.setDescription("Major water pipe burst under the main sink.");
        createReq.setCategory(IssueCategory.HOSTEL);
        createReq.setPriority(Priority.HIGH);
        createReq.setLocation("Main Dining Hall Kitchen");

        IssueDetailDTO created = issueService.createIssue(createReq, student.getId());
        Long issueId = created.getId();

        // 2. Admin assigns to staff
        AssignIssueRequest assignReq = new AssignIssueRequest(staff.getId(), "Please inspect urgently");
        IssueDetailDTO assigned = issueService.assignIssue(issueId, assignReq, admin.getId());

        assertEquals(IssueStatus.ASSIGNED, assigned.getStatus());
        assertEquals(staff.getId(), assigned.getAssignedStaffId());

        // 3. Staff accepts assignment -> IN_PROGRESS
        IssueDetailDTO inProgress = issueService.acceptIssue(issueId, staff.getId());
        assertEquals(IssueStatus.IN_PROGRESS, inProgress.getStatus());

        // 4. Staff resolves issue
        StatusUpdateRequest resolveReq = new StatusUpdateRequest(IssueStatus.RESOLVED, "Replaced gasket and pressure seal");
        IssueDetailDTO resolved = issueService.updateStatus(issueId, resolveReq, staff.getId());

        assertEquals(IssueStatus.RESOLVED, resolved.getStatus());
        assertNotNull(resolved.getResolvedAt());
        assertEquals("Replaced gasket and pressure seal", resolved.getResolutionNotes());
        assertTrue(resolved.getHistory().size() >= 4);
    }
}
