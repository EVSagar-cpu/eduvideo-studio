// ─── Shared UI Components ─────────────────────────────────────────

export function Badge({ children, variant = 'default' }) {
  const styles = {
    done:       { bg:'var(--green-bg)',  color:'var(--green)',  dot:'var(--green)' },
    processing: { bg:'var(--blue-bg)',   color:'var(--blue2)',  dot:'var(--blue)' },
    pending:    { bg:'var(--surface2)',  color:'var(--text2)',  dot:'var(--text3)' },
    failed:     { bg:'var(--red-bg)',    color:'var(--red)',    dot:'var(--red)' },
    review:     { bg:'var(--amber-bg)', color:'var(--amber)',  dot:'var(--amber)' },
    enhance:    { bg:'var(--teal-bg)',   color:'var(--teal)',   dot:'var(--teal)' },
    recreate:   { bg:'var(--blue-bg)',   color:'var(--blue2)',  dot:'var(--blue)' },
    default:    { bg:'var(--surface2)',  color:'var(--text2)',  dot:'var(--text3)' },
  }
  const s = styles[variant] || styles.default
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'3px 9px', borderRadius:20,
      background:s.bg, color:s.color,
      fontSize:12, fontWeight:600,
    }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot, flexShrink:0,
        animation: variant==='processing' ? 'pulse 1.5s ease-in-out infinite' : 'none'
      }} />
      {children}
    </span>
  )
}

export function RoutePill({ route }) {
  const map = {
    enhance: { label:'Enhance', bg:'var(--teal-bg)',  color:'var(--teal)',  border:'rgba(13,148,136,0.2)' },
    recreate:{ label:'Recreate',bg:'var(--blue-bg)',  color:'var(--blue2)', border:'rgba(59,130,246,0.2)' },
    review:  { label:'Review',  bg:'var(--amber-bg)', color:'var(--amber)', border:'rgba(217,119,6,0.2)' },
    pending: { label:'Pending', bg:'var(--surface2)', color:'var(--text3)', border:'var(--border)' },
  }
  const s = map[route] || map.pending
  return (
    <span style={{
      padding:'3px 10px', borderRadius:6,
      background:s.bg, color:s.color,
      border:`1px solid ${s.border}`,
      fontSize:12, fontWeight:600,
    }}>{s.label}</span>
  )
}

export function Btn({ children, variant='primary', onClick, size='md', disabled, style:extra }) {
  const sizes = { sm:{padding:'5px 12px',fontSize:12}, md:{padding:'8px 16px',fontSize:13.5}, lg:{padding:'10px 20px',fontSize:14} }
  const variants = {
    primary: { background:'var(--blue)', color:'#fff', border:'none' },
    outline: { background:'transparent', color:'var(--text1)', border:'1px solid var(--border2)' },
    ghost:   { background:'transparent', color:'var(--text2)', border:'1px solid var(--border)' },
    danger:  { background:'var(--red-bg)', color:'var(--red)', border:'1px solid rgba(220,38,38,0.2)' },
    teal:    { background:'var(--teal-bg)', color:'var(--teal)', border:'1px solid rgba(13,148,136,0.2)' },
    green:   { background:'var(--green-bg)', color:'var(--green)', border:'1px solid rgba(22,163,74,0.2)' },
  }
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        display:'inline-flex', alignItems:'center', gap:6,
        borderRadius:'var(--r)', fontFamily:'var(--font)', fontWeight:600,
        cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1,
        whiteSpace:'nowrap', transition:'all 0.15s',
        ...sizes[size], ...variants[variant], ...extra,
      }}
      onMouseEnter={e => { if(!disabled && variant==='primary') e.currentTarget.style.opacity='0.88' }}
      onMouseLeave={e => { if(!disabled) e.currentTarget.style.opacity='1' }}
    >
      {children}
    </button>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--border)',
      borderRadius:'var(--r2)', overflow:'hidden',
      boxShadow:'var(--shadow-sm)', ...style
    }}>
      {children}
    </div>
  )
}

export function CardHead({ title, meta, actions }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'14px 20px', borderBottom:'1px solid var(--border)'
    }}>
      <span style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>{title}</span>
      {meta && <span style={{ fontSize:13, color:'var(--text2)', marginLeft:'auto' }}>{meta}</span>}
      {actions && <div style={{ marginLeft:meta?0:'auto', display:'flex', gap:6 }}>{actions}</div>}
    </div>
  )
}

export function ScoreBar({ score }) {
  const color = score>=80 ? 'var(--green)' : score>=50 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ width:60, height:4, background:'var(--surface2)', borderRadius:2, overflow:'hidden', border:'1px solid var(--border)' }}>
        <div style={{ width:`${score}%`, height:'100%', background:color, borderRadius:2 }} />
      </div>
      <span style={{ fontFamily:'var(--mono)', fontSize:12, fontWeight:500, color, minWidth:20 }}>{score}</span>
    </div>
  )
}

export function SectionLabel({ children, style }) {
  return (
    <div style={{ fontSize:11, fontWeight:600, color:'var(--text3)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:10, ...style }}>
      {children}
    </div>
  )
}

export function FormInput({ label, value, onChange, placeholder, type='text', style }) {
  return (
    <div style={style}>
      {label && <label style={{ display:'block', fontSize:13, color:'var(--text2)', fontWeight:500, marginBottom:6 }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width:'100%', background:'var(--surface2)',
          border:'1px solid var(--border2)', borderRadius:'var(--r)',
          padding:'9px 12px', color:'var(--text1)',
          fontSize:14, fontFamily:'var(--font)', outline:'none',
          transition:'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor='var(--blue)'}
        onBlur={e => e.target.style.borderColor='var(--border2)'}
      />
    </div>
  )
}

export function Spinner({ size=16 }) {
  return (
    <span style={{
      display:'inline-block', width:size, height:size,
      border:`2px solid var(--border2)`, borderTopColor:'var(--blue)',
      borderRadius:'50%', animation:'spin 0.7s linear infinite',
    }} />
  )
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 24px', gap:10 }}>
      <div style={{ fontSize:36, opacity:0.3 }}>{icon}</div>
      <div style={{ fontSize:15, fontWeight:600, color:'var(--text2)' }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:'var(--text3)' }}>{sub}</div>}
    </div>
  )
}

export function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--border)',
      borderRadius:'var(--r2)', padding:'20px 22px',
      boxShadow:'var(--shadow-sm)',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <span style={{ fontSize:12, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</span>
        {icon && <span style={{ fontSize:20, opacity:0.4 }}>{icon}</span>}
      </div>
      <div style={{ fontSize:30, fontWeight:700, letterSpacing:'-1px', lineHeight:1, color:color||'var(--text1)' }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:'var(--text2)', marginTop:8 }}>{sub}</div>}
    </div>
  )
}
