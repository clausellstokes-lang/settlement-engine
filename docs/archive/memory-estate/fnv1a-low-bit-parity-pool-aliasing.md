---
name: fnv1a-low-bit-parity-pool-aliasing
description: "⚠️⚠️ FNV-1a bit 0 is the input's XOR-parity — `fnv1a32(seed) % poolLength` on a power-of-two pool silently kills HALF the pool for any seed family whose varying token repeats an even number of times; cured with fmix32 in whatPhrase, still LIVE-EXPOSED in frameHeadline (FINDING LEG-F1)"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T12:59:21.895Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

**THE MECHANISM.** `fnv1a32`'s last operation per character is `h = (h ^ c) * 0x01000193`.
The prime is ODD, so nothing ever carries INTO bit 0: bit 0 of the digest is exactly
`bit0(offset_basis) XOR bit0(c)` folded over every character — i.e. the input's parity, not
a hash. `digest % poolLength` on a POWER-OF-TWO pool reads precisely those weak low bits,
so any seed family that holds the parity constant loses half the pool.

**HOW A FAMILY HOLDS IT CONSTANT:** the varying token appears an EVEN number of times.
`wizard_news.${i}.applied.evt${i}` (index twice) → its digit parity cancels → over 400
seeds, `% 8` reached residues **{1,3,5,7} only — four of eight variants unreachable**.
The single-occurrence family `wizard_news.5.applied.evtM${i}` reached all eight. Real event
refs use their varying token once, which is why this was latent rather than live.

**THE CURE (shipped @ 1b9b2b10):** murmur3's `fmix32` avalanche finalizer —
`avalanche32()` in `src/domain/display/settlementRumors.js`, applied as
`avalanche32(fnv1a32(key)) % pool.length`. The degenerate family then reached all eight at
shares 0.105-0.142. Pinned by *THE ANTI-ALIASING PIN* in
`tests/domain/rumorPhrasePools.test.js`, which deliberately uses the degenerate family.

**⚠️ STILL EXPOSED — `frameHeadline` in the same file** (HEADLINE_FRAMES, pools of 4):
identical shape, measured at 2 of 4 frames for the degenerate family. Left UNCURED on
purpose — fixing it moves the headline frames on every existing seed, a disclosed
same-seed prose shift needing its own wave. Recorded as **FINDING LEG-F1** in
docs/FABLE_VALIDATION_QUEUE.md (minifold). Do not let it ride inside a content slice.

**HOW TO APPLY.** Any `hash(seed) % N` selector in this estate is suspect when N is a power
of two and the hash is FNV-1a. Grep `fnv1a32` / `pickLine` before adding a pool. The test
that finds it is a repetition-envelope pin asserting **every member is reachable** over a
seed family — a share/uniformity assertion alone passes happily on a half-dead pool, and a
"looks random" eyeball always passes. Sibling class: [[wave-e-hazard-classes]] #1 (stride
aliasing / Weyl cure) — same disease, different modulus.
