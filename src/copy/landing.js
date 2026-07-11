/**
 * copy/landing.js — the `landing.*` copy namespace + its `tl()` lookup for the
 * scrollable Welcome page (HomeLanding + home/LandingBelowFold).
 *
 * WHY ITS OWN MODULE (not inside en.js) WITH A LOCAL LOOKUP: en.js rides the
 * EAGER first-paint entry chunk (App.jsx statically imports `t` from
 * copy/index.js). The Welcome page's verbatim marketing copy is ~4 kB and would
 * blow the razor first-paint byte budget (tests/build/vendorPdfLazy.test.js —
 * sub-kB margin). So this namespace is lazily SEGMENTED: it is imported ONLY by
 * the lazy HomeLanding chunk and read through this module's own `tl()` (same
 * dotted-key + interpolation semantics as copy/index.js's t()). Both the copy
 * AND its resolver ride the lazy chunk — zero first-paint footprint, and the
 * hot app-wide t()/resolve() path in copy/index.js is untouched. This is the
 * "namespace-level lazy segmentation of the copy registry" the first-paint-
 * budget note names as the sanctioned pattern for deep surfaces.
 *
 * Copy is VERBATIM from the landing spec §6 (typographic punctuation preserved).
 * No emoji or icon glyphs live in these strings — the ✦ / 🔒 / arrows in the
 * spec render as Lucide icons in the components (spec §3.5).
 */

