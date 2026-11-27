// node analyze-B.mjs <out-prefix> <C.jsonl> <V.jsonl> : writes <prefix>.tsv and prints the totals (markdown) to stdout.
import { readFileSync, writeFileSync } from 'node:fs';
const [PREFIX, ...FILES] = process.argv.slice(2);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = [];
for (const f of FILES) {
  const corpus = /-C\.jsonl$/.test(f) ? 'C' : 'V';
  for (const l of readFileSync(f, 'utf8').split('\n').filter(Boolean)) rows.push({ corpus, ...JSON.parse(l) });
}
const errs = rows.filter((r) => r.error);
const failsOf = (d, side) => d.needs.filter((a) => d[side][a] !== true);
const tsv = [['corpus', 'seed', 'size', 'band', 'drawn', 'shownOwner', 'droppedOwner', 'droppedOwnerByNeed', 'shortOfBandOwner', 'shownShare', 'droppedShare', 'droppedShareByNeed', 'shortOfBandShare'].join('\t')];
const out = [];
const P = (s) => out.push(s);
const tally = () => ({ towns: 0, anyDrop: 0, short: 0, shortBy: {}, none: 0, rows: 0, dropRows: 0, byNeed: {} });
const T = { owner: {}, share: {} };
for (const c of ['C', 'V', 'ALL']) for (const side of ['owner', 'share']) { T[side][c] = {}; for (const s of [...SIZES, 'ALL']) T[side][c][s] = tally(); }
const rites = { owner: new Map(), share: new Map() };
for (const r of rows.filter((x) => !x.error)) {
  const lo = r.band[0];
  const drawnN = r.drawn.length;
  const res = {};
  for (const side of ['owner', 'share']) {
    const flag = side === 'owner' ? 'shown' : 'shared';
    const atomSide = side === 'owner' ? 'owner' : 'floor';
    const dropped = r.drawn.filter((d) => !d[flag]);
    const byNeed = {};
    for (const d of dropped) {
      const f = failsOf(d, atomSide);
      const k = f.length ? f.join('+') : '(no need failed: other)';
      byNeed[k] = (byNeed[k] || 0) + 1;
      const rk = `${d.el}|${d.act}`;
      const m = rites[side].get(rk) || { el: d.el, act: d.act, needs: new Set(), n: 0, names: new Set() };
      m.n++; f.forEach((a) => m.needs.add(a)); m.names.add(d.name); rites[side].set(rk, m);
    }
    const shownN = side === 'owner' ? r.shownN : r.sharedN;
    const short = Math.max(0, lo - shownN);
    res[side] = { dropped: dropped.length, byNeed, shownN, short };
    for (const c of [r.corpus, 'ALL']) for (const s of [r.size, 'ALL']) {
      const t = T[side][c][s];
      t.towns++; t.rows += drawnN; t.dropRows += dropped.length;
      if (dropped.length) t.anyDrop++;
      if (short) { t.short++; t.shortBy[short] = (t.shortBy[short] || 0) + 1; }
      if (shownN === 0) t.none++;
      for (const [k, v] of Object.entries(byNeed)) t.byNeed[k] = (t.byNeed[k] || 0) + v;
    }
  }
  const fmt = (o) => Object.entries(o).map(([k, v]) => `${k}:${v}`).join(',') || '-';
  tsv.push([r.corpus, r.seed, r.size, `${r.band[0]}-${r.band[1]}`, drawnN, res.owner.shownN, res.owner.dropped, fmt(res.owner.byNeed), res.owner.short, res.share.shownN, res.share.dropped, fmt(res.share.byNeed), res.share.short].join('\t'));
}
writeFileSync(`${PREFIX}.tsv`, `${tsv.join('\n')}\n`);
P(`births read: ${rows.length}, errors: ${errs.length}${errs.length ? ' (' + errs.map((e) => e.seed).join(', ') + ')' : ''}`);
for (const side of ['owner', 'share']) {
  P(`\n### ${side === 'owner' ? "THE OWNER'S TAB (shownTraditionsOf)" : "THE SHARED PAGE (sharedTraditionRowsOf, admitted over the floor)"}\n`);
  P('| corpus | size | towns | rows drawn | rows dropped | towns with a drop | towns SHORT of the band (shown < band min) | short by 1 / 2 / 3+ | towns showing NONE |');
  P('|---|---|---|---|---|---|---|---|---|');
  for (const c of ['C', 'V', 'ALL']) for (const s of [...SIZES, 'ALL']) {
    const t = T[side][c][s]; if (!t.towns) continue;
    const b3 = Object.entries(t.shortBy).filter(([k]) => Number(k) >= 3).reduce((a, [, v]) => a + v, 0);
    P(`| ${c} | ${s} | ${t.towns} | ${t.rows} | ${t.dropRows} | ${t.anyDrop} | ${t.short} | ${t.shortBy[1] || 0} / ${t.shortBy[2] || 0} / ${b3} | ${t.none} |`);
  }
  P('\nRows dropped BY NEED (the atom(s) the place does not hold; a row failing two counts under both joined by +):\n');
  P('| corpus | ' + SIZES.join(' | ') + ' | ALL |'); P('|---|' + SIZES.map(() => '---').join('|') + '|---|');
  const needs = [...new Set(['C', 'V'].flatMap((c) => Object.keys(T[side][c].ALL.byNeed)))].sort();
  for (const nd of needs) for (const c of ['C', 'V', 'ALL']) P(`| ${c} ${nd} | ${SIZES.map((s) => T[side][c][s].byNeed[nd] || 0).join(' | ')} | ${T[side][c].ALL.byNeed[nd] || 0} |`);
  P('\nThe rites most often dropped (C+V), the twenty first:\n');
  P('| # | element | act | need failed | rows | e.g. name |'); P('|---|---|---|---|---|---|');
  [...rites[side].values()].sort((a, b) => b.n - a.n || `${a.el}${a.act}`.localeCompare(`${b.el}${b.act}`)).slice(0, 20)
    .forEach((m, i) => P(`| ${i + 1} | ${m.el} | ${m.act} | ${[...m.needs].join(', ') || '(none)'} | ${m.n} | ${[...m.names][0]} |`));
}
console.log(out.join('\n'));
