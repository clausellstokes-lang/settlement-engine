#!/usr/bin/env node
/**
 * certify-subsystems.mjs — print the per-subsystem certification table for one
 * whole-world soak receipt.
 *
 * The soak proves the world behaves; this proves each SUBSYSTEM inside it is
 * actually running. Reading only, and it writes nothing: receipts under
 * artifacts/ are evidence, and evidence is never edited by the tool that reads it.
 *
 *   npm run certify:subsystems -- artifacts/soak/release.cases/<case>.json
 *   npm run certify:subsystems -- <receipt> --json
 *
 * A SILENT row means the switch was on and every instrumented channel read zero.
 * An UNOBSERVED row means this receipt's schema cannot answer the question; v4
 * receipts predate the subsystems section, so their sidecar-ledger channels
 * always read UNOBSERVED. Neither is a pass.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  evaluateSubsystemCertification,
} from '../../src/domain/certification/subsystemCertification.js';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const receiptPath = args.find((arg) => !arg.startsWith('--'));

if (!receiptPath) {
  console.error('usage: node scripts/audit/certify-subsystems.mjs <receipt.json> [--json]');
  process.exit(2);
}

const file = resolve(String(receiptPath));
let receipt = null;
try {
  receipt = JSON.parse(readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`could not read receipt ${file}: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}

const evaluation = evaluateSubsystemCertification(receipt);

if (asJson) {
  console.log(JSON.stringify(evaluation, null, 2));
} else {
  const meta = evaluation.receipt;
  console.log(`# subsystem certification — ${meta.caseId || file}`);
  console.log(
    `  ${meta.years} years x ${meta.settlements} settlements · receipt envelope v${meta.schemaVersion}`
    + ` · observation v${meta.behavioralSchemaVersion} · ${meta.observedYears} observed years`,
  );
  console.log(
    `  configuration: ${evaluation.configSource}`
    + `${evaluation.configComplete ? '' : ' (incomplete — some switches unknown)'}`
    + `${meta.presetId ? ` · preset ${meta.presetId}` : ''}\n`,
  );

  const pad = (value, width) => String(value).padEnd(width);
  console.log(`  ${pad('RULE', 30)}${pad('VERDICT', 19)}${pad('TEMPO', 12)}EVIDENCE`);
  for (const row of evaluation.rows) {
    const evidence = [
      `events ${row.evidence.eventTypes.total}`,
      `movers ${row.evidence.moverFamilies.total}`,
      `state ${row.evidence.stateKeys.total}`,
      `years ${row.tempo.yearsWithEvidence}/${row.tempo.observedYears}`,
    ].join(' · ');
    const tempo = `${row.expectedTempo}${row.verdict === 'ALIVE' && !row.tempo.meetsExpectedTempo ? '!' : ''}`;
    console.log(`  ${pad(row.rule, 30)}${pad(row.verdict, 19)}${pad(tempo, 12)}${evidence}`);
    if (row.unobservedChannels.length) {
      console.log(`  ${' '.repeat(30)}uninstrumented channels: ${row.unobservedChannels.join(', ')}`);
    }
    if (row.corroboratingOnlyEvidence) {
      console.log(`  ${' '.repeat(30)}only a SHARED mover family moved; that cannot prove this row`);
    }
    if (row.partiallySilent) {
      console.log(`  ${' '.repeat(30)}alive on ${row.firedChannels.join(', ')} but SILENT on ${row.silentChannels.join(', ')}`);
    }
  }

  const counts = evaluation.counts;
  console.log(
    `\n  ALIVE ${counts.ALIVE} · SILENT ${counts.SILENT}`
    + ` · DORMANT_BY_CONFIG ${counts.DORMANT_BY_CONFIG} · UNOBSERVED ${counts.UNOBSERVED}`,
  );
  if (evaluation.silent.length) console.log(`  SILENT: ${evaluation.silent.join(', ')}`);
  if (evaluation.unobserved.length) console.log(`  UNOBSERVED: ${evaluation.unobserved.join(', ')}`);
  if (evaluation.slowing.length) console.log(`  ALIVE but below expected tempo: ${evaluation.slowing.join(', ')}`);
  if (evaluation.partiallySilent.length) {
    console.log(`  ALIVE with a silent lane: ${evaluation.partiallySilent.join(', ')}`);
  }
  console.log(
    `\n  registry coverage: ${SUBSYSTEM_CERTIFICATION_REGISTRY.length} rows,`
    + ` ${SUBSYSTEM_CERTIFICATION_PENDING_KEYS.length} rule keys still awaiting one`
    + ` (${evaluation.coverage.ok ? 'partition intact' : 'PARTITION BROKEN'}).`,
  );
  console.log(`\n  ${evaluation.claimBoundary}`);
}

// Exit status reports READABILITY, not engine health: a SILENT row is a finding
// for a person to act on, and making it a non-zero exit would turn an honest
// diagnosis into a broken pipeline.
process.exit(0);
