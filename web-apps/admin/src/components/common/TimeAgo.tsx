import Typography from '@mui/material/Typography';
import React from 'react';
import { fromNow } from '../../utils/date';

export default function TimeAgo({ date }: { date: Date }): React.ReactElement {
  return (
    <Typography variant='body2' style={{ opacity: .5 }}>Last saved <strong>{fromNow(date)}</strong></Typography>
  );
};