// FLOOR, MEASURE ONLY (PROSE-6's agent; the chair's N71 (2), brief `briefs/FLOOR.md`). Read-only on a tree:
//   TREE=/home/user/wt-disagree node <script> [N=150]
// THE BLIND SPOT: the tooth's matcher (`tests/helpers/oppositeSentencePairs.mjs`, `formsOf`) drops a clause cut of fewer than
// four literal words, and `map/disagree-item4.mjs` counted a draw as printed only when that matcher hit. Here a drawn vid the
// matcher misses counts as printed UNDER THE FLOOR when the page holds, as one whole sentence, the readers' own cut of that
// variant: `siteClause` (`src/components/new/generalDeskRead.js`), the one clause-cutting rule a desk reader applies
// (`generalDeskLines` -> siteLines -> print mount `overview.market`). The other desks' readers cut no clause: defense drops whole
// repeated sentences (`sentencesNotIn`) or truncates at a whole sentence (`wholeSentencesWithin`); economy, power and stressors
// cut nothing. The cut is taken of every text and wording of every helper-desk cell, and looked for only where the cutting
// reader prints (`CUT_MOUNTS`): a short sentence elsewhere on the page is some other line's, not this variant's cut.
// The cut sentence is templated by the helper's own `oldWordsMatchersOf` (slot a lazy wildcard, "the town" any tier noun).
// ITEM 4's TABLE AND HELPERS (`CELLS`, `HELPER`, `cellId`, `sideOf`, `found`) are IMPORTED FROM ITS SOURCE: the script exports
// nothing, so its declarations between `const L = 'LACK'` and `const N = Number(` are evaluated here, never copied.
import { readFileSync } from 'node:fs';
const T = process.env.TREE || '/home/user/wt-disagree';
const R = T + '/src/';
const t0 = Date.now();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const { withPresumptionLedger } = await import(R + 'domain/facts/presumptionLedger.js');
const { sentenceMountForBlock } = await import(R + 'domain/display/stateProse/dossierMounts.js');
const { siteClause } = await import(R + 'components/new/generalDeskRead.js');
const H = await import(T + '/tests/helpers/oppositeSentencePairs.mjs');
const LEAF = {};
for (const d of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) LEAF[d] = Object.values(await import(R + `data/dossierStateProse/${d}.generated.js`))[0];
await loadGenerationLawPayloads();

const SRC = readFileSync(new URL('./disagree-item4.mjs', import.meta.url), 'utf8');
const from = SRC.indexOf("const L = 'LACK'"), to = SRC.indexOf('const N = Number(');
if (from < 0 || to < from) throw new Error('item 4 source: the table segment is not where it was');
const { L, S, CELLS, HELPER, cellId, BY_ID, sideOf, found } = new Function('LEAF', `${SRC.slice(from, to)}\nreturn { L, S, CELLS, HELPER, cellId, BY_ID, sideOf, found };`)(LEAF);
if (CELLS.length !== 151) throw new Error(`item 4's table holds ${CELLS.length} cells, not 151`);

// THE SHORT CUTS: per helper cell and vid, the reader's cut of each text and wording (where it cuts), with its literal words.
const literalWords = (t) => t.replace(/\{[a-zA-Z]+\}/g, ' ').split(/\s+/).filter((w) => /\w/.test(w)).length;
const CUTS = new Map(); // `${cellId}::${vid}` -> [{ cut, words, re }]
for (const c of CELLS) {
  if (!HELPER.has(c.desk)) continue;
  for (const v of LEAF[c.desk][c.position].pools[c.pool]) {
    const list = [];
    for (const t of [v.text, ...(v.wordings || [])]) {
      const cut = siteClause(t);
      if (cut === t.trim()) continue;
      const src = H.oldWordsMatchersOf({ text: cut })[0].source; // the helper's template of the cut, final stop dropped
      list.push({ cut, words: literalWords(cut), re: new RegExp(`^${src}\\.$`) });
    }
    if (list.length) CUTS.set(`${cellId(c)}::${v.vid}`, list);
  }
}
const sentencesOf = (texts) => texts.flatMap((t) => t.split(/(?<=[.!?])\s+/));
const CUT_MOUNTS = Object.freeze([['overview', 'overview.market']]); // printProse.js: put('overview', 'overview.market', g.siteLines)

const N = Number(process.argv[2] || 150);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const pages = new Map(CELLS.map((c) => [cellId(c), new Map()])); // cell -> seed -> Map(vid -> { t, floor, words })
const drew = new Map(CELLS.map((c) => [cellId(c), new Set()])); // cell -> seeds it drew on
const sizeOf = {};
const diag = { lifted: 0, liftedShort: 0, liftedLong: 0, cutsFound: new Map(), missNoCut: 0 };
for (const settType of SIZES) {
  for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    sizeOf[seed] = settType;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    const { result: pp, ledger } = withPresumptionLedger(() => buildPrintProse(s, {}));
    const texts = H.pageTextsOf(pp);
    const sents = sentencesOf(CUT_MOUNTS.map(([tab, m]) => pp[tab]?.[m]).filter(Boolean).map(String));
    const drawn = new Map();
    for (const e of ledger) if (BY_ID.has(e.pool) && typeof e.lineId === 'number') (drawn.get(e.pool) || drawn.set(e.pool, new Set()).get(e.pool)).add(e.lineId);
    for (const c of CELLS) {
      const id = cellId(c);
      const vids = drawn.get(id);
      if (!vids?.size) continue;
      drew.get(id).add(seed);
      const said = new Map();
      for (const vid of vids) {
        if (!HELPER.has(c.desk)) { const m = sentenceMountForBlock(c.position); const p = m && pp[m.tab]?.[m.mount]; if (p) said.set(vid, { t: String(p).replaceAll(s.name, '{settlement}'), floor: false }); continue; }
        const t = found(H.matchersOf(sideOf(c, vid)), texts);
        if (t) { said.set(vid, { t: t.replaceAll(s.name, '{settlement}'), floor: false }); continue; }
        let hit = null;
        for (const k of CUTS.get(`${id}::${vid}`) || []) { const sn = sents.find((x) => k.re.test(x)); if (sn) { hit = { t: sn.replaceAll(s.name, '{settlement}'), floor: true, words: k.words, cut: k.cut }; break; } }
        if (!hit) { diag.missNoCut++; continue; }
        diag.lifted++; if (hit.words < 4) diag.liftedShort++; else diag.liftedLong++;
        const ck = `${id} v${vid} :: ${hit.cut} (${hit.words})`; diag.cutsFound.set(ck, (diag.cutsFound.get(ck) || 0) + 1);
        said.set(vid, hit);
      }
      if (said.size) pages.get(id).set(seed, said);
    }
  }
}

