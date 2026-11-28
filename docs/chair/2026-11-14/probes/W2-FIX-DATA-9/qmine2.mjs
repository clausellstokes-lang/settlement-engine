export default async ({ towns }) => {
  let n=0, nd=0, nall=0; const ex=[], exall=[]; const kinds={};
  for (const { seed, s } of towns) { const m=(s.institutions||[]).find((x)=>x.name==='Mine'); if(!m || !/hired crews/i.test(m.desc)) continue; n++;
    const rc = s.resourceAnalysis?.resourceConditions||[];
    const min = rc.filter(r=>r.type!=='renewable');
    for (const r of min) kinds[r.key+':'+r.condition]=(kinds[r.key+':'+r.condition]||0)+1;
    const dep = min.filter(r=>r.condition==='depleted');
    if (dep.length) { nd++; if (ex.length<5) ex.push(seed+'['+dep.map(r=>r.key).join(',')+']'); }
    if (min.length && dep.length===min.length) { nall++; if (exall.length<5) exall.push(seed+'['+dep.map(r=>r.key).join(',')+']'); }
  }
  console.log('hired-crews mine towns', n, '· some mineral depleted', nd, ex.join(' '), '· every mineral depleted', nall, exall.join(' '));
  console.log(JSON.stringify(kinds));
};
