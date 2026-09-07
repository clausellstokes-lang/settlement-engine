/**
 * fontsize-tokens.mjs — P140 token-cleanup codemod (fontSize → FS.*).
 *
 * One-shot, auditable transform that retires the bulk of the
 * `visual-budget/no-raw-fontsize` lint debt with PROVABLY ZERO visual change.
 *
 * What it does
 * ------------
 *   Rewrites exact-value inline font sizes to the matching theme token:
 *
 *       fontSize: 13     →   fontSize: FS.md
 *       fontSize: 8      →   fontSize: FS.nano
 *
 *   …for the integers that have an EXACT token in `FS`
 *   (7,8,9,10,11,12,13,15,17,20,24 → pico,nano,micro,xxs,xs,sm,md,lg,xl,xxl,h1).
 *   Because every substitution is value-identical (FS.md === 13), the rendered
 *   result is byte-for-byte the same. It then merges `FS` into the file's
 *   existing components-theme named import.
 *
 * What it deliberately skips (documented remaining debt)
 * ------------------------------------------------------
 *   • Half-steps (7.5, 8.5, 10.5, 11.5, 12.5, …) and off-scale sizes
 *     (14, 16, 18, 22, 26, …) — no exact token exists; rounding would shift
 *     the visual, so these are left for a deliberate design pass.
 *   • The entire `src/pdf/**` subtree — it imports a *different* theme
 *     (`src/pdf/theme.js`, which exposes `type`/`palette`/`toneBg`, not `FS`);
 *     its font sizing migrates to `type.*` tokens, a separate concern.
 *   • Files that reference a raw size but have no `{ … } from 'theme'` named
 *     import (logged as SKIPPED so they can be handled by hand).
 *   • Raw colours — bespoke domain palette (tier/category/relationship hex),
 *     aliased imports, embedded hexes; out of scope for this pass.
 *
 * Usage:  node tools/codemods/fontsize-tokens.mjs [--dry]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep, dirname } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const THEME = join(SRC, 'components', 'theme.js');
const DRY = process.argv.includes('--dry');

// import specifier from `file` to the components theme module, posix-normalised
function themeSpecifier(file) {
  let rel = relative(dirname(file), THEME).split(sep).join('/').replace(/\.js$/, '.js');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

// number → FS token name (only exact matches; no rounding)
const MAP = { 7: 'pico', 8: 'nano', 9: 'micro', 10: 'xxs', 11: 'xs', 12: 'sm', 13: 'md', 15: 'lg', 17: 'xl', 20: 'xxl', 24: 'h1' };
const NUMS = Object.keys(MAP).join('|');
// fontSize: <int> not followed by a digit, dot, or letter (so 13.5 / 135 / 13px are left alone)
const FS_RE = new RegExp(`fontSize:(\\s*)(${NUMS})(?![\\d.a-zA-Z])`, 'g');
// components-theme named import (pdf is excluded before we get here)
const IMPORT_RE = /import\s*\{([\s\S]*?)\}\s*from\s*(['"])([^'"]*theme(?:\.js)?)\2/;

const SKIP_FILES = new Set([
  join(SRC, 'components', 'theme.js'),
  join(SRC, 'design', 'tokens.js'),
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules') continue;
      // exclude the pdf subtree wholesale — different theme module
      if (p === join(SRC, 'pdf')) continue;
      walk(p, out);
    } else if (/\.(jsx?|mjs)$/.test(name) && !SKIP_FILES.has(p)) {
      out.push(p);
    }
  }
  return out;
}

const tally = {};
const changed = [];      // [path, 'merged' | 'added']
const skippedConflict = []; // has FS already but no theme import to merge into
let totalSubs = 0;

for (const file of walk(SRC)) {
  const src = readFileSync(file, 'utf8');
  if (!FS_RE.test(src)) continue;
  FS_RE.lastIndex = 0;

  let subs = 0;
  let next = src.replace(FS_RE, (_m, ws, num) => {
    const tok = MAP[num];
    tally[tok] = (tally[tok] || 0) + 1;
    subs += 1;
    return `fontSize:${ws}FS.${tok}`;
  });
  if (subs === 0) continue;

  // ensure FS is in scope.
  let how;
  const m = IMPORT_RE.exec(next);
  if (m) {
    // merge into the existing components-theme named import
    const inner = m[1];
    if (!/\bFS\b/.test(inner)) {
      const merged = inner.replace(/(\s*)$/, ', FS$1');
      next = next.replace(m[0], m[0].replace(inner, merged));
    }
    how = 'merged';
  } else if (/\bFS\b/.test(src)) {
    // already has some FS binding but no theme import to reconcile with — leave it
    skippedConflict.push(relative(ROOT, file).split(sep).join('/'));
    continue;
  } else {
    // add a fresh FS import after the first import statement (or at top)
    const line = `import { FS } from '${themeSpecifier(file)}';\n`;
    const firstImport = /^import\b[\s\S]*?;[^\n]*\n/m.exec(next);
    if (firstImport) {
      const at = firstImport.index + firstImport[0].length;
      next = next.slice(0, at) + line + next.slice(at);
    } else {
      next = line + next;
    }
    how = 'added';
  }

  totalSubs += subs;
  changed.push([relative(ROOT, file).split(sep).join('/'), how]);
  if (!DRY) writeFileSync(file, next);
}

console.log(`\n=== fontSize → FS.* codemod ${DRY ? '(DRY RUN)' : '(APPLIED)'} ===`);
console.log(`files changed:        ${changed.length}`);
console.log(`total substitutions:  ${totalSubs}`);
console.log('\nby token:');
for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`  FS.${k.padEnd(5)} ${v}`);
}
if (skippedConflict.length) {
  console.log(`\nSKIPPED (pre-existing FS binding, no theme import) — ${skippedConflict.length}:`);
  for (const f of skippedConflict) console.log('  ' + f);
}
const added = changed.filter(c => c[1] === 'added');
console.log(`\nchanged files: ${changed.length}  (merged FS: ${changed.length - added.length}, added FS import: ${added.length})`);
for (const [f, how] of changed) console.log(`  [${how}] ${f}`);
