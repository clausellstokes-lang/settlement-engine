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
  AUDIENCES, driftRun, goldenCorpus, keyOf, manifestBytes, MANIFEST_RECORDER_FILES, poolIndex,
  recorderShas, sha256, templateMatches,
} from '../helpers/dossierManifest.js';
import { classifyCell, classifyCells, VERDICTS } from '../../scripts/prose-manifest-diff.mjs';
import { drawVariant } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_MOUNTS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { ROOT } from '../helpers/dossierCorpus.js';

/**
 * ⭐ EVERY REGISTERED MOUNT THE DRIFT CORPUS RECORDS NOTHING AT, WITH ITS REASON (the MEASURE
 * fold's M-3, cure 6). 39 of 56 with no roster is the shape a later car passes vacuously
 * through: a mount the manifest never records is a mount whose prose can move with the drift
 * arm green. The roster is EXACT — a mount that leaves the recorded set without a row here
 * reds, and a reasoned mount that starts recording reds too, because a stale reason is how a
 * roster becomes decoration.
 *
 * ⛔ THE REASONS ARE NOT ASSERTIONS OF FAITH: the arm below re-measures the ground of every
 * one of them against the committed census (the block fires on no town of the RATE grid
 * either), so the day a block starts speaking, this roster fails until someone re-states it.
 */
