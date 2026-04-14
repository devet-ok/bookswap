export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: '0 18px',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '56px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontSize: '17px',
          fontWeight: 600,
          color: 'var(--graphite-900)',
        }}>BookSwap</span>
      </header>
      <div style={{
        maxWidth: '390px',
        margin: '0 auto',
        paddingTop: '32px',
      }}>
        <div style={{
          backgroundColor: 'var(--coral-bg)',
          border: '1.5px dashed var(--coral-light)',
          borderRadius: '16px',
          padding: '48px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            backgroundColor: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}>📷</div>
          <p style={{
            fontSize: '14px',
            color: 'var(--graphite-600)',
            textAlign: 'center',
            margin: 0,
          }}>Сфотографируйте обложку книги</p>
        </div>
        <button style={{
          width: '100%',
          height: '44px',
          backgroundColor: 'var(--coral-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: '12px',
        }}>
          Сделать фото
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--graphite-300)' }}>или</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>
        <button style={{
          width: '100%',
          height: '44px',
          backgroundColor: 'transparent',
          color: 'var(--graphite-900)',
          border: '1.5px solid var(--border)',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: '24px',
        }}>
          Выбрать из галереи
        </button>
        <p style={{
          textAlign: 'center',
          fontSize: '10.5px',
          color: 'var(--graphite-300)',
          margin: 0,
        }}>
          Убедитесь, что обложка хорошо видна и фото чёткое
        </p>
      </div>
    </main>
  )
}
