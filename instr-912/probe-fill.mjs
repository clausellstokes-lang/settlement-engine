import { fillSites, composedFillByBlock } from '../laneINSTR/tests/helpers/dossierComposedFill.js';
const sites = fillSites();
console.log('call sites', sites.length);
for (const s of sites) console.log(`${s.file.split('/').pop()}:${s.line} ${s.block.padEnd(16)} pool=${s.poolExpr.padEnd(12)} slots=[${s.slots.join(',')}] cond=[${s.conditional.join(',')}] ${s.unresolved.length? 'UNRESOLVED: '+s.unresolved.join(' ; '):''}`);
const byBlock = composedFillByBlock(sites);
console.log('\nblocks with a resolved bag:', byBlock.size);
