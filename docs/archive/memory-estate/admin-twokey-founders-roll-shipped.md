---
name: ""
metadata: 
  node_type: memory
  type: project
  dated: 2026-07-21
  branch: claude/admin-twokey-founders-roll (off composite-r4 @ 9cf065e0)
  tip: 9693a261
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T18:10:14.633Z
---

# Admin two-key + founders roll + moderation + reporting — SHIPPED

Six commits on `claude/admin-twokey-founders-roll` (off composite-r4 9cf065e0),
INERT migrations, NOT deployed, NOT pushed. Owner-ordered 2026-07-21 (features 1+2
plus four relayed scope amendments). Vision-i worktree.

## Why (what landed, commit -> what)
- **40b12113 Two-key gate** (Feature 1 + Amendment 1 "developers too"): account-
  destructive admin actions require the retyped target user id AND a fresh GoTrue
  password `amr` on the caller's JWT. Server-enforced in supabase/functions/admin-
  actions/index.ts (guard at the TOP of the switch, `isProtectedAction` +
  `checkTwoKey` from the new pure module `supabase/functions/_shared/twoKey.ts`).
  ACTION-bound not role-bound (admin OR developer pass the identical gate).
- **a3f26c92 Founders roll** (Feature 2): migration 170 — `founder_credit_listed`
  opt-in flag + `set_founder_credit_listed` + `founders_roll()`. Lazy
  FoundersRoll (AboutManifesto) + FounderCreditToggle (AccountProfileSection).
- **689b2796 Moderation suite** (Amendment 2): migration 171 — reversible staff
  DELETE/SET-PRIVATE/BAN for settlements + saved_maps (maps AND campaigns).
- **ec9e4c36 Comment tombstone** (Amendment 3): migration 172 — hidden comments
  render as an in-place tombstone (169 already had the hide state).
- **be3539d9 Reporting pipeline** (Scope-2 + Amendment 2a): migration 173 — map
  reports + unified queue + group resolve; comment kebab; unified queue UI.
- **9693a261** closure fix (see hazard below).

## PROTECTED_ACTION_SET (the two-key set, frozen in twoKey.ts) — 7 actions
update_user_metadata (role/tier/is_founder), update_user_credits, grant_credits,
set_account_disabled, set_account_banned, grant_surveyor, revoke_surveyor. Client
census: ONLY 3 are invoked client-side (all in AdminUsersPanel: grant_credits,
set_account_disabled, set_account_banned); the other 4 have ZERO client call
sites (server-only). MODERATION set (typed-id confirm, no password): the 3 legacy
content-mod verbs + soft_delete_map, remove_gallery_map, set_content_banned,
moderate_comment. Everything else = UNGATED (reads + non-destructive staff
writes). A vitest WALKER (tests/edgeFunctions/adminActionTwoKeyWalker.test.js)
asserts every switch case is in EXACTLY one set — both plants proven red-then-green.

## Verified verdicts (report to owner)
- **amr claim = PLAUSIBLE, not CONFIRMED.** GoTrue's documented behavior (password
  sign-in mints `amr:[{method:"password",timestamp}]`; refresh PRESERVES the old
  timestamp) makes the freshness gate sound. NOT empirically verified against a
  live deployed JWT (no live token here). The guard FAILS CLOSED if amr is
  absent/malformed — so a deploy where the JWT lacks amr would lock protected
  actions (safe), surfacing the discrepancy. Verify the live JWT carries amr
  before/at deploy.
- **Seat ordinal NOT reliably recoverable.** No per-founder seat-number column; a
  founder timestamp exists only as credit_grant_idempotency.created_at (source=
  'founder_grant', per-user since mig 116) which MISSES admin-set is_founder and
  transferred/bought-back seats (160-165). founders_roll is NAME-ONLY, ordered by
  that grant time (best-effort), name tiebreak.
- **⭐ JUDGMENT (vetoable): founders_roll binds `external_name`, NOT display_name.**
  The brief said display_name (mig 002/009) but that predates 075's public-identity
  split: external_name IS the repo's canonical PUBLIC gallery author name (every
  gallery surface resolves `ap.external_name as author_name`), always-present,
  uniquely validated (update_external_name). One SELECT line in mig 170 flips it.

## ⚠️⚠️ HAZARDS (read before touching the closure or these files)
- **VISION-I WORKTREE HAS A +74 BYTE vendor-state CLOSURE DRIFT vs the reference
  environment.** Building the UNTOUCHED base 9cf065e0 in vision-i yields closure
  1,040,069 (vendor-state 17,112) and FAILS the VERIFY_DIST budget test; building
  the same commit in a fresh temp worktree yields 1,039,995 (vendor-state 17,038).
  It is cross-worktree Rollup/minifier drift (the FP-notes "CI vs dev machine"
  class), NOT anyone's code. To verify closure Δ0, build in a FRESH worktree
  (`git worktree add --detach <tmp> <commit>`; walk-up node_modules resolves),
  NEVER trust vision-i's VERIFY_DIST number. My branch tip 9693a261 measures
  EXACTLY 1,039,995 (Δ0) in a fresh worktree — proven.
- **New lucide icons default to the EAGER vendor-icons chunk.** lucideIconChunk
  (vite.config) returns 'vendor-icons' for any icon not already classified lazy,
  so adding a NEW app icon to even a LAZY component adds ~180B to first paint
  (MoreVertical cost +182). Cure: render a text glyph via the Button primitive
  (the comment kebab uses a plain ⋮), or reuse an already-eager icon.
