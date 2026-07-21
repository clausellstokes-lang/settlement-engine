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

### 3. Security patches to FMG-native module files (must survive an upgrade)

The fork ships to the **same origin as the auth + payments app**, so an XSS anywhere in it is an account-takeover-class bug. Upstream FMG treats a loaded `.map` as trusted; we do not (a `.map` can arrive via manual upload, a `?maplink=` from a trusted host that serves a hostile file, or — historically — a cross-user gallery import). These patches close the injection sinks and **must be reapplied** on every upgrade. Search the diff for `SettlementForge fork patch` to relocate them.

| File (approx line) | What | Why |
|---|---|---|
| `modules/ui/general.js` (~122) | Added `escapeHtml()` + `sanitizeMapSvg()` globals, right after the existing `sanitizeNoteHtml()` | Shared, early-loaded (before `load.js` / the editors) security helpers. `escapeHtml` entity-encodes untrusted `.map` text before it hits `innerHTML`; `sanitizeMapSvg` scrubs `<script>` / inline `on*=` handlers / `javascript:` hrefs from the raw map SVG while preserving legitimate drawing markup (inert `text/html` parse — no script exec, no fetch). |
| `modules/io/load.js` (~335) | `insertAdjacentHTML("afterbegin", data[5])` → `…, sanitizeMapSvg(data[5]))` | `data[5]` is the untrusted SVG segment of a loaded `.map`, injected verbatim onto our token-bearing origin — any smuggled event handler / `<script>` would run. |
| `modules/ui/markers-editor.js` (~98, ~121) | Wrapped `marker.icon` / the chosen icon in `escapeHtml(...)` before the `innerHTML` assignment (both the raw-text and `<img src="…">` branches) | `marker.icon` comes from `pack.markers = JSON.parse(data[35])` (untrusted) — a crafted value could inject a tag or break out of the `img src` attribute. |
| `modules/ui/notes-editor.js` (~68, ~83) | TinyMCE `import(url)` + `_setBaseUrl(...)` now resolve `libs/tinymce` via `new URL(..., document.baseURI)` instead of `https://azgaar.github.io/Fantasy-Map-Generator/libs/tinymce` | The upstream code fetches an unpinned cross-origin script at runtime onto our origin. TinyMCE is already vendored + hash-pinned under `libs/tinymce/` (in `VENDOR-MANIFEST.json`); loading it locally closes the supply-chain gap. (The `/map/` CSP `script-src` is `'self'`-only, so the remote fetch was also blocked — this additionally makes the notes editor load.) |
| `modules/ui/general.js` (~339, `updateCellInfo`) | The state / province / culture / religion / burg / biome **names** rendered by the cell-info hover overlay are now wrapped in `escapeHtml(...)` before the `innerHTML` assignment (the interpolated numeric cell indices are left as-is; `pack.features[f].group` is an engine enum, not `.map`-editable, so it is not wrapped). | `pack.*` is `JSON.parse`'d from an uploaded `.map`, so these names are untrusted strings rendered raw onto our token-bearing origin. This is the highest-value member of the map-text-sink class (below) — the cell-info overlay fires on ordinary map **hover**, no panel needed. |
| `modules/ui/layers.js` (~561, `drawProvinces`) | The province label `${p.name}` interpolated into the `#provs` SVG `innerHTML` is wrapped in `escapeHtml(...)`. | `p.name` is untrusted `.map` text, and this sink fires **automatically when the province layer renders** (map load / layer toggle) — no user interaction — so it is the highest-reach sink after the hover overlay. Escaping stops a crafted name smuggling an event-handler-bearing SVG element (e.g. `<image onerror=…>`) into the live DOM. |
| `modules/io/cloud.js` (~20, ~120) | (a) The Dropbox OAuth access token is held in **`sessionStorage`** (session-scoped) instead of `localStorage`, and (b) the `DEBUG.cloud && console.info("Access token:", token)` line was **removed**. | The token is a bearer secret and the fork ships same-origin with auth + payments. `sessionStorage` keeps it off disk across browser sessions (a restart forces re-auth); the console line leaked the raw token under a debug flag. **Residual risk:** the token is still readable by same-origin script for the life of the tab — inherent to the client-side Dropbox SDK, which needs the raw token to sign API calls; there is no server-side custody in this fork. |
| `modules/ui/ai-generator.js` (~196, `generate()`) | The BYOK AI generator's direct cross-origin egress to `api.openai.com` / `api.anthropic.com` / local Ollama is **disabled** by an early `return` at the top of `generate()` (the sole caller of `PROVIDERS[provider].generate`, so every LLM egress path is neutralized). Upstream code is left intact below the return for easy re-enable / upgrade reconciliation. | FMG's native "generate note with AI" button POSTs a user-supplied API key + prompt straight to an LLM host from our token-bearing `/map/` origin. **Reachability:** hidden in the SettlementForge iframe embed (`sf-bridge.js` adds `sf-embedded`, which hides `#optionsContainer` / the notes editor that hosts the button), but reachable via direct top-level `/map/` navigation, where it is a latent exfil vector. The app's own AI path is server-brokered (`tests/security/clientAiBoundary.contract.test.js`). **Re-enabling this is an owner product decision.** The `/map/` CSP `connect-src` does not list the LLM hosts, so flipping the `/map/` CSP from `Report-Only` to enforced is the complementary origin-level closure. |

