import { useState } from 'react';
import { INITIAL_ATHLETES, INITIAL_USERS } from '../data/users';
import { Athlete, User, buildAthleteName } from '../types/user';

interface AddAthleteInput {
  userEmail: string;
  userName: string;
  competitionId: string;
  divisionIndex: number;
  boxName: string;
}

export function useUsers(): {
  users: User[];
  athletes: Athlete[];
  addAthlete: (input: AddAthleteInput) => boolean;
} {
  const [users, setUsers] = useState<User[]>(() => INITIAL_USERS.map((user) => ({ ...user })));
  const [athletes, setAthletes] = useState<Athlete[]>(() =>
    INITIAL_ATHLETES.map((athlete) => ({ ...athlete })),
  );

  function addAthlete(input: AddAthleteInput): boolean {
    const userEmail = input.userEmail.trim().toLowerCase();
    const userName = input.userName.trim();

    if (!userEmail || !userName) {
      return false;
    }

    const boxName = input.boxName.trim() || 'Unaffiliated';
    let user = users.find((entry) => entry.email.toLowerCase() === userEmail);

    if (!user) {
      const nameParts = userName.split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ');

      user = {
        id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        firstName,
        lastName,
        email: userEmail,
        registeredDate: new Date(),
      };

      setUsers((previous) => [user as User, ...previous]);
    }

    const divisionIndex = Math.max(1, Math.trunc(input.divisionIndex));
    const athlete: Athlete = {
      id: `ath-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      competitionId: input.competitionId,
      divisionIndex,
      name: buildAthleteName(user),
      boxName,
    };

    setAthletes((previous) => [athlete, ...previous]);
    return true;
  }

  return {
    users,
    athletes,
    addAthlete,
  };
}