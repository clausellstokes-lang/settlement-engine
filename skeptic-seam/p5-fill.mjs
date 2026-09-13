const { fillSites } = await import('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/tests/helpers/dossierComposedFill.js');
const sites = fillSites();
console.log('total sites:', sites.length);
console.log('unresolved sites:', sites.filter(s => s.unresolved && s.unresolved.length).length);
console.log('parameterised block sites:', sites.filter(s => s.block === '(parameterised)' || s.block === '(unresolved call)').length);
console.log('unreadable spineKey:', sites.filter(s => String(s.pool||'').includes('unreadable')).length);
const byDesk = {};
for (const s of sites) { const d = (s.file||s.composer||'').split('/').pop(); byDesk[d] = (byDesk[d]||0)+1; }
console.log(JSON.stringify(byDesk, null, 0));
const blocks = {};
for (const s of sites) { const d=(s.file||s.composer||'').split('/').pop().replace('StateProse.js',''); (blocks[d] ||= new Set()).add(s.block); }
for (const [d,set] of Object.entries(blocks)) console.log(d.padEnd(10), [...set].sort().join(' '));
console.log('sample row keys:', Object.keys(sites[0]).join(','));
