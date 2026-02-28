import { useEffect, useState } from 'react';
import { Search, Trash2, ChevronDown, Eye } from 'lucide-react';
import { ALL_COMPETITION_CATEGORIES, Competition } from '../types/competition';
import { formatDateToDotted } from '../utils/date';

interface CompetitionTableProps {
  competitions: Competition[];
  onDelete: (id: string) => void;
  onViewCompetition: (competition: Competition) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Online Competition': 'bg-cyan-100 text-cyan-700',
  'Live Competition': 'bg-yellow-100 text-yellow-700',
};

export default function CompetitionTable({
  competitions,
  onDelete,
  onViewCompetition,
}: CompetitionTableProps) {
  const PAGE_SIZE = 20;
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = competitions.filter((competition) => {
    const matchSearch =
      competition.name.toLowerCase().includes(search.toLowerCase()) ||
      competition.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || competition.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const paginatedCompetitions = filtered.slice(pageStart, pageEnd);
  const visibleStart = filtered.length === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(pageEnd, filtered.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function getPaginationItems(): Array<number | string> {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items: Array<number | string> = [1];

    if (currentPage > 3) {
      items.push('left-ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
      items.push(page);
    }

    if (currentPage < totalPages - 2) {
      items.push('right-ellipsis');
    }

    items.push(totalPages);
    return items;
  }

  const paginationItems = getPaginationItems();

  function confirmDelete(id: string) {
    setPendingDelete(id);
  }

  function executeDelete() {
    if (pendingDelete) {
      onDelete(pendingDelete);
      setPendingDelete(null);
    }
  }

  return (
    <>
      {/* Confirmation Modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Competition?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The competition will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-3 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="All">All Categories</option>
              {ALL_COMPETITION_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                {[
                  'Competition',
                  'SKU',
                  'Category',
                  'Entry Fee',
                  'Team Size',
                  'Status',
                  'Enrollment Open',
                  'Visibility',
                  'Start Date',
                  'End Date',
                  '',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-gray-400 text-sm">
                    No competitions found.
                  </td>
                </tr>
              ) : (
                paginatedCompetitions.map((competition) => {
                  return (
                    <tr
                      key={competition.id}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onViewCompetition(competition)}
                          className="font-medium text-gray-900 text-sm hover:text-indigo-600 hover:underline transition-colors text-left"
                        >
                          {competition.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-500">{competition.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${CATEGORY_COLORS[competition.category] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {competition.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-800">
                          ${competition.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{competition.teamSize}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 capitalize">{competition.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {competition.enrollmentOpen ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{competition.visibility}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {competition.startDate ? formatDateToDotted(competition.startDate) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {competition.endDate ? formatDateToDotted(competition.endDate) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onViewCompetition(competition)}
                            className="h-7 w-7 flex items-center justify-center rounded-md text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all"
                            title="View competition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(competition.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-md text-gray-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete competition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-gray-400">
            Showing {visibleStart}-{visibleEnd} of {filtered.length} competitions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || filtered.length === 0}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {paginationItems.map((item) => {
                if (typeof item !== 'number') {
                  return (
                    <span key={item} className="px-1 text-xs text-gray-400">
                      …
                    </span>
                  );
                }

                const active = item === currentPage;
                return (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={`h-7 min-w-7 px-2 text-xs font-medium rounded-md border transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || filtered.length === 0}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
