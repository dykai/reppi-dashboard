import { useState } from 'react';
import { useCompetitions } from './hooks/useCompetitions';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CompetitionTable from './components/CompetitionTable';
import CompetitionView from './components/CompetitionView';
import AddCompetitionModal from './components/AddCompetitionModal';
import ToastContainer from './components/ToastContainer';
import { Competition } from './types/competition';

export default function App() {
  const { competitions, stats, toasts, addCompetition, deleteCompetition } = useCompetitions();
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddCompetition={() => setShowModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <StatsCards stats={stats} />
        {selectedCompetition ? (
          <CompetitionView
            competition={selectedCompetition}
            onBack={() => setSelectedCompetition(null)}
          />
        ) : (
          <CompetitionTable
            competitions={competitions}
            onDelete={deleteCompetition}
            onViewCompetition={setSelectedCompetition}
          />
        )}
      </main>

      {showModal && (
        <AddCompetitionModal onClose={() => setShowModal(false)} onAdd={addCompetition} />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
