/**
 * tests/domain/decreeProse.test.js — EM-E2's acceptance battery (the charter's wave-3 row;
 * design §11, §13, §16, §19 ruling 2, §20.3).
 *
 * WHAT IT PROVES. That a decree's chronicle line is DRAWN rather than written: every
 * clause of every status by provenance by form comes out of `decreeProsePools.js`, the
 * same seed says the same thing forever, and the line the reader ends up with is an entry
 * of the realm's EXISTING timeline rather than of a second one.
 *
 * ⛔ THE TIMELINE ARM DRIVES THE SHIPPED `chronicleTimeline`, NEVER A REPLICA OF ITS
 * SHAPE. A test that asserted the line has an `id`, a `tick` and a `prose` would pass on
 * the day the timeline stopped reading any of them. So the lines go THROUGH
 * `src/domain/display/chronicleTimeline.js` and the assertion is on what comes out, with
 * a malformed line beside every good one: the contract convicts it or the arm is measuring
 * nothing.
 *
 * ⛔ THE FORM ROSTER IS PINNED AGAINST `OP_TYPES` AND `OP_STAGES` HERE, where importing
 * the op catalogue costs a test one module and costs the bundle nothing. The leaf itself
 * deliberately does not import it (its docblock carries the closure measurement), so this
 * is where the two vocabularies are held together.
 *
 * @enforced-by npx vitest run tests/domain/decreeProse.test.js
 */
import { describe, expect, it } from 'vitest';

import { chronicleTimeline } from '../../src/domain/display/chronicleTimeline.js';
import { GUARD_KINDS } from '../../src/domain/edit/guards.js';
import { OP_STAGES, OP_TYPES, makeOp } from '../../src/domain/edit/operations.js';
import { DECREE_AUTHORS, DECREE_STATUSES } from '../../src/domain/edit/registry.js';
import {
  applyPartyDecree, authorableEventTypes, partyActionFor, partyDeedClause,
  scheduledEventClause,
} from '../../src/domain/edit/eventCatalogue.js';
import {
  AFFORDANCE_MANIFEST, NON_AUTHORABLE_EVENTS, VERB_FAMILIES,
} from '../../src/domain/events/affordanceManifest.js';
import { PARTY_IMPACT_KINDS } from '../../src/domain/worldPulse/partyImpactKinds.js';
import { applyPartyImpact } from '../../src/domain/worldPulse/partyImpact.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import {
  DECREE_FORMS, decreeChronicleLine, decreeForm, decreeLineParts,
} from '../../src/domain/display/stateProse/decreeProse.js';
import {
  DECREE_EVENT_POOLS, DECREE_FOLLOWS_FROM_POOL, DECREE_FORM_POOLS, DECREE_HAND_POOLS,
  DECREE_LINE_CAUSES, DECREE_OVERRIDE_POOLS, DECREE_PARTY_DEED_POOLS, DECREE_PROSE_BLOCKS,
  DECREE_STANDING_POOLS,
} from '../../src/domain/display/stateProse/decreeProsePools.js';

/**
 * Design §20.3's three statuses and EM-C1 §6's three authors, TAKEN FROM THE REGISTRY THAT
 * LANDS THEM rather than spelled a second time here (U5). EM-E2 was built before EM-C1 was
 * in the tree, so these two rows were transcriptions with the source named in a comment;
 * the comment cannot red when the vocabulary moves and the import can. Every arm below that
 * walks the cross, and the two that hold the pool keys to their source, now read the
 * registry's own frozen words.
 */
const STATUSES = [...DECREE_STATUSES];
const AUTHORS = [...DECREE_AUTHORS];

/** Every authored sentence of this corpus, by the pool it lives in. */
const TEXTS_BY_POOL = new Map(
  Object.entries(DECREE_PROSE_BLOCKS).flatMap(([blockId, block]) => Object.entries(block)
    .map(([poolKey, pool]) => [`${blockId}::${poolKey}`, pool.map((v) => v.text)])),
);

/** One op per form, built through the real constructor so the shape is the engine's. */
const OPS = {
  home: makeOp('add-npc', { kind: 'settlement', id: 's1' }, { name: 'Alder', role: 'miller' }),
  'off-stage-phantom': makeOp('declare-war', { kind: 'phantom', id: 'p1' }, { rationale: 'a raid' }),
  'off-stage-real': makeOp('declare-war', { kind: 'settlement', id: 's2' }, { rationale: 'a raid' }),
};

/** @param {object} over */
const entryOf = (over = {}) => ({
  id: 'd1', status: 'pending', addedBy: 'dm', orderIndex: 0, orderedAt: 'stamp-1',
  op: OPS.home, ...over,
});

const WORLD = Object.freeze({ name: 'Kolstad' });

