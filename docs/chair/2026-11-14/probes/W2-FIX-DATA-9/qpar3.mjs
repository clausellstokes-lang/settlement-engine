export default async ({ towns }) => {
  const seen = {};
  for (const { seed, s } of towns) { const st=(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type).join(','); const i = (s.institutions||[]).find((x) => x.name === 'Parish churches (50-100+)'); if (!i || /Every quarter/.test(i.desc)) continue; const k = (st.match(/under_siege|famine|occupied/)||['calm'])[0] + '|' + i.desc.slice(0,12); if (!seen[k]) { seen[k]=1; console.log(seed, '['+st+']', s.population, '|', i.desc); } }
};
