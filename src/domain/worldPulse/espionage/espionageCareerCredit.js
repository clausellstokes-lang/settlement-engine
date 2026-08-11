/**
 * espionageCareerCredit.js — ES-5d: §3.14 THE MISSION CREDIT, the career grain's other half.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.14 (J-ES-17). A covert mission that lands at or above the bar
 * it was SENT to clear credits the operative's intra-faction standing: espionage deposits a
 * per-operative credit keyed by the man's ladder identity, and the ladder's OWN maintenance
 * road folds it into that standing's `stock` through the ladder's own writer. ES-5c's grain
 * (the promotion-risk register, `espionageCareer.js`) is the DEBIT side of the same amendment
 * and is deliberately a different leaf; this one never touches it.
 *
 * ⭐ THIS GIVES `freshMissionGradeFor` ITS FIRST CONSUMER WHOSE OUTPUT SURVIVES THE TICK.
 * The grade has been computed since ES-3 and dropped at the pulse mouth on every production
 * path; until this wave it was arithmetic nobody read.
 *
 * ── ⛔ THE ONE THING THIS LEAF WRITES, AND THE ONE THING IT MUST NEVER WRITE ───────────
 * It writes exactly ONE spatial ledger — its own credit deposit, `missionCreditEvents`,
 * spelled as a BARE STRING LITERAL at the write site so the ledger-coverage walker can see
 * it (a key hidden behind an imported constant is a key the walker goes blind to). It writes
 * NO ladder state of any kind: the ladder's own sidecar belongs to the ladder's own writer,
 * and `tests/domain/espionageProducts.test.js` source-scans this whole directory to keep that
 * true. It also never routes the errand ledger's own amender — that census pins exactly ONE
 * espionage module as the errand writer, and this leaf is not it.
 *
 * ── ⛔ THIS LEAF MUST NEVER IMPORT ANY `npcLadder*` FILE ───────────────────────────────
 * The edge runs INFO→INTERIOR in exactly one direction (`npcLadderKernel.js` imports THIS
 * file, licensed by the CPL-20 row `ES5D_CAREER_CREDIT_COUPLING`). Importing back would close
 * the loop, and a barrel hop drags the whole ladder family into the espionage closure. That
 * is also why the ladder-lit gate below is a two-line defensive rules read rather than a call
 * to the ladder's own `npcLadderActive`: the flag is read BY NAME and strictly `=== true`,
 * exactly as the ladder reads it, but reaching for the ladder's function to do it would be
 * the very import the direction forbids. ⚠ If the ladder's flag name ever moves, this read
 * moves with it — the four-fence dormancy file drives both flags so the pair cannot drift
 * apart in silence.
 *
 * ── ⚠⚠ THE DEPOSIT IS CONSUMED ON THE **SAME TICK** IT IS WRITTEN (ES-5d deviation D7) ──
 * MEASURED, NOT INHERITED, AND CITED BY SEAM RATHER THAN BY LINE NUMBER (a line number is text
 * ABOUT source that nothing compares TO source). In pulseKernel.js, `simulateCampaignWorldPulse`
 * calls the espionage product pass at its own `const envoys = advanceEnvoyDiplomacyPulse({` and
 * the ladder chain at `advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize({`,
 * unconditionally and in that order, in ONE function body, both handed the SAME
 * `tick: worldState.tick`. So the depositor runs EARLIER IN THE SAME PULSE than the consumer.
 *
 * That makes this the `readGratitudeBondEvents` twin — the ladder already hoists that Map
 * beside this one, and its header says the reason in as many words: "generosity ran earlier
 * THIS tick; events carry tick === now". It is NOT the `readRoadsBondEvents` shape, whose
 * one-tick lag exists only because ROADS runs LAST, strictly AFTER the ladder.
 *
 * ⛔ A `depositTick === tick - 1` window here would be PROVABLY DEAD, and silently: this
 * pass drops the prior tick's records before writing its own, so by the time the ladder
 * looked for them at tick T they would already be gone — the fold would never fire, on any
 * world, while every unit pin around it stayed green. Do not "restore" the lag.
 *
 * CONSUME-ONCE SURVIVES THE CHANGE UNTOUCHED, by construction rather than by a marker: this
 * pass runs once per pulse and REPLACES the whole record set, the ladder reads once per pulse
 * behind a strict equality on the tick, and a record left behind by a depositor that went
 * dark carries a stale tick that the window can never match again. No consume-once marker is
 * persisted on the standing, which is exactly what keeps the ladder's two key lists — the
 * normalizer and the byte-stable serializer — out of this wave entirely.
 *
 * ── DARK ⇒ NOTHING, AND DARK MINTS NO KEY AT ALL ──────────────────────────────────────
 * Espionage dark ⇒ one flag read and out. Ladder dark ⇒ one flag read and out, with NO
 * write and NO prune (chair ruling CR-ES5D O5: a ledger that accumulates while nothing
 * consumes it is a leak wearing a receipt). A lit tick that credits nobody DROPS the key
 * rather than parking an empty object — drop-when-empty is what keeps every dormancy golden
 * byte-identical, and an empty object would be a key, and a key is a byte.
 *
 * ⚠ A world that goes lit → dark between two pulses strands its last deposit unconsumed and
 * unpruned. That is inert by the window above (its tick can never match again) and it is the
 * same exposure this estate already carries for both of the ladder's existing external
 * deposits. Recorded, not repaired.
 *
 * PURE apart from the one ledger write it owns: no Date, no Math.random, no React, no I/O.
 *
 * @enforced-by tests/domain/espionageCareerCredit.test.js,
 *   tests/property/espionageCareerCreditDormancy.test.js
 */
