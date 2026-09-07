#!/usr/bin/env node
/**
 * rosters.mjs — OUTPUT (e): THE STABILITY ROSTERS, measured against the DARK tree.
 *
 * usage: node rosters.mjs --tree <TREE> --out <FILE.json> [--dry]
 *
 * WHAT A "ROSTER" IS HERE. `tests/domain/simulationRulesPreset.stability.test.js` carries
 * six named cohorts of rule keys and preset ids. They are the instrument that MOVES — "a
 * declared edit, never a re-record" — on the day a lit successor preset lands, and the
 * `dramatic_campaign` block says so in as many words: the eight war sub-flags stay dark
 * "BY THIS RECORD, not by the ruling", "held honest in both directions by
 * tests/domain/simulationRulesPreset.stability.test.js, whose WAR_DEPTH_FLAGS roster is the
 * instrument that moves". So the dark-arm control the eleven declarations may quote is the
 * roster-by-preset MATRIX as it stands BEFORE the wave lights anything.
 *
 * ⛔ WHY THE ROSTERS ARE PARSED OUT OF THE TEST SOURCE RATHER THAN RETYPED HERE.
 * Retyping them would mint a second home for a live law, and the copy nobody tested would
 * drift — exactly the failure the test's own anti-drift assertions exist to catch
 * ("renaming one in the source must fail here, not silently test a ghost key"). Each roster
 * is extracted BY NAME and must match EXACTLY ONCE; a rename, a split or a deletion makes
 * this probe REFUSE rather than report a matrix over a roster that no longer exists.
 *
 * ⚠ THE ROSTERS ARE NOT IN THE FILE'S PURE REGION. Four of the six are declared INSIDE
 * `describe(` bodies, so the chair's pure-region extraction cannot reach them and a bounded
 * source parse is the honest alternative. It reads array literals of single-quoted strings
 * ONLY, and refuses anything else.
 *
 * The VALUES come from the tree's real `SIMULATION_RULE_PRESETS` and
 * `DEFAULT_SIMULATION_RULES` — never from the test.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i !== -1 && argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (n) => argv.includes(`--${n}`);

const TREE = flag('tree');
const OUT = flag('out');
const DRY = has('dry');
const REL = 'tests/domain/simulationRulesPreset.stability.test.js';

// The six cohorts, by the names the test gives them. A roster missing from this list is a
// roster this probe does not claim to cover; a name here that is missing from the file is a
// REFUSAL, because it means the instrument moved and the matrix would be measuring a ghost.
const ROSTERS = Object.freeze([
  'WAR_DEPTH_FLAGS',
  'ENGINE_WAVE_FLAGS',
  'ONE_REGEN_FLAGS',
  'LEGACY_PRESET_IDS',
  'CL0_PRESET_IDS',
  'WORLD_ALIVE_PRESET_IDS',
  'WAVE_DARK_PRESET_IDS',
]);
const FLAG_ROSTERS = new Set(['WAR_DEPTH_FLAGS', 'ENGINE_WAVE_FLAGS', 'ONE_REGEN_FLAGS']);

if (!TREE || !OUT) {
  console.error('usage: node rosters.mjs --tree <TREE> --out <FILE.json> [--dry]');
  process.exit(2);
}
const tree = resolve(TREE);
const out = resolve(OUT);

if (DRY) {
  console.log(JSON.stringify({
    dry: true, tree, out,
    reads: [join(tree, REL), join(tree, 'src/domain/worldPulse/simulationRules.js')],
    rosters: ROSTERS,
    refusesWhen: ['a roster name matches 0 or >1 times', 'an array literal holds anything but single-quoted strings'],
    writes: [out],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');

const testPath = join(tree, REL);
if (!existsSync(testPath)) {
  console.error(`rosters: ${REL} is absent from ${tree}. REFUSING.`);
  process.exit(2);
}
const src = readFileSync(testPath, 'utf8');

function extract(name) {
  const re = new RegExp(`\\bconst\\s+${name}\\s*=\\s*\\[([^\\]]*)\\]`, 'g');
  const hits = [...src.matchAll(re)];
  if (hits.length !== 1) {
    console.error(`rosters: roster ${name} matched ${hits.length} times, not exactly 1.`
      + ' The stability test has moved and this matrix would measure a ghost. REFUSING.');
    process.exit(3);
  }
  const body = hits[0][1];
  const items = [...body.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const stripped = body.replace(/'[^']*'/g, '').replace(/\/\/[^\n]*/g, '').replace(/[\s,]/g, '');
  if (stripped.length) {
    console.error(`rosters: roster ${name} holds a non-string-literal element (${JSON.stringify(stripped.slice(0, 40))}).`
      + ' This parser reads single-quoted string arrays ONLY. REFUSING rather than guessing.');
    process.exit(3);
  }
  if (!items.length) {
    console.error(`rosters: roster ${name} parsed EMPTY — a vacuous matrix would read as a pass. REFUSING.`);
    process.exit(3);
  }
  return items;
}

