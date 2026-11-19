// REVIEW-VEIL-9 — SENTENCES THAT EXIST ONLY BECAUSE A HIDEABLE HOUSE STANDS (the class of V9-1), by association over a
// corpus. Each birth of the tree's own pipeline (RV9_N per size: calm, and under each of the fifteen crises in turn),
// its public prose composed by the tree's own composer; the share a reader gets under the DEFAULT veil (the client's
// twin: galleryPayloadFor, then projectShareVeil over writeShareVeil({}, []), which the server matches 15 of 15 on the
// library) and, apart, with Reveal DM. Every string of the reader's copy is cut into sentences, the town's own name made
// {S} and every number #. A sentence form is KEPT when it occurs in towns that hold a hideable house and in NO town that
// holds none, and it is sent on a share whose every hideable house the veil withheld. Writes RV9_OUT.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const N = Number(process.env.RV9_N || 2); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = [null, null, 'under_siege', 'famine', 'occupied', 'politically_fractured', 'indebted', 'recently_betrayed', 'infiltrated', 'plague_onset', 'succession_void', 'monster_pressure', 'insurgency', 'religious_conversion', 'slave_revolt', 'wartime', 'mass_migration'];
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
it('REVIEW-VEIL-9: sentence forms tied to a hideable house', async () => {
  const M = `${SRC}/src`;
  const { generateSettlementPipeline } = await import(`${M}/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${M}/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${M}/store/configSlice.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  const { composePublicProse } = await import(`${M}/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${M}/domain/display/publicProse.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const forms = {}; const towns = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `rv9-assoc-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let rec; try { rec = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }); rec = withPublicProse(rec, composePublicProse(rec)); } catch (e) { towns.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const H = (rec.institutions || []).filter(hideable);
    const name = String(rec.name || '');
    const norm = (s) => s.split(name).join('{S}').replace(/\d+(?:[.,]\d+)?/g, '#').replace(/\s+/g, ' ').trim();
    for (const dm of [false, true]) {
      let page; try { const pub = veil.galleryPayloadFor(rec, { shareDm: dm, memberOverrides: {} }); page = veil.projectShareVeil(pub, veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' })); } catch (e) { towns.push({ seed, dm, veilThrew: String(e.message).slice(0, 100) }); continue; }
      const sentHouses = (page.institutions || []).filter(hideable);
      const allGone = H.length > 0 && sentHouses.length === 0;
      const seen = new Set();
      const walk = (v, p) => { if (Array.isArray(v)) v.forEach((x) => walk(x, `${p}[]`)); else if (isRec(v)) for (const [kk, x] of Object.entries(v)) walk(x, p ? `${p}.${kk}` : kk); else if (typeof v === 'string' && v.length >= 12 && / /.test(v)) for (const s of v.split(/(?<=[.!?;])\s+/)) { const f = norm(s); if (f.length < 20 || seen.has(f)) continue; seen.add(f);
        const r = forms[f] = forms[f] || { crim: new Set(), clean: new Set(), sentGone: new Set(), paths: new Set(), ex: null, by: {} };
        (H.length ? r.crim : r.clean).add(seed); const b = r.by[size] = r.by[size] || [new Set(), new Set()]; b[H.length ? 0 : 1].add(seed); if (allGone) { r.sentGone.add(`${seed}${dm ? ' (DM)' : ''}`); if (r.paths.size < 4) r.paths.add(p); if (!r.ex) r.ex = `${seed}: hidden [${H.map((h) => h.name).join('; ')}]`; } } };
      walk(page, '');
    }
    towns.push({ seed, size, hideable: H.map((h) => h.name) });
  }
  const kept = Object.entries(forms).filter(([, r]) => r.clean.size === 0 && r.sentGone.size > 0).map(([f, r]) => ({ form: f, crimTowns: r.crim.size, sentWithAllGone: r.sentGone.size, paths: [...r.paths], ex: r.ex }));
  kept.sort((a, b) => b.crimTowns - a.crimTowns);
  writeFileSync(process.env.RV9_OUT, JSON.stringify({ towns: towns.length, withHideable: towns.filter((t) => t.hideable?.length).length, threw: towns.filter((t) => t.threw || t.veilThrew), forms: Object.keys(forms).length,     townList: towns, formsAll: Object.fromEntries(Object.entries(forms).filter(([, r]) => r.sentGone.size > 0).map(([f, r]) => [f, { sentGone: r.sentGone.size, paths: [...r.paths], ex: r.ex, by: Object.fromEntries(Object.entries(r.by).map(([z, [c, cl]]) => [z, [c.size, cl.size]])) }])) }));
}, 14_400_000);
