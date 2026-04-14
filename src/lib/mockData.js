export const MOCK_VIDEOS = [
  {
    id: 'v001', title: 'Quadratic Equations – Basics', subject: 'Mathematics', grade: 9, school: 'DPS Hyderabad',
    rawPath: '/uploads/v001_raw.mp4', transcriptPath: '/uploads/v001_transcript.txt',
    duration: 1680, resolution: '1280x720', audioSNR: 24.5,
    qualityScore: 82, route: 'enhance', status: 'done',
    cleanTranscript: null, scenes: [],
    outputPath: '/outputs/v001_final.mp4', finalDuration: 720,
    createdAt: '2026-04-10T08:00:00Z', processedAt: '2026-04-10T09:12:00Z'
  },
  {
    id: 'v002', title: 'Photosynthesis – Light Reaction', subject: 'Biology', grade: 10, school: 'Narayana Vijayawada',
    rawPath: '/uploads/v002_raw.mp4', transcriptPath: '/uploads/v002_transcript.txt',
    duration: 1920, resolution: '640x480', audioSNR: 14.2,
    qualityScore: 38, route: 'recreate', status: 'processing',
    cleanTranscript: null, scenes: [],
    outputPath: null, finalDuration: null,
    createdAt: '2026-04-10T09:00:00Z', processedAt: null
  },
  {
    id: 'v003', title: 'Trigonometry – Sine Rule', subject: 'Mathematics', grade: 11, school: 'Narayana Bengaluru',
    rawPath: '/uploads/v003_raw.mp4', transcriptPath: '/uploads/v003_transcript.txt',
    duration: 1560, resolution: '1280x720', audioSNR: 19.1,
    qualityScore: 57, route: 'review', status: 'review',
    cleanTranscript: null, scenes: [],
    outputPath: null, finalDuration: null,
    createdAt: '2026-04-10T10:00:00Z', processedAt: null
  },
  {
    id: 'v004', title: "Newton's Laws of Motion", subject: 'Physics', grade: 8, school: 'DPS Chennai',
    rawPath: '/uploads/v004_raw.mp4', transcriptPath: '/uploads/v004_transcript.txt',
    duration: 1800, resolution: '1920x1080', audioSNR: 22.0,
    qualityScore: 71, route: 'enhance', status: 'pending',
    cleanTranscript: null, scenes: [],
    outputPath: null, finalDuration: null,
    createdAt: '2026-04-11T08:00:00Z', processedAt: null
  },
  {
    id: 'v005', title: 'Cell Division – Meiosis', subject: 'Biology', grade: 12, school: 'Narayana Mumbai',
    rawPath: '/uploads/v005_raw.mp4', transcriptPath: '/uploads/v005_transcript.txt',
    duration: 2100, resolution: '640x480', audioSNR: 11.3,
    qualityScore: 22, route: 'recreate', status: 'failed',
    cleanTranscript: null, scenes: [],
    outputPath: null, finalDuration: null,
    createdAt: '2026-04-11T09:00:00Z', processedAt: null
  },
  {
    id: 'v006', title: 'Chemical Bonding – Ionic', subject: 'Chemistry', grade: 11, school: 'DPS Delhi',
    rawPath: '/uploads/v006_raw.mp4', transcriptPath: '/uploads/v006_transcript.txt',
    duration: 1440, resolution: '1280x720', audioSNR: 26.0,
    qualityScore: 88, route: 'enhance', status: 'done',
    cleanTranscript: null, scenes: [],
    outputPath: '/outputs/v006_final.mp4', finalDuration: 660,
    createdAt: '2026-04-12T08:00:00Z', processedAt: '2026-04-12T10:00:00Z'
  },
  {
    id: 'v007', title: 'Probability – Basic Concepts', subject: 'Mathematics', grade: 10, school: 'Narayana Hyderabad',
    rawPath: '/uploads/v007_raw.mp4', transcriptPath: '/uploads/v007_transcript.txt',
    duration: 1320, resolution: '1280x720', audioSNR: 21.0,
    qualityScore: 76, route: 'enhance', status: 'pending',
    cleanTranscript: null, scenes: [],
    outputPath: null, finalDuration: null,
    createdAt: '2026-04-13T08:00:00Z', processedAt: null
  },
  {
    id: 'v008', title: 'Magnetism – Field Lines', subject: 'Physics', grade: 12, school: 'DPS Pune',
    rawPath: '/uploads/v008_raw.mp4', transcriptPath: '/uploads/v008_transcript.txt',
    duration: 1620, resolution: '960x540', audioSNR: 17.5,
    qualityScore: 44, route: 'recreate', status: 'pending',
    cleanTranscript: null, scenes: [],
    outputPath: null, finalDuration: null,
    createdAt: '2026-04-13T09:00:00Z', processedAt: null
  },
]

