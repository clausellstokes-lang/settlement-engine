/**
 * configPatchAllowlistWalker.test.js — Wave R-3 (atlas VI.12 #163b, lane B):
 * the census→allowlist coupling for updateConfig's key validation.
 *
 * updateConfig (src/store/configSlice.js) drops patch keys outside its
 * admitted surface. That is only safe while the surface stays a SUPERSET of
 * everything actually read or written: a pipeline/store reader key the
 * predicate refuses would be silently stripped from the Library's saved-config
 * loads — the exact G2 silent-drop class configSeamContract.test.js exists to
 * kill, reintroduced at runtime. This walker re-derives the census from source
 * on every run and asserts the imported predicate admits every censused key:
 *   - every `config.<key>` / destructured read across src/generators (the
 *     configSeamContract alias vocabulary, reused verbatim);
 *   - every literal key any src/components file stamps via updateConfig({...}).
 * A new reader/writer key that the predicate refuses reds here, forcing a
 * CONFIG_PATCH_EXTRA_KEYS entry (or a DEFAULT_CONFIG default).
 *
 * KNOWN EDGES — the residual blind spots are exactly two, shorthand and
 * computed keys (deliberate, mirrored from configSeamContract):
 *   - Shorthand properties (`updateConfig({ ...cfg, seed, ... })`) are not
 *     collected — shorthand detection false-positives on value identifiers.
 *     The known shorthand writes (`seed`) are pinned explicitly in
 *     tests/store/updateConfigPatchValidation.test.js instead.
 *   - Computed keys (`{ [key]: v }`) are skipped; the dynamic writers are the
 *     priority sliders, whose literal names are DEFAULT_CONFIG keys.
 *   - The dot-scan over-collects alias property reads on non-config objects
 *     ('has', 'consumers', ...); the allowlist carries them deliberately so
 *     this derivation and the runtime literal can never drift.
 *
 * NO LONGER a blind spot: the literal-key regex used to anchor its
 * start-of-literal branch as a bare `^` (the whitespace skip sat inside the
 * `[,{]` branch), so the FIRST key of every `updateConfig({ key: ... })` call
 * was dropped, since a space always follows the brace. Moving the skip outside
 * the alternation collects it. The correction added `primaryDeityRef` and
 * `targetCampaignId` (both from src/components/generate/PlaceInRegionCard.jsx)
 * to the component census, 18 keys to 20; both were already admitted, so the
 * allowlist needed no widening.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { isAllowedConfigKey } from '../../src/store/configSlice.js';

const ROOT = process.cwd();

// The configSeamContract alias vocabulary, reused verbatim.
const CFG_ALIASES = 'config|effectiveConfig|cfg|resolvedConfig|resolved|baseConfig|fullConfig';

function walkFiles(dir, exts, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, exts, acc);
    else if (exts.some(ext => name.endsWith(ext))) acc.push(full);
  }
  return acc;
}

/** Every config key the deterministic pipeline reads (dot access + destructuring). */
function pipelineReadKeys() {
  const keys = new Set();
  const dotRe = new RegExp(`(?:${CFG_ALIASES})\\.([a-zA-Z_][a-zA-Z0-9_]*)`, 'g');
  const destructRe = new RegExp(`\\{([^{}]+)\\}\\s*=\\s*(?:${CFG_ALIASES})\\b`, 'g');
  for (const file of walkFiles(resolve(ROOT, 'src/generators'), ['.js'])) {
    const src = readFileSync(file, 'utf-8');
    let m;
    while ((m = dotRe.exec(src))) keys.add(m[1]);
    while ((m = destructRe.exec(src))) {
      for (const part of m[1].split(',')) {
        const name = part.split(':')[0].split('=')[0].trim().replace(/\.\.\./, '');
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) keys.add(name);
      }
    }
  }
  return keys;
}

/** Every literal key any component stamps via updateConfig({ ... }). */
function componentWrittenKeys() {
  const keys = new Set();
  const callRe = /updateConfig\(\s*(?:[^)?]*\?\s*)?\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
  for (const file of walkFiles(resolve(ROOT, 'src/components'), ['.js', '.jsx'])) {
    const src = readFileSync(file, 'utf-8');
    if (!src.includes('updateConfig(')) continue;
    let m;
    while ((m = callRe.exec(src))) {
      // `(?:^|[,{])\s*` — the whitespace skip must sit OUTSIDE the alternation.
      // With it inside the character-class branch the start-of-literal branch
      // was a bare `^`, so the first key of `updateConfig({ key: ... })` (a
      // space always follows the brace) was never collected. See the header.
      const keyRe = /(?:^|[,{])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
      let k;
      while ((k = keyRe.exec(m[1]))) keys.add(k[1]);
    }
  }
  return keys;
}

describe('R-3 — updateConfig admits every censused config key (allowlist walker)', () => {
  it('self-check: the walker actually found readers and writers (not vacuous)', () => {
    expect(pipelineReadKeys().size).toBeGreaterThan(8);
    expect(componentWrittenKeys().size).toBeGreaterThan(8);
  });

  it('the predicate admits every pipeline-read config key', () => {
    const refused = [...pipelineReadKeys()].filter(key => !isAllowedConfigKey(key));
    expect(
      refused,
      `The pipeline reads config ${refused.join(', ')} but isAllowedConfigKey refuses `
        + 'it, so updateConfig would silently strip it from saved-config loads. Add the '
        + 'key to CONFIG_PATCH_EXTRA_KEYS in src/store/configSlice.js (or give it a '
        + 'DEFAULT_CONFIG default).',
    ).toEqual([]);
  });

  it('the predicate admits every component-written updateConfig key', () => {
    const refused = [...componentWrittenKeys()].filter(key => !isAllowedConfigKey(key));
    expect(
      refused,
      `A component stamps config ${refused.join(', ')} via updateConfig but `
        + 'isAllowedConfigKey refuses it, so the write is silently dropped at runtime. '
        + 'Add the key to CONFIG_PATCH_EXTRA_KEYS in src/store/configSlice.js (or give '
        + 'it a DEFAULT_CONFIG default).',
    ).toEqual([]);
  });
});
