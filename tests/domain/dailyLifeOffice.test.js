/**
 * tests/domain/dailyLifeOffice.test.js — DAILY-3 · B3 L8, THE FIVE `office:` ATOMS AND LEGITIMACY L8 TO L11 (the chair's
 * E72 and E82 of 2026-11-22; the brief `docs/chair/2026-11-20/content/daily/briefs/B3-L8-OFFICE-LINES.md`; the measure
 * `measures/OFFICE`, point 97's table of forms). L12 ("The lord's steward is obeyed, but not much liked.") is NOT BUILT
 * (DAILY-4 unit (0a), the chair's E107, `briefs/D4-L12-CUT.md`): cut from this landing, for after the first deploy with
 * the ruled shape `house: lord's steward` beside `office: lord's steward` and `sovereign`. Its atom stays, unused.
 *
 *   (a) THE TABLE: each office key's forms are KEYS of its row in `seat/seatTable.js :: SEAT_TABLE` (row `government`;
 *       row `noble` for the steward), read back through `formKindOf`; the steward is Feudal Stewardship, never Feudal
 *       Appointee.
 *   (b) THE VOCABULARY declares `office` by name with its five keys, answered by `factsOf(record).office` (the lazy leaf
 *       `facts/officeForms.js`).
 *   (c) THE HOME: the governing ROW's form (`rulingPower.js :: nameOf(governingFactionOf(record))`) through `formKindOf`;
 *       never `powerStructure.government`, never a name test on a label. FAIL CLOSED: no governing row, or one stamped
 *       `hidden: true`, and every office is false; the shared read reads the same.
 *   (d) THE LINES: L8 to L11, verbatim from LINES-2 § 2 legitimacy, each with its one need, in the pool between L7 and
 *       L13 (L11 then L13); L12 ABSENT from the pool (NOT BUILT, named in the pool file's NOT BUILT note), and the
 *       steward's family `house: lord's steward` answered by no office atom (headman and reeve still are); each line
 *       admitted exactly where its office holds, none where the steward's does; on 30 born places (five a size, M1's
 *       births) none prints where its office does not hold, and L12 prints nowhere.
 *   (e) THE DOOR: the leaf rides lazy, beside `facts/factsOf.js` (vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { FACT_DIMENSIONS, assertDeclarable, atomHolds, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { SEAT_BANDS, SEAT_TABLE, formKindOf } from '../../src/domain/seat/seatTable.js';
import { governingFactionOf, nameOf } from '../../src/domain/rulingPower.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { COMMONER_RESENTMENTS } from '../../src/data/dailyLife/commonerResentments.js';
import { NEW_WORDS } from '../../src/domain/facts/registeredWords.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const ROOT = resolve(__dirname, '../..');
const LEAF_REL = 'src/domain/facts/officeForms.js';
/** The leaf, loaded so that its absence reds each test by title (never the file at import). */
const LEAF = await import('../../src/domain/facts/officeForms.js').catch((e) => ({ missing: String(e?.message || e) }));

/** THE RULING (E82 item 1), frozen: key -> [row, forms]. */
const RULED = Object.freeze({
  elders: ['government', ['Elder Council', 'Free Elder Council', 'Elder Consensus', 'Household Council']],
  headman: ['government', ["Headman's Authority"]],
  mayor: ['government', ['Town Mayor']],
  reeve: ['government', ['Elected Reeve']],
  "lord's steward": ['noble', ['Feudal Stewardship']],
});
const KEYS = Object.keys(RULED);

/** THE LINES, verbatim from LINES-2 § 2 legitimacy #8 to #11, each with its one need (index = the office key's). */
const LINES = Object.freeze([
  { id: 'L8', text: 'Common folk say the elders decide among themselves and tell everyone else afterwards.', needs: ['office: elders'] },
  { id: 'L9', text: 'People grumble that the headman listens to friends first and everyone else last.', needs: ['office: headman'] },
  { id: 'L10', text: 'The mayor is blamed for most of what goes wrong, fairly or not.', needs: ['office: mayor'] },
  { id: 'L11', text: 'People say the reeve they chose has forgotten who chose them.', needs: ['office: reeve'] },
]);
/** L12, NOT BUILT (the chair's E107): asserted ABSENT from the pool, by its id, its text and its office need. */
const CUT = Object.freeze({ id: 'L12', text: 'The lord\'s steward is obeyed, but not much liked.', office: "office: lord's steward" });

