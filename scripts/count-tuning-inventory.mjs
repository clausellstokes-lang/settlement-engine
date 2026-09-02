#!/usr/bin/env node
/**
 * scripts/count-tuning-inventory.mjs — REPORT ONLY. THIS CLI NEVER FREEZES A FIGURE.
 *
 * ⛔ THERE IS NO `--update` HERE, AND ITS ABSENCE IS THE DESIGN. The refreeze ritual lives
 * inside `tests/lint/tuningRegister.walker.test.js`, driven by `TUNING_INVENTORY_REFREEZE`,
 * because the refusal logic must sit in ONE place and be executed by the same run that
 * enforces it. This estate already owns the receipt for the other arrangement: a documented
 * `UPDATE_*` mode with no shrink guard is a mode that disarms the guard it belongs to —
 * `voiceMechanics`' bare `writeFileSync` banked +1013 rows in silence. A reporting tool that
 * could also bank would be the same shape again.
 *
 * ⛔ AND IT PROPOSES NO VALUE. Every number printed here is a MEASUREMENT of what the source
 * already says. Tuning values are the owner's, signed LAST at the sitting.
 *
 *   node scripts/count-tuning-inventory.mjs              the tally
 *   node scripts/count-tuning-inventory.mjs --json       the whole measured inventory
 *   node scripts/count-tuning-inventory.mjs --dead       tables no importer names
 *   node scripts/count-tuning-inventory.mjs --scaffold-declared   ONCE, and it refuses twice
 */
import { readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  measureTree, loadTuningRegister, deskSheet, REGISTER_REL, UNIT_VOCABULARY, SCHEMA_VERSION,
} from './lib/tuning-inventory.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);

/**
 * THE SEEDED ROSTER — the unsuffixed tuning exports the `_TUNING` glob cannot see, and the
 * signature records the register INDEXES rather than replaces. Every row is a CITATION
 * asserted to resolve: the walker's arm 12 reds if any named export is not a real top-level
 * const in its named file, so a stale roster line cannot sit here looking authoritative.
 *
 * ⚠ CAPACITY's 16-row `DEMOGRAPHIC_TUNING_COVERAGE` is NOT here, and its absence is
 * measured rather than forgotten: that surface lands with CAPACITY C1, which is HORIZON-DARK
 * and boards after this train. The roster gains it then.
 */
const SEEDED_HOMES = [
  {
    kind: 'tables',
    file: 'src/domain/density/densityBands.js',
    exports: [
      'TIER_ORDER', 'IMPORTANCE_ORDER', 'DENSITY_BANDS', 'RANK_CEILING_BY_TIER',
      'VACANCY_WEIGHTS', 'PARTICULAR_TILTS', 'RIVAL_ROLL', 'CONCENTRATION',
      'SUCCESSION_CLOCK_TICKS', 'SUCCESSION_WEIGHTS',
    ],
    note: 'the density ladder (D4). Ten unsuffixed exports the _TUNING glob cannot see.',
  },
  {
    kind: 'tables',
    file: 'src/domain/worldPulse/bandedStock.js',
    exports: ['HALF_LIFE_WEEKS'],
    note: 'the half-life ladder. The routing wave owns its thirteen hand-keyed Math.pow sites.',
  },
  {
    kind: 'tables',
    file: 'src/domain/worldPulse/intervalWeeks.js',
    exports: ['INTERVAL_WEEKS'],
    note: 'the canonical interval table; two private duplicates are held equal by its role.',
  },
  {
    kind: 'tables',
    file: 'src/domain/worldPulse/faithChannelBindings.js',
    exports: ['CAUSAL_SWING'],
    note: 'a scalar dial imported by name; its consumers read it as a computed leaf.',
  },
  {
    kind: 'tables',
    file: 'src/domain/worldPulse/faithTuningSurface.js',
    exports: ['FAITH_TUNING_COVERAGE'],
    note: 'the F6c roster (post-TAIL-F). Its three _TUNING tables enter by the glob.',
  },
  {
    kind: 'signature-record',
    file: 'src/domain/density/densityBands.js',
    exports: ['REGISTER_VII_SIGNATURE'],
    words: ['signed', 'live'],
    note: 'D4. INDEXED here, never replaced — the record keeps gating its own dial.',
  },
  {
    kind: 'signature-record',
    file: 'src/domain/worldPulse/faithTuningSurface.js',
    exports: ['FAITH_TUNING_SIGNATURE'],
    words: ['signed', 'live'],
    note: 'F6c (TAIL-F). INDEXED here, never replaced.',
  },
];

/**
 * THE SOAK-BAND ALIASES. `proposedSoakBands.js` names its dials by BARE constant name, and
 * three of those names are PHANTOMS — they resolve to no registered leaf anywhere, because
 * the real dial is a bare literal with no name at all. Recording them as phantoms with their
 * measured real homes is the honest act; `PHANTOM_ALIAS_CEILING = 3` then makes the repair
 * measurable instead of aspirational. Repairing them is an owner row (TR-6), not a lane's.
 */
