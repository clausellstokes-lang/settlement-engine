import { readFileSync } from 'node:fs';
const DOCK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const AH='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/capacity-horizon/artifacts';
const { evaluateReceipt } = await import(`${DOCK}/scripts/soak/evaluate.mjs`);
const { settlementShapeOf, deriveRegisterFigures } = await import(`${DOCK}/scripts/soak/register.mjs`);
const { TRIPWIRES } = await import(`${DOCK}/scripts/soak/tripwires.mjs`);

function grade(path, label){
  const r = JSON.parse(readFileSync(path,'utf8'));
  console.log(`\n===== ${label} =====`);
  console.log(`years=${r.years} settlements=${r.settlements} seed=${r.seed} schemaVersion=${r.schemaVersion} passed=${r.passed} demo=${r.subsystems?.rules?.demographicsEnabled}`);
  const pops=r.yearlyPopulations||[], died=r.yearlyDiedFlags||[], yearly=r.behavioral?.yearly||[];
  console.log(`yearlyPopulations rows=${pops.length} width=${pops[0]?.length} ; yearlyDiedFlags rows=${died.length} ; behavioral.yearly rows=${yearly.length}`);
  const ev = evaluateReceipt(r);
  console.log(`deterministicFirings=${ev.deterministicFirings} fullInstrument=${ev.annotated.fullInstrument} notExecutable=${JSON.stringify(ev.notExecutable)} annotated.notExecutable=${JSON.stringify(ev.annotated.notExecutable)}`);
  console.log(`observability n=${ev.observability.length} ${JSON.stringify(ev.observability)}`);
  console.log('FINDINGS:');
  for (const f of ev.findings) console.log('  ', f.id, JSON.stringify(f.findings ?? f.detail ?? f).slice(0,400));
  if(!ev.findings.length) console.log('   (none)');
  for (const row of TRIPWIRES.filter(t=>t.id.startsWith('capacity_'))){
    const gated = typeof row.gate==='function'? row.gate(r): true;
    const obs = typeof row.horizon?.observed==='function'? row.horizon.observed(r) : null;
    const n = ev.findings.filter(f=>f.id===row.id).length;
    const det = gated ? row.detect(r).length : 'gate-false';
    console.log(`  ROW ${row.id} gate=${gated} horizonReq=${row.horizon?.required ?? 'n/a'} observed=${obs} evFindings=${n} directDetect=${det}`);
  }
  return r;
}

const r600 = grade(`${AH}/horizon-600y-4s-lit.json`,'M1 600y x 4s LIT');
grade(`${AH}/probe-30y-12s-dark.json`,'M2b 30y x 12s DARK');
grade(`${AH}/probe-30y-12s-lit.json`,'M2 30y x 12s LIT');

