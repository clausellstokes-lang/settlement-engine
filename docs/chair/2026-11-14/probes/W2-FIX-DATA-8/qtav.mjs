export default async ({ tree, towns }) => {
  const { INSTITUTION_KIND_PATTERNS, ACCESS_ONLY } = await import(tree + '/src/domain/facts/institutions.js');
  for (const { seed, s } of towns) if ((s.institutions||[]).some((i) => i.name === 'Brewer')) {
    const t = (s.institutions||[]).filter((i) => !ACCESS_ONLY.test(i.name) && INSTITUTION_KIND_PATTERNS.tavern.test(i.name));
    console.log(seed, t.map((i) => `${i.name} [${i.category}] ${Object.keys(i).filter(k=>/cascade|source|added|origin|via/i.test(k)).map(k=>k+'='+JSON.stringify(i[k])).join(',')}`).join(' | '));
  }
};
