/**
 * PAGE-13's CAUSES-WIRING-2 (PAGE-9's `briefs/CAUSES-WIRING.md` steps 3 and 4, on the base with the trouble lane's cure):
 * A TROUBLE'S SENTENCE AS SHOWN, one pure reader (`src/domain/display/tensionShown.js :: tensionSentenceShown`) =
 * `tensionCauseSentenceOf(record, tension) ?? <the stored description>`. Every expected sentence is COMPUTED through
 * `tensionCauseSentenceOf`, never quoted.
 *   (1) on a MADE-UP record: the cause sentence where the kind has a table, the stored text where none does;
 *   (2) THE SERVED ARM, over the born pools (the chair's 300 `hxd-<size>-<i>` and the page census's 720): the owner's
 *       sentence against each served projection's, read as step 1's expectation: every difference is a pair under the
 *       gallery veil's default set traced to an atom the owner's row declares (the atom flips between the two documents),
 *       or a row the hideable walker's EXEMPT entry for `TENSION_CAUSES` LISTS (crime_wave:criminal_power,
 *       guild_conflict:guilds_rule, outside_debt:merchants_rule);
 *   (3) THE GUARD: no file in the display lane's directories reads a tension's `description` for print but
 *       `tensionShown.js`.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { TENSION_CAUSES } from '../../../src/data/tensionCauses.js';
import { tensionCauseSentenceOf } from '../../../src/domain/display/tensionCause.js';
import { tensionSentenceShown } from '../../../src/domain/display/tensionShown.js';
import { toPublicSafe, publicVeiledRecordOf } from '../../../src/domain/display/publicSafe.js';
import { applyVeil, resolveVeil, defaultVeilFor } from '../../../src/domain/display/galleryVeil.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../../src/domain/facts/factVocabulary.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

const STORED = 'The stored sentence of this trouble, as the generator wrote it.';
/** a made-up town: a name (the cause's key), a roster, no houses */
const town = (/** @type {any[]} */ currentTensions) => ({
  name: 'Ashford',
  powerStructure: { factions: [{ faction: 'Ashford Council', category: 'government', isGoverning: true }] },
  institutions: [],
  history: { currentTensions },
});

describe('tensionSentenceShown: the cause sentence where a table holds, the stored text where none does', () => {
  it('a kind with a table (crime_wave) shows the cause function\'s sentence, never the stored text', () => {
    const t = { type: 'crime_wave', description: STORED, factions: [] };
    const rec = town([t]);
    expect(Object.hasOwn(TENSION_CAUSES, 'crime_wave')).toBe(true);
    const cause = tensionCauseSentenceOf(rec, t);
    expect(typeof cause).toBe('string');
    expect(tensionSentenceShown(rec, t)).toBe(cause);
    expectAbsentWithAnchor([tensionSentenceShown(rec, t)], STORED, /** @type {string} */ (cause), 'the cause sentence replaces the description');
  });
  it('a kind with no table (tyranny) shows the stored description, as before', () => {
    const t = { type: 'tyranny', description: STORED, factions: [] };
    expect(Object.hasOwn(TENSION_CAUSES, 'tyranny')).toBe(false);
    expect(tensionCauseSentenceOf(town([t]), t)).toBeNull();
    expect(tensionSentenceShown(town([t]), t)).toBe(STORED);
  });
  it('the sentence follows the document it is given: the same tension in another town takes that town\'s sentence', () => {
    const t = { type: 'outside_debt', description: STORED, factions: [] };
    const other = { ...town([t]), name: 'Bramley' };
    expect(tensionSentenceShown(other, t)).toBe(tensionCauseSentenceOf(other, t));
    expect(tensionSentenceShown(town([t]), t)).toBe(tensionCauseSentenceOf(town([t]), t));
  });
  it('no table and no stored sentence, or no tension at all: nothing (undefined)', () => {
    expect(tensionSentenceShown(town([]), { type: 'tyranny' })).toBeUndefined();
    expect(tensionSentenceShown(town([]), null)).toBeUndefined();
    expect(tensionSentenceShown(null, undefined)).toBeUndefined();
  });
});

