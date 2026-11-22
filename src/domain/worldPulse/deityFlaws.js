/**
 * domain/worldPulse/deityFlaws.js — THE VICE-POLE FLAW REGISTER (W-FAITH F5c).
 *
 * ⛔ THERE IS NO `flaw` FIELD, AND THAT IS THE LAW THIS FILE IS BUILT UNDER.
 * DESIGN_W_FAITH §D2's standalone flaw vocabulary is SUPERSEDED by DESIGN_W_LIVES §6
 * (ODQ §800.3 J2): a deity's flaws ARE its vice-pole positions on the shared paradigm
 * chart, authored as `characterAxes` tokens (`AXIS:pole:level`, W-FAITH F1c). What
 * survives of D2 is its MODULATION HOOKS, attached here to vice poles: a flaw
 * modulates the deity's OWN channels and never mints a new world channel — the D2
 * judgment the supersession explicitly kept alive.
 *
 * TWO MODULATIONS EXIST, AND THEY ARE EXACTLY THE TWO THE CHARTER ANCHORS
 * (the F5c packet row's own examples):
 *
 *   • JEALOUS (CONTENT vice, envious) — the boon weakens as pantheon share is
 *     contested. READS: the religion state's own adherent shares. Applied inside
 *     `faithField.js`'s term fold, INSIDE the gated product, so a magic-dead world's
 *     zero stays exactly zero.
 *   • WRATHFUL (TEMPER vice) — the temper pull sharpens while faith fortunes fall.
 *     READS: the per-deity pantheon ledger (`worldState.pantheon[ref]`, wins/losses).
 *     Applied in `faithWitnessSource.js` as a reduction of the exposure DEMOTION on
 *     that one pull — never past the authored ceiling (the ladder only steps down).
 *
 * ⛔ NO FLAW INVENTS A NEW ENGINE QUANTITY (§851's shape). The whole layer reads two
 * quantities that already exist — share and fortunes — and writes nothing new. The
 * remaining register rows below are VOCABULARY, not mechanics: `capricious` is
 * declared dormant with its measured reason, four words are homed candidates with no
 * chartered mechanics, and `meddling` is honestly unhomed. The partition test asserts
 * every row is exactly one of these, both ways, so a row cannot go silently inert.
 *
 * VOCABULARY MIRRORS, not imports: the axis ids and level words below restate the
 * closed vocabularies whose homes are `src/domain/npc/paradigmAxisCatalog.js` and
 * `customContentSchema.js`. The catalog is a large pure table this pulse leaf must
 * not haul into its closure (the `faithField.js` mirror discipline, F1c/F2c/F3c);
 * the drift guard in `tests/domain/deityFlaws.test.js` pins every mirrored word to
 * both sources.
 *
 * PURE + rng-free + store-blind: imports only `kernel/math` and the tuning surface,
 * which itself imports nothing. A variance-shaped modulation (capricious) is
 * therefore NOT CONSTRUCTIBLE here, which is why its row is declared dormant rather
 * than approximated.
 */
import { clamp01 } from '../../kernel/math.js';
import { DEITY_FLAW_TUNING } from './faithTuningSurface.js';

/**
 * Provenance of the candidate register, carried in the module so a reader who
 * arrives at the code before the docs learns the signature status here (the
 * paradigmAxisCatalog CATALOG_PROVENANCE idiom).
 * NOTE for a later editor: plain string literals inside src/domain are scanned by
 * tests/copy/voiceMechanics.test.js. Keep the punctuation flat.
 * @type {Readonly<{ status: string, signedBy: string|null, source: string, ruling: string, consumers: string }>}
 */
export const DEITY_FLAW_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (the D2 flaw words are drafts mapped onto the chart; frozen only by the owner pen)',
  signedBy: null,
  source: 'DESIGN_W_FAITH D2 candidates, as superseded by DESIGN_W_LIVES 6 (ODQ 800.3 J2)',
  ruling: 'ODQ 800.3 J2: flaws are vice-pole positions on the shared chart; the D2 modulation hooks survive, attached to vice poles',
  consumers: 'faithField.js (jealous boon fade), faithWitnessSource.js (wrathful pull sharpening)',
});

/** The level words per axis side, ascending. MIRROR of `paradigmAxisCatalog.AXIS_LEVELS`
 *  and `customContentSchema.DEITY_AXIS_LEVELS`; pinned to both in the drift guard.
 * @type {readonly string[]} */
export const DEITY_FLAW_LEVELS = Object.freeze(['a_touch', 'marked', 'defining']);

/**
 * @typedef {Object} DeityFlawRow
 * @property {string} word       the D2 candidate flaw word (owner-taste, unsigned)
 * @property {string|null} axisId    its chart home, null when no vice pole names it
 * @property {string|null} mappedTo  the catalog word on that axis's vice side it reads as
 * @property {'modulates'|'declared_dormant'|'vocabulary_only'|'unhomed'} mechanics
 * @property {string} note       why the row has the mechanics status it has
 */

