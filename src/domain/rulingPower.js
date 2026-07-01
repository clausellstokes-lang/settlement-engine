/**
 * domain/rulingPower.js — who rules, and how rule changes hands.
 *
 * The settlement's government is a persistent BODY (the council / authority
 * the power generator created — its name doubles as the government type:
 * 'Town Council', 'Military Council', 'Theocratic Council', ...). What a
 * transfer of power changes is the AUTHORITATIVE POWER behind that body:
 * the governing seat is reshaped to the new power's preferred government
 * type, the new power ascends, and legitimacy reseeds from how the change
 * happened (a coup against a hated ruler starts warmer than a conquest).
 *
 * One code path, two entrances:
 *   - the coup_detat stressor verdict (worldPulse/coup.js) — the simulation
 *     deciding a contested seat;
 *   - the CHANGE_RULING_POWER canon event (events/mutate.js) — the DM
 *     deciding it directly.
 *
 * Also home to the coup CONTEST model:
 *   - coupContenders(): the top-3 most powerful non-criminal factions are
 *     the field (criminal factions never vie openly — they have their own
 *     capture ladder; a captured seat is shadow governance, not a coup).
 *     The incumbent defends with its power AMPLIFIED by the legitimacy
 *     multiplier the settlement already computes (govMultiplier 1.30 at
 *     Endorsed → 0.60 at Crisis) — the "standing modifier" that party /
 *     user actions move by moving legitimacy — and only gets to contest
 *     the verdict at all if that amplified weight re-enters the top 3 of
 *     the combined field.
 *   - resolveCoupVerdict(): the RNG contest. Highest influence = best
 *     chance; the incumbent's hold probability scales with its amplified
 *     share, dragged by coup severity and the ruling-authority score.
 *
 * Pure + deterministic: no Date, no Math.random — the verdict threads an
 * injected rng; sorts tiebreak on plain codepoint order (never
 * localeCompare — locale collation reorders non-ASCII names across
 * machines and would break replay).
 */

import { factionArchetype, FACTION_ARCHETYPES } from './factionArchetypes.js';

const A = FACTION_ARCHETYPES;

/** @param {any} value */
function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

