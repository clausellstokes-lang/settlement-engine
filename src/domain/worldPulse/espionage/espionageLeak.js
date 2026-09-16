/**
 * espionageLeak.js — ES-6a: THE DOUBLE AGENT'S OTHER MASTER.
 *
 * docs/DESIGN_FP_ARCH_ES.md §3.13 (J-ES-11), as narrowed by the ES-6A packet's §0. An
 * operative whose corruption leash points at a FOREIGN COURT hands that court a copy of what
 * he learned. The mission still completes; the home court's state is byte-identical to a
 * clean mission's; nothing is spoken. That is the whole behavior family.
 *
 * ── ⛔ LEAK-ONLY IS OWNER LAW, AND IT IS THE ONE THING THIS FILE MUST NEVER BREAK ────────
 * The agent copies what he told home. He NEVER falsifies the report he carries home, and he
 * never writes anything at all into the HOME observer's slice: every write below names the
 * PATRON as observer, and there is no other observer this leaf can name. False reporting home
 * is deliberately excluded by the owner directive — the confirmation product stays honest —
 * and the guard for it is behavioral rather than lexical, because a source scan for a
 * falsified report has no honest token to match on and would convict this very paragraph.
 * The differential in tests/property/espionageLeakDormancy.test.js drives one fixture twice,
 * clean operative against leashed operative, and asserts THE HOME COURT'S OWN OUTCOME IS
 * BYTE-IDENTICAL — which is the claim "silent success" actually makes. A planted write home
 * reds it, and that plant is executed rather than described.
 *
 * ── ⚠⚠ THE WEB IS READ ON THE **SAME TICK** IT IS WRITTEN. NO LAG. RE-DERIVED PER PAIR ───
 * `simulateCampaignWorldPulse` advances the corruption web at its own `advanceCorruptionWeb({`
 * call and reaches this leaf later in the SAME body, through
 * `advanceEnvoyDiplomacyPulse({` -> `advanceEspionageProducts` -> here, on one thread of
 * `worldState`. So a leash minted this tick is visible to this leaf this tick.
 * ⛔ A `tick - 1` window here would be PROVABLY DEAD, exactly as ES-5d's was: the leash is
 * read off the operative the caller is holding right now, not out of a dated ledger, so a lag
 * would simply never fire while every unit pin around it stayed green. A lag is a property of
 * a WRITER/READER PAIR, never of a file or a volume — this pair was re-derived, not inherited.
 * The pulse ORDER is pinned AT SOURCE by case A5 so a future reorder reds.
 *
 * ── THE TWO ARMS, AND WHY THE SECOND IS NOT DECORATION ──────────────────────────────────
 * ARM 1, THE INTEL LEAK — `(observer = patron, subject = the mission's subject)`. The design's
 *   "gathered intel" clause verbatim, in the shape the record can hold.
 * ARM 2, THE EXISTENCE LEAK — `(observer = patron, subject = the HOME court)`, CONFIRM-shaped.
 *   ⭐ MANDATORY. When the patron IS the mission's subject — the case §3.13 names outright
 *   ("whether or not it is the target") — arm 1 is refused GENERICALLY by the belief writer's
 *   first guard, which returns inert for `observer === subject`. Without arm 2 the most
 *   dramatic case in the design would write NOTHING AT ALL and look like a working feature.
 *   Arm 2 needs no new arithmetic: a CONFIRM's ground truth is the observer's OWN prior, so a
 *   patron who has never heard of home takes `productGroundTruth`'s built-in honesty refusal
 *   and no belief is manufactured out of a court's ignorance.
 *
 * ⚠ BOTH ARMS ARE STRICTLY TWO-PARTY, and that is a narrowing the packet measured rather than
 * a simplification. `BeliefRecord` is two-party by construction — its label is documented as
 * `observer <-> subject` and its truth side reads the direct edge between exactly those two
 * ids — so "the enemy's belief about the home court's posture toward a third party" is not
 * expressible in any existing field. The three-party version needs a NEW belief key, which is
 * owner-gated persistence shape. This leaf mints NO key, NO field and NO record family.
 *
 * ── THE WEB-GATED RESOLVE IDIOM, COPIED RATHER THAN ASSUMED ─────────────────────────────
 * ⛔ `resolveLeash` is NOT web-gated: it normalizes an NPC's ties unconditionally, and a
 * betrayal-seeded foreign patron can exist in a world that never lit the web. So the ESTATE'S
 * IDIOM IS TO GATE THE CALL — `causeLifecycle.js` spells exactly this pair of lines — and
 * `leakTargetFor` is the only place the web gate appears. Do not assume the resolver refuses.
 *
 * ── ⛔ THE NEVER-IMPORT LIST (dependency inversion first, a registry row second) ──────────
 * This leaf takes the operative, the landings and the settlement index FROM ITS CALLER and
 * reaches into no family of its own. It must never import: any ladder module; any errand
 * module, and it must never route the errand ledger's own amender (exactly one espionage
 * module may, and it is the product stage); the corruption web's WRITERS (only its gate read
 * is imported, and only that symbol, because that file carries the whole web family and a
 * barrel hop would drag all of it into this closure); the disinformation plant's override
 * road; or the product stage itself, which would close a cycle.
 *
 * ⚠ ONE MEASURED ADDRESS DIVERGENCE, DECLARED RATHER THAN DISCOVERED. The leaked report's
 * `sourceId` is built from the operative's ROSTER id, while the home product's is built from
 * the errand's `npcId`, which the covert mint spells as `durableId || rosterId`. When the man
 * has been graduated into the durable ledger those two strings DIFFER. It is inert today —
 * this leaf passes NO credibility closure, and `sourceId` is consulted only through one — so
 * the address travels as a label and weighs nothing. ⛔ The wave that first passes a
 * credibility closure here must reconcile the two spellings FIRST, or one man will carry two
 * reputations, which is exactly what the packet's O9 ruling refused.
 *
 * PURE apart from the belief writes it delegates: no Date, no Math.random, no React, no I/O,
 * no mutation of an input. It writes NO ledger of its own and therefore has nothing to prune.
 *
 * @enforced-by tests/domain/espionageLeak.test.js,
 *   tests/property/espionageLeakDormancy.test.js
 */
