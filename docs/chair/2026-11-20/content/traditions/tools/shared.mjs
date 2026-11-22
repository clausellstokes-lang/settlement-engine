// CTR5 on the pool: the shared page as it stands (toPublicSafe default; genesis on the served doc, which lacks _seed),
// the reader-audience description of each printed rite, and a LEAK CHECK: every house, person and power the
// description names must stand in the served document. Also reader-audience on the OWNER's unprojected record
// (the owner's own page in player view): its names must stand in the served document too (the leaf's own fail-closed filters).
import { readFileSync, writeFileSync } from 'node:fs';
import { deriveFoundingTraditions } from '../../../../../../src/domain/traditions/genesis.js';
import { toPublicSafe } from '../../../../../../src/domain/display/publicSafe.js';
import { projectShareVeil, writeShareVeil } from '../../../../../../src/domain/display/galleryVeil.js';
import { describeTradition } from './describe.mjs';
const [, , poolFile, outFile] = process.argv;
const towns = readFileSync(poolFile, 'utf8').trim().split('\n').map(JSON.parse);
let n = 0, leaks = 0, nOwnerPV = 0, leaksPV = 0, setSame = 0, keeperDropped = 0, personDropped = 0;
const leakRows = [];
const namedIn = (facts) => facts.flatMap((f) => { const m = f.match(/^(house|person|power \([^)]*\)|owner \([^)]*\)): (.*)$/); if (!m) return []; return [m[2].replace(/ \(.*\)$/, '')]; });
for (const t of towns) {
  // the party link's served document: the projection, then the DEFAULT veil (lib/gallery.js :: sanitizeDossier, partyLink)
  const served = projectShareVeil(toPublicSafe(t), writeShareVeil(null, []));
  const blob = JSON.stringify(served);
  const own = deriveFoundingTraditions(t); const pub = deriveFoundingTraditions(served);
  if (own.map((r) => r.name).join('|') === pub.map((r) => r.name).join('|')) setSame++;
  for (const rec of pub) {
    const d = describeTradition(rec, served, { audience: 'reader' }); if (!d) continue; n++;
    for (const name of namedIn(d.facts)) if (!blob.includes(JSON.stringify(name).slice(1, -1))) { leaks++; leakRows.push(`${t.name}: ${name}`); }
  }
  for (const rec of own) {
    const dO = describeTradition(rec, t, { audience: 'owner' }); const dR = describeTradition(rec, t, { audience: 'reader' }); const dS = describeTradition(rec, served, { audience: 'reader' });
    if (!dR) continue; nOwnerPV++;
    for (const name of namedIn(dR.facts)) if (!blob.includes(JSON.stringify(name).slice(1, -1))) { leaksPV++; leakRows.push(`(player view) ${t.name}: ${name}`); }
    if (dO.parts.keeper && !dS.parts.keeper) keeperDropped++;
    if (dO.facts.some((f) => f.startsWith('person:')) && !dS.facts.some((f) => f.startsWith('person:'))) personDropped++;
  }
}
const out = [`# CTR5 on the pool (432 towns); served = projectShareVeil(toPublicSafe(record), default veil), the party link's own composition`,
  `owner set == shared-page set: ${setSame} of ${towns.length} towns (the seed posture strips _seed; genesis falls back to id)`,
  `shared page as it stands: ${n} descriptions composed for the reader from the served document; names not in the served document: ${leaks}`,
  `owner's page in player view (reader audience over the unprojected record): ${nOwnerPV} descriptions; names not in the served document: ${leaksPV}`,
  `the owner's rites composed from the served document: keeper clause dropped ${keeperDropped}, person dropped ${personDropped} (of ${nOwnerPV})`,
  ...leakRows.slice(0, 30)];
writeFileSync(outFile, `${out.join('\n')}\n`); console.log(out.join('\n'));