/**
 * THE REGISTER — D2's eight candidate words, each dispositioned onto the chart.
 * The `mappedTo` words are the §800.3 J2 mapping where the ruling names one, and the
 * catalog's own vice-side words where it does not; every homed row's word is proven
 * against the catalog by the drift guard, so a re-worded axis cannot strand a row.
 * @type {readonly DeityFlawRow[]}
 */
export const DEITY_FLAWS = Object.freeze([
  Object.freeze({
    word: 'jealous', axisId: 'CONTENT', mappedTo: 'envious', mechanics: 'modulates',
    note: 'The packet-anchored modulation: the boon weakens as pantheon share is contested. Reads the religion state shares only.',
  }),
  Object.freeze({
    word: 'wrathful', axisId: 'TEMPER', mappedTo: 'wrathful', mechanics: 'modulates',
    note: 'The packet-anchored modulation: the temper pull sharpens while faith fortunes fall. Reads the pantheon ledger wins and losses only.',
  }),
  Object.freeze({
    word: 'capricious', axisId: 'TEMPER', mappedTo: 'volatile', mechanics: 'declared_dormant',
    note: 'D2 chartered variance, not mean: the boon and bane magnitude band widens. A variance needs a seeded draw, and the field kernel is pure and rng-free by fence; a deterministic widening would move the MEAN, which is the opposite of the charter. Declared dormant rather than approximated; the disposition is an owner row.',
  }),
  Object.freeze({
    word: 'covetous', axisId: 'GENEROSITY', mappedTo: 'greedy', mechanics: 'vocabulary_only',
    note: 'Homed by ODQ 800.3 J2 (covetous reads as greedy). No mechanics were chartered for this word; minting one is the pen taste, not a lane call.',
  }),
  Object.freeze({
    word: 'proud', axisId: 'HUMILITY', mappedTo: 'proud', mechanics: 'vocabulary_only',
    note: 'Homed by ODQ 800.3 J2 (proud reads as arrogant; the catalog carries proud as an expression on that side). No mechanics were chartered.',
  }),
  Object.freeze({
    word: 'fickle', axisId: 'FIDELITY', mappedTo: 'mercurial', mechanics: 'vocabulary_only',
    note: 'The catalog vice side carries mercurial; DESIGN_W_LIVES 1.1 row 7 lists fickle as a candidate expression awaiting the pen. Read as mercurial until the owner signs the word set. No mechanics were chartered.',
  }),
  Object.freeze({
    word: 'brooding', axisId: 'CHEER', mappedTo: 'brooding', mechanics: 'vocabulary_only',
    note: 'The catalog carries brooding as an expression of bitter on CHEER. No mechanics were chartered.',
  }),
  Object.freeze({
    word: 'meddling', axisId: null, mappedTo: null, mechanics: 'unhomed',
    note: 'No vice pole on the chart names meddling. The nearest candidates (PROTECTION vice domineering, overbearing) are a taste call, not a measurement, so the row waits for the pen rather than borrowing a neighbour home.',
  }),
]);

/**
 * THE MODULATION TABLE — one row per axis that carries a live modulation, keyed by
 * AXIS ID because that is what a chart position names. Closed: the partition test
 * asserts every key here is claimed by exactly one `modulates` register row and that
 * the `reads` value names an EXISTING quantity from the closed set below.
 * @type {Readonly<Record<string, Readonly<{ flaw: string, modulates: 'boon_term'|'witness_pull', reads: 'share'|'fortunes' }>>>}
 */
export const FLAW_EFFECTS = Object.freeze({
  CONTENT: Object.freeze({ flaw: 'jealous', modulates: 'boon_term', reads: 'share' }),
  TEMPER: Object.freeze({ flaw: 'wrathful', modulates: 'witness_pull', reads: 'fortunes' }),
});

/**
 * W-FAITH F6c — THE TUNING MOVED TO THE SIGNATURE SURFACE. `DEITY_FLAW_TUNING`
 * (JEALOUS_BOON_FADE, LEVEL_SCALE, WRATH_SHARPEN_RUNGS — every one an owner-unsigned
 * candidate, §763) now lives in `faithTuningSurface.js`, the one file the owner's
 * pen edits, and is re-exported here VERBATIM — the same object, not a copy — so
 * every existing import path still resolves. The per-value derivation notes moved
 * with the numbers they explain.
 */
export { DEITY_FLAW_TUNING };

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * A deity snapshot's authored chart positions, both admitted shapes.
 * ⚠ `characterAxes` IS string-or-string-list (F1c act 1's J1 — the one embed key that
 * travels uncoerced, so a list survives as a list). Both shapes read here, exactly as
 * `faithWitnessSource.chartPositions` reads them.
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @returns {string[]}
 */
function positionsOf(snapshot) {
  const raw = snapshot?.characterAxes;
  if (typeof raw === 'string') return raw ? [raw] : [];
  if (Array.isArray(raw)) return raw.filter((t) => typeof t === 'string' && t);
  return [];
}

