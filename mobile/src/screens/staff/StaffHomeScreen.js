import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { issueService } from '../../services/issueService';
import { TicketCard } from '../../components/issues/TicketCard';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { COLORS } from '../../utils/constants';

export default function StaffHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ASSIGNED'); // 'ASSIGNED' | 'OPEN_QUEUE'
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [openIssues, setOpenIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchIssues = useCallback(async () => {
    try {
      const [allRes, openRes] = await Promise.all([
        issueService.getIssues(),
        issueService.getOpenIssues(),
      ]);

      const myAssigned = Array.isArray(allRes)
        ? allRes.filter((item) => item.assignedStaffId === user?.id)
        : [];
      setAssignedIssues(myAssigned);
      setOpenIssues(Array.isArray(openRes) ? openRes : []);
    } catch (err) {
      console.warn('Failed to load staff tickets:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchIssues();
    });
    return unsubscribe;
  }, [navigation, fetchIssues]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  const handleClaim = async (issue) => {
    setActionLoadingId(issue.id);
    try {
      await issueService.claimIssue(issue.id);
      Alert.alert('Ticket Claimed! 🛠️', `You have claimed ticket #${issue.issueCode || issue.id}. Status is now IN_PROGRESS.`);
      fetchIssues();
      setActiveTab('ASSIGNED');
    } catch (err) {
      console.error('Failed to claim ticket:', err);
      Alert.alert('Error', err.response?.data?.message || 'Could not claim ticket');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAccept = async (issue) => {
    setActionLoadingId(issue.id);
    try {
      await issueService.acceptIssue(issue.id);
      Alert.alert('Work Started! 🚀', `Ticket #${issue.issueCode || issue.id} is now IN_PROGRESS.`);
      fetchIssues();
    } catch (err) {
      console.error('Failed to accept ticket:', err);
      Alert.alert('Error', err.response?.data?.message || 'Could not accept ticket');
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Staff Greeting */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.roleTag}>STAFF OPERATIONS CENTER</Text>
          <Text style={styles.userName}>{user?.name || 'Operations Staff'}</Text>
          <Text style={styles.deptText}>{user?.department || 'Facilities & Maintenance'}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ASSIGNED' && styles.tabActive]}
          onPress={() => setActiveTab('ASSIGNED')}
        >
          <Ionicons
            name="construct-outline"
            size={16}
            color={activeTab === 'ASSIGNED' ? '#38bdf8' : '#64748b'}
          />
          <Text
            style={[styles.tabText, activeTab === 'ASSIGNED' && styles.tabTextActive]}
          >
            Assigned to Me ({assignedIssues.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'OPEN_QUEUE' && styles.tabActiveQueue]}
          onPress={() => setActiveTab('OPEN_QUEUE')}
        >
          <Ionicons
            name="flash"
            size={16}
            color={activeTab === 'OPEN_QUEUE' ? '#f59e0b' : '#64748b'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'OPEN_QUEUE' && styles.tabTextActiveQueue,
            ]}
          >
            ⚡ Open Queue ({openIssues.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const isActionLoading = actionLoadingId === item.id;

    if (activeTab === 'OPEN_QUEUE') {
      return (
        <View style={styles.queueCard}>
          <View style={styles.cardHeader}>
            <View style={styles.codePill}>
              <Text style={styles.codeText}>#{item.issueCode || item.ticketNo}</Text>
            </View>
            <PriorityBadge priority={item.priority} />
          </View>

          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={14} color="#64748b" />
              <Text style={styles.infoText}>{item.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="pricetag-outline" size={14} color="#64748b" />
              <Text style={styles.infoText}>{item.categoryDisplayName || item.category}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardActionRow}>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => navigation.navigate('IssueDetails', { issueId: item.id })}
            >
              <Text style={styles.detailsBtnText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.claimBtn, isActionLoading && styles.disabledBtn]}
              onPress={() => handleClaim(item)}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="hand-right-outline" size={16} color="#ffffff" />
                  <Text style={styles.claimBtnText}>Claim & Start</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Assigned tab item
    return (
      <View style={styles.assignedCardWrapper}>
        <TicketCard
          issue={item}
          onPress={() => navigation.navigate('IssueDetails', { issueId: item.id })}
        />

        {/* Quick actions on card */}
        {item.status === 'ASSIGNED' && (
          <TouchableOpacity
            style={[styles.quickActionBtn, styles.acceptBtn, isActionLoading && styles.disabledBtn]}
            onPress={() => handleAccept(item)}
            disabled={isActionLoading}
          >
            {isActionLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="play-outline" size={16} color="#ffffff" />
                <Text style={styles.quickActionText}>Accept & Begin Work</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {item.status === 'IN_PROGRESS' && (
          <TouchableOpacity
            style={[styles.quickActionBtn, styles.resolveBtn]}
            onPress={() => navigation.navigate('IssueDetails', { issueId: item.id, action: 'resolve' })}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color="#ffffff" />
            <Text style={styles.quickActionText}>Mark as Resolved</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name={activeTab === 'OPEN_QUEUE' ? 'checkmark-done-circle-outline' : 'construct-outline'}
          size={52}
          color="#334155"
        />
        <Text style={styles.emptyTitle}>
          {activeTab === 'OPEN_QUEUE' ? 'Queue is Clear! 🎉' : 'No Assigned Tickets'}
        </Text>
        <Text style={styles.emptySub}>
          {activeTab === 'OPEN_QUEUE'
            ? 'All reported campus issues have been claimed or assigned.'
            : 'You currently have no pending tasks assigned.'}
        </Text>
      </View>
    );
  };

  const currentData = activeTab === 'ASSIGNED' ? assignedIssues : openIssues;

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>Loading staff operations...</Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
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
    marginBottom: 16,
  },
  greetingRow: {
    marginBottom: 16,
  },
  roleTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1.5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 2,
  },
  deptText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  tabActiveQueue: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  tabTextActiveQueue: {
    color: '#f59e0b',
    fontWeight: '700',
  },
  assignedCardWrapper: {
    marginBottom: 12,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: -4,
    marginBottom: 12,
  },
  acceptBtn: {
    backgroundColor: '#0284c7',
  },
  resolveBtn: {
    backgroundColor: '#10b981',
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  queueCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codePill: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: '#64748b',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginBottom: 10,
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#1e293b',
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  claimBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#f59e0b',
  },
  claimBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
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
    paddingHorizontal: 24,
  },
});
