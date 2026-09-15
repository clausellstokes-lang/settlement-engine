#!/usr/bin/env node
/**
 * ledger-citations.mjs — the citation-integrity census over the ledger estate.
 *
 * THE CLASS IT GUARDS (ODQ §685.5(vi), extended and measured at ODQ §920): a
 * ledger section can be CITED without ever having been WRITTEN. `bc907c3ad`
 * announced "§683: the last Fable rulings", touched four documents and not the
 * ledger, and left ten citations pointing at a section that does not exist.
 * §920 measured the whole class for the first time and found two more numbers
 * nobody had named — §178 and §183. Nothing in tests/ or scripts/ measured it.
 *
 * THE INSTRUMENT IS ONLY-SHRINKS. A citation of a number that has no opener and
 * no alias is a FINDING. The baseline lists the numbers already known to dangle;
 * a NEW dangling number fails, and a baselined number whose citations have all
 * gone also fails ("delete its entry"), so the set can only fall.
 *
 * ⛔ THE CORPUS IS RESOLVED FROM A GIT REF, NEVER FROM THE WORKING TREE, and
 * that is deliberate (ODQ §920.6). The ledger lives on `review-fixes-2026-07-08`
 * while the product line — where this instrument runs — is a different branch
 * whose tree carries no ledger file at all. The main checkout is worse than
 * absent: it is a stale snapshot whose index holds 312 of HEAD's 884 docs *.md,
 * so an index- or worktree-scoped read of the estate returns a silent subset
 * with exit 0. That is precisely how this car's own first census lost all four
 * of §683's homes. Pass `--docs <dir>` to override, for fixtures and for a
 * checkout that genuinely holds the estate.
 *
 * THE ALIAS TABLE IS NOT A PLACE TO HIDE A HOLE. Every alias carries a proof —
 * a file and a string that must still be present in the corpus — and the proof
 * is CHECKED, not merely commented. A combined-header alias must also name a
 * target that is itself a real opener, and an alias for a number that has since
 * gained an opener fails as dead. Silencing a genuine dangling citation
 * therefore costs a code change that reds, not a line in a JSON file.
 *
 * TWO THINGS THAT LOOK LIKE HOLES AND ARE NOT, both found by this walker after
 * the §920 census (which only looked at §0-§919) had already been written:
 *   • A FORWARD REFERENCE. The estate plans the next section by name before it
 *     exists — docs/OPUS_CHAIR_MANUAL.md §6.9 is "The §920 landing chain", and
 *     §920 was cited thirteen times before car 1 wrote it. A number ABOVE the
 *     ledger's high-water mark cannot be a §683-class hole, because the ledger
 *     has not reached it; it clears itself when the section lands. Ratcheting it
 *     would red on every chair's planning document and the gate would be turned
 *     off, so it is REPORTED and not ratcheted.
 *   • A FOREIGN LEDGER. "the 07-21 CONSOLIDATED OWNER QUEUE (ledger §1338)" and
 *     "DESIGN_FP_ARCHITECTURE §3035" cite OTHER documents' numbering. These get
 *     proved aliases rather than relying on the high-water rule alone.
 *
 * The analysis core takes in-memory records so every arm — including the
 * negative controls that prove it can convict — runs without writing a fixture
 * into the repository.
 *
 * Usage:
 *   node scripts/audit/ledger-citations.mjs [--docs <dir>] [--ref <gitref>] [--json]
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
export const REPO_ROOT = resolve(HERE, '..', '..');

/** The branch the ledger estate lives on. */
export const DEFAULT_LEDGER_REF = 'refs/heads/review-fixes-2026-07-08';

/** The two files whose section openers define the namespace a citation may resolve to. */
export const OPENER_SOURCES = [
  'docs/OWNER_DECISION_QUEUE.md',
  'docs/FABLE_RETROVALIDATION_QUEUE.md',
];

/**
 * A section opener: optional heading hashes, optional list bullet, optional bold
 * run, then the number, then a separator that proves the number is a heading and
 * not prose. Kept byte-identical to the census quoted in ODQ §920.1 so the
 * instrument and the ledger's own figure cannot drift apart.
 */
