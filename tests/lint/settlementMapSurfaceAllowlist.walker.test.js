/**
 * settlementMapSurfaceAllowlist.walker.test.js — THE TERMINAL CENSUS of the legacy
 * settlement-map strip (DESIGN_MAP_MODULE_SPLIT §11.4, ODQ §725/§772).
 *
 * WHAT THE STRIP PROMISED. Six waves removed the legacy settlement map: its UI, its PDF and
 * export chain, its style-overhaul surface, its presentation stack, its emitters and its
 * frozen art. The promise is not "those files are gone" — a `git log` proves that and proves
 * nothing about tomorrow. The promise is that settlement-map vocabulary may only survive
 * inside the surfaces the rulings RETAINED, and that a new one cannot appear unnoticed.
 * This walker is that promise, held structurally.
 *
 * ⛔⛔ AN ALLOWLIST, NEVER AN EXACT WORD-SET — AND §11.4 SAYS SO FOR A REASON THAT WILL
 * OTHERWISE BITE. The obvious instrument is "these N occurrences and no others", frozen. It
 * would be wrong here: the REALM/WORLD map stays, it is a different surface that legitimately
 * speaks map words, and the WEAVE program adds realm-surface code BY DESIGN. An exact word-set
 * would red on that honest work, get widened once under deadline, and then be a number nobody
 * trusts. So the frozen thing is WHERE the vocabulary may live, not HOW MUCH of it there is.
 * Adding a hit inside a retained surface is free; adding a NEW SURFACE reds, which is exactly
 * the review this census exists to force.
 *
 * FOUR ARMS, because an allowlist rots in four directions and each is invisible to the others:
 *   1. TOTALITY      — a matching file outside every row REDS. The census proper.
 *   2. ROWS EXIST    — a row naming a path that no longer exists REDS. An allowlist that
 *                      outlives its subject silently widens: the row stops excusing anything
 *                      real and starts standing ready to excuse whatever lands there next.
 *   3. ROWS ARE EARNED — a row covering ZERO matching files REDS. This is the arm that keeps
 *                      the list shrinking as the estate does, and it is the one that catches
 *                      the "we kept the exemption just in case" drift.
 *   4. NOT VACUOUS   — the corpus is real, the vocabulary is not degenerate, and a known
 *                      anchor still matches. Without this the three arms above all pass
 *                      perfectly against a scan that walked nothing.
 *
 * TO COMPLY when arm 1 reds: the new file either belongs to a RETAINED surface — add a row
 * saying which ruling retains it — or it is settlement-map code coming back, which is an
 * owner-gated decision (§725 ruled the capability out; the map module is a separate repo whose
 * OUTPUT this product consumes, never its code).
 *
 * WHY tests/ IS NOT SCANNED: the test roster is governed by `test:ratchet` and the retained-set
 * list in docs/recon/R-STRIP4-CENSUS.md §F, which are stronger instruments than a word grep —
 * they count what runs. A test file naming a retired surface in a tombstone is correct history,
 * and scanning tests/ here would fight the §769.4 tombstone law rather than serve it.
 *
 * E-A: its removing power is proven by scripts/mutation-sweep.sh (label
 * "map-surface/vocabulary outside the allowlist").
 *
 * @enforced-by this file
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * THE SETTLEMENT-MAP API VOCABULARY. Deliberately the module/identifier spellings the strip
 * removed — NOT the bare word "map", which the realm surface, the world map, the sitemap, a
 * JS `.map()` and the Cartographer tier all speak legitimately. A regex that matched "map"
 * would report hundreds of true negatives and be switched off within a week.
 */
const VOCABULARY = /(townmap|towncartograph|town-map|buildtownmap|townpanorama|settlementmap|mapedits)/i;

/** Trees the census walks. */
const ROOTS = ['src', 'scripts', 'api', 'public', 'supabase', 'e2e', 'package.json'];

/** Directories never worth walking (build output, vendored fork, binary art). */
const SKIP_DIR = new Set(['node_modules', 'dist', '.git', 'coverage']);
/** Extensions that cannot carry source vocabulary meaningfully. */
const BINARY = /\.(png|jpg|jpeg|gif|webp|avif|mp4|webm|woff2?|ttf|otf|ico|pdf|glb|zip)$/i;

