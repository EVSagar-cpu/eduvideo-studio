import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Badge, RoutePill, ScoreBar, Card, Btn } from '../components/ui'

export default function ReviewQueue() {
  const { videos, updateVideo } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [routeF, setRouteF] = useState('all')
  const [statusF, setStatusF] = useState('all')
  const [selected, setSelected] = useState(new Set())

  const filtered = videos.filter(v => {
    const r = routeF === 'all' || v.route === routeF
    const s = statusF === 'all' || v.status === statusF
    const q = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.subject.toLowerCase().includes(search.toLowerCase())
    return r && s && q
  })

  const toggleAll = () => setSelected(p => p.size === filtered.length ? new Set() : new Set(filtered.map(v => v.id)))

  return (
    <div style={{ padding:'28px', animation:'fade-in 0.2s ease' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.4px' }}>Review Queue</h1>
          <p style={{ fontSize:14, color:'var(--text2)', marginTop:4 }}>{filtered.length} videos · {videos.filter(v=>v.status==='review').length} need manual review</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {selected.size > 0 && <>
            <Btn variant="teal" size="sm" onClick={() => selected.forEach(id => updateVideo(id, {route:'enhance'}))}>Set {selected.size} → Enhance</Btn>
            <Btn variant="outline" size="sm" onClick={() => selected.forEach(id => updateVideo(id, {route:'recreate'}))}>Set → Recreate</Btn>
          </>}
          <Btn variant="primary" onClick={() => navigate('/batch')}>Process Selected</Btn>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search videos…"
          style={{ flex:1, minWidth:220, background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--r)', padding:'9px 14px', color:'var(--text1)', fontSize:14, fontFamily:'var(--font)', outline:'none', boxShadow:'var(--shadow-sm)' }} />
        {[
          { val:routeF, set:setRouteF, opts:[['all','All Routes'],['enhance','Enhance'],['recreate','Recreate'],['review','Review']] },
          { val:statusF, set:setStatusF, opts:[['all','All Status'],['pending','Pending'],['processing','Processing'],['done','Done'],['failed','Failed']] },
        ].map((f,i) => (
          <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
            style={{ background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--r)', padding:'9px 14px', color:'var(--text1)', fontSize:14, fontFamily:'var(--font)', outline:'none', boxShadow:'var(--shadow-sm)' }}>
            {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>

      <Card>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'var(--surface2)' }}>
              <th style={{ padding:'11px 18px', textAlign:'left', borderBottom:'1px solid var(--border)', width:36 }}>
                <input type="checkbox" checked={selected.size===filtered.length&&filtered.length>0} onChange={toggleAll} />
              </th>
              {['Video Title','Subject','Grade','Duration','AI Score','Route','Status','Actions'].map(h => (
                <th key={h} style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.06em', padding:'11px 14px', textAlign:'left', borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} style={{ cursor:'pointer', transition:'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding:'13px 18px', borderBottom:'1px solid var(--border)' }}><input type="checkbox" checked={selected.has(v.id)} onChange={() => setSelected(p => { const n=new Set(p); n.has(v.id)?n.delete(v.id):n.add(v.id); return n })} onClick={e=>e.stopPropagation()} /></td>
                <td onClick={() => navigate(`/video/${v.id}`)} style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>{v.title}</div>
                  <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{v.school}</div>
                </td>
                <td style={{ padding:'13px 14px', fontSize:13, color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>{v.subject}</td>
                <td style={{ padding:'13px 14px', fontSize:13, fontWeight:600, color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>Gr. {v.grade}</td>
                <td style={{ padding:'13px 14px', fontSize:13, color:'var(--text2)', fontFamily:'var(--mono)', borderBottom:'1px solid var(--border)' }}>{v.duration ? `${Math.floor(v.duration/60)}m` : '—'}</td>
                <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}><ScoreBar score={v.qualityScore} /></td>
                <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}><RoutePill route={v.route} /></td>
                <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}><Badge variant={v.status}>{v.status.charAt(0).toUpperCase()+v.status.slice(1)}</Badge></td>
                <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }} onClick={e=>e.stopPropagation()}>
                  <div style={{ display:'flex', gap:4 }}>
                    <button onClick={() => updateVideo(v.id,{route:'enhance'})} style={{ padding:'4px 9px', fontSize:11, fontWeight:700, background:'var(--teal-bg)', color:'var(--teal)', border:'1px solid rgba(13,148,136,0.2)', borderRadius:6, cursor:'pointer' }}>E</button>
                    <button onClick={() => updateVideo(v.id,{route:'recreate'})} style={{ padding:'4px 9px', fontSize:11, fontWeight:700, background:'var(--blue-bg)', color:'var(--blue2)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:6, cursor:'pointer' }}>R</button>
                    <button onClick={() => navigate(`/video/${v.id}`)} style={{ padding:'4px 9px', fontSize:11, fontWeight:700, background:'var(--surface2)', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:6, cursor:'pointer' }}>→</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding:'48px', textAlign:'center', color:'var(--text3)', fontSize:14 }}>No videos match the current filters</div>}
        <div style={{ padding:'12px 18px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:13, color:'var(--text3)' }}>{filtered.length} results{selected.size>0?` · ${selected.size} selected`:''}</span>
        </div>
      </Card>
    </div>
  )
}
