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
 *
 * CLAIMS PARITY (bar 13): the checkable capability claims in this file (the anon
 * daily-forge count, the anon size ceiling, wars-that-end, never-invents-facts,
 * same-seed determinism) are bound to their enforcing config/suites by
 * tests/copy/landingClaimsParity.test.js — rewording a bound claim or changing
 * the underlying enforcement reds that gate so the binding is revisited.
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
    // Population bands mirror the engine canon (src/data/constants.js
    // POPULATION_RANGES) exactly — the same figures the Create-page gauge reads
    // live. Walk W1 (owner order 2026-07-21, ledger 70a19ce5) corrected these:
    // they were stale by ~a tier (Hamlet 20–80 etc.), contradicting the Create
    // page. En-dash separator + 'min+' for the open top tier match HomeHero.popFigure.
    sizes: [
      { name: 'Hamlet',     range: '61–400' },
      { name: 'Village',    range: '401–900',    selected: true },
      { name: 'Town',       range: '901–5,000' },
      { name: 'City',       range: '5,001–25,000', locked: true },
      { name: 'Metropolis', range: '25,001+',   locked: true },
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
    // STRIP-1: `waypoint` ('02 · The visual') is REMOVED — it pilled the settlement-map
    // section, which is gone. The rest of this block feeds §01's MiniDossierCard.
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
    waypoint: '02 · The voice',
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
    credit:      '5 credits',
    cta:         'Narrate',
    pricingLink: 'Credit pricing',
  },

  // ── 04 · The Realm ──────────────────────────────────────────────────────────
  // Why-trace rows, chronicle entries, relationship chips, and map pins come
  // from the fixture module — real band deltas with real engine causes, real
  // generated neighbor names. Only connective strings live here.
  realm: {
    waypoint:     '03 · The Realm',
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

  // STRIP-1 (owner ruling, ODQ §725): the `map` copy block — headline, body, tease,
  // lens registry and plate alt text for the landing page's drawn settlement map —
  // is REMOVED with the section it fed. The five surviving stops renumber 01..05
  // below so the waypoint pills stay contiguous.

  // ── 05 · The commons ────────────────────────────────────────────────────────
  // Owner amendment W-L2/3: real published gallery settlements render here
  // (fetched on below-fold mount, ranked by the strongest signal gallery.js
  // actually tracks). Below three real rows the strip shows the three curated
  // Founding Worlds instead — the Create page's own samples, forkable, real.
  commons: {
    waypoint: '04 · The commons',
    // Owner amendment: was 'Towns other DMs have forged.' — softened to not
    // gatekeep the audience, keeping the knowing/dry voice.
    h2:   'Towns others have forged.',
    body: 'Don’t want to configure anything? Walk the Gallery and take a town that’s already lived a little. Admire and share freely; fork one into your own Library with Cartographer.',
    cta:  'Browse the gallery',
    open: 'Open',
    votes: '{n} votes',
    // ⛔ THE DECORATIVE CARDS ARE DELETED (2026-09-18, owner order "impliment every
    // fix"). Six invented towns with invented authors — a 'City' of 412 people among
    // them — backfilled every unfilled slot, each labelled ' (placeholder)' beside its
    // name, on the one page whose whole claim is that nothing here is made up. They had
    // no flag and no cap: an empty gallery showed six of them to every visitor. The
    // strip now shows REAL published rows once the gallery has three, and otherwise the
    // three curated Founding Worlds the Create page already offers (real generations,
    // forkable, single-sourced from src/data/sampleSettlements.js). No slot is ever
    // filled with fiction, so no 'fork' chip copy is needed either — the fallback
    // carries the Create page's real 'Fork this sample' button.
  },

  // ── 06 · Set out (closer) ────────────────────────────────────────────────────
  closer: {
    waypoint: '05 · Set out',
    h2:       'The world holds together. Yours can too.',
    sub:      'Forge a town before the kettle boils. Keep it if it’s good.',
    cta:      'Forge your first settlement',
    // 'Free. No account needed.' removed here (owner) — the hero already says it.
    // Walk W1 (owner order 2026-07-21, ledger): the ANONYMOUS tier card was REMOVED
    // from the set-out strip; the remaining cards fill the row naturally (no forced
    // 2x2). The hero already carries the "free, no account" line, so the anon daily-
    // cap claim no longer lives here (its landing claims-parity binding was retired
    // in tests/copy/landingClaimsParity.test.js). W-DOC reconcile (brief §4): the
    // remaining numeric fact ({freeSaves}) stays CONFIG-SOURCED — TierStrip interpolates
    // it from config/tierFacts.js (FREE_SAVE_LIMIT), never hand-typed. Surveyor renders
    // as the WALLED violet AI-channel early-access band (ruling #3), not a subscription
    // tier — it is the optional AI workshop, priced per task.
    tiers: [
      { name: 'Wanderer',     badge: 'Free · account',    body: 'A free account unlocks every size with full settlement customization, a Library with up to {freeSaves} saves, and sharing to the Gallery.' },
      { name: 'Cartographer', badge: 'Premium',           body: 'The living simulation: the Realm, wars that end themselves, custom content, and gallery import. Unlimited saves and unlimited exports.', accent: true },
      { name: 'Surveyor',     badge: 'AI · early access', body: 'The optional AI workshop: an analyst for your world, prose briefs, and session interpretation that proposes edits for you to approve. It never writes canon. Bring your own key.', aiWall: true },
      { name: 'Founder',      badge: 'By invitation', body: '{seats} chairs in the Founders’ Hall, given and never sold. Everything Cartographer runs, for as long as SettlementForge runs.', seatLive: true },
    ],
    fullPricing: 'Full pricing',
  },
  // (The band's own `footer` strip keys left with LandingFooter: owner order
  // 2026-09-16 put the app's one global footer on the landing, so the landing no
  // longer carries a brand-and-links strip of its own.)
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
