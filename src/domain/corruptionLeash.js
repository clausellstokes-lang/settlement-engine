/**
 * domain/corruptionLeash.js — THE RESOLVER CHOKEPOINT (W-DOCTRINE-3 §1).
 *
 * Corruption's beneficiary — "the leash" — was a raw name string fuzzy-matched in
 * several independent sites (the exposure attribution, sustainingInstitution,
 * severCorruptionTiesTo). resolveLeash is the SINGLE reader that normalizes
 * whatever legacy or explicit shape corruptTies carries into ONE typed leash, so
 * attribution becomes deliberate instead of an each-site accident. Read-only
 * normalization (no migration): every existing world resolves byte-identically.
 *
 * ── WHY ITS OWN LEAF (first-paint budget) ────────────────────────────────────
 * This lives OUTSIDE corruption.js on purpose. corruption.js is EAGER (first
 * paint) — its criminal-detector / climate readers are dragged into the static
 * closure by the eager mutate.js event router. The resolver's object-building
 * bulk is NOT needed at first paint (its consumers — the LAZY npcAgency exposure
 * loop and the LAZY causeLifecycle — live in the engine chunk), so it rides a
 * lazy leaf and the eager closure stays byte-identical. The engine-lazy idiom.
 *
 * Precedence:
 *   1. corruptTies.leash — an explicit normalized leash (foreign lanes / the DM
 *      composer's beneficiary picker). Its `kind` drives everything.
 *   2. corruptTies.foreignPatron — the betrayal-seed write (already shipping
 *      write-only from seedBetrayalTraitor): a foreign_settlement leash keyed by
 *      the sponsor save id. THIS is why the resolver repairs a CURRENTLY-LIVE
 *      bug — a foreign conspirator's exposure no longer blames the local guild.
 *   3. else — DERIVED-AS-LOCAL from corruptTies.criminalInstitution (the legacy
 *      shape). Absent ties ⇒ a local_org leash with a null criminalInstitution:
 *      the exposure path keeps its climate.criminalInstitutions[0] fallback for
 *      the LOCAL case only, so a tick-onset local corruption is byte-identical.
 *
 * The returned `criminalInstitution` is the LOCAL attribution string every
 * consumer reads; it is null for a purely-foreign leash (the innocent-guild pin,
 * §4). A `cutout` keeps the local org as its attribution (viaLocalOrg) so the
 * local machinery runs untouched while the patron rides as a second-hop
 * annotation. `covert` is always true (the covert-naming law, §6). Pure.
 */

import { allegianceOf } from './people/allegiance.js'; // ALLEGIANCE-CAR1: the hidden allegiance's one reader (J-1)
import { PATRONAGE_TUNING, isOustedNpc, securityImpairmentsOf } from './corruption.js';

/** The set of leash kinds whose beneficiary sits in ANOTHER settlement/court —
 *  the ones whose exposure must NEVER impair a local organization. */
const FOREIGN_LEASH_KINDS = Object.freeze(new Set(['foreign_settlement', 'foreign_faction', 'foreign_org']));

