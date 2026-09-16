---
name: index-compaction-destroys-index-only-facts
description: "A MEMORY.md compaction permanently destroyed two landing shas that existed nowhere else; before trimming any index line, grep every hook's distinguishing token across the whole memory dir and write the survivors into topic files FIRST"
metadata:
  node_type: memory
  type: project
  originSessionId: bfbb0873-cc45-436f-ba83-0649415fa667
  modified: 2026-08-11T15:33:06.325Z
---

On 2026-08-10 a MEMORY.md compaction pass (20,750 B → 17,041 B, another session,
concurrent with this one) trimmed index hooks for size and **permanently destroyed two
commit shas that existed in no other file in the memory directory**:

- `6da84cfd` — the OSR identity repair BUILT and committed (2026-08-09). Once the hook
  was gone, `osr-resolver-state-identity-ruling.md` said "repair lane DISPATCHED …
  dispatch when a write-lane slot frees" and `osr-identity-repair-landed-and-growth-wall.md`
  said "Edits are UNCOMMITTED (the manager commits)". **Both files read as NOT LANDED
  for work that had shipped a day earlier.**
- `cd6bccc6` — the three folded snapshots deleted (2026-08-07). Worse than lost:
  `hb-wc-ep-fold-landed.md` actively asserted "**The snapshots are NOT deleted**" under a
  "⛔ Still owed / still gated" heading, three days after the deletion landed.

Both were recovered from `git log` on 2026-08-10 and written into their topic files.
The recovery only happened because a carry-audit compared every index hook against its
topic file body BEFORE the trim; nothing in the compaction itself would have caught it.

**Why:** MEMORY.md is a *recall surface*, not storage — but hooks accrete facts that
were never mirrored down into the topic file, because writing the hook felt like
recording the fact. The index is also the one file every session rewrites, and the
memory directory **is not under version control**, so an index deletion is unrecoverable
from within the memory system. A landed-work claim decays in the most expensive
direction: a successor re-opens closed work, or re-does a deletion whose second part
(`cp` lines, regeneration scripts) silently resurrects what the first part removed.

**How to apply:**
1. **Before trimming ANY index line**, extract each hook's distinguishing token — a sha,
   a file path, a config key, a count — and `grep -rl '<token>' <memory-dir>`. A single
   hit that is MEMORY.md itself means the fact exists only in the index.
2. **Write those facts into their topic files and verify the bytes landed, THEN trim.**
   That order fails toward duplication; the reverse fails toward deletion.
3. **Anchor a landing sha in the topic file the same turn it lands.** Never let an index
   hook be a sha's only home.
4. A file's own status lines rot: `hb-wc-ep-fold-landed.md` and both OSR files each
   carried a stale status while the index carried the true one. When index and topic
   file disagree about whether work landed, **`git log` is the tiebreaker, not either
   memory** — then fix both in the same turn.
5. MEMORY.md has a concurrent writer. Re-read it (and re-check its mtime) immediately
   before writing; line numbers from an audit minutes old may already be wrong.

Related: [[minifold-tree-is-live]] (same concurrency hazard, repo side) ·
[[osr-resolver-state-identity-ruling]] · [[osr-identity-repair-landed-and-growth-wall]] ·
[[hb-wc-ep-fold-landed]] · [[derive-dont-restate-and-mutant-must-change]] ·
[[two-lane-commit-shared-index-race]].

## 2026-08-10 compaction ran the protocol clean — and found a SECOND hazard: the line-deletion JOIN

The 08-10 evening compaction (20,830 → 17,407 bytes) grepped every hook before trimming.
Five hooks returned ZERO exact-phrase hits ("21 sites", "47 sites", "PAIR baseline",
"count mutant", "remove the census row") but ALL existed in topic files under VARIANT
phrasing — so grep the CONCEPT loosely in the named topic file before declaring a fact
index-only; an exact-phrase miss is not an absence. Ten landed rows went to
[[archive-2026-08-build-era-index-detail]] §08-10 evening VERBATIM before any index edit.

⚠⚠ NEW MECHANICAL TRAP: deleting an index line by replacing "\n<line>\n" (leading AND
trailing newline) with "" JOINS the two neighbor rows into one — it happened TWICE in one
pass, silently corrupting two unrelated live rows. Delete with "<line>\n" (trailing newline
only), and afterwards run `grep -n '\.- ' MEMORY.md` — a period immediately followed by
"- " is the join's fingerprint.

## ⚠⚠⚠ THE INDEX SILENTLY OVERFLOWED ITS READ LIMIT (measured 2026-08-11)

**`MEMORY.md` reached ~26KB against a ~17.1KB read limit, so ITS TAIL WAS ALREADY
INVISIBLE** — entries were being written and indexed into a region no session could read.
**The failure is silent in both directions**: the writer sees a successful write, the
reader sees a shorter file and no error. A lane discovered it incidentally and folded the
index losslessly into four archive files, verified line-by-line against the original:
**zero lines lost, 17,080 bytes after.**

⚠⚠ **THE ORDERING TRAP THIS CREATES: the NEWEST entries sit at the TAIL, so overflow eats
exactly the freshest hazards** — the ones a session is most likely to need and least likely
to have elsewhere. An index that grows past the limit does not degrade gracefully; it
truncates the future.

**How to apply:** treat ~17KB as a HARD operational ceiling, not a guideline — check
`os.path.getsize` after any index write, and fold BEFORE appending when near it.
⭐ Prefer **lossless folding into archive files** (verified line-by-line) over trimming:
folding moves a fact, trimming risks destroying one whose only home was the index — the
incident this file exists to record. And every fold must end with a broken-link check.

