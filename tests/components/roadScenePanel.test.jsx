/** @vitest-environment jsdom */
/**
 * roadScenePanel.test.jsx — "Stage the Road" (R-7; §14/§15). Pins the SECRETS gate
 * (viewerSeesDmSecrets — an unauthenticated context is redacted, fail closed) and the
 * pick→compose→render flow (origin from the map selection + a destination pick renders the
 * composed sections). The composer's purity/zero-write is pinned in roadSceneComposer.test.js.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import RoadScenePanel, { itemLine } from '../../src/components/map/RoadScenePanel.jsx';

let STORE = {};
vi.mock('../../src/store/index.js', () => ({ useStore: selector => selector(STORE) }));
vi.mock('../../src/store', () => ({ useStore: selector => selector(STORE) }));

const IDS = ['a', 'b', 'c'];
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
const graph = ensureRegionalGraph({ edges: [{ id: 'e.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }], channels: [{ from: 'a', to: 'b', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });
const savedSettlements = [
  { id: 'a', settlement: { name: 'Aldermoor' } }, { id: 'b', settlement: { name: 'Brackwater' } }, { id: 'c', settlement: { name: 'Corley' } },
];
const campaign = {
  id: 'camp', settlementIds: IDS,
  worldState: { tick: 5, calendar: { elapsedWeeks: 5 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: {} },
  regionalGraph: graph,
};

function buildStore({ authed = true, selectedSettlementId = null } = {}) {
  return {
    savedSettlements, selectedSettlementId,
    auth: authed ? { user: { id: 'u1' } } : { user: null },
    setCreditBalance: vi.fn(),
  };
}

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('RoadScenePanel — the secrets gate (§15)', () => {
  test('an UNAUTHENTICATED context is redacted (fail closed — no pickers)', () => {
    STORE = buildStore({ authed: false });
    const { container, queryByText } = render(<RoadScenePanel campaign={campaign} />);
    expect(container.querySelector('[data-testid="road-scene-panel"]')).toBeNull();
    expect(queryByText(/Sign in to your realm/)).toBeTruthy();
  });

  test('a no-campaign context shows the calm empty note', () => {
    STORE = buildStore({ authed: true });
    const { queryByText } = render(<RoadScenePanel campaign={null} />);
    expect(queryByText(/once a campaign is live/)).toBeTruthy();
  });
});

describe('RoadScenePanel — pick → compose → render (§14)', () => {
  test('an authenticated owner sees the pickers; picking a destination renders THE ROAD', () => {
    STORE = buildStore({ authed: true, selectedSettlementId: 'a' }); // origin defaults to the map selection
    const { container, getByLabelText } = render(<RoadScenePanel campaign={campaign} />);
    expect(container.querySelector('[data-testid="road-scene-panel"]')).toBeTruthy();
    // origin pre-filled from selectedSettlementId; pick a destination.
    fireEvent.change(getByLabelText('To'), { target: { value: 'b' } });
    // THE ROAD section renders with the leg heading.
    const headings = [...container.querySelectorAll('h4')].map(h => h.textContent);
    expect(headings.some(t => /The road to Brackwater/.test(t))).toBe(true);
    // the "Dress with AI" affordance is offered.
    expect([...container.querySelectorAll('button')].some(b => /Dress with AI/.test(b.textContent))).toBe(true);
  });
});

describe('RoadScenePanel itemLine — graceful fallback, never raw JSON (finding-12)', () => {
  const JSON_CHARS = /[{}[\]"]/; // brace/bracket/quote = a JSON.stringify leak

  test('an unrecognized brief item speaks its labelled fields, never JSON', () => {
    const line = itemLine('onRoad', { kind: 'pilgrimage', at: 'Aldermoor' });
    expect(line).not.toMatch(JSON_CHARS);
    expect(line).toContain('pilgrimage');
    expect(line).toContain('Aldermoor');
  });

  test('a bare/unknown item yields a calm in-world line, not "{}"', () => {
    const line = itemLine('gates', {});
    expect(line).not.toMatch(JSON_CHARS);
    expect(line.length).toBeGreaterThan(0);
  });

  test('recognized items still render their existing lines (no regression)', () => {
    expect(itemLine('gates', { state: 'under siege', by: 'The Coalition' })).toBe('Under siege by The Coalition');
  });
});