import { compareCodepoint } from '../../deterministicSort.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../../spatial/distanceRead.js';
import { npcId } from '../npcAgency.js';
import { espionageActive } from './espionageGate.js';
import { MISSION_GRADES, round4 } from './espionageMath.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * THE GRADES THAT CREDIT, and the ratio between them (chair ruling CR-ES5D O3).
 *
 * `exceeded` pays twice `met`; `partial` and `empty` pay ZERO; NOTHING debits. The reason
 * `partial` pays nothing is mechanical rather than editorial: `freshMissionGradeFor` ALREADY
 * caps a mission that left a leg unfilled at `partial`, precisely so a dead leg cannot report
 * success — so crediting `partial` would undo that cap from the other side. A mission that
 * fails is already its own punishment through the errand's existing consequences; a debit
 * here would double-count it.
 * @type {Readonly<Record<string, number>>}
 */
const CREDITED_MULTIPLES = Object.freeze({ exceeded: 2, met: 1 });

/**
 * ⛔ AUTHOR-SET BY THE CHAIR, NOT BY THE IMPLEMENTER (CR-ES5B-6 / CR-ES5C-O4). An
 * implementer may never author or retune dark tuning.
 *
 * `MISSION_CREDIT_MET: 0.15` is stated in the LADDER's own grid, which is the only grid it
 * means anything in: the whole structural height of the ladder — floor rung to top rung — is
 * `SEED_SPREAD: 3.0` stock units, so a met-grade mission pays one twentieth of the ladder's
 * entire height. Roughly twenty sustained met-grade missions move an officer one full
 * rung-spread, against a standing half-life of 156 weeks that is eroding him the whole time.
 * That is a career's worth of work rather than a season's, which is the register §3.14
 * describes. ⚠ The espionage `*_W` family's `0.5` parity does NOT transfer: those are weights
 * inside a 0..1 ratio, and this is an additive delta on a 0..10 stock.
 *
 * ⭐ `GRADE_MULTIPLE` IS DERIVED FROM THE FROZEN `MISSION_GRADES` EXPORT AND NEVER RE-TYPED,
 * so its key set is TOTAL over the grade vocabulary by construction. A fifth grade minted
 * upstream lands here at zero — fail-closed, visible to the pin that compares these keys with
 * the export — instead of escaping the map in silence.
 */
export const CAREER_CREDIT_TUNING = Object.freeze({
  MISSION_CREDIT_MET: 0.15,
  GRADE_MULTIPLE: Object.freeze(Object.fromEntries(
    MISSION_GRADES.map((grade) => [grade, Number(CREDITED_MULTIPLES[grade]) || 0]),
  )),
});

/**
 * What one landing's grade is worth in ladder stock units. Exactly `0` for every grade
 * outside the credited set, and never negative — a debit is a non-goal (D3).
 * @param {unknown} grade
 * @returns {number} `>= 0`, round4. NEVER NaN, negative, or undefined.
 */
function creditForGrade(grade) {
  const multiple = Number(CAREER_CREDIT_TUNING.GRADE_MULTIPLE[String(grade)]) || 0;
  return multiple > 0 ? round4(CAREER_CREDIT_TUNING.MISSION_CREDIT_MET * multiple) : 0;
}

/**
 * THE DEPOSIT WRITER — espionage's own state, written once per pulse.
 *
 * DEPENDENCY-INVERTED: it reaches into neither the ladder nor the errand family. The
 * operative arrives already resolved, in an `operatives` Map the caller filled from the
 * `npcFor` closure it ALREADY receives — so the roster entry is here without this leaf
 * gaining a single new import edge, and this file reads no roster of its own.
 *
 * ⚠ THE IDENTITY BRIDGE IS THE ONLY GENUINELY NEW IDENTITY CODE IN THE WAVE, and its three
 * hops all existed as parts. An errand's `npcId` and a ladder nid are STRUCTURALLY disjoint
 * spellings — the ladder's is always `<settlementId>:<...>` and an errand's never carries
 * that prefix — so the join can only be made through the man himself: the landing's
 * `observerId` is the home settlement id, the caller's closure turns the errand into the
 * roster entry, and `npcId` mints the ladder's own key from the two.
 *
 * ⛔ AN ID-LESS OPERATIVE GETS NO CREDIT, SILENTLY AND BY DESIGN (chair ruling CR-ES5D O8).
 * `npcId` falls back to a name-derived part when the roster entry carries no id, and keying a
 * credit under a guessed identity would credit THE WRONG MAN — the worst failure available
 * here. Someone the ladder cannot identify is not an error; he is someone the ladder does not
 * model. ⛔ Never throw, and never fall back to a default identity.
 *
 * ⚠ AT MOST ONE CREDIT PER OPERATIVE PER TICK, and when a man lands two graded missions in
 * one tick the LARGER credit wins rather than their sum. Order-free by construction (a max
 * over a set does not care what order it was fed), which is what lets the ladder apply the
 * fold per rung without caring how the errands were walked.
 *
 * @param {{ worldState?: unknown, tick?: unknown, landings?: unknown,
 *   operatives?: unknown }} [args]
 * @returns {{ worldState: unknown, changed: boolean }}
 */
