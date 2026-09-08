/**
 * institutionTable.walker.test.js — THE INSTITUTION TABLE's own gate (CLERK-LAWS §1).
 *
 * ── WHAT IT PROVES ─────────────────────────────────────────────────────────────────
 * That the table is DERIVED and stays derived; that `whoIsCounted` can never close; that
 * `whoIsExempt` is empty on every settlement the product generates and that the emptiness is
 * MEASURED rather than asserted; and that the four fences the sitting drew around this file —
 * no writer, no `exempt` field, no `bailiff` role, no persistence — are readable in the source
 * rather than promised in a comment.
 *
 * ── THE FENCE TEST IS A SOURCE SCAN, ON PURPOSE ────────────────────────────────────
 * "This module writes nothing" is not provable by calling it: a writer added tomorrow would
 * pass every behavioural assertion here. So the fences are asserted against the module's own
 * BYTES: no assignment into a settlement, no `exempt:` key, no `bailiff`, no storage import.
 * That is the same shape the estate's other structural guards use, and it fails loudly when
 * someone adds the very thing the owner reserved to themselves.
 *
 * @see src/domain/institutions/institutionTable.js
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { codeOnly } from '../helpers/codeOnlySource.js';
import {
  columnCensus, DUTY_SERVICE_KINDS, institutionTableOf, instantiatedServices, officesOf,
  TABLE_COLUMNS,
} from '../../src/domain/institutions/institutionTable.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { quantityWords } from '../../src/domain/worldPulse/demographicsHerald.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SOURCE = readFileSync(join(ROOT, 'src/domain/institutions/institutionTable.js'), 'utf8');
/**
 * ⛔ THE FENCE SCANS CODE, NOT COMMENTS — and this cost a red to learn. The module's own
 * documentation QUOTES the one live typed `exempt: true|false` in the estate
 * (`demographicsLand.js`'s site-legality flag) in order to explain why it does not belong in
 * this column, and a raw-byte fence read that sentence as the very writer it forbids. The
 * estate's `ruinFilterRoster` walker records the same asymmetry in its own header: a scan
 * that asks "does this file EXECUTE X?" must read blanked source.
 */
const CODE = codeOnly(SOURCE);

/** @param {string} tier @param {string} seed */
const town = (tier, seed) => generateSettlementPipeline(
  {
    settType: tier, culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road',
  },
  null,
  { seed, customContent: {} },
);

/**
 * The table asks for the CLOSED QUANTITY VOCABULARY rather than importing it — the Herald owns
 * it, and importing it moved a FROZEN tuning table's dependent list. The test supplies the
 * real one, so the band column is measured against the engine's own words.
 */
const WORLD = Object.freeze({ bandOf: quantityWords });

describe('the table\'s shape — eleven columns, `closed` per column', () => {
  it('carries exactly the eleven columns CLERK-LAWS §1.2 names, and `closed` is not one of them', () => {
    expect(TABLE_COLUMNS).toHaveLength(11);
    // anchored: the line above pins the list at eleven, so an emptied roster cannot pass here
    expect(TABLE_COLUMNS).not.toContain('closed');
    const table = institutionTableOf(town('town', 'table-shape'), WORLD);
    for (const column of TABLE_COLUMNS.filter((c) => c !== 'settlement')) {
      expect(table.columns[column], `missing column ${column}`).toBeTruthy();
      expect(typeof table.columns[column].closed).toBe('boolean');
      expect(Array.isArray(table.columns[column].values)).toBe(true);
      // Every column says HOW it was filled, or a reader cannot argue with it.
      expect(table.columns[column].basis.length).toBeGreaterThan(20);
    }
  });

  it('is FROZEN all the way down — a derived projection nobody can write into', () => {
    const table = institutionTableOf(town('town', 'table-frozen'), WORLD);
    expect(Object.isFrozen(table)).toBe(true);
    expect(Object.isFrozen(table.columns)).toBe(true);
    expect(Object.isFrozen(table.rows)).toBe(true);
    for (const row of table.rows.slice(0, 3)) expect(Object.isFrozen(row)).toBe(true);
  });
});

describe('the one thing the table can never say', () => {
  it('`whoIsCounted` is OPEN on every tier, and holds a BAND rather than a roll', () => {
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      const table = institutionTableOf(town(tier, `open-${tier}`), WORLD);
      expect(table.columns.whoIsCounted.closed, `${tier} closed its persons column`).toBe(false);
      // A band word, never an enumeration: at most ONE value, and it is a phrase.
      expect(table.columns.whoIsCounted.values.length).toBeLessThanOrEqual(1);
      for (const v of table.columns.whoIsCounted.values) expect(v).toMatch(/[a-z]/);
    }
  });

  it('the institution column IS closed, because the live roster is the whole set', () => {
    const settlement = town('town', 'closed-roster');
    const table = institutionTableOf(settlement, WORLD);
    expect(table.columns.institution.closed).toBe(true);
    // Closed means the values ARE the roster — and the ruin filter is what makes that true.
    expect(table.columns.institution.values.length).toBe(table.rows.length);
    expect(table.rows.length).toBeLessThanOrEqual(settlement.institutions.length);
  });
});

