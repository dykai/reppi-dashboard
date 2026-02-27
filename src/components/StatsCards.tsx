import { Trophy, DollarSign, Wifi, Users } from 'lucide-react';
import { CompetitionStats } from '../types/competition';

interface StatsCardsProps {
  stats: CompetitionStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Competitions',
      value: stats.totalCompetitions.toLocaleString(),
      icon: Trophy,
      color: 'bg-indigo-50 text-indigo-600',
      ring: 'ring-indigo-100',
    },
    {
      label: 'Total Entry Fees',
      value: `$${stats.totalEntryFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
      ring: 'ring-emerald-100',
    },
    {
      label: 'Online Competitions',
      value: stats.onlineCompetitions.toLocaleString(),
      icon: Wifi,
      color: 'bg-amber-50 text-amber-600',
      ring: 'ring-amber-100',
    },
    {
      label: 'Live Competitions',
      value: stats.liveCompetitions.toLocaleString(),
      icon: Users,
      color: 'bg-rose-50 text-rose-600',
      ring: 'ring-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-white rounded-xl p-5 shadow-sm ring-1 ${card.ring} flex items-center gap-4`}
          >
            <div className={`p-3 rounded-xl ${card.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
