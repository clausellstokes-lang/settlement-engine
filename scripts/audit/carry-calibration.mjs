#!/usr/bin/env node
/**
 * scripts/audit/carry-calibration.mjs — CARRY THE BRANCH'S `CARTOGRAPHY_CALIBRATION` BLOCK INTO A STAGE.
 *
 * `CARTOGRAPHY_CALIBRATION` (src/domain/townCartography/cartographyTuning.js) is re-read off the cartography
 * calibration corpus BY HAND with every corpus re-record (W7 pins it to the corpus, exactly), so on the landing
 * branch it is effectively a door path: the records wrote it. The file itself is NOT carried (lanes edit its other
 * blocks inside the window — X-46 car 1b U4's POPULATION_SPAN, for one), so only the frozen block moves: the
 * stage's block is replaced by the branch's, byte for byte, and nothing else in the file changes.
 *
 *   node scripts/audit/carry-calibration.mjs <branch-tree> <stage-tree>
 */
import { readFileSync, writeFileSync } from 'node:fs';
const REL = 'src/domain/townCartography/cartographyTuning.js';
const BLOCK = /export const CARTOGRAPHY_CALIBRATION = Object\.freeze\(\{[\s\S]*?\n\}\);\n/;
const [from, to] = process.argv.slice(2);
const src = readFileSync(`${from}/${REL}`, 'utf8').match(BLOCK);
const dst = readFileSync(`${to}/${REL}`, 'utf8');
if (!src || !BLOCK.test(dst)) { console.error('refused: the CARTOGRAPHY_CALIBRATION block is not found exactly once'); process.exit(1); }
const next = dst.replace(BLOCK, src[0]);
writeFileSync(`${to}/${REL}`, next, 'utf8');
console.log(JSON.stringify({ carried: REL, changed: next !== dst }));
