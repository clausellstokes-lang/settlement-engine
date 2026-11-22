/**
 * styleLaw.walker.test.js — THE STYLE WALKER (STYLE-2-WAVE lane SW-0; the chair's ruling A10 on the audit
 * STYLE-AUDIT-2-SOURCES-2026-11-09 §3; the owner's style law, WIRING-RULINGS-2026-11-07 §5–§8).
 *
 * An only-shrinks ratchet over the reader-facing text of the dossier's writers. The scanner and its rules
 * live in scripts/lib/style-law-scan.mjs (its header is the rule book: the roots, the units, the phrases,
 * the allow-list). The baseline tests/lint/.style-law-baseline.json holds a count per file per phrase and
 * is written ONLY by the scanner's door, `node scripts/lib/style-law-scan.mjs --record`.
 *
 * THIS FILE REDS WHEN:
 *   • any file's count of any phrase RISES above its baseline (a file the baseline does not name starts at 0);
 *   • a phrase whose baseline TOTAL is 0 appears ANYWHERE (the struck tics already gone cannot come back);
 *   • the baseline was not written by the door (its digest, totals or phrase list disagree with its rows);
 *   • the allow-list names a key that no longer exists or no longer carries its phrase (no dead allowances);
 *   • the scan reads less than its roots (a root vanished, or the file count collapsed).
 * A count that FALLS is green; the merge seat re-measures the baseline downward through the door.
 *
 * TO COMPLY when it reds on a rise: rewrite the line under the style law (the word for the retired word is
 * "power"; the struck tics leave). Never re-record the baseline to absorb a rise: the door writes what the
 * tree holds, so a re-record that RAISES a count is a lane's act the merge seat refuses.
 *
 * Every failure path below is EXECUTED against planted source in memory on every run; nothing is written
 * to disk.
 */
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  ALLOW, BASELINE_REL, EXCLUDED_PATHS, PHRASE_IDS, ROOTS, buildBaseline, compare, digestOf, extractUnits,
  listFiles, phraseHits, scanSource, scanTree, totalsOf,
} from '../../scripts/lib/style-law-scan.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const baseline = JSON.parse(readFileSync(join(ROOT, BASELINE_REL), 'utf8'));
const scan = scanTree(ROOT);

const describeHit = (rel, id) => (scan.hits[rel] || [])
  .filter((h) => h.id === id && !h.allowed)
  .map((h) => `      ${rel}:${h.line} ${JSON.stringify(h.text.slice(0, 140))}`)
  .join('\n');

describe('the style walker — the ratchet at the tree', () => {
  const verdict = compare(scan.files, baseline);

  test('⛔ no file\'s count of any struck phrase RISES above its baseline', () => {
    const lines = verdict.rises.map((r) => `  ${r.file} :: ${r.id} ${r.was} -> ${r.now}\n${describeHit(r.file, r.id)}`);
    expect(
      verdict.rises,
      `the style law: a struck phrase rose (rewrite the line; the retired word's word is "power"):\n${lines.join('\n')}`,
    ).toEqual([]);
  });

  test('⛔ a phrase whose baseline total is 0 appears NOWHERE', () => {
    const zero = PHRASE_IDS.filter((id) => baseline.totals[id] === 0);
    // anti-vacuity: the four struck tics the first wave already cured are among the refused (audit §3)
    expect(zero).toEqual(expect.arrayContaining([
      'two-different-things', 'a-separate-question', 'nothing-has-broken-yet', 'which-is-the-kind-of',
    ]));
    const lines = verdict.refused.map((r) => `  ${r.file} :: ${r.id} (refused outright)\n${describeHit(r.file, r.id)}`);
    expect(verdict.refused, `a struck tic came back:\n${lines.join('\n')}`).toEqual([]);
  });
});

