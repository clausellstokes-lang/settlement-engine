/**
 * crimeKnowledgeSiblings.test.js — SECRET-LINES-BUILD (PAGE-8, 2026-11-20; the chair's read of 20:02, "40 APPROVED TO
 * BUILD, with five cures"): the four knowledge frames' wordings, and the five conditions under which only
 * `secret.what` and `secret.stakes` move.
 *
 * `npcGenerator.js :: generateCrimeLevel`'s 25% branch draws one of four frames exactly as before (one `pick` over the
 * frames the roster does not hold); the frame's WORDING is then chosen draw-free among the drawn row and its ten siblings
 * (`data/people/crimeKnowledgeSiblings.js`) by `kernel/proseHash.js :: pickVariantMixed`, through the one door
 * (`drawDeclared.js :: drawDeclared` over the pool the site composes, [the drawn row, ...its siblings]). Every arm below reads the lines through the SITE (a scripted stream forces the
 * branch, the other card and the frame; the keyed pick is walked over seeds), so on the code before the build — which
 * never prints a sibling — every arm is red. No sentence is quoted: the siblings come from the table, the drawn rows
 * from the site itself.
 *
 *   1. the held refusal reads a sibling as its FAMILY's frame;
 *   2. a sibling keeps its family's word class for `getStressHistory` (the same rolls, the same presentation);
 *   3. a K2 sibling is read by `npcData.js :: secretOwes` (the pair's debt tie);
 *   4. a sibling names the other card in `what` (`people/rareSecrets.js :: exclusionOf`);
 *   5. no word the merge rewrites, none of F5's venal list, none a temperament denies;
 * and the draft's lint (`docs/chair/2026-11-20/content/page/measures/page-8/secret/secretLines.mjs` §5) as a test.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { generateCrimeLevel, getStressHistory } from '../../src/generators/npcGenerator.js';
import { CRIME_KNOWLEDGE_WORDINGS, crimeKnowledgeKinOf } from '../../src/data/people/crimeKnowledgeSiblings.js';
import { secretOwes, SECRETS_DENIED_BY_TEMPERAMENT } from '../../src/data/npcData.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

const ROSTER = Object.freeze(['Aldric Ashford', 'Brenna Blackwood', 'Hilde Dunmere', 'Ivo Coldwater', 'Jorunn Ashford'].map((name, i) => Object.freeze({ id: `k${i}`, name })));
const OTHER = ROSTER[0]; // the card at index 1 draws others[0] under a 0 roll
const SUMMARY = Object.freeze({ stressTypes: [], facts: null });
/** Every sibling, keyed by its family and place: `f:i`. */
const ROWS = new Map(CRIME_KNOWLEDGE_WORDINGS.flatMap((rows, family) => rows.map((row, i) => [`${family}:${i}`, { family, row }])));
const KEYS = [...ROWS.keys()];
const fill = (t) => t.split('{npc}').join(OTHER.name);

/** A scripted stream: the listed rolls in order, then 0.5; counts the rolls taken. */
function scripted(values, seed) {
  let i = 0;
  return { seed, random: () => { const v = i < values.length ? values[i] : 0.5; i += 1; return v; }, rolls: () => i };
}
/** The site, for the card at index 1: the branch (0.1), the other card (0: ROSTER[0]), then `frameRoll`. */
function deal(frameRoll, seed, held = null) {
  const rng = scripted([0.1, 0, frameRoll], seed);
  setActiveRng(rng);
  try { return { out: generateCrimeLevel(ROSTER[1], 1, SUMMARY, ROSTER, held), rolls: rng.rolls() }; } finally { clearActiveRng(); }
}

/** THE DRAWN ROWS (wording 0), as the site prints them, and every sibling the site prints, keyed by its template. */
const BASE = new Map(); const PRINTED = new Map();
beforeAll(() => {
  for (let family = 0; family < 4; family += 1) {
    for (let s = 0; s < 3000 && (!BASE.has(family) || [...PRINTED.values()].filter((p) => p.family === family).length < CRIME_KNOWLEDGE_WORDINGS[family].length); s += 1) {
      const { out } = deal((family + 0.5) / 4, `crime-knowledge-${family}-${s}`);
      if (!out) continue;
      const kin = crimeKnowledgeKinOf(out.what);
      if (!kin) { if (!BASE.has(family)) BASE.set(family, out); continue; }
      const key = KEYS.find((k) => fill(ROWS.get(k).row.what) === out.what);
      if (key && !PRINTED.has(key)) PRINTED.set(key, { family, out });
    }
  }
});
afterEach(() => clearActiveRng());

