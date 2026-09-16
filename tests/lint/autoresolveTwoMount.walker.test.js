/**
 * autoresolveTwoMount.walker.test.js — ITEM 1 (owner order 2026-07-22:
 * "there should be an autoresolver in the library advance time as well, it should
 * sync with the realm's").
 *
 * The auto-resolve SETTING must be ONE shared store value, mounted on BOTH advance
 * surfaces (the Realm map + the Library campaign folder), with the resolution routed
 * through the SINGLE chokepoint (advanceCampaignWorld → get().advanceAutoResolve).
 * Zero forked logic: neither mount may own a second autoresolve state, and neither
 * advance call may pass a hand-forked autoResolve option that would desync them.
 *
 * A source-scan walker (the E-B pattern): it fails if a future edit forks the state
 * or bypasses the chokepoint on either mount.
 */

import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');

const REALM_MOUNT = 'src/components/WorldMap.jsx';
const LIBRARY_MOUNT = 'src/components/settlements/CampaignFolder.jsx';
const STORE_SLICE = 'src/store/campaignWorldPulseSlice.js';
const CHOKEPOINT = 'src/store/campaignAdvanceSession.js';
const REALM_ADVANCE_CALLER = 'src/hooks/useAdvanceSession.js';
const LIBRARY_ADVANCE_CALLER = 'src/components/settlements/useCampaignAdvance.js';

describe('auto-resolve is ONE shared state mounted on BOTH advance surfaces', () => {
  test('the shared store defines exactly one advanceAutoResolve value + setter', () => {
    const slice = read(STORE_SLICE);
    // The state value and its setter are declared once, in the shared slice.
    expect((slice.match(/advanceAutoResolve:/g) || []).length).toBe(1);
    expect((slice.match(/setAdvanceAutoResolve:/g) || []).length).toBe(1);
  });

  test('BOTH mounts read the SAME shared store state (advanceAutoResolve + setter)', () => {
    for (const mount of [REALM_MOUNT, LIBRARY_MOUNT]) {
      const src = read(mount);
      expect(src.includes('s.advanceAutoResolve'), `${mount} must read the shared advanceAutoResolve`).toBe(true);
      expect(src.includes('s.setAdvanceAutoResolve'), `${mount} must read the shared setAdvanceAutoResolve`).toBe(true);
    }
  });

  test('neither mount forks a SECOND autoresolve state (no local useState / rival key)', () => {
    for (const mount of [REALM_MOUNT, LIBRARY_MOUNT]) {
      const src = read(mount);
      // No component-local autoresolve state (which would desync the two surfaces).
      expect(/useState\([^)]*[Aa]utoResolve/.test(src), `${mount} must not own a local autoResolve state`).toBe(false);
      // No rival store key (e.g. libraryAutoResolve / realmAutoResolve).
      expect(/(library|realm|folder)AutoResolve/i.test(src), `${mount} must not read a forked autoresolve key`).toBe(false);
    }
  });
});

describe('the resolution routes through the SINGLE chokepoint (no forked logic)', () => {
  test('the chokepoint resolves autoResolve via the one shared-state fallback', () => {
    const src = read(CHOKEPOINT);
    // advanceCampaignWorld resolves the effective autoResolve: an explicit option
    // wins, else it FALLS BACK to the shared store value — the single source both
    // user-initiated mounts (which pass no option) inherit.
    expect(/options\.autoResolve\s*!=\s*null\s*\?[\s\S]*?get\(\)\.advanceAutoResolve/.test(src)).toBe(true);
    // Exactly one place reads the shared toggle as the advance fallback (the catch-up
    // path computes its own autoResolve from world progression and passes it in).
    expect((src.match(/get\(\)\.advanceAutoResolve/g) || []).length).toBe(1);
  });

  test('BOTH advance callers hit advanceCampaignWorld WITHOUT a forked autoResolve arg', () => {
    // Each mount's advance call must NOT pass its own autoResolve option — passing one
    // would bypass the shared-state fallback and desync the surfaces. Both rely on the
    // single chokepoint fallback instead.
    for (const caller of [REALM_ADVANCE_CALLER, LIBRARY_ADVANCE_CALLER]) {
      const src = read(caller);
      expect(src.includes('advanceCampaignWorld('), `${caller} must call the shared advanceCampaignWorld chokepoint`).toBe(true);
      // No inline autoResolve option object handed to the advance from the mount.
      expect(/advanceCampaignWorld\([^)]*autoResolve/.test(src), `${caller} must not fork autoResolve into the advance call`).toBe(false);
    }
  });
});