// ---- lens (a): recompute capacity_plateau drifts and settlementShapeOf on M1
const pops=r600.yearlyPopulations, died=r600.yearlyDiedFlags;
const last=pops.length-1, mid=Math.floor(last/2);
console.log(`\n===== LENS (a) : capacity_plateau arithmetic on M1 =====`);
console.log(`last=${last} mid=${mid}  (mid year index vs last year index; gap=${last-mid})`);
const ids=(r600.behavioral?.settlementIds||[]).map(String);
console.log('ids', JSON.stringify(ids));
for(let i=0;i<pops[last].length;i++){
  const yMid=pops[mid][i], yLast=pops[last][i];
  const drift=Math.abs(yLast-yMid)/yMid;
  console.log(`  s${i} ${ids[i]??''} pops[mid=${mid}]=${yMid} pops[last=${last}]=${yLast} drift=${drift.toFixed(6)} >0.05? ${drift>0.05} >=0.05? ${drift>=0.05} died[last]=${died[last][i]}`);
}
// series from yearlyPopulations columns
console.log(`\n-- settlementShapeOf on yearlyPopulations columns (len ${pops.length}) --`);
for(let i=0;i<pops[last].length;i++){
  const s=pops.map(row=>row[i]);
  const final=s[s.length-1], centAgo=s[s.length-1-100], halfAgo=s[s.length-1-50];
  console.log(`  s${i} start=${s[0]} centuryAgo[idx ${s.length-1-100}]=${centAgo} halfAgo[idx ${s.length-1-50}]=${halfAgo} final=${final} |d|=${Math.abs(final-centAgo)} bar=${(Math.abs(final||1)*0.05).toFixed(3)} shape=${settlementShapeOf(s,{died:died[last][i]})}`);
}
// series from behavioral stateVectors (what deriveRegisterFigures actually uses)
const dr=deriveRegisterFigures(r600);
console.log(`\n-- deriveRegisterFigures (stateVectors path) --`);
console.log('shapes', JSON.stringify(dr.shapes));
for(const id of ids){ const f=dr.figures[`population.${id}.shape`]; console.log(`  population.${id}.shape = ${JSON.stringify(f)}`); }
console.log('realm.ratio', JSON.stringify(dr.figures['realm.ratio']));
console.log('realm.runawayCount', JSON.stringify(dr.figures['realm.runawayCount']), 'flooredCount', JSON.stringify(dr.figures['realm.flooredCount']), 'unlawfulZero', JSON.stringify(dr.figures['realm.unlawfulZeroCount']), 'bifurcated', JSON.stringify(dr.figures['realm.bifurcated']));
// rebuild stateVectors series lengths
const yl=r600.behavioral.yearly;
const sv={}; for(const id of ids) sv[id]=[];
for(const y of yl){ for(const id of ids){ const p=y?.stateVectors?.[id]?.population; if(Number.isFinite(Number(p))) sv[id].push(Number(p)); } }
for(const id of ids) console.log(`  stateVectors series ${id} len=${sv[id].length} first=${sv[id][0]} last=${sv[id][sv[id].length-1]} centuryAgo=${sv[id][sv[id].length-1-100]}`);
console.log('runDurationsMs', JSON.stringify(r600.runDurationsMs));

// ---- lens (d): loadRatio01 per decade
console.log(`\n===== LENS (d) : loadRatio01 by decade on M1 =====`);
const rows=[];
for(let k=0;k<yl.length;k++){
  const v=yl[k]?.realmDemography?.loadRatio01;
  if(Number.isFinite(Number(v))) rows.push([k, Number(v)]);
}
console.log(`years with a finite loadRatio01: ${rows.length} of ${yl.length}`);
const yearField = yl.slice(0,3).map(y=>y.year);
console.log('behavioral.yearly[0..2].year =', JSON.stringify(yearField), ' last.year =', yl[yl.length-1]?.year);
const dec=rows.filter(([k])=> (yl[k]?.year!==undefined ? yl[k].year%10===0 : (k+1)%10===0));
console.log('decade readings (year, loadRatio01, inWindow):');
let firstIn=null,lastOut=null;
for(const [k,v] of dec){ const y=yl[k]?.year ?? k+1; const inw = v>=0.6&&v<=1.05; if(inw&&firstIn===null) firstIn=[y,v]; if(!inw) lastOut=[y,v]; }
for(const [k,v] of dec.slice(0,12)) console.log(`   y${yl[k]?.year ?? k+1} ${v.toFixed(4)} ${(v>=0.6&&v<=1.05)?'IN':'OUT'}`);
console.log('... first decade INSIDE:', JSON.stringify(firstIn), ' last decade OUTSIDE:', JSON.stringify(lastOut));
// also per-YEAR first entry
let firstYearIn=null; for(const [k,v] of rows){ if(v>=0.6&&v<=1.05){ firstYearIn=[yl[k]?.year??k+1, v]; break; } }
console.log('first YEAR (any) inside window:', JSON.stringify(firstYearIn));
console.log('years 1..12 loadRatio01:', JSON.stringify(rows.slice(0,12).map(([k,v])=>[yl[k]?.year??k+1, +v.toFixed(4)])));
for(const yy of [300,350,400,450,500,550,600]){ const k=rows.find(([kk])=> (yl[kk]?.year??kk+1)===yy); console.log(`   mark y${yy}: ${k? k[1].toFixed(4):'n/a'}`); }
