#!/usr/bin/env node
/**
 * provenance-map.mjs — THE WALK docs/PROVENANCE_MAP.tsv was always supposed to have.
 *
 * §687.2 landed the map as the instrument that "can be regenerated from the walk
 * at any time" and its header line 5 cited "the walk in ODQ §687.4". ⛔ ODQ §687.4
 * is "P0 IS ADDED TO THE REGISTER — POISONED DISCHARGES" (ODQ:28775). There was no
 * walk, in that section or anywhere else: `git grep -l PROVENANCE_MAP -- ':!docs/'`
 * was empty and no generator existed in the repository. The map was hand-derived
 * once, to §686, and the ledger has since run to §920 — 233 numbers with no row,
 * which is the exact surface §685.5 built the map to resolve.
 *
 * THE TWO CHANNELS, as §685.5(ii) describes them:
 *   1. THE SECTION'S OWN TEXT names a seat in its header.
 *   2. THE Co-Authored-By TRAILER of the commit that INTRODUCED that header on
 *      this branch, recovered by walking the ledger file's commits in order and
 *      taking the FIRST commit whose diff ADDS the opener line.
 * Text wins over trailer; neither means UNKNOWN.
 *
 * ⭐ RULE EPOCHS — WHY THERE ARE TWO, AND WHY THIS IS NOT A HACK. The estate's
 * marking convention genuinely changed under it, and §685.5(i) records the
 * succession: §236's `(chair: Opus 5 — Fable-unvalidated)` ran §238–§274; §484's
 * `[OPUS-RUN · FABLE-VALIDATION OWED]` ran 16 headers to §513; §685 replaced both
 * with `SEAT: <model> — <state>` from §686 forward. A provenance map must read
 * each section under the convention in force WHEN IT WAS WRITTEN, exactly as the
 * hand walk did. Applying today's rule to §0–§686 would silently REWRITE 693
 * committed rows — §686 alone flips TRAILER-FABLE → OPUS-TEXT — and §687.2's law
 * 12 is "the map is ADDITIVE: history is never rewritten."
 *
 * The opener form changed too, and the same rule applies. The committed rows were
 * cut with `^## §N`; from §687 the ledger also writes bare `§N · …` rows and
 * `- **§N …` bullets (§798–§886 are entirely of the third form), so the LEGACY
 * epoch keeps the `##`-only rule that reproduces the 693 rows and the CURRENT
 * epoch recognises all three.
 *
 * ⛔ ADDITIVE BY CONSTRUCTION. `--write` appends only rows whose section is absent
 * from the committed file; it never rewrites a byte of an existing row. The
 * generator's computation over the legacy range is still checked on every run
 * (`--verify-legacy`), which is what makes the append trustworthy: the method is
 * proved against 693 known-good rows before it is believed about 233 new ones.
 *
 * Usage:
 *   node scripts/audit/provenance-map.mjs --map <tsv> [--ref <gitref>] [--tsv|--write <out>]
 *   node scripts/audit/provenance-map.mjs --verify-legacy --map <tsv>
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
export const REPO_ROOT = resolve(HERE, '..', '..');
export const DEFAULT_LEDGER_REF = 'refs/heads/review-fixes-2026-07-08';
export const LEDGER_PATH = 'docs/OWNER_DECISION_QUEUE.md';
export const MAP_PATH = 'docs/PROVENANCE_MAP.tsv';

/** The last section the hand walk covered. Rows at or below it are HISTORY. */
export const LEGACY_HIGH = 686;

/** The header column is truncated at 110 characters, as the committed rows are. */
export const HEADER_WIDTH = 110;

const SECTION = String.raw`(\d+[a-z]?(?:\.\d+)?)`;
/** LEGACY (§0–§686): markdown headings only — the form the hand walk cut. */
export const OPENER_RE_LEGACY = new RegExp(String.raw`^##\s*§${SECTION}\b`);
/** CURRENT (§687–): headings, bare rows, and bullet rows (§798–§886 are bullets). */
export const OPENER_RE_CURRENT = new RegExp(
  String.raw`^(?:#{1,6}\s*)?(?:[-*]\s*)?(?:\*\*)?§${SECTION}(?=[ .·—]|\*|$)`,
);

