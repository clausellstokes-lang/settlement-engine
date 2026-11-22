#!/usr/bin/env node
/**
 * scripts/dormancy-bit-compare.mjs — THE CROSS-BUILD DORMANCY COMPARATOR, committed.
 *
 * WHY THIS IS A FILE IN THE REPOSITORY AND NOT A SCRATCHPAD SCRIPT. The estate's most
 * discovery-capable same-seed instruments have been session scratchpad scripts that die with
 * the session, and it has cost real findings: §872's declared shift was visible ONLY to the
 * informal probe — "A 39b2e42c→16ffd3ea, 27 of 600 … the golden arm green (no pinned corpus
 * carries it)". A drift that only an uncommitted script can see is a drift the next lane cannot
 * reproduce, and the lane after that cannot even name.
 *
 * WHAT IT DOES. Drives the REAL generation pipeline of a NAMED TREE with the DORMANT default
 * configuration, hashes each row through the committed dormancy oracle, and emits per-row TSV on
 * stdout plus a summary on stderr. The ritual it standardises is two invocations and one diff:
 *
 *     node scripts/dormancy-bit-compare.mjs --tree <BASE> --arm generation > base.tsv
 *     node scripts/dormancy-bit-compare.mjs --tree <TIP>  --arm generation > tip.tsv
 *     diff base.tsv tip.tsv
 *
 * ⛔ NEVER OVER `out/`, AND NEVER A SELF-COMPARISON. §713.2/§713.3 measured both failure modes:
 * a `diff -rq` over `out/` compared roughly seventy-five stale crops and zero corpus leaves, and
 * reported a clean TOTAL FALSE PASS. This script refuses an `out/` tree and refuses two identical
 * tree paths, because a comparator that can compare a thing with itself will eventually be asked
 * to, and it will answer "identical".
 *
 * ⛔ THE DISCRIMINATION FIGURE IS ASSERTED AGAINST A FROZEN FLOOR, NOT AGAINST "NONZERO".
 * A collapsed pipeline emitting two distinct hashes across six hundred rows passes "nonzero" and
 * proves nothing. The estate's own committed standard is the espionage fence's 360/360. The floor
 * comes from the tree's freeze register (`distinctFloor` on the arm's surface row); where the
 * register carries none yet, the script prints the measured figure and says plainly that it is
 * UNFLOORED, so a reader can never mistake an unfloored run for a passing one.
 *
 * ⭐ IT PRINTS ITS OWN DISCRIMINATION EVEN WHEN IT PASSES, because a total false pass that prints
 * nothing looks exactly like a real pass that prints nothing.
 *
 * ⚠ THE `soak` ARM IS DELIBERATELY UNBUILT — see ARMS below. Its corpus definition is not this
 * script's to invent.
 */

import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const REGISTER_REL = 'tests/fixtures/.golden-freeze-register.json';

/**
 * THE ARMS.
 *
 * `generation` — 600 full generations, 6 tiers × 100 seeds. The 600-row corpus is the FLOOR, not
 *   a luxury: on the real comparator a "character for character" claim once moved 1 leaf of 29,
 *   because 28 of 29 rounded identically under floating-point associativity. A smaller corpus
 *   would have shipped that drift.
 *
 * `realm` — the realm-birth bundle through composeInstantWorld, 6 realms.
 *
 * `soak` — ⛔ NOT BUILT, and the omission is the honest answer rather than a gap. Probe C's
 *   1,670-row drive lives in a session scratchpad; its corpus definition — which seeds, which
 *   ticks, which surfaces — is not recorded anywhere this script can read. Inventing one here
 *   would be MINTING a frozen corpus under the guise of building an instrument, and the corpus
 *   half of probe C is REC Q2's to rule. When Q2 lands, add the arm with the ruled definition.
 */
const ARMS = Object.freeze(['generation', 'realm', 'soak']);

const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const SEEDS_PER_TIER = 100;
const REALM_COUNT = 6;

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

