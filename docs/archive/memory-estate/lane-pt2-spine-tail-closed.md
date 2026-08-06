---
name: lane-pt2-spine-tail-closed
description: "⭐ LANE PT2 CLOSED 4-of-5 @ 0ab5e03e (5 commits): seed-slot guard, splice-guard pins, historyBeats mirror repaired, joinPhrases serial comma. PT2-5 origin widening OWNER-GATED (523-key golden re-record, proven). ⚠️ voiceMechanics is 1278/670 RED and NOT ours"
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T23:52:56.671Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

Lane PT2 (the spine tail, cycle-22 PS-verifier findings) on `claude/composite-r4` in the minifold worktree. Five commits, nothing pushed.

| # | commit | what |
|---|---|---|
| PT2-1 | `4dbef1d1` | real-generation pins were never seeded — see [[pipeline-config-slot-silent-key-traps]]. Guard + `tests/generators/pipelineSeedSlotContract.test.js`, sweep plant #65 |
| PT2-2 | `d5660a7b` | the splice guard's two refusals — see [[conjunction-coverage-blind-guard-pairs]]. Sweep plant #66, uncoveredBaseline 199→198 |
| PT2-3 | `acc1c726` | the historyBeats likely-future mirror repaired + lockstep pin |
| PT2-4 | `88642979` | `joinPhrases` doubled conjunctions; serial-comma cure |
| PT2-5 | `0ab5e03e` | origin rung STOPPED at the gate + a correction to PT2-4's own census key |

**PT2-3 — the documented mirror had diverged.** `historyBeats.js deriveLikelyFuture` says "Mirrors the simulationSpine logic"; it read a tension by `.label`/`.name`, and a generated tension carries NEITHER (keys are exactly type/description/severity/factions/plotHooks). Measured: 6 real settlements carrying 11 tensions between them, spine reached the tension arm 6/6, mirror **0/6** — all six printed the same stability fallback. Repaired as `tensionName` (string → `.label`/`.name` → `.type` humanized; `.description` deliberately NOT a rung, it is a whole sentence). BEHAVIOUR SHIFT: the likelyFuture beat changes on any settlement carrying a tension; no golden covers it. JUDGMENT (vetoable): repaired IN PLACE rather than importing the spine, because 3 of historyBeats' 5 consumers (dailyLife, explanation, aiOverlayVerifier) do NOT import simulationSpine and a cross-import would pull its closure into their chunks.

**PT2-4 — 30 of 180 generations printed a doubled conjunction** ("furs and pelts and game meat"; worst: "rare spices and exotic dyes and meals and drink"). 18 catalog export names carry an internal " and ". Cure = the serial comma the joiner already used at 3+, applied at 2 when any member coordinates; a clean pair keeps the bare "and" (the estate idiom — `aiLayer.joinList`, `display/glossary.js`). BEHAVIOUR SHIFT ~1 settlement in 6, one comma each; no golden covers spine text.

**⛔ PT2-5 IS OWNER-GATED — do not build it without a signature.** Full record in `docs/GOLDEN_SHIFT_LEDGER.md` §PT2-5. The origin corpus has **9 distinct bodies over 576 generations**, every arm reachable, draw-free, keyed on route × terrain × deficit × magic with ZERO seed sensitivity; the default `road` arm is 192/576 with one sentence. The reported "1 body / 140 generations" was an artifact of holding config constant. **Proven gate:** a ONE-WORD change to the road arm was planted and `generatorGoldenMaster` went red — it hashes the WHOLE settlement over 523 configs and `settlementReason` is top-level, so any widening re-records all 523 keys. Plus THE PROMISE (every existing seed's origin prose changes) and five consuming surfaces. Designed cure recorded (per-arm draw-free variants, the `historyGenerator.js:239` / `assembleInstitutions.js:710` idiom). REJECTED and recorded: widening spine-locally dodges the golden but re-creates the two-authors drift lane PS retired.

**⚠️ STANDING RED, NOT THIS LANE'S.** `tests/copy/voiceMechanics.test.js` fails 4 assertions: em-dash debt **1278 vs a 670 budget** across 20 src/data+src/domain files, and **18 vs 6** across 7 JSX files. Attribution earned, not assumed — reverting both PT2 files to HEAD reproduced byte-identical numbers. Offenders: the generated dossier-prose corpus (781 em dashes across seven `.generated.js`), the Herald display lane, the WR-8 war lane (conquestExecution/occupation/peaceTerms*), the founders+account JSX lanes, the magic lanes. The scanner reads string LITERALS, not comments. Left for the owning lanes — banking a shared baseline fed by 20 foreign files would clobber them.
