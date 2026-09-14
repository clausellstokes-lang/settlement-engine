import { writeFileSync } from 'node:fs';
const DOCK = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEF2';
const { driftRun } = await import(DOCK + '/tests/helpers/dossierManifest.js');
const run = await driftRun({});
writeFileSync(process.argv[2], JSON.stringify({ cells: run.cells }));
console.log('cells', run.cells.length, 'towns', run.towns, 'seconds', run.seconds);
