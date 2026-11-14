// REVIEW-W2-C-LEAVES leaves.mjs: TREE=<worktree> RECS=<records dir> OUT=<out.jsonl> [SEEDS=<file>] node leaves.mjs
// For every rendered record (the town as the page saw it), the stage's lines as the TREE's own readers compose them,
// beside the facts each is read against: one JSON row per town.
import fs from 'node:fs';
const T = process.env.TREE + '/src';
const tl = await import(T + '/domain/display/tradeListDisplay.js');
const cs = await import(T + '/domain/display/chainStateShown.js');
const cn = fs.existsSync(T + '/domain/display/chainNeedShown.js') ? await import(T + '/domain/display/chainNeedShown.js') : null;
const vp = await import(T + '/domain/display/validationOnPage.js');
const dd = await import(T + '/domain/display/defenseDisplay.js');
const inst = await import(T + '/domain/facts/institutions.js');
const { crisisOf } = await import(T + '/domain/facts/crisisKind.js');
const seeds = process.env.SEEDS ? fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n')
  : fs.readdirSync(process.env.RECS).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
const out = fs.createWriteStream(process.env.OUT);
for (const seed of seeds) {
  const f = `${process.env.RECS}/${seed}.json`; if (!fs.existsSync(f)) continue;
  const s = JSON.parse(fs.readFileSync(f, 'utf8')); const eco = s.economicState || {};
  const row = { seed, tier: s.tier, pop: s.population, name: s.name, crisis: crisisOf(s).types, kinds: crisisOf(s).kinds, fams: crisisOf(s).families, route: eco.tradeAccess,
    roster: inst.liveInstitutionNames(s), nearby: s.config?.nearbyResources || [],
    rawExports: eco.primaryExports || [], rawImports: eco.primaryImports || [], rawLocal: eco.localProduction || [],
    blockaded: eco.foodSecurity?.stockpile?.blockaded ?? null, magicExists: s.config?.magicExists ?? null,
    traditions: s.defenseProfile?.traditions || null };
  try { row.trade = tl.tradeListsAsPrinted ? tl.tradeListsAsPrinted(s) : null; } catch (e) { row.tradeErr = e.message; }
  row.chains = (eco.activeChains || []).map((c, i) => {
    let shown = null, need = null, outs = null;
    try { shown = cs.chainAsShown ? cs.chainAsShown(c, s).status : c.status; } catch (e) { shown = 'ERR ' + e.message; }
    try { need = cn ? cn.chainNeedLine(c, s, i === 0) : null; } catch (e) { need = 'ERR ' + e.message; }
    try { outs = tl.chainOutputsShown ? tl.chainOutputsShown(c, s) : c.outputs; } catch (e) { outs = 'ERR ' + e.message; }
    return { id: c.chainId, name: c.name || c.label, raw: c.status, shown, resource: c.resource, input: c.resourceInputKey,
      houses: c.processingInstitutions, outputs: c.outputs, outsShown: outs, entrepot: c.entrepot === true, dep: c.dependency || null, need, magicNote: c.magicNote || null };
  });
  try { row.gaps = vp.resourceGapLines(s); } catch (e) { row.gapsErr = e.message; }
  try { const g = vp.exploitationGroupsShown ? vp.exploitationGroupsShown(s) : null; row.exploit = g && Object.fromEntries(Object.entries(g).map(([k, v]) => [k, v.map((x) => ({ r: x.card.rawResource, moved: x.moved, filed: x.filed, houses: x.card.processingInstitutions, needs: vp.housesStillNeeded(s, x.card.processingInstitutions) }))])); } catch (e) { row.exploitErr = e.message; }
  try { const cr = dd.deriveCriminalStructure(s); row.crime = cr && { key: cr.key, note: cr.note }; } catch (e) { row.crimeErr = e.message; }
  row.factions = (s.powerStructure?.factions || []).map((x) => ({ n: x.name, c: x.category, g: x.isGoverning === true }));
  row.food = eco.foodSecurity ? { need: eco.foodSecurity.dailyNeed, prod: eco.foodSecurity.dailyProduction, imp: eco.foodSecurity.importCoverage, magic: eco.foodSecurity.magicOffset, deficit: eco.foodSecurity.deficit, pct: eco.foodSecurity.deficitPct, rec: eco.foodSecurity.foodRecord && { failed: eco.foodSecurity.foodRecord.failedSource, months: eco.foodSecurity.foodRecord.storageMonths, normalImportPct: eco.foodSecurity.foodRecord.normalImportPct } } : null;
  out.write(JSON.stringify(row) + '\n');
}
out.end();
