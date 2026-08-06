---
name: cycle3-w7-fork-sinks-shipped
description: "Cycle-3 Wave 7 SHIPPED (2026-07-22, commit 55191bfb on br claude/cycle3-w7-fork-sinks off composite-r4 @ d00418c0; UNFOLDED — manager folds): the FMG-fork sink closers — H9 tip() chokepoint escaping · H10 currentSeed() reads the real global seed (pack.seed is a phantom) · H11 cleanupData scoped to fork keys (was nuking the host Supabase session) · the phantom-globals sweep (window.svg/window.zoom were always undefined → the zoom.on viewport broadcast was DEAD, now LIT) · +5 mapForkXssChain blocks · mapForkSinkInventory.json (354 sinks/55 files, shrink-only). Live-verified in a real served realm."
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-22T15:28:17.786Z
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
---

Cycle-3 Wave 7 (from docs/CYCLE3_FIX_PROGRAM.md §Wave 7 + CYCLE3_AUDIT.md H9/H10/H11).
The vendored FMG fork `public/map/` ships same-origin with the host app and sits
OUTSIDE every lint/tsc/build gate — the security tests are the only gate it has.

## The four fixes (all reversible, no golden shift)

**H9 — tip() chokepoint escaping** (`public/map/modules/ui/general.js`). `tip()` is
the ONE chokepoint ~302 tooltip call-sites flow through; it wrote its arg straight
to `tooltip.innerHTML`. Several callers interpolate untrusted loaded-.map strings
(burg name+group, river name, MFCG burg name from `document.referrer`). Fix: escape
at the chokepoint — `tooltip.innerHTML = escapeHtml(tip)`. ⚠️ The `dataset.main` /
`showMainTip()` round-trip is a SECOND innerHTML sink: `tip(x,true)` stores the RAW
string in `dataset.main`, `showMainTip()` re-renders it. Store raw, escape on render
(`innerHTML = escapeHtml(tooltip.dataset.main)`) — escaping only the first sink
leaves the main-tip path live. TRADE-OFF: the 2 developer-authored intentional-HTML
tips (`tools.js` `<i>States Number</i>`, `military-overview.js` `<span style…>`) now
render their tags literally — accepted cosmetic loss for closing every sink at one
point. (`escapeHtml` is the fork's canonical escaper; textContent was the equal-safety
alternative, chose escapeHtml for fork-convention consistency.)

**H10 — currentSeed() reads the real global seed** (`sf-bridge.js`). FMG NEVER sets
`pack.seed`; the real seed is the top-level global `seed` (`var seed` main.js:127,
set from URL seed / generateSeed() / precreated, serialized by save.js:44). The
bridge reported `pack?.seed || null` at 3 sites (notifyReady + resetMap reply/post)
→ **fmg:ready / fmg:mapReset carried seed:null forever.** Added a `currentSeed()`
accessor (guarded bare `seed`). LIVE-CONFIRMED: `pack.seed`===undefined, real global
`seed`==="507442433", old expression `pack?.seed||null`===null. This is a behavior
activation — the parent now receives a real seed where it always got null.

**H11 — cleanupData scoped to fork keys** (`versioning.js`) — the sharpest. The /map/
frame SHARES its ORIGIN with the host app (same host, different path) so localStorage
+ Cache Storage are SHARED. Stock `cleanupData()` called `localStorage.clear()` +
deleted EVERY Cache Storage entry → **destroyed the host's Supabase auth token
(`sb-<ref>-auth-token`, src/lib/supabase.js:59) + all host state** on the "Clear
cache" click. Fix = ALLOWLIST-DELETE fork keys (the safe direction: an unrecognized
key survives, so a host key can never be destroyed). Enumerated fork keys =
`FORK_LS_KEYS` (Set of ~40 exact FMG option/preset/flag keys) + prefixes `fmg-ai-`
(AI config + per-provider keys `fmg-ai-kl-<provider>`) and `fmgStyle_` (custom style
presets, `customPresetPrefix` in style-presets.js:18). ⚠️ Fork keys are UN-PREFIXED
and partly dynamic, so an exhaustive allowlist is impossible — but under allowlist-
delete, a MISSED fork key just survives (harmless); host keys (sb-*, flag.*,
sf_view_token, +76 dynamic) are structurally safe. Caches: the fork owns NONE
(sw.js removed, zero `caches.open` in the fork) → `clearCache` now filters to
`isForkCacheName` (`/fmg/i`), deletes nothing, host workbox/PWA caches survive.
LIVE-CONFIRMED in a real served realm: 8 keys → 4, `sb-*-auth-token` survived, all
4 fork keys removed. Residual (documented, negligible): a host key with an identical
BARE FMG-option name (e.g. "year") would be cleared — but auth (sb-*) never matches.

