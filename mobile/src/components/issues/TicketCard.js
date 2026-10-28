import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { COLORS } from '../../utils/constants';

export const TicketCard = ({ issue, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.codePill}>
          <Text style={styles.codeText}>#{issue.issueCode || issue.ticketNo}</Text>
        </View>
        <View style={styles.badges}>
          <PriorityBadge priority={issue.priority} />
          <View style={{ width: 6 }} />
          <StatusBadge status={issue.status} />
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {issue.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {issue.description}
      </Text>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>📍 Location:</Text>
          <Text style={styles.footerValue} numberOfLines={1}>{issue.location || 'Campus'}</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>👤 Assignee:</Text>
          <Text style={styles.footerValue} numberOfLines={1}>
            {issue.assignedStaffName || 'Unassigned'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
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
    color: COLORS.brandLight,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    color: COLORS.textSubtle,
    fontSize: 10,
    fontWeight: '600',
  },
  footerValue: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
});
