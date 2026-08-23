/**
 * domain/highWater.js — THE HIGH-WATER EVIDENCE READ, app-side.
 *
 * ⭐⭐ THE HIGH-WATER LAW: BUILT EXTENT derives from the HISTORICAL MAXIMUM population;
 * OCCUPANCY derives from the CURRENT one. A city that peaked at 20,000 and holds 10,000
 * today has the STREETS of 20,000 and the LIFE of 10,000. A stable 10,000 city and a
 * shrunken 20,000-peak city carry the same souls and completely different biographies,
 * and anything that speaks about a settlement has to tell them apart.
 *
 * RE-EXPRESSED, NOT COPIED, from the sealed sandbox tip: the port source is
 * `src/domain/townMap/fabric/tierGrammar.js` at `refs/preserve/map-sandbox-w3f-sealed`
 * (`ee0db96d`), SHA-256
 * `f152d700ea93c0610529c0875ddb3e456b87e9f407bcad854157657f163f9ac6`, re-hashed at this
 * base before porting. The sandbox kept a LOCAL tier table so a render-time fabric chunk
 * would not import a generation-side module; a domain-root leaf has no such constraint,
 * and a second tier table would be a second truth. This leaf therefore reads the LANDED
 * `popToTier` / `POPULATION_RANGES` / `TIER_ORDER`.
 *
 * ⚠ THAT RE-EXPRESSION IS A DECLARED SEMANTIC, NOT A SILENT ONE. The landed bands and the
 * sealed fabric bands DISAGREE above village — town 901-5000 vs 901-8000, city 5001-25000
 * vs 8001-40000, metropolis 25001-100000 vs 40001-200000 — so a tier floor read here is
 * the LANDED floor. The app-side answer is the one the rest of the app already believes.
 *
 * ⛔⛔ THE §434 GAP, DOCUMENTED AND NOT CURED. Channel 1 was designed against a stored
 * `tier` that outlives the population that earned it. At this base THREE pulse paths
 * LOWER a stored tier — `worldPulse/calamityKernel.js` (`popToTier(afterDeaths - exodus)`,
 * written only when strictly lower), `worldPulse/tierOutcomeApply.js` on its demotion
 * branch, and `worldPulse/settlementLifecycleFirstClass.js`'s resettle path (forced to
 * `thorp`). Where one of those fired and no `peakTier` stamp was written, the evidence of
 * the decline was erased BY THE ACT THAT CAUSED IT, and this reader is SILENT about it.
 * That is a known, typed shortfall: the result carries `NO_PEAK_TIER_STAMP` in `gaps` and
 * `understated: true`, and the peak it reports is a floor, never a guess. ⛔ THE READER
 * MUST NEVER INFER A PEAK FROM A DEMOTED STATE. Curing the engine (stamping `peakTier` on
 * the demoting paths) is OWNER-DOCKETED — it moves same-seed pulse output — and is
 * deliberately not done here (ODQ §434; charter §5.3).
 *
 * ⚠ The result UNDERSTATES rather than invents. Where the window cannot reach the true
 * peak, the deficit is smaller than the truth — never a peak asserted from nothing.
 *
 * FROZEN v1. The derivation rides IN the record as `derivation: 'HIGH_WATER_V1'`; changing
 * any rule below is a declared shift by construction, not a tweak.
 *
 * PURITY: pure reads and arithmetic. No `Date`, no `Math.random`, no `Intl`, no I/O.
 *
 * ⚠ DISPLAY-LAZY BY INHERITANCE (ODQ §443). Channel 3 is read through the existing dossier
 * projection `display/calamityLedger.js` (`buildCalamityLedger`) rather than through a second
 * read of the persisted strike record — ONE app-side reader of that channel (the
 * `townMap/changeView.js` precedent), and the observed-shape reader walker holds the ceiling it
 * already holds. That leaf is DISPLAY-LAZY ("imported ONLY from lazy display/dossier surfaces,
 * never from the first-paint entry closure"), and the law TRANSFERS to this file: first-paint
 * consumers of `deriveHighWater` are refused by the vendorPdfLazy byte budget
 * (@enforced-by tests/build/vendorPdfLazy.test.js). Its consumers are dormant derivers and lazy
 * surfaces — the CT-4 prose and the D5 fabric (the undercity UC-1/UC-4 readers), all lazy.
 */

