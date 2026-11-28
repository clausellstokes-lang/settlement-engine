/**
 * Lane DEFENSE-3, X-52 (2026-11-03): FOOD ENDURANCE, the siege reading of the stores.
 *
 * The owner, verbatim: "i think stored food should have a version or reference in defense
 * because that is a major compoenent of a siege warfare. what are your thoughts?" and then
 * "call it food endurance rather than siege endurance".
 *
 * The Defense tab carries ONE "Food endurance" line. It READS the one food record
 * (`economicState.foodSecurity.foodRecord`: storageMonths, hasGranary, grownPct) and says what
 * the stores mean under siege. It is never a second figure source: the months in store stay
 * the Economy tab's row, and this line is a door to that row. The siege arithmetic is the
 * engine's own: under siege a place keeps the share of its harvest the food writer keeps
 * (`under_siege` → productionMult 0.6), the hinterland and trade are cut, so the stores last
 * storageMonths ÷ (1 − what is still grown). The PDF's defence chapter prints the same
 * sentence from the same leaf.
 *
 * Corpus: 60 places, ten of each tier from thorp to metropolis, seeds
 * `food-endurance-<tier>-<i>`, plus six born under siege (`food-endurance-siege-<i>`), each
 * born the way the app births one (`birthConfig` after `loadGenerationLawPayloads`).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveFoodBalanceAnalysis } from '../../src/generators/economy/foodBalance.js';
import * as FACTS from '../../src/domain/defense/defenseFacts.js';
import { SIEGE_PRODUCTION_KEPT } from '../../src/data/foodImportRates.js';
import * as DD from '../../src/domain/display/defenseDisplay.js';
import { TYPE_TO_TAB, buildDossierEntityIndex, entityAnchor } from '../../src/domain/dossier/entityLinks.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import EconomicsTab from '../../src/components/new/tabs/EconomicsTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

/** @type {Array<{ seed: string, s: any }>} */
const CORPUS = [];

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (let i = 0; i < 60; i += 1) {
    const tier = TIERS[i % 6];
    const seed = `food-endurance-${tier}-${i}`;
    CORPUS.push({ seed, s: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), null, { seed }) });
  }
  for (let i = 0; i < 6; i += 1) {
    const tier = ['village', 'town', 'city'][i % 3];
    const seed = `food-endurance-siege-${i}`;
    CORPUS.push({ seed, s: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier, stressType: 'under_siege' }), null, { seed }) });
  }
}, 180_000);

/** @param {string} html @returns {string} */
const textOf = (html) => html
  .replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, '')
  .replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
/** @param {any} s */
const defenseText = (s) => textOf(renderToStaticMarkup(React.createElement(DefenseTab, { settlement: s })));
/** The same text with every element boundary a space, so sentences from two blocks never run together. @param {any} s */
const defenseBlocks = (s) => renderToStaticMarkup(React.createElement(DefenseTab, { settlement: s }))
  .replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<\/?(?:p|div|span|button|strong|section|h\d)\b[^>]*>/g, (tag) => (/^<\/?(?:span|button|strong)\b/.test(tag) ? '' : '\n'))
  .replace(/<[^>]+>/g, '\n').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
/** @param {any} s */
const recordOf = (s) => s.economicState.foodSecurity.foodRecord;

/** Text leaves of a @react-pdf element tree, calling each function component as it goes. */
function pdfText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return pdfText(node.type(node.props), out);
    return pdfText(node.props?.children, out);
  }
  return out;
}

