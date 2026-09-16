/**
 * war-convergence-collector.mjs — WR-9d's harness-side collector.
 *
 * WHAT THIS CLOSES. WR-9 built an endings classifier (warEndingClassifier.js), a
 * duration vocabulary and five graded envelopes (warConvergenceContract.js), and
 * six force cells (warConvergenceForces.js) — and every one of them read
 * `createEmptyWarConvergenceObservation()`, because nothing in the tree ever
 * counted a real war. `foldWarEndings` had NO production consumer at all (measured
 * at cb1ea74f: its only callers were its own test), and `UNCLASSIFIED_MAX_SHARE`
 * appeared EXACTLY ONCE in the whole repository — its own declaration. This module
 * is the thing that feeds them.
 *
 * WHERE IT LIVES AND WHY (J-WR9D-1, vetoable). It sits beside its siblings
 * `behavioral-observation.mjs` and `story-mix-divergence.mjs` rather than under
 * `src/domain/certification/`, because it reads RAW ENGINE SHAPES — outcome
 * records, the deployment ledger, the pulse record. A certification module that
 * imported worldPulse to do that would drag the war chain into the behavioral
 * oracle's bundle, which is how the dist chunk-cycle TDZ class starts (WR-9c's
 * J-WR9C-1). The graders stay pure; the collector does the dirty reading.
 *
 * ⚠️⚠️ THE CENSUS IS OUTCOME-DERIVED, NOT LEDGER-DERIVED, AND THAT IS THE WHOLE
 * DESIGN (J-WR9D-2, vetoable). The obvious collector walks `worldState.deployments`
 * at each year boundary and calls a war closed when its key disappears. That was
 * built first and MEASURED WRONG: on the soak's own fixture at HEAD, the year-end
 * ledger is empty in every one of ten years while the run selects fifteen
 * `strategy_deploy` outcomes, because these wars open and close INSIDE one year
 * (observed opens/closes at ticks 7→9, 10→13, 21→24). A year-boundary census
 * reports an empty world where fifteen armies marched, and it is blind precisely to
 * SHORT wars — the population the "most wars short" envelope is entirely about.
 * So the census reads the OUTCOME STREAM, which `advanceInterval` accumulates
 * across every interior tick and returns on the composed year result. Durations are
 * tick-exact, not year-rounded.
 *
 * ⚠️⚠️ PAIRS ARE RECOVERED BY RECONSTRUCTION, NEVER BY SPLITTING AN ID. The war
 * outcome ids are minted as `world_outcome.<family>.${stablePart(a)}.${stablePart(b)}.${tick}`
 * and settlement ids may contain dots, so splitting on `.` would mis-attribute a
 * war exactly as it would mis-attribute an atrocity (warEndingClassifier's own
 * header, and the WR-8 razing law). This module re-mints the PREFIX for each known
 * ordered pair and compares, taking the tick only from what remains after a prefix
 * that already matched. `stablePart` is lossy, so a realm whose settlements collapse
 * onto the same stable part is reported as an AMBIGUOUS pairing and its wars are
 * counted with an unmeasured duration rather than attributed to a guess.
 *
 * NO ENGINE SURFACE CHANGE, NO PERSISTED STATE. It reads what
 * `simulateCampaignWorldInterval` already returns. WR-9's lifecycle clause forbids
 * new persisted world state and this module adds none.
 *
 * ⚠️ THE DECLARED LIMITATIONS, CARRIED IN THE RECEIPT (`WAR_CONVERGENCE_SAMPLING`).
 *   1. DECIDING TERMS ARE A 1-IN-52 SAMPLE. `warTerminationReads` ride the pulse
 *      RECORD, and `collapseIntervalHistory` keeps only the final tick's record, so
 *      exactly one tick per year survives to be read.
 *   2. TWO WAR ROADS ARE OBSERVED, and a war that ended by any other road is counted
 *      with an UNMEASURED duration rather than dropped or guessed at.
 *   3. FOUR CLASSIFIER CHANNELS ARE UNFILLED at this flag state, each with a named
 *      reason (`CHANNEL_COVERAGE`), because five of the eight ending keys are
 *      reachable only through them and zeroes that were never measurable must not
 *      read as measurements.
 *
 * IT NEVER DROPS A WAR (ruling N3). Every counted war lands in EXACTLY ONE duration
 * cell and every closed war in exactly one ending cell or one unclassified reason.
 * Both identities are published as booleans the soak asserts.
 */

