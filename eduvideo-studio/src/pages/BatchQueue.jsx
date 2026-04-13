import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Badge, RoutePill, Card, CardHead, Btn, Spinner } from '../components/ui'

export default function BatchQueue() {
  const { videos, updateVideo, addActivity } = useApp()
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState({})
  const [batchSize, setBatchSize] = useState('50')

  const queued = videos.filter(v => v.status === 'pending')
  const processing = videos.filter(v => v.status === 'processing')
  const done = videos.filter(v => v.status === 'done')
  const failed = videos.filter(v => v.status === 'failed')

  const runBatch = async () => {
    setRunning(true)
    const batch = queued.slice(0, parseInt(batchSize))
    for (const v of batch) {
      updateVideo(v.id, { status: 'processing' })
      setProgress(p => ({ ...p, [v.id]: { phase: 0, pct: 0 } }))
      await new Promise(r => setTimeout(r, 400))
    }
    // Simulate progress
    for (let i = 1; i <= 8; i++) {
      await new Promise(r => setTimeout(r, 600))
      batch.forEach(v => {
        setProgress(p => ({ ...p, [v.id]: { phase: i, pct: Math.round((i/8)*100) } }))
      })
    }
    batch.forEach(v => updateVideo(v.id, { status: 'done' }))
    addActivity(`Batch complete · ${batch.length} videos processed`, 'success')
    setRunning(false)
    setProgress({})
  }

  const PHASES = ['Ingest','Classify','Transcribe','LLM Clean','Script','Manim','TTS','Export']

  return (
    <div style={{ padding: 24, animation: 'fade-in 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Batch Queue</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>Process multiple videos overnight</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={batchSize} onChange={e => setBatchSize(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)', borderRadius: 7, padding: '7px 10px', color: 'var(--text1)', fontSize: 12, fontFamily: 'var(--font)', outline: 'none' }}
          >
            {['10','25','50','100'].map(n => <option key={n} value={n}>{n} videos</option>)}
          </select>
          <Btn variant="primary" onClick={runBatch} disabled={running || queued.length === 0}>
            {running ? <><Spinner size={12} /> Running…</> : `▶ Run Batch (${Math.min(queued.length, parseInt(batchSize))})`}
          </Btn>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { n: queued.length, l: 'Queued', color: 'var(--text1)' },
          { n: processing.length, l: 'Processing', color: 'var(--accent2)' },
          { n: done.length, l: 'Done', color: 'var(--green)' },
          { n: failed.length, l: 'Failed', color: 'var(--red)' },
        ].map(s => (
          <div key={s.l} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: s.color }}>{s.n}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Active jobs */}
      {(processing.length > 0 || running) && (
        <Card style={{ marginBottom: 16 }}>
          <CardHead title="Active Jobs" meta={<span style={{ color: 'var(--accent2)', fontFamily: 'var(--mono)', fontSize: 11 }}>{processing.length} running</span>} />
          <div style={{ padding: '8px 0' }}>
            {videos.filter(v => v.status === 'processing').map(v => {
              const p = progress[v.id] || { phase: 3, pct: 38 }
              return (
                <div key={v.id} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{v.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{p.pct}%</span>
                  </div>
                  {/* Mini phase tracker */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                    {PHASES.map((ph, i) => (
                      <div key={ph} title={ph} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: i < p.phase ? 'var(--green)' : i === p.phase ? 'var(--accent)' : 'rgba(255,255,255,0.07)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                    Phase {Math.min(p.phase + 1, 8)} of 8 · {PHASES[Math.min(p.phase, 7)]}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Queued table */}
      <Card>
        <CardHead title="Pending Queue" meta={`${queued.length} videos`} />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#','Title','Grade','Subject','Route','Est. Time'].map(h => (
                <th key={h} style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', padding: '8px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queued.map((v, i) => (
              <tr key={v.id}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding: '8px 14px', fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{i+1}</td>
                <td style={{ padding: '8px 14px', fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: 500 }}>{v.title}</td>
                <td style={{ padding: '8px 14px', fontSize: 11, color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Gr. {v.grade}</td>
                <td style={{ padding: '8px 14px', fontSize: 11, color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{v.subject}</td>
                <td style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}><RoutePill route={v.route} /></td>
                <td style={{ padding: '8px 14px', fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  {v.route === 'recreate' ? '~18 min' : '~8 min'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {queued.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
            Queue is empty · Upload videos to get started
          </div>
        )}
        {queued.length > 0 && (
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>
              Est. total: ~{Math.round(queued.filter(v=>v.route==='recreate').length * 18 + queued.filter(v=>v.route!=='recreate').length * 8)} min
            </span>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>·</span>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>Target: 100 videos/day</span>
          </div>
        )}
      </Card>
    </div>
  )
}
