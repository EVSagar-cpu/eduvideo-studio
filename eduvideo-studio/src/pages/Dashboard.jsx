import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Badge, RoutePill, ScoreBar, Card, CardHead, Btn } from '../components/ui'

const PIPE_STEPS = ['Ingest','Classify','Transcript','LLM Clean','Script','Manim','TTS','Export']

export default function Dashboard() {
  const { videos, stats, activity } = useApp()
  const navigate = useNavigate()
  const activeVideo = videos.find(v => v.status === 'processing')
  const activePhase = activeVideo ? 3 : 0

  return (
    <div style={{ padding: 24, animation: 'fade-in 0.2s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Pipeline Overview</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>
            Batch 04 · 2000-video project · Last sync 2 min ago
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="outline">Export Report</Btn>
          <Btn variant="primary" onClick={() => navigate('/batch')}>▶ Run Batch</Btn>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Videos', val: '2,000', meta: 'Gr. 6–12 · All subjects', color: 'var(--accent2)' },
          { label: 'Processed', val: stats.processed.toLocaleString(), meta: `↑ 97 today`, color: 'var(--green)' },
          { label: 'Pending', val: stats.pending.toLocaleString(), meta: '~14 days at current pace', color: 'var(--text1)' },
          { label: 'Needs Review', val: stats.review, meta: 'Score 50–60% edge cases', color: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 5 }}>{s.meta}</div>
          </div>
        ))}
      </div>

      {/* Body two-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <div>
          {/* Recent videos table */}
          <Card style={{ marginBottom: 16 }}>
            <CardHead title="Recent Videos" meta={<span style={{ color: 'var(--accent2)', cursor: 'pointer' }} onClick={() => navigate('/queue')}>See all →</span>} />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Title','Grade','Score','Route','Status'].map(h => (
                    <th key={h} style={{
                      fontSize: 10, fontWeight: 600, color: 'var(--text3)',
                      textTransform: 'uppercase', letterSpacing: '.06em',
                      padding: '8px 16px', textAlign: 'left',
                      borderBottom: '1px solid var(--border)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {videos.slice(0, 5).map(v => (
                  <tr
                    key={v.id}
                    onClick={() => navigate(`/video/${v.id}`)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '9px 16px', fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.035)' }}>{v.title}</td>
                    <td style={{ padding: '9px 16px', fontSize: 12, color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.035)' }}>Gr. {v.grade}</td>
                    <td style={{ padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.035)' }}><ScoreBar score={v.qualityScore} /></td>
                    <td style={{ padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.035)' }}><RoutePill route={v.route} /></td>
                    <td style={{ padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.035)' }}><Badge variant={v.status}>{v.status.charAt(0).toUpperCase() + v.status.slice(1)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Active pipeline */}
          <Card>
            <CardHead title={`Active Pipeline · ${activeVideo?.title ?? 'No active job'}`} />
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {PIPE_STEPS.map((step, i) => {
                const done = i < activePhase
                const active = i === activePhase
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        background: done ? 'rgba(46,204,133,0.15)' : active ? 'rgba(79,124,255,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${done ? 'rgba(46,204,133,0.3)' : active ? 'rgba(79,124,255,0.35)' : 'var(--border)'}`,
                        color: done ? 'var(--green)' : active ? 'var(--accent2)' : 'var(--text3)',
                      }}>
                        {done ? '✓' : active ? '⚡' : '⊙'}
                      </div>
                      <span style={{
                        fontSize: 10,
                        color: done ? 'var(--green)' : active ? 'var(--accent2)' : 'var(--text3)',
                        whiteSpace: 'nowrap',
                      }}>{step}</span>
                    </div>
                    {i < PIPE_STEPS.length - 1 && (
                      <span style={{ color: 'var(--text3)', fontSize: 12, marginBottom: 14 }}>→</span>
                    )}
                  </div>
                )
              })}
            </div>
            {activeVideo && (
              <div style={{ padding: '0 16px 14px' }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${(activePhase / PIPE_STEPS.length) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 2, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                  Phase {activePhase + 1} of {PIPE_STEPS.length} · LLM cleaning transcript · ~3 min remaining
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Route split */}
          <Card>
            <CardHead title="Route Split" />
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: '✦ Enhance', pct: 68, count: 346, color: 'var(--teal)' },
                { label: '↺ Recreate', pct: 27, count: 138, color: 'var(--accent)' },
                { label: '⚑ Review', pct: 5, count: 28, color: 'var(--amber)' },
              ].map(r => (
                <div key={r.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                    <span style={{ color: r.color }}>{r.label}</span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{r.pct}% · {r.count} videos</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${r.pct}%`, height: '100%', background: r.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity log */}
          <Card style={{ flex: 1 }}>
            <CardHead title="Activity Log" />
            <div style={{ overflowY: 'auto', maxHeight: 220 }}>
              {activity.map(a => {
                const dotColor = a.type === 'success' ? 'var(--green)' : a.type === 'warning' ? 'var(--amber)' : 'var(--accent2)'
                return (
                  <div key={a.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0, marginTop: 4 }} />
                    <div>
                      <div style={{ fontSize: 12 }}>{a.msg}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2, fontFamily: 'var(--mono)' }}>{a.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Quick stats */}
          <Card>
            <CardHead title="Subject Breakdown" />
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { s: 'Mathematics', n: 38, color: 'var(--accent2)' },
                { s: 'Physics', n: 24, color: 'var(--teal)' },
                { s: 'Biology', n: 20, color: 'var(--green)' },
                { s: 'Chemistry', n: 18, color: 'var(--amber)' },
              ].map(r => (
                <div key={r.s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text2)', width: 80, flexShrink: 0 }}>{r.s}</span>
                  <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${r.n}%`, height: '100%', background: r.color, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', width: 24, textAlign: 'right' }}>{r.n}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
