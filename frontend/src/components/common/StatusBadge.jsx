import React from 'react';
import { StatusBadge as BaseStatusBadge, PriorityBadge, CategoryBadge } from './Badge';

export const StatusBadge = (props) => {
  return <BaseStatusBadge {...props} />;
};

export { PriorityBadge, CategoryBadge };
export default StatusBadge;
