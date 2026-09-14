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
 * ⭐⭐ AND THE SEAT CAN NOW BE LOST WITHOUT THE HOUSE BEING LOST (ODQ §865, on
 * §810.8 R23's direction). A transfer by a LAWFUL cause on a Register VII world
 * leaves the defeated house standing as a non-governing power carrying
 * `fell_from_power`, its relationships intact; force (coup, conquest) still
 * overwrites it, which is R23's own division. Every v1 world — every world the
 * product makes today — is byte-identical to before that repair.
 *
 * The coup CONTEST model (COUP_COERCION / coupContenders / resolveCoupVerdict)
 * lives in the sibling domain/rulingPowerCoup.js — it is reached ONLY by the
 * lazy worldPulse tick modules, and transferRulingPower (the eager entrance)
 * uses none of it, so it is split out to keep it off the first-paint closure.
 *
 * Pure + deterministic: no Date, no Math.random — the verdict threads an
 * injected rng; sorts tiebreak on plain codepoint order (never
 * localeCompare — locale collation reorders non-ASCII names across
 * machines and would break replay).
 */

import { factionArchetype, FACTION_ARCHETYPES } from './factionArchetypes.js';
// ⚠ THE DENSITY LAW'S OWN GATE, NOT A SECOND DIAL. `rollsRegisterVii` reads the version
// a world was BORN under, so a save, a load, a same-seed regen and an undo all replay the
// law the world was born under (densityLaw.js property 3). It costs this module nothing at
// the bundle: `domain/density/densityLaw.js` is ALREADY in the entry's first-paint static
// closure via `domain/events/mutateEntities.js`, which imports this same symbol.
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
import { rollsRegisterVii } from './density/densityLaw.js';

const A = FACTION_ARCHETYPES;

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * A powerStructure faction entry (legacy generator shape — `faction` is the
 * display name field; some entries also carry `name`).
 *
 * ⚠ `id` IS DECLARED AND NO GENERATOR WRITES IT. Measured through the full
 * generateSettlementPipeline: 2,175 faction rows over 360 settlements across
 * all six tiers carry `[faction, power, desc, category, rawPower, powerLabel]`
 * plus situational `[modifier, isGoverning, legitimacyCrisis, crisisNote,
 * modifiers]` — and `id` on ZERO of them. It is declared anyway because it is
 * not a phantom key like `.archetype` (see religionLegitimacy.js, which keeps
 * that one OFF this typedef): `id` is the estate's RENAME-DECOUPLED SEAM for
 * authored/DM records, honoured as first-class-when-present by the canonical
 * accessors (`ladderFactionKey`, `npcInFaction`) and registered as an alias id
 * by the dossier link web (dossier/entityLinks.js). Every reader below must
 * therefore treat it as OPTIONAL and carry a live fallback: an unguarded
 * `f.id` read is inert on 100% of generated data.
 * @typedef {Object} RulingFaction
 * @property {string} [faction]
 * @property {string} [name]
 * @property {string} [id]
 * @property {string} [desc]
 * @property {number} [power]
 * @property {boolean} [isGoverning]
 * @property {string[]} [modifiers]
 * @property {boolean} [legitimacyCrisis]
 * @property {string | null} [crisisNote]
 */

/**
 * @typedef {Object} FactionRelationshipEdge
 * @property {string[]} [pair]
 * @property {string} [type]
 * @property {string} [direction]
 * @property {string} [narrative]
 */

/**
 * @typedef {Object} PowerStructure
 * @property {RulingFaction[]} [factions]
 * @property {string} [governingName]
 * @property {string} [government]
 * @property {{score?: number, label?: string, govMultiplier?: number}} [publicLegitimacy]
 * @property {FactionRelationshipEdge[]} [factionRelationships]
 * @property {Array<{label: string, cause: string, tick: number | null}>} [previousGovernments]
 * @property {string} [stability]
 * @property {string} [recentConflict]
 */

/**
 * ⚠ `config` / `_config` ARE DECLARED BECAUSE THIS MODULE NOW READS THEM, and both
 * spellings are declared because the estate genuinely carries both: `factionRoles.js`
 * and `mutateEntities.js` each read `settlement.config || settlement._config`, and a
 * declaration narrower than the call sites is the class of lie that reddens a strict
 * arm later. It is the persisted generation-input bag — the same one that carries
 * `_seed` and `_densityLawVersion`.
 * @typedef {Object} RulingPowerSettlement
 * @property {PowerStructure} [powerStructure]
 * @property {string} [tier]
 * @property {Record<string, unknown>} [config]
 * @property {Record<string, unknown>} [_config]
 */

/** @param {number} value */

/**
 * @param {unknown} value
 * @param {number} [fallback]
 * @returns {number}
 */
export function num(value, fallback = 0) {
  return /** @type {number} */ (Number.isFinite(value) ? value : fallback);
}

/** @param {number} value */
export function round2(value) {
  return Math.round(value * 100) / 100;
}

/**
 * @param {RulingFaction | null | undefined} faction
 * @returns {string}
 */
export function nameOf(faction) {
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

/**
 * @param {string | null | undefined} tier
 * @returns {'small' | 'town' | 'large'}
 */
function tierBand(tier) {
  const t = String(tier || '').toLowerCase();
  if (SMALL_TIERS.has(t)) return 'small';
  if (LARGE_TIERS.has(t)) return 'large';
  return 'town';
}

/** @type {Readonly<Record<string, {small: string, town: string, large: string}>>} */
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
/** @type {Readonly<Record<string, string>>} */
const ALT_GOVERNMENT_LABELS = Object.freeze({
  [A.MERCHANT]: 'Merchant oligarchy',
  [A.NOBLE]:    'Noble Regency',
  [A.MILITARY]: 'Garrison Command',
  [A.RELIGIOUS]: 'Ecclesiastical Council',
  // The conquest occupier's own NAME ('<power> occupation authority') CONTAINS the
  // preferred label — the containment check below falls here so the crowned seat
  // never reads like a duplicate of the power behind it.
  [A.OCCUPATION]: 'Martial Administration',
});

/** @type {Readonly<Record<string, string>>} */
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
 *
 * @param {string} archetype
 * @param {string | null | undefined} tier
 * @returns {string}
 */
export function governmentLabelFor(archetype, tier) {
  const prefs = GOVERNMENT_PREFERENCES[archetype] || GOVERNMENT_PREFERENCES[A.OTHER];
  return prefs[tierBand(tier)];
}

/**
 * The faction entry currently carrying the governing seat.
 * @param {RulingPowerSettlement | null | undefined} settlement
 * @returns {RulingFaction | null}
 */
export function governingFactionOf(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  return factions.find(f => f?.isGoverning)
    || factions.find(f => nameOf(f) && nameOf(f) === String(ps.governingName || ''))
    || null;
}

/**
 * Label-free epoch for legitimate-authority transfers.
 *
 * `previousGovernments` is intentionally bounded and legacy event transfers may
 * carry a null tick.  Cause/tick tuples alone can therefore collide once the
 * bound is full.  `transferRulingPower` also appends one `ascendant` marker to
 * the exact winning roster entry on every real transfer; folding only those
 * marker counts (by stable roster position/id) distinguishes that otherwise
 * invisible transfer without making a display-name edit look like succession.
 * This is a read helper only: dark campaigns gain no persisted bytes.
 *
 * ⛔ THE `faction.id` SLOT IN THE LINEAGE TUPLE STAYS ID-ONLY — DO NOT "FIX" IT
 * WITH A NAME-DERIVED KEY. It resolves null on 100% of generated data (0 of
 * 2,175 measured rows carry `id`), so a sweep of the estate's dead `.id` reads
 * naturally reaches for `ladderFactionKey` / `factionIdFromName` here as it does
 * at the two address sites (warSeatBooks.readWarSeatBooks,
 * applyWorldPulse's seat-transition row). Both of those keys are SLUGS OF THE
 * DISPLAY NAME, and this tuple is the one place in the estate where that is
 * forbidden: this epoch is the succession discriminator, so a name-derived
 * component would make every faction RENAME read as a legitimate authority
 * transfer — the exact failure the sentence above forbids. The roster `index`
 * plus the `ascendant` count carry the discrimination on generated worlds; the
 * `id` slot only sharpens it for authored records that genuinely carry a
 * rename-decoupled id. Dead-on-generated-data is CORRECT here, not a defect.
 *
 * @param {RulingPowerSettlement | null | undefined} settlement
 * @returns {string}
 */
export function authorityTransferEpochFor(settlement) {
  const ps = settlement?.powerStructure || {};
  const history = Array.isArray(ps.previousGovernments) ? ps.previousGovernments : [];
  const transfers = history.map((raw) => {
    const row = raw && typeof raw === 'object' ? raw : {};
    const tick = Number(row.tick);
    return [String(row.cause || ''), Number.isFinite(tick) && row.tick != null ? Math.floor(tick) : null];
  });
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const lineage = factions.map((faction, index) => {
    const modifiers = Array.isArray(faction?.modifiers) ? faction.modifiers : [];
    const ascensions = modifiers.reduce((count, marker) => (
      String(marker) === 'ascendant' ? count + 1 : count
    ), 0);
    return ascensions > 0 ? [index, typeof faction?.id === 'string' ? faction.id : null, ascensions] : null;
  }).filter(Boolean);
  return JSON.stringify([transfers, lineage]);
}

/**
 * Governing-body labels from real power transfers, newest first.
 *
 * This is a read-only compatibility bridge for name-keyed ladder membership:
 * legacy/generated NPCs may still name the old governing body after the transfer
 * reshapes that body. Consumers may use these exact history rows as aliases while
 * they migrate their own keyed state. Pure display renames never append a
 * previous-government row, so they cannot masquerade as a transfer here.
 *
 * @param {RulingPowerSettlement | null | undefined} settlement
 * @returns {string[]}
 */
export function previousGovernmentLabelsOf(settlement) {
  const history = settlement?.powerStructure?.previousGovernments;
  if (!Array.isArray(history) || !history.length) return [];
  const labels = [];
  const seen = new Set();
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const row = history[index];
    if (!row || typeof row !== 'object') continue;
    const label = String(row.label || '').trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  return labels;
}

// ── Coup contenders ────────────────────────────────────────────────────────
// Per-archetype coercion factor: raw power converts into coup capability at
// different rates — a garrison couples better than a craft guild. Influence
// ranking still dominates (factors stay near 1).

// ── Coup CONTEST model (extracted) ──────────────────────────────────────────
// COUP_COERCION + coupContenders + resolveCoupVerdict moved to
// domain/rulingPowerCoup.js: they are reached ONLY by lazy worldPulse tick
// modules (coup / stressorDynamics / stressorGates / deploymentReturn /
// disposition), never by first-paint code. transferRulingPower (the eager
// entrance via events/mutateWorld) uses none of them, so keeping them here
// dragged the whole contest model into the first-paint closure for no eager
// consumer. The leaf imports the shared helpers (num/round2/nameOf/
// governingFactionOf) back from here — the safe lazy → eager direction.
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).

// ── Legitimacy reseed ──────────────────────────────────────────────────────
// Band thresholds + multipliers mirror factionDynamics.computePublicLegitimacy
// and timeProgression's private reBand — the two existing writers. Keep all
// three in step if the bands ever move.

/**
 * @param {{score?: number, label?: string, govMultiplier?: number} | null} prev
 * @param {number} score
 */
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

/**
 * ⭐⭐ ODQ §810.8 R23 — THE CAUSES BY WHICH THE SEAT PASSES LAWFULLY, AND THEREFORE
 * THE CAUSES UNDER WHICH THE DEFEATED HOUSE LIVES.
 *
 * The owner's own words split the world in two: a rebellion or coup "completely
 * overthrows the ruling seat (factions and all)", while a rival "simply takes over
 * because they legitimacy and challenged and won". R23 names the halves and states the
 * distinction outright: *"the difference between transfer and overthrow is whether the
 * old house lives, and that difference is where decades of story come from."*
 *
 *   TRANSFER  (these causes)      — the defeated house SURVIVES DEMOTED. Out of the
 *                                   seat, still among the powers, keeping its grudges
 *                                   and its possibility of revanche.
 *   OVERTHROW (`coup`, `conquest`) — the house is removed. That is today's behaviour and
 *                                   it is untouched by this repair; §810.8 says outright
 *                                   that "the coup machinery already in the tree serves
 *                                   this family".
 */
export const LAWFUL_PASSAGE_CAUSES = Object.freeze(['succession', 'election', 'appointment']);

/** The modifier a house carries once it has lost the seat and lived. Sibling of the
 *  succession grammar's `house_power_fell` lesson word. */
export const DEPOSED_MODIFIER = 'fell_from_power';

/**
 * Does this transfer LEAVE THE DEFEATED HOUSE STANDING?
 *
 * Tri-state by design. An explicit `demoteIncumbent` is a caller's typed decision and
 * wins outright (the succession grammar's wiring car will pass its own
 * `defeatedHouse.disposition`); ABSENT, the answer is the world's own born-under law —
 * ⭐ the same `rollsRegisterVii` gate every other density surface reads, never a global
 * dial. Under v1 — every world the product makes today — this is false at every call
 * site, so the whole function is byte-identical to the one that could not demote.
 *
 * @param {RulingPowerSettlement | null | undefined} settlement
 * @param {string} cause
 * @param {boolean | undefined} requested
 * @returns {boolean}
 */
function demotesIncumbent(settlement, cause, requested) {
  if (typeof requested === 'boolean') return requested;
  if (!LAWFUL_PASSAGE_CAUSES.includes(cause)) return false;
  return rollsRegisterVii(settlement?.config || settlement?._config || null);
}

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

/**
 * @param {string} archetype
 * @param {string | null | undefined} tier
 * @param {RulingFaction[]} factions
 * @param {RulingFaction | null} governing
 * @param {boolean} [incumbentSurvives] when the defeated house will stay on the roster
 *   under its own name, that name is TAKEN like any other faction's
 * @returns {string}
 */
function resolveGovernmentLabel(archetype, tier, factions, governing, incumbentSurvives = false) {
  const preferred = governmentLabelFor(archetype, tier);
  // A label is taken when another faction's name EQUALS it — or CONTAINS it: the
  // conquest occupier 'Ironhold occupation authority' contains the OCCUPATION label
  // 'Occupation Authority', and an exact-match check would relabel the seat into a
  // read-alike of the power behind it (two factions both reading "occupation
  // authority" — the round-3 warDeployment collision).
  // ⚠ THE INCUMBENT IS EXCLUDED ONLY WHEN IT IS ABOUT TO STOP EXISTING. Under a
  // demotion the old house stays on the roster under its own name, so excluding it
  // would let a CIVIC winner over a 'Town Council' seat produce two rows both called
  // 'Town Council' — one polity, two identical names, and nothing would have thrown.
  const names = factions.filter(f => f !== governing || incumbentSurvives)
    .map(f => nameOf(f).toLowerCase()).filter(Boolean);
  const takenBy = (/** @type {string} */ label) => names.some(n => n === label.toLowerCase() || n.includes(label.toLowerCase()));
  if (!takenBy(preferred)) return preferred;
  const alt = ALT_GOVERNMENT_LABELS[archetype];
  if (alt && !takenBy(alt)) return alt;
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
 * @param {RulingPowerSettlement} settlement
 * @param {string} newPowerName    faction name (powerStructure.factions entry)
 * ⭐⭐ §865 / §810.8 R23 — THE DEMOTION. Under a LAWFUL passage on a world born under
 * Register VII, the defeated house does not leave: the governing ROW is still reshaped
 * into the winner's government form (the body persists, keeping its roster position and
 * any authored `id`), and the old house is appended as its own non-governing row
 * carrying `fell_from_power`. Before this repair both causes produced byte-identical
 * rosters apart from one modifier word, so R23's central distinction — whether the old
 * house lives — was unreachable in the tree.
 *
 * @param {Object} [opts]
 * @param {'coup'|'election'|'succession'|'conquest'|'appointment'} [opts.cause]
 * @param {number|null} [opts.tick]
 * @param {string[]} [opts.losers]  losing contender names (coup verdicts) — get grudge edges
 * @param {boolean} [opts.demoteIncumbent] force the defeated house to survive (true) or
 *   to be overwritten (false). ABSENT ⇒ derived: lawful cause AND a Register VII world.
 * @returns {{ settlement: Object, transfer: Object|null, error: string|null }}
 */
export function transferRulingPower(settlement, newPowerName, opts = {}) {
  const cause = /** @type {keyof typeof LEGITIMACY_SEEDS} */ (RULING_POWER_CAUSES.includes(/** @type {string} */ (opts.cause)) ? opts.cause : 'coup');
  const tick = /** @type {number | null} */ (Number.isFinite(opts.tick) ? opts.tick : null);
  const losers = Array.isArray(opts.losers) ? opts.losers : [];

  // Non-null by construction: when powerStructure is missing, governingFactionOf
  // returns null and we bail on the next check before ever reading `ps`.
  const ps = /** @type {PowerStructure} */ (settlement?.powerStructure);
  const factions = Array.isArray(ps?.factions) ? ps.factions : [];
  const governing = governingFactionOf(settlement);
  if (!governing) return { settlement, transfer: null, error: 'no_governing_faction' };

  const target = String(newPowerName || '').trim().toLowerCase();
  const winner = factions.find(f => f !== governing && nameOf(f).toLowerCase() === target);
  if (!winner) {
    return {
      settlement, transfer: null,
      error: nameOf(governing).toLowerCase() === target ? 'already_governing' : 'faction_not_found',
    };
  }

  const archetype = factionArchetype(winner);
  const fromGovernment = nameOf(governing);
  const demoted = demotesIncumbent(settlement, cause, opts.demoteIncumbent) && !!fromGovernment;
  const toGovernment = resolveGovernmentLabel(archetype, settlement.tier, factions, governing, demoted);
  // A1.12 PART 2 — THE SEAT IS RETYPED, NOT MERELY RENAMED. A DECLARED FUTURE-TICK
  // SHIFT (owner-visible, vetoable), and it is a REPAIR of a reshape that was already
  // three-quarters done: the two lines below already stamp the winner's archetype onto
  // the seat as its LABEL (`faction: toGovernment`, derived from `archetype`) and as its
  // DESCRIPTION (`desc: GOVERNMENT_DESCS[archetype]`). Only `category` lagged — and
  // `category` is the one field a MACHINE reads: factionArchetype() takes it first
  // ("Category (if recognized) wins"). So before this line a merchant house could seize
  // a council's seat, be renamed and re-described as a merchant power, and stay typed
  // `government` forever to every archetype consumer in the estate. That silent
  // category-forever behaviour is the SUPERSEDED ALTERNATIVE, recorded here rather than
  // deleted, and W-COIN is what made it matter: taxation is typed on the governing
  // archetype, so a coup that did not retype the seat would leave a merchant league
  // taxing like the council it overthrew, permanently.
  // `other` carries no information to stamp (it is not a recognised category key), so
  // that one archetype leaves the seat's category untouched and name inference keeps
  // deciding, exactly as it does today — a stamp that says nothing is not written.
  const seatCategory = archetype === A.OTHER ? null : archetype;

  const nextFactions = factions.map(f => {
    if (f === governing) {
      return {
        ...f,
        faction: toGovernment,
        ...(f.name != null ? { name: toGovernment } : {}),
        ...(seatCategory ? { category: seatCategory } : {}),
        desc: GOVERNMENT_DESCS[archetype] || GOVERNMENT_DESCS[A.OTHER],
        isGoverning: true,
        modifiers: [...(f.modifiers || []), cause === 'coup' ? 'seized_power' : cause],
        legitimacyCrisis: false,
        crisisNote: null,
      };
    }
    if (f === winner) {
      return {
        ...f,
        // Clamp to the 0-100 power domain (ported master fix): every downstream
        // computation assumes it; a 95-100 winner would otherwise land at 101-106.
        power: Math.max(0, Math.min(100, Math.round(num(f.power) + 6))),
        modifiers: [...(f.modifiers || []), 'ascendant'],
      };
    }
    return f;
  });

  // ⭐ THE DEPOSED HOUSE, STILL STANDING. A NEW row rather than a moved one: the
  // governing row is the persistent BODY and keeps its position and its authored `id`
  // (which addresses that slot, and which two rows may never share). The house's own
  // facts — name, category, description, standing — are copied verbatim, because a
  // house that merely lost the seat has not changed what it is. Its MODIFIERS are not
  // copied: that list is the SEAT's history (every past transfer appends its cause to
  // it), and handing it to the house would claim the house had done what the office
  // did. The one fact this row asserts is the one that is true.
  //
  // ⛔ NO INVENTED POWER DELTA. The house lost the seat, not its wealth or its people,
  // and how far a fall costs a house is a tuning judgment no lane may sign.
  const { id: _seatSlotId, ...houseFacts } = /** @type {RulingFaction & {id?: string}} */ (governing);
  const rosterFactions = demoted ? [...nextFactions, {
    ...houseFacts,
    faction: fromGovernment,
    ...(governing.name != null ? { name: fromGovernment } : {}),
    isGoverning: false,
    modifiers: [DEPOSED_MODIFIER],
  }] : nextFactions;

  const oldLegitimacy = ps.publicLegitimacy || null;
  const oldScore = num(oldLegitimacy?.score, 50);
  const seed = LEGITIMACY_SEEDS[cause];
  const newScore = Math.max(seed.min, Math.min(seed.max, seed.base + (50 - oldScore) * seed.oldPull));
  const publicLegitimacy = rebandLegitimacy(oldLegitimacy, newScore);

  // Re-key relationships that referenced the old government label. Any edge
  // that now connects the seat to its new power-behind CONVERTS to symbiotic
  // (whatever friction it carried died with the old order); the (coup) losers
  // get grudge edges.
  //
  // ⭐ UNDER A DEMOTION THE RE-KEY IS SKIPPED, AND THAT IS THE POINT. The rename exists
  // because the old label CEASED TO NAME ANYTHING; when the house lives, that label still
  // names it, and moving its edges onto the seat would hand the new government every
  // grudge and every alliance the fallen house spent generations earning. §810.8 asks the
  // defeated house to carry "grudges, and the possibility of revanche" — this is where
  // those live.
  const winnerName = nameOf(winner);
  const symbioticNarrative = `${winnerName} is the power behind the ${toGovernment.toLowerCase()}. The seat answers to them now.`;
  let pairedWithWinner = false;
  const renamedRelationships = (ps.factionRelationships || []).map(rel => {
    if (!Array.isArray(rel?.pair)) return rel;
    const pair = !demoted && rel.pair.includes(fromGovernment)
      ? rel.pair.map(n => (n === fromGovernment ? toGovernment : n))
      : rel.pair;
    const next = pair === rel.pair ? rel : { ...rel, pair };
    if (pair.includes(toGovernment) && pair.includes(winnerName)) {
      pairedWithWinner = true;
      return { ...next, type: 'symbiotic', direction: 'stable', narrative: symbioticNarrative };
    }
    return next;
  });
  /** @type {FactionRelationshipEdge[]} */
  const extraRelationships = [];
  /** @type {(a: string, b: string) => boolean} */
  const havePair = (a, b) => renamedRelationships.concat(extraRelationships)
    .some(rel => Array.isArray(rel?.pair) && rel.pair.includes(a) && rel.pair.includes(b));
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
    // ⭐ THE ADDRESS §810.8's DISTINCTION NEEDS. Every consumer that narrates a transfer
    // reads this descriptor, and until now none of them could say whether the house it
    // was writing about still existed. `demoted` is a fact this function can prove; the
    // grammar's third disposition (`scattered`, the roster re-affiliated onto the victor)
    // is NOT claimed here, because this primitive does not yet do it.
    incumbent: { name: fromGovernment, demoted },
    legitimacyBefore: { score: oldScore, label: oldLegitimacy?.label || null },
    legitimacyAfter: { score: publicLegitimacy.score, label: publicLegitimacy.label },
  };

  return {
    settlement: {
      ...settlement,
      powerStructure: {
        ...ps,
        factions: rosterFactions,
        governingName: toGovernment,
        government: toGovernment,
        previousGovernments,
        publicLegitimacy,
        factionRelationships: [...renamedRelationships, ...extraRelationships],
        stability: STABILITY_BY_CAUSE[cause],
        // ⭐ THE THIRD BRANCH IS §810.8's WHOLE POINT SAID IN PLAIN WORDS. This is not a
        // news beat; it is the prose the dossier, the summary tab, the power tab and the
        // PDF's power section all read, so it is where a reader of the world actually
        // meets the change. A coup and a lawful passage already read differently here;
        // what no branch could say before is that the losing house is still standing.
        // ⚠ SPELLED INLINE, NOT AS A HELPER. `transferRulingPower` is the EAGER entrance
        // and this module sits in the first-paint static closure — a named formatter plus
        // its argument object measured 100 bytes over the owner-ratified closure budget
        // on the real dist. The bytes are the constraint here, not the taste.
        recentConflict: cause === 'coup'
          ? `${nameOf(winner)} overthrew the ${fromGovernment.toLowerCase()} and reshaped the government as a ${toGovernment.toLowerCase()}.`
          : `Power passed to ${nameOf(winner)} by ${cause}; the government now sits as a ${toGovernment.toLowerCase()}${
            demoted ? `, and the ${fromGovernment.toLowerCase()} keep their place among the powers` : ''}.`,
      },
    },
    transfer,
    error: null,
  };
}
