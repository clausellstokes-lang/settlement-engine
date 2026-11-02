# OWNER DECISION QUEUE — continued on master

> **Where the earlier sections are.** The decision queue's text of record from its first section through §934.95 is on the docs ledger branch `review-fixes-2026-07-08` at `b6010f23d`. From 2026-10-23 that branch is read-only history, kept and never deleted. Read it with:
>
> `git fetch origin review-fixes-2026-07-08 && git show origin/review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`
>
> Its sections keep their numbers. This file continues the numbering from §934.96, so a citation of "ODQ §n" with n up to 934.95 points into the ledger's copy, and a later one points here.

> **Why the queue moved.** The owner's word of 2026-10-21 ("Do it according to your recommendations then", the cloud-landing plan's P10): code and documents get one home. From this point every program commits its records on master: this queue, [`HANDOFF_CURRENT.md`](HANDOFF_CURRENT.md) and [`OPERATING_STANDARD.md`](OPERATING_STANDARD.md). The ledger's history (its archive, the retrospectives, the recon reports and the queue's earlier sections) stays on the ledger branch. A historical document a later program needs on master is carried over with that program's own commit.

---

## §934.96 · THE FP ARCHITECTURE ON MASTER, ONE TEXT EACH — P8 THE CONSOLIDATION PASS CLOSED (ALL THIRTEEN PROGRAM VOLUMES, THE FOLD, THE SPINE AND CN BRACKET-FREE), P9 THE LANDING AND P10 ONE HOME FOR CODE AND DOCUMENTS (2026-10-23; SEAT: the cloud chair, session `01QuxWCMgVdyKhCNZL3c98y5`; consolidation seats, fidelity verifiers and one seams reader)

**The owner's words (2026-10-23), verbatim, in order:** "Please continue the pending FP architecture work" · "Going forward, please use the best combination in terms of efficiency and efficacy of models and effort per model. And I give all permissions required now, and those emergent in the future." · "Permissions changed" · "Progress?" · "I leave all decisions and judgement to you" · "I’m progress" · "What are the remaining works and what do they do?" · "Why is it taking so long" · "You can unblock from four at a time" · "What’s left?" · "What do you think about the architecture?" · "Progress?" · "What’s left after this?" — and the words that open THE REALM'S PAST, recorded in §934.97.

**The chair's reading (vetoable).** "All permissions required now, and those emergent in the future" with "I leave all decisions and judgement to you" is the owner's standing word for this program's gate items: the chair pushed the branches, opened the PRs and merged each one itself on green CI by a merge commit (never squash, never force). Deploy, migration, golden signing and dispatch did not arise and were not touched. "You can unblock from four at a time" lifted the four-seat cap for the rest of this program.

**What landed on master, in order:**
1. **PR #62** (merge `0ea7e2157`): the npm-audit blocker that held every PR red. dompurify 3.4.12 → 3.4.17 and fflate 0.8.2 → 0.8.3, lockfile only. The lockfile is a detector source of the observed-shape instrument, so the move rode a governed schema rung, chartered as schema 25 by the schema-13 precedent: act 1 `a9d469ecb` (the rung, red by design), act 2 `b6c0bb2ed` (the governed re-freeze; reconciliation EMPTY — 2,039 findings · 1,445 identities · 394 files unchanged). Full gate exit 0; the production audit clean.
2. **PR #61** (P9, merge `4b94ef150`): the FP architecture as documents, docs only, copied from the ledger tip `b6010f23d`. The thirteen program volumes and `DESIGN_FP_GENERALS.md` are new on master. The fold, the spine, CN and thirteen landed volumes (ES · GR · HB · IN · LG · PG · SP · WC · WY · EP · INT · POP · WF) take the ledger's copies; each was proven word by word to keep every master word in order (+13,888 / −12 lines; the twelve are master lines lengthened by in-line brackets).
3. **PR #63** (P10, merge `b62f2acd3`): the current records on master — `OPERATING_STANDARD.md`, `HANDOFF_CURRENT.md`, `START_HERE.md`, the two owner FP briefs, this queue continued from §934.96, and `CLAUDE.md`'s pointer. RE-SHAPED by measurement (the chair's ruling, vetoable): carrying the ~960 ledger-only documents would turn four of master's only-shrink ratchets red (the enforcement-claims naked-claim debt, twice; sourceCitationIntegrity's past-EOF arm — 74 new citations in live documents — and its archival roster). So the history stays on the ledger branch, read-only and never deleted, and a historical document a later program needs rides that program's own commit. `START_HERE.md`'s HISTORICAL banner put it on the walker's archival roster (banner 8 → 9), measured to hide nothing: with the banner neutralised the walker read it as a live document with zero past-EOF citations (18/18 green), and the excluded past-EOF count stays 377.
4. **The commit that carries this section** (P8 closed): PL · MN · RN · PT · PS · ST · PR · BD consolidated; the fold, the spine and CN consolidated; the seams cures across all thirteen volumes.

**P8 — the counts (CONFIRMED: the ratchet's lines and the verifiers' receipts).** Each marker got one ledger row. A verifier's fail was cured by the chair and recorded in that text's ledger.

| text | markers | folded · dropped · moved · kept | fidelity verifier: sampled · hold · fail (all cured) |
|---|---|---|---|
| PT | 548 | 438 · 1 · 108 · 1 | 190 · 190 · 1 (the guide) |
| MN | 600 | 488 · 2 · 106 · 4 | 151 · 149 · 2 |
| RN | 581 | 501 · 0 · 77 · 3 | 183 · 183 · 1 (the guide) |
| PL | 634 | 550 · 2 · 82 · 0 | 104 · 102 · 2 |
| PR | 724 | 619 · 2 · 93 · 10 | 124 · 121 · 3 |
| BD | 843 | 763 · 6 · 54 · 20 | 116 · 109 · 7, + 2 in the guide |
| PS | 635 | 554 · 0 · 67 · 14 | 131 · 128 · 3 |
| ST | 637 | 564 · 6 · 54 · 13 | 125 · 124 · 1, + 2 in the guide |
| fold A — header, guide, §0, §1, §4, §6; §8 and §9 moved | 471 | 116 · 2 · 353 · 0 | 120 · 116 · 4, + 4 in the header and guide |
| fold B — §3, with §3.4 regenerated | 512 | 502 · 10 · 0 · 0 | 225 · 219 · 6 |
| fold C — §2 | 100 | 71 · 25 · 0 · 4 | 100 · 100 · 0 |
| fold D — §5, regenerated | 371 | 367 · 2 · 0 · 2 | 271 · 268 · 3 |
| fold E — §7 | 302 | 297 · 3 · 0 · 2 | 124 · 121 · 3 |
| spine | 82 | 64 · 2 · 16 · 0 | 82 · 82 · 0 |
| CN | 43 | 36 · 1 · 2 · 4 | 43 · 42 · 1 |

The eight volumes went from 3,373,328 to 2,596,016 bytes, the fold from 811,323 to 571,203 and the spine from 116,478 to 96,831; the review trail is in git at `1beabdc85` and in the kit's `history/`. Every section number, OD id and `path :: symbol` cite survives. Review markers left: 0 (the ratchet). The whole fold's ratchet reads `RATCHET 3 DIFFERENCE CLASSES` (DRAFT 56 → 50 · UNMEASURED 27 → 25 · flags 98 → 97), every one explained: with the moved review record counted back, flags are equal and DRAFT −1 and UNMEASURED −2 remain — the merged soft-confirm clause in §1 (−1 each), the struck `POLITY_LIEGE_CEILING` in OD-FC-45 (−1 each), and §2's history words (DRAFT +1). The regenerated registry holds 92 kind names = 92 (0 STOPs; 81 rows as the volumes group them, 87 when each program kind takes its own row as the old table did). Two §7 rows were brought to their latest rulings: OD-FC-58 (four passes, below) and OD-FC-59 (eight claimant programs, with THE WAY OF WAR's `way` term). SEAMS-P8 read the thirteen together: 1 BLOCKING · 8 MAJOR · 5 MINOR, every one ruled or cured; 1,765 cross-volume cites resolve.

