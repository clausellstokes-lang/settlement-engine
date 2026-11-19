/**
 * tollNamePrintedEverywhere.test.js — THE TOLL'S NAME, WHEREVER WORDS ARE MADE FROM A CHAIN (COHERENCE-AGREE-8,
 * REVIEW-AGREE-3 FINDING 1; the chair's ruling of 2026-11-12: the rename at print time).
 *
 * The crossroads toll runs on river and port towns too, and the page names it by the town's access ("River Toll —
 * River traffic", "Harbour Dues — Harbour traffic") through one leaf, `domain/display/chainPrintName.js`. The RECORD's
 * `economicState.activeChains[].label/resource` keep the catalogue's strings (the ruling: fifteen logic readers and a
 * saved world's re-derivation read them). Every OTHER place that makes words out of a chain's name or source asks the
 * leaf, whether it writes them at birth (an NPC's goal) or at print time.
 *
 * The seeds are the review's (census 720, born as `census.sh` births them): each carried "Strategic Crossroads Toll"
 * in a river or port town's NPC goals at faa20bc6c.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const CATALOGUE = /Strategic Crossroads/;
/** seed → [access, the toll's printed name] */
const SEEDS = {
  'r2r-city-8': ['river', 'River Toll'],
  'r2r-metropolis-8': ['river', 'River Toll'],
  'r2r-metropolis-49': ['port', 'Harbour Dues'],
};

/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of Object.keys(SEEDS)) {
    births[seed] = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  }
}, 180000);

describe('FINDING 1: an NPC\'s goal about the toll names the toll\'s house, and no goal names a crossroads or a chain label', () => {
  // RE-KEYED BY IDENTITY (POWERS-15, the chair's ruling of 2026-11-14 10:57 UTC, record 440: "no slot prints a chain
  // label" STANDS). POWERS-9 (8ae50a069) struck the goals' {chain} slot: a SUPPLY goal names the work through its own
  // house ("the work at {house}", `houseFill`, the house's display noun). The goal that named the catalogue's toll at
  // faa20bc6c is the goal whose intent targets the toll's chain; it now names its speaker's house AS THE ROSTER PRINTS
  // IT, a house of the toll's chain the roster holds. Measured first on the census's 720 (POWERS-15 probes toll.mjs):
  // every goal naming a toll house (toll bridge, caravaneer's post, coaching inn, customs house) names a house the
  // roster holds: none false. The protective half is unchanged: no goal names a crossroads.
  /** @type {Record<string, number>} the toll goals per seed at 0ea65f574 (r2r-metropolis-49: the toll-keeper and the customs collector) */
  const TOLL_GOALS = { 'r2r-city-8': 1, 'r2r-metropolis-8': 1, 'r2r-metropolis-49': 2 };
  for (const [seed, [access, printed]] of Object.entries(SEEDS)) {
    test(`${seed} (${access}): no goal names a crossroads or the toll's label "${printed}", and the toll's goal names its house as the roster prints it`, async () => {
      const { houseFill } = await import('../../src/generators/people/goals.js');
      const s = births[seed];
      expect(s.config.tradeRouteAccess).toBe(access);
      const toll = s.economicState.activeChains.find((c) => c.chainId === 'crossroads_trade');
      expect(toll, 'anchored: the toll runs here').toBeTruthy();
      const goals = s.npcs.flatMap((n) => [n.goal?.short, n.goal?.long]).filter(Boolean);
      expect(goals.filter((g) => CATALOGUE.test(g))).toEqual([]);
      // no slot prints a chain label: neither the catalogue's nor the access's
      expect(goals.filter((g) => g.includes(printed) || g.includes(String(toll.label)))).toEqual([]);
      // the goal that names the toll's work, by its intent's target (the identity), names the speaker's house
      const rosterNames = new Set((s.institutions || []).map((/** @type {any} */ i) => String(i.name)));
      const tollHouses = new Set(toll.processingInstitutions.map(String));
      const tollGoals = s.npcs.flatMap((/** @type {any} */ n) => ['short', 'long']
        .filter((w) => n.goal?.intent?.[w]?.target?.kind === 'chain' && n.goal.intent[w].target.id === 'crossroads_trade')
        .map((w) => ({ text: String(n.goal[w]), house: String(n.institution?.key ?? '') })));
      expect(tollGoals.length, 'anchored: the toll\'s goals of this town').toBe(TOLL_GOALS[seed]);
      for (const g of tollGoals) {
        expect(rosterNames.has(g.house), `${g.house}: the roster holds the speaker's house`).toBe(true);
        expect(tollHouses.has(g.house), `${g.house}: a house of the toll's chain`).toBe(true);
        expect(g.text, 'the goal names the house as the roster prints it').toContain(houseFill(g.house));
      }
    });
  }
});