import { clamp01 } from '../../../kernel/math.js';
import { isForeignLeashKind, resolveLeash } from '../../corruptionLeash.js';
import { beliefRecord } from '../beliefMap.js';
import { corruptionWebActive } from '../corruptionWeb.js';
import { espionageActive } from './espionageGate.js';
import { round4 } from './espionageMath.js';
import {
  buildProductReport,
  landEspionageProduct,
  productGroundTruth,
} from './espionageProducts.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * ⛔ AUTHOR-SET BY THE CHAIR, NOT BY THE IMPLEMENTER (CR-ES5B-6 / CR-ES5C-O4 / ES-5d O2). An
 * implementer may never author or retune dark tuning, and this value was DERIVED rather than
 * chosen.
 *
 * The sharp edge is the belief layer's own `CAT_ADOPT_ACCURACY`, `0.6` — the aggregate
 * fidelity at or above which a fresh report lets an observer ADOPT the current categorical
 * value (the relationship label, the faith label) instead of keeping its settled one. At
 * `FIDELITY_W: 0.7` the enemy's copy clears that bar only when the home read was above about
 * `0.857`. ⭐ SO A CLEAR LOOK LEAKS A CONCLUSION THE ENEMY CAN ACT ON, AND A PARTIAL LOOK
 * LEAKS ONLY THAT SOMETHING HAPPENED — which is precisely §3.13's "leak-only, silent
 * success": a leak is smuggled, unverifiable and told by a man serving two masters, so it
 * should firm what the patron already suspects and only rarely re-anchor his picture.
 * `0.7` sits on the family's own 0.05 grid.
 *
 * ⚠⚠ BOTH SIDES OF THAT BOUNDARY ARE PINNED (case A4), so the number's MEANING is machinery
 * rather than prose: a high-accuracy leak adopts the label, a marginal one does not.
 */
export const LEAK_TUNING = Object.freeze({
  FIDELITY_W: 0.7,
});

/**
 * The fidelity discount, bounded and rounded on the family's own idiom. Never NaN: a missing
 * or malformed input clamps to 0 rather than propagating.
 * @param {unknown} value
 * @returns {number} 0..1, round4
 */
