// REVIEW-VEIL-9 — THE COUNTERFACTUAL DIFFER (the chair's ask, 2026-11-19 06:50). For born towns of every tier (calm and
// under crises), three births on ONE seed by the tree's own pipeline (RV9_GEN, default RV6_SRC):
//   A  the town as born;
//   B  the same town with every house of the hideable class (category Criminal or the tag criminal) taken out of the
//      roster after EVERY step (onStep; a later pass that re-adds one loses it again), so nothing downstream sees one;
//   C  the CONTROL: the same number of ordinary houses (not required, not hideable; chosen by a fixed order of A's
//      roster) taken out the same way. C measures what removing ANY house re-rolls.
// Each composed (public prose) by RV9_GEN's composer when it has one. Each read through the client twin of RV9_VEIL
// (default RV6_SRC; equal to the server on the library's 15 shares): galleryPayloadFor, then projectShareVeil, under
// three veils: the DEFAULT (writeShareVeil({}, [])), HAND (each hideable house's whole-card eye; on B and C the same
// addresses where the card exists), EVERY EYE SHUT (each town's own addresses). Reveal DM off and on.
// A field path is IN THE CLASS where served(A) and served(B) differ beyond the withheld houses; its rate under C says
// how much of it is a re-roll. Writes RV9_OUT: per normalised path, towns differing A/B and A/C, by veil, with examples.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const GEN = process.env.RV9_GEN || process.env.RV6_SRC; const VEIL = process.env.RV9_VEIL || process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 1); const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hideable = (h) => isRec(h) && (/criminal/i.test(String(h.category || '')) || (Array.isArray(h.tags) && h.tags.includes('criminal')));
const KEYS = ['id', 'name', 'faction', 'chainId', 'source', 'type', 'label', 'title'];
const keyOf = (o) => { for (const k of KEYS) if (typeof o[k] === 'string' && o[k]) return `${k}=${o[k]}`; return null; };
const strip = (s) => (typeof s === 'string' ? s.replace(/\s*vq6n[0-9]+z/gi, '') : s);
function diff(a, b, p, out) {
  if (Array.isArray(a) && Array.isArray(b)) {
    const recs = [...a, ...b].every(isRec) && [...a, ...b].every((o) => keyOf(o));
    if (recs) { const ma = new Map(a.map((o) => [keyOf(o), o])); const mb = new Map(b.map((o) => [keyOf(o), o]));
      for (const [k, o] of ma) if (mb.has(k)) diff(o, mb.get(k), `${p}[]`, out); else out.push([`${p}[] (only in A)`, k, '']);
      for (const [k] of mb) if (!ma.has(k)) out.push([`${p}[] (only in B)`, '', k]); return; }
    if ([...a, ...b].every((x) => typeof x !== 'object' || x === null)) { const sa = new Set(a.map(strip)); const sb = new Set(b.map(strip));
      for (const x of sa) if (!sb.has(x)) out.push([`${p}[] (only in A)`, x, '']); for (const x of sb) if (!sa.has(x)) out.push([`${p}[] (only in B)`, '', x]); return; }
    const n = Math.max(a.length, b.length); for (let i = 0; i < n; i += 1) diff(a[i], b[i], `${p}[]`, out); return; }
  if (isRec(a) && isRec(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], p ? `${p}.${k}` : k, out); return; }
  if (strip(a) !== strip(b) && !(a === undefined && b === undefined)) out.push([p, a, b]);
}
it('REVIEW-VEIL-9: the counterfactual differ', async () => {
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  let compose = null; let withPP = null;
  try { compose = (await import(`${GEN}/src/components/new/publicProseCompose.js`)).composePublicProse; withPP = (await import(`${GEN}/src/domain/display/publicProse.js`)).withPublicProse; } catch { /* master: no composer */ }
  const veil = await import(`${VEIL}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
    if (drop) cut(t.institutions);
    if (compose) { t = { ...t }; delete t.publicProse; t = withPP(t, compose(t)); }
    return t;
  };
  const served = (rec, dm, kind, handAddrs) => {
    const pub = veil.galleryPayloadFor(rec, { shareDm: dm, memberOverrides: {} });
    let eyes = [];
    if (kind === 'hand') eyes = handAddrs;
    if (kind === 'all') { const m = veil.curateModelFor(pub, []); eyes = m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address), ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]); }
    return veil.projectShareVeil(pub, veil.writeShareVeil({}, eyes.map((a) => ({ address: a, hidden: true })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' }));
  };
  const census = {}; const towns = []; let idx = 0;
  const bump = (veilKind, which, path, seed, ex) => { const r = census[path] = census[path] || { B: {}, C: {}, ex: {} }; (r[which][veilKind] = r[which][veilKind] || new Set()).add(seed); if (!r.ex[`${which} ${veilKind}`]) r.ex[`${which} ${veilKind}`] = ex; };
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `rv9-diff-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = birth(cfg, seed, null); } catch (e) { towns.push({ seed, threw: String(e.message).slice(0, 100) }); continue; }
    const H = (A.institutions || []).filter(hideable); if (!H.length) { towns.push({ seed, size, hideable: 0 }); continue; }
    const ordinary = (A.institutions || []).filter((h) => isRec(h) && !hideable(h) && !h.required).map((h) => h.name).sort((x, y) => (x.length * 7919 + x.charCodeAt(0)) % 101 - (y.length * 7919 + y.charCodeAt(0)) % 101);
    const cNames = new Set(ordinary.slice(0, H.length));
    let B; let C; try { B = birth(cfg, seed, hideable); C = birth(cfg, seed, (h) => isRec(h) && cNames.has(h.name)); } catch (e) { towns.push({ seed, threw: `B/C ${String(e.message).slice(0, 100)}` }); continue; }
    towns.push({ seed, size, hideable: H.map((h) => h.name), control: [...cNames], bHasHideable: (B.institutions || []).filter(hideable).length });
    const pubA0 = veil.galleryPayloadFor(A, { shareDm: true, memberOverrides: {} }); const mA = veil.curateModelFor(pubA0, []);
    const hand = mA.sections.flatMap((s) => s.cards.filter((c) => c.kind === 'institution' && c.whole && H.some((h) => String(c.id) === String(h.id) || c.title === h.name || c.name === h.name || String(c.whole.address).includes(encodeURIComponent(h.name)) || String(c.whole.address).toLowerCase().includes(String(h.name).toLowerCase()))).map((c) => c.whole.address));
    for (const dm of [false, true]) for (const kind of ['default', 'hand', 'all']) {
      const vk = `${kind}${dm ? ' +DM' : ''}`;
      let sA; let sB; let sC; try { sA = served(A, dm, kind, hand); sB = served(B, dm, kind, hand); sC = served(C, dm, kind, hand); } catch (e) { towns.push({ seed, veilThrew: String(e.message).slice(0, 100) }); continue; }
      const sentH = (sA.institutions || []).filter(hideable).length; if (sentH && kind !== 'none') { bump(vk, 'B', '(a hideable house still SENT on A)', seed, `${sentH}`); }
      for (const [which, other] of [['B', sB], ['C', sC]]) { const out = []; diff(sA, other, '', out); const seenP = new Set();
        for (const [p, a, b] of out) { if (seenP.has(p)) continue; seenP.add(p); bump(vk, which, p, seed, `${seed}: A=${JSON.stringify(strip(a))?.slice(0, 160)} | ${which}=${JSON.stringify(strip(b))?.slice(0, 160)}`); } }
    }
  }
  const rows = Object.entries(census).map(([p, r]) => ({ path: p, B: Object.fromEntries(Object.entries(r.B).map(([v, s]) => [v, s.size])), C: Object.fromEntries(Object.entries(r.C).map(([v, s]) => [v, s.size])), ex: r.ex }));
  writeFileSync(process.env.RV9_OUT, JSON.stringify({ towns, rows }));
}, 14_400_000);
