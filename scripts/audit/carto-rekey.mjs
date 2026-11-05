#!/usr/bin/env node
/**
 * scripts/audit/carto-rekey.mjs — THE CALIBRATION SUITE'S EXACT READINGS, RE-KEYED BY MEASUREMENT OVER A RECORDED CORPUS.
 *
 * WHAT IT IS. When the cartography calibration corpus is re-recorded through the signed door, the suite
 * tests/domain/townCartographyCalibration.test.js pins exact readings OF that corpus: FROZEN.maxInstitutions (exact),
 * FROZEN.maxBuildings (the drawn bound), DUPLICATES.permille (W8's translate reading), W8's derived-ceiling line, and W7's
 * FALSIFIER counts against the SUPERSEDED literals. This re-reads every one of them FROM THE CORPUS by the suite's own
 * definitions and rewrites them in the named tree, adding the dated header row ("Re-keyed by measurement over the
 * recorded corpus") and the W8 ceiling history line. It also prints the per-tier institution maximum and the worst-row
 * bytes, which CARTOGRAPHY_CALIBRATION must equal (W7) — that block is written by hand, never here.
 *
 * It never touches the corpus itself and adds no authority: it runs inside a stage after the door wrote the corpus.
 *
 *   node scripts/audit/carto-rekey.mjs <tree> --label "<LABEL>" --record <rel> --n <stage number> [--note "<sentence>"]
 */
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const tree = args[0];
const flag = (name) => { const i = args.indexOf(name); return i === -1 ? null : args[i + 1]; };
const label = flag('--label');
const record = flag('--record');
const n = flag('--n');
const note = flag('--note');
if (!tree || !label || !record || !n) {
  console.error('usage: carto-rekey.mjs <tree> --label <LABEL> --record <rel> --n <n> [--note <sentence>]');
  process.exit(2);
}
const SUITE = `${tree}/tests/domain/townCartographyCalibration.test.js`;
const TUNING = `${tree}/src/domain/townCartography/cartographyTuning.js`;
const T = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const corpus = JSON.parse(readFileSync(`${tree}/tests/fixtures/cartography-calibration-corpus.json`, 'utf8'));
const rows = Object.entries(corpus.rows ?? corpus).filter(([k]) => !k.startsWith('_'));
let text = readFileSync(SUITE, 'utf8');
const tuning = readFileSync(TUNING, 'utf8');
const headroom = Number(tuning.match(/export const CARTOGRAPHY_HEADROOM_PERMILLE = (\d+);/)[1]);
const ceil = (permille) => Math.ceil((permille * headroom) / 1000);

const maxInst = {};
const maxBuildings = {};
const permille = {};
let worstRowBytes = 0;
for (const tier of T) {
  const tr = rows.filter(([, v]) => v.tier === tier);
  maxInst[tier] = Math.max(...tr.map(([, v]) => v.institutions));
  maxBuildings[tier] = Math.max(...tr.map(([, v]) => v.cartoBuildings));
  const drawnRows = tr.filter(([, v]) => v.cartoBuildings >= 0);
  const drawn = drawnRows.reduce((s, [, v]) => s + v.cartoBuildings, 0);
  const repeated = drawnRows.reduce((s, [, v]) => s + v.cartoDupTranslate, 0);
  permille[tier] = Math.round((1000 * repeated) / drawn);
}
for (const [, v] of rows) worstRowBytes = Math.max(worstRowBytes, v.cartoRowBytes);

