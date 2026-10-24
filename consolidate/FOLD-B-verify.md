# FOLD-B — FIDELITY VERIFICATION OF THE FOLD'S §3 (P8d, seat FV-FOLD-B, 2026-10-23)

**COUNTS: sampled 225 ledger rows (68 sites: rows, INBOX groups, registry rows and paragraphs) · holds 219 · fails 6 rows at 4 sites (F1–F4), all minor, each with a one-line cure.** No fail touches a ⭐ owner row, an OD-FC id, a section or row number, a DRAFT/UNMEASURED mark, a hearing kind, its owner or its class. Notes N1–N8 are not fails.

**THE RATCHET (re-run: old lines 292–506 + 561–755 extracted to `fvfold-b/old-range.md`, byte-identical to `cfold-b/old-range.md`; the text of record is `cmp`-identical to `docs/DESIGN_FP_COHERENCE_FOLD.md`), last line: `RATCHET 1 DIFFERENCE CLASSES`.** Tokens old 1343 · new 1160 · missing 0 · new-in-new 22. Cites 61 = 61. OD rulings 140 → 141. ⭐ 21 → 20. DRAFT 12 = 12. UNMEASURED 5 = 5. Wave ids 6 → 7. Flags 14 → 16. Review markers left: 0. The one class, ⭐ 21 → 20, is EXPLAINED and re-proved by OD id. Old: BD-49 ×2 · BD-56 ×2 · OP-25 · FC-87 · RN-52 · MG-8 · FC-100 · MG-15 ×2 · MG-6 ×2 · FS-11 · FS-6 · MG-7 · FS-24 ×2 · WS-5 · FS-9 ×2. New: the same, with FS-9 ×1. The old `tax_refusal` row carried "⭐ OD-FS-9" in its bracket head and "OD-FS-9 ⭐" in its Class cell. **No owner row lost its ⭐.** The OD set gains `OD-MN-10`, from the chair's 3.1.20 edit (old − new = ∅). Ledger §5's block still shows 140 = 140 (N1). The 22 new tokens and the extra wave id and flags all come from volume cells; none is a mint.

**THE MARKER COUNT (my own balanced scan, `fvfold-b/count.py`):** brackets 188, made up of AMENDED 93 · ADDED 72 · RECOUNTED 7 · RENAMED 6 · REFINED 4 (one is the head-less `[REFINED {T})` at old L496) · CURED 3 · RE-RULED 1 · STRUCK 1 · COUNTED 1. Then `↳` outside brackets 247 (272 in all) and MARKERS-pattern hits 431. **Each class equals ledger §1, and the 512 rows reconcile.** The ledger has 10 DROPPED and 502 FOLDED rows. I read every DROPPED row against the old text: B-330/331 (old L605 superseded by L606), B-365 (L632 superseded by its STRUCK row L633), and B-473..479 (the COUNTED bracket and six RECOUNTED brackets, superseded by L722). Each was rightly dropped. The card notes of L717–L720 stand in PS/ST/PT, checked for `liegeAnswer`, the hidden-way catch, first placement, `awaiting`, the sortie and `reaches_party · struck`. One round header has no row (N2).

**THE ALLOW FILE (205 tokens, four classes) was checked by script against ledger §4:**
- Class (2), 97 tokens: every token stands backticked in a non-fold doc in DOCS.
- Class (3), 6 tokens: every token stands in the old fold outside this range.
- Class (4), 18 tokens: every token is backticked nowhere in DOCS or the FOLD-A..E parts except the text of record. None sits in an owner's verbatim quote and none on a ⭐ line (each one's old context was read). All are superseded vocabularies, withdrawn lists, or the review template `[RE-RULED …]`. `authority_verdict` still stands in PL as the quoted literal `'authority_verdict'` (N3).
- Class (1), 84 trail paths: 64 also occur outside brackets, as INBOX group heads and inline provenance. Ledger §4 says "bracket heads or INBOX group heads"; that understates the class, but every one is review-trail provenance (N4).

**SECTION AND ID SURVIVAL:**
- Headings §3, 3.1, 3.2, 3.3 and 3.4 are kept. All 80 row numbers (3.1.1–30, 3.2.1–22, 3.3.1–28) are present once each, in order.
- The OD-FC set is old 56 = new 56; old − new = ∅ for every OD id.
- INBOX item numbers survive per program. There is one renumbering: INT's second "(2)" (P4, the guild war's grievance) becomes INT (4). This is ledger-flagged, the old text had a duplicate, and no volume cites INT (2) or INT (4).
- `§` cites lost: §3.3.26, §15.9, §8.6, §9.5 (and §3.5, §9.3 inside other numbers). All sat in mirror cells or brackets that the regeneration replaced, and none is a fold section the new part should still name.

