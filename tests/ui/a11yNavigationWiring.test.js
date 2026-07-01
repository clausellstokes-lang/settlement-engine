import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, test, expect } from 'vitest';

/**
 * Structural guard for the a11y navigation fix (audit R7). The behavior is proven
 * behaviorally elsewhere (useFocusOnViewChange.test.jsx for view-change focus, the
 * Dialog focus-trap test for the modal trap); this pins that App and the four
 * previously-bare modals actually WIRE those mechanisms, so a future refactor can't
 * silently drop them the way the original "done" claim had.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => readFileSync(join(root, p), 'utf8');

describe('a11y navigation is wired into App', () => {
  const app = read('src/App.jsx');

  test('a skip-to-content link targets #main-content', () => {
    expect(app).toMatch(/href="#main-content"[\s\S]{0,60}className="skip-link"|className="skip-link"[\s\S]{0,60}href="#main-content"/);
  });

  test('<main> is the skip target: id + tabIndex + ref', () => {
    expect(app).toMatch(/<main[^>]*id="main-content"/);
    expect(app).toMatch(/<main[^>]*tabIndex=\{-1\}/);
    expect(app).toMatch(/<main[^>]*ref=\{mainRef\}/);
  });

  test('focus-on-view-change is driven by the tested hook', () => {
    expect(app).toMatch(/useFocusOnViewChange\(view, mainRef\)/);
  });

  test('the skip-link CSS is live, not a commented placeholder', () => {
    const css = read('src/styles/a11y.css');
    expect(css).toMatch(/^\.skip-link\s*\{/m);
    expect(css).toMatch(/\.skip-link:focus\s*\{/m);
  });
});

describe('previously-bare aria-modal modals now back the promise with the shared focus trap', () => {
  const MODALS = [
    'src/components/settlement/ExportSheet.jsx',
    'src/components/dossier/SimulationDrawer.jsx',
    'src/components/map/MapShareEditorOverlay.jsx',
    'src/components/settlement/SuccessorPrompt.jsx',
  ];

  test.each(MODALS)('%s imports the trap, attaches its ref, and declares aria-modal', (f) => {
    const src = read(f);
    expect(src, `${f} must use useDialogFocusTrap`).toMatch(/useDialogFocusTrap\(/);
    expect(src, `${f} must attach the trap ref`).toMatch(/ref=\{dialogRef\}/);
    expect(src, `${f} must declare aria-modal (the promise the trap backs)`).toMatch(/aria-modal="true"/);
  });
});
