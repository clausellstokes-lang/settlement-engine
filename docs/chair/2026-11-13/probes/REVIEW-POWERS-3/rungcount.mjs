// record-level: each rung's text at one tree, by label, and the criminal mid line under a government with no council
import fs from 'node:fs'; import zlib from 'node:zlib';
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
const C = {}; const inc = (k) => (C[k] = (C[k] || 0) + 1);
const COUNCIL = /council|assembly|senate|parliament|moot|thing|diet|consortium|bloc|league|compact/i;
const CLASS = /(Major church institutions hold structural influence|Militarised noble families|structurally embedded in governance|Standing army with genuine political weight|The ruling class and the merchant class are the same people|Dominant commercial class|direct temporal power|holds substantial temporal power|substantial political leverage|genuine political weight; their services|Underworld effectively controls|Criminal organisations have captured significant|structural influence the (elected council|seat) cannot easily override|are structurally embedded in governance here)/;
for (const { s } of rows) { const F = s.powerStructure.factions; const gov = F.find((f) => f.isGoverning);
  for (const f of F) { const d = f.desc || '';
    if (d.startsWith('Organised criminal network controls the black market')) inc(`crim-mid ${COUNCIL.test(gov?.faction || '') ? 'council gov' : 'NO council gov'}`);
    if (d.startsWith('Merchants with local reach')) inc(`merch-rung ${f.powerLabel}`);
    if (/Minor|Suppressed/.test(f.powerLabel) && CLASS.test(d)) { inc('claim-class beside Minor/Suppressed'); inc('  ' + d.match(CLASS)[0].slice(0, 50)); } } }
console.log(JSON.stringify(C, null, 1));
