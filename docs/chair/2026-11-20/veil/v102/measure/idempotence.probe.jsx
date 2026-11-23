// VEIL-V102 item 0 (the chair, 02:29 UTC): after D (427ea0bed), is the veil IDEMPOTENT on a served copy where nothing more
// is withheld (applyVeil(V, R) against V = applyVeil(pub, R), the same resolved set), and what does VS1 (c)'s second veil
// change? The twelve births of tests/domain/display/criminalVeilSwitch.test.js, plain and Reveal DM, three drafts each.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
function diff(a, b, p, out) {
  if (out.length > 6) return;
  if (Array.isArray(a) && Array.isArray(b)) { for (let i = 0; i < Math.max(a.length, b.length); i += 1) diff(a[i], b[i], `${p}[${i}]`, out); return; }
  if (isRec(a) && isRec(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], p ? `${p}.${k}` : k, out); return; }
  if (JSON.stringify(a) !== JSON.stringify(b)) out.push(`${p}: ${JSON.stringify(a)?.slice(0, 70)} -> ${JSON.stringify(b)?.slice(0, 70)}`);
}
it('idempotence', async () => {
  const V = await import(`${process.cwd()}/src/domain/display/galleryVeil.js`);
  const sw = await import(`${process.cwd()}/src/domain/display/criminalVeilSwitch.js`);
  const { generateSettlementPipeline: gen } = await import(`${process.cwd()}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${process.cwd()}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${process.cwd()}/src/store/configSlice.js`);
  await density.loadGenerationLawPayloads();
  const B = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const SEEDS = ['thorp-0', 'thorp-3', 'hamlet-0', 'hamlet-1', 'village-0', 'village-2', 'town-0', 'town-2', 'city-0', 'city-1', 'metropolis-0', 'metropolis-1'];
  const out = { idem: { copies: 0, differ: 0, ex: [] }, c: [] };
  const inc = (s) => (s.economicState?.incomeSources || []).map((r) => `${r.isCriminal ? 'C' : ''}${r.percentage}${'weight' in r ? 'w' : ''}`).join(',');
  for (const t of SEEDS) {
    const [tier] = t.split('-');
    const born = gen(density.birthConfig({ ...DEFAULT_CONFIG, ...B, settType: tier }), null, { seed: `vs-${t}`, customContent: {} });
    for (const shareDm of [false, true]) {
      const pub = V.galleryPayloadFor(born, { shareDm });
      const defaults = V.defaultVeilFor(pub); const present = sw.presentCriminalGroupings(pub); const model = V.curateModelFor(pub, []);
      let hand = V.toggleVeilDelta([], 'tab:plot_hooks', defaults);
      hand = V.toggleVeilDelta(hand, 'block:rumors.dmTruth', defaults);
      hand = V.toggleVeilDelta(hand, 'block:services.criminal', defaults);
      if (defaults.some((d) => d.address === 'class:npc:corruption')) hand = V.toggleVeilDelta(hand, 'class:npc:corruption', defaults);
      const drafts = { before: hand, hide: sw.setCriminalVeil(hand, defaults, true, present, model), show: sw.setCriminalVeil(hand, defaults, false, present, model) };
      const views = {};
      for (const [k, d] of Object.entries(drafts)) {
        const R = V.resolveVeil(defaults, d);
        const v1 = V.applyVeil(pub, R); const v2 = V.applyVeil(v1, R);
        views[k] = v1;
        out.idem.copies += 1; const dd = []; diff(JSON.parse(JSON.stringify(v1)), JSON.parse(JSON.stringify(v2)), '', dd);
        if (dd.length) { out.idem.differ += 1; if (out.idem.ex.length < 6) out.idem.ex.push(`vs-${t}${shareDm ? ' dm' : ''} ${k}: ${dd.join(' ; ')}`); }
      }
      // VS1 (c)'s own second veil: the family's parts, applied to each served copy
      const parts = sw.criminalPartsOf(defaults, hand, undefined, model);
      const mask = (c) => JSON.parse(JSON.stringify(V.applyVeil(c, parts)));
      const mb = mask(views.before); const mh = mask(views.hide); const ms = mask(views.show);
      const dh = []; diff(mh, mb, '', dh); const ds = []; diff(ms, mb, '', ds);
      if (dh.length || ds.length) out.c.push({ copy: `vs-${t}${shareDm ? ' dm' : ''}`, income: { pub: inc(pub), before: inc(views.before), hide: inc(views.hide), show: inc(views.show), maskBefore: inc(mb), maskShow: inc(ms) }, hideVsBefore: dh, showVsBefore: ds });
    }
  }
  writeFileSync(process.env.V102_OUT, JSON.stringify(out, null, 1));
}, 1800000);