import { POPULATION_RANGES, TIER_ORDER, popToTier } from '../data/constants.js';
import { clamp } from '../kernel/math.js';
import { buildCalamityLedger } from './display/calamityLedger.js';

/**
 * THE CHANNELS, in the order they are TRUSTED. `channels` on the result lists exactly the
 * ones that actually contributed evidence, in this order — so a consumer can see which
 * reading it is standing on rather than inferring it from prose.
 *
 *  1. `PEAK_TIER_STAMP`     — `config.peakTier`, the monotone write-once-upward stamp
 *                             (`worldPulse/settlementLifecycleKernel.js`, PHASE A). The
 *                             STRONGEST evidence: it survives lifecycle-layer decline.
 *  2. `TIER_DISAGREEMENT`   — the RESIDUAL arm: a stored `tier` standing above
 *                             `popToTier(population)`. Needs no history at all, and still
 *                             fires on saves, imports and every path that never demotes.
 *  3. `POPULATION_RING`     — `populationHistory[].population`, a real maximum but only
 *                             across the retained window (see RING_WINDOW_ENTRIES).
 *  4. `DATED_LOSSES`        — the calamity ledger's exodus stamps (the persisted strike record,
 *                             projected by `display/calamityLedger.js`); each is population
 *                             that WAS here, so the pre-loss level is recoverable by addition.
 * @type {ReadonlyArray<string>}
 */
export const HIGH_WATER_CHANNELS = Object.freeze([
  'PEAK_TIER_STAMP', 'TIER_DISAGREEMENT', 'POPULATION_RING', 'DATED_LOSSES',
]);

/**
 * THE TYPED GAPS — the closed vocabulary of ways this reader KNOWS its view is short.
 * A gap is never a guess and never a number; it is the named reason the peak below is a
 * floor. `understated` is true iff `gaps` is non-empty.
 *
 *  • `NO_PEAK_TIER_STAMP`    — the strongest channel is unavailable, so a demotion that
 *                              overwrote its own evidence (§434) is indistinguishable
 *                              from a settlement that never declined.
 *  • `RING_WINDOW_SATURATED` — the ring is full, so a peak older than the window cannot
 *                              be seen from here.
 * @type {ReadonlyArray<string>}
 */
export const HIGH_WATER_GAPS = Object.freeze(['NO_PEAK_TIER_STAMP', 'RING_WINDOW_SATURATED']);

/**
 * THE RING, AS MEASURED AT THIS BASE — not as the sealed prose described it.
 *
 * Every append site spells `[...prev.slice(-11), entry]`, so ELEVEN are RETAINED and one
 * is appended: the ring settles at TWELVE, not eleven. (The sealed doc block said "the
 * ring caps at 11"; executed, the steady state is 12. `calamityKernel.js`'s extra outer
 * `.slice(-12)` is a no-op for exactly this reason.) The window prose below states TWELVE.
 * ⚠ `worldPulse/realmVerbExecution.js`'s append carries NO cap at all — a settlement that
 * founded steadings can hold a LONGER ring, which only ever helps this reader and is
 * recorded in the roster pin rather than assumed away.
 */
export const RING_RETAINED_PREFIX = 11;
/** The steady-state ring length: the retained prefix plus the appended entry. */
export const RING_WINDOW_ENTRIES = RING_RETAINED_PREFIX + 1;

/**
 * The deficit above which a settlement reads as DEMOTED — PORTED verbatim from the sealed
 * tip, where it is the ruin ring's visibility floor. ⛔ Not a dial this member introduces:
 * moving it is a declared shift against the sealed law, not a tuning pass.
 */
export const DEMOTION_THRESHOLD = 0.08;

