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
import {
  DECREE_FORMS, decreeChronicleLine, decreeForm, decreeLineParts,
} from '../../src/domain/display/stateProse/decreeProse.js';
import {
  DECREE_FOLLOWS_FROM_POOL, DECREE_FORM_POOLS, DECREE_HAND_POOLS, DECREE_LINE_CAUSES,
  DECREE_OVERRIDE_POOLS, DECREE_PROSE_BLOCKS, DECREE_STANDING_POOLS,
} from '../../src/domain/display/stateProse/decreeProsePools.js';

/** Design §20.3's three statuses, which EM-C1 §6 lands as `DECREE_STATUSES`. */
const STATUSES = ['applied', 'pending', 'withdrawn'];
/** EM-C1 §6's three authors, which it lands as `DECREE_AUTHORS`. */
const AUTHORS = ['dm', 'guard', 'surveyor'];

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
    // The four closed vocabularies the pool keys ARE, each named by its source.
    expect(Object.keys(DECREE_HAND_POOLS).sort(), 'EM-C1 §6\'s authors').toEqual(AUTHORS);
    expect(Object.keys(DECREE_STANDING_POOLS).sort(), 'design §20.3\'s statuses').toEqual(STATUSES);
    expect(Object.keys(DECREE_OVERRIDE_POOLS).sort(), 'the landed GUARD_KINDS').toEqual([...GUARD_KINDS].sort());
  });
});
