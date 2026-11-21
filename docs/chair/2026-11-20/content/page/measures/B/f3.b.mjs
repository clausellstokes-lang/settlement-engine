#!/usr/bin/env node
/**
 * RUN (from the repository root):
 *   node docs/chair/2026-11-20/content/page/measures/B/f3.b.mjs > docs/chair/2026-11-20/content/page/measures/B/f3.out.txt 2>&1
 * (renders first: node docs/chair/2026-11-20/content/page/measures/B/run-render.b.mjs 10 --workers=4)
 *
 * PAGE-1's measure brief, section B.1 (F3, labels that argue). Helper B, 2026-11-20.
 * THE TOWNS: the chair's 300 (batch2.mjs recipe): hxd-<size>-<i>, DEFAULT_CONFIG untouched, settType = size, i 0..49.
 * RECORD-LEVEL: each label is computed by the same functions the page calls, on the record (listed per label below).
 * RENDERED: the 60 towns hxd-<size>-0..9 in ./views (render.b.jsx, the page census's walkDossier) are parsed for the
 * same labels, and each rendered word is compared with the record-level word (agreement printed).
 *
 * THE COMMON ORDINAL SCALE: 0..4, higher = better / safer / richer / more magic. Anchored on the 0-100 axis by the
 * causal ladder's own cuts (causalState.js :: causalBand: >=75 4, >=50 3, >=30 2, >=15 1, else 0). A label backed by a
 * 0-100 score takes the rung of its band's midpoint on that axis; a label with no score is mapped by word (tables below).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { safetyBandOf, stabilityBandOf } = await import(`${L}/src/domain/display/labelBands.js`);
const { deriveCausalState, causalBand, causalBandWord } = await import(`${L}/src/domain/causalState.js`);
const { foundationBandShown } = await import(`${L}/src/domain/display/foundationBandShown.js`);
const { rulingAuthorityBandShown } = await import(`${L}/src/domain/display/rulingAuthorityShown.js`);
const { offersFoodSurplus } = await import(`${L}/src/domain/foodSurplus.js`);
const { outputChipBesideWord, deriveMagicRelianceView, magicRowsGated, deriveMagicPosture } = await import(`${L}/src/domain/display/dossierViewModel.js`);
const { scoreBand } = await import(`${L}/src/domain/display/defenseScoreBands.js`);
const { deriveSupportingCapabilities } = await import(`${L}/src/domain/display/defenseDisplay.js`);
const { prosperityHeaderPoolKey } = await import(`${L}/src/domain/display/stateProse/economyStateProse.js`);
const { prosperityRank } = await import(`${L}/src/data/constants.js`);

await loadGenerationLawPayloads();
const N = Number(process.argv[2] || 50);
const towns = [];
for (const size of SIZES) for (let i = 0; i < N; i++) towns.push({ seed: `hxd-${size}-${i}`, size, t: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }) });

// ── the Foundations row as SubstrateTab.jsx :162-176 prints it ──
const foundation = (t, model, key) => {
  const v = model?.variables?.[key]; if (!v) return null;
  const band = key === 'food_security' && v.band === 'surplus' && !offersFoodSurplus(t?.economicState?.foodSecurity?.foodRecord) ? 'adequate'
    : key === 'ruling_authority' ? rulingAuthorityBandShown(t, v.band) : foundationBandShown(t, key, v.band);
  return { band, word: causalBandWord(key, band), score: v.score };
};
const shownKeys = (t, model) => new Set(magicRowsGated(t, Object.entries(model?.variables || {}), ([k]) => k).map(([k]) => k));

// ── the ordinal maps (0..4) ──
const CAUSAL = { surplus: 4, adequate: 3, strained: 2, critical: 1, collapsed: 0 };
const SCOREBAND = { CRITICAL: 0, WEAK: 1, ADEQUATE: 3, STRONG: 4 }; // midpoints 10 / 30 / 52 / 82 on the causal cuts
const SAFETY = { 'Very Safe': 4, Safe: 3, Moderate: 2, Unsafe: 1, Dangerous: 0, Controlled: 2, Tense: 2, Quarantined: 2, Strained: 1, Restricted: 1, Suspicious: 1, Desperate: 0, Volatile: 0, Critical: 0 };
const STABILITY = { Ordered: 4, Stable: 3, 'Enforced Order': 3, Rigid: 3, Tense: 2, Vulnerable: 2, Fragile: 2, Strained: 2, Anxious: 2, Suppressed: 1, Shaken: 1, Unstable: 1, Fractured: 1, Volatile: 1, Desperate: 1, Critical: 0 };
const PROSPERITY = { Subsistence: 0, Struggling: 0, Poor: 1, Moderate: 3, Comfortable: 3, Prosperous: 4, Wealthy: 4 }; // prosperityRank.js PROSPERITY_RANK x100 on the causal cuts
const READINESS = { Fortress: 4, 'Well-Defended': 3, Defensible: 2, 'Lightly Defended': 2, Vulnerable: 1, Undefended: 0 }; // band midpoints (bandLadders.js READINESS_CUTS)
const RELIANCE = { none: 0, present: 1, 'relied-upon': 3, integral: 4 };
const LEGIT = { Revered: 4, Approved: 3, Tolerated: 2, Contested: 1, 'Legitimacy Crisis': 0 };
const rungOfScore = (n) => CAUSAL[causalBand(n)];

const rows = towns.map(({ seed, size, t }) => {
  const model = deriveCausalState(t); const shown = shownKeys(t, model);
  const eco = t.economicState || {}; const sp = eco.safetyProfile || {}; const dp = t.defenseProfile || {}; const sc = dp.scores || {};
  const law = foundation(t, model, 'law_order'), crim = foundation(t, model, 'criminal_opportunity'), econCap = foundation(t, model, 'economic_capacity');
  const magStab = shown.has('magical_stability') ? foundation(t, model, 'magical_stability') : null, defR = foundation(t, model, 'defense_readiness'), legit = foundation(t, model, 'public_legitimacy');
  const output = Math.round(eco.compound?.economyOutput || 0);
  const rel = deriveMagicRelianceView(t);
  const magCapShown = magicRowsGated(t, [{ key: 'magical' }]).length > 0;
  const arcane = (deriveSupportingCapabilities(t) || []).find((r) => r?.label === 'Arcane Support');
  const posture = deriveMagicPosture(t);
  return {
    seed, size, stressed: (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).length > 0,
    safety: safetyBandOf(sp.safetyLabel) ?? sp.safetyLabel, safetyLabel: sp.safetyLabel, safetyRatio: sp.safetyRatio,
    law: law?.band, lawWord: law?.word, lawScore: law?.score, crim: crim?.band, crimWord: crim?.word, crimScore: crim?.score,
    stability: stabilityBandOf(t.powerStructure?.stability), stabilityFull: t.powerStructure?.stability,
    legit: legit?.band, legitLabel: t.powerStructure?.publicLegitimacy?.label,
    criminalEffective: eco.compound?.criminalEffective, militaryEffective: eco.compound?.militaryEffective,
    prosperity: eco.prosperity, output, chip: outputChipBesideWord(output, eco.prosperity), econCap: econCap?.band, econRes: scoreBand(sc.economic ?? 0), econResScore: sc.economic,
    headerKey: prosperityHeaderPoolKey(prosperityRank(eco.prosperity), String(eco.tradeAccess ?? '')),
    reliance: rel.reading, relianceWord: rel.word, relianceShown: rel.shown, magCap: magCapShown ? scoreBand(sc.magical ?? 0) : null, magCapScore: sc.magical,
    magLevel: posture.available ? posture.display : null, magStab: magStab?.band, arcane: arcane?.status ?? null,
    readiness: dp.readiness?.label, defR: defR?.band,
    stressTypes: (Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((x) => x?.type),
    lawContrib: (model?.variables?.law_order?.contributors || []).map((c) => [c.source ?? c.id ?? c.key, c.delta ?? c.contribution ?? c.value]),
    crimContrib: (model?.variables?.criminal_opportunity?.contributors || []).map((c) => [c.source ?? c.id ?? c.key, c.delta ?? c.contribution ?? c.value]),
    capture: t.powerStructure?.criminalCaptureState ?? null, govCat: (t.powerStructure?.factions || []).find((f) => f?.isGoverning)?.category ?? null,
    criminalSeat: (t.powerStructure?.factions || []).some((f) => f?.isGoverning && f?.category === 'criminal'),
    compound: eco.compound, spFlags: sp.flags,
    relDependents: rel.dependents, relPractitioners: rel.practitioners, hasCrimOrg: (t.institutions || []).some((i) => /thieves|criminal|gang|smuggler|fence/i.test(String(i?.name ?? ''))),
  };
});

const pct = (a, b) => (b ? `${(100 * a / b).toFixed(0)}%` : 'n/a');
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
function pair(name, A, B, mapA, mapB, filter = () => true) {
  console.log(`\n── PAIR ${name}`);
  const sub = rows.filter((r) => filter(r) && A(r) != null && B(r) != null);
  const missA = rows.filter((r) => filter(r) && (A(r) != null && !Object.hasOwn(mapA, A(r)))).map(A), missB = rows.filter((r) => filter(r) && (B(r) != null && !Object.hasOwn(mapB, B(r)))).map(B);
  if (missA.length || missB.length) console.log(`  UNMAPPED: ${JSON.stringify(tally(missA))} ${JSON.stringify(tally(missB))}`);
  const far = (r) => Math.abs(mapA[A(r)] - mapB[B(r)]) >= 2;
  const line = SIZES.map((s) => { const g = sub.filter((r) => r.size === s); return `${s} ${g.filter(far).length}/${g.length} (${pct(g.filter(far).length, g.length)})`; }).join(' · ');
  console.log(`  2+ rungs apart: ALL ${sub.filter(far).length}/${sub.length} (${pct(sub.filter(far).length, sub.length)}) | ${line}`);
  const ct = tally(sub.map((r) => `${A(r)} | ${B(r)}`));
  console.log(`  cross-tab (A | B: towns, * = 2+ apart): ${ct.map(([k, c]) => { const [a, b] = k.split(' | '); return `${k}: ${c}${Math.abs(mapA[a] - mapB[b]) >= 2 ? '*' : ''}`; }).join(' ; ')}`);
  return sub.filter(far);
}

console.log(`F3 record-level, ${rows.length} towns (${N} a size), stressed at birth: ${rows.filter((r) => r.stressed).length}`);
console.log('MAPS (0..4):', JSON.stringify({ SAFETY, STABILITY, CAUSAL, SCOREBAND, PROSPERITY, READINESS, RELIANCE, LEGIT }));

console.log('\n════ (a) SAFETY / LAW & ORDER / CRIMINAL OPPORTUNITY / STABILITY');
pair('a1 Overview Safety vs Foundations Law & order', (r) => r.safety, (r) => r.law, SAFETY, CAUSAL);
pair('a2 Overview Safety vs Foundations Criminal opportunity (word: Negligible/Contained/Elevated/Acute/Rampant = surplus..collapsed)', (r) => r.safety, (r) => r.crim, SAFETY, CAUSAL);
pair('a3 Overview Safety vs stability heading (Overview identity line, Power)', (r) => r.safety, (r) => r.stability, SAFETY, STABILITY);
pair('a4 Law & order vs Criminal opportunity (same Foundations panel)', (r) => r.law, (r) => r.crim, CAUSAL, CAUSAL);
pair('a5 Law & order vs stability heading', (r) => r.law, (r) => r.stability, CAUSAL, STABILITY);
const unst = rows.filter((r) => /organized crime/.test(String(r.stabilityFull)));
console.log(`\n  "Unstable (pervasive organized crime)" towns: ${unst.length}; their Safety: ${JSON.stringify(tally(unst.map((r) => r.safety)))}; Law & order: ${JSON.stringify(tally(unst.map((r) => r.law)))}; Criminal opp.: ${JSON.stringify(tally(unst.map((r) => r.crimWord)))}; by size ${JSON.stringify(tally(unst.map((r) => r.size)))}`);
console.log(`  of them: criminalEffective ${unst.map((r) => Math.round(r.criminalEffective)).join(',')} | militaryEffective ${unst.map((r) => Math.round(r.militaryEffective)).join(',')} | safetyRatio ${unst.map((r) => r.safetyRatio).join(',')}`);
console.log('  calm towns only (no stress at birth):');
pair('a1-calm Safety vs Law & order', (r) => r.safety, (r) => r.law, SAFETY, CAUSAL, (r) => !r.stressed);

const contribMean = (g, key) => { const m = new Map(); for (const r of g) for (const [k, v] of r[key]) { const src = String(k).replace(/^faction[_:-].*|^[a-z]+-\d.*$/, 'criminal power'); const a = m.get(src) || [0, 0]; a[0] += Number(v) || 0; a[1]++; m.set(src, a); } return [...m].map(([k, [sum, n]]) => `${k} ${(sum / g.length).toFixed(1)} (in ${n})`).join(' ; '); };
{ const far = rows.filter((r) => Math.abs(SAFETY[r.safety] - CAUSAL[r.law]) >= 2), near = rows.filter((r) => !far.includes(r));
  console.log(`\n  a1 CAUSE: law_order contributors, mean points per town (contributors.delta), 2+ apart (${far.length}): ${contribMean(far, 'lawContrib')}`);
  console.log(`            the rest (${near.length}): ${contribMean(near, 'lawContrib')}`);
  console.log(`  a1 2+ apart, Safety | Law & order | safetyRatio: ${far.map((r) => `${r.safety}|${r.law}|${r.safetyRatio}`).join(' ')}`); }
console.log(`\n  SAFETY FLOOR (safetyProfile.js :88-110: effectiveSafety = max(safetyRatio, communityOrderBonus 1.25 thorp / 1.20 hamlet-town / 0.8 city / 0 metro when no criminal house, courtOrderFloor)):`);
for (const size of SIZES) { const g = rows.filter((r) => r.size === size && !r.stressed); const lifted = g.filter((r) => r.safety === 'Moderate' && r.safetyRatio < 1.2); console.log(`    ${size.padEnd(10)} calm ${g.length}: Safety ${JSON.stringify(tally(g.map((r) => r.safety)))}; Moderate with safetyRatio < 1.2 (held up by a floor) ${lifted.length}; safetyRatio range ${Math.min(...g.map((r) => r.safetyRatio))}-${Math.max(...g.map((r) => r.safetyRatio))}; a criminal house on the roster ${g.filter((r) => r.hasCrimOrg).length}`); }
{ const far = rows.filter((r) => Math.abs(SAFETY[r.safety] - CAUSAL[r.crim]) >= 2);
  console.log(`\n  a2 CAUSE: 2+ apart Safety|CrimOpp|stress: ${JSON.stringify(tally(far.map((r) => `${r.safety}|${r.crimWord}|${r.stressTypes.join('+') || 'calm'}`)))}`);
  console.log(`  criminal_opportunity contributors (all 300): ${contribMean(rows, 'crimContrib')}`);
  console.log(`  Criminal opportunity SCORE (raw, before the lower-is-better inversion) by word: ${JSON.stringify(tally(rows.map((r) => `${r.crimScore}->${r.crimWord}`)))}`);
  console.log(`  Criminal opportunity word over all 300: ${JSON.stringify(tally(rows.map((r) => r.crimWord)))}; Law & order word: ${JSON.stringify(tally(rows.map((r) => r.lawWord)))}`); }
{ const far = rows.filter((r) => Math.abs(CAUSAL[r.law] - CAUSAL[r.crim]) >= 2);
  console.log(`  a4 2+ apart Law|CrimOpp|stress: ${JSON.stringify(tally(far.map((r) => `${r.lawWord}|${r.crimWord}|${r.stressTypes.join('+') || 'calm'}`)))}`); }

// ── ADDED BY THE COORDINATOR: (ii) the hall in criminal hands while Safety reads Moderate or better; (iii) the court floor alone
console.log(`\n  (ii) HALL CAPTURE (powerStructure.criminalCaptureState, domain/people/hallCapture.js :48 ladder none/adversarial/equilibrium/corrupted/capture) x Safety: ${JSON.stringify(tally(rows.map((r) => `${r.capture} | ${r.safety}`)))}`);
{ const held = rows.filter((r) => ['corrupted', 'capture'].includes(r.capture) || r.criminalSeat); const ok = held.filter((r) => SAFETY[r.safety] >= 2);
  console.log(`  hall corrupted/captured or a criminal power governing: ${held.length}/300; of them Safety Moderate or better: ${ok.length} (${JSON.stringify(tally(ok.map((r) => `${r.size} ${r.capture} ${r.safety}`)))}); equilibrium (shared) ${rows.filter((r) => r.capture === 'equilibrium').length}, of them Moderate+ ${rows.filter((r) => r.capture === 'equilibrium' && SAFETY[r.safety] >= 2).length}`);
  console.log(`  governing power category: ${JSON.stringify(tally(rows.map((r) => r.govCat)))}`); }
{ // (iii) safetyProfile.js :70-110 replayed from the stored flags: raw = militaryEffective / max(8, criminalEffective); community bonus by tier
  // where no criminal house (name regex of :74-79, applied to the name: INFERRED equivalent of institutionMatchesRegex); court floor
  // (hasCourtSystem || hasPrison, a criminal house, town 1.20 / city+ 1.25). Calm towns only (no stress branch), no stateCrime/crimeIsGovt.
  const COMM = { thorp: 1.25, hamlet: 1.2, village: 1.2, town: 1.2, city: 0.8, metropolis: 0 };
  const setter = (r) => { const c = r.compound || {}; const raw = c.militaryEffective / Math.max(8, c.criminalEffective); const comm = r.hasCrimOrg ? 0 : COMM[r.size];
    const law = c.inst?.hasCourtSystem || c.inst?.hasPrison; const court = !r.hasCrimOrg ? 0 : law && ['city', 'metropolis'].includes(r.size) ? 1.25 : law && r.size === 'town' ? 1.2 : 0;
    const eff = Math.max(raw, comm, court); const word = eff >= 3.5 ? 'Very Safe' : eff >= 2 ? 'Safe' : eff >= 1.2 ? 'Moderate' : eff >= 0.6 ? 'Unsafe' : 'Dangerous';
    const by = eff === raw ? 'ratio' : eff === court ? 'court floor' : 'size floor'; return { raw, comm, court, eff, word, by }; };
  const calm = rows.filter((r) => !r.stressed && !r.spFlags?.stateCrime && !r.spFlags?.crimeIsGovt);
  const rep = calm.map((r) => ({ r, ...setter(r) }));
  console.log(`\n  (iii) WHAT SETS SAFETY (calm, ${calm.length} towns; replay agrees with the stored word in ${rep.filter((x) => x.word === x.r.safety).length}/${calm.length}):`);
  for (const size of SIZES) { const g = rep.filter((x) => x.r.size === size); console.log(`    ${size.padEnd(10)} ${JSON.stringify(tally(g.map((x) => `${x.by} -> ${x.word}`)))}; raw ratio would read ${JSON.stringify(tally(g.map((x) => (x.raw >= 3.5 ? 'Very Safe' : x.raw >= 2 ? 'Safe' : x.raw >= 1.2 ? 'Moderate' : x.raw >= 0.6 ? 'Unsafe' : 'Dangerous'))))}`); }
  const byCourt = rep.filter((x) => x.by === 'court floor'), bySize = rep.filter((x) => x.by === 'size floor');
  console.log(`    court floor alone sets the word: ${byCourt.length}/${calm.length} (${pct(byCourt.length, calm.length)}); a size floor alone: ${bySize.length}/${calm.length} (${pct(bySize.length, calm.length)}); either floor: ${pct(byCourt.length + bySize.length, calm.length)}`); }

console.log('\n════ (b) OUTPUT n/100 / PROSPERITY / ECONOMY PROSE');
const b1 = pair('b1 Economics Output n/100 (raw score -> causal rung) vs prosperity word (Overview + Economics header)', (r) => String(r.output), (r) => r.prosperity, Object.fromEntries(rows.map((r) => [String(r.output), rungOfScore(r.output)])), PROSPERITY);
console.log(`  of those 2+ apart, the Output chip STILL PRINTS (outputChipBesideWord true): ${b1.filter((r) => r.chip).length}/${b1.length}; chip suppressed in all 300: ${rows.filter((r) => !r.chip).length}`);
pair('b1-printed Output (chip printed only) vs prosperity', (r) => (r.chip ? String(r.output) : null), (r) => r.prosperity, Object.fromEntries(rows.map((r) => [String(r.output), rungOfScore(r.output)])), PROSPERITY);
pair('b2 prosperity word vs Foundations Economic capacity', (r) => r.prosperity, (r) => r.econCap, PROSPERITY, CAUSAL);
pair('b3 prosperity word vs Overview Economic Resilience bar', (r) => r.prosperity, (r) => r.econRes, PROSPERITY, SCOREBAND);
pair('b4 Output n/100 vs Overview Economic Resilience bar', (r) => String(r.output), (r) => r.econRes, Object.fromEntries(rows.map((r) => [String(r.output), rungOfScore(r.output)])), SCOREBAND);
console.log(`\n  OUTPUT n/100 distribution by size (economicState.compound.economyOutput, priorityHelpers.js :428): ${SIZES.map((sz) => `${sz} ${JSON.stringify(tally(rows.filter((r) => r.size === sz).map((r) => r.output)))}`).join(' | ')}`);
console.log(`  Output >= 60 (green chip) in ${rows.filter((r) => r.output >= 60).length}/300; max ${Math.max(...rows.map((r) => r.output))}`);
console.log(`  Prosperity by size: ${SIZES.map((sz) => `${sz} ${JSON.stringify(tally(rows.filter((r) => r.size === sz).map((r) => r.prosperity)))}`).join(' | ')}`);
{ // (iv) THE OUTPUT'S DRAGS (priorityHelpers.js :416-434): economyOutput = dial x crimeDegradeEconomy x magicBoostEconomy x marketInstMult x economyStressMult x neighborEconMult
  const STRESS = { under_siege: 0.45, famine: 0.6, occupied: 0.7, plague_onset: 0.75, indebted: 0.85, politically_fractured: 0.85, insurgency: 0.88, mass_migration: 0.9, wartime: 0.88, religious_conversion: 0.92, slave_revolt: 0.72 };
  const drags = rows.map((r) => { const c = r.compound || {}; const dial = c.raw?.economy ?? 50;
    const f = { crime: Math.max(0.58, 1 - ((c.criminalEffective ?? 30) - 30) / 310), magic: 1 + ((c.raw?.magic ?? 50) - 50) / 290, market: c.inst?.hasMarket ? 1 : 0.75, crisis: r.stressTypes.reduce((a, k) => a * (STRESS[k] ?? 1), 1) };
    const prod = dial * f.crime * f.magic * f.market * f.crisis; f.neighbour = (c.economyOutput ?? 0) / prod; // the remainder: the neighbour factor (0.88..1.08), read back
    const worst = Object.entries(f).filter(([, v]) => v < 0.995).sort((a, b) => a[1] - b[1])[0];
    return { r, dial, f, share: (c.economyOutput ?? 0) / dial, worst: worst ? worst[0] : 'none' }; });
  const nb = tally(drags.map((d) => d.f.neighbour.toFixed(2)));
  console.log(`\n  (iv) OUTPUT DRAGS: dial (compound.raw.economy) ${JSON.stringify(tally(drags.map((d) => d.dial)))}; neighbour factor read back ${JSON.stringify(nb)} (the code's values 0.88/0.93/0.97/1/1.05/1.08: a value outside them would be a misread)`);
  console.log(`    the largest drag, by size: ${SIZES.map((sz) => `${sz} ${JSON.stringify(tally(drags.filter((d) => d.r.size === sz).map((d) => d.worst)))}`).join(' | ')}`);
  console.log(`    the largest drag, all: ${JSON.stringify(tally(drags.map((d) => d.worst)))}; share of the dial made (output/dial): median ${drags.map((d) => d.share).sort((a, b) => a - b)[150].toFixed(2)}, min ${Math.min(...drags.map((d) => d.share)).toFixed(2)}, max ${Math.max(...drags.map((d) => d.share)).toFixed(2)}`);
  console.log(`    no market (x0.75) in ${drags.filter((d) => d.f.market < 1).length}/300 (${SIZES.map((sz) => `${sz} ${drags.filter((d) => d.r.size === sz && d.f.market < 1).length}`).join(' ')}); crime drag below 0.95 in ${drags.filter((d) => d.f.crime < 0.95).length}; a crisis drag in ${drags.filter((d) => d.f.crisis < 1).length}`); }
const c3 = rows.filter((r) => /C3/.test(String(r.headerKey)));
console.log(`\n  DS-ECO-1 header pool by prosperity (economyStateProse.js :: prosperityHeaderPoolKey): ${JSON.stringify(tally(rows.map((r) => `${String(r.headerKey).slice(0, 14)} ${r.prosperity}`)))}`);
console.log(`  C3 towns ("nobody here calls the town poor" is C3 vid 2): ${c3.length}; their Output: <35 (red chip) ${c3.filter((r) => r.output < 35).length}, 35-59 ${c3.filter((r) => r.output >= 35 && r.output < 60).length}, >=60 ${c3.filter((r) => r.output >= 60).length}; Economic Resilience ${JSON.stringify(tally(c3.map((r) => r.econRes)))}; Economic capacity ${JSON.stringify(tally(c3.map((r) => r.econCap)))}`);

console.log('\n════ (c) RELIANCE ON MAGIC / MAGICAL CAPABILITY / MAGIC HEADLINE / MAGICAL STABILITY / ARCANE SUPPORT');
pair('c1 Reliance on magic vs Magical Capability (both as printed on Overview; capability gated by magicRowsGated)', (r) => (r.relianceShown ? r.reliance : null), (r) => r.magCap, RELIANCE, SCOREBAND);
console.log(`  Magical Capability score by reliance: ${['none', 'present', 'relied-upon', 'integral'].map((k) => { const g = rows.filter((r) => r.reliance === k && r.magCap); const s = g.map((r) => r.magCapScore).sort((a, b) => a - b); return `${k} n=${g.length} median ${s[Math.floor(s.length / 2)] ?? '-'} max ${s.at(-1) ?? '-'}`; }).join(' | ')}`);
console.log(`  cross-tab Magic headline (Magic tab) | Reliance: ${JSON.stringify(tally(rows.map((r) => `${r.magLevel} | ${r.relianceWord}`)))}`);
console.log(`  cross-tab Magic headline | Magical Capability: ${JSON.stringify(tally(rows.map((r) => `${r.magLevel} | ${r.magCap}`)))}`);
{ const disc = rows.filter((r) => r.relianceShown && r.magCap && Math.abs(RELIANCE[r.reliance] - SCOREBAND[r.magCap]) >= 2);
  for (const r of disc) console.log(`  c1 2+ apart: ${r.seed} reliance ${r.reliance} | capability ${r.magCap} (${r.magCapScore}) | dependents ${JSON.stringify(r.relDependents)} | practitioners ${JSON.stringify(r.relPractitioners).slice(0, 140)} | Arcane Support ${r.arcane}`); }
pair('c2 Magical Capability vs Foundations Magical stability', (r) => r.magCap, (r) => r.magStab, SCOREBAND, CAUSAL);
console.log(`  cross-tab Reliance | Defense Arcane Support: ${JSON.stringify(tally(rows.map((r) => `${r.relianceWord} | ${r.arcane}`)))}`);
console.log(`  cross-tab Magical Capability | Defense Arcane Support: ${JSON.stringify(tally(rows.map((r) => `${r.magCap} | ${r.arcane}`)))}`);

console.log('\n════ (d) FURTHER PAIRS ON THE SAME PAGES');
pair('d1 Overview Defense (readiness label) vs Foundations Defense readiness', (r) => r.readiness, (r) => r.defR, READINESS, CAUSAL);
pair('d2 stability heading vs Foundations Public legitimacy', (r) => r.stability, (r) => r.legit, STABILITY, CAUSAL);
console.log(`  Public legitimacy word printed (Foundations) by stability: ${JSON.stringify(tally(rows.map((r) => `${r.stability} | ${causalBandWord('public_legitimacy', r.legit)}`)))}`);

// ── RENDERED CHECK ──
const VIEWS = join(HERE, 'views');
if (existsSync(VIEWS)) {
  console.log('\n════ RENDERED CHECK (views/: the page census walker, hxd-<size>-0..9)');
  const after = (lines, label) => { const i = lines.indexOf(label); return i >= 0 ? lines[i + 1] : null; };
  const inline = (lines, label) => { const l = lines.find((x) => x.startsWith(label)); return l ? l.slice(label.length).trim() : null; };
  const lc = (s) => (s == null ? null : String(s).toLowerCase());
  const checks = { safety: [0, 0], law: [0, 0], crim: [0, 0], stability: [0, 0], prosperity: [0, 0], output: [0, 0], reliance: [0, 0], magCap: [0, 0], magLevel: [0, 0] };
  const bad = [];
  const files = readdirSync(VIEWS).filter((f) => f.endsWith('.json'));
  const far = { a1: 0, a2: 0, a3: 0, b1: 0, c1: 0, n: 0 };
  for (const f of files) {
    const { seed, views } = JSON.parse(readFileSync(join(VIEWS, f), 'utf8'));
    const r = rows.find((x) => x.seed === seed); if (!r) continue;
    const ov = views['Summary/Overview'] || [], fo = views['Summary/Foundations'] || [], ec = views['Systems/Economics'] || [], mg = views['Systems/Magic'] || [];
    const ident = ov.find((l) => /Governed by /.test(l));
    const got = {
      safety: after(ov, 'Safety'), law: inline(fo, 'Law & order'), crim: inline(fo, 'Criminal opportunity'),
      stability: ident ? ident.split(' · ').at(-1) : null, prosperity: after(ov, 'Prosperity'),
      output: after(ec, 'Output'), reliance: after(ov, 'Reliance on magic'), magCap: inline(ov, 'Magical Capability'), magLevel: after(mg, 'Magic'),
    };
    // the walker keeps a repeated line once per view (pageCensusWalk.shared.mjs :: walkDossier): a Safety word equal to the
    // Prosperity word is not printed a second time in the dump, and the next line is the Viability tag's label
    if (got.safety === 'Viability' && ov.includes(r.safety)) got.safety = `${r.safety}`;
    if (got.stability) got.stability = stabilityBandOf(got.stability) ?? got.stability;
    const want = { safety: r.safety, law: r.lawWord, crim: r.crimWord, stability: r.stability, prosperity: r.prosperity, output: r.chip ? `${r.output}/100` : null, reliance: r.relianceShown ? r.relianceWord : null, magCap: r.magCap, magLevel: r.magLevel };
    for (const k of Object.keys(checks)) { checks[k][1]++; if (lc(got[k]) === lc(want[k])) checks[k][0]++; else bad.push(`${seed} ${k}: page "${got[k]}" record "${want[k]}"`); }
    far.n++;
    if (got.safety && got.law && Math.abs(SAFETY[r.safety] - CAUSAL[r.law]) >= 2) far.a1++;
    if (Math.abs(SAFETY[r.safety] - CAUSAL[r.crim]) >= 2) far.a2++;
    if (got.stability && Math.abs(SAFETY[r.safety] - STABILITY[r.stability]) >= 2) far.a3++;
    if (got.output && Math.abs(rungOfScore(r.output) - PROSPERITY[r.prosperity]) >= 2) far.b1++;
    if (got.reliance && got.magCap && Math.abs(RELIANCE[r.reliance] - SCOREBAND[r.magCap]) >= 2) far.c1++;
  }
  console.log(`  rendered towns: ${files.length}; page word == record word: ${Object.entries(checks).map(([k, [a, b]]) => `${k} ${a}/${b}`).join(' · ')}`);
  for (const b of bad.slice(0, 30)) console.log(`  MISMATCH ${b}`);
  console.log(`  2+ apart AS RENDERED (both words on the page): a1 Safety/Law ${far.a1}/${far.n} · a2 Safety/CrimOpp ${far.a2}/${far.n} · a3 Safety/Stability ${far.a3}/${far.n} · b1 Output(printed)/Prosperity ${far.b1}/${far.n} · c1 Reliance/MagCap ${far.c1}/${far.n}`);
}
