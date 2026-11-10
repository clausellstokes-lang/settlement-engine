/**
 * @vitest-environment jsdom
 *
 * READER-R1 — VALIDATION-ON-PAGE: the generator's consistency checks never render on a DM
 * surface, and a resource gap prints only where the record truly lacks the input
 * (docs/READER_R1_VALIDATION_ON_PAGE_2026-11-04.md; the chair's rulings 1-4).
 *
 * The fixtures are four soak births (`scripts/audit/soak-review/corpus.mjs :: birth`),
 * hand-trimmed to the fields the three tabs and the PDF view model read:
 *   soak1k-0  thorp, mountain, port: "Alpine Pastures is not compatible with port access."
 *   soak1k-8  village growing 102% of its food, grain a food source, "Grain surplus" exported:
 *             "Mill exists but lacks access to grain"
 *   soak1k-22 city on a river importing Grain, nearby hot_springs, salt produced:
 *             "Bakers / Public bathhouse / Salt works exists but lacks access to …"
 *   soak1k-24 besieged crossroads thorp: "2 critical issues prevent settlement survival."
 *             beside "Critical Issues (1)", and "has no dependable trade route"
 */
import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { useStore } from '../../src/store/index.js';
import BIRTHS from '../fixtures/readerValidationOnPage.births.json';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const e = React.createElement;
const clone = (x) => JSON.parse(JSON.stringify(x));

/** The validator's own sentence shapes (readerBattery.js :: validationOnPageFindings). */
const VALIDATOR = /\brequires? [a-z ]+? access\b|\bis not compatible with\b|\bexists but lacks access to\b|Consider: /;

const text = (Tab, s) => {
  const { container } = render(e(Tab, { settlement: s }));
  const t = container.textContent || '';
  cleanup();
  return t;
};

afterEach(() => { cleanup(); });

describe('ruling 1 — validation text never renders on a DM surface (non-staff viewer)', () => {
  for (const seed of Object.keys(BIRTHS)) {
    test(`${seed}: Overview, Resources and Viability print no validator sentence`, () => {
      for (const Tab of [OverviewTab, ResourcesTab, ViabilityTab]) {
        const t = text(Tab, clone(BIRTHS[seed]));
        expect(t.length, `${Tab.name} on ${seed} rendered`).toBeGreaterThan(0);
        expect(t, `${Tab.name} on ${seed}`).not.toMatch(VALIDATOR); // anchored: the line above proves the tab rendered text
      }
    });
  }

  test('soak1k-0: the structural check is gone from the Overview and from the Viability crises', () => {
    const s = clone(BIRTHS['soak1k-0']);
    expect(s.structuralViolations.map((v) => v.reason)).toContain('Alpine Pastures is not compatible with port access.');
    const overview = text(OverviewTab, s);
    const viability = text(ViabilityTab, s);
    expect([overview.length > 0, viability.length > 0], 'both tabs rendered').toEqual([true, true]);
    expect(overview).not.toContain('Structural Issues'); // anchored: the line above proves the Overview rendered text
    expect(viability).not.toContain('Structural Crises'); // anchored: the Viability tab is proven rendered two lines above
  });

  test('a staff viewer (elevated) still reads the checks, on the Viability tab\'s staff panel', () => {
    const prev = useStore.getState().auth;
    useStore.setState({ auth: { ...prev, role: 'developer' } });
    try {
      const t = text(ViabilityTab, clone(BIRTHS['soak1k-0']));
      expect(t).toContain('Generator checks (staff)');
      expect(t).toContain('Alpine Pastures is not compatible with port access.');
    } finally {
      useStore.setState({ auth: prev });
    }
  });

  test('the PDF view model carries no validator rows for the DM document', () => {
    let gapLines = 0;
    const failures = collectSeedFailures(Object.keys(BIRTHS), (seed) => {
      const vm = buildViewModel({ settlement: clone(BIRTHS[seed]), phase: 'canon' });
      expect(vm.viability.structuralViolations, seed).toEqual([]);
      expect(vm.overview.structuralSuggestions, seed).toEqual([]);
      expect(vm.resources.priorityNotes, seed).toEqual([]);
      const impacts = vm.resources.structuralGaps.map((g) => g.impact);
      gapLines += impacts.length;
      // anchored: gapLines > 0 after the collection proves the gap lists are read, not empty
      for (const impact of impacts) expect(impact, seed).not.toMatch(VALIDATOR);
    });
    expectNoSeedFailures(failures, 'every birth\'s PDF view model carries no validator row');
    expect(gapLines, 'the births carry gap lines: the negatives above are not vacuous').toBeGreaterThan(0);
  });
});