const SEEDED_PHANTOMS = {
  WAR_CRISIS_ARCHETYPES_RATE_PRESS: {
    phantom: true,
    realHome: 'src/domain/worldPulse/populationDynamics.js:306',
    note: 'a bare literal with no name; the band cites a constant that does not exist.',
  },
  SEVERE_FLIGHT_CAP: {
    phantom: true,
    realHome: 'src/domain/worldPulse/populationDynamics.js:327',
    note: 'a bare literal with no name; the band cites a constant that does not exist.',
  },
  economicAdj_divisor_400: {
    phantom: true,
    realHome: 'src/domain/worldPulse/coup.js:134',
    note: 'a bare literal with no name; the band cites a constant that does not exist.',
  },
};

function scaffoldDeclared() {
  const path = join(ROOT, REGISTER_REL);
  if (existsSync(path)) {
    const existing = loadTuningRegister(ROOT);
    if (Object.keys(existing?.tables ?? {}).length > 0) {
      console.error(`REFUSED — ${REGISTER_REL} already carries`
        + ` ${Object.keys(existing.tables).length} declared rows. Scaffolding is a ONE-OFF:`
        + ' running it again would overwrite the pen\'s own work with blank drafts.');
      process.exit(2);
    }
  }

  const inventory = measureTree(ROOT, { homes: SEEDED_HOMES });
  const tables = {};
  for (const id of Object.keys(inventory.tables).sort()) {
    tables[id] = { role: null, status: 'draft', signedAt: null, unit: null, band: null, note: '' };
  }

  // THE ALIASES ARE RESOLVED BY MEASUREMENT, NOT BY HAND. Each `constantId` is a BARE name;
  // the register records which registered leaf it actually names. Where a name is a homonym
  // the band's own `constantModule` disambiguates it, and where it resolves to nothing at
  // all the row is a PHANTOM with its real home cited.
  const soakBandAliases = {};
  const bandsSource = readFileSync(join(ROOT, 'src/domain/tuning/proposedSoakBands.js'), 'utf8');
  const leafIndex = new Map();
  for (const [id, table] of Object.entries(inventory.tables)) {
    for (const path of Object.keys(table.leaves ?? {})) {
      const last = path.split('.').pop();
      if (!leafIndex.has(last)) leafIndex.set(last, []);
      leafIndex.get(last).push({ leaf: `${id}.${path}`, file: id.split('#')[0] });
    }
  }
  const bands = [...bandsSource.matchAll(/constantIds:\s*\[([^\]]*)\][\s\S]*?constantModule:\s*'([^']+)'/g)]
    .map((m) => ({
      names: m[1].split(',').map((p) => p.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean),
      module: m[2],
    }));
  const moduleFor = new Map();
  for (const band of bands) for (const name of band.names) if (!moduleFor.has(name)) moduleFor.set(name, band.module);

  for (const name of [...new Set(bands.flatMap((b) => b.names))].sort()) {
    if (SEEDED_PHANTOMS[name]) { soakBandAliases[name] = SEEDED_PHANTOMS[name]; continue; }
    const candidates = leafIndex.get(name) ?? [];
    const home = moduleFor.get(name);
    const narrowed = candidates.length > 1 ? candidates.filter((c) => c.file === home) : candidates;
    soakBandAliases[name] = {
      registeredLeaf: narrowed.length === 1 ? narrowed[0].leaf : null,
      phantom: false,
      realHome: null,
      ambiguous: narrowed.length > 1 ? candidates.map((c) => c.leaf) : undefined,
      note: candidates.length > 1
        ? `homonym: ${candidates.length} leaves carry this name; the band's constantModule picks one.`
        : '',
    };
  }

  const register = {
    _doc: [
      'THE DECLARED TUNING REGISTER — THE PEN\'S FILE.',
      '',
      'This file is DECLARED. Its sibling tests/lint/.tuning-inventory.json is MEASURED and is',
      'written by the refreeze ritual alone. Never hand-edit a measured field; never hand-edit',
      'a signature here.',
      '',
      'THE VALUES IN THE ESTATE ARE NOT THIS FILE\'S TO CHANGE. Every row lands `draft`, and a',
      'row becomes `signed` only through the ritual, driven by a signing record the OWNER wrote',
      'at the tuning sitting. `signatureVersion` is 0 until then. A lane that wants a different',
      'value opens an owner row; it does not edit here.',
      '',
      'REFREEZE:',
      "  TUNING_INVENTORY_REFREEZE='<seat>' TUNING_INVENTORY_NOTE='<why it moved>' \\",
      '    npx vitest run tests/lint/tuningRegister.walker.test.js',
    ],
    registerVersion: 1,
    schemaVersion: SCHEMA_VERSION,
    signatureVersion: 0,
    signatures: [],
    unitVocabulary: [...UNIT_VOCABULARY],
    homes: SEEDED_HOMES,
    moduleSide: ['src/domain/townCartography/'],
    moduleSideCitation: '§725.1 — the owner ruled no map leg in launch tuning at all; every map'
      + ' constant is module-side. These ids are enrolled by totality but are REFUSED `signed`'
      + ' and never reach the sitting\'s desk.',
    tables,
    roles: {},
    declaredGrowth: { unregisteredNamed: {}, bareDecimals: {} },
    soakBandAliases,
  };

  const temporary = `${path}.scaffold-${process.pid}`;
  writeFileSync(temporary, `${JSON.stringify(register, null, 2)}\n`, 'utf8');
  renameSync(temporary, path);
  console.log(`scaffolded ${REGISTER_REL}: ${Object.keys(tables).length} draft rows,`
    + ` ${SEEDED_HOMES.length} homes, ${Object.keys(soakBandAliases).length} soak-band aliases`
    + ` (${Object.values(soakBandAliases).filter((a) => a.phantom).length} phantoms).`);
  console.log('Every row is DRAFT and every value is UNSIGNED. The owner signs at the sitting.');
}

