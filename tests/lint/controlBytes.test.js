/**
 * controlBytes.test.js — byte-level pin: no raw control bytes in text source.
 *
 * BACKGROUND. The F24 copy-corruption pin (copyCorruption.test.js) is a
 * text-mode line/regex scan, and text-mode tools have a blind spot: a literal
 * NUL byte (0x00) survived in src/components/AccountPage.jsx:79 as a .join()
 * separator — the raw byte between the quotes, not an escape (fixed in
 * e76df7c9, replaced with '|'). Text-mode grep could not match it (a PCRE
 * NUL-pattern grep returned nothing while the byte was present), and the byte
 * made git classify the whole file as BINARY ("Bin 15896 -> 15896 bytes" in
 * the fix's diffstat), hiding it from diff review too. This pin closes the
 * blind spot by scanning raw Buffers, not decoded text.
 *
 * RULE. No TRACKED text file may contain a raw NUL. Under src/** and tests/**
 * the rule is wider still: no raw C0 control byte other than tab (0x09), LF
 * (0x0A), CR (0x0D), nor DEL (0x7F), same class. UTF-8 multibyte sequences
 * never contain bytes below 0x80, so a raw-byte scan cannot false-positive on
 * non-ASCII text (em-dashes, emoji, CJK are safe).
 *
 * ⛔ THE CLASS RECURS THROUGH TOOLING, NOT TYPING (EM-R0a's landing, ODQ §934.47
 * addendum 105). Nobody sits down and types a NUL. A control-character ESCAPE
 * passed through a JSON-encoded tool parameter — the Write tool's `content` —
 * arrives in the file as the RAW BYTE, because the JSON decoder resolves the
 * escape before anything writes it. EM-R0a's lane planted one exactly that way.
 * That is why the count keeps climbing although no author intends it, and why
 * "just do not write NULs" has never worked as a control.
 *
 * THE CURE, IN THE ORDER TO REACH FOR IT:
 *   1. A composite key needs NO separator — JSON.stringify(parts) is total and
 *      unambiguous. EM-R0a cured its own plant this way, structurally.
 *   2. If a separator is genuinely unavoidable, BUILD it at runtime:
 *      String.fromCharCode(0). It carries no raw byte through any tool, and it
 *      is the SAME STRING, so a converted key keeps its identity exactly.
 *   3. NEVER a control-character escape in a file a tool writes — the escape is
 *      the vector, not the protection. This holds when DOCUMENTING the class
 *      too: in prose, a receipt or a commit message, spell the escape in WORDS
 *      ("a backslash-x-0-0 escape"), because the sequence itself decodes on the
 *      way through and the warning becomes the thing it warns about. Numeric hex
 *      literals (0x00 below) are safe — they are numbers, not escapes.
 * This file follows its own rule: every test payload is built with
 * String.fromCharCode / byte arrays and no NUL escape is spelled anywhere in it,
 * so no tool pass that decodes escapes can re-plant the raw byte here.
 *
 * ⚠ THE VECTOR IS NOT HYPOTHETICAL AND IT FIRES OFTEN. While widening THIS file
 * TOOL-25 planted four raw NULs into it by exactly the route described above —
 * git plumbing wants a NUL record separator, and every one of the four was typed
 * as an escape. This pin's own scan caught them before the commit. Two of the
 * lane's untracked scratch scripts caught the same accident and were cured the
 * same way: an untracked file carrying the byte is not evidence, it is a hazard
 * waiting for someone's next `git add`.
 *
 * ⛔ WHY THE BYTE SCAN EXISTS AND THE `git diff --numstat` CENSUS CANNOT REPLACE IT
 * (TOOL-25, 2026-09-20, measured). Git decides "binary" by looking only at the
 * FIRST ~8 KiB of a blob. Measured on this tree the day this arm landed:
 *   src/domain/worldPulse/supplyCompleteness.js  NUL at offset  6,520 → git says BINARY
 *   scripts/prose-wave-gate.mjs                  NUL at offset 39,627 → git says TEXT
 *   docs/.../EM-P2.md                            NUL at offset 40,219 → git says TEXT
 * So a NUL past the 8 KiB window is invisible to every diff-shaped instrument
 * while still corrupting the file. The numstat census below is a real arm with a
 * real population, but it is the SHALLOW half; the byte scan is the deep half.
 *
 * ⛔ SCOPE IS `git ls-files`, NEVER A FILESYSTEM WALK (the chair's ruling, ODQ
 * §934.47 addendum 104). Tracked files are the law's subject: a lane's untracked
 * scratch copy under tests/ is not a defect and must not red a gate, and a file
 * that is not tracked cannot reach anyone else. Text-ness is decided by
 * .gitattributes FIRST (a path git declares `text` is in scope whatever its
 * extension — this is how the 132 tracked SVGs join), and only for paths with no
 * declaration does the extension list below decide.
 *
 * HISTORY. This pin's roots were src/ and tests/ until 2026-09-20. FIX-P1b
 * authored the class's 8th instance in src/lib/anonForkSalt.js — inside the old
 * roots — and it still shipped to review, because that lane ran three named
 * tests/lint files and never the directory whole. The roots were widened to the
 * whole tracked tree by TOOL-25 after a census found two more carriers that the
 * old roots could not have reached at all (scripts/, docs/).
 */
