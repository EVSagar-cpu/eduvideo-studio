// api/clean-transcript.js — Vercel Serverless Function
// Calls Groq LLaMA 3.3 70B to clean a raw Zoom transcript

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { transcript } = req.body
  if (!transcript) return res.status(400).json({ error: 'transcript is required' })

  const GROQ_API_KEY = process.env.GROQ_API_KEY
  if (!GROQ_API_KEY) {
    // Demo fallback — return trimmed version
    const lines = transcript.split('\n')
    const clean = lines.filter(line => {
      const lower = line.toLowerCase()
      return !lower.includes('student') && !lower.includes('[inaudible]') &&
             !lower.includes('attendance') && !lower.includes('good morning') &&
             !lower.includes('roll call') && !lower.includes('dismissed') &&
             line.trim().length > 0
    }).join('\n')
    return res.status(200).json({ clean, model: 'demo-fallback', tokens: 0 })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 4096,
        temperature: 0.1,
        messages: [
          {
            role: 'system',
            content: `You are an educational video editor.
Given a raw Zoom class transcript, remove:
- All student questions and answers
- Off-topic chat, noise markers, [inaudible], [crosstalk]
- Greetings, roll calls, technical issues ("can you see my screen?")
- Attendance, dismissal, homework announcements

Keep only: pure concept explanation by the teacher.

Return ONLY the cleaned transcript with original timestamps.
Format: [HH:MM:SS] speaker: text
Do not add any preamble or explanation.`
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(502).json({ error: 'Groq API error', detail: err })
    }

    const data = await response.json()
    const clean = data.choices[0].message.content
    const tokens = data.usage?.total_tokens || 0

    return res.status(200).json({ clean, model: 'llama-3.3-70b-versatile', tokens })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