export const MOCK_RAW_TRANSCRIPT = `[00:00:00] Teacher: Good morning everyone. Can everyone see my screen?
[00:00:08] Student: Yes ma'am, we can see.
[00:00:12] Teacher: Good. So today we are going to study Quadratic Equations. Before I begin, let me take attendance.
[00:00:45] Teacher: Ravi? Priya? Okay good. Now let us begin.
[00:01:02] Teacher: A quadratic equation is a polynomial equation of degree 2. The standard form is ax squared plus bx plus c equals zero, where a is not equal to zero.
[00:02:15] Teacher: Why a cannot be zero? Because if a is zero, it becomes a linear equation, not quadratic.
[00:02:45] Student: Ma'am what if b is zero?
[00:02:52] Teacher: Good question! If b is zero, we get ax squared plus c equals zero, which is called a pure quadratic equation.
[00:03:18] Teacher: Now let us look at the discriminant. The discriminant D equals b squared minus 4ac. This tells us the nature of roots.
[00:04:30] Teacher: If D is greater than zero, we have two distinct real roots.
[00:04:45] Teacher: If D equals zero, we have two equal real roots.
[00:05:00] Teacher: If D is less than zero, we have no real roots — the roots are complex.
[00:05:22] Student: [inaudible]
[00:05:30] Teacher: Sorry there's some noise, let me continue. 
[00:05:45] Teacher: Let us solve an example. Consider x squared minus 5x plus 6 equals zero.
[00:06:10] Teacher: We need to find two numbers whose product is 6 and whose sum is negative 5.
[00:06:35] Teacher: Those numbers are negative 2 and negative 3.
[00:07:00] Teacher: So x squared minus 2x minus 3x plus 6 equals zero.
[00:07:20] Teacher: Factor: x times x minus 2, minus 3 times x minus 2 equals zero.
[00:07:45] Teacher: Therefore x minus 2 times x minus 3 equals zero.
[00:08:00] Teacher: So x equals 2 or x equals 3. These are our roots.
[00:08:22] Student: Ma'am can we use the formula method?
[00:08:30] Teacher: Yes absolutely! That is the quadratic formula: x equals minus b plus minus root of b squared minus 4ac, all over 2a.
[00:09:15] Teacher: Common mistake students make: they forget to put plus minus, and only take the positive root. Always remember both roots.
[00:09:45] Teacher: Another mistake: dividing by 2a only for one part of the numerator. The entire numerator is divided by 2a.
[00:10:20] Teacher: Let me recap. Quadratic equation standard form: ax squared plus bx plus c equals zero. Discriminant tells us nature of roots. Factorisation and formula method to find roots.
[00:11:00] Teacher: For tomorrow please solve exercise 4.2 questions 1 to 5. Class dismissed.
[00:11:15] Student: Thank you ma'am!`

export const MOCK_CLEAN_TRANSCRIPT = `[00:01:02] Teacher: A quadratic equation is a polynomial equation of degree 2. The standard form is ax squared plus bx plus c equals zero, where a is not equal to zero.
[00:02:15] Teacher: Why a cannot be zero? Because if a is zero, it becomes a linear equation, not quadratic.
[00:03:18] Teacher: Now let us look at the discriminant. The discriminant D equals b squared minus 4ac. This tells us the nature of roots.
[00:04:30] Teacher: If D is greater than zero, we have two distinct real roots.
[00:04:45] Teacher: If D equals zero, we have two equal real roots.
[00:05:00] Teacher: If D is less than zero, we have no real roots — the roots are complex.
[00:05:45] Teacher: Let us solve an example. Consider x squared minus 5x plus 6 equals zero.
[00:06:10] Teacher: We need to find two numbers whose product is 6 and whose sum is negative 5.
[00:06:35] Teacher: Those numbers are negative 2 and negative 3.
[00:07:00] Teacher: So x squared minus 2x minus 3x plus 6 equals zero.
[00:07:20] Teacher: Factor: x times x minus 2, minus 3 times x minus 2 equals zero.
[00:07:45] Teacher: Therefore x minus 2 times x minus 3 equals zero.
[00:08:00] Teacher: So x equals 2 or x equals 3. These are our roots.
[00:08:30] Teacher: Yes absolutely! That is the quadratic formula: x equals minus b plus minus root of b squared minus 4ac, all over 2a.
[00:09:15] Teacher: Common mistake students make: they forget to put plus minus, and only take the positive root. Always remember both roots.
[00:09:45] Teacher: Another mistake: dividing by 2a only for one part of the numerator. The entire numerator is divided by 2a.
[00:10:20] Teacher: Let me recap. Quadratic equation standard form: ax squared plus bx plus c equals zero. Discriminant tells us nature of roots. Factorisation and formula method to find roots.`

