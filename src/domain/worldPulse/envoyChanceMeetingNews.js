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
 * @typedef {{poolKey:string, pool:readonly ProseVariant[],
 *   requiredSlots:ReadonlyArray<readonly string[]>}} ChanceMeetingCase
 */

/**
 * @typedef {{kind:string, significance:'notable'|'routine'|'major'|'n/a',
 *   audience:'public'|'dm-only', section:string|null,
 *   pool:readonly ProseVariant[], requiredSlots:ReadonlyArray<readonly string[]>,
 *   cases:Readonly<Record<string, Readonly<ChanceMeetingCase>>>}}
 *   ChanceMeetingRegistryEntry
 */

/**
 * ⛔⛔ THE PARAMETER ORDER IS `grammarNews.js#grammarKindRow`'s, AND IT IS LOAD-BEARING:
 * `(kind, significance, audience, section, requiredSlots, …)`. A family that re-orders its row
 * constructor is a family whose rows cannot be read across the estate by eye.
 *
 * ⭐⭐ POSITION SIX IS NOW OCCUPIED, AND NOT BY GR-0's `contexts`. ENC-4 left it empty on IN-1c-a's
 * and WF-8a's recorded reasoning — "this corpus authors no split across a fact the seed carries,
 * so taking the parameter and never consulting it would be a dead arm". ENC-4c authors exactly
 * such a split, so the reasoning now points the other way and the axis arrives.
 *
 * ⛔ IT IS `cases`, NOT `contexts`, AND THE DIVERGENCE IS MEASURED RATHER THAN STYLISTIC. GR-0's
 * axis is a per-VARIANT token filter INSIDE one pool; this split is a whole SECOND authored
 * corpus with its own governed annex block, and folding the ten sentences into one pool would
 * fork the sealed §B block's own five-and-five split — which is the proof that the seal's
 * sentences are untouched. Reusing the sibling's NAME for a different type and a different
 * semantics would be worse than a new one, so the name is new and the reason is written here.
 *
 * ⚠ THE ROW'S OWN `pool` AND `requiredSlots` REMAIN THE DEFAULT CASE'S, and that is deliberate:
 * `tests/helpers/kindPoolWalker.js` measures a row's DEPTH from `row.pool` and its slot arity
 * from `row.requiredSlots`, so a row that moved them under a case key would measure zero and
 * land on `['starved']`. The default case is also present in `cases` under its own key, so the
 * table is total rather than "the others"; the walker pins the two views equal.
 *
 * @param {string} kind
 * @param {'notable'|'routine'|'major'|'n/a'} significance
 * @param {'public'|'dm-only'} audience
 * @param {string|null} section
 * @param {ReadonlyArray<readonly string[]>} requiredSlots the DEFAULT case's, parallel to its pool
 * @param {Readonly<Record<string, readonly [string, ReadonlyArray<readonly string[]>]>>} [cases]
 *   every case this kind is authored for, as `caseToken -> [poolKey, requiredSlots]`. The default
 *   case's poolKey is the kind itself; a kind with one case declares none and gets one.
 * @param {string} [defaultCase]
 * @returns {Readonly<ChanceMeetingRegistryEntry>}
 */
