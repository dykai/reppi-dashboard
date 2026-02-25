import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ProductTable from './components/ProductTable';
import AddProductModal from './components/AddProductModal';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const { products, stats, toasts, addProduct, deleteProduct, updateQuantity, setQuantity } =
    useInventory();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddProduct={() => setShowModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <StatsCards stats={stats} />
        <ProductTable
          products={products}
          onDelete={deleteProduct}
          onUpdateQuantity={updateQuantity}
          onSetQuantity={setQuantity}
        />
      </main>

      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdd={addProduct} />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
