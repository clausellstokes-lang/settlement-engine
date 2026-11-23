// R3-CURE-5 unit 2 (VEIL-25's builder; the chair's rulings of 12:21 UTC): THE KEY-LEVEL HUSKS, MEASURE ONLY. The births of
// out/v24/r3c2/measure/keys.probe.jsx (sizes x crises x N, seed r3m-<size>-<crisis>-<k>-<idx>, the same `birth`, the same
// opened veil). NOTHING-HIDDEN PAGES: a control town (no hideable house) and every house-free counterfactual B (the generator
// with every hideable house cut at every step), each read by the twin (projectShareVeil over galleryPayloadFor), Reveal DM
// off and on. On them, by town size and holder kind: how many served powers carry `contestsNiche` (each list), how many
// served people carry each affiliation key. CUT PAGES: each town A with a hideable house, read the same way: every served
// holder whose counterpart in the projection (`pub`, by name / person id) carried the key and is served without it; its
// kind and size, against the nothing-hidden rate of the same kind and size; and whether any served string still names the
// cut value (the lane's fold, the served powers' names its open names). TWIN ONLY (the server: not read here). Out: RV9_OUT.
// RV9_SHAPE=master: master's stored shape (the top-level factions[] beside powerStructure.factions[]); `stored`: the born town's own holders.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 2); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const AFF = ['factionAffiliation', 'faction', 'affiliation', 'factionId'];
const clone = (v) => JSON.parse(JSON.stringify(v));
it('R3-CURE-5 unit 2 key-level measure', async () => {
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
    if (drop) cut(t.institutions);
    t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
    return clone(t);
  };
  const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  const SHAPE = process.env.RV9_SHAPE || 'lane';
  // master's stored shape (R3-CURE's openM): the powers ALSO in the top-level factions[], R4's twins
  const shaped = (rec) => (SHAPE === 'master' ? { ...rec, factions: clone(rec.powerStructure?.factions || []) } : rec);
  const read = (rec0, dm) => { const rec = shaped(rec0); const pub = veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }); return [pub, veil.projectShareVeil(clone(pub), ov)]; };
  const lists = (d) => [['powerStructure.factions', d?.powerStructure?.factions], ['factions', d?.factions]];
  const pkind = (f) => (f.isGoverning === true ? 'governing' : String(f.category || 'none').toLowerCase());
  /** the holders of a page: [{ list, kind, name, has: {key: bool} }] */
  const holders = (d) => {
    const out = [];
    for (const [l, xs] of lists(d)) for (const f of (Array.isArray(xs) ? xs : []).filter(isRec)) out.push({ list: l, kind: `power:${pkind(f)}`, key: 'contestsNiche', has: typeof f.contestsNiche === 'string' && f.contestsNiche !== '' });
    for (const n of (Array.isArray(d?.npcs) ? d.npcs : []).filter(isRec)) for (const k of AFF) out.push({ list: 'npcs', kind: `person:${(Array.isArray(n.memberships) && n.memberships.length) ? 'member' : 'nomember'}`, key: k, has: typeof n[k] === 'string' && n[k] !== '' });
    return out;
  };
  const strings = (v, p, out) => { if (typeof v === 'string') out.push([p, v]); else if (Array.isArray(v)) v.forEach((x) => strings(x, `${p}[]`, out)); else if (isRec(v)) for (const k of Object.keys(v)) { out.push([`${p}.{KEY}`, k]); strings(v[k], p ? `${p}.${k}` : k, out); } return out; };
  const out = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch (e) { out.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const hidden = (A.institutions || []).filter((h) => isHideableHouse(h));
    const rec = { seed, size, crisis, shape: SHAPE, hidden: hidden.map((h) => h.name), pages: [], stored: holders(shaped(A)) };
    const nothing = [];
    if (!hidden.length) nothing.push(['control', A]);
    else { try { nothing.push(['counterfactual', birth(cfg, seed, (h) => isHideableHouse(h))]); } catch (e) { rec.Bthrew = String(e.message).slice(0, 100); } }
    for (const [role, T] of nothing) for (const dm of [false, true]) {
      const [pub, d] = read(T, dm);
      rec.pages.push({ role, dm, served: holders(d), pub: holders(pub) });
    }
    if (hidden.length) for (const dm of [false, true]) {
      const [pub, d] = read(A, dm);
      const opens = lists(d).flatMap(([, xs]) => (Array.isArray(xs) ? xs : [])).filter(isRec).flatMap((f) => [f.faction, f.name]).filter((v) => typeof v === 'string' && v);
      const cuts = [];
      for (const [l, xs] of lists(d)) for (const f of (Array.isArray(xs) ? xs : []).filter(isRec)) {
        const nm = f.faction ?? f.name;
        const [, pxs] = lists(pub).find(([pl]) => pl === l);
        const f0 = (Array.isArray(pxs) ? pxs : []).find((z) => isRec(z) && (z.faction ?? z.name) === nm);
        if (f0 && typeof f0.contestsNiche === 'string' && f0.contestsNiche !== '' && f.contestsNiche !== f0.contestsNiche) cuts.push({ list: l, kind: `power:${pkind(f)}`, key: 'contestsNiche', value: f0.contestsNiche, servedValue: f.contestsNiche ?? null });
      }
      for (const n of (Array.isArray(d.npcs) ? d.npcs : []).filter(isRec)) {
        const n0 = (Array.isArray(pub.npcs) ? pub.npcs : []).find((z) => isRec(z) && z.id === n.id);
        if (!n0) continue;
        for (const key of AFF) if (typeof n0[key] === 'string' && n0[key] !== '' && n[key] !== n0[key]) cuts.push({ list: 'npcs', kind: `person:${(Array.isArray(n.memberships) && n.memberships.length) ? 'member' : 'nomember'}`, key, value: n0[key], servedValue: n[key] ?? null, memberships: (n.memberships || []).length });
      }
      const all = strings(d, '', []);
      for (const c of cuts) { const s = buildNameSearch([c.value], opens); c.stillNamed = s ? all.filter(([, v]) => s.hit(v)).map(([p]) => p) : []; }
      rec.pages.push({ role: 'hidden', dm, served: holders(d), pub: holders(pub), cuts });
    }
    out.push(rec);
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
