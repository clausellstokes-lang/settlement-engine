/**
 * tests/fixtures/grammarControls.js — THE B-GRAMMAR WALKER'S CONTROLS.
 *
 * MOVE-GRAMMAR §4.4 named five; the chair's sitting corrected that to FOUR NEGATIVE plus one
 * POSITIVE, and owed controls for arms B2, D, F, G, H and C-sibling (SITTING B.4.7). All of
 * them are here, plus one per arm this lane added (the three numbers, the ten gaps).
 *
 * ⭐ THE HAND-TAGGED SAMPLE REFERENCES THE CORPUS BY ID AND COPIES NO SENTENCE. Twenty-four
 * corpus variants transcribed into a fixture would MINT A SECOND HOME for twenty-four shipped
 * strings — the exact drift class the projection's `LIVE_STRING_BINDINGS` machinery exists to
 * forbid, and it would re-appear on every regeneration. So the fixture carries the ID, the
 * hand tag and the GROUND for the tag; the test loads the text from the corpus. If a variant
 * is rewritten by the wave, the loader throws instead of scoring a stale sentence.
 *
 * ⚠ THE HAND TAGS ARE THIS LANE'S JUDGMENT, PRINTED TO BE OVERTURNED (fault 32: no model's
 * judgment gates). Each carries its ground. Two of them — marked `revisedAfterSeeing` — were
 * changed after reading the improved classifier's output, which is a real bias, so the test
 * prints BOTH agreement figures: the one with those two counted as agreements, and the
 * conservative one with them counted as disagreements.
 */

/**
 * The stratified sample: every 97th entry of the loaded R1+R2 corpus, twenty-four of them,
 * so the selection is deterministic and carries no taste.
 * @type {ReadonlyArray<{id: string, hand: ReadonlyArray<string>, ground: string,
 *   revisedAfterSeeing?: boolean}>}
 */
