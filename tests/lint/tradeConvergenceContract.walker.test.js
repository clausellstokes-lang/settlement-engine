/**
 * tradeConvergenceContract.walker.test.js — TR-9c: the TRADE convergence
 * contract's own walker, and THE LIGHTING-ORDER INVALID-CONFIG LAW executed.
 *
 * WHAT THIS FILE IS FOR. DESIGN_FP_TRADE.md §3 and DESIGN_FP_ARCH_TR.md §2 both
 * end their flag-dependency ruling with the same sentence — "a flag lit out of
 * order is an invalid config the TR-9 certification walker reds" — and the
 * compiled architecture's lighting contract repeats it for all eight programs.
 * Until this file, that law existed only as prose in three volumes, which is the
 * shape the CW-0w slice-2 work found for the same-commit registry obligation:
 * enforced by review courtesy alone. This walker is the machinery.
 *
 * THREE THINGS ARE PINNED, and they are deliberately different in kind:
 *
 *   1. THE TABLE AGAINST THE VOLUMES. The six ending keys, the eight flags and
 *      the three cross-program precondition spellings are read back out of the
 *      chair-authored documents, every pin EXACTLY-ONCE (L7's first-match hole).
 *      A table that drifts from its charter reds here, from either side.
 *   2. THE LAW AGAINST ITSELF. Every lighting row is executed in BOTH arms: the
 *      flag lit with its preconditions dark must produce exactly its declared
 *      violations, and the same flag lit WITH them must produce none. A pin that
 *      only proved the red arm would pass on a function that always complains;
 *      one that only proved the green arm would pass on a function that never
 *      does. Both arms, all eight flags, is the lit-mutant control this estate
 *      requires around a load-bearing conjunction.
 *   3. THE SHAPE AGAINST ITS OWN VALIDATOR. Every failure mode of the totality
 *      wall is driven to red on a synthetic observation before the empty
 *      observation is asserted clean, so the wall cannot pass by being blind.
 *
 * WHAT THIS FILE DELIBERATELY DOES NOT DO. It does not scan src/ for gate reads
 * and it declares no build state. The CQ5 manifest law is already enforced for
 * every gated key by tests/lint/engineGatedRuleKeys.walker.test.js — which owns
 * the gate-idiom scanner, the comment/string blanking, and the two-way manifest
 * audit — and the eight TR keys fall under it automatically the moment one gains
 * its first gate read. A second, simpler scanner here would be a weaker copy of
 * that authority whose only unique power would be to red a neighbouring lane for
 * landing TR-1 correctly. What this file asserts instead is the half of L2 that
 * is TRUE FOREVER: every TR flag is VIRTUAL, absent from DEFAULT_SIMULATION_RULES
 * and from every preset override spread.
 *
 * @enforced-by this file
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  TRADE_CONVERGENCE_OBSERVATION_VERSION,
  TRADE_ENDING_KEYS,
  TRADE_ENDING_AVAILABILITY_STATES,
  TRADE_RULINGS_FLAG_KEYS,
  TRADE_FLAG_RULE_STATES,
  TRADE_FLAG_CERTIFICATION_VERDICTS,
  TRADE_FOREIGN_PRECONDITION_FLAGS,
  TRADE_FLAG_LIGHTING_ROWS,
  TRADE_DEGRADED_ARMS,
  TRADE_ENDING_MINT_ROWS,
  evaluateTradeFlagLighting,
  tradeEndingAvailability,
  createEmptyTradeConvergenceObservation,
  validateTradeConvergenceObservation,
} from '../../src/domain/certification/tradeConvergenceContract.js';
import {
  WAR_FLAG_RULE_STATES,
  WAR_FLAG_CERTIFICATION_VERDICTS,
} from '../../src/domain/certification/warConvergenceContract.js';
import {
  DEFAULT_SIMULATION_RULES,
  SIMULATION_RULE_PRESETS,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
} from '../../src/domain/worldPulse/simulationRules.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const ARCH_PATH = 'docs/DESIGN_FP_ARCHITECTURE.md';
const TRADE_PATH = 'docs/DESIGN_FP_TRADE.md';
const ARCH_TR_PATH = 'docs/DESIGN_FP_ARCH_TR.md';

/** @param {string} rel */
const readDoc = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/**
 * Whitespace-normalised document text. The volumes hard-wrap at 78 columns, so a
 * sentence or a declaration routinely straddles a newline; matching on the raw
 * text would make every pin a hostage to re-wrapping rather than to meaning.
 * @param {string} text
 */
const normalise = (text) => text.replace(/\s+/g, ' ');

/** @param {string} haystack @param {string} needle */
const occurrences = (haystack, needle) => haystack.split(needle).length - 1;

const ARCH = normalise(readDoc(ARCH_PATH));
const TRADE = normalise(readDoc(TRADE_PATH));
const ARCH_TR = normalise(readDoc(ARCH_TR_PATH));
const TRADE_LINES = readDoc(TRADE_PATH).split('\n');

/**
 * The `**Endings wired:**` bullet of one TRADE wave section, joined across its
 * continuation lines. Section identity is `### <wave> ` with the trailing space,
 * so `### TR-1 ` cannot match `### TR-10` if the volume ever grows one, and the
 * header count is asserted by the caller — L7's exactly-once discipline applied
 * to a structural slice rather than to a substring.
 * @param {string} wave
 * @returns {{ headers: number, bullets: number, text: string }}
 */
function endingsWiredBullet(wave) {
  const headerIndexes = TRADE_LINES
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^### TR-\d/.test(line))
    .map(({ index }) => index);
  const mine = headerIndexes.filter(
    (index) => TRADE_LINES[index].startsWith(`### ${wave} `),
  );
  if (mine.length !== 1) return { headers: mine.length, bullets: 0, text: '' };
  const start = mine[0];
  const end = headerIndexes.find((index) => index > start) ?? TRADE_LINES.length;
  const body = TRADE_LINES.slice(start, end);
  const bulletStarts = body
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.includes('**Endings wired:**'))
    .map(({ index }) => index);
  if (bulletStarts.length !== 1) {
    return { headers: 1, bullets: bulletStarts.length, text: '' };
  }
  let stop = bulletStarts[0] + 1;
  while (stop < body.length && !/^- \*\*/.test(body[stop])) stop += 1;
  return {
    headers: 1,
    bullets: 1,
    text: normalise(body.slice(bulletStarts[0], stop).join(' ')),
  };
}