## 2026-08-11 SECOND fold of the day — the protocol caught a THIRD index-only fact, plus two new mechanical traps

The index was back to **18,865 B within hours** of the morning fold's 17,080 B landing —
so the real growth rate is **~1.8 KB/day while lanes are active**, and any fold that lands
near the ceiling is overflowing again the same day. This pass took it to **15,892 B**
(−15.8%), rows folded to [[archive-2026-08-11-index-fold-2]], and refreshed
`MEMORY.pre-compaction-snapshot-2026-08-11.md` to the **exact** pre-compaction bytes so the
whole pass is auditable rather than merely careful.

⭐⭐ **THE CARRY-AUDIT PAID OUT A THIRD TIME.** One hook was again index-only:
**"SettlementCard.jsx read 600/600 raw but 451/600 effective"** — `451` existed in seven
other files, all unrelated, and `SettlementCard` in several, never together. It is now
written into [[sizebaseline-exact-ceiling-hazard]] under its own heading. **Three
compactions, three index-only facts. Assume the next one has one too.**

⚠⚠ **NEW TRAP 1 — LINE NUMBERS ARE NOT ADDRESSES IN THIS FILE.** A concurrent lane appended
a row (ES-7) *during the audit*, shifting every line below it by one. A `sed -n '28p'`
extraction built from a Read taken minutes earlier silently pulled the WRONG rows into the
fold archive. **Extract by LINK TARGET (`grep -F 'topic-file.md)'`), never by line number**,
and take a frozen `cp` of the index before extracting anything.

⚠⚠ **NEW TRAP 2 — TWO FILES FOR ONE FACT.** The ES-5d lane wrote its D7 finding TWICE:
[[espionage-ladder-handoff-is-same-tick]] (measured detail) and
`a-handoff-window-can-be-provably-dead.md` (doctrine framing), each unaware of the other,
and the index carried a live row for the thinner one while the richer one sat folded in an
archive. The general law was merged into the measured file and the duplicate reduced to a
superseded stub (kept, not deleted — this directory has no version control). **When one
lane produces several memories in a session, grep the dir for the fact before writing the
second file.**

⚠ Also found: `npcs-dotted-token-convicts-a-new-worldpulse-leaf.md` had **no live index row
at all**, reachable only through an archive. A fold that moves a *fresh* hazard off the live
index is a downgrade — a hazard that bites *before the first edit* belongs on the index
until its wave closes, however new the file is.

**Verification that should end every fold:** size check · `grep -n '\.- '` for the
line-join fingerprint · every live link resolves · and **every link target of the
pre-fold index is still reachable from either the new index or an archive** (a `comm -23`
between the two link-target sets, each survivor traced to its archive).

## ⚠⚠⚠ A PRE-COMPACTION SNAPSHOT *INSIDE* THE MEMORY DIR DEFEATS THE CARRY-AUDIT (2026-08-11)

A lane about to compact wrote `MEMORY.pre-compaction-snapshot-2026-08-11.md` — a
**byte-identical copy of MEMORY.md, in the memory directory itself**. That copy is a
loaded gun pointed at this file's own protocol. The carry-audit asks *"does this token
live anywhere other than MEMORY.md?"*; with the snapshot present the answer is **always
yes**, because the snapshot contains every token the index contains. Measured on the live
dir: all **5** shas in the index reported a second home, and **every one of those homes
was the snapshot alone**. A trim run against that reading would have been declared safe
and would have destroyed exactly the facts the audit exists to protect. ⚠ The failure is
silent — the audit reports CLEAN, which is the same output as a genuinely clean dir.

**How to apply:**
1. **Never park a copy of the index inside the memory dir.** A pre-compaction snapshot
   belongs in the session scratchpad, never beside the files it will be compared against.
2. **Every carry-audit must exclude `MEMORY.*` by name**, not just `MEMORY.md` — the
   audit script's file filter is a load-bearing safety control, not a convenience.
3. A snapshot also has **no frontmatter**, so it is not a well-formed memory: it will
   never be recalled, but it *will* pollute every future `grep -rl` in this directory.
4. Delete it once its compaction lands — but it is **foreign WIP while that lane is
   live**, so flag it to the owner rather than removing another lane's safety copy.

## ⚠⚠ THE MIRROR HAZARD: A LANE THAT DECLINES TO RACE LEAVES AN ORPHAN

`es5d-compiled-architecture-beta.md` carries the line *"⚠ INDEX LINE OWED — this file was
written by a lane that declined to race a concurrent lane on MEMORY.md."* Standing down is
correct under the concurrency law, but **the deferral has a cost the law does not name: a
substantial file (an architecture ruling with nine open chair items) that is linked from
nowhere and that no successor will ever open.** Two separate lanes deferred the same day.

⭐ **Politeness about a contended index is not free — it converts a write conflict into a
silently unreachable fact.** When standing down, the owed index line must be recorded
somewhere that *is* reachable (the file's own header, as this lane did, plus the hand-note),
and the next lane to touch the index must sweep for `INDEX LINE OWED` before it writes.
⚠ Reachability, not existence, is what a fold must verify: `grep -c` the filename in
MEMORY.md **and** in every `archive-*.md`, because an archive is the other half of the spine.

Related: [[two-lane-commit-shared-index-race]] · [[concurrency-law-ruled]] ·
[[session-scratchpad-is-shared-between-lanes]] · [[minifold-tree-is-live]].
