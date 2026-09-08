/**
 * proseMeasures.walker.test.js — THE REPORT-ONLY MEASURES (cars 5 and 6).
 *
 * ⛔ NOTHING HERE GATES ANYTHING, and that is the point rather than a shortfall. Part B §13.2
 * says of the presence measure, in its own words, that every number is owed to the walker's
 * first run, that none is set, and that it is NEVER a gate on the rewrite. §912.1's count and
 * D8's ledger are the same shape: they SIZE the authoring wave, they do not license it.
 *
 * What this file asserts is therefore that the INSTRUMENTS work and that their figures are
 * printed — plus, for D8, that the arm which cannot run says exactly what it wanted.
 *
 * @see src/domain/prose/presenceMeasure.js
 * @see src/domain/prose/plantLedger.js
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  bucketAudit, hasTextureDevice, presenceOf, SENSE_OF_NOUN, SENSORY_NOUNS,
} from '../../src/domain/prose/presenceMeasure.js';
import {
  plantIdOf, plantLedgerOf, REQUIRED_FIELDS, walkPlantLedger, walkPlantLedgersAcrossSeeds,
} from '../../src/domain/prose/plantLedger.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  loadCausalLeaf, loadChromeCopy, loadChronicle, loadCrierVoice, loadDmHooks,
  loadHeraldDisclosure, loadInstitutionGazetteer, loadNpcLadder, loadStateLeaves,
} from '../helpers/dossierCorpus.js';
import { composedFillByBlock, fillSites, unrenderedFacts } from '../helpers/dossierComposedFill.js';
import { composedReadingSequence, DORMANT_POOL_KEY } from '../fixtures/composedReadingSequence.js';
import { classifyMoves, orderIdOf } from '../../src/domain/prose/moveGrammar.js';

/** @param {string} tier @param {string} seed */
const town = (tier, seed) => generateSettlementPipeline(
  {
    settType: tier, culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road',
  },
  null,
  { seed, customContent: {} },
);

