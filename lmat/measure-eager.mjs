import { relative } from 'node:path';
const cfg = await import(process.argv[2]);
const eager = [...cfg.EAGER_FIRST_PAINT_MODULES].map(p => relative(process.cwd(), p)).sort();
const esd = [...(cfg.ENGINE_SHARED_DOMAIN_EXCISIONS || [])];
console.log('EAGER_COUNT=' + eager.length);
const probes = [
  'src/domain/density/densityCreateBoundary.js',
  'src/domain/density/densityLaw.js',
  'src/domain/content/livingContentLaw.js',
  'src/domain/content/livingContentLawVersion.js',
  'src/domain/content/livingContentRoster.js',
  'src/domain/content/livingContentSeam.js',
  'src/store/settlementSliceHelpers.js',
  'src/store/settlementGenerateAction.js',
  'src/lib/instantWorld/composeInstantWorld.js',
];
for (const p of probes) console.log('EAGER[' + p + ']=' + eager.includes(p));
console.log('ESD_EXCISION_COUNT=' + esd.length);
if (process.env.DUMP === '1') for (const e of eager) console.log('E ' + e);
