import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Card, CardHead, Btn, Spinner } from '../components/ui'
import { MOCK_SCENES } from '../lib/mockData'

const SCENE_DEFS = [
  { id: 'hook',    label: 'Scene 1 – Hook',    duration: '~30s',  color: 'var(--accent2)',  desc: 'One sentence: why does this concept matter?' },
  { id: 'intro',   label: 'Scene 2 – Intro',   duration: '1–2min',color: 'var(--teal)',     desc: 'Plain definition + one visual description' },
  { id: 'example', label: 'Scene 3 – Example', duration: '4–6min',color: 'var(--green)',    desc: 'Step-by-step worked example, board-animated' },
  { id: 'mistakes',label: 'Scene 4 – Mistakes',duration: '1–2min',color: 'var(--amber)',    desc: '2–3 things students commonly get wrong' },
  { id: 'recap',   label: 'Scene 5 – Recap',   duration: '~1min', color: 'var(--purple)',   desc: '3 bullet points summary' },
]

const MANIM_PREVIEW = {
  hook:     'ax² + bx + c = 0\n\n"Why do projectiles follow\ncurved paths? Quadratics."',
  intro:    'DEFINITION\n────────────────────\nax² + bx + c = 0\n\nwhere a ≠ 0\n\nDegree: 2 (polynomial)',
  example:  'SOLVE: x² - 5x + 6 = 0\n\nStep 1: Find p×q=6, p+q=5\n   → p=2, q=3\n\nStep 2: (x-2)(x-3) = 0\n\nStep 3: x=2 or x=3 ✓',
  mistakes: '⚠ COMMON MISTAKES\n\n✗ Forgetting ± in formula\n✗ Dividing only part by 2a\n✗ Setting a=0 by accident',
  recap:    'KEY POINTS\n──────────────────\n• ax²+bx+c=0, a≠0\n• D = b²-4ac → nature\n• Factor or formula ✓',
}

