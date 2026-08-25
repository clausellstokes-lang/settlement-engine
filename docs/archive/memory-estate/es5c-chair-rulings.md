---
name: es5c-chair-rulings
description: CR-ES5C-1..6 — the career grain compiled; §3.14 named the WRONG FILE, rungExposure01 has no source, arm B splits to ES-5d, and the pin guarding the whole boundary is VACUOUS
metadata:
  type: project
---

ES-5c (career grain) compiled as a DRAFT at HEAD `868aca1a` (scratchpad
`es5c-packet-draft-ES-5C.md`, 932 lines). **Compilable — not a refusal — but §3.14 is
measurably wrong in three places.** All rulings FABLE-ISSUED: no post-boundary row owed
for implementing them.

- **CR-ES5C-1 — §3.14 NAMES THE WRONG FILE; the measured target governs.**
  `npcLadderContest.js` has NO defense term at all: its `contestMargin` (`:370`) is
  SYMMETRIC and its only consumer is `tieBreak` (`:428`), reached only when
  `kind === 'convergent'` AND both goals fire the same advance — **the entire OPPOSED
  branch (`:409-419`), where "holder" and "raiser" actually live, never reads the
  margins.** The real machinery is `npcLadderChallenge.js#defenseScore` (`:132`), which
  the design never mentions: it already holds `d.npc` and `ctx.worldState` with ZERO
  signature change, drives three live decisions (`:301`, `:302`, `:310`), and carries
  the exact idiom at `:145-147`. 172 effective lines against 800 — ample.
- **CR-ES5C-2 — `rungExposure01` DERIVES FROM `openWindows`' CLOSED VOCABULARY.** It has
  **no source anywhere in `src/`** and carries 0.5 of the pressure term, so feeding zero
  would HALVE the register silently — the exact class this estate forbids. Ruled: derive
  it from `openWindows`' own closed 8-member vocabulary (one member is literally
  `contested_goal`), already computed at `:296`, four lines before `defenseScore`.
  Deriving from an existing closed vocabulary beats minting a new input.
- **CR-ES5C-3 — ARM B SPLITS TO ES-5d.** Its substrate does not exist: `momentum` is
  ZERO matches across the whole ladder family, `maintainMarks` never writes `stock`, no
  stock writer accepts external input, and the grade is never persisted so nothing
  survives the tick boundary. ES-5d must BUILD four things; ES-5c does not carry it.
- **CR-ES5C-4 — ARM C IS CARRIER-CONDITIONAL (the EP-q precedent).** `gatherOrGovernRead`
  has NO caller, deliberately (`espionageProductStage.js:44-52`), so an unconditional
  flip makes the term permanently `undefined ⇒ 0`.
- **⚠⚠ CR-ES5C-5 — THE PIN GUARDING THIS WHOLE BOUNDARY IS VACUOUS, and its repair rides
  ES-5c as A8.** `espionageProducts.test.js:268-271` forbids
  `writeNpcLadder|setLadderState|npcLadderState\s*=` — **all three exist NOWHERE in
  `src/`.** The real writer is `setSpatialLedger(worldState, 'npcLadder', …)`, and it has
  NO plant though its `writeErrands` sibling twelve lines below has one. ES-3's registry
  docstring CITES this pin as proof. ES-5c opens the FIRST ladder↔espionage import, so it
  inherits the repair.
- **CR-ES5C-6 — ES-5c mints its OWN coupling row.** ES-5b's does NOT license it:
  `licensingRows` joins on the IMPORTER module and ES-5b's `read` is
  `factionCompetition.js#topFactionEntries`. ES-5c needs `read:
  '…npcLadderChallenge.js#defenseScore'` under `pairId: CPL-20`.

⭐ **A FIELD NAME THAT LIES, CONFIRMED:** `whereabouts.sinceTick` holds a **WEEK**, not a
tick — written from `weekClock = calendar.elapsedWeeks` (`roadsKernel.js:359,492`), the
same clock the ladder reads, so `awayWeeks` needs NO conversion. Only the name is wrong.
⚠ `npcAgency.js` sits at **833/833 EXACT — zero headroom**; ES-5c must not touch it.
⚠ ES-5b's own D5 address had rotted: `promotionRisk01Core` is at `espionageMath.js:401`,
not `:381`. The chair-supplied `espionageGauntlet.js:400` + test `:756` verified EXACT.
