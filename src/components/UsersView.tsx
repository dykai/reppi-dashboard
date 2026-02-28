import { useMemo, useState } from 'react';
import { Athlete, User } from '../types/user';
import { formatDateToDotted } from '../utils/date';

interface UsersViewProps {
  users: User[];
  athletes: Athlete[];
}

export default function UsersView({ users, athletes }: UsersViewProps) {
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();

  const athleteStatsByUserId = useMemo(() => {
    const next = new Map<string, { athletes: number; competitions: Set<string> }>();

    athletes.forEach((athlete) => {
      const current = next.get(athlete.userId) ?? { athletes: 0, competitions: new Set<string>() };
      current.athletes += 1;
      current.competitions.add(athlete.competitionId);
      next.set(athlete.userId, current);
    });

    return next;
  }, [athletes]);

  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) => {
          if (!normalizedSearch) {
            return true;
          }

          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
          return fullName.includes(normalizedSearch) || user.email.toLowerCase().includes(normalizedSearch);
        })
        .sort((firstUser, secondUser) => {
          const firstName = `${firstUser.firstName} ${firstUser.lastName}`.toLowerCase();
          const secondName = `${secondUser.firstName} ${secondUser.lastName}`.toLowerCase();
          return firstName.localeCompare(secondName);
        }),
    [normalizedSearch, users],
  );

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500">All registered users in the system.</p>
        </div>
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Athletes</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Competitions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-400 text-sm">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const stats = athleteStatsByUserId.get(user.id);
                return (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDateToDotted(user.registeredDate.toISOString())}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{stats?.athletes ?? 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{stats?.competitions.size ?? 0}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
