import { useEffect, useState } from 'react';
import { User } from '../shared/types';

export function useUsers(): [User[] | null, boolean, string | null] {
  const [users, setPlaces] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/users').then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    }).then(({ places }) => setPlaces(places)).catch(error => {
      setError(error instanceof Error ? error.message : error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return [users, loading, error];
}