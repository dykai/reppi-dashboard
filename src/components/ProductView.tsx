import { ArrowLeft, Package } from 'lucide-react';
import { Product, getStockStatus } from '../types/inventory';

interface ProductViewProps {
  product: Product;
  onBack: () => void;
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

export default function ProductView({ product, onBack }: ProductViewProps) {
  const status = getStockStatus(product);

  const properties = [
    { label: 'Product ID', value: product.id },
    { label: 'SKU', value: product.sku },
    { label: 'Price', value: `$${product.price.toFixed(2)}` },
    { label: 'Quantity', value: product.quantity.toLocaleString() },
    { label: 'Low Stock Threshold', value: product.lowStockThreshold.toLocaleString() },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-gray-300">|</span>
        <h2 className="text-sm font-semibold text-gray-700">Product Details</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Product name & icon */}
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <Package className="h-8 w-8 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[product.category] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {product.category}
              </span>
              <span
                className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLES[status]}`}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>
          </div>
        </div>

        {/* Properties grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
