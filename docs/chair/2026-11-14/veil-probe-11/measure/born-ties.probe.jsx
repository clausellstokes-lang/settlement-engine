// VEIL-11 measure: over born towns, (5) a prominentRelationship / pressureSentence that tells a covert tie the public
// projection drops; (2) impressions that hold their own person's appearance by the words (both directions).
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v : '');
it('born ties', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const sh = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.V11_N || 20); const PFX = process.env.V11_SEED || 'v11-ties';
  const c = { towns: 0, withPr: 0, prCovert: 0, prCovertSentPublic: 0, prCovertSentDm: 0, psNamesCovert: 0, psNamesCovertSentPublic: 0, psIsCovertPhrasing: 0, npcs: 0, impr: 0, imprWords: 0, imprWordsLower: 0 };
  const types = new Map(); const samples = [];
  const match = (t, pr) => (str(t.npc1Name) === str(pr.npc1) && str(t.npc2Name) === str(pr.npc2) && str(t.typeName) === str(pr.type))
    || (str(pr.full) !== '' && t.description === pr.full) || (str(pr.tension) !== '' && t.tension === pr.tension);
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let s; try { s = gen(density.birthConfig(cfg), null, { seed: `${PFX}-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    c.towns += 1;
    const rels = (Array.isArray(s.relationships) ? s.relationships : []).filter(isRec);
    const covert = rels.filter(t => t.covert === true);
    const pub = veil.galleryPayloadFor(JSON.parse(JSON.stringify(s)), { shareDm: false });
    const dm = veil.galleryPayloadFor(JSON.parse(JSON.stringify(s)), { shareDm: true });
    const pr = s.prominentRelationship;
    if (isRec(pr)) {
      c.withPr += 1;
      if (covert.some(t => match(t, pr))) {
        c.prCovert += 1; const ty = str(pr.type); types.set(ty, (types.get(ty) || 0) + 1);
        if (isRec(pub.prominentRelationship)) c.prCovertSentPublic += 1;
        if (isRec(dm.prominentRelationship)) c.prCovertSentDm += 1;
        if (samples.length < 3) samples.push(`${settType}/${stress || 'calm'}/${i}: ${JSON.stringify({ npc1: pr.npc1, npc2: pr.npc2, type: pr.type }).slice(0, 140)}`);
      }
    }
    const ps = s.pressureSentence;
    if (typeof ps === 'string' && covert.some(t => str(t.npc1Name) && str(t.npc2Name) && ps.includes(t.npc1Name) && ps.includes(t.npc2Name))) {
      c.psNamesCovert += 1; if (typeof pub.pressureSentence === 'string') c.psNamesCovertSentPublic += 1;
      if (isRec(pr) && covert.some(t => match(t, pr)) && (ps.includes(str(pr.phrasing)) && str(pr.phrasing))) c.psIsCovertPhrasing += 1;
    }
    for (const n of (Array.isArray(s.npcs) ? s.npcs : []).filter(isRec)) {
      c.npcs += 1; const im = n.presentation?.impression; if (typeof im !== 'string') continue; c.impr += 1;
      const pieces = sh.secondHomePieces(n.physical);
      const lo = (t) => t.toLowerCase();
      if (pieces.some(p => im.includes(p)) || sh.secondHomePieces(im).some(q => pieces.some(p => p.includes(q)))) c.imprWords += 1;
      if (pieces.some(p => lo(im).includes(lo(p))) || sh.secondHomePieces(im).some(q => pieces.some(p => lo(p).includes(lo(q))))) c.imprWordsLower += 1;
    }
  }
  writeFileSync(process.env.V11_OUT, `${JSON.stringify(c)}\ncovert types: ${JSON.stringify([...types])}\n${samples.join('\n')}\n`);
}, 14_400_000);
