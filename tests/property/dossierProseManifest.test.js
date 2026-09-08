/**
 * tests/property/dossierProseManifest.test.js — THE COMPOSED-PROSE MANIFEST (ARCH §3.7).
 *
 * WHAT IT PROVES. The generator golden master hashes the serialised settlement and provably
 * cannot see a dossier SENTENCE — `readStateProse` is called only from
 * `src/domain/display/stateProse/*`. So the estate has, until this car, had no instrument that
 * notices when composed PROSE moves. This suite is that instrument's fast half: the DRIFT
 * corpus (the golden master's own 525 configurations, at BOTH audiences) composed through the
 * six desks by their shipped desk-read recipes, rolled up to one sha per (config, audience)
 * row, against a committed fixture. Three empty lists are the arm: no row added, no row
 * removed, no row moved.
 *
 * ⛔ WHAT IT IS NOT. It is not a quality gate and it sets no threshold. Its cost is PRINTED,
 * never asserted against a limit — a wall-clock assertion on a shared runner is a flake
 * dressed as a finding.
 *
 * ── THE THREE CONTROLS NO ONE-AUDIENCE MANIFEST CAN SEE (ARCH §3.7) ─────────────────
 *   THE MIXED-POOL AUDIENCE ARM. `eligibleVariants` applies `variantIsAudible` BEFORE the
 *   modulus, so on a pool holding both `dm-only` and unmarked variants the player's list is
 *   shorter and the drawn INDEX may differ. The count of cells where the two audiences differ
 *   is pinned, and every one of them must belong to a mixed pool: a difference anywhere else
 *   is a leak from the DM face onto the player's.
 *
 *   THE PAIRED-TOWN COVERT ARM. A pool whose READS name a covert source may not be observable
 *   on the player face at all — not the sentence, and not what it prevented. At this tip there
 *   is no candidate stage to suppress at, so the arm's executable form is exact: NO player
 *   cell may be drawn from a covert pool. Suppressing them would then change nothing, which is
 *   what byte-equality across the 525 means here.
 *
 *   THE SEEDLESS CONTROL. `galleryImportSettlement.js:76` nulls `_seed`, so an imported town
 *   reaches the desks with no seed and `drawVariant` returns `eligible[0]`. Every cell of a
 *   seedless town must therefore read index 0 — the promise's own degenerate case, and the one
 *   a reader of an imported dossier actually meets.
 *
 * @enforced-by npx vitest run tests/property/dossierProseManifest.test.js
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  AUDIENCES, driftRun, goldenCorpus, keyOf, manifestBytes, poolIndex, sha256, templateMatches,
} from '../helpers/dossierManifest.js';
import { classifyCell, classifyCells, VERDICTS } from '../../scripts/prose-manifest-diff.mjs';
import { drawVariant } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { ROOT } from '../helpers/dossierCorpus.js';

/** The committed roll-up. Named `-golden` on purpose: see the register row's note. */
const MANIFEST_REL = 'tests/fixtures/dossier-prose-manifest-golden.json';
const MANIFEST = join(ROOT, MANIFEST_REL);

// ONE RUN FOR THE WHOLE SUITE. 525 generations at two audiences is nine seconds; taking it
// once at module scope is the golden master's own shape and keeps every arm below reading the
// SAME world rather than three worlds that merely agree.
const run = await driftRun();
const pools = await poolIndex();