export const HAND_TAGGED = Object.freeze([
  Object.freeze({
    id: 'defense.generated.js::DS-DEF-1::readiness STRONG#0',
    hand: Object.freeze(['PRESENT']),
    ground: 'three present observations of the works and the approaches; "looks like it was thrown together" is a negated characterisation of the standing state, not an event assertion',
  }),
  Object.freeze({
    id: 'defense.generated.js::DS-DEF-2::Disasters & Famine: granary, NO medical provision#2',
    hand: Object.freeze(['PRESENT', 'ABSENCE', 'PRESENT']),
    ground: 'the capacity stands first, then the lack, then the standing knowledge of which is feared',
    revisedAfterSeeing: true,
  }),
  Object.freeze({
    id: 'defense.generated.js::DS-DEF-6::Economic Backing: Underfunded#0',
    hand: Object.freeze(['PRESENT']),
    ground: 'pay, equipment and morale are all one standing condition',
  }),
  Object.freeze({
    id: 'defense.generated.js::DS-DEF-8::override active, viability threatened#2',
    hand: Object.freeze(['PRESENT']),
    ground: 'what the town argues about is its present state; the future indicative inside it is arm F2/G\'s finding, not a move',
  }),
  Object.freeze({
    id: 'economy.generated.js::DS-ECO-1::COMBINATION C2: a high rung on a narrow approach (isolated / mountain_pass)#2',
    hand: Object.freeze(['GEOGRAPHY', 'PRESENT']),
    ground: 'the approach is the licensing field (`access`) and opens the variant; the town\'s condition follows',
  }),
  Object.freeze({
    id: 'economy.generated.js::DS-SUP-1::RESOURCE DEPLETED#2',
    hand: Object.freeze(['INSTITUTION', 'OBJECT']),
    ground: 'the institution\'s procedure, then the named resource',
  }),
  Object.freeze({
    id: 'economy.generated.js::DS-ECO-10::POSTURE: limited#1',
    hand: Object.freeze(['PRESENT', 'OBJECT']),
    ground: 'the posture stands; the named good follows it',
  }),
  Object.freeze({
    id: 'economy.generated.js::DS-ECO-12::TRADE PROFILE: no significant exports#0',
    hand: Object.freeze(['ABSENCE', 'PRESENT']),
    ground: 'the first assertion IS the lack; `{settlement}` is a subject, not an assertion — and this variant therefore breaches wall 3 (an ABSENCE opening), which is a finding for the wave',
  }),
  Object.freeze({
    id: 'general.generated.js::DS-POP-2::BAND +2: has been swelling#1',
    hand: Object.freeze(['PRESENT']),
    ground: 'the block is a TREND BAND — a standing configuration field — so the trend is a present state; "than they were built to give" is a passive inside a present clause',
  }),
  Object.freeze({
    id: 'general.generated.js::DS-GEN-3::scores.internal: STRONG#0',
    hand: Object.freeze(['PRESENT']),
    ground: 'one standing condition, twice observed',
  }),
  Object.freeze({
    id: 'general.generated.js::DS-GEN-3::foodSecurity.label: Deficit#1',
    hand: Object.freeze(['PRESENT']),
    ground: 'an expletive opener over a standing arithmetic',
  }),
  Object.freeze({
    id: 'general.generated.js::DS-GEN-8::history.ancientRuin present#0',
    hand: Object.freeze(['OBJECT', 'PRESENT', 'HISTORY']),
    ground: 'the ruin is named, it stands, and it fell — the object first, the history last',
  }),
  Object.freeze({
    id: 'general.generated.js::DS-GEN-9::recency framing: Living memory#0',
    hand: Object.freeze(['PRESENT', 'CONTRADICTION']),
    ground: 'people are here; their account and the town\'s differ — two records, unadjudicated',
  }),
  Object.freeze({
    id: 'general.generated.js::DS-GEN-12::WOODLAND#2',
    hand: Object.freeze(['GEOGRAPHY', 'PRESENT']),
    ground: 'the terrain field opens it; what the town does with the wood is the state',
  }),
  Object.freeze({
    id: 'power.generated.js::DS-POW-1::Tolerated#4',
    hand: Object.freeze(['INSTITUTION', 'PRESENT']),
    ground: 'the seat, then where it sits on the band — V5',
  }),
  Object.freeze({
    id: 'power.generated.js::DS-POW-4::legitimacyHold: public rejection is breaking the hold#2',
    hand: Object.freeze(['INSTITUTION', 'PRESENT']),
    ground: 'the block is a legitimacy BAND; "has lost" is a present-perfect about the standing, not an event',
  }),
  Object.freeze({
    id: 'power.generated.js::DS-POW-7::glue concession (seats and revenue traded)#1',
    hand: Object.freeze(['PRESENT']),
    ground: 'the arrangement stands and is treated as it stands',
  }),
  Object.freeze({
    id: 'stressors.generated.js::DS-STR-1::DISEASE OUTBREAK#5',
    hand: Object.freeze(['PRESENT']),
    ground: 'the doors are marked and the marking is recent — one standing condition',
  }),
  Object.freeze({
    id: 'stressors.generated.js::DS-STR-2::ORIGIN: abandoned_agent#0',
    hand: Object.freeze(['HISTORY', 'PRESENT']),
    ground: 'the block IS an ORIGIN field (event provenance); the agent set it in motion and stopped, then the work continues',
  }),
  Object.freeze({
    id: 'stressors.generated.js::DS-CND-1::FAMILY: occupation layer#1',
    hand: Object.freeze(['PRESENT']),
    ground: 'administration and its arithmetic are both the standing condition',
  }),
  Object.freeze({
    id: 'warFaith.generated.js::DS-WAR-2::security · defaulted#2',
    hand: Object.freeze(['PRESENT']),
    ground: 'the town arms and offers no account — one standing posture',
  }),
  Object.freeze({
    id: 'warFaith.generated.js::DS-WAR-5::posture demobilizing#2',
    hand: Object.freeze(['PRESENT', 'CONSEQUENCE', 'HISTORY']),
    ground: 'the unbuilding stands, the loss is the cost, and "a season after the fighting stopped" is the temporal anchor',
    revisedAfterSeeing: true,
  }),
  Object.freeze({
    id: 'warFaith.generated.js::DS-FTH-1::DEVOTION: secular#0',
    hand: Object.freeze(['PRESENT', 'TRADITION']),
    ground: 'devotion\'s state, then the rites as a custom kept',
  }),
  Object.freeze({
    id: 'warFaith.generated.js::DS-FTH-3::PANTHEON RANK: Minor#2',
    hand: Object.freeze(['PRESENT']),
    ground: 'one standing description of the faith\'s spread',
  }),
]);

