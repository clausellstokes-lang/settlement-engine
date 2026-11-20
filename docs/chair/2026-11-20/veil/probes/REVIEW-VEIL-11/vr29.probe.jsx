// REVIEW-VEIL-11 — VR29's question, measured before R3 builds: does an EMPTY evidence array tell more than a town with no crime?
// Born towns (both shapes by RV10_GEN), stored only. For each: criminalInstitutions (names) and crimeTypes as stored; the
// hideable houses; the arrays as R3 would leave them where every hideable house is hidden whole (an entry naming a hidden
// house, or attributable to one by its text, removed). Compared with towns that hold no hideable house at all.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
it('vr29', async () => {
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { clean: { n: 0, ciEmpty: 0, ctEmpty: 0, ctLen: {} }, hidden: { n: 0, ciEmpty: 0, ciAllHidden: 0, ciLeftEmpty: 0, ctEmpty: 0, ctLeftEmpty: 0, ctNamed: 0, ctLen: {}, ctLeftLen: {} }, ctTypes: {}, ex: [] };
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'town', 'city', 'city', 'metropolis', 'metropolis']) for (const crisis of ['none', 'none', 'none', 'infiltrated', 'insurgency', 'indebted', 'wartime', 'none', 'occupied', 'politically_fractured']) {
    n += 1; const seed = `rv10-inv-${size}-${crisis}-${k}-${n}`;
    const A = JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} })));
    const sp = A.economicState?.safetyProfile || {}; const ci = Array.isArray(sp.criminalInstitutions) ? sp.criminalInstitutions : null; const ct = Array.isArray(sp.crimeTypes) ? sp.crimeTypes : null;
    const hid = (A.institutions || []).filter(hideable); const hn = hid.map((h) => String(h.name || '').toLowerCase()).filter(Boolean);
    for (const c of ct || []) { const t = String(c?.type || c); out.ctTypes[t] = out.ctTypes[t] || { clean: 0, hidden: 0 }; out.ctTypes[t][hid.length ? 'hidden' : 'clean'] += 1; }
    if (!hid.length) { const o = out.clean; o.n += 1; if (ci && !ci.length) o.ciEmpty += 1; if (ct && !ct.length) o.ctEmpty += 1; o.ctLen[ct ? ct.length : 'none'] = (o.ctLen[ct ? ct.length : 'none'] || 0) + 1; continue; }
    const o = out.hidden; o.n += 1; if (ci && !ci.length) o.ciEmpty += 1;
    const ciLeft = (ci || []).filter((x) => !hn.includes(String(x).toLowerCase())); if (ci && ci.length && !ciLeft.length) o.ciAllHidden += 1; if (ci && !ciLeft.length) o.ciLeftEmpty += 1;
    const named = (c) => { const s = JSON.stringify(c).toLowerCase(); return hn.some((h) => h.length > 3 && s.includes(h)); };
    const ctLeft = (ct || []).filter((c) => !named(c)); if ((ct || []).some(named)) o.ctNamed += 1;
    if (ct && !ct.length) o.ctEmpty += 1; if (ct && !ctLeft.length) o.ctLeftEmpty += 1;
    o.ctLen[ct ? ct.length : 'none'] = (o.ctLen[ct ? ct.length : 'none'] || 0) + 1; o.ctLeftLen[ctLeft.length] = (o.ctLeftLen[ctLeft.length] || 0) + 1;
    if (out.ex.length < 3 && (ct || []).some(named)) out.ex.push({ seed, ct: JSON.stringify(ct).slice(0, 300), hn });
  }
  writeFileSync(process.env.RV10_OUT, JSON.stringify(out, null, 1));
}, 14_400_000);
