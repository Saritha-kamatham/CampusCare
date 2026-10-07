import React from 'react';
import { IssueTimeline } from './IssueTimeline';

export const StatusStepper = ({ issue, ticket, ...props }) => {
  return <IssueTimeline issue={ticket || issue} {...props} />;
};

export default StatusStepper;
