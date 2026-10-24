# V-HP-r2: the second pass on V-HP-r1's 21 findings

**Read:**
- the reply `KIT/refs/REPLY-TO-THE-MAP-PROGRAM-HOST-PROMPTS-2026-10-24.md` (202 lines, whole);
- the fold copy `KIT/hp/fold/DESIGN_FP_COHERENCE_FOLD.md`, word-diffed against master's fold at `origin/master` `4bc3b63df` (9 hunks). `amend-fold.py` re-run into `scratchpad/vhp2-probe/` reproduces it byte for byte;
- the four sweep copies against `*-master.md`. Each `*-master.md` is byte-equal to `origin/master`, and `grace-sweep.py` re-run in `scratchpad/vhp2-probe/vol/` reproduces all four;
- `close/ODQ-934.99-DRAFT.md`;
- the prompts, HR, PL, PT, PA, ES and RN on master;
- the code of record `/home/user/master-code-of-record` at `81f1cd963`.

**Counts:**
- Findings: 19 CURED · 1 PARTLY CURED · 1 NOT CURED.
- New errors: 0 BLOCKING · 2 MAJOR · 4 MINOR.

**Disclosure:** one probe command ran `grace-sweep.py` against `KIT/hp/vol` itself and rewrote the four `DESIGN_FP_ARCH_*.md` copies. The bytes did not change: the sizes and diff counts were the same before and after, and a clean rebuild in the scratch probe is `cmp`-equal to them. Only the mtimes moved, to 03:02:43.

Keys: `R:n` is a reply line, `F':n` a fold-copy line and `P:n` a prompts line.

## 1. The findings

| # | Verdict | Receipt (the cured line, and the source it now agrees with) |
|---|---|---|
| V-HP-1 | CURED | R:69–71 keeps the raw `PolityLink` rows and puts PL's walk "beside them" as an OFFER the sway MAY adopt. "Inside the host … no host reader re-derives a kingdom" matches F:336 §3.1.26 ("AN ASK, NEVER A SUPERSESSION"; "Inside the host `polityOf` is the one membership read") and PL:128 ("an OFFER, additive beside H13's accepted raw `PolityLink` rows"). F':348 S2 agrees. |
| V-HP-2 | CURED (but see N2) | R:98–100: a law-3 code carries the module's world-generation version, and the bundle freezes what it consumed. Same in F':348 S4. Against P:532–556 and rule 5 (R:45). |
| V-HP-3 | CURED | R:161: SP-9 builds the registry and the docket; "The war volume registers `raid` … at the unit that builds the outcome word". This matches F:596 §3.4 ruling (2), which lights three kinds, and F:506's raid row, owned by the war volume. |
| V-HP-4 | CURED | R:42 quotes OD-FC-125's reading of record verbatim (F':1118) and PA §1's "A user's later edit to a dossier wins" (PA:129, inside §1, 127–166). |
| V-HP-5 | CURED | R:111 says "THE COURT VIEWPOINT IS HELD … `LensFacts.courts` stays absent until a fold row rules it". This matches F:337 §3.1.27 ("never a court's view"). |
| V-HP-6 | CURED | OD-FC-135 now covers H31–H45 only. The grace rule is in OD-FC-136, Ruled "2026-10-24 · by delegation · vetoable" (F':1129). Requirement 17 cites OD-FC-136 (F':125). The ODQ draft (line 61) says "it is not the owner's row". |
| V-HP-7 | CURED | R:17: "`src/` is unchanged … Only dependency, script and lint-test files changed". `git diff --quiet 81f1cd96 origin/master -- src` returns clean. `CLAUDE.md` also changed: a nit, not counted. |
| V-HP-8 | CURED | R:31 matches P:865–866 verbatim. |
| V-HP-9 | CURED | R:74 and F':348: the rows pass "through WY's ONE projection", "whose wire form is H17" (F:337). |
| V-HP-10 | CURED | R:71 and R:73 say the walk is PL-1's export and "H13's other rows … are their owners'". F':348 agrees. |
| V-HP-11 | CURED | R:146 cites §6's PG row (F:977 verbatim) and §3.1.9's ruling (F:319 verbatim). F':348 cites §3.1.9's cure row. The pg-1 bracket is covered by R:29's landed-volume law. |
| V-HP-12 | CURED | R:159 and F':348: "every preset but `static_campaign`". |
| V-HP-13 | CURED | R:170 and F':348 now include H9 (F:979). |
| V-HP-14 | CURED | R:23–27 list all eleven names. All are absent from `src`. |
| V-HP-15 | **NOT CURED · MINOR** | R:11 still reads "The record is on master". Master's fold has no §3.1.38, and its ODQ ends at §934.98. Neither the reply nor the ODQ draft ("the owner's to send") ties the send to the docs PR's merge. |
| V-HP-16 | **PARTLY CURED · MINOR** | Cured: CH ×7, MN ×3, PT ×2, BD ×1 and requirement 17. Missed: RN:458, a consolidated volume under OD-FC-128, still says "H22 canonizes every new map-world campaign at birth". The swept MN copy still says "a canon-born world (H22) runs MN's canon arms from week one" (MN:636), and its heading "The canon-born world." (MN:435). So R:95 S3 (d), OD-FC-136 ("applied in place … CH · MN · PT · BD") and the ODQ draft's site counts and "all cured" overstate. |
| V-HP-17 | CURED | F':486 reads "OD-FC-134 decides an offer the DM confirms, unbuilt". The §2 FAITH row reads "the offer unbuilt". |
| V-HP-18 | CURED (but see N3, N5) | Each step now has a disposition: S2 step 5 (R:75), S5 plural (R:107), S7 (R:123–124), S12 `editLaw` (R:145), S13 step 2 (R:160), S14 (R:168–169) and S15 stamps (R:177). |
| V-HP-19 | CURED (but see N1, N6) | R:84–89 add the two-acts line, the refusal, `canonized` after the commit and its undo revocation in OD-FC-32's form (F:1025, "REVOKES every `consumed`"). |
| V-HP-20 | CURED | R:62 and F':1127: "The card makes the capital the active settlement". This matches `settlementDeityHelpers.js:146–150`, which reads `state.settlement`. |
| V-HP-21 | CURED | F':381: "§934.94, and for (v), §934.99". |

