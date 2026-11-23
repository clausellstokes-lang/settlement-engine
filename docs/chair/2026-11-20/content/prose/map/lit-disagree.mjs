// LIT-DISAGREE, MEASURE ONLY (PROSE-6's builder; the chair's N80, brief `briefs/LIT-DISAGREE.md`). Read-only on a tree:
//   TREE=/home/user/wt-lit node <script> [N=150]        (OUT=<file.json> also writes every lit variant pair's seeds)
// WHY: every DISAGREE and PROSE-E measure was born DARK; the first deploy ships LIT (the seat, contest and fortune dials,
// 2bc483fc8). Each seed is born twice in ONE process on ONE tree:
//   LIT  = the tree's own default birth, `birthConfig({ settType })` (it mints `_seatLawVersion: 2`, `_fortuneLawVersion: 2`;
//          `SEAT_CONTEST_LIT` is true and acts only where `seatsByHolder`), as `map/disagree.mjs` and the tooth birth;
//   DARK = the same config with both markers removed (a world born before the laws: each resolver reads law 1, so the contest
//          is dark too, `rulingPowerCoup.js` `lit = law && SEAT_CONTEST_LIT`), the comparator for "lit but not dark".
// (0) the dials read through the tree's own readers (`resolveSeatLawVersion`, `seatsByHolder`, `resolveFortuneLawVersion`,
//     `isSizeRelativeFortune`, `SEAT_CONTEST_LIT`) on the first birth and counted over every birth.
// (1) PRINTED, as `map/floor.mjs`: the kernel's draw ledger names the vid; a helper-desk vid prints when the tooth's one-vid
//     matcher finds it (`matchersOf`, `pageTextsOf` of the TREE's `tests/helpers/oppositeSentencePairs.mjs`, imported) or, under
//     the floor, when the site mount holds the variant's `siteClause` cut as one whole sentence; a power / stressors vid prints
//     when its block's sentence mount is on the page. Item 4's 151-cell table and helpers are evaluated from its own source.
//     EVERY co-printing variant pair of every LACK x SUFFICIENCY cell pair is listed with its printed forms (tier noun as {tier}).
// (2) the tooth's rows over the 900 (rows, watched row, old words, pinned tails) and each control's case by the arm's predicate.
// (3) every printed form of PROSE-E's five re-worded lines, lit and dark, with its mount.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const T = process.env.TREE || '/home/user/wt-lit';
const R = T + '/src/';
const t0 = Date.now();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const { withPresumptionLedger } = await import(R + 'domain/facts/presumptionLedger.js');
const { sentenceMountForBlock } = await import(R + 'domain/display/stateProse/dossierMounts.js');
const { siteClause } = await import(R + 'components/new/generalDeskRead.js');
const SEAT = await import(R + 'domain/seat/seatLaw.js');
const FORT = await import(R + 'domain/fortune/fortuneLaw.js');
const { SEAT_CONTEST_LIT } = await import(R + 'domain/seat/seatCircumstances.js');
const H = await import(T + '/tests/helpers/oppositeSentencePairs.mjs');
const LEAF = {};
for (const d of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) LEAF[d] = Object.values(await import(R + `data/dossierStateProse/${d}.generated.js`))[0];
await loadGenerationLawPayloads();

const SRC = readFileSync(new URL('./disagree-item4.mjs', import.meta.url), 'utf8');
const from = SRC.indexOf("const L = 'LACK'"), to = SRC.indexOf('const N = Number(');
if (from < 0 || to < from) throw new Error('item 4 source: the table segment is not where it was');
const { L, S, CELLS, HELPER, cellId, BY_ID, sideOf, found } = new Function('LEAF', `${SRC.slice(from, to)}\nreturn { L, S, CELLS, HELPER, cellId, BY_ID, sideOf, found };`)(LEAF);
if (CELLS.length !== 151) throw new Error(`item 4's table holds ${CELLS.length} cells, not 151`);