function discount(value) {
  return round4(clamp01(Number(value) * LEAK_TUNING.FIDELITY_W));
}

/**
 * @typedef {Object} LeakTarget
 * @property {boolean} leaks   true only for a resolvable foreign COURT endpoint
 * @property {string} patronId the foreign court's settlement id ('' unless `leaks`)
 * @property {string} kind     the resolved leash kind, as the resolver spelled it
 * @property {string} reason   why it refused, or `foreign_patron` when it did not
 */

/**
 * THE LEASH READ — pure, and the ONLY place the corruption web's gate is spelled.
 *
 * ⚠ `foreign_faction` and `foreign_org` are refused BY MEASUREMENT rather than by omission:
 * both are recognised foreign kinds, and NOTHING in this estate writes either one — all three
 * production writers of a foreign leash mint `foreign_settlement`, and a faction-keyed leash
 * carries a null settlement endpoint by the resolver's own contract with no name-to-court
 * bridge anywhere. They therefore get their own reason on the receipt, so the day a writer for
 * either appears the refusal is already named instead of being discovered as silence.
 *
 * @param {{worldState?: unknown, npc?: unknown}} [args]
 * @returns {LeakTarget}
 */
export function leakTargetFor({ worldState, npc } = {}) {
  const refuse = (/** @type {string} */ reason, /** @type {string} */ kind = '') => ({
    leaks: false, patronId: '', kind, reason,
  });
  // THE WEB GATE, COPIED FROM THE ESTATE'S IDIOM: gate the CALL, because the resolver itself
  // does not refuse on a dark web and a betrayal-seeded patron survives in an unlit world.
  if (corruptionWebActive(
    /** @type {Parameters<typeof corruptionWebActive>[0]} */ (worldState),
  ) !== true) {
    return refuse('web_dark');
  }
  const leash = resolveLeash(
    /** @type {Parameters<typeof resolveLeash>[0]} */ (npc),
  );
  const kind = text(leash.kind);
  // Derived from the resolver's OWN foreign-kind contract, never re-typed here.
  if (leash.foreign !== true || !isForeignLeashKind(kind)) return refuse('local_leash', kind);
  const patronId = text(leash.settlementId);
  if (kind !== 'foreign_settlement' || !patronId) {
    return refuse('no_settlement_endpoint', kind);
  }
  return { leaks: true, patronId, kind, reason: 'foreign_patron' };
}

/**
 * THE DELIVERY — one pass over the landings the stage just produced, once per pulse.
 *
 * ⭐ WHY THE HOOK IS POST-LOOP ON `landings`, AND WHY THAT BUYS BOTH WORLD ARMS FOR FREE. A
 * landing ALREADY encodes the world rule: in a MAGIC world a product lands at the stop's
 * confirmation tick, and in a MUNDANE world nothing lands until the home mouth. So leaking on
 * landings gives the magic arm per-stop streaming and the mundane arm close-of-mission
 * delivery, from ONE call site, with zero new timing code — and the landing's own `world`
 * field labels which arm fired. The charter's "enemy rumor reach" timing is REFUTED rather
 * than approximated: no reach predicate exists anywhere in this estate, only continuous hop
 * pricing, and a hop-delayed arrival would need a deferred-delivery carrier, which is a new
 * persisted record family and a second behavior family.
 *
 * ⚠ THE RECEIPT'S `reason` NAMES WHAT WAS SKIPPED, AND `arms` NAMES WHAT FIRED. They are
 * independent on purpose: the patron-is-subject case refuses arm 1 and still fires arm 2, so
 * one field cannot carry both facts. `reason` is `leaked` only when nothing was refused.
 * ⛔ Nothing here is written to the errand row, to news, or to any home-visible field. The
 * returned array is a RECEIPT, not state — the pulse mouth already drops a sibling receipt
 * the same way, and no caller is obliged to read this one.
 *
 * @param {{worldState?: unknown, tick?: unknown, landings?: unknown, operatives?: unknown,
 *   byId?: unknown}} [args]
 * @returns {{worldState: unknown, changed: boolean,
 *   leaks: Array<Record<string, unknown>>}}
 */
