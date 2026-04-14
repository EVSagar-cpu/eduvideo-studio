import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Topbar() {
  const { stats, pipelineMode } = useApp()
  const [search, setSearch] = useState('')

  return (
    <header style={{
      height: 'var(--topbar-h)', background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px',
      flexShrink: 0,
    }}>
      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: 'var(--r)', padding: '8px 14px',
        width: 260, transition: 'border-color 0.15s',
      }}
        onFocus={() => {}}
      >
        <span style={{ color: 'var(--text3)', fontSize: 14 }}>🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search studio…"
          style={{ background:'none', border:'none', outline:'none', color:'var(--text1)', fontSize:14, fontFamily:'var(--font)', flex:1 }}
        />
      </div>

      {/* Status chips */}
      <div style={{ display:'flex', gap:8, marginLeft:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', background:'var(--green-bg)', border:'1px solid rgba(22,163,74,0.15)', borderRadius:20 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', animation:'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize:12, fontWeight:600, color:'var(--green)' }}>Active</span>
        </div>
      </div>

      {/* Right: stats + action */}
      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
        {[
          { label:'Processed', n:stats.processed },
          { label:'Pending',   n:stats.pending },
          { label:'Review',    n:stats.review, highlight:true },
        ].map(s => (
          <div key={s.label} style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'5px 12px',
            background: s.highlight ? 'var(--amber-bg)' : 'var(--surface2)',
            border: `1px solid ${s.highlight ? 'rgba(217,119,6,0.15)' : 'var(--border)'}`,
            borderRadius:20, fontSize:12,
          }}>
            <span style={{ fontWeight:700, color: s.highlight ? 'var(--amber)' : 'var(--text1)' }}>{s.n}</span>
            <span style={{ color:'var(--text3)' }}>{s.label}</span>
          </div>
        ))}

        <button style={{
          padding:'8px 18px', background:'var(--blue)', border:'none',
          borderRadius:'var(--r)', color:'#fff', fontFamily:'var(--font)',
          fontSize:13.5, fontWeight:700, cursor:'pointer', letterSpacing:'-0.1px',
          display:'flex', alignItems:'center', gap:7,
        }}>
          <span style={{ fontSize:11 }}>▶</span> Create New
        </button>

        {/* Avatar */}
        <div style={{
          width:34, height:34, borderRadius:'50%',
          background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer',
        }}>S</div>
      </div>
    </header>
  )
}
