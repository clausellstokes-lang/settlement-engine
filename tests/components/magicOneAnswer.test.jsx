/** @vitest-environment jsdom */
/**
 * magicOneAnswer.test.jsx — lane MAGIC (2026-11-03): "Magic is described two ways"
 * (docs/GENERATION_ROOT_CAUSES_2026-11-02.md, appendix 3).
 *
 * The chair's rulings, each held here against FRESH generations through the app's own
 * create path (loadGenerationLawPayloads, birthConfig over DEFAULT_CONFIG, the pipeline):
 *   1. one predicate, asked once — where magic does not work no magic-grade row prints;
 *   2. one reliance reading on the view model, printed in one word by Overview, Magic and
 *      Foundations; "integral" needs a practitioner AND a dependent, never the slider alone;
 *   3. the practitioner census reads the catalogue and the NPC list, so a Hedge Witch counts.
 * The magic-off corpus is the setup panel's "No. Historical mode": magicExists false and the
 * dial at 0 (ConfigurationPanel's own write).
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDossierViewModel } from '../../src/domain/display/dossierViewModel.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { deriveMagicReliance, magicPractitioners } from '../../src/domain/magicReliance.js';
import { magicWordsFindings } from '../../src/domain/coherence/magicWordsFindings.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** The magic dials the 60-settlement corpus walks, ten per tier. */
const DIALS = [10, 30, 50, 66, 85, 100, 40, 70, 90, 20];

/** @param {object} overrides @param {string} seed */
function generate(overrides, seed) {
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...overrides }), null, { seed, customContent: {} });
}

/** @param {import('react').ReactElement} element @returns {HTMLElement} */
function mount(element) {
  return render(element).container;
}

/** @type {Array<{ seed: string, settlement: any }>} */
const OFF = [];
/** @type {Array<{ seed: string, settlement: any }>} */
const MIXED = [];

