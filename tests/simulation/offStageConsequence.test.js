/**
 * offStageConsequence.test.js — EM-E4d unit 3 (U88; the verifier's FIX-6's other half):
 * design §13's CONSEQUENCE POLICY is applied AT THE TICK, through the resolved counterparty.
 *
 * THE CLAIM. "The op catalogue carries one `consequence` policy per off-stage op —
 * `home-procedures+record` for a phantom target, `world` for a real save — decided at apply
 * time by the target's reality; the tick hook (EM-E1) applies that policy and nothing else"
 * (design §13). EM-F1 landed `consequenceFor`, EM-B1b landed seven off-stage acts that all
 * declare `consequence: 'by-target-reality'`, EM-E1 landed the head of the tick — and
 * nothing joined them. MEASURED AT THIS BASE, before a line was written: `consequenceFor`
 * had ZERO consumers under `src/` outside `phantoms.js`'s own body, and the one call of
 * `applyOffStage` (`phantomMintAction.js :: counterpartyBadgeOf`, EM-F1e) passes `null` for
 * the target and reads `.record` alone — so the POLICY half was dark and the tick emitted
 * ONE cause shape for a phantom counterparty and a real one alike. An act sent against a
 * settlement that does not exist was handed to the world exactly as an act against a
 * neighbour the campaign holds, which is the branch §13 rejects ("nothing from outside comes
 * home").
 *
 * ⛔ WHAT THIS SUITE DOES NOT CLAIM. The WORLD EFFECT of a `world`-policy act is the
 * simulator's — "that path is the simulator's, not the editor's, and the editor only hands
 * it the decree" — so nothing here asserts that a real counterparty's peace moved a war. The
 * hook's product is the CAUSE, and the policy on it is what a consumer may act on. Which
 * SEALS can reach the tick at all is the binder roster's question (U104, judgment 309): at
 * this tip exactly one off-stage act has a writer — design §13's peace seal over §18's
 * standing offer — and the ops below are built the way `stageSealDecreeIntent` builds that
 * one, from the catalogue's own declared target kind, never hand-typed.
 *
 * ⛔ THE RESOLUTION IS DATA, NOT A BOUND FUNCTION, AND THAT IS MEASURED. `flagRegistry.js`
 * has `simAdvanceWorker: true`, so the DEFAULT advance posts its whole payload to
 * `advanceInterval.worker.js`; case E4d3-5 structured-clones the real composed bag, which is
 * the boundary a closure could not cross.
 *
 * Proof shape as its neighbours (`decreeTick.test.js`, `decreeStaleVocabulary.test.js`):
 * straight-line literal `it`s under ONE literal `describe`, its own `vitest` import, the
 * real store composer, the real kernel, and the leaf's own source read for the fence.
 *
 * @enforced-by this test
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { makeOp } from '../../src/domain/edit/operations.js';
import {
  COUNTERPARTY_BADGES, PHANTOM_CONSEQUENCE_POLICIES, PHANTOM_KIND,
} from '../../src/domain/edit/phantoms.js';
import { stage } from '../../src/domain/edit/registry.js';
import { saveId } from '../../src/domain/worldPulse/pulseHelpers.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { decreeCataloguesForSaves } from '../../src/store/campaignAdvanceSession.js';
import {
  counterpartyBadgeOf, offStageConsequencesFor,
} from '../../src/store/phantomMintAction.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const HOOK_REL = 'src/domain/worldPulse/decreeHook.js';
const NOW = '2026-04-04T00:00:00.000Z';
const HOME = 'harrowfen';
/** A campaign member — a saved settlement of this realm, which is §13's own test of REAL. */
const REAL = 'ashford';
/** A counterparty the campaign does NOT hold: the DM's own off-stage neighbour. */
const PHANTOM = 'dm:phantom:0f3a9c';

/** ⚠ THE TWO POLICY WORDS ARE READ OFF THE DOMAIN LEAF, never typed, so a renamed word reds. */
const RECORD_ONLY = PHANTOM_CONSEQUENCE_POLICIES[0];
const WORLD = PHANTOM_CONSEQUENCE_POLICIES[1];
const BADGE_REAL = COUNTERPARTY_BADGES[1];

