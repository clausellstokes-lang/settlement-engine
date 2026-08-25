---
name: derive-dont-restate-and-mutant-must-change
description: "⭐⭐ TWO REUSABLE LAWS from the habit-volume review arc (2026-08-06): (1) DERIVE-DONT-RESTATE — a hand-maintained restatement of a derivable fact goes stale at its source and greens a shrink-only walker seeded wrong; cures = the COUNT LEDGER (numbers) + the STRUCK-PREMISE SCAN (claims); (2) A MUTANT THAT PLANTS NOTHING GREENS — every mutant must assert the file actually changed and abort if not."
metadata:
  type: feedback
  created: 2026-08-06
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-10T17:50:14.240Z
---

# Derive, do not restate — and a mutant must prove it changed the file

## LAW 1 — DERIVE-DONT-RESTATE

**The class:** a fact that is DERIVABLE from a table (a row count, a set
membership, a coverage verdict, a premise) gets RESTATED in prose at N other
homes. The source moves; the restatements do not. THREE CONSECUTIVE review
rounds of the habit volume each CLOSED one stale restatement and SHIPPED
another — including the round whose entire charter was closing that class.

**Why it is not cosmetic:** these denominators seed SHRINK-ONLY walkers. A
walker seeded at thirteen passes GREEN on a table that has lost a row. The
restatement is not documentation; it is a load-bearing expectation.

**How to apply — two structural cures, both proven with mutants:**
- **THE COUNT LEDGER** (numbers): ONE parse script derives EVERY counted
  quantity from the document's own tables and diffs each against a DECLARED
  list of its prose homes, including OCCURRENCE COUNTS (a duplicated home is
  the first-match-document-pin class). Habit volume: 32 quantities, 129 prose
  homes, 15 structural cross-checks. ⚠ Number-word maps are a RENDERING
  table, never an expectation table — make the renderer TOTAL or the
  instrument CRASHES (stdout zero) on the most likely future edit, destroying
  the census it exists to produce. ⚠ Assert the NAME SET, not its cardinality
  — a re-spelled field name passed a length-only check.
- **THE STRUCK-PREMISE SCAN** (claims): every REFUTED premise gets a signature
  phrase; scan the whole document; RED on any occurrence not inside the
  refutation register, a STRUCK marker, or a labelled quote-to-strike. Minted
  because a JUDGMENT BLOCK still asserted a premise struck at its source —
  and a count ledger is structurally blind to a claim.

**Applied beyond the volume the same day:** docs/START_HERE.md carried FOUR
disagreeing spellings of the endgame tail; cure = ONE spelling at §3h,
pointers elsewhere ([[endgame-tail-order-ruled]]).

## ⭐⭐ THE LAW BIT IN FOUR HOMES AT ONCE (2026-08-06, the memory-estate pass)

The sharpest single demonstration of Law 1, worth carrying as the canonical
example: during one memory-index consolidation, hand-maintained counts were found
drifted from their sources in **FOUR different kinds of home simultaneously**, each
independently, none detected by the others:

1. **A memory index line** — "NOT YET ARCHITECTED" for a directive that had been
   architected whole as a 6,492-line volume ([[war-auxiliary-contribution-directive]]).
2. **A YAML `description:` frontmatter** — carrying the same refuted claim, which
   is what the index line was mirroring. ⚠ Fixing the index alone would have let
   the frontmatter re-seed it.
3. **A repo README** (`docs/architected-volumes-pending-fold/README.md`) — stale on
   every wave count it indexed (EP "16" vs a declared 6; WC "~12 est." vs a declared
   17), with an aggregate "~38 build waves" that was internally consistent with its
   own two wrong figures — the tell that a total derived from restatements
   validates nothing.
4. **A volume's own header** — the habit volume's header said "POLISH ROUND
   (round 2)" while its body carried round-four material throughout
   ([[habit-conditioning-directive]]).

**The compounding failure mode this exposed:** an unmeasured number nested inside
another unmeasured number. The "94 waves remain" figure rested on a parent
volume's "75 waves / 66 seams" headline that is itself labelled PLAUSIBLE, not
measured ([[concurrency-law-ruled]]). A restatement of a restatement reads as
doubly authoritative and is doubly unfounded.

**How to apply:** when correcting a stale derived fact, fix EVERY home in the same
turn — index line, frontmatter description, README, and any header — because they
re-seed each other. Prefer a POINTER to the source over a restatement at every
home you can. And label any count you did not personally measure **UNVERIFIED**
rather than passing it on bare; a number's provenance is part of the number.

## ⭐ THIRD CURE — WHEN PROSE MUST CARRY A NUMBER, SPELL IT AS A FLOOR (2026-08-10)

The count ledger and the struck-premise scan both assume the prose home can be
MEASURED against its source. When it cannot — a rationale paragraph in
`scripts/mutation-coverage-manifest.json` describing a mechanism — the cure is
to make the figure UNROTTABLE instead of policed: a generous floor ("20+"),
never an exact count.

