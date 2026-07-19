/**
 * @vitest-environment jsdom
 *
 * livingBackdrop.test.jsx — THE LIVING BACKDROP (LB-c) persistence round-trip +
 * graceful degradation.
 *
 * The library dossier's background is the settlement's LAST-VIEWED map. The pane
 * (LB-a) records {view, lens} to a device-local key whenever the user switches the
 * view mode or picks a lens; the hero's SettlementDossierBackdrop (LB-b) reads that
 * key and washes the exact same map behind the dossier. These tests exercise the
 * full loop (pane writes → key → backdrop reads → identical SVG) and prove the
 * backdrop degrades to null — never a crash — on the degenerate inputs.
 */
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import SettlementMapPane from '../../src/components/townMap/SettlementMapPane.jsx';
import SettlementDossierBackdrop from '../../src/components/settlementDetail/SettlementDossierBackdrop.jsx';
import { readLastMapView, writeLastMapView } from '../../src/lib/lastMapView.js';
import {
  buildTownMapModel, buildTownMapSvg, buildTownMapPanoramaSvg, readMapEdits,
} from '../../src/domain/townMap/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

function stubMatchMedia(matches) {
  window.matchMedia = (q) => ({
    matches, media: q, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}

const SAVE_ID = 'lb-save-1';
const drawable = () => makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'lb-1' });
const WASH_SIZE = 1000;

/** Decode the backdrop <img>'s inline SVG data URI back to the raw SVG string. */
function decodedSvg(img) {
  const PREFIX = 'data:image/svg+xml;utf8,';
  const src = img.getAttribute('src') || '';
  expect(src.startsWith(PREFIX)).toBe(true);
  return decodeURIComponent(src.slice(PREFIX.length));
}

beforeEach(() => { localStorage.clear(); stubMatchMedia(true); });
afterEach(cleanup);

describe('THE LIVING BACKDROP — persistence round-trip (pane writes → hero reads)', () => {
  test('switching the map view in the pane writes the device-local key', () => {
    const { container } = render(<SettlementMapPane settlement={drawable()} canEdit={false} saveId={SAVE_ID} />);
    const toggle = container.querySelector('[data-town-view-toggle]');
    const panoramaBtn = [...toggle.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Panorama');
    fireEvent.click(panoramaBtn);
    const stored = readLastMapView(SAVE_ID);
    expect(stored).toBeTruthy();
    expect(stored.view).toBe('panorama');
    expect(localStorage.getItem('sf.lastMapView.lb-save-1')).toBeTruthy(); // exact key shape
  });

  test('picking a lens in the pane writes that lens (default view retained)', () => {
    const { container } = render(<SettlementMapPane settlement={drawable()} canEdit={false} saveId={SAVE_ID} />);
    fireEvent.click(container.querySelector('[data-town-lens="accessible"]'));
    const stored = readLastMapView(SAVE_ID);
    expect(stored.lens).toBe('accessible');
    expect(stored.view).toBe('plan');
  });

  test('the write is device-local only — no saveId ⇒ nothing persisted (never the mapEdits blob)', () => {
    const { container } = render(<SettlementMapPane settlement={drawable()} canEdit={false} saveId={null} />);
    fireEvent.click(container.querySelector('[data-town-lens="accessible"]'));
    expect(localStorage.length).toBe(0);
  });

  test('the backdrop reads the persisted {view, lens} and washes that EXACT map', () => {
    const fx = drawable();
    writeLastMapView(SAVE_ID, { view: 'panorama', lens: 'accessible' });
    const { container } = render(<SettlementDossierBackdrop settlement={fx} saveId={SAVE_ID} />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    const model = buildTownMapModel(fx, readMapEdits(fx));
    const expected = buildTownMapPanoramaSvg(model, { style: 'accessible', width: WASH_SIZE, height: WASH_SIZE });
    expect(decodedSvg(img)).toBe(expected);
  });
});

describe('THE LIVING BACKDROP — graceful degradation', () => {
  test('a settlement lacking map inputs renders null (no wash, no crash)', () => {
    writeLastMapView(SAVE_ID, { view: 'plan', lens: 'accessible' });
    const { container } = render(<SettlementDossierBackdrop settlement={{ id: 'x', name: 'Nowhere' }} saveId={SAVE_ID} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  test('no localStorage entry ⇒ the default plan wash renders (never a crash)', () => {
    const fx = drawable();
    expect(readLastMapView(SAVE_ID)).toBeNull();
    const { container } = render(<SettlementDossierBackdrop settlement={fx} saveId={SAVE_ID} />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    const model = buildTownMapModel(fx, readMapEdits(fx));
    const expected = buildTownMapSvg(model, { style: undefined, width: WASH_SIZE, height: WASH_SIZE });
    expect(decodedSvg(img)).toBe(expected); // plan view under the default lens
  });

  test('a corrupt entry degrades to the default plan wash, not a throw', () => {
    localStorage.setItem('sf.lastMapView.lb-save-1', '{not json');
    const fx = drawable();
    const { container } = render(<SettlementDossierBackdrop settlement={fx} saveId={SAVE_ID} />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    const model = buildTownMapModel(fx, readMapEdits(fx));
    expect(decodedSvg(img)).toBe(buildTownMapSvg(model, { style: undefined, width: WASH_SIZE, height: WASH_SIZE }));
  });

  test('the backdrop is inert — decorative, pointer-transparent, aria-hidden', () => {
    const { container } = render(<SettlementDossierBackdrop settlement={drawable()} saveId={SAVE_ID} />);
    const layer = container.firstChild;
    expect(layer.getAttribute('aria-hidden')).toBe('true');
    expect(layer.style.pointerEvents).toBe('none');
    expect(container.querySelector('img').getAttribute('alt')).toBe('');
  });
});
