import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Badge, Card, Btn } from '../components/ui'

const fmt = s => s ? `${Math.floor(s/60)}m ${s%60}s` : '—'

export default function OutputLibrary() {
  const { videos } = useApp()
  const done = videos.filter(v=>v.status==='done')
  const [view, setView] = useState('grid')
  const [preview, setPreview] = useState(null)
  const [search, setSearch] = useState('')
  const filtered = done.filter(v=>!search||v.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ padding:'28px', animation:'fade-in 0.2s ease' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.4px' }}>Output Library</h1>
          <p style={{ fontSize:14, color:'var(--text2)', marginTop:4 }}>{filtered.length} final videos · {fmt(filtered.reduce((a,v)=>a+(v.finalDuration||720),0))} total runtime</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Btn variant="outline">⬇ Export All</Btn>
          <Btn variant="primary">☁ Upload to Drive</Btn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[{n:done.length,l:'Total Done',c:'var(--green)'},{n:done.filter(v=>v.route==='enhance').length,l:'Enhanced',c:'var(--teal)'},{n:done.filter(v=>v.route==='recreate').length,l:'Recreated',c:'var(--blue2)'},{n:fmt(done.reduce((a,v)=>a+(v.finalDuration||720),0)),l:'Runtime',c:'var(--text1)'}].map(s=>(
          <div key={s.l} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r2)', padding:'18px 20px', boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontSize:28, fontWeight:700, letterSpacing:'-1px', color:s.c, lineHeight:1 }}>{s.n}</div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:8, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search outputs…"
          style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--r)', padding:'9px 14px', color:'var(--text1)', fontSize:14, fontFamily:'var(--font)', outline:'none', boxShadow:'var(--shadow-sm)' }} />
        <div style={{ display:'flex', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:3, gap:2, boxShadow:'var(--shadow-sm)' }}>
          {[['grid','⊞'],['list','≡']].map(([v,icon])=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:'6px 12px', borderRadius:6, border:'none', cursor:'pointer', background:view===v?'var(--blue)':'transparent', color:view===v?'#fff':'var(--text2)', fontFamily:'var(--font)', fontSize:14, transition:'all 0.15s' }}>{icon}</button>
          ))}
        </div>
      </div>

      {filtered.length===0 ? (
        <div style={{ padding:'80px', textAlign:'center', color:'var(--text3)', fontSize:14 }}>No completed videos yet · Run the pipeline to generate outputs</div>
      ) : view==='grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
          {filtered.map(v=>(
            <div key={v.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r2)', overflow:'hidden', cursor:'pointer', boxShadow:'var(--shadow-sm)', transition:'box-shadow 0.15s' }}
              onClick={()=>setPreview(v)}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow-md)'}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='var(--shadow-sm)'}
            >
              <div style={{ background:`hsl(${v.grade*20},50%,${v.route==='enhance'?75:65}%)`, height:140, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'#fff' }}>▶</div>
                <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(0,0,0,0.6)', padding:'2px 8px', borderRadius:4, fontSize:11, fontFamily:'var(--mono)', color:'#fff' }}>{fmt(v.finalDuration||720)}</div>
                <div style={{ position:'absolute', top:10, left:10 }}><Badge variant={v.route==='enhance'?'enhance':'recreate'}>{v.route==='enhance'?'Enhanced':'Recreated'}</Badge></div>
              </div>
              <div style={{ padding:'14px 16px' }}>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:4, lineHeight:1.3 }}>{v.title}</div>
                <div style={{ fontSize:12, color:'var(--text2)', marginBottom:12 }}>{v.subject} · Grade {v.grade}</div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn variant="primary" size="sm" onClick={e=>e.stopPropagation()}>⬇ Download</Btn>
                  <Btn variant="ghost" size="sm">Preview</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'var(--surface2)' }}>{['Title','Subject','Grade','Duration','Route','Processed','Actions'].map(h=><th key={h} style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.06em', padding:'11px 16px', textAlign:'left', borderBottom:'1px solid var(--border)' }}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(v=>(
              <tr key={v.id} onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'13px 16px', fontSize:14, fontWeight:600, borderBottom:'1px solid var(--border)' }}>{v.title}</td>
                <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>{v.subject}</td>
                <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>Gr. {v.grade}</td>
                <td style={{ padding:'13px 16px', fontSize:13, fontFamily:'var(--mono)', color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>{fmt(v.finalDuration||720)}</td>
                <td style={{ padding:'13px 16px', borderBottom:'1px solid var(--border)' }}><Badge variant={v.route==='enhance'?'enhance':'recreate'}>{v.route}</Badge></td>
                <td style={{ padding:'13px 16px', fontSize:12, color:'var(--text3)', fontFamily:'var(--mono)', borderBottom:'1px solid var(--border)' }}>{v.processedAt?new Date(v.processedAt).toLocaleDateString('en-IN'):'—'}</td>
                <td style={{ padding:'13px 16px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', gap:6 }}><Btn variant="primary" size="sm">⬇</Btn><Btn variant="ghost" size="sm" onClick={()=>setPreview(v)}>▶</Btn></div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {preview && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }} onClick={()=>setPreview(null)}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r2)', width:640, boxShadow:'var(--shadow-md)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:15, fontWeight:700 }}>{preview.title}</span>
              <button onClick={()=>setPreview(null)} style={{ marginLeft:'auto', background:'none', border:'none', fontSize:20, cursor:'pointer', color:'var(--text2)' }}>✕</button>
            </div>
            <div style={{ background:`hsl(${preview.grade*20},40%,80%)`, height:260, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:'#fff', cursor:'pointer' }}>▶</div>
            </div>
            <div style={{ padding:'16px 20px', display:'flex', gap:8 }}>
              <Btn variant="primary">⬇ Download MP4</Btn>
              <Btn variant="ghost" onClick={()=>setPreview(null)}>Close</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
