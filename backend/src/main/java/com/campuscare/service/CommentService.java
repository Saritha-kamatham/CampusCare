package com.campuscare.service;

import com.campuscare.dto.CommentDTO;
import com.campuscare.dto.CommentRequest;
import com.campuscare.entity.*;
import com.campuscare.exception.ResourceNotFoundException;
import com.campuscare.repository.CommentRepository;
import com.campuscare.repository.IssueRepository;
import com.campuscare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Autowired
    public CommentService(CommentRepository commentRepository,
                          IssueRepository issueRepository,
                          UserRepository userRepository,
                          NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public CommentDTO addComment(Long issueId, CommentRequest request, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + issueId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Comment comment = new Comment(issue, user, request.getContent().trim());
        comment = commentRepository.save(comment);

        // Notify the relevant participants
        if (user.getRole() == Role.ROLE_STUDENT) {
            // Student commented, notify assigned staff if present
            if (issue.getAssignedStaff() != null) {
                notificationService.sendNotification(
                        issue.getAssignedStaff(),
                        issue,
                        "New Comment",
                        user.getName() + " commented on issue #" + issue.getIssueCode() + ": \"" + truncate(request.getContent(), 60) + "\"",
                        NotificationType.SYSTEM
                );
            }
        } else {
            // Staff or Admin commented, notify student
            notificationService.sendNotification(
                    issue.getCreatedBy(),
                    issue,
                    "New Comment from " + user.getName(),
                    user.getName() + " added a note on your issue #" + issue.getIssueCode(),
                    NotificationType.SYSTEM
            );
        }

        return CommentDTO.fromEntity(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getIssueComments(Long issueId) {
        return commentRepository.findByIssueIdOrderByCreatedAtAsc(issueId)
                .stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private String truncate(String str, int maxLen) {
        if (str == null) return "";
        return str.length() <= maxLen ? str : str.substring(0, maxLen) + "...";
    }
}