/** §236's and §484's conventions — the only two in force through §686. */
const TEXT_OPUS_LEGACY = /chair:\s*opus|OPUS-RUN/i;
const TEXT_FABLE_LEGACY = /chair:\s*fable|Fable\s+(?:seat|chair)/i;
/** §685 added `SEAT: <model> — <state>`; it governs from §687. */
const TEXT_OPUS_CURRENT = /chair:\s*opus|OPUS-RUN|SEAT:\s*Opus/i;
const TEXT_FABLE_CURRENT = /chair:\s*fable|Fable\s+(?:seat|chair)|SEAT:\s*Fable/i;

/**
 * Match an opener UNDER ITS OWN EPOCH's rule. The candidate id is read with the
 * wider CURRENT rule, and a section in the legacy range must then also satisfy
 * the narrower `##`-only rule — otherwise `- **§685.1 …` (a bullet inside §685)
 * would become a row the hand walk never cut, and the append would inject rows
 * into history rather than extend it.
 */
export function matchOpener(line) {
  const m = OPENER_RE_CURRENT.exec(line);
  if (!m) return null;
  if (sectionNumber(m[1]) <= LEGACY_HIGH && !OPENER_RE_LEGACY.test(line)) return null;
  return m;
}

export function epochFor(sectionId) {
  return sectionNumber(sectionId) <= LEGACY_HIGH ? 'legacy' : 'current';
}
export function sectionNumber(sectionId) {
  return Number(/^§?(\d+)/.exec(sectionId)[1]);
}

/* -------------------------------------------------------------------------- */
/* channel 1 — the ledger text                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Every opener in the ledger, first occurrence wins, with its line number and
 * its full (untruncated) header. A `##` opener's header is every consecutive
 * `##` line joined by a single space — the ledger wraps long titles across
 * several heading lines and the hand walk joined them.
 */
export function readOpeners(ledgerText) {
  const lines = ledgerText.split('\n');
  const openers = new Map();
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.includes('§')) continue;
    const m = matchOpener(line);
    if (!m) continue;
    const id = `§${m[1]}`;
    if (openers.has(id)) continue;
    let header;
    if (line.startsWith('##')) {
      const parts = [];
      for (let j = i; j < lines.length && lines[j].startsWith('##'); j += 1) {
        parts.push(lines[j].replace(/^#+/, '').trim());
      }
      header = parts.join(' ');
    } else {
      // A row-form opener carries markdown furniture the heading form does not;
      // strip it so both epochs' header columns read the same way.
      header = line.trim().replace(/^[-*]\s*/, '').replace(/^\*\*/, '');
    }
    openers.set(id, { id, line: i + 1, header, form: line.startsWith('##') ? 'heading' : 'row' });
  }
  return openers;
}

export function textSeat(header, epoch) {
  const [opus, fable] = epoch === 'legacy'
    ? [TEXT_OPUS_LEGACY, TEXT_FABLE_LEGACY]
    : [TEXT_OPUS_CURRENT, TEXT_FABLE_CURRENT];
  if (opus.test(header)) return 'OPUS-TEXT';
  if (fable.test(header)) return 'FABLE-TEXT';
  return null;
}

/* -------------------------------------------------------------------------- */
/* channel 2 — the introducing commit's trailer                                */
/* -------------------------------------------------------------------------- */

/**
 * The FIRST commit whose diff of the ledger file ADDS an opener line for a
 * section introduced it. One `git log -U0` pass over the file's whole history.
 */
