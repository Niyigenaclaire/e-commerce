// src/pages/ProductDetailPage.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Package, Shield } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import ErrorState from '../components/ErrorState';
import toast from 'react-hot-toast';
import styles from './ProductDetailPage.module.css';

function StarRating({ rate, count }) {
  return (
    <div className={styles.ratingRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          fill={i < Math.round(rate) ? '#f59e0b' : 'none'}
          color={i < Math.round(rate) ? '#f59e0b' : '#d1d5db'}
        />
      ))}
      <span className={styles.rateNum}>{rate.toFixed(1)}</span>
      <span className={styles.rateCount}>({count} reviews)</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  // UI state — quantity selector
  const [qty, setQty] = useState(1);

  // Server state — TanStack Query
  const { data: product, isLoading, isError, error, refetch } = useProduct(Number(id));
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className={`container ${styles.loadingWrap}`}>
        <div className={styles.skeletonDetail}>
          <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
            <div className="skeleton" style={{ height: 20, width: '40%' }} />
            <div className="skeleton" style={{ height: 34, width: '90%' }} />
            <div className="skeleton" style={{ height: 34, width: '70%' }} />
            <div className="skeleton" style={{ height: 20, width: '30%' }} />
            <div className="skeleton" style={{ height: 80 }} />
            <div className="skeleton" style={{ height: 48, width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <ErrorState
          message={error?.userMessage || 'Product not found'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${qty}× "${product.title.slice(0, 28)}…" added to cart!`, {
      icon: '🛍️',
    });
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Back link */}
        <Link to="/products" className={styles.back}>
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className={styles.detail}>
          {/* Image */}
          <div className={styles.imageWrap}>
            <img src={product.image} alt={product.title} className={styles.image} />
          </div>

          {/* Info */}
          <div className={`${styles.info} fade-in`}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.title}>{product.title}</h1>
            <StarRating rate={product.rating.rate} count={product.rating.count} />
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            <p className={styles.desc}>{product.description}</p>

            {/* Quantity */}
            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>Quantity</span>
              <div className={styles.qtyControl}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className={styles.qtyBtn}
                  aria-label="Decrease quantity"
                >−</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className={styles.qtyBtn}
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              id="add-to-cart-btn"
              className={styles.addBtn}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} />
              Add to Cart — ${(product.price * qty).toFixed(2)}
            </button>

            {/* Trust badges */}
            <div className={styles.badges}>
              <div className={styles.trustBadge}>
                <Package size={16} />
                <span>Free delivery on orders $50+</span>
              </div>
              <div className={styles.trustBadge}>
                <Shield size={16} />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
