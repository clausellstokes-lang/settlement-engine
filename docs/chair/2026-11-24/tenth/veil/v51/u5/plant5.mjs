// VEIL-51 UNIT 5 step (1): THE PLANTS, one a path, a DATA plant on a copy of the master-born set (no instrument edited):
//   node plant5.mjs <stored-master dir> <out dir>
// Seed r3m-town-none-0-23: the Thieves' Guild is withheld on its Reveal-DM reads (wd's natural secondaryAffiliation positive) and
// it is in NONE of the other paths' place lists, so a planted path reads as that place newly in the path's list. Each planted
// string names "Thieves' Guild" and carries the word PLANT. The two secondaryAffiliation paths are natural positives there already:
// their plants are written too but cannot show in read counts (said so in the receipts).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const [, , IN, OUT] = process.argv; const SEED = 'r3m-town-none-0-23'; const TG = "Thieves' Guild";
mkdirSync(OUT, { recursive: true }); const log = [];
for (const f of readdirSync(IN).filter((x) => x.endsWith('.json'))) {
  const d = JSON.parse(readFileSync(`${IN}/${f}`, 'utf8'));
  if (f === `${SEED}.json`) {
    const r = d.relationships; const n = d.npcs; const mem = (d.factions || []).flatMap((x) => x.members || []);
    if (r.length < 2 || n.length < 2 || mem.length < 3) throw new Error('the seed lacks the structures');
    r[0].npc1Role = `${TG} Enforcer PLANT`; log.push('relationships[0].npc1Role');
    r[1].npc2Role = `${TG} Lookout PLANT`; log.push('relationships[1].npc2Role');
    n[0].role = `${TG} Runner PLANT`; log.push('npcs[0].role');
    n[1].secondaryAffiliation = `${TG} PLANT`; log.push('npcs[1].secondaryAffiliation');
    mem[0].secondaryAffiliation = `${TG} PLANT`; log.push('factions[].members[0].secondaryAffiliation');
    mem[1].role = `${TG} Fixer PLANT`; log.push('factions[].members[1].role');
    mem[2].goal = { ...(mem[2].goal || {}), short: `Keep the ${TG} paid PLANT` }; log.push('factions[].members[2].goal.short');
  }
  writeFileSync(`${OUT}/${f}`, JSON.stringify(d));
}
writeFileSync(`${OUT}/PLANT.txt`, `${SEED}\n${log.join('\n')}\n`); console.log(log.length, 'paths planted in', SEED);
if (log.length !== 7) process.exit(2);