function chanceMeetingKindRow(kind, significance, audience, section, requiredSlots,
  cases, defaultCase = 'sole') {
  const pool = /** @type {readonly ProseVariant[]} */ (CHANCE_MEETING_RECEIPTS[kind]);
  const frozenSlots = Object.freeze(requiredSlots.map((slots) => Object.freeze([...slots])));
  const declared = cases || { [defaultCase]: [kind, requiredSlots] };
  /** @type {Record<string, Readonly<ChanceMeetingCase>>} */
  const built = {};
  for (const [token, [poolKey, slots]] of Object.entries(declared)) {
    const casePool = /** @type {readonly ProseVariant[]} */ (CHANCE_MEETING_RECEIPTS[poolKey]);
    // ⛔ FAIL LOUD AT MODULE LOAD, not silently at a live pulse. A case naming a corpus the leaf
    // does not carry, or one whose declaration is not parallel to its own sentences, is a wiring
    // defect that must never reach a reader as a hole or an undefined variant.
    if (!Array.isArray(casePool) || casePool.length === 0) {
      throw new Error(`chanceMeetingKindRow: ${kind}/${token}: no corpus named ${poolKey}`);
    }
    if (casePool.length !== slots.length) {
      throw new Error(`chanceMeetingKindRow: ${kind}/${token}: ${poolKey} has ${casePool.length}`
        + ` variants against ${slots.length} slot declarations`);
    }
    built[token] = Object.freeze({
      poolKey,
      pool: casePool,
      requiredSlots: Object.freeze(slots.map((one) => Object.freeze([...one]))),
    });
  }
  if (!built[defaultCase]) {
    throw new Error(`chanceMeetingKindRow: ${kind}: no case named ${defaultCase} to default to`);
  }
  return Object.freeze({
    kind,
    significance,
    audience,
    section,
    pool,
    requiredSlots: frozenSlots,
    cases: Object.freeze(built),
  });
}

/**
 * The governed rows. TWO, and the second one arrived only once the SLOT THAT BREAKS was cured at
 * its source. ENC-4 registered `chance_meeting_recorded` alone and reported §B unwireable: every
 * §B variant reads `{counterpart} … refused what {npc} … offered`, so `{npc}` is the APPROACHER,
 * and the stage's typed seed carried parties in census order and nothing else. ENC-4b's car 1 put
 * `approacherNid` on that seed, DERIVED FROM THE RECEIPT'S OWN EXPOSURE GRIEVANCE
 * (`grievance.toSid` is `lead.approacher.homeSid`, and a home id names a person because the two
 * parties' homes can never coincide) — never from party order, and never from the "the traveller
 * approaches" rule the R1 ruling proposed, which this lane MEASURED FALSE in both directions.
 *
 * ⚠ CHANCE_MEETING IS STILL A SMALL FAMILY at two rows, so it stays on `kindPoolFloors`'s exact
 * small-family exception list and the shrink-back obligation recorded there still stands.
 *
 * ⚠ THE THIRD SMALL FAMILY'S ADMISSION WAS A REVIEWED ACT.
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
  // §B — THE REFUSAL THAT TRAVELLED. `major`, and five authored variants clear the derived major
  // floor of four by margin rather than by equality. The order below is the annex's own
  // `**Per-variant required slots:**` declaration order, in sentence order, never re-sorted here.
  //
  // ⭐⭐ AND IT IS THE FIRST ROW IN THE ESTATE TO CARRY TWO AUTHORED CASES. ENC-4b shipped this
  // kind's §B corpus and WITHHELD the line whenever the host court's own notable made the offer,
  // because §B's variant 1 asserts the refuser is of the host town. ENC-4c's §B2 block carries
  // that case, so the kind now speaks for both and withholds for neither.
  //
  // ⛔ THE CASE TOKENS NAME THE FACT, NOT THE BLOCK. `guest_offered` and `host_offered` are read
  // off the seed's own parallel address — which court the approacher belongs to — and the pools
  // are keyed to them rather than to §B and §B2, so a renamed annex block cannot silently
  // re-point a corpus at the case it is false about.
  chanceMeetingKindRow('chance_meeting_exposed', 'major', 'public', 'events', [
    ['counterpart', 'settlement', 'npc', 'home'],
    ['settlement', 'counterpart', 'npc', 'home'],
    ['npc', 'home', 'settlement', 'counterpart'],
    ['settlement', 'counterpart', 'npc', 'home'],
    ['settlement', 'counterpart', 'npc', 'home'],
  ], {
    // §B — the one PASSING THROUGH offered, so the refuser is of the host town.
    guest_offered: ['chance_meeting_exposed', [
      ['counterpart', 'settlement', 'npc', 'home'],
      ['settlement', 'counterpart', 'npc', 'home'],
      ['npc', 'home', 'settlement', 'counterpart'],
      ['settlement', 'counterpart', 'npc', 'home'],
      ['settlement', 'counterpart', 'npc', 'home'],
    ]],
    // §B2 — the HOST COURT'S OWN offered, so the refuser is the guest. The order below is that
    // block's own declaration order, in sentence order, never re-sorted here.
    host_offered: ['chance_meeting_exposed_host_offered', [
      ['npc', 'settlement', 'counterpart', 'home'],
      ['settlement', 'counterpart', 'home', 'npc'],
      ['npc', 'settlement', 'counterpart', 'home'],
      ['settlement', 'counterpart', 'home', 'npc'],
      ['settlement', 'counterpart', 'home', 'npc'],
    ]],
  }, 'guest_offered'),
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
 * ⛔⛔ §B AUTHORS NO "REASON, RIDING EVERY VARIANT" CLAUSE, AND THAT IS A MEASURED ABSENCE RATHER
 * THAN AN OVERSIGHT OF THIS FILE. The sealed §A block carries one; the sealed §B block does not.
 * The NEWS ADDRESS LAW still owes a reason limb, and this lane may not author reader prose — the
 * owner handed the words to the chair.
 *
 * ⭐ SO THE LIMB IS FILLED FROM THE ANNEX'S OWN §C ROW FOR THIS EXACT KIND, which the chair
 * authored and marked KEPT: `a refusal that did not stay private`. It is a citation, not a mint —
 * the walker re-derives it from the §C table on every run and pins it EQUAL to
 * `WHAT_PHRASES['chance_meeting_exposed']`, so the two surfaces cannot drift and neither can fork
 * from the document. ⚠ RETROVALIDATION: re-purposing the §C noun phrase (authored as the R1 rumor
 * phrase) into the reason limb is this lane's judgment. If §B should carry a reason clause of its
 * own, that is a chair annex act and this constant becomes its transcription.
 */