// The SUPERSEDED binding literals, read from the suite itself.
const sup = text.match(/bindings: Object\.freeze\(\{\s*thorp: (\d+), hamlet: (\d+), village: (\d+), town: (\d+), city: (\d+), metropolis: (\d+),/);
const superseded = Object.fromEntries(T.map((t, i) => [t, Number(sup[i + 1])]));
const refused = {};
for (const [, v] of rows) if (v.institutions > superseded[v.tier]) refused[v.tier] = (refused[v.tier] ?? 0) + 1;
const refusedTotal = Object.values(refused).reduce((s, c) => s + c, 0);

const slash = (o) => T.map((t) => o[t]).join('/');
const changes = [];

// FROZEN.
const frozenRe = /const FROZEN = Object\.freeze\(\{\n([\s\S]*?)\n\}\);/;
const frozenBody = text.match(frozenRe)[1];
const oldFrozen = {};
for (const tier of T) {
  const m = frozenBody.match(new RegExp(`  ${tier}: Object\\.freeze\\(\\{ throws: 0, maxInstitutions: (\\d+), maxBuildings: (\\d+) \\}\\),`));
  oldFrozen[tier] = { maxInstitutions: Number(m[1]), maxBuildings: Number(m[2]) };
}
const newFrozenBody = T.map((tier) => `  ${tier}: Object.freeze({ throws: 0, maxInstitutions: ${maxInst[tier]}, maxBuildings: ${maxBuildings[tier]} }),`).join('\n');
text = text.replace(frozenRe, `const FROZEN = Object.freeze({\n${newFrozenBody}\n});`);
const oldInst = Object.fromEntries(T.map((t) => [t, oldFrozen[t].maxInstitutions]));
const oldB = Object.fromEntries(T.map((t) => [t, oldFrozen[t].maxBuildings]));
if (slash(oldInst) !== slash(maxInst)) changes.push(`FROZEN.maxInstitutions ${slash(oldInst)} -> ${slash(maxInst)}`);
if (slash(oldB) !== slash(maxBuildings)) changes.push(`FROZEN.maxBuildings ${slash(oldB)} -> ${slash(maxBuildings)}`);

// DUPLICATES and the W8 ceiling line.
const oldPermille = {};
for (const tier of T) {
  const re = new RegExp(`(const DUPLICATES = [\\s\\S]*?  ${tier}: Object\\.freeze\\(\\{ permille: )(\\d+)( \\}\\),)`);
  oldPermille[tier] = Number(text.match(re)[2]);
  text = text.replace(re, `$1${permille[tier]}$3`);
}
const oldCeil = Object.fromEntries(T.map((t) => [t, ceil(oldPermille[t])]));
const newCeil = Object.fromEntries(T.map((t) => [t, ceil(permille[t])]));
if (slash(oldPermille) !== slash(permille)) {
  changes.push(`DUPLICATES.permille ${slash(oldPermille)} -> ${slash(permille)} (derived ceilings ${slash(oldCeil)} -> ${slash(newCeil)})`);
}
const ceilLine = /(\n)( {4}expect\(CARTOGRAPHY_TIERS\.map\(duplicateCeilingPermille\)\)\.toEqual\(\[)([\d, ]+)(\]\);)/;
const curCeil = text.match(ceilLine)[3].split(',').map((s) => Number(s.trim()));
if (curCeil.join('/') !== slash(newCeil)) {
  text = text.replace(ceilLine, `$1    // ${curCeil.join('/')} -> ${slash(newCeil)} on 2026-11-04: ${label.toUpperCase()} (header), the same operator.\n$2${T.map((t) => newCeil[t]).join(', ')}$4`);
}

// W7's FALSIFIER.
const falsRe = /expect\(refused\)\.toEqual\((\{[^}]*\})\);\n(\s*)expect\(Object\.values\(refused\)\.reduce\(\(sum, count\) => sum \+ count, 0\)\)\.toBe\((\d+)\);/;
const fm = text.match(falsRe);
const fmt = (o) => `{ ${T.filter((t) => o[t]).map((t) => `${t}: ${o[t]}`).join(', ')} }`;
if (fm && (fm[1] !== fmt(refused) || Number(fm[3]) !== refusedTotal)) {
  changes.push(`the FALSIFIER ${fm[1].replace(/\s+/g, ' ')} = ${fm[3]} -> ${fmt(refused)} = ${refusedTotal}`);
  text = text.replace(falsRe, `expect(refused).toEqual(${fmt(refused)});\n$2expect(Object.values(refused).reduce((sum, count) => sum + count, 0)).toBe(${refusedTotal});`);
}

// The dated header row.
const calMatch = tuning.match(/MAX_INSTITUTIONS: Object\.freeze\(\{\s*thorp: (\d+), hamlet: (\d+), village: (\d+), town: (\d+), city: (\d+), metropolis: (\d+),/);
const calibration = T.map((_, i) => Number(calMatch[i + 1])).join('/');
const calSentence = calibration === slash(maxInst)
  ? `The per-tier maximum roster reads ${slash(maxInst)}${calibration === slash(oldInst) ? ', so CARTOGRAPHY_CALIBRATION does not move' : `; CARTOGRAPHY_CALIBRATION.MAX_INSTITUTIONS ${slash(oldInst)} -> ${calibration} by hand, the corpus re-captured at it (bytes identical where no cap bit)`}.`
  : `⚠ CARTOGRAPHY_CALIBRATION reads ${calibration} against the corpus's ${slash(maxInst)}: W7 will red until it is written by hand.`;
const wrap = (s, width = 112) => {
  const words = s.split(' ');
  const lines = [];
  let line = ' *  ';
  for (const w of words) {
    if (line.length + w.length + 1 > width) { lines.push(line); line = ' *  '; }
    line += ` ${w}`;
  }
  lines.push(line);
  return lines.join('\n');
};
const row = [
  `2026-11-04 — ${label.toUpperCase()}, THROUGH THE SIGNED DOOR (ODQ §934.105, RUNG 1 OF THE SOAK LADDER; record ${record};`
  + ` the chair signs by the owner's delegation, vetoable). Written from the staged tree S${n} (the step's tree with the door`
  + ` paths carried from the branch). ${calSentence}`,
  changes.length ? `Re-keyed by measurement over the recorded corpus (the suite's own definitions): ${changes.join('; ')}.` : 'No exact reading moves.',
  note ?? '',
  'CORPUS_ROWS stays 504; the throw census stays 0.',
].filter(Boolean).join(' ');
const anchor = '\n *\n * To re-record after an INTENTIONAL change, run:\n *   UPDATE_CARTOGRAPHY_CALIBRATION=1';
if (text.split(anchor).length !== 2) { console.error('refused: the header anchor does not occur exactly once'); process.exit(1); }
text = text.replace(anchor, `\n *\n${wrap(row)}${anchor}`);
writeFileSync(SUITE, text, 'utf8');
console.log(JSON.stringify({ maxInst: slash(maxInst), maxBuildings: slash(maxBuildings), permille: slash(permille), ceilings: slash(newCeil), worstRowBytes, refused, refusedTotal, calibration, changes }, null, 1));
