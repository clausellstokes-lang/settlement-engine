// PLACE-1 · situationDesc MEASURE (2026-11-20). Births 100 places a size EXACTLY as the chair's census births them
// (docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs, at bca8c6fe3: the birth lines and the mask copied
// verbatim below) and writes one JSON row per place: the stored trade line (masked), its branch, and the facts a
// wording could say, read off the FINAL record; in `capture` mode also the trade lists as they stood at the writer
// (capture-hooks.mjs) and after the steps that touch them (the pipeline's own `onStep` observer).
//
//   node measure.mjs <repo> [n=100] [plain|capture] > rows-<mode>.json
//
// Read-only over src/: it imports src modules and writes nothing there.
import { register } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const [, , L, nArg = '100', mode = 'plain'] = process.argv;
if (mode === 'capture') register(pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), 'capture-hooks.mjs')));

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { canonExports, canonImports } = await import(`${L}/src/domain/canonicalAccessors.js`);
const { tradeListsAsPrinted } = await import(`${L}/src/domain/display/tradeListDisplay.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every branch of `prosperity.js :: situationDescOf`, in its order, by its opening words (twins included). */
export const BRANCHES = [
  ['siege', /^The market is shut and the caravans|^The caravans have stopped coming and nothing/],
  ['famine', /^Food is short, and those with grain/],
  ['occupied', /^The occupiers take their share/],
  ['indebted', /^Much of what the settlement takes in goes on its debts/],
  ['plague', /^Fear of the sickness and the quarantine/],
  ['fractured', /^Trading now means picking a way/],
  ['foodGap', /^Even with what is brought in, people here go short/],
  ['isolatedTooBig', /^The settlement is too big to live cut off/],
  ['isolatedMagic', /^Goods come and go by magic/],
  ['isolatedStateCrime', /^Those in power take so much/],
  ['isolatedHigh', /^Cut off as it is, the settlement runs itself well/],
  ['isolatedLow', /^With no outside trade, the settlement struggles/],
  ['isolatedMedium', /^The settlement feeds and supplies itself without outside trade/],
  ['theocratic', /^The church controls most economic activity/],
  ['merchantCrime', /^Trade is brisk, and it is hard to say/],
  ['stateCrime', /^On paper the settlement's trade looks healthy/],
  ['veryHigh', /^Trade is what this settlement lives on/],
  ['high', /^Trade is brisk, the guilds are well run/],
  ['low', /^Commerce is sluggish;/],
  ['veryLow', /^Little coin changes hands here/],
  ['blackMarket', /^Honest trade gets by, but a busy black market/],
  ['medium', /^Trade proceeds at an ordinary pace for a settlement of this size\.$/],
];
const branchOf = (s) => (BRANCHES.find(([, re]) => re.test(s)) || ['UNKNOWN'])[0];
const TWIN_OPENINGS = /^The caravans have stopped coming and nothing|What food is sold costs more|keep people from trading|^The church controls most economic activity\. Land and trade|Goods change hands at all hours|little is bought or sold and many crafts/;

const rows = [];
for (const size of SIZES) {
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    /** @type {any[]} */ const caps = [];
    /** @type {Record<string, any>} */ const snaps = {};
    if (mode === 'capture') {
      globalThis.__econCapture = (r, a) => caps.push({ exp: [...(r.primaryExports || [])], imp: [...(r.primaryImports || [])], sd: r.situationDesc, prosperity: r.prosperity, seedAtWriter: a[4]?._seed ?? null });
    }
    const onStep = mode === 'capture' ? (name, ctx) => {
      if (['generateEconomy', 'economyReconcilePass', 'generateNarratives', 'assembleSettlement'].includes(name)) {
        const e = ctx.economicState || {};
        snaps[name] = { exp: [...(e.primaryExports || [])], imp: [...(e.primaryImports || [])], sd: e.situationDesc, prosperity: e.prosperity, roster: ctx._rosterChangedAfterEconomy === true };
      }
    } : undefined;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {}, ...(onStep ? { onStep } : {}) });
    // the chair's mask, verbatim
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...names].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');

    const e = t.economicState || {};
    const sd = String(e.situationDesc || '');
    const f = factsOf(t);
    const water = f.water || {};
    const row = {
      size, i, seed,
      sd, masked: mask(sd), branch: branchOf(sd), twin: TWIN_OPENINGS.test(sd),
      prosperity: e.prosperity, prosperityStanding: e.prosperityStanding, tradeAccess: e.tradeAccess,
      econOut: e.compound?.economyOutput, crimeEff: e.compound?.criminalEffective,
      exports: canonExports(t).map(String), imports: canonImports(t).map(String),
      printed: (() => { const p = tradeListsAsPrinted(t); return { exports: p.exports, imports: p.imports, tradeStopped: p.tradeStopped }; })(),
      transit: Array.isArray(e.transit) ? e.transit.map(String) : [], isEntrepot: e.isEntrepot === true,
      complexity: e.economicComplexity, incomeTop: (e.incomeSources || []).slice(0, 3).map((x) => x?.source),
      foodLabel: e.foodSecurity?.label, growsMoreThanEats: e.foodSecurity?.foodRecord?.growsMoreThanEats === true,
      facts: {
        market: f.market, guild: f.guild, route: f.route, tier: f.tier, prosperity: f.prosperity, terrain: f.terrain,
        populationBand: f.populationBand, water: { navigable: water.navigable, coast: water.coast, river: water.river },
        crisisActive: f.crisis?.active,
      },
      stress: (t.config?.stressTypes || []).slice(),
    };
    if (mode === 'capture') { row.caps = caps; row.snaps = snaps; }
    rows.push(row);
  }
  process.stderr.write(`${size} done\n`);
}
console.log(JSON.stringify(rows));