const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

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
      economicState: { prosperity: 'Comfortable', primaryExports: ['Grain'] },
      powerStructure: { publicLegitimacy: { score: 54, label: 'Accepted' }, factions: [] },
      npcs: [{ id: `${id}.n1`, name: 'Aldra', role: 'reeve', plotHooks: [] }],
      activeConditions: [],
      ...(decrees ? { decrees } : {}),
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

/**
 * ⭐ THE PHANTOM AS THE ESTATE STORES IT — a save row whose BLOB is a phantom record
 * (`phantoms.js`'s discriminant, imported rather than spelled). It is on the hidden shelf and
 * is NOT a member of this campaign, which is exactly why §13 calls it unreal.
 */
const phantomRow = () => ({
  id: PHANTOM,
  name: 'Vaskir',
  settlement: {
    id: PHANTOM, kind: PHANTOM_KIND, name: 'Vaskir', seed: 'seed::vaskir',
    traits: { culture: 'Highland', size: 'town', terrain: 'hills' },
  },
});

/**
 * ONE off-stage act, built the way `editSlice.js :: stageSealDecreeIntent` builds the peace
 * seal's: the type from `SEAL_ACTS.acceptPeace`, the target kind from the catalogue's OWN
 * declaration, the counterparty carried verbatim into both the ref and the payload. So the
 * fixture is the product's op and not a second spelling of one.
 */
const peaceWith = (counterparty) => makeOp('make-peace', { kind: 'phantom', id: counterparty }, { counterparty });

/** ONE staged, pending entry holding that act. */
const staged = (id, counterparty) => stage([], peaceWith(counterparty), { id, orderedAt: NOW });

/** A home act: no counterparty, so design §13 never spoke about it. */
const homeAct = (id) => stage([], makeOp('set-field', { kind: 'npc', id: `${HOME}.n1` }, { path: 'name', value: 'Aldra' }), { id, orderedAt: NOW });

/**
 * THE REALM, ALWAYS THE SAME TWO MEMBERS. Only the decree's counterparty varies between the
 * cases below, so the byte comparisons are about the policy and never about the roster.
 */
const realm = (decrees) => [town(HOME, 'Harrowfen', decrees), town(REAL, 'Ashford', null)];

const campaignOf = (saves) => ({
  id: 'e4d3-campaign',
  name: 'Consequence',
  settlementIds: saves.map((save) => save.id),
  worldState: { rngSeed: 'e4d3::consequence', tick: 1, calendar: { elapsedWeeks: 30 } },
  regionalGraph: { edges: [] },
  wizardNews: { currentTick: 1, entries: [] },
});

/** ONE real tick over the realm, with the advance's OWN composed bag. */
async function tick(decrees, { withBag = true } = {}) {
  const saves = realm(decrees);
  const decreeCatalogues = withBag ? await decreeCataloguesForSaves(saves) : null;
  const result = simulateCampaignWorldPulse({
    campaign: campaignOf(saves), saves, interval: 'one_week', now: NOW,
    ...(decreeCatalogues ? { decreeCatalogues } : {}),
  });
  return { result, bag: decreeCatalogues, causes: result.pulseRecord.decreeCauses || [] };
}

