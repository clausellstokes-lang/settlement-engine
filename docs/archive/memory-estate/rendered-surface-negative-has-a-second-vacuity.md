---
name: rendered-surface-negative-has-a-second-vacuity
description: ⚠⚠ A negative assertion against a RENDERED surface passes just as happily when the surface never rendered — a dead read and a dead renderer are indistinguishable from outside
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T12:51:04.213Z
---

MEASURED 2026-08-11 while anchoring four UI pins. **This is a SECOND vacuity mode, not
in the recorded pin-vacuity family**, and it is fatal to exactly the pins this program
now writes most: pins whose purpose is proving a DEAD READ STAYS DEAD.

**The mechanism:** `expect(text).not.toContain('Campaign')` passes when the campaign
row is correctly dark — and equally when `ProvenanceBlock` stopped rendering that row
at all, or the card failed to select, or the whole block gated itself off. **A dead
read and a dead renderer look IDENTICAL from outside the render.** So the pin that was
supposed to guard the repair silently stops guarding the moment anything upstream of
the surface breaks — which is precisely when you need it.

**⭐ THE CURE THAT WORKS: anchor on a LIVE SIBLING ROW INSIDE THE VERY BLOCK the dark
row belongs to**, feeding the fixture a legitimately-written key so the block still
MOUNTS. Then the denial measures the specific value being refused, not the surface
being absent. Worked examples from the cure:
- campaign rows → a genuine-member render through the SAME component and SAME mocked
  selector must print the campaign name before the non-member render is denied;
- a dark **Terrain** row → feed `config.culture` so the Culture/Terrain block (gated on
  `culture || terrain`) still mounts and its **Culture** row renders off the same
  resolved-config read; the denial then measures `terrainOrNull` refusing the `'auto'`
  sentinel. And symmetrically, feed `config.terrainType` to test the Culture row dark.
⭐ Sharper than the original in both cases: the renamed test says "must NOT light the
Culture row", not "must NOT mount the block".

⭐ **RATIFIED JUDGMENT (chair): prefer `tests/helpers/anchoredNegatives.js` over the
`// anchored:` hatch when a negative lacks a live positive control.** The annotation is
reserved for negatives that are STRUCTURALLY anchored; routing through the helper makes
the control an EXECUTED ASSERTION instead of prose claiming one exists, and it sidesteps
all four recorded placement traps outright — no token placement, no inline cascade, no
ceiling interaction, and no comment spelling a scanned matcher that would convict itself.

⛔⛔ **DO NOT ANCHOR ON A SIBLING THE REGRESSION EVICTS — THE PIN REDS, BUT IT NAMES THE WRONG
CAUSE.** Measured 2026-08-11 curing the last outstanding anchor row
(`tests/domain/deadReaderRepairs.test.js:213`), and this **REFUTES the tempting "same-slot is the
strongest anchor" rule** — I wrote that rule first, then a mutant killed it.

The temptation: pick an anchor that is a MUTUALLY EXCLUSIVE OCCUPANT OF THE SAME SLOT as the
refused member. There, `siegeCapability.js` builds `tensionClause` as `primaryTension || <authored
fallback>`, so restoring the deleted `tension?.title` arm puts the refused title in the slot and
evicts the fallback in one movement. It feels airtight — nothing can be vacuous.

**What the mutant measured:** with the deleted arm spliced back in, that version DOES red — on the
helper's **LIVENESS arm**, whose message reads *"the anchor sibling is missing … cannot distinguish
correctly-excluded from the whole collection drifted away."* That is the OPPOSITE of the truth: the
collection was perfectly live and the dead value got IN. The next lane reads the red and goes
hunting a drifted producer. **A pin that reds for the right reason with the wrong message spends
the debugging time it existed to save.**

⭐ **THE RULE, DERIVED AND EXECUTED: anchor on something that DIES of every other drift but
SURVIVES the regression you are guarding against.** Then the EXCLUSION arm is the one that fires
and it names the real cause. Here that is the **sentence FRAME** (`'is still present in living
memory'`): emitted by the same `return`, so it vanishes if the producer short-circuits (the early
returns hand back the raw array, frame and all absent), but untouched by which value wins the slot.
Measured both ways — same-slot anchor → `LIVENESS ANCHOR …` (misleading); frame anchor →
`EXCLUSION: the member is present in a collection that is supposed to exclude it` (exact). Keep the
same-slot fact as a **POSITIVE assertion beside it**, so both halves of the failure are named.
⚠⚠ **THE GENERAL LESSON: run the anchor itself as a mutant.** A negative that reds is not the bar;
a negative that reds *on the arm whose message is true* is. Only splicing the realistic regression
back in can tell the two apart.

⭐ And the routing matters even when an anti-vacuity assertion ALREADY EXISTS on the next line: as
an ADJACENT statement a later edit can delete it out from under the denial, whereas as a helper
ARGUMENT it is a precondition of the denial. Converting the pair costs no test title, so it does
not move the lighting census — but re-prove that by execution after the edit, never by argument.
⭐ Run such mutants in a `git archive` of HEAD carrying your edited test file, never in the live
tree: the producer edit never touches the shared worktree and the control/mutant/revert triple is
still executed.

⚠⚠ **A THIRD MODE, MEASURED 2026-08-11: `toContain` OVER AN ARRAY IS EXACT-ELEMENT EQUALITY,
so it FAILS OPEN against a value SMUGGLED INTO an existing field.** Guarding "a road label
must never carry a settlement identity", I passed `Object.values(annotation).map(String)` as
the collection and excluded the id `'save-7f3a'`. The realistic regression — someone embedding
the id in a field the label already has (`neighborName: name + id`) — sailed straight through:
the key set is unchanged, and no ELEMENT equals `'save-7f3a'` because the element is
`'Ashfordsave-7f3a'`. ⭐ **THE CURE: join the values into ONE STRING first**, which restores
substring semantics — the semantics "the identity must not reach the surface" actually means.
Map over the WHOLE collection rather than `[0]` too, so a producer that returns `[]` yields
`''` and fails through the helper's message instead of a bare TypeError.

⭐ **AND THE SAME MUTANT RE-DERIVED THE ANCHOR RULE FROM SCRATCH.** My first anchor was the
NAME — which is exactly what an id-leak CORRUPTS, so the embedding mutant made the anchor
vanish and the helper reported *"the whole collection drifted away"*: the OPPOSITE of the
truth (the collection was live; the identity had got IN). Switching the anchor to the
**`relationshipLabel`** — emitted by the same `out.push`, derived from the same neighbour, so
it dies of every drift but is untouched by which string wins the NAME slot — moved the failure
onto the `EXCLUSION` arm with the true message. This is the recorded rule firing a second
time, in a fresh domain: **anchor on what survives the guarded regression and dies of
everything else — and only a mutant can tell you which field that is.**

Related: [[negative-anchor-annotation-placement-mechanics]],
[[unreachable-arm-and-self-supplied-anchor]], [[fixture-mirrors-deriver-dead-arm-class]],
[[negated-arraycontaining-fails-open]], [[town-map-exit-roads-know-no-per-edge-fact]].
