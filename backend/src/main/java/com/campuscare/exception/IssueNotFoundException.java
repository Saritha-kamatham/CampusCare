package com.campuscare.exception;

public class IssueNotFoundException extends ResourceNotFoundException {

    public IssueNotFoundException(Long id) {
        super("Issue not found with id: " + id);
    }

    public IssueNotFoundException(String code) {
        super("Issue not found with code: " + code);
    }
}
