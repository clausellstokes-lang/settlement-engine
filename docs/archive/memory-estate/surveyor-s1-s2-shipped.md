---
name: ""
metadata: 
  node_type: memory
  title: Surveyor S1+S2 shipped — the first AI ship (analyst + briefs)
  date: 2026-07-16
  branch: claude/surveyor-s1
  base: 4052fc9c
  status: MERGED @ a17d71b0 (2026-07-16); NOT pushed. Seamed items shipped as S1b (surveyor-s1b-shipped.md, 2026-07-17)
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# Surveyor S1+S2 — the analyst + the briefs (first AI ship)

Built on `claude/surveyor-s1` off 4052fc9c. FOUR commits (208cb8d2 S2 briefs → 814976fc
S1 core → c987dde9 edge+migrations → c6a26125 client+folds+docs). Design authority:
docs/DESIGN_AI_CONTROL_SURFACE.md §2 stages 1–2 + §3 hard rules. NOT merged, NOT pushed
(the manager merges per W_R2_COMMON_PROTOCOL §0.3).

## What shipped
- **S2 briefs** — `src/domain/briefs/` (citations.js = SOURCE receipt vocab + the
  STRUCTURAL audience rule; composers.js = 7 pure composers). Player-safe brief == exactly
  `toPublicSafe(settlement)` (structural pin). AI-free, fully vitest-testable.
- **S1 analyst** — `src/domain/ai/stateSlicers.js` (client retrieval; selectSlices routes
  a question to the briefs by audience — a player-framed question is FORCED to player and a
  fail-closed filter drops any non-player-safe slice). Enforcement core is
  `supabase/functions/ai-analyst/analystCore.ts` (Deno+vitest, no Deno globals): citation
  law (model cites only bundle slice ids; unsourceable ⇒ "the engine does not record this"),
  fnv1a hashes, prompt, aiOperationLog record, provider-adapter retention contract.
  `creditFlow.ts` = the pure reserve→spend→refund/release orchestrator (generalizes
  generate-chronicle).
- **Edge fn `ai-analyst`** — Deno shell: JWT → account_is_active → has_surveyor_entitlement
  (INTERFACE gate, fail-closed) → creditFlow → BYOK-or-server key (byok.ts, NEVER logged) →
  Anthropic adapter (claude-opus-4-8) → citation enforcement → aiOperationLog. config.toml
  registered (verify_jwt=true).
- **Client** — lazy `AiAnalystPanel.jsx` + `FloatingAffordances.jsx` wrapper (App.jsx was at
  its max-lines ceiling → the wrapper keeps App.jsx at 0 net code lines) + `lib/aiAnalyst.js`
  transport. Zero eager (verify:dist green).

## ⚠️ Migration numbering (collision-guard resolution)
Real migrations are **138** (ai_operation_log audit spine), **139** (surveyor_entitlements +
has_surveyor_entitlement + BYOK vault surveyor_byok_keys, pgcrypto+GUC, service-role-only
decrypt), **140** (spend_credits CASE += analysis/brief). But **137 is a NO-OP PLACEHOLDER**
(`137_surveyor_reserved.sql`) — the Founder lane owns the real `137_founder_seats`, absent in
this worktree, so a gap-at-137 would red check-migration-head (contiguity). **AT MASTER-MERGE:
DELETE 137_surveyor_reserved.sql** — the sibling's real 137 takes the slot, 138–140 slot in
contiguously. Migrations WRITTEN-NOT-DEPLOYED (owner sign-off pending). BYOK needs the DB
secret `app.settings.byok_secret` set at deploy (fail-closed until then).

## Pins (all vitest — npm run check EXCLUDES supabase/functions from test discovery, so
## every mandatory pin lives in tests/, importing the edge .ts modules)
audience-rule structural (tests/domain/aiAnalyst.test.js), citation-coverage floor
(briefs.test.js + aiAnalyst.test.js), credits reserve/refund round-trip
(tests/edgeFunctions/creditFlow.test.js), BYOK never-logged scan
(tests/security/byokNeverLogged.test.js), zero-eager (verify:dist).

## Owner amendments (arrived mid-build) — FOLDED vs SEAMED
FOLDED (§3c disclosure-hygiene + naming-hygiene + nothing-secret; §3d graceful refusal +
refusalKind eval; §3e THE FORGETTING LAW — provider retentionClass contract, Anthropic
declared 'bounded', RE-VERIFY at deploy). **SEAMED = SURVEYOR-S1b** (a small follow-up):
§3b TWO-VOICES (report/musings structural split + register-purity eval + dual render — the
analystCore `claims` list is already the report register; add an uncited `musings[]`),
§3c(4) CANARY tokens + §3c(5) aiOperationLog meta_probe FIELD (one follow-up migration 141
+ drop/recreate write_ai_operation_log to avoid overload ambiguity), §3f ENRICHMENT RIDER
(controlled-vocab rider + ID-free server-side category events, no consent toggle;
quality-metrics-not-from-the-rider), §3c(7) ToS + §3e privacy-policy copy (owner/legal),
§3d bias-to-the-form (S3+ write path).

## Gate + hazards
Full `npm run check`: 11,707 passed; only real fail = EXEMPT_CEILING 69>66 (known
owner-gated red) + accountIdentity/supportTickets pglite LOAD-FLAKES (green 33/33 in
isolation). HAZARD: editing analyticsEvents.js requires `npm run build:edge-shared` (it's
an edge-shared bundle input) — but that ALSO rewrites aiGroundingBundle.meta.json's
timestamp (sourceHash unchanged) → revert that spurious meta change, don't commit it.
Pricing analysis=3/brief=4 is PROVISIONAL (owner-queued final pricing).
