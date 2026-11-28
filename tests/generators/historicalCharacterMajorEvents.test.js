/**
 * #9 (STYLE-RULINGS §1, W5 HIS 2026-11-07): THE HISTORICAL CHARACTER READS THE MAJOR EVENTS.
 *
 * The `stable` pool of POLITICAL_FLAVOR is drawn at 15 per cent on any record, and four of its
 * lines denied a great event ("no catastrophe, no conquest", "no dramatic history", "events that
 * left no monuments"). Over a record carrying a `major` or `catastrophic` row those lines now name
 * the event; over a record with none they keep their plain denial. Present-then-absent on each.
 */
import { describe, it, expect } from 'vitest';
import { POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';

const textOf = (row) => (typeof row === 'function' ? row : row.text);
const MAJOR = [{ name: 'The Great Fire', type: 'disaster', severity: 'catastrophic' }];
const MINOR = [{ name: 'The Long Drought', type: 'disaster', severity: 'minor' }];
const DENIAL = /no catastrophe|no dramatic history|no great event|no monuments/i;

describe('#9 — the stable pool reads the major events before it denies one', () => {
  const stable = POLITICAL_FLAVOR.stable.map(textOf);
  it('over a record with a major event, no stable line denies a great event, and the lines that would name it', () => {
    const lines = stable.map((fn) => fn(MAJOR));
    expect(lines.filter((l) => DENIAL.test(l))).toEqual([]);
    expect(lines.filter((l) => l.includes('Great Fire')).length).toBeGreaterThanOrEqual(3);
  });
  it('over a record with only minor events, the plain denials stand (the control)', () => {
    const lines = stable.map((fn) => fn(MINOR));
    expect(lines.filter((l) => DENIAL.test(l)).length).toBeGreaterThanOrEqual(3);
  });
});
