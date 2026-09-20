/**
 * poly.mjs — EM-R6: per-path adjudication data for the NINE polysemous paths.
 * For each: sample values that MATCH a roster institution, values that do not,
 * and (for secondaryAffiliation) the faction/institution overlap.
 */
import { writeFileSync } from 'node:fs';
import { runHeadless, instrumentedRoot } from './instrument.mjs';
import { keyOf, sample63 } from './lib.mjs';

const OUT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R6-scratch';
const rows = sample63();

const POLY = [
  'spatialLayout.quarters[].landmarks[]',
  'simulationTrace[].downstreamEffects[].target',
  'npcs[].secondaryAffiliation',
  'factions[].members[].secondaryAffiliation',
  'generationCoherenceReceipt.repairs[].subject',
  'economicState.activeChains[].label',
  'resourceAnalysis.resourceConditions[].label',
  'availableServices.legal[].name',
  'economicState.activeChains[].resource',
];

function walkStrings(root, sink, maxDepth = 25) {
  const stack = [[root, '', 0]];
  while (stack.length) {
    const [v, p, d] = stack.pop();
    if (d > maxDepth || v == null) continue;
    if (typeof v === 'string') { sink(p, v); continue; }
    if (typeof v !== 'object') continue;
    if (Array.isArray(v)) { for (const x of v) stack.push([x, `${p}[]`, d + 1]); continue; }
    for (const k of Object.keys(v)) stack.push([v[k], p ? `${p}.${k}` : k, d + 1]);
  }
}

const samples = Object.fromEntries(POLY.map(p => [p, { match: [], nomatch: [], matchN: 0, nomatchN: 0 }]));
// secondaryAffiliation union census
const secAff = { total: 0, instOnly: 0, facOnly: 0, both: 0, neither: 0, neitherSamples: [] };
// landmark: does a matching landmark's quarter also carry the institution's own quarter?
const landmark = { total: 0, match: 0, instHasQuarterField: 0 };
// legal service: is `name` === `institution` on the same entry?
const legal = { entries: 0, nameEqInstitution: 0, nameEqSomeInst: 0, nameNeqInstButMatches: 0 };
// activeChains label / resource
const chainLabel = { total: 0, match: 0, labelEqProcessor: 0, samples: [] };
const chainResource = { total: 0, match: 0, samples: [] };
// repairs[].subject
const repairs = { total: 0, match: 0, kinds: {} };
// downstreamEffects target
const dsEffects = { total: 0, match: 0, kinds: {} };

