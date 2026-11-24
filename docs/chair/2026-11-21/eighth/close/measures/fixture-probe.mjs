const T = process.argv[2];
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { forgeConfigFor } = await import(`${T}/scripts/generate-landing-fixture.mjs`);
const { fixture } = await import(`${T}/src/components/home/landingFixture.js`);
const { loadLivingContentRoster } = await import(`${T}/src/domain/content/livingContentSeam.js`); await loadLivingContentRoster();
const st = fixture.forge.config.settType;
const a = generateSettlementPipeline(forgeConfigFor(st), null, { seed: fixture.seed, customContent: {} });
const b = generateSettlementPipeline(birthConfig(forgeConfigFor(st)), null, { seed: fixture.seed, customContent: {} });
const pick = (s) => ({ name: s.name, pop: s.population, laws: Object.fromEntries(Object.entries(s.config || {}).filter(([k]) => /LawVersion$/.test(k))) });
console.log('fixture', JSON.stringify({ name: fixture.town?.name, pop: fixture.town?.population }));
console.log('script ', JSON.stringify(pick(a)));
console.log('birth  ', JSON.stringify(pick(b)));
console.log('same JSON:', JSON.stringify(a) === JSON.stringify(b), 'lengths', JSON.stringify(a).length, JSON.stringify(b).length);
const strip = (s) => { const { config, ...r } = s; return r; };
const ka = JSON.stringify(strip(a)), kb = JSON.stringify(strip(b));
console.log('same apart from config:', ka === kb);
if (ka !== kb) { const top = Object.keys(a).filter((k) => k !== 'config' && JSON.stringify(a[k]) !== JSON.stringify(b[k])); console.log('differing top keys:', top.join(',')); }
