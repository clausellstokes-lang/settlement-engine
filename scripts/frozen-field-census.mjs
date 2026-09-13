#!/usr/bin/env node
/**
 * scripts/frozen-field-census.mjs — FIELD-GRAIN WRITER CENSUS under `src/domain/worldPulse/`
 * (brief ADDENDUM 18 ruling 11: a field with ZERO writers after generation is FROZEN and the
 * perfect and the durative are licensed over it; the marker's card prints this census so the
 * licence is mechanical).
 *
 *   node scripts/frozen-field-census.mjs <field> [<field> ...] [--json] [--verbose]
 *   node scripts/frozen-field-census.mjs --measured        # the sitting's measured set
 *
 * Per field: the assignment / property (shorthand included) write sites (file:line, the shape),
 * the count, and FROZEN / LIVE. Spreads of the field are CARRIES (listed, not counted). A
 * property keyed on the leaf under an ancestry that does not match the field's parents is a
 * ROOT-GRAIN CANDIDATE (listed under --verbose, never counted). Deterministic; read-only.
 */
import { frozenFieldCensus, clockOf, parsePulseTree } from './lib/prose-mark-fields.mjs';

/** The set the sitting measured (brief ADDENDUM 18, ruling 11 and the recon). */
export const MEASURED_FIELDS = Object.freeze([
  'defenseProfile.economicGates.military',
  'defenseProfile.scores.military',
  'defenseProfile.scores.monster',
  'defenseProfile.scores.internal',
  'defenseProfile.scores.economic',
  'defenseProfile.scores.disaster',
  'config.monsterThreat',
  'economicState.safetyProfile.safetyLabel',
  'economicState.safetyProfile.safetyDesc',
  'economicState.safetyProfile.guardEffectivenessDesc',
  'economicState.compound.inst.hasCourtSystem',
  'economicState.compound.inst.hasPrison',
  'economicState.compound.inst.hasGranary',
  'economicState.compound.inst.hasHospital',
  'economicState.compound.inst.hasChurch',
  'defenseProfile.institutions',
  'institutions',
]);

/** @param {ReturnType<typeof frozenFieldCensus>} row @param {boolean} verbose @returns {string[]} */
export function censusLines(row, verbose) {
  const lines = [];
  lines.push(`${row.target.padEnd(52)} writers ${String(row.count).padStart(3)}   ${row.status.padEnd(6)} clock ${clockOf(row.target, row.count)}${row.grain.startsWith('root') ? '   ⚠ ' + row.grain : ''}`);
  for (const w of row.writes) lines.push(`    ${w.file}:${w.line}  [${w.shape}]  ${w.text}`);
  if (row.carries.length) lines.push(`    carries (spread, not a write): ${row.carries.length}${verbose ? '' : ' (--verbose lists them)'}`);
  if (verbose) for (const c of row.carries) lines.push(`      ${c.file}:${c.line}  ${c.text}`);
  if (row.rootGrainCandidates.length) lines.push(`    root-grain candidates (leaf name under a non-matching ancestry; NOT counted): ${row.rootGrainCandidates.length}${verbose ? '' : ' (--verbose lists them)'}`);
  if (verbose) for (const c of row.rootGrainCandidates) lines.push(`      ${c.file}:${c.line}  ${c.ancestry}`);
  if (row.unparsed.length) lines.push(`    UNPARSED (fail-closed, contribute nothing): ${row.unparsed.join(', ')}`);
  return lines;
}

async function main() {
  const argv = process.argv.slice(2);
  const json = argv.includes('--json');
  const verbose = argv.includes('--verbose');
  let fields = argv.filter((a) => !a.startsWith('--'));
  if (argv.includes('--measured')) fields = [...MEASURED_FIELDS];
  if (fields.length === 0) {
    console.error('usage: node scripts/frozen-field-census.mjs <field> [<field> ...] [--json] [--verbose] | --measured');
    process.exit(2);
  }
  const tree = parsePulseTree();
  const rows = fields.map((f) => frozenFieldCensus(f, undefined, tree));
  if (json) { console.log(JSON.stringify(rows, null, 1)); return; }
  console.log(`FROZEN-FIELD CENSUS under src/domain/worldPulse/ (${rows[0].files} files; field grain; a write is an assignment target or an object-literal property under the field's own parent chain)`);
  for (const row of rows) console.log(censusLines(row, verbose).join('\n'));
}

if (process.argv[1] && process.argv[1].endsWith('frozen-field-census.mjs')) await main();
