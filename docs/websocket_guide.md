# CampusCare Real-Time WebSocket & STOMP Architecture

The CampusCare platform features an event-driven real-time notification engine built with Spring Boot WebSocket and STOMP message broker.

---

## 1. Connection Architecture

```
  React Client (Browser)
          |
  SockJS / STOMP Client
          |
  ws://localhost:8080/ws
          |
  Spring Boot Simple Broker
          |
  SimpMessagingTemplate
          |
  [Topic: /topic/notifications/{userId}]
```

- **Connection URL**: `http://localhost:8080/ws` (with SockJS fallback) or `ws://localhost:8080/ws`
- **Application Destination Prefix**: `/app`
- **Broker Destinations**: `/topic`, `/queue`

---

## 2. Topic Subscriptions

### 2.1 Private User Notifications
- **Destination**: `/topic/notifications/{userId}`
- **Subscribed by**: The connected user (Student, Staff, or Admin)
- **Events delivered**:
  - Issue status changes (`ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
  - Staff assignment alerts
  - Comment notifications

### 2.2 Administrative Broadcast Stream
- **Destination**: `/topic/admin/notifications`
- **Subscribed by**: Connected users with `ROLE_ADMIN`
- **Events delivered**:
  - New issue reported by students (`NEW_ISSUE`)
  - Escalated critical incidents

### 2.3 Staff Broadcast Stream
- **Destination**: `/topic/staff/notifications`
- **Subscribed by**: Connected users with `ROLE_STAFF`
- **Events delivered**:
  - New tasks assigned to departmental staff
  - Urgent campus facility repairs

---

## 3. STOMP Message Payload Format

```json
{
  "id": 42,
  "issueId": 18,
  "issueCode": "CC-2026-1001",
  "title": "New Issue Assigned",
  "message": "New issue #CC-2026-1001 (Wi-Fi not working in CSE Lab 2) has been assigned to you.",
  "type": "ISSUE_ASSIGNED",
  "isRead": false,
  "createdAt": "2026-09-29T11:45:00"
}
```

---

## 4. Frontend Integration Pattern

In React (`src/context/NotificationContext.jsx`):

```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  webSocketFactory: () => new SockJS('/ws'),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

client.onConnect = () => {
  // Subscribe to user private channel
  client.subscribe(`/topic/notifications/${user.id}`, (message) => {
    const payload = JSON.parse(message.body);
    // 1. Append to notification list
    // 2. Increment unread counter on navbar
    // 3. Render animated toast alert popup
  });
};

client.activate();
```