## 2. New errors

- **N1 · MAJOR · THE GRACE DRAG IS LOCKED BY THE WORLD CLOCK THE REPLY KEEPS.**
  - What the cure says: R:84 keeps the realm canonize (`canonizedAt`) before the first advance "as today". R:89 and F':125 say every seat drags free until the first advance and is "free to drag again" after an undo.
  - What the code says: the landed placement move-lock is keyed on `canonizedAt`, not on the spatial canon:
    - `mapSlice.js:486–494` `updatePlacement`: "once the active campaign's world is canonized, placed settlements can no longer be moved";
    - `mapSlice.js:545` `applyAutoplacement`;
    - `PlacementsLayer.jsx:51`.
  - Why it matters: `campaignAdvanceSession.js:692` refuses an uncanonized advance. So the drag window closes at the DM's realm canonize, before the first advance, and an undo of the first advance leaves the lock in place. The prompt's grace drag "writes mapState.placements as today" (P:410), so it goes through the locked writer.
  - Cure: on a module world, re-key the move-lock to the spatial canon (`spatialCanonVersion ≥ 1`) at H22's unit, as a named code change. Otherwise, say that the grace window ends at the realm canonize.
- **N2 · MAJOR · S4's "keeps the share-code promise" is false on its own refusal arm.**
  - The promise: `worldPlan.js:30–34` says "A share code is a world … anyone who holds an old code gets back the world it always named … Law 1 is frozen for life".
  - The conflict: R:99 and F':348 refuse a code whose version the module "can no longer serve". A law-3 code can therefore die, and the bundle freeze (R:100) does not help a share code, which carries only the seed and the law.
  - Cure: ask the map to serve every world-generation version it has issued, for life. Keep the refusal only as the fail-closed arm, and say "never silently rewritten" instead of "kept".
- **N3 · MINOR · "ES §3.3 already carries THE PATROLLED ROAD" (R:168) is false.**
  - Master's `DESIGN_FP_ARCH_ES.md:485` still reads "Two exposure classes".
  - The third class is ruled in the fold's §3.1 INBOX ES (F:353) and lands "in ES's own commit (PR §8.3)".
  - Cure: "ES §3.3 gains it at ES's own commit; no coverage bracket is added".
- **N4 · MINOR · S5's "the court of the first settlement it names" invents a rule PT does not hold.**
  - Where: R:108 and F':348.
  - PT's settlement ids are codepoint-sorted (PT:140 `actAt` "1–2, codepoint-sorted"), so "first" means alphabetical.
  - PT's own pair rule places the party "near both endpoints", and a journey starts "at the nearer one" (PT:79, PT:180). "A journey's ends" (R:107) is not one of PT's cases.
  - Cure: make the observer's pick an ask to PT at its unit.
- **N5 · MINOR · The S2 window key is misstated "as written".**
  - Where: R:75 and F':348 say "the pulse-history sequence, or the advance nonce".
  - The prompt sends `hostSeq` always, and adds `advanceNonce` only when lit (P:311–312; `AdvanceWindow { advanceNonce?; hostSeq; seq }`).
  - Cure: "and, where lit, the advance nonce".
- **N6 · MINOR · The module refusal has no degraded arm.**
  - Where: R:86.
  - "Refuses that advance whole" leaves a module-world campaign unable to advance while the module is absent or refusing. No arm is named, against requirement 17's degraded-arm law.
  - Cure: name the arm, for example a refusal sentence naming the module, or the host's capture until H5.

**Watched and sound:**
- S2's offer against §3.1.26 and PL.
- S3's `canonized`-after-commit line and its revocation against OD-FC-32.
- S13 against §3.4 ruling (2).
- OD-FC-134's appeal to OD-FC-125 and PA §1. Both quotes are verbatim, and a DM's confirm is reading (i)'s user edit.
- OD-FC-136's grace clause is by delegation and is not marked THE OWNER'S.

## 3. The sweep
The four diffs are 6 · 3 · 2 · 1 changed lines (CH:154 holds two sites). They touch only the 13 sites the script names, with no other byte changed. Each change moves the timing from "born with / at creation" to "first advance". Some add a cite, "(H22, THE GRACE RULE)", "fold OD-FC-136" or "as the map amended it", which V-HP-16's cure asked for. The ratchets are CLEAN. The sweep's only defect is its coverage (V-HP-16).

## 4. Style
None of the reply, the ODQ draft, the handoff draft, the fold's added text or either script uses a gendered pronoun or a model name.
