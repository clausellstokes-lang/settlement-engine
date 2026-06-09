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

const norm = (s) => String(s || '').trim().toLowerCase();
const nameOf = (x) => x?.name || x?.faction || '';

function matchByName(arr, name) {
  const n = norm(name);
  if (!n || !Array.isArray(arr)) return null;
  return arr.find((x) => norm(nameOf(x)) === n)
    || arr.find((x) => { const xn = norm(nameOf(x)); return xn && (xn.includes(n) || n.includes(xn)); })
    || null;
}

function impairInstitution(settlement, inst, impairment) {
  const institutions = (settlement.institutions || []).map((i) => (i === inst ? withImpairment(i, impairment) : i));
  return propagateImpairment({
    settlement: { ...settlement, institutions },
    origin: { entityType: 'institution', entityId: inst.id || inst.name, impairment },
  });
}

function impairFaction(settlement, fac, impairment, inPower) {
  const list = inPower ? settlement.powerStructure.factions : settlement.factions;
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
 *  when nothing matches (a corrupt NPC's home may not be a tracked institution). */
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
 * @param {object} settlement
 * @param {Array<{npcId:string,name:string,kind:string,criminalInstitution?:string,homeInstitution?:string}>} exposures
 * @param {{now?:string}} opts
 */
export function applyCorruptionImpairments(settlement, exposures, { now } = {}) {
  if (!settlement || !Array.isArray(exposures) || !exposures.length) return settlement;
  let next = settlement;
  for (const e of exposures) {
    const severity = e.kind === 'ousted' ? 0.5 : 0.3;
    const base = { type: 'legitimacy', severity, causeEventId: `corruption:${e.npcId}:${e.kind}`, appliedAt: now };
    if (e.criminalInstitution) {
      next = impairByName(next, e.criminalInstitution, { ...base, description: `Exposure of ${e.name} disrupted ${e.criminalInstitution}.` });
    }
    if (e.homeInstitution) {
      next = impairByName(next, e.homeInstitution, { ...base, causeEventId: `corruption:${e.npcId}:${e.kind}:home`, description: `${e.name}'s corruption scandal tarnished ${e.homeInstitution}.` });
    }
  }
  return next;
}
