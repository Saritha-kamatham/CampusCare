package com.campuscare.controller;

import com.campuscare.dto.CommentDTO;
import com.campuscare.dto.CommentRequest;
import com.campuscare.security.UserPrincipal;
import com.campuscare.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues/{issueId}/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long issueId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        CommentDTO comment = commentService.addComment(issueId, request, principal.getId());
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long issueId) {
        List<CommentDTO> comments = commentService.getIssueComments(issueId);
        return ResponseEntity.ok(comments);
    }
}