export const OPENER_RE = /^(?:#{1,6}[ \t]*)?(?:[-*][ \t]*)?(?:\*\*)?§(\d+)(?=[ .·]|\*)/;

/** Any §N reference anywhere in prose. The lookahead keeps §178 from matching §1780. */
export const CITATION_RE = /§(\d+)(?![0-9])/g;

/**
 * NUMBERS THAT LOOK LIKE HOLES AND ARE NOT.
 *
 * Each entry MUST carry a proof that is checked against the live corpus. An
 * alias whose proof has rotted is reported as a failure, because at that point
 * it is indistinguishable from a genuine hole that someone silenced.
 */
export const ALIASES = [
  {
    numbers: [246],
    kind: 'combined-header',
    target: 245,
    // ODQ:8824-8825 — §246 shares §245's header, so the number is not at line
    // start and the opener regex cannot see it. PROVENANCE_MAP.tsv:269 already
    // carries a §246 row. Recorded as a false alarm at ODQ §920.4.
    proof: {
      file: 'docs/OWNER_DECISION_QUEUE.md',
      contains: '## AND §246 · THE RECONSTRUCTION TEST',
    },
    why: "§246 shares §245's combined header (ODQ:8824-8825); see ODQ §920.4.",
  },
  {
    numbers: [277, 278, 279, 280, 281, 282, 283, 284, 285, 286],
    kind: 'design-only',
    // ODQ:10840 collected these as GENERATION-SPEC fold labels, i.e. design
    // sections that were never ODQ entries. docs/HANDOFF_CURRENT.md:7 says so
    // in the first file a successor reads. Recorded as a false alarm at §920.4.
    proof: {
      file: 'docs/OWNER_DECISION_QUEUE.md',
      contains: '`GENERATION-SPEC` fold labels §§277–§286 are accepted as DESIGN-ONLY',
    },
    why: '§§277-§286 are GENERATION-SPEC fold labels, not ODQ entries (ODQ:10840, §920.4).',
  },
  {
    numbers: [1338],
    kind: 'foreign-ledger',
    // ODQ:5 — a pointer to the 07-21 CONSOLIDATED OWNER QUEUE's own numbering,
    // not to a section of this ledger.
    proof: {
      file: 'docs/OWNER_DECISION_QUEUE.md',
      contains: 'CONSOLIDATED OWNER QUEUE (ledger §1338)',
    },
    why: "§1338 belongs to the 07-21 consolidated owner queue's numbering (ODQ:5).",
  },
  {
    numbers: [3035],
    kind: 'foreign-ledger',
    // ODQ:32339 (§881.10) — a pointer into DESIGN_FP_ARCHITECTURE's own
    // numbering, which runs far past this ledger's.
    proof: {
      file: 'docs/OWNER_DECISION_QUEUE.md',
      contains: 'DESIGN_FP_ARCHITECTURE §3035',
    },
    why: "§3035 belongs to DESIGN_FP_ARCHITECTURE's numbering (ODQ:32339, §881.10).",
  },
];

/* -------------------------------------------------------------------------- */
/* analysis core — pure, in-memory, no I/O                                     */
/* -------------------------------------------------------------------------- */

/**
 * @param {{files: Array<{path: string, text: string}>, aliases?: Array<object>,
 *          openerSources?: string[]}} input
 */
export function analyzeCorpus({ files, aliases = ALIASES, openerSources = OPENER_SOURCES }) {
  const openers = new Set();
  const openerSet = new Set(openerSources);
  for (const file of files) {
    if (!openerSet.has(file.path)) continue;
    for (const line of file.text.split('\n')) {
      const m = OPENER_RE.exec(line);
      if (m) openers.add(Number(m[1]));
    }
  }

  /** @type {Map<number, Array<{file: string, line: number, excerpt: string}>>} */
  const citations = new Map();
  for (const file of files) {
    const lines = file.text.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.includes('§')) continue;
      CITATION_RE.lastIndex = 0;
      let m;
      while ((m = CITATION_RE.exec(line)) !== null) {
        const n = Number(m[1]);
        if (!citations.has(n)) citations.set(n, []);
        citations.get(n).push({
          file: file.path,
          line: i + 1,
          excerpt: line.trim().slice(0, 160),
        });
      }
    }
  }

  // --- the alias table audits itself -------------------------------------
  const byPath = new Map(files.map((f) => [f.path, f.text]));
  const aliasFailures = [];
  const aliased = new Set();
  for (const alias of aliases) {
    for (const n of alias.numbers) {
      aliased.add(n);
      if (openers.has(n)) {
        aliasFailures.push({
          kind: 'DEAD_ALIAS',
          number: n,
          detail: `§${n} now has a real opener — delete its alias entry.`,
        });
      }
    }
    if (alias.kind === 'combined-header' && !openers.has(alias.target)) {
      aliasFailures.push({
        kind: 'ALIAS_TARGET_MISSING',
        number: alias.numbers[0],
        detail: `alias target §${alias.target} is not an opener — the alias hides a real hole.`,
      });
    }
    const text = byPath.get(alias.proof.file);
    if (text === undefined) {
      aliasFailures.push({
        kind: 'ALIAS_PROOF_FILE_MISSING',
        number: alias.numbers[0],
        detail: `proof file ${alias.proof.file} is not in the corpus.`,
      });
    } else if (!text.includes(alias.proof.contains)) {
      aliasFailures.push({
        kind: 'ALIAS_PROOF_ROTTED',
        number: alias.numbers[0],
        detail: `proof string is gone from ${alias.proof.file} — re-prove the alias or remove it.`,
      });
    }
  }

  // --- the residue, split at the ledger's high-water mark -------------------
  const highWater = openers.size === 0 ? -1 : Math.max(...openers);
  const dangling = [];
  const beyondLedger = [];
  for (const [n, sites] of [...citations.entries()].sort((a, b) => a[0] - b[0])) {
    if (openers.has(n) || aliased.has(n)) continue;
    const row = { number: n, occurrences: sites.length, sites };
    if (n > highWater) beyondLedger.push(row);
    else dangling.push(row);
  }

  return {
    openerCount: openers.size,
    openers: [...openers].sort((a, b) => a - b),
    highWater,
    fileCount: files.length,
    citedNumbers: citations.size,
    dangling,
    beyondLedger,
    aliasFailures,
  };
}

