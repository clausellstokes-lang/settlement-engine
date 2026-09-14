/**
 * tests/lint/scribeBundle.walker.test.js — THE DENO BUNDLE'S PINS (W1 deliverable 3).
 *
 * A bundle is a SECOND COPY of running code, and a second copy that can drift silently is the
 * estate's oldest failure shape. Three arms stand over it, and the third is the one that matters:
 *
 * 1. FRESHNESS, the census idiom. The bundle is rebuilt into memory here and compared BYTE FOR
 *    BYTE with the committed file, so editing any of the 22 inputs without rebuilding reds.
 * 2. IT LOADS. Imported as a module and exercised, because a file that parses is not a file that
 *    runs, and `deno check` beside it because Deno is the runtime that will actually import it.
 * 3. ⭐ IT AGREES WITH THE SOURCE. The same unit through the bundle's `refuteUnit` and through
 *    `src/domain/prose/refuteUnit.js` returns the SAME verdict and the SAME findings. Freshness
 *    proves the bytes were built from these inputs; only this proves the build did not change what
 *    the code DOES.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

import {
  buildScribeBundle, scribeBundlePaths, SCRIBE_ENTRIES,
} from '../../scripts/scribe-bundle.mjs';
import { refuteUnit, REFUTE_ARMS } from '../../src/domain/prose/refuteUnit.js';
import { cardDelta } from '../../src/domain/prose/epochRecord.js';
import { townCard } from '../../src/domain/prose/townCard.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const STATIC_CARD = JSON.parse(readFileSync(join(ROOT, 'docs/content/scribe-static-card.json'), 'utf8'));
const { outFile, metaFile } = scribeBundlePaths();

const SETTLEMENT = generateSettlementPipeline(
  {
    settType: 'town', culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized',
  },
  null,
  { seed: 'scribe-bundle-pin', customContent: {} },
);
const CARD = townCard(SETTLEMENT, { tab: 'defense', audience: 'dm', staticCard: STATIC_CARD });

/** A battery that reaches a FAIL, a WITHHELD, a REPORT and a NOT-EXECUTABLE between them. */
const BATTERY = Object.freeze([
  'The walls are kept and no soldiers of the town stand behind them.',
  'The elders say the walls are kept, which the hall pays for.',
  'The walls will be kept.',
  'A station runs 250 to 10,000 GP at tick 40.',
  'The stores carry the town through hunger, and nothing else in the reckoning pulls half as hard.',
]);

const unitOf = (text) => ({
  text, stance: 'spine', blockId: '', poolKey: '',
});

describe('the Scribe bundle — freshness', () => {
  it('the bundle and its meta are committed in tree', () => {
    expect(existsSync(outFile), `${outFile} is missing; run node scripts/scribe-bundle.mjs`).toBe(true);
    expect(existsSync(metaFile)).toBe(true);
  });

  it('a rebuild is BYTE-IDENTICAL to the committed file', async () => {
    const { source, meta } = await buildScribeBundle();
    const onDisk = readFileSync(outFile, 'utf8');
    expect(
      source === onDisk,
      '\nThe bundle is stale. One of its inputs moved without a rebuild: run `node scripts/scribe-bundle.mjs` and commit both files.\n',
    ).toBe(true);
    const committedMeta = JSON.parse(readFileSync(metaFile, 'utf8'));
    expect(committedMeta.sourceHash).toBe(meta.sourceHash);
    expect(committedMeta.inputs).toEqual(meta.inputs);
    expect(committedMeta.entry).toEqual([...SCRIBE_ENTRIES]);
  }, 120_000);

  it('two builds of one tree are byte-equal, so the meta carries no timestamp', async () => {
    const a = await buildScribeBundle();
    const b = await buildScribeBundle();
    expect(a.source).toBe(b.source);
    expect(JSON.stringify(a.meta)).toBe(JSON.stringify(b.meta));
    expect(Object.keys(a.meta).sort()).toEqual(['entry', 'inputs', 'sourceHash']);
  }, 120_000);

  it('every input is a real file under src, and none is a node_modules package', () => {
    const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
    expect(meta.inputs.length).toBeGreaterThan(0);
    for (const input of meta.inputs) {
      expect(existsSync(join(ROOT, input)), `${input} is not in tree`).toBe(true);
      expect(input.startsWith('node_modules/'), `${input} is a package: the bundle must be dependency-free`).toBe(false);
      expect(input.startsWith('src/'), `${input} is outside src`).toBe(true);
    }
    // BOTH LEAVES ARE ACTUALLY IN IT, which a bundle of only the first would not be.
    for (const entry of SCRIBE_ENTRIES) expect(meta.inputs).toContain(entry);
  });

  it('⛔ THE DIRTY-BUILD CLASS: no input was modified without being staged', () => {
    // The estate already named this class in `tests/edgeFunctions/edgeSharedBundleReproducibility
    // .test.js`: a bundle built from a dirty working tree passes its own freshness suite, because
    // that suite reads the same dirty tree, while NO CHECKOUT CAN REPRODUCE IT. That suite globs
    // `*Bundle.meta.json` and this bundle is named `proseKernel.bundle.meta.json`, so it is NOT
    // covered there. ⭐ FOR THE CHAIR: when the two builders merge in W2, this bundle should join
    // that glob and this arm should be struck. Until then the class is guarded here.
    const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
    const dirty = execFileSync('git', ['diff', '--name-only', '--', ...meta.inputs], {
      encoding: 'utf8', cwd: ROOT,
    }).split('\n').filter(Boolean);
    expect(
      dirty,
      '\nThese bundle inputs are modified in the working tree but not staged, so the committed bundle was built from content no checkout can reproduce. Stage them and rebuild.\n',
    ).toEqual([]);
  });

  it('it pulls in no test file, no component and no script', () => {
    const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
    expect(meta.inputs.filter((p) => p.includes('/components/'))).toEqual([]);
    expect(meta.inputs.filter((p) => p.includes('.test.'))).toEqual([]);
    expect(meta.inputs.filter((p) => p.startsWith('scripts/'))).toEqual([]);
  });
});

