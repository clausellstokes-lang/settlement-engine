/**
 * dmPowerLinesPossessive.test.js — COHERENCE-POWERS-7 (the chair's R3, from REVIEW-POWERS-FU F3; item 8 of the sixth seat):
 * A POWER'S POSSESSIVE IN THE DM VIEW GOES THROUGH THE ONE LEAF. The patron's go-between line formed it by hand —
 * "carries Merchant Guilds's requests to the two above", "Merchant Guilds's requests go through …" (35 of the census's
 * 720 towns, every rendered view read by the reader's possess.mjs) — and two capture lines did the same for the criminal
 * names ("the criminal houses's people"). Each now reads domain/display/powerSentenceName.js :: powerPossessive.
 * The guard: (1) no interpolation in the file but a person's name is followed by a hand-formed "'s"; (2) the lines read
 * the plural possessive for a plural power, and the singular for a singular one, executed.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CAPTURE_LINES, PATRONAGE_LINES } from '../../src/data/people/dmPowerLines.js';

const SOURCE = readFileSync(new URL('../../src/data/people/dmPowerLines.js', import.meta.url), 'utf8');

describe('COHERENCE-POWERS-7 (R3) · the DM view forms no possessive of a power by hand', () => {
  it('the source: no interpolation but a person\'s name (`f.name`) takes a hand-formed "\'s"', () => {
    const hand = [...SOURCE.matchAll(/\$\{([^}]*)\}['’]s\b/g)].map((m) => m[1]).filter((x) => x.trim() !== 'f.name');
    expect(hand).toEqual([]);
  });
  it('the patron who carries a plural power\'s requests: "Merchant Guilds\' requests"; a singular: "the Thieves\' Guild\'s"', () => {
    const at3 = { name: 'Ada Vell', rank: 3, ruler: 'Town Council', power: 'Merchant Guilds', share: 0.3, boost: 2 };
    const line = PATRONAGE_LINES.open.map((l) => l(at3)).find((t) => t.includes('requests'));
    expect(line).toContain("carries Merchant Guilds' requests to the two above.");
    expect(line).not.toContain("Guilds's");
    const steward = { ...at3, rank: 'steward' };
    const lineS = PATRONAGE_LINES.open.map((l) => l(steward)).find((t) => t.includes('requests'));
    expect(lineS).toContain("Merchant Guilds' requests go through Ada Vell.");
    const crim = { ruler: 'Town Council', agents: [], rulerCriminal: false, underworld: null };
    const said = [...CAPTURE_LINES.adversarial, ...CAPTURE_LINES.equilibrium].map((l) => l(crim)).join(' ');
    expect(said).not.toMatch(/houses['’]s\b/);
  });
});