/**
 * Every rule key any preset can put into a campaign's rules object.
 * `SIMULATION_RULE_PRESETS` is an OBJECT keyed by preset id, not an array — the
 * shape the engineGatedRuleKeys walker reads with `Object.values` too.
 */
const PRESET_RULE_KEYS = new Set(
  Object.values(SIMULATION_RULE_PRESETS)
    .flatMap((preset) => Object.keys(preset?.rules || {})),
);
const DEFAULT_RULE_KEYS = new Set(Object.keys(DEFAULT_SIMULATION_RULES));

/**
 * THE INDEPENDENT DENOMINATOR — DESIGN_FP_TRADE.md §3's flag-dependency ruling,
 * transcribed here from the DOCUMENT rather than from the module under test.
 *
 * WHY THIS EXISTS, AND WHAT IT COST TO LEARN. The both-arms lighting test below
 * derives its expected violation set from `TRADE_FLAG_LIGHTING_ROWS` — the same
 * table `evaluateTradeFlagLighting` reads. An executed mutant at build time
 * (TR-6's three TRADE preconditions emptied) proved exactly what that shape is
 * worth: the whole both-arms block stayed GREEN, because a function and its table
 * agreeing about nothing is still agreement. That is the recorded
 * self-referential-pin class, caught in this file's own first draft.
 *
 * These clause heads are the volume's own sentence. Each is asserted to appear in
 * the volume EXACTLY ONCE (so a re-worded ruling reds instead of going vacuous),
 * and each is then PARSED into a precondition set the table must match. The
 * document is the denominator; the module is the claim.
 *
 * Heads stop at the first parenthetical because the volume's asides themselves
 * name waves ("dark-TR-4 grain_provision falls back to…"), and a parser that
 * swallowed them would collect degradation notes as hard preconditions — the very
 * distinction §3 draws.
 */
const VOLUME_DEPENDENCY_CLAUSES = Object.freeze({
  'TR-2': 'TR-2 ⇒ TR-1;',
  'TR-3': 'TR-3 ⇒ SP-2 landed + TR-1;',
  'TR-4': 'TR-4 ⇒ `commodityFlowEnabled` + `demographicsEnabled` (',
  'TR-5': 'TR-5 ⇒ SP-3 landed + TR-1 (',
  'TR-6': 'TR-6 ⇒ TR-2 + TR-3 + TR-4 + `commonsVoiceEnabled` (',
  'TR-7': 'TR-7 ⇒ TR-2 + TR-3 (the venture is CHOSEN on believed bands)'
    + ' + `commodityFlowEnabled` (',
  'TR-8': 'TR-8 ⇒ SP-1 landed + TR-5 + TR-7 (',
});

/** wave id -> the flag that wave lights, read off the lighting table. */
const FLAG_OF_WAVE = new Map(TRADE_FLAG_LIGHTING_ROWS.map((row) => [row.wave, row.flag]));
/** SPINE alias -> the FP-program flag it resolves to. */
const FLAG_OF_ALIAS = new Map(
  TRADE_FOREIGN_PRECONDITION_FLAGS
    .filter((row) => row.spineAlias)
    .map((row) => [row.spineAlias, row.flag]),
);

/**
 * Parse one volume clause head into the precondition flags it names.
 * `TR-N` resolves through the wave table, `SP-N landed` through the alias table,
 * and a backticked token is a flag key spelled outright.
 * @param {string} clause
 * @returns {{ flags: string[], unresolved: string[] }}
 */
function parseDependencyClause(clause) {
  const body = clause
    .slice(clause.indexOf('⇒') + 1)
    // Balanced asides first (TR-7 carries one mid-clause), then the DANGLING open
    // paren that ends every head cut at a parenthetical. Without the second strip
    // the last term of five of the seven clauses came back as an unresolved
    // "`flagName` (" — measured, not guessed: the first run of this census reported
    // exactly that for TR-4/5/6/7/8.
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\(\s*$/, '')
    .replace(/;\s*$/, '');
  /** @type {string[]} */
  const flags = [];
  /** @type {string[]} */
  const unresolved = [];
  for (const rawTerm of body.split('+')) {
    const term = rawTerm.trim();
    if (term === '') continue;
    const backticked = term.match(/^`([A-Za-z_$][\w$]*)`$/);
    const wave = term.match(/^(TR-\d)$/);
    const alias = term.match(/^(SP-\d) landed$/);
    if (backticked) flags.push(backticked[1]);
    else if (wave && FLAG_OF_WAVE.has(wave[1])) flags.push(FLAG_OF_WAVE.get(wave[1]));
    else if (alias && FLAG_OF_ALIAS.has(alias[1])) flags.push(FLAG_OF_ALIAS.get(alias[1]));
    else unresolved.push(term);
  }
  return { flags, unresolved };
}

/** A config lighting exactly the named keys and nothing else. */
const litConfig = (...keys) => Object.fromEntries(keys.map((key) => [key, true]));

/** Every precondition of one lighting row, trade-side then foreign-side. */
const allPreconditions = (row) => [...row.requiresTradeFlags, ...row.requiresForeignFlags];

