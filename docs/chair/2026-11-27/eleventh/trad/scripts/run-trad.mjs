// node run-trad.mjs <bundle.mjs> <plan.json> <out.jsonl> [from] [to]
// Per plan row: born as the page battery births it (birthConfig(row.config), { seed, customContent: {} }); then the
// tree's own traditions readers: the drawn set (deriveFoundingTraditions), the owner's shown set (shownTraditionsOf, no
// custom traditions), the shared page's rows (sharedTraditionRowsOf), every drawn row's needs answered over the owner's
// facts and over the share's floor, the stamped public prose by site (hash), the owner's descriptions. Changes nothing.
import { readFileSync, appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const [BUNDLE, PLAN, OUT, FROM = '0', TO = '99999'] = process.argv.slice(2);
const B = await import(BUNDLE);
const sha = (v) => createHash('sha256').update(JSON.stringify(v ?? null)).digest('hex').slice(0, 16);
const BAND = { thorp: [1, 2], hamlet: [1, 2], village: [2, 2], town: [3, 3], city: [4, 5], metropolis: [5, 7], capital: [6, 8] };
await B.loadGenerationLawPayloads();
const plan = JSON.parse(readFileSync(PLAN, 'utf8')).slice(Number(FROM), Number(TO));
let n = 0;
for (const row of plan) {
  const t0 = Date.now();
  let line;
  try {
    const town = B.generateSettlementPipeline(B.birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const recordHash = sha(town);
    const facts = B.factsOf(town);
    const floor = { ...town, institutions: B.liveInstitutions(town).filter((i) => !B.isHideableHouse(i)).map(B.withoutFunction) };
    const ffacts = B.factsOf(floor);
    const drawn = B.deriveFoundingTraditions(town);
    const shown = B.shownTraditionsOf(town, []);
    const shownIds = new Set(shown.recs.map((r) => r.id));
    const shared = B.sharedTraditionRowsOf(town) || [];
    const sharedNames = new Set(shared.map((r) => r.name));
    const ownerDesc = B.describeTraditions(shown.recs, town, { audience: 'owner' }).map((d) => (d ? d.text : ''));
    let pp = null; let ppErr = null;
    try { pp = B.composePublicProse(town); } catch (e) { ppErr = String(e?.message || e).slice(0, 300); }
    const blocks = pp?.blocks || pp || {};
    const ppKeys = Object.fromEntries(Object.keys(blocks).sort().map((k) => [k, sha(blocks[k])]));
    const cfg = town.config || {};
    line = {
      seed: row.seed, size: row.size, tier: town.tier, gv: town.generatorVersion, recordHash, ms: 0,
      band: BAND[town.tier] || null, cap: B.traditionCountCap(town), preview: shown.preview, mirror: Array.isArray(town.traditions) ? town.traditions.length : null,
      water: { cfg: B.waterAccessKind(B.resolveTerrain(cfg), typeof cfg.tradeRouteAccess === 'string' ? cfg.tradeRouteAccess : null), rec: facts.water?.kind, terrainCfg: B.resolveTerrain(cfg), routeCfg: cfg.tradeRouteAccess },
      fieldRefused: B.fieldRiteRefused(town),
      drawn: drawn.map((r) => {
        const needs = B.motifNeeds(r);
        return {
          id: r.id, el: r.coreMotif.element, act: r.coreMotif.act, name: r.name, needs,
          owner: Object.fromEntries(needs.map((a) => [a, B.atomHolds(a, facts) ?? null])),
          floor: Object.fromEntries(needs.map((a) => [a, B.atomHolds(a, ffacts) ?? null])),
          shown: shownIds.has(r.id), shared: sharedNames.has(r.name),
        };
      }),
      shownN: shown.recs.length, sharedN: shared.length,
      ownerRows: shown.recs.map((r, i) => ({ id: r.id, name: r.name, desc: ownerDesc[i] })),
      sharedRows: shared.map((r) => ({ name: r.name, when: r.when, text: r.text })),
      ppKeys, ppErr,
    };
    line.ms = Date.now() - t0;
  } catch (e) {
    line = { seed: row.seed, size: row.size, error: String(e?.stack || e).slice(0, 1500) };
  }
  appendFileSync(OUT, `${JSON.stringify(line)}\n`);
  n++;
  if (n % 50 === 0) console.log(`${new Date().toISOString()} ${n}/${plan.length} ${row.seed} ${line.ms}ms rss ${(process.memoryUsage().rss / 1e9).toFixed(2)}GB`);
}
console.log('done', n);
process.exit(0);
