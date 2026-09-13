const P='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/';
const { composeStateProse } = await import(P+'src/domain/display/stateProse/composeStateProse.js');
const K = await import(P+'src/domain/display/stateProse/stateProseKernel.js');
const desks = ['defense','economy','general','power','stressors','warFaith'];
let reads=0, composed=0, kernelNonNull=0, mismatch=0, pieceBad=0;
const bad=[];
for (const d of desks) {
  const m = await import(P+`src/data/dossierStateProse/${d}.generated.js`);
  const corpus = m.default || Object.values(m).find(v=>v && typeof v==='object');
  for (const [blockId, block] of Object.entries(corpus)) {
    // build a bag that fills EVERY slot any variant names, and answer every dimension
    const slots = {};
    for (const pool of Object.values(block.pools||{})) for (const v of pool) for (const s of (v.slots||[])) slots[s]='X';
    for (const poolKey of Object.keys(block.pools||{})) {
      const pool = block.pools[poolKey];
      const dims = {};
      for (const [dim, vals] of Object.entries(K.STATE_MARK_DIMENSIONS)) {
        for (const v of pool) if ((v.marks||[]).some(mk=>vals.includes(mk))) dims[dim]=vals.find(x=>(pool.some(p=>(p.marks||[]).includes(x))));
      }
      for (const audience of ['dm','player']) {
        for (const seed of ['', 'alpha-seed', 'zzz-9', 'town-42', '000', 'Ω-seed']) {
          reads += 1;
          const kern = K.readStateProse(corpus, blockId, poolKey, { slots, seed, audience, dimensions: dims });
          const unit = composeStateProse(corpus, blockId, { spineKey: poolKey, candidates: [], slots, seed, audience, dimensions: dims });
          if (kern) kernelNonNull += 1;
          if (unit) composed += 1;
          const a = kern ? `${kern.blockId}|${kern.poolKey}|${kern.angle}|${kern.text}` : null;
          const b = unit ? `${unit.blockId}|${unit.poolKey}|${unit.angle}|${unit.text}` : null;
          if (a !== b) { mismatch += 1; if (bad.length<3) bad.push({blockId,poolKey,seed,audience,a,b}); }
          if (unit) {
            const p = unit.pieces;
            if (p.length !== 1 || p[0].role !== 'spine' || p[0].key !== poolKey || p[0].face !== 0) pieceBad += 1;
          }
        }
      }
    }
  }
}
console.log('reads', reads, '| kernel non-null', kernelNonNull, '| composed', composed, '| text/angle/key MISMATCHES', mismatch, '| pieces not the single spine face-0 row', pieceBad);
bad.forEach(x=>console.log(JSON.stringify(x)));
