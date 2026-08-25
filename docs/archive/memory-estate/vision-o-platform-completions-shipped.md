---
name: ""
metadata: 
  node_type: memory
  type: milestone
  scope: settlement-engine
  branch: claude/vision-o
  base: 212758ad
  tip: b3692333
  date: 2026-07-20
  folded: false
  tags: 
    - vision-wave
    - V-O
    - platform
    - localization
    - e2e-perf
    - pdf-counterseal
    - im-fell
    - gallery-comments
    - migration-168
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T18:46:56.558Z
---

# VISION LANE V-O — platform completions (V-27a..f) shipped

⭐ The last base-independent lane of the Vision Wave. Branch `claude/vision-o`,
base 212758ad, **tip b3692333, NOT folded / NOT pushed**. 5 lettered commits
(e needs none — see below). All six spec items (docs/DESIGN_VISION_WAVE.md
"### LANE V-O") delivered or resolved.

## Why (what this closes)
The "inert-honest where external" platform-completion items: localization plumbing,
the owed perf-time budget, the PDF counterseal seam, a display-face toggle, a parked
content-branch audit, and the gallery-comment moderation posture.

## The commits (tip → base)
- **b3692333 (f)** gallery-comment moderation layer (migration 168 + pglite RLS tests + docs)
- **5211005f (c)** PDF counterseal structured-path refactor (WB-k) + parity pins
- **854a379d (b)** throttled TTI/INP e2e performance harness
- **249fa16a (d)** IM Fell display face — toggle-OFF, zero-eager
- **9f35efbf (a)** localization scaffold + pseudo-locale + extraction pin

## Per-item outcome
- **V-27a localization** — `src/copy/index.js` gained a real locale registry
  (registerLocale/setLocale/getLocale/listLocales + fallback-to-en resolution +
  loadPseudoLocale). `src/copy/pseudo.js` (id `en-XA`) derived from `en` (accent+
  bracket, {placeholders} preserved) → key parity automatic. Pin
  `tests/copy/localeParity.test.js` (walker set-equality). Translation content is
  post-launch. Zero eager (copy layer is lazy-only).
- **V-27b perf harness** — `e2e/perf-throttled-tti-inp.spec.js`: CDP throttle
  (CPU 4× + Regular-4G), chromium-only, measures TTI(domInteractive)/LCP/INP from
  browser Performance APIs. RAN GREEN (TTI=111ms LCP=15380ms INP=112ms on the DEV
  server). No ci.yml/ciCheckParity change (e2e ∉ `npm run check`; auto-discovered).
- **V-27c PDF counterseal** — `emblemPaths.js` (structured mirror of the 8 emblems'
  `draw()` geometry, web `draw()` UNTOUCHED), `HouseCountersealSeal.jsx` (react-pdf
  Svg/Path/Circle, same seededPicker selection as web), wired into `Cover.jsx`
  seeded on `settlement.name`. Parity pins `tests/pdf/countersealStructuredPath.test.js`
  (geometry mirror + cross-surface selection + tree-walk, never bytes).
- **V-27d IM Fell** — CSS-var display-face seam `--oc-display-face` in tokens.js
  (display-xl/l/m only; unset = byte-identical Crimson fallback), `src/lib/imFellFace.js`
  (lazy DOM-idempotent @font-face inject), flag `imFellDisplayFace` (default false),
  main.jsx dynamic-import activation. See DEFERRAL below.
- **V-27e content-VT-2** — RESOLVED BY ABSORPTION, no commit. See finding below.
- **V-27f gallery comments** — migration 168 moderation layer on the ALREADY-SHIPPING
  gallery_comments (019). See migration-numbering flag below.

## ⚠️ Sharp findings / hazards banked
1. **V-27e is already in the base — the brief's "parked lineage" premise was STALE.**
   `claude/content-vt-2` (tip 39a56a1d, all 4 commits), `content-vt`, AND
   `content-gt-final` (tip 23c77444) are ALL git ancestors of 212758ad — fully
   folded. marketPrices.js literally carries the `// CRIER-LINE frame pools
   (content-vt-2)` block. The diff pre-VT-2→HEAD shows all four files carry the
   insertions, no revert. Verdict: LANDED, not superseded — no work, no commit.
   (Tree-wins: `git merge-base --is-ancestor claude/content-vt-2 212758ad` = yes.)
2. **⚠️ `.error-copy-baseline.json` / errorCopy register does NOT exist in this base.**
   It's a vision-h artifact (unfolded). The brief listed it as a lane-end ratchet —
   it is not present here. The copy guard IS `tests/copy/copy.test.js` over `en.errors`.
   Ran ratchets: anyCast/rawColor/mapPalette/deepCraftKillList/title-census only.