describe('the baseline was written by its door', () => {
  test('the phrase list is the scanner\'s, in order', () => {
    expect(baseline.phrases).toEqual(PHRASE_IDS);
    expect(baseline.door).toBe('node scripts/lib/style-law-scan.mjs --record');
    expect(baseline.measuredAtSha).toMatch(/^[0-9a-f]{40}$/);
  });

  test('every row is a positive integer count of a known phrase', () => {
    for (const [rel, counts] of Object.entries(baseline.files)) {
      for (const [id, n] of Object.entries(counts)) {
        expect(PHRASE_IDS, `${rel} :: ${id}`).toContain(id);
        expect(Number.isInteger(n) && n > 0, `${rel} :: ${id} = ${n}`).toBe(true);
      }
    }
  });

  test('the totals and the digest agree with the rows (a hand edit breaks the digest)', () => {
    expect(baseline.totals).toEqual(totalsOf(baseline.files));
    expect(baseline.digest).toBe(digestOf(baseline.files));
  });
});

describe('the scope is the ruled scope', () => {
  test('every root exists and the scan reads the roots whole', () => {
    for (const r of ROOTS) expect(() => statSync(join(ROOT, r)), r).not.toThrow();
    // measured 1,096 at the lane's tip; a collapse below 90% means a root left the walk
    expect(scan.scanned).toBeGreaterThan(Math.floor(baseline.scannedFiles * 0.9));
  });

  test('the audit\'s §4 exclusions: 109 paths, each under a root, none read', () => {
    expect(EXCLUDED_PATHS).toHaveLength(109);
    expect(new Set(EXCLUDED_PATHS).size).toBe(109);
    const read = new Set(listFiles(ROOT));
    for (const p of EXCLUDED_PATHS) {
      expect(ROOTS.some((r) => p === r || p.startsWith(`${r}/`)), p).toBe(true);
      expect(read.has(p), p).toBe(false);
    }
  });

  test('test files are never read; the annex projections, worldPulse and the map are', () => {
    const read = listFiles(ROOT);
    expect(read.filter((f) => /\.test\./.test(f))).toEqual([]);
    for (const prefix of ['src/data/dossierStateProse/', 'src/data/dossierCausalProse.generated.js',
      'src/domain/worldPulse/', 'src/components/map/']) {
      expect(read.some((f) => f.startsWith(prefix)), prefix).toBe(true);
    }
  });

  test('the allow-list holds no dead key: each named en.js key exists and carries its phrase', () => {
    for (const [rel, byPhrase] of Object.entries(ALLOW)) {
      const { hits } = scanSource(rel, readFileSync(join(ROOT, rel), 'utf8'));
      for (const [id, keys] of Object.entries(byPhrase)) {
        const allowed = new Set(hits.filter((h) => h.id === id && h.allowed).map((h) => h.key));
        expect([...keys].filter((k) => !allowed.has(k)), `${rel} :: ${id} dead allowances`).toEqual([]);
      }
    }
  });
});