describe('CAR 5(a) — the presence measure, three lines, reported', () => {
  it('publishes a closed, sense-partitioned lexicon — counted over the ARRAYS, where it can fail', () => {
    const senses = Object.keys(SENSORY_NOUNS);
    expect(senses).toEqual(['sight', 'hearing', 'smell', 'touch', 'taste']);
    const total = senses.reduce((a, s) => a + SENSORY_NOUNS[s].length, 0);
    expect(total).toBeGreaterThan(150);
    // ⛔ THE OLD ASSERTION ITERATED `SENSE_OF_NOUN`'s VALUES AND COULD NOT FAIL. That map has
    // one value per key by construction, so "every noun resolves to one of five senses" is
    // true of ANY lexicon, duplicated or not — and the lexicon WAS duplicated: 169 published
    // entries over 166 distinct nouns, with `smoke` (sight + smell), `stone` and `mud`
    // (sight + touch) in two buckets each. The count over the ARRAYS is the same question
    // asked where it can be answered wrongly, and it read 169 against 166.
    const audit = bucketAudit();
    expect(audit.entries).toBe(audit.distinct);
    expect(audit.duplicates).toEqual([]);
    console.log(`\nSENSORY LEXICON · ${audit.entries} entries / ${audit.distinct} distinct — `
      + `${Object.entries(audit.perBucket).map(([k, v]) => `${k} ${v}`).join(' · ')}\n`);
    // The resolver still agrees with the arrays, which is what makes the audit relevant to
    // the figure rather than a fact about a list.
    for (const [sense, nouns] of Object.entries(SENSORY_NOUNS)) {
      for (const noun of nouns) expect(SENSE_OF_NOUN[noun]).toBe(sense);
    }
    expect(Object.keys(SENSE_OF_NOUN)).toHaveLength(audit.distinct);
  });

  it('every module in the measures pair names the walker that enforces it, and the target EXISTS', () => {
    // ⛔ `plantLedger.js:37` ONCE NAMED A DEAD ENFORCER, `tests/lint/plantLedger.walker.test.js`,
    // which has never existed: a pointer at nothing is worse than none, because a reader
    // stops looking. Both modules now carry `@enforced-by tests/lint/proseMeasures.walker.test.js`
    // and the assertion below pins that exact target, so the dead name cannot come back — and
    // it is no longer written after a live marker, where the existence sibling read it as a
    // real pointer and convicted this header. `presenceMeasure.js` carried no tag at all.
    const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
    for (const module of ['src/domain/prose/plantLedger.js', 'src/domain/prose/presenceMeasure.js']) {
      const source = readFileSync(join(root, module), 'utf8');
      const match = /@enforced-by\s+(\S+)/.exec(source);
      expect(match, `${module} carries no @enforced-by`).toBeTruthy();
      expect(match[1]).toBe('tests/lint/proseMeasures.walker.test.js');
      // The target must exist — the whole point of the correction.
      expect(() => readFileSync(join(root, match[1]), 'utf8')).not.toThrow();
    }
  });

  it('refuses a PROPER-NOUN SLOT as texture — a name is not a thing seen', () => {
    expect(hasTextureDevice('The granary stands half full.')).toBe(true);
    expect(hasTextureDevice('{settlement} is what it was.')).toBe(false);
    // A comparison as a measurement in words counts; a simile is a NON-MOVE and is not here.
    expect(hasTextureDevice('The ditch is no deeper than a cart is wide.')).toBe(true);
  });

  it('prints the three lines for every register and for the exemplars it can reach', async () => {
    const registers = [
      ['R1 dossier state', (await loadStateLeaves()).map((e) => e.text)],
      ['R2 causal join', (await loadCausalLeaf()).map((e) => e.text)],
      ['R4b disclosure', (await loadHeraldDisclosure()).map((e) => e.text)],
      ['R5 crier voice', (await loadCrierVoice()).map((e) => e.text)],
      ['R6 npc ladder', (await loadNpcLadder()).map((e) => e.text)],
      ['R7 gazetteer', (await loadInstitutionGazetteer()).map((e) => e.text)],
      ['chronicle R12', (await loadChronicle()).map((e) => e.text)],
      ['D-d dm hooks', (await loadDmHooks()).map((e) => e.text)],
      ['R9 chrome copy', (await loadChromeCopy()).map((e) => e.text)],
    ];
    const lines = registers.map(([label, texts]) => {
      const p = presenceOf(/** @type {string[]} */ (texts));
      const shares = Object.entries(p.senseShares)
        .map(([s, v]) => `${s} ${(v * 100).toFixed(0)}%`).join(' · ');
      return `  ${String(label).padEnd(18)} sensory/100w ${String(p.sensoryNounsPerHundredWords).padStart(6)}`
        + ` · textured ${(p.texturedParagraphShare * 100).toFixed(0).padStart(3)}%`
        + ` · spread ${p.senseSpreadEntropy.toFixed(2)} bits  [${shares}]`;
    });
    console.log(`\nPRESENCE MEASURE · the estate, per register (Part B §13.2 — reported, never a gate)\n${lines.join('\n')}\n`);
    expect(lines).toHaveLength(9);
    // The measure must discriminate: a register cannot be indistinguishable from all others
    // on all three lines, or it is measuring nothing.
    const values = registers.map(([, texts]) => presenceOf(/** @type {string[]} */ (texts)).sensoryNounsPerHundredWords);
    expect(new Set(values).size).toBeGreaterThan(5);
  });
});

