import type { GlyphName } from './glyphs'

/* ------------------------------------------------------------------ */
/*  Site facts.  DEMO = placeholder to replace before launch.          */
/* ------------------------------------------------------------------ */
export const site = {
  name: 'Hardeep Kaur',
  role: 'Psychotherapist · Clinical Hypnotherapist · Holistic Healer',
  phone: '+91 98765 43210', // DEMO
  phoneHref: 'tel:+919876543210', // DEMO
  whatsapp: '919876543210', // DEMO — digits only, country code first
  email: 'hello@hardeepkaur.in', // DEMO
  hours: 'Mon – Sat · 10:00 – 19:00 IST',
  studio: 'Private studio · address shared on booking', // DEMO — add the city once confirmed
  reply: 'Every message is read personally and answered within 24 hours.',
  crisis: {
    line: 'Tele-MANAS',
    number: '14416',
    alt: '1-800-891-4416',
    emergency: '112',
  },
}

export const waLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`

/* ------------------------------------------------------------------ */
/*  The eight paths (service pillars).                                 */
/*  `shape` is the particle form the WebGL soul takes for this path.   */
/* ------------------------------------------------------------------ */
export type Service = { name: string; glyph: GlyphName; desc: string; short?: string }
export type Path = {
  id: string
  num: string
  name: string
  short: string
  kicker: string
  line: string
  body: string
  figure: string
  cta: string
  shape: number
  glyph: GlyphName
  services: Service[]
  helps: string[]
}

export const paths: Path[] = [
  {
    id: 'counselling',
    num: '01',
    name: 'Behavioural & Emotional Counselling',
    short: 'Counselling',
    kicker: 'Talk · be heard · understand',
    line: 'A safe room for the things you have never said out loud.',
    body: 'Talk therapy for what weighs on you every day. Together we find the patterns underneath how you feel, and build steadier ways to respond.',
    figure: 'ripples, settling',
    cta: 'Talk to me about counselling',
    shape: 1,
    glyph: 'waves',
    services: [
      { name: 'Behavioural counselling', glyph: 'loop', desc: 'Notice the habits and loops behind how you feel — then practise new ones.' },
      { name: 'Psychological counselling', glyph: 'mind', desc: 'A structured, evidence-informed space to understand your mind and its patterns.' },
      { name: 'Emotional counselling', glyph: 'heart', desc: 'Room to feel what you feel, name it, and stop carrying it alone.' },
      { name: 'Stress counselling & online stress management', glyph: 'waves', desc: 'Practical tools to calm a nervous system that never switches off — from anywhere.', short: 'Stress & online stress care' },
      { name: 'Grief therapy', glyph: 'tear', desc: 'Gentle company through loss, at the pace grief actually moves.' },
      { name: 'Anger management', glyph: 'flame', desc: 'Understand what sits underneath the anger, and respond instead of react.' },
      { name: 'Fear & phobia counselling', glyph: 'eye', desc: 'Shrink fears back to their real size, one careful step at a time.' },
      { name: 'Motivation & goal-orientation counselling', glyph: 'target', desc: 'Find your why again, then turn it into a plan you can keep.', short: 'Motivation & goals' },
      { name: 'Pain management', glyph: 'leaf', desc: 'Ease how pain lives in your body and mind, alongside your medical care.' },
      { name: 'Taboo & unspoken subjects', glyph: 'veil', desc: 'Sex, shame, family secrets — nothing is too awkward to bring here.' },
    ],
    helps: [
      'Anxiety & anxiety disorders',
      'Low self-esteem',
      'Low confidence',
      'Loneliness',
      'Abandonment',
      'Hurt',
      'Abuse',
      'Suicidal thoughts',
      'Confusion',
      'Self-love',
    ],
  },
  {
    id: 'relationships',
    num: '02',
    name: 'Relationship Counselling',
    short: 'Relationships',
    kicker: 'Two people · one honest conversation',
    line: 'Love should never cost you yourself.',
    body: 'For couples, families and anyone caught in a bond that hurts — from preparing for marriage to leaving a narcissistic relationship with your dignity intact.',
    figure: 'two rings, one conversation',
    cta: 'Talk to me about your relationship',
    shape: 2,
    glyph: 'rings',
    services: [
      { name: 'Pre-marriage counselling', glyph: 'rings', desc: 'The honest conversations about money, family and expectations — before the vows.' },
      { name: 'Post-marriage counselling', glyph: 'heart', desc: 'Rebuild trust, closeness and communication when married life feels heavy.' },
      { name: 'Toxic & narcissistic relationships', glyph: 'knot', desc: 'See the pattern clearly, set boundaries, and find your way out of the fog.', short: 'Toxic & narcissistic bonds' },
      { name: 'NPD burnout trauma recovery', glyph: 'mask', desc: 'Recover your confidence and nervous system after narcissistic abuse.' },
      { name: 'Peer counselling', glyph: 'peers', desc: 'Support with friendships and peer pressure, for students and young adults.' },
      { name: 'Sibling & family counselling', glyph: 'circle', desc: 'Untangle old family roles so home stops feeling like a battlefield.' },
      { name: 'Parent–child counselling', glyph: 'family', desc: 'Help parents and children truly hear each other again.' },
      { name: 'Conscious uncoupling', glyph: 'split', desc: 'If it is ending, end it with dignity, clarity and less damage.' },
    ],
    helps: [
      'Toxic relationships',
      'Narcissistic abuse',
      'Constant conflict',
      'Trust after betrayal',
      'Family rifts',
      'Separating with care',
    ],
  },
  {
    id: 'mind',
    num: '03',
    name: 'Mind Reprogramming',
    short: 'Mind',
    kicker: 'Rewire · recode · reset',
    line: 'The mind that learned the pain can learn the peace.',
    body: 'Using neuroplasticity — the brain’s lifelong ability to change — to loosen old conditioning and practise patterns that actually serve you, through the Recall · Recode · Reset process and NLP.',
    figure: 'a mind, rewiring',
    cta: 'Ask about mind reprogramming',
    shape: 3,
    glyph: 'neural',
    services: [
      { name: 'Neural plasticity work', glyph: 'neural', desc: 'Use the brain’s capacity to change to build calmer default responses.' },
      { name: 'Conditioning & belief change', glyph: 'loop', desc: 'Spot the beliefs you were trained into — and quietly retrain them.' },
      { name: 'Recall · Recode · Reset process', glyph: 'recode', desc: 'Find where a pattern began, rewrite it, and practise the new normal.', short: 'Recall · Recode · Reset' },
      { name: 'NLP — Neuro-Linguistic Programming', glyph: 'speech', desc: 'Change the inner language and pictures that keep you stuck.', short: 'NLP' },
      { name: 'Goal orientation', glyph: 'target', desc: 'Clear goals, small steps, and the mindset to keep going.' },
    ],
    helps: [
      'Limiting beliefs',
      'Negative self-talk',
      'Procrastination',
      'Habits that won’t break',
      'Performance blocks',
    ],
  },
  {
    id: 'subconscious',
    num: '04',
    name: 'Deep & Subconscious Therapies',
    short: 'Subconscious',
    kicker: 'Beneath the thinking mind',
    line: 'Some knots only loosen where they were tied.',
    body: 'Gentle, guided work with the subconscious — where old fear, trauma and memory are held — to release what talking alone hasn’t reached.',
    figure: 'the descent, gently',
    cta: 'Ask about hypnotherapy & regression',
    shape: 4,
    glyph: 'spiral',
    services: [
      { name: 'Clinical hypnotherapy', glyph: 'spiral', desc: 'A deeply relaxed, focused state where old fears and habits can loosen.' },
      { name: 'Past life regression therapy', glyph: 'hourglass', desc: 'A guided journey for fears and patterns that have no story in this life.' },
      { name: 'Inner child healing', glyph: 'child', desc: 'Meet the younger you who was hurt, and give them what they needed.' },
      { name: 'Trauma release', glyph: 'chain', desc: 'Paced, body-aware work so the past stops replaying in the present.' },
      { name: 'Incest trauma release', glyph: 'shield', desc: 'Specialised, deeply confidential care for survivors — entirely at your pace.' },
      { name: 'EFT — Emotional Freedom Technique', glyph: 'tap', desc: 'Tapping on acupressure points to settle intense emotion quickly.', short: 'EFT tapping' },
      { name: 'Ho’oponopono', glyph: 'petals', desc: 'The Hawaiian forgiveness practice: I’m sorry, forgive me, thank you, I love you.' },
    ],
    helps: [
      'Trauma',
      'Inner-child wounds',
      'Unexplained fears',
      'Repeating patterns',
      'Emotional blocks',
    ],
  },
  {
    id: 'energy',
    num: '05',
    name: 'Energy & Soul Healing',
    short: 'Energy',
    kicker: 'Breath · energy · spirit',
    line: 'When the energy moves, the heart follows.',
    body: 'Holistic and spiritual healing that works with the body’s subtle energy — in person or at a distance — to settle the nervous system and restore a sense of wholeness.',
    figure: 'seven centres, one current',
    cta: 'Book an energy healing',
    shape: 5,
    glyph: 'chakra',
    services: [
      { name: 'Reiki healing', glyph: 'palm', desc: 'Gentle hands-on energy work that invites deep rest and release.' },
      { name: 'Neuro chakra quantum healing', glyph: 'chakra', desc: 'Rebalance the seven energy centres where stress gets stored.' },
      { name: 'Distant healing', glyph: 'signal', desc: 'Energy healing sent to you wherever you are — no call needed.' },
      { name: 'Karmic healing', glyph: 'infinity', desc: 'Release cycles that feel older than you, and stop repeating them.' },
      { name: 'Ancestral healing', glyph: 'roots', desc: 'Put down the pain your family has carried for generations.' },
      { name: 'Soul healing', glyph: 'orb', desc: 'Deep restorative work for when you feel disconnected from yourself.' },
      { name: 'Breathwork', glyph: 'breath', desc: 'Guided breathing that shifts how you feel within minutes.' },
      { name: 'Spiritual healing & meditations', glyph: 'meditate', desc: 'Guided meditation to quiet the mind and reconnect with spirit.', short: 'Spiritual healing' },
      { name: 'Holistic healing for stress', glyph: 'leaf', desc: 'Mind, body and energy approaches combined for calm that lasts.' },
    ],
    helps: [
      'Stress & burnout',
      'Heaviness & fatigue',
      'Karmic patterns',
      'Ancestral wounds',
      'Feeling disconnected',
    ],
  },
  {
    id: 'guidance',
    num: '06',
    name: 'Intuitive Guidance',
    short: 'Guidance',
    kicker: 'Cards · numbers · light',
    line: 'Sometimes you need a mirror before you need a map.',
    body: 'Tarot, numerology and aura reading, used the way they serve best — as reflective tools that bring clarity to a decision, a season of life, or a question you keep circling.',
    figure: 'the card you needed',
    cta: 'Book a reading',
    shape: 6,
    glyph: 'card',
    services: [
      { name: 'Tarot guidance', glyph: 'card', desc: 'A reflective reading that brings clarity to a question or a crossroads.' },
      { name: 'Numerology', glyph: 'numbers', desc: 'What your birth date and name suggest about your nature and timing.' },
      { name: 'Aura reading', glyph: 'aura', desc: 'A reading of your energy field — where it is strong, and where it leaks.' },
    ],
    helps: ['Confusion', 'Crossroads & decisions', 'Life purpose', 'Timing', 'Self-understanding'],
  },
  {
    id: 'workshops',
    num: '07',
    name: 'Workshops & Circles',
    short: 'Workshops',
    kicker: 'For teams, campuses & communities',
    line: 'Healing grows faster in a circle.',
    body: 'Interactive workshops that bring the same tools into offices, colleges and communities — practical, warm, and built to still be remembered on Monday morning.',
    figure: 'a circle that holds',
    cta: 'Plan a workshop',
    shape: 7,
    glyph: 'circle',
    services: [
      { name: 'Stress-free living', glyph: 'leaf', desc: 'Put stress down without putting life on hold.' },
      { name: 'Managing anger', glyph: 'flame', desc: 'Understand the fire, so it warms instead of burns.' },
      { name: 'Confidence building', glyph: 'sun', desc: 'Quiet, durable confidence — not a performance.' },
      { name: 'Never give up', glyph: 'mountain', desc: 'Resilience for the long middle of hard things.' },
      { name: 'Effective communication', glyph: 'speech', desc: 'Say what you mean. Hear what is meant.' },
      { name: 'Body language', glyph: 'body', desc: 'What you say before you speak.' },
      { name: 'Goal orientation', glyph: 'target', desc: 'Clear goals, small steps, and the mindset to keep going.' },
      { name: 'Self-love', glyph: 'mirror', desc: 'The relationship every other one is built on.' },
      { name: 'Beating procrastination', glyph: 'clock', desc: 'Why we delay — and how to simply begin.' },
      { name: 'Office toxicity', glyph: 'mask', desc: 'Name it, protect yourself, change the room.' },
      { name: 'Leadership', glyph: 'crown', desc: 'Leading people as humans first.' },
      { name: 'Growth mindset', glyph: 'sprout', desc: 'Turn “I can’t” into “I can’t — yet”.' },
    ],
    helps: ['Corporate teams', 'Schools & colleges', 'Community groups', 'Online cohorts'],
  },
  {
    id: 'women',
    num: '08',
    name: 'Women Empowerment & POSH',
    short: 'Women',
    kicker: 'Safe at work · strong in life',
    line: 'Her safety is not a policy. It is a culture.',
    body: 'POSH (Prevention of Sexual Harassment) awareness and committee training for workplaces, alongside confidential counselling and empowerment circles for women.',
    figure: 'the lotus, rising',
    cta: 'Plan POSH or women’s support',
    shape: 8,
    glyph: 'lotus',
    services: [
      { name: 'POSH awareness training', glyph: 'shield', desc: 'Every employee learns the line, the law, and how to speak up safely.' },
      { name: 'Internal Committee (IC) training', glyph: 'scales', desc: 'Equip your IC to run fair, timely, well-documented inquiries.', short: 'IC training' },
      { name: 'Sexual harassment counselling', glyph: 'heart', desc: 'Confidential support to process what happened and decide what comes next.' },
      { name: 'Counselling for women in distress', glyph: 'venus', desc: 'A safe, private space for women facing abuse, pressure or crisis.', short: 'Women in distress' },
      { name: 'Women empowerment circles', glyph: 'lotus', desc: 'Small-group sessions that build voice, confidence and solidarity.' },
    ],
    helps: ['Workplace safety', 'Harassment', 'Women in distress', 'Voice & self-worth'],
  },
]

export const serviceCount = paths.reduce((n, p) => n + p.services.length, 0)

/** Everything people come with — the run-on list on the homepage index. */
export const concerns = [
  'Anxiety',
  'Anxiety disorders',
  'Loneliness',
  'Abandonment',
  'Hurt',
  'Abuse',
  'Suicidal thoughts',
  'Grief',
  'Pain',
  'Anger',
  'Confusion',
  'Fears & phobias',
  'Taboos',
  'Low self-esteem',
  'Low confidence',
  'Toxic relationships',
  'Narcissistic abuse',
  'NPD burnout',
  'Trauma',
  'Incest trauma',
  'Sexual harassment',
  'Stress',
  'Burnout',
  'Procrastination',
  'Lack of direction',
  'Spiritual disconnection',
]

/* ------------------------------------------------------------------ */
/*  “What brings you here?” — feeling → gentle starting points.        */
/* ------------------------------------------------------------------ */
export type Feeling = {
  id: string
  label: string
  path: string
  crisis?: boolean
  recs: { name: string; glyph: GlyphName; why: string }[]
}

export const feelings: Feeling[] = [
  {
    id: 'anxious',
    label: 'I feel anxious, all the time',
    path: 'counselling',
    recs: [
      { name: 'Behavioural counselling', glyph: 'loop', why: 'Find the triggers and loops that keep anxiety running.' },
      { name: 'Breathwork', glyph: 'breath', why: 'Teach your nervous system a calmer default.' },
      { name: 'Clinical hypnotherapy', glyph: 'spiral', why: 'Quiet the fear response where it begins.' },
    ],
  },
  {
    id: 'toxic',
    label: 'I’m stuck in a toxic relationship',
    path: 'relationships',
    recs: [
      { name: 'Relationship counselling', glyph: 'knot', why: 'See the pattern clearly, without blame or shame.' },
      { name: 'NPD burnout trauma recovery', glyph: 'mask', why: 'Recover the self that narcissistic dynamics wear down.' },
      { name: 'Inner child healing', glyph: 'child', why: 'Heal the early wound that makes painful love feel familiar.' },
    ],
  },
  {
    id: 'grief',
    label: 'I can’t move through my grief',
    path: 'counselling',
    recs: [
      { name: 'Grief therapy', glyph: 'tear', why: 'Room to grieve fully, at your own pace.' },
      { name: 'Ho’oponopono', glyph: 'petals', why: 'Words for what was left unsaid.' },
      { name: 'Soul healing', glyph: 'orb', why: 'Gentle energy work for a heart that feels hollow.' },
    ],
  },
  {
    id: 'lonely',
    label: 'I feel lonely, even around people',
    path: 'counselling',
    recs: [
      { name: 'Emotional counselling', glyph: 'heart', why: 'Understand the distance you feel — and how to close it.' },
      { name: 'Inner child healing', glyph: 'child', why: 'Meet the younger you who first felt alone.' },
      { name: 'Peer counselling', glyph: 'peers', why: 'Practise connection in a safe, held space.' },
    ],
  },
  {
    id: 'anger',
    label: 'My anger frightens me',
    path: 'counselling',
    recs: [
      { name: 'Anger management', glyph: 'flame', why: 'Understand the fire, so it warms instead of burns.' },
      { name: 'EFT — tapping', glyph: 'tap', why: 'Discharge the charge from the body, fast.' },
      { name: 'Breathwork', glyph: 'breath', why: 'A pause between the trigger and the reaction.' },
    ],
  },
  {
    id: 'lost',
    label: 'I don’t know which way to go',
    path: 'guidance',
    recs: [
      { name: 'Tarot guidance', glyph: 'card', why: 'A mirror for the question you keep circling.' },
      { name: 'Numerology', glyph: 'numbers', why: 'Patterns in your timing and nature.' },
      { name: 'Goal-orientation counselling', glyph: 'target', why: 'Turn clarity into a plan you can actually follow.' },
    ],
  },
  {
    id: 'trauma',
    label: 'Old trauma keeps coming back',
    path: 'subconscious',
    recs: [
      { name: 'Trauma release', glyph: 'chain', why: 'Safe, paced work to let the body finally stand down.' },
      { name: 'Clinical hypnotherapy', glyph: 'spiral', why: 'Reach the memory without reliving it.' },
      { name: 'EFT — tapping', glyph: 'tap', why: 'Soften the emotional charge of what happened.' },
    ],
  },
  {
    id: 'fear',
    label: 'I have fears I can’t explain',
    path: 'subconscious',
    recs: [
      { name: 'Fear & phobia counselling', glyph: 'eye', why: 'Name the fear and shrink it to size.' },
      { name: 'Past life regression', glyph: 'hourglass', why: 'For fears with no story in this lifetime.' },
      { name: 'Clinical hypnotherapy', glyph: 'spiral', why: 'Rewrite the alarm at its source.' },
    ],
  },
  {
    id: 'marriage',
    label: 'We’re about to marry — or drifting apart',
    path: 'relationships',
    recs: [
      { name: 'Pre-marriage counselling', glyph: 'rings', why: 'The conversations to have before the vows.' },
      { name: 'Post-marriage counselling', glyph: 'heart', why: 'Find each other again under the noise.' },
      { name: 'Conscious uncoupling', glyph: 'split', why: 'If it is ending, end it with care.' },
    ],
  },
  {
    id: 'patterns',
    label: 'The same story keeps repeating',
    path: 'energy',
    recs: [
      { name: 'Karmic healing', glyph: 'infinity', why: 'Release cycles that feel older than you.' },
      { name: 'Ancestral healing', glyph: 'roots', why: 'Put down what your family carried for generations.' },
      { name: 'Recall · Recode · Reset', glyph: 'recode', why: 'Rewire the pattern at the level of habit.' },
    ],
  },
  {
    id: 'heavy',
    label: 'My energy feels heavy and drained',
    path: 'energy',
    recs: [
      { name: 'Reiki healing', glyph: 'palm', why: 'Deep rest for a system that won’t switch off.' },
      { name: 'Neuro chakra quantum healing', glyph: 'chakra', why: 'Rebalance the centres that feel blocked.' },
      { name: 'Aura reading', glyph: 'aura', why: 'See where your energy is leaking.' },
    ],
  },
  {
    id: 'stuck',
    label: 'I keep putting my life on hold',
    path: 'mind',
    recs: [
      { name: 'Mind reprogramming', glyph: 'neural', why: 'Loosen the conditioning that keeps you small.' },
      { name: 'NLP', glyph: 'speech', why: 'Change the inner language that stalls you.' },
      { name: 'Goal orientation', glyph: 'target', why: 'From wishes, to direction, to done.' },
    ],
  },
  {
    id: 'workplace',
    label: 'Our workplace needs to feel safe',
    path: 'women',
    recs: [
      { name: 'POSH awareness training', glyph: 'shield', why: 'Everyone knows the line — and how to speak up.' },
      { name: 'Internal Committee training', glyph: 'scales', why: 'Your IC, confident and fair in every inquiry.' },
      { name: 'Office toxicity workshop', glyph: 'mask', why: 'Name it, protect people, change the room.' },
    ],
  },
  {
    id: 'dark',
    label: 'I’ve had thoughts of not wanting to live',
    path: 'counselling',
    crisis: true,
    recs: [
      { name: 'Behavioural counselling', glyph: 'loop', why: 'Steady, regular support, at a pace that feels safe.' },
      { name: 'Emotional counselling', glyph: 'heart', why: 'Somewhere to put what feels unbearable.' },
      { name: 'Breathwork', glyph: 'breath', why: 'A way to come back to your body in hard moments.' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Workshops                                                          */
/* ------------------------------------------------------------------ */
export const workshops: { title: string; line: string; glyph: GlyphName }[] = [
  { title: 'Stress-free living', line: 'Put stress down without putting life on hold.', glyph: 'leaf' },
  { title: 'Managing anger', line: 'Understand the fire, so it warms instead of burns.', glyph: 'flame' },
  { title: 'Confidence building', line: 'Quiet, durable confidence — not a performance.', glyph: 'sun' },
  { title: 'Never give up', line: 'Resilience for the long middle of hard things.', glyph: 'mountain' },
  { title: 'Effective communication', line: 'Say what you mean. Hear what is meant.', glyph: 'speech' },
  { title: 'Body language', line: 'What you say before you speak.', glyph: 'body' },
  { title: 'Goal orientation', line: 'From wishes, to direction, to done.', glyph: 'target' },
  { title: 'Self-love', line: 'The relationship every other one is built on.', glyph: 'mirror' },
  { title: 'Beating procrastination', line: 'Why we delay — and how to simply begin.', glyph: 'clock' },
  { title: 'Office toxicity', line: 'Name it, protect yourself, change the room.', glyph: 'mask' },
  { title: 'Leadership', line: 'Leading people as humans first.', glyph: 'crown' },
  { title: 'Growth mindset', line: 'Turn “I can’t” into “I can’t — yet”.', glyph: 'sprout' },
]

/* ------------------------------------------------------------------ */
/*  The signature method                                               */
/* ------------------------------------------------------------------ */
export const method = [
  {
    word: 'Recall',
    num: 'I',
    line: 'Travel back through the layers to the moment the pattern was learned.',
  },
  {
    word: 'Recode',
    num: 'II',
    line: 'Untangle the old response and rewrite it, while the mind is open to change.',
  },
  {
    word: 'Reset',
    num: 'III',
    line: 'Settle into a new normal — practised until calm is simply how you are.',
  },
]

/* ------------------------------------------------------------------ */
/*  Rituals: tarot + numerology (reflective, not predictive)            */
/* ------------------------------------------------------------------ */
export type Tarot = { id: string; numeral: string; name: string; keyword: string; msg: string; ask: string }
export const tarot: Tarot[] = [
  { id: 'star', numeral: 'XVII', name: 'The Star', keyword: 'Hope', msg: 'Healing has already begun, even if you can’t see it yet.', ask: 'What would you do today if you trusted that?' },
  { id: 'sun', numeral: 'XIX', name: 'The Sun', keyword: 'Joy', msg: 'Warmth returns the moment you stop hiding from it.', ask: 'Where could you allow a little more lightness this week?' },
  { id: 'moon', numeral: 'XVIII', name: 'The Moon', keyword: 'Intuition', msg: 'Not everything is clear yet — and that is allowed.', ask: 'What is your quiet inner voice saying beneath the noise?' },
  { id: 'strength', numeral: 'VIII', name: 'Strength', keyword: 'Gentle courage', msg: 'Your softness is not weakness. It is how you will win.', ask: 'Where can you meet yourself with patience instead of force?' },
  { id: 'temperance', numeral: 'XIV', name: 'Temperance', keyword: 'Balance', msg: 'Healing is a blend — a little, every day.', ask: 'What one small practice would steady you?' },
  { id: 'hermit', numeral: 'IX', name: 'The Hermit', keyword: 'Inner light', msg: 'The answer you are looking for is already lit within you.', ask: 'What would you hear in ten minutes of silence?' },
  { id: 'wheel', numeral: 'X', name: 'Wheel of Fortune', keyword: 'Change', msg: 'This season will turn. Seasons always do.', ask: 'What are you ready to let go of as it turns?' },
  { id: 'world', numeral: 'XXI', name: 'The World', keyword: 'Wholeness', msg: 'You are closer to whole than you believe.', ask: 'Which chapter are you ready to complete?' },
]

export const numerology: Record<number, { title: string; line: string }> = {
  1: { title: 'The Initiator', line: 'Independent and courageous — you are here to begin things.' },
  2: { title: 'The Peacemaker', line: 'Sensitive and attuned — you bring people into harmony.' },
  3: { title: 'The Expresser', line: 'Creative and bright — your voice is part of your healing.' },
  4: { title: 'The Builder', line: 'Steady and devoted — you make foundations others can stand on.' },
  5: { title: 'The Free Spirit', line: 'Curious and adaptable — change is your teacher, not your enemy.' },
  6: { title: 'The Nurturer', line: 'Caring and responsible — remember to receive what you give.' },
  7: { title: 'The Seeker', line: 'Reflective and wise — you are drawn to what lies beneath.' },
  8: { title: 'The Achiever', line: 'Driven and capable — power, used with heart, is your gift.' },
  9: { title: 'The Humanitarian', line: 'Compassionate and generous — you complete what others start.' },
  11: { title: 'The Intuitive · master number', line: 'Highly sensitive and inspired — you feel what others miss.' },
  22: { title: 'The Master Builder · master number', line: 'Visionary and practical — you can make big dreams real.' },
  33: { title: 'The Master Teacher · master number', line: 'Devoted to service — your compassion heals by example.' },
}

/**
 * Life-path number: reduce the day, month and year values separately, then
 * their sum.  Master numbers 11, 22 and 33 are kept at every stage.
 */
export function lifePath(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return null
  const [, y, mo, d] = m
  const reduce = (n: number): number => {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = String(n).split('').reduce((a, c) => a + +c, 0)
    return n
  }
  const parts = [
    { label: 'Day', digits: d },
    { label: 'Month', digits: mo },
    { label: 'Year', digits: y },
  ].map((p) => ({ ...p, reduced: reduce(+p.digits) }))
  const total = parts.reduce((a, p) => a + p.reduced, 0)
  return { parts, total, number: reduce(total) }
}

/* ------------------------------------------------------------------ */
/*  Manifesto beats — one at a time, scrolled through                  */
/* ------------------------------------------------------------------ */
export const wounds = [
  { text: 'Some wounds don’t show.', em: 'don’t show' },
  { text: 'Anxiety that hums all day.', em: 'Anxiety' },
  { text: 'A love that empties you.', em: 'empties' },
  { text: 'Grief with nowhere to go.', em: 'nowhere' },
  { text: 'A fear with no name.', em: 'no name' },
]

/* ------------------------------------------------------------------ */
/*  POSH — who it is for, and a readiness check                        */
/* ------------------------------------------------------------------ */
export const poshAudiences: { id: string; who: string; title: string; desc: string; covers: string[]; glyph: GlyphName }[] = [
  {
    id: 'staff',
    who: 'Employees',
    title: 'POSH awareness sessions',
    desc: 'What harassment is, what it isn’t, and how to speak up safely.',
    covers: ['What counts as harassment', 'How to report safely', 'Being a good bystander'],
    glyph: 'shield',
  },
  {
    id: 'ic',
    who: 'IC members',
    title: 'Internal Committee training',
    desc: 'Inquiry procedure, timelines, documentation and sensitivity.',
    covers: ['Inquiry procedure', 'Timelines & records', 'Sensitive interviewing'],
    glyph: 'scales',
  },
  {
    id: 'leaders',
    who: 'Leaders & HR',
    title: 'Leadership & HR orientation',
    desc: 'Policy, prevention and a culture people can actually trust.',
    covers: ['Policy & compliance', 'Prevention culture', 'Handling complaints well'],
    glyph: 'crown',
  },
  {
    id: 'women',
    who: 'Women',
    title: 'Confidential support for women',
    desc: 'Counselling for women in distress and for survivors of harassment.',
    covers: ['One-to-one counselling', 'Empowerment circles', 'Planning next steps'],
    glyph: 'venus',
  },
]

/** Duties under the Sexual Harassment of Women at Workplace Act, 2013. */
export const poshChecks = [
  'We have an Internal Committee (required with 10+ employees)',
  'Our IC members have been trained',
  'The policy and IC contacts are displayed at work',
  'Employees attend regular awareness sessions',
  'Our IC files its annual report',
]

/* ------------------------------------------------------------------ */
/*  Testimonials — DEMO copy, replace with real client words (with     */
/*  consent) before launch.                                            */
/* ------------------------------------------------------------------ */
export const testimonials = [
  {
    quote: 'I came in for anxiety I’d carried since college. Within a few weeks I was sleeping through the night — and I finally understood why it started.',
    who: 'R.S.',
    path: 'Behavioural counselling',
  },
  {
    quote: 'She helped me walk out of a relationship I had lost myself in, without losing my dignity on the way out.',
    who: 'A.K.',
    path: 'Relationship counselling',
  },
  {
    quote: 'The regression session was the gentlest, strangest, most freeing hour of my year.',
    who: 'M.T.',
    path: 'Past life regression',
  },
  {
    quote: 'Our POSH session was the first time our team actually talked — instead of ticking a box.',
    who: 'HR Head',
    path: 'POSH training',
  },
]

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */
// DRAFT copy — written without Hardeep's input; confirm her story before launch.
export const story = [
  {
    lead: 'Healing rarely arrives through one door.',
    text: 'I sit with people on some of the hardest days of their lives. Over the years I have learned that healing rarely arrives through one door.',
  },
  {
    lead: 'Some need to be heard. Some need to go deeper.',
    text: 'Some people need to be heard, plainly and without judgement. Some carry pain the thinking mind cannot reach, and need the quieter work of hypnotherapy, regression or inner-child healing. Some need their body and energy to feel safe again before anything else can change.',
  },
  {
    lead: 'So I trained in all of it.',
    text: 'Psychotherapy and counselling, clinical hypnotherapy, NLP and mind reprogramming, Reiki, chakra and energy work, tarot and numerology — not to collect methods, but so that whoever walks in, I have a door that fits them.',
  },
  {
    lead: 'You will be safe here.',
    text: 'My promise is simple: you will be safe here, you will be taken seriously, and we will go at the pace your heart can hold.',
  },
]

export const bridge: { id: string; title: string; line: string; glyph: GlyphName; items: { name: string; glyph: GlyphName }[] }[] = [
  {
    id: 'mind',
    title: 'Mind',
    line: 'Understand the pattern',
    glyph: 'mind',
    items: [
      { name: 'Counselling', glyph: 'heart' },
      { name: 'Mind reprogramming', glyph: 'neural' },
      { name: 'NLP', glyph: 'speech' },
      { name: 'Recall · Recode · Reset', glyph: 'recode' },
    ],
  },
  {
    id: 'deep',
    title: 'Subconscious',
    line: 'Release the root',
    glyph: 'spiral',
    items: [
      { name: 'Clinical hypnotherapy', glyph: 'spiral' },
      { name: 'Past life regression', glyph: 'hourglass' },
      { name: 'Inner child healing', glyph: 'child' },
      { name: 'EFT & Ho’oponopono', glyph: 'tap' },
    ],
  },
  {
    id: 'soul',
    title: 'Soul',
    line: 'Restore the whole',
    glyph: 'orb',
    items: [
      { name: 'Reiki & chakra healing', glyph: 'chakra' },
      { name: 'Aura reading', glyph: 'aura' },
      { name: 'Tarot & numerology', glyph: 'card' },
      { name: 'Breathwork & meditation', glyph: 'breath' },
    ],
  },
]

export const sessionFlow: { title: string; line: string; glyph: GlyphName }[] = [
  { title: 'Arrive', line: 'We begin with a conversation, not a form. Tell me as much or as little as you like.', glyph: 'peers' },
  { title: 'Understand', line: 'Together we map what is happening — and where it first began.', glyph: 'compass' },
  { title: 'Release', line: 'Hypnotherapy, EFT or energy work loosen what talking alone could not.', glyph: 'chain' },
  { title: 'Rewire', line: 'New responses, practised gently until they become your own.', glyph: 'neural' },
  { title: 'Integrate', line: 'Simple practices for home, so the change outlives the session.', glyph: 'sprout' },
]

export const toolkit: { name: string; ring: string; glyph: GlyphName; line: string }[] = [
  { name: 'Psychotherapy & Counselling', ring: 'PSYCHOTHERAPY · COUNSELLING · ', glyph: 'mind', line: 'Behavioural, emotional, relationship and grief work.' },
  { name: 'Clinical Hypnotherapy', ring: 'CLINICAL · HYPNOTHERAPY · ', glyph: 'spiral', line: 'Focused, relaxed states for deep, lasting change.' },
  { name: 'Past Life Regression', ring: 'PAST LIFE · REGRESSION · ', glyph: 'hourglass', line: 'Guided journeys for fears and patterns without a story.' },
  { name: 'NLP & Mind Reprogramming', ring: 'NLP · MIND · REPROGRAMMING · ', glyph: 'neural', line: 'Language and neuroplasticity, put to work for you.' },
  { name: 'EFT & Ho’oponopono', ring: 'EFT · HO’OPONOPONO · ', glyph: 'tap', line: 'Tapping and forgiveness practices that settle the body.' },
  { name: 'Reiki', ring: 'REIKI · ENERGY · HEALING · ', glyph: 'palm', line: 'Hands-on and distant energy healing.' },
  { name: 'Neuro Chakra Quantum Healing', ring: 'NEURO · CHAKRA · QUANTUM · ', glyph: 'chakra', line: 'Rebalancing the body’s seven energy centres.' },
  { name: 'Tarot, Numerology & Aura', ring: 'TAROT · NUMEROLOGY · AURA · ', glyph: 'card', line: 'Reflective tools for clarity and timing.' },
  { name: 'POSH Facilitation', ring: 'POSH · WOMEN · SAFETY · ', glyph: 'shield', line: 'Workplace awareness and Internal Committee training.' },
]

export const promises: { t: string; d: string; glyph: GlyphName }[] = [
  { t: 'Confidential, always', d: 'What you share stays between us — unless someone’s life is in immediate danger.', glyph: 'shield' },
  { t: 'Without judgement', d: 'No subject is too strange, too shameful or too taboo to bring.', glyph: 'veil' },
  { t: 'Trauma-informed', d: 'You lead. Nothing is forced, and you can pause at any moment.', glyph: 'breath' },
  { t: 'At your pace', d: 'Some people need one session. Some need a season. Both are fine.', glyph: 'clock' },
  { t: 'Online, anywhere', d: 'Video sessions worldwide; distant healing needs no call at all.', glyph: 'signal' },
  { t: 'Mind and soul, together', d: 'Evidence-informed therapy and spiritual healing, side by side.', glyph: 'orb' },
]

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */
export const enquiryKinds: { id: string; label: string; sub: string; glyph: GlyphName }[] = [
  { id: 'talk', label: 'A first conversation', sub: 'Talk it through, no commitment', glyph: 'speech' },
  { id: 'healing', label: 'A healing session', sub: 'Hypnotherapy, energy & deep work', glyph: 'palm' },
  { id: 'reading', label: 'A reading', sub: 'Tarot, numerology or aura', glyph: 'card' },
  { id: 'org', label: 'For my organisation', sub: 'Workshops & POSH training', glyph: 'circle' },
]

export const modes: { id: string; label: string; line: string; glyph: GlyphName }[] = [
  { id: 'online', label: 'Online video', line: 'From anywhere in the world', glyph: 'signal' },
  { id: 'studio', label: 'In person', line: 'At the private studio', glyph: 'peers' },
  { id: 'distant', label: 'Distant healing', line: 'No call needed', glyph: 'orb' },
]

export const times = ['Morning', 'Afternoon', 'Evening']

export const faqs = [
  {
    q: 'Is everything I share confidential?',
    a: 'Yes. What you share stays between us. The only exception is if someone’s life is in immediate danger — and even then, we talk about it together first wherever possible.',
  },
  {
    q: 'Do you offer online sessions?',
    a: 'Yes. Counselling, hypnotherapy, regression and readings all work beautifully over video, and distant healing needs no call at all. Clients join from across India and abroad.',
  },
  {
    q: 'What happens in the first session?',
    a: 'Mostly, we talk. You share what brings you, what you have already tried and what you hope will change. Then we choose the approach — or blend of approaches — that fits you.',
  },
  {
    q: 'How many sessions will I need?',
    a: 'It depends on what we are working with. Many counselling clients feel a real shift within four to six sessions; some deep work, such as a regression, may be one or two longer sessions. We agree a plan together.',
  },
  {
    q: 'Is hypnotherapy safe? Will I lose control?',
    a: 'Clinical hypnotherapy is a deeply relaxed, focused state. You stay aware throughout, you can speak and stop at any time, and you cannot be made to do anything against your will.',
  },
  {
    q: 'Can energy healing replace my medication or doctor?',
    a: 'No. Holistic and spiritual healing complements medical and psychiatric care — it never replaces it. Please keep taking anything you have been prescribed.',
  },
  {
    q: 'Are tarot and numerology fortune-telling?',
    a: 'Not the way I use them. They are reflective tools — a mirror for your choices and timing — rather than a fixed prediction of your fate.',
  },
  {
    q: 'Do you work with organisations?',
    a: 'Yes — POSH awareness and Internal Committee training, wellbeing workshops and talks for companies, schools, colleges and community groups, in person or online.',
  },
]
