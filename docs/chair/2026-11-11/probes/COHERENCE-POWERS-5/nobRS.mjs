import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline'; import path from 'node:path';
const { stressPowerRowOf } = await import(path.resolve(process.argv[2]) + '/src/domain/people/stressPowerFaces.js');
const C = {};
for (const f of process.argv.slice(3)) for await (const l of readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()) })) { if (!l) continue; const { key, rec: s } = JSON.parse(l);
  for (const fct of s.powerStructure.factions) { const row = stressPowerRowOf(s, fct); if (!row || row.stress !== 'succession_void') continue;
    const first = s.npcs.find((c) => (c.memberships || []).some((m) => m.power === fct.faction && m.rank === 1));
    const k = `${row.claimant ? (/claimant/i.test(fct.faction) ? 'royal claimant' : 'body(claimant)') : 'body'} first=${first ? (first.institution?.kind === 'house' ? 'house:' + first.title : first.title) : 'none'}`; C[k] = (C[k] || 0) + 1; } }
console.log(C);
