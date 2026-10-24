# PR — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8, lane C-PR, seats 1 and 2; 2026-10-23) — COMPLETE: header..§20 written; 0 PENDING; 0 STOPs; the volume replaced

Old text: `history/PR-bracketed-1beabdc85.md` (486,293 bytes, 1,172 lines), byte-identical to `docs/DESIGN_FP_ARCH_PR.md` before the replacement (`cmp`: at seat 1's start and resumption, and at seat 2's start). New text: `consolidate/PR-new.md`, copied whole over `docs/DESIGN_FP_ARCH_PR.md` (one `cp`) once every row below was resolved. Both are built by ONE script over the old text (scratchpad `cpr/`: `scan.py` → `brackets.json` + `outside.json`; `readcopy.py` → `read.md`, the bracket-numbered reading copy; `build.py` + `d00.py` … `d18.py`, one decision file per section range — seat 1 wrote `d00`–`d07` (header..§7), seat 2 `d08`–`d18` (§8 to the end) and two logged repairs in `d00`/`d02`; `lint.py`; `miss.py`, `miss2.py`; `mkledger.py` → this file; `mkcure.py` → `history/PR-cure-record.md`): bracket spans found by balanced matching; a stamp (date · source · finding ids, no colon) removed; a content bracket folded as its own text (prefix stripped) or as a written sentence; every running-text substitution asserted to match exactly once (`S`) — so every passage not named in §3 is byte-faithful to `1beabdc85` minus its brackets. **To rebuild:** `cd cpr && python3 build.py && python3 mkledger.py && python3 mkcure.py` (the build refuses to run while any content bracket has no decision).

## 1. THE COUNT (by script, before writing)
Markers in the old text: **724** = 580 brackets (balanced scan; `[CURED …]` 504 · `[REFINED …]` 48 · `[ADDED …]` 11 · `[RE-RULED …]` 10 · `[OPENED …]` 6 · `[PLAUSIBLE …]` 1) + 13 `↳` outside brackets + 54 round words outside brackets + 53 `STOP` outside brackets + 9 `ROUTED-UNAPPLIED` outside brackets + 7 header/status lines (old 3, 6, 7, 8, 9, 10, 12) + 8 cure-record headers (old §20). The ratchet's MARKERS regex alone finds 601 in the old text (it counts each `(fp-final r6a)` inside a `[RE-RULED …]` bracket separately and misses `[RE-RULED` itself). One row per marker in §7.

**Dispositions:** old markers 724 · folded 619 · dropped 2 · moved 93 · kept 10 · pending 0. FOLDED counts every content bracket folded into the sentence it amended, every change note and stamp whose text already stands at the same place (the code `D` of the build, as seat 1 counted them), and every outside marker reworded away. The TWO DROPPED rows are B564 (the r5 measurement attached to ⭐ OD-PR-51's struck text) and B565 (that text's stamp) — superseded by B563, the re-ruling of OD-PR-51. MOVED: the header/status block (Part 1 of the cure record), old §20 (Part 2) and old §19's answered questions, historical lists and routes (Part 3). KEPT: the build-time ⛔ STOP conditions of §4.1, §6.2, §9.1 (b) and §14's PR-0 · PR-1 · PR-2 · PR-3 car-0 (design marks, not review markers).

| old section | folded | dropped | moved | kept | pending | STOPs |
|---|---|---|---|---|---|---|
| header | 0 | 0 | 29 | 0 | 0 | 0 |
| OWNER/ANSWER | 3 | 0 | 0 | 0 | 0 | 0 |
| 0.1 | 15 | 0 | 0 | 0 | 0 | 0 |
| 0.2 | 15 | 0 | 0 | 0 | 0 | 0 |
| 0.3 | 2 | 0 | 0 | 0 | 0 | 0 |
| 0.5 | 2 | 0 | 0 | 0 | 0 | 0 |
| §1 | 40 | 0 | 0 | 0 | 0 | 0 |
| 2.1 | 7 | 0 | 0 | 0 | 0 | 0 |
| 2.2 | 12 | 0 | 0 | 0 | 0 | 0 |
| 2.3 | 5 | 0 | 0 | 0 | 0 | 0 |
| 2.4 | 1 | 0 | 0 | 0 | 0 | 0 |
| 2.5 | 3 | 0 | 0 | 0 | 0 | 0 |
| 2.6 | 19 | 0 | 0 | 0 | 0 | 0 |
| 2.7 | 17 | 0 | 0 | 0 | 0 | 0 |
| 3.1 | 10 | 0 | 0 | 0 | 0 | 0 |
| 3.2 | 5 | 0 | 0 | 0 | 0 | 0 |
| 4.1 | 11 | 0 | 0 | 2 | 0 | 0 |
| 4.2 | 1 | 0 | 0 | 0 | 0 | 0 |
| 5.1 | 4 | 0 | 0 | 0 | 0 | 0 |
| 5.2 | 2 | 0 | 0 | 0 | 0 | 0 |
| 5.3 | 1 | 0 | 0 | 0 | 0 | 0 |
| 5.5 | 17 | 0 | 0 | 0 | 0 | 0 |
| 6.1 | 8 | 0 | 0 | 0 | 0 | 0 |
| 6.2 | 4 | 0 | 0 | 1 | 0 | 0 |
| 6.3 | 4 | 0 | 0 | 0 | 0 | 0 |
| 6.4 | 6 | 0 | 0 | 0 | 0 | 0 |
| 6.5 | 3 | 0 | 0 | 0 | 0 | 0 |
| 6.6 | 7 | 0 | 0 | 0 | 0 | 0 |
| 7.1 | 1 | 0 | 0 | 0 | 0 | 0 |
| 7.2 | 4 | 0 | 0 | 0 | 0 | 0 |
| 7.3 | 1 | 0 | 0 | 0 | 0 | 0 |
| 7.5 | 7 | 0 | 0 | 0 | 0 | 0 |
| 7.6 | 4 | 0 | 0 | 0 | 0 | 0 |
| 8.1 | 11 | 0 | 0 | 0 | 0 | 0 |
| 8.2 | 16 | 0 | 0 | 0 | 0 | 0 |
| 8.3 | 7 | 0 | 0 | 0 | 0 | 0 |
| 9.1 | 16 | 0 | 0 | 1 | 0 | 0 |
| 9.2 | 8 | 0 | 0 | 0 | 0 | 0 |
| 9.3 | 2 | 0 | 0 | 0 | 0 | 0 |
| 10.1 | 11 | 0 | 0 | 0 | 0 | 0 |
| 10.2 | 1 | 0 | 0 | 0 | 0 | 0 |
| 10.3 | 22 | 0 | 0 | 0 | 0 | 0 |
| 10.4 | 2 | 0 | 0 | 0 | 0 | 0 |
| 10.5 | 7 | 0 | 0 | 0 | 0 | 0 |
| 11.1 | 6 | 0 | 0 | 0 | 0 | 0 |
| 11.2 | 11 | 0 | 0 | 0 | 0 | 0 |
| §12 | 13 | 0 | 0 | 0 | 0 | 0 |
| §13 | 5 | 0 | 0 | 0 | 0 | 0 |
| §14 | 37 | 0 | 0 | 6 | 0 | 0 |
| 14.1 | 4 | 0 | 0 | 0 | 0 | 0 |
| 15.1 | 28 | 0 | 0 | 0 | 0 | 0 |
| 15.2 | 12 | 0 | 0 | 0 | 0 | 0 |
| 16.1 | 10 | 0 | 0 | 0 | 0 | 0 |
| 16.2 | 58 | 0 | 0 | 0 | 0 | 0 |
| §17 | 83 | 2 | 0 | 0 | 0 | 0 |
| §18 | 8 | 0 | 0 | 0 | 0 | 0 |
| §19 | 0 | 0 | 21 | 0 | 0 | 0 |
| Round 2b | 0 | 0 | 4 | 0 | 0 | 0 |
| §20 | 0 | 0 | 8 | 0 | 0 | 0 |
| Round 3a | 0 | 0 | 2 | 0 | 0 | 0 |
| Round 4a | 0 | 0 | 11 | 0 | 0 | 0 |
| Round 5a | 0 | 0 | 11 | 0 | 0 | 0 |
| Round 6a | 0 | 0 | 2 | 0 | 0 | 0 |
| P5 | 0 | 0 | 1 | 0 | 0 | 0 |
| P5d | 0 | 0 | 4 | 0 | 0 | 0 |
| **all** | 619 | 2 | 93 | 10 | 0 | 0 |

STOPs of this pass: **none** (⛔ STOP PR-C-n: none raised). No passage in §8–§20 carried two brackets that left a conflict open: every amended passage has one latest ruling, and the stale sentences a later ruling had superseded without an edit are repaired by the latest-wins rule (§1.2).

