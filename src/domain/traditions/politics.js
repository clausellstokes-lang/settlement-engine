/**
 * domain/traditions/politics.js — THE TRADITIONS wave (Engine Lift #4), slice T-3: POLITICS.
 *
 * A POWER owns each tradition, and ownership mutates with settlement state (owner spec
 * §0; DESIGN_TRADITIONS §6 OWNERSHIP + §7 MUTATION are this leaf's law). This pure leaf
 * holds the ownership machinery the T-2 mover calls once per lit tick:
 *   • ASSIGNMENT AT MINT (§6): each founding record is handed to a POWER by motif-fit —
 *     the founding core + civic feasts to the ruling SEAT (governingFactionOf); devotional
 *     motifs to a religious faction/institution; fair/market to merchant/craft; contests to
 *     the military. Seeded tie-breaks; a settlement with no matching power leaves the record
 *     on the seat, or unowned (the interim, full-weight routing) when there is no seat.
 *   • REASSIGNMENT CHECKPOINTS (§6, T3-b): a power transfer re-anchors seat-owned records to
 *     the new seat (and the ascendant regime may claim others); a vanished institution orphans
 *     its records; a new patron re-dedicates devotional ones; the urban-fabric leader turning
 *     re-anchors the district-bound ones.
 *   • MUTATION (§7, T3-b): tier crossings scale a record up; a generation reshapes its keeping
 *     (~30-year seeded drift). Core motif is IMMUTABLE forever; only the EXPRESSION, scale, and
 *     ownership move — every change appends a mutationLog {year, kind, cause} row (the tradition's
 *     own readable history, provenance-grade for the dossier register).
 *
 * KEY DISCIPLINE (§6/§17 recon hazard): the REAL powerStructure.factions[] carry the name in
 * `.faction` (NOT `.name`/`.id`); the ladder's own key fn would collapse them. The owner key is
 * therefore `fac.${slug(nameOf(f))}` — nameOf (rulingPower) prefers `.faction`, falling back to
 * `.name`, so it agrees with every real generated faction while never collapsing a `.name`-only
 * entry to `fac.unknown`. Institutions have no instance id, so they key by `inst.${slug(name)}`
 * and REASSIGN when the institution leaves the roster (the orphan check).
 *
 * PURITY: a true domain leaf — no store/React import, no Date/Math.random/localeCompare. All
 * entropy is a SEEDED PRNG (the settlement seed for tie-breaks; tick-invariant world-seed forks
 * for the claim roll), so the same campaign yields the same ownership history on any device. The
 * canonical faction helpers (governingFactionOf/nameOf/factionArchetype) are imported back from
 * the eager rulingPower layer — the blessed lazy → eager direction (rulingPower.js §extraction).
 */

import { createPRNG } from '../../kernel/prng.js';
import { slugify } from '../../kernel/slugify.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { popToTier, TIER_ORDER } from '../../data/constants.js';
import { TRADITION_TRAPPINGS, TRADITION_EPITHETS } from '../../data/traditionCorpus.js';

/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */
/** @typedef {Parameters<typeof nameOf>[0]} RulingFactionLike */

const A = FACTION_ARCHETYPES;

// ── §7 MUTATION dials (soak-certified; every entry vetoable) ────────────────────
const HYSTERESIS_YEARS = 8;   // the minimum gap between two SLOW mutations of one tradition
const DRIFT_PERIOD = 30;      // generational drift cadence (~once per 30 years)
const DRIFT_MIN_YEAR = 8;     // no drift before a tradition has had time to settle
const CLAIM_CHANCE = 0.35;    // an ascendant regime's chance to claim a faction/institution tradition

// ── narrowing helpers (self-contained; the kernel's asObject idiom, 0-hole) ──
/** @param {unknown} x @returns {Record<string, unknown>} */
function asObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x) ? /** @type {Record<string, unknown>} */ (x) : {};
}
/** @param {unknown} x @param {number} d @returns {number} */
function num(x, d) {
  const n = Number(x);
  return Number.isFinite(n) ? n : d;
}
/** Codepoint-stable compare (byte-stable ordering). @param {string} a @param {string} b @returns {number} */
function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
/** The owner-key token — slug of a name, byte-stable, never empty. @param {unknown} name @returns {string} */
function tokenOf(name) {
  return slugify(String(name ?? ''), { sep: '_', max: 80, fallback: 'unknown', empty: 'unknown' });
}

