/**
 * openerCloseAndCap.test.js — THE OPENER CLASS, THE CLOSE CLASS AND THE UNIT CAP
 * (ADDENDUM 18 rulings 29, 30, 34, 36 and 37; car 8b-W-18o).
 *
 * ⛔⛔ AND WHAT IS NOT HERE IS THE POINT OF THE FIRST ARM. Ruling 29 chartered a `SURVEY_FRAMES`
 * table and a `{survey}` slot; RULING 40 (the owner, 2026-09-13 ~13:3x — THE FAIR COPY DOES NOT
 * CITE ITSELF) struck both BEFORE THEY LANDED. A struck mechanism leaves no diff, so the first
 * arm of this file asserts the ABSENCE by name — otherwise a later seat reads ruling 29, finds
 * no frames table, and builds the thing the owner removed.
 *
 * ── THE SIX THINGS THIS FILE HOLDS ───────────────────────────────────────────────────
 *   1. THE STRIKE — no `SURVEY_FRAMES`, no `{survey}` slot, anywhere on the path.
 *   2. THE OPENER CLASSIFIER — closed, total over the whole corpus, and its seven classes
 *      driven one at a time by the owner's own examples from ruling 29.
 *   3. THE CLOSE CLASSIFIER — closed, total, ordered, with `reassurance` winning ties.
 *   4. THE ONE REFUSAL — a reassurance on a face not tagged `compromised`, and the four other
 *      tells counted and NOT refused.
 *   5. THE CAP'S ARITHMETIC (ruling 30 as softened by 37), each refusal driven by a plant.
 *   6. ZERO TEXT SHIFT — the preference answers `null` on every shipped pool, so the draw goes
 *      through `drawFace` itself, and the rendered page is byte-identical.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  CLOSE_CLASSES, OPENER_CLASSES, PAIR_HALF_SENTENCE_CAP, SIMPLE_POOL_SENTENCE_CAP,
  UNIT_SENTENCE_CAP, WEIGHED_PAIR_HALVES_TOTAL,
  closeClassOf, faceSentenceCount, openerClassOf,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { SIMPLE_POOLS, assertFaces, poolIsSimple } from '../../scripts/lib/dossier-annex-grammar.mjs';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const EVERY_FACE = [
  DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_POWER,
  DOSSIER_STATE_PROSE_WAR_FAITH, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_GENERAL,
].flatMap((corpus) => Object.entries(corpus)
  .flatMap(([blockId, block]) => Object.entries(block.pools)
    .flatMap(([poolKey, pool]) => pool.flatMap((variant) => [variant.text, ...(variant.wordings || [])]
      .map((text) => ({ blockId, poolKey, text }))))));

/** `assertFaces` over a plant, with the lawful defaults filled in. @param {object} over */
const faces = (over) => assertFaces({
  label: 'X',
  parent: { angle: 'ledger', text: 'The walls are kept.', slots: [] },
  pinnedFaceCount: 9,
  shapeOf: () => undefined,
  clauseOpeners: ['though', 'but'],
  form: 'sentence',
  sources: (over.faces || []).map(() => null),
  pairs: (over.faces || []).map(() => null),
  ...over,
});

describe('⛔⛔ RULING 40 STRUCK THE SURVEY FRAMES BEFORE THEY LANDED — the absence, asserted by name', () => {
  it('no SURVEY_FRAMES table and no `{survey}` slot exists anywhere on the path', async () => {
    const kernel = await import('../../src/domain/display/stateProse/stateProseKernel.js');
    expect(kernel.SURVEY_FRAMES, 'ruling 40 struck the table').toBeUndefined();
    expect(kernel.ROLE_SLOTS, 'and `survey` is not a role slot').not.toContain('survey');
    // THE OWNER, 2026-09-13 ~13:3x: "the survey should not refer to itself. so remove any
    // phrases such as so far as the survey can find or the survey kept … the survey is self
    // referential. we already have the public to take its place." A recorded fact cannot be
    // wrong, so citing it adds nothing; the PUBLIC (car 8b-W-18n) is the human witness that
    // takes its place, and ALL of ruling 29's variety is carried by the opener classes.
    for (const file of [
      'src/domain/display/stateProse/stateProseKernel.js',
      'src/domain/display/stateProse/composeStateProse.js',
      'scripts/lib/dossier-annex-grammar.mjs',
    ]) {
      expect(read(file), `${file} declares no frames table`).not.toMatch(/SURVEY_FRAMES\s*=/);
    }
    // And the kernel says WHY the absence is deliberate, so the next reader of ruling 29 does
    // not rebuild it. A struck mechanism leaves no diff; this is the only record there can be.
    expect(read('src/domain/display/stateProse/stateProseKernel.js'))
      .toMatch(/WHAT RULING 40 STRUCK BEFORE IT LANDED/);
  });
});

