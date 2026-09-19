---
name: w-doctrine-3-corruption-web
description: W-DOCTRINE-3 (THE CORRUPTION WEB) — Phase A (resolver chokepoint + attribution/innocent-guild fix) SHIPPED engine-lazy on review-fixes-2026-07-08 (UNCOMMITTED); foreign lanes §2-§6 DEFERRED; + a CONFIRMED pre-existing covert-impairment-description leak to public gallery surfaces (owner-gated fix)
metadata: 
  node_type: memory
  type: project
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# W-DOCTRINE-3 — THE CORRUPTION WEB (Phase A landed; foreign lanes deferred)

Authority: docs/DESIGN_CORRUPTION_WEB.md (owner-ratified). Built on
review-fixes-2026-07-08 @ base 642c28d8 (W-DOCTRINE-2b). ALL WORK UNCOMMITTED /
UNSTAGED (brief rule: never add/commit/push/stash; foreign stash untouched).

## What SHIPPED (Phase A — the design's "lands first": §1 resolver + §4 attribution repair)
The resolver chokepoint + the innocent-guild attribution fix. This repairs a
CURRENTLY-LIVE bug: seedBetrayalTraitor (applyWorldPulse.js:860) already ships
`corruptTies.foreignPatron` WRITE-ONLY; on organic exposure, npcAgency.js:780 did
`npc.corruptTies?.criminalInstitution || climate.criminalInstitutions[0]` — so a
foreign conspirator's exposure BLAMED THE LOCAL GUILD (impaired an innocent org).

Files (the diff surface — all LAZY, first-paint BYTE-IDENTICAL to base):
- **NEW `src/domain/corruptionLeash.js`** — `resolveLeash(npc, settlement?, worldState?)`
  + `isForeignLeashKind(kind)`. Normalizes corruptTies → one typed leash
  `{ kind:'local_org'|'foreign_settlement'|'foreign_faction'|'foreign_org'|'cutout',
  settlementId, factionName, viaLocalOrg, criminalInstitution, conspiracy, foreign, covert:true }`.
  Precedence: explicit `corruptTies.leash` → `foreignPatron` (betrayal) → derived-as-local.
  Foreign ⇒ criminalInstitution null (never blame a local org). Absent ⇒ local, byte-identical read.
- `npcAgency.js` (LAZY): line ~780 exposure attribution routes through resolveLeash —
  `leash.foreign ? null : (leash.criminalInstitution || climate.criminalInstitutions[0] || null)`.
  Local path byte-identical; foreign path yields null (the fix). Import from '../corruptionLeash.js'.
- `causeLifecycle.js` (LAZY): `sustainingInstitution` routes through resolveLeash
  (byte-identical — betrayal traitors carry neither criminalInstitution nor secondaryAffiliation).
- `tests/domain/corruptionWebPins.test.js` — the §7 Phase-A pin set: resolveLeash
  precedence (5 pins) + the INNOCENT-GUILD pin (foreign exposure names no local org,
  local guild stays unimpaired) + the byte-identical-local-path contrast. 7 pins green.

