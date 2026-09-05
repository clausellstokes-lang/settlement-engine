/**
 * envoyChanceMeetingNews.js — THE ENCOUNTERS GOVERNED KIND REGISTRY (ENC-4's slice).
 *
 * The WW-C split, copied deliberately from GR-0, IN-1c-a and WF-8a:
 * `envoyChanceMeetingReceiptPools.js` holds the annex-verbatim corpus, THIS file holds the registry
 * row, the eligibility declaration, the seeded picker and the Herald entry builder, and
 * `envoyPulse.js` holds the ONE production mint. Nothing here decides that two people met, what
 * they made of each other, or what follows for either of them: it only voices a receipt ENC-1
 * resolved and ENC-3 staged.
 *
 * THE ESTATE'S SEVENTH PHRASED-KIND REGISTRY FAMILY, and its first row is a MEETING NEITHER
 * COURT ARRANGED.
 *
 * ── ⛔ ROAD B, AND THE EXACT ROW RATHER THAN THE FREE PREFIX ───────────────────────
 *
 * `faithNews.js:26-29` calls the family prefix "the cheap door and the trap", and the recorded
 * verdict is that "a kind that genuinely files a desk takes the exact row, not the free prefix".
 * A chance meeting files a desk across TWO courts; it is exactly the case the rule was written
 * for. So `chance_meeting_recorded` takes its own `EXACT_SECTION` row at the `events` desk, and
 * NO `chance_meeting_` prefix rule is minted. That pairing is what keeps the estate-wide
 * registered-minus-routed honesty check still: a desk-BEARING kind registered without an exact
 * row would inflate the deskless count by one while routing free on a family prefix.
 *
 * ── ⛔ §886: THE ENGINE'S OWN LITERAL NEVER REACHES A READER ───────────────────────
 *
 * `chance_meeting` is ALREADY a live constant in this tree — `corruptionLeash`'s
 * `WILLED_MEETING_CONSPIRACY`, and the receipt id prefix `chance_meeting:` — and ENC-3 refused
 * to mint a third meaning for it. The kind token here is a DIFFERENT literal
 * (`chance_meeting_recorded`, the owner's spelling at ODQ §882.13), and the annex authors every
 * sentence so that the words "chance" and "meeting" are never adjacent in either order. The
 * walker scans that fence on the RENDERED corpus rather than trusting this paragraph.
 *
 * ── WHY THERE IS NO CHRONICLER'S-LETTER ROW ───────────────────────────────────────
 *
 * The annex files this beat at the Herald `events` desk and names no Chronicle section, so no
 * `KIND_SECTION` row is minted. That is a DERIVATION, not an omission: `heraldRouting`'s walker
 * asserts every `KIND_SECTION` key is explicitly routed, never the reverse, and the estate
 * already carries desk-bearing, phrase-bearing kinds with no letter row at all (`razing`,
 * `envoy_dispatched`). A letter row here would claim a Chronicle filing the corpus never made.
 *
 * ── ⭐⭐ THE KEYED PICK IS THE CURED SPELLING ──────────────────────────────────────
 *
 * `hash01` avalanches before the multiply, so the choice does not alias onto a parity class the
 * way a raw `fnv % poolLength` would. That is `grammarNews.js`'s cure, copied by
 * `informationNews.js` and `faithNews.js` and copied again here VERBATIM. ⛔ It repairs none of
 * the sibling sites still carrying the uncured spelling; that cross-family refactor is docketed
 * as `CR-IN1C-DRIFT` and is a STOP for any single wave.
 *
 * ⛔ THERE IS NO UNSEEDED ARM. The seam always carries a meeting id, so the siblings'
 * `seed ? … : pool[0]` fallback would be a branch no producer can reach.
 *
 * ⛔ STATE, NEVER FATE. Nothing this file can emit kills, marries off, replaces or concludes a
 * person. It reports that two people met and what they made of each other, and the annex's own
 * reason says the tie "will fade as ties do".
 *
 * PURE: frozen data, one keyed hash, no store, no Date, no Math.random, no rng threading, no
 * I/O. Every NAME arrives as an argument — this file resolves no id against any world.
 *
 * @enforced-by tests/lint/chanceMeetingKindPools.walker.test.js
 */

