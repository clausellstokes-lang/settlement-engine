# V-HP-r2 — verify the cures of V-HP-r1 (a focused second pass)

## Read
- `KIT/skeptic/V-HP-r1.md`, WHOLE: 21 findings, V-HP-1 to V-HP-21.
- The cured texts:
  - the reply `KIT/refs/REPLY-TO-THE-MAP-PROGRAM-HOST-PROMPTS-2026-10-24.md`, rewritten whole;
  - the fold copy `KIT/hp/fold/DESIGN_FP_COHERENCE_FOLD.md`, rebuilt by `KIT/hp/fold/amend-fold.py` from master's fold;
  - the grace-rule sweep copies `KIT/hp/vol/DESIGN_FP_ARCH_{CH,MN,PT,BD}.md`, made by `KIT/hp/vol/grace-sweep.py` from `KIT/hp/vol/*-master.md`;
  - the queue section draft `KIT/../close/ODQ-934.99-DRAFT.md`, which is `/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/close/ODQ-934.99-DRAFT.md`.
- Sources, read-only:
  - master's docs: `git -C /home/user/fp-pa show origin/master:<path>`;
  - the kit refs;
  - the code of record, `/home/user/master-code-of-record`.

## Check
1. **Each finding.** For each of V-HP-1 to V-HP-21: is it CURED, PARTLY CURED or NOT CURED? Give a receipt (the cured line, and the source it now agrees with). V-HP-1 to V-HP-6 must be checked against the receipt that convicted them.
2. **New errors.** Did any cure introduce one? Watch especially:
   - S2's raw-links-plus-offer wording against fold §3.1.26 and PL;
   - S3's new lines: the World Clock `canonizedAt` against the spatial canon; the module refusal; `canonized` after the commit and its revocation on undo, against OD-FC-32;
   - S4's version pin against the share-code promise;
   - S5's `partySeats` and "the court of the first", against PT's `whereaboutsOf` shape;
   - S13's registration against fold §3.4 ruling (2);
   - OD-FC-134's appeal to OD-FC-125's reading of record and to PA §1's "A user's later edit to a dossier wins";
   - OD-FC-136's grace-rule clause, which must not be marked THE OWNER'S.
3. **The sweep.** The four volume diffs (`*-master.md` against `DESIGN_FP_ARCH_*.md`) must be wording-only timing changes ("born with the campaign" becoming "adopted at the campaign's first advance"), with no other change.
4. **Style.** No gendered pronoun for the owner or the DM. No model name.

## Rules
Read-only everywhere except your report. Never touch git beyond reading. Never run the test suite.

## Paths
KIT = `/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit`

## Report
- Write the file `KIT/skeptic/V-HP-r2.md`.
- FINAL MESSAGE: at most 200 words plus ONE table, with each finding not fully cured and each new error marked BLOCKING · MAJOR · MINOR. Lead with the counts.