describe('THE OPENER CLASS — closed, total, and driven by the owner\'s own examples (ruling 29 II)', () => {
  it('⭐ the seven classes, one example each, from the ruling', () => {
    // The ruling's own list, verbatim where the example survives ruling 40's strike.
    expect(openerClassOf('{guild} {v:hold} that the purse bought a wall.')).toBe('attributed');
    expect(openerClassOf('By the guilds\' account the keeping is disputed.')).toBe('attributed');
    expect(openerClassOf('At the tavern they name who would turn out.')).toBe('place');
    expect(openerClassOf('On the nights the gate is barred by whoever is nearest.')).toBe('time');
    expect(openerClassOf('The stair to the walk, a drover found with stores on it.')).toBe('fronted');
    expect(openerClassOf('It is not recorded that anybody is paid for the work.')).toBe('expletive');
    expect(openerClassOf('Entered as kept, with nobody behind it.')).toBe('entry');
    expect(openerClassOf('The walls are kept and nobody stands on them.')).toBe('subject');
  });

  it('⛔ the ORDER is the semantics: an attribution is not a place, and a time is not a place', () => {
    // `by` heads both an attribution and a place; `on`, `at` and `in` head both a time and a
    // place. The order in the classifier decides, and these are the cases that decide it.
    expect(openerClassOf('By the tavern\'s account the watch is paid late.')).toBe('attributed');
    // FOUND BY THIS ARM: the first spelling tested `by the` alone and read the north gate as an
    // attribution. An attribution is told by its NOUN (account · reading · reckoning), never by
    // its preposition, and a `By` with none of those words on it is a PLACE.
    expect(openerClassOf('By the north gate the stores are stacked.')).toBe('place');
    expect(openerClassOf('At night the gate is barred.')).toBe('time');
    expect(openerClassOf('At the gate a stranger is stopped.')).toBe('place');
    expect(openerClassOf('Since the wet season nobody has mended it.')).toBe('time');
  });

  it('⚠ the FRONTED test is an approximation, and its FALSE NEGATIVE is the safe one', () => {
    // A finite verb before the comma means the head noun phrase is the SUBJECT.
    expect(openerClassOf('The walls are kept, and nobody stands on them.')).toBe('subject');
    // A fronted object with NO comma reads as `subject`. That costs the draw a preference and
    // never a refusal — NOTHING is refused on this classifier — which is why the miss is safe.
    expect(openerClassOf('The stair to the walk a drover found with stores on it.')).toBe('subject');
  });

  it('⛔ TOTAL over the whole shipped corpus, and its distribution is ruling 29\'s complaint, measured', () => {
    const tally = new Map(OPENER_CLASSES.map((c) => [c, 0]));
    for (const { blockId, poolKey, text } of EVERY_FACE) {
      const cls = openerClassOf(text);
      expect(OPENER_CLASSES, `${blockId} :: ${poolKey}`).toContain(cls);
      tally.set(cls, tally.get(cls) + 1);
    }
    expect(Object.isFrozen(OPENER_CLASSES)).toBe(true);
    // Total over anything at all, not just over prose: a classifier with a gap is a classifier
    // whose default is "throw", and the projector asserts this one at generation.
    for (const junk of ['', '   ', '{', '...', '7', null, undefined]) {
      expect(OPENER_CLASSES).toContain(openerClassOf(/** @type {never} */ (junk)));
    }
    // ⭐ THE COMPLAINT, MEASURED. The owner: "The survey finds is beginning to be repetitive".
    // More than nine faces in ten open on the subject, which is what ruling 29 is about and
    // what the block measure now has a number for.
    const subject = tally.get('subject');
    expect(subject / EVERY_FACE.length).toBeGreaterThan(0.9);
    process.stdout.write(`\n[18o] openers over ${EVERY_FACE.length} faces: ${
      OPENER_CLASSES.map((c) => `${c} ${tally.get(c)}`).join(' · ')}\n`);
  });
});

