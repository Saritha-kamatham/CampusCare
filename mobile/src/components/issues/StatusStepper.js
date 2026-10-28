import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const STEPS = [
  { key: 'REPORTED', label: 'Reported', timeKey: 'reportedTime' },
  { key: 'ASSIGNED', label: 'Assigned', timeKey: 'assignedTime' },
  { key: 'IN_PROGRESS', label: 'In Progress', timeKey: 'inProgressTime' },
  { key: 'RESOLVED', label: 'Resolved', timeKey: 'resolvedTime' },
  { key: 'CLOSED', label: 'Closed', timeKey: 'closedTime' },
];

const STATUS_LEVEL = {
  REPORTED: 1,
  ASSIGNED: 2,
  IN_PROGRESS: 3,
  RESOLVED: 4,
  CLOSED: 5,
};

export const StatusStepper = ({ issue }) => {
  if (!issue) return null;
  const currentLevel = STATUS_LEVEL[issue.status] || 1;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>LIFECYCLE STATUS PROGRESSION</Text>

      <View style={styles.stepsRow}>
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentLevel;
          const isCurrent = stepNum === currentLevel;
          const isPending = stepNum > currentLevel;

          let circleBg = COLORS.cardBorder;
          let circleBorder = COLORS.cardBorder;
          let circleText = COLORS.textSubtle;

          if (isDone) {
            circleBg = COLORS.success;
            circleBorder = COLORS.successDark;
            circleText = '#ffffff';
          } else if (isCurrent) {
            circleBg = COLORS.brand;
            circleBorder = COLORS.brandLight;
            circleText = '#ffffff';
          }

          const timeVal = issue[step.timeKey];

          return (
            <View key={step.key} style={styles.stepCol}>
              <View style={[styles.circle, { backgroundColor: circleBg, borderColor: circleBorder }]}>
                <Text style={[styles.circleText, { color: circleText }]}>
                  {isDone ? '✓' : stepNum}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  isCurrent && styles.labelCurrent,
                  isDone && styles.labelDone,
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
              <Text style={styles.timeText} numberOfLines={1}>
                {timeVal ? formatDate(timeVal) : isPending ? 'Pending' : ''}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.textSubtle,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleText: {
    fontSize: 11,
    fontWeight: '800',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSubtle,
    textAlign: 'center',
  },
  labelCurrent: {
    color: COLORS.brandLight,
    fontWeight: '700',
  },
  labelDone: {
    color: COLORS.text,
  },
  timeText: {
    fontSize: 8,
    color: COLORS.textSubtle,
    marginTop: 2,
    textAlign: 'center',
  },
});
