// src/pages/OrdersPage.jsx — Order history page
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, ChevronRight, Clock } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import styles from './OrdersPage.module.css';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Order History</h1>
            <p className={styles.subtitle}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>
          <Link to="/products" className={styles.shopBtn}>
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <Package size={56} strokeWidth={1.5} />
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link to="/products" className={styles.startBtn}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((order) => (
              <div key={order.id} className={`${styles.orderCard} fade-in`}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.orderDate}>
                      <Clock size={13} />
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div className={styles.orderRight}>
                    <span className={styles.statusBadge}>{order.status}</span>
                    <span className={styles.orderTotal}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={styles.thumb}
                      />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.title.slice(0, 50)}</p>
                        <p className={styles.itemMeta}>
                          Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className={styles.more}>
                      +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className={styles.orderFooter}>
                  <p className={styles.customer}>Ordered by: {order.customer}</p>
                  <ChevronRight size={18} className={styles.chevron} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
