// VEIL-V102: the curate screen lists each kind's cards from its FIRST list (galleryVeil.js :: curateModelFor, k.lists[0])
// while the applier reaches every list (cardsOf). On born towns (V102_GEN), both Reveal-DM settings: per kind, the ids
// found only in a later list, and the depth fields whose value sits only on a later copy of a listed card.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const GEN = process.env.V102_GEN || process.cwd();
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('lists', async () => {
  const veil = await import(`${process.cwd()}/src/domain/display/galleryVeil.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const listAt = (root, path) => { let c = root; for (const s of path) { if (!isRec(c)) return []; c = c[s]; } return Array.isArray(c) ? c.filter(isRec) : []; };
  const copies = (s, path) => { const star = path.indexOf('*'); if (star < 0) return listAt(s, path); return listAt(s, path.slice(0, star)).flatMap((o) => listAt(o, path.slice(star + 1))); };
  const has = (v) => v != null && !(Array.isArray(v) && !v.length) && v !== '';
  const R = { onlyLater: {}, valueOnlyLater: {}, ex: {} }; const bump = (o, k) => { o[k] = (o[k] || 0) + 1; };
  for (const settType of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'insurgency', 'occupied', 'indebted']) {
    const seed = `v102-lists-${settType}-${crisis}`;
    const cfg = { ...DEFAULT_CONFIG, ...dials, settType, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
    const A = JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} })));
    for (const dm of [false, true]) {
      const pub = veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: {} });
      for (const [kind, k] of Object.entries(veil.CARD_KINDS)) {
        const first = new Map(copies(pub, k.lists[0]).map((c) => [k.idOf(c), c]));
        const later = k.lists.slice(1).flatMap((p) => copies(pub, p));
        for (const c of later) {
          const id = k.idOf(c);
          if (!first.has(id)) { bump(R.onlyLater, `${kind} dm=${dm}`); R.ex[`${kind} only`] = R.ex[`${kind} only`] || `${seed} ${id}`; continue; }
          for (const [field, keys] of Object.entries(k.fields)) {
            if (!keys.length) continue;
            if (keys.some((x) => has(c[x])) && !keys.some((x) => has(first.get(id)[x]))) { bump(R.valueOnlyLater, `${kind}.${field} dm=${dm} cat=${String(c.category || '')}`); R.ex[`${kind}.${field}`] = R.ex[`${kind}.${field}`] || `${seed} ${id}`; }
          }
        }
      }
    }
  }
  writeFileSync(process.env.V102_OUT, JSON.stringify(R, null, 1));
}, 3_600_000);
