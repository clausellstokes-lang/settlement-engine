/**
 * tests/lint/tuningRegister.walker.test.js — THE TUNING REGISTER'S WALKER.
 *
 * ⛔⛔ THE VALUES IN THIS ESTATE ARE THE OWNER'S, AND NOTHING HERE PROPOSES ONE.
 * This walker measures the tuning estate and refuses writes. It does not tune. Every row of
 * the declared register lands `draft`, `signatureVersion` is 0, and a row becomes `signed`
 * only through the refreeze ritual driven by a signing record the owner wrote at the tuning
 * sitting — the carve-out by nature that no delegation covers (THE PROMISE; §763.1).
 *
 * ⭐ STATE YOUR SURFACE BEFORE YOUR ARMS (FOLD 25). Three populations, every measurement a
 * TEXT measurement over `codeOnly`-stripped source:
 *
 *   P1 TABLES — every `const *_TUNING` under `src/`, plus every `(file, export)` the
 *     register's `homes[]` names. TOTALITY BOTH WAYS, no baseline and no ceiling: a new
 *     table reds BY ID until it is registered. A ceiling here would sell silence.
 *   P2 NAMED  — module-top-level `const UPPER_SNAKE = <numeric>;` outside every P1 span,
 *     aggregator leaves removed. Shrink-only per file, new files at 0.
 *   P3 BARE   — bare decimal literals in code text outside every P1 span and P2 line.
 *     Shrink-only per file, new files at 0.
 *
 * ⚠ THE CANNOT-CATCH LIST, STATED SO IT IS NEVER RE-DISCOVERED AS A DEFECT. P3 counts
 * decimals only: integer tuning literals (the `>= 30` sites, the 52/104/156 cooldowns, the
 * six-tick window) are NOT counted, and neither are regex literals. Widening to integers is
 * an owner row (TR-7), not a lane's. A decimal inside `${…}` IS counted; one inside a
 * comment or a string is NOT, and the URL-trap arm proves the strip rather than asserting it.
 *
 * ⚠ IT IMPORTS NO `src` MODULE, DELIBERATELY. Everything about the estate is read as TEXT.
 * A measuring instrument that imported the thing it measures would acquire a runtime
 * dependency on it, and one circular import would turn this walker into a build.
 *
 * ⭐ THE REFREEZE RITUAL LIVES HERE, NOT IN A CLI, AND THAT PLACEMENT IS THE LESSON OF A
 * RECORDED INCIDENT. `voiceMechanics`' bare `writeFileSync` banked +1013 rows in silence
 * because a documented update mode with no shrink guard is a mode that disarms its own
 * guard. Keeping every refusal in one function that this file's own arms drive means the
 * refusal logic is TESTED by the same run that enforces it. `scripts/count-tuning-inventory.mjs`
 * is report-only and has no `--update`.
 *
 *   TUNING_INVENTORY_REFREEZE='<seat>' TUNING_INVENTORY_NOTE='<why it moved>' \
 *     npx vitest run tests/lint/tuningRegister.walker.test.js
 *
 * ⭐ AND IT EXITS NON-ZERO ON SUCCESS, BY DESIGN. A mode that both rewrites a register and
 * reports a green test can silently disarm this guard for a whole gate run. The refreeze
 * always fails loudly; the VERIFICATION is a separate ordinary run, and that green is the
 * receipt.
 */
import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { codeOnly } from '../helpers/codeOnlySource.js';
import { gitResolvesCommit, UNRESOLVABLE_WELL_FORMED_SHA } from '../helpers/gitObjectStore.js';
import {
  measureTree, discoverTables, tableSpan, flattenLeaves, spanDigest, astKeyNames,
  countBareDecimals, countUnregisteredNamed, resolveDependents,
  loadTuningRegister, loadTuningInventory, signatureStateOf, tuningRegisterFingerprint,
  refreezeRefusals, signingRecordMalformations, tuningIdFor, applySigningRecord, deskSheet, REGISTER_REL,
  TUNING_SHIFT_CAUSE_RE, UNIT_VOCABULARY, DIVERGENCE_REASONS, IDIOMS, REFUSALS,
  INVENTORY_REL, TREES_P1, TREES_P2P3, SCHEMA_VERSION,
} from '../../scripts/lib/tuning-inventory.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const INVENTORY_PATH = join(ROOT, INVENTORY_REL);

/**
 * THE SIX CEILINGS. Every one is a banked MEASUREMENT, never a guess and never a target:
 * they are set to what the estate ALREADY IS, so the only movement they permit is downward.
 * Raising one is not a lane's act.
 */
const CEILINGS = Object.freeze({
  // ⭐ RATCHETED DOWN 7003 -> 6985 at the HORIZON-INSTR landing, banking sixteen measured wins
  // that the T13 landing (§883) produced under a register frozen one landing back. A win is
  // banked at the moment it is measured, or it silently restores the headroom it just bought.
  BARE_DECIMAL_CEILING: 6985,
  // ⛔ RAISED 534 -> 535, BY EXACTLY ONE UNIT, AND THE CAUSE IS NAMED RATHER THAN ABSORBED:
  // src/domain/relationships/canonicalRelationship.js, landed by T13 at §883 (Car P′,
  // 754856b125828dc555359d6df0e0632be9636a09), where a bare computed population bonus became the
  // named constant POPULATION_SATURATION. The +1 here is the COUNTERPART of that same file's -1
  // bare decimal in the same commit — the register scores naming a magic number as debt in one
  // population while crediting it as a win in the other, which is a finding about this instrument
  // and rides to §884. Raising a ceiling is not a LANE's act: this one is the CHAIR's, ruled at
  // §883.8, attributed here and declared owner-visible on §884.
  UNREGISTERED_NAMED_CEILING: 535,
  UNITLESS_TABLE_CEILING: 220,
  DECLARED_DIVERGENCE_CEILING: 5,
  PHANTOM_ALIAS_CEILING: 3,
  // RAISED 0 -> 2 for the two DECLARED_GROWTH rows this landing's cure 1/2 added, both citing
  // T13 Car P′ 754856b12. This ceiling counts ATTRIBUTED rows, so it rises only when growth is
  // cited to a real commit with a cause — an unattributed row cannot reach it.
  DECLARED_GROWTH_CEILING: 2,
});

const register = loadTuningRegister(ROOT);
const committed = loadTuningInventory(ROOT);

/** The live measurement, taken ONCE. Every arm reads this one object. */
let live = null;

/* ---------------------------------------------------------------- the ritual */

const gitOut = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const refreezeRequested = () => (process.env.TUNING_INVENTORY_REFREEZE ?? '') !== '';

function refreezeInventory(measured) {
  const verdict = refreezeRefusals({
    root: ROOT,
    measuredBy: process.env.TUNING_INVENTORY_REFREEZE,
    note: process.env.TUNING_INVENTORY_NOTE,
    previous: committed,
    measured,
    register,
    genesisCharter: process.env.TUNING_INVENTORY_GENESIS,
    record: process.env.TUNING_SIGNATURE_RECORD
      ? JSON.parse(readFileSync(join(ROOT, process.env.TUNING_SIGNATURE_RECORD), 'utf8'))
      : null,
  });
  if (!verdict.ok) {
    throw new Error(`tuning inventory refreeze REFUSED [${verdict.refusal}] — ${verdict.detail}`);
  }
  const next = {
    _doc: committed?._doc ?? [
      'THE MEASURED TUNING INVENTORY — MACHINE-WRITTEN, NEVER HAND-EDITED.',
      'Its sibling tests/lint/.tuning-register.json is the DECLARED register and is the pen\'s.',
      'Regenerate with:',
      "  TUNING_INVENTORY_REFREEZE='<seat>' TUNING_INVENTORY_NOTE='<why>' \\",
      '    npx vitest run tests/lint/tuningRegister.walker.test.js',
      'The refreeze EXITS NON-ZERO by design; the proof is a separate ordinary run.',
    ],
    measuredAtSha: gitOut('rev-parse', 'HEAD'),
    measuredBy: process.env.TUNING_INVENTORY_REFREEZE.trim(),
    date: new Date().toISOString().slice(0, 10),
    note: process.env.TUNING_INVENTORY_NOTE.trim(),
    ...measured,
  };
  const temporary = `${INVENTORY_PATH}.refreeze-${process.pid}`;
  writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  renameSync(temporary, INVENTORY_PATH);
  throw new Error(`tuning inventory REFROZEN at ${next.measuredAtSha} by ${next.measuredBy}:`
    + ` ${next.totals.tables} tables, ${next.totals.unregisteredNamed} named, ${next.totals.bareDecimals} bare.`
    + ' This run fails BY DESIGN so a refreeze can never be mistaken for a passing gate —'
    + ' re-run this walker without TUNING_INVENTORY_REFREEZE, and THAT green is the proof.');
}

beforeAll(() => {
  live = measureTree(ROOT, register);
  if (refreezeRequested()) refreezeInventory(live);
}, 120_000);

/* ---------------------------------------------------------------- fixtures */

