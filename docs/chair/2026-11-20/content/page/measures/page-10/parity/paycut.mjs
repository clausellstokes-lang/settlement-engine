// PAGE-10 CAUSES-PARITY, step M (the brief `briefs/CAUSES-PARITY.md`, 22:33 UTC 2026-11-20): IS `orderForceOf.payCut` EXACTLY
// RESTATED BY WHAT EVERY READ SERVES?
//
// `payCut` as written (`src/domain/facts/orderForce.js :: orderForceOf`): some card of the cast has `category === 'military'`
// and `settlementCondition === 'economic_stress'`. `settlementCondition` is written by `src/generators/npcStructure.js ::
// enrichNPCsWithStructure` from `getPrimaryCondition(settlement)` (not exported; its arms are restated below verbatim), and
// ONLY on a card inside the enrichment cut whose structural template resolves (or on the seat's holder); `publicCard` never
// serves the field.
//
// THE SERVED RESTATEMENT: the place's own condition, read from the plain served document (`toPublicSafe(record)`) by
// `getPrimaryCondition`'s arms in order, less the one arm the served document cannot read (`powerStructure.criminalCaptureState`,
// deleted by `publicSafe.js :: publicVeilPass`: a crime fact), is 'economic_stress'; AND a person under arms stands on the
// served cast (`npcs[].category === 'military'`, a field `publicCard` serves).
//
// Births as `measures/page-7/sim.mjs` births them: `hxd-<size>-<i>`, 150 a size, the six sizes (900).
// Run: node docs/chair/2026-11-20/content/page/measures/page-10/parity/paycut.mjs $PWD 150 > <out>
const [, , L, nA = '150', prefix = 'hxd'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { orderForceOf } = await import(`${L}/src/domain/facts/orderForce.js`);
const { toPublicSafe } = await import(`${L}/src/domain/display/publicSafe.js`);
await loadGenerationLawPayloads();

/** `npcStructure.js :: getPrimaryCondition`, its arms in order; `withCrime: false` drops the capture arm the served document lacks. */
function conditionOf(s, { withCrime }) {
  const leg = s?.powerStructure?.publicLegitimacy;
  const crimCap = s?.powerStructure?.criminalCaptureState || 'none';
  const food = s?.economicState?.foodSecurity;
  const pros = (s?.economicState?.prosperity || '').toLowerCase();
  if (leg?.governanceFractured) return 'governance_fractured';
  if (withCrime && (crimCap === 'corrupted' || crimCap === 'capture')) return 'corruption';
  const fl = (food?.label || '').toLowerCase();
  if (fl.includes('famine') || fl.includes('deficit')) return 'food_crisis';
  if (pros.includes('struggling') || pros.includes('poor') || pros.includes('subsist')) return 'economic_stress';
  if (leg?.isContested) return 'contested';
  return 'stable';
}
/** THE SERVED RESTATEMENT of payCut, on a served document. */
const servedPayCut = (pub) => conditionOf(pub, { withCrime: false }) === 'economic_stress'
  && (Array.isArray(pub?.npcs) ? pub.npcs : []).some((n) => n?.category === 'military');

let n = 0; let ownerTrue = 0; let servedTrue = 0; const diff = []; const why = {};
const bySize = {};
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const pub = toPublicSafe(t);
  const owner = orderForceOf(t).payCut; const served = servedPayCut(pub);
  n++; if (owner) ownerTrue++; if (served) servedTrue++;
  bySize[size] ??= { n: 0, diff: 0 }; bySize[size].n++;
  if (owner === served) continue;
  bySize[size].diff++;
  // the reason, read on the owner record
  const condOwner = conditionOf(t, { withCrime: true }); const condServed = conditionOf(pub, { withCrime: false });
  const mil = (t.npcs || []).filter((c) => c?.category === 'military');
  const milCond = mil.filter((c) => c?.settlementCondition !== undefined).length;
  const reason = condOwner !== condServed ? `condition owner=${condOwner} served=${condServed}`
    : !mil.length ? 'no military card on the owner cast'
    : milCond === 0 ? 'condition economic_stress; a military card stands but none carries settlementCondition (outside the enrichment cut, or its template refused)'
    : 'other';
  why[reason] = (why[reason] || 0) + 1;
  diff.push(`${seed} owner=${owner} served=${served} :: ${reason}`);
}
console.log(`M: ${diff.length} of ${n} places differ (payCut as written on the owner record vs the served restatement on plain toPublicSafe)`);
console.log(`owner payCut true: ${ownerTrue}; served restatement true: ${servedTrue}`);
console.log(`owner-only (true on the owner, false served): ${diff.filter((d) => d.includes('owner=true')).length}; served-only: ${diff.filter((d) => d.includes('served=true')).length}`);
console.log('by size: ' + Object.entries(bySize).map(([k, v]) => `${k} ${v.diff}/${v.n}`).join(' '));
console.log('by reason:'); for (const [k, v] of Object.entries(why).sort((a, b) => b[1] - a[1])) console.log(`  ${v}× ${k}`);
console.log('places:'); for (const d of diff) console.log('  ' + d);