export function deliverMissionLeaks({
  worldState, tick, landings, operatives, byId,
} = {}) {
  /** @type {Array<Record<string, unknown>>} */
  const leaks = [];
  // THE BYTE-IDENTICAL DARK PATH: one flag read, before any world object is touched.
  if (espionageActive(worldState) !== true) return { worldState, changed: false, leaks };
  const byErrand = operatives instanceof Map ? operatives : new Map();
  const live = byId instanceof Map ? byId : null;
  let state = worldState;
  let changed = false;
  for (const raw of Array.isArray(landings) ? landings : []) {
    const landing = recordOf(raw);
    const errandId = text(landing.errandId);
    const homeId = text(landing.observerId);
    const subjectId = text(landing.subjectId);
    /** @type {string[]} */
    const arms = [];
    /** @type {string[]} */
    const refusals = [];
    /** @type {Record<string, unknown>} */
    const receipt = {
      errandId, patronId: '', patronKind: '', arms, accuracy01: 0, changed: false, reason: '',
    };
    leaks.push(receipt);
    const close = (/** @type {string} */ reason) => {
      refusals.push(reason);
      receipt.reason = refusals[0];
    };
    // A landing that moved no home belief is a mission that told the court nothing new; there
    // is nothing for the agent to copy.
    if (landing.changed !== true) { close('home_belief_unchanged'); continue; }
    const npc = byErrand.get(errandId);
    if (!npc) { close('no_operative'); continue; }
    const target = leakTargetFor({ worldState: state, npc });
    receipt.patronKind = target.kind;
    if (target.leaks !== true) { close(target.reason); continue; }
    const patronId = target.patronId;
    receipt.patronId = patronId;
    // A patron who IS the home court is not a foreign master; the belief writer would refuse
    // the pair generically, and a silent inert return would read as a write.
    if (patronId === homeId) { close('patron_is_home'); continue; }
    if (live && !live.has(patronId)) { close('patron_not_live'); continue; }
    const operative = recordOf(npc);
    const sourceId = text(operative.id) ? `${homeId}#${text(operative.id)}` : homeId;
    const accuracy01 = discount(landing.accuracy01);
    const completeness01 = discount(landing.completeness01);
    receipt.accuracy01 = accuracy01;
    const report = (/** @type {string} */ product) => buildProductReport({
      product, errandId, sourceId, accuracy01, completeness01,
    });
    // ── ARM 1: THE INTEL LEAK. The patron receives the same picture the home court just
    // received, discounted. The ground truth is the home's POST-landing record, which is what
    // the agent actually knows.
    const homeRecord = beliefRecord(
      /** @type {Parameters<typeof beliefRecord>[0]} */ (state), homeId, subjectId,
    );
    if (patronId === subjectId) {
      close('patron_is_subject');
    } else if (!homeRecord) {
      close('home_holds_no_record');
    } else {
      const intel = landEspionageProduct({
        worldState: state,
        observerId: patronId,
        subjectId,
        groundTruth: homeRecord,
        reports: [report(text(landing.product))],
        tick,
      });
      state = intel.worldState;
      changed = changed || intel.changed;
      if (intel.changed) arms.push('intel'); else close(`intel_${text(intel.reason)}`);
    }
    // ── ARM 2: THE EXISTENCE LEAK. A CONFIRM asserts the observer's own prior, so a patron
    // who has never heard of home takes the built-in honesty refusal and nothing is written.
    const existence = productGroundTruth({
      product: 'confirm',
      prior: beliefRecord(
        /** @type {Parameters<typeof beliefRecord>[0]} */ (state), patronId, homeId,
      ),
      read: null,
      legRefs: [],
    });
    if (existence.refusal) {
      close(existence.refusal);
    } else {
      const confirmed = landEspionageProduct({
        worldState: state,
        observerId: patronId,
        subjectId: homeId,
        groundTruth: existence.groundTruth,
        reports: [report('confirm')],
        tick,
      });
      state = confirmed.worldState;
      changed = changed || confirmed.changed;
      if (confirmed.changed) arms.push('existence');
      else close(`existence_${text(confirmed.reason)}`);
    }
    receipt.changed = arms.length > 0;
    if (!refusals.length) receipt.reason = 'leaked';
  }
  return { worldState: state, changed, leaks };
}
