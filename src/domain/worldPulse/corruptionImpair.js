/**
 * corruptionImpair — §corruption Phase 1b-ii-b. Applies the institution
 * impairment that follows an exposure (organic OR the DM expose-corruption event,
 * in Phase 4): a scandal tarnishes BOTH the tied criminal institution AND the
 * corrupt NPC's home institution/faction, with the existing impairment +
 * propagation machinery.
 *
 * Deterministic: every impairment carries `appliedAt: now` (the world-pulse bans
 * new Date()), and propagateImpairment now inherits that timestamp. Pure data
 * transform — returns the same settlement reference when there's nothing to do.
 */
import { withImpairment } from '../entities/status.js';
import { propagateImpairment } from '../entities/propagate.js';
import { readCorruptionClimate, npcHomeInstitution } from '../corruption.js';

/** @typedef {import('../entities/status.js').Impairment} Impairment */
/** @typedef {import('../entities/propagate.js').PropagationInstitution} PropInstitution */
/** @typedef {import('../entities/propagate.js').PropagationFaction} PropFaction */
/** @typedef {import('../entities/propagate.js').PropagationSettlement} PropSettlement */

/** @param {unknown} s @returns {string} */
const norm = (s) => String(s || '').trim().toLowerCase();
/** @param {{ name?: string, faction?: string } | null | undefined} x @returns {string} */
const nameOf = (x) => x?.name || x?.faction || '';

/**
 * @template {{ name?: string, faction?: string }} T
 * @param {T[] | null | undefined} arr
 * @param {unknown} name
 * @returns {T | null}
 */
function matchByName(arr, name) {
  const n = norm(name);
  if (!n || !Array.isArray(arr)) return null;
  return arr.find((x) => norm(nameOf(x)) === n)
    || arr.find((x) => { const xn = norm(nameOf(x)); return xn && (xn.includes(n) || n.includes(xn)); })
    || null;
}

/**
 * @param {PropSettlement} settlement
 * @param {PropInstitution} inst
 * @param {Impairment} impairment
 */
function impairInstitution(settlement, inst, impairment) {
  const institutions = (settlement.institutions || []).map((i) => (i === inst ? withImpairment(i, impairment) : i));
  return propagateImpairment({
    settlement: { ...settlement, institutions },
    origin: { entityType: 'institution', entityId: /** @type {string} */ (inst.id || inst.name), impairment },
  });
}

/**
 * @param {PropSettlement} settlement
 * @param {PropFaction} fac
 * @param {Impairment} impairment
 * @param {boolean} inPower
 */
function impairFaction(settlement, fac, impairment, inPower) {
  const list = /** @type {PropFaction[]} */ (inPower ? (/** @type {{ factions: PropFaction[] }} */ (settlement.powerStructure)).factions : settlement.factions);
  const nextList = list.map((f) => (f === fac ? withImpairment(f, impairment) : f));
  const next = inPower
    ? { ...settlement, powerStructure: { ...settlement.powerStructure, factions: nextList } }
    : { ...settlement, factions: nextList };
  return propagateImpairment({
    settlement: next,
    origin: { entityType: 'faction', entityId: fac.id || nameOf(fac), impairment },
  });
}

/** Impair the named entity — an institution if one matches, else a faction. No-op
 *  when nothing matches (a corrupt NPC's home may not be a tracked institution).
 * @param {PropSettlement & { factions?: PropFaction[] }} settlement
 * @param {string} name
 * @param {Impairment} impairment
 */
function impairByName(settlement, name, impairment) {
  if (!name) return settlement;
  const inst = matchByName(settlement.institutions, name);
  if (inst) return impairInstitution(settlement, inst, impairment);
  const powerFacs = settlement.powerStructure?.factions;
  if (Array.isArray(powerFacs)) {
    const f = matchByName(powerFacs, name);
    if (f) return impairFaction(settlement, f, impairment, true);
  }
  if (Array.isArray(settlement.factions)) {
    const f = matchByName(settlement.factions, name);
    if (f) return impairFaction(settlement, f, impairment, false);
  }
  return settlement;
}

/**
 * @param {PropSettlement} settlement
 * @param {Array<{npcId:string,name:string,kind:string,criminalInstitution?:string,homeInstitution?:string}>} exposures
 * @param {{now?:string}} [opts]
 */
