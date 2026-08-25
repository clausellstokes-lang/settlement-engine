---
name: ""
metadata:
  node_type: memory
  title: FIX FMG REMAINDER shipped (map-text escape + Dropbox token + AI egress)
  date: 2026-07-20
  branch: claude/fix-fmg-remainder
  commit: 8f97ed06
  status: committed NOT folded/pushed
  tags:
    - security
    - fmg-fork
    - xss
    - dropbox-token
    - llm-egress
    - fix-wave
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T00:40:09.695Z
---

# FIX FMG REMAINDER shipped

The security follow-ons in the vendored Azgaar FMG fork (`public/map/`) that fix wave 1
(257b0eed) did not cover. One gated commit **8f97ed06** on `claude/fix-fmg-remainder`
(base 8dfd2aed = "Fix wave 2"). NOT folded, NOT pushed. Fork is outside dist first-paint =
**0 eager** (manager measures combined closure at fold). Gate all EXIT 0: domain-strict 0,
tsc 0 (no src leakage), eslint touched-test 0, validate-map-fork (parses + 141 libs
manifest), vitest fork-relevant security {mapForkXssChain 25 + mapSnapshotImport +
cspForkIsolation + clientAiBoundary = 39}, python NUL scan 0. 6 files, +141/-11.

## Why this matters
The fork ships to the SAME ORIGIN as auth + payments, so any XSS / secret leak / cross-origin
egress in it is an account-origin problem. Wave 1 closed the *delivery* vectors (raw-SVG
insertAdjacentHTML, marker.icon ×4, importGalleryMap, TinyMCE CDN). This wave is the
remainder.

## What shipped (how to apply / re-find)
- **Finding 1 — untrusted .map text -> innerHTML.** Full enumeration of
  `public/map/modules/**` = **~51 untrusted-string innerHTML sinks** (of ~340 total; ~278
  numeric/static, ~11 already sanitized). Fixed the **non-panel-reachable** ones via the
  wave-1 `escapeHtml()` global: `general.js updateCellInfo` (~339; state/province/culture/
  religion/burg/biome names in the HOVER overlay; `features.group` is an engine enum, left
  raw) and `layers.js drawProvinces` (~561; `${p.name}` in `#provs` SVG, AUTO-renders on
  layer draw). The remaining **~40+ are PANEL-GATED** (need a manual hostile-.map load AND
  opening the specific overview/editor) — DELIBERATELY DEFERRED, full denominator +
  file:line list in `docs/fmg-fork.md`. ⚠️ Flagged asymmetry: the **regiment-editor icon
  sink (regiment-editor.js 47/162/163) is the exact structural parallel of the already-
  patched markers-editor icon sink** but was left unescaped (plus markers-overview 105,
  military-overview 339, battle-screen 202, tools.js 912). Do the deferred set as ONE
  mechanical escapeHtml-routing pass next time the fork is touched; pin each with a
  source-slice check (the wave-2 idiom).
- **Finding 2 — Dropbox OAuth token (cloud.js).** Removed the
  `DEBUG.cloud && console.info("Access token:", token)` leak line; moved token persistence
  `localStorage -> sessionStorage` (session-scoped; connect/auth/save/load flow untouched, a
  browser restart forces re-auth). No external reader of the `auth-<prov>` key exists
  (grep-confirmed). Residual risk (documented): token still readable by same-origin script
  for the tab's life — inherent to the client-side Dropbox SDK, no server custody in the fork.
- **Finding 3 — FMG BYOK AI generator LLM egress (ai-generator.js).** `generate()` POSTs a
  user API key + prompt straight to api.openai.com / api.anthropic.com / local Ollama from
  the /map/ origin. Disabled via a single early `return` at the top of `generate()` (the
  SOLE caller of `PROVIDERS[provider].generate` — no other caller — so all egress dead);
  upstream code left intact below for re-enable/upgrade. **Re-enabling is an owner PRODUCT
  decision.**

## ⚠️ Durable hazards learned (verify against code before trusting)
- **sf-bridge.js only activates embedded mode when IFRAMED.** `initSettlementForgeBridge()`
  does `if (window.parent === window) return;` then adds `sf-embedded` (which display:none-
  hides `#optionsContainer` / the notes editor / markers). So the whole native FMG UI
  (notes editor, AI button, all tools-menu editors/overviews) is **UNREACHABLE in the
  product iframe embed but REACHABLE via direct top-level `/map/` navigation**. This
  governs the severity of every fork-UI security finding.
- **The `/map/` CSP is `Content-Security-Policy-Report-Only`, not enforced.** Its
  `connect-src` is `'self' https://api.dropboxapi.com https://content.dropboxapi.com` (no
  LLM hosts), but Report-Only does NOT block — so the LLM egress was live until Finding 3's
  code-level disable. **Flipping /map/ CSP to enforced is the complementary origin-level
  closure for Finding 3** (on the owner punch list per cspForkIsolation.test.js comment).
- **lint-staged (`eslint --fix` on `*.js`) runs in pre-commit but eslint ignores `public/`**,
  so fork `*.js` edits pass the hook without reformat (wave 1 + this wave both committed
  public/map/*.js cleanly; post-commit tree was clean, no hook rewrite).
- **`clientAiBoundary.contract.test.js` scans `src/` ONLY** — the fork's ai-generator.js was
  outside it (that's why the egress existed); do not assume that contract covers public/map.

## Owner-gated residuals (report, do not force)
1. Re-enabling the FMG AI generator = product decision (disabled by this wave).
2. The ~40+ deferred panel-gated innerHTML sinks (routing sweep) — documented, not a bug.
3. Flip /map/ CSP Report-Only -> enforced (closes LLM egress + defense-in-depth at origin).
