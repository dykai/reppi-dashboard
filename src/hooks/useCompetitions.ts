import { useState, useEffect, useCallback } from 'react';
import {
  ALL_COMPETITION_STATUSES,
  ALL_COMPETITION_VISIBILITY,
  ALL_ENROLLMENT_TYPES,
  Competition,
  CompetitionCategory,
  CompetitionStats,
  Division,
  NewCompetitionForm,
} from '../types/competition';
import { INITIAL_COMPETITIONS } from '../data/competitions';

const STORAGE_KEY = 'reppi_competitions_v1';
const STORAGE_RESET_KEY = 'reppi_competitions_reset_version';
const STORAGE_RESET_VERSION = '2026-02-27-competition-model-reset';

const COMPETITION_CATEGORIES: CompetitionCategory[] = ['Online Competition', 'Live Competition'];

function isCompetitionCategory(category: string): category is CompetitionCategory {
  return COMPETITION_CATEGORIES.includes(category as CompetitionCategory);
}

function normalizeDivisions(divisions: Division[]): Division[] {
  return (Array.isArray(divisions) ? divisions : [])
    .map((division, index) => ({
      name: division?.name?.trim() || `Division ${index + 1}`,
      enrollmentOpen: Boolean(division?.enrollmentOpen),
      maxAthletes: Math.max(0, Math.trunc(Number(division?.maxAthletes) || 0)),
      enrolledAthletes: Math.max(
        0,
        Math.min(
          Math.max(0, Math.trunc(Number(division?.maxAthletes) || 0)),
          Math.trunc(Number(division?.enrolledAthletes) || 0),
        ),
      ),
      fee: Math.max(0, Math.trunc(Number(division?.fee) || 0)),
      teamSize: Math.max(1, Math.trunc(Number(division?.teamSize) || 1)),
      index: Math.max(1, Math.trunc(Number(division?.index) || index + 1)),
    }))
    .sort((a, b) => a.index - b.index);
}

function normalizeCompetition(item: Competition): Competition {
  const teamSizeValue = Number(item.teamSize);

  return {
    ...item,
    enrollmentType: ALL_ENROLLMENT_TYPES.includes(item.enrollmentType)
      ? item.enrollmentType
      : 'paid',
    organizer: item.organizer?.trim() ?? '',
    sport: item.sport?.trim() ?? '',
    teamSize: Number.isInteger(teamSizeValue) && teamSizeValue > 0 ? teamSizeValue : 1,
    status: ALL_COMPETITION_STATUSES.includes(item.status) ? item.status : 'pending',
    enrollmentOpen: Boolean(item.enrollmentOpen),
    enrollmentPeriodStart: item.enrollmentPeriodStart || undefined,
    enrollmentPeriodEnd: item.enrollmentPeriodEnd || undefined,
    visibility: ALL_COMPETITION_VISIBILITY.includes(item.visibility) ? item.visibility : 'Public',
    divisions: normalizeDivisions(item.divisions),
  };
}

function cloneInitialCompetitions(): Competition[] {
  return INITIAL_COMPETITIONS.map((competition) => ({
    ...competition,
    divisions: competition.divisions.map((division) => ({ ...division })),
  }));
}

function sanitizeCompetitions(items: Competition[]): Competition[] {
  return items
    .filter((item) => isCompetitionCategory(item.category))
    .map((item) => normalizeCompetition(item));
}

function resetStorageToInitial(): Competition[] {
  const seeded = cloneInitialCompetitions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  localStorage.setItem(STORAGE_RESET_KEY, STORAGE_RESET_VERSION);
  return seeded;
}

function loadFromStorage(): Competition[] {
  try {
    const resetVersion = localStorage.getItem(STORAGE_RESET_KEY);
    if (resetVersion !== STORAGE_RESET_VERSION) {
      return resetStorageToInitial();
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Competition[];
      const sanitized = sanitizeCompetitions(parsed);
      if (sanitized.length > 0) {
        return sanitized;
      }
      return resetStorageToInitial();
    }
  } catch {
    // ignore
  }
  return resetStorageToInitial();
}

function saveToStorage(competitions: Competition[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(competitions));
}

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error';
};

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>(loadFromStorage);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    saveToStorage(competitions);
  }, [competitions]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const addCompetition = useCallback(
    (form: NewCompetitionForm) => {
      const competition: Competition = {
        id: `comp-${Date.now()}`,
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        category: form.category,
        price: parseFloat(form.price),
        vat: form.vat ? parseFloat(form.vat) : undefined,
        enrollmentType: form.enrollmentType,
        organizer: form.organizer.trim(),
        sport: form.sport.trim(),
        teamSize: Math.max(1, parseInt(form.teamSize, 10) || 1),
        status: form.status,
        enrollmentOpen: form.enrollmentOpen,
        enrollmentPeriodStart: form.enrollmentPeriodStart || undefined,
        enrollmentPeriodEnd: form.enrollmentPeriodEnd || undefined,
        visibility: form.visibility,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        description: form.description.trim() || undefined,
        divisions: normalizeDivisions(form.divisions),
      };
      setCompetitions((prev) => [competition, ...prev]);
      addToast(`"${competition.name}" added.`);
    },
    [addToast],
  );

  const updateCompetitionDivisions = useCallback(
    (competitionId: string, divisions: Division[]) => {
      const normalized = normalizeDivisions(divisions);

      setCompetitions((prev) =>
        prev.map((competition) =>
          competition.id === competitionId ? { ...competition, divisions: normalized } : competition,
        ),
      );

      const competitionName =
        competitions.find((competition) => competition.id === competitionId)?.name ?? 'Competition';
      addToast(`"${competitionName}" divisions updated.`);
    },
    [addToast, competitions],
  );

  const deleteCompetition = useCallback(
    (id: string) => {
      setCompetitions((prev) => {
        const target = prev.find((competition) => competition.id === id);
        const next = prev.filter((competition) => competition.id !== id);
        if (target) addToast(`"${target.name}" removed.`);
        return next;
      });
    },
    [addToast],
  );

  const stats: CompetitionStats = {
    totalCompetitions: competitions.length,
    totalEntryFees: competitions.reduce((sum, competition) => sum + competition.price, 0),
    onlineCompetitions: competitions.filter((competition) => competition.category === 'Online Competition').length,
    liveCompetitions: competitions.filter((competition) => competition.category === 'Live Competition').length,
  };

  return {
    competitions,
    stats,
    toasts,
    addCompetition,
    deleteCompetition,
    updateCompetitionDivisions,
  };
}