## ⚠️ THE FIRST-PAINT TRAP (why the resolver is a SEPARATE lazy leaf, not in corruption.js)
Base first-paint closure = 1,161,818 B — only **84 B** under the 1,161,902 budget
(ratchet set at 3702b9d2). `corruption.js` is EAGER (dragged into the static closure
by the eager mutate.js event router). A first attempt PUT resolveLeash IN corruption.js
→ +1,153 B engine-core, +91 B index (mutateEntities call sites) → 1,163,062, BUDGET
BLOWN by 1,160. Fix: resolveLeash lives in its OWN lazy leaf imported ONLY by the LAZY
npcAgency + causeLifecycle; the eager mutateEntities was REVERTED to byte-identical base
(safe: the DM-expose path has no climate fallback, so it already yields null for a
foreign leash, and severCorruptionTiesTo already never matches a null-org foreign leash —
routing them through the resolver was behavior-identical but cost eager bytes). LESSON:
any corruption-web code that eager mutateEntities/mutate.js would import must go in a
lazy leaf, or reclaim ≥ its bytes first. `isForeignLeashKind`'s `kind` param is `{string}`
and worldState is `{object}` (NOT `any` — domainAnyCastBaseline froze corruption's count).

## ✅ VERIFIED (this session, base 642c28d8)
typecheck (full+strict, 0 err), lint (0 err), corruption+pins+baselines (98 tests),
build + verify:dist (113 tests, first-paint == base 1,161,818 ≤ budget). Full vitest:
was 3 failures = ONLY the frozen any-cast/strict baselines catching 2 JSDoc `any`s
(fixed); all hostile-world tripwire goldens (peaceCausal/supplyWebWarfare/
informationStatecraft/deity/spatial) green — no existing golden exercised the foreign path.

## ⚠️ CONFIRMED SECURITY FINDING (§6, pre-existing, NOT created by this wave) — OWNER-GATED
Covert `corruption`-type impairment DESCRIPTIONS LEAK to anon/public gallery surfaces.
`toPublicSafe` (publicSafe.js) includes `institutions` (a PUBLIC_TOPLEVEL_KEY); a covert
impairment `{ type:'corruption', covert:true, description:"<NPC>'s capture quietly
compromised <inst>." }` (stamped by imposeCorruption scope:'individual_institution',
mutateEntities.js:732) survives — NEITHER the `covert:true` key NOR the description
match PRIVATE_KEY_RE. Probe CONFIRMED both leak. (worldSnapshotPublic.js's COVERT_KEY_RE
strips the `covert` KEY but is realm-scoped and doesn't serialize institutions, so it
doesn't help here.) The NPC beneficiary side is AUTO-SAFE (publicNpc allowlist drops
corruptTies + corrupt — confirmed). FIX is owner-gated: toPublicSafe/sanitizePublicValue
is pinned FIELD-FOR-FIELD EQUAL to the server SQL `_gallery_sanitize_public_json`
(gallerySanitize.pglite) + token-⊆-SQL (snapshotDenylistDrift), so scrubbing covert
impairments requires a COORDINATED client + DB-migration change (security posture +
migration + public-API — 3 gated classes). NOT shipped unilaterally. Recommended scrub:
drop any impairment object with `covert===true` from public projections, mirrored in the
SQL twin; then add the runVisibilityAudit fixture + gallery round-trip pin the design asks for.

### ✅ UPDATE 2026-07-15 — SHIPPED (committed on branch, NOT pushed/merged/deployed)
Owner delegated mechanism + lane ("use your best judgement"). FIX BUILT + full-gate-green +
COMMITTED `90d48888` on branch **claude/covert-impairment-scrub** (fresh worktree off the RF
committed tip `1577ed50`). NOT pushed / merged / deployed / migration-applied.
- **Mechanism = VALUE-level covert-object drop** (chosen over impairment-specific): in the
  DOSSIER path only — client `sanitizePublicValue` drops any nested object with
  `covert === true`; SQL twin **migration 135** (`_gallery_sanitize_public_json`, net-current
  130 body + guard `not is_toplevel and (value->'covert')='true'::jsonb` → null). It is a
  VALUE rule, NOT a new PRIVATE_KEY_RE token, so snapshotDenylistDrift + gallerySanitizeAllowlist
  pins are untouched; client↔SQL stay field-for-field twins.
- **KEY-STRIP PROVEN INSUFFICIENT**: a `covert` token in PRIVATE_KEY_RE strips only the KEY and
  LEAVES the naming description — must drop the whole object.
- **SCOPE = dossier path ONLY.** `_gallery_world_snapshot_is_safe` ALREADY rejects covert-keyed
  snapshots (regex has `covert`; verified is_safe=false via pglite) — no scanner change.
- **JUDGMENT (vetoable): full mode (gallery_share_dm) KEEPS covert** — owner's explicit
  DM-content share, uses `_gallery_dm_full_json` (untouched); §6 concerns the ANON surface.
- **PINS (§6)**: runVisibilityAudit adversarial fixture (gated by warTradeReadModels.test.js) +
  publicSafe.test.js default-drop/full-keep + gallerySanitize.pglite covert round-trip + parity.
- **VERIFY**: pre-existing red confirmed on RF base (client + net-current server sanitizer =
  **migration 130 on RF**, not 099); full `npm run check` components green (9384 tests, build,
  verify:dist first-paint OK). Default-timeout flakes were pre-existing slow-concurrency load
  timeouts (pass in isolation), not this change. One real self-caused failure fixed:
  ARCHITECTURE.md migration count 134→135.
⚠️ **STILL LIVE ON MASTER (d024286e)** — producer + sanitizer gap exist there too. Fixed on RF
(RF-wins in docs/MASTER_MERGE_PLAN.md → reaches master via the mapped merge). A master hotfix
cherry-pick BEFORE the merge is the OWNER'S call (deploy-gated). ⚠️ inert until `supabase db
push` (repo head 135 > applied 117 — normal pending window).

## DEFERRED (documented, not dropped — the design's foreign lanes §2-§6)
Not built (each a substantial new-subsystem build; out of one-session budget with full rigor):
- §2 CREATION: foreign onset via channel requirement + scarcity-as-law (1 asset per
  (patron,target), realm cap, upkeep, E0 deferral) — seedBetrayalTraitor deterministic-pick template.
- §3 the ONE new effect (DIRECTION — bounded §H weight-tampering) + asset-as-paid-eyes
  (couple to informationStatecraft sightPostures) + THE CAPTURE FORK (local-leashed →
  thievesGuildStrength byte-identical; foreign-leashed → per-patron foreign-grip read for W-PEACE).
- §4 FOREIGN CONSEQUENCE LANE: blowback triple (people-held casus grievance + both-court
  legitimacy + credibility charge) + edge/treaty strain; causeLifecycle re-adjudicate re-pointing.
- §5 COUNTERPLAY: official-pay posture, purges, HIDE degrades channel, generalized severance.
- §6 DM composer beneficiary picker (EventComposerCorruptionFields) + IMPOSE_CORRUPTION payload.
- Foreign lanes must ride the doctrine gate family + a fenced dormancy golden (mirror
  tests/property/informationStatecraftDormancyGolden.test.js; ledgers in worldState.spatialLedgers).
- Cutout double-surfacing pin (§7) needs the cutout creation lane (Phase C) to be meaningful.
