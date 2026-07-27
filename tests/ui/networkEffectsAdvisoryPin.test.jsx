/**
 * @vitest-environment jsdom
 *
 * networkEffectsAdvisoryPin.test.jsx — THE NETWORK-EFFECTS ADVISORY LABEL
 * (R-5b item #8; atlas owner-queue #8 / economy-family gap 1).
 *
 * THE FINDING THIS PINS. `getSettlementModifiers` totals are consumed by six
 * DISPLAY surfaces and by nothing in the engine: no generator, pulse, or event
 * handler reads them. The panel nonetheless presented them as "cascading
 * modifiers" acting on the settlement. The owner picked the honest LABEL over
 * wiring the cascade in as a declared engine input (wiring would shift every
 * same-seed golden and therefore needs an owner-signed versioned tuning change
 * under THE PROMISE; it stays a recorded future candidate, restated in the
 * panel's own comment).
 *
 * THREE PINS, in both directions:
 *   1. RENDERS — a settlement with a real link cascade shows the advisory, and
 *      it describes the panel group for assistive tech (aria-describedby join).
 *   2. ABSENT WHERE THE PANEL IS ABSENT — no sources ⇒ the panel renders
 *      nothing at all, so the advisory cannot leak into an empty view.
 *   3. SINGLE-HOME — exactly ONE file under src/ contains the string, and it is
 *      the panel module. The sibling display surfaces (the View echo, the
 *      settlements-list badge and its panel, the two PDF builders) are named
 *      explicitly and must NOT carry it: each has its own scope, and a second
 *      copy is the drift seam this pin exists to close.
 *
 * Plus a VOICE guard on the string itself (VOICE_AND_TONE §3: no em dash, no
 * exclamation point in reader-facing copy) so a later reword cannot smuggle the
 * tells past the shrink-only baselines.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import NetworkEffectsPanel, {
  NETWORK_EFFECTS_ADVISORY,
} from '../../src/components/settlementDetail/SettlementDetailNetworkEffectsPanel.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(cleanup);

// The panel reads exactly one selector (campaigns). An empty store keeps the
// implicit-neutral expansion inert so the fixture's EXPLICIT link is the only
// cause of the cascade under test.
vi.mock('../../src/store/index.js', () => {
  const state = { campaigns: [] };
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  useStore.subscribe = () => () => {};
  return { useStore };
});

/** A saved-settlement fixture in the shape buildGraph resolves links from. */
function save(id, name, neighbours = []) {
  return { id, name, settlement: { name, neighbourNetwork: neighbours, tier: 'town' }, config: {}, tier: 'town' };
}

const HOSTILE_PAIR = [
  save('a', 'Aford', [{ id: 'b', neighbourName: 'Bton', relationshipType: 'hostile' }]),
  save('b', 'Bton', [{ id: 'a', neighbourName: 'Aford', relationshipType: 'hostile' }]),
];

describe('network-effects advisory — it renders on the panel', () => {
  test('a settlement with a link cascade shows the advisory string', () => {
    const { getByText, container } = render(
      <NetworkEffectsPanel settlementId="a" saves={HOSTILE_PAIR} relColors={{}} />,
    );
    // Guard the guard: the fixture really produced a cascade, so a silently
    // empty panel can never pass this test vacuously.
    expect(container.querySelector('[role="group"]')).not.toBeNull();
    expect(getByText(NETWORK_EFFECTS_ADVISORY)).toBeTruthy();
  });

  test('the advisory describes the panel group (aria-describedby join resolves)', () => {
    const { container } = render(
      <NetworkEffectsPanel settlementId="a" saves={HOSTILE_PAIR} relColors={{}} />,
    );
    const group = container.querySelector('[role="group"]');
    const describedBy = group.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const target = container.querySelector(`#${describedBy}`);
    expect(target).not.toBeNull();
    expect(target.textContent).toBe(NETWORK_EFFECTS_ADVISORY);
  });

  test('no cascade ⇒ no panel and no advisory anywhere in the output', () => {
    const { container } = render(
      <NetworkEffectsPanel settlementId="a" saves={[save('a', 'Aford')]} relColors={{}} />,
    );
    expect(container.textContent).toBe('');
    expect(container.textContent).not.toContain(NETWORK_EFFECTS_ADVISORY);
  });
});

describe('network-effects advisory — the string has a single home', () => {
  /** Every .js/.jsx source file under src/, repo-relative. */
  function sourceFiles(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) sourceFiles(p, out);
      else if (/\.jsx?$/.test(entry)) out.push(relative(ROOT, p).replace(/\\/g, '/'));
    }
    return out;
  }

  const files = sourceFiles(join(ROOT, 'src'));
  const carriers = files.filter((rel) => readFileSync(join(ROOT, rel), 'utf8').includes(NETWORK_EFFECTS_ADVISORY));

  test('guard-the-guard: the scan really walked the source tree', () => {
    expect(files.length).toBeGreaterThan(500);
  });

  test('exactly one src/ file carries the string, and it is the panel module', () => {
    expect(carriers).toEqual(['src/components/settlementDetail/SettlementDetailNetworkEffectsPanel.jsx']);
  });

  test('the sibling display surfaces do NOT carry it', () => {
    // The other five consumers of getSettlementModifiers/getAllModifiers.
    const siblings = [
      'src/components/settlementDetail/computeNetworkEcho.js',
      'src/components/settlements/SettlementCard.jsx',
      'src/components/SettlementsPanel.jsx',
      'src/utils/generateWorldBook.js',
      'src/utils/generateCampaignPDF.js',
    ];
    for (const rel of siblings) {
      expect(files, `${rel} left the census — re-derive the consumer list`).toContain(rel);
      expect(readFileSync(join(ROOT, rel), 'utf8')).not.toContain(NETWORK_EFFECTS_ADVISORY);
    }
  });

  test('the string is VOICE-clean (no em dash, no exclamation point)', () => {
    expect(NETWORK_EFFECTS_ADVISORY).not.toContain('—');
    expect(NETWORK_EFFECTS_ADVISORY).not.toContain('!');
  });
});