import {
  WAR_DURATION_BANDS,
  WAR_TERMINATION_DECIDING_TERM_KEYS,
  createEmptyWarConvergenceObservation,
  warDurationBandFor,
} from '../../src/domain/certification/warConvergenceContract.js';
import {
  WAR_ENDING_UNCLASSIFIED_REASONS,
  foldWarEndings,
} from '../../src/domain/certification/warEndingClassifier.js';
import { treatyPairKey } from '../../src/domain/worldPulse/peaceTermsPrimitives.js';
import { stablePart } from '../../src/domain/worldPulse/stablePart.js';

/** Ticks in one 52-week year (WR-0c item 4: the current calendar, never the legacy twelve). */
export const TICKS_PER_YEAR = 52;

/**
 * The two war-lifecycle outcome families this collector reads, spelled as the
 * engine's own `ruleId` plus the id family its minter uses. A CLOSED set rather
 * than a substring test: `war_exhaustion` also carries "nurses its war wounds",
 * which is a cost beat and not the end of a war, and counting it would invent
 * closes that never happened.
 */
export const WAR_LIFECYCLE_FAMILIES = Object.freeze({
  open: Object.freeze({ ruleId: 'war_layer_strategy_deploy', idFamily: 'strategy_deploy' }),
  close: Object.freeze({ ruleId: 'war_layer_war_exhaustion', idFamily: 'siege_abandoned' }),
});

/** The instrument's own resolution, published in the receipt. */
export const WAR_CONVERGENCE_SAMPLING = Object.freeze({
  censusSource: 'outcome stream (every interior tick), not the year-boundary deployment ledger',
  closeTickResolution: 'tick',
  observedOpenRoads: ['war_layer_strategy_deploy'],
  observedCloseRoads: ['war_layer_war_exhaustion/siege_abandoned'],
  unobservedRoadDurationsAre: 'unmeasured',
  decidingTermSample: '1-in-52',
  decidingTermSampleReason:
    'warTerminationReads ride the pulse record and collapseIntervalHistory keeps only the year-final tick',
});

/**
 * Why each unfilled `ClosedWarFact` channel is unfilled. A closed vocabulary of
 * REASONS, not a shrug: "the flag is off" and "the harness has no read for it" call
 * for different repairs and must never share a bucket.
 */