export function walkIntroducingCommits(ref = DEFAULT_LEDGER_REF, repo = REPO_ROOT) {
  const out = execFileSync('git', [
    '-C', repo, 'log', '--reverse', '--no-renames', '-U0',
    '--format=@@@%H|%(trailers:key=Co-authored-by,valueonly,separator=;)',
    ref, '--', LEDGER_PATH,
  ], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 512 });

  const intro = new Map();
  let sha = null;
  let trailers = '';
  let commits = 0;
  for (const line of out.split('\n')) {
    if (line.startsWith('@@@')) {
      commits += 1;
      const bar = line.indexOf('|');
      sha = line.slice(3, bar);
      trailers = line.slice(bar + 1).trim();
      continue;
    }
    if (line.charCodeAt(0) !== 43 /* '+' */) continue;
    const body = line.slice(1);
    if (!body.includes('§')) continue;
    const m = matchOpener(body);
    if (!m) continue;
    const id = `§${m[1]}`;
    if (!intro.has(id)) intro.set(id, { sha, trailers });
  }
  return { intro, commits };
}

/** "Fable 5" / "Opus 5" / "Opus 4.8" / … else NONE. */
export function normaliseTrailer(trailers) {
  if (!trailers) return 'NONE';
  const m = /\b(Opus|Fable|Sonnet|Haiku)\s+([0-9][0-9.]*)/.exec(trailers);
  return m ? `${m[1]} ${m[2]}` : 'NONE';
}

/* -------------------------------------------------------------------------- */
/* the row                                                                     */
/* -------------------------------------------------------------------------- */

export function buildRow(opener, introRec) {
  const epoch = epochFor(opener.id);
  const trailer = normaliseTrailer(introRec?.trailers);
  const text = textSeat(opener.header, epoch);
  let status = text;
  if (!status) {
    if (trailer.startsWith('Fable')) status = 'TRAILER-FABLE';
    else if (trailer.startsWith('Opus')) status = 'TRAILER-OPUS';
    else status = 'UNKNOWN';
  }
  const n = sectionNumber(opener.id);
  const discharge = n >= 238 && n <= 274 ? 'DISCHARGED-§293-298' : '';
  return [
    opener.id,
    String(opener.line),
    status,
    trailer,
    introRec ? introRec.sha.slice(0, 9) : '',
    discharge,
    opener.header.slice(0, HEADER_WIDTH),
  ].join('\t');
}

export function generate({ ledgerText, intro }) {
  const openers = readOpeners(ledgerText);
  const rows = [];
  for (const opener of openers.values()) rows.push(buildRow(opener, intro.get(opener.id)));
  return rows;
}

/* -------------------------------------------------------------------------- */
/* the committed map                                                           */
/* -------------------------------------------------------------------------- */

export function parseMap(text) {
  const lines = text.split('\n');
  const header = [];
  let i = 0;
  for (; i < lines.length; i += 1) {
    if (!lines[i].startsWith('#') && !lines[i].startsWith('section\t')) break;
    header.push(lines[i]);
  }
  const rows = lines.slice(i).filter((l) => l.trim() !== '');
  return { header, rows };
}

export function sectionOf(row) {
  return row.slice(0, row.indexOf('\t'));
}

export function repoTip(ref, repo = REPO_ROOT) {
  return execFileSync('git', ['-C', repo, 'rev-parse', ref], { encoding: 'utf8' }).trim();
}

/** Read the ledger at a ref. */
export function readLedger(ref = DEFAULT_LEDGER_REF, repo = REPO_ROOT) {
  return execFileSync('git', ['-C', repo, 'show', `${ref}:${LEDGER_PATH}`], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
  });
}

/**
 * Everything the CLI does except the write, so a test can assert on the same
 * bytes the generator would land. Returns the mismatches BEFORE the output, so
 * a caller can refuse rather than write — the order matters.
 */