/**
 * ⛔ THE ALLOWLIST — fifteen SURFACES, each naming the ruling that retains it and the paths
 * it covers. A path is a directory prefix or an exact file. Order is irrelevant; overlap is fine.
 * ⚠ It was FOURTEEN at its founding, and not the fifteen that census drafted, because the
 * ROWS-ARE-EARNED arm below convicted this list on its first run: four drafted paths — the
 * vendored realm fork, the realm export, the world-map e2e journey and the frozen plate
 * directory — carry NONE of this vocabulary, so listing them was headroom rather than
 * permission. The instrument audited its own author before it audited the estate, which is the
 * behaviour it exists to have.
 * ⭐ FIFTEENTH ADDED 2026-08-31 (lane T11 landing, ODQ §815): the ruling-chain read-model, ONE
 * FILE and not its directory. It is the first row this census earned by REDDING rather than by
 * being drafted — arm 1 caught §815 pushing the retained ladder read down out of an
 * already-excused component into a read-model directory no ruling had reviewed, which is
 * precisely the review this instrument exists to force. The row itself carries the reasoning
 * and the rejected wider draft.
 * ⭐ ONE PATH STRUCK 2026-09-16 (the COMPENDIUM TRIM, owner order: the map lenses and interior
 * pages removed from the Compendium): `src/domain/compendium/` left the derived-readers row
 * because ROWS ARE EARNED convicted it. Its only hit was the generated compendium artifact's
 * source-of-truth header naming `townMapStyles`, and that registry is no longer a Compendium
 * input now the Map Lenses block is gone. No surface was added and none was widened.
 */
