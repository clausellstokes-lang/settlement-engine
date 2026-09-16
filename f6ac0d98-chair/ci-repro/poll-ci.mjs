const sha = process.argv[2]; const want = ['Gate / test ratchet', 'Validate, test, build'];
const url = `https://api.github.com/repos/clausellstokes-lang/settlement-engine/commits/${sha}/check-runs?per_page=100`;
const t0 = Date.now();
for (let i = 0; i < 5; i++) {
  let runs = [];
  try { const r = await fetch(url, { headers: { 'User-Agent': 'sf-ci-poll' } }); const d = await r.json(); runs = d.check_runs || []; } catch (e) { console.log('poll error', e.message); }
  const byName = new Map(); for (const r of runs) { const cur = byName.get(r.name); if (!cur || r.started_at > cur.started_at) byName.set(r.name, r); }
  const key = want.map((n) => [n, byName.get(n)]);
  const settled = key.every(([, r]) => r && r.conclusion);
  if (settled || i === 4) {
    console.log(`after ${Math.round((Date.now() - t0) / 60000)} min:`);
    for (const r of [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))) console.log(`${(r.conclusion || r.status).padStart(11)}  ${r.name}  ${r.details_url || ''}`);
    process.exit(settled ? 0 : 2);
  }
  await new Promise((r) => setTimeout(r, 90000));
}
