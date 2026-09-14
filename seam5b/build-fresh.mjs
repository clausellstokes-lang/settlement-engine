import { readFileSync, writeFileSync } from 'node:fs';
import { buildCensus, serialise, CENSUS_JSON } from '../laneSEAM/scripts/wiring-census.mjs';
const rates = JSON.parse(readFileSync(CENSUS_JSON, 'utf8')).rate;
const data = await buildCensus({ rates });
writeFileSync(process.argv[2], serialise(data));
console.log('fresh census written to', process.argv[2], '-', data.rows.length, 'rows');