const count = (seeds) => { const by = Object.fromEntries(SIZES.map((z) => [z, 0])); for (const sd of seeds) by[sizeOf[sd]]++; return by; };
const fmt = (seeds) => { const by = count(seeds); return `${SIZES.map((z) => by[z]).join('/')} = ${seeds.length}`; };
console.log(`CUTS in the table's helper cells: ${[...CUTS.values()].flat().length} (under 4 literal words: ${[...CUTS.values()].flat().filter((k) => k.words < 4).length})`);
for (const [k, list] of CUTS) for (const x of list) if (x.words < 4) console.log(`  SHORT ${k} :: ${x.cut} (${x.words})`);
console.log(`LIFTED cell-vid-pages: ${diag.lifted} (cut under 4 words ${diag.liftedShort}, cut of 4+ the matcher drops as shared ${diag.liftedLong}); drawn helper vids still unseen ${diag.missNoCut}`);
console.log(`DISTINCT CUTS FOUND ON PAGES: ${diag.cutsFound.size}`);
for (const [k, n] of [...diag.cutsFound].sort((a, b) => b[1] - a[1])) console.log(`  ${n} ${k}`);

const fam = {};
const walls = { pairs: 0, drewBoth: 0, printBoth: 0, floorBoth: 0 };
const vpAll = [];
for (const f of ['food', 'money', 'order', 'walls', 'trade']) {
  fam[f] = { cellPairs: 0, pages: new Set(), vps: 0 };
  const lack = CELLS.filter((c) => c.family === f && c.polarity === L);
  const suff = CELLS.filter((c) => c.family === f && c.polarity === S);
  for (const a of lack) for (const b of suff) {
    if (a.desk === b.desk && a.position === b.position) continue;
    const A = pages.get(cellId(a)), B = pages.get(cellId(b));
    if (f === 'walls') {
      walls.pairs++;
      walls.drewBoth += [...drew.get(cellId(a))].filter((sd) => drew.get(cellId(b)).has(sd)).length;
      walls.printBoth += [...A.keys()].filter((sd) => B.has(sd)).length;
    }
    const vp = new Map(); const seeds = new Set();
    for (const sd of A.keys()) {
      if (!B.has(sd)) continue;
      for (const [va, xa] of A.get(sd)) for (const [vb, xb] of B.get(sd)) {
        if (!xa.floor && !xb.floor) continue;
        seeds.add(sd);
        const k = `${va}x${vb}`;
        if (!vp.has(k)) vp.set(k, { fam: f, a, b, va, vb, seeds: [], ta: xa.t, tb: xb.t, fa: xa.floor, fb: xb.floor });
        vp.get(k).seeds.push(sd);
      }
    }
    if (!seeds.size) continue;
    if (f === 'walls') walls.floorBoth += seeds.size;
    fam[f].cellPairs++; seeds.forEach((sd) => fam[f].pages.add(sd)); fam[f].vps += vp.size;
    console.log(`\nCELL PAIR ${f} | L ${a.desk} ${cellId(a)} | S ${b.desk} ${cellId(b)} | floor pages ${fmt([...seeds])} | all co-printing pages ${[...A.keys()].filter((sd) => B.has(sd)).length}`);
    for (const v of [...vp.values()].sort((x, y) => y.seeds.length - x.seeds.length || x.va - y.va || x.vb - y.vb)) {
      vpAll.push(v);
      console.log(`   VP v${v.va}${v.fa ? '*' : ''} x v${v.vb}${v.fb ? '*' : ''}: ${fmt(v.seeds)} | ${v.seeds[0]}\n      A: ${v.ta.slice(0, 300)}\n      B: ${v.tb.slice(0, 300)}`);
    }
  }
}
console.log('\nBY FAMILY (cell pairs with a floor page | distinct pages | variant pairs):');
for (const [f, x] of Object.entries(fam)) console.log(`  ${f}: ${x.cellPairs} | ${x.pages.size} | ${x.vps}`);
console.log(`ALL: ${Object.values(fam).reduce((n, x) => n + x.cellPairs, 0)} cell pairs, ${new Set(Object.values(fam).flatMap((x) => [...x.pages])).size} pages, ${vpAll.length} variant pairs (* = under the floor)`);
console.log(`WALLS: ${walls.pairs} cell pairs; pages where both cells drew ${walls.drewBoth}; where both print (floor lifted) ${walls.printBoth}; with a floor side ${walls.floorBoth}`);
console.log(`RUN ${((Date.now() - t0) / 1000).toFixed(1)}s, ${N * SIZES.length} births`);
