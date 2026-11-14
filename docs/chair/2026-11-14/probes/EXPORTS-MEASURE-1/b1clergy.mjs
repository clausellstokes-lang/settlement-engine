// node b1clergy.mjs <corpus> <tree>: towns printing the clergy line, by tier and by the roster's sacred names (what made hasChurch true)
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T] = process.argv.slice(2);
const f = (await import(T + '/src/domain/display/defenseDisplay.js')).deriveDefenseReadiness;
const byTier = {}, byNames = {};
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l);
  if (!f(s).some((r) => r.assess.includes('Clergy provide'))) continue; byTier[s.tier] = (byTier[s.tier] || 0) + 1;
  const k = (s.institutions || []).map((i) => i.name).filter((n) => /church|cathedral|temple|monaster|friary|shrine|priest|abbey|chapel/i.test(n)).sort().join(' + ') || '(none)';
  byNames[k] = (byNames[k] || 0) + 1; }
console.log(JSON.stringify(byTier)); for (const [k, n] of Object.entries(byNames).sort((a, b) => b[1] - a[1]).slice(0, 14)) console.log(n, k);
