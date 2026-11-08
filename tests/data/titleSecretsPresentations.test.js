/**
 * WRITE-PEOPLE (2026-11-08): item 15 — secrets and presentations BY TITLE as data
 * (`src/data/people/titleSecretsPresentations.js`), for car 4 to wire (design §6.5, J-16).
 *
 * Pins: (1) the 83 titles of the chair's 90% coverage cut (of the 22,892 fallback cards on the soak
 * 1,000 at the lane's base), in card-count order, each a POOL_BY_TITLE title its pool map sends to a
 * fallback; (2) every title holds
 * 3 secrets and 3 presentations in EXACTLY the record shapes the draw sites read — `{ secret, stakes }`
 * (NPC_CRIMINAL_SECRETS_BY_HOLDER's row) and `{ impression, disposition, behaviour }` (pickTitle's
 * record), the disposition one of NPC_PLOT_HOOKS_DATA's keys; (3) the estate's punctuation (a secret
 * and its stakes are sentence-cased fragments with no closing stop; an impression and a behaviour are
 * stopped sentences); (4) no struck tic, no gendered reflexive for the face (its gender is drawn), no
 * slot, no magic asserted by a mundane title (the world law's own reader); (5) no text repeats; and a
 * planted control proves the checks red on a bad row.
 */
import { describe, expect, it } from 'vitest';
import {
  TITLE_CARDS_ON_THE_1000, TITLE_ORDER, TITLE_PRESENTATIONS, TITLE_SECRETS,
} from '../../src/data/people/titleSecretsPresentations.js';
import { NPC_PLOT_HOOKS_DATA } from '../../src/data/npcData.js';
import { POOL_BY_TITLE, roleHasGoalPool } from '../../src/generators/people/poolMap.js';
import { textAssertsFunctionalMagic } from '../../src/domain/magicAssertionText.js';

const STRUCK_TICS = [
  /\ba stranger\b/i, /\brather than\b/i, /\barithmetic\b/i, /\bthe record\b/i, /\btwo different things\b/i,
  /\ba separate question\b/i, /\bnothing has broken yet\b/i, /\bwhich is the kind of\b/i, /\bwhich makes it worse\b/i,
];

