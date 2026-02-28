import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Package, Plus, Save, Trash2 } from 'lucide-react';
import { Competition, Division } from '../types/competition';
import { formatDateToDotted } from '../utils/date';

interface CompetitionViewProps {
  competition: Competition;
  onBack: () => void;
  onUpdateDivisions: (competitionId: string, divisions: Division[]) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Online Competition': 'bg-cyan-100 text-cyan-700',
  'Live Competition': 'bg-yellow-100 text-yellow-700',
};

export default function CompetitionView({
  competition,
  onBack,
  onUpdateDivisions,
}: CompetitionViewProps) {
  const [editableDivisions, setEditableDivisions] = useState<Division[]>(competition.divisions);
  const [divisionError, setDivisionError] = useState<string | null>(null);
  const [showBackWarning, setShowBackWarning] = useState(false);

  useEffect(() => {
    setEditableDivisions(
      [...competition.divisions]
        .map((division) => ({ ...division }))
        .sort((a, b) => a.index - b.index),
    );
    setDivisionError(null);
    setShowBackWarning(false);
  }, [competition]);

  const hasDivisionChanges = useMemo(
    () => JSON.stringify(editableDivisions) !== JSON.stringify(competition.divisions),
    [editableDivisions, competition.divisions],
  );

  useEffect(() => {
    if (!hasDivisionChanges) {
      setShowBackWarning(false);
    }
  }, [hasDivisionChanges]);

  function handleBack() {
    if (hasDivisionChanges) {
      setShowBackWarning(true);
      return;
    }
    onBack();
  }

  function updateDivision(index: number, updates: Partial<Division>) {
    setEditableDivisions((prev) =>
      prev.map((division, divisionIndex) =>
        divisionIndex === index ? { ...division, ...updates } : division,
      ),
    );
    if (divisionError) setDivisionError(null);
  }

  function addDivision() {
    setEditableDivisions((prev) => [
      ...prev,
      {
        name: `Division ${prev.length + 1}`,
        enrollmentOpen: false,
        maxAthletes: 1,
        enrolledAthletes: 0,
        fee: 0,
        teamSize: 1,
        index: prev.length + 1,
      },
    ]);
    if (divisionError) setDivisionError(null);
  }

  function removeDivision(index: number) {
    setEditableDivisions((prev) =>
      prev
        .filter((_, divisionIndex) => divisionIndex !== index)
        .map((division, divisionIndex) => ({ ...division, index: divisionIndex + 1 })),
    );
    if (divisionError) setDivisionError(null);
  }

  function saveDivisions() {
    const isValid = editableDivisions.every((division) => {
      const hasName = division.name.trim().length > 0;
      const hasValidMaxAthletes = Number.isInteger(division.maxAthletes) && division.maxAthletes >= 0;
      const hasValidEnrolledAthletes =
        Number.isInteger(division.enrolledAthletes) && division.enrolledAthletes >= 0;
      const hasValidFee = Number.isInteger(division.fee) && division.fee >= 0;
      const hasValidTeamSize = Number.isInteger(division.teamSize) && division.teamSize >= 1;
      const hasValidIndex = Number.isInteger(division.index) && division.index >= 1;
      const enrollmentWithinCapacity = division.enrolledAthletes <= division.maxAthletes;
      return (
        hasName &&
        hasValidMaxAthletes &&
        hasValidEnrolledAthletes &&
        hasValidFee &&
        hasValidTeamSize &&
        hasValidIndex &&
        enrollmentWithinCapacity
      );
    });

    if (!isValid) {
      setDivisionError(
        'Each division needs a name, valid integers, and enrolled athletes cannot exceed maximum athletes.',
      );
      return;
    }

    onUpdateDivisions(
      competition.id,
      [...editableDivisions].sort((a, b) => a.index - b.index),
    );
    setDivisionError(null);
  }

  const properties = [
    { label: 'Competition ID', value: competition.id },
    { label: 'SKU', value: competition.sku },
    { label: 'Enrollment Type', value: competition.enrollmentType },
    { label: 'Organizer', value: competition.organizer },
    { label: 'Sport', value: competition.sport },
    { label: 'Team Size', value: competition.teamSize.toString() },
    { label: 'Status', value: competition.status },
    { label: 'Enrollment Open', value: competition.enrollmentOpen ? 'Yes' : 'No' },
    { label: 'Visibility', value: competition.visibility },
    ...(competition.enrollmentPeriodStart
      ? [{ label: 'Enrollment Period Start', value: formatDateToDotted(competition.enrollmentPeriodStart) }]
      : []),
    ...(competition.enrollmentPeriodEnd
      ? [{ label: 'Enrollment Period End', value: formatDateToDotted(competition.enrollmentPeriodEnd) }]
      : []),
    { label: 'Entry Fee', value: `$${competition.price.toFixed(2)}` },
    ...(competition.vat !== undefined ? [{ label: 'VAT', value: `${competition.vat}%` }] : []),
    ...(competition.startDate
      ? [{ label: 'Start Date', value: formatDateToDotted(competition.startDate) }]
      : []),
    ...(competition.endDate
      ? [{ label: 'End Date', value: formatDateToDotted(competition.endDate) }]
      : []),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-gray-300">|</span>
        <h2 className="text-sm font-semibold text-gray-700">Competition Details</h2>
      </div>

      {showBackWarning && (
        <div className="px-4 py-3 border-b border-amber-200 bg-amber-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-amber-800">
            You have unsaved division changes. Save before leaving or discard changes.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBackWarning(false)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors"
            >
              Stay
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors"
            >
              Discard & Back
            </button>
            <button
              type="button"
              onClick={saveDivisions}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Save Now
            </button>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Competition name & icon */}
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <Package className="h-8 w-8 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{competition.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[competition.category] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {competition.category}
              </span>
            </div>
          </div>
        </div>

        {/* Properties grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        {competition.description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-sm text-gray-700">{competition.description}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Divisions</p>
            <div className="flex items-center gap-2">
              {hasDivisionChanges && (
                <span className="inline-flex items-center px-2 py-1 text-[11px] font-medium rounded-full bg-amber-100 text-amber-800">
                  Unsaved changes
                </span>
              )}
              <button
                type="button"
                onClick={addDivision}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Division
              </button>
              <button
                type="button"
                onClick={saveDivisions}
                disabled={!hasDivisionChanges}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                Save Divisions
              </button>
            </div>
          </div>

          {editableDivisions.length === 0 ? (
            <p className="text-sm text-gray-500">No divisions configured.</p>
          ) : (
            editableDivisions.map((division, divisionIndex) => (
              <div key={`${division.index}-${divisionIndex}`} className="rounded-lg border border-gray-200 p-3 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Division {divisionIndex + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeDivision(divisionIndex)}
                    className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Remove division"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={division.name}
                      onChange={(e) => updateDivision(divisionIndex, { name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Index</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={division.index}
                      onChange={(e) =>
                        updateDivision(divisionIndex, {
                          index: Math.max(1, Math.trunc(Number(e.target.value) || 1)),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Enrollment Open</label>
                    <select
                      value={division.enrollmentOpen ? 'true' : 'false'}
                      onChange={(e) =>
                        updateDivision(divisionIndex, { enrollmentOpen: e.target.value === 'true' })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Max Athletes</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={division.maxAthletes}
                      onChange={(e) =>
                        updateDivision(divisionIndex, {
                          maxAthletes: Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Enrolled Athletes</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={division.enrolledAthletes}
                      onChange={(e) =>
                        updateDivision(divisionIndex, {
                          enrolledAthletes: Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Fee</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={division.fee}
                      onChange={(e) =>
                        updateDivision(divisionIndex, {
                          fee: Math.max(0, Math.trunc(Number(e.target.value) || 0)),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Team Size</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={division.teamSize}
                      onChange={(e) =>
                        updateDivision(divisionIndex, {
                          teamSize: Math.max(1, Math.trunc(Number(e.target.value) || 1)),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          {divisionError && <p className="text-xs text-rose-500">{divisionError}</p>}
        </div>
      </div>
    </div>
  );
}