/** The family of a printed secret: a sibling's, or the drawn row it equals. */
const familyOf = (what) => { const kin = crimeKnowledgeKinOf(what); if (kin) return kin.family; for (const [f, b] of BASE) if (b.what === what) return f; return -1; };

describe('the wording: the family drawn as before, its wording keyed among the drawn row and its ten siblings', () => {
  it('every one of the 40 siblings prints at the site, filled with the other card, beside its own stakes', () => {
    expect(PRINTED.size, `siblings printed: ${PRINTED.size} of ${KEYS.length}`).toBe(KEYS.length);
    expect(KEYS.length).toBe(40);
    expect(CRIME_KNOWLEDGE_WORDINGS.map((w) => w.length)).toEqual([10, 10, 10, 10]);
    for (const [key, { family, out }] of PRINTED) {
      const { row, family: f } = ROWS.get(key);
      expect(f).toBe(family);
      expect(out).toEqual({ what: fill(row.what), stakes: fill(row.stakes) });
    }
  });
  it('wording 0 is the drawn row, byte for byte, and the four drawn rows are no siblings', () => {
    expect([...BASE.keys()].sort()).toEqual([0, 1, 2, 3]);
    for (const [, b] of BASE) { expect(Object.keys(b).sort()).toEqual(['stakes', 'what']); expect(b.what).toContain(OTHER.name); }
  });
  it('no roll is added, removed or moved: the branch, the other card and the frame, then none', () => {
    for (let s = 0; s < 120; s += 1) for (let family = 0; family < 4; family += 1) {
      const { out, rolls } = deal((family + 0.5) / 4, `crime-knowledge-rolls-${s}`);
      expect(out).not.toBeNull();
      expect(rolls).toBe(3);
      expect(familyOf(out.what)).toBe(family);
    }
  });
});

describe('condition 1: the held refusal reads a sibling as its family\'s frame', () => {
  it('a sibling held by another card refuses its family: the draw falls to the one family left', () => {
    expect(PRINTED.size).toBe(KEYS.length);
    for (const [key, { family }] of PRINTED) {
      const left = (family + 1) % 4;
      const held = new Set([fill(ROWS.get(key).row.what), ...[0, 1, 2, 3].filter((f) => f !== family && f !== left).map((f) => BASE.get(f).what)]);
      const { out, rolls } = deal(0.1, `held-${key}`, held);
      expect(familyOf(out?.what), `held sibling ${key}: drew family ${familyOf(out?.what)}, the one left is ${left}`).toBe(left);
      expect(rolls).toBe(3);
    }
  });
  it('every family held, one of them by a sibling: no roll, and the card keeps its own secret', () => {
    expect(PRINTED.size).toBe(KEYS.length);
    for (const [key, { family }] of PRINTED) {
      const held = new Set([fill(ROWS.get(key).row.what), ...[0, 1, 2, 3].filter((f) => f !== family).map((f) => BASE.get(f).what)]);
      const { out, rolls } = deal(0.1, `held-all-${key}`, held);
      expect(out).toBeNull();
      expect(rolls).toBe(2);
    }
  });
});

describe('condition 2: a sibling keeps its family\'s word class for getStressHistory', () => {
  /** The presentation read from a secret and the rolls it took, under a fixed stream. */
  const presentation = (what) => { let rolls = 0; setActiveRng({ seed: 'stress-history', random: () => { rolls += 1; return 0.1; } }); try { return { mode: JSON.stringify(getStressHistory({ what }) ?? null), rolls }; } finally { clearActiveRng(); } };
  it('the same rolls and the same presentation as the family\'s drawn row', () => {
    expect(PRINTED.size).toBe(KEYS.length);
    for (const [key, { family, out }] of PRINTED) expect(presentation(out.what), key).toEqual(presentation(BASE.get(family).what));
  });
});

