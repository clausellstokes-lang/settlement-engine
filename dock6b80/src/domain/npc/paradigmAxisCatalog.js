/**
 * domain/npc/paradigmAxisCatalog.js — THE PARADIGM AXIS CATALOG (W-LIVES car L1).
 *
 * ⛔ NOTHING CONSUMES THIS FILE YET, AND THAT IS THE DESIGN. Car L1 lands the
 * substrate DARK: pure data plus pure readers, zero importers in src/. The three
 * legacy weight tables stay AUTHORITATIVE at their existing homes and every
 * existing consumer keeps importing them unchanged — re-pointing consumers onto
 * this catalog is car L5's work, deliberately not this one's, so the byte-identity
 * risk of the consolidation is exactly zero at this landing.
 *
 * ── WHAT THIS IS ────────────────────────────────────────────────────────────
 * A paradigm AXIS is a prewritten opposed pair — a virtue pole and its
 * corresponding vice — and an entity's stance on an axis is ONE signed, leveled
 * position (sign picks the pole; magnitude is a band word). One position per axis
 * makes the owner's no-same-axis rule arithmetic rather than validation
 * (ODQ §800.2); every NPC and god holds every axis semantically while a neutral
 * position costs zero bytes (ODQ §800.4).
 *
 * ── CONSOLIDATION, NOT DERIVATION (ODQ §806 F1 — BINDING) ───────────────────
 * DESIGN_W_LIVES §1 originally proposed that the three hand-tables become DERIVED
 * columns, each word's weight computed as `axis lean × pole sign × level scale`.
 * The skeptic panel proved that arithmetically unsatisfiable: the legacy tables are
 * per-WORD, their pole pairs are asymmetric, and they conflict across tables. The
 * evidence is visible in TRAIT_COLUMNS below —
 *   • `cruel` and `merciful` are symmetric on the plane (±0.85) but NOT on
 *     alignment (−0.9 / +0.85), so no single per-axis magnitude reproduces both;
 *   • `compassionate` and `merciful` share an alignment weight (0.85) and an
 *     e-lean (−0.85) yet differ on aggression (−0.8 / −0.85);
 *   • `wrathful` leans e 0.5 / c 0.3 while `vengeful` leans e 0.55 / c 0.2 — two
 *     expressions of neighbouring vices whose ratio inverts between axes.
 * So §15's fold governs: THE CATALOG CARRIES THE LEGACY PER-WORD, PER-COLUMN
 * VALUES VERBATIM. The `lean × sign × level` scheme survives only for DRIFTED and
 * NEWLY AUTHORED positions — words the legacy tables never scored. Consolidation
 * kills the three-parallel-hand-tables drift hazard exactly as well as derivation
 * would have, and byte-identity becomes trivially satisfiable instead of impossible.
 *
 * ── CORRUPTIBILITY IS A PER-WORD COLUMN (ODQ §806 F2 — BINDING) ─────────────
 * `corrupts` below is the verbatim per-word column lifted from corruption.js's
 * FLAW_VECTOR, NOT a per-axis property. The table is word-grained on purpose:
 * `cruel` is NOT corruptible while `callous` IS, and both are MERCY-vice words.
 * Each axis additionally declares a `corruptionVector` — but that one governs
 * DRIFTED vices only, and may never be read for a word the legacy column covers.
 *
 * ── OWNER-UNSIGNED: THIS IS A CANDIDATE REGISTER ────────────────────────────
 * ⚠ The AXIS ROSTER, the pole pairings, the expression-word assignments, the six
 * minted words, the seven neutral-pool reassignments, the level words and every
 * per-axis lean below are the chair's DRAFT for the owner's pen
 * (docs/briefs/W-REGISTERS-PACK.md Register I; DESIGN_W_LIVES §11). Nothing here
 * is frozen and nothing freezes without the owner's signature (the tuning
 * carve-out, ODQ §763). The VERBATIM legacy columns are the sole exception: those
 * are measured transcriptions of shipped values, not taste. The catalog's SHAPE is
 * built so the pen can re-word any row without code surgery — words are data, the
 * readers key off them, and no consumer branches on a specific word's spelling.
 *
 * PURE + DEPENDENCY-FREE: this file imports NOTHING (the deityConstants.js /
 * npcTraitWeights.js true-leaf idiom), so a later car may hand it to the EAGER
 * first-paint consumers (corruption.js reads TRAIT_ALIGNMENT today) without
 * dragging a closure behind it. Never add an import here.
 *
 * @see docs/DESIGN_W_LIVES.md §1, §15 (the panel fold OUTRANKS §1)
 * @see docs/briefs/W-REGISTERS-PACK.md Register I + II
 * @see docs/OWNER_DECISION_QUEUE.md §800.2, §800.4, §806
 */

