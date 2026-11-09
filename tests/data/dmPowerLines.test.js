/**
 * WRITE-PEOPLE (2026-11-08): the DM view's patronage and capture sentences as data
 * (`src/data/people/dmPowerLines.js`), written for cars 2 and 3 (design §3.3, §3.4, §9).
 *
 * Pins: (1) the cells and counts: patronage 2 kinds × 3, capture 5 rungs × 3, 21 lines; (2) every line
 * returns a filled, stopped sentence for EVERY receipt that §3.4's derivation (or §3.3's patron) can
 * hand it — each rung is walked through each path that reaches it; (3) every patronage line names the
 * patron and the power it lends to; every capture line names the ruler, every guild an agent answers
 * to, and the underworld where the climate alone reached the rung; (4) no struck tic; (5) no line
 * repeats; and a planted control proves the checks red on a bad row.
 */
import { describe, expect, it } from 'vitest';
import {
  CAPTURE_LINES, CAPTURE_RUNGS, CAPTURE_RUNG_LABELS, PATRONAGE_LINES,
  answerClause, namedAnswerClause, patronPlace, pointWords, shareWords,
} from '../../src/data/people/dmPowerLines.js';

const STRUCK_TICS = [
  /\ba stranger\b/i, /\brather than\b/i, /\barithmetic\b/i, /\bthe record\b/i, /\btwo different things\b/i,
  /\ba separate question\b/i, /\bnothing has broken yet\b/i, /\bwhich is the kind of\b/i, /\bwhich makes it worse\b/i,
];

const RULER = 'Ruler-Council';
const GUILD = 'Guild-One';
const GUILD2 = 'Guild-Two';
const UNDER = 'Under-Power';
const A1 = { name: 'Agent-Head', rank: /** @type {const} */ (1), guild: GUILD };
const A2 = { name: 'Agent-Second', rank: /** @type {const} */ (2), guild: GUILD };
const A3 = { name: 'Agent-Third', rank: /** @type {const} */ (3), guild: GUILD };
const fx = (agents, extra = {}) => ({ ruler: RULER, agents, rulerCriminal: false, underworld: null, ...extra });

/** Every receipt §3.4's derivation can hand a rung (weights 3/2/1; capture ≥ 5 with an agent head; corrupted ≥ 3, an agent head, or a criminal ruler). */
const PATHS = {
  none: [fx([]), fx([], { underworld: UNDER })], // no criminal power, or one too weak to count
  adversarial: [fx([], { underworld: UNDER })],
  equilibrium: [
    fx([A2]), fx([A3]), fx([A3], { underworld: UNDER }), // one lesser agent
    fx([], { underworld: UNDER }), // the climate alone (its own rung, or corrupted/capture capped)
  ],
  corrupted: [
    fx([A1]), fx([A1, A3]), fx([A2, A3]), fx([{ ...A2 }, { ...A3, guild: GUILD2 }]), // an agent head; the second and the third
    fx([], { rulerCriminal: true }), fx([], { rulerCriminal: true, underworld: UNDER }), // a purchased council, no agent
    fx([A3], { rulerCriminal: true }), // a purchased council with a lesser agent
  ],
  capture: [fx([A1, A2]), fx([A1, A2, A3]), fx([A1, { ...A2, guild: GUILD2 }]), fx([A1, { ...A2, guild: GUILD2 }, A3])],
};

const PATRONS = [1, 2, 3, 'steward'].flatMap((rank) => [0.15, 0.5, 1].map((share) => ({
  name: 'Patron-Face', rank, ruler: RULER, power: 'Lent-Power', share, boost: 1.25,
})));

