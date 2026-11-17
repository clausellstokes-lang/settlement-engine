// BIRTH-AUDIT Q4 · R4 (THE SOURCE HOUSE KEPT AND READ AS WORKED OUT): for every live house of kind (ii) whose own ground
// is on the record but every one depleted (q2land.mjs's `depleted`), what the record ALSO says of that good: the imports'
// shortage line ("Dressed stone (local quarry depleted)"), an export naming the good, the made list naming it, an income
// share of the trade, the record's chains on that ground and their state, and how the mark reads it today.
//   node docs/chair/2026-11-17/birth/probes/q4r4.mjs <label>=<corpus.ndjson.gz> ... [> out.txt]
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
import { kindOf, groundsOf } from './kinds.mjs';
import { landOf } from './q2land.mjs';
const TREE = path.resolve(process.env.TREE || '.');
const F = await import(TREE + '/src/domain/facts/houseInputAtHand.js');
const { catalogIdForName } = await import(TREE + '/src/data/institutionalCatalog.js');
const load = (f) => zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => JSON.parse(l));
const arr = (x) => (Array.isArray(x) ? x : []);
const GOOD = { stone_quarry: /stone/i, charcoal_burner: /charcoal|fuel|timber/i, dairy_farmer: /dairy|cheese|butter|milk|livestock/i, salt_works: /salt/i, mine: /iron|ore|coal|gem|precious|metal/i, mine_open_cast: /iron|ore|coal|gem|precious|metal/i, peat_cutter: /peat/i, fisher_s_landing: /fish/i, fishing_community: /fish/i, hunter_s_lodge: /game|hide|fur/i, wildfowler: /fowl|game/i, shepherd: /wool|livestock/i, woodcutter_s_camp: /timber|wood/i };
const INCOME = { stone_quarry: /Stone/, salt_works: /Salt/, mine: /Iron|Ore|Precious|Coal/, mine_open_cast: /Iron|Ore|Precious|Coal/, charcoal_burner: /Timber|Coal/, fisher_s_landing: /Fish/, fishing_community: /Fish/ };
const tally = {}; const rows = [];
for (const a of process.argv.slice(2)) {
  const [label, file] = a.split('=');
  for (const { seed, s } of load(file)) {
    const short = F.housesShortOf(s), spentRead = F.housesOnSpentGround(s);
    const gapped = new Set(arr(s?.resourceAnalysis?.gaps).filter((g) => g?.kind === 'missing').map((g) => g.institution));
    const es = s.economicState || {};
    for (const inst of arr(s.institutions)) {
      if (!inst || typeof inst.name !== 'string' || inst.status === 'ruined') continue;
      const id = String(inst.catalogId || catalogIdForName(inst.name) || '');
      if (kindOf(id) !== 'ii' || landOf(s, id).land !== 'depleted') continue;
      const g = GOOD[id] || /./;
      const own = arr(es.activeChains).filter((c) => (groundsOf(id) || []).includes(c?.resourceKey) && arr(c?.processingInstitutions).includes(inst.name));
      const r = {
        pop: label, seed, id, house: inst.name,
        mark: short.has(inst.name) ? `Short of ${short.get(inst.name)}.` : '(none)',
        markReading: gapped.has(inst.name) ? 'a gap (no input)' : spentRead.has(inst.name) ? 'the spent ground' : short.has(inst.name) ? 'a trade good' : '-',
        shortageImport: arr(es.primaryImports).some((x) => g.test(x) && /depleted|exhausted|worked out|spent/i.test(x)),
        anyImport: arr(es.primaryImports).some((x) => g.test(x)),
        exportNamesIt: arr(es.primaryExports).some((x) => g.test(String(x))),
        madeNamesIt: arr(es.localProduction).some((x) => g.test(String(x))),
        incomeShare: INCOME[id] ? arr(es.incomeSources).some((x) => INCOME[id].test(String(x?.source ?? x))) : null,
        ownChainStates: own.map((c) => c.status),
      };
      rows.push(r);
      const k = `${label} · ${id}`; const t = (tally[k] ||= { houses: 0, marked: 0, byGap: 0, bySpent: 0, shortageImport: 0, anyImport: 0, exportNamesIt: 0, madeNamesIt: 0, incomeShare: 0, ownChainRunning: 0 });
      t.houses++; if (r.mark !== '(none)') t.marked++; if (r.markReading === 'a gap (no input)') t.byGap++; if (r.markReading === 'the spent ground') t.bySpent++;
      for (const f of ['shortageImport', 'anyImport', 'exportNamesIt', 'madeNamesIt', 'incomeShare']) if (r[f]) t[f]++;
      if (r.ownChainStates.some((x) => x && x !== 'impaired' && x !== 'dormant')) t.ownChainRunning++;
    }
  }
}
console.log('| population · house | on its own spent ground | marked | by a gap | by the spent ground | the shortage import | any import of it | an export names it | the made list names it | an income share | its own chain still running (state not impaired) |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|');
for (const [k, t] of Object.entries(tally).sort()) console.log(`| ${k} | ${t.houses} | ${t.marked} | ${t.byGap} | ${t.bySpent} | ${t.shortageImport} | ${t.anyImport} | ${t.exportNamesIt} | ${t.madeNamesIt} | ${t.incomeShare} | ${t.ownChainRunning} |`);
if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify(rows, null, 1));
