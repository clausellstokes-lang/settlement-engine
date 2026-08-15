/**
 * proposedSoakBands.js — R-15 THE TUNING-BAND MANIFEST (the proving bands, declared).
 *
 * WHAT THIS IS
 *   A machine-readable, committed declaration of the RATIFIED target-distribution
 *   BANDS for the pre-launch soak: for each governing coupling, the range an OBSERVED
 *   metric should land in for the world to read as "alive but not thrashing." The owner
 *   has signed these targets without changing their proposed values. The soak either
 *   confirms the dials land inside them or reveals a divergence (a Lane-B retune
 *   proposal for the owner).
 *
 * HOW IT RELATES TO THE TUNING LOOP (weeklyTuningJob.js)
 *   Each band projects to a §10 ENVELOPE ({ metric, min, max }) via toEnvelopes(). Feed
 *   those envelopes to runWeeklyTuningJob and the soak's observed distributions are
 *   diagnosed against them exactly as production rollups would be. But EVERY dial named
 *   here lives in the seeded generation/worldPulse pipeline, so every one is
 *   golden-shifting and therefore LANE-B FOREVER (autoTunableRegistry.js's denylist):
 *   the loop may PROPOSE a retune from a band divergence, it may NEVER auto-apply one.
 *   These bands describe what to WATCH FOR, not what to auto-tune.
 *
 * PROVENANCE (why these numbers)
 *   Each band is derived from two committed sources: the design intent recorded in the
 *   kernel's own tuning comment, and the current dial value. The `rationale` field
 *   quotes the intent so a reviewer can veto the band against the design, not against a
 *   guess. When a coupling has no single dial (population flight is emergent), the band
 *   names the nearest governing constants and the structural bound (a cap/floor).
 *
 * PURITY / BUDGET: pure data + pure validators, no transport, no eager importer (read
 *   only by scripts/check-tuning-bands.mjs + tests) — zero first-paint bytes, like
 *   autoTunableRegistry.js.
 */

/** Bump when the band ENTRY SHAPE or the validation rules change (vocabulary-pin idiom). */
export const SOAK_BAND_MANIFEST_VERSION = 2;

/** The coupling families the soak proves. A band must name one of these. */
export const SOAK_COUPLINGS = Object.freeze([
  'contest', 'bond', 'festival', 'gratitude', 'occupation_flight', 'coup_econ',
]);

/**
 * @typedef {{
 *   metric: string,           // stable observed-metric id (also the §10 envelope.metric)
 *   coupling: string,         // one of SOAK_COUPLINGS
 *   label: string,            // human, house-register label
 *   unit: string,             // what the min/max are measured in
 *   min: number,              // the RATIFIED band floor (envelope.min)
 *   max: number,              // the RATIFIED band ceiling (envelope.max)
 *   status: 'RATIFIED',       // owner-signed target; never auto-flips or auto-retunes
 *   constantIds: string[],    // the governing dial(s), or the nearest constants when emergent
 *   constantModule: string,   // where those dials live (repo-relative)
 *   currentValue: number|null,// the primary dial's current value (null when purely emergent)
 *   emergent?: boolean,       // true when there is no single dial (a bounded, assembled rate)
 *   rationale: string,        // derivation from the design intent (quote) + the bound
 * }} SoakBand
 */

/**
 * Validate one band against the manifest contract. Returns { ok, reasons }. A band is
 * valid only if it declares a known coupling, a finite [min, max] with min < max, a
 * non-empty governing-constant list, and status EXACTLY 'RATIFIED'.
 * @param {unknown} entry
 * @returns {{ ok: boolean, reasons: string[] }}
 */
