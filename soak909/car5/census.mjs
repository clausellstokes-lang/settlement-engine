// CAR-5 grade census — the critic's $SC/skeptic-909/grade.mjs, widened to print every
// channel this car can move (findings · observability · notExecutable) plus the two
// figures the freeze door reads. Run over the 33 receipt documents on disk.
import { readFileSync } from 'node:fs';
import { evaluateTripwires } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/scripts/soak/tripwires.mjs';
const SC = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/';
for (const p of process.argv.slice(2)) {
  let r; try { r = JSON.parse(readFileSync(p, 'utf8')); } catch (e) { console.log(p, 'UNREADABLE', e.message); continue; }
  const out = evaluateTripwires(r);
  console.log([
    p.replace(SC, ''),
    'schema=' + r.schemaVersion,
    'lit=' + r?.subsystems?.rules?.demographicsEnabled,
    'firings=' + out.findings.length,
    'fire=[' + out.findings.map((e) => e.id).join(',') + ']',
    'notExec=[' + out.notExecutable.map((e) => e.id).join(',') + ']',
    'obs=[' + out.observability.map((e) => `${e.id}${e.inconclusive ? '!' : ''}`).join(',') + ']',
  ].join(' | '));
}