/** A planted record governed by a row of that name (the row the seat holds), with a decoy label. */
const governedBy = (/** @type {string} */ name, /** @type {Record<string, unknown>} */ extra = {}) => ({
  name: 'Planted', tier: 'village',
  powerStructure: { government: 'Grand Council', governingName: name, factions: [{ faction: 'Merchant Guilds' }, { faction: name, isGoverning: true, ...extra }] },
});
const officeAt = (/** @type {unknown} */ rec) => Object.fromEntries(KEYS.map((k) => [k, atomHolds(`office: ${k}`, factsOf(/** @type {{}} */ (rec)))]));
const none = Object.fromEntries(KEYS.map((k) => [k, false]));
const only = (/** @type {string} */ key) => ({ ...none, [key]: true });

describe('(a) the office keys read the table of forms (point 97)', () => {
  it('the leaf exists and holds the ruled map, frozen', () => {
    expect(/** @type {any} */ (LEAF).missing).toBeUndefined();
    const forms = /** @type {any} */ (LEAF).OFFICE_FORMS;
    expect(Object.isFrozen(forms)).toBe(true);
    expect(Object.keys(forms)).toEqual(KEYS);
    for (const k of KEYS) {
      expect(forms[k].row, k).toBe(RULED[k][0]);
      expect([...forms[k].forms], k).toEqual(RULED[k][1]);
      expect(Object.isFrozen(forms[k]) && Object.isFrozen(forms[k].forms), k).toBe(true);
    }
  });
  it('every form is a KEY of its row in SEAT_TABLE, and formKindOf reads it back to that row', () => {
    for (const k of KEYS) {
      const [kind, forms] = RULED[k];
      for (const f of forms) {
        expect(SEAT_BANDS.some((b) => Object.hasOwn(SEAT_TABLE[kind].bands[b], f)), `${k}: ${f} in ${kind}`).toBe(true);
        expect(formKindOf(f), `${k}: ${f}`).toBe(kind);
      }
    }
    expect(RULED["lord's steward"][1]).toEqual(['Feudal Stewardship']); // the steward is Feudal Stewardship, NOT Feudal Appointee
  });
});