### 1.1 Seat 2's repairs to seat 1's text (header..§7), each logged in §3
1. **PR5 (§1)** "(h) PR's own WILL gate, by a magistrate's step (§10.5)" → "by a magistrate's lean (§10.5)" — the magistrate's "one step for a season" was struck at P5 (B322; OD-PR-52: the lean `min(1, WILL_SHARE × mult)` in the weeks the exertion stands, never a band step), which seat 1's §3.1 already states.
2. **THE READER'S GUIDE item 3 (WHAT IT READS)** — completed on the CH/PT verifiers' check (no "only"/"every" unless the text has no exception): "BELIEF for every decision" → "BELIEF for the courts' decisions", the belief reads the text names added (the holder's own belief record of a den, §5.1; fame at the riders' town `fameIn`, §8.1; the sightings a look writes, §9.2 (b); the crown's hold as each decider believes it, §10.3 (d)), the truth reads added (the encounter's MET and its catch, PR7/§8.1; the witness, PR10/§6.5; the gleaning roll's sign on the ground, §5.5; the envelope's four gates, each its own truth, PR3/§3.1; the capacity model, PR3/§6.6), and the fallback named (every belief read returns the truth where beliefs are dark and inside the town's land under the omniscient arm, §5.1, §10.1 (a), §12). No new decision.
Searched as §8–§20 were read whole, the other late brackets touching header..§7 were already folded by seat 1: the `patrol` token struck (r6 A.2 — §0.1, PR16, §5.5), `swept` (r6 B.3 — §2.6, §2.7, §7.6), `believedWatch`'s producer (3) (P5 — §2.6), the magistrate's `patrol_will` lean (P5 — §3.1), `MIGHT_LATENT` (P5 — §5.2).

### 1.2 Latest-wins repairs inside seat 2's range (a stale sentence a later ruling superseded, the text of record not updated), each logged in §3
- §14.1's PR-2 row "`routeNetworkConsumers` 540 (+0: the declared token `patrol`, r5)" → "(+0: untouched — no token, no pin, OD-PR-47)" (r6 A.2: B378, B382, B383 struck the r5 token).
- §16.2 R52 "(passing the declared kind `patrol`)" and "(no hidden kind passed — `mayUseHiddenPaths` fails closed)" → "(admitted by PR's own leaf read of `knownTrailsOf` — never a traveller token, §5.5)" and "(PR's leaf admits no such hop, and no kind is ever passed to `mayUseHiddenPaths`, which fails closed)" (r6 A.2).
- §15.2's row "`weeksCovered` (↳ r6: `swept`) · … · ~~`patrol` as a `HIDDEN_PATH_KINDS` token~~ (STRUCK …)" → "`weeksCovered` · `swept` · … — and no access token (`patrol` is never a `HIDDEN_PATH_KINDS` token)".
- §17 OD-PR-1 "chain C16 after C14 · C15 (the chair's order note)" → "…, adjacent (the three share the border gate and the fort), behind the map's M-W2 and the war layer's lighting (§14)" (the vetoable ruling applied in §14, B358).
- §17 OD-PR-3 "a magistrate's step — `fortWill` STRUCK, A.1" and OD-PR-30 "a magistrate's will step" → the `patrol_will` lean, never a band step (P5 C.19, B322, OD-PR-52); no `fortWill` (OD-PR-41).
- §17 OD-PR-16 "five named producers" → "the named producers of §8.3, the travellers' return none until a volume carries it (OD-PR-52)" (P5 C.19, B256).
- §17 OD-PR-26 "for an unasked sweep or a ride past (A.8)" → "for an unasked sweep on the lord's own need (`swept`, ⭐ OD-PR-50) or a ride past" (r6 B.3, B463).
- §17 ⭐ OD-PR-50's "↳ r6: ONE more count `swept?`" folded into the pair `{ seasonStartTick, weeks, swept? }` and one clause.
- §17 ⭐ OD-PR-51: the struck r5 text removed; the row shows only its re-ruling (r6 A.2), "supersedes OD-PR-51 of 2026-10-19" in the Ruled column.
- §17 STOP-PR-r4-1: the row states the ruling's final text (the two proposals the ruling declined dropped).
- §17 OD-PR-52 gains ES-2b's OPENED status with its date (the six `[OPENED 2026-10-20 by delegation (P5 A.2); the wave order stands]` stamps of §8.2, §11.2, R16, R17 dropped from the running text; their date and ruling move to this row).

## 2. THE SECTION MAP (old → new; complete)
Old lines 1–15 → the new 4-line header (title verbatim; old lines 4–5 restated with the status line's design facts) + THE READER'S GUIDE (new, 8 items) + the dispatch-gate line; old lines 3 and 6–12 → `history/PR-cure-record.md` Part 1, verbatim. THE OWNER'S WORDS and THE ANSWER keep their place. Old §0–§18 → new §0–§18 with the same numbers, titles and subsections (§0.5's title loses "(each bracketed where it sits)"; §13's heading loses its bracket; §15.2's heading "(fold §5 rows THE PATROLS asks the fold lane to add at P4; …)" → "(the fold §5 rows THE PATROLS registers; …)"), so every "§x" resolves unchanged. Inside them: old §8.2's `↳` table row → folded into the envoy row's cell; old §16.1's "The round-4 fields" / "The round-5 field" → "The fork and hunt fields" / "The season-ledger field"; old §17 → §17 with a fourth column, **Ruled** (date · amended/re-ruled dates · by delegation · vetoable · the owner's mark), the STOP-PR-0/1/2 and STOP-PR-r4-1 rows kept as ruled rows ("(ruled)", their ⛔ dropped), ⭐ OD-PR-51 showing only its re-ruling, and THE OPEN STOPS line (none). Old §19 OPEN QUESTIONS FOR THE CHAIR → new §19 OPEN QUESTIONS: the four questions still open (old round-5a Q3–Q6, renumbered 1–4) and one line naming the two answered (Q1 by r6 A.2, Q2 by r6 B.3); old §19 whole → cure record Part 3, verbatim. Old §20 THE CURE RECORD → cure record Part 2, verbatim; new §20 THE REVIEW TRAIL (one line) + "END OF VOLUME.". Checked by script: every bare "§x" in the new text names a heading of the new text (the only misses, "§15.12" and "§4.7", are PL's sections cited as "PL §4.7 F.3, §15.12" and "PL §2, §4.7 F.1"); every reference to another volume is by its section.

## 3. TEXT CORRECTIONS THAT ARE NOT MARKERS (wording only; each keeps the latest ruling)
Ruling-file tags (RULINGS-ROUND…, RULINGS-AFTER-RESEARCH, RULINGS-P5/P6, A.n, B.n, F.n, Q-n, open-question numbers), finding ids (PR-r2-n, PR-V/W/X-n, P5C-n, SEAMS-…, HOST-r2-n, SX-08, CH-r1-4, PT-r1-2, PL-V4/V5), "the chair", "the fold lane", "CHAIR-NOTES n", "round n", "r4:"-style comparisons, "as cured in round n", "(ROUTED)", "P5"/"P6c" provenance and running-text dates removed by asserted substitution; where a tag stood for a ruling, the ruling's OD id or section is cited instead (OD-PR-1, -14, -15, -19, -41, -43, -47; §10.3's sub-items; "PL §4.7 F.n" where a heading carried RULINGS-ROUND3's §F label, PL §4.7's own labels F.1–F.7). Unattributed ruling quotations are restated as sentences or attributed (ST, OD-PR-19, §10.3 (f)). Every substitution, in order (seat 1's, then seat 2's from §8):
- §0: "measured first by this seat at master `81f1cd963`" → "measured first at the compile, at master `81f1cd963`"
- §0: "`facets.manpower` is NOT the pool (PR-r2-2) |" → "`facets.manpower` is NOT the pool |"
- §0: "ZERO lines (STOP-PR-1, RULED: the slow half alone" → "ZERO lines (ruled, §17: the slow half alone"
- §0: "THE HIDDEN WAYS ARE THIS RUNG (RULINGS-ROUND5 B.4)" → "THE HIDDEN WAYS ARE THIS RUNG (OD-PR-47)"
- §0: "(`routeEdgeId(a, b, 'way')`, RULINGS-ROUND6 A.2)" → "(`routeEdgeId(a, b, 'way')`)"
- §0: "(fold §5 row `patrol`; OD-FC-2 ↳)" → "(fold §5 row `patrol`; OD-FC-2)"
- §0: "**MN §5.5** `menaceCounterTerms`, as re-cured in round 2: slot (2)" → "**MN §5.5** `menaceCounterTerms`: slot (2)"
- §0: "(MN §3.3 as REFINED in round 4 under CHAIR-NOTES 18 (d): "the composer" → "(MN §3.3: "the composer"
- §0: "the levy draws riders, never a keep (A.1)"" → "the levy draws riders, never a keep""
- §0: "- **RULINGS-ROUND3 §F THE BANNER and RULINGS-ROUND4 A.7** — the owner's ~19:2x word made a design" → "- **THE BANNER** (OD-PR-26) — the owner's ~19:2x word made a design"
- §0: "(§10.3 carries it; PR11 is rewritten)" → "(§10.3 carries it; PR11 states it)"
- §0: "(BD §7.1). And from round 5 (RULINGS-ROUND5): the hidden ways" → "(BD §7.1). And the hidden ways"
- §0: "— one seam, one price" (B.4; BD §5.2:" → "— one seam, one price" (BD §5.2:"
- §0: "— CONFIRMED at master by this lane);" → "— CONFIRMED at master);"
- §0: "never to any retained warden" (B.13); ONE HUNT, ONE DEED (B.5); THE NET never lends zero at a strong hold (B.8); THE BANNER's cover a season" → "never to any retained warden"; ONE HUNT, ONE DEED (§7.2, §9.3); THE NET never lends zero at a strong hold (§10.3 (c)); THE BANNER's cover a "
- §0: "… Until THE PATROLS lands, the read answers `true`"; RULINGS-ROUND2 C.Q1: "PR OWNS `witnessedCrossing`"." → "… Until THE PATROLS lands, the read answers `true`"; PR OWNS `witnessedCrossing` (OD-PR-13)."
- §0: "- **CHAIR-NOTES 11** (plague-R7): a quarantine verb" → "- **The quarantine verb** (plague-R7): a quarantine verb"
- §0: "- **RULINGS-ROUND2 E** — each existing volume" → "- **The coverage line** — each existing volume"
- §0: "- **The one thing still owed** (CHAIR-NOTES 13 as corrected by RULINGS-ROUND2b HOST-r2-1): travel's" → "- **The one thing still owed**: travel's"
- §0: "never mints the army interception's kinds (PR-r2-10) |" → "never mints the army interception's kinds |"
- §0: "(`DESIGN_FP_ARCH_BD.md`, compiled 2026-10-18) and its routes" → "(`DESIGN_FP_ARCH_BD.md`) and its routes"
- §0: "(W-NAVY, owner-commissioned 2026-07-15):**" → "(W-NAVY, owner-commissioned):**"
- §1: "a shared leaf-first car (RULINGS-ROUND3 A.3) —" → "a shared leaf-first car (OD-PR-43) —"
- §1: "Named travellers' rolls live in the frozen roads kernel and feel patrols only through the slow half — RULED (STOP-PR-1): the slow half alone" → "Named travellers' rolls live in the frozen roads kernel and feel patrols only through the slow half — ruled (§17): the slow half alone"
- §1: "PT's `party_gate` widened to WHERE `road` (STOP-PR-2, RULED);" → "PT's `party_gate` widened to WHERE `road` (ruled, §17);"
- §1: "(THE BODIES' one known set `knownTrailsOf`, RULINGS-ROUND5 B.13)" → "(THE BODIES' one known set `knownTrailsOf`)"
- §1: "the home's minimum (RULINGS-ROUND5 B.8, §10.3 (c))" → "the home's minimum (§10.3 (c))"
- §1: "Members never cross by the charter, whose passage is tolls only (PL §4.5)." → "Members never cross by the charter, whose grant is tolls only (`toll_exemption`, PL §4.5)."
- §1: "— PS §4.1, RULINGS-ROUND3 A.2) and," → "— PS §4.1) and,"
- §1: "H13 carries the map's patrol inputs) (the chair's ruling: never "opens H16");" → "H13 carries the map's patrol inputs) — never "opens H16";"
- §1: "(H11's re-version; CHAIR-NOTES 13 as corrected)" → "(H11's re-version)"
- §1: "untouched by PR (r5's "the riders' declared hidden token `patrol` joins … (OD-PR-51)" is STRUCK)" → "untouched by PR, and the riders declare no hidden token"
- §1: "(the DM's wages band is a CEILING over the purse's band, §3.1 — RULINGS-ROUND2b ST-r2-1's one band law)" → "(the DM's wages band is a CEILING over the purse's band, §3.1 — ST's one band law)"
- §1: "(fold requirement 16's bracket)" → "(fold requirement 16)"
- §1: "`confiscation`, PR-r2-23)" → "`confiscation`)"
- §1: "(CHAIR-NOTES 2's push budget)" → "(the push budget)"
- §1: "(h) PR's own WILL gate, by a magistrate's step (§10.5)" → "(h) PR's own WILL gate, by a magistrate's lean (§10.5)"
- §2: "behind its toggle; CHAIR-NOTES 20 (b): the dossier is a reader)" → "behind its toggle; the dossier is a reader)"
- §2: "the `STRENGTH_BANDS` keys MN mints (SMN-28; the J-CNC-5 keys;" → "the `STRENGTH_BANDS` keys MN mints (the J-CNC-5 keys;"
- §2: "(a map-side slot the fold's INBOX records, A.14; cells are optional placement data, never asserted — HOST-r2-17's rule)" → "(a map-side slot the fold's INBOX records; cells are optional placement data, never asserted)"
- §2: "(the stretch-keyed action token and the report credit that feeds it; ROUTED), the term DARK" → "(the stretch-keyed action token and the report credit that feeds it), the term DARK"
- §2: "its OFFICE'S WAYS"; RULINGS-ROUND5 B.13)" → "its OFFICE'S WAYS")"
- §2: "(BD §2.3; BD's round-5 route to PR (d))" → "(BD §2.3)"
- §2: "stand beside theirs, §10.5, RULINGS-ROUND3 A.1)" → "stand beside theirs, §10.5, OD-PR-41)"
- §2: "(`refs/MAP-REPLY-HIDDEN-WAYS-2026-10-18.md`; RULINGS-ROUND4 §E)" → "(`refs/MAP-REPLY-HIDDEN-WAYS-2026-10-18.md`)"
- §2: "every rung ×2 and hidden; RULINGS-ROUND6 A.2)" → "every rung ×2 and hidden)"
- §2: "("ONE read over ONE ladder (B.4) … never" → "("ONE read over ONE ladder … never"
- §2: "`hashInt` is no landed helper — PR-V9)" → "`hashInt` is no landed helper)"
- §2: "so two clocks would part — HOST-r2-6)" → "so two clocks would part)"
- §2: "(the sixth actor kind, RULINGS-ROUND4 A.12)" → "(the sixth actor kind)"
- §2: "nobody copies (RULINGS-ROUND5 B.12)" → "nobody copies"
- §2: ""A BODY sees one banner", RULINGS-ROUND3 F.4)" → ""A BODY sees one banner")"
- §2: "PR's `trailWatchOf` and CH's routing all call it", RULINGS-ROUND5 B.13)" → "PR's `trailWatchOf` and CH's routing all call it")"
- §2: "(§10.3 (f); RULINGS-ROUND5 B.9: "The banner's record" → "(§10.3 (f); ⭐ OD-PR-50: "The banner's record"
- §2: "with THREE drop-when-absent fields added in round 4 (`forkSince`" → "with THREE drop-when-absent fields (`forkSince`"
- §2: "and ONE in round 5 (`weeksCovered` on `placement`" → "and a fourth (`weeksCovered` on `placement`"
- §2: "(the travellers' return receipts are STRUCK until a mover's owner carries them" → "(the travellers' return receipts are no producer until a mover's owner carries them"
- §3: "`< 0.8` `funded` · else `lavish`, ST §2.4; ST exports it, done in ST's round 2b)" → "`< 0.8` `funded` · else `lavish`, ST §2.4; ST exports it)"
- §3: "(RULINGS-ROUND2b ST-r2-1: one band law for sites and riders)" → "(ST's one band law for sites and riders)"
- §3: "(RULINGS-ROUND2 D; the W-COIN inbox; its leaf-first car named there)" → "(the W-COIN inbox; its leaf-first car named there)"
- §3: "(§2.7, B.9)" → "(§2.7)"
- §5: "never a conclave by holder kind, whose site is a church's, RULINGS-ROUND4 A.3 —" → "never a conclave by holder kind, whose site is a church's —"
- §5: "ST §6.1 step 6c, RULINGS-ROUND5 A.1, the court's own act" → "ST §6.1 step 6c, the court's own act"
- §5: "(RULINGS-ROUND5 A.4 · A.5: "ST's record keeps only the TRUTH of the holder")" → "(ST: "ST's record keeps only the TRUTH of the holder")"
- §5: "(`keptSecret`, ST §2.4 — the map's `hidden` word was withdrawn there)" → "(`keptSecret`, ST §2.4 — never the map's `hidden` word)"
- §5: "makes no `den_unanswered` (RULINGS-ROUND4 A.16)" → "makes no `den_unanswered`"
- §5: "one vocabulary, MN's bracket (RULINGS-ROUND2b open question 6)" → "one vocabulary, MN's"
- §5: "PS keeps the home-defence battle (RULINGS-ROUND2b open question 1)" → "PS keeps the home-defence battle"
- §5: "(BD §7.1 as cured in round 5: "OTHERWISE" → "(BD §7.1: "OTHERWISE"
- §5: "the learned set and the office's ways, B.13)" → "the learned set and the office's ways)"
- §5: "— one seam, one price (B.4).**" → "— one seam, one price.**"
- §5: "(`routeEdgeId(a, b, 'way')`, RULINGS-ROUND6 A.2) on its own leaf" → "(`routeEdgeId(a, b, 'way')`) on its own leaf"
- §5: "the DM's act — RULINGS-ROUND5 B.6; lit with `bodyEffectsEnabled`, B.16)" → "the DM's act; lit with `bodyEffectsEnabled`)"
- §5: "(CH-V3's law, "two movers never share a record")" → "(CH's law, "two movers never share a record")"
- §5: "ONE HUNT, ONE DEED (RULINGS-ROUND5 B.5: "the hearing's OWNER mints:" → "ONE HUNT, ONE DEED ("the hearing's OWNER mints:"
- §5: "(RULINGS-ROUND5 B.13: "the office knowledge belongs" → "("the office knowledge belongs"
- §5: "never to any retained warden (CH's widening struck)")" → "never to any retained warden")"
- §5: "(BD's `hunt_taken` and its detachment, B.16)" → "(BD's `hunt_taken` and its detachment)"
- §6: "(MN §3.3 as REFINED in round 4 under CHAIR-NOTES 18 (d): "the composer is" → "(MN §3.3: "the composer is"
- §6: "What is suppressible is MN's sentence (MN §3.3, cured in round 2b):" → "What is suppressible is MN's sentence (MN §3.3):"
- §6: "(PS's feeder, widened to the destination's own land by RULINGS-ROUND2b open question 2)" → "(PS's feeder, widened to the destination's own land)"
- §6: ""the counterforce WORKING" (RULINGS-ROUND2b, MN's M50 wins)." → ""the counterforce WORKING" (MN's M50)."
- §6: ""… the hill road beyond the keep's reach …", A.1: the keep's own rows stay)" → ""… the hill road beyond the keep's reach …"; the keep's own rows stay)"
- §6: "never a route-wide MAX (RULINGS-ROUND2b PR-r2-5)," → "never a route-wide MAX,"
- §6: "| none — STOP-PR-1 RULED: the slow half alone now;" → "| none — ruled (§17): the slow half alone now;"
- §6: "never the town's riders (RULINGS-ROUND3 A.1) —" → "never the town's riders (OD-PR-41) —"
- §6: "— STOP-PR-1 RULED (the slow half alone; the fast half a C7 slot)." → "— ruled (§17): the slow half alone; the fast half a C7 slot."
- §6: "(+1; the half-keyed read, PR-V8), never a power-blind MAX: the gate keeps the gate (J385; RULINGS-ROUND2b HOST-r2-3)," → "(+1; the half-keyed read), never a power-blind MAX: the gate keeps the gate (J385),"
- §6: "recorded by ONE fold §3.1 EC INBOX row (ROUTED), DARK until EC names it" → "recorded by ONE fold §3.1 EC INBOX row, DARK until EC names it"
- §6: "— the placement; the half-keyed read, PR-V8)" → "— the placement; the half-keyed read)"
- §6: "(the holder KNOWS the way — `knownTrailsOf`, B.13 — and" → "(the holder KNOWS the way — `knownTrailsOf` — and"
- §6: "**Seam: the opener, BEFORE its target loop** (RULINGS-ROUND2b PR-r2-1, completed by RULINGS-ROUND3 B PR-V1)." → "**Seam: the opener, BEFORE its target loop.**"
- §6: "(+1, PR-W2; §2.7)" → "(+1; §2.7)"
- §6: "(RULINGS-ROUND3 §E.3, RULINGS-ROUND4 A.5; OD-PR-41's one composition)" → "(OD-PR-41's one composition)"
- §7: "at the act's tick — the one leader record, B.12)" → "at the act's tick — the one leader record)"
- §7: "(the mission's close is the one door, B.5 — the body's" → "(the mission's close is the one door — the body's"
- §7: "THE TRIGGER IS THE FORK, never "`fielded` at `max`" (RULINGS-ROUND3 B PR-V3):" → "THE TRIGGER IS THE FORK, never "`fielded` at `max`":"
- §7: "(PL §4.7 F.6 (b) as cured in round 5)" → "(PL §4.7 F.6 (b))"
- §7: "write nothing (RULINGS-ROUND6 B.3: "never on a fellow" → "write nothing (PL: "never on a fellow"
- §8: "its TRAVELLERS' RETURN — STRUCK — NOT A PRODUCER" → "its TRAVELLERS' RETURN — NOT A PRODUCER"
- §8: "against the gate's own fraction along the leg, §2.2 — PR-V8)" → "against the gate's own fraction along the leg, §2.2)"
- §8: "in the spy's row of §8.2 (never twice, PR-r2-9);" → "in the spy's row of §8.2 (never twice);"
- §8: "(the landed `ExclusionEdge`, widened to actor refs — RULINGS-AFTER-RESEARCH §4) × 2" → "(the landed `ExclusionEdge`, widened to actor refs) × 2"
- §8: "the ONE read over the ONE ladder (master's hidden rung, B.4);" → "the ONE read over the ONE ladder (master's hidden rung);"
- §8: "(`caught · uncaught`; RULINGS-ROUND2b open question 3, RULED). ES §3.3's J-ES-1" → "(`caught · uncaught`; ruled, OD-PR-15). ES §3.3's J-ES-1"
- §8: "chance of getting caught") — the fold lane's, per the chair |" → "chance of getting caught") — the fold's to write |"
- §8: "ES-2b — OPENED by delegation 2026-10-20 (P5 A.2), no longer the owner's slot;" → "ES-2b — OPENED by delegation, no longer the owner's slot;"
- §8: "; a new custody shape would be the owner's row) (RULINGS-ROUND2 A.11's class);" → "; a new custody shape would be the owner's row);"
- §8: "the engine never harms an envoy | PS | | ↳ | — | the `stopped` envoy's week RIDES" → "the engine never harms an envoy; the `stopped` envoy's week RIDES"
- §8: "re-plans only from an `arrived` cursor — A.6); ONE shared verb, minted by whichever of OP-1 and PR's stop wave lands first, the other regist" → "re-plans only from an `arrived` cursor); ONE shared verb, minted by whichever of OP-1 and PR's stop wave lands first, the other registering "
- §8: "SEIZED only when custody lands — ES-2b, OPENED by delegation 2026-10-20 (P5 A.2): LIVE DESIGN" → "SEIZED only when custody lands — ES-2b, OPENED by delegation: LIVE DESIGN"
- §8: "until that wave lands NO engine custody (RULINGS-ROUND2 A.11) and" → "until that wave lands NO engine custody and"
- §8: "no new kind (STOP-PR-2 RULED, RULINGS-ROUND2b; PT's row and PR's cite)" → "no new kind (ruled, OD-PR-14; PT's row and PR's cite)"
- §8: "`escortedOn`'s fall), ROUTED; DARK until WY carries it" → "`escortedOn`'s fall); DARK until WY carries it"
- §8: "never on a road (RULINGS-ROUND3 B, PT's row) | PT |" → "never on a road (PT's row) | PT |"
- §8: "RN keys it `u:<unitKey>`, RULINGS-ROUND2b SEAMS-r2-6)" → "RN keys it `u:<unitKey>`)"
- §8: "whoever's they are ("A BODY sees one banner … deterrence by belief; never the ownership", RULINGS-ROUND3 F.4)." → "whoever's they are (THE BANNER, §10.3 (f): a body sees one banner — deterrence by belief, never by ownership)."
- §8: "read through THE BODIES' `hiddenWayEdges` (B.4), open only" → "read through THE BODIES' `hiddenWayEdges`, open only"
- §8: "(RULINGS-ROUND2b open question 3, RULED); the fold lane brackets ES §3.3's J-ES-1" → "(ruled, OD-PR-15); the fold brackets ES §3.3's J-ES-1"
- §9: "one week, no refund (RULINGS-ROUND3 A.2; PS §4.1 owns the helper," → "one week, no refund (PS §4.1 owns the helper,"
- §9: "every hold of one march, passage, fort or screen, shares it: RULINGS-ROUND2b open question 4);" → "every hold of one march, passage, fort or screen, shares it);"
- §9: "by Bound 1 alone, the termination law (RULINGS-ROUND3 A.2: "PS9's Bound 2 … binds ONLY where THE PASSAGE is lit")" → "by Bound 1 alone, the termination law (PS9's Bound 2 binds ONLY where THE PASSAGE is lit)"
- §9: "the unit's KEY is its deployment id, stable across the held week (RULINGS-ROUND2b PS-r2-3 — never `departTick`)" → "the unit's KEY is its deployment id, stable across the held week (never `departTick`)"
- §9: "keeps the home-defence battle (RULINGS-ROUND2b open question 1: "PR hosts the SCREEN card (PS1); PS keeps the home-defence battle")." → "keeps the home-defence battle (PR hosts the SCREEN card, PS1; PS keeps the home-defence battle — OD-PR-19)."
- §9: "never as its garrison — A.1; WC-5's call-ins go out)" → "never as its garrison; WC-5's call-ins go out)"
- §9: "never by the holder's riders (ST10; RULINGS-ROUND3 A.1);" → "never by the holder's riders (ST10; OD-PR-41);"
- §9: "one more wherever `max` allows (§3.2; PR-r2-3)" → "one more wherever `max` allows (§3.2)"
- §9: "whose rows stay (A.1)." → "whose rows stay (OD-PR-41)."
- §9: "`WC-car-0 THE CHOOSER'S SIGNAL CAR` (SX-08), cut before" → "`WC-car-0 THE CHOOSER'S SIGNAL CAR`, cut before"
- §9: "found only with a keyed draw, `LOOK_FIND_SECRET` 0.3)" → "found only with a keyed draw, `LOOK_FIND_SECRET` 0.3 — never `hidden`, ST's withdrawn word and THE BODIES' `hiddenWays` homonym; the name is"
- §9: "the institution events PT-r1-2 maps, a raid," → "the institution events PT maps, a raid,"
- §9: "MN's `believedMenaces` (a MENACE) and BD's `believedBodyOf` (a BODY) READ (RULINGS-ROUND6 B.2: "PR's look and the at-hand witness write thro" → "MN's `believedMenaces` (a MENACE) and BD's `believedBodyOf` (a BODY) READ (PR's look and the at-hand witness write through it)"
- §9: "writes nothing (RULINGS-ROUND5 A.5: "A sighting row `{ id, mightBand, tick }` is written INTO the sighting court's belief record … never ont" → "writes nothing (a sighting row `{ id, mightBand, tick }` is written INTO the sighting court's belief record, never onto ST's holder object; "
- §9: "(RULINGS-ROUND4 A.17: "a patrol's look" refreshes it; "never a live truth read, never a second belief")" → "(a patrol's look refreshes it — never a live truth read, never a second belief)"
- §9: "is the at-hand court's WITNESS (A.16);" → "is the at-hand court's WITNESS;"
- §9: "riding ST's and PT's doors (CHAIR-NOTES 3's batched, non-blocking suggestions)" → "riding ST's and PT's doors (batched, non-blocking suggestions)"
- §9: "**(f) A QUARANTINE THE HOST SETS** (CHAIR-NOTES 11; plague-R7):" → "**(f) A QUARANTINE THE HOST SETS** (plague-R7):"
- §9: "means the involved SETTLEMENTS, RULINGS-AFTER-RESEARCH §5)" → "means the involved SETTLEMENTS)"
- §9: "the hearing's owner minting (RULINGS-ROUND5 B.5):" → "the hearing's owner minting:"
- §9: "for no court has fame — RN1, RULINGS-ROUND3 A.4; B.5: "an UNLED patrol clash mints `patrol_clash`'s own deed with the TOWN as doer");" → "for no court has fame — RN1);"
- §9: "from the verdict record (RN's rule, B of RULINGS-ROUND2);" → "from the verdict record (RN's rule);"
- §10: "Feuding members share no eyes (RULINGS-ROUND3 F.6)." → "Feuding members share no eyes (§10.3 (h))."
- §10: "an ally's width RISES while it is itself at war — RULINGS-ROUND2b PS-r2-1)" → "an ally's width RISES while it is itself at war)"
- §10: "(a believed `hostile`, (a), (f)) (PS §5.5 as cured in round 5, its minor (g))." → "(a believed `hostile`, (a), (f)) (PS §5.5)."
- §10: "The charter grants tolls, not passage (PL §4.5)." → "The charter grants tolls only (`toll_exemption`, PL §4.5), never leave to cross."
- §10: "on its own roads (RULINGS-ROUND3 F.1: "the home has FIRST CALL and takes charge on its own roads"):" → "on its own roads, and takes charge there (§10.3 (a)):"
- §10: "A den on a shared border is ONE contest (RULINGS-ROUND4 A.18, ST's rule):" → "A den on a shared border is ONE contest (ST's rule):"
- §10: "inteh vassal chain with a home local font thet is their home settlement"; RULINGS-ROUND3 §F.1–F.7; items 7, 12(e))" → "inteh vassal chain with a home local font thet is their home settlement"; PL §4.7 F.1–F.7; items 7, 12(e))"
- §10: "**(a) ONE HOME, A STACK OF BANNERS (F.1).**" → "**(a) ONE HOME, A STACK OF BANNERS (PL §4.7 F.1).**"
- §10: "**(b) THE CALL — NEVER SKIPPING A LORD'S ROW (F.1, as RE-RULED).**" → "**(b) THE CALL — NEVER SKIPPING A LORD'S ROW (PL §4.7 F.1, PL §4.1).**"
- §10: "**(c) ONE SHARE LAW, AND A LEND THAT NEVER READS ZERO AT A STRONG HOLD (F.2; RULINGS-ROUND5 B.8).**" → "**(c) ONE SHARE LAW, AND A LEND THAT NEVER READS ZERO AT A STRONG HOLD (PL §4.7 F.2).**"
- §10: "(PL §4.7 F.2 as cured in round 5: "PL4's" → "(PL §4.7 F.2: "PL4's"
- §10: "no member with two or more riders lends 0 at a strong hold (0 rows; under r4 a town lent 0 below `strong` and every sub-vassal 0)," → "no member with two or more riders lends 0 at a strong hold (0 rows),"
- §10: "lends 1 at hold 0.60 (r4: 0), ten town vassals at `strong` lend 10 (r4: 0; PL's r4 Σ-then-floor 9)." → "lends 1 at hold 0.60, ten town vassals at `strong` lend 10."
- §10: "**(d) THE LINE BLURS BY THE HOLD (F.3).**" → "**(d) THE LINE BLURS BY THE HOLD (PL §4.7 F.3).**"
- §10: "is THE PASSAGE's jurisdiction read (F.3: "PS's jurisdiction read for same-kingdom riders reads the hold"):" → "is THE PASSAGE's jurisdiction read (for same-kingdom riders it reads the hold):"
- §10: "(i) the member's OWN riders went to the levy (F.4: protection, (f));" → "(i) the member's OWN riders went to the levy (protection, (f));"
- §10: "PL's summons; no kind of PR's** (F.1's call, rung by rung, (b))." → "PL's summons; no kind of PR's** (the call rung by rung, (b))."
- §10: "in `FEALTY_EPISODE_PREFIXES` (RULINGS-ROUND3 B, PL-V4: "riders and a retained company are units; harbouring them is priced")" → "in `FEALTY_EPISODE_PREFIXES` (PL's rule: riders and a retained company are units; harbouring them is priced)"
- §10: "light under `polityObligationsEnabled` (RULINGS-ROUND3 A.5)." → "light under `polityObligationsEnabled`."
- §10: "RECORDED AS A DEED (F.4).**" → "RECORDED AS A DEED (PL §4.7 F.4).**"
- §10: "THE BANNER'S SEASON LEDGER (RULINGS-ROUND5 B.9):" → "THE BANNER'S SEASON LEDGER:"
- §10: "the own-need count PL's sweep reads, RULINGS-ROUND6 B.3)" → "the own-need count PL's sweep reads)"
- §10: "the count never enters — PL-V5's principle)" → "the count never enters)"
- §10: "(PL F.4's REFINED clause)" → "(PL F.4's late-occasion clause)"
- §10: "THE GAP CLOSED (F.5).**" → "THE GAP CLOSED (PL §4.7 F.5).**"
- §10: "**(h) COUNTERFORCES (F.6).**" → "**(h) COUNTERFORCES (PL §4.7 F.6).**"
- §10: "(§7.6; PL §4.7 F.6 (b) as cured in round 5);" → "(§7.6; PL §4.7 F.6 (b));"
- §10: "**(i) THE SURFACE (F.7).**" → "**(i) THE SURFACE (PL §4.7 F.7).**"
- §10: "INBOX rows for WY and POP (ROUTED); PR KEEPS the field" → "INBOX rows for WY and POP; PR KEEPS the field"
- §10: "(a border hearing, not a screen; RULINGS-ROUND2b Q1 gives PR only the screen's card)" → "(a border hearing, not a screen; PR hosts only the screen's card)"
- §10: "holding no office adds no way (RULINGS-ROUND5 B.13) — and" → "holding no office adds no way — and"
- §10: "no cover-identity term exists, PR-V4)" → "no cover-identity term exists)"
- §10: "(ST §7.4's row; RULINGS-ROUND3 A.1, which corrects the chair's L-PR item 3 "the fort's road-danger-down effect IS its patrols")" → "(ST §7.4's row; OD-PR-41, which corrects the brief's item 3, "the fort's road-danger-down effect IS its patrols")"
- §10: "**SITES CONSIDERED** (RULINGS-ROUND2 E; ST §7.4's coverage row for PR, "BY BOTH")" → "**SITES CONSIDERED** (ST §7.4's coverage row for PR, "BY BOTH")"
- §11: "a body `{ kind: 'body', id }`, RULINGS-ROUND4 A.12), or `round`" → "a body `{ kind: 'body', id }`), or `round`"
- §11: "the effective band is the lower of this and the purse's band — RULINGS-ROUND2b ST-r2-1)" → "the effective band is the lower of this and the purse's band)"
- §11: "crossing its land (the screen; Q1), a BODY" → "crossing its land (the screen), a BODY"
- §11: "never a sixth WHERE kind — the fold registers the key, SEAMS-r4-16);" → "never a sixth WHERE kind — the fold registers the key);"
- §11: "`settlement · person · party · menace · corps · body` (RULINGS-ROUND4 A.12, amending RULINGS-ROUND3 A.7's five; RULINGS-ROUND3 §G.3);" → "`settlement · person · party · menace · corps · body`;"
- §11: "never an actor — A.7) |" → "never an actor) |"
- §11: "for an envoy the riders stop — PR-r2-10; `armed_incursion`" → "for an envoy the riders stop; `armed_incursion`"
- §11: "the riders' screen is PR's card — Q1);" → "the riders' screen is PR's card);"
- §11: "reads "an army or a detachment", Q6);" → "reads "an army or a detachment");"
- §11: "at WHERE `road` (`caught · uncaught`, Q3);" → "at WHERE `road` (`caught · uncaught`);"
- §11: "(a `party_warrant` stands at the court's town — RULINGS-ROUND3 B, PT's row) (STOP-PR-2 RULED; PR-r2-13);" → "(a `party_warrant` stands at the court's town — PT's row) (ruled, OD-PR-14);"
- §11: "for the crown's call on a member's riders (PR-r2-17);" → "for the crown's call on a member's riders;"
- §11: "(ES-2b, OPENED by delegation 2026-10-20 (P5 A.2), admits only the shapes as written — §8.2's paragon row among them, an envoy not; SEAMS-r2-" → "(ES-2b, OPENED by delegation, admits only the shapes as written — §8.2's paragon row among them, an envoy not)"
- §11: "the counterparty rides the `subject` dial (RULINGS-AFTER-RESEARCH §4's actor convention)." → "the counterparty rides the `subject` dial (the actor convention)."
- §11: "(the fold restates it at P4; `patrol_order` is withdrawn — PR-r2-17)." → "(the fold restates it; there is no `patrol_order` kind — the crown's call on a member's riders is PL's summons, §10.3 (e))."
- §12: "— BD's `hunt_taken` card and its detachment (RULINGS-ROUND5 B.16; BD §9.11);" → "— BD's `hunt_taken` card and its detachment (BD §9.11);"
- §12: "for the riders' line on PL-5's summons (RULINGS-ROUND3 A.5: relief, protection and service rows);" → "for the riders' line on PL-5's summons (relief, protection and service rows);"
- §12: "for paragon encounters (CH-r1-4's lighting unit, OD-FC-39);" → "for paragon encounters (OD-FC-39's lighting unit);"
- §12: "THE SHARED PRESENCE COMPOSER (§6.1; RULINGS-ROUND3 A.3 — it lights when" → "THE SHARED PRESENCE COMPOSER (§6.1 — it lights when"
- §12: "**The omniscient default's arm, named (RULINGS-AFTER-RESEARCH §7):**" → "**The omniscient default's arm, named:**"
- §12: "BIRTH-DOOR CHECK (CHAIR-NOTES 9: a born campaign" → "BIRTH-DOOR CHECK (a born campaign"
- §12: "some targets drop out of reach, PR-V1)" → "some targets drop out of reach)"
- §12: "so the map may draw the banner's colour; RULINGS-ROUND3 F.7) }`" → "so the map may draw the banner's colour, §10.3 (i)) }`"
- §12: "no FP text supersedes a map derivation — the fold's §3.1.26 ↳ r2b):" → "no FP text supersedes a map derivation — the fold's §3.1.26):"
- §12: "the host is asked for nothing (the owner's decision of 2026-10-18)." → "the host is asked for nothing (the owner's decision in the host document)."
- §12: "beside "Kell's company slipped through unseen" (HOST-r2-6)." → "beside "Kell's company slipped through unseen"."
- §12: ""draw the host's patrol rows when sent; your legend changes then" (the chair's row at P4)." → ""draw the host's patrol rows when sent; your legend changes then" (the fold's row)."
- §14: "share the border gate and the fort (RULINGS-ROUND2b open question 7, RULED); after C0 · C0.5 · C1 — and, by CHAIR-NOTES 18 (c) (vetoable; th" → "share the border gate and the fort (OD-PR-1); after C0 · C0.5 · C1 — and, by a vetoable ruling under the owner's "i leave to your recommenda"
- §14: "C14 still beside it; the fold's §6 states the order at P4;" → "C14 still beside it; the fold's §6 states the order;"
- §14: "Its map prerequisites, for the fold's §6 (HOST-r2-12's row):" → "Its map prerequisites, for the fold's §6:"
- §14: "(its manifest row and its text MN's, CHAIR-NOTES 18 (d));" → "(its manifest row and its text MN's, OD-PR-43);"
- §14: "cut before EC-17 as the first claimant's prerequisite — fold §3.1.23 ↳ P5):" → "cut before EC-17 as the first claimant's prerequisite — fold §3.1.23):"
- §14: "its text and its manifest row MN's, CHAIR-NOTES 18 (d); never a PR re-implementation)" → "its text and its manifest row MN's, OD-PR-43; never a PR re-implementation)"
- §14: "NAME THE LANDED CARRIERS (P5C-19):" → "NAME THE LANDED CARRIERS:"
- §14: "(`routeEdgeId(a, b, 'way')`, RULINGS-ROUND6 A.2)" → "(`routeEdgeId(a, b, 'way')`)"
- §14: "NONE on `routeNetworkConsumers.js` (the r5 `patrol` token in `TRAVELLER_KINDS` · `HIDDEN_PATH_KINDS` and its re-recorded pin are STRUCK — RU" → "NONE on `routeNetworkConsumers.js` (no `patrol` token joins `TRAVELLER_KINDS` or `HIDDEN_PATH_KINDS` and no pin is re-recorded — OD-PR-47; t"
- §14: "with its FREEZE mode — RULINGS-ROUND3 A.2) —" → "with its FREEZE mode) —"
- §14: "`swornLinkSuspended` reads (SEAMS-r2-20; THE BANNER's inputs)" → "`swornLinkSuspended` reads (THE BANNER's inputs)"
- §14: "(no PR kind, no fealty row of PR's — PR-r2-17);" → "(no PR kind, no fealty row of PR's);"
- §14: "and `bannerCoverOf`; it replaces the r3 `crownRiders.js`)" → "and `bannerCoverOf`; never a separate `crownRiders.js`)"
- §14: "went to the war" (F.7: the season the net covers" → "went to the war" (§10.3 (i): the season the net covers"
- §14: "rode freely last season" (F.5: the first sign of a broken rung)" → "rode freely last season" (§10.3 (g): the first sign of a broken rung)"
- §14: "THE LEGIBILITY PIN (CHAIR-NOTES 4):" → "THE LEGIBILITY PIN:"
- §14: "only where MN's owned unit is cut with PR-1, CHAIR-NOTES 18 (d))" → "only where MN's owned unit is cut with PR-1, OD-PR-43)"
- §14: "`routeNetworkConsumers` 540 (+0: the declared token `patrol`, r5)" → "`routeNetworkConsumers` 540 (+0: untouched — no token, no pin, OD-PR-47)"
- §15: "(each existing volume carries ONE "patrols considered" line citing its row, RULINGS-ROUND2 E)" → "(each existing volume carries ONE "patrols considered" line citing its row)"
- §15: "`delay` contract (§8.2's P6c row); a rescuer's exert moves no `patrol_will` (§3.1's P6c row);" → "`delay` contract (§8.2's envoy row); a rescuer's exert moves no `patrol_will` (§3.1);"
- §15: "when W-COIN's row lands (§7.1's P6c bracket);" → "when W-COIN's row lands (§7.1);"
- §15: "J-ES-1's amendment bracket is the fold lane's (the chair's ruling, Q3);" → "J-ES-1's amendment bracket is the fold's (OD-PR-15);"
- §15: "recorded by a fold §3.1 POP INBOX row (ROUTED);" → "recorded by a fold §3.1 POP INBOX row;"
- §15: "ONE fold §3.1 WY INBOX row records all three (ROUTED);" → "ONE fold §3.1 WY INBOX row records all three;"
- §15: "recorded by a fold §3.1 HB INBOX row (ROUTED);" → "recorded by a fold §3.1 HB INBOX row;"
- §15: "toward the member's IMMEDIATE liege (F.2, PL's row;" → "toward the member's IMMEDIATE liege (PL §4.7 F.2, PL's row;"
- §15: "PL §4.1 (ii); §10.3 (b) — STOP-PR-r4-1 as RE-RULED);" → "PL §4.1 (ii); §10.3 (b));"
- §15: "a sub-vassal through its liege's line (F.2, B.8);" → "a sub-vassal through its liege's line (PL §4.7 F.2);"
- §15: "read `bannerCoverOf`'s SEASON TALLY (F.4, B.9) and its SERVICE row credits lent riders (F.6)" → "read `bannerCoverOf`'s SEASON TALLY (PL §4.7 F.4) and its SERVICE row credits lent riders (PL §4.7 F.6)"
- §15: "with its one resentment patch (§7.6; F.6 (b), A.8);" → "with its one resentment patch (§7.6; PL §4.7 F.6 (b));"
- §15: "prices a PATROL's passage (PS's request, PL-V4)," → "prices a PATROL's passage (PS's request),"
- §15: "reads "the crown's riders" in PL's own disposition (SEAMS-r2-17) |" → "reads "the crown's riders" in PL's own text |"
- §15: "cut with whichever chain is cut first (A.3; CHAIR-NOTES 18 (d)) —" → "cut with whichever chain is cut first (OD-PR-43) —"
- §15: "ONE ACT, ONE DEED (B.5):" → "ONE ACT, ONE DEED:"
- §15: "`paragonLean(…, 'wildland', 'patrol_rider_quality')` (A.10)," → "`paragonLean(…, 'wildland', 'patrol_rider_quality')`,"
- §15: "never a warden merely retained, B.13);" → "never a warden merely retained);"
- §15: "through PT's `party_gate` at WHERE `road` (STOP-PR-2 RULED);" → "through PT's `party_gate` at WHERE `road` (ruled, OD-PR-14);"
- §15: "inside PS9's one cap where PS is lit (A.2);" → "inside PS9's one cap where PS is lit;"
- §15: "reaches the destination's own land (Q2);" → "reaches the destination's own land (§9.1 (c));"
- §15: "riders meeting riders PR's `patrol_engages` (PS §5.5, minor (g));" → "riders meeting riders PR's `patrol_engages` (PS §5.5);"
- §15: "a distinct feeder of the same capped suppressor (§10.5; RULINGS-ROUND3 A.1);" → "a distinct feeder of the same capped suppressor (§10.5; OD-PR-41);"
- §15: "and from round 5 — the known set read BY NAME (`knownTrailsOf`, B.13), the ways on master's hidden rung through `hiddenWayEdges` (B.4)," → "and — the known set read BY NAME (`knownTrailsOf`), the ways on master's hidden rung through `hiddenWayEdges`,"
- §15: "(fold §5 rows THE PATROLS asks the fold lane to add at P4; census" → "(the fold §5 rows THE PATROLS registers; census"
- §15: "`patrol_order` WITHDRAWN (PR-r2-17) |" → "`patrol_order` WITHDRAWN, never minted (§11.2) |"
- §15: "| the round-2b reads, leans and constants |" → "| reads, leans and constants |"
- §15: "`fortWill` STRUCK (A.1); PR's `fundingBandOfSettlement` WITHDRAWN — the one read is ST's `settlementFundingBand` (A.9) |" → "`fortWill` STRUCK (OD-PR-41: the keep's rows stand on their own); PR's `fundingBandOfSettlement` WITHDRAWN — the one read is ST's `settlemen"
- §15: "| the round-3 reads, the stamp's normalizer," → "| reads, the stamp's normalizer,"
- §15: "`beat` AVOIDED (the NEWS BEAT, CHAIR-NOTES 2 / WC §7.C)" → "`beat` AVOIDED (the NEWS BEAT, WC §7.C)"
- §15: "| the round-4 fields, reads, constants and veto reason (THE BANNER, THE HUNT, the trails, the fork's hold) |" → "| the fields, reads, constants and veto reason of THE BANNER, THE HUNT, the trails and the fork's hold |"
- §15: "| `weeksCovered` (↳ r6: `swept`) · `holderEyesOf` · `NET_HOME_MIN` · `GLEAN_BASE` · `GLEAN_CAP` · ~~`patrol` as a `HIDDEN_PATH_KINDS` token~" → "| `weeksCovered` · `swept` · `holderEyesOf` · `NET_HOME_MIN` · `GLEAN_BASE` · `GLEAN_CAP` | THE BANNER's season ledger's fields (⭐ OD-PR-50)"
- §15: "(RULINGS-ROUND6 A.2 strikes r5's declared token; the access law gains THE BODIES' `body` alone)." → "(the access law gains THE BODIES' `body` alone; OD-PR-47)."
- §15: "whose truth is CH's `paragon.leads`, B.12)" → "whose truth is CH's `paragon.leads`)"
- §16: "**The round-4 fields** (each drop-when-absent; declared as the owner's shape, OD-PR-44 · OD-PR-45):" → "**The fork and hunt fields** (each drop-when-absent; declared as the owner's shape, OD-PR-44 · OD-PR-45):"
- §16: "**The round-5 field** (drop-when-absent; declared as the owner's shape, ⭐ OD-PR-50):" → "**The season-ledger field** (drop-when-absent; declared as the owner's shape, ⭐ OD-PR-50):"
- §16: "`{ seasonStartTick, weeks, swept? }` (`swept` r6, B.3) |" → "`{ seasonStartTick, weeks, swept? }` |"
- §16: "— by PL's protection outcome (F.4) and the sweep arm of its precedence friction (F.6 (b) (i))" → "— by PL's protection outcome (PL §4.7 F.4) and the sweep arm of its precedence friction (PL §4.7 F.6 (b) (i))"
- §16: "never a weave incident since round 5, A.8; the riders' service is PL's own summons rows — PR-r2-17);" → "never a weave incident; the riders' service is PL's own summons rows);"
- §16: "the authored event's `noLook` (above, P5); the refused join's relationship patch (the one writer's row, `patrol_join_refused`, P5)." → "the authored event's `noLook` (above); the refused join's relationship patch (the one writer's row, `patrol_join_refused`)."
- §16: "beside a held keep "… the hill road beyond the keep's reach …" (A.1: the keep's rows stay);" → "beside a held keep "… the hill road beyond the keep's reach …" (OD-PR-41: the keep's rows stay);"
- §16: "(an id-less authored gang, ST §2.1 — the `band` holder kind struck by RULINGS-ROUND4 A.3)" → "(an id-less authored gang, ST §2.1 — never a `band` holder kind)"
- §16: "(ST §6.1 step 6d: the clearer named holds — RULINGS-ROUND5 A.3)" → "(ST §6.1 step 6d: the clearer named holds)"
- §16: "NO hold by the patrol — ES-2b, OPENED by delegation 2026-10-20 (P5 A.2), admits no envoy shape (§8.2);" → "NO hold by the patrol — ES-2b, OPENED by delegation, admits no envoy shape (§8.2);"
- §16: "(ES-2b, OPENED by delegation 2026-10-20 (P5 A.2); then the seizure is" → "(ES-2b, OPENED by delegation; then the seizure is"
- §16: "write NOTHING (PL F.6 (b) (i); A.8; RULINGS-ROUND6 B.3);" → "write NOTHING (PL F.6 (b) (i));"
- §16: "(pushed as the war's cause, CHAIR-NOTES 2)" → "(pushed as the war's cause)"
- §16: "never on a road — RULINGS-ROUND3 B, PT's row)" → "never on a road — PT's row)"
- §16: "the stamp `{ riders, points: 0 }` — the kept count's carrier (PR-X5) —" → "the stamp `{ riders, points: 0 }` — the kept count's carrier —"
- §16: "EXECUTED `cure/D-PR-r5-probe/net-r5.out`, r4's per-member floor 0) on Kell's half" → "EXECUTED `cure/D-PR-r5-probe/net-r5.out`) on Kell's half"
- §16: "on Kell's own edge (PL §4.7 F.4; B.9);" → "on Kell's own edge (PL §4.7 F.4);"
- §16: "mint NO `patrol_clash` (B.5) |" → "mint NO `patrol_clash` |"
- §16: "adds no way (RULINGS-ROUND5 B.13) |" → "adds no way |"
- §16: "PL writes `protection_kept` (the r4 one-week `lived` read wrote `protection_failed`);" → "PL writes `protection_kept` (never read from the one-week `lived` rows);"
- §16: "at `gradeLegMultiplier('hidden')` 2 (passing the declared kind `patrol`); the `capable` one, the round and the pursuit past `upTo` keep to t" → "at `gradeLegMultiplier('hidden')` 2 (admitted by PR's own leaf read of `knownTrailsOf` — never a traveller token, §5.5); the `capable` one, "
- §16: "for any clash inside the hunt (B.5) |" → "for any clash inside the hunt |"
- §16: "THE SWEEP ONLY ON THE LORD'S OWN NEED (RULINGS-ROUND6 B.3) —" → "THE SWEEP ONLY ON THE LORD'S OWN NEED —"
- §16: "TWO PRODUCERS, ONE SIGNAL (P5C-4; PS's P38) —" → "TWO PRODUCERS, ONE SIGNAL (PS's P38) —"
- §16: "ONE LATENT TABLE (P5C-14) —" → "ONE LATENT TABLE —"
- §16: "THE REFUSED JOIN (P5C-19) —" → "THE REFUSED JOIN —"
- §16: "THE LOOK SWITCHED OFF (P5C-12) —" → "THE LOOK SWITCHED OFF —"
- §17: "the owner's own row marked; every DRAFT constant" → "⭐ marks the owner's own rows, each VISIBLE; every DRAFT constant"
- §17: "| Row | Ruling | Why | |---|---|---|" → "| Row | Ruling | Why | Ruled | |---|---|---|---|"
- §17: "| **OD-PR-0 (THE OWNER'S OWN ROW)** |" → "| ⭐ **OD-PR-0 (THE OWNER'S OWN ROW — VISIBLE)** |"
- §17: "chain C16 after C14 · C15 (the chair's order note) | the chair's design, executed |" → "chain C16 after C14 · C15, adjacent (the three share the border gate and the fort), behind the map's M-W2 and the war layer's lighting (§14)"
- §17: "never stepped (⛔ STOP-PR-0's alternative)" → "never stepped (STOP-PR-0's ruled alternative, below)"
- §17: "a magistrate's step — `fortWill` STRUCK, A.1); the count never authored | the owner's eighth word; RULINGS-ROUND2b |" → "a magistrate's lean through CH's `patrol_will` in the weeks its exertion stands, never a band step (§10.5) — no `fortWill` (OD-PR-41)); the "
- §17: "(`points` 0 where there was nothing to draw — PR-X5, r5) | PR3; RULINGS-ROUND2b; RULINGS-ROUND4 B |" → "(`points` 0 where there was nothing to draw) | PR3 |"
- §17: "`JOINT_FLOOR` 0.25 measured at PR-5 | item 17(b); RULINGS-ROUND2b |" → "`JOINT_FLOOR` 0.25 measured at PR-5 | item 17(b) |"
- §17: "`witnessedCrossing` is PR's (PS8; RULINGS-ROUND2 C.Q1)," → "`witnessedCrossing` is PR's (PS8),"
- §17: "J-ES-1's amendment bracket is the fold lane's (RULINGS-ROUND2b Q3) |" → "J-ES-1's amendment bracket is the fold's to write |"
- §17: "— never PT's; five named producers;" → "— never PT's; the named producers of §8.3, the travellers' return none until a volume carries it (OD-PR-52);"
- §17: "— PR's own 15 · 30 · 50 · 70 · 85 STRUCK |" → "— PR keeps no table of its own |"
- §17: "PS keeps the home-defence battle | item 13; R-11; RULINGS-ROUND2b |" → "PS keeps the home-defence battle | item 13; R-11 |"
- §17: "THE CHOOSER'S SHARED-SIGNAL CAR (SX-08) — WC's" → "THE CHOOSER'S SHARED-SIGNAL CAR — WC's"
- §17: "| item 12(a)(c); R-9; RULINGS-ROUND3 F.3 |" → "| item 12(a)(c); R-9; PL §4.7 F.3 |"
- §17: "(PL §4.1 (ii); STOP-PR-r4-1 as RE-RULED, RULINGS-ROUND4 §E);" → "(PL §4.1 (ii); STOP-PR-r4-1, below);"
- §17: "never at the crown's own share (RULINGS-ROUND5 B.8)," → "never at the crown's own share,"
- §17: "never the one-week `lived` rows — B.9, ⭐ OD-PR-50);" → "never the one-week `lived` rows — ⭐ OD-PR-50);"
- §17: "for an unasked sweep or a ride past (A.8)," → "for an unasked sweep on the lord's own need (`swept`, ⭐ OD-PR-50) or a ride past,"
- §17: "| items 7, 12(e); R-8; the owner's ~19:2x word; RULINGS-ROUND3 §F |" → "| items 7, 12(e); R-8; the owner's ~19:2x word; PL §4.7 F.1–F.7 |"
- §17: "| WITHDRAWN: the crown's call on a member's riders" → "| the crown's call on a member's riders"
- §17: "no PR kind, no fealty row of PR's |" → "no PR kind (`patrol_order` withdrawn), no fealty row of PR's |"
- §17: "| a warden's lean, a magistrate's will step," → "| a warden's lean, a magistrate's will lean (CH's `patrol_will`, OD-PR-52),"
- §17: "(a `losses` row; WC's people ledger is the slot) — KEPT by the chair (RULINGS-ROUND2b Q8) |" → "(a `losses` row; WC's people ledger is the slot) — kept |"
- §17: "the lens is absent or has adopted the rows | item 18; RULINGS-ROUND2b |" → "the lens is absent or has adopted the rows | item 18 |"
- §17: "(four maps — `placement` added in round 2b)" → "(four maps)"
- §17: "zero when none); §7.2's second input struck |" → "zero when none); no second input (§7.2) |"
- §17: "signed at PR-0's unit with a fold §7 row (the chair's); round 4's three field additions are declared separately as the owner's shape (OD-PR-" → "signed at PR-0's unit with a fold §7 row; the three fork and hunt fields are declared separately as the owner's shape (OD-PR-44 · OD-PR-45),"
- §17: "the "+0.3 merchant" is struck — PR-V4); `LOOK_FIND_SECRET` 0.3 (renamed in round 4, §9.2 (b));" → "no "+0.3 merchant" cover term); `LOOK_FIND_SECRET` 0.3 (§9.2 (b));"
- §17: "the join's resentment patch; and from round 2b `CAMPAIGN_SHARE` 0.75" → "the join's resentment patch; `CAMPAIGN_SHARE` 0.75"
- §17: "the half's fallback `cut01` 0.5 (until the digest carries a gate fraction, A.14); and from round 3 the rover share" → "the half's fallback `cut01` 0.5 (until the digest carries a gate fraction); the rover share"
- §17: "`max − ceil(max × PEACE_SHARE)`; and from round 4 `COLD_TRAIL_WEEKS` 3" → "`max − ceil(max × PEACE_SHARE)`; `COLD_TRAIL_WEEKS` 3"
- §17: "the believed phase's two-sighting rule; and from round 5 `NET_HOME_MIN` 1 · the lend's `max(1, …)` floor (B.8's) ·" → "the believed phase's two-sighting rule; `NET_HOME_MIN` 1 · the lend's `max(1, …)` floor ·"
- §17: "| ⛔ STOP-PR-0 |" → "| STOP-PR-0 (ruled) |"
- §17: "**RULED (RULINGS-ROUND2b): ACCEPTED**" → "**RULED: ACCEPTED**"
- §17: "| ⛔ STOP-PR-1 |" → "| STOP-PR-1 (ruled) |"
- §17: "**RULED (RULINGS-ROUND2b): the slow half alone" → "**RULED: the slow half alone"
- §17: "| ⛔ STOP-PR-2 |" → "| STOP-PR-2 (ruled) |"
- §17: "**RULED (RULINGS-ROUND2b): (a) — PT's `party_gate` WIDENED" → "**RULED: PT's `party_gate` WIDENED"
- §17: "(CH already chose the road arm for persons, SEAMS-r2-14)" → "(CH already chose the road arm for persons)"
- §17: "TWO BODIES OF MEN, ONE CAP — RULED by the chair (RULINGS-ROUND3 A.1, correcting its own L-PR item 3; vetoable):" → "TWO BODIES OF MEN, ONE CAP (correcting the brief's item 3; vetoable):"
- §17: "The r2b reading (the keep's suppression yielding to the riders; `fortWill`) and the seams skeptic's stationed-share alternative are both SET" → "The keep's suppression never yields to the riders; no `fortWill` and no stationed share | ST §4.1; `skeptic/SEAMS-r2.md` |"
- §17: "MN's OWNED unit (A.3; CHAIR-NOTES 18 (d) — one manifest row," → "MN's OWNED unit (one manifest row,"
- §17: "PR requires no `menacesEnabled` | RULINGS-ROUND3 A.3 |" → "PR requires no `menacesEnabled` | MN §3.3 |"
- §17: "| ⭐ OD-PR-44 (THE OWNER'S SHAPE, declared; RULINGS-ROUND4 B PR-W1) |" → "| ⭐ OD-PR-44 (THE OWNER'S SHAPE, declared — VISIBLE) |"
- §17: "the fork alone, any week) | the owner's word; RULINGS-ROUND4 B |" → "the fork alone, any week) | the owner's word ("held for a season") |"
- §17: "| ⭐ OD-PR-45 (THE OWNER'S SHAPE, declared) |" → "| ⭐ OD-PR-45 (THE OWNER'S SHAPE, declared — VISIBLE) |"
- §17: "PR's clashes inside it none (B.5);" → "PR's clashes inside it none;"
- §17: "read through THE BODIES' `hiddenWayEdges` (B.4); coverage" → "read through THE BODIES' `hiddenWayEdges`; coverage"
- §17: "`knownTrailsOf`, called by name (B.13) —" → "`knownTrailsOf`, called by name —"
- §17: "never a warden merely retained (B.13);" → "never a warden merely retained;"
- §17: "by the holder's knowledge read (RULINGS-ROUND6 A.2; r5's "under the riders' franchise (OD-PR-51)" struck);" → "by the holder's knowledge read (OD-PR-51);"
- §17: "| ⭐ OD-PR-50 (THE OWNER'S SHAPE, declared; RULINGS-ROUND5 B.9) | `weeksCovered` — ONE optional pair `{ seasonStartTick, weeks }`" → "| ⭐ OD-PR-50 (THE OWNER'S SHAPE, declared — VISIBLE) | `weeksCovered` — ONE optional pair `{ seasonStartTick, weeks, swept? }`"
- §17: " — ↳ r6: ONE more count `swept?` in the same pair (the weeks the crown's OWN riders swept the member's roads for a need its own riders could" → "; `swept?` counts the weeks the crown's OWN riders swept the member's roads for a need its own riders could have met, declared beside the fi"
- §17: "(the alternative the chair did not take: re-time PL's row to the first sight of a net rider) | RULINGS-ROUND5 B.9; PL §4.7 F.4 |" → "(the alternative not taken: re-time PL's row to the first sight of a net rider) | PL §4.7 F.4 |"
- §17: "| ~~⭐ OD-PR-51~~ STRUCK by RULINGS-ROUND6 A.2 — the riders take NO token; a patrol on a known way inside its holder's land is the holder's o" → "| ⭐ OD-PR-51 (THE OWNER'S SHAPE row, re-ruled — VISIBLE) | THE RIDERS ON THE WAYS: the riders take NO token; a patrol on a known way inside "
- §17: "| THE P5 CURES (by delegation under the owner's 2026-10-20 words, vetoable): `armsNear`'s two producers composed in PS §7.4 (MAX, capped onc" → "| THE COMPLETENESS CURES (by delegation under the owner's 2026-10-20 words, vetoable): `armsNear`'s two producers composed in PS §7.4 (MAX, "
- §17: "`believedWatch`'s producer (3) STRUCK;" → "`believedWatch`'s producer (3) STRUCK until a volume carries it;"
- §17: "the magistrate through CH's `patrol_will` (C.19) | the P5 completeness critic; `cure/D-PS-ST-PR-p5.md` |" → "the magistrate through CH's `patrol_will`; ES-2b OPENED by delegation 2026-10-20 — §8.2's paragon and way rows among its admitted shapes, an"
- §17: "its lifecycle §16.1 (P5) —" → "its lifecycle §16.1 —"
- §17: "| requirement 22a; RULINGS-P5 C.12 |" → "| requirement 22a |"
- §17: "| ⛔ STOP-PR-r4-1 — RULED (RULINGS-ROUND4 §E) and APPLIED in round 5 (§10.3 (b), R42, OD-PR-26) | RULINGS-ROUND3 F.1 ("the OVERLORD's call re" → "| STOP-PR-r4-1 (ruled) | NEVER SKIPPING A LORD'S ROW: PL §4.1 stands — under `unbroken` the crown may summon every member DIRECTLY; the ride"
- §18: "a member whose riders went to the levy: RULINGS-ROUND3 F.7, PL §4.7 F.7's two lines;" → "a member whose riders went to the levy: PL §4.7 F.7's two lines;"
- §18: "*(the first sign of a broken rung — F.5;" → "*(the first sign of a broken rung — §10.3 (g);"
- §18: "scrutiny: the prediction's three reasons)*" → "scrutiny: the prediction's three reasons; the line never says `trail`, the map's RUNG word on the same surface)*"
- §19: "old §19 (876–912): heading "OPEN QUESTIONS FOR THE CHAIR (round 5a first; …)", Q1–Q2 answered, the round-4a and round-3a lists, three ROUTES" → "the new §19: the four questions still open (old round-5a Q3–Q6, renumbered 1–4; "REFINED" → "a refinement"; "with B.8" → "with the lend's fl"

## 4. ALLOW-MISSING (`consolidate/PR-allow.txt` mirrors it, one token per line, a reason per class in its comment lines; 124 tokens)
SEAT 1 (23): HEADER TEMPLATES AND REVIEW-TRAIL PATHS (7) · REVIEW-TRAIL PATHS DROPPED WITH CHANGE NOTES (1) · SUPERSEDED FORMS QUOTED ONLY IN CHANGE NOTES (10) · §7.2's DROPPED CHANGE NOTE (2) · TOKENIZER ARTIFACTS (3) — as seat 1 wrote them.
SEAT 2 (101): (a) seat 1's 15 tokens whose other occurrences are only in old §19–§20, now moved: `assessments/P5-COMPLETENESS-2026-10-20.md` · `briefs/RULINGS-P5.md` · `cure/D-*-r4.md` · `cure/D-PR-r3.md` · `cure/D-PS-ST-PR-p5b-p5.md` · `gateKey` · `informer` · `season-r5.out` (the receipt stands as `cure/D-PR-r5-probe/season-r5.out`) · `skeptic/BD-r4.md` · `skeptic/BD-r5.md` · `skeptic/PR-r2-verify.md` · `skeptic/PR-r2.md` · `skeptic/PR-r3-verify.md` · `skeptic/PR-r4-verify.md` · `skeptic/SEAMS-r4.md`; (b) 14 review-trail paths and one other volume's token in route provenance dropped with change notes in §8–§16 (`cure/D-BD-r4.md` … `cure/D-ST-r5.md`, `skeptic/PR-r4-verify-probe/net.out`, `keepBreaches`); (c) 27 superseded forms and withdrawn words quoted only in change notes, each with its bracket id and what stands instead in the allow file's comment lines (e.g. `arrivalTick + 1`/`departTick + 1`/`position01` — B264's r2b clock shift, replaced by PS9's one hold helper; `full · manned · sparse · skeleton · empty` — B427's proposed set, replaced by ST's measured `SITE_READINESS`; `share01 > 0` — the struck condition; `seenBy`, `revealed`, `cult` — ST's withdrawn words); (d) 3 quotations of master's pinned arrays in ⭐ OD-PR-51's struck r5 text (the measurement stands in PR16); (e) `{ seasonStartTick, weeks }` — OD-PR-50's pair before its `swept?` sub-field; (f) 41 tokens that occur only in old §19's moved parts or old §20 (cure record Parts 2–3, verbatim).
Checks (`cpr/miss2.py`): every token of the old text absent from the new text is in the allow file, and each seat-2 entry was classified by where it occurs (a dropped change note's bracket id, or old lines ≥ 876 only); none occurs in running text that the new text lost.

## 5. THE RATCHET (whole volume: `python3 tools/consolidate-ratchet.py history/PR-bracketed-1beabdc85.md consolidate/PR-new.md --allow-missing-file consolidate/PR-allow.txt`)
tokens: old 1365 · new 1252 · missing 0 · new-in-new 11 (`1beabdc85`, the kit paths of the header and the review trail — `history/PR-cure-record.md`, `cure/`, `skeptic/` —, `toll_exemption` (PL-C-1's ruled name), two guide cites (short forms of §0.1's landed symbols) and two tokenizer pairings of backticks across a removed stamp) · cites (path :: symbol) 77 = 77, missing 0 · laws 19 = 19 (PR1–PR19) · flags 23 = 23 · wave ids 8 = 8 · UNMEASURED 23 = 23 · review markers left 0 · and three counts FEWER, each explained in §6. The ratchet's last line: `RATCHET 3 DIFFERENCE CLASSES` — the three explained count classes, nothing else.

## 6. THE COUNT DIFFERENCES, EXPLAINED
- **OD ids 71 → 66.** Five ids of OTHER volumes leave with the trail: `OD-BD-49` (old §19 Q1 and §20 only — "⭐ visible beside OD-BD-49", a relation the re-ruling of OD-PR-51 ended), `OD-FC-46` (old §19's round-3a routes), `OD-FC-60` (old §20, P6c), `OD-ST-39` (the old header's status block and §20), `OD-OP-36` (seat 1's B143, a P6c provenance stamp in §3.1 whose route stands applied). All are in `history/PR-cure-record.md`. Every OD-PR id survives (OD-PR-0 … OD-PR-53, the struck ⭐ OD-PR-51 as its re-ruled row).
- **⭐ 31 → 27.** Fourteen ⭐ stood in old §19–§20 (the cure record's rows and the old questions naming the owner's rows) and moved with them; every owner row of §17 keeps its ⭐ (OD-PR-44, -45, -50, -51, -53, and ⭐ OD-MG-6 cited in §9.2 (b)) and the new text adds ⭐ to OD-PR-0 (THE OWNER'S OWN ROW) and to cross-references naming ⭐ OD-PR-50/-53 (§17's OD-PR-26, OD-PR-38, §19).
- **DRAFT 43 → 41.** B167 (seat 1, §5.2: the struck PR band table "DRAFT 15 · 30 · 50 · 70 · 85" quoted in a change note — PR now reads MN's `MIGHT_LATENT`) and B303 (seat 2, §10.3 (c): RULINGS-ROUND5 B.8's quotation "when it keeps at least the minimum (DRAFT) itself" in a change note — the text states `NET_HOME_MIN` (DRAFT 1, UNMEASURED)). Every DRAFT constant of the design keeps its mark.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by script: the old text byte-identical to the volume before the copy; every content bracket disposed (the build refuses otherwise); every substitution matched exactly once; the cure record's three parts byte-identical to the old lines they carry (`mkcure.py` asserts it); the ratchet as in §5; every bare "§x" resolves. PLAUSIBLE (a reading, not a measurement): that each change note dropped as "the text at the same place already carries the change" does so — each was read in place, and the ledger row names it.



## 8. THE ROWS (one per marker; `B` = bracket by index in old-text order · `A` = `↳` outside brackets · `H` = round word outside brackets · `S` = `STOP` outside brackets · `U` = `ROUTED-UNAPPLIED` outside brackets · `L` = header/status line · `R` = cure-record header)

| id | old line | old § | first 60 characters | what happened | new § | how |
|---|---|---|---|---|---|---|
| L00 | L3 | header | `(header/status line 3)` | MOVED | history/PR-cure-record.md Part 1 | moved whole (verbatim) with the header block; its design facts — the flags, the one persisted shape and its stamp, every constant DRAFT and UNMEASURED — restated in the new header |
| L01 | L6 | header | `(header/status line 6)` | MOVED | history/PR-cure-record.md Part 1 | moved whole (verbatim) with the header block; its design facts — the flags, the one persisted shape and its stamp, every constant DRAFT and UNMEASURED — restated in the new header |
| B000 | L7 | header | `[CURED 2026-10-20 (fp-final P5) — <id>: …]` | MOVED | history | a header/status template or status-line stamp: moved with old lines 3, 6–12 to history/PR-cure-record.md Part 1 |
| L02 | L7 | header | `(header/status line 7)` | MOVED | history/PR-cure-record.md Part 1 | moved whole (verbatim) with the header block; its design facts — the flags, the one persisted shape and its stamp, every constant DRAFT and UNMEASURED — restated in the new header |
| B001 | L8 | header | `[CURED 2026-10-20 (fp-final P5) — <id>: …]` | MOVED | history | a header/status template or status-line stamp: moved with old lines 3, 6–12 to history/PR-cure-record.md Part 1 |
| B002 | L8 | header | `[REFINED 2026-10-20 (fp-final P5) — …]` | MOVED | history | a header/status template or status-line stamp: moved with old lines 3, 6–12 to history/PR-cure-record.md Part 1 |
| L03 | L8 | header | `(header/status line 8)` | MOVED | history/PR-cure-record.md Part 1 | moved whole (verbatim) with the header block; its design facts — the flags, the one persisted shape and its stamp, every constant DRAFT and UNMEASURED — restated in the new header |
| B003 | L9 | header | `[ADDED 2026-10-20 (fp-final P6c; <route>) — …]` | MOVED | history | a header/status template or status-line stamp: moved with old lines 3, 6–12 to history/PR-cure-record.md Part 1 |
| L04 | L9 | header | `(header/status line 9)` | MOVED | history/PR-cure-record.md Part 1 | moved whole (verbatim) with the header block; its design facts — the flags, the one persisted shape and its stamp, every constant DRAFT and UNMEASURED — restated in the new header |
| B004 | L10 | header | `[REFINED 2026-10-18 (fp-final) — what; why]` | MOVED | history | a header/status template or status-line stamp: moved with old lines 3, 6–12 to history/PR-cure-record.md Part 1 |
| L05 | L10 | header | `(header/status line 10)` | MOVED | history/PR-cure-record.md Part 1 | moved whole (verbatim) with the header block; its design facts — the flags, the one persisted shape and its stamp, every constant DRAFT and UNMEASURED — restated in the new header |
| S00 | L10 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| B005 | L12 | header | `[CURED 2026-10-19 (fp-final r5) — the round's own line]` | MOVED | history | a header/status template or status-line stamp: moved with old lines 3, 6–12 to history/PR-cure-record.md Part 1 |
| H00 | L12 | header | `round 5a` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| H01 | L12 | header | `Round 5a` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| H02 | L12 | header | `Round 4a` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| H03 | L12 | header | `round 5a` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| H04 | L12 | header | `Round 3a` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| L06 | L12 | header | `(header/status line 12)` | MOVED | history/PR-cure-record.md Part 1 | moved whole (verbatim) with the header block; its design facts — the flags, the one persisted shape and its stamp, every constant DRAFT and UNMEASURED — restated in the new header |
| S01 | L12 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| S02 | L12 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| S03 | L12 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| S04 | L12 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| S05 | L12 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| S06 | L12 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| S07 | L12 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| S08 | L12 | header | `STOP` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| U00 | L12 | header | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| U01 | L12 | header | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 1 | in the header/status lines moved whole |
| B006 | L27 | OWNER/ANSWER | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-5: "THIS VOLUME IS` | FOLDED | THE OWNER'S WORDS | a change note: the text at the same place already carries the change it names (the over-claim it names is not in the text: the volume is the host's own patrols programme and never opens H16) |
| B007 | L33 | OWNER/ANSWER | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 and the` | FOLDED | THE OWNER'S WORDS | a change note: the text at the same place already carries the change it names (the commissioning words stand as items 9–14) |
| B008 | L43 | OWNER/ANSWER | `[CURED 2026-10-18 (fp-final r4) — A.7 THE BANNER · BD's rout` | FOLDED | THE ANSWER | a change note: the text at the same place already carries the change it names (the answer's banner and hunt sentences stand; the superseded r3 sentence is not in the text) |
| B009 | L53 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-1]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B010 | L54 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-2]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B011 | L55 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-2, RULINGS-ROUND2b]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B012 | L56 | 0.1 | `[CURED 2026-10-18 (fp-final r3) — PR-V1]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B013 | L62 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-5 · PR-r2-18]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B014 | L63 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S09 | L64 | 0.1 | `STOP` | FOLDED | 0.1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B015 | L75 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-4]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B016 | L76 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-7]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B017 | L77 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-22]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B018 | L78 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-1]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B019 | L79 | 0.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-27]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B020 | L80 | 0.1 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2 ("PR` | FOLDED | §0.1 | a change note: the text at the same place already carries the change it names (the ruling it carries — no `patrol` traveller token; a patrol on a known way passes by the holder's knowledge read — is the row's own sentence and PR16's; OD-PR-47) |
| B021 | L80 | 0.1 | `[CURED 2026-10-19 (fp-final r5) — B.4, measured by this lane` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B022 | L81 | 0.1 | `[REFINED 2026-10-19 (fp-final r5) — measured; BD §9.11's "th` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| A00 | L84 | 0.2 | `↳` | FOLDED | 0.2 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B023 | L84 | 0.2 | `[REFINED 2026-10-18 (fp-final) — the fold row's "FP mints no` | FOLDED | §0.2 | its content folded into the sentence it amends; its process clause (the fold carries both changes) dropped |
| B024 | L85 | 0.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-7 · SEAMS-r2-4]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H05 | L85 | 0.2 | `round 2` | FOLDED | 0.2 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B025 | L86 | 0.2 | `[CURED 2026-10-19 (fp-final r5) — PR-X4: "THREE feeders" pre` | FOLDED | §0.2 | a change note: the text at the same place already carries the change it names (the current quotes and the explicit ownership stand; the superseded readings it names are not in the text) |
| B026 | L86 | 0.2 | `[CURED 2026-10-19 (fp-final r5) — PR-X4: the "first-to-land-` | FOLDED | §0.2 | a change note: the text at the same place already carries the change it names (the current quotes and the explicit ownership stand; the superseded readings it names are not in the text) |
| B027 | L86 | 0.2 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 · PR-V2 (A.1, whic` | FOLDED | §0.2 | a change note: the text at the same place already carries the change it names (the current quotes and the explicit ownership stand; the superseded readings it names are not in the text) |
| B028 | L86 | 0.2 | `[CURED 2026-10-18 (fp-final r4) — PR-W6 · SEAMS-r3-10: this ` | FOLDED | §0.2 | a change note: the text at the same place already carries the change it names (the current quotes and the explicit ownership stand; the superseded readings it names are not in the text) |
| H06 | L86 | 0.2 | `round 4` | FOLDED | 0.2 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B029 | L87 | 0.2 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B030 | L88 | 0.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (1)–(7)]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B031 | L88 | 0.2 | `[CURED 2026-10-19 (fp-final r5) — the BD §5.2 quote re-cut t` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B032 | L88 | 0.2 | `[CURED 2026-10-19 (fp-final r5) — B.4 · B.5 · B.8 · B.9 · B.` | FOLDED | §0.2 | a change note: the text at the same place already carries the change it names (the current quotes and the explicit ownership stand; the superseded readings it names are not in the text) |
| H07 | L88 | 0.2 | `round 5` | FOLDED | 0.2 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B033 | L90 | 0.2 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-5]` | FOLDED | §0 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B034 | L98 | 0.3 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-1: the compiled l` | FOLDED | §0.3 | a change note: the text at the same place already carries the change it names (the navy the owner commissioned stands in the line; PR mints no sea law) |
| B035 | L100 | 0.3 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-4: the compiled line` | FOLDED | §0.3 | a change note: the text at the same place already carries the change it names (the slow-not-sever bound stands in the line; the superseded "a closed pass" is not in the text) |
| B036 | L108 | 0.5 | `[REFINED 2026-10-18 (fp-final) — fourteen refinements, 'cure` | FOLDED | §0.5 | folded as §0.5's text: the fourteen refinements, each in its final state (B37's rulings applied in place) |
| B037 | L108 | 0.5 | `[CURED 2026-10-18 (fp-final r2) — the chair's round-2b rulin` | FOLDED | §0.5 | folded into §0.5's refinements R-1, R-7, R-10, R-13 and R-14 (accepted · ruled · ruled · withdrawn · re-pointed) |
| B038 | L114 | §1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-17 · SEAMS-r2-8: ` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B039 | L114 | §1 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carry (PR-r` | FOLDED | §1 | its receipt folded after the law it proves; its superseded r2b bucketing is not in the text |
| B040 | L114 | §1 | `[REFINED 2026-10-18 (fp-final) — ⛔ STOP-PR-0: the brief's "a` | FOLDED | §1 | its measurement folded as the law's closing sentences (the STOP it raised was accepted as written, B41) |
| B041 | L114 | §1 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b STOP-PR-0:` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B042 | L116 | §1 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-3 · PR-V10]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B043 | L116 | §1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-2 · PR-r2-3: the poo` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B044 | L118 | §1 | `[CURED 2026-10-18 (fp-final r3) — PR-V1]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B045 | L118 | §1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-1 (BLOCKING) · PR-r2` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B046 | L120 | §1 | `[CURED 2026-10-18 (fp-final r3) — PR-V9 · the carry: 'hashIn` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B047 | L120 | §1 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-6 · PR-r2-15: the ` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B048 | L122 | §1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-28: "three numbers …` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B049 | L124 | §1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-5 (RULINGS-ROUND2b: ` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| S10 | L124 | §1 | `STOP` | FOLDED | §1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B050 | L128 | §1 | `[CURED 2026-10-19 (fp-final r5) — CH→PR route 3 ('cure/D-CH-` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B051 | L128 | §1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (1)(2): one la` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B052 | L128 | §1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-9 · PR-r2-10 · SEAMS` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S11 | L128 | §1 | `STOP` | FOLDED | §1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B053 | L130 | §1 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3) · L-BD 20]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B054 | L132 | §1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6 · SEAMS-r2-8: per ` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B055 | L132 | §1 | `[REFINED 2026-10-18 (fp-final r4) — the owner's "operate in ` | FOLDED | §1 | its content folded into the clause it refines |
| B056 | L132 | §1 | `[CURED 2026-10-19 (fp-final r5) — B.13 · PR-X3 · B.4: the kn` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B057 | L132 | §1 | `[CURED 2026-10-18 (fp-final r4) — the PS→PR routes of 'cure/` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B058 | L134 | §1 | `[CURED 2026-10-19 (fp-final r5) — B.8 · PR-X1: the r4 law re` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B059 | L134 | §1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-20]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B060 | L134 | §1 | `[CURED 2026-10-18 (fp-final r4) — A.7 · SEAMS-r3-6 (RULINGS-` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B061 | L136 | §1 | `[CURED 2026-10-18 (fp-final r3) — PS-r2-15 (A.2)]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B062 | L136 | §1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-19 · RULINGS-ROUND2b` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B063 | L140 | §1 | `[CURED 2026-10-18 (fp-final r3) — the PL-r2-verify minor ("l` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B064 | L140 | §1 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-5 (RULINGS-ROUND2b` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B065 | L142 | §1 | `[REFINED 2026-10-18 (fp-final) — R-14.]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B066 | L142 | §1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-1 · PR-r2-4.]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B067 | L144 | §1 | `[CURED 2026-10-18 (fp-final r3) — PR-V1]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B068 | L144 | §1 | `[CURED 2026-10-18 (fp-final r4) — PR-W2: the stamp's write l` | FOLDED | §1 | its design fact folded beside the stamp line it counts |
| B069 | L144 | §1 | `[CURED 2026-10-18 (fp-final r3) — PR-V7]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B070 | L144 | §1 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2 ("PR` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B071 | L144 | §1 | `[CURED 2026-10-19 (fp-final r5) — B.4]` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B072 | L144 | §1 | `[REFINED 2026-10-19 (fp-final r5) — measured by the resumed ` | FOLDED | §1 | its measurement folded as the reason PR edits neither array |
| B073 | L146 | §1 | `[REFINED 2026-10-18 (fp-final r3) — §3.2 said "the DM's orde` | FOLDED | §1 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B074 | L150 | §1 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 B (PT's row` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B075 | L150 | §1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-13: PT's WATCH and P` | FOLDED | §1 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B076 | L159 | 2.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-13 (WC-PR-85; RULINGS-` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B077 | L160 | 2.1 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B078 | L160 | 2.1 | `[REFINED 2026-10-18 (fp-final) — R-8: the brief's "road ward` | FOLDED | §2.1 | its refinement folded as the item's closing sentence |
| B079 | L161 | 2.1 | `[CURED 2026-10-18 (fp-final r4) — A.3: "an untied band" is T` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B080 | L161 | 2.1 | `[REFINED 2026-10-18 (fp-final) — the brief's "the army's fiv` | FOLDED | §2.1 | its refinement folded as the item's closing sentence |
| B081 | L163 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-8]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B082 | L163 | 2.1 | `[CURED 2026-10-18 (fp-final r3) — A.14: the minted 'a␟b' → t` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B083 | L166 | 2.2 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-8: 'gateKey' was ` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B084 | L166 | 2.2 | `[CURED 2026-10-18 (fp-final r3) — A.14 · PR-V9: the minted '` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B085 | L166 | 2.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V8: the r2b text compar` | FOLDED | §2.2 | its receipt folded after the test it proves |
| B086 | L168 | 2.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-3: the brief's "an a` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B087 | L168 | 2.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-9; RULINGS-P` | FOLDED | §2.2 | its content folded as the reason the term is dark |
| B088 | L168 | 2.2 | `[REFINED 2026-10-18 (fp-final r4) — L-BD 39's "the patrol's ` | FOLDED | §2.2 | its content folded after the habit term |
| B089 | L168 | 2.2 | `[CURED 2026-10-18 (fp-final r4) — BD's route (4)]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B090 | L168 | 2.2 | `[CURED 2026-10-19 (fp-final r5) — B.13 · BD-r4-23 · B.4 · BD` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B091 | L168 | 2.2 | `[CURED 2026-10-18 (fp-final r3) — A.1: the r2b "walls withou` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B092 | L168 | 2.2 | `[REFINED 2026-10-18 (fp-final) — R-3: the brief's "beat" is ` | FOLDED | §2.2 | its refinement folded as the section's closing sentence |
| B093 | L170 | 2.2 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2 · BD-r5` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B094 | L170 | 2.2 | `[CURED 2026-10-19 (fp-final r5) — SEAMS-r4-16 · BD-r4-24 (th` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B095 | L173 | 2.3 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carry: the ` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B096 | L178 | 2.3 | `[REFINED 2026-10-18 (fp-final r4) — L-BD 39: the patrol's ro` | FOLDED | §2.3 | a change note: the text at the same place already carries the change it names (the learnable clock, no second learning law and no roll, is the paragraph it closes) |
| B097 | L179 | 2.3 | `[CURED 2026-10-18 (fp-final r3) — PR-V5: the r2b shape '{ ca` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B098 | L179 | 2.3 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-6 · PR-r2-14 (the ` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B099 | L179 | 2.3 | `[REFINED 2026-10-18 (fp-final) — R-2: the brief's count band` | FOLDED | §2.3 | its refinement folded as the section's closing sentence |
| B100 | L191 | 2.4 | `[REFINED 2026-10-18 (fp-final) — the brief's six states had ` | FOLDED | §2.4 | its refinement folded as the section's closing sentence |
| B101 | L194 | 2.5 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3): 'pursue' w` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B102 | L194 | 2.5 | `[CURED 2026-10-18 (fp-final r4) — L-BD 40: "the detachment u` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B103 | L194 | 2.5 | `[REFINED 2026-10-19 (fp-final r5) — B.12's one leader record` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B104 | L198 | 2.6 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-15]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B105 | L199 | 2.6 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-25: "this week" and ` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B106 | L201 | 2.6 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6: 'watchOn' returns` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B107 | L201 | 2.6 | `[CURED 2026-10-18 (fp-final r3) — PR-V8: the r2b read was ke` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B108 | L202 | 2.6 | `[CURED 2026-10-19 (fp-final r5) — PR-X3 (minor): PR10 says "` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B109 | L205 | 2.6 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-56)]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B110 | L205 | 2.6 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-16: no producer was ` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B111 | L205 | 2.6 | `[CURED 2026-10-18 (fp-final r4) — BD's route (7) · L-BD 39 ·` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B112 | L206 | 2.6 | `[ADDED 2026-10-20 (fp-final P6c; 'cure/D-MG-r1.md' §4 PR · M` | FOLDED | §2.6 | an added item folded as its own text (its provenance dropped) |
| B113 | L207 | 2.6 | `[CURED 2026-10-18 (fp-final r4) — BD's route (4)]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B114 | L207 | 2.6 | `[CURED 2026-10-19 (fp-final r5) — B.13 · BD-r4-23 (the union` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B115 | L208 | 2.6 | `[CURED 2026-10-19 (fp-final r5) — BD→PR route (9) ('cure/D-B` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B116 | L208 | 2.6 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3) · L-BD 20 ·` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B117 | L209 | 2.6 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.3: 'swept` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B118 | L209 | 2.6 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.3 · PL-r5` | FOLDED | §2.6 | its vetoable reading folded beside the facts it reads; the superseded r5 sweep is not in the text |
| B119 | L209 | 2.6 | `[CURED 2026-10-19 (fp-final r5) — PR-X2 (MAJOR) · B.9: the r` | FOLDED | §2.6 | its receipt folded after the read it proves |
| B120 | L209 | 2.6 | `[CURED 2026-10-18 (fp-final r4) — A.7, aligned with PL §2/§4` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B121 | L210 | 2.6 | `[CURED 2026-10-18 (fp-final r3) — PR-V1]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B122 | L210 | 2.6 | `[CURED 2026-10-18 (fp-final r4) — PR-W3]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B123 | L217 | 2.7 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3) · L-BD 40]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B124 | L218 | 2.7 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-20: the closed field` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B125 | L220 | 2.7 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.3; one su` | FOLDED | §2.7 | its owner-mark folded (the ⭐ row survives) |
| B126 | L220 | 2.7 | `[CURED 2026-10-19 (fp-final r5) — PR-X2 · RULINGS-ROUND5 B.9` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B127 | L220 | 2.7 | `[CURED 2026-10-18 (fp-final r4) — PR-W1 (RULINGS-ROUND4 B: "` | FOLDED | §2.7 | its ruling folded beside the field it declares |
| B128 | L220 | 2.7 | `[CURED 2026-10-18 (fp-final r3) — PR-V5 (the candidate) · th` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B129 | L220 | 2.7 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-15 · PR-r2-25 · PR-r` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B130 | L220 | 2.7 | `[CURED 2026-10-19 (fp-final r5) — B.9]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B131 | L222 | 2.7 | `[CURED 2026-10-18 (fp-final r4) — PR-W1 · BD's route (3) · L` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B132 | L222 | 2.7 | `[CURED 2026-10-19 (fp-final r5) — B.9]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B133 | L222 | 2.7 | `[CURED 2026-10-18 (fp-final r4) — PR-W2 · PR-W3: the line is` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B134 | L222 | 2.7 | `[CURED 2026-10-19 (fp-final r5) — PR-X5 (minor): the r4 line` | FOLDED | §2 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B135 | L222 | 2.7 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-1]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B136 | L222 | 2.7 | `[CURED 2026-10-18 (fp-final r3) — PR-V7]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B137 | L222 | 2.7 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-16]` | FOLDED | §2 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H08 | L222 | 2.7 | `round 4` | FOLDED | 2.7 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H09 | L222 | 2.7 | `round 5` | FOLDED | 2.7 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B138 | L233 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-2 (BLOCKING), RULING` | FOLDED | §3 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B139 | L234 | 3.1 | `[CURED 2026-10-18 (fp-final r3) — PR-V6 · the ST-r2-verify n` | FOLDED | §3 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B140 | L234 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-12: the owner's e` | FOLDED | §3.1 | its reason folded after the coin sentence; its superseded SITE-keyed read is not in the text |
| H10 | L234 | 3.1 | `round 2b` | FOLDED | 3.1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B141 | L235 | 3.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-78): "one st` | FOLDED | §3.1 | its reading folded into the lean it bounds |
| B142 | L235 | 3.1 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 (A.1): the r2b 'fo` | FOLDED | §3.1 | its design fact folded; the superseded `fortWill` is not in the text (ALLOW-MISSING) |
| A01 | L236 | 3.1 | `↳` | FOLDED | 3.1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B143 | L236 | 3.1 | `[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §G.1 · §C PR · O` | FOLDED | §3 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B144 | L238 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-26: stepping 'thin' ` | FOLDED | §3 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B145 | L238 | 3.1 | `[REFINED 2026-10-18 (fp-final) — the 'thorp' row is not in t` | FOLDED | §3.1 | its refinement folded as the section's closing sentences |
| B146 | L241 | 3.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-27: no court fork ex` | FOLDED | §3 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B147 | L241 | 3.2 | `[CURED 2026-10-18 (fp-final r4) — PR-W1]` | FOLDED | §3 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B148 | L243 | 3.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V10: "an enemy army bel` | FOLDED | §3 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B149 | L244 | 3.2 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-3 (RULINGS-ROUND3 B)` | FOLDED | §3.2 | its receipt folded after the rule it proves; the superseded default is not in the text |
| B150 | L244 | 3.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-3 (BLOCKING): as com` | FOLDED | §3 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| S12 | L253 | 4.1 | `STOP` | KEPT | 4.1 | KEPT as a design mark (§4.1: MN-0's build-time STOP conditions inherited and the build-time ⛔ STOP of the stage's host — a car-0 condition, not a review marker) |
| S13 | L253 | 4.1 | `STOP` | KEPT | 4.1 | KEPT as a design mark (§4.1: MN-0's build-time STOP conditions inherited and the build-time ⛔ STOP of the stage's host — a car-0 condition, not a review marker) |
| B151 | L255 | 4.1 | `[CURED 2026-10-18 (fp-final r4) — PR-W1]` | FOLDED | §3 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B152 | L256 | 4.1 | `[CURED 2026-10-19 (fp-final r5) — L-BD 11e]` | FOLDED | §3 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B153 | L257 | 4.1 | `[ADDED 2026-10-20 (fp-final P6c; 'cure/D-MG-r1.md' §4 PR · R` | FOLDED | §4.1 | an added item folded as its own text (its provenance dropped) |
| B154 | L259 | 4.1 | `[CURED 2026-10-18 (fp-final r3) — the carry]` | FOLDED | §3 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B155 | L259 | 4.1 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §3 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B156 | L259 | 4.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-15]` | FOLDED | §3 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B157 | L259 | 4.1 | `[CURED 2026-10-19 (fp-final r5) — B.9 · PR-X2 · BD's round-5` | FOLDED | §3 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B158 | L260 | 4.1 | `[CURED 2026-10-18 (fp-final r3) — PR-V11: the trigger list o` | FOLDED | §4 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B159 | L262 | 4.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes · A.7: two mor` | FOLDED | §4 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B160 | L262 | 4.1 | `[CURED 2026-10-19 (fp-final r5) — B.9: the one-week 'lived' ` | FOLDED | §4 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B161 | L262 | 4.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-15: nothing was stor` | FOLDED | §4.1 | its receipt folded; its superseded state (nothing stored) is not in the text |
| B162 | L265 | 4.2 | `[REFINED 2026-10-18 (fp-final) — macro over micro (the owner` | FOLDED | §4.2 | its refinement folded as the section's closing sentence |
| B163 | L274 | 5.1 | `[CURED 2026-10-19 (fp-final r5) — A.4 · A.5 · A.1, PR's echo` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B164 | L274 | 5.1 | `[CURED 2026-10-18 (fp-final r4) — A.3 (the struck 'band'/'cu` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B165 | L275 | 5.1 | `[CURED 2026-10-19 (fp-final r5) — BD→PR route (9): 'believed` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B166 | L275 | 5.1 | `[CURED 2026-10-18 (fp-final r4) — BD's route (6): the slot "` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B167 | L282 | 5.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-14 (WC-PR-22; RULINGS-` | FOLDED | §5.2 | a change note: the text at the same place already carries the change it names (PR reads MN's one `MIGHT_LATENT` table; the superseded PR table "DRAFT 15 · 30 · 50 · 70 · 85" it quotes is struck by the ruling it carries, so the DRAFT count of old §5.2 falls by one) |
| B168 | L282 | 5.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-26: below a town the` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B169 | L289 | 5.3 | `[CURED 2026-10-18 (fp-final r4) — BD's route (6) · A.3: the ` | FOLDED | §5.3 | its design fact folded (the withdrawn alternative is not in the text) |
| B170 | L297 | 5.5 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (3) and (5) · ` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B171 | L298 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — BD-r4's ROUTES to PR ("PR'` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| H11 | L298 | 5.5 | `round 5` | FOLDED | 5.5 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B172 | L299 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — BD→PR route (9)]` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B173 | L301 | 5.5 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2 ("PR` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B174 | L301 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — B.4 ("PR … RE-POINT[S] [it` | FOLDED | §5.5 | its PLAUSIBLE mark and measurement owed folded (a design mark); the superseded r4 sentence is not in the text |
| B175 | L302 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — BD's round-5 route to PR (` | FOLDED | §5.5 | its vetoability folded; its route tags dropped |
| B176 | L303 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — BD→PR route (9)]` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B177 | L307 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — B.6 · B.16 · the card's ow` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B178 | L307 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — the order cited at its own` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B179 | L307 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — CH→PR route 1 · SEAMS-r4-1` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B180 | L307 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — B.5 · SEAMS-r4-7 (one succ` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B181 | L307 | 5.5 | `[REFINED 2026-10-19 (fp-final r5) — measured at master; BD §` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B182 | L308 | 5.5 | `[CURED 2026-10-19 (fp-final r6) — SEAMS-r5-11: "held" had no` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B183 | L308 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — B.13 · CH→PR route 2 REFUT` | FOLDED | §5 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B184 | L308 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — B.4]` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B185 | L309 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — B.16 · B.4]` | FOLDED | §5 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B186 | L318 | 6.1 | `[CURED 2026-10-18 (fp-final r4) — PR-W5: PR placed "PR's fee` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B187 | L318 | 6.1 | `[CURED 2026-10-19 (fp-final r5) — PR-X4: the r3 "first-to-la` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B188 | L318 | 6.1 | `[CURED 2026-10-18 (fp-final r3) — MN-V6 (MN-r2-verify, route` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B189 | L318 | 6.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-7: three volumes ` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B190 | L318 | 6.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-25]` | FOLDED | §6 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B191 | L318 | 6.1 | `[CURED 2026-10-18 (fp-final r3) — SEAMS-r2-7 (MN-r2-verify's` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| H12 | L318 | 6.1 | `round 4` | FOLDED | 6.1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H13 | L318 | 6.1 | `round 2b` | FOLDED | 6.1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B192 | L321 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-29]` | FOLDED | §6 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B193 | L321 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-7 · SEAMS-r2-4; the ` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B194 | L321 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-21]` | FOLDED | §6 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B195 | L321 | 6.2 | `[REFINED 2026-10-18 (fp-final) — R-6: the landed counterforc` | FOLDED | §6.2 | its refinement folded as the section's closing sentences (prefix "R-6:" stripped) |
| S14 | L321 | 6.2 | `STOP` | KEPT | 6.2 | KEPT as a design mark (§6.2: ST-1's car-0 STOP — a build-time condition with MN's fallback, not a review marker) |
| S15 | L329 | 6.3 | `STOP` | FOLDED | 6.3 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B196 | L330 | 6.3 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 · PR-V2 (A.1): the` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B197 | L332 | 6.3 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-5 (RULINGS-ROUND2b: ` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| S16 | L332 | 6.3 | `STOP` | FOLDED | 6.3 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B198 | L335 | 6.4 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-23]` | FOLDED | §6 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B199 | L335 | 6.4 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6]` | FOLDED | §6 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B200 | L335 | 6.4 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-39)]` | FOLDED | §6 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B201 | L335 | 6.4 | `[CURED 2026-10-19 (fp-final r5) — B.4's one seam, PR's half ` | FOLDED | §6 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B202 | L335 | 6.4 | `[CURED 2026-10-19 (fp-final r5) — BD→PR route (11) ('cure/D-` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B203 | L335 | 6.4 | `[REFINED 2026-10-18 (fp-final) — R-4: the brief's "the roads` | FOLDED | §6.4 | its refinement folded as the section's closing sentence |
| B204 | L338 | 6.5 | `[CURED 2026-10-19 (fp-final r5) — PR-X3: the r4 term read th` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B205 | L338 | 6.5 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6 · SEAMS-r2-8: the ` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B206 | L338 | 6.5 | `[CURED 2026-10-18 (fp-final r4) — the PS→PR routes ('cure/D-` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B207 | L341 | 6.6 | `[CURED 2026-10-18 (fp-final r4) — PR-W3 ('skeptic/PR-r3-veri` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B208 | L341 | 6.6 | `[REFINED 2026-10-18 (fp-final r4) — the share is taken over ` | FOLDED | §6.6 | its refinement, receipt and cite folded beside the guard it explains; its vetoable alternative kept (§19) |
| B209 | L341 | 6.6 | `[CURED 2026-10-19 (fp-final r5) — PR-X5: a court with no off` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B210 | L341 | 6.6 | `[CURED 2026-10-18 (fp-final r3) — PR-V1: the r2b draw sat at` | FOLDED | §6.6 | its rationale folded as plain law (why the draw precedes the gates); the superseded r2b seat is not in the text |
| B211 | L341 | 6.6 | `[CURED 2026-10-18 (fp-final r3) — PR-V1: "the chooser's weig` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B212 | L341 | 6.6 | `[CURED 2026-10-18 (fp-final r4) — PR-W4: "allied relief read` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B213 | L341 | 6.6 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-1 (BLOCKING): the co` | FOLDED | §6 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B214 | L353 | 7.1 | `[ADDED 2026-10-20 (fp-final P6c; 'cure/D-FS-r1.md' §5 ST / P` | FOLDED | §7.1 | an added paragraph folded as its own text (its provenance dropped) |
| B215 | L356 | 7.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes: the "band's d` | FOLDED | §7 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B216 | L356 | 7.2 | `[CURED 2026-10-19 (fp-final r5) — RN→PR route ('cure/D-RN-r4` | FOLDED | §7 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B217 | L356 | 7.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-28: a second, unregi` | FOLDED | §7 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B218 | L356 | 7.2 | `[REFINED 2026-10-18 (fp-final) — a recorded decision (macro ` | FOLDED | §7.2 | its vetoable decision folded as the section's closing sentence |
| B219 | L359 | 7.3 | `[REFINED 2026-10-18 (fp-final) — R-12: the brief's "a patrol` | FOLDED | §7.3 | its refinement folded as the section's closing sentence |
| B220 | L365 | 7.5 | `[CURED 2026-10-18 (fp-final r4) — PR-W1 (MAJOR; 'skeptic/PR-` | FOLDED | §7.5 | its measurement folded as the reason for the carrier |
| B221 | L365 | 7.5 | `[CURED 2026-10-18 (fp-final r3) — PR-V3: with 'fielded = cei` | FOLDED | §7.5 | its receipt folded as the reason the trigger is the fork |
| B222 | L365 | 7.5 | `[REFINED 2026-10-18 (fp-final r3) — the excess gate: the bar` | FOLDED | §7.5 | its refinement and receipt folded beside the size it explains |
| B223 | L365 | 7.5 | `[CURED 2026-10-18 (fp-final r3) — PR-V3: the false claim is ` | FOLDED | §7 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B224 | L365 | 7.5 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-27: the "chooser" th` | FOLDED | §7 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B225 | L365 | 7.5 | `[REFINED 2026-10-19 (fp-final r5) — BD §7.6's claim on PR ca` | FOLDED | §7.5 | its vetoability folded |
| B226 | L365 | 7.5 | `[PLAUSIBLE — the grievance input's exact host line is measur` | FOLDED | §7.5 | a PLAUSIBLE design mark folded as a sentence (the mark kept) |
| B227 | L368 | 7.6 | `[RE-RULED 2026-10-19 (fp-final r6) — B.3 · PL-Y1: r5's "what` | FOLDED | §7.6 | its ruling's reason folded; the withdrawn r5 clause is not in the text |
| B228 | L368 | 7.6 | `[CURED 2026-10-18 (fp-final r4) — A.7 (RULINGS-ROUND3 F.6: "` | FOLDED | §7 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| B229 | L368 | 7.6 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.8 ("F.6 (` | FOLDED | §7 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling-file tags dropped) |
| H14 | L368 | 7.6 | `round 5` | FOLDED | 7.6 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B230 | L375 | 8.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6: with an ally and ` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B231 | L376 | 8.1 | `[CURED 2026-10-18 (fp-final r3) — PR-V8: the r2b MET tested ` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B232 | L376 | 8.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-11]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B233 | L378 | 8.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-12]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B234 | L378 | 8.1 | `[CURED 2026-10-18 (fp-final r3) — PR-V4: the r2b "+0.3" cove` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B235 | L379 | 8.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-22: 'belief' returns` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B236 | L383 | 8.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-11: "always noticed"` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B237 | L384 | 8.1 | `[CURED 2026-10-19 (fp-final r5) — B.4 (BD's r5 route (a): "t` | FOLDED | §8.1 | a provenance list (the routes and the ruling it applied): the text at the same place states each term it names |
| B238 | L384 | 8.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (1) (the BODY ` | FOLDED | §8.1 | a provenance list (the routes and the ruling it applied): the text at the same place states each term it names |
| B239 | L385 | 8.1 | `[CURED 2026-10-18 (fp-final r4) — BD's route (2)]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B240 | L386 | 8.1 | `[CURED 2026-10-19 (fp-final r5) — CH→PR route 3 ('cure/D-CH-` | FOLDED | §8.1 | its refinement mark folded (vetoable); its route provenance dropped |
| B241 | L394 | 8.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-9: competence and st` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B242 | L395 | 8.2 | `[CURED 2026-10-20 (fp-final P5) — P5W-2's PR half (RULINGS-P` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B243 | L395 | 8.2 | `[OPENED 2026-10-20 by delegation (P5 A.2); the wave order st` | FOLDED | §8.2 | an OPENED status stamp: the row states ES-2b OPENED by delegation and "the wave order stands"; its date and ruling tag go to the rulings table (OD-PR-52) |
| B244 | L395 | 8.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-10 · SEAMS-r2-2 (BLO` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| A02 | L396 | 8.2 | `↳` | FOLDED | 8.2 | the `↳` table row (the stopped envoy's week on `detourEnvoyErrand`) FOLDED into its parent envoy row's cell (§8.2), its owner cell PS; the arrow and the row removed |
| B245 | L396 | 8.2 | `[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.3 · OP §3.3 ·` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B246 | L397 | 8.2 | `[CURED 2026-10-19 (fp-final r5) — CH→PR route 3]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B247 | L397 | 8.2 | `[CURED 2026-10-20 (fp-final P5) — P5W-2's PR half (RULINGS-P` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B248 | L397 | 8.2 | `[OPENED 2026-10-20 by delegation (P5 A.2); the wave order st` | FOLDED | §8.2 | an OPENED status stamp: the row states ES-2b OPENED by delegation and "the wave order stands"; its date and ruling tag go to the rulings table (OD-PR-52) |
| B249 | L399 | 8.2 | `[CURED 2026-10-18 (fp-final r3)]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B250 | L399 | 8.2 | `[CURED 2026-10-18 (fp-final r2) — STOP-PR-2 · PR-r2-13]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S17 | L399 | 8.2 | `STOP` | FOLDED | 8.2 | "STOP-PR-2 RULED, RULINGS-ROUND2b" → "ruled, OD-PR-14" (the ruling cited by its OD row) |
| B251 | L400 | 8.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-54)]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B252 | L403 | 8.2 | `[REFINED 2026-10-18 (fp-final r2) — the corps ruling reaches` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B253 | L404 | 8.2 | `[CURED 2026-10-18 (fp-final r4) — BD's route (1)]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B254 | L406 | 8.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V4]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B255 | L409 | 8.3 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-16: the compiled rea` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B256 | L409 | 8.3 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-56; RULINGS-` | FOLDED | §8.3 | its ruling folded as the producer's status (the word STRUCK restated as "not a producer until a volume carries it") |
| B257 | L409 | 8.3 | `[CURED 2026-10-18 (fp-final r4) — BD's route (7) · L-BD 39 ·` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B258 | L409 | 8.3 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-24]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B259 | L409 | 8.3 | `[CURED 2026-10-18 (fp-final r4) — BD's route: the slot "the ` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B260 | L409 | 8.3 | `[CURED 2026-10-19 (fp-final r5) — B.4: the slot is master's ` | FOLDED | §8 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids dropped) |
| B261 | L411 | 8.3 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b Q3]` | FOLDED | §8 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B262 | L419 | 9.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-4 (WC-PR-57 · WC-PS-37` | FOLDED | §9 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B263 | L419 | 9.1 | `[REFINED 2026-10-18 (fp-final) — the brief's "feeds the read` | FOLDED | §9.1 | its refinement folded as the sentence's closing clause |
| B264 | L420 | 9.1 | `[CURED 2026-10-18 (fp-final r3) — PS-r2-15 (PS-r2-verify's f` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B265 | L420 | 9.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-19: as compiled, a d` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B266 | L420 | 9.1 | `[CURED 2026-10-18 (fp-final r3) — PS-r2-15 (c)]` | FOLDED | §9 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B267 | L420 | 9.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-21]` | FOLDED | §9 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B268 | L420 | 9.1 | `[CURED 2026-10-18 (fp-final r3) — PS-r2-15 (a): the r2b "aft` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B269 | L420 | 9.1 | `[CURED 2026-10-18 (fp-final r3) — A.1: "patrols are the keep` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B270 | L420 | 9.1 | `[REFINED 2026-10-18 (fp-final) — R-11: PS1 makes the DESTINA` | FOLDED | §9.1 | its refinement folded as the paragraph's closing sentences (its ruling tag dropped) |
| S18 | L420 | 9.1 | `STOP` | KEPT | 9.1 | KEPT as a design mark (§9.1 (b): the screen inherits PS's car-0 and its build-time STOP (S-a) — no screen if the transit kernel cannot be relieved) |
| B271 | L421 | 9.1 | `[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.4 · §E.4) — T` | FOLDED | §9.1 | an added item folded as its own text (heading kept; ruling tags dropped) |
| B272 | L422 | 9.1 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b open quest` | FOLDED | §9.1 | its ruling folded as a sentence (the PLAUSIBLE mark kept) |
| B273 | L424 | 9.1 | `[CURED 2026-10-18 (fp-final r4) — BD's route (6)]` | FOLDED | §9 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B274 | L424 | 9.1 | `[CURED 2026-10-20 (fp-final P5) — C.1 (P5C-1, WC-PR-7; RULIN` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B275 | L424 | 9.1 | `[CURED 2026-10-20 (fp-final P5) — RULINGS-P5 D.2 (PR §9.1 (e` | FOLDED | §9.1 | its count folded beside the claimant clause (the fold rows cited without their arrows) |
| B276 | L424 | 9.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-3 · PR-r2-1]` | FOLDED | §9 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B277 | L425 | 9.1 | `[REFINED 2026-10-18 (fp-final r3) — "a loss the commons feel` | FOLDED | §9 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B278 | L428 | 9.2 | `[REFINED 2026-10-18 (fp-final) — the brief's "the raider row` | FOLDED | §9.2 | its refinement folded as its own sentences |
| B279 | L428 | 9.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-61; RULINGS-` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B280 | L429 | 9.2 | `[CURED 2026-10-19 (fp-final r6) — SEAMS-r5-28 · B.2 · 'cure/` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B281 | L429 | 9.2 | `[CURED 2026-10-19 (fp-final r5) — ST's round-5 route to PR (` | FOLDED | §9.2 | a provenance note: the text at the same place states the rule it quotes ("a look at an id-less authored gang writes nothing") |
| B282 | L429 | 9.2 | `[CURED 2026-10-19 (fp-final r5) — A.5, PR's echo: the r4 wri` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B283 | L429 | 9.2 | `[CURED 2026-10-18 (fp-final r4) — A.16 · A.17 (the PR half: ` | FOLDED | §9.2 | its naming reason FOLDED by substitution beside the constant `LOOK_FIND_SECRET` (§3 TEXT CORRECTIONS); its ruling tags dropped |
| H15 | L429 | 9.2 | `round 5` | FOLDED | 9.2 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B284 | L430 | 9.2 | `[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.4 · 'cure/D-M` | FOLDED | §9.2 | an added item folded as its own text (heading kept; ruling tags dropped) |
| B285 | L437 | 9.3 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-16]` | FOLDED | §9 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B286 | L437 | 9.3 | `[CURED 2026-10-19 (fp-final r5) — B.5 · SEAMS-r4-7 (one succ` | FOLDED | §9 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B287 | L444 | 10.1 | `[CURED 2026-10-18 (fp-final r4) — A.7 (F.5)]` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B288 | L445 | 10.1 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B289 | L446 | 10.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-8]` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B290 | L446 | 10.1 | `[CURED 2026-10-19 (fp-final r5) — PS's round-5 route to PR (` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B291 | L446 | 10.1 | `[REFINED 2026-10-18 (fp-final) — R-9: the brief's "members' ` | FOLDED | §10.1 | its refinement folded as the paragraph's closing note; the charter's toll right named `toll_exemption` (the vocabulary ruling on PL-C-1: bare "passage" is THE PASSAGE's) |
| B292 | L446 | 10.1 | `[CURED 2026-10-18 (fp-final r4) — A.7 · SEAMS-r3-6 (RULINGS-` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| H16 | L446 | 10.1 | `round 5` | FOLDED | 10.1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B293 | L447 | 10.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-11: an ally court` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B294 | L447 | 10.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-69; RULINGS-` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B295 | L448 | 10.1 | `[CURED 2026-10-18 (fp-final r4) — A.7: the r3 "THE CROWN'S R` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B296 | L449 | 10.1 | `[CURED 2026-10-18 (fp-final r4) — A.18: the r3 "cleared by w` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B297 | L453 | 10.2 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B298 | L456 | 10.3 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 · SEAMS` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B299 | L457 | 10.3 | `[CURED 2026-10-18 (fp-final r4) — A.7, aligned with PL's rou` | FOLDED | §10.3 | a provenance note ("aligned with PL's §4.7 THE BANNER … PL owns the reads and the rows, PR the composition and the cap"): the ownership it names stands in (c)'s PL F.2 quotation and in OD-PR-26 |
| B300 | L458 | 10.3 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1, RE-RULED (RU` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B301 | L459 | 10.3 | `[REFINED 2026-10-19 (fp-final r5) — the home's minimum appli` | FOLDED | §10.3 | its refinement folded beside the clause it explains |
| B302 | L459 | 10.3 | `[CURED 2026-10-18 (fp-final r4) — A.7, aligned with PL's rou` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B303 | L459 | 10.3 | `[CURED 2026-10-19 (fp-final r5) — PR-X1 (MAJOR, EXECUTED by ` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| H17 | L459 | 10.3 | `round 5` | FOLDED | 10.3 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H18 | L459 | 10.3 | `r4:` | FOLDED | 10.3 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H19 | L459 | 10.3 | `r4:` | FOLDED | 10.3 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B304 | L460 | 10.3 | `[CURED 2026-10-18 (fp-final r4) — A.7, aligned with PS's rou` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B305 | L462 | 10.3 | `[CURED 2026-10-18 (fp-final r4) — A.7, aligned with PL's rou` | FOLDED | §10.3 | a provenance note ("aligned with PL's §4.7 THE BANNER … PL owns the reads and the rows, PR the composition and the cap"): the ownership it names stands in (c)'s PL F.2 quotation and in OD-PR-26 |
| B306 | L464 | 10.3 | `[CURED 2026-10-18 (fp-final r3) — PL-V4 (PR's sentence "no '` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B307 | L464 | 10.3 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-17 · SEAMS-r2-10: 'p` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B308 | L465 | 10.3 | `[CURED 2026-10-19 (fp-final r6)]` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B309 | L465 | 10.3 | `[CURED 2026-10-19 (fp-final r5) — PR-X2 (MAJOR: "'lived' is ` | FOLDED | §10.3 | its receipt folded beside the rule it proves (the superseded one-week reading it contrasts dropped) |
| B310 | L465 | 10.3 | `[CURED 2026-10-18 (fp-final r4) — A.7, aligned with PL's rou` | FOLDED | §10.3 | a provenance note ("aligned with PL's §4.7 THE BANNER … PL owns the reads and the rows, PR the composition and the cap"): the ownership it names stands in (c)'s PL F.2 quotation and in OD-PR-26 |
| B311 | L466 | 10.3 | `[CURED 2026-10-18 (fp-final r4) — A.7, aligned with PL's rou` | FOLDED | §10.3 | a provenance note ("aligned with PL's §4.7 THE BANNER … PL owns the reads and the rows, PR the composition and the cap"): the ownership it names stands in (c)'s PL F.2 quotation and in OD-PR-26 |
| B312 | L467 | 10.3 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.8 · the P` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B313 | L467 | 10.3 | `[CURED 2026-10-19 (fp-final r5) — B.9: never the one-week 'l` | FOLDED | §10.3 | its rule folded as the clause's close |
| B314 | L467 | 10.3 | `[CURED 2026-10-18 (fp-final r4) — A.7, aligned with PL's rou` | FOLDED | §10.3 | a provenance note ("aligned with PL's §4.7 THE BANNER … PL owns the reads and the rows, PR the composition and the cap"): the ownership it names stands in (c)'s PL F.2 quotation and in OD-PR-26 |
| H20 | L467 | 10.3 | `round 5` | FOLDED | 10.3 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B315 | L468 | 10.3 | `[REFINED 2026-10-18 (fp-final r4) — §F.7's words are "The cr` | FOLDED | §10.3 | its refinement folded as a sentence after the felt sentence |
| B316 | L471 | 10.4 | `[REFINED 2026-10-18 (fp-final) — PS §2.3 prices the escort a` | FOLDED | §10.4 | its refinement folded as the row's closing sentence |
| B317 | L472 | 10.4 | `[CURED 2026-10-20 (fp-final P5) — P5C-13 / P5C-19 (WC-PR-102` | FOLDED | §10.4 | a change note: the text at the same place already carries the change it names (the ruling it quotes — `escortedOn` read through the fold's WY and POP INBOX rows, PR keeping the field — is the text at the same place) |
| B318 | L476 | 10.5 | `[CURED 2026-10-18 (fp-final r3) — A.15 ('paragonLean' return` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B319 | L476 | 10.5 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.10 · SEAM` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B320 | L476 | 10.5 | `[CURED 2026-10-19 (fp-final r6) — SEAMS-r5-11]` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B321 | L476 | 10.5 | `[CURED 2026-10-19 (fp-final r5) — B.13]` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B322 | L476 | 10.5 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-78; RULINGS-` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B323 | L478 | 10.5 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 (FAILED in round 2` | FOLDED | §10 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B324 | L478 | 10.5 | `[REFINED 2026-10-18 (fp-final r2) — the one "sites considere` | FOLDED | §10 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B325 | L488 | 11.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-17: "a gate" bare` | FOLDED | §11 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B326 | L488 | 11.1 | `[CURED 2026-10-18 (fp-final r3) — A.14: the landed pair key]` | FOLDED | §11 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B327 | L488 | 11.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes: 'clear' on a ` | FOLDED | §11.1 | its content (the DM's `clear` on a body; the crown's order to sweep) folded into the cell (its route provenance dropped) |
| B328 | L489 | 11.1 | `[REFINED 2026-10-18 (fp-final r3) — §3.2's "lift to 'max' or` | FOLDED | §11.1 | its refinement folded into the cell |
| B329 | L491 | 11.1 | `[CURED 2026-10-18 (fp-final r4) — BD's route (5)]` | FOLDED | §11 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B330 | L491 | 11.1 | `[REFINED 2026-10-18 (fp-final) — the brief named the verb 'P` | FOLDED | §11.1 | its refinement folded as the paragraph's closing sentences |
| B331 | L496 | 11.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (1)(6) · A.3: ` | FOLDED | §11 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B332 | L496 | 11.2 | `[CURED 2026-10-19 (fp-final r5) — SEAMS-r4-16 · BD §5.2's ju` | FOLDED | §11 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B333 | L496 | 11.2 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3): the hunt m` | FOLDED | §11.2 | its content folded beside the cell it names |
| B334 | L496 | 11.2 | `[CURED 2026-10-18 (fp-final r3) — A.7]` | FOLDED | §11 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B335 | L496 | 11.2 | `[CURED 2026-10-18 (fp-final r4) — A.12 · A.3: the r2 clause ` | FOLDED | §11 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B336 | L496 | 11.2 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-15]` | FOLDED | §11 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B337 | L499 | 11.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §11 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B338 | L499 | 11.2 | `[CURED 2026-10-20 (fp-final P5) — P5W-2's PR half (RULINGS-P` | FOLDED | §11 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B339 | L499 | 11.2 | `[OPENED 2026-10-20 by delegation (P5 A.2); the wave order st` | FOLDED | §11.2 | an OPENED status stamp: the text states ES-2b OPENED by delegation; its date and ruling tag go to the rulings table (OD-PR-52) |
| B340 | L499 | 11.2 | `[REFINED 2026-10-18 (fp-final) — the brief's 'patrol_engages` | FOLDED | §11.2 | its refinement folded as the paragraph's closing sentences |
| S19 | L499 | 11.2 | `STOP` | FOLDED | 11.2 | "(STOP-PR-2 RULED; PR-r2-13)" → "(ruled, OD-PR-14)" |
| B341 | L509 | §12 | `[CURED 2026-10-18 (fp-final r4) — A.7 · BD's routes]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B342 | L509 | §12 | `[CURED 2026-10-19 (fp-final r5) — B.16 · B.4]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B343 | L509 | §12 | `[CURED 2026-10-18 (fp-final r3) — A.5]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B344 | L509 | §12 | `[CURED 2026-10-18 (fp-final r3) — the carry]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B345 | L509 | §12 | `[CURED 2026-10-18 (fp-final r4) — A.7 · BD's routes · L-BD 4` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B346 | L509 | §12 | `[CURED 2026-10-19 (fp-final r5) — B.8 · B.9 · B.4 · B.5 · B.` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B347 | L510 | §12 | `[CURED 2026-10-18 (fp-final r3) — MN-V6]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B348 | L510 | §12 | `[CURED 2026-10-18 (fp-final r3) — PR-V1]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B349 | L510 | §12 | `[CURED 2026-10-18 (fp-final r3) — PR-V3]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B350 | L510 | §12 | `[CURED 2026-10-18 (fp-final r4) — PR-W1]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B351 | L510 | §12 | `[CURED 2026-10-18 (fp-final r4) — PR-W3]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B352 | L510 | §12 | `[CURED 2026-10-19 (fp-final r5) — PR-X5]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B353 | L514 | §12 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-14]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B354 | L518 | §13 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-5 (RULINGS-ROUND2b` | FOLDED | §13 | a change note: the text at the same place already carries the change it names (the ruling it quotes — H16 the map's inbound door, the host's patrol facts out through the window — is the section's text; its finding ids dropped) |
| A03 | L521 | §13 | `↳` | FOLDED | §13 | "the fold's §3.1.26 ↳ r2b" → "the fold's §3.1.26" |
| B355 | L521 | §13 | `[CURED 2026-10-18 (fp-final r4) — A.7 (F.7)]` | FOLDED | §12 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B356 | L521 | §13 | `[REFINED 2026-10-18 (fp-final r2) — the chair named the even` | FOLDED | §13 | its refinement folded beside the rows it names |
| B357 | L521 | §13 | `[CURED 2026-10-18 (fp-final r3) — the FOLD-r2-verify minor (` | FOLDED | §13 | a change note: the text at the same place already carries the change it names (the text states the map's presence rule as the host's ask) |
| B358 | L529 | §14 | `[CURED 2026-10-19 (fp-final r5) — PR-X4: this placement pred` | FOLDED | §14 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B359 | L529 | §14 | `[CURED 2026-10-18 (fp-final r2) — Q7 · HOST-r2-5]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B360 | L532 | §14 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-2]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S20 | L532 | §14 | `STOP` | KEPT | §14 | KEPT as a design mark (§14 PR-0 car-0: MN-0's four build-time STOP conditions inherited; ⛔ STOP at build if the host has no room) |
| S21 | L532 | §14 | `STOP` | KEPT | §14 | KEPT as a design mark (§14 PR-0 car-0: MN-0's four build-time STOP conditions inherited; ⛔ STOP at build if the host has no room) |
| B361 | L536 | §14 | `[CURED 2026-10-18 (fp-final r3) — the carry · PR-V9]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| A04 | L541 | §14 | `↳` | FOLDED | §14 | "fold §3.1.23 ↳ P5" → "fold §3.1.23" |
| B362 | L541 | §14 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-7]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B363 | L541 | §14 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-1]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B364 | L541 | §14 | `[CURED 2026-10-18 (fp-final r3) — PR-V1]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B365 | L541 | §14 | `[CURED 2026-10-18 (fp-final r4) — PR-W2]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B366 | L541 | §14 | `[CURED 2026-10-18 (fp-final r3) — MN-V6]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B367 | L541 | §14 | `[CURED 2026-10-19 (fp-final r5) — PR-X4]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B368 | L541 | §14 | `[REFINED 2026-10-20 (fp-final P5) — the wave row names its p` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S22 | L541 | §14 | `STOP` | KEPT | §14 | KEPT as a design mark (§14 PR-1 car-0: ⛔ STOP at build if ST-1 has not landed and `stressorDynamics.js` cannot take ≤ 2 lines) |
| B369 | L542 | §14 | `[CURED 2026-10-19 (fp-final r5) — PR-X4]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B370 | L542 | §14 | `[CURED 2026-10-18 (fp-final r3) — MN-V6]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B371 | L542 | §14 | `[CURED 2026-10-18 (fp-final r4) — PR-W5: the feeder row live` | FOLDED | §14 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B372 | L542 | §14 | `[CURED 2026-10-18 (fp-final r3) — PR-V1]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B373 | L542 | §14 | `[CURED 2026-10-18 (fp-final r4) — PR-W2]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B374 | L542 | §14 | `[CURED 2026-10-18 (fp-final r3) — PR-V7]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B375 | L543 | §14 | `[CURED 2026-10-18 (fp-final r3) — SEAMS-r2-7 (b), PR's echo]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B376 | L550 | §14 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B377 | L550 | §14 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3)]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B378 | L550 | §14 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2: r5'` | FOLDED | §14 | a re-ruling's change note: the r5 car-0 clause it quotes (the token `patrol` joining `TRAVELLER_KINDS` and `HIDDEN_PATH_KINDS`) is not in the text, which states the riders' way admission as PR's own leaf read (OD-PR-47) |
| B379 | L550 | §14 | `[CURED 2026-10-19 (fp-final r5) — BD→PR route (9) · B.4 · B.` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S23 | L550 | §14 | `STOP` | KEPT | §14 | KEPT as a design mark (§14 PR-2 car-0: the two ⛔ STOP-at-build conditions, THE HUNT's reads and the riders' ways) |
| S24 | L550 | §14 | `STOP` | KEPT | §14 | KEPT as a design mark (§14 PR-2 car-0: the two ⛔ STOP-at-build conditions, THE HUNT's reads and the riders' ways) |
| B380 | L551 | §14 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3) · L-BD 40]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B381 | L551 | §14 | `[CURED 2026-10-19 (fp-final r5) — B.4 · L-BD 11e]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B382 | L551 | §14 | `[CURED 2026-10-19 (fp-final r5) — B.4]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B383 | L551 | §14 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2]` | FOLDED | §14 | a re-ruling stamp (its ruling tag only): the text at the same place states the ruling |
| B384 | L554 | §14 | `[CURED 2026-10-18 (fp-final r4) — A.3 · A.12: the untied ban` | FOLDED | §14 | a change note: the text at the same place already carries the change it names (the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B385 | L559 | §14 | `[CURED 2026-10-18 (fp-final r3) — PS-r2-15]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B386 | L559 | §14 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (1)(2)]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S25 | L559 | §14 | `STOP` | KEPT | §14 | KEPT as a design mark (§14 PR-3 car-0: ⛔ STOP at build for the SCREEN if PS's S-a fired) |
| B387 | L560 | §14 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (1)(2)(4)(7)]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B388 | L563 | §14 | `[REFINED 2026-10-18 (fp-final r3) — the two spellings of one` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B389 | L563 | §14 | `[CURED 2026-10-18 (fp-final r3) — PS-r2-15]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B390 | L568 | §14 | `[CURED 2026-10-19 (fp-final r5) — A.8 · B.9]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B391 | L568 | §14 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B392 | L569 | §14 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B393 | L570 | §14 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B394 | L584 | 14.1 | `[CURED 2026-10-18 (fp-final r3) — PR-V1 · PR-V7 · MN-V6]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B395 | L584 | 14.1 | `[CURED 2026-10-18 (fp-final r4) — PR-W2 · PR-W5]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B396 | L585 | 14.1 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3)]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B397 | L587 | 14.1 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §14 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B398 | L600 | 15.1 | `[ADDED 2026-10-20 (fp-final P6c; OP §15 PS · PR · RULINGS-P6` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B399 | L601 | 15.1 | `[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.4 · §E.4 · 'c` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B400 | L602 | 15.1 | `[ADDED 2026-10-20 (fp-final P6c; 'cure/D-FS-r1.md' §5 ST / P` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B401 | L606 | 15.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B402 | L607 | 15.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-13 (WC-PR-102)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B403 | L609 | 15.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-54 · WC-PR-1` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B404 | L610 | 15.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-9)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B405 | L610 | 15.1 | `[CURED 2026-10-18 (fp-final r4) — L-BD 39]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B406 | L611 | 15.1 | `[CURED 2026-10-18 (fp-final r4) — BD's route (6)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B407 | L613 | 15.1 | `[CURED 2026-10-19 (fp-final r5) — PR-X1 · B.8, the §15.1 res` | FOLDED | §15.1 | a change note: the text at the same place already carries the change it names (the cell states PL's ONE share toward the IMMEDIATE liege; the struck `crownReachAt` share is not in the text) |
| B408 | L613 | 15.1 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 · B.8 · B.9 ·` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B409 | L613 | 15.1 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S26 | L613 | 15.1 | `STOP` | FOLDED | 15.1 | "— STOP-PR-r4-1 as RE-RULED" removed from §15.1's PL cell (the ruling stands as §17's STOP-PR-r4-1 row) |
| B410 | L614 | 15.1 | `[CURED 2026-10-19 (fp-final r5) — PR-X4]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B411 | L615 | 15.1 | `[CURED 2026-10-19 (fp-final r5) — B.5 · the RN→PR route]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B412 | L615 | 15.1 | `[CURED 2026-10-18 (fp-final r4)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B413 | L616 | 15.1 | `[CURED 2026-10-20 (fp-final P5) — WC-PR-78]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B414 | L616 | 15.1 | `[CURED 2026-10-19 (fp-final r5) — CH→PR routes 1–3 · B.13]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B415 | L616 | 15.1 | `[CURED 2026-10-18 (fp-final r4)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| S27 | L617 | 15.1 | `STOP` | FOLDED | 15.1 | "(STOP-PR-2 RULED)" → "(ruled, OD-PR-14)" |
| B416 | L618 | 15.1 | `[CURED 2026-10-19 (fp-final r5) — PS's round-5 route · B.4]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B417 | L618 | 15.1 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B418 | L619 | 15.1 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 · PR-V2]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B419 | L620 | 15.1 | `[CURED 2026-10-19 (fp-final r5) — BD→PR route (9), the §15.1` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B420 | L620 | 15.1 | `[CURED 2026-10-19 (fp-final r5) — BD's routes (8)–(11) · BD'` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B421 | L620 | 15.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (1)–(7)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H21 | L620 | 15.1 | `round 5` | FOLDED | 15.1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B422 | L622 | 15.1 | `[CURED 2026-10-18 (fp-final r4)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B423 | L631 | 15.2 | `[CURED 2026-10-18 (fp-final r2)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B424 | L631 | 15.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V6]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B425 | L632 | 15.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V1 · PR-V5 · PR-V7 · th` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B426 | L638 | 15.2 | `[CURED 2026-10-18 (fp-final r3) — A.10]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B427 | L638 | 15.2 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.4 · SEAMS` | FOLDED | §15.2 | its census and the reason for ST's set folded into the cell (the superseded proposed set and its ruling tags dropped) |
| B428 | L643 | 15.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-12 (WC-PR-123)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B429 | L644 | 15.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-19 (WC-PR-69)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B430 | L645 | 15.2 | `[CURED 2026-10-18 (fp-final r4)]` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| A05 | L646 | 15.2 | `↳` | FOLDED | 15.2 | the token register row "`weeksCovered` (↳ r6: `swept`)" rewritten "`weeksCovered` · `swept`" |
| B431 | L646 | 15.2 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2]` | FOLDED | §15.2 | a re-ruling stamp (its ruling tag only): the row states the ruling — `patrol` enters neither `TRAVELLER_KINDS` nor `HIDDEN_PATH_KINDS` |
| B432 | L646 | 15.2 | `[CURED 2026-10-19 (fp-final r5) — B.4 · B.9 · B.12 · B.13 · ` | FOLDED | §15 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H22 | L646 | 15.2 | `r6:` | FOLDED | 15.2 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B433 | L669 | 16.1 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-15 · PR-r2-1: every ` | FOLDED | §16.1 | a change note: the text at the same place already carries the change it names (the lifecycle rows it introduces stand; the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B434 | L673 | 16.1 | `[CURED 2026-10-18 (fp-final r4) — PR-W2 · PR-W3]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B435 | L673 | 16.1 | `[CURED 2026-10-19 (fp-final r5) — PR-X5: r4 wrote it only wh` | FOLDED | §16.1 | a change note: the text at the same place already carries the change it names (the lifecycle rows it introduces stand; the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B436 | L678 | 16.1 | `[CURED 2026-10-18 (fp-final r3) — PR-V5 · the carry]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B437 | L678 | 16.1 | `[CURED 2026-10-18 (fp-final r3) — PR-V7: the r2b sentence "t` | FOLDED | §16.1 | a change note: the text at the same place already carries the change it names (the lifecycle rows it introduces stand; the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B438 | L685 | 16.1 | `[CURED 2026-10-18 (fp-final r4) — PR-W1 (RULINGS-ROUND4 B: "` | FOLDED | §16.1 | a change note: the text at the same place already carries the change it names (the lifecycle rows it introduces stand; the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B439 | L701 | 16.1 | `[CURED 2026-10-19 (fp-final r5) — PR-X2 · RULINGS-ROUND5 B.9` | FOLDED | §16.1 | a change note: the text at the same place already carries the change it names (the lifecycle rows it introduces stand; the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B440 | L717 | 16.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-12 · P5C-19]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H23 | L717 | 16.1 | `round 5` | FOLDED | 16.1 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B441 | L719 | 16.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-12 (WC-PR-123; RULINGS` | FOLDED | §16.1 | a change note: the text at the same place already carries the change it names (the lifecycle rows it introduces stand; the superseded reading it names is not in the text; its finding ids and ruling tags dropped) |
| B442 | L725 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-2]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B443 | L726 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — the carry]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B444 | L728 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — SEAMS-r2-7 (b)]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B445 | L729 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-5 · PR-r2-18]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B446 | L730 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6 · PR-r2-23]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B447 | L731 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-3 · PR-r2-1]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B448 | L731 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-3 (FAILED in round 2` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B449 | L732 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V1]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B450 | L732 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-1]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B451 | L734 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — ST's round-5 route to PR (` | FOLDED | §16.2 | a change note: the text at the same place already carries the change it names (the row states the latest rule; the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B452 | L738 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-9]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B453 | L738 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V4]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B454 | L739 | 16.2 | `[CURED 2026-10-20 (fp-final P5) — P5W-2's PR half (RULINGS-P` | FOLDED | §16.2 | a change note: the text at the same place already carries the change it names (the row states the latest rule; the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B455 | L739 | 16.2 | `[OPENED 2026-10-20 by delegation (P5 A.2); the wave order st` | FOLDED | §16.2 | an OPENED status stamp: the row states ES-2b OPENED by delegation; its date and ruling tag go to the rulings table (OD-PR-52) |
| B456 | L739 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-10 · PR-r2-11 · SEAM` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B457 | L740 | 16.2 | `[CURED 2026-10-20 (fp-final P5) — P5W-2's PR half (RULINGS-P` | FOLDED | §16.2 | a change note: the text at the same place already carries the change it names (the row states the latest rule; the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B458 | L740 | 16.2 | `[OPENED 2026-10-20 by delegation (P5 A.2); the wave order st` | FOLDED | §16.2 | an OPENED status stamp: the row states ES-2b OPENED by delegation; its date and ruling tag go to the rulings table (OD-PR-52) |
| B459 | L740 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-12]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B460 | L741 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — PS-r2-15 (A.2)]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B461 | L741 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-19 · SEAMS-r2-21]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B462 | L744 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — A.8]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B463 | L744 | 16.2 | `[RE-RULED 2026-10-19 (fp-final r6) — B.3 · PL-Y1]` | FOLDED | §16.2 | a re-ruling stamp (its ruling tags only): the row states the ruling (the sweep only on the lord's own need) |
| B464 | L744 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-20]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B465 | L744 | 16.2 | `[CURED 2026-10-18 (fp-final r4) — A.7 · the PL→PR route: the` | FOLDED | §16.2 | a change note: the text at the same place already carries the change it names (the row states the latest rule; the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B466 | L745 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-17 · SEAMS-r2-10]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B467 | L748 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-5 · SEAMS-r2-1]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B468 | L749 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-4]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B469 | L753 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-15]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B470 | L754 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-6 · PR-r2-14]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B471 | L754 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — the carry · PR-V5]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B472 | L755 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B473 | L756 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — STOP-PR-2 · PR-r2-13]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B474 | L756 | 16.2 | `[CURED 2026-10-18 (fp-final r3)]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B475 | L757 | 16.2 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-8; ST aligns]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B476 | L757 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 (FAILED in round 2` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B477 | L758 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V3]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B478 | L759 | 16.2 | `[CURED 2026-10-18 (fp-final r3) — PR-V10]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B479 | L760 | 16.2 | `[CURED 2026-10-18 (fp-final r4) — PR-W1]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B480 | L761 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — PR-X5: r4 wrote no stamp h` | FOLDED | §16.2 | a change note: the text at the same place already carries the change it names (the row states the latest rule; the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B481 | L761 | 16.2 | `[CURED 2026-10-18 (fp-final r4) — PR-W3]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B482 | L762 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — PR-X1 · B.8: "R39's Ashfor` | FOLDED | §16.2 | a change note: the text at the same place already carries the change it names (the row states the latest rule; the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B483 | L762 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — B.9]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B484 | L765 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 as RE-RULED (` | FOLDED | §16.2 | a change note: the text at the same place already carries the change it names (the row states the latest rule; the superseded reading it names is not in the text; its finding ids, ruling tags and route provenance dropped) |
| B485 | L766 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — B.13 · B.4 · BD-r4-10]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B486 | L769 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — CH→PR route 1 · SEAMS-r4-1` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B487 | L769 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — B.5]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B488 | L770 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — B.13 · CH→PR route 2 REFUT` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B489 | L773 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — PR-X2 · B.9]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B490 | L774 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — PR-X1 · B.8]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B491 | L775 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — B.4]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B492 | L776 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — B.5 · the RN→PR route]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B493 | L777 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — CH→PR route 3]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B494 | L778 | 16.2 | `[CURED 2026-10-19 (fp-final r5) — L-BD 11e · BD's round-5 ro` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B495 | L779 | 16.2 | `[CURED 2026-10-19 (fp-final r6) — B.3 · PL-Y1; PL P49 (f1)–(` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B496 | L780 | 16.2 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B497 | L781 | 16.2 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B498 | L782 | 16.2 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B499 | L783 | 16.2 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §16 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B500 | L791 | §17 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-5: PR never opens ` | FOLDED | §17 | its rule folded into the owner's row |
| S28 | L793 | §17 | `STOP` | FOLDED | §17 | "(⛔ STOP-PR-0's alternative)" → "(STOP-PR-0's ruled alternative, below)" |
| B501 | L794 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-2 · SEAMS-r2-12 · PR` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B502 | L794 | §17 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 (A.1) · PR-V6 (the` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B503 | L795 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-3 · PR-r2-27]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B504 | L795 | §17 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-3 (RULINGS-ROUND3 B)` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B505 | L796 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-1]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B506 | L796 | §17 | `[CURED 2026-10-18 (fp-final r3) — PR-V1 · PR-V7]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B507 | L796 | §17 | `[CURED 2026-10-18 (fp-final r4) — PR-W2 · PR-W3 (the points-` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B508 | L797 | §17 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-6 · PR-r2-15 · PR-` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B509 | L797 | §17 | `[CURED 2026-10-18 (fp-final r3) — the carry · PR-V5 · PR-V9]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B510 | L799 | §17 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-7 · PR-r2-25]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B511 | L801 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-7 · SEAMS-r2-4 · PR-` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B512 | L802 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-5 · PR-r2-18]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B513 | L803 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6 · PR-r2-23]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B514 | L804 | §17 | `[CURED 2026-10-19 (fp-final r5) — PR-X3]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B515 | L805 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-6 · PR-r2-10 · SEAMS` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B516 | L806 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-9]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B517 | L807 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-16 · PR-r2-24]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B518 | L808 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-26]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B519 | L808 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-14 (WC-PR-22)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B520 | L810 | §17 | `[CURED 2026-10-18 (fp-final r3) — PS-r2-15 (A.2)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B521 | L810 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-19 · Q1 · Q4 · SEAMS` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B522 | L811 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-4]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B523 | L812 | §17 | `[CURED 2026-10-20 (fp-final P5) — C.1]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B524 | L813 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-12 · P5C-19]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B525 | L815 | §17 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B526 | L816 | §17 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-11]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B527 | L817 | §17 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 · B.8 · B.9 ·` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B528 | L817 | §17 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-20]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B529 | L817 | §17 | `[CURED 2026-10-18 (fp-final r4) — A.7 · SEAMS-r3-6 · the PL→` | FOLDED | §17 | a change note: the text at the same place already carries the change it names (the struck `share01 > 0` condition and the reversed precedence are not in the row; its ruling tags dropped) |
| S29 | L817 | §17 | `STOP` | FOLDED | §17 | "STOP-PR-r4-1 as RE-RULED, RULINGS-ROUND4 §E" → "STOP-PR-r4-1, below" |
| B530 | L818 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-17 · SEAMS-r2-10]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B531 | L821 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-8]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B532 | L821 | §17 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 (A.1) · A.15 (the ` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B533 | L821 | §17 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.10: the s` | FOLDED | §17 | its ruling folded into the row |
| B534 | L824 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-27 · PR-r2-28]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B535 | L824 | §17 | `[CURED 2026-10-18 (fp-final r3) — PR-V3; the excess gate REF` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B536 | L824 | §17 | `[CURED 2026-10-18 (fp-final r4) — PR-W1]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B537 | L825 | §17 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-17 · SEAMS-r2-12]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B538 | L825 | §17 | `[CURED 2026-10-18 (fp-final r3) — A.14; the round's two prio` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B539 | L826 | §17 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-17]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B540 | L827 | §17 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-5 · HOST-r2-6 · PR` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B541 | L828 | §17 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-1 · PR-r2-4]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B542 | L829 | §17 | `[CURED 2026-10-18 (fp-final r4)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H24 | L829 | §17 | `round 2b` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H25 | L829 | §17 | `round 4` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B543 | L831 | §17 | `[CURED 2026-10-18 (fp-final r3)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B544 | L831 | §17 | `[CURED 2026-10-18 (fp-final r4)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B545 | L831 | §17 | `[CURED 2026-10-19 (fp-final r5)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H26 | L831 | §17 | `round 4` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H27 | L831 | §17 | `round 2b` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H28 | L831 | §17 | `round 3` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H29 | L831 | §17 | `round 4` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| H30 | L831 | §17 | `round 5` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| S30 | L832 | §17 | `STOP` | FOLDED | §17 | the ruled STOP row kept as a ruling, "STOP-PR-0 (ruled)", its ⛔ and ruling-file tag dropped; Ruled column 2026-10-18 |
| S31 | L833 | §17 | `STOP` | FOLDED | §17 | the ruled STOP row kept as a ruling, "STOP-PR-1 (ruled)"; Ruled column 2026-10-18 |
| S32 | L834 | §17 | `STOP` | FOLDED | §17 | the ruled STOP row kept as a ruling, "STOP-PR-2 (ruled)"; Ruled column 2026-10-18 |
| B546 | L835 | §17 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-9 · PR-r2-8]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B547 | L835 | §17 | `[CURED 2026-10-18 (fp-final r3) — PR-r2-8 · PR-V2 (A.1)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B548 | L836 | §17 | `[REFINED 2026-10-18 (fp-final r3) — the verifier's carry, cu` | FOLDED | §17 | its receipt and the alternative not taken folded into the row |
| B549 | L837 | §17 | `[CURED 2026-10-18 (fp-final r3) — MN-V6]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B550 | L837 | §17 | `[CURED 2026-10-19 (fp-final r5) — PR-X4: "first-to-land buil` | FOLDED | §17 | a change note: the text at the same place already carries the change it names (the row states the owned unit; "first-to-land builds it" is not in the text) |
| B551 | L838 | §17 | `[CURED 2026-10-18 (fp-final r4) — PR-W1]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B552 | L839 | §17 | `[CURED 2026-10-18 (fp-final r4) — BD's route (3) · L-BD 40]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B553 | L840 | §17 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (3)(5) · L-BD ` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B554 | L840 | §17 | `[CURED 2026-10-19 (fp-final r5) — BD→PR route (9) · B.5 · B.` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B555 | L841 | §17 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2]` | FOLDED | §17 | a re-ruling stamp: the row states the ruling (the holder's knowledge read; OD-PR-51 as re-ruled) |
| B556 | L841 | §17 | `[CURED 2026-10-18 (fp-final r4) — BD's route (4) · L-BD 41]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B557 | L841 | §17 | `[CURED 2026-10-19 (fp-final r5) — B.4 · B.13 · BD-r4-23 · BD` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B558 | L842 | §17 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (1)(2)(6) · A.` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B559 | L842 | §17 | `[CURED 2026-10-19 (fp-final r5) — B.4 · BD→PR route (8) · BD` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B560 | L843 | §17 | `[CURED 2026-10-18 (fp-final r4) — L-BD 39 (REFINED)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| A06 | L844 | §17 | `↳` | FOLDED | §17 | OD-PR-50's "↳ r6: ONE more count `swept?`" folded as the pair `{ seasonStartTick, weeks, swept? }` and one clause |
| B561 | L844 | §17 | `[CURED 2026-10-19 (fp-final r6) — B.3]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B562 | L844 | §17 | `[CURED 2026-10-19 (fp-final r5) — PR-X2 · B.9]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H31 | L844 | §17 | `r6:` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| B563 | L845 | §17 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2 · SE` | FOLDED | §17 | the re-ruling of ⭐ OD-PR-51: FOLDED as that row's final text (the riders take no token; the holder's knowledge read), the struck r5 text it marked as history removed (supersedes noted in the Ruled column) |
| B564 | L845 | §17 | `[REFINED 2026-10-19 (fp-final r5) — measured by the resumed ` | DROPPED | §17 | DROPPED as superseded by B563 (the r6 re-ruling): the r5 measurement of the two pinned arrays was the struck token's reason; the same measurement stands in PR16 as the reason PR declares no token |
| B565 | L845 | §17 | `[CURED 2026-10-19 (fp-final r5) — B.4 · L-BD 11e · BD's roun` | DROPPED | §17 | a stamp of the struck r5 text (removed with it, superseded by B563) |
| B566 | L846 | §17 | `[CURED 2026-10-20 (fp-final P5) — RULINGS-P5 C.1 · C.4 · C.1` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B567 | L847 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-12 (WC-PR-123)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B568 | L848 | §17 | `[CURED 2026-10-19 (fp-final r5)]` | FOLDED | §17 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H32 | L848 | §17 | `round 5` | FOLDED | §17 | reworded in the running text (the ruling it names cited by OD id or § ; see §3 TEXT CORRECTIONS); none remains in the new text |
| S33 | L848 | §17 | `STOP` | FOLDED | §17 | the ruled STOP-PR-r4-1 row rewritten as its ruling's final text (the proposals the ruling declined dropped; the quotation of the ruling folded as the row's Ruling cell); Ruled column 2026-10-18 · applied 2026-10-19 |
| B569 | L857 | §18 | `[CURED 2026-10-18 (fp-final r2) — PR-r2-23]` | FOLDED | §18 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B570 | L862 | §18 | `[CURED 2026-10-18 (fp-final r3) — A.1: "PR's felt sentence 9` | FOLDED | §18 | a change note: the text at the same place already carries the change it names (the sentence it introduces stands; the superseded sentence it names is not in the text) |
| B571 | L865 | §18 | `[CURED 2026-10-18 (fp-final r4) — A.7: the r3 sentence "The ` | FOLDED | §18 | a change note: the text at the same place already carries the change it names (the sentence it introduces stands; the superseded sentence it names is not in the text) |
| B572 | L869 | §18 | `[REFINED 2026-10-19 (fp-final r5) — "lost the Tolle gang's t` | FOLDED | §18 | its vocabulary reason FOLDED by substitution into sentence 16's scrutiny note (the line never says "trail", the map's RUNG word); its finding id dropped |
| B573 | L872 | §18 | `[CURED 2026-10-18 (fp-final r4) — A.7 · BD's routes · L-BD 3` | FOLDED | §18 | a change note: the text at the same place already carries the change it names (the sentence it introduces stands; the superseded sentence it names is not in the text) |
| B574 | L873 | §18 | `[CURED 2026-10-19 (fp-final r5) — L-BD 11e]` | FOLDED | §18 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| B575 | L874 | §18 | `[REFINED 2026-10-19 (fp-final r5) — the resumed seat: the li` | FOLDED | §18 | a change note: the text at the same place already carries the change it names (the sentence it introduces stands; the superseded sentence it names is not in the text) |
| B576 | L874 | §18 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 as RE-RULED]` | FOLDED | §18 | a stamp (date, source and finding ids only): the text it marks stands at the same place |
| H33 | L876 | §19 | `round 5a` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H34 | L878 | §19 | `ROUND 5a` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| B577 | L879 | §19 | `[CURED 2026-10-19 (fp-final r6)]` | MOVED | history/PR-cure-record.md Part 3 | a stamp inside old §19's answered question 1 (the riders' hidden franchise): MOVED with old §19 whole |
| H35 | L886 | §19 | `ROUND 4a` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H36 | L886 | §19 | `round 5a` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| S34 | L888 | §19 | `STOP` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H37 | L896 | §19 | `ROUND 3a` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| A07 | L898 | §19 | `↳` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| S35 | L898 | §19 | `STOP` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| S36 | L898 | §19 | `STOP` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| S37 | L898 | §19 | `STOP` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H38 | L907 | §19 | `round 5a` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H39 | L907 | §19 | `round 3` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| A08 | L909 | §19 | `↳` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H40 | L909 | §19 | `round 4a` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H41 | L909 | §19 | `round 3` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| S38 | L909 | §19 | `STOP` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| S39 | L909 | §19 | `STOP` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| A09 | L911 | §19 | `↳` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H42 | L911 | §19 | `round 3a` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H43 | L911 | §19 | `Round 2b` | MOVED | history/PR-cure-record.md Part 3 | in old §19's heading, answered questions, historical lists or ROUTES, moved whole (verbatim); the new §19 keeps only the four questions still open |
| H44 | L915 | Round 2b | `Round 2b` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| R00 | L915 | §20 | `### Round 2b (2026-10-18; 'cure/D-PR-r2.md'; inputs 'skeptic` | MOVED | history/PR-cure-record.md Part 2 | a cure-record round header, moved with old §20 whole (verbatim) |
| S40 | L963 | Round 2b | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S41 | L964 | Round 2b | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S42 | L965 | Round 2b | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| H45 | L977 | Round 3a | `Round 3a` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| R01 | L977 | §20 | `### Round 3a (2026-10-18; 'cure/D-PR-r3.md'; inputs 'skeptic` | MOVED | history/PR-cure-record.md Part 2 | a cure-record round header, moved with old §20 whole (verbatim) |
| B578 | L1008 | Round 3a | `[CURED 2026-10-18 (fp-final r4) — PR-W4: the relief read is ` | MOVED | history/PR-cure-record.md Part 2 | a bracket inside old §20 THE CURE RECORD: MOVED with it, verbatim |
| H46 | L1023 | Round 4a | `Round 4a` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| R02 | L1023 | §20 | `### Round 4a (2026-10-18; 'cure/D-PR-r4.md'; inputs 'skeptic` | MOVED | history/PR-cure-record.md Part 2 | a cure-record round header, moved with old §20 whole (verbatim) |
| U02 | L1023 | Round 4a | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| U03 | L1028 | Round 4a | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| U04 | L1029 | Round 4a | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| U05 | L1030 | Round 4a | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| U06 | L1031 | Round 4a | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| U07 | L1043 | Round 4a | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S43 | L1065 | Round 4a | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| H47 | L1080 | Round 4a | `round 4b` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S44 | L1080 | Round 4a | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S45 | L1080 | Round 4a | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| H48 | L1082 | Round 5a | `Round 5a` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| R03 | L1082 | §20 | `### Round 5a (2026-10-19; 'cure/D-PR-r5.md'; inputs 'skeptic` | MOVED | history/PR-cure-record.md Part 2 | a cure-record round header, moved with old §20 whole (verbatim) |
| S46 | L1082 | Round 5a | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| U08 | L1082 | Round 5a | `ROUTED-UNAPPLIED` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S47 | L1086 | Round 5a | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S48 | L1086 | Round 5a | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| H49 | L1094 | Round 5a | `r4:` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| H50 | L1094 | Round 5a | `r4:` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| H51 | L1094 | Round 5a | `r4:` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S49 | L1099 | Round 5a | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| S50 | L1111 | Round 5a | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| H52 | L1124 | Round 5a | `round 5b` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| H53 | L1126 | Round 6a | `Round 6a` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| R04 | L1126 | §20 | `### Round 6a (2026-10-19; lane D-RESIDUE-r6 — one residue la` | MOVED | history/PR-cure-record.md Part 2 | a cure-record round header, moved with old §20 whole (verbatim) |
| A10 | L1132 | Round 6a | `↳` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| R05 | L1137 | §20 | `### P5 (2026-10-20; 'cure/D-PS-ST-PR-p5.md'; lane D-PS-ST-PR` | MOVED | history/PR-cure-record.md Part 2 | a cure-record round header, moved with old §20 whole (verbatim) |
| S51 | L1137 | P5 | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| R06 | L1154 | §20 | `### P5d (2026-10-20; 'cure/D-PS-ST-PR-p5b-p5.md'; lane D-PS-` | MOVED | history/PR-cure-record.md Part 2 | a cure-record round header, moved with old §20 whole (verbatim) |
| S52 | L1154 | P5d | `STOP` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| A11 | L1157 | P5d | `↳` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| A12 | L1157 | P5d | `↳` | MOVED | history/PR-cure-record.md Part 2 | in old §20 THE CURE RECORD, moved whole (verbatim) |
| B579 | L1157 | P5d | `[OPENED …]` | MOVED | history/PR-cure-record.md Part 2 | a bracket inside old §20 THE CURE RECORD: MOVED with it, verbatim |
| R07 | L1161 | §20 | `### P6c (2026-10-20; lane BRACKETS-A2-program-volumes; input` | MOVED | history/PR-cure-record.md Part 2 | a cure-record round header, moved with old §20 whole (verbatim) |

## CURES AFTER FV-PR (2026-10-23, the cloud chair)
- F1 (B208, §6.6): the dangling ", is in §19" removed — "vetoable: the alternative not taken is the literal 0/0 → 0 with `points` uncapped".
- F2 (THE READER'S GUIDE item 3, the pass's recurring guide pattern): the TRUTH clause names the deciding court's own facts — its war front and its army's deployment, its posture and alignment (PR2, §3.2, §9.1 (e)).
- F3 (B563, OD-PR-51): the struck owner's mark shown struck again (~~⭐~~), the row labelled "re-ruled — the owner's-shape row of 2026-10-19 struck; no token, no shape", its Ruled cell "VISIBLE (its ⭐ struck)"; §19's mention likewise. The ⭐ count is unchanged.

## SEAMS CURES (2026-10-23, per SEAMS-P8, the chair's rulings)

- SEAMS-P8-4 · §3.1 (the patrol's will) · "a magistrate's order (CH, §10.5)" → "a magistrate's order (CH's `order` gift, OD-CH-50; §10.5 below)". (Ratchet: the OD-ruling set count reads 67 for 66 — the one added id is CH's OD-CH-50, now cited by name; no PR ruling changed; the last line is unchanged.)
