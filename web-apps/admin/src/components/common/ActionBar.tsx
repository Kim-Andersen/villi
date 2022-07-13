import React from 'react';

export default function ActionBar({children}: { children: React.ReactNode }): React.ReactElement {
  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0 32px 16px', alignItems: 'center', gap: 16 }}>
      {children}
    </header>
  );
};