// ── OWNER KEYS (§6 — the REAL `.faction` shape via nameOf; institutions by name) ──
/** The stable owner key for a faction entry (`fac.<slug>`; nameOf prefers `.faction`).
 *  @param {unknown} faction @returns {string} */
export function factionOwnerKey(faction) {
  return `fac.${tokenOf(nameOf(/** @type {RulingFactionLike} */ (faction)))}`;
}
/** The stable owner key for an institution (`inst.<slug>`; institutions have no id).
 *  @param {unknown} name @returns {string} */
export function institutionOwnerKey(name) {
  return `inst.${tokenOf(name)}`;
}

// ── the settlement seed (the genesis idiom, so owner tie-breaks are device-stable) ──
/** @param {Record<string, unknown>} settlement @returns {string} */
function settlementSeedOf(settlement) {
  const identity = asObject(settlement.identity);
  return String(settlement._seed ?? settlement.id ?? identity.seed ?? 'tradition-seedless');
}

// ── TIER INDEX (mirrors genesis.resolveTierBand exactly, so the scale-crossing sensor never drifts) ──
/** @type {Readonly<Record<string, number>>} */
const TIER_INDEX = Object.freeze({ thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5, capital: 6 });
/** @param {Record<string, unknown>} settlement @returns {number} */
function tierIndexOf(settlement) {
  const raw = typeof settlement.tier === 'string' ? settlement.tier : '';
  if (raw && raw in TIER_INDEX) return TIER_INDEX[raw];
  const pop = typeof settlement.population === 'number' ? settlement.population : 0;
  const fb = TIER_ORDER.indexOf(popToTier(pop)) >= 0 ? popToTier(pop) : 'village';
  return TIER_INDEX[fb] ?? 2;
}

// ── MOTIF → desired owner archetype (§6 assignment table) ──────────────────────
// The origin + civic observances belong to the SEAT; devotional to the temple; the
// fair/market to commerce; the contest to the garrison. Founding elements are the
// singular origin and always seat-held (guarantees ≥1 seat record — the seat-change sensor).
const FOUNDING_ELEMENTS = new Set(['founding', 'first-landing', 'charter']);
const DEVOTIONAL_ACTS = new Set(['offering', 'vigil']);
const DEVOTIONAL_ELEMENTS = new Set(['the-dead', 'stars']);
const SEAT = 'seat';
const MERCHANTRY = 'merchantry';

/** @param {TraditionRec} rec @param {number} index @returns {string} a FACTION_ARCHETYPES value, SEAT, or MERCHANTRY */
function desiredArchetype(rec, index) {
  const motif = asObject(/** @type {Record<string, unknown>} */ (rec).coreMotif);
  const element = String(motif.element || '');
  const act = String(motif.act || '');
  if (index === 0 || FOUNDING_ELEMENTS.has(element)) return SEAT;
  const deityRef = /** @type {Record<string, unknown>} */ (rec).deityRef;
  if ((typeof deityRef === 'string' && deityRef) || DEVOTIONAL_ACTS.has(act) || DEVOTIONAL_ELEMENTS.has(element)) return A.RELIGIOUS;
  if (act === 'fair' || element === 'market') return MERCHANTRY;
  if (act === 'contest') return A.MILITARY;
  return SEAT;
}

/** Does a candidate archetype satisfy the desired archetype? @param {string} want @param {string} got @returns {boolean} */
function archetypeMatches(want, got) {
  if (want === MERCHANTRY) return got === A.MERCHANT || got === A.CRAFT;
  return got === want;
}

/**
 * @typedef {Object} OwnerCandidate
 * @property {string} key
 * @property {('faction'|'institution')} kind
 * @property {string} label
 */

/** The seat owner (governingFactionOf), or nulls when there is no ruling seat.
 *  @param {Record<string, unknown>} settlement
 *  @returns {{ key: string|null, label: string|null }} */