/** A finite number, or the fallback. @param {unknown} v @param {number} fallback */
const num = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

/** Rank a tier in the LANDED order; -1 when unknown. @param {unknown} t @returns {number} */
const rankOf = (t) => (typeof t === 'string' ? TIER_ORDER.indexOf(t) : -1);

/**
 * Landed population floors, keyed by tier. Built by enumerating the landed table rather
 * than indexing it, so the lookup is typed end to end and needs no cast.
 * @type {ReadonlyMap<string, number>}
 */
const TIER_FLOOR = new Map(
  Object.entries(POPULATION_RANGES).map(([tier, range]) => [tier, num(range?.min, 0)]),
);

/** The landed population floor of a tier, or 0 when the tier is unknown.
 *  @param {string} tier @returns {number} */
const floorOf = (tier) => num(TIER_FLOOR.get(tier), 0);

/**
 * What this reader needs from a settlement. Everything is optional and `unknown` because
 * the deriver is TOTAL: it is handed live settlements, save round-trips, and fixtures, and
 * narrows every field in-body rather than trusting a shape.
 * @typedef {Object} HighWaterInput
 * @property {unknown} [population]
 * @property {unknown} [tier]
 * @property {unknown} [populationHistory]
 * @property {import('./display/calamityLedger.js').CalStampLike[]} [calamityHistory]
 * @property {{ peakTier?: unknown }} [config]
 * @property {{ peakTier?: unknown }} [_config]
 */

/** The monotone peak stamp, dual-written config + _config so it survives a regeneration.
 *  @param {HighWaterInput} s @returns {string|null} */
const peakTierStampOf = (s) => {
  const raw = s?.config?.peakTier ?? s?._config?.peakTier;
  return typeof raw === 'string' && rankOf(raw) >= 0 ? raw : null;
};

/**
 * @typedef {Object} HighWater
 * @property {number} population    the historical maximum this deriver can SEE — a FLOOR
 * @property {string} tier          the tier that population implies
 * @property {string} window        what the deriver could actually look at — DECLARED
 * @property {boolean} demoted      is the settlement below its own high water?
 * @property {number} deficit       0..1, how much of its extent is no longer occupied
 * @property {string[]} evidence    one line per contributing reading
 * @property {string[]} channels    which HIGH_WATER_CHANNELS fired, in trust order
 * @property {string[]} gaps        which HIGH_WATER_GAPS apply — the typed shortfall
 * @property {boolean} understated  true iff `gaps` is non-empty: the peak is a floor
 * @property {string} derivation    the frozen rule-set version
 */

/**
 * THE HIGH-WATER DERIVER — and its declared window.
 *
 * ⭐ EVERY CHANNEL IS READ, THEN THE READINGS ARE COMPARED. The peak is the highest
 * reading any channel can justify, and `channels`/`evidence` credit EVERY channel that
 * independently reaches that peak — not merely the one that happened to raise it first.
 * A result whose channel list depended on evaluation order would be reporting an
 * accident of this function's shape rather than the state of the evidence.
 *
 * Total: any input, including `null` and malformed shapes, yields a typed result.
 * @param {HighWaterInput|null|undefined} settlement @returns {HighWater}
 */