export const landing = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  // Owner amendment: the spec's eyebrow ("A SIMULATOR FOR DUNGEON MASTERS") is
  // removed entirely — no replacement — so the category framing doesn't exclude
  // simulation fans, worldbuilders, and would-be DMs. The H1 leads.
  hero: {
    h1:        'Your players have a thousand choices. Now you have every answer.',
    sub:       'SettlementForge generates living towns — economies, people, tensions, history — then simulates how they change. Not a dice roll. A world that holds together.',
    cta:       'Forge your first settlement',
    signin:    'Sign in',
    reassure:  'Free. No account needed to forge your first town.',
    scrollCue: 'Follow the road',
  },

  // ── 01 · Forge ──────────────────────────────────────────────────────────────
  forge: {
    waypoint: '01 · Forge',
    h2:    'A living town in one click. Twenty dials when you want them.',
    body:  'Pick a size and forge. The engine derives the rest — trade, factions, grudges, history — from constraints, not tables. Or open the Advanced panel and set terrain, age, wealth, and trouble yourself.',
    axiom: 'Every dossier answers the same question: given these constraints, what must this place be?',
    cta:   'Forge a settlement',
    micro: 'No account needed · the result isn’t saved',
    ceiling: 'Free mode forges up to a Town. Sign in for all sizes, saving, and full Basic / Advanced control.',
    draftTitle: 'Instant draft',
    draftHint:  'pick a size and go',
    sizes: [
      { name: 'Hamlet',     range: '20–80' },
      { name: 'Village',    range: '80–400',    selected: true },
      { name: 'Town',       range: '400–3,000' },
      { name: 'City',       range: '3,000–12k', locked: true },
      { name: 'Metropolis', range: '12,000+',   locked: true },
    ],
    modeBasic:    'Basic',
    modeAdvanced: 'Advanced',
    modeDials:    'terrain · age · wealth · trouble',
  },

  // ── 02 · The brief ──────────────────────────────────────────────────────────
  brief: {
    waypoint: '02 · The brief',
    h2:      'Read the Summary tab. That’s your session prep.',
    body:    'Every settlement arrives as a dossier: the town in four sentences, who matters tonight, what’s about to break, and why. Systems, factions, and history sit one tab deeper — for when the party starts digging.',
    library: 'Sign in free to keep every town in your Library, organized by campaign.',
    cta:     'Forge a settlement',
    link:    'Read on — the voice',
    dossier: {
      eyebrow:    'River village · Temperate forest',
      name:       'Briarhollow',
      population: 'Population 412',
      tabs:       ['Summary', 'Systems', 'World', 'Notes'],
      prose:       'Briarhollow sits where the salt road forks to meet the river. Grain moves downriver, timber up, and the garrison eats on the tavern’s contract.',
      proseItalic: 'The baker owes the miller for three seasons of flour — and has stopped speaking to him entirely.',
      hooks: [
        { kind: 'NPC',  tone: 'success', tag: 'derived · factions',      lead: 'Maera Voss, miller', rest: ' — goal: call in the baker’s debt before first frost, publicly.' },
        { kind: 'Hook', tone: 'warning', tag: 'derived · supply-chain',  text: 'The garrison’s ration contract lapses at week’s end — and the tavern’s bread comes from the baker who owes the mill.' },
      ],
      save:     'Save to Library',
      saveNote: 'free account · keeps every draft',
    },
  },

  // ── 03 · The voice ──────────────────────────────────────────────────────────
  voice: {
    waypoint: '03 · The voice',
    h2:     'The same facts, in a voice for the table.',
    body:   'The Narrative Layer turns raw simulation into table-ready prose. It never invents facts — everything it needs is already in the brief.',
    rawTag: 'what the engine derived',
    raw: [
      'tension: miller–baker debt · 3 seasons unpaid',
      'leverage: mill monopoly · nearest wheel 1 day’s ride',
      'trigger: first frost — debt callable',
      'stakes: tavern bread → garrison rations',
    ],
    credit:      '1 credit',
    narrated:    'The baker hasn’t spoken to the miller since midsummer. Three seasons of flour stand between them, and the first frost will call the debt due — publicly, if Maera has her way. The garrison eats on the tavern’s contract; the tavern bakes with borrowed flour. Everyone in Briarhollow can count.',
    cta:         'Narrate',
    pricingLink: 'Credit pricing',
  },

  // ── 04 · The Realm ──────────────────────────────────────────────────────────
  realm: {
    waypoint:     '04 · The Realm',
    waypointPill: 'Cartographer',
    h2:    'Make it canon. Then let the world run.',
    body1: 'Canonize a draft and it becomes part of your campaign — it takes events, keeps a chronicle, and remembers. Place canon towns on the world map, tie them together by trade and grudge, and add your own gods, guilds, and goods in the Compendium.',
    body2: 'Then advance time. Wars ignite and resolve, faiths rise, prices move — and every change tells you why.',
    cta:   'See Cartographer',
    micro: 'Turns on when you do. The free tier keeps working.',
    whyTraceTitle: 'Advance time — month 7',
    whyTraceTag:   'why-trace',
    derivedLine:   'Derived, never rolled — every change carries its cause.',
    deltas: [
      { axis: 'Economic capacity',    from: 'Steady', to: 'Contested', tone: 'warning', reason: 'Blockade at the salt road; the garrison deployed abroad.' },
      { axis: 'Faith',                from: 'Waning', to: 'Rising',    tone: 'success', reason: 'The harvest cult wins a second shrine; the river god wanes.' },
      { axis: 'Criminal opportunity', from: 'Steady', to: 'Abundant',  tone: 'danger',  reason: 'Grain moving off-ledger behind the mill.' },
    ],
    clockLabel: 'Realm clock',
    clockValue: 'Month 7, Year 1',
    clockCta:   'Advance time',
    pins: [
      { name: 'Highcandle',  dotTone: 'danger',  tag: 'At war',  tagTone: 'danger'  },
      { name: 'Briarhollow', dotTone: 'gold' },
      { name: 'Fenwick',     dotTone: 'success', tag: 'Famine', tagTone: 'warning' },
    ],
    chronicleTitle: 'The Chronicle',
    chronicleTag:   'writes itself',
    chronicle: [
      { kind: 'war',      tone: 'war',      month: 'Month 7', text: 'Highcandle’s levy marches on Oldkeep over the disputed iron road.' },
      { kind: 'faith',    tone: 'faith',    month: 'Month 7', text: 'The harvest cult wins a second shrine in Briarhollow.' },
      { kind: 'economic', tone: 'economic', month: 'Month 6', text: 'Famine in Fenwick drives grain prices up across the southern reach.' },
    ],
    relationships: [
      { text: 'Briarhollow ⇆ Fenwick · grain for timber', tone: 'neutral' },
      { text: 'Highcandle ⤬ Oldkeep · the iron road',     tone: 'danger'  },
    ],
  },

  // ── 05 · The commons ────────────────────────────────────────────────────────
  commons: {
    waypoint: '05 · The commons',
    // Owner amendment: was 'Towns other DMs have forged.' — softened to not
    // gatekeep the audience, keeping the knowing/dry voice.
    h2:   'Towns others have forged.',
    body: 'Don’t want to configure anything? Walk the Gallery and take a town that’s already lived a little. Admire and share freely; fork one into your own Library with Cartographer.',
    cta:  'Browse the gallery',
    fork: 'Fork',
    cards: [
      { name: 'The Drowned Spire', author: 'mistwarden', pop: '412', size: 'City',    scene: 'city',    pos: 'center 30%' },
      { name: 'Ashfall Crossing',  author: 'dm_corvid',  pop: '388', size: 'Town',    scene: 'thorpe',  pos: 'center 55%' },
      { name: 'Greyharbor',        author: 'quiethand',  pop: '291', size: 'Village', scene: 'village', pos: 'center 40%' },
    ],
  },

  // ── 06 · Set out (closer) ────────────────────────────────────────────────────
  closer: {
    waypoint: '06 · Set out',
    h2:       'The world holds together. Yours can too.',
    sub:      'Forge a town before the kettle boils. Keep it if it’s good.',
    cta:      'Forge your first settlement',
    reassure: 'Free. No account needed.',
    tiers: [
      { name: 'Wanderer',     badge: 'Free',     body: 'Forge freely. Keep a Library, canonize your towns, share to the Gallery.' },
      { name: 'Cartographer', badge: 'Premium',  body: 'The living simulation: the Realm, wars that end themselves, custom content, gallery import.', accent: true },
      { name: 'Founder',      badge: 'Lifetime', body: 'Everything Cartographer runs, forever. One payment, no clock.' },
    ],
    fullPricing: 'Full pricing',
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    tagline: 'derived, never rolled',
    brand:   'settlementforge',
    links:   ['Compendium', 'Pricing', 'Account'],
  },
};

/**
 * tl — resolve a dotted key against the landing namespace. Mirrors copy/index's
 * t() semantics (dotted path + optional {name} interpolation), scoped to the
 * `landing` object so keys are relative: tl('hero.h1'), tl('forge.sizes').
 * Returns strings interpolated; returns arrays/objects (size/tier/pin lists)
 * verbatim for the components to map over. Loud in DEV on a miss, quiet in PROD.
 */
export function tl(key, vars) {
  const parts = key.split('.');
  let cur = landing;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') { cur = undefined; break; }
    cur = cur[p];
  }
  if (cur === undefined) {
    if (import.meta?.env?.DEV) console.warn(`[copy] missing landing key: ${key}`);
    return key;
  }
  if (typeof cur === 'string' && vars) {
    return cur.replace(/\{(\w+)\}/g, (m, name) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m);
  }
  return cur;
}
