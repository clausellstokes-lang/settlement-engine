import { relative } from 'node:path';
const cfg = await import(process.argv[2]);
const eager = new Set([...cfg.EAGER_FIRST_PAINT_MODULES].map(p => relative(process.cwd(), p)));
for (const p of ['src/lib/accountSettlementContentPortability.js','src/store/accountImportBody.js','src/lib/accountContentPortability.js','src/domain/deterministicSort.js','src/domain/content/livingContentRoster.js','src/domain/content/customContentManifest.js','src/lib/importReconciliationAdmission.js','src/domain/content/customDefinitionIdentityProjection.js'])
  console.log('EAGER[' + p + ']=' + eager.has(p));