export function depositMissionCredits({ worldState, tick, landings, operatives } = {}) {
  // THE BYTE-IDENTICAL DARK PATHS: flag reads only, before any world object is touched.
  if (espionageActive(worldState) !== true) return { worldState, changed: false };
  const rules = recordOf(recordOf(worldState).simulationRules);
  if (rules.npcLadderEnabled !== true) return { worldState, changed: false };
  const now = Math.floor(Number(tick));
  if (!Number.isFinite(now)) return { worldState, changed: false };
  const byErrand = operatives instanceof Map ? operatives : new Map();
  /** @type {Record<string, { credit: number, depositTick: number, grade: string }>} */
  const rows = {};
  for (const raw of Array.isArray(landings) ? landings : []) {
    const landing = recordOf(raw);
    const credit = creditForGrade(landing.grade);
    if (credit <= 0) continue;
    const sid = String(landing.observerId || '');
    if (!sid) continue;
    const npc = recordOf(byErrand.get(String(landing.errandId || '')));
    if (!npc.id) continue;
    // The index argument is inert here BY CONSTRUCTION: `npcId` consults it only on the
    // name-derived fallback, and the guard above has already refused every entry that would
    // take that road. It is passed as -1 so a future reader cannot mistake it for a rung.
    const nid = npcId(sid, /** @type {Parameters<typeof npcId>[1]} */ (npc), -1);
    if (Number(recordOf(rows[nid]).credit) >= credit) continue;
    rows[nid] = { credit, depositTick: now, grade: String(landing.grade) };
  }
  // THE PRUNE, and it is not a separate step: this pass REPLACES the whole record set every
  // pulse, so the prior tick's deposits are dropped by construction rather than by a sweep
  // somebody has to remember to call. ⛔ Without it the ledger would grow without bound while
  // the strict-tick window kept the fold looking correct — a leak that stays invisible until
  // a save bloats. Drop-when-empty: a credit-free tick leaves NO key at all.
  const prior = recordOf(getSpatialLedger(
    /** @type {Parameters<typeof getSpatialLedger>[0]} */ (worldState), 'missionCreditEvents',
  ));
  const keys = Object.keys(rows).sort(compareCodepoint);
  const next = keys.length ? Object.fromEntries(keys.map((key) => [key, rows[key]])) : null;
  const unchanged = JSON.stringify(Object.keys(prior).length ? prior : null) === JSON.stringify(next);
  if (unchanged) return { worldState, changed: false };
  return {
    worldState: next
      ? setSpatialLedger(
        /** @type {Parameters<typeof setSpatialLedger>[0]} */ (worldState), 'missionCreditEvents', next,
      )
      : dropSpatialLedger(
        /** @type {Parameters<typeof dropSpatialLedger>[0]} */ (worldState), 'missionCreditEvents',
      ),
    changed: true,
  };
}

/**
 * THE PURE CONSUMER READ — `readGratitudeBondEvents` in shape, verbatim.
 *
 * Codepoint-sorted key iteration, a STRICT equality on the tick (see the header's D7 note),
 * and a Map keyed by the ladder nid the deposit was written under. Returns an EMPTY Map when
 * the ledger is absent, so a dark or credit-free world costs the consumer one absent read.
 *
 * ⚠ IT DOES NOT READ THE ESPIONAGE FLAG, and that is deliberate rather than an omission: the
 * consumer is the ladder, its own gate is the ladder's, and a dark espionage layer mints no
 * key at all — so the absence IS the gate. Reading espionage's flag here would make the
 * ladder's output depend on a flag it does not own for no behavioral gain.
 *
 * @param {unknown} worldState
 * @param {unknown} tick the pulse tick the consumer is advancing over
 * @returns {Map<string, { grade: string, credit: number }>} keyed by ladder nid
 */
export function readMissionCreditEvents(worldState, tick) {
  const ledger = recordOf(getSpatialLedger(
    /** @type {Parameters<typeof getSpatialLedger>[0]} */ (worldState), 'missionCreditEvents',
  ));
  /** @type {Map<string, { grade: string, credit: number }>} */
  const out = new Map();
  const now = Math.floor(Number(tick));
  if (!Number.isFinite(now)) return out;
  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const row = recordOf(ledger[key]);
    if (Math.floor(Number(row.depositTick)) !== now) continue;
    const credit = Number(row.credit);
    if (!Number.isFinite(credit) || credit <= 0) continue;
    out.set(key, { grade: String(row.grade || ''), credit: round4(credit) });
  }
  return out;
}
