---
name: fmg-review-security-findings
description: "⚠️⚠️ CONFIRMED ATO-class DOM-XSS in the FMG fork surfaced by cycle-2 cold review (2026-07-20): importGalleryMap (NOT WithCampaign) imports a raw cross-user fmgSnapshot → load.js insertAdjacentHTML sink; the F6 fix covered only the sibling path. Plus Report-Only CSP (inert containment) + unsanitized .map innerHTML sinks. Composite UNPUSHED (no live prod exposure); fix in a cycle-2 wave with a pin."
metadata: 
  node_type: memory
  type: project
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T21:58:46.298Z
---

Cycle-2 cold review of the FMG fork (public/map/, now IN scope per owner order)
found real security holes our gates never covered. Manager-verified the headline
at code level before relaying.

**⚠️⚠️ THE MUST-FIX (manager-confirmed at code level):** the F6 cross-user
stored-XSS fix was applied to `importGalleryMapWithCampaign` (campaignSlice.js
~459-465: explicitly carries only `seed`, NOT the raw snapshot) but NOT to the
plain `importGalleryMap` (campaignSlice.js:362-364: `mapState.fmgSnapshot =
backdrop.fmgSnapshot` raw, no scan). A plain `kind='map'` share routes through
importGalleryMap (WithCampaign delegates to it at :391). WorldMap.jsx:469 loads
fmgSnapshot into the iframe → `public/map/modules/io/load.js:335`
`insertAdjacentHTML('afterbegin', data[5])` on the Supabase-token-bearing origin
= account-takeover. The security agent EXECUTED a jsdom/headless repro of the
sink firing (`<image onerror>` runs, reads a token-shaped localStorage value).
THE DEFECT CLASS: a fix that survived one path and ghosted its sibling — the
owner's most-bitten bug class, here in security form; the F6 TEST only slices the
`...WithCampaign` region so importGalleryMap was never inspected (a test that
asserts less than it appears to).

**Systemic (same fleet, unverified-by-manager yet — refuter-bound):** both CSP
headers ship `Content-Security-Policy-Report-Only` (vercel.json:22,36) = inert,
so XSS containment is OFF (docs claim it enforces); multiple unsanitized
innerHTML sinks from untrusted .map files (markers-editor icon; export font-face
CSS injection); Dropbox OAuth token in localStorage + console-logged; FMG
ai-generator.js egresses to api.openai/anthropic from the auth origin. Generation
bugs: addLake typed-array index no-op (main.js:858), `?from=MFCG` no-seed
TypeError, parseMapVersion drops legacy patch digit.

**Doc rot that would RE-INTRODUCE holes on upgrade:** fmg-fork.md claims "4
patches" (real surface 16+); the SW-disable description is wrong (upstream sw.js
was DELETED because it importScripts workbox from a Google CDN onto the auth
origin — re-vendoring re-adds it); CSP rationale cites an unpkg Dropbox SDK the
code no longer loads (it's vendored).

**Status:** composite-r4 c8c5baa8 is UNPUSHED, prod migration head 117 → NO live
production exposure right now. These are Phase-S cold findings; the ATO must-fix
is manager-confirmed and is a TOP cycle-2 fix-wave item (fix BOTH import paths at
the shared sink, add a reproducing pin covering importGalleryMap, and consider a
server-side map_data scan as defense-in-depth). Refuter-verify the systemic set
before fixing. **How to apply:** fix at the load.js sink AND both store import
paths (chokepoint + all-paths); never trust the F6 test's slice window.
Related: [[fmg-fork-world-map.md]] [[faction-key-defect-class]] (same
one-path-ghosts-another shape).
