# RESEARCH SEATS — the common rules (P1 of the FP final architecture program; read `../README.md` first, whole)

You are a census seat. You MEASURE what the code and the corpus already are so that a compile seat can design on facts, not on guesses. You do not design; you may GRADE the chair's proposals (buildable as written · needs a leaf-first car · refuted, with the receipt) and propose alternatives when a proposal is refuted.

## Where things are
- The design corpus: `/Users/cstokes/Desktop/settlement-engine/docs/` (the ledger checkout). READ: `DESIGN_FP_SPINE.md` §1 (requirements 1–24; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1), the fold's §0 · §3.4 (the engagement registry) · §5 (the vocabulary register) · §6 (the chains) · §7 (the owner rows), the two briefs `DESIGN_FP_PARTY_BRIEF.md` and `DESIGN_FP_CHAMPIONS_BRIEF.md` WHOLE, the two drafts `DESIGN_FP_ARCH_PL.md` and `DESIGN_FP_ARCH_MN.md` (§0, §1, the §11/§12 rulings), and whatever volumes your brief names. `docs/OWNER_DECISION_QUEUE.md` is 4.4 MB — grep only, never read whole.
- The code of record: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963` — a detached worktree at master `81f1cd963`. READ-ONLY. `rg`, `sed -n`, `wc -l`, `node` for a probe. ⛔ The ledger checkout's own `src/` is a FOSSIL (619 commits behind): never read code there.
- Probes: if a claim is load-bearing and only execution settles it, write the probe under `/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/findings/<R>-probe/` and run it from there against byte-copies or imports of the worktree's modules (never edit the worktree; never run the test suite; never touch git).
- Prior census and skeptic work you may cite as EVIDENCE (never as authority): `/Users/cstokes/Desktop/settlement-engine-kits/dominion-xf-2fc13d59-2026-10-17/findings/{V-vassalage,D-deciders,T-threats}.md`, `skeptic/{SPL,SMN,SX}.md`; `/Users/cstokes/Desktop/settlement-engine-kits/fp-coherence-2fc13d59-2026-10-16/findings/*.md`.
- The generals design (branch-only, for the captain's substrate and the person-memory shape): `/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/refs/DESIGN_FP_GENERALS.md`.

## What to produce — `findings/<R>.md`, in THIS order, saved incrementally (a killed seat loses little)
1. **THE SUBSTRATE TABLE** — one row per mechanism your brief names: `path :: symbol` · what it is (one line, with the quoted line as evidence) · what it gives the program · its gate/flag and the presets it is lit in · its host's effective line count against the 800 ceiling (eslint's own count; `pulseKernel.js` is frozen at 1581, `applyWorldPulse.js` 907, `warTermination.js` 818) · persisted or derived.
2. **THE ANSWERS** — each numbered question in your brief answered with receipts; where a question asks "how would X ride Y", answer with the exact seam (the function, its arguments, its caller) and whether a leaf can reach it without a kernel line.
3. **THE TOKEN CENSUS** — every word the program would mint, searched on master (`rg -w -i`) in `src/`, `tests/`, `docs/` of the WORKTREE and the ledger's `docs/`; LANDED (where, meaning) · FREE · PROSE-ONLY. Recommend the code token for each new concept.
4. **THE CHAIR'S PROPOSALS, GRADED** — for each proposal your brief lists: BUILDABLE AS WRITTEN · NEEDS A CAR (which host, how many lines, the leaf-first shape) · REFUTED (the receipt; the alternative).
5. **PERSISTED SHAPES** — every new persisted field the program would need, where it would live (`spatialLedgers.*`, the campaign record, the NPC record, the deed record), its lifecycle paths (create · read · persist · regenerate · undo · import · migrate · dark-after-lit · death), and whether an existing ledger idiom (drop-when-empty, `allianceCalls`' bounded archive, the proposal ring's snapshot undo) carries it.
6. **HAZARDS** — anything a compile seat would get wrong if it trusted the brief: a function that does not exist, a shape that differs, a ceiling, a frozen host, a belief/truth crossing, a determinism hole (`Date.now()`, `Math.random()`, unsorted iteration), a second truth (a second decay law, a second danger, a second reputation).
7. **OPEN QUESTIONS FOR THE CHAIR** — only what measurement cannot settle.
8. **REFINEMENTS SEEN** — the owner's word of 19:2x: "also mark and make appropriate adjustments in areas you see for refinement". List every refinement to the brief's design that your measurement suggests (a better carrier, a simpler shape, a missing counterforce, a felt sentence that cannot fire), each with its receipt and one line of reason; the compile seat makes them and marks them.

## Rules
- Evidence class on every row: CONFIRMED (read at the cited symbol, the line quoted, or executed in a probe) or PLAUSIBLE (reasoned). Never upgrade.
- Cite by SYMBOL (`path :: symbol`) and quote the line; a bare line number drifts.
- Owner quotations are sacred: copy them exactly.
- A file you judge is read WHOLE once; search is for finding, not for judging.
- Save as you go; stop and report at about 300k tokens of your own context, saying what is left.
- REPORT DIET in your final message: ≤350 words + ONE table (the substrate table, trimmed to the load-bearing rows), outcome first, the five most load-bearing findings, your file path, one CONFIRMED-vs-PLAUSIBLE sentence. Everything else lives in the file.
