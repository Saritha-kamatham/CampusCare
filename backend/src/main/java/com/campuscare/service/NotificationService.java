package com.campuscare.service;

import com.campuscare.dto.NotificationDTO;
import com.campuscare.entity.*;
import com.campuscare.exception.ResourceNotFoundException;
import com.campuscare.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public NotificationDTO sendNotification(User recipient, Issue issue, String title, String message, NotificationType type) {
        if (recipient == null) {
            return null;
        }

        Notification notification = new Notification(recipient, issue, title, message, type);
        notification = notificationRepository.save(notification);

        NotificationDTO dto = NotificationDTO.fromEntity(notification);

        try {
            // Push to user's private notification topic: /topic/notifications/{userId}
            messagingTemplate.convertAndSend("/topic/notifications/" + recipient.getId(), dto);

            // Also broadcast to admin or staff channels if applicable
            if (recipient.getRole() == Role.ROLE_ADMIN) {
                messagingTemplate.convertAndSend("/topic/admin/notifications", dto);
            } else if (recipient.getRole() == Role.ROLE_STAFF) {
                messagingTemplate.convertAndSend("/topic/staff/notifications", dto);
            }
        } catch (Exception ex) {
            logger.warn("WebSocket delivery failed (client may not be connected yet): {}", ex.getMessage());
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (notification.getUser().getId().equals(userId)) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(userId);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
