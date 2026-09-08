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
 * RULE. No file under src/** or tests/** may contain a raw C0 control byte
 * other than tab (0x09), LF (0x0A), CR (0x0D) — nor DEL (0x7F), same class.
 * There is no legitimate use: when source code NEEDS a control character it
 * writes an ASCII escape spelling (backslash-x00 / backslash-u0000), which
 * contains no raw byte. This file deliberately never spells out a NUL escape
 * either — test payloads are built with String.fromCharCode / byte arrays —
 * so no tool pass that decodes escapes can re-plant the raw byte here.
 * UTF-8 multibyte sequences never contain bytes below 0x80, so a raw-byte scan
 * cannot false-positive on non-ASCII text (em-dashes, emoji, CJK are safe).
 *
 * Every file is scanned regardless of extension (the tree is all-text today:
 * js/jsx/ts/json/css/snap). If a legitimately-binary asset ever lands under a
 * scanned root, add it to BINARY_ALLOWLIST explicitly — do not widen the rule.
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, it, expect } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCAN_DIRS = ['src', 'tests'];

// Repo-relative paths exempt from the scan. Two admissible reasons: (a) a real
// binary asset that must live under a scanned root; (b) an OWNER-PARKED
// intentional raw-NUL that the owner has not yet ruled keep-vs-convert on. Keep
// this list minimal and annotated — do NOT use it to silence a fresh residue.
const BINARY_ALLOWLIST = new Set([
  // OWNER CALL (MASTER_MERGE_PLAN §8 item 2 / §5.4): supplyCompleteness.js:158
  // joins a (supplier, commodity) memo cache key with a raw NUL. The owner has
  // parked the keep-as-is-vs-convert-to-'|' decision AT the master merge; this
  // file is exempted so the pin can land green now. When the owner rules, either
  // this entry is removed (convert-to-'|') or made permanent (keep-as-is).
  'src/domain/worldPulse/supplyCompleteness.js',
]);

const NAMES = {
  0x00: 'NUL', 0x01: 'SOH', 0x02: 'STX', 0x03: 'ETX', 0x04: 'EOT', 0x05: 'ENQ',
  0x06: 'ACK', 0x07: 'BEL', 0x08: 'BS',  0x0b: 'VT',  0x0c: 'FF',  0x0e: 'SO',
  0x0f: 'SI',  0x10: 'DLE', 0x11: 'DC1', 0x12: 'DC2', 0x13: 'DC3', 0x14: 'DC4',
  0x15: 'NAK', 0x16: 'SYN', 0x17: 'ETB', 0x18: 'CAN', 0x19: 'EM',  0x1a: 'SUB',
  0x1b: 'ESC', 0x1c: 'FS',  0x1d: 'GS',  0x1e: 'RS',  0x1f: 'US',  0x7f: 'DEL',
};

const isBanned = (b) => (b < 0x20 && b !== 0x09 && b !== 0x0a && b !== 0x0d) || b === 0x7f;

/** Scan a Buffer; return every banned byte as {offset, byte, line, col} (1-based line/col). */
export function scanBuffer(buf) {
  const hits = [];
  let line = 1;
  let col = 1;
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if (isBanned(b)) hits.push({ offset: i, byte: b, line, col });
    if (b === 0x0a) { line++; col = 1; } else { col++; }
  }
  return hits;
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const hex = (b) => `0x${b.toString(16).padStart(2, '0').toUpperCase()}`;

/** Scan every file under the given root dirs; return formatted violation strings. */
export function findControlBytes(rootDirs, root = ROOT) {
  const violations = [];
  for (const d of rootDirs) {
    for (const abs of walk(join(root, d))) {
      const rel = relative(root, abs).replace(/\\/g, '/');
      if (BINARY_ALLOWLIST.has(rel)) continue;
      for (const h of scanBuffer(readFileSync(abs))) {
        violations.push(
          `${rel}:${h.line}:${h.col}  raw ${hex(h.byte)} (${NAMES[h.byte]}) at byte offset ${h.offset}`,
        );
      }
    }
  }
  return violations;
}

// The raw byte for test payloads — never spelled as an escape in this file
// (see header: an escape-decoding tool pass must not be able to plant it here).
const NUL = String.fromCharCode(0);

describe('control-byte pin (byte-level scan — the text-mode blind spot)', () => {
  it('no raw control bytes (C0 except tab/LF/CR, plus DEL) anywhere in src/** or tests/**', () => {
    const violations = findControlBytes(SCAN_DIRS);
    expect(
      violations,
      `Raw control byte(s) found in source (${violations.length}):\n${violations.join('\n')}\n\n` +
        `A raw control byte in text source is corruption (this class hid a NUL .join() ` +
        `separator in AccountPage.jsx and made git treat the file as binary). If the ` +
        `character itself is intended, write an escape spelling (backslash-x00) instead of the raw byte.`,
    ).toEqual([]);
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
  });

  // Guardrail on the guard, part 3: end-to-end through the walk + format path.
  // A fixture with a raw NUL is generated OUTSIDE the repo at test time (a
  // checked-in NUL fixture would trip the pin itself and make git treat the
  // fixture as binary), then scanned exactly like src/** is.
  it('end-to-end: reports file, line:col, and byte offset for a NUL fixture', () => {
    const dir = mkdtempSync(join(tmpdir(), 'control-byte-pin-'));
    try {
      writeFileSync(join(dir, 'fixture.jsx'), Buffer.from(`const k = parts.join('${NUL}');\n`, 'utf8'));
      writeFileSync(join(dir, 'clean.jsx'), 'const ok = true;\n');
      const violations = findControlBytes(['.'], dir);
      expect(violations).toHaveLength(1);
      expect(violations[0]).toContain('fixture.jsx:1:23');
      expect(violations[0]).toContain('0x00 (NUL)');
      expect(violations[0]).toContain('byte offset 22');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
