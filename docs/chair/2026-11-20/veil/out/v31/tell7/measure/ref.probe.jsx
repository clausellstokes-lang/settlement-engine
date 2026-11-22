// R3-TELL-7 step 2 (the chair's 04:23 ruling (3): THE REFERENCE IS THE RECORD): per hidden-house town, the served page's own
// facts re-run through the engine's own writer: generateSafetyProfile(served config, served tier, served houses), then its own
// late settlement settleCrimeLinesToSignal over the served seats, houses, tensions and services
// (safetyProfile.js; the page's precedent: pageRederive.js :: rederiveForPage), its three lists, against the served lists and
// the house-free twin's (RV9_CONTROLS=1: the gate's 48 controls instead, B = A). Twin engine only (step 1: server = twin on every page). Out: RV9_OUT.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
import { loadEngine, loadVeil, isRec } from '../../../v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC;
it('R3-TELL-7 step 2: the record reference', async () => {
  const E = await loadEngine(SRC); const V = await loadVeil(SRC);
  const { generateSafetyProfile, settleCrimeLinesToSignal } = await import(`${SRC}/src/generators/safetyProfile.js`);
  // the engine's own late settlement (assembleSettlement.js :: settleCrimeLinesToSignal's call), over what the page serves
  const settled = (S, sp) => settleCrimeLinesToSignal({ ...(S.economicState || {}), safetyProfile: sp }, { seats: S.powerStructure?.factions, estate: S.institutions, tensions: S.history?.currentTensions, services: S.availableServices })?.safetyProfile;
  const L = (sp) => (isRec(sp) ? { crimeTypes: Array.isArray(sp.crimeTypes) ? sp.crimeTypes.map((c) => c?.type) : '#absent', ops: Array.isArray(sp.criminalInstitutions) ? sp.criminalInstitutions : '#absent', plotHooks: Array.isArray(sp.plotHooks) ? sp.plotHooks : '#absent' } : null);
  const out = [];
  for (const b of E.pool(2, [0, 1])) {
    const A = E.birth(b.cfg, b.seed, null);
    const held = (A.institutions || []).some((h) => E.isHideableHouse(h)); if (process.env.RV9_CONTROLS === "1" ? held : !held) continue;
    const B = held ? E.birth(b.cfg, b.seed, (h) => E.isHideableHouse(h)) : A;
    const rec = { seed: b.seed, size: b.size, cfgKeys: Object.keys(A.config || {}).filter((k) => /priority|stress/i.test(k)), pages: {} };
    for (const dm of [false, true]) {
      const S = V.twin(A, dm, V.write(V.settings(A, dm).deltas.own)); const TB = V.twin(B, dm, V.write(V.settings(B, dm).deltas.own));
      const cfg = isRec(S?.config) ? S.config : null;
      let ref = null; let refStored = null;
      try { ref = cfg ? L(settled(S, generateSafetyProfile(cfg, S.tier, (S.institutions || []).filter(isRec)))) : '#noconfig'; } catch (e) { ref = `#threw ${String(e.message).slice(0, 80)}`; }
      try { refStored = L(generateSafetyProfile(A.config, A.tier, (A.institutions || []).filter(isRec))); } catch (e) { refStored = `#threw`; }
      rec.pages[dm ? 'dm' : 'off'] = { served: L(S?.economicState?.safetyProfile), twinB: L(TB?.economicState?.safetyProfile), ref, refStoredAllHouses: refStored, storedA: L(A.economicState?.safetyProfile),
        cfgSame: JSON.stringify(Object.fromEntries(rec.cfgKeys.map((k) => [k, S?.config?.[k]]))) === JSON.stringify(Object.fromEntries(rec.cfgKeys.map((k) => [k, A.config?.[k]]))) };
    }
    out.push(rec);
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 3_600_000);
