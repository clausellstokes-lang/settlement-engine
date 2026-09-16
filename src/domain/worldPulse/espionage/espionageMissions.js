/**
 * espionageMissions.js — ES-1: THE MISSION. Who a court sends covertly, and the one door
 * a covert mission is minted through.
 *
 * docs/DESIGN_FP_ARCH_ES.md §1 (the canonical model), §3.1 (casting), §3.4 (the
 * itinerary), §3.13 (vetting). This leaf is the espionage layer's FIRST consumer of the
 * generalized errand spine, and it is registered as one: `ERRAND_CONSUMERS` carries its
 * row, and tests/lint/errandConsumerRegistry.walker.test.js measures that row against
 * this file BOTH WAYS — an unregistered minter reds, and a row whose module does not mint
 * reds. There is exactly one purposeful-travel substrate (J-SP-2) and this wave joins it
 * rather than opening a second.
 *
 * ── WHAT IS DARK, AND HOW ────────────────────────────────────────────────────────────
 * NOTHING UNDER src/ CALLS THIS FILE. That is the WR-10 dark-instrument shape ES-0 landed
 * under and it is preserved deliberately: the DISPATCHER — the per-tick stage that
 * decides a court wants a confirmation and sends somebody — is a later wave's (§3.12's
 * deliberation read plus ES-5's doctrine targeting). ES-1 builds the DOOR, not the
 * traffic through it. So this wave's dormancy has three independent proofs and needs all
 * three: `espionageActive` refuses at this head, `errandSpineActive` refuses one layer
 * down at the mint, and no production module reaches either.
 *
 * ── THE TWO CASTING LAWS (J-ES-4), AND THIS IS THE MIRROR HALF OF A BOTH-SITE HEADER ──
 * `src/domain/worldPulse/envoyCasting.js` carries the other half. The estate now draws
 * from one roster under two OPPOSITE laws, and they must never be merged:
 *
 *   DIPLOMATIC casting — importance-DESCENDING (`envoyCandidate`, envoyCasting.js), with
 *     a `>= 0.4` floor: a realm's face is its most notable person, and minor people do
 *     not carry embassies.
 *   COVERT casting — importance-INVERSE, HERE, over the roads draw law
 *     `ROADS_TUNING.DRAW_WEIGHT_BASE − importanceWeight` (1.15 − w, so a minor person
 *     weighs 1.15 and a pillar 0.15) with NO importance floor at all: the ideal spy is
 *     nobody. The arithmetic reason is written down in `covertCompetence01` — notoriety
 *     multiplies straight into how badly an operative hides — so casting the famous would
 *     fight the competence model rather than feed it.
 *
 * They COEXIST BY CLASS. What IS shared is `rosterPersonAvailable`, and it is shared
 * because it answers the other question: not who SHOULD go, but who CAN. That predicate
 * is the DISPATCH-REFUSAL SEAM the charter requires honoured and never bypassed — an
 * off-stage, dead, imprisoned or already-travelling person is refused to both laws by one
 * spelling, so the day the war lane adds a status the spy lane obeys it in the same edit.
 *
 * ── THE VETTING HAS ONE HOME, AND IT IS NOT HERE (⟨F8⟩, ES §5 row 9) ─────────────────
 * `vetVolunteerEnvoy` (sendTwoDivergence.js) was built spec-complete at WR-7d with ZERO
 * callers. This is its first consumption. IN-3's VET composes the SAME module, and seam
 * row 9's one-home clause binds both programs: neither forks a second vetting
 * derivation. This leaf supplies the seat's care and the volunteer's bands and reads the
 * verdict; it does not decide what a verdict means.
 *
 * K3 (NOBODY IS EVER CURRENT): the reach is the roster, the errand ledger, the gate, and
 * two pure leaves. Nothing here can hand back a settlement's real strength or stock; the
 * mission's SUBJECT is an id and the products that fill it are ES-3's.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation. The casting
 * draw is a deterministic sort over a computed weight — there is no PRNG in this file and
 * the whole layer's stochastic choices are keyed hashes owned by later stages (L1).
 *
 * @enforced-by tests/domain/espionageMission.test.js,
 *   tests/property/espionageMissionDormancyFence.test.js,
 *   tests/lint/errandConsumerRegistry.walker.test.js
 */
import { ROADS_TUNING } from '../../roads/state.js';
import { compareCodepoint } from '../../deterministicSort.js';
import { castableRoster } from '../envoyCasting.js';
import {
  ENVOY_COVERT_DEMANDS,
  ENVOY_COVERT_FACES,
  ENVOY_COVERT_LEG_REFS,
  ENVOY_COVERT_PRODUCTS,
  MAX_COVERT_ITINERARY_STOPS,
} from '../envoyErrandVocabulary.js';
import { mintErrandSpine } from '../errandMint.js';
import { vetVolunteerEnvoy } from '../sendTwoDivergence.js';
import { espionageActive } from './espionageGate.js';
import { covertCompetence01, operativeNotoriety01 } from './espionageMath.js';