export const CHANCE_MEETING_EXPOSED_REASON = 'a refusal that did not stay private.';

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
 * dead-arm law: a three-branch function would ship a branch no producer can reach.
 *
 * ⭐ ENC-4b WIDENS IT BY EXACTLY ONE CLASS, AND NOT BY ONE MORE. ENC-4 carried a single frozen
 * pair because the registry held a single `notable` row. §B is `major`, so the table now holds
 * the two classes the registry actually registers and still refuses `routine`, which no row
 * claims. The walker pins this key set against the registry's OWN significances, so a class that
 * outlives its row reds instead of sitting here forever.
 *
 * ⛔ NOT A TUNING DIAL. Nothing here scales, compares or thresholds; these are the landed
 * presentation pairs the Herald already gives every notable and every major receipt.
 *
 * ⚠ THE ANNOTATION IS DELIBERATE AND IT IS WHY THE READERS BELOW CARRY A GUARD. A row's
 * `significance` is typed as the WHOLE family (`notable | routine | major | n/a`), so the strict
 * ratchet convicted an unguarded lookup into a two-key literal — correctly: a future `routine`
 * row would have read `undefined.severity` inside a live pulse. The widening names the real key
 * space and each builder refuses a class this table has no pair for, rather than throwing.
 * @type {Readonly<Record<string, Readonly<{severity: number, score: number}>>>}
 */
/**
 * The Herald presentation of a recorded meeting — a TUNING table, so the tuning walker sees its
 * decimals as registered dials (P1) and never as bare literals (P3). Registered 2026-09-05 at the
 * §899 composed landing (Fable chair) when the walker convicted the bare `0.56` in a new file;
 * at §900 ENC-4b's second band (`major`, the refusal that travelled) joins it — the two bands are
 * the estate's `notable` / `major` significance ladder, one leaf pair each.
 * ⚠ No `@type` annotation, for the reason CHANCE_MEETING_TUNING states: the inferred frozen-literal
 * type keeps the leaves numbers.
 */
