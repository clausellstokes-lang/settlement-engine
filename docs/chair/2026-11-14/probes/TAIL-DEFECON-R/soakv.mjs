const { birth, ensureLaws } = await import(process.argv[2] + '/scripts/audit/soak-review/corpus.mjs');
await ensureLaws(); let found = 0;
for (let i = 0; i < 1000 && found < 3; i++) { const { settlement: s } = birth(i);
  if (!(s.institutions || []).some((x) => x.name === 'Vintner')) continue;
  const g = (s.resourceAnalysis?.gaps || []).filter((x) => x.institution === 'Vintner');
  console.log(i, s.tier || s.settType, s.population, s.config?.tradeRouteAccess, JSON.stringify(s.config?.stressTypes || []), g.map((x) => x.kind).join(',') || '-');
  if (g.some((x) => x.kind === 'missing')) found++; }
