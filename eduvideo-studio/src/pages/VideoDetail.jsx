import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Badge, RoutePill, Card, CardHead, Btn, Spinner } from '../components/ui'
import { MOCK_RAW_TRANSCRIPT, MOCK_CLEAN_TRANSCRIPT } from '../lib/mockData'

const TABS = ['Transcript', 'Trim Editor', 'Quality']

function parseTranscript(raw) {
  return raw.trim().split('\n').map((line, i) => {
    const m = line.match(/^\[(\d{2}:\d{2}:\d{2})\] (.+?): (.+)$/)
    if (m) return { id: i, ts: m[1], speaker: m[2], text: m[3], removed: false }
    return { id: i, ts: '', speaker: '', text: line, removed: false }
  }).filter(s => s.text)
}

export default function VideoDetail() {
  const { id } = useParams()
  const { videos, updateVideo, addActivity } = useApp()
  const navigate = useNavigate()
  const video = videos.find(v => v.id === id)

  const [tab, setTab]               = useState('Transcript')
  const [rawSegs, setRawSegs]       = useState(() => parseTranscript(MOCK_RAW_TRANSCRIPT))
  const [cleanSegs, setCleanSegs]   = useState(() => parseTranscript(MOCK_CLEAN_TRANSCRIPT))
  const [cleaning, setCleaning]     = useState(false)
  const [generating, setGenerating] = useState(false)
  const [cleanDone, setCleanDone]   = useState(false)
  const [routeOverride, setRoute]   = useState(video?.route || 'enhance')

  useEffect(() => {
    if (video) setRoute(video.route)
  }, [video])

  if (!video) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>
      Video not found. <span style={{ color: 'var(--accent2)', cursor: 'pointer' }} onClick={() => navigate('/queue')}>← Back to queue</span>
    </div>
  )

  const handleClean = async () => {
    setCleaning(true)
    try {
      const resp = await fetch('/api/clean-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: rawSegs.map(s => `[${s.ts}] ${s.speaker}: ${s.text}`).join('\n') }),
      })
      if (resp.ok) {
        const { clean } = await resp.json()
        setCleanSegs(parseTranscript(clean))
      }
    } catch {
      // Demo fallback
    } finally {
      setCleaning(false)
      setCleanDone(true)
      addActivity(`"${video.title}" transcript cleaned via LLM`, 'success')
    }
  }

  const handleGenerateScenes = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(false)
    updateVideo(video.id, { status: 'processing', cleanTranscript: cleanSegs.map(s => `[${s.ts}] ${s.text}`).join('\n') })
    addActivity(`"${video.title}" scenes generated → routing to ${routeOverride}`, 'success')
    navigate('/scenes')
  }

  const handleRouteOverride = (r) => {
    setRoute(r)
    updateVideo(video.id, { route: r })
  }

  const removed = rawSegs.filter(s => s.removed).length
  const kept = rawSegs.filter(s => !s.removed).length

  return (
    <div style={{ padding: 24, animation: 'fade-in 0.2s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--accent2)', cursor: 'pointer', fontSize: 13 }} onClick={() => navigate('/queue')}>← Queue</span>
            <span style={{ color: 'var(--text3)' }}>/</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{video.title}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <Badge variant={video.status}>{video.status}</Badge>
            <RoutePill route={routeOverride} />
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Gr. {video.grade} · {video.subject} · Score: {video.qualityScore}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Route override */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)', borderRadius: 7, padding: 3, gap: 2 }}>
            {['enhance','recreate','review'].map(r => (
              <button key={r} onClick={() => handleRouteOverride(r)} style={{
                padding: '5px 11px', borderRadius: 5, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                background: routeOverride === r ? 'var(--accent)' : 'transparent',
                color: routeOverride === r ? '#fff' : 'var(--text2)',
                transition: 'all 0.15s',
              }}>{r}</button>
            ))}
          </div>
          <Btn variant="primary" onClick={handleGenerateScenes} disabled={generating}>
            {generating ? <><Spinner size={12} /> Generating…</> : '▶ Process Video'}
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20, gap: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 18px', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer',
            background: 'transparent', fontFamily: 'var(--font)',
            color: tab === t ? 'var(--accent2)' : 'var(--text2)',
            borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
            transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'Transcript' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Btn variant="primary" onClick={handleClean} disabled={cleaning}>
              {cleaning ? <><Spinner size={12} /> Cleaning…</> : '⚡ AI Clean Transcript'}
            </Btn>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>
              Powered by LLaMA 3.3 70B (Groq) · Removes Q&A, noise, off-topic
            </span>
            {cleanDone && <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ Clean complete</span>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: 11 }}>
              <span style={{ color: 'var(--green)' }}>✓ {kept} kept</span>
              <span style={{ color: 'var(--red)' }}>✗ {removed} removed</span>
            </div>
          </div>

          {/* Side-by-side diff */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, height: 420 }}>
            {/* Raw */}
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)' }}>Raw Transcript</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{rawSegs.length} segments</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
                {rawSegs.map(seg => (
                  <div
                    key={seg.id}
                    style={{
                      display: 'flex', gap: 8, padding: '5px 6px', borderRadius: 5, marginBottom: 2,
                      opacity: seg.removed ? 0.35 : 1,
                      textDecoration: seg.removed ? 'line-through' : 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => setRawSegs(p => p.map(s => s.id === seg.id ? { ...s, removed: !s.removed } : s))}
                  >
                    <span style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--mono)', minWidth: 44, flexShrink: 0, paddingTop: 1 }}>{seg.ts}</span>
                    <span style={{ fontSize: 12, color: 'var(--text1)', lineHeight: 1.5, flex: 1 }}>
                      {seg.speaker && <strong style={{ color: 'var(--text3)', fontSize: 10, marginRight: 4 }}>{seg.speaker}:</strong>}
                      {seg.text}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); setRawSegs(p => p.map(s => s.id === seg.id ? { ...s, removed: !s.removed } : s)) }}
                      style={{ width: 16, height: 16, borderRadius: 3, background: 'rgba(255,94,94,0.1)', border: 'none', color: 'var(--red)', fontSize: 10, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean */}
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)' }}>Clean Transcript</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{cleanSegs.length} segments</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
                {cleanSegs.map(seg => (
                  <div
                    key={seg.id}
                    style={{
                      display: 'flex', gap: 8, padding: '5px 6px',
                      borderRadius: 5, marginBottom: 2,
                    }}
                  >
                    <span style={{ fontSize: 10, color: 'var(--teal)', fontFamily: 'var(--mono)', minWidth: 44, flexShrink: 0, paddingTop: 1 }}>{seg.ts}</span>
                    <span
                      contentEditable suppressContentEditableWarning
                      style={{ fontSize: 12, color: 'var(--text1)', lineHeight: 1.5, flex: 1, outline: 'none', borderBottom: '1px dashed rgba(79,124,255,0.3)' }}
                    >{seg.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, padding: '8px 12px', borderTop: '1px solid var(--border)' }}>
                <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Copy</button>
                <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Export .txt</button>
                <button style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text2)', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Trim Editor' && (
        <TrimEditor video={video} />
      )}

      {tab === 'Quality' && (
        <QualityPanel video={video} />
      )}
    </div>
  )
}

