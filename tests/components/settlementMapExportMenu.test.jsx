/**
 * @vitest-environment jsdom
 *
 * settlementMapExportMenu.test.jsx — the per-settlement export menu GATE wiring
 * (MAP EXPORTS). The menu renders EVERY format control under a SINGLE
 * resolveExportAccess decision (the $2.99 per-settlement export bundle — owner
 * ruling), so "one purchase ⇒ every format" is verified by the wiring:
 *   • entitled saved settlement → all image + tabletop formats appear together;
 *   • premium / elevated tier → unlocked freely (no durable right needed);
 *   • free + un-entitled → the BuyThisDossier UNLOCK rung (the pricing moment),
 *     and NONE of the format buttons.
 * (The anon/gallery no-export rule is enforced upstream: the pane only mounts this
 * for a saved settlement — saveId present — and PublicDossierView passes null.)
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeRef.current) }));
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true }));

import SettlementMapExportMenu from '../../src/components/townMap/SettlementMapExportMenu.jsx';

const FIX = { name: 'Testburg', tier: 'wanderer' };
const openMenu = () => fireEvent.click(screen.getByRole('button', { name: /export this settlement map/i }));

describe('SettlementMapExportMenu — the export-bundle gate', () => {
  test('entitled saved settlement: one flag unlocks every image + tabletop format', () => {
    storeRef.current = {
      auth: { tier: 'wanderer' },
      isElevated: () => false,
      canExport: () => false,
      dossierEntitlements: { s1: true },   // durable right held ⇒ unlocked
      refreshDossierEntitlement: () => {},
    };
    render(<SettlementMapExportMenu settlement={FIX} saveId="s1" style="parchment" />);
    openMenu();
    for (const re of [
      /download this map as svg/i,
      /download this map as png/i,
      /download this map as jpeg/i,
      /download this map as webp/i,
      /token-resolution battlemap/i,   // the VTT token PNG
      /single-page pdf/i,
    ]) {
      expect(screen.getByRole('button', { name: re })).toBeTruthy();
    }
  });

  test('premium tier unlocks exports freely (no durable right needed)', () => {
    storeRef.current = {
      auth: { tier: 'premium' },
      isElevated: () => false,
      canExport: () => true,
      dossierEntitlements: {},
      refreshDossierEntitlement: () => {},
    };
    render(<SettlementMapExportMenu settlement={FIX} saveId="s1" style="vtt" />);
    openMenu();
    expect(screen.getByRole('button', { name: /download this map as png/i })).toBeTruthy();
  });

  test('free + un-entitled: the unlock rung shows, the format buttons do not', () => {
    storeRef.current = {
      auth: { tier: 'wanderer' },
      isElevated: () => false,
      canExport: () => false,
      dossierEntitlements: { s1: false },   // no right ⇒ the pricing moment
      refreshDossierEntitlement: () => {},
    };
    render(<SettlementMapExportMenu settlement={FIX} saveId="s1" style="parchment" />);
    openMenu();
    expect(screen.getByRole('button', { name: /unlock all exports for this settlement/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /download this map as svg/i })).toBeNull();
  });
});
