---
name: new-gated-module-reds-five-censuses
description: ⚠⚠ A new gated module + two new test files reds FIVE censuses, not the two the packets warn about — and three of them only surface in the FULL gate, after every focused check is green
metadata:
  node_type: memory
  type: hazard
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T10:30:43.859Z
---

MEASURED 2026-08-11 landing ES-5c (the espionage career register). Packets in this
program warn that **two new test files red two censuses** (sovereignty lighting +
negativeAssertionAnchor). That warning is INCOMPLETE. Adding a new **source** module
under `src/domain/worldPulse/espionage/` plus a coupling registry row reds **three
more**, and all three are invisible to focused runs — every targeted vitest command was
green before the full gate came back RED at `test:ratchet` with exactly three
regressions.

## The five, and how each is cured

1. **`tests/lint/sovereigntyLightingContract.walker.test.js`** — re-derive ALL FIVE
   figures in ONE run (it stops at its first red figure). ⭐ THE PROBE THAT WORKS: a
   `console.log` inserted inside the EXISTING census test, after the four figures are
   computed and BEFORE its first assertion. It mints no title, so it cannot move the
   thing it measures, and it defeats the sequence hazard outright.
2. **`tests/lint/negativeAssertionAnchor.walker.test.js`** — only `not.toContain(`,
   `not.toMatch(`, `not.toHaveProperty(` count. `toBe(0)`, `toEqual([])`,
   `toHaveLength(0)`, `not.toBe`, `not.toEqual` are ALL FREE. Easiest cure is to write
   none of the three; `tests/property/**` is generation-facing and can take NO roster
   row at all.
3. **`tests/domain/couplingReceiptSample.test.js` — THE ADDRESS GRAMMAR.** A new
   registry row's `receiptField` must parse. Roots are ONLY `pulseRecord`, `worldState`,
   `spatialLedgers`, or a returned read `fn(...)`. ⛔ NO PROSE — a comma splits the
   string into two addresses and both get rejected. ⚠⚠ AND THE TRAP BEHIND THE TRAP: a
   row whose addresses are ALL returned-reads joins a FROZEN SHRINK-ONLY list (seam
   SC-9), so a new returned-read row REDS a second arm of the same file. Use a
   state root. Name the coupling's persisted CONSEQUENCE, not its in-memory arithmetic
   — the ES-5b precedent names `selectedOutcomes`, not the raw share.
4. **`tests/domain/roadsParticipation.test.js` — the `.npcs`-reader inventory.**
   ⚠⚠ THIS IS THE "A COMMENT THAT SPELLS A SCANNED MATCHER CONVICTS ITSELF" HAZARD
   FIRING AGAIN, and it cost a full gate cycle. My leaf matched on ONE HEADER LINE of
   prose naming the dotted roster address; the leaf reads no roster at all. ⭐ CURE:
   reword the prose, do NOT disposition a non-reader into a readers census — naming a
   footnote there makes the next REAL reader indistinguishable from one. Leave a note in
   the file telling future lanes not to restore the dotted form.
5. **`tests/property/espionageProductsDormancyFence.test.js`** — an exact-equality list
   of espionage modules that read the gate BY NAME. A new gated leaf must be ADDED with
   its reason. (Sibling censuses of this shape exist per family; expect one.)

## Two more that fire on a registry row specifically

- `tests/domain/couplingRegistry.test.js` composes the volume's rows as an EXACT array —
  add the row there too.
- ⛔ **`src/domain/certification/couplingRegistry.js` must RE-EXPORT the new row.** The
  aggregator is what every consumer and the test import from; without the re-export the
  symbol reads `undefined` and the composition pin fails with a confusing `undefined` in
  the expected array. This file is NOT in packet manifests — add it as a
  registration-only file and record the departure.

## How to apply

Before the first full gate on a wave that adds a source module + tests, run these
directly: `couplingReceiptSample`, `roadsParticipation`, the family's dormancy fence,
`couplingRegistry`, plus the two walkers the packet names. That converts a ~14-minute
full-gate round trip into one focused run.

⚠ PROCESS RULE (chair, 2026-08-11): **a background gate cannot wake a stopped lane.**
Poll for it in your OWN shell with a bounded `until` loop and do not end the turn until
you hold the true exit code. Also: the harness's task-completion notification reports the
WRAPPER's exit code — it said "completed (exit code 0)" for a gate whose real `$?` was
**1**. Always capture `$?` directly, never through a pipe, never from the notification.

Related: [[walker-scan-textual-blindness-classes]],
[[negative-anchor-annotation-placement-mechanics]],
[[sovereignty-lighting-census-rerecorded-01a81a1e]], [[test-census-ceiling-forecloses-new-rows]].