describe('condition 3: a K2 sibling is the pair\'s debt', () => {
  it('npcData.js :: secretOwes reads every printed K2 sibling as owing the other card', () => {
    const k2 = [...PRINTED].filter(([, p]) => p.family === 2);
    expect(k2.length).toBe(10);
    expect(secretOwes({ secret: BASE.get(2) }, OTHER)).toBe(true);
    for (const [key, { out }] of k2) expect(secretOwes({ secret: out }, OTHER), key).toBe(true);
  });
});

describe('condition 4: a sibling names the other card in what', () => {
  it('every printed sibling carries the other card\'s name in what, as its family\'s row does', () => {
    expect(PRINTED.size).toBe(KEYS.length);
    for (const [key, { out }] of PRINTED) expect(out.what.includes(OTHER.name), key).toBe(true);
  });
});

describe('condition 5: no word the merge rewrites, none of F5\'s venal list, none a temperament denies', () => {
  // npcGenerator.js :: mergeNPCLists rewrites a secret naming a merchant (no market) or a thieves'/criminal guild.
  const MERGE = /merchant|thieves|guild/i;
  // F5's venal list, as PAGE-1's measure reads it (origin lane/page-1-2026-11-20-card, docs/chair/2026-11-20/content/page/measures/C/f5.mjs :: venalRe).
  const VENAL = /embezzl|fencing|payroll|brib|protection scheme|for a fee|contraband|skim|selling|\bsells\b|betting against|exploitative labour|suppress a finding|been paid|paid to|is paid|for a share|pocket|keeping back|on the side|smuggl|overcharg|charges the families|cut of|kickback|monthly payment|for a purse|who pays? for it|families can pay|taking offerings|give generously|for money|for gold|for coin/i;
  it('the printed what and stakes carry none of them', () => {
    expect(PRINTED.size).toBe(KEYS.length);
    for (const [key, { out }] of PRINTED) {
      expect(MERGE.test(`${out.what} ${out.stakes}`), key).toBe(false);
      expect(VENAL.test(`${out.what} ${out.stakes}`), key).toBe(false);
      for (const [temperament, words] of Object.entries(SECRETS_DENIED_BY_TEMPERAMENT)) expect(words.test(out.what), `${temperament}: ${key}`).toBe(false);
    }
  });
});

describe('the draft\'s lint: plain, small, and nothing the card or the place may contradict', () => {
  const HOUSE = /\b(inn|tavern|alehouse|mill|miller|smithy|forge|temple|chapel|church|shrine|priest|market|stall|court|magistrate|gaol|jail|prison|watch|guard|garrison|council|granary|dock|harbour|wharf|quay|boat|ship|river|sea|shore|forest|mine|school|hospital|bank|warehouse|shop|workshop)\b/i;
  const CRIME = /\b(theft|thief|stole|stolen|steal|murder|kill|killed|crime|smuggl\w*|gang|racket|bribe\w*|forged|forgery|forging|fraud|break-in|robbed|robbery)\b/i;
  const AGE_HOUSEHOLD = /\b(young|youth|child|children|boy|girl|lad|aged?|years old|elderly|wife|husband|son|daughter|brother|sister|mother|father|family|household|widow\w*|married|marriage|grand\w+)\b/i;
  const sentences = (s) => String(s).split(/(?<=[.!?])\s+/).map((x) => x.trim());
  it('no house, place-feature, crime, age or household word; no closing stop; no sentence shared with another line or a drawn row', () => {
    expect(PRINTED.size).toBe(KEYS.length);
    const seen = new Map();
    for (const b of BASE.values()) for (const s of [...sentences(b.what), ...sentences(b.stakes)]) seen.set(s, 'a drawn row');
    for (const [key, { out }] of PRINTED) {
      const both = `${out.what} ${out.stakes}`;
      for (const re of [HOUSE, CRIME, AGE_HOUSEHOLD]) expect(both.match(re)?.[0] ?? null, key).toBeNull();
      expect(/[.!?]$/.test(out.what) || /[.!?]$/.test(out.stakes), key).toBe(false);
      for (const s of [...sentences(out.what), ...sentences(out.stakes)]) { expect(seen.get(s) ?? null, `"${s}" (${key})`).toBeNull(); seen.set(s, key); }
    }
  });
});
