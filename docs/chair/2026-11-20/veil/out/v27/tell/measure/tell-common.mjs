// R3-TELL unit 1 (VEIL-27's builder): the births and the readings shared by search.probe.jsx and tell.probe.jsx.
// THE BIRTHS are R3-CURE-5's gate births byte for byte (gate.probe.jsx :: birth; seeds r3m-<size>-<crisis>-<k>-<idx>, the
// same sizes, crises, dials and shards). THE COUNTERFACTUAL B is the generator run with every hideable house cut from
// ctx.institutions and ctx.settlement.institutions after EVERY step (ruling 30's acceptance): no veil helper builds it. The
// veil helpers are used ONLY to READ a document as a non-owner read serves it (the twin), as the gate does.
export const SIZES = (process.env.RV9_SIZES || 'village,town,town,city,city,metropolis,metropolis').split(',');
export const CRISES = (process.env.RV9_CRISES || 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured').split(',');
export const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
export const clone = (v) => JSON.parse(JSON.stringify(v));
/** The owner's own setting in the gate: the three criminal groupings and the plot-hooks tab opened by hand. */
export const CRIM_GROUPINGS = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside'];
export const OPEN = [...CRIM_GROUPINGS, 'tab:plot_hooks'];
export const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };

export async function loadEngine(SRC) {
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const state = { dial: null };
  const birth = (cfg, seed, drop) => {
    const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
    let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: (name, ctx) => {
      if (typeof ctx?.effectiveConfig?.priorityCriminal === 'number') state.dial = ctx.effectiveConfig.priorityCriminal;
      if (drop) { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } } });
    if (drop) cut(t.institutions);
    t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
    return clone(t);
  };
  /** Every birth of the pool, this shard's share: { seed, crisis, size, cfg }. */
  const pool = (N, SHARD) => {
    const out = []; let idx = 0;
    for (let k = 0; k < N; k += 1) for (const size of SIZES) for (const crisis of CRISES) {
      idx += 1; if (idx % SHARD[1] !== SHARD[0]) continue;
      out.push({ seed: `r3m-${size}-${crisis}-${k}-${idx}`, size, crisis,
        cfg: { ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) } });
    }
    return out;
  };
  return { birth, pool, state, isHideableHouse };
}

/** The veil's readings of a document (the twin) and the owner's switch settings, each computed ON THE DOCUMENT read. */
export async function loadVeil(SRC) {
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const sw = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const write = (deltas) => veil.writeShareVeil({}, deltas, AT);
  const opened = (addrs) => addrs.map((a) => ({ address: a, hidden: false }));
  const twin = (rec, dm, ov) => veil.projectShareVeil(veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: ov }), ov);
  /** The curate screen's own copy, model and defaults for a record (no veil yet), as gate.probe.jsx :: switchOffOv reads them. */
  const screen = (rec, dm) => {
    const pub = veil.galleryPayloadFor(clone(rec), { shareDm: dm, memberOverrides: null });
    const model = veil.curateModelFor(pub, []);
    return { pub, model, defaults: model.defaults, present: sw.presentCriminalGroupings(pub) };
  };
  /**
   * THE SETTING FAMILIES, as delta lists on the record itself:
   *  own        the gate's: the three criminal groupings and the hooks tab opened by hand (every house at its default: hidden whole)
   *  g:<bits>   MIXED: the hooks tab open and each criminal grouping open (1) or shut (0), in CRIM_GROUPINGS' order; g:111 = own
   *  allOpen    "Show everything criminal" on the record, then every hideable house's card back to its default (hidden whole)
   *  off        "Hide everything criminal" on the record (the switch OFF), from own
   */
  const settings = (rec, dm) => {
    const sc = screen(rec, dm);
    const out = { own: opened(OPEN) };
    for (let b = 0; b < 8; b += 1) {
      const bits = [4, 2, 1].map((m) => ((b & m) ? '1' : '0')).join('');
      out[`g:${bits}`] = opened(['tab:plot_hooks', ...CRIM_GROUPINGS.filter((_g, i) => bits[i] === '1')]);
    }
    out.allOpen = sw.setCriminalVeil(opened(OPEN), sc.defaults, false, sc.present, sc.model).filter((d) => !String(d.address).startsWith('card:institution:'));
    out.off = sw.setCriminalVeil(opened(OPEN), sc.defaults, true, sc.present, sc.model);
    return { sc, deltas: out };
  };
  return { veil, sw, write, opened, twin, screen, settings };
}

/** Every leaf of a document, by exact path; an empty array or object is a leaf of its own (its PRESENCE). */
export function leaves(v, p = '', out = new Map()) {
  if (Array.isArray(v)) { if (!v.length) out.set(p, '[]'); v.forEach((x, i) => leaves(x, `${p}[${i}]`, out)); }
  else if (isRec(v)) { const ks = Object.keys(v); if (!ks.length) out.set(p, '{}'); for (const k of ks) leaves(v[k], p ? `${p}.${k}` : k, out); }
  else out.set(p, JSON.stringify(v));
  return out;
}
export const norm = (p) => p.replace(/\[\d+\]/g, '[]');
