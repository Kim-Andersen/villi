import React from 'react';
import { useUsers } from './useUsers';

export default function UserList() {
  const [users, loading, error] = useUsers();

  return (
    <div>
      {loading && <h4>Loading...</h4>}
      {error && <p>{error}</p>}
      {users && users.map(({ id, email }) => 
        <div key={id}>
          <h4 style={{ marginBottom: 8 }}>{email}</h4>
        </div>
      )}
    </div>
  );
}