function seatOwnerOf(settlement) {
  const seat = governingFactionOf(/** @type {Parameters<typeof governingFactionOf>[0]} */ (settlement));
  if (!seat) return { key: null, label: null };
  return { key: factionOwnerKey(seat), label: nameOf(seat) || null };
}

/** All owner candidates (factions + institutions), each with its canonical archetype.
 *  @param {Record<string, unknown>} settlement
 *  @returns {Array<OwnerCandidate & { archetype: string }>} */
function ownerCandidatesOf(settlement) {
  /** @type {Array<OwnerCandidate & { archetype: string }>} */
  const out = [];
  const ps = asObject(settlement.powerStructure);
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  for (const f of factions) {
    const label = nameOf(/** @type {RulingFactionLike} */ (f));
    if (!label) continue;
    out.push({ key: factionOwnerKey(f), kind: 'faction', label, archetype: factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (f)) });
  }
  const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  for (const raw of institutions) {
    const inst = asObject(raw);
    const label = typeof inst.name === 'string' ? inst.name : '';
    if (!label) continue;
    out.push({ key: institutionOwnerKey(label), kind: 'institution', label, archetype: factionArchetype(/** @type {Parameters<typeof factionArchetype>[0]} */ (inst)) });
  }
  return out;
}

/** Pick the owner for a desired archetype among candidates — seeded tie-break, byte-stable
 *  ordering. Prefers a faction over an institution of equal fit (a named power carries a
 *  tradition better than a building). Returns null when nothing matches.
 *  @param {string} want @param {Array<OwnerCandidate & { archetype: string }>} candidates
 *  @param {ReturnType<typeof createPRNG>} rng @returns {OwnerCandidate|null} */
function pickOwner(want, candidates, rng) {
  const matches = candidates
    .filter((c) => archetypeMatches(want, c.archetype))
    .sort((x, y) => (x.kind === y.kind ? cmp(x.key, y.key) : x.kind === 'faction' ? -1 : 1));
  if (!matches.length) return null;
  // Keep only the preferred kind, then seeded-pick among the equals.
  const topKind = matches[0].kind;
  const pool = matches.filter((c) => c.kind === topKind);
  const chosen = pool[rng.randInt(0, pool.length - 1)];
  return { key: chosen.key, kind: chosen.kind, label: chosen.label };
}

/** Stamp an owner onto a record (a new object; never mutate the input).
 *  @param {TraditionRec} rec @param {string|null} key @param {('faction'|'institution'|'seat'|null)} kind @param {string|null} label @returns {TraditionRec} */
function withOwner(rec, key, kind, label) {
  return /** @type {TraditionRec} */ ({ ...rec, ownerKey: key, ownerKind: kind, ownerLabel: label });
}

/**
 * §6 ASSIGNMENT — hand each founding record to a POWER by motif-fit. Pure, seeded,
 * deterministic from the settlement seed alone (so two lit runs assign identically).
 * @param {TraditionRec[]} recs @param {Record<string, unknown>} settlement @returns {TraditionRec[]}
 */
export function assignOwnership(recs, settlement) {
  const seat = seatOwnerOf(settlement);
  const candidates = ownerCandidatesOf(settlement);
  const root = createPRNG(`${settlementSeedOf(settlement)}::tradition:owner`);
  return recs.map((rec, i) => {
    const want = desiredArchetype(rec, i);
    if (want === SEAT) return withOwner(rec, seat.key, seat.key ? 'seat' : null, seat.label);
    const chosen = pickOwner(want, candidates, root.fork(`pick:${/** @type {Record<string, unknown>} */ (rec).id}`));
    if (chosen) return withOwner(rec, chosen.key, chosen.kind, chosen.label);
    // no matching power ⇒ fall to the seat, else leave unowned (interim, full-weight routing).
    return withOwner(rec, seat.key, seat.key ? 'seat' : null, seat.label);
  });
}

// ── §7 checkpoint READERS (all pure; stateless comparisons against fresh state) ──
/** The settlement's current patron deity ref (config.primaryDeitySnapshot, the genesis
 *  source), or null. @param {Record<string, unknown>} settlement @returns {string|null} */
