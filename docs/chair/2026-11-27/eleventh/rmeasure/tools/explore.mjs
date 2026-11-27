import { createReadStream } from 'node:fs'; import readline from 'node:readline';
const f = process.argv[2]; const rl = readline.createInterface({ input: createReadStream(f), crlfDelay: Infinity });
const names = new Map(); let n = 0;
for await (const l of rl) { if (!l) continue; const j = JSON.parse(l); n++;
  for (const r of j.town?.relationships || []) for (const k of ['npc1Name', 'npc2Name']) { const v = r[k]; if (!v || !/\s/.test(v) || /^[A-Z][a-z]+$/.test(v)) names.set(v, (names.get(v) || 0) + 1); }
  for (const p of j.town?.npcs || []) if (!/\s/.test(p.name || '')) names.set('NPC:' + p.name, (names.get('NPC:' + p.name) || 0) + 1);
}
console.log(n, [...names].slice(0, 40));
