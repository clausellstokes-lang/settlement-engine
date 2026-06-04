#!/usr/bin/env node
/**
 * scripts/strip-unused-vars.mjs - automated cleanup of no-unused-vars warnings.
 *
 * Walks the ESLint JSON report and applies safe mechanical fixes per
 * category:
 *
 *   1. **Unused named import** - the warning's column lands on a name
 *      inside `import { ... } from '...';`. We delete just that name
 *      from the import list. If the list becomes empty, drop the
 *      whole line.
 *   2. **Unused function parameter** - the warning lands on a name
 *      inside a function parameter list. We rename it to `_name` so
 *      it matches the existing `argsIgnorePattern: '^_'`.
 *   3. **Other** - left untouched. Hand-edit those.
 *
 * Bails on multi-line import statements (we'd need a real parser to
 * be safe). Those are rare in this codebase and easy to fix by hand.
 *
 * After running, re-run `npx eslint .` to confirm the warning count
 * drops; then `npm test` to confirm nothing broke.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const eslintOut = execSync('npx eslint . --format=json', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const reports = JSON.parse(eslintOut);

const fileCache = new Map();
function readLines(path) {
  if (!fileCache.has(path)) fileCache.set(path, readFileSync(path, 'utf8').split(/\r?\n/));
  return fileCache.get(path);
}
function writeLines(path, lines) {
  // Preserve original trailing newline behaviour.
  writeFileSync(path, lines.join('\n'));
}

/**
 * Remove `name` from a single-line `import { ... } from '...'`
 * declaration. Returns the new line, or null if the import is the
 * entire list (caller should delete the line).
 *
 * Handles:
 *   - `import { a, b, c } from 'x';`
 *   - `import Foo, { a, b } from 'x';`
 *   - `import { a as A, b } from 'x';`
 */
function removeFromImport(line, name) {
  // Match `import [Default, ]{ ... } from '...'`.
  const re = /^(\s*import\s+)(?:([\w$]+)\s*,\s*)?\{([^}]+)\}(\s*from\s+['"][^'"]+['"]\s*;?\s*)$/;
  const m = line.match(re);
  if (!m) return undefined; // not a single-line braced import
  const [, leading, defaultImport, body, trailing] = m;
  const parts = body.split(',').map(p => p.trim()).filter(Boolean);
  const filtered = parts.filter(p => {
    // `p` may be `Foo`, `Foo as Bar`, or `type Foo`. The "binding name"
    // is the LAST identifier (the local name after `as`, if present).
    const local = p.split(/\s+as\s+/).pop().trim();
    return local !== name;
  });
  if (filtered.length === parts.length) return undefined; // no change
  if (filtered.length === 0) {
    if (defaultImport) {
      // Drop the braced clause, keep the default.
      return `${leading}${defaultImport}${trailing}`.replace(/,\s*from/, ' from');
    }
    return null; // delete the whole line
  }
  return `${leading}${defaultImport ? `${defaultImport}, ` : ''}{ ${filtered.join(', ')} }${trailing}`;
}

let importsTrimmed = 0;
let importsDeleted = 0;
let argsUnderscored = 0;
const skipped = [];

const fileEdits = new Map(); // path → Map<lineIdx, newLine|null>

for (const report of reports) {
  for (const msg of report.messages) {
    if (msg.ruleId !== 'no-unused-vars') continue;
    // ESLint's no-unused-vars produces three message shapes:
    //   - "'X' is defined but never used"     (imports, function decls)
    //   - "'X' is assigned a value but never used" (const/let assignments)
    //   - "'X' is defined but never used. Allowed unused args ..."
    // Match the leading `'X' is ... never used` for all of them.
    const nameMatch = msg.message.match(/^'([^']+)' is (?:defined|assigned a value) but never used/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    const path = report.filePath;
    const lineIdx = msg.line - 1;
    const lines = readLines(path);
    const line = lines[lineIdx];
    if (line === undefined) { skipped.push(`${path}:${msg.line} (no line)`); continue; }

    // Skip if we've already queued an edit for this line - we'll
    // re-run after writing.
    if (fileEdits.has(path) && fileEdits.get(path).has(lineIdx)) {
      // Another warning on the same line. Re-apply removal to the
      // pending new line if it's an import.
      const pending = fileEdits.get(path).get(lineIdx);
      if (pending == null) continue; // line slated for deletion
      const upd = removeFromImport(pending, name);
      if (upd !== undefined) {
        fileEdits.get(path).set(lineIdx, upd);
        importsTrimmed++;
        continue;
      }
      skipped.push(`${path}:${msg.line} (multi-warning line, name='${name}')`);
      continue;
    }

    // Case 1: import.
    if (/^\s*import\b/.test(line)) {
      const upd = removeFromImport(line, name);
      if (upd === undefined) {
        skipped.push(`${path}:${msg.line} import unmatched: ${line.slice(0, 80)}`);
        continue;
      }
      if (!fileEdits.has(path)) fileEdits.set(path, new Map());
      fileEdits.get(path).set(lineIdx, upd);
      if (upd === null) importsDeleted++; else importsTrimmed++;
      continue;
    }

    // Case 2: function parameter. The eslint column points at the
    // first char of the identifier. We do a targeted rename of the
    // exact char range so we don't accidentally hit a usage further
    // in the same line.
    if (msg.column && msg.endColumn && msg.endColumn > msg.column) {
      const start = msg.column - 1;
      const end = msg.endColumn - 1;
      const slice = line.slice(start, end);
      if (slice === name && !name.startsWith('_')) {
        const upd = line.slice(0, start) + '_' + name + line.slice(end);
        if (!fileEdits.has(path)) fileEdits.set(path, new Map());
        fileEdits.get(path).set(lineIdx, upd);
        argsUnderscored++;
        continue;
      }
    }

    skipped.push(`${path}:${msg.line} name='${name}': ${line.slice(0, 80)}`);
  }
}

// Apply edits.
for (const [path, edits] of fileEdits) {
  const lines = readLines(path);
  // Process bottom-up so deletions don't shift indices.
  const sorted = [...edits.entries()].sort((a, b) => b[0] - a[0]);
  for (const [idx, newLine] of sorted) {
    if (newLine === null) lines.splice(idx, 1);
    else lines[idx] = newLine;
  }
  writeLines(path, lines);
}

console.log(`Imports trimmed:  ${importsTrimmed}`);
console.log(`Imports deleted:  ${importsDeleted}`);
console.log(`Args underscored: ${argsUnderscored}`);
console.log(`Skipped:          ${skipped.length}`);
if (skipped.length) console.log('\nSkipped sample:');
console.log(skipped.slice(0, 25).join('\n'));
