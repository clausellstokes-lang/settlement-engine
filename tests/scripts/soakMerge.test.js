/**
 * tests/scripts/soakMerge.test.js — the merge driver for sharded soak runs (lane SOAK-MERGE,
 * 2026-11-07; docs/chair/2026-11-07/SOAK_MERGE_2026-11-07.md).
 *
 * The proof, small: twenty-four synthetic soak rows aggregated as ONE run (four workers) and as
 * TWO shard runs of twelve (`--from 0 --count 12`, `--from 12 --count 24`), each through the real
 * `aggregate()` exactly as soak-review.mjs calls it; the shards packed and merged. Every table the
 * aggregate computes from rows is byte-identical to the one run's; repetition is per shard by
 * construction; the driver refuses shards it cannot merge honestly.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { aggregate } from '../../scripts/audit/soak-review/aggregate.mjs';
import { mergeShards, packShard, readShards, residueOrder, REPETITION_NOTE } from '../../scripts/audit/soak-merge.mjs';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const POP = { thorp: 20, hamlet: 60, village: 200, town: 1200, city: 8000, metropolis: 40000 };
const WORKERS = 4;
const TIP = 'f'.repeat(40);

/** A soak worker's line for index i: deterministic, every input the aggregate reads. */
function row(i) {
  const tier = TIERS[i % 6];
  const pop = POP[tier] + (i * 37) % 11;
  const findings = [
    { check: 'X-50:boilerplate-twice', surface: 'economics', quote: `line ${i % 3}`, detail: '2 times' },
    ...(i % 5 === 0 ? [{ check: 'A-10:role-only-npc', surface: 'record', quote: 'The Reeve', detail: 'reeve' }] : []),
    ...(i % 4 === 1 ? [{ check: 'reader:exports-thin', surface: 'economics', quote: '', detail: '[gaps] thin' }] : []),
    // Two settlements in each shard: under the contradiction line (≥ 3) in each, over it in the union.
    ...([2, 3, 14, 15].includes(i) ? [{ check: 'A-04:dragon-magic-off', surface: 'screen', quote: 'a dragon', detail: '' }] : []),
    ...(i === 17 ? [{ check: 'cert:broken_reference', surface: 'record', quote: 'npcs[2]', detail: 'dangling' }] : []),
  ];
  return {
    i, seed: `soak1k-${i}`, tier, population: pop, stressCell: `cell-${i % 3}`, matrix: { terrain: ['coast', 'hills'][i % 2] },
    hashes: { record: `r${i}`, config: `c${i % 7}` }, rendered: true, replay: i % 100 === 0 ? true : null,
    findings,
    chains: { 'chain.population': pop, 'chain.tier': tier, 'chain.institutionCount': 3 + (i % 9), 'chain.npcCount': 5 + (i % 7), 'chain.terrain': ['coast', 'hills'][i % 2], 'chain.foodBand': ['fed', 'lean', 'famine'][i % 3] },
    features: {
      scalars: { population: pop, 'economy.prosperity': (i * 13) % 17, 'defense.score': (i * 7) % 23 + 0.5, 'culture.key': ['a', 'b', 'c', 'd'][i % 4], ...(i % 2 ? { 'sparse.only.odd': i } : {}) },
      cats: { 'institutions[].category': { [`kind-${i % 3}`]: 1, shared: 2 }, 'npcs[].role': { [`role-${i % 5}`]: 1 } },
    },
    sentences: [`h${i % 4}`, `h${(i + 1) % 4}`, `u${i}`], texts: { [`h${i % 4}`]: `sentence ${i % 4}` },
    story: { items: [[`e${i}`, `s${i}`]], hooks: [`k${i % 2}`] }, storyTexts: {},
    houses: { houses: 3 + (i % 4), anchor: 4, ratio: (3 + (i % 4)) / 4 },
    reader: { exports: i % 6, dailyLifeLine: i % 2 === 0 },
  };
}

/** Write a soak-review output for [from, end) exactly as soak-review.mjs's main does, then aggregate. */
function soakRun(dir, from, end) {
  for (const d of ['shards', 'sample', 'aggregates']) mkdirSync(join(dir, d), { recursive: true });
  const todo = []; for (let i = from; i < end; i += 1) todo.push(i);
  const per = Array.from({ length: WORKERS }, () => []);
  todo.forEach((i, k) => per[k % WORKERS].push(i));
  per.forEach((idx, w) => writeFileSync(join(dir, 'shards', `shard-${w}.jsonl`), idx.map((i) => `${JSON.stringify(row(i))}\n`).join('')));
  writeFileSync(join(dir, 'sample', `soak1k-${from}.txt`), `dossier ${from}\n`);
  return aggregate(dir, { count: end, tip: TIP, durationMs: 1000 + from, args: { count: end, workers: WORKERS, out: dir, renderedSubset: 1, resume: false, from } });
}

