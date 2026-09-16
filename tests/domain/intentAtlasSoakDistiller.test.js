/**
 * tests/domain/intentAtlasSoakDistiller.test.js — THE SOAK PRIOR IS REPRODUCIBLE
 * (scripts/distill-intent-atlas.mjs; docs/DESIGN_AI_INTENT_ATLAS.md §8, owner ruling
 * 2026-07-27, wave L-8a).
 *
 * WHAT THIS PROTECTS, and why it is a different thing from the id-free gate. That gate reads
 * the committed artifact and proves the cells in it are well formed. It cannot tell whether
 * those cells describe anything: a distillate hand-edited into existence, or produced by a
 * script that has since drifted, passes every shape check it makes. The claim this file adds
 * is that THE COMMITTED ARTIFACT IS WHAT THE DOCUMENTED COMMAND PRODUCES. Run the distiller
 * with its documented defaults and the bytes come out identical, which makes every number in
 * the file falsifiable by anyone who can run node.
 *
 * That is also the determinism proof the design asks for. Byte-identity across an independent
 * run is a stronger statement than "two runs agreed", because the run being compared against
 * happened in a different process, on a different day, from a different working directory: a
 * clock read, an unseeded draw, a Set iteration over insertion order that varied, or a
 * floating-point path that depended on anything ambient would all have to survive that to go
 * unnoticed here.
 *
 * COST, DELIBERATELY ACCEPTED: the reproduction test runs the real settlement pipeline 400
 * times, which is roughly thirteen seconds. The cheaper shapes were considered and rejected —
 * a smaller seed count would not reproduce the committed file and so would prove nothing about
 * it, and a recorded-output fixture would just be the artifact again under another name. The
 * --corpus half below is nearly free and covers the statistics path a second time.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  ATLAS_CELL_KEYS,
  ATLAS_SURFACES,
  EVIDENCE_FLOOR,
  SOAK_WEIGHT_CAP,
} from '../../src/domain/intentAtlas.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/distill-intent-atlas.mjs');
const COMMITTED = join(ROOT, 'src/domain/data/intentAtlas.distillate.json');

const committedText = readFileSync(COMMITTED, 'utf8');
const committed = JSON.parse(committedText);

/** Run the distiller, returning the bytes it wrote. @param {string[]} args @returns {string} */
function distil(args) {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-distil-'));
  const out = join(dir, 'distillate.json');
  execFileSync(process.execPath, [SCRIPT, '--quiet', '--out', out, ...args], {
    cwd: ROOT,
    stdio: ['ignore', 'ignore', 'pipe'],
    timeout: 240_000,
  });
  return readFileSync(out, 'utf8');
}

describe('intent atlas soak prior — the committed artifact is reproducible', () => {
  it('the documented default run reproduces the committed distillate byte for byte', () => {
    expect(distil([])).toBe(committedText);
  }, 240_000);
});