/**
 * The authored VICE level on one axis, or null. Set membership on every part: a
 * malformed token, a virtue pole, or a level outside the closed ladder reads as
 * ABSENT rather than being coerced into a band.
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @param {string} axisId
 * @returns {string | null} a member of DEITY_FLAW_LEVELS, or null
 */
export function viceLevelOf(snapshot, axisId) {
  for (const token of positionsOf(snapshot)) {
    const parts = token.split(':');
    if (parts.length !== 3) continue;
    if (parts[0] !== axisId || parts[1] !== 'vice') continue;
    if (!DEITY_FLAW_LEVELS.includes(parts[2])) continue;
    return parts[2];
  }
  return null;
}

/**
 * THE JEALOUS ARM — the boon scale for one deity, 0..1, IDENTITY 1 when inert.
 *
 * A deity holding a vice position on the `boon_term` modulation axis (CONTENT under
 * the candidate table: jealous, reading as envious) blesses at
 *
 *   1 − JEALOUS_BOON_FADE × LEVEL_SCALE[level] × contested01
 *
 * clamped to 0..1. `contested01` is the caller's measure of RIVAL share (the field
 * fold computes it as the other ACTIVE members' pool fraction — unbelief does not
 * contest, rival gods do). Inert cases all answer the literal 1: no positions, a
 * virtue-pole position, an unmodulated axis, or nothing contested.
 *
 * ⚠ THE SCALE MULTIPLIES THE BOON ADDEND INSIDE THE GATED PRODUCT (see
 * `faithField.aspectTerm`), so a magic-dead world's zero stays exactly zero — the
 * one-magic-gate law holds by construction, and the fence pins it.
 *
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @param {number} contested01 rival share, 0..1
 * @returns {number} 0..1, literal 1 when the modulation is inert
 */
export function jealousBoonScale01(snapshot, contested01) {
  const contested = clamp01(Number(contested01) || 0);
  if (contested === 0) return 1;
  for (const [axisId, effect] of Object.entries(FLAW_EFFECTS)) {
    if (effect.modulates !== 'boon_term') continue;
    const level = viceLevelOf(snapshot, axisId);
    if (level === null) continue;
    const depth = /** @type {Record<string, number>} */ (
      /** @type {unknown} */ (DEITY_FLAW_TUNING.LEVEL_SCALE))[level];
    return clamp01(1 - DEITY_FLAW_TUNING.JEALOUS_BOON_FADE * depth * contested);
  }
  return 1;
}

/**
 * Whether a deity's faith fortunes are FALLING, read off its pantheon-ledger entry
 * (`worldState.pantheon[ref]` — wins/losses, the per-deity instantiation of the
 * disposition ledger). The shape is the estate's own precedent:
 * `dispositionProfile.deityPressureOf` reads loss history as losses exceeding wins.
 * Absent entry, absent counts, or a level book all read as NOT falling.
 * @param {{ wins?: unknown, losses?: unknown } | null | undefined} pantheonEntry
 * @returns {boolean}
 */
export function fortunesFalling(pantheonEntry) {
  return (Number(pantheonEntry?.losses) || 0) > (Number(pantheonEntry?.wins) || 0);
}

/**
 * THE WRATHFUL ARM — the exposure demotion for ONE pull token, sharpened when the
 * token IS the deity's vice position on the `witness_pull` modulation axis (TEMPER
 * under the candidate table: wrathful) and that deity's fortunes are falling.
 *
 * The token self-identifies: a deity is wrathful-flawed exactly when it holds
 * TEMPER:vice, and the sharpening attaches to THAT position's own pull — per-position
 * attachment, which is what "flaws attach to vice-pole positions" means literally.
 *
 * ⭐ THE CEILING IS ARITHMETIC: the sharpening only ever REDUCES the demotion, and the
 * floor is 0, so the taught band can never exceed the authored level (§856: the
 * ladder only steps down). It CAN recover a pull that exposure had silenced — a
 * wrathful god faintly felt through a small cult as its fortunes fall — which is
 * deliberate and pinned as such.
 *
 * @param {string} token one `AXIS:pole:level` position token
 * @param {number} demotion the exposure demotion (0, 1 or 2)
 * @param {{ wins?: unknown, losses?: unknown } | null | undefined} pantheonEntry
 * @returns {number} the demotion to apply to THIS pull
 */
export function wrathSharpenedDemotion(token, demotion, pantheonEntry) {
  if (!fortunesFalling(pantheonEntry)) return demotion;
  const parts = str(token).split(':');
  if (parts.length !== 3 || parts[1] !== 'vice') return demotion;
  const effect = Object.prototype.hasOwnProperty.call(FLAW_EFFECTS, parts[0])
    ? FLAW_EFFECTS[parts[0]] : null;
  if (!effect || effect.modulates !== 'witness_pull') return demotion;
  return Math.max(0, demotion - DEITY_FLAW_TUNING.WRATH_SHARPEN_RUNGS);
}