describe('food endurance reads the one food record', () => {
  it('the corpus is real: every place has a record with months in store, and six are besieged', () => {
    expect(CORPUS).toHaveLength(66);
    expectNoSeedFailures(collectSeedFailures(CORPUS, ({ seed, s }) => {
      expect(recordOf(s).storageMonths, seed).toBeGreaterThan(0);
    }), 'every place has months in store');
    expect(CORPUS.filter(({ s }) => s.economicState.foodSecurity.hasSiege).length).toBeGreaterThanOrEqual(6);
  });

  it('defenseFactsOf(settlement).storedFoodMonths === foodRecord.storageMonths, over every place', () => {
    expectNoSeedFailures(collectSeedFailures(CORPUS, ({ seed, s }) => {
      expect(FACTS.defenseFactsOf(s).storedFoodMonths, seed).toBe(recordOf(s).storageMonths);
    }), 'storedFoodMonths is the record\'s storageMonths');
  });

  it('the siege share is the food writer\'s own under_siege multiplier, not a second tunable', () => {
    const bare = { tier: 'hamlet', settType: 'hamlet', tradeRouteAccess: 'road', stressTypes: ['under_siege'] };
    const besieged = deriveFoodBalanceAnalysis(1000, { agricultureCapacity: 1 }, [], bare);
    expect(typeof SIEGE_PRODUCTION_KEPT).toBe('number');
    expect(besieged.foodBalance.stressModifier).toBe(SIEGE_PRODUCTION_KEPT);
  });

  // T1 (soak 1000 dry run §4, adopted by the chair 2026-11-04): at 0.6 a place growing 84% or more
  // of its need kept half rations for ever under siege (404 of 1,000 never ran out). A thorp growing
  // 84% of its need, not born besieged, must run out on half rations once shut in.
  it('a thorp growing 84% of its need runs out on half rations under siege (T1)', () => {
    const thorp = { tier: 'thorp', economicState: { foodSecurity: { hasSiege: false, foodRecord: { storageMonths: 1.5, grownPct: 84, hasGranary: false } } } };
    const end = FACTS.foodEnduranceOf(thorp);
    expect(end.halfRationMonths, 'half rations must end').not.toBeNull();
    expect(end.halfRationMonths).toBeGreaterThan(0);
  });

  it('food endurance is the stores divided by the need the place cannot grow under siege', () => {
    expect(typeof FACTS.foodEnduranceOf).toBe('function');
    expectNoSeedFailures(collectSeedFailures(CORPUS, ({ seed, s }) => {
      const record = recordOf(s);
      const besieged = s.economicState.foodSecurity.hasSiege === true;
      const kept = (record.grownPct / 100) * (besieged ? 1 : SIEGE_PRODUCTION_KEPT);
      const end = FACTS.foodEnduranceOf(s);
      expect(end.storedMonths, seed).toBe(record.storageMonths);
      expect(end.hasGranary, seed).toBe(record.hasGranary);
      expect(end.keptShare, seed).toBeCloseTo(kept, 9);
      if (kept < 1) expect(end.fullRationMonths, seed).toBeCloseTo(record.storageMonths / (1 - kept), 9);
      else expect(end.fullRationMonths, seed).toBeNull();
      if (kept < 0.5) expect(end.halfRationMonths, seed).toBeCloseTo(record.storageMonths / (0.5 - kept), 9);
      else expect(end.halfRationMonths, seed).toBeNull();
      // Never fewer months than the Economy tab's stores: a siege cannot shrink what is in store.
      if (end.fullRationMonths !== null) expect(end.fullRationMonths, seed).toBeGreaterThanOrEqual(record.storageMonths);
    }), 'food endurance is the record\'s arithmetic');
  });
});

