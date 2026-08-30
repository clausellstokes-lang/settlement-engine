# R-NAME3-ENGAGEMENT-RECON — the engagement record, terrain derivability, and the narration seams (at `f49e83ac3`)

Orphaned sub-recon of the stood-down TE-NAME lane (§756), preserved because it REFUTES a design premise and
shrinks an owner ask. All receipts at build tip `f49e83ac3`.

## THE PREMISE REFUTATION (the load-bearing find)
Field battles are minted in **`armyTransitKernel.js`**, NOT `warDeployment.js` (which mints only
siege/conquest outcomes). `region` exists at MINT TIME only (`armyTransitKernel.js:910` `region: col.region`)
and is consumed at `:596` by baking a DISPLAY NAME into `reasons[0]` ("A crossing-path collision in
${name}'s approaches."). **The persisted entry (:600-619) has NO `region` key**; `settlementIds` are the two
COMBATANTS, not the location. ⇒ **Terrain for field battles is NOT render-time derivable** (reverse-mapping a
name string is lossy and parses prose). **The minimal Q-W4-family ask is therefore: persist `region` (the
settlement id, already in hand at :910) — an additive field, strictly smaller than a persisted terrain
class**; terrain then derives at render time through the same path sieges use.
**Sieges ARE derivable, no new bytes**: siege carries `targetId` (`warStatus.js:120`; conquest
`targetSaveId` at `warDeployment.js:809`) → snapshot item → `resolveSettlementTerrain`
(`resolveTerrain.js:57-63`, closed vocab `plains|hills|forest|riverside|coastal|mountain|desert`).

## HAZARD — TWO TERRAIN VOCABULARIES THAT NEVER SHARED A TYPE
`resolveTerrain.js:11-12` (7 classes, above) vs `spatialCost.js:154-167` `terrainClassOf`
(`water|mountain|desert|grassland|forest|tundra|glacier|wetland`); `spatialCost.js:169-184` documents the
disagreement as real and tracked (`terrainDisagreements`, `spatialDigest.js:332-372`). The V-6 biome
sub-digest carries per-settlement terrain but is DARK by default (`biomeTruthEnabled === true` opt-in,
`campaignSpatialCanonize.js:84`; absent ⇒ byte-identical canon). A battle-kind taxonomy must pick ONE
vocabulary and never silently mix them.

## ENGAGEMENT KINDS AT THE TIP (the roster a taxonomy must cover)
`field_battle` (`armyTransitKernel.js:609`) · `sea_battle` (`navalKernel.js:232`; input `{winnerId, loserId,
region, lostConvoy, debarkPort, drowned}` at :213 — region/debarkPort also dropped into prose) ·
`blockade_declared`/`blockade_lifted` (`navalKernel.js:170/:198`) · `intervention_clash`
(`convergence.js:1370`, a SECOND field-battle producer, tags include `field_battle`) · conquest/razing
power-transfer (`warDeployment.js:801-850`). Convoy interception is supply-side, not an engagement
(`supplyShipments.js:209/:504/:227` — no battle news minted).
**Any new battle-kind token must register in THREE routing tables or it falls off the chronicle:**
`chroniclersLetter.js:84` · `heraldRouting.js:92` · `rumorPhrasePools.js:822`.

## THE NARRATION SEAMS (where a NAME-3 deriver sits)
- `WAR_RECEIPTS` (`warReceiptPools.js:38`, ~30 keyed pools ×4 variants) narrates CAUSES (grievance,
  revanchism, war_trajectory_*) — NO engagement keys exist ⇒ clean non-overlapping seam.
- The rumor voice (`settlementRumors.js:128` "a battle in the field"; `rumorPhrasePools.js:157-163` five
  oblique variants) is the FOGGED register — a receipted deriver must not contradict it.
- The house prose in the entries themselves is FIXED, single hardcoded headline/summary per kind
  (`armyTransitKernel.js:606-607` · `navalKernel.js:229-230` · `convergence.js:1367-1368`) — variation over
  record-standing facts is the actual gap.
- ⚠ The §754.3 Herald directive binds: the conquest receipt at `warDeployment.js:813-816` interpolates
  capacity floats, fall chance and roll into `reasons` — TE-HERALD-1's list already carries it.

## PDF/IMPORT BOUNDARY (with two corrections to the recorded constraint)
`src/pdf/lib/liveWorld.js:56-65` consumes warStatus selectors + `deployedArmyStatus`. The
`WarFaithTab.jsx:11-15` zero-import constraint is (1) STALE — `warStatus.js:28` now imports
`isLiveWarFront`; (2) about FIRST PAINT, not the PDF worker — `liveWorld.js` already sits on the heavy chain
via `armyStrength.js:30 → militaryStrength`. Safe host for a shared deriver: `warStatus.js`-side; anything
reaching `militaryStrength` stays PDF/lazy-only.