const ALLOWLIST = Object.freeze([
  {
    surface: 'the retained headless town substrate',
    at: ['src/domain/townMap/'],
    why: 'J-STRIP-1 / R-STRIP4 §A: model, layout law, site genesis, anchors, glyph assignment, massing, the ladder/fabric readers and the persisted map-edits container — plus the chartered-dark arch kernel under arch/ (ODQ §748.3), which is a building-grammar kernel that merely lives here.',
  },
  {
    surface: 'the cartography scene substrate',
    at: ['src/domain/townCartography/'],
    why: 'ODQ §748.3 ARM B: eleven of its files are runtime-load-bearing for the retained town-scene compiler, which is why the strip took only the orphaned paint adapters.',
  },
  {
    surface: 'the town-scene compiler and its transport',
    at: ['src/domain/townScene/', 'src/lib/townScene/', 'src/workers/townScene.worker.js'],
    why: 'Q6′ retains the 3D scene manifest compiler whole: the derivation, its lib-side quality/cache/export helpers, and the worker that carries a compile off the main thread.',
  },
  {
    surface: 'the interior renderer',
    at: ['src/domain/interior/', 'src/components/interior/'],
    why: 'A retained product surface that reads the town substrate (footprint, anchors, edits) and shares the lens registry — the reason that registry could not leave with the settlement map.',
  },
  {
    surface: 'the canonize seam and the spatial substrate',
    at: ['src/lib/spatialSubstrateDerive.js', 'src/domain/spatial/', 'src/lib/spatialUsage.js'],
    why: 'S1: the ONE place a settlement is canonized into the substrate, plus the readers and the adoption ledger over it. Map words here are the substrate’s own vocabulary, not a renderer’s.',
  },
  {
    surface: 'the world-pulse kernels',
    at: ['src/domain/worldPulse/', 'src/domain/advanceEpochLedger.js', 'src/domain/rulingPowerCoup.js', 'src/domain/traditions/genesis.js'],
    why: 'S2: engine kernels read the retained ladder and urban-fabric readers, and the epoch ledger sits deliberately above the directories that stream from it.',
  },
  {
    surface: 'the ruling-chain read-model (ONE FILE, deliberately not the directory)',
    at: ['src/domain/dossier/powerStrata.js'],
    why: 'ODQ §815 (2026-08-31, lane T11): the Power tab\'s "Who runs this place?" chain resolves its named ruler through the RETAINED headless ladder reader — the same `src/domain/townMap/ladderRead.js` the first row of this list retains by name ("the ladder/fabric readers"), and the same import already made by src/components/new/tabs/PowerTab.jsx, src/domain/rulingPowerCoup.js, and worldPulse\'s roads and traditions kernels. ⭐ THE CENSUS CAUGHT A REAL MOVE AND THAT IS WHY THIS ROW IS NARROW: §815 pushed the ladder resolution DOWN out of the component (already excused by the broad `src/components/` row) into the read-model, which is architecturally right — a derivation belongs in a read-model, not a renderer — and which moved the vocabulary into a directory no ruling had yet reviewed. ⛔ NOT A RETURNING CAPABILITY, and the distinction is the one §725 draws: this file renders nothing, imports no renderer, emits no plate and consumes no map OUTPUT; it reads one rung\'s standing off a retained headless substrate to answer "who holds the seat". A row for the whole `src/domain/dossier/` directory was drafted and REJECTED as headroom — the dossier tree has exactly one file speaking this vocabulary, and naming the file keeps the next one red. Vetoable at the chair\'s desk.',
  },
  {
    surface: 'the realm / world map — a different surface entirely',
    at: ['src/components/map/', 'src/domain/realmMap/', 'src/store/mapSlice.js'],
    why: 'Q9: the realm map is the FMG fork and the product’s surviving map surface. It STAYS, it legitimately speaks map words, and the WEAVE program adds more of them by design — the single biggest reason §11.4 forbids an exact word-set here. ⭐ MEASURED, and it is the happier finding: the fork itself (public/map/), the realm export and the world-map e2e journey speak NONE of this vocabulary, so they are not listed — the realm surface was never entangled with the settlement one in the first place, and an allowlist row for them would be pure headroom.',
  },
  // ⭐ NO ROW FOR public/landing-maps/. It was in the first draft of this list, and the
  // ROWS-ARE-EARNED arm removed it: what survives there is the realm previews and the six
  // arch-kernel exhibit directories (pinned by tests/architecture/archViewWall.test.js), and
  // none of them speaks settlement-map vocabulary. The eighty settlement plates left in the
  // first strip wave. A row here would excuse nothing and stand ready to excuse a returning plate.
  {
    surface: 'the shared draw-op serializer and its download helper',
    at: ['src/domain/drawOpsSvg.js', 'src/lib/downloadBlob.js'],
    why: 'Both were PRE-SEVERED out of the settlement-map stack precisely so its removal could not break the realm plate renderer and the town-scene export (ODQ §725/§748). Their headers record that; the vocabulary is the record.',
  },
  {
    surface: 'the design token and lens registry',
    at: ['src/design/'],
    why: 'The lens definitions, the export palette and the one fixed light. ⚠ Its consumer set CHANGED under ODQ §725/§772 — the live readers are the interior and realm renderers, the draw-op SVG adapter and the persisted-shape wall, NOT a settlement-map renderer (the compendium generator stopped reading it when the Map Lenses page left the Compendium, 2026-09-16).',
  },
  {
    surface: 'retained persistence and its retirement tombstones',
    at: ['src/store/'],
    why: 'The map-edits verbs the settlement blob still carries, the operation registry’s retirement records, and the campaign/settlement readers that must go on understanding a blob written before the strip.',
  },
  {
    surface: 'retained product UI',
    at: ['src/components/'],
    why: 'The four dynamic map-edits importers at the settlement-create boundary, the dossier and gallery surfaces, and the realm map components. ⚠ THIS ROW IS BROAD BY NECESSITY and is the one to narrow first if this census is tightened: the UI tree is where a returning settlement-map surface would most plausibly land.',
  },
  {
    surface: 'derived, generated and observational readers',
    at: ['src/domain/certification/', 'src/domain/content/', 'src/domain/display/', 'src/domain/highWater.js', 'src/generators/steps/assembleInstitutions.js', 'src/lib/analyticsEvents.js', 'src/lib/mapLayerAnalytics.js', 'src/lib/surveyorWrite.js', 'src/config/entitlementLadder.js', 'src/copy/en.js'],
    why: 'Read-models, generated artifacts, the paid ladder and product copy. Most of the vocabulary here is TOMBSTONE — a record of what the strip removed, which §769.4 requires be phrased as an act rather than a token. Two rows in this group carry open questions and are named in the lane receipt rather than hidden here: the map-layer analytics module is now import-orphaned (its capture surface died), and one save-blob path predicate is a reader whose writer cannot be shown to exist.',
  },
  {
    surface: 'the closure ASSERTIONS that name what they must never import',
    at: ['src/domain/undercity/'],
    why: '§441.5(d): each of these six files states "never imports townMap" as a LAW ABOUT ITSELF. They are the one place where deleting the vocabulary would delete the guarantee — the mention IS the assertion.',
  },
  {
    surface: 'governed instruments, generators and edge bundles',
    at: ['scripts/', 'supabase/functions/_shared/'],
    why: 'The observed-shape inventory, the E-A sweep and its manifest, the hazard registry, the compendium and realm-preview generators, the arch-kernel emitters, the FMG realm-fork validator, and the edge bundles that embed whatever the shared modules export. These speak whatever the tree speaks by construction.',
  },
]);

/**
 * ⚰ THE DEFERRED ORPHANS, named in their OWN list rather than folded into a surface row, so
 * they are VISIBLE in the census and vanish from it the day they are deleted. Both carry a row
 * in the governed observed-shape inventory, whose walker asserts every row names a file that
 * EXISTS — so deleting either reds a retained guard, and the only lawful shrink is that
 * instrument's governed re-freeze. That re-freeze REFUSES at this tree, and measurably not
 * because of this train: its detector tree had already drifted on an unrelated fixture before
 * this work began. They leave with that mint.
 */
const DEFERRED = Object.freeze([
  {
    surface: 'the edge-annotation leaf',
    at: ['src/components/townMap/edgeAnnotations.js'],
    why: 'ODQ §772 / R-STRIP6 §D2 — the sole survivor of the first strip wave, restored deliberately, blocked on the observed-shape instrument migration and NOT on any strip wave.',
  },
  {
    surface: 'the persisted fog-session reader',
    at: ['src/domain/townMap/fogSessions.js'],
    why: 'ODQ §772 — the same instrument and the same reason. Its reveal-GEOMETRY sibling carried no inventory row and left with the draw stack; this is the container a save blob written before the retirement can still carry.',
  },
]);

