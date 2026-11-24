import fs from 'node:fs';
for (const f of ['READ-24/records.jsonl', 'READ-24/records-visitor.jsonl']) {
  const t = {}; let wealthy = 0;
  for (const l of fs.readFileSync(f, 'utf8').trim().split('\n')) {
    const r = JSON.parse(l); const fs_ = r.foodSecurity || {};
    const raw = fs_.label; const shown = (raw === 'Secure' || raw === 'Surplus') && Math.round(fs_.deficitPct) > 0 ? 'Pressured(shown)' : raw;
    const k = `${r.foodBand} | stored ${raw} | shown ${shown}`; t[k] = (t[k] || 0) + 1;
  }
  console.log('==', f); for (const [k, v] of Object.entries(t).sort()) console.log(String(v).padStart(4), k);
}
