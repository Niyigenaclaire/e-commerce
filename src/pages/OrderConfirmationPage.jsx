// src/pages/OrderConfirmationPage.jsx
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import styles from './OrderConfirmationPage.module.css';

export default function OrderConfirmationPage() {
  const { state } = useLocation();

  if (!state?.orderId) return <Navigate to="/" replace />;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.wrap}`}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <CheckCircle size={52} />
          </div>
          <h1 className={styles.title}>Order Confirmed!</h1>
          <p className={styles.subtitle}>
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          <div className={styles.orderBox}>
            <Package size={18} />
            <div>
              <p className={styles.orderLabel}>Order Reference</p>
              <p className={styles.orderId}>#{state.orderId}</p>
            </div>
          </div>

          <p className={styles.note}>
            A confirmation will be sent to your email. Estimated delivery is
            <strong> 3-5 business days</strong>.
          </p>

          <div className={styles.actions}>
            <Link to="/orders" className={styles.ordersBtn}>
              <Package size={18} /> View Order History
            </Link>
            <Link to="/products" className={styles.shopBtn}>
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