/**
 * CONTROL 1 — THE OWNER'S OWN TEMPLATE. Every unit runs one order. It must RED on arm A
 * (share 1.0) and on arm B1 (run 1.0). If it passes, the walker measures nothing.
 * @type {ReadonlyArray<string>}
 */
export const OWNER_TEMPLATE_SEQUENCE = Object.freeze(Array.from({ length: 40 }, () => 'E1'));

/**
 * CONTROL 2 — THE ROTA. A deterministic cycle must PASS arms A and B1 (equal shares, zero
 * repeats) and RED on arm B3 (every successor at 1.0). Without this control the walker
 * licenses a metronome at period four.
 * @type {ReadonlyArray<string>}
 */
export const ROTA_SEQUENCE = Object.freeze(
  Array.from({ length: 40 }, (unused, i) => ['E1', 'E2', 'E3', 'E4'][i % 4]),
);

/**
 * CONTROL 5 (POSITIVE) — an independent fair draw over n orders. It must PASS every arm.
 * A walker that reds a fair draw has a ceiling below 1/n, which is the unsatisfiable-ceiling
 * error the herald refuter caught.
 * @param {number} n
 * @param {number} length
 * @param {number} [seed]
 * @returns {string[]}
 */
export function fairDraw(n, length, seed = 12345) {
  // A small deterministic LCG — the control must be reproducible, and a fair draw with a
  // seed nobody can re-run is not a control.
  let state = seed >>> 0;
  const out = [];
  for (let i = 0; i < length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    out.push(`O${state % n}`);
  }
  return out;
}

/**
 * SYNTHETIC EXEMPLAR BANDS — six labelled metric sets whose min…max forms a band wide enough
 * to score against. NOT the real exemplar bands: those are derived from the fourteen
 * exemplar records, which live outside this repo and are not this lane's to import. The real
 * bands are supplied to the walker as an argument and measured in the lane's receipt.
 * @type {Readonly<Record<string, Record<string, number>>>}
 */
export const SYNTHETIC_BANDS = Object.freeze({
  'punctuation.semicolonRate': Object.freeze({ lo: 0.01, hi: 0.20 }),
  'punctuation.colonRate': Object.freeze({ lo: 0.01, hi: 0.10 }),
  'shapes.triadRate': Object.freeze({ lo: 0.02, hi: 0.15 }),
  'shapes.whichTailRate': Object.freeze({ lo: 0.00, hi: 0.04 }),
  'shapes.adverbsPerSentence': Object.freeze({ lo: 0.10, hi: 0.40 }),
  'closers.abstractNounRate': Object.freeze({ lo: 0.01, hi: 0.12 }),
  'closers.pronounRate': Object.freeze({ lo: 0.00, hi: 0.06 }),
  'openers.sameOpenerAsPreviousRate': Object.freeze({ lo: 0.03, hi: 0.17 }),
  'wordsPerSentence.shareUnder8': Object.freeze({ lo: 0.02, hi: 0.20 }),
  'wordsPerSentence.shareOver30': Object.freeze({ lo: 0.02, hi: 0.20 }),
  'wordsPerSentence.neighbourVariation': Object.freeze({ lo: 0.40, hi: 0.70 }),
  'punctuation.emDashRate': Object.freeze({ lo: 0.00, hi: 0.10 }),
  'punctuation.questionRate': Object.freeze({ lo: 0.00, hi: 0.05 }),
  'punctuation.exclamationRate': Object.freeze({ lo: 0.00, hi: 0.02 }),
  'punctuation.parenthesisRate': Object.freeze({ lo: 0.00, hi: 0.08 }),
  'shapes.antithesisRate': Object.freeze({ lo: 0.00, hi: 0.06 }),
  'shapes.participialOpenerRate': Object.freeze({ lo: 0.00, hi: 0.05 }),
  'shapes.doubledAdjectiveRate': Object.freeze({ lo: 0.00, hi: 0.05 }),
  'shapes.thereIsOpenerRate': Object.freeze({ lo: 0.00, hi: 0.05 }),
  'shapes.dialogueShare': Object.freeze({ lo: 0.00, hi: 0.10 }),
  runsOfThreeSameLengthBand: Object.freeze({ lo: 0.15, hi: 0.45 }),
});

