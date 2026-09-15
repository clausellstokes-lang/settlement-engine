/**
 * reviewFindingsTriage.mjs — THE MECHANICAL HALF of the 133-finding review register's triage.
 *
 * ⛔⛔ READ THIS BEFORE EXTENDING IT. THE TOOL IS IN THE REPO; THE DATA IS NOT, AND MUST NOT BE.
 *
 * Commit 0ac348e6d removed docs/REVIEW_FINDINGS.md and docs/.review_findings.json from this
 * repository under the owner's 2026-08-10 delegation grant, with the reason stated in its own
 * message: "a 133-finding security register is an exploit roadmap". The register was preserved
 * byte-exact to the owner's out-of-repo `repo-extracted-2026-08-10/` folder. That is a
 * recorded, owner-delegated IP ruling, not an accident of housekeeping.
 *
 * So this script takes the register as an ARGUMENT and never as a checked-in fixture:
 *
 *     node scripts/reviewFindingsTriage.mjs <path-to-.review_findings.json>
 *     git cat-file -p c09cd48a4^:docs/.review_findings.json | node scripts/reviewFindingsTriage.mjs -
 *
 * ⛔ DO NOT re-add docs/REVIEW_FINDINGS.md or docs/.review_findings.json to the repo under any
 * framing, including "temporarily" or "as a test fixture". The test beside this file
 * (tests/scripts/reviewFindingsTriage.test.js) authors a SYNTHETIC four-row fixture for
 * exactly that reason.
 *
 * ── WHAT IT EMITS, AND WHAT IT REFUSES TO EMIT ───────────────────────────────────────────
 * STATUS ONLY: index, severity, dim, file:line, and one MECHANICAL status per row. It never
 * emits `evidence`, `suggested_fix`, or `title` — those three are the exploit roadmap. The
 * emitted key set is a fixed allowlist (ROW_KEYS below) that the test asserts POSITIVELY, so
 * a future field cannot be added by accident.
 *
 * ⛔⛔ AND IT NEVER EMITS A VERDICT. "FILE_GONE" does not mean the finding is fixed; a file can
 * be renamed, or split, or its defect moved somewhere else entirely. "ANCHOR_PRESENT" does not
 * mean the finding is live; the anchor may be a line of surrounding context that never was the
 * defect. Deciding whether each of the 118 medium/low findings is fixed, live, or moot is a
 * security-posture judgment across 13 dimensions, and its natural artifact — a per-finding
 * table of live security defects with file:line — reconstitutes in the repo exactly what
 * 0ac348e6d removed from it. THAT DECISION IS THE OWNER'S, including whether such an artifact
 * exists at all. This script stops at "where does the row still point", which is the part a
 * machine can answer and nobody has to re-derive by hand.
 *
 * ── THE STATUSES ─────────────────────────────────────────────────────────────────────────
 *   FILE_GONE          the row's `file` does not resolve under the repo root.
 *   LINE_OUT_OF_RANGE  the file exists but is shorter than the row's `line`.
 *   ANCHOR_PRESENT     an anchor derived from the row's evidence appears within ±WINDOW lines
 *                      of the recorded line. The row still points where it pointed.
 *   ANCHOR_MOVED       the anchor appears in the file, but not near the recorded line. The
 *                      line number is stale; the code is still there somewhere.
 *   ANCHOR_ABSENT      file and line resolve, but the anchor appears nowhere in the file.
 *   NO_ANCHOR          no usable anchor could be derived from the row's evidence, so nothing
 *                      mechanical can be said beyond "the file and line still exist".
 *
 * Exit status is 0 whenever the run completed; a non-zero exit would read as a verdict about
 * the findings, which is precisely what this tool refuses to give.
 *
 * ── THE INSTRUMENT'S MEASURED RESOLUTION (2026-09-15, against the recovered register at
 *    `c09cd48a4^:docs/.review_findings.json`, 118 medium+low rows) ────────────────────────
 *   FILE_GONE 1 · LINE_OUT_OF_RANGE 17 · ANCHOR_PRESENT 1 · ANCHOR_MOVED 9 ·
 *   ANCHOR_ABSENT 71 · NO_ANCHOR 19.
 * An anchor was derivable for 95 of 118 rows; median anchor length 45 characters, p90 88.
 * READ THAT SHAPE BEFORE TRUSTING ANY SINGLE ROW: ANCHOR_ABSENT dominating is what you would
 * expect of a register measured on 2026-08-10 against a tree that has been refactored heavily
 * since, and it is exactly why a status is not a verdict — an absent anchor is equally
 * consistent with "fixed", "moved", and "reformatted". A whitespace-normalised rematch was
 * measured as an alternative and rescues only 4 of those 71, so it is deliberately NOT
 * implemented: it would add a second matching mode, lose line proximity (a whole-file
 * normalised match has no position), and change 3% of the answer.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, sep } from 'node:path';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** The ONLY keys an emitted row may carry. Positively asserted by the test — this is the IP guard. */