/**
 * Provenance of the candidate register, carried in the module so a reader who
 * arrives at the code before the docs learns the signature status here.
 * @type {Readonly<{ status: string, signedBy: string|null, source: string, ruling: string, consumers: string }>}
 */
// NOTE for a later editor: the values below are plain string literals inside
// src/domain, so they are scanned by tests/copy/voiceMechanics.test.js and may
// carry neither an em-dash nor an exclamation mark. Keep the punctuation flat.
export const CATALOG_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (words and leans are drafts; legacy columns are measured)',
  signedBy: null,
  source: 'docs/briefs/W-REGISTERS-PACK.md Register I (chair draft, 2026-08-30)',
  ruling: 'ODQ 806 F1/F2: consolidation, not derivation; corruptibility is per-word',
  consumers: 'NONE by design; car L1 lands dark, car L5 re-points consumers',
});

/** Band words per side, ascending. Candidate (pack Register II / taste row 11).
 *  `neutral` is the center, so the nominal ladder is 7 bands wide per axis.
 * @type {readonly string[]} */
export const AXIS_LEVELS = Object.freeze(['a_touch', 'marked', 'defining']);

/** The level a bare legacy word reads as (DESIGN_W_LIVES §2's tolerant reader).
 *  Undrifted, a word at this level projects back to the IDENTICAL word. */
export const LEGACY_WORD_LEVEL = 'marked';

/** @typedef {'virtue'|'vice'} AxisPole */

/**
 * @typedef {Object} AxisSide
 * @property {string} word         the pole word (the canonical name of the side)
 * @property {readonly string[]} expressions  sibling words that read as the SAME side
 * @property {boolean} minted      true ⇒ the pole word is NOT in any live pool (needs the pen)
 */

/**
 * @typedef {Object} ParadigmAxis
 * @property {string} id                       stable codepoint-sortable axis id
 * @property {AxisSide} virtue
 * @property {AxisSide} vice
 * @property {{ e: number, c: number }|null} planeLean   drift-only; null ⇒ awaiting the pen
 * @property {number|null} aggressionLean                drift-only; null ⇒ awaiting the pen
 * @property {string|null} corruptionVector              DRIFTED vices only (F2)
 * @property {boolean} ownerRulingPending      true ⇒ the axis's existence is itself a queued call
 */

/**
 * THE CANDIDATE AXIS REGISTER — 17 axes (pack Register I).
 *
 * `planeLean` / `aggressionLean` are the DRIFT-ONLY leans, and each is the VICE
 * POLE WORD's own legacy column where the legacy tables scored that word, `null`
 * where they did not. That rule is mechanical, not taste — it is pinned — so the
 * draft invents no number the shipped tables do not already contain. A `null` lean
 * is an honest gap awaiting the owner's pen, never a zero: five axes
 * (FIDELITY, INDUSTRY, TEMPERANCE, CONTENT, DEVOTION) have no scored vice pole at
 * all, and several more are scored on only one of the two columns.
 *
 * `corruptionVector` is the vector a DRIFTED vice on this axis would carry. It is
 * drawn from the FLAW_VECTOR values the axis's own vice-side words already hold,
 * and is `null` on the ten axes whose vice side no legacy flaw column touches —
 * i.e. drifted-vice corruption reaches 7 of 17 axes under today's data. That gap
 * is a finding for owner row 13(a), not a defect to paper over here.
 *
 * @type {readonly ParadigmAxis[]}
 */
