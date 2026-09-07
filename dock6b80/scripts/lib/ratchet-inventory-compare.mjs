/**
 * scripts/lib/ratchet-inventory-compare.mjs — the comparison half of
 * `scripts/ratchet-inventory.sh`. Read that script's header for WHY this exists.
 *
 * Takes the two capture files the reporter wrote (see
 * scripts/lib/ratchet-inventory-reporter.mjs), extracts every member of every failed
 * array assertion, and compares the two ends AS A MULTISET — a row that appears twice
 * at HEAD and once at BASE is one row grown, not zero.
 *
 * ⛔ THE INTEGRITY CHECK IS THE POINT OF THE FILE. Extraction that silently drops
 * members would reproduce the exact failure this tool exists to end, so every parsed
 * array is checked against the cardinality vitest itself printed in the assertion
 * message (`expected [ …(76) ] to deeply equal []` ⇒ there must be 76 members). A
 * mismatch is a HARD ERROR with exit 2, never a shorter list.
 *
 * Usage: node ratchet-inventory-compare.mjs <base.json> <head.json> <baseLabel> <headLabel>
 * Exit 0 = HEAD grew nothing. Exit 1 = HEAD carries rows BASE does not. Exit 2 = the
 * measurement itself is untrustworthy (nothing ran, or extraction lost members).
 */
import { readFileSync } from 'node:fs';

const ELLIPSIS_CARDINALITY = /…\((\d+)\)/;

/** @param {string} path @returns {{cases: Array<Record<string, any>>}} */
function loadCapture(path) {
  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    throw new Error(`no capture at ${path} — the walker run produced no reporter output at all.`);
  }
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.cases) || !parsed.cases.length) {
    throw new Error(`the capture at ${path} lists ZERO test cases. The walker path is wrong, or`
      + ` the run died before any test executed. A tool that reports "clean" here would be`
      + ` reporting that it did not look.`);
  }
  return parsed;
}

/**
 * Turn vitest's serialized `actual` into its members.
 *
 * The serialization is JS-literal shaped rather than strict JSON — it carries a trailing
 * comma before the closing bracket — so a plain JSON.parse fails on real input. Repair
 * exactly that one deviation and parse; fall back to a line scan only if the repaired
 * text still will not parse, and say so in the returned note.
 *
 * @param {string} actual
 * @returns {{members: string[], note: string}}
 */
function parseMembers(actual) {
  const text = String(actual).trim();
  if (!text.startsWith('[')) {
    throw new Error(`the failed assertion's actual value is not an array literal, so this tool`
      + ` cannot inventory it. It began: ${text.slice(0, 120)}`);
  }
  const repaired = text.replace(/,(\s*\])/g, '$1');
  try {
    const parsed = JSON.parse(repaired);
    if (!Array.isArray(parsed)) throw new Error('not an array');
    return { members: parsed.map(String), note: 'json' };
  } catch {
    // Line scan: one quoted member per line is the shape vitest emits for a long array.
    const members = [];
    for (const line of text.split('\n')) {
      const match = /^\s*"(.*)",?\s*$/.exec(line);
      if (!match) continue;
      try {
        members.push(JSON.parse(`"${match[1]}"`));
      } catch {
        members.push(match[1]);
      }
    }
    return { members, note: 'line-scan (the JS-literal repair did not parse)' };
  }
}

/**
 * Every member of every failed array assertion in one capture, tagged by its test title.
 * @param {{cases: Array<Record<string, any>>}} capture
 * @param {string} label
 * @returns {{rows: Array<{test: string, member: string}>, failed: number, cases: number}}
 */
function inventoryOf(capture, label) {
  /** @type {Array<{test: string, member: string}>} */
  const rows = [];
  let failed = 0;
  for (const testCase of capture.cases) {
    for (const err of testCase.errors || []) {
      if (err.actual == null) continue;
      if (!String(err.actual).trim().startsWith('[')) continue;
      failed += 1;
      const { members } = parseMembers(err.actual);
      const printed = ELLIPSIS_CARDINALITY.exec(String(err.message));
      if (printed) {
        const declared = Number(printed[1]);
        if (members.length !== declared) {
          throw new Error(`${label}: extraction lost members on "${testCase.name}" — vitest`
            + ` printed a cardinality of ${declared} and this tool recovered ${members.length}.`
            + ` The inventory is NOT trustworthy; fix the extractor, do not report the short list.`);
        }
      } else {
        // The array was short enough for vitest to print in full, so the message itself is
        // the cross-check: every recovered member must appear in it.
        for (const member of members) {
          if (!String(err.message).includes(member.slice(0, 40))) {
            throw new Error(`${label}: recovered a member on "${testCase.name}" that vitest's own`
              + ` (untruncated) message does not contain. The extractor is inventing rows.`);
          }
        }
      }
      for (const member of members) rows.push({ test: testCase.name, member });
    }
  }
  return { rows, failed, cases: capture.cases.length };
}

