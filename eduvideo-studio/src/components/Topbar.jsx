import { useApp } from '../context/AppContext'

export default function Topbar() {
  const { stats, pipelineMode } = useApp()

  return (
    <header style={{
      gridColumn: '1 / -1',
      background: 'var(--navy2)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      height: 52,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 20px', borderRight: '1px solid var(--border)',
        height: '100%', minWidth: 220,
      }}>
        <div style={{
          width: 28, height: 28,
          background: 'var(--accent)', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <polygon points="4,3 13,8 4,13" fill="white"/>
          </svg>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px' }}>
          Edu<span style={{ color: 'var(--accent2)' }}>Video</span> Studio
        </span>
      </div>

      {/* Center tabs */}
      <div style={{ display: 'flex', height: '100%', alignItems: 'stretch', paddingLeft: 8 }}>
        {[
          { label: 'Batch 04', active: true, dot: true },
          { label: '2000-video project' },
          { label: `Mode: ${pipelineMode}`, highlight: true },
        ].map(t => (
          <div key={t.label} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '0 18px', fontSize: 12, fontWeight: 500,
            color: t.active ? 'var(--accent2)' : t.highlight ? 'var(--teal)' : 'var(--text2)',
            borderBottom: `2px solid ${t.active ? 'var(--accent)' : 'transparent'}`,
            whiteSpace: 'nowrap',
          }}>
            {t.dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />}
            {t.label}
          </div>
        ))}
      </div>

      {/* Right stats */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
        {[
          { n: `${stats.processed}`, l: 'processed' },
          { n: `${stats.pending}`, l: 'pending' },
          { n: `${stats.review}`, l: 'review' },
        ].map(s => (
          <div key={s.l} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: 6, fontSize: 11,
          }}>
            <span style={{ fontWeight: 700 }}>{s.n}</span>
            <span style={{ color: 'var(--text3)' }}>{s.l}</span>
          </div>
        ))}
        <button style={{
          padding: '5px 12px', background: 'var(--accent)',
          color: '#fff', borderRadius: 6, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>
          ▶ Run Batch
        </button>
      </div>
    </header>
  )
}