export function validateSoakBand(entry) {
  const reasons = [];
  const e = /** @type {Partial<SoakBand>} */ (entry && typeof entry === 'object' ? entry : {});
  if (typeof e.metric !== 'string' || !e.metric) reasons.push('missing metric');
  if (typeof e.coupling !== 'string' || !SOAK_COUPLINGS.includes(e.coupling)) {
    reasons.push(`coupling must be one of ${SOAK_COUPLINGS.join('/')}`);
  }
  if (typeof e.label !== 'string' || !e.label) reasons.push('missing label');
  if (typeof e.unit !== 'string' || !e.unit) reasons.push('missing unit');
  const minNum = Number(e.min);
  const maxNum = Number(e.max);
  const minOk = Number.isFinite(minNum);
  const maxOk = Number.isFinite(maxNum);
  if (!minOk || !maxOk) reasons.push('min and max must both be finite numbers');
  else if (!(minNum < maxNum)) reasons.push(`min (${minNum}) must be < max (${maxNum})`);
  else if (minNum < 0) reasons.push('min must be >= 0 (a band is a non-negative observed range)');
  if (e.status !== 'RATIFIED') reasons.push("status must be exactly 'RATIFIED' (bands are owner-signed targets)");
  if (!Array.isArray(e.constantIds) || e.constantIds.length === 0) reasons.push('constantIds must be a non-empty list');
  else if (!e.constantIds.every((c) => typeof c === 'string' && c)) reasons.push('every constantId must be a non-empty string');
  if (typeof e.constantModule !== 'string' || !e.constantModule) reasons.push('missing constantModule');
  if (!(e.currentValue === null || Number.isFinite(e.currentValue))) reasons.push('currentValue must be a finite number or null (null only when emergent:true)');
  if (e.currentValue === null && e.emergent !== true) reasons.push('currentValue null requires emergent:true');
  if (typeof e.rationale !== 'string' || e.rationale.length < 20) reasons.push('rationale must explain the band (>= 20 chars)');
  return { ok: reasons.length === 0, reasons };
}

/**
 * Assert an entire manifest is valid + free of duplicate metrics. Throws on the FIRST
 * problem (used by the check script + the walker test so a malformed band can never
 * silently ship). @param {readonly unknown[]} bands
 */
export function assertValidSoakBands(bands) {
  if (!Array.isArray(bands)) throw new Error('soak-band manifest must be an array');
  const seen = new Set();
  bands.forEach((band, i) => {
    const { ok, reasons } = validateSoakBand(band);
    const metric = band && typeof band === 'object' && 'metric' in band ? String(/** @type {{metric?: unknown}} */ (band).metric) : '?';
    if (!ok) throw new Error(`soak band #${i} (${metric}) invalid: ${reasons.join('; ')}`);
    if (seen.has(metric)) throw new Error(`soak band #${i}: duplicate metric '${metric}'`);
    seen.add(metric);
  });
  return true;
}

/**
 * Project the manifest to §10 ENVELOPES for runWeeklyTuningJob. The soak diagnoses its
 * observed distributions against these exactly as production rollups are diagnosed.
 * `constantId` carries the primary dial (informational; these are Lane-B forever, so the
 * loop can only PROPOSE from a divergence). @param {readonly SoakBand[]} [bands]
 */
export function toEnvelopes(bands = RATIFIED_SOAK_BANDS) {
  return bands.map((b) => ({ metric: b.metric, min: b.min, max: b.max, constantId: b.constantIds[0] }));
}

/**
 * THE RATIFIED SOAK BANDS. Frozen. Every entry status:'RATIFIED'.
 * Derived from each coupling's committed tuning comment (quoted in `rationale`) + the
 * current dial value. Metrics are OBSERVED distributions (rates/shares/spans), NOT the
 * dial values themselves — the dial is what produces the metric; the band is where the
 * metric should land.
 * @type {ReadonlyArray<SoakBand>}
 */