3. **⚠️ V-27f migration numbering — V-E's 168 has FOLD PRECEDENCE.** I minted
   `168_gallery_comment_moderation.sql` off THIS tree's head (167) so local
   validators pass. The unfolded sibling V-E already minted 168 (unlisted-sharing).
   AT THE FOLD, my migration renumbers to **169** (sibling-mint protocol). Also
   update ARCHITECTURE.md migrations count + DEPLOY.md head at the fold.
4. **The +1-migration doc-freshness set (satisfied):** ARCHITECTURE.md line 184
   `**migrations/** (N)`, DEPLOY.md line 133 head filename, migrationContiguity,
   migrationAppliedHead (leave appliedHead=117 — do NOT bump), migrationRollbackDiscipline
   (my migration references `profiles` via the reproduced list_gallery_comments join
   → the `-- @rollback:` note is MANDATORY, carried), migrationSequenceAll.pglite.
5. **pglite RLS test idiom** = structural policy pins (regex over migration text) +
   executed RPC behavior; pglite runs single-connection superuser so policies aren't
   role-switched. Run `--no-file-parallelism`. Mirror `galleryReactions.pglite.test.js`.
6. **goldenViewModel is red at base** (defense.scoreAvg 63→65, headcounts.institutions
   54→55 — generator drift, orthogonal to V-O). One of the 4 pre-declared parked-red
   families. NOT re-recorded.

## Closure / gate receipts (executed)
- Eager closure: baseline **1,024,734** → final **1,025,029**, **Δ +295 B** (V-27d's
  eager toggle wiring only: main.jsx dynamic-import activation + the display `var()`
  token string; flags.js 6.6KB + face module stay lazy). ≤ 1,040,000 (14,971 headroom).
- verify:dist = 23 files / 162 passed (closure gate + all lazy-absence contracts).
- Ratchets = 29 passed (anyCast/rawColor/mapPalette/deepCraftKillList) + title census 23.
- strict 0 (ceiling 0), tsc full 0, lint clean on all touched files, NUL scan none.
- Full two-shard --no-file-parallelism sweep (in vision-e — ⚠️ first attempt's
  shard-1 raced into the `minifold` worktree; re-ran pwd-guarded): **14,614 passed,
  21 skipped, 4 failed = EXACTLY the 4 parked golden families** (beliefMapGolden /
  generatorGoldenMaster / worldpulseDeityGolden / goldenViewModel), nothing else.
  ⚠️ domainAnyCastBaseline showed a TRANSIENT 2-failed in the shard but PASSES in
  isolation (9/9) — suite-interaction flakiness, not real (diff isolation runs).

## DEFERRALS (documented, not dropped)
- **V-27d IM Fell woff2 binary** — cannot source a font binary here. Owner lights it
  in TWO steps: flip `imFellDisplayFace` AND drop `IMFellEnglish-Regular.woff2`
  (SIL OFL, Google Fonts / iginomarini.com) into `public/fonts/`. Flag-on degrades
  to the Crimson fallback until then (font-display:swap). Mechanism complete + tested.
- **V-27f admin-actions dispatch arm** — the moderator-UI arm that calls
  `set_gallery_comment_hidden` through `supabase/functions/admin-actions/index.ts`.
  DEFERRED: it modifies the security-critical JWT-role-gated Deno function whose test
  suite can't run here (no Deno) — a security-posture change not to force unverified —
  and the surface is inert until comments are enabled. The service_role RPC is ready;
  mirror the `set_account_banned` arm + a `write_audit` row (recon: developer/admin/
  support role tier).
- **V-27b perf budgets** — OWNER-GATED unratified placeholders (25s TTI/LCP, 1.5s INP)
  sized ~1.6× over the observed DEV-server baseline (no production numbers are documented;
  the harness CLOSES that deferral). Owner ratifies after a production-build run and may
  point the webServer at `vite preview`.

## JUDGMENTS (vetoable)
- V-27c: parallel structured `emblemPaths` + parity pin, NOT a single-source rewrite of
  `draw()` — because the web ornament golden pins `draw()` bytes and a rewrite risked
  reddening it. (Veto → do the bolder single-source rewrite with a byte-identity pin.)
- V-27d: explicit `--oc-display-face` var seam (display-only), NOT the weight-600
  `@font-face`-override trick (zero-token but relies on weight coincidence). (Veto → the trick.)
- V-27f: deferred the admin-actions arm rather than modify an unverifiable-here security
  function. (Veto → wire the arm.)

## Geography for the fold
Worktree `.claude/worktrees/vision-e` (yes, `-e` dir, branch `claude/vision-o`).
Base-independent — folds cleanly EXCEPT the migration renumber 168→169 (finding #3).