// THE SHORT CUTS (as floor.mjs; the helper's `oldWordsMatchersOf` now reads its pin's side, so the side is handed in).
const literalWords = (t) => t.replace(/\{[a-zA-Z]+\}/g, ' ').split(/\s+/).filter((w) => /\w/.test(w)).length;
const CUTS = new Map();
const cutsOf = (c, v) => {
  const list = [];
  for (const t of [v.text, ...(v.wordings || [])]) {
    const cut = siteClause(t);
    if (cut === t.trim()) continue;
    const src = H.oldWordsMatchersOf({ text: cut, side: sideOf(c, v.vid) })[0].source;
    list.push({ cut, words: literalWords(cut), re: new RegExp(`^${src}\\.$`) });
  }
  return list;
};
const FIVE = Object.freeze([
  ['GEN-13 NO-MARKET v10', 'DS-GEN-13::NO-MARKET', 10],
  ['DEF-2 full legal chain v1', 'DS-DEF-2::Internal Security: full legal chain (court AND prison)', 1],
  ['DEF-2 full legal chain v2', 'DS-DEF-2::Internal Security: full legal chain (court AND prison)', 2],
  ['DEF-2 CHAIN working v1', 'DS-DEF-2::CHAIN: food trades working', 1],
  ['DEF-2 CRITICAL v1', 'DS-DEF-2::Economic Survival: CRITICAL', 1],
]);
for (const [, id] of FIVE) if (!BY_ID.has(id)) throw new Error(`five: ${id} is not a cell of item 4's table`);
for (const c of CELLS) {
  if (!HELPER.has(c.desk)) continue;
  for (const v of LEAF[c.desk][c.position].pools[c.pool]) { const l = cutsOf(c, v); if (l.length) CUTS.set(`${cellId(c)}::${v.vid}`, l); }
}
const sentencesOf = (texts) => texts.flatMap((t) => t.split(/(?<=[.!?])\s+/));
const CUT_MOUNTS = Object.freeze([['overview', 'overview.market']]);
const tier = (t) => t.replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/g, '{tier}');

const N = Number(process.argv[2] || 150);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const sizeOf = {};
const darkOf = (cfg) => { const { [SEAT.SEAT_LAW_CONFIG_KEY]: _s, [FORT.FORTUNE_LAW_CONFIG_KEY]: _f, ...rest } = cfg; return rest; };
const dials = (cfg, s) => ({ cfgSeat: cfg[SEAT.SEAT_LAW_CONFIG_KEY], cfgFortune: cfg[FORT.FORTUNE_LAW_CONFIG_KEY], seatLaw: SEAT.resolveSeatLawVersion(s), seatsByHolder: SEAT.seatsByHolder(s), fortuneLaw: FORT.resolveFortuneLawVersion(s), sizeRelative: FORT.isSizeRelativeFortune(s), SEAT_CONTEST_LIT, contestLit: SEAT.seatsByHolder(s) && SEAT_CONTEST_LIT });

