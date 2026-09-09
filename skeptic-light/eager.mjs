const root = process.argv[2];
const { EAGER_FIRST_PAINT_MODULES, ENGINE_SHARED_DOMAIN } = await import(`${root}/vite.config.js`);
const eager = EAGER_FIRST_PAINT_MODULES;
const set = eager instanceof Set ? [...eager] : (Array.isArray(eager) ? eager : Object.keys(eager || {}));
console.log(root.split('/').pop(), 'EAGER count =', set.length);
const probe = ['densityCreateBoundary', 'livingContentSeam', 'livingContentLaw', 'livingContentRoster', 'livingContentLawVersion',
  'settlementGenerateAction', 'generation.worker', 'customContentPreview.worker', 'instantWorldBody', 'WorldPage', 'ConstructionPanel', 'campaignContentBindingSession', 'composeInstantWorld'];
for (const p of probe) {
  const hits = set.filter(m => String(m).includes(p));
  console.log('  ', p, hits.length ? 'IN EAGER: ' + hits.join(',') : 'not eager');
}
const esd = ENGINE_SHARED_DOMAIN instanceof Set ? [...ENGINE_SHARED_DOMAIN] : (ENGINE_SHARED_DOMAIN || []);
console.log('  ENGINE_SHARED_DOMAIN size =', esd.length, '| livingContentRoster in it:', esd.some(m=>String(m).includes('livingContentRoster')));
