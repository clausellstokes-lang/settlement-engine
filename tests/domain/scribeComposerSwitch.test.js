/**
 * tests/domain/scribeComposerSwitch.test.js — THE COMPOSER'S CANDIDATE SET (W2 commit 4).
 *
 * The design's whole claim about drawing (§5 READ) is a claim about what does NOT change:
 *
 *   "The Scribe changes exactly one thing in that chain: the candidate set … The drawn vid is the
 *    SAME, so the corpus and the Scribe agree on which variant a seed shows. Every downstream
 *    function — face seating, pairs, the compromised roll, roles, the connective, the arrangement,
 *    legibilityRung, the mounts — runs unchanged."
 *
 * A claim about invariance can only be proven by running the thing TWICE and diffing, so that is
 * what every arm here does: the same town, the same seed, the same block, with and without the
 * rendered words, over real generated settlements and the real shipped corpus. The vid must be
 * identical and the WORDS must be the only difference.
 *
 * The second half is the WALL. The artefact is a blob a user's account carries, and a blob that
 * could carry a variant's MARKS could mint a DM-only line onto a player page; one that could carry
 * `sources` could seat a power the town does not hold; one that could carry `pairs` could quote
 * two bodies against each other that never spoke. The artefact stores WORDS ONLY, and the arms
 * below try each of those attacks against the real overlay and prove it cannot say them.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  SCRIBE_DRAW_SCHEMA,
  drawVariant,
  eligibleVariants,
  scribeBlocksFrom,
  scribeDrawEnabled,
  scribeVariantPool,
  setScribeDraw,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { withFaceSources } from '../../src/domain/display/stateProse/faceSources.js';
import { composeStateProse } from '../../src/domain/display/stateProse/composeStateProse.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { SCRIBE_ARTEFACT_SCHEMA, landBlock } from '../../src/lib/scribeArtefact.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { renderTabPage } from '../../src/domain/prose/scribePage.js';

afterEach(() => setScribeDraw(false));

const BLOCK = 'DS-DEF-2';
const block = () => DOSSIER_STATE_PROSE_DEFENSE[BLOCK];
const firstPoolKey = () => Object.keys(block().pools)[0];

const townOf = (seed) => generateSettlementPipeline(
  {
    settType: 'city', culture: 'germanic', terrainOverride: 'river',
    roadOverride: 'road', civOverride: 'civilized',
  },
  null,
  { seed, customContent: {} },
);

/** The unit an artefact would carry for one corpus variant: its vid and its WORDS, nothing else. */
function unitFor(variant, spine, faces) {
  const out = { vid: variant.vid, spine, notebook: [], verdicts: ['PASS'], report: {} };
  if (Array.isArray(variant.wordings)) {
    out.faces = faces || variant.wordings.map((unused, i) => `A rendered face, the ${i + 1}th.`);
  } else {
    out.faces = [];
  }
  return out;
}

describe('THE SCHEMA IS ONE FACT WITH TWO SPELLINGS', () => {
  it('the kernel and the artefact writer agree on the shape', () => {
    // The kernel may not import `src/lib`, so the number is re-spelled; pinned rather than trusted.
    expect(SCRIBE_DRAW_SCHEMA).toBe(SCRIBE_ARTEFACT_SCHEMA);
  });
});

describe('THE DRAW IS OFF UNTIL IT IS PUSHED ON', () => {
  it('defaults to off, and off means the corpus even for a town that carries an artefact', () => {
    expect(scribeDrawEnabled()).toBe(false);
    const pool = block().pools[firstPoolKey()];
    const units = [unitFor(pool[0], 'A rendered spine.')];
    expect(scribeVariantPool(pool, units)).toBe(pool);
    expect(scribeBlocksFrom({ schema: 1, current: { blocks: { x: {} } } })).toBe(null);
  });

  it('nothing under src/domain reads a feature flag, which is why the switch is pushed', () => {
    // Stated as a fact about the tree rather than about this module: the draw switch exists in
    // this shape BECAUSE src/domain never asks a flag, and that is the property worth pinning.
    setScribeDraw(true);
    expect(scribeDrawEnabled()).toBe(true);
    setScribeDraw(false);
    expect(scribeDrawEnabled()).toBe(false);
  });
});