describe('THE CLOSE CLASS — §6\'s tell list gets an instrument (ruling 34)', () => {
  it('⭐ the six classes, one example each', () => {
    expect(closeClassOf('The wall is kept, which is more than the muster roll shows.')).toBe('which-tail');
    expect(closeClassOf('The purse pays for the stone, and that is the whole of it.')).toBe('summary');
    expect(closeClassOf('The households keep the wall, and not the hall.')).toBe('antithesis');
    expect(closeClassOf('The accounts balance and all is well.')).toBe('reassurance');
    expect(closeClassOf('The stone was paid for, whether by the hall or the guilds.')).toBe('question');
    expect(closeClassOf('The wall is kept up. Nobody is paid to guard it.')).toBe('plain');
  });

  it('⛔ REASSURANCE WINS A TIE, because it is the only class that is ever refused', () => {
    // Both a which-tail and a reassurance. If the which-tail won, the refusal below would be
    // evadable by adding a clause — so the order is load-bearing, not cosmetic.
    expect(closeClassOf('The purse is short, which nobody minds, and all is well.')).toBe('reassurance');
  });

  it('⛔ TOTAL over the whole shipped corpus, and NOTHING in it is a reassurance', () => {
    const tally = new Map(CLOSE_CLASSES.map((c) => [c, 0]));
    const reassurances = [];
    for (const { blockId, poolKey, text } of EVERY_FACE) {
      const cls = closeClassOf(text);
      expect(CLOSE_CLASSES, `${blockId} :: ${poolKey}`).toContain(cls);
      tally.set(cls, tally.get(cls) + 1);
      if (cls === 'reassurance') reassurances.push(`${blockId} :: ${poolKey} :: ${text}`);
    }
    expect(Object.isFrozen(CLOSE_CLASSES)).toBe(true);
    for (const junk of ['', '   ', null, undefined]) {
      expect(CLOSE_CLASSES).toContain(closeClassOf(/** @type {never} */ (junk)));
    }
    // ⭐ THE REFUSAL LANDS WITH NO CURES OWED, and this arm is the receipt for that claim: the
    // corpus that ships carries ZERO reassurance closes, so the one refusal this car adds
    // convicts nothing already written.
    expect(reassurances).toEqual([]);
    process.stdout.write(`[18o] closes over ${EVERY_FACE.length} faces: ${
      CLOSE_CLASSES.map((c) => `${c} ${tally.get(c)}`).join(' · ')}\n`);
  });
});