describe('CAR 5(b) — the unrendered-facts census, the number the authoring wave is sized from', () => {
  it('counts what each composer HOLDS against what it RENDERS AS A WORD', () => {
    const rows = unrenderedFacts();
    const held = rows.reduce((a, r) => a + r.held.length, 0);
    const rendered = rows.reduce((a, r) => a + r.rendered.length, 0);
    const lines = rows.map((r) => `  ${r.file.split('/').pop().padEnd(24)} holds ${String(r.held.length).padStart(3)}`
      + ` · renders as a word ${String(r.rendered.length).padStart(2)} · KEY-ONLY ${String(r.keyOnly.length).padStart(3)}`);
    console.log(`\nUNRENDERED-FACTS CENSUS · six composers\n${lines.join('\n')}\n`
      + `  TOTAL: holds ${held} · renders as a word ${rendered} · key-only ${held - rendered}`
      + ` (${((held - rendered) / held * 100).toFixed(0)}%)\n`
      + '  ⚠ A KEY-ONLY FACT IS NOT DARK. It chooses which authored sentence the reader meets,\n'
      + '    so it reaches the reader as a CHOICE and never as a WORD.\n'
      + '  ⛔ AND IT IS NOT AN UPPER BOUND ON THE WAVE\'S OPPORTUNITY — that framing is WITHDRAWN\n'
      + '    (SITTING §L.2 item 70; Part B §18). This is a PER-FILE reach census over six composer\n'
      + '    sources: a generated town carries 41 top-level settlement keys and the six composers\n'
      + '    name 9, so 32 top-level keys are named by no composer and are invisible to this scan\n'
      + '    by construction. The wave sizes from car 8\'s TIER TABLE (MISSING 58 · THIN 483 ·\n'
      + '    COVERED 225), and §912.1\'s condition one is discharged by those tiers, not by this.\n');
    expect(rows).toHaveLength(6);
    expect(held).toBeGreaterThan(50);
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(held);
  });
});

describe('CAR 5(c) — the licensed level-1 members per block, on the COMPOSED fill', () => {
  const OBJECT_SLOTS = ['good', 'resource', 'ruin', 'steading', 'calamity', 'asset'];
  const INSTITUTION_SLOTS = ['institution', 'seat', 'govFaction', 'governing'];
  const HISTORY_SLOTS = ['event', 'timeband_since', 'timeband_age'];

  it('re-measures the sitting\'s A12 and prints what it finds', async () => {
    const leaves = await loadStateLeaves();
    const blocks = [...new Set(leaves.map((e) => e.block))].sort();
    const byBlock = composedFillByBlock(fillSites());
    const rows = blocks.map((b) => {
      const row = byBlock.get(b);
      if (!row) return { block: b, members: null, slots: [] };
      const members = ['V1'];
      if (row.slots.some((s) => OBJECT_SLOTS.includes(s))) members.push('V4');
      if (row.slots.some((s) => INSTITUTION_SLOTS.includes(s))) members.push('V5');
      if (row.slots.some((s) => HISTORY_SLOTS.includes(s))) members.push('V7');
      return { block: b, members, slots: row.slots };
    });
    const settlementOnly = rows.filter((r) => r.slots.length === 1 && r.slots[0] === 'settlement');
    const oneMember = rows.filter((r) => r.members && r.members.length === 1);
    const noBag = rows.filter((r) => !r.members);
    console.log('\nLICENSED LEVEL-1 MEMBERS on the composed fill\n'
      + `  blocks ${blocks.length} · settlement-ONLY bag ${settlementOnly.length} · no bag at all ${noBag.length}\n`
      + `  licensing ONE member (the bare PRESENT): ${oneMember.length}\n`
      + `  licensing two or more:                   ${rows.filter((r) => r.members && r.members.length > 1).length}\n`
      + '  NOT-EXECUTABLE on every block today: V2 (no structural-consequence field),\n'
      + '    V3 / V8 (no typed none-exists or not-held field), V6 (no typed unresolved /\n'
      + '    contested / pending STATE field — SITTING A12)\n'
      + `  settlement-only blocks: ${settlementOnly.map((r) => r.block).join(', ')}\n`);
    expect(blocks).toHaveLength(68);
    // ⚠ THE SITTING'S A12 SAYS "20 of 68 settlement-only". This lane measures TWENTY-TWO by a
    // different method (resolving every composer bag from source). The list is printed above
    // so the chair can diff it rather than take either number on trust.
    expect(settlementOnly.length).toBe(22);
    expect(oneMember.length).toBe(33);
  });
});