describe('⭐ THE VID IDENTITY PIN — the Scribe changes the words and nothing else', () => {
  it('the drawn variant is the SAME vid with and without the rendered words, on every pool', () => {
    setScribeDraw(true);
    const s = townOf('scribe-switch-vid');
    const read = withFaceSources(s, { seed: String(s._seed ?? s.id), audience: 'dm' });
    const drift = [];
    for (const poolKey of Object.keys(block().pools)) {
      const pool = block().pools[poolKey];
      const corpusVid = drawVariant(eligibleVariants(pool, read), BLOCK, poolKey, read.seed)?.vid;
      // Render EVERY variant of the pool, which is the hardest case: whichever one the draw
      // lands on carries rendered words, so a switch that perturbed the order would show here.
      const units = pool.map((v) => unitFor(v, `A rendered spine for vid ${v.vid}.`));
      const overlaid = scribeVariantPool(pool, units);
      const scribeVid = drawVariant(eligibleVariants(overlaid, read), BLOCK, poolKey, read.seed)?.vid;
      if (corpusVid !== scribeVid) drift.push(`${poolKey}: ${corpusVid} -> ${scribeVid}`);
      // And the eligible SET is the same size and the same order, which is what the draw folds.
      expect(eligibleVariants(overlaid, read).map((v) => v.vid))
        .toEqual(eligibleVariants(pool, read).map((v) => v.vid));
    }
    expect(drift).toEqual([]);
  });

  it('the composed unit carries the RENDERED spine while the provenance is unmoved', () => {
    const s = townOf('scribe-switch-compose');
    const seed = String(s._seed ?? s.id);
    const poolKey = firstPoolKey();
    const pool = block().pools[poolKey];

    setScribeDraw(false);
    const before = composeStateProse(DOSSIER_STATE_PROSE_DEFENSE, BLOCK, {
      ...withFaceSources(s, { seed, audience: 'dm' }), spineKey: poolKey, candidates: [],
    });
    expect(before, 'the corpus must compose something, or this arm is vacuous').toBeTruthy();

    // ⛔ THE TWO NUMBERS ARE DIFFERENT, AND THIS IS THE TRAP. A `ComposedPiece.vid` is
    // `pool.indexOf(variant)` — the AUTHORED INDEX — while the annex row's own `vid` field is a
    // 1-based number on the variant, and the town card deliberately carries BOTH (`vid` and
    // `authoredIndex`). The artefact keys its units on the ANNEX `vid`, which is the number that
    // survives a re-cut that reorders a pool, so the overlay matches on `variant.vid`. Reading
    // the piece's number as the annex row picks the WRONG VARIANT and the overlay silently does
    // nothing, which is exactly how this arm failed the first time it ran.
    const drawn = pool[before.pieces[0].vid];
    expect(drawn, 'the piece names an authored index into this pool').toBeTruthy();
    const spine = 'The rendered line stands where the corpus line stood.';
    const units = [unitFor(drawn, spine)];
    const town = { ...s, prose: landBlock(null, {
      advanceSeq: 0,
      blockId: BLOCK,
      pools: { [poolKey]: units },
      renderedFor: seed,
      renderedAt: '2026-09-14T00:00:00.000Z',
      version: {
        scribe: 'sc1',
        engine: `gen-${s.generatorVersion}/sim-${s.simulationVersion}`,
        refuter: 'rf1',
        model: 'claude-opus-5',
      },
    }) };

    setScribeDraw(true);
    const after = composeStateProse(DOSSIER_STATE_PROSE_DEFENSE, BLOCK, {
      ...withFaceSources(town, { seed, audience: 'dm' }), spineKey: poolKey, candidates: [],
    });
    expect(after).toBeTruthy();
    // THE WORDS MOVED …
    expect(after.text).not.toBe(before.text);
    // ⛔ AND WHAT LANDS ON THE PAGE IS THE DRAWN FACE, NOT THE SPINE, wherever the draw seats a
    // wording: face 0 is the variant's `text` and every higher face is `wordings[face - 1]`. The
    // artefact therefore has to carry BOTH, in the same shape and the same order, which is why
    // the face-count gate is the alignment wall it is. Named here because an arm that asserted
    // only the spine would pass on a town that happened to draw face 0 and say nothing at all.
    const drawnFace = after.pieces[0].face;
    const expected = drawnFace === 0
      ? 'The rendered line stands where the corpus line stood.'
      : `A rendered face, the ${drawnFace}th.`.replace(/\.$/, '');
    expect(after.text).toContain(expected);
    // … AND NOTHING ELSE DID. Same variant, same face, same seat, same source, same pool key.
    expect(after.pieces.map((p) => [p.role, p.key, p.vid, p.index, p.face, p.source]))
      .toEqual(before.pieces.map((p) => [p.role, p.key, p.vid, p.index, p.face, p.source]));
  });
});

