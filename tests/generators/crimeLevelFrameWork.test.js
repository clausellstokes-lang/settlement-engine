/**
 * crimeLevelFrameWork.test.js — GEN-SPEED cure 2 (2026-11-10): a text is framed once per ROSTER,
 * not once per person.
 *
 * `npcGenerator.js :: generateCrimeLevel`'s 25% branch refuses a secret whose FRAME (every roster
 * name masked, longest first, by sequential `split(name).join('@')`) the rest of the roster
 * already holds (STYLE-2 SW-7). Before the cure every person who took the branch re-framed the
 * WHOLE held set: persons × held × names masking steps, cubic in the roster, a sixth of the CPU of
 * the wizard's heaviest request. This pin counts WORK, never time: one masking step is one
 * `String.prototype.split` by a roster name. Over P persons, a held set of M texts and a roster of
 * N names, the steps are bounded by (M + 4P) · N (each held text framed once, plus each person's
 * four candidate texts), not P · (M + 4) · N.
 *
 * The second pin holds the exactness rule: what is remembered is keyed by the roster's CONTENT, so
 * a call over another roster in between changes nothing, and the answers equal a cold run's.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateCrimeLevel } from '../../src/generators/npcGenerator.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

const FIRST = ['Aldric', 'Brenna', 'Cedric', 'Dagna', 'Eldon', 'Fenna', 'Garrick', 'Hilde', 'Ivo', 'Jorunn'];
const LAST = ['Ashford', 'Blackwood', 'Coldwater', 'Dunmere'];
/** @param {number} n @param {string} salt */
const roster = (n, salt = '') => Array.from({ length: n }, (_, i) => ({ name: `${FIRST[i % FIRST.length]} ${LAST[Math.floor(i / FIRST.length) % LAST.length]}${salt}` }));
/** M held secrets that name roster members, as the rest of a real roster carries them. */
const heldOf = (npcs, m) => Array.from({ length: m }, (_, i) => `Knows something about ${npcs[(i * 7) % npcs.length].name} that ${npcs[(i * 7) % npcs.length].name} believes no one else knows, and has been deciding for months whether to use it ${i}`);

/** Every person takes the 25% branch: the stream's rolls all read 0.1. */
const branchStream = () => ({ random: () => 0.1, seed: 'gen-speed-pin' });

/** Run the branch for every person of `npcs`, each with a FRESH held set (as `heldByOthers` hands it). */
function runAll(npcs, held) {
  const summary = { stressTypes: [], facts: null };
  return npcs.map((npc, i) => generateCrimeLevel(npc, i, summary, npcs, new Set(held)));
}

afterEach(() => { vi.restoreAllMocks(); clearActiveRng(); });

describe('generateCrimeLevel — the held set is framed once per roster', () => {
  it('masking steps are bounded by (M + 4P) · N, not P · (M + 4) · N', () => {
    const N = 40; const M = 30; const P = N;
    const npcs = roster(N, ' (pin-a)');
    const held = heldOf(npcs, M);
    const names = new Set(npcs.map((n) => n.name));
    setActiveRng(branchStream());
    let steps = 0;
    const realSplit = String.prototype.split;
    vi.spyOn(String.prototype, 'split').mockImplementation(function split(sep, limit) {
      if (typeof sep === 'string' && names.has(sep)) steps += 1;
      return realSplit.call(this, sep, limit);
    });
    const out = runAll(npcs, held);
    expect(out.filter(Boolean).length, 'every person took the branch and drew a secret').toBe(P);
    expect(steps).toBeGreaterThan(0);
    expect(steps).toBeLessThanOrEqual((M + 4 * P) * N);
  });

  it('remembers by the roster\'s content: another roster between two runs moves no answer', () => {
    const a = roster(24, ' (pin-b)'); const b = roster(18, ' (pin-c)');
    const heldA = heldOf(a, 20); const heldB = heldOf(b, 12);
    const run = (npcs, held) => { setActiveRng(createPRNG('frame-pin')); const r = runAll(npcs, held); clearActiveRng(); return JSON.stringify(r); };
    const first = run(a, heldA);
    run(b, heldB);
    // A roster of the same names in another order of objects (fresh records, same content).
    const again = run(a.map((n) => ({ ...n })), heldA);
    expect(again).toBe(first);
  });
});