/**
 * THE CEILING SHAPE — the chair's recommended values, as a caller's ARGUMENT.
 *
 * They live in a fixture rather than in the walker for two reasons that agree. The walker's
 * own header says every number is the OWNER'S (Q4; §912.3) and a baked default would make a
 * recommendation law by shipping. And the estate's tuning register counts a module-level
 * number under `src/domain` as an unregistered dial, which is the same objection with a lint
 * rule behind it.
 *
 * `slack` 0.10 and `ratioCap` 1.5 give `min(1/n + 0.10, 1.5/n)` — SITTING B.3's correction to
 * R-DA-17, which holds the ceiling at or under 1.6× uniform at every n. `runFloor` 0.05 is
 * Part B §10 item 8's floor under `1/n + 2 SE`. `successorCeiling` 0.50 is arm B3's.
 * @type {Readonly<{slack: number, ratioCap: number, runFloor: number, successorCeiling: number}>}
 */
export const CHAIR_CEILINGS = Object.freeze({
  slack: 0.10,
  ratioCap: 1.5,
  runFloor: 0.05,
  successorCeiling: 0.50,
  // ARM E's REGISTER-LEVEL CEILINGS, quoted from MOVE-GRAMMAR §4.3's own recommendation row
  // ("pools uniform in grammar ≤ 0.30 (test this); pools uniform in segment count R1 0.576 →
  // ≤ 0.40; repeated opener R1 0.112 → ≤ 0.030"). They are the CALLER's numbers, supplied
  // here so control 4 can red on the arm instead of on two helper functions.
  spread: Object.freeze({
    uniformGrammar: 0.30,
    uniformSegments: 0.40,
    repeatedOpener: 0.030,
  }),
});

/** The chair's three numbers, as VALUES a caller supplies — never as constants a walker bakes. */
export const CHAIR_THREE_NUMBERS = Object.freeze({
  budgetShare: 1 / 3,
  expectedShare: 1 / 6,
  depthBandWidths: 0.5,
  definingFeatures: Object.freeze([]),
});

/**
 * Controls for the arms the sitting owed one each. Every entry MUST produce the named
 * finding; a control that cannot fire is a red for that reason.
 * @type {ReadonlyArray<{arm: string, text: string, expect: string}>}
 */
export const ARM_CONTROLS = Object.freeze([
  Object.freeze({ arm: 'F1', text: 'After the fire came, the granary stands half full.', expect: 'a cause before the state (wall 1)' }),
  Object.freeze({ arm: 'F3', text: 'There is no watch here, and the walls are kept up.', expect: 'an ABSENCE opens the variant (wall 3)' }),
  Object.freeze({ arm: 'F6', text: 'The hall keeps the rolls. The rolls are current. The clerk is paid.', expect: '3 sentences' }),
  Object.freeze({ arm: 'F6', text: 'The hall keeps the rolls, which are current.', expect: 'a QUALIFY carried as a "which" tail' }),
  Object.freeze({ arm: 'F2', text: 'The granary will hold through the winter.', expect: 'a bare future indicative' }),
  Object.freeze({ arm: 'G/FORECAST', text: 'The tolls will rise before the spring fair.', expect: 'FORECAST' }),
  Object.freeze({ arm: 'G/MEANING', text: 'The tolls are farmed out, which means the hall has no direct receipt.', expect: 'MEANING' }),
  Object.freeze({ arm: 'G/VERDICT', text: 'The hall keeps its rolls admirably.', expect: 'VERDICT' }),
  Object.freeze({ arm: 'G/FEELING', text: 'The quarter resents the levy.', expect: 'FEELING' }),
  Object.freeze({ arm: 'G/FIGURE', text: 'The market empties like a tide going out.', expect: 'FIGURE' }),
  Object.freeze({ arm: 'G/SAYING', text: 'As the saying goes here, the toll bar never sleeps.', expect: 'SAYING' }),
]);

