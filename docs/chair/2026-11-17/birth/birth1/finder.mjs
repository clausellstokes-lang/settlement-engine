// houses short with a `missing` gap at the tip, and the towns that bear them (calm/siege/isolated), and line printed
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = '/home/user/wt-tip';
const F = await import(T + '/src/domain/facts/houseInputAtHand.js');
const { resourceGapLines } = await import(T + '/src/domain/display/validationOnPage.js');
const want = process.argv.slice(3);
const out = {};
for (const l of zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n')) { const { seed, s } = JSON.parse(l);
  const short = F.housesShortOf(s); const lines = resourceGapLines(s).map((x) => x.impact);
  for (const h of want) { if (!short.has(h)) continue; const kinds = s.resourceAnalysis.gaps.filter((g) => g.institution === h).map((g) => g.kind);
    const st = (s.config.stressTypes || []).join('+') || 'calm'; (out[h] ||= []).push(`${seed} [${st}/${s.config.tradeRouteAccess}] gaps=${kinds.join(',')} line=${lines.some((x) => x.toLowerCase().includes(h.toLowerCase().replace(/\s*\(.*\)/, '')))}`); } }
for (const [h, v] of Object.entries(out)) { console.log('==', h, v.length); console.log(v.slice(0, 8).join('\n')); }
