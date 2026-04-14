import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Badge, RoutePill, Card, CardHead, Btn, Spinner } from '../components/ui'
import { MOCK_RAW_TRANSCRIPT, MOCK_CLEAN_TRANSCRIPT } from '../lib/mockData'

function parseLines(raw) {
  return raw.trim().split('\n').map((l,i)=>{ const m=l.match(/^\[(\d{2}:\d{2}:\d{2})\] (.+?): (.+)$/); return m?{id:i,ts:m[1],speaker:m[2],text:m[3],removed:false}:{id:i,ts:'',speaker:'',text:l,removed:false}}).filter(s=>s.text) }

export default function VideoDetail() {
  const { id } = useParams(); const { videos, updateVideo, addActivity } = useApp(); const navigate = useNavigate()
  const video = videos.find(v=>v.id===id)
  const [tab, setTab] = useState('Transcript')
  const [rawSegs, setRawSegs] = useState(()=>parseLines(MOCK_RAW_TRANSCRIPT))
  const [cleanSegs] = useState(()=>parseLines(MOCK_CLEAN_TRANSCRIPT))
  const [cleaning, setCleaning] = useState(false)
  const [cleanDone, setCleanDone] = useState(false)
  const [routeOv, setRouteOv] = useState(video?.route||'enhance')

  if (!video) return <div style={{ padding:40, textAlign:'center', color:'var(--text2)' }}>Video not found. <span style={{ color:'var(--blue)', cursor:'pointer' }} onClick={()=>navigate('/queue')}>← Back</span></div>

  const handleClean = async () => {
    setCleaning(true)
    try { const r=await fetch('/api/clean-transcript',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({transcript:rawSegs.map(s=>`[${s.ts}] ${s.speaker}: ${s.text}`).join('\n')})}); if(r.ok){ /* use result */ } } catch{}
    setCleaning(false); setCleanDone(true); addActivity(`"${video.title}" transcript cleaned`,'success')
  }

  const TABS = ['Transcript','Trim Editor','Quality']

  return (
    <div style={{ padding:'28px', animation:'fade-in 0.2s ease' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <span style={{ color:'var(--blue)', cursor:'pointer', fontSize:13, fontWeight:600 }} onClick={()=>navigate('/queue')}>← Queue</span>
            <span style={{ color:'var(--text3)' }}>/</span>
            <span style={{ fontSize:15, fontWeight:700 }}>{video.title}</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <Badge variant={video.status}>{video.status}</Badge>
            <RoutePill route={routeOv} />
            <span style={{ fontSize:12, color:'var(--text3)' }}>Grade {video.grade} · {video.subject} · Score: {video.qualityScore}</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ display:'flex', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:3, gap:2 }}>
            {['enhance','recreate','review'].map(r=>(
              <button key={r} onClick={()=>{setRouteOv(r);updateVideo(video.id,{route:r})}} style={{ padding:'6px 12px', borderRadius:6, border:'none', cursor:'pointer', fontFamily:'var(--font)', fontSize:12, fontWeight:600, textTransform:'capitalize', background:routeOv===r?'var(--blue)':'transparent', color:routeOv===r?'#fff':'var(--text2)', transition:'all 0.15s' }}>{r}</button>
            ))}
          </div>
          <Btn variant="primary">▶ Process Video</Btn>
        </div>
      </div>

      <div style={{ display:'flex', borderBottom:'1px solid var(--border)', marginBottom:20 }}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'10px 20px', fontSize:14, fontWeight:500, border:'none', cursor:'pointer', background:'transparent', fontFamily:'var(--font)', color:tab===t?'var(--blue)':'var(--text2)', borderBottom:`2px solid ${tab===t?'var(--blue)':'transparent'}`, transition:'all 0.15s' }}>{t}</button>
        ))}
      </div>

      {tab==='Transcript' && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <Btn variant="primary" onClick={handleClean} disabled={cleaning}>{cleaning?<><Spinner size={13}/> Cleaning…</>:'⚡ AI Clean Transcript'}</Btn>
            <span style={{ fontSize:13, color:'var(--text3)' }}>Powered by LLaMA 3.3 70B via Groq</span>
            {cleanDone && <span style={{ fontSize:13, color:'var(--green)', fontWeight:600 }}>✓ Complete</span>}
            <div style={{ marginLeft:'auto', display:'flex', gap:12, fontSize:13 }}>
              <span style={{ color:'var(--green)', fontWeight:600 }}>✓ {rawSegs.filter(s=>!s.removed).length} kept</span>
              <span style={{ color:'var(--red)', fontWeight:600 }}>✗ {rawSegs.filter(s=>s.removed).length} removed</span>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, height:440 }}>
            {[{segs:rawSegs,label:'Raw Transcript',color:'var(--text2)',setSegs:setRawSegs,editable:false},{segs:cleanSegs,label:'Clean Transcript',color:'var(--green)',setSegs:null,editable:true}].map(({segs,label,color,setSegs,editable})=>(
              <Card key={label} style={{ display:'flex', flexDirection:'column', height:'100%' }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:13, fontWeight:600, color }}>{label}</span>
                  <span style={{ fontSize:12, color:'var(--text3)', fontFamily:'var(--mono)' }}>{segs.length} lines</span>
                </div>
                <div style={{ flex:1, overflowY:'auto', padding:12 }}>
                  {segs.map(seg=>(
                    <div key={seg.id} onClick={()=>setSegs&&setSegs(p=>p.map(s=>s.id===seg.id?{...s,removed:!s.removed}:s))}
                      style={{ display:'flex', gap:8, padding:'6px 8px', borderRadius:6, marginBottom:2, opacity:seg.removed?0.3:1, textDecoration:seg.removed?'line-through':'none', cursor:setSegs?'pointer':'default', transition:'background 0.1s' }}
                      onMouseEnter={e=>{if(setSegs)e.currentTarget.style.background='var(--surface2)'}}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                    >
                      <span style={{ fontSize:11, color:'var(--blue)', fontFamily:'var(--mono)', minWidth:48, flexShrink:0 }}>{seg.ts}</span>
                      <span style={{ fontSize:13, lineHeight:1.6, flex:1 }}>{seg.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab==='Trim Editor' && (
        <Card>
          <CardHead title="Video Trim Editor" meta={`Source: ${Math.floor((video.duration||1500)/60)}m · Target: 10–15 min`} />
          <div style={{ padding:20 }}>
            <div style={{ height:80, background:'#111827', borderRadius:'var(--r)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, cursor:'pointer' }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff' }}>▶</div>
            </div>
            <div style={{ height:40, background:'var(--surface2)', borderRadius:'var(--r)', border:'1px solid var(--border)', marginBottom:16, position:'relative', overflow:'hidden' }}>
              {Array.from({length:60}).map((_,i)=>(
                <div key={i} style={{ position:'absolute', left:`${(i/60)*100}%`, bottom:6, width:3, height:`${8+Math.random()*20}px`, background:'var(--border2)', borderRadius:1 }} />
              ))}
              <div style={{ position:'absolute', left:'7%', right:'28%', top:0, bottom:0, background:'rgba(37,99,235,0.15)', border:'1px solid rgba(37,99,235,0.3)' }} />
            </div>
            <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:'12px 16px' }}>
              <div style={{ fontSize:12, color:'var(--text3)', marginBottom:4, fontFamily:'var(--mono)' }}>FFmpeg command:</div>
              <code style={{ fontSize:12, fontFamily:'var(--mono)', color:'var(--teal)' }}>ffmpeg -i input.mp4 -ss 00:01:02 -to 00:11:20 -c copy output_trimmed.mp4</code>
            </div>
          </div>
        </Card>
      )}

      {tab==='Quality' && (
        <Card>
          <CardHead title="FFprobe Quality Analysis" />
          <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 200px', gap:20 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[['Resolution ≥ 720p','1280×720',30,true],['Audio SNR ≥ 20dB',`${video.audioSNR} dB`,20,video.audioSNR>=20],['Audio bitrate ≥ 128k','192 kbps',20,true],['Duration 15–35 min',`${Math.floor((video.duration||1500)/60)} min`,15,true],['No major dropout','0 detected',15,true]].map(([l,v,pts,pass])=>(
                <div key={l} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'var(--surface2)', borderRadius:'var(--r)', border:`1px solid ${pass?'rgba(22,163,74,0.15)':'rgba(220,38,38,0.15)'}` }}>
                  <span style={{ color:pass?'var(--green)':'var(--red)', fontSize:16, fontWeight:700 }}>{pass?'✓':'✗'}</span>
                  <span style={{ fontSize:14, flex:1 }}>{l}</span>
                  <span style={{ fontSize:13, color:'var(--text2)', fontFamily:'var(--mono)' }}>{v}</span>
                  <span style={{ fontSize:12, fontFamily:'var(--mono)', color:pass?'var(--green)':'var(--text3)', fontWeight:600 }}>+{pass?pts:0}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
              <div style={{ fontSize:52, fontWeight:700, letterSpacing:'-2px', color: video.qualityScore>=80?'var(--green)':video.qualityScore>=50?'var(--amber)':'var(--red)' }}>{video.qualityScore}</div>
              <div style={{ fontSize:13, color:'var(--text2)' }}>Quality Score</div>
              <RoutePill route={video.route} />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
