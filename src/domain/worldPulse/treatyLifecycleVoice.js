/**
 * domain/worldPulse/treatyLifecycleVoice.js — GR-0 THE LIFECYCLE VOICE.
 *
 * The survey's verdict, verbatim: "the grammar speaks at a treaty's birth and its
 * deliberate murder and at no other moment of the lifecycle." Two of those silent moments
 * already exist as executed code in `peaceTerms.js` and cost nothing to observe: the prune
 * that retires a spent instrument (V-10 — `delete nextLedger[key]`, no beat, no kind), and
 * the tick a monitoring court's OBSERVED compliance first crosses out of honored (V-6).
 * This leaf turns each into a sentence, and owns the two reads the dossier surfaces need.
 *
 * ── WHAT THIS FILE IS AND IS NOT ────────────────────────────────────────────────
 * It is a PURE LEAF: same inputs, same output, no world writes, no ledger writes, no rng.
 * `peaceTerms.js` decides that a treaty lapsed or that a court noticed; this composes the
 * beat. That split is why the head pays ~6 effective lines for the whole wave, and it is
 * the `peaceTermsSale.js` discipline applied to a reader instead of a writer.
 *
 * ── THE DETECTION CROSSING IS A TRANSITION, NOT A LEVEL ─────────────────────────
 * `evolveCompliance` runs every tick on every live term, so "observed state is defaulted"
 * is true on EVERY tick of a standing default. A beat keyed on that level would narrate
 * the same shortfall fifty-two times a year. The beat is keyed on the CROSSING: the
 * treaty's previously RECORDED observed compliance was honored, and this tick's is not.
 * Two observations are required to see a transition, so `firstObservedCrossing` refuses a
 * treaty that was minted THIS tick — one observation is a level, and a mint-tick "crossing"
 * would let a single-tick harness certify a pin that cannot see what it claims to
 * (JUDGMENT, vetoable; the vacuous-absence law's sibling).
 *
 * ── THE FOG IS THE LAW (Law One) ────────────────────────────────────────────────
 * The detection beat speaks the OBSERVED state only. An undetected cheat — true delivery
 * short, monitor reach under `DETECT_FLOOR` — mints NOTHING, in any feed. The engine models
 * what courts believe, and an unbelieved default is not yet a story. The same rule shapes
 * the endings: `pactEndingOf` returns the PUBLIC ending (what the courts recorded) beside
 * the TRUE one, and only the public ending ever reaches a beat. `hollowed_quiet` — the
 * ending of a pact that was hollow and never caught — is a real vocabulary member returned
 * here and deliberately UNSPOKEN; its prose lands with a ground-truth surface (GR-7).
 *
 * ── CLOCKS ─────────────────────────────────────────────────────────────────────
 * Age is read on the TREATY'S OWN clock marker (`treatyTicksPerYearOf` — 52 current,
 * legacy 12 by explicit marker, V-5's provenance discipline), from `signedTick` where the
 * record carries one and `mintedTick` otherwise. Ages are spoken as BAND WORDS, never
 * integers (the annex's no-digits law).
 *
 * @enforced-by tests/domain/treatyLifecycleVoice.test.js
 *   + tests/lint/grammarLifecycleKindPools.walker.test.js
 *   + tests/property/treatyLifecycleVoiceDormancyFence.test.js
 */

import { termLabel } from './peaceTermsCatalog.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { treatyTicksPerYearOf } from './treatyClock.js';
import { grammarReceipt, grammarSlotRoles } from './grammarNews.js';
import { stablePart } from './stablePart.js';

/** @typedef {import('./peaceTermsCatalog.js').TermRecord} TermRecord */

/**
 * THE GATE (§3, the CQ5 law). A virtual key: absent from DEFAULT_SIMULATION_RULES and from
 * every preset, read by NAME and by exact `=== true`, and manifested in
 * ENGINE_GATED_VIRTUAL_RULE_KEYS in the same commit as this read.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @returns {boolean}
 */
export function treatyLifecycleVoiceActive(worldState) {
  const rules = /** @type {{ treatyLifecycleVoiceEnabled?: unknown }} */ (
    /** @type {{ simulationRules?: unknown }} */ (worldState || {}).simulationRules || {});
  return rules.treatyLifecycleVoiceEnabled === true;
}

/**
 * THE CLOSED PACT-ENDINGS VOCABULARY GR-0 PRODUCES (§GR-7's ledger holds the full nine;
 * these three are this wave's producers). `hollowed_quiet` is ground-truth only.
 * @type {ReadonlyArray<'ran_its_term'|'hollowed_detected'|'hollowed_quiet'>}
 */
export const PACT_ENDINGS = Object.freeze(['ran_its_term', 'hollowed_detected', 'hollowed_quiet']);

