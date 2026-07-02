#!/usr/bin/env node
/**
 * fix-duplicate-keys — Remove earlier occurrences of exact duplicate
 * object keys. Preserves runtime behavior exactly: in JS object literals
 * the *later* key wins, so by removing the *earlier* duplicate we end up
 * with the same effective object the engine has been using all along —
 * just declared once, traversable by tools, and visible to validators.
 *
 * Casing collisions (e.g. "Foo" vs "foo") are NOT auto-fixed; they're
 * printed for human review since fixing requires knowing whether
 * downstream lookups are case-sensitive.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'acorn';
import { simple as walk } from 'acorn-walk';

const ROOT = new URL('../src/data/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

function listJsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...listJsFiles(p));
    else if (entry.endsWith('.js')) out.push(p);
  }
  return out;
}

function keyName(prop) {
  if (prop.computed) return null;
  if (prop.key.type === 'Identifier') return prop.key.name;
  if (prop.key.type === 'Literal')    return String(prop.key.value);
  return null;
}

export function processFile(file, dryRun) {
  const src = readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true, ranges: true });
  } catch (e) {
    return { file, parseError: e.message };
  }

  const removals = []; // { start, end, rec } byte ranges to delete + report record
  const casingCollisions = [];

  walk(ast, {
    ObjectExpression(node) {
      const seen = new Map(); // exact key → property node
      const lcSeen = new Map(); // lowered key → { key, line, prop }
      for (const prop of node.properties) {
        if (prop.type !== 'Property') continue;
        const k = keyName(prop);
        if (k == null) continue;
        if (seen.has(k)) {
          // Earlier prop loses; mark it for removal
          const earlier = seen.get(k);
          const rec = {
            key: k, kind: 'exact',
            line: earlier.loc.start.line,
            laterLine: prop.loc.start.line,
            snippet: src.slice(earlier.start, earlier.end),
          };
          removals.push({ start: earlier.start, end: earlier.end, key: k, line: earlier.loc.start.line, rec });
        }
        seen.set(k, prop);
        const lc = k.toLowerCase();
        if (lcSeen.has(lc) && lcSeen.get(lc).key !== k) {
          // Casing collision: the consumer's `Object.keys().find(k =>
          // k.toLowerCase() === target.toLowerCase())` always returns the
          // first-inserted key, so this *later*, differently-cased entry
          // is unreachable dead code. Drop it. The recovery report
          // preserves the snippet in case the difference was intentional.
          casingCollisions.push({
            file, key: k, otherKey: lcSeen.get(lc).key,
            line: prop.loc.start.line, otherLine: lcSeen.get(lc).line,
          });
          const rec = {
            key: k, kind: 'casing', otherKey: lcSeen.get(lc).key,
            line: prop.loc.start.line,
            laterLine: lcSeen.get(lc).line,
            snippet: src.slice(prop.start, prop.end),
          };
          removals.push({ start: prop.start, end: prop.end, key: k, line: prop.loc.start.line, rec });
        } else if (!lcSeen.has(lc)) {
          lcSeen.set(lc, { key: k, line: prop.loc.start.line, prop });
        }
      }
    },
  });

  if (!removals.length && !casingCollisions.length) return { file, removed: 0, casingCollisions };

  // A removed property can itself CONTAIN further removals (its value is an
  // object literal with its own duplicate keys — the walk visits nested
  // ObjectExpressions too), and one property can be flagged twice (once by
  // the exact pass and once by the casing pass). The splice loop below
  // applies absolute original-source offsets to a mutating string, so any
  // overlapping ranges shift surviving bytes and corrupt the file (verified:
  // a key `outer` was rewritten to `ter`). AST property ranges either nest
  // exactly or are disjoint, so it is sufficient to (1) collapse identical
  // ranges and (2) drop ranges contained within another surviving range —
  // the containing splice deletes them wholesale, and its recovery snippet
  // already includes theirs.
  const byRange = new Map();
  for (const r of removals) {
    const id = `${r.start}:${r.end}`;
    if (!byRange.has(id)) byRange.set(id, r);
  }
  const deduped = [...byRange.values()];
  const splices = deduped.filter(
    (r) => !deduped.some((q) => q !== r && q.start <= r.start && q.end >= r.end),
  );
  const dropped = splices.map((r) => r.rec); // report records for what is actually spliced

  // Sort removals descending by start so byte offsets stay valid as we splice.
  splices.sort((a, b) => b.start - a.start);

  let out = src;
  for (const r of splices) {
    // Extend the deletion range forward to consume the property separator.
    // The source files use a few formatting variants:
    //   `},`                            — comma immediately after `}`
    //   `}\n,`                          — comma on its own line after `}`
    //   `}\n  \n,\n`                    — comma after blank lines (rare but real)
    //   `}` (last property in the literal) — no separator at all
    //
    // Strategy: scan forward through ALL whitespace (including newlines) to
    // find the first non-whitespace char. If it's a `,`, we own that comma
    // (it was this property's separator) — consume up to and including it,
    // plus one trailing newline so we don't leave an empty line. If the
    // first non-whitespace char is anything else (typically `}` closing the
    // outer object), don't extend at all — this property was the last one
    // and had no trailing comma to consume.
    let end = r.end;
    let scan = end;
    while (scan < out.length && /\s/.test(out[scan])) scan++;
    if (out[scan] === ',') {
      end = scan + 1;
      // Eat trailing horizontal whitespace and one newline so we don't
      // leave a half-blank line behind.
      while (end < out.length && /[ \t]/.test(out[end])) end++;
      if (out[end] === '\r') end++;
      if (out[end] === '\n') end++;
    }
    out = out.slice(0, r.start) + out.slice(end);
  }

  if (!dryRun) writeFileSync(file, out, 'utf8');
  return { file, removed: splices.length, dropped, casingCollisions };
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const files = listJsFiles(ROOT);
  let totalRemoved = 0, totalCasing = 0;
  const allCasing = [];
  const reportLines = ['# Duplicate-key removal record', '', 'Earlier-occurrence definitions removed by `scripts/fix-duplicate-keys.js`.', 'These had been silently overridden by a later occurrence of the same key (JS object-literal semantics) so the runtime engine was already using the later value. Removing the earlier definition preserves runtime behavior exactly. Recovery: copy any snippet below back into the source file and rename the key if you intended a separate entry.', ''];
  for (const f of files) {
    const res = processFile(f, dryRun);
    if (res.parseError) {
      console.error(`PARSE ERROR ${f}: ${res.parseError}`);
      process.exitCode = 2;
      continue;
    }
    if (res.removed) {
      const rel = f.split(/[/\\]src[/\\]/).pop();
      console.log(`src/${rel}: removed ${res.removed} earlier duplicate(s)`);
      totalRemoved += res.removed;
      reportLines.push(`## src/${rel.replace(/\\/g, '/')}`);
      for (const d of res.dropped) {
        if (d.kind === 'casing') {
          reportLines.push(`### "${d.key}" — casing collision with "${d.otherKey}" (kept earlier "${d.otherKey}" at L${d.laterLine}; this entry was unreachable via case-insensitive lookup)`);
        } else {
          reportLines.push(`### "${d.key}" (was at L${d.line}, kept later occurrence at L${d.laterLine})`);
        }
        reportLines.push('```js', d.snippet, '```', '');
      }
    }
    allCasing.push(...res.casingCollisions);
    totalCasing += res.casingCollisions.length;
  }
  if (allCasing.length) {
    console.log(`\nCasing collisions (NOT auto-fixed — review manually):`);
    for (const c of allCasing) {
      const rel = c.file.split(/[/\\]src[/\\]/).pop();
      console.log(`  src/${rel}  "${c.otherKey}" L${c.otherLine}  vs  "${c.key}" L${c.line}`);
    }
  }
  if (!dryRun && totalRemoved) {
    const reportPath = new URL('../docs/duplicate-keys-removed.md', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
    writeFileSync(reportPath, reportLines.join('\n'), 'utf8');
    console.log(`\nRecovery record written to docs/duplicate-keys-removed.md`);
  }
  console.log(`\nSummary: removed ${totalRemoved} exact duplicate(s)${dryRun ? ' (DRY RUN)' : ''}, ${totalCasing} casing collision(s) flagged.`);
}

// Only run the CLI when invoked directly, not when imported by a test.
// import.meta.url is realpath-resolved and percent-encoded, so normalize
// argv[1] the same way (mirrors scripts/check-e2e-not-vacuous.mjs).
const invokedDirectly = (() => {
  if (!process.argv[1]) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
  } catch {
    return false;
  }
})();

if (invokedDirectly) main();