export const ROW_KEYS = Object.freeze(['index', 'severity', 'dim', 'file', 'line', 'status']);

export const STATUSES = Object.freeze([
  'FILE_GONE', 'LINE_OUT_OF_RANGE', 'ANCHOR_PRESENT', 'ANCHOR_MOVED', 'ANCHOR_ABSENT', 'NO_ANCHOR',
]);

/** How far from the recorded line an anchor may sit and still count as "present". */
export const WINDOW = 12;

/**
 * Derive a mechanical anchor from a row's evidence prose: the longest backticked span that
 * looks like CODE rather than English.
 *
 * Kept deliberately dumb. A smarter extractor would need to understand the prose, and the
 * moment it does, the temptation is to report what the prose SAYS — which is the half of this
 * job that belongs to the owner. The anchor is only ever used to answer "is this text still
 * in that file", and it is never emitted.
 *
 * @param {unknown} evidence
 * @returns {string|null}
 */
export function deriveAnchor(evidence) {
  if (typeof evidence !== 'string' || evidence === '') return null;
  // ⚠ MATCH EVERY PAIR, THEN FILTER BY LENGTH — never fold the length bound into the pattern.
  // With `{4,160}` inside the regex, a SHORT span (`x`) fails to match at its own opening
  // backtick, the engine then pairs that opening backtick with the NEXT one, and every
  // subsequent pair is out of phase: the real code spans become the prose BETWEEN them and
  // vanish. Caught by this file's own deriveAnchor case; the failure mode is silent (an
  // anchor that is merely absent degrades the row to NO_ANCHOR, which reads like a property
  // of the register rather than a bug in the reader).
  const spans = [...evidence.matchAll(/`([^`\n]*)`/g)]
    .map((m) => m[1].trim())
    .filter((s) => s.length >= 4 && s.length <= 160);
  const codeish = spans.filter((s) => (
    // At least one identifier-shaped token, and some punctuation that English rarely carries
    // in a short span. This is a filter for "quotable back into a source file", not a parser.
    /[A-Za-z_$][A-Za-z0-9_$]{2,}/.test(s)
    && /[.(){}[\]=<>:;/]|=>|::/.test(s)
    && !/\s{2,}/.test(s)
  ));
  if (codeish.length === 0) return null;
  // The longest is the most specific, so the least likely to match incidentally.
  return codeish.sort((a, b) => b.length - a.length)[0];
}

/**
 * Resolve ONE register row against the tree.
 * @param {Record<string, unknown>} row
 * @param {number} index
 * @param {string} root repo root to resolve `file` against
 * @returns {{index:number, severity:string, dim:string, file:string, line:number, status:string}}
 */
export function resolveRow(row, index, root = REPO_ROOT) {
  const file = String(row.file ?? '');
  const line = Number(row.line ?? 0);
  const base = {
    index,
    severity: String(row.severity ?? 'unknown'),
    dim: String(row.dim ?? 'unknown'),
    file,
    line,
  };

  // Never follow a path out of the tree: a register is untrusted input, and a `..` segment
  // would turn a read-only triage into an arbitrary-file reader.
  const abs = resolve(root, file);
  const inside = abs === root || abs.startsWith(root + sep);
  if (!file || !inside || !existsSync(abs) || !statSync(abs).isFile()) {
    return { ...base, status: 'FILE_GONE' };
  }

  const lines = readFileSync(abs, 'utf8').split('\n');
  if (!Number.isInteger(line) || line < 1 || line > lines.length) {
    return { ...base, status: 'LINE_OUT_OF_RANGE' };
  }

  const anchor = deriveAnchor(row.evidence);
  if (anchor === null) return { ...base, status: 'NO_ANCHOR' };

  const hits = [];
  for (let i = 0; i < lines.length; i++) if (lines[i].includes(anchor)) hits.push(i + 1);
  if (hits.length === 0) return { ...base, status: 'ANCHOR_ABSENT' };
  const near = hits.some((h) => Math.abs(h - line) <= WINDOW);
  return { ...base, status: near ? 'ANCHOR_PRESENT' : 'ANCHOR_MOVED' };
}

/**
 * Triage a whole register.
 * @param {unknown} register parsed .review_findings.json
 * @param {{severities?: string[], root?: string}} options
 */
export function triage(register, { severities = ['medium', 'low'], root = REPO_ROOT } = {}) {
  const confirmed = Array.isArray(register?.confirmed) ? register.confirmed : [];
  const wanted = new Set(severities.map((s) => String(s).toLowerCase()));
  const rows = confirmed
    .map((row, i) => ({ row, i }))
    .filter(({ row }) => wanted.has(String(row?.severity ?? '').toLowerCase()))
    .map(({ row, i }) => resolveRow(row, i, root));
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const r of rows) counts[r.status] += 1;
  return { rows, counts, total: rows.length, confirmedTotal: confirmed.length };
}

/** Render the status-only table. Nothing here reads a field outside ROW_KEYS. */
export function render({ rows, counts, total, confirmedTotal }, { severities }) {
  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  const out = [];
  out.push('review-findings MECHANICAL triage — STATUS ONLY, NEVER A VERDICT.');
  out.push(`register: ${confirmedTotal} confirmed row(s); triaging severity ${severities.join('+')} -> ${total} row(s).`);
  out.push('');
  out.push(`${pad('#', 5)}${pad('severity', 10)}${pad('dim', 28)}${pad('status', 19)}file:line`);
  out.push('-'.repeat(100));
  for (const r of rows) {
    out.push(`${pad(r.index, 5)}${pad(r.severity, 10)}${pad(r.dim, 28)}${pad(r.status, 19)}${r.file}:${r.line}`);
  }
  out.push('-'.repeat(100));
  for (const s of STATUSES) out.push(`${pad(s, 19)}${counts[s]}`);
  out.push('');
  out.push('A status is WHERE THE ROW POINTS, not whether the finding is fixed. FILE_GONE may be a');
  out.push('rename; ANCHOR_PRESENT may be untouched context. The 118 verdicts are owner-gated —');
  out.push('see the header of scripts/reviewFindingsTriage.mjs and commit 0ac348e6d.');
  return out.join('\n');
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

/* c8 ignore start — the CLI shell; every behaviour it composes is unit-tested above. */
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  const sevArg = args.find((a) => a.startsWith('--severity='));
  const severities = sevArg
    ? sevArg.slice('--severity='.length).split(',').map((s) => s.trim()).filter(Boolean)
    : ['medium', 'low'];
  const asJson = args.includes('--json');
  const path = args.find((a) => !a.startsWith('--'));

  if (!path) {
    console.error([
      'usage: node scripts/reviewFindingsTriage.mjs <register.json> [--severity=medium,low] [--json]',
      '       cat register.json | node scripts/reviewFindingsTriage.mjs -',
      '',
      'The register is NOT in this repo and must not be re-added (commit 0ac348e6d).',
      "Read it from the owner's repo-extracted-2026-08-10/ folder, or recover the blob:",
      '  git cat-file -p c09cd48a4^:docs/.review_findings.json | node scripts/reviewFindingsTriage.mjs -',
    ].join('\n'));
    process.exit(2);
  }

  const raw = path === '-' ? await readStdin() : readFileSync(resolve(path), 'utf8');
  let register;
  try {
    register = JSON.parse(raw);
  } catch (error) {
    console.error(`[review-triage] the register is not valid JSON: ${error.message}`);
    process.exit(2);
  }
  const result = triage(register, { severities });
  // The JSON mode emits the SAME allowlisted rows the table does — no richer shape, because a
  // machine-readable channel is exactly where a private field would slip through unnoticed.
  console.log(asJson
    ? JSON.stringify({ counts: result.counts, total: result.total, rows: result.rows }, null, 2)
    : render(result, { severities }));
}
/* c8 ignore stop */
