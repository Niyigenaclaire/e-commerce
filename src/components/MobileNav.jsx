// src/components/MobileNav.jsx — Mobile bottom navigation bar
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './MobileNav.module.css';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/products', label: 'Shop', icon: Store },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/orders', label: 'Orders', icon: Package },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className={styles.nav} aria-label="Mobile navigation">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={`${styles.item} ${pathname === to ? styles.active : ''}`}
        >
          <div className={styles.iconWrap}>
            <Icon size={22} />
            {to === '/cart' && totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </div>
          <span className={styles.label}>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