export const PARADIGM_AXES = Object.freeze([
  Object.freeze({
    id: 'CANDOR',
    virtue: Object.freeze({ word: 'honest', expressions: Object.freeze(['forthright', 'candid', 'plain-dealing']), minted: false }),
    vice: Object.freeze({ word: 'deceitful', expressions: Object.freeze(['mendacious', 'manipulative']), minted: false }),
    planeLean: Object.freeze({ e: 0.6, c: 0.5 }),
    aggressionLean: null,
    corruptionVector: 'forbidden_patron',
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'MERCY',
    virtue: Object.freeze({ word: 'compassionate', expressions: Object.freeze(['merciful', 'warm-hearted']), minted: false }),
    vice: Object.freeze({ word: 'cruel', expressions: Object.freeze(['callous', 'cold-blooded', 'ruthless']), minted: false }),
    planeLean: Object.freeze({ e: 0.85, c: 0 }),
    aggressionLean: 0.9,
    corruptionVector: 'greed',
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'COURAGE',
    virtue: Object.freeze({ word: 'brave', expressions: Object.freeze(['stalwart']), minted: false }),
    vice: Object.freeze({ word: 'cowardly', expressions: Object.freeze([]), minted: false }),
    planeLean: null,
    aggressionLean: null,
    corruptionVector: 'fear',
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'TEMPER',
    virtue: Object.freeze({ word: 'patient', expressions: Object.freeze(['level-headed', 'unflappable']), minted: false }),
    vice: Object.freeze({ word: 'wrathful', expressions: Object.freeze(['volatile']), minted: false }),
    planeLean: Object.freeze({ e: 0.5, c: 0.3 }),
    aggressionLean: 0.8,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'GENEROSITY',
    virtue: Object.freeze({ word: 'generous', expressions: Object.freeze(['magnanimous', 'hospitable']), minted: false }),
    vice: Object.freeze({ word: 'greedy', expressions: Object.freeze(['self-serving']), minted: false }),
    planeLean: Object.freeze({ e: 0.55, c: 0.2 }),
    aggressionLean: null,
    corruptionVector: 'greed',
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'HUMILITY',
    virtue: Object.freeze({ word: 'humble', expressions: Object.freeze(['gracious']), minted: false }),
    // `proud` is one of the seven neutral-pool reassignments (pack Register I †).
    vice: Object.freeze({ word: 'arrogant', expressions: Object.freeze(['vain', 'imperious', 'proud']), minted: false }),
    planeLean: null,
    aggressionLean: 0.4,
    corruptionVector: 'hunger_for_status',
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'FIDELITY',
    virtue: Object.freeze({ word: 'loyal', expressions: Object.freeze(['dependable', 'steadfast']), minted: false }),
    // MINT: the pools carry no treacherous pole for `loyal` (the orphan §800.2 named).
    vice: Object.freeze({ word: 'treacherous', expressions: Object.freeze(['mercurial']), minted: true }),
    planeLean: null,
    aggressionLean: null,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'INDUSTRY',
    virtue: Object.freeze({ word: 'diligent', expressions: Object.freeze(['conscientious', 'tenacious']), minted: false }),
    vice: Object.freeze({ word: 'lazy', expressions: Object.freeze([]), minted: false }),
    planeLean: null,
    aggressionLean: null,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'JUSTICE',
    virtue: Object.freeze({ word: 'principled', expressions: Object.freeze(['fair-minded', 'equitable', 'incorruptible']), minted: false }),
    vice: Object.freeze({ word: 'corrupt', expressions: Object.freeze(['hypocritical', 'petty']), minted: false }),
    planeLean: Object.freeze({ e: 0.8, c: 0.4 }),
    aggressionLean: null,
    corruptionVector: 'greed',
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'PRUDENCE',
    virtue: Object.freeze({ word: 'prudent', expressions: Object.freeze(['cautious']), minted: false }),
    vice: Object.freeze({ word: 'reckless', expressions: Object.freeze([]), minted: false }),
    planeLean: Object.freeze({ e: 0.1, c: 0.6 }),
    aggressionLean: 0.5,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'TRUST',
    // MINT: the pools carry `paranoid`/`suspicious` but no positive pole.
    virtue: Object.freeze({ word: 'trusting', expressions: Object.freeze([]), minted: true }),
    vice: Object.freeze({ word: 'paranoid', expressions: Object.freeze(['suspicious']), minted: false }),
    planeLean: Object.freeze({ e: 0.15, c: 0.2 }),
    aggressionLean: null,
    corruptionVector: 'fear',
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'CHEER',
    virtue: Object.freeze({ word: 'optimistic', expressions: Object.freeze(['good-humoured']), minted: false }),
    vice: Object.freeze({ word: 'bitter', expressions: Object.freeze(['melancholic', 'brooding']), minted: false }),
    planeLean: null,
    aggressionLean: 0.3,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'FORBEARANCE',
    // MINT: `vengeful`/`vindictive` have no positive pole in the pools.
    virtue: Object.freeze({ word: 'forgiving', expressions: Object.freeze([]), minted: true }),
    vice: Object.freeze({ word: 'vengeful', expressions: Object.freeze(['vindictive']), minted: false }),
    planeLean: Object.freeze({ e: 0.55, c: 0.2 }),
    aggressionLean: 0.75,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'PROTECTION',
    virtue: Object.freeze({ word: 'protective', expressions: Object.freeze(['courteous']), minted: false }),
    vice: Object.freeze({ word: 'domineering', expressions: Object.freeze(['overbearing', 'dismissive']), minted: false }),
    planeLean: null,
    aggressionLean: 0.7,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'TEMPERANCE',
    virtue: Object.freeze({ word: 'temperate', expressions: Object.freeze([]), minted: false }),
    // MINT: `hedonistic` sits in the neutral pool with no vice pole of its own.
    vice: Object.freeze({ word: 'indulgent', expressions: Object.freeze(['hedonistic']), minted: true }),
    planeLean: null,
    aggressionLean: null,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'CONTENT',
    // MINT: `envious` has no positive pole in the pools.
    virtue: Object.freeze({ word: 'contented', expressions: Object.freeze([]), minted: true }),
    vice: Object.freeze({ word: 'envious', expressions: Object.freeze([]), minted: false }),
    planeLean: null,
    aggressionLean: null,
    corruptionVector: null,
    ownerRulingPending: false,
  }),
  Object.freeze({
    id: 'DEVOTION',
    virtue: Object.freeze({ word: 'pious', expressions: Object.freeze(['zealous']), minted: false }),
    // CONDITIONAL MINT — and the axis itself is an open owner ruling: DEVOTION may
    // be a character axis, or piety may stay the faith system's RELATIONSHIP and
    // leave the chart entirely (pack Register I row 17 / taste row 4).
    vice: Object.freeze({ word: 'worldly', expressions: Object.freeze([]), minted: true }),
    planeLean: null,
    aggressionLean: null,
    corruptionVector: null,
    ownerRulingPending: true,
  }),
]);

