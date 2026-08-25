---
name: ""
metadata: 
  node_type: memory
  title: GR-4b is READY at a2222fee — and the receipt-pool annex was corrected in the same commit
  date: 2026-08-12
  tags: 
    - foreign-policy
    - packets
    - grammar
    - annex
    - census
    - program-state
  status: current
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-12T09:04:13.235Z
---

# GR-4b promoted READY at `a2222fee` (build branch `claude/composite-r4`)

Packet: `docs/implementation/packets/foreign-policy/GR-4B.md`. Verified base **`32f4e520`**
(NOT the commit it landed on — `5f687277` landed mid-promotion and is recorded as an
*admissible unchanged descendant*, because the base must be the commit where the figures were
actually measured). `validate:packets` → **20 packets / 1 READY**, exit 0.

## Why

`treatyBreach.js` writes a `succession_repudiation` breach with a graded severity and an
authored receipt, and **the world never says so**. GR-4b gives that road a sentence.

## The four things a successor must not re-derive

1. **⛔ GR-4b was refused IN PART.** Of the five authored voice surfaces, only the disavowal
   has an honest producer. `succession_question_opened`, `honored_by_silence` and the dossier
   `succession_question_open` describe a question standing OPEN ACROSS TICKS — GR-4a answers
   it inside a single expression (`treatySuccession.js`: *"Nothing is ever left 'open'"*), so
   the authored prose would be untrue at mint time, which the annex's own HEADLINE HONESTY
   constraint forbids. Those three plus `reaffirmed` re-file **behind GR-4d**. This is the
   ES-7 shape, caught before a line was written.
2. **⛔ THE BINDING CONSTRAINT IS THE REGISTRATION-FILE ROW, NOT `peaceTerms.js`.** A Herald
   **desk** kind costs **five** registration-only production files (pool, `GRAMMAR_KIND_REGISTRY`
   row, `heraldRouting` `EXACT_SECTION`, `chroniclersLetter` `KIND_SECTION`, `settlementRumors`
   `WHAT_PHRASES`) against a budget of three — **and the cost is per-DESK, not per-kind**. A
   `section: null` dossier kind costs two, and `WHAT_PHRASES` is then *forbidden*. CR-GR4B-2
   records an explicit pre-dispatch override on exactly two rows: registration files 3→5 and
   handwritten files 12→14.
3. **⭐ `peaceTerms.js` pays ZERO net lines.** It measures **797 effective of a ceiling of
   800** under eslint's own `Linter`, with **no `.size-baseline.json` entry** (deleted by the
   war decomposition tranche; the exact-set arm means a compliant file that *gains* an entry
   also reds — there is no door). Both edit sites are one-line-for-one-line replacements:
   `answerSuccessionQuestions` widens to `{ worldState, newsEntries }`, and
   `const newsEntries = []` becomes a spread of it. **Raw-zero matters independently** because
   `.wizard-news-authoring-baseline.json` binds rows to path+line+column.
4. **⛔ Composing at the sink is REFUSED, and a fence proves it.** A re-derivation at the
   `newsEntries` line would narrate INTENT not ACT (a second disavow question on one treaty in
   one tick is refused by the writer's guard) **and** `successionQuestionsForTick` is ungated
   by design while `oathHolderDormancyFence` pins `successionDarkReads` to 0 — so an ungated
   production call reds a landed fence. Compose inside the `applied.ok` arm.

## ⭐⭐ THE ANNEX CORRECTION — CR-GR4B-3, landed in the SAME commit

`docs/content/RECEIPT_POOLS_GRAMMAR.md` **named a person and a reason the engine cannot
supply.** Both are now cured, and the packet marks the annex a **forbidden file** for the
implementer.

- `disavowed_by_succession` variant 1 slotted `{npc}` to the **SUCCESSOR**. The successor's
  name is unreachable three ways: the `seatTransitions` row carries `toRulerId` and no name;
  `LadderRecord.npcs` is keyed by id; and the roster (`settlement.npcs`) sits behind
  `roadsParticipation.test.js`'s exact-set `grep -rl '\.npcs' src/domain/worldPulse …`, which
  convicts a new worldPulse leaf **even for the token in a comment**. ⇒ re-slotted to the
  **FALLEN HOLDER**, whose name IS persisted at `treaty.sworn[defaultedBy].name`.
- `repudiated` variant 3 slotted `{reason}`; the DM verb records none (`OPEN_REPUDIATION_RECEIPT`
  is a fixed sentence). ⇒ re-authored without it, and `{reason}` left that pool's `SLOTS:` line.
- ⚠ **The slot could not simply be dropped**: `grammarLifecycleKindPools.walker` asserts
  `reached.size === pool.length`, so an unfillable slot makes the whole family unreachable.

Recorded in the **file's own machinery**, not a new one: **A-20** in its RESOLVED AMBIGUITIES
REGISTER, on the **A-11** precedent (a causal claim the record does not carry is struck) and
**A-15** (a slot no variant can fill is a defect). A-20 also answers **A-19**, which forbids a
variant-adding pass from rewording an exemplar.

## ⚠⚠ WHERE A NOTE MAY SAFELY LIVE IN A RECEIPT-POOL ANNEX

`tests/helpers/receiptAnnex.js` is **the one reader** for every annex volume. Mechanics:

- `sectionSlice` anchors `^# <WAVE>(?=[ \n])` and its terminator, each **exactly once in the
  whole file** (`anchoredOnce` throws on 0 or ≥2).
- `kindBlock` anchors `^### <kind>(?= )` and runs to the next `^#{1,3} ` heading.
- Only `^\d+\. (.+)$` lines inside a block are pool members; `` `[tags]` `` suffixes are stripped.

⇒ **A prose note placed after the wave heading and BEFORE the first `### ` heading is outside
every kind block and is invisible to the reader.** A note *inside* a block is fine too as long
as no line starts `N. `. ⛔ Never add a second line beginning `# GR-0 ` / `# GR-1 ` / etc.
⚠ The GR-0 walker's window is `SECTION='# GR-0'` / `UNTIL='# GR-1'`, so **GR-4's pools are
unread today**; GR-4b's own TEST row adds a `'# GR-4'`/`'# GR-5'` window (CR-GR4B-7: EXTEND
that walker, never author a new `*.walker.test.js` — the basename token makes it an automatic
mutation-coverage invariant and moves `files`+`credited` on top of `titles`).

## The census verdict

Every packet is terminal except **IA-2 (STALE)**, so
`tests/lint/sovereigntyLightingContract.walker.test.js` was unreserved and **GR-4b took it**.
Committed figures at `32f4e520`: `files: 2403, parked: 365, credited: 2038, titles: 19862,
suiteTitles: 5602`. `INDEX.md`'s CENSUS-HOLDER RULE is restamped: the four-packet version is
history; GR-4b is the sole holder, and the rule re-applies the instant a second non-terminal
packet is promoted.

## How to apply

Before compiling GR-4c or GR-4d, read GR-4B.md §-1 and §12c first — they already record what
is refused and why. Before any packet that reaches `peaceTerms.js`, remember it stands at 797
with three lines and no baseline door; a decomposition micro-act is owed **before** GR-4c/4d
and must land alone.
