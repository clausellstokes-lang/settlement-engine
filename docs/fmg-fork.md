# FMG fork — upgrade procedure

## Why this doc exists

`public/map/` is a fork of [Azgaar's Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator) (MIT). Every FMG release fixes bugs and adds features we'd like — but applying a new release means reconciling our integration patches without losing them. This doc is the runbook.

## Architecture: where the patches live

We deliberately keep the SettlementForge integration in **two extracted files** plus a tiny set of **scattered inline edits** in `main.js`. Two categories:

### 1. The origin contract + bridge — `public/map/sf-origin.js`, `public/map/sf-bridge.js`
- `sf-origin.js` resolves the `parentOrigin` query exactly once, permits a
  no-query fallback only on loopback, and owns every child → parent send.
- ~1,136 lines, one big IIFE: `initSettlementForgeBridge()`
- Implements the typed postMessage RPC the parent SettlementForge app talks to
- Wired in the order `sf-origin.js` → `main.js` → `sf-bridge.js`. The bridge
  remains after `main.js` so FMG globals (`svg`, `pack`, `d3`, `cells`,
  `regenerateMap`, `graphWidth`, `graphHeight`, `seed`) are bound.
- **An FMG upgrade does not touch these two files.** Reapply them as-is.

### 2. Scattered inline patches in `public/map/main.js`
Small modifications to FMG's behavior that have to live inline. These must be reapplied when upgrading. The set has grown well past the original four; the current inline patches are all tagged `SettlementForge fork patch` in-source:

| Line (approx) | What | Why |
|---|---|---|
| `~16` | FMG's `PRODUCTION && "serviceWorker"` SW-registration block **and** `public/map/sw.js` are **DELETED outright** — *not* guarded with `false &&`. | Upstream `sw.js` `importScripts`-es workbox from a Google CDN onto our auth origin (persistent-control supply-chain risk). There is deliberately **no** `serviceWorker.register` anywhere in `main.js`; a re-vendor that restores the block or `sw.js` must be reverted. Pinned by `mapForkXssChain.test.js` (asserts `sw.js` absent + no `serviceWorker.register`). |
| `~275` | Error message text: "SettlementForge Map cannot run serverless…" | Replaces FMG's branded error string. |
| `~590–665` | The settlement drag-drop bridge — an **~80-line inline block**, not a one-line MIME check. Detects our `application/settlementforge` drag type, converts screen→map coords via `window.__sfScreenToMap`, mints a synthetic burg id, `findCell`s, and delegates `fmg:settlementPlaced` to `window.__sfBridgeOrigin.postToParent` (the same exact-origin closure used by `sf-bridge.js`). Debug `console.*` traces were stripped (they leaked settlement id/name/coords on every drop). | A blind re-vendor that keeps only the trivial upstream MIME check **silently breaks drag-to-place.** |
| `~344` `generateMapOnLoad` | Bails out when `generate()` left an empty/partial `pack` (generate swallows its own errors) so the follow-on draw calls don't throw behind the handled "please retry" dialog. |
| `~355` `focusOn` / `~796` `setSeed` | Null-guard `params.get("seed")` for `?from=MFCG` with no `seed` param (was an unhandled `TypeError` from `null.length`). |
| `~408` `toggleAssistant` | Early-return that **disables the remote OpenWidget SaaS chat** (`libs/openwidget.min.js` appends `<script src=cdn.openwidget.com>` to `<head>` under azgaar's org id) from loading onto the auth/payment origin. Upstream code left intact below the return; re-enabling is an owner decision. |
| `~858` `addLakesInDeepDepressions` | **NOT patched — a known FMG bug left alone (owner-gated).** `cells.t[c] = 1` indexes the typed array with the whole neighbor array instead of the neighbor id `n`, so inland-lake shores are never marked. Fixing it would change same-seed generation output ("a seed is a world"), so it is deliberately not touched here. |

When upgrading FMG, search the diff for `SettlementForge fork patch`, `settlementforge` / `SettlementForge`, and `sf-` to find every scattered patch site that must be carried forward.

### 3. Security patches to FMG-native module files (must survive an upgrade)

The fork historically shipped on the auth + payments origin; production now
loads it from `map.settlementforge.com` and redirects app-host `/map/*` requests
there. The in-fork XSS fixes remain load-bearing defense in depth (and protect
map data / downstream users), so they **must be reapplied** on every upgrade.
Upstream FMG treats a loaded `.map` as trusted; we do not (a `.map` can arrive
via manual upload, a `?maplink=` from a trusted host that serves a hostile file,
or — historically — a cross-user gallery import).

| File (approx line) | What | Why |
|---|---|---|
| `modules/ui/general.js` (~122) | Added `escapeHtml()` + `sanitizeMapSvg()` globals, right after the existing `sanitizeNoteHtml()` | Shared, early-loaded (before `load.js` / the editors) security helpers. `escapeHtml` entity-encodes untrusted `.map` text before it hits `innerHTML`; `sanitizeMapSvg` scrubs `<script>` / inline `on*=` handlers / `javascript:` hrefs from the raw map SVG while preserving legitimate drawing markup (inert `text/html` parse — no script exec, no fetch). |
| `modules/io/load.js` (~335) | `insertAdjacentHTML("afterbegin", data[5])` → `…, sanitizeMapSvg(data[5]))` | `data[5]` is the untrusted SVG segment of a loaded `.map`, injected verbatim onto our token-bearing origin — any smuggled event handler / `<script>` would run. |
| `modules/ui/markers-editor.js` (~98, ~121) | Wrapped `marker.icon` / the chosen icon in `escapeHtml(...)` before the `innerHTML` assignment (both the raw-text and `<img src="…">` branches) | `marker.icon` comes from `pack.markers = JSON.parse(data[35])` (untrusted) — a crafted value could inject a tag or break out of the `img src` attribute. |
| `modules/ui/notes-editor.js` (~68, ~83) | TinyMCE `import(url)` + `_setBaseUrl(...)` now resolve `libs/tinymce` via `new URL(..., document.baseURI)` instead of `https://azgaar.github.io/Fantasy-Map-Generator/libs/tinymce` | The upstream code fetches an unpinned cross-origin script at runtime onto our origin. TinyMCE is already vendored + hash-pinned under `libs/tinymce/` (in `VENDOR-MANIFEST.json`); loading it locally closes the supply-chain gap. (The `/map/` CSP `script-src` is `'self'`-only, so the remote fetch was also blocked — this additionally makes the notes editor load.) |
| `modules/ui/general.js` (~339, `updateCellInfo`) | The state / province / culture / religion / burg / biome **names** rendered by the cell-info hover overlay are now wrapped in `escapeHtml(...)` before the `innerHTML` assignment (the interpolated numeric cell indices are left as-is; `pack.features[f].group` is an engine enum, not `.map`-editable, so it is not wrapped). | `pack.*` is `JSON.parse`'d from an uploaded `.map`, so these names are untrusted strings rendered raw onto our token-bearing origin. This is the highest-value member of the map-text-sink class (below) — the cell-info overlay fires on ordinary map **hover**, no panel needed. |
| `modules/ui/layers.js` (~561, `drawProvinces`) | The province label `${p.name}` interpolated into the `#provs` SVG `innerHTML` is wrapped in `escapeHtml(...)`. | `p.name` is untrusted `.map` text, and this sink fires **automatically when the province layer renders** (map load / layer toggle) — no user interaction — so it is the highest-reach sink after the hover overlay. Escaping stops a crafted name smuggling an event-handler-bearing SVG element (e.g. `<image onerror=…>`) into the live DOM. |
| `modules/io/cloud.js` (~20, ~120) | (a) The Dropbox OAuth access token is held in **`sessionStorage`** (session-scoped) instead of `localStorage`, and (b) the `DEBUG.cloud && console.info("Access token:", token)` line was **removed**. | The token is a bearer secret. `sessionStorage` keeps it off disk across browser sessions (a restart forces re-auth); the console line leaked the raw token under a debug flag. **Residual risk:** the token remains readable by map-origin script for the life of the tab — inherent to the client-side Dropbox SDK, which needs the raw token to sign API calls; there is no server-side custody in this fork. |
| `modules/ui/ai-generator.js` (~196, `generate()`) | The BYOK AI generator's direct cross-origin egress to `api.openai.com` / `api.anthropic.com` / local Ollama is **disabled** by an early `return` at the top of `generate()` (the sole caller of `PROVIDERS[provider].generate`, so every LLM egress path is neutralized). Upstream code is left intact below the return for easy re-enable / upgrade reconciliation. | FMG's native "generate note with AI" button POSTs a user-supplied API key + prompt straight to an LLM host. It is hidden in the SettlementForge embed, while production app-host `/map/*` navigation redirects to the dedicated map host. The app's own AI path is server-brokered (`tests/security/clientAiBoundary.contract.test.js`). **Re-enabling this is an owner product decision.** The enforced map CSP also omits the LLM hosts from `connect-src`. |
| **The panel-gated `innerHTML` sink-sweep (SS1, 2026-07-20)** — every remaining untrusted-`.map`-string → `innerHTML` sink across ~24 fork files (the `*-overview.js` / `dynamic/editors/*.js` / `*-editor.js` list-builders, `hierarchy-tree.js`, `battle-screen.js`, `tools.js` marker-types, chart-hover tooltips, and the `regiment-editor` / `markers-overview` / `military-overview` / `battle-screen` / `tools.js` **icon-into-`img src`** twins of the wave-1 markers sink). Untrusted per-entity strings (names, types, groups, colors, icons, deity/form, codes) are wrapped in `escapeHtml()` at interpolation; the `diplomacy` relations-history contenteditable now persists **plain text** and escapes on render; the `notes-editor` AI-apply path routes through `sanitizeNoteHtml`; the `export.js` `@font-face` builder strips CSS-structural chars from the loaded font family. | Closes the whole panel-gated member of the map-text-sink class that section-3's earlier note deferred. Legitimate fork-built handlers (`onmouseover=showElementLockTip`) are preserved — escaping is **per-field**, never a wholesale scrub. **Residual (deliberately deferred):** custom **military-unit-type names** (`options.military[].name`) are also used in attribute-*name* position (`data-${u.name}=`), which output-escaping cannot neutralize — that needs load-time identifier validation (a different fix that would break `dataset[u.name]` read-back), so it is left as a documented residual. |
| `main.js` (~408, `toggleAssistant`) | The remote OpenWidget SaaS chat load is disabled (see §2). | Third-party remote-code surface on the auth/payment origin; chats route to azgaar's account. |
| `libs/umami.js` — **DELETED** (and removed from `VENDOR-MANIFEST.json`). | A dead third-party analytics beacon (POSTs nav data to `fmg-stats.herokuapp.com`). `grep` proved zero references, but a re-vendor of upstream `index.html` would restore its `<script>` tag. | A latent exfiltration primitive with no offsetting use — removed rather than carried. On upgrade, do **not** re-add it. |

Pinned by `tests/security/mapForkXssChain.test.js` (fork sinks — functional scrub/escape guards + structural routing checks) and `tests/security/mapSnapshotImport.contract.test.js` (the store-side gallery-import F6 guard for **both** `importGalleryMap` and `importGalleryMapWithCampaign`).

**The map-text-sink class is now CLOSED (SS1, 2026-07-20).** A 2026-07-20 enumeration of `public/map/modules/**` found **~51 untrusted-`.map`-string → `innerHTML` sinks** across ~25 files (out of ~340 total `innerHTML`/`insertAdjacentHTML` assignments; the other ~278 are numeric counts / `si()`/`rn()` formatters / `<path d=…>` geometry / static dialog copy). Wave 1 patched the raw-SVG and marker-icon sinks and closed the delivery vectors (gallery-import, `?maplink=`); wave 2 patched the two auto-firing sinks (`updateCellInfo` hover overlay, `drawProvinces` auto-render). **SS1 completed the sweep**, escaping every remaining **panel-gated** sink (they render only after a user manually opens the specific overview/editor on a loaded `.map`) — the `*-overview.js` / `dynamic/editors/*.js` / `*-editor.js` list-builders, `hierarchy-tree.js`, `battle-screen.js`, `tools.js`, the chart-hover tooltips, and the `regiment-editor` / `markers-overview` / `military-overview` / `battle-screen` / `tools.js` icon-into-`img src` twins of the markers sink. Each is a `SettlementForge fork patch`-tagged `escapeHtml()` (or `sanitizeNoteHtml` for the AI-note path). Pinned by source-slice checks in `mapForkXssChain.test.js`.

**Do not "revert to upstream" any of these on an FMG upgrade** — re-vendoring a fork editor file drops the escaping. Re-apply by re-wrapping the untrusted interpolations (search the old file for `escapeHtml(` / `SettlementForge fork patch`).

**Documented residual (not a bug to re-find):** custom **military-unit-type names** (`options.military[].name`) are interpolated into attribute-*name* position (`data-${u.name}=…`), which output-escaping cannot neutralize; the correct fix is load-time identifier validation (which would break the `dataset[u.name]` read-back if done naively), so it is deliberately left for a future targeted pass. The `main.js` `addLakesInDeepDepressions` typed-array bug (§2, `~858`) is likewise deferred (owner-gated — fixing it shifts same-seed output).

### 4. Branded / cosmetic patches to FMG-native files (survive an upgrade)

These are **not** in `main.js` and are easy to miss — a clean re-vendor reverts them silently. They are cosmetic (no security weight) but the runbook lists them so the reapply checklist is complete:

| File | What |
|---|---|
| `modules/ui/style-presets.js` (~32) | In embedded mode the default style preset is forced to `ancient` (parchment) instead of FMG's blue `default`, to match the SettlementForge palette. **This is a patch inside `modules/` — the "`modules/` is FMG-native/unpatched" shorthand is not literally true.** |
| `modules/ui/general.js` (~610) | The app-description `alertMessage` string is rebranded to "**SettlementForge Map** is an interactive fantasy cartography tool." |
| `versioning.js` (~54, ~66) | The "map has been updated to version …" notice text + dialog title are rebranded to "SettlementForge Map". |
| `manifest.webmanifest` | Fully rebranded PWA identity: `name` / `short_name` "SettlementForge Map", custom `description`, `scope`/`start_url` `/map/`, custom icon paths. |
| `index.html` | `<title>` / `application-name` / `author` meta (~7–9), a palette-override `<style>` block (~31), and `#titleName` "SettlementForge" (~411). |

## The `index-*.js` build bundle

`index.html` (~169) loads a hashed Vite bundle, currently `index-Bp79q281.js` (~672 KB), that holds a large chunk of FMG core (`window.drawTemperature`, `generate`, biome/graph globals). It is FMG-native (no SF markers) but is **not** pinned by `VENDOR-MANIFEST.json` (which pins `libs/` only) and is not diffed against upstream. On an upgrade it must be regenerated from the new release's build, not carried over stale, and the `<script src>` hash in `index.html` re-pointed. (Extending the hash gate to cover it, and `dropbox.html`'s inline OAuth script, is a tracked follow-up in `scripts/validate-map-fork.mjs` — its `SHIPPABLE_EXTS` currently pins only `.js/.mjs/.wasm/.css`.)

## Upgrade procedure

1. **Get the new FMG release** locally (clone, checkout a tag, etc.)
2. **Diff against our fork**: `diff -ru <new-fmg>/ public/map/`
3. **Update `main.js`** to the new release's `main.js`. Reapply **every** inline patch in §2's table (SW block + `sw.js` stay deleted, branded error text, the ~80-line drag-drop bridge, the `generateMapOnLoad` / `focusOn` / `setSeed` guards, and the `toggleAssistant` OpenWidget disable). Search the new `main.js` for the upstream shapes and re-apply — the `SettlementForge fork patch` tags in the old file mark every site.
4. **Update FMG-native asset files** (`libs/`, `images/`, `styles/`, etc.) directly from the new release — **BUT `modules/` and several top-level files are NOT pristine** and a blind overwrite silently reverts our patches. Reapply after overwriting:
   - **Security (§3, must survive):** the escaping in every `modules/**` sink the SS1 sweep touched (`*-overview.js`, `dynamic/editors/*.js`, `*-editor.js`, `hierarchy-tree.js`, `battle-screen.js`, `tools.js`, `general.js`, `layers.js`, `notes-editor.js`, `io/load.js`, `io/cloud.js`, `io/export.js`, `dynamic/auto-update.js`, `ai-generator.js`), plus the polish bug-fixes tagged `SettlementForge fork patch` in `military-overview.js`, `regiments-overview.js`, `routes-overview.js`, `charts-overview.js`, `world-configurator.js`, `relief-editor.js`, `namesbase-editor.js`, `biomes-editor.js`, `lakes-editor.js`, `versioning.js`, `editors.js`.
   - **Branding / cosmetic (§4 below):** `modules/ui/style-presets.js` (embedded-mode default preset), `modules/ui/general.js` (app-description string), `versioning.js`, `manifest.webmanifest`, and `index.html`.
   - **Supply-chain:** keep `libs/umami.js` **deleted**; keep `libs/openwidget.min.js` un-loaded (the `toggleAssistant` disable). Re-pin the manifest (`--update-manifest`) only after a *deliberate* upgrade.
5. **Leave `sf-origin.js` and `sf-bridge.js` alone.** If FMG's API surface has changed (e.g. `pack.cells.burgs` was renamed), update only the references inside `sf-bridge.js`.
6. **Bump cachebusters** so browsers don't serve stale files:
   - `MAP_FORK_REVISION` in `src/lib/mapRuntimeConfig.js` (drives the iframe)
   - `sf-origin.js` URL in `index.html`
   - `main.js` URL in `index.html` (the `?v=...` suffix)
   - `sf-bridge.js` URL in `index.html`
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
2. **Supply-chain hash manifest** — the same script hashes every vendored blob under `public/map/libs/` against `libs/VENDOR-MANIFEST.json` and fails CI on any mismatch / missing file. Separate-origin isolation reduces the blast radius but does not make executing unreviewed third-party bytes acceptable. **Note:** the manifest pins `libs/` only — `main.js` itself is acorn-parsed but **not** hash-pinned, so a hand-edit to `main.js` passes as long as it still parses.

Practical consequence: a logic bug, a stale reference (e.g. an FMG-API rename the bridge missed), or a behavioral regression in `main.js` will **not** be caught by any gate — it surfaces only in the manual browser verification (step 8 of the upgrade procedure). Treat `main.js` and `sf-bridge.js` as code that ships on manual review + smoke test, not on the gate.

After re-pinning the libs manifest following a deliberate upgrade:
`node scripts/validate-map-fork.mjs --update-manifest`

## Why not a hard fork (rename + own it)?

That was on the table. Decision (2026-05): the extracted bridge + the documented inline/module patches (§2–§4) is the right balance. A hard fork would mean we own ~14,000 lines of map-generation code we don't understand and can't reasonably maintain. Keeping the integration surface this small means upstream improvements (bug fixes, new biome generators, etc.) cost us at most an hour of reconciliation per release.

## Quick reference

```
public/map/
├── main.js          ← FMG-native + the §2 inline patches (~1385 lines)
├── sf-origin.js     ← Exact parent-origin resolver + outbound send closure
├── sf-bridge.js     ← All SettlementForge bridge logic (~1275 lines)
├── index-*.js       ← hashed Vite bundle of FMG core (~672 KB, NOT hash-pinned — see above)
├── index.html       ← Loads main.js then sf-bridge.js (both defer); also SF-branded (title/meta/palette/#titleName)
├── modules/         ← FMG-native, BUT patched: §3 security escaping + §4 branding (style-presets, general.js)
├── libs/            ← FMG-native + VENDOR-MANIFEST.json hash gate; umami.js deleted, openwidget.min.js not loaded
├── versioning.js, manifest.webmanifest  ← SF-branded (§4)
├── images/, charges/, heightmaps/, styles/  ← FMG-native, unpatched
└── (other small files)
```

Bridge dependency direction (load order matters):
```
sf-origin.js (SF)    →  resolves explicit parentOrigin, exposes exact send closure
  ↓
main.js (FMG)        →  binds window.svg, window.pack, window.d3, …
  ↓
sf-bridge.js (SF)    →  reads those globals, opens exact-origin RPC bridge
  ↓
React app (parent)   →  src/lib/mapBridge.js owns the parent side of the RPC
```

## Content-Security-Policy for `/map/*`

Deployment/DNS/header verification lives in
`docs/ops/FMG_ORIGIN_RUNBOOK.md`; this section explains why the fork policy
must remain different from the app policy.

`vercel.json` applies a **path-scoped, deliberately relaxed CSP to `/map/*`** that is looser than the locked-down app-origin policy. This rationale lives here rather than as an inline comment because Vercel's `headers` schema is strict (`additionalProperties: false`) and rejects a `"//"` comment key inside a `headers` entry — it fails the deploy with `'headers[1]' should NOT have …`.

The vendored FMG fork is a large third-party app that the strict app-origin policy would break, so `/map/*` relaxes specific directives:
- `public/map/index.html` ships ~80 inline `on*=` handlers → needs `'unsafe-inline'` for `script-src`.
- d3-dsv's CSV parser builds row objects via `new Function` → needs `'unsafe-eval'`.
- `public/map/dropbox.html` loads a **local vendored** `libs/dropbox-sdk.min.js` (hash-pinned; **not** unpkg — the CDN load was deliberately removed in wave 1) and talks to `api.dropboxapi.com` for cloud save/load. The `connect-src` relaxation for the Dropbox API hosts is what remains load-bearing here; do **not** re-add unpkg/CDN trust to `script-src`.
- FMG embeds `watabou.github.io` / `deorum.vercel.app` generators in iframes.

**Current enforcement posture:** both policies ship as enforcing
`Content-Security-Policy` headers and continue reporting violations to
`api/csp-report.js`. The app policy admits only
`https://map.settlementforge.com` in `frame-src`. The map policy admits the
the two production app hosts in `frame-ancestors`.
`X-Frame-Options: SAMEORIGIN` remains on the app but is deliberately absent on
the map response because it would block the intended cross-origin embed; the
map's enforced `frame-ancestors` directive is its clickjacking authority.

These relaxations are **scoped to `/map/*` only** — the app origin keeps its
locked-down `script-src` (`'self' 'wasm-unsafe-eval'`, no `'unsafe-inline'` /
`'unsafe-eval'`). The policies use mutually exclusive path patterns, and
production app-host `/map/*` requests redirect to the dedicated map origin so
the relaxed fork never executes with app-origin storage. The map rule retains
HSTS, nosniff, referrer, and permissions headers; only the incompatible
same-origin X-Frame-Options header is omitted. These invariants are enforced by
`tests/security/cspHeaderShape.test.js` and
`tests/security/cspForkIsolation.test.js`.

Do not remove or "tidy" the `/map/*` CSP relaxation without re-verifying the embedded map still loads — tightening it will silently break FMG.
