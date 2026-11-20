// R3-CURE-4 unit 1, THE MECHANISM (twin): server-veil-city-2 and server-veil-metropolis-7 built as galleryServerVeil builds them,
// default veil + Reveal DM; per person whose STORED goal names/targets the Thieves' Guild: the goal in the projection (pub), after
// the hidden-house name search (gallerySecondHomes.buildNameSearch over the houses hidden whole), and as served by the twin.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
// THE TRACE: each pass of applyVeil that touches the goals, wrapped (the module's own functions, called as they are)
const TRACE = vi.hoisted(() => ({ on: false, log: [] }));
const snap = (s) => Object.fromEntries((s.npcs || []).filter((n) => n && n.goal).map((n) => [n.id, JSON.stringify(n.goal)]));
vi.mock(`${process.env.RV6_SRC}/src/domain/display/gallerySecondHomes.js`, async (orig) => {
  const m = await orig();
  return { ...m, withholdSecondHomes: (s, ...a) => { const b = snap(s); const r = m.withholdSecondHomes(s, ...a); if (TRACE.on) TRACE.log.push(['withholdSecondHomes (its last step: sweepHiddenNames)', b, snap(s)]); return r; } };
});
vi.mock(`${process.env.RV6_SRC}/src/domain/display/galleryRosterChoices.js`, async (orig) => {
  const m = await orig();
  return { ...m, applyRosterChoices: (s, ...a) => { const b = snap(s); const r = m.applyRosterChoices(s, ...a); if (TRACE.on) TRACE.log.push(['applyRosterChoices (power.entry, then withholdPowerCopies)', b, snap(s)]); return r; } };
});
const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
const TOWNS = [{ seed: 'server-veil-city-2', settType: 'city' }, { seed: 'server-veil-metropolis-7', settType: 'metropolis' }];
const clone = (v) => JSON.parse(JSON.stringify(v));
it('husk mechanism', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const sh = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const out = [];
  for (const town of TOWNS) {
    const { seed, ...cfg } = town;
    const raw = gen({ ...BROWSER, ...cfg }, null, { seed, customContent: {} });
    const record = { ...raw, publicProse: compose(raw) };
    const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-11T00:00:00.000Z', snapshot: null });
    const pub = veil.galleryPayloadFor(clone(record), { shareDm: true, memberOverrides: ov });
    const defaults = veil.resolveVeil(veil.defaultVeilFor(pub), veil.readShareVeil(ov).deltas);
    const hiddenHouses = (pub.institutions || []).filter((h) => defaults.has(`card:institution:${veil.CARD_KINDS.institution.idOf(h)}`)).map((h) => h.name);
    const houseSearch = sh.buildNameSearch(hiddenHouses, []);
    TRACE.on = true; TRACE.log.length = 0;
    const tw = veil.projectShareVeil(clone(pub), ov);
    TRACE.on = false;
    const people = [];
    for (const p of record.npcs || []) {
      const g = p?.goal; if (!g) continue;
      const tids = ['short', 'long'].map((k) => g.intent?.[k]?.target?.id);
      if (!tids.includes("Thieves' Guild") && !/thie/i.test(`${g.short} ${g.long}`)) continue;
      const pp = (pub.npcs || []).find((x) => x?.id === p.id); const tp = (tw.npcs || []).find((x) => x?.id === p.id);
      const passes = TRACE.log.map(([nm, b, a]) => ({ pass: nm, before: b[p.id] ?? null, after: a[p.id] ?? null, changed: (b[p.id] ?? null) !== (a[p.id] ?? null) }));
      people.push({ passes, id: p.id, stored: g, inPub: pp?.goal ?? null, houseSearchHits: { short: houseSearch?.hit(String(g.short ?? '')), long: houseSearch?.hit(String(g.long ?? '')), tids: tids.map((t) => (typeof t === 'string' ? houseSearch?.hit(t) : null)) }, served: tp ? (tp.goal ?? 'NO GOAL KEY') : 'NO CARD' });
    }
    out.push({ rels: { pub: pub.powerStructure?.factionRelationships, served: tw.powerStructure?.factionRelationships }, seed, hiddenHouses, pubPowers: (pub.powerStructure?.factions || []).map((f) => [f.faction, f.category, f.hidden ?? null, f.isGoverning ?? null]),
      servedPowers: (tw.powerStructure?.factions || []).map((f) => f.faction), people });
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
}, 3600000);
