---
created: 2026-08-03
tags: [war-program, WR-8, stop-gate, size-ratchet, relationship-state, hazard]
status: OPEN — chair owes four answers
---

# ⛔ WR-8 does not open: four blockers, all measured (2026-08-03)

Recorded at minifold commit `b823ce54` (queue row) alongside repair commit `cb681e9d`.
Both DARK, nothing pushed. **No WR-8 code exists** — `conquestDoctrineEnabled` appears
only as a certification-contract string (`warConvergenceContract.js:53`).

## Why
Lane A was dispatched to build WR-8 after the cycle-6 repairs. It cannot open, and the
reasons are the kind a future session will otherwise re-derive from scratch.

1. **The license gate is ONE-THIRD ALREADY RULED and the volume doesn't say so.**
   `FABLE_VALIDATION_QUEUE.md` "CHAIR RULINGS 2026-08-02" answers question (a):
   *"R2 license substrate v1 = existing-edge holders only."* The WR-8 substrate-gate
   bullet in `DESIGN_WAR_RULINGS_ARCHITECTURE.md` still lists all three as open.
2. **Question (c) — which band "extreme" names — blocks THE RAZING, not just the
   license slice.** The volume scopes its STOP to "the license slice", but J-WR-10
   governs R's own extremity gate and WR-8's pin list demands the
   victorious-but-not-extreme negative case. Doc-vs-doc conflict; report, don't rule.
3. **⚠️⚠️ THE ATROCITY CASUS HAS TWO RULED NAMES.** J-WR-14 + §5 WR-8 body say
   `atrocity_answer ↔ atrocity_atoned`; the queue's 2026-08-02 chair block says
   `atrocity_outrage ↔ atonement_accepted`. Same date, both "vetoable", both
   chair-authoritative. Taxonomy is walker-enforced for bijection ⇒ mints once.
4. **⚠️⚠️ BOTH PULSE MOUTHS HAVE ZERO HEADROOM (executed).** `applyWorldPulse.js`
   measures **exactly 1395** vs frozen 1395; `pulseKernel.js` **exactly 1580** vs
   frozen 1580. `eslint.config.js` generates a per-file `max-lines: ['error',{max}]`
   from each baseline entry, so ONE added effective line reds the commit's own
   lint-staged hook. This is why WR-7b/7c/7d all shipped unwired. WR-8 is worse:
   its conquest/razing slices WRITE world state.

## How to apply
- Re-measure headroom with eslint's own `Linter` (same rule + `languageOptions` as
  `tests/lint/sizeBaseline.test.js`), never `wc -l` — raw 1956 vs effective 1395.
- Before building ANY WR-8 slice, check whether THE DECOMPOSITION WAVE has opened
  the mouths and whether the chair answered (A) type-flip vs axes, (B) the extreme
  band, (C) the atrocity spelling, (D) dark-and-unwired permission for a WRITER wave.

## Substrate re-verification (live code outranks the §2 table)
- Gate fact (1) HOLDS: `ensureRelationshipStatesForGraph` maps exactly over
  `graph.edges` ⇒ a non-neighbour holder has no relationship object.
- Gate fact (2) is now INCOMPLETE: D5 landed. `relaxRelationshipStates` computes
  `RELATIONSHIP_RELAX / horizon`, `MEMORY_HORIZON_BANDS {fleeting .5, generational 1,
  long 3, undying Infinity}`, resolver wired at `pulseKernel.js:325`. **undying ⇒
  relax 0 ⇒ no time reversion at all** — a third answer to question (b) the gate text
  never contemplates. BUT `memoryHorizon` is DECLARED-ONLY: no row in
  `FACET_INFERENCE` (only `institutionNature`/`institutionFunction`) and no generator,
  catalog or data file authors it, so a GENERATED world still relaxes at exactly
  0.12/tick (half-life ln0.5/ln0.88 = 5.42 ticks). INT-5 `memoryHorizonSeamEnabled`
  is unlanded.
- Gate fact (3) HOLDS EXACTLY: `RELATIONSHIP_DEFAULTS` tops out at
  `hostile.resentment 0.78` (next `cold_war 0.68`, `vassal 0.48`).
- **CENSUS DRIFT (J-WR-13 standing rule):** §2 records 13↔13 casus pairs; the live
  tree has **15↔15** — `lineage_claim↔kinship_bond` and
  `alliance_obligation↔obligation_discharged` landed since. Atrocity would be #16.