import { hash01 } from '../region/contestMath.js';
import { fnv1a32 } from './eventProse.js';
import {
  CHANCE_MEETING_OUTCOME_PHRASES,
  CHANCE_MEETING_RECEIPTS,
} from './envoyChanceMeetingReceiptPools.js';
import { stablePart } from './stablePart.js';

/** @typedef {import('./eventProse.js').ProseVariant} ProseVariant */

/**
 * @typedef {{kind:string, significance:'notable'|'routine'|'major'|'n/a',
 *   audience:'public'|'dm-only', section:string|null,
 *   pool:readonly ProseVariant[], requiredSlots:ReadonlyArray<readonly string[]>}}
 *   ChanceMeetingRegistryEntry
 */

/**
 * ⛔⛔ THE PARAMETER ORDER IS `grammarNews.js#grammarKindRow`'s, AND IT IS LOAD-BEARING:
 * `(kind, significance, audience, section, requiredSlots, …)`. A family that re-orders its row
 * constructor is a family whose rows cannot be read across the estate by eye.
 *
 * ⚠ POSITION SIX — GR-0's `contexts` axis — IS DELIBERATELY UNOCCUPIED rather than accepted and
 * ignored, on IN-1c-a's and WF-8a's recorded reasoning: this corpus authors no split across a
 * fact the seed carries, so taking the parameter and never consulting it would be a dead arm.
 *
 * @param {string} kind
 * @param {'notable'|'routine'|'major'|'n/a'} significance
 * @param {'public'|'dm-only'} audience
 * @param {string|null} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots
 * @returns {Readonly<ChanceMeetingRegistryEntry>}
 */
function chanceMeetingKindRow(kind, significance, audience, section, requiredSlots) {
  const pool = /** @type {readonly ProseVariant[]} */ (CHANCE_MEETING_RECEIPTS[kind]);
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool,
    requiredSlots: Object.freeze(requiredSlots.map((slots) => Object.freeze([...slots]))),
  });
}

/**
 * The governed rows. ONE today, and the singular is a SEQUENCING fact rather than a stage of
 * construction: the annex's §B kind (`chance_meeting_exposed`) has its own authored pool and its
 * own producer in the stage's seam, but the seed that seam emits does not carry the APPROACH
 * DIRECTION, so `{npc}` (who offered) and `{counterpart}` (who refused) cannot be assigned from
 * it honestly. That is a finding back to the chair with the slot that breaks, NOT a word edit and
 * NOT a guess — and it is why this member registers one row rather than two.
 *
 * ⚠ THIS IS THE ESTATE'S THIRD ONE-ROW FAMILY, AND THAT IS A REVIEWED ACT.
 * `kindPoolFloors.walker.test.js` keeps the old blanket width floor of five as an EXACT exception
 * list precisely so a small family is a visible decision rather than a number that quietly
 * slipped. CHANCE_MEETING joins INFORMATION and FAITH on that list, and the SHRINK-BACK IS A
 * RECORDED OBLIGATION of the member that takes this family to five rows or more.
 *
 * `requiredSlots` is WR-10's axis, verbatim, and it is parallel to the pool: a variant whose
 * named evidence is absent is skipped rather than rendered with a hole. ⚠ Every slot named here
 * HAS a supplier at this base, so the eligible set under the production interpolation is the
 * whole authored SIX — one clear of the derived `notable` floor of six by equality rather than by
 * margin — and the walker pins BOTH arms so a filter that had stopped filtering cannot pass as a
 * filter that is working.
 *
 * ⛔ THE ORDER OF EACH ROW IS THE ANNEX'S OWN DECLARATION ORDER (its `**Per-variant required
 * slots**` block, which reads in sentence order), never re-sorted here. The walker pins the two
 * as one value, so a registry that re-ordered a row reds instead of merely rendering the same.
 *
 * @type {ReadonlyArray<Readonly<ChanceMeetingRegistryEntry>>}
 */
