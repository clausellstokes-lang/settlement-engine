// R3-CURE-5 units 4 and 5 (VEIL-25's builder): THE OWNER'S COUNTS and THE RENAMED HOUSE, twin only (projectShareVeil over
// galleryPayloadFor; the server's twin parity is the born test's arm). The births of keys.probe.jsx (140: sizes x crises x 2).
// (a) power.entry's REACH: per hidden-house town, the criminal powers the served page (open read, Reveal off and on) lacks
// that the house-free counterfactual B still holds (no hidden house raised them). (b) VR42: born towns whose GOVERNING power
// is criminal (category or a thieves' name), whose row VR42 keeps. THE RENAMED HOUSE (PART 26 section 5): per town where a
// criminal house is hidden, ONE plant: another criminal house of the town SHOWN (its card and eyes opened) and renamed by the
// DM ("The Quiet Lantern"); does its operations-list line (safetyProfile.criminalInstitutions) survive, against the same read
// with the shown house NOT renamed?
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = 'village,town,town,city,city,metropolis,metropolis'.split(',');
const CRISES = 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured'.split(',');
const N = 2; const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const clone = (v) => JSON.parse(JSON.stringify(v));
const crimP = (f) => isRec(f) && (String(f.category || '').toLowerCase() === 'criminal' || (typeof f.category !== 'string' && /thie/i.test(String(f.faction ?? f.name ?? ''))));
it('R3-CURE-5 units 4-5', async () => {
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
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
  const at = '2026-11-01T00:00:00.000Z';
  const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
  const showsOf = (h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)];
  const read = (rec, dm, addrs) => { const ov = veil.writeShareVeil({}, addrs.map((a) => ({ address: a, hidden: false })), { mode: 'live', at }); return veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }), ov); };
  const crimNames = (d) => [...(d?.powerStructure?.factions || []), ...(d?.factions || [])].filter(crimP).map((f) => String(f.faction ?? f.name));
  const isCrimHouse = (h) => isRec(h) && /crimin/i.test(String(h.category || ''));
  const out = []; let idx = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
    const seed = `r3m-${size}-${crisis}-${k}-${idx}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    const A = birth(cfg, seed, null);
    const hidden = (A.institutions || []).filter((h) => isHideableHouse(h));
    const rec = { seed, size, crisis, hidden: hidden.length, vr42: (A.powerStructure?.factions || []).filter((f) => crimP(f) && f.isGoverning === true).map((f) => f.faction ?? f.name) };
    if (hidden.length) {
      const B = birth(cfg, seed, (h) => isHideableHouse(h));
      const bCrim = new Set(crimNames(B)); const aCrim = crimNames(A);
      rec.reach = {};
      for (const dm of [false, true]) { const s = new Set(crimNames(read(A, dm, OPEN))); rec.reach[dm ? 'dm' : 'off'] = aCrim.filter((n) => !s.has(n) && bCrim.has(n)); }
      // THE RENAMED HOUSE: a criminal house hidden, another criminal house shown and renamed
      const crimHidden = hidden.filter(isCrimHouse);
      const cand = (A.institutions || []).filter(isCrimHouse).find((h) => crimHidden.some((x) => x !== h));
      rec.crimHidden = crimHidden.length;
      if (crimHidden.length && cand) {
        const plain = read(A, false, [...OPEN, ...showsOf(cand)]);
        const R = clone(A); const h2 = R.institutions.find((h) => h.name === cand.name && h.category === cand.category);
        h2.name = 'The Quiet Lantern';
        const renamed = read(R, false, [...OPEN, ...showsOf(h2)]);
        const ops = (d) => d?.economicState?.safetyProfile?.criminalInstitutions ?? null;
        const lost = JSON.stringify(ops(plain)) !== JSON.stringify(ops(renamed));
        const servedAs = (d, n) => (d.institutions || []).some((h) => h?.name === n);
        rec.rename = { house: cand.name, shownPlain: servedAs(plain, cand.name), shownRenamed: servedAs(renamed, 'The Quiet Lantern'), opsPlain: ops(plain), opsRenamed: ops(renamed), lost };
      }
    }
    out.push(rec);
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
