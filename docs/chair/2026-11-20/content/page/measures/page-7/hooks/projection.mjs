// PAGE-7 read-only probe (TROUBLE-LINES addendum 4): do history.currentTensions[].plotHooks reach the shared projection
// (publicSafe.js :: toPublicSafe, default and full) and the veil's served document (galleryVeil.js :: applyVeil over
// resolveVeil(defaultVeilFor(record))), and with the owner lifting tab:plot_hooks? Usage: node projection.mjs <root> [n=20]
const [, , L = process.cwd(), nA = '20'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { toPublicSafe, veilPublicPayload } = await import(`${L}/src/domain/display/publicSafe.js`);
const { applyVeil, resolveVeil, defaultVeilFor } = await import(`${L}/src/domain/display/galleryVeil.js`);
await loadGenerationLawPayloads();
const hooksIn = (doc) => (doc?.history?.currentTensions || []).reduce((n, t) => n + (Array.isArray(t?.plotHooks) ? t.plotHooks.length : 0), 0);
const c = { towns: 0, raw: 0, pub: 0, pubVeiled: 0, full: 0, fullVeiled: 0, fullLifted: 0, payload: 0 };
for (const size of ['city', 'metropolis']) for (let i = 0; i < +nA; i++) {
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  c.towns++; c.raw += hooksIn(t);
  const pub = toPublicSafe(t); const full = toPublicSafe(t, { full: true });
  const veil = resolveVeil(defaultVeilFor(t), null);
  const lifted = resolveVeil(defaultVeilFor(t), [{ address: 'tab:plot_hooks', hidden: false }, { address: 'class:tension:hooks', hidden: false }]);
  c.pub += hooksIn(pub); c.pubVeiled += hooksIn(applyVeil(pub, veil)); c.full += hooksIn(full);
  c.fullVeiled += hooksIn(applyVeil(full, veil)); c.fullLifted += hooksIn(applyVeil(full, lifted)); c.payload += hooksIn(veilPublicPayload(pub));
}
console.log(`PROJ towns ${c.towns}: tension hooks on the record ${c.raw}; toPublicSafe default ${c.pub}; default+veil ${c.pubVeiled}; veilPublicPayload(default) ${c.payload}; toPublicSafe full ${c.full}; full+default veil ${c.fullVeiled}; full+veil with the owner's deltas lifting tab:plot_hooks and class:tension:hooks ${c.fullLifted}`);
