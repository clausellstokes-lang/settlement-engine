// R5C2's MEASURE (3) (E92 (3)): on born pages, split by the two writers. (i) the BASELINE writer's places
// (governanceNarrative.js :: buildGovernanceLabels): is the stored sentence reproduced from the SERVED document (the key
// itself withheld) by the writer over the served powers, houses, config, stress and food record? (ii) the TRANSFER's places
// (rulingPower.js :: transferRulingPower): how many are born, and what the served document carries of one.
// Candidate reader: `rederive` below, the shape pageRederive.js :: rederiveRecentConflict takes.
const W = '/home/user/wt/r5c/src';
const { generateSettlementPipeline } = await import(`${W}/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${W}/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${W}/store/configSlice.js`);
const { isHideableHouse } = await import(`${W}/domain/people/cardVeil.js`);
const veil = await import(`${W}/domain/display/galleryVeil.js`);
const { buildGovernanceLabels } = await import(`${W}/generators/power/governanceNarrative.js`);
const { getInstFlags, getPriorities, getStressFlags } = await import(`${W}/generators/helpers.js`);
const { isMaterializedCustomContent, nativeSemanticNames } = await import(`${W}/domain/content/customContentSemanticAuthority.js`);
const { defenseFactsOf } = await import(`${W}/domain/defense/defenseFacts.js`);
const { noGrazingQuarrelOf } = await import(`${W}/data/powerSiblings.js`);
const { boycottReadsRelation } = await import(`${W}/generators/factionDynamics.js`);
const { isAdversarialRelationship } = await import(`${W}/domain/relationships/canonicalRelationship.js`);
const { generatePowerStructure } = await import(`${W}/generators/power/rulingStructure.js`);
const VARIANT = process.env.R5C2_VARIANT || 'A';
const BIRTH_DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
await loadGenerationLawPayloads();
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const listOf = (v) => (Array.isArray(v) ? v : []);
const clone = (v) => JSON.parse(JSON.stringify(v));
const N = Number(process.env.R5C2_N || 40);

/** VARIANT B: the power generator itself (draw-free: its one draw needs no seat) over the served document. */
function rederiveB(s) {
  const config = s.config;
  if (!isRec(config) || !isRec(s.powerStructure)) return { why: 'no config or powers' };
  const entries = listOf(s.stressors).length ? listOf(s.stressors) : isRec(s.stress) ? [s.stress] : listOf(s.stress);
  const nb = s.neighborRelationship ?? config.neighborRelationship;
  const neighbourRelationship = isRec(nb) && isAdversarialRelationship(nb.relationshipType) ? nb : null;
  try {
    return { v: generatePowerStructure(s.tier, s.economicState || {}, neighbourRelationship, config, listOf(s.institutions).filter(isRec), { stressEntries: entries }).recentConflict };
  } catch (err) { return { why: `threw ${String(err).slice(0, 80)}` }; }
}
/** VARIANT C: B over the houses the power step stood on (a house the coherence pass repaired in later, `source:
 * 'coherence_repair', is not one of them). */
