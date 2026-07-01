// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './ProductCard.module.css';

function StarRating({ rate, count }) {
  const full = Math.floor(rate);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < full ? '★' : '☆'
  ).join('');
  return (
    <div className={styles.rating}>
      <span className={styles.stars}>{stars}</span>
      <span className={styles.count}>({count})</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`"${product.title.slice(0, 30)}..." added to cart!`, {
      icon: '🛍️',
    });
  };

  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <button
            onClick={handleAdd}
            className={styles.quickAdd}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
            Quick Add
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <StarRating rate={product.rating.rate} count={product.rating.count} />
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