export const CHANCE_MEETING_KIND_REGISTRY = Object.freeze([
  chanceMeetingKindRow('chance_meeting_recorded', 'notable', 'public', 'events', [
    ['npc', 'home', 'settlement', 'outcome_phrase', 'counterpart'],
    ['settlement', 'npc', 'counterpart', 'outcome_phrase'],
    ['settlement', 'npc', 'home', 'counterpart', 'outcome_phrase'],
    ['counterpart', 'settlement', 'npc', 'home', 'outcome_phrase'],
    ['home', 'settlement', 'npc', 'counterpart', 'outcome_phrase'],
    ['settlement', 'npc', 'home', 'counterpart', 'outcome_phrase'],
  ]),
]);

/** The exact governed pool set. */
export const CHANCE_MEETING_KINDS = Object.freeze(CHANCE_MEETING_KIND_REGISTRY.map((row) => row.kind));

/**
 * THE ANNEX'S OWN REASON, riding every variant, verbatim from the `**REASON, riding every
 * variant**` line of the `## §A ENC-4` block. It is the NEWS ADDRESS LAW's reason limb and it is
 * the corpus's, not this file's: the walker re-derives it from the document on every run.
 */
export const CHANCE_MEETING_REASON = 'a guest and a notable met by chance; what passed between them is now a tie across two courts, and it will fade as ties do.';

/**
 * THE PRESENTATION WEIGHT, TRANSCRIBED RATHER THAN INVENTED, AND DELIBERATELY NOT A SEVENTH
 * `presentationWeight` FUNCTION.
 *
 * The estate carries SIX module-local `presentationWeight(significance)` copies
 * (`envoyNews.js`, `warCostsNews.js`, `warCoalitionNews.js`, `sovereigntyNews.js`,
 * `treatyLifecycleVoice.js`, `treatySuccessionVoice.js`), and the shape is packet-RULED rather
 * than accidental: `docs/implementation/packets/foreign-policy/GR-4B.md` §6.2 instructs a new
 * voice leaf to carry "its OWN `presentationWeight` carrying `envoyNews.js`'s values". This file
 * honours the ruling's VALUES while refusing its FORM, and the refusal is the estate's own
 * dead-arm law: the registry holds exactly one row and that row is `notable`, so a three-branch
 * table here would ship two branches no producer can reach. The pair below is `envoyNews.js`'s
 * `notable` row and nothing else, and the walker pins the row's significance beside it so the
 * constant cannot outlive the class it was transcribed for.
 *
 * ⛔ NOT A TUNING DIAL. Nothing here scales, compares or thresholds; it is the landed
 * presentation pair the Herald already gives every notable receipt.
 */
export const CHANCE_MEETING_PRESENTATION = Object.freeze({ severity: 0.56, score: 58 });

/** @type {ReadonlyMap<string, Readonly<ChanceMeetingRegistryEntry>>} */
const KIND_BY_ID = new Map(
  /** @type {Array<[string, Readonly<ChanceMeetingRegistryEntry>]>} */ (
    CHANCE_MEETING_KIND_REGISTRY.map((row) => [row.kind, row])
  ),
);

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * ⛔⛔ THE PUBLIC REFERENCE, AND IT CURES TWO MEASURED DEFECTS RATHER THAN ONE. This is
 * `envoyNews.js#publicSourceRef`'s idiom, taken for both of the reasons that file states and one
 * this lane MEASURED at the dock:
 *
 *   1. THE LEAK. A meeting key is built from the ERRAND ID — a live example reads
 *      `chance_meeting:68:envoy_errand:17:ashford::irontown|…`. Slugging it into a public news id
 *      publishes an internal errand handle on a reader surface. envoyNews hides the same handle
 *      for the same reason: "Hide errand/offer ids while retaining exact-once public identity."
 *   2. THE COLLISION, and it is not theoretical. `stablePart` caps at EIGHTY characters, and a
 *      meeting key is routinely longer: two DIFFERENT meetings at the same tick between towns
 *      with long names slug to the SAME eighty characters (executed at the dock:
 *      `…northharrowfield_southharrowfield_7_northharro` for both). `appendWizardNewsEntries`
 *      DEDUPES BY ID, so the second line would be swallowed in silence — the estate's own
 *      recorded hazard, written into `momentum.js:1152` and `supplyWebWarfare.js:892` in so many
 *      words. A digest is fixed-width and reads every byte of the key.
 *
 * @param {string} meetingId @returns {string}
 */
