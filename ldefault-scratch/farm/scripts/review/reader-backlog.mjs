#!/usr/bin/env node
/**
 * reader-backlog.mjs — the panel's findings become TYPED ROWS, or they do not land.
 *
 * THE DEFECT THIS EXISTS TO MAKE IMPOSSIBLE. A review discharges into a fix list, and a fix
 * list written in prose lets three things through that cost more than the defects they hide:
 *
 *   1. AN ENGINE CAR WEARING A PROSE CAR'S CLOTHES. "Just reword the sentence" is a
 *      PROSE_RENDER row when the writer lives in `src/domain/display`, and a PROSE_PERSISTED
 *      one — a golden re-record, owner-signed — when it lives under `worldPulse`, `region` or
 *      `spatial`, because that string was minted at tick time and written INTO the world. The
 *      class is decided by WHERE THE WRITER LIVES, never by how the symptom reads.
 *   2. AN OUTPUT-MOVING FIX WITH NO RECORD. A fix that moves a world hash is a same-seed
 *      shift whatever its class says, and THE PROMISE makes lived history immutable. It rides
 *      the golden door as a declared shift or it does not ride.
 *   3. A FINDING THAT NOBODY EVER REFUTED. Default REFUTED is the whole point of the refuter
 *      seat: a finding that was never attacked is an opinion with a ticket number.
 *
 * SO EVERY ROW IS VALIDATED BEFORE IT IS A ROW. `validateBacklogRow` (the rubric module) owns
 * the refusals; this file owns the MINTING — turning reports and refutations into rows, and
 * importing the writer-dark register's pending-surface entries as seeds so the static walker
 * and the human panel discharge into ONE list rather than two that disagree.
 *
 * `outputMoving` IS MEASURED BY THE CALLER, NEVER SELF-DECLARED. A row that declared its own
 * innocence would be worth nothing; the fix lane measures the moved goldens and the moved
 * world documents and hands them in.
 *
 * USAGE
 *   node scripts/review/reader-backlog.mjs --validate docs/review/reader-backlog.json
 *   node scripts/review/reader-backlog.mjs --seed-from-wrwalker
 *
 * EXITS 0 valid · 1 one or more refusals · 2 usage.
 *
 * PURE except at the CLI edge: the exported functions do no I/O.
 */
import { readFileSync } from 'node:fs';
import { validateBacklogRow } from './readerRubric.mjs';

/** A finding is REFUTED until a refuter says otherwise. */
export const REFUTATION_VERDICTS = Object.freeze(['CONFIRMED', 'ADJUSTED', 'REFUTED']);
export const DEFAULT_VERDICT = 'REFUTED';

/**
 * The verdict a finding carries. Absent, unknown or malformed all resolve to REFUTED, because
 * the one thing a missing refutation must never mean is "believed".
 *
 * @param {Record<string, any> | null | undefined} refutation
 * @returns {'CONFIRMED' | 'ADJUSTED' | 'REFUTED'}
 */
export function verdictOf(refutation) {
  const verdict = String(refutation?.verdict ?? '');
  return REFUTATION_VERDICTS.includes(verdict) ? /** @type {any} */ (verdict) : DEFAULT_VERDICT;
}

/**
 * Mint backlog rows from validated reader reports and the refutations over them.
 *
 * Only CONFIRMED and ADJUSTED findings become rows. A REFUTED finding is not discarded — it
 * is returned in `refuted` so the findings document can say what was looked at and dismissed,
 * which is the half of a review that usually goes missing.
 *
 * @param {Array<Record<string, any>>} reports
 * @param {Array<Record<string, any>>} refutations
 * @returns {{ rows: any[], refuted: any[] }}
 */
export function mintBacklogRows(reports, refutations = []) {
  const byFinding = new Map();
  for (const refutation of (Array.isArray(refutations) ? refutations : [])) {
    if (refutation?.findingId != null) byFinding.set(String(refutation.findingId), refutation);
  }

  const rows = [];
  const refuted = [];
  for (const report of (Array.isArray(reports) ? reports : [])) {
    const campaignId = report?.campaignId ?? null;
    const system = report?.system ?? null;
    for (const answer of (Array.isArray(report?.answers) ? report.answers : [])) {
      for (const finding of (Array.isArray(answer?.findings) ? answer.findings : [])) {
        const findingId = String(finding?.id ?? `${campaignId}:${system}:${answer?.questionId}`);
        const refutation = byFinding.get(findingId) ?? null;
        const verdict = verdictOf(refutation);
        const base = {
          id: findingId,
          campaignId,
          system,
          questionId: answer?.questionId ?? null,
          classification: finding?.classification ?? null,
          carClass: finding?.carClass ?? 'NONE',
          writerPath: finding?.writerPath ?? null,
          citations: Array.isArray(answer?.citations) ? answer.citations : [],
          verdict,
          // MEASURED by the fix lane, never by the reader. Absent means "not yet measured",
          // which is why the validator refuses a row that claims a move without a record
          // rather than one that has not measured yet.
          outputMoving: finding?.outputMoving ?? false,
          goldensMoved: Array.isArray(finding?.goldensMoved) ? finding.goldensMoved : [],
          worldDocsMoved: finding?.worldDocsMoved ?? false,
          shiftRecord: finding?.shiftRecord ?? null,
          ownerRow: finding?.ownerRow ?? null,
          source: 'panel',
        };
        if (verdict === 'REFUTED') refuted.push({ ...base, refutation });
        else rows.push(base);
      }
    }
  }
  return { rows, refuted };
}