describe('the composed-prose manifest — the DRIFT corpus, both audiences', () => {
  test('the corpus is the golden master\'s own 525 configurations at two audiences', () => {
    expect(goldenCorpus().length, 'the golden master\'s row count').toBe(525);
    expect([...AUDIENCES], 'recorded at both faces, always').toEqual(['dm', 'player']);
    expect(run.rows.size, 'one row per configuration per audience').toBe(525 * 2);
    expect(run.towns).toBe(525);
    // THE COST, PRINTED AND NEVER ASSERTED. A wall-clock threshold on a shared runner is a
    // flake wearing a finding's coat; the figure is here so a reader can see what the
    // instrument costs and decide, not so a gate can fail on a busy machine.
    process.stdout.write(`\n[dossier-prose-manifest] ${run.towns} towns x ${AUDIENCES.length}`
      + ` audiences = ${run.cells.length} cells in ${run.seconds} s\n`);
  }, 120_000);

  test('EVERY CELL RESOLVES TO A VARIANT, and the resolution is not a guess', () => {
    // The cell's variant is identified from the RENDERED SENTENCE against the pool's own
    // templates, because `eligibleVariants` filters by slot ANCHORING and by state DIMENSIONS
    // and neither is visible from outside the desk call. Two integers keep that honest.
    expect(run.unresolved, 'cells whose sentence matched no variant of its pool').toBe(0);
    expect(run.ambiguous, 'cells whose sentence matched more than one').toBe(0);
    // AND THE FOOTPRINT OF THE FILTER THIS MODULE CANNOT SEE, printed rather than asserted:
    // a recomputation over the AUDIBLE pool disagrees exactly where anchoring narrowed it.
    expect(run.drawDisagrees, 'the anchoring filter is real, so the two readings differ somewhere')
      .toBeGreaterThan(0);
    process.stdout.write(`[dossier-prose-manifest] cells whose audible-pool recomputation`
      + ` would draw differently: ${run.drawDisagrees} of ${run.cells.length}\n`);
  }, 120_000);

  test('⭐ THE DRIFT ARM: no row added, no row removed, no row moved', () => {
    expect(existsSync(MANIFEST), `${MANIFEST_REL} is missing`).toBe(true);
    /** @type {Record<string, string>} */
    const fixture = JSON.parse(readFileSync(MANIFEST, 'utf8'));
    const live = run.rows;
    const added = [...live.keys()].filter((k) => !Object.hasOwn(fixture, k)).sort();
    const removed = Object.keys(fixture).filter((k) => !live.has(k)).sort();
    const moved = [...live.keys()].filter((k) => Object.hasOwn(fixture, k) && fixture[k] !== live.get(k)).sort();
    expect(added, 'rows the corpus grew').toEqual([]);
    expect(removed, 'rows the corpus lost').toEqual([]);
    expect(moved, 'rows whose composed prose moved').toEqual([]);
    // AND THE BYTES, so a whitespace-only edit of the fixture convicts too.
    expect(sha256(readFileSync(MANIFEST, 'utf8')), 'the fixture is exactly what this run produces')
      .toBe(sha256(manifestBytes(live)));
  }, 120_000);

  test('the base-side normalisation is the one-piece unit car 3a must reproduce', () => {
    // M-F6. There is no `pieces` and no `face` in the shipped shape; the recorder synthesises
    // both, and car 3a asserts the composer's `pieces` for an EMPTY candidate list is
    // identical to this synthesis. Recorded so that assertion has something to be identical to.
    const odd = run.cells.filter((c) => c.face !== 0
      || c.pieces.length !== 1
      || c.pieces[0].role !== 'spine'
      || c.pieces[0].key !== c.pool
      || c.pieces[0].vid !== c.vid
      || c.pieces[0].index !== c.index
      || c.pieces[0].face !== 0);
    expect(odd.map((c) => c.cell), 'every cell is one spine piece at face 0').toEqual([]);
  }, 120_000);
});

