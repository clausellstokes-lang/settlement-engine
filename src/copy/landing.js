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
    // ⛔ THE PAGE IS ONE ACCOUNT NOW, NOT FIVE PITCHES (owner order ODQ §934.30
    // item 3: "the voice needs work to be one cohesive narrative rather than
    // disconnected ideas"; the draft approved 2026-09-19). The old sub listed
    // four nouns and ended on "Then it simulates how they change" — the
    // MECHANISM. "The town answers for it" is the thing the four stops below
    // actually demonstrate, in order, about one town: Cnocby.
    sub:       'One click makes a town: its economy, its people, the quarrel it is having this week. Then time runs, and the town answers for it. A world that holds together.',
    cta:       'Forge your first settlement',
    signin:    'Sign in',
    reassure:  'Free. No account needed to forge your first town.',
    scrollCue: 'Follow the road',
  },

  // ── 01 · Forge ──────────────────────────────────────────────────────────────
  forge: {
    waypoint: '01 · Forge',
    h2:    'A living town in one click. Twenty dials when you want them.',
    // Every concrete noun here is a FACT THE FIXTURE CARRIES, so §02 can print
    // the same four receipts a screen later and the reader recognises them:
    // the road roll (voice.receipts.route), the market licensing quarrel
    // (voice.receipts.conflict), the cleared stands (voice.receipts.resource).
    body:  'Pick a size and forge. Everything after that is derived, not drawn from a table: where the road goes, who holds the market, which faction is owed a favour, what was cut down a generation ago and never grew back. Open the Advanced panel and set terrain, age, wealth and trouble yourself.',
    axiom: 'Every dossier answers the same question: given these constraints, what must this place be?',
    // ⛔ THE SECTION-LEVEL ASK IS GONE (owner, 2026-09-19, taking the draft's
    // recommendation): ONE ask at the top and ONE at the end. `cta` ("Forge a
    // settlement") is DELETED rather than left unrendered — an unused copy key
    // is the rot this same act cured in `realm.whyTraceTag`. Forging is still
    // one click away from here: the hero CTA, the closer CTA, and the brief
    // card's own "Forge this exact town". What replaces it is the narrative
    // hand-off to the next stop, in the estate's caps-link idiom.
    readOn: 'Read on: the voice',
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
    // ⚑ FIXTURE-GROUNDED: the population (town.population 412) and the bakehouse
    // (town.prose) are quoted from the frozen fixture, and the eyebrow's two
    // dials (town.eyebrow "road village · mountain") are what "a mountain
    // village the road reaches" says. tests/copy/landingProseGrounding.test.js
    // reds when a regenerated fixture leaves this sentence behind.
    body:    'This is Cnocby: four hundred and twelve people, a mountain village the road reaches, and a bakehouse already on its second bake when you arrive. The Summary tab is your session prep. Systems, factions and history sit one tab deeper, for when the party starts digging.',
    library: 'Sign in free to keep every town in your Library, organized by campaign.',
    // ⛔ `cta` ('Forge a settlement') and `link` ('Read on: the voice') ARE
    // DELETED. Neither was rendered anywhere — the brief block feeds §01's
    // MiniDossierCard, which has never had a section ask — and the read-on line
    // now lives on `forge.readOn`, where it is actually painted. Two unrendered
    // strings are the same rot as `realm.whyTraceTag`, caught in the same act.
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
    // "The same TOWN", not "the same facts": one word, and it is what ties this
    // stop to the one above instead of restarting the pitch.
    h2:     'The same town, in a voice for the table.',
    // ⚓ "never invents facts" is carried VERBATIM — tests/copy/landingClaimsParity
    // binds it to src/domain/aiGrounding.js and its suites. ⚑ The three named
    // receipts are voice.receipts[1], [2] and [0], in the order the card prints.
    body:   'Left is what the engine derived about Cnocby: the road it rolled, the timber it marked out, the licence the two factions want. Right is the same four facts for the table. The Narrative Layer never invents facts. Everything it needs is already in the brief.',
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
    // ⛔ THE DOOR OUT OF THE NARRATE REFUSAL (REVIEW-P F4, ODQ §934.24(c)). The CTA
    // used to navigate to /create on every click with nothing said; it now raises the
    // registered `narrateNeedsTown` reason where the reader clicked, and THIS is the
    // control on that notice — the reader's second, informed click. The label names
    // the act rather than the destination, because the notice above it has already
    // said why the forge has to come first.
    narrateDoor: 'Forge a settlement',
    pricingLink: 'Credit pricing',
  },

  // ── 04 · The Realm ──────────────────────────────────────────────────────────
  // Why-trace rows, chronicle entries, relationship chips, and map pins come
  // from the fixture module — real band deltas with real engine causes, real
  // generated neighbor names. Only connective strings live here.
  realm: {
    waypoint:     '03 · The Realm',
    waypointPill: 'Cartographer',
    // "let the world RUN" describes a machine starting; "let the world HAPPEN TO
    // IT" keeps Cnocby the subject, which is what the card beside it now shows.
    h2:    'Make it canon. Then let the world happen to it.',
    body1: 'Canonize the draft and Cnocby becomes part of your campaign: it takes events, keeps a chronicle, remembers. Put it on the world map in the Realm with the towns around it, tie them together by trade and grudge, and add your own gods, guilds and goods in the Compendium.',
    // ⚑ FIXTURE-GROUNDED, EVENT BY EVENT. Every beat in this sentence is one row
    // of realm.advance — the same six records the card beside it renders, in the
    // same order, at the same weeks (1 creed · 2 wartime · 4 fracture · 10 crime
    // · 12 trade). It is the most fragile prose on the page and the grounding
    // suite walks it word against field.
    body2: 'Then advance time. In Cnocby’s first twelve weeks the village took a patron creed, then wartime pressure, then the fracture passed and left its memory; by week ten there was crime, and by week twelve the road itself was strained. Every one of those is a record the engine wrote, and every one carries its cause.',
    // The chronicle beside the realm map is the REGION's band, not the town's —
    // two cards that now say different things, and a reader needs to be told why.
    regionLine: 'Beside it, the region: what the neighbours did while Cnocby was busy.',
    // ⛔ KEPT, AGAINST THE APPROVED DRAFT, AND THE REASON IS RECORDED. The other
    // two middle asks (forge.cta, commons.cta) are deleted; this one is not.
    // 'See Cartographer' is CONTROL #5 OF THE PURCHASE LOCKOUT the owner ordered
    // on 2026-09-16 — it renders disabled behind an AvailableAtLaunchPill until
    // launch, and tests/components/launchLock.libraryHeaderLanding.test.jsx pins
    // it in both the closed and the open state, reading THIS KEY by name. Cutting
    // it to a read-on link would require rewriting that census, which is how a
    // launch lock stops being enforced without anyone deciding that it should.
    // Owner-gated (paid-surface behaviour); the chair rules. See .lane-resume.md.
    cta:   'See Cartographer',
    micro: 'Turns on when you do. The free tier keeps working.',
    whyTraceTitle: 'Advance time · week {week}',
    // ⛔ `whyTraceTag` ('why-trace') IS DELETED (owner, 2026-09-19). The card
    // stopped rendering the why-trace in ODQ §934.30 item 4 and a mono tag
    // reading "why-trace" over a list of real events is exactly the stale label
    // the 09-18 walk found four of. The slot carries the SEASON instead, derived
    // from the fixture (realm.advance[].season, via the advance report's own
    // tickCalendarLabel) — a fact, so it needs no copy key at all.
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
    // "You have just read one town" is the only line on the page that explicitly
    // hands the baton from the previous stop, which is what makes this an account
    // rather than a fifth pitch. ⚑ The last clause is true only because Cnocby is
    // now a curated sample (src/data/sampleSettlements.js, ODQ §934.30 item 5).
    body: 'You have just read one town. Walk the Gallery and take one that has already lived a little; admire and share freely, and fork one into your own Library with Cartographer. Cnocby is there to fork too, if you want to start from a place you already know.',
    // ⛔ The section ask ('Browse the gallery') is DELETED with the other two. The
    // gallery is still one click from this very section: every real published row
    // in the strip carries its own 'Open' button (commons.open, below).
    readOn: 'Read on: set out',
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
    // ⚑ The closer is the one place the page may say what it just did. The week
    // count is fixture.weeks; "before the kettle boils" is the best line in the
    // old closer and is kept whole.
    sub:      'Cnocby took one click and twelve weeks. Yours can start before the kettle boils.',
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
      // ⛔ AN INVITATION-ONLY TIER LEAVES THE PUBLIC PATH (owner, ODQ §934.24
      // addendum). The Founders' Hall is given and never sold, so advertising it
      // to a logged-out visitor on the page whose job is to get them forging is
      // an offer nobody reading it can accept. The ROW STAYS — the tier exists,
      // and deleting the copy would make re-listing it a rewrite — and the FLAG
      // is what keeps it off the strip.
      //
      // ⚠ THE FLAG IS SPELLED `invitationOnly` DELIBERATELY: it is the same key
      // lane 31's `isInvitationOnly` / `getPublicTiers` predicate reads in
      // src/config/pricing.js (car 06d04c7c4, branch fix-phone-front-2026-09-19),
      // which is NOT on this branch. The renderer therefore filters on the flag
      // inline rather than minting a second NAMED predicate that would drift from
      // that one. WHEN THE CHAIR COMPOSES 06d04c7c4 IN, repoint TierStrip's
      // filter at `isInvitationOnly` and delete nothing else — the flag is
      // already the right shape.
      { name: 'Founder',      badge: 'By invitation', body: '{seats} chairs in the Founders’ Hall, given and never sold. Everything Cartographer runs, for as long as SettlementForge runs.', seatLive: true, invitationOnly: true },
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