/**
 * Import the writer-dark register's pending-surface entries as backlog seeds.
 *
 * These are the walker's static twin of the panel's `correct_but_invisible` finding: a writer
 * with no reader is, by construction, a fact the customer cannot see. They enter as DISPLAY
 * rows with the walker as their source, so a reader confirms or refutes them on the preview
 * corpus rather than the two instruments keeping separate lists that quietly disagree.
 *
 * @param {Array<Record<string, any>>} entries
 * @returns {any[]}
 */
export function importPendingSurfaceRows(entries) {
  return (Array.isArray(entries) ? entries : []).map((entry) => ({
    id: `wrwalker:${entry?.id ?? entry?.writer ?? entry?.path ?? 'unnamed'}`,
    campaignId: null,
    // ⚠ `system` IS OMITTED, NOT NULLED, AND THE DIFFERENCE IS LOAD-BEARING. `validateBacklogRow`
    // treats an explicit `system` as a claim and checks it against the closed vocabulary, so a
    // null one is refused as unknown — correctly, because null is not one of the seven systems.
    // A walker seed has no system until a reader assigns one, and ABSENT is how that is spelled.
    questionId: null,
    classification: 'correct_but_invisible',
    carClass: 'DISPLAY',
    writerPath: entry?.writer ?? entry?.path ?? null,
    citations: [],
    // A seed has NOT been refuted, and saying REFUTED would be a lie in the safe direction;
    // it is unverdicted until a reader reaches it, and `validateBacklog` says so.
    verdict: null,
    outputMoving: false,
    goldensMoved: [],
    worldDocsMoved: false,
    shiftRecord: null,
    ownerRow: null,
    source: 'wrwalker',
  }));
}

/**
 * Validate a whole backlog. Every row goes through the rubric's own refusals, plus the two
 * this file owns: a duplicate id (two lanes would fix the same thing twice, or worse, one
 * would revert the other) and a panel row with no verdict (a finding nobody refuted).
 *
 * @param {Array<Record<string, any>>} rows
 * @returns {{ ok: boolean, refusals: any[] }}
 */
export function validateBacklog(rows) {
  const refusals = [];
  const list = Array.isArray(rows) ? rows : [];
  const seen = new Map();

  for (const row of list) {
    const id = row?.id ?? null;
    seen.set(String(id), (seen.get(String(id)) || 0) + 1);
    const { refusals: rowRefusals } = validateBacklogRow(row);
    for (const item of rowRefusals) refusals.push({ ...item, id });
    if (row?.source === 'panel' && !REFUTATION_VERDICTS.includes(String(row?.verdict))) {
      refusals.push({ code: 'unknown_vocabulary', id, detail: `panel row carries no verdict: ${row?.verdict}` });
    }
  }
  for (const [id, count] of seen) {
    if (count > 1) refusals.push({ code: 'unknown_vocabulary', id, detail: `${count} rows share the id ${id}` });
  }
  return { ok: refusals.length === 0, refusals };
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const isMain = process.argv[1] && process.argv[1].endsWith('reader-backlog.mjs');
if (isMain) {
  const argv = process.argv.slice(2);
  const at = (name) => {
    const i = argv.indexOf(`--${name}`);
    return i !== -1 && argv[i + 1] != null ? argv[i + 1] : null;
  };

  if (argv.includes('--seed-from-wrwalker')) {
    const { pendingSurfaceBacklog } = await import('../lib/writer-dark-register.mjs');
    const rows = importPendingSurfaceRows(pendingSurfaceBacklog());
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  }

  const path = at('validate');
  if (!path) {
    console.error('usage: reader-backlog.mjs --validate <backlog.json> | --seed-from-wrwalker');
    process.exit(2);
  }
  const rows = JSON.parse(readFileSync(path, 'utf-8'));
  const { ok, refusals } = validateBacklog(Array.isArray(rows) ? rows : rows?.rows);
  if (ok) {
    console.log(`[reader-backlog] ${path}: OK (${(Array.isArray(rows) ? rows : rows?.rows || []).length} rows)`);
    process.exit(0);
  }
  console.error(`[reader-backlog] ${path}: ${refusals.length} refusal(s)`);
  for (const item of refusals) console.error(`  ${item.code}  ${item.id ?? '-'}  ${item.detail}`);
  process.exit(1);
}
