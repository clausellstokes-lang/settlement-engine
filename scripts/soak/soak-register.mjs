#!/usr/bin/env node
/**
 * soak-register.mjs — the soak register's CLI (SOAKCHAIN Car 4; DESIGN_HORIZON §1.6, §4.1).
 *
 *   node scripts/soak/soak-register.mjs --compare --receipt <receipt.json>
 *        [--profile <name>] [--case-id <id>] [--solo] [--propose <path>]
 *
 *   SOAK_REGISTER_REFREEZE='<seat>' SOAK_REGISTER_NOTE='<why>' \
 *   node scripts/soak/soak-register.mjs --write --receipt <receipt.json> \
 *        [--charter=§NNN] [--solo]
 *
 * ⛔ CI NEVER WRITES THE REGISTER. It runs `--compare … --propose` and uploads the
 * proposal; the chair mints on a clean tree. The FIRST clean run is the freeze act itself.
 *
 * ⛔ `--write` EXITS NON-ZERO BY DESIGN. A write changes the very baseline the caller was
 * measuring against, so its own run can no longer be a green: the next PLAIN `--compare` is
 * the evidence, and a workflow that treated the write as a pass would be reading a
 * tautology. (The estate's own re-freeze idiom, verbatim in spirit.)
 *
 * ⛔⛔ THE GOVERNED GROWTH DOOR ⟦A22 E6⟧⟦CHAIR-R6⟧. Raising a `shrink` figure or lowering a
 * `floor` figure is REFUSED even when declared, unless the write carries BOTH a
 * `--charter=§NNN` AND a `SOAK_REGISTER_NOTE` of at least 60 characters. The design's own
 * `SOAK_REGISTER_ALLOW_DEBT` clause was an env var plus free text and was defined nowhere —
 * the weakest of the estate's four growth doors, and enough to let a runaway be banked by
 * note. Every such move appends a `debtHistory` row, and the debt population is printed by
 * every later `--compare` as a standing HOLD line.
 *
 * EXIT STATUS: 0 clean or not-executable · 1 findings, or a write completed (by design) ·
 * 2 a REFUSAL (bad arguments, a dirty tree, an unmintable receipt, an ungoverned debt).
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { evaluateReceipt } from './evaluate.mjs';
import {
  REGISTER_VERSION,
  applyRefreeze,
  cellIsFrozen,
  cellKeyOf,
  compareRegister,
  debtFiguresOf,
  deriveRegisterFigures,
  mintRefusals,
} from './register.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_REGISTER = join(ROOT, 'tests/soak-harness/.soak-register.json');
const MIN_DEBT_NOTE_CHARS = 60;
const REFUSAL = 2;

function argOf(argv, name, fallback = null) {
  const inline = argv.find((entry) => entry.startsWith(`--${name}=`));
  if (inline) return inline.slice(name.length + 3);
  const index = argv.indexOf(`--${name}`);
  return index >= 0 && argv[index + 1] != null && !String(argv[index + 1]).startsWith('--')
    ? argv[index + 1]
    : fallback;
}

/** The tree must be clean, or the sha the cell records names a state that never existed. */
export function dirtyTreeRefusals(cwd = ROOT, run = execFileSync) {
  try {
    const porcelain = String(run('git', ['status', '--porcelain'], { cwd, encoding: 'utf8' })).trim();
    if (porcelain) {
      const lines = porcelain.split('\n').slice(0, 5);
      return [
        'REFUSED: the tree is DIRTY, so `frozenAtSha` would name a state that never existed.',
        ...lines.map((line) => `  ${line}`),
      ];
    }
    return [];
  } catch (error) {
    return [`REFUSED: cannot read the tree state — ${error instanceof Error ? error.message : String(error)}`];
  }
}

/** The committed tip, for `frozenAtSha`. */
function headSha(cwd = ROOT) {
  return String(execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' })).trim();
}

function writeJsonAtomically(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, path);
}

/** Every figure ever banked in the wrong direction, across every cell. */
export function debtPopulationOf(register) {
  const rows = [];
  for (const [key, cell] of Object.entries(register?.cells || {})) {
    for (const entry of Array.isArray(cell?.debtHistory) ? cell.debtHistory : []) {
      rows.push({ key, ...entry });
    }
  }
  return rows;
}

