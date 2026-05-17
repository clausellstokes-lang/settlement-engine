#!/usr/bin/env node
/**
 * find-duplicate-keys — Scan src/data/*.js for duplicate object keys
 * (case-sensitive AND case-insensitive collisions). Emits a per-file
 * report and exits non-zero if any are found.
 *
 * Why this and not just esbuild's --log-level=warning: esbuild only
 * emits the first duplicate per literal once; we want every collision
 * surfaced including casing collisions that JS evaluates as distinct
 * keys but a human-readable matcher would treat as the same.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'acorn';
import { simple as walk } from 'acorn-walk';

const ROOT = new URL('../src/data/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

function listJsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...listJsFiles(p));
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

function scanFile(file) {
  const src = readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
  } catch (e) {
    return { file, parseError: e.message, collisions: [] };
  }
  const collisions = [];
  walk(ast, {
    ObjectExpression(node) {
      const seen = new Map();    // exact key → line
      const lcSeen = new Map();  // lowered key → { exact, line }
      for (const prop of node.properties) {
        if (prop.type !== 'Property') continue;
        const k = keyName(prop);
        if (k == null) continue;
        const line = prop.loc.start.line;
        if (seen.has(k)) {
          collisions.push({ kind: 'exact', key: k, first: seen.get(k), dup: line });
        } else {
          seen.set(k, line);
        }
        const lc = k.toLowerCase();
        if (lcSeen.has(lc) && lcSeen.get(lc).exact !== k) {
          collisions.push({
            kind: 'casing',
            key: k, otherKey: lcSeen.get(lc).exact,
            first: lcSeen.get(lc).line, dup: line,
          });
        } else if (!lcSeen.has(lc)) {
          lcSeen.set(lc, { exact: k, line });
        }
      }
    },
  });
  return { file, collisions };
}

function main() {
  const files = listJsFiles(ROOT);
  let totalExact = 0, totalCasing = 0;
  for (const f of files) {
    const { collisions, parseError } = scanFile(f);
    if (parseError) {
      console.error(`PARSE ERROR ${f}: ${parseError}`);
      process.exitCode = 2;
      continue;
    }
    if (!collisions.length) continue;
    const rel = f.split(/[/\\]src[/\\]/).pop();
    console.log(`\nsrc/${rel}`);
    for (const c of collisions) {
      if (c.kind === 'exact') {
        console.log(`  EXACT     "${c.key}"  first @ L${c.first}, dup @ L${c.dup}`);
        totalExact++;
      } else {
        console.log(`  CASING    "${c.key}" vs "${c.otherKey}"  L${c.first} / L${c.dup}`);
        totalCasing++;
      }
    }
  }
  console.log(`\nSummary: ${totalExact} exact duplicate(s), ${totalCasing} casing collision(s)`);
  if (totalExact + totalCasing > 0) process.exitCode = 1;
}

main();