describe('TR-9c guard-the-guard: the documents and the tables are non-vacuous', () => {
  test('all three charter documents are present and substantial', () => {
    for (const [rel, text] of [[ARCH_PATH, ARCH], [TRADE_PATH, TRADE], [ARCH_TR_PATH, ARCH_TR]]) {
      expect(existsSync(join(ROOT, rel)), `${rel} must exist`).toBe(true);
      expect(text.length, `${rel} is suspiciously short — the pins below would go vacuous`)
        .toBeGreaterThan(20000);
    }
  });

  test('the detector finds a sentence that IS there and misses one that is not', () => {
    // If `occurrences` or `normalise` silently broke, every exactly-once pin below
    // would pass on zero matches. Both directions, on this document.
    expect(occurrences(ARCH, 'THE FLAG FAMILY')).toBeGreaterThan(0);
    // anchored: a deliberately absent sentence — the negative arm of the detector.
    expect(occurrences(ARCH, 'THE FLAG FAMILY HAS NINE MEMBERS AND A DOG')).toBe(0);
  });

  test('the exported tables are non-empty and internally unique', () => {
    expect(TRADE_ENDING_KEYS.length).toBe(6);
    expect(new Set(TRADE_ENDING_KEYS).size).toBe(6);
    expect(TRADE_RULINGS_FLAG_KEYS.length).toBe(8);
    expect(new Set(TRADE_RULINGS_FLAG_KEYS).size).toBe(8);
    expect(TRADE_FLAG_LIGHTING_ROWS.length).toBe(8);
    expect(TRADE_ENDING_MINT_ROWS.length).toBe(6);
    expect(TRADE_FOREIGN_PRECONDITION_FLAGS.length).toBe(7);
    expect(new Set(TRADE_FOREIGN_PRECONDITION_FLAGS.map((r) => r.flag)).size).toBe(7);
    expect(TRADE_DEGRADED_ARMS.length).toBeGreaterThan(0);
    expect(TRADE_ENDING_AVAILABILITY_STATES.length).toBe(2);
    expect(TRADE_CONVERGENCE_OBSERVATION_VERSION).toBe(1);
  });

  test('every exported table is frozen, rows included', () => {
    const tables = [
      TRADE_ENDING_KEYS, TRADE_ENDING_AVAILABILITY_STATES, TRADE_RULINGS_FLAG_KEYS,
      TRADE_FLAG_RULE_STATES, TRADE_FLAG_CERTIFICATION_VERDICTS,
      TRADE_FOREIGN_PRECONDITION_FLAGS, TRADE_FLAG_LIGHTING_ROWS,
      TRADE_DEGRADED_ARMS, TRADE_ENDING_MINT_ROWS,
    ];
    for (const table of tables) expect(Object.isFrozen(table)).toBe(true);
    for (const row of [
      ...TRADE_FOREIGN_PRECONDITION_FLAGS, ...TRADE_FLAG_LIGHTING_ROWS,
      ...TRADE_DEGRADED_ARMS, ...TRADE_ENDING_MINT_ROWS,
    ]) {
      expect(Object.isFrozen(row), `row ${JSON.stringify(row).slice(0, 60)} must be frozen`)
        .toBe(true);
    }
  });
});

describe('TR-9c vocabulary: the six endings are the volumes own closed set', () => {
  test('the TRADE volume declares exactly these six, exactly once', () => {
    const declaration = `TRADE_ENDING_KEYS = {${TRADE_ENDING_KEYS.join(', ')}}`;
    expect(
      occurrences(TRADE, declaration),
      `${TRADE_PATH} must declare the closed ending vocabulary exactly once, in this`
      + ` order: ${declaration}`,
    ).toBe(1);
  });

  test('the compiled architecture charter declares the same six, exactly once', () => {
    const declaration = `TRADE_ENDING_KEYS {${TRADE_ENDING_KEYS.join(', ')}} CLOSED`;
    expect(
      occurrences(ARCH, declaration),
      `${ARCH_PATH} §5 block #31 must declare the closed vocabulary exactly once: ${declaration}`,
    ).toBe(1);
  });

  test('each ending is wired by the wave this module says mints it', () => {
    const problems = [];
    for (const row of TRADE_ENDING_MINT_ROWS) {
      const { headers, bullets, text } = endingsWiredBullet(row.mintedAt);
      if (headers !== 1) {
        problems.push(`${row.ending}: ${TRADE_PATH} has ${headers} sections headed "### ${row.mintedAt} " (need exactly 1)`);
        continue;
      }
      if (bullets !== 1) {
        problems.push(`${row.ending}: the ${row.mintedAt} section has ${bullets} "Endings wired" bullets (need exactly 1)`);
        continue;
      }
      if (!text.includes(`\`${row.ending}\``)) {
        problems.push(`${row.ending}: the ${row.mintedAt} "Endings wired" bullet does not name it — ${text.slice(0, 120)}`);
      }
    }
    expect(problems, 'the mint table disagrees with the TRADE volume').toEqual([]);
  });

  test('the mint table covers every ending exactly once and names only real flags', () => {
    expect(TRADE_ENDING_MINT_ROWS.map((row) => row.ending)).toEqual([...TRADE_ENDING_KEYS]);
    const knownFlags = new Set([
      ...TRADE_RULINGS_FLAG_KEYS,
      ...TRADE_FOREIGN_PRECONDITION_FLAGS.map((row) => row.flag),
    ]);
    for (const row of TRADE_ENDING_MINT_ROWS) {
      expect(row.requiresFlags.length, `${row.ending} must require at least one flag`)
        .toBeGreaterThan(0);
      for (const flag of row.requiresFlags) {
        expect(knownFlags.has(flag), `${row.ending} requires unknown flag ${flag}`).toBe(true);
      }
      if (row.permanentZeroWhileDark !== null) {
        expect(
          row.requiresFlags.includes(row.permanentZeroWhileDark),
          `${row.ending} names ${row.permanentZeroWhileDark} as its honest-permanent-zero`
          + ' flag but does not require it — the field could never fire',
        ).toBe(true);
      }
    }
  });

  test('collapse is the one honest permanent zero, and it names the route lifecycle', () => {
    const named = TRADE_ENDING_MINT_ROWS
      .filter((row) => row.permanentZeroWhileDark !== null)
      .map((row) => [row.ending, row.permanentZeroWhileDark]);
    expect(named).toEqual([['collapse', 'routeLifecycleEnabled']]);
    expect(
      occurrences(TRADE, 'an HONEST PERMANENT ZERO while `routeLifecycleEnabled` is dark'),
      `${TRADE_PATH} must carry the honest-permanent-zero ruling exactly once`,
    ).toBe(1);
  });
});

