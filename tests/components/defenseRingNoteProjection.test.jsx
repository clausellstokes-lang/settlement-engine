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
 * when present; when absent it prints NO organised-ring note, which it cannot decide (VEIL-53, RULING V6). One town per seeded variant: soak1k-10,
 * soak1k-11, soak1k-23 (the chair's 120-town sweep). Every anchor is the owner's own draw.
 *
 * RE-KEYED BY IDENTITY (W2-C-LEAVES-SIDE, 2026-11-13): soak1k-23 is a slave revolt whose Defense tab prints "Rebels and
 * guards are fighting in the contested districts", where the chair's ruling leaves the organised-ring note out (it said
 * the ring keeps the streets quiet: false there). Its variant is held by soak1k-41, the next town of the sweep that
 * draws the same vantage and prints it.
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
  it('soak1k-10, soak1k-11 and soak1k-41: each prints its seeded variant on the shared tab, three variants in all', () => {
    const variants = new Set();
    for (const i of [10, 11, 41]) {
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
  // VEIL-53's FAIL-CLOSED PAGES (the chair's class of 23:27 under RULING V6): the shared tab prints NO ring note where the
  // page cannot decide the variant. RED FIRST at 1ffb2328b: the unstamped shared tab printed the table's ORIGINAL note
  // ("One criminal ring decides what crime is allowed here. ...") on soak1k-11 and soak1k-41, whose owners print another
  // vantage. (The brief quoted "the ring keeps the streets quiet", vantage 1: none of the three towns prints it.)
  it('an unstamped shared record (no shipped note, no seed) prints NO organised-ring note: soak1k-11 and soak1k-41, whose original vantage is not the owner\'s line, and soak1k-10; each owner\'s seeded variant unchanged', () => {
    for (const i of [11, 41, 10]) {
      const owner = birth(i).settlement;
      const note = criminalStructureOf(owner)?.note;
      const unstamped = projectShareVeil(toPublicSafe(owner), null);
      const local = criminalStructureOf(unstamped);
      expect(local?.key, `soak1k-${i}: the shared record keeps the organised classification`).toBe('organized');
      if (i !== 10) expect(local?.note, `soak1k-${i}: the page's local note is not the owner's line`).not.toBe(note);
      const shared = paragraphs(<DefenseTab settlement={unstamped} narrativeNote={null} publicDossier playerView />);
      expect(shared.filter((p) => /\bone (criminal )?ring\b/i.test(p)), `soak1k-${i} shared: no ring note`).toEqual([]);
      expect(paragraphs(<DefenseTab settlement={owner} narrativeNote={null} playerView />), `soak1k-${i} owner`).toContain(note);
    }
  });
});