/**
 * @typedef {Object} TraitColumns
 * @property {{ e: number, c: number }|null} plane  verbatim TRAIT_PLANE row, null ⇒ absent there
 * @property {number|null} alignment                verbatim TRAIT_ALIGNMENT weight, null ⇒ absent
 * @property {number|null} aggression               verbatim TRAIT_AGGRESSION weight, null ⇒ absent
 * @property {string|null} corrupts                 verbatim FLAW_VECTOR vector, null ⇒ not corruptible
 */

/**
 * THE VERBATIM LEGACY COLUMNS — the consolidation itself (F1/F2).
 *
 * One row per word in the UNION of the four shipped tables (67 words), each cell
 * transcribed EXACTLY from its source. `null` means "absent from that table",
 * which is NOT the same as zero and must never be flattened into one: TRAIT_PLANE
 * carries `disciplined: { e: 0, c: -0.7 }` — an explicit zero — while
 * TRAIT_AGGRESSION has no `disciplined` key at all, and the two behave
 * identically only by accident of arithmetic. The derived views below rebuild each
 * table by omitting exactly the nulls, and the reproduce-exactly pins compare both
 * ways (a key here that the table lacks reds, and a table key missing here reds).
 *
 *   plane      ← src/domain/worldPulse/clergyTraitPlane.js  TRAIT_PLANE      (44 keys)
 *   alignment  ← src/data/npcTraitWeights.js                TRAIT_ALIGNMENT  (40 keys)
 *   aggression ← src/data/npcTraitWeights.js                TRAIT_AGGRESSION (36 keys)
 *   corrupts   ← src/domain/corruption.js                   FLAW_VECTOR      (17 keys)
 *
 * ⚠ NINE of these words are in NO live personality pool and so can never be drawn
 * by the generator: capricious, disciplined, dutiful, erratic, impulsive, orderly,
 * rebellious, rigid, traditional (all TRAIT_PLANE-only). They are carried verbatim
 * regardless, because byte-identity is a property of the TABLE, not of the words
 * the corpus happens to reach — a table key the corpus never produces still reads
 * clean on every census that only walks generated NPCs.
 *
 * @type {Readonly<Record<string, TraitColumns>>}
 */
