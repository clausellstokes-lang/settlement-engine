#!/usr/bin/env node
/**
 * preset-overlay.mjs — turn a birth fixture into a soak `--rules-json` overlay, WITH the
 * leak refusal that makes the overlay honest.
 *
 * usage: node preset-overlay.mjs --fixtures <birth-fixtures.json> --tree <TREE>
 *                                --outdir <DIR> [--preset <id>] [--dry]
 *
 * ⛔⛔ WHY AN OVERLAY AT ALL — THE FINDING THIS FILE EXISTS FOR.
 * `scripts/audit/whole-world-soak.mjs` HAS NO `--preset` FLAG. It is hardwired at `:298-302`:
 *
 *     const { fullRules, darkRules } = composeSoakRules({
 *       preset: SIMULATION_RULE_PRESETS.full_simulation.rules,
 *       ...
 *       overlay: RULES_OVERLAY,
 *     });
 *
 * and `composeSoakRules` is `{ ...preset, ...seasonsOverride(seasons), ...overlay }`. So the
 * ONLY seam by which a per-preset receipt can be produced is `--rules-json <path>`, whose
 * object is spread LAST and therefore overrides `full_simulation` key for key.
 *
 * ⛔ AND THE SEAM LEAKS UNLESS THE OVERLAY IS TOTAL. A key that `full_simulation` carries and
 * the overlay does NOT is left at full_simulation's value — so the "quiet_local receipt"
 * would silently carry full_simulation's setting for that key. This script therefore
 * computes `keys(full_simulation.rules) \ keys(overlay)` and REFUSES to write an overlay
 * that leaks, naming every leaked key. It never trims the leak away and proceeds.
 *
 * The overlay is the RESOLVED rules from `birth-fixtures.mjs` — the output of the REAL birth
 * path through `prepareRulesUpdate` — not `SIMULATION_RULE_PRESETS[id].rules`, which is a
 * SPARSE override table and would leak by construction on almost every key.
 *
 * ⚠ ONE PROPERTY THE OVERLAY CANNOT RESTORE. `darkRules` is derived from `fullRules`, so its
 * KEY SET is the overlay's key set. That is the intended shape (the harness's own §0 law
 * wants the dark control to carry an explicit `false` for every key the lit run declares),
 * and it is recorded here so a reader of a per-preset receipt knows the dark arm's key set
 * came from the overlay rather than from full_simulation.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

const FIXTURES = flag('fixtures');
const TREE = flag('tree');
const OUTDIR = flag('outdir');
const ONLY = flag('preset');
const DRY = has('dry');

if (!FIXTURES || !TREE || !OUTDIR) {
  console.error('usage: node preset-overlay.mjs --fixtures <birth-fixtures.json> --tree <TREE> --outdir <DIR> [--preset <id>] [--dry]');
  process.exit(2);
}
const tree = resolve(TREE);
const outdir = resolve(OUTDIR);

if (DRY) {
  console.log(JSON.stringify({
    dry: true,
    fixtures: resolve(FIXTURES),
    tree,
    outdir,
    writes: [`${outdir}/overlay.<presetId>.json`, `${outdir}/overlay-leak-report.json`],
    refusesWhen: ['keys(full_simulation.rules) \\ keys(overlay) is non-empty for any preset'],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');

let fixtures;
try {
  fixtures = JSON.parse(readFileSync(resolve(FIXTURES), 'utf8'));
} catch (error) {
  console.error(`preset-overlay: could not read the birth fixtures: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}
if (!Array.isArray(fixtures.fixtures) || !fixtures.fixtures.length) {
  console.error('preset-overlay: the fixture file carries no fixtures — REFUSING to write a vacuous overlay set.');
  process.exit(1);
}

let rules;
try {
  rules = await import(pathToFileURL(join(tree, 'src/domain/worldPulse/simulationRules.js')).href);
} catch (error) {
  console.error(`preset-overlay: could not import simulationRules.js: ${error?.stack ?? String(error)}`);
  process.exit(1);
}
const FULL = rules.SIMULATION_RULE_PRESETS.full_simulation.rules;
const fullKeys = Object.keys(FULL).sort();

mkdirSync(outdir, { recursive: true });
const report = [];
let leaked = 0;
for (const f of fixtures.fixtures) {
  if (ONLY && f.presetId !== ONLY) continue;
  const overlay = f.resolvedRules;
  const overlayKeys = new Set(Object.keys(overlay));
  const leaks = fullKeys.filter((k) => !overlayKeys.has(k));
  const row = {
    presetId: f.presetId,
    overlayKeyCount: overlayKeys.size,
    fullSimulationKeyCount: fullKeys.length,
    leakedKeys: leaks,
    leaks: leaks.length,
    // What the soak's dark control will carry, since darkRules's key set IS fullRules's.
    darkArmKeySetSource: 'the overlay (composeSoakRules derives darkRules from fullRules)',
    overlayHash: sha256(overlay),
  };
  report.push(row);
  if (leaks.length) {
    leaked += 1;
    console.error(`preset-overlay: ${f.presetId} LEAKS ${leaks.length} key(s) from full_simulation: ${leaks.join(', ')}`);
    continue;
  }
  const file = join(outdir, `overlay.${f.presetId}.json`);
  writeFileSync(file, `${JSON.stringify(overlay, null, 2)}\n`, 'utf8');
  const back = JSON.parse(readFileSync(file, 'utf8'));
  if (sha256(back) !== row.overlayHash) {
    console.error(`preset-overlay: ${file} does not read back to the hash it was written with.`);
    process.exit(1);
  }
  console.log(`  ${f.presetId.padEnd(22)} overlay keys=${overlayKeys.size} leaks=0 -> ${file}`);
}
if (!report.length) {
  console.error('preset-overlay: no preset matched — REFUSING to report a vacuous run.');
  process.exit(1);
}

const reportFile = join(outdir, 'overlay-leak-report.json');
writeFileSync(reportFile, `${JSON.stringify({
  instrument: 'lprobe/preset-overlay.mjs',
  tree,
  takenAt: new Date().toISOString(),
  fullSimulationKeys: fullKeys,
  presetsWithLeaks: leaked,
  rows: report,
}, null, 2)}\n`, 'utf8');
console.log(`preset-overlay: ${report.length} preset(s), ${leaked} with leaks -> ${reportFile}`);
process.exit(leaked ? 1 : 0);
