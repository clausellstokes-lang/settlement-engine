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
 *
 * RE-KEYED BY IDENTITY (W2-C-LEAVES-SIDE, 2026-11-13): soak1k-23 is a slave revolt whose Defense tab prints "Rebels and
 * guards are fighting in the contested districts", where the chair's ruling leaves the organised-ring note out (it said
 * the ring keeps the streets quiet: false there). Its variant is held by soak1k-41, the next town of the sweep that
 * draws the same vantage and prints it.
 *
 * RE-STATED BY CAUSE (VEIL-41 C2-BUILD (a'), 2707d6829, the chair's N49, N78 (2)): a shared read serves NO publicProse
 * (galleryWithholdAlways.js :: withholdAlways drops the key), so the projected `ringNote` no longer reaches the shared
 * tab, which renders the note locally from the SERVED record: `criminalStructureOf(shared).note`, the ORIGINAL vantage
 * (the served record carries no seed). The owner's view prints the seeded variant. THE FIDELITY GAP: where the seeded
 * variant differs from the original (soak1k-11 and soak1k-41 measured red at 79e94d633), the shared tab prints another
 * sentence than the owner's player view. THE TOOTH: where `block:defense.criminalStructure` is shut, the shared tab
 * prints NO note, neither the owner's nor the served one. The unstamped arm is unchanged.
 */
import React from 'react';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil, VEIL_OVERRIDE_KEY } from '../../src/domain/display/galleryVeil.js';
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

/** The page's own projection of a share whose DM shut one block (the marked share: the veil runs on the page). */
const shutShare = (projected, address) => projectShareVeil(projected, { [VEIL_OVERRIDE_KEY]: { v: 1, mode: 'live', deltas: [{ address, hidden: true }] } });

describe('the organized-ring note: the owner\'s view prints the seeded variant; the served shared tab prints the served record\'s own note (VEIL-41 (a\'))', () => {
  it('soak1k-10, soak1k-11 and soak1k-41: the owner prints its seeded variant, three variants in all; the served shared tab prints criminalStructureOf(shared).note, and no note where the block is shut', () => {
    const variants = new Set();
    for (const i of [10, 11, 41]) {
      const owner = birth(i).settlement;
      const note = criminalStructureOf(owner)?.note;
      expect(typeof note === 'string' && note.length > 0, `soak1k-${i}: anchored, the town has an organized ring`).toBe(true);
      variants.add(note);
      const projected = toPublicSafe(withPublicProse(owner, composePublicProse(owner)));
      const shared = projectShareVeil(projected, null);
      expect(Object.prototype.hasOwnProperty.call(shared, 'publicProse'), `soak1k-${i}: the served read carries no publicProse`).toBe(false);
      const served = criminalStructureOf(shared)?.note;
      expect(typeof served === 'string' && served.length > 0, `soak1k-${i}: the served record reads an organized ring`).toBe(true);
      expect(paragraphs(<DefenseTab settlement={owner} narrativeNote={null} playerView />), `soak1k-${i} owner`).toContain(note);
      expect(paragraphs(<DefenseTab settlement={shared} narrativeNote={null} publicDossier playerView />), `soak1k-${i} shared`).toContain(served);
      // THE TOOTH: the block shut, the shared tab prints no note (the open tab above prints the served one)
      const shut = paragraphs(<DefenseTab settlement={shutShare(projected, 'block:defense.criminalStructure')} narrativeNote={null} publicDossier playerView />);
      // anchored: the same tab over the same record, the block open, prints `served` (asserted above)
      expect(shut.filter((p) => p.includes(served) || p.includes(note)), `soak1k-${i} shut`).toEqual([]);
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