/** The endings a PUBLIC beat may ever speak — the fog law, as data. */
export const PUBLIC_PACT_ENDINGS = Object.freeze(['ran_its_term', 'hollowed_detected']);

/**
 * Age classes and their band words. Owner-tunable (the GR-0 age-phrase thresholds of the
 * volume's §7); band WORDS because the corpus may carry no digits.
 * @type {ReadonlyArray<{ id:'young'|'settled'|'old', underYears:number, word:string }>}
 */
export const TREATY_AGE_BANDS = Object.freeze([
  Object.freeze({ id: 'young', underYears: 5, word: 'a few' }),
  Object.freeze({ id: 'settled', underYears: 20, word: 'many' }),
  Object.freeze({ id: 'old', underYears: Infinity, word: 'a great many' }),
]);

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * A party's reader NAME, or '' when the record never resolved one. Fails CLOSED: a name
 * that is merely the id echoed back is not a name, and a beat rendering a slug where a
 * town belongs is the fabrication the address law forbids.
 * @param {string} id @param {string} name @returns {string}
 */
function readerName(id, name) {
  const resolved = text(name);
  return resolved && resolved !== text(id) ? resolved : '';
}

/**
 * Whole elapsed years on the treaty's OWN clock marker. Zero for a record with no start
 * tick — never a negative, never a guess.
 * @param {Record<string, unknown> | null | undefined} treaty @param {number} tick
 * @returns {number}
 */
export function treatyAgeYears(treaty, tick) {
  const signed = Number(/** @type {{ signedTick?: unknown }} */ (treaty || {}).signedTick);
  const minted = Number(/** @type {{ mintedTick?: unknown }} */ (treaty || {}).mintedTick);
  const start = Number.isFinite(signed) ? signed : minted;
  const elapsed = Number(tick) - start;
  if (!Number.isFinite(start) || !(elapsed > 0)) return 0;
  return Math.floor(elapsed / treatyTicksPerYearOf(treaty));
}

/** The age class for a whole-year count. @param {number} ageYears */
export function treatyAgeClass(ageYears) {
  const years = Number(ageYears) || 0;
  return (TREATY_AGE_BANDS.find((band) => years < band.underYears) || TREATY_AGE_BANDS[2]).id;
}

/** The band WORD for a whole-year count (never a digit). @param {number} ageYears */
export function treatyAgeBandWord(ageYears) {
  const years = Number(ageYears) || 0;
  return (TREATY_AGE_BANDS.find((band) => years < band.underYears) || TREATY_AGE_BANDS[2]).word;
}

/** @param {unknown} state */
function isBroken(state) {
  return state === 'strained' || state === 'defaulted';
}

/**
 * The pact's ending, twice: what the courts RECORDED (public) and what actually happened
 * (ground truth). They differ exactly when a real shortfall was never detected, which is
 * the whole point of the fog and the reason `hollowed_quiet` exists.
 * @param {{ observedWorst?: unknown, trueWorst?: unknown }} input
 * @returns {{ ending:'ran_its_term'|'hollowed_detected', trueEnding:'ran_its_term'|'hollowed_detected'|'hollowed_quiet' }}
 */
export function pactEndingOf({ observedWorst, trueWorst } = {}) {
  if (isBroken(observedWorst)) return { ending: 'hollowed_detected', trueEnding: 'hollowed_detected' };
  return { ending: 'ran_its_term', trueEnding: isBroken(trueWorst) ? 'hollowed_quiet' : 'ran_its_term' };
}

/**
 * THE GRAMMAR × INFORMATION READ (§6 seam 5). Every treaty between this pair whose signing
 * tick fell inside the window, with the believed margin it was priced on — so an exposed
 * strength-lie's receipt can name the peace that lie purchased.
 *
 * LANDED HERE, CONSUMED BY FP-INFORMATION. The tripwire pin asserts this export has no
 * `src/` consumer; it reds the day IN wires the exposure path, which is the handoff signal.
 *
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {unknown} aId @param {unknown} bId
 * @param {{ fromTick?: unknown, toTick?: unknown }} window inclusive on both ends
 * @returns {Array<{ pairKey:string, signedTick:number, believedMarginAtSignature:number, parties:string[] }>}
 */
