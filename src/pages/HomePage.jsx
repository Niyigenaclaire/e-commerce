// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, RefreshCcw } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import styles from './HomePage.module.css';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
  { icon: RefreshCcw, title: 'Easy Returns', desc: '30-day policy' },
  { icon: ShoppingBag, title: 'Best Prices', desc: 'Guaranteed value' },
];

export default function HomePage() {
  const { data: featured, isLoading } = useProducts({ sort: 'desc', limit: 8 });
  const { data: categories } = useCategories();

  const displayProducts = featured?.slice(0, 8);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <span className={styles.heroBadge}>🛍️ New Arrivals 2024</span>
            <h1 className={styles.heroTitle}>
              Discover <span className={styles.gradient}>Premium</span> Products
              for Every Style
            </h1>
            <p className={styles.heroDesc}>
              Shop thousands of curated items across electronics, fashion,
              jewelry, and more — all at unbeatable prices.
            </p>
            <div className={styles.heroCta}>
              <Link to="/products" className={`${styles.ctaBtn} ${styles.ctaPrimary}`}>
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/products" className={`${styles.ctaBtn} ${styles.ctaGhost}`}>
                View All Categories
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroBlob} />
            <div className={styles.heroFloat}>
              <span className={styles.emoji}>👗</span>
              <span className={styles.emoji}>💻</span>
              <span className={styles.emoji}>💍</span>
              <span className={styles.emoji}>👟</span>
            </div>
          </div>
        </div>
        <div className={styles.heroBg} />
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className={styles.features}>
        <div className={`container ${styles.featuresGrid}`}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Icon size={24} />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      {categories && (
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <div className={styles.catGrid}>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className={styles.catCard}
                >
                  <span className={styles.catEmoji}>
                    {cat === 'electronics' ? '💻'
                      : cat === 'jewelery' ? '💍'
                      : cat === "men's clothing" ? '👕'
                      : '👗'}
                  </span>
                  <span className={styles.catLabel}>{cat}</span>
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <Link to="/products" className={styles.viewAll}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : displayProducts?.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <h2>Ready to find your next favourite?</h2>
          <p>Over 20 products across 4 amazing categories</p>
          <Link to="/products" className={styles.bannerBtn}>
            Explore the Store <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
