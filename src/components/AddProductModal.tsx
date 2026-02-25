import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NewProductForm, ALL_CATEGORIES } from '../types/inventory';

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (form: NewProductForm) => void;
}

const EMPTY_FORM: NewProductForm = {
  name: '',
  sku: '',
  category: 'Electronics',
  price: '',
  quantity: '',
  lowStockThreshold: '10',
};

export default function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [form, setForm] = useState<NewProductForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewProductForm, string>>>({});

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validate(): boolean {
    const errs: Partial<Record<keyof NewProductForm, string>> = {};
    if (!form.name.trim()) errs.name = 'Product name is required.';
    if (!form.sku.trim()) errs.sku = 'SKU is required.';
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0)
      errs.price = 'Enter a valid price.';
    if (!form.quantity || isNaN(parseInt(form.quantity, 10)) || parseInt(form.quantity, 10) < 0)
      errs.quantity = 'Enter a valid quantity.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onAdd(form);
      onClose();
    }
  }

  function field(key: keyof NewProductForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add New Product</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => field('name', e.target.value)}
              placeholder="e.g. Wireless Headphones"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.name ? 'border-rose-400' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* SKU + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => field('sku', e.target.value)}
                placeholder="e.g. ELEC-WH-001"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono ${errors.sku ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => field('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price + Quantity row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => field('price', e.target.value)}
                placeholder="0.00"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.price ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={(e) => field('quantity', e.target.value)}
                placeholder="0"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.quantity ? 'border-rose-400' : 'border-gray-200'}`}
              />
              {errors.quantity && <p className="text-xs text-rose-500 mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* Low stock threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={form.lowStockThreshold}
              onChange={(e) => field('lowStockThreshold', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Products at or below this quantity will be flagged as low stock.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