/**
 * THE COVERT DRAW WEIGHT — the roads selection law, imported rather than restated.
 * `DRAW_WEIGHT_BASE − importanceWeight` over a floor: importance-INVERSE, so a minor
 * person outdraws a pillar by roughly eight to one at the proposed base. The floor is
 * what keeps the most notable person DRAWABLE rather than impossible — a court with
 * nobody else must send whoever it has, and the competence model prices that badly
 * instead of the casting model forbidding it.
 *
 * @param {number} importance the roster importance weight, 0..1
 * @returns {number} > 0
 */
export function covertDrawWeight(importance) {
  const weight = ROADS_TUNING.DRAW_WEIGHT_BASE - Number(importance || 0);
  return weight > 0.05 ? weight : 0.05;
}

/**
 * ES §3.1/§3.13 — CAST ONE COVERT OPERATIVE, or say why not.
 *
 * The draw is DETERMINISTIC and importance-INVERSE: heaviest covert weight wins, and ties
 * break on measured competence and then on identity by codepoint. No PRNG: the estate's
 * stochastic choices are keyed hashes and they belong to the stages that roll them, not to
 * a selection that must produce the same operative on every replay of the same world.
 *
 * VETTING IS A REAL REFUSAL, not a score. Every candidate is read through the ONE vetting
 * reader in the seat's declared care; the first candidate that reader ACCEPTS is the one
 * who goes. A `careful` seat that refuses everybody casts nobody and says so — which is
 * the design's own sentence about internal rot producing external blindness, spelled as a
 * reachable arm rather than as prose.
 *
 * ⚠ THE VOLUNTEER BANDS ARE THE CALLER'S, and that is a K3 boundary rather than a gap.
 * `loyaltyBand` and `foreignTieBand` are WHAT THE COURT BELIEVES about a person, not what
 * is true (the vetting reader's own header says so); deriving them from world truth here
 * would hand a seat a fact it has no way to hold. The dispatcher wave supplies them from
 * the court's own records.
 *
 * @param {{worldState?:unknown, settlementId?:unknown, settlement?:unknown,
 *   quality?:unknown, volunteerBandsFor?:((identity:{rosterId:string, name:string,
 *   role:string}) => {loyaltyBand?:string, foreignTieBand?:string})|null}} [args]
 * @returns {{operative:Record<string, unknown>|null, identity:Record<string, string>|null,
 *   durableId:string, notoriety01:number, competence01:number,
 *   vetting:Record<string, unknown>|null, reason:string}}
 */
export function castCovertOperative({
  worldState,
  settlementId = '',
  settlement = null,
  quality = 'careful',
  volunteerBandsFor = null,
} = {}) {
  /** @param {string} reason */
  const uncast = (reason) => ({
    operative: null,
    identity: null,
    durableId: '',
    notoriety01: 0,
    competence01: 0,
    vetting: null,
    reason,
  });
  if (!espionageActive(worldState)) return uncast('dark');
  const home = String(settlementId || '');
  if (!home) return uncast('invalid_origin');
  const roster = castableRoster(worldState, home, settlement)
    .map((entry) => ({
      ...entry,
      drawWeight: covertDrawWeight(entry.importance),
      competence01: covertCompetence01(settlement, entry.npc),
    }))
    .sort((left, right) => (right.drawWeight - left.drawWeight)
      || (right.competence01 - left.competence01)
      || compareCodepoint(left.identity.rosterId, right.identity.rosterId)
      || compareCodepoint(left.identity.name, right.identity.name));
  if (!roster.length) return uncast('no_castable_person');
  let refused = false;
  for (const entry of roster) {
    const bands = typeof volunteerBandsFor === 'function'
      ? volunteerBandsFor(entry.identity) || {}
      : {};
    const vetting = vetVolunteerEnvoy({
      quality,
      volunteer: {
        npcId: entry.durableId || entry.identity.rosterId,
        loyaltyBand: bands.loyaltyBand || 'uncertain',
        foreignTieBand: bands.foreignTieBand || 'none',
      },
    });
    if (vetting.accepted !== true) { refused = true; continue; }
    return {
      operative: entry.npc,
      identity: entry.identity,
      durableId: entry.durableId || '',
      notoriety01: operativeNotoriety01(settlement, entry.npc),
      competence01: entry.competence01,
      vetting,
      reason: 'cast',
    };
  }
  // A court that looked at everyone and trusted nobody. Distinct from having nobody:
  // the seat's own records are what closed the door, which is the arm §3.13 needs live.
  return uncast(refused ? 'vetting_refused' : 'no_castable_person');
}

