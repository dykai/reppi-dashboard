import { Package } from 'lucide-react';

interface HeaderProps {
  onAddProduct: () => void;
}

export default function Header({ onAddProduct }: HeaderProps) {
  return (
    <header className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Package className="h-6 w-6 text-[#d26512]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Reppi Dashboard</h1>
              <p className="text-[#d26512] text-xs leading-none">Inventory Management</p>
            </div>
          </div>

          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-white text-[#d26512] px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-orange-50 active:scale-95 transition-all duration-150"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </button>
        </div>
      </div>
    </header>
  );
}
