// src/pages/CartPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className={`container ${styles.emptyWrap}`}>
        <div className={styles.emptyState}>
          <span style={{ fontSize: '5rem' }}>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Start shopping!</p>
          <Link to="/products" className={styles.shopBtn}>
            <ShoppingBag size={18} /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Your Cart</h1>

        <div className={styles.layout}>
          {/* ── Cart items ─────────────────────────────── */}
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.id} className={`${styles.item} fade-in`}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.title} />
                </div>

                <div className={styles.itemInfo}>
                  <span className={styles.itemCategory}>{item.category}</span>
                  <Link
                    to={`/products/${item.id}`}
                    className={styles.itemTitle}
                  >
                    {item.title}
                  </Link>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)} each</p>
                </div>

                <div className={styles.itemControls}>
                  <div className={styles.qtyRow}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.qtyBtn}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.qtyBtn}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className={styles.lineTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className={styles.removeBtn}
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order summary ─────────────────────────── */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={styles.free}>
                  {subtotal >= 50 ? 'Free' : '$5.00'}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax (8%)</span>
                <span>${(subtotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className={styles.total}>
              <span>Total</span>
              <span>
                ${(subtotal + (subtotal >= 50 ? 0 : 5) + subtotal * 0.08).toFixed(2)}
              </span>
            </div>

            <button
              id="checkout-btn"
              onClick={() => navigate('/checkout')}
              className={styles.checkoutBtn}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <Link to="/products" className={styles.continueLink}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