const ROW_TABLES = ['findings.jsonl', 'settlements.jsonl', ...['finding-classes', 'reader-observations', 'fields', 'field-bands', 'inner-categories', 'chains', 'dependence-strong', 'dependence-residual'].map((t) => `aggregates/${t}.json`)];

describe('soak-merge: two packed shards merge to the one run', () => {
  let root; let one; let merged; let summary;
  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), 'soak-merge-'));
    one = soakRun(join(root, 'one'), 0, 24);
    soakRun(join(root, 'a'), 0, 12);
    soakRun(join(root, 'b'), 12, 24);
    packShard(join(root, 'a')); packShard(join(root, 'b'));
    // Given out of order: the driver sorts shards by their range.
    summary = await mergeShards([join(root, 'b'), join(root, 'a')], join(root, 'merged'));
    merged = join(root, 'merged');
  });
  afterAll(() => rmSync(root, { recursive: true, force: true }));

  it('every table the aggregate computes from rows is byte-identical to the one run\'s', () => {
    for (const t of ROW_TABLES) expect(readFileSync(join(merged, t), 'utf-8'), t).toBe(readFileSync(join(root, 'one', t), 'utf-8'));
    expect(readFileSync(join(merged, 'findings.jsonl'), 'utf-8').split('\n').filter(Boolean)).toHaveLength(24 + 5 + 6 + 4 + 1);
  });

  it('run.json agrees with the one run in every figure but the run\'s own args, duration and repetition', () => {
    const strip = (s) => { const { args, durationMs, proseRepetition, merge, ...rest } = s; return rest; };
    expect(strip(summary)).toEqual(strip(one));
    expect(summary.verdict).toBe('STOP');
    expect(summary.reasons).toEqual(one.reasons);
    expect(summary.durationMs).toBe(1000 + 1012);
    expect(summary.merge.shards.map((s) => [s.from, s.end, s.verdict])).toEqual([[0, 12, 'STOP'], [12, 24, 'STOP']]);
  });

  it('applies the stop rule to the summed classes: a class at 2 + 2 is a reason in the union and in neither shard', () => {
    const reason = 'kind 3 (magic): A-04:dragon-magic-off in 4';
    expect(summary.reasons).toContain(reason);
    for (const s of summary.merge.shards) {
      expectAbsentWithAnchor(s.reasons.map((x) => x.replace(/ in \d+$/, '')), 'kind 3 (magic): A-04:dragon-magic-off', 'repetition: X-50:boilerplate-twice at 1', `shard ${s.from}`);
    }
  });

  it('repetition is reported per shard, with the note, never as a merged figure', () => {
    const rep = JSON.parse(readFileSync(join(merged, 'aggregates', 'repetition.json'), 'utf-8'));
    expect(rep).toMatchObject({ merged: false, note: REPETITION_NOTE });
    expect(rep.shards.map((s) => [s.from, s.end, s.towns])).toEqual([[0, 12, 12], [12, 24, 12]]);
    expect(summary.proseRepetition.shards).toHaveLength(2);
    expect(existsSync(join(merged, 'sample', 'soak1k-12.txt')) && existsSync(join(merged, 'sample', 'soak1k-0.txt'))).toBe(true);
  });

  it('refuses shards on different tips, a first shard not at 0, a range its pack does not cover, a gap, an overlap, an unpacked run', () => {
    const run = (d) => JSON.parse(readFileSync(join(root, d, 'run.json'), 'utf-8'));
    const put = (d, r) => writeFileSync(join(root, d, 'run.json'), JSON.stringify(r));
    const a = run('a'); const b = run('b');
    put('b', { ...b, tip: '0'.repeat(40) });
    expect(() => readShards([join(root, 'a'), join(root, 'b')])).toThrow(/different tips/);
    put('b', b);
    expect(() => readShards([join(root, 'b')])).toThrow(/starts at 12, not 0/);
    put('a', { ...a, count: 14 });
    expect(() => readShards([join(root, 'a'), join(root, 'b')])).toThrow(/14 rows packed|12 rows packed/);
    put('a', a);
    put('b', { ...b, count: 25, args: { ...b.args, from: 13 } });
    expect(() => readShards([join(root, 'a'), join(root, 'b')])).toThrow(/gap between 12 and 13/);
    put('b', { ...b, count: 23, args: { ...b.args, from: 11 } });
    expect(() => readShards([join(root, 'a'), join(root, 'b')])).toThrow(/overlap between 12 and 11/);
    put('b', b);
    expect(() => readShards([join(root, 'one')])).toThrow(/is not packed/);
    expect(readShards([join(root, 'a'), join(root, 'b')]).shards.map((s) => s.from)).toEqual([0, 12]);
  });

  it('reads the worker files in the order one run reads them (by name: shard-10 before shard-2)', () => {
    expect(residueOrder(4)).toEqual([0, 1, 2, 3]);
    expect(residueOrder(12)).toEqual([0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
