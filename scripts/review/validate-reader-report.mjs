#!/usr/bin/env node
/**
 * validate-reader-report.mjs — the gate every reader report passes BEFORE anyone reads it.
 *
 * THE POINT. A panel's findings are only worth the discipline of the report that carries
 * them, and a report nobody validated is a report whose omissions are invisible. This runs
 * `validateReaderReport` over one or more report files and exits non-zero on the first
 * refusal, so an unvalidatable report cannot reach the findings document at all.
 *
 * USAGE
 *   node scripts/review/validate-reader-report.mjs <report.json> [more.json ...]
 *   node scripts/review/validate-reader-report.mjs --histogram <report.json> [...]
 *
 * The locator resolver is deliberately PERMISSIVE here: a report is validated against its
 * own shape and vocabulary offline, while `citation_unresolvable` is the corpus runner's
 * refusal, made where the rendered documents actually exist.
 */
import { readFileSync } from 'node:fs';
import { validateReaderReport, visibilityHistogram } from './readerRubric.mjs';

const argv = process.argv.slice(2);
const wantHistogram = argv.includes('--histogram');
const paths = argv.filter((arg) => !arg.startsWith('--'));

if (paths.length === 0) {
  console.error('usage: validate-reader-report.mjs [--histogram] <report.json> [...]');
  process.exit(2);
}

const reports = [];
let refusalCount = 0;

for (const path of paths) {
  /** @type {Record<string, unknown>} */
  let report;
  try {
    report = JSON.parse(readFileSync(path, 'utf-8'));
  } catch (error) {
    console.error(`[reader-report] ${path}: unreadable — ${error.message}`);
    refusalCount += 1;
    continue;
  }
  reports.push(report);
  const { ok, refusals } = validateReaderReport(report, {}, () => true);
  if (ok) {
    console.log(`[reader-report] ${path}: OK`);
    continue;
  }
  refusalCount += refusals.length;
  console.error(`[reader-report] ${path}: ${refusals.length} refusal(s)`);
  for (const item of refusals) {
    console.error(`  ${item.code}  ${item.answerId ?? '-'}  ${item.detail}`);
  }
}

if (wantHistogram) {
  console.log(JSON.stringify(visibilityHistogram(reports), null, 2));
}

process.exit(refusalCount === 0 ? 0 : 1);
