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
  COLUMN_SOURCES, columnCensus, DUTY_SERVICE_KINDS, firedDutyIncome, institutionTableOf,
  instantiatedServices, officesOf, OPEN_BY_LAW, sourcesAllRead, TABLE_COLUMNS, unreadSourcesOf,
} from '../../src/domain/institutions/institutionTable.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { quantityWords } from '../../src/domain/worldPulse/demographicsHerald.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

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

  it('PINS `settlement.services` PERMANENTLY ABSENT — the key is never written, on any tier', () => {
    // ⛔ LT40 car 2 — ENFORCEMENT, NOT DISCOVERY. ODQ §912.7(7) recorded "`settlement.services`
    // is EMPTY on every generated town (the duty column reads `availableServices`)", and this
    // module's own header already carries the named-seed measurement. What did not exist was a
    // gate: the arm above asserts a LENGTH, and `services: []` has length zero too — so a
    // writer that regrew the field as an empty array, or a reader that started keying on it,
    // would pass. This arm asserts the KEY IS NOT ON THE RECORD, over the same thirty
    // settlements the estate scan walks, so the field cannot quietly come back to life.
    //
    // ⛔ WHAT THIS PIN DOES NOT LICENSE. Populating the field, or retiring it from
    // `settlement.schema.js`, is a persistence/schema-shape change and is owner-gated; it also
    // MOVES OUTPUT in either direction, because `src/lib/structuralFingerprint.js:261` reads
    // `arr(settlement.services).length` as a constant 0 INSIDE a fingerprint. The other two
    // readers of the always-empty field — `src/store/settlementGenerateAction.js:384` and
    // `src/domain/worldPulse/factionCompetition.js:156`/`:186` — are named, not changed.
    /** @type {string[]} */
    const carriers = [];
    let scanned = 0;
    let serviceRows = 0;
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 5; i += 1) {
        const settlement = town(tier, `estate-${tier}-${i}`);
        scanned += 1;
        if (Object.prototype.hasOwnProperty.call(settlement, 'services')) carriers.push(`${tier}-${i}`);
        serviceRows += instantiatedServices(settlement).length;
      }
    }
    console.log(`\nINSTITUTION TABLE · the services field over ${scanned} settlements`
      + `\n  rows on \`availableServices\`: ${serviceRows}`
      + `\n  settlements carrying a \`services\` key: ${carriers.length}\n`);
    expect(scanned).toBe(30);
    // THE LIVENESS ANCHOR, and it is the header's own figure re-taken rather than quoted: the
    // duty source the table really reads is populated on this very walk, so "no `services`"
    // cannot be an empty scan of settlements that carry no services at all.
    expect(serviceRows, 'the header claims 1,678 instantiated service rows over these thirty')
      .toBe(1678);
    expect(
      carriers,
      'a generation step began writing `settlement.services`. The schema declares the field and'
      + ' nothing has ever written it; three readers count it and get a constant 0, one of them'
      + ' inside a FINGERPRINT. Populating it is owner-gated and output-moving — see'
      + ' settlement.schema.js\'s `services` typedef before changing this.',
    ).toEqual([]);
    // THE PLANTED CONTROL — the predicate convicts, and it convicts the spelling the LENGTH
    // arm above cannot see. Without this the refusal could be a predicate that never fires.
    const planted = { ...town('town', 'services-control'), services: [] };
    expect(Object.prototype.hasOwnProperty.call(planted, 'services')).toBe(true);
    expect(Array.isArray(planted.services) ? planted.services.length : 0).toBe(0);
    const plantedCarriers = [planted].filter(
      (s) => Object.prototype.hasOwnProperty.call(s, 'services'),
    );
    expect(plantedCarriers.length, 'the same predicate the refusal uses must catch a planted key')
      .toBe(1);
  });

  it('reads offices off the roster AND the governing seat', () => {
    const settlement = town('city', 'offices');
    const offices = officesOf(settlement);
    expect(offices.length).toBeGreaterThan(3);
    const seat = String(settlement.powerStructure?.governingName || '');
    if (seat) expect(offices).toContain(seat);
  });
});

