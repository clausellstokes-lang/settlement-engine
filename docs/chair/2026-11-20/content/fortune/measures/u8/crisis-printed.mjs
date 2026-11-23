// U8c measure (B), READ-ONLY (the chair's E112): of the places whose crisis has NO power of its own on the roster, in how
// many does a PRINTED sentence name that crisis's own power or its leader, by the roster's name for it?
// usage: node crisis-printed.mjs <tree> <dark|lit> <seedsPerCrisis> [sizes]
// The corpus is crisis-body.mjs's (`u8-<crisis>-<size>-<i>`, each crisis forced alone, the browser's dials may add one).
// A crisis's own powers (no source change at this tree, so the vocabulary is the measure's): a row of
// data/stressPowerFaces.js for the crisis (read through domain/people/stressPowerFaces.js :: stressPowerRowOf), the names
// stressFactions.js :: applyStressEventFactions pushes that no row names (WITHOUT_ROW), and the infiltrator (an `other`
// pool name pushed hidden). THE NEEDLES for a crisis that has none on the roster: every name that crisis can push (the
// rows' `power`, WITHOUT_ROW, and the role pools its pool-named pushes draw from: succession_void `noble`,
// politically_fractured and infiltrated `other`), each name's prose forms (data/people/powerSentenceName.js), and its
// leader's title (generators/people/mintTitles.js: SEAT_MINT_TITLES, OTHER_MINT_ROWS), as whole words (`needlesOf` says
// the case and the article of each kind); a needle a power ON the roster bears is that power's, so it is set aside.
// THE SURFACES READ: (1) the governance paragraph (domain/display/governanceAccount.js :: governanceAccountOf, the
// primary stress as the surfaces pass it); (2) every paragraph of the print prose, every tab and mount
// (domain/display/stateProse/printProse.js :: buildPrintProse: the power desk's state prose among them); (3) the stability
// line (powerStructure.stability); (4) the cast: every string on every card (s.npcs); (5) the roster's own descriptions
// (powerStructure.factions[].desc) and the relationships' strings (powerStructure.factionRelationships).
import { fileURLToPath } from 'node:url';
const T = process.argv[2]; const LIT = process.argv[3] === 'lit'; const N = Number(process.argv[4] || 10);
const SIZES = (process.argv[5] || 'thorp,hamlet,village,town,city,metropolis').split(',');
void fileURLToPath;
const imp = (p) => import(`${T}/${p}`);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { STRESS_POWER_FACES } = await imp('src/data/stressPowerFaces.js');
const { stressPowerRowOf } = await imp('src/domain/people/stressPowerFaces.js');
const { FACTION_DESCRIPTORS, FACTION_DESCRIPTORS_EXTRA } = await imp('src/data/powerData.js');
const { PROSE_FORMS } = await imp('src/data/people/powerSentenceName.js');
const { SEAT_MINT_TITLES, OTHER_MINT_ROWS } = await imp('src/generators/people/mintTitles.js');
const { governanceAccountOf, governanceStressTypesOf } = await imp('src/domain/display/governanceAccount.js');
const { resolvePrimaryStress } = await imp('src/generators/stressPriority.js');
const { buildPrintProse } = await imp('src/domain/display/stateProse/printProse.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const WITHOUT_ROW = { indebted: ["Creditor's Representative"], recently_betrayed: ['The Inquiry'], insurgency: ["Journeymen's League", 'Reform Movement'], mass_migration: ["Newcomers' Settlement", 'Departure Committee'], wartime: ['Peace Movement'], slave_revolt: ['Revolt Leadership', 'Abolitionist Network'] };
const POOLS = { succession_void: ['noble'], politically_fractured: ['other'], infiltrated: ['other'] };
const STRESSES = [...new Set([...STRESS_POWER_FACES.map((r) => r.stress), ...Object.keys(WITHOUT_ROW), 'infiltrated'])];
const poolNames = (c) => [...(FACTION_DESCRIPTORS[c] || []), ...(FACTION_DESCRIPTORS_EXTRA[c] || [])];
const ownOf = (t, f) => !!f && f.isGoverning !== true && (!!stressPowerRowOf({ stress: [{ type: t }] }, f)
  || (WITHOUT_ROW[t] || []).includes(f.faction)
  || (t === 'infiltrated' && f.hidden === true && f.category === 'other' && poolNames('other').includes(f.faction)));
const namesOf = (t) => [...new Set([...STRESS_POWER_FACES.filter((r) => r.stress === t && r.power).map((r) => r.power), ...(WITHOUT_ROW[t] || [])])];
const GENERIC = new Set(['the lord', 'the monarch']);
const bare = (n) => String(n).replace(/^the\s+/i, '').trim();
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** the needles of a crisis: [text, flags] — names and prose forms case-blind with the article optional; the role pools'
 *  names (a pool-named push takes the first unused) case-SENSITIVE, the primary pool only (the dedup pool's words are
 *  common nouns: "noble houses"); a leader's title WITH its article, case-blind ("the creditor's agent", never a bare noun) */
const needlesOf = (t) => {
  const out = [];
  for (const name of namesOf(t)) {
    out.push([bare(name), 'i']);
    if (PROSE_FORMS[name]) out.push([bare(PROSE_FORMS[name]), 'i']);
    for (const title of [SEAT_MINT_TITLES[name], OTHER_MINT_ROWS[name]?.title]) if (title && !GENERIC.has(title)) out.push([title, 'i']);
  }
  for (const c of POOLS[t] || []) for (const n of FACTION_DESCRIPTORS[c] || []) out.push([bare(n), '']);
  return out.filter(([n]) => n.length > 3);
};
const testOf = (needles) => {
  const res = needles.map(([n, f]) => new RegExp(`(?<![\\w])${f === 'i' && !/^the /i.test(n) ? '(?:the\\s+)?' : ''}${esc(n)}(?![\\w])`, f));
  return (sen) => res.some((re) => re.test(sen));
};
const strings = (v, acc = []) => { if (typeof v === 'string') acc.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, acc)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, acc)); return acc; };
const sentences = (t) => String(t).split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter(Boolean);
const typesOf = (s) => [...new Set((Array.isArray(s.stress) ? s.stress : [s.stress]).map((x) => (typeof x === 'string' ? x : x?.type)).filter(Boolean))];
const out = { tree: T, law: LIT ? 2 : 1, surfaces: ['governance', 'print', 'stability', 'cast', 'roster-desc', 'relationships'], perSize: {}, named: [] };
let total = 0, lacking = 0, printed = 0;
for (const tier of SIZES) {
  let l = 0, p = 0;
  for (const stress of STRESSES) for (let i = 0; i < N; i++) {
    const seed = `u8-${stress}-${tier}-${i}`;
    const base = birthConfig({ ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false });
    const s = generateSettlementPipeline(LIT ? { ...base, _fortuneLawVersion: 2 } : base, null, { seed, customContent: {} });
    total += 1;
    const ps = s.powerStructure || {}; const factions = ps.factions || [];
    const absent = typesOf(s).filter((t) => STRESSES.includes(t) && !factions.some((f) => ownOf(t, f)));
    if (!absent.length) continue;
    l += 1;
    const surfaces = {
      governance: [governanceAccountOf(s, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(s)) })?.text || ''],
      print: strings(buildPrintProse(s)),
      stability: [ps.stability || ''],
      cast: strings(s.npcs || []),
      'roster-desc': factions.map((f) => f.desc || ''),
      relationships: strings(ps.factionRelationships || []),
    };
    const hits = [];
    for (const t of absent) {
      const onRoster = new Set(factions.map((f) => String(f.faction || '').replace(/^the\s+/i, '').toLowerCase()));
      const needles = needlesOf(t).filter(([n]) => !onRoster.has(bare(n).toLowerCase())); // a name a power ON the roster bears is that power's
      if (!needles.length) continue;
      const hit = testOf(needles);
      for (const [surface, texts] of Object.entries(surfaces)) for (const txt of texts) for (const sen of sentences(txt)) if (hit(sen)) hits.push({ crisis: t, surface, sentence: sen });
    }
    if (hits.length) { p += 1; out.named.push({ seed, tier, absent, roster: factions.map((f) => f.faction), hits: hits.slice(0, 4) }); }
  }
  lacking += l; printed += p;
  out.perSize[tier] = { births: STRESSES.length * N, noPowerOfItsCrisis: l, printedNamesIt: p };
  console.error(tier, JSON.stringify(out.perSize[tier]));
}
out.total = { births: total, noPowerOfItsCrisis: lacking, printedNamesIt: printed };
console.error('TOTAL', JSON.stringify(out.total));
console.log(JSON.stringify(out, null, 1));