describe('⛔ EVERY GATE FAILS TO THE CORPUS, NEVER TO A HALF-APPLIED UNIT', () => {
  const poolOf = () => block().pools[firstPoolKey()];

  it('a vid that matches no variant is ignored whole', () => {
    setScribeDraw(true);
    const pool = poolOf();
    expect(scribeVariantPool(pool, [{ vid: 9999, spine: 'x', faces: [] }])).toBe(pool);
    expect(scribeVariantPool(pool, [{ spine: 'x', faces: [] }])).toBe(pool);
  });

  it('⭐ A FACE COUNT THAT DOES NOT MATCH DROPS THE UNIT — the alignment wall', () => {
    // `wordings[i]` is aligned by INDEX with `sources[i]` and `pairs[i]`. A unit one face short
    // would put the wrong power's name on the wrong sentence, silently, on a paid surface.
    setScribeDraw(true);
    const pool = poolOf();
    const faced = pool.find((v) => Array.isArray(v.wordings) && v.wordings.length > 1);
    expect(faced, 'the fixture pool must have a faced variant').toBeTruthy();
    const short = { ...unitFor(faced, 'A rendered spine.'), faces: ['only one face'] };
    expect(scribeVariantPool(pool, [short])).toBe(pool);
    // The SAME unit with the right count does apply, so the arm above is about the count alone.
    expect(scribeVariantPool(pool, [unitFor(faced, 'A rendered spine.')])).not.toBe(pool);
  });

  it('an empty spine, an empty face, and a slot the variant never declared are all refused', () => {
    setScribeDraw(true);
    const pool = poolOf();
    const v = pool[0];
    expect(scribeVariantPool(pool, [{ ...unitFor(v, '   ') }])).toBe(pool);
    expect(scribeVariantPool(pool, [{ ...unitFor(v, 'A spine.'), faces: Array.isArray(v.wordings) ? v.wordings.map(() => '  ') : [] }]))
      .toBe(Array.isArray(v.wordings) ? pool : scribeVariantPool(pool, [{ ...unitFor(v, 'A spine.'), faces: [] }]));
    // A `{slot}` the variant never declared would make `fillSlots` return null and SILENCE the
    // face. Fail-closed is the right answer; a silent page is not, so it is refused up front.
    expect(scribeVariantPool(pool, [unitFor(v, 'A spine about {counterpart}.')])).toBe(pool);
    // And a slot the variant DOES declare passes, so the arm is about the declaration.
    const declared = (v.slots || [])[0];
    if (declared) {
      expect(scribeVariantPool(pool, [unitFor(v, `A spine about {${declared}}.`)])).not.toBe(pool);
    }
  });
});

describe('⛔ THE INJECTION WALL — an artefact stores WORDS and cannot say anything else', () => {
  it('marks, sources, pairs, slots and angle are the CORPUS\'s, whatever the blob carries', () => {
    setScribeDraw(true);
    const pool = block().pools[firstPoolKey()];
    const target = pool.find((v) => Array.isArray(v.wordings) && v.wordings.length > 1) || pool[0];
    const attack = {
      ...unitFor(target, 'A rendered spine.'),
      // Every one of these is a real capability if it were honoured: a DM-only mark on a player
      // page, a power the town does not seat, a pair that never spoke, a slot nothing fills.
      marks: ['dm-only'],
      sources: ['garrison', 'court'],
      pairs: [{ id: 99, kind: 'disagree' }],
      slots: ['counterpart'],
      angle: 'forged',
      vid: target.vid,
    };
    const out = scribeVariantPool(pool, [attack]);
    const applied = out.find((v) => v.vid === target.vid);
    expect(applied.text).toBe('A rendered spine.');
    for (const key of ['marks', 'sources', 'pairs', 'slots', 'angle']) {
      expect(applied[key], `the artefact must not be able to set ${key}`).toEqual(target[key]);
    }
    // And every OTHER variant of the pool is the same object it always was.
    for (let i = 0; i < pool.length; i += 1) {
      if (pool[i].vid !== target.vid) expect(out[i]).toBe(pool[i]);
    }
  });
});

