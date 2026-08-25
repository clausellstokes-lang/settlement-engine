---
name: fix-wave-1-fmg-xss-shipped
description: "⭐ CYCLE-2 FIX WAVE 1 @ composite-r4 257b0eed — the FMG XSS chain closed (ATO-class): importGalleryMap F6 mirror + load.js sanitizeMapSvg scrub + marker.icon escaped (incl the 4th redrawIcon sink the impl missed, checker-caught) + TinyMCE local-vendored. CSP enforce-flip still owner-queued."
metadata: 
  node_type: memory
  type: project
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T23:42:48.518Z
---

Cycle-2 fix wave 1 (2026-07-20), composite-r4 @ **257b0eed** (base c8c5baa8). The
implementer agent did the work then STOPPED before committing ("standing by" for
the security suite) — Fable (checker) took over: verified the diffs, CAUGHT A
MISSED 4TH XSS SINK, ran the full gate, committed. 8 files, security suite 23/23.

**What closed (all CONFIRMED by refuter before fixing):**
- idx22 importGalleryMap: no longer imports a foreign raw fmgSnapshot; carries
  only `seed` (mirrors the F6 fix its sibling importGalleryMapWithCampaign had —
  the classic one-path-ghosts-its-sibling defect).
- idx23 load.js:335 insertAdjacentHTML: now routes data[5] through new
  `sanitizeMapSvg` (DOMParser strips <script>, on* handlers, javascript:/vbscript:
  hrefs; parsed as text/html so parsing is inert).
- idx24 marker.icon → innerHTML: escaped via escapeHtml at BOTH editor sinks AND
  `redrawIcon` (markers-editor.js:207) — the redrawIcon path was NOT in the
  agent's fix; the checker found it by reading the full file. LESSON: an XSS
  fix brief must enumerate ALL sinks; implementers patch the cited ones.
- idx26 notes-editor: loads vendored+hash-pinned libs/tinymce via
  `new URL(..,document.baseURI)` instead of fetching azgaar.github.io at runtime.

**Owner-queued (built to edge, not crossed):** the CSP Report-Only→enforce flip
(deploy posture) — sinks are now closed so containment is defense-in-depth.

**Hazard:** lint-staged runs `eslint --fix` in the pre-commit hook and takes its
own backup stash — do not confuse it with the FOREIGN stash@{0}
(analytics-intelligence-layer = owner WIP, leave untouched). Gate: build 0 ·
closure ratchet green · strict 0 · tsc 0 · lint 0 · validate-map-fork 141/141 ·
NUL clean. Next: fix wave 2 (store/engine correctness). Plan:
scratchpad/CYCLE2_FIX_PLAN.md. Related: [[fmg-review-security-findings]]
[[fmg-fork-world-map]].
