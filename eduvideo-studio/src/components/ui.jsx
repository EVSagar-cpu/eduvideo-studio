// ─── Shared UI Components ───────────────────────────────────────

export function Badge({ children, variant = 'default', dot = true }) {
  const styles = {
    done:       { bg: 'rgba(46,204,133,0.12)',  color: 'var(--green)',   dot: 'var(--green)' },
    processing: { bg: 'rgba(79,124,255,0.12)',  color: 'var(--accent2)', dot: 'var(--accent)' },
    pending:    { bg: 'rgba(255,255,255,0.07)', color: 'var(--text2)',   dot: 'var(--text3)' },
    failed:     { bg: 'rgba(255,94,94,0.12)',   color: 'var(--red)',     dot: 'var(--red)' },
    review:     { bg: 'rgba(245,166,35,0.12)',  color: 'var(--amber)',   dot: 'var(--amber)' },
    enhance:    { bg: 'rgba(27,208,165,0.1)',   color: 'var(--teal)',    dot: 'var(--teal)' },
    recreate:   { bg: 'rgba(79,124,255,0.1)',   color: 'var(--accent2)', dot: 'var(--accent)' },
    default:    { bg: 'rgba(255,255,255,0.07)', color: 'var(--text2)',   dot: 'var(--text3)' },
  }
  const s = styles[variant] || styles.default
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 20,
      background: s.bg, color: s.color,
      fontSize: 10, fontWeight: 600, letterSpacing: '.04em',
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />}
      {children}
    </span>
  )
}

export function RoutePill({ route }) {
  const map = {
    enhance: { label: 'Enhance', bg: 'rgba(27,208,165,0.1)', color: 'var(--teal)', border: 'rgba(27,208,165,0.25)' },
    recreate: { label: 'Recreate', bg: 'rgba(79,124,255,0.1)', color: 'var(--accent2)', border: 'rgba(79,124,255,0.25)' },
    review: { label: 'Review', bg: 'rgba(245,166,35,0.1)', color: 'var(--amber)', border: 'rgba(245,166,35,0.25)' },
    pending: { label: 'Pending', bg: 'rgba(255,255,255,0.05)', color: 'var(--text3)', border: 'var(--border)' },
  }
  const s = map[route] || map.pending
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 10, fontWeight: 700,
    }}>
      {s.label}
    </span>
  )
}

export function Btn({ children, variant = 'primary', onClick, size = 'md', disabled, style: extraStyle }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', borderRadius: 7, fontFamily: 'var(--font)',
    fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'opacity 0.15s',
    whiteSpace: 'nowrap', ...extraStyle,
  }
  const sizes = {
    sm: { padding: '4px 10px', fontSize: 11 },
    md: { padding: '7px 14px', fontSize: 12 },
    lg: { padding: '9px 18px', fontSize: 13 },
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    outline: { background: 'transparent', color: 'var(--text1)', border: '1px solid var(--border2)' },
    ghost:   { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
    danger:  { background: 'rgba(255,94,94,0.15)', color: 'var(--red)', border: '1px solid rgba(255,94,94,0.2)' },
    teal:    { background: 'rgba(27,208,165,0.12)', color: 'var(--teal)', border: '1px solid rgba(27,208,165,0.25)' },
  }
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 10, overflow: 'hidden', ...style
    }}>
      {children}
    </div>
  )
}

export function CardHead({ title, meta, actions }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', borderBottom: '1px solid var(--border)'
    }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
      {meta && <span style={{ fontSize: 11, color: 'var(--text2)', marginLeft: 'auto' }}>{meta}</span>}
      {actions && <div style={{ marginLeft: meta ? 0 : 'auto', display: 'flex', gap: 6 }}>{actions}</div>}
    </div>
  )
}

export function ScoreBar({ score }) {
  const color = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color }}>{score}</span>
    </div>
  )
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: 'var(--text3)',
      letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8
    }}>
      {children}
    </div>
  )
}

export function FormInput({ label, value, onChange, placeholder, type = 'text', style }) {
  return (
    <div style={style}>
      {label && <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', fontWeight: 500, marginBottom: 5 }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border2)', borderRadius: 7,
          padding: '8px 10px', color: 'var(--text1)',
          fontSize: 12, fontFamily: 'var(--font)', outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(79,124,255,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.13)'}
      />
    </div>
  )
}

export function Spinner({ size = 16 }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size, height: size,
      border: `2px solid rgba(255,255,255,0.1)`,
      borderTopColor: 'var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: 10 }}>
      <div style={{ fontSize: 32, opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)' }}>{sub}</div>}
    </div>
  )
}