describe('the column census, measured across the estate', () => {
  it('finds `whoIsExempt` EMPTY on every settlement, and no `bailiff` in any office column', () => {
    /** @type {Set<string>} */
    const offices = new Set();
    let exemptHits = 0;
    let scanned = 0;
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 5; i += 1) {
        const table = institutionTableOf(town(tier, `estate-${tier}-${i}`), WORLD);
        scanned += 1;
        if (table.columns.whoIsExempt.values.length) exemptHits += 1;
        expect(table.columns.whoIsExempt.nullEverywhere).toBe(true);
        for (const office of table.columns.office.values) offices.add(office);
      }
    }
    console.log(`\nINSTITUTION TABLE · estate scan over ${scanned} settlements`
      + `\n  whoIsExempt non-empty on: ${exemptHits}`
      + `\n  distinct offices held:    ${offices.size}`
      + `\n  a bailiff anywhere:       ${[...offices].some((o) => /bailiff/i.test(o))}\n`);
    expect(scanned).toBe(30);
    expect(exemptHits).toBe(0);
    // The Brackwater noun, re-measured at this tip rather than carried from the spec.
    expect([...offices].some((o) => /bailiff/i.test(o))).toBe(false);
    // The scan must actually have found offices, or the "no bailiff" claim is vacuous.
    expect(offices.size).toBeGreaterThan(50);
  });

  it('prints the column census beside CLERK-LAWS §1.2\'s own table', () => {
    const rows = [];
    for (const tier of ['hamlet', 'town', 'city']) {
      const table = institutionTableOf(town(tier, `census-${tier}`), WORLD);
      rows.push(`  ${tier} — ${table.rows.length} live institutions`);
      for (const c of columnCensus(table)) {
        rows.push(`     ${c.column.padEnd(16)} closed=${String(c.closed).padEnd(5)}`
          + ` held=${String(c.held).padStart(4)}  ${c.sample.slice(0, 70)}`);
      }
    }
    console.log(`\nINSTITUTION TABLE · column census at the product tip\n${rows.join('\n')}\n`);
    expect(rows.length).toBeGreaterThan(20);
  });

  it('resolves the duty column from `availableServices`, not from the schema\'s empty `services`', () => {
    const settlement = town('town', 'duty-source');
    // The measured fact this table is built on: the schema declares `services` and the
    // generator writes `availableServices`.
    expect(Array.isArray(settlement.services) ? settlement.services.length : 0).toBe(0);
    expect(instantiatedServices(settlement).length).toBeGreaterThan(0);
    // And the duty filter admits a duty and refuses a craft service.
    expect(DUTY_SERVICE_KINDS.test('Tax collection')).toBe(true);
    expect(DUTY_SERVICE_KINDS.test('Register of the dead')).toBe(true);
    expect(DUTY_SERVICE_KINDS.test('Custom enchanting')).toBe(false);
    expect(DUTY_SERVICE_KINDS.test('Ale production')).toBe(false);
  });

  it('reads offices off the roster AND the governing seat', () => {
    const settlement = town('city', 'offices');
    const offices = officesOf(settlement);
    expect(offices.length).toBeGreaterThan(3);
    const seat = String(settlement.powerStructure?.governingName || '');
    if (seat) expect(offices).toContain(seat);
  });
});

describe('the fences the owner reserved — asserted against the module\'s own bytes', () => {
  it('writes nothing: no assignment into a settlement, no persistence import', () => {
    // THE LIVENESS ANCHOR for every negative in this describe: the blanked source must still
    // be the module, and must still be reading a settlement. Without it a renamed or emptied
    // file would satisfy all three refusals below by holding nothing at all.
    expect(CODE).toMatch(/export function institutionTableOf/);
    expect(CODE).toMatch(/settlement\?\.population/);
    // anchored: the two assertions above prove CODE is this module and reads a settlement
    expect(CODE).not.toMatch(/settlement\.\w+\s*=[^=]/);
    // anchored: CODE is pinned live above; an import line is raw-byte by nature
    expect(SOURCE).not.toMatch(/\bfrom\s+'[^']*(store|persist|saves|localStorage)/i);
    // anchored: CODE is pinned live above, so an empty read cannot pass this
    expect(CODE).not.toMatch(/\blocalStorage\b|\bindexedDB\b/);
  });

  it('adds no `exempt` field and no `bailiff` role — both owner-gated', () => {
    // `whoIsExempt` is a COLUMN NAME and is expected; an `exempt:` KEY would be a writer.
    // The blanker must be doing real work, or the fence is a raw-byte scan wearing its coat —
    // so the pair below is the LIVENESS ANCHOR for both refusals: the phrase IS in the source
    // and is NOT in the blanked code.
    expect(SOURCE).toMatch(/`exempt: true\|false`/);
    // anchored: SOURCE holds the phrase (line above); its absence here proves the blanker ran
    expect(CODE).not.toMatch(/`exempt: true\|false`/);
    expect(CODE).toMatch(/whoIsExempt/);
    // anchored: CODE holds `whoIsExempt` (line above), so an empty read cannot pass this
    expect(CODE).not.toMatch(/\bexempt\s*:/);
    // anchored: CODE holds `whoIsExempt` two lines up, so an empty read cannot pass this
    expect(CODE.toLowerCase()).not.toMatch(/bailiff/);
  });

  it('routes the ruin filter rather than re-spelling it', () => {
    expect(SOURCE).toMatch(/from '\.\/institutionRoster\.js'/);
    expect(SOURCE).toMatch(/\bliveInstitutions\b/);
  });

  it('is imported by NO component, generator or PDF section — it is not a product surface', () => {
    // D10 — showing the table on the DM page — is the owner's to sign. This is the assertion
    // that fails first if someone mounts it, and it reads the three trees a product surface
    // would live in.
    const hits = execSync(
      'grep -rl "institutionTable" src/components src/generators src/pdf 2>/dev/null || true',
      { cwd: ROOT, encoding: 'utf8' },
    ).trim();
    expect(hits === '' ? [] : hits.split('\n')).toEqual([]);
    // And the grep must be capable of finding something, or the fence proves nothing.
    const control = execSync(
      'grep -rl "institutionRoster" src/generators 2>/dev/null || true',
      { cwd: ROOT, encoding: 'utf8' },
    ).trim();
    expect(control.length).toBeGreaterThan(0);
  });
});
