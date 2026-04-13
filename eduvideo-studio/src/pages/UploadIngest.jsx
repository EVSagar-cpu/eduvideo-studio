import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Btn, Card, CardHead, FormInput, SectionLabel } from '../components/ui'

const SUBJECTS = ['Mathematics','Physics','Chemistry','Biology','English','History','Geography','Economics']
const GRADES   = [6,7,8,9,10,11,12]

export default function UploadIngest() {
  const { addVideo } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('manual') // manual | zoom | batch
  const [drag, setDrag] = useState(false)
  const [files, setFiles] = useState({ video: null, transcript: null })
  const [meta, setMeta] = useState({ title: '', subject: 'Mathematics', grade: 9, school: '' })
  const [adding, setAdding] = useState(false)
  const [batchList, setBatchList] = useState([])
  const videoRef = useRef()
  const txRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false)
    const f = Array.from(e.dataTransfer.files)
    f.forEach(file => {
      if (file.type.startsWith('video/')) setFiles(p => ({ ...p, video: file }))
      if (file.name.endsWith('.txt') || file.name.endsWith('.vtt') || file.name.endsWith('.srt'))
        setFiles(p => ({ ...p, transcript: file }))
    })
  }

  const handleSubmit = async () => {
    if (!meta.title) return alert('Please enter a video title')
    setAdding(true)
    await new Promise(r => setTimeout(r, 800))
    const video = {
      title: meta.title, subject: meta.subject,
      grade: parseInt(meta.grade), school: meta.school,
      rawPath: files.video?.name || 'uploaded.mp4',
      transcriptPath: files.transcript?.name || null,
      duration: 1500, resolution: '1280x720', audioSNR: 0,
      qualityScore: 0, route: 'pending', status: 'pending',
      cleanTranscript: null, scenes: [],
      outputPath: null, finalDuration: null,
    }
    const v = await addVideo(video)
    setAdding(false)
    navigate(`/video/${v.id}`)
  }

  return (
    <div style={{ padding: 24, animation: 'fade-in 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Upload / Ingest</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>Add videos to the processing pipeline</div>
        </div>
      </div>

      {/* Tab strip */}
      <div style={{ display: 'flex', background: 'var(--navy2)', border: '1px solid var(--border)', borderRadius: 8, padding: 4, gap: 4, marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'manual', label: '⬆ Manual Upload' },
          { id: 'zoom', label: '☁ Zoom Export Folder' },
          { id: 'batch', label: '⚡ Batch CSV Import' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: 12, fontWeight: 500,
              background: tab === t.id ? 'var(--accent)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--text2)',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'manual' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          {/* Left: drop zone + fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${drag ? 'var(--accent)' : 'var(--border2)'}`,
                borderRadius: 12, padding: 40,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                background: drag ? 'rgba(79,124,255,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
              onClick={() => videoRef.current?.click()}
            >
              <div style={{ fontSize: 36, opacity: 0.4 }}>🎬</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>
                {files.video ? files.video.name : 'Drop video file here'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>MP4, MOV, AVI · up to 2GB</div>
              <Btn variant="outline" size="sm" onClick={e => { e.stopPropagation(); videoRef.current?.click() }}>Browse file</Btn>
              <input ref={videoRef} type="file" accept="video/*" style={{ display: 'none' }}
                onChange={e => setFiles(p => ({ ...p, video: e.target.files[0] }))} />
            </div>

            {/* Transcript upload */}
            <Card>
              <CardHead title="Transcript File (optional)" meta="TXT, VTT, SRT" />
              <div style={{ padding: 14 }}>
                <div
                  style={{
                    border: `1px dashed ${files.transcript ? 'var(--green)' : 'var(--border2)'}`,
                    borderRadius: 8, padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer', background: 'rgba(255,255,255,0.02)',
                  }}
                  onClick={() => txRef.current?.click()}
                >
                  <span style={{ fontSize: 18 }}>{files.transcript ? '✅' : '📝'}</span>
                  <span style={{ fontSize: 12, color: files.transcript ? 'var(--green)' : 'var(--text2)' }}>
                    {files.transcript ? files.transcript.name : 'Upload Zoom auto-transcript (.txt / .vtt)'}
                  </span>
                  <input ref={txRef} type="file" accept=".txt,.vtt,.srt" style={{ display: 'none' }}
                    onChange={e => setFiles(p => ({ ...p, transcript: e.target.files[0] }))} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>
                  If omitted, Whisper large-v3 will auto-transcribe the video (adds ~2 min)
                </div>
              </div>
            </Card>
          </div>

          {/* Right: metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card>
              <CardHead title="Video Metadata" />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <FormInput
                  label="Title"
                  value={meta.title}
                  onChange={e => setMeta(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Quadratic Equations – Basics"
                />
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', fontWeight: 500, marginBottom: 5 }}>Subject</label>
                  <select
                    value={meta.subject}
                    onChange={e => setMeta(p => ({ ...p, subject: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)', borderRadius: 7, padding: '8px 10px', color: 'var(--text1)', fontSize: 12, fontFamily: 'var(--font)', outline: 'none' }}
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', fontWeight: 500, marginBottom: 5 }}>Grade</label>
                  <select
                    value={meta.grade}
                    onChange={e => setMeta(p => ({ ...p, grade: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)', borderRadius: 7, padding: '8px 10px', color: 'var(--text1)', fontSize: 12, fontFamily: 'var(--font)', outline: 'none' }}
                  >
                    {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <FormInput
                  label="School"
                  value={meta.school}
                  onChange={e => setMeta(p => ({ ...p, school: e.target.value }))}
                  placeholder="e.g. Narayana Hyderabad"
                />
              </div>
            </Card>

            {/* Quality classifier info */}
            <Card>
              <CardHead title="Auto-Classifier" />
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { check: 'Resolution ≥ 720p', pts: '+30 pts' },
                  { check: 'Audio bitrate ≥ 128k', pts: '+20 pts' },
                  { check: 'Audio SNR ≥ 20dB', pts: '+20 pts' },
                  { check: 'Duration 15–35 min', pts: '+15 pts' },
                  { check: 'No major dropout', pts: '+15 pts' },
                ].map(c => (
                  <div key={c.check} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: 'var(--text2)' }}>{c.check}</span>
                    <span style={{ color: 'var(--teal)', fontFamily: 'var(--mono)' }}>{c.pts}</span>
                  </div>
                ))}
                <div style={{ marginTop: 6, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, fontSize: 11 }}>
                  <span style={{ color: 'var(--green)' }}>≥80 → Enhance</span>
                  <span style={{ color: 'var(--text3)', margin: '0 8px' }}>·</span>
                  <span style={{ color: 'var(--amber)' }}>50–79 → Review</span>
                  <span style={{ color: 'var(--text3)', margin: '0 8px' }}>·</span>
                  <span style={{ color: 'var(--red)' }}>&lt;50 → Recreate</span>
                </div>
              </div>
            </Card>

            <Btn variant="primary" onClick={handleSubmit} disabled={adding} style={{ width: '100%', justifyContent: 'center' }}>
              {adding ? '⏳ Adding to queue...' : '⬆ Add to Pipeline'}
            </Btn>
          </div>
        </div>
      )}

      {tab === 'zoom' && (
        <Card>
          <CardHead title="Connect Zoom Export Folder" />
          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>☁</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Zoom Cloud Recording Import</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', maxWidth: 400, lineHeight: 1.7 }}>
              Point to your Zoom export folder. The pipeline will scan for MP4 + VTT pairs and auto-ingest all matching recordings.
            </div>
            <FormInput label="Zoom Export Folder Path" placeholder="/Users/you/Zoom/exports" style={{ width: 360 }} />
            <Btn variant="primary">Scan Folder</Btn>
          </div>
        </Card>
      )}

      {tab === 'batch' && (
        <Card>
          <CardHead title="Batch CSV Import" meta="Up to 200 rows per file" />
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.7 }}>
              Upload a CSV with columns: <code style={{ fontFamily: 'var(--mono)', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 3 }}>title, subject, grade, school, video_path, transcript_path</code>
            </div>
            <div style={{
              border: '2px dashed var(--border2)', borderRadius: 10,
              padding: 40, textAlign: 'center', color: 'var(--text3)',
              fontSize: 13, cursor: 'pointer',
            }}>
              Drop CSV file here or click to browse
            </div>
            {batchList.length > 0 && (
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text2)' }}>
                {batchList.length} rows detected
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