for (const row of rows) {
  const seed = row._seed ?? keyOf(row);
  const { root } = instrumentedRoot(seed);
  let out;
  try { out = await runHeadless(row, root); } catch { continue; }
  const s = out?.settlement ?? out;
  if (!s) continue;
  const insts = Array.isArray(s.institutions) ? s.institutions : [];
  const instNames = new Set(insts.map(i => String(i?.name ?? '')).filter(Boolean));
  const facNames = new Set((Array.isArray(s.powerStructure?.factions) ? s.powerStructure.factions : [])
    .map(f => String(f?.faction || f?.name || '')).filter(Boolean));

  walkStrings(s, (p, v) => {
    const b = samples[p]; if (!b) return;
    const t = v.trim(); if (!t) return;
    if (instNames.has(t)) { b.matchN += 1; if (b.match.length < 12) b.match.push(t); }
    else { b.nomatchN += 1; if (b.nomatch.length < 12) b.nomatch.push(t); }
  });

  for (const home of [s.npcs, ...(Array.isArray(s.factions) ? s.factions.map(f => f?.members) : [])]) {
    for (const n of (Array.isArray(home) ? home : [])) {
      const v = n?.secondaryAffiliation;
      if (typeof v !== 'string' || !v.trim()) continue;
      const t = v.trim(); secAff.total += 1;
      const i = instNames.has(t); const f = facNames.has(t);
      if (i && f) secAff.both += 1; else if (i) secAff.instOnly += 1;
      else if (f) secAff.facOnly += 1;
      else { secAff.neither += 1; if (secAff.neitherSamples.length < 15) secAff.neitherSamples.push(t); }
    }
  }

  for (const q of (Array.isArray(s.spatialLayout?.quarters) ? s.spatialLayout.quarters : [])) {
    for (const l of (Array.isArray(q?.landmarks) ? q.landmarks : [])) {
      landmark.total += 1;
      if (instNames.has(String(l).trim())) {
        landmark.match += 1;
        const inst = insts.find(i => String(i?.name) === String(l).trim());
        if (inst && (inst.quarter || inst.district)) landmark.instHasQuarterField += 1;
      }
    }
  }

  for (const e of (Array.isArray(s.availableServices?.legal) ? s.availableServices.legal : [])) {
    legal.entries += 1;
    if (e?.name === e?.institution) legal.nameEqInstitution += 1;
    if (instNames.has(String(e?.name ?? '').trim())) {
      legal.nameEqSomeInst += 1;
      if (e?.name !== e?.institution) legal.nameNeqInstButMatches += 1;
    }
  }

  for (const c of (Array.isArray(s.economicState?.activeChains) ? s.economicState.activeChains : [])) {
    chainLabel.total += 1;
    const lab = String(c?.label ?? '').trim();
    if (instNames.has(lab)) {
      chainLabel.match += 1;
      const procs = Array.isArray(c?.processingInstitutions) ? c.processingInstitutions.map(String) : [];
      if (procs.includes(lab)) chainLabel.labelEqProcessor += 1;
      if (chainLabel.samples.length < 10) chainLabel.samples.push({ label: lab, procs, resource: c?.resource, needLabel: c?.needLabel });
    }
    chainResource.total += 1;
    const res = String(c?.resource ?? '').trim();
    if (instNames.has(res)) {
      chainResource.match += 1;
      if (chainResource.samples.length < 10) chainResource.samples.push({ resource: res, label: c?.label, resourceKey: c?.resourceKey });
    }
  }

  for (const r of (Array.isArray(s.generationCoherenceReceipt?.repairs) ? s.generationCoherenceReceipt.repairs : [])) {
    repairs.total += 1;
    repairs.kinds[r?.kind ?? r?.type ?? '(nokind)'] = (repairs.kinds[r?.kind ?? r?.type ?? '(nokind)'] || 0) + 1;
    if (instNames.has(String(r?.subject ?? '').trim())) repairs.match += 1;
  }

  for (const t of (Array.isArray(s.simulationTrace) ? s.simulationTrace : [])) {
    for (const d of (Array.isArray(t?.downstreamEffects) ? t.downstreamEffects : [])) {
      dsEffects.total += 1;
      const k = d?.kind ?? d?.type ?? '(nokind)';
      if (instNames.has(String(d?.target ?? '').trim())) {
        dsEffects.match += 1;
        dsEffects.kinds[k] = (dsEffects.kinds[k] || 0) + 1;
      }
    }
  }
}

const result = { rows: rows.length, samples, secAff, landmark, legal, chainLabel, chainResource, repairs, dsEffects };
writeFileSync(`${OUT}/poly-63.json`, JSON.stringify(result, null, 2));
for (const p of POLY) {
  const b = samples[p];
  console.log(`\n### ${p}  match=${b.matchN} nomatch=${b.nomatchN}`);
  console.log('   MATCH  :', JSON.stringify(b.match.slice(0, 6)));
  console.log('   NOMATCH:', JSON.stringify(b.nomatch.slice(0, 6)));
}
console.log('\nsecondaryAffiliation union:', JSON.stringify(secAff));
console.log('landmark:', JSON.stringify(landmark));
console.log('legal:', JSON.stringify(legal));
console.log('chainLabel:', JSON.stringify(chainLabel));
console.log('chainResource:', JSON.stringify(chainResource));
console.log('repairs:', JSON.stringify(repairs));
console.log('downstreamEffects:', JSON.stringify(dsEffects));
