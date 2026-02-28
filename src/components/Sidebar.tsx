import { useEffect, useRef, useState } from 'react';
import { Home, Menu, Trophy, Users, X } from 'lucide-react';

export type SidebarItem = 'home' | 'competitions' | 'users';

interface SidebarProps {
  activeItem: SidebarItem;
  onSelect: (item: SidebarItem) => void;
}

const ITEMS: Array<{ id: SidebarItem; label: string; icon: typeof Home }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'competitions', label: 'Competitions', icon: Trophy },
  { id: 'users', label: 'Users', icon: Users },
];

export default function Sidebar({ activeItem, onSelect }: SidebarProps) {
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
                  <button
                    key={item.id}
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
              <button
                key={item.id}
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
            );
          })}
        </nav>
      </aside>
    </>
  );
}
