// §909 probe — the ARCHIVED B6 receipt (schema 5, no series) must still grade honestly.
// Read-only. Writes nothing into the dock.
import { readFileSync } from 'node:fs';
import { evaluateTripwires, TRIPWIRE_IDS, tripwiresOfClass, tripwireRegistryDefects, tripwireFieldReach, receiptWriterFields, TRIPWIRES } from '../laneB6/scripts/soak/tripwires.mjs';
import { evaluateReceipt } from '../laneB6/scripts/soak/evaluate.mjs';

const path = process.argv[2];
const receipt = JSON.parse(readFileSync(path, 'utf8'));
const writerSource = readFileSync(new URL('../laneB6/scripts/audit/whole-world-soak.mjs', import.meta.url), 'utf8');

const t = evaluateTripwires(receipt);
const e = evaluateReceipt(receipt);
const reach = tripwireFieldReach(TRIPWIRES, writerSource);

console.log(JSON.stringify({
  receiptPath: path,
  schemaVersion: receipt.schemaVersion,
  kind: receipt.kind,
  years: receipt.years,
  settlements: receipt.settlements,
  hasYearlyPopulations: Object.prototype.hasOwnProperty.call(receipt, 'yearlyPopulations'),
  hasYearlyDiedFlags: Object.prototype.hasOwnProperty.call(receipt, 'yearlyDiedFlags'),
  demographicsEnabled: receipt?.subsystems?.rules?.demographicsEnabled,
  ROSTER: { ids: TRIPWIRE_IDS.length, deterministic: tripwiresOfClass('deterministic').length, hostObs: tripwiresOfClass('host-observability').length },
  registryDefects: tripwireRegistryDefects(),
  findings: t.findings,
  observability: t.observability,
  notExecutable: t.notExecutable,
  deterministicFirings: e.deterministicFirings,
  fullInstrument: e.annotated.fullInstrument,
  receiptOwnNotExecutable: (receipt.notExecutable || []).map((r) => r.name),
  annotatedNotExecutable: (e.annotated.notExecutable || []).map((r) => `${r.name} :: ${r.source || 'soak'}`),
  WRITER_KEYS: reach.written.length,
  writerHasSeries: [reach.written.includes('yearlyPopulations'), reach.written.includes('yearlyDiedFlags')],
  unreachableRows: [...new Set(reach.unreachable.map((r) => r.id))],
  unreachablePairs: reach.unreachable.length,
  unreadable: reach.unreadable,
}, null, 2));
