import { useMemo } from 'react';
import { INITIAL_ATHLETES, INITIAL_USERS } from '../data/users';
import { Athlete, User } from '../types/user';

export function useUsers(): { users: User[]; athletes: Athlete[] } {
  const users = useMemo(() => INITIAL_USERS.map((user) => ({ ...user })), []);
  const athletes = useMemo(() => INITIAL_ATHLETES.map((athlete) => ({ ...athlete })), []);

  return {
    users,
    athletes,
  };
}