/**
 * CENSUS-2g unit 2 — the decree family and the connectives read through R-AQ's channel
 * (docs/CENSUS_2_LANE_2026-11-04.md "CENSUS-2g"). Every line was read by R-AD's claim-or-colour
 * test; this file pins the MEASUREMENT the reading rests on, so the day it changes the
 * declaration is owed, not forgotten:
 *
 *  - DEC-EVENT (vid 54's pool) and DEC-PARTY are drawn only by `eventCatalogue.js ::
 *    scheduledEventClause` / `partyDeedClause`, and `decreeLineParts` splices them only from
 *    `options.scheduledEvent` / `options.partyDeed`. Nothing in `src` imports `eventCatalogue.js`
 *    and no `src` caller hands either option, so the two blocks print on no page: dead text
 *    (R-AI / R-S), left in stasis. vid 54's one presumption (`market`) stays in the ledger and is
 *    NOT written as a kernel mark: the walker's seedless calls would read the Economy pool as
 *    fail-closed, and dead text is never wired (R-AI).
 *  - The printed blocks (DEC-HAND, DEC-STANDING, DEC-FORM, DEC-OVERRIDE, DEC-FOLLOWS; vids 1–51)
 *    speak of the decree's provenance, standing, form and the register's warnings: each line
 *    presumes nothing about the settlement (colour), so no variant carries a fact mark.
 *  - The connectives are pure joinery (`{colour}`, CENSUS-2e) and are never seated (no shipped
 *    pool declares `role: modifier`): the position-keyed list stays all null.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  DECREE_EVENT_POOLS, DECREE_FOLLOWS_FROM_POOL, DECREE_FORM_POOLS, DECREE_HAND_POOLS,
  DECREE_OVERRIDE_POOLS, DECREE_STANDING_POOLS,
} from '../../../src/domain/display/stateProse/decreeProsePools.js';
import { variantFactDeclaration } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_CONNECTIVE_DECLARATIONS } from '../../../src/data/dossierConnectives.generated.js';

const ROOT = new URL('../../../', import.meta.url).pathname;
/** @param {string} dir @returns {string[]} */
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : /\.(m?js|jsx|ts|tsx)$/.test(name) ? [path] : [];
});
const SRC = walk(join(ROOT, 'src')).map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, 'utf8') }));
const OWNERS = new Set([
  'src/domain/edit/eventCatalogue.js',
  'src/domain/display/stateProse/decreeProse.js',
  'src/domain/display/stateProse/decreeProsePools.js',
]);
const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/census/declarations/DECREE_PROSE.json'), 'utf8'));

describe('the decree family — DEC-EVENT and DEC-PARTY print on no page (dead text, R-AI)', () => {
  it('nothing in src imports eventCatalogue.js (static or dynamic)', () => {
    const importers = SRC.filter((f) => !OWNERS.has(f.path) && /(?:from\s*|import\s*\(\s*)['"][^'"]*eventCatalogue(?:\.js)?['"]/.test(f.text));
    expect(importers.map((f) => f.path), 'a page now reaches DEC-EVENT: declare vid 54 `market` and hand the clause draw factsOf(record)').toEqual([]);
  });
  it('no src caller splices a scheduled-event or party-deed clause into a decree line', () => {
    const callers = SRC.filter((f) => !OWNERS.has(f.path) && /\b(?:scheduledEvent|partyDeed)\s*:/.test(f.text));
    expect(callers.map((f) => f.path)).toEqual([]);
  });
  it('vid 54 is listed with its presumption in the ledger and carries no kernel mark (stasis)', () => {
    const v54 = DECREE_EVENT_POOLS.Economy.find((v) => v.vid === 54);
    expect(v54?.text).toMatch(/market's arrangement/);
    expect(/** @type {any} */ (v54).marks).toBeUndefined();
    const line = ledger.pools.flatMap((/** @type {any} */ p) => p.lines).find((/** @type {any} */ l) => l.lineId === 'vid:54');
    expect(line.needs).toEqual(['market']);
  });
});

describe('the decree family — the printed blocks presume nothing (colour, R-AD)', () => {
  const printed = [
    ...Object.values(DECREE_HAND_POOLS), ...Object.values(DECREE_STANDING_POOLS), ...Object.values(DECREE_FORM_POOLS),
    ...Object.values(DECREE_OVERRIDE_POOLS), DECREE_FOLLOWS_FROM_POOL,
  ].flat();
  it('vids 1–51, every one read, none declares an atom', () => {
    expect(printed.map((v) => v.vid).sort((a, b) => a - b)).toEqual(Array.from({ length: 51 }, (_, i) => i + 1));
    for (const v of printed) expect([v.vid, variantFactDeclaration(v)]).toEqual([v.vid, variantFactDeclaration(undefined)]);
  });
});

describe('the connectives — pure joinery, never seated (`{colour}`)', () => {
  it('the position-keyed channel holds no declaration on any joint', () => {
    const all = Object.values(DOSSIER_CONNECTIVE_DECLARATIONS).flatMap((bySeat) => Object.values(bySeat)).flat();
    expect(all.length).toBe(12);
    expect(all.every((d) => d === null)).toBe(true);
  });
});
