import { readFileSync } from 'node:fs';
import { recordGolden } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/consist/tests/helpers/goldenRecordDoor.js';
const path = 'tests/fixtures/preset-lighting-witness-golden.json';
try {
  recordGolden({ surface: 'preset-lighting-witness', path, produce: () => readFileSync(path, 'utf8') });
  console.log('recordGolden returned without throwing (unexpected)');
} catch (e) { console.log(String(e.message).slice(0, 700)); }
