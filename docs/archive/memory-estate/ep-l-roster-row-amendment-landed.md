---
name: ep-l-roster-row-amendment-landed
description: EP-l roadsMissions roster-row rewrite LANDED 2026-07-28 (swept into EP-6 commit 11c295c1); skeptic re-executed every claim; six residual doc drifts recorded
metadata: 
  node_type: memory
  type: project
  originSessionId: 0dc5093f-96dd-4536-b07a-1622d6fc273b
  modified: 2026-07-28T11:38:24.228Z
---

**2026-07-28: the DISTRIBUTION_TOTALITY row for `tests/domain/roadsMissions.test.js`
in `tests/lint/distributionEnvelopePower.test.js` (~line 149) was rewritten to the
EP-l truth and is COMMITTED** — the concurrent session swept the working-tree edit
into its EP-6 commit `11c295c1` ("…the roads court frees its own envoy…"); the
diff in that commit for the roster file is the rewrite hunk verbatim, nothing else.
Row now records: GENESIS base rate 201/576 (the 207/576 reading counted 6
releasedFromRansom release-return legs; cadence law governs genesis dispatch
only); ceiling 23 unchanged, margin 3.495→3.650; floor 4 live + loosenPending
(2.994σ; derivation 3 is looser — owner pick, filed as EP-n in
docs/EPISTEMIC_PREVENTION_PLAN.md:250); the "5 violations on 16 seeds" finding
WITHDRAWN as an instrument artefact (release leg minted with startedYear=release
year in roadsKernel PASS 4; old counting summed every mission id per
npcKey|startedYear); real defect = SELF-CAPTURE, fixed same wave.

Verified: eslint 0; both suites 23/23 green via gate-tail from minifold; an Opus
skeptic RE-EXECUTED the corpus at HEAD — 201 reproduces exactly, all four margins
reproduce under the repo's own envelopeBound, 0 genesis violations on all 17
seeds, double-count mechanism reproduced on surviving seeds.

**Why:** the roster is the governing provenance record for the envelope manifest;
a future reader must know the row is current truth AND where the remaining drift
sits, or they will re-find it as a defect.

**How to apply — six residual drifts, all OUT OF SCOPE of the one-string fix,
none inside the row's arithmetic (skeptic-verified 2026-07-28):**
1. WAVE LABEL: row + manifest both say "under EP-l", but the plan
   (docs/EPISTEMIC_PREVENTION_PLAN.md:224,236) names the wave EP-6 — EP-l is the
   FINDING's queue label. Row and manifest AGREE with each other; fixing only one
   would create a contradiction — align both or neither (owner convention call).
2. STALE σ DIGIT: roadsMissions.test.js:162 and manifest ceiling notes say the
   authored 32 sits "6.6 sigma" out — that is the retired 207/576 figure; at the
   genesis rate it is 6.797. One sentence mixing two base rates.
3. measurementContext (manifest floor+ceiling entries) says the corpus
   "re-measured to exactly … 207 mission ids"; at HEAD the same corpus reads 204
   ids / 3 legs because the self-capture fix landed in the SAME commit. Honest
   provenance (names tree f9560c57) but the one line a re-runner finds false.
4. "all 17 seeds" (violation sweep) vs the 16-run rate corpus (576=16×36) — the
   17th seed is never named in row or manifest.
5. Pre-existing: distributionEnvelopePower.test.js:428 + manifest:19 still say
   the manifest "starts empty" — it now holds 11 entries.
6. Legibility: the roster header's deferred-scan bullet (:66-69) for this file
   has no pointer to the withdrawal (historically framed, not a contradiction).

See [[generation-remediation-gate-state]] for the drain-watch pattern this
session added, and [[epistemic-prevention-shipped]] for the parent program.
