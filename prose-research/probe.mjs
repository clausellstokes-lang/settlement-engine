// READ-ONLY corpus probe: measures the estate's authored prose against the AI-failure catalogue.
// Reads the composed dock; writes only to the scratchpad. No repo file is touched.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const D = process.argv[2]; const OUT = process.argv[3];
const pops = {};
function add(pop, file, pool, text) { (pops[pop] ||= []).push({ file, pool, text }); }
// Population A: the dossier state + causal corpus (generated JSON-ish leaves).
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const src = readFileSync(path.join(gdir, f), 'utf8');
  let pool = '?'; let block = '?';
  for (const line of src.split('\n')) {
    const b = line.match(/^  "([A-Z]+-[A-Z]+-\d+[a-z]?)": \{/); if (b) block = b[1];
    const p = line.match(/^      "([^"]+)": \[/); if (p) pool = block + ' :: ' + p[1];
    const t = line.match(/^\s+"text": "(.*)",?$/); if (t) add('dossier-state', f, pool, JSON.parse('"' + t[1] + '"'));
  }
}
{
  const src = readFileSync(path.join(D, 'src/data/dossierCausalProse.generated.js'), 'utf8');
  let pool = '?';
  for (const line of src.split('\n')) {
    const p = line.match(/^\s+"([^"]+)": \[/); if (p) pool = p[1];
    const t = line.match(/^\s+"text": "(.*)",?$/); if (t) add('dossier-causal', 'dossierCausalProse.generated.js', pool, JSON.parse('"' + t[1] + '"'));
  }
}
// Population B: the news receipt pools (annex-verbatim corpus files) — string literals that read as sentences.
const wp = path.join(D, 'src/domain/worldPulse');
for (const f of readdirSync(wp).filter(f => /ReceiptPools\.js$|News\.js$/.test(f))) {
  const src = readFileSync(path.join(wp, f), 'utf8');
  const re = /(['"`])((?:[A-Z{][^'"`\n]{30,}?[.?!]))\1/g; let m;
  while ((m = re.exec(src))) { const s = m[2]; if (/\b(function|const|import|export|=>)\b/.test(s)) continue; add('news-pools', f, f, s); }
}
// ---- metrics ----
const TELLS = ['delve','tapestry','testament','intricate','pivotal','underscore','showcase','realm','beacon','echo','whisper','dance','symphony','nestled','bustling','vibrant','meticulous','crucial','notable','journey','unwavering','palpable','a reminder','speaks to','serves as','stands as','stark','weight of','the very','in the end','at its core','a sense of','quiet(ly)? ','steadfast','resilien','landscape','navigate','foster','ever-','timeless','profound','remnant','linger','haunting','shadow of','heart of','fabric of','breath','tension','narrative','shape(s|d)? the'];
const words = s => s.trim().split(/\s+/).filter(Boolean);
const sentences = s => s.replace(/\{[a-z_0-9]+\}/g, 'X').split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter(Boolean);
function metrics(list) {
  const n = list.length; const r = { variants: n };
  const lens = []; let two = 0, three = 0, one = 0;
  const tellCount = {}; let antithesis = 0, triad = 0, doubledAdj = 0, ingOpen = 0, thatOpen2 = 0, whichTail = 0, semi = 0, em = 0, colon = 0, q = 0, ownTic = 0, sortOf = 0, notTrivial = 0, closerAbstract = 0, parenth = 0, itIsThe = 0, andYet = 0, notNot = 0, whateverTic = 0, enoughTic = 0, kindOf = 0;
  const openers = {}; const closers = {};
  for (const { text } of list) {
    const ss = sentences(text); if (ss.length === 1) one++; else if (ss.length === 2) two++; else three++;
    for (const s of ss) {
      const w = words(s); lens.push(w.length);
      const first = (w[0] || '').replace(/[^A-Za-z]/g, '').toLowerCase(); openers[first] = (openers[first] || 0) + 1;
      if (/ing$/.test(first) && !/^(thing|nothing|something|king|spring|during|wing|ring|string|building|ceiling|evening|morning|bring|sing)$/.test(first)) ingOpen++;
      const last = (w[w.length - 1] || '').replace(/[^A-Za-z]/g, '').toLowerCase(); closers[last] = (closers[last] || 0) + 1;
      if (/(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/.test(last)) closerAbstract++;
    }
    if (ss.length >= 2 && /^(That|This|It|Which)\b/.test(ss[1])) thatOpen2++;
    const t = text.toLowerCase();
    for (const k of TELLS) { const re = new RegExp('\\b' + k, 'g'); const c = (t.match(re) || []).length; if (c) tellCount[k] = (tellCount[k] || 0) + c; }
    if (/\bnot (only )?[^.,;]{2,40}[,;]? but\b/.test(t) || /\bless [^.,;]{2,30} than\b/.test(t)) antithesis++;
    if (/,[^,.]+,[^,.]+,? and [^,.]+[.;]/.test(text)) triad++;
    if (/\b\w+(ed|ing|ous|ful|less|ive|al|ant|ent) and \w+(ed|ing|ous|ful|less|ive|al|ant|ent)\b/.test(t)) doubledAdj++;
    if (/, which\b/.test(text)) whichTail++;
    if (text.includes(';')) semi++; if (text.includes('—')) em++; if (/:\s/.test(text)) colon++; if (text.includes('?')) q++;
    if (/\bits own\b|\bof its own\b|\bown kind of\b/.test(t)) ownTic++;
    if (/\bthe (sort|kind) of (town|place|settlement|thing)\b/.test(t)) sortOf++;
    if (/\bnot (a )?(trivial|small|nothing|little)\b|\bno small\b/.test(t)) notTrivial++;
    if (/\(/.test(text)) parenth++;
    if (/\bit is the\b/.test(t)) itIsThe++;
    if (/\band yet\b|\byet\b/.test(t)) andYet++;
    if (/\bnot [^.,;]{1,30}, not [^.,;]{1,30}/.test(t)) notNot++;
    if (/\bwhatever\b/.test(t)) whateverTic++;
    if (/\benough (to|that)\b/.test(t)) enoughTic++;
    if (/\bkind of\b|\bsort of\b/.test(t)) kindOf++;
  }
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);
  const sorted = [...lens].sort((a, b) => a - b);
  const pct = p => sorted[Math.floor(p * (sorted.length - 1))];
  Object.assign(r, { sentencesTotal: lens.length, oneSentence: one, twoSentences: two, threePlus: three,
    wordsPerSentence: { mean: +mean.toFixed(1), sd: +sd.toFixed(1), p10: pct(.1), p50: pct(.5), p90: pct(.9), shareUnder8: +(lens.filter(x => x < 8).length / lens.length).toFixed(3), shareOver30: +(lens.filter(x => x > 30).length / lens.length).toFixed(3) },
    tells: Object.fromEntries(Object.entries(tellCount).sort((a, b) => b[1] - a[1])),
    shapes: { antithesisNotBut: antithesis, triadLists: triad, doubledAdjectives: doubledAdj, participialOpeners: ingOpen, secondSentenceThatThisIt: thatOpen2, commaWhichTail: whichTail, semicolons: semi, emDashes: em, colons: colon, questions: q, parentheses: parenth, itIsThe, yetTurns: andYet, notXnotY: notNot, closerAbstractNoun: closerAbstract },
    houseTics: { itsOwn: ownTic, theSortOfTownThat: sortOf, notATrivialOne: notTrivial, whatever: whateverTic, enoughTo: enoughTic, kindOfSortOf: kindOf },
    topOpeners: Object.entries(openers).sort((a, b) => b[1] - a[1]).slice(0, 15),
    topClosers: Object.entries(closers).sort((a, b) => b[1] - a[1]).slice(0, 15) });
  return r;
}
// pool-level cadence sharing: within a pool, variants whose first two words match, and whose sentence-count shape matches all others
function poolStats(list) {
  const byPool = {}; for (const v of list) (byPool[v.pool] ||= []).push(v.text);
  let pools = 0, sameOpenerPools = 0, sameShapePools = 0, sizes = {};
  for (const [k, vs] of Object.entries(byPool)) { if (vs.length < 2) continue; pools++; sizes[vs.length] = (sizes[vs.length] || 0) + 1;
    const op = new Set(vs.map(t => words(t).slice(0, 2).join(' ').toLowerCase())); if (op.size < vs.length) sameOpenerPools++;
    const sh = new Set(vs.map(t => sentences(t).length)); if (sh.size === 1) sameShapePools++; }
  return { poolsWith2Plus: pools, poolsWithARepeatedTwoWordOpener: sameOpenerPools, poolsWhereEveryVariantHasTheSameSentenceCount: sameShapePools, poolSizes: sizes };
}
const report = {};
for (const [pop, list] of Object.entries(pops)) report[pop] = { ...metrics(list), pools: poolStats(list) };
writeFileSync(OUT, JSON.stringify(report, null, 2));
// samples: 12 random-but-deterministic variants per population for the eye
let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const samples = {}; for (const [pop, list] of Object.entries(pops)) samples[pop] = Array.from({ length: 12 }, () => list[Math.floor(rnd() * list.length)]);
writeFileSync(OUT.replace(/\.json$/, '.samples.json'), JSON.stringify(samples, null, 2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(report).map(([k, v]) => [k, { variants: v.variants, sentences: v.sentencesTotal, wps: v.wordsPerSentence, shapes: v.shapes, tics: v.houseTics, tells: v.tells, pools: v.pools }])), null, 1));
