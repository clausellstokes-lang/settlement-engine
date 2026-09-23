/**
 * decreeTick.test.js — EM-E1 acceptance cases E1-1 to E1-8 (wave 3; ARCH §1 and §6,
 * design §2.5a, §2.6, §11, §12.1, §12.11 and §20.3).
 *
 * THE CLAIM. `applyDecreesAtTick` runs at the head of `simulateCampaignWorldPulse`: every
 * DUE pending entry becomes a CAUSE in the registry's own reading order and is marked
 * applied with the tick's own `tickRef`; an entry scheduled for a later tick is untouched;
 * the hook takes NO draw, so the tick's world is byte-identical with and without a
 * decree; a world holding no decree comes out of the kernel exactly as it went in, which
 * is what leaves the preset lighting witness unmoved (design §12.11); and the rewind
 * returns that tick's entries to the waiting sequence with everything staged afterwards
 * re-appended (design §12.1, through EM-C1's `revertTick`).
 *
 * ⛔ WHAT THIS SUITE DOES NOT CLAIM, STATED SO NOBODY READS IT AS COVERAGE. A cause at
 * this wave is a RECEIPT. The world effect of each op type is EM-E4 to EM-E7's, the
 * chronicle sentence is EM-E2's `decreeChronicleLine`, and the advance report is EM-E3's.
 * An op whose verb is not yet bound still lands as a cause rather than as nothing, and
 * nothing here asserts that a `set-field` moved a field.
 *
 * ⛔ THE UNDO PATH'S LIVE WIRING IS NOT IN THIS BUILD'S OWNERSHIP, AND CASE E1-4 SAYS SO
 * IN EXECUTABLE FORM RATHER THAN IN PROSE. The charter's Wave 3 row names
 * `campaignAdvanceSession.js` as "the undo path"; that file holds the advance, the resume
 * and the snapshot PUSH, and the restore chokepoint both undo verbs share is
 * `restorePulseSnapshotOnDraft` in `src/store/campaignWorldPulseDeferred.js` — the one
 * seam where the restored registry and the live pre-undo registry are both in hand. Case
 * E1-4 executes the merge that seam owes, over the real snapshot and registry shapes, so
 * the wiring lands against a proof that already exists.
 *
 * Proof shape copied from `tests/domain/decreeRegistry.test.js` (EM-C1): straight-line
 * literal `it`s under ONE literal `describe`, its own `vitest` import, and the leaf's own
 * source read for the structural fence.
 *
 * @enforced-by this test
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { revertTick } from '../../src/domain/edit/registry.js';
import {
  DECREE_CAUSE, applyDecreesAtTick, applyDecreesToSaves, retractDecreesOfTick,
} from '../../src/domain/worldPulse/decreeHook.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { ensureRegionalGraph, ensureWizardNewsFeed } from '../../src/domain/region/index.js';
import { createNewCampaignWorldState } from '../../src/domain/worldPulse/worldState.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_REL = 'src/domain/worldPulse/decreeHook.js';
const NOW = '2026-04-04T00:00:00.000Z';
const HOME = 'harrowfen';

const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * THE ZERO-DECREE PULSE RECORD'S KEY ROSTER, frozen as a literal. The preset lighting
 * witness hashes `JSON.stringify` of a simulated year, so a key minted — or merely
 * reordered — on a world with no decree moves a byte golden with no cause (design
 * §12.11). This roster is the cheap, exact statement of that; the witness suite itself is
 * the expensive one and both run.
 */
const BARE_RECORD_KEYS = Object.freeze([
  'id', 'tick', 'interval', 'committed', 'createdAt', 'calendar', 'candidateCount',
  'selectedCount', 'autoAppliedCount', 'proposalCount', 'selectedOutcomes', 'impactDigest',
  'resolvedStressors', 'graduatedStressors', 'rollExplanations', 'timeTicks',
  'corruptionEvents', 'factionCaptureEvents',
]);

