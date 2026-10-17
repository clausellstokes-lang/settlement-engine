# THE FP COHERENCE READ — reader brief (2026-10-16, chair session 2fc13d59)

You are one reader seat in a comprehensive read of the SettlementForge FP (Foreign Policy / living-world) design corpus. The owner's word: "read them comprehensively, refine them, and then refine them as a whole to make them completely cohesive and coherent" + "complete with adversarial review". The chair will fold every reader's findings into ONE coherence volume and amend each volume IN PLACE with dated bracketed corrections. Your job is the READ of your family: exhaustive, receipted, adversarial. You write a findings file; you do not edit any volume.

## Where things are
- The volumes (plain copies, read these): `/Users/cstokes/Desktop/settlement-engine-kits/fp-coherence-2fc13d59-2026-10-16/volumes/` — your family's files are named in your prompt. Read them WHOLE, every line. They are long; read in ranges and keep notes as you go.
- The constitution every family must obey: `volumes/DESIGN_FP_SPINE.md` §1 (the twelve requirements + 13/14). Read §1 fully even if your family is not the spine.
- The compiled fold: `volumes/DESIGN_FP_ARCHITECTURE.md` — read ONLY the section(s) about your family (grep `## ` headings) plus §0/§11 if referenced.
- The code of record (read-only, static reads only, NO tests, NO edits): `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/2fc13d59-5fcc-4359-9f88-b2795e6919f4/scratchpad/master-00b648c9d` (detached at the deployed master tip `00b648c9d`). Use `rg` and `sed -n` there to spot-check substrate claims.
- The build record: `/Users/cstokes/Desktop/settlement-engine-kits/fp-kit-87797a6a-2026-09-23/FP-PROGRESS-BOARD.md` (append-only; grep your family's unit ids, e.g. `GR-5b`, `TR-3`, `WF-0`) and `FP-ORDER.md`.
- The ledger (rulings): `/Users/cstokes/Desktop/settlement-engine/docs/OWNER_DECISION_QUEUE.md` (4.4 MB — grep only, never read whole; e.g. `grep -n 'CR-WC-9' …`).

## What to produce — the findings file, in THIS order, with file:line receipts on every claim
Write to the path your prompt names. Sections:

1. **THESIS** — the family's purpose in ≤5 lines, and the ONE sentence a DM reads when its flagship mechanism fires (quote the volume's own receipt line). If no DM-felt sentence exists for a mechanism, say so by name.
2. **STATUS, TRUTHFULLY** — what the volume's own header claims (sealed / draft / architected / landed), and what the progress board and the code show (unit ids landed with commits; flags with a gate read in src; modules present/absent). A table: wave/unit · volume's claim · board · code · verdict.
3. **LAWS AND OWNER-SETTLED ITEMS** — every law, crux ruling, owner quotation and "not vetoable" item, verbatim with line numbers. These are the things the fold may NOT re-narrate.
4. **CROSS-PROGRAM CLAIMS** — a table of every claim the family makes about ANOTHER family or the war program: what it reads, what it writes, what it assumes exists (ledger, flag, function, vocabulary), the line, and whether the OTHER side's volume (or the code) agrees — check the other volume by grep; mark AGREES / DISAGREES / SILENT / STALE.
5. **INTERNAL CONTRADICTIONS** — two statements in your family's own volumes that cannot both hold (quote both).
6. **STALE PREMISES** — substrate claims refuted by the code at `00b648c9d` (spot-check at least ten of the most load-bearing; quote the live line). Also any premise another program's later ruling has overturned (e.g. the coin reversal ODQ §731.1; the birth door; the frozen kernel at 1581 effective lines, `scripts/.size-baseline.json`).
7. **THE CLOCK AND THE TIER** — for each mechanism: its cadence/dwell (fast weekly / seasonal 13 / yearly 26–52 / epoch), and whether it runs in an ASPATIAL world or needs spatial canon / a lit preset. Flag every mechanism whose felt drama lives at the seasonal or yearly clock (a DM advances a few weeks between sessions).
8. **DEPTH VS FELT VALUE** — for each mechanism, in one line: what a DM sees, and your honest judgment: KEEP (the DM feels it) · FOLD (merge into a sibling) · CUT-TO-SENTENCE (keep the law, drop the machinery) · DEFER (right but not before launch). Be willing to cut; the corpus is 49,000 lines and the estate builds dozens of commits a month.
9. **VOCABULARY** — every closed ladder / enum the family mints (name, values, line) so the chair can find homonyms across families.
10. **REFINEMENTS** — the specific in-place corrections you would make, each as: `[file:line] — current text (≤1 line) → proposed bracketed correction (≤3 lines) — reason`. Dated-bracket idiom: `[CORRECTED 2026-10-16 (coherence fold) — …]`. Never rewrite a law; amend beside it.
11. **OPEN QUESTIONS FOR THE OWNER** — only what is genuinely his (re-sequencing, golden shifts, persistence shapes, paid surfaces, parked items).

## Rules
- Evidence class: every claim is a READ; mark anything you reason rather than read as PLAUSIBLE. Never upgrade.
- Owner quotations are sacred: copy them exactly, never paraphrase inside quotes.
- Report diet in your REPLY: ≤350 words + ONE table (the status table from §2), outcome first, the five most load-bearing findings, your file path. Everything else goes in the file.
- Save the file as you go (write sections incrementally) so a killed seat loses little.
- You may run `rg`/`sed`/`grep`/`wc`; you may not run the test suite, edit any file outside your findings path, or touch git.
