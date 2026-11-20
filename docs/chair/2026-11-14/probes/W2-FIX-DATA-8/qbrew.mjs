export default async ({ tree, towns }) => {
  const { hasInstitution } = await import(tree + '/src/domain/facts/institutions.js');
  for (const { seed, s } of towns) for (const i of s.institutions || []) if (i.name === 'Brewer') {
    const svc = Object.values(s.availableServices || {}).flat().filter((v) => v.institution === 'Brewer').map((v) => v.name + ':' + v.desc);
    console.log(seed, s.tier, 'tavern=' + hasInstitution(s, 'tavern'), '|', i.desc.slice(-60), '|', svc.join(' ; ').slice(0, 200)); }
};
