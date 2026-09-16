/**
 * foundryLazy.test.js — W-Session source-level lazy-import contracts for the
 * Foundry module export (the sibling of vendorPdfLazy's contract 4).
 *
 * The first-paint budget (vendorPdfLazy.test.js CLOSURE_BUDGET_BYTES) is the
 * dist-side ratchet; these source contracts make regressions fail with a
 * named culprit even without a build: the Foundry generator (and through it
 * the PDF view-model stack it shares) must be reachable ONLY via dynamic
 * import() on the user's export click.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

describe('W-Session — Foundry export stays out of the static graph', () => {
  it('SettlementDetail.jsx reaches generateFoundryModule only via dynamic import()', () => {
    const src = read('src/components/SettlementDetail.jsx');
    expect(src).toMatch(/import\(['"][^'"]*generateFoundryModule[^'"]*['"]\)/);
    expect(src).not.toMatch(/^import\s.*from\s+['"][^'"]*\/foundry\//m);
  });

  it('ExportSheet.jsx never imports the Foundry stack (the picker stays light)', () => {
    const src = read('src/components/settlement/ExportSheet.jsx');
    expect(src).not.toMatch(/['"][^'"]*\/foundry\//);
  });

  it('eager boot modules never import src/foundry', () => {
    for (const p of ['src/main.jsx', 'src/App.jsx', 'src/AppViews.jsx', 'src/store/index.js']) {
      expect(read(p), p).not.toMatch(/['"][^'"]*\/foundry\//);
    }
  });

  it('the Foundry generator never touches the PDF renderer (zip needs no worker, no react-pdf)', () => {
    const src = read('src/foundry/generateFoundryModule.js');
    expect(src).not.toMatch(/@react-pdf\/renderer/);
    expect(src).not.toMatch(/new Worker\(/);
  });
});
