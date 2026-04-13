// api/generate-scenes.js — Vercel Serverless Function
// Calls Groq LLaMA 3.3 70B to generate 5-scene script from clean transcript

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { transcript, videoId } = req.body
  if (!transcript) return res.status(400).json({ error: 'transcript is required' })

  const GROQ_API_KEY = process.env.GROQ_API_KEY
  if (!GROQ_API_KEY) {
    // Demo fallback
    return res.status(200).json({
      scenes: {
        hook: "Understanding this concept unlocks your ability to solve real-world problems that appear across science, engineering, and everyday life.",
        intro: {
          definition: "The core concept can be expressed in a simple standard form. Understanding each component gives you the tools to solve any problem of this type.",
          visual: "Write the standard form on the board, highlight each term and its role, annotate with clear labels."
        },
        example_steps: [
          "Step 1: Write down the problem clearly",
          "Step 2: Identify all known values",
          "Step 3: Apply the method systematically",
          "Step 4: Check your answer",
          "Step 5: State the final solution"
        ],
        mistakes: [
          "Forgetting to consider all cases",
          "Skipping intermediate steps when under time pressure",
          "Mixing up signs during algebraic manipulation"
        ],
        recap: [
          "Know the standard form and what each part means",
          "Apply the method step by step without skipping",
          "Always verify your answer"
        ]
      },
      model: 'demo-fallback',
      videoId
    })
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
        max_tokens: 2048,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an educational content designer for Khan Academy-style videos.
Given a clean lecture transcript, create a 5-scene script for a board-based explanation video.

Return ONLY valid JSON in this exact format:
{
  "hook": "One sentence — why does this concept matter?",
  "intro": {
    "definition": "Plain language definition (2-3 sentences)",
    "visual": "Description of what to write/draw on the board"
  },
  "example_steps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ...",
    "Step 5: ..."
  ],
  "mistakes": [
    "Common mistake 1",
    "Common mistake 2",
    "Common mistake 3"
  ],
  "recap": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ]
}

Rules:
- Scene 1 Hook (30s): One compelling sentence about why this matters in real life
- Scene 2 Intro (1-2min): Clear definition + exactly what should appear on board
- Scene 3 Example (4-6min): Best worked example from lecture, step-by-step
- Scene 4 Mistakes (1-2min): Extract from Q&A/errors in lecture
- Scene 5 Recap (1min): Exactly 3 bullet points
- Language: simple, Grade 6-12 appropriate, no jargon without explanation
- No LaTeX, use plain text math (e.g. "x squared" not "x^2" or "$x^2$")`
          },
          {
            role: 'user',
            content: `Generate the 5-scene script from this lecture transcript:\n\n${transcript.slice(0, 6000)}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(502).json({ error: 'Groq API error', detail: err })
    }

    const data = await response.json()
    const raw = data.choices[0].message.content

    let scenes
    try {
      scenes = JSON.parse(raw)
    } catch {
      return res.status(500).json({ error: 'Failed to parse scene JSON', raw })
    }

    return res.status(200).json({
      scenes,
      model: 'llama-3.3-70b-versatile',
      tokens: data.usage?.total_tokens || 0,
      videoId,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