**THE PHANTOM-GLOBALS CLASS** (`sf-bridge.js`) — the deepest finding. In FMG's
classic scripts: `let svg`(main.js:23) and `const zoom`(main.js:225) are SCRIPT-
SCOPED LEXICAL globals — reachable as bare identifiers across classic scripts but
NEVER as `window.svg`/`window.zoom` (both undefined). By contrast `var seed`(127),
`var graphWidth/Height`(236/7) AND top-level `function` declarations (zoomTo,
resetZoom) DO become window properties. sf-bridge read `window.svg`/`window.zoom` at
4 sites — all dead. The worst: `installViewportBroadcaster`'s `if (window.zoom &&
window.svg) zoom.on('zoom.sfBridge', …)` was `undefined && undefined` → the d3
zoom-driven viewport broadcast NEVER attached; live pan/zoom overlay sync rode on
the RAF poll alone. Sweep convention (the manager's resetZoom precedent) = GUARDED
BARE IDENTIFIER `typeof X !== 'undefined' && X` (bare access resolves to the lexical
global; typeof avoids a ReferenceError on an upstream rename). Converted all 4 sites
(getCurrentViewport svgSel, installViewportBroadcaster, setViewport fallback, fitMap
fallback) — **the 430 fix LIGHTS the broadcast** (behavior activation: fmg:viewport
now fires on the d3 zoom event, not only the next frame). LEFT window.d3 (real UMD
global), window.graphWidth/Height + window.zoomTo (real globals — verified live:
`typeof window.zoomTo`==="function"). LIVE-CONFIRMED: bare svg==="object",
window.svg===undefined, zoom.on exists.

## Guards
- `tests/security/mapForkXssChain.test.js` +5 describe blocks (H9 functional tip
  drive · H10 currentSeed + code scan · H11 host-key-survives + predicates · phantom
  scan + broadcast-attach jsdom test · sink-inventory ratchet). sf-bridge/versioning
  helpers live INDENTED in an IIFE, so the file's `evalBlock` (`\n}` terminator)
  can't bound them — added `sliceBalanced`/`sliceThrough` brace-matchers.
- `tests/security/mapForkSinkInventory.json` — shrink-only ratchet, born at MEASURED
  minimum **354 sinks / 55 files** (metric = `/\.(inner|outer)HTML\s*\+?=|insertAdjacentHTML\s*\(/g`
  occurrences per fork source file, EXCLUDING `public/map/libs/**` (hash-pinned deps)
  and `index-*.js` bundles). Re-vendor tripwire: a new raw sink reddens.

## Build-on notes / hazards
- The manager patched `sf-bridge.js` (fitMap handler, resetZoom-first) + `index.html`
  (v=sfdrop14) just before this wave — built ON both, did NOT revert.
- CACHE-BUSTERS bumped so clients refetch the security fixes: versioning.js (added
  `?v=sfdrop15`, had none), general.js (`?v=1.113.1` → `?v=1.113.1-sfdrop15`),
  sf-bridge.js (`?v=sfdrop14` → `?v=sfdrop15`). ⚠️ EVERY edited fork file needs its
  own cache-buster bumped — the fix is a ghost until clients refetch.
- The fork loads as classic `<script defer>` per-file (each own `?v=`), plus a
  SEPARATE Vite bundle `index-Bp79q281.js` (type=module, 672KB) that does NOT define
  tip() — `tip`/`escapeHtml`/`cleanupData` are general.js/versioning.js globals.
- VERIFY_DIST closure (1,039,868) = the APP's dist first-paint closure; `public/map/*`
  is iframe-loaded static, OUTSIDE it → Δ0 by architecture.
- CSP Report-Only→Enforce flip stays T5 (owner posture) — untouched.