export function deriveHighWater(settlement) {
  const s = settlement || {};
  const current = Math.max(0, num(s.population, 0));
  const derivedTier = popToTier(current);
  /** @type {Array<{ channel: string, peak: number, line: string }>} */ const readings = [];
  /** @type {string[]} */ const gaps = [];
  /** @type {string[]} */ const windows = [];
  /** @type {string[]} */ const blind = [];

  // ── CHANNEL 1, IN TWO ARMS WITH DECLARED PRECEDENCE (§434) ────────────────────
  // The stamp LEADS and the disagreement is the RESIDUAL. Both are read; neither invents.
  const stamp = peakTierStampOf(s);
  if (stamp && rankOf(stamp) > rankOf(derivedTier)) {
    readings.push({
      channel: 'PEAK_TIER_STAMP',
      peak: floorOf(stamp),
      line: `peakTier stamp '${stamp}' over a ${derivedTier}-scale population — a recorded high water`,
    });
    windows.push('peakTier: the monotone stamp (no history needed)');
  }
  const storedTier = typeof s.tier === 'string' && rankOf(s.tier) >= 0 ? s.tier : null;
  if (storedTier && rankOf(storedTier) > rankOf(derivedTier)) {
    readings.push({
      channel: 'TIER_DISAGREEMENT',
      peak: floorOf(storedTier),
      line: `stored tier '${storedTier}' over a ${derivedTier}-scale population — a recorded demotion`,
    });
    windows.push('tier/population disagreement (no history needed)');
  }
  if (!stamp) {
    // ⛔ §434: without the stamp this reader cannot tell a settlement that never declined
    // from one whose decline overwrote its own tier. It says so rather than guessing.
    gaps.push('NO_PEAK_TIER_STAMP');
    blind.push('peakTier ABSENT — a demotion that overwrote its own stored tier cannot be seen from here (§434)');
  }

  // ── CHANNEL 2 — the population-history ring, whatever it can still see. ────────
  const history = Array.isArray(s.populationHistory) ? s.populationHistory : [];
  if (history.length) {
    let seen = 0;
    for (const h of history) {
      const p = num(h && h.population, Number.NaN);
      if (Number.isFinite(p) && p > seen) seen = p;
    }
    readings.push({ channel: 'POPULATION_RING', peak: seen, line: `populationHistory maximum ${seen}` });
    windows.push(`populationHistory: the last ${history.length} recorded changes ONLY`
      + ` (the ring settles at ${RING_WINDOW_ENTRIES} — ${RING_RETAINED_PREFIX} retained plus one appended)`);
    if (history.length >= RING_WINDOW_ENTRIES) {
      gaps.push('RING_WINDOW_SATURATED');
      blind.push(`the ring is FULL at ${RING_WINDOW_ENTRIES} entries, so a peak older than it is invisible`);
    }
  } else {
    windows.push('populationHistory: absent');
  }

  // ── CHANNEL 3 — dated losses. Each exodus is population that used to be present. ──
  // Read through the ONE app-side projection of the strike record (§443): the ledger's rows
  // carry a non-negative integer `exodus` per dated stamp, and `totalExodus` is their sum.
  const ledger = buildCalamityLedger(s);
  if (ledger.count) {
    const lost = ledger.totalExodus;
    if (lost > 0) {
      readings.push({
        channel: 'DATED_LOSSES',
        peak: current + lost,
        line: `${ledger.count} dated loss record(s) totalling ${lost} souls`,
      });
    }
    windows.push(`the calamity ledger: ${ledger.count} dated loss record(s)`);
  }

  // The peak is the highest justified reading; every channel that reaches it is credited,
  // in HIGH_WATER_CHANNELS trust order. Built by an explicit walk rather than
  // `.map(...).filter(Boolean)` so the credited entries stay TYPED all the way to the
  // result — a filtered array does not narrow, and the casts that would paper over that
  // are the second ledger this estate refuses.
  let peak = current;
  for (const r of readings) if (r.peak > peak) peak = r.peak;
  /** @type {string[]} */ const evidence = [];
  /** @type {string[]} */ const channels = [];
  for (const channel of HIGH_WATER_CHANNELS) {
    for (const r of readings) {
      if (r.channel !== channel || r.peak !== peak) continue;
      channels.push(r.channel);
      evidence.push(r.line);
    }
  }

  const deficit = peak > 0 ? clamp(1 - current / peak, 0, 1) : 0;
  return {
    population: peak,
    tier: popToTier(peak),
    window: [...windows, ...blind.map((b) => `BLIND: ${b}`)].join('; '),
    demoted: deficit > DEMOTION_THRESHOLD,
    deficit,
    evidence,
    channels,
    gaps,
    understated: gaps.length > 0,
    derivation: 'HIGH_WATER_V1',
  };
}
