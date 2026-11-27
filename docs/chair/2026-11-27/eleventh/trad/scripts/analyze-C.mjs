// node analyze-C.mjs <base-C> <base-V> <cand-C> <cand-V> <moved.tsv> : base vs candidate, per town; prints markdown.
import { readFileSync, writeFileSync } from 'node:fs';
const [bC, bV, cC, cV, MOVED] = process.argv.slice(2);
const load = (f) => new Map(readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [r.seed, r]; }));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const out = []; const P = (s) => out.push(s);
const tsv = [['corpus', 'seed', 'size', 'band', 'drawnBase', 'drawnCand', 'shownBase', 'shownCand', 'sharedBase', 'sharedCand', 'rowsMoved', 'keptRowsMoved', 'keptDescMoved', 'recordMoved', 'publicProseKeysMoved', 'residueCand'].join('\t')];
const T = {}; const tal = () => ({ towns: 0, shortB: 0, shortC: 0, noneB: 0, noneC: 0, moved: 0, rowsMoved: 0, keptMoved: 0, descMoved: 0, rec: 0, residue: 0, residueTowns: 0, shareShortC: 0 });
const ppMoved = {}; const residueBy = {}; const residueEx = []; const keptEx = []; let errs = 0;
const sig = (d) => `${d.el}|${d.act}|${d.name}`;
for (const [corpus, fb, fc] of [['C', bC, cC], ['V', bV, cV]]) {
  const B = load(fb); const C = load(fc);
  for (const [seed, b] of B) {
    const c = C.get(seed); if (!c || c.error || b.error) { errs++; continue; }
    const lo = b.band[0];
    const rowsMoved = b.drawn.filter((d, i) => !c.drawn[i] || sig(d) !== sig(c.drawn[i])).length + Math.max(0, c.drawn.length - b.drawn.length);
    // a KEPT row: shown on the base; moved if the candidate's row at its index differs, or it is no longer shown
    const kept = b.drawn.map((d, i) => [d, c.drawn[i]]).filter(([d]) => d.shown);
    const keptMoved = kept.filter(([d, e]) => !e || sig(d) !== sig(e) || !e.shown).length;
    const bDesc = new Map(b.ownerRows.map((r) => [r.id + r.name, r.desc])); 
    const descMoved = c.ownerRows.filter((r) => bDesc.has(r.id + r.name) && bDesc.get(r.id + r.name) !== r.desc).length;
    const recMoved = b.recordHash !== c.recordHash;
    const keys = [...new Set([...Object.keys(b.ppKeys), ...Object.keys(c.ppKeys)])].filter((k) => b.ppKeys[k] !== c.ppKeys[k]);
    keys.forEach((k) => { ppMoved[k] = (ppMoved[k] || 0) + 1; });
    const residue = c.drawn.filter((d) => !d.shown);
    residue.forEach((d) => { const k = `${b.size} ${d.el}|${d.act} needs ${d.needs.filter((a) => d.owner[a] !== true).join('+')}`; residueBy[k] = (residueBy[k] || 0) + 1; if (residueEx.length < 12) residueEx.push(`${corpus} ${seed}: ${d.name} (${d.el}|${d.act})`); });
    if (keptMoved && keptEx.length < 12) keptEx.push(`${corpus} ${seed}: ${kept.filter(([d, e]) => !e || sig(d) !== sig(e)).map(([d, e]) => `${d.name} -> ${e ? e.name : '(none)'}`).join('; ')}`);
    for (const k of [`${corpus} ${b.size}`, `${corpus} ALL`, `ALL ${b.size}`, 'ALL ALL']) {
      const t = (T[k] ||= tal());
      t.towns++; if (b.shownN < lo) t.shortB++; if (c.shownN < lo) t.shortC++; if (b.shownN === 0) t.noneB++; if (c.shownN === 0) t.noneC++;
      if (rowsMoved) t.moved++; t.rowsMoved += rowsMoved; t.keptMoved += keptMoved; t.descMoved += descMoved; if (recMoved) t.rec++;
      t.residue += residue.length; if (residue.length) t.residueTowns++; if (c.sharedN < lo) t.shareShortC++;
    }
    tsv.push([corpus, seed, b.size, `${b.band[0]}-${b.band[1]}`, b.drawn.length, c.drawn.length, b.shownN, c.shownN, b.sharedN, c.sharedN, rowsMoved, keptMoved, descMoved, recMoved ? 1 : 0, keys.join(',') || '-', residue.length].join('\t'));
  }
}
writeFileSync(MOVED, `${tsv.join('\n')}\n`);
P(`towns compared: ${tsv.length - 1}; missing or errored: ${errs}\n`);
P('| corpus | size | towns | short of band BEFORE | AFTER | showing none BEFORE | AFTER | share short AFTER | towns whose drawn set moves | rows moved | KEPT rows moved | kept rows whose owner description moves | records moved | residue rows (drawn, not shown) | residue towns |');
P('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const c of ['C', 'V', 'ALL']) for (const s of [...SIZES, 'ALL']) { const t = T[`${c} ${s}`]; if (!t) continue;
  P(`| ${c} | ${s} | ${t.towns} | ${t.shortB} | ${t.shortC} | ${t.noneB} | ${t.noneC} | ${t.shareShortC} | ${t.moved} | ${t.rowsMoved} | ${t.keptMoved} | ${t.descMoved} | ${t.rec} | ${t.residue} | ${t.residueTowns} |`); }
P('\nPublic-prose sites (the stamped shared page, composePublicProse) whose text moves, towns per site:\n');
P(Object.entries(ppMoved).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- \`${k}\`: ${v}`).join('\n') || '- none');
P('\nResidue by size and motif:\n'); P(Object.entries(residueBy).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- ${k}: ${v}`).join('\n') || '- none');
P('\nResidue examples:\n'); P(residueEx.map((x) => `- ${x}`).join('\n') || '- none');
P('\nKept rows that move (examples):\n'); P(keptEx.map((x) => `- ${x}`).join('\n') || '- none');
console.log(out.join('\n'));