// ── (2) THE SERVED ARM, over the born pools ──────────────────────────────────────────────────────────────────────────
const veiled = (/** @type {any} */ pub) => applyVeil(pub, resolveVeil(defaultVeilFor(pub), null));
/** every projection a non-owner page is given (`build/CAUSES-WIRING/parity.mjs`'s five) @type {Record<string, (d: any) => any>} */
const PROJECTIONS = {
  'toPublicSafe': (d) => toPublicSafe(d),
  'toPublicSafe full': (d) => toPublicSafe(d, { full: true }),
  'publicVeiledRecordOf': (d) => publicVeiledRecordOf(d),
  'toPublicSafe + default veil': (d) => veiled(toPublicSafe(d)),
  'toPublicSafe full + default veil': (d) => veiled(toPublicSafe(d, { full: true })),
};
const VEILED = new Set(['toPublicSafe + default veil', 'toPublicSafe full + default veil']);
/** the hideable walker's EXEMPT entry for TENSION_CAUSES: the three rows LISTED, not held equal */
const LISTED = new Set(['crime_wave:criminal_power', 'guild_conflict:guilds_rule', 'outside_debt:merchants_rule']);
const escape = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** The row a printed sentence is a wording of (`{power}` matched as any name), or 'plain'. @param {string} kind @param {string} s */
const rowOf = (kind, s) => {
  const table = TENSION_CAUSES[kind];
  const is = (/** @type {string} */ text) => new RegExp(`^${text.split('{power}').map(escape).join('.+')}$`, 'i').test(s);
  return table.causes.find((c) => c.wordings.some((w) => is(w.text)))?.id ?? 'plain';
};
/** the atoms a row's wordings declare (`needs`, and each `excludes`) @param {string} kind @param {string} id */
const declaredOf = (kind, id) => [...new Set((TENSION_CAUSES[kind].causes.find((c) => c.id === id)?.wordings || [])
  .flatMap((w) => [...(w.needs || []), ...(w.excludes || [])]))];

/** @type {Array<[string, any]>} */ let births = [];
beforeAll(async () => {
  const { generateSettlementPipeline } = await import('../../../src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import('../../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
  const { SIZES, censusPlan, configOf } = await import('../../components/pageCensusWalk.shared.mjs');
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 50; i += 1) {
    const seed = `hxd-${size}-${i}`;
    births.push([seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })]);
  }
  for (const row of censusPlan('r2')) births.push([row.seed, generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} })]);
}, 900000);

describe('tensionSentenceShown: the owner\'s sentence and each served one (the born pools, step 1\'s expectation)', () => {
  it('every difference is a veiled pair traced to a declared atom, or a LISTED row', () => {
    expect(births.length).toBe(1020);
    /** @type {Record<string, { pairs: number, differ: number }>} */
    const counts = Object.fromEntries(Object.keys(PROJECTIONS).map((p) => [p, { pairs: 0, differ: 0 }]));
    const failures = collectSeedFailures(births, (/** @type {[string, any]} */ [, doc]) => {
      const ts = (doc?.history?.currentTensions || []).filter((/** @type {any} */ t) => t && typeof t === 'object');
      const ownFacts = factsOf(doc);
      for (const [proj, fn] of Object.entries(PROJECTIONS)) {
        const served = fn(doc);
        /** @type {any} */ let sFacts = null;
        for (const t of ts) {
          const t2 = (served?.history?.currentTensions || []).find((/** @type {any} */ x) => x?.type === t.type);
          if (!t2) continue;
          counts[proj].pairs += 1;
          const own = tensionSentenceShown(doc, t);
          const shown = tensionSentenceShown(served, t2);
          if (own === shown) continue;
          counts[proj].differ += 1;
          const row = Object.hasOwn(TENSION_CAUSES, t.type) ? rowOf(t.type, String(own)) : '(no table)';
          if (LISTED.has(`${t.type}:${row}`)) continue;
          sFacts ??= factsOf(served);
          const flips = declaredOf(t.type, row).filter((a) => atomHolds(a, /** @type {any} */ (ownFacts)) !== atomHolds(a, sFacts));
          expect(VEILED.has(proj) && flips.length > 0, `${proj} ${t.type} owner row ${row}: owner ${JSON.stringify(own)} served ${JSON.stringify(shown)}`).toBe(true);
        }
      }
    });
    expectNoSeedFailures(failures, 'each served sentence equals the owner\'s, but a veiled pair traced to a declared atom or a LISTED row');
    // the arm reads something: every projection pairs the owner's tensions
    for (const p of Object.keys(PROJECTIONS)) expect(counts[p].pairs, p).toBeGreaterThan(1000);
  }, 900000);
});

