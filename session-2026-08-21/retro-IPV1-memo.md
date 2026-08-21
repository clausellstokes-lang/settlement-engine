# IPV-1 — VENDORED-FMG / TINYMCE EXPOSURE CENSUS

Read-only lane. No edits, no git mutation, no gate run. All figures executed in
`/Users/cstokes/Desktop/settlement-engine` on 2026-08-21.

**Ref state at census time (CONFIRMED):**

```
$ git rev-parse --short refs/heads/review-fixes-2026-07-08 refs/heads/claude/composite-r4 refs/heads/master HEAD
1273f0a1   (ledger)
4eafca31   (build / composite-r4)
d024286e   (master)
1273f0a1   (HEAD == ledger tip)
```

The ledger ref advanced during this session (chair commit `1273f0a1`, "§293: the
prior-art/meta cluster ruled … IPV-1 opened on the vendored-FMG exposure"). Every
`public/map` figure below is byte-identical between the pre- and post-advance
reads, so no drift.

---

## ⛔ THE HEADLINE: THE MITIGATING FACT IN §293.2a IS WRONG ON THE LEDGER AND BUILD BRANCHES

ODQ §293.2a records: *"the vendored copy's own notes editor loads TinyMCE from the
upstream CDN, so the local 123 files are plausibly dead weight."*

**That is FALSE on the ledger ref, on `claude/composite-r4`, and at HEAD.** It is
TRUE only on `master` (which is 2,790 commits behind and has landed nothing since
2026-07-05). A SettlementForge security fork patch — landed 2026-07-20 in
`e2b7abf8` — deliberately re-pointed the loader at **our own local copy**:

```
$ git show HEAD:public/map/modules/ui/notes-editor.js | sed -n '66,90p'
  async function initEditor() {
    if (!window.tinymce) {
      // SECURITY (SettlementForge fork patch): load TinyMCE from our OWN vendored,
      // hash-pinned copy (public/map/libs/tinymce/, in VENDOR-MANIFEST.json), not
      // from Azgaar's upstream GitHub Pages host at runtime — that was an unpinned
      // cross-origin script on our token-bearing origin. The /map/ CSP script-src
      // is 'self'-only, so the remote fetch was also blocked; the local path both
      // closes the supply-chain gap and makes the editor actually load.
      const url = new URL("libs/tinymce/tinymce.min.js", document.baseURI).href;
      ...
    if (window.tinymce) {
      window.tinymce._setBaseUrl(new URL("libs/tinymce", document.baseURI).href);
      tinymce.init({
        license_key: "gpl",
```

Three consequences, all **CONFIRMED**:

1. The local 123 files are **not dead weight** — they are the *only* TinyMCE the
   Notes editor can load, and the `/map/` CSP `script-src 'self'` blocks the
   upstream fetch outright, so the CDN path is not even a live fallback.
2. `license_key: "gpl"` is set in the init call on **every** ref (master included).
   That is TinyMCE's own GPL-mode switch — the product invokes TinyMCE 7.1.0 under
   GPLv2-or-later by explicit declaration in our tree.
3. The bytes are conveyed regardless of reachability: they are static assets served
   from `https://map.settlementforge.com/map/libs/tinymce/*`.

`docs/fmg-fork.md:51` documents the same patch, so the mitigating fact was
contradicted by an in-repo doc at the moment it was recorded.

---

## 1. WHICH REFS CARRY IT — and which ref deploys

### 1a. Presence per ref (CONFIRMED)

```
$ for R in refs/heads/review-fixes-2026-07-08 refs/heads/claude/composite-r4 refs/heads/master; do
    git ls-tree -r --name-only $R -- public/map | wc -l
    git ls-tree -r --name-only $R -- public/map/libs/tinymce | wc -l; done
### refs/heads/review-fixes-2026-07-08  (ledger)
  public/map total files:      636
  public/map/libs/tinymce:     123
### refs/heads/claude/composite-r4     (build)
  public/map total files:      636
  public/map/libs/tinymce:     123
### refs/heads/master                  (deploy source)
  public/map total files:      636
  public/map/libs/tinymce:     123
```

### 1b. Every other ref (CONFIRMED)

```
$ git for-each-ref --format='%(refname)' refs/heads/ | while read R; do
    N=$(git ls-tree -r --name-only "$R" -- public/map | wc -l); [ "$N" != 0 ] && echo x; done | wc -l
     404
$ git for-each-ref refs/heads/ | wc -l
     404
$ (same over refs/remotes/)
      39   of 40 remote refs
```

**404 of 404 local heads carry `public/map`; 39 of 40 remote refs carry it** (the
one exception is `refs/remotes/origin/HEAD`, a symref). Per-branch counts are 635
or 636 (the ±1 is an unrelated non-`libs` file); **`tinymce` is 123 on every single
ref without exception.** There is no clean ref anywhere in this repo.

### 1c. Which ref deploys production (CONFIRMED, from config not guess)

`.github/workflows/ci.yml` — both deploy jobs are master-only:

```
517:  deploy:  # deploy-gate: optional — this job IS the deploy action, not a gate on it
520:    if: github.ref == 'refs/heads/master' && github.event_name == 'push'
540:        run: npx vercel deploy --prod --token "$VERCEL_TOKEN" --yes
553:  redeploy:
556:    if: github.ref == 'refs/heads/master' && github.event_name == 'push'
```

`docs/DEPLOY.md` corroborates: *"Both are `master`-only and safely no-op when their
respective secret is absent"*, and describes Vercel push auto-deploy as the
still-live alternative path gated by `scripts/vercel-ignore-build.mjs`.

`vercel.json` (identical on all three refs) — the map has its own deploy topology:

```json
"redirects": [
  { "source": "/map/:path*", "has": [{"type":"host","value":"settlementforge.com"}],
    "destination": "https://map.settlementforge.com/map/:path*", "permanent": false },
  { "source": "/map/:path*", "has": [{"type":"host","value":"www.settlementforge.com"}],
    "destination": "https://map.settlementforge.com/map/:path*", "permanent": false }
],
"headers": [
  { "source": "/((?!map/).*)", ... "frame-src 'self' https://map.settlementforge.com ..." },
  { "source": "/map/(.*)",     ... "script-src 'self' 'unsafe-inline' 'unsafe-eval'; ...
                                    frame-ancestors https://settlementforge.com https://www.settlementforge.com" }
]
```

`docs/ops/FMG_ORIGIN_RUNBOOK.md` is explicit about the topology:

> Create a dedicated Vercel project/domain for `map.settlementforge.com`. **Deploy
> the same built static map at `/map/*`.** … `VITE_FMG_URL=https://map.settlementforge.com/map/index.html`

So `dist/map/**` — including `dist/map/libs/tinymce/**` — is the payload of the
**map host**, and the apex/www hosts 307 `/map/*` to it. The GPL bytes are served
from the map project, not the app project.

**⚠ CONSEQUENCE THE CHAIR SHOULD WEIGH: `master` is frozen at 2026-07-05.**

```
$ git rev-list --left-right --count refs/heads/master...refs/heads/review-fixes-2026-07-08
0    2790          (left = master-only, right = ledger-only)
$ git rev-list --left-right --count refs/heads/master...refs/heads/claude/composite-r4
0    2683
```

Master contains **none** of the FMG hardening. On master, `notes-editor.js` still
reads:

```
const url = "https://azgaar.github.io/Fantasy-Map-Generator/libs/tinymce/tinymce.min.js";
window.tinymce._setBaseUrl("https://azgaar.github.io/Fantasy-Map-Generator/libs/tinymce");
```

and `toggleAssistant()` still has **no `return;` guard** — the openwidget load is
LIVE on master. If anything is deployed from master today it carries the *worse*
posture on both counts, while still conveying all 123 GPL files as static assets.
PLAUSIBLE (not executed): nothing has actually deployed since 2026-07-05.

---

## 2. CONSUMER CENSUS — the FMG overlay is a LIVE, WIRED PRODUCT FEATURE, not an orphan

### 2a. App-side consumers (CONFIRMED)

```
$ git grep -ln -E "mapRuntimeConfig|mapBridge|MapFrame|useMapBridgeOrigin" HEAD -- src
src/components/gallery/MapShareEditor.jsx
src/components/loadingJourney/useRealmLoadProgress.js
src/components/map/WorldMapStage.jsx
src/hooks/useMapBridge.js
src/lib/mapBridge.js
src/lib/mapRuntimeConfig.js
src/lib/mapThumb.js
src/lib/realmMapExport.js
```

The single `<iframe` in all of `src/` is the FMG frame:

```
$ git grep -n "<iframe" HEAD -- src
src/components/map/WorldMapStage.jsx:242:            <iframe
```

with `src={mapFrameUrl}`, `title="Fantasy Map"`, `data-tour="map"`,
`tabIndex={-1} aria-hidden="true"` (a11y: removed from the tab order; *"Pointer
interaction is unchanged"*), `referrerPolicy="no-referrer"`, keyed on
`mapReloadKey`.

`src/lib/mapRuntimeConfig.js` is the single authority for the frame URL:

```js
export const MAP_FORK_REVISION = 'sfdrop16';
export const PRODUCTION_MAP_ORIGIN = 'https://map.settlementforge.com';
const LOCAL_FRAME_PATH = '/map/index.html';
```

with `readMapRuntimeConfig()` consumed at `src/hooks/useMapBridge.js:48`. In
production a missing/insecure/same-origin/CSP-unapproved URL **throws**
`MapRuntimeConfigError` — the app has no local fallback off localhost.

### 2b. Route reachability (CONFIRMED)

```
src/lib/routes.js:70:  { view: 'map',   path: '/map',   title: 'World Map' },
src/lib/routes.js:69:  { view: 'realm', path: '/realm', title: 'Realm',
                          nav: { label: 'Realm', order: 40 } },
```

`Realm` is a **top-nav cell** (order 40, alongside Library/Compendium/Gallery).
`/map` and `?view=map` redirect into `/realm`, where the World Map is the Map
sub-tab. This is a first-class, linked product surface.

### 2c. Other reference sites (CONFIRMED)

```
scripts/ops/post-deploy-verify.mjs:343,348,351   asserts the served map URL is
                                                 ${PRODUCTION_MAP_ORIGIN}/map/index.html
scripts/validate-map-fork.mjs:7                  const root = .../public/map/
scripts/validate-map-fork.mjs:128                "vendored lib … ships under public/map/libs/ but is NOT pinned"
src/config/pageBackgrounds.js:73-75              /map pre-redirect frame
src/domain/instantWorld/worldPlan.js:78          public/map/sf-bridge.js SF_TEMPLATES
src/domain/realmMap/realmPlateRenderer.js:7      "the only realm geography is the FMG iframe (public/map/)"
src/domain/spatial/spatialCost.js:6              public/map/sf-bridge.js:634-672 landCost/seaCost
src/lib/mapBridge.js:17                          "Contract with public/map/main.js"
src/lib/realmMapExport.js:8,10                   iframe-side shim under public/map/
src/store/mapSlice.js:461                        public/map/sf-bridge.js coordinates
```

13 docs reference `public/map`: `COMPREHENSIVE_REVIEW_2026-07-13.md`,
`COMPREHENSIVE_REVIEW_2026-07-15.md`, `MASTER_MERGE_PLAN.md`,
`OWNER_DECISION_QUEUE.md`, `RESUME_STATE.md`, `azgaar-bridge.md`,
`briefs/KEYSTONE_BRIEF.md`, `fmg-bridge.js`, `fmg-fork.md`,
`review-r2/RAW_SURVEY_RESULTS.json`, `review-r2/VERIFY_SUBSYSTEMS_RESULTS.json`,
`samples/atlas/README.md`, `tier-9-status.md`.

### 2d. **Does anything inside the vendored copy reference `libs/tinymce` locally?** — YES (CONFIRMED)

```
$ git grep -n "libs/tinymce" HEAD -- public/map ':(exclude)public/map/libs/tinymce'
public/map/modules/ui/notes-editor.js:69:  // hash-pinned copy (public/map/libs/tinymce/, in VENDOR-MANIFEST.json), not
public/map/modules/ui/notes-editor.js:74:  const url = new URL("libs/tinymce/tinymce.min.js", document.baseURI).href;
public/map/modules/ui/notes-editor.js:89:  window.tinymce._setBaseUrl(new URL("libs/tinymce", document.baseURI).href);
```

**The local path is the ONLY loader.** There is no upstream-CDN loader anywhere at
HEAD. This directly refutes §293.2a's mitigating fact.

### 2e. Is the Notes editor reachable inside the embed? (mixed — read carefully)

- The button lives inside the FMG options chrome:
  `public/map/index.html:2141 <button id="editNotesButton" … data-shortcut="Shift + O">Notes</button>`,
  nested in `#optionsContainer > #options > #toolsContent` (line 418 → 441 → 2099).
- `public/map/sf-bridge.js:193` hides that chrome in embed mode:
  `body.sf-embedded #optionsContainer { display: none !important; }` — so **the
  button is not clickable in the product's embed** (CONFIRMED by inspection).
- **BUT** `modules/ui/hotkeys.js:49` — `else if (shift && code === "KeyO") editNotes();`
  — has **no embedded-mode guard**:
  `git grep -n "sf-embedded|sfEmbedded|__sfEmbedded" HEAD -- .../hotkeys.js .../tools.js` returns **nothing**.
  `handleKeyup` only requires `modules.editors` to be loaded and `allowHotkeys()`.
- `editNotes()` is additionally invoked from seven other editors
  (`burg-editor.js:394`, `labels-editor.js:415`, `lakes-editor.js:259`,
  `markers-editor.js:11,233`, `regiment-editor.js:394`, `rivers-editor.js:249`,
  `routes-editor.js:367`).

**PLAUSIBLE (not executed):** a user who clicks into the map iframe (pointer
interaction is explicitly unchanged) and presses **Shift+O** opens the Notes
editor, which loads our local TinyMCE. I did not run the app to confirm. **Either
way this does not change the license question** — the 123 files are conveyed as
static HTTP assets whether or not any code path fetches them.

---

## 3. WHAT ELSE IS IN THE VENDORED COPY

`public/map/libs/` at HEAD — 144 files, 5,666,572 bytes (5.40 MB), of which
tinymce is 123 files / 4,334,532 bytes (4.13 MB). License evidence read from the
first 1500 bytes of **our own copy** of each file:

| file | bytes | license evidence in OUR copy | flag |
|---|---:|---|---|
| `alea.min.js` | 1,518 | `©2010 Johannes Baagøe, MIT license; Derivative ©2017-2020 W. "Mac" McMeans, BSD license.` | clean |
| `d3.min.js` | 241,983 | `// https://d3js.org v5.8.0 Copyright 2019 Mike Bostock` (ISC upstream; no license word in our copy) | header thin |
| `delaunator.min.js` | 7,787 | **none in first 1500 B** | no evidence |
| `dropbox-sdk.min.js` | 40,598 | **none in first 1500 B** | no evidence |
| `flatqueue.js` | 1,692 | **none** | no evidence |
| `indexedDB.js` | 1,753 | **none** | no evidence |
| `jquery-3.1.1.min.js` | 86,709 | `/*! jQuery v3.1.1 \| (c) jQuery Foundation \| jquery.org/license */` (MIT) | ⚠ CVEs, see below |
| `jquery-ui.css` | 11,228 | `Copyright jQuery Foundation and other contributors; Licensed MIT` | clean |
| `jquery-ui.min.js` | 108,235 | **none in first 1500 B** (MIT upstream) | header thin |
| `jquery.ui.touch-punch.min.js` | 1,291 | `Copyright 2011–2014, Dave Furfero` / **`Dual licensed under the MIT or GPL Version 2 licenses.`** | ⚠ **DUAL — election required** |
| `jszip.min.js` | 99,112 | `(c) 2009-2016 Stuart Knightley` / **`Dual licenced under the MIT license or GPLv3.`** | ⚠ **DUAL — election required** |
| `loopsubdivison.min.js` | 22,387 | `@license MIT - Copyright (c) 2022 Stephens Nunnally` | clean |
| `mapControls.min.js` | 10,821 | **none** | no evidence |
| `objexporter.min.js` | 3,701 | **none** | no evidence |
| `openwidget.min.js` | 829 | **none** | ⚠ **phone-home, see 3b** |
| `orbitControls.min.js` | 10,860 | **none** | no evidence |
| `polylabel.min.js` | 3,085 | **none** | no evidence |
| `rgbquant.min.js` | 9,834 | `// © 2015, Leon Sorokin, MIT` | clean |
| `simplify.js` | 2,623 | `(c) 2017, Vladimir Agafonkin` (BSD upstream; no license word) | header thin |
| `three.min.js` | 623,573 | `@license Copyright 2010-2022 Three.js Authors  SPDX-License-Identifier: MIT` | clean |
| `tinymce/**` (123 files) | 4,334,532 | `license.md`: **`Copyright (c) 2024, Ephox Corporation DBA Tiny Technologies, Inc.  Licensed under the terms of GNU General Public License Version 2 or later`** | ⛔ **COPYLEFT** |

**Non-MIT/BSD/Apache flags:**

- **`tinymce/` — GPLv2-or-later.** Version pinned in `VENDOR-MANIFEST.json` as
  `7.1.0`. Only 3 non-shippable files carry any license text (`license.md`,
  `langs/README.md`, `tinymce.d.ts`); the other 120 are `.js`/`.css` blobs with no
  per-file header. The subtree is **byte-identical to upstream FMG**:
  ```
  our tinymce.min.js  sha256 bf155b725496ab2f919fe5953a85be529602faa91bff8f7fb7cd6e0553e7681a
  clone tinymce.min.js sha256 bf155b725496ab2f919fe5953a85be529602faa91bff8f7fb7cd6e0553e7681a
  our license.md      sha256 2fcd38ecec1bedcf12c8fc7b6d874537028ae36a03ce9d4e9a243ea8371fe7ea
  clone license.md    sha256 2fcd38ecec1bedcf12c8fc7b6d874537028ae36a03ce9d4e9a243ea8371fe7ea
  ```
  We redistribute unmodified, **minified** TinyMCE. The GPLv2 text served alongside
  it is the whole of our compliance artifact; there is no corresponding-source
  offer or unminified source anywhere in the tree. Whether that satisfies GPLv2 §3
  is an owner/counsel call under §254.5.5 — I state the fact, not the verdict.
- **`jszip.min.js` — MIT **or** GPLv3 (dual).** Electing MIT removes the exposure.
  No election is recorded anywhere in the repo (CONFIRMED: no `LICENSE`, `NOTICE`,
  `THIRD_PARTY*`, `ATTRIB*`, or `CREDITS*` file exists at repo root).
- **`jquery.ui.touch-punch.min.js` — MIT **or** GPLv2 (dual).** Same: electing MIT
  removes the exposure; no election recorded.
- **`jquery-3.1.1.min.js`** — MIT, but `VENDOR-MANIFEST.json`'s own action-items
  block records the carried CVEs: *"CVE-2019-11358 (prototype pollution),
  CVE-2020-11022 and CVE-2020-11023 (jQuery.htmlPrefilter / DOM-XSS). Upgrade to
  >=3.5.0 or drop."* Visible debt, already on the record.
- **Nine libs carry no license evidence at all in our copy** (delaunator,
  dropbox-sdk, flatqueue, indexedDB, jquery-ui.min.js, mapControls, objexporter,
  orbitControls, polylabel, simplify). Upstream these are permissive, but our
  distributed artifact carries no notice — the same "no-licence default" §254 flags.

### 3b. openwidget — present, dead-coded on the ledger/build refs, LIVE on master

- **Does our copy contain it?** YES — `public/map/libs/openwidget.min.js`, 829 bytes,
  pinned in the manifest as `openwidget`.
- **Hardcoded organizationId?** YES:
  ```
  window.__ow.organizationId="7bb02e70-bcef-4861-a4e6-d259b0d10e24"
  window.__ow.integration_name="manual_settings"
  … init(){ n.src="https://cdn.openwidget.com/openwidget.js" }
  ```
  The upstream clone's copy is byte-for-byte the same org id — **it is Azgaar's
  account, not ours**; any chat opened through it would route to him.
- **Does any served page reference it?** NO `<script>` tag anywhere. The only
  reference is `public/map/main.js:423 import("./libs/openwidget.min.js")`, sitting
  **below an unconditional `return;`** added by a fork patch (main.js:409-415).
  Two independent closures: dead code + `/map/` CSP `script-src 'self'` blocks
  `cdn.openwidget.com`. **CONFIRMED inert at HEAD.**
- **On `master` the `return;` is absent** — the widget is live there (CONFIRMED by
  `git show refs/heads/master:public/map/main.js`).
- The 829-byte file is still **served** at `/map/libs/openwidget.min.js` on every
  ref, and is present in `dist/`.

---

## 4. DIST REALITY

### 4a. What the build config WOULD produce (CONFIRMED)

`vite.config.js` sets only `outDir: 'dist'` — no `publicDir` or `copyPublicDir`
override, so Vite's default applies: **`public/` is copied wholesale into `dist/`,
unprocessed.** `package.json`: `"build": "vite build"`, `"prebuild": "node
scripts/generate-sitemap.mjs"`. There is no exclusion for `public/map` anywhere.

Therefore a build from any current ref emits **636 `dist/map/` files including all
123 `dist/map/libs/tinymce/` files (4.13 MB)**, plus `dist/map/LICENSE-FMG.txt`,
`dist/map/libs/tinymce/license.md`, and `dist/map/libs/openwidget.min.js`.

### 4b. What is on disk right now (CONFIRMED — and it is NOT from any ref)

```
$ stat -f "%Sm %N" dist dist/index.html dist/map
Jul 28 13:14:06 2026 dist
Jul 28 13:14:06 2026 dist/index.html
Jul 28 13:14:02 2026 dist/map
$ find dist/map -type f | wc -l           →  636
$ find dist/map/libs/tinymce -type f | wc -l →  123
$ du -sh dist/map dist/map/libs/tinymce   →  25M  dist/map    4.4M  dist/map/libs/tinymce
$ ls -l dist/map/LICENSE-FMG.txt dist/map/libs/tinymce/license.md
-rw-r--r--  1353 Jul 28 13:14 dist/map/LICENSE-FMG.txt
-rw-r--r--   303 Jul 28 13:14 dist/map/libs/tinymce/license.md
```

**dist/ is 24 days stale AND was built from the dirty working tree, not a commit.**
Diffing the tracked set against dist:

```
$ diff <(git ls-tree -r --name-only HEAD -- public/map | sed 's|^public/map/||') \
       <(cd dist/map && find . -type f | sed 's|^\./||')
< libs/VENDOR-MANIFEST.json      (in HEAD, MISSING from dist)
< sf-origin.js                   (in HEAD, MISSING from dist)
> libs/umami.js                  (NOT in any ref — in dist)
> sw.js                          (NOT in any ref — in dist)
```

See §7 — this is a live working-tree condition, and it is the most actionable
thing I found.

---

## 5. HISTORY + SIZE

### 5a. Introduction (CONFIRMED)

```
$ git log -1 --format='%H%n%ad%n%an%n%s' f386f48d
f386f48d96ed0548f3b9cb7148edb43297f29edf
Fri Apr 24 15:39:08 2026 -0400
stoke
Add FMG map overlay, supply chain builder, and road network
```

Body: *"`public/map/` — vendored Azgaar FMG fork (**LGPL** — see LICENSE-FMG.txt)
served as a static asset and embedded via iframe."*

⚠ **The commit message says LGPL; `LICENSE-FMG.txt` is MIT** (`MIT License /
Copyright 2017-2024 Max Haniyeu (Azgaar)`). The introducing commit misstated the
license of the thing it introduced, and never mentioned tinymce at all.

### 5b. Has it been updated since? (CONFIRMED)

24 commits touch `public/map` on the ledger ref. The `libs/tinymce` subtree has
been touched **exactly once, ever**:

```
$ git log --format='%h %ad %s' --date=short HEAD -- public/map/libs/tinymce
f386f48d 2026-04-24 Add FMG map overlay, supply chain builder, and road network
```

**TinyMCE 7.1.0 has never been upgraded, patched, or re-pinned since 2026-04-24.**
The fork's own code has been hardened repeatedly (2026-07-20 `257b0eed`,
`e2b7abf8`; 2026-07-21 `cafd0c33`; 2026-07-22 `d2471e36`, `55191bfb`; 2026-07-26
`8c99d7a1`), but never the vendored libs.

### 5c. Size (CONFIRMED)

| ref | `public/map` files | bytes | tinymce files | tinymce bytes |
|---|---:|---:|---:|---:|
| HEAD / ledger `1273f0a1` | 636 | 24,738,225 (23.59 MB) | 123 | 4,334,532 (4.13 MB) |
| `claude/composite-r4` | 636 | 24,738,225 (23.59 MB) | 123 | 4,334,532 (4.13 MB) |
| `master` | 636 | 24,704,003 (23.56 MB) | 123 | 4,334,532 (4.13 MB) |

tinymce is **17.5%** of the vendored copy's tracked bytes and **76.5%** of `libs/`.

### 5d. Tests and gate machinery that reference it (CONFIRMED)

```
$ git grep -ln "public/map" HEAD -- tests scripts
scripts/validate-map-fork.mjs                    ← npm run validate:map (step 9 of `npm run check`)
tests/build/vendorManifestExactSet.test.js
tests/build/vendorManifestNonEmpty.test.js
tests/lib/sfBridgeOrigin.test.js
tests/map/sfBridge.harness.test.js
tests/map/sfOrigin.harness.test.js
tests/security/committedSecretsScan.test.js
tests/security/cspForkIsolation.test.js
tests/security/mapForkSinkInventory.json
tests/security/mapForkXssChain.test.js
```

Plus `tests/hooks/useMapBridgeOrigin.test.jsx`, `tests/lib/mapBridge.contract.test.js`,
`tests/lib/mapRuntimeConfig.test.js`, `tests/ui/worldMapInWords.test.jsx`
(matched on `map.settlementforge.com`).

**Three pins bind TinyMCE specifically:**

```
tests/security/mapForkXssChain.test.js:287  expect(NOTES_SRC).toContain('libs/tinymce/tinymce.min.js');
tests/security/mapForkXssChain.test.js:288  expect(NOTES_SRC).toContain('_setBaseUrl(new URL("libs/tinymce"');
tests/security/mapForkXssChain.test.js:290  expect(existsSync(resolve(process.cwd(),
                                              'public/map/libs/tinymce/tinymce.min.js'))).toBe(true);
```

And `VENDOR-MANIFEST.json` is an **exact-set contract in both directions**
(`scripts/validate-map-fork.mjs`): a shippable file on disk that is not pinned
fails, *and* a pinned entry with no file on disk fails. Current pin counts:

```
total pinned: 140    tinymce-pinned: 120    non-tinymce pinned: 20
```

---

## 6. SCRATCH CLONE (ls only — nothing deleted)

```
$ ls -ld .../a244e7a3-.../scratchpad/xref-fmg
drwxr-xr-x@ 4 cstokes wheel 128 Aug 17 03:15 .../xref-fmg
$ du -sh .../xref-fmg
 78M	.../xref-fmg
$ ls .../xref-fmg
LICENSE.fetched   repo/
$ find .../xref-fmg/repo/public/libs/tinymce -type f | wc -l
     123
$ find .../xref-fmg -iname "*openwidget*"
.../xref-fmg/repo/public/libs/openwidget.min.js
```

**CONFIRMED: the clone still exists, still 78 MB, and still holds both.** Its
tinymce is 123 files (same count as ours) and its `openwidget.min.js` carries the
identical hardcoded `organizationId="7bb02e70-bcef-4861-a4e6-d259b0d10e24"`.
Note the clone's layout is `repo/public/libs/…` (upstream FMG), which is why
ODQ §253.2 wrote the path as `public/libs/tinymce/`; ours is `public/map/libs/tinymce/`.
Per §293.4 this clone is ordered deleted once IPV-1 collects — **I have not
deleted it; that is a mutating act outside this lane.**

---

## 7. ⛔ NOT ASKED, BUT IT OUTRANKS THE LICENSE QUESTION: THE WORKING TREE IS AN UNVETTED UPSTREAM FMG DROP

`public/map` in the shared working tree is **wholesale reverted to pre-hardening
upstream state** — 43 modified files, 2 deletions, 2 untracked additions:

```
$ git status --porcelain -- public/map      (45 lines)
 M public/map/index.html
 M public/map/main.js
 M public/map/sf-bridge.js
 M public/map/modules/ui/notes-editor.js        … and 39 more ' M '
 D public/map/libs/VENDOR-MANIFEST.json         ← the supply-chain pin, DELETED
 D public/map/sf-origin.js                      ← the origin handshake, DELETED
?? public/map/libs/umami.js                     ← NEW third-party analytics
?? public/map/sw.js                             ← NEW service worker
```

The diffs undo landed security work, verbatim:

```
$ git diff HEAD -- public/map/modules/ui/notes-editor.js
-    notesLegend.innerHTML = sanitizeNoteHtml(note.legend);
+    notesLegend.innerHTML = note.legend;
-      const url = new URL("libs/tinymce/tinymce.min.js", document.baseURI).href;
+      const url = "https://azgaar.github.io/Fantasy-Map-Generator/libs/tinymce/tinymce.min.js";
-      byId("notesHeader").innerHTML = sanitizeNoteHtml(note.name);
+      byId("notesHeader").innerHTML = note.name;
-      const safe = sanitizeNoteHtml(result);     // the AI-apply sink
+      notesLegend.innerHTML = result;

$ git diff HEAD -- public/map/main.js
-  // SettlementForge fork patch: FMG's "Assistant" loads a remote SaaS chat widget …
-  return;                                        ← openwidget RE-ENABLED
-  // … removed the unconditional debug console.* traces that leaked the settlement id/name …
+      console.log('[sfBridge] drop types:', _types);   ← token/PII console leak restored
```

The two untracked files are new third-party network surfaces:

```
$ head -c 300 public/map/libs/umami.js
const website = "4f6fd0ae-646a-4946-a9da-7aad63284e48";
const root = "https://fmg-stats.herokuapp.com";
… POST url/referrer/screen/language/hostname/pathname/search

$ head -c 120 public/map/sw.js
importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js");
```

`umami.js` is a **second phone-home beacon under Azgaar's website id**, and `sw.js`
is a service worker that pulls remote code from a Google CDN.

**Mitigations (CONFIRMED):** neither is referenced from any page —
`grep -rn -i "umami" public/map/{index.html,main.js,versioning.js,modules}` returns
nothing, and the service-worker registration is dead: `public/map/main.js:17
if (false && PRODUCTION && "serviceWorker" in navigator)`. Both are inert files, but
both **shipped into `dist/` on Jul 28** (see §4b) and neither is pinned — the
manifest that would have caught them is the file that got deleted.

**Immediate consequences the chair should know:**

1. `npm run validate:map` would **fail closed today** — `VENDOR-MANIFEST.json` is
   unreadable, which pushes a failure, and 140 pins have no manifest. That is step
   9 of `npm run check`; the whole gate dies there. (PLAUSIBLE — reasoned from the
   validator source; I did not run the gate, per lane scope.)
2. `tests/security/mapForkXssChain.test.js` would red on lines 287-288 (the working
   tree's notes-editor has the CDN string, not the local one).
3. This is **foreign WIP in a shared dirty tree**. Per doctrine it is the owner's
   and must be preserved, not reverted by any lane. **It must also never be
   committed as-is** — doing so would silently re-open the XSS chain, the
   openwidget phone-home, the token console leak, and delete the supply-chain pin
   and the origin handshake in one commit.
4. It is dated **Jul 22 12:58** (both untracked files) — this has been sitting for a
   month.

---

## DISPOSITION OPTIONS — factual consequences only, no recommendation

### Option A — KEEP AS IS

- **What breaks:** nothing. Gate unchanged, feature unchanged, no re-pin, no docs
  churn.
- **What exposure remains:** 123 files / 4.13 MB of **GPLv2-or-later TinyMCE 7.1.0**
  conveyed to every browser that loads `map.settlementforge.com/map/*`, with
  `license_key: "gpl"` explicitly declared in our own source. §254.6's conveying
  analysis applies on its own terms (it was written about GPL-3.0; GPLv2's
  distribution trigger is the same shape). We ship the license text and minified
  bytes only — no corresponding source, no written offer, no repo-root `LICENSE`,
  `NOTICE`, or third-party attribution surface anywhere (CONFIRMED: none exists,
  and `src/` contains **zero** mentions of Azgaar or Fantasy Map Generator). Also
  standing: jQuery 3.1.1's three logged CVEs; two unrecorded dual-license elections
  (jszip MIT-or-GPLv3, touch-punch MIT-or-GPLv2); nine libs distributed with no
  notice at all; an 829-byte openwidget blob carrying a third party's org id.
- **History scrub:** N/A.

### Option B — STRIP THE `libs/tinymce/` SUBTREE ONLY

- **What breaks (all CONFIRMED by code inspection; none executed):**
  1. `npm run validate:map` → **120 failures**, one per pinned tinymce entry
     (`"vendored lib pinned in manifest is missing on disk"`), exit 1. Cure is a
     conscious re-pin: `node scripts/validate-map-fork.mjs --update-manifest`
     (drops the pin count 140 → 20).
  2. `tests/build/vendorManifestExactSet.test.js` — exact-set assertion reds until
     the re-pin lands.
  3. `tests/security/mapForkXssChain.test.js:287-290` — **three assertions red**:
     two string pins on the loader source and one `existsSync(…tinymce.min.js) ===
     true`. These must be re-authored, and the test census sits at its pinned
     ceiling, so editing in place (never minting a file) is the only safe shape.
  4. `tests/build/vendorManifestNonEmpty.test.js` — survives (20 libs remain).
  5. **Functionally the Notes editor degrades rather than crashes.**
     `notes-editor.js` already has the fallback:
     `const isTinyEditorActive = window.tinymce?.activeEditor;
      note.legend = isTinyEditorActive ? tinymce.activeEditor.getContent() : notesLegend.innerHTML;`
     `#notesLegend` is a contenteditable div, so notes still edit as plain HTML.
     The `import(url)` would 404 into the caught branch and `console.error` on every
     open — cosmetically noisy unless `initEditor` is also edited.
  6. `docs/fmg-fork.md:51` describes the local-load patch and would go stale;
     any docs edit carries the per-claim naked-claim debt hazard.
- **What exposure remains:** everything in Option A minus TinyMCE — i.e. the
  jQuery CVEs, the two dual-license elections, the nine no-notice libs, the
  openwidget blob, the missing attribution surface, and §253.2's separate finding
  that FMG's Urquhart utility is **not Azgaar's to license** (a provenance issue
  that a permissive top-level license does not cure and that stripping tinymce does
  not touch).
- **Size recovered:** −123 files, −4.13 MB tracked, −4.4 MB from every `dist/`.
- **History scrub adds:** see the shared scrub section below.

### Option C — STRIP THE WHOLE VENDORED COPY (`public/map/`)

- **What breaks (CONFIRMED consumer set):**
  1. **The Realm product surface.** `Realm` is a top-nav cell; `/map` and
     `?view=map` redirect into it; `WorldMapStage.jsx` renders the only `<iframe>`
     in `src/`. `realmPlateRenderer.js:7` states it plainly: *"the only realm
     geography is the FMG iframe (public/map/)"*.
  2. Eight app modules lose their target: `MapShareEditor.jsx`,
     `useRealmLoadProgress.js`, `WorldMapStage.jsx`, `useMapBridge.js`,
     `mapBridge.js`, `mapRuntimeConfig.js`, `mapThumb.js`, `realmMapExport.js` —
     plus `mapSlice.js`, `spatialCost.js`, `worldPlan.js`, `pageBackgrounds.js`
     which reference the fork by path in contracts/comments.
  3. Gate machinery: `validate:map` (step 9 of `npm run check`) has no root to walk;
     `scripts/ops/post-deploy-verify.mjs:343-351` asserts the served map URL.
  4. ~12 test files (§5d) plus `tests/security/mapForkSinkInventory.json`. Deleting
     test files moves the pinned census downward — a census event in its own right.
  5. Deploy topology: `vercel.json`'s two host redirects, the whole `/map/(.*)`
     header block, and the app CSP's `frame-src https://map.settlementforge.com`;
     `docs/ops/FMG_ORIGIN_RUNBOOK.md` and the POST_DEPLOY runbook's map clauses;
     the dedicated `map.settlementforge.com` Vercel project itself.
  6. Note `public/map` **is** the map host's payload ("Deploy the same built static
     map at `/map/*`"), so deleting it removes the production map, not merely a dev
     convenience. `mapRuntimeConfig` throws in production without a valid
     `VITE_FMG_URL`, so there is no silent-degrade path — the Realm surface fails
     loudly.
- **What exposure remains:** the FMG-derived *approaches* already adopted at
  §253.3 (approach grade, clean-room) — nothing conveyed. This is the only option
  that closes the whole cluster, including the Urquhart provenance issue.
- **Size recovered:** −636 files, −23.59 MB tracked, −25 MB from every `dist/`.
- **History scrub adds:** see below.

### Option D — REPLACE THE LOCAL COPY WITH UPSTREAM LINKS

- **What breaks (CONFIRMED):**
  1. This is a **literal revert of the 2026-07-20 `e2b7abf8` security patch**, and
     is exactly the state `master` and the dirty working tree are in today.
  2. It does not work as-is: the `/map/` CSP is `script-src 'self'`, so the
     `azgaar.github.io` fetch is **blocked** — the fork patch's own comment records
     that the remote fetch was already failing and that the local path *"makes the
     notes editor actually load."* Making Option D functional therefore requires
     **widening the `/map/` CSP to allow `azgaar.github.io`**, which re-opens the
     unpinned cross-origin-script hole the program deliberately closed.
  3. `tests/security/mapForkXssChain.test.js:287-290` still reds (all three pins
     assert the local path and the local file's existence).
  4. `validate:map` / `vendorManifestExactSet` still red on the 120 removed pins,
     same as Option B.
- **What exposure remains:** the GPL bytes execute inside our frame but are served
  by a third party. Whether that changes the conveying analysis is precisely the
  kind of question §254.5.5 reserves to the owner/counsel; it is not a lane call.
  Supply-chain exposure strictly increases (unpinned third-party script, no hash,
  no manifest). Everything else from Option A remains.
- **Size recovered:** same as Option B (−4.13 MB).

### SHARED: WHAT A HISTORY SCRUB WOULD ADDITIONALLY REQUIRE (applies to B, C, D)

Removing the bytes from `HEAD` does **not** remove them from history. A scrub means:

- **Blast radius:** `public/map` entered at `f386f48d` (2026-04-24) and is present
  in **404 of 404 local heads and 39 of 40 remote refs**. `git rev-list --count
  f386f48d..HEAD` = **3,576 commits** on the ledger line alone; every branch that
  forked after April carries the blob.
- Every commit sha from 2026-04-24 forward changes. That invalidates: the ODQ's and
  ledger's recorded shas, `PACKET_MANIFEST` provenance, packet `requiredSymbols`
  rows resolved against live-tree paths, `docs/RESUME_STATE.md`, deploy receipts
  minted by `ops:post-deploy`, and the `/api/release` source-identity check that
  `post-deploy-verify.mjs` performs against "the clean local commit."
- **~37 registered worktrees** (`git worktree list`) all point at pre-rewrite
  objects; the golden track (`settlement-engine-golden`), the p55fix tree, the soak
  tree and the codex trees would each need re-establishing.
- It requires a **force-push to `origin`** across 39 refs — owner-gated twice over
  (deploy/push class **and** the history-rewrite class), and it would break any
  clone anyone else holds.
- The scrub does not reach the artifacts already served: anything TinyMCE-bearing
  already fetched by a browser or cached at the CDN edge is outside git's reach.
- **Cheaper partial:** the `libs/tinymce` subtree has exactly **one** touching
  commit ever (`f386f48d`), so a `git filter-repo --path public/map/libs/tinymce
  --invert-paths` is the narrowest possible rewrite — but it still rewrites all
  3,576 commits, because the blob sits in every tree since April.

---

## ANYTHING ELSE THAT BEARS ON THE RULING

1. **§293.2a's mitigating fact must be struck.** Restated correctly: *the vendored
   copy's notes editor loads TinyMCE from OUR OWN pinned local copy — the upstream
   CDN loader was removed as a security fix on 2026-07-20 and the `/map/` CSP
   blocks the CDN path anyway. The 123 files are load-bearing, not dead weight.*
   (The chair's phrasing is accurate for `master` only, and that ref is 2,790
   commits stale.)
2. **The deploy ref carries the *worse* posture.** `master` has neither the local
   tinymce pin nor the openwidget `return;` guard. If a Vercel push auto-deploy from
   `master` is still enabled (DEPLOY.md says the dashboard half was never
   completed), production is running the un-hardened fork. Worth a chair check
   independent of the license question.
3. **The working tree is an unvetted upstream FMG drop that has sat for a month**
   (§7). It deletes `VENDOR-MANIFEST.json` and `sf-origin.js`, reverts ~20 XSS
   sanitizers, re-enables openwidget, restores a PII console leak, and adds an
   un-pinned analytics beacon plus a remote-code service worker. It is foreign WIP —
   preserve it, but it must not be committed as-is, and the current `dist/` is built
   from it.
4. **The introducing commit misstated the license** ("LGPL" in the body; the file is
   MIT) and never mentioned TinyMCE. That is why the exposure survived four security
   sweeps of this same directory.
5. **There is no attribution surface in the product.** No `LICENSE`, `NOTICE`,
   `THIRD_PARTY*`, or `CREDITS*` at repo root; zero mentions of Azgaar or "Fantasy
   Map Generator" anywhere in `src/`. The only notices distributed are
   `/map/LICENSE-FMG.txt` and `/map/libs/tinymce/license.md`, reachable only by
   direct URL on the map subdomain. MIT's notice requirement and TinyMCE's GPL
   notice both hinge on those two files being served — they are (CONFIRMED present
   in `dist/`), but nothing in the product links to them.
6. **Two dual-license elections are unrecorded.** jszip (MIT or GPLv3) and
   jquery.ui.touch-punch (MIT or GPLv2) are only exposures if MIT is *not* elected.
   Recording the MIT election costs nothing and removes two items from the cluster
   whatever the tinymce ruling is.
7. **`VENDOR-MANIFEST.json`'s own header already queued this**: *"audit tinymce /
   dropbox-sdk versions against advisories; drop unused libs."* The disposition the
   chair is about to make was pre-registered as a tracked follow-up by the lane that
   built the manifest.
8. **TinyMCE 7.1.0 has never been updated** since 2026-04-24 and carries an empty
   `knownAdvisories` array — nobody has run a CVE check against 7.1.0. That is an
   open security question orthogonal to the license one, and Option A leaves it open.
9. **Whatever the ruling, `dist/` should be rebuilt from a committed ref before any
   deploy.** The artifact on disk contains two files that exist in no commit and is
   missing two that every commit has.