export function regenerate({ ref = DEFAULT_LEDGER_REF, committedMapText, repo = REPO_ROOT } = {}) {
  const ledgerText = readLedger(ref, repo);
  const { intro, commits } = walkIntroducingCommits(ref, repo);
  const rows = generate({ ledgerText, intro });
  const committed = parseMap(committedMapText);
  const byId = new Map(rows.map((r) => [sectionOf(r), r]));
  const mismatches = committed.rows
    .filter((row) => byId.get(sectionOf(row)) !== row)
    .map((row) => ({ id: sectionOf(row), committed: row, generated: byId.get(sectionOf(row)) ?? '<not generated>' }));
  const have = new Set(committed.rows.map(sectionOf));
  const appended = rows.filter((r) => !have.has(sectionOf(r)));
  const output = `${[
    ...rewriteHeader(committed.header, ref, repoTip(ref, repo)),
    ...committed.rows,
    ...appended,
  ].join('\n')}\n`;
  return { commits, rows, committed, mismatches, appended, output };
}

/**
 * Correct the map's own citation. Header line 5 read "Regenerate: the walk in ODQ
 * §687.4" — and ODQ §687.4 is "P0 IS ADDED TO THE REGISTER — POISONED DISCHARGES"
 * (ODQ:28775), not a walk. The map's instructions pointed at the wrong section for
 * as long as the map existed, which is the same class the instrument beside this
 * one (tests/lint/ledgerCitationIntegrity.test.js) now ratchets.
 *
 * ⚠ The `Walked at:` line records the tip the append was cut from, because a
 * recovered trailer is the trailer of the commit that INTRODUCED a header ON THIS
 * BRANCH: a history rewrite would change appended rows, and this line is what lets
 * a later reader tell whether that happened.
 */
export function rewriteHeader(header, ref, tip) {
  const kept = header.filter((l) => !l.startsWith('# Regenerate:') && !l.startsWith('# Walked at:'));
  const cols = kept.pop(); // the `section\todq_line\t…` column line stays last
  return [
    ...kept,
    '# Regenerate: node scripts/audit/provenance-map.mjs --map docs/PROVENANCE_MAP.tsv --write docs/PROVENANCE_MAP.tsv',
    `# Walked at: ${ref} = ${tip} (rows are ADDITIVE; the generator REFUSES to write unless it first`,
    '#   reproduces every committed row byte-for-byte — see tests/scripts/provenanceMap.test.js arm 1)',
    cols,
  ];
}

/* -------------------------------------------------------------------------- */
/* CLI                                                                         */
/* -------------------------------------------------------------------------- */

function main(argv) {
  const arg = (name, dflt) => {
    const i = argv.indexOf(name);
    return i === -1 ? dflt : argv[i + 1];
  };
  const ref = arg('--ref', DEFAULT_LEDGER_REF);
  const mapPath = resolve(REPO_ROOT, arg('--map', MAP_PATH));
  const { commits, rows, committed, mismatches, appended, output } = regenerate({
    ref,
    committedMapText: readFileSync(mapPath, 'utf8'),
  });
  process.stderr.write(
    `[provenance-map] ref ${ref} · ${commits} ledger commits · ${rows.length} openers · `
      + `${committed.rows.length} committed rows · ${mismatches.length} mismatch(es)\n`,
  );

  if (mismatches.length > 0 || argv.includes('--verify-legacy')) {
    for (const m of mismatches.slice(0, 5)) {
      process.stderr.write(`  MISMATCH ${m.id}\n    committed: ${m.committed}\n    generated: ${m.generated}\n`);
    }
    if (mismatches.length > 0 && !argv.includes('--verify-legacy')) {
      // ⛔ THE REFUSAL IS THE POINT. If the method no longer reproduces the 693
      // known-good rows it has no standing to assert 900 new ones.
      process.stderr.write('[provenance-map] REFUSING to write: the walk does not reproduce the committed rows.\n');
    }
    return mismatches.length === 0 ? 0 : 1;
  }

  const target = arg('--write');
  if (target) {
    writeFileSync(resolve(REPO_ROOT, target), output, 'utf8');
    process.stderr.write(`[provenance-map] wrote ${target}: +${appended.length} row(s), 0 rewritten\n`);
  } else {
    process.stdout.write(output);
  }
  return 0;
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) process.exitCode = main(process.argv.slice(2));