describe('ruling 2 — the verdict count and the Critical Issues list are one list', () => {
  test('soak1k-24: "2 critical issues" sits beside "Critical Issues (2)"', () => {
    // GREEN-TIP (2026-11-10, re-keyed by cause 0fc8f82d0, W2 DEF third seat #36): the verdict now speaks in the
    // town's own name ("As things stand, … will not survive.") and carries NO count; the page states the count on
    // the verdict's chip ("2 critical"), beside the list's own heading. The ruling is unchanged: the count the page
    // states and the list it shows are one list. Read off the rendered leaves, so the chip cannot be confused with
    // the heading that also contains the word.
    const { container } = render(e(ViabilityTab, { settlement: clone(BIRTHS['soak1k-24']) }));
    const t = container.textContent || '';
    const leaves = [...container.querySelectorAll('*')].filter((n) => n.children.length === 0).map((n) => (n.textContent || '').trim());
    const stated = leaves.map((x) => x.match(/^(\d+) critical$/)).find(Boolean);
    cleanup();
    const listed = t.match(/Critical Issues \((\d+)\)/);
    expect(stated?.[1]).toBe('2');
    expect(listed?.[1]).toBe(stated?.[1]);
    // anchored: the chip and the list heading are matched in this same text on the two lines above
    expect(t, 'the verdict carries no contrary count').not.toMatch(/\d+ critical issues? prevents? settlement survival/);
  });

  test('soak1k-24: the PDF lists the same critical issues the summary counts', () => {
    const vm = buildViewModel({ settlement: clone(BIRTHS['soak1k-24']), phase: 'canon' });
    expect(vm.viability.criticalIssues).toHaveLength(vm.viability.metrics.criticalIssueCount);
  });
});

describe('ruling 3 — a gap prints only when the record lacks the input', () => {
  test('soak1k-8: the mill is not short of grain in a village that grows and exports it', () => {
    const t = text(ResourcesTab, clone(BIRTHS['soak1k-8']));
    expect(t).toContain('No clay reaches the potter.'); // a true gap, in the house voice
    expect(t).not.toMatch(/Mill exists but lacks access to grain|grain reaches the mill/i); // anchored: a true gap is matched in this same text on the line above
  });

  test('soak1k-22: bakers (Grain imported), bathhouse (hot springs near), salt works (salt produced) are not gaps', () => {
    const t = text(ResourcesTab, clone(BIRTHS['soak1k-22']));
    expect(t).toContain('No grapes reach the vintner.');
    expect(t).not.toMatch(/bakers|bathhouse|salt works/i); // anchored: a true gap is matched in this same text on the line above
  });
});

test('ruling 3, the plural: "Mineral salts" exported answers the salt works (soak1k-249 / -801 at 1,000)', async () => {
  const { resourceGapLines } = await import('../../src/domain/display/validationOnPage.js');
  const s = { name: 'Saltby', config: { terrainType: 'mountain', tradeRouteAccess: 'isolated', nearbyResources: [] },
    institutions: [{ name: 'Salt works', tags: ['trade'] }],
    resourceAnalysis: { gaps: [{ chain: 'desert_salt', institution: 'Salt works', impact: 'Salt works exists but lacks access to desert_salt', severity: 'high' }] },
    economicState: { localProduction: [], primaryImports: [], primaryExports: ['Mineral salts'], foodSecurity: { foodRecord: { foodSources: [], normalImportPct: 0 } } } };
  expect(resourceGapLines(s)).toEqual([]);
  s.economicState.primaryExports = [];
  expect(resourceGapLines(s).map((g) => g.impact)).toEqual(['No salt reaches the salt works.']);
});

describe('ruling 4 — "no dependable trade route" reads the route', () => {
  test('soak1k-24: a crossroads thorp under siege has a route that is cut', () => {
    const t = text(ViabilityTab, clone(BIRTHS['soak1k-24']));
    expect(t).toContain('and its trade route is cut.');
    expect(t).not.toContain('has no dependable trade route'); // anchored: the cut route is matched in this same text on the line above
  });
});
