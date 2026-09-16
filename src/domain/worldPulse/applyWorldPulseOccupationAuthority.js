// applyWorldPulseOccupationAuthority — the occupier-authority install: the disarm,
// governing and civic cuts a conquest writes onto the occupied roster. Split verbatim out
// of applyWorldPulse.js by THE DECOMPOSITION WAVE (war tranche, file 4); every body here
// is byte-identical to its pre-split declaration.
// THE TYPE SURFACE IS PART OF THE PUBLIC SURFACE (R-BLD-9 / the file-2 lesson):
// these aliases are re-declared in every member of the family that names them, so a
// split never silently drops a typedef and lands strict errors on a consumer.
/** @typedef {import('./pulseShapes.js').WorldState} PulseWorldState */
/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {import('../settlement.schema.js').SimFaction} SimFaction */
/** @typedef {import('../settlement.schema.js').SimInstitution} SimInstitution */

// Occupation-parity multipliers — mirror the GENERATOR's `occupied`-stress
// transform (powerGenerator.js ~1223): the conqueror disarms the locals so a
// PULSE-conquered town looks like a GENERATION-occupied one, not a town that
// merely swapped a flag. A local military/guard faction is gutted (×0.3 — the
// "disarm"); the deposed governing seat is humbled (×0.6) + marked 'occupied';
// every other local civic faction is suppressed (×0.82). Idempotent by the
// 'occupied'/'disarmed' modifier guard so a re-fired conquest never re-cuts.
const OCCUPATION_DISARM = 0.3;
const OCCUPATION_GOVERNING_CUT = 0.6;
const OCCUPATION_CIVIC_CUT = 0.82;

/** @param {import('../settlement.schema.js').SimFaction} f */
const factionNameOf = (f) => String(f?.faction || f?.name || '').trim();
/** @param {import('../settlement.schema.js').SimFaction} f */
const isMilitaryFaction = (f) => {
  const cat = String(f?.category || f?.archetype || '').toLowerCase();
  const nm = factionNameOf(f).toLowerCase();
  return cat === 'military' || /\b(milit|guard|garrison|warrior|legion|soldier)\b/.test(nm);
};

/**
 * Reproduce generation-time occupation RICHNESS on a faction roster that has just
 * been conquered via the pulse: disarm the local military, humble the deposed seat,
 * suppress the civic factions, then seed the foreign occupation authority that
 * transferRulingPower crowns (it only promotes an EXISTING faction). A no-op if the
 * named power already exists (idempotent re-fire) or there is no powerStructure.
 * Used ONLY on cause:'conquest', so every pre-existing (coup) transfer is untouched.
 */
export function installOccupationAuthority(/** @type {any} */ settlement, /** @type {any} */ powerName) {
  const name = String(powerName || '').trim();
  if (!name) return settlement;
  const ps = settlement?.powerStructure;
  if (!ps) return settlement;
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const exists = factions.some((/** @type {any} */ f) => factionNameOf(f).toLowerCase() === name.toLowerCase());
  if (exists) return settlement;
  // Disarm/suppress the locals first (idempotent: a faction already carrying the
  // 'occupied'/'disarmed' modifier is left alone, so a re-fired conquest is a no-op).
  const round = (/** @type {number} */ v) => Math.max(0, Math.round(v));
  const num = (/** @type {any} */ v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const disarmedFactions = factions.map((/** @type {any} */ f) => {
    const mods = Array.isArray(f?.modifiers) ? f.modifiers : [];
    if (mods.includes('occupied') || mods.includes('disarmed')) return f;
    if (f?.isGoverning) {
      return { ...f, power: round(num(f.power) * OCCUPATION_GOVERNING_CUT), modifiers: [...mods, 'occupied'] };
    }
    if (isMilitaryFaction(f)) {
      return { ...f, power: round(num(f.power) * OCCUPATION_DISARM), modifiers: [...mods, 'disarmed'] };
    }
    return { ...f, power: round(num(f.power) * OCCUPATION_CIVIC_CUT), modifiers: [...mods, 'occupied'] };
  });
  // NOTE: the roster's power values are RELATIVE WEIGHTS, not a normalized 100-point
  // share — the sum≈100 seen at generation is a generation-time-only normalization
  // (pinned against the pipeline output), with no runtime consumer enforcing it.
  // Seeding the occupier at 90 without renormalizing matches the other sim-time
  // power writers (transferRulingPower's +6 coup bump, the thieves-guild floor-raise).
  const occupier = {
    faction: name,
    name,
    // category:'occupation' (not 'military') so factionArchetype — which resolves category BEFORE
    // the name rules — buckets the crowned occupier as OCCUPATION, reaching its rank/label/
    // disposition. CATEGORY_MAP already maps 'occupation'; modifiers:['occupier'] still tags it.
    // Dormant behind warLayerEnabled ⇒ golden-neutral.
    category: 'occupation',
    power: 90,
    isGoverning: false,
    desc: 'A foreign occupation authority installed by conquest.',
    modifiers: ['occupier'],
  };
  return {
    ...settlement,
    powerStructure: { ...ps, factions: [...disarmedFactions, occupier] },
  };
}
