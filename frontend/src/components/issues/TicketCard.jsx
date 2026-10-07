import React from 'react';
import { IssueCard } from './IssueCard';

export const TicketCard = ({ issue, ticket, ...props }) => {
  return <IssueCard issue={ticket || issue} {...props} />;
};

export default TicketCard;
