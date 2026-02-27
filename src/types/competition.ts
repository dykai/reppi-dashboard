export type CompetitionCategory = 'Online Competition' | 'Live Competition';

export interface Competition {
  id: string;
  name: string;
  sku: string;
  category: CompetitionCategory;
  price: number;
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