**§3.4 REGENERATED (re-derived by my own parser, `fvfold-b/vols.py` + `kinds.py`, over the volumes AS THEY STAND NOW, after the lens sweep touched CH/OP/PT/RN at 21:03–21:04):**
- Kinds: old live set 93 base names, minus `relief_answer`, after the six renames = **92 = new 92**. Listed-new 0, STOPs 0.
- Rows: 81 in the new table (30 landed + 51 program).
- Every program kind's OWNER and CLASS match its owning volume's own hearings table: PL §7 9, MN §7 2, CH §18 9, PT §13 15, PS §9 4, ST §8 5, PR §11.2 2, BD §12 9, OP §10 1, FS §10 1. RN, MG and WS register no kind, which is true of their texts.
- Every Owner / WHERE / Climax / Verdict / Class cell of the 51 program rows is contained verbatim (bare `§` normalized) in the regenerated row. Only DEFAULT / Parties / Tilt are omitted, by the WHOSE WORDS rule (N5). There is **no drift** from the post-build volume edits.
- `party_gate` is CLIMAX (PT §13 row, and PT §9.2).

**THE RULED ITEMS (applied as written; not counted as fails):**
- PL-C-1 at 3.1.1: "the crown's polity-wide `toll_exemption`" and "the charter's `toll_exemption` is tolls only, and the bare word "passage" is THE PASSAGE's (PS14)". This matches PL L261.
- THE ONE PERSON STAGE has FOUR passes RN → CH → OP → PT at 3.1.22, 3.3.16 (7) and RN INBOX (1). RN §5.1 L349/351, CH §4.1 L379, OP §3.1 L416 (OD-OP-17 L630) and PT §7.1 L282 all say the same.
- P8-5: MN17 → MN7 (MN L106 "typed fields").
- P8-7: "PS §4.1's battle-inputs car" (PS L156).
- P8-9: 3.3.24 "seal … EM's `pin-fork` op", and 3.1.20 "STRESSOR HOLD" with ODQ's "PIN" quoted. EDITOR (d) keeps "pin" inside its quote.
- The chair's cn-5 edit: "a menace (OD-MN-10; MN §12; CN §4 cn-5)". This matches MN L611 and CN L23.
- The lens renames: "reading two's read" (3.1.25), "READING ONE'S TWO EXPORTS … reading one's … reading-two mix" (RN (3)), and "reading one reads no oath" (RN (5)). RN now reads "reading one / reading two". `lensOne` is kept. The remaining "lens" words are map lenses and `PACT_DRAFT_LENS`.

## THE FAILS
- **F1 · §3.4 THE COUNT (B-480, old L722).** The new text says "the same ninety-two kind names stand in 87 rows when each kind takes its own row". With each kind on its own row the figure is 92. The figure 87 is the old count, in which the five landed pair rows still count once (30 landed rows + 57 program kinds). This is the sentence the chair will use to align FOLD-A §1's "EIGHTY-SEVEN rows". **Cure:** "…stand in 87 rows when each PROGRAM kind takes its own row (the five landed pair rows counting once, as the old count did)".
- **F2 · §3.1 W-COIN INBOX, THE BAND AND THE COIN (B-110, old L370).** The old text said "PR's `fundingBandOfSettlement` names the same export **and aligns at PR's next lane**". The new text drops the clause and reads "PR's `fundingBandOfSettlement` names the same export", in the present tense. PR's own text (L637) says "PR's `fundingBandOfSettlement` WITHDRAWN — the one read is ST's `settlementFundingBand`", and FOLD-D §5 says the same ("the second spelling … is withdrawn"). **Cure:** "(PR's former spelling `fundingBandOfSettlement` is withdrawn; PR reads ST's name — §5's funding-band row)".
- **F3 · §3.1 THE WAR RULINGS INBOX (old L422; no marker row of its own, under B-135/136's P7 group).** The row "CARRIES THE TEXT verbatim" (the INBOX's own intro says so). The old quotation, which is also verbatim in `cure/BRACKETS-A-war-roads.md` L97, ends "…OP-6 (the envoy arm) as dependants (E.7 Q1)". The new quotation ends "…as dependants" — the text inside the quote marks was altered. **Cure:** close the quote before the id and keep the words, or restore "(E.7 Q1)" inside the quote.
- **F4 · §3.3.27 (B-278/279, old L502) and the §3.1 RN INBOX (2) (B-137, old L406).** Old: "The clause "once RN's P7 row accepts one" [in OP §9/§15, CH §14 and ES §3.10] is RESOLVED by this row". New: "…OP, CH and ES read it so". The volumes still carry the conditional: OP L101 and L356 have "once RN accepts a capture telling source — none at master", and CH §14 L711 has "(once RN's P7 row accepts one)". The fold has dropped its resolving sentence and now claims a reading the volumes do not state. This is an item-(5) disagreement and a softened ruling. **Cure:** restore "the clause "once RN accepts one" in OP §9/§15, CH §14 and ES §3.10 is RESOLVED by this row" at both sites. Aligning the volumes is the chair's call.

