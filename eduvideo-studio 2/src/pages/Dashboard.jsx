import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Badge, RoutePill, ScoreBar, Card, CardHead, StatCard, Btn } from '../components/ui'

const PIPE_STEPS = [
  { label:'Ingest',     desc:'Receiving raw lecture feeds' },
  { label:'Classify',   desc:'Topic & segment mapping' },
  { label:'Transcript', desc:'Multilingual voice to text' },
  { label:'LLM Clean',  desc:'Structural & clarity refine' },
  { label:'Script',     desc:'5-scene generation' },
  { label:'Manim',      desc:'Board animation render' },
  { label:'TTS',        desc:'Voiceover synthesis' },
  { label:'Export',     desc:'Final MP4 packaging' },
]

export default function Dashboard() {
  const { videos, stats, activity } = useApp()
  const navigate = useNavigate()
  const activeVideo = videos.find(v => v.status === 'processing')
  const activePhase = 3

  return (
    <div style={{ padding:'28px 28px', animation:'fade-in 0.2s ease' }}>
      {/* Page header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:700, letterSpacing:'-0.5px', color:'var(--text1)', lineHeight:1.2 }}>
          Studio Intelligence
        </h1>
        <p style={{ fontSize:14, color:'var(--text2)', marginTop:6, lineHeight:1.6 }}>
          Monitoring the automated transformation of educational lectures into cinematic learning experiences. All systems operational.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
        <StatCard label="Total Assets"  value="2,000" sub="Gr. 6–12 · All subjects" icon="▣" />
        <StatCard label="Processed"     value={stats.processed} sub="↑ 97 today · 25.6% complete" color="var(--green)" icon="✓" />
        <StatCard label="Pending"       value={stats.pending}   sub="~14 days at current pace" icon="○" />
        <StatCard label="Needs Review"  value={stats.review}    sub="Score 50–60% edge cases" color="var(--amber)" icon="!" />
      </div>

      {/* Active pipeline */}
      <Card style={{ marginBottom:28 }}>
        <div style={{ padding:'18px 22px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--text1)' }}>Active Transformation Pipeline</div>
            {activeVideo && <div style={{ fontSize:13, color:'var(--text2)', marginTop:3 }}>{activeVideo.title}</div>}
          </div>
          <span style={{ padding:'4px 12px', background:'var(--blue-bg)', color:'var(--blue)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:'.06em' }}>
            REAL-TIME STREAM
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, padding:'20px 22px', borderBottom:'1px solid var(--border)' }}>
          {PIPE_STEPS.slice(0,4).map((step, i) => {
            const done = i < activePhase
            const active = i === activePhase
            return (
              <div key={step.label} style={{
                padding:'16px 18px', borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width:44, height:44, borderRadius:10, marginBottom:12,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
                  background: done ? 'var(--blue)' : active ? 'var(--blue-bg)' : 'var(--surface2)',
                  border: done ? 'none' : active ? '1px solid rgba(37,99,235,0.3)' : '1px solid var(--border)',
                }}>
                  {done ? <span style={{ fontSize:18, color:'#fff' }}>↑</span>
                    : active ? <span style={{ fontSize:18, color:'var(--blue)' }}>≡</span>
                    : <span style={{ fontSize:18, color:'var(--text3)' }}>○</span>}
                </div>
                <div style={{ fontSize:14, fontWeight:700, color: done?'var(--text1)':active?'var(--blue)':'var(--text2)', marginBottom:4 }}>{step.label}</div>
                <div style={{ fontSize:12, color:'var(--text3)', marginBottom:10 }}>{step.desc}</div>
                <div style={{ height:3, background:'var(--surface2)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:2, transition:'width 0.5s ease',
                    background: done?'var(--blue)':active?'var(--blue2)':'transparent',
                    width: done?'100%':active?'62%':'0%',
                  }} />
                </div>
                <div style={{ fontSize:12, color: done?'var(--green)':active?'var(--blue)':'var(--text3)', marginTop:6, fontWeight:500 }}>
                  {done?'Completed':active?'40% Capacity':'Awaiting Batch'}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, padding:'20px 22px' }}>
          {PIPE_STEPS.slice(4).map((step, i) => (
            <div key={step.label} style={{ padding:'16px 18px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width:44, height:44, borderRadius:10, marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, background:'var(--surface2)', border:'1px dashed var(--border2)' }}>
                <span style={{ fontSize:18, color:'var(--text3)' }}>◇</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text2)', marginBottom:4 }}>{step.label}</div>
              <div style={{ fontSize:12, color:'var(--text3)', marginBottom:10 }}>{step.desc}</div>
              <div style={{ fontSize:12, color:'var(--text3)', fontWeight:500 }}>Awaiting Batch</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom two-col */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:16 }}>
        {/* Recent table */}
        <Card>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 22px', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontSize:16, fontWeight:700 }}>Recent Transformations</span>
            <span style={{ fontSize:13, color:'var(--blue)', fontWeight:600, cursor:'pointer' }} onClick={() => navigate('/queue')}>View All Records →</span>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--surface2)' }}>
                {['Video Title','Grade','AI Score','Route','Status',''].map(h => (
                  <th key={h} style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.06em', padding:'10px 18px', textAlign:'left', borderBottom:'1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {videos.slice(0,5).map(v => (
                <tr key={v.id}
                  onClick={() => navigate(`/video/${v.id}`)}
                  style={{ cursor:'pointer', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <td style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      {/* Thumbnail placeholder */}
                      <div style={{ width:48, height:34, borderRadius:6, background:`hsl(${v.grade*20},40%,${v.route==='enhance'?75:60}%)`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'rgba(0,0,0,0.4)', fontWeight:600 }}>
                        Gr.{v.grade}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>{v.title}</div>
                        <div style={{ fontSize:12, color:'var(--text3)', marginTop:1 }}>Uploaded {v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 18px', fontSize:13, fontWeight:600, color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>
                    {v.qualityScore >= 80 ? 'A+' : v.qualityScore >= 65 ? 'B' : v.qualityScore >= 50 ? 'C' : 'C-'}
                  </td>
                  <td style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}><ScoreBar score={v.qualityScore} /></td>
                  <td style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}><RoutePill route={v.route} /></td>
                  <td style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}><Badge variant={v.status}>{v.status==='done'?'Completed':v.status==='processing'?'Processing':v.status==='review'?'Manual Review':v.status==='failed'?'Failed':'Pending'}</Badge></td>
                  <td style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
                    <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:18 }}>⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Route split */}
          <Card>
            <CardHead title="Route Split" />
            <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { label:'Enhance',  pct:68, count:346, color:'var(--teal)',  bg:'var(--teal-bg)' },
                { label:'Recreate', pct:27, count:138, color:'var(--blue2)', bg:'var(--blue-bg)' },
                { label:'Review',   pct:5,  count:28,  color:'var(--amber)', bg:'var(--amber-bg)' },
              ].map(r => (
                <div key={r.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:7 }}>
                    <span style={{ fontWeight:600, color:r.color }}>{r.label}</span>
                    <span style={{ color:'var(--text2)', fontFamily:'var(--mono)', fontSize:12 }}>{r.pct}% · {r.count}</span>
                  </div>
                  <div style={{ height:6, background:'var(--surface2)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ width:`${r.pct}%`, height:'100%', background:r.color, borderRadius:3 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity */}
          <Card style={{ flex:1 }}>
            <CardHead title="Activity" />
            <div>
              {activity.slice(0,5).map(a => {
                const dotColor = a.type==='success'?'var(--green)':a.type==='warning'?'var(--amber)':'var(--blue2)'
                return (
                  <div key={a.id} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 20px', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:dotColor, flexShrink:0, marginTop:5 }} />
                    <div>
                      <div style={{ fontSize:13, color:'var(--text1)', lineHeight:1.5 }}>{a.msg}</div>
                      <div style={{ fontSize:11, color:'var(--text3)', marginTop:2, fontFamily:'var(--mono)' }}>{a.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
