// BIRTH-2 census probe: TREE=<tree> node story.mjs <corpus.ndjson.gz> [label]
// Reads every stored town through the tree's own readers; prints the counts the hand-back needs.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R = process.env.TREE + '/src';
const RS = await import(R + '/domain/resourceSemantics.js');
const has = (p) => fs.existsSync(R + p);
const HI = await import(R + '/domain/facts/houseInputAtHand.js');
const SS = has('/domain/facts/supplyStory.js') ? await import(R + '/domain/facts/supplyStory.js') : null;
const HK = await import(R + '/domain/facts/houseKinds.js');
const CSR = await import(R + '/domain/display/crisisStoppedRow.js');
const VP = await import(R + '/domain/display/validationOnPage.js');
const { liveInstitutions } = await import(R + '/domain/institutions/institutionRoster.js');
const { catalogIdForName } = await import(R + '/data/institutionalCatalog.js');
const { hasTradeRouteConnection } = await import(R + '/domain/tradeRouteSemantics.js');
const file = process.argv[2];
const rl = readline.createInterface({ input: fs.createReadStream(file).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const C = { towns: 0, venture: [], ventureKind: {}, implied: {}, impliedTowns: 0, stories: {}, storyTowns: {}, marks: 0, marksCalm: 0, c1: [], burnerPair: [], idleBesideWord: [], neverNoBuy: {}, shortNoCause: 0, tiers: {} };
const idOf = (i) => String(i.catalogId || catalogIdForName(i.name) || '');
const struck = (x) => String(x).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const FAMW = { timber: 'timber', livestock: 'livestock', desertSalt: 'salt', ironOre: 'iron ore', stone: 'dressed stone', peat: 'reeds, peat, and marsh herbs' };
for await (const line of rl) {
  if (!line) continue; const { seed, s } = JSON.parse(line); C.towns++;
  const tier = s.tier; const route = s.config?.tradeRouteAccess; const connected = hasTradeRouteConnection(String(route));
  const besieged = (s.config?.stressTypes || []).includes('under_siege'); const calm = seed.startsWith('r2r-') && !besieged; // census: r2r towns carry no crisis by name
  const imports = (s.economicState?.primaryImports || []).map(String);
  // marks
  const short = HI.housesShortOf(s); C.marks += short.size; if (calm && connected) C.marksCalm += short.size;
  // stories
  const v = HI.ventureHouseOf ? HI.ventureHouseOf(s) : null;
  if (v) { C.venture.push(`${seed}:${v.name}:${v.venture}`); inc(C.ventureKind, `${v.id}:${v.venture}`); }
  if (SS) {
    const imp = SS.impliedGroundsOf(s); if (imp.states.size) C.impliedTowns++;
    for (const [g, st] of imp.states) inc(C.implied, `${g}:${st}`);
  }
  const towns = new Set();
  for (const inst of liveInstitutions(s)) {
    if (!inst || inst.isCustom) continue; const id = idOf(inst);
    if (!Object.prototype.hasOwnProperty.call(HK.SOURCE_GROUNDS, id)) continue;
    let st = SS ? SS.sourceStoryOf(s, inst, RS.resourceShortageImport) : null;
    let story = v && v.name === inst.name ? 'abandoned' : st ? st.story : 'none';
    const k = `${id}:${story}:${connected ? 'conn' : 'isol'}${besieged ? ':siege' : ''}`; inc(C.stories, k); if (!towns.has(k)) { towns.add(k); inc(C.storyTowns, k); }
    // c1: a taker fed by an import (the reader answers imported for a taker)
    if (HK.TAKERS ? HK.TAKERS.has(id) : HI && ['stone_quarry','mine','mine_open_cast','peat_cutter'].includes(id)) {
      for (const key of ['stone', 'ironOre', 'fish', 'timber', 'mountainTimber', 'livestock']) {
        const r = HI.houseInputAtHand(s, key, inst, { rawResource: HI.CHAIN_RAW_INPUT[key] });
        if (r === 'imported' && short.has(inst.name) === false && (story === 'idle')) { C.c1.push(`${seed}:${inst.name}:${key}`); break; }
      }
    }
    if (story === 'idle' && st && st.ground && !(HK.TAKERS && HK.TAKERS.has(id))) {
      const w = HK.RUNS_ON_BOUGHT?.[id]; if (w && imports.some((x) => struck(x) === struck(w))) C.idleBesideWord.push(`${seed}:${inst.name}`);
    }
    if (story === 'idle' && st && !st.ground) inc(C.neverNoBuy, id);
  }
  // the burner pair: "No timber reaches the charcoal burner." beside a "Timber" import
  const lines = VP.resourceGapLines(s).map((l) => l.impact);
  if (lines.some((l) => /^No timber reaches the charcoal burner\./.test(l)) && imports.some((x) => /^timber/i.test(x))) C.burnerPair.push(seed);
}
C.ventureTowns = C.venture.length;
console.log(JSON.stringify(C, null, 1));
