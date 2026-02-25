import { useState } from 'react';
import { Search, Trash2, Minus, Plus, ChevronDown, Eye } from 'lucide-react';
import { Product, ALL_CATEGORIES, getStockStatus } from '../types/inventory';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onSetQuantity: (id: string, quantity: number) => void;
  onViewProduct: (product: Product) => void;
}

const STATUS_STYLES = {
  'in-stock': 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  'low-stock': 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  'out-of-stock': 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
};

const STATUS_LABELS = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
};

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: 'bg-blue-100 text-blue-700',
  Clothing: 'bg-purple-100 text-purple-700',
  'Food & Beverage': 'bg-green-100 text-green-700',
  'Home & Garden': 'bg-teal-100 text-teal-700',
  Sports: 'bg-orange-100 text-orange-700',
  Beauty: 'bg-pink-100 text-pink-700',
};

export default function ProductTable({
  products,
  onDelete,
  onUpdateQuantity,
  onSetQuantity,
  onViewProduct,
}: ProductTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState<{ id: string; value: string } | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  function confirmDelete(id: string) {
    setPendingDelete(id);
  }

  function executeDelete() {
    if (pendingDelete) {
      onDelete(pendingDelete);
      setPendingDelete(null);
    }
  }

  function handleQtyBlur(id: string) {
    if (editingQty && editingQty.id === id) {
      const num = parseInt(editingQty.value, 10);
      if (!isNaN(num)) onSetQuantity(id, num);
      setEditingQty(null);
    }
  }

  function handleQtyKeyDown(e: React.KeyboardEvent, id: string) {
    if (e.key === 'Enter') handleQtyBlur(id);
    if (e.key === 'Escape') setEditingQty(null);
  }

  return (
    <>
      {/* Confirmation Modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The product will be permanently removed from your
              inventory.
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
              {ALL_CATEGORIES.map((c) => (
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
                {['Product', 'SKU', 'Category', 'Price', 'Quantity', 'Status', ''].map((h) => (
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
                  <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const status = getStockStatus(product);
                  const isEditing = editingQty?.id === product.id;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onViewProduct(product)}
                          className="font-medium text-gray-900 text-sm hover:text-indigo-600 hover:underline transition-colors text-left"
                        >
                          {product.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-500">{product.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${CATEGORY_COLORS[product.category] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-800">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            disabled={product.quantity === 0}
                            className="h-7 w-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-3 w-3 text-gray-600" />
                          </button>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              autoFocus
                              value={editingQty.value}
                              onChange={(e) =>
                                setEditingQty({ id: product.id, value: e.target.value })
                              }
                              onBlur={() => handleQtyBlur(product.id)}
                              onKeyDown={(e) => handleQtyKeyDown(e, product.id)}
                              className="w-14 text-center text-sm font-semibold border border-indigo-400 rounded-md py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          ) : (
                            <button
                              onClick={() =>
                                setEditingQty({ id: product.id, value: String(product.quantity) })
                              }
                              className="w-12 text-center text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md py-0.5 transition-colors"
                            >
                              {product.quantity}
                            </button>
                          )}
                          <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="h-7 w-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[status]}`}
                        >
                          {STATUS_LABELS[status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onViewProduct(product)}
                            className="h-7 w-7 flex items-center justify-center rounded-md text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all"
                            title="View product"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(product.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-md text-gray-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete product"
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
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>
    </>
  );
}
