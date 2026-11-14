import { recs } from './rd.mjs';
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) for (const n of s.npcs||[]) if (/^npc_power_|^npc_veiled/.test(n.id)) console.log(seed, n.id, '|', n.title, '|', n.secret?.what);