export function treatiesPricedDuring(worldState, aId, bId, window) {
  const ledger = treatyLedgerOf(worldState);
  const from = Number(/** @type {{ fromTick?: unknown }} */ (window || {}).fromTick);
  const to = Number(/** @type {{ toTick?: unknown }} */ (window || {}).toTick);
  if (!ledger || !Number.isFinite(from) || !Number.isFinite(to) || to < from) return [];
  const a = String(aId); const b = String(bId);
  /** @type {Array<{ pairKey:string, signedTick:number, believedMarginAtSignature:number, parties:string[] }>} */
  const out = [];
  for (const pairKey of Object.keys(ledger).sort()) {
    const treaty = /** @type {Record<string, unknown>} */ (ledger[pairKey]);
    const parties = Array.isArray(treaty?.parties) ? treaty.parties.map(String) : [];
    if (!parties.includes(a) || !parties.includes(b)) continue;
    const signed = Number(treaty.signedTick);
    const at = Number.isFinite(signed) ? signed : Number(treaty.mintedTick);
    if (!Number.isFinite(at) || at < from || at > to) continue;
    out.push({
      pairKey,
      signedTick: at,
      believedMarginAtSignature: Number(treaty.believedMarginAtSignature) || 0,
      parties,
    });
  }
  return out;
}

/** SP-6 presentation weight by significance class. @param {string} significance */
function presentationWeight(significance) {
  if (significance === 'routine') return { severity: 0.34, score: 36 };
  return { severity: 0.56, score: 58 };
}

/**
 * The term this beat names. Deterministic and stated rather than picked: the LAST term to
 * expire is what actually closed the instrument, ties broken codepoint by type.
 * @param {TermRecord[]} terms @returns {TermRecord | null}
 */
function closingTerm(terms) {
  /** @type {TermRecord | null} */
  let best = null;
  for (const term of terms) {
    if (!best) { best = term; continue; }
    const d = (Number(term.expiresTick) || 0) - (Number(best.expiresTick) || 0);
    if (d > 0 || (d === 0 && String(term.type) < String(best.type))) best = term;
  }
  return best;
}

/**
 * Bind the pool's `{settlement}` / `{counterpart}` to this treaty's parties under the
 * pool's OWN declared roles (see grammarNews's inversion note), plus the evidence slots.
 * Returns null when either name failed to resolve — fail closed.
 * @param {string} kind
 * @param {{ obligeeName:string, obligorName:string }} names
 * @param {Record<string, string>} extra
 */
function interpFor(kind, names, extra) {
  if (!names.obligeeName || !names.obligorName) return null;
  const roles = grammarSlotRoles(kind);
  const partyFor = (/** @type {string} */ role) => (role === 'obligor' ? names.obligorName : names.obligeeName);
  return { settlement: partyFor(roles.settlement), counterpart: partyFor(roles.counterpart), ...extra };
}

/**
 * THE LAPSE BEAT (V-10's silence, ended). One beat per spent instrument: the eulogy names
 * both courts, the term that closed it, the age in band words and the recorded ending, and
 * the warning clause says the road between them is open again — which is true the same
 * tick, because `treatyEligibleWarTargets` starts returning the pair the moment the
 * instrument leaves the ledger.
 *
 * Returns an ARRAY so the caller's hook is one spread: an unresolvable record yields [].
 *
 * @param {{ treaty: Record<string, unknown>, terms: TermRecord[], tick: number,
 *   observedWorst: string, orientation: { obligeeId:string, obligorId:string,
 *   obligeeName:string, obligorName:string, resolved:boolean } }} input
 * @returns {Array<Record<string, unknown>>}
 */
