import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ProductTable from './components/ProductTable';
import ProductView from './components/ProductView';
import AddProductModal from './components/AddProductModal';
import ToastContainer from './components/ToastContainer';
import { Product } from './types/inventory';

export default function App() {
  const { products, stats, toasts, addProduct, deleteProduct, updateQuantity, setQuantity } =
    useInventory();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddProduct={() => setShowModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <StatsCards stats={stats} />
        {selectedProduct ? (
          <ProductView product={selectedProduct} onBack={() => setSelectedProduct(null)} />
        ) : (
          <ProductTable
            products={products}
            onDelete={deleteProduct}
            onUpdateQuantity={updateQuantity}
            onSetQuantity={setQuantity}
            onViewProduct={setSelectedProduct}
          />
        )}
      </main>

      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdd={addProduct} />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