describe('CAR 9 — THE COMPOSED READING SEQUENCE, with every reading the shipped caller passes', () => {
  it('reaches MORE THAN ONE COMPOSER and MORE THAN SEVEN BLOCKS — the sequence SITTING K.2 was priced from did neither', () => {
    const run = composedReadingSequence(3);
    console.log(`\nCOMPOSED READING SEQUENCE · 3 towns, six desks\n`
      + `  composers reached: ${run.composers.length} — ${run.composers.join(', ')}\n`
      + `  provenance rungs ${run.rungs.length} · bare general-desk sentences ${run.bare.length}`
      + ` · LINES ${run.lines.length}\n`
      + `  distinct blocks fired: ${run.blocks.length} of 68\n`
      + `  draws from the DORMANT pool key: ${run.dormantDraws}\n`
      + `  desk throws: ${Object.keys(run.deskThrows).length ? JSON.stringify(run.deskThrows) : 'none'}\n`);
    // The first cut executed 29 lines, ALL 29 from `powerStateProse`, over 7 blocks of 68.
    expect(run.composers.length).toBeGreaterThan(1);
    expect(run.blocks.length).toBeGreaterThan(7);
    // The general desk's BARE STRINGS are harvested — the half a provenance walk cannot see.
    expect(run.bare.length).toBeGreaterThan(0);
    expect(run.composers).toContain('generalDeskLines (bare strings)');
    // Nothing throws: a sequence that swallowed a desk error would report a short reading as
    // a finding about the corpus.
    expect(run.deskThrows).toEqual({});
  });

  it('the DORMANT draw is a fact about the WORLD, and the limb is executable in both directions', () => {
    // A headless generated town carries no politics ledger — the layer is written during
    // play — so DS-POW-7 draws the absence pool on every seed even with the REAL reading
    // passed. That is the product's state, not the probe's artefact, and the only way to
    // show the pool key moves is to give the world the ledger it lacks.
    const fresh = composedReadingSequence(3);
    const materialised = composedReadingSequence(3, { materialisePolitics: true });
    expect(fresh.dormantDraws).toBe(3);
    // anchored: the line above proves the pool IS drawn, so the zero below is the ledger's
    // doing and not a dead arm
    expect(materialised.dormantDraws).toBe(0);
    expect(DORMANT_POOL_KEY).toContain('DORMANT');
  });

  it('re-measures SITTING K.2\'s V1 share and run rate on the SIX-DESK sequence', () => {
    const run = composedReadingSequence(3);
    const orders = run.lines.map((t) => orderIdOf(classifyMoves(t)) || classifyMoves(t).join('→'));
    const v1 = orders.filter((o) => String(o).split('|').includes('V1')).length;
    let repeats = 0;
    for (let i = 1; i < orders.length; i += 1) if (orders[i] === orders[i - 1]) repeats += 1;
    const share = v1 / orders.length;
    const runRate = repeats / (orders.length - 1);
    console.log(`\nK.2 RE-MEASURED · 3 towns (the 200-town run is $SC/instr-912/reading-sequence-9.mjs)\n`
      + `  V1 share ${share.toFixed(4)} (${v1} of ${orders.length}) · run rate ${runRate.toFixed(4)}\n`
      + `  distinct orders n = ${new Set(orders).size}\n`
      + `  K.2 carried 0.784 / 0.618 from ONE desk over 7 blocks; the 200-town six-desk figures\n`
      + `  are 0.8650 / 0.7525 over 19,047 lines and are now in Part B §18.\n`);
    // The finding survives the correction and is SHARPER: V1 dominates the whole dossier,
    // not just the power desk. The bound is asserted loosely because the wave will move it.
    expect(share).toBeGreaterThan(0.5);
    expect(runRate).toBeGreaterThan(0.5);
    expect(new Set(orders).size).toBeGreaterThan(3);
  });
});

