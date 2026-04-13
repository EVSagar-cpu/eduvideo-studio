import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const NAV = [
  { label: 'Pipeline', items: [
    { to: '/',           icon: '⬡', label: 'Dashboard' },
    { to: '/upload',     icon: '⬆', label: 'Upload / Ingest' },
    { to: '/queue',      icon: '☰', label: 'Review Queue',  badge: 'review' },
    { to: '/batch',      icon: '⚡', label: 'Batch Queue',   badge: 'batch' },
  ]},
  { label: 'Creation', items: [
    { to: '/scenes',     icon: '▤', label: 'Scene Editor' },
    { to: '/voices',     icon: '♪', label: 'Voice / TTS' },
    { to: '/output',     icon: '✦', label: 'Output Library', badge: 'done' },
  ]},
]

export default function Sidebar() {
  const { stats, pipelineMode, setPipelineMode } = useApp()
  const location = useLocation()

  const badges = {
    review: stats.review,
    done: stats.processed,
    batch: '—',
  }

  return (
    <aside style={{
      background: 'var(--navy2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 0',
      gap: 2,
      overflowY: 'auto',
    }}>
      {NAV.map(section => (
        <div key={section.label} style={{ padding: '0 12px', marginBottom: 4 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, color: 'var(--text3)',
            letterSpacing: '.08em', textTransform: 'uppercase',
            padding: '8px 8px 4px',
          }}>
            {section.label}
          </div>
          {section.items.map(item => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '7px 8px', borderRadius: 7,
                  fontSize: 12,
                  color: isActive ? 'var(--accent2)' : 'var(--text2)',
                  background: isActive ? 'rgba(79,124,255,0.14)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background 0.1s, color 0.1s',
                }}
              >
                <span style={{ fontSize: 13, opacity: isActive ? 1 : 0.65 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && badges[item.badge] != null && (
                  <span style={{
                    marginLeft: 'auto',
                    padding: '1px 6px',
                    background: item.badge === 'review'
                      ? 'rgba(245,166,35,0.2)'
                      : 'rgba(79,124,255,0.2)',
                    color: item.badge === 'review' ? 'var(--amber)' : 'var(--accent2)',
                    borderRadius: 10, fontSize: 10, fontWeight: 600,
                  }}>
                    {badges[item.badge]}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      ))}

      <div style={{ height: 1, background: 'var(--border)', margin: '8px 12px' }} />

      {/* Pipeline mode toggle */}
      <div style={{ padding: '0 20px', marginTop: 4 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 8, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>Mode</div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 7, padding: 3, gap: 2 }}>
          {['V1', 'V2'].map(m => (
            <button
              key={m}
              onClick={() => setPipelineMode(m)}
              style={{
                flex: 1, padding: '5px 0', borderRadius: 5,
                fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: pipelineMode === m ? 'var(--accent)' : 'transparent',
                color: pipelineMode === m ? '#fff' : 'var(--text2)',
                transition: 'all 0.15s', fontFamily: 'var(--font)',
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5 }}>
          {pipelineMode === 'V1' ? 'Free · Open-source only' : 'Budget · ElevenLabs + GPT-4o'}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', background: 'var(--panel)',
          border: '1px solid var(--border)', borderRadius: 8, fontSize: 11,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--green)',
            boxShadow: '0 0 0 2px rgba(46,204,133,0.25)',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ color: 'var(--text2)' }}>Pipeline</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, color: 'var(--accent2)' }}>{pipelineMode}</span>
        </div>
      </div>
    </aside>
  )
}
