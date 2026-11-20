// L2 corpus probe for COHERENCE-POWERS (seat 2). Usage: node l2.mjs <tree> <out.json> [part]
// parts: rand (six tiers, browser dials), forced (five stresses x six tiers). Default both.
import path from 'node:path';
import fs from 'node:fs';
const tree = path.resolve(process.argv[2]);
const out = process.argv[3];
const part = process.argv[4] || 'all';
const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const PS = await imp('src/domain/dossier/powerSupport.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const REP = await imp('src/generators/people/representatives.js');
const { isHideableHouse } = await imp('src/domain/people/cardVeil.js');
const { hallCaptureOf } = await imp('src/domain/people/hallCapture.js');
const { backingRowFor } = await imp('src/data/institutionBacking.js');
const { FACE_SEAT, faceOfInstitution, familyOfInstitution } = await imp('src/data/institutionalCatalog.js');
await loadGenerationLawPayloads();

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const KINDS = ['religious', 'military', 'merchant', 'arcane', 'noble', 'craft'];
const APPOINTED = ['Feudal Stewardship', 'Feudal Appointee', 'Noble Governorship', 'Ducal Governorship', 'Royal Authority',
  'Foreign Stewardship', 'Foreign Administration', 'Occupation Authority', 'Martial Administration', 'Noble Regency'];
const STRESS_POWERS = ['The Peerage', "People's Council", 'War Council', 'Resistance Network', 'Quarantine Council',
  'Occupation Authority', 'Reform Congregation'];
const ROSTER_OWN = ['Merchant Guilds', 'Craft Guilds', "Thieves' Guild", 'Arcane Orders', 'Religious Authorities',
  'Military/Guard', 'Military Party', 'Manor Household', 'Landed Gentry', 'Noble Houses', 'Noble Families'];

const kindOf = (card) => {
  const inst = card?.institution;
  if (!inst || inst.kind !== 'house') return 'office';
  const row = { name: inst.key };
  const family = familyOfInstitution(row);
  if (faceOfInstitution(row) === FACE_SEAT || family?.shelf === 'Government') return 'office';
  const backing = backingRowFor(inst.key);
  if (!backing) return 'unplaced';
  const top = Object.entries(backing.shares).sort((x, y) => y[1] - x[1])[0][0];
  return top === 'government' ? 'office' : top;
};

const corpus = [];
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
if (part === 'all' || part === 'rand') {
  const N = { thorp: 150, hamlet: 150, village: 60, town: 160, city: 100, metropolis: 40 };
  for (const t of TIERS) for (let i = 0; i < (process.env.QUICK ? 2 : N[t]); i++) corpus.push({ seed: `critique-${t}-${i}`, tier: t, part: 'rand', cfg: { ...DIALS, settType: t } });
}
if (part === 'all' || part === 'forced') {
  for (const st of (process.env.ALLSTRESS ? Object.keys((await imp('src/data/stressTypes.js')).STRESS_TYPE_MAP) : ['famine', 'wartime', 'under_siege', 'occupied', 'plague_onset']))
    for (const t of TIERS) for (let i = 0; i < 20; i++)
      corpus.push({ seed: `l2-${st}-${t}-${i}`, tier: t, part: `forced:${st}`, cfg: { ...DIALS, settType: t, selectedStresses: [st], selectedStressesRandom: false } });
}

const rows = [];
let n = 0;
for (const b of corpus) {
  const s = generateSettlementPipeline(birthConfig(b.cfg), null, { seed: b.seed, customContent: {} });
  const npcs = s.npcs || [];
  const rulerRow = governingFactionOf(s);
  const ruler = nameOf(rulerRow);
  const arch = rulerRow ? PS.backingArchetypeOf(rulerRow) : null;
  const three = npcs.map((c) => ({ c, r: (c.memberships || []).find((m) => m.power === ruler)?.rank }))
    .filter((x) => Number.isInteger(x.r)).sort((a, z) => a.r - z.r).map((x) => x.c);
  const g = [];
  if (!(APPOINTED.includes(ruler) || arch === 'criminal')) {
    if (!three[0]) g.push('noLeader');
    else if (kindOf(three[0]) === 'office') g.push(REP.dualHatHouseOf && REP.dualHatHouseOf(s.institutions, rulerRow) ? 'leaderIsOffice:houseStands' : 'leaderIsOffice:noHouseOfKind');
  }
  if (KINDS.includes(arch)) {
    const kin = npcs.filter((c) => kindOf(c) === arch && !c.institution?.veiled);
    if (kin.length && !three.some((c) => kindOf(c) === arch)) g.push('kindNotInThree');
    if (!npcs.some((c) => kindOf(c) === arch)) g.push('rulerKindNoHouseCard');
    if (!(s.institutions || []).some((h) => !isHideableHouse(h) && (REP.houseKindOf ? REP.houseKindOf(h) : null) === arch)) g.push('councilNoHouse');
  }
  const faceless = []; const houseless = [];
  for (const f of s.powerStructure?.factions || []) {
    const nm = nameOf(f);
    const fa = PS.backingArchetypeOf(f);
    const member = npcs.some((c) => (c.memberships || []).some((m) => m.power === nm));
    const housed = npcs.some((c) => c.institution?.kind === 'house' && (c.memberships || []).some((m) => m.power === nm && m.share > 0));
    const cause = f.isGoverning ? 'governing' : STRESS_POWERS.includes(nm) ? `stress:${nm}` : ROSTER_OWN.includes(nm) ? 'roster' : f.contestsNiche ? 'rival' : fa === 'criminal' ? 'criminal' : `other:${nm}`;
    if (!member) faceless.push({ nm, cause, arch: fa });
    if (!f.isGoverning && !housed && fa !== 'criminal') houseless.push({ nm, cause, arch: fa });
  }
  const hall = hallCaptureOf(s);
  const present = (s.powerStructure?.factions || []).map((f) => nameOf(f));
  const stresses = [].concat(s.stress || []).map((x) => x?.type).filter(Boolean);
  rows.push({ seed: b.seed, tier: b.tier, part: b.part, ruler, arch, g, faceless, houseless, capture: hall.state,
    stored: s.powerStructure?.criminalCaptureState ?? null, stresses, present, leader: three[0]?.name ?? null, leaderId: three[0]?.id ?? null });
  if (++n % 100 === 0) process.stderr.write(`${n}/${corpus.length}\n`);
}
fs.writeFileSync(out, JSON.stringify(rows));
console.log('births', rows.length);
