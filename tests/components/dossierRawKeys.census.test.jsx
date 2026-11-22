/** @vitest-environment jsdom */
/**
 * tests/components/dossierRawKeys.census.test.jsx — NO ENGINE KEY REACHES A READER.
 *
 * ── THE DEFECT CLASS (browser pass 3, 2026-09-19) ────────────────────────────────────
 * A desert town's dossier printed `oasis_water`, `camel_herds`, `desert_salt`,
 * `hot_springs_mineral`, `mountain_timber`, `warehouse_logistics`, `south_asian` and
 * `external_threat` — eight machine identifiers, on six tabs, beside the prose they belong
 * to. Every one had a dictionary that already knew its word (`resourceDisplayName`, the
 * chain's own `label`, the culture profile's `label`, the tension table) and a render site
 * that had not been threaded through it.
 *
 * ⛔ WHY THIS ARM IS A RENDER AND NOT A SOURCE GREP. `resourceLabelSeam.census.test.js`
 * pins the seam at the call sites it KNOWS about, which is the right instrument for a seam
 * that exists and the wrong one for a site nobody has threaded yet: a missing call is
 * invisible to a grep for the call. This walks the rendered page instead and convicts the
 * SHAPE — `lower_snake_case` in text a reader can see — so the next unthreaded mount reds
 * on arrival rather than waiting for a browser pass to find it.
 *
 * The rule is scoped to what a reader actually reads: `textContent`, never an attribute, so
 * the engine's `data-*` hooks, ids and keys are untouched and stay the machine vocabulary
 * they are meant to be.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';

/**
 * A lower_snake_case identifier in rendered text. Two or more segments, so an ordinary word
 * is never convicted, and lower-case only, so a deliberate proper noun cannot trip it.
 */
const ENGINE_KEY = /\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g;

/** Towns chosen to light the raw keys the pass met: a desert one, and a south-Asian one. */
const CASES = [
  ['desert', { settType: 'town', culture: 'arabic', terrainOverride: 'desert', tradeRouteAccess: 'road' }, 'raw-keys-desert'],
  ['south', { settType: 'city', culture: 'south_asian', terrainOverride: 'river', tradeRouteAccess: 'river' }, 'raw-keys-south'],
];

const settlements = new Map();
beforeAll(() => {
  for (const [name, config, seed] of CASES) {
    settlements.set(name, generateSettlementPipeline(config, null, { seed, customContent: {} }));
  }
});
afterEach(cleanup);

/** Open every closed disclosure: a raw key inside a fold is still a raw key. */
function expandAll(container) {
  for (let pass = 0; pass < 4; pass += 1) {
    const shut = [...container.querySelectorAll('[aria-expanded="false"]')];
    if (shut.length === 0) return;
    for (const b of shut) fireEvent.click(b);
  }
}

const TABS = [
  ['Economics', (s) => <EconomicsTab economicState={s.economicState} settlement={s} />],
  ['Services', (s) => <ServicesTab services={s.availableServices} settlement={s} />],
  ['Resources', (s) => <ResourcesTab settlement={s} />],
  ['Outlook', (s) => <ViabilityTab settlement={s} />],
  ['History', (s) => <HistoryTab settlement={s} />],
  ['Overview', (s) => <OverviewTab settlement={s} />],
];

/** Every key the sweep saw, for the anti-vacuity arm. */
const SEEN_TEXT = [];

describe('the dossier prints words, not the keys it stores them under', () => {
  test('no rendered tab shows a lower_snake_case engine key, on either town', () => {
    const offenders = [];
    for (const [town] of CASES) {
      const settlement = settlements.get(town);
      for (const [tab, renderFn] of TABS) {
        const { container } = render(renderFn(settlement));
        expandAll(container);
        const text = container.textContent || '';
        SEEN_TEXT.push(text);
        for (const hit of new Set(text.match(ENGINE_KEY) || [])) {
          offenders.push(`${town} / ${tab}: ${hit}`);
        }
        cleanup();
      }
    }
    expect([...new Set(offenders)]).toEqual([]);
  }, 180000);

  test('the sweep rendered real pages, so the arm above is not vacuous', () => {
    const total = SEEN_TEXT.reduce((n, t) => n + t.length, 0);
    expect(total, 'the sweep rendered almost nothing — it is testing nothing').toBeGreaterThan(20000);
    expect(SEEN_TEXT.filter((t) => t.length > 200).length,
      'most tabs rendered empty — the fixtures are not lighting the sections').toBeGreaterThan(8);
  });
});

describe('the kinds a CAMPAIGN writes, which no freshly forged town can light', () => {
  // ⛔ THE SWEEP ABOVE CANNOT REACH THIS ONE, and saying so is the point: `external_threat`
  // is written by `withCampaignHistoryEvent` when a stressor graduates during play, so a
  // generated fixture never carries it and an arm that only walked generated towns would
  // report the class cured while the played world still printed the token.
  test('an unstyled tension kind reads as a phrase on the History tab', () => {
    const s = settlements.get('desert');
    const fixture = {
      ...s,
      history: {
        ...(s.history || {}),
        currentTensions: [{
          type: 'external_threat',
          description: 'Raiders have been seen on the caravan road three times this season.',
          severity: 'major',
        }],
      },
    };
    const { container } = render(<HistoryTab settlement={fixture} />);
    expandAll(container);
    const text = container.textContent || '';
    expect(text, 'the tension section did not render').toContain('External threat');
    // anchored: the line above proves the tension rendered, so the absence is about the word.
    expect(text).not.toContain('external_threat');
    // ⭐ AND THE RECORD KEEPS THE KIND — the aftermath writer and every reader of the
    // settlement still see the token they key on.
    expect(fixture.history.currentTensions[0].type).toBe('external_threat');
    cleanup();
  }, 60000);
});
