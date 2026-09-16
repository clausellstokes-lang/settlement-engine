---
name: a-handoff-window-can-be-provably-dead
description: "SUPERSEDED 2026-08-11 — this was a second, thinner file about the SAME ES-5d D7 fact as espionage-ladder-handoff-is-same-tick.md. Its general law was merged there; read that file instead."
metadata: 
  node_type: memory
  type: project
  superseded_by: espionage-ladder-handoff-is-same-tick
  originSessionId: e9b4cc1b-a413-44cd-81fd-06b289e1701d
  modified: 2026-08-11T15:22:53.146Z
---

**SUPERSEDED — do not extend this file.**

On 2026-08-11 the ES-5d lane produced TWO memory files for one fact: this one (the
doctrine framing) and [[espionage-ladder-handoff-is-same-tick]] (the measured detail —
exact `pulseKernel.js` call-site offsets, the correct carrier, the pin that guards it).
The 2026-08-11 index compaction merged this file's general law into that one and reduced
this file to a pointer, so the two cannot drift apart.

**The fact, in one line:** a cross-pass handoff specified with the WRONG TICK ships green
and does nothing — at ES-5d D7 the packet, its acceptance case A5 and the design volume all
mandated `depositTick === tick - 1`, but the depositor runs EARLIER IN THE SAME PULSE than
the consumer, so the fold never fires on any world while every unit pin stays green.

**Kept, not deleted,** because the memory directory is not under version control and other
notes may still link to this name.

→ **[[espionage-ladder-handoff-is-same-tick]]** is canonical.

## ⚠⚠ CORRECTION 2026-08-11 — ES-5d NEVER SHIPPED THE DEAD WINDOW. THE CHAIR SAID IT DID.

**VERIFIED at `954592c0`:** the landed code writes `depositTick: now` (same-tick), and the
leaf's own header carries *"⛔ A `depositTick === tick - 1` window here would be PROVABLY
DEAD, and silently"*. `git log` shows ONE commit. **The dead window lived in the SPEC — the
packet, its acceptance case and the design volume — and the implementing lane caught it
BEFORE landing.** That is the process working, not failing.

⛔ **The chair then propagated the false version**: an ES-6a dispatch brief and a commit
message both said ES-5d *"shipped a fold that never fired while every unit pin stayed
green."* **It shipped no such thing.** The class is real and worth keeping; the example was
misattributed, and a lane later had to spend measurement correcting the record.

**Why: a hazard write-up is itself a claim, and "wave X shipped Y" needs the same receipt
as any other behavioural statement.** Say what was CAUGHT and where — spec, review, or
production — because "it shipped" and "it was specified and refused" are opposite verdicts
on the same evidence, and only one of them impugns the work.
