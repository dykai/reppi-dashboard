import { Athlete, User, buildAthleteName } from '../types/user';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-001',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada.lovelace@example.com',
    registeredDate: new Date('2026-01-10'),
  },
  {
    id: 'user-002',
    firstName: 'Grace',
    lastName: 'Hopper',
    email: 'grace.hopper@example.com',
    registeredDate: new Date('2026-01-18'),
  },
  {
    id: 'user-003',
    firstName: 'Katherine',
    lastName: 'Johnson',
    email: 'katherine.johnson@example.com',
    registeredDate: new Date('2026-02-04'),
  },
];

export const INITIAL_ATHLETES: Athlete[] = [
  {
    id: 'ath-001',
    userId: 'user-001',
    competitionId: 'comp-001',
    divisionIndex: 1,
    name: buildAthleteName(INITIAL_USERS[0]),
    boxName: 'Byte Sprinter',
  },
  {
    id: 'ath-002',
    userId: 'user-001',
    competitionId: 'comp-002',
    divisionIndex: 2,
    name: buildAthleteName(INITIAL_USERS[0]),
    boxName: 'Algorithm Arrow',
  },
  {
    id: 'ath-003',
    userId: 'user-002',
    competitionId: 'comp-004',
    divisionIndex: 1,
    name: buildAthleteName(INITIAL_USERS[1]),
    boxName: 'Kernel Queen',
  },
  {
    id: 'ath-004',
    userId: 'user-003',
    competitionId: 'comp-004',
    divisionIndex: 2,
    name: buildAthleteName(INITIAL_USERS[2]),
    boxName: 'Trajectory Titan',
  },
];