function rederiveC(s) { return rederiveB({ ...s, institutions: listOf(s.institutions).filter((h) => !(isRec(h) && h.source === 'coherence_repair')) }); }
function rederive(s) { return VARIANT === 'C' ? rederiveC(s) : VARIANT === 'B' ? rederiveB(s) : rederiveA(s); }
function rederiveA(s) {
  const config = s.config; const ps = s.powerStructure;
  if (!isRec(config) || !isRec(ps) || !Array.isArray(ps.factions)) return { why: 'no config or powers' };
  const institutions = listOf(s.institutions).filter(isRec);
  const native = institutions.filter((i) => !isMaterializedCustomContent(i));
  const instNames = nativeSemanticNames(native).map((n) => n.toLowerCase());
  const factions = ps.factions.filter((f) => isRec(f) && typeof f.faction === 'string');
  const seat = factions.find((f) => f.isGoverning)?.faction ?? null;
  const entries = listOf(s.stressors).length ? listOf(s.stressors) : isRec(s.stress) ? [s.stress] : listOf(s.stress);
  const stressTypes = Array.isArray(config.stressTypes) ? config.stressTypes : entries.map((e) => e?.type).filter(Boolean);
  const nb = s.neighborRelationship ?? config.neighborRelationship;
  const neighbourRelationship = isRec(nb) && isAdversarialRelationship(nb.relationshipType) ? nb : null;
  const e = s.economicState;
  const instFlags = getInstFlags(config, institutions);
  const { recentConflict } = buildGovernanceLabels({
    factions, config, stressFlags: getStressFlags(config, institutions),
    instFlags: { ...instFlags, garrisonStands: defenseFactsOf({ institutions: native }).hasGarrison, noGrazingQuarrel: noGrazingQuarrelOf({ institutionNames: instNames, pastoral: e?.foodSecurity?.chains?.['Pastoral & livestock'] === true, grounds: config.nearbyResources }) },
    neighbourRelationship, instNames, priorities: getPriorities(config), tier: s.tier, governingFaction: seat,
    hasNobleInstitution: native.some((i) => /lord|noble|manor|royal seat|feudal/.test(String(i.name).toLowerCase())),
    stressTypes, stressEntries: entries, fallbackStressType: config.stressType || null,
    failedFoodSource: e?.foodSecurity?.foodRecord?.failedSource ?? null,
  });
  return { v: boycottReadsRelation(recentConflict, ps.factionRelationships, seat) };
}

const T = {}; const add = (k, f) => { T[k] = T[k] || {}; T[k][f] = (T[k][f] || 0) + 1; };
const misses = [];
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  for (let i = 0; i < N; i += 1) {
    const seed = `${process.env.R5C2_PREFIX || "r5c2-m3"}-${size}-${i}`;
    const t = clone({ ...generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size }), null, { seed, customContent: {} }) });
    const S = t.powerStructure?.recentConflict;
    const transfer = listOf(t.powerStructure?.previousGovernments).length > 0;
    const writer = transfer ? 'transfer' : 'baseline';
    add(`${size} births`, writer);
    add('ALL births', writer);
    const hideable = listOf(t.institutions).filter((h) => isRec(h) && isHideableHouse(h)).length;
    const ownerHidden = listOf(t.powerStructure?.factions).filter((f) => isRec(f) && f.hidden === true).length;
    const nothingHidden = hideable === 0 && ownerHidden === 0;
    // the writer over the FULL record (the derivation itself, before any veil)
    const full = rederive(clone(t));
    add(`${size} full-record ${writer}`, full.v === S ? 'reproduced' : 'MISS');
    add(`ALL full-record ${writer}`, full.v === S ? 'reproduced' : 'MISS');
    if (full.v !== S && misses.length < 30) misses.push(`FULL ${seed}: stored ${JSON.stringify(S).slice(0, 140)} | derived ${JSON.stringify(full.v ?? full.why).slice(0, 140)}`);
    if (!nothingHidden) continue;
    for (const dm of [false, true]) {
      const served = veil.projectShareVeil(veil.galleryPayloadFor(clone(t), { shareDm: dm, memberOverrides: null }), null);
      if (isRec(served.powerStructure)) delete served.powerStructure.recentConflict;
      const r = rederive(served);
      const k = `${size} nothing-hidden served dm=${dm} ${writer}`;
      add(k, r.v === S ? 'reproduced' : 'MISS');
      add(`ALL nothing-hidden served dm=${dm} ${writer}`, r.v === S ? 'reproduced' : 'MISS');
      if (r.v !== S && misses.length < 30) misses.push(`SERVED dm=${dm} ${seed}: stored ${JSON.stringify(S).slice(0, 140)} | derived ${JSON.stringify(r.v ?? r.why).slice(0, 140)}`);
    }
  }
}
for (const [k, v] of Object.entries(T)) console.log(k.padEnd(52), JSON.stringify(v));
console.log('misses:'); for (const s of misses) console.log('  ', s);
