'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      localStorage.setItem('bookPhoto', base64);
      router.push('/preview');
    };
    reader.readAsDataURL(file);
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '52px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontSize: '17px',
          fontWeight: 600,
          letterSpacing: '-0.3px',
          color: 'var(--graphite-900)',
        }}>
          Book<span style={{ color: 'var(--coral-primary)' }}>Swap</span>
        </span>
      </header>
      <div style={{
        maxWidth: '390px',
        margin: '0 auto',
        padding: '24px 18px 0',
      }}>
        <div style={{
          backgroundColor: 'var(--coral-bg)',
          border: '1.5px dashed var(--coral-light)',
          borderRadius: '12px',
          height: '196px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '2px solid var(--coral-primary)',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="13" rx="2" stroke="#E8725A" strokeWidth="1.8"/>
              <circle cx="12" cy="13.5" r="3.2" stroke="#E8725A" strokeWidth="1.8"/>
              <path d="M8 7V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" stroke="#E8725A" strokeWidth="1.8"/>
            </svg>
          </div>
          <p style={{
            fontSize: '12px',
            color: 'var(--graphite-600)',
            textAlign: 'center',
            lineHeight: 1.55,
            margin: 0,
            padding: '0 24px',
          }}>
            Сфотографируйте обложку книги<br/>или загрузите из галереи
          </p>
        </div>
        <p style={{
          textAlign: 'center',
          fontSize: '10.5px',
          color: 'var(--graphite-300)',
          margin: '0 0 18px',
          lineHeight: 1.5,
        }}>
          Убедитесь, что обложка хорошо видна и фото чёткое
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
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
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          Сделать фото
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ fontSize: '10px', color: 'var(--graphite-300)' }}>или</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            height: '44px',
            backgroundColor: 'transparent',
            color: 'var(--graphite-900)',
            border: '1.5px solid var(--border)',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          Выбрать из галереи
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </div>
    </main>
  );
}