beforeAll(async () => {
  window.matchMedia = window.matchMedia || ((query) => ({
    media: query, matches: false,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
  await loadGenerationLawPayloads();
  for (const settType of TIERS) {
    for (let i = 0; i < 6; i += 1) {
      const seed = `magic-off-${settType}-${i}`;
      OFF.push({ seed, settlement: generate({ settType, magicExists: false, priorityMagic: 0 }, seed) });
    }
    for (let i = 0; i < DIALS.length; i += 1) {
      const seed = `magic-mix-${settType}-${i}`;
      MIXED.push({ seed, settlement: generate({ settType, magicExists: true, priorityMagic: DIALS[i] }, seed) });
    }
  }
}, 600_000);

afterEach(() => { cleanup(); });

/** The three tabs' rendered text for one settlement. */
function renderedText(settlement) {
  const overview = mount(<OverviewTab settlement={settlement} />).textContent;
  cleanup();
  const foundations = mount(<SubstrateTab settlement={settlement} />).textContent;
  cleanup();
  const magic = mount(<MagicTab settlement={settlement} />).textContent;
  cleanup();
  return { overview, foundations, magic };
}

describe('ruling 1 — where magic does not work, no magic-grade row prints', () => {
  test('36 magic-off settlements: Overview, Foundations and Magic carry no Magical Capability, Magical stability or role grade (0 of 36)', () => {
    expect(OFF).toHaveLength(36);
    const graded = [];
    const dark = [];
    for (const { seed, settlement } of OFF) {
      const { overview, foundations, magic } = renderedText(settlement);
      // The rows around the magic rows still render: the sections are live.
      if (!overview.includes('Economic Resilience') || !foundations.includes('Social trust')
        || !magic.includes('Magic does not function in this world')) dark.push(seed);
      if (/Magical Capability|Reliance on magic/.test(overview)
        || /Magical stability|Reliance on magic/.test(foundations)
        || /role: |Reliance on magic/.test(magic)) graded.push(seed);
    }
    expect(dark, 'every tab renders its live rows').toEqual([]);
    expect(graded, `${graded.length} of 36 magic-off settlements print a magic grade`).toEqual([]);
  });
});

describe('ruling 2 — one reliance reading, printed in one word on three tabs', () => {
  test('the view model carries magicReliance, and Overview, Magic and Foundations print its word in 60 of 60', () => {
    expect(MIXED).toHaveLength(60);
    const disagree = [];
    for (const { seed, settlement } of MIXED) {
      const { magicReliance } = deriveDossierViewModel(settlement);
      const word = magicReliance?.word;
      if (!word) { disagree.push(`${seed}: no magicReliance on the view model`); continue; }
      const overview = mount(<OverviewTab settlement={settlement} />).querySelector('[data-testid="overview-magic-reliance"]')?.textContent || '';
      cleanup();
      const foundations = mount(<SubstrateTab settlement={settlement} />).querySelector('[data-testid="substrate-magic-reliance"]')?.textContent || '';
      cleanup();
      const magic = mount(<MagicTab settlement={settlement} />).querySelector('[data-testid="magic-reliance"]')?.textContent || '';
      cleanup();
      if (![overview, foundations, magic].every((t) => t.includes(`Reliance on magic${word}`) || t.includes(`Reliance on magic: ${word}`))) {
        disagree.push(`${seed}: vm=${word} | ${overview} | ${foundations} | ${magic}`);
      }
    }
    expect(disagree).toEqual([]);
  });

  test('"integral" anywhere on the Magic tab implies at least one practitioner AND one dependent, in 60 of 60', () => {
    const unearned = [];
    let integralSeen = 0;
    for (const { seed, settlement } of MIXED) {
      const magic = mount(<MagicTab settlement={settlement} />).textContent;
      cleanup();
      if (!/integral/i.test(magic)) continue;
      integralSeen += 1;
      const r = deriveMagicReliance(settlement);
      if (!(r.practitioners.length >= 1 && r.dependents.length >= 1)) unearned.push(seed);
    }
    // The corpus reaches the top reading at all (the arm is live, not vacuous).
    expect(integralSeen).toBeGreaterThan(0);
    expect(unearned, `${unearned.length} settlements read integral without a practitioner and a dependent`).toEqual([]);
  });

  test('a planted settlement with the dial at 66 and no practitioner never reads integral', () => {
    const planted = {
      id: 'dial66', name: 'Ashby', tier: 'thorp', population: 40,
      config: { magicExists: true, priorityMagic: 66, magicLevel: 'high' },
      institutions: [{ name: 'Subsistence farming', category: 'Economy' }],
      npcs: [{ id: 'n1', name: 'Wynn Fallow', role: 'Farmer' }],
      powerStructure: { factions: [] },
      economicState: { activeChains: [
        { chainId: 'grain', label: 'Grain & Bread', magicNote: 'Arcane quickening of growth provides minor food supplement' },
        { chainId: 'spellcasting', label: 'Spellcasting Services' },
      ] },
    };
    const r = deriveMagicReliance(planted);
    expect(r.practitioners).toEqual([]);
    expect(r.dependents.length).toBe(2);
    expect(r.reading).toBe('relied-upon');
    const posture = deriveDossierViewModel(planted).magic;
    expect(posture.roleLines.length).toBe(4);
    expect(posture.roleLines.join(' | ')).not.toMatch(/integral/); // anchored: four role lines asserted on the line above
    const text = mount(<MagicTab settlement={planted} />).textContent;
    expect(text).toContain('Economic role');
    expect(text).not.toMatch(/integral/i); // anchored: the role block is asserted present on the line above
  });

  test('a planted Hedge Witch NPC counts as a practitioner', () => {
    const planted = {
      id: 'witch', name: 'Kinich Batab', tier: 'hamlet', population: 120,
      config: { magicExists: true, priorityMagic: 50, magicLevel: 'medium' },
      institutions: [{ name: 'Subsistence farming', category: 'Economy' }],
      npcs: [{ id: 'n1', name: 'Thorkel Styrkarsson', role: 'Hedge Witch' }, { id: 'n2', name: 'Ola', role: 'Farmer' }],
      powerStructure: { factions: [] },
      economicState: { activeChains: [] },
    };
    expect(magicPractitioners(planted)).toEqual(['Thorkel Styrkarsson']);
    expect(deriveMagicReliance(planted).reading).toBe('present');
    const reliance = mount(<MagicTab settlement={planted} />).querySelector('[data-testid="magic-reliance"]');
    expect(reliance?.textContent).toContain('Present');
  });
});

describe('the standalone coherence check', () => {
  test('magicWordsFindings returns [] for the 36 magic-off settlements and finds a planted magic grade row', () => {
    const flagged = [];
    for (const { seed, settlement } of OFF) {
      const { overview, foundations, magic } = renderedText(settlement);
      const findings = magicWordsFindings(settlement, `${overview}\n${foundations}\n${magic}`);
      if (findings.length) flagged.push(seed);
    }
    expect(flagged).toEqual([]);
    const { settlement } = OFF[0];
    const planted = magicWordsFindings(settlement, 'Systems Health Economic ResilienceWeak Magical CapabilityCritical');
    expect(planted.length).toBeGreaterThanOrEqual(1);
    expect(planted[0].code).toBe('MAGIC-GRADE-WHERE-MAGIC-FAILS');
  });
});
