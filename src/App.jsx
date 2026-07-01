// src/App.jsx — Application router and layout
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';

// Single TanStack Query client for the whole app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <OrdersProvider>
          <BrowserRouter>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/orders" element={<OrdersPage />} />
              </Routes>
            </main>

            {/* Global toast notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  borderRadius: '12px',
                  background: '#1a1a2e',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: '500',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
          </BrowserRouter>
        </OrdersProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