export const TRAIT_COLUMNS = Object.freeze({
  ambitious: { plane: { e: 0.2, c: 0.15 }, alignment: null, aggression: 0.3, corrupts: 'hunger_for_status' },
  arrogant: { plane: null, alignment: null, aggression: 0.4, corrupts: null },
  bitter: { plane: null, alignment: null, aggression: 0.3, corrupts: null },
  brave: { plane: null, alignment: 0.35, aggression: null, corrupts: null },
  calculating: { plane: { e: 0.25, c: -0.3 }, alignment: null, aggression: null, corrupts: 'hunger_for_status' },
  callous: { plane: { e: 0.6, c: 0 }, alignment: -0.7, aggression: 0.7, corrupts: 'greed' },
  capricious: { plane: { e: 0.15, c: 0.6 }, alignment: null, aggression: null, corrupts: null },
  cautious: { plane: null, alignment: null, aggression: -0.25, corrupts: null },
  'cold-blooded': { plane: { e: 0.85, c: -0.2 }, alignment: -0.9, aggression: 0.9, corrupts: 'greed' },
  compassionate: { plane: { e: -0.85, c: 0 }, alignment: 0.85, aggression: -0.8, corrupts: null },
  contrarian: { plane: null, alignment: null, aggression: 0.2, corrupts: null },
  corrupt: { plane: { e: 0.8, c: 0.4 }, alignment: -0.85, aggression: null, corrupts: 'greed' },
  cowardly: { plane: null, alignment: null, aggression: null, corrupts: 'fear' },
  cruel: { plane: { e: 0.85, c: 0 }, alignment: -0.9, aggression: 0.9, corrupts: null },
  cynical: { plane: null, alignment: -0.2, aggression: 0.15, corrupts: 'forbidden_patron' },
  deceitful: { plane: { e: 0.6, c: 0.5 }, alignment: -0.7, aggression: null, corrupts: 'forbidden_patron' },
  diplomatic: { plane: null, alignment: null, aggression: -0.8, corrupts: null },
  disciplined: { plane: { e: 0, c: -0.7 }, alignment: null, aggression: null, corrupts: null },
  domineering: { plane: null, alignment: -0.45, aggression: 0.7, corrupts: null },
  dutiful: { plane: { e: -0.15, c: -0.7 }, alignment: null, aggression: null, corrupts: null },
  erratic: { plane: { e: 0, c: 0.6 }, alignment: null, aggression: null, corrupts: null },
  'fair-minded': { plane: { e: -0.55, c: -0.4 }, alignment: 0.7, aggression: -0.55, corrupts: null },
  forthright: { plane: { e: -0.45, c: -0.2 }, alignment: 0.6, aggression: null, corrupts: null },
  generous: { plane: { e: -0.6, c: 0 }, alignment: 0.7, aggression: -0.6, corrupts: null },
  greedy: { plane: { e: 0.55, c: 0.2 }, alignment: -0.6, aggression: null, corrupts: 'greed' },
  hedonistic: { plane: null, alignment: -0.25, aggression: null, corrupts: null },
  honest: { plane: { e: -0.6, c: -0.3 }, alignment: 0.75, aggression: null, corrupts: null },
  humble: { plane: { e: -0.35, c: 0 }, alignment: 0.45, aggression: -0.5, corrupts: null },
  hypocritical: { plane: { e: 0.45, c: 0.35 }, alignment: -0.5, aggression: null, corrupts: null },
  idealistic: { plane: null, alignment: 0.3, aggression: null, corrupts: null },
  imperious: { plane: null, alignment: -0.4, aggression: 0.65, corrupts: null },
  impulsive: { plane: { e: 0, c: 0.55 }, alignment: null, aggression: null, corrupts: null },
  incorruptible: { plane: { e: -0.9, c: -0.4 }, alignment: 1, aggression: null, corrupts: null },
  'level-headed': { plane: null, alignment: null, aggression: -0.5, corrupts: null },
  loyal: { plane: { e: -0.3, c: -0.45 }, alignment: 0.4, aggression: -0.2, corrupts: null },
  magnanimous: { plane: { e: -0.65, c: 0 }, alignment: 0.75, aggression: -0.7, corrupts: null },
  manipulative: { plane: { e: 0.6, c: 0.3 }, alignment: -0.7, aggression: null, corrupts: 'forbidden_patron' },
  mendacious: { plane: { e: 0.55, c: 0.45 }, alignment: -0.65, aggression: null, corrupts: 'forbidden_patron' },
  merciful: { plane: { e: -0.85, c: 0 }, alignment: 0.85, aggression: -0.85, corrupts: null },
  methodical: { plane: { e: 0, c: -0.6 }, alignment: null, aggression: null, corrupts: null },
  opportunistic: { plane: { e: 0.3, c: 0.4 }, alignment: -0.3, aggression: 0.25, corrupts: 'hunger_for_status' },
  orderly: { plane: { e: 0, c: -0.65 }, alignment: null, aggression: null, corrupts: null },
  overbearing: { plane: null, alignment: null, aggression: 0.65, corrupts: null },
  paranoid: { plane: { e: 0.15, c: 0.2 }, alignment: null, aggression: null, corrupts: 'fear' },
  patient: { plane: { e: -0.2, c: -0.2 }, alignment: 0.3, aggression: -0.55, corrupts: null },
  petty: { plane: null, alignment: -0.3, aggression: null, corrupts: null },
  pious: { plane: { e: -0.4, c: -0.3 }, alignment: 0.5, aggression: null, corrupts: null },
  pragmatic: { plane: null, alignment: -0.1, aggression: null, corrupts: null },
  principled: { plane: { e: -0.6, c: -0.5 }, alignment: 0.8, aggression: -0.4, corrupts: null },
  protective: { plane: { e: -0.35, c: -0.2 }, alignment: 0.45, aggression: -0.3, corrupts: null },
  proud: { plane: null, alignment: null, aggression: 0.15, corrupts: null },
  rebellious: { plane: { e: 0.1, c: 0.7 }, alignment: null, aggression: null, corrupts: null },
  reckless: { plane: { e: 0.1, c: 0.6 }, alignment: null, aggression: 0.5, corrupts: null },
  reserved: { plane: null, alignment: null, aggression: -0.15, corrupts: null },
  rigid: { plane: { e: 0, c: -0.45 }, alignment: null, aggression: null, corrupts: null },
  ruthless: { plane: { e: 0.8, c: 0 }, alignment: -0.85, aggression: 0.85, corrupts: 'greed' },
  'self-serving': { plane: { e: 0.5, c: 0.25 }, alignment: -0.55, aggression: 0.35, corrupts: 'greed' },
  stoic: { plane: null, alignment: 0.1, aggression: null, corrupts: null },
  suspicious: { plane: null, alignment: null, aggression: null, corrupts: 'fear' },
  traditional: { plane: { e: 0, c: -0.5 }, alignment: null, aggression: null, corrupts: null },
  vain: { plane: null, alignment: null, aggression: null, corrupts: 'hunger_for_status' },
  vengeful: { plane: { e: 0.55, c: 0.2 }, alignment: -0.65, aggression: 0.75, corrupts: null },
  vindictive: { plane: { e: 0.6, c: 0.2 }, alignment: -0.7, aggression: 0.75, corrupts: null },
  volatile: { plane: null, alignment: null, aggression: 0.55, corrupts: null },
  'warm-hearted': { plane: { e: -0.55, c: 0 }, alignment: 0.65, aggression: -0.6, corrupts: null },
  wrathful: { plane: { e: 0.5, c: 0.3 }, alignment: -0.65, aggression: 0.8, corrupts: null },
  zealous: { plane: null, alignment: -0.2, aggression: 0.4, corrupts: null },
});

