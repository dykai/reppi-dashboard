import { useMemo, useState } from 'react';
import { Competition } from '../types/competition';
import { Athlete, User } from '../types/user';

interface CompetitionUsersPanelProps {
  competition: Competition;
  users: User[];
  athletes: Athlete[];
}

export default function CompetitionUsersPanel({
  competition,
  users,
  athletes,
}: CompetitionUsersPanelProps) {
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');

  const usersById = new Map(users.map((user) => [user.id, user]));
  const normalizedSearch = search.trim().toLowerCase();

  const sortedDivisions = useMemo(
    () => [...competition.divisions].sort((a, b) => a.index - b.index),
    [competition.divisions],
  );

  const competitionAthletes = athletes.filter((athlete) => athlete.competitionId === competition.id);
  const divisionFilteredAthletes =
    divisionFilter === 'all'
      ? competitionAthletes
      : competitionAthletes.filter((athlete) => athlete.divisionIndex === Number(divisionFilter));

  function matchesUserSearch(user: User): boolean {
    if (!normalizedSearch) {
      return true;
    }

    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(normalizedSearch) || user.email.toLowerCase().includes(normalizedSearch);
  }

  const competitionUserIds = Array.from(new Set(divisionFilteredAthletes.map((athlete) => athlete.userId)));
  const competitionUsers = competitionUserIds
    .map((userId) => usersById.get(userId))
    .filter((user): user is User => Boolean(user))
    .filter(matchesUserSearch);

  const hasActiveFilters = normalizedSearch.length > 0 || divisionFilter !== 'all';

  function clearFilters() {
    setSearch('');
    setDivisionFilter('all');
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Athletes</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Division Filter</label>
          <select
            value={divisionFilter}
            onChange={(event) => setDivisionFilter(event.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="all">All Divisions</option>
            {sortedDivisions.map((division) => (
              <option key={division.index} value={String(division.index)}>
                {division.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-900">
          Athletes in Competition ({competitionUsers.length})
        </h4>
        {competitionUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No athletes enrolled in this competition.</p>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
            {competitionUsers.map((user) => (
              <div key={user.id} className="px-3 py-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {divisionFilteredAthletes.filter((athlete) => athlete.userId === user.id).length} athlete entry(s)
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}