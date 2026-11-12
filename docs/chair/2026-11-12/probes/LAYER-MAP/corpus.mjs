// LAYER-MAP corpus.mjs — the state-prose corpus counted (EXECUTED over the six generated leaves):
// blocks, pools, variants; what declares (the repository's own `statePoolCounts`), which atoms and which kernel dimensions.
// Run: TREE=<tree> node corpus.mjs > corpus.json
const R = (process.env.TREE || process.cwd()) + '/src';
const imp = (p) => import(R + p);
const leaves = await Promise.all(['economy', 'defense', 'general', 'power', 'stressors', 'warFaith'].map(async (n) => {
  const m = await imp(`/data/dossierStateProse/${n}.generated.js`); return [n, Object.values(m).find((v) => v && typeof v === 'object' && !Array.isArray(v))];
}));
const { statePoolCounts, undeclaredRows } = await imp('/domain/facts/declarationRegisters.js');
const { variantFactDeclaration } = await imp('/domain/display/stateProse/stateProseKernel.js');
const { STATE_MARK_DIMENSIONS, declarationOfMarks, atomsOf } = await imp('/domain/facts/factVocabulary.js');
const counts = statePoolCounts(leaves.map(([, l]) => l));
const DIM = Object.fromEntries(Object.entries(STATE_MARK_DIMENSIONS).flatMap(([d, ws]) => ws.map((w) => [w, d])));
const out = { desks: {}, totals: { blocks: 0, pools: 0, variants: 0 }, atomDims: {}, kernelDims: {}, poolMeta: { declares: 0, crisisScoped: 0, colour: 0 }, slots: {}, perPool: {} };
for (const [desk, leaf] of leaves) {
  const d = out.desks[desk] = { blocks: 0, pools: 0, variants: 0 };
  for (const [blockId, block] of Object.entries(leaf)) {
    d.blocks++; out.totals.blocks++;
    const fields = (block.title.match(/`([^`]+)`/g) || []).map((x) => x.slice(1, -1));
    for (const [poolKey, vs] of Object.entries(block.pools || {})) {
      d.pools++; out.totals.pools++; d.variants += vs.length; out.totals.variants += vs.length;
      const meta = (block.poolMeta || {})[poolKey] || {};
      if (Array.isArray(meta.declares) && meta.declares.length) out.poolMeta.declares++;
      if (meta.crisisScoped) out.poolMeta.crisisScoped++;
      if (meta.colour) out.poolMeta.colour++;
      const atoms = new Set(); const kd = new Set(); const sl = new Set();
      for (const v of vs) {
        for (const a of atomsOf(variantFactDeclaration(v))) { const dim = a.replace(/^no /, '').split(':')[0].trim(); atoms.add(dim); out.atomDims[dim] = (out.atomDims[dim] || 0) + 1; }
        for (const m of v.marks || []) if (DIM[m]) { kd.add(DIM[m]); out.kernelDims[DIM[m]] = (out.kernelDims[DIM[m]] || 0) + 1; }
        for (const s of v.slots || []) { sl.add(s); out.slots[s] = (out.slots[s] || 0) + 1; }
      }
      for (const a of meta.declares || []) atoms.add('pool:' + a);
      out.perPool[`${blockId}::${poolKey}`] = { desk, variants: vs.length, ...counts[`${blockId}::${poolKey}`], atoms: [...atoms], kernelDims: [...kd], slots: [...sl], titleFields: fields };
    }
  }
}
const c = Object.values(counts);
out.declaration = { poolsWithAnUndeclaredLine: Object.keys(undeclaredRows(counts)).length, undeclaredLines: c.reduce((a, x) => a + x.undeclared, 0), declaringLines: c.reduce((a, x) => a + x.declaring, 0), colourLines: c.reduce((a, x) => a + x.colourLines, 0), poolsFullyAnswered: c.filter((x) => x.undeclared === 0).length };
console.log(JSON.stringify(out, null, 1));