function currentPatronRef(settlement) {
  const snap = asObject(asObject(settlement.config).primaryDeitySnapshot);
  if (typeof snap._deityRef === 'string' && snap._deityRef) return snap._deityRef;
  const prim = asObject(settlement.primaryDeity);
  return typeof prim._deityRef === 'string' && prim._deityRef ? prim._deityRef : null;
}
/** The urban-fabric leading district class for a settlement (the authoritative ledger's
 *  `led`), or null when the fabric layer is dark/absent.
 *  @param {Record<string, unknown>} worldState @param {string} sid @returns {string|null} */
function fabricLeaderOf(worldState, sid) {
  const led = asObject(asObject(getSpatialLedger(worldState, 'urbanFabric'))[sid]).led;
  return typeof led === 'string' && led ? led : null;
}
/** The human phrase for the most recent power transfer's cause (previousGovernments), or null.
 *  @param {Record<string, unknown>} settlement @returns {string|null} */
function lastTransferCause(settlement) {
  const prev = asObject(settlement.powerStructure).previousGovernments;
  const list = Array.isArray(prev) ? prev : [];
  const last = list.length ? asObject(list[list.length - 1]) : null;
  const cause = last && typeof last.cause === 'string' ? last.cause : '';
  return cause ? `the seat changed hands by ${cause}` : null;
}
/** The latest year in a record's mutationLog (−Infinity when never mutated) — the hysteresis
 *  clock. @param {TraditionRec} rec @returns {number} */
function lastMutationYear(rec) {
  const log = Array.isArray(/** @type {Record<string, unknown>} */ (rec).mutationLog) ? /** @type {unknown[]} */ (/** @type {Record<string, unknown>} */ (rec).mutationLog) : [];
  let m = -Infinity;
  for (const e of log) { const y = num(asObject(e).year, -Infinity); if (y > m) m = y; }
  return m;
}
/** Is a record anchored to a city quarter (fair/market) — the class an urban-fabric turn
 *  re-anchors? @param {TraditionRec} rec @returns {boolean} */
function isDistrictAnchored(rec) {
  const motif = asObject(/** @type {Record<string, unknown>} */ (rec).coreMotif);
  return motif.act === 'fair' || motif.element === 'market';
}
/** Is generational drift DUE for a record this year (a seeded ~30-year phase per tradition)?
 *  @param {TraditionRec} rec @param {number} year @returns {boolean} */
function driftDue(rec, year) {
  if (year < DRIFT_MIN_YEAR) return false;
  const phase = createPRNG(`${String(asObject(rec).id)}::tradition:drift`).randInt(0, DRIFT_PERIOD - 1);
  return ((year - phase) % DRIFT_PERIOD) === 0;
}
/** The ascendant-regime claim roll for a faction/institution tradition on a seat change
 *  (tick-invariant world-seed fork). @param {string} rngSeed @param {TraditionRec} rec @param {number} year @returns {boolean} */
function claimRoll(rngSeed, rec, year) {
  return createPRNG(`${rngSeed}::tradition:claim:${String(asObject(rec).id)}:${year}`).chance(CLAIM_CHANCE);
}

/** Re-DRESS a record's expression (§7 — trappings + epithet re-picked from the corpus by act;
 *  the CORE MOTIF and the NAME stay immutable — grandeur rides scaleBand, not a rename). Seeded,
 *  deterministic. Exported so T-4 adoption can re-express an origin's carried rite in the
 *  destination's identity (§9). @param {TraditionRec} rec @param {string} seedKey @returns {TraditionRec} */
export function reexpressed(rec, seedKey) {
  const act = String(asObject(asObject(rec).coreMotif).act || 'feast');
  const pool = /** @type {Record<string, ReadonlyArray<string>>} */ (TRADITION_TRAPPINGS)[act] || TRADITION_TRAPPINGS.feast;
  const rng = createPRNG(seedKey);
  const order = rng.shuffle(pool.map((_, i) => i));
  /** @type {string[]} */
  const trappings = [];
  for (let i = 0; i < order.length && trappings.length < 2; i += 1) trappings.push(pool[order[i]]);
  const epithet = rng.fork('epithet').pick(/** @type {string[]} */ ([...TRADITION_EPITHETS])) || TRADITION_EPITHETS[0];
  const expr = asObject(/** @type {Record<string, unknown>} */ (rec).expression);
  return /** @type {TraditionRec} */ ({ ...rec, expression: { ...expr, trappings, epithet } });
}