describe('the two controls no one-audience manifest can see', () => {
  test('⭐ THE MIXED-POOL AUDIENCE ARM: the two faces differ only where a pool is mixed', () => {
    // The MIXED pools hold both a `dm-only` variant and an unmarked one. On those, the
    // player's audible list is shorter, so the modulus lands elsewhere and the drawn variant
    // may differ. Everywhere else the two faces must read the same words.
    const mixed = new Set();
    for (const [key, variants] of pools) {
      const covert = variants.filter((v) => v.marks.includes('dm-only')).length;
      if (covert > 0 && covert < variants.length) mixed.add(key);
    }
    expect(mixed.size, 'mixed pools in the shipped corpus').toBe(12);
    /** @type {Map<string, {dm?: object, player?: object}>} */
    const byPosition = new Map();
    for (const cell of run.cells) {
      const parts = cell.cell.split('::');
      const at = `${parts[0]}::${parts.slice(2).join('::')}`;
      const seat = byPosition.get(at) || {};
      seat[parts[1]] = cell;
      byPosition.set(at, seat);
    }
    /** @type {Array<{at: string, dm: object, player: object}>} */
    const differ = [];
    /** @type {string[]} */
    const oneSided = [];
    for (const [at, seat] of byPosition) {
      if (!seat.dm || !seat.player) { oneSided.push(at); continue; }
      if (seat.dm.pool !== seat.player.pool || seat.dm.vid !== seat.player.vid
        || seat.dm.textSha !== seat.player.textSha) {
        differ.push({ at, dm: seat.dm, player: seat.player });
      }
    }
    // ⛔ EVERY DIFFERENCE MUST SIT ON A MIXED POOL. A difference anywhere else is the DM face
    // leaking onto the player's, which is the one failure this arm exists for.
    const leaks = differ.filter((row) => !mixed.has(`${row.dm.block} :: ${row.dm.pool}`)
      && !mixed.has(`${row.player.block} :: ${row.player.pool}`));
    expect(leaks.map((row) => row.at), 'a face difference on a pool that is NOT mixed').toEqual([]);
    // THE COUNT IS PINNED, because both directions are movements a reader must see: a cure
    // that stopped filtering the player face drives it up, and one that stopped composing the
    // player face at all drives it to zero.
    expect(differ.length, 'cells where the two faces draw differently').toBe(36);
    expect(new Set(differ.map((row) => `${row.dm.block} :: ${row.dm.pool}`)).size,
      'over this many of the twelve mixed pools').toBe(1);
    // AND THE ONE-SIDED POSITIONS: a rung the DM sees and the player does not is the audience
    // filter emptying a pool, which is lawful and is counted rather than assumed away.
    process.stdout.write(`[dossier-prose-manifest] audience-divergent cells ${differ.length}`
      + ` of ${byPosition.size} positions · positions on one face only ${oneSided.length}\n`);
  }, 120_000);

  test('⭐ THE PAIRED-TOWN COVERT ARM: no player cell is drawn from a covert pool', () => {
    // Car 0's census marks a pool `covert` when its READS name a covert source. Suppressing
    // every covert pool at the candidate stage must change the player face by nothing, and at
    // this tip — where there is no candidate stage — that is exactly "no player cell comes
    // from one". If this arm ever reds, the difference IS the leak.
    const census = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
    const covert = new Set(census.rows.filter((r) => r.covert).map((r) => `${r.block} :: ${r.pool}`));
    expect(covert.size, 'the census names this many covert pools').toBeGreaterThan(0);
    const playerCells = run.cells.filter((c) => c.cell.split('::')[1] === 'player');
    const suppressed = playerCells.filter((c) => !covert.has(`${c.block} :: ${c.pool}`));
    expect(suppressed.length, 'the player face composed with every covert pool suppressed')
      .toBe(playerCells.length);
    expect(new Set(playerCells.map((c) => c.cell.split('::')[0])).size,
      'and the equality holds across every configuration of the corpus').toBe(525);
    // ⛔ AND THE ARM IS VACUOUS ON THIS CORPUS, WHICH IS ITSELF THE FINDING AND IS SAID OUT
    // LOUD. The four covert pools are DS-WAR-1's mobilization ladder, and they fire on NO town
    // of the 525 here and on none of the 768 of the RATE corpus either (`rateBp: null` on all
    // four in the committed census). So the equality above holds because there is nothing to
    // suppress. The LOGIC is therefore driven on a synthetic cell instead, or this arm would
    // report a clean bill about a filter nobody has run.
    const fake = [
      { block: 'DS-WAR-1', pool: 'mobilization: COVERT', cell: 'x::player::war.standing::0' },
      { block: 'DS-GEN-3', pool: 'prosperity: Moderate / Modest', cell: 'x::player::overview.systemsHealth::0' },
    ];
    expect(fake.filter((c) => !covert.has(`${c.block} :: ${c.pool}`)).length,
      'the suppression removes a covert cell and keeps an ordinary one').toBe(1);
    // THE PAIRED POSITIVE on the corpus, printed rather than asserted: whether the DM face
    // draws them at all is the measurement that says how much this arm currently protects.
    const dmCovert = run.cells.filter((c) => c.cell.split('::')[1] === 'dm'
      && covert.has(`${c.block} :: ${c.pool}`));
    process.stdout.write(`[dossier-prose-manifest] covert pools ${covert.size} · DM cells drawn`
      + ` from one ${dmCovert.length} · player cells ${playerCells.filter((c) => covert.has(`${c.block} :: ${c.pool}`)).length}\n`);
  }, 120_000);

  test('⭐ THE SEEDLESS CONTROL: an imported town draws the FIRST eligible variant', async () => {
    // `galleryImportSettlement.js:76` nulls `_seed`, so the desks reach `drawVariant` with an
    // empty seed and it returns `eligible[0]` without hashing at all.
    expect(drawVariant([{ text: 'a' }, { text: 'b' }], 'B', 'P', ''), 'the kernel\'s own law')
      .toEqual({ text: 'a' });
    // ⛔ AND ON THE CORPUS, WITHOUT SEEING `eligible`. This module can compute the AUDIBLE
    // pool and not the ELIGIBLE one (slot anchoring and state dimensions live inside the desk
    // call), so "index 0" is not the assertion: `eligible[0]` may sit at audible index 3 when
    // three earlier variants named a slot the call site did not fill. The executable form is
    // exact instead: compose each town at twelve different seeds and collect every index that
    // cell is ever seen to draw. `eligible[0]` has the LOWEST audible index of any eligible
    // variant, so the seedless draw must be at or below every one of them.
    //
    // ⚠ AT OR BELOW, NEVER EQUAL, AND THE REASON IS ARITHMETIC RATHER THAN TASTE. Twelve
    // probes over a three-variant pool miss the lowest index with probability (2/3)^12, about
    // once in 130 cells; over a thousand cells an equality would red on chance alone. The
    // ordering is what `eligible[0]` actually claims, and it is exact at any probe count.
    const sample = goldenCorpus().slice(0, 8);
    const seedless = await driftRun({ configs: sample, seedOverride: '' });
    /** @type {Map<string, Set<number>>} */
    const seen = new Map();
    for (let i = 0; i < 12; i++) {
      const probe = await driftRun({ configs: sample, seedOverride: `seedless-probe-${i}` });
      for (const cell of probe.cells) {
        const seat = seen.get(cell.cell) || new Set();
        seat.add(cell.index);
        seen.set(cell.cell, seat);
      }
    }
    const wrong = seedless.cells.filter((cell) => {
      const observed = seen.get(cell.cell);
      return !observed || cell.index > Math.min(...observed);
    }).map((c) => `${c.cell} drew ${c.index}`);
    expect(wrong, 'a seedless cell that drew above a variant a seeded run reached')
      .toEqual([]);
    const belowEveryProbe = seedless.cells.filter((cell) => {
      const observed = seen.get(cell.cell);
      return observed && cell.index < Math.min(...observed);
    }).length;
    expect(seedless.cells.length, 'the sample composed').toBeGreaterThan(100);
    // THE PAIRED POSITIVE: the twelve probes do reach other indices, or the arm above would
    // pass on a corpus where every pool has one eligible variant and nothing is being tested.
    expect([...seen.values()].some((s) => s.size > 1),
      'the probe seeds reach more than one variant somewhere').toBe(true);
    const notZero = seedless.cells.filter((c) => c.index !== 0).length;
    process.stdout.write(`[dossier-prose-manifest] seedless cells ${seedless.cells.length}`
      + ` · drawing an AUDIBLE index above 0 because anchoring removed an earlier variant: ${notZero}`
      + ` · strictly below every one of the twelve probes (the probes' own coupon-collection`
      + ` shortfall, not a finding): ${belowEveryProbe}\n`);
  }, 120_000);
});

