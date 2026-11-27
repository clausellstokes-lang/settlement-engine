// node poolof.mjs "<fragment>" ... : the DS code, pool key and vid of each generated state-prose line holding it
const files = ['economy', 'defense', 'power', 'general', 'history', 'crisis', 'food', 'npc', 'faith', 'hooks', 'magic', 'outlook', 'settlement'];
const T = '/home/user/wt/rmeasure/src/data/dossierStateProse/';
import { readdirSync } from 'node:fs';
const mods = [];
for (const f of readdirSync(T)) if (f.endsWith('.generated.js')) { try { mods.push([f, await import(T + f)]); } catch (e) { /* */ } }
for (const frag of process.argv.slice(2)) {
  for (const [f, m] of mods) for (const [ek, ev] of Object.entries(m)) {
    const corpus = ev && typeof ev === 'object' ? ev : null; if (!corpus) continue;
    for (const [code, entry] of Object.entries(corpus)) {
      const pools = entry?.pools; if (!pools) continue;
      for (const [pk, lines] of Object.entries(pools)) for (const l of (Array.isArray(lines) ? lines : Object.values(lines).flat())) if (l && typeof l.text === 'string' && l.text.includes(frag)) console.log(`${frag} => ${f} :: ${ek}['${code}'].pools['${pk}'] vid ${l.vid}`);
    }
  }
}
