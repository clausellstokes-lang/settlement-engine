// REVIEW-W2-FIX-DATA: the defence pin's sets, base (whole tables) and tip (the re-keyed filter), by key; and which sets of the tip tables
// have an original needing a defence atom but drop out of the pin.
const load=async(T)=>({ s:(await import(T+'/src/data/institutionServices.js')).SERVICE_DESC_SIBLINGS, d:(await import(T+'/src/data/institutionDescVariants.js')).DESC_VARIANT_SIBLINGS });
const A=new Set(['walls','garrison','soldiers']);
const B=await load(process.env.BASE), T=await load(process.env.TIP);
const base=new Set([...Object.keys(B.s),...Object.keys(B.d)]);
const f=(t)=>Object.entries(t).filter(([,set])=>(set[0].needs||[]).some(a=>A.has(a)&&(set.find(l=>l.twinOf)?.excludes||[]).includes(a))).map(([k])=>k);
const tip=new Set([...f(T.s),...f(T.d)]);
console.log('base whole-table keys',base.size,'| tip filtered keys',tip.size,'| same set:',[...base].every(k=>tip.has(k))&&base.size===tip.size);
const out=Object.entries({...T.s,...T.d}).filter(([k,set])=>(set[0].needs||[]).some(a=>A.has(a))&&!tip.has(k)).map(([k])=>k.slice(0,70));
console.log('tip sets whose original needs a defence atom but are outside the pin:',out.length, JSON.stringify(out));
