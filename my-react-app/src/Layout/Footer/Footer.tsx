// Ultra-minimal footer with single color

export const Footer = () => {
  return (
    <footer style={{
      padding: 'var(--spacing-sm) 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-sm)',
          minHeight: '24px'
        }}>
          <span style={{ 
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            fontWeight: 'var(--font-weight-normal)',
            textAlign: 'center'
          }}>
            &copy; 2024 Recipe Hub • About • Privacy • Contact
          </span>
        </div>
      </div>
    </footer>
  )
}
