// toll.mjs <birthsdir>: every NPC goal naming a toll house (the crossroads chain's processing houses), against the roster
// and the speaker's own house; also the toll chain's presence and the town's access
import fs from 'node:fs'; import zlib from 'node:zlib';
const dir = process.argv[2];
const HOUSES = ['toll bridge', "caravaneer's post", 'coaching inn', 'customs house'];
const tally = {}; const rows = [];
let towns = 0, tollTowns = 0;
for (const file of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz')).sort()) {
  for (const line of zlib.gunzipSync(fs.readFileSync(dir + '/' + file)).toString().split('\n')) {
    if (!line) continue; const { key, s } = JSON.parse(line); towns++;
    const access = s.config?.tradeRouteAccess;
    const toll = (s.economicState?.activeChains || []).find((c) => c.chainId === 'crossroads_trade');
    if (toll) tollTowns++;
    const roster = (s.institutions || []).map((i) => String(i.name || '').toLowerCase());
    for (const n of s.npcs || []) {
      for (const which of ['short', 'long']) {
        const g = n.goal?.[which]; if (!g) continue;
        for (const h of HOUSES) {
          if (!g.toLowerCase().includes('the ' + h)) continue;
          const onRoster = roster.some((r) => r.startsWith(h));
          const own = String(n.house || n.institution || n.workplace || '').toLowerCase();
          const k = `${h} | access=${access} | toll=${!!toll} | onRoster=${onRoster}`;
          tally[k] = (tally[k] || 0) + 1;
          if (!onRoster || !toll) rows.push([key, access, !!toll, n.name, own, which, g]);
        }
      }
    }
  }
}
console.log('towns', towns, 'tollTowns', tollTowns);
for (const [k, v] of Object.entries(tally).sort()) console.log(v, k);
console.log('--- off roster or no toll (first 30) ---', rows.length);
for (const r of rows.slice(0, 30)) console.log(JSON.stringify(r));