/** The faults of one rendered line. @param {unknown} text @param {string[]} mustName */
const faultsOfText = (text, mustName) => {
  if (typeof text !== 'string' || !text.trim()) return ['empty'];
  const faults = [];
  for (const name of mustName) if (!text.includes(name)) faults.push(`unnamed ${name}`);
  if (/undefined|null|NaN|\$\{|\{[a-z]+\}/.test(text)) faults.push('unfilled slot');
  for (const tic of STRUCK_TICS) if (tic.test(text)) faults.push(`tic ${tic}`);
  if (!/[.!?]$/.test(text)) faults.push('no closing stop');
  if (!/^[A-Z]/.test(text)) faults.push('not capitalised');
  if (/\s{2,}|\s[,.]/.test(text)) faults.push('bad spacing');
  return faults;
};

/** What a capture line must name for this receipt. */
const mustNameFor = (f, rung) => rung === 'none' ? [f.ruler] : [f.ruler, ...new Set(f.agents.map((a) => a.guild)), ...(!f.agents.length && f.underworld && !f.rulerCriminal ? [f.underworld] : [])];

describe('DM power lines (WRITE-PEOPLE, design §9)', () => {
  it('holds 2 patronage kinds × 3 and 5 capture rungs × 3: 21 lines', () => {
    expect(Object.keys(PATRONAGE_LINES)).toEqual(['open', 'hidden']);
    expect(Object.values(PATRONAGE_LINES).map((rows) => rows.length)).toEqual([3, 3]);
    expect(CAPTURE_RUNGS).toEqual(['none', 'adversarial', 'equilibrium', 'corrupted', 'capture']);
    expect(Object.keys(CAPTURE_RUNG_LABELS)).toEqual(CAPTURE_RUNGS);
    expect(CAPTURE_RUNGS.map((r) => CAPTURE_LINES[r].length)).toEqual([3, 3, 3, 3, 3]);
    const total = Object.values(PATRONAGE_LINES).flat().length + Object.values(CAPTURE_LINES).flat().length;
    expect(total).toBe(21);
  });

  it('every patronage line is clean for every patron, naming the patron and the power', () => {
    const faults = [];
    for (const [kind, rows] of Object.entries(PATRONAGE_LINES)) {
      rows.forEach((line, i) => {
        for (const f of PATRONS) for (const fault of faultsOfText(line(f), [f.name, f.power, f.ruler])) faults.push(`${kind}[${i}] rank ${f.rank} share ${f.share}: ${fault}`);
      });
    }
    expect(faults).toEqual([]);
  });

  it('every capture line is clean on every path that reaches its rung, naming the ruler and the criminals', () => {
    const faults = [];
    for (const rung of CAPTURE_RUNGS) {
      CAPTURE_LINES[rung].forEach((line, i) => {
        PATHS[rung].forEach((f, p) => {
          for (const fault of faultsOfText(line(f), mustNameFor(f, rung))) faults.push(`${rung}[${i}] path ${p}: ${fault}`);
        });
      });
    }
    expect(faults).toEqual([]);
  });

  it('the named variant names every agent; a none or adversarial line names no agent and no guild it cannot know', () => {
    for (const rung of ['equilibrium', 'corrupted', 'capture']) {
      for (const f of PATHS[rung].filter((p) => p.agents.length)) {
        const text = CAPTURE_LINES[rung][1](f);
        for (const a of f.agents) expect(text, `${rung}[1]`).toContain(a.name);
      }
    }
    for (const rung of ['none', 'adversarial']) {
      for (const line of CAPTURE_LINES[rung]) {
        // anchored: the arm above asserts every capture line clean and naming the ruler on every path, so line(f) is live prose
        for (const f of PATHS[rung]) expect(line(f)).not.toMatch(/Guild-One|Guild-Two|Agent-/);
      }
    }
    // anchored: the same arm above asserts each none line names the ruler on this fixture's path, so the text exists to be read
    for (const line of CAPTURE_LINES.none) expect(line(fx([], { underworld: UNDER }))).not.toContain(UNDER);
  });

  it('the helpers read the receipt plainly', () => {
    expect(answerClause(fx([A2, A3]))).toBe('The second and the third of Ruler-Council answer to Guild-One');
    expect(answerClause(fx([A1, { ...A3, guild: GUILD2 }]))).toBe('The head of Ruler-Council answers to Guild-One and the third to Guild-Two');
    expect(namedAnswerClause(fx([A1, A2]))).toBe('In Ruler-Council, Agent-Head, the head, and Agent-Second, the second, both answer to Guild-One');
    expect(namedAnswerClause(fx([A1, A2, A3]))).toBe('In Ruler-Council, Agent-Head, the head, Agent-Second, the second, and Agent-Third, the third, all answer to Guild-One');
    expect(namedAnswerClause(fx([A1, { ...A2, guild: GUILD2 }]))).toBe('In Ruler-Council, Agent-Head, the head, answers to Guild-One, and Agent-Second, the second, to Guild-Two');
    expect(namedAnswerClause(fx([A3]))).toBe('Agent-Third, the third of Ruler-Council, answers to Guild-One');
    expect(patronPlace('steward', RULER)).toBe('steward of Ruler-Council while its seat stands empty');
    expect([0.15, 0.25, 0.34, 0.5, 0.7, 1].map(shareWords)).toEqual(['a small share', 'a quarter share', 'a third share', 'a half share', 'a large share', 'a full share']);
    expect([0.99, 1, 1.25, 6.75].map(pointWords)).toEqual(['1', '1', '1.3', '6.8']);
  });

  it('no line repeats across the 21', () => {
    const texts = [
      ...Object.values(PATRONAGE_LINES).flat().map((line) => line(PATRONS[4])),
      ...CAPTURE_RUNGS.flatMap((rung) => CAPTURE_LINES[rung].map((line) => line(PATHS[rung][0]))),
    ];
    expect(new Set(texts).size).toBe(21);
  });

  it('a planted control reds the checks', () => {
    expect(faultsOfText(`${RULER} rules.`, [RULER, GUILD])).toContain(`unnamed ${GUILD}`);
    expect(faultsOfText(`${RULER} rules rather than serves.`, [RULER]).some((f) => f.startsWith('tic'))).toBe(true);
    expect(faultsOfText(`${RULER} answers to undefined.`, [RULER])).toContain('unfilled slot');
    expect(faultsOfText(`${RULER} rules`, [RULER])).toContain('no closing stop');
    expect(faultsOfText('', [])).toEqual(['empty']);
  });
});