function measure(mode) {
  const pages = new Map(CELLS.map((c) => [cellId(c), new Map()]));
  const diag = { lifted: 0, liftedCuts: new Map(), missNoCut: 0, litBirths: 0, hash: new Map() };
  const tooth = { rows: {}, old: {}, tails: {}, sides: {}, heads: {} };
  const five = new Map(FIVE.map(([n]) => [n, new Map()])); // name -> `${mount} :: ${form}` -> seeds
  for (const settType of SIZES) for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    sizeOf[seed] = settType;
    const cfg = mode === 'LIT' ? birthConfig({ settType }) : darkOf(birthConfig({ settType }));
    const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    const d = dials(cfg, s);
    if (d.seatLaw === 2 && d.fortuneLaw === 2 && d.contestLit) diag.litBirths++;
    if (!diag.first) { diag.first = { seed, ...d }; }
    const { result: pp, ledger } = withPresumptionLedger(() => buildPrintProse(s, {}));
    diag.hash.set(seed, createHash('sha256').update(JSON.stringify(pp)).digest('hex'));
    const texts = H.pageTextsOf(pp);
    const entries = Object.values(pp || {}).flatMap((ms) => Object.entries(ms || {}).map(([m, t]) => [m, String(t)]));
    const sents = sentencesOf(CUT_MOUNTS.map(([tab, m]) => pp[tab]?.[m]).filter(Boolean).map(String));
    const drawn = new Map();
    const drawnKeys = new Set();
    for (const e of ledger) if (typeof e.lineId === 'number') {
      drawnKeys.add(`${e.pool}::v${e.lineId}`);
      if (BY_ID.has(e.pool)) (drawn.get(e.pool) || drawn.set(e.pool, new Set()).get(e.pool)).add(e.lineId);
    }
    const name = (t) => t.replaceAll(s.name, '{settlement}');
    const floorHit = (id, vid) => { for (const k of CUTS.get(`${id}::${vid}`) || []) { const sn = sents.find((x) => k.re.test(x)); if (sn) return { t: name(sn), k }; } return null; };
    for (const c of CELLS) {
      const id = cellId(c);
      const vids = drawn.get(id);
      if (!vids?.size) continue;
      const said = new Map();
      for (const vid of vids) {
        if (!HELPER.has(c.desk)) { const m = sentenceMountForBlock(c.position); const p = m && pp[m.tab]?.[m.mount]; if (p) said.set(vid, { t: name(String(p)), floor: false, leaf: true }); continue; }
        const t = found(H.matchersOf(sideOf(c, vid)), texts);
        if (t) { said.set(vid, { t: name(t), floor: false }); continue; }
        const hit = floorHit(id, vid);
        if (!hit) { diag.missNoCut++; continue; }
        diag.lifted++; const ck = `${id} v${vid} :: ${hit.k.cut}`; diag.liftedCuts.set(ck, (diag.liftedCuts.get(ck) || 0) + 1);
        said.set(vid, { t: hit.t, floor: true });
      }
      if (said.size) pages.get(id).set(seed, said);
    }
    // (3) THE FIVE: the mount and the printed form of each drawn line.
    for (const [n, id, vid] of FIVE) {
      if (!drawn.get(id)?.has(vid)) continue;
      const side = sideOf(BY_ID.get(id), vid);
      let key = null;
      for (const [m, t] of entries) { const f = found(H.matchersOf(side), [t]); if (f) { key = `${m} :: ${name(f)}`; break; } }
      if (!key) { const hit = floorHit(id, vid); if (hit) key = `overview.market (cut) :: ${hit.t}`; }
      if (!key) key = 'DRAWN, NOT FOUND ON THE PAGE';
      const fm = five.get(n); (fm.get(key) || fm.set(key, []).get(key)).push(seed);
    }
    // (2) THE TOOTH'S ROWS over every birth, by the helper's own matchers; each control's case by its arm's predicate.
    for (const rid of H.oppositePairsOnPage(texts)) (tooth.rows[rid] ||= []).push(seed);
    for (const pin of H.PINNED_OLD_WORDS) if (H.sidePrinted(H.oldWordsMatchersOf(pin), texts)) (tooth.old[pin.id] ||= []).push(seed);
    for (const pin of H.PINNED_TAILS) {
      if (H.sidePrinted(H.tailMatchersOf(pin.side), texts)) (tooth.tails[pin.id] ||= []).push(seed);
      let head = H.sidePrinted(H.matchersOf(pin.side), texts); // ARM 3's head: by matcher, or drawn with siteClause's cut on the page
      for (const t of H.textsOf(pin.side)) {
        const isDrawn = pin.side.vids.some((v) => drawnKeys.has(`${pin.side.position}::${pin.side.pool}::v${v}`));
        const filled = t.replaceAll('{settlement}', s.name); const cut = siteClause(filled);
        if (isDrawn && cut !== filled && texts.some((x) => x.includes(cut))) head = true;
      }
      if (head) (tooth.heads[pin.id] ||= []).push(seed);
    }
    for (const p of H.OPPOSITE_PAIRS) for (const [k, sd] of [['a', p.a], ['b', p.b]]) {
      for (const vid of sd.vids) if (H.sidePrinted(H.matchersOf(sideOf(sd, vid)), texts)) (tooth.sides[`${p.id} side ${k} v${vid}`] ||= []).push(seed);
    }
  }
  return { pages, diag, tooth, five };
}

