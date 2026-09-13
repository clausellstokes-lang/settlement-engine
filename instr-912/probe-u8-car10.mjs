// probe-u8-car10.mjs — U8 RE-TAKEN WITH ITS GROUND NAMED (car 10, correction 37). Walks the
// shipped corpus twice against ONE named settlement's derived table: once with the three
// partially-filled columns forced CLOSED (car 4's shape) and once OPEN (car 9's cure), and
// counts failing entries and flipped verdicts. READ-ONLY.
import { pathToFileURL } from 'node:url';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneINSTR';
const imp = (p) => import(pathToFileURL(`${D}/${p}`).href);
const { walkEntry, verdictOf } = await imp('src/domain/prose/entryWalker.js');
const { settlementGround } = await imp('src/domain/prose/entryGround.js');
const { institutionTableOf } = await imp('src/domain/institutions/institutionTable.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadStateLeaves, loadCrierVoice, loadInFunctionNarratives } = await imp('tests/helpers/dossierCorpus.js');
const { QUANTITY_BANDS } = await imp('src/domain/worldPulse/demographicsHerald.js');

const corpus = [...await loadStateLeaves(), ...await loadCrierVoice(), ...loadInFunctionNarratives()];
console.log('corpus entries', corpus.length);
const bandOf = (n) => { const rows = QUANTITY_BANDS; const hit = rows.find((r) => n <= (r.max ?? Infinity)); return hit ? (hit.word ?? hit.label ?? String(hit)) : 'a few'; };
const THREE = ['whatItCounts', 'whatItDoes', 'whatItDoesNotDo'];
for (const seed of ['census-town', 'census-hamlet', 'census-city']) {
  const s = generateSettlementPipeline({ settType: seed.split('-')[1], culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' }, null, { seed, customContent: {} });
  const table = institutionTableOf(s, { bandOf });
  const shaped = (flag) => {
    const cols = {};
    for (const [k, v] of Object.entries(table.columns)) cols[k] = THREE.includes(k) ? { ...v, closed: flag } : v;
    return settlementGround({ ...table, columns: cols });
  };
  const closed = shaped(true);
  const open = shaped(false);
  let failClosed = 0; let failOpen = 0; let both = 0; let flips = 0;
  for (const e of corpus) {
    const a = walkEntry(e, closed); const b = walkEntry(e, open);
    const fa = a.fails.length > 0; const fb = b.fails.length > 0;
    if (fa) failClosed += 1;
    if (fb) failOpen += 1;
    if (fa && fb) both += 1;
    if (verdictOf(a) !== verdictOf(b)) flips += 1;
  }
  console.log(`seed ${seed}: shipped flags ${THREE.map((k) => `${k}=${table.columns[k].closed}`).join(' ')}`);
  console.log(`   failing with the three CLOSED ${failClosed} · with the three OPEN ${failOpen} · failing on BOTH ${both} · verdicts that FLIP ${flips}`);
}
