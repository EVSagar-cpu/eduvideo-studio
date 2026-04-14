import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

const NAV = [
  { label: 'Pipeline', items: [
    { to: '/',       icon: '⊞', label: 'Dashboard' },
    { to: '/upload', icon: '↑', label: 'Upload' },
    { to: '/queue',  icon: '≡', label: 'Review Queue', badge: 'review' },
    { to: '/batch',  icon: '⚡', label: 'Batch Queue' },
  ]},
  { label: 'Creation', items: [
    { to: '/scenes', icon: '▤', label: 'Scene Editor' },
    { to: '/voices', icon: '♪', label: 'Voice / TTS' },
    { to: '/output', icon: '✦', label: 'Output Library' },
  ]},
]

export default function Sidebar() {
  const { stats, pipelineMode, setPipelineMode } = useApp()
  const { theme, toggle } = useTheme()
  const location = useLocation()

  return (
    <aside style={{ background:'var(--bg2)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', flexShrink:0 }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'18px 16px 16px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ width:32, height:32, background:'var(--blue)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="2,1 12,7 2,13" fill="white"/></svg>
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--text1)', letterSpacing:'-0.3px', lineHeight:1.2 }}>EduVideo</div>
          <div style={{ fontSize:10, fontWeight:600, color:'var(--text3)', letterSpacing:'.08em', textTransform:'uppercase' }}>Studio Pro</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
        {NAV.map(section => (
          <div key={section.label} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--text3)', letterSpacing:'.07em', textTransform:'uppercase', padding:'0 8px', marginBottom:4 }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
              const badge = item.badge === 'review' ? stats.review : null
              return (
                <NavLink key={item.to} to={item.to} style={{
                  display:'flex', alignItems:'center', gap:9, padding:'8px 10px',
                  borderRadius:'var(--r)', fontSize:14, fontWeight:500, textDecoration:'none',
                  color: isActive ? 'var(--blue)' : 'var(--text2)',
                  background: isActive ? 'var(--blue-bg)' : 'transparent',
                  transition:'all 0.12s', marginBottom:1,
                }}>
                  <span style={{ fontSize:13, width:18, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                  {badge != null && (
                    <span style={{ padding:'1px 7px', borderRadius:20, fontSize:11, fontWeight:700, background:'var(--amber-bg)', color:'var(--amber)' }}>
                      {badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding:'12px 10px', borderTop:'1px solid var(--border)' }}>
        {/* Theme toggle */}
        <button onClick={toggle} style={{
          width:'100%', display:'flex', alignItems:'center', gap:9, padding:'8px 10px',
          borderRadius:'var(--r)', border:'1px solid var(--border)', background:'var(--surface2)',
          color:'var(--text2)', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'var(--font)',
          marginBottom:10, transition:'all 0.15s',
        }}>
          <span>{theme === 'light' ? '☽' : '☀'}</span>
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Mode toggle */}
        <div style={{ fontSize:11, fontWeight:600, color:'var(--text3)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:7, padding:'0 2px' }}>
          Pipeline Mode
        </div>
        <div style={{ display:'flex', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:3, gap:2, marginBottom:8 }}>
          {['V1','V2'].map(m => (
            <button key={m} onClick={() => setPipelineMode(m)} style={{
              flex:1, padding:'5px 0', borderRadius:6, border:'none', fontSize:12, fontWeight:700,
              cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.15s',
              background: pipelineMode===m ? 'var(--blue)' : 'transparent',
              color: pipelineMode===m ? '#fff' : 'var(--text2)',
            }}>{m}</button>
          ))}
        </div>
        <div style={{ fontSize:11, color:'var(--text3)', padding:'0 2px' }}>
          {pipelineMode === 'V1' ? 'Free · open-source only' : 'ElevenLabs · GPT-4o · Topaz'}
        </div>
      </div>
    </aside>
  )
}
