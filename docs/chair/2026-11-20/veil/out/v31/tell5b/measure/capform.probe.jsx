// R3-TELL-5b unit (iii) MEASURE FIRST (VEIL-31's builder): THE CAPTURE FORM, read-only (no line of 212 or the twin).
// Twin pages only (the gate reads the server beside it). Per page: `powerStructure.criminalCaptureState`'s value, every
// power row carrying `captureState` (name|category|isGoverning|value), every relation row carrying `captureState`
// (pair|type|value), and the criminal houses / powers the PAGE serves (tell-surface.mjs :: namesOf, the gate's own read).
//   RV9_MODE=towns  the gate's 140 births (tell-common.mjs :: pool, RV9_N=2), every setting but g:111, Reveal off and on;
//                   the stored record's capture fields beside them.
//   RV9_MODE=pool   the cached pool's births (RV9_POOL_DIR) re-born whole, every RV9_STRIDE-th: part A under every setting,
//                   part B under the settings that hide nothing it holds (tell2.probe.jsx :: showAll), Reveal off and on.
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { loadEngine, loadVeil, clone, isRec, OPEN } from '../../../v27/tell/measure/tell-common.mjs';
import { namesOf } from '../../../v27/tell/measure/tell-surface.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
const MODE = process.env.RV9_MODE || 'towns';
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
it(`R3-TELL-5b capture form (${MODE})`, async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
  const capOf = (page) => {
    const d = isRec(page) ? page : {}; const { H, P } = namesOf(E.isHideableHouse, d); const ps = isRec(d.powerStructure) ? d.powerStructure : {};
    const powers = [...recs(ps.factions), ...recs(d.factions)];
    return {
      ccs: 'criminalCaptureState' in ps ? String(ps.criminalCaptureState) : '#absent',
      pw: powers.filter((f) => 'captureState' in f).map((f) => `${f.faction ?? f.name}|${f.category}|gov=${f.isGoverning === true}|${JSON.stringify(f.captureState)}`),
      rel: recs(ps.factionRelationships).filter((r) => 'captureState' in r).map((r) => `${JSON.stringify(r.pair)}|${r.type}|${JSON.stringify(r.captureState)}`),
      crimH: recs(d.institutions).filter((h) => H.has(String(h.name ?? ''))).map((h) => String(h.name)),
      crimP: powers.filter((f) => P.has(String(f.faction ?? f.name ?? '')) || String(f.category ?? '').toLowerCase() === 'criminal').map((f) => `${f.faction ?? f.name}|gov=${f.isGoverning === true}`),
      gov: (powers.find((f) => f.isGoverning === true) || {}).category ?? null,
    };
  };
  const showAll = (doc, dm) => {
    const { sc, deltas } = V.settings(doc, dm);
    const cards = (doc.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => ({ address: `card:institution:${V.veil.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
    const out = {};
    for (const [k, d] of Object.entries(deltas)) if (k.startsWith('g:') || k === 'own') out[k] = [...d, ...cards];
    out.allShown = [...V.sw.setCriminalVeil(V.opened(OPEN), sc.defaults, false, sc.present, sc.model), ...cards];
    return out;
  };
  const allSettings = (doc, dm) => V.settings(doc, dm).deltas;
  const pagesOf = (doc, setsOf) => { const out = {}; for (const dm of [false, true]) for (const [k, d] of Object.entries(setsOf(doc, dm))) if (k !== 'g:111') out[`${dm ? 'dm' : 'off'}|${k}`] = capOf(V.twin(doc, dm, V.write(d))); return out; };
  const out = { mode: MODE, births: [] };
  if (MODE === 'towns') {
    for (const b of E.pool(Number(process.env.RV9_N || 2), SHARD)) {
      const A = E.birth(b.cfg, b.seed, null);
      const hidden = (A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => h.name);
      out.births.push({ seed: b.seed, size: b.size, crisis: b.crisis, hidden, stored: capOf(A), pages: pagesOf(A, allSettings) });
    }
  } else {
    const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
    const { birthConfig } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
    const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    const born = (size, crisis, seed) => { let t = generateSettlementPipeline(birthConfig(cfgOf(size, crisis)), null, { seed, customContent: {} }); t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t)); return clone(t); };
    const dir = process.env.RV9_POOL_DIR; const STRIDE = Number(process.env.RV9_STRIDE || 1);
    const shards = readdirSync(dir).filter((f) => /^poolb?-shard\d+\.json$/.test(f)).sort().map((f) => ({ b: f.startsWith('poolb'), ...JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')) }));
    let i = 0;
    for (const sh of shards) for (const c of sh.births) {
      i += 1; if (i % STRIDE !== 0 || (i / STRIDE) % SHARD[1] !== SHARD[0]) continue;
      const doc = born(c.size, c.crisis, c.seed);
      out.births.push({ seed: c.seed, size: c.size, part: sh.b ? 'B' : 'A', stored: capOf(doc), pages: pagesOf(doc, sh.b ? showAll : allSettings) });
    }
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