Pinned by `tests/security/mapForkXssChain.test.js` (fork sinks — functional scrub/escape guards + structural routing checks) and `tests/security/mapSnapshotImport.contract.test.js` (the store-side gallery-import F6 guard for **both** `importGalleryMap` and `importGalleryMapWithCampaign`).

**Known documented follow-on (partially done — the rest DELIBERATELY DEFERRED, not a bug to re-find):** a full enumeration (2026-07-20) of `public/map/modules/**` found **~51 untrusted-`.map`-string → `innerHTML` sinks** across ~25 files (out of ~340 total `innerHTML`/`insertAdjacentHTML` assignments; the other ~278 are numeric counts / `si()`/`rn()` formatters / `<path d=…>` geometry / static dialog copy, and ~11 are already sanitized via `sanitizeNoteHtml`/`escapeHtml`/`sanitizeMapSvg`).

**Fixed in this wave** = the sinks that fire **without opening a tools-menu panel**: the `updateCellInfo` hover overlay (general.js) and the `drawProvinces` auto-render (layers.js), both above.

**Deferred** = the remaining ~40+ sinks, **all of which are panel-gated** — they render only after a user manually loads a hostile `.map` (the automated gallery-import and raw-SVG delivery vectors are closed by wave 1) **and** opens the specific overview/editor that builds the list. They are the same mechanical `escapeHtml`-routing shape and split into two sub-classes:
- **Name/text list-builders** in `modules/ui/*-overview.js` (burgs 141 / rivers 79 / routes 70 / regiments 102 / military 119 / markers 105), `modules/dynamic/editors/*.js` (states 266 / cultures 220 / religions 218), and `modules/ui/*-editor.js` (burg 65, provinces 186, biomes 136/313, zones 115, diplomacy 139/446, burg-group 55/124/193, labels 316/317, namesbase 100), plus `dynamic/hierarchy-tree.js` 385/439 and the chart-hover tooltips (burgs-overview 354, provinces-editor 692, states-editor 781).
- **Icon-into-`img src` sinks** — the exact structural parallel of the marker-icon sink that wave 1 *did* patch in `markers-editor.js`, left unescaped in `modules/ui/regiment-editor.js` (47/162/163), `markers-overview.js` (105), `military-overview.js` (339), `battle-screen.js` (202), and the marker-types editor `tools.js` (912). **Flagged here so the regiment-editor↔markers-editor asymmetry is a recorded deferral, not a surprise.**

These were deferred (rather than forced into this wave) because a correct routing sweep across ~25 vendored fork files that no gate type-checks or lints, and that cannot be runtime-tested here, carries more regression risk than the defense-in-depth value warrants — the delivery vectors are already closed and the remainder is panel-gated. Do them as a single mechanical `escapeHtml`-routing pass when the fork is next touched, and pin each with a source-slice check in `mapForkXssChain.test.js` (the wave-2 idiom).

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