import { readFileSync, statSync, existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, it, expect } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The two trees held to the WIDE rule (every C0 byte), by repo-relative prefix. */
const STRICT_PREFIXES = ['src/', 'tests/'];

/** git's canonical empty tree — the base that makes `diff` classify every tracked blob. */
const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

/**
 * Extensions treated as text when .gitattributes declares NOTHING for the path.
 * A declared `text` path is in scope regardless; a declared `binary` path never is.
 */
const TEXT_EXT = new Set([
  'js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'json', 'md',
  'css', 'html', 'sh', 'sql', 'yml', 'yaml', 'txt',
]);

/**
 * Paths the NUL rule does not reach, each with the ruled act that REMOVES it.
 *
 * ⛔ IT IS EMPTY, AND IT WAS BORN EMPTY ON PURPOSE (the chair, 2026-09-20). TOOL-25
 * briefly carried one row here for EM-P2.md, whose fenced listing held the last raw
 * NUL in the tree; the chair ruled that a register born with a row its own remover
 * deletes a commit later is the worse shape, landed the cure as a docs act first,
 * and the row never shipped. An empty register is the honest state: there is no
 * tracked text file in this estate that may contain a NUL.
 *
 * ⛔ SHRINK-ONLY, ceiling 0. Two admissible reasons would be (a) a real binary asset
 * that must live under a scanned root, or (b) a carrier whose cure belongs to another
 * hand and is ALREADY RULED. Never use this to silence a fresh residue — a new carrier
 * is a STOP for the chair, not a row here. Every entry is printed on every run by the
 * census arm, so a row cannot rot quietly, and `exemptionDefects` below refuses one
 * that names no ruled act. Because the register is empty, that validator would be
 * VACUOUS in production, so it is exercised by injection — the same posture
 * tests/lint/contractTestAntiVacuity.walker.test.js takes with allowlists that are
 * empty at birth: the rule is proven to bite before it has anything to bite.
 */
const EXEMPT = new Map([]);

/** The exemption register only ever shrinks. Raise this NEVER. */
const EXEMPT_CEILING = 0;

/** A row must name the ruled act that deletes it, and point at a tracked path. */
const RULED_ACT = /\b(DOC-\d|OWNER|FIX-[A-Z]?\d|CURE-[A-Z]|TOOL-\d)/;

/**
 * Validate exemption rows; one defect string per bad row. Exported and driven with
 * synthetic rows by the guard-the-guard arm, because the live register is EMPTY.
 */
export function exemptionDefects(entries, tracked) {
  const defects = [];
  for (const [rel, why] of entries) {
    if (!RULED_ACT.test(String(why))) defects.push(`${rel}: names no ruled act that removes it`);
    if (!tracked.includes(rel)) defects.push(`${rel}: is not a tracked path`);
  }
  return defects;
}

const NAMES = {
  0x00: 'NUL', 0x01: 'SOH', 0x02: 'STX', 0x03: 'ETX', 0x04: 'EOT', 0x05: 'ENQ',
  0x06: 'ACK', 0x07: 'BEL', 0x08: 'BS',  0x0b: 'VT',  0x0c: 'FF',  0x0e: 'SO',
  0x0f: 'SI',  0x10: 'DLE', 0x11: 'DC1', 0x12: 'DC2', 0x13: 'DC3', 0x14: 'DC4',
  0x15: 'NAK', 0x16: 'SYN', 0x17: 'ETB', 0x18: 'CAN', 0x19: 'EM',  0x1a: 'SUB',
  0x1b: 'ESC', 0x1c: 'FS',  0x1d: 'GS',  0x1e: 'RS',  0x1f: 'US',  0x7f: 'DEL',
};

