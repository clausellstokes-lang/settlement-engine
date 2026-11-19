import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE; const HI = await import(T + '/src/domain/facts/houseInputAtHand.js');
for (const f of process.argv.slice(2)) for (const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')) { const { seed, s } = JSON.parse(l);
  const mill = (s.economicState?.activeChains || []).find((c) => c?.chainId === 'river_milling');
  if (mill && (mill.outputs || []).includes('Fulled cloth') && HI.housesShortOf(s).get('Fuller') === 'wool') console.log(seed, (s.config.stressTypes||[]).join('+'), s.config.tradeRouteAccess, HI.ventureHouseOf(s)?.name || ''); }
