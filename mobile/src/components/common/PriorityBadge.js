import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPriorityBadgeStyle } from '../../utils/formatters';

export const PriorityBadge = ({ priority }) => {
  const style = getPriorityBadgeStyle(priority);

  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Text style={[styles.text, { color: style.text }]}>{priority || 'MEDIUM'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
