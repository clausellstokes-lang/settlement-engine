// D-BD-r5 probe (B.3): the raid matrix — every might band x every tier — on the rows defence-ledger.mjs generated.
// bodyStrength at full readiness and cohesion = the band's latent midpoint (armyStrength.js floors, BD §2.5).
import { readFileSync } from 'node:fs';
const rows = JSON.parse(readFileSync(new URL('./defence-ledger.rows.json', import.meta.url)));
const mids = { thin: 13, modest: 34, capable: 51, strong: 69, formidable: 89 };
const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
for (const [dimLabel, dimOf] of [['gang/conclave: military', r => r.military], ['beast: monster', r => r.monster]]) {
  for (const margin of [0, 0.2]) {
    console.log(`\n== ${dimLabel}, RAID_MARGIN ${margin} — share of generated settlements raidable (bodyStrength > read x (1+margin))`);
    console.log('band'.padEnd(11) + tiers.map(t => t.padStart(11)).join(''));
    for (const [band, s] of Object.entries(mids)) {
      console.log(band.padEnd(11) + tiers.map(t => { const r = rows.filter(x => x.tier === t); const n = r.filter(x => s > dimOf(x) * (1 + margin)).length; return `${n}/${r.length}`.padStart(11); }).join(''));
    }
  }
}
// collapse: the walls term removed (military -30, monster -20 per defenseGenerator.js) — a breached/ruined wall
console.log('\n== collapse arm: a WALLED town/city with its walls ruined (military - 30 x terrain mult approx; monster - 20), margin 0.2');
for (const t of ['town', 'city', 'metropolis']) {
  const r = rows.filter(x => x.tier === t && x.walls);
  for (const [band, s] of Object.entries(mids)) {
    const nm = r.filter(x => s > Math.max(0, x.military - 30) * 1.2).length, nb = r.filter(x => s > Math.max(0, x.monster - 20) * 1.2).length;
    if (nm || nb) console.log(t.padEnd(11), band.padEnd(11), 'military-arm', `${nm}/${r.length}`, 'beast-arm', `${nb}/${r.length}`);
  }
}
