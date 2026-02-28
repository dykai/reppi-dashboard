import { useState } from 'react';
import { Users as UsersIcon, Medal, ClipboardList } from 'lucide-react';
import { useCompetitions } from './hooks/useCompetitions';
import { useUsers } from './hooks/useUsers';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CompetitionTable from './components/CompetitionTable';
import CompetitionView from './components/CompetitionView';
import AddCompetitionModal from './components/AddCompetitionModal';
import ToastContainer from './components/ToastContainer';
import Sidebar, { SidebarItem } from './components/Sidebar';
import UsersView from './components/UsersView';

export default function App() {
  const {
    competitions,
    stats,
    toasts,
    addCompetition,
    deleteCompetition,
    updateCompetitionDivisions,
  } = useCompetitions();
  const { users, athletes, addAthlete } = useUsers();
  const [activeItem, setActiveItem] = useState<SidebarItem>('home');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const selectedCompetition =
    selectedCompetitionId === null
      ? null
      : competitions.find((competition) => competition.id === selectedCompetitionId) ?? null;

  const totalUsers = users.length;
  const totalAthletes = athletes.length;
  const activeCompetitionEnrollments = new Set(athletes.map((athlete) => athlete.competitionId)).size;

  function renderHome() {
    return (
      <div className="space-y-6">
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-gray-200 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              <p className="text-xs text-gray-500 mt-0.5">Registered Users</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-gray-200 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
              <Medal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalAthletes}</p>
              <p className="text-xs text-gray-500 mt-0.5">Athlete Entries</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-gray-200 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{activeCompetitionEnrollments}</p>
              <p className="text-xs text-gray-500 mt-0.5">Competitions With Entries</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderCompetitions() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Competitions</h2>
            <p className="text-sm text-gray-500">Manage all competition records and divisions.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#d26512] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-orange-700 active:scale-95 transition-all duration-150"
          >
            <span className="text-lg leading-none">+</span>
            Add Competition
          </button>
        </div>

        {selectedCompetition ? (
          <CompetitionView
            competition={selectedCompetition}
            users={users}
            athletes={athletes}
            onAddAthlete={addAthlete}
            onBack={() => setSelectedCompetitionId(null)}
            onUpdateDivisions={updateCompetitionDivisions}
          />
        ) : (
          <>
            <StatsCards stats={stats} />
            <CompetitionTable
              competitions={competitions}
              onDelete={deleteCompetition}
              onViewCompetition={(competition) => setSelectedCompetitionId(competition.id)}
            />
          </>
        )}
      </div>
    );
  }

  function renderContent() {
    if (activeItem === 'competitions') {
      return renderCompetitions();
    }

    if (activeItem === 'users') {
      return <UsersView users={users} athletes={athletes} />;
    }

    return renderHome();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="md:flex">
        <Sidebar activeItem={activeItem} onSelect={setActiveItem} />

        <div className="flex-1 min-w-0">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>
        </div>
      </div>

      {showModal && (
        <AddCompetitionModal onClose={() => setShowModal(false)} onAdd={addCompetition} />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
