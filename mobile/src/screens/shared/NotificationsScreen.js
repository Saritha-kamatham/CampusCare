import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../../services/notificationService';
import { formatDate } from '../../utils/formatters';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotifications();
    });
    return unsubscribe;
  }, [navigation, fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.warn('Failed to mark all as read:', err);
    }
  };

  const handleNotificationPress = async (item) => {
    if (!item.isRead) {
      try {
        await notificationService.markAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
      } catch (e) {
        console.warn('Failed to mark notification read:', e);
      }
    }

    if (item.issueId) {
      navigation.navigate('IssueDetails', { issueId: item.issueId });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTag}>SYSTEM ALERTS</Text>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderItem = ({ item }) => {
    const isUnread = !item.isRead;
    return (
      <TouchableOpacity
        style={[styles.itemCard, isUnread && styles.itemCardUnread]}
        activeOpacity={0.7}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.itemHeader}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name={isUnread ? 'notifications' : 'notifications-outline'}
              size={18}
              color={isUnread ? '#38bdf8' : '#64748b'}
            />
          </View>
          <View style={styles.itemTitleWrapper}>
            <Text style={[styles.itemTitle, isUnread && styles.itemTitleUnread]}>
              {item.title || 'Campus Update'}
            </Text>
            <Text style={styles.itemTime}>{formatDate(item.createdAt)}</Text>
          </View>
          {isUnread && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.itemMessage}>{item.message}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="notifications-off-outline" size={48} color="#334155" />
        <Text style={styles.emptyTitle}>All Caught Up</Text>
        <Text style={styles.emptySub}>You have no unread notifications or operational alerts.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>Fetching alerts...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#38bdf8"
              colors={['#0284c7']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 2,
  },
  markAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  markAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38bdf8',
  },
  itemCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    marginBottom: 10,
  },
  itemCardUnread: {
    borderColor: 'rgba(56, 189, 248, 0.35)',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconWrapper: {
    marginRight: 10,
  },
  itemTitleWrapper: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  itemTitleUnread: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  itemTime: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38bdf8',
  },
  itemMessage: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
    paddingLeft: 28,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e2e8f0',
    marginTop: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
