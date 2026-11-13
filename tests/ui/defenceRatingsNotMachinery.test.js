/**
 * @vitest-environment jsdom
 *
 * defenceRatingsNotMachinery.test.js — COHERENCE-UPKEEP-5 (the owner, the chair's record 328): THE
 * PAGE SHOWS THE RATINGS, NOT THE MACHINERY. V3 changes the values of the band and the five scores,
 * never what is shown: the Defense tab renders an old record (written before V3: no parts list, no
 * standing label) and a V3 record in the same SHAPES (the same sections, the same test ids, the
 * same rows), and neither prints a part, a part's points, or a word of the model's machinery.
 * `defenseProfile.parts` stays in the record.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const e = React.createElement;
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** Calm and in crisis, small and large (fresh seeds). */
const ROWS = [['v3build-town-1', 'town', null], ['v3build-famine-city-0', 'city', 'famine'], ['v3build-hamlet-0', 'hamlet', null]];
/** Words that exist only in the record's parts list (labels, and the struck words in the model's sense). */
const MACHINERY = ['Martial will', 'held in reserve', 'more than enough', 'Paid as a', 'paid as a', 'The purse', 'Readiness full', 'Readiness at nothing',
  'Size: a small place', 'Threat: the land\'s own dangers', 'carry no more than the force', 'held to the armed bodies'];

/** @type {Array<{ key: string, v3: any, old: any }>} */
const cases = [];

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [key, tier, stress] of ROWS) {
    const cfg = stress
      ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false })
      : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier });
    const v3 = generateSettlementPipeline(cfg, null, { seed: key, customContent: {} });
    // The old record: as a save written before V3 stores it — no parts list, no standing label.
    const old = JSON.parse(JSON.stringify(v3));
    delete old.defenseProfile.parts;
    delete old.economicState.prosperityStanding;
    cases.push({ key, v3, old });
  }
}, 120000);

afterEach(() => { cleanup(); });

/** The page's shapes: every test id, every button (section) title and every heading, in order. @param {HTMLElement} c */
const shapesOf = (c) => ({
  testIds: [...c.querySelectorAll('[data-testid]')].map((n) => n.getAttribute('data-testid')),
  buttons: [...c.querySelectorAll('button')].map((n) => (n.textContent || '').trim()),
  elements: c.querySelectorAll('*').length,
});

describe('the Defense tab shows the ratings, not the machinery', () => {
  test('an old record and a V3 record render the same shapes', () => {
    for (const { key, v3, old } of cases) {
      const a = render(e(DefenseTab, { settlement: old, narrativeNote: null }));
      const oldShapes = shapesOf(a.container); const oldText = a.container.textContent;
      cleanup();
      const b = render(e(DefenseTab, { settlement: v3, narrativeNote: null }));
      expect(shapesOf(b.container), key).toEqual(oldShapes);
      expect(b.container.textContent, key).toBe(oldText);
      cleanup();
    }
  });

  test('no part, no points, no machinery word on the page — the parts stay in the record', () => {
    for (const { key, v3 } of cases) {
      expect(v3.defenseProfile.parts.length, `${key}: the record keeps its parts`).toBeGreaterThan(0);
      const { container } = render(e(DefenseTab, { settlement: v3, narrativeNote: null }));
      const text = container.textContent || '';
      expect(text.length, `${key}: the tab rendered`).toBeGreaterThan(200);
      for (const word of MACHINERY) expect(text.includes(word), `${key}: "${word}"`).toBe(false);
      expect(text.includes(String(v3.defenseProfile.readiness.score)) && !Number.isInteger(v3.defenseProfile.readiness.score), `${key}: no readiness in tenths`).toBe(false);
      cleanup();
    }
  });
});
