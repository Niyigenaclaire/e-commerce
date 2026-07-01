// src/components/SkeletonCard.jsx — Skeleton loading placeholder
export default function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Image area */}
      <div
        className="skeleton"
        style={{ height: 220, borderRadius: 0 }}
      />
      {/* Body */}
      <div style={{ padding: '1rem 1.1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div className="skeleton" style={{ height: 18, width: '40%' }} />
        <div className="skeleton" style={{ height: 14, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
        <div className="skeleton" style={{ height: 22, width: '35%', marginTop: '0.4rem' }} />
      </div>
    </div>
  );
}