describe('the scanner\'s rules, EXECUTED on planted source', () => {
  const count = (src, file = 'src/domain/display/planted.js') => scanSource(file, src).counts;

  test('a string literal of two or more words counts; a single word does not', () => {
    expect(count("const a = 'a faction';")).toEqual({ faction: 1 });
    expect(count("const a = 'faction';")).toEqual({});
  });

  test('comments are blanked', () => {
    expect(count("// 'the record shows it'\n/* 'kept rather than ended' */\nconst a = 1;")).toEqual({});
  });

  test('case-insensitive and word-bounded', () => {
    expect(count("const a = 'Rather Than that';")).toEqual({ 'rather-than': 1 });
    expect(count("const a = 'factionStanding is read'; const b = 'the recorded tally';")).toEqual({});
    expect(count("const a = 'Factions and factional strife, factionalism too';")).toEqual({ faction: 3 });
    expect(count("const a = 'twenty per cent, or ten percent';")).toEqual({ 'per-cent': 2 });
  });

  test('a template slot is a slot: code inside ${…} never counts, a word glued to a slot does', () => {
    expect(count('const a = `${f.faction} holds the hall`;')).toEqual({});
    expect(count('const a = `the other faction${s} compete`;')).toEqual({ faction: 1 });
    expect(count('const a = `${x ? `the record says` : ""} so`;')).toEqual({ 'the-record': 1 });
  });

  test('a brace placeholder is a slot name, never a printed word', () => {
    expect(count("const a = '{faction} holds {settlement}';")).toEqual({});
    expect(count("const a = '{faction} holds the faction hall';")).toEqual({ faction: 1 });
  });

  test('JSX text runs count, `{…}` read as a slot; an element boundary ends a run', () => {
    expect(count('const C = () => <p>The {name} faction rules</p>;', 'src/components/new/P.jsx')).toEqual({ faction: 1 });
    expect(count('const C = () => <p>kept quiet rather<b>x</b>than ended</p>;', 'src/components/new/P.jsx')).toEqual({});
    expect(count('const C = () => <p>{/* the record */}plain words here</p>;', 'src/components/new/P.jsx')).toEqual({});
    expect(extractUnits('const C = () => <p>The {a} and {b}</p>;', 'P.jsx').map((u) => u.text)).toEqual(['The {…} and {…}']);
  });

  test('every phrase of the audit\'s §3 list is matched by its rule', () => {
    const samples = {
      faction: 'the faction', 'rather-than': 'this rather than that', 'the-record': 'the record',
      'the-ledger': 'the ledger', 'the-engine': 'the simulation', 'a-stranger': 'a stranger',
      arithmetic: 'the arithmetic', 'per-cent': 'ten per cent', 'on-the-roster': 'from the roster',
      'not-merely': 'not merely', 'legitimacy-score': 'the legitimacy score', 'the-gap-widens': 'the gap widens',
      'the-space-its-authority-does-not-occupy': 'the space its authority does not occupy',
      'two-different-things': 'these do not contradict', 'a-separate-question': 'a separate question',
      'nothing-has-broken-yet': 'nothing has broken yet', 'which-is-the-kind-of': 'which is the kind of',
    };
    expect(Object.keys(samples)).toEqual(PHRASE_IDS);
    for (const [id, text] of Object.entries(samples)) expect(phraseHits(text), id).toEqual({ [id]: 1 });
  });

  test('an allow-listed en.js key is not counted; the same words under another key are', () => {
    const en = "export const en = { generate: { subtitle: 'The rest is up to the simulator.' }, other: { x: 'up to the simulator' } };";
    expect(count(en, 'src/copy/en.js')).toEqual({ 'the-engine': 1 });
  });

  test('⛔ RED: a planted literal that RAISES a count is a rise; one that only FALLS is green', () => {
    const planted = scanSource('src/domain/display/planted.js', "const a = 'the hall kept it quiet rather than ended it';");
    const v = compare({ ...baseline.files, 'src/domain/display/planted.js': planted.counts }, baseline);
    expect(v.rises).toEqual([{ file: 'src/domain/display/planted.js', id: 'rather-than', was: 0, now: 1 }]);
    const [rel, counts] = Object.entries(baseline.files)[0];
    const [id, n] = Object.entries(counts)[0];
    const fell = compare({ ...baseline.files, [rel]: { ...counts, [id]: n - 1 } }, baseline);
    expect(fell.rises).toEqual([]);
    expect(fell.falls).toEqual([{ file: rel, id, was: n, now: n - 1 }]);
  });

  test('⛔ RED: a planted struck tic whose total is 0 is refused, even in a file the baseline names', () => {
    const rel = Object.keys(baseline.files)[0];
    const planted = scanSource(rel, "const a = 'and so far nothing has broken yet';");
    const v = compare({ ...baseline.files, [rel]: { ...baseline.files[rel], ...planted.counts } }, baseline);
    expect(v.refused).toEqual([{ file: rel, id: 'nothing-has-broken-yet', now: 1 }]);
  });

  test('the door writes what the scan holds (the baseline a --record would write)', () => {
    const b = buildBaseline(scan, baseline.measuredAtSha);
    expect(b.totals).toEqual(totalsOf(scan.files));
    expect(b.digest).toBe(digestOf(scan.files));
  });
});
