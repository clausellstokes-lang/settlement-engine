/**
 * tests/copy/voiceMechanics.test.js — Voice mechanics guard.
 *
 * The house voice (docs/VOICE_AND_TONE.md) forbids two AI tells in any
 * user-facing string: the em dash (U+2014) and the exclamation point. The
 * codebase documented that rule for a long time but never enforced it, so the
 * copy drifted full of both. This test walks the centralized copy objects and
 * fails the build the moment either tell reappears, so new copy cannot
 * reintroduce them.
 *
 * Scope: the two single-source-of-truth copy registries (`en`, `COPY`). The
 * dossier data files are swept by the same rule during refinement; extend the
 * walk here as their composition coverage grows.
 */

import { describe, it, expect } from 'vitest';
import { en } from '../../src/copy/index.js';
import { COPY } from '../../src/copy/strings.js';

const EM_DASH = '—';

// Collect every string leaf in a copy tree as [dottedPath, value] pairs.
// Functions (plural helpers, cost interpolators) are skipped: they have no
// static text to lint, and calling them blind would need fabricated args.
function collectStrings(node, path, out) {
  if (typeof node === 'string') {
    out.push([path, node]);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
    return;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      collectStrings(node[key], path ? `${path}.${key}` : key, out);
    }
  }
}

const strings = [];
collectStrings(en, 'en', strings);
collectStrings(COPY, 'COPY', strings);

describe('voice mechanics (user-facing copy registries)', () => {
  it('collects a non-trivial number of strings (guards against an empty walk)', () => {
    expect(strings.length).toBeGreaterThan(100);
  });

  it('contains no em dashes (U+2014) in any string value', () => {
    const offenders = strings
      .filter(([, v]) => v.includes(EM_DASH))
      .map(([p, v]) => `${p}: ${v}`);
    expect(offenders, `em dash found in: \n${offenders.join('\n')}`).toEqual([]);
  });

  it('contains no exclamation points in any string value', () => {
    const offenders = strings
      .filter(([, v]) => v.includes('!'))
      .map(([p, v]) => `${p}: ${v}`);
    expect(offenders, `exclamation point found in: \n${offenders.join('\n')}`).toEqual([]);
  });
});