function publicMeetingRef(meetingId) {
  return [
    fnv1a32(`chance-meeting-public-a\u0000${meetingId}`),
    fnv1a32(`chance-meeting-public-b\u0000${meetingId}`),
  ].map((part) => part.toString(16).padStart(8, '0')).join('');
}

/**
 * Resolve one authored CHANCE_MEETING sentence. Variants whose named evidence is absent are
 * ineligible. Null when nothing in the pool qualifies or the kind is unknown — silence, never
 * generic prose.
 *
 * @param {string} kind
 * @param {string} seed  the namespaced pick key; the seam always supplies one
 * @param {Record<string, unknown>} [interp]
 * @returns {{kind:string, line:string, familyId:string, templateIndex:number,
 *   significance:string, audience:string, section:string|null} | null}
 */
export function chanceMeetingLine(kind, seed, interp = {}) {
  const row = KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const eligible = row.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => row.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  // THE KEYED PICK, copied from `faithNews.js` and cured for the same recorded reason:
  // `hash01` avalanches before the multiply, so the choice does not alias onto a parity class
  // the way a raw `fnv % poolLength` would. Same seed, same world, same sentence — forever.
  const templateIndex = eligible[
    Math.min(eligible.length - 1, Math.floor(hash01(String(seed)) * eligible.length))
  ];
  const variant = row.pool[templateIndex];
  const raw = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    // SENTENCE CASE AT THE RENDER, on GR-0's recorded reason: an authored family may open with
    // a slot whose fill is lower case because it also fills mid-sentence, and rendering that
    // template raw would put a lower-case letter at the head of a rendered sentence. The corpus
    // is right and the fill is right, so the CASING is the renderer's business and is normalized
    // here rather than by editing an annex-verbatim pool.
    line: raw.charAt(0).toUpperCase() + raw.slice(1),
    familyId: `${row.kind}.${templateIndex + 1}`,
    templateIndex,
    significance: row.significance,
    audience: row.audience,
    section: row.section,
  };
}

/**
 * THE ONE HERALD ENTRY, built from ENC-3's typed seed. This is the builder the stage's seam
 * docblock reserves ("ENC-4 owns those: it exports a single builder on the `faithReceipt(...)`
 * model and this stage calls it once per seed through `heraldEntryFor`").
 *
 * ⛔ EVERY NAME ARRIVES ON THE SEED. This file resolves no id against any world and imports no
 * roster reader: the STAGE holds the pulse's own pre-mutation cut and the seats the census
 * already resolved, so it is the only honest place to turn an id into a name — and ENC-4 measured
 * that its seed had never carried the names its own contract promised. Completing the seed there
 * rather than resolving here keeps this module PURE, keeps the ENCOUNTERS registry from growing a
 * second opinion about who anybody is, and removes an id round-trip that would have been WRONG:
 * `envoyCasting.js#rosterPersonById` matches a durable H1 id or a bare roster id, never
 * `npcAgency.js#npcId`'s `sid:rosterId` composite, which is the spelling the stage's nids carry.
 *
 * ⛔ IT FAILS CLOSED, AND THE FAILURE IS SILENCE. A seed for any beat but the meeting, an outcome
 * with no authored band fill, or a single unresolved name yields NULL — the estate's posture for
 * an unrenderable receipt. A line with a hole in it is worse than no line.
 *
 * THE NEWS ADDRESS LAW'S WHOLE CHAIN, and each limb is named:
 *   • ADDRESS  — `settlementIds` carries the host and BOTH courts, `npcIds` both people, and
 *                `venueIds` the field node when the meeting happened off a settlement.
 *   • TYPED ACTION — `impactKind` / `kind`, the registered token, spelled as a literal on
 *                treatySuccessionVoice.js's recorded reasoning (a raw-text walker cannot see a
 *                token minted through a variable) and pinned equal to the registry row.
 *   • NAMES    — `settlementNames` beside `settlementIds`, and both people inside the sentence.
 *   • REASON   — the annex's own, riding every variant.
 *
 * @param {{seed?: Record<string, unknown>, now?: string|null}} [args]
 * @returns {Record<string, unknown>|null}
 */
