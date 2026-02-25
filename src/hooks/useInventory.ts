import { useState, useEffect, useCallback } from 'react';
import { Product, NewProductForm, InventoryStats, getStockStatus } from '../types/inventory';
import { INITIAL_PRODUCTS } from '../data/products';

const STORAGE_KEY = 'reppi_inventory';

function loadFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Product[];
      const storedIds = new Set(stored.map((p) => p.id));
      const missing = INITIAL_PRODUCTS.filter((p) => !storedIds.has(p.id));
      return missing.length > 0 ? [...stored, ...missing] : stored;
    }
  } catch {
    // ignore
  }
  return INITIAL_PRODUCTS;
}

function saveToStorage(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error';
};

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(loadFromStorage);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    saveToStorage(products);
  }, [products]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const addProduct = useCallback(
    (form: NewProductForm) => {
      const product: Product = {
        id: `prod-${Date.now()}`,
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
        lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 10,
      };
      setProducts((prev) => [product, ...prev]);
      addToast(`"${product.name}" added to inventory.`);
    },
    [addToast],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts((prev) => {
        const target = prev.find((p) => p.id === id);
        const next = prev.filter((p) => p.id !== id);
        if (target) addToast(`"${target.name}" removed from inventory.`);
        return next;
      });
    },
    [addToast],
  );

  const updateQuantity = useCallback(
    (id: string, delta: number) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, quantity: Math.max(0, (p.quantity ?? 0) + delta) } : p,
        ),
      );
    },
    [],
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, quantity) } : p)),
    );
  }, []);

  const stats: InventoryStats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price * (p.quantity ?? 0), 0),
    lowStockCount: products.filter((p) => getStockStatus(p) === 'low-stock').length,
    outOfStockCount: products.filter((p) => getStockStatus(p) === 'out-of-stock').length,
  };

  return {
    products,
    stats,
    toasts,
    addProduct,
    deleteProduct,
    updateQuantity,
    setQuantity,
  };
}
