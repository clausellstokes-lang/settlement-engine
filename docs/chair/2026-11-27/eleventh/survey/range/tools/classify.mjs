// RANGE-MEASURE (A) by script: for every KEY of 2+ lines that prints on C or V, how alike its lines are.
// node classify.mjs <keys.json> <stats-C.json> <stats-V.json> <out.json> [version]
// Similarity: content-word stems (a stop list; slots removed; a crude suffix stemmer), over the pairs of lines that can
// print under one condition (a pair is NOT co-eligible when one line declares an atom or mark the other negates or
// excludes). Script class (v1 thresholds; v2 after the hand read, see SCRIPT_RULES):
import { readFileSync, writeFileSync } from 'node:fs';
import './v2.mjs';
const [KEYS, SC, SV, OUT, VER = 'v1'] = process.argv.slice(2);
const { keys } = JSON.parse(readFileSync(KEYS, 'utf8'));
const C = JSON.parse(readFileSync(SC, 'utf8')); const V = JSON.parse(readFileSync(SV, 'utf8'));
const STOP = new Set(`a an the and or but nor of to in on at by for with from as into onto than then so if when where while whether about over under out up down off
here there place places town towns thorp thorps hamlet hamlets village villages city cities metropolis settlement settlements x
is are was were be been being am has have had having do does did done will would could should can cannot may might must shall
it its it's they them their theirs he him his she her hers we us our you your i me my mine one ones someone anyone everyone nobody no-one
this that these those such what who whom whose which why how all any each every some most more many much few less least other others another
no not nor never always ever often again also still even just only very too quite rather enough yet already now soon once
there's that's what's isn't aren't doesn't don't didn't won't wouldn't can't couldn't hasn't haven't wasn't weren't
s t d ll re ve -`.split(/\s+/));
const stem = (w) => {
  w = w.replace(/'s$/, '').replace(/^'|'$/g, '');
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
  if (w.length > 5 && w.endsWith('ly')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('es') && /(ss|sh|ch|x)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
  return w;
};
const content = (t) => new Set((t.replace(/\{[^}]*\}|\u0001/g, ' ').toLowerCase().replace(/[‘’]/g, "'").match(/[a-z']+/g) || [])
  .filter((w) => !STOP.has(w) && w.length > 2).map(stem).filter((w) => w.length > 2 && !STOP.has(w)));
const declTokens = (l) => { const dv = l.dv || {}; return { pos: new Set([...(dv.needs || []), ...(dv.marks || []).filter((m) => !m.startsWith('no '))]), neg: new Set([...(dv.excludes || []), ...(dv.marks || []).filter((m) => m.startsWith('no ')).map((m) => m.slice(3))]) }; };
const coEligible = (a, b) => { if ((a.dv?.twinOf || []).includes(b.text) || (b.dv?.twinOf || []).includes(a.text)) return false; const A = declTokens(a); const B = declTokens(b); for (const x of A.pos) if (B.neg.has(x)) return false; for (const x of B.pos) if (A.neg.has(x)) return false; return true; };
const CHROME = /^src\/(copy|components|pdf)\//;
const rows = [];
keys.forEach((k, ki) => {
  if (k.lines.length < 2) return;
  const c = C.K[ki]; const v = V.K[ki];
  if (!c && !v) return;
  const n = k.lines.length;
  const sets = k.lines.map((l) => content(l.text));
  let pairs = 0; let sJ = 0; let sO = 0; let coPairs = 0; const df = new Map();
  for (const s of sets) for (const w of s) df.set(w, (df.get(w) || 0) + 1);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    pairs++;
    if (!coEligible(k.lines[i], k.lines[j])) continue;
    coPairs++;
    const A = sets[i]; const B = sets[j]; let inter = 0; for (const w of A) if (B.has(w)) inter++;
    const uni = A.size + B.size - inter;
    sJ += uni ? inter / uni : 0; sO += Math.min(A.size, B.size) ? inter / Math.min(A.size, B.size) : 0;
  }
  const meanJ = coPairs ? sJ / coPairs : 0; const meanO = coPairs ? sO / coPairs : 0;
  const core = [...df.entries()].sort((a, b) => b[1] - a[1])[0] || ['', 0];
  const coreShare = core[1] / n;
  const sharedAll = [...df.entries()].filter(([, d]) => d === n).map(([w]) => w);
  // printed together? mean distinct lines a page among pages printing the key
  const distinctLines = new Set([...Object.keys(c?.lines || {}), ...Object.keys(v?.lines || {})]);
  const prints = (c?.prints || 0) + (v?.prints || 0); const pagesN = (c?.pages || 0) + (v?.pages || 0);
  const perPage = pagesN ? ((c?.dl || 0) + (v?.dl || 0)) / pagesN : 0;
  const lineCounts = k.lines.map((_, li) => (c?.lines?.[li] || 0) + (v?.lines?.[li] || 0));
  const topShare = prints ? Math.max(...lineCounts) / prints : 0;
  let cls;
  if (VER === 'v1') cls = meanO >= 0.5 || meanJ >= 0.3 ? 'PARAPHRASE' : meanO < 0.2 && coreShare < 0.6 ? 'DISTINCT' : 'ANGLES';
  else cls = scriptV2({ meanJ, meanO, coreShare, sharedAll, n });
  const declared = k.lines.filter((l) => (l.decl || []).some((d) => ['needs', 'excludes', 'marks', 'crisis'].includes(d))).length;
  rows.push({ ki, key: k.key, kind: k.kind, twinSet: k.twinSet || 0, chrome: CHROME.test(k.file), n, coPairs, pairs, declared, pagesC: c?.pages || 0, pagesV: v?.pages || 0, printsC: c?.prints || 0, printsV: v?.prints || 0, perPage, listLike: perPage / n >= 0.8 && perPage >= 1.5, distinctSeen: distinctLines.size, topShare, meanJ, meanO, core: core[0], coreShare, sharedAll, cls, lines: k.lines.map((l, li) => ({ t: l.text, site: l.site, dv: l.dv, p: lineCounts[li] })) });
});
// v2: the rules after the hand read (set once, see A-variants.md)
function scriptV2({ meanJ, meanO, coreShare, sharedAll, n }) {
  return globalThis.__V2({ meanJ, meanO, coreShare, sharedAll, n });
}
for (const r of rows) r.noChoice = r.coPairs === 0;
writeFileSync(OUT, JSON.stringify(rows));
const tally = {}; for (const r of rows) if (!r.chrome && !r.listLike && !r.noChoice) tally[r.cls] = (tally[r.cls] || 0) + 1;
console.log(`keys ${rows.length} (chrome ${rows.filter((r) => r.chrome).length}, list-like ${rows.filter((r) => r.listLike).length}, no co-eligible pair ${rows.filter((r) => r.noChoice && !r.listLike).length}); classes of the rest`, tally);
