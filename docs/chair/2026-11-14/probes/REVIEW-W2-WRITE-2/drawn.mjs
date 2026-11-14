// drawn.mjs <tree> <recordsDir> <out.json>: every corpus variant DRAWN for each town, read from the kernel's own
// presumption ledger (noteDrawnVariant) opened around buildPrintProse on the normalized record (the PDF's builder,
// which tests/pdf/statePrintParity holds to the screen), faith unlocked. Out: { town: { tier, stress, drawn:[ "block::pool::vN" ] } }.
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [T,R,O]=process.argv.slice(2);
const { normalizeSettlement } = await import(T+'/src/domain/normalizeSettlement.js');
const { buildPrintProse } = await import(T+'/src/domain/display/stateProse/printProse.js');
const { withPresumptionLedger } = await import(T+'/src/domain/facts/presumptionLedger.js');
const out={}; let err=0;
for(const f of fs.readdirSync(R).filter(f=>f.endsWith('.json.gz')).sort()){
  const town=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(R,f))));
  try{ const { ledger } = withPresumptionLedger(()=>buildPrintProse(normalizeSettlement(town),{faithUnlocked:true}));
    const drawn=[...new Set(ledger.filter(e=>e.drawKind==='K'&&typeof e.lineId==='number').map(e=>`${e.pool}::v${e.lineId}`))];
    const arr=x=>Array.isArray(x)?x:(x?[x]:[]); const st=[...new Set([...arr(town.stress), ...arr(town.stresses)].map(s=>typeof s==='string'?s:s?.type).filter(Boolean))]; // stress may be one object or an array
    out[f.replace('.json.gz','')]={tier:town.tier, pop:town.population, stress:st, drawn};
  }catch(e){ err++; if(err<4) console.error(f,e.message); }
}
fs.writeFileSync(O,JSON.stringify(out)); console.log('towns',Object.keys(out).length,'errors',err);