const fmt = (seeds) => { const by = Object.fromEntries(SIZES.map((z) => [z, 0])); for (const sd of seeds) by[sizeOf[sd]]++; return `${SIZES.map((z) => by[z]).join('/')} = ${seeds.length}`; };
const cross = (pages) => {
  const out = [];
  for (const f of ['food', 'money', 'order', 'walls', 'trade']) {
    const lack = CELLS.filter((c) => c.family === f && c.polarity === L), suff = CELLS.filter((c) => c.family === f && c.polarity === S);
    for (const a of lack) for (const b of suff) {
      if (a.desk === b.desk && a.position === b.position) continue;
      const A = pages.get(cellId(a)), B = pages.get(cellId(b));
      const both = [...A.keys()].filter((sd) => B.has(sd));
      if (!both.length) continue;
      const vp = new Map();
      for (const sd of both) for (const [va, xa] of A.get(sd)) for (const [vb, xb] of B.get(sd)) {
        const k = `${va}x${vb}`;
        if (!vp.has(k)) vp.set(k, { va, vb, seeds: [], forms: new Map(), floor: false });
        const v = vp.get(k); v.seeds.push(sd); v.floor ||= xa.floor || xb.floor;
        const fa = xa.leaf ? `LEAF: ${LEAF[a.desk][a.position].pools[a.pool].find((x) => x.vid === va)?.text}` : tier(xa.t);
        const fb = xb.leaf ? `LEAF: ${LEAF[b.desk][b.position].pools[b.pool].find((x) => x.vid === vb)?.text}` : tier(xb.t);
        const fk = `${fa}\n        B: ${fb}`; v.forms.set(fk, (v.forms.get(fk) || 0) + 1);
      }
      out.push({ f, a, b, key: `${cellId(a)} || ${cellId(b)}`, both, vp });
    }
  }
  return out.sort((x, y) => y.both.length - x.both.length);
};

const LIT = measure('LIT');
const DARK = measure('DARK');
const XL = cross(LIT.pages), XD = cross(DARK.pages);
const DK = new Map(XD.map((x) => [x.key, x]));

