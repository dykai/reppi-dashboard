export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registeredDate: Date;
}

export interface Athlete {
  id: string;
  userId: string;
  competitionId: string;
  divisionIndex: number;
  name: string;
  boxName: string;
}

export function buildAthleteName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName.trim()} ${user.lastName.trim()}`.trim();
}