export const CHANNEL_COVERAGE = Object.freeze({
  closed: 'filled — a reconstructed siege-abandoned outcome, or an open whose army is gone',
  attackerId: 'filled — reconstructed from the outcome id prefix',
  defenderId: 'filled — reconstructed from the outcome id prefix',
  terminalOutcomes: 'filled — conquest and razing outcomes accumulated across every interior tick',
  loserDied: 'filled — the defender save died flag',
  treatyWritten: 'filled — the treaty ledger, keyed by the real treatyPairKey minter',
  peaceReason:
    'unfilled — no peace reason reaches the composed year result; warTermination publishes bands and a deciding term, not the reason token classifyWarEnding reads',
  coalitionFragmented:
    'unfilled — coalition fracture facts need coalitionLedgerEnabled, which no shipped preset lights',
  seatTransitionFamily:
    'unfilled — the WR-5 governed families need lineageClaimEnabled, which no shipped preset lights',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/** @param {unknown} value @returns {string} */
const asText = (value) => (typeof value === 'string' ? value : '');

/** @param {unknown} value @returns {number|null} */
const asTick = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : null;
};

/** The war identity. One besieger holds at most one army, so the pair is the war. */
const pairKeyOf = (attackerId, defenderId) => `${attackerId} -> ${defenderId}`;

/**
 * The terminal outcome families the endings classifier can read. Closed on purpose
 * — see WAR_LIFECYCLE_FAMILIES for why a substring test would be wrong here too.
 * @type {ReadonlyArray<string>}
 */
export const TERMINAL_OUTCOME_CANDIDATE_TYPES = Object.freeze(['conquest', 'razing']);

/**
 * Build the ordered-pair prefix table for one realm: every (attacker, defender)
 * pair, mapped to the exact id prefix its outcomes would be minted with.
 *
 * AMBIGUITY IS DETECTED, NOT RESOLVED. `stablePart` lowercases and collapses
 * punctuation, so `Vale-Keep` and `vale_keep` mint the same prefix. When two
 * distinct pairs collide the prefix is marked ambiguous and every war recovered
 * through it is counted with an unmeasured duration — a lost reading, which the
 * histogram has a cell for, rather than a war attributed to the wrong belligerent.
 *
 * @param {string[]} settlementIds
 * @param {string} idFamily
 */
function pairPrefixTable(settlementIds, idFamily) {
  /** @type {Map<string, { attackerId: string, defenderId: string, ambiguous: boolean }>} */
  const byPrefix = new Map();
  for (const attackerId of settlementIds) {
    for (const defenderId of settlementIds) {
      if (attackerId === defenderId) continue;
      const prefix = `world_outcome.${idFamily}.${stablePart(attackerId)}.${stablePart(defenderId)}.`;
      const existing = byPrefix.get(prefix);
      if (existing) {
        existing.ambiguous = true;
        continue;
      }
      byPrefix.set(prefix, { attackerId, defenderId, ambiguous: false });
    }
  }
  return byPrefix;
}

/**
 * Recover (attacker, defender, tick) from one war-lifecycle outcome id WITHOUT
 * splitting it. Returns null when no known pair reconstructs — which is a finding
 * the caller records, never a default.
 *
 * @param {string} id
 * @param {Map<string, { attackerId: string, defenderId: string, ambiguous: boolean }>} table
 */
function reconstructWarEvent(id, table) {
  for (const [prefix, pair] of table) {
    if (!id.startsWith(prefix)) continue;
    // Only the tail AFTER a prefix that already matched is read, and it must be a
    // bare integer — anything else means this is not the id we think it is.
    const tail = id.slice(prefix.length);
    if (!/^\d+$/.test(tail)) continue;
    return { attackerId: pair.attackerId, defenderId: pair.defenderId, tick: Number(tail), ambiguous: pair.ambiguous };
  }
  return null;
}

/**
 * Observe ONE composed year result. Pure: reads, never mutates, never advances
 * anything. The soak calls this once per year and hands the list to the builder.
 *
 * @param {{ year: number, tick: unknown, result: unknown, saves?: unknown }} input
 */
export function observeWarConvergenceYear({ year, tick, result, saves }) {
  const composed = asRecord(result);
  const worldState = asRecord(composed.worldState);
  const yearTick = asTick(tick) ?? asTick(worldState.tick) ?? 0;
  const settlementIds = (Array.isArray(saves) ? saves : [])
    .map((raw) => String(asRecord(raw).id ?? ''))
    .filter((id) => id !== '');
  const openTable = pairPrefixTable(settlementIds, WAR_LIFECYCLE_FAMILIES.open.idFamily);
  const closeTable = pairPrefixTable(settlementIds, WAR_LIFECYCLE_FAMILIES.close.idFamily);

  /** @type {Map<string, Record<string, unknown>>} */
  const seen = new Map();
  const warOpens = [];
  const warCloses = [];
  /** @type {Map<string, Record<string, unknown>>} */
  const terminalById = new Map();
  for (const bucket of ['selected', 'autoApplied', 'majors']) {
    for (const raw of Array.isArray(composed[bucket]) ? composed[bucket] : []) {
      const outcome = asRecord(raw);
      const id = asText(outcome.id);
      if (!id || seen.has(id)) continue;
      seen.set(id, outcome);
      const ruleId = asText(outcome.ruleId);
      if (ruleId === WAR_LIFECYCLE_FAMILIES.open.ruleId) {
        const event = reconstructWarEvent(id, openTable);
        if (event) warOpens.push(event);
      } else if (ruleId === WAR_LIFECYCLE_FAMILIES.close.ruleId) {
        const event = reconstructWarEvent(id, closeTable);
        if (event) warCloses.push(event);
      }
      if (!TERMINAL_OUTCOME_CANDIDATE_TYPES.includes(asText(outcome.candidateType))) continue;
      // The classifier re-mints a razing id from (road, razer, victim, TICK), so the
      // tick must be the one the engine minted with. Outcomes publish it as
      // `generatedAtTick`; `tick` is accepted too so a hand-built fixture reads the
      // same way as a real outcome.
      terminalById.set(id, {
        id,
        candidateType: asText(outcome.candidateType),
        targetSaveId: asText(outcome.targetSaveId) || String(outcome.targetSaveId ?? ''),
        tick: asTick(outcome.generatedAtTick) ?? asTick(outcome.tick) ?? yearTick,
      });
    }
  }

  // The deployment ledger is still read, but ONLY as the alive-at-horizon witness:
  // a war standing in the final year's ledger outlived this case's clock.
  const openLedgerWars = Object.entries(asRecord(worldState.deployments))
    .map(([attackerId, raw]) => {
      const record = asRecord(raw);
      return {
        attackerId: String(attackerId),
        defenderId: asText(record.targetId) || String(record.targetId ?? ''),
        sinceTick: asTick(record.sinceTick) ?? 0,
      };
    })
    .filter((war) => war.defenderId !== '')
    .sort((a, b) => (a.attackerId < b.attackerId ? -1 : a.attackerId > b.attackerId ? 1 : 0));

  // The 1-in-52 sample: only the year-final tick's pulse record survives the collapse.
  const decidingTerms = (Array.isArray(asRecord(composed.pulseRecord).warTerminationReads)
    ? /** @type {unknown[]} */ (asRecord(composed.pulseRecord).warTerminationReads)
    : []
  )
    .map((raw) => asText(asRecord(raw).decidingTerm))
    .filter((term) => WAR_TERMINATION_DECIDING_TERM_KEYS.includes(term));

  const diedIds = (Array.isArray(saves) ? saves : [])
    .map((raw) => asRecord(raw))
    .filter((save) => asRecord(save.settlement).died === true)
    .map((save) => String(save.id ?? ''))
    .filter((id) => id !== '');

  return {
    year: Number(year) || 0,
    tick: yearTick,
    warOpens: warOpens.sort((a, b) => a.tick - b.tick),
    warCloses: warCloses.sort((a, b) => a.tick - b.tick),
    openLedgerWars,
    terminalOutcomes: [...terminalById.values()],
    decidingTerms,
    diedIds,
    treatyPairKeys: Object.keys(asRecord(worldState.treatyLedger)),
  };
}

/**
 * Match the observed opens and closes into war lives.
 *
 * ⚠️ A war still open in the LAST observed year is ALIVE AT THE HORIZON, and this is
 * where CR-WR9-C's per-case horizon wall is actually discharged: the horizon is
 * whatever this case ran to, so the same code answers correctly for a 100-year
 * release case and a 300-year research case with no horizon constant anywhere. Such
 * a war is handed `Infinity`, which `warDurationBandFor` routes to `unresolved` —
 * the contract's own instruction for a census that knows a war outlived its clock.
 *
 * FOUR OUTCOMES, ALL COUNTED, NONE DROPPED:
 *   - matched open→close: a measured span, banded on its real tick length;
 *   - a close with no observed open: counted, duration UNMEASURED (its start was
 *     never seen — that is a lost reading, not a short war);
 *   - an open with no close and no army left at the horizon: the war ended by a road
 *     this collector does not observe. Counted, duration UNMEASURED;
 *   - an open still standing in the horizon ledger: alive, duration `unresolved`.
 *
 * @param {ReturnType<typeof observeWarConvergenceYear>[]} yearly
 */
function reconstructWarLives(yearly) {
  const years = (Array.isArray(yearly) ? yearly : [])
    .map((raw) => asRecord(raw))
    .sort((a, b) => Number(a.year) - Number(b.year));

  /** @type {Array<{ attackerId: string, defenderId: string, tick: number, ambiguous: boolean }>} */
  const opens = [];
  /** @type {Array<{ attackerId: string, defenderId: string, tick: number, ambiguous: boolean }>} */
  const closes = [];
  /** @type {Map<string, Record<string, unknown>[]>} */
  const terminalsByDefender = new Map();
  const diedEver = new Set();
  /** @type {Set<string>} */
  const treatyPairs = new Set();

  for (const observation of years) {
    for (const raw of Array.isArray(observation.warOpens) ? observation.warOpens : []) {
      const event = asRecord(raw);
      opens.push({
        attackerId: String(event.attackerId), defenderId: String(event.defenderId),
        tick: asTick(event.tick) ?? 0, ambiguous: event.ambiguous === true,
      });
    }
    for (const raw of Array.isArray(observation.warCloses) ? observation.warCloses : []) {
      const event = asRecord(raw);
      closes.push({
        attackerId: String(event.attackerId), defenderId: String(event.defenderId),
        tick: asTick(event.tick) ?? 0, ambiguous: event.ambiguous === true,
      });
    }
    for (const raw of Array.isArray(observation.terminalOutcomes) ? observation.terminalOutcomes : []) {
      const outcome = asRecord(raw);
      const defender = String(outcome.targetSaveId ?? '');
      if (!terminalsByDefender.has(defender)) terminalsByDefender.set(defender, []);
      /** @type {Record<string, unknown>[]} */ (terminalsByDefender.get(defender)).push(outcome);
    }
    for (const id of Array.isArray(observation.diedIds) ? observation.diedIds : []) diedEver.add(String(id));
    for (const key of Array.isArray(observation.treatyPairKeys) ? observation.treatyPairKeys : []) {
      treatyPairs.add(String(key));
    }
  }
  opens.sort((a, b) => a.tick - b.tick);
  closes.sort((a, b) => a.tick - b.tick);

  const horizonTick = years.length ? (asTick(years[years.length - 1].tick) ?? 0) : 0;
  const ledgerAtHorizon = new Map(
    (Array.isArray(years[years.length - 1]?.openLedgerWars)
      ? /** @type {unknown[]} */ (years[years.length - 1].openLedgerWars) : [])
      .map((raw) => {
        const war = asRecord(raw);
        return [pairKeyOf(String(war.attackerId), String(war.defenderId)), asTick(war.sinceTick) ?? 0];
      }),
  );

  /** @type {Array<{ attackerId: string, defenderId: string, sinceTick: number|null, closeTick: number|null, alive: boolean, ambiguous: boolean }>} */
  const wars = [];
  const usedOpens = new Set();
  for (const close of closes) {
    // The LATEST unmatched open for this pair at or before the close: a pair can
    // fight, stop, and fight again inside one year, and pairing a close with the
    // first-ever open would silently fuse two wars into one long one.
    let bestIndex = -1;
    for (let index = 0; index < opens.length; index += 1) {
      if (usedOpens.has(index)) continue;
      const open = opens[index];
      if (open.attackerId !== close.attackerId || open.defenderId !== close.defenderId) continue;
      if (open.tick > close.tick) continue;
      if (bestIndex === -1 || opens[bestIndex].tick < open.tick) bestIndex = index;
    }
    if (bestIndex === -1) {
      wars.push({
        attackerId: close.attackerId, defenderId: close.defenderId,
        sinceTick: null, closeTick: close.tick, alive: false, ambiguous: close.ambiguous,
      });
      continue;
    }
    usedOpens.add(bestIndex);
    wars.push({
      attackerId: close.attackerId, defenderId: close.defenderId,
      sinceTick: opens[bestIndex].tick, closeTick: close.tick, alive: false,
      ambiguous: close.ambiguous || opens[bestIndex].ambiguous,
    });
  }

  const claimedAlive = new Set();
  for (let index = 0; index < opens.length; index += 1) {
    if (usedOpens.has(index)) continue;
    const open = opens[index];
    const key = pairKeyOf(open.attackerId, open.defenderId);
    if (ledgerAtHorizon.has(key) && !claimedAlive.has(key)) {
      claimedAlive.add(key);
      wars.push({
        attackerId: open.attackerId, defenderId: open.defenderId,
        sinceTick: ledgerAtHorizon.get(key) ?? open.tick, closeTick: null, alive: true,
        ambiguous: open.ambiguous,
      });
      continue;
    }
    // Opened, and no army stands at the horizon: it ended by a road this collector
    // does not observe. A counted war with a duration nobody could read.
    wars.push({
      attackerId: open.attackerId, defenderId: open.defenderId,
      sinceTick: open.tick, closeTick: null, alive: false, ambiguous: open.ambiguous,
    });
  }
  // A war standing in the horizon ledger that no observed open accounts for is still
  // a war, and it is still alive.
  for (const [key, sinceTick] of ledgerAtHorizon) {
    if (claimedAlive.has(key)) continue;
    const [attackerId, defenderId] = key.split(' -> ');
    wars.push({ attackerId, defenderId, sinceTick, closeTick: null, alive: true, ambiguous: false });
  }

  return { wars, terminalsByDefender, diedEver, treatyPairs, horizonTick };
}

/**
 * Build the finished WR-9 observation plus the census that proves it accounted for
 * every war it saw.
 *
 * @param {{ yearly: ReturnType<typeof observeWarConvergenceYear>[] }} input
 */
export function buildWarConvergenceObservation({ yearly }) {
  const { wars, terminalsByDefender, diedEver, treatyPairs, horizonTick } = reconstructWarLives(yearly);
  const closedWars = wars.filter((war) => !war.alive);
  const aliveWars = wars.filter((war) => war.alive);

  // Every closed war becomes a finished ClosedWarFact. The channels this harness
  // cannot fill are left ABSENT rather than guessed — `classifyWarEnding` is total
  // over a fact with missing channels and answers `no_terminal_evidence`, which is
  // the honest reading and is exactly what CHANNEL_COVERAGE explains.
  const facts = closedWars.map((war) => ({
    attackerId: war.attackerId,
    defenderId: war.defenderId,
    closed: true,
    terminalOutcomes: (terminalsByDefender.get(war.defenderId) || []).filter((outcome) => {
      const tick = Number(outcome.tick);
      if (!Number.isFinite(tick)) return false;
      if (war.sinceTick != null && tick < war.sinceTick) return false;
      return war.closeTick == null || tick <= war.closeTick;
    }),
    loserDied: diedEver.has(war.defenderId),
    treatyWritten: treatyPairs.has(treatyPairKey(war.attackerId, war.defenderId))
      || treatyPairs.has(treatyPairKey(war.defenderId, war.attackerId)),
  }));
  const endings = foldWarEndings(facts);

  // THE DURATION HISTOGRAM. One loop, no `continue`, no filter: every war in the
  // census is banded, so the five cells cannot help but sum to the population.
  const warDurationHistogram = Object.fromEntries(WAR_DURATION_BANDS.map((band) => [band, 0]));
  let unmeasuredFromUnobservedRoad = 0;
  let unmeasuredFromAmbiguousPair = 0;
  for (const war of wars) {
    if (war.alive) {
      warDurationHistogram[warDurationBandFor(Number.POSITIVE_INFINITY)] += 1;
      continue;
    }
    if (war.ambiguous) unmeasuredFromAmbiguousPair += 1;
    const measurable = war.sinceTick != null && war.closeTick != null && !war.ambiguous;
    if (!measurable && !war.ambiguous) unmeasuredFromUnobservedRoad += 1;
    // `undefined` is the bander's own spelling for a duration nobody could read; it
    // routes to `unmeasured`, which `war_convergence.duration_measured` refuses.
    const years = measurable
      ? (Number(war.closeTick) - Number(war.sinceTick)) / TICKS_PER_YEAR
      : undefined;
    warDurationHistogram[warDurationBandFor(years)] += 1;
  }

  const terminationDecidingTermHistogram = Object.fromEntries(
    WAR_TERMINATION_DECIDING_TERM_KEYS.map((key) => [key, 0]),
  );
  let decidingTermSamples = 0;
  for (const raw of Array.isArray(yearly) ? yearly : []) {
    for (const term of Array.isArray(asRecord(raw).decidingTerms) ? asRecord(raw).decidingTerms : []) {
      if (!Object.prototype.hasOwnProperty.call(terminationDecidingTermHistogram, term)) continue;
      terminationDecidingTermHistogram[String(term)] += 1;
      decidingTermSamples += 1;
    }
  }

  const countedWars = wars.length;
  const histogramSum = Object.values(warDurationHistogram).reduce((total, count) => total + count, 0);
  const endingsSum = endings.classifiedTotal + endings.unclassifiedTotal;

  const observation = {
    ...createEmptyWarConvergenceObservation(),
    endingsMix: endings.endingsMix,
    // WR-9d's new address. Without it the endings envelope cannot tell "no war
    // closed" from "every close was unreadable" — the WR-9r blindness one dimension
    // over — and UNCLASSIFIED_MAX_SHARE stays the dead constant it was.
    endingsUnclassified: endings.unclassified,
    warDurationHistogram,
    terminationDecidingTermHistogram,
    decidingTermSampling: {
      ...WAR_CONVERGENCE_SAMPLING,
      samples: decidingTermSamples,
      horizonTick,
    },
  };

  return {
    observation,
    census: {
      countedWars,
      closedWars: closedWars.length,
      aliveAtHorizonWars: aliveWars.length,
      histogramSum,
      endingsSum,
      // The two totality identities, published as booleans so the soak can assert
      // them and a reader never has to re-add the histogram to trust it.
      durationTotalityHolds: histogramSum === countedWars,
      endingsTotalityHolds: endingsSum === closedWars.length,
      classifiedEndings: endings.classifiedTotal,
      unclassifiedEndings: endings.unclassifiedTotal,
      unclassifiedReasons: endings.unclassified,
      unmeasuredFromUnobservedRoad,
      unmeasuredFromAmbiguousPair,
      decidingTermSamples,
      horizonTick,
      channelCoverage: CHANNEL_COVERAGE,
      sampling: WAR_CONVERGENCE_SAMPLING,
    },
  };
}

/** Re-exported so a consumer never has to spell the reason vocabulary itself. */
export { WAR_ENDING_UNCLASSIFIED_REASONS };