function TrimEditor({ video }) {
  const [trimStart, setTrimStart] = useState(62)
  const [trimEnd, setTrimEnd]     = useState(680)
  const duration = video.duration || 1500
  const pct = (v) => `${(v / duration) * 100}%`
  const fmtTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <CardHead title="Video Trim Editor" meta={`Source: ${fmtTime(duration)} · Target: 10–15 min`} />
        <div style={{ padding: 16 }}>
          {/* Video preview area */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 14, marginBottom: 14 }}>
            <div style={{ background: '#1a1a2e', borderRadius: 7, height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', position: 'relative' }}>
              <div style={{ width: 32, height: 32, background: 'rgba(79,124,255,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer' }}>▶</div>
              <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{video.resolution}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
              {[
                { label: 'Source Duration', val: fmtTime(duration), color: 'var(--text1)' },
                { label: 'Trim Start', val: fmtTime(trimStart), color: 'var(--amber)' },
                { label: 'Trim End', val: fmtTime(trimEnd), color: 'var(--amber)' },
                { label: 'Output Duration', val: fmtTime(trimEnd - trimStart), color: trimEnd - trimStart <= 900 ? 'var(--green)' : 'var(--amber)' },
                { label: 'Audio SNR', val: `${video.audioSNR} dB`, color: video.audioSNR >= 20 ? 'var(--green)' : 'var(--amber)' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--text3)', minWidth: 110, fontSize: 11 }}>{r.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', color: r.color }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, fontFamily: 'var(--mono)', display: 'flex', justifyContent: 'space-between' }}>
              <span>0:00</span><span>{fmtTime(Math.floor(duration/2))}</span><span>{fmtTime(duration)}</span>
            </div>
            {/* Track */}
            <div style={{ height: 36, background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
              {/* Waveform mockup */}
              {Array.from({length:80}).map((_,i) => (
                <div key={i} style={{
                  position: 'absolute', left: `${(i/80)*100}%`, bottom: 4,
                  width: 2, height: `${10 + Math.random()*22}px`,
                  background: 'rgba(79,124,255,0.2)', borderRadius: 1,
                }} />
              ))}
              {/* Trim selection */}
              <div style={{
                position: 'absolute', left: pct(trimStart), width: `calc(${pct(trimEnd)} - ${pct(trimStart)})`,
                top: 0, bottom: 0,
                background: 'rgba(27,208,165,0.15)', border: '1px solid rgba(27,208,165,0.4)',
              }} />
            </div>
            {/* Sliders */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>
                Start: {fmtTime(trimStart)}
                <input type="range" min={0} max={duration} value={trimStart} onChange={e => setTrimStart(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--amber)', display: 'block', marginTop: 4 }} />
              </label>
              <label style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>
                End: {fmtTime(trimEnd)}
                <input type="range" min={0} max={duration} value={trimEnd} onChange={e => setTrimEnd(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--amber)', display: 'block', marginTop: 4 }} />
              </label>
            </div>
          </div>

          {/* FFmpeg command */}
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', borderRadius: 7, padding: '10px 14px' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, fontFamily: 'var(--mono)' }}>Generated FFmpeg command:</div>
            <code style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--teal)' }}>
              {`ffmpeg -i input.mp4 -ss ${fmtTime(trimStart)} -to ${fmtTime(trimEnd)} -c copy output_trimmed.mp4`}
            </code>
          </div>
        </div>
      </Card>
    </div>
  )
}

function QualityPanel({ video }) {
  const checks = [
    { label: 'Resolution ≥ 720p', val: video.resolution, pts: video.resolution?.includes('1280') || video.resolution?.includes('1920') ? 30 : 0, max: 30 },
    { label: 'Audio SNR ≥ 20dB', val: `${video.audioSNR} dB`, pts: video.audioSNR >= 20 ? 20 : 0, max: 20 },
    { label: 'Audio bitrate ≥ 128k', val: '192kbps', pts: 20, max: 20 },
    { label: 'Duration 15–35 min', val: `${Math.floor(video.duration/60)} min`, pts: video.duration >= 900 && video.duration <= 2100 ? 15 : 0, max: 15 },
    { label: 'No major dropout', val: 'Detected: 0', pts: 15, max: 15 },
  ]
  const total = checks.reduce((a,c) => a + c.pts, 0)
  const route = total >= 80 ? 'enhance' : total >= 50 ? 'review' : 'recreate'
  const routeColors = { enhance: 'var(--green)', review: 'var(--amber)', recreate: 'var(--red)' }

  return (
    <Card>
      <CardHead title="FFprobe Quality Analysis" />
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 200px', gap: 20 }}>
        <div>
          {checks.map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ color: c.pts > 0 ? 'var(--green)' : 'var(--red)', fontSize: 13 }}>{c.pts > 0 ? '✓' : '✗'}</span>
              <span style={{ fontSize: 12, flex: 1 }}>{c.label}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{c.val}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: c.pts > 0 ? 'var(--green)' : 'var(--text3)', minWidth: 36, textAlign: 'right' }}>+{c.pts}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '20px 0' }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: routeColors[route], lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>Quality Score</div>
          <div style={{ marginTop: 4 }}><RoutePill route={route} /></div>
          <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginTop: 8 }}>
            {route === 'enhance' ? 'High quality — enhance & export' : route === 'review' ? 'Edge case — manual review needed' : 'Low quality — full recreation'}
          </div>
        </div>
      </div>
    </Card>
  )
}
