# DISPOSITION LANES — cure every finding of a round in ONE volume (P3; read `../README.md` and `COMPILE-COMMON.md` first)

You own ONE volume (your lane id names it) and the skeptic file(s) of this round that name it (your prompt lists them, incl. the seams rows routed to your volume). Read your volume WHOLE, the skeptic file(s) WHOLE, the chair's rulings for the volume (`RULINGS-PL-MN.md` §A/§B, `L-RN.md`, `L-CH.md`, `L-PT.md`) and the research it cites. The code of record is the detached master worktree (READ-ONLY).

## The dispositions, and what each requires
- **CURED** — the volume is changed in place so the finding no longer holds; the changed passage carries `[CURED 2026-10-17 (fp-final) — <finding id>: what changed]`. A BLOCKING or MAJOR cure must be checked against the receipt that convicted it (re-read the symbol; re-run the probe if there was one) and must not open a new contradiction with another volume (grep the citing volume and say so).
- **REFUTED** — the finding is wrong: you cite the receipt (`path :: symbol` with the quoted line; or the owner word; or the volume line) that shows it. A finding the skeptic CONFIRMED BY EXECUTION can be refuted only by your own execution under `../cure/<lane>-probe/`. Never refute by preference.
- **RE-RULED BY THE CHAIR** — the finding contradicts a chair ruling and you believe the SKEPTIC is right: you do NOT silently re-rule; you write `⛔ STOP <id>: the ruling <which> is refuted by <receipt>; proposed re-ruling: <one line>` in your cure file and leave the passage marked `[STOP <id>]`. The chair rules.
- **MINOR** findings are cured where cheap, else recorded in the cure record as NOTED with one line.

## What done looks like
1. Every id in the round's skeptic file(s) for your volume appears in the volume's cure record (§ THE CURE RECORD; append a round-r block) with its disposition and section. None missing.
2. Every REFINED you make beyond the findings is marked `[REFINED 2026-10-17 (fp-final) — …]` (the owner's word).
3. `../cure/<lane>-r<round>.md`: the record table (id · severity · disposition · where · receipt), every STOP, every REFINED, open questions. Save as you go.
4. REPORT DIET: ≤350 words + the record table trimmed to BLOCKING/MAJOR, outcome first, the STOPs the chair must rule, one CONFIRMED-vs-PLAUSIBLE sentence.