const isBanned = (b) => (b < 0x20 && b !== 0x09 && b !== 0x0a && b !== 0x0d) || b === 0x7f;
const isNul = (b) => b === 0x00;

/** Scan a Buffer; return every banned byte as {offset, byte, line, col} (1-based line/col). */
export function scanBuffer(buf, predicate = isBanned) {
  const hits = [];
  let line = 1;
  let col = 1;
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if (predicate(b)) hits.push({ offset: i, byte: b, line, col });
    if (b === 0x0a) { line++; col = 1; } else { col++; }
  }
  return hits;
}

const hex = (b) => `0x${b.toString(16).padStart(2, '0').toUpperCase()}`;

/**
 * Scan the given repo-relative paths; return formatted violation strings.
 * Takes an explicit path list — there is no directory walk anywhere in this file.
 */
export function findControlBytes(relPaths, root = ROOT, predicate = isBanned) {
  const violations = [];
  for (const rel of relPaths) {
    const abs = join(root, rel);
    if (!existsSync(abs) || !statSync(abs).isFile()) continue;
    for (const h of scanBuffer(readFileSync(abs), predicate)) {
      violations.push(
        `${rel}:${h.line}:${h.col}  raw ${hex(h.byte)} (${NAMES[h.byte]}) at byte offset ${h.offset}`,
      );
    }
  }
  return violations;
}

// The raw byte, BUILT never typed — used both as git's -z record separator below and
// as the test payloads' corruption. Declared here, above its first use.
const NUL = String.fromCharCode(0);

const git = (args) => execFileSync('git', args, { cwd: ROOT, maxBuffer: 1 << 28 }).toString('utf8');

/** Every tracked repo-relative path. */
export function trackedFiles() {
  return git(['ls-files', '-z']).split(NUL).filter(Boolean);
}

/**
 * .gitattributes verdicts for the given paths: path -> {binary, text}, each
 * 'set' | 'unset' | 'unspecified'. Asked of git rather than re-parsed, so this
 * file cannot disagree with what git itself believes.
 */
export function attributesFor(paths) {
  const out = execFileSync('git', ['check-attr', '--stdin', '-z', 'binary', 'text'], {
    cwd: ROOT,
    input: `${paths.join(NUL)}${NUL}`,
    maxBuffer: 1 << 28,
  }).toString('utf8');
  const fields = out.split(NUL);
  const map = new Map();
  for (let i = 0; i + 2 < fields.length; i += 3) {
    const [path, attr, value] = [fields[i], fields[i + 1], fields[i + 2]];
    const row = map.get(path) || { binary: 'unspecified', text: 'unspecified' };
    row[attr] = value;
    map.set(path, row);
  }
  return map;
}

/** Is this tracked path subject to the text rules? */
export function isTextSubject(rel, attrs) {
  const row = attrs.get(rel);
  if (row && row.binary === 'set') return false;
  if (row && row.text === 'set') return true;
  const ext = rel.includes('.') ? rel.split('.').pop().toLowerCase() : '';
  return TEXT_EXT.has(ext);
}

/**
 * The tracked files git classifies BINARY (numstat prints "-" for both columns).
 * ⛔ Diffed against the WORKING TREE, not HEAD: the byte scan above reads the working
 * tree, and a census one commit behind it would call a file binary that was cured in
 * this very commit (measured — supplyCompleteness.js read "-  -" against HEAD and
 * "210  0" against the working tree on the day its NUL was converted).
 */
export function gitBinaryPaths() {
  const set = new Set();
  for (const line of git(['diff', '--numstat', EMPTY_TREE]).split('\n')) {
    const parts = line.split('\t');
    if (parts.length >= 3 && parts[0] === '-' && parts[1] === '-') set.add(parts.slice(2).join('\t'));
  }
  return set;
}

// Computed once; every arm below reads these.
const TRACKED = trackedFiles();
const ATTRS = attributesFor(TRACKED);
const SUBJECTS = TRACKED.filter((rel) => isTextSubject(rel, ATTRS));
const STRICT = SUBJECTS.filter((rel) => STRICT_PREFIXES.some((p) => rel.startsWith(p)));
const REST = SUBJECTS.filter((rel) => !STRICT_PREFIXES.some((p) => rel.startsWith(p)));

