#!/usr/bin/env node
/**
 * scripts/audit/herald-stage.mjs — THE HERALD KNOWLEDGE-DESK GOLDEN'S BYTES AT ANY TREE, WITHOUT THE DOOR.
 *
 * A measuring tool, never a writer: it builds the projections exactly as
 * tests/property/heraldKnowledgeDeskGolden.test.js's capture arm does (HERALD_DESK_GOLDEN_ROWS,
 * heraldDeskProjection, heraldDeskManifest, the same four dependencies), importing every module FROM THE NAMED
 * TREE, and writes the bytes to a SCRATCH path. The manifest's row count is not fixed (it is the items the desk
 * files), so a shift record's predictedRows for this surface must be measured at the stage before the write —
 * this is that measurement. The golden itself moves only through the suite's capture arm and the signed door.
 *
 *   node scripts/audit/herald-stage.mjs <tree> --out <scratch.json>
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const tree = args[0];
const outAt = args.indexOf('--out');
const out = outAt === -1 ? null : args[outAt + 1];
if (!tree || !out) { console.error('usage: herald-stage.mjs <tree> --out <scratch.json>'); process.exit(2); }
if (/tests[\\/]/.test(resolve(out))) { console.error('refused: --out must be a scratch path'); process.exit(2); }
const root = resolve(tree);
const load = (rel) => import(pathToFileURL(`${root}/${rel}`).href);

const { buildHeraldFeed } = await load('src/components/map/heraldFeed.js');
const { advanceReaderCampaign, composeReaderRegion, READER_CORPUS_ROSTER } = await load('scripts/review/readerCorpus.mjs');
const { HERALD_DESK_GOLDEN_ROWS, heraldDeskManifest, heraldDeskProjection } = await load('tests/helpers/heraldDeskGolden.js');
const DEPS = Object.freeze({ READER_CORPUS_ROSTER, composeReaderRegion, advanceReaderCampaign, buildHeraldFeed });

const projections = [];
for (const row of HERALD_DESK_GOLDEN_ROWS) projections.push(await heraldDeskProjection(DEPS, row));
const bytes = heraldDeskManifest(projections);
writeFileSync(out, bytes, 'utf8');
console.log(JSON.stringify({ tree: root, rows: Object.keys(JSON.parse(bytes)).length }));
