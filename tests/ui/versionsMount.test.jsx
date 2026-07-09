/**
 * @vitest-environment jsdom
 *
 * tests/ui/versionsMount.test.jsx — F26 mount pin.
 *
 * Version history (P109/E-5) shipped fully built — store actions, timeline
 * builder, diff view, locked-state card, its own unit tests — and was mounted
 * NOWHERE: no tab registry referenced VersionsTab, so the feature (and the
 * upsell card inside it) was unreachable in the product while the roadmap
 * marked it shipped. This pin makes that class of drift impossible for the
 * Versions tab specifically: the dossier registry must carry the tab, and the
 * dossier module must actually import + render the component.
 *
 * (Registry + source-wiring pin rather than a full dossier render: a real
 * render needs a populated settlement and resolves a pile of lazy chunks;
 * the drift that shipped — zero references — is exactly what this catches.)
 */

import { describe, test, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: false, supabase: {} }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/lib/flags.js', () => ({ flag: vi.fn(() => false) }));
vi.mock('../../src/store/index.js', () => {
  const storeState = {};
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

// cwd-relative (vitest runs from the repo root): import.meta.url is http-scheme
// under the jsdom environment, so URL-based resolution can't be used here.
const OUTPUT_CONTAINER_SRC = readFileSync(
  resolve(process.cwd(), 'src/components/OutputContainer.jsx'),
  'utf8',
);

describe('VersionsTab is mounted in the dossier (F26 pin)', () => {
  test('the notes tab group registers the versions tab', async () => {
    const { TAB_GROUPS } = await import('../../src/components/OutputContainer.jsx');
    expect(TAB_GROUPS.notes.tabs).toContain('versions');
  });

  test('OutputContainer registers, lazy-imports, and renders VersionsTab', () => {
    // Tab entry exists (flat-strip mode shows it too, not just the group view).
    expect(OUTPUT_CONTAINER_SRC).toMatch(/id:\s*'versions'/);
    // The component is actually imported…
    expect(OUTPUT_CONTAINER_SRC).toMatch(/import\('\.\/settlement\/VersionsTab\.jsx'\)/);
    // …and the tab switch renders it with the owning save entry.
    expect(OUTPUT_CONTAINER_SRC).toMatch(/case 'versions':\s*return <VersionsTab save=\{liveSaveEntry\}/);
  });

  test('VersionsTab itself still exports a component', async () => {
    const mod = await import('../../src/components/settlement/VersionsTab.jsx');
    expect(typeof mod.default).toBe('function');
  });
});
