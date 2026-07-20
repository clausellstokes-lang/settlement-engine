/**
 * validate-foundry-module.mjs — minimal gate for the standalone foundry-module/
 * package (Vision V-11 THE FOUNDRY BRIDGE), the sibling of validate:map for a NEW
 * top-level dir that sits OUTSIDE the app's tsc/eslint/vite gates.
 *
 * It proves the module is well-formed and safe without a Foundry runtime:
 *   1. module.json parses and carries the required manifest fields.
 *   2. every declared esmodule (and every .js under scripts/) exists and PARSES.
 *   3. README.md exists.
 *   4. no importer file uses eval / new Function — the static-content discipline
 *      (settlement data is rendered, never executed).
 *
 * Wired into `npm run check` the way validate:map is. Exit 0 = clean, 1 = failure.
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';

const root = fileURLToPath(new URL('../foundry-module/', import.meta.url));
const failures = [];

const exists = async (p) => {
  try { await access(p); return true; } catch { return false; }
};

async function jsFilesUnder(dir, prefix = '') {
  const out = [];
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await jsFilesUnder(join(dir, entry.name), rel)));
    else if (extname(entry.name) === '.js') out.push(rel);
  }
  return out;
}

// ── 1. module.json ──────────────────────────────────────────────────────────
let manifest = null;
const manifestPath = join(root, 'module.json');
if (!(await exists(manifestPath))) {
  failures.push('foundry-module/module.json is missing');
} else {
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (err) {
    failures.push(`foundry-module/module.json does not parse: ${err.message}`);
  }
}
if (manifest) {
  for (const field of ['id', 'title', 'version', 'esmodules']) {
    if (manifest[field] == null) failures.push(`module.json is missing required field "${field}"`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(String(manifest.version || ''))) {
    failures.push(`module.json version "${manifest.version}" is not semver`);
  }
  const compat = manifest.compatibility || {};
  if (compat.minimum == null || compat.verified == null) {
    failures.push('module.json compatibility must declare { minimum, verified }');
  }
  if (!Array.isArray(manifest.esmodules) || manifest.esmodules.length === 0) {
    failures.push('module.json must declare at least one esmodule');
  } else {
    for (const rel of manifest.esmodules) {
      if (!(await exists(join(root, rel)))) failures.push(`declared esmodule is missing on disk: ${rel}`);
    }
  }
}

// ── 2. every .js parses as an ES module ──────────────────────────────────────
const jsFiles = await jsFilesUnder(root);
if (jsFiles.length === 0) failures.push('foundry-module/ ships no .js — the importer is missing');
for (const rel of jsFiles) {
  const source = await readFile(join(root, rel), 'utf8');
  try {
    parse(source, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true });
  } catch (err) {
    failures.push(`${rel} does not parse as an ES module: ${err.message}`);
  }
  // ── 4. no content-into-code ────────────────────────────────────────────────
  const codeOnly = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/\beval\s*\(/.test(codeOnly) || /\bnew\s+Function\s*\(/.test(codeOnly)) {
    failures.push(`${rel} uses eval / new Function — the importer must render content, never execute it`);
  }
}

// ── 3. README ─────────────────────────────────────────────────────────────────
if (!(await exists(join(root, 'README.md')))) failures.push('foundry-module/README.md is missing');

if (failures.length) {
  console.error('foundry-module validation FAILED:\n  ' + failures.join('\n  '));
  process.exit(1);
}
console.log(`foundry-module OK — module.json valid, ${jsFiles.length} script(s) parse, README present.`);