describe('(b) the vocabulary declares office by name, its five keys', () => {
  it('FACT_DIMENSIONS.office: presence, home office, the five keys; each atom declarable', () => {
    const d = FACT_DIMENSIONS.office;
    expect(d?.shape).toBe('presence');
    expect(d?.home).toBe('office');
    expect([...(d?.keys || [])]).toEqual(KEYS);
    for (const k of KEYS) {
      expect(parseAtom(`office: ${k}`)?.key, k).toBe(k);
      expect(() => assertDeclarable(`office: ${k}`), k).not.toThrow();
    }
    expect(parseAtom('office: council')).toBeNull();
    expect('office' in factsOf({})).toBe(true);
  });
  it('the vocabulary stays import-free of the leaf', () => {
    const src = readFileSync(join(ROOT, 'src/domain/facts/factVocabulary.js'), 'utf8');
    expect(src).toMatch(/export const FACT_DIMENSIONS/);
    // anchored: the line above proves src is the vocabulary's own source, so an absent import is not an empty read
    expect(src).not.toMatch(/^\s*import\b/m);
    // anchored: src is the vocabulary's own source (its FACT_DIMENSIONS asserted above)
    expect(src).not.toMatch(/\bimport\s*\(\s*['"][^'"]*officeForms/);
  });
});

describe('(c) the home: the governing row\'s form, fail closed', () => {
  it('each key holds on each of its forms and on no other key', () => {
    for (const k of KEYS) for (const f of RULED[k][1]) expect(officeAt(governedBy(f)), `${k}: ${f}`).toEqual(only(k));
  });
  it('the transfer\'s " Ascendant" reads as its form', () => {
    expect(officeAt(governedBy('Elder Council Ascendant'))).toEqual(only('elders'));
    expect(officeAt(governedBy('Feudal Stewardship Ascendant'))).toEqual(only("lord's steward"));
  });
  it('the adjacent forms hold no office (Feudal Appointee, Town Council, Foreign Stewardship, Priestly Guidance)', () => {
    for (const f of ['Feudal Appointee', 'Town Council', 'Foreign Stewardship', 'Priestly Guidance', 'City Council']) expect(officeAt(governedBy(f)), f).toEqual(none);
  });
  it('never a name test on a label: a row named like an office but not a form of the table holds none', () => {
    for (const f of ['Village Elders', 'The Headman', 'Mayor of the Town', 'Reeve', "The Lord's Steward", 'elder council']) expect(officeAt(governedBy(f)), f).toEqual(none);
  });
  it('never powerStructure.government: the label says one form, the governing row another; the row wins', () => {
    const rec = governedBy('Town Mayor');
    rec.powerStructure.government = 'Elder Council';
    expect(officeAt(rec)).toEqual(only('mayor'));
    expect(officeAt({ tier: 'village', powerStructure: { government: 'Elder Council', factions: [] } })).toEqual(none);
  });
  it('FAIL CLOSED: no record, no power structure, no governing row, or a governing row stamped hidden: every office false', () => {
    for (const rec of [null, {}, { powerStructure: {} }, { powerStructure: { governingName: 'Elder Council', factions: [{ faction: 'Merchant Guilds' }] } }]) {
      expect(officeAt(rec), JSON.stringify(rec)).toEqual(none);
    }
    expect(officeAt(governedBy('Elder Council', { hidden: true }))).toEqual(none);
    expect(officeAt(governedBy('Feudal Stewardship', { hidden: true }))).toEqual(none);
  });
});

/** @type {Array<{ seed: string, size: string, rec: any, resent: string }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 5; i++) {
    const seed = `hxd-${size}-${i}`;
    const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    births.push({ seed, size, rec, resent: deriveDailyLife(rec).slots.commoner_resentments.text });
  }
}, 300_000);
const seeds = () => births.map((b) => b.seed);
const at = (/** @type {string} */ seed) => /** @type {{ seed: string, size: string, rec: any, resent: string }} */ (births.find((b) => b.seed === seed));

/** The measure's reading (`measures/OFFICE/measure.office.mjs :: officeOf`), restated: the governing row's bare form in the key's forms, its row the key's. */
function measured(/** @type {any} */ rec) {
  const g = governingFactionOf(rec);
  if (!g || g.hidden === true) return none;
  const form = nameOf(g);
  const bare = form.replace(/ Ascendant$/, '');
  return Object.fromEntries(KEYS.map((k) => [k, formKindOf(form) === RULED[k][0] && RULED[k][1].includes(bare)]));
}

describe('(c) on 30 born places: the atom is the measure\'s reading, the shared read the same, the hidden row false', () => {
  it('the born places number 30, five a size, and the five offices hold somewhere among them', () => {
    expect(births).toHaveLength(30);
    expect(births.filter((b) => officeAt(b.rec).elders).length).toBeGreaterThan(0);
  });
  it('the office atoms equal the measure\'s reading on every born place, and on its shared document', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec } = at(seed);
      expect(officeAt(rec), seed).toEqual(measured(rec));
      expect(officeAt(toPublicSafe(rec)), `${seed} shared`).toEqual(officeAt(rec));
    });
    expectNoSeedFailures(failures, 'the office atoms read the governing row\'s form');
  });
  it('the governing row stamped hidden: every office false, owner and shared', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const rec = structuredClone(at(seed).rec);
      const g = governingFactionOf(rec);
      if (g) g.hidden = true;
      expect(officeAt(rec), seed).toEqual(none);
      expect(officeAt(toPublicSafe(rec)), `${seed} shared`).toEqual(none);
    });
    expectNoSeedFailures(failures, 'a hidden governing row holds no office');
  });
});