const rosters = Object.fromEntries(ROSTERS.map((name) => [name, extract(name)]));

let rules;
try {
  rules = await import(pathToFileURL(join(tree, 'src/domain/worldPulse/simulationRules.js')).href);
} catch (error) {
  console.error(`rosters: could not import simulationRules.js: ${error?.stack ?? String(error)}`);
  process.exit(1);
}
const { SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_RULES } = rules;
const presetIds = Object.keys(SIMULATION_RULE_PRESETS);

// THE MATRIX. For each roster flag: its DEFAULT, whether each preset's OVERRIDE TABLE names
// it, and what value it carries there. `absent` is distinct from `false` and the distinction
// is load-bearing — a key ABSENT from a preset's table is outside that preset's identity,
// while an explicit `false` is inside it (`lineageClaimEnabled` is the worked example).
const matrix = {};
for (const roster of ROSTERS) {
  if (!FLAG_ROSTERS.has(roster)) continue;
  matrix[roster] = rosters[roster].map((flagName) => {
    const row = {
      flag: flagName,
      isRealBooleanRuleKey: Object.hasOwn(DEFAULT_SIMULATION_RULES, flagName),
      defaultValue: Object.hasOwn(DEFAULT_SIMULATION_RULES, flagName) ? DEFAULT_SIMULATION_RULES[flagName] : null,
      perPreset: {},
    };
    for (const id of presetIds) {
      const table = SIMULATION_RULE_PRESETS[id].rules;
      row.perPreset[id] = Object.hasOwn(table, flagName) ? table[flagName] : 'absent';
    }
    row.litIn = presetIds.filter((id) => row.perPreset[id] === true);
    row.explicitlyDarkIn = presetIds.filter((id) => row.perPreset[id] === false);
    row.absentFrom = presetIds.filter((id) => row.perPreset[id] === 'absent');
    return row;
  });
}

const payload = {
  instrument: 'lprobe/rosters.mjs',
  output: '(e) the stability rosters, and the roster x preset matrix at the DARK tree',
  tree,
  takenAt: new Date().toISOString(),
  source: REL,
  presetIds,
  rosters,
  rosterSizes: Object.fromEntries(ROSTERS.map((r) => [r, rosters[r].length])),
  matrix,
  // The single number the eleven declarations will want to quote: how many roster flags are
  // lit ANYWHERE at the dark tree, per roster.
  litCounts: Object.fromEntries(
    Object.entries(matrix).map(([r, rows]) => [r, {
      flags: rows.length,
      litSomewhere: rows.filter((x) => x.litIn.length).length,
      darkEverywhere: rows.filter((x) => !x.litIn.length).length,
    }]),
  ),
};
payload.digest = sha256({ rosters: payload.rosters, matrix: payload.matrix });

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
const back = JSON.parse(readFileSync(out, 'utf8'));
if (back.digest !== payload.digest) {
  console.error('rosters: the written file does not read back to its own digest.');
  process.exit(1);
}
for (const [r, size] of Object.entries(back.rosterSizes)) console.log(`  ${r.padEnd(24)} ${size}`);
for (const [r, c] of Object.entries(back.litCounts)) {
  console.log(`  ${r.padEnd(24)} litSomewhere=${c.litSomewhere}/${c.flags} darkEverywhere=${c.darkEverywhere}`);
}
console.log(`rosters OK  presets=${back.presetIds.length} digest=${back.digest.slice(0, 12)} -> ${out}`);
