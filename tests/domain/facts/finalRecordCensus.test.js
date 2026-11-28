/**
 * finalRecordCensus.test.js — SURVEY S-A's census (the chair's ruling S-A-1): on a fixed sample, no line a birth drew from
 * a declared pool, stored, and the page prints through an S-A site stands refused by the FINAL record.
 *
 * THE REPLAY. Every house description the Institutions tab and the PDF print (`institutionDescShown`) that is a member
 * of a draw-time sibling set (`DESC_VARIANT_SIBLINGS`), and every hook the collector prints (`collectPlotHooks`) that is a
 * line of a historical event's pool or a loyalty pool, is re-asked by its own declaration over `factsOf(final record)`.
 * A refused line that prints is a finding, unless no member of its sibling set is admitted (a description's slot is
 * never emptied). TARGET 0. NOT VACUOUS: the same replay over the STORED lines (what the base printed) finds the
 * measure's named refusals on this sample.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import TOWNS from '../../fixtures/surveyFinalTowns.json';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { withPublicProse } from '../../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../../src/components/new/publicProseCompose.js';
import { DESC_VARIANT_SIBLINGS } from '../../../src/data/institutionDescVariants.js';
import { HISTORICAL_EVENTS_DATA } from '../../../src/data/historyData.js';
import { NPC_FACTION_LOYALTY } from '../../../src/data/npcData.js';
import { institutionDescShown } from '../../../src/domain/display/institutionDescShown.js';
import { collectPlotHooks } from '../../../src/domain/dossier/plotHooks.js';
import { collectPlotHooksShown } from '../../../src/domain/dossier/storedHookShown.js';
import { printRecordOf } from '../../../src/domain/display/printRecord.js';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { lineText } from '../../../src/domain/facts/drawDeclared.js';
import { declarationAdmits, declarationOf } from '../../../src/domain/facts/factVocabulary.js';
import { speakTierNoun } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { tierNounFor } from '../../../src/domain/display/stateProse/weaveBlock.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SAMPLE = [
  ...TOWNS.map((t) => ({ plan: t.plan, seed: t.seed, config: t.config })),
  ...TIERS.flatMap((tier) => Array.from({ length: 5 }, (_, n) => ({ plan: 'C', seed: `dp-${tier}-${n + 100}`, config: { settType: tier } }))),
];
const HOOK_POOLS = [...HISTORICAL_EVENTS_DATA.map((d) => d.plotHooks).filter(Array.isArray), ...Object.values(NPC_FACTION_LOYALTY).filter(Array.isArray)];

/**
 * The refused-and-printed findings of one town, over the lines it prints. @param {any} town
 * @param {(inst: any) => string} descOf what prints for a house @param {string[]} hooks the hooks that print
 */
function findings(town, descOf, hooks) {
  const f = factsOf(town);
  const admits = (/** @type {unknown} */ l) => declarationAdmits(declarationOf(l), /** @type {any} */ (f)).admitted;
  const noun = tierNounFor(town.tier) ?? '';
  const out = [];
  for (const inst of town.institutions || []) {
    const shown = descOf(inst);
    if (!shown) continue;
    const set = Object.values(DESC_VARIANT_SIBLINGS).find((s) => Array.isArray(s) && s.some((l) => speakTierNoun(String(lineText(l)), noun).trim() === shown));
    if (!set) continue;
    const line = set.find((l) => speakTierNoun(String(lineText(l)), noun).trim() === shown);
    if (!admits(line) && set.some(admits)) out.push(`desc ${inst.name}: ${shown.slice(0, 60)}`);
  }
  for (const text of hooks) {
    const line = HOOK_POOLS.flatMap((p) => p).find((l) => lineText(l) === text);
    if (line && !admits(line)) out.push(`hook: ${text.slice(0, 60)}`);
  }
  return out;
}

describe('S-A census: the final record refuses no stored line the page prints (a fixed sample)', () => {
  /** @type {Array<{ id: string, town: any }>} */ const towns = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const row of SAMPLE) {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      towns.push({ id: `${row.plan}:${row.seed}`, town: withPublicProse(born, composePublicProse(born)) });
    }
  }, 600000);

  it('NOT VACUOUS: over the STORED lines (what the base printed) the replay finds the measure\'s refusals', () => {
    const stored = towns.flatMap(({ id, town }) => findings(town, (i) => (typeof i.desc === 'string' ? i.desc.trim() : ''), collectPlotHooks(town).map((h) => h.text)).map((x) => `${id} ${x}`));
    expect(stored.some((x) => x.startsWith('V:dp-metropolis-4 desc Customs house'))).toBe(true);
    expect(stored.some((x) => x.startsWith('V:dp-hamlet-12 desc Charcoal burner'))).toBe(true);
    expect(stored.some((x) => x.startsWith('C:dp-hamlet-26 hook: Someone is sabotaging both guilds'))).toBe(true);
    expect(stored.some((x) => x.startsWith('V:dp-town-107 hook: Three guards have gone missing'))).toBe(true);
  });

  it('THE TARGET: 0 refused-and-printed lines on the owner\'s page', () => {
    const printed = towns.flatMap(({ id, town }) => findings(town, (i) => institutionDescShown(i, town), collectPlotHooksShown(town).map((h) => h.text)).map((x) => `${id} ${x}`));
    expect(printed).toEqual([]);
  });

  it('THE TARGET on the PDF (S-A-2: the view model of the gated record): 0, and its lines are the owner\'s', () => {
    const printed = towns.flatMap(({ id, town }) => {
      const vm = buildViewModel({ settlement: printRecordOf(town) });
      const desc = new Map(vm.services.detailed.map((d, k) => [town.institutions[k], d.description]));
      expect(vm.hooks.all.map((h) => h.hook), id).toEqual(collectPlotHooksShown(town).map((h) => h.text));
      for (const inst of town.institutions || []) if (typeof inst.desc === 'string' && inst.desc.trim()) expect(desc.get(inst), `${id} ${inst.name}`).toBe(institutionDescShown(inst, town));
      return findings(town, (i) => String(desc.get(i) || ''), vm.hooks.all.map((h) => h.hook)).map((x) => `${id} ${x}`);
    });
    expect(printed).toEqual([]);
  });
});