/**
 * ARM D's control pair: one variant naming a slot the bag offers, one naming a slot it does
 * not. The first must pass and the second must fail, or the arm is reading the sentence
 * rather than the bag.
 * @type {Readonly<{bag: ReadonlyArray<string>, passes: string, fails: string}>}
 */
export const ARM_D_CONTROL = Object.freeze({
  bag: Object.freeze(['settlement', 'seat']),
  passes: 'The {seat} at {settlement} keeps its own rolls.',
  fails: 'The {institution} at {settlement} keeps its own rolls.',
});

/**
 * ARM D's (BLOCK, POOL) CONTROL — gap (e), which the code keyed on the BLOCK alone while its
 * own comment said otherwise.
 *
 * TWO POOLS OF ONE BLOCK WITH DIFFERENT LICENCES, which is the shape the estate actually
 * ships: `craftSlots` fills `{resource}` on one pool of `DS-GEN-18` and refuses it on
 * another. Keyed by block, ONE bag is a superset of both and licenses a claim the narrower
 * pool cannot make; keyed by (block, pool) the two resolve differently, and that difference
 * is the whole of gap (e).
 * @type {Readonly<{block: string, wide: string, narrow: string, text: string,
 *   wideBag: ReadonlyArray<string>, narrowBag: ReadonlyArray<string>}>}
 */
export const ARM_D_PAIR_CONTROL = Object.freeze({
  block: 'DS-BLOCK',
  wide: 'wide-pool',
  narrow: 'narrow-pool',
  text: 'The {resource} out of {settlement} moves by cart.',
  wideBag: Object.freeze(['settlement', 'resource']),
  narrowBag: Object.freeze(['settlement']),
});

/**
 * U5's FIXTURE — arm A reads the TAG on a tagged pool and the classifier only reports
 * (SITTING K.2 as §L.2 item 67 rules it).
 *
 * Every variant carries `grammar:` and every one carries the SAME tag, so the tagged share is
 * 1.0 and any ceiling fails it. The TEXTS are deliberately varied enough that the classifier
 * reads more than one order — so a walker scoring the classifier instead of the tag produces
 * a different histogram, and the test can tell which one arm A used.
 * @type {ReadonlyArray<{id: string, text: string, grammar: string, block: string, pool: string}>}
 */
export const TAGGED_POOL = Object.freeze([
  Object.freeze({ id: 't0', text: 'The granary stands half full.', grammar: 'V1', block: 'DS-TAG', pool: 'p' }),
  Object.freeze({ id: 't1', text: 'The toll bar is manned, and it has been since the bridge was rebuilt.', grammar: 'V1', block: 'DS-TAG', pool: 'p' }),
  Object.freeze({ id: 't2', text: 'There is no watch here.', grammar: 'V1', block: 'DS-TAG', pool: 'p' }),
  Object.freeze({ id: 't3', text: 'The quay is busy because the river runs deep at the ford.', grammar: 'V1', block: 'DS-TAG', pool: 'p' }),
]);

/**
 * C-SIBLING's control: two variants of one cell banding ONE noun two ways. A pool whose
 * variants merely say different amounts is NOT a contradiction and must pass.
 * @type {Readonly<{conflicting: ReadonlyArray<string>, lawful: ReadonlyArray<string>}>}
 */
export const C_SIBLING_CONTROL = Object.freeze({
  conflicting: Object.freeze([
    'A few souls left the town this season.',
    'Several hundred souls left the town this season.',
  ]),
  lawful: Object.freeze([
    'A few souls left the town this season.',
    'The departure rolls are thin, and everyone can name who is on them.',
  ]),
});
