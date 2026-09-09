/**
 * validate-mcp-server.mjs — minimal gate for the standalone mcp-server/ package
 * (Vision V-12 THE TRUTH SERVER), the sibling of validate:map / validate:foundry-
 * module for a NEW top-level dir OUTSIDE the app's tsc/eslint/vite gates.
 *
 * Proves the server is well-formed, dependency-free, and READ-ONLY BY
 * CONSTRUCTION without spawning it:
 *   1. package.json parses, is type:module, declares the bin, and has NO runtime
 *      dependencies and NO publish/registry config or tokens (never-publish law).
 *   2. every .js parses as an ES module.
 *   3. no write path / no network: no fs write API, no fetch/http/https/net.
 *   4. THE TOOL-MANIFEST READ-ONLY PIN: every tool name is a read verb — no
 *      create/update/delete/set/write/add/remove/... tool exists — and each tool
 *      declares an inputSchema.
 *
 * Wired into `npm run check` the way validate:map is. Exit 0 = clean, 1 = failure.
 */
import { readFile, readdir, access } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';

const root = fileURLToPath(new URL('../mcp-server/', import.meta.url));
const failures = [];
const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

async function jsFilesUnder(dir, prefix = '') {
  const out = [];
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      out.push(...(await jsFilesUnder(join(dir, entry.name), rel)));
    } else if (extname(entry.name) === '.js') out.push(rel);
  }
  return out;
}

// ── 1. package.json ───────────────────────────────────────────────────────────
let pkg = null;
if (!(await exists(join(root, 'package.json')))) {
  failures.push('mcp-server/package.json is missing');
} else {
  try { pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')); }
  catch (err) { failures.push(`mcp-server/package.json does not parse: ${err.message}`); }
}
if (pkg) {
  if (pkg.type !== 'module') failures.push('mcp-server/package.json must be "type":"module"');
  if (!pkg.bin || typeof pkg.bin !== 'object') failures.push('mcp-server/package.json must declare a bin');
  else {
    for (const rel of Object.values(pkg.bin)) {
      if (!(await exists(join(root, rel)))) failures.push(`bin target missing on disk: ${rel}`);
    }
  }
  const deps = Object.keys(pkg.dependencies || {});
  if (deps.length) failures.push(`mcp-server must stay dependency-free; found dependencies: ${deps.join(', ')}`);
  if (pkg.publishConfig) failures.push('mcp-server/package.json must not carry publishConfig (publication is owner-only)');
}
// never-publish: no .npmrc with a token
if (await exists(join(root, '.npmrc'))) {
  const npmrc = await readFile(join(root, '.npmrc'), 'utf8');
  if (/_authToken|_password|:_auth/i.test(npmrc)) failures.push('mcp-server/.npmrc carries a registry token — forbidden');
}

// ── 2/3. parse + no write path / no network ──────────────────────────────────
const WRITE_OR_NET = /\b(writeFileSync|writeFile|appendFileSync|appendFile|createWriteStream|rmSync|unlinkSync|fetch\s*\(|https?\.(get|request)|net\.(connect|createConnection))\b/;
const jsFiles = await jsFilesUnder(root);
if (jsFiles.length === 0) failures.push('mcp-server/ ships no .js — the server is missing');
for (const rel of jsFiles) {
  const source = await readFile(join(root, rel), 'utf8');
  try {
    parse(source, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true });
  } catch (err) {
    failures.push(`${rel} does not parse as an ES module: ${err.message}`);
  }
  const codeOnly = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const hit = codeOnly.match(WRITE_OR_NET);
  if (hit) failures.push(`${rel} uses a write/network API (${hit[1] || hit[0]}) — the server is read-only and offline by construction`);
}

// ── 3. README ─────────────────────────────────────────────────────────────────
if (!(await exists(join(root, 'README.md')))) failures.push('mcp-server/README.md is missing');

// ── 4. tool-manifest read-only pin ────────────────────────────────────────────
// The leading verb (first snake_case segment) must be a READ verb — a substring
// scan would false-positive ("set" inside "get_settlement"), so we gate the verb.
const READ_VERBS = new Set(['get', 'list', 'search', 'find', 'read', 'ask', 'query', 'describe', 'lookup', 'fetch', 'show']);
try {
  const { TOOLS, TOOL_NAMES } = await import(join(root, 'src/tools.js'));
  if (!Array.isArray(TOOLS) || TOOLS.length === 0) failures.push('tools.js exports no TOOLS');
  for (const name of (TOOL_NAMES || [])) {
    const verb = String(name).split('_')[0].toLowerCase();
    if (!READ_VERBS.has(verb)) failures.push(`tool "${name}" leads with a non-read verb "${verb}" — the server must be read-only`);
  }
  for (const tool of (TOOLS || [])) {
    if (!tool || typeof tool.name !== 'string') failures.push('a tool is missing its name');
    else if (!tool.inputSchema || typeof tool.inputSchema !== 'object') failures.push(`tool "${tool.name}" is missing an inputSchema`);
  }
} catch (err) {
  failures.push(`could not load mcp-server/src/tools.js: ${err.message}`);
}

if (failures.length) {
  console.error('mcp-server validation FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}
console.log(`mcp-server OK — package.json valid + dependency-free, ${jsFiles.length} module(s) parse, read-only tool manifest, no write/network path.`);
