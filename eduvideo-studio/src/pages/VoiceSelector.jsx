import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Card, CardHead, Btn } from '../components/ui'
import { MOCK_VOICES_ELEVENLABS, MOCK_VOICES_COQUI } from '../lib/mockData'

const TAG_COLORS = {
  Educational: { bg: 'rgba(79,124,255,0.12)', color: 'var(--accent2)' },
  Calm:        { bg: 'rgba(27,208,165,0.1)',   color: 'var(--teal)' },
  Warm:        { bg: 'rgba(245,166,35,0.1)',   color: 'var(--amber)' },
  Academic:    { bg: 'rgba(155,143,255,0.12)', color: 'var(--purple)' },
  Free:        { bg: 'rgba(255,255,255,0.06)', color: 'var(--text2)' },
  Clear:       { bg: 'rgba(46,204,133,0.1)',   color: 'var(--green)' },
  Default:     { bg: 'rgba(255,255,255,0.06)', color: 'var(--text3)' },
}

function tagStyle(tag) {
  return TAG_COLORS[tag] || TAG_COLORS.Default
}

export default function VoiceSelector() {
  const { pipelineMode } = useApp()
  const [provider, setProvider] = useState(pipelineMode === 'V2' ? 'elevenlabs' : 'coqui')
  const [filter, setFilter]     = useState('All')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [playing, setPlaying]   = useState(null)
  const [testText, setTestText] = useState("A quadratic equation has the form ax squared plus bx plus c equals zero.")
  const [speed, setSpeed]       = useState(1.0)
  const [stability, setStability] = useState(0.75)
  const [clarity, setClarity]   = useState(0.85)

  const voices = provider === 'elevenlabs' ? MOCK_VOICES_ELEVENLABS : MOCK_VOICES_COQUI
  const filters = ['All', 'Indian', 'Male', 'Female', 'Educational']

  const filtered = voices.filter(v => {
    const f = filter === 'All' || v.accent === filter || v.gender === filter || v.tags.includes(filter)
    const s = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.lang.toLowerCase().includes(search.toLowerCase())
    return f && s
  })

  const simulatePlay = (id) => {
    if (playing === id) { setPlaying(null); return }
    setPlaying(id)
    setTimeout(() => setPlaying(null), 3000)
  }

  return (
    <div style={{ padding: 24, animation: 'fade-in 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Voice / TTS</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>Select and configure the voiceover engine</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {selected && <Btn variant="primary">Use {selected.name} for This Video</Btn>}
          <Btn variant="outline">Set as Default</Btn>
        </div>
      </div>

      {/* Provider toggle */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 7, padding: 3, gap: 2 }}>
          {[
            { id: 'elevenlabs', label: 'ElevenLabs', badge: 'V2 Paid', color: 'var(--teal)' },
            { id: 'coqui',      label: 'Coqui TTS',  badge: 'V1 Free', color: 'var(--text2)' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 14px', borderRadius: 5, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: 12, fontWeight: 500,
                background: provider === p.id ? 'var(--accent)' : 'transparent',
                color: provider === p.id ? '#fff' : 'var(--text2)',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
              <span style={{
                padding: '1px 6px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                background: provider === p.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                color: provider === p.id ? '#fff' : p.color,
              }}>{p.badge}</span>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
          {provider === 'elevenlabs' ? '~$5/month · Quality 5/5 · Indian accents available' : 'Free · Open-source · Quality 3/5'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        <div>
          {/* Search + filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
            <span style={{ color: 'var(--text3)' }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search voices…"
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text1)', fontSize: 12, fontFamily: 'var(--font)', flex: 1 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
                  border: `1px solid ${filter === f ? 'rgba(79,124,255,0.4)' : 'var(--border2)'}`,
                  background: filter === f ? 'rgba(79,124,255,0.15)' : 'transparent',
                  color: filter === f ? 'var(--accent2)' : 'var(--text2)',
                  cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.12s',
                }}
              >{f}</button>
            ))}
          </div>

          {/* Voice grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(172px, 1fr))', gap: 10 }}>
            {filtered.map(v => {
              const isSelected = selected?.id === v.id
              const isPlaying = playing === v.id
              return (
                <div
                  key={v.id}
                  onClick={() => setSelected(v)}
                  style={{
                    background: isSelected ? 'rgba(79,124,255,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 10, padding: 12, cursor: 'pointer',
                    position: 'relative', transition: 'all 0.15s',
                  }}
                >
                  {isSelected && (
                    <span style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 16, height: 16, borderRadius: '50%',
                      background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: '#fff',
                    }}>✓</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{v.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{v.lang}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                    {v.tags.slice(0,2).map(t => {
                      const ts = tagStyle(t)
                      return <span key={t} style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: ts.bg, color: ts.color }}>{t}</span>
                    })}
                    <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: 'var(--text3)' }}>{v.gender}</span>
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    onClick={e => { e.stopPropagation(); simulatePlay(v.id) }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: isPlaying ? 'var(--accent)' : 'rgba(79,124,255,0.2)',
                      border: `1px solid ${isPlaying ? 'var(--accent)' : 'rgba(79,124,255,0.3)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontSize: 10, cursor: 'pointer', transition: 'all 0.12s',
                    }}>
                      {isPlaying ? '■' : '▶'}
                    </div>
                    <div style={{ flex: 1, height: 18, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {Array.from({length: 24}).map((_, i) => (
                        <div key={i} style={{
                          width: 2, borderRadius: 1, flexShrink: 0,
                          height: `${6 + Math.abs(Math.sin(i * 0.7)) * 12}px`,
                          background: isPlaying
                            ? (i < 24 * 0.6 ? 'var(--accent)' : 'rgba(79,124,255,0.2)')
                            : isSelected ? 'rgba(79,124,255,0.35)' : 'rgba(255,255,255,0.15)',
                          transition: 'background 0.15s',
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: selected panel + settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {selected ? (
            <Card>
              <CardHead title="Selected Voice" />
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: selected.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: '#fff',
                  }}>{selected.initials}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{selected.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{selected.lang} · {selected.accent} · {selected.gender}</div>
                  </div>
                </div>

                {/* Test area */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 5, display: 'block' }}>Test Text</label>
                  <textarea
                    value={testText}
                    onChange={e => setTestText(e.target.value)}
                    style={{
                      width: '100%', minHeight: 60,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)',
                      borderRadius: 7, padding: '8px 10px',
                      color: 'var(--text1)', fontSize: 12, fontFamily: 'var(--font)',
                      outline: 'none', resize: 'vertical',
                    }}
                  />
                  <Btn variant="outline" size="sm" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
                    onClick={() => simulatePlay(`test-${selected.id}`)}>
                    {playing === `test-${selected.id}` ? '■ Stop' : '▶ Preview'} Sample
                  </Btn>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 12 }}>
                ← Select a voice to preview and configure
              </div>
            </Card>
          )}

          {/* Settings */}
          <Card>
            <CardHead title="Voice Settings" />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Speed', val: speed, set: setSpeed, min: 0.7, max: 1.3, step: 0.05, fmt: v => `${v.toFixed(2)}x` },
                { label: 'Stability', val: stability, set: setStability, min: 0, max: 1, step: 0.05, fmt: v => `${Math.round(v*100)}%` },
                { label: 'Clarity', val: clarity, set: setClarity, min: 0, max: 1, step: 0.05, fmt: v => `${Math.round(v*100)}%` },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text2)' }}>{s.label}</span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent2)' }}>{s.fmt(s.val)}</span>
                  </div>
                  <input
                    type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                    onChange={e => s.set(+e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