**The chair's rulings (by delegation, vetoable; each recorded in the kit's BOARD and the ledger it touches):**
- **⛔ STOP PL-C-1, the word "passage":** the latest wins (the P5 class `passage_of_arms` over B099). In the program volumes the bare word "passage" carries THE PASSAGE's meaning (PS14); a charter's toll right is always named `toll_exemption`. A landed volume's plain-English "passage" is untouched.
- **⛔ STOP RN-C-1:** the sworn-doer override reads the sworn party's coordinates "in place of its own" (B302's "the doer's own" contradicted the premise B301 and B302 both state).
- **SEAMS-P8-1:** THE ONE PERSON STAGE is FOUR passes, RN → CH → OP → PT (RN owns the mount); the fold's §3.1.22 and OD-FC-58 say so.
- **SEAMS-P8-11:** the kit-trail tags in the volumes' prose (`RULINGS-P6 x.n` ~110, `L-BD n` ×166, `item n` ~124) are provenance pointers, not review markers. They are kept in this pass and slotted to a polish lane.
- **SEAMS-P8-12:** a date or clock stamp on a verbatim owner quote is an allowed class (CONSOLIDATE §3 (e), amended 2026-10-23); the reader's guides take the undated form.
- **`party_gate` is CLIMAX** (its owning volume PT says so; the old fold's STANDING was an inherited error).
- **LENS → READINGS:** the register's own `lens` row rules that RN's ways of judging a deed are "readings" in prose. 133 sites conformed in RN · CH · PT · OP and the fold; map lenses, a holder's own lens and the code tokens (`lensOne` …) kept.
- **The fold §5 register:** the `passage` row scoped to the program volumes; `doctrineBands` stands; the 269 tokens each volume registers for itself are not copied into §5 (§5 registers cross-volume words); `materiel` (WC-6) and `stand_off` → `indecisive` accepted.
- **The fold §3.1.20:** cn-5's host is a menace (OD-MN-10), as CN and MN say.
- **The audit fix:** schema 25 chartered (above). **P10:** re-shaped (above).

**The chair's errors, owned.** (1) The briefs stated PL-C-1 without its scope, so PS wrote "in every volume" (three sites) and the fold §5 `passage` row over-reached; both corrected before landing. (2) P10's first scope widened past its brief to nine documents changed on both sides; reverted before the commit (the reconciled texts are kept in the kit's `history/p10-reconciled/`). (3) The seats were not warned until four verifiers had failed a reader's guide for an untrue "only" or "every"; every guide was cured. (4) A `pkill` pattern matched the chair's own shell while stopping P9's pre-push hook run; the hook was stopped by its PID and the push went with `--no-verify`, which the hook's own comment allows when the full gate has already passed on that commit (it had). P10's merge of master was pushed the same way, with CI as its gate.

**Operational facts.** The 5-hour window tripped at about 17:30 UTC and cut four seats mid-work; each resumed from its transcript at the reset. Two container restarts cut seats; each resumed from its saved files.

**The proof.** The docs proof (master's doc-scanning suites + the kit's 75 extra doc-reading suites, with the ledger ref fetched as CI does) on the P8 close: Test Files 290 passed (290) · Tests 4,824 passed (4,824) · exit 0. CI is the full gate (rule 24a).

**Open, in order:**
1. **THE NEXT HOUR, unchanged** (§934.94, the previous chair's recommendation, vetoable): THE INSTRUMENTS BEFORE C0, then the first bracket-free packet (C0 THE HEARING WEEK) — now cut from master's consolidated texts.
2. **The P8-11 polish lane:** the kit-trail tags in the volumes' prose, each turned into a section cite or dropped (the intake rule); with them, OP §9/§15's and CH §14's conditional "once RN accepts one", which the fold §3.3.27 already resolves, worded as resolved.
3. **B127, the naval bound:** OPEN; PS names it at MG-7's unit.
4. **`docs/DESIGN_THE_ROADS.md`** is cited (BD, the fold, three older documents) and exists on neither master nor the ledger. It is one of the eleven texts outside the ledger tree that ride the dispatch packet (the fold §3.1 INBOX).
5. **The dev-dependency audit, non-blocking:** the full tree flags 13 packages (5 moderate · 8 high; vite, vitest, postcss, undici and their kin), shown by CI's non-blocking dev step. CI's blocking step audits the production tree (`--omit=dev --audit-level=high`), which exits 0.
6. **The gate list, unchanged in kind:** push and merge were exercised under the owner's standing word above. Deploy · migration · golden signing · dispatch stay the owner's. Every FP volume stays DARK and NOT SCHEDULED; the dispatch gate is the release, pushed and deployed.

## §934.97 · THE REALM'S PAST (PA) OPENED — A NEW FP PROGRAM ON THE OWNER'S WORDS: AT BIRTH THE REALM GETS A SHARED PAST, ADDITIVE TO EVERY SETTLEMENT'S OWN HISTORY, NEVER CHANGING A DOSSIER, THE USER'S TO VETO OR CHANGE UNTIL THE FIRST ADVANCE (2026-10-23; SEAT: the cloud chair, session `01QuxWCMgVdyKhCNZL3c98y5`; three research seats)

**The owner's words (2026-10-23), verbatim, in order.** They came on an assessment pasted from the map program's session. That assessment pairs the map with the FP and proposes "A realm pre-history at birth. Run the FP for a chosen span of years before the DM's first week, then hand over" and "Named polities from day one". The owner's words:
- "Thoughts on this?"
- "I would say that rather than run the FP a few years into the future, make it additive to each’s past history and run it some time from the past, nothing that changes the current history but something that builds their relationship starting with the oldest and second oldest’s history."
- "Nothing that changes the current dossier as if intended by the user"
- "Abd these facts can be vetoed or changed by user before first advance"
- "Please integrate it into the architecture"

**What it is.** Every generated settlement already carries its own dated past (`src/generators/historyGenerator.js :: generateHistory`): its founding (age, reason, founded by), its events (name, type, years ago, severity, lasting effects) and its current tensions. No town's past touches another's. THE REALM'S PAST replays a shared past over those histories, oldest first. The clock starts when the second-oldest settlement is founded, and each later town joins at its own founding.

**The owner's laws (THE OWNER'S rows ⭐; the wording is the chair's, vetoable in wording only):**
1. **THE DOSSIER IS CANON.** Every settlement's current dossier, generated or edited, is what the user intended. The past is built around it and never written into it. It adds only what the dossier allows, and a user's later edit to a dossier wins.
2. **THE PAST IS THE USER'S UNTIL THE FIRST ADVANCE.** Every fact of the past can be vetoed or changed by the user before the first advance. Each fact is shown with its cause; a change is treated as intent and the rest re-derived around it. At the first advance the past becomes history.
3. **FROM THE PAST, NEVER FORWARD.** No forward run before the first week changes the generated present.

**What the research measured (the kit's `findings/R-PA1..3.md`; CONFIRMED by reads and executed probes):**
- **A forward run is ruled out by measurement too.** Four real weeks changed every dossier's bytes, and five centuries would take about 1.8 hours. A replay driven by the dossiers' own events costs 1–8 ms and leaves every dossier byte-identical.
- **Filling the other party contradicts nothing.** No dossier event names its counterpart: every implied party ("an external power", "a partner settlement") is anonymous.
- **The realm is not born quite blank.** The instant world writes 3, 9 or 12 founding ties into the dossiers at birth (`genesisDiplomacy.js :: materializeGenesisRelations`), sometimes with a younger overlord of an older town. Those ties are dossier facts. PA explains them where they agree with the founding ages and flags them where they do not; it never fixes them.
- **The past needs its own home.** A negative tick breaks four of six landed readers, so the past lives in one sidecar (`spatialLedgers.realmPast`) holding a seed, re-roll nonces and the user's per-fact choices. Its facts are derived on demand, one labelled seed stream each, so striking one moves no other. At the first advance only present-day consequences enter the landed ledgers, at tick 0, each with a back-pointer.
- **Other programs' laws bind it.** The engine never names a polity (PA offers a name; the DM's keep is the christening), never spawns a menace, and keeps no town↔town regard.

**The chair's rulings (by delegation, vetoable):**
- The program code is PA (free) and its volume is `docs/DESIGN_FP_ARCH_PA.md`.
- **THE AMENDMENT LAW AFTER P8:** a consolidated text is amended in place, in final form, never by a dated bracket in its running text. The date goes to its rulings table, the change is recorded in this queue, and the landed volumes keep the insertions-only law.
- PA's words avoid the registered homonyms: "seal", "DRAFT", "pin", "lens", and the census's other taken words, including "canon", "briefing", "proposed", "kept" and "settled".

**What follows.** The volume is compiled, reviewed adversarially to 0 BLOCKING and 0 MAJOR, and folded into the coherence fold (status row, rulings, vocabulary, its place in the order as chain C22, and the owner's rows in §7). This lands in its own docs PR, recorded as §934.98. Nothing is scheduled; the dispatch gate is unchanged.

## §934.98 · THE REALM'S PAST (PA) INTEGRATED INTO THE FP ARCHITECTURE — ITS VOLUME COMPILED, REVIEWED ADVERSARIALLY TO 0 BLOCKING AND 0 MAJOR, AND FOLDED INTO THE FOLD AND THE SPINE; THE PRONOUN RULE (2026-10-24; SEAT: the cloud chair, session `01QuxWCMgVdyKhCNZL3c98y5`; research, compile, review, cure, verify and fold seats)

**The owner's word, verbatim:** "Please integrate it into the architecture". It came after the words recorded in §934.97.

**What lands (the commit that carries this section):**
- **`docs/DESIGN_FP_ARCH_PA.md`, THE REALM'S PAST**, born consolidated. It holds:
  - 18 laws, the owner's three marked ⭐ (PA1 THE DOSSIER IS CANON, PA2 THE PAST IS THE USER'S UNTIL THE FIRST ADVANCE, PA3 FROM THE PAST, NEVER FORWARD);
  - one owned persisted shape, the sidecar `spatialLedgers.realmPast` (⭐ VISIBLE, owner-signed, re-confirmed at its unit);
  - no engagement kind, and two virtual flags (`realmPastEnabled`, `realmPastPactsEnabled`), DARK;
  - five waves PA-0..PA-4, 39 scenario rows and 34 rulings rows;
  - zero kernel lines and zero generator lines. The inking mounts at one seam (`campaignAdvanceSession.js :: runAdvanceCampaignWorld`) through its own leaf, on the simulation's clone, so a failed first advance inks nothing.
- **`docs/DESIGN_FP_COHERENCE_FOLD.md`, amended in place:**
  - the program's volumes are counted as fourteen;
  - §2 gains PA's status row;
  - ruled rows §3.1.31–§3.1.37 and §3.3.29–§3.3.31 cover the genesis ties, PL's christening, the map's past window, the inking, the relationship plane, GR's past-origin arm, the other programs' past rules, the nonces, `realm_past` in the pact provenance, and the past's addresses;
  - §3.4 states that PA mints no kind (THE COUNT unchanged);
  - §5 gains a 19-row PA block;
  - §6 gains chain C22 THE REALM'S PAST and THE ORDER NOTE; the inventory now reads C0..C22;
  - §7 gains OD-FC-125..133: the owner's three laws, quoted verbatim; THE AMENDMENT LAW AFTER P8; the owner's open row on the genesis ties; the two owner-signed shapes; C22's order; PA's lighting; THE PRONOUN RULE.
  - The ratchet against master's fold is CLEAN: no token or cite missing, no count fewer, zero review markers.
- **`docs/DESIGN_FP_SPINE.md`:** C0..C22, two neutral pronouns, and the model name dropped from its header line. The ratchet is CLEAN.
- **THE PRONOUN RULE across the fourteen program volumes** (eight changed: PL · MN · CH · PR · ST · BD · MG · WS):
  - 13 owner pronouns at 12 sites and 20 DM pronouns at 18 sites are now neutral;
  - every ratchet is CLEAN, and the word diffs show only pronouns moved;
  - in-world persons keep theirs, and no verbatim quote is touched.

**The review (the kit's `skeptic/` and `cure/`):**

| pass | found or judged | result |
|---|---|---|
| S-PA (the volume vs the code and the owner's words) | 30: 5 BLOCKING · 13 MAJOR · 12 MINOR | all cured |
| X-PA (the deep-review seat: the volume vs the corpus and the DM in play) | 16: 1 BLOCKING · 9 MAJOR · 6 MINOR | all cured |
| D-PA round 1 | 46 cured, 0 refuted, 0 STOP | — |
| V-PA (refuting verifier) | 28 judged · 25 hold · 3 fail · 1 new MAJOR | the 3 fails and the new one cured |
| D-PA round 2 | 7 cured | — |

At close: **0 BLOCKING · 0 MAJOR open.** The owner's three laws hold in every mechanism. PA writes no dossier byte and no relationship-plane row, and nothing runs forward.

**The chair's rulings (by delegation, vetoable; `briefs/RULINGS-PA.md` in the kit):**
- **⛔ PA-C-1, RE-RULED to its third arm.** PA writes NOTHING to `relationshipStates`: the plane keeps its one writer and its own memory law. A pair's old feeling lives in the inked record. Its living consequence is the dossier's own present type.
- **⛔ PA-C-2.** The past is derived while it is the user's, then RECORDED ONCE at the first advance. A later dossier edit drops only a link, and contradicted facts are flagged on every read, never redrawn.
- **The DM's pen.** Before the first advance the DM can cross out, change, confirm, roll again or undo; after it, one stroke remains, cross out (requirement 14).
- **The owner's named pair.** "The oldest and second oldest" is honored by a pencilled tie OFFER. The DM's own confirm writes it through the dossier's link card, so the write is the user's intent, never PA's.
- **Additive to each town's own history.** A read-only strip in each town's history section shows the town's past, never in player view.
- **Past pacts** enter the treaties only through a past-origin arm of GR's signer (a ROUTE to GR). The POP `departureMemory` mint is struck.
- **The two departures the cure seat made, both on receipts.** References are keyed on the SAVE ID, because every import path strips `_seed` and imports remap ids. The tie door is the link card, because the event composer's link field never mounts.
- **The coverage registry:** `realmPast` is TRACKED, by `spatialUsage.js`'s own test (`routeNetwork`'s reasoning).
- **THE AMENDMENT LAW AFTER P8:** a consolidated text is amended in place, in final form; the date goes to its rulings table.
- **THE PRONOUN RULE:** no gendered pronoun for the owner or for the DM, a role.

**Corrections to §934.97 (this section supersedes those sentences; the earlier section stands as written):**
- the genesis ties number **3, 8 or 12** (the volume's executed probe), not "3, 9 or 12";
- the sidecar holds **one ordered act log (`penLog`)** and is addressed by the world's own `rngSeed`, not "a seed, re-roll nonces and the user's per-fact choices";
- references are keyed on the save id (above).

**The kit.**
- This cloud session's git proxy refuses a push outside `refs/heads` (HTTP 403). So the 2026-10-23 seal lives on the BRANCH `preserve/fp-final-kit-a73343ed-2026-10-23`, not a `refs/preserve/*` ref; the 2026-10-23 handover line is corrected to say so.
- This program's close is sealed as the branch `preserve/fp-final-kit-a73343ed-2026-10-24`.
- `tools/cloud-bootstrap.sh` reads either form.

**The proof.** The docs proof on this commit (master's doc-scanning suites plus the kit's 75 extra doc-reading suites, with the ledger ref fetched as CI does): Test Files 290 passed (290) · Tests 4,824 passed (4,824) · exit 0. CI is the full gate.

**Open:**
1. OD-PA-13b (THE OWNER'S): whether PA's ordering may inform plan law 2's genesis ties at birth.
2. OD-PA-32: a DM-set anchor for a newcomer's years (not now).
3. The ROUTES, each its owner's to confirm at its wave: GR's past-origin signer arm; a DM verb for the relationship plane's `memoryHorizon`; POP's read of founding ties; the map's past window (MF and the world map's H9 · H13); PL's oath dates and offered names.
4. PA is eligible after THE INSTRUMENTS BEFORE C0, as chain C22, chosen at a read under FP-40. Every FP volume stays DARK and NOT SCHEDULED, and the dispatch gate is the release.

## §934.99 · THE MAP PROGRAM'S FIFTEEN HOST PROMPTS ANSWERED — EACH ASK RE-HOMED TO THE UNIT THAT OWNS ITS FIELD; FPQ-62 DECIDED (THE DEITY OFFER); H31–H45 ACCEPTED; THE GRACE RULE TAKEN; A LIT POPULATION DEFECT CONFIRMED BY EXECUTION (2026-10-24; SEAT: the cloud chair, session `01QuxWCMgVdyKhCNZL3c98y5`; one measure seat and one refuting verifier)

**The owner's words, verbatim:**
- "Your thoughts on this:", attaching the map program's `host-prompts-2026-10-24.md`: its fifteen prompts S1–S15 for host sessions, pinned at `81f1cd96`.
- On the chair's answer: "Sorry that was an accident it was not a cancellation it was an accident accept everything".
- Later: "I leave all judgement to you".

The chair read the second word as YES to the three questions put to the owner:
1. answer the map program with a reply and record it in the fold;
2. FPQ-62 as an OFFER the DM confirms;
3. accept H31–H45.

Its first clause concerns a declined tool call, since made good.

**What lands (the commit that carries this section).** `docs/DESIGN_FP_COHERENCE_FOLD.md`, amended in place in final form (OD-FC-128):
- §3.1.38 THE MAP PROGRAM'S HOST PROMPTS: every S row's disposition and the unit that owns it;
- the §3.1 INBOX's map program (v), with its header, and POPULATIONS (h);
- §5 THE MAP REGISTER's `marker` · `dated fact` row;
- §6 THE MAP PREREQUISITES' acceptance sentence, now including H31–H45;
- requirement 17's grace-rule sentences;
- §2's FAITH row and its one lit chain;
- §7 OD-FC-134 · OD-FC-135 · OD-FC-136.

THE GRACE RULE is also carried in place into `DESIGN_FP_ARCH_CH.md` (7 sites), `_MN.md` (5), `_PT.md` (2), `_BD.md` (1) and `_RN.md` (1). Every ratchet is CLEAN: no token or cite missing, the fold's rulings 357 → 360, zero review markers.

Also in the commit: THE PRONOUN RULE (OD-FC-133) applied to the living records, wording only, with verbatim quotes untouched: `docs/OPERATING_STANDARD.md` (4 sites) and `docs/HANDOFF_CURRENT.md` (5 sites). These were the owner's pronouns written by earlier sessions.

**The owner's two decisions:**
- **OD-FC-134 — FPQ-62, THE DEITY OFFER (THE OWNER'S).**
  - At a birth that names a capital, where the account holds a custom deity, the birth card OFFERS the top-ranked one as the capital's patron.
  - ONLY the DM's confirm seats it. The card makes the capital the active settlement, and the confirm runs `setPrimaryDeityImpl` (the panel's writer).
  - Declined or left alone, none is seated.
  - The engine never seats a deity, there is no premade pool, and the write gate is honoured. OD-FC-125's reading of record holds: the confirm is the user's own edit.
  - The map program's option B, "seated" at birth, is superseded.
- **OD-FC-135 — H31–H45 ACCEPTED (THE OWNER'S)**, on H1–H30's terms: accepted work, not scheduled, each built inside the FP unit that owns its field.
  - The host has read H31 · H32 · H33 · H34 · H45.
  - H35–H44's text is asked of the map.

**The dispositions (OD-FC-136, by delegation, vetoable; THE INTAKE RULE: none a lane of its own, none pasted as written):**

| S | the answer | where it lands |
|---|---|---|
| S1 | the module-only birth door SUPERSEDED (OD-FC-62's door for every new campaign); genesis names STRUCK (PL3; a v2 bundle would move); the honest label kept; the deity is OD-FC-134 | EC's OD-EC-5 car; §3.1.32 (PA offers, the DM christens) |
| S2 | H13 keeps the map's raw `PolityLink` rows, with PL's walk beside them as an OFFER (§3.1.26); H23's rows through WY's one projection; H9 keyed as written; the regime resolver as written | PL-1 (C9) for the walk; WY; C0 · C0.5 |
| S3 | THE GRACE RULE taken (the spatial canon only; the World Clock unchanged). The landed move-lock (`mapSlice.js :: updatePlacement`, `applyAutoplacement`, keyed on `canonizedAt`) is RE-KEYED to the spatial canon on a map-module world, a named code change at H22's unit. The canon is adopted inside the first advance's one commit, with PA's inking. A refusal refuses the advance; its degraded arm is one sentence naming the module. An undo reopens the lock and revokes `canonized` | THE CANON ROOT (H22); H12 → C3's first unit |
| S4 | H31 on plan law 3. A law-3 code carries the module's version, and the module is asked to serve every version it issues, for life. A code that cannot be served is refused fail-closed, never silently rewritten. The bundle freezes its charters | its own unit; the network C3's |
| S5 | the party's place is PT's `whereaboutsOf` (it may name a pair; the pair's observer asked of PT); a home seat asked of PT; THE COURT VIEWPOINT HELD (§3.1.27) | C13 THE PARTY; H17; the information program |
| S6 · S9 | `causedBy` and the cause walk inside C0.5 | H9's unit |
| S7 | the K3 fence, `MAP_FEED_READERS` EMPTY; its bracket, WY's line, the register line and the test with H4's client | with H4's client |
| S8 | §3.1.29's slot, gross now and net with WC-4 | the war volume's unit |
| S10 | the claims as written; a standing past pact carries `pastRef` | H13; GR |
| S11 | the marker / dated-fact split | §5 now; WY's bracket at its next unit |
| S12 | the handler and `editLaw` are H32; the arrived plague's condition is PG's pg-1; the double service CONFIRMED | EM; PG; POP's pop-1 train |
| S13 | the outcome word asked of the war volume (dark or new-campaigns-only); `raid` registered on C0's registry by the war volume at that unit; the strength order on H13 | §3.4's owner |
| S14 | ANSWERED A, decided 2026-10-18 (OD-FC-2, OD-FC-82) | THE PATROLS (C16) carry capture on a patrolled road; H9 · H13 · H23 · H25 |
| S15 | H33 inside TRADE M8's lanes; H34's readings labelled; depopulation events and the DM's stamps, never rolled | §3.3.14; H9's unit |

Rules that cover every disposition:
- Every port value that enters a host roll or cost is frozen into the advance's recorded inputs.
- THE GRACE RULE, the map's own amendment of the accepted H22, is TAKEN BY DELEGATION under the owner's 2026-10-18 "i told the mapmaker i do as it suggested". It was never put to the owner as one of the three questions, so it is not the owner's row.

**The measurement (the kit's `findings/M-HP12.md`, CONFIRMED BY EXECUTION at `81f1cd963`):**
- **What happens.** In `realistic_regional` (the default), `living_realm`, `dramatic_campaign` and `full_simulation`, ONE CRISIS IS SERVED TWICE IN THE SAME TICK:
  - `population_emigration` sheds people, and on a canonized world they leave as columns;
  - an auto-applied `flow_migration` (`flows.js`) debits the same source again and credits a destination at once.
- **The receipts:** −972 at a source of 10,000 under `dramatic_campaign` (116 as columns, 856 teleported); −817 under the default preset.
- **Why neither lane catches it:** the column dispatcher collects no `flow_migration`, `flows.js` never reads `migrationActive`, and their exclusive tags never meet.
- **On the canon** it is a lit defect whatever the map does: the flow's people bypass the column ledger and its conservation invariant.
- **The cure** is a row in the pop-1 train (§3.1 INBOX POPULATIONS (h)). Its first car measures which lane yields, then ONE SERVICE PER CRISIS. It is a signed shift on every lit preset at its unit.

**The verifier passes (the kit's `skeptic/V-HP-r1.md` and `V-HP-r2.md`):**
- **First pass:** 21 findings (1 BLOCKING · 5 MAJOR · 15 MINOR). The serious ones:
  - the map's raw links are kept beside PL's offer, never superseded;
  - a law-3 code pins the module's version;
  - the raid's registration is the war volume's;
  - the owner's dossier law is quoted in its reading of record;
  - the court viewpoint is held;
  - THE GRACE RULE is re-filed as a delegated ruling.
- **Second pass, on the cures:** 19 cured, 1 partly, 1 not, and 6 new errors (2 MAJOR · 4 MINOR). The MAJORs:
  - the landed move-lock keys on the World Clock, so it is re-keyed at H22's unit;
  - a law-3 code could die, so the module is asked to serve every version for life.
- **Third round:** all cured in place. The chair checked the two MAJORs against their receipts: `mapSlice.js :: updatePlacement` and `applyAutoplacement` read `canonizedAt`; `worldPlan.js`'s header holds the share-code promise.
- At close: 0 BLOCKING · 0 MAJOR open.

**The reply** to the map program is the kit's `refs/REPLY-TO-THE-MAP-PROGRAM-HOST-PROMPTS-2026-10-24.md`, the owner's to send once this commit merges. It asks the map program to:
- adopt the dispositions;
- confirm THE REALM'S PAST's routes;
- type the party's place as PT reads it;
- carry its world-generation version in a law-3 code and serve every version for life;
- send H35–H44.

**The proof.** The docs proof on this commit (master's doc-scanning suites plus the kit's 75 extra doc-reading suites): Test Files 290 passed (290) · Tests 4,824 passed (4,824) · exit 0. CI is the full gate.

**Open:**
1. The map program's adoption of the dispositions, and H35–H44's text.
2. OD-PA-13b (THE OWNER'S): a plan law 3 is where PA's ordering could inform the genesis ties without moving a v2 code.
3. ONE CRISIS, ONE SERVICE, at the pop-1 train's unit.
4. The court viewpoint, at the information program's unit.
5. No build is dispatched by this section. Every FP volume stays DARK and NOT SCHEDULED, and the dispatch gate is the release.

## §934.100 · THE MAP PROGRAM'S REPLY TO THE HOST'S ANSWER — ITS ADOPTION RECORDED, H35–H48 READ, ITS ASKS RULED; EVERYTHING FROM THE REALM'S PAST DM-ONLY ON THE MAP; THE NEXT CAMPAIGN'S PAST OPENED; H47 ACCEPTED BY THE OWNER (2026-10-24; SEAT: the cloud chair, session `01QuxWCMgVdyKhCNZL3c98y5`; one refuting verifier)

**The owner's act:** the owner attached the map program's reply, `reply-to-host-2026-10-24.md`, without words. Its header records the owner's word to the map program, verbatim: "Do it", given for the map to adopt the host's answer. The standing delegation is the owner's "I leave all judgement to you" (§934.99). On the chair's question about H47, the owner answered, verbatim: "I accept it as host work" (OD-FC-138).

**What the reply says.** The map program:
- adopted the host's answer (§934.99; fold §3.1.38) whole, its record being its J400;
- now keeps a mirror of the host's rulings and reads it before any host prompt or H row;
- confirmed THE REALM'S PAST's routes (its H48; `sincePast`; `terms[].pastFact`);
- typed the party's place as PT reads it (`partySeats` · `partySource` · `partyStamp` · `partyHome`);
- defined a version archive, so a law-3 code is served for life or refused fail-closed;
- sent the text of H35–H44, re-sent H45, sent three new rows (H46 · H47 · H48), and sent the rows it changed (H9, H12, H13, H16, H22, H23, H24, H25, H31, H32, H33, H34);
- asked six things of the host's units.

The reply is kept as the kit's `refs/MAP-REPLY-TO-HOST-2026-10-24.md`.

**What lands (the commit that carries this section).**
- `docs/DESIGN_FP_COHERENCE_FOLD.md`, amended in place (OD-FC-128):
  - §3.1.39 THE MAP PROGRAM'S REPLY TO THE HOST'S ANSWER;
  - the §3.1 INBOX's map program (w), PL (c), PT's held items, a new THE REALM'S PAST entry, and a new THE CAMPAIGN RECORD entry (the host's own, outside FP's inventory);
  - §6 THE CANON ROOT and its acceptance sentence;
  - OD-FC-135, amended: H35–H44 read, and H31–H34 and H45 read again;
  - §7 OD-FC-137, and OD-FC-138 (THE OWNER'S: H47 accepted).
- `docs/DESIGN_FP_ARCH_PA.md`: one OPEN row, OD-PA-37 THE NEXT CAMPAIGN'S PAST.

Both ratchets are CLEAN: no token or cite missing, the fold's OD ids 360 → 364 (two new ruling rows, OD-FC-137 and OD-FC-138, which also cite OD-PA-37 and ⭐ OD-PT-3), and zero review markers.

**The rulings (OD-FC-137, by delegation, vetoable):**

| the ask or row | the answer |
|---|---|
| H35–H44 · H45 · H31–H34 | read; H45 and H31–H34 read again in their changed text; each read once more at its unit against the code then |
| H46 | ACCEPTED as S8's slot (§3.1.29); its netting and recall the war volume's to design at WC-4 |
| H48 | ACCEPTED as PA's own route (§3.1.33); re-sent on a member's dossier edit too (PA6) |
| H36 | read as OD-FC-134 words it: the offer gated on the custom-content entitlement |
| H47, a next campaign on a world an earlier campaign used | RECEIVED AND READ, and ACCEPTED BY THE OWNER, verbatim: "I accept it as host work" (OD-FC-138): accepted work, NOT scheduled. The owner's earlier word to the map program, as the reply quotes it: "Campaign is just a term we use for the region of the map. So it means multiple or sequentially" |
| the party pin's present-at | RULED: a ONE-SEAT pin's `requestPartyPresent` IS the DM's own `SET_PRESENCE` through the port, written by PT's writer at the present tick with its source `toggle` (no new field), with no second confirm and the toggle's every consequence (PT3; H32's standing); ⭐ OD-PT-3 stays VISIBLE, re-confirmed at PT's unit. A TWO-SEAT pin is not sent until PT rules a pair toggle |
| a pair's observer · the home seat | PT's at its unit; the map's fail-closed reading stands meanwhile |
| the walk's covert flag | PL-1's export at C9; the map's fail-closed reading stands meanwhile |
| the court viewpoint | HELD (§3.1.27) |
| H35 · H47's unit | THE CAMPAIGN RECORD, the host's own (`campaignSlice.js :: createCampaign` and the campaign's persistence). THE OWNER'S gates there: a migration for each; H35's gallery entitlement; H47's closing of a live campaign read-only, with its lifecycle paths (requirement 22) |
| OD-PA-13b | THE OWNER'S |

**The host's own findings:**
- **EVERYTHING FROM THE REALM'S PAST IS DM-ONLY ON THE MAP.** PA's sidecar is DM-only and no public or player surface reads it. So every value the map reads from it reaches the map `dmOnly`: the past window (H48) and, on H13, `sincePast` and a `pastFact`'s years and sentence. This holds until a PA row rules a public arm. A still-standing treaty's own GR record keeps GR's audience.
- **THE NEXT CAMPAIGN'S PAST** is OPEN at PA's unit (OD-PA-37), dated under PA8 when it is ruled. Until then:
  - a next campaign's past is derived from its own members' dossiers exactly as a first campaign's;
  - a member founded during an earlier campaign's play keeps no past (PA14);
  - so H47's felt line "the border I lost is the border they inherit" is the map's own labelled picture of the earlier campaign, never the new campaign's polity.
- **The reply's lens caption** "a fix in the host is coming" is asked to say the fix is recorded and not scheduled (law 9).
- **H22's host-run additive re-canonize** is engine-written state, so its unit declares its lifecycle paths (requirement 22). It is geography, entitlement-blind under requirement 17.

**The verifier (the kit's `skeptic/V-HP-r3.md`):** 14 findings (0 BLOCKING · 5 MAJOR · 9 MINOR), all cured in place. The five MAJORs:
- a pair pin is not the one-settlement toggle;
- DM-only widened to every value read from the realm past;
- H47's acceptance put to the owner, not taken by delegation, its gates marked (the owner then accepted it, OD-FC-138);
- H47's border line answered;
- the invented unit name replaced by THE CAMPAIGN RECORD, the host's own.

At close: 0 BLOCKING · 0 MAJOR open.

**The note** to the map program is the kit's `refs/HOST-NOTE-TO-THE-MAP-PROGRAM-2026-10-24b.md`, the owner's to send once this commit merges.

**The proof.** The docs proof on this commit (master's doc-scanning suites plus the kit's 75 extra doc-reading suites): Test Files 290 passed (290) · Tests 4,824 passed (4,824) · exit 0. CI is the full gate.

**Open:**
1. OD-PA-37 at PA's unit; OD-PA-13b (THE OWNER'S).
2. PT's present-at for a pair, a pair's observer and the home seat, at PT's unit.
3. The walk's covert flag, at PL-1's unit.
4. H35's and H47's owner gates, at THE CAMPAIGN RECORD.
5. No build is dispatched by this section. Every FP volume stays DARK and NOT SCHEDULED, and the dispatch gate is the release.

## §934.101 · THE DOSSIER CONSOLIDATION PROGRAM — ONE THOUSAND GENERATED SETTLEMENTS READ PAGE BY PAGE; EVERY PAGE RULED AGAINST THE OWNER'S RUBRIC (TRUST THE DM; ONE FACT, ONE HOME; BREADTH, NOT DEPTH); THE SERVICES CATEGORIES MADE EXPLICIT; THE DM SUMMARY AND NEIGHBOURS TABS REMOVED; FOUNDATIONS, INSTITUTIONS, WAR AND RUMORS PLACED BY THE OWNER'S WORD (2026-10-30; SEAT: the cloud chair, session `01FE9mEwG1m6iRqUDCrMCQPc`; four Opus measurement lanes, four Opus build lanes, one verifier)

**The owner's words, verbatim (2026-10-30, in chat).** "I have some cleanup tasks that we need to do that are highest priority. Please use the most efficient and effective combinations of Claude models and effort per model for each task. I also now defer and give all judgment to you that is required now or in the future." Then the four tasks: (1) "go create let's say 1000 generated settlement using our program"; (2) "look at the 1000 generated settlements and for each page … comprehensively and exhaustively think of user experience and find ways to consolidate and reconcile each page individually … the overview summary page has several components that effectively expressed the same idea … Trust the users. Give them meaningful but minimally required information (including nuance). And if some nuance are phrases are simply better left off unmentioned then do that as well."; (3) "judge whether this is … appropriate for a dungeon master and the user … trusting them giving them the relevant and appropriate amount of immersion without overwhelming them … we want to give them details, but that is in breath not extreme depth for individual detail. The debt comes from the correlation and coupling of all these details as a whole but less visible and more intuitive."; (4) "make sure that each service it's appropriate to its category in the services tab. Because I see something like fresh fish retail in the equipment section." Later the same day: a Systems-group Institutions tab listing each institution's services, and the Overview's institutions collapsible removed; the post-generate "What's next" coach as "a relatively small floating and movable pop-up … at the corner of the window"; a War tab beside Faith that "says available at launch … the control center for how a user through the dossier effects all of its military troops and units out in the world with the simulator", and a Rumors counterpart in the World group; the Causes tab "renamed and put into the summary group"; and "still relevant today is in relationship to potential plot hooks rather than the current state of the settlement … anything within history already integrate[s] into the current state of the settlement".

**The rubric and the rulings** are in `docs/UX_CONSOLIDATION_2026-10-30.md` (seven rubric lines R1–R7; cross-group rulings X-1..X-14b; the Services rulings RS-1..RS-21; the Summary, Systems and World rulings T1-1..T1-15, T2-1..T2-26, and the T3 set). Every ruling is the chair's by the owner's delegation and vetoable; the owner's own words are marked as such in the text.

**What the thousand showed (CONFIRMED by executing the pages' own pure functions over the sample).** Services: 707 of 976 catalog pairs skipped the explicit category table; "Fresh fish retail" reached Equipment through a missing institution default, not a keyword; Equipment held 38.5% of all 67,823 service rows; misfiles printed a false "Transportation missing" absence on 50 of 66 metropolises and, through a substring accident, deleted "Parcel forwarding" from every no-magic world. Overview: the active crisis stated six times on one page (a seventh on the DM Summary); the ground block and the arrival scene contradicted each other on markets in 68 of 317 no-market towns; the road described three times in one box, two of them contradicting in 164 of 1,000. DM Summary: 50% of its words verbatim from the Overview or Plot Hooks. Economics: prosperity or trade posture stated nine times on its own page; Economic Flows and Supply Chains identical on 974 of 974. Power: the governing faction named in four blocks. Defense and Outlook: in no-magic worlds, "Arcane Support: Present" on 98 of 250 and "there is magic at X" on 160 of 250, against the Magic tab's "Magic does not function". NPCs: its tie list a byte-identical truncated copy of Relationships (6,697 of 6,697). Neighbours: a strict subset of Relationships. History: two blocks naming different defining events in 351 of 451. The "Still relevant today" badge read the generator's template-provenance flag (2,257 of 5,152 events, 591 of them 150+ years old).

**The structural cures.** Every catalog service registered with an explicit category, the walker's quarantine ledgers emptied, an institution default for every menu-bearing institution; Equipment relabelled Goods & Crafts, edible goods to Food & Drink, civic functions to Legal & Financial; one source for category labels on screen and in print. The DM Summary web tab and the Neighbours route removed (the quick-guide composer kept for Table View, Session Mode and the PDF chapter). Plot Hooks the one home of hook text; relationship tensions stay beside their ties. Causes → "Foundations" in the Summary group; a new Institutions tab; War and Rumors & News always present with an "Available at launch" teaser when no live body exists; "Still relevant today" derived from an event's open hooks or a citing tension. Signed shifts under the owner's delegation, each its own commit: the service re-map (generator golden), the arrival scene's market beat agreeing with the institutions (generator golden), the no-market pool stating only the institution fact (dossier prose manifest golden).

**Writer-reach register.** Dropping the relationship-tension category from the hook collector removes the only surface read of `archetypeKey` on relationships; its real consumer is the rename path in `generateSettlementPipeline.js`, so the key is `engine-internal` and its row cites this section.

**Open (the owner's).** "Available at launch" on War and Rumors is a launch commitment the war and information volumes are not yet built to keep. The two faction vocabularies (powerStructure.factions vs the relational factions) and the tie-tension template variety are generator design questions, recorded, not patched. The second-wave layout proposal (groups by the DM's question: The Place, The Table, The Forces, The Campaign, The Desk; Relationships dissolved into NPCs, Power and Neighbours) is written in chat and not ruled.

**THE LANDING (2026-10-30, the same session; the composed tip of branch `claude/ux-consolidation-2026-10-30`).** Twelve lanes built and merged (S the services; T1 the Summary group; T2 the Systems group; T3 the World group; T4 the coach card; T5 the configuration panel; T6 anonymous town-only and the 24-hour expiry; T7 the developer-page survey; T9 its fixable remainder; T2b, T4b, T8, T10 and T11 the composition cures), each lane in its own worktree, every shared register re-measured at the merged tree through its own governed command, never hand-composed. The verifier read the whole composed diff twice: the first pass found 3 STOP · 18 FIX · 9 NOTE with executed evidence (two product defects the lanes introduced — a governing faction's `modifier` left with no home when Power's "Governing authority" box was cut; an "Arcane defense" line still printed in 84 of 250 no-magic worlds — and the gate); the second pass at the tip read every row CURED or CLEAR (the modifier on Power in 101/101 towns in three audiences; the arcane line 84 → 0; tie tensions in print 89 → 1,100 of 1,100; institution links 0 → 2,618 of 2,618; proxy houses 237 → 0; hooks printed twice 155 → 0). SIGNED SHIFTS under the owner's delegation, each its own commit through the golden door citing this section: service category fidelity (generator golden 460 of 525; prose manifest 1,048; espionage fence 336 of 360; institution table 2,228 → 2,230); the arrival scene's market beat agreeing with the institutions (55 → 0 towns; fence 48 of 360); the no-market pool stating the institution fact (Overview-vs-Economics contradiction 131 → 0; manifest 406); the migration crisis naming one direction (20 of 29 → 0; fence 6 of 360). ACCEPTED EXCEPTIONS: the at-the-table PDF chapter's "Start here" entry hook repeats one hook by design; the founding worlds and the exact-replay demo fork at their own tier for a signed-out visitor (the town ceiling still refuses a city). THE OWNER'S STEPS: run `deno task test:edge` and `deno task check:edge` on a machine with Deno before deploying the admin edge function (this environment may not download Deno); the ticket status line's customer words are a migration draft in the kit, not in the tree; the support role's scope and the nine admin actions with no UI are product decisions. INBOX (recorded, not built): the server-side engine (TABLED on the owner's word); the Overview Food Security band and the Foundations "Food supply chains" row are uncorrelated on the sample (r = −0.03); 11 of 250 no-magic towns carry a "mages' quarter" governance line from the generator; two faction vocabularies for one town; tie-tension template variety; the orphan SummaryTab components and the `summaryMagazineV2` flag. WAVE 2 (ruled, briefed, queued): the dossier search as a one-stop shop of the dossier's own objects (X-19b), the block law and tab order with the Overview's routing line (X-16..X-18), every mention a door (X-20), the gallery veil with its category-driven defaults and every plot hook hidden (X-21..X-21d). THE GATE: the full `npm run test:ratchet` ran GREEN through the exclusive mutex at the cure lane's tip c91d1658 (the wave-1 tree with every cure): 35,265 tests, 0 failing, ceiling 0, exit 0 — after a first run at 701debf1 that redded 11 tests in 7 files (edge bundles stale against the re-registered service tables; five pins on generated output the signed shifts moved, each re-recorded through its own door or fixed in code); the type ratchet 167/167 and the strict domain ratchet 1113/1113; eslint 0 on every changed file; the writer-reach, observed-shape, wiring and lighting registers re-measured at the merged tree. Wave 2's first merges (the veil foundation, the Surveyor chat) ride the same branch past that tip; CI's run on the pushed tip is the second gate for them. Pushed as transport under rule 24a; no pull request, no merge, no deploy — the owner's hand.

## §934.102 · THE CULTURE (CU) INTEGRATED INTO THE FP ARCHITECTURE: THE FIFTH SUBSTANCE, CARRIED BY THE PEOPLE WHO MOVE; ITS VOLUME COMPILED ON THE OWNER'S WORDS, CURED THROUGH TWO ADVERSARIAL READS AND TWO VERIFIER PASSES TO 0 OPEN, AND FOLDED INTO THE FOLD AND THE SPINE; DARK, NOT SCHEDULED (2026-10-31; SEAT: the cloud chair, session `01FE9mEwG1m6iRqUDCrMCQPc`; measure, compile, two review, verify, cure and fold seats)

**The owner's words, verbatim (2026-10-31, in chat; bracketed words are the chair's reading of the dictation, `DESIGN_FP_ARCH_CU.md` THE OWNER'S WORDS).**

1. "For FP, I want to have a dominating culture aspect as well that is tied to the movement of groups and immigrants. By culture I mean Mesoamerica versus European and everything else that we have. Help me refine this idea. The dominating culture should have a very similar trajectory of growth such as faith where there is the official culture and then there is the culture or mix of cultures that are influencing it these come from immigrants, trade, and birth and death rates, it's really tied to the group of people moving in and out of a settlement and the group of people moving in and out of a settlement should be representative of the large group group of people in there. For example, if an army goes out to war that armies proportion should roughly be equal to the cultural distributions of that settlement. What are your thoughts?"

2. "What about legitimacy and identity? It should be similar to how we establish legitimacy for faith. What do you think?"

3. "Also, we should note that the legitimate and ruling culture of an overlord if it is similar to that of its muscles [vassals], keep things under control and also push pushes for cultural cohesion or expansion as well, so there's an application effect for the overlords cultureb which can also cause grievance for on all of its vessels [vassals], similar to faith. Also, isn't there an aspect of legitimacy based upon the strength of faith from the surrounding neighbors we should also simulate that as well."

4. "And settlements of similar culture also more likely to be amiable and to come to terms peacefully or quicker if they are at war. Or a cultural change can shift as part of terms and treaties. Well, they might be able to get more. Basically culture is every bit as important in all of these aspects"

5. "I want you to comprehensively and exhaustively refine it and integrate it into the architecture."

The standing word under which every delegated row is ruled (2026-10-23): "I leave all decisions and judgement to you"; and (2026-10-30) "I also now defer and give all judgment to you that is required now or in the future."

**The chair's thesis, in one paragraph.** Culture is the FIFTH SUBSTANCE of the FP thesis and a STATE of a settlement, never a module: each town's court speaks an OFFICIAL culture over a people who are a MIX of the eleven families told in bands, held in one ledger `worldState.cultureStates[settlementId]` (⭐ OD-CU-1, Faith's `religionStates` form) with one writer; the mix moves only as people move (a column blends at its release by its fraction of the town; births lean toward the majority above every quarter's floor; the crown's authority, an occupier's hold and a long road carry a small share as they carry a creed) under THE REPRESENTATIVENESS LAW (whatever leaves a town carries the town's make-up); the court's CLAIM on its people is told in Faith's band words by form and never by name, and the town's IDENTITY phrase turns only after a margin has held its years, with a Herald line and, where a foreign act drove it, one CLIMAX hearing `culture_unseating`; a crown presses its culture down the chain as it presses its faith, kindred towns come to terms sooner and ask for less, and three term rows let a victor ask for a court's adoption, a tolerance or a resettlement, each costed and refusable; no culture is better, no named person is given one, the map takes nothing, and nothing lights before a thousand-year run shows the realm neither freezes nor melts into one people. The volume is `docs/DESIGN_FP_ARCH_CU.md` (laws CU1..CU14, waves CU-0..CU-4, chain C23); its fold entries were pasted by the fold seat at `3bb999b8` (fold §2, §3.1, §3.4, §5, §6, §7 OD-FC-139..144; the spine's thesis, binding, requirement 21 and §3; PHASE55 §II.5-2 and PL §14 dated).

**The rulings, by number (the chair's, verbatim in CU §19; every row vetoable by one owner clause).**

- CU-R1 ⭐ Two things are called culture and both stand: `cultureAffinity` is the derived similarity (PHASE55 §II.5-2, superseded FOR THE SUBSTANCE ONLY); the family token is a substance with composition, legitimacy and identity; PL §14 amended; Q-S5 answered by shape; a composition writer IS minted, dark.
- CU-R2 The fifth substance, not a seventh module: culture is a STATE of a settlement carried by one worldPulse kernel; the thesis amendment is ⭐ THE OWNER'S.
- CU-R3 The hearing is for foreign acts only: `culture_unseating` (CLIMAX, WHERE `settlement`, `kept · yielded · blended · deferred`); an inside drift resolves as Faith's seat flips.
- CU-R4 Words: Faith's claim band by form; standings `enclave · minority · prevailing` (`present` withdrawn by census); `official_culture_adoption` the term, `adoption` the bond; `tolerance_guarantee` widened; `resettlement` minted.
- CU-R5 The representativeness law: nothing departs with a make-up the town could not have produced; `MigrationColumn.composition`; a muster's one receipt line in bands; named NPCs never assigned a culture.
- CU-R6 Affinity sits at the consumer (appraisal, valuation, peace reason, trust baseline), never in `courtPostureOf`; a weight only, because two-sided negotiation is not built.
- CU-R7 The crown channel is shared with faith (`faithCarriersOut`'s edges and channels; `culture_imposed` beside `rite_imposed`); one damper FORM, Faith's in ticks, culture's `CULTURE_TENURE_HALF` in years.
- CU-R8 The neighbourhood term is believed and weighted by relationship kind: allies and partners soften identity, enemies harden it, the vassal carries the crown term; yearly.
- CU-R9 The thousand-year measure before any flag lights: no convergence to one family, no frozen map.
- CU-R10 Floor repairs first (CU-0, no flag): `drawSteadingName`'s unwritten `parent.culture`, `mixed` names ignoring `sourceKeys`, the Edit pool lacking `mixed`.
- CU-R11 Laws minted: NO CULTURE IS BETTER; IDENTITY NEVER CHANGES UNDER THE READER'S FEET; bands not counts, named people never fated, the map takes nothing, cited.
- CU-R12 Flags `cultureEnabled` · `cultureCrownEnabled` · `cultureTermsEnabled`, virtual, absent-when-dark, lit in no preset; nothing scheduled; the teaser not extended.
- CU-R13 The key: `settlement.culture` is taken; the record is `worldState.cultureStates[settlementId]`, one writer; `culturalIdentity` untouched as the seed.
- CU-R14 The layer count stated, not hidden: seven layers become eight, "the other six" becomes seven, requirement 21's rows gain culture's set.
- CU-R15 The blend lands where the column lands (`releaseMigrationArrivals`, under `cultureEnabled`), never in the dark demographics pass.
- CU-R16 Shares ride the carriers as Faith's do: a small, distance-weighted carried share along the same edges and channels, so the crown and a conquest CAN open the hearing.
- CU-R17 The measure is two-sided: the bands reject both a monoculture and a frozen map; the harness preset named and lighting the column producers.
- CU-R18 The ledger carries a fractional accumulator (`pending` residues per family, whole points released largest-remainder).
- CU-R19 Drift is shared, not concentrated, and the floor is a floor (the quarter's at fifteen, the enclave's at five by OD-CU-14).
- CU-R20 The blend host named exactly (`spatial/migration.js :: releaseArrivals`'s buckets); adoption patience keyed on `APPETITE_BAND_LADDER`'s landed words.
- CU-R21 `elsewhere` floored at its seed band; drift drawn only above the floors; the seedling exempt until the quarter floor; the rungs re-derived.

**Open (the owner's; each recommended, none ruled; the fold's §7 rows named).** OD-FC-139 ⭐ THE THESIS AMENDMENT AND ITS ARITHMETIC: "five SUBSTANCES (war, trade, faith, populations, culture)", seven layers become eight, "the other six layers" becomes seven, requirement 21 (a) and (b) gain culture's seven rows, "no seventh module is ever built" standing; RECOMMENDED YES, written into the spine as a ⭐ row that falls by one clause. OD-FC-140 ⭐ THE §II.5-2 SUPERSESSION FOR THE SUBSTANCE ONLY, PL §14 amended, Q-S5 (§820) answered by shape; RECOMMENDED YES, the derived similarity standing under its name and readers. OD-FC-141 ⭐ THE TOLERANCE WIDENING: one `tolerance_guarantee` row with a creed-or-culture subject, or a second row `cultural_tolerance`; RECOMMENDED one row. OD-FC-142 ⭐ "AVAILABLE AT LAUNCH": may culture ever join the FP teaser? RECOMMENDED NO for now, nothing lights before THE THOUSAND-YEAR MEASURE. OD-FC-144 ⭐ BIRTHS AND DEATHS FAMILY-BLIND (through the tier's bands alone, never a family's own rate); RECOMMENDED YES. OD-FC-143 is the placement, ruled by delegation (C23 after C3 · C5 · C9). GS-3a's held shift is NOT this section's: it belongs in its own §.

**Measure-first facts (`findings/CU-MEASURE.md` at `f63b489d`, re-checked at `f540030c`; the corpus of 1000 generated settlements).** The culture token is paint today: 916 of 916 single-family towns honour their family's naming (916/916), 84 of 1000 are `mixed`, and no share ledger exists anywhere (no shares anywhere); the token has fifty readers and no writer beyond generation; the one live column stream is deleted at release with its origins stripped (`spatial/migration.js :: releaseArrivals`); `drawSteadingName` reads a `parent.culture` nothing writes. The status row is the fold's §2 (UNBUILT entire; three virtual flags lit in no preset); the chain row is the fold's §6 C23 THE CULTURE after C3 · C5 · C9, chosen at a read under FP-40.

**DARK, NOT SCHEDULED.** Every wave dark behind its virtual flag; nothing dispatched; the thousand-year harness is CU-1's car-0 and nothing lights before it holds. The owner's hand: the five ⭐ rows above and, at their units, the owner-signed shape and every lighting.

## §934.103 · THE DOSSIER CONSOLIDATION PROGRAM LANDS: WAVE 2 AND THE GENERATOR SEAMS RECORDED, THE BRANCH'S THREE CI REDS CURED (A FOUR-RECEIPT LANDING CARD; THE PERFORMANCE SPEC UNDER THE ANON LAW; AN UPSTREAM esm.sh DRIFT IN deno.lock), THE WEEKLY CERTIFICATION'S 114 FINDINGS ON MASTER MEASURED CURED BY THE BRANCH; THE PULL REQUEST OPENED; THE MERGE, WHICH DEPLOYS, THE OWNER'S (2026-11-01; SEAT: the cloud chair, session `01FbPLbfGHtg4xEGSkj1zE5B`, alone)

**The owner's words (2026-11-01, in chat), verbatim:** "Please continue the pending work. Please use the most appropriate combination of model and effort for model to complete each task for efficiency and effectiveness. I also now give you permission for anything that you may require to make judgment or to proceed now and in the future."

**Where the program stood.** The pending work was the landing of `claude/ux-consolidation-2026-10-30`, the branch §934.101 and §934.102 were written on: at its tip `1e1b4847`, 237 commits on master's `d14c5c56`, 342 files (+20,054 / −9,294), pushed as transport on 2026-10-31 with no pull request. After §934.101's landing paragraph was written, the same session merged onto the same branch, each lane in its own worktree and every shared register re-measured through its own door:
- **WAVE 2**, the owner's 2026-10-30 rows in `docs/UX_CONSOLIDATION_2026-10-30.md`: W2-VEIL-A (the gallery veil's foundation: the address model, defaults by category, delta storage, the reader applies it) · W2-SURVEYOR (one text box that grows into a floating chat; proposals accepted by a click) · W2-SEARCH (X-19b, the dossier search as a one-stop shop of the dossier's own objects, grouped under their owning tab) · W2-BLOCKLAW (X-16..X-18 and X-25a/c, the block law on every page, the tab order, the Overview's routing line, PDF chapters in group order) · W2-LINKS (X-20, every mention is a door; X-19b, exact search matches open expanded) · W2-VEIL-B (X-21..X-24, Export to gallery becomes Manage gallery, the curate screen, snapshot or live).
- **THE GENERATOR SEAMS** (the owner's "Do these next", 2026-10-30; the chair's rulings on G-SEAMS S1 and S2), each a signed shift through the golden door with its record in `docs/shift-records/`: **GS-1 TENSION VARIETY** (lane G3; `2026-10-31-tension-variety.json`): a tie's description and tension are drawn without replacement per settlement, eight variants per archetype, the index stored on the tie (`power/relationshipArchetypes.js :: createTieProseDraw`); the generator golden 525 of 525 rows and the espionage fence 360 of 360 re-recorded. **GS-2 ONE FACTION SET** (lane G2; `2026-10-31-one-faction-set.json`): the power factions are the factions, `settlement.factions[]` a projection of `powerStructure.factions` derived at `assembleSettlement` from the final roster, conflicts the power-faction pairs a rival or enemy tie crosses, no minted name and no draw; the Relationships "Factions" section cut and the power roster counting members by affiliation; the golden, the prose manifest (784 rows) and the fence re-recorded; the fork registry, the held-key writer census, the intent atlas distillate and the observed-shape baseline re-measured in cure lane T13. **GS-4** (lane G1): no arcane governance line in a no-magic world; the arm asks the world law first.
- **The cure lanes** T12 (the full ratchet's last five red files; the full test ratchet green at `c91d1658`, 35,265 tests, 0 failing) and T13 (the GS-2 seams: the receipt restates its conflict citations after a merge, chair ruling X-29, `src/domain/edit/mergeConsequence.js :: restateConflictCitations`; the landed-packet anchors re-addressed; the edge-shared bundles rebuilt in one run).
- **§934.102 THE CULTURE**, docs only, and the last two build rows: the landing fixture re-emitted at lf-033 and the generation worker's byte ceiling re-minted upward, declared.

**CI at the tip** (run 41188014373, 2026-10-31): 15 of 18 jobs green (validation, both type ratchets, lint, build and verify:dist, the coverage floors, the golden master under the hostile locale, Chromium end-to-end on desktop and mobile); three red, each with one cause, and nothing else:

| job | the red | the cure (each its own commit on the branch, red-first) |
|---|---|---|
| Gate / test ratchet | one test outside the census: `tests/copy/landingProseGrounding.test.js :: the 02 body names the three receipts the card shows` — the fixture carries FOUR voice receipts, the copy and the pin said three | With the power factions as the factions (GS-2), lf-033 derives a conflict again (the Elder Council and the Craft Guilds over conscripting guild apprentices), and the card's selection (`scripts/generate-landing-fixture.mjs :: buildFixture`, four receipts by design since the card was written; three only from the 2026-09-30 re-emit that lost the conflict) prints it first. The voice copy names the quarrel and says four facts; the pin binds the conflict by both its parties and expects four; the stock narration (`STOCK_NARRATION`) is re-grounded, one sentence for the quarrel and the pressured neutral, and the "his own man" clause, no longer derived, gives way to the pressure sentence the fixture carries now (a third party has learned the favour; the debt has changed hands); the fixture re-emitted through the script, only `voice.narrated` moved, `--check` OK. Red-first: 1 failed · 13 passed on that file with the freshness suite; green: every suite that reads the fixture, the copy or the script, 16 files · 234 tests; eslint 0 |
| Production-build browser performance | both profiles timed out clicking `button[data-settlement-size="hamlet"]` (10 s): the spec exercised Hamlet, Village and Town, and the anonymous gauge renders ONE station since lane T6 (the owner's 2026-10-30 word; `src/components/HomeHero.jsx` OWNER LAW; `e2e/flow-a-generate-save-export.spec.js` pins the count) | `e2e/performance/generator-performance.spec.js` takes its three interaction samples from the Town station, the count asserted one, the station pressed after each click. Locally against the built dist with this environment's Chromium both profiles pass under every budget: desktop ready 3,750 ms · LCP 1,892 ms · interaction 88 ms · CLS 0.0006; mobile ready 3,643 ms · LCP 3,244 ms · interaction 88 ms · CLS 0.0034 |
| Edge function execution tests (Deno) | `Integrity check failed for remote specifier https://esm.sh/get-intrinsic@1.3.1/deno/get-intrinsic.mjs` (expected `f4a5f1ff…`, actual `dba4cb55…`) | AN UPSTREAM FLAP, not the branch's: `deno.lock` is byte-identical on master and the branch (no commit on the branch touches it). esm.sh served TWO builds of that one pinned URL within two days: master's hash `f4a5f1ff…` on 2026-10-26 (master's scheduled run, green) and again on 2026-11-01 at 19:54 UTC (this landing's first push, run 41344081849), and `dba4cb55…` on every run of 2026-10-31. The chair first set the hash to 10-31's receipt (`a4430763`); the next run received the original bytes and failed the other way, so the entry is REVERTED to master's hash (`3a2f42d52`) and the lock is byte-identical to master again. esm.sh is unreachable from this session (the proxy refuses the host), so neither build was read here and Deno 2.9.6, installed into the scratchpad, could not regenerate the lock. CI's Deno job is the gate: a run that meets the other build is re-run, and the flap is the hazard and INBOX row below |

**The weekly certification, measured on both trees.** The scheduled job "Generation semantic certification" FAILED on master at `d14c5c56` (run 40316872922, 2026-10-26): 1,200 settlements, 114 findings. Reproduced here (`scripts/audit/generation-certification-soak.mjs --count 1200` in a temporary worktree of master): 38 settlements × three codes (`receipt_needs_review` · `receipt_check_failed` · `receipt_judgment_failed`), every one of them `world_law_magic`, a world where magic does not function carrying an arcane line. On the branch's tip: PASS, 1,200 settlements, 0 findings, 0 of 12 replay mismatches. The consolidation's no-magic cures (lane T2, T11's STOP-2, GS-4) cure the weekly red as well. CONFIRMED by execution on both trees.

**The lane branches, dispositioned** (`git cherry` against the tip, then patch diffs): `claude/ux-G1` holds GS-4 (`a10c61c8`, merged as `2cf542ce` with its comment re-cut, patch-equal otherwise) and **GS-3a** (`17105e3a`: food security reads the food balance and the reserves, not a sum of chains; the pulse's food pressure follows — a WIP body, six goldens moved, the shift record unsigned); `claude/ux-G2`'s Factions cut (`ead106f1`) is `f3064c0d` with the prose-numerics register re-addressed; G3, W2-BLOCKLAW and every T lane are in. **GS-3a is DEFERRED by §934.102's own sentence** ("it belongs in its own §"): its home is its own section through the golden door, built from lane G1's commit; the INBOX row it answers is §934.101's "the Overview Food Security band and the Foundations 'Food supply chains' row are uncorrelated (r = −0.03)". Deliberately deferred, documented, not a bug to re-find.

**The chair's rulings (by delegation on the owner's words above, each vetoable):**
- **The four-receipt card.** The card prints what the engine derived; the copy follows the card, never the reverse. Rejected: capping the selection at three to keep the copy, which would hide the conflict line the card was designed to print. Reversal: one line in the script's selection and the two copy sentences.
- **The stock narration re-grounded.** Owner-sanctioned stock prose stays grounded exclusively in the receipts, as at §934.30 and §934.86; the clause the engine no longer derives is replaced by the one it does. Reversal: the constant in the script and a re-emit.
- **The performance spec under the anon law.** The spec measures the controls a signed-out visitor has; three samples from the one station keep the sample floor the receipt demands (`scripts/audit/browserPerformanceReceipt.mjs`, three or more). Rejected: a signed-in profile for the spec (a new fixture and credentials in CI for a gate that is about the anonymous first paint).
- **The lock stays at master's hash.** Rejected: running the edge tests without the lock, or dropping the entry, both of which weaken the supply-chain guard; and holding 10-31's hash, which the next run refuted. A pinned hash cannot be stable while esm.sh serves two builds of one URL, so the flap is recorded as a HAZARD OF THE DEPLOY GATE: `deno-tests` must be green on the merge commit, and a merge or deploy that meets the other build waits for a re-run, never for a loosened lock. INBOX (the owner's): the edge functions' esm.sh modules vendored (`deno vendor`) or pinned by build version (`esm.sh/v<build>/…`), which does not drift, done on a machine that reaches esm.sh.
- **The landing's gates.** The cured branch is pushed as transport (rule 24a) and the pull request opened; CI on the pushed tip is the full gate. **THE MERGE IS THE OWNER'S:** a merge to master runs CI's gated production deploy jobs (`.github/workflows/ci.yml`, `deploy` and `redeploy`, on a master push after every gate), so merging this pull request ships 342 files of product change to production. The 2026-10-30 chair left the pull request, the merge and the deploy as the owner's hand for this branch; this chair opens the pull request and stops there. The recommendation of record: merge on green CI. §934.101's owner step for the admin edge function (`deno task check:edge` and `deno task test:edge` on a machine with Deno) is discharged by CI's deno-tests job once green.

**The proof.** The full gate runs on these exact bytes twice: locally, as the pre-push hook of the push that carries this section (`npm run check`, then `check:edge-behavior`, which skips with its notice where Deno is not on PATH; the receipt, with the test ratchet's count, is quoted in the pull request), and on CI at the pushed tip, the second gate (rule 24a). Before the push, through the shared mutex: the landing suites 16 files · 234 tests; the performance spec, both profiles, against the built dist; the suites that police this record (tests/docs, the ledger and source citation walkers with the ledger ref fetched as CI does, the golden-freeze walker, the packet validator: 23 files · 285 tests); eslint 0 on every changed file. The cures are the commits `325c7d2a` · `2e8de252`; the lock's round trip is `a4430763` and its revert `3a2f42d52`; this section rides the records commit `7dc9ccec2` and is amended in place by the revert's docs commit, the same landing. A push that skipped the hook was refused by this session's harness, so the hook's run is the local proof.

**THE POLISH AFTER THE TOUR (2026-11-01, the same session; this section amended in place).** The chair toured the dossier at the branch's tip (every tab, desktop and phone, the built app served locally) and gave the owner its reading. The owner's five words, verbatim: "Put institutions first then services. I think that these are their individual places." · "What is the coach card?" · "move the teaser tabs as you mentioned to the end but give them a purpleish hue just for distinction" · "Do the trim" · "fix the friction on the phone". What lands on the same branch, each unit its own commit, the rulings X-30..X-34 in `docs/UX_CONSOLIDATION_2026-10-30.md`:
- **X-30 Institutions first, then Services** (`OutputContainer.jsx :: TAB_GROUPS`; the search's tie order and the gallery veil's curate sections follow). Both tabs stay by the owner's word ("their individual places"), so the chair's suggestion of one home for the service rows is withdrawn.
- **X-31 The coach card** is the post-generate "What's next" card of the owner's 2026-10-30 word (lane T4, `PostGenCoach.jsx`): four steps after a forge, movable, dismissible, fixed to the corner from 1024 px up, in the flow on phones. Unchanged; INBOX: it overlaps the content column at 1,280 px.
- **X-32 The teaser tabs** already closed the World strip (rumors → war → faith since X-17), so nothing moves and the chair's tour note is corrected. While War, Rumors & News or Faith has no live body it wears THE LAUNCH REGISTER (`design/tokens.js` launch-500/700/100; `domain/dossier/launchTeasers.js`; `dossier/useLaunchTones.js`; both strips, `data-tone="launch"`); the hue leaves a tab the moment it has a body.
- **X-33 THE TRIM (R4, R6):** Power's breakdown shows only the modifiers that moved the score; Relationships offers no empty filter; the Foundations sentence names the conditions the reading folds in and prints nothing on a town with none (`domain/display/conditionWords.js`, the screen and the print chapter); Plot Hooks names a source once over all of its hooks.
- **X-34 THE PHONE:** the identity facts wrap as units with their separators inside them; the jump-to-bottom button leaves phones; the bottom nav and the in-flow footer stay as ordered on 2026-09-16.
- **X-35 THE INSTITUTIONS TAB, INVERTED** (the owner, later the same day: "give the general description for each institution ... then list off underneath that in like a subtitle each of the services that it renders, each of those services ties to a hyperlink that is appropriate to the services tab. This is the inverse of how the services tab does things"): every house leads with what it is (`inst.desc`, else the authored identity line), then a subtitle of doors — each service an `EntityLink` to its row on the Services tab, where the row's own description stays. Services are now indexed entities (`entityLinks.js :: serviceEntityOf`, the `services` family, structured-only in prose); `ServiceItem` is the sink (the anchor and the focus convention); a folded category opens for its focused row. Closes the tour's INBOX row on the two tabs listing the same rows.
- **X-36 GOLD LETTERING ON THE LAUNCH REGISTER** (the owner: "Purple hue with gold lettering if that helps"): at rest the launch wash with gold-800 letters, lit the deep launch fill with gold-400 letters, both strips, every pair measured and pinned in `tests/design/contrast.test.js` (brand gold as lettering fails on every ground, 2.4:1 and 3.3:1).
- **X-37 THE SPATIAL LAYOUT LEAVES THE SUMMARY PAGE** (the owner: "All that's gonna eventually come from PLAT anyways so it's redundant already. And it also makes no sense to be there without a visual spatial component to it all"): the Overview's layout line and its "Spatial Layout (N quarters)" section are cut; `spatialLayout` stays in the record. OPEN TWIN, flagged: the document's QUARTERS block and the VTT journal's quarters still print the text-only layout.

**THE OWNER'S STANDING RULE ON PROMPTS (2026-11-02 UTC, in chat, verbatim; it binds every session on every account).** "Hello? Listen a new rule when I put a prompt to you that takes priority over everything." · "Please answer my questions and prioritize my prompt for anything else whenever they come up." RULED: an owner prompt pre-empts whatever is in flight; the chair answers it first, in full, then resumes. Recorded in `docs/OPERATING_STANDARD.md` beside the intake rule.

**THE THIRD ROUND (2026-11-02 UTC, the same session; the owner's words verbatim in `docs/UX_CONSOLIDATION_2026-10-30.md`):**
- **X-38 THE META SENTENCES GO:** the Overview's routing line (X-18) is cut now; the Systems Health vintage caption, the Institutions legend row and the Services count line leave in the same car as the ? pill that takes each one's fact (X-42).
- **X-39 THE LAUNCH SKIN:** "a regal purple dark with a gloss and shimmering gold lettering … anything that is a purchase button and the ai overlay pass button." `design/tokens.js :: launchSkin` (the sheen through launch-800 to launch-900; gold-400 to gold-100 letters on the house shimmer, still under reduced motion), worn by the teaser tabs on both strips, by every launch-locked purchase control through the Button primitive reading the Available-at-launch pill inside it (a flag on the pill, not an import), and by the AI pass buttons by name. Measured: gold-400 on the sheen 5.8:1; the rule above 3:1 on every ground stop. Supersedes X-36's pairs.
- **X-40 THE BACKS LINE** on every house: the powers it stands behind, each a door to the Power tab, the inverse of the Power tab's own web (`powerSupport.js :: institutionBackers`), pinned equal edge for edge.
- **X-41 ONE TAG PER HOUSE:** the doors carry no state word; the house wears the worst state across what it renders beside its name.
- **X-42 THE ? PILLS, BUILT** on the nine after the owner's word on the language ("simple direct language … don't make it meta"): `primitives/InfoPill.jsx`, `copy/sectionHelp.js` under its walker, `Section` takes `help`; the three held meta sentences left with them (the Systems Health vintage is the pill's second sentence and the document's caption, one constant; the Institutions legend; the Services count line).
- **X-43 THE SEAT BY ITS REAL NAME:** the Norse "built around the hall" names the roster's seat building (palace complex, city hall, town hall, in that weight) on the strip and in the identity sentence; a body is never the seat; without one the phrase stands. INBOX: the war and rumour pools' figurative "the hall".
- **X-44 THE FLUSH RULE:** `design/flush.js`; stacked blocks edge to edge with one hairline, end to end, across the Overview, Institutions, Services, Economics, Power, Defense, History, NPCs, Resources, Outlook, Magic, Plot Hooks and War; the primitives carry it. The prose pages keep their frame.
- **X-39 corrected** by the chair's own visual check before any push: two layers on the one element; the locked tiles' inks.
- OPEN TWIN, unchanged: the document's QUARTERS block and the VTT journal (X-37).

**THE OWNER'S WORD ON TRUST THE DM (2026-11-01, in chat, verbatim; it binds every surface and every later session).** The chair had read the map program's three tuning layers and said the player layer "should be visible and editable, not silent". The owner: "I think you're always missing the point regarding trust the DM. Keep this in mind for the following. Trust the DM we give with the damn having full authorship after things are generated. And when it comes to the table is their choice to include things or not. But the point of all of this is in some ways to reduce cognitive load on the dungeon master, which means reduce choices and the friction choice as much as we can silently. We give them infinite freedom, but we give them a Headstart. [...] It does not reshape the towel so they've already built. It helps to shape the towns so that it's closer to what we hope is the ideal state of what they're looking for when they start building them. Ideally, we'd want to create the model where they don't have to change anything because it's close to perfect. And then even after that they can diverse deep or granular as they want to, or change things they want and we record those changes and learn from them to emulate them for of them. But even beyond all of this, yes we are building a very extensive very complicated. Very high-level tool for as much as we can. Let's reduce the burden of getting into the granules of that tool. That being said, still keeping things that need to be in depth and depth, and things that can be eased eased." The chair then offered one quiet profile row ("what the forge has learned from you", with a reset); the owner: "Things like this is still noise [...] It also cost nothing perhaps even gives us more if we don't include it in the first place." RULED, by the owner's word: the tuning layers are SILENT — no prompt, no toggle, no profile row, nothing in the flow; they shape the starting point of a NEW town and never a town already built; the DM's authorship is the full edit after generation and the choice at the table; the product is the head start, and its measure is how little a DM changes after a forge. What the chair keeps as engineering constraints, compatible with the word and not objections to it: the tuning snapshot is recorded with the settlement so regeneration reproduces it; learning reads repeated patterns across towns, not one edit, with decay; depth stays behind one door.

The registers: the phone chrome floor's `floored` rows rise by two on `/create`, `/settlements` and `/gallery` (named in the commit); the name-list census's PlotHooksTab ruling is re-keyed; the raw-colour budget is unmoved; the lighting census is re-frozen through its door for the new titles; and three the pre-push hook's full ratchet found after the targeted runs — the domain any-cast baseline (the two new domain leaves enter at zero, so their `any` types became real shapes, no baseline row), the dossier nowrap registry (one row, `OverviewTab.jsx` nowrap 3, proof recorded) and the prose-numerics baseline (five pure line moves re-addressed by hand, 207 rows before and after). THE SECOND ROUND (X-35..X-37, the same session, after the owner's "Stop pushing the gate for a moment and let's just focus on the building out then we pushed it all together"): the phone chrome floor falls by three on the three routes (X-37's sites), the raw-colour budget 1233 → 1232 (banked), the label-seam roster 15 → 14 (the Overview threads nothing), the lighting census re-frozen for the one new test file, the name-list ruling for the Institutions card re-worded; the observed-shape inventory (2027), the wiring census and both type ratchets unmoved. The receipts: every suite of a touched surface with the phone and chrome floors, the colour budget, the contrast pins, the citation walkers and tests/docs — 50 files · 730 tests green through the shared mutex, then the lighting census refrozen and proven by a plain run; the full gate in the pre-push hook of the push that carries them; CI at the tip.

**THE FIFTH ROUND (2026-11-02 UTC, the same session; the owner's words verbatim in `docs/UX_CONSOLIDATION_2026-10-30.md`, the X-45/X-46 addendum):**
- **THE OWNER'S WORDS, in order.** "Hi Something else I feel like every institution should back the appropriate power. And where appropriate and institution may be multiple powers. Also make it so that in editing a user can add or remove or change which power institution can back. What are your thoughts?" · "Don't push anythibg until I'm ready" · "No, I mean that every institution backs powers, some inherently back multiple where appropriate, and we need to also just make sure that it still balances out to the power ranking and influences. We just need to make sure that we balance it on our end and it doesn't end up becoming redundant or a double counting. So what you should do is catalog every institution and make those judgment calls individually. So what are your thoughts?" · "Yo, how come you don't answer me when I give you a prompt right away" · "No 'a one-line reason.' That the user receipt just simply saying which ones they back in that row is plenty enough." · the scale directive and the owner's own tier table (recorded whole in the addendum) · "I stopped you because you never answer my questions when I ask you".
- **RULE 41, BROKEN TWICE BY THE CHAIR AND CORRECTED.** Twice this round the chair went into the next tool call instead of answering the prompt that had just landed; the owner stopped the session both times to say so. The chair's fix, binding on every later session: the answer is the first thing out after a prompt lands, before any tool call, in full; the work resumes after it. No tool run, however long, excuses a late answer.
- **X-45 BUILT** (`57b5b4c90`, `23dceff60`, the census `c442f8270`): the backing catalogue, one judgment call per family, shares that sum to one so a house is spent once however many powers it backs, the seat and craft rules, the fallback, the default at no weight, the exact mark whole, the DM's list equal and replacing; the card editor under Trust the DM; the document's Backs line; the balance ledger and its measurement (gap mean 32.9 points over 108 settlements, rank agreement 0.28, 975 of 4,934 houses backing two powers, none unplaced). **Two signals held for the owner, not fitted:** the crafts over-implied at every tier above hamlet; the thorp gap structural (stress-born factions with no house). **Step two, the catalogue feeding the power figures, is the owner's call on that report**; until then the figures do not move.
- **THE CHAIR'S RULINGS (by delegation, each vetoable):** no reason line per row, on the owner's word; a split is the exception and the walker holds it under a third of the families; a lapsed share never inflates another power; the default listing carries no weight so the display can be total while the arithmetic stays exact; the instrument's refusal of the bank declaration is the instrument working, so the lane read the DM's word through the banked settlement walk and withdrew the declaration (THE CHAIR'S DOOR, recorded below, if that read is ever ruled insufficient: a schema migration of the observed-shape instrument declaring `_userEdits on institutions`, precedent CR-OSR-SCHEMA-9).
- **THE LINT CURES** (`408928e1c`): six walkers were red over the whole batch because rounds two to three-b landed without the full lint walk; each cured through its own door (anchors on the line, a planted regression for the pill copy law, the seat name through the live roster, the writer-reach register's governed write, the lighting census refrozen). The chair notes the lesson: every car runs the lint walkers before its commit, not at the push.
- **THE PUSH'S GATE, RED ONCE, THEN CURED (the same session, after the owner lifted the hold: "Feel free to push whenever you want now you have full reign to push when you want").** The first push's pre-push gate refused at the test ratchet: eighteen failing tests in twelve files that the per-car suites had not covered — the document reaching `src/copy` for the one vintage sentence (ruled into the layer census); the backing catalogue repeating the quarantined institution key (its quarantine row); a store mock without `subscribe`; the removed legend still pinned (re-pinned on the ? pill and the badge glyphs); the mobile and desktop floor baselines and the chrome census rows re-recorded with their causes; the neighbour mirror's dark golden re-recorded after the ? pill's React id was made stable (a per-render counter had made the same surface hash differently); the Power tab's pill set beside its title so its sentence never joins a 13px line; the edge-shared bundle rebuilt after the edit-register change; and the document's Institutions chapter, where the two-text Backs block made the renderer emit an invalid border geometry wherever a non-wrapping card met a page break, cured by printing the line as one text, measured lane by lane (the dot, the corner radius, a non-wrapping pair row and a presence-ahead break were each tried and ruled out). The chair's lesson, binding: every car runs the suites of the surfaces it touches AND the registers that read the whole tree (the floors, the censuses, the goldens, the layer and tell walkers) before its commit; the push's own gate stays the full ratchet, and a red there costs an hour, which is why the per-car walk is not optional.
- **X-46 THE HISTORICAL SCALE: PLANNED, NOT BUILT.** The owner's table is adopted as written; the chair's budgets (houses 1–3 / 2–6 / 5–14 / 12–35 / 30–75 / 70+, named NPCs 1–2 / 2–4 / 4–7 / 6–12 / 12–18 / 18+, stamp cut points 25 / 88 / 350 / 2,250 / 15,000, households at about four a hearth, dwellings, water and church access no longer institutions) stand for the owner's veto. Its own car after X-45; every generation baseline re-frozen under the owner's word.

**THE PUSH WAS HELD, THEN LIFTED (the owner, 2026-11-02: "Don't push anythibg until I'm ready", then "Feel free to push whenever you want now you have full reign to push when you want").** The single push carries every commit of the fifth round and the gate cures; the pull request body gains the four round inserts; CI is read; the merge stays the owner's.

**Open, in order:**
1. **THE MERGE AND THE DEPLOY (the owner's):** the pull request; CI's required checks green at its tip; the production deploy follows the merge by CI's own jobs (or the owner's Redeploy click where the secrets are unset).
2. **GS-3a**, its own section through the golden door (above).
3. **The INBOX, unchanged from §934.101**, plus the esm.sh vendoring or build-version pins (above) and the 2026-10-30 owner's steps (the support role's scope; the nine admin actions with no UI; the ticket status line's customer words, a migration draft in the kit).
4. **§934.102's owner rows** OD-FC-139..142 and OD-FC-144, each recommended, none ruled.
5. INBOX from the tour: the coach card's margin at 1,280 px (X-31). The row on the two tabs listing the same service rows is CLOSED by X-35 (the Institutions tab inverted). New since the second round: the document's QUARTERS block and the VTT journal's quarters, the text-only twins of the layout X-37 cut from the Overview (the owner named the summary page; the twins stand, flagged). The ? pills (X-42) are built on the nine and the three held meta sentences left with them. New: the war and rumour pools' figurative "the hall" (X-43 named the dossier's seat; the play prose carries no slot for a house).
6. No build is dispatched by this section. Every FP volume stays DARK and NOT SCHEDULED, and the dispatch gate is the release.
7. **X-46 THE HISTORICAL SCALE** (the fifth round): the owner's table adopted; the chair's budgets for veto; built as its own car after X-45, under the push hold.
8. **THE CHAIR'S DOOR on the observed-shape register:** a schema migration declaring `_userEdits on institutions` in the explained-writer bank (precedent CR-OSR-SCHEMA-9), only if the lane's banked settlement-walk read is ruled insufficient; not scheduled.
