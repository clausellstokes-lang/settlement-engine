import { generateAvailableServices } from './src/generators/servicesGenerator.js';
// Force deterministic: monkeypatch not trivial; run a few seeds and aggregate which institution names produce which buckets.
const tests = [
  {name:'International trade center'},
  {name:'Caravanserai'},
  {name:'Fishing community'},
  {name:'Alehouse'},
  {name:'Farmland'},
  {name:"Woodcutter's camp"},
  {name:'Common grazing land'},
];
const config = { tier:'city', settType:'city', priorityMagic:50, magicExists:true, priorityEconomy:80, priorityMilitary:50 };
for (const inst of tests){
  const agg = {};
  for (let i=0;i<60;i++){
    const r = generateAvailableServices('city', [inst], {}, {...config});
    for (const k of Object.keys(r)) for (const s of r[k]) {
      agg[k] = agg[k]||new Set(); agg[k].add(s.name);
    }
  }
  const out = {};
  for (const k of Object.keys(agg)) out[k]=[...agg[k]];
  console.log('### '+inst.name+':', JSON.stringify(out));
}
