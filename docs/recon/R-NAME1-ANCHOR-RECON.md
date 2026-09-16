# R-NAME1-ANCHOR-RECON — war identity, route identity, and the prose-selection kernel (at `f49e83ac3`)

Orphaned sub-recon of the stood-down TE-NAME lane (§756), preserved. All receipts at build tip `f49e83ac3`.

## WAR IDENTITY — ⭐ THE FIND: NO DURABLE POST-WAR RECORD EXISTS
`warStatus.js` reads live pairs/ticks and NO reason type (zero occurrences). The one real war ledger is
`worldState.deployments[*]` (WR-1 persistence law, `worldState.js:107-134`) carrying `casusReasons[]
{type, score, receipt, atTick?}` (writer `pinDeploymentCasusReasons`, `warTermination.js:227`; `atTick`
FLAG-GATED on `warLayerEnabled && warTerminationEnabled`, `:243` — absent in the dormant default) and, on
COALITION JOINERS ONLY, `joinLedger[0].{originAttackerId, originSinceTick, sourceCauseTypes}`
(`warCoalitionLedger.js:109-120`; joiners' own `casusReasons` carry the synthetic `alliance_obligation`,
`warDeployment.js:1130-34`; `applyWorldPulse.js:466-476` deliberately RETIMES joiner ticks — "the army joins
NOW, not retroactively"). `openingTick` = 0 hits in src; `warId` has one READER and no writer
(`heraldIndex.js:160`). ⛔ **The ledger is DELETED at war end** (`delete deployments[attackerId]` at
`warDeployment.js:375/:395/:402/:624/:875`); the only post-war residue is
`powerStructure.previousGovernments[] {cause:'conquest', tick}` — no reason, no original pair.
**VERDICT:** a render-time war name keyed on (pair + reason + opening tick) is UNSTABLE across termination —
it vanishes exactly when the chronicle wants it. The stable render-time key is **sorted-original-pair +
reason type, degrading gracefully to pair-only post-war**. ⚠ PRODUCT NOTE FOR THE OWNER'S DESK: a DURABLE
war record (a Remembrance-grade ledger of concluded wars) does not exist and would be a NEW persistence
shape — owner-gated by nature; flagged, not chartered.

## ROUTE IDENTITY — THE GOOD ANCHOR
The durable persisted row exists and is EXACTLY what a route-name deriver wants:
`config._userRoutes[] {routeId, a, b, mode, createdTick, band, provenance…}` (`mutateUserRoute.js:66-78`),
identity minted by the zero-import leaf `userRouteIdentity.js` (`route.${low}.${high}.${mode}`; migration
193 recomputes server-side and refuses disagreement). Closed mode vocab `['land','water']`
(`userRoutes.js:69`). ⚠ THREE mode-vocabulary collisions to not mix: `water` (userRoutes) vs `sea`
(`MissionRec.legModes`, `roads/state.js:86`) vs `sea` (RoadsLayer style key). ⚠ `roadNetwork.js` edges carry
`burgId` NOT `settlementId` (dropped at emit, `:164` vs `:228-237`); mode is decided by the iframe A*, not
the edge (`RoadsLayer.jsx:95`); NO river mode exists anywhere. **No route or road is displayed under a name
anywhere in the codebase today** — every surface names destination/tier/band; `CharterRoadCard.jsx:25`
("Carters will know the road by name within a year") reads as the intentional forward-reference. A deriver
introduces the FIRST named-road surface; nothing migrates. `roadsProse.js`: 16 pools, 6 tokens
({npc},{home},{dest},{captor},{purpose},{payer} — the header under-declares five), roads named by `{dest}`.

## THE PROSE KERNEL — EXTRACT, DON'T IMPORT, DON'T DUPLICATE
`pickLine(pool, seed, interp)` (`eventProse.js:73-78`): FNV-1a-32 of the seed mod pool length;
CANONICAL-AT-ZERO (falsy seed → index 0); empty pool → `''`; zero rng draws. ⛔ `eventProse.js` is NOT a
cheap display import: 1,158 lines + ~2,445 lines of frozen pool closure, module-scope `flattenPools` work,
and its own header pins it to the LAZY engine chunk ("imported only by the lazy worldPulse sim kernels");
no display/component module imports it at runtime today — a display leaf would be the FIRST such edge.
The sanctioned cure is the `userRouteIdentity.js` precedent verbatim: **move the FUNCTION to a zero-import
leaf and have `eventProse.js` re-export it** so every engine import site is unchanged. ⚠ STRUCTURAL FLAG:
**six independent `fnv1a32` copies already exist** (`design/organic/ornament/fnv.js:12` ·
`pdf/primitives/Editable.jsx:48` · `npcResidency.js:84` · `npcLedger.js:177` · `newsVoice.js:32` ·
`eventProse.js:49`) — a known drift surface (`warReasonTaxonomy.js:145-6` records the drift-guard
precedent); consolidation to one leaf is a structural-prevention candidate for a housekeeping wave.
⚠ The pools are a golden-bound park-red surface ("growing these pools shifts same-seed picks") — a pure
re-home moves no bytes, but any seed-handling or ordering change moves persisted goldens.
