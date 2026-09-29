package com.campuscare.service;

import com.campuscare.dto.*;
import com.campuscare.entity.*;
import com.campuscare.exception.BadRequestException;
import com.campuscare.exception.ResourceNotFoundException;
import com.campuscare.repository.IssueRepository;
import com.campuscare.repository.UserRepository;
import com.campuscare.security.JwtTokenProvider;
import com.campuscare.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final IssueRepository issueRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public UserService(UserRepository userRepository,
                       IssueRepository issueRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.issueRepository = issueRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_STUDENT;

        User user = new User(
                request.getName(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                role
        );
        user.setPhone(request.getPhone());
        user.setDepartment(request.getDepartment());
        user = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getDepartment(), user.getPhone(), user.getProfileImageUrl());
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getDepartment(), user.getPhone(), user.getProfileImageUrl());
    }

    @Transactional
    public UserDTO createStaff(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        User staff = new User(
                request.getName(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                Role.ROLE_STAFF
        );
        staff.setPhone(request.getPhone());
        staff.setDepartment(request.getDepartment());
        staff = userRepository.save(staff);

        return UserDTO.fromEntity(staff);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        UserDTO dto = UserDTO.fromEntity(user);
        if (user.getRole() == Role.ROLE_STAFF) {
            dto.setAssignedIssueCount(issueRepository.countByAssignedStaffId(userId));
            dto.setResolvedIssueCount(issueRepository.countByAssignedStaffIdAndStatus(userId, IssueStatus.RESOLVED) +
                    issueRepository.countByAssignedStaffIdAndStatus(userId, IssueStatus.CLOSED));
        }
        return dto;
    }

    @Transactional
    public UserDTO updateProfile(Long userId, UserDTO updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (updates.getName() != null && !updates.getName().trim().isEmpty()) {
            user.setName(updates.getName().trim());
        }
        if (updates.getPhone() != null) {
            user.setPhone(updates.getPhone().trim());
        }
        if (updates.getDepartment() != null) {
            user.setDepartment(updates.getDepartment().trim());
        }
        if (updates.getProfileImageUrl() != null) {
            user.setProfileImageUrl(updates.getProfileImageUrl());
        }

        user = userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getStaffMembers() {
        return userRepository.findByRole(Role.ROLE_STAFF).stream()
                .map(staff -> {
                    UserDTO dto = UserDTO.fromEntity(staff);
                    dto.setAssignedIssueCount(issueRepository.countByAssignedStaffId(staff.getId()));
                    dto.setResolvedIssueCount(issueRepository.countByAssignedStaffIdAndStatus(staff.getId(), IssueStatus.RESOLVED) +
                            issueRepository.countByAssignedStaffIdAndStatus(staff.getId(), IssueStatus.CLOSED));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> searchUsers(Role role, String search, Pageable pageable) {
        return userRepository.searchUsers(role, search, pageable)
                .map(user -> {
                    UserDTO dto = UserDTO.fromEntity(user);
                    if (user.getRole() == Role.ROLE_STAFF) {
                        dto.setAssignedIssueCount(issueRepository.countByAssignedStaffId(user.getId()));
                        dto.setResolvedIssueCount(issueRepository.countByAssignedStaffIdAndStatus(user.getId(), IssueStatus.RESOLVED) +
                                issueRepository.countByAssignedStaffIdAndStatus(user.getId(), IssueStatus.CLOSED));
                    }
                    return dto;
                });
    }

    @Transactional
    public void toggleUserActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }
}
