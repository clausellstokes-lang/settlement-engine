---
name: ""
metadata: 
  node_type: memory
  kind: milestone
  date: 2026-07-21
  branch: claude/c2-voice
  commit: 1477c284
  base: 430f8042
  status: "shipped, NOT folded"
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T06:40:42.358Z
---

# FIX C2 (voice/immersion) shipped @ claude/c2-voice 1477c284

26 cluster-C2 findings dispositioned in ONE gated commit (base 430f8042, worktree
vision-e). chroniclersLetterGolden STAYED GREEN by construction — every new letter
field (`repeats`, `recalls`, `truncated`, `truncationNote`) lands on the model ONLY
when lit, so both pinned fixtures hash byte-identically. Full disposition table in
the commit body.

## What landed (sharpest items)
- Letter: KIND_SECTION fallback (sundry monoculture killed; ~75 minted kinds routed;
  newsVoiceCategory UNTOUCHED — walker + npc-agency-voice deferral stand), verbatim
  dedupe with "so noted N times" tally, cap-honesty (FEED_CAP=240 sidecar pin;
  truncated letters never draw the "whole of it" closing), cross-time RECALL lines.
- Chronicle read model: outcome+impact twin coalescing (reader rows; deltas still
  aggregate RAW) + Thread.looseWeave (co-located multi-class components render
  without the Began/turned/stands arc).
- ai.js scrubClerkRegister: streamed AI strings drop em-dash/'!' before store/persist.
- generosityReceipt speaks NAMES (giverName/receiverName threaded kernel→EV).
- wizardNews fallback "a far settlement"; resolved/default templates re-led by label
  ("X is resolved in Y" / "X weighs on Y") — DECLARED forward mint-text shift, new
  mints only, no golden observes it.
- en.js chronicleFail/aiUnavailable/interviewUnavailable + FeatureErrorBoundary
  defaults reworded in-register; WhileYouWereAway raw error un-spliced.

## Hazards (durable)
- ⚠⚠ EAGER-BYTE FORENSICS: wizardNews.js and FeatureErrorBoundary.jsx ride the ENTRY
  chunk (not engine-core). A 2-literal fallback + `null` intermediate cost +43 eager
  bytes and BREACHED the 1,040,000 budget (+45 over). Cure that worked: ONE lowercase
  literal + re-leading the sentence-lead templates with the label. Final eager Δ =
  −4 B (closure 1,039,971 vs base 1,039,975, measured via temp-worktree build of the
  base — the only trustworthy way to attribute a closure delta).
- ⚠ The letter golden hashes the OBJECT (JSON), not just the text — even an inert
  `field: false`/`null` key reddens it. New composer fields must be spread in
  conditionally (`...(lit ? {…} : {})`).
- ⚠ The F24 NUL class bit AGAIN mid-wave: an Edit-tool write landed a literal \x00
  inside a template string in chroniclersLetter.js (grep/tests all green — only the
  python byte scan caught it). Keep the python NUL scan in every wave gate.
- ⚠ Source-scan pins count COMMENT text: a comment saying "JSON.stringify" tripped my
  own no-JSON.stringify scan of ChroniclePanel.jsx (same class as the kill-list
  comment-counting hazard).

## ONE-REGEN queue additions (also in the commit body)
- C2-Q1: letter tick-header + DEEPENED_LEAD em-dash + raw flag keys (already the
  EXPECTED_LEAKS debt in proseLeak.test.js, bound into the GREEN letter golden).
- C2-Q2: beat-emitter prose-pool variety (finding 25) — same-seed distribution shift.

## Routed out-of-lane (verified real)
Edge: ai-analyst:400 COGS literals; missing isStageEnabled on ai-analyst/interview/
generate-chronicle; prompts.ts em-dashes. Owner policy: overlay verifier commit-anyway
(aiSlice.js:87) + ungated PDF overlay. Engine seams: satellite graph-node naming
(name===id nodes excluded from nodeNameMap); stressor birth thresholds (THE PROMISE);
pulseHistory/wizardNews cap architecture (documented §6 seams).
