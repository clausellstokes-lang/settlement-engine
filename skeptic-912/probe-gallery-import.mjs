// SKEPTIC PROBE (read-only): the PUBLIC SHARE -> GALLERY IMPORT path.
// car 4 drops customContentRoster from the public projection (R-A) and keeps
// config._livingContentLawVersion (R-D).  galleryImportSettlement.js:73 scrubs
// the imported config with scrubImportedConfig.  What lands in the library?
const D = process.argv[2];
const { generateSettlementPipeline } = await import(`${D}/src/generators/generateSettlementPipeline.js`);
const { registerLivingContentRosterBuilder } = await import(`${D}/src/domain/content/livingContentSeam.js`);
const { buildLivingContentRoster } = await import(`${D}/src/domain/content/livingContentRoster.js`);
const { toPublicSafe } = await import(`${D}/src/domain/display/publicSafe.js`);
const { scrubImportedConfig } = await import(`${D}/src/lib/importScrub.js`);
const { materializesLivingContent } = await import(`${D}/src/domain/content/livingContentLawVersion.js`);
registerLivingContentRosterBuilder(buildLivingContentRoster);
const KEY = '_livingContentLawVersion';
const CONFIG = { settType:'town', culture:'germanic', terrainOverride:'plains', tradeRouteAccess:'crossroads', monsterThreat:'civilized', [KEY]: 2 };
const pack = { deities:[{ id:'d1', name:'Sample', customDefinitionId:'def-1', customDefinitionRevisionId:'rev-1' }] };
const lit = generateSettlementPipeline({ ...CONFIG }, null, { seed:'skeptic-gallery', customContent: pack });
console.log('lit: roster present     =', lit.customContentRoster !== undefined);
console.log('lit: marker             =', lit.config[KEY]);
const pub = toPublicSafe(lit);
console.log('public: roster present  =', pub.customContentRoster !== undefined);
console.log('public: marker          =', pub.config?.[KEY]);
const imported = scrubImportedConfig(pub.config);
console.log('imported config marker  =', imported?.[KEY]);
console.log('imported world reads LIT =', materializesLivingContent(imported));
console.log('=> LIT world in the importer library with NO roster:',
  materializesLivingContent(imported) && pub.customContentRoster === undefined);
