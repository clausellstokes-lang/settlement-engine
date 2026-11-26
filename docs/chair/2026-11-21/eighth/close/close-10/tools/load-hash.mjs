import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const [,, tree, dir] = process.argv;
const { normalizeSettlement } = await import(`${tree}/src/domain/normalizeSettlement.js`);
const out = {};
for (const f of readdirSync(dir).sort()) out[f] = createHash('sha256').update(JSON.stringify(normalizeSettlement(JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'))))).digest('hex');
console.log(JSON.stringify(out));
