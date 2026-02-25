export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export type Category =
  | 'Electronics'
  | 'Clothing'
  | 'Food & Beverage'
  | 'Home & Garden'
  | 'Sports'
  | 'Beauty';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  price: number;
  quantity: number;
  lowStockThreshold: number;
}

export interface NewProductForm {
  name: string;
  sku: string;
  category: Category;
  price: string;
  quantity: string;
  lowStockThreshold: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export function getStockStatus(product: Product): StockStatus {
  if (product.quantity === 0) return 'out-of-stock';
  if (product.quantity <= product.lowStockThreshold) return 'low-stock';
  return 'in-stock';
}

export const ALL_CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Food & Beverage',
  'Home & Garden',
  'Sports',
  'Beauty',
];
