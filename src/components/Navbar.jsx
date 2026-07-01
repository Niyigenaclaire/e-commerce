// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Store, Package, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { totalItems } = useCart();
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Shop', icon: Store },
    { to: '/orders', label: 'Orders', icon: Package },
  ];

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span>ShopVibe</span>
        </Link>

        {/* Nav links */}
        <ul className={styles.links}>
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`${styles.link} ${pathname === to ? styles.active : ''}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Cart icon */}
        <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className={styles.badge}>{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}