/** Write a throwaway tree and measure it. Nothing on the real tree is ever mutated. */
function inTempTree(files, body) {
  const dir = mkdtempSync(join(tmpdir(), 'tunereg-'));
  try {
    for (const [rel, contents] of Object.entries(files)) {
      const path = join(dir, rel);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, contents, 'utf8');
    }
    return body(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const FIXTURE_FROZEN_TABLE = `export const PROBE_TUNING = Object.freeze({
  ALPHA: 0.25,
  BETA: 12,
  NESTED: Object.freeze({ GAMMA: 0.5 }),
});
`;

const FIXTURE_AGGREGATOR = `const SHARED_RATE = 0.75;
export const AGG_TUNING = Object.freeze({
  RATE: SHARED_RATE,
});
`;

const FIXTURE_URL_TRAP = `// see https://example.test/docs/3.14/spec for the derivation
export const TRAP_TUNING = Object.freeze({ REAL: 0.5 });
const note = 'the ratio 9.99 is discussed at http://example.test/a/1.5/b';
const live = clamp(2.25);
`;

/* ================================================================= describe A */

describe('tuning register — the detectors are honest', () => {
  test('a frozen table spans to its close and its depth-1 keys are counted', () => {
    const span = tableSpan(FIXTURE_FROZEN_TABLE);
    expect(span.ok, 'the fixture table must close').toBe(true);
    expect(span.wrapper).toBe('Object.freeze');
    expect(span.keys, 'ALPHA, BETA and NESTED are the depth-1 keys; GAMMA is deeper').toBe(3);
    expect(span.spanText.endsWith(')'), 'the span must reach the wrapper\'s own closing paren,'
      + ' not stop at the object\'s brace — a span ending at `}` is an unterminated call and'
      + ' every consumer that parses it reads the whole estate as unparseable').toBe(true);
  });

  test('a shorthand aggregator leaf resolves one hop to its module const', () => {
    const span = tableSpan(FIXTURE_AGGREGATOR.split('\n').slice(1).join('\n'));
    const { leaves, idiom } = flattenLeaves(span.spanText);
    expect(leaves.RATE, 'a leaf naming a module const is recorded as an expression, never'
      + ' silently evaluated to a number the source does not literally carry').toEqual({ expr: 'SHARED_RATE' });
    expect(idiom).toBe('aggregator');
  });

  test('the span digest is blind to comments and reflow and sees a value change', () => {
    const base = tableSpan(FIXTURE_FROZEN_TABLE).spanText;
    const commented = tableSpan(FIXTURE_FROZEN_TABLE.replace('  ALPHA:', '  // a note nobody signed\n  ALPHA:')).spanText;
    const reflowed = tableSpan(FIXTURE_FROZEN_TABLE.replace('ALPHA: 0.25,\n', 'ALPHA:    0.25,\n\n')).spanText;
    const revalued = tableSpan(FIXTURE_FROZEN_TABLE.replace('ALPHA: 0.25', 'ALPHA: 0.26')).spanText;
    expect(spanDigest(commented), 'a comment must not move a digest — otherwise every'
      + ' documentation pass becomes a signing event').toBe(spanDigest(base));
    expect(spanDigest(reflowed), 'reflow must not move a digest').toBe(spanDigest(base));
    expect(spanDigest(revalued), 'a changed VALUE must move the digest, or the freeze means'
      + ' nothing').not.toBe(spanDigest(base));
  });

  test('a decimal inside a registered span is not counted as bare', () => {
    inTempTree({ 'src/domain/probe.js': FIXTURE_FROZEN_TABLE }, (dir) => {
      const { tables } = discoverTables(dir, null);
      const withSpan = countBareDecimals(dir, tables, ['src/domain']);
      const withoutSpan = countBareDecimals(dir, [], ['src/domain']);
      expect(withSpan['src/domain/probe.js'], 'every decimal in the fixture lives inside the'
        + ' registered span, so none of them is bare').toBeUndefined();
      expect(withoutSpan['src/domain/probe.js'], 'and with no span registered the same two'
        + ' decimals ARE bare — which is what proves the exclusion is doing work').toBe(2);
    });
  });

  test('a decimal in a comment or a string is not counted and a template interpolation is', () => {
    const source = 'const A = `x ${1.5} y`;\n// 2.5 in a comment\nconst B = \'3.5 in a string\';\nconst C = 4.5;\n';
    inTempTree({ 'src/domain/probe.js': source }, (dir) => {
      const counts = countBareDecimals(dir, [], ['src/domain']);
      expect(counts['src/domain/probe.js'], 'the interpolated 1.5 and the bare 4.5 count;'
        + ' the commented 2.5 and the quoted 3.5 do not').toBe(2);
    });
  });

  test('an UPPER_SNAKE numeric const is P2 not P3 and an aggregator leaf is neither', () => {
    inTempTree({ 'src/domain/probe.js': FIXTURE_AGGREGATOR }, (dir) => {
      const { tables } = discoverTables(dir, null);
      const named = countUnregisteredNamed(dir, tables, ['src/domain']);
      const bare = countBareDecimals(dir, tables, ['src/domain']);
      expect(named.counts['src/domain/probe.js'], 'SHARED_RATE is the table\'s own value'
        + ' written once, so counting it as a second unregistered dial would punish the'
        + ' tidier idiom').toBeUndefined();
      expect(bare['src/domain/probe.js'], 'and its decimal is on a P2 line, so P3 skips it').toBeUndefined();
    });
    inTempTree({ 'src/domain/probe.js': 'export const LOOSE_RATE = 0.9;\n' }, (dir) => {
      const named = countUnregisteredNamed(dir, [], ['src/domain']);
      expect(named.counts['src/domain/probe.js'], 'an UPPER_SNAKE numeric const no table'
        + ' references is exactly what P2 exists to count').toBe(1);
    });
  });

  test('a string containing a double slash does not hide the literal that follows it', () => {
    inTempTree({ 'src/domain/probe.js': FIXTURE_URL_TRAP }, (dir) => {
      const { tables } = discoverTables(dir, null);
      const bare = countBareDecimals(dir, tables, ['src/domain']);
      // anchored: the live 2.25 sits on the line AFTER the string, so a strip that treated
      // the `//` inside the URL as the start of a comment would swallow the rest of the file
      // and report zero here. It is deliberately spelled `const live = clamp(2.25)` and not
      // `const LIVE = 2.25` — an UPPER_SNAKE numeric const is a P2 line, which P3 skips by
      // design, and the first cut of this fixture convicted itself on exactly that.
      expect(bare['src/domain/probe.js'], 'the 3.14 in the comment and the 9.99 and 1.5 in'
        + ' the string are prose; only the live 2.25 is a bare decimal').toBe(1);
    });
  });

  test('the key count comes from the syntax tree, so a shorthand table is not read as empty', () => {
    const shorthand = `export const SHORT_TUNING = Object.freeze({\n  ALPHA,\n  BETA,\n  GAMMA,\n});\n`;
    const span = tableSpan(shorthand);
    expect(span.keys, 'the recon\'s machine counts depth-1 COLONS, and a shorthand table has'
      + ' none — so on its own it reports an empty table').toBe(0);
    expect(astKeyNames(span.spanText), 'the syntax tree sees a shorthand property exactly as it'
      + ' sees a written one').toEqual(['ALPHA', 'BETA', 'GAMMA']);
    // anchored: the colon-written fixture below is counted correctly by BOTH, so the machine
    // is not simply broken — it is blind to one idiom, which is why the tree is authoritative.
    expect(tableSpan(FIXTURE_FROZEN_TABLE).keys).toBe(3);
  });

  test('every measured table agrees between the span machine and the syntax tree', () => {
    const problems = [];
    for (const [id, table] of Object.entries(live.tables)) {
      // A nested table flattens to dotted paths, so the depth-1 KEY set is the set of first
      // segments — not the leaves that happen to carry no dot.
      const topLevel = new Set(Object.keys(table.leaves).map((path) => path.split('.')[0]));
      if (topLevel.size !== table.keys) {
        problems.push(`${id}: keys ${table.keys} but ${topLevel.size} depth-1 key(s)`);
      }
    }
    expect(problems, 'the key count and the depth-1 leaf set are two readings of one fact and'
      + ' must agree for every table. This arm is why the shorthand blindness was found: 21 of'
      + ' 210 tables disagreed, one of them reading ZERO keys against its actual seventeen.').toEqual([]);
  });

  test('dependents follow one re-export hop', () => {
    inTempTree({
      'src/domain/home.js': 'export const HOP_TUNING = Object.freeze({ A: 1 });\n',
      'src/domain/barrel.js': "export * from './home.js';\n",
      'src/domain/consumer.js': "import { HOP_TUNING } from './barrel.js';\nexport const use = () => HOP_TUNING;\n",
    }, (dir) => {
      const { byFile } = resolveDependents(dir, ['src']);
      const importers = byFile.get('src/domain/home.js') ?? [];
      expect(importers, 'the barrel imports the home directly').toContain('src/domain/barrel.js');
      expect(importers, 'and the consumer reaches it through exactly one re-export hop')
        .toContain('src/domain/consumer.js');
    });
  });
});

/* ================================================================= describe B */

describe('tuning register — every table is registered', () => {
  test('every measured table has a declared row', () => {
    const problems = [];
    for (const id of Object.keys(live.tables)) {
      if (!register.tables[id]) problems.push(id);
    }
    expect(problems, 'TOTALITY: a tuning table with no declared row is a dial nobody has'
      + ' named, and this population carries no ceiling precisely so that a new one cannot be'
      + ' absorbed silently. Register it in tests/lint/.tuning-register.json as a DRAFT row —'
      + ' registering is not signing, and it costs nothing but a line.').toEqual([]);
  });

  test('a planted unregistered table is named by the totality arm', () => {
    inTempTree({
      'src/domain/anticipatedReactionsProbe.js': 'export const PROBE_TUNING = Object.freeze({ A: 0.5 });\n',
    }, (dir) => {
      const measured = measureTree(dir, { homes: [] });
      const planted = tuningIdFor('src/domain/anticipatedReactionsProbe.js', 'PROBE_TUNING');
      expect(Object.keys(measured.tables), 'the plant must be discovered by id').toContain(planted);
      const unregistered = Object.keys(measured.tables).filter((id) => !register.tables[id]);
      expect(unregistered, 'and it must be exactly what the totality arm would name').toEqual([planted]);
    });
  });

  test('no declared row names a table that does not exist', () => {
    const measured = new Set(Object.keys(live.tables));
    const phantoms = Object.keys(register.tables).filter((id) => !measured.has(id));
    expect(phantoms, 'a declared row with no measured table is a citation that no longer'
      + ' resolves — the table was renamed, moved or deleted and the register still speaks'
      + ' for it. THE CITATION LAW: a row here is an assertion that the thing exists.').toEqual([]);
  });

  test('a planted declared row with no table is named by the phantom arm', () => {
    const doctored = { ...register, tables: { ...register.tables, 'src/domain/nowhere.js#GHOST_TUNING': { role: null, status: 'draft', signedAt: null, unit: null, band: null, note: '' } } };
    const measured = new Set(Object.keys(live.tables));
    const phantoms = Object.keys(doctored.tables).filter((id) => !measured.has(id));
    expect(phantoms, 'the planted ghost row must be the one and only phantom')
      .toEqual(['src/domain/nowhere.js#GHOST_TUNING']);
  });

  test('the three colliding export names resolve to seven distinct ids', () => {
    const colliding = ['REACTION_TUNING', 'LADDER_TUNING', 'DISPATCH_TUNING'];
    const found = Object.keys(live.tables).filter((id) => colliding.includes(id.split('#')[1]));
    expect(found.length, 'three export names, seven real tables — which is exactly why the id'
      + ' grammar is `<file>#<export>` and never the bare name. A bare-name key would fold'
      + ' seven dials into three rows and the register would be describing something other'
      + ' than the estate.').toBe(7);
    expect(new Set(found).size, 'and every one of the seven is distinct').toBe(7);
  });

  test('every declared home export exists as a top-level const in its named file', () => {
    const problems = [];
    for (const home of register.homes) {
      const path = join(ROOT, home.file);
      if (!existsSync(path)) { problems.push(`${home.file}: the home file does not exist`); continue; }
      const source = codeOnly(readFileSync(path, 'utf8'));
      for (const name of home.exports) {
        const declared = new RegExp(`^\\s*(export\\s+)?const\\s+${name}\\b`, 'm').test(source);
        if (!declared) problems.push(`${home.file}#${name}: no top-level const of that name`);
      }
    }
    expect(problems, 'THE CITATION LAW: every roster line asserts that an export exists, and'
      + ' a stale line that merely looks authoritative is the failure this arm exists for.').toEqual([]);
  });
});

/* ================================================================= describe C */

describe('tuning register — the inventory is frozen and honest', () => {
  test('the committed inventory carries its provenance', () => {
    expect(committed, `${INVENTORY_REL} is missing; without it this walker asserts nothing`).toBeTruthy();
    const problems = [];
    for (const field of ['measuredAtSha', 'measuredBy', 'date', 'note']) {
      const value = committed[field];
      if (typeof value !== 'string' || value.trim() === '') problems.push(field);
    }
    expect(problems, 'a figure whose measuring sha is unknown cannot be audited against the'
      + ' tree it was measured on — provenance is load-bearing, not decoration').toEqual([]);
    expect(committed.schemaVersion).toBe(SCHEMA_VERSION);
  });

  test('the measured tree matches the committed inventory exactly', () => {
    const problems = [];
    const measuredIds = Object.keys(live.tables).sort();
    const committedIds = Object.keys(committed.tables).sort();
    for (const id of measuredIds) if (!committed.tables[id]) problems.push(`${id}: measured, not in the inventory`);
    for (const id of committedIds) if (!live.tables[id]) problems.push(`${id}: in the inventory, not measured`);
    for (const id of measuredIds) {
      const was = committed.tables[id];
      const now = live.tables[id];
      if (!was) continue;
      if (was.spanDigest !== now.spanDigest) problems.push(`${id}: spanDigest moved`);
      if (was.keys !== now.keys) problems.push(`${id}: keys ${was.keys} -> ${now.keys}`);
      if (was.idiom !== now.idiom) problems.push(`${id}: idiom ${was.idiom} -> ${now.idiom}`);
      if (JSON.stringify(was.leaves) !== JSON.stringify(now.leaves)) problems.push(`${id}: leaves moved`);
      if (JSON.stringify(was.dependents) !== JSON.stringify(now.dependents)) problems.push(`${id}: dependents moved`);
    }
    expect(problems, 'the inventory is EXACT, both ways, including digests, leaves and'
      + ' dependents. A tuning value that moved without a refreeze is exactly the event this'
      + ' register exists to make visible. If the movement is legitimate, refreeze it and say'
      + ' why; do not edit this file by hand.').toEqual([]);
  });

  test('a planted value change is named by the exact-tree arm and a comment-only change is not', () => {
    const home = 'src/domain/worldPulse/npcGrowthKernel.js';
    const source = readFileSync(join(ROOT, home), 'utf8');
    const id = tuningIdFor(home, 'GROWTH_TUNING');
    const baseline = live.tables[id].spanDigest;

    const commentPlant = source.replace('export const GROWTH_TUNING', '// a note nobody signed\nexport const GROWTH_TUNING');
    inTempTree({ [home]: commentPlant }, (dir) => {
      const { tables } = discoverTables(dir, null);
      const planted = tables.find((t) => t.export === 'GROWTH_TUNING');
      expect(planted.spanDigest, 'a comment inserted above the table must leave the digest'
        + ' where it was — the line-address hazard is deliberately NOT re-planted here')
        .toBe(baseline);
    });

    const firstLeaf = /(\n\s+[A-Z][A-Z0-9_]*:\s*)(-?\d+(?:\.\d+)?)/.exec(commentPlant);
    const valuePlant = source.replace(firstLeaf[0], `${firstLeaf[1]}${Number(firstLeaf[2]) + 1}`);
    inTempTree({ [home]: valuePlant }, (dir) => {
      const { tables } = discoverTables(dir, null);
      const planted = tables.find((t) => t.export === 'GROWTH_TUNING');
      expect(planted.spanDigest, 'and a moved VALUE must move the digest').not.toBe(baseline);
    });
  });

  test('no file carries more bare decimals than the inventory banked', () => {
    const problems = [];
    for (const [file, count] of Object.entries(live.bareDecimals)) {
      const banked = committed.bareDecimals[file] ?? 0;
      if (count > banked) problems.push(`${file}: ${banked} -> ${count}`);
    }
    expect(problems, 'P3 is SHRINK-ONLY with new files at zero. A new bare decimal in the'
      + ' seeded pipeline is an unregistered dial; give it a name and a register row, or'
      + ' attribute the growth with a DECLARED_GROWTH ledger entry.').toEqual([]);
  });

  test('no file carries fewer bare decimals than the inventory banked', () => {
    const problems = [];
    for (const [file, banked] of Object.entries(committed.bareDecimals)) {
      const count = live.bareDecimals[file] ?? 0;
      if (count < banked) problems.push(`${file}: ${banked} -> ${count}`);
    }
    expect(problems, 'a WIN is unbanked. Refreeze so the ratchet holds at the better number —'
      + ' an unbanked win silently restores the headroom it just bought.').toEqual([]);
  });

  test('a planted bare decimal moves exactly one file count by exactly one', () => {
    const home = 'src/domain/worldPulse/relationshipRulesCore.js';
    const source = readFileSync(join(ROOT, home), 'utf8');
    const pristine = countBareDecimals(ROOT, [], [dirname(home)])[home];
    inTempTree({ [home]: `${source}\nconst PROBE_EXTRA_SITE = compute(0.5);\n` }, (dir) => {
      const counts = countBareDecimals(dir, [], [dirname(home)]);
      expect(counts[home], 'one planted 0.5 in code must move this file by exactly one')
        .toBe(pristine + 1);
    });
    expect(pristine, 'and the pristine count is the estate figure the charter measured'
      + ' independently, which is what makes the plant meaningful').toBe(302);
  });

  test('no file carries more unregistered named constants than the inventory banked', () => {
    const problems = [];
    for (const [file, count] of Object.entries(live.unregisteredNamed)) {
      const banked = committed.unregisteredNamed[file] ?? 0;
      if (count > banked) problems.push(`${file}: ${banked} -> ${count}`);
    }
    expect(problems, 'P2 is SHRINK-ONLY with new files at zero.').toEqual([]);
  });

  test('no file carries fewer unregistered named constants than the inventory banked', () => {
    const problems = [];
    for (const [file, banked] of Object.entries(committed.unregisteredNamed)) {
      const count = live.unregisteredNamed[file] ?? 0;
      if (count < banked) problems.push(`${file}: ${banked} -> ${count}`);
    }
    expect(problems, 'a WIN is unbanked. Refreeze so the ratchet holds at the better number.').toEqual([]);
  });

  test('the committed totals equal the committed rows', () => {
    const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
    expect(committed.totals.tables).toBe(Object.keys(committed.tables).length);
    expect(committed.totals.unregisteredNamed).toBe(sum(committed.unregisteredNamed));
    expect(committed.totals.bareDecimals).toBe(sum(committed.bareDecimals));
    expect(committed.totals.keys).toBe(Object.values(committed.tables).reduce((a, t) => a + t.keys, 0));
  });

  test('the six ceilings never rise', () => {
    const measuredNow = {
      BARE_DECIMAL_CEILING: live.totals.bareDecimals,
      UNREGISTERED_NAMED_CEILING: live.totals.unregisteredNamed,
      UNITLESS_TABLE_CEILING: Object.values(register.tables).filter((r) => r.unit === null).length,
      DECLARED_DIVERGENCE_CEILING: Object.values(register.roles ?? {}).filter((r) => r.divergence).length,
      PHANTOM_ALIAS_CEILING: Object.values(register.soakBandAliases).filter((a) => a.phantom).length,
      DECLARED_GROWTH_CEILING: Object.values(register.declaredGrowth ?? {})
        .reduce((a, population) => a + Object.keys(population).length, 0),
    };
    const problems = [];
    for (const [name, ceiling] of Object.entries(CEILINGS)) {
      if (measuredNow[name] > ceiling) problems.push(`${name}: ${ceiling} -> ${measuredNow[name]}`);
    }
    expect(problems, 'every ceiling here is a banked MEASUREMENT of what the estate already'
      + ' is, so the only movement it permits is downward. Raising one is not a lane\'s act —'
      + ' TIME IS NOT THE CONSTRAINT, and a raised ceiling is a debt taken silently.').toEqual([]);
  });

  test('the ceilings are not vacuous: two independent live figures sit at them', () => {
    expect(live.bareDecimals['src/domain/worldPulse/relationshipRulesCore.js'])
      .toBeGreaterThanOrEqual(100);
    const growth = live.tables['src/domain/worldPulse/npcGrowthKernel.js#GROWTH_TUNING'];
    expect(growth, 'GROWTH_TUNING must be seen at all').toBeTruthy();
    expect(growth.keys, 'and seen with its thirteen keys — a detector that found the table'
      + ' but read zero keys would satisfy every arm above while measuring nothing').toBe(13);
    expect(live.totals.tables).toBeGreaterThan(200);
  });

  test('every span the machine met closed, and a truncated span is refused rather than guessed', () => {
    expect(live.unclosed, 'a span the machine cannot close is not a table to guess at: the'
      + ' base has moved under the detector, and recording a truncated digest would look'
      + ' exactly like a measurement while being none.').toEqual([]);
    const truncated = tableSpan('export const BROKEN_TUNING = Object.freeze({ A: 1,\n');
    expect(truncated.ok, 'and the refusal is real, not assumed').toBe(false);
    expect(truncated.residue.length, 'with a residue that says what went wrong').toBeGreaterThan(0);
  });

  test('the finite vocabularies are closed and the schema is pinned', () => {
    expect(UNIT_VOCABULARY.length, 'fourteen unit words, closed').toBe(14);
    expect(DIVERGENCE_REASONS.length).toBe(3);
    expect(IDIOMS.length).toBe(4);
    expect(REFUSALS.length, 'eight typed refusals, closed').toBe(8);
    expect(register.unitVocabulary, 'the register carries the same closed list the lib does —'
      + ' two spellings of one vocabulary is how a unit-less field gets a different unit at'
      + ' every consumer').toEqual([...UNIT_VOCABULARY]);
    expect(TREES_P1).toEqual(['src']);
    expect(TREES_P2P3).toEqual(['src/domain', 'src/generators']);
  });
});

/* ================================================================= describe D */

describe('tuning register — units and bands are finite', () => {
  test('every declared unit is a word of the closed vocabulary', () => {
    const problems = [];
    for (const [id, row] of Object.entries(register.tables)) {
      if (row.unit === null) continue;
      for (const [key, unit] of Object.entries(row.unit)) {
        if (!UNIT_VOCABULARY.includes(unit)) problems.push(`${id}.${key}: '${unit}'`);
      }
    }
    for (const [name, role] of Object.entries(register.roles)) {
      if (role.unit !== null && !UNIT_VOCABULARY.includes(role.unit)) problems.push(`role ${name}: '${role.unit}'`);
    }
    expect(problems, 'FINITE SEMANTICS: fourteen words, closed. A free-text unit is how a'
      + " unit-less field acquires a different unit at every consumer, and 'weeks_ish' would"
      + ' read as a unit right up until two lanes disagreed about what it meant.').toEqual([]);
  });

  test('a unit outside the vocabulary is refused rather than coerced', () => {
    const forged = { ALPHA: 'weeks_ish' };
    const outside = Object.entries(forged).filter(([, unit]) => !UNIT_VOCABULARY.includes(unit));
    expect(outside.map(([key]) => key), 'the plant must be named').toEqual(['ALPHA']);
    // anchored: a real word from the same list passes the same predicate one line below, so
    // an emptied vocabulary could not produce both answers.
    expect(UNIT_VOCABULARY.includes('weeks')).toBe(true);
  });

  test('units are all-or-none per table', () => {
    const problems = [];
    for (const [id, row] of Object.entries(register.tables)) {
      if (row.unit === null) continue;
      const measured = live.tables[id];
      if (!measured) { problems.push(`${id}: declared units for a table that is not measured`); continue; }
      const keys = Object.keys(measured.leaves);
      const declared = Object.keys(row.unit);
      for (const key of keys) if (!declared.includes(key)) problems.push(`${id}: ${key} has no unit`);
      for (const key of declared) if (!keys.includes(key)) problems.push(`${id}: ${key} is a unit for no leaf`);
    }
    expect(problems, 'a HALF-united table is worse than an un-united one: it reads as enriched'
      + ' while leaving the keys nobody thought about silently unlabelled.').toEqual([]);
  });

  test('every declared band contains the live value', () => {
    const problems = [];
    let banded = 0;
    for (const [id, row] of Object.entries(register.tables)) {
      if (row.band === null) continue;
      banded += 1;
      const measured = live.tables[id];
      for (const [key, band] of Object.entries(row.band)) {
        const value = measured?.leaves?.[key];
        if (typeof value !== 'number') { problems.push(`${id}.${key}: banded but not a live number`); continue; }
        if (value < band[0] || value > band[1]) problems.push(`${id}.${key}: ${value} outside [${band[0]}, ${band[1]}]`);
      }
    }
    expect(problems, 'a band that does not contain the value it governs is not a band').toEqual([]);
    // ⚠ VACUOUS TODAY, AND SAID RATHER THAN HIDDEN: no row carries a band, because a band is a
    // claim about how far a value may travel and that is the SITTING'S business, not a lane's.
    // The arm is armed now so the first band ever written is checked by the run that writes it.
    expect(banded, 'no band is declared before the sitting').toBe(0);
    const contains = (band, value) => value >= band[0] && value <= band[1];
    expect(contains([0.1, 0.2], 0.05), 'and the predicate itself is proven by fixture, so the'
      + ' vacuity is in the DATA and never in the check').toBe(false);
    expect(contains([0.1, 0.2], 0.15)).toBe(true);
  });

  test('a unit-less table is not signed', () => {
    const problems = [];
    for (const [id, row] of Object.entries(register.tables)) {
      if (row.status === 'signed' && row.unit === null) problems.push(id);
    }
    expect(problems, 'signing a table whose keys carry no unit signs a number whose meaning'
      + ' nobody wrote down. The owner may sign a value; nobody may sign an unlabelled one.').toEqual([]);
  });

  test('the unit-less count only shrinks', () => {
    const unitless = Object.values(register.tables).filter((row) => row.unit === null).length;
    expect(unitless, 'enrichment is measurable rather than aspirational: a draft label on 220'
      + ' tables is truer than silence, and this ceiling is the only thing that makes the'
      + ' remaining work visible').toBeLessThanOrEqual(CEILINGS.UNITLESS_TABLE_CEILING);
    const united = Object.keys(register.tables).length - unitless;
    expect(united, 'and the desk roster enriched at this car is not zero').toBeGreaterThanOrEqual(4);
  });
});

/* ================================================================= describe E */

describe('tuning register — one value, one home', () => {
  const leafValue = (member) => {
    const hash = member.indexOf('#');
    const rest = member.slice(hash + 1);
    const dot = rest.indexOf('.');
    const id = `${member.slice(0, hash)}#${rest.slice(0, dot)}`;
    return live.tables[id]?.leaves?.[rest.slice(dot + 1)];
  };

  test('every role member resolves to a measured leaf', () => {
    const problems = [];
    for (const [name, role] of Object.entries(register.roles)) {
      if (role.members.length === 0) problems.push(`${name}: a role with no members claims nothing`);
      for (const member of role.members) {
        if (leafValue(member) === undefined && !live.tables[member]) {
          problems.push(`${name}: ${member} resolves to no measured leaf or table`);
        }
      }
    }
    expect(problems, 'THE CITATION LAW: a role asserts that each member exists at that exact'
      + ' path. Members are MEASURED by leaf name rather than typed by hand, so a role cannot'
      + ' quietly stop covering a site — but the assertion is still checked.').toEqual([]);
  });

  test('a member whose table carries units carries the role unit', () => {
    const problems = [];
    let checked = 0;
    for (const [name, role] of Object.entries(register.roles)) {
      if (role.unit === null) continue;
      for (const member of role.members) {
        const hash = member.indexOf('#');
        const rest = member.slice(hash + 1);
        const dot = rest.indexOf('.');
        if (dot < 0) continue;
        const id = `${member.slice(0, hash)}#${rest.slice(0, dot)}`;
        const declared = register.tables[id]?.unit;
        if (!declared) continue;
        checked += 1;
        const unit = declared[rest.slice(dot + 1)];
        if (unit !== role.unit) problems.push(`${name}: ${member} is '${unit}', the role is '${role.unit}'`);
      }
    }
    expect(problems, 'one role, one unit. Where a table has been enriched the two readings must'
      + ' agree, and where it has not this arm says nothing rather than guessing.').toEqual([]);
    expect(checked, 'and the arm is not vacuous: the enriched desk roster puts real members'
      + ' under it').toBeGreaterThan(0);
  });

  test('one value, or a typed divergence', () => {
    const problems = [];
    for (const [name, role] of Object.entries(register.roles)) {
      const values = role.members.map(leafValue).filter((value) => typeof value === 'number');
      const distinct = [...new Set(values)];
      if (distinct.length <= 1) continue;
      if (!role.divergence) {
        problems.push(`${name}: ${distinct.length} distinct values ${JSON.stringify(distinct)} and no typed divergence`);
        continue;
      }
      if (!DIVERGENCE_REASONS.includes(role.divergence.reason)) {
        problems.push(`${name}: divergence reason '${role.divergence.reason}' is outside the closed set`);
      }
      if (!/^TR-\d|^\u00a7\d/.test(String(role.divergence.odqRow ?? ''))) {
        problems.push(`${name}: the divergence cites no owner row`);
      }
    }
    expect(problems, 'two members of one role holding different values is either deliberate, a'
      + ' unit difference, or drift — and saying WHICH is the whole point. An untyped'
      + ' divergence is a value disagreement nobody has looked at.').toEqual([]);
  });

  test('a planted role member with a foreign value is named unless the divergence is typed', () => {
    const untyped = { unit: 'weeks', canonical: null, members: register.roles.cooldown_weeks.members, divergence: null };
    const values = untyped.members.map(leafValue).filter((value) => typeof value === 'number');
    expect([...new Set(values)].length, 'the fixture role really does span two values').toBe(2);
    expect(untyped.divergence, 'and stripped of its typing it is exactly what the arm above'
      + ' convicts').toBeNull();
    // anchored: the same members WITH their typed divergence are admitted by the live arm
    // above, so this is a claim about the typing and not about the members.
    expect(register.roles.cooldown_weeks.divergence.reason).toBe('distinct-by-design');
  });

  test('the homonym roles are split by unit rather than reconciled by value', () => {
    const pairs = [
      ['exodus_floor__fraction', 'exodus_floor__headcount'],
      ['score_max__points', 'score_max__probability'],
      ['cap__share', 'cap__count'],
    ];
    const problems = [];
    for (const [a, b] of pairs) {
      const left = register.roles[a];
      const right = register.roles[b];
      if (!left || !right) { problems.push(`${a}/${b}: one half of the homonym is missing`); continue; }
      if (left.unit === right.unit) problems.push(`${a}/${b}: split into two roles but share a unit`);
      const overlap = left.members.filter((member) => right.members.includes(member));
      if (overlap.length) problems.push(`${a}/${b}: members appear on both sides: ${overlap.join(', ')}`);
    }
    expect(problems, 'EXODUS_FLOOR holds 0.04 in one home and 300 in another. That is not a'
      + ' divergence to reconcile — it is one NAME doing two jobs, a fraction and a headcount,'
      + ' and merging them would ask the sitting to rule on a disagreement that never existed.'
      + ' FOLD 25: a unit-less field gets a different unit at every consumer.').toEqual([]);
  });

  test('the divergence count only shrinks', () => {
    const divergent = Object.values(register.roles).filter((role) => role.divergence).length;
    expect(divergent, 'a resolved divergence is banked so it cannot silently come back')
      .toBeLessThanOrEqual(CEILINGS.DECLARED_DIVERGENCE_CEILING);
    expect(divergent, 'and the ceiling is not vacuous — real divergences sit under it')
      .toBeGreaterThan(0);
  });

  test('a signed table computed from another table cannot outrun its source', () => {
    const problems = [];
    for (const [id, row] of Object.entries(register.tables)) {
      if (row.status !== 'signed') continue;
      const measured = live.tables[id];
      for (const [key, value] of Object.entries(measured?.leaves ?? {})) {
        if (!value || typeof value !== 'object' || typeof value.expr !== 'string') continue;
        const sources = Object.entries(register.tables)
          .filter(([otherId, other]) => otherId !== id && live.tables[otherId]?.leaves?.[value.expr] !== undefined && other.status !== 'signed');
        for (const [otherId] of sources) problems.push(`${id}.${key} is computed from unsigned ${otherId}`);
      }
    }
    expect(problems, 'signing a table whose value is computed from an UNSIGNED source signs a'
      + ' number that can still move underneath it. Vacuous today because nothing is signed —'
      + ' and armed now so it is not written after the first signature makes it matter.').toEqual([]);
    expect(Object.values(register.tables).every((row) => row.status === 'draft'),
      'and the vacuity is in the data: every row is draft').toBe(true);
  });
});


/* ================================================================= describe I */

describe('tuning register — the signing door, rehearsed', () => {
  const RECORDS_DIR = 'docs/tuning-signatures';
  const TEMPLATE_REL = `${RECORDS_DIR}/_TEMPLATE.json`;

  /** A fixture register and inventory, so the rehearsal never touches the estate's own. */
  const fixture = () => {
    const idA = 'src/domain/fixture/a.js#A_TUNING';
    const idB = 'src/domain/fixture/b.js#B_TUNING';
    const idC = 'src/domain/fixture/c.js#C_TUNING';
    const idModule = 'src/domain/townCartography/cartographyTuning.js#MAP_TUNING';
    return {
      idA, idB, idC, idModule,
      register: {
        registerVersion: 1,
        signatureVersion: 0,
        signatures: [],
        unitVocabulary: [...UNIT_VOCABULARY],
        homes: [],
        moduleSide: ['src/domain/townCartography/'],
        tables: {
          [idA]: { role: null, status: 'draft', signedAt: null, unit: { X: 'ticks' }, band: null, note: '' },
          [idB]: { role: null, status: 'draft', signedAt: null, unit: { Y: 'weeks' }, band: null, note: '' },
          [idC]: { role: null, status: 'draft', signedAt: null, unit: null, band: null, note: '' },
          [idModule]: { role: null, status: 'draft', signedAt: null, unit: { Z: 'count' }, band: null, note: '' },
        },
        roles: {},
        soakBandAliases: {},
      },
      inventory: {
        tables: {
          [idA]: { keys: 1, spanDigest: 'a'.repeat(64), leaves: { X: 1 }, dependents: [], namedDependents: [] },
          [idB]: { keys: 1, spanDigest: 'b'.repeat(64), leaves: { Y: 2 }, dependents: [], namedDependents: [] },
          [idC]: { keys: 1, spanDigest: 'c'.repeat(64), leaves: { Z: 3 }, dependents: [], namedDependents: [] },
          [idModule]: { keys: 1, spanDigest: 'd'.repeat(64), leaves: { Z: 4 }, dependents: [], namedDependents: [] },
        },
      },
    };
  };
  const recordFor = (ids, version = 1) => ({
    ownerWords: 'these are the values I want the world to start from',
    ownerDate: '2026-09-30',
    odqRow: '\u00a7884.1',
    seat: 'owner',
    version,
    ids,
    note: '',
  });

  test('a version-one record signs exactly the ids it names and records their digests', () => {
    const { register: base, inventory, idA, idB, idC } = fixture();
    const applied = applySigningRecord({ register: base, inventory, record: recordFor([idA, idB]) });
    expect(applied.ok, `the record must be admitted: ${applied.detail}`).toBe(true);
    const next = applied.register;
    expect(next.signatureVersion).toBe(1);
    expect(next.tables[idA].status).toBe('signed');
    expect(next.tables[idB].status).toBe('signed');
    expect(next.tables[idC].status, 'and an id the record does NOT name stays draft — a record'
      + ' signs exactly what it names and never one more').toBe('draft');
    expect(next.signatures[0].digests[idA], 'the live digest is recorded AT the moment of'
      + ' signing, which is what freezes the value: a later retune moves it, and moving a'
      + ' signed digest is version N+1 by construction').toBe('a'.repeat(64));
    expect(next.signatures[0].ids).toEqual([idA, idB]);
    expect(next.signatures[0].goldenShiftRecord, 'and before the freeze it names no golden'
      + ' shift record').toBeNull();
    expect(base.tables[idA].status, 'the ORIGINAL register is untouched — the path is a pure'
      + ' function returning a new object, which is how all-or-none stops being a promise and'
      + ' becomes a property: there is no partial state it could leave behind').toBe('draft');
  });

  test('a record naming a unit-less table is refused whole', () => {
    const { register: base, inventory, idA, idC } = fixture();
    const applied = applySigningRecord({ register: base, inventory, record: recordFor([idA, idC]) });
    expect(applied.refusal, 'signing a value whose meaning nobody wrote down signs a number,'
      + ' not a decision').toBe('ID_NOT_IN_RECORD');
    expect(applied.register, 'and the WHOLE write is refused, not the offending id alone —'
      + ' otherwise a record could half-sign and the owner would have approved something'
      + ' other than what they read').toBeNull();
    // anchored: the same record without the unit-less id is admitted one line below, so this
    // is a claim about the unit and not about the record's shape.
    expect(applySigningRecord({ register: base, inventory, record: recordFor([idA]) }).ok).toBe(true);
  });

  test('a record naming a module-side id is refused', () => {
    const { register: base, inventory, idModule } = fixture();
    const applied = applySigningRecord({ register: base, inventory, record: recordFor([idModule]) });
    expect(applied.refusal, 'the owner ruled that no map constant is launch tuning. The'
      + ' register may INDEX them by totality; the sitting does not sign them.').toBe('ID_NOT_IN_RECORD');
    expect(applied.detail).toContain('module-side');
  });

  test('versions are dense from one, and version two before version one is refused', () => {
    const { register: base, inventory, idA, idB } = fixture();
    const early = applySigningRecord({ register: base, inventory, record: recordFor([idA], 2) });
    expect(early.refusal, 'a signature cannot sit in a gap').toBe('RECORD_VERSION_MISMATCH');
    const first = applySigningRecord({ register: base, inventory, record: recordFor([idA], 1) });
    expect(first.ok).toBe(true);
    const again = applySigningRecord({ register: first.register, inventory, record: recordFor([idB], 1) });
    expect(again.refusal, 'nor may one version be written twice').toBe('RECORD_VERSION_MISMATCH');
    const second = applySigningRecord({ register: first.register, inventory, record: recordFor([idB], 2) });
    expect(second.ok, 'and the next dense version is admitted').toBe(true);
    expect(second.register.signatures.map((entry) => entry.version)).toEqual([1, 2]);
  });

  test('a signed table whose digest has moved is caught by the register arm', () => {
    const { register: base, inventory, idA } = fixture();
    const signed = applySigningRecord({ register: base, inventory, record: recordFor([idA]) }).register;
    const moved = { tables: { ...inventory.tables, [idA]: { ...inventory.tables[idA], spanDigest: 'e'.repeat(64) } } };
    const problems = [];
    for (const [id, row] of Object.entries(signed.tables)) {
      if (row.status !== 'signed') continue;
      const recorded = signed.signatures[row.signedAt - 1]?.digests?.[id];
      if (recorded !== moved.tables[id].spanDigest) problems.push(id);
    }
    expect(problems, 'a signed value that moved without a new version is exactly the event'
      + ' THE PROMISE forbids').toEqual([idA]);
    // anchored: the UNMOVED inventory satisfies the same comparison one line below.
    expect(signed.signatures[0].digests[idA]).toBe(inventory.tables[idA].spanDigest);
  });

  test('the blank template is a live subject and is refused', () => {
    const template = JSON.parse(readFileSync(join(ROOT, TEMPLATE_REL), 'utf8'));
    const malformed = signingRecordMalformations(template);
    expect(malformed, 'the template ships BLANK on purpose so this arm always has something'
      + ' real to refuse. A template that validated would be a signed record waiting to'
      + ' happen.').toBeTruthy();
    expect(Object.keys(template).sort(), 'and it carries every field a record needs').toEqual(
      ['ids', 'note', 'odqRow', 'ownerDate', 'ownerWords', 'seat', 'version'],
    );
  });

  test('the signing record home exists and states the ritual it documents', () => {
    const readme = readFileSync(join(ROOT, `${RECORDS_DIR}/README.md`), 'utf8');
    expect(readme, 'the record home documents its own ritual').toContain('TUNING_SIGNATURE_RECORD');
    expect(readme, 'and says plainly whose the values are').toContain("the owner's");
    expect(readme, 'and it is NOT docs/shift-records/, which the golden door forbids before'
      + ' the freeze').toContain('docs/shift-records/');
  });

  /**
   * ⭐⭐ ARM 42 — THE `lit ⇒ DECLARED` LAW (CAPACITY C1).
   *
   * ⚠ IT IS NOT `lit ⇒ signed`, AND THE INVERSION IS THE OWNER'S WORD RATHER THAN A
   * RELAXATION. The sibling faith and density surfaces were built sign-then-light. The
   * owner's word of 2026-09-02 lights every dark door BEFORE the exhaustive review, and
   * signs values LAST, so a `lit ⇒ signed` arm would red the lighting wave itself. What
   * replaces it is not nothing: a preset may light the demographic term only in the same
   * commit that writes down WHO lit it, WHEN, under WHICH row, and WHICH presets moved.
   * A flip with no record is the silent tuning act this walker exists to refuse.
   *
   * BOTH READS GO THROUGH `codeOnly`, and that is measured rather than hoped: the preset
   * file carries a docblock that names the flag and spells out the flip, and the rates
   * file's own `ritual` STRING spells `lit {odqRow, litOn, presets}` in prose. A raw
   * text scan would read either as a lit world. That is the §880.7 class exactly, and
   * the two negative controls below drive it.
   */
  test('ARM 42 — a lit demographics preset requires a lighting record in the same surface', () => {
    const PRESETS_REL = 'src/domain/worldPulse/simulationRules.js';
    const RATES_REL = 'src/domain/worldPulse/demographicsRates.js';

    /** How many shipped presets light the term, counted in CODE only.
     *  @param {string} src @returns {number} */
    const litPresetCount = (src) => (codeOnly(src).match(/demographicsEnabled:\s*true/g) ?? []).length;

    /** The state of the signature's `lit` word, read from CODE only by brace-matching the
     *  record's own span so a `lit:` written anywhere else in the file cannot answer for it.
     *  @param {string} src @returns {'ABSENT'|'DARK'|'RECORD'} */
    const litWordIn = (src) => {
      const code = codeOnly(src);
      const at = code.indexOf('const DEMOGRAPHIC_TUNING_SIGNATURE');
      if (at < 0) return 'ABSENT';
      const open = code.indexOf('{', at);
      if (open < 0) return 'ABSENT';
      let depth = 0;
      let span = '';
      for (let i = open; i < code.length; i += 1) {
        if (code[i] === '{') depth += 1;
        else if (code[i] === '}') {
          depth -= 1;
          if (depth === 0) { span = code.slice(open, i + 1); break; }
        }
      }
      const found = span.match(/lit:\s*(null|\{)/);
      if (found == null) return 'ABSENT';
      return found[1] === 'null' ? 'DARK' : 'RECORD';
    };

    const presets = readFileSync(join(ROOT, PRESETS_REL), 'utf8');
    const rates = readFileSync(join(ROOT, RATES_REL), 'utf8');
    const lit = litPresetCount(presets);
    const word = litWordIn(rates);

    // THE SURFACE EXISTS AT ALL. Without this the law below could pass by absence.
    expect(word, `${RATES_REL} must carry DEMOGRAPHIC_TUNING_SIGNATURE with a lit word`).not.toBe('ABSENT');
    // THE LAW.
    if (lit > 0) {
      expect(word, `${lit} shipped preset(s) light demographicsEnabled, so the signature`
        + ' surface owes a lighting record {odqRow, litOn, presets} written in the SAME'
        + ' commit as the flips').toBe('RECORD');
    }
    // TODAY, MEASURED: the term is dark in every shipped preset and the word is null.
    // ⚠ BOTH HALVES MOVE IN THE LIGHTING WAVE'S OWN COMMIT. That is the ceremony.
    expect(lit).toBe(0);
    expect(word).toBe('DARK');

    // ── POSITIVE CONTROL: a flipped preset with no record IS convicted ──
    const scratchPreset = 'export const SIMULATION_RULE_PRESETS = Object.freeze({\n'
      + '  realistic_regional: preset("x", "X", { demographicsEnabled: true }),\n});\n';
    const scratchRatesDark = 'export const DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({ signed: false, lit: null });\n';
    expect(litPresetCount(scratchPreset)).toBe(1);
    expect(litWordIn(scratchRatesDark)).toBe('DARK');
    // the pair the law refuses: lit above zero while the word is still DARK
    expect(litPresetCount(scratchPreset) > 0 && litWordIn(scratchRatesDark) !== 'RECORD').toBe(true);

    // ── and the pair it ACCEPTS, so the law is not simply always-refuse ──
    const scratchRatesLit = 'export const DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({\n'
      + '  signed: false,\n  lit: { odqRow: "CAP-2", litOn: "2026-09-09", presets: ["realistic_regional"] },\n});\n';
    expect(litWordIn(scratchRatesLit)).toBe('RECORD');

    // ── NEGATIVE CONTROL 1: a DOCBLOCK naming a lit preset is not a lit preset ──
    const commentedPreset = '/**\n * LIGHTING IT means writing demographicsEnabled: true here.\n */\n'
      + 'export const SIMULATION_RULE_PRESETS = Object.freeze({ realistic_regional: preset("x", "X", {}) });\n';
    expect(litPresetCount(commentedPreset), 'a docblock spelling the flip is not the flip').toBe(0);
    // and a STRING spelling it is not the flip either
    expect(litPresetCount('const ritual = "flip demographicsEnabled: true in every preset";\n')).toBe(0);

    // ── NEGATIVE CONTROL 2: a DOCBLOCK or STRING spelling `lit:` is not a record ──
    const commentedRates = 'export const DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({\n'
      + '  signed: false,\n  // lit: { odqRow: "CAP-2" } would go here\n  lit: null,\n});\n';
    expect(litWordIn(commentedRates), 'a commented-out record is not a record').toBe('DARK');
    const stringyRates = 'export const DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({\n'
      + '  signed: false,\n  lit: null,\n  ritual: "write lit: { odqRow } here",\n});\n';
    expect(litWordIn(stringyRates), 'a ritual string spelling the record is not the record').toBe('DARK');
  });

  test('the signing record home makes no enforcement claim without its tag', () => {
    // ⟦A29 E13⟧ tests/docs/enforcement-claims.test.js scans every root *.md and docs/**/*.md
    // for this vocabulary and requires an @enforced-by tag within three lines. Re-executed
    // here so the doc scanner's verdict is not something this car merely hopes for.
    const CLAIM_RE = /promoted (?:from warn )?to (?:ERROR|error)|burned (?:down )?to zero|0 problems|machine-enforced|the gate now (?:covers|type-checks)|fails the gate|fails the build|zero violations/;
    const lines = readFileSync(join(ROOT, `${RECORDS_DIR}/README.md`), 'utf8').split('\n');
    const problems = [];
    lines.forEach((line, index) => {
      if (!CLAIM_RE.test(line)) return;
      const window = lines.slice(Math.max(0, index - 3), index + 4).join('\n');
      if (!/@enforced-by/.test(window)) problems.push(`line ${index + 1}: ${line.trim()}`);
    });
    expect(problems, 'a completeness claim with no enforcing test beside it is a promise in'
      + ' prose, and this estate scans for exactly that vocabulary').toEqual([]);
    // anchored: the regex is live — it matches a planted phrase on the line below.
    expect(CLAIM_RE.test('this is machine-enforced')).toBe(true);
  });

  test('a signature may name a golden shift record only while the golden register is frozen, and then the record must exist', () => {
    // THE GENESIS FREEZE (2026-09-16, `Owner-Signed: §901`): tests/fixtures/.golden-freeze-register.json
    // carries `frozenAt`, so the fail-closed arm this test used to be ("unfrozen, therefore no
    // signature may name a record") flipped to its live form: a named record must be a real
    // signed record on disk. The unfrozen branch is kept so a tree without the register still
    // fails closed.
    const registerPath = join(ROOT, 'tests/fixtures/.golden-freeze-register.json');
    const frozenAt = existsSync(registerPath)
      ? JSON.parse(readFileSync(registerPath, 'utf8')).frozenAt
      : null;
    const named = register.signatures.filter((entry) => entry.goldenShiftRecord != null);
    if (!frozenAt) {
      expect(named, 'the golden register is UNFROZEN, so no signature may name a golden shift record').toEqual([]);
      return;
    }
    expect(typeof frozenAt, 'a frozen register stamps frozenAt').toBe('string');
    for (const entry of named) {
      expect(String(entry.goldenShiftRecord).startsWith('docs/shift-records/'),
        `signatures[${entry.version}] names a record outside docs/shift-records/`).toBe(true);
      expect(existsSync(join(ROOT, entry.goldenShiftRecord)),
        `signatures[${entry.version}] names ${entry.goldenShiftRecord}, which is not on disk`).toBe(true);
    }
  });

  test('a post-freeze re-record that does not cite a tuning version may not coincide with a moved signed digest', () => {
    const { register: base, inventory, idA } = fixture();
    const signed = applySigningRecord({ register: base, inventory, record: recordFor([idA]) }).register;
    const unrelated = { cause: 'golden corpus widening', odqRow: '\u00a7759.4' };
    expect(TUNING_SHIFT_CAUSE_RE.test(unrelated.cause), 'the re-record cites no tuning version').toBe(false);
    const movedDigest = 'e'.repeat(64);
    const signedDigest = signed.signatures[0].digests[idA];
    expect(movedDigest, 'so a signed digest that moved beside it is TWO causes wearing one'
      + ' commit. The digest arm already reds; this arm names the coupling so the two reds'
      + ' read as one cause rather than as a puzzle.').not.toBe(signedDigest);
  });

  test('a demographics signature is refused unless its cited receipt was measured under those values', () => {
    // ⟦A43 O10⟧ CAPACITY's rider. The receipt surface lands with CAPACITY C1, so the coupling
    // is proven here by fixture and starts reading real receipts when that car arrives.
    const idDemo = 'src/domain/worldPulse/demographicsRates.js#DEMO_TUNING';
    const signatureAtV1 = { version: 1, ids: [idDemo], digests: { [idDemo]: 'a'.repeat(64) } };
    const receiptMeasuredUnderV0 = { tuningRegister: { signatureVersion: 0, declaredSha256: 'f'.repeat(64) } };
    const covers = (receipt, signature) => receipt.tuningRegister.signatureVersion >= signature.version;
    expect(covers(receiptMeasuredUnderV0, signatureAtV1), 'a receipt measured under v0 draft'
      + ' values cannot vouch for ids retuned at v1 — the signed tree would not be the tree the'
      + ' soak plateaued on').toBe(false);
    // anchored: a receipt measured under the same version does cover it, so the predicate is
    // not simply always false.
    expect(covers({ tuningRegister: { signatureVersion: 1 } }, signatureAtV1)).toBe(true);
  });
});

/* ================================================================= describe J */

describe('tuning register — the desk sheet', () => {
  test('the desk sheet excludes module-side ids and counts them on their own line', () => {
    const sheet = deskSheet(register, live, { roster: [] });
    const moduleSide = register.moduleSide ?? [];
    const leaked = sheet.rows.filter((row) => moduleSide.some((prefix) => row.id.startsWith(prefix)));
    expect(leaked.map((row) => row.id), 'the owner ruled no map leg in launch tuning at all.'
      + ' The register may index them; the desk may not carry them.').toEqual([]);
    expect(sheet.moduleSideExcluded, 'and the exclusion is COUNTED rather than silent — a'
      + ' number the sitting can ask about is not the same as an absence').toBeGreaterThan(0);
    expect(sheet.rows.length + sheet.moduleSideExcluded, 'and the two halves close over the'
      + ' whole register').toBe(Object.keys(register.tables).length);
  });

  test('the desk sheet puts the roster first and the united tables before the rest', () => {
    const roster = ['src/domain/worldPulse/intervalWeeks.js#INTERVAL_WEEKS'];
    const sheet = deskSheet(register, live, { roster });
    expect(sheet.rows[0].id, 'the sitting works down from what it came to decide, not'
      + ' alphabetically').toBe(roster[0]);
    // ROSTER RANK OUTRANKS UNIT RANK, and that ordering is deliberate: a rostered table the
    // sitting came to decide belongs at the top whether or not anyone has labelled it yet.
    // The unit ordering therefore governs the rows BELOW the roster, and asserting it over
    // the whole sheet was this arm's own error — the roster row here is unit-less.
    expect(sheet.rows[0].unit, 'the fixture roster row is genuinely unit-less, so this is not'
      + ' a vacuous ordering claim').toBeNull();
    const rest = sheet.rows.filter((row) => !roster.includes(row.id));
    const firstUnitless = rest.findIndex((row) => row.unit === null);
    const lastUnited = rest.map((row) => row.unit !== null).lastIndexOf(true);
    expect(lastUnited, 'and below the roster every united table sits above every unit-less one')
      .toBeLessThan(firstUnitless);
  });

  test('every desk row carries what a signature needs and nothing that proposes one', () => {
    const sheet = deskSheet(register, live, { roster: [] });
    const problems = [];
    for (const row of sheet.rows) {
      for (const field of ['id', 'status', 'unit', 'band', 'keys', 'values', 'dependents', 'roles']) {
        if (!(field in row)) problems.push(`${row.id}: missing ${field}`);
      }
      if (row.status !== 'draft' && row.status !== 'signed') problems.push(`${row.id}: status '${row.status}'`);
      if ('recommended' in row || 'suggested' in row || 'proposed' in row) {
        problems.push(`${row.id}: the desk sheet carries a proposal, and proposing a value is not this instrument's act`);
      }
    }
    expect(problems, 'THE NEWS ADDRESS LAW: every row prints its id, its state word and its'
      + ' role. And it prints no recommendation — the values are the owner\'s.').toEqual([]);
  });
});

/* ================================================================= describe F */

describe('tuning register — the signature is a record, not a word', () => {
  test('the register is unsigned today: signatureVersion 0 and every table draft', () => {
    expect(register.signatureVersion, 'the estate is UNSIGNED until the owner signs it at the'
      + ' tuning sitting. This arm is the dormancy bit for that claim, and it is a BIT claim:'
      + ' no lane may write a signature, and this reds the moment one does.').toBe(0);
    expect(register.signatures, 'and no signature entry exists yet').toEqual([]);
    const signed = Object.entries(register.tables).filter(([, row]) => row.status !== 'draft');
    expect(signed.map(([id]) => id), 'every declared row is DRAFT. A row that is not draft'
      + ' before the sitting was written by something that had no authority to write it.').toEqual([]);
  });

  test('the signature state of an unregistered id fails closed to draft', () => {
    const state = signatureStateOf(register, 'src/domain/nowhere.js#ABSENT_TUNING');
    expect(state.status, 'an id with no row must read draft, never signed — a missing row'
      + ' can never be mistaken for an owner\'s approval').toBe('draft');
    expect(state.signedAt).toBeNull();
    const real = signatureStateOf(register, Object.keys(register.tables)[0]);
    // anchored: a real registered id resolves through the same call on the line above, so a
    // function that returned `draft` for everything unconditionally could not pass both.
    expect(real.version).toBe(0);
  });

  test('the three signature records read unsigned while their tables are draft', () => {
    const problems = [];
    const records = [
      ['src/domain/density/densityBands.js', 'REGISTER_VII_SIGNATURE'],
      ['src/domain/worldPulse/faithTuningSurface.js', 'FAITH_TUNING_SIGNATURE'],
    ];
    for (const [file, name] of records) {
      const source = codeOnly(readFileSync(join(ROOT, file), 'utf8'));
      const match = new RegExp(`const\\s+${name}\\s*=\\s*Object\\.freeze\\(\\{([^}]*)\\}`).exec(source);
      if (!match) { problems.push(`${file}#${name}: not found`); continue; }
      if (!/signed:\s*false/.test(match[1])) problems.push(`${file}#${name}: signed is not false`);
    }
    expect(problems, 'the record and the register row are two views of ONE act. A record'
      + ' reading signed while every register row is draft would mean the estate was signed'
      + ' somewhere this walker cannot see.').toEqual([]);
    // DEMOGRAPHIC_TUNING_SIGNATURE is CAPACITY C1's and is not in this tree yet; the roster
    // gains it when that car lands. Its absence is measured, not assumed.
    expect(existsSync(join(ROOT, 'src/domain/worldPulse/demographicsRates.js'))).toBe(true);
  });

  test('no golden shift record claims a tuning version the register never signed', () => {
    // ⚠ THE GOLDEN DOOR IS NOT IN THIS TREE. Its register, its door helper and its
    // `docs/shift-records/` home all live in the GOLDEN lane and land with it, so the LIVE
    // branch of this arm asserts the fail-closed state — no record directory, no signature
    // naming one — and the CONVERSE is proven by fixture below rather than left owed to a
    // tree that does not exist yet. When GOLDEN lands, the live branch starts reading real
    // records with no edit here.
    const recordsDir = join(ROOT, 'docs/shift-records');
    const problems = [];
    if (existsSync(recordsDir)) {
      for (const entry of readdirSync(recordsDir)) {
        if (!entry.endsWith('.json') || entry.startsWith('_')) continue;
        const record = JSON.parse(readFileSync(join(recordsDir, entry), 'utf8'));
        const parsed = TUNING_SHIFT_CAUSE_RE.exec(String(record.cause ?? ''));
        if (!parsed) continue;
        const version = Number(parsed[1]);
        const signature = register.signatures[version - 1];
        if (!signature) { problems.push(`${entry}: cites tuning-register v${version}; signatures[] tops at ${register.signatures.length}`); continue; }
        if (signature.odqRow !== record.odqRow) problems.push(`${entry}: odqRow disagrees with signatures[${version}]`);
        if (signature.goldenShiftRecord !== `docs/shift-records/${entry}`) {
          problems.push(`${entry}: signatures[${version}].goldenShiftRecord does not name it back`);
        }
      }
    }
    expect(problems, 'THE CONVERSE, and it is the half that actually bites: the golden door'
      + ' verifies FORM only and knows nothing of signatures[], so a record whose cause reads'
      + ' "tuning-register v2 signed §NNN" can be written and consumed while signatures[] tops'
      + ' at v1 — and the golden would move under a tuning cause the register never signed.').toEqual([]);
    // Since the genesis freeze (2026-09-16) a signature MAY name a record; each named one must
    // point at a file the loop above has already reconciled or that exists on disk.
    for (const entry of register.signatures) {
      if (entry.goldenShiftRecord == null) continue;
      expect(existsSync(join(ROOT, entry.goldenShiftRecord)),
        `signatures[${entry.version}].goldenShiftRecord names a record that is not on disk`).toBe(true);
    }
  });

  test('the converse arm convicts a fixture record that outruns the signature ledger', () => {
    const registerAtV1 = {
      ...register,
      signatureVersion: 1,
      signatures: [{ version: 1, odqRow: '§884.1', goldenShiftRecord: null }],
    };
    const forged = { cause: 'tuning-register v2 signed §884.2', odqRow: '§884.2' };
    const parsed = TUNING_SHIFT_CAUSE_RE.exec(forged.cause);
    const version = Number(parsed[1]);
    expect(registerAtV1.signatures[version - 1], 'the forged record cites v2 while the ledger'
      + ' tops at v1, so the lookup must come back empty — that emptiness IS the conviction')
      .toBeUndefined();
    // anchored: the same lookup for v1 on the line below resolves, so an arm that found
    // nothing for every version could not distinguish the forgery from an honest record.
    expect(registerAtV1.signatures[0].odqRow).toBe('§884.1');
  });

  test('the tuning shift cause is read from both directions by one expression', () => {
    const good = 'tuning-register v2 signed §884.1';
    const parsed = TUNING_SHIFT_CAUSE_RE.exec(good);
    expect(parsed, 'the cause the door carries must parse').toBeTruthy();
    expect(parsed[1], 'the version is the hook the converse arm reads back').toBe('2');
    expect(parsed[2]).toBe('§884.1');
    // anchored: the well-formed cause on the line above parses, so a regex that had been
    // emptied to match nothing could not satisfy both this and that.
    expect(TUNING_SHIFT_CAUSE_RE.test('golden corpus widening'), 'and an unrelated cause'
      + ' must not parse as a tuning signature').toBe(false);
  });

  test('the register fingerprint reports the version and both file digests', () => {
    const fingerprint = tuningRegisterFingerprint(ROOT);
    expect(fingerprint.signatureVersion).toBe(0);
    expect(fingerprint.declaredSha256, 'the declared file must digest').toMatch(/^[0-9a-f]{64}$/);
    expect(fingerprint.inventorySha256, 'and so must the measured one').toMatch(/^[0-9a-f]{64}$/);
    expect(fingerprint.measuredAtSha, 'and the fingerprint names the sha the inventory was'
      + ' measured at, so a soak receipt can prove which register version it ran under')
      .toBe(committed.measuredAtSha);
  });
});

/* ================================================================= describe G */

describe('tuning register — the soak-band manifest resolves', () => {
  const bandsRel = 'src/domain/tuning/proposedSoakBands.js';

  test('every constantId is a registered leaf or a declared phantom', () => {
    const source = readFileSync(join(ROOT, bandsRel), 'utf8');
    const names = new Set();
    for (const match of source.matchAll(/constantIds:\s*\[([^\]]*)\]/g)) {
      for (const part of match[1].split(',')) {
        const name = part.trim().replace(/^['"]|['"]$/g, '');
        if (name) names.add(name);
      }
    }
    const problems = [];
    for (const name of [...names].sort()) {
      const alias = register.soakBandAliases[name];
      if (!alias) { problems.push(`${name}: the manifest names it, the register does not`); continue; }
      if (alias.phantom) continue;
      if (!alias.registeredLeaf) problems.push(`${name}: neither a registered leaf nor a declared phantom`);
    }
    expect(problems, 'a band that governs a dial nobody can find is a band that cannot be'
      + ' tuned. Every name resolves, or it is declared a phantom with its real home cited.').toEqual([]);
    expect(names.size, 'the manifest names sixteen distinct dials').toBe(16);
  });

  test('the phantom aliases are exactly the three whose real home is a bare literal', () => {
    const phantoms = Object.entries(register.soakBandAliases)
      .filter(([, alias]) => alias.phantom)
      .map(([name]) => name)
      .sort();
    expect(phantoms, 'three names in the ratified manifest resolve to no constant at all,'
      + ' because the dial they cite is an unnamed literal. Recording them as phantoms with'
      + ' their measured real homes is the honest act; repairing them is an owner row (TR-6),'
      + ' not a lane\'s.').toEqual(['SEVERE_FLIGHT_CAP', 'WAR_CRISIS_ARCHETYPES_RATE_PRESS', 'economicAdj_divisor_400']);
    const problems = [];
    for (const name of phantoms) {
      const alias = register.soakBandAliases[name];
      if (!/^src\/.+:\d+$/.test(String(alias.realHome ?? ''))) {
        problems.push(`${name}: realHome '${alias.realHome}' is not a file:line citation`);
      }
    }
    expect(problems, 'and each phantom cites where the real value actually lives').toEqual([]);
  });

  test('every resolvable registered leaf named by an alias exists in the measured estate', () => {
    const problems = [];
    for (const [name, alias] of Object.entries(register.soakBandAliases)) {
      if (alias.phantom || !alias.registeredLeaf) continue;
      const [id, ...path] = alias.registeredLeaf.split('#');
      const [exportName, ...leafPath] = path.join('#').split('.');
      const table = live.tables[`${id}#${exportName}`];
      if (!table) { problems.push(`${name}: ${alias.registeredLeaf} names no measured table`); continue; }
      if (!(leafPath.join('.') in table.leaves)) {
        problems.push(`${name}: ${alias.registeredLeaf} names no leaf of that table`);
      }
    }
    expect(problems, 'THE CITATION LAW again: an alias row asserts that a leaf exists at that'
      + ' exact path, and a row that merely looks resolvable is the failure this arm is for.').toEqual([]);
    const resolvable = Object.values(register.soakBandAliases).filter((a) => a.registeredLeaf).length;
    expect(resolvable, 'thirteen of the sixteen resolve; the other three are the phantoms').toBe(13);
  });

  test('a homonym alias is disambiguated by its band module rather than by the bare name', () => {
    const problems = [];
    for (const [name, alias] of Object.entries(register.soakBandAliases)) {
      if (!alias.note || !alias.note.startsWith('homonym')) continue;
      if (!alias.registeredLeaf) problems.push(`${name}: a homonym left unresolved`);
    }
    expect(problems, 'BASE names three leaves and COOLDOWN_WEEKS names two; a register that'
      + ' recorded the bare name would be pointing at whichever one it happened to find'
      + ' first. FOLD 25: a unit-less field gets a different unit at every consumer.').toEqual([]);
    expect(register.soakBandAliases.BASE.registeredLeaf,
      'BASE resolves to the traditions kernel, measured through the band\'s own constantModule')
      .toBe('src/domain/worldPulse/traditionsKernel.js#TRAD_TUNING.BASE');
  });
});

/* ================================================================= describe H */

describe('tuning register — the refreeze ritual refuses', () => {
  /**
   * ⚠ THE DIRT OF THE TREE THIS RUNS IN IS NOT THE SUBJECT OF THESE ARMS, AND LETTING IT BE
   * ONE MADE THEM LIE. The refusals are ORDERED, and DIRTY_TREE comes first — so in any
   * working dock with an uncommitted file (which is every dock, mid-car) three of these arms
   * received DIRTY_TREE and reported that the growth door and the signing door had failed.
   * MEASURED: `expected 'DIRTY_TREE' to be 'SIGNED_DIGEST_MOVED'`. Accounting for the tree's
   * ACTUAL dirt here makes each arm test the refusal it names; the dirty branch gets its own
   * arm below, driven in a throwaway repository so it never depends on this one's state.
   */
  // NOT `gitOut`, which trims the whole output and eats the leading space of the first
  // porcelain line — see the lib's `gitPorcelainPaths` for the refusal that convicted it.
  const currentlyDirty = () => execFileSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter((line) => line.length > 3).map((line) => line.slice(3).trim()).filter(Boolean);

  const baseArgs = () => ({
    root: ROOT,
    measuredBy: 'lane INSTR-TUNEREG (Opus 5)',
    note: 'a note long enough to be a real cause rather than a formality',
    previous: committed,
    measured: committed,
    register,
    allowedDirty: [INVENTORY_REL, ...currentlyDirty()],
  });

  test('blank or placeholder provenance is refused', () => {
    const blank = refreezeRefusals({ ...baseArgs(), measuredBy: '' });
    expect(blank.refusal, 'a refreeze with no seat is a figure nobody can attribute').toBe('BLANK_PROVENANCE');
    const placeholder = refreezeRefusals({ ...baseArgs(), measuredBy: '1' });
    expect(placeholder.refusal, 'and REFREEZE=1 would write measuredBy "1", which is'
      + ' provenance in shape only').toBe('BLANK_PROVENANCE');
    const noNote = refreezeRefusals({ ...baseArgs(), note: '' });
    expect(noNote.refusal).toBe('BLANK_PROVENANCE');
    // anchored: the well-formed call below carries the same shape minus the defect, and it
    // must NOT refuse, so a function that returned BLANK_PROVENANCE always would fail here.
    expect(refreezeRefusals(baseArgs()).refusal).toBeNull();
  });

  test('growth is refused unless a DECLARED_GROWTH row attributes it to a real commit', () => {
    const grown = { ...committed, bareDecimals: { ...committed.bareDecimals, 'src/domain/probe.js': 5 } };
    const bare = refreezeRefusals({ ...baseArgs(), measured: grown });
    expect(bare.refusal, 'unattributed growth is refused').toBe('POPULATION_GREW');

    const fakeSha = {
      ...register,
      declaredGrowth: {
        bareDecimals: {
          'src/domain/probe.js': {
            sites: 5,
            introducedAt: UNRESOLVABLE_WELL_FORMED_SHA,
            cause: 'a cause long enough to clear the sixty character floor this ledger imposes on it',
          },
        },
      },
    };
    const fake = refreezeRefusals({ ...baseArgs(), measured: grown, register: fakeSha });
    expect(fake.refusal, 'a 40-hex sha that resolves to NO commit is worse than a missing'
      + ' one, because the next lane plans against it').toBe('POPULATION_GREW');
    expect(gitResolvesCommit(UNRESOLVABLE_WELL_FORMED_SHA), 'and the control holds: the fake'
      + ' sha genuinely resolves to nothing').toBe(false);

    const realSha = gitOut('rev-parse', 'HEAD');
    const attributed = {
      ...register,
      declaredGrowth: {
        bareDecimals: {
          'src/domain/probe.js': {
            sites: 5,
            introducedAt: realSha,
            cause: 'a cause long enough to clear the sixty character floor this ledger imposes on it',
          },
        },
      },
    };
    expect(refreezeRefusals({ ...baseArgs(), measured: grown, register: attributed }).refusal,
      'and a row naming a REAL commit with a real cause is admitted — otherwise the door'
      + ' would be a wall and lanes would route around it').toBeNull();

    const shortCause = {
      ...attributed,
      declaredGrowth: { bareDecimals: { 'src/domain/probe.js': { sites: 5, introducedAt: realSha, cause: 'too short' } } },
    };
    expect(refreezeRefusals({ ...baseArgs(), measured: grown, register: shortCause }).refusal).toBe('POPULATION_GREW');
  });

  test('a signed digest cannot move without a signing record that names it', () => {
    const id = Object.keys(committed.tables)[0];
    const signedRegister = {
      ...register,
      signatureVersion: 1,
      tables: { ...register.tables, [id]: { ...register.tables[id], status: 'signed', signedAt: 1 } },
    };
    const moved = {
      ...committed,
      tables: { ...committed.tables, [id]: { ...committed.tables[id], spanDigest: 'f'.repeat(64) } },
    };

    const noRecord = refreezeRefusals({ ...baseArgs(), measured: moved, register: signedRegister });
    expect(noRecord.refusal, 'a signed value that moves with no record is the exact event'
      + ' THE PROMISE forbids: a retune of a signed value is version N+1 through the owner\'s'
      + ' door, never an edit').toBe('SIGNED_DIGEST_MOVED');

    const record = {
      ownerWords: 'signed at the sitting', ownerDate: '2026-09-30', odqRow: '§884.1',
      seat: 'owner', version: 2, ids: [id], note: '',
    };
    expect(refreezeRefusals({ ...baseArgs(), measured: moved, register: signedRegister, record }).refusal,
      'and a version-2 record naming that exact id over a register at version 1 is admitted').toBeNull();

    const wrongVersion = refreezeRefusals({
      ...baseArgs(), measured: moved, register: signedRegister, record: { ...record, version: 3 },
    });
    expect(wrongVersion.refusal, 'versions are dense from 1; a jump is refused').toBe('RECORD_VERSION_MISMATCH');

    const otherId = { ...record, ids: ['src/domain/elsewhere.js#OTHER_TUNING'] };
    const notNamed = refreezeRefusals({
      ...baseArgs(), measured: moved, register: signedRegister, record: otherId,
    });
    expect(notNamed.refusal, 'a record signs exactly the ids it names and never one more —'
      + ' the write is refused WHOLE rather than applied in part').toBe('ID_NOT_IN_RECORD');
  });

  test('a malformed signing record is refused before any id is considered', () => {
    const problems = [];
    const blankTemplate = { ownerWords: '', ownerDate: '', odqRow: '', seat: '', version: 0, ids: [], note: '' };
    if (!signingRecordMalformations(blankTemplate)) problems.push('the blank template was accepted');
    if (!signingRecordMalformations({ ...blankTemplate, ownerWords: 'x' })) problems.push('a half-filled record was accepted');
    const wellFormed = {
      ownerWords: 'signed', ownerDate: '2026-09-30', odqRow: '§884.1', seat: 'owner',
      version: 1, ids: ['src/domain/a.js#A_TUNING'], note: '',
    };
    if (signingRecordMalformations(wellFormed)) problems.push('a well-formed record was refused');
    expect(problems, 'the blank template is a LIVE SUBJECT, not decoration: it ships blank so'
      + ' that this arm always has something real to refuse.').toEqual([]);
  });

  test('a dirty tree is refused and the permitted path alone dirty is allowed', () => {
    // Driven in a throwaway repository so this arm proves the BRANCH rather than reporting
    // whatever state the dock happens to be in when the gate runs.
    const dir = mkdtempSync(join(tmpdir(), 'tunereg-git-'));
    try {
      execFileSync('git', ['init', '-q'], { cwd: dir });
      writeFileSync(join(dir, 'someone-elses-work.js'), 'export const x = 1;\n', 'utf8');
      const args = {
        root: dir,
        measuredBy: 'lane INSTR-TUNEREG (Opus 5)',
        note: 'a note long enough to be a real cause rather than a formality',
        previous: committed,
        measured: committed,
        register,
      };
      const refused = refreezeRefusals({ ...args, allowedDirty: [] });
      expect(refused.refusal, 'this inventory measures the WORKING TREE, and in a shared tree'
        + ' that file may belong to another lane — charging it to this measurement writes a'
        + ' figure no checkout of this commit could reproduce').toBe('DIRTY_TREE');
      expect(refused.detail, 'and the refusal names the path, so the lane can see whose it is')
        .toContain('someone-elses-work.js');

      const allowed = refreezeRefusals({ ...args, allowedDirty: ['someone-elses-work.js'] });
      // anchored: the SAME tree with the SAME single dirty path refused one line above, so a
      // dirty check that had been emptied could not produce both answers.
      expect(allowed.refusal, 'and the one permitted dirty path makes a refreeze repeatable')
        .not.toBe('DIRTY_TREE');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
    expect(REFUSALS, 'and the refusal vocabulary is closed').toContain('DIRTY_TREE');
  });

  test('a genesis is refused without a charter and refused again once a baseline exists', () => {
    const unchartered = refreezeRefusals({ ...baseArgs(), previous: null });
    expect(unchartered.refusal, 'the FIRST write banks every population from nothing, and'
      + ' that is an explicit chartered act rather than a side effect of a missing file')
      .toBe('GENESIS_REFUSED');
    const chartered = refreezeRefusals({ ...baseArgs(), previous: null, genesisCharter: '§3.5' });
    expect(chartered.refusal, 'with the charter cited it is admitted').toBeNull();
    const second = refreezeRefusals({ ...baseArgs(), genesisCharter: '§3.5' });
    expect(second.refusal, 'and a SECOND genesis over a committed inventory is refused: it'
      + ' would silently re-bank the whole live population with no history row, the one'
      + ' movement a shrink-only register can never recover from').toBe('GENESIS_REFUSED');
  });

  test('the ritual writes all or nothing and says so in the register it governs', () => {
    const doc = (register._doc ?? []).join(' ');
    expect(doc, 'the register documents its own regeneration command, so nobody has to guess'
      + ' at it and nobody hand-edits instead').toContain('TUNING_INVENTORY_REFREEZE');
    expect(doc, 'and it says plainly that the values are not the lane\'s to change').toContain('draft');
    const inventoryDoc = (committed._doc ?? []).join(' ');
    expect(inventoryDoc, 'the measured file says it is machine-written').toContain('MACHINE-WRITTEN');
  });
});
