#!/usr/bin/env node
/**
 * evaluate-receipt.mjs — the CLI that points the tripwire registry at a receipt
 * (SOAKCHAIN Car 2; DESIGN_HORIZON §1.6, §4.1).
 *
 *   node scripts/soak/evaluate-receipt.mjs <receipt.json> [--profile <name>]
 *                                          [--rolling] [--restored]
 *                                          [--behavioral-passing|--behavioral-failing]
 *                                          [--json] [--annotated <path>]
 *   node scripts/soak/evaluate-receipt.mjs --aggregate <realm-scale-evidence.json>
 *
 * EXIT STATUS, AND WHY THERE ARE THREE:
 *   0  every DETERMINISTIC row is silent (host-observability firings are printed, never
 *      graded — SK-2A: eight pooled workers sharing memory bandwidth fire duration and
 *      memory rows a solo run never sees, so grading them would break SK-1's in-pool ≡
 *      solo proof by construction)
 *   1  at least one deterministic row fired — the run is not clean and the job is red
 *   2  A REFUSAL, NOT A FINDING. No path given, the file is missing, or it is not JSON.
 *      Collapsing this into 1 would let a typo'd artifact path read exactly like a world
 *      defect, and the weekly job's red would name the wrong thing.
 *
 * It is a STEP on the weekly `world-soak` job and on the research job, both with
 * `if: always()`, so a soak that failed is still evaluated — a red run is precisely the one
 * whose findings a reader wants named.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { aggregateReceiptPaths, evaluateReceipt, summarizeEvaluations } from './evaluate.mjs';

const REFUSAL = 2;

function argOf(argv, name, fallback = null) {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 && argv[index + 1] != null && !String(argv[index + 1]).startsWith('--')
    ? argv[index + 1]
    : fallback;
}

function readJson(path) {
  const text = readFileSync(path, 'utf8');
  return JSON.parse(text);
}

/**
 * Print one cell's firings with its address — the news address law, on a CLI.
 *
 * ⛔ THE OBSERVABILITY CHANNEL CARRIES TWO KINDS SINCE §909 CAR 5, AND THE PRINTER SAYS
 * WHICH. A host-observability firing is a wall-clock or heap reading that must never gate
 * anything; an `inconclusive` entry is a DETERMINISTIC row that ran and could not conclude
 * because the run was shorter than the horizon it grades. Printing the second under the
 * first's label would be the false-report class arriving in the one place a reader looks.
 */
function printFirings(label, findings, observability) {
  for (const firing of findings) {
    console.log(`  FINDING  ${label} · ${firing.id} — ${firing.detail}`);
  }
  for (const firing of observability) {
    console.log(firing.inconclusive
      ? `  horizon  ${label} · ${firing.id} — ${firing.detail} (the row RAN; the run was too short to conclude)`
      : `  observe  ${label} · ${firing.id} — ${firing.detail} (host-observability; never a finding)`);
  }
}

export function main(argv = process.argv.slice(2)) {
  const aggregatePath = argOf(argv, 'aggregate');
  const behavioral = argv.includes('--behavioral-passing')
    ? true
    : (argv.includes('--behavioral-failing') ? false : null);
  const options = {
    profile: String(argOf(argv, 'profile', '') || ''),
    rolling: argv.includes('--rolling'),
    restored: argv.includes('--restored'),
    behavioralPropertiesPassing: behavioral,
  };

  /** @type {Array<{key: string, findings: Array<object>, observability: Array<object>}>} */
  const rows = [];
  let annotated = null;

  if (aggregatePath) {
    const resolved = resolve(aggregatePath);
    let aggregate;
    try {
      aggregate = readJson(resolved);
    } catch (error) {
      console.error(`REFUSED: cannot read the aggregate ${resolved} — ${error instanceof Error ? error.message : String(error)}`);
      return REFUSAL;
    }
    const paths = aggregateReceiptPaths(aggregate, dirname(resolved));
    if (!paths.length) {
      console.error(`REFUSED: ${resolved} names no caseReceipts — an aggregate that evaluated nothing is not a clean aggregate`);
      return REFUSAL;
    }
    console.log(`# tripwire evaluation — aggregate ${aggregate.profile || 'unknown profile'}, ${paths.length} case receipt(s)`);
    for (const path of paths) {
      let child;
      try {
        child = readJson(path);
      } catch (error) {
        console.error(`REFUSED: cannot read the case receipt ${path} — ${error instanceof Error ? error.message : String(error)}`);
        return REFUSAL;
      }
      const key = String(child.caseId || child.seed || path);
      const evaluated = evaluateReceipt(child, options);
      rows.push({ key, findings: evaluated.findings, observability: evaluated.observability });
      printFirings(key, evaluated.findings, evaluated.observability);
    }
  } else {
    const receiptPath = argv.find((entry) => !entry.startsWith('--') && entry.endsWith('.json'));
    if (!receiptPath) {
      console.error('REFUSED: name a receipt path, or --aggregate <realm-scale-evidence.json>');
      return REFUSAL;
    }
    const resolved = resolve(receiptPath);
    let receipt;
    try {
      receipt = readJson(resolved);
    } catch (error) {
      console.error(`REFUSED: cannot read the receipt ${resolved} — ${error instanceof Error ? error.message : String(error)}`);
      return REFUSAL;
    }
    const key = String(receipt.caseId || receipt.seed || resolved);
    const evaluated = evaluateReceipt(receipt, options);
    annotated = evaluated.annotated;
    rows.push({ key, findings: evaluated.findings, observability: evaluated.observability });
    console.log(`# tripwire evaluation — ${key} (${receipt.years ?? '?'}y × ${receipt.settlements ?? '?'}s, schema ${receipt.schemaVersion ?? '?'})`);
    printFirings(key, evaluated.findings, evaluated.observability);
    console.log(
      `  annotation: deterministicFirings ${evaluated.deterministicFirings}`
      + ` · fullInstrument ${annotated.fullInstrument}`
      + ` · provisional ${annotated.provisional}`
      + ` · rolling ${annotated.rolling}`
      + ` · restored ${annotated.restored}`
      + ` · behavioralPropertiesPassing ${'behavioralPropertiesPassing' in annotated ? annotated.behavioralPropertiesPassing : 'UNSTATED'}`,
    );
  }

  const report = summarizeEvaluations(rows);
  const annotatedPath = argOf(argv, 'annotated');
  if (annotatedPath && annotated) {
    const target = resolve(annotatedPath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${JSON.stringify(annotated, null, 2)}\n`);
    console.log(`annotated receipt: ${target}`);
  }
  if (argv.includes('--json')) console.log(`\n${JSON.stringify(report, null, 2)}`);
  const inconclusive = report.observability.filter((firing) => firing.inconclusive).length;
  console.log(
    `\n${report.deterministicFirings ? `FIRED: ${report.deterministicFirings} deterministic finding(s)` : 'OK — no deterministic tripwire fired'}`
    + ` over ${report.cells} cell(s); ${report.observability.length - inconclusive} host-observability note(s)`
    + `; ${inconclusive} row(s) COMPLETE BUT INCONCLUSIVE (the run was shorter than the horizon they grade)`,
  );
  return report.deterministicFirings ? 1 : 0;
}

if (process.argv[1] && process.argv[1].endsWith('evaluate-receipt.mjs')) {
  process.exit(main());
}
