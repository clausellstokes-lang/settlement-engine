export default async ({ towns }) => {
  const W = { 'Livestock auction':1,'Livestock auctions':1,[ 'Caravan organization']:1,'Fresh fish retail':1,'Fresh produce':1,'General trade':1,'Weekly market':1,'Street food':1,'Wholesale purchasing':1,'Large-scale trading':1 };
  const rows = {};
  for (const { seed, s } of towns) {
    const st = (Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type);
    const fishCond = (s.resourceAnalysis?.resourceConditions||[]).filter(r=>/fish/.test(r.key)).map(r=>r.key+':'+r.condition).join(',');
    for (const v of Object.values(s.availableServices||{}).flat()) { if (!W[v.name]) continue;
      for (const c of st.filter(c=>['under_siege','famine'].includes(c)).concat(st.length?[]:['calm'])) {
        const k = c+' | '+v.institution+' | '+v.name+' | '+String(v.desc).slice(0,70)+(v.name==='Fresh fish retail'?' | '+fishCond+' | '+(s.terrain||s.config?.terrain||''):'');
        (rows[k] ||= []).push(seed);
      } } }
  for (const [k,v] of Object.entries(rows).sort()) if (!k.startsWith('calm')) console.log(v.length, k, v.slice(0,3).join(' '));
};
