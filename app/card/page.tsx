'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showGallerySheet, setShowGallerySheet] = useState(false);
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const router = useRouter();

const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 1024;
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(objectUrl);
      localStorage.setItem('bookPhoto', base64);
      router.push('/preview');
    };

    img.src = objectUrl;
  };

  const handleGalleryAccess = () => {
    setShowGallerySheet(false);
    fileInputRef.current?.click();
  };

  const handleCameraAccess = () => {
    setShowCameraSheet(false);
    cameraInputRef.current?.click();
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      position: 'relative',
    }}>
      {/* Шапка */}
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

      {/* Контент */}
      <div style={{
        maxWidth: '390px',
        margin: '0 auto',
        padding: '24px 18px 0',
      }}>
        {/* Зона загрузки */}
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

        {/* Подсказка */}
        <p style={{
          textAlign: 'center',
          fontSize: '10.5px',
          color: 'var(--graphite-300)',
          margin: '0 0 18px',
          lineHeight: 1.5,
        }}>
          Убедитесь, что обложка хорошо видна и фото чёткое
        </p>

        {/* Кнопка камеры */}
        <button
          onClick={() => setShowCameraSheet(true)}
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

        {/* Разделитель */}
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

        {/* Кнопка галереи */}
        <button
          onClick={() => setShowGallerySheet(true)}
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
      </div>

      {/* Скрытые input'ы */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Bottom sheet — камера */}
      {showCameraSheet && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 20,
        }}
          onClick={() => setShowCameraSheet(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--background)',
              width: '100%',
              padding: '22px 20px 20px',
              borderRadius: '18px 18px 0 0',
              borderTop: '2.5px solid var(--coral-light)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: '42px',
              height: '42px',
              backgroundColor: 'var(--coral-bg)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="13" rx="2" stroke="#E8725A" strokeWidth="1.8"/>
                <circle cx="12" cy="13.5" r="3.2" stroke="#E8725A" strokeWidth="1.8"/>
                <path d="M8 7V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" stroke="#E8725A" strokeWidth="1.8"/>
              </svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--graphite-900)', marginBottom: '6px' }}>
              Доступ к камере
            </p>
            <p style={{ fontSize: '11.5px', color: 'var(--graphite-600)', lineHeight: 1.55, marginBottom: '16px' }}>
              BookSwap использует камеру для фото обложки. Данные не передаются третьим лицам.
            </p>
            <button
              onClick={handleCameraAccess}
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
                marginBottom: '8px',
              }}>
              Разрешить
            </button>
            <button
              onClick={() => setShowCameraSheet(false)}
              style={{
                width: '100%',
                fontSize: '11px',
                color: 'var(--graphite-300)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
              }}>
              Не сейчас
            </button>
          </div>
        </div>
      )}

      {/* Bottom sheet — галерея */}
      {showGallerySheet && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 20,
        }}
          onClick={() => setShowGallerySheet(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--background)',
              width: '100%',
              padding: '22px 20px 20px',
              borderRadius: '18px 18px 0 0',
              borderTop: '2.5px solid var(--coral-light)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: '42px',
              height: '42px',
              backgroundColor: 'var(--coral-bg)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="2" stroke="#E8725A" strokeWidth="1.8"/>
                <path d="M2 15l5-5 4 4 3-3 7 7" stroke="#E8725A" strokeWidth="1.8" strokeLinejoin="round"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#E8725A"/>
              </svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--graphite-900)', marginBottom: '6px' }}>
              Доступ к фотографиям
            </p>
            <p style={{ fontSize: '11.5px', color: 'var(--graphite-600)', lineHeight: 1.55, marginBottom: '16px' }}>
              BookSwap запрашивает доступ к галерее, чтобы вы могли выбрать фото обложки. Данные не передаются третьим лицам.
            </p>
            <button
              onClick={handleGalleryAccess}
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
                marginBottom: '8px',
              }}>
              Разрешить доступ
            </button>
            <button
              onClick={() => setShowGallerySheet(false)}
              style={{
                width: '100%',
                fontSize: '11px',
                color: 'var(--graphite-300)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
              }}>
              Не сейчас
            </button>
          </div>
        </div>
      )}
    </main>
  );
}