describe('CAR 6 — D8\'s ledger walker, and the class it is waiting for', () => {
  it('derives a stable, report-only plant id and never persists it', () => {
    const plant = { text: 'The roll is short by four names.', source: 'the hall', category: 'tension' };
    expect(plantIdOf(plant)).toBe(plantIdOf({ ...plant }));
    expect(plantIdOf(plant)).not.toBe(plantIdOf({ ...plant, text: 'Something else entirely.' }));
    expect(plantIdOf(plant)).toMatch(/^tension:the hall:[0-9a-f]+$/);
  });

  it('FIRES on both D8 breaches when the class exists — the control that must red', () => {
    const id = (text) => plantIdOf({ text, source: 's', category: 'c' });
    const plant = (text) => ({ text, source: 's', category: 'c', answerable: true });
    const both = plantLedgerOf([plant('a')], {
      answers: { [id('a')]: 'the answer' }, gapReasons: { [id('a')]: 'the reason' },
    });
    const neither = plantLedgerOf([plant('b')]);
    expect(walkPlantLedger(both).fails[0]).toMatch(/BOTH an answer and a gap-reason/);
    expect(walkPlantLedger(neither).fails[0]).toMatch(/NEITHER an answer nor a gap-reason/);
    // ⛔ AND THE OPEN SHARE ON THAT SAME PLANT USED TO READ −1. `(answerable − answered −
    // withGap)` subtracts a plant carrying BOTH channels twice, so a single such plant put
    // the share outside [0, 1] — a number any future arm would have read as a rate. It is
    // counted CLOSED ONCE, and the double-channel defect is reported by the arm above rather
    // than smuggled into the arithmetic.
    expect(both.openShare).toBeGreaterThanOrEqual(0);
    expect(both.openShare).toBeLessThanOrEqual(1);
    expect(both.closed).toBe(1);
    // THE LAWFUL SHAPE: two plants, one answered and one named OPEN with a reason. Every arm
    // silent — which is what makes the fails above findings rather than noise.
    const lawful = plantLedgerOf([plant('c'), plant('d')], {
      answers: { [id('c')]: 'answered' }, gapReasons: { [id('d')]: 'why it stays open' },
    });
    expect(walkPlantLedger(lawful).fails).toEqual([]);
    expect(lawful.openShare).toBe(0);
    expect(lawful.namedOpenShare).toBe(0.5);
  });

  it('D8\'s OPEN-SHARE arm ships behind a CLASS-EXISTENCE GUARD, and fails once the class exists', () => {
    // Part B §18 / SITTING §L.2 item 72(i): the walker REPORTS while no plant class exists in
    // the shipped corpus and FAILS on a zero or constant open share once any plant is
    // authored. Car 6 claimed a constant share was "exactly the condition D8's walker is
    // designed to fail on" and the walker had no open-share arm in either direction; an
    // executed control at open share 0 returned `fails []`. It is code now, not a sentence.
    const id = (text) => plantIdOf({ text, source: 's', category: 'c' });
    const plant = (text) => ({ text, source: 's', category: 'c', answerable: true });
    // GUARD SHUT — no answerable plant: the arm is silent AND says why.
    const noClass = plantLedgerOf([{ text: 'z', source: 's', category: 'c' }]);
    expect(walkPlantLedger(noClass).fails).toEqual([]);
    expect(walkPlantLedger(noClass).notExecutable).toHaveLength(1);
    // GUARD OPEN, NOTHING NAMED OPEN: the arm FAILS.
    const nothingOpen = plantLedgerOf([plant('c')], { answers: { [id('c')]: 'answered' } });
    expect(nothingOpen.namedOpenShare).toBe(0);
    expect(walkPlantLedger(nothingOpen).fails.join(' ')).toMatch(/nothing is named OPEN/);
    // THE CROSS-SEED LIMB, which one ledger cannot see and car 6 reported as though it had.
    const seedA = plantLedgerOf([plant('c'), plant('d')], {
      answers: { [id('c')]: 'a' }, gapReasons: { [id('d')]: 'w' },
    });
    const seedB = plantLedgerOf([plant('e'), plant('f')], {
      answers: { [id('e')]: 'a' }, gapReasons: { [id('f')]: 'w' },
    });
    const seedC = plantLedgerOf([plant('g'), plant('h'), plant('i')], {
      answers: { [id('g')]: 'a', [id('h')]: 'b' }, gapReasons: { [id('i')]: 'w' },
    });
    // CONSTANT across seeds → FAIL.
    expect(walkPlantLedgersAcrossSeeds([seedA, seedB]).fails.join(' ')).toMatch(/on all 2 seeds/);
    // VARYING across seeds → a note, never a fail.
    expect(walkPlantLedgersAcrossSeeds([seedA, seedC]).fails).toEqual([]);
    expect(walkPlantLedgersAcrossSeeds([seedA, seedC]).notes.join(' ')).toMatch(/varies across 2 seeds/);
    // FEWER THAN TWO LEDGERS CARRYING THE CLASS → NOT-EXECUTABLE, never a pass.
    expect(walkPlantLedgersAcrossSeeds([noClass, noClass]).notExecutable).toHaveLength(1);
    expect(walkPlantLedgersAcrossSeeds([noClass, noClass]).fails).toEqual([]);
  });

  it('over the SHIPPED product it reports NOT-EXECUTABLE and names the three missing fields', () => {
    /** @type {number[]} */
    const shares = [];
    /** @type {Array<ReturnType<typeof plantLedgerOf>>} */
    const ledgers = [];
    let plants = 0;
    let answerable = 0;
    for (const tier of ['village', 'town', 'city']) {
      for (let i = 0; i < 3; i += 1) {
        const settlement = town(tier, `d8-${tier}-${i}`);
        const ledger = plantLedgerOf(collectPlotHooks(settlement, {}));
        ledgers.push(ledger);
        plants += ledger.rows.length;
        answerable += ledger.answerable;
        shares.push(ledger.openShare === null ? 1 : ledger.openShare);
        const walk = walkPlantLedger(ledger);
        // D8's arm fails on a zero or CONSTANT open share ONLY ONCE THE CLASS EXISTS. It does
        // not exist, so the arm must report rather than fail — on every town.
        expect(walk.fails).toEqual([]);
        expect(walk.notExecutable).toHaveLength(1);
        expect(walk.notExecutable[0]).toContain('answerable');
      }
    }
    // The cross-seed limb over the same nine towns: NOT-EXECUTABLE, because none of the nine
    // carries the class at all. It is the same §908 law one level up.
    const across = walkPlantLedgersAcrossSeeds(ledgers);
    expect(across.fails).toEqual([]);
    expect(across.notExecutable).toHaveLength(1);
    expect(across.notExecutable[0]).toContain('cross-seed limb');
    console.log('\nD8 PLANT LEDGER · nine settlements over three tiers\n'
      + `  plants enumerated:            ${plants}\n`
      + `  plants carrying \`answerable\`: ${answerable}\n`
      + '  open share:                   NOT MEASURABLE — no plant is marked answerable, so the\n'
      + '                                share is a fact about the missing class, not about a town\n'
      + `  fields the arm wants:\n${REQUIRED_FIELDS.map((f) => `    · ${f}`).join('\n')}\n`);
    expect(plants).toBeGreaterThan(100);
    // The finding, asserted: no plant in the shipped product is answerable.
    expect(answerable).toBe(0);
  });

  it('reports duplicate-folding plants rather than silently merging them', () => {
    const twin = { text: 'the same line', source: 's', category: 'c' };
    const ledger = plantLedgerOf([twin, { ...twin }]);
    expect(ledger.duplicates).toHaveLength(1);
    expect(walkPlantLedger(ledger).notes[0]).toMatch(/two plants fold to one derived id/);
  });
});
