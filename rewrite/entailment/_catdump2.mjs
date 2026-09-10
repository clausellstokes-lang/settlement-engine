import { institutionalCatalog } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneRW-DEFW/src/data/institutionalCatalog.js';
const want = /dock|shipyard|harbou|barge|palisade|walls|citadel|gates|granar|root cellar|warehouse|teleport|airship|druid|grove|warden|hired blades|customs|waystation|caravanserai|militia|watch|garrison|barracks|mercenary|free company|veteran|hireling|charter|adventurers/i;
for (const [tier, cats] of Object.entries(institutionalCatalog)) for (const [cat, rows] of Object.entries(cats)) for (const [name, r] of Object.entries(rows)) {
  if (!want.test(name)) continue;
  console.log(`${tier}\t${cat}\t${name}\ttrr=${JSON.stringify(r.tradeRouteRequired??null)}\tta=${JSON.stringify(r.terrainAccess??null)}\ttreq=${JSON.stringify(r.terrainRequired??null)}\tfbr=${JSON.stringify(r.forbiddenTradeRoutes??null)}\tfres=${JSON.stringify(r.forbiddenResources??null)}\ttags=${JSON.stringify(r.tags??null)}\tmagic=${JSON.stringify(r.magicLicense??null)}`);
}
