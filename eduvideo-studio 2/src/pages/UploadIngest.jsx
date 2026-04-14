import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Card, CardHead, Btn, FormInput } from '../components/ui'

const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','English','History','Geography']
const GRADES = [6,7,8,9,10,11,12]

export default function UploadIngest() {
  const { addVideo } = useApp()
  const navigate = useNavigate()
  const [drag, setDrag] = useState(false)
  const [files, setFiles] = useState({ video:null, transcript:null })
  const [meta, setMeta] = useState({ title:'', subject:'Mathematics', grade:9, school:'' })
  const [adding, setAdding] = useState(false)
  const videoRef = useRef()
  const txRef = useRef()

  const handleDrop = e => {
    e.preventDefault(); setDrag(false)
    Array.from(e.dataTransfer.files).forEach(f => {
      if (f.type.startsWith('video/')) setFiles(p=>({...p,video:f}))
      if (f.name.match(/\.(txt|vtt|srt)$/)) setFiles(p=>({...p,transcript:f}))
    })
  }

  const handleSubmit = async () => {
    if (!meta.title) return alert('Please enter a video title')
    setAdding(true)
    await new Promise(r => setTimeout(r, 800))
    const v = await addVideo({ title:meta.title, subject:meta.subject, grade:parseInt(meta.grade), school:meta.school, rawPath:files.video?.name||'uploaded.mp4', transcriptPath:files.transcript?.name||null, duration:1500, resolution:'1280x720', audioSNR:0, qualityScore:0, route:'pending', status:'pending', cleanTranscript:null, scenes:[], outputPath:null, finalDuration:null })
    setAdding(false)
    navigate(`/video/${v.id}`)
  }

  return (
    <div style={{ padding:'28px', animation:'fade-in 0.2s ease' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.4px' }}>Upload</h1>
        <p style={{ fontSize:14, color:'var(--text2)', marginTop:4 }}>Add videos to the processing pipeline</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Drop zone */}
          <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={handleDrop}
            onClick={()=>videoRef.current?.click()}
            style={{ border:`2px dashed ${drag?'var(--blue)':'var(--border2)'}`, borderRadius:'var(--r2)', padding:48, display:'flex', flexDirection:'column', alignItems:'center', gap:14, background:drag?'var(--blue-bg)':'var(--surface)', cursor:'pointer', transition:'all 0.2s' }}>
            <div style={{ width:56, height:56, borderRadius:14, background:'var(--blue-bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>↑</div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--text1)', marginBottom:6 }}>{files.video ? files.video.name : 'Drop your video file here'}</div>
              <div style={{ fontSize:13, color:'var(--text3)' }}>MP4, MOV, AVI · up to 2GB</div>
            </div>
            <Btn variant="outline" size="sm" onClick={e=>{e.stopPropagation();videoRef.current?.click()}}>Browse file</Btn>
            <input ref={videoRef} type="file" accept="video/*" style={{ display:'none' }} onChange={e=>setFiles(p=>({...p,video:e.target.files[0]}))} />
          </div>

          {/* Transcript */}
          <Card>
            <CardHead title="Transcript File" meta="Optional · TXT, VTT, SRT" />
            <div style={{ padding:18 }}>
              <div onClick={()=>txRef.current?.click()} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', border:`1px dashed ${files.transcript?'var(--green)':'var(--border2)'}`, borderRadius:'var(--r)', cursor:'pointer', background:files.transcript?'var(--green-bg)':'var(--surface2)' }}>
                <span style={{ fontSize:20 }}>{files.transcript?'✅':'📝'}</span>
                <span style={{ fontSize:14, color:files.transcript?'var(--green)':'var(--text2)' }}>{files.transcript?files.transcript.name:'Upload Zoom auto-transcript (.txt / .vtt)'}</span>
                <input ref={txRef} type="file" accept=".txt,.vtt,.srt" style={{ display:'none' }} onChange={e=>setFiles(p=>({...p,transcript:e.target.files[0]}))} />
              </div>
              <p style={{ fontSize:12, color:'var(--text3)', marginTop:10, lineHeight:1.6 }}>If omitted, Whisper large-v3 will auto-transcribe (~2 min extra per video)</p>
            </div>
          </Card>

          {/* Quality classifier info */}
          <Card>
            <CardHead title="Auto Quality Classifier" />
            <div style={{ padding:18 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[['Resolution ≥ 720p','+30 pts'],['Audio SNR ≥ 20dB','+20 pts'],['Audio bitrate ≥ 128k','+20 pts'],['Duration 15–35 min','+15 pts'],['No major dropout','+15 pts']].map(([c,p])=>(
                  <div key={c} style={{ display:'flex', justifyContent:'space-between', padding:'9px 12px', background:'var(--surface2)', borderRadius:'var(--r)', fontSize:13 }}>
                    <span style={{ color:'var(--text2)' }}>{c}</span>
                    <span style={{ color:'var(--teal)', fontFamily:'var(--mono)', fontWeight:600 }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:10, marginTop:14 }}>
                {[['≥80 → Enhance','var(--green)','var(--green-bg)'],['50–79 → Review','var(--amber)','var(--amber-bg)'],['<50 → Recreate','var(--red)','var(--red-bg)']].map(([l,c,bg])=>(
                  <div key={l} style={{ flex:1, textAlign:'center', padding:'8px', background:bg, borderRadius:'var(--r)', fontSize:12, fontWeight:700, color:c }}>{l}</div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: metadata */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card>
            <CardHead title="Video Metadata" />
            <div style={{ padding:18, display:'flex', flexDirection:'column', gap:14 }}>
              <FormInput label="Title" value={meta.title} onChange={e=>setMeta(p=>({...p,title:e.target.value}))} placeholder="e.g. Quadratic Equations – Basics" />
              {[{label:'Subject',key:'subject',opts:SUBJECTS.map(s=>[s,s])},{label:'Grade',key:'grade',opts:GRADES.map(g=>[g,`Grade ${g}`])}].map(f=>(
                <div key={f.key}>
                  <label style={{ display:'block', fontSize:13, color:'var(--text2)', fontWeight:500, marginBottom:6 }}>{f.label}</label>
                  <select value={meta[f.key]} onChange={e=>setMeta(p=>({...p,[f.key]:e.target.value}))}
                    style={{ width:'100%', background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:'var(--r)', padding:'9px 12px', color:'var(--text1)', fontSize:14, fontFamily:'var(--font)', outline:'none' }}>
                    {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
              <FormInput label="School" value={meta.school} onChange={e=>setMeta(p=>({...p,school:e.target.value}))} placeholder="e.g. Narayana Hyderabad" />
            </div>
          </Card>
          <Btn variant="primary" onClick={handleSubmit} disabled={adding} style={{ width:'100%', justifyContent:'center', padding:'12px' }}>
            {adding ? '⏳ Adding to pipeline…' : '↑ Add to Pipeline'}
          </Btn>
        </div>
      </div>
    </div>
  )
}