/**
 * THE SIMULATION'S OWN OUTPUT, with every decree-derived word removed — the shape
 * `decreeTick.test.js` E1-3 uses, so what is left is exactly what a world write would move.
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

describe('EM-E4d unit 3 — the tick applies design §13\'s consequence policy through the resolved counterparty', () => {
  it('E4d3-1 an applied off-stage decree carries the policy its counterparty\'s REALITY admits — record-only for a phantom, world for a saved member of this campaign', async () => {
    const unreal = await tick(staged('d1', PHANTOM));
    const real = await tick(staged('d1', REAL));

    // The liveness anchor for everything below: both entries really were APPLIED at this
    // tick, so a policy word is a reading of an act and not a key on a decree that never ran.
    expect([unreal.causes.length, real.causes.length], 'both decrees applied and became causes').toEqual([1, 1]);
    expect([unreal.causes[0].offStage, real.causes[0].offStage], 'and both are off-stage acts').toEqual([true, true]);

    expect(unreal.causes[0].consequence,
      'design §13: a phantom counterparty can absorb an act but never return one — the home procedures and the record, and no world consequence at all')
      .toBe(RECORD_ONLY);
    expect(real.causes[0].consequence,
      'design §13: a REAL counterparty routes through the existing inter-settlement machinery with full consequence')
      .toBe(WORLD);

    // ⛔ THE WHOLE OF WHAT THIS MEMBER ADDED, STATED AS A DIFFERENCE. With the counterparty
    // id normalised away, the two causes were BYTE-EQUAL at this member's base — the tick
    // could not tell an act against a settlement that does not exist from an act against a
    // neighbour the campaign holds. Now they differ in exactly one word, and it is the policy.
    const normalise = (cause) => ({ ...cause, target: null, consequence: null });
    expect(sha256(normalise(unreal.causes[0])), 'the two causes are the same act against two realities')
      .toBe(sha256(normalise(real.causes[0])));
    expect(unreal.causes[0].consequence === real.causes[0].consequence,
      'and the ONE thing that separates them is §13\'s policy').toBe(false);
  });

  it('E4d3-2 the badge and the policy are ONE reading — the biconditional holds over the same rows, so a row the registry badges REAL can never be applied record-only', async () => {
    const members = realm(null);
    const rows = [...members, phantomRow()];
    const entries = [
      { id: 'p1', op: peaceWith(PHANTOM) },
      { id: 'r1', op: peaceWith(REAL) },
      { id: 'h1', op: makeOp('set-field', { kind: 'npc', id: `${HOME}.n1` }, { path: 'name', value: 'Aldra' }) },
    ];
    const table = offStageConsequencesFor(
      entries.map((each) => ({ ...each, status: 'pending', orderIndex: 0 })),
      members,
    );

    for (const each of entries) {
      const badge = counterpartyBadgeOf(rows, each);
      const policy = Object.hasOwn(table, each.id) ? table[each.id] : null;
      expect(policy === WORLD, `${each.id}: the policy says world exactly when the badge says REAL`)
        .toBe(badge === BADGE_REAL);
    }
    // Anchored in both directions, so the loop above is not three vacuous nulls: the roster
    // really does hold one REAL, one PHANTOM and one act with no counterparty at all.
    expect([counterpartyBadgeOf(rows, entries[0]), counterpartyBadgeOf(rows, entries[1]), counterpartyBadgeOf(rows, entries[2])],
      'the three rows are a phantom, a member and a home act').toEqual([COUNTERPARTY_BADGES[0], BADGE_REAL, null]);
    expect(table, 'and the table names the two off-stage entries and nothing else')
      .toEqual({ p1: RECORD_ONLY, r1: WORLD });
  });

  it('E4d3-3 AND NOTHING ELSE — the whole simulation is byte-identical under either policy and with no decree at all, so no world fact is derived from a counterparty on either path', async () => {
    const bare = simulationDigest((await tick(null)).result);
    const unreal = simulationDigest((await tick(staged('d1', PHANTOM))).result);
    const real = simulationDigest((await tick(staged('d1', REAL))).result);
    expect(unreal, 'a phantom act moved nothing the stream or the world produces').toBe(bare);
    expect(real, 'and neither did a real one — "the editor only hands it the decree"').toBe(bare);

    // PLANT — guard the guard. The digest must be able to SEE a moved world, or the two
    // equalities above are decoration. One character on the seed is the smallest shift there
    // is, and it is the liveness anchor for the negative that follows.
    const saves = realm(null);
    const shifted = simulationDigest(simulateCampaignWorldPulse({
      campaign: { ...campaignOf(saves), worldState: { rngSeed: 'e4d3::consequence::plant', tick: 1, calendar: { elapsedWeeks: 30 } } },
      saves, interval: 'one_week', now: NOW,
    }));
    expect(shifted === bare, 'the digest blessed a different stream — it compares nothing').toBe(false);
  });

  it('E4d3-4 a decree with NO counterparty takes no policy word, and a caller that composes no resolution is this member\'s base exactly', async () => {
    const home = await tick(homeAct('h1'));
    expect(home.causes.length, 'the home act applied').toBe(1);
    expect(Object.hasOwn(home.causes[0], 'consequence'),
      'design §13 never spoke about a home act, so the key is ABSENT rather than defaulted').toBe(false);
    expect(Object.hasOwn(home.causes[0], 'offStage'), 'and it is not an off-stage act either').toBe(false);

    // ⛔ THE GOLDEN BY COPY. Run the SAME off-stage decree with no bag at all — every direct
    // caller, every preview, every test that composes none — and the cause is byte-identical
    // to the one this member's base produced, which is the cause WITHOUT the policy key.
    const withBag = await tick(staged('d1', PHANTOM));
    const without = await tick(staged('d1', PHANTOM), { withBag: false });
    expect(without.causes.length, 'the entry still applies with no resolution handed in').toBe(1);
    expect(Object.hasOwn(without.causes[0], 'consequence'), 'and carries no policy word').toBe(false);
    expect(sha256(without.causes[0]), 'the un-resolved cause is the base\'s cause, byte for byte')
      .toBe(sha256({ ...withBag.causes[0], consequence: undefined }));
  });

  it('E4d3-5 the resolution crosses the advance\'s worker boundary as DATA, and the hook\'s import list is still EXACTLY TWO', async () => {
    const bag = await decreeCataloguesForSaves(realm(staged('d1', PHANTOM)));
    // ⛔ `simAdvanceWorker` defaults TRUE, so this bag rides `worker.postMessage`. A BOUND
    // FUNCTION here would throw DataCloneError out of the client's Promise executor and
    // REJECT the DM's advance, which is why the hook is handed the RESOLUTION and not a
    // resolver. `structuredClone` is that boundary, executed.
    const cloned = structuredClone({ ...bag, opTypes: undefined });
    expect(cloned.consequenceBySave, 'the resolution survives the clone the worker performs')
      .toEqual({ [saveId(realm(null)[0])]: { d1: RECORD_ONLY } });
    // Anchored: the clone really would refuse a closure, so the pass above is a property of
    // the bag and not of a clone that accepts anything.
    expect(() => structuredClone({ resolve: () => RECORD_ONLY }), 'a bound resolver could not have crossed').toThrow();

    const specifiers = [...readFileSync(join(ROOT, HOOK_REL), 'utf8').matchAll(/from\s*['"]([^'"]+)['"]/g)].map((hit) => hit[1]);
    expect(specifiers, 'E1-8\'s pin is UNMOVED: the policy travels as an argument, so this leaf gained no edge into src/domain/edit/phantoms.js — whose own importer roster (phantoms.test.js A12) is asserted EXACT in both directions')
      .toEqual(['../edit/registry.js', './pulseHelpers.js']);
  });

  it('E4d3-6 the ADVANCE composes it, filed by the kernel\'s own save id and by entry id, and only for the member that holds the pending act', async () => {
    const bag = await decreeCataloguesForSaves(realm([...staged('d1', PHANTOM), ...staged('d2', REAL)]));
    expect(Object.keys(bag.consequenceBySave), 'only the member with a pending decree is named — a member the bag does not name resolves nothing')
      .toEqual([saveId(realm(null)[0])]);
    expect(bag.consequenceBySave[saveId(realm(null)[0])], 'each entry by its own id, each policy by its counterparty\'s reality')
      .toEqual({ d1: RECORD_ONLY, d2: WORLD });
    // Anchored: the pools half is unmoved by this member, so the bag really is the same bag
    // U72 composed with one more table on it.
    expect(Object.keys(bag).sort(), 'the bag grew ONE key and lost none').toEqual(['consequenceBySave', 'opTypes', 'poolsBySave']);
  });
});