/**
 * CAPABILITIES — gifts, not moral spectra. War does not make a person less clever;
 * it makes them less merciful. These sit OUTSIDE the chart and drift never touches
 * them, but where one carries a legacy weight (`diplomatic` is −0.8 pacific in
 * TRAIT_AGGRESSION) that weight is preserved verbatim in TRAIT_COLUMNS as a STATIC
 * MODIFIER LEAN. That preservation is a byte-identity requirement, not a choice.
 * @type {readonly string[]}
 */
export const CAPABILITY_WORDS = Object.freeze([
  'wise', 'clever', 'resourceful', 'scholarly', 'charismatic',
  'intuitive', 'perceptive', 'astute', 'discerning', 'diplomatic',
]);

/**
 * MANNER / STANCE MODIFIERS — outside the chart, static leans where the legacy
 * tables carry them. `ambitious` additionally feeds the risk register's CENTRE
 * (ODQ §803.1 R6) at car L5. `stubborn` is unhomed by the volume and is an open
 * owner call (PRUDENCE-vice expression, or a modifier as drafted here — taste
 * row 5). `methodical` is dispositioned here as a modifier per the pack, and is
 * the one word that appears in TWO live pools — see POOL_DUPLICATE_WORDS.
 * @type {readonly string[]}
 */
export const MODIFIER_WORDS = Object.freeze([
  'pragmatic', 'ambitious', 'calculating', 'secretive', 'eccentric', 'stoic',
  'cynical', 'reserved', 'methodical', 'traditionalist', 'iconoclast',
  'opportunistic', 'perfectionist', 'fatalistic', 'idealistic', 'detached',
  'inscrutable', 'superstitious', 'theatrical', 'nostalgic', 'contrarian',
  'restless', 'obsessive', 'stubborn',
]);

/**
 * Legacy-table keys that belong to NO live personality pool and to no axis — the
 * generator cannot draw them and the pen never sees them, yet every one carries a
 * shipped TRAIT_PLANE row that must survive the consolidation verbatim. Declared
 * explicitly so this stays an inventory a walker can ratchet rather than a silent
 * residue: a future car that adds a tenth such key has to say so here.
 * @type {readonly string[]}
 */
