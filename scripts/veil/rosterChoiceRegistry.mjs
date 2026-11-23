#!/usr/bin/env node
// scripts/veil/rosterChoiceRegistry.mjs — THE ROSTER-CHOICE REGISTRY'S EXPORT (ruling VR7; SUB-BRIEF-VR7 design point 3).
//
// Writes the reader's gate input FROM THE MODULE, never by hand (the gate: REVIEW-VEIL-9's differ-gate.mjs, on
// origin/lane/review-veil-9-2026-11-19 :: docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9/differ-gate.mjs):
//   registry.json  [{ path, rule, by }]      the BUILT rows whose rule is withhold or recompose (`by` = the writer)
//   rulings.json   { diffuse: [], rng: [] }  the BUILT rows ruled diffuse (VR8) or rng-only (VR13)
// An unbuilt row is left out, so the gate still reds on its path until a stage builds its rule.
//
//   node scripts/veil/rosterChoiceRegistry.mjs            write the two files under docs/chair/2026-11-19/veil/registry/
//   node scripts/veil/rosterChoiceRegistry.mjs --check    exit 1 when the committed files differ from what the module writes
//   node scripts/veil/rosterChoiceRegistry.mjs --all <dir>
//                                                         EVERY row, built or not, into <dir> (a scratch folder OUTSIDE
//                                                         this tree: the coverage proof, never committed; refused inside)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGISTRY_ROWS, registryExport } from '../../src/domain/veil/rosterChoiceRegistry.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const REGISTRY_DIR = join(ROOT, 'docs', 'chair', '2026-11-19', 'veil', 'registry');

/** The two files' text, exactly as written (two-space JSON, one trailing newline). */
export function exportTexts({ all = false } = {}) {
  const { registry, rulings } = registryExport(REGISTRY_ROWS, { all });
  return {
    'registry.json': `${JSON.stringify(registry, null, 2)}\n`,
    'rulings.json': `${JSON.stringify(rulings, null, 2)}\n`,
  };
}

/** The names of the committed files that differ from what the module would write (empty: in step). */
export function driftedFiles(dir = REGISTRY_DIR) {
  const want = exportTexts();
  return Object.keys(want).filter((name) => {
    let have = null;
    try { have = readFileSync(join(dir, name), 'utf8'); } catch { /* a missing file has drifted */ }
    return have !== want[name];
  });
}

function writeAll(dir, texts) {
  mkdirSync(dir, { recursive: true });
  for (const [name, text] of Object.entries(texts)) writeFileSync(join(dir, name), text);
}

function main(argv) {
  if (argv[0] === '--check') {
    const drifted = driftedFiles();
    if (drifted.length) {
      console.error(`roster-choice registry: ${drifted.join(', ')} differ from the module; run node scripts/veil/rosterChoiceRegistry.mjs`);
      return 1;
    }
    console.log('roster-choice registry: registry.json and rulings.json are the module\'s');
    return 0;
  }
  if (argv[0] === '--all') {
    const out = argv[1] ? resolve(argv[1]) : '';
    const rel = out ? relative(ROOT, out) : '';
    if (!out || (!rel.startsWith('..') && !isAbsolute(rel))) {
      console.error('roster-choice registry: --all needs a folder OUTSIDE this tree (the every-row export is a proof, never committed)');
      return 2;
    }
    writeAll(out, exportTexts({ all: true }));
    console.log(`roster-choice registry: every row (${REGISTRY_ROWS.length}) written to ${out}`);
    return 0;
  }
  if (argv.length) {
    console.error(`roster-choice registry: unknown argument ${argv[0]}`);
    return 2;
  }
  writeAll(REGISTRY_DIR, exportTexts());
  console.log(`roster-choice registry: written to ${relative(ROOT, REGISTRY_DIR)}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
