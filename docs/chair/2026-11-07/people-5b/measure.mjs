// PEOPLE-5B EDIT measurement (2026-11-07): the record's v2 shape over the soak births. Measure-only;
// PEOPLE-1's instrument (../people-1/measure.mjs, untouched) still reads the cards and the powers.
//   node docs/chair/2026-11-07/people-5b/measure.mjs <out.md> [from=0] [to=1000]
// Per tier: the schemaVersion, records still carrying the grouping `factions`, cards still carrying
// any of the five retired per-card fields, cards whose memberships name a power the record lacks,
// cards with no `institution` key, records carrying `migrationReports`, cards and powers at zero.
import { writeFileSync } from 'node:fs';
import { birth, ensureLaws } from '../../../../scripts/audit/soak-review/corpus.mjs';

const OLD = ['factionAffiliation', 'secondaryAffiliation', 'linkedFactionIds', 'factionGoal', 'densityRungRole'];
const [out, from = '0', to = '1000'] = process.argv.slice(2);
await ensureLaws();
const T = {};
for (let i = Number(from); i < Number(to); i += 1) {
  const s = birth(i).settlement;
  const t = (T[s.tier] ||= { n: 0, v2: 0, grouping: 0, cards: 0, oldFields: 0, strayPower: 0, noInstitution: 0, reports: 0, powers: 0, powersAtZero: 0 });
  t.n += 1;
  if (s.schemaVersion === 2) t.v2 += 1;
  if ('factions' in s) t.grouping += 1;
  if (s.migrationReports) t.reports += 1;
  const powers = new Set((s.powerStructure?.factions || []).map((f) => f.faction || f.name));
  const cards = (s.npcs || []).filter((n) => n && n.institution);
  for (const c of s.npcs || []) {
    if (OLD.some((k) => k in c)) t.oldFields += 1;
    if (!('institution' in c)) t.noInstitution += 1;
    if ((c.memberships || []).some((m) => !powers.has(m.power))) t.strayPower += 1;
  }
  t.cards += cards.length;
  for (const p of powers) { t.powers += 1; if (!cards.some((c) => (c.memberships || []).some((m) => m.power === p))) t.powersAtZero += 1; }
}
const rows = Object.entries(T).map(([tier, t]) => `| ${tier} | ${t.n} | ${t.v2} | ${t.grouping} | ${t.cards} | ${t.oldFields} | ${t.strayPower} | ${t.noInstitution} | ${t.reports} | ${t.powersAtZero}/${t.powers} |`);
writeFileSync(out, ['| tier | n | schema 2 | grouping kept | cards | cards with a retired field | memberships naming no power | cards with no institution key | records with migrationReports | powers at zero |', '|---|---|---|---|---|---|---|---|---|---|', ...rows, ''].join('\n'));
console.log(rows.join('\n'));
