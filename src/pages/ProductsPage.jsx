// src/pages/ProductsPage.jsx
// Product listing with search, category filter, and sort — all UI state in useState
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── UI state (not server state) ──────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');

  // Sync category from URL
  useEffect(() => {
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // ── Server state via TanStack Query ──────────────────────────────────────
  const { data: categories } = useCategories();
  const { data: products, isLoading, isError, error, refetch, isFetching } = useProducts({
    category,
    sort,
    search,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchParams(cat ? { category: cat } : {});
  };

  const clearFilters = () => {
    setCategory('');
    setSearch('');
    setSearchInput('');
    setSort('');
    setSearchParams({});
  };

  const hasFilters = category || search || sort;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* ── Header ─────────────────────────────────── */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {category ? (
                <span style={{ textTransform: 'capitalize' }}>{category}</span>
              ) : 'All Products'}
            </h1>
            {products && (
              <p className={styles.count}>
                {products.length} product{products.length !== 1 ? 's' : ''} found
                {isFetching && ' (refreshing…)'}
              </p>
            )}
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className={styles.clearBtn}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* ── Filters row ─────────────────────────────── */}
        <div className={styles.controls}>
          {/* Search */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <Search size={18} className={styles.searchIcon} />
            <input
              id="product-search"
              type="search"
              placeholder="Search products…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
              aria-label="Search products"
            />
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>

          {/* Sort */}
          <div className={styles.sortWrap}>
            <SlidersHorizontal size={16} />
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={styles.select}
              aria-label="Sort products"
            >
              <option value="">Default</option>
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* ── Category chips ──────────────────────────── */}
        <div className={styles.chips} role="group" aria-label="Filter by category">
          <button
            className={`${styles.chip} ${!category ? styles.chipActive : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat}
              className={`${styles.chip} ${category === cat ? styles.chipActive : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Product grid ────────────────────────────── */}
        {isError ? (
          <ErrorState
            message={error?.userMessage || 'Failed to load products'}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className={styles.empty}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <p>No products found. Try a different search or filter.</p>
            <button onClick={clearFilters} className={styles.clearBtn}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className={`${styles.grid} fade-in`}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