/**
 * THE SITTING SHEET. What the owner needs in front of them to sign a row: what it is, what
 * unit it carries, what it holds now, and how much of the estate reads it. Roster-first,
 * then united tables, then the rest — because the sitting works down from what it came to
 * decide, not alphabetically.
 *
 * ⛔ IT PRINTS. IT DOES NOT PROPOSE. There is no recommended value in this output and there
 * is no column for one.
 */
function desk() {
  const register = loadTuningRegister(ROOT);
  const inventory = measureTree(ROOT, register);
  const roster = (register.homes ?? [])
    .filter((home) => home.kind === 'tables')
    .flatMap((home) => (home.exports ?? []).map((name) => `${home.file}#${name}`));
  const { rows, moduleSideExcluded } = deskSheet(register, inventory, { roster });

  console.log('THE TUNING SITTING — DESK SHEET');
  console.log(`  ${rows.length} rows on the desk; every value below is UNSIGNED and is the owner's to sign.`);
  console.log(`  module-side, not on the desk: ${moduleSideExcluded}`);
  console.log('');
  for (const row of rows) {
    if (row.unit === null) continue;
    console.log(`${row.onRoster ? '*' : ' '} ${row.id}`);
    console.log(`    status ${row.status}   keys ${row.keys}   read by ${row.namedDependents} module(s) by name, ${row.dependents} by file`);
    if (row.roles.length) console.log(`    role(s) ${row.roles.join(', ')}`);
    for (const [key, unit] of Object.entries(row.unit)) {
      const value = row.values[key];
      const band = row.band?.[key];
      console.log(`    ${key.padEnd(28)} ${String(unit).padEnd(12)} ${JSON.stringify(value)}${band ? `  band [${band[0]}, ${band[1]}]` : '  band -'}`);
    }
    console.log('');
  }
  const unitless = rows.filter((row) => row.unit === null);
  console.log(`AWAITING A UNIT — not signable until each carries one: ${unitless.length}`);
  for (const row of unitless.slice(0, 12)) console.log(`    ${row.id} (${row.keys} keys)`);
  if (unitless.length > 12) console.log(`    ... and ${unitless.length - 12} more`);
}

function report() {
  const register = loadTuningRegister(ROOT);
  const inventory = measureTree(ROOT, register);
  if (has('--json')) {
    console.log(JSON.stringify(inventory, null, 2));
    return;
  }
  const { totals } = inventory;
  console.log('THE TUNING ESTATE, MEASURED');
  console.log(`  P1 tables                 ${totals.tables}`);
  console.log(`  top-level keys            ${totals.keys}`);
  console.log(`  spans the machine closed  ${totals.tables - inventory.unclosed.length} / ${totals.tables}`);
  console.log(`  P2 unregistered named     ${totals.unregisteredNamed} across ${Object.keys(inventory.unregisteredNamed).length} files`);
  console.log(`  P3 bare decimals          ${totals.bareDecimals} across ${Object.keys(inventory.bareDecimals).length} files`);
  console.log(`  tables no FILE imports    ${totals.zeroDependentTables}`);
  console.log(`  tables no IMPORTER NAMES  ${totals.zeroNamedDependentTables}`);
  const declared = Object.keys(register?.tables ?? {}).length;
  const signed = Object.values(register?.tables ?? {}).filter((r) => r.status === 'signed').length;
  console.log(`  declared rows             ${declared}`);
  console.log(`  SIGNED rows               ${signed}   (signatureVersion ${register?.signatureVersion ?? 0})`);
  if (inventory.unclosed.length) {
    console.log('\n⛔ SPANS THE MACHINE COULD NOT CLOSE — the base moved under the detector:');
    for (const row of inventory.unclosed) console.log(`  ${row.id}: ${row.residue}`);
  }
  if (has('--dead')) {
    console.log('\nTABLES NO IMPORTER NAMES (a table read only by a test is NOT dead — the test is its consumer):');
    for (const [id, row] of Object.entries(inventory.tables)) {
      if (row.namedDependents.length === 0) console.log(`  ${id}  (${row.keys} keys, ${row.idiom})`);
    }
  }
}

if (has('--scaffold-declared')) scaffoldDeclared();
else if (has('--desk')) desk();
else report();
