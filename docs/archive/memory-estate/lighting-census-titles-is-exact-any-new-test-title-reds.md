---
name: lighting-census-titles-is-exact-any-new-test-title-reds
description: "⚠⚠ The sovereignty-lighting census pins the estate's TOTAL TEST-TITLE COUNT at EXACT equality — adding even one `it()` anywhere reds it; ZERO slack, and it is the tax on every pin any lane writes"
metadata: 
  node_type: memory
  type: hazard + ratchet mechanics
  created: 2026-08-11
  lane: exit-road labelling (Opus repair lane)
  measured_at: 73f00920 working tree
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T12:50:46.678Z
---

MEASURED 2026-08-11. A lane that adds THREE test titles — the ordinary cost of three
regression pins — turned a **GREEN** lighting walker **RED**, and the failure had nothing to
do with sovereignty lighting.

## The mechanism

`tests/lint/sovereigntyLightingContract.walker.test.js:3621` freezes five figures:

```
files: 2392, parked: 365, credited: 2027, titles: 19656, suiteTitles: 5552
```

and the test **"THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is
executed"** asserts each with `.toBe()` — **exact equality, not a ceiling.** `titles` is the
count of every `it()`/`test()` title in the whole estate. So **any lane that adds a single
pin anywhere reds this walker**, with a message about "SP-C's measured 18,471" that names
neither the offending file nor the lane.

Measured here: `expected 19659 to be 19656` — `19659 − 19656 = 3`, exactly the three titles
added, in two files that already existed.

## The two traps around it

⚠⚠ **A GREEN RUN GOES STALE THE MOMENT YOU WRITE A PIN.** Capture the base BEFORE the first
test edit or you cannot tell your delta from an inherited one. (This walker had been reported
to me as "red at base"; it was **green 33/33** in the working tree, so the red that appeared
was mine and the briefing was wrong. Measure, never inherit the claim.)

⚠ **THE FIVE FIGURES SHORT-CIRCUIT.** They are asserted in ONE test in the order
files → parked → credited → titles → suiteTitles. When `titles` fails, `suiteTitles` **never
runs**. So a report claiming "only titles moved" must prove `suiteTitles` separately — grep
the diff for `describe(` rather than trusting the green that never executed.

⭐ `parked` does NOT move if every new title is a **string literal**: door 3's reader
recognises those statically and credits the file. A title generated from a loop or a template
parks the WHOLE file (recorded precedent: a `for…of`-generated block moved parked 358 → 359).
Spell every title out.

## How to apply

Budget the census hit **before** writing pins, and decide who folds it. Re-recording means
**re-deriving all five figures with the cause stated** (the recorded sequence hazard: never
patch one figure in isolation). If the census is reserved to the chair, do not touch it —
report the isolated one-figure delta (`titles X → X+n`, cause: "n new literal titles in
already-credited files") so the fold is mechanical, and state plainly that nothing in the
change can land green until it is folded.

Related: [[sovereignty-lighting-census-rerecorded-01a81a1e]], [[sizebaseline-exact-ceiling-hazard]], [[test-census-ceiling-forecloses-new-rows]].