/* -------------------------------------------------------------------------- */
/* corpus loading                                                              */
/* -------------------------------------------------------------------------- */

/** Read every *.md under a real directory, recursively. */
export function loadCorpusFromDir(docsDir, prefix = 'docs') {
  const out = [];
  const walk = (dir, rel) => {
    for (const entry of readdirSync(dir).sort()) {
      const abs = join(dir, entry);
      const st = statSync(abs);
      if (st.isDirectory()) walk(abs, `${rel}/${entry}`);
      else if (entry.endsWith('.md')) out.push({ path: `${rel}/${entry}`, text: readFileSync(abs, 'utf8') });
    }
  };
  walk(resolve(docsDir), prefix);
  return out;
}

/**
 * Read every docs/**.md at a git ref, in ONE `git cat-file --batch` round trip.
 * This is the default path: see the header on why the working tree is refused.
 */
export function loadCorpusFromRef(ref = DEFAULT_LEDGER_REF, repo = REPO_ROOT) {
  const listing = execFileSync('git', ['-C', repo, 'ls-tree', '-r', '--name-only', '-z', ref, '--', 'docs'], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
  });
  const paths = listing.split('\0').filter((p) => p.endsWith('.md'));
  if (paths.length === 0) return [];

  const request = `${paths.map((p) => `${ref}:${p}`).join('\n')}\n`;
  const batch = execFileSync('git', ['-C', repo, 'cat-file', '--batch'], {
    input: request,
    maxBuffer: 1024 * 1024 * 512,
  });

  const files = [];
  let off = 0;
  for (const path of paths) {
    const nl = batch.indexOf(0x0a, off);
    if (nl === -1) break;
    const header = batch.subarray(off, nl).toString('utf8');
    const parts = header.split(' ');
    if (parts.length < 3) throw new Error(`git cat-file --batch: unexpected header "${header}"`);
    const size = Number(parts[2]);
    const start = nl + 1;
    files.push({ path, text: batch.subarray(start, start + size).toString('utf8') });
    off = start + size + 1; // trailing newline after the payload
  }
  return files;
}

export function resolveCorpus({ docsDir, ref, repo = REPO_ROOT } = {}) {
  if (docsDir) return { source: `dir:${docsDir}`, files: loadCorpusFromDir(docsDir) };
  const useRef = ref || process.env.LEDGER_CITATIONS_REF || DEFAULT_LEDGER_REF;
  const files = loadCorpusFromRef(useRef, repo);
  if (files.length === 0) {
    throw new Error(
      `ledger-citations: no docs/**.md at ${useRef} in ${repo}. The ledger estate lives on ` +
        `${DEFAULT_LEDGER_REF}; pass --docs <dir> or --ref <gitref>. Refusing to fall back to the ` +
        'working tree, which is a stale subset (ODQ §920.6).',
    );
  }
  return { source: `ref:${useRef}`, files };
}

/* -------------------------------------------------------------------------- */
/* CLI                                                                         */
/* -------------------------------------------------------------------------- */

function main(argv) {
  const arg = (name) => {
    const i = argv.indexOf(name);
    return i === -1 ? undefined : argv[i + 1];
  };
  const { source, files } = resolveCorpus({ docsDir: arg('--docs'), ref: arg('--ref') });
  const analysis = analyzeCorpus({ files });

  if (argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify({ source, ...analysis }, null, 2)}\n`);
    return analysis.dangling.length === 0 && analysis.aliasFailures.length === 0 ? 0 : 1;
  }

  process.stdout.write(`[ledger-citations] corpus ${source} — ${files.length} files\n`);
  process.stdout.write(
    `[ledger-citations] openers ${analysis.openerCount} (high-water §${analysis.highWater}) · cited numbers ${analysis.citedNumbers}\n`,
  );
  for (const d of analysis.dangling) {
    process.stdout.write(`  DANGLING §${d.number} — ${d.occurrences} occurrence(s)\n`);
    for (const s of d.sites) process.stdout.write(`      ${s.file}:${s.line}  ${s.excerpt}\n`);
  }
  for (const b of analysis.beyondLedger) {
    process.stdout.write(
      `  BEYOND-LEDGER §${b.number} — ${b.occurrences} occurrence(s); above the high-water mark §${analysis.highWater}, `
        + 'so a forward plan or a foreign ledger, not a hole (reported, not ratcheted)\n',
    );
  }
  for (const f of analysis.aliasFailures) {
    process.stdout.write(`  ALIAS FAILURE [${f.kind}] §${f.number} — ${f.detail}\n`);
  }
  if (analysis.dangling.length === 0 && analysis.aliasFailures.length === 0) {
    process.stdout.write('[ledger-citations] OK — every § citation resolves.\n');
    return 0;
  }
  return 1;
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  process.exitCode = main(process.argv.slice(2));
}
