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
import {
  hasTextureDevice, presenceOf, SENSE_OF_NOUN, SENSORY_NOUNS,
} from '../../src/domain/prose/presenceMeasure.js';
import {
  plantIdOf, plantLedgerOf, REQUIRED_FIELDS, walkPlantLedger,
} from '../../src/domain/prose/plantLedger.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  loadCausalLeaf, loadChromeCopy, loadChronicle, loadCrierVoice, loadDmHooks,
  loadHeraldDisclosure, loadInstitutionGazetteer, loadNpcLadder, loadStateLeaves,
} from '../helpers/dossierCorpus.js';
import { composedFillByBlock, fillSites, unrenderedFacts } from '../helpers/dossierComposedFill.js';

/** @param {string} tier @param {string} seed */
const town = (tier, seed) => generateSettlementPipeline(
  {
    settType: tier, culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road',
  },
  null,
  { seed, customContent: {} },
);

describe('CAR 5(a) — the presence measure, three lines, reported', () => {
  it('publishes a closed, sense-partitioned lexicon', () => {
    const senses = Object.keys(SENSORY_NOUNS);
    expect(senses).toEqual(['sight', 'hearing', 'smell', 'touch', 'taste']);
    const total = senses.reduce((a, s) => a + SENSORY_NOUNS[s].length, 0);
    expect(total).toBeGreaterThan(150);
    // A noun resolves to exactly ONE sense, so the spread is a partition and not a double
    // count — the figure line 3 exists to produce is meaningless otherwise.
    for (const noun of Object.keys(SENSE_OF_NOUN)) expect(senses).toContain(SENSE_OF_NOUN[noun]);
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
      + '    so it reaches the reader as a CHOICE and never as a WORD. The figure is therefore an\n'
      + '    UPPER bound on the authoring wave\'s opportunity, not a count of facts nobody can see.\n');
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

describe('CAR 6 — D8\'s ledger walker, and the class it is waiting for', () => {
  it('derives a stable, report-only plant id and never persists it', () => {
    const plant = { text: 'The roll is short by four names.', source: 'the hall', category: 'tension' };
    expect(plantIdOf(plant)).toBe(plantIdOf({ ...plant }));
    expect(plantIdOf(plant)).not.toBe(plantIdOf({ ...plant, text: 'Something else entirely.' }));
    expect(plantIdOf(plant)).toMatch(/^tension:the hall:[0-9a-f]+$/);
  });

  it('FIRES on both D8 breaches when the class exists — the control that must red', () => {
    const both = plantLedgerOf(
      [{ text: 'a', source: 's', category: 'c', answerable: true }],
      { answers: { [plantIdOf({ text: 'a', source: 's', category: 'c' })]: 'the answer' },
        gapReasons: { [plantIdOf({ text: 'a', source: 's', category: 'c' })]: 'the reason' } },
    );
    const neither = plantLedgerOf([{ text: 'b', source: 's', category: 'c', answerable: true }]);
    expect(walkPlantLedger(both).fails[0]).toMatch(/BOTH an answer and a gap-reason/);
    expect(walkPlantLedger(neither).fails[0]).toMatch(/NEITHER an answer nor a gap-reason/);
    // And it stays silent on the lawful shape.
    const ok = plantLedgerOf(
      [{ text: 'c', source: 's', category: 'c', answerable: true }],
      { answers: { [plantIdOf({ text: 'c', source: 's', category: 'c' })]: 'answered' } },
    );
    expect(walkPlantLedger(ok).fails).toEqual([]);
    expect(ok.openShare).toBe(0);
  });

  it('over the SHIPPED product it reports NOT-EXECUTABLE and names the three missing fields', () => {
    /** @type {number[]} */
    const shares = [];
    let plants = 0;
    let answerable = 0;
    for (const tier of ['village', 'town', 'city']) {
      for (let i = 0; i < 3; i += 1) {
        const settlement = town(tier, `d8-${tier}-${i}`);
        const ledger = plantLedgerOf(collectPlotHooks(settlement, {}));
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
