/**
 * WRITE-PEOPLE (2026-11-08): the handler tie's prose as data (`src/data/people/handlerTieLines.js`),
 * written for car 1 to wrap in `npcData.js :: pairProse` (design §1.5; the chair's ruling: fear's four
 * leverage sub-kinds are four archetype keys, 68 lines in all).
 *
 * Pins: (1) the seven keys, their labels, their styling types and the cell counts (6/6 ×3, 4/4 ×4);
 * (2) every row is the estate's shape (a closure, or `{ line, colour?, needs? }`) and returns a
 * non-empty string for two stand-in cards and the force words; (3) every line names BOTH cards
 * (`relationshipArchetypes.js :: bothNamedTensions` cycles an overflow tie through the tension lines
 * that name both, so every tension line must; the desc lines are held to the same); (4) no struck tic
 * (STYLE-RULINGS §2.3, WIRING-RULINGS §7) and no unfilled slot; (5) no line repeats; and a planted
 * control proves the checks red on a bad row.
 */
import { describe, expect, it } from 'vitest';
import { HANDLER_TIE_KEYS, HANDLER_TIE_LINES } from '../../src/data/people/handlerTieLines.js';

const AGENT = { name: 'Agent-of-the-tie', title: 'the miller', category: 'other' };
const HANDLER = { name: 'Handler-of-the-tie', title: 'the fence', category: 'criminal' };
const FORCE = Object.freeze({ body: 'watch', members: 'watchmen', member: 'watchman' });

/** The struck tics (STYLE-RULINGS §2 law 3; WIRING-RULINGS §7's "which makes it worse"). */
const STRUCK_TICS = [
  /\ba stranger\b/i, /\brather than\b/i, /\barithmetic\b/i, /\bthe record\b/i, /\btwo different things\b/i,
  /\ba separate question\b/i, /\bnothing has broken yet\b/i, /\bwhich is the kind of\b/i, /\bwhich makes it worse\b/i,
];

const closureOf = (/** @type {any} */ row) => (typeof row === 'function' ? row : row?.line);

/** Every fault of one row, as strings (empty when the row is clean). */
const faultsOf = (/** @type {any} */ row) => {
  const faults = [];
  const fn = closureOf(row);
  if (typeof fn !== 'function') return ['not a closure or { line }'];
  if (typeof row === 'object') {
    const extra = Object.keys(row).filter((k) => !['line', 'colour', 'needs'].includes(k));
    if (extra.length) faults.push(`unknown fields ${extra.join(',')}`);
  }
  const text = fn(AGENT, HANDLER, FORCE);
  if (typeof text !== 'string' || !text.trim()) return [...faults, 'empty'];
  if (!text.includes(AGENT.name)) faults.push('agent unnamed');
  if (!text.includes(HANDLER.name)) faults.push('handler unnamed');
  if (/undefined|\$\{|\{[a-z]+\}/.test(text)) faults.push('unfilled slot');
  for (const tic of STRUCK_TICS) if (tic.test(text)) faults.push(`tic ${tic}`);
  if (!/[.!?]$/.test(text)) faults.push('no closing stop');
  return faults;
};

describe('HANDLER_TIE_LINES (WRITE-PEOPLE, design §1.5)', () => {
  it('holds the seven archetype keys with their labels, types and counts: 68 lines', () => {
    expect(HANDLER_TIE_KEYS).toEqual([
      'handler_partnership', 'handler_patron', 'handler_cause',
      'handler_leverage_debt', 'handler_leverage_secret', 'handler_leverage_crime', 'handler_leverage_loved',
    ]);
    const shape = Object.fromEntries(Object.entries(HANDLER_TIE_LINES).map(([k, a]) => [k, [a.label, a.type, a.desc.length, a.tension.length]]));
    expect(shape).toEqual({
      handler_partnership: ['Silent Partnership', 'patron_client', 6, 6],
      handler_patron: ['The Patron No One Names', 'patron_client', 6, 6],
      handler_cause: ['Sworn to the Cause', 'ally', 6, 6],
      handler_leverage_debt: ['Held Over Them', 'debtor_creditor', 4, 4],
      handler_leverage_secret: ['Held Over Them', 'debtor_creditor', 4, 4],
      handler_leverage_crime: ['Held Over Them', 'debtor_creditor', 4, 4],
      handler_leverage_loved: ['Held Over Them', 'debtor_creditor', 4, 4],
    });
    const total = Object.values(HANDLER_TIE_LINES).reduce((n, a) => n + a.desc.length + a.tension.length, 0);
    expect(total).toBe(68);
  });

  it('every row is clean: a closure that returns a filled line naming both cards, no struck tic', () => {
    const faults = [];
    for (const [key, archetype] of Object.entries(HANDLER_TIE_LINES)) {
      for (const field of /** @type {const} */ (['desc', 'tension'])) {
        archetype[field].forEach((row, i) => {
          for (const fault of faultsOf(row)) faults.push(`${key}.${field}[${i}]: ${fault}`);
        });
      }
    }
    expect(faults).toEqual([]);
  });

  it('no line repeats, within a kind or across the seven', () => {
    const seen = new Map();
    const dupes = [];
    for (const [key, archetype] of Object.entries(HANDLER_TIE_LINES)) {
      for (const field of ['desc', 'tension']) {
        archetype[field].forEach((/** @type {any} */ row, /** @type {number} */ i) => {
          const text = closureOf(row)(AGENT, HANDLER, FORCE);
          if (seen.has(text)) dupes.push(`${key}.${field}[${i}] = ${seen.get(text)}`);
          seen.set(text, `${key}.${field}[${i}]`);
        });
      }
    }
    expect(dupes).toEqual([]);
    expect(seen.size).toBe(68);
  });

  it('a planted control reds the checks (one fault of each kind)', () => {
    expect(faultsOf((r) => `${r.name} keeps the books.`)).toContain('handler unnamed');
    expect(faultsOf((r, s) => `${r.name} pays ${s.name}, rather than the guild.`).some((f) => f.startsWith('tic'))).toBe(true);
    expect(faultsOf((r, s) => `${r.name} and ${s.name} meet at ${s.house}.`)).toContain('unfilled slot');
    expect(faultsOf({ line: () => '' })).toContain('empty');
    expect(faultsOf({ line: (r, s) => `${r.name} owes ${s.name}.`, weight: 2 })).toContain('unknown fields weight');
    expect(faultsOf('a string')).toEqual(['not a closure or { line }']);
  });
});
