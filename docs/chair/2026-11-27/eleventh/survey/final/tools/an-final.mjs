// node an-final.mjs <out dir> : (B) per home: refused on the final record; printed on owner / share / PDF vm / Tonight; what the door prints instead
import { readFileSync, existsSync } from 'node:fs';
const D = process.argv[2];
const homeOf = (r) => {
  const t = String(r.text);
  if (r.pool === 'safetyProfile:SAFETY_LINE_SIBLINGS') return `safety purse :: ${t.slice(0, 60)}`;
  if (r.pool.startsWith('institutionDescVariants:')) return `institution desc :: ${r.refused.join(',')} :: ${r.pool.replace(/^institutionDescVariants:\w+\|\w+\|/, '')}`;
  if (r.pool.startsWith('historyData:HISTORICAL_EVENTS_DATA.plotHooks')) return 'history event hook (guild_conflict) :: guild';
  return `${r.pool} :: ${r.refused.join(',')}`;
};
const H = {};
const pages = { owner: new Set(), share: new Set() };
for (const P of ['C', 'V']) {
  const f = `${D}/render-${P}.jsonl`; if (!existsSync(f)) continue;
  for (const l of readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse)) {
    if (l.error) { console.log('ERROR', P, l.seed, l.error.slice(0, 200)); continue; }
    if (l.skipped) continue;
    const seen = new Set();
    for (const r of l.refused) {
      const k = homeOf(r); const id = `${P}:${l.seed}`;
      if (seen.has(k + r.text)) continue; seen.add(k + r.text);
      const h = (H[k] ||= { refused: 0, owner: 0, share: 0, pdf: 0, tonight: 0, instead: {}, ex: [], views: {} });
      h.refused++;
      if (r.owner?.length) { h.owner++; pages.owner.add(id); for (const v of r.owner) h.views[v] = (h.views[v] || 0) + 1; }
      if (r.share?.length) { h.share++; pages.share.add(id); }
      if (r.pdf) h.pdf++; if (r.tonight) h.tonight++;
      const inst = r.onFinal ? (r.onFinal.shown === null ? 'nothing' : r.onFinal.shown === String(r.text).trim() ? '(itself)' : `"${r.onFinal.shown.slice(0, 130)}"`) : '(a pool: next admitted by the door)';
      h.instead[inst] = (h.instead[inst] || 0) + 1;
      if (h.ex.length < 2 && r.owner?.length) h.ex.push(`${id} (rung ${l.rung}) "${String(r.text).slice(0, 70)}" -> ${inst}`);
    }
  }
}
for (const [k, h] of Object.entries(H).sort((a, b) => b[1].refused - a[1].refused)) {
  console.log(`${h.refused}\t${h.owner}\t${h.share}\t${h.pdf}\t${h.tonight}\t${k}`);
  console.log(`\t\tviews: ${JSON.stringify(h.views)}`);
  for (const [i, c] of Object.entries(h.instead)) console.log(`\t\tinstead ${c}: ${i}`);
  for (const e of h.ex) console.log(`\t\tex ${e}`);
}
console.log('pages printing a refused stored line: owner', pages.owner.size, 'share', pages.share.size);
