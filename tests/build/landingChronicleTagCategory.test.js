/**
 * tests/build/landingChronicleTagCategory.test.js — A LANDING CHRONICLE TAG
 * NEVER CONTRADICTS ITS OWN EVENT.
 *
 * The landing's realm chronicle prints each beat under a chip ("faith",
 * "stressor", "trade"). The chip used to be the SLOT's name, and the trade
 * slot's pattern also takes crime beats, so "Thieves and racketeers are working
 * Cnocby's streets in the open." shipped under TRADE (VISIBLE-BUGS item 2,
 * 2026-11-12; seeds lf-001..040: 27 of 120 entries). The tag is now the event's
 * own category (scripts/generate-landing-fixture.mjs :: chronicleTagFor).
 *
 * The categories below are this test's OWN statement of what each chip may sit
 * over, keyed by the event's `impactKind` — not the script's table — so the
 * guard cannot be satisfied by editing the table it guards.
 */
import { describe, it, expect } from 'vitest';
import { analyze, chroniclePicksFor } from '../../scripts/generate-landing-fixture.mjs';

/** What each landing chip may honestly sit over, by the event's impactKind. */
const CHIP_MAY_SIT_OVER = Object.freeze({
  trade: (k) => /trade|route|blockade|market/.test(k) && !/crime/.test(k),
  crime: (k) => /crime/.test(k),
  faith: (k) => /religio|faith|deity|conversion/.test(k),
  stressor: (k) => /^stressor_birth_|conflict|war|siege|raider/.test(k),
});

// lf-033 is the landing's own seed; lf-003 and lf-004 also carry a crime beat
// into the trade slot (red on the slot-tag plant, 2026-11-12); lf-001 and lf-002
// carry none and stay as controls.
const SEEDS = ['lf-033', 'lf-001', 'lf-002', 'lf-003', 'lf-004'];

describe('landing chronicle: each tag agrees with its own event', () => {
  it('no chronicle tag contradicts its event\'s category, on every seed', () => {
    const contradictions = [];
    for (const seed of SEEDS) {
      const picks = chroniclePicksFor(analyze(seed).news);
      expect(picks.length, `${seed}: anti-vacuity`).toBeGreaterThan(0);
      for (const p of picks) {
        if (!(CHIP_MAY_SIT_OVER[p.kind]?.(String(p.entry.impactKind ?? '')) ?? false)) {
          contradictions.push(`${seed}: ${p.kind} over ${p.entry.impactKind}: ${p.entry.summary || p.entry.headline}`);
        }
      }
    }
    expect(contradictions).toEqual([]);
  }, 300_000);
});
