/**
 * envoyPulse.js — WR-7a's late pulse composition, WR-7b's collision sequence.
 *
 * The errand writer advances after rumors and beliefs, then an exact home
 * delivery re-enters the ordinary outcome applicator. This keeps the peace
 * engine's one mutation path while making the message physically travel.
 *
 * WR-7b inserts three stages AHEAD of that advance, all of them read from the
 * SAME pre-mutation cut of the world (`envoyInterceptionStage.js` owns their
 * bodies): the paid plant targeting, the shared-cut encounter census, and the
 * resolution of rows that entered this tick already intercepted or already
 * parlaying. Every stage moves a row at most one transition, so a row that
 * changed here is never advanced again by `advanceEnvoyErrands` on the same
 * pulse and the army column is neither reordered nor advanced twice.
 */

import { appendWizardNewsEntries } from '../region/index.js';
import {
  applyEnvoySilenceInference,
  canApplyEnvoySilenceInference,
  clearEnvoySilenceInference,
} from './beliefMap.js';
import { applyWorldPulseOutcomes } from './applyWorldPulse.js';
import {
  envoyHomeOutcome,
  envoyReturnAlreadyApplied,
  envoyReturnVisibleAtHome,
  envoyRumorPatchFor,
  syncEnvoyNpcTransit,
} from './envoyDiplomacy.js';
import {
  advanceEnvoyErrands,
  envoyDiplomacyActive,
  envoyErrandsOf,
  markEnvoyHome,
} from './envoyErrand.js';
import {
  markSharedCutEncounters,
  prepareEnvoyPlantTargets,
  resolveMaturedParlays,
  resolveStartInterceptions,
} from './envoyInterceptionStage.js';
import { envoyNewsEntries } from './envoyNews.js';
import { rosterPersonById } from './envoyCasting.js';
import { makeCredibilityWeightFn } from './informationStatecraft.js';
import { advanceEspionageGauntlet } from './espionage/espionageGauntlet.js';
import { advanceEspionageProducts } from './espionage/espionageProductStage.js';
import { openRansomClaims } from './envoyRansomStage.js';
import { ratifyCarriedSheets } from './envoyRatificationStage.js';
import { npcLedgerOf } from './npcLedger.js';
import { appliedPlantEnvelopesAt } from './brokeragePlantHandoff.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** The exact post-sync H1 fact required before carried authority can land. */
function envoyIsPhysicallyHome(worldState, delivery) {
  const npcId = String(delivery?.npcId || '');
  const originId = String(delivery?.from || '');
  if (!npcId || !originId) return false;
  const ledger = npcLedgerOf(worldState);
  if (Object.prototype.hasOwnProperty.call(ledger.roamers, npcId)) return false;
  const record = asObject(ledger.placed[npcId]);
  return String(record.hostSettlementId || '') === originId
    && Object.keys(asObject(record.transit)).length === 0
    && Object.keys(asObject(record.residency)).length === 0
    && Object.keys(asObject(record.dmAssignment)).length === 0
    && record.whereaboutsUnknown !== true;
}

/** Build a current snapshot view without mutating the pulse's frozen input. */
function snapshotWithUpdates(snapshot, settlementUpdates, worldState, regionalGraph) {
  const updates = new Map((Array.isArray(settlementUpdates) ? settlementUpdates : [])
    .map((row) => [String(row?.saveId || row?.id || ''), row])
    .filter(([id]) => id));
  const priorRows = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  const priorById = new Map(priorRows.map((row) => [String(row?.id || ''), row]));
  const ids = [...new Set([...priorById.keys(), ...updates.keys()])].filter(Boolean).sort();
  const settlements = ids.map((id) => {
    const prior = asObject(priorById.get(id));
    const update = asObject(updates.get(id));
    const settlement = update.settlement || prior.settlement || asObject(prior.save).settlement;
    const save = Object.keys(asObject(update.save)).length
      ? update.save
      : Object.keys(asObject(prior.save)).length
        ? { ...asObject(prior.save), settlement }
        : undefined;
    return {
      ...prior,
      id,
      ...(save ? { save } : {}),
      settlement,
    };
  });
  return {
    ...snapshot,
    settlements,
    byId: new Map(settlements.map((row) => [String(row.id), row])),
    worldState,
    regionalGraph,
  };
}

