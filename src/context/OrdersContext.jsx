// src/context/OrdersContext.jsx
// Stores placed orders locally so order-history page works without re-fetching
import { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext(null);
const STORAGE_KEY = 'shopify_orders';

function loadOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) =>
    setOrders((prev) => [order, ...prev]);

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
