#!/usr/bin/env node
/**
 * preset-seam.mjs — IS A `--preset P` SOAK A REAL BIRTH OF P? The check that decides
 * whether a per-preset certification receipt may be produced at all.
 *
 * usage: node preset-seam.mjs --fixtures <birth-fixtures.json> --tree <TREE>
 *                             --out <DIR> [--preset <id>] [--seasons preset|on|off] [--dry]
 *
 * ── WHY THIS FILE REPLACED `preset-overlay.mjs` (L-OVERLAY, 2026-09-05) ────────────────
 * `preset-overlay.mjs` was written against a `whole-world-soak.mjs` that had NO `--preset`:
 * the only seam to another preset was `--rules-json`, an OVERLAY spread ON TOP of
 * `full_simulation`, so every full_simulation opt-in key the target preset did not name
 * stayed LIT. That instrument's job was to measure the resulting leak and REFUSE. It did,
 * correctly: 6 of 7 presets leaked 14-34 keys.
 *
 * DOCKET item 7 (§899, car `2200db6f3`) then gave the soak a real `--preset <id>` that
 * REPLACES the composition base. The leak the old instrument measured is a property of a
 * seam that no longer has to be used. So the honest question changed shape, from
 *
 *     "is this overlay TOTAL over full_simulation?"        (the old seam's failure mode)
 * to
 *     "does the soak's composed world EQUAL the real birth?" (the new seam's own question)
 *
 * and that is what this file asks — in BOTH directions, on keys AND values AND key order.
 *
 * ── ⛔⛔ THE REASON THE NEW SEAM PASSES, WHICH IS NOT THE REASON THE CHAIR EXPECTED ────
 * `composeSoakRules` does NOT normalize. It is `{ ...preset, ...seasonsOverride, ...overlay }`,
 * so a `--preset P` soak carries `SIMULATION_RULE_PRESETS[P].rules` VERBATIM, while a real
 * birth carries `prepareRulesUpdate` -> `normalizeSimulationRules(...)` of that same table.
 * Those agree today for one measured reason and one only:
 *
 *   ⭐ `normalizeSimulationRules` IS A FIXED POINT ON EVERY SHIPPED PRESET TABLE.
 *      `preset(id, label, overrides)` builds `rules` as
 *      `{ ...DEFAULT_SIMULATION_RULES, presetId: id, ...overrides }` (simulationRules.js:501),
 *      so the table is ALREADY TOTAL over the 36 default keys — it is NOT the sparse override
 *      table this kit's older headers call it — and no shipped override needs a coercion or
 *      trips a mirror-key lockstep. Measured at 38474a59e: norm(table) === table, byte for
 *      byte, for all seven.
 *
 *   ⚠ THAT IS A MEASURED COINCIDENCE, NOT A GUARANTEE, AND IT IS EXACTLY WHAT THIS FILE
 *      GUARDS. The day a preset override needs the normalizer — a non-boolean coerced, a
 *      faithSpread/religionDynamics mirror key set on one side, a PROFILE_KEYS materialize
 *      branch that adds a key — `composeSoakRules` will NOT apply it and the soak will
 *      certify a world no birth produces. This check fails LOUD on that day.
 *
 * ── WHAT IT REFUSES ───────────────────────────────────────────────────────────────────
 * A preset whose composed rules differ from its real birth by one key or one value gets NO
 * receipt: the roster `certify.sh` iterates is the roster this file passes, so a preset that
 * fails the seam cannot be certified by accident. It never trims a difference away and
 * proceeds, and it never pads either side.
 *
 * ⛔ IT WRITES NOTHING INTO THE TREE and it does not run a soak. It calls the soak's OWN
 * pure composer (`scripts/audit/soakRules.mjs`), which is the same function
 * `whole-world-soak.mjs:326` calls, so this is the soak's composition and not a re-statement
 * of it. The end-to-end tie is `certify.sh`'s post-soak assertion, which reads the receipt's
 * `subsystems.stateKeys.simulationRules.finalEntries` and `subsystems.presetId` back out of
 * the world the soak actually ran.
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
const OUTDIR = flag('out');
const ONLY = flag('preset');
const SEASONS = flag('seasons', 'preset');
const DRY = has('dry');

if (!FIXTURES || !TREE || !OUTDIR) {
  console.error('usage: node preset-seam.mjs --fixtures <birth-fixtures.json> --tree <TREE> --out <DIR> [--preset <id>] [--seasons preset|on|off] [--dry]');
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
    seasons: SEASONS,
    writes: [`${outdir}/preset-seam-report.json`, `${outdir}/seam-ok.<presetId>`],
    compares: [
      'composeSoakRules({ preset: SIMULATION_RULE_PRESETS[P].rules, seasons, overlay: {} }).fullRules',
      'vs the REAL-birth resolved rules for P from the fixture file',
    ],
    refusesWhen: [
      'a key is present on one side and absent on the other (EITHER direction)',
      'a shared key carries a different value',
      'the key ORDER differs (the world state is serialized; order is part of the hash)',
      'normalizeSimulationRules is not a fixed point on the preset table',
      'the fixture file carries no fixtures, or no fixture matches --preset',
    ],
  }, null, 2));
  process.exit(0);
}

const sha256 = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');

let fixtures;
try {
  fixtures = JSON.parse(readFileSync(resolve(FIXTURES), 'utf8'));
} catch (error) {
  console.error(`preset-seam: could not read the birth fixtures: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}
if (!Array.isArray(fixtures.fixtures) || !fixtures.fixtures.length) {
  console.error('preset-seam: the fixture file carries no fixtures — REFUSING to report a vacuous seam.');
  process.exit(1);
}

// ⛔ TWO FIXTURE SHAPES EXIST AND NEITHER IS GUESSED AT. `lprobe/birth-fixtures.mjs` writes
// `resolvedRules` (born through prepareRulesUpdate); `lh1/birth-fixture-p1.mjs` writes
// `world.simulationRules` (born through createNewCampaignWorldState). The two were
// cross-checked identical for all seven presets (receipt-lgt-p1-birth.md §9). A fixture row
// carrying NEITHER is an error, never a skip — the shape used is recorded per row.
const birthOf = (f) => {
  if (f.resolvedRules && typeof f.resolvedRules === 'object') {
    return { rules: f.resolvedRules, shape: 'resolvedRules' };
  }
  if (f.world && f.world.simulationRules && typeof f.world.simulationRules === 'object') {
    return { rules: f.world.simulationRules, shape: 'world.simulationRules' };
  }
  return null;
};

let rulesModule;
let soakModule;
try {
  rulesModule = await import(pathToFileURL(join(tree, 'src/domain/worldPulse/simulationRules.js')).href);
  soakModule = await import(pathToFileURL(join(tree, 'scripts/audit/soakRules.mjs')).href);
} catch (error) {
  console.error(`preset-seam: could not import the tree's modules: ${error?.stack ?? String(error)}`);
  process.exit(1);
}
const { SIMULATION_RULE_PRESETS, normalizeSimulationRules } = rulesModule;
const { composeSoakRules } = soakModule;

mkdirSync(outdir, { recursive: true });

const rows = [];
let refused = 0;
for (const f of fixtures.fixtures) {
  if (ONLY && f.presetId !== ONLY) continue;
  const birth = birthOf(f);
  if (!birth) {
    console.error(`preset-seam: fixture row ${f.presetId} carries neither resolvedRules nor world.simulationRules — REFUSING.`);
    refused += 1;
    rows.push({ presetId: f.presetId, seamHolds: false, reason: 'fixture row carries no birth rules' });
    continue;
  }
  const entry = SIMULATION_RULE_PRESETS[f.presetId];
  if (!entry || !entry.rules) {
    console.error(`preset-seam: ${f.presetId} is in the fixture but not in this tree's SIMULATION_RULE_PRESETS — REFUSING.`);
    refused += 1;
    rows.push({ presetId: f.presetId, seamHolds: false, reason: 'preset absent from the tree registry' });
    continue;
  }
  const table = entry.rules;

  // EXACTLY whole-world-soak.mjs:326-330 with neither --rules-json nor --lighting, which is
  // how certify.sh invokes it. `--preset` and `--rules-json` are mutually REFUSED upstream
  // (soakInvocationRefusals), so an empty overlay is the only lawful shape here.
  const { fullRules: soak, darkRules } = composeSoakRules({ preset: table, seasons: SEASONS, overlay: {} });

  const soakKeys = Object.keys(soak);
  const birthKeys = Object.keys(birth.rules);
  const soakSet = new Set(soakKeys);
  const birthSet = new Set(birthKeys);
  const inSoakNotBirth = soakKeys.filter((k) => !birthSet.has(k)).sort();
  const inBirthNotSoak = birthKeys.filter((k) => !soakSet.has(k)).sort();
  const valueDiffs = soakKeys
    .filter((k) => birthSet.has(k) && JSON.stringify(soak[k]) !== JSON.stringify(birth.rules[k]))
    .map((k) => ({ key: k, soak: soak[k], birth: birth.rules[k] }));
  const keyOrderIdentical = JSON.stringify(soakKeys) === JSON.stringify(birthKeys);
  const jsonIdentical = JSON.stringify(soak) === JSON.stringify(birth.rules);

  // THE REASON, measured rather than assumed (see the header): the seam holds only while
  // the normalizer is a fixed point on the table `composeSoakRules` spreads verbatim.
  const normalized = normalizeSimulationRules(table);
  const normalizerIsFixedPoint = JSON.stringify(normalized) === JSON.stringify(table);

  const seamHolds = inSoakNotBirth.length === 0
    && inBirthNotSoak.length === 0
    && valueDiffs.length === 0
    && keyOrderIdentical
    && jsonIdentical
    && normalizerIsFixedPoint;

  rows.push({
    presetId: f.presetId,
    seamHolds,
    birthFixtureShape: birth.shape,
    soakKeyCount: soakKeys.length,
    birthKeyCount: birthKeys.length,
    presetTableKeyCount: Object.keys(table).length,
    normalizedTableKeyCount: Object.keys(normalized).length,
    normalizerIsFixedPoint,
    keyOrderIdentical,
    jsonIdentical,
    inSoakNotBirth,
    inBirthNotSoak,
    valueDiffs,
    // Recorded so a reader of a per-preset receipt knows what the dark arm's key set is:
    // composeSoakRules derives darkRules FROM fullRules, so it is the preset's own key set.
    darkArmKeyCount: Object.keys(darkRules).length,
    soakRulesSha256: sha256(soak),
    birthRulesSha256: sha256(birth.rules),
  });

  if (!seamHolds) {
    refused += 1;
    console.error(`preset-seam: ${f.presetId} — THE SEAM DOES NOT HOLD. A --preset soak of it is NOT a birth of it.`);
    if (inSoakNotBirth.length) console.error(`    keys the SOAK carries and the BIRTH does not (${inSoakNotBirth.length}): ${inSoakNotBirth.join(', ')}`);
    if (inBirthNotSoak.length) console.error(`    keys the BIRTH carries and the SOAK does not (${inBirthNotSoak.length}): ${inBirthNotSoak.join(', ')}`);
    for (const d of valueDiffs) console.error(`    value differs on ${d.key}: soak=${JSON.stringify(d.soak)} birth=${JSON.stringify(d.birth)}`);
    if (!normalizerIsFixedPoint) console.error('    normalizeSimulationRules is NO LONGER a fixed point on this preset table — composeSoakRules does not normalize, so the soak now carries an UNNORMALIZED world.');
    if (!keyOrderIdentical) console.error('    the key ORDER differs — the world state is serialized, so this moves every hash even with equal contents.');
    continue;
  }
  // The MARKER FILE is the roster certify.sh iterates. A preset that failed the seam has no
  // marker, so it cannot be certified by accident — the same law the overlay files carried.
  const marker = join(outdir, `seam-ok.${f.presetId}`);
  writeFileSync(marker, `${JSON.stringify({ presetId: f.presetId, rulesSha256: sha256(soak), keys: soakKeys.length }, null, 2)}\n`, 'utf8');
  console.log(`  ${f.presetId.padEnd(22)} seam HOLDS — soak keys=${soakKeys.length} == birth keys=${birthKeys.length}, values equal, order equal, norm(table)==table`);
}

if (!rows.length) {
  console.error(`preset-seam: no preset matched${ONLY ? ` --preset ${ONLY}` : ''} — REFUSING to report a vacuous run.`);
  process.exit(1);
}

const reportFile = join(outdir, 'preset-seam-report.json');
writeFileSync(reportFile, `${JSON.stringify({
  instrument: 'lprobe/preset-seam.mjs',
  supersedes: 'lprobe/preset-overlay.mjs (the --rules-json overlay seam, dead since DOCKET item 7)',
  question: 'does composeSoakRules({ preset: SIMULATION_RULE_PRESETS[P].rules }) equal the REAL birth of P?',
  tree,
  seasons: SEASONS,
  fixtureFile: resolve(FIXTURES),
  takenAt: new Date().toISOString(),
  presetsRefused: refused,
  presetsCertifiable: rows.filter((r) => r.seamHolds).map((r) => r.presetId),
  rows,
}, null, 2)}\n`, 'utf8');
console.log(`preset-seam: ${rows.length} preset(s), ${refused} refused -> ${reportFile}`);
process.exit(refused ? 1 : 0);
