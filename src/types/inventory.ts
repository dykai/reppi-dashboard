export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export type Category =
  | 'Electronics'
  | 'Clothing'
  | 'Food & Beverage'
  | 'Home & Garden'
  | 'Sports'
  | 'Beauty'
  | 'Online Competition'
  | 'Live Competition';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  price: number;
  quantity?: number;
  lowStockThreshold?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  vat?: number;
}

export function isCompetition(product: Product): boolean {
  return product.category === 'Online Competition' || product.category === 'Live Competition';
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
  if (product.quantity === undefined) return 'in-stock';
  if (product.quantity === 0) return 'out-of-stock';
  if (product.lowStockThreshold !== undefined && product.quantity <= product.lowStockThreshold) return 'low-stock';
  return 'in-stock';
}

export const ALL_CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Food & Beverage',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Online Competition',
  'Live Competition',
];
