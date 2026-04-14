import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Card, Btn, Spinner } from '../components/ui'
import { MOCK_SCENES } from '../lib/mockData'

const SCENES = [
  {id:'hook',    label:'1 · Hook',    dur:'~30s',  color:'var(--blue)',   desc:'Why does this concept matter?'},
  {id:'intro',   label:'2 · Intro',   dur:'1–2min',color:'var(--teal)',   desc:'Plain definition + board visual'},
  {id:'example', label:'3 · Example', dur:'4–6min',color:'var(--green)',  desc:'Step-by-step worked example'},
  {id:'mistakes',label:'4 · Mistakes',dur:'1–2min',color:'var(--amber)',  desc:'2–3 common student errors'},
  {id:'recap',   label:'5 · Recap',   dur:'~1min', color:'var(--purple)', desc:'3 bullet point summary'},
]

const MANIM = {
  hook:'ax² + bx + c = 0\n\n"Why do projectiles follow\ncurved paths? Quadratics."',
  intro:'DEFINITION\n────────────────\nax² + bx + c = 0\nwhere a ≠ 0\nDegree: 2',
  example:'SOLVE: x² - 5x + 6 = 0\nStep 1: p×q=6, p+q=5 → 2,3\nStep 2: (x-2)(x-3) = 0\nStep 3: x=2 or x=3 ✓',
  mistakes:'⚠ COMMON ERRORS\n✗ Forgetting ± in formula\n✗ Dividing only part by 2a\n✗ Setting a=0 by mistake',
  recap:'KEY POINTS\n──────────────\n• ax²+bx+c=0, a≠0\n• D = b²-4ac\n• Factor or formula ✓',
}

export default function SceneEditor() {
  const { videos } = useApp()
  const active = videos.find(v=>v.status==='processing')||videos[0]
  const [cur, setCur] = useState('hook')
  const [scripts, setScripts] = useState({ hook:MOCK_SCENES.hook, intro:`${MOCK_SCENES.intro.definition}\nVisual: ${MOCK_SCENES.intro.visual}`, example:MOCK_SCENES.example_steps.join('\n'), mistakes:MOCK_SCENES.mistakes.join('\n'), recap:MOCK_SCENES.recap.join('\n') })
  const [done, setDone] = useState({hook:true,intro:true,example:false,mistakes:false,recap:false})
  const [rendering, setRendering] = useState(null)
  const [generating, setGenerating] = useState(false)

  const renderScene = async (id) => { setRendering(id); await new Promise(r=>setTimeout(r,2000)); setRendering(null); setDone(p=>({...p,[id]:true})) }
  const genAll = async () => { setGenerating(true); await new Promise(r=>setTimeout(r,2000)); setGenerating(false); setDone({hook:true,intro:true,example:true,mistakes:true,recap:true}) }

  const sc = SCENES.find(s=>s.id===cur)
  const doneCount = Object.values(done).filter(Boolean).length

  return (
    <div style={{ padding:'28px', animation:'fade-in 0.2s ease' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.4px' }}>Scene Editor</h1>
          <p style={{ fontSize:14, color:'var(--text2)', marginTop:4 }}>{active?.title||'No active video'} · 5-scene Khan Academy recreation</p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:13, color:'var(--text2)' }}>{doneCount}/5 scenes ready</span>
          <Btn variant="outline" onClick={genAll} disabled={generating}>{generating?<><Spinner size={13}/> Generating…</>:'⚡ AI Generate All'}</Btn>
          <Btn variant="primary" disabled={doneCount<5}>▶ Render All with Manim</Btn>
        </div>
      </div>

      {/* Scene tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
        {SCENES.map(sc=>(
          <div key={sc.id} onClick={()=>setCur(sc.id)} style={{ padding:'14px 16px', background:cur===sc.id?'var(--surface)':'var(--surface)', border:`1.5px solid ${cur===sc.id?sc.color:'var(--border)'}`, borderRadius:'var(--r2)', cursor:'pointer', transition:'all 0.15s', boxShadow:cur===sc.id?`0 0 0 3px ${sc.color}22`:'var(--shadow-sm)' }}>
            <div style={{ fontSize:13, fontWeight:700, color:sc.color, marginBottom:4 }}>{sc.label}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginBottom:8 }}>{sc.dur}</div>
            <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5, marginBottom:10 }}>{sc.desc}</div>
            <div style={{ fontSize:12, fontWeight:600, color:done[sc.id]?'var(--green)':rendering===sc.id?'var(--amber)':'var(--text3)' }}>
              {done[sc.id]?'✓ Ready':rendering===sc.id?'⏳ Rendering':'○ Pending'}
            </div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:15, fontWeight:700, color:sc?.color }}>{sc?.label}</div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {[{label:'Duration',val:sc?.dur},{label:'Style',val:'Khan Academy'},{label:'BG',val:'#1a1a2e'}].map(c=>(
              <span key={c.label} style={{ padding:'4px 10px', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:6, fontSize:12 }}>
                <span style={{ color:'var(--text3)' }}>{c.label}: </span><span style={{ fontWeight:600 }}>{c.val}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
          {/* Script */}
          <div style={{ padding:'18px 20px', borderRight:'1px solid var(--border)' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:10 }}>Voiceover Script</div>
            <textarea value={scripts[cur]||''} onChange={e=>setScripts(p=>({...p,[cur]:e.target.value}))}
              style={{ width:'100%', minHeight:200, background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:'var(--r)', padding:'12px', fontSize:13, fontFamily:'var(--mono)', color:'var(--text1)', lineHeight:1.7, outline:'none', resize:'vertical' }} />
          </div>
          {/* Manim preview */}
          <div style={{ padding:'18px 20px' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:10 }}>Manim Board Preview</div>
            <div style={{ background:'#111827', borderRadius:'var(--r)', minHeight:200, padding:16, position:'relative', display:'flex', alignItems:'flex-start' }}>
              <div style={{ position:'absolute', top:8, left:10, fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'var(--mono)' }}>MANIM CE PREVIEW</div>
              {rendering===cur ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%', gap:10, marginTop:40 }}><Spinner size={24}/><span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>Rendering…</span></div>
              ) : (
                <pre style={{ fontSize:12, fontFamily:'var(--mono)', color:'#fff', lineHeight:2, marginTop:20, whiteSpace:'pre-wrap' }}>{MANIM[cur]}</pre>
              )}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:8, padding:'14px 20px', borderTop:'1px solid var(--border)' }}>
          <Btn variant="primary" onClick={()=>renderScene(cur)} disabled={!!rendering}>{rendering===cur?<><Spinner size={13}/> Rendering…</>:'▶ Render with Manim'}</Btn>
          <Btn variant={done[cur]?'green':'outline'} onClick={()=>setDone(p=>({...p,[cur]:!p[cur]}))}>{done[cur]?'✓ Approved':'Approve Scene'}</Btn>
          <Btn variant="ghost">Preview Audio</Btn>
          <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
            <Btn variant="ghost" size="sm" onClick={()=>{const i=SCENES.findIndex(s=>s.id===cur);if(i>0)setCur(SCENES[i-1].id)}}>← Prev</Btn>
            <Btn variant="ghost" size="sm" onClick={()=>{const i=SCENES.findIndex(s=>s.id===cur);if(i<SCENES.length-1)setCur(SCENES[i+1].id)}}>Next →</Btn>
          </div>
        </div>
      </Card>
    </div>
  )
}