export const MOCK_SCENES = {
  hook: "Understanding quadratic equations unlocks your ability to model real-world phenomena — from the path of a cricket ball to optimizing business profit.",
  intro: {
    definition: "A quadratic equation is a polynomial of degree 2 in the form ax² + bx + c = 0, where a ≠ 0.",
    visual: "Write 'ax² + bx + c = 0' on board, highlight each term, draw arrow showing a≠0 condition."
  },
  example_steps: [
    "Write the equation: x² - 5x + 6 = 0",
    "Identify a=1, b=-5, c=6",
    "Find two numbers: product=6, sum=-5 → (-2) and (-3)",
    "Factor: x² - 2x - 3x + 6 = 0",
    "Group: x(x-2) - 3(x-2) = 0",
    "Solve: (x-2)(x-3) = 0",
    "Roots: x = 2 or x = 3 ✓"
  ],
  mistakes: [
    "Forgetting ± in the quadratic formula — always take both roots",
    "Dividing only part of the numerator by 2a — entire numerator divides",
    "Setting a=0 accidentally — this changes it to a linear equation"
  ],
  recap: [
    "Standard form: ax² + bx + c = 0 (a ≠ 0)",
    "Discriminant D = b²-4ac determines nature of roots",
    "Use factorisation or formula method to find roots"
  ]
}

export const MOCK_ACTIVITY = [
  { id: 1, type: 'success', msg: 'Meiosis video re-queued after audio fix', time: '2 min ago' },
  { id: 2, type: 'info', msg: 'Batch 04 · 50 videos ingested from Zoom export', time: '18 min ago' },
  { id: 3, type: 'success', msg: 'Quadratic Equations rendered + exported ✓', time: '42 min ago' },
  { id: 4, type: 'warning', msg: 'Trig · Sine Rule flagged for manual review', time: '1 hr ago' },
  { id: 5, type: 'info', msg: 'Pipeline V2 mode activated', time: '3 hr ago' },
]

export const MOCK_VOICES_ELEVENLABS = [
  { id: 'e1', name: 'Rohan', lang: 'English (IN)', accent: 'Indian', gender: 'Male', style: 'Clear', tags: ['Educational', 'Calm'], color: '#4F7CFF', initials: 'RO' },
  { id: 'e2', name: 'Priya', lang: 'English (IN)', accent: 'Indian', gender: 'Female', style: 'Warm', tags: ['Educational', 'Warm'], color: '#9B8FFF', initials: 'PR' },
  { id: 'e3', name: 'Arjun', lang: 'English (IN)', accent: 'Indian', gender: 'Male', style: 'Authoritative', tags: ['Academic', 'Deep'], color: '#1BD0A5', initials: 'AR' },
  { id: 'e4', name: 'Kavya', lang: 'English (IN)', accent: 'Indian', gender: 'Female', style: 'Energetic', tags: ['Engaging', 'Young'], color: '#F5A623', initials: 'KA' },
  { id: 'e5', name: 'Daniel', lang: 'English (US)', accent: 'American', gender: 'Male', style: 'Neutral', tags: ['Clear', 'Neutral'], color: '#2ECC85', initials: 'DA' },
  { id: 'e6', name: 'Rachel', lang: 'English (UK)', accent: 'British', gender: 'Female', style: 'Crisp', tags: ['Professional', 'Clear'], color: '#FF5E5E', initials: 'RA' },
]

export const MOCK_VOICES_COQUI = [
  { id: 'c1', name: 'tts_models/en/ljspeech/tacotron2', lang: 'English', accent: 'Neutral', gender: 'Female', style: 'Standard', tags: ['Free', 'Stable'], color: '#9A9BB0', initials: 'LJ' },
  { id: 'c2', name: 'tts_models/en/vctk/vits', lang: 'English', accent: 'Multi', gender: 'Mixed', style: 'Natural', tags: ['Free', 'VITS'], color: '#5A5C78', initials: 'VT' },
]