export const UNPOOLED_LEGACY_WORDS = Object.freeze([
  'capricious', 'disciplined', 'dutiful', 'erratic', 'impulsive',
  'orderly', 'rebellious', 'rigid', 'traditional',
]);

/**
 * ⚠ THE ONE LIVE POOL DUPLICATION, MEASURED AND DELIBERATELY LEFT ALONE.
 * `methodical` sits in BOTH the positive (index 21) and the neutral (index 11)
 * arrays of NPC_PERSONALITY_TRAITS (src/data/npcData.js:100, :174). Car L1's brief
 * permits a dedup ONLY if it costs no behaviour. It costs behaviour three
 * independent ways, any one of which is disqualifying — measured, not assumed:
 *
 *   1. THE DRAW IS LENGTH-INDEXED. `pick(arr)` is `arr[floor(roll * arr.length)]`
 *      (src/kernel/rngContext.js:117), consumed at npcGenerator.js:316/:317/:318.
 *      Dropping an entry takes positive 45→44 or neutral 30→29 and REMAPS the
 *      index for nearly every seed, so the 525-row committed manifest behind
 *      tests/property/generatorGoldenMaster.test.js re-hashes almost entirely.
 *      That is a declared golden SHIFT, never a free edit. The positive removal
 *      would additionally shift the second seeded draw at npcOps.js:223.
 *   2. IT WOULD BREAK SAVE COMPATIBILITY. Mirroring a positive-pool removal into
 *      NPC_TEMPERAMENTS (the LOCKSTEP law, ODQ §806 F15) flips
 *      `isBankValid('temperament', 'methodical')` from true to false, so an
 *      already-stored facet or a queued edit carrying it is REJECTED at
 *      pendingEditIntents.js:629 and settlementPendingEditWriters.js:83.
 *   3. IT WOULD HALF-KILL A LIVE WEIGHT. `TRAIT_PLANE.methodical { e: 0, c: -0.6 }`
 *      is scored from the `dominant`, `flaw` AND `modifier` slots alike
 *      (clergyTraitPlane.js:108, :122), so the word reaches the plane through
 *      EITHER pool; removing it from one halves that lawful-lean signal.
 *
 * The dedup is therefore an OWNER ROW, not a lane call, and it joins the standing
 * deferral already recorded at docs/GENERATION_TIME_SHIFT_MAP_DOSSIER.md:132-136.
 * Declared here so it is never re-found as an undiscovered bug.
 * @type {readonly string[]}
 */
export const POOL_DUPLICATE_WORDS = Object.freeze(['methodical']);

// ── Readers ────────────────────────────────────────────────────────────────────

/** Normalize a descriptor exactly as every legacy consumer does (trim + lowercase),
 *  so a catalog lookup can never disagree with a table lookup about a key.
 * @param {unknown} word @returns {string} */
function normalizeWord(word) {
  return typeof word === 'string' ? word.trim().toLowerCase() : '';
}

/** The axis with this id, or null.
 * @param {unknown} axisId @returns {ParadigmAxis|null} */
export function axisById(axisId) {
  const id = typeof axisId === 'string' ? axisId : '';
  for (const axis of PARADIGM_AXES) if (axis.id === id) return axis;
  return null;
}

/** The verbatim legacy columns for a word, or null when no shipped table scores it.
 * @param {unknown} word @returns {TraitColumns|null} */
export function traitColumns(word) {
  const key = normalizeWord(word);
  return key && Object.prototype.hasOwnProperty.call(TRAIT_COLUMNS, key)
    ? TRAIT_COLUMNS[key]
    : null;
}

// ── The reproduce-exactly views ────────────────────────────────────────────────
// Each rebuilds ONE shipped table from the consolidated columns. They exist to be
// PINNED against their originals, not to be consumed: the legacy tables remain
// authoritative at their own homes through car L4, and car L5 owns the inversion.
// ⚠ These return FRESH objects, never the frozen originals — a caller must not
// mistake one for the live table.

/** @returns {Record<string, { e: number, c: number }>} rebuild of TRAIT_PLANE */
export function derivedTraitPlane() {
  /** @type {Record<string, { e: number, c: number }>} */
  const out = {};
  for (const [word, col] of Object.entries(TRAIT_COLUMNS)) {
    if (col.plane) out[word] = { e: col.plane.e, c: col.plane.c };
  }
  return out;
}

/** @returns {Record<string, number>} rebuild of TRAIT_ALIGNMENT */
export function derivedTraitAlignment() {
  /** @type {Record<string, number>} */
  const out = {};
  for (const [word, col] of Object.entries(TRAIT_COLUMNS)) {
    if (col.alignment !== null) out[word] = col.alignment;
  }
  return out;
}