/** One member of the realm. Plain data — no generator, no store, no clock in the path. */
function town(id, name, decrees) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: {
      name,
      tier: 'town',
      population: 1800,
      config: { tradeRouteAccess: 'road', terrainType: 'plains' },
      institutions: [{ name: 'Granary', status: 'active' }],
      economicState: {
        primaryExports: ['Grain'],
        primaryImports: ['Iron'],
        foodSecurity: {
          dailyNeed: 3600, dailyProduction: 3600, surplusPct: 6, deficitPct: 0,
          storageMonths: 1.4, importDependency: 0.12, resilienceScore: 55,
        },
      },
      powerStructure: { publicLegitimacy: { score: 54, label: 'Accepted' }, factions: [], conflicts: [] },
      npcs: [{ id: `${id}.n1`, name: 'Aldra', role: 'reeve', plotHooks: [] }],
      activeConditions: [],
      ...(decrees ? { decrees } : {}),
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

/** One registry entry in EM-C1's exact shape (`stage`'s output, by hand so the fixture is literal). */
const entry = (id, orderIndex, when) => ({
  id,
  op: { type: 'set-field', target: { kind: 'npc', id: `${HOME}.n1` }, payload: {} },
  status: 'pending',
  addedBy: 'dm',
  orderIndex,
  orderedAt: NOW,
  ...(when ? { when } : {}),
});

/** The realm, rebuilt per case so no case inherits another's registry. */
const realm = (decrees) => [town(HOME, 'Harrowfen', decrees)];

/** A campaign around one realm, with a seed the caller may perturb (the E1-3 plant). */
function campaignFor(saves, seedSuffix) {
  const worldState = createNewCampaignWorldState({ id: 'decree-tick', name: 'Decree Tick' });
  return {
    id: 'decree-tick',
    name: 'Decree Tick',
    settlementIds: saves.map((save) => save.id),
    worldState: seedSuffix ? { ...worldState, rngSeed: `${worldState.rngSeed}${seedSuffix}` } : worldState,
    regionalGraph: ensureRegionalGraph({ edges: [] }, { now: NOW }),
    wizardNews: ensureWizardNewsFeed(undefined, { now: NOW }),
  };
}

/** One committed one-week tick over a realm. */
function pulse(saves, seedSuffix) {
  return simulateCampaignWorldPulse({
    campaign: campaignFor(saves, seedSuffix), saves, interval: 'one_week', now: NOW,
  });
}

/** The registry this tick wrote back onto the home settlement. */
const registryOf = (result) => result.settlementUpdates
  .find((update) => String(update.saveId) === HOME).settlement.decrees;

/** The row shape every registry assertion below reads. */
const rowOf = (row) => [row.id, row.status, row.orderIndex, row.tickRef ?? null];

/**
 * THE SIMULATION'S OWN OUTPUT, with every decree-derived word removed. What is left is
 * exactly what a consumed draw would move, so comparing two of these IS the seed trace.
 */
function simulationDigest(result) {
  const history = (result.worldState.pulseHistory || []).map((record) => {
    const { decreeCauses: _causes, ...rest } = record;
    return rest;
  });
  const settlements = result.settlementUpdates.map((update) => {
    const { decrees: _decrees, ...rest } = update.settlement;
    return { saveId: update.saveId, settlement: rest };
  });
  return sha256({
    worldState: { ...result.worldState, pulseHistory: history },
    settlements,
    wizardNews: result.wizardNews,
    regionalGraph: result.regionalGraph,
  });
}

describe('EM-E1 — the tick hook', () => {
  it('E1-1 a due decree applies at the head of the pulse as a cause, in orderIndex order, and its entry is markApplied with this tick\'s tickRef', () => {
    // The registry is handed to the kernel with its rows in the WRONG array order, so a
    // hook that read the array rather than the field would surface them reversed. EM-C1's
    // `compareDecrees` is the reading, and it is imported rather than re-spelled.
    const saves = realm([entry('d2', 1), entry('d1', 0)]);
    const result = pulse(saves);
    const causes = result.pulseRecord.decreeCauses;
    expect(causes.map((cause) => cause.decreeId), 'the causes are the DM\'s own order, not the array\'s')
      .toEqual(['d1', 'd2']);
    expect(causes.every((cause) => cause.cause === DECREE_CAUSE), 'every cause is the table\'s hand (ARCH §6)')
      .toBe(true);
    expect(causes.map((cause) => [cause.saveId, cause.opType, cause.tickRef]), 'each cause names its save, its op and its tick')
      .toEqual([[HOME, 'set-field', result.pulseRecord.id], [HOME, 'set-field', result.pulseRecord.id]]);
    expect(registryOf(result).map(rowOf).sort(), 'both entries are applied at this tick and keep their own orderIndex')
      .toEqual([['d1', 'applied', 0, result.pulseRecord.id], ['d2', 'applied', 1, result.pulseRecord.id]]);
    expect(registryOf(result).every((row) => row.appliedAt === NOW), 'and the stamp is the CALLER\'s pinned clock, never a wall clock read here')
      .toBe(true);
  });

  it('E1-2 zero decrees leave the pulse record byte-identical — the key roster and its order are the witness\'s own bytes', () => {
    const bare = pulse(realm(null));
    expect(Object.keys(bare.pulseRecord), 'the roster AND its order, because the witness hashes the serialization')
      .toEqual([...BARE_RECORD_KEYS]);
    // The liveness anchor for the negative below: the SAME kernel on the SAME realm with
    // one due decree DOES mint the key, so its absence here is a measurement, not a hook
    // that never ran.
    expect(Object.hasOwn(pulse(realm([entry('d1', 0)])).pulseRecord, 'decreeCauses'), 'the key exists when there is a decree').toBe(true);
    expect(Object.hasOwn(bare.pulseRecord, 'decreeCauses'), 'and is ABSENT, not empty, when there is none').toBe(false);
    // Same anchor, one level up: a save that never carried the key must not grow one.
    expect(Object.hasOwn(bare.settlementUpdates.find((u) => String(u.saveId) === HOME).settlement, 'decrees'),
      'the hook never MINTS the persisted key on a save that had none — the save\'s shape is the owner\'s').toBe(false);
  });

  it('E1-3 the hook consumes NO PRNG — the tick\'s whole simulation is byte-identical with and without a decree', () => {
    // A draw taken at the head would shift every later draw of the tick, so ONE digest
    // over the composed world, the feed, the graph and every settlement (with the decree
    // words removed from both sides) is the seed trace design §12.11 asks for.
    const without = simulationDigest(pulse(realm(null)));
    const withOne = simulationDigest(pulse(realm([entry('d1', 0)])));
    expect(withOne, 'a decree applied at the head moved nothing the stream produces').toBe(without);
    // PLANT — guard the guard. The digest must be able to SEE a shifted stream, or the
    // equality above is a decoration. One character on the seed is the smallest shift
    // there is, and it is the liveness anchor for the negative that follows.
    expect(simulationDigest(pulse(realm(null), '::plant')) === without,
      'the digest blessed a different stream — it compares nothing').toBe(false);
  });

  it('E1-4 the rewind restores the registry with every later-staged entry re-appended, and retractDecreesOfTick returns that tick\'s entries to pending', () => {
    // The real shapes: `capturePulseSnapshot` deep-clones `save.settlement`, so the
    // snapshot's registry IS the pre-tick one; the live registry is what the tick wrote
    // plus whatever the DM staged afterwards. This is the merge
    // `restorePulseSnapshotOnDraft` (src/store/campaignWorldPulseDeferred.js) owes.
    const preTick = [entry('a', 0), entry('b', 1)];
    const applied = pulse(realm(preTick));
    const tickRef = applied.pulseRecord.id;
    const liveRegistry = [...registryOf(applied), entry('c', 2)];
    const restored = revertTick(preTick, liveRegistry);
    expect(restored.map(rowOf), 'the restored entries are pending again in their own order, and nothing staged later is lost')
      .toEqual([['a', 'pending', 0, null], ['b', 'pending', 1, null], ['c', 'pending', 2, null]]);
    // The no-snapshot half of the same rewind: the hook's own verb, over the live registry.
    const retracted = retractDecreesOfTick(liveRegistry, tickRef);
    expect(retracted.map(rowOf), 'retraction returns exactly this tick\'s entries and leaves the later one alone')
      .toEqual([['a', 'pending', 0, null], ['b', 'pending', 1, null], ['c', 'pending', 2, null]]);
    // The liveness anchor for the negative below: the live registry really did hold two
    // APPLIED entries carrying this tickRef, so the refusal that follows is about the ref.
    expect(liveRegistry.filter((row) => row.tickRef === tickRef).length, 'two entries carried this tick').toBe(2);
    expect(retractDecreesOfTick(liveRegistry, 'world_pulse.decree_tick.999') === liveRegistry,
      'another tick\'s rewind touches nothing and returns the registry BY REFERENCE').toBe(true);
  });

  it('E1-5 a `when` in the future is untouched by an earlier tick, and the registry comes back by reference', () => {
    const future = pulse(realm([entry('dF', 0, { tick: 99 })]));
    expect(registryOf(future).map(rowOf), 'the scheduled entry waits, unapplied and unmoved')
      .toEqual([['dF', 'pending', 0, null]]);
    // The liveness anchor for the negative below: the same entry with no `when` DOES apply
    // on this very tick, so waiting is the schedule's doing and not a dead hook.
    expect(registryOf(pulse(realm([entry('dF', 0)])))[0].status, 'unscheduled, it applies now').toBe('applied');
    expect(Object.hasOwn(future.pulseRecord, 'decreeCauses'), 'and nothing was recorded as a cause').toBe(false);
    // The hook's own no-op law, read at the leaf where reference identity survives the
    // kernel's clone: a registry with nothing due comes back as the SAME array.
    const rows = [entry('dF', 0, { tick: 99 })];
    expect(applyDecreesAtTick({ tick: 1 }, rows, 'world_pulse.x.1', { now: NOW }).registry === rows,
      'nothing due, nothing allocated').toBe(true);
    expect(applyDecreesToSaves({ tick: 1 }, realm(rows), 'world_pulse.x.1', { now: NOW }).causes, 'and no causes').toEqual([]);
  });

  it('E1-6 the interval orchestrator advances `when`-due entries per interval — each applies exactly once, and its receipt survives the ring collapse', async () => {
    // A one_month advance is four real kernel ticks. `d1` is due at once, `d3` at tick 3.
    const saves = realm([entry('d1', 0), entry('d3', 1, { tick: 3 })]);
    const result = await simulateCampaignWorldInterval({
      campaign: campaignFor(saves), saves, interval: 'one_month', commit: true, now: NOW, autoResolve: true,
    });
    const rows = result.settlementUpdates.find((u) => String(u.saveId) === HOME).settlement.decrees;
    expect(rows.map((row) => [row.id, row.status, row.tickRef]), 'each entry applied at ITS OWN tick, and neither applied twice')
      .toEqual([['d1', 'applied', 'world_pulse.decree_tick.1'], ['d3', 'applied', 'world_pulse.decree_tick.3']]);
    // Stage 5 keeps ONE record per advance (collapseIntervalHistory), so a receipt minted
    // at an interior tick is exactly what the ring policy would otherwise erase.
    const history = result.worldState.pulseHistory;
    expect(history.length, 'the interval collapsed to one record, as the ring policy requires').toBe(1);
    expect(history[0].decreeCauses.map((cause) => cause.decreeId), 'both causes survived the collapse, in tick order')
      .toEqual(['d1', 'd3']);
    const bare = await simulateCampaignWorldInterval({
      campaign: campaignFor(realm(null)), saves: realm(null), interval: 'one_month', commit: true, now: NOW, autoResolve: true,
    });
    // The liveness anchor for the negative below: the arm above proved the collapse DOES
    // carry causes across, so their absence here is the dormant shape and not a dead path.
    expect(Object.hasOwn(bare.worldState.pulseHistory[0], 'decreeCauses'),
      'and an interval with no decree composes the record it always composed').toBe(false);
  });

  it('E1-7 retraction is the EXACT inverse of application — the round trip returns the serialized registry unchanged', () => {
    // The structural guard on the second writer. `markApplied` (EM-C1) adds three keys and
    // moves `status`; `retractDecreesOfTick` must remove precisely those and restore
    // `status` IN ITS OWN PLACE, or a rewound registry differs from the one the DM staged
    // — by bytes, which is what a save is compared by.
    const staged = [entry('a', 0), entry('b', 1, { season: 'spring' }), entry('c', 2, { tick: 99 })];
    const result = pulse(realm(staged));
    const tickRef = result.pulseRecord.id;
    const roundTrip = retractDecreesOfTick(registryOf(result), tickRef);
    expect(sha256(roundTrip), 'apply then retract is the identity on the serialized registry').toBe(sha256(staged));
    // The liveness anchor for the negative below: the applied registry really did differ
    // from the staged one, so the identity above is a round trip and not two no-ops.
    expect(sha256(registryOf(result)) === sha256(staged), 'the tick really moved the registry').toBe(false);
  });

  it('E1-8 the leaf takes no draw, reads no clock, and imports only the registry and the pulse helpers', () => {
    const source = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    const specifiers = [...source.matchAll(/from\s*['"]([^'"]+)['"]/g)].map((hit) => hit[1]);
    expect(specifiers, 'THE IMPORT LIST IS EXACTLY TWO — EM-C1\'s registry (the one writer of the DM-facing'
      + ' verbs) and the kernel\'s own save-id helper (one spelling, never a second). Importing the op'
      + ' catalogue would put this leaf on tests/lint/editMutationPath.walker.test.js\' OFFENDER list,'
      + ' which is why resolveDecree is HANDED its catalogues')
      .toEqual(['../edit/registry.js', './pulseHelpers.js']);
    const fenced = specifiers.filter((specifier) => /prng|rngContext|\/store\/|\/components\/|generators|edit\/operations\.js|edit\/dmLayer\.js/.test(specifier));
    expect(fenced, 'the import fence: no PRNG, no store, no components, no generators, not the op catalogue and not the layer')
      .toEqual([]);
    // The liveness anchor for the negative below: the source really was read (its own
    // exported cause word is in it), so a false path could not pass this arm silently.
    expect(source.includes(`export const DECREE_CAUSE = '${DECREE_CAUSE}'`), 'the leaf\'s source is the one under test').toBe(true);
    expect(source.includes('Date.now') || source.includes('Math.random') || source.includes('createPRNG'),
      'and the leaf reads no clock and mints no stream — the stamp and the tickRef are the caller\'s').toBe(false);
  });
});
