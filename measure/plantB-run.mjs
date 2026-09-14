// The RE-INDEXED plant's corpus: 8 configurations x 60 SEEDS, so a two-variant pool gets 60
// INDEPENDENT draws (one seed is one draw per pool, however many towns carry it).
import { writeFileSync } from 'node:fs';
import { driftRun, goldenCorpus } from '../laneMEASURE/tests/helpers/dossierManifest.js';
import { varietyConfigs } from '../laneMEASURE/tests/helpers/proseVarietyCorpus.js';
const configs = varietyConfigs({ seeds: 60, configs: goldenCorpus().slice(0, 8) });
const run = await driftRun({ configs });
writeFileSync(process.argv[2], `${JSON.stringify({ cells: run.cells }, null, 1)}\n`);
console.log(`plant corpus: ${configs.length} towns x 2 audiences = ${run.cells.length} cells in ${run.seconds} s`);
