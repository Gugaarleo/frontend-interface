export default function Loader({ label = 'Carregando...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', padding: '1.5rem' }}>
      <div className="spinner" />
      <span className="muted">{label}</span>
    </div>
  )
}
