/**
 * giftsAndDebtsRead.js — D7 THE LEDGER OF GIFTS AND DEBTS read-model (DESIGN_SIM_DEPTH_R2
 * §D7, consumer 5). Per directed pair, each remembered act shows BOTH readings: the FROZEN
 * FACT (the obligation the immutable ledger recorded — nominal kind + magnitude), the
 * OBSERVER'S CURRENT READING (the belief-side reframe interpretation), and — in the DM-truth
 * lane only — the TRUE MINT INTENT (predatory / kind), with a DIVERGENCE that names where the
 * belief and the truth part ways. This is the dramatic-irony surface's motive-divergence
 * beside fact-divergence: the DM sees the war brewing over a kindness misremembered.
 *
 * Built on the credibilityRead / settlementRumors idiom: the observer's own reading is built
 * unconditionally (player-safe — a court's own interpretation is its own to hold); the TRUE
 * mint intent + divergence are spliced ONLY when includeGroundTruth === true (the premium /
 * DM-truth seam, fail-closed). A player-safe view shows only the observer's reading.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on absent/garbage
 * ledgers; every list codepoint-sorted. Reads domain (worldPulse), never the reverse. Lazy-only
 * leaf (rides the inspector / realm-dashboard chunk) so it is byte-inert to the engine and its
 * goldens — it must NOT be imported by dossierViewModel.js or any eager store slice.
 *
 * DELIBERATELY DEFERRED — documented, not a bug to re-find (DESIGN_SIM_DEPTH_R2 §D7 consumer 6,
 * "Whisper + glossary entries"): the reframe glossary compendium terms + the reframe whisper are
 * NOT wired this wave. The whisper registry (guidanceRegistry.js) is strict (UNWIRED_WHISPERS is
 * empty) and requires a WIRED UI COMPONENT HOST to render — a component-lane change outside this
 * wave's worldPulse/display-read-model scope. The reframe VOCABULARY (reframeKernel.REFRAME_VOCAB)
 * + this read-model already carry the data those surfaces would present; wiring them is a
 * display-lane follow-up. D7's explicit consumer charge (war reasons, restitution, corruption
 * leash, DECLARE_CASUS, this ledger read) is complete.
 */
import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import { reframeReadingOf, isDarkReading, isBrightReading, REFRAME_VOCAB } from '../worldPulse/reframeKernel.js';

/** @param {unknown} v @returns {v is Record<string, unknown>} */
const isObj = (v) => !!v && typeof v === 'object';

/** The frozen fact's nominal reading (what the ledger says the act WAS): gift vs loan vs
 *  intervention → the act class the reframe layer re-reads. @param {string} kind */
function nominalActClass(kind) {
  return String(kind) === 'intervention' ? 'military' : 'aid';
}

/**
 * The player-safe reading of ONE frozen act between (observer, subject): the nominal fact +
 * the observer's current reframe reading (or the base term when the pair never transitioned).
 * @param {Record<string, unknown>} worldState
 * @param {string} observerId @param {string} subjectId
 * @param {{ kind?: unknown, magnitude?: unknown, mintTick?: unknown }} rec
 * @param {'giver'|'bearer'} role  giver = the observer gave this aid; bearer = the observer owes it
 */
function projectAct(worldState, observerId, subjectId, rec, role) {
  const kind = String(rec?.kind || 'grain_relief');
  // A giver re-reads the AID/MILITARY class; a bearer re-reads the TRIBUTE (obligation) class.
  const actClass = role === 'giver' ? nominalActClass(kind) : 'tribute';
  const vocab = REFRAME_VOCAB[actClass];
  const r = reframeReadingOf(worldState, observerId, subjectId, actClass);
  return {
    actClass,
    role,
    kind,                                   // the FROZEN nominal fact (gift/credit/intervention)
    magnitude: round4(Number(rec?.magnitude) || 0),
    mintTick: Number.isFinite(Number(rec?.mintTick)) ? Number(rec.mintTick) : null,
    // The observer's CURRENT reading — the belief. Absent transition ⇒ the base (frozen) term.
    reading: r ? r.reading : (vocab ? vocab.base : 'gift'),
    sign: r ? r.sign : 'neutral',
    lean: r ? r.lean : 0,
    sinceTick: r ? r.sinceTick : null,
  };
}

/** @param {number} n @returns {number} */
function round4(n) { return Math.round(n * 10000) / 10000; }

