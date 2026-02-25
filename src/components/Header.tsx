import { Package } from 'lucide-react';

interface HeaderProps {
  onAddProduct: () => void;
}

export default function Header({ onAddProduct }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Package className="h-6 w-6 text-indigo-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Reppi Dashboard</h1>
              <p className="text-indigo-300 text-xs leading-none">Inventory Management</p>
            </div>
          </div>

          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-indigo-50 active:scale-95 transition-all duration-150"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </button>
        </div>
      </div>
    </header>
  );
}
