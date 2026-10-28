import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusBadgeStyle } from '../../utils/formatters';

export const StatusBadge = ({ status }) => {
  const style = getStatusBadgeStyle(status);
  const label = status ? status.replace('_', ' ') : 'UNKNOWN';

  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      <View style={[styles.dot, { backgroundColor: style.text }]} />
      <Text style={[styles.text, { color: style.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
