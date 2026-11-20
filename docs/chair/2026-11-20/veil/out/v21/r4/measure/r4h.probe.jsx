import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
it('holders', async () => {
  const SRC = process.env.RV6_SRC;
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { isHideableHouse, isVeiledPower } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  await loadGenerationLawPayloads();
  const out = [];
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  for (const [size, crisis] of [['town','none'],['city','infiltrated'],['metropolis','none'],['town','indebted'],['city','under_siege'],['metropolis','wartime'],['village','none'],['city','politically_fractured']]) {
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    const s = JSON.parse(JSON.stringify(generateSettlementPipeline(cfg, null, { seed: `r4-measure-${size}-${crisis}`, customContent: {} })));
    const hid = (s.institutions || []).filter((h) => isRec(h) && isHideableHouse(h));
    const pub = veil.galleryPayloadFor(s, { shareDm: false, memberOverrides: {} });
    const dv = veil.defaultVeilFor(pub);
    const powers = ((s.powerStructure || {}).factions || []).filter(isRec);
    out.push({ town: `${size}-${crisis}`, hidden: hid.map((h) => `${h.id}|${h.name}|${h.category}`), defaultVeil: JSON.stringify(dv).slice(0,300),
      criminalPowers: powers.filter((p) => isVeiledPower(p)).map((p) => `${p.name}|${p.category}|hidden=${p.hidden}`),
      people: (s.npcs || []).filter((p) => isRec(p) && (p.category === 'criminal' || String(p.id).startsWith('npc_veiled_'))).map((p) => ({ id: p.id, name: p.name, role: p.role, cat: p.category, inst: p.institution, ms: (p.memberships || []).map((m) => `${m.power}${m.veiled ? '(veiled)' : ''}`) })) });
  }
  writeFileSync(process.env.RV9_OUT, JSON.stringify(out, null, 1));
}, 3600000);