console.log(`(0) DIALS, first LIT birth: ${JSON.stringify(LIT.diag.first)}`);
console.log(`(0) DIALS, first DARK birth: ${JSON.stringify(DARK.diag.first)}`);
console.log(`(0) births reading seat law 2, fortune law 2 and the contest lit: LIT ${LIT.diag.litBirths} of ${N * SIZES.length}, DARK ${DARK.diag.litBirths}`);
const moved = [...LIT.diag.hash].filter(([sd, h]) => DARK.diag.hash.get(sd) !== h).map(([sd]) => sd);
console.log(`(0) pages (buildPrintProse) that differ lit vs dark: ${fmt(moved)}`);
for (const [M, X] of [['LIT', LIT], ['DARK', DARK]]) console.log(`(1) ${M}: lifted under the floor ${X.diag.lifted} cell-vid-pages; drawn helper vids unseen ${X.diag.missNoCut}; cuts ${[...X.diag.liftedCuts].map(([k, n]) => `${n} ${k}`).join(' | ')}`);
console.log(`\n(1) CELL PAIRS CO-PRINTING: LIT ${XL.length}, DARK ${XD.length}`);
for (const x of XL) if (!DK.has(x.key)) console.log(`  LIT NOT DARK: ${x.f} ${x.key} ${fmt(x.both)}`);
for (const x of XD) if (!XL.some((y) => y.key === x.key)) console.log(`  DARK NOT LIT: ${x.f} ${x.key} ${fmt(x.both)}`);
let nvp = 0;
const dump = {};
for (const x of XL) {
  const d = DK.get(x.key);
  console.log(`\nCELL PAIR ${x.f} | L ${x.a.desk} ${cellId(x.a)} | S ${x.b.desk} ${cellId(x.b)} | LIT ${fmt(x.both)} | DARK ${d ? fmt(d.both) : 0}`);
  for (const v of [...x.vp.values()].sort((p, q) => q.seeds.length - p.seeds.length || p.va - q.va || p.vb - q.vb)) {
    nvp++;
    const dv = d?.vp.get(`${v.va}x${v.vb}`);
    dump[`${x.key} || v${v.va}xv${v.vb}`] = v.seeds;
    console.log(`  VP v${v.va} x v${v.vb}${v.floor ? ' (floor)' : ''}: LIT ${fmt(v.seeds)} | DARK ${dv ? dv.seeds.length : 0} | ${v.seeds[0]}`);
    for (const [fk, n] of [...v.forms].sort((p, q) => q[1] - p[1])) console.log(`     ${n}x A: ${fk.slice(0, 700)}`);
  }
}
console.log(`\n(1) LIT VARIANT PAIRS: ${nvp}`);
if (process.env.OUT) writeFileSync(process.env.OUT, JSON.stringify({ sizeOf, vps: dump }));

for (const [M, X] of [['LIT', LIT], ['DARK', DARK]]) {
  const tt = X.tooth;
  console.log(`\n(2) ${M} TOOTH over ${N * SIZES.length}: OPPOSITE_PAIRS ${JSON.stringify(Object.fromEntries(Object.entries(tt.rows).map(([k, v]) => [k, v.slice(0, 5)])))}`);
  console.log(`  PINNED_OLD_WORDS ${JSON.stringify(Object.fromEntries(Object.entries(tt.old).map(([k, v]) => [k, v.slice(0, 5)])))}`);
  console.log(`  PINNED_TAILS printed ${JSON.stringify(Object.fromEntries(Object.entries(tt.tails).map(([k, v]) => [k, v.slice(0, 5)])))}`);
  for (const [k, v] of Object.entries(tt.heads)) console.log(`  HEAD ${k}: ${fmt(v)} | first ${SIZES.map((z) => v.find((sd) => sizeOf[sd] === z) || '-').join(' ')}`);
  for (const [k, v] of Object.entries(tt.sides)) console.log(`  SIDE ${k}: ${fmt(v)} | first ${SIZES.map((z) => v.find((sd) => sizeOf[sd] === z) || '-').join(' ')}`);
  for (const sd of ['dz-metropolis-6', 'dz-thorp-2', 'dz-thorp-3', 'dz-village-7']) console.log(`  CONTROL ${sd}: sides ${Object.entries(tt.sides).filter(([, v]) => v.includes(sd)).map(([k]) => k).join('; ') || 'none'} | heads ${Object.entries(tt.heads).filter(([, v]) => v.includes(sd)).map(([k]) => k).join('; ') || 'none'}`);
}

console.log('\n(3) THE FIVE RE-WORDED LINES: every printed form (mount :: form), LIT then DARK');
for (const [n] of FIVE) for (const [M, X] of [['LIT', LIT], ['DARK', DARK]]) {
  for (const [k, seeds] of [...X.five.get(n)].sort((p, q) => q[1].length - p[1].length)) {
    const other = (M === 'LIT' ? DARK : LIT).five.get(n);
    console.log(`  ${n} | ${M} | ${fmt(seeds)} | ${other.has(tier(k)) || other.has(k) ? 'BOTH' : `${M} ONLY`} | ${seeds.slice(0, 3).join(' ')}\n     ${k}`);
  }
}
console.log(`RUN ${((Date.now() - t0) / 1000).toFixed(1)}s, ${2 * N * SIZES.length} births`);
