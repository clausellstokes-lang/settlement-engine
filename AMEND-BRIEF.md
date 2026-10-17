# AMENDMENT SEAT BRIEF — apply the coherence fold to the volumes in place (2026-10-16, chair 2fc13d59)

You are one amendment lane. You amend ONLY the files in your manifest. You write nothing else (no memory, no ODQ, no HANDOFF, no git commands of any kind — no add, commit, stash, checkout).

## The authorities, in order
1. `docs/DESIGN_FP_COHERENCE_FOLD.md` in the ledger checkout `/Users/cstokes/Desktop/settlement-engine/` — read §1 (the new requirements 15–23), §3 (the cross-program rulings; its "Amended" column names your lines), §5 (the vocabulary rulings), §6, §7 (the owner rows — cite them by id where a sentence depends on one). Where §3 or §5 RULES differently from a reader's refinement, the fold wins and you bracket the reader's reading as superseded.
2. Your findings file(s) in `/Users/cstokes/Desktop/settlement-engine-kits/fp-coherence-2fc13d59-2026-10-16/findings/` — apply EVERY §10 refinement; also bracket every §5 contradiction and §6 stale premise that §10 did not already cover (one bracket at the first site is enough when the reader gave several sites for one fact; the others get a one-line `[see the bracket at :N]`).
3. The code of record for any address you must re-check: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/2fc13d59-5fcc-4359-9f88-b2795e6919f4/scratchpad/master-00b648c9d` (read-only; `rg`/`sed` only).

## The base and the destination
- BASE: the kit's `volumes-master/<file>` where it exists (it carries later corrections than the ledger copy); otherwise `volumes/<file>` (CN, EC, LG, MF, PG only exist there).
- DESTINATION: `/Users/cstokes/Desktop/settlement-engine/docs/<file>` (the ledger checkout). Copy the base over the destination FIRST (`cp`), then amend the destination. Line numbers in the findings are MASTER lines unless the findings file says otherwise (WC's master copy has a 30-line banner: master = plain + 30; EP's differs by 18 at the head).
- Keep every byte you do not amend. Never reflow, never reformat, never "tidy".

## The idiom (binding)
- A correction is a DATED BRACKET placed immediately after the sentence or table cell it corrects, never a rewrite of it:
  `[CORRECTED 2026-10-16 (coherence fold) — <the true statement, with its receipt file:line or commit>]`
  Other bracket heads: `[SUPERSEDED BY EVENT 2026-10-16 (coherence fold) — …]`, `[RULED 2026-10-16 (coherence fold §3.x.y) — …]`, `[ADDED 2026-10-16 (coherence fold) — …]`, `[CLARIFIED 2026-10-16 (coherence fold) — …]`, `[STRUCK 2026-10-16 (coherence fold §…) — …]` (the struck text stays, the bracket says it is struck and why), `[OWNER ROW OD-FC-n — …]`.
- NEVER alter: a law's text, a chair ruling's text, an owner quotation, a commit sha, a test name. Bracket beside them.
- The volume's STATUS HEADER (the top status/progress lines, however they are phrased) gets ONE bracket at its first status sentence: `[CORRECTED 2026-10-16 (coherence fold) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. In one line: <LIT: …> · <BUILT DARK: …> · <UNBUILT: …>]` — fill the one line from your findings §2 table.
- Every WAVE charter in your files gains, at its first line, ONE added line: `[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: <the fast-layer sign a one-month advance shows, or "none — instrumentation"> · TIER: <aspatial-safe | spatial canon | belief infoMode | host flags: …> · DEGRADED ARM: <what the lesser tier shows, or "dark">]` — derive it from your findings §7 (clock and tier) and §8 (felt value). Where the findings give no clock for a wave, write `FIRST-VISIBLE: UNMEASURED` — never guess.
- A requirement-17 Tier line is NOT the spine's requirement-13 Alignment line; do not touch Alignment lines.
- Cite the fold's row ids (§3.1.4, OD-FC-7, …) inside brackets so a reader can walk back.
- Vocabulary (§5): where your file uses a word the register ruled, add the register's bracket at the FIRST use in the file (e.g. after EC's `CONDITION_BANDS`: `[RULED 2026-10-16 (coherence fold §5) — the identifier is MARKET_CONDITION_BANDS; armyStrength.js:133 owns CONDITION_BANDS]`). Do not rename landed code identifiers in prose that quotes code.

## Working method
- Read your base files WHOLE before editing (they are long; read in ranges, all of them).
- Use a script (python or sed with exact-string anchors) for every insertion, anchored on the EXACT current text, and assert each anchor was found once. A silent miss is the failure class that bit this program twice; a missed anchor is reported, never papered over.
- After editing: `diff` base vs destination and confirm the diff is INSERTIONS ONLY (plus the status-header bracket). Count the brackets (`grep -c '2026-10-16 (coherence fold'`).
- Save your worklog to `<kit>/amend/<LANE>.md` as you go: each refinement id → file:line → applied / NOT FOUND (with the search you tried).

## Report (≤300 words + one table)
Outcome first: files amended, bracket counts per file, the diff-is-insertions-only check result (quote the command). The table: refinement id · file · line · applied/not found. Then anything the fold must rule that you could not resolve (a contradiction between the fold and the reader, an anchor that no longer exists). One sentence CONFIRMED vs PLAUSIBLE. Do not restate the findings.
