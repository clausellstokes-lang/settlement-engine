import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
const ROOT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const SRC=join(ROOT,'src');
function strip(code){return code
 .replace(/\/\*[\s\S]*?\*\//g,'')
 .replace(/^\s*\/\/.*$/gm,'')
 .replace(/`(?:\\.|[^`\\])*`/g,'``')
 .replace(/'(?:\\.|[^'\\\n])*'/g,"''")
 .replace(/"(?:\\.|[^"\\\n])*"/g,'""');}
function sourceFiles(dir=SRC,out=[]){for(const n of readdirSync(dir)){const f=join(dir,n);if(statSync(f).isDirectory()){sourceFiles(f,out);continue;}if(!/\.(js|jsx)$/.test(n))continue;out.push(relative(ROOT,f).split(sep).join('/'));}return out;}
const SELF='src/generators/generateSettlementPipeline.js';
const OVERRIDE={};
function read(rel){return OVERRIDE[rel]!==undefined?OVERRIDE[rel]:readFileSync(join(ROOT,rel),'utf-8');}
function reachers(){return sourceFiles().filter(r=>r!==SELF).filter(r=>/\bgenerateSettlementPipeline\b/.test(strip(read(r))));}
function names(rel,sym){return new RegExp(`\\b${sym}\\b`).test(strip(read(rel)));}
const PR=JSON.parse(process.env.PR_JSON);
const MINT_HOME='src/domain/density/densityCreateBoundary.js';
const OFF=[{mint:'newSettlementMapEdits',dial:'NEW_SETTLEMENT_LAYOUT_LAW_VERSION'}];
function run(label){
  const R=reachers();
  const oldScan=[...R,MINT_HOME];
  const newScan=[...new Set([...R,MINT_HOME,...Object.keys(PR),...Object.values(PR).map(r=>r.reachesVia).filter(Boolean)])];
  const strays=s=>{const out=[];for(const law of OFF)for(const rel of s)if(names(rel,law.mint)||names(rel,law.dial))out.push(`${rel} names ${law.mint}`);return out;};
  console.log(`### ${label}`);
  console.log('reachers('+R.length+'):',R.join(' '));
  console.log('oldScan('+oldScan.length+')');
  console.log('newScan('+newScan.length+'):',newScan.join(' '));
  console.log('OLD strays:',JSON.stringify(strays(oldScan)));
  console.log('NEW strays:',JSON.stringify(strays(newScan)));
}
run('BASELINE (no plant)');
OVERRIDE['src/store/settlementGenerateAction.js']=readFileSync(join(ROOT,'src/store/settlementGenerateAction.js'),'utf-8')+'\nconst _PLANT_L_MAT = newSettlementMapEdits;\n';
run('PLANTED in settlementGenerateAction.js');
delete OVERRIDE['src/store/settlementGenerateAction.js'];
OVERRIDE['src/store/settlementSlice.js']=readFileSync(join(ROOT,'src/store/settlementSlice.js'),'utf-8')+'\nconst _PLANT2 = newSettlementMapEdits;\n';
run('PLANTED in settlementSlice.js (the regen home)');
delete OVERRIDE['src/store/settlementSlice.js'];
OVERRIDE['src/store/settlementSliceHelpers.js']=readFileSync(join(ROOT,'src/store/settlementSliceHelpers.js'),'utf-8')+'\nconst _PLANT3 = newSettlementMapEdits;\n';
run('PLANTED in settlementSliceHelpers.js (the leaf car 1 de-listed)');