/**
 * ── THE WILLED MARKER (ENC-2; DESIGN_ENCOUNTERS §5.4, owner rows 5 + 5b) ──────
 *
 * A leash a CHANCE MEETING produced is WILLED: a named person was persuaded, once,
 * by another named person, and the meeting already priced that decision. Every other
 * leash the web mints is UNWILLED — the rarity die bought it.
 *
 * The distinction is a VALUE in the leash's own existing open `conspiracy` slot, never
 * a new persisted field: `mintLeashOnto` already writes `conspiracy: 'foreign_web'`
 * (corruptionWeb.js), `resolveLeash` already carries the slot through on both explicit
 * branches, and no closed vocabulary governs it. So a willed leash costs zero shape.
 *
 * ⛔ WHY THE MARKER EXISTS AT ALL — it is the only thing three fences can read, and the
 * three fences are what make STATE, NEVER FATE true of this mechanism BY CONSTRUCTION
 * rather than by assertion. Left in the estate's ordinary chain a meeting-born leash
 * ends with the honest magistrate ousted (npcAgency's organic exposure lane), replaced
 * by a generated successor, and sentenced a TURNCOAT (npcVerdictTable's `rival_power`
 * arm). The owner closed that fate in §881.11. The fences:
 *   FENCE 1  npcAgency.js  — the organic exposure lane returns before `exposureChance`.
 *   FENCE 2  npcVerdictTable.js — `compromiseSourceOf` never answers `rival_power`.
 *   FENCE 3  causeLifecycle.js — the cause pass never attributes a cause to it.
 * Each is one line and each is convicted by plant P6.
 *
 * ⚠ A willed leash is NOT permanent-and-unreachable in exchange: the web's own pass
 * gives it the two typed ends the estate's leash lacks — DISCOVERY (severs it and
 * demotes the man ONE rank) and LAPSE (clears a leash that never leaked). Fence 1
 * removes the FATE, not the consequence.
 */
export const WILLED_MEETING_CONSPIRACY = 'chance_meeting';

/**
 * THE CARD'S CORRUPTION MARK AS THE SIMULATION READS IT (J-19, AMENDED BY CAUSE: the chair's ruling, ALLEGIANCE-CAR1;
 * its reader is worldPulse/npcAgency.js :: ensureNpcStates). A v3 card is born with no `corrupt` boolean: its hidden
 * allegiance is the mark, read through `allegianceOf`: an allegiance is corrupt; a v3 card with none is CLEAN
 * (generation decided; never a re-roll). The retired boolean is read only where present, which at v3 means the
 * simulation's OWN write-back (npcAgency.js :: mirrorCorruptionOntoSettlement: an exposure writes `corrupt: false` onto a card
 * that keeps its allegiance, and must stick) or a pre-v3 save. Undefined only for a pre-v3 save with no boolean: the
 * legacy re-roll, keyed by the SAVE'S VERSION, not by the field's absence.
 * @param {{ corrupt?: unknown } | null | undefined} npc @param {{ schemaVersion?: unknown } | null | undefined} settlement
 * @returns {boolean | undefined}
 */
export function corruptMarkOf(npc, settlement) {
  if (typeof npc?.corrupt === 'boolean') return npc.corrupt;
  if (allegianceOf(npc)) return true;
  if ((Number(settlement?.schemaVersion) || 0) >= 3) return false;
  return undefined;
}

/**
 * True iff a leash was WILLED by a chance meeting. TOTAL: garbage, null, a leashless
 * npcState and a pre-feature save all read false, which is what keeps every dark and
 * every legacy world byte-identical through all three fences.
 *
 * Accepts either grain, because the marker is read from both sides of the mirror:
 *   - a RESOLVED leash (`resolveLeash(npc)`) — npcAgency, npcVerdictTable, causeLifecycle;
 *   - a RAW carrier that holds one under `corruptionLeash` (an npcStates row) — the web.
 * @param {unknown} subject  a ResolvedLeash, a raw leash object, or an npcStates row
 * @returns {boolean}
 */
export function isWilledLeash(subject) {
  if (!subject || typeof subject !== 'object') return false;
  const carrier = /** @type {Record<string, unknown>} */ (subject);
  const nested = carrier.corruptionLeash;
  const leash = nested && typeof nested === 'object'
    ? /** @type {Record<string, unknown>} */ (nested)
    : carrier;
  return leash.conspiracy === WILLED_MEETING_CONSPIRACY;
}

/** True iff a normalized leash kind is foreign (beneficiary in another court).
 *  @param {string} kind */
export function isForeignLeashKind(kind) {
  return FOREIGN_LEASH_KINDS.has(String(kind || ''));
}

