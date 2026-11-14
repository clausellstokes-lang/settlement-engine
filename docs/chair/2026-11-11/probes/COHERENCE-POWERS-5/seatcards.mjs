// seatcards.mjs <tree> <corpus.ndjson.gz | dir-of-*.ndjson.gz> [tag] — N1, N2, N3, N4 over a born corpus, read with the tree's own
// seat home (powerStrata.js :: rulingChainOf, the Power tab's seat row). Records only; prints counts and examples.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline'; import path from 'node:path';
const [tree, src, tag = ''] = process.argv.slice(2);
const R = path.resolve(tree) + '/src';
const { rulingChainOf } = await import(R + '/domain/dossier/powerStrata.js');
const { seatPoolFor } = await import(R + '/generators/people/poolMap.js');
const SK = await import(R + '/domain/people/seatKeeper.js').catch(() => null);
const isSeatVacant = (s) => { const g = (s.powerStructure?.factions || []).find((x) => x.isGoverning); return !!g && (g.modifiers || []).includes('vacant'); };
const seatKeeperOf = SK ? SK.seatKeeperOf : (s) => { if (!isSeatVacant(s)) return null; const g = (s.powerStructure.factions || []).find((x) => x.isGoverning); const n = g.faction || g.name; return (s.npcs || []).find((c) => (c.memberships || []).some((m) => m.power === n && m.rank === 1)) || null; };
const SUB = /^(Heads an old family while the seat's offices|Heads an old family while the seat fails|Serves the faith under its leaders|Belongs to a lesser|Runs a smaller house|Leads a squad|Works spells under|Holds an office (under|that hangs on|among|that runs|whose purse|that is blamed)|Holds a place)/;
const REVSUB = /^(Heads an old family while the seat's offices|Serves the faith under its leaders|Belongs to a lesser|Runs a smaller house|Leads a squad|Works spells under|Holds an office (under|that hangs on|among))/;
const band = (r) => { r = String(r || '').toLowerCase(); if (['mayor','lord','governor','bishop','archmage','guild_master','captain','commander','crime lord'].some((k) => r.includes(k))) return 'high'; if (['council_member','priest','wealthy_merchant','wizard','knight','magister','sergeant'].some((k) => r.includes(k))) return 'moderate'; return 'low'; };
const ORD = { low: 0, moderate: 1, high: 2 };
const files = fs.statSync(src).isDirectory() ? fs.readdirSync(src).filter((f) => f.endsWith('.ndjson.gz')).sort().map((f) => path.join(src, f)) : [src];
const C = {}; const inc = (k, n = 1) => { C[k] = (C[k] || 0) + n; }; const ex = {}; const note = (k, v) => { (ex[k] ||= []).length < 6 && ex[k].push(v); };
let births = 0;
for (const f of files) for await (const line of readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()), crlfDelay: Infinity })) {
  if (!line) continue; const row = JSON.parse(line); const s = row.s || row.rec; const seed = row.seed || row.key; births++;
  const tier = s.tier; const big = ['village', 'town', 'city', 'metropolis'].includes(tier);
  const gov = (s.powerStructure?.factions || []).find((x) => x.isGoverning); const govName = gov?.faction || gov?.name;
  const npcs = s.npcs || [];
  const first = npcs.find((c) => (c.memberships || []).some((m) => m.power === govName && m.rank === 1));
  const chain = rulingChainOf(s); const holderName = chain.npc?.name || null;
  const holder = holderName ? npcs.find((c) => c.name === holderName) : null;
  if (first) { inc('govFirst'); if (REVSUB.test(first.structuralPosition || '')) { inc('N1.govFirst.reviewSubordinate'); note('N1.govFirst.reviewSubordinate', `${seed}: ${first.name}: ${first.structuralPosition}`); } if (/^Holds the seat/.test(first.structuralPosition || '')) inc('N1.govFirst.holdsTheSeat'); if (big) { inc(`N2.govFirst.big`); inc(`N2.govFirst.big.${first.influence}`); inc(`N2.govFirst.${tier}.${first.influence}`); } }
  if (holder) {
    inc('holder'); const p = holder.structuralPosition || '';
    if (/^Holds the seat/.test(p)) inc('N1.holder.holdsTheSeat'); else { inc('N1.holder.notHolds'); note('N1.holder.notHolds', `${seed}: ${holder.name} [${holder.role}]: ${p || '(no position)'}`); }
    if (SUB.test(p) || REVSUB.test(p)) { inc('N1.holder.subordinate'); note('N1.holder.subordinate', `${seed}: ${holder.name}: ${p}`); }
    const office = band(seatPoolFor(tier).role);
    if (ORD[holder.influence] < ORD[office]) { inc('N2.holder.belowOffice'); note('N2.holder.belowOffice', `${seed}: ${holder.name} ${holder.influence}/${holder.power} office ${office}`); }
    if (big && holder.influence === 'low') inc('N2.holder.big.low');
    const top = Math.max(...npcs.map((c) => Number(c.power) || 0)); if ((Number(holder.power) || 0) >= top) inc('N2.holder.highestPower');
  } else inc(isSeatVacant(s) ? 'holder.none.vacant' : 'holder.none.other');
  let nonHolderHolds = 0;
  for (const c of npcs) if (c !== holder && /^Holds the seat/.test(c.structuralPosition || '')) { nonHolderHolds++; const p1 = (c.memberships || []).find((m) => m.rank === 1)?.power || '-'; inc(`N3.byPower.${p1.replace(/ /g,'_')}`); note('N3', `${seed}: ${c.name} (${p1}): ${c.structuralPosition}`); }
  if (nonHolderHolds) { inc('N3.births'); inc('N3.cards', nonHolderHolds); }
  // N4: the claimant bodies (a succession's noble party, the royal claimants) and the keeper
  const keeper = seatKeeperOf(s);
  for (const fct of s.powerStructure?.factions || []) {
    const name = fct.faction || fct.name;
    if (!/Highborn Circle|Peerage|Landed Bloc|Claimant/.test(name)) continue;
    if (!/succession/.test(JSON.stringify(s.stress || s.stressors || []).slice(0, 4000)) && !isSeatVacant(s)) continue;
    inc('N4.bodies'); const f1 = npcs.find((c) => (c.memberships || []).some((m) => m.power === name && m.rank === 1));
    const t = f1 ? `${f1.title}|${f1.institution?.kind}:${f1.institution?.key}` : '(no one)'; inc(`N4.first.${f1 ? (f1.institution?.kind === 'power' ? 'mint' : 'house') : 'none'}`); note('N4.firsts', `${seed}: ${name}: ${t}`);
    if (keeper && (keeper.memberships || []).some((m) => m.power === name)) { inc('N4.keeperInClaimant'); note('N4.keeperInClaimant', `${seed}: ${keeper.name} in ${name}`); }
  }
  if (keeper) inc('N4.vacancies');
}
console.log(`== ${tag} births ${births}`);
for (const k of Object.keys(C).sort()) console.log(k, C[k]);
for (const k of Object.keys(ex)) { console.log('--', k); ex[k].forEach((v) => console.log('   ', v.slice(0, 220))); }
