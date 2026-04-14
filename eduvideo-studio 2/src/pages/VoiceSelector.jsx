import { useState } from 'react'
import { Card, CardHead, Btn } from '../components/ui'
import { MOCK_VOICES_ELEVENLABS, MOCK_VOICES_COQUI } from '../lib/mockData'

export default function VoiceSelector() {
  const [provider, setProvider] = useState('elevenlabs')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [playing, setPlaying] = useState(null)
  const [speed, setSpeed] = useState(1.0)
  const [stability, setStability] = useState(0.75)
  const voices = provider==='elevenlabs'?MOCK_VOICES_ELEVENLABS:MOCK_VOICES_COQUI
  const filtered = voices.filter(v=>!search||v.name.toLowerCase().includes(search.toLowerCase()))

  const play = (id) => { if(playing===id){setPlaying(null);return} setPlaying(id); setTimeout(()=>setPlaying(null),3000) }

  return (
    <div style={{ padding:'28px', animation:'fade-in 0.2s ease' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.4px' }}>Voice / TTS</h1>
          <p style={{ fontSize:14, color:'var(--text2)', marginTop:4 }}>Select and configure the voiceover engine</p>
        </div>
        {selected && <Btn variant="primary">Use {selected.name} for This Video</Btn>}
      </div>

      {/* Provider */}
      <div style={{ display:'flex', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:4, gap:4, width:'fit-content', marginBottom:20, boxShadow:'var(--shadow-sm)' }}>
        {[{id:'elevenlabs',label:'ElevenLabs',badge:'V2 · Paid'},{id:'coqui',label:'Coqui TTS',badge:'V1 · Free'}].map(p=>(
          <button key={p.id} onClick={()=>setProvider(p.id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:'var(--font)', fontSize:14, fontWeight:600, background:provider===p.id?'var(--blue)':'transparent', color:provider===p.id?'#fff':'var(--text2)', transition:'all 0.15s' }}>
            {p.label} <span style={{ fontSize:11, opacity:0.75 }}>{p.badge}</span>
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:16 }}>
        <div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search voices…"
            style={{ width:'100%', background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--r)', padding:'10px 14px', color:'var(--text1)', fontSize:14, fontFamily:'var(--font)', outline:'none', marginBottom:14, boxShadow:'var(--shadow-sm)' }} />

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(176px,1fr))', gap:10 }}>
            {filtered.map(v=>{
              const isSel=selected?.id===v.id; const isPlay=playing===v.id
              return (
                <div key={v.id} onClick={()=>setSelected(v)}
                  style={{ background:'var(--surface)', border:`1.5px solid ${isSel?v.color:'var(--border)'}`, borderRadius:'var(--r2)', padding:14, cursor:'pointer', transition:'all 0.15s', boxShadow:isSel?`0 0 0 3px ${v.color}22`:'var(--shadow-sm)', position:'relative' }}>
                  {isSel && <span style={{ position:'absolute', top:10, right:10, width:18, height:18, borderRadius:'50%', background:'var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff' }}>✓</span>}
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background:v.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', flexShrink:0 }}>{v.initials}</div>
                    <div><div style={{ fontSize:14, fontWeight:700 }}>{v.name}</div><div style={{ fontSize:11, color:'var(--text3)', marginTop:1 }}>{v.lang}</div></div>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:10 }}>
                    {v.tags.slice(0,2).map(t=><span key={t} style={{ padding:'2px 7px', borderRadius:4, fontSize:10, fontWeight:600, background:'var(--surface2)', color:'var(--text2)' }}>{t}</span>)}
                  </div>
                  <div onClick={e=>{e.stopPropagation();play(v.id)}} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:isPlay?'var(--blue)':'var(--blue-bg)', border:`1px solid ${isPlay?'var(--blue)':'rgba(37,99,235,0.2)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:isPlay?'#fff':'var(--blue)', cursor:'pointer', flexShrink:0 }}>{isPlay?'■':'▶'}</div>
                    <div style={{ flex:1, height:16, display:'flex', alignItems:'center', gap:1 }}>
                      {Array.from({length:20}).map((_,i)=><div key={i} style={{ width:2, borderRadius:1, height:`${6+Math.abs(Math.sin(i*.7))*10}px`, background:isPlay?'var(--blue)':'var(--border2)', transition:'background 0.15s' }}/>)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {selected ? (
            <Card>
              <CardHead title="Selected Voice" />
              <div style={{ padding:18 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:selected.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#fff' }}>{selected.initials}</div>
                  <div><div style={{ fontSize:16, fontWeight:700 }}>{selected.name}</div><div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{selected.lang} · {selected.gender}</div></div>
                </div>
                <textarea defaultValue="A quadratic equation has the form ax squared plus bx plus c equals zero." style={{ width:'100%', minHeight:64, background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:'var(--r)', padding:'9px 12px', fontSize:13, fontFamily:'var(--font)', color:'var(--text1)', outline:'none', resize:'vertical', marginBottom:10 }} />
                <Btn variant="outline" style={{ width:'100%', justifyContent:'center' }}>▶ Preview Sample</Btn>
              </div>
            </Card>
          ) : (
            <Card><div style={{ padding:40, textAlign:'center', color:'var(--text3)', fontSize:13 }}>← Select a voice to preview</div></Card>
          )}

          <Card>
            <CardHead title="Voice Settings" />
            <div style={{ padding:18, display:'flex', flexDirection:'column', gap:16 }}>
              {[{label:'Speed',val:speed,set:setSpeed,min:0.7,max:1.3,step:0.05,fmt:v=>`${v.toFixed(2)}×`},{label:'Stability',val:stability,set:setStability,min:0,max:1,step:0.05,fmt:v=>`${Math.round(v*100)}%`}].map(s=>(
                <div key={s.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:7 }}>
                    <span style={{ fontWeight:500 }}>{s.label}</span>
                    <span style={{ fontFamily:'var(--mono)', color:'var(--blue)', fontWeight:600 }}>{s.fmt(s.val)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e=>s.set(+e.target.value)} style={{ width:'100%', accentColor:'var(--blue)' }} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
