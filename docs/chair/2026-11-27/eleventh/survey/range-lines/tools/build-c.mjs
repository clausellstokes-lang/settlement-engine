import { readFileSync, writeFileSync } from 'node:fs';
const D = '/home/user/range-lines/docs/chair/2026-11-27/eleventh/survey/range-lines';
const K = JSON.parse(readFileSync('c72.json', 'utf8'));
const { H } = await import('./c-houses.mjs');
const { O } = await import('./c-others.mjs');
const w = await import('/home/user/settlement-engine/src/domain/facts/registeredWords.js');
const c = await import('/home/user/settlement-engine/tests/lint/presumptionClasses.shared.mjs');
const walk = (t, house) => { const s = t.replace(/\[.*?\]/g, '').replace(/\{[^}]*\}/g, 'X'); const th = [...w.thingsNamedIn(s)]; const cl = c.classesOf(s); const r = (th.length ? `things: ${th.join(', ')}` : '') + (cl.length ? `${th.length ? '; ' : ''}classes: ${cl.join(', ')}` : ''); return r ? r + (house ? ' (BOUND file / the house\'s own kind)' : '') : 'none'; };
const tsv = (f) => readFileSync(f, 'utf8').replace(/\n+$/, '').split('\n').map((r) => r.split('\t'));
const A = tsv(`${D}/A-view-lines.tsv`); const B = tsv(`${D}/B-house-sample.tsv`);
const aKey = { 'src/domain/display/governanceAccount.js :: governanceAccountOf()': 'governanceAccountOf() :: the seat sentence', 'src/domain/display/crisisStoppedRow.js :: MARK_LINES': 'MARK_LINES', 'src/data/people/dmPowerLines.js :: CAPTURE_LINES.none': 'CAPTURE_LINES.none', 'src/data/people/dmPowerLines.js :: PATRONAGE_LINES.open': 'PATRONAGE_LINES.open', 'src/data/dossierStateProse/general.generated.js :: DOSSIER_STATE_PROSE_GENERAL.DS-GEN-16.pools.LEGACY-UNRESOLVED': 'DS-GEN-16.pools.LEGACY-UNRESOLVED', 'src/data/dossierStateProse/defense.generated.js :: DOSSIER_STATE_PROSE_DEFENSE.DS-DEF-5.pools.charter hall PRESENT (specialist monster response)': 'DS-DEF-5.pools.charter hall PRESENT (specialist monster response)' };
const HOUSE_DRAWN = 'BIRTH: stored in institutions[].desc; pickVariant (hash % length) over [catalogue, ...variants]: A NEW LINE RE-DEALS BIRTHS unless the pick is first made ranked or view-time (the measure\'s first recommendation)';
const HOUSE_READER = 'Institutions tab (the house card), owner and shared page; the PDF';
const HDR = ['rank', 'key', 'prints C+V', 'lines today', 'from', 'how it is drawn', 'who reads it', 'existing lines (‖)', 'new line', 'what it notices', 'claims', 'needs', 'marks / branch / twin', 'notes', "walkers' matchers"];
const rows = [HDR.join('\t')]; let n = 0, j = 0;
const push = (r) => { rows.push(r.map((x) => String(x ?? '').replace(/[\t\n]/g, ' ')).join('\t')); n++; if (r[10] && r[10] !== 'none' && !/^none\b/.test(r[10])) j++; };
K.forEach((k, i) => {
  const rank = i + 1; const base = [rank, k.key, k.prints, k.n];
  if (aKey[k.key]) { for (const r of A.slice(1).filter((r) => r[0] === aKey[k.key])) push([...base, 'A-view-lines.tsv', r[3], r[2], r[4], r[5], r[6], r[7], r[8], [r[11], r[12]].filter(Boolean).join(' ‖ twin: '), '', r[13]]); return; }
  const hk = k.key.includes('[joined] ') ? k.key.split('[joined] ')[1] : null;
  const bRows = hk ? B.slice(1).filter((r) => r[0] === hk) : [];
  if (bRows.length) { for (const r of bRows) push([...base, 'B-house-sample.tsv', HOUSE_DRAWN, HOUSE_READER, [r[1], r[2], r[3]].join(' ‖ '), r[4], r[5], r[6], r[7], '', 'read against the catalogue line and the house\'s services', r[8]]); return; }
  if (hk && H[hk]) { for (const [t, no, cl, nd] of H[hk]) push([...base, 'C (here)', HOUSE_DRAWN, HOUSE_READER, k.lines, t, no, cl, nd, '', 'read against the catalogue line and the house\'s services', walk(t, true)]); return; }
  const o = O[k.key]; if (!o) { console.log('MISSING', k.key); return; }
  for (const [t, no, cl, nd, mk] of o.lines) push([...base, 'C (here)', o.drawn, o.reader, k.lines, t, no, cl, nd, mk, `${o.home}. ${o.notes} (homes read by a helper and spot-checked: PLAUSIBLE)`, walk(t, false)]);
});
writeFileSync(`${D}/C-range-lines.tsv`, `${rows.join('\n')}\n`);
console.log(n, 'lines over', K.length, 'keys;', j, 'with a judgment or other claim');
