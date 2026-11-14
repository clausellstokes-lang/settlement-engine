// rec.mjs <births.gz> : per town the food record facts, tsv
import fs from 'node:fs'; import zlib from 'node:zlib';
const [file] = process.argv.slice(2);
for (const l of zlib.gunzipSync(fs.readFileSync(file)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  const fs_ = s.economicState?.foodSecurity || {}; const r = fs_.foodRecord || {};
  const st = (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).join('+')||'calm';
  console.log([seed, s.tier, s.population, st, fs_.label, r.band, r.gapPct, r.normalImportPct, r.storageMonths, r.hasGranary, r.storesHeld, fs_.deficitPct, fs_.surplusPct, s.config?.tradeRouteAccess||s.economicState?.tradeRouteAccess].join('\t'));
}
