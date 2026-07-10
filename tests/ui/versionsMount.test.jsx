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
import { readFileSync, readdirSync } from 'node:fs';
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

// F26 generalized — kill the WHOLE drift class, not just the Versions tab. A
// dossier tab component (a `*Tab.jsx` that default-exports a component and lives
// in one of the dossier tab source dirs) that no OutputContainer lazy-import
// references is a feature built + shipped-in-the-roadmap but unreachable in the
// product — exactly how Version history shipped mounted-nowhere. This pin makes
// that impossible for EVERY dossier tab: add a new `*Tab.jsx` to these dirs and
// it must be wired into OutputContainer, or this reddens.
describe('every dossier tab component is registered in OutputContainer (F26 class)', () => {
  // The dossier tab component source dirs (relative to src/components). The lazy
  // imports in OutputContainer are written relative to it, e.g.
  // `import('./new/tabs/OverviewTab')` — some carry the `.jsx` extension, some
  // do not, so the assertion matches an OPTIONAL extension.
  const TAB_DIRS = ['new/tabs', 'settlement'];
  const COMPONENTS = resolve(process.cwd(), 'src/components');

  // Collect every dossier *Tab.jsx that default-exports a component.
  const tabFiles = TAB_DIRS.flatMap(dir =>
    readdirSync(resolve(COMPONENTS, dir))
      .filter(name => /Tab\.jsx$/.test(name))
      .filter(name => /export default/.test(readFileSync(resolve(COMPONENTS, dir, name), 'utf8')))
      .map(name => ({ dir, base: name.replace(/\.jsx$/, ''), rel: `${dir}/${name.replace(/\.jsx$/, '')}` })),
  );

  test('the dossier tab dirs actually hold tab components (guards against a vacuous pass)', () => {
    expect(tabFiles.length).toBeGreaterThan(1);
  });

  test.each(tabFiles.map(t => [t.rel, t]))(
    '%s is lazy-imported in OutputContainer',
    (_rel, tab) => {
      // Match `import('./<dir>/<Name>')` or `import('./<dir>/<Name>.jsx')` with
      // either quote style — the exact lazy-import form OutputContainer uses.
      const re = new RegExp(
        `import\\(\\s*['"]\\./${tab.dir}/${tab.base}(?:\\.jsx)?['"]\\s*\\)`,
      );
      expect(OUTPUT_CONTAINER_SRC).toMatch(re);
    },
  );
});
