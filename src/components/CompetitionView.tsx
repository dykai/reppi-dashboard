import { ArrowLeft, Package } from 'lucide-react';
import { Competition } from '../types/competition';
import { formatDateToDotted } from '../utils/date';

interface CompetitionViewProps {
  competition: Competition;
  onBack: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Online Competition': 'bg-cyan-100 text-cyan-700',
  'Live Competition': 'bg-yellow-100 text-yellow-700',
};

export default function CompetitionView({ competition, onBack }: CompetitionViewProps) {
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
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-gray-300">|</span>
        <h2 className="text-sm font-semibold text-gray-700">Competition Details</h2>
      </div>

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
      </div>
    </div>
  );
}
