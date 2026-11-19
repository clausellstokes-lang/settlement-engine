// the hand-kept ledger follows each declared architectural detail of this seat's item D (formatting byte-preserved)
import fs from 'node:fs';
const p = 'docs/census/declarations/CULTURE_ARCHITECTURAL_DETAILS.json'; const j = JSON.parse(fs.readFileSync(p, 'utf8'));
const { CULTURE_PROFILES } = await import(process.cwd() + '/src/data/cultureProfiles.js');
const MINE = new Set(process.argv.slice(2));
let n = 0;
for (const pool of j.pools) for (const line of pool.lines) {
  const m = line.lineId.match(/^CULTURE_PROFILES\.(\w+)\.architecturalDetails\[(\d+)\]$/); if (!m) continue;
  const row = CULTURE_PROFILES[m[1]].architecturalDetails[+m[2]];
  if (typeof row !== 'object' || !MINE.has(row.text)) continue;
  line.needs = [...row.needs]; line.colour = false; n++;
}
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n'); console.log('ledger lines followed', n);
