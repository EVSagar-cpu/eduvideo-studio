import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Badge, RoutePill, Card, CardHead, StatCard, Btn, Spinner } from '../components/ui'

export default function BatchQueue() {
  const { videos, updateVideo, addActivity } = useApp()
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState({})
  const [batchSize, setBatchSize] = useState('50')
  const queued = videos.filter(v=>v.status==='pending')
  const processing = videos.filter(v=>v.status==='processing')
  const done = videos.filter(v=>v.status==='done')
  const failed = videos.filter(v=>v.status==='failed')
  const PHASES = ['Ingest','Classify','Transcribe','LLM Clean','Script','Manim','TTS','Export']

  const runBatch = async () => {
    setRunning(true)
    const batch = queued.slice(0, parseInt(batchSize))
    for (const v of batch) { updateVideo(v.id,{status:'processing'}); setProgress(p=>({...p,[v.id]:{phase:0,pct:0}})); await new Promise(r=>setTimeout(r,200)) }
    for (let i=1;i<=8;i++) { await new Promise(r=>setTimeout(r,500)); batch.forEach(v=>{setProgress(p=>({...p,[v.id]:{phase:i,pct:Math.round((i/8)*100)}}))}) }
    batch.forEach(v=>updateVideo(v.id,{status:'done'}))
    addActivity(`Batch complete · ${batch.length} videos processed`,'success')
    setRunning(false); setProgress({})
  }

  return (
    <div style={{ padding:'28px', animation:'fade-in 0.2s ease' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.4px' }}>Batch Queue</h1>
          <p style={{ fontSize:14, color:'var(--text2)', marginTop:4 }}>Process multiple videos overnight · target 100/day</p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <select value={batchSize} onChange={e=>setBatchSize(e.target.value)}
            style={{ background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--r)', padding:'9px 14px', color:'var(--text1)', fontSize:14, fontFamily:'var(--font)', outline:'none' }}>
            {['10','25','50','100'].map(n=><option key={n} value={n}>{n} videos per batch</option>)}
          </select>
          <Btn variant="primary" onClick={runBatch} disabled={running||queued.length===0}>
            {running ? <><Spinner size={13}/> Running…</> : `▶ Run Batch (${Math.min(queued.length,parseInt(batchSize))})`}
          </Btn>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        <StatCard label="Queued"     value={queued.length}     sub="Ready to process" />
        <StatCard label="Processing" value={processing.length} sub="Currently running" color="var(--blue2)" />
        <StatCard label="Completed"  value={done.length}       sub="Successfully done" color="var(--green)" />
        <StatCard label="Failed"     value={failed.length}     sub="Needs attention" color="var(--red)" />
      </div>

      {processing.length > 0 && (
        <Card style={{ marginBottom:16 }}>
          <CardHead title="Active Jobs" meta={`${processing.length} running`} />
          {videos.filter(v=>v.status==='processing').map(v => {
            const p = progress[v.id]||{phase:3,pct:38}
            return (
              <div key={v.id} style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:14, fontWeight:600 }}>{v.title}</span>
                  <span style={{ fontSize:12, fontFamily:'var(--mono)', color:'var(--blue2)', fontWeight:600 }}>{p.pct}%</span>
                </div>
                <div style={{ display:'flex', gap:3, marginBottom:6 }}>
                  {PHASES.map((ph,i) => (
                    <div key={ph} title={ph} style={{ flex:1, height:4, borderRadius:2, background:i<p.phase?'var(--blue)':i===p.phase?'var(--blue2)':'var(--surface2)', transition:'background 0.3s' }} />
                  ))}
                </div>
                <div style={{ fontSize:12, color:'var(--text3)', fontFamily:'var(--mono)' }}>Phase {Math.min(p.phase+1,8)} of 8 · {PHASES[Math.min(p.phase,7)]}</div>
              </div>
            )
          })}
        </Card>
      )}

      <Card>
        <CardHead title="Pending Queue" meta={`${queued.length} videos`} />
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'var(--surface2)' }}>
            {['#','Title','Grade','Subject','Route','Est. Time'].map(h=>(
              <th key={h} style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.06em', padding:'10px 16px', textAlign:'left', borderBottom:'1px solid var(--border)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {queued.map((v,i) => (
              <tr key={v.id} onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'12px 16px', fontSize:13, color:'var(--text3)', fontFamily:'var(--mono)', borderBottom:'1px solid var(--border)' }}>{i+1}</td>
                <td style={{ padding:'12px 16px', fontSize:14, fontWeight:600, borderBottom:'1px solid var(--border)' }}>{v.title}</td>
                <td style={{ padding:'12px 16px', fontSize:13, color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>Gr. {v.grade}</td>
                <td style={{ padding:'12px 16px', fontSize:13, color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>{v.subject}</td>
                <td style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}><RoutePill route={v.route} /></td>
                <td style={{ padding:'12px 16px', fontSize:13, color:'var(--text3)', fontFamily:'var(--mono)', borderBottom:'1px solid var(--border)' }}>{v.route==='recreate'?'~18 min':'~8 min'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {queued.length===0 && <div style={{ padding:'48px', textAlign:'center', color:'var(--text3)', fontSize:14 }}>Queue is empty · Upload videos to get started</div>}
      </Card>
    </div>
  )
}