/** Append a mutationLog {year, kind, cause} row (a new object; never mutate the input).
 *  @param {TraditionRec} rec @param {number} year @param {string} kind @param {string} cause @returns {TraditionRec} */
function logMutation(rec, year, kind, cause) {
  const raw = /** @type {Record<string, unknown>} */ (rec).mutationLog;
  const log = Array.isArray(raw) ? raw : [];
  return /** @type {TraditionRec} */ ({ ...rec, mutationLog: [...log, { year, kind, cause }] });
}

/**
 * Advance a settlement's ownership + expression one lit tick (§6 reassignment checkpoints +
 * §7 mutations). At the FIRST-LIT mint: assign ownership only (mutations begin the next tick,
 * so a freshly minted set never spuriously drifts). Otherwise run, per record, a single-slot
 * precedence of checkpoints (cap 1 mutation/record/tick):
 *   1. SEAT change — a seat-owned record follows the new seat (pointer always); a faction/
 *      institution record may be CLAIMED by the ascendant regime (seeded); a vanished
 *      institution ORPHANS to the seat.
 *   2. RE-DEDICATION — a devotional record follows a KNOWN new patron.
 *   3. SCALE-UP — a real tier crossing steps every record's scaleBand up one (the founding
 *      core is the crossing sensor: currentTier > its scaleBand).
 *   4. FABRIC turn — a district-anchored record re-anchors when the fabric leader turns
 *      (hysteresis-gated; the founding core carries the fabricLed sensor).
 *   5. DRIFT — a generation reshapes the keeping (~30-year seeded schedule; hysteresis-gated).
 * Structural pointer moves (owner/deity/scale) always track reality; the mutationLog row +
 * re-dress is what the cosmetic checkpoints (4,5) hysteresis-gate. Pure + deterministic.
 * @param {Object} a
 * @param {TraditionRec[]} a.recs
 * @param {Record<string, unknown>} a.settlement
 * @param {Record<string, unknown>} a.worldState
 * @param {string} a.sid
 * @param {number} a.year
 * @param {boolean} a.minted
 * @returns {{ recs: TraditionRec[], changed: boolean }}
 */
