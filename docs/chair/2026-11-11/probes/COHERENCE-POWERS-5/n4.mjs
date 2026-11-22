// n4.mjs <tree> <corpus> — every succession body's first: how dealt (share), its house kind; the keeper's other memberships
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline'; import path from 'node:path';
const [tree, src] = process.argv.slice(2); const R = path.resolve(tree) + '/src';
const { stressPowerRowOf } = await import(R + '/domain/people/stressPowerFaces.js');
const { houseKindOf } = await import(R + '/generators/people/representatives.js');
const { rulingChainOf } = await import(R + '/domain/dossier/powerStrata.js');
const C = {}; const inc = (k) => { C[k] = (C[k] || 0) + 1; };
for await (const l of readline.createInterface({ input: fs.createReadStream(src).pipe(zlib.createGunzip()) })) {
  if (!l) continue; const { seed, s } = JSON.parse(l);
  const gov = (s.powerStructure.factions || []).find((f) => f.isGoverning); const vacant = (gov?.modifiers || []).includes('vacant');
  for (const f of s.powerStructure.factions || []) {
    const row = stressPowerRowOf(s, f); if (!row || row.stress !== 'succession_void') continue;
    const name = f.faction; const first = (s.npcs || []).find((c) => (c.memberships || []).some((m) => m.power === name && m.rank === 1));
    const m = first?.memberships.find((x) => x.power === name);
    const kind = first ? (first.institution?.kind === 'house' ? houseKindOf({ name: first.institution.key }) : 'mint') : 'none';
    inc(`body ${row.claimant ? 'claimant' : 'oldfam'} first=${kind}${m ? ' share' + (m.share > 0 ? '>0' : '=0') : ''}`);
    console.log(seed, '|', name, '|', first ? `${first.name}, ${first.title} [${kind}] share ${m.share} other: ${first.memberships.filter((x) => x.power !== name).map((x) => x.power + '#' + x.rank).join(',')}` : '(no one)', '| vacant', vacant, '|', (rulingChainOf(s).absence?.line || '').slice(0, 120));
  }
}
console.log(C);