export function treatyLapsedBeats({ treaty, terms, tick, observedWorst, orientation }) {
  if (!orientation?.resolved) return [];
  const obligeeName = readerName(orientation.obligeeId, orientation.obligeeName);
  const obligorName = readerName(orientation.obligorId, orientation.obligorName);
  const names = { obligeeName, obligorName };
  const closing = closingTerm(Array.isArray(terms) ? terms : []);
  // The last recorded TRUE states: every term expired before reaching evolveCompliance
  // this tick, so these are the previous tick's ground truth — which is the honest
  // source, and the only one a pruned instrument still has.
  const trueStates = (Array.isArray(terms) ? terms : []).map((term) => String(term.trueState || 'honored'));
  const trueWorst = trueStates.includes('defaulted') ? 'defaulted'
    : trueStates.includes('strained') ? 'strained' : 'honored';
  // `pactEndingOf` also returns the GROUND-TRUTH ending, and this beat deliberately
  // takes only the public one — see the note at the end of the entry below.
  const { ending } = pactEndingOf({ observedWorst, trueWorst });
  const ageYears = treatyAgeYears(treaty, tick);
  const extra = {
    band: treatyAgeBandWord(ageYears),
    ...(closing ? { term: termLabel(String(closing.type)) } : {}),
  };
  const interp = interpFor('treaty_lapsed', names, extra);
  if (!interp) return [];
  const sourceEventId = `${orientation.obligeeId}.${orientation.obligorId}.${tick}`;
  const eulogy = grammarReceipt('treaty_lapsed', sourceEventId, interp, ending);
  if (!eulogy) return [];
  const endingLine = grammarReceipt(ending, sourceEventId, interpFor(ending, names, extra) || {}, ending);
  const roadOpen = grammarReceipt('treaty_lapsed.road_open', sourceEventId, interpFor('treaty_lapsed.road_open', names, extra) || {}, ending);
  const weight = presentationWeight(eulogy.significance);
  return [{
    id: `wizard_news.${tick}.treaty_lapsed.${stablePart(orientation.obligeeId)}.${stablePart(orientation.obligorId)}`,
    kind: 'treaty_lapsed',
    // ITS OWN impactKind, never `diplomacy`. The Herald's SINGLE_PRODUCER_KEYS walker pins
    // `diplomacy` to the one treaty signing beat, so a second producer of that token would
    // inherit its desk silently and red the walker — the walker's own TO-COMPLY note.
    impactKind: 'treaty_lapsed',
    significance: eulogy.significance,
    severity: weight.severity,
    score: weight.score,
    tick,
    scope: 'regional',
    headline: `The pact between ${obligeeName} and ${obligorName} has run out`,
    summary: eulogy.line,
    reasons: [
      'Every term of the instrument reached its own expiry, so the record was closed on the treaty\'s own calendar.',
      ...(endingLine ? [endingLine.line] : []),
      ...(roadOpen ? [roadOpen.line] : []),
    ],
    settlementIds: [orientation.obligeeId, orientation.obligorId],
    settlementNames: [obligeeName, obligorName],
    parties: [orientation.obligeeId, orientation.obligorId],
    ending,
    ageYears,
    familyId: eulogy.familyId,
    audience: eulogy.audience,
    section: eulogy.section,
    tags: ['world_pulse', 'pact_grammar', 'lifecycle'],
    // GROUND TRUTH IS NOT PUBLISHED. `trueEnding` is computed above and deliberately not
    // carried on this entry: a news record has no per-key ground-truth projection, so a
    // quiet hollowing riding a public beat would leak exactly what the fog exists to hide.
    // The value is returned by pactEndingOf for the surfaces that may see it.
  }];
}

/**
 * THE DETECTION BEAT (V-6's crossing, spoken). Minted only where a court's own watchers
 * saw the shortfall; the caller owns the crossing test, this owns the sentence.
 *
 * @param {{ tick: number, observedState: string, terms: TermRecord[],
 *   orientation: { obligeeId:string, obligorId:string, obligeeName:string,
 *   obligorName:string, resolved:boolean } }} input
 * @returns {Array<Record<string, unknown>>}
 */
export function treatyDefaultDetectedBeats({ tick, observedState, terms, orientation }) {
  if (!orientation?.resolved || !isBroken(observedState)) return [];
  const obligeeName = readerName(orientation.obligeeId, orientation.obligeeName);
  const obligorName = readerName(orientation.obligorId, orientation.obligorName);
  const names = { obligeeName, obligorName };
  const live = (Array.isArray(terms) ? terms : []).slice()
    .sort((a, b) => (String(a.type) < String(b.type) ? -1 : String(a.type) > String(b.type) ? 1 : 0));
  // NO FABRICATED BAND: the engine keeps no count of short seasons, so `{band}` is simply
  // never supplied here and the two families that ask for it stay ineligible.
  /** @type {Record<string, string>} */
  const extra = live.length ? { term: termLabel(String(live[0].type)) } : {};
  const interp = interpFor('treaty_default_detected', names, extra);
  if (!interp) return [];
  const sourceEventId = `${orientation.obligeeId}.${orientation.obligorId}.${tick}`;
  const receipt = grammarReceipt('treaty_default_detected', sourceEventId, interp, observedState);
  if (!receipt) return [];
  const weight = presentationWeight(receipt.significance);
  return [{
    id: `wizard_news.${tick}.treaty_default_detected.${stablePart(orientation.obligeeId)}.${stablePart(orientation.obligorId)}`,
    kind: 'treaty_default_detected',
    impactKind: 'treaty_default_detected',
    significance: receipt.significance,
    severity: weight.severity,
    score: weight.score,
    tick,
    scope: 'regional',
    headline: observedState === 'defaulted'
      ? `${obligeeName}'s court enters ${obligorName} in default`
      : `${obligeeName} finds ${obligorName}'s deliveries running short`,
    summary: receipt.line,
    reasons: [
      'The owed court\'s watchers stood close enough to weigh what arrived, and what arrived did not match what was sworn.',
    ],
    settlementIds: [orientation.obligeeId, orientation.obligorId],
    settlementNames: [obligeeName, obligorName],
    parties: [orientation.obligeeId, orientation.obligorId],
    observedState,
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    tags: ['world_pulse', 'pact_grammar', 'lifecycle'],
  }];
}
