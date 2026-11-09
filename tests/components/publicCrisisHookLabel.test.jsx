/**
 * @vitest-environment jsdom
 *
 * THE "Hook:" LABEL PRINTS ONLY OVER A HOOK (STYLE-RULINGS-2 B10(a); the SURFACES audit §7·G G1;
 * lane SW-B7b PROJECTION).
 *
 * The public crisis card in `OverviewTab.jsx` prints the entry's summary and then "Hook: " +
 * `crisisHookFor(r, v)`. The public projection (`toPublicSafe`) strips the entry's `crisisHook`
 * (the `hook` token of PRIVATE_KEY_RE: a hook is DM content), so on a public or player page the
 * label printed over an empty line. Measured on the twelve fixture towns (soak1k-0..11) at
 * bd07005b9: 12 of 12 public crisis entries, in 11 towns, printed a bare "Hook:".
 * The DM-full share (`gallery_share_dm`) keeps the hook, so there the label stands over it.
 */
import React from 'react';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { crisisHookFor } from '../../src/domain/crisis/crisisHooks.js';

afterEach(cleanup);

/** @type {Record<number, any>} */
const towns = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of [0, 4]) towns[i] = birth(i).settlement;
});

/** The paragraphs that carry the "Hook:" label, with the text after it. */
function hookLines(container) {
  return [...container.querySelectorAll('p')]
    .filter((p) => /^Hook:/.test((p.textContent || '').trim()))
    .map((p) => (p.textContent || '').replace(/^\s*Hook:\s*/, '').trim());
}

describe('the public crisis card: "Hook:" only over a hook', () => {
  it.each([0, 4])('soak1k-%i, the public page: no bare "Hook:" label', (i) => {
    const pub = projectShareVeil(toPublicSafe(towns[i]), null);
    expect([pub.stress].flat().filter(Boolean).length).toBeGreaterThan(0);
    const { container } = render(<OverviewTab settlement={pub} publicDossier playerView />);
    expect(hookLines(container).filter((line) => line === '')).toEqual([]);
  });

  it('soak1k-0, the DM-full share keeps the hook and its label', () => {
    const full = toPublicSafe(towns[0], { full: true });
    const entry = [full.stress].flat().filter(Boolean)[0];
    const hook = crisisHookFor(full, entry);
    expect(hook).not.toBe('');
    const { container } = render(<OverviewTab settlement={full} publicDossier />);
    expect(hookLines(container)).toContain(hook);
  });
});