/**
 * THE per-pair ledger of gifts and debts: every obligation between (observerId, subjectId),
 * each with the observer's reading. In the DM-truth lane (includeGroundTruth) each act gains a
 * `truth` block — the true mint intent (predatory / kind) + a `divergence` when the observer's
 * BELIEVED reading does not match that truth (the false-reframe irony). Null-safe: absent
 * obligations ledger ⇒ { acts: [] }.
 * @param {{ worldState: Record<string, unknown>, observerId: string, subjectId: string,
 *           includeGroundTruth?: boolean }} args
 */
export function giftsAndDebtsFor({ worldState, observerId, subjectId, includeGroundTruth = false }) {
  const obl = /** @type {Record<string, Record<string, unknown>> | null} */ (getSpatialLedger(worldState, 'obligations'));
  const obs = String(observerId);
  const subj = String(subjectId);
  /** @type {Array<Record<string, unknown>>} */
  const acts = [];
  if (isObj(obl)) {
    for (const key of Object.keys(obl).sort(compareCodepoint)) {
      const rec = obl[key];
      const from = String(rec?.from ?? '');   // debtor
      const to = String(rec?.to ?? '');       // creditor
      // The observer GAVE this aid (observer is the creditor `to`; subject is the debtor `from`).
      // The observer BEARS this debt (observer is the debtor `from`; subject is the creditor `to`).
      const role = (to === obs && from === subj) ? 'giver' : (from === obs && to === subj) ? 'bearer' : null;
      if (!role) continue;
      const act = projectAct(worldState, obs, subj, rec, role);
      if (includeGroundTruth) {
        const predatory = rec?.predatory === true;
        const believedDark = isDarkReading(act.reading);
        const believedBright = isBrightReading(act.reading);
        // The IRONY: the observer believes a debt/extortion the mint intent does not support, or
        // credits a kindness that was truly a leash. Named so the DM reads the misjudgment.
        let divergence = '';
        if (believedDark && !predatory) divergence = 'a debt believed, but the aid was freely given — a war brews over a kindness misremembered';
        else if (believedBright && predatory) divergence = 'a kindness credited, but the aid was minted to indebt — the leash unseen';
        else if (!believedDark && !believedBright && predatory) divergence = 'read as an honest gift; the true intent was leverage';
        act.truth = {
          predatoryIntent: predatory,
          trueKind: String(rec?.kind || 'grain_relief'),
          ...(divergence ? { divergence } : {}),
        };
      }
      acts.push(act);
    }
  }
  return { observerId: obs, subjectId: subj, acts };
}

/**
 * The realm-wide roll of every directed pair that holds at least one reframe READING (a
 * transition has fired). Sorted codepoint-stable. `[]` when the reframe layer is dark.
 * @param {{ worldState: Record<string, unknown>, includeGroundTruth?: boolean,
 *           nameFor?: (id: string) => string }} args
 */
export function realmGiftsAndDebts({ worldState, includeGroundTruth = false, nameFor }) {
  if (!hasSpatialLedger(worldState, 'reframes')) return [];
  const ledger = /** @type {Record<string, { readings?: Record<string, unknown> }> | null} */ (getSpatialLedger(worldState, 'reframes'));
  if (!isObj(ledger)) return [];
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const pairKey of Object.keys(ledger).sort(compareCodepoint)) {
    const [observerId, subjectId] = String(pairKey).split('>');
    if (!observerId || !subjectId) continue;
    const entry = giftsAndDebtsFor({ worldState, observerId, subjectId, includeGroundTruth });
    const readings = ledger[pairKey]?.readings;
    out.push({
      observerId,
      subjectId,
      observerName: typeof nameFor === 'function' ? nameFor(observerId) : observerId,
      subjectName: typeof nameFor === 'function' ? nameFor(subjectId) : subjectId,
      readings: isObj(readings) ? readings : {},
      acts: entry.acts,
    });
  }
  return out;
}

/** Presence gate: does the campaign hold any reframe reading at all (drop-when-empty ⇒ false)?
 *  @param {Record<string, unknown> | null | undefined} worldState @returns {boolean} */
export function hasGiftsAndDebts(worldState) {
  return hasSpatialLedger(worldState, 'reframes');
}

/** Campaign-scoped presence gate (the credibilityRead idiom).
 *  @param {Record<string, { saves?: Record<string, { worldState?: unknown }> }> | null | undefined} campaigns
 *  @param {string} saveId @returns {boolean} */
export function campaignHasGiftsAndDebts(campaigns, saveId) {
  if (!isObj(campaigns)) return false;
  for (const c of Object.values(campaigns)) {
    const ws = c?.saves?.[String(saveId)]?.worldState;
    if (ws && hasGiftsAndDebts(/** @type {Record<string, unknown>} */ (ws))) return true;
  }
  return false;
}
