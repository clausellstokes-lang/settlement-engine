const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR';
const fill = await import(`${D}/tests/helpers/dossierComposedFill.js`);
const { UNMOUNTED_BLOCKS } = await import(`${D}/src/domain/display/stateProse/dossierMounts.js`);
const C = await import(`${D}/tests/helpers/dossierCorpus.js`);
const sites = fill.fillSites();
console.log('fillSites n =', sites.length, '| unresolved sites =', sites.filter(s=>s.unresolved.length).length,
  '| parameterised =', sites.filter(s=>s.block==='(parameterised)').length);
console.log('distinct files =', new Set(sites.map(s=>s.file)).size, '| distinct file:line =', new Set(sites.map(s=>`${s.file}:${s.line}`)).size);
const byBlock = fill.composedFillByBlock(sites);
const leaves = await C.loadStateLeaves();
const blocks = [...new Set(leaves.map(e=>e.block))].sort();
const noBag = blocks.filter(b=>!byBlock.has(b)).sort();
console.log('noBag n =', noBag.length, '| UNMOUNTED n =', UNMOUNTED_BLOCKS.length,
  '| equal =', JSON.stringify(noBag) === JSON.stringify([...UNMOUNTED_BLOCKS].sort()));
console.log('DS-POW-5', JSON.stringify(byBlock.get('DS-POW-5')?.slots));
console.log('DS-GEN-18', JSON.stringify(byBlock.get('DS-GEN-18')?.slots), 'cond=', JSON.stringify(byBlock.get('DS-GEN-18')?.conditional));
console.log('DS-ECO-11', JSON.stringify(byBlock.get('DS-ECO-11')?.slots));
