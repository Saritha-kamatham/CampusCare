import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const addToast = (notification) => {
    const id = Date.now() + Math.random();
    const newToast = { ...notification, toastId: id };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  };

  const dismissToast = (toastId) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  };

  // Setup WebSocket / STOMP connection when user logs in
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      setConnected(false);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    const rawWsBase = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || '';
    const wsUrl = rawWsBase ? `${rawWsBase.replace(/\/+$/, '')}/ws` : '/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.log('[STOMP]:', str);
      },
    });

    client.onConnect = (frame) => {
      setConnected(true);

      // Subscribe to user-specific private notification topic
      client.subscribe(`/topic/notifications/${user.id}`, (message) => {
        try {
          const payload = JSON.parse(message.body);
          setNotifications((prev) => [payload, ...prev]);
          setUnreadCount((prev) => prev + 1);
          addToast(payload);
        } catch (e) {
          console.error('Failed to parse STOMP message:', e);
        }
      });

      // Role specific broadcasts
      if (user.role === 'ROLE_ADMIN') {
        client.subscribe('/topic/admin/notifications', (message) => {
          try {
            const payload = JSON.parse(message.body);
            setNotifications((prev) => [payload, ...prev]);
            setUnreadCount((prev) => prev + 1);
            addToast(payload);
          } catch (e) {
            console.error('Failed to parse admin STOMP message:', e);
          }
        });
      } else if (user.role === 'ROLE_STAFF') {
        client.subscribe('/topic/staff/notifications', (message) => {
          try {
            const payload = JSON.parse(message.body);
            setNotifications((prev) => [payload, ...prev]);
            setUnreadCount((prev) => prev + 1);
            addToast(payload);
          } catch (e) {
            console.error('Failed to parse staff STOMP message:', e);
          }
        });
      }
    };

    client.onDisconnect = () => {
      setConnected(false);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [isAuthenticated, user?.id]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        connected,
        dismissToast,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