describe('(d) L8 to L11 in the legitimacy pool, each printed only where its office holds; L12 NOT BUILT', () => {
  const pool = COMMONER_RESENTMENTS.legitimacy;
  /** The pool's office lines: every line that declares an `office:` need. */
  const officeLines = () => pool.filter((l) => l.needs.some((n) => n.startsWith('office: ')));
  it('L8..L11 stand verbatim with their one need, between L7 and L13 (L11 then L13); L12 is ABSENT (NOT BUILT, the chair\'s E107)', () => {
    const ids = pool.map((l) => l.id);
    for (const line of LINES) {
      const got = pool.find((l) => l.id === line.id);
      expect(got && { id: got.id, text: got.text, needs: [...got.needs] }, line.id).toEqual(line);
    }
    expect(ids.indexOf('L8')).toBe(ids.indexOf('L7') + 1);
    expect(ids.slice(ids.indexOf('L8'), ids.indexOf('L11') + 1)).toEqual(['L8', 'L9', 'L10', 'L11']);
    expect(ids.indexOf('L13')).toBe(ids.indexOf('L11') + 1);
    expect(officeLines().map((l) => l.id)).toEqual(LINES.map((l) => l.id));
    // L12 ABSENT: no line of its id, its text or its office need, in any branch; the ids are not renumbered (L13 stays L13)
    expect(ids).toContain('L13');
    // anchored: ids is proved the live pool's ids by its L13 asserted on the line above
    expect(ids).not.toContain(CUT.id);
    for (const [branch, lines] of Object.entries(COMMONER_RESENTMENTS)) {
      expect(lines.filter((l) => l.text === CUT.text || l.needs.includes(CUT.office)).map((l) => l.id), branch).toEqual([]);
    }
  });
  it('the file header\'s NOT BUILT note names L12 alone of the office lines; the steward\'s family is answered by no office atom (HOUSE_FAMILIES: two rows, headman and reeve)', () => {
    expect([...(NEW_WORDS["house: lord's steward"]?.atoms ?? ['missing'])]).toEqual([]);
    expect([...(NEW_WORDS['house: headman']?.atoms ?? [])]).toEqual(['office: headman']);
    expect([...(NEW_WORDS['house: reeve']?.atoms ?? [])]).toEqual(['office: reeve']);
    const src = readFileSync(join(ROOT, 'src/data/dailyLife/commonerResentments.js'), 'utf8');
    const notBuilt = /\* NOT BUILT[\s\S]*?\n \*\n/.exec(src)?.[0] ?? '';
    expect(notBuilt).toMatch(/legitimacy #4/);
    expect(notBuilt).toMatch(/legitimacy #12 "The lord's steward is obeyed, but not much liked\."/);
    expect(notBuilt).toMatch(/`house: lord's steward`/);
    // anchored: notBuilt is proved non-empty by its legitimacy #4 and #12 rows asserted on the lines above
    expect(notBuilt).not.toMatch(/#8|#9|#10|#11|elders|headman|mayor|reeve/);
    // anchored: src is the pool's own source, which holds the NOT BUILT block read above
    expect(src).not.toMatch(/government-label\s+name test/);
  });
  it('each office line of the pool is admitted exactly where its office holds, none where the steward\'s does (planted, every form)', () => {
    for (const k of KEYS) for (const f of RULED[k][1]) {
      const admitted = filterDeclared(officeLines(), { facts: factsOf(governedBy(f)) }).map((l) => l.id);
      expect(admitted, `${k}: ${f}`).toEqual(k === "lord's steward" ? [] : [LINES[KEYS.indexOf(k)].id]);
    }
    expect(filterDeclared(officeLines(), { facts: factsOf(governedBy('Elder Council', { hidden: true })) })).toEqual([]);
  });
  it('false 0: on the born places no L8..L11 prints where its office does not hold, and L12 prints nowhere', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec, resent } = at(seed);
      const office = officeAt(rec);
      for (const [i, line] of LINES.entries()) {
        expect(resent.includes(line.text) && office[KEYS[i]] !== true, `${seed} ${line.id}: "${resent}"`).toBe(false);
      }
      expect(resent.includes(CUT.text), `${seed} ${CUT.id}: "${resent}"`).toBe(false);
    });
    expectNoSeedFailures(failures, 'L8..L11 print only where their office holds; L12 nowhere');
  });
});

describe('(e) the door: the leaf rides lazy, beside factsOf', () => {
  it('the eager first-paint graph does not hold the leaf; manualChunks routes it to the chunk factsOf rides', async () => {
    const vite = await import('../../vite.config.js');
    const eager = new Set([...vite.EAGER_FIRST_PAINT_MODULES].map((abs) => abs.slice(ROOT.length + 1)));
    expect(eager.has('src/domain/facts/factVocabulary.js')).toBe(true);
    expect(eager.has(LEAF_REL)).toBe(false);
    expect(vite.FIRSTPAINT2_LAZY_DOMAIN).toContain(`/${LEAF_REL}`);
    const manualChunks = vite.default.build.rollupOptions.output.manualChunks;
    const route = (/** @type {string} */ f) => manualChunks(join(ROOT, f), { getModuleInfo: () => null, getModuleIds: () => [][Symbol.iterator]() }) ?? null;
    expect(route('src/domain/facts/factsOf.js')).toBe('coherence-lazy');
    expect(route(LEAF_REL)).toBe('coherence-lazy');
  });
});
