/**
 * @vitest-environment jsdom
 *
 * THE ORGANIZED-RING NOTE TRAVELS WITH THE PROJECTION (VEIL-FIX R3, the chair's ruling of 2026-11-10;
 * the equality pair soak1k-10 / soak1k-11 the merge seat carried).
 *
 * SW-B5 FRAMES made defenseDisplay.js :: withRingVantage pick the organized-ring note's vantage by
 * `settlement._seed`; the shared record carries no seed, so the shared Defense tab, which renders
 * `csd.note` locally (deskHostArgs.js :: criminalStructureOf), printed the ORIGINAL sentence while
 * the owner's player view printed the seeded variant. In SW-B7b's idiom the drawn note ships with
 * the projection under `defense:criminal` (`ringNote`); the shared tab prints the projected line
 * when present and renders locally, as before, when absent. One town per seeded variant: soak1k-10,
 * soak1k-11, soak1k-23 (the chair's 120-town sweep). Every anchor is the owner's own draw.
 */
import React from 'react';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { criminalStructureOf } from '../../src/components/new/deskHostArgs.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';

afterEach(cleanup);
beforeAll(async () => { await ensureLaws(); }, 120_000);

/** The paragraphs a render prints, whitespace-normalized. */
function paragraphs(element) {
  const { container, unmount } = render(element);
  const out = [...container.querySelectorAll('p')].map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim());
  unmount();
  return out;
}

describe('the organized-ring note: the shared Defense tab prints the owner\'s seeded variant', () => {
  it('soak1k-10, soak1k-11 and soak1k-23: each prints its seeded variant on the shared tab, three variants in all', () => {
    const variants = new Set();
    for (const i of [10, 11, 23]) {
      const owner = birth(i).settlement;
      const note = criminalStructureOf(owner)?.note;
      expect(typeof note === 'string' && note.length > 0, `soak1k-${i}: anchored, the town has an organized ring`).toBe(true);
      variants.add(note);
      const shared = projectShareVeil(toPublicSafe(withPublicProse(owner, composePublicProse(owner))), null);
      expect(paragraphs(<DefenseTab settlement={owner} narrativeNote={null} playerView />), `soak1k-${i} owner`).toContain(note);
      expect(paragraphs(<DefenseTab settlement={shared} narrativeNote={null} publicDossier playerView />), `soak1k-${i} shared`).toContain(note);
    }
    expect(variants.size).toBe(3);
  });
  it('an unstamped shared record renders the note locally, as before (no seed: the original sentence)', () => {
    const owner = birth(10).settlement;
    const unstamped = projectShareVeil(toPublicSafe(owner), null);
    const local = criminalStructureOf(unstamped)?.note;
    expect(typeof local === 'string' && local.length > 0).toBe(true);
    expect(paragraphs(<DefenseTab settlement={unstamped} narrativeNote={null} publicDossier playerView />)).toContain(local);
  });
});
