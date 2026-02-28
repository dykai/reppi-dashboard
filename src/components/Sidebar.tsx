import { useEffect, useRef, useState } from 'react';
import { Home, Menu, Trophy, Users, X } from 'lucide-react';

export type SidebarItem = 'home' | 'competitions' | 'users';
export type CompetitionSidebarSection = 'competition' | 'divisions' | 'athletes';

interface SidebarProps {
  activeItem: SidebarItem;
  onSelect: (item: SidebarItem, options?: { fromSubItem?: boolean }) => void;
  selectedCompetitionName: string | null;
  activeCompetitionSection: CompetitionSidebarSection;
  onSelectCompetitionSection: (section: CompetitionSidebarSection) => void;
}

const ITEMS: Array<{ id: SidebarItem; label: string; icon: typeof Home }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'competitions', label: 'Competitions', icon: Trophy },
  { id: 'users', label: 'Users', icon: Users },
];

export default function Sidebar({
  activeItem,
  onSelect,
  selectedCompetitionName,
  activeCompetitionSection,
  onSelectCompetitionSection,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!mobileContainerRef.current) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && !mobileContainerRef.current.contains(target)) {
        setMobileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileOpen]);

  function selectItem(item: SidebarItem) {
    onSelect(item);
    setMobileOpen(false);
  }

  function selectCompetitionSection(section: CompetitionSidebarSection) {
    onSelect('competitions', { fromSubItem: true });
    onSelectCompetitionSection(section);
    setMobileOpen(false);
  }

  const competitionSubItems: Array<{ id: CompetitionSidebarSection; label: string }> = [
    { id: 'competition', label: selectedCompetitionName ?? 'Competition' },
    { id: 'divisions', label: 'Divisions' },
    { id: 'athletes', label: 'Athletes' },
  ];

  return (
    <>
      <div ref={mobileContainerRef} className="md:hidden fixed top-0 right-0 z-50 text-white">
        <div className="h-16 px-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setMobileOpen((previous) => !previous)}
            className="h-9 w-9 rounded-md border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="absolute right-3 top-full z-50 pt-2 w-64 max-w-[calc(100vw-1.5rem)]">
            <nav className="space-y-1 border border-white/10 bg-black rounded-lg shadow-2xl p-2">
              {ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeItem === item.id;
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => selectItem(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-white text-[#d26512]'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>

                    {item.id === 'competitions' && selectedCompetitionName && (
                      <div className="ml-4 space-y-1">
                        {competitionSubItems.map((subItem) => {
                          const activeSubItem =
                            activeItem === 'competitions' && activeCompetitionSection === subItem.id;
                          const isNestedChild = subItem.id !== 'competition';
                          return (
                            <div key={subItem.id} className={isNestedChild ? 'ml-4 pl-3 border-l border-white/15' : ''}>
                              <button
                                type="button"
                                onClick={() => selectCompetitionSection(subItem.id)}
                                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                                  activeSubItem
                                    ? 'bg-white/90 text-[#d26512] font-medium'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                <span className="truncate">{subItem.label}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <aside className="hidden md:block w-64 shrink-0 bg-black text-white border-r border-white/10 md:min-h-[calc(100vh-4rem)]">
        <nav className="p-3 space-y-1">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeItem === item.id;
            return (
              <div key={item.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-white text-[#d26512]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>

                {item.id === 'competitions' && selectedCompetitionName && (
                  <div className="ml-4 space-y-1">
                    {competitionSubItems.map((subItem) => {
                      const activeSubItem =
                        activeItem === 'competitions' && activeCompetitionSection === subItem.id;
                      const isNestedChild = subItem.id !== 'competition';
                      return (
                        <div key={subItem.id} className={isNestedChild ? 'ml-4 pl-3 border-l border-white/15' : ''}>
                          <button
                            type="button"
                            onClick={() => selectCompetitionSection(subItem.id)}
                            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                              activeSubItem
                                ? 'bg-white/90 text-[#d26512] font-medium'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="truncate">{subItem.label}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