/**
 * ES §1 — MINT ONE COVERT MISSION through the estate's one spine head.
 *
 * This is a THIN COMPOSITION on purpose. It gates, it names the class cargo a covert
 * mission implies, and it hands everything else to `mintErrandSpine`: the route plan is
 * priced by the family's ONE transit seam (law M — a covert errand and a commercial one
 * cannot travel at different speeds because there is no second place to say how fast
 * anyone walks), and the covert sub-record is validated by the ONE validation the persist
 * side owns. Every refusal reason this returns is the spine's own word, unrenamed, so a
 * caller reading `itinerary_too_long` is reading the normalizer that will also reject the
 * row on the way back out of a save file.
 *
 * THE CLASS CARGO IS ONE WORD, AND THE COVER STORY IS NOT PART OF IT. This head names the
 * class `covert` and nothing else: the spine refuses a true purpose that disagrees with
 * the resolved class (so stating one would be stating the same thing twice), and the
 * PUBLIC FACE is DERIVED by the spine from the errand's own purpose rather than passed
 * down from here. That is not only simpler, it is what keeps the estate's ONE-READER LAW
 * intact — `tests/lint/errandConsumerRegistry.walker.test.js` reds any module outside the
 * errand family that spells the three conditional field names in any of three forms, and
 * a covert consumer that handed its own cover word downward would have had to spell one.
 * The mint refuses a covert row it cannot give a face to, which is exactly the residual
 * below made loud instead of silent.
 *
 * ⚠ THE CONCURRENCY CAP AND THE DOUBLE-TRAVEL REFUSAL ARE NOT RE-SPELLED HERE, AND THAT
 * IS THE CHARTER HONOURED RATHER THAN SKIPPED. `MAX_CONCURRENT_ENVOYS` (episodes per
 * origin, CR-WIRE-C) and the `npc_in_transit` refusal live in `mintEnvoyErrand`, the one
 * ledger writer, and every covert mission that becomes a ROW passes through it — so a
 * court cannot flood the roads with spies BY CONSTRUCTION. A second cap counted here
 * would be a second answer to "how many people is this court running", and the two would
 * agree until the day they did not.
 *
 * ⚠⚠ MEASURED RESIDUAL, RECORDED RATHER THAN PAPERED OVER (R-ES1-1). The ES volume says
 * SP-D's generalized mint "frees the errand from `envoyDiplomacyActive`'s six-flag weld",
 * and of THIS HEAD that is true — `mintErrandSpine` reads `errandSpineEnabled` and
 * nothing else. It is NOT true of the row. `normalizeErrand` still requires a normalized
 * peace OFFER, an acceptance and a purpose drawn from `ENVOY_PURPOSES`, and
 * `mintEnvoyErrand` — the one ledger writer — is still gated on the six war flags. So a
 * covert mission that becomes a PERSISTED ROW today rides a diplomatic errand wearing its
 * face: purposeClass `covert`, declaredPurpose `diplomatic`, a real peace offer
 * underneath. That is exactly §3.4's composite mission and §3.5's tainted journey, so the
 * wave is buildable and honest — but the FREE-STANDING spy row, with no diplomatic
 * pretext and no war flags, does not exist yet and is owed by a later SP or ES slice.
 * `purpose` is therefore a PARAMETER with an empty default rather than a hardcoded war
 * word: this head states no opinion about a weld it did not create and must not deepen.
 *
 * @param {{worldState?:unknown, purpose?:unknown, covert?:unknown, routePlan?:unknown,
 *   fromId?:string, toId?:string, notBeforeTick?:number}} [args]
 * @returns {{ok:boolean, fields:Record<string, unknown>,
 *   plan:Record<string, unknown>|null, reason:string}}
 */
export function mintCovertMission({
  worldState,
  purpose = '',
  covert = null,
  routePlan = null,
  fromId = '',
  toId = '',
  notBeforeTick = 0,
} = {}) {
  if (!espionageActive(worldState)) {
    return { ok: false, fields: {}, plan: null, reason: 'dark' };
  }
  return mintErrandSpine({
    worldState,
    purpose,
    purposeClass: 'covert',
    covert,
    routePlan,
    fromId,
    toId,
    journey: 'outbound',
    notBeforeTick,
  });
}

/**
 * THE MISSION VOCABULARY THIS LEAF SPELLS, re-exported as ONE totality read for the
 * waves that consume it. Every member is minted in the errand vocabulary leaf — the
 * persistence DTOs match against these words, so a second spelling would let an import
 * forge a mission no writer authored. Re-exporting is not minting: there is exactly one
 * `Object.freeze` behind each of these, and it is not in this file.
 */
export const COVERT_MISSION_VOCABULARY = Object.freeze({
  demands: ENVOY_COVERT_DEMANDS,
  faces: ENVOY_COVERT_FACES,
  legRefs: ENVOY_COVERT_LEG_REFS,
  maxStops: MAX_COVERT_ITINERARY_STOPS,
  products: ENVOY_COVERT_PRODUCTS,
});
