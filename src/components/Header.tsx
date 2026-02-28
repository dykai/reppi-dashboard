import { Package } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-black text-white shadow-lg">
      <div className="w-full h-16 flex items-center">
        <div className="flex items-center gap-3 px-4 sm:px-6 md:w-64 md:px-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Package className="h-6 w-6 text-[#d26512]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Reppi Dashboard</h1>
              <p className="text-[#d26512] text-xs leading-none">Competition Management</p>
            </div>
          </div>
        </div>
    </header>
  );
}
