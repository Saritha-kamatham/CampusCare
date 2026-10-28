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
import { useAuth } from '../../context/AuthContext';
import { issueService } from '../../services/issueService';
import { TicketCard } from '../../components/issues/TicketCard';
import { COLORS } from '../../utils/constants';

export default function StudentHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, RESOLVED
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIssues = useCallback(async () => {
    try {
      const data = await issueService.getMyIssues();
      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load student issues:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Refresh whenever screen is focused
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

  const filteredIssues = issues.filter((item) => {
    if (filter === 'ACTIVE') {
      return ['PENDING', 'ASSIGNED', 'IN_PROGRESS'].includes(item.status);
    }
    if (filter === 'RESOLVED') {
      return ['RESOLVED', 'CLOSED'].includes(item.status);
    }
    return true;
  });

  const activeCount = issues.filter((i) =>
    ['PENDING', 'ASSIGNED', 'IN_PROGRESS'].includes(i.status)
  ).length;
  const resolvedCount = issues.filter((i) =>
    ['RESOLVED', 'CLOSED'].includes(i.status)
  ).length;

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Top greeting row */}
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.welcomeText}>STUDENT DASHBOARD</Text>
          <Text style={styles.userName}>{user?.name || 'Student'}</Text>
          <Text style={styles.deptText}>{user?.department || 'Campus Department'}</Text>
        </View>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => navigation.navigate('ReportIssue')}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.newBtnText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Metric Counters */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{issues.length}</Text>
          <Text style={styles.metricLabel}>Total Filed</Text>
        </View>
        <View style={[styles.metricCard, styles.metricCardActive]}>
          <Text style={[styles.metricNumber, { color: '#38bdf8' }]}>{activeCount}</Text>
          <Text style={styles.metricLabel}>Active Work</Text>
        </View>
        <View style={[styles.metricCard, styles.metricCardResolved]}>
          <Text style={[styles.metricNumber, { color: '#10b981' }]}>{resolvedCount}</Text>
          <Text style={styles.metricLabel}>Resolved</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, filter === 'ALL' && styles.tabActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.tabText, filter === 'ALL' && styles.tabTextActive]}>
            All ({issues.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === 'ACTIVE' && styles.tabActive]}
          onPress={() => setFilter('ACTIVE')}
        >
          <Text style={[styles.tabText, filter === 'ACTIVE' && styles.tabTextActive]}>
            Active ({activeCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === 'RESOLVED' && styles.tabActive]}
          onPress={() => setFilter('RESOLVED')}
        >
          <Text style={[styles.tabText, filter === 'RESOLVED' && styles.tabTextActive]}>
            Resolved ({resolvedCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={48} color="#334155" />
        <Text style={styles.emptyTitle}>No Issues Found</Text>
        <Text style={styles.emptySub}>
          {filter === 'ALL'
            ? "You haven't reported any campus issues yet."
            : `No ${filter.toLowerCase()} issues at this moment.`}
        </Text>
        {filter === 'ALL' && (
          <TouchableOpacity
            style={styles.emptyReportBtn}
            onPress={() => navigation.navigate('ReportIssue')}
          >
            <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.emptyReportText}>Report Campus Issue</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>Fetching your tickets...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredIssues}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TicketCard
              issue={item}
              onPress={() => navigation.navigate('IssueDetails', { issueId: item.id })}
            />
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
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
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284c7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  newBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  metricCardActive: {
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  metricCardResolved: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
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
  emptyReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  emptyReportText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