export function applyCorruptionImpairments(settlement, exposures, { now } = {}) {
  if (!settlement || !Array.isArray(exposures) || !exposures.length) return settlement;
  let next = settlement;
  for (const e of exposures) {
    const severity = e.kind === 'ousted' ? 0.5 : 0.3;
    /** @type {Impairment} */
    const base = { type: 'legitimacy', severity, causeEventId: `corruption:${e.npcId}:${e.kind}`, appliedAt: now };
    if (e.criminalInstitution) {
      next = impairByName(next, e.criminalInstitution, { ...base, description: `Exposure of ${e.name} disrupted ${e.criminalInstitution}.` });
    }
    if (e.homeInstitution) {
      next = impairByName(next, e.homeInstitution, { ...base, causeEventId: `corruption:${e.npcId}:${e.kind}:home`, description: `${e.name}'s corruption scandal tarnished ${e.homeInstitution}.` });
    }
    // An OUSTING makes the institution's corruption public record: a
    // 'corruption' impairment (long-dormant vocabulary in entities/status.js,
    // emitted nowhere until now). The duality loop reads it back — the
    // revealed institution drags onset security AND raises exposure
    // visibility for anyone still corrupt inside it.
    if (e.kind === 'ousted' && e.homeInstitution) {
      next = impairByName(next, e.homeInstitution, /** @type {Impairment} */ ({
        type: 'corruption',
        severity: 0.45,
        causeEventId: `corruption:${e.npcId}:ousted:institutional`,
        appliedAt: now,
        description: `${e.name}'s network inside ${e.homeInstitution} is now public knowledge.`,
      }));
    }
  }
  return next;
}

// ── Organic institutional reform ─────────────────────────────────────────
// The counterpart to the scandal: a corruption-impaired institution whose
// corrupt insiders have all been ousted (or were never tracked) gets a
// per-tick, security/prosperity-scaled chance to clean house — the purge
// worked, the auditors finish, the new captain's appointment sticks.
// Without this, 'revealed' was a PERMANENT state: the patronage drag and
// exposure-proximity penalties never lifted. An institution still harboring
// an unexposed corrupt NPC cannot reform — the rot is still inside.

export const REFORM_TUNING = Object.freeze({
  base: 0.05, security: 0.15, prosperity: 0.05, min: 0.02, max: 0.35,
});

export function reformChance({ security = 0.4, prosperity = 0.4 } = {}) {
  const p = REFORM_TUNING.base + security * REFORM_TUNING.security + prosperity * REFORM_TUNING.prosperity;
  return Math.max(REFORM_TUNING.min, Math.min(REFORM_TUNING.max, p));
}

/** @param {{ impairments?: Impairment[] } | null | undefined} inst @returns {boolean} */
function hasCorruptionImpairment(inst) {
  return (inst?.impairments || []).some((i) => i?.type === 'corruption');
}

/**
 * @param {{ npcs?: Array<Record<string, unknown>> } | null | undefined} settlement
 * @param {unknown} instName
 * @returns {boolean}
 */
function harborsCorruptInsider(settlement, instName) {
  const n = norm(instName);
  for (const npc of settlement?.npcs || []) {
    if (npc?.corrupt !== true || npc?.ousted) continue;
    const home = norm(npcHomeInstitution(npc));
    if (home && (home === n || home.includes(n) || n.includes(home))) return true;
  }
  return false;
}

/**
 * @param {PropInstitution} inst
 * @returns {PropInstitution}
 */
function withoutCorruptionImpairments(inst) {
  const filtered = (inst.impairments || []).filter((i) => i?.type !== 'corruption');
  const status = filtered.length === 0 && inst.status === 'impaired' ? 'active' : inst.status;
  return { ...inst, impairments: filtered, status };
}

/**
 * Roll reform for every corruption-impaired institution in a settlement.
 * Deterministic via the threaded rng (fork per institution name).
 *
 * @param {PropSettlement} settlement
 * @param {{fork: (key: string) => {random: () => number}}} rng
 * @returns {{settlement: object, reformed: Array<{name: string}>}}
 */
export function advanceInstitutionReform(settlement, rng) {
  const institutions = settlement?.institutions;
  if (!Array.isArray(institutions) || !institutions.some(hasCorruptionImpairment)) {
    return { settlement, reformed: [] };
  }
  const climate = readCorruptionClimate(settlement);
  const chance = reformChance(climate);
  /** @type {Array<{name: string}>} */
  const reformed = [];
  const nextInstitutions = institutions.map((inst) => {
    if (!hasCorruptionImpairment(inst)) return inst;
    if (harborsCorruptInsider(settlement, inst.name)) return inst; // rot still inside
    if (rng.fork(`reform:${norm(inst.name)}`).random() >= chance) return inst;
    reformed.push({ name: /** @type {string} */ (inst.name) });
    return withoutCorruptionImpairments(inst);
  });
  if (!reformed.length) return { settlement, reformed };
  return { settlement: { ...settlement, institutions: nextInstitutions }, reformed };
}
