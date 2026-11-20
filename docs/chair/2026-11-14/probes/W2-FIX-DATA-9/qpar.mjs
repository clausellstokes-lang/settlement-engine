export default async ({ towns }) => {
  const by = {}; let n = 0;
  for (const { seed, s } of towns) for (const i of s.institutions || []) if (i.name === 'Parish churches (50-100+)') { n++; const k = String(i.desc).slice(0, 60); (by[k] ||= []).push(seed + ':' + (s.tier || s.settType)); }
  console.log('prints', n); for (const [k, v] of Object.entries(by)) console.log(v.length, k, v.slice(0, 4).join(' '));
};