export function advancePolitics({ recs, settlement, worldState, sid, year, minted }) {
  if (minted) return { recs: assignOwnership(recs, settlement), changed: true };
  if (!recs.length) return { recs, changed: false };

  const seat = seatOwnerOf(settlement);
  const patronRef = currentPatronRef(settlement);
  const curTier = tierIndexOf(settlement);
  const rngSeed = String(worldState.rngSeed || '');

  const founding = asObject(recs[0]);
  const foundingScale = num(founding.scaleBand, curTier);
  const tierCrossed = foundingScale < curTier;         // the founding core is the crossing sensor
  const fabricLedNow = fabricLeaderOf(worldState, sid);
  const fabricLedPrev = typeof founding.fabricLed === 'string' ? founding.fabricLed : null;
  const fabricTurned = !!fabricLedNow && !!fabricLedPrev && fabricLedNow !== fabricLedPrev;
  // A seat change is visible in the seat-owned records still pointing at the OLD seat key.
  const seatChanged = seat.key != null && recs.some((r) => asObject(r).ownerKind === 'seat' && asObject(r).ownerKey !== seat.key);
  const transferCause = seatChanged ? lastTransferCause(settlement) : null;
  const instRoster = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  const instKeys = new Set(instRoster.map((raw) => institutionOwnerKey(asObject(raw).name)));

  let changed = false;
  const out = recs.map((raw, i) => {
    let rec = raw;
    const kind = asObject(rec).ownerKind;
    const ownerKey = asObject(rec).ownerKey;
    /** @type {{ kind: string, cause: string }|null} */
    let mutation = null;

    // 1. SEAT reassignment (structural; pointer always tracks reality).
    if (seat.key != null) {
      if (kind === 'seat' && ownerKey !== seat.key) {
        rec = /** @type {TraditionRec} */ ({ ...rec, ownerKey: seat.key, ownerLabel: seat.label });
        mutation = { kind: 'reassignment', cause: transferCause || 'the seat changed hands' };
      } else if ((kind === 'faction' || kind === 'institution') && seatChanged && claimRoll(rngSeed, rec, year)) {
        rec = /** @type {TraditionRec} */ ({ ...rec, ownerKey: seat.key, ownerKind: 'seat', ownerLabel: seat.label });
        mutation = { kind: 'reassignment', cause: `${transferCause || 'the seat changed hands'}; the new order took up the observance` };
      }
    }
    // 1b. institution ORPHAN — its keeper left the roster; the seat takes it up.
    if (!mutation && kind === 'institution' && !instKeys.has(String(ownerKey)) && seat.key != null) {
      rec = /** @type {TraditionRec} */ ({ ...rec, ownerKey: seat.key, ownerKind: 'seat', ownerLabel: seat.label });
      mutation = { kind: 'reassignment', cause: 'its keeper is gone; the seat took it up' };
    }
    // 2. RE-DEDICATION — a devotional record follows a KNOWN new patron (never re-dedicate to
    //    an absent patron; that would erase a valid dedication).
    if (!mutation && patronRef) {
      const deityRef = asObject(rec).deityRef;
      if (typeof deityRef === 'string' && deityRef && deityRef !== patronRef) {
        rec = /** @type {TraditionRec} */ ({ ...rec, deityRef: patronRef });
        mutation = { kind: 'rededication', cause: 'the town took a new patron' };
      }
    }
    // 3. SCALE-UP — a real tier crossing steps grandeur up one band (scaleBand tracks the tier).
    if (!mutation && tierCrossed) {
      const cur = num(asObject(rec).scaleBand, 0);
      const next = Math.min(curTier, cur + 1);
      if (next !== cur) {
        rec = /** @type {TraditionRec} */ ({ ...rec, scaleBand: next });
        mutation = { kind: 'scale-up', cause: 'the town outgrew the old scale' };
      }
    }
    // Hysteresis floor for the SLOW cosmetic checkpoints (4,5).
    const hysteresisOk = (year - lastMutationYear(rec)) >= HYSTERESIS_YEARS;
    // 4. FABRIC turn — a district-anchored record re-anchors when the quarter's leader turns.
    if (!mutation && fabricTurned && isDistrictAnchored(rec) && hysteresisOk) {
      mutation = { kind: 'reanchor', cause: 'the quarter that kept it changed hands' };
    }
    // 5. DRIFT — a generation reshapes the keeping.
    if (!mutation && driftDue(rec, year) && hysteresisOk) {
      mutation = { kind: 'drift', cause: 'a generation reshaped the keeping' };
    }

    if (mutation) {
      rec = reexpressed(rec, `${rngSeed}::tradition:reexpress:${String(asObject(rec).id)}:${year}:${mutation.kind}`);
      rec = logMutation(rec, year, mutation.kind, mutation.cause);
      changed = true;
    }
    // Keep the founding core's fabric sensor current (index 0 only; only when fabric is lit).
    if (i === 0 && fabricLedNow && asObject(rec).fabricLed !== fabricLedNow) {
      rec = /** @type {TraditionRec} */ ({ ...rec, fabricLed: fabricLedNow });
      changed = true;
    }
    return rec;
  });

  return { recs: changed ? out : recs, changed };
}

// ── EFFECT ROUTING (§6 stakes) ─────────────────────────────────────────────────
/** Half a legitimacy hit, rounded away from zero so a ±1 hit never vanishes (a
 *  faction/institution-owned festival reflects on the town at HALF weight until the
 *  faction.power write seam opens — §16). JUDGMENT — say "veto".
 *  @param {number} hit @returns {number} */
export function halfWeightHit(hit) {
  return Math.sign(hit) * Math.round(Math.abs(hit) / 2);
}

/** The legitimacy delta an outcome lands on the SETTLEMENT's publicLegitimacy, routed by
 *  owner (§6): the seat (or the interim unowned record) bears the full hit; a faction/
 *  institution owner bears half (display-side accountability — the news names them).
 *  @param {number} hit @param {unknown} ownerKind @returns {number} */
export function routedLegitimacyHit(hit, ownerKind) {
  if (ownerKind === 'faction' || ownerKind === 'institution') return halfWeightHit(hit);
  return hit;
}
