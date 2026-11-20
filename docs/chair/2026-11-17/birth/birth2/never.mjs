import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R = process.env.TREE + '/src';
const HI = await import(R + '/domain/facts/houseInputAtHand.js'); const SS = await import(R + '/domain/facts/supplyStory.js');
const { liveInstitutions } = await import(R + '/domain/institutions/institutionRoster.js');
const { hasTradeRouteConnection } = await import(R + '/domain/tradeRouteSemantics.js');
const HK = await import(R + '/domain/facts/houseKinds.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const by = {}; const ex = {};
for await (const line of rl) { if (!line) continue; const { seed, s } = JSON.parse(line);
  const short = HI.housesShortOf(s); const spent = HI.housesOnSpentGround(s); const v = HI.ventureHouseOf(s);
  const route = hasTradeRouteConnection(String(s.config?.tradeRouteAccess)) ? ((s.config?.stressTypes||[]).includes('under_siege') ? 'siege' : 'road') : 'no road';
  for (const inst of liveInstitutions(s)) { if (!short.has(inst.name) || spent.has(inst.name) || v?.name === inst.name) continue;
    const id = SS.idOfHouse(inst); const f = HK.MATERIAL_OF[id]; if (!f || SS.usedGroundOf(s, f)) continue;
    const k = `${id} · ${route} · ${short.get(inst.name)}`; by[k] = (by[k] || 0) + 1; (ex[k] ||= []).push(seed); } }
for (const [k, n] of Object.entries(by).sort((a, b) => b[1] - a[1])) console.log(n, k, ex[k].slice(0, 3).join(', '));
