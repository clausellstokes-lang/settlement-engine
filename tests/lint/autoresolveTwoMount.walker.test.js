/**
 * autoresolveTwoMount.walker.test.js — ITEM 1 (owner order 2026-07-22:
 * "there should be an autoresolver in the library advance time as well, it should
 * sync with the realm's"), RE-KEYED by LIBRARY-SIMPLE (owner, 2026-11-10, verbatim:
 * "I now want to simplify the library page. No longer does it advance time. That will
 * only be accessible in isolated (not in campaign settlements) or the realm page.").
 *
 * The auto-resolve SETTING stays ONE shared store value with the resolution routed
 * through the SINGLE chokepoint (advanceCampaignWorld → get().advanceAutoResolve). The
 * Library no longer advances, so it no longer mounts the switch: the Realm is the ONE
 * mount, and the Library folder is pinned to read neither the value nor its setter.
 *
 * A source-scan walker (the E-B pattern): it fails if a future edit forks the state,
 * bypasses the chokepoint, or puts the switch back on the Library.
 */

import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');

const REALM_MOUNT = 'src/components/WorldMap.jsx';
const LIBRARY_MOUNT = 'src/components/settlements/CampaignFolder.jsx';
const STORE_SLICE = 'src/store/campaignWorldPulseSlice.js';
const CHOKEPOINT = 'src/store/campaignAdvanceSession.js';
const REALM_ADVANCE_CALLER = 'src/hooks/useAdvanceSession.js';

describe('auto-resolve is ONE shared state, mounted on the Realm alone', () => {
  test('the shared store defines exactly one advanceAutoResolve value + setter', () => {
    const slice = read(STORE_SLICE);
    // The state value and its setter are declared once, in the shared slice.
    expect((slice.match(/advanceAutoResolve:/g) || []).length).toBe(1);
    expect((slice.match(/setAdvanceAutoResolve:/g) || []).length).toBe(1);
  });

  test('the Realm mount reads the shared store state (advanceAutoResolve + setter)', () => {
    const src = read(REALM_MOUNT);
    expect(src.includes('s.advanceAutoResolve'), `${REALM_MOUNT} must read the shared advanceAutoResolve`).toBe(true);
    expect(src.includes('s.setAdvanceAutoResolve'), `${REALM_MOUNT} must read the shared setAdvanceAutoResolve`).toBe(true);
  });

  test('the Library folder mounts no auto-resolve switch (owner, 2026-11-10)', () => {
    const src = read(LIBRARY_MOUNT);
    expect(/advanceAutoResolve/i.test(src), `${LIBRARY_MOUNT} must not read the auto-resolve state`).toBe(false);
    expect(src.includes('Auto-resolve'), `${LIBRARY_MOUNT} must not render the auto-resolve switch`).toBe(false);
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

  test('the Realm advance caller hits advanceCampaignWorld WITHOUT a forked autoResolve arg', () => {
    // The advance call must NOT pass its own autoResolve option — passing one would
    // bypass the shared-state fallback. The Library caller (useCampaignAdvance.js) was
    // removed with the Library's advance (owner, 2026-11-10); the Library's absence is
    // pinned in libraryAdvancesNothing.walker.test.js.
    for (const caller of [REALM_ADVANCE_CALLER]) {
      const src = read(caller);
      expect(src.includes('advanceCampaignWorld('), `${caller} must call the shared advanceCampaignWorld chokepoint`).toBe(true);
      // No inline autoResolve option object handed to the advance from the mount.
      expect(/advanceCampaignWorld\([^)]*autoResolve/.test(src), `${caller} must not fork autoResolve into the advance call`).toBe(false);
    }
  });
});
