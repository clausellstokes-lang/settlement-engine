---
name: holistic-survey-2026-07-26
description: 8-dimension whole-system survey 2026-07-26 — program pivoted to evidence-gated completion; key stale-memory corrections and governance collisions
metadata: 
  node_type: memory
  type: project
  originSessionId: 89567b52-be97-4ef9-bcce-a0f1c8956737
  modified: 2026-07-26T20:07:44.346Z
---

8-agent read-only survey of minifold @ 69833015 + ledger @ f2aec41f (2026-07-26, tree LIVE during survey). Sharpest durable deltas:

**Stale-memory corrections (CONFIRMED):**
- Migs 170–174 are COMMITTED at HEAD ("migs 170-173 inert / 180→174 renumber pending" is superseded — renumber already happened at the pricing fold).
- New UNTRACKED migrations 175–188 now occupy the tail (deletion queue, refund obligations, leased stripe webhooks 181, command journal 183, import reconciliation 184, custom-content 185–188). **The number 180 is occupied** (payment_refund_obligation_recovery) — any plan referencing a free 180 is dead. Production head still 117 → 71-migration train, never rehearsed.
- stripe-webhook is no longer "a small refund fix": uncommitted +1,337-line rewrite = leased events + full refund/dispute obligation lattice (partial-refund clawback of grants is now DOCUMENTED CRIT-1 policy in-code). Old webhook still deployed → "issue no partial refunds" hazard still live.
- verify-checkout rate limiter STILL missing (has JWT+botGuard, no _shared/rateLimit.ts).
- vercel.json flips CSP Report-Only → ENFORCING directly, skipping its own documented soak — owner ratification needed.

**Governance collisions (unadjudicated):**
- The 2026-07-24 pivot (PRODUCT_COMPLETION_ARCHITECTURE 10-step completion order + GAME_GRADE re-architecture + CURRENT_STATE 5 release blockers) has NO recorded owner ratification and arguably exceeds the 07-19 scope freeze.
- GOLDEN-REGEN COLLISION: CURRENT_STATE claims the 4 golden families "regenerated and reverified" in-tree, but Wave 9 / SS7 law mandates ONE owner-signed regen that also lights the 7 flags — either the batch was silently split or a second regen is now owed.
- The ledger is blind since 07-22 20:00; three "what remains" frameworks coexist; owner queue fragmented across ~6 surfaces (~50–80 open decisions, ~15–20 launch-critical). CYCLE-3 Wave 8 (money-deploy code) has no fold record — likely absorbed by the refund-obligation rewrite but must be positively confirmed.

**Program shape now:** critical path shifted from CODE to EVIDENCE — every promotion blocker of consequence is human/calendar (12-GM uncoached study, device labs, RC soak, 30/45/90-day staleness windows per promotion contracts). Gate truth is TREE-coupled not COMMIT-coupled: 205 untracked test files, 36 manifest entries naming untracked tests, tip walkers can't collect at HEAD.

**How to apply:** before quoting any pre-07-26 memory about T5/migrations/webhook, check this file first. Full survey per-dimension reports were session-scratchpad only; re-derive from tree if needed. See [[backup-exposure-2026-07-26]].
