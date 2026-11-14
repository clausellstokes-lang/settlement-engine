export default async ({ tree, towns }) => {
  const { hasInstitution } = await import(tree + '/src/domain/facts/institutions.js');
  const { factsOf } = await import(tree + '/src/domain/facts/factsOf.js');
  const rows = {};
  const add = (k, seed, tier, ok) => { const r = (rows[k] ||= { n: 0, false: 0, ex: [], tiers: {} }); r.n++; if (!ok) { r.false++; if (r.ex.length < 4) r.ex.push(seed); r.tiers[tier] = (r.tiers[tier] || 0) + 1; } };
  for (const { seed, s } of towns) {
    const tier = s.tier || s.settType || s.config?.settType;
    const f = factsOf(s);
    for (const i of s.institutions || []) {
      const d = String(i.desc || '');
      if (/alehouse/i.test(d)) add('desc alehouse [' + i.name + '] ' + d.slice(0, 50), seed, tier, hasInstitution(s, 'tavern'));
      if (/reeve/i.test(d) && !/no reeve/i.test(d)) add('desc reeve [' + i.name + '] ' + d.slice(0, 50), seed, tier, (s.institutions||[]).some((x) => /reeve/i.test(x.name)));
      if (/fishing (boats|craft)/i.test(d)) add('desc fishing [' + i.name + '] ' + d.slice(0, 40), seed, tier, (f.foodSources || []).includes('fish'));
      if (/farrier/i.test(d)) add('desc farrier [' + i.name + '] ' + d.slice(0, 40), seed, tier, hasInstitution(s, 'smith'));
      if (/pilgrims/i.test(d)) add('desc pilgrims [' + i.name + '] ' + d.slice(0, 40), seed, tier, true);
      if (/garrison duty/i.test(d)) add('desc garrison duty [' + i.name + '] ' + d.slice(0, 40), seed, tier, true);
    }
    for (const v of Object.values(s.availableServices || {}).flat()) if (/alehouse/i.test(String(v.desc))) add('svc ' + v.name + ' [' + v.institution + ']', seed, tier, hasInstitution(s, 'tavern'));
  }
  for (const [k, r] of Object.entries(rows).sort()) console.log(r.n, 'false', r.false, k, JSON.stringify(r.tiers), r.ex.join(' '));
};