describe('FINDING 1: the pipeline rail\'s chain receipts name the toll\'s source by the town\'s access', () => {
  // `simulationTrace[]` (economyReconcilePass) is printed by the pipeline rail: "Because of Resource: …", and the
  // cause's reason beside it
  const PRINTED_SOURCE = { river: 'River traffic', port: 'Harbour traffic' };
  for (const [seed, [access]] of Object.entries(SEEDS)) {
    test(`${seed} (${access}): no chain receipt names a crossroads, and the toll's names "${PRINTED_SOURCE[access]}"`, () => {
      const s = births[seed];
      const causes = s.simulationTrace.filter((t) => t.targetType === 'supply_chain').flatMap((t) => t.causes || []);
      expect(causes.filter((c) => CATALOGUE.test(`${c.source} ${c.reason} ${c.effect}`))).toEqual([]);
      // anchored: the toll's receipt still carries its resource cause, under the printed source
      expect(causes.some((c) => c.source === `resource.${PRINTED_SOURCE[access]}` && c.reason.startsWith(PRINTED_SOURCE[access]))).toBe(true);
    });
  }
});

describe('FINDING 1: the read-time chain projections name the toll by the town\'s access', () => {
  // `deriveSupplyChainState` is the canonical chain projection: its `name` and `dependencies` are printed by the
  // explanation rail ("… requires resource: …", "… is the supply chain for …"), the causal views, the capacity and
  // causal-state contributors and the counterfactual's labels
  const PRINTED_SOURCE = { river: 'River traffic', port: 'Harbour traffic' };
  for (const [seed, [access, printed]] of Object.entries(SEEDS)) {
    test(`${seed} (${access}): the projection, the explanation and the causal view name "${printed}", never a crossroads`, async () => {
      const { deriveAllSupplyChainStates } = await import('../../src/domain/supplyChainState.js');
      const { explainSupplyChain, entityCatalog } = await import('../../src/domain/explanation.js');
      const { deriveCausalView, supportedCausalViews } = await import('../../src/domain/causalViews.js');
      const s = births[seed];
      const toll = deriveAllSupplyChainStates(s).find((c) => c.resourceKey === 'crossroads_position');
      expect(toll, 'anchored: the toll is projected').toBeTruthy();
      expect([toll.name, toll.dependencies.find((d) => d.startsWith('resource: '))]).toEqual([printed, `resource: ${PRINTED_SOURCE[access]}`]);
      expect(toll.resource, 'the projection keeps the record\'s resource (a logic key)').toBe('Strategic Crossroads');
      const words = JSON.stringify([
        explainSupplyChain(s, toll.id),
        entityCatalog(s),
        // a view's words are its summary; its entries are the projection's data (the record's `resource` key)
        supportedCausalViews().map((v) => deriveCausalView(s, v).summary),
      ]);
      expect(words).toContain(printed);
      expect(words.match(/Strategic Crossroads[^"]*/g) || []).toEqual([]);
    });
  }
});

describe('FINDING 1: THE SWEEP — no stored string and no export of the town names a crossroads it is not', () => {
  // THE INSTRUMENT THAT LOOKS EVERYWHERE THE WORDS CAN PRINT, from the birth's side: (1) every string the record
  // stores, but the two carriers the chair's ruling keeps on the catalogue's strings (`economicState.activeChains[]
  // .label / .resource`, read by the logic readers and a saved world's re-derivation); (2) every export and composed
  // surface the town drives with no browser: the PDF document's text, the Foundry module's journals, the world
  // export and its importer's journals, the tonight sheet, the AI grounding's prompt, the daily life, the causal
  // views, and the explanation rail's envelope for every entity of the catalogue. The rendered dossier is counted on
  // the census's 720 (`census.sh`).
  /** Flatten a react-pdf element tree to its text leaves (the tests/pdf idiom: the sections are hook-free). */
  const collectText = (/** @type {any} */ node, /** @type {string[]} */ out = []) => {
    if (node == null || typeof node === 'boolean') return out;
    if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
    if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
    if (typeof node === 'object') {
      if (typeof node.type === 'function') return collectText(node.type(node.props), out);
      return collectText(node.props?.children, out);
    }
    return out;
  };
  /** Every string under a value, with its path. @param {unknown} o @param {string} p @param {[string, string][]} out */
  const strings = (o, p = '', out = []) => {
    if (typeof o === 'string') out.push([p, o]);
    else if (Array.isArray(o)) o.forEach((v, i) => strings(v, `${p}[${i}]`, out));
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) strings(v, `${p}.${k}`, out);
    return out;
  };
  const CARRIER = /^\.economicState\.activeChains\[\d+\]\.(?:label|resource)$/;
  for (const [seed, [access, printed]] of Object.entries(SEEDS)) {
    test(`${seed} (${access}): the record's strings, but its two ruled carriers, and every export name "${printed}" and no crossroads`, async () => {
      const s = births[seed];
      const all = strings(s);
      expect(all.filter(([p, v]) => CATALOGUE.test(v) && CARRIER.test(p)).length, 'anchored: the walk reads the ruled carriers').toBe(2);
      expect(all.filter(([p, v]) => CATALOGUE.test(v) && !CARRIER.test(p)).map(([p]) => p)).toEqual([]);

      const { buildViewModel } = await import('../../src/pdf/lib/viewModel.js');
      const { SettlementPDF } = await import('../../src/pdf/SettlementPDF.jsx');
      const { buildFoundryModuleFiles } = await import('../../src/foundry/moduleBuilder.js');
      const { buildWorldExport } = await import('../../src/lib/worldExport.js');
      const { buildJournalDocuments } = await import('../../foundry-module/scripts/build-journals.js');
      const { composeTonightSheet } = await import('../../src/domain/summary/tonightSheet.js');
      const { buildAiGroundingPayload, assemblePromptSections } = await import('../../src/domain/aiGrounding.js');
      const { deriveDailyLife } = await import('../../src/domain/dailyLife.js');
      const { deriveCausalView, supportedCausalViews } = await import('../../src/domain/causalViews.js');
      const { entityCatalog, explainEntity } = await import('../../src/domain/explanation.js');
      const React = (await import('react')).default;
      const vm = buildViewModel({ settlement: s });
      const surfaces = {
        pdf: collectText(React.createElement(SettlementPDF, { settlement: s })).join(' '),
        foundry: JSON.stringify(buildFoundryModuleFiles({ settlement: s, vm })),
        worldImport: JSON.stringify(buildJournalDocuments(buildWorldExport({ settlements: [{ settlement: s }] }, { variant: 'dm' }))),
        tonight: JSON.stringify(composeTonightSheet(s)),
        aiPrompt: JSON.stringify(assemblePromptSections(buildAiGroundingPayload(s))),
        dailyLife: JSON.stringify(deriveDailyLife(s)),
        causalViews: JSON.stringify(supportedCausalViews().map((v) => deriveCausalView(s, v).summary)),
        explanation: JSON.stringify(entityCatalog(s).map((ref) => explainEntity(s, ref))),
      };
      // anchored: the surfaces are live (the PDF and the Foundry journals carry the town's name; the toll prints
      // under its access's name where a surface names chains at all)
      expect(surfaces.pdf).toContain(s.name);
      expect(surfaces.foundry).toContain(s.name);
      expect(surfaces.pdf + surfaces.explanation).toContain(printed);
      const named = Object.entries(surfaces).filter(([, text]) => CATALOGUE.test(text))
        .map(([k, text]) => `${k}: ${text.slice(Math.max(0, text.search(CATALOGUE) - 60), text.search(CATALOGUE) + 60)}`);
      expect(named).toEqual([]);
    }, 120000);
  }
});