/** @returns {Record<string, number>} rebuild of TRAIT_AGGRESSION */
export function derivedTraitAggression() {
  /** @type {Record<string, number>} */
  const out = {};
  for (const [word, col] of Object.entries(TRAIT_COLUMNS)) {
    if (col.aggression !== null) out[word] = col.aggression;
  }
  return out;
}

/** @returns {Record<string, string>} rebuild of corruption.js's FLAW_VECTOR.
 *  ⚠ KEY ORDER IS NOT CLAIMED, AND ONE SITE OBSERVES IT. `CORRUPTIBLE_FLAWS` is
 *  `Object.keys(FLAW_VECTOR)` (corruption.js:53) and is indexed positionally at
 *  tests/domain/roadsState.test.js:124 (`CORRUPTIBLE_FLAWS[0]`). This view is
 *  therefore pinned as a SET with equal values, both ways — never as a sequence.
 *  Car L5 must settle the order question before re-pointing any consumer that
 *  ITERATES the list rather than looking a key up; every src consumer measured at
 *  this tip looks up (roadsKernel.js:79 is the only src reader of the list). */
export function derivedFlawVector() {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [word, col] of Object.entries(TRAIT_COLUMNS)) {
    if (col.corrupts !== null) out[word] = col.corrupts;
  }
  return out;
}

// ── The legacy word ↔ (axis, pole, level) round trip ───────────────────────────

/**
 * @typedef {Object} AxisPosition
 * @property {string} axisId
 * @property {AxisPole} pole
 * @property {string} level  a member of AXIS_LEVELS
 * @property {string|null} word  the EXACT source word when the position came from
 *   one; null for a position that was drifted or authored onto the axis directly
 */

/**
 * Read a flat legacy personality word as a leveled axis position — the tolerant
 * reader of DESIGN_W_LIVES §2. Every word gets the default level, and the source
 * word is carried so the projection back is lossless.
 * @param {unknown} word @returns {AxisPosition|null} null ⇒ the word is not axis-homed
 */
export function axisPositionForWord(word) {
  const key = normalizeWord(word);
  if (!key) return null;
  for (const axis of PARADIGM_AXES) {
    if (axis.virtue.word === key || axis.virtue.expressions.includes(key)) {
      return { axisId: axis.id, pole: 'virtue', level: LEGACY_WORD_LEVEL, word: key };
    }
    if (axis.vice.word === key || axis.vice.expressions.includes(key)) {
      return { axisId: axis.id, pole: 'vice', level: LEGACY_WORD_LEVEL, word: key };
    }
  }
  return null;
}

/**
 * Project an axis position back to a word. A position that still carries its
 * source word projects to the IDENTICAL word — that is the byte-identity anchor:
 * an undrifted legacy NPC reads out exactly the string it read in, at every
 * existing seam. A drifted or freshly authored position (word === null, or a word
 * that no longer belongs to that side) falls back to the side's POLE word, which
 * is the canonical name of the side at any level.
 * @param {AxisPosition|null|undefined} position @returns {string|null}
 */
export function wordForAxisPosition(position) {
  if (!position) return null;
  const axis = axisById(position.axisId);
  if (!axis) return null;
  const side = position.pole === 'vice' ? axis.vice : position.pole === 'virtue' ? axis.virtue : null;
  if (!side) return null;
  const carried = normalizeWord(position.word);
  if (carried && (side.word === carried || side.expressions.includes(carried))) return carried;
  return side.word;
}

/** Every word the chart homes, in axis order then virtue-before-vice then
 *  pole-before-expressions — a stable total order for censuses and walkers.
 * @returns {string[]} */
export function axisHomedWords() {
  /** @type {string[]} */
  const out = [];
  for (const axis of PARADIGM_AXES) {
    out.push(axis.virtue.word, ...axis.virtue.expressions);
    out.push(axis.vice.word, ...axis.vice.expressions);
  }
  return out;
}

/** The words the chart needs that NO live pool supplies — the mints awaiting the
 *  owner's pen. They are declared in the catalog (a pole cannot be nameless) but
 *  are deliberately NOT added to any pool: a pool edit moves the LOCKSTEP mirror
 *  and, worse, changes a seeded draw array's length. @returns {string[]} */
export function mintedWords() {
  /** @type {string[]} */
  const out = [];
  for (const axis of PARADIGM_AXES) {
    if (axis.virtue.minted) out.push(axis.virtue.word);
    if (axis.vice.minted) out.push(axis.vice.word);
  }
  return out;
}
