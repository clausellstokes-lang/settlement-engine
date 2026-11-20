// REVIEW-VEIL-13 — TRAD-SHARE attack (1), WALKED, NOT LISTED: the shared rows (sharedTraditionRowsOf, drawn at save on the
// owner's record) against the same record with the fields of ONE EYE of ONE CARD KIND removed from every card of that kind
// (galleryVeil.js :: CARD_KINDS[kind].fields[eye], the veil's own declaration of what each eye a DM can shut takes). A row
// that moves is a word chosen by a field a DM's own act can hide. Born towns, the gate's recipe; RV13_CRIM=1 criminal dial
// on odd towns. Out: per kind:eye, the towns whose rows move, with one example (before | after) per kind:eye.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
const N = Number(process.env.RV9_N || 2);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
it('tradfloor', async () => {
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { sharedTraditionRowsOf } = await import(`${SRC}/src/domain/traditions/shownTraditions.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const at = (root, path) => { const star = path.indexOf('*'); if (star >= 0) return at(root, path.slice(0, star)).flatMap((o) => at(o, path.slice(star + 1))); let cur = root; for (const seg of path) cur = isRec(cur) ? cur[seg] : undefined; return Array.isArray(cur) ? cur.filter(isRec) : []; };
  const moved = {}; const ex = {}; let towns = 0; let rowsTowns = 0; let n = 0;
  for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
    n += 1; const tag = `${size}-${crisis}-${k}-${n}`; const seed = `r3m-${tag}`;
    const crim = process.env.RV13_CRIM && n % 2 ? { priorities: { ...(DEFAULT_CONFIG.priorities || {}), criminal: 85 }, _randomizePriorities: false } : {};
    const cfg = { ...DEFAULT_CONFIG, ...dials, ...crim, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    let A; try { A = clone(generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} })); } catch { continue; }
    if (process.env.RV13_POWPLANT && A.powerStructure && Array.isArray(A.powerStructure.factions)) A.powerStructure.factions.push({ faction: 'The Quiet Lanterns', category: '', power: 97, description: 'A temple order of priests that tends the shrines and keeps the vigils.' });
    towns += 1; const base = JSON.stringify(sharedTraditionRowsOf(A)); if (base !== 'null') rowsTowns += 1;
    for (const [kind, K] of Object.entries(veil.CARD_KINDS)) for (const [eye, keys] of Object.entries(K.fields || {})) {
      const B = clone(A); let touched = 0;
      for (const path of K.lists || []) for (const card of at(B, path)) for (const key of keys) if (key in card) { delete card[key]; touched += 1; }
      if (!touched) continue;
      const after = JSON.stringify(sharedTraditionRowsOf(B));
      const kx = `${kind}:${eye}`; moved[kx] = moved[kx] || { towns: 0, moved: 0 }; moved[kx].towns += 1;
      if (after !== base) { moved[kx].moved += 1; if (!ex[kx]) { const a = JSON.parse(base) || []; const b = JSON.parse(after) || []; const i = a.findIndex((r, j) => JSON.stringify(r) !== JSON.stringify(b[j])); ex[kx] = `${tag}: ${JSON.stringify(a[i]?.text ?? a[i]).slice(0, 260)} || ${JSON.stringify(b[i]?.text ?? b[i] ?? '(row gone)').slice(0, 260)}`; } }
    }
  }
  // the criminal groupings' removers, each alone
  const lines = [`towns ${towns}, with shared rows ${rowsTowns}`, 'kind:eye  towns-moved / towns-where-the-eye-held-a-field', ...Object.entries(moved).sort().map(([k2, v]) => `${v.moved}/${v.towns}\t${k2}${ex[k2] ? `\n    e.g. ${ex[k2]}` : ''}`)];
  writeFileSync(process.env.RV10_OUT, lines.join('\n') + '\n');
}, 14_400_000);