export default function SceneEditor() {
  const { videos } = useApp()
  const activeVideo = videos.find(v => v.status === 'processing') || videos[0]

  const [activeScene, setActiveScene] = useState('hook')
  const [scripts, setScripts]         = useState({
    hook:     MOCK_SCENES.hook,
    intro:    `${MOCK_SCENES.intro.definition}\n\nVisual: ${MOCK_SCENES.intro.visual}`,
    example:  MOCK_SCENES.example_steps.join('\n'),
    mistakes: MOCK_SCENES.mistakes.join('\n'),
    recap:    MOCK_SCENES.recap.join('\n'),
  })
  const [sceneDone, setSceneDone]     = useState({ hook: true, intro: true, example: false, mistakes: false, recap: false })
  const [rendering, setRendering]     = useState(null)
  const [generating, setGenerating]   = useState(false)

  const renderScene = async (id) => {
    setRendering(id)
    await new Promise(r => setTimeout(r, 2000))
    setRendering(null)
    setSceneDone(p => ({ ...p, [id]: true }))
  }

  const generateAllScenes = async () => {
    setGenerating(true)
    try {
      const resp = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: 'demo', videoId: activeVideo?.id }),
      })
      if (resp.ok) {
        const data = await resp.json()
        if (data.scenes) {
          setScripts({
            hook: data.scenes.hook,
            intro: `${data.scenes.intro?.definition}\nVisual: ${data.scenes.intro?.visual}`,
            example: (data.scenes.example_steps || []).join('\n'),
            mistakes: (data.scenes.mistakes || []).join('\n'),
            recap: (data.scenes.recap || []).join('\n'),
          })
        }
      }
    } catch { /* use existing */ }
    setGenerating(false)
    setSceneDone({ hook: true, intro: true, example: true, mistakes: true, recap: true })
  }

  const doneCount = Object.values(sceneDone).filter(Boolean).length
  const cur = SCENE_DEFS.find(s => s.id === activeScene)

  return (
    <div style={{ padding: 24, animation: 'fade-in 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Scene Editor</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>
            {activeVideo?.title ?? 'No active video'} · 5-scene Khan Academy recreation
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{doneCount}/5 scenes ready</span>
          <Btn variant="outline" onClick={generateAllScenes} disabled={generating}>
            {generating ? <><Spinner size={12} /> Generating…</> : '⚡ AI Generate All Scenes'}
          </Btn>
          <Btn variant="primary" disabled={doneCount < 5}>▶ Render All with Manim</Btn>
        </div>
      </div>

      {/* Scene tabs */}
      <Card>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          {SCENE_DEFS.map(sc => (
            <button
              key={sc.id}
              onClick={() => setActiveScene(sc.id)}
              style={{
                padding: '10px 18px', fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                background: 'transparent', fontFamily: 'var(--font)', whiteSpace: 'nowrap', flexShrink: 0,
                color: activeScene === sc.id ? sc.color : sceneDone[sc.id] ? 'var(--green)' : rendering === sc.id ? 'var(--amber)' : 'var(--text2)',
                borderBottom: `2px solid ${activeScene === sc.id ? sc.color : 'transparent'}`,
                transition: 'all 0.15s',
              }}
            >
              {sceneDone[sc.id] ? '✓ ' : rendering === sc.id ? '⏳ ' : ''}{sc.label}
            </button>
          ))}
        </div>

        {/* Scene content */}
        <div style={{ padding: 16 }}>
          {/* Meta row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              { label: 'Duration', val: cur?.duration },
              { label: 'Style', val: 'Khan Academy Board' },
              { label: 'BG', val: '#1a1a2e · Dark Navy' },
              { label: 'Font', val: 'Courier · White' },
            ].map(c => (
              <span key={c.label} style={{
                padding: '3px 9px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)', borderRadius: 5, fontSize: 11,
                color: 'var(--text2)',
              }}>
                <span style={{ color: 'var(--text3)' }}>{c.label}: </span>
                <span style={{ color: 'var(--text1)', fontWeight: 600 }}>{c.val}</span>
              </span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {/* Script */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Voiceover Script</div>
              <textarea
                value={scripts[activeScene] || ''}
                onChange={e => setScripts(p => ({ ...p, [activeScene]: e.target.value }))}
                style={{
                  width: '100%', minHeight: 180,
                  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border2)',
                  borderRadius: 7, padding: 10,
                  fontSize: 12, fontFamily: 'var(--mono)',
                  color: 'var(--text1)', lineHeight: 1.7, outline: 'none', resize: 'vertical',
                }}
              />
            </div>

            {/* Manim preview */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Manim Board Preview</div>
              <div style={{
                background: '#1a1a2e', border: '1px solid var(--border)',
                borderRadius: 7, minHeight: 180,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
                padding: 16, position: 'relative', fontFamily: 'var(--mono)',
              }}>
                <div style={{ position: 'absolute', top: 7, left: 8, fontSize: 9, color: 'var(--text3)' }}>MANIM PREVIEW</div>
                {rendering === activeScene ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 8 }}>
                    <Spinner size={24} />
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>Rendering animation…</div>
                  </div>
                ) : (
                  <pre style={{ fontSize: 12, color: '#fff', lineHeight: 1.8, marginTop: 16, whiteSpace: 'pre-wrap' }}>
                    {MANIM_PREVIEW[activeScene]}
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Btn variant="primary" onClick={() => renderScene(activeScene)} disabled={!!rendering}>
              {rendering === activeScene ? <><Spinner size={12} /> Rendering…</> : '▶ Render with Manim'}
            </Btn>
            <Btn variant="teal" onClick={() => setSceneDone(p => ({ ...p, [activeScene]: !p[activeScene] }))}>
              {sceneDone[activeScene] ? '✓ Approved' : '○ Approve Scene'}
            </Btn>
            <Btn variant="outline">Preview Audio</Btn>
            <Btn variant="outline">Export Script</Btn>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <Btn variant="ghost" size="sm" onClick={() => {
                const idx = SCENE_DEFS.findIndex(s => s.id === activeScene)
                if (idx > 0) setActiveScene(SCENE_DEFS[idx-1].id)
              }}>← Prev</Btn>
              <Btn variant="ghost" size="sm" onClick={() => {
                const idx = SCENE_DEFS.findIndex(s => s.id === activeScene)
                if (idx < SCENE_DEFS.length - 1) setActiveScene(SCENE_DEFS[idx+1].id)
              }}>Next →</Btn>
            </div>
          </div>
        </div>
      </Card>

      {/* Scene overview grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginTop: 16 }}>
        {SCENE_DEFS.map(sc => (
          <div
            key={sc.id}
            onClick={() => setActiveScene(sc.id)}
            style={{
              background: activeScene === sc.id ? 'rgba(79,124,255,0.1)' : 'var(--card)',
              border: `1px solid ${activeScene === sc.id ? 'rgba(79,124,255,0.35)' : 'var(--border)'}`,
              borderRadius: 8, padding: '10px 12px', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: sc.color, marginBottom: 4 }}>{sc.label}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6 }}>{sc.duration}</div>
            <div style={{ fontSize: 10, color: 'var(--text2)', lineHeight: 1.5 }}>{sc.desc}</div>
            <div style={{ marginTop: 8 }}>
              {sceneDone[sc.id]
                ? <span style={{ fontSize: 10, color: 'var(--green)' }}>✓ Ready</span>
                : rendering === sc.id
                ? <span style={{ fontSize: 10, color: 'var(--amber)' }}>⏳ Rendering</span>
                : <span style={{ fontSize: 10, color: 'var(--text3)' }}>○ Pending</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
