import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Badge, RoutePill, ScoreBar, Card, CardHead, Btn } from '../components/ui'

const GRADES   = ['All Grades', ...Array.from({length:7},(_,i)=>`Grade ${i+6}`)]
const ROUTES   = ['All Routes','enhance','recreate','review']
const STATUSES = ['All Statuses','pending','processing','done','failed','review']
const SUBJECTS = ['All Subjects','Mathematics','Physics','Chemistry','Biology','English']

export default function ReviewQueue() {
  const { videos, updateVideo } = useApp()
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [gradeF, setGradeF]     = useState('All Grades')
  const [routeF, setRouteF]     = useState('All Routes')
  const [statusF, setStatusF]   = useState('All Statuses')
  const [subjectF, setSubjectF] = useState('All Subjects')
  const [selected, setSelected] = useState(new Set())

  const filtered = videos.filter(v => {
    const g = gradeF  === 'All Grades'    || v.grade === parseInt(gradeF.split(' ')[1])
    const r = routeF  === 'All Routes'    || v.route   === routeF
    const s = statusF === 'All Statuses'  || v.status  === statusF
    const u = subjectF=== 'All Subjects'  || v.subject === subjectF
    const q = !search || v.title.toLowerCase().includes(search.toLowerCase())
    return g && r && s && u && q
  })

  const toggleSelect = (id) => setSelected(p => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n
  })
  const toggleAll = () => setSelected(p => p.size === filtered.length ? new Set() : new Set(filtered.map(v => v.id)))

  const overrideRoute = (id, route) => updateVideo(id, { route, status: 'pending' })

  return (
    <div style={{ padding: 24, animation: 'fade-in 0.2s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Review Queue</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>{filtered.length} videos · {videos.filter(v=>v.status==='review').length} need manual review</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {selected.size > 0 && (
            <>
              <Btn variant="teal" size="sm" onClick={() => selected.forEach(id => overrideRoute(id, 'enhance'))}>
                Set {selected.size} → Enhance
              </Btn>
              <Btn variant="outline" size="sm" onClick={() => selected.forEach(id => overrideRoute(id, 'recreate'))}>
                Set → Recreate
              </Btn>
            </>
          )}
          <Btn variant="primary" onClick={() => navigate('/batch')}>Process Selected</Btn>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search videos…"
          style={{
            flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border2)', borderRadius: 8,
            padding: '7px 12px', color: 'var(--text1)',
            fontSize: 12, fontFamily: 'var(--font)', outline: 'none',
          }}
        />
        {[
          { val: gradeF,   set: setGradeF,   opts: GRADES },
          { val: subjectF, set: setSubjectF, opts: SUBJECTS },
          { val: routeF,   set: setRouteF,   opts: ROUTES },
          { val: statusF,  set: setStatusF,  opts: STATUSES },
        ].map((f, i) => (
          <select
            key={i} value={f.val} onChange={e => f.set(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border2)', borderRadius: 7,
              padding: '7px 10px', color: 'var(--text1)',
              fontSize: 12, fontFamily: 'var(--font)', outline: 'none',
            }}
          >
            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Table */}
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '9px 14px', textAlign: 'left' }}>
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll} />
              </th>
              {['Title','Subject','Grade','Duration','Score','Route','Status','Actions'].map(h => (
                <th key={h} style={{
                  fontSize: 10, fontWeight: 600, color: 'var(--text3)',
                  textTransform: 'uppercase', letterSpacing: '.06em',
                  padding: '9px 12px', textAlign: 'left',
                  borderBottom: '1px solid var(--border)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr
                key={v.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <input type="checkbox" checked={selected.has(v.id)} onChange={() => toggleSelect(v.id)} onClick={e => e.stopPropagation()} />
                </td>
                <td
                  onClick={() => navigate(`/video/${v.id}`)}
                  style={{ padding: '9px 12px', fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: 500 }}
                >
                  {v.title}
                </td>
                <td style={{ padding: '9px 12px', fontSize: 11, color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{v.subject}</td>
                <td style={{ padding: '9px 12px', fontSize: 11, color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>Gr. {v.grade}</td>
                <td style={{ padding: '9px 12px', fontSize: 11, color: 'var(--text2)', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'var(--mono)' }}>
                  {v.duration ? `${Math.floor(v.duration/60)}m` : '—'}
                </td>
                <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}><ScoreBar score={v.qualityScore} /></td>
                <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}><RoutePill route={v.route} /></td>
                <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}><Badge variant={v.status}>{v.status.charAt(0).toUpperCase()+v.status.slice(1)}</Badge></td>
                <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => overrideRoute(v.id, 'enhance')} title="Set Enhance"
                      style={{ padding: '3px 8px', fontSize: 10, background: 'rgba(27,208,165,0.1)', color: 'var(--teal)', border: '1px solid rgba(27,208,165,0.2)', borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                      E
                    </button>
                    <button onClick={() => overrideRoute(v.id, 'recreate')} title="Set Recreate"
                      style={{ padding: '3px 8px', fontSize: 10, background: 'rgba(79,124,255,0.1)', color: 'var(--accent2)', border: '1px solid rgba(79,124,255,0.2)', borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                      R
                    </button>
                    <button onClick={() => navigate(`/video/${v.id}`)} title="Open Detail"
                      style={{ padding: '3px 8px', fontSize: 10, background: 'rgba(255,255,255,0.05)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                      →
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
            No videos match the current filters
          </div>
        )}
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{filtered.length} results</span>
          {selected.size > 0 && (
            <span style={{ fontSize: 11, color: 'var(--accent2)', marginLeft: 8 }}>{selected.size} selected</span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['10','25','50'].map(n => (
              <button key={n} style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 11, cursor: 'pointer' }}>{n}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
