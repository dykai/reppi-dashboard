import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Division } from '../types/competition';

interface AddAthleteModalProps {
  divisions: Division[];
  onClose: () => void;
  onAdd: (input: {
    userEmail: string;
    userName: string;
    divisionIndex: number;
    boxName: string;
  }) => boolean;
}

export default function AddAthleteModal({ divisions, onClose, onAdd }: AddAthleteModalProps) {
  const sortedDivisions = useMemo(
    () => [...divisions].sort((firstDivision, secondDivision) => firstDivision.index - secondDivision.index),
    [divisions],
  );

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [divisionIndex, setDivisionIndex] = useState<string>(
    sortedDivisions[0] ? String(sortedDivisions[0].index) : '',
  );
  const [boxName, setBoxName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!userEmail.trim()) {
      setError('Athlete email is required.');
      return;
    }

    if (!userName.trim()) {
      setError('Athlete name is required.');
      return;
    }

    if (!divisionIndex) {
      setError('Select a division.');
      return;
    }

    const added = onAdd({
      userEmail,
      userName,
      divisionIndex: Number(divisionIndex),
      boxName,
    });

    if (!added) {
      setError('Unable to add athlete. Check the details and try again.');
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Athlete</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Athlete Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(event) => {
                setUserEmail(event.target.value);
                if (error) setError(null);
              }}
              placeholder="athlete@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Athlete Name</label>
            <input
              type="text"
              value={userName}
              onChange={(event) => {
                setUserName(event.target.value);
                if (error) setError(null);
              }}
              placeholder="First Last"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
            <select
              value={divisionIndex}
              onChange={(event) => {
                setDivisionIndex(event.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              {sortedDivisions.map((division) => (
                <option key={division.index} value={String(division.index)}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Box Name (Optional)</label>
            <input
              type="text"
              value={boxName}
              onChange={(event) => {
                setBoxName(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Defaults to Unaffiliated"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sortedDivisions.length === 0}
              className="px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add Athlete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