describe('THE HONESTY RULE — a column is `closed` only where every source the spec names is read', () => {
  it('derives every `closed` flag from the source roster, so a closed column with an unread source cannot exist', () => {
    const table = institutionTableOf(town('town', 'closure-honesty'), WORLD);
    /** @type {string[]} */
    const offenders = [];
    for (const column of TABLE_COLUMNS.filter((c) => c !== 'settlement')) {
      if (table.columns[column].closed && !sourcesAllRead(column)) {
        offenders.push(`${column} is closed with ${unreadSourcesOf(column).length} unread source(s): ${unreadSourcesOf(column).join(' · ')}`);
      }
    }
    expect(offenders).toEqual([]);
    // ANTI-VACUITY: the implication above is trivially satisfied by a table that closes
    // nothing, so the roster must actually distinguish. Some columns close and some do not.
    const closed = TABLE_COLUMNS.filter((c) => c !== 'settlement').filter((c) => table.columns[c].closed);
    expect(closed.length).toBeGreaterThan(0);
    expect(closed.length).toBeLessThan(TABLE_COLUMNS.length - 1);
    // Every column declares at least one source, with a citation a reader can check.
    for (const column of TABLE_COLUMNS.filter((c) => c !== 'settlement')) {
      expect(COLUMN_SOURCES[column], `no source roster for ${column}`).toBeTruthy();
      expect(COLUMN_SOURCES[column].length).toBeGreaterThan(0);
      for (const row of COLUMN_SOURCES[column]) {
        expect(typeof row.read).toBe('boolean');
        // `NL-4` is a legitimate citation and is four characters; the bar is "a citation
        // exists and is not a stub", not a word count.
        expect(row.cite.length).toBeGreaterThan(3);
      }
    }
  });

  it('holds the three partially-filled columns OPEN, and names what is unread on each', () => {
    const table = institutionTableOf(town('town', 'closure-open'), WORLD);
    // SITTING §L.2 item 62: over-licensing a quantifier is the forbidden direction.
    expect(table.columns.whatItDoes.closed).toBe(false);
    expect(table.columns.whatItDoesNotDo.closed).toBe(false);
    // `holderRole`'s BASIS names what the code does — `absent`, never `inferred` over a null.
    expect(table.columns.holderRole.closed).toBe(false);
    expect(table.columns.holderRole.basis).toMatch(/^absent:/);
    // anchored: the line above pins the basis string live, so an emptied basis cannot pass
    expect(table.columns.holderRole.basis).not.toMatch(/inferred licence|basis: 'inferred'/);
    expect(table.rows.every((r) => r.holderBasis === 'absent')).toBe(true);
    // anchored: the rows above prove the table is populated, so these are not empty reads
    expect(unreadSourcesOf('whatItDoes').length).toBeGreaterThan(0);
    expect(unreadSourcesOf('whatItDoesNotDo').length).toBeGreaterThan(0);
    expect(table.columns.whatItDoes.basis).toContain('UNREAD:');
    expect(table.columns.whatItDoesNotDo.basis).toContain('UNREAD:');
    // And the two columns the LAW holds open stay open whatever their roster says.
    expect(Object.keys(OPEN_BY_LAW)).toContain('whoIsCounted');
    expect(table.columns.whoIsCounted.closed).toBe(false);
  });

  it('CLOSES `whatItCounts` because it now reads the FIRED INCOME ROW — a positive twin, not a flag', () => {
    // The source is read, and the proof is that a settlement carrying ONLY an income duty
    // reaches the column. Without the read this is empty; with it, it holds the duty.
    const bare = institutionTableOf({
      id: 'twin', institutions: [], npcs: [], availableServices: {},
      economicState: { incomeSources: [{ source: 'Church Tithes' }, { source: 'Wool & Textile Trade' }] },
    }, WORLD);
    expect(bare.columns.whatItCounts.values).toEqual(['Church Tithes']);
    expect(bare.columns.whatItCounts.closed).toBe(true);
    // PRESENT-THEN-ABSENT: the same table with no income rows holds nothing, so the twin
    // proves the READ and not merely the filter.
    const without = institutionTableOf({
      id: 'twin', institutions: [], npcs: [], availableServices: {},
    }, WORLD);
    expect(without.columns.whatItCounts.values).toEqual([]);
    expect(firedDutyIncome({ economicState: { incomeSources: [{ source: 'Market Taxes' }] } })).toEqual(['Market Taxes']);
    // The plural stems are the repair the second source exposed: the SAME service names, and
    // three income sources that a singular-only filter refused.
    expect(DUTY_SERVICE_KINDS.test('Market Taxes')).toBe(true);
    expect(DUTY_SERVICE_KINDS.test('Tax collection')).toBe(true);
    expect(DUTY_SERVICE_KINDS.test('Church Tithes')).toBe(true);
    expect(DUTY_SERVICE_KINDS.test('Gate Tolls')).toBe(true);
    // and still refuses the craft service the bare `custom` stem admitted
    expect(DUTY_SERVICE_KINDS.test('Custom enchanting')).toBe(false);
    expect(DUTY_SERVICE_KINDS.test('Wool & Textile Trade')).toBe(false);
  });

  it('READS THE THIRD SOURCE: `coinFlows.taxed` reaches the basis, present-then-absent', () => {
    // ⛔ THE COLUMN CLOSED ON A SOURCE NO ARM COULD SEE (INSTR-912 car 10, cure 11; FOLD-2
    // P10). `whatItCounts.closed` is DERIVED from "every source CLERK-LAWS §1.2 names is
    // read", and its third source — `economicState.treasury.coinFlows.taxed` — reaches only a
    // `basis` STRING that nothing asserted. On every generated settlement the ABSENT branch is
    // taken (the ledger is a world-pulse structure no generator writes), so replacing the read
    // with `NaN` left the walker 17/17 green: `closed === true` — the over-licensing
    // direction §L.2 item 62 forbids — rested on a read whose removal no arm could detect.
    // The PRESENT branch is the only place the read is observable, so that is where the arm
    // goes. Sweep plant #85 executes it.
    //
    // ⭐ AND THE FIXTURE NOW CARRIES THE SHAPE THE WORLD CARRIES (INSTR-912 car 11). Car 10's
    // fixture put the ledger at the TOP LEVEL, which is where car 9's read looked and where
    // no writer in the estate ever writes — so a green present-branch arm proved only that
    // the code and its own fixture agreed with each other. Both moved to the produced path.
    const withTreasury = institutionTableOf({
      id: 'coin', institutions: [], npcs: [], availableServices: {},
      economicState: { treasury: { coinFlows: { taxed: 42 } } },
    }, WORLD);
    const without = institutionTableOf({
      id: 'coin', institutions: [], npcs: [], availableServices: {},
    }, WORLD);
    expect(withTreasury.columns.whatItCounts.basis, 'the magnitude the source carries is READ and reported')
      .toContain('economicState.treasury.coinFlows.taxed = 42');
    expect(without.columns.whatItCounts.basis, 'and its absence is reported as absence, never as silence')
      .toContain('economicState.treasury.coinFlows.taxed absent on this settlement');
    expectPresentThenAbsent(
      withTreasury.columns.whatItCounts.basis,
      without.columns.whatItCounts.basis,
      '= 42',
      'the third source\'s own value',
    );
    // A ZERO IS A READING, NOT AN ABSENCE. `Number.isFinite(0)` is true, and a source that
    // read `0` as "absent" would be unable to distinguish an untaxed town from an unwritten
    // treasury — the exact confusion the `basis` exists to prevent.
    expect(institutionTableOf({
      id: 'coin', institutions: [], npcs: [], availableServices: {},
      economicState: { treasury: { coinFlows: { taxed: 0 } } },
    }, WORLD).columns.whatItCounts.basis).toContain('economicState.treasury.coinFlows.taxed = 0');
    // AND THE COLUMN'S FLAG IS UNMOVED EITHER WAY: this arm proves the READ, not a licence.
    expect(withTreasury.columns.whatItCounts.closed).toBe(true);
    expect(without.columns.whatItCounts.closed).toBe(true);
    expect(sourcesAllRead('whatItCounts'), 'all three sources declared read').toBe(true);
    expect(COLUMN_SOURCES.whatItCounts.length, 'and there are three of them').toBe(3);
  });

  it('AND IT READS THE PRODUCED PATH: `economicState.treasury`, never `settlement.treasury`', () => {
    // ⛔ THE DEFECT THIS ARM FORECLOSES (INSTR-912 car 11, measured). A guarded read of a key
    // NO WRITER PRODUCES cannot throw: `Number(settlement?.treasury?.coinFlows?.taxed)` on a
    // settlement whose ledger lives under `economicState` is `NaN` on every world that will
    // ever exist, so the ABSENT branch is not merely the common case — it is the ONLY
    // reachable one, and the source declared `read: true` is read from nothing. Car 9 shipped
    // exactly that, and only the observed-shape ratchet could see it, because the arm above
    // and its fixture agreed with the code about the wrong path. THE ONLY WRITER of a coin
    // ledger anywhere in the estate is `advanceTreasury`, which writes it INSIDE
    // `economicState` (src/domain/worldPulse/treasury.js:1253), and the module's own reader
    // takes it from there (`treasuryRecordOf`, :625) — so the produced path is the only path
    // a read may use. This arm drives BOTH shapes through the real function.
    const base = { id: 'coin', institutions: [], npcs: [], availableServices: {} };
    const produced = institutionTableOf(
      { ...base, economicState: { treasury: { coinFlows: { taxed: 7 } } } }, WORLD,
    ).columns.whatItCounts.basis;
    const topLevel = institutionTableOf(
      { ...base, treasury: { coinFlows: { taxed: 7 } } }, WORLD,
    ).columns.whatItCounts.basis;
    expect(produced, 'the ledger at the path the pulse writer produces IS read')
      .toContain('economicState.treasury.coinFlows.taxed = 7');
    expect(topLevel, 'and a ledger at the top level — a shape nothing writes — is NOT')
      .toContain('economicState.treasury.coinFlows.taxed absent on this settlement');
    // The negative is anchored on a LIVE sibling of the same basis string: the absence
    // clause the same branch writes. A basis that drifted, emptied or stopped naming the
    // path reds on the anchor instead of passing the exclusion vacuously.
    expectAbsentWithAnchor(
      topLevel,
      '= 7',
      'economicState.treasury.coinFlows.taxed absent on this settlement',
      'a value planted at the phantom top-level path never reaches the basis',
    );
    // AND THE SOURCE ROSTER NAMES THE PATH IT READS, so the declaration cannot drift back to
    // the top level while the code stays right (or the reverse, which is what car 9 shipped).
    const third = COLUMN_SOURCES.whatItCounts[2];
    expect(third.source, 'the roster names the produced path in full')
      .toBe('economicState.treasury.coinFlows.taxed');
    expect(third.read, 'and still declares it read').toBe(true);
  });

  it('routes the RUIN FILTER through the service COLUMNS, and the filter is measured doing work', () => {
    let orphans = 0;
    /** @type {string[]} */
    const leaks = [];
    /** @type {Set<string>} */
    const dropped = new Set();
    let scanned = 0;
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 5; i += 1) {
        const settlement = town(tier, `estate-${tier}-${i}`);
        const table = institutionTableOf(settlement, WORLD);
        scanned += 1;
        orphans += table.orphanServices.length;
        for (const row of table.orphanServices) dropped.add(row.split(' @ ')[1]);
        const live = new Set(liveInstitutions(settlement).map((inst) => String(inst?.name || '').trim()));
        const named = new Set(instantiatedServices(settlement)
          .filter((row) => row.institution && !live.has(row.institution)).map((row) => row.name));
        for (const value of [...table.columns.whatItDoes.values, ...table.columns.whatItCounts.values]) {
          // An income duty is settlement-wide and names no institution, so it is exempt.
          if (named.has(value) && !firedDutyIncome(settlement).includes(value)) leaks.push(`${tier}-${i}: ${value}`);
        }
      }
    }
    console.log(`\nINSTITUTION TABLE · ruin filter through the COLUMNS, over ${scanned} settlements`
      + `\n  service rows dropped: ${orphans}`
      + `\n  the institutions they named: ${[...dropped].sort().join(' · ')}\n`);
    expect(scanned).toBe(30);
    // The measured fault, now cured: 23 rows over 30 settlements named an institution the
    // live roster does not hold — `(lawless)`, `(informal)`, `(street gang)`,
    // `(arcane underground)`, `(smuggling)`. Zero were duty-kind, so the class was latent.
    expect(orphans).toBe(23);
    expect([...dropped].some((name) => /lawless|informal|street gang|arcane underground|smuggling/i.test(name))).toBe(true);
    // anchored: the line above proves the filter dropped real rows, so an empty leak list
    // cannot be an empty scan
    expect(leaks).toEqual([]);
  });

  it('gives the `whoIsExempt` arm a WORLD, so its emptiness stops being asserted about nothing', () => {
    const settlement = town('town', 'exempt-twin');
    // The negative as it shipped: `nullEverywhere` held for ANY settlement, because the
    // test's world never supplied `treatyTerms` and `tollExemptions` reads only that.
    const without = institutionTableOf(settlement, WORLD);
    expect(without.columns.whoIsExempt.values).toEqual([]);
    expect(without.columns.whoIsExempt.nullEverywhere).toBe(true);
    expect(without.columns.whoIsExempt.closed).toBe(false);
    // THE POSITIVE TWIN: one treaty toll-exemption term, and the column CLOSES on it. Remove
    // the arm and this reds — which is what makes the negative above a measurement.
    const withTerm = institutionTableOf(settlement, {
      ...WORLD,
      treatyTerms: [
        { kind: 'toll exemption', route: 'the salt road', from: 'Brackwater' },
        { kind: 'tribute', route: 'the salt road' },
      ],
    });
    expect(withTerm.columns.whoIsExempt.values).toEqual(['toll exemption on the salt road']);
    expect(withTerm.columns.whoIsExempt.closed).toBe(true);
    expect(withTerm.columns.whoIsExempt.nullEverywhere).toBe(false);
    // And it is a ROUTE's exemption from a TOLL, never a person's from a count: the persons
    // column is unmoved by it, which is the whole Brackwater lesson.
    expect(withTerm.columns.whoIsCounted.closed).toBe(false);
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
