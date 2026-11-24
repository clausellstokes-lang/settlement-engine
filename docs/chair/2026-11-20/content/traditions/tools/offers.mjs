// (1) WHAT THE RECORD OFFERS: for each of the 16 elements, how many of the pool's towns hold a fitting
// house (KEEPER_HOUSES by element, then by the element's own acts not counted), a cause-carrying history or
// founding fact, a fitting power (the §6 archetype), a fitting trade (ECONOMY_FIT in the top three incomes).
import { readFileSync, writeFileSync } from 'node:fs';
import { TRADITION_ELEMENTS } from '../../../../../../src/data/traditionCorpus.js';
import { KEEPER_HOUSES, ECONOMY_FIT } from './describe.mjs';
import { factionArchetype, FACTION_ARCHETYPES as A } from '../../../../../../src/domain/factionArchetypes.js';
import { governingFactionOf, nameOf } from '../../../../../../src/domain/rulingPower.js';
import { isVeiledPower } from '../../../../../../src/domain/people/cardVeil.js';
const [, , poolFile, outFile] = process.argv;
const towns = readFileSync(poolFile, 'utf8').trim().split('\n').map(JSON.parse);
const DEAD = new Set(['great_fire', 'great_flood', 'plague_years', 'external_threat']);
const SEATED = new Set(['founding', 'first-landing', 'charter']);
const RELIG = new Set(['the-dead', 'stars']);
const out = ['# (1) what the record offers, per element, over the 432-town pool (counts are TOWNS)',
  'fields read: institutions[].name; history.founding.{age,foundedBy}; history.historicalEvents[].{templateType,name,yearsAgo}; powerStructure.factions[] (+ governingFactionOf); economicState.incomeSources[0..2].source', '',
  'element        house  history/founding(cause)  power  trade(top-3 income)'];
for (const el of TRADITION_ELEMENTS) {
  let house = 0, hist = 0, power = 0, trade = 0;
  for (const t of towns) {
    const insts = (t.institutions || []).filter((i) => i && typeof i.name === 'string' && !/^access to /i.test(i.name));
    if ((KEEPER_HOUSES.element[el.id] || []).some((r) => insts.some((i) => r.re.test(i.name)))) house++;
    if (SEATED.has(el.id) && Number.isFinite(Number(t.history?.founding?.age))) hist++;
    if (el.id === 'the-dead' && (t.history?.historicalEvents || []).some((e) => DEAD.has(e?.templateType))) hist++;
    const fs = (t.powerStructure?.factions || []).filter((f) => f && !isVeiledPower(f));
    if (SEATED.has(el.id)) { if (governingFactionOf(t)) power++; }
    else if (RELIG.has(el.id)) { if (fs.some((f) => factionArchetype(f) === A.RELIGIOUS)) power++; }
    else if (el.id === 'market') { if (fs.some((f) => [A.MERCHANT, A.CRAFT].includes(factionArchetype(f)))) power++; }
    const inc = (t.economicState?.incomeSources || []).slice(0, 3).map((i) => i?.source);
    if ((ECONOMY_FIT[el.id] || []).some((f) => inc.includes(f.source))) trade++;
  }
  out.push(`${el.id.padEnd(14)} ${String(house).padStart(5)}  ${String(hist).padStart(23)}  ${String(power).padStart(5)}  ${String(trade).padStart(19)}`);
}
out.push('', 'A blank table row is the table, not the record: hearth, long-sun and greening (bar the grove houses) have no authored house; only founding-kind elements and the dead carry a cause; powers are drawn for the seated, devotional and market kinds only (the engine\'s own §6 owner table, politics.js :: desiredArchetype), and by act besides (offering/vigil, fair, contest) — the act rows are not in this table.');
writeFileSync(outFile, `${out.join('\n')}\n`); console.log(out.join('\n'));
