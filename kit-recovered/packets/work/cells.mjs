import { writeFileSync } from 'node:fs';
const DOCK = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneRW-DEF2';
const { driftRun } = await import(DOCK + '/tests/helpers/dossierManifest.js');
const run = await driftRun({});
writeFileSync(process.argv[2], JSON.stringify({ cells: run.cells }));
console.log('cells', run.cells.length, 'towns', run.towns, 'seconds', run.seconds);