## Gate coverage — what does and does NOT see `main.js`

`public/map/main.js` (and the rest of `public/map/`) is a vendored third-party fork that lives **outside every code-quality gate the rest of the repo runs**:

- **NOT** ESLint-linted (the app's `.eslintrc` ignores `public/`).
- **NOT** type-checked (`tsconfig.json` covers `src/` only; this is plain ES5-era browser JS).
- **NOT** run through Prettier / the formatter.
- **NOT** exercised by the vitest unit suite (no test imports `main.js` directly).

Its **only** automated gates are:

1. **Acorn parse check** — `scripts/validate-map-fork.mjs` (npm script `validate:map`, part of `npm run check`) walks `public/map/` and parses every `.js` (incl. `main.js` and `sf-bridge.js`) with acorn in both `script` and `module` modes. This catches a syntax error a hand-edit might introduce, and **nothing more** — it does not check types, style, dead code, or behavior.
2. **Supply-chain hash manifest** — the same script hashes every vendored blob under `public/map/libs/` against `libs/VENDOR-MANIFEST.json` and fails CI on any mismatch / missing file (a tamper / silent-swap guard, since these blobs ship to the same origin as the payment+auth app). **Note:** the manifest pins `libs/` only — `main.js` itself is acorn-parsed but **not** hash-pinned, so a hand-edit to `main.js` passes as long as it still parses.

Practical consequence: a logic bug, a stale reference (e.g. an FMG-API rename the bridge missed), or a behavioral regression in `main.js` will **not** be caught by any gate — it surfaces only in the manual browser verification (step 8 of the upgrade procedure). Treat `main.js` and `sf-bridge.js` as code that ships on manual review + smoke test, not on the gate.

After re-pinning the libs manifest following a deliberate upgrade:
`node scripts/validate-map-fork.mjs --update-manifest`

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

## Content-Security-Policy for `/map/*`

`vercel.json` applies a **path-scoped, deliberately relaxed CSP to `/map/*`** that is looser than the locked-down app-origin policy. This rationale lives here rather than as an inline comment because Vercel's `headers` schema is strict (`additionalProperties: false`) and rejects a `"//"` comment key inside a `headers` entry — it fails the deploy with `'headers[1]' should NOT have …`.

The vendored FMG fork is a large third-party app that the strict app-origin policy would break, so `/map/*` relaxes specific directives:
- `public/map/index.html` ships ~80 inline `on*=` handlers → needs `'unsafe-inline'` for `script-src`.
- d3-dsv's CSV parser builds row objects via `new Function` → needs `'unsafe-eval'`.
- `public/map/dropbox.html` loads the Dropbox SDK from unpkg and talks to `api.dropboxapi.com`.
- FMG embeds `watabou.github.io` / `deorum.vercel.app` generators in iframes.

These relaxations are **scoped to `/map/*` only** — the app origin keeps its locked-down `script-src` (`'self' 'wasm-unsafe-eval'`, no `'unsafe-inline'` / `'unsafe-eval'`). The isolation is enforced by **mutually-exclusive `source` patterns**, NOT by rule order: the app-wide header block matches `/((?!map/).*)` (a negative lookahead that excludes every `/map/` path), while the relaxed block matches `/map/(.*)`. So any given request matches exactly ONE of the two blocks and receives exactly ONE `Content-Security-Policy` header. This is deliberately robust against how a CDN combines overlapping header rules: if both the strict and the relaxed blocks matched a `/map/` path, a browser would enforce the **intersection** of the two CSP headers (the stricter policy), silently breaking FMG — so we never let both match. The relaxed `/map/*` block also carries the same HSTS / nosniff / frame / referrer / permissions headers as the app block, since excluding `/map/` from the app block would otherwise drop them there. (Enforced by `tests/security/cspForkIsolation.test.js`.)

Do not remove or "tidy" the `/map/*` CSP relaxation without re-verifying the embedded map still loads — tightening it will silently break FMG.