/**
 * @typedef {Object} ResolvedLeash
 * @property {string} kind  'local_org' | 'foreign_settlement' | 'foreign_faction' | 'foreign_org' | 'cutout'
 * @property {string|null} settlementId  foreign endpoint (campaign save id) — null for local/cutout
 * @property {string|null} factionName   foreign faction endpoint (name-keyed) — null unless foreign_faction
 * @property {string|null} viaLocalOrg   the cutout's local front (or a local leash's org) — null otherwise
 * @property {string|null} criminalInstitution  the LOCAL attribution target (null for a purely-foreign leash)
 * @property {string|null} conspiracy    the betrayal variant, when carried
 * @property {boolean} foreign  true when the beneficiary sits in another court
 * @property {true} covert
 */

/**
 * Normalize an NPC's corruption beneficiary into one typed leash. @see the block
 * above. Extra args are reserved for foreign-endpoint / cutout resolution and are
 * optional (Phase A reads the NPC alone).
 * @param {import('./settlement.schema.js').SimNpc} npc
 * @param {import('./settlement.schema.js').SimSettlement} [settlement]
 * @param {object} [worldState]
 * @returns {ResolvedLeash}
 */
export function resolveLeash(npc, settlement, worldState) {
  // ALLEGIANCE-CAR1 (2026-11-08): the leash rides on the card's hidden allegiance (its one reader, allegianceOf); the
  // retired `corruptTies.criminalInstitution` is the allegiance's `house`, and its simulation sub-fields (`leash`,
  // `foreignPatron`, `conspiracy`) are carried on the allegiance by the v2 -> v3 migration. THE LEGACY ARM: the frozen
  // simulation (M-6) still writes `corruptTies` on the cards it turns, so a card with no allegiance reads its
  // `corruptTies` as before (this file is on the dormant list for that arm; it leaves when FPZ rebuilds the loop).
  const allegiance = allegianceOf(npc);
  const ties = allegiance ? { ...allegiance, criminalInstitution: allegiance.house || null }
    : (npc && typeof npc.corruptTies === 'object' ? npc.corruptTies : null);

  // 1. Explicit normalized leash (foreign lanes / composer).
  const explicit = ties && typeof ties.leash === 'object' && ties.leash ? ties.leash : null;
  if (explicit && typeof explicit.kind === 'string') {
    const kind = explicit.kind;
    const foreign = isForeignLeashKind(kind);
    // local_org + cutout keep a LOCAL attribution target (the local machinery is
    // untouched); a foreign leash blames no one local.
    const localOrg = (kind === 'local_org' || kind === 'cutout')
      ? (explicit.viaLocalOrg || ties.criminalInstitution || null)
      : null;
    return {
      kind,
      settlementId: explicit.settlementId != null ? String(explicit.settlementId) : null,
      factionName: explicit.factionName != null ? String(explicit.factionName) : null,
      viaLocalOrg: explicit.viaLocalOrg != null ? String(explicit.viaLocalOrg) : null,
      criminalInstitution: localOrg,
      conspiracy: explicit.conspiracy != null ? String(explicit.conspiracy) : (ties.conspiracy != null ? String(ties.conspiracy) : null),
      foreign,
      covert: true,
    };
  }

  // 2. Betrayal-seed foreignPatron (already-shipping write-only). A sponsor save
  //    id ⇒ a foreign_settlement leash; NEVER a local criminalInstitution (§4).
  if (ties && ties.foreignPatron) {
    return {
      kind: 'foreign_settlement',
      settlementId: String(ties.foreignPatron),
      factionName: null,
      viaLocalOrg: null,
      criminalInstitution: null,
      conspiracy: ties.conspiracy != null ? String(ties.conspiracy) : null,
      foreign: true,
      covert: true,
    };
  }

  // 3. Derived-as-local (dormancy: byte-identical to the legacy read).
  return {
    kind: 'local_org',
    settlementId: null,
    factionName: null,
    viaLocalOrg: null,
    criminalInstitution: ties && ties.criminalInstitution != null ? ties.criminalInstitution : null,
    conspiracy: null,
    foreign: false,
    covert: true,
  };
}