## NOTES (not fails)
- **N1.** Ledger §5's ratchet block predates the chair's edit (OD 140 = 140). The OD set is now 141, because the chair's 3.1.20 edit added `OD-MN-10`. This is bookkeeping only.
- **N2.** Old L348's round header "**INBOX 2026-10-17 (fp-final)**" has no ledger row, although each later INBOX round header has one. It is folded into the intro paragraph like the others; nothing is lost.
- **N3.** `authority_verdict` (class 4) still stands in PL as `'authority_verdict'`, so class (2) is its truer reason.
- **N4.** Class (1)'s description in ledger §4 is narrower than its membership: 64 of the 84 paths also sit in INBOX group heads and inline provenance. All are trail.
- **N5.** The regenerated program rows omit the old mirror DEFAULT clauses (e.g. `polity_fallen` "default `stand_by` at `strong`+ deference"). The Of-record column points at the volume row that carries them. This follows the 10-18 WHOSE WORDS rule.
- **N6. Seams with other parts (FOLD-E's site, for the chair).**
  - §7 OD-FC-58 in FOLD-E-new still reads "RN → CH → PT in order" (three passes), against SEAMS-P8-1 and §3.1.22.
  - §7 OD-FC-59 in FOLD-E-new reads "SEVEN claimant programs". §3.1.23, by the latest (P7) row, has EIGHT (WS-2's `way` term). FOLD-B is right in both cases.
- **N7.** 3.1.18 keeps "OD-FC-36 holds the case where the owner wants…" (as the old text did), while 3.2.2 writes OD-FC-6's answer ("not restored"). §7 OD-FC-36 is "NO". The treatment is inconsistent but not a fidelity break.
- **N8.** 3.1.30's "four programs feed" is now "the programs feed". This is a latest-wins application: BD-2 is a later feeder (old L1159, §6), and §3.3.16 (1) lists five registrants.

## THE TABLE
| row (ledger ids · old line) | verdict | receipt |
|---|---|---|
| 3.1.1 + ↳ (B-001/002 · L298–299) | HOLD | PL-C-1 applied as written; `narrowed_sphere`, OD-PL-9 and the routed GR row kept |
| 3.1.2 · 3.1.8 (L300, L306) | HOLD | latest from §7: OD-FC-2 / OD-FC-4 final ("as recommended"; "Until ruled" gone) = FOLD-E rows |
| 3.1.4 (L302) | HOLD | RE-RULED ONE mapping; "always restricted" struck |
| 3.1.9 + ↳ (B-011..014 · L307–308) | HOLD | OD-FC-64 ONE PLAGUE folded; "cured round 1" dropped |
| 3.1.10 + 2 ↳ (B-015..019 · L309–311) | HOLD | fealty question, STOP-2 KILL/ASSIGN gap and `seatChangedSince` merged; GRAMMAR keeps the TREATY question |
| 3.1.14 (B-020..024 · L315) | HOLD | re-ruling wins (WY-8a F9 `supplyCargo`); = §7 OD-FC-35 |
| 3.1.15 (B-025/026 · L316) | HOLD | CUT-TO-SENTENCE withdrawn; charter kept whole; "accepted in-chat" → "by the owner in chat" |
| 3.1.18 + ↳ (B-032..035 · L320–321) | HOLD (N7) | GENERALS ON THE LEDGER; owner's 05:57 quote verbatim |
| 3.1.19 (L322) | HOLD | unchanged ruling; OD-FC-37 cite kept |
| 3.1.20 (B-037..041 · L323) | HOLD | STRESSOR PIN re-ruling wins; "NOT minted" sentence removed; cn-5 = menace (chair's edit); P8-9 HOLD/SEAL |
| 3.1.22 + ↳ (B-042..044 · L325–326) | HOLD | four passes; deed seeding outside the stage (r1 ↳); RN-1 owns the mount; four volume cites agree |
| 3.1.23 + 2 ↳ (B-045..053 · L327–329) | HOLD | WC-car-0; EIGHT claimants (P7 wins over P5's seven) |
| 3.1.24 + 2 ↳ (B-055..061 · L330–332) | HOLD | RN owns both leaves; caps DRAFT, UNMEASURED kept; WS third claimant |
| 3.1.25 + 3 ↳ (B-063..073 · L333–336) | HOLD | ONE BELIEF READ; the base row's "`enmity` or worse" meaning superseded; OD-RN-48; "reading two" |
| 3.1.26 + 2 ↳ (B-075..081 · L337–339) | HOLD | "never re-derives / superseded" removed (an ASK); `polityClass`; per-seat hold not exported; 05:57 quote |
| 3.1.29 + 2 ↳ (B-087..090 · L343–345) | HOLD | site garrisons only; "YIELDS" and the `100 × F × Q` gloss struck; OD-PR-41 superseded; SITE_READINESS |
| 3.1.30 (B-091..093 · L346) | HOLD (N8) | MN's owned unit (§3.3.16 (1)); first-to-land idiom gone |
| INBOX GR (1)–(8), KEEP YOUR PEACE (L349, L379, L395, L415) | HOLD | numbers kept; P7 "placed in GR" |
| INBOX WC (1)–(24) (B-094..; L350, 355, 369, 374, 376, 383, 385, 391, 407) | HOLD | (3) r1+r2b merged; (5) FIFTH; (6) WITHDRAWN text; (13)/(14) CH cites (14) (CH L-cites checked); (16) eight |
| INBOX ES · J-ES-1 · (1)–(11) (B-111 · L351, 371, 392, 404) | HOLD | owner's fifth patrol word verbatim; "placed in ES" |
| INBOX IN (L361, 393, 405) | HOLD | P8-5 MN7 applied |
| INBOX EC · W-COIN SCUTAGE · WF · PL · POP · HB · MN · W-SEAT · INT (L353, 362, 394, 396–401, 410–416) | HOLD | numbers kept (INT (4) renumber flagged); POP (d) "the owner's row, not decided here" |
| INBOX W-COIN band/coin (B-110 · L363 + L370) | **FAIL F2** | "names the same export" vs PR L637 WITHDRAWN |
| INBOX SP-D · WY (1)–(7) · HOST'S QUARANTINE · SEASONS (B-108/109 · L352, 364–365, 368, 386, 401, 408) | HOLD | DM-SET and closed pass struck; REFINED folded |
| INBOX RN (1)–(6) (B-137 · L406) | HOLD except (2) | lens renames applied; (2) → **FAIL F4** |
| INBOX PS (1)–(7) (L409) | HOLD | P8-7; OD-FC-103/104 |
| INBOX EDITOR · DEEP COUPLINGS · ROADS · W-COIN packets (L421, 423–425) | HOLD | every quoted text present byte-for-byte |
| INBOX WAR RULINGS (L422) | **FAIL F3** | "(E.7 Q1)" cut from inside the verbatim quote |
| INBOX MAP (a)–(u) (B-104..107, 122..124 · L358, 360, 367, 373, 377, 382, 389, 402, 426) | HOLD | (a) ASK; (f) patrol clause struck; (h) WINDOW, NEVER H16; (n) ANSWERED, 22:52 reply |
| 3.2.1 · 3.2.2 · 3.2.5 · 3.2.7 · 3.2.15 (L432–446) | HOLD | = §7 OD-FC-5 / 6 / 8 / 9 / 12 final |
| 3.2.10 · 3.2.11 (B-153..157 · L441–442) | HOLD | `heldStocks` per §7 OD-FC-11; (d) re-ruling folded; OD-FC-10 "not built" |
| 3.2.13 · 3.2.16 · 3.2.18 (B-160/161, 163 · L444, 447, 449) | HOLD | `ownPressure`; OD-FC-13 POP's row; C2 order |
| 3.2.14 · 3.2.17 · 3.2.21 (L445, 448, 452) | HOLD | "CHAIR records" → "RULED (a record)"; content unchanged |
| 3.3.12 + 6 ↳ (B-172..188 · L470–476) | HOLD | SIX kinds; `site` withdrawn; posture door; FIVE backer roles (four-role list withdrawn); 17:27 cults quote |
| 3.3.13 + 6 ↳ (B-190..221 · L477–483) | HOLD | gates OPENED (P5); no paragon custody until ES's custody wave; P4 closings win (`captive_released` not automatic); 18:54 quote verbatim |
| 3.3.14 + ↳ (B-223/224 · L484–485) | HOLD | piracy live by construction; numerals lost are ids |
| 3.3.15 + 2 ↳ (B-228..231 · L486–488) | HOLD | PL §4.7 F.4 text of record; net's floor `NET_HOME_MIN` DRAFT; sweep price |
| 3.3.16 + 2 ↳ (B-236..246 · L489–491) | HOLD | (1)–(13) kept; (11) WC-car-0, eight; (2) MG's stepper added (later ruling, INBOX WC (5)) |
| 3.3.18 (L493) | HOLD | ⭐ OD-BD-49, ⭐ OD-BD-56; 22:14 and 22:51 quotes verbatim |
| 3.3.19 · 3.3.21 (B-261..263 · L494, 496) | HOLD | REFINED {T} folded; ⭐ OD-WS-5 kept |
| 3.3.23 · 3.3.24 · 3.3.28 (B-266..270 · L498, 499, 503) | HOLD | P8-7 and P8-9 as written; DRAFT 0.25 · 0.3 · 0.5 kept |
| 3.3.27 (B-278/279 · L502) | **FAIL F4** | resolving sentence dropped; "read it so" vs OP L101/356, CH L711 |
| §3.4 `armies_meet` + 3 ↳ (B-283..292 · L565–568) | HOLD | FIFTH; menace column under THIS contest (r4 over r3); `stand_off` kept |
| `siege` + 2 ↳ (B-295/296 · L569–571) | HOLD | `relieved` meaning; `liegeAnswers?` OD-PL-60 |
| `plant_taken` ↳ · `call_in_answer` + 4 ↳ (B-301..309 · L577–582) | HOLD | prefixes incl. `body:`; ONE BAN GRAMMAR; `riders_quartered` re-homed (P4) |
| `raid` + 2 ↳ · `supply_raid` ↳ · `caravan_seized` 2 ↳ · `envoy_*` ↳ (L584–589, 602–603, 615–616) | HOLD | `bodyKind` form (r5); `defenseLedger`; no `person_held` |
| `ransom` + 6 ↳ (B-330..341 · L604–610) | HOLD | B-330/331 DROPPED correctly; CLOCKED; P7 PRECEDENCE paragraph kept whole |
| renamed PL/MN kinds (L619–631, 637–638) | HOLD | WHAT IS NOT A KIND carries every rename |
| `relief_answer` (B-365..369 · L632–634) | HOLD | B-365 DROPPED correctly; first-believing-week rule for siege relief only |
| `menace_met` + 3 ↳ · `champion_duel` ↳ (L640–643, 647) | HOLD | `indecisive`; exactly two producers |
| `party_gate` + 3 ↳ (B-418..422 · L668–671) | HOLD | CLIMAX (chair's ruling = PT §13) |
| `tax_refusal` (B-472 · L709) | HOLD | ⭐ OD-FS-9 once, VISIBLE; FS §10 cells verbatim |
| COUNTED/RECOUNTED (B-473..479 · L711–720) | HOLD | DROPPED; card notes in PS/ST/PT |
| THE COUNT (B-480 · L722) | **FAIL F1** | "87 rows when each kind takes its own row" (= 92) |
| WHOSE WORDS (B-481 · L724) | HOLD | "refreshed at P4" mechanics dropped; rule kept |
| WHERE table + ↳ rows (B-482..; L726–746) | HOLD | anchor ≠ WHERE; TRAIL/JUNCTION no WHERE kinds; ONE STRETCH KEY, DIAL EXCEPTION |
| rulings on the registry + P5 ↳ · participation (B-509..512 · L748–752) | HOLD | THREE first-lit kinds (`envoy_hearing` merged); `participation` column |

**CONFIRMED vs PLAUSIBLE:**
- CONFIRMED by script and by reading old against new: the ratchet line and every count, the 512-row reconciliation, the allow classes, the section/row/OD-FC survival, the ⭐ ledger by OD id, the 92-kind / owner / class match against the volumes as they stand, the ruled items, and the four fails.
- PLAUSIBLE only: that the rows I did not open side by side (about half of 3.3.1–3.3.11, 3.2.3–3.2.9, 3.2.19–3.2.22, and the landed registry rows without ↳) carry no silent change. A per-row numeral and token scan found nothing in them.