describe('the Scribe bundle — it loads and it runs', () => {
  it('it imports as an ESM module and exports both leaves whole', async () => {
    const mod = await import(pathToFileURL(outFile).href);
    for (const name of ['refuteUnit', 'refuteTab', 'REFUTE_ARMS', 'cardDelta', 'epochRecord']) {
      expect(typeof mod[name], `${name} is missing from the bundle`).not.toBe('undefined');
    }
    expect(mod.REFUTE_ARMS.length).toBe(REFUTE_ARMS.length);
  });

  it('it carries no bare specifier, so Deno needs no import map', () => {
    const source = readFileSync(outFile, 'utf8');
    const specifiers = [...source.matchAll(/^\s*(?:import|export)[^;]*?from\s+["']([^"']+)["']/gm)]
      .map((m) => m[1]);
    expect(specifiers).toEqual([]);
    expect(source.includes('require(')).toBe(false);
  });

  it('⭐ `deno check` accepts it, which is the runtime that will import it', () => {
    let deno;
    try {
      deno = execFileSync('which', ['deno'], { encoding: 'utf8' }).trim();
    } catch {
      deno = '';
    }
    if (!deno) {
      // ⛔ NOT-EXECUTABLE, SAID PLAINLY. A missing toolchain is a fact about this machine and not
      // a pass; the arm above (a real ESM import with no bare specifier) is what holds on a
      // machine without Deno, and this one says what it could not do.
      expect(deno).toBe('');
      return;
    }
    // ⛔⛔ `--no-lock`, AND IT IS NOT A CONVENIENCE. A bare `deno check` in this tree REWRITES
    // `deno.lock`: measured, it pruned `npm:three@0.185.1` from the workspace dependency list on
    // the first hand-run of this arm. A test that mutates a committed product file every time it
    // runs is a test that shows up as someone else's dirty diff, and in a shared tree it is worse
    // than that. The flag makes the check read-only; the arm below asserts the lock is untouched
    // afterwards, so the guard cannot be quietly dropped.
    const before = readFileSync(join(ROOT, 'deno.lock'), 'utf8');
    const out = execFileSync(deno, ['check', '--no-lock', outFile], {
      encoding: 'utf8', cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'],
    });
    expect(typeof out).toBe('string');
    expect(readFileSync(join(ROOT, 'deno.lock'), 'utf8'), 'deno check rewrote deno.lock').toBe(before);
  }, 180_000);
});

describe('the Scribe bundle — it agrees with the source, which freshness alone cannot prove', () => {
  it('every unit of the battery gets the SAME verdict and the SAME findings from both', async () => {
    const mod = await import(pathToFileURL(outFile).href);
    for (const text of BATTERY) {
      const fromSource = refuteUnit(unitOf(text), CARD, { corpusUnit: { text: 'The walls are kept.' } });
      const fromBundle = mod.refuteUnit(unitOf(text), CARD, { corpusUnit: { text: 'The walls are kept.' } });
      expect(fromBundle.verdict, `verdict differs on: ${text}`).toBe(fromSource.verdict);
      expect(JSON.stringify(fromBundle.findings), `findings differ on: ${text}`)
        .toBe(JSON.stringify(fromSource.findings));
      expect(JSON.stringify(fromBundle.report)).toBe(JSON.stringify(fromSource.report));
    }
  });

  it('the battery actually reaches a FAIL and a WITHHELD, so the arm above is not vacuous', () => {
    const verdicts = BATTERY.map((t) => refuteUnit(unitOf(t), CARD, {}).verdict);
    expect(verdicts).toContain('FAIL');
    expect(verdicts).toContain('WITHHELD');
  });

  it('cardDelta agrees across the seam on a real pair of cards', async () => {
    const mod = await import(pathToFileURL(outFile).href);
    const other = townCard(SETTLEMENT, { tab: 'power', audience: 'dm', staticCard: STATIC_CARD });
    expect(JSON.stringify(mod.cardDelta(CARD, other))).toBe(JSON.stringify(cardDelta(CARD, other)));
    expect(mod.cardDelta(CARD, CARD).empty).toBe(true);
  });
});