describe('TR-9c flag family: eight flags, the charter table, and the VIRTUAL law', () => {
  test('the eight flags appear in the architecture flag table exactly once each, with their wave', () => {
    const problems = [];
    TRADE_FLAG_LIGHTING_ROWS.forEach((row, index) => {
      const cell = `| ${15 + index} | \`${row.flag}\` | ${row.wave} |`;
      const found = occurrences(ARCH, cell);
      if (found !== 1) problems.push(`${cell} appears ${found} times in ${ARCH_PATH} (need exactly 1)`);
    });
    expect(problems, 'the flag family drifted from the compiled architecture §3 table').toEqual([]);
  });

  test('the lighting rows are exactly the flag family, in build order', () => {
    expect(TRADE_FLAG_LIGHTING_ROWS.map((row) => row.flag)).toEqual([...TRADE_RULINGS_FLAG_KEYS]);
    expect(TRADE_FLAG_LIGHTING_ROWS.map((row) => row.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('every TRADE flag is VIRTUAL — absent from the defaults and from every preset spread', () => {
    const declared = TRADE_RULINGS_FLAG_KEYS.filter(
      (key) => DEFAULT_RULE_KEYS.has(key) || PRESET_RULE_KEYS.has(key),
    );
    expect(
      declared,
      'L2: every FP flag is VIRTUAL. A TRADE key that appears in DEFAULT_SIMULATION_RULES'
      + ' or in a preset override spread costs every new campaign persisted bytes and'
      + ' moves preset identity. Keep the key out of both surfaces and let'
      + ' ENGINE_GATED_VIRTUAL_RULE_KEYS carry it instead.',
    ).toEqual([]);
  });

  test('the certification vocabulary is byte-identical to the war contract it copies', () => {
    // A deliberate SECOND SPELLING rather than an import: warConvergenceContract.js
    // is the WAR program's module, and a TRADE contract importing it would make one
    // program's convergence vocabulary a dependency of another's. The war module
    // already uses this idiom internally (WR-9c's J-WR9C-1), and the pin is what
    // keeps the two lists from drifting apart while nobody is looking.
    expect([...TRADE_FLAG_RULE_STATES]).toEqual([...WAR_FLAG_RULE_STATES]);
    expect([...TRADE_FLAG_CERTIFICATION_VERDICTS]).toEqual([...WAR_FLAG_CERTIFICATION_VERDICTS]);
  });
});

describe('TR-9c foreign preconditions: every borrowed key is real, at an address', () => {
  test('every precondition named by a lighting row is a declared foreign or TRADE flag', () => {
    const known = new Set([
      ...TRADE_RULINGS_FLAG_KEYS,
      ...TRADE_FOREIGN_PRECONDITION_FLAGS.map((row) => row.flag),
    ]);
    const unknown = TRADE_FLAG_LIGHTING_ROWS
      .flatMap((row) => allPreconditions(row).map((flag) => ({ flag, of: row.flag })))
      .filter(({ flag }) => !known.has(flag));
    expect(unknown, 'a lighting row gates on a key no table declares').toEqual([]);
  });

  test('no declared foreign flag is unused — the table is a map, not a wish list', () => {
    const used = new Set(TRADE_FLAG_LIGHTING_ROWS.flatMap((row) => row.requiresForeignFlags));
    for (const row of TRADE_ENDING_MINT_ROWS) for (const flag of row.requiresFlags) used.add(flag);
    const orphans = TRADE_FOREIGN_PRECONDITION_FLAGS
      .map((row) => row.flag)
      .filter((flag) => !used.has(flag));
    expect(orphans, 'declared foreign preconditions nothing reads').toEqual([]);
  });

  test('every precondition that NAMES an address really spells the strict gate there', () => {
    // REPAIR R6 — this arm used to run over ENGINE rows only, because FP_PROGRAM rows were
    // required to carry no address at all. Now that a landed FP flag names its gate (see the
    // module header), the address check runs over EVERY row that names one: a row's evidence
    // is worth exactly as much as the file it points at, whichever program owns the flag.
    const problems = [];
    for (const row of TRADE_FOREIGN_PRECONDITION_FLAGS.filter((r) => r.gateEvidenceFile || r.origin === 'ENGINE')) {
      if (!row.gateEvidenceFile) {
        problems.push(`${row.flag}: an ENGINE precondition must name its gate evidence file`);
        continue;
      }
      const abs = join(ROOT, row.gateEvidenceFile);
      if (!existsSync(abs)) {
        problems.push(`${row.flag}: ${row.gateEvidenceFile} does not exist — the owning module moved; re-measure the row`);
        continue;
      }
      if (!readFileSync(abs, 'utf8').includes(`${row.flag} === true`)) {
        problems.push(`${row.flag}: ${row.gateEvidenceFile} no longer spells \`${row.flag} === true\` — re-measure the row`);
      }
    }
    expect(problems, 'a borrowed engine gate drifted').toEqual([]);
  });

  test('the fabricated-flag control proves the evidence scan is not blind', () => {
    const abs = join(ROOT, 'src/domain/worldPulse/commonsVoiceKernel.js');
    const src = readFileSync(abs, 'utf8');
    expect(src.includes('commonsVoiceEnabled === true')).toBe(true);
    // anchored: a key nothing in this estate spells — the negative arm proving the
    // `=== true` search above is a real test and not a substring that always hits.
    expect(src.includes('tradeContractProbeFlagEnabled === true')).toBe(false);
  });

  test('every FP_PROGRAM precondition is pinned to the charter flag table, exactly once', () => {
    const rows = TRADE_FOREIGN_PRECONDITION_FLAGS.filter((r) => r.origin === 'FP_PROGRAM');
    expect(rows.map((r) => r.flag).sort()).toEqual([
      'believedScarcityEnabled', 'errandSpineEnabled', 'pactFormationEnabled',
    ]);
    const problems = [];
    for (const row of rows) {
      const cell = `\`${row.flag}\` | ${row.owner} |`;
      const found = occurrences(ARCH, cell);
      if (found !== 1) {
        problems.push(`${row.flag}: "${cell}" appears ${found} times in ${ARCH_PATH} (need exactly 1) — the spelling or the owning wave drifted`);
      }
    }
    expect(problems).toEqual([]);
  });

  test('REPAIR R6 — an FP_PROGRAM row names an address IFF the CQ5 manifest says it is built', () => {
    // THE DRIFT THIS CLOSES. The row for `believedScarcityEnabled` recorded a LANDED flag as
    // unbuilt for a whole wave: SP-B shipped that flag's first real gate and the walker not
    // only failed to notice, it REQUIRED the row to stay null (`is unbuilt and must carry no
    // gate evidence file`). The build state was an assumption baked into a matcher, so the
    // one thing that could never happen was the table telling the truth.
    //
    // THE AUTHORITY IS THE CQ5 MANIFEST, NOT A SCAN. This file deliberately owns no src/
    // gate scanner (see its header — a second, weaker scanner whose only unique power is to
    // red a neighbouring lane). It does not need one: `ENGINE_GATED_VIRTUAL_RULE_KEYS` is the
    // estate's register of virtual keys that have a real gate, and the CQ5 one-commit law
    // puts a key there in the SAME commit as its first gate read. Joining the two tables is
    // therefore an exact, mechanical read of build state that costs no new machinery — and
    // the address check above proves the named file really spells the gate, so the manifest
    // cannot vouch for a row that points nowhere.
    const rows = TRADE_FOREIGN_PRECONDITION_FLAGS.filter((r) => r.origin === 'FP_PROGRAM');
    const problems = [];
    for (const row of rows) {
      const built = ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(row.flag);
      if (built && !row.gateEvidenceFile) {
        problems.push(`${row.flag}: ${row.owner} has LANDED it (it is in ENGINE_GATED_VIRTUAL_RULE_KEYS)`
          + ' but its row still records it as unbuilt — name the module that spells the strict gate');
      }
      if (!built && row.gateEvidenceFile) {
        problems.push(`${row.flag}: its row names gate evidence (${row.gateEvidenceFile}) but the flag is`
          + ' NOT in ENGINE_GATED_VIRTUAL_RULE_KEYS — either the CQ5 manifest arm was missed or the'
          + ' evidence is fabricated');
      }
    }
    expect(problems, 'the foreign-precondition table drifted from the tree').toEqual([]);

    // GUARD THE GUARD, BOTH POLARITIES — AS A PARTITION, NOT AS A LITERAL (respelled
    // 2026-08-05, settling lane, verifier FINDING D). The join is only a measurement if the
    // CQ5 manifest really DISCRIMINATES between these rows: holding all of them, or none of
    // them, would make every row agree with it trivially and this test would pass forever.
    // That is the property worth asserting. What the guard must NOT do is freeze WHICH flags
    // are built — the first spelling pinned the built set to the literal
    // `['believedScarcityEnabled']`, so a CORRECT next landing (the CQ5 one-commit law
    // executed exactly as written for `pactFormationEnabled`) reddened it with "no FP
    // precondition reads as built" AT THE MOMENT TWO DID. Simulated and confirmed. A guard
    // whose failure message is the inverse of the truth sends the next lane hunting a
    // regression it does not have; the correct landing must pass here and be caught, if at
    // all, by the row-level arm above, which measures each row against the manifest directly.
    const built = rows.filter((r) => ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(r.flag)).map((r) => r.flag);
    const unbuilt = rows.filter((r) => !ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(r.flag)).map((r) => r.flag);
    expect(
      built,
      'NO FP precondition reads as built: the CQ5 manifest holds none of these flags, so every'
      + ' row agrees with it for free and the join above measures nothing. Either a landed'
      + ' flag was dropped from ENGINE_GATED_VIRTUAL_RULE_KEYS, or this join has outlived the'
      + ' table it joins and should be retired rather than kept green.',
    ).not.toEqual([]);
    expect(
      unbuilt,
      'EVERY FP precondition reads as built: the CQ5 manifest holds all of these flags, so'
      + ' again every row agrees for free. The join needs at least one unbuilt row to'
      + ' discriminate — extend the table with the next unbuilt precondition, or retire it.',
    ).not.toEqual([]);
    // …and the two halves are a PARTITION of the rows, so neither filter can quietly drop a
    // flag between them and leave both non-empty checks above looking healthy.
    expect(
      [...built, ...unbuilt].sort(),
      'the built/unbuilt split lost or duplicated a row — the two filters are no longer'
      + ' complementary and the non-empty guards above are measuring a subset',
    ).toEqual(rows.map((r) => r.flag).sort());
  });

  test("the SP-N aliases resolve the TRADE volume's own numbering", () => {
    // The TRADE architecture states three preconditions in SPINE numbering while the
    // compiled charter states them as waves. Re-deriving that join per wave is how a
    // wave ends up gating on a spelling nobody minted, so it is resolved once, here,
    // and each half is pinned to the document that says it.
    const aliases = Object.fromEntries(
      TRADE_FOREIGN_PRECONDITION_FLAGS
        .filter((row) => row.spineAlias)
        .map((row) => [row.spineAlias, row.owner]),
    );
    expect(aliases).toEqual({ 'SP-1': 'SP-D', 'SP-2': 'SP-B', 'SP-3': 'GR-2/GR-3' });
    // Each join is pinned at BOTH ends: the TRADE architecture's SP-N statement and
    // the charter block that resolves it to a wave. Anchors are the whole charter
    // block opening because the bare phrases ("needs SP-B") repeat across programs —
    // the first-match hole, L7.
    expect(occurrences(ARCH_TR, '**SP-2 landed** + TR-1'), `${ARCH_TR_PATH} states TR-3's SP-2 precondition once`).toBe(1);
    expect(occurrences(ARCH, '**#25 TR-3 — BELIEVED MARKETS** (flag `believedMarketsEnabled`; needs SP-B)'), `${ARCH_PATH} resolves TR-3 to SP-B once`).toBe(1);
    expect(occurrences(ARCH_TR, '**SP-1 landed** + TR-5 + TR-7'), `${ARCH_TR_PATH} states TR-8's SP-1 precondition once`).toBe(1);
    expect(occurrences(ARCH, '**#30 TR-8 — THE TRAVELING FACTOR** (flag `factorErrandsEnabled`; two slices; needs SP-D + TR-5 + TR-7)'), `${ARCH_PATH} resolves TR-8 to SP-D once`).toBe(1);
    expect(occurrences(ARCH_TR, '**SP-3 landed** + TR-1'), `${ARCH_TR_PATH} states TR-5's SP-3 precondition once`).toBe(1);
    expect(occurrences(ARCH, '**#27 TR-5 — THE PACT LANE** (flag `tradePactsEnabled`; needs GR-2/GR-3)'), `${ARCH_PATH} resolves TR-5 to GR-2/GR-3 once`).toBe(1);
    // SP-3's identity is the SPINE volume's own heading, and GRAMMAR is named as its
    // home there — which is what makes `pactFormationEnabled` the right key rather
    // than a guess.
    const spine = normalise(readDoc('docs/DESIGN_FP_SPINE.md'));
    expect(occurrences(spine, 'SP-3 THE PACT GRAMMAR'), 'the SPINE volume names SP-3 once').toBe(1);
    expect(occurrences(spine, "SP-3 IS this program's core"), 'the SPINE volume homes SP-3 in GRAMMAR once').toBe(1);
  });
});

describe('TR-9c THE LIGHTING-ORDER LAW: a flag lit out of order is an invalid config', () => {
  test('all three volumes carry the law, each exactly once in its own words', () => {
    expect(occurrences(TRADE, 'a flag lit out of order is an invalid config the TR-9 certification walker reds')).toBe(1);
    expect(occurrences(ARCH_TR, 'a flag lit out of order is an invalid config it reds')).toBe(1);
    expect(occurrences(ARCH, "a flag lit out of order is an invalid config each program's convergence walker reds")).toBe(1);
    expect(occurrences(ARCH, 'the kind-availability walker (a flag lit out of order is an invalid config)')).toBe(1);
  });

  test('the fully dark config is VALID — dormancy is not disorder', () => {
    for (const rules of [{}, undefined, null, 'not a config', []]) {
      const verdict = evaluateTradeFlagLighting(rules);
      expect(verdict.ok, `${JSON.stringify(rules) ?? 'undefined'} must be a valid config`).toBe(true);
      expect(verdict.violations).toEqual([]);
    }
  });

  test("THE INDEPENDENT DENOMINATOR: every lighting row matches the volume's own dependency clause", () => {
    const problems = [];
    for (const row of TRADE_FLAG_LIGHTING_ROWS) {
      const clause = VOLUME_DEPENDENCY_CLAUSES[row.wave];
      if (clause === undefined) {
        // TR-1 is the root: the volume states no clause for it, and the table must
        // agree by requiring nothing. Both halves are asserted, so a clause quietly
        // appearing for TR-1 cannot pass unnoticed either.
        if (row.wave !== 'TR-1') problems.push(`${row.wave}: no volume clause transcribed`);
        if (allPreconditions(row).length !== 0) {
          problems.push(`${row.wave} declares preconditions but the volume states no dependency clause for it`);
        }
        if (occurrences(TRADE, `${row.wave} ⇒`) !== 0) {
          problems.push(`${TRADE_PATH} now states a dependency clause for ${row.wave} — transcribe it here`);
        }
        continue;
      }
      const found = occurrences(TRADE, clause);
      if (found !== 1) {
        problems.push(`${row.wave}: its clause appears ${found} times in ${TRADE_PATH} (need exactly 1) — the ruling was re-worded; re-transcribe it`);
        continue;
      }
      const { flags, unresolved } = parseDependencyClause(clause);
      if (unresolved.length > 0) {
        problems.push(`${row.wave}: the clause names terms this walker cannot resolve: ${unresolved.join(', ')}`);
      }
      const declared = [...allPreconditions(row)].sort();
      const fromVolume = [...flags].sort();
      if (JSON.stringify(declared) !== JSON.stringify(fromVolume)) {
        problems.push(`${row.wave} (${row.flag}): the table requires [${declared.join(', ')}] but ${TRADE_PATH} rules [${fromVolume.join(', ')}]`);
      }
    }
    expect(
      problems,
      'the lighting table drifted from the flag-dependency ruling it compiles',
    ).toEqual([]);
  });

  test('the clause parser is proven on a synthetic clause, both arms', () => {
    // Guard the guard: if `parseDependencyClause` silently returned nothing, the
    // census above would pass on two empty lists forever.
    const parsed = parseDependencyClause('TR-9 ⇒ TR-2 + SP-1 landed + `commonsVoiceEnabled` (an aside naming TR-4);');
    expect(parsed.flags).toEqual([
      'merchantHousesEnabled', 'errandSpineEnabled', 'commonsVoiceEnabled',
    ]);
    expect(parsed.unresolved).toEqual([]);
    // anchored: an unknown term must surface as unresolved rather than vanish.
    expect(parseDependencyClause('TR-9 ⇒ WR-99 + `noSuchThing`;').unresolved).toEqual(['WR-99']);
  });

  test('the dependency graph is acyclic by construction: every TRADE precondition lights earlier', () => {
    const orderOf = new Map(TRADE_FLAG_LIGHTING_ROWS.map((row) => [row.flag, row.order]));
    const problems = [];
    for (const row of TRADE_FLAG_LIGHTING_ROWS) {
      for (const required of row.requiresTradeFlags) {
        const at = orderOf.get(required);
        if (at === undefined || at >= row.order) {
          problems.push(`${row.flag} (order ${row.order}) requires ${required} (order ${String(at)}) — lighting order is build order, so a precondition must light strictly earlier`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  test('BOTH ARMS, ALL EIGHT FLAGS: lit alone reds exactly its preconditions; lit in order reds none', () => {
    const problems = [];
    for (const row of TRADE_FLAG_LIGHTING_ROWS) {
      const needed = allPreconditions(row);

      const alone = evaluateTradeFlagLighting(litConfig(row.flag));
      const missed = alone.violations.map((violation) => violation.missing);
      if (JSON.stringify(missed) !== JSON.stringify(needed)) {
        problems.push(`${row.flag} lit alone reported [${missed.join(', ')}], expected [${needed.join(', ')}]`);
      }
      if (needed.length > 0 && alone.ok) {
        problems.push(`${row.flag} lit alone was accepted as a valid config`);
      }
      for (const violation of alone.violations) {
        if (violation.flag !== row.flag || violation.wave !== row.wave) {
          problems.push(`${row.flag}: a violation was attributed to ${violation.flag}/${violation.wave}`);
        }
        if (!violation.message.includes(violation.missing)) {
          problems.push(`${row.flag}: the violation message never names ${violation.missing}`);
        }
      }

      // THE LIT ARM. The same flag with every precondition satisfied must produce
      // nothing at all — the control that proves the red arm above measured the
      // table rather than complaining unconditionally.
      const satisfied = evaluateTradeFlagLighting(litConfig(row.flag, ...needed));
      const stillComplaining = satisfied.violations.filter((v) => v.flag === row.flag);
      if (stillComplaining.length > 0) {
        problems.push(`${row.flag} lit WITH ${needed.join(' + ')} still reported ${stillComplaining.map((v) => v.missing).join(', ')}`);
      }
    }
    expect(problems, 'the lighting law does not read its own table').toEqual([]);
  });

  test('the whole family lit in build order is a valid config', () => {
    const everything = litConfig(
      ...TRADE_RULINGS_FLAG_KEYS,
      ...TRADE_FOREIGN_PRECONDITION_FLAGS.map((row) => row.flag),
    );
    expect(evaluateTradeFlagLighting(everything)).toEqual({ ok: true, violations: [] });
  });

  test('DARK-NEVER-PERMISSIVE: only a strict true lights a flag or satisfies a precondition', () => {
    for (const impostor of [1, 'true', 'yes', {}, [], 'TRUE']) {
      // A precondition set to an impostor value is still DARK, so the lit flag reds.
      const verdict = evaluateTradeFlagLighting({
        merchantHousesEnabled: true,
        casusCommerciiEnabled: impostor,
      });
      expect(verdict.ok, `${JSON.stringify(impostor)} must not satisfy a precondition`).toBe(false);
      // …and a flag itself set to an impostor value is not lit, so nothing is judged.
      expect(
        evaluateTradeFlagLighting({ merchantHousesEnabled: impostor }).violations,
        `${JSON.stringify(impostor)} must not light a flag`,
      ).toEqual([]);
    }
    // false is the ordinary dark spelling and behaves identically to absent.
    expect(evaluateTradeFlagLighting({ merchantHousesEnabled: false }).violations).toEqual([]);
  });

  test('a partial ladder reds every step it skipped, and only those', () => {
    // TR-6 needs TR-2 + TR-3 + TR-4 + the commons. Light it with the houses only:
    // the three genuinely missing preconditions must each be named, once.
    const verdict = evaluateTradeFlagLighting(
      litConfig('corneringEnabled', 'merchantHousesEnabled', 'casusCommerciiEnabled'),
    );
    expect(verdict.ok).toBe(false);
    expect(verdict.violations.map((v) => v.missing)).toEqual([
      'believedMarketsEnabled', 'foodCaravansEnabled', 'commonsVoiceEnabled',
    ]);
    expect(verdict.violations.map((v) => v.kind)).toEqual([
      'trade_precondition_dark', 'trade_precondition_dark', 'foreign_precondition_dark',
    ]);
  });

  test('the degraded arms are declarations, never gates — and none of them is dead', () => {
    const knownFlags = new Set([
      ...TRADE_RULINGS_FLAG_KEYS,
      ...TRADE_FOREIGN_PRECONDITION_FLAGS.map((row) => row.flag),
    ]);
    for (const arm of TRADE_DEGRADED_ARMS) {
      expect(knownFlags.has(arm.flag), `${arm.arm} hangs off unknown flag ${arm.flag}`).toBe(true);
      expect(knownFlags.has(arm.darkWithoutFlag), `${arm.arm} names unknown flag ${arm.darkWithoutFlag}`).toBe(true);
      expect(arm.degradesTo.length, `${arm.arm} must say what it falls back to`).toBeGreaterThan(10);
      // THE DEAD-BAND CHECK (L1). An arm whose dark-partner is also a HARD
      // precondition of the same flag can never be reached: the flag would refuse
      // to light first. Such a row must not exist.
      const row = TRADE_FLAG_LIGHTING_ROWS.find((r) => r.flag === arm.flag);
      expect(
        allPreconditions(row).includes(arm.darkWithoutFlag),
        `${arm.flag}'s "${arm.arm}" degrades when ${arm.darkWithoutFlag} is dark, but that`
        + ' key is also a HARD precondition of the same flag — the arm is unreachable',
      ).toBe(false);
      // …and lighting the flag with its hard preconditions but WITHOUT the arm's
      // partner is a valid config, which is what makes the degraded arm reachable.
      const reachable = evaluateTradeFlagLighting(litConfig(arm.flag, ...allPreconditions(row)));
      expect(reachable.violations.filter((v) => v.flag === arm.flag)).toEqual([]);
    }
  });
});

describe('TR-9c KIND AVAILABILITY: a sequencing zero is not a decoration zero', () => {
  test('the all-dark config can mint nothing, and says so for every ending', () => {
    const rows = tradeEndingAvailability({});
    expect(rows.map((row) => row.ending)).toEqual([...TRADE_ENDING_KEYS]);
    for (const row of rows) {
      expect(row.state, `${row.ending} must be UNMINTABLE_BY_CONFIG under a dark world`)
        .toBe('UNMINTABLE_BY_CONFIG');
      expect(row.blockedBy.length).toBeGreaterThan(0);
    }
  });

  test('both availability states are reachable — neither is a dead vocabulary member', () => {
    const observed = new Set();
    for (const row of tradeEndingAvailability({})) observed.add(row.state);
    const allLit = litConfig(
      ...TRADE_RULINGS_FLAG_KEYS,
      ...TRADE_FOREIGN_PRECONDITION_FLAGS.map((row) => row.flag),
    );
    for (const row of tradeEndingAvailability(allLit)) observed.add(row.state);
    expect([...observed].sort()).toEqual([...TRADE_ENDING_AVAILABILITY_STATES].sort());
  });

  test('every ending becomes mintable under exactly its own declared conjunction', () => {
    const problems = [];
    for (const row of TRADE_ENDING_MINT_ROWS) {
      const lit = tradeEndingAvailability(litConfig(...row.requiresFlags))
        .find((r) => r.ending === row.ending);
      if (lit.state !== 'MINTABLE') problems.push(`${row.ending} stayed ${lit.state} with ${row.requiresFlags.join(' + ')} lit`);
      // Drop each required flag in turn: every one of them must matter.
      for (const dropped of row.requiresFlags) {
        const partial = row.requiresFlags.filter((flag) => flag !== dropped);
        const without = tradeEndingAvailability(litConfig(...partial))
          .find((r) => r.ending === row.ending);
        if (without.state !== 'UNMINTABLE_BY_CONFIG' || !without.blockedBy.includes(dropped)) {
          problems.push(`${row.ending} did not need ${dropped} — a decorative precondition`);
        }
      }
    }
    expect(problems, 'the availability read does not match the mint table').toEqual([]);
  });

  test('collapse reports an HONEST PERMANENT ZERO only for the dark route lifecycle', () => {
    const darkLifecycle = tradeEndingAvailability(litConfig('foodCaravansEnabled'))
      .find((row) => row.ending === 'collapse');
    expect(darkLifecycle.state).toBe('UNMINTABLE_BY_CONFIG');
    expect(darkLifecycle.blockedBy).toEqual(['routeLifecycleEnabled']);
    expect(darkLifecycle.honestPermanentZero).toBe(true);

    // THE OTHER ARM: collapse blocked because the GRAIN ROAD is dark is an ordinary
    // dark-wave zero, not the volume's honest permanent zero. Conflating the two
    // would let a sequencing excuse cover a real gap.
    const darkGrain = tradeEndingAvailability(litConfig('routeLifecycleEnabled'))
      .find((row) => row.ending === 'collapse');
    expect(darkGrain.blockedBy).toEqual(['foodCaravansEnabled']);
    expect(darkGrain.honestPermanentZero).toBe(false);

    // …and no other ending ever claims it, in any config.
    for (const rules of [{}, litConfig('foodCaravansEnabled'), litConfig('corneringEnabled')]) {
      const claimants = tradeEndingAvailability(rules)
        .filter((row) => row.honestPermanentZero)
        .map((row) => row.ending);
      expect(claimants.every((ending) => ending === 'collapse')).toBe(true);
    }
  });
});

describe('TR-9c the observation shape: a totality wall that is proven to see', () => {
  test('the empty observation is structurally valid and deliberately ineligible', () => {
    const empty = createEmptyTradeConvergenceObservation();
    const verdict = validateTradeConvergenceObservation(empty);
    expect(verdict.errors).toEqual([]);
    expect(verdict.ok).toBe(true);
    expect(empty.schemaVersion).toBe(TRADE_CONVERGENCE_OBSERVATION_VERSION);
    expect(Object.keys(empty.endingsMix).sort()).toEqual([...TRADE_ENDING_KEYS].sort());
    expect(Object.values(empty.endingsMix).every((count) => count === 0)).toBe(true);
    expect(empty.flagCertificationRows.map((row) => row.rule)).toEqual([...TRADE_RULINGS_FLAG_KEYS]);
    expect(empty.flagCertificationRows.every((row) => row.verdict === 'UNOBSERVED')).toBe(true);
  });

  test('the empty availability block is DERIVED from the all-dark reading, not authored twice', () => {
    const empty = createEmptyTradeConvergenceObservation();
    const derived = Object.fromEntries(
      tradeEndingAvailability({}).map((row) => [row.ending, row.state]),
    );
    expect(empty.endingAvailability).toEqual(derived);
  });

  test('every failure mode of the wall REDS on a synthetic observation', () => {
    /** @param {(o: any) => void} mutate @returns {string[]} */
    const errorsAfter = (mutate) => {
      const observation = createEmptyTradeConvergenceObservation();
      mutate(observation);
      return validateTradeConvergenceObservation(observation).errors;
    };
    const cases = [
      ['a non-object', () => validateTradeConvergenceObservation(42).errors],
      ['a wrong schema version', () => errorsAfter((o) => { o.schemaVersion = 2; })],
      ['a wrong kind', () => errorsAfter((o) => { o.kind = 'war_convergence_observation'; })],
      ['a missing ending', () => errorsAfter((o) => { delete o.endingsMix.cornered; })],
      ['an unknown ending', () => errorsAfter((o) => { o.endingsMix.bankruptcy = 0; })],
      ['a negative count', () => errorsAfter((o) => { o.endingsMix.ruin = -1; })],
      ['a fractional count', () => errorsAfter((o) => { o.endingsMix.ruin = 1.5; })],
      ['a missing availability', () => errorsAfter((o) => { delete o.endingAvailability.collapse; })],
      ['an unknown availability state', () => errorsAfter((o) => { o.endingAvailability.collapse = 'UNBUILT'; })],
      ['a missing flag row', () => errorsAfter((o) => { o.flagCertificationRows.pop(); })],
      ['a duplicated flag row', () => errorsAfter((o) => { o.flagCertificationRows.push(o.flagCertificationRows[0]); })],
      ['an unknown flag row', () => errorsAfter((o) => { o.flagCertificationRows[0].rule = 'warTerminationEnabled'; })],
      ['an unknown verdict', () => errorsAfter((o) => { o.flagCertificationRows[0].verdict = 'FINE'; })],
      ['off without DORMANT_BY_CONFIG', () => errorsAfter((o) => { o.flagCertificationRows[0].ruleState = 'off'; })],
      ['a verdict claimed from an unknown rule state', () => errorsAfter((o) => { o.flagCertificationRows[0].verdict = 'ALIVE'; })],
    ];
    const silent = cases.filter(([, run]) => run().length === 0).map(([label]) => label);
    expect(silent, 'the totality wall accepted a broken observation').toEqual([]);
  });

  test('THE CROSS-FIELD HONESTY WALL: counting an ending it declares unmintable is refused', () => {
    const observation = createEmptyTradeConvergenceObservation();
    observation.endingsMix.collapse = 3;
    const refused = validateTradeConvergenceObservation(observation);
    expect(refused.ok).toBe(false);
    expect(refused.errors.some((error) => error.includes('could not mint'))).toBe(true);

    // THE LIT ARM: the same count with the availability honestly MINTABLE passes, so
    // the wall refuses the LIE rather than the number.
    observation.endingAvailability.collapse = 'MINTABLE';
    expect(validateTradeConvergenceObservation(observation).errors).toEqual([]);
  });

  test('a zero beside UNMINTABLE_BY_CONFIG is always accepted — sequencing never fails a wall', () => {
    const observation = createEmptyTradeConvergenceObservation();
    for (const key of TRADE_ENDING_KEYS) {
      expect(observation.endingAvailability[key]).toBe('UNMINTABLE_BY_CONFIG');
      expect(observation.endingsMix[key]).toBe(0);
    }
    expect(validateTradeConvergenceObservation(observation).ok).toBe(true);
  });
});
