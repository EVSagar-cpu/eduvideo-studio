import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Badge, Card, CardHead, Btn } from '../components/ui'

const fmtTime = (s) => s ? `${Math.floor(s/60)}m ${s%60}s` : '—'

export default function OutputLibrary() {
  const { videos } = useApp()
  const done = videos.filter(v => v.status === 'done')
  const [view, setView]     = useState('grid') // grid | list
  const [preview, setPreview] = useState(null)
  const [search, setSearch] = useState('')
  const [gradeF, setGradeF] = useState('All')

  const filtered = done.filter(v => {
    const q = !search || v.title.toLowerCase().includes(search.toLowerCase())
    const g = gradeF === 'All' || v.grade === parseInt(gradeF)
    return q && g
  })

  const totalRuntime = filtered.reduce((a, v) => a + (v.finalDuration || 720), 0)

  return (
    <div style={{ padding: 24, animation: 'fade-in 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Output Library</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>
            {filtered.length} final videos · {fmtTime(totalRuntime)} total runtime
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="outline">⬇ Export All</Btn>
          <Btn variant="primary">☁ Upload to Drive</Btn>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { n: done.length, l: 'Total Done', color: 'var(--green)' },
          { n: done.filter(v=>v.route==='enhance').length, l: 'Enhanced', color: 'var(--teal)' },
          { n: done.filter(v=>v.route==='recreate').length, l: 'Recreated', color: 'var(--accent2)' },
          { n: fmtTime(done.reduce((a,v)=>a+(v.finalDuration||720),0)), l: 'Total Runtime', color: 'var(--text1)' },
        ].map(s => (
          <div key={s.l} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, color: s.color }}>{s.n}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filters + view toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search outputs…"
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)', borderRadius: 8, padding: '7px 12px', color: 'var(--text1)', fontSize: 12, fontFamily: 'var(--font)', outline: 'none' }}
        />
        <select value={gradeF} onChange={e => setGradeF(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)', borderRadius: 7, padding: '7px 10px', color: 'var(--text1)', fontSize: 12, fontFamily: 'var(--font)', outline: 'none' }}>
          <option value="All">All Grades</option>
          {[6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
        </select>
        {/* View toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 6, padding: 2, gap: 2 }}>
          {[['grid','⊞'],['list','☰']].map(([v,icon]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: view === v ? 'var(--accent)' : 'transparent',
              color: view === v ? '#fff' : 'var(--text2)',
              fontFamily: 'var(--font)', fontSize: 13,
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
          No completed videos yet · Run the pipeline to generate outputs
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {filtered.map(v => (
            <div
              key={v.id}
              style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onClick={() => setPreview(v)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {/* Thumbnail */}
              <div style={{ background: '#1a1a2e', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(79,124,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>▶</div>
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', padding: '2px 7px', borderRadius: 4, fontSize: 10, fontFamily: 'var(--mono)', color: '#fff' }}>
                  {fmtTime(v.finalDuration || 720)}
                </div>
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <Badge variant={v.route === 'enhance' ? 'enhance' : 'recreate'}>
                    {v.route === 'enhance' ? 'Enhanced' : 'Recreated'}
                  </Badge>
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{v.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8 }}>
                  {v.subject} · Grade {v.grade} · {v.school}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn variant="primary" size="sm" onClick={e => { e.stopPropagation() }}>⬇ Download</Btn>
                  <Btn variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setPreview(v) }}>Preview</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Title','Subject','Grade','Duration','Route','Processed','Actions'].map(h => (
                <th key={h} style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', padding: '9px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <td style={{ padding: '9px 14px', fontSize: 12, fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{v.title}</td>
                  <td style={{ padding: '9px 14px', fontSize: 11, color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{v.subject}</td>
                  <td style={{ padding: '9px 14px', fontSize: 11, color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Gr. {v.grade}</td>
                  <td style={{ padding: '9px 14px', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{fmtTime(v.finalDuration || 720)}</td>
                  <td style={{ padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <Badge variant={v.route === 'enhance' ? 'enhance' : 'recreate'}>{v.route}</Badge>
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    {v.processedAt ? new Date(v.processedAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Btn variant="primary" size="sm">⬇</Btn>
                      <Btn variant="ghost" size="sm" onClick={() => setPreview(v)}>▶</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setPreview(null)}
        >
          <div
            style={{ background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 12, width: 680, maxHeight: '80vh', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{preview.title}</span>
              <button onClick={() => setPreview(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text2)', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ background: '#111320', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(79,124,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 10px', cursor: 'pointer' }}>▶</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>Preview · {fmtTime(preview.finalDuration || 720)}</div>
              </div>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', gap: 8 }}>
              <Btn variant="primary">⬇ Download MP4</Btn>
              <Btn variant="outline">View Scene Breakdown</Btn>
              <Btn variant="ghost" style={{ marginLeft: 'auto' }} onClick={() => setPreview(null)}>Close</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