const MOUNTS_THE_CORPUS_DOES_NOT_REACH = Object.freeze({
  'defense.criminalStructure': 'DS-DEF-4 fires on no town of either corpus',
  'economics.tradeFlow': 'DS-ECO-3 reads `flowDrift`, which EconomicsTab derives from the OWNING'
    + ' CAMPAIGN\'s worldState; a headless corpus town belongs to no campaign, so the shipped tab'
    + ' answers null here too',
  'faith.creedStanding': 'DS-FTH-3 fires on no town of either corpus',
  'faith.nicheRow': 'DS-FTH-3 fires on no town of either corpus',
  'faith.patronSeat': 'DS-FTH-1 fires on no town of either corpus',
  'overview.populationDirection': 'DS-POP-3 fires on no town of either corpus',
  'overview.steadings': 'DS-GEN-8 fires on no town of either corpus',
  'overview.stressorLifecycle': 'DS-STR-2 fires on no town of either corpus',
  'plot_hooks.framing': 'DS-HK-1 fires on no town of either corpus',
  'power.factionLadder': 'DS-POW-3 fires on no town of either corpus',
  'relationships.network': 'DS-REL-1 fires on no town of either corpus',
  'war.dormantNote': 'DS-WAR-3 fires on no town of either corpus',
  'war.standing': 'DS-WAR-1 fires on no town of either corpus',
  'war.treaties': 'DS-WAR-2 fires on no town of either corpus',
});

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

  test('⭐⭐ THE DRIFT CORPUS CARRIES FOUR SEEDS, and the tally is derived rather than described', () => {
    // ⛔ WHY THIS ARM EXISTS (REWRITE car 8a-11, SITTING §U c-3; the fold's R-1, MEDIUM). The
    // audience-divergence pin below carried, as an inherited comment a future reader was told
    // to trust, the sentence "Every configuration of the DRIFT corpus carries the same
    // `_seed`". It is false, and it was the stated ground for routing a widening of that
    // control to a car of its own. A sentence about the corpus that nothing re-derives goes
    // stale the first time the corpus moves; this is the tally, derived from the run.
    //
    // The extra three seeds are DELIBERATE, not drift: `tests/helpers/goldenMasterCorpus.js`
    // appends the base configuration under `gm-seed-a/b/c` so that seed sensitivity is locked
    // by the golden master too.
    /** @type {Map<string, {cells: number, towns: Set<string>}>} */
    const bySeed = new Map();
    for (const cell of run.cells) {
      const town = cell.cell.split('::')[0];
      const seed = town.slice(town.lastIndexOf('|') + 1);
      if (!bySeed.has(seed)) bySeed.set(seed, { cells: 0, towns: new Set() });
      const seat = bySeed.get(seed);
      seat.cells += 1;
      seat.towns.add(town);
    }
    const tally = Object.fromEntries([...bySeed]
      .map(([seed, seat]) => [seed, { cells: seat.cells, towns: seat.towns.size }]));
    expect(tally, 'the DRIFT corpus by seed, cells and towns').toEqual({
      'golden-master-v3': { cells: 72_108, towns: 516 },
      'gm-seed-a': { cells: 394, towns: 3 },
      'gm-seed-b': { cells: 390, towns: 3 },
      'gm-seed-c': { cells: 392, towns: 3 },
    });
    // The two halves must close against the figures every other arm here reads.
    expect(Object.values(tally).reduce((n, r) => n + r.cells, 0)).toBe(run.cells.length);
    expect(Object.values(tally).reduce((n, r) => n + r.towns, 0)).toBe(run.towns);
    // AND FROM THE CORPUS ITSELF, so the tally is not a property of this run alone: the
    // configurations carry the same four seeds in the same proportions.
    const configSeeds = {};
    for (const config of goldenCorpus()) {
      const seed = String(config._seed);
      configSeeds[seed] = (configSeeds[seed] || 0) + 1;
    }
    expect(configSeeds, 'the golden master\'s own configurations, by seed').toEqual({
      'golden-master-v3': 516, 'gm-seed-a': 3, 'gm-seed-b': 3, 'gm-seed-c': 3,
    });
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
    const text = readFileSync(MANIFEST, 'utf8');
    /** @type {{_provenance: Record<string, any>, rows: Record<string, string>}} */
    const file = JSON.parse(text);
    const fixture = file.rows;
    const live = run.rows;
    const added = [...live.keys()].filter((k) => !Object.hasOwn(fixture, k)).sort();
    const removed = Object.keys(fixture).filter((k) => !live.has(k)).sort();
    const moved = [...live.keys()].filter((k) => Object.hasOwn(fixture, k) && fixture[k] !== live.get(k)).sort();
    expect(added, 'rows the corpus grew').toEqual([]);
    expect(removed, 'rows the corpus lost').toEqual([]);
    expect(moved, 'rows whose composed prose moved').toEqual([]);
    // AND THE BYTES, so a whitespace-only edit of the fixture convicts too. The provenance the
    // file carries is fed back in, so this arm compares the ROWS and the next one compares the
    // provenance against the tree — two refusals rather than one that could be satisfied by
    // editing both halves to agree with each other.
    const { rows: _rows, rowsSha: _rowsSha, ...carried } = file._provenance || {};
    expect(sha256(text), 'the fixture is exactly what this run produces')
      .toBe(sha256(manifestBytes(live, carried)));
  }, 120_000);

  test('⭐ THE PROVENANCE REFUSES A FIXTURE ITS RECORDER DID NOT WRITE', () => {
    // SITTING §P.2-29. P12 measured the gap this closes: `recordGolden` is never called for
    // this surface, so there is no write path and the fixture is updated by hand-edit today
    // with nothing refusing it. The executable form of "the tip that wrote it" is the RECORDER
    // — a git sha cannot be known by the run that is about to be committed, but the bytes of
    // the code that produced the rows can be, and they are re-read from the tree here.
    const file = JSON.parse(readFileSync(MANIFEST, 'utf8'));
    const provenance = file._provenance || {};
    expect(provenance.shift, 'the re-record is a DECLARED instrument shift').toBe('INSTRUMENT');
    expect(String(provenance.ruling), 'and it names the ruling that ordered it').toMatch(/P\.2-29/);
    expect(Object.keys(provenance.recorder || {}).sort(), 'the recorder is named file by file')
      .toEqual([...MANIFEST_RECORDER_FILES].sort());
    expect(provenance.recorder, 'a fixture whose recorder has moved since it was written is REFUSED:'
      + ' re-record with `node scripts/prose-manifest-cells.mjs --record`').toEqual(recorderShas());
    expect(provenance.rows, 'the row count it claims').toBe(run.rows.size);
    expect(provenance.rowsSha, 'and the digest of the rows alone, so a hand-edited row reds twice')
      .toBe(sha256(JSON.stringify(file.rows)));
  }, 120_000);

  test('⭐ REFUSAL 1: every recorded cell carries a REAL coordinate (index >= 0)', () => {
    // ⛔ THE FOLD'S P8. `index = audible.indexOf(chosen)` answers −1 when the identified
    // variant is not in that audience's audible pool at all, and nothing asserted otherwise:
    // 309 player cells carried `index: -1` and DM-only prose, because the recorder called the
    // economy desk at the DM face on both audiences. The base-normalisation arm agreed with
    // itself (`pieces[0].index` and `cell.index` were both −1) and `run.unresolved` counts only
    // cells that matched NO variant, so nothing in the suite could see it. SEAM car 3a pins
    // the composer's `pieces` against this table: 309 rows no composer can reproduce would
    // have been pinned as the target.
    // ⚠ `null >= 0` IS TRUE IN JAVASCRIPT, so the refusal is written on the TYPE first. An
    // unresolved cell records `index: null`, and a bare `>= 0` would wave it through — the
    // paired control below is what caught that in this very arm.
    const offCoordinate = run.cells.filter((c) => typeof c.index !== 'number' || c.index < 0)
      .map((c) => `${c.cell} drew index ${c.index} on ${c.block} :: ${c.pool}`);
    expect(offCoordinate.slice(0, 10), 'a cell whose variant is not in its own audience\'s pool')
      .toEqual([]);
    expect(offCoordinate.length, 'and none of them anywhere in the corpus').toBe(0);
    // THE PAIRED CONTROL, so the predicate cannot go vacuous if `index` stops being recorded.
    const synthetic = [{ cell: 'x', index: -1 }, { cell: 'y', index: 0 }, { cell: 'z', index: null }];
    expect(synthetic.filter((c) => typeof c.index !== 'number' || c.index < 0).map((c) => c.cell),
      'the refusal reads −1 and null alike').toEqual(['x', 'z']);
    expect(run.cells.every((c) => c.pieces[0].index === c.index),
      'and the piece carries the same coordinate the cell does').toBe(true);
  }, 120_000);

  test('⭐ REFUSAL 2: every registered MOUNT is recorded, or carries a measured reason', () => {
    // ⛔ THE FOLD'S M-3. `DOSSIER_MOUNTS` registers 56 distinct mounts and the cell table
    // reached 39 — with `economics.foodTile` returning real prose under the tab's recipe and
    // null under the manifest's, so the absence was the RECIPE's and not the corpus's. A mount
    // the manifest never records is a mount whose prose can move with the drift arm green.
    const registered = [...new Set(DOSSIER_MOUNTS.map((m) => m.mount))].sort();
    /** @type {Set<string>} */
    const recorded = new Set();
    for (const cell of run.cells) {
      for (const mount of cell.cell.split('::')[2].split('|')) recorded.add(mount);
    }
    const reasoned = Object.keys(MOUNTS_THE_CORPUS_DOES_NOT_REACH).sort();
    const absent = registered.filter((m) => !recorded.has(m));
    expect(absent, 'every mount the corpus does not reach carries a reason, and no other does')
      .toEqual(reasoned);
    expect(registered.length, 'the registry\'s distinct mounts').toBe(56);
    expect(registered.filter((m) => recorded.has(m)).length, 'and the manifest records this many')
      .toBe(42);
    // ⛔ AND THE REASONS ARE RE-MEASURED, NEVER TAKEN ON FAITH: every reasoned mount sits on a
    // block that fires on NO town of the RATE grid either, so its silence here is the world's
    // and not this recipe's. A block that starts speaking reds this arm until someone re-states
    // the row — which is exactly what should have happened to the three economy mounts.
    const census = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
    const speaking = [];
    for (const mount of reasoned) {
      const blocks = new Set(DOSSIER_MOUNTS.filter((m) => m.mount === mount).map((m) => m.blockId));
      const fires = census.rows.filter((r) => blocks.has(r.block) && r.rateBp !== null);
      if (fires.length) speaking.push(`${mount}: ${fires.length} pool(s) fire on the RATE grid`);
    }
    expect(speaking, 'a reasoned absence whose block DOES speak somewhere is a stale reason').toEqual([]);
    // The paired positive: a mount NOT on the roster really is recorded, so the roster is not
    // simply the whole registry.
    expect(recorded.has('economics.foodSecurity'), 'the economy desk speaks here').toBe(true);
    expect(recorded.has('economics.foodTile'), 'and at the mount cure 1 gave back').toBe(true);
  }, 120_000);

  test('the base-side normalisation is the one-piece unit car 3a must reproduce', () => {
    // M-F6. There is no `pieces` and no `face` in the shipped shape; the recorder synthesises
    // both, and car 3a asserts the composer's `pieces` for an EMPTY candidate list is
    // identical to this synthesis. Recorded so that assertion has something to be identical to.
    // ⛔ THE POPULATION IS THE ONE-PIECE CELLS, AND THE COMPOSED ONES ARE COUNTED APART
    // (TASTE car M-3). This arm was written when no modifier could seat anywhere, so "every
    // cell is one spine piece" and "the synthesis is well formed" were the same sentence. In
    // the taste's dock seven modifier pools fire, and a cell that GREW a piece is the ADDITIVE
    // movement the classifier is there to certify — not a defect of the normalisation. The
    // property the arm actually holds is unchanged and is asserted on both halves: whatever
    // the piece count, the SPINE piece is the cell's own pool at the cell's own coordinates.
    const composed = run.cells.filter((c) => c.pieces.length > 1);
    const odd = run.cells.filter((c) => c.face !== 0
      || c.pieces.length < 1
      || c.pieces[0].role !== 'spine'
      || c.pieces[0].key !== c.pool
      || c.pieces[0].vid !== c.vid
      || c.pieces[0].index !== c.index
      || c.pieces[0].face !== 0);
    expect(odd.map((c) => c.cell), 'every cell opens on ITS OWN spine piece at face 0').toEqual([]);
    // AND EVERY EXTRA PIECE IS A MODIFIER OF THE SAME BLOCK, seated at the sentence.
    const strays = composed.flatMap((c) => c.pieces.slice(1)
      .filter((piece) => piece.role !== 'modifier' || piece.seat !== 'sentence')
      .map(() => c.cell));
    expect(strays, 'a composed cell grows MODIFIERS and nothing else').toEqual([]);
    console.log(`\n[manifest] one-piece cells ${run.cells.length - composed.length}`
      + ` · composed cells ${composed.length} of ${run.cells.length}`
      + ` (the taste's seven modifier pools; the classifier calls every one of them ADDITIVE)\n`);
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
    const dmOnly = [];
    /** @type {string[]} */
    const playerOnly = [];
    for (const [at, seat] of byPosition) {
      if (seat.dm && !seat.player) { dmOnly.push(at); continue; }
      if (!seat.dm && seat.player) { playerOnly.push(at); continue; }
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
    //
    // ⭐ 36 POSITIONS BECAME 345 AT MEASURE CAR 3, AND THAT IS THE CURE ARRIVING, NOT A
    // REGRESSION. The recorder called the economy desk at the DM face on BOTH audiences
    // (`economyDeskRead` keys on `options.playerView`, which nothing passed), so the second
    // live mixed pool — `DS-ECO-6 :: TIER: minor shadow activity (≥3)`, 309 positions — could
    // not differ by construction. The whole non-vacuity of this control rested on ONE pool and
    // the recipe blinded the other.
    //
    // ⭐ 345 BECAME 309 AT REWRITE car 8a-1, A DECLARED CONSEQUENCE OF THE INDEX-STABLE DRAW
    // (law 6), and the cause is exactly one draw. `DS-POW-1 :: governanceFractured true` holds
    // four variants of which ONE is covert (v3). Under the shipped modulus the DM read that
    // covert variant and the player read v1, so the faces differed; under the argmax the DM's
    // winner over the four is v4, which the player can also see, so the faces agree. The
    // remaining 309 are `DS-ECO-6 :: TIER: minor shadow activity (≥3)`, whose three covert
    // variants leave the player exactly one eligible line, so its faces differ by
    // construction and no draw rule can make them agree.
    //
    // ⚠ AND THE THING A READER OF THIS PIN MUST KNOW: 345, 309 and 36 ARE NOT THAT MANY
    // INDEPENDENT FACTS. **516 of the 525 configurations share `golden-master-v3`; nine carry
    // one of `gm-seed-a`, `gm-seed-b` and `gm-seed-c`** (three towns each, deliberately —
    // `tests/helpers/goldenMasterCorpus.js:116-121`, "a few extra seeds on the base config").
    // The draw key is `${seed}::${blockId}::${poolKey}`, so across the 516 that share a seed a
    // pool has ONE drawn variant however many towns read it, and a per-pool count over them is
    // a town count wearing a draw's clothes. The 36 DS-POW-1 positions were one coin landing
    // one way and are now one coin landing the other. So this control's breadth — "over this
    // many of the twelve mixed pools" — is re-rolled by ANY change to the draw, and it fell
    // from two pools to one here without anything about the audience filter moving at all.
    //
    // ⛔ THE SENTENCE THIS REPLACES WAS FALSE, AND IT WAS LOAD-BEARING (REWRITE car 8a-11,
    // SITTING §U c-3; the fold's R-1 and NEW-5). It read "Every configuration of the DRIFT
    // corpus carries the same `_seed`" and concluded that widening this control "needs the
    // recorder's `--seeds` family rather than DRIFT, which is a car of its own" — under the
    // words "recorded here so the next reader inherits the finding instead of re-deriving it",
    // which is what made an error load-bearing. DRIFT already carries a small seed family, so
    // no new recorder mode is owed; ADDENDUM 1 ruling 8's routing of that widening to a
    // CAPACITY-train car is WITHDRAWN. The tally is a driven arm below, not a sentence.
    expect(differ.length, 'positions where the two faces draw differently').toBe(309);
    expect(new Set(differ.map((row) => `${row.dm.block} :: ${row.dm.pool}`)).size,
      'over this many of the twelve mixed pools').toBe(1);
    // ⛔ REFUSAL 3: THE ONE-SIDED POSITIONS, WITH THEIR DIRECTION (the fold's P9). The leak
    // check above runs only over positions present on BOTH faces, so a position that exists on
    // one face alone was skipped and merely printed. The two directions are not the same fact:
    // a rung the DM sees and the player does not is the audience filter emptying a pool, which
    // is lawful; a rung the PLAYER sees and the DM does not is prose reaching the narrower
    // audience only, which is a leak in the other direction and has no lawful reading.
    expect(playerOnly, 'a position on the PLAYER face only, which no audience filter can produce')
      .toEqual([]);
    expect(dmOnly.length, 'positions the DM sees and the player does not, pinned as lawful').toBe(36);
    // The paired control on the direction split itself, so it cannot go vacuous.
    const synthetic = new Map([['a', { dm: {} }], ['b', { player: {} }], ['c', { dm: {}, player: {} }]]);
    expect([...synthetic].filter(([, seat]) => seat.player && !seat.dm).map(([at]) => at),
      'the reader tells a player-only position from a DM-only one').toEqual(['b']);
    process.stdout.write(`[dossier-prose-manifest] audience-divergent positions ${differ.length}`
      + ` of ${byPosition.size} · DM-only positions ${dmOnly.length} · player-only ${playerOnly.length}\n`);
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
    // ⭐ ADDITIVE ON A REAL ADDITION — the fixture rebuilt at MEASURE car 3 (the fold's M-2).
    // The old fixture HELD `textSha` across a piece addition, and passed only because the
    // classifier required that; a modifier beside a spine adds WORDS, so a cell that gained a
    // piece and kept its text is a state the cell table cannot produce. Driven on the shape a
    // real addition has: the spine holds, the pieces grow, the rendered text moves.
    expect(classifyCell(base, {
      ...base,
      textSha: 'bbbb',
      pieces: [...spine(1, 1), { role: 'modifier', key: 'M', vid: 0, index: 0, face: 0 }],
    }), 'a piece added beside an unchanged spine, and the words it added').toBe('ADDITIVE');
    // AND THE TWO NEGATIVES THAT KEEP IT FROM SWALLOWING ITS NEIGHBOURS: a piece added beside a
    // spine that MOVED is a re-index, and a text that moved with no piece added is wording.
    expect(classifyCell(base, {
      ...base,
      vid: 2,
      textSha: 'bbbb',
      pieces: [...spine(2, 1), { role: 'modifier', key: 'M', vid: 0, index: 0, face: 0 }],
    }), 'the spine moved, so the addition is not what happened').toBe('RE-INDEXED');
    expect(VERDICTS.indexOf('ADDITIVE') < VERDICTS.indexOf('WORDING-ONLY'),
      'ADDITIVE is tested before WORDING-ONLY, or every addition would read as wording').toBe(true);
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
