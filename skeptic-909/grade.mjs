import { readFileSync } from 'node:fs';
import { evaluateTripwires } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/scripts/soak/tripwires.mjs';
for (const p of process.argv.slice(2)) {
  let r; try { r = JSON.parse(readFileSync(p, 'utf8')); } catch (e) { console.log(p, 'UNREADABLE', e.message); continue; }
  const out = evaluateTripwires(r);
  const lit = r?.subsystems?.rules?.demographicsEnabled;
  console.log([
    p.split('/').slice(-2).join('/'),
    'schema=' + r.schemaVersion,
    'lit=' + lit,
    'full=' + out.fullInstrument,
    'notExec=[' + out.notExecutable.map((e) => e.id).join(',') + ']',
    'fire=[' + out.findings.map((e) => e.id).join(',') + ']',
  ].join(' | '));
}
