---
name: ""
metadata: 
  node_type: memory
  title: SB3 gallery / platform / edge / exports hardened — shipped
  date: 2026-07-21
  branch: claude/sb3-gallery-platform
  tip: 33b91d63
  base: 845490000
  status: "committed (NOT folded, NOT pushed)"
  tags: 
    - sb3
    - gallery
    - billing
    - edge
    - exports
    - foundry
    - unlisted-sharing
    - account-deletion
    - esc
    - review-fix
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T04:11:22.802Z
---

# SB3 cluster — gallery/platform/edge/exports refute-and-fix

⭐ Commit 33b91d63 on claude/sb3-gallery-platform (base 084549e4, NOT folded). 16
findings triaged: 4 fixed+pinned, 2 confirmed-real FLAGGED owner-gated, 10 struck.
10 files changed, 149 insertions / 17 deletions.

## Why (the durable facts)

### FIXED (with pins)
- **esc double-encode (exports, #15)** — `foundry-module/scripts/build-journals.js`
  `esc()` ran HTML-entity encoding BEFORE the markdown-metachar pass, so `'`→`&#39;`
  then the `#` was re-escaped to `&\#39;` (mangled journals.json; O'Brien →
  `O&\#39;Brien`). Cure: **markdown-metachar pass FIRST, HTML entities SECOND**.
  All security props preserved (`< > &` still entity-escaped; `#` still heading-
  guarded exactly once). ⚠ `src/foundry/journalPages.js` esc does NOT encode `'`,
  so it NEVER had the double-encode — the finding overstated "both share it". Pin:
  tests/foundry/foundryWorldModule.test.js.
- **Unlisted party-link killed on reload (gallery, #3)** — `src/lib/saves.js`
  `supabaseList` dropped `visibility` + `unlisted_slug`, so a reload re-seeded
  ShareToGallery in the NON-unlisted UI whose "Unlisted link" button calls
  `share_settlement_unlisted`, which **ALWAYS mints a fresh slug** (migration
  168:224 loop) → the `/gallery?slug=<slug>` link already handed to the party
  404s. Cure: added both columns to the select+envelope and threaded
  `visibility`/`unlistedSlug` at ALL 3 mounts (DossierActionBand, SettlementDetail,
  GalleryDetail). ⚠ SettlementDetail was at the **600-line eslint ceiling** (599) —
  paired two prop lines to keep it net-zero. Pins: shareToGalleryReloadSeed.test.jsx
  (reloaded unlisted entry → copy/rotate/stop bar, NOT the re-mint button) + the
  mount-wiring pin now requires `visibility=`/`unlistedSlug=` on every mount.
- **Account deletion never canceled a co-existing Surveyor sub (platform, #6)** —
  `supabase/functions/account-actions/index.ts` process_deletions Stripe sweep
  canceled ONLY the recorded (Cartographer) sub when present, never enumerating
  the customer's other open subs; clearLinkage then nulled the customer id so a
  dual-plan user's Surveyor sub (id lives only in surveyor_entitlements, same
  customer) charged forever. Cure: **union the recorded id with EVERY open sub
  Stripe lists for the customer** (Set-deduped); recorded id still canceled if the
  list call throws. Pin: account-actions/index.test.ts dual-plan test.
- **worldExport doc overclaim (exports, #8)** — `src/lib/worldExport.js` header said
  "reached ONLY behind a dynamic import from the export surface" but NO in-app
  caller exists (only 3 tests import buildWorldExport). Corrected to say the export
  CONTROL is a deferred owner-scoped follow-on.

### FLAGGED — CONFIRMED-REAL, OWNER-GATED (recipes; NOT changed)
- **#1 ai_ip_rate_limit config is DEAD** — migration 156:136 promises "the edge
  helper reads these when present" but `_shared/rateLimit.ts` hardcodes
  capacity=40/refill=40/3600 (`AI_IP_CAPACITY`) and no call site passes `opts`. An
  operator can't retune the per-IP AI burst live — retuning needs a code edit +
  edge redeploy. Fix = either make `checkAiIpRate`/`aiIpRateGuard` read
  `ai_ip_rate_limit` from system_config (cached; a per-request DB read on a hot AI
  path) OR correct migration 156's comment (applied-migration = hash-drift risk).
  Owner-gated: live COGS/security gate.
- **#7 refunded/disputed source:'purchase' credit pack keeps its credits** —
  `stripe-webhook/index.ts` charge.refunded/dispute claws back
  founder/referral/dossier/transfer but has **NO** credit-pack path
  (grantCreditsForSessionOnce(...,'purchase',...) at :1880). Fix = mirror
  clawbackFounderForSession: resolve the checkout SESSION key → credit_ledger
  source='purchase' row → service_adjust_credits negative full amount (zero-
  clamped, claim-once idempotent). Owner-gated: money-reversal POLICY (full vs
  unspent; partial refunds) — I fixed #6 (unambiguous repair matching its own
  comment) but flagged #7 because it needs a paid-surface policy decision.

### STRUCK (verified deliberate/documented/by-design)
- **#2** 0.0.0.0 skip in rateLimit.ts is safe under Supabase's cf-connecting-ip
  guarantee — DOCUMENTED (rateLimit.ts lines 26-27, 109-115); x-forwarded-for is
  advisory. #**4/#5/#12** no product caller = owner-gated NEW UI surface (unlisted
  map/campaign share button, world-code minting, Featured admin control — the
  "inert until surface lit" pattern). **#9/#10** applied-migration comment/REVOKE
  edits (hash-drift; #9 needs new mig = owner-gated; funcs have internal auth).
  **#11** adaptUnlistedCampaign fail-closed is deliberate (comment 140-142) +
  dependent on #4's unshipped surface. **#13** allowance-gate fail-open is
  documented back-compat (stripe-webhook 234-237). **#14** line[0] price read is
  documented common-path-safe. **#16** esc structure-boundary (newlines/`-`/`1.`)
  is deliberate + DM-authored; markup injection stays blocked.

## How to apply / hazards
- ⚠ **esc order law**: any markdown-for-HTML escaper must run the metachar-
  backslash pass BEFORE HTML-entity encoding, else the `#`/`&` inside emitted
  entities get double-escaped. build-journals.js now does; journalPages.js is
  immune (no `'`/`"` encoding).
- ⚠ **saves.js ghost-column walker** (savesColumnParity.test.js): a column WRITTEN
  by saves.js/gallery.js but absent from supabaseList SELECT ghosts on reload.
  visibility/unlisted_slug are RPC-written (not saves.js), so adding them to the
  SELECT only was safe; SELECT.size is now ~30 (>=20 non-vacuous check holds).
- ⚠ **account-actions deletion sweep** is Deno — run `deno test --no-check
  --allow-all supabase/functions/account-actions/index.test.ts` (the `--no-check`
  is required in a worktree: `@types/node` isn't resolvable via the main-tree
  node_modules walk-up).
- ⚠ **build-edge-shared churn**: running `node scripts/build-edge-shared.mjs`
  rewrites `aiGroundingBundle.meta.json` + `analyticsEventsBundle.meta.json`
  `generatedAt` ONLY (sourceHash unchanged) — REVERT both (`git checkout --`).
- ⚠ **lint-staged backup stash**: the pre-commit hook creates a 2-parent backup
  stash (e.g. 4409e6f5) and drops it on success — it does NOT capture untracked
  files, so it never touches foreign untracked WIP.

## Observation for the owner (NOT caused by this commit)
`.claude/skills/` was untracked in the vision-j worktree at session start
(`?? .claude/skills/`) and was ABSENT by session end. My commit touched only its
10 tracked files; the lint-staged backup was a 2-parent stash (no untracked
capture) so it didn't hide it; foreign stash@{0} ("generation-tuning fixes") is
intact. Disappearance is external (parallel session / harness-managed). Main tree
still holds `.claude/skills/`. Left untouched deliberately — did not remove it,
won't clobber a parallel session by copying it back.

## Gate (all green; full suite NOT run per brief; expected reds = 4 parked only)
domain-strict bare 0 · tsc(full) 0 · eslint 8 files 0 · vitest
foundry+worldExport+mcp+saves+gallery+edge-contracts 14/331 · vitest
--no-file-parallelism deletion+unlisted+tokenBucket pglite 3/29 · deno
account-actions 19 (incl dual-plan) · validate:edge 59 · validate:foundry-module +
validate:mcp-server OK · python NUL scan 10 files clean.
