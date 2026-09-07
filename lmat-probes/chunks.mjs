const ROOT = process.argv[2];
process.chdir(ROOT);
const mod = await import(`${ROOT}/vite.config.js`);
const cfg = typeof mod.default === 'function' ? mod.default({ mode: 'production', command: 'build' }) : mod.default;
const mc = cfg.build.rollupOptions.output.manualChunks;
const eager = mod.EAGER_FIRST_PAINT_MODULES;
const files = [
  'src/domain/density/densityCreateBoundary.js',
  'src/domain/density/densityLaw.js',
  'src/domain/content/livingContentLaw.js',
  'src/domain/content/livingContentLawVersion.js',
  'src/domain/content/livingContentSeam.js',
  'src/domain/content/livingContentRoster.js',
  'src/domain/content/settlementContentProvenance.js',
  'src/store/settlementSliceHelpers.js',
  'src/store/settlementGenerateAction.js',
];
console.log('EAGER_FIRST_PAINT_MODULES size:', eager.size);
for (const f of files) {
  const abs = `${ROOT}/${f}`;
  console.log(String(mc(abs) ?? 'UNPINNED').padEnd(18), (eager.has(abs) ? 'EAGER    ' : 'not-eager'), f);
}
console.log('--- ESD excisions count:', mod.ENGINE_SHARED_DOMAIN_EXCISIONS.length);