export const RATIFIED_SOAK_BANDS = Object.freeze(/** @type {SoakBand[]} */ ([
  // ── 1. CONTEST / court succession cadence ─────────────────────────────────────
  {
    metric: 'contest.successions_per_faction_decade',
    coupling: 'contest',
    label: 'Court successions per faction, per sim-decade',
    unit: 'successions per faction per decade',
    min: 1.5, max: 4.0,
    status: 'RATIFIED',
    constantIds: ['CHALLENGE_RATE', 'COOLDOWN_WEEKS', 'REALM_SUCCESSION_CAP'],
    constantModule: 'src/domain/worldPulse/npcLadderChallenge.js',
    currentValue: 0.05,
    rationale: 'The cadence dial targets "a succession per faction every few sim-years, NEITHER stasis NOR churn." A few years is roughly one every 2.5 to 6.5 years, i.e. 1.5 to 4 per decade. The 104-week post-succession cooldown caps the ceiling; the anti-stasis floor keeps it above zero. Below the floor reads as a frozen court; above the ceiling reads as churn.',
  },
  {
    metric: 'contest.live_contested_goals_per_settlement',
    coupling: 'contest',
    label: 'Live contested goals per settlement',
    unit: 'live contests per settlement',
    min: 0.05, max: 1.2,
    status: 'RATIFIED',
    constantIds: ['CONTESTS_PER_SETTLEMENT_CAP', 'DISCOVER_BASE'],
    constantModule: 'src/domain/worldPulse/npcLadderContest.js',
    currentValue: 2,
    rationale: 'Contests are hard-capped at two live per settlement (CONTESTS_PER_SETTLEMENT_CAP), with a 0.04 per-advance discovery base. A healthy world has occasional live rivalries, not a permanent brawl in every town: mean well under the cap, but non-trivially above zero. The structural ceiling is 2; the ratified watch-band is 0.05 to 1.2.',
  },
  // ── 2. BOND saturation ────────────────────────────────────────────────────────
  {
    metric: 'bond.saturation_share',
    coupling: 'bond',
    label: 'Share of live positive bonds at or near the full-mark cap',
    unit: 'fraction of active bonds at >= 0.9 of the cap',
    min: 0.05, max: 0.40,
    status: 'RATIFIED',
    constantIds: ['BOND_MAX_SEV', 'BOND_MINT_SEV', 'BOND_HALF_LIFE_WEEKS'],
    constantModule: 'src/domain/worldPulse/npcLadderState.js',
    currentValue: 1.0,
    rationale: 'A bond mints half a mark (BOND_MINT_SEV 0.5), stacks additively, is clamped to a full mark (BOND_MAX_SEV 1.0), and fades on a ~3-year half-life (BOND_HALF_LIFE_WEEKS 156). If most live bonds sit maxed, the mint is too generous or decay too slow (everyone is everyone else best friend); if almost none approach the cap, bonds never deepen. The ratified watch-band is 5 to 40 percent of live bonds near the cap.',
  },
  // ── 3. FESTIVAL cadence + outcome ─────────────────────────────────────────────
  {
    metric: 'festival.observances_per_settlement_year',
    coupling: 'festival',
    label: 'Festivals actually observed per settlement, per year',
    unit: 'observances per settlement per year',
    min: 0.55, max: 0.98,
    status: 'RATIFIED',
    constantIds: ['SKIP_PROSPERITY_RANK_MAX'],
    constantModule: 'src/domain/worldPulse/traditionsKernel.js',
    currentValue: 0,
    rationale: 'A festival window opens once per year, but hard stressors (plague, famine, war, occupation) and a Subsistence economy (SKIP_PROSPERITY_RANK_MAX 0) cancel it. A healthy world celebrates most years with some cancellations, so the observed rate sits below the once-per-year ceiling of 1.0: a ratified 0.55 to 0.98. A rate near 1.0 means nothing is ever hard enough to cancel; a low rate means the world is in permanent crisis.',
  },
  {
    metric: 'festival.triumph_share',
    coupling: 'festival',
    label: 'Share of observed festivals that score a triumph',
    unit: 'fraction of observances scoring triumph',
    min: 0.15, max: 0.45,
    status: 'RATIFIED',
    constantIds: ['BASE', 'TRIUMPH_OFFSET'],
    constantModule: 'src/domain/worldPulse/traditionsKernel.js',
    currentValue: 0.55,
    rationale: 'The success model centres on BASE 0.55 with a triumph reached when the seed draw beats score+TRIUMPH_OFFSET (-0.25), i.e. roughly the lower ~30 percent of draws at a middling economy, shifted by prosperity and memory. Triumphs should be a real minority, not routine and not vanishing: a ratified 0.15 to 0.45.',
  },
  // ── 4. GRATITUDE mint ─────────────────────────────────────────────────────────
  {
    metric: 'gratitude.mint_rate_per_gift',
    coupling: 'gratitude',
    label: 'Share of qualifying gifts that deposit a lasting gratitude bond',
    unit: 'fraction of gifts that mint above the obligation floor',
    min: 0.40, max: 0.90,
    status: 'RATIFIED',
    constantIds: ['GRATITUDE_MITE', 'TIE_BIND'],
    constantModule: 'src/domain/spatial/generosityReactions.js',
    currentValue: 1.0,
    rationale: 'Gratitude scales with need relieved and the giver sacrifice (the widow-mite rule: GRATITUDE_MITE 1.0 lets a costly gift bind up to twice a costless one), with a small lift for gifts through a named tie (TIE_BIND 0.25), clamped to a full mark. Most meaningful gifts should leave a mark, but not every trivial transfer: a ratified 40 to 90 percent mint rate above the obligation floor.',
  },
  {
    metric: 'gratitude.mean_minted_severity',
    coupling: 'gratitude',
    label: 'Mean severity of a freshly minted gratitude bond',
    unit: 'bond severity in [0, 1]',
    min: 0.20, max: 0.70,
    status: 'RATIFIED',
    constantIds: ['GRATITUDE_MITE', 'TIE_BIND'],
    constantModule: 'src/domain/spatial/generosityReactions.js',
    currentValue: 1.0,
    rationale: 'Minted severity is clamped to [0, 1] and driven by need, sacrifice, and tie. A mean near 1.0 means every gift is a life-debt (the mint is too hot); a mean near 0 means gratitude never accumulates. The ratified watch-band is a mean of 0.20 to 0.70, leaving headroom for the exceptional widow-mite gift to stand out.',
  },
  // ── 5. OCCUPATION-FLIGHT ───────────────────────────────────────────────────────
  {
    metric: 'occupation.annual_flight_share',
    coupling: 'occupation_flight',
    label: 'Annual share of an occupied settlement population that flees',
    unit: 'fraction of population per year, occupied settlements',
    min: 0.02, max: 0.15,
    status: 'RATIFIED',
    constantIds: ['WAR_CRISIS_ARCHETYPES_RATE_PRESS', 'SEVERE_FLIGHT_CAP'],
    constantModule: 'src/domain/worldPulse/populationDynamics.js',
    currentValue: null,
    emergent: true,
    rationale: 'Flight is emergent: occupation presses the monthly population rate down by 0.016, and crisis-flight settlements are capped at 18 percent of population per interval (versus 5.5 percent normal). The design law is rescuable, not annihilated, so a bounded but visible bleed is right: a ratified 2 to 15 percent per year. The 18 percent per-interval severe cap is the hard structural ceiling this band sits under; below 2 percent, an occupied town does not visibly bleed at all.',
  },
  // ── 6. COUP-ECON swing ─────────────────────────────────────────────────────────
  {
    metric: 'coup_econ.success_rate_swing',
    coupling: 'coup_econ',
    label: 'Coup-success swing between a prosperous seat and a hollowed one',
    unit: 'delta in coup-success probability across the prosperity spectrum',
    min: 0.05, max: 0.25,
    status: 'RATIFIED',
    constantIds: ['economicAdj_divisor_400'],
    constantModule: 'src/domain/worldPulse/coup.js',
    currentValue: 0.125,
    rationale: 'The economic term shifts the incumbent hold-chance by (economic_capacity - 50) / 400, i.e. plus or minus 0.125 at the extremes. A prosperous seat holds; a hollowed treasury falls. The observed coup-success-rate difference between the richest and poorest seats should approach but not exceed twice that span (~0.25). A swing near 0 means prosperity does not matter; a ratified watch-band of 0.05 to 0.25 keeps the economy load-bearing without deciding every coup.',
  },
]));