// ── (3) THE GUARD: a tension's description is read for print only in tensionShown.js ─────────────────────────────────
// Every `.description` read under src/components, src/domain/display, src/pdf and src/foundry on a receiver a tension's
// row is spelled by (`t`, `tn`, `tension`, `ct`), or on `currentTensions[...]` itself, is either the reader's own
// (tensionShown.js) or pinned by file below with what it reads. The view model's tension rows (`overviewSlice`,
// `powerSlice`, `historySlice`) carry `description: tensionSentenceShown(active, t)`: the sections and the journal that
// print a row's `description` print the sentence shown. A new read anywhere in these directories reds here until it is
// the reader's call or a read that is not the record's tension printed, added here by name.
const LANE_DIRS = ['src/components', 'src/domain/display', 'src/pdf', 'src/foundry'];
const READER_FILE = 'src/domain/display/tensionShown.js';
/**
 * file → its `<receiver>.description` reads that print no record's tension: `[receiver]` for every such read in the file,
 * `[receiver, words]` for the one read on a line carrying those words.
 * @type {Readonly<Record<string, ReadonlyArray<readonly [string, string?]>>>}
 */
const OTHER_READS = Object.freeze({
  'src/pdf/sections/Overview.jsx': [['t']], // the view model's overview row: its description IS tensionSentenceShown's
  'src/pdf/sections/HistoryFounding.jsx': [['t'], ['tension']], // the view model's history row (the same), and its B4 compare
  'src/foundry/journalPages.js': [['tn']], // the view model's power row (the same)
  'src/pdf/lib/viewModel.js': [['t', "t.direction === 'own'"]], // an NPC card's tie line (`cardTieLines`), not a tension
  'src/domain/display/historyOpenThreads.js': [['t']], // the still-relevant mark: a match of an event's name, not a print
  'src/components/temperament/TemperamentPicker.jsx': [['t']], // a temperament, not a tension
});
/** @param {string} file @param {string} receiver @param {string} line */
const pinned = (file, receiver, line) => (OTHER_READS[file] || []).some(([r, words]) => r === receiver && (!words || line.includes(words)));

describe('THE GUARD: a tension\'s description is printed only through tensionShown.js', () => {
  it('every tension-row `.description` read in the lane\'s files is the reader\'s own or a read pinned by file', () => {
    const root = process.cwd();
    /** @param {string} d @returns {string[]} */
    const walk = (d) => readdirSync(d).flatMap((f) => {
      const p = join(d, f);
      return statSync(p).isDirectory() ? walk(p) : /\.(m?js|jsx)$/.test(f) ? [p] : [];
    });
    const read = /\b(t|tn|tension|ct)\s*\??\.description\b/g;
    const direct = /currentTensions\s*\??\.?\[[^\]]*\]\s*\??\.description\b/;
    /** @type {string[]} */ const strays = [];
    let readerReads = 0;
    for (const dir of LANE_DIRS) for (const abs of walk(join(root, dir))) {
      const file = relative(root, abs).split('\\').join('/');
      readFileSync(abs, 'utf-8').split('\n').forEach((line, i) => {
        if (direct.test(line) && file !== READER_FILE) strays.push(`${file}:${i + 1} currentTensions[…].description`);
        for (const m of line.matchAll(read)) {
          if (file === READER_FILE) { readerReads += 1; continue; }
          if (!pinned(file, m[1], line)) strays.push(`${file}:${i + 1} ${m[1]}.description`);
        }
      });
    }
    expect(strays, 'a tension\'s description read for print outside the reader').toEqual([]);
    expect(readerReads).toBeGreaterThan(0);
  });
});
