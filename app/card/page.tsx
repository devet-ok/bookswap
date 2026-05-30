'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type BookData = {
  title: string;
  author: string;
  language: string;
  genre: string;
  description: string;
  cover_url: string | null;
  isbn: string | null;
};

export default function Card() {
  const [book, setBook] = useState<BookData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('bookData');
    if (!data) {
      router.push('/');
      return;
    }
    setBook(JSON.parse(data));
  }, []);

  if (!book) return null;

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Шапка */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 18px',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="#3A3535" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ width: '30px' }} />
      </div>

      {/* Обложка */}
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: 'var(--coral-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}>
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            style={{
              height: '170px',
              borderRadius: '4px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          />
        ) : (
          <div style={{
            width: '116px',
            height: '158px',
            backgroundColor: 'white',
            borderLeft: '8px solid var(--coral-light)',
            borderRadius: '0 4px 4px 0',
            display: 'flex',
            flexDirection: 'column',
            padding: '13px 11px',
            gap: '5px',
          }}>
            <span style={{ fontSize: '7px', fontWeight: 500, color: 'var(--coral-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{book.genre}</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--graphite-900)', lineHeight: 1.3, marginTop: '3px' }}>{book.title}</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: '8px', color: 'var(--graphite-300)' }}>{book.author}</span>
          </div>
        )}
      </div>

      {/* Контент */}
      <div style={{ padding: '13px 18px 0', flex: 1 }}>
        {/* Теги */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <span style={{
            padding: '4px 10px',
            fontSize: '10px',
            fontWeight: 500,
            borderRadius: '6px',
            backgroundColor: 'var(--coral-bg)',
            color: 'var(--coral-primary)',
            border: '1px solid var(--coral-light)',
          }}>{book.language}</span>
          <span style={{
            padding: '4px 10px',
            fontSize: '10px',
            fontWeight: 500,
            borderRadius: '6px',
            backgroundColor: 'white',
            color: 'var(--graphite-600)',
            border: '1px solid var(--border)',
          }}>{book.genre}</span>
        </div>

        {/* Название и автор */}
        <h1 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--graphite-900)',
          lineHeight: 1.15,
          letterSpacing: '-0.3px',
          marginBottom: '3px',
        }}>{book.title}</h1>
        <p style={{
          fontSize: '12px',
          color: 'var(--coral-primary)',
          marginBottom: '9px',
        }}>{book.author}</p>

        {/* Описание */}
        <div style={{ marginBottom: '10px' }}>
          <p style={{
            fontSize: '11.5px',
            color: 'var(--graphite-600)',
            lineHeight: 1.6,
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: expanded ? 'visible' : 'hidden',
          }}>{book.description}</p>
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              style={{
                fontSize: '11.5px',
                color: 'var(--coral-primary)',
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginTop: '6px',
              }}>Читать далее</button>
          )}
        </div>
      </div>

      {/* Кнопки */}
      <div style={{
        padding: '10px 18px 20px',
        display: 'flex',
        gap: '8px',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
      }}>
        <button style={{
          flex: 1,
          height: '44px',
          backgroundColor: 'var(--coral-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'not-allowed',
          opacity: 0.7,
        }}>Получить книгу</button>
        <button style={{
          width: '48px',
          backgroundColor: 'white',
          border: '1.5px solid var(--border)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'not-allowed',
          opacity: 0.7,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="#3A3535" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </main>
  );
}