/**
 * Advance all active envoys once and apply any exact home deliveries through
 * `applyWorldPulseOutcomes`. Dark/partial configurations return every input
 * reference unchanged.
 *
 * `commissionedPlants` are already-paid I4 envelopes from the pure brokerage
 * producer. They are handed back — targeted or untouched — for the information
 * writer to fold; this pulse never mints or charges one.
 * @param {{worldState?:unknown, snapshot?:unknown, regionalGraph?:any, wizardNews?:any,
 *   settlementUpdates?:Array<Record<string,unknown>>, tick?:number, now?:string,
 *   season?:string|null, simulationRules?:unknown,
 *   commissionedPlants?:Array<Record<string,unknown>>}} [args]
 */
export function advanceEnvoyDiplomacyPulse({
  worldState,
  snapshot,
  regionalGraph,
  wizardNews,
  settlementUpdates,
  tick,
  now,
  season = null,
  simulationRules = null,
  commissionedPlants = [],
} = {}) {
  if (!envoyDiplomacyActive(worldState)) {
    return {
      worldState,
      regionalGraph,
      wizardNews,
      settlementUpdates,
      evidence: [],
      autoApplied: [],
      newsEntries: [],
      ratifications: [],
      ransomClaims: [],
      ransomSkipped: [],
      espionageDetections: [],
      espionageSkipped: [],
      espionageGatherings: [],
      espionageLandings: [],
      espionageProductsSkipped: [],
      commissionedPlants,
    };
  }

  let state = worldState;
  const evidence = [];

  // WR-7b (1) — THE PAID PLANT'S TARGET. Attaching an exact envoy-picture target
  // to an already-purchased envelope before the census, so the census sees the
  // intent it will have to honour. Nothing is minted or charged here.
  //
  // IN-0a — THE CONSUME READ (the ONLY line this slice adds to this WAR-owned file, and a
  // pure read): an explicit hand-off from the caller wins; otherwise the prior pulse's
  // applied commissions are read off the pulse record. `appliedPlantEnvelopesAt` gates on
  // informationBrokeragesEnabled AND infoStatecraftEnabled, so with either dark it returns
  // [] and `prepareEnvoyPlantTargets` takes its existing empty-input early return —
  // byte-identical for every war golden. Until this line, the stage was fed by tests only.
  const carriedPlants = commissionedPlants.length
    ? commissionedPlants
    : appliedPlantEnvelopesAt(worldState, tick);
  const planted = prepareEnvoyPlantTargets({ worldState: state, tick, commissionedPlants: carriedPlants });
  state = planted.worldState;

  // WR-7b (2) — THE SHARED CUT. Both ledgers are projected from this one
  // pre-mutation world to the same tick boundary; only then may a collision
  // mark an errand.
  const cut = markSharedCutEncounters({ worldState: state, snapshot, regionalGraph, tick });
  state = cut.worldState;
  evidence.push(...cut.evidence);

  // WR-7b (3) — CUSTODY, CARRIAGE, AND CONTINUATION for rows that entered this
  // tick already intercepted. Rows marked in (2) carry this tick's clock and are
  // therefore not eligible until the next pulse.
  const interceptions = resolveStartInterceptions({
    worldState: state,
    startErrands: cut.startErrands,
    snapshot,
    tick,
    season,
  });
  state = interceptions.worldState;
  evidence.push(...interceptions.evidence);

  // WR-7b (4) — THE PARLAY. One draft under the two frozen pictures, then the
  // separately priced mandatory return on a later tick.
  const parlays = resolveMaturedParlays({ worldState: state, tick, season });
  state = parlays.worldState;
  evidence.push(...parlays.evidence);

  const beforeAdvance = state;
  const reservedSilenceTargets = new Set();
  const advanced = advanceEnvoyErrands({
    worldState: state,
    tick,
    rumorPatchFor: (errand, atTick) => envoyRumorPatchFor(beforeAdvance, errand, atTick),
    canInferSilenceFor: (errand) => {
      const observerId = String(errand.from || '');
      const subjectId = String(errand.to || '');
      const targetKey = `${observerId}\u0000${subjectId}`;
      if (reservedSilenceTargets.has(targetKey)) return false;
      const eligible = canApplyEnvoySilenceInference({
        worldState: beforeAdvance,
        observerId,
        subjectId,
        errandId: String(errand.id || ''),
      });
      if (eligible) reservedSilenceTargets.add(targetKey);
      return eligible;
    },
    isReturnVisibleFor: (errand, atTick) => (
      envoyReturnVisibleAtHome(beforeAdvance, errand, atTick)
    ),
  });
  state = advanced.worldState;
  let graph = regionalGraph;
  let feed = wizardNews;
  let updates = settlementUpdates;
  evidence.push(...advanced.transitionEvidence);
  const autoApplied = [];
  const newsEntries = [];

  // A silence receipt is earned only if the home court had a real prior belief
  // for the inference to amend. Missing belief remains silence, never a fabricated
  // map row or a public assertion that a belief write occurred.
  for (const row of advanced.silenceInferences) {
    const inferred = applyEnvoySilenceInference({
      worldState: /** @type {Record<string, unknown>} */ (state),
      observerId: String(row.settlementId || ''),
      subjectId: String(row.counterpartId || ''),
      errandId: String(row.errandId || ''),
      tick: Number(row.tick),
    });
    if (inferred.changed) {
      state = inferred.worldState;
      evidence.push(row);
    }
  }

  // The errand is authoritative; H1 is its conserved positional projection.
  // The synchronizer itself proves ownership before moving an active person, so
  // missing or conflicting H1 state cannot be repaired into transport authority.
  for (const errand of envoyErrandsOf(state)) {
    state = syncEnvoyNpcTransit(state, errand, tick);
  }

  let currentSnapshot = snapshotWithUpdates(snapshot, updates, state, graph);
  const transitionNews = envoyNewsEntries({ evidence, snapshot: currentSnapshot, now });
  if (transitionNews.length) {
    feed = appendWizardNewsEntries(feed, transitionNews, { now });
    newsEntries.push(...transitionNews);
  }

  // WR-7d — THE RANSOM STAGE, read from the post-custody world. It runs AFTER
  // the WR-7b stages because the hold this tick opened is a hold this tick can
  // price, and BEFORE the home mouth because a man in a cell is not coming
  // home. Nothing is persisted: a ransom claim is new persistent state and its
  // ledger shape is owner-gated, so the arc is computed and handed back.
  const ransom = openRansomClaims({ worldState: state, tick });

  // ES-2 — THE GAUNTLET, in the ransom stage's own slot and for the ransom stage's own
  // reason: a spy standing still in a hostile market this tick is a spy this tick can
  // price, and neither read belongs after the home mouth. It is gated by
  // `espionageActive` inside the stage, so a world without the flag walks nothing, and it
  // WRITES NOTHING — the capture it computes cannot open custody until the encounter shape
  // question is ruled (the stage header carries the measured refusal). Handed back exactly
  // as the ransom claims are.
  const gauntlet = advanceEspionageGauntlet({
    worldState: state, tick, snapshot, regionalGraph,
  });

  // WR-7c — THE RATIFICATION STAGE, decided BEFORE the mouth sees anything.
  // Every terms-bearing return in this pulse is voted on together, because two
  // envoys of one side home on the same tick are rival offers and a side that
  // cannot choose between them has chosen neither. Deciding per delivery inside
  // the loop below would let the first sheet through the mouth before its rival
  // was ever weighed. `envoyRatificationStage.js` owns the vote's body.
  const ratified = ratifyCarriedSheets({
    worldState: state,
    homeDeliveries: advanced.homeDeliveries,
  });

  for (const delivery of advanced.homeDeliveries) {
    const marked = markEnvoyHome({
      worldState: /** @type {Record<string, unknown>} */ (state),
      errandId: String(delivery.errandId || ''),
      tick,
    });
    if (!marked.changed || !marked.errand) continue;
    let tentativeState = /** @type {Record<string, unknown>} */ (marked.worldState);
    const answered = clearEnvoySilenceInference({
      worldState: tentativeState,
      observerId: String(delivery.from || ''),
      subjectId: String(delivery.to || ''),
      errandId: String(delivery.errandId || ''),
    });
    if (answered.changed) tentativeState = answered.worldState;
    tentativeState = /** @type {Record<string, unknown>} */ (
      syncEnvoyNpcTransit(tentativeState, marked.errand, tick)
    );
    if (!envoyIsPhysicallyHome(tentativeState, delivery)) continue;
    // WR-7c AT THE MOUTH (CR-WIRE-B): NOTHING BINDS UNRATIFIED. A sheet the
    // side did not choose is stripped from the delivery, so the man still comes
    // home and his return is still receipted — the errand closes, the silence
    // inference clears, H1 lands — but not one clause of what he agreed to
    // travels into `applyWorldPulseOutcomes`. The absence of a verdict is
    // treated exactly like a refusal, because a sheet nobody voted on is a
    // sheet nobody ratified. An envoy carrying no sheet is untouched here.
    const verdict = ratified.verdicts.get(String(delivery.errandId || '')) || null;
    const carriesSheet = !!asObject(delivery.termSheet).id;
    const bound = !carriesSheet || verdict?.bound === true;
    const outcome = envoyHomeOutcome(bound ? delivery : { ...delivery, termSheet: null });
    if (!outcome) continue;
    if (envoyReturnAlreadyApplied(tentativeState, outcome, graph)) {
      // The mechanical fact is already in the immutable relationship history.
      // Commit only this errand's exact home/H1/belief closure; replaying politics,
      // recalls, settlement effects, or its pulse receipt would duplicate history.
      state = tentativeState;
    } else {
      currentSnapshot = snapshotWithUpdates(snapshot, updates, tentativeState, graph);
      const settlementMap = new Map((Array.isArray(updates) ? updates : [])
        .map((row) => [String(row?.saveId || row?.id || ''), row])
        .filter(([id]) => id));
      const applied = applyWorldPulseOutcomes({
        snapshot: currentSnapshot,
        worldState: tentativeState,
        regionalGraph: graph,
        wizardNews: feed,
        settlementMap,
        outcomes: [outcome],
        tick,
        now,
        season,
        advanceNewsTick: false,
        advanceRegionalImpacts: false,
        simulationRules,
      });
      const landed = applied.autoApplied.some((row) => String(row?.id || '') === String(outcome.id))
        && !(applied.lapsedOutcomeIds || []).includes(String(outcome.id));
      if (!landed) {
        // THE ATOMIC-COMMIT LAW, AND THE ONE CASE IT WAS NEVER ABOUT.
        //
        // Ordinarily a home delivery whose outcome does not land commits
        // NOTHING. The envoy stands at his own gate — `returning`, `arrived`,
        // no receipt — and the next pulse tries the whole delivery again,
        // because a lapse there means the world moved under the offer (the front
        // changed, the label already turned) and the homecoming must land with
        // its politics or not at all. That law stands and is pinned in
        // `envoyDiplomacy.test.js`.
        //
        // A REFUSED SHEET IS NOT THAT CASE. Its outcome lapses because the gate
        // above stripped the only thing in it, and no repair can make the world
        // coherent again — the coalition will refuse the same sheet on every
        // tick that follows. Waiting for that repair left the man on the road
        // forever: the errand never closed, the silence inference never cleared,
        // H1 never landed, and the pulse re-ran the vote and re-published a
        // fresh refusal every tick, unboundedly. The sheet not binding is the
        // whole punishment; the errand still closes through its ordinary
        // homecoming.
        if (bound) continue;
        state = tentativeState;
      } else {
        state = applied.worldState;
        graph = applied.regionalGraph;
        feed = applied.wizardNews;
        updates = applied.settlementUpdates;
        autoApplied.push(...applied.autoApplied);
        newsEntries.push(...applied.newsEntries);
        if (Array.isArray(applied.envoyEvidence)) evidence.push(...applied.envoyEvidence);
      }
    }
    evidence.push(...marked.evidence);
    const homeNews = envoyNewsEntries({
      evidence: marked.evidence,
      snapshot: snapshotWithUpdates(snapshot, updates, state, graph),
      now,
    });
    if (homeNews.length) {
      feed = appendWizardNewsEntries(feed, homeNews, { now });
      newsEntries.push(...homeNews);
    }
  }

  // ES-3 — THE PRODUCTS, AFTER THE MOUTH AND FOR THE MOUTH'S OWN REASON. A mundane
  // mission's whole gradient folds at `markEnvoyHome`, so this stage must read a world in
  // which the loop above has already closed the rows that came home this tick; a magic
  // mission's reads stream at the stop and do not care where in the order they are taken.
  // It is gated by `espionageActive` inside the stage — a world without the flag walks
  // nothing — and unlike the gauntlet it DOES write: the gradient onto the errand row
  // through the errand family's own `writeErrands`, and the products into `beliefMaps`
  // through `reconcileBelief`. Both are existing shapes; neither is a new ledger.
  //
  // ⚠⚠ THE THREE WORLD READERS ARE INJECTED HERE, AND TWO OF THEM WERE MISSING FOR ONE
  // COMMIT. `advanceEspionageProducts` takes `npcFor`, `credibilityOf` and `insideAssetAt`
  // as arguments precisely so each can be mutated out — the ES-0 discipline — and a call
  // site that omits one does not degrade gracefully, it makes that term STRUCTURALLY DEAD
  // in the running world while every pure-leaf pin stays green. ES-3 shipped omitting all
  // three; MEASURED, `walk.npc` was null on every mission, so the standoff read the same
  // number for a coward and a hero (0.6906 for both, against 0.3719 timid and 0.9563 bold),
  // and a coupling row asserted a temperament read that never happened. Two are now wired
  // and the third is DECLARED DEAD in the stage header, because it has no producer.
  //
  // The roster index is built ONCE for the whole stage rather than per errand: the reader
  // below is called for every covert row and re-projecting the snapshot inside it would be
  // O(rows x settlements) for an answer that cannot change within one pulse.
  const productRosters = snapshotWithUpdates(snapshot, updates, state, graph);
  const products = advanceEspionageProducts({
    worldState: state,
    tick,
    snapshot,
    regionalGraph: graph,
    detections: gauntlet.detections,
    // THE MAN, found again in the roster that cast him, through the errand family's OWN
    // inverse of the id it wrote (`envoyCasting.rosterPersonById`) rather than a second
    // spelling of `durableId || rosterId` at this call site.
    npcFor: (errand) => {
      const homeId = String(asObject(errand).from || '');
      const item = asObject(productRosters.byId.get(homeId));
      const settlement = item.settlement || asObject(item.save).settlement || item;
      return rosterPersonById(state, homeId, settlement, String(asObject(errand).npcId || ''));
    },
    // W-DOCTRINE-2, and `buildProductReport`'s own header already promised it: a discredited
    // agent's word weighs less. The closure returns NULL when the info layer is dormant or no
    // credibility ledger has materialized, so a world without it is byte-identical — and the
    // product's `sourceId` is the composite `settlement#npc` shape D-2 was built for.
    credibilityOf: makeCredibilityWeightFn(state, tick),
    // ⛔ `insideAssetAt` IS NOT PASSED, AND THAT IS A DECLARATION RATHER THAN AN OMISSION:
    // this estate has no inside-asset ledger and no producer for that predicate anywhere
    // under src/. See the DEAD ARM block in espionageProductStage.js — the `delta` rung is
    // unreachable in a running world until the wave that mints one lands, and the census in
    // tests/domain/espionageProducts.test.js REDS the day a producer appears, so the
    // declaration cannot quietly outlive the fact.
  });
  state = products.worldState;

  return {
    worldState: state,
    regionalGraph: graph,
    wizardNews: feed,
    settlementUpdates: updates,
    evidence,
    autoApplied,
    newsEntries,
    // The vote's own record, handed back rather than folded into `evidence`:
    // ratification is not an errand transition, and the news/belief adapters
    // read `evidence` by a closed transition vocabulary they own.
    ratifications: ratified.ratifications,
    // WR-7d's priced claims and its receipted refusals, likewise handed back
    // rather than written: the dwell that has not matured is the ordinary case
    // and must not read as a failure.
    ransomClaims: ransom.claims,
    ransomSkipped: ransom.skipped,
    // ES-2's stay-detection readings and its receipted refusals, handed back on the same
    // terms and for the same owner-gated reason.
    espionageDetections: gauntlet.detections,
    espionageSkipped: gauntlet.skipped,
    // ES-3's gathered reads and landed products. Handed back as RECEIPTS — the writes
    // themselves already happened, on the errand row and in the belief maps, so these are
    // the record of what moved rather than a claim waiting to be applied.
    espionageGatherings: products.gatherings,
    espionageLandings: products.landings,
    espionageProductsSkipped: products.skipped,
    commissionedPlants: planted.commissionedPlants,
  };
}
