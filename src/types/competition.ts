export type CompetitionCategory = 'Online Competition' | 'Live Competition';
export type EnrollmentType = 'paid' | 'free';
export type CompetitionStatus = 'pending' | 'completed' | 'active';
export type CompetitionVisibility = 'Public' | 'Private';

export interface Competition {
  id: string;
  name: string;
  sku: string;
  category: CompetitionCategory;
  price: number;
  enrollmentType: EnrollmentType;
  organizer: string;
  sport: string;
  teamSize: number;
  status: CompetitionStatus;
  enrollmentOpen: boolean;
  enrollmentPeriodStart?: string;
  enrollmentPeriodEnd?: string;
  visibility: CompetitionVisibility;
  description?: string;
  startDate?: string;
  endDate?: string;
  vat?: number;
}

export interface NewCompetitionForm {
  name: string;
  sku: string;
  category: CompetitionCategory;
  price: string;
  vat: string;
  enrollmentType: EnrollmentType;
  organizer: string;
  sport: string;
  teamSize: string;
  status: CompetitionStatus;
  enrollmentOpen: boolean;
  enrollmentPeriodStart: string;
  enrollmentPeriodEnd: string;
  visibility: CompetitionVisibility;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CompetitionStats {
  totalCompetitions: number;
  totalEntryFees: number;
  onlineCompetitions: number;
  liveCompetitions: number;
}

export const ALL_COMPETITION_CATEGORIES: CompetitionCategory[] = [
  'Online Competition',
  'Live Competition',
];

export const ALL_ENROLLMENT_TYPES: EnrollmentType[] = ['paid', 'free'];

export const ALL_COMPETITION_STATUSES: CompetitionStatus[] = ['pending', 'completed', 'active'];

export const ALL_COMPETITION_VISIBILITY: CompetitionVisibility[] = ['Public', 'Private'];