describe('THE GRAMMAR — one refusal on the close, and the cap\'s arithmetic', () => {
  it('⛔ a REASSURANCE is refused unless the face is tagged `compromised`', () => {
    expect(() => faces({
      faces: ['A clerk in the hall says the accounts are in order and all is well.'],
      sources: ['hall'], compromised: [false],
    })).toThrow(/closes on a REASSURANCE.*not tagged `compromised`/s);
    // ⭐ AND IT IS LAWFUL THERE, which is ruling 26 (a): the concealment is the whole point.
    expect(() => faces({
      faces: ['A clerk in the hall says the accounts are in order and all is well.'],
      sources: ['hall'], compromised: [true],
    })).not.toThrow();
  });

  it('⛔ the OTHER FOUR TELLS are counted and NEVER refused (ruling 1; ruling 35: no gate returns)', () => {
    for (const tell of [
      'The wall is kept, which is more than the muster roll shows.',
      'The purse pays for the stone, and that is the whole of it.',
      'The households keep the wall, and not the hall.',
      'The stone was paid for, whether by the hall or the guilds.',
    ]) {
      expect(() => faces({ faces: [tell], sources: ['hall'] }), tell).not.toThrow();
      expect(closeClassOf(tell)).not.toBe('plain');
    }
  });

  it('⭐ THE CAP\'S ARITHMETIC (ruling 30 as softened by 37) — a half over two, and a weighed pair over three', () => {
    expect(UNIT_SENTENCE_CAP).toBe(3);
    expect(PAIR_HALF_SENTENCE_CAP).toBe(2);
    expect(WEIGHED_PAIR_HALVES_TOTAL).toBe(2);
    expect(SIMPLE_POOL_SENTENCE_CAP).toBe(2);
    const pair = (a, b) => ({
      faces: [a, b],
      sources: ['hall', 'guild'],
      pairs: [{ id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }],
    });
    // ⛔ A HALF OVER TWO SENTENCES.
    expect(() => faces(pair('One. Two. Three.', 'One.')))
      .toThrow(/is half of pair 1 and states 3 sentences/);
    // ⭐ A 2+1 PAIR IS LAWFUL (ruling 37 softened ruling 30's hard one-each), and this is
    // exactly the shape the first v3 pool ships today.
    expect(() => faces(pair('One. Two.', 'One.'))).not.toThrow();
    // ⛔ BUT NOT WITH A WEIGHING: 2 + 1 + 1 is four in the unit.
    expect(() => faces({
      faces: ['One. Two.', 'One.', 'It may be that both are right.'],
      sources: ['hall', 'guild', 'archiver'],
      pairs: [{ id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, { id: 1, kind: 'weigh' }],
    })).toThrow(/states 2 \+ 1 sentences and carries a.*weighing row, which is 4 in the unit/s);
    // ⭐ 1 + 1 + 1 IS THREE AND IS LAWFUL.
    expect(() => faces({
      faces: ['One.', 'Two.', 'It may be that both are right.'],
      sources: ['hall', 'guild', 'archiver'],
      pairs: [{ id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, { id: 1, kind: 'weigh' }],
    })).not.toThrow();
  });

  it('⭐ the `simple` table is EMPTY, and the first v3 pool is recorded as NOT simple', () => {
    expect(SIMPLE_POOLS).toEqual([]);
    expect(poolIsSimple('DS-DEF-2', 'Invasion & War: walls with NO force')).toBe(false);
    // The judgment behind the empty table is written where the table is, not in a plan doc.
    expect(read('scripts/lib/dossier-annex-grammar.mjs')).toMatch(/is judged NOT SIMPLE/);
    // And the cap bites where the mark is set.
    expect(() => faces({ faces: ['One. Two. Three.'], simple: true }))
      .toThrow(/states 3 sentences on a `simple` pool/);
    expect(() => faces({ faces: ['One. Two.'], simple: true })).not.toThrow();
  });
});

describe('ZERO TEXT SHIFT — the preference is a NAMED no-op on every shipped pool', () => {
  it('⛔ no shipped pool can narrow, so the draw goes through `drawFace` itself', () => {
    // `preferOpener` is module-private on purpose (it is not a seam), so the property is driven
    // through the ONE thing that makes it inert: a list of fewer than two faces cannot narrow,
    // and 707 of the 708 pools carry exactly one face per variant.
    const corpora = [
      DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_POWER,
      DOSSIER_STATE_PROSE_WAR_FAITH, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_GENERAL,
    ];
    const multi = [];
    for (const corpus of corpora) {
      for (const [blockId, block] of Object.entries(corpus)) {
        for (const [poolKey, pool] of Object.entries(block.pools)) {
          for (const variant of pool) {
            if ((variant.wordings || []).length > 0) multi.push(`${blockId} :: ${poolKey}`);
          }
        }
      }
    }
    expect([...new Set(multi)]).toEqual(['DS-DEF-2 :: Invasion & War: walls with NO force']);
    // And on THAT pool the preference is still inert today, because nothing threads the page's
    // opener trail yet: `drawnOpeners` is minted empty per call, so the previous class is always
    // null and `preferOpener` returns null. Car 8b-W-18o-r threads it, and THAT car carries the
    // declared shift — this one carries none, and the page render proves it.
    expect(read('src/domain/display/stateProse/composeStateProse.js'))
      .toMatch(/if \(narrowed === null\) return drawFace\(variant, blockId, poolKey, read\.seed, read\.sources\);/);
  });

  it('⛔ and the unit counter agrees with the grammar\'s, over every shipped face', () => {
    // `faceSentenceCount` is the ONE counter — the grammar's arithmetic and the composer's
    // `unitSentences` both call it, so a pair the projector accepts cannot compose to a unit
    // the composer would report over cap for a different reason.
    for (const { text } of EVERY_FACE) {
      expect(faceSentenceCount(text)).toBeGreaterThanOrEqual(1);
      expect(faceSentenceCount(text)).toBeLessThanOrEqual(UNIT_SENTENCE_CAP);
    }
  });
});