/** @param {Array<{test: string, member: string}>} rows @returns {Map<string, number>} */
function multiset(rows) {
  const counts = new Map();
  for (const row of rows) {
    const key = JSON.stringify([row.test, row.member]);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

/** @param {Map<string, number>} left @param {Map<string, number>} right @returns {string[]} */
function onlyIn(left, right) {
  /** @type {string[]} */
  const out = [];
  for (const [key, count] of left) {
    const surplus = count - (right.get(key) || 0);
    for (let i = 0; i < surplus; i += 1) out.push(key);
  }
  return out.sort();
}

/**
 * Some ratchets state a per-row COUNT inside the row text ("N un-anchored negative
 * assertion(s)"). Where they do, the summed count is the figure the wave reports beside
 * the row count, so it is DERIVED here rather than left to be re-typed by hand.
 * @param {Array<{test: string, member: string}>} rows @returns {number|null}
 */
function statedSiteTotal(rows) {
  let total = 0;
  let seen = 0;
  for (const row of rows) {
    const match = /^[^:]+:\s*(\d+)\s/.exec(row.member);
    if (!match) continue;
    seen += 1;
    total += Number(match[1]);
  }
  return seen ? total : null;
}

/** @param {string} key @returns {string} */
function renderRow(key) {
  const [test, member] = JSON.parse(key);
  const trimmed = member.length > 150 ? `${member.slice(0, 150)}…` : member;
  return `    [${test}]\n      ${trimmed}`;
}

function main() {
  const [basePath, headPath, baseLabel, headLabel] = process.argv.slice(2);
  if (!basePath || !headPath) {
    process.stderr.write('usage: ratchet-inventory-compare.mjs <base.json> <head.json> <baseLabel> <headLabel>\n');
    process.exit(2);
  }
  const base = inventoryOf(loadCapture(basePath), baseLabel || 'BASE');
  const head = inventoryOf(loadCapture(headPath), headLabel || 'HEAD');

  const baseSet = multiset(base.rows);
  const headSet = multiset(head.rows);
  const onlyBase = onlyIn(baseSet, headSet);
  const onlyHead = onlyIn(headSet, baseSet);

  const baseSites = statedSiteTotal(base.rows);
  const headSites = statedSiteTotal(head.rows);
  const sites = (label, n) => (n == null ? '' : `, ${n} stated ${label}`);

  const lines = [];
  lines.push('');
  lines.push(`  BASE  ${baseLabel}`);
  lines.push(`        ${base.cases} test case(s) ran, ${base.failed} failed array assertion(s),`
    + ` ${base.rows.length} inventory row(s)${sites('site(s)', baseSites)}`);
  lines.push(`  HEAD  ${headLabel}`);
  lines.push(`        ${head.cases} test case(s) ran, ${head.failed} failed array assertion(s),`
    + ` ${head.rows.length} inventory row(s)${sites('site(s)', headSites)}`);
  lines.push('');
  lines.push(`  ONLY IN BASE (${onlyBase.length}) — rows the wave REMOVED or that moved:`);
  lines.push(...(onlyBase.length ? onlyBase.map(renderRow) : ['    (none)']));
  lines.push('');
  lines.push(`  ONLY IN HEAD (${onlyHead.length}) — rows the wave ADDED:`);
  lines.push(...(onlyHead.length ? onlyHead.map(renderRow) : ['    (none)']));
  lines.push('');
  lines.push(onlyHead.length
    ? `VERDICT: HEAD GREW. ${onlyHead.length} row(s) present at HEAD and absent at BASE.`
    : 'VERDICT: HEAD grew nothing. The red ratchet\'s contents are a subset of BASE\'s.');
  process.stdout.write(`${lines.join('\n')}\n`);
  process.exit(onlyHead.length ? 1 : 0);
}

try {
  main();
} catch (err) {
  process.stderr.write(`ratchet-inventory: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(2);
}