function die(message, code = 2) {
  process.stderr.write(`dormancy-bit-compare: ${message}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = { tree: null, arm: 'generation', against: null };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--tree') args.tree = argv[++i];
    else if (flag === '--arm') args.arm = argv[++i];
    else if (flag === '--against') args.against = argv[++i];
    else if (flag === '--help' || flag === '-h') args.help = true;
    else die(`unknown argument ${JSON.stringify(flag)}`);
  }
  return args;
}

const USAGE = [
  'usage: node scripts/dormancy-bit-compare.mjs --tree <TREE> [--arm generation|realm] [--against <TREE>]',
  '',
  '  --tree     a checkout or `git archive` extract with resolvable node_modules',
  `  --arm      ${ARMS.join(' | ')}   (default: generation)`,
  '  --against  refuse to run if this equals --tree (the self-comparison guard)',
  '',
  'stdout: per-row TSV.  stderr: distinctHashes, corpusSha, and the floor verdict.',
].join('\n');

async function loadFromTree(tree, rel) {
  const abs = join(tree, rel);
  if (!existsSync(abs)) die(`${rel} is missing from the tree at ${tree}`);
  return import(pathToFileURL(abs).href);
}

function floorFor(tree, surface) {
  const abs = join(tree, REGISTER_REL);
  if (!existsSync(abs)) return { floor: null, why: `${REGISTER_REL} is absent from the tree` };
  const register = JSON.parse(readFileSync(abs, 'utf8'));
  const row = (register.surfaces ?? []).find((s) => s.surface === surface);
  if (!row) return { floor: null, why: `no register row named '${surface}'` };
  if (row.distinctFloor == null) {
    return { floor: null, why: `register row '${surface}' carries no distinctFloor yet` };
  }
  return { floor: row.distinctFloor, why: null };
}

async function driveGeneration(tree, oracle) {
  const { generateSettlementPipeline } = await loadFromTree(
    tree, 'src/generators/generateSettlementPipeline.js',
  );
  const rows = [];
  for (const tier of TIERS) {
    for (let i = 0; i < SEEDS_PER_TIER; i += 1) {
      const seed = `dormancy-bit-compare-${tier}-${String(i).padStart(3, '0')}`;
      let raw;
      let stable;
      try {
        const settlement = generateSettlementPipeline(
          { settType: tier, tier, culture: 'germanic' }, null, { seed },
        );
        raw = oracle.rawBitFormOf(settlement);
        stable = oracle.stableBitFormOf(settlement);
      } catch (error) {
        raw = `ERROR:${error.message}`;
        stable = `ERROR:${error.message}`;
      }
      rows.push({ key: `${tier}\t${seed}`, raw, stable });
    }
  }
  return rows;
}

async function driveRealm(tree, oracle) {
  const { composeInstantWorld } = await loadFromTree(
    tree, 'src/lib/instantWorld/composeInstantWorld.js',
  );
  // The create boundary's async prelude, loaded FROM THE SAME TREE as the
  // composer so a comparison across two trees arms each tree's own seam. The
  // composer is a BIRTH and is synchronous, so it cannot do this itself, and
  // since the living-content dial was lit the seam throws rather than degrading.
  // A tree that predates the loader has no such export; that is not an error
  // here, it is the older tree being older, so the reach is tolerant.
  try {
    const boundary = await loadFromTree(tree, 'src/domain/density/densityCreateBoundary.js');
    if (typeof boundary.loadGenerationLawPayloads === 'function') {
      await boundary.loadGenerationLawPayloads();
    }
  } catch { /* an older tree has no payload edge; its worlds are v1 by construction */ }
  const rows = [];
  for (let i = 0; i < REALM_COUNT; i += 1) {
    const seed = `dormancy-bit-compare-realm-${String(i).padStart(3, '0')}`;
    let raw;
    let stable;
    try {
      const bundle = composeInstantWorld({ seed, name: `Realm ${i}` });
      raw = oracle.rawBitFormOf(bundle);
      stable = oracle.stableBitFormOf(bundle);
    } catch (error) {
      raw = `ERROR:${error.message}`;
      stable = `ERROR:${error.message}`;
    }
    rows.push({ key: `realm\t${seed}`, raw, stable });
  }
  return rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.tree) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(args.help ? 0 : 2);
  }
  if (!ARMS.includes(args.arm)) die(`--arm must be one of ${ARMS.join(', ')}`);
  if (args.arm === 'soak') {
    die('the `soak` arm is deliberately unbuilt: probe C\'s corpus definition is not recorded'
      + ' anywhere this script can read, and inventing one would mint a frozen corpus rather'
      + ' than build an instrument. It is REC Q2\'s to rule. See this file\'s ARMS block.', 3);
  }

  const tree = resolve(args.tree);
  if (/(^|\/)out(\/|$)/.test(tree)) {
    die('refusing to run over an `out/` tree. §713.3 measured this exact false pass: a diff over'
      + ' out/ compared stale crops and zero corpus leaves and reported clean.');
  }
  if (!existsSync(tree)) die(`no such tree: ${tree}`);
  if (args.against && resolve(args.against) === tree) {
    die('refusing a SELF-COMPARISON: --tree and --against name the same path, and the answer'
      + ' would be "identical" whatever the pipeline does.');
  }

  const oracle = await loadFromTree(tree, 'tests/helpers/dormancyOracle.js');
  if (typeof oracle.rawBitFormOf !== 'function' || typeof oracle.stableBitFormOf !== 'function') {
    die('the tree\'s dormancyOracle.js has no bit arm — this tree predates TE-GOLDEN-1 charter'
      + ' arm 2, so a bit-level comparison against it is not defined.');
  }

  const rows = args.arm === 'generation'
    ? await driveGeneration(tree, oracle)
    : await driveRealm(tree, oracle);

  const lines = rows.map((r) => `${r.key}\t${r.raw}\t${r.stable}`);
  process.stdout.write(`${lines.join('\n')}\n`);

  const errors = rows.filter((r) => r.raw.startsWith('ERROR')).length;
  const distinctRaw = new Set(rows.map((r) => r.raw)).size;
  const distinctStable = new Set(rows.map((r) => r.stable)).size;
  const corpusSha = sha256(lines.join('\n'));
  const surface = args.arm === 'generation' ? 'generation-corpus-golden' : 'realm-birth-corpus-golden';
  const { floor, why } = floorFor(tree, surface);

  const summary = [
    `arm             ${args.arm}`,
    `tree            ${tree}`,
    `rows            ${rows.length}`,
    `errors          ${errors}`,
    `distinctRaw     ${distinctRaw} / ${rows.length}`,
    `distinctStable  ${distinctStable} / ${rows.length}`,
    `corpusSha       ${corpusSha}`,
  ];

  let failed = false;
  if (errors > 0) {
    summary.push(`VERDICT         RED — ${errors} rows threw. A corpus that errored hashes`
      + ' stably to a wrong constant and reads as a pass.');
    failed = true;
  } else if (floor === null) {
    summary.push(`VERDICT         UNFLOORED — ${why}. The distinct figure above is MEASURED but`
      + ' NOT ASSERTED, so this run proves the corpus ran, not that it discriminates. Record a'
      + ' distinctFloor through the signed door before treating this as a passing instrument.');
  } else if (distinctRaw < floor) {
    summary.push(`VERDICT         RED — distinctRaw ${distinctRaw} is below the frozen floor`
      + ` ${floor}. The pipeline has stopped discriminating seeds.`);
    failed = true;
  } else {
    summary.push(`VERDICT         GREEN — distinctRaw ${distinctRaw} meets the frozen floor ${floor}.`);
  }

  process.stderr.write(`${summary.join('\n')}\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((error) => die(error.stack ?? String(error), 4));