// ── THE BOUGHT WATCH, ON THE LOCAL AXIS (ALLEGIANCE-CAR3, 2026-11-08) ───────────────────────────────
// The chair's late row 1 and the ES design's §3.3 bracket (lane/fp-rebase-2026-11-08, DESIGN_FP_ARCH_ES.md):
// a bought watch is a LOCAL allegiance of the watch's FACE to the briber's criminal house, read through
// allegianceOf and the card's own `institution.key` (its allegiance's `via` is 'office' there by the
// design's §1.4) — NEVER the foreign leash (`allegiance.leash`, the web's sidecar: the FOREIGN axis, read
// by resolveLeash). The person arm read `npc.corrupt === true` homed by `npcHomeInstitution` (the
// retired `factionAffiliation` family), which no card has carried since the people car: MEASURED dead
// at the base 4297838f3 and at car 1's tip alike (a lit fp-read-2 run, twenty years: covert 0,
// revealed 0, drag 0 every year at both). The institution arm (a 'corruption' impairment) is unchanged.
// Moved here from corruption.js (the eager first-paint module may not import the allegiance reader);
// both names keep (landed tokens). Pure.

/** @param {unknown} a @param {unknown} b */
function nameMatches(a, b) {
  const x = String(a || '').trim().toLowerCase();
  const y = String(b || '').trim().toLowerCase();
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

/**
 * True when the card is a LOCAL agent still in place: it holds a hidden allegiance to a local criminal
 * house (a foreign leash with no house is the other axis), it is not ousted, and the simulation has not
 * exposed it (its own write-back `corrupt: false` sticks, corruptMarkOf's rule).
 * @param {any} npc @param {any} settlement @returns {boolean}
 */
function isLocalAgentInPlace(npc, settlement) {
  const a = allegianceOf(npc);
  if (!a || !a.house || isOustedNpc(npc)) return false;
  return corruptMarkOf(npc, settlement) === true;
}

/**
 * Which of the settlement's security institutions are compromised, and how.
 *   covert   — the FACE of a security house holds a local hidden allegiance, unexposed (the hidden
 *              stooge), or the house carries only covert 'corruption' impairments; drags onset
 *              security, invisible to the public.
 *   revealed — the institution carries a public 'corruption' impairment (a scandal made it public);
 *              drags onset security AND raises the exposure visibility of anyone still corrupt inside it.
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {{covert: string[], revealed: string[]}}
 */
export function compromisedSecurityInstitutions(settlement) {
  // the institution arm: corruption.js :: securityImpairmentsOf (a covert impairment hidden, a public one revealed)
  const { securityInstitutions, covert, revealed } = securityImpairmentsOf(settlement);
  if (!securityInstitutions.length) return { covert: [], revealed: [] };

  // THE PERSON ARM, LOCAL AXIS: the face of a security house that answers, unexposed, to a local house.
  for (const npc of settlement?.npcs || []) {
    const inst = npc?.institution;
    if (!inst || inst.kind !== 'house' || !isLocalAgentInPlace(npc, settlement)) continue;
    const match = securityInstitutions.find((s) => nameMatches(s.name, inst.key));
    if (match && !revealed.has(match.name)) covert.add(match.name);
  }

  return { covert: [...covert], revealed: [...revealed] };
}

/**
 * The patronage drag corrupted security institutions exert on ONSET-side
 * effective security (covert + revealed both count: a bought watch shields
 * recruits whether or not the town knows it's bought). The dials are
 * corruption.js :: PATRONAGE_TUNING (the bought watch's name, J-12).
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {{drag: number, covert: string[], revealed: string[]}}
 */
export function patronageSecurityDrag(settlement) {
  const { covert, revealed } = compromisedSecurityInstitutions(settlement);
  const count = covert.length + revealed.length;
  return {
    drag: Math.min(PATRONAGE_TUNING.maxDrag, count * PATRONAGE_TUNING.dragPerInstitution),
    covert,
    revealed,
  };
}
