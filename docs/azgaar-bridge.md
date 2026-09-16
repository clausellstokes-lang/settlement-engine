# Azgaar FMG Bridge

SettlementForge embeds a fork of [Azgaar's Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator) in an `<iframe>` and drives it over a typed `postMessage` RPC. FMG provides the geography (terrain, rivers, coastlines, biomes); SettlementForge draws all settlement icons, routes, and supply-chain overlays itself in a React layer on top. In embedded mode FMG generates geography **only** — no states, burgs, religions, or armies.

## The two halves

| Side | File | Role |
|---|---|---|
| Runtime config | `src/lib/mapRuntimeConfig.js` | Resolves the iframe URL, exact map origin, cache revision, and parent-origin handshake. Production is pinned to the CSP-approved separate origin. |
| Parent (app) | `src/lib/mapBridge.js` | `createMapBridge(getIframe, { targetOrigin })` — typed RPC client. Every command returns a Promise; commands issued before the iframe is ready are queued and drained in order. Push events fan out through a small emitter (`bridge.on(...)`). |
| Child origin | `public/map/sf-origin.js` | Resolves the explicit `parentOrigin` once and owns every child → parent send target. Missing configuration fails closed off loopback. |
| Child RPC | `public/map/sf-bridge.js` | Runs inside the forked FMG page. Overrides generation to geography-only, and handles the `settlementEngine:*` command surface. |

Production serves the fork at
`https://map.settlementforge.com/map/index.html`. The app-host `/map/*` paths
redirect there, so the fork's relaxed script surface cannot execute with the
app origin's Supabase session. Local Vite development may still use the
same-origin `/map/` copy on loopback.

## Separate-origin, source-validated messaging

The command surface is destructive (`resetMap`, `loadSnapshot`,
`clearAllPlacements`, terrain edits), so **both** ends validate every message on
two axes and never use a `'*'` target:

- **Parent** (`mapBridge.js`): ignores any message whose `event.origin` is not
  the runtime-configured map origin, or whose `event.source` is not the iframe
  it created. It sends only to that exact map origin.
- **Child** (`sf-origin.js` + `sf-bridge.js`): ignores any
  `settlementEngine:*` message whose `event.origin` is not the explicit
  `parentOrigin`, or whose `event.source !== window.parent`. Replies use the
  same closed-over parent origin.

Every command carries an opaque `_rid` (request id); replies echo it, errors come back as `{ _rid, _error }`, and push events carry no `_rid`.

> Do not use `frame-ancestors *` or a wildcard postMessage target. The map
> policy lists only the two production app origins.
> `X-Frame-Options` is intentionally absent from map responses because
> `SAMEORIGIN` would contradict the cross-origin embed; enforced
> `frame-ancestors` owns clickjacking protection there.

## Command surface (parent → iframe)

Typed helpers on the bridge (see `mapBridge.js`):

- Placement: `placeSettlement`, `removePlacement`, `clearAllPlacements`, `restorePlacements`
- Viewport: `getViewport`, `setViewport`, `fitMap`
- Snapshot: `saveSnapshot`, `loadSnapshot`, `resetMap(seed)`
- Terrain: `activateTool`, `deactivateTool`, `terrainUndo`, `terrainRedo`
- Templates: `setTemplate`, `getTemplates`
- Misc: `requestBurgList`, `setEmbeddedMode`

## Push events (iframe → parent)

`fmg:ready { seed, width, height, templates }`, `fmg:burgList`, `fmg:burgSelected`, `fmg:viewport` (throttled), `fmg:mapReset`, `fmg:snapshotLoaded`, `fmg:terrainChanged`.

## Snapshot flow (campaign persistence)

The map is persisted with the campaign, not regenerated on every open:

1. `saveSnapshot` asks FMG to serialize the current map (`prepareMapData`) and returns the text blob.
2. The blob is stored on the campaign as `mapState.fmgSnapshot` (see `src/store/mapSlice.js` / `campaignSlice.js`). It is large (~1MB), so `campaignSync.js` fingerprints it rather than re-serializing it on every dirty-check.
3. On open, `WorldMap.jsx` calls `loadSnapshot(mapState.fmgSnapshot)` to restore the exact geography. `resetMap(seed)` regenerates from a seed when there is no snapshot.

## Upgrading the FMG fork

`sf-bridge.js` is deliberately separate from FMG's `main.js` so a vanilla FMG upgrade can drop in a fresh `main.js` without losing the integration. It depends on FMG globals (`pack`, `regenerateMap`, `generate(options)`, `graphWidth/Height`, `prepareMapData`, `uploadMap`) being bound on `window`. See `docs/fmg-fork.md` for the upgrade procedure.