export const CHANCE_MEETING_NEWS_TUNING_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (ROAD B; enrolled in the tuning register at the §899 landing; the major band at §900)',
  signedBy: null,
  ownerRows: Object.freeze([
    'the recorded meeting\'s Herald severity, the notable band\'s own weight',
    'the recorded meeting\'s Herald score, an integer the feed sorts by',
    'the exposed refusal\'s Herald severity, the major band\'s own weight',
    'the exposed refusal\'s Herald score, an integer the feed sorts by',
  ]),
});
export const CHANCE_MEETING_NEWS_TUNING = Object.freeze({
  /** the recorded meeting: the notable band */
  notable: Object.freeze({
    /** the notable band's severity weight on the Herald feed */
    severity: 0.56,
    /** the feed's integer sort score */
    score: 58,
  }),
  /** the exposed refusal (ENC-4b, §B): the major band */
  major: Object.freeze({
    /** the major band's severity weight on the Herald feed */
    severity: 0.76,
    /** the feed's integer sort score */
    score: 78,
  }),
});
/** The name the writers and the walker read; the table above is the register's. */
export const CHANCE_MEETING_PRESENTATION = CHANCE_MEETING_NEWS_TUNING;
/**
 * The presentation for a registry row's significance — the two bands the table carries, and NULL
 * for every other value of the family (`routine`, `n/a`), which the writers already treat as
 * "withhold the line". Typed so the strict checker sees the narrowing the runtime always had:
 * indexing the two-key table with the four-value union was TS7053 twice (ENC-4c's bill, paid at
 * the §900 composition by the Fable chair); the behaviour is byte-identical.
 * @param {'notable'|'routine'|'major'|'n/a'} significance
 * @returns {Readonly<{severity:number, score:number}>|null}
 */
/**
 * The two bands the table carries, keyed by the registry's own significance word — a LOOKUP,
 * never a comparison: `significanceMigration.census` counts every `significance === '…'` as ad-hoc
 * scale debt (class A), and this leaf must not join the debtors. Typed as a partial record so the
 * strict checker sees `undefined` for `routine` / `n/a` (the withhold the writers already guard).
 * @type {Readonly<Partial<Record<'notable'|'routine'|'major'|'n/a', Readonly<{severity:number, score:number}>>>>}
 */
const PRESENTATION_BY_SIGNIFICANCE = Object.freeze({
  notable: CHANCE_MEETING_PRESENTATION.notable,
  major: CHANCE_MEETING_PRESENTATION.major,
});
/**
 * The presentation for a registry row's significance, or null for the bands the table does not carry.
 * @param {'notable'|'routine'|'major'|'n/a'} significance
 * @returns {Readonly<{severity:number, score:number}>|null}
 */
export function presentationFor(significance) {
  return PRESENTATION_BY_SIGNIFICANCE[significance] ?? null;
}

/**
 * Which case each row draws when a caller names none. It is derived from the registry rather than
 * re-declared: the row whose `cases` holds exactly one entry defaults to it, and a multi-case row
 * declares its own. ⛔ A row that grew a second case without saying which is default would resolve
 * to nothing here and go SILENT, which is the honest failure — a default guessed from key order
 * would pick a corpus by accident of source layout.
 * @type {ReadonlyMap<string, string>}
 */
const DEFAULT_CASE_OF = new Map([
  ['chance_meeting_recorded', 'sole'],
  ['chance_meeting_exposed', 'guest_offered'],
]);

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
 * ⭐ THE CASE SELECTS THE CORPUS, and an unknown case is SILENCE rather than a fallback to the
 * default one. A case this kind has no words for is precisely the state ENC-4b was in for the
 * host-offered half, and answering it with the other case's sentences would be the wrong-ROLE
 * defect wearing a default.
 *
 * ⛔ THE FAMILY ID IS THE CORPUS'S, NOT THE KIND'S. Two cases of one kind are two genuinely
 * different families of sentence, and a shared namespace would let a variety reader treat
 * `chance_meeting_exposed.4` as one family when it is two. The default case's poolKey IS the
 * kind, so every kind authored for one case spells its family exactly as it always has.
 *
 * @param {string} kind
 * @param {string} seed  the namespaced pick key; the seam always supplies one
 * @param {Record<string, unknown>} [interp]
 * @param {string|null} [caseToken] which authored case; the row's default when absent
 * @returns {{kind:string, line:string, familyId:string, templateIndex:number,
 *   significance:string, audience:string, section:string|null} | null}
 */
