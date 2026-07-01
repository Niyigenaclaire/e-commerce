// src/components/ErrorState.jsx
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        gap: '1rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: '#fff1f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-error)',
        }}
      >
        <AlertCircle size={36} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Oops!</h3>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: 360 }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.2rem',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}