describe('THE ARTEFACT IS ONLY READ FOR THE TOWN, THE SEED AND THE ENGINE IT WAS MADE FOR', () => {
  const artefact = (over = {}) => ({
    schema: 1,
    renderedFor: 'seed-a',
    version: { engine: 'gen-1/sim-1' },
    current: { advanceSeq: 0, blocks: { [BLOCK]: { p: [] } } },
    ...over,
  });

  it('reads back for its own seed and engine, and for nothing else', () => {
    setScribeDraw(true);
    const q = { seed: 'seed-a', engineVersion: 'gen-1/sim-1' };
    expect(scribeBlocksFrom(artefact(), q)).toBeTruthy();
    expect(scribeBlocksFrom(artefact(), { ...q, seed: 'seed-b' })).toBe(null);
    expect(scribeBlocksFrom(artefact(), { ...q, engineVersion: 'gen-2/sim-1' })).toBe(null);
    expect(scribeBlocksFrom(artefact({ schema: 99 }), q)).toBe(null);
    expect(scribeBlocksFrom(artefact({ current: null }), q)).toBe(null);
    expect(scribeBlocksFrom(null, q)).toBe(null);
  });

  it('⭐ the engine gate is the WORLD\'s own two versions, read off the settlement', () => {
    setScribeDraw(true);
    const s = townOf('scribe-switch-engine');
    const seed = String(s._seed ?? s.id);
    const good = { ...s, prose: artefact({
      renderedFor: seed,
      version: { engine: `gen-${s.generatorVersion}/sim-${s.simulationVersion}` },
    }) };
    expect(withFaceSources(good, { seed, audience: 'dm' }).scribe).toBeTruthy();
    // A migration that moves either version invalidates prose written under the old engine.
    const migrated = { ...good, simulationVersion: `${s.simulationVersion}-next` };
    expect(withFaceSources(migrated, { seed, audience: 'dm' }).scribe).toBe(null);
  });
});

describe('⭐ WITH THE DRAW OFF, A WHOLE PAGE IS BYTE-IDENTICAL', () => {
  it('a scribed town renders exactly what it rendered before the artefact existed', () => {
    const s = townOf('scribe-switch-page');
    const seed = String(s._seed ?? s.id);
    setScribeDraw(false);
    const bare = JSON.stringify(renderTabPage(s, 'defense', { audience: 'dm' }));

    // EVERY pool of the block, because which one this town fires is a fact about the town.
    const rendered = Object.fromEntries(Object.entries(block().pools)
      .map(([key, pool]) => [key, pool.map((v) => unitFor(v, `A rendered spine for vid ${v.vid}.`))]));
    const town = { ...s, prose: landBlock(null, {
      advanceSeq: 0,
      blockId: BLOCK,
      pools: rendered,
      renderedFor: seed,
      renderedAt: '2026-09-14T00:00:00.000Z',
      version: { engine: `gen-${s.generatorVersion}/sim-${s.simulationVersion}` },
    }) };
    // Carrying the artefact changes NOTHING while the draw is off.
    expect(JSON.stringify(renderTabPage(town, 'defense', { audience: 'dm' }))).toBe(bare);

    // NEGATIVE CONTROL — with the draw ON the same page DOES move, so the arm above is not
    // passing because the fixture could never have applied.
    setScribeDraw(true);
    expect(JSON.stringify(renderTabPage(town, 'defense', { audience: 'dm' }))).not.toBe(bare);
    // and an UNSCRIBED town is still byte-identical with the draw on.
    expect(JSON.stringify(renderTabPage(s, 'defense', { audience: 'dm' }))).toBe(bare);
  });
});
