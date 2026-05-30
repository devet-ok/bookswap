'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Preview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const photo = localStorage.getItem('bookPhoto');
    if (!photo) {
      router.push('/');
      return;
    }
    recognizeBook(photo);
  }, []);

  const recognizeBook = async (photo: string) => {
    try {
      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo }),
      });

      if (!response.ok) throw new Error('Recognition failed');

      const data = await response.json();
      localStorage.setItem('bookData', JSON.stringify(data));
      router.push('/card');
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 28px',
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          backgroundColor: 'var(--coral-bg)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          border: '1.5px solid var(--coral-light)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="20" height="13" rx="2" stroke="#E8725A" strokeWidth="1.8"/>
            <circle cx="12" cy="13.5" r="3.2" stroke="#E8725A" strokeWidth="1.8"/>
            <path d="M8 7V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" stroke="#E8725A" strokeWidth="1.8"/>
            <line x1="4" y1="4" x2="20" y2="20" stroke="#E8725A" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={{
          fontSize: '19px',
          fontWeight: 600,
          color: 'var(--graphite-900)',
          textAlign: 'center',
          marginBottom: '8px',
          letterSpacing: '-0.3px',
        }}>Не удалось распознать книгу</h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--graphite-600)',
          textAlign: 'center',
          marginBottom: '32px',
        }}>Попробуйте сделать фото ещё раз</p>
        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            height: '44px',
            backgroundColor: 'var(--coral-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}>
          Попробовать снова
        </button>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid var(--coral-light)',
        borderTop: '3px solid var(--coral-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}/>
      <p style={{
        fontSize: '14px',
        color: 'var(--graphite-600)',
      }}>Распознаём книгу...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}