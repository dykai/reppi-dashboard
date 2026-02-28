import { useMemo, useState } from 'react';
import { INITIAL_ATHLETES, INITIAL_USERS } from '../data/users';
import { Athlete, User, buildAthleteName } from '../types/user';

interface AddAthleteInput {
  userId: string;
  competitionId: string;
  divisionIndex: number;
  boxName: string;
}

export function useUsers(): {
  users: User[];
  athletes: Athlete[];
  addAthlete: (input: AddAthleteInput) => boolean;
} {
  const users = useMemo(() => INITIAL_USERS.map((user) => ({ ...user })), []);
  const [athletes, setAthletes] = useState<Athlete[]>(() =>
    INITIAL_ATHLETES.map((athlete) => ({ ...athlete })),
  );

  function addAthlete(input: AddAthleteInput): boolean {
    const user = users.find((entry) => entry.id === input.userId);

    if (!user) {
      return false;
    }

    const boxName = input.boxName.trim();
    if (!boxName) {
      return false;
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