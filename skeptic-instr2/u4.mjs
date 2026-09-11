import { loadHeraldDisclosure } from '../skepINSTR2/tests/helpers/dossierCorpus.js';
const rows = await loadHeraldDisclosure();
console.log('R4b rows:', rows.length);
const byFile={};
for (const r of rows){ const f=(r.file||r.source||r.id||'?').split('/').pop().split('::')[0]; byFile[f]=(byFile[f]||0)+1; }
console.log(JSON.stringify(byFile,null,1));
const bare = rows.filter(r=>/no deeper memory|keeps no recorded ledger|ledger keeps hidden/i.test(r.text||''));
console.log('the three bare strings present in loader:', bare.length, bare.map(r=>r.id||r.text.slice(0,40)));
