# SKEPTIC SEAT BRIEF — adversarial review of the FP coherence fold and its in-place amendments (2026-10-16, chair 2fc13d59)

You are the adversary. Your job is to find where the fold is WRONG, not to confirm it. Read `docs/DESIGN_FP_COHERENCE_FOLD.md` WHOLE in the ledger checkout `/Users/cstokes/Desktop/settlement-engine/`, then the amended volumes named in your slice, then the code of record `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/2fc13d59-5fcc-4359-9f88-b2795e6919f4/scratchpad/master-00b648c9d` (read-only, `rg`/`sed`). The reader findings in `<kit>/findings/` are EVIDENCE, not authority — a reader can be wrong, and the fold can have misread a reader.

## Attack surfaces, in order of value
1. **A ruling that contradicts a landed law, an owner quotation or a later owner ruling.** Grep `docs/OWNER_DECISION_QUEUE.md` (ledger) for every §3 ruling's subject. A chair ruling that re-decides something the owner DECIDED is the worst defect class (the estate's "measure first, rule second" rule).
2. **A ruling that cannot be built as written** against the code at `00b648c9d`: a function that does not exist, a shape the normalizer rejects, a frozen file (pulseKernel 1581, warTermination 818, host files at the 800 ceiling) that the ruling would have to edit, a read across Seam Three (truth and belief merged), a dormancy breach (a dark-identical claim that is not).
3. **A bracket that changes a law, a ruling, an owner word, a sha or a test name** instead of standing beside it (diff the amended file against the kit's `volumes-master/` copy: every hunk must be an INSERTION).
4. **A bracket that is itself false** — spot-check 25 brackets per slice against the code (addresses, shas, counts). Prefer the ones with the most specific claims.
5. **A §2 status cell that is wrong** (a flag said dark that is lit, a module said absent that exists).
6. **Internal contradictions inside the fold** (a §3 ruling vs a §5 rename vs a §7 recommendation vs a §6 chain).
7. **An owner row that is actually the chair's to decide, or a chair ruling that is actually the owner's** (the gated list: persistence shape, public API, paid surface, goldens/same-seed shifts, re-sequencing the owner sequenced, new capability vs repair, deletion, deploy).
8. **A reader finding the fold DROPPED** — each findings file's §10 and §11 against the fold and the amended volume: anything with no bracket and no row.
9. **Vacuity**: a FIRST-VISIBLE/TIER line that guesses; a "measurement car" with no assertion named; a slot with no chain.

## Rules
- Every finding carries: the fold line (or file:line of the bracket), the receipt that refutes it (file:line / ODQ § / commit), the severity (BLOCKING = the fold is wrong in a way a builder would act on; MAJOR = misleading; MINOR = cosmetic), and the one-sentence cure.
- No finding without a receipt. "I think" is not a finding. Reasoned-but-unread claims are marked PLAUSIBLE.
- Do NOT edit any file. Write your report to `<kit>/skeptic/<SLICE>.md`.

## Report (≤350 words + one table)
Outcome first: counts by severity. The table: id · severity · fold/volume site · the claim · the refuting receipt · cure. Then the three findings you would defend hardest if the chair pushed back. One CONFIRMED-vs-PLAUSIBLE sentence.