describe('the classifier — what KIND of movement, per cell', () => {
  test('the five verdicts are tested strongest-first, and each fits its own case', () => {
    const spine = (vid, index) => [{
      role: 'spine', key: 'P', vid, index, face: 0,
    }];
    const base = {
      cell: 'c', pool: 'P', vid: 1, index: 1, face: 0, textSha: 'aaaa', pieces: spine(1, 1),
    };
    expect(classifyCell(base, { ...base }), 'nothing moved').toBe('UNCHANGED');
    expect(classifyCell(base, { ...base, textSha: 'bbbb' }), 'same pool, same variant, new words')
      .toBe('WORDING-ONLY');
    expect(classifyCell(base, { ...base, vid: 2, pieces: spine(2, 1), textSha: 'bbbb' }),
      'same pool, a different variant').toBe('RE-INDEXED');
    expect(classifyCell(base, { ...base, pool: 'Q', textSha: 'bbbb' }), 'a different pool')
      .toBe('REPLACED');
    expect(classifyCell(base, {
      ...base,
      pieces: [...spine(1, 1), { role: 'modifier', key: 'M', vid: 0, index: 0, face: 0 }],
    }), 'a piece added beside an unchanged spine').toBe('ADDITIVE');
    expect(classifyCell(base, {
      ...base, pieces: [...spine(1, 1), { role: 'turn', key: 'T', vid: 0, index: 0, face: 0 }],
    }), 'a turn is a replacement, never an addition').toBe('REPLACED');
    // ⛔ THE ORDER IS THE SPECIFICATION, and here is the case that proves it: a cell whose POOL
    // changed also has new words. Tested weakest-first it would read WORDING-ONLY, and a
    // signed car would report "only wording moved" about a cell that speaks a different fact.
    expect(VERDICTS.indexOf('REPLACED') < VERDICTS.indexOf('WORDING-ONLY'),
      'REPLACED is tested before WORDING-ONLY').toBe(true);
  });

  test('an index-only move is UNCHANGED and is counted apart', () => {
    // `index` is the position within the AUDIENCE-FILTERED pool. It can move while the drawn
    // variant does not, which no reader sees — but it does move the row roll-up, so a reader
    // of a red drift arm needs the count or the class table explains nothing.
    const cellOf = (index) => ({
      cell: 'c', pool: 'P', vid: 1, index, face: 0, textSha: 'aaaa',
      pieces: [{ role: 'spine', key: 'P', vid: 1, index, face: 0 }],
    });
    const diff = classifyCells([cellOf(1)], [cellOf(2)]);
    expect(diff.byClass.get('UNCHANGED').cells, 'the reader sees nothing').toEqual(['c']);
    expect(diff.indexOnly, 'and the instrument says so out loud').toBe(1);
  });

  test('a cell present on one side only is ADDED or REMOVED, never classified', () => {
    const cell = {
      cell: 'c', pool: 'P', vid: 0, index: 0, face: 0, textSha: 'a', pieces: [],
    };
    const added = classifyCells([], [cell]);
    expect(added.added).toEqual(['c']);
    expect(added.removed).toEqual([]);
    const removed = classifyCells([cell], []);
    expect(removed.removed).toEqual(['c']);
    expect(removed.added).toEqual([]);
    for (const verdict of VERDICTS) {
      expect(removed.byClass.get(verdict).cells, `${verdict} claims nothing`).toEqual([]);
    }
  });

  test('the template reader matches a rendered sentence and refuses a neighbour', () => {
    // The identification the whole cell table rests on, driven both ways.
    expect(templateMatches('{settlement} is walled.', 'Ashford is walled.')).toBe(true);
    expect(templateMatches('{settlement} is walled.', 'Ashford is unwalled.')).toBe(false);
    expect(templateMatches('a {x} and a {y}.', 'a cart and a mule.')).toBe(true);
    // A regex metacharacter in a template is a literal, or a pool with a bracket in it would
    // match sentences it never wrote.
    expect(templateMatches('{settlement} (walled).', 'Ashford (walled).')).toBe(true);
    expect(templateMatches('{settlement} (walled).', 'Ashford xwalledx.')).toBe(false);
  });
});
