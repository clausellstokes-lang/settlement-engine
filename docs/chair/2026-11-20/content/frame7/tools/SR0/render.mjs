// SR0 render: where a stake reason prints. Births a slice of the crisis pool (seed b7-<kind>-<size>-0) and counts,
// per audience, the Crisis page's stake rows by printed reason key, and the hooks that carry a stake reason.
// usage: node render.mjs <worktree/> <sizes,comma> <out.txt>
import fs from 'node:fs';
const [R, SZ, OUT] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(R + 'src/generators/generateSettlementPipeline.js');
const C = await import(R + 'src/domain/crisis/crisisCast.js');
const { composeCrisisPage } = await import(R + 'src/domain/crisis/crisisPage.js');
const { stakeLines } = await import(R + 'src/pdf/lib/crisisPrint.js');
const { collectPlotHooks } = await import(R + 'src/domain/dossier/plotHooks.js');
const { composeTonightSheet } = await import(R + 'src/domain/summary/tonightSheet.js');
const KEY = Object.fromEntries(Object.entries(C.STAKE_REASONS).map(([k, v]) => [v, k]));
const KINDS = Object.keys(C.CRISIS_NATURE);
const out = []; const P = (...a) => out.push(a.join(' '));
const cnt = {}; const inc = (k) => (cnt[k] = (cnt[k] || 0) + 1);
const ex = {};
for (const z of SZ.split(',')) for (const kind of KINDS) {
  const seed = `b7-${kind}-${z}-0`;
  const s = generateSettlementPipeline({ settType: z, stressType: kind }, null, { seed, customContent: {} });
  const stored = (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean).flatMap((e) => e.cast?.stakes || []);
  stored.forEach((k) => inc(`stored:${KEY[k.reason]}`));
  for (const aud of ['owner', 'player', 'gallery']) {
    const page = composeCrisisPage(s, { audience: aud });
    for (const sec of page) for (const r of stakeLines(sec.stakes).rows) {
      const key = KEY[r.reason] || `shown:${r.stake}`;
      inc(`page-${aud}:${key}`);
      if (aud === 'owner' && !ex[`tab:${key}`]) ex[`tab:${key}`] = `${seed} :: ${r.subject} ${r.verb} · ${r.reason}`;
    }
  }
  const hooks = collectPlotHooks(s);
  for (const h of hooks) { const t = typeof h === 'string' ? h : (h.text || ''); if (/ most, because /.test(t)) { inc('plothook:because'); const k = Object.keys(KEY).find((r) => t.includes(r.replace(/^its /, '')) ); if (!ex.hook) ex.hook = `${seed} :: ${t}`; } }
  for (const aud of ['owner', 'player']) {
    const sheet = composeTonightSheet(s, { audience: aud });
    const hs = [...(sheet.hooks || []), ...((sheet.frame && sheet.frame.hooks) || [])];
    for (const h of hs) { const t = typeof h === 'string' ? h : (h.text || JSON.stringify(h)); if (/ most, because /.test(t)) { inc(`tonight-${aud}:because`); if (!ex[`tonight-${aud}`]) ex[`tonight-${aud}`] = `${seed} :: ${t}`; } }
  }
}
for (const [k, v] of Object.entries(cnt).sort()) P(`COUNT ${k} ${v}`);
for (const [k, v] of Object.entries(ex)) P(`EX ${k} :: ${v.slice(0, 300)}`);
fs.writeFileSync(OUT, out.join('\n') + '\n');
console.log('done', Object.keys(cnt).length);
