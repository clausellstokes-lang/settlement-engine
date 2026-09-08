import { writeFileSync, readFileSync } from 'node:fs';
import { buildCensus, serialise, CENSUS_JSON } from '../laneSEAM/scripts/wiring-census.mjs';
const committed = JSON.parse(readFileSync(CENSUS_JSON, 'utf8'));
const data = await buildCensus({ rates: committed.rate });
const text = serialise(data);
writeFileSync(process.argv[2], text);
const c = readFileSync(CENSUS_JSON, 'utf8');
console.log(`committed ${c.length}   fresh ${text.length}   equal ${c === text}`);
