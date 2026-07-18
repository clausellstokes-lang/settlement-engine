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
    // Two lines, one sentence each (rendered with a <br> in HomeLanding).
    h1a:       'Your players have a thousand choices.',
    h1b:       'Now you have every answer.',
    sub:       'SettlementForge generates living towns: economies, people, tensions, history. Then it simulates how they change. A world that holds together.',
    cta:       'Forge your first settlement',
    signin:    'Sign in',
    reassure:  'Free. No account needed to forge your first town.',
    scrollCue: 'Follow the road',
  },

  // ── 01 · Forge ──────────────────────────────────────────────────────────────
  forge: {
    waypoint: '01 · Forge',
    h2:    'A living town in one click. Twenty dials when you want them.',
    body:  'Pick a size and forge. The engine derives everything else from constraints, not tables: trade, factions, grudges, history. Or open the Advanced panel and set terrain, age, wealth, and trouble yourself.',
    axiom: 'Every dossier answers the same question: given these constraints, what must this place be?',
    cta:   'Forge a settlement',
    micro: 'No account needed',
    ceiling: 'Without an account, forge up to a Town. Sign in free for every size, saving, and full Basic / Advanced control.',
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
  // Owner amendment W-L2/1: the dossier artifact's CONTENT (town, prose, hooks)
  // is no longer authored copy — it is FROZEN REAL ENGINE OUTPUT from
  // src/components/home/landingFixture.js (the Briarhollow/Maera demo copy is
  // retired). Only connective strings live here.
  brief: {
    waypoint: '02 · The brief',
    h2:      'Read the Summary tab. That’s your session prep.',
    body:    'Every settlement arrives as a dossier: the town in four sentences, who matters tonight, what’s about to break, and why. Systems, factions, and history sit one tab deeper, for when the party starts digging.',
    library: 'Sign in free to keep every town in your Library, organized by campaign.',
    cta:     'Forge a settlement',
    link:    'Read on: the voice',
    tabs:    ['Summary', 'Systems', 'World', 'Notes'],
    population: 'Population {n}',
    more:    '+{n} more in the dossier',
    save:     'Save to Library',
    saveNote: 'free account · keeps every draft',
    // The one interactive artifact control (owner addition W-L2/5): replays the
    // fixture's exact seed + config through the SAME forge action as every
    // other generation — same anon cap, no special path. Determinism, quietly.
    forgeExact:    'Forge this exact town',
    deterministic: 'Same seed, same town. Every time.',
  },

  // ── 03 · The voice ──────────────────────────────────────────────────────────
  // RAW receipts + NARRATED prose come from the fixture module: the receipts
  // are real trace output; the narration is owner-sanctioned stock prose
  // grounded exclusively in them.
  voice: {
    waypoint: '03 · The voice',
    h2:     'The same facts, in a voice for the table.',
    body:   'The Narrative Layer turns raw simulation into table-ready prose. It never invents facts. Everything it needs is already in the brief.',
    // Owner directive: disclose the AI up front (not prominent). The Narrative
    // Layer is no longer the ONLY AI surface (the Surveyor workshop is another),
    // so this line evolved (W-DOC reconcile, brief §4) from the stale "only AI
    // feature" claim to the SCHEMA-WALL promise: every AI feature reads and
    // proposes; only the deterministic engine writes canon (structural, not
    // policy). The promise is true of the Narrative Layer and every AI surface.
    aiNote: 'The Narrative Layer is powered by AI. Every AI feature here reads and proposes; only the deterministic engine writes canon.',
    rawTag: 'what the engine derived',
    credit:      '1 credit',
    cta:         'Narrate',
    pricingLink: 'Credit pricing',
  },

  // ── 04 · The Realm ──────────────────────────────────────────────────────────
  // Why-trace rows, chronicle entries, relationship chips, and map pins come
  // from the fixture module — real band deltas with real engine causes, real
  // generated neighbor names. Only connective strings live here.
  realm: {
    waypoint:     '04 · The Realm',
    waypointPill: 'Cartographer',
    h2:    'Make it canon. Then let the world run.',
    body1: 'Canonize a draft and it becomes part of your campaign: it takes events, keeps a chronicle, and remembers. Place canon towns on the world map you build in the Realm, tie them together by trade and grudge, and add your own gods, guilds, and goods in the Compendium.',
    body2: 'Then advance time. Wars ignite and resolve, faiths rise, prices move, and every change tells you why.',
    cta:   'See Cartographer',
    micro: 'Turns on when you do. The free tier keeps working.',
    whyTraceTitle: 'Advance time · week {week}',
    whyTraceTag:   'why-trace',
    derivedLine:   'Every change carries its cause.',
    clockLabel: 'Realm clock',
    clockValue: 'Week {week}, Year 1',
    clockCta:   'Advance time',
    chronicleTitle: 'The Chronicle',
    chronicleTag:   'writes itself',
  },

  // ── 05 · The map ────────────────────────────────────────────────────────────
  // W-DOC (brief §4): THE MAP WAYPOINT. The plates are FROZEN REAL ENGINE OUTPUT
  // (the fixture idiom extended to the map layer): scripts/generate-landing-map-
  // plates.mjs replays the fixture's exact seed + config, verifies the replay
  // still produces the fixture town (the drift gate), and renders the v2 map in
  // two lenses (public/landing-maps/). Same town as §02's dossier — the seed tag
  // is the receipt. Art law (brief §5): the product's own output is the art.
  map: {
    waypoint: '05 · The map',
    h2:    'The same town, drawn. Every street has a reason.',
    body:  'The v2 map engine lays out districts, walls, and lanes from the same constraints that wrote the dossier — nothing is decorated into place. Flip the lens: one town, one memory, any style.',
    provenance: 'This is {name} from the brief above — same seed, same town, drawn.',
    tease: 'Hover a district in the app and the map answers why it is there. The map remembers what the town remembers.',
    lensLabel: 'Lens',
    lenses: [
      { id: 'parchment',  label: 'Parchment' },
      { id: 'watercolor', label: 'Watercolor' },
    ],
    alt: 'The generated town map of {name}, drawn in the {lens} lens by the v2 map engine.',
  },

  // ── 06 · The commons ────────────────────────────────────────────────────────
  // Owner amendment W-L2/3: up to FOUR real published gallery settlements render
  // here (fetched on below-fold mount, ranked by the strongest signal gallery.js
  // actually tracks); the decorative cards below fill any remaining slots, and a
  // failed/empty fetch renders all four decorative — zero layout shift.
  commons: {
    waypoint: '06 · The commons',
    // Owner amendment: was 'Towns other DMs have forged.' — softened to not
    // gatekeep the audience, keeping the knowing/dry voice.
    h2:   'Towns others have forged.',
    body: 'Don’t want to configure anything? Walk the Gallery and take a town that’s already lived a little. Admire and share freely; fork one into your own Library with Cartographer.',
    cta:  'Browse the gallery',
    fork: 'Fork',
    open: 'Open',
    votes: '{n} votes',
    cards: [
      { name: 'The Drowned Spire', author: 'mistwarden', pop: '412', size: 'City',    scene: 'city',    pos: 'center 30%' },
      { name: 'Ashfall Crossing',  author: 'dm_corvid',  pop: '388', size: 'Town',    scene: 'thorpe',  pos: 'center 55%' },
      { name: 'Greyharbor',        author: 'quiethand',  pop: '291', size: 'Village', scene: 'village', pos: 'center 40%' },
      { name: 'Saltmere Ford',     author: 'lanternkeep', pop: '203', size: 'Village', scene: 'thorpe',  pos: 'center 20%' },
    ],
  },

  // ── 07 · Set out (closer) ────────────────────────────────────────────────────
  closer: {
    waypoint: '07 · Set out',
    h2:       'The world holds together. Yours can too.',
    sub:      'Forge a town before the kettle boils. Keep it if it’s good.',
    cta:      'Forge your first settlement',
    // 'Free. No account needed.' removed here (owner) — the hero already says it.
    // W-DOC reconcile (brief §4): the numeric facts ({anonSize}, {freeSaves})
    // are CONFIG-SOURCED — TierStrip interpolates them from config/tierFacts.js
    // (ANON_MAX_SIZE_LABEL, FREE_SAVE_LIMIT), never hand-typed, so the closer can
    // never restate a ceiling the catalog didn't. The anon line was corrected:
    // "completely randomized" was an overstatement (the engine rolls the five
    // priority sliders per generation via _randomizePriorities, then derives the
    // town from those constraints — it is not "completely" random). Surveyor
    // renders as the WALLED violet AI-channel early-access band (ruling #3),
    // not a subscription tier — it is the optional AI workshop, priced per task.
    tiers: [
      { name: 'Anonymous',    badge: 'Free · no account', body: 'Up to three forges a day, no sign-up — priorities rolled, the town derived from them. Up to {anonSize} size, nothing kept.' },
      { name: 'Wanderer',     badge: 'Free · account',    body: 'A free account unlocks every size with full settlement customization, a Library with up to {freeSaves} saves, and sharing to the Gallery.' },
      { name: 'Cartographer', badge: 'Premium',           body: 'The living simulation: the Realm, wars that end themselves, custom content, and gallery import. Unlimited saves and unlimited exports.', accent: true },
      { name: 'Surveyor',     badge: 'AI · early access', body: 'The optional AI workshop: an analyst for your world, prose briefs, and session interpretation that proposes edits for you to approve — it never writes canon. Bring your own key.', aiWall: true },
      { name: 'Founder',      badge: 'Premium · Lifetime', body: 'Everything Cartographer runs, forever. One payment, no clock.', seatLive: true },
    ],
    fullPricing: 'Full pricing',
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    brand:   'settlementforge',
    links:   ['Compendium', 'Pricing', 'Account'],
  },
};

/**
 * tl — resolve a dotted key against the landing namespace. Mirrors copy/index's
 * t() semantics (dotted path + optional {name} interpolation), scoped to the
 * `landing` object so keys are relative: tl('hero.h1a'), tl('forge.sizes').
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