describe('intent atlas soak prior — the recorded-corpus path is deterministic too', () => {
  /**
   * A tiny hand-built corpus in the shape the distiller's own extractor emits. It is built so
   * one association is perfect (every `town` has the `Economy` shelf and no `thorp` does) and
   * one is pure noise, which is enough to tell a working correction from a broken one without
   * running the pipeline at all.
   */
  const observations = [];
  for (let i = 0; i < 120; i += 1) {
    const isTown = i % 2 === 0;
    observations.push({
      settType: isTown ? 'town' : 'thorp',
      tradeRoute: 'road',
      monsterThreat: 'frontier',
      contentProfile: 'grounded',
      bands: {
        resilience: isTown ? 'high' : 'low',
        volatility: 'moderate',
        externalThreat: i % 3 === 0 ? 'low' : 'moderate',
        resourcePressure: 'moderate',
      },
      shelves: isTown ? ['Economy', 'Government'] : ['Government'],
    });
  }

  const corpusPath = join(mkdtempSync(join(tmpdir(), 'atlas-corpus-')), 'corpus.json');
  writeFileSync(corpusPath, JSON.stringify({
    label: 'fixture-corpus', generatorVersion: 'test', observations,
  }));

  it('two runs over the same corpus produce byte-identical output', () => {
    const a = distil(['--corpus', corpusPath]);
    const b = distil(['--corpus', corpusPath]);
    expect(a).toBe(b);
  }, 60_000);

  it('finds the planted association, drops the noise, and records its own denominator', () => {
    const artifact = JSON.parse(distil(['--corpus', corpusPath]));
    expect(artifact.generatedFrom.kind).toBe('soak-corpus');
    expect(artifact.generatedFrom.label).toBe('fixture-corpus');
    expect(artifact.generatedFrom.seedCount).toBe(observations.length);

    const shelf = artifact.cells.find(
      (c) => c.dimension === 'settType.institutionShelf' && c.bucket === 'town' && c.coBucket === 'Economy',
    );
    expect(shelf, 'the planted perfect association was not found').toBeTruthy();
    expect(shelf.effect).toBe(1);
    expect(shelf.n).toBe(60);

    // Nothing distinguishes volatility in this corpus (every world is 'moderate'), so its
    // table has a zero margin and phi is undefined. It must be recorded as untestable rather
    // than silently scored.
    expect(artifact.cells.some((c) => c.dimension.endsWith('.volatility'))).toBe(false);
    expect(artifact.evidence.cellsUntestable).toBeGreaterThan(0);
    expect(artifact.evidence.cellsKept).toBe(artifact.cells.length);
    expect(artifact.evidence.cellsKept).toBeLessThanOrEqual(artifact.evidence.cellsTested);
  }, 60_000);

  it('a corpus too small to clear MIN_N yields no cells rather than weak ones', () => {
    const tiny = join(mkdtempSync(join(tmpdir(), 'atlas-tiny-')), 'corpus.json');
    writeFileSync(tiny, JSON.stringify({
      label: 'tiny', generatorVersion: 'test', observations: observations.slice(0, 20),
    }));
    const artifact = JSON.parse(distil(['--corpus', tiny]));
    expect(artifact.cells).toEqual([]);
    expect(artifact.evidence.cellsUnderSampled).toBeGreaterThan(0);
    expect(artifact.evidence.cellsTested).toBe(0);
  }, 60_000);
});

describe('intent atlas soak prior — what the committed artifact actually claims', () => {
  it('every cell is tagged soak, capped, and above the sample floor', () => {
    expect(committed.cells.length).toBeGreaterThan(0);
    for (const cell of committed.cells) {
      expect(cell.source).toBe('soak');
      expect(cell.weight).toBeLessThanOrEqual(SOAK_WEIGHT_CAP);
      expect(cell.n).toBeGreaterThanOrEqual(EVIDENCE_FLOOR.MIN_N);
      expect(Object.keys(cell).sort()).toEqual(
        Object.keys(cell).filter((k) => ATLAS_CELL_KEYS.includes(k)).sort(),
      );
    }
  });

  it('speaks only to the two surfaces a generated world has evidence about', () => {
    // interpret compiles table sessions and autonomy composes conditions over live signals;
    // a corpus of freshly generated settlements contains neither, so a cell on either surface
    // would be an invention filling a slot. Recorded as an assertion so it stays a decision.
    const surfaces = [...new Set(committed.cells.map((c) => c.surface))].sort();
    expect(surfaces).toEqual(['construct', 'customContent']);
    for (const surface of surfaces) expect(ATLAS_SURFACES).toContain(surface);
  });

  it('carries no clock anywhere, which is what makes reproduction checkable', () => {
    // The design forbids timestamps finer than a week; carrying none at all is both simpler
    // and the reason the byte-identity test above can exist.
    expect(committedText).not.toMatch(/\b(19|20)\d{2}-\d{2}-\d{2}\b/);
    expect(committedText).not.toMatch(/generatedAt|timestamp|distilledAt/i);
  });
});