/** @returns {string[]} every scanned repo-relative path */
function walk(rel, out = []) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return out;
  if (!statSync(abs).isDirectory()) { out.push(rel); return out; }
  for (const entry of readdirSync(abs)) {
    if (SKIP_DIR.has(entry)) continue;
    walk(join(rel, entry), out);
  }
  return out;
}

const SCANNED = ROOTS.flatMap((r) => walk(r)).filter((p) => !BINARY.test(p)).sort();

/** Files whose CONTENT carries the vocabulary. */
const MATCHING = SCANNED.filter((p) => {
  try {
    return VOCABULARY.test(readFileSync(join(ROOT, p), 'utf8'));
  } catch {
    return false;
  }
});

const covers = (row, file) => row.at.some((at) => (at.endsWith('/') ? file.startsWith(at) : file === at));
const ROWS = [...ALLOWLIST, ...DEFERRED];

describe('settlement-map surface census (the terminal allowlist, §11.4)', () => {
  test('NOT VACUOUS: the corpus is real, the vocabulary is not degenerate, and it still matches', () => {
    // Without this arm every other arm passes perfectly against a scan that walked nothing.
    expect(SCANNED.length, 'the walk found almost no files — a root moved or SKIP_DIR widened')
      .toBeGreaterThan(1000);
    expect(MATCHING.length, 'nothing matches the vocabulary at all — the regex or the walk broke')
      .toBeGreaterThan(20);
    // The vocabulary must not have been widened to the bare word "map" (which would make the
    // census unusable and force it to be switched off) or narrowed to nothing.
    expect(VOCABULARY.test('map'), 'the vocabulary degenerated to the bare word "map"').toBe(false);
    expect(VOCABULARY.test('buildTownMapModel'), 'the vocabulary stopped matching the API it governs').toBe(true);
    // A known-present anchor: the retained substrate speaks it.
    expect(MATCHING).toContain('src/domain/townMap/townMapModel.js');
  });

  test('TOTALITY: no settlement-map vocabulary survives outside the allowlist', () => {
    const stray = MATCHING.filter((f) => !ROWS.some((row) => covers(row, f)));
    expect(
      stray,
      '\nSettlement-map vocabulary appeared OUTSIDE every retained surface. Either this file belongs'
      + ' to a surface a ruling retains — add a row naming that ruling — or the settlement-map'
      + ' capability is coming back, which ODQ §725 ruled out and which is an OWNER decision, not a'
      + ' lane’s (the map is a separate module whose OUTPUT this product consumes, never its code):\n'
      + `${stray.join('\n')}\n`,
    ).toEqual([]);
  });

  test('ROWS EXIST: every allowlist row still names a real path at this tip', () => {
    // A row whose subject is gone excuses nothing real and stands ready to excuse whatever
    // lands there next — a silent widening that no other arm can see.
    const missing = ROWS.flatMap((row) => row.at).filter((at) => !existsSync(join(ROOT, at)));
    expect(missing, `allowlist rows naming paths that no longer exist — delete them:\n${missing.join('\n')}`)
      .toEqual([]);
  });

  test('ROWS ARE EARNED: every allowlist row covers at least one matching file', () => {
    // The arm that makes the list SHRINK as the estate does. A row covering nothing is
    // exemption held "just in case", which is how an allowlist becomes a rubber stamp.
    const unearned = ROWS.flatMap((row) => row.at)
      .filter((at) => !MATCHING.some((f) => (at.endsWith('/') ? f.startsWith(at) : f === at)));
    expect(
      unearned,
      '\nAllowlist row(s) covering ZERO matching files. The surface they excuse no longer speaks the'
      + ' vocabulary, so the row is now pure headroom — DELETE it (and, if it is a DEFERRED row,'
      + ' record that the deferral discharged):\n'
      + `${unearned.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the deferred rows are DEFERRALS, not exemptions: each names its blocker', () => {
    // A deferral with no stated blocker is an exemption wearing a nicer word.
    for (const row of DEFERRED) {
      expect(row.why, `${row.surface} must name what it waits on`).toMatch(/§\d+/);
      expect(row.why.length).toBeGreaterThan(40);
    }
    // And every row, deferred or not, cites a ruling — an uncited retention is unreviewable.
    for (const row of ALLOWLIST) {
      expect(row.why.length, `${row.surface} needs a real reason, not a label`).toBeGreaterThan(40);
      expect(row.at.length, `${row.surface} must name at least one path`).toBeGreaterThan(0);
    }
  });
});
