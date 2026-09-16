/**
 * tests/design/organicSamples.test.js — THE PHASE-2 SAMPLE SET (the taste-veto
 * artifact) + its drift guard.
 *
 * Each of the five re-composed screens (registry.jsx) is SSR-rendered to a
 * self-contained HTML fixture in docs/samples/organic-craft/ with the organic CSS,
 * the font faces, and the org token vars inlined — a page the manager opens and
 * resizes for the preview legibility review, and the owner vetoes. The render is a
 * pure function of the fixtures + the CSS on disk, so a fresh build must byte-match
 * the committed files: a DELIBERATE composition/CSS change reds this and is re-minted
 * WITH a stated cause via:
 *
 *   UPDATE_ORGANIC_SAMPLES=1 npx vitest run tests/design/organicSamples.test.js
 *
 * (react-dom/server needs no DOM — this runs in the default node env.)
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { SAMPLES } from '../../src/components/organic/samples/registry.jsx';
import { organicCssRootBlock } from '../../src/design/organic/index.js';

const UPDATE = process.env.UPDATE_ORGANIC_SAMPLES === '1';
const DIR = resolve(process.cwd(), 'docs', 'samples', 'organic-craft');
const ORGANIC_CSS = readFileSync(resolve(process.cwd(), 'src', 'styles', 'organic.css'), 'utf-8');
const SAMPLES_CSS = readFileSync(resolve(process.cwd(), 'src', 'components', 'organic', 'samples', 'samples.css'), 'utf-8');

// Self-hosted faces the samples use (referenced at /fonts — resolves when the dir
// is served by the app/dev server; falls back to the metric-matched Georgia /
// system-ui stacks when a fixture is opened directly, so there is no FOUT reflow).
const FONT_FACES = [
  ['Lora', 'Lora-Regular.woff2', 400, 'normal'],
  ['Lora', 'Lora-Bold.woff2', 700, 'normal'],
  ['Lora', 'Lora-Italic.woff2', 400, 'italic'],
  ['Lora', 'Lora-BoldItalic.woff2', 700, 'italic'],
  ['Nunito', 'Nunito-Regular.woff2', 400, 'normal'],
  ['Nunito', 'Nunito-Bold.woff2', 700, 'normal'],
  ['Nunito', 'Nunito-ExtraBold.woff2', 800, 'normal'],
].map(([fam, file, w, style]) =>
  `@font-face{font-family:'${fam}';src:url('/fonts/${file}') format('woff2');font-weight:${w};font-style:${style};font-display:swap;}`,
).join('\n');

const PAGE_CSS = [
  '.oc-sample-page{margin:0;min-height:100vh;background:#f7f0e4;padding:clamp(1rem,3vw,2.5rem) 0;-webkit-font-smoothing:antialiased;}',
  '.oc-sample-page--field{background:var(--oc-field-ground);}',
  '.oc-sample-frame{max-width:72rem;margin:0 auto;}',
].join('\n');

function buildDoc(sample) {
  const body = renderToStaticMarkup(sample.render());
  const style = `${FONT_FACES}\n${organicCssRootBlock()}\n${PAGE_CSS}\n${ORGANIC_CSS}\n${SAMPLES_CSS}`;
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${sample.title} · Organic Craft sample</title>`,
    `<style>\n${style}\n</style>`,
    '</head>',
    `<body class="oc-sample-page${sample.field ? ' oc-sample-page--field' : ''}" data-posture="${sample.posture}">`,
    `<main class="oc-sample-frame">${body}</main>`,
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

function buildIndex() {
  const rows = SAMPLES.map((s) =>
    `    <li><a href="./${s.id}.html">${escapeHtml(s.title)}</a> <span class="reg">${s.register} register${s.field ? ' · field mode (dim)' : ''}</span></li>`,
  ).join('\n');
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>THE ORGANIC CRAFT WAVE — sample set</title>',
    "<style>body{font-family:Georgia,serif;background:#fbf5e6;color:#2c2210;max-width:44rem;margin:0 auto;padding:2rem 1.2rem;line-height:1.6;}h1{font-size:1.8rem;margin:0 0 .2em;}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.72rem;color:#6b5340;font-family:system-ui,sans-serif;}ul{list-style:none;padding:0;}li{padding:.6em 0;border-top:1px solid #e8d9b0;}a{color:#8b2e2e;font-size:1.15rem;text-decoration:underline;}.reg{display:block;font-size:.8rem;color:#6b5340;font-family:system-ui,sans-serif;}.note{font-size:.9rem;color:#6b5340;}</style>",
    '</head>',
    '<body>',
    '  <div class="eyebrow">Phase 2 · the taste-veto artifact</div>',
    '  <h1>THE ORGANIC CRAFT WAVE — sample set</h1>',
    '  <p class="note">Five surfaces re-composed under the Organic Craft law. Open each and resize the window to read it at desk and field widths; the field sample is art-directed for the dim mobile companion. Fonts resolve when served with the app (the /fonts path); opened directly they fall back to the metric-matched system stacks.</p>',
    '  <ul>',
    rows,
    '  </ul>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

if (UPDATE) {
  mkdirSync(DIR, { recursive: true });
  for (const s of SAMPLES) writeFileSync(resolve(DIR, `${s.id}.html`), buildDoc(s));
  writeFileSync(resolve(DIR, 'index.html'), buildIndex());
}

describe('organic craft — the phase-2 sample set', () => {
  it('enumerates the five taste-veto screens (incl. the field-mode dossier)', () => {
    expect(SAMPLES.map((s) => s.id)).toEqual([
      'dossier-desk', 'library-desk', 'compendium-desk', 'pricing-desk', 'dossier-field',
    ]);
    expect(SAMPLES.some((s) => s.field)).toBe(true); // FIELD MODE present
    expect(new Set(SAMPLES.map((s) => s.register))).toEqual(new Set(['artifact', 'instrument', 'reference']));
  });

  it('each committed fixture is byte-identical to a fresh SSR render (drift guard)', () => {
    for (const s of SAMPLES) {
      const file = resolve(DIR, `${s.id}.html`);
      expect(existsSync(file), `${s.id}.html missing — run: UPDATE_ORGANIC_SAMPLES=1 npx vitest run tests/design/organicSamples.test.js`).toBe(true);
      expect(readFileSync(file, 'utf-8'), `${s.id}.html is stale — regen with UPDATE_ORGANIC_SAMPLES=1`).toBe(buildDoc(s));
    }
    const idx = resolve(DIR, 'index.html');
    expect(existsSync(idx)).toBe(true);
    expect(readFileSync(idx, 'utf-8')).toBe(buildIndex());
  });

  it('each fixture is a self-contained doc: inlined fonts, org vars, and both stylesheets', () => {
    const doc = buildDoc(SAMPLES[0]);
    expect(doc.startsWith('<!doctype html>')).toBe(true);
    expect(doc).toContain('@font-face');
    expect(doc).toContain('--oc-ink-body');      // the org token vars are inlined
    expect(doc).toContain('.oc-register');        // organic.css inlined
    expect(doc).toContain('.oc-tier');            // samples.css inlined
    // No third-party font/asset ORIGIN on the critical path (the SVG xmlns URI is a
    // namespace identifier, not a fetch — it is fine).
    expect(doc).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/i);
    expect(doc).not.toMatch(/(?:src|href)\s*=\s*["']https?:/i);
    expect(doc).toContain("url('/fonts/");        // self-hosted faces only
  });

  it('the field-mode fixture carries the dim surface + posture', () => {
    const doc = buildDoc(SAMPLES.find((s) => s.field));
    expect(doc).toContain('oc-sample-page--field');
    expect(doc).toContain('data-posture="field"');
    expect(doc).toContain('oc-field');            // the surface swaps to the field ramp
  });
});