/** Is every drawn clause an authored member of the pool it names? */
const everyPartIsAuthored = (parts) => parts.every((part) => {
  const authored = TEXTS_BY_POOL.get(`${part.blockId}::${part.poolKey}`) || [];
  // A slot fill makes the rendered text differ from the authored template, so the test is
  // "one authored template renders to this", not string equality against the pool.
  return authored.some((text) => text === part.text
    || new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.+')}$`).test(part.text));
});

describe('EM-E2 — the chronicle\'s voice for a decree', () => {
  it('every decree status, provenance and off-stage form renders ONE line from a pool, deterministic under a seed', () => {
    const seen = [];
    for (const status of STATUSES) {
      for (const addedBy of AUTHORS) {
        for (const form of DECREE_FORMS) {
          for (const cause of DECREE_LINE_CAUSES) {
            const entry = entryOf({ status, addedBy, op: OPS[form] });
            const options = { seed: 'seed-a', cause, counterpart: 'Harrowmere' };
            const cell = `${status}/${addedBy}/${form}/${cause}`;
            const line = decreeChronicleLine(entry, WORLD, options);
            expect(line, cell).toBeTruthy();
            expect(line.prose.length, cell).toBeGreaterThan(40);
            expect(line.cause, cell).toBe(cause);
            const parts = decreeLineParts(entry, WORLD, options);
            expect(parts.map((p) => p.part), cell).toEqual(['hand', 'form', 'standing']);
            expect(parts.map((p) => p.poolKey), cell).toEqual([addedBy, form, status]);
            expect(everyPartIsAuthored(parts), `${cell} draws only authored sentences`).toBe(true);
            // ONE line, joined from the parts and nothing else: no connective, no glue word.
            expect(line.prose, cell).toBe(parts.map((p) => p.text).join(' '));
            // THE PROMISE, at the grain this leaf owns it: the same seed, forever.
            expect(decreeChronicleLine(entry, WORLD, options).prose, cell).toBe(line.prose);
            seen.push(line.prose);
          }
        }
      }
    }
    expect(seen.length, 'the whole cross was rendered').toBe(STATUSES.length * AUTHORS.length * DECREE_FORMS.length * DECREE_LINE_CAUSES.length);
    // NON-VACUOUS: a cross that rendered one sentence fifty-four times would satisfy every
    // assertion above. The draw must actually reach the corpus.
    expect(new Set(seen).size, 'the cross reaches many sentences, not one').toBeGreaterThan(20);
  });

  it('the seed moves the draw, and seedlessness is canonical-at-zero', () => {
    const entry = entryOf({ status: 'applied', addedBy: 'surveyor' });
    const seeds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(
      (seed) => decreeChronicleLine(entry, WORLD, { seed }).prose,
    );
    expect(new Set(seeds).size, 'eight seeds do not all draw the same line').toBeGreaterThan(1);
    // Law 4: no seed reads index 0 of each eligible list, so a census or a print path with
    // no telling to key on gets a stable sentence rather than an arbitrary one.
    const bare = decreeChronicleLine(entry, WORLD, {});
    expect(bare.prose).toBe([
      DECREE_HAND_POOLS.surveyor[0].text,
      DECREE_FORM_POOLS.home[0].text,
      DECREE_STANDING_POOLS.applied[0].text,
    ].join(' '));
    // And the entry's own id rides the seed, so two decrees of one sitting differ.
    const other = decreeChronicleLine(entryOf({ status: 'applied', addedBy: 'surveyor', id: 'd2' }), WORLD, { seed: 'a' });
    expect(typeof other.prose).toBe('string');
    expect(other.decreeId).toBe('d2');
  });

  it('the override line names the overridden guard by its GUARD_KINDS word', () => {
    for (const kind of GUARD_KINDS) {
      const guardId = `rule-x:d1:-:-`;
      const entry = entryOf({ overrode: [guardId] });
      const options = { seed: 'seed-a', overrodeGuards: [{ id: guardId, kind }] };
      const parts = decreeLineParts(entry, WORLD, options);
      const clause = parts.find((part) => part.part === 'override');
      expect(clause, `${kind} renders an override clause`).toBeTruthy();
      expect(clause.poolKey, kind).toBe(kind);
      expect(clause.text.includes(kind), `${kind} is named in its own clause`).toBe(true);
      expect(decreeChronicleLine(entry, WORLD, options).prose.includes(clause.text), kind).toBe(true);
    }
    // THE PAIRED NEGATIVES, so the clause is not simply always present.
    // anchored: the positive arm above renders the clause for all five kinds, so an absent
    // clause here is the guard being dropped and never the renderer having gone quiet.
    const noGuards = decreeLineParts(entryOf({ overrode: ['rule-x:d1:-:-'] }), WORLD, { seed: 'seed-a' });
    expect(noGuards.some((part) => part.part === 'override'), 'an override the caller cannot name says nothing').toBe(false);
    const unknownKind = decreeLineParts(
      entryOf({ overrode: ['rule-x:d1:-:-'] }), WORLD,
      { seed: 'seed-a', overrodeGuards: [{ id: 'rule-x:d1:-:-', kind: 'vibes' }] },
    );
    expect(unknownKind.some((part) => part.part === 'override'), 'a kind outside GUARD_KINDS mints no sentence').toBe(false);
    // Several kinds set aside give several clauses, in one stable order.
    const many = decreeLineParts(
      entryOf({ overrode: ['g1', 'g2'] }), WORLD,
      { seed: 'seed-a', overrodeGuards: [{ id: 'g2', kind: 'totality' }, { id: 'g1', kind: 'contention' }] },
    );
    expect(many.filter((part) => part.part === 'override').map((part) => part.poolKey))
      .toEqual(['contention', 'totality']);
  });

  it('the follows-from join renders the prerequisite\'s line reference', () => {
    const registry = [
      { id: 'd0', chronicleRef: 'decree:d0' },
      { id: 'd9', chronicleRef: 'decree:d9' },
    ];
    const entry = entryOf({ followsFrom: ['d0'] });
    const options = { seed: 'seed-a', registry };
    const parts = decreeLineParts(entry, WORLD, options);
    const clause = parts.find((part) => part.part === 'follows-from');
    expect(clause, 'a resolvable prerequisite renders its clause').toBeTruthy();
    expect(clause.text.includes('decree:d0'), 'and the clause names the reference').toBe(true);
    const line = decreeChronicleLine(entry, WORLD, options);
    expect(line.followsFrom, 'the line carries the address chain too').toEqual(['decree:d0']);
    expect(line.prose.includes('decree:d0')).toBe(true);
    // Two prerequisites resolve to two references, in one stable order.
    expect(decreeChronicleLine(entryOf({ followsFrom: ['d9', 'd0'] }), WORLD, options).followsFrom)
      .toEqual(['decree:d0', 'decree:d9']);
    // ANCHORED LIVENESS, both limbs: no registry and an entry with no line yet each render
    // NOTHING rather than a sentence pointing at a reference that resolves nowhere.
    // anchored: the positive arm above renders this very clause from this very pool, so a
    // missing clause here is the absence of a reference and never an emptied pool.
    expect(decreeLineParts(entry, WORLD, { seed: 'seed-a' }).some((p) => p.part === 'follows-from')).toBe(false);
    const unlinked = decreeLineParts(entry, WORLD, { seed: 'seed-a', registry: [{ id: 'd0' }] });
    expect(unlinked.some((part) => part.part === 'follows-from'), 'a prerequisite with no line yet is not pointed at').toBe(false);
    expect(decreeChronicleLine(entry, WORLD, { seed: 'seed-a' }).followsFrom).toEqual([]);
    // EVERY variant of the pool names the slot, which is what makes the silence structural.
    expect(DECREE_FOLLOWS_FROM_POOL.every((v) => (v.slots || []).includes('prerequisite'))).toBe(true);
  });

  it('decreeChronicleLine joins chronicleTimeline\'s shape, and a malformed line is convicted by it', () => {
    const early = decreeChronicleLine(entryOf({ id: 'd1' }), WORLD, { seed: 'seed-a', tick: 2 });
    const late = decreeChronicleLine(entryOf({ id: 'd2', status: 'applied', appliedAt: 'stamp-9' }), WORLD, { seed: 'seed-a', tick: 5 });
    const timeline = chronicleTimeline({ chronicles: [early, late], pulseHistory: [] });
    // Newest tick first is the timeline's own ordering; the lines slot into it unchanged.
    expect(timeline.map((row) => row.tick)).toEqual([5, 2]);
    expect(timeline[0].chronicles).toEqual([late]);
    expect(timeline[1].chronicles).toEqual([early]);
    // THE PLANT: the timeline reads `prose`, so a line that lost its sentence vanishes from
    // the scrollback entirely. This is the contract that convicts a malformed line, driven.
    const mute = chronicleTimeline({ chronicles: [{ ...early, prose: '' }], pulseHistory: [] });
    expect(mute).toEqual([]);
    // And a line whose tick went missing lands at the timeline's own absence value, which
    // is why `tick` is always a number on the returned shape and never undefined.
    expect(typeof early.tick).toBe('number');
    expect(chronicleTimeline({ chronicles: [{ ...early, tick: undefined }] })[0].tick).toBe(0);
  });

  it('the tick and the stamp are the caller\'s, and this leaf reads no clock', () => {
    const scheduled = entryOf({ when: { tick: 4 } });
    expect(decreeChronicleLine(scheduled, WORLD, {}).tick, 'a pending entry shows when it is due').toBe(4);
    expect(decreeChronicleLine(scheduled, WORLD, { tick: 6 }).tick, 'the recorded tick wins').toBe(6);
    expect(decreeChronicleLine(entryOf(), WORLD, {}).tick, 'and an unscheduled entry reads zero').toBe(0);
    expect(decreeChronicleLine(entryOf(), WORLD, {}).createdAt).toBe('stamp-1');
    expect(decreeChronicleLine(entryOf({ appliedAt: 'stamp-9' }), WORLD, {}).createdAt).toBe('stamp-9');
    expect(decreeChronicleLine(entryOf({ orderedAt: '' }), WORLD, {}).createdAt).toBe(null);
    // The line's own reference: an applied entry already carries one, a pending entry has
    // its minted from its own id, and neither needs a counter, a clock or a draw.
    expect(decreeChronicleLine(entryOf(), WORLD, {}).id).toBe('decree:d1');
    expect(decreeChronicleLine(entryOf({ chronicleRef: 'line-7' }), WORLD, {}).id).toBe('line-7');
  });

  it('the form roster is design §13\'s three, and every op type lands in exactly one', () => {
    expect(DECREE_FORMS).toEqual(['home', 'off-stage-phantom', 'off-stage-real']);
    expect(Object.keys(DECREE_FORM_POOLS).sort()).toEqual([...DECREE_FORMS].sort());
    // BOUND TO THE CATALOGUE'S OWN VOCABULARY: the two stage words the forms partition are
    // `OP_STAGES`, and every one of the 22 shipped rows classifies.
    expect([...OP_STAGES].sort()).toEqual(['home', 'off-stage']);
    const byForm = { home: 0, 'off-stage-phantom': 0, 'off-stage-real': 0 };
    for (const [type, row] of Object.entries(OP_TYPES)) {
      const phantom = decreeForm({ stage: row.stage, target: { kind: 'phantom', id: 'p' } });
      const real = decreeForm({ stage: row.stage, target: { kind: 'settlement', id: 's' } });
      expect(DECREE_FORMS.includes(phantom), type).toBe(true);
      expect(DECREE_FORMS.includes(real), type).toBe(true);
      byForm[row.stage === 'off-stage' ? 'off-stage-phantom' : 'home'] += 1;
    }
    expect(byForm.home + byForm['off-stage-phantom']).toBe(Object.keys(OP_TYPES).length);
    expect(byForm['off-stage-phantom'], 'the seven off-stage rows of the shipped catalogue').toBe(7);
    // FAIL-CLOSED: an op the registry cannot type is the town's own business.
    expect(decreeForm(null)).toBe('home');
    expect(decreeForm({ stage: 'somewhere-else' })).toBe('home');
    expect(decreeForm({ stage: 'off-stage' }), 'an off-stage op with no target reads as real').toBe('off-stage-real');
  });

  it('a fact outside a closed vocabulary renders NOTHING, never half a sentence', () => {
    // anchored: every limb below has its positive twin in the cross arm above, which renders
    // a line for all nine status-by-author cells, so a null here is the vocabulary closing
    // and never the renderer having stopped rendering.
    expect(decreeChronicleLine(entryOf({ status: 'queued' }), WORLD, {})).toBe(null);
    expect(decreeChronicleLine(entryOf({ addedBy: 'oracle' }), WORLD, {})).toBe(null);
    expect(decreeChronicleLine(entryOf({ status: undefined }), WORLD, {})).toBe(null);
    expect(decreeChronicleLine(entryOf({ id: '' }), WORLD, {})).toBe(null);
    expect(decreeChronicleLine(entryOf({ op: { target: { kind: 'npc', id: 'n' } } }), WORLD, {})).toBe(null);
    expect(decreeChronicleLine(null, WORLD, {})).toBe(null);
    expect(decreeLineParts('not an entry', WORLD, {})).toEqual([]);
    // A cause outside the closed vocabulary reads as the hook's own cause rather than
    // minting a sixth kind of hand: the line is still true, and no word is invented.
    expect(decreeChronicleLine(entryOf(), WORLD, { cause: 'the stars' }).cause).toBe('table');
    expect(DECREE_LINE_CAUSES).toEqual(['party', 'table']);
  });

  it('a slot with no fill shortens the line, and never reaches the reader unfilled', () => {
    const entry = entryOf({ op: OPS['off-stage-real'] });
    const SEEDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    // seed-loop: collected — every seed is rendered and the offenders are asserted ONCE, so
    // what the failure prints is a count of broken seeds and never the first one's floor.
    const offenders = SEEDS.flatMap((seed) => {
      const bare = decreeChronicleLine(entry, null, { seed }).prose;
      const filled = decreeChronicleLine(entry, WORLD, { seed, counterpart: 'Harrowmere' }).prose;
      const bad = [];
      if (bare.includes('{') || bare.includes('counterpart')) bad.push(`bare/${seed}: ${bare}`);
      if (filled.includes('{')) bad.push(`filled/${seed}: ${filled}`);
      return bad;
    });
    expect(offenders, 'no seed renders a slot the caller never filled').toEqual([]);
    // NON-VACUOUS: the counterpart sentence really is reachable when the fill exists, so the
    // arm above is silence-by-anchoring rather than silence-by-a-pool-nobody-can-draw.
    const reached = SEEDS
      .some((seed) => decreeChronicleLine(entry, WORLD, { seed, counterpart: 'Harrowmere' }).prose.includes('Harrowmere'));
    expect(reached, 'some seed draws the counterpart sentence').toBe(true);
    // The settlement's own noun is spoken on the finished unit, exactly as the desk does it.
    const village = decreeChronicleLine(entryOf(), WORLD, { tierNoun: 'village' });
    const town = decreeChronicleLine(entryOf(), WORLD, { tierNoun: 'town' });
    expect(village.prose.includes('the village')).toBe(true);
    expect(town.prose, 'a town is a no-op, by identity').toBe(decreeChronicleLine(entryOf(), WORLD, {}).prose);
  });

  it('the corpus is addressable, stable-id\'d and reachable in full', () => {
    const vids = [];
    for (const block of Object.values(DECREE_PROSE_BLOCKS)) {
      for (const pool of Object.values(block)) {
        expect(pool.length, 'no pool is empty').toBeGreaterThan(0);
        for (const variant of pool) vids.push(variant.vid);
      }
    }
    expect(new Set(vids).size, 'every vid is unique across the leaf').toBe(vids.length);
    expect(vids.every((vid) => Number.isInteger(vid) && vid >= 0), 'and every one is a real id').toBe(true);
    // The blocks ARE the pools the reader draws: an unaddressed pool is unreachable.
    expect(DECREE_PROSE_BLOCKS['DEC-HAND']).toBe(DECREE_HAND_POOLS);
    expect(DECREE_PROSE_BLOCKS['DEC-STANDING']).toBe(DECREE_STANDING_POOLS);
    expect(DECREE_PROSE_BLOCKS['DEC-FORM']).toBe(DECREE_FORM_POOLS);
    expect(DECREE_PROSE_BLOCKS['DEC-OVERRIDE']).toBe(DECREE_OVERRIDE_POOLS);
    expect(DECREE_PROSE_BLOCKS['DEC-FOLLOWS']['*']).toBe(DECREE_FOLLOWS_FROM_POOL);
    // The four closed vocabularies the pool keys ARE, each held to the ROSTER THAT LANDS
    // IT and not to a list written here: the leaf imports nothing by design, so this is
    // where its keys are joined to their sources, exactly as EM-E6's two blocks are.
    expect(Object.keys(DECREE_HAND_POOLS).sort(), 'EM-C1\'s own DECREE_AUTHORS')
      .toEqual([...DECREE_AUTHORS].sort());
    expect(Object.keys(DECREE_STANDING_POOLS).sort(), 'EM-C1\'s own DECREE_STATUSES (design §20.3)')
      .toEqual([...DECREE_STATUSES].sort());
    expect(Object.keys(DECREE_OVERRIDE_POOLS).sort(), 'the landed GUARD_KINDS').toEqual([...GUARD_KINDS].sort());
    // NON-VACUOUS: the two registry rosters really are the three-word vocabularies the
    // corpus is keyed on, so neither arm above can be satisfied by an emptied export.
    expect([DECREE_AUTHORS.length, DECREE_STATUSES.length], 'three authors and three statuses')
      .toEqual([3, 3]);
  });
});

/**
 * EM-E6's acceptance battery (the charter's wave-3 EM-E6 row; design §16, §19 ruling 2).
 *
 * WHAT IT PROVES, beyond EM-E2's. That the two things a decree needs from the wider
 * simulation come from the simulation's OWN two surfaces: the event a decree schedules is
 * one of the affordance manifest's typed settlement events minus its folds, and the party
 * cause is one of the twelve impact kinds, applied through the one door that already
 * exists for it. Every arm below drives the imported catalogue rather than a list written
 * here, so a verb or a kind added upstream is measured and never transcribed.
 *
 * ⛔ THE WRITE-PATH ARM RUNS THE REAL `applyPartyImpact` OVER A REAL CAMPAIGN, and asserts
 * that a decree and a direct party action produce the SAME result object. An arm that only
 * checked the action's shape would pass on the day the decree path stopped calling it.
 */

const NOW = '2026-02-01T00:00:00.000Z';

/** @param {string} name */
const partySettlement = (name) => ({
  name,
  tier: 'town',
  population: 1600,
  config: { tradeRouteAccess: 'road' },
  institutions: [],
  economicState: { primaryExports: [], primaryImports: [] },
  powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
  npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
  activeConditions: [],
});

/** @param {string} id @param {string} name */
const partySave = (id, name) => ({
  id,
  name,
  phase: 'canon',
  settlement: partySettlement(name),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

const PARTY_SAVES = [partySave('a', 'Ashford'), partySave('b', 'Briarwatch')];

/**
 * ⛔ THE REGIONAL GRAPH IS BUILT ONCE AND CLONED, NEVER REBUILT PER CAMPAIGN.
 * `ensureRegionalGraph` stamps its edges with the wall clock, so two campaigns built a
 * few milliseconds apart carry different `updatedAt` values and the two-doors arm below
 * would compare a difference this fixture invented (measured: a nine-millisecond drift).
 * One build, cloned per campaign, keeps the inputs identical AND the objects independent.
 */
const PARTY_GRAPH = ensureRegionalGraph({
  edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }],
});

const partyCampaign = () => ({
  id: 'camp-e6',
  name: 'Decree Campaign',
  settlementIds: ['a', 'b'],
  worldState: {
    rngSeed: 'e6-seed',
    tick: 5,
    stressors: [{
      id: 'world_stressor.siege.a',
      type: 'siege',
      severity: 0.82,
      affectedSettlementIds: ['a'],
      residualEffects: ['damaged_walls'],
    }],
    relationshipStates: {
      'edge.a.b': { relationshipType: 'hostile', trust: 0.05, resentment: 0.78, fear: 0.72 },
    },
  },
  regionalGraph: structuredClone(PARTY_GRAPH),
  wizardNews: { currentTick: 5, entries: [] },
});

describe('EM-E6 — events, predetermined or by the party', () => {
  it('a party-cause decree carries the kind\'s own targets and its default magnitude', () => {
    let fields = 0;
    for (const [kind, spec] of Object.entries(PARTY_IMPACT_KINDS)) {
      /** @type {Record<string, unknown>} */
      const payload = { kind };
      for (const field of spec.targets) { payload[field] = `given:${field}`; fields += 1; }
      const action = partyActionFor(payload);
      expect(action, `${kind} builds an action`).toBeTruthy();
      expect(action.kind, kind).toBe(kind);
      // THE MAGNITUDE IS THE CATALOGUE'S, not a number this train chose.
      expect(action.magnitude, `${kind} takes its default magnitude`).toBe(spec.defaultMagnitude);
      for (const field of spec.targets) {
        expect(action[field], `${kind}/${field} is carried`).toBe(`given:${field}`);
      }
      // A stated magnitude wins, and it is the ONLY thing that overrides the default.
      expect(partyActionFor({ ...payload, magnitude: 0.11 }).magnitude, kind).toBe(0.11);
      expect(partyActionFor({ ...payload, magnitude: 'a lot' }).magnitude, kind)
        .toBe(spec.defaultMagnitude);
      // ⛔ EVERY DECLARED TARGET IS REQUIRED. A decree missing one is not half-applied
      // with a hole in it; it is not an action at all.
      // anchored: the positive limb just above built this very action from this very
      // payload, so a null here is the missing field and never a broken builder.
      for (const field of spec.targets) {
        const short = { ...payload };
        delete short[field];
        expect(partyActionFor(short), `${kind} without ${field}`).toBe(null);
      }
    }
    // NON-VACUOUS: all twelve kinds and every declared field really were exercised.
    expect(Object.keys(PARTY_IMPACT_KINDS).length, 'the one party vocabulary').toBe(12);
    // Measured, not guessed: six kinds declare one target field and six declare two.
    expect(fields, 'and every target field the twelve declare').toBe(18);
    // A kind outside the vocabulary builds nothing, so no second party vocabulary can
    // slip in through a payload.
    expect(partyActionFor({ kind: 'broke_the_siege', stressorId: 'x' })).toBe(null);
    expect(partyActionFor({ kind: '' })).toBe(null);
    expect(partyActionFor(null)).toBe(null);
  });

  it('a party-cause decree applies THROUGH applyPartyImpact, by the one door', () => {
    const payload = {
      kind: 'resolve_stressor',
      stressorId: 'world_stressor.siege.a',
      label: 'The party broke the siege of Ashford',
    };
    const action = partyActionFor(payload);
    expect(action.magnitude, 'the catalogue\'s own decisiveness')
      .toBe(PARTY_IMPACT_KINDS.resolve_stressor.defaultMagnitude);

    const viaDecree = applyPartyDecree({
      campaign: partyCampaign(), saves: PARTY_SAVES, payload, now: NOW,
    });
    const viaDoor = applyPartyImpact({
      campaign: partyCampaign(), saves: PARTY_SAVES, action, now: NOW,
    });
    expect(viaDecree, 'the decree reached the world').not.toBeNull();
    // ⛔ THE SAME DOOR, PROVEN BY THE RESULT AND NOT BY A COMMENT. A decree and a direct
    // party action are the same act, so their whole result object is the same object.
    expect(viaDecree).toEqual(viaDoor);
    // And it really moved the world: the siege is no longer active.
    const siege = (viaDecree.worldState.stressors || [])
      .find((s) => s.id === 'world_stressor.siege.a');
    expect(siege.status, 'the crisis the party ended').toBe('residual');

    // ⛔ THE PAIRED NEGATIVE, both limbs: a kind the vocabulary cannot type reaches the
    // world through neither door, so the decree path adds no reach of its own.
    // anchored: the limbs above applied a real kind through both doors over this very
    // campaign, so a null here is the vocabulary closing and never a dead fixture.
    const unknown = { kind: 'broke_the_siege', stressorId: 'world_stressor.siege.a' };
    expect(applyPartyDecree({ campaign: partyCampaign(), saves: PARTY_SAVES, payload: unknown, now: NOW }))
      .toBe(null);
    expect(applyPartyImpact({ campaign: partyCampaign(), saves: PARTY_SAVES, action: unknown, now: NOW }))
      .toBe(null);
    expect(applyPartyDecree({ campaign: partyCampaign(), saves: PARTY_SAVES, now: NOW })).toBe(null);
    expect(applyPartyDecree()).toBe(null);
  });

  it('the chronicle says "by the party\'s hand" FROM THE POOL, and a hand-written clause is not one', () => {
    const RULING = 'by the party\'s hand';
    // THE WORDS ARE IN THE CORPUS, in both blocks that can speak for the party.
    const handSays = Object.values(DECREE_HAND_POOLS).flat()
      .filter((v) => v.causes.includes('party') && v.text.includes(RULING));
    expect(handSays.length, 'the hand block carries the ruling\'s words').toBeGreaterThan(0);
    expect(Object.entries(DECREE_PARTY_DEED_POOLS)
      .filter(([, pool]) => !pool.some((v) => v.text.includes(RULING)))
      .map(([kind]) => kind), 'and every deed pool can say them too').toEqual([]);

    // AND THEY REACH A RENDERED LINE, drawn rather than written.
    const SEEDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const lines = SEEDS.map((seed) => decreeChronicleLine(entryOf(), WORLD, { seed, cause: 'party' }).prose);
    expect(lines.some((prose) => prose.includes(RULING)),
      'some seed speaks the ruling in the line itself').toBe(true);
    const unauthored = SEEDS
      .filter((seed) => !everyPartIsAuthored(decreeLineParts(entryOf(), WORLD, { seed, cause: 'party' })));
    expect(unauthored, 'and every clause of every such line is an authored member').toEqual([]);

    // The deed clause for every kind is an authored member of its own pool.
    const deeds = new Set(Object.values(DECREE_PARTY_DEED_POOLS).flat().map((v) => v.text));
    for (const kind of Object.keys(PARTY_IMPACT_KINDS)) {
      const clause = partyDeedClause(kind, { seed: 'seed-a' });
      expect(clause, `${kind} renders a deed clause`).toBeTruthy();
      expect(deeds.has(clause.text), `${kind} draws an authored sentence`).toBe(true);
    }
    // ⛔ THE PLANT: a clause assembled by hand carries the same ruling words and is NOT an
    // authored member of the pool it claims. This is the free-text failure the corpus
    // exists to prevent, run through the battery's own membership predicate.
    expect(everyPartIsAuthored([{
      blockId: 'DEC-PARTY',
      poolKey: 'remove_npc',
      text: `The party took them, ${RULING}.`,
    }]), 'a hand-written clause is not an authored member').toBe(false);
  });

  it('every authorable event type draws a clause on its own family, and the folded nine draw none', () => {
    // The two new blocks are ADDRESSED, so the reader and the walker can both reach them.
    expect(DECREE_PROSE_BLOCKS['DEC-EVENT']).toBe(DECREE_EVENT_POOLS);
    expect(DECREE_PROSE_BLOCKS['DEC-PARTY']).toBe(DECREE_PARTY_DEED_POOLS);
    // The two closed vocabularies the new pool keys ARE, each named by its source.
    expect(Object.keys(DECREE_EVENT_POOLS).sort(), 'the manifest\'s own families')
      .toEqual([...VERB_FAMILIES].sort());
    expect(Object.keys(DECREE_PARTY_DEED_POOLS).sort(), 'the twelve party-impact kinds')
      .toEqual(Object.keys(PARTY_IMPACT_KINDS).sort());

    const authorable = authorableEventTypes();
    expect(authorable.length, 'forty-one typed events minus the nine folds').toBe(32);
    const homeless = authorable
      .filter((type) => !DECREE_EVENT_POOLS[AFFORDANCE_MANIFEST[type].family]);
    expect(homeless, 'every authorable type reaches a pool of the block').toEqual([]);
    for (const type of authorable) {
      const clause = scheduledEventClause(type, { seed: 'seed-a', cause: 'table' });
      expect(clause.poolKey, `${type} draws on its catalogue family`)
        .toBe(AFFORDANCE_MANIFEST[type].family);
    }
    // anchored: the loop above drew a clause for all thirty-two, so the silence below is
    // the fold closing rather than an emptied block.
    expect([...NON_AUTHORABLE_EVENTS].filter((type) => scheduledEventClause(type, { seed: 'seed-a' })),
      'and not one folded type draws a sentence').toEqual([]);

    // THE ONE SLOTTED VARIANT of the new blocks: filled it reaches the reader, unfilled it
    // shortens the clause rather than rendering its own braces.
    const realm = authorable.find((type) => AFFORDANCE_MANIFEST[type].family === 'Realm');
    const SEEDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const offenders = SEEDS.flatMap((seed) => {
      const bare = scheduledEventClause(realm, { seed, cause: 'table' });
      const filled = scheduledEventClause(realm, { seed, cause: 'table', settlement: 'Kolstad' });
      const bad = [];
      if (bare && bare.text.includes('{')) bad.push(`bare/${seed}: ${bare.text}`);
      if (filled && filled.text.includes('{')) bad.push(`filled/${seed}: ${filled.text}`);
      return bad;
    });
    expect(offenders, 'no seed renders a slot the caller never filled').toEqual([]);
    expect(SEEDS.some((seed) => scheduledEventClause(realm, { seed, cause: 'table', settlement: 'Kolstad' })
      .text.includes('Kolstad')), 'and the settlement sentence is reachable when it is filled').toBe(true);
  });

  it('U5 — the two clauses SPLICE into the line, and a clause this corpus does not hold is refused', () => {
    const realm = authorableEventTypes().find((type) => AFFORDANCE_MANIFEST[type].family === 'Realm');
    const kind = Object.keys(PARTY_IMPACT_KINDS).sort()[0];
    const drawn = { seed: 'seed-a', cause: 'party', settlement: WORLD.name };
    const scheduledEvent = scheduledEventClause(realm, drawn);
    const partyDeed = partyDeedClause(kind, drawn);
    expect([scheduledEvent, partyDeed].filter(Boolean).length, 'EM-E6 drew both clauses').toBe(2);

    const entry = entryOf();
    const line = { seed: 'seed-a', cause: 'party', scheduledEvent, partyDeed };
    /** @param {object} over the options this line is rendered with instead */
    const partsOf = (over) => decreeLineParts(entry, WORLD, { ...line, ...over }).map((p) => p.part);

    // THE SPLICE. The two clauses join the line in the reader's own order — what the party
    // already did, then what is set for a turn still to come — between how the decree
    // stands and the warnings set aside, and the prose is still the parts and only them.
    const parts = decreeLineParts(entry, WORLD, line);
    expect(parts.map((p) => p.part)).toEqual(['hand', 'form', 'standing', 'party-deed', 'event']);
    expect(parts.map((p) => p.blockId).slice(3)).toEqual(['DEC-PARTY', 'DEC-EVENT']);
    expect([parts[3].text, parts[4].text]).toEqual([partyDeed.text, scheduledEvent.text]);
    expect(everyPartIsAuthored(parts), 'every spliced clause is an authored member').toBe(true);
    expect(decreeChronicleLine(entry, WORLD, line).prose).toBe(parts.map((p) => p.text).join(' '));

    // ANCHORED: this very entry with no clause handed renders EM-E2's three parts, so every
    // absence below is the splice refusing and never the line having gone quiet.
    expect(partsOf({ scheduledEvent: undefined, partyDeed: undefined }))
      .toEqual(['hand', 'form', 'standing']);

    // ⛔ THE PLANT, which is why the splice is a corpus lookup and not a concat: a clause
    // assembled BY HAND, carrying a true address and a true vid, is refused.
    expect(partsOf({ partyDeed: { ...partyDeed, text: `${partyDeed.text} And more besides.` } }))
      .toEqual(['hand', 'form', 'standing', 'event']);
    // A true sentence of the corpus filed under the WRONG pool, block or vid is refused too.
    expect(partsOf({ partyDeed: { ...partyDeed, poolKey: 'nowhere' } }))
      .toEqual(['hand', 'form', 'standing', 'event']);
    expect(partsOf({ scheduledEvent: { ...scheduledEvent, blockId: 'DEC-HAND' } }))
      .toEqual(['hand', 'form', 'standing', 'party-deed']);
    expect(partsOf({ scheduledEvent: { ...scheduledEvent, blockId: 'constructor' } }))
      .toEqual(['hand', 'form', 'standing', 'party-deed']);
    expect(partsOf({ scheduledEvent: { ...scheduledEvent, vid: -1 } }))
      .toEqual(['hand', 'form', 'standing', 'party-deed']);
    expect(partsOf({ partyDeed: null, scheduledEvent: 'a sentence' }))
      .toEqual(['hand', 'form', 'standing']);

    // ⛔ THE CAUSE STILL SELECTS. The deed block speaks for the party alone, so under the
    // table's hand the same clause names an actor this line does not have.
    expect(partsOf({ cause: 'table' })).toEqual(['hand', 'form', 'standing', 'event']);

    // ⛔ AND THE FILL IS THIS LINE'S OWN TOWN. A clause filled with another settlement's
    // name is refused; the very same variant filled with this line's name splices.
    const SEEDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const slotSeed = SEEDS.find((seed) => scheduledEventClause(realm, { seed, cause: 'party', settlement: WORLD.name })
      .text.includes(WORLD.name));
    expect(slotSeed, 'some seed draws the one slotted event variant').toBeTruthy();
    const elsewhere = scheduledEventClause(realm, { seed: slotSeed, cause: 'party', settlement: 'Harrowmere' });
    expect(elsewhere.text.includes('Harrowmere'), 'and it really carries the other name').toBe(true);
    expect(partsOf({ scheduledEvent: elsewhere })).toEqual(['hand', 'form', 'standing', 'party-deed']);
    expect(partsOf({ scheduledEvent: scheduledEventClause(realm, { seed: slotSeed, cause: 'party', settlement: WORLD.name }) }))
      .toEqual(['hand', 'form', 'standing', 'party-deed', 'event']);

    // ⛔ EVERY POOL OF BOTH BLOCKS NOW REACHES THE LINE, which is what the splice was owed:
    // a sentence EM-E6 can draw and the line refuses is a corpus nobody reads.
    const refusedEvents = authorableEventTypes().filter((type) => !decreeLineParts(entry, WORLD, {
      seed: 'seed-a', cause: 'table', settlement: WORLD.name,
      scheduledEvent: scheduledEventClause(type, { seed: 'seed-a', cause: 'table', settlement: WORLD.name }),
    }).some((p) => p.part === 'event'));
    expect(refusedEvents, 'every authorable event type splices its clause').toEqual([]);
    const refusedDeeds = Object.keys(PARTY_IMPACT_KINDS).filter((k) => !decreeLineParts(entry, WORLD, {
      seed: 'seed-a', cause: 'party',
      partyDeed: partyDeedClause(k, { seed: 'seed-a', settlement: WORLD.name }),
    }).some((p) => p.part === 'party-deed'));
    expect(refusedDeeds, 'every party impact kind splices its deed').toEqual([]);
    expect([refusedEvents.length + authorableEventTypes().length, Object.keys(PARTY_IMPACT_KINDS).length],
      'and both catalogues really were walked').toEqual([32, 12]);
  });
});
