// rungs.mjs <rows.jsonl> — the ladder rung each place's STORED recentConflict came from (deriveBaselineConflict's own
// conditions, matched by each rung's own words, twins and rewrites included); a sentence no rung says = overridden by stress.
import { readFileSync } from 'node:fs';
export const RUNGS = [
  ['stressFlags.stateCrime', /disappeared following a tax audit|stopped paying what they owe/],
  ['stressFlags.crimeIsGovt', /claim authority over the new market|resolving disputes between themselves rather than/],
  ['stressFlags.crusaderSynthesis && theocraticSeat', /heresy investigation into a rival|declared a neighbouring settlement heretical/],
  ['stressFlags.merchantArmy', /arrested a rival's factor|roughed up a rival's farmhand/],
  ['stressFlags.heresySuppression && theocraticSeat', /hedge wizard was dragged|summoned someone before the church court|asking questions about a local family's practices/],
  ['stressFlags.merchantCriminalBlur', /having each other's warehouses robbed|undercutting each other on/],
  ['neighbourRelationship', /^Relations with .* have soured/],
  ['institutionFlags.criminalEffective > 65', /merchants have been found murdered|stealing from the communal stores/],
  ['hasRoyalAuthority && hasNoblePower && priorities.military > 55', /military levies from the noble houses|recruiting its own soldiers beyond|last order took six weeks/],
  ['hasNoblePower && institutionFlags.economyOutput > 55 && hasLiveMarket', /outbuying noble landholdings|bought land the old landholding family|contesting a merchant's right to operate/],
  ['institutionFlags.militaryEffective > 68 && !seatIsMilitary', /pushing for expanded authority over|militia captain is pushing|strongest armed household (has started|is pushing)/],
  ['institutionFlags.religionInfluence > 68 && !seatIsReligious', /veto power over council appointments|approval rights over market day|most devout households want a say|insisting on a say in who can marry/],
  ['institutionFlags.economyOutput > 68', /rival guilds are contesting control|in dispute over prices and access|household that sells the most/],
  ["monsterThreat === 'plagued'", /Monsters prowl near the outlying farms|Monster attacks on the outlying farms|Farms nearby have been abandoned/],
  ['(hasCivicInstitution || hasUrbanCommerceInstitution) && hasLiveMarket [LEVIES]', /debating market levies/],
  ['hasMarketInstitution [FIELD ROTATION]', /field rotation and grazing rights/],
  ['default: noGrazingQuarrel || grazing [GRAZING]', /^A dispute over (grazing rights and water access|rights on .* and access to water|water access) has run/],
];
export const rungOf = (rc) => { for (const [k, re] of RUNGS) if (re.test(String(rc || ''))) return k; return 'OVERRIDDEN by a primary stress narrative'; };
if (process.argv[1].endsWith('rungs.mjs')) {
  const rows = readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const all = new Map();
  for (const s of SIZES) { const g = rows.filter((r) => r.size === s); const c = new Map(); for (const r of g) { const k = rungOf(r.rc); c.set(k, (c.get(k) || 0) + 1); all.set(k, 1); }
    const m = new Map(); for (const r of g) m.set(r.masked, (m.get(r.masked) || 0) + 1); const top = [...m].sort((a, b) => b[1] - a[1]);
    console.log(`== ${s} (n=${g.length}) top masked sentence ${top[0][1]}/${g.length}: ${top[0][0].slice(0, 90)}`);
    console.log(`   second ${top[1]?.[1]}: ${top[1]?.[0].slice(0, 90)} | distinct ${m.size}`);
    for (const [k, v] of [...c].sort((a, b) => b[1] - a[1])) console.log(`   ${String(v).padStart(3)}  ${k}`);
  }
  const un = rows.filter((r) => rungOf(r.rc).startsWith('OVERRIDDEN'));
  const um = new Map(); for (const r of un) { const k = r.masked.slice(0, 70); um.set(k, (um.get(k) || 0) + 1); }
  console.log('== overridden sentences (first 70 chars, all sizes)'); for (const [k, v] of [...um].sort((a, b) => b[1] - a[1])) console.log(`   ${String(v).padStart(3)}  ${k}`);
}