**Measured proof the floor works and the exact figure does not**, from the two
sibling entries that describe the SAME mechanism over the same kind of input
graph:
- `aiCharterBundle.freshness` said "all **20+** recorded meta.inputs" while its
  meta.json had grown to **110** inputs — still TRUE, never rotted, never
  needed a touch.
- `aiOutputSchemaBundle.freshness` said "all **88**" against an actual **111**
  (and **118** before the 2026-08-10 edge-shared rebuild) — so it was ALREADY
  WRONG before the rebuild moved it again. An exact figure in prose rots on
  every rebuild of the thing it counts; a floor rots never.
Fixed by splicing `88` → `20+` to match the sibling. The authoritative count
lives in the meta.json and is machine-checked there; the prose's job is the
ARGUMENT ("it re-hashes ALL recorded inputs"), for which the number was pure
decoration carrying rot risk and no weight.

**How to apply:** before writing any quantity into prose, ask whether the
argument survives replacing it with a floor. If yes, use the floor. Reserve
exact figures for homes a ledger actually polices.

## ⭐ PROVING A RED IS PRE-EXISTING WITHOUT MUTATING A SHARED TREE

Same session: the named verification gate came back RED, but on a DIFFERENT
assertion than the edit touched — `TOTALITY: every enumerated invariant file
has a manifest entry`, naming `tests/domain/pulseStageContracts.test.js` and
`tests/lint/serviceCategoryRegistration.walker.test.js` (both landed by another
lane at 0f7424f7, tracked and clean). Red at HEAD 9df7e428 before any edit.

`git stash` is FORBIDDEN here ([[agent-stash-incident-2026-07-14]]) and
overwriting a file in a live two-lane tree to A/B a gate is hostile
([[minifold-tree-is-live]]). **The safe proof is to compare the failing
assertion's INPUTS at HEAD vs working, not to re-run it:** parse
`git show HEAD:<file>` and the working file, show the key sets are
set-identical (534 = 534) and that HEAD ALREADY lacks the named keys. Inputs
provably identical ⇒ output provably identical ⇒ **CONFIRMED pre-existing**,
with nothing mutated. Generalizes to any set-difference or totality assertion.

⚠ Re-learned the same turn: `<gate> | tail -25; echo $?` printed
**GATE_EXIT=0 on a RED gate** — the pipe's status, exactly the trap CLAUDE.md
names. `sh scripts/gate-tail.sh <command...>` returned the true **exit 1** and
says so in its own output line.

## LAW 2 — A MUTANT THAT PLANTS NOTHING GREENS

A mutant whose target phrase WRAPS A LINE (or is otherwise not matched)
substitutes nothing, the battery passes, and the pass is read as proof the
guard holds. Bit live in this arc; sibling of the \u-escaped-anchor class
(a perl anchor matching NOTHING exits 0).

**How to apply:** EVERY mutant asserts the file actually CHANGED (hash or cmp
before/after) and ABORTS if it did not. In the arc's next battery the abort
guard fired TWICE on real misses — it is not theoretical.

Related: [[credit-side-enumeration-fails-open]] ·
[[first-match-document-pin-class.md]] · [[filename-anchored-source-pin-vacuity]]
· [[door3-polarity-principle-landed]] (the sibling arc: an instrument that
proves a pin RUNS but never that it ASSERTS).

## ⚠⚠ A PIN THAT REDS FOR THE RIGHT REASON WITH THE WRONG MESSAGE (measured 2026-08-11)

**A mutant that goes red is NOT automatically a pin that works.** Measured on an anchor
cure: splicing the deleted `tension?.title` arm back in DID red — but on the helper's
**LIVENESS arm** ("the anchor sibling is missing … cannot distinguish correctly-excluded
from the whole collection drifted away"). That message is the OPPOSITE OF THE TRUTH: the
collection was live; the dead title got in and **EVICTED the anchor**. A green-to-red
transition was banked while the diagnosis pointed the next reader at a drift that had
not happened.

**Why: a pin's product is its MESSAGE, not its exit code. A pin that reds for the right
reason with the wrong message costs the next lane exactly the time the pin exists to
save** — and it will be believed, because it went red on cue.

**How to apply:** when a mutant reds, **READ WHICH ARM FIRED** and confirm the message
names the actual cause. If the anchor sits in the SAME SLOT the mutant occupies, the
mutant can evict the anchor and misreport — **anchor on something the mutation cannot
displace** (here: the sentence FRAME, which dies of every other drift but survives this
one), and keep the same-slot fact beside it as a POSITIVE assertion.
⭐ Also from the same lane: **run the gate again after ANY edit that follows a green** —
"a green bound to a vanished tree is not a verdict"; that lane ran the full gate THREE
times and bound the final one to the exact landing tree by diff-sha.
Related: [[rendered-surface-negative-has-a-second-vacuity]],
[[unreachable-arm-and-self-supplied-anchor]], [[receipt-vacuity-and-shared-ratchet-rules]].