export function chanceMeetingLine(kind, seed, interp = {}, caseToken = null) {
  const row = KIND_BY_ID.get(String(kind));
  if (!row) return null;
  const authored = caseToken == null
    ? row.cases[DEFAULT_CASE_OF.get(row.kind) || '']
    : row.cases[String(caseToken)];
  if (!authored) return null;
  const eligible = authored.pool
    .map((_, templateIndex) => templateIndex)
    .filter((templateIndex) => authored.requiredSlots[templateIndex].every((slot) => (
      typeof interp[slot] === 'string' && String(interp[slot]).trim().length > 0
    )));
  if (eligible.length === 0) return null;
  // THE KEYED PICK, copied from `faithNews.js` and cured for the same recorded reason:
  // `hash01` avalanches before the multiply, so the choice does not alias onto a parity class
  // the way a raw `fnv % poolLength` would. Same seed, same world, same sentence — forever.
  const templateIndex = eligible[
    Math.min(eligible.length - 1, Math.floor(hash01(String(seed)) * eligible.length))
  ];
  const variant = authored.pool[templateIndex];
  const raw = typeof variant === 'function' ? String(variant(interp)) : String(variant);
  return {
    kind: row.kind,
    // SENTENCE CASE AT THE RENDER, on GR-0's recorded reason: an authored family may open with
    // a slot whose fill is lower case because it also fills mid-sentence, and rendering that
    // template raw would put a lower-case letter at the head of a rendered sentence. The corpus
    // is right and the fill is right, so the CASING is the renderer's business and is normalized
    // here rather than by editing an annex-verbatim pool.
    line: raw.charAt(0).toUpperCase() + raw.slice(1),
    familyId: `${authored.poolKey}.${templateIndex + 1}`,
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
  // A class with no landed presentation pair is a class this file cannot present; the walker pins
  // the table's key set EQUAL to the registry's own significances, so this is a belt on a proof.
  const presentation = presentationFor(row.significance);
  if (!presentation) return null;

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
    severity: presentation.severity,
    score: presentation.score,
    headline: picked.line,
    summary: reason,
    kind: 'chance_meeting_recorded',
    impactKind: 'chance_meeting_recorded',
    channelType: null,
    settlementIds,
    // ⚠ PARALLEL BY CONSTRUCTION, AND AN UNRESOLVED NAME IS THE EMPTY STRING RATHER THAN A
    // DROPPED ELEMENT. Only the COUNTERPART's home can be nameless here — the host and the
    // guest's home are both pool slots and the interpolation guard above already refused a blank
    // for either — and that court appears in no sentence, so withholding the whole line for it
    // would suppress a perfectly renderable receipt. ⛔ NOT `envoyNews.js`'s `uniqueText` shape:
    // filtering the names would let `settlementNames` and `settlementIds` diverge in LENGTH, and
    // a names array that no longer indexes its ids is worse than a named gap.
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

/**
 * THE §B HERALD ENTRY — THE REFUSAL THAT TRAVELLED, AND IT SPEAKS ONLY WHERE THE APPROACH IS
 * KNOWN. ENC-4 reported this kind unwireable and named the exact slot that broke; ENC-4b cured
 * that slot at its source rather than by editing a word, and this is the consumer of the cure.
 *
 * ── ⛔⛔ THE TWO ROLES, AND WHERE EACH ONE COMES FROM ────────────────────────────
 *
 * `{npc}` is the APPROACHER and `{counterpart}` is the one who refused — that is what all five
 * authored sentences say, and it is the whole reason ENC-4 refused to register the kind. The
 * approacher is read off `seed.approacherNid`, which the stage DERIVES FROM THE RECEIPT'S OWN
 * EXPOSURE GRIEVANCE. ⛔ IT IS NOT PARTY ORDER AND IT IS NOT THE TRAVELLER: the R1 ruling's
 * "the traveller approaches the resident's venue" was MEASURED FALSE at ENC-4b's dock, in both
 * directions, on real minted worlds — `envoyChanceMeeting.js` leads with whichever direction has
 * the higher compromise chance ON THE TARGET, and that chance never reads who travelled.
 *
 * ── ⭐⭐ VARIANT 1'S OWN CLAUSE WAS THE GATE, AND ENC-4c MADE IT A CHOICE ──────────
 *
 * §B's variant 1 reads "{counterpart} of {settlement} refused …". `{settlement}` is the town the
 * refusal became known in — the HOST — so that clause asserts the refuser is of the host town.
 * True when the person passing through made the offer; FALSE when the host's own notable did.
 * Both happen. ENC-4b therefore WITHHELD the entire line for the second arrangement rather than
 * ship a sentence that is fluent and wrong about where a man is from.
 *
 * ⛔ THE CHAIR AUTHORED THE MISSING HALF (`## §B2 ENC-4c`), so the same fact that used to be a
 * withhold is now a CASE SELECTION: `host_offered` draws §B2's five sentences and `guest_offered`
 * draws §B's. Nothing about the kind, the desk, the audience, the significance or the reason limb
 * changes, and no sealed word was touched. The kind withholds for neither arrangement.
 *
 * ⚠ AND THE PREMISE FOR AUTHORING IT WAS MEASURED, NOT ASSUMED. ENC-4b called the withheld half
 * "the smaller of the two"; it is not. `envoyChanceMeeting.js` picks the approach direction by the
 * compromise chance ON THE TARGET and breaks ties on the target's nid, so on every tie the
 * approacher is whichever party's HOME ID SORTS LATER — a fact about town-name spelling that knows
 * nothing about who is the host. Holding the host role fixed and flipping only the id ordering
 * flips the case 89 receipts out of 89.
 *
 * ⛔ IT STILL FAILS CLOSED, AND THE FAILURE IS SILENCE, exactly as the §A builder does: a seed for
 * another beat, an unknown approacher, a party count that is not two, an address where both or
 * neither party is of the host town, a case the kind has no words for, or a single unresolved name
 * yields NULL.
 *
 * @param {{seed?: Record<string, unknown>, now?: string|null}} [args]
 * @returns {Record<string, unknown>|null}
 */
export function chanceMeetingExposedEntry({ seed, now = null } = {}) {
  const source = /** @type {Record<string, unknown>} */ (seed && typeof seed === 'object' ? seed : {});
  // THE BEAT GATE. ENC-3 mints `'approach_exposed'` for the refusal that travelled and
  // `'meeting'` for the three visible mark bands; only the first is this row's.
  if (text(source.beat) !== 'approach_exposed') return null;
  const row = KIND_BY_ID.get('chance_meeting_exposed');
  if (!row) return null;

  const npcIds = Array.isArray(source.npcIds) ? source.npcIds.map(text) : [];
  const homeSids = Array.isArray(source.settlementIds) ? source.settlementIds.map(text) : [];
  const names = Array.isArray(source.npcNames) ? source.npcNames.map(text) : [];
  const places = /** @type {Record<string, string>} */ (
    source.settlementNames && typeof source.settlementNames === 'object'
      ? source.settlementNames
      : {});
  const hostSid = text(source.hostId);
  if (!hostSid) return null;
  // THE PARTY COUNT IS ASSERTED RATHER THAN ASSUMED, because both roles below are INDEXES into
  // these three parallel arrays and an arity this builder did not expect would silently pair a
  // name with the wrong id.
  if (npcIds.length !== 2 || homeSids.length !== 2 || names.length !== 2) return null;
  const approacher = npcIds.indexOf(text(source.approacherNid));
  // ⛔ AN EMPTY `approacherNid` IS THE STAGE SAYING "THE APPROACH IS NOT KNOWN HERE", which is
  // every meeting beat and every traveller x traveller receipt. `indexOf('')` is -1 on a seed
  // whose ids are real, and the guard below is the one that reads it as the refusal it is.
  if (approacher < 0) return null;
  const counterpart = 1 - approacher;
  // ⛔⛔ EXACTLY ONE PARTY IS OF THE HOST TOWN, ASSERTED RATHER THAN ASSUMED. Every sentence in
  // both corpora attaches one party to `{settlement}` and the other to `{home}`, so a seed where
  // BOTH courts are the host, or NEITHER is, has no honest fill for either slot. Neither shape is
  // reachable from ENC-3's stage today — a traveller is never at his own home, the resident's
  // home IS the host node, and two travellers never share a home — but the builder refuses them
  // here rather than resting on three guarantees it does not own.
  const approacherAtHome = homeSids[approacher] === hostSid;
  if (approacherAtHome === (homeSids[counterpart] === hostSid)) return null;
  // ⭐⭐ THE CASE, AND IT IS THE ONE FACT THAT DECIDES WHICH SENTENCES ARE HONEST. §B says
  // "{counterpart} of {settlement}"; §B2 says "{npc} of {settlement}". Both are true of exactly
  // one arrangement of the same two people, so the corpus is chosen by which court the APPROACHER
  // belongs to. ENC-4b had words for one arrangement and withheld the other; both now have words,
  // and this builder withholds for neither.
  const caseToken = approacherAtHome ? 'host_offered' : 'guest_offered';
  // ⚠⚠ `{home}` IS THE GUEST'S COURT IN BOTH CORPORA, NEVER "THE APPROACHER'S". ENC-4b could read
  // it off the approacher only because its withhold guaranteed the approacher was the guest; under
  // the host-offered case that same read would render "{counterpart} of {home}" as the guest being
  // of the host town — fluent, compiling, and wrong about where a man is from, which is the exact
  // defect the whole ROLE law exists to prevent. It is derived from the HOST instead.
  const guest = approacherAtHome ? counterpart : approacher;
  const interp = {
    npc: names[approacher] || '',
    counterpart: names[counterpart] || '',
    home: places[homeSids[guest]] || '',
    settlement: places[hostSid] || '',
  };
  if (Object.values(interp).some((value) => !value)) return null;

  const meetingId = text(source.id);
  const picked = chanceMeetingLine(row.kind, `${row.kind}::${meetingId}`, interp, caseToken);
  if (!picked) return null;
  const presentation = presentationFor(row.significance);
  if (!presentation) return null;

  const reason = CHANCE_MEETING_EXPOSED_REASON.charAt(0).toUpperCase() + CHANCE_MEETING_EXPOSED_REASON.slice(1);
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
    severity: presentation.severity,
    score: presentation.score,
    headline: picked.line,
    summary: reason,
    kind: 'chance_meeting_exposed',
    impactKind: 'chance_meeting_exposed',
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

/**
 * THE ONE DOOR THE PULSE CALLS. `envoyPulse.js` hands every seed the stage emits to a single
 * callback, so the beat dispatch lives HERE beside the rows rather than in the pulse: the pulse
 * has no business knowing which beats this registry voices, and a builder added without a
 * dispatch row would be a mint no producer could reach.
 *
 * ⛔ TOTAL AND SILENT. A beat neither row claims yields null, which is what an unbuilt seed
 * already meant to the stage.
 *
 * @param {{seed?: Record<string, unknown>, now?: string|null}} [args]
 * @returns {Record<string, unknown>|null}
 */
export function chanceMeetingHeraldEntry({ seed, now = null } = {}) {
  return chanceMeetingEntry({ seed, now }) ?? chanceMeetingExposedEntry({ seed, now });
}
