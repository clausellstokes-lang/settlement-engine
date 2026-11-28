// node analyze-d.mjs <D-X.jsonl> <label> <out.json> : the (D) counts for one corpus
import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import readline from 'node:readline';
const [FILE, LABEL, OUT] = process.argv.slice(2);
const BUNDLE = readFileSync(process.argv[5], 'utf8').split('\n');
const MODMAP = JSON.parse(readFileSync(process.argv[6], 'utf8'));
const NEW = { T: 'Quillmarsh', P: 'Odalric Venn', H: 'Greywater Hall', F: 'The Ashen Compact' };

const siteCache = new Map();
/** bundle line -> 'module :: function' */
function siteOf(line) {
  if (siteCache.has(line)) return siteCache.get(line);
  let mod = '?';
  for (const [l, m] of MODMAP) { if (l <= line) mod = m; else break; }
  let fn = '?';
  for (let i = line - 1; i >= 0 && i > line - 4000; i--) {
    const s = BUNDLE[i];
    const m = /^\s*(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/.exec(s) || /^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/.exec(s) || /^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*function/.exec(s);
    if (m) { fn = m[1]; break; }
    if (/^\/\/ (\.\.\/)*/.test(s)) break;
  }
  const r = `${mod.replace(/^.*?src\//, 'src/')} :: ${fn.replace(/\d+$/, '')}`;
  siteCache.set(line, r);
  return r;
}
const GENERIC = /src\/(kernel\/proseHash|domain\/facts\/drawDeclared)\.js/;
/** the first frame outside the generic pickers */
function callSite(frames) {
  const ls = String(frames).split(',').map(Number).filter(Boolean);
  for (const l of ls) { const s = siteOf(l); if (!GENERIC.test(s)) return s; }
  return ls.length ? siteOf(ls[0]) : '?';
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function renamer(oldName, neu) {
  // a line's NORMAL FORM: both names (and a person's first and last names) to one token, the article before it dropped,
  // case folded: two lines that differ only by the name printed are the same line
  const toks = [];
  const strip0 = (x) => String(x).replace(/^the\s+/i, '');
  const o = strip0(oldName).split(/\s+/); const n = strip0(neu).split(/\s+/);
  const strip = (x) => String(x).replace(/^the\s+/i, '');
  const slug = (x) => strip(x).toLowerCase().replace(/[^a-z0-9]+/g, '_');
  toks.push([String(neu).toLowerCase().replace(/[^a-z0-9]+/g, '_'), '⟨N⟩'], [String(oldName).toLowerCase().replace(/[^a-z0-9]+/g, '_'), '⟨N⟩'], [slug(neu), '⟨N⟩'], [slug(oldName), '⟨N⟩'], [strip(neu), '⟨N⟩'], [strip(oldName), '⟨N⟩']);
  if (o.length >= 2 && n.length >= 2) toks.push([n[0], '⟨F⟩'], [o[0], '⟨F⟩'], [n[n.length - 1], '⟨L⟩'], [o[o.length - 1], '⟨L⟩']);
  return (line) => { let x = String(line).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'); for (const [a, b] of toks) x = x.replace(new RegExp(esc(a), 'gi'), b); return x.replace(/the[\s_]+(⟨N⟩)/gi, '$1').toLowerCase(); };
}
const has = (line, nm) => new RegExp(esc(nm), 'i').test(line);

const R = { label: LABEL, births: 0, errors: 0, byVar: {} };
for (const k of ['T', 'P', 'H', 'F']) R.byVar[k] = { births: 0, skipped: 0, pagesMoved: 0, pagesRedealt: 0, linesMoved: 0, linesNameOnly: 0, linesRedealt: 0, redealtByView: {}, pickSites: {}, examples: {}, lineExamples: [] };
R.share = { births: 0, sharePagesMoved: 0, shareRedealt: 0, ownerShareNewDiff: 0, ownerShareNewDiffLines: 0, byView: {}, examples: [], sharePickSites: {} };
R.baseShare = { pagesDiffer: 0 };

const rl = readline.createInterface({ input: createReadStream(FILE), crlfDelay: Infinity });
for await (const l of rl) {
  if (!l) continue;
  const j = JSON.parse(l);
  if (j.error) { R.errors++; continue; }
  R.births++;
  const basePicks = j.picks.map((p) => p.split('\t'));
  if (!j.vars) continue;
  for (const [k, v] of Object.entries(j.vars)) {
    const S = R.byVar[k];
    if (v.skip) { S.skipped++; continue; }
    S.births++;
    const back = renamer(v.old, v.neu);
    let moved = 0; let redealt = 0;
    const baseByNormView = new Map();
    for (const [view, ls] of Object.entries(j.views)) { const nv = back(view); const set = baseByNormView.get(nv) || new Set(); for (const x of ls) set.add(back(x)); baseByNormView.set(nv, set); }
    for (const [view, d] of Object.entries(v.diff)) {
      const goneSet = new Set(d.gone.map(back));
      const baseSet = baseByNormView.get(back(view)) || new Set();
      const cameN = new Set(d.came.map(back));
      for (const c of d.came) {
        moved++;
        const b = back(c);
        if (goneSet.has(b) || baseSet.has(b)) { S.linesNameOnly++; continue; }
        redealt++;
        S.redealtByView[view] = (S.redealtByView[view] || 0) + 1;
        if (S.lineExamples.length < 60) S.lineExamples.push({ seed: j.seed, view, came: c.slice(0, 400), gone: d.gone.filter((g) => !cameN.has(back(g))).slice(0, 3).map((g) => g.slice(0, 400)) });
      }
    }
    S.linesMoved += moved; S.linesRedealt += redealt;
    if (moved) S.pagesMoved++;
    if (redealt) S.pagesRedealt++;
    // pick attribution: a base pick at a site whose key held the old name; the variant's pick at the same site with the
    // renamed key; moved when the chosen line differs
    const varPicks = v.picks.map((p) => p.split('\t'));
    const vIndex = new Map();
    for (const [kind, fr, key, ch] of varPicks) { const s = callSite(fr); vIndex.set(`${kind}|${s}|${key}`, ch); }
    const seenSite = new Set();
    for (const [kind, fr, key, ch] of basePicks) {
      if (!has(key, v.old)) continue;
      const s = callSite(fr);
      const site = `${kind} ${s}`;
      const P = (S.pickSites[site] ||= { picksWithName: 0, pagesWithName: 0, moved: 0, pagesMoved: 0, keyExample: null, ex: null });
      P.picksWithName++;
      if (!seenSite.has(`${site}|w`)) { seenSite.add(`${site}|w`); P.pagesWithName++; }
      if (!P.keyExample) P.keyExample = key;
      const nk = key.replace(new RegExp(esc(v.old), 'g'), v.neu);
      const nch = vIndex.get(`${kind}|${s}|${nk}`);
      if (nch === undefined) continue; // not re-called with the renamed key (moved site or gone)
      if (kind === 'FNV') { if (nch !== ch) { /* a raw hash always moves with its key */ P.moved++; if (!seenSite.has(site)) { seenSite.add(site); P.pagesMoved++; } } continue; }
      if (nch !== ch) { P.moved++; if (!seenSite.has(site)) { seenSite.add(site); P.pagesMoved++; } if (!P.ex) P.ex = { seed: j.seed, key, before: ch, keyAfter: nk, after: nch }; }
    }
    if (k === 'T' && v.shareDiff) {
      const Sh = R.share; Sh.births++;
      if (Object.keys(v.shareDiff).length) Sh.sharePagesMoved++;
      let shRe = 0;
      for (const [view, d] of Object.entries(v.shareDiff)) {
        const goneSet = new Set(d.gone.map(back)); const baseSet = new Set((j.shareViews[view] || []).map(back));
        for (const c of d.came) { const b = back(c); if (!goneSet.has(b) && !baseSet.has(b)) shRe++; }
      }
      if (shRe) Sh.shareRedealt++;
      // owner vs share AFTER the rename, less the differences the two already had before it
      const baseDiffKey = new Set();
      for (const [view, d] of Object.entries(j.baseOwnerVsShare || {})) {
        if (/^(PDF|Foundry|Tonight|Session)\//.test(view)) continue; for (const g of d.gone) baseDiffKey.add(`${view}|o|${back(g)}`); for (const c of d.came) baseDiffKey.add(`${view}|s|${back(c)}`); }
      let newDiff = 0;
      for (const [view, d] of Object.entries(v.ownerVsShare)) {
        if (/^(PDF|Foundry|Tonight|Session)\//.test(view)) continue; // the non-DOM surfaces are the owner's alone: not a page the share renders
        for (const g of d.gone) { if (!baseDiffKey.has(`${view}|o|${back(g)}`)) { newDiff++; Sh.byView[view] = (Sh.byView[view] || 0) + 1; if (Sh.examples.length < 20) Sh.examples.push({ seed: j.seed, view, ownerOnly: g.slice(0, 300) }); } }
        for (const c of d.came) { if (!baseDiffKey.has(`${view}|s|${back(c)}`)) { newDiff++; Sh.byView[view] = (Sh.byView[view] || 0) + 1; if (Sh.examples.length < 20) Sh.examples.push({ seed: j.seed, view, shareOnly: c.slice(0, 300) }); } }
      }
      if (newDiff) Sh.ownerShareNewDiff++;
      Sh.ownerShareNewDiffLines += newDiff;
      for (const [kind, fr, key] of (v.sharePicks || []).map((p) => p.split('\t'))) { if (has(key, v.neu)) { const s = `${kind} ${callSite(fr)}`; Sh.sharePickSites[s] = (Sh.sharePickSites[s] || 0) + 1; } }
    }
  }
  if (j.baseOwnerVsShare && Object.keys(j.baseOwnerVsShare).length) R.baseShare.pagesDiffer++;
}
writeFileSync(OUT, JSON.stringify(R, null, 1));
for (const [k, S] of Object.entries(R.byVar)) {
  console.log(`${LABEL} ${k}: births ${S.births} skip ${S.skipped} | pages moved ${S.pagesMoved}, re-dealt ${S.pagesRedealt} | lines moved ${S.linesMoved}: name-only ${S.linesNameOnly}, re-dealt ${S.linesRedealt}`);
  for (const [s, P] of Object.entries(S.pickSites).sort((a, b) => b[1].moved - a[1].moved)) console.log(`   ${s}: pages w/ name ${P.pagesWithName}, picks ${P.picksWithName}, moved ${P.moved} on ${P.pagesMoved} pages  e.g. ${P.keyExample}`);
}
console.log('share', JSON.stringify({ ...R.share, examples: undefined, byView: undefined }), JSON.stringify(R.share.byView).slice(0, 600));