export function main(argv = process.argv.slice(2), env = process.env) {
  const wantsWrite = argv.includes('--write');
  const wantsCompare = argv.includes('--compare');
  if (wantsWrite === wantsCompare) {
    console.error('REFUSED: name exactly one of --compare or --write');
    return REFUSAL;
  }
  const registerPath = resolve(String(argOf(argv, 'register', DEFAULT_REGISTER)));
  const aggregatePath = argOf(argv, 'aggregate');
  const solo = argv.includes('--solo');
  // The repository the clean-tree refusal and `frozenAtSha` are read from. It is the estate
  // by default and is only ever redirected by a test's own temporary git fixture — a write
  // must never record a sha from a tree other than the one it measured.
  const repo = resolve(String(argOf(argv, 'repo', ROOT)));

  let register;
  try {
    register = JSON.parse(readFileSync(registerPath, 'utf8'));
  } catch (error) {
    console.error(`REFUSED: cannot read the register ${registerPath} — ${error instanceof Error ? error.message : String(error)}`);
    return REFUSAL;
  }

  // ⚠ A CI STEP MUST NOT SPELL THE CHILD RECEIPT'S PATH BY HAND. `--aggregate` resolves it
  // the way the aggregate itself names it, so a profile change cannot leave the workflow
  // silently comparing nothing — the ONE case receipt is read from `caseReceipts`.
  let receiptPath = argOf(argv, 'receipt');
  let aggregateProfile = '';
  if (aggregatePath && !receiptPath) {
    const resolvedAggregate = resolve(String(aggregatePath));
    let aggregate;
    try {
      aggregate = JSON.parse(readFileSync(resolvedAggregate, 'utf8'));
    } catch (error) {
      console.error(`REFUSED: cannot read the aggregate ${resolvedAggregate} — ${error instanceof Error ? error.message : String(error)}`);
      return REFUSAL;
    }
    const listed = Array.isArray(aggregate?.caseReceipts) ? aggregate.caseReceipts : [];
    if (listed.length !== 1) {
      console.error(`REFUSED: the register compares ONE cell at a time; ${resolvedAggregate} names ${listed.length} case receipt(s)`);
      return REFUSAL;
    }
    receiptPath = join(dirname(resolvedAggregate), String(listed[0]));
    aggregateProfile = String(aggregate?.profile || '');
  }
  if (!receiptPath) {
    console.error('REFUSED: --receipt <path> or --aggregate <path> is required; the register is derived from a run, never typed in');
    return REFUSAL;
  }

  let receipt;
  try {
    receipt = JSON.parse(readFileSync(resolve(String(receiptPath)), 'utf8'));
  } catch (error) {
    console.error(`REFUSED: cannot read the receipt ${receiptPath} — ${error instanceof Error ? error.message : String(error)}`);
    return REFUSAL;
  }

  const profile = String(argOf(argv, 'profile', '') || aggregateProfile || receipt.profile || '');
  const caseId = String(argOf(argv, 'case-id', '') || receipt.caseId || '');
  const key = cellKeyOf({ profile, caseId });
  const annotated = evaluateReceipt(receipt, { profile, rolling: argv.includes('--rolling') }).annotated;
  const measured = deriveRegisterFigures(annotated);
  const committed = register?.cells?.[key];

  const debt = debtPopulationOf(register);
  if (debt.length) {
    console.log(`HOLD: ${debt.length} figure(s) have been banked in the wrong direction and stay on the record:`);
    for (const row of debt) console.log(`  ${row.key} · ${row.figure} ${JSON.stringify(row.from)} → ${JSON.stringify(row.to)} (${row.charter}, ${row.seat}, ${row.date})`);
  }

  if (!committed) {
    console.error(`REFUSED: the register has no cell "${key}"; add its genesis row before measuring against it`);
    return REFUSAL;
  }

  if (wantsCompare) {
    const proposal = {
      kind: 'soak_register_proposal',
      registerVersion: REGISTER_VERSION,
      cellKey: key,
      identity: measured.identity,
      figures: measured.figures,
      shapes: measured.shapes,
      mintRefusals: mintRefusals(annotated),
      proposedAt: new Date().toISOString(),
    };
    const proposePath = argOf(argv, 'propose');
    if (proposePath) {
      writeJsonAtomically(resolve(String(proposePath)), proposal);
      console.log(`proposal: ${resolve(String(proposePath))}`);
    }
    if (!cellIsFrozen(committed)) {
      // §206.2b's third status, on the register. An UNFROZEN genesis cell has nothing to
      // compare against; reporting that as a pass or as a finding would both be lies.
      console.log(`NOT-EXECUTABLE  ${key} — the cell is UNFROZEN genesis: ${committed?.note || 'no committed figures'}`);
      console.log(`  measured ${Object.keys(measured.figures).length} figure(s); the FIRST clean run is the freeze act`);
      return 0;
    }
    const findings = compareRegister(committed, measured, { solo });
    for (const finding of findings) {
      console.log(`  FINDING  ${key} · ${finding.kind} · ${finding.detail}`);
    }
    console.log(
      `\n${findings.length ? `${findings.length} register finding(s)` : 'OK — every committed figure holds'}`
      + ` for ${key}${solo ? '' : ' (ceiling figures skipped: not a solo run — SK-2A)'}`,
    );
    return findings.length ? 1 : 0;
  }

  // ── THE WRITE ────────────────────────────────────────────────────────────────
  const seat = String(env.SOAK_REGISTER_REFREEZE || '').trim();
  const note = String(env.SOAK_REGISTER_NOTE || '').trim();
  const declared = String(env.SOAK_REGISTER_DECLARED || '').trim();
  const charter = String(argOf(argv, 'charter', '') || '').trim();
  if (!seat) {
    console.error('REFUSED: SOAK_REGISTER_REFREEZE=<seat> is required — a refreeze is signed, never anonymous');
    return REFUSAL;
  }
  if (!note) {
    console.error('REFUSED: SOAK_REGISTER_NOTE=<why> is required — a figure that moved without a stated reason is a figure nobody can audit');
    return REFUSAL;
  }
  const dirty = dirtyTreeRefusals(repo);
  if (dirty.length) {
    for (const line of dirty) console.error(line);
    return REFUSAL;
  }
  const refusals = mintRefusals(annotated);
  if (refusals.length) {
    console.error(`REFUSED to mint ${key} from this receipt:`);
    for (const line of refusals) console.error(`  ${line}`);
    return REFUSAL;
  }

  const debtFigures = cellIsFrozen(committed) ? debtFiguresOf(committed, measured) : [];
  const movedFigures = cellIsFrozen(committed)
    ? compareRegister(committed, measured, { solo: true }).map((finding) => finding.figure)
    : [];
  const undeclared = movedFigures.filter((figure) => !declared.split(',').map((entry) => entry.trim()).includes(figure));
  if (movedFigures.length && undeclared.length) {
    console.error(`REFUSED: ${undeclared.length} figure(s) moved and were not declared in SOAK_REGISTER_DECLARED:`);
    for (const figure of undeclared) console.error(`  ${figure}`);
    return REFUSAL;
  }
  if (debtFigures.length) {
    if (!charter) {
      console.error(`REFUSED: ${debtFigures.length} figure(s) would be banked in the WRONG direction and no --charter=§NNN was given:`);
      for (const figure of debtFigures) console.error(`  ${figure}`);
      console.error('  an env var and a free-text note is the weakest of the four growth doors — it is exactly how a runaway gets banked by note');
      return REFUSAL;
    }
    if (note.length < MIN_DEBT_NOTE_CHARS) {
      console.error(`REFUSED: banking ${debtFigures.length} figure(s) in the wrong direction needs a SOAK_REGISTER_NOTE of at least ${MIN_DEBT_NOTE_CHARS} characters; got ${note.length}`);
      return REFUSAL;
    }
  }

  const next = applyRefreeze(register, {
    key,
    measured,
    frozenAtSha: headSha(repo),
    measuredBy: seat,
    date: new Date().toISOString().slice(0, 10),
    note,
    charter,
    debtFigures,
  });
  writeJsonAtomically(registerPath, next);
  console.log(`WROTE ${key} into ${registerPath}`);
  console.log(`  ${Object.keys(measured.figures).length} figure(s), frozenAtSha ${next.cells[key].frozenAtSha}, seat ${seat}`);
  if (debtFigures.length) {
    console.log(`  ⛔ ${debtFigures.length} figure(s) banked in the WRONG direction under ${charter}; each is now a permanent debtHistory row`);
  }
  // ⛔ NON-ZERO BY DESIGN — see the header. The write moved the baseline it was measured
  // against, so this run cannot also be its own green.
  console.log('\nEXIT 1 BY DESIGN: the register moved. Re-run the plain --compare; THAT is the evidence.');
  return 1;
}

if (process.argv[1] && process.argv[1].endsWith('soak-register.mjs')) {
  process.exit(main());
}