describe('control-byte pin (byte-level scan — the text-mode blind spot)', () => {
  it('no raw control bytes (C0 except tab/LF/CR, plus DEL) anywhere in tracked src/** or tests/**', () => {
    // Anti-vacuity: these two trees are thousands of files. A collapsed population
    // is the failure mode that makes this arm pass while scanning nothing.
    expect(STRICT.length).toBeGreaterThan(4000);
    const violations = findControlBytes(STRICT.filter((rel) => !EXEMPT.has(rel)));
    expect(
      violations,
      `Raw control byte(s) found in source (${violations.length}):\n${violations.join('\n')}\n\n` +
        `A raw control byte in text source is corruption (this class hid a NUL .join() ` +
        `separator in AccountPage.jsx and made git treat the file as binary). If the ` +
        `character itself is intended, BUILD it — String.fromCharCode(0) — never type the raw byte.`,
    ).toEqual([]);
  });

  it('no raw NUL in any tracked text file OUTSIDE src/ and tests/ (docs, scripts, public, supabase, api, e2e, root)', () => {
    // Anti-vacuity, and specifically that the widening reached the trees the old
    // roots could not: the two carriers TOOL-25 found lived in scripts/ and docs/.
    expect(REST.length).toBeGreaterThan(800);
    const treesReached = new Set(REST.map((rel) => (rel.includes('/') ? rel.split('/')[0] : '(root)')));
    for (const tree of ['docs', 'scripts', 'public', 'supabase']) {
      expect(treesReached, `the widened scope must reach ${tree}/`).toContain(tree);
    }
    const violations = findControlBytes(REST.filter((rel) => !EXEMPT.has(rel)), ROOT, isNul);
    expect(
      violations,
      `Raw NUL byte(s) found in tracked text files (${violations.length}):\n${violations.join('\n')}\n\n` +
        `A raw NUL makes git classify the file BINARY (if it falls in the first 8 KiB) and is ` +
        `invisible to every text-mode grep either way. BUILD the character — ` +
        `String.fromCharCode(0) — and never type the raw byte into a source file.`,
    ).toEqual([]);
  });

  it('no tracked text-extension file is classified BINARY by git (the numstat census)', () => {
    const binary = gitBinaryPaths();
    expect(binary.size).toBeGreaterThan(100); // the real asset population; a collapse means the diff failed
    const wrong = SUBJECTS.filter((rel) => binary.has(rel)).sort();
    // Report-only census, written with process.stdout.write because vitest's default
    // reporter DROPS a passing test's console.log (the chair, 2026-09-20, after FIX-C2).
    process.stdout.write(
      `[controlBytes] tracked=${TRACKED.length} textSubjects=${SUBJECTS.length} `
      + `strict=${STRICT.length} rest=${REST.length} gitBinary=${binary.size} `
      + `textSubjectsClassifiedBinary=${wrong.length}\n`,
    );
    for (const rel of wrong) process.stdout.write(`[controlBytes]   BINARY-BUT-TEXT ${rel}\n`);
    for (const [rel, why] of EXEMPT) process.stdout.write(`[controlBytes]   EXEMPT ${rel} :: ${why}\n`);
    expect(
      wrong,
      `Tracked file(s) git classifies BINARY while this pin treats them as text (${wrong.length}):\n`
        + `${wrong.join('\n')}\n\nEither the file carries a control byte in its first 8 KiB `
        + `(cure the byte), or it is a genuine binary asset and needs a row in .gitattributes.`,
    ).toEqual([]);
  });

  it('the exemption register is EMPTY and only ever shrinks — no tracked text file may carry a NUL', () => {
    expect(EXEMPT.size).toBeLessThanOrEqual(EXEMPT_CEILING);
    expect(EXEMPT_CEILING, 'the ceiling is a ratchet — it is lowered, never raised').toBe(0);
    expect(exemptionDefects([...EXEMPT.entries()], TRACKED)).toEqual([]);
  });

  // Guardrail on the guard, part 0: the register is EMPTY, so the validator above
  // governs a population of none and would pass vacuously forever. Drive it with
  // synthetic rows instead — the rule is proven to bite before it has anything to bite.
  it('guard-the-guard: the exemption validator convicts a row naming no ruled act, and clears one that does', () => {
    const tracked = ['docs/example.md'];
    expect(
      exemptionDefects([['docs/example.md', 'we will get to this later']], tracked),
      'a row with no ruled act named must be convicted',
    ).toEqual(['docs/example.md: names no ruled act that removes it']);
    expect(
      exemptionDefects([['docs/example.md', 'DOC-4 (the chair): replaced by the built spelling']], tracked),
      'a row naming a ruled act must pass — the validator is a door, not a wall',
    ).toEqual([]);
    expect(
      exemptionDefects([['docs/ghost.md', 'DOC-4 (the chair): names a path nothing tracks']], tracked),
      'a row pointing at an untracked path must be convicted',
    ).toEqual(['docs/ghost.md: is not a tracked path']);
  });

  // Guardrail on the guard, part 1: the scanner must flag the EXACT shape that
  // escaped the text-mode pin — AccountPage.jsx:79's NUL .join() separator,
  // reconstructed here byte-for-byte.
  it('catches the historical AccountPage case: a raw NUL used as a .join() separator', () => {
    const corrupted = `  ].join('${NUL}');\n`;
    const hits = scanBuffer(Buffer.from(corrupted, 'utf8'));
    expect(hits).toHaveLength(1);
    expect(hits[0]).toEqual({ offset: 10, byte: 0x00, line: 1, col: 11 }); // col 11 — matches the real file's hit
  });

  // Guardrail on the guard, part 2: whitelisted whitespace must NOT be flagged,
  // banned neighbours must. Boundary bytes pin the predicate exactly.
  it('scanner predicate: tab/LF/CR pass; NUL, ESC, VT, FF, US (0x1F), DEL fail; 0x20 and UTF-8 pass', () => {
    expect(scanBuffer(Buffer.from('a\tb\nc\r\nd — ⚔️ ok', 'utf8'))).toEqual([]);
    const bad = Buffer.from([0x00, 0x1b, 0x0b, 0x0c, 0x1f, 0x7f, 0x20, 0x41]);
    expect(scanBuffer(bad).map((h) => h.byte)).toEqual([0x00, 0x1b, 0x0b, 0x0c, 0x1f, 0x7f]);
    // The NUL-only predicate is strictly narrower — it is what the wide tree is held to.
    expect(scanBuffer(bad, isNul).map((h) => h.byte)).toEqual([0x00]);
  });

  // Guardrail on the guard, part 3: end-to-end through the read + format path.
  // A fixture with a raw NUL is generated OUTSIDE the repo at test time (a
  // checked-in NUL fixture would trip the pin itself and make git treat the
  // fixture as binary), then scanned exactly like a tracked path is.
  it('end-to-end: reports file, line:col, and byte offset for a NUL fixture', () => {
    const dir = mkdtempSync(join(tmpdir(), 'control-byte-pin-'));
    try {
      writeFileSync(join(dir, 'fixture.jsx'), Buffer.from(`const k = parts.join('${NUL}');\n`, 'utf8'));
      writeFileSync(join(dir, 'clean.jsx'), 'const ok = true;\n');
      const violations = findControlBytes(['fixture.jsx', 'clean.jsx'], dir);
      expect(violations).toHaveLength(1);
      expect(violations[0]).toContain('fixture.jsx:1:23');
      expect(violations[0]).toContain('0x00 (NUL)');
      expect(violations[0]).toContain('byte offset 22');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  // Guardrail on the guard, part 4: the scope itself. .gitattributes decides
  // text-ness before any extension does, and a declared-binary path is never a subject.
  it('scope: .gitattributes decides before the extension list, and tracked enumeration is whole', () => {
    expect(TRACKED.length).toBeGreaterThan(6000);
    // A declared-text path with a NON-listed extension is a subject (the tracked SVGs).
    const svgs = SUBJECTS.filter((rel) => rel.endsWith('.svg'));
    expect(svgs.length, 'tracked .svg files are declared `text eol=lf` and so are in scope').toBeGreaterThan(100);
    // A declared-binary path is never a subject, whatever it looks like.
    const pngs = TRACKED.filter((rel) => rel.endsWith('.png'));
    expect(pngs.length).toBeGreaterThan(50);
    expect(SUBJECTS.filter((rel) => rel.endsWith('.png'))).toEqual([]);
    // And the .glb assets carry a binary declaration, so the numstat census has a
    // clean denominator rather than 25 undeclared exhibits in it.
    const glbs = TRACKED.filter((rel) => rel.endsWith('.glb'));
    expect(glbs.length).toBeGreaterThan(20);
    expect(SUBJECTS.filter((rel) => rel.endsWith('.glb'))).toEqual([]);
  });
});
