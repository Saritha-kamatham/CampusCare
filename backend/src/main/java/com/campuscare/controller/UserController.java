package com.campuscare.controller;

import com.campuscare.dto.UserDTO;
import com.campuscare.security.UserPrincipal;
import com.campuscare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserDTO user = userService.getUserProfile(principal.getId());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(
            @RequestBody UserDTO updates,
            @AuthenticationPrincipal UserPrincipal principal) {
        UserDTO updated = userService.updateProfile(principal.getId(), updates);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/staff")
    public ResponseEntity<List<UserDTO>> getStaffMembers() {
        List<UserDTO> staff = userService.getStaffMembers();
        return ResponseEntity.ok(staff);
    }
}