/** @param {any} value @param {number} [fallback] */
function num(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

/** @param {any} value */
function round2(value) {
  return Math.round(value * 100) / 100;
}

/** @param {import('./settlement.schema.js').SimFaction} faction */
function nameOf(faction) {
  return String(faction?.faction || faction?.name || '').trim();
}

// ── Government-type preferences ────────────────────────────────────────────
// Each authoritative power reshapes the governing body to its preferred
// government type. Labels reuse the power generator's existing vocabulary
// wherever one exists (Town Council / Military Council / Theocratic Council /
// Merchant oligarchy / Royal Authority / ...), tier-banded the same way the
// generator bands its councils (Town... / City... / Grand...).

const SMALL_TIERS = new Set(['thorp', 'hamlet', 'village']);
const LARGE_TIERS = new Set(['city', 'metropolis']);

/** @param {any} tier */
function tierBand(tier) {
  const t = String(tier || '').toLowerCase();
  if (SMALL_TIERS.has(t)) return 'small';
  if (LARGE_TIERS.has(t)) return 'large';
  return 'town';
}

export const GOVERNMENT_PREFERENCES = Object.freeze({
  [A.MILITARY]:   { small: 'Militia Command',        town: 'Military Council',       large: 'Grand Military Council' },
  [A.RELIGIOUS]:  { small: 'Church Council',         town: 'Theocratic Council',     large: 'High Theocratic Council' },
  [A.MERCHANT]:   { small: 'Merchant Council',       town: 'Merchant City Council',  large: 'Grand Merchant Senate' },
  [A.NOBLE]:      { small: 'Feudal Stewardship',     town: 'Ducal Governorship',     large: 'Royal Authority' },
  [A.ARCANE]:     { small: 'Circle of Adepts',       town: 'Arcane Council',         large: 'Grand Arcane Council' },
  [A.CRAFT]:      { small: "Guildmasters' Moot",     town: 'Guildhall Council',      large: 'Grand Guild Assembly' },
  [A.LABOR]:      { small: 'Commons Assembly',       town: "Workers' Assembly",      large: 'Grand Commons Assembly' },
  [A.CIVIC]:      { small: 'Elder Council',          town: 'Town Council',           large: 'City Council' },
  [A.GOVERNMENT]: { small: 'Elder Council',          town: 'Town Council',           large: 'City Council' },
  [A.OUTSIDER]:   { small: 'Foreign Stewardship',    town: 'Foreign Administration', large: 'Foreign Administration' },
  [A.OCCUPATION]: { small: 'Occupation Authority',   town: 'Occupation Authority',   large: 'Occupation Authority' },
  // Criminal rule is never reached by the coup path (excluded from the
  // field), but the DM can install it via CHANGE_RULING_POWER — the labels
  // come from the generator's corrupt-government vocabulary.
  [A.CRIMINAL]:   { small: 'Corrupt Council',        town: 'Corrupt City Council',   large: 'Shadow Senate' },
  [A.OTHER]:      { small: 'Elder Council',          town: 'Town Council',           large: 'City Council' },
});

// Fallbacks when the preferred label collides with an existing faction name.
const ALT_GOVERNMENT_LABELS = Object.freeze({
  [A.MERCHANT]: 'Merchant oligarchy',
  [A.NOBLE]:    'Noble Regency',
  [A.MILITARY]: 'Garrison Command',
  [A.RELIGIOUS]: 'Ecclesiastical Council',
});

const GOVERNMENT_DESCS = Object.freeze({
  [A.MILITARY]:   'Officers govern; security doctrine sets policy and the chain of command is the chain of authority.',
  [A.RELIGIOUS]:  'Clergy govern; doctrine legitimises political authority and the temple calendar shapes civic life.',
  [A.MERCHANT]:   'Commercial power governs; ledgers decide policy and civic access tracks net worth.',
  [A.NOBLE]:      'A noble line governs; precedence, patronage, and inheritance structure every decision.',
  [A.ARCANE]:     'Magical practitioners govern; arcane power legitimises political authority.',
  [A.CRAFT]:      'The craft guilds govern; charters, standards, and apprenticeships double as civic law.',
  [A.LABOR]:      'The working commons govern; assemblies of labourers and smallholders hold the final word.',
  [A.CIVIC]:      'An elected or appointed council governs; prominent families and guilds compete for seats.',
  [A.GOVERNMENT]: 'An elected or appointed council governs; prominent families and guilds compete for seats.',
  [A.OUTSIDER]:   'A foreign power administers the settlement through appointed intermediaries.',
  [A.OCCUPATION]: 'An occupying force governs at spearpoint; local institutions persist on sufferance.',
  [A.CRIMINAL]:   'Criminal influence governs openly; protection is policy and the racket is the treasury.',
  [A.OTHER]:      'A new authority governs; its institutions are still taking shape.',
});

/**
 * The government-type label an authoritative power of the given archetype
 * prefers at the given settlement tier.
 */
export function governmentLabelFor(/** @type {any} */ archetype, /** @type {any} */ tier) {
  const prefs = (/** @type {any} */ (GOVERNMENT_PREFERENCES))[archetype] || GOVERNMENT_PREFERENCES[A.OTHER];
  return prefs[tierBand(tier)];
}

/**
 * The faction entry currently carrying the governing seat.
 * @param {any} settlement
 */
export function governingFactionOf(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  return factions.find((/** @type {any} */ f) => f?.isGoverning)
    || factions.find((/** @type {any} */ f) => nameOf(f) && nameOf(f) === String(ps.governingName || ''))
    || null;
}

// ── Coup contenders ────────────────────────────────────────────────────────
// Per-archetype coercion factor: raw power converts into coup capability at
// different rates — a garrison couples better than a craft guild. Influence
// ranking still dominates (factors stay near 1).

export const COUP_COERCION = Object.freeze({
  [A.MILITARY]: 1.25,
  [A.NOBLE]: 1.1,
  [A.ARCANE]: 1.05,
  [A.GOVERNMENT]: 1.0,
  [A.CIVIC]: 1.0,
  [A.RELIGIOUS]: 1.0,
  [A.OCCUPATION]: 1.0,
  [A.MERCHANT]: 0.95,
  [A.OUTSIDER]: 0.9,
  [A.CRAFT]: 0.85,
  [A.LABOR]: 0.85,
  [A.OTHER]: 0.9,
});

const MIN_CONTENDER_POWER = 5;

/** @param {any} a @param {any} b */
function byWeightDescThenName(a, b) {
  if (b.weight !== a.weight) return b.weight - a.weight;
  if (b.power !== a.power) return b.power - a.power;
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/**
 * The coup field: the top-3 most powerful non-governing, non-criminal
 * factions, plus the incumbent's amplified defense.
 *
 * The incumbent's weight = power × govMultiplier — the legitimacy band the
 * settlement already maintains (1.30 Endorsed → 0.60 Crisis). `gated` is
 * the user-facing rule "the ruler only presents a case if it re-enters the
 * top 3 post-amplification": with a full field of three challengers the
 * amplified weight must match or beat the weakest challenger; a thinner
 * field always admits the incumbent (the pool is the top 3 by definition).
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {{ governing: Object|null,
 *            challengers: Array<{ name:string, archetype:string, power:number, weight:number }>,
 *            incumbent: { name:string|null, power:number, govMultiplier:number,
 *                         amplifiedWeight:number, gated:boolean } }}
 */
export function coupContenders(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const governing = governingFactionOf(settlement);
  const govMultiplier = num(ps.publicLegitimacy?.govMultiplier, 1);

  const challengers = factions
    .filter((/** @type {any} */ f) => f && f !== governing)
    .map((/** @type {any} */ f) => {
      const archetype = /** @type {any} */ (factionArchetype(f));
      const power = num(f.power);
      return {
        name: nameOf(f),
        archetype,
        power,
        weight: round2(power * ((/** @type {any} */ (COUP_COERCION))[archetype] ?? COUP_COERCION[A.OTHER])),
      };
    })
    // Criminal factions never vie for power openly — the capture ladder is
    // their path. Powerless factions can't field a coup at all.
    .filter((/** @type {any} */ c) => c.archetype !== A.CRIMINAL && c.power >= MIN_CONTENDER_POWER && c.name)
    .sort(byWeightDescThenName)
    .slice(0, 3);

  const incumbentPower = num(governing?.power);
  const amplifiedWeight = round2(incumbentPower * govMultiplier);
  const gated = challengers.length < 3
    || amplifiedWeight >= challengers[challengers.length - 1].weight;

  return {
    governing,
    challengers,
    incumbent: {
      name: governing ? nameOf(governing) : null,
      power: incumbentPower,
      govMultiplier,
      amplifiedWeight,
      gated,
    },
  };
}

// ── The verdict ────────────────────────────────────────────────────────────

/**
 * Resolve a coup contest. RNG is preserved — strengths shift the odds,
 * never guarantee the outcome (except the ungated collapse case, where the
 * ruler's case is too weak to even be heard: the fall is near-certain).
 *
 * @param {Object} args
 * @param {Object} args.settlement
 * @param {{ random: () => number }} args.rng
 * @param {number} [args.severity]              coup severity at the verdict (0..1)
 * @param {number|null} [args.rulingAuthorityScore]  causal ruling_authority 0..100 when available
 * @returns {{ holds:boolean, pHold:number, roll:number,
 *            winner:{name:string,archetype:string}|null,
 *            challengers:Array<any>, incumbent:Object, reason:string }}
 */
export function resolveCoupVerdict({ settlement, rng, severity = 0.6, rulingAuthorityScore = null }) {
  const { challengers, incumbent } = coupContenders(settlement);
  if (!challengers.length) {
    return {
      holds: true, pHold: 1, roll: 0, winner: null, challengers, incumbent,
      reason: 'No faction holds enough power to move against the seat. The plot collapses on its own.',
    };
  }

  let pHold;
  if (!incumbent.gated) {
    // The amplified case never re-entered the top 3: the ruler has no
    // standing left to argue from. The seat falls; only the heir is in question.
    pHold = 0.08;
  } else {
    const totalChallenger = challengers.reduce((sum, c) => sum + c.weight, 0);
    const share = incumbent.amplifiedWeight / Math.max(1e-6, incumbent.amplifiedWeight + totalChallenger);
    // A hotter coup (higher severity) erodes the incumbent's edge; the
    // ruling-authority score nudges ±0.125 across its full range.
    const severityDrag = 1.15 - 0.4 * clamp01(severity);
    const authorityAdj = Number.isFinite(rulingAuthorityScore) ? (/** @type {any} */ (rulingAuthorityScore) - 50) / 400 : 0;
    pHold = Math.max(0.1, Math.min(0.9, share * severityDrag + authorityAdj));
  }

  const roll = rng.random();
  if (roll <= pHold) {
    return {
      holds: true, pHold: round2(pHold), roll: round2(roll), winner: null, challengers, incumbent,
      reason: incumbent.gated
        ? `${incumbent.name || 'The ruling power'} presented the stronger case (amplified weight ${incumbent.amplifiedWeight} at ×${incumbent.govMultiplier} legitimacy) and held the seat.`
        : 'Against the odds, the conspirators lost their nerve at the door.',
    };
  }

  // The seat falls. Winner sampled ∝ weight — highest influence, best chance.
  const total = challengers.reduce((sum, c) => sum + c.weight, 0);
  let pick = rng.random() * total;
  let winner = challengers[challengers.length - 1];
  for (const c of challengers) {
    pick -= c.weight;
    if (pick <= 0) { winner = c; break; }
  }
  return {
    holds: false, pHold: round2(pHold), roll: round2(roll),
    winner: { name: winner.name, archetype: winner.archetype }, challengers, incumbent,
    reason: incumbent.gated
      ? `${winner.name} out-maneuvered both the seat and its rivals (weight ${winner.weight} of ${round2(total)}).`
      : `${incumbent.name || 'The ruling power'}'s case never re-entered the field. ${winner.name} took the seat near-unopposed.`,
  };
}

// ── Legitimacy reseed ──────────────────────────────────────────────────────
// Band thresholds + multipliers mirror factionDynamics.computePublicLegitimacy
// and timeProgression's private reBand — the two existing writers. Keep all
// three in step if the bands ever move.

/** @param {any} prev @param {any} score */
function rebandLegitimacy(prev, score) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  let band;
  if (clamped >= 75)      band = { label: 'Endorsed',          color: '#1a5a28', govMultiplier: 1.30, crimMultiplier: 0.75 };
  else if (clamped >= 60) band = { label: 'Approved',          color: '#4a7a2a', govMultiplier: 1.15, crimMultiplier: 0.90 };
  else if (clamped >= 45) band = { label: 'Tolerated',         color: '#a0762a', govMultiplier: 1.00, crimMultiplier: 1.00 };
  else if (clamped >= 30) band = { label: 'Contested',         color: '#8a4010', govMultiplier: 0.80, crimMultiplier: 1.15 };
  else                    band = { label: 'Legitimacy Crisis', color: '#8b1a1a', govMultiplier: 0.60, crimMultiplier: 1.30 };
  return {
    ...(prev || {}),
    score: clamped,
    label: band.label,
    color: band.color,
    govMultiplier: band.govMultiplier,
    crimMultiplier: band.crimMultiplier,
    isEndorsed: clamped >= 75,
    isApproved: clamped >= 60,
    isTolerated: clamped >= 45 && clamped < 60,
    isContested: clamped >= 30 && clamped < 45,
    isLegitimacyCrisis: clamped < 30,
    governanceFractured: clamped < 30,
  };
}

export const RULING_POWER_CAUSES = Object.freeze(['coup', 'election', 'succession', 'conquest', 'appointment']);

// New-regime legitimacy: base by cause, pulled by how the OLD ruler stood —
// deposing a hated ruler (score 10) starts the new one warmer than deposing a
// merely contested one. (50 - oldScore) * oldPull is that pull.
const LEGITIMACY_SEEDS = Object.freeze({
  coup:        { base: 38, oldPull: 0.25, min: 25, max: 55 },
  conquest:    { base: 28, oldPull: 0.10, min: 18, max: 40 },
  election:    { base: 56, oldPull: 0.15, min: 45, max: 70 },
  succession:  { base: 48, oldPull: 0.10, min: 38, max: 60 },
  appointment: { base: 45, oldPull: 0.10, min: 35, max: 55 },
});

const STABILITY_BY_CAUSE = Object.freeze({
  coup:        'Unsettled: power changed hands by force; loyalties are being re-sworn',
  conquest:    'Subjugated: an outside power imposed the new order',
  election:    'Stable: a fresh mandate, still finding its footing',
  succession:  'Transitional: the succession held, the household is reordering',
  appointment: 'Transitional: an appointed authority is establishing itself',
});

const MAX_PREVIOUS_GOVERNMENTS = 6;

/** @param {any} archetype @param {any} tier @param {any} factions @param {any} governing */
function resolveGovernmentLabel(archetype, tier, factions, governing) {
  const preferred = governmentLabelFor(archetype, tier);
  const taken = new Set(
    factions.filter((/** @type {any} */ f) => f !== governing).map((/** @type {any} */ f) => nameOf(f).toLowerCase()).filter(Boolean),
  );
  if (!taken.has(preferred.toLowerCase())) return preferred;
  const alt = (/** @type {any} */ (ALT_GOVERNMENT_LABELS))[archetype];
  if (alt && !taken.has(alt.toLowerCase())) return alt;
  return `${preferred} Ascendant`;
}

/**
 * Transfer the governing seat to a new authoritative power.
 *
 * The governing BODY persists — its entry keeps the seat (isGoverning) but
 * is reshaped to the new power's preferred government type (name + desc).
 * The new power's own faction ascends (+6 power, 'ascendant'); the old
 * government label is recorded on powerStructure.previousGovernments;
 * legitimacy reseeds by cause; relationships keyed to the old label are
 * re-keyed; stability + recentConflict update.
 *
 * Pure — returns a NEW settlement, or `{ settlement, error }` unchanged
 * when the transfer can't apply (no governing seat, unknown faction,
 * faction already governs).
 *
 * @param {any} settlement
 * @param {string} newPowerName    faction name (powerStructure.factions entry)
 * @param {Object} [opts]
 * @param {'coup'|'election'|'succession'|'conquest'|'appointment'} [opts.cause]
 * @param {number|null} [opts.tick]
 * @param {string[]} [opts.losers]  losing contender names (coup verdicts) — get grudge edges
 * @returns {{ settlement: Object, transfer: Object|null, error: string|null }}
 */
export function transferRulingPower(settlement, newPowerName, opts = {}) {
  const cause = RULING_POWER_CAUSES.includes(/** @type {any} */ (opts.cause)) ? /** @type {any} */ (opts.cause) : 'coup';
  const tick = Number.isFinite(opts.tick) ? opts.tick : null;
  const losers = Array.isArray(opts.losers) ? opts.losers : [];

  const ps = settlement?.powerStructure;
  const factions = Array.isArray(ps?.factions) ? ps.factions : [];
  const governing = governingFactionOf(settlement);
  if (!governing) return { settlement, transfer: null, error: 'no_governing_faction' };

  const target = String(newPowerName || '').trim().toLowerCase();
  const winner = factions.find((/** @type {any} */ f) => f !== governing && nameOf(f).toLowerCase() === target);
  if (!winner) {
    return {
      settlement, transfer: null,
      error: nameOf(governing).toLowerCase() === target ? 'already_governing' : 'faction_not_found',
    };
  }

  const archetype = /** @type {any} */ (factionArchetype(winner));
  const fromGovernment = nameOf(governing);
  const toGovernment = resolveGovernmentLabel(archetype, settlement.tier, factions, governing);

  const nextFactions = factions.map((/** @type {any} */ f) => {
    if (f === governing) {
      return {
        ...f,
        faction: toGovernment,
        ...(f.name != null ? { name: toGovernment } : {}),
        desc: (/** @type {any} */ (GOVERNMENT_DESCS))[archetype] || GOVERNMENT_DESCS[A.OTHER],
        isGoverning: true,
        modifiers: [...(f.modifiers || []), cause === 'coup' ? 'seized_power' : cause],
        legitimacyCrisis: false,
        crisisNote: null,
      };
    }
    if (f === winner) {
      return {
        ...f,
        power: Math.round(num(f.power) + 6),
        modifiers: [...(f.modifiers || []), 'ascendant'],
      };
    }
    return f;
  });

  const oldLegitimacy = ps.publicLegitimacy || null;
  const oldScore = num(oldLegitimacy?.score, 50);
  const seed = (/** @type {any} */ (LEGITIMACY_SEEDS))[cause];
  const newScore = Math.max(seed.min, Math.min(seed.max, seed.base + (50 - oldScore) * seed.oldPull));
  const publicLegitimacy = rebandLegitimacy(oldLegitimacy, newScore);

  // Re-key relationships that referenced the old government label. Any edge
  // that now connects the seat to its new power-behind CONVERTS to symbiotic
  // (whatever friction it carried died with the old order); the (coup) losers
  // get grudge edges.
  const winnerName = nameOf(winner);
  const symbioticNarrative = `${winnerName} is the power behind the ${toGovernment.toLowerCase()}. The seat answers to them now.`;
  let pairedWithWinner = false;
  const renamedRelationships = (ps.factionRelationships || []).map((/** @type {any} */ rel) => {
    if (!Array.isArray(rel?.pair)) return rel;
    const pair = rel.pair.includes(fromGovernment)
      ? rel.pair.map((/** @type {any} */ n) => (n === fromGovernment ? toGovernment : n))
      : rel.pair;
    const next = pair === rel.pair ? rel : { ...rel, pair };
    if (pair.includes(toGovernment) && pair.includes(winnerName)) {
      pairedWithWinner = true;
      return { ...next, type: 'symbiotic', direction: 'stable', narrative: symbioticNarrative };
    }
    return next;
  });
  const extraRelationships = /** @type {any[]} */ ([]);
  const havePair = (/** @type {any} */ a, /** @type {any} */ b) => renamedRelationships.concat(extraRelationships)
    .some((/** @type {any} */ rel) => Array.isArray(rel?.pair) && rel.pair.includes(a) && rel.pair.includes(b));
  if (!pairedWithWinner && toGovernment !== winnerName) {
    extraRelationships.push({
      pair: [toGovernment, winnerName],
      type: 'symbiotic',
      direction: 'stable',
      narrative: symbioticNarrative,
    });
  }
  for (const loser of losers) {
    if (!loser || loser === nameOf(winner) || havePair(toGovernment, loser)) continue;
    extraRelationships.push({
      pair: [toGovernment, loser],
      type: 'competitive',
      direction: 'escalating',
      narrative: `${loser} moved for the seat and lost. The new order has not forgotten, and neither have they.`,
    });
  }

  const previousGovernments = [
    ...(ps.previousGovernments || []),
    { label: fromGovernment, cause, tick },
  ].slice(-MAX_PREVIOUS_GOVERNMENTS);

  const transfer = {
    fromGovernment,
    toGovernment,
    authorityName: nameOf(winner),
    authorityArchetype: archetype,
    cause,
    tick,
    legitimacyBefore: { score: oldScore, label: oldLegitimacy?.label || null },
    legitimacyAfter: { score: publicLegitimacy.score, label: publicLegitimacy.label },
  };

  return {
    settlement: {
      ...settlement,
      powerStructure: {
        ...ps,
        factions: nextFactions,
        governingName: toGovernment,
        government: toGovernment,
        previousGovernments,
        publicLegitimacy,
        factionRelationships: [...renamedRelationships, ...extraRelationships],
        stability: (/** @type {any} */ (STABILITY_BY_CAUSE))[cause],
        recentConflict: cause === 'coup'
          ? `${nameOf(winner)} overthrew the ${fromGovernment.toLowerCase()} and reshaped the government as a ${toGovernment.toLowerCase()}.`
          : `Power passed to ${nameOf(winner)} by ${cause}; the government now sits as a ${toGovernment.toLowerCase()}.`,
      },
    },
    transfer,
    error: null,
  };
}
