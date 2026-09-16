---
name: dark-wave-display-surface-escapes-the-flag
description: "2026-08-04 — ⚠⚠ GR-0's DM true-state chip renders IDENTICALLY flag-absent and flag-lit; a wave's four-fence dormancy set covered its NEWS BEATS and not its DISPLAY read, so \"built dark\" was true of the engine and false of the panel"
metadata: 
  node_type: memory
  type: project
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-05T03:34:03.661Z
---

# ⚠⚠ A "DARK" WAVE'S DISPLAY SURFACE THAT THE FLAG DOES NOT DARKEN

**Measured 2026-08-04, at commit b441bca5 (FP wave GR-0, flag
`treatyLifecycleVoiceEnabled`).** Driving `treatyTrueStateChip(world, pairKey,
{ includeGroundTruth: true })` with the flag ABSENT and with the flag LIT returns the
**identical sentence**. Its sibling on the same panel, the longevity age line, IS
flag-gated and correctly returns `null` when dark.

```
ABSENT  chip="Honored on every surface a free eye can reach. The truth of it is short wagons."
LIT     chip="Honored on every surface a free eye can reach. The truth of it is short wagons."
ABSENT  ageLine=null            LIT  ageLine="Signed before most of the traders ..."
```

**The mechanism.** `treatyTrueStateChip` (`src/domain/display/treatyDocument.js:173`) is
fail-closed on `options.includeGroundTruth` — the premium/elevated AUTHORITY — and on
nothing else. The `trueState` field it compares is written unconditionally by
`peaceTerms.js`, and `grammarReceipt` (`grammarNews.js:178`) carries no flag read. So the
chip went live the moment GR-0 landed.

**Why the wave's own battery could not see it.** GR-0's four-fence dormancy set fences
the two NEWS BEATS, which really are dark. Its DM-chip pin
(`tests/domain/treatyLifecycleVoice.test.js:405`) asserts the chip is fail-closed on
AUTHORITY and never drives it with the flag dark — the one experiment that would have
exposed the hole. The wave's report, and therefore its commit message, says "the read
itself is fail-closed on the flag". That is not what the code does.

**Second-order consequence.** The chip's call site copies
`BeliefDivergenceBand.jsx`'s `tier === 'premium' || elevated` verbatim, which reddened
`tests/lint/premiumGateSingleSource.test.js` after landing — a walker GR-0's gate list
never enumerated. Recorded as a census row under `content-visibility` (d1cfdb67) because
converging it to `viewerCanAuthor` would admit the founder tier: a paid-surface
behaviour change, owner-gated.

## HOW TO APPLY

- A four-fence dormancy set proves dormancy **for the surfaces it drives**. Enumerate a
  wave's surfaces — engine beats, display reads, PDF/export joins, DM chips — and fence
  EACH, or say in the row which ones are unfenced and why.
- The falsifying experiment is one line: call the surface's own entry point with the flag
  absent and with it lit, and compare the returned value. Do it for every new reader, not
  only the ones that push into a stream.
- A gate on VIEWER AUTHORITY is not a gate on a FEATURE FLAG. "Fail-closed" needs the
  noun: fail-closed on *what*.

**OPEN FOR THE OWNER:** whether the always-on DM true-state chip ships, or whether GR-0's
call site gains the missing conjunct so the wave is genuinely dark. One conjunct at the
TreatyPanel call site is the whole cure.