describe('the Defense tab carries one Food endurance line, and it is a door to the stores row', () => {
  it('every place\'s Defense tab prints exactly one "Food endurance" line, the leaf\'s own sentence, in words', () => {
    expect(typeof DD.foodEnduranceLine).toBe('function');
    expectNoSeedFailures(collectSeedFailures(CORPUS, ({ seed, s }) => {
      const text = defenseText(s);
      const line = DD.foodEnduranceLine(s);
      expect(line, seed).not.toBeNull();
      expect(text.match(/Food endurance:/g) || [], seed).toHaveLength(1);
      expect(text, seed).toContain(`Food endurance: ${line.sentence}`);
      // anchored: the line is on the page (toContain just above) and is a non-empty sentence
      expect(line.sentence, `${seed}: a figure printed as digits`).not.toMatch(/\d/);
      expect(line.sentence, seed).toMatch(/\bfull rations\b/);
      // The granary is named only where one stands; where none does, the line says so.
      expect(/\bthe granary\b/.test(line.sentence), seed).toBe(recordOf(s).hasGranary === true);
      expect(line.sentence.startsWith('No granary: '), seed).toBe(recordOf(s).hasGranary !== true);
    }), 'one Food endurance line per place');
  });

  // 2 + 20 (W2-A-LEAVES, 2026-11-12; the second wave's ruling, its CONDITION half): the siege figure is a
  // condition, and only a besieged place reads it in the indicative. The census counted "under siege the outlying
  // fields are lost" outside a siege in 689 of 720 towns, and the stores read as two answers to one question.
  it('2 + 20: outside a siege the line is a condition; only a besieged place reads it as fact', () => {
    expectNoSeedFailures(collectSeedFailures(CORPUS, ({ seed, s }) => {
      const sentence = DD.foodEnduranceLine(s).sentence;
      if (s.economicState.foodSecurity.hasSiege) {
        expect(sentence, seed).toMatch(/\bthe siege has taken the outlying fields\b/i);
      } else {
        expect(sentence, seed).toMatch(/\bunder siege the outlying fields would be lost\b/i);
        // anchored: the same sentence matched 'would be lost' on the line above
        expect(sentence, seed).not.toMatch(/\bare lost\b|\bcarries\b|\bcarry the\b(?<!would carry the)|\bfeeds it\b|\bstands? in reserve\b/i);
      }
    }), 'the siege figure is a condition outside a siege');
  });

  it('one fact, one home: no months figure on the Defense tab speaks of food except the Food endurance line', () => {
    const FOOD_WORDS = /\b(?:granar(?:y|ies)|stores?|rations?|food|grain|larder|harvest(?:ed)?)\b/i;
    const FIGURE = /\b(?:\d+(?:\.\d+)?|a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|a few) (?:months?|weeks?)\b|\b(?:a|two) years?\b/i;
    expectNoSeedFailures(collectSeedFailures(CORPUS, ({ seed, s }) => {
      const line = DD.foodEnduranceLine(s);
      const text = defenseBlocks(s);
      expect(text, seed).toContain(line.sentence);
      const rest = text.split(line.sentence).join('\n');
      const offenders = rest.split(/(?<=[.!?])\s+|\n+/).filter((sentence) => FIGURE.test(sentence) && FOOD_WORDS.test(sentence));
      expect(offenders, seed).toEqual([]);
      // …and it never restates the Economy tab's stores figure in the stores row's own words.
      // anchored: the same text carries the Food endurance sentence (toContain above)
      expect(text, seed).not.toMatch(/\bmonths? of grain\b|\bin household stores\b|\bmonths? in store\b/);
    }), 'no second months figure about food');
  });

  it('the stores words are an EntityLink door to the Economy tab\'s stores row, whose anchor is on that row', () => {
    expect(DD.FOOD_STORES_DOOR?.anchor).toBe(entityAnchor('stores', { id: DD.FOOD_STORES_DOOR?.id }));
    expectNoSeedFailures(collectSeedFailures(CORPUS.slice(0, 12), ({ seed, s }) => {
      const html = renderToStaticMarkup(React.createElement(DefenseTab, { settlement: s }));
      const door = DD.foodEnduranceLine(s).door;
      expect(html, seed).toContain(`data-entity-type="stores">${door}<`);
      const eco = renderToStaticMarkup(React.createElement(EconomicsTab, { settlement: s, economicState: s.economicState }));
      expect(eco, seed).toMatch(new RegExp(`id="${DD.FOOD_STORES_DOOR.anchor}"[^>]*data-testid="economics-food-stores"`));
    }), 'the door and its anchor');
  });

  it('the PDF\'s defence chapter prints the same sentence through the same leaf', () => {
    expectNoSeedFailures(collectSeedFailures(CORPUS.filter((_, i) => i % 5 === 0), ({ seed, s }) => {
      const printed = pdfText(DefenseSecurity({ settlement: s, vm: buildViewModel({ settlement: s }) })).join('');
      expect(printed, seed).toContain(`${DD.FOOD_ENDURANCE_LABEL}: ${DD.foodEnduranceLine(s).sentence}`);
    }), 'the PDF prints the same sentence');
  });

  it('the dossier entity index carries the stores entry the door resolves through: type stores, tab economics, the row\'s anchor', () => {
    // The chair's wiring for DEFENSE-3's R1: EntityLink renders the door words as plain text
    // until entityLinks.js indexes a `stores` entry (TYPE_TO_TAB and buildDossierEntityIndex).
    expect(TYPE_TO_TAB.stores).toBe('economics');
    expectNoSeedFailures(collectSeedFailures(CORPUS.slice(0, 12), ({ seed, s }) => {
      const entry = buildDossierEntityIndex(s).byId.get(DD.FOOD_STORES_DOOR.id);
      expect(entry?.type, seed).toBe('stores');
      expect(entry?.tab, seed).toBe('economics');
      expect(entry?.anchor, seed).toBe(DD.FOOD_STORES_DOOR.anchor);
    }), 'the stores entry in the index');
  });
});
