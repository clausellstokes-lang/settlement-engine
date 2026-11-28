// node apply.mjs <family-prefix e.g. DS-ECO> : apply the ledger's DS declarations to the annex
import fs from 'node:fs';
const ROOT = new URL('../../../', import.meta.url).pathname;
const fam = process.argv[2];
const ANNEX = ROOT + 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md';
const D = ROOT + 'docs/census/declarations/';
const L = (x) => (Array.isArray(x) ? x : x ? [x] : []);
const lines = fs.readFileSync(ANNEX, 'utf8').split('\n');
const report = { lines: 0, pools: 0, scoped: 0, missing: [], hungerOnly: 0, dropped: [] };
// THE SEAT'S RULINGS AT APPLY (recorded in the lane doc): a FOOD pool's calm is false under the
// hunger family only, so it takes the kernel's `no hunger` on its calm lines, never the pool opt-in;
const HUNGER_ONLY = new Set(['DS-ECO-2::FOOD: surplus', 'DS-ECO-2::FOOD: balanced', 'DS-ECO-2::GRANARY: well stocked',
  'DS-ECO-9::SURPLUS', 'DS-ECO-9::SECURE', 'DS-ECO-9::PRESSURED', 'DS-ECO-9::IMPORT-DEPENDENT']);
// a line whose atom is colour, not a presumption, drops it (it would mute its pool);
const DROP = { 'DS-ECO-11::TERRAIN: Plains::v2': ['grain'] };
const claimed = new Set();
const KERNEL_ON = ['crisis', 'threat', 'hunger', 'succession open', 'unrest'];
for (const f of fs.readdirSync(D).filter((f) => f.startsWith(fam + '-') && f.endsWith('.json')).sort()) {
  const j = JSON.parse(fs.readFileSync(D + f, 'utf8'));
  const start = lines.findIndex((l) => l.startsWith(`### ${j.id}:`) || l.startsWith(`### ${j.id} ·`)); // CENSUS-3c: DS-POP-3's header reads `### DS-POP-3 · …`
  let end = lines.findIndex((l, i) => i > start && /^### |^## /.test(l)); if (end < 0) end = lines.length;
  if (start < 0) { report.missing.push(j.id); continue; }
  for (const p of j.pools) {
    const hungerOnly = HUNGER_ONLY.has(p.id);
    const scoped = p.crisisScoped === true && !hungerOnly;
    let firstIdx = -1;
    for (const ln of p.lines) {
      // CENSUS-3c: match by the line's own id — the pool header, then row N (`::vN`) — with the
      // text prefix as a guard. The ledger's texts are truncated at 90 characters, and two lines of
      // one pool can share them (DS-ECO-3 SHORTAGE × not trade-dependent v1 "…its own walls." / v4
      // "…its own bounds."): the old first-prefix match wrote v4's `no walls` onto v1.
      const body = (l) => l.replace(/^\d+\.\s+`\[[^\]]+\]`\s+(?:`\[[^\]]+\]`\s+)?/, '');
      const m = /^(.*)::v(\d+)$/.exec(ln.id);
      const poolKey = m ? m[1].slice(j.id.length + 2) : null;
      const norm = (x) => x.replace(/`/g, '').trim();
      const h = poolKey == null ? -1 : lines.findIndex((l, i) => i > start && i < end && /^\*\*(.+?)\*\*/.test(l) && norm(/^\*\*(.+?)\*\*/.exec(l)[1]) === norm(poolKey));
      let idx = -1;
      if (h >= 0) for (let i = h + 1; i < end && !/^\*\*|^#/.test(lines[i]); i++) if (lines[i].startsWith(`${m[2]}. \``)) { idx = i; break; }
      if (idx < 0 || !body(lines[idx]).startsWith(ln.text.slice(0, 60))) { report.missing.push(ln.id); continue; }
      if (claimed.has(idx)) throw new Error(`two ledger lines on one annex row: ${ln.id}`);
      claimed.add(idx);
      if (firstIdx < 0) firstIdx = idx;
      const drop = DROP[ln.id] || [];
      if (drop.length) report.dropped.push(ln.id + ' − ' + drop.join(', '));
      const atoms = [...L(ln.needs).filter((x) => !drop.includes(x)), ...L(ln.excludes).map((x) => 'no ' + x)];
      const marksNow = (/^\d+\.\s+`\[([^\]]+)\]`/.exec(lines[idx]) || [, ''])[1].split('·').map((t) => t.trim());
      for (const c of L(ln.crisis)) {
        // R-B1's hygiene at the line: a line F12 already marks with the family (`hunger`) does not
        // re-declare it through the census channel — one fact, one declaration (CENSUS-3c).
        if (KERNEL_ON.includes(c) && marksNow.includes(c)) { report.markRestated = (report.markRestated || 0) + 1; continue; }
        if (hungerOnly && c === 'calm') { atoms.push('no hunger'); report.hungerOnly++; continue; }
        if (!(scoped && c === 'calm')) atoms.push('crisis: ' + c);
      }
      // in a scoped pool, a line the kernel already keys to a crisis (F12's twins) is sayable under one
      const tagsNow = (/^\d+\.\s+`\[([^\]]+)\]`/.exec(lines[idx]) || [, ''])[1].split('·').map((t) => t.trim());
      if (scoped && !L(ln.crisis).length && tagsNow.some((t) => KERNEL_ON.includes(t))) atoms.push('crisis: any');
      if (!atoms.length) continue;
      lines[idx] = lines[idx].replace(/^(\d+\.\s+`\[)([^\]]+)(\]`)/, (_, a, tags, b) => {
        const have = tags.split('·').map((t) => t.trim());
        const add = atoms.filter((x) => !have.includes(x));
        return a + [...have, ...add].join(' · ') + b;
      });
      report.lines++;
    }
    // R-B1 (CENSUS-2b, stood by the chair 2026-11-05 01:5x): a keyed pool does not re-declare its key.
    // Every pool-level `declares` in the DS-ECO/SUP/POP ledger restates its pool's key (terrain,
    // food band, magic, exodus, metropolis — the ledger's own `notes` say so), so none is applied.
    if (L(p.declares).length) report.keyRestated = (report.keyRestated || 0) + 1;
    const braces = scoped ? ['crisis-scoped'] : [];
    if (braces.length && firstIdx >= 0) {
      let k = firstIdx - 1; while (k > start && !/^\*\*/.test(lines[k])) k--;
      if (/\{[^{}]*\}\s*$/.test(lines[k])) throw new Error('already braced: ' + lines[k]);
      lines[k] = lines[k].replace(/\s*$/, '') + ` {${braces.join(' · ')}}`;
      report.pools++; if (scoped) report.scoped++;
    }
  }
}
fs.writeFileSync(ANNEX, lines.join('\n'));
console.log(JSON.stringify(report));
