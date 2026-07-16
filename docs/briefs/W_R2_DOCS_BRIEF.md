# W-R2-DOCS — the truth-restoration wave (evergreen docs + freshness pins)
## Read docs/briefs/W_R2_COMMON_PROTOCOL.md FIRST. Branch: `claude/w-r2-docs`.
## Base symbols to verify: docs/DEPLOY.md exists; tests/docs/ contains the architectureFreshness pattern (find it — your pins follow it).

**CHARGE:** the evergreen operator/contributor docs rotted while the program docs stayed
perfect — because the program docs have an append LAW and the evergreen docs have no walker.
Fix the content AND install the walkers so this class dies. This wave MUST land before the
deploy path executes (Phase O) — DEPLOY.md is on the pre-authorized launch path.

**FENCE:** docs/** (except the frozen DESIGN_*.md corpus and the program/review docs),
ARCHITECTURE.md, CONTRIBUTING.md, README.md if needed, tests/docs/** (new freshness pins).
ZERO product code. ZERO changes to docs/COMPREHENSIVE_REVIEW_*.md, MASTER_MERGE_PLAN.md,
DESIGN_*.md, or the playbook's §0.0.1 ledger table (append-only by law — you may fix the
STANDING sections per finding 3 below, never ledger rows).

**THE FIXES** (all CONFIRMED; extraction per protocol):
1. `docs-knowledge-1` — DEPLOY.md: correct the migration head claim (134+, or better: derive),
   the function list (16 dirs — enumerate from supabase/functions/), the counts; add a
   freshness pin: a tests/docs test asserting DEPLOY.md names every supabase/functions/* dir
   AND the current migration head (the architectureFreshness pattern). The pin is the point —
   the prose fix alone re-rots.
2. `docs-knowledge-2` — ARCHITECTURE.md: add the spatial-engine + engine-wave-stack section
   (pointer to playbook §0.2 as the constitution); rewrite "The gate" derived from
   package.json's actual check chain; extend the freshness pin (must mention
   src/domain/spatial + every check sub-step).
3. `docs-knowledge-3` — the playbook's STANDING sections (§0.0.2 budget bullet, §0.0.3 NEXT,
   §0.4, §0.8): stop duplicating volatile numbers — each becomes a pointer to the newest
   §0.0.1 row / the live const / COMPREHENSIVE_REVIEW_PROGRAM.md. Optional freshness pin:
   any budget figure quoted in the playbook must match the code const. NEVER touch ledger rows.
4. `docs-knowledge-4` — CONTRIBUTING.md: the constitution subsection (link playbook §0.2),
   the engine-behavior row in the proof table (goldens/byte-identity/owner-gated regens),
   correct the test count (derive or round honestly); pin: CONTRIBUTING names every
   npm run check sub-step.
5. `docs-knowledge-5` — RISK_REGISTER.md: demote the "living document / source of truth"
   banner to historical-with-pointers (playbook §0.0.2 + newest review doc); fix
   CONTRIBUTING's pointer to match.
6. `docs-knowledge-6` — round-21 plan: one Progress line recording W2's true posture
   (preserved branch 2f4f7b58; +363 B eager vs an ~85 B margin; re-apply requires its own
   FP-G reclaim window — never a bare cherry-pick).

**GATE NOTE:** your full-gate run should be unchanged-product-green trivially (docs-only), but
your NEW tests/docs pins must pass against your fixed docs AND fail against the pre-fix docs
(prove non-vacuity: temporarily revert one doc line, watch the pin red, restore).