- **gallery.js is at its 800 max-lines cap.** Do NOT add exports; inline
  supabase.rpc in the consuming component (as GalleryComments/GalleryModerationPanel
  do for the report/queue RPCs).
- **The moderation BAN is a trigger chokepoint, not per-function checks.**
  enforce_moderation_ban (mig 171, BEFORE INSERT/UPDATE on settlements+saved_maps)
  refuses a banned row from is_public=true OR a non-null unlisted_slug — covers
  every publish/republish/unlisted/rotate/feature/curate path present AND future.
  The ban RPC must set is_public=false AND unlisted_slug=null in the SAME update or
  the trigger rejects its own write.
- **set_account_banned/disabled already write their OWN A3 audit row (053, action
  'ban_account'); the pglite test pins exactly one.** So the two-key metadata
  ({twoKey,amrAgeS}) rides only the 5 entitlement/role actions that writeAudit at
  the edge; the ban/disable audit annotation is deferred (RPC-owned; annotating it
  needs a mig to those RPCs). Enforcement still fully applies.
- **mig 172 pins list_gallery_comments search_path public, pg_temp** (was bare in
  076/169) and REMOVES it from tests/lint/.migration-searchpath-baseline.json
  (shrink-only ratchet). mig 171's 3 new fns are pinned the same way.

## Deploy-order operator note
Deploy admin-actions AFTER (or with) the client release carrying the two-key
modal: an old client cannot pass confirm.typedTargetId, so every protected action
fails CLOSED (safe, but locks admins out of those actions until the client
updates). Client-side confirm is live on client release. Migrations 170-173 are
INERT (applied-head.json stays at 117); enforcement/features activate on the
owner's `supabase db push`. ARCHITECTURE.md migrations count bumped 169 -> 173.

## Deferrals (documented, not bugs)
- **Map/campaign report DIALOG client wiring** (GalleryMaps/GalleryCampaigns): the
  report_gallery_map backend + GalleryReportDialog `label` prop are built +
  verified, but the public map DETAIL object may not expose the internal
  saved_maps.id (privacy-sanitized RPC), so wiring the trigger needs the id
  verified or a report-by-slug variant. Backend is ready.
- **Inline destructive-moderation from a queue row**: the unified queue does
  status resolution (resolve/dismiss); the takedown verbs (ban/delete/set-private/
  remove-comment) live in the AdminUsersPanel by-id tools.
- **Comment/map report reason set**: reused REPORT_REASON_OPTIONS (settlement set).

## Gate receipts
Closure Δ0 = 1,039,995 EXACTLY (fresh worktree). Deno edge tests 33/33. twoKey
unit 11/11. Walker 9/9 (2 plants). pglite: founders 8, content-mod 7, comment-mod
22, report-pipeline 8. tsc 0, domain-strict 0, eslint 0 new, voice/prose/errorCopy/
rawColor/keyboard/sizeBaseline/docCounts/migration* all green.

## FULL SUITE VERDICT (2026-07-22) — PASS (tolerating exactly the parked set)
The half-shard run under DEFAULT concurrency OOM-thrashed (23 min, 2435s import,
53 contention TIMEOUTS — not regressions; the manager's known parallel-load OOM).
Re-run FOREGROUND in EIGHTHS at --maxWorkers=6 (this vitest CLI rejects
--poolOptions AND --exclude; --maxWorkers works). ~7500 tests across 8 eighths:
every non-parked test GREEN. The ONLY failures were the 4 parked golden families
(beliefMapGolden, goldenViewModel, generatorGoldenMaster, worldpulseDeityGolden —
pre-existing golden-shift, T4-ONE-REGEN queue; my lanes never touch the generator/
dossier/sim pipeline) plus advancePauseResume (parallelism-flaky; PROVEN 9/9 in
isolation --no-file-parallelism).

THREE REAL cross-lane trips the +migrations/UI caused, all FOUND-AND-FIXED (own
commits) + re-verified green:
- **deployRunbookFreshness** (d9cd7e39): DEPLOY.md "Current migration head" line ->
  173. The +migration doc-freshness trip the ARCHITECTURE.md count bump missed.
  ⚠️ FUTURE: a +migration updates BOTH ARCHITECTURE.md `migrations/** (N)` AND
  DEPLOY.md's "Current migration head" line.
- **mutationCoverageManifest** (d56b5a12): the E-A totality contract requires a
  scripts/mutation-coverage-manifest.json entry for every new invariant test file.
  Added the 3 new pglite suites (ref pglite-executed) + the walker (new
  walker-totality-executed rationale). NO uncoveredBaseline change (rationale
  entries don't count; adding an `uncovered` entry would break the exact baseline).
  ⚠️ FUTURE: a new *.pglite.test.js or *.walker.test.js needs a manifest entry.
- **deepCraftKillList** (96bc8707): three shrink-only anti-SaaS ratchets tripped —
  borderRadius (patterns /borderRadius/), rgbaLiterals (/rgba\(/), tintedCallouts
  (/SLATE_BG|AMBER_BG|GREEN_BG|RED_BG|BLUE_BG|GOLD_BG|successBg|dangerBg|infoBg|
  warningBg/). ⚠️ FUTURE: new UI must AVOID borderRadius literals (even :0 — square
  via the primitive default), rgba() (use theme tokens), and _BG tinted callouts
  (use the rubric borderLeft `var(--oc-rubric)` clerk's-note idiom).

Final tree: 9 commits on claude/admin-twokey-founders-roll atop 9cf065e0, clean.
