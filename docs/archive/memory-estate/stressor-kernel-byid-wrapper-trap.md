---
name: stressor-kernel-byid-wrapper-trap
description: "evaluateStressorRules' snapshot.byId values must be { settlement, causal } WRAPPERS — passing bare settlements makes every gate read undefined and the whole census silently returns zero, greening any absence pin"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T12:12:01.356Z
---

`evaluateStressorRules(snapshot, pressureIndex(pressures), { tick, pressures })` reads
`snapshot.byId` as a Map of id → **`{ settlement, causal: { scores: {} } }`**, not id →
settlement. Observed 2026-08-03 while building `tests/lib/instantWorld/
mundaneRealmAcceptance.test.js` (MG-4, commit `eea5a6c6`): a harness that put bare
settlement objects in the Map produced **zero magic_\* stressor births for BOTH a mundane
realm and its magical twin**. With the wrapper, the same magical twin produced 40
`magic_deadzone` births over 8 ticks.

**Why:** the spawn gates in `stressorGates.js` reach through the wrapper (`.settlement`,
`.causal`) to read institutions and config. Given a bare settlement every one of those
reads is `undefined`, so every gate declines and the candidate list comes back empty — with
no error, no warning, and a perfectly green test. This is the vacuous-absence-pin class in
its most expensive form: the pin under construction was asserting "a mundane realm mints no
magic events", and it passed for the wrong reason.

**How to apply:** any test driving the stressor kernel must build
`new Map(members.map((s, i) => [id, { settlement: s, causal: { scores: {} } }]))`. The
canonical live example is `tests/domain/magicDeadzone.test.js`. **And never ship an absence
pin over this kernel without a positive control on the same harness** — the twin-realm
control in `mundaneRealmAcceptance.test.js` is what exposed this; a synthetic fixture would
have shared the same bug and hidden it.

Related: [[harness-default-empty-state-vacuous-absence-pin]],
[[self-referential-pin-class]], [[realm-magic-toggle-mg3h-mg4-landed]].
