// AGREE-FOLLOW-UP probe 6 — the sewer arm's one witness (uc1-acc-town-hills, germanic, road) at one
// tree: its civic houses (institutionNature civic) and its resource roster. Run per commit to
// bisect the Courthouse. usage: node sewerWitnessCivic.mjs <tree root>
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = resolve(process.argv[2]);
const imp = (p) => import(pathToFileURL(join(root, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { facetOf } = await imp('src/domain/spatial/cohesionWeave.js');
const s = generateSettlementPipeline({ settType: 'town', culture: 'germanic', terrainOverride: 'hills', tradeRouteAccess: 'road', monsterThreat: 'civilized' }, null, { seed: 'uc1-acc-town-hills', customContent: {} });
const civic = s.institutions.filter((i) => facetOf(i, 'institutionNature') === 'civic').map((i) => i.name + (i.status ? `[${i.status}]` : ''));
console.log(JSON.stringify({ civic, n: s.institutions.length, res: (s.config?.nearbyResources || []).map((r) => r.key || r) }));
