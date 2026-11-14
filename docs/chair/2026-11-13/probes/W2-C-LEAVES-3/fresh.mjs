// Fresh seeds this seat never tuned on: w2c3f-<size>-<i> (every dial random, 10 per size) and w2c3f-<crisis>-<size> (the
// app's shape: selectedStresses with Random off), born in TREE, written to OUT.
import fs from 'node:fs'; import zlib from 'node:zlib';
const R=process.env.TREE+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const SIZES=['thorp','hamlet','village','town','city','metropolis'];
const STRESSES=["under_siege","famine","occupied","politically_fractured","indebted","recently_betrayed","infiltrated","plague_onset","succession_void","monster_pressure","insurgency","religious_conversion","slave_revolt","wartime","mass_migration"];
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(process.env.OUT)); let n=0;
for (const t of SIZES) for (let i=0;i<10;i++) { const seed=`w2c3f-${t}-${i}`; out.write(JSON.stringify({seed,s:generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:t,_randomizePriorities:true}),null,{seed,customContent:{}})})+'\n'); n++; }
for (const c of STRESSES) for (const t of SIZES) { const seed=`w2c3f-${c}-${t}`; out.write(JSON.stringify({seed,s:generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:t,selectedStressesRandom:false,selectedStresses:[c],_randomizePriorities:true}),null,{seed,customContent:{}})})+'\n'); n++; }
out.end(); console.log('fresh births', n);
