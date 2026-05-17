# FMG fork — upgrade procedure

## Why this doc exists

`public/map/` is a fork of [Azgaar's Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator) (MIT). Every FMG release fixes bugs and adds features we'd like — but applying a new release means reconciling our integration patches without losing them. This doc is the runbook.

## Architecture: where the patches live

We deliberately keep the SettlementForge integration in **one extracted file** plus a tiny set of **scattered inline edits** in `main.js`. Two categories:

### 1. The bridge (cleanly extracted) — `public/map/sf-bridge.js`
- ~1,136 lines, one big IIFE: `initSettlementForgeBridge()`
- Implements the typed postMessage RPC the parent SettlementForge app talks to
- Wired by `<script defer src="sf-bridge.js?v=...">` in `index.html`, loaded AFTER `main.js` so FMG globals (`svg`, `pack`, `d3`, `cells`, `regenerateMap`, `graphWidth`, `graphHeight`, `seed`) are bound
- **An FMG upgrade does not touch this file.** Reapply it as-is.

### 2. Scattered inline patches in `public/map/main.js`
Small modifications to FMG's behavior that have to live inline. These need to be reapplied when upgrading. As of 2026-05 there are **4 of them**:

| Line (approx) | What | Why |
|---|---|---|
| `~16` | `if (false && PRODUCTION && "serviceWorker" in navigator)` | Disables FMG's SW registration — we don't want the embedded iframe registering its own SW. Pattern: prepend `false && ` to the condition. |
| `~275` | Error message text: "SettlementForge Map cannot run serverless…" | Replaces FMG's branded error string. |
| `~597` | Comment + branch in drop handler: "upload path only if this isn't a settlementforge drag" | Skips FMG's file-upload codepath when the drop carries our MIME type. |
| `~607` | `e.dataTransfer.getData('application/settlementforge')` | Checks for our drag MIME type before falling through to FMG's drop logic. |

When upgrading FMG, search the diff for the markers `settlementforge` / `SettlementForge` / `sf-` to find any new scattered patch sites that need to be carried forward.

## Upgrade procedure

1. **Get the new FMG release** locally (clone, checkout a tag, etc.)
2. **Diff against our fork**: `diff -ru <new-fmg>/ public/map/`
3. **Update `main.js`** to the new release's `main.js`. The 4 scattered patches above need to be reapplied:
   - SW disable (line ~16)
   - Branded error text (line ~275)
   - Drag-handler branches (lines ~597, ~607)
4. **Update FMG-native asset files** (`modules/`, `libs/`, `images/`, `styles/`, etc.) directly from the new release. We do not patch these.
5. **Leave `sf-bridge.js` alone.** If FMG's API surface has changed (e.g. `pack.cells.burgs` was renamed), update only the references inside `sf-bridge.js`.
6. **Bump cachebusters** so browsers don't serve stale files:
   - `main.js` URL in `index.html` (the `?v=...` suffix)
   - `sf-bridge.js` URL in `index.html`
   - `FMG_URL` in `src/components/WorldMap.jsx` (drives the iframe `src`)
7. **Run `npm run check`** — type-check + lint + 217+ tests + build.
8. **Manually verify** in a browser: world map loads, place a settlement, viewport pan/zoom, snapshot save/load.

## What we do NOT do

- **No subtree merge or git submodule.** FMG is vendored as plain files; the integration patches are too cross-cutting for a clean merge. Tried 2026-04, reverted because every conflict was a wall of cosmetic noise.
- **No upstream PR.** The bridge is too SettlementForge-specific to merge back. Azgaar has expressed openness to embedding hooks but the surface area would need a rewrite to be general.

## Why not a hard fork (rename + own it)?

That was on the table. Decision (2026-05): the extracted bridge + 4 documented inline patches is the right balance. A hard fork would mean we own ~14,000 lines of map-generation code we don't understand and can't reasonably maintain. Keeping the integration surface this small means upstream improvements (bug fixes, new biome generators, etc.) cost us at most an hour of reconciliation per release.

## Quick reference

```
public/map/
├── main.js          ← FMG-native + 4 scattered patches (1382 lines)
├── sf-bridge.js     ← All SettlementForge bridge logic (1136 lines)
├── index.html       ← Loads main.js then sf-bridge.js (both defer)
├── modules/         ← FMG-native, unpatched
├── libs/            ← FMG-native, unpatched
├── images/, charges/, heightmaps/, styles/  ← FMG-native, unpatched
└── (other small files)
```

Bridge dependency direction (load order matters):
```
main.js (FMG)        →  binds window.svg, window.pack, window.d3, …
  ↓
sf-bridge.js (SF)    →  reads those globals, opens postMessage bridge
  ↓
React app (parent)   →  src/lib/mapBridge.js owns the parent side of the RPC
```
