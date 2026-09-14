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
import {
  SCRIBE_OUTPUT_SCHEMA, TIER1_QUESTIONS, applyTier1, buildScribeBrief, buildScribeUserTurn,
  buildTier1Checklist, buildTownBlock, judgeUnits, parseScribeUnits, tier1Lines,
} from '../../src/domain/prose/scribeBrief.js';
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
  it('it imports as an ESM module and exports every leaf whole', async () => {
    const mod = await import(pathToFileURL(outFile).href);
    for (const name of [
      'refuteUnit', 'refuteTab', 'REFUTE_ARMS', 'cardDelta', 'epochRecord',
      // ⭐ THE PROMPT LEAF (W3a car 1, chair ruling 25). `scribeCore.ts` re-exports exactly these
      // names, so a bundle missing one is an edge function that will not boot.
      'SCRIBE_OUTPUT_SCHEMA', 'buildScribeBrief', 'buildTownBlock', 'buildScribeUserTurn',
      'buildTier1Checklist', 'parseScribeUnits', 'judgeUnits',
    ]) {
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

  it('⭐ THE PROMPT IS THE SAME BYTES THROUGH THE BUNDLE AND THROUGH THE SOURCE', async () => {
    // ⛔ THE ARM THIS BUNDLE MOST NEEDS, because the fork it cures was invisible for exactly this
    // reason: two builders producing two prompts, both green, both measured, neither the other.
    // The pilot imports the SOURCE leaf from the dock and the edge function imports the BUNDLE;
    // if those two ever disagree by a byte the pilot is measuring a prompt nobody ships.
    const mod = await import(pathToFileURL(outFile).href);
    const voice = 'THE VOICE, as a fixture: plain words, no first person.';
    const exemplars = '# THE EXEMPLAR PACK\nA fixture pack, three lines long.\n';
    expect(mod.buildScribeBrief({ voice, exemplars })).toBe(buildScribeBrief({ voice, exemplars }));
    expect(mod.buildTownBlock(CARD)).toBe(buildTownBlock(CARD));
    expect(mod.buildScribeUserTurn({ card: CARD, guidance: 'dwell on the gate' }))
      .toBe(buildScribeUserTurn({ card: CARD, guidance: 'dwell on the gate' }));
    expect(JSON.stringify(mod.SCRIBE_OUTPUT_SCHEMA)).toBe(JSON.stringify(SCRIBE_OUTPUT_SCHEMA));
    // And the brief really does carry the whole town-free prompt: an empty answer here would make
    // every equality above vacuous.
    expect(buildScribeBrief({ voice, exemplars }).includes(voice)).toBe(true);
    expect(buildScribeUserTurn({ card: CARD }).length).toBeGreaterThan(200);
  });

  it('⭐ ONE JUDGE: the bundle and the source return the same verdicts on one real pool', async () => {
    const mod = await import(pathToFileURL(outFile).href);
    const pool = CARD.pools[0];
    expect(pool, 'the pinned town fires no pool on the defense tab').toBeTruthy();
    const answer = JSON.stringify({
      units: [{
        blockId: pool.blockId,
        poolKey: pool.poolKey,
        vid: pool.vid,
        spine: 'The walls are kept and no soldiers of the town stand behind them.',
        faces: pool.unit.faces.map(() => 'A clerk in the hall says the keeping is paid out of the common purse.'),
        notebook: [],
      }],
    });
    const fromSource = parseScribeUnits(answer);
    const fromBundle = mod.parseScribeUnits(answer);
    expect(JSON.stringify(fromBundle)).toBe(JSON.stringify(fromSource));
    expect(fromSource.ok).toBe(true);
    const a = judgeUnits(fromSource.units, CARD, refuteUnit);
    const b = mod.judgeUnits(fromBundle.units, CARD, mod.refuteUnit);
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    expect(a.verdicts.length).toBe(1);
    expect(['PASS', 'WITHHELD', 'PATCHED', 'FAIL']).toContain(a.verdicts[0].verdict);
  });

  it('⭐ THE SECOND READER: applyTier1 drops on a yes and keeps on a clean sheet, both sides of the seam', async () => {
    // ⛔ THE CONTROLS LIVE HERE RATHER THAN IN THEIR OWN FILE ON PURPOSE. This suite is the one
    // the gate runs that imports the prompt leaf, and driving each control through BOTH the source
    // and the bundle makes it a stronger arm than a source-only one would be: the edge function
    // runs the BUNDLE's `applyTier1`, so a control that only ever exercised the source would prove
    // nothing about what ships.
    const mod = await import(pathToFileURL(outFile).href);
    const unit = {
      blockId: 'DS-DEF-2',
      poolKey: 'k',
      vid: 3,
      spine: 'The walls are kept.',
      faces: ['A clerk in the hall says the purse is short.'],
      notebook: [],
    };
    const no = Object.fromEntries(TIER1_QUESTIONS.map((q) => [q.key, 'no']));

    // The enumeration both the checklist and the application read: one row per non-empty line.
    expect(tier1Lines([unit]).map((r) => r.n)).toEqual([1, 2]);
    expect(tier1Lines([unit]).map((r) => r.row)).toEqual(['spine', 'face 0']);
    expect(mod.tier1Lines([unit]).map((r) => r.row)).toEqual(['spine', 'face 0']);

    // POSITIVE CONTROL — a clean sheet keeps the unit.
    const clean = [{ n: 1, ...no }, { n: 2, ...no }];
    expect(applyTier1([unit], clean).kept.length).toBe(1);
    expect(applyTier1([unit], clean).dropped).toBe(0);
    expect(JSON.stringify(mod.applyTier1([unit], clean))).toBe(JSON.stringify(applyTier1([unit], clean)));

    // ⭐ NEGATIVE CONTROL — one `yes` on the SPINE takes the unit whole, because the spine is the
    // fact. W3b car 3 amends ruling 5/6: a unit ships whole OR PATCHED, never with a refused row.
    for (const question of TIER1_QUESTIONS) {
      const sheet = [{ n: 1, ...no, [question.key]: 'yes' }];
      const out = applyTier1([unit], sheet);
      expect(out.kept.length, `${question.key} did not drop the unit`).toBe(0);
      expect(out.verdicts[0].arms).toEqual([question.arm]);
      expect(out.verdicts[0].verdict).toBe('FAIL');
      expect(JSON.stringify(mod.applyTier1([unit], sheet))).toBe(JSON.stringify(out));
    }

    // ⭐⭐ AND ONE `yes` ON A FACE PATCHES THAT SEAT AND SHIPS THE REST, on a REAL card, so the
    // corpus face it falls to is the one the composer would have rendered for this pool anyway.
    const pool = CARD.pools.find((p) => Array.isArray(p.unit.faces) && p.unit.faces.length > 0);
    expect(pool, 'the pinned town fires no pool with a face on the defense tab').toBeTruthy();
    const real = {
      blockId: pool.blockId,
      poolKey: pool.poolKey,
      vid: pool.vid,
      spine: 'The walls are kept and no soldiers of the town stand behind them.',
      faces: pool.unit.faces.map((_, i) => `A clerk in the hall says the keeping is paid out of the common purse, line ${i}.`),
      notebook: [],
    };
    const faceSheet = [{ n: 2, ...no, record: 'yes' }];
    const patched = applyTier1([real], faceSheet, CARD);
    expect(patched.kept.length, 'the unit must ship with the corpus at that seat').toBe(1);
    expect(patched.patched).toBe(1);
    expect(patched.dropped).toBe(0);
    expect(patched.verdicts[0].verdict).toBe('PATCHED');
    expect(patched.verdicts[0].patched).toEqual(['face 0']);
    expect(patched.kept[0].faces[0]).toBe(pool.unit.faces[0]);
    expect(JSON.stringify(mod.applyTier1([real], faceSheet, CARD))).toBe(JSON.stringify(patched));

    // ⛔ WITHOUT A CARD THERE IS NO CORPUS FACE TO PATCH WITH, so the unit falls whole. Both sides
    // of the seam agree on that too.
    expect(applyTier1([real], faceSheet).kept.length).toBe(0);
    expect(JSON.stringify(mod.applyTier1([real], faceSheet))).toBe(JSON.stringify(applyTier1([real], faceSheet)));

    // ⭐ A ROW BYTE-EQUAL TO THE CORPUS IS EXEMPT, on both sides, and the numbering does not move.
    const copied = { ...real, faces: [...pool.unit.faces] };
    expect(tier1Lines([copied], CARD).filter((r) => r.corpus).map((r) => r.row))
      .toEqual(pool.unit.faces.map((_, i) => `face ${i}`));
    expect(tier1Lines([copied], CARD).map((r) => r.n)).toEqual(tier1Lines([copied]).map((r) => r.n));
    expect(applyTier1([copied], faceSheet, CARD).kept.length, 'a yes on an exempt row is ignored').toBe(1);
    expect(mod.buildTier1Checklist([copied], CARD)).toBe(buildTier1Checklist([copied], CARD));
    // ⛔ EXEMPT MEANS NOT ASKED, NOT ABSENT. Since W3d car 3 the pool's own hand-written line is
    // printed with the facts as the grant the RECORD and ROSTER questions read, so the arm is that
    // no NUMBERED line carries it.
    const checklist = buildTier1Checklist([copied], CARD);
    expect(new RegExp(`\\d+\\. \\(face 0\\) ${pool.unit.faces[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(checklist)).toBe(false);
    expect(checklist).toContain(`      face 0: ${pool.unit.faces[0]}`);

    // THE TIER-0 JUDGE TAKES THE SAME FALLBACK AT THE SAME GRAIN, both sides of the seam.
    const emdash = { ...real, faces: real.faces.map((t, i) => (i === 0 ? 'A clerk says the purse is short — and getting shorter.' : t)) };
    const judged = judgeUnits([emdash], CARD, refuteUnit);
    expect(judged.patched).toBe(1);
    expect(judged.kept[0].faces[0]).toBe(pool.unit.faces[0]);
    expect(JSON.stringify(mod.judgeUnits([emdash], CARD, mod.refuteUnit))).toBe(JSON.stringify(judged));

    // AND THE CHECKLIST THE ANSWERS ARE ABOUT IS THE SAME BYTES ON BOTH SIDES.
    expect(mod.buildTier1Checklist([unit], CARD)).toBe(buildTier1Checklist([unit], CARD));
    expect(buildTier1Checklist([unit], CARD)).toContain('1. (spine) The walls are kept.');
  });

  it('⭐⭐ THE WRITER SEES THE PAGE OF A REAL TOWN, and never its composed rows (W3d car 1)', () => {
    // ⛔ THE TWO LINES RUN 3 NAMED, ON THE TWO REAL CARDS THEY WERE MEASURED ON. Twenty four of
    // the run's twenty eight contradictions denied a machine line the writer never saw: the hamlet
    // Warmholz's crisis summary, and the guard assessment beside it on a defense page. Both are
    // now in the writer's own turn, and the arm is driven over the real render rather than a
    // fixture so a page row that stops being emitted reds here.
    const pinned = generateSettlementPipeline(
      {
        settType: 'town', culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized',
      },
      null,
      { seed: 'render-town', customContent: {} },
    );
    const hamlet = generateSettlementPipeline(
      {
        settType: 'hamlet', culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized',
      },
      null,
      { seed: 'sim-hamlet', customContent: {} },
    );
    const defense = townCard(pinned, { tab: 'defense', audience: 'dm', staticCard: STATIC_CARD });
    const overview = townCard(hamlet, { tab: 'overview', audience: 'dm', staticCard: STATIC_CARD });
    const defenseTurn = buildScribeUserTurn({ card: defense });
    const overviewTurn = buildScribeUserTurn({ card: overview });

    // THE GUARD ASSESSMENT, on the tab whose writer denied it.
    const guard = defense.page.find((r) => r.label === 'guardEffectivenessDesc');
    expect(guard, 'the pinned town prints no guard assessment').toBeTruthy();
    expect(defenseTurn).toContain(`[machine] guardEffectivenessDesc: ${guard.text}`);
    // THE CRISIS SUMMARY, on the town whose writer wrote "nothing here is urgent" beside it.
    const crisis = overview.page.find((r) => r.label === 'crisis.summary');
    expect(crisis, 'Warmholz prints no crisis summary').toBeTruthy();
    expect(overviewTurn).toContain(`[machine] crisis.summary: ${crisis.text}`);

    // EVERY badge, machine and row line of the card is in the turn, and NO composed row is.
    for (const card of [defense, overview]) {
      const turn = buildScribeUserTurn({ card });
      const section = turn.slice(turn.indexOf('THE PAGE AS THE READER MEETS IT'), turn.indexOf('THE LINES TO WRITE:'));
      expect(section.length, 'the page section is empty').toBeGreaterThan(200);
      let machine = 0;
      let composed = 0;
      for (const row of card.page) {
        if (['badge', 'machine', 'row'].includes(row.kind)) {
          expect(section, `${row.kind} ${row.label} is missing from the page section`)
            .toContain(`[${row.kind}] ${row.label}: ${row.text}`);
          machine += 1;
        }
        if (row.kind === 'composed' && row.text) {
          expect(section.includes(row.text), `a composed row reached the page section: ${row.text.slice(0, 50)}`).toBe(false);
          composed += 1;
        }
      }
      expect(machine, 'the page carries no machine line: the arm is vacuous').toBeGreaterThan(5);
      expect(composed, 'the page carries no composed row: the exclusion is vacuous').toBeGreaterThan(0);
    }
  }, 120_000);

  it('⭐⭐ THE RECORD AND ROSTER TESTS GRANT WHAT THE POOL\'S OWN CORPUS LINE NAMES (W3d car 3)', () => {
    // ⛔ THE TWO REAL ROSTER REFUSALS OF RUN 3. Six of the run's eight roster contradictions were
    // bodies the engine named; the other two were RECORDS — "the returns", "the books wait" —
    // refused as records no body here keeps. The corpus's own DS-DEF-3 spine for that very pool
    // reads "would show up in the returns within the season". The hand corpus is the floor and the
    // line a refusal falls back TO, so refusing a line for naming what its own fallback names is a
    // refusal that cannot be right whichever way it is answered.
    const pinned = generateSettlementPipeline(
      {
        settType: 'town', culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized',
      },
      null,
      { seed: 'render-town', customContent: {} },
    );
    const card = townCard(pinned, { tab: 'defense', audience: 'dm', staticCard: STATIC_CARD });
    const pool = card.pools.find((p) => p.blockId === 'DS-DEF-3' && /returns/.test(p.unit.spine));
    expect(pool, 'the pinned town fires no DS-DEF-3 pool whose spine names the returns').toBeTruthy();
    expect(pool.unit.spine).toContain('would show up in the returns within the season');

    const written = {
      blockId: pool.blockId,
      poolKey: pool.poolKey,
      vid: pool.vid,
      spine: 'The balance here sits where either side could take it, and the season\'s returns would show it.',
      faces: pool.unit.faces.map((_, i) => `A clerk of the court says as much, line ${i}.`),
      notebook: [],
    };
    const checklist = buildTier1Checklist([written], card);
    // THE GRANT IS IN BOTH QUESTIONS THE TWO REFUSALS FELL UNDER.
    expect(checklist).toContain('GRANTED, and not a yes: a record, an office or a body that the pool\'s OWN hand-written line names');
    expect(checklist).toContain('or THE POOL\'S OWN HAND-WRITTEN LINE names it: any of the four is enough');
    // AND THE LINE THE GRANT POINTS AT IS ACTUALLY PRINTED, beside this pool's own lines, labelled
    // as the claim rather than as a line to judge.
    expect(checklist).toContain('THE HAND-WRITTEN LINE THIS POOL SHIPS');
    expect(checklist).toContain(`      spine: ${pool.unit.spine}`);
    const at = checklist.indexOf(`POOL ${JSON.stringify(pool.poolKey)}`);
    expect(at, 'the pool block is missing').toBeGreaterThan(-1);
    expect(checklist.indexOf(`      spine: ${pool.unit.spine}`)).toBeGreaterThan(at);
    expect(checklist.indexOf(`      spine: ${pool.unit.spine}`))
      .toBeLessThan(checklist.indexOf(written.spine));
    // ⛔ AND IT IS GROUND, NOT A QUESTION: no numbered line carries the hand-written spine.
    expect(/\d+\. \(spine\) The balance at/.test(checklist)).toBe(false);
    expect(checklist).toContain(`1. (spine) ${written.spine}`);
  }, 120_000);

  it('cardDelta agrees across the seam on a real pair of cards', async () => {
    const mod = await import(pathToFileURL(outFile).href);
    const other = townCard(SETTLEMENT, { tab: 'power', audience: 'dm', staticCard: STATIC_CARD });
    expect(JSON.stringify(mod.cardDelta(CARD, other))).toBe(JSON.stringify(cardDelta(CARD, other)));
    expect(mod.cardDelta(CARD, CARD).empty).toBe(true);
  });
});