export function chanceMeetingEntry({ seed, now = null } = {}) {
  const source = /** @type {Record<string, unknown>} */ (seed && typeof seed === 'object' ? seed : {});
  // THE BEAT GATE. ENC-3 mints `'meeting'` for the three visible mark bands and
  // `'approach_exposed'` for the refusal that travelled; only the first is this row's.
  if (text(source.beat) !== 'meeting') return null;
  const outcomePhrase = CHANCE_MEETING_OUTCOME_PHRASES[text(source.outcome)];
  if (!outcomePhrase) return null;

  const row = CHANCE_MEETING_KIND_REGISTRY[0];
  const npcIds = Array.isArray(source.npcIds) ? source.npcIds.map(text) : [];
  const homeSids = Array.isArray(source.settlementIds) ? source.settlementIds.map(text) : [];
  const names = Array.isArray(source.npcNames) ? source.npcNames.map(text) : [];
  const places = /** @type {Record<string, string>} */ (
    source.settlementNames && typeof source.settlementNames === 'object'
      ? source.settlementNames
      : {});
  const hostSid = text(source.hostId);
  // ⛔ PARTY ORDER IS THE CENSUS'S, NOT A CONVENTION THIS FILE INVENTS: both selection rules in
  // `envoyChanceMeeting.js#censusChanceMeetingCandidates` put the TRAVELLER at index 0, so
  // `{npc} of {home}` is the person passing through and `{counterpart}` is the person met.
  const interp = {
    npc: names[0] || '',
    counterpart: names[1] || '',
    home: places[homeSids[0]] || '',
    settlement: places[hostSid] || '',
    outcome_phrase: outcomePhrase,
  };
  if (Object.values(interp).some((value) => !value)) return null;

  const meetingId = text(source.id);
  const picked = chanceMeetingLine(row.kind, `${row.kind}::${meetingId}`, interp);
  if (!picked) return null;

  // SENTENCE CASE AT THE RENDER, and it is GR-0's recorded reason applied to the reason limb:
  // the annex authors this clause lower-case because it reads as a clause, and rendering it raw
  // would put a lower-case letter at the head of a reader's sentence. The CONSTANT stays
  // annex-verbatim so the document join above cannot be laundered by a casing rule; the CASING is
  // the renderer's business, exactly as it is for the pool.
  const reason = CHANCE_MEETING_REASON.charAt(0).toUpperCase() + CHANCE_MEETING_REASON.slice(1);
  const tick = Number.isFinite(Number(source.tick)) ? Number(source.tick) : 0;
  const settlementIds = [...new Set([hostSid, ...homeSids].filter(Boolean))];
  const venueIds = Array.isArray(source.venueIds) ? source.venueIds.map(text).filter(Boolean) : [];
  const publicRef = publicMeetingRef(meetingId);
  return {
    id: `wizard_news.${tick}.${stablePart(row.kind)}.${publicRef}`,
    tick,
    createdAt: now,
    scope: 'regional',
    significance: row.significance,
    severity: CHANCE_MEETING_PRESENTATION.severity,
    score: CHANCE_MEETING_PRESENTATION.score,
    headline: picked.line,
    summary: reason,
    kind: 'chance_meeting_recorded',
    impactKind: 'chance_meeting_recorded',
    channelType: null,
    settlementIds,
    settlementNames: settlementIds.map((sid) => places[sid] || ''),
    npcIds: npcIds.filter(Boolean),
    ...(venueIds.length ? { venueIds } : {}),
    impactIds: [],
    channelIds: [],
    sourceEventId: `chance_meeting_receipt.${stablePart(row.kind)}.${publicRef}`,
    tags: ['world_pulse', 'encounters', String(row.section)],
    reasons: [reason],
    familyId: picked.familyId,
    audience: row.audience,
    section: row.section,
    sectionAuthority: 'chance_meeting_registry',
  };
}
