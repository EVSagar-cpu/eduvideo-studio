# EduVideo Studio

AI-Powered Video Enhancement & Recreation Platform
Built for Narayana Educational Institutions — 2000-video pipeline

---

## What it does

Transforms 40 lakh+ COVID-era Zoom recordings into Khan Academy–style educational content.

| Path | Input | Output |
|------|-------|--------|
| **Enhance** | Good quality video (score ≥80) | Denoised, upscaled, captioned MP4 |
| **Recreate** | Poor quality video (score <50) | Manim board animation + TTS voiceover |
| **Review** | Edge case (score 50–79) | Manual human decision required |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Hosting | Vercel (free) |
| Database | Supabase (free 500MB) |
| AI Transcript | Groq — LLaMA 3.3 70B (free tier) |
| Transcription | Groq — Whisper large-v3 (free tier) |
| TTS (V1) | Coqui TTS / Bark (local, free) |
| TTS (V2) | ElevenLabs API (~$5/mo) |
| Video processing | Python backend — run locally |

---

## Quick Start (GitHub + Vercel only)

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/eduvideo-studio.git
cd eduvideo-studio
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

For demo mode (no APIs needed):
```
VITE_DEMO_MODE=true
```

For live mode:
```
VITE_DEMO_MODE=false
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=gsk_your-groq-key   ← server-side only (Vercel env vars)
```

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000

### 4. Deploy to Vercel

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel

# Option B — Connect GitHub repo in vercel.com dashboard
# → Import repo → Framework: Vite → Deploy
```

Add environment variables in Vercel Dashboard → Settings → Environment Variables:
- `GROQ_API_KEY` (required for AI features)
- `VITE_SUPABASE_URL` (required for database)
- `VITE_SUPABASE_ANON_KEY` (required for database)

---

## Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → paste the schema from `src/lib/supabase.js` (at the bottom)
3. Go to **Settings → API** → copy URL and anon key
4. Add to `.env` and Vercel environment variables

---

## Groq API (Free, no credit card)

1. Go to [console.groq.com](https://console.groq.com)
2. Create account → API Keys → Create key
3. Add as `GROQ_API_KEY` in Vercel environment variables
4. Free tier: 30 req/min, 14,400 req/day — plenty for batch processing

---

## Application Screens

| Route | Screen |
|-------|--------|
| `/` | **Dashboard** — pipeline stats, active job tracker, activity log |
| `/upload` | **Upload / Ingest** — drag-drop video + transcript, metadata form |
| `/queue` | **Review Queue** — table with filters, route override (E/R/Review) |
| `/video/:id` | **Video Detail** — transcript diff editor, trim editor, quality score |
| `/batch` | **Batch Queue** — run 10–100 videos overnight, live phase tracker |
| `/scenes` | **Scene Editor** — 5-scene script editor with Manim preview |
| `/voices` | **Voice / TTS** — ElevenLabs or Coqui voice selection + settings |
| `/output` | **Output Library** — grid/list of final videos, download/preview |

---

## Pipeline Flow

```
Upload → FFprobe Quality Score
    ├─ Score ≥80 → ENHANCE PATH
    │   → Demucs/Adobe audio denoise
    │   → Real-ESRGAN/Topaz upscale
    │   → Whisper captions + chapter markers
    │   → Export MP4
    │
    ├─ Score 50–79 → HUMAN REVIEW
    │   → Manual override in /queue
    │
    └─ Score <50 → RECREATE PATH
        → LLM rewrites script (5 scenes)
        → Manim CE renders board animation
        → Coqui/ElevenLabs TTS voiceover
        → FFmpeg merge + captions
        → Export MP4
```

---

## Local Video Processing (Python Backend)

The heavy processing (FFmpeg, Manim, Whisper, Real-ESRGAN) runs on your local machine or a VPS. The React app's frontend calls `/api/*` routes on Vercel for AI; video processing is a separate Python script.

### Setup

```bash
pip install manim whisper torch torchaudio requests
# OR
pip install -r requirements-processing.txt
```

### Run processor

```bash
python process_video.py --video-id v001 --route recreate
```

This script:
1. Reads video metadata from Supabase
2. Downloads raw video
3. Runs the selected pipeline (enhance or recreate)
4. Uploads output to storage
5. Updates Supabase status to `done`

*(Full Python processing scripts are a Phase 2 build)*

---

## V1 vs V2 Mode

| Feature | V1 (Free) | V2 (Budget ~$350 total) |
|---------|-----------|-------------------------|
| Transcript AI | LLaMA 3.3 70B (Groq) | GPT-4o |
| TTS | Coqui / Bark | ElevenLabs |
| Audio cleanup | Demucs | Adobe Podcast Enhance |
| Video upscale | Real-ESRGAN | Topaz Video AI ($299 one-time) |
| Quality | 3–4/5 | 5/5 |

Toggle in sidebar: V1 / V2

---

## Project Structure

```
eduvideo-studio/
├── api/                     ← Vercel serverless functions
│   ├── clean-transcript.js  ← POST /api/clean-transcript
│   └── generate-scenes.js   ← POST /api/generate-scenes
├── src/
│   ├── components/          ← Layout, Sidebar, Topbar, UI primitives
│   ├── context/             ← AppContext (global state)
│   ├── lib/                 ← Supabase client, mock data
│   └── pages/               ← 8 screens
├── vercel.json              ← SPA routing + API routes
├── .env.example
└── README.md
```

---

## Cost Estimate (2000 videos, V2 mode)

| Item | Cost |
|------|------|
| Topaz Video AI (one-time) | $299 |
| ElevenLabs | $5/mo × 2 = $10 |
| Adobe Podcast | $5/mo × 2 = $10 |
| GPT-4o transcript | ~$20 total |
| Vercel hosting | Free |
| Supabase | Free |
| Groq API | Free |
| **Total** | **~$339** |

---

Built by Narayana Educational Institutions · April 2026