/** The faults of one text field. @param {unknown} text @param {boolean} stopped @param {boolean} magicAllowed */
const textFaults = (text, stopped, magicAllowed) => {
  if (typeof text !== 'string' || !text.trim()) return ['empty'];
  const faults = [];
  if (!/^[A-Z]/.test(text)) faults.push('not capitalised');
  if (stopped && !/[.!?]$/.test(text)) faults.push('no closing stop');
  if (!stopped && /[.!?]$/.test(text)) faults.push('a closing stop on a fragment');
  if (/undefined|\$\{|\{[a-z]+\}/.test(text)) faults.push('unfilled slot');
  if (/\b(himself|herself)\b/i.test(text)) faults.push('gendered reflexive');
  if (/\s{2,}|\s[,.;]/.test(text)) faults.push('bad spacing');
  for (const tic of STRUCK_TICS) if (tic.test(text)) faults.push(`tic ${tic}`);
  if (!magicAllowed && textAssertsFunctionalMagic(text)) faults.push('asserts magic');
  return faults;
};

/** The faults of one secret row. @param {any} row @param {boolean} magicAllowed */
const secretFaults = (row, magicAllowed) => {
  if (!row || typeof row !== 'object') return ['not a row'];
  const keys = Object.keys(row).sort().join(',');
  const faults = keys === 'secret,stakes' ? [] : [`keys ${keys}`];
  for (const k of ['secret', 'stakes']) for (const f of textFaults(row[k], false, magicAllowed)) faults.push(`${k}: ${f}`);
  return faults;
};

/** The faults of one presentation row. @param {any} row @param {boolean} magicAllowed */
const presentationFaults = (row, magicAllowed) => {
  if (!row || typeof row !== 'object') return ['not a row'];
  const keys = Object.keys(row).sort().join(',');
  const faults = keys === 'behaviour,disposition,impression' ? [] : [`keys ${keys}`];
  if (!Object.hasOwn(NPC_PLOT_HOOKS_DATA, row.disposition)) faults.push(`disposition ${row.disposition}`);
  for (const k of ['impression', 'behaviour']) for (const f of textFaults(row[k], true, magicAllowed)) faults.push(`${k}: ${f}`);
  return faults;
};

const magicTitle = (/** @type {string} */ title) => POOL_BY_TITLE[title]?.[1] === 'magic' || ['the message-master', 'the skydock master', 'the planar factor', 'the envoy', 'the dragon'].includes(title);

describe('titleSecretsPresentations (WRITE-PEOPLE, item 15)', () => {
  it('holds the 83 titles of the 90% coverage cut in card-count order, each a mapped title', () => {
    expect(TITLE_ORDER).toHaveLength(83);
    expect(new Set(TITLE_ORDER).size).toBe(83);
    expect(Object.keys(TITLE_SECRETS)).toEqual(TITLE_ORDER);
    expect(Object.keys(TITLE_PRESENTATIONS)).toEqual(TITLE_ORDER);
    const counts = TITLE_ORDER.map((t) => TITLE_CARDS_ON_THE_1000[t]);
    expect(counts.every((n, i) => i === 0 || n <= counts[i - 1])).toBe(true);
    // the cut: the first prefix whose cards reach 90% of the 22,892 fallback cards
    const covered = counts.reduce((a, b) => a + b, 0);
    expect(covered).toBe(20605);
    expect(covered / 22892).toBeGreaterThanOrEqual(0.9);
    expect((covered - counts[counts.length - 1]) / 22892).toBeLessThan(0.9);
    expect(TITLE_ORDER[82]).toBe('the charter master');
    expect(TITLE_ORDER.filter((t) => !POOL_BY_TITLE[t])).toEqual([]);
    expect(TITLE_ORDER.slice(0, 3)).toEqual(['the miller', 'the innkeeper', 'the warehouse factor']);
  });

  it('every title is one its pool map sends to a fallback (its role holds no goal pool, or it is an Elder seat)', () => {
    const notFallback = TITLE_ORDER.filter((t) => roleHasGoalPool(POOL_BY_TITLE[t][0]) && POOL_BY_TITLE[t][0] !== 'Elder');
    expect(notFallback).toEqual([]);
  });

  it('every title holds 3 secrets and 3 presentations, each clean and in the record shape', () => {
    const faults = [];
    for (const title of TITLE_ORDER) {
      const magic = magicTitle(title);
      const secrets = TITLE_SECRETS[title];
      const presentations = TITLE_PRESENTATIONS[title];
      if (secrets.length !== 3) faults.push(`${title}: ${secrets.length} secrets`);
      if (presentations.length !== 3) faults.push(`${title}: ${presentations.length} presentations`);
      secrets.forEach((row, i) => { for (const f of secretFaults(row, magic)) faults.push(`${title} secret[${i}] ${f}`); });
      presentations.forEach((row, i) => { for (const f of presentationFaults(row, magic)) faults.push(`${title} presentation[${i}] ${f}`); });
    }
    expect(faults).toEqual([]);
    const total = TITLE_ORDER.reduce((n, t) => n + TITLE_SECRETS[t].length + TITLE_PRESENTATIONS[t].length, 0);
    expect(total).toBe(498);
  });

  it('a title varies its dispositions, and no text repeats anywhere in the table', () => {
    const flat = TITLE_ORDER.filter((t) => new Set(TITLE_PRESENTATIONS[t].map((p) => p.disposition)).size < 2);
    expect(flat).toEqual([]);
    const seen = new Map();
    const dupes = [];
    for (const title of TITLE_ORDER) {
      const texts = [
        ...TITLE_SECRETS[title].flatMap((r, i) => [[`secret[${i}]`, r.secret], [`stakes[${i}]`, r.stakes]]),
        ...TITLE_PRESENTATIONS[title].flatMap((r, i) => [[`impression[${i}]`, r.impression], [`behaviour[${i}]`, r.behaviour]]),
      ];
      for (const [field, text] of texts) {
        if (seen.has(text)) dupes.push(`${title} ${field} = ${seen.get(text)}`);
        seen.set(text, `${title} ${field}`);
      }
    }
    expect(dupes).toEqual([]);
  });

  it('a planted control reds the checks', () => {
    expect(secretFaults({ secret: 'Has a secret.', stakes: 'Ruin' }, false)).toContain('secret: a closing stop on a fragment');
    expect(secretFaults({ secret: 'Steals rather than earns', stakes: 'Ruin' }, false).some((f) => f.includes('tic'))).toBe(true);
    expect(secretFaults({ secret: 'Steals', stakes: 'Ruin', what: 'x' }, false)).toContain('keys secret,stakes,what');
    expect(secretFaults({ secret: 'Keeps it to herself', stakes: 'Ruin' }, false)).toContain('secret: gendered reflexive');
    expect(presentationFaults({ impression: 'Calm.', disposition: 'hostile', behaviour: 'Waits.' }, false)).toContain('disposition hostile');
    expect(presentationFaults({ impression: 'Calm', disposition: 'cautious', behaviour: 'Waits.' }, false)).toContain('impression: no closing stop');
    expect(textFaults('Casts a spell to mend the wall.', true, false)).toContain('asserts magic');
  });
});
