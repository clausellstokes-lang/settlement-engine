# PL — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8, lane C-PL; seats 1 and 2 of 2, 2026-10-23) — COMPLETE: header..§16 (old lines 1–967); the volume replaced

Old text: `history/PL-bracketed-1beabdc85.md` (414,769 bytes, 967 lines), byte-identical to `docs/DESIGN_FP_ARCH_PL.md` at the start of this seat (`cmp`, in `/home/user/fp-p8/docs`). New text so far: `consolidate/PL-new.md` (the new header + THE READER'S GUIDE + old lines 11–357 consolidated: THE OWNER'S WORDS, THE ANSWER, §0, §1, §2, §3, §4, §5, §6), built by one script over the old text (bracket spans found by balanced matching; every fold, substitution and line rewrite asserted to match exactly once), so every passage not named below is byte-faithful to `1beabdc85` minus its brackets. Seat 1 sat twice: its first sitting built the header..§3 (old lines 1–239) and was cut off by a container restart before §4; the resumed sitting checked that sitting's work (its scripts rebuild `PL-new.md` byte for byte; §3 ends at old line 239, complete; its 634 rows match the old text), kept it whole, and built §4, §5 and §6 (old lines 240–357) with the same scripts (scratchpad `cpl2/`, a copy of `cpl/` plus `d05.py`–`d07.py` and one whitespace marker in `build.py`; the header..§3 rebuild byte-identical). No fidelity error was found in the first sitting's sections. Seat 1's range is complete; seat 2 starts at `## §7 THE HEARINGS` (old line 358) and runs to the end. SEAT 2 (a cloud seat, after a usage-window pause and resume) built §7..§16 (old lines 358–967) with the same scripts (`cpl2/` plus `d08.py`–`d18.py`, `cure_record.py`, a `MARK_NOTE` hook in `build.py` and `ledger.py`, and the cure-record rows MOVED in `ledger.py`), wrote `history/PL-cure-record.md` (Part 1 = old lines 3–9, Part 2 = old §16, both verbatim, asserted), applied the chair's ruling on ⛔ STOP PL-C-1 in both seats' sections (`d17.py` and `head.py`), and confirmed by rebuild that seat 1's sections differ from seat 1's `PL-new.md` ONLY by that ruling (THE READER'S GUIDE item 8, PL8, §3.4's `armyTransitKernel.js` cell, §4.5). The finished text is `consolidate/PL-new.md`, copied once over `docs/DESIGN_FP_ARCH_PL.md`.

## 1. THE COUNT (by script, before writing)
The ratchet's MARKERS pattern (`tools/consolidate-ratchet.py`) finds **521** hits in the old text — the minimum. The ledger counts more finely and has **634 rows**, one per marker: **480** body brackets by balanced scan (`[CURED …]` 423 · `[REFINED …]` 46 · `[RE-RULED …]` 11) + **1** bracket inside §16 THE CURE RECORD + **52** markers NESTED inside a body bracket (44 nested brackets + 8 `↳` inside brackets; each disposed with its parent) + **7** `↳` outside brackets + **46** round words outside brackets + **32** `STOP` outside brackets + **1** `(fp-final …)` stamp outside brackets + **6** header/status lines + **9** cure-record headers. Every MARKERS hit maps to one of these rows (a hit inside a bracket to that bracket's row or its nested row).

**Dispositions: old markers 634 · folded 550 · dropped 2 · moved 82 · kept 0 · PENDING 0**.

| new section | folded | dropped (superseded) | moved | kept | STOPs |
|---|---|---|---|---|---|
| header | 0 | 0 | 28 | 0 | PL-C-1 (ruled; READER'S GUIDE 8) |
| THE OWNER'S WORDS · THE ANSWER | 2 | 0 | 0 | 0 | 0 |
| §0 | 10 | 0 | 0 | 0 | 0 |
| §1 | 33 | 0 | 0 | 0 | PL-C-1 (ruled; PL8) |
| §2 | 42 | 0 | 0 | 0 | 0 |
| §3 | 41 | 1 | 0 | 0 | PL-C-1 (raised; ruled) |
| §4 | 87 | 0 | 0 | 0 | PL-C-1 (ruled; §4.5) |
| §5 | 42 | 0 | 0 | 0 | 0 |
| §6 | 4 | 0 | 0 | 0 | 0 |
| §7 | 7 | 0 | 0 | 0 | 0 |
| §8 | 30 | 0 | 0 | 0 | PL-C-1 (ruled; flags row) |
| §9 | 34 | 0 | 0 | 0 | PL-C-1 (ruled; PL-5) |
| §10 | 25 | 0 | 0 | 0 | 0 |
| §11 | 60 | 0 | 0 | 0 | 0 |
| §12 | 91 | 1 | 0 | 0 | 0 |
| §13 | 12 | 0 | 0 | 0 | 0 |
| §14 | 8 | 0 | 0 | 0 | 0 |
| §15 | 22 | 0 | 0 | 0 | 0 |
| §16 | 0 | 0 | 54 | 0 | 0 |

STOPs of this pass: **⛔ STOP PL-C-1** (one, raised by seat 1) — RULED by the chair on 2026-10-23 (by delegation, vetoable) and APPLIED by seat 2. The word "passage": B099 (the `armyTransitKernel.js` row of §3.4) said "in PL, \"passage\" names only the charter's toll right (PL8, §4.5)", while the later P5 class `passage_of_arms` (B068, B093, B100; the fold §5 register's P5 row) uses the word in THE PASSAGE's meaning (PS14). THE RULING: the latest wins and the fold §5 is the vocabulary law — in PL the bare word "passage" carries THE PASSAGE's meaning; the charter's toll right is always named by its registered term `toll_exemption` (the fold §3.1.1), never by the bare word. APPLIED: B099 folded into that sentence (§3.4's cell); every `⛔ STOP PL-C-1` mark removed (§3.4's cell, THE READER'S GUIDE item 8 — now "in PL the bare word carries THE PASSAGE's meaning … the charter's toll right is always named by its registered term `toll_exemption`"); the charter's toll right renamed wherever PL named it with the bare word: PL8's down-obligations ("PASSAGE" → "the TOLL EXEMPTION (`toll_exemption`)"), §4.5 (title "Passage" → "The toll exemption and passage"; "Passage is a CHARTER TERM" → "The toll exemption (`toll_exemption`) is a CHARTER TERM"; "the CHARTER's passage is tolls only" → "the CHARTER's `toll_exemption` is tolls only"), §8's `polityObligationsEnabled` row and PL-5 ("passage" → "the toll exemption (`toll_exemption`)"), and §15.12 ("PL §4.5's charter carries tolls only (its `toll_exemption`)"); every other bare "passage" (PL7, §2's register, §3.2's class row, §4.5's passage of ARMS and B138's `rival` "for passage", §4.6, §5.3, P40, P56) already carries THE PASSAGE's meaning and stands. Rows B099 and B138: "FOLDED per the chair's ruling of PL-C-1 (2026-10-23)". No OD row added: the ruling lives here and in the program's record. Seat 2 raised NO new STOP: the two conflicts seat 1 flagged for §12 are settled by their rows' OWN latest brackets — OD-PL-56's B434 (r5) gives F.2's lend `max(1, floor(n × s × hold01))` with "a sub-vassal lending through its liege's line", which §4.7 F.2 (B154, the same round) states as each member's own band toward its IMMEDIATE liege, "never computed at the crown's own share"; read per rung (the row's own "`crownReachAt` per rung"), `crownReachAt(liege, m).share01` IS that band share, so the row now reads "`crownReachAt`'s `share01` per rung — a member's own band share toward its immediate liege, never the crown's own share — F.2's lend …, the crown's own `hold01` entering once"; OD-PL-51's B421 (r5) RE-HOMES `riders_quartered` from §15.9's weave list to shape 3 (the precedence friction's row, one resentment patch) and keeps `riders_lent` as wear, so the row states that (as §4.6, F.6 (b), §15.9 and OD-PL-34 do). OD-PL-22/23's "RULED … by the chair" is restated in the house form (the Ruled column). Superseded brackets: B085 (seat 1; by B084) and B413 (seat 2; WITHDRAWN for the incursion by B414's re-ruling). The vetoable READINGS carried inline (each already vetoable in the old text): §0 the patron exclusion (B017); PL4's share map (⚑ OWNER-VISIBLE, OD-PL-12); §4's readings (seat 1's list in §3); §8's two family placements (B250); PL-8's every-settlement read (B275's nested REFINED); §12's readings by delegation (OD-PL-52, -53, -55, -56, -57, -59).

## 2. THE SECTION MAP (old → new)
Old lines 1–9 (title, compile header lines 3–7 with the bracket template, the STATUS block line 9) → the new 4-line header (title verbatim) + THE READER'S GUIDE (new, 8 items) + the dispatch-gate paragraph (restated from the STATUS block's last sentences); old lines 3–9 → `history/PL-cure-record.md` Part 1, verbatim (written by seat 2 with Part 2). Old line 11 (B009, the owner's doctrines of 2026-10-18) → its own paragraph after THE OWNER'S WORDS. Old §0–§15 keep their numbers and titles (every "§x" of the text resolves unchanged; references to other volumes cite their sections by title or code). Inside §4–§6: B150 (the SITES CONSIDERED bracket between §4.6 and §4.7) → §4.6's closing paragraph **SITES CONSIDERED** (so §3.5's "§4's sites paragraph, item 2", F.6 (iii)'s "§4.6's SITES CONSIDERED paragraph, (3)" and the request door's "the SITES CONSIDERED paragraph below" resolve); B161 → **The banner's readings** paragraph after F.7; B166 + B167 → **The routes from THE BODIES** paragraph after §4.8 (3); B175 → §5's naming line; old line 332 (the STOP-1 line) removed — its ruling stands as §5.5 THE MEMBER WARS (the ruled path (A′), FALLBACK (B)); §5.6's "STOP-2 — RULED" heading → **THE DM'S KILL/ASSIGN**. SEAT 2: old §7–§15 keep their numbers and titles (§4.5's bold title in seat 1's range becomes "The toll exemption and passage" under the PL-C-1 ruling); old §16 THE CURE RECORD (lines 705–967) → `history/PL-cure-record.md` Part 2, verbatim; the new §16 is THE REVIEW TRAIL (one line). Inside §7–§15: B218 → §7's opening WHERE sentence (with B217's "relief is never a kind" and B216's final names); B252 → §8's closing paragraph (the presets claim waits on the host-side check); B253 + B254 → §9's opening sentences; B257 → THE HOOKS PER HOST's opening; B282 + B283 → §10's opening statement; the two `↳` sub-rows of §10's table → rows with their own labels (`oathSince`, `truce?`); B301 → §10's closing paragraph; B308's closing sentence → §11's opening sentence; §12's table gains a fourth column **Ruled** (the row's date, its amendment dates read from its own brackets, "by delegation · vetoable", and the OWNER's part), ⭐ on OD-PL-5, OD-PL-12 and OD-PL-60 (the rows the old text marked THE OWNER'S ROW and ⚑ OWNER-VISIBLE) and the heading's "⭐ marks the owner's own rows, each VISIBLE"; after the table, THE OPEN STOPS line (none; PL-C-1 ruled and applied); B474–B477 → §15.9's one statement of the closed weave list; B478 → §15.12's body; B479 → §15.12's closing "never wardens" sentence. Inside header..§3: §1 the laws' brackets folded into the law paragraphs (PL4's rationale moved after its (a)/(b) sentence; PL12's circle sentence rewritten from its nested REFINED); §2 the token census's "minted in round n" provenance removed; §3.5 the `P` bullet rewritten from B109's three nested markers; `A`'s executed receipt (B111) kept with its `cure/` path.

## 3. TEXT CORRECTIONS THAT ARE NOT MARKERS (each the latest ruling applied, or wording only)
- "the chair" removed from the running text: THE OWNER'S WORDS ("building the chair's idea" → "building on the idea"); PL4 ("the chair's reading" → "a reading by delegation"); §0 (B017); PL10 ("(the chair's)" → "the fold's §3.1.10 says so"); §2's map register ("is the chair's" → "holds them"); §3.2/§3.3 ("EC's volume takes the bracket — the chair's" → "the rung is written into EC's volume").
- Finding ids, ruling tags and ruling-file citations removed from the running text (SPL-·, SX-·, R4-·, PL-r·, PL-V·, PL-X1, HOST-r·, SEAMS-r·, P5C-·, WC-PL-·, RULINGS-* §·, CHAIR-NOTES ·, A.n/B.n/C.n tags); kept: the owner's verbatim quotations, ODQ cites, research cites (R4 C5/C8, R4 H7), census cites (V §1.14, D §0), the pin ids (P3, P5, P28, P34, P37, P39, P53), the OD rows, and the executed probe receipts under `cure/` (evidence, not review labels).
- STOP labels outside brackets: §0's `PEACE_STEP` row ("STOP-1, RULED (A′)" → the ruling's own words); §2's `seatChangedSince` ("STOP-2's precedent" → "§5.6's precedent"); the doctrines paragraph ("(STOP-2, §5.6)" → "(§5.6)").
- Struck-language restated as the design's own statement: PL4 "the old 'capped below an occupier's weight' clause stays dropped" → "no clause caps the share below an occupier's weight"; PL11 `remnant` → "never `remnant`"; the hold's band words (`cohesion`, `sound` "never"); the autonomy charter ("never `narrowed_sphere`"); §3.5 `A` (the STRUCK old clause removed); `liegeStanceToward`, `swornLinkSuspended`, the deference prose (change notes removed).
- Dates removed from the running text outside the header, the owner's words and the dispatch-gate paragraph: §0 "this program's delegation (10-16, 10-17)" → "the owner's delegation to this program"; B099 "the owner's word of 10-18" → "the owner's word".
- B016 + B018 (the W-SEAT amendment): B016's "`foreignSeatOf` and its four production readers are untouched" read with B018 (later): `foreignSeatOf` reads the additive export with its choice unchanged → "`foreignSeatOf`'s choice and its four production readers are untouched".
- B044's nested REFINED (P5) narrows PL12's "a subjugation that would close a circle is NAMED in its proposal" to the `SWEAR_FEALTY` card PL stages; an engine subjugation is named by the stage's receipt after the fact — written into the circle sentence.
- B094 ("no ninth class", round 4) read with B068 (P5, "said of the bodies, not of passage") → "the bodies add no class of their own" in §3.2 and §2.
- B109 (§3.5 `P`): the r3 rule (outcome rows only), its nested r4 extension (every protection occasion, both directions), the nested r5 change note (a repelled answer) and the nested r6 stamp stated once; "A.1's harm rule" → "the one harm rule"; "§4's sites bracket, item 2" → "§4's sites paragraph, item 2" (it resolves: B150 is folded as §4.6's closing SITES CONSIDERED paragraph, whose (2) is the den occasion).
- B120's nested REFINED in §4.1 kept inline as "(… — a reading by delegation, vetoable)"; its opening restates the ruling's design sentence; "The verifier's three gaps … are closed here and at F.6" removed.
- §4.3 (B124–B136): B136's 13 nested markers resolved to the latest text — (1) the share on FIELD FORCE (the quoted PS §7.5 line, which carried a ruling tag, restated in reported form as PS's rule; two quotation re-cut notes removed; `cure/D-PL-r4-probe/measure.out` kept as the measurement); (2) the first-sight call: the r6 RE-RULED (RULINGS-ROUND6 B.4) WITHDRAWS the r5 extension of the per-candidate window to the incursion — its quoted withdrawn text is DROPPED and PS's first-sight default stands; THE MINT WAITS FOR THE WEEK; the line frozen at the mint; a decreed `kept` (the mirror and first-member tie rule kept as a reading, vetoable); (3) the outcome: the r4 RE-RULED harm rule after EITHER answer (A.6's `kept` clause WITHDRAWN, not restated), the r5 town-raid read and the P5 DARK harm read stated once (`concludedWarRecord` kept as "no `concludedWarRecord` read"); (4) the dark gates. B135's review sentence (the round-1 record, the fold's register routing) removed. B125's per-candidate window stated as the design with its measurement.
- Ruling and finding tags removed from §4–§6's own sentences: "(A.5, below)" → "((1), below)"; "(A.2)" → "(THE MINT WAITS FOR THE WEEK)"; "§3.5's `P` bracket" → "§3.5's `P`"; "(PL-V5's principle)", "(PL-V2)", ", RULINGS-ROUND5 B.2", " — RULINGS-ROUND6 B.5", "(RULINGS-ROUND3 §F; …" removed; "L-BD 23b" → "THE BODIES' item 23b"; "CHAIR-NOTES 18 (d)" removed; B161's "§F.4's" and "§F.7's" (ruling-file sections) removed. KEPT: THE BANNER's own labels F.1–F.7, PR3/PR4/ST10/PS14 law ids, the pins (P14, P15, P39, P40, P41, P46, P47, P48, P53), the OD rows.
- "the chair" removed from §4–§6: B138 ("its coupling row with PL is the chair's at P4" → "the fold holds its coupling row with PL"); THE MEMBER WARS ("the chair's STOP-1 ruling (A′), RULINGS-AFTER-COMPILE" → "the ruled path (A′)"); FALLBACK (B) ("named by the chair" → "the named fallback"); B128 ("(the fold/spine lane)" → "(in the fold and the spine)").
- STOP labels outside brackets in §5: the §5.3 table's "(STOP-1 RULED (A′), §5.5)" → "(§5.5)"; THE MEMBER WARS; old line 332 removed; §5.6's "**STOP-2 — RULED (RULINGS-AFTER-COMPILE §PL): …**" → "**THE DM'S KILL/ASSIGN — the gap is ACCEPTED AND RECORDED.**". "(A′)" and "(B)" are kept as the names of the ruled path and its fallback (the `truce` clause says "NEVER written under (A′), the ruled path").
- Struck or withdrawn language restated as the design's own statement: §4.5 '"Members' armies are not hostile on one another's roads" is STRUCK' → "No rule makes members' armies friendly on one another's roads"; B122 "is withdrawn from PL's side" → "is no PL kind"; B161 (v) "struck `warden` from PL" → "`warden` is no PL word"; B147 the person-only ban form → "never the person-only `polity_ban:<wnpcId>:<banTick>`"; B175 "renamed from 'crown war'" → "never 'crown war'"; B198 "the old guard dropped the polity as a `polity_circle`" → "never as a `polity_circle`"; B132's replaced round-1 mapping and B143's "'evicted reads 1' is STRUCK" not restated; "since round 5" removed twice (§4.8's opening, §4.9 item 4).
- Evidence KEPT in §4–§6 (executed receipts and compile measurements behind a measured or CONFIRMED sentence): `cure/D-PL-r4.md` §1(a), §1(b) and open item 1 (so seat 1's allow line for it is withdrawn), `cure/D-PL-r3-probe/measure.out`, `cure/D-PL-r4-probe/measure.out`, `cure/D-PL-r5-probe/measure-r5.out`, `regex_r5.out`, `ageterm_r5.out`, `cure/D-PL-r2-probe/cycle.rerun.out`, `cure/D-PL-MN-RN-p5-probe/tokens-pl.out`, `cure/L-PL.md`, `cure/L-BD.md`, `vassalReaders.txt`, `channelReaders.txt`. DROPPED as review routing: `cure/D-BD-r4.md`, `cure/D-PR-r5.md`, `cure/D-PS-r3.md`, `cure/D-PS-r4.md`, `cure/D-PS-r5.md`, `cure/D-ST-r4.md`, `cure/D-ST-r5.md` (ALLOW-MISSING).
- Vetoable readings carried inline in §4–§6 as "a reading by delegation, vetoable" (each was REFINED or vetoable in the old text): B120 (the asked-and-refused lord), B125 (the no-row case), B136 (the mirror and tie rule), B143 (`oathSince` reads the standing oath), B156 (the late answer), B159/B160 (one kind for every arm of the friction), B161 (i)–(v), B167 (the order, never the stance, is priced), B169 (i)–(iii), B170, B171, B195 (two rows for one cause), B206 (the freshness clause).
- B159 and B160 (both on the one home of `riders_quartered`, P5 and r5) folded as ONE statement at B159's place; B141 + B142 (the two new kinds) folded as one clause after the kind list; B166 + B167 as one paragraph.
- Seat 1's first-sitting handoff checks, done: B109's "§4's sites paragraph, item 2" resolves to the SITES CONSIDERED paragraph's (2) (the den occasion); §3.5's "(§4.9's one path)" resolves to §4.9's "One path per quantity".

SEAT 2 (§7..§16):
- Ruling tags, finding ids and ruling-file cites removed from §7..§15's own sentences: "(STOP-2's ruling, §5.6)" and "(§5.6's P5 bracket)" → "(§5.6)" (§9); "(§15.2; P5C-15)", "(PL-r1-7)" removed (§9); "(RULINGS-ROUND6 B.4; B.11 binds the siege)" → "(a siege's waits for its reliever's belief, §4.3)" and "(B.11)" / "(RULINGS-ROUND6 B.4)" removed (§10); in §11 "(A.2)" → "(THE MINT WAITS FOR THE WEEK)", "— A.1", "(STOP-PR-r4-1 as re-ruled)", "(B.11)", "(P5C-3)", "(P5C-20)", "(P5C-17)", "(P5C-24)", "(P5C-15)" removed, "(RULINGS-ROUND6 B.4 — B.11 binds siege relief only)" → "(the per-reliever window binds siege relief only)", "(STOP-2's accepted gap)" → "(§5.6's accepted gap)"; in §15 "(R4-10, …)", "(R4-11, …, PL-r1-27; …)" trimmed to the OD rows. KEPT: research cites in the R4 H-form (R4 H1, H4, H7, Q3), the census and ODQ cites, the pins, the OD rows, PS/PR/ST/BD/MN/CH law and section cites, and every executed probe receipt under `cure/D-PL-*-probe/`.
- Round labels removed: §10's horizon ("round 4's rows" → "the banner's and the bodies' rows"; "round 5's rows" → "the friction's and the faith rows"; "no longer depends" → "does not depend"; "P5's garrison arm" → "the garrison arm"); §11's P52 ("(the r4 rule read 0.053)" and "(the r4 rule read 0.009)" — the superseded rule's readings — removed); §12 ("round 1 adds no shape", "ROUND 5:" ×2, "ROUND 5 —", "round 4 adds" restated as the design's own statement).
- "the chair", "the lane" and "the skeptic" removed: §10's `truce?` row ("AND the chair rules (B) in" → "AND (B) is ruled in"); §12 OD-PL-9 ("the chair routes it to GRAMMAR's catalog" → "GRAMMAR's catalog holds it"), OD-PL-12 ("the chair's reading" → "a reading by delegation"; "the alternative the skeptic offered" → "the alternative"), OD-PL-22/23 ("RULED … by the chair (RULINGS-AFTER-COMPILE)" → "(A′), the ruled path" / the ruling's own words), OD-PL-33 ("the chair's 10-18 ruling" removed), OD-PL-34 ("(the chair's)"), OD-PL-42 ("the fold §3.1 rows are the chair's" → "the fold §3.1 holds the rows"), and every "… are the lane's, vetoable" → "… are readings by delegation, vetoable" (OD-PL-52, -53, -55, -56, -57, -59); §15.6 ("the chair's 10-18 ruling moved the slot" → "the slot moved"); §15.12 (the brief's charter phrase "is routed to the chair" removed).
- §12 "… executed" ruling cites removed ("RULINGS-ROUND3 A.5/A.6 executed", "RULINGS-ROUND4 A.1/A.2 executed", "RULINGS-ROUND3 §F executed for PL", "THE BODIES' three routes executed", "L-BD 23b's four items executed", "CHAIR-NOTES 17 (b)'s PL half", "under RULINGS-P5 C.20", "(RULINGS-P5 C.1 · …)", "C.17's … read against A.8's re-homing" → "a fealty-record row, never a weave incident"); "(the owner's ~19:2x word)" → "(the owner's word)"; "for the ODQ §934.93 P5 addendum's visible rows" → "among the visible rows of ODQ §934.93's addendum"; "(§4's sites bracket, §15.12)" → "(§4.6's SITES CONSIDERED paragraph, §15.12)".
- Stale base text corrected by the row's own later brackets: OD-PL-35's "one `changeAuthorityPolicy.js` row (`auto`); minor in `decisionTier.js`" (B387 names it stale) → "two … rows (`auto`) — the sealed `polity_verdict` a minor …, the engine's `polity_verdict_default` a major …" (B388); OD-PL-41's "`polityEnabled` split into it …; `polityBreakEnabled` added" restated as "nine (§8), `polityHoldEnabled` and `polityBreakEnabled` among them"; OD-PL-4 "κ struck" → "no κ"; OD-PL-9 "renamed from `narrowed_sphere`" → "never `narrowed_sphere`"; OD-PL-29's "has resentment ≥ DRAFT 0.5" (STRUCK by B379) not restated.
- Superseded names kept as "never" statements, not dropped: `relief_answer` (§7: "`relief_answer` is no PL kind"), `polity_*` / `crown_*` (§7), `oathHolderEnabled` (§8), `readiness01`, `full · … · empty`, `STRENGTH_BANDS` (OD-PL-33), `crownReachAt(…).share01 > 0` (§15.12: "no … test"), `warden` (§15.12: "never wardens").
- Struck or withdrawn language restated as the design's own statement: §14.3's "'sampled once per year … slow by construction' is struck" → the reason the liege is read every tick (B459); §15.2's "'strained' was the member↔liege RESENTMENT … The intervener now decides" → "'Strained' is never the member↔liege RESENTMENT …: the intervener decides on ITS OWN belief …" (B467); §9 PL-1's map-supersession history (B261) → "By the owner's word … PL carries no supersession of the map's chain rule anywhere"; §9 PL-4's "Hosts unchanged (…)" → "`warCapacityReads.js` (143) makes its one read …"; PL-8's "PL had never named the door. PL-8 builds it" → "PL-8 builds the door".
- Re-rulings folded at their latest text (each re-ruling's marker removed, the withdrawn clause not restated): B285, B332, B340, B352 (the incursion's first-sight answer on the liege's inputs as they stand — the r6 withdrawal of the r5 belief condition for the incursion); B337 and B429 (the harm rule after EITHER answer — A.6's `kept` clause withdrawn); B268's nested RE-RULED; B427's nested RE-RULED and CURED. B413 (the r5 belief condition for the incursion, in OD-PL-48) DROPPED as superseded by B414.
- Dates removed from the running text of §7..§15 outside the owner's words and the rulings table: B261 ("the owner's word of 2026-10-18 05:57" → "the owner's word"), B399 ("the owner's word of 05:57" → "the owner's word"). THE OWNER'S QUESTION and THE OWNER'S WORDS headers of §14 and §15 keep their dates (the owner's words). The rulings table carries dates in its heading and its Ruled column only.
- Design marks carried by stamps KEPT: B348 (P52, "DRAFT, UNMEASURED") → "; the age term is DRAFT, UNMEASURED". Every PLAUSIBLE mark in §7..§15 stands (§9 PL-4's docket read, PL-8's two tail reads, §10's two round-trips, OD-PL-54).
- Review routing dropped (each a lane-to-lane instruction, never a design fact): B242's "routed in `cure/D-PL-r2.md` §5" (its design sentence kept: CH's crown ban needs `polityHoldEnabled`); B253's "the chair amends fold 21(a)"; B260's "The fold §3.1 rows are the chair's"; B261's "The fold's two passages … are HOST-r2-4's fold half, for P4"; B273's "the SEAMS-r1-2 idiom"; B476's "THE PATROLS' cites of it as wear … are routed"; B478's "(… is routed to the chair, `cure/D-PL-r2.md` §5)"; B479's "(routed to PR)" notes; pin provenance B303–B307 (which review id each pin answers).
- `↳` removed outside brackets in §10 (two table sub-row labels restated) and inside B478 ("the fold's map-side INBOX (h) ↳" → "INBOX (h)"). THE PATROLS' brief items are cited as "THE PATROLS, item n" (B478), as seat 1 cited THE BODIES' items.
- OD-PL-56 and OD-PL-51 — the two conflicts seat 1 flagged — are settled by the rows' own latest brackets (B434, B421), not decided anew; see §1's STOPs paragraph.

## 4. ALLOW-MISSING (`consolidate/PL-allow.txt` carries the same list, one token per line)
- HEADER TEMPLATE (9): the compile header line's `[CURED … — <id>: …]` / `[RE-RULED …]` / `[REFINED …]` template tokens, moved with the header block.
- REVIEW-TRAIL PATHS (33): the ruling files `briefs/RULINGS-ROUND1.md` … `RULINGS-ROUND5.md`, `briefs/RULINGS-P5.md`; the lane logs `cure/D-PL-r1.md` … `cure/D-PL-r5.md`, `cure/D-PL-r2b.md`, `cure/D-PL-MN-RN-p5.md`, `cure/D-ST-r4.md` and the probe folders `cure/D-PL-*-probe/` as folder names; `assessments/P5-COMPLETENESS-2026-10-20.md`; the skeptic and verifier reports `skeptic/…` with two verifier probes; the STATUS block's full path of `cure/L-PL.md` (the header now cites it in full). They stay in `history/PL-cure-record.md` and git.
- REVIEW-TRAIL PATHS added for §4–§6 (6): `cure/D-BD-r4.md`, `cure/D-PR-r5.md`, `cure/D-PS-r3.md`, `cure/D-PS-r4.md`, `cure/D-PS-r5.md`, `cure/D-ST-r5.md` — the routes and lane logs named only inside brackets as the source of a change; withdrawn: `cure/D-PL-r4.md` (it stands in §4.3 and §4.8 as evidence).
- SUPERSEDED NAME (1): `floor(n × share01 × hold01)` — the old banner lend formula, superseded by B154 (RULINGS-ROUND5 B.8): `lend(m) = max(1, floor(n(m) × s(m) × hold01))`, the sub-vassal's share its own band, the hold entering once.
- BACKTICK-PARITY ARTEFACTS (2): not names. The ratchet's token pattern stops at 200 characters, and §4.6's `kind ∈ …` list is 210, so the pattern pairs the NEXT backticks in that line and reads the prose between two code spans as a token; both artefacts are the old B141/B142 prose (folded). The new text shows one artefact of the same kind as a NEW token. The whole-volume ratchet needs both lines.
- PARTIAL-RATCHET ONLY (2), RESOLVED by seat 2: `faithCarriersOut` stands in §14.5 and `share01` in §12 OD-PL-56 (and §15.12), so both lines are deleted from `PL-allow.txt`. (Seat 1's note follows.) Partial: `faithCarriersOut` (backticked again at old line 664, §15) and `share01` (old line 615, §12 OD-PL-56) — absent from the new header..§6 but carried by seat 2's range; seat 2 deletes the line if its section keeps the token. The first sitting's `closeness01`, `falls`, `unopposed` lines are withdrawn: §4 and §5 keep them.
- SEAT 2 — REVIEW-TRAIL PATHS (3): `briefs/L-PR.md` (B478's source brief), `cure/D-FOLD-r3.md` and `cure/D-ST-r3.md` (B382's nested receipt, a routing record) — named only inside brackets as the source of a change; they stay in `history/PL-cure-record.md` and git.
- SEAT 2 — SUPERSEDED NAMES (2): the interim closed weave lists `recognition_withheld · appointment_imposed · faction_backed · charter_granted · riders_quartered` (B474) and `… · riders_quartered · riders_lent` (B475), superseded by B476's re-homing of `riders_quartered` to the fealty record; §15.9 states the final list `recognition_withheld · appointment_imposed · faction_backed · charter_granted · riders_lent`.
- SEAT 2 — MOVED WITH THE CURE RECORD (53): every token backticked ONLY inside old §16 THE CURE RECORD (old lines 705–967) — lane logs and probe outputs (`cure/D-*-r3.md` … `cure/D-RESIDUE-r6.md`, `walk.out`, `cycle.rerun.out`, `measure-r5.out`, `ageterm_r5.out` …), skeptic reports, `briefs/RULINGS-ROUND6.md`, `assessments/WIRING-CENSUS-2026-10-20.md`, and names quoted only in the record's dispositions (`paragonGateEnabled`, `paragonLean`, `banKeys`, `mintDeed`, `drainQueuedEvents`, `polity_ban:corps:…` …); each stands verbatim in `history/PL-cure-record.md` Part 2. The list is in `PL-allow.txt` under its own heading.
- No other superseded NAME was dropped in header..§6 (the superseded names `remnant`, `cohesion`, `sound`, `narrowed_sphere`, `crown_*`, the person-only `polity_ban:<wnpcId>:<banTick>` and "crown war" are kept as "never" statements).

## 5. THE RATCHET (the whole volume: the text of record against the new text)
`python3 tools/consolidate-ratchet.py history/PL-bracketed-1beabdc85.md consolidate/PL-new.md --allow-missing-file consolidate/PL-allow.txt` (the last run; exit 1 only for the explained count differences below):
```
tokens: old 1151 · new 1050 · missing 0 · new-in-new 7
  NEW tokens in the new text (each must be a registered name, never a mint):
   + ) and matched by none of the landed hint and wound regexes (executed), with no new field (the body's kind rides its episode); 
   + 1beabdc85
   + cure/
   + history/PL-cure-record.md
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/PL-cure-record.md
   + skeptic/
cites (path :: symbol): old 64 · new 64 · missing 0
laws (XX1–XXn bold): old 17 · new 17
OD rulings: old 70 · new 67  ← FEWER (explain in the ledger)
owner rows ⭐: old 0 · new 4
DRAFT marks: old 31 · new 26  ← FEWER (explain in the ledger)
UNMEASURED marks: old 28 · new 25  ← FEWER (explain in the ledger)
wave ids (XX-n): old 15 · new 13  ← FEWER (explain in the ledger)
flags (…Enabled): old 36 · new 35  ← FEWER (explain in the ledger)
review markers left in the new text: 0
RATCHET 5 DIFFERENCE CLASSES
```
- **tokens missing 0** (with `PL-allow.txt`) · **cites 64 = 64** · **laws 17 = 17** · **review markers left 0** · ⭐ 0 → 4 (OD-PL-5, -12, -60 marked, and the §12 heading's legend).
- **OD rulings 70 → 67**: the ratchet counts every distinct `OD-XX-n` id. All 61 PL rows (OD-PL-1 … OD-PL-61) stand, each once in §12 (no ruling superseded another row, so none was folded away); the three ids lost are OTHER volumes' rows named ONLY inside the moved cure record — `OD-PR-27` (old line 831), `OD-PS-42` (old line 869), `OD-PT-28` (old line 838).
- **DRAFT 31 → 26**: three are inside the moved cure record (old lines 705–967); one is B085 (seat 1, the superseded change note "every DRAFT cell is marked UNMEASURED"); one is B379's STRUCK threshold "has resentment ≥ DRAFT 0.5" (OD-PL-29), which the latest text does not restate. Every live DRAFT constant and cell stands; B348's "DRAFT, UNMEASURED" on P52 is kept.
- **UNMEASURED 28 → 25**: two inside the moved cure record; one in B085 (seat 1). Every live UNMEASURED mark stands.
- **wave ids 15 → 13**: the pattern `XX-n —` also matches the two STOP labels "STOP-1 —" and "STOP-2 —" (old lines 332, 334), not waves; both labels were removed by seat 1 (their rulings stand as §5.5 and §5.6). All thirteen waves PL-0 … PL-12 stand in §9.
- **flags 36 → 35**: `paragonGateEnabled` (CH's flag) is named only inside the moved cure record (old line 792). PL's nine flags and every host flag stand.
- **NEW tokens** (7): `1beabdc85`, the kit's history paths and `history/PL-cure-record.md` (the header and THE REVIEW TRAIL), `cure/` and `skeptic/` (THE REVIEW TRAIL's "the kit's `skeptic/` and `cure/`", CH's form), and one backtick-parity artefact (§4 above) — no mint.
- Other counts, by script: hearing-kind rows 10 = 10 (nine PL kinds and `call_in_answer`); flag rows 9 + the shared channel = the same; persisted shapes FOUR = FOUR (§10); scenario rows P1 … P61 with P2b and P5b, 63 = 63; OD rows 61 = 61.

## 6. THE STATE (both seats complete)
- Every marker row is resolved: PENDING 0. The section map is complete (§2), every PL "§x" in the new text resolves to a section or sub-section that exists (checked by script, `xref.py`; the hits it lists are other volumes' sections — PR §10.x, PS §7.5, BD §7.1/§10.x, ST §2.4–§2.5, census V §1.14 — and the owner's §735.2/§741.1), and every reference to another volume names that volume.
- `history/PL-cure-record.md` holds Part 1 (old lines 3–9) and Part 2 (old lines 705–967), both verbatim (asserted by `cure_record.py`).
- The ratchet's last run is §5; every remaining count difference is explained there. Then `consolidate/PL-new.md` was copied once over `docs/DESIGN_FP_ARCH_PL.md` (in `/home/user/fp-p8/docs`).
- Seat 1's handoff checks, done: OD-PL-56 and OD-PL-51 (§1); OD-PL-22/23's "by the chair" (the Ruled column); `faithCarriersOut` / `share01` deleted from `PL-allow.txt`.

## 7. THE ROWS (one per marker; `B` = body bracket by index in old-text order · `C` = cure-record bracket · `N` = marker nested inside a bracket · `A` = `↳` outside brackets · `H` = round word outside brackets · `S` = `STOP` outside brackets · `F` = `(fp-final …)` outside brackets · `L` = header/status line · `R` = cure-record header)

| id | old line | old section | first characters | disposition | new § | what happened |
|---|---|---|---|---|---|---|
| B000 | L7 | header | `[CURED 2026-10-17 (fp-final) — <id>: …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B001 | L7 | header | `[CURED 2026-10-18 (fp-final r1) — <id>: …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B002 | L7 | header | `[CURED 2026-10-18 (fp-final r2) — <id>: …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B003 | L7 | header | `[CURED 2026-10-18 (fp-final r3) — <id>: …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B004 | L7 | header | `[CURED 2026-10-18 (fp-final r4) — <id>: …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B005 | L7 | header | `[CURED 2026-10-19 (fp-final r5) — <id>: …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B006 | L7 | header | `[CURED 2026-10-20 (fp-final P5) — <id>: …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B007 | L7 | header | `[RE-RULED 2026-10-18 (fp-final r4) — <id>: …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B008 | L7 | header | `[REFINED …]` | MOVED | history | the bracket template inside the compile header line, moved with the header block to history |
| B009 | L11 | THE OWNER'S WORDS | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E: the o` | FOLDED | THE OWNER'S WORDS · THE ANSWER | the owner's doctrines of 2026-10-18 read against this volume, folded as its own paragraph after THE OWNER'S WORDS (the ruling-file tag and "No passage needed changing for them" removed) |
| B010 | L15 | THE OWNER'S WORDS | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1: "the town always ` | FOLDED | THE OWNER'S WORDS · THE ANSWER | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B011 | L27 | §0 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-3 · PL-r1-7 · HOST-r` | FOLDED | §0 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B012 | L28 | §0 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-22: the identity s` | FOLDED | §0 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B013 | L51 | §0 | `[CURED 2026-10-18 (fp-final r2) — PL-V2: 'polity_verdict' fo` | FOLDED | §0 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B014 | L57 | §0 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-22: not "the one" wr` | FOLDED | §0 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B015 | L64 | §0 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-1: attribution cor` | FOLDED | §0 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B016 | L66 | §0 | `[CURED 2026-10-17 (fp-final) — SPL-M4: W-SEAT A1.2.15 ('fore` | FOLDED | §0 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B017 | L66 | §0 | `[CURED 2026-10-17 (fp-final) — SPL-m4: the patron exclusion ` | FOLDED | §0 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B018 | L66 | §0 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-7: 'polityOf' could ` | FOLDED | §0 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B019 | L70 | §0 | `[CURED 2026-10-17 (fp-final) — R4-13: three facts the draft'` | FOLDED | §0 | a change note (three banner facts corrected in place); the three facts stand in the §0 rows `faithCarriersOut`, `applyImposition` and `closenessBetween` |
| B020 | L76 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-3 (RULINGS-ROUND1 PL` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B021 | L76 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M11: ONE pattern with two` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B022 | L78 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-7: each step reads t` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B023 | L78 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M3 · SX-22: THE WALK STOP` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B024 | L78 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M7: the walk is memoized ` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B025 | L78 | §1 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-6 (RULINGS-ROUND2 B:` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B026 | L80 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M10: the engine never re-` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B027 | L82 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-B1 · SX-05: κ IS STRUCK.]` | FOLDED | §1 | a change note (the struck κ); the law states that PL mints no loyalty quantity |
| B028 | L82 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1 (RULINGS-ROUND1 PL` | FOLDED | §1 | its rationale folded as a sentence of PL4 after "the obligation cascades (§4)" (the hold never keys the share; the cite `warCoalitionLedger.js :: warCoalitionActive` kept); the replaced SPHERE and clip are named only there |
| B029 | L84 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-B3 · SX-02: NO FIFTH BOOK` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B030 | L84 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1 · PL-r1-18 · SEAMS` | FOLDED | §1 | a change note (the band-mapped reach, the named head and observer, the one read for CH and PT); PL5 states all three |
| B031 | L86 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1: the liege is hear` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B032 | L88 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M15 · SX-23: the act is P` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B033 | L88 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-10 · PL-r1-15: the d` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B034 | L88 | §1 | `[CURED 2026-10-18 (fp-final r2) — the verifier's unnumbered ` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B035 | L88 | §1 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify minor ("a` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B036 | L90 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-B5 · SX-01: keeping and f` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B037 | L90 | §1 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify minor ("P` | FOLDED | §1 | a change note (the base text restated to what the measured bracket says); PL8 states it |
| B038 | L90 | §1 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 (RULINGS-ROUND3 A.6)` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B039 | L92 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M8: a polity of two is a ` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B040 | L94 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M2 · SX-14: the fealty qu` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B041 | L96 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M3 · SX-22: 'remnant' (wh` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B042 | L98 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M4: the per-tick vassal r` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B043 | L98 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-7: the weights come ` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B044 | L98 | §1 | `[CURED 2026-10-20 (fp-final P5) — P5C-20 (WC-PL-19: "no writ` | FOLDED | §1 | its content folded after the circle sentence (the receipt's one writer, the polity stage); its nested REFINED (the proposal naming narrowed to the `SWEAR_FEALTY` card; an engine subjugation named by the receipt) folded into the circle sentence it amends |
| N01 | L98 | §1 | `[REFINED 2026-10-20 (fp-final P5) — the PROPOSAL naming is n` | FOLDED | §1 | nested inside B044; disposed with it (its content folded or removed with the parent) |
| B045 | L98 | §1 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-6: "a circle" is an ` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B046 | L102 | §1 | `[REFINED 2026-10-17 (fp-final) — the draft named no per-tick` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B047 | L102 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-14 · PL-r1-2: "ONE c` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B048 | L104 | §1 | `[REFINED 2026-10-18 (fp-final r1) — the chair's host ruling ` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B049 | L106 | §1 | `[CURED 2026-10-17 (fp-final) — SPL-M5 · SX-21: every observe` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B050 | L106 | §1 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-8: the belief map ho` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B051 | L108 | §1 | `[REFINED 2026-10-17 (fp-final) — R4-14, R4-12: the owner's "` | FOLDED | §1 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B052 | L114 | §2 | `[CURED 2026-10-17 (fp-final) — SX-16 · SPL-m1: 'root · sworn` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B053 | L117 | §2 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-1: this tuple is w` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B054 | L117 | §2 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-4: "so the map nev` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B055 | L119 | §2 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-8: "read through the` | FOLDED | §2 | a change note (the struck belief read); the line states the PUBLIC-truth read by name (PL16) |
| B056 | L120 | §2 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-16: the old disjunct` | FOLDED | §2 | a change note (the old disjunction); the line states the opposite-sides rule |
| B057 | L121 | §2 | `[CURED 2026-10-18 (fp-final r2) — the verifier's unnumbered ` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B058 | L121 | §2 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-12: ONE read for ` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B059 | L123 | §2 | `[CURED 2026-10-18 (fp-final r2) — PL-V3: §4.6's key, named a` | FOLDED | §2 | a change note (§4.6's key named and exported); the read's line states it |
| B060 | L123 | §2 | `[REFINED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.14 ("'h` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B061 | L124 | §2 | `[CURED 2026-10-18 (fp-final r2) — PL-V3: the ADDENDUM's read` | FOLDED | §2 | a change note (the shared read absent before); its consumers are named in the line |
| B062 | L125 | §2 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.1: the derived st` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B063 | L126 | §2 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (3), 'cu` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B064 | L128 | §2 | `[CURED 2026-10-17 (fp-final) — SX-16 · R4-9: 'cohesion' is l` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B065 | L128 | §2 | `[REFINED 2026-10-17 (fp-final) — the chair's fourth word 'so` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B066 | L130 | §2 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1: "answers to Merew` | FOLDED | §2 | a change note (an overstated prose line); the line carries the measured prose |
| B067 | L134 | §2 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-5: "sway" is the m` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B068 | L136 | §2 | `[CURED 2026-10-20 (fp-final P5) — P5C-3 (WC-PL-100 · WC-PS-4` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B069 | L136 | §2 | `[REFINED 2026-10-18 (fp-final r1) — the owner's PASSAGE word` | FOLDED | §2 | folded (the owner's PASSAGE word and PL's part of it); its "the class at P4" is superseded by B068, which adds the class |
| B070 | L163 | §2 | `[CURED 2026-10-18 (fp-final r2) — PL-V2 · PL-V3 · RULINGS-RO` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B071 | L164 | §2 | `[CURED 2026-10-19 (fp-final r5) — A.8; 'cure/D-PL-r5-probe/r` | FOLDED | §2 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B072 | L164 | §2 | `[REFINED 2026-10-18 (fp-final r2)]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B073 | L165 | §2 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 · PL-V4 · A.8]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B074 | L166 | §2 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' routes · A.7]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B075 | L167 | §2 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B076 | L168 | §2 | `[CURED 2026-10-18 (fp-final r4)]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B077 | L169 | §2 | `[CURED 2026-10-19 (fp-final r5) — PL-X1]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B078 | L170 | §2 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-25 · HOST-r1-5]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B079 | L171 | §2 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-25]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B080 | L172 | §2 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-25]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B081 | L173 | §2 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-5]` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B082 | L174 | §2 | `[CURED 2026-10-20 (fp-final P5) — P5C-3 · P5C-12 · P5C-17 · ` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B083 | L175 | §2 | `[REFINED 2026-10-17 (fp-final) — SPL-m1 left the verdict wor` | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B084 | L181 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1: the SPHERE (which` | FOLDED | §3 | a change note (the SPHERE and the clip replaced); the rule beneath every row states the band map and the reach |
| B085 | L181 | §3 | `[CURED 2026-10-17 (fp-final) — SPL-B1 · SX-05: the κ column ` | DROPPED | — | superseded by B084: the κ column → SPHERE column note, itself replaced by the band map (B084); the UNMEASURED marks it asked for stand on every DRAFT cell |
| B086 | L183 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-18: every site names` | FOLDED | §3 | a change note (every site names its head and observer; the SPHERE keying superseded); 3.1 states each site |
| B087 | L183 | §3 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (3)]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B088 | L183 | §3 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B089 | L183 | §3 | `[CURED 2026-10-19 (fp-final r5) — A.8]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B090 | L183 | §3 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.3]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B091 | L183 | §3 | `[CURED 2026-10-18 (fp-final r3) — the PL-r2-verify minor ("§` | FOLDED | §3 | a change note (§15.12's cite corrected to (e)); 3.1 (e) and §15.12 carry it |
| B092 | L185 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1: the table becomes` | FOLDED | §3 | a change note (the table restructured); the table stands in its final columns |
| B093 | L194 | §3 | `[CURED 2026-10-20 (fp-final P5) — P5C-3]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B094 | L195 | §3 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (3): the` | FOLDED | §3 | folded into the `justice_at_home` cell; its "no ninth class" restated per B068 (the bodies add no class; the ninth class is `passage_of_arms`) |
| B095 | L199 | §3 | `[CURED 2026-10-17 (fp-final) — SPL-B2: the foreign book's te` | FOLDED | §3 | a change note (the landed counterparty-blind term, stated in §0); 3.3 states the directional term |
| B096 | L199 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1: the '0.45' ceilin` | FOLDED | §3 | a change note (the `0.45` ceiling replaced by the band map); 3.3 states the share |
| B097 | L201 | §3 | `[CURED 2026-10-17 (fp-final) — SPL-B2's unclassed sites.]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B098 | L201 | §3 | `[REFINED 2026-10-18 (fp-final r1) — with the sphere struck (` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B099 | L210 | §3 | `[CURED 2026-10-18 (fp-final r2) — PS-r2-25: "passage" is THE` | FOLDED | §3 | FOLDED per the chair's ruling of PL-C-1 (2026-10-23): B099's "in PL, 'passage' names only the charter's toll right" is superseded by the later P5 class `passage_of_arms` (B068 · B093 · B100; the fold §5 register's P5 row), which uses the word in THE PASSAGE's meaning — folded as "in PL the bare word 'passage' carries THE PASSAGE's meaning, and the charter's toll right is always named by its registered term `toll_exemption`"; the ⛔ STOP PL-C-1 mark removed |
| B100 | L211 | §3 | `[CURED 2026-10-20 (fp-final P5) — P5C-3: PS14's class has it` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B101 | L213 | §3 | `[CURED 2026-10-20 (fp-final P5) — C.1 (P5C-1, WC-PL-23; RULI` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| N02 | L213 | §3 | `↳ (11) and OD-FC-59 ↳ name it. PL's three uses — the declara` | FOLDED | §3 | nested inside B101; disposed with it (its content folded or removed with the parent) |
| N03 | L213 | §3 | `↳ name it. PL's three uses — the declaration's book term, th` | FOLDED | §3 | nested inside B101; disposed with it (its content folded or removed with the parent) |
| B102 | L213 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-24.]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B103 | L213 | §3 | `[CURED 2026-10-20 (fp-final P5) — P5C-3: the second new cons` | FOLDED | §3 | a change note (the second new consumer); the line names both new consumers |
| B104 | L215 | §3 | `[CURED 2026-10-17 (fp-final) — SPL-M5 · SX-21; REFINED by R4` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B105 | L219 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-8 · PL-r1-21: "as th` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B106 | L220 | §3 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-15: the read is na` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B107 | L221 | §3 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-4: the landed keys a` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B108 | L221 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-8: no observer reads` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B109 | L221 | §3 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 (RULINGS-ROUND3 A.6:` | FOLDED | §3 | folded with its three nested markers (r4: every occasion in both directions; r5: the den's closing on a repelled answer — a change note; r6: a stamp) — the latest text stated once |
| N04 | L221 | §3 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.6 · SEAMS` | FOLDED | §3 | nested inside B109; disposed with it (its content folded or removed with the parent) |
| N05 | L221 | §3 | `[CURED 2026-10-19 (fp-final r6) — PL-r5-verify F1 · SEAMS-r5` | FOLDED | §3 | nested inside B109; disposed with it (its content folded or removed with the parent) |
| N06 | L221 | §3 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-ST-r4.md' §5's rou` | FOLDED | §3 | nested inside B109; disposed with it (its content folded or removed with the parent) |
| B110 | L224 | §3 | `[CURED 2026-10-19 (fp-final r6) — two PL-r5-verify minors: "` | FOLDED | §3 | a change note (two clauses of `A` made exact: OBLIGATION's `protection_kept`, §10's import fallback); the bullet states both |
| B111 | L224 | §3 | `[CURED 2026-10-19 (fp-final r5) — PL-X1 (MAJOR, EXECUTED by ` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B112 | L224 | §3 | `[CURED 2026-10-18 (fp-final r4) — CHAIR-NOTES 17's PL half (` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B113 | L227 | §3 | `[CURED 2026-10-17 (fp-final) — SPL-M11.]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B114 | L227 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-15: the fear source ` | FOLDED | §3 | a change note (the fear source moved to PL-2's flag); 3.6 states `polityHoldEnabled` |
| B115 | L229 | §3 | `[CURED 2026-10-17 (fp-final) — SPL-M6 · SX-17.]` | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B116 | L230 | §3 | `[CURED 2026-10-20 (fp-final P5) — P5C-20 (WC-PL-27; RULINGS-` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B117 | L232 | §3 | `[CURED 2026-10-20 (fp-final P5) — P5C-20 (WC-PL-29): DARK UN` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| N07 | L232 | §3 | `↳ list only 'toll_exemption' and 'narrowed_*'); its carrier ` | FOLDED | §3 | nested inside B117; disposed with it (its content folded or removed with the parent) |
| B118 | L233 | §3 | `[CURED 2026-10-17 (fp-final) — SPL-M14: fold §3.1.1 rules th` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B119 | L234 | §3 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1: with no sphere le` | FOLDED | §3 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B120 | L242 | §4 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1's PL half (RU` | FOLDED | §4 | folded: the direct summons and its rows (the ruling's design sentence opens it); the nested REFINED kept as a reading by delegation, vetoable; the closing review sentence removed |
| N08 | L242 | §4 | `[REFINED 2026-10-19 (fp-final r6) — the PL-r5-verify minor: ` | FOLDED | §4 | nested inside B120; disposed with it (its content folded or removed with the parent) |
| B121 | L242 | §4 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-18 · PL-r1-16.]` | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B122 | L242 | §4 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10 (with PR-r2-17` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B123 | L242 | §4 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.1 ("the l` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B124 | L246 | §4 | `[CURED 2026-10-17 (fp-final) — SX-07: wall relief was automa` | FOLDED | §4 | a change note (relief was automatic and symmetric); 4.3 states the decided act |
| B125 | L246 | §4 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.11 ("THE ` | FOLDED | §4 | folded (the per-candidate window, its measurement and the no-row case; the nested REFINED kept as a reading by delegation, vetoable) |
| N09 | L246 | §4 | `[REFINED 2026-10-19 (fp-final r5) — the no-row case, so B.11` | FOLDED | §4 | nested inside B125; disposed with it (its content folded or removed with the parent) |
| B126 | L246 | §4 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 (MAJOR: "the answer ` | FOLDED | §4 | a change note (the mint after the DM's word); 4.3 states THE MINT WAITS FOR THE WEEK |
| B127 | L246 | §4 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-11: 'relief_answer' ` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B128 | L246 | §4 | `[CURED 2026-10-20 (fp-final P5) — P5C-20 (WC-PL-36; RULINGS-` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B129 | L246 | §4 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 · A.2's siege half]` | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B130 | L246 | §4 | `[CURED 2026-10-19 (fp-final r5) — the r4 verifier's minor ("` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B131 | L246 | §4 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 · RULINGS-ROUND3 A.6` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B132 | L246 | §4 | `[REFINED 2026-10-18 (fp-final r3) — A.6 rules the two facts ` | FOLDED | §4 | folded (the two-fact rule on the siege arm); the round-1 mapping it replaced is not restated |
| B133 | L246 | §4 | `[CURED 2026-10-19 (fp-final r6) — the PL-r5-verify minor: th` | FOLDED | §4 | a change note (the patch list); the list in 4.3 and 4.9 carries `riders_quartered` |
| B134 | L246 | §4 | `[CURED 2026-10-18 (fp-final r3) — the PL-r2-verify minor (a ` | FOLDED | §4 | a change note (a patch on every row); 4.3 states the two facts |
| B135 | L246 | §4 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-11 (RULINGS-ROUND2 A` | FOLDED | §4 | folded (the one decision; the incursion arm); the review sentence on the round-1 record and the fold's register routing removed |
| B136 | L246 | §4 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 (MAJOR: on an incurs` | FOLDED | §4 | folded, its 13 nested markers resolved to the latest text: (1) the share on FIELD FORCE (the PS quotation restated as PS's rule; two re-cut notes removed, the probe receipt kept); (2) the first-sight call — the r6 RE-RULED (RULINGS-ROUND6 B.4) WITHDRAWS the r5 extension of the per-candidate window to the incursion: its quoted text is DROPPED as superseded, PS's first-sight default stands; THE MINT WAITS FOR THE WEEK; the line frozen at the mint; a decreed `kept` (the mirror and tie rule kept as a reading, vetoable); (3) the outcome — the r4 RE-RULED harm rule after EITHER answer (A.6's `kept` clause WITHDRAWN, not restated), the r5 town-raid read and the P5 DARK harm read stated once; (4) the dark gates; the verifier's PLAUSIBLE-half sentence removed (trust is not a grip term is stated in 4.3 and 4.9) |
| N10 | L246 | §4 | `[CURED 2026-10-19 (fp-final r5) — the r4 verifier's minor (§` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N11 | L246 | §4 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify FAIL (ROU` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N12 | L246 | §4 | `[CURED 2026-10-19 (fp-final r5) — MN-r4-verify m6]) — in the` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N13 | L246 | §4 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify minor: §1` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N14 | L246 | §4 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.4 · PL` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N15 | L246 | §4 | `[CURED 2026-10-19 (fp-final r5) — the r4 verifier's minor ("` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N16 | L246 | §4 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 (MAJOR: with the DM ` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N17 | L246 | §4 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify FAIL PL-V` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N18 | L246 | §4 | `[RE-RULED 2026-10-18 (fp-final r4) — PL-r4-S1 (RULINGS-ROUND` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N19 | L246 | §4 | `[CURED 2026-10-19 (fp-final r5) — PL-V5 (the r4 verifier's F` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N20 | L246 | §4 | `[CURED 2026-10-20 (fp-final P5) — P5C-20 (WC-PL-39; RULINGS-` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| N21 | L246 | §4 | `[RE-RULED 2026-10-18 (fp-final r4) — PL-r4-S1, the round-4 S` | FOLDED | §4 | nested inside B136; disposed with it (its content folded or removed with the parent) |
| B137 | L250 | §4 | `[CURED 2026-10-17 (fp-final) — SPL-M13: a toll waiver set by` | FOLDED | §4 | a change note (the toll waiver as an override); 4.5 states the charter term |
| B138 | L250 | §4 | `[REFINED 2026-10-18 (fp-final r1) — the passage of ARMS (the` | FOLDED | §4 | FOLDED per the chair's ruling of PL-C-1 (2026-10-23): the passage of arms is THE PASSAGE's; the suspended link reads `rival` for passage (the bare word in THE PASSAGE's meaning, as ruled); "the chair's at P4" → the fold holds the coupling row; the CHARTER's toll right in the same paragraph is named `toll_exemption` |
| N22 | L250 | §4 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.14]; its ` | FOLDED | §4 | nested inside B138; disposed with it (its content folded or removed with the parent) |
| B139 | L252 | §4 | `[CURED 2026-10-17 (fp-final) — SPL-B5 · SX-01.]` | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B140 | L252 | §4 | `[REFINED 2026-10-17 (fp-final) — measured ('cure/L-PL.md' §1` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B141 | L252 | §4 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (2): 'pe` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B142 | L252 | §4 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.8 · STOP-` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B143 | L252 | §4 | `[CURED 2026-10-19 (fp-final r5) — PL-X1 (MAJOR, EXECUTED by ` | FOLDED | §4 | folded (`oathSince` free on master; the baseline is bookkeeping; `lastTransitionTick` rejected as the oath tick; the standing-oath reading kept, vetoable); the ruling's "'evicted reads 1' is STRUCK" not restated (§3.5 states `A`) |
| B144 | L252 | §4 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.6 · SEAMS` | FOLDED | §4 | a change note (one outcome per edge per episode); 4.6 states the rule |
| B145 | L252 | §4 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-9 · PL-r1-2: two add` | FOLDED | §4 | folded (the baseline row and the episode key inside shape 3; its nested r5 stamp removed) |
| N23 | L252 | §4 | `[CURED 2026-10-19 (fp-final r5) — PL-X1 · A.7]. (2) On a fea` | FOLDED | §4 | nested inside B145; disposed with it (its content folded or removed with the parent) |
| B146 | L252 | §4 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 · RULINGS-ROUND3 ` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B147 | L252 | §4 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 A.14 · C.Q3` | FOLDED | §4 | folded: THE REQUEST DOOR with its three nested markers (r5 the faith rows; r4 `body:` registered; r3 `patrol:` · `corps:` and ONE BAN GRAMMAR) stated once; the person-only ban form kept as a "never" statement |
| N24 | L252 | §4 | `[CURED 2026-10-19 (fp-final r5) — L-BD 23b]: the episode is ` | FOLDED | §4 | nested inside B147; disposed with it (its content folded or removed with the parent) |
| N25 | L252 | §4 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (1): 'bo` | FOLDED | §4 | nested inside B147; disposed with it (its content folded or removed with the parent) |
| N26 | L252 | §4 | `[CURED 2026-10-18 (fp-final r3) — PL-V4 (MAJOR: PS's 'PASSAG` | FOLDED | §4 | nested inside B147; disposed with it (its content folded or removed with the parent) |
| B148 | L252 | §4 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10 (the door): 'a` | FOLDED | §4 | folded (the one door; the closed prefix list; PL's own episodes); its four nested stamps removed |
| N27 | L252 | §4 | `[CURED 2026-10-18 (fp-final r3) — PL-V4: 'patrol:' and 'corp` | FOLDED | §4 | nested inside B148; disposed with it (its content folded or removed with the parent) |
| N28 | L252 | §4 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (1): 'bo` | FOLDED | §4 | nested inside B148; disposed with it (its content folded or removed with the parent) |
| N29 | L252 | §4 | `[CURED 2026-10-18 (fp-final r4) — A.7], and, for the precede` | FOLDED | §4 | nested inside B148; disposed with it (its content folded or removed with the parent) |
| N30 | L252 | §4 | `[CURED 2026-10-19 (fp-final r5) — A.8].]` | FOLDED | §4 | nested inside B148; disposed with it (its content folded or removed with the parent) |
| B149 | L252 | §4 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b PS-r2-3/4 ` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| N31 | L252 | §4 | `[CURED 2026-10-18 (fp-final r3) — PL-V4: the bracket re-word` | FOLDED | §4 | nested inside B149; disposed with it (its content folded or removed with the parent) |
| B150 | L254 | §4 | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E · L-ST` | FOLDED | §4 | folded as §4.6's closing paragraph **SITES CONSIDERED** (the paragraph §3.5's `P` cites as "§4's sites paragraph, item 2"); its five nested markers resolved: r4 FIELD FORCE, r6 the clearer-holds den (the `↳ r5` pointer removed), r5 the two closings and the opening tick, r4 both outcomes requested |
| N32 | L254 | §4 | `[CURED 2026-10-18 (fp-final r4) — A.5]. Where PL must know a` | FOLDED | §4 | nested inside B150; disposed with it (its content folded or removed with the parent) |
| N33 | L254 | §4 | `↳ r5) [CURED 2026-10-19 (fp-final r6) — PL-r5-verify F1 · SE` | FOLDED | §4 | nested inside B150; disposed with it (its content folded or removed with the parent) |
| N34 | L254 | §4 | `[CURED 2026-10-19 (fp-final r6) — PL-r5-verify F1 · SEAMS-r5` | FOLDED | §4 | nested inside B150; disposed with it (its content folded or removed with the parent) |
| N35 | L254 | §4 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-ST-r4.md' §5's rou` | FOLDED | §4 | nested inside B150; disposed with it (its content folded or removed with the parent) |
| N36 | L254 | §4 | `[CURED 2026-10-18 (fp-final r4) — SEAMS-r3-5 (MAJOR: "the de` | FOLDED | §4 | nested inside B150; disposed with it (its content folded or removed with the parent) |
| B151 | L256 | §4 | `[CURED 2026-10-19 (fp-final r5) — the r4 verifier's minor: t` | FOLDED | §4 | a change note (the jurisdiction read at PS §5.5); the heading cites PS §5.5 |
| B152 | L256 | §4 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 · SEAMS` | FOLDED | §4 | folded as the reading map of F.1–F.6 (F.n are this section's own design labels, kept); ruling and finding tags removed |
| B153 | L257 | §4 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1's PL half (RU` | FOLDED | §4 | a change note ("never skipping a lord's ROW"); F.1 states it |
| B154 | L258 | §4 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.8 · PR-X1` | FOLDED | §4 | folded (the hold enters once; the sub-vassal's own band); the superseded formula `floor(n × share01 × hold01)` is not restated (ALLOW-MISSING) |
| B155 | L260 | §4 | `[CURED 2026-10-19 (fp-final r6) — PL-r5-verify F2 · 'cure/D-` | FOLDED | §4 | a change note (PR's accessor is the one read); F.4 names `bannerCoverOf` |
| B156 | L260 | §4 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.9 · PR-X2` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B157 | L262 | §4 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 · RULINGS-ROU` | FOLDED | §4 | a change note (the ruling quote: the lender's credit for a lord that let its men go); F.6 (a) states it |
| B158 | L262 | §4 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.3 · PL-r5` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B159 | L262 | §4 | `[CURED 2026-10-20 (fp-final P5) — P5C-17 (WC-ST-42: "each vo` | FOLDED | §4 | folded together with B160 at this place (the one home of `riders_quartered`; the garrison arm joins it; the readings kept, vetoable) |
| B160 | L262 | §4 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1's PL half · S` | FOLDED | §4 | folded with B159 (one statement at B159's place: the word re-homed to shape 3, priced once; one kind for every arm; the sweep off F.4's tally) |
| B161 | L264 | §4 | `[REFINED 2026-10-18 (fp-final r4), each vetoable — (i) F.4's` | FOLDED | §4 | folded as its own paragraph, THE BANNER's readings (i)–(v), each vetoable; the struck `warden` stated as "no PL word" |
| B162 | L266 | §4 | `[CURED 2026-10-19 (fp-final r5) — L-BD 23b · A.8]` | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B163 | L267 | §4 | `[CURED 2026-10-19 (fp-final r6) — PL-Y3; the PL-r5-verify mi` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B164 | L267 | §4 | `[CURED 2026-10-19 (fp-final r5) — L-BD 23b · RULINGS-ROUND5 ` | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B165 | L268 | §4 | `[CURED 2026-10-19 (fp-final r5) — A.8]` | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B166 | L270 | §4 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' three routes (` | FOLDED | §4 | folded as its own paragraph (`peace_unkept`'s family and its no-patch answer); "Routed to BD" removed |
| B167 | L270 | §4 | `[REFINED 2026-10-18 (fp-final r4) — BD's route (1) prices "a` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B168 | L271 | §4 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.5 · PL-r5` | FOLDED | §4 | a change note (the stance guard); (4)(a) states it |
| B169 | L271 | §4 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-BD-r4.md' §5's rou` | FOLDED | §4 | folded (no kind and no prefix added; the three readings kept, vetoable); the BD route and its review label removed |
| B170 | L272 | §4 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-BD-r4.md' §5 (the ` | FOLDED | §4 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B171 | L274 | §4 | `[REFINED 2026-10-18 (fp-final r4) — the PL-r3-verify minor (` | FOLDED | §4 | folded (the section's purpose; the "deference patch" as resentment, vetoable); the citing finding and the fold's ↳ row pointer removed |
| N37 | L274 | §4 | `↳ r3 row ("grip moves by resentment, never by trust (PL §4.9` | FOLDED | §4 | nested inside B171; disposed with it (its content folded or removed with the parent) |
| B172 | L275 | §4 | `[CURED 2026-10-20 (fp-final P5) — P5C-17]` | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B173 | L275 | §4 | `[CURED 2026-10-19 (fp-final r5) — A.8: the ruled patch has i` | FOLDED | §4 | a change note (the ruled patch has its row); 4.9 item 1 lists `riders_quartered` |
| B174 | L278 | §4 | `[CURED 2026-10-19 (fp-final r5) — A.8]` | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B175 | L285 | §5 | `[CURED 2026-10-17 (fp-final) — SPL-m1: renamed from "crown w` | FOLDED | §5 | folded as the section's naming line ("renamed" restated as the naming rule) |
| B176 | L287 | §5 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-6: this now holds th` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B177 | L289 | §5 | `[CURED 2026-10-17 (fp-final) — SX-12: occasion (2) is decoup` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B178 | L289 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-30: the engine's def` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B179 | L291 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-16]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B180 | L291 | §5 | `[CURED 2026-10-17 (fp-final) — SPL-B4 · SX-20, decision side` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B181 | L291 | §5 | `[REFINED 2026-10-17 (fp-final) — measured ('vassalReaders.tx` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B182 | L305 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-5: 'vassalageSeat' r` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B183 | L306 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-6]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B184 | L307 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-5: the bundle stays ` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B185 | L308 | §5 | `[CURED 2026-10-19 (fp-final r6) — 'cure/D-PS-r5.md' §5's PL ` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B186 | L308 | §5 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.5]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B187 | L309 | §5 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.14 ("A SU` | FOLDED | §5 | folded (PS's ladder joins GUARDED; the rung is PS's half); the quoted struck PS clause is not restated |
| B188 | L311 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-5: the walker keyed ` | FOLDED | §5 | a change note (the walker walks both the type and the channel types); the walker paragraph states it |
| B189 | L313 | §5 | `[CURED 2026-10-20 (fp-final P5) — P5C-12]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B190 | L313 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-16 · PL-r1-2]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B191 | L313 | §5 | `[CURED 2026-10-17 (fp-final) — SPL-m7: PL-9's stage is the p` | FOLDED | §5 | a change note (the polity stage is PL-9's stage; its writer named); 5.4 names `polity.js :: writePolityContest` |
| B192 | L315 | §5 | `[CURED 2026-10-17 (fp-final) — SPL-M1.]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B193 | L315 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-2 (RULINGS-ROUND1 PL` | FOLDED | §5 | folded (why the writer never relabels); the rest of the note (defaults, conquest, the ruled path with (B)) is stated by 5.5's own paragraphs |
| B194 | L317 | §5 | `[CURED 2026-10-18 (fp-final r2) — PL-V2: the one minor row l` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B195 | L317 | §5 | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND1 PL-r1-2 r` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B196 | L317 | §5 | `[CURED 2026-10-18 (fp-final r2) — PL-V2, NO GHOST STATE: for` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B197 | L321 | §5 | `[CURED 2026-10-20 (fp-final P5) — P5C-12 (WC-PL-70; RULINGS-` | FOLDED | §5 | a change note (`truce` declared in §10); THE MEMBER WARS cites §10 |
| B198 | L323 | §5 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-6: the round-1 guard` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B199 | L325 | §5 | `[CURED 2026-10-17 (fp-final) — SPL-m2 · SX-20: 'lapsed' adde` | FOLDED | §5 | a change note (`lapsed` added); the verdict list carries it |
| B200 | L325 | §5 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-4: 'INTERVAL_WEEKS.s` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B201 | L332 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-20 and the L-FOLD la` | FOLDED | §5 | a change note on the STOP-1 line; the line is removed and the ruling stands as THE MEMBER WARS (the ruled path (A′), FALLBACK (B) named) |
| B202 | L334 | §5 | `[CURED 2026-10-17 (fp-final) — SPL-M2 · SX-14.]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B203 | L334 | §5 | `[REFINED 2026-10-17 (fp-final) — measured ('cure/L-PL.md' §1` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B204 | L334 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-9: keying rows by po` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B205 | L334 | §5 | `[CURED 2026-10-18 (fp-final r2) — PL-V3: the key is 'seatEpi` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B206 | L334 | §5 | `[REFINED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.5 asks ` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| N38 | L334 | §5 | `[CURED 2026-10-19 (fp-final r5) — PL-X1 · A.7]) and never as` | FOLDED | §5 | nested inside B206; disposed with it (its content folded or removed with the parent) |
| B207 | L334 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-20 and the L-FOLD la` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B208 | L334 | §5 | `[CURED 2026-10-20 (fp-final P5) — P5C-20 (WC-PL-73: "the dec` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B209 | L334 | §5 | `[CURED 2026-10-18 (fp-final r3) — the PL-r2-verify minor (wi` | FOLDED | §5 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B210 | L334 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-10]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B211 | L336 | §5 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-6 · PL-r1-2.]` | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B212 | L354 | §6 | `[REFINED 2026-10-18 (fp-final r3) — A.5's families]` | FOLDED | §6 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B213 | L354 | §6 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-26 · PL-r1-18: one r` | FOLDED | §6 | a change note (one rule for §3.2 and §6; head and observer named); §6 names the liege's own read |
| B214 | L354 | §6 | `[CURED 2026-10-17 (fp-final) — SPL-M12 · SX-13: the finder's` | FOLDED | §6 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B215 | L354 | §6 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (3): the` | FOLDED | §6 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B216 | L360 | §7 | `[CURED 2026-10-17 (fp-final) — SPL-m1 · SPL-m2 · SX-16 · SX-` | FOLDED | §7 | folded as the final names (`polity_*`, never `crown_*`; the hearing `fealty_break`, the casus `fealty_broken`); `remnant` → `stand_by` and `lapsed` stand in the table (seat 1 keeps `remnant` as a "never"); the fold's routing removed |
| B217 | L362 | §7 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-11: 'relief_answer' ` | FOLDED | §7 | folded into the sentence that replaces line 362 (relief is no kind; `relief_answer` kept as a "never" statement); the per-kind defaults it names stand in the rows |
| B218 | L362 | §7 | `[REFINED 2026-10-18 (fp-final r1) — the WHERE column, per th` | FOLDED | §7 | folded as the WHERE sentence (the host ruling's tags removed) |
| B219 | L366 | §7 | `[CURED 2026-10-18 (fp-final r3) — A.5]` | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B220 | L375 | §7 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10: no second sum` | FOLDED | §7 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B221 | L377 | §7 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-23: requirement 24(b` | FOLDED | §7 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B222 | L379 | §7 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 · RULINGS-ROUND4 A.2` | FOLDED | §7 | a change note (one place lists the input lines); the paragraph is that place |
| B223 | L387 | §8 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-15: the hold, the fe` | FOLDED | §8 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B224 | L388 | §8 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-15: a flag of its ow` | FOLDED | §8 | a change note (a flag of its own); the row is that flag |
| B225 | L389 | §8 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1 · PL-r1-10: the sp` | FOLDED | §8 | a change note (the sphere and the ceiling gone; PL7's definitions under `polityBreakEnabled`); the row states the final gates |
| B226 | L390 | §8 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-15 · PL-r1-10: a fla` | FOLDED | §8 | a change note (a flag of its own, off the owner-lit seat); the row states it |
| B227 | L390 | §8 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 · A.5]` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B228 | L391 | §8 | `[CURED 2026-10-19 (fp-final r5) — A.8]` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B229 | L391 | §8 | `[CURED 2026-10-18 (fp-final r4) — A.7 · THE BODIES' route (3` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B230 | L391 | §8 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 (FAIL: "the fealt` | FOLDED | §8 | a change note (the fealty record's writes left this flag for the families); THE FEALTY RECORD'S FAMILIES states the rule |
| B231 | L391 | §8 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-11: relief's gates a` | FOLDED | §8 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B232 | L392 | §8 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 · A.5: the family` | FOLDED | §8 | a change note (the family's own flag); the paragraph after THE FEALTY RECORD'S FAMILIES states its consequence (P38, P41) |
| B233 | L392 | §8 | `[REFINED 2026-10-18 (fp-final r2) — measured: 'npcLadderKern` | FOLDED | §8 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B234 | L392 | §8 | `[REFINED 2026-10-17 (fp-final) — the draft hung this on 'oat` | FOLDED | §8 | folded (PL's decider needs no GR-4 host; the draft's `oathHolderEnabled` kept as a "never") |
| B235 | L393 | §8 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-2 · PL-r1-17]` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B236 | L393 | §8 | `[CURED 2026-10-18 (fp-final r2) — PL-V1: the channel moved t` | FOLDED | §8 | a change note (the channel moved to its own row; the claim's occasion (2) reads the hold); the host-flags cell names `polityHoldEnabled` |
| B237 | L394 | §8 | `[CURED 2026-10-18 (fp-final r2) — PL-V1: it sat under 'polit` | FOLDED | §8 | a change note (why the channel left `polityContestEnabled`); the row states the final gate |
| B238 | L396 | §8 | `[CURED 2026-10-18 (fp-final r4) — A.7]` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B239 | L396 | §8 | `[CURED 2026-10-19 (fp-final r5) — A.8: 'riders_quartered' le` | FOLDED | §8 | a change note (`riders_quartered` moved to the OBLIGATION family); the obligations row and the families table carry it |
| B240 | L398 | §8 | `[CURED 2026-10-17 (fp-final) — SX-27: 'hearingWeekEnabled' n` | FOLDED | §8 | a change note (`hearingWeekEnabled` named); the section heading names it |
| B241 | L398 | §8 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-15: true now that ev` | FOLDED | §8 | a change note (the claim true once every shift had its own flag) |
| B242 | L398 | §8 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-15: the round-1 clai` | FOLDED | §8 | folded as the design sentence (CH's crown ban needs `polityHoldEnabled`); the review routing to CH's lane removed |
| B243 | L398 | §8 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 (the round-2 veri` | FOLDED | §8 | a change note (the claim true for the fealty record by the families) |
| B244 | L400 | §8 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 · RULINGS-ROUND3 ` | FOLDED | §8 | a change note (the ruling's quotation); the families paragraph states the rule |
| B245 | L404 | §8 | `[CURED 2026-10-20 (fp-final P5) — P5C-17]` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B246 | L404 | §8 | `[CURED 2026-10-19 (fp-final r5) — A.8]` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B247 | L404 | §8 | `[CURED 2026-10-18 (fp-final r4) — A.7: the banner's two rows` | FOLDED | §8 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B248 | L407 | §8 | `[CURED 2026-10-18 (fp-final r4) — A.6 · THE BODIES' routes (` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B249 | L407 | §8 | `[CURED 2026-10-19 (fp-final r5) — L-BD 23b · A.8]` | FOLDED | §8 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B250 | L409 | §8 | `[REFINED 2026-10-18 (fp-final r3), vetoable]` | FOLDED | §8 | a REFINED mark (vetoable) on the two occasions placed by the families' rule — kept inline as "a reading by delegation, vetoable"; the ruling tag (A.5) removed |
| B251 | L411 | §8 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-17: (A′) closed memb` | FOLDED | §8 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B252 | L413 | §8 | `[REFINED 2026-10-18 (fp-final r1) — the chair's host ruling ` | FOLDED | §8 | folded as the closing paragraph (the host ruling's tags removed) |
| B253 | L419 | §9 | `[CURED 2026-10-17 (fp-final) — SPL-M9: every wave gains L10'` | FOLDED | §9 | folded as the section's opening sentence (the EDITOR and Alignment lines, `causedBy`, PL a carrier, no behaviour called instrumentation); the fold's routing removed |
| B254 | L419 | §9 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-29: every TIER line ` | FOLDED | §9 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B255 | L419 | §9 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-19: the appointment'` | FOLDED | §9 | a change note (the appointment's producer); `APPOINT_TO_SEAT` is that producer in the verb list |
| B256 | L419 | §9 | `[CURED 2026-10-20 (fp-final P5) — P5C-20]` | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B257 | L421 | §9 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-14: the waves gave '` | FOLDED | §9 | folded (one hook per host, the delta measured once at car-0); the count of the old separate changes removed |
| B258 | L427 | §9 | `[CURED 2026-10-20 (fp-final P5) — C.1: "owned by the first c` | FOLDED | §9 | a change note ("owned by the first chain to land" struck); the cell names WC's owned `WC-car-0` |
| B259 | L432 | §9 | `[CURED 2026-10-20 (fp-final P5) — P5C-20]` | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B260 | L434 | §9 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-1 · HOST-r1-3: the` | FOLDED | §9 | folded (the port export, the borders lens, the puppet seat ruled once, port messages first); the fold routing sentence removed |
| B261 | L434 | §9 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-4 (routed to PL: "` | FOLDED | §9 | folded (H13 carries the tuple; the map MAY adopt it — an ask, never a supersession; the owner's word stands); the confirmation note, the superseded clause's history and the fold routing removed |
| N39 | L434 | §9 | `↳ r1 (a)) are HOST-r2-4's fold half, for P4.]` | FOLDED | §9 | nested inside B261; disposed with it (its content folded or removed with the parent) |
| B262 | L436 | §9 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-28: "the hold's word` | FOLDED | §9 | a change note (the band word left the surface; the homonym cure moved to PL-6); the FIRST-VISIBLE text states the outcome sentence |
| B263 | L438 | §9 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1 · PL-r1-24: the sp` | FOLDED | §9 | a change note (the sphere and the ceiling struck; the call-site count); the text names the ten sites |
| B264 | L438 | §9 | `[CURED 2026-10-20 (fp-final P5) — C.1: "owned by the first c` | FOLDED | §9 | a change note ("owned by the first chain to land" struck) |
| B265 | L440 | §9 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-11 · PL-r1-29 · PL-r` | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B266 | L440 | §9 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6: the wave buil` | FOLDED | §9 | folded (the decider `reliefAnswerOf` and its two facts; the incursion's first sight; the outcome line, said only of a fought and lost contest); the nested CURED change note removed |
| N40 | L440 | §9 | `[CURED 2026-10-19 (fp-final r5) — the r4 verifier's minor: t` | FOLDED | §9 | nested inside B266; disposed with it (its content folded or removed with the parent) |
| B267 | L440 | §9 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 · A.1 · A.2 · A.5 · ` | FOLDED | §9 | folded (the default from the decider, the mint at the week, the answer before the verdict, FIELD FORCE, the banner's protection deed and its line); "Hosts unchanged" restated as the host's read |
| B268 | L440 | §9 | `[CURED 2026-10-19 (fp-final r5) — B.11 · MN-X1's route · MN ` | FOLDED | §9 | folded (the per-reliever first belief; the incursion at first sight on the liege's inputs as they stand — the r6 re-ruling's text, its marker removed; four named callers; P55) |
| N41 | L440 | §9 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.4] — r` | FOLDED | §9 | nested inside B268; disposed with it (its content folded or removed with the parent) |
| B269 | L442 | §9 | `[CURED 2026-10-20 (fp-final P5) — P5C-20]` | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B270 | L442 | §9 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.4 · §F.6: PL-5 al` | FOLDED | §9 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B271 | L442 | §9 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 · A.8 · B.8 ·` | FOLDED | §9 | folded (the direct summons' rows, the sweep's `riders_quartered`, the cover from PR's season ledger; the friction line); the ruling tag and its nested stamp removed |
| N42 | L442 | §9 | `[CURED 2026-10-19 (fp-final r6)]); PL states the lend rule (` | FOLDED | §9 | nested inside B271; disposed with it (its content folded or removed with the parent) |
| B272 | L444 | §9 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.5]` | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B273 | L446 | §9 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (3): PL-` | FOLDED | §9 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B274 | L446 | §9 | `[CURED 2026-10-19 (fp-final r5) — L-BD 23b · A.8: PL-7's kin` | FOLDED | §9 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B275 | L448 | §9 | `[CURED 2026-10-20 (fp-final P5) — P5C-24 (WC-RN-10; RULINGS-` | FOLDED | §9 | folded (THE `seat_change` DEED DOOR, built by PL-8); the finding and ruling ids removed; the nested REFINED kept as a reading by delegation, vetoable, with its PLAUSIBLE mark |
| N43 | L448 | §9 | `[REFINED 2026-10-20 (fp-final P5) — every settlement is read` | FOLDED | §9 | nested inside B275; disposed with it (its content folded or removed with the parent) |
| B276 | L450 | §9 | `[CURED 2026-10-18 (fp-final r3) — the PL-r2-verify minor: th` | FOLDED | §9 | a change note ("one row" corrected to two); the text names both rows |
| B277 | L450 | §9 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.5]` | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B278 | L450 | §9 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-2 · PL-r1-17 · PL-r1` | FOLDED | §9 | a change note (the ending arm no longer waits on the ruled STOP); the car-0 sentence states the path |
| B279 | L450 | §9 | `[CURED 2026-10-18 (fp-final r2) — PL-V1 · PL-V2: the verdict` | FOLDED | §9 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B280 | L454 | §9 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-13: fold requirement` | FOLDED | §9 | folded as the parenthesis (requirement 16's sentence; the yearly rite draw with its UNMEASURED estimate) |
| B281 | L462 | §10 | `[CURED 2026-10-17 (fp-final) — SX-26 · SX-24 · SPL-M10: all ` | FOLDED | §10 | a change note (all four shapes declared here, in §12 and the fold's OD-FC-45); the routing removed |
| B282 | L462 | §10 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-2 · PL-r1-9 · PL-r1-` | FOLDED | §10 | folded as the section's opening statement (no new shape; the fields each shape carries; the outcomes transient) |
| B283 | L462 | §10 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 A.14 · PL-V` | FOLDED | §10 | folded (no new shape or field; the prefixes, the withheld default, the two derived reads) |
| B284 | L466 | §10 | `[CURED 2026-10-18 (fp-final r3) — A.5]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B285 | L466 | §10 | `[RE-RULED 2026-10-19 (fp-final r6) — B.4: r5's "once the lie` | FOLDED | §10 | a re-ruling folded: the incursion's default is taken at first sight on the liege's inputs as they stand (the withdrawn r5 clause not restated); the ruling tags removed |
| B286 | L466 | §10 | `[CURED 2026-10-18 (fp-final r3) — A.6]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B287 | L466 | §10 | `[CURED 2026-10-19 (fp-final r5) — the r4 verifier's minor: t` | FOLDED | §10 | a change note (one rule for the answer row: minted at the week, never from the first-sight default); the cell states it once |
| B288 | L466 | §10 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 · A.2 · A.6 · A.7 · ` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B289 | L466 | §10 | `[CURED 2026-10-19 (fp-final r5) — A.7 · A.8 · B.9]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B290 | L473 | §10 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-17]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B291 | L473 | §10 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 · A.5: "kept, unr` | FOLDED | §10 | a change note ("kept, unread" was false); the cell states the per-family rule |
| B292 | L473 | §10 | `[CURED 2026-10-19 (fp-final r5) — B.11]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B293 | L473 | §10 | `[RE-RULED 2026-10-19 (fp-final r6) — B.4]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B294 | L473 | §10 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify minor: "a` | FOLDED | §10 | a change note (one rule with §4.3 (2)); the cell states it |
| B295 | L475 | §10 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-8]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B296 | L476 | §10 | `[CURED 2026-10-18 (fp-final r4) — A.7 · THE BODIES' routes]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B297 | L476 | §10 | `[CURED 2026-10-19 (fp-final r5) — A.7 · A.8]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B298 | L476 | §10 | `[CURED 2026-10-20 (fp-final P5) — P5C-17 · P5C-20]` | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B299 | L477 | §10 | `[CURED 2026-10-19 (fp-final r5) — PL-X1 · RULINGS-ROUND5 A.7` | FOLDED | §10 | a change note (the one summary field's own paths); the row is its lifecycle |
| B300 | L478 | §10 | `[CURED 2026-10-20 (fp-final P5) — P5C-12 (WC-PL-70: "a shape` | FOLDED | §10 | a change note (a shape field with no lifecycle row); the row is its lifecycle |
| B301 | L480 | §10 | `[REFINED 2026-10-17 (fp-final) — the christening lives in 's` | FOLDED | §10 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B302 | L486 | §11 | `[CURED 2026-10-17 (fp-final) — SPL-m5: every row asserts; he` | FOLDED | §11 | a change note (every row asserts; heir-dependent rows DARK); the heading states the rule |
| B303 | L486 | §11 | `[CURED 2026-10-18 (fp-final r1) — the round-1 cures each car` | FOLDED | §11 | pin provenance (which review id each pin answers); the pins stand in the rows; the ids stay in the text of record |
| B304 | L486 | §11 | `[CURED 2026-10-18 (fp-final r2) — the round-2 cures carry th` | FOLDED | §11 | pin provenance (which review id each pin answers); the pins stand in the rows; the ids stay in the text of record |
| B305 | L486 | §11 | `[CURED 2026-10-18 (fp-final r2) — round 2b's pins: P42 reads` | FOLDED | §11 | pin provenance (which review id each pin answers); the pins stand in the rows; the ids stay in the text of record |
| B306 | L486 | §11 | `[CURED 2026-10-18 (fp-final r3) — round 3's pins: P9, P10, P` | FOLDED | §11 | pin provenance (which review id each pin answers); the pins stand in the rows; the ids stay in the text of record |
| B307 | L486 | §11 | `[CURED 2026-10-18 (fp-final r4) — round 4's pins: P5 (the si` | FOLDED | §11 | pin provenance (which review id each pin answers); the pins stand in the rows; the ids stay in the text of record |
| B308 | L486 | §11 | `[CURED 2026-10-19 (fp-final r5) — round 5's pins: P43 (the r` | FOLDED | §11 | pin provenance dropped; its closing design sentence (every relief pin reads its reliever as believing from the first week unless its row says otherwise; P55 pins the window) folded as the section's opening sentence |
| B309 | L492 | §11 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-6]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B310 | L495 | §11 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify minor (PL` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B311 | L500 | §11 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 · A.2's siege half: ` | FOLDED | §11 | a change note (the siege answer was minted before the DM's word); the row states the mint at the week |
| B312 | L500 | §11 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6's two facts]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B313 | L501 | §11 | `[CURED 2026-10-18 (fp-final r3) — A.6's two facts]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B314 | L511 | §11 | `[CURED 2026-10-18 (fp-final r2) — PL-V2]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B315 | L524 | §11 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-6]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B316 | L526 | §11 | `[CURED 2026-10-18 (fp-final r2) — PL-V2]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B317 | L530 | §11 | `[CURED 2026-10-18 (fp-final r2) — PL-V3]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B318 | L531 | §11 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 A.14]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B319 | L531 | §11 | `[CURED 2026-10-18 (fp-final r3) — PL-V4 (the two mover kinds` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B320 | L532 | §11 | `[CURED 2026-10-18 (fp-final r2) — PL-V1 · PL-r1-15]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B321 | L532 | §11 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 · A.5 ("P41 asser` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B322 | L533 | §11 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 C.Q4]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B323 | L533 | §11 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b PS-r2-3]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B324 | L533 | §11 | `[CURED 2026-10-18 (fp-final r4) — A.5 · SEAMS-r3-4]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B325 | L533 | §11 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify minor: "P` | FOLDED | §11 | a change note (P42's two outcomes are alternatives); the row states them as ALTERNATIVES |
| B326 | L533 | §11 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B327 | L534 | §11 | `[CURED 2026-10-19 (fp-final r6) — PL-r5-verify F1 · SEAMS-r5` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B328 | L534 | §11 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E, ST §6.6` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B329 | L534 | §11 | `[CURED 2026-10-18 (fp-final r4) — A.6 · SEAMS-r3-5 · D-ST-r3` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B330 | L534 | §11 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-ST-r4.md' §5 · RUL` | FOLDED | §11 | a change note (the repelled and self-ending closings); the row states them |
| B331 | L535 | §11 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B332 | L536 | §11 | `[RE-RULED 2026-10-19 (fp-final r6) — B.4: r5's "the omniscie` | FOLDED | §11 | a re-ruling folded: H's answer is taken the week the crossing is witnessed on H's inputs as they stand (the withdrawn r5 clause not restated); the ruling tag removed |
| B333 | L536 | §11 | `[CURED 2026-10-18 (fp-final r4) — A.5 · SEAMS-r3-4: "M's 'ho` | FOLDED | §11 | a change note ("M's `homeDefense`" marched M's keep to the border); the row reads FIELD FORCE |
| B334 | L536 | §11 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 · A.2: "the same row` | FOLDED | §11 | a change note ("the same rows a week later" was false); the row states the mint at the docket's resolution |
| B335 | L536 | §11 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B336 | L537 | §11 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 · A.5; the freshn` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B337 | L538 | §11 | `[RE-RULED 2026-10-18 (fp-final r4) — PL-r4-S1: the harm rule` | FOLDED | §11 | a re-ruling folded: the harm rule after either answer — (c) states `protection_kept`, the refusal priced by the answer alone |
| B338 | L538 | §11 | `[CURED 2026-10-18 (fp-final r4) — PL-V5 (partial) · A.1]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B339 | L538 | §11 | `[CURED 2026-10-19 (fp-final r5) — PL-V5 (r4-verify, partial)` | FOLDED | §11 | a change note (the town `raid`, the supply raid, (c) flipped); the row states them |
| B340 | L539 | §11 | `[RE-RULED 2026-10-19 (fp-final r6) — B.4: r5's "H believing ` | FOLDED | §11 | a re-ruling folded: H answers at first sight on its inputs as they stand (the withdrawn r5 clause not restated); the ruling tag removed |
| B341 | L539 | §11 | `[CURED 2026-10-18 (fp-final r4) — PL-W1 · A.2]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B342 | L540 | §11 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.3 · PL-Y1` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B343 | L540 | §11 | `[CURED 2026-10-19 (fp-final r6) — B.3 · PL-Y1]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B344 | L540 | §11 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.4 · §F.6]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B345 | L540 | §11 | `[CURED 2026-10-19 (fp-final r5) — B.8 ((g)) · B.9 ((a), (d),` | FOLDED | §11 | a change note (the lend, the season ledger, the friction row); the row states them |
| B346 | L541 | §11 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.5]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B347 | L542 | §11 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' routes (1)–(3)` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B348 | L543 | §11 | `[CURED 2026-10-18 (fp-final r4) — CHAIR-NOTES 17's PL half; ` | FOLDED | §11 | a stamp carrying a design mark: its ids removed, its "DRAFT, UNMEASURED" kept in the row |
| B349 | L543 | §11 | `[CURED 2026-10-19 (fp-final r5) — PL-X1 · A.7: "P52 gains th` | FOLDED | §11 | a change note (the busy-edge and relit worlds added); the row states them; the superseded rule's readings (0.053, 0.009) removed with their round label |
| B350 | L544 | §11 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1's PL half · S` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B351 | L545 | §11 | `[CURED 2026-10-19 (fp-final r5) — L-BD 23b · RULINGS-ROUND5 ` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B352 | L546 | §11 | `[RE-RULED 2026-10-19 (fp-final r6) — B.4: r5's "no 'liegeAns` | FOLDED | §11 | a re-ruling folded: (c) the incursion's `liegeAnswer` IS taken at first sight, its share in the contest and its outcome row after the answer (the withdrawn r5 clause not restated) |
| B353 | L546 | §11 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.11 · MN-X` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B354 | L547 | §11 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B355 | L548 | §11 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B356 | L549 | §11 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B357 | L550 | §11 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B358 | L551 | §11 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B359 | L552 | §11 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B360 | L560 | §12 | `[CURED 2026-10-17 (fp-final) — SX-16 · SPL-m1]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B361 | L562 | §12 | `[CURED — SPL-M10]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B362 | L563 | §12 | `[CURED — SPL-B1 · SX-05]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B363 | L563 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1, RULINGS-ROUND1 PL` | FOLDED | §12 | a change note (the sphere and the ceiling replaced); the row states the share in every class |
| B364 | L565 | §12 | `[CURED — SPL-M15 · SX-23]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B365 | L566 | §12 | `[CURED — SPL-M4]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B366 | L566 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-7: the weights throu` | FOLDED | §12 | folded into OD-PL-7 (the weights through `vassalageSeatsOf`; the book follows `polityOf`'s liege) |
| B367 | L567 | §12 | `[CURED — SX-26]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B368 | L568 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B369 | L571 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B370 | L572 | §12 | `[CURED — SPL-M8]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B371 | L572 | §12 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-17: "from the map ` | FOLDED | §12 | a change note (the map program's political regions struck); the row states genesis and the DM's verbs only |
| B372 | L575 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-1]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B373 | L577 | §12 | `[CURED — SPL-B5 · SX-01; REFINED]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B374 | L578 | §12 | `[CURED — SPL-M12 · SX-13]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B375 | L579 | §12 | `[REFINED]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B376 | L580 | §12 | `[REFINED]` | FOLDED | §12 | a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record |
| B377 | L581 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-20]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B378 | L582 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-20]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B379 | L588 | §12 | `[CURED 2026-10-20 (fp-final P5) — P5C-15: "has resentment ≥ ` | FOLDED | §12 | folded into OD-PL-29 (the intervener never reads a third pair's resentment); the struck `≥ DRAFT 0.5` threshold not restated (one DRAFT word fewer, explained in §5) |
| B380 | L588 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-27: 'convergence.js'` | FOLDED | §12 | folded into OD-PL-29 as the landed evidence (`FRIENDLY_REL`) for the exclusion of the liege's chain |
| B381 | L592 | §12 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-15]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B382 | L592 | §12 | `[REFINED 2026-10-18 (fp-final r2) — HOST-r2-9 (routed to ST ` | FOLDED | §12 | folded into OD-PL-33 with its two nested brackets: H13's held sites are THE SITES' record, reported as ST's readiness word; `readiness01`, `full · … · empty` and `STRENGTH_BANDS` kept as "never" statements; routing ids, the review receipt and the ST line check removed |
| N44 | L592 | §12 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.10 ("THE ` | FOLDED | §12 | nested inside B382; disposed with it (its content folded or removed with the parent) |
| N45 | L592 | §12 | `[CURED 2026-10-18 (fp-final r4) — the PL-r3-verify FAIL (§E.` | FOLDED | §12 | nested inside B382; disposed with it (its content folded or removed with the parent) |
| B383 | L593 | §12 | `[CURED 2026-10-18 (fp-final r4) — round 4 adds no shape and ` | FOLDED | §12 | folded into OD-PL-34 (`peace_unkept`, the `body:` and `riders_lent:` forms; `liegeAnswer` PS's) |
| B384 | L593 | §12 | `[CURED 2026-10-19 (fp-final r5) — round 5 adds no shape and ` | FOLDED | §12 | folded into OD-PL-34 (`oathSince`; `riders_quartered` a shape-3 kind; its episode form; the faith rows' kinds; `weeksCovered` PR's) |
| B385 | L593 | §12 | `[CURED 2026-10-20 (fp-final P5) — P5 adds no shape: shape 2 ` | FOLDED | §12 | folded into OD-PL-34 (`truce?`; the `ask:` and garrison episode forms; two OWNER-VISIBLE fields, OD-PL-60) |
| B386 | L594 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-2, RULINGS-ROUND1 PL` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B387 | L594 | §12 | `[CURED 2026-10-18 (fp-final r3) — the PL-r2-verify minor (st` | FOLDED | §12 | a change note (the stale singular); OD-PL-35's base text corrected to TWO `auto` rows as B388 rules |
| B388 | L594 | §12 | `[CURED 2026-10-18 (fp-final r2) — PL-V1 · PL-V2: two 'auto' ` | FOLDED | §12 | folded into OD-PL-35 (two `auto` rows — the sealed minor, the default a major; the state pass; the shared channel and its host flag) |
| B389 | L595 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-2 · PL-r1-20]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B390 | L596 | §12 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-22]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B391 | L597 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-8]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B392 | L598 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-9]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B393 | L599 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-4]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B394 | L599 | §12 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-4: the windows are w` | FOLDED | §12 | folded into OD-PL-40 (the windows written as the landed `INTERVAL_WEEKS` keys) |
| B395 | L600 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-15 · PL-r1-17]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B396 | L600 | §12 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-15 · PL-V1: still ni` | FOLDED | §12 | folded into OD-PL-41 (`polityContestEnabled` needs `polityHoldEnabled`; the flagless shared channel) |
| B397 | L600 | §12 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15 · A.5: still nine` | FOLDED | §12 | folded into OD-PL-41 (no flag for the fealty record; one owner flag per family) |
| B398 | L601 | §12 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-1 · HOST-r1-3]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B399 | L601 | §12 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-4: PL-1 (c) is the` | FOLDED | §12 | folded into OD-PL-42 (the export an additive offer, never a supersession); the fold's rows restated without "the chair" |
| B400 | L602 | §12 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-19]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B401 | L603 | §12 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-12]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B402 | L603 | §12 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 A.8: RN cit` | FOLDED | §12 | folded into OD-PL-44 (RN cites it; the hold term reads belief) |
| B403 | L604 | §12 | `[CURED 2026-10-18 (fp-final r2) — PL-V3, RULINGS-ROUND1 ADDE` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B404 | L605 | §12 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route (1): 'bo` | FOLDED | §12 | folded into OD-PL-46 (`body:`'s key and occasions) |
| B405 | L605 | §12 | `[CURED 2026-10-18 (fp-final r3) — PL-V4: 'patrol:' and 'corp` | FOLDED | §12 | folded into OD-PL-46 (`patrol:` and `corps:` in the list; the one ban grammar) |
| B406 | L605 | §12 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 A.14 · C.Q3` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B407 | L605 | §12 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10: 'appendRelati` | FOLDED | §12 | folded into OD-PL-46 (the internal append never a door; no `riders:` prefix; `army:`/`column:` PS's stable unit key) |
| B408 | L606 | §12 | `[CURED 2026-10-18 (fp-final r2) — PL-r1-6, RULINGS-ROUND2 B]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B409 | L607 | §12 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 C.Q4]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B410 | L607 | §12 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b PS-r2-3: t` | FOLDED | §12 | folded into OD-PL-48 (the `unitKey` PS's stable unit id) |
| B411 | L607 | §12 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6: a 'sent' answ` | FOLDED | §12 | folded into OD-PL-48 (the share on FIELD FORCE in the defender's size; the first-sight answer before the contest in every arm); the ruling tag removed |
| B412 | L607 | §12 | `[CURED 2026-10-18 (fp-final r4) — A.5 · A.2 · A.1: both side` | FOLDED | §12 | folded into OD-PL-48 (both sides FIELD FORCE; the threshold; the default and the mint at the week; one line per liege per unit; the harm rule) |
| B413 | L607 | §12 | `[CURED 2026-10-19 (fp-final r5) — B.11: "at first sight" mea` | DROPPED | — | superseded by B414: WITHDRAWN for the incursion by B414's re-ruling (the belief condition and its no-row case bind siege relief only); not restated |
| B414 | L607 | §12 | `[RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.4: the` | FOLDED | §12 | a re-ruling folded into OD-PL-48: "at first sight" is the first week the unit is witnessed, on the liege's inputs as they stand; the per-reliever window binds siege relief only |
| B415 | L608 | §12 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-ST-r4.md' §5 · RUL` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B416 | L608 | §12 | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B417 | L609 | §12 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B418 | L609 | §12 | `[CURED 2026-10-19 (fp-final r5) — STOP-PR-r4-1 · SEAMS-r4-3 ` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B419 | L610 | §12 | `[REFINED 2026-10-18 (fp-final r2)]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B420 | L610 | §12 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.6: 'riders_lent',` | FOLDED | §12 | folded into OD-PL-51 (`riders_lent`, wear, free on master and matched by no hint or wound regex, executed) |
| B421 | L610 | §12 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.8: 'rider` | FOLDED | §12 | folded into OD-PL-51: `riders_quartered` is a shape-3 kind (the precedence friction's row), never a weave incident — the latest bracket on the row settles the conflict seat 1 flagged (§4.6 homes it in the fealty record); `riders_lent` stays wear in §15.9 |
| B422 | L611 | §12 | `[CURED 2026-10-19 (fp-final r6) — the PL-r5-verify minor]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B423 | L611 | §12 | `[CURED 2026-10-18 (fp-final r4) — A.6 · A.7 · THE BODIES' ro` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B424 | L611 | §12 | `[CURED 2026-10-18 (fp-final r3) — PL-r1-15]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B425 | L612 | §12 | `[RE-RULED 2026-10-19 (fp-final r6) — r5's "from the week the` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B426 | L612 | §12 | `[CURED 2026-10-18 (fp-final r3) — PL-V5]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B427 | L612 | §12 | `[CURED 2026-10-18 (fp-final r4) — A.1 · A.6 · SEAMS-r3-5: "t` | FOLDED | §12 | folded into OD-PL-53 with its nested re-ruling and stamp: an incursion's outcome by the crossing as it resolved; the den's two outcomes; the banner's cover a third occasion; one outcome per edge per episode |
| N46 | L612 | §12 | `[RE-RULED 2026-10-18 (fp-final r4) — PL-r4-S1; CURED 2026-10` | FOLDED | §12 | nested inside B427; disposed with it (its content folded or removed with the parent) |
| B428 | L613 | §12 | `[CURED 2026-10-18 (fp-final r4) — PL-V5]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B429 | L613 | §12 | `[RE-RULED 2026-10-18 (fp-final r4) — PL-r4-S1 (RULINGS-ROUND` | FOLDED | §12 | a re-ruling folded: A.6's `kept` clause withdrawn — OD-PL-54 states the harm rule AFTER EITHER ANSWER; the closed STOP's label not restated |
| B430 | L613 | §12 | `[CURED 2026-10-19 (fp-final r5) — PL-V5 (r4-verify) · RULING` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B431 | L614 | §12 | `[CURED 2026-10-18 (fp-final r4) — PL-W1]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B432 | L614 | §12 | `[RE-RULED 2026-10-19 (fp-final r6) — B.4]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B433 | L614 | §12 | `[CURED 2026-10-19 (fp-final r5) — B.11 · MN-X1 · the r4 veri` | FOLDED | §12 | folded into OD-PL-55 ("the no-row cases are a reading by delegation, vetoable"); the incursion's belief rule it names is withdrawn by the r6 re-ruling (OD-PL-48), so only the no-row cases are restated |
| B434 | L615 | §12 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.8 · B.8 ·` | FOLDED | §12 | folded into OD-PL-56: F.1 (the direct summons), F.2's lend with `s` the member's own band toward its immediate liege ("`crownReachAt`'s `share01` per rung … never the crown's own share" — the row's own latest bracket, read with §4.7 F.2, settles the conflict seat 1 flagged), F.4 read from `weeksCovered` |
| B435 | L615 | §12 | `[CURED 2026-10-18 (fp-final r4) — A.7 · SEAMS-r3-6]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B436 | L616 | §12 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' routes]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B437 | L616 | §12 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-BD-r4.md' §5 · RUL` | FOLDED | §12 | a review-id note (lane log and ruling tag); the row states THE CROWN'S FAITH and A FOREIGN HAND |
| B438 | L617 | §12 | `[CURED 2026-10-18 (fp-final r4) — CHAIR-NOTES 17]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B439 | L617 | §12 | `[CURED 2026-10-19 (fp-final r5) — PL-X1 · RULINGS-ROUND5 A.7` | FOLDED | §12 | folded into OD-PL-58 (`oathSince` declared in OD-PL-34); the struck "evicted reads 1" not restated |
| B440 | L618 | §12 | `[CURED 2026-10-19 (fp-final r6) — the PL-r5-verify minor]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B441 | L618 | §12 | `[REFINED 2026-10-18 (fp-final r4) — the PL-r3-verify minor]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B442 | L619 | §12 | `[CURED 2026-10-20 (fp-final P5) — P5C-20]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B443 | L620 | §12 | `[CURED 2026-10-20 (fp-final P5)]` | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B444 | L628 | §13 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-30: the Evidence Law` | FOLDED | §13 | a change note (the Evidence Law's "name who": the besieger named); the sentence names Brenmoor's host |
| B445 | L629 | §13 | `[CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6: "the receipt ` | FOLDED | §13 | a change note ("sent, but too few" the receipt); the line states where it is said |
| B446 | L629 | §13 | `[CURED 2026-10-18 (fp-final r4) — A.1: "sent, but too few" i` | FOLDED | §13 | a change note ("sent, but too few" reserved for a fought and lost contest); the line says ONLY of a fought and lost contest |
| B447 | L630 | §13 | `[CURED 2026-10-18 (fp-final r4) — A.1 · PL-V5]` | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B448 | L630 | §13 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.6 · the P` | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B449 | L631 | §13 | `[CURED 2026-10-18 (fp-final r4) — A.7 · §F.4, §F.7]` | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B450 | L632 | §13 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' routes]` | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B451 | L633 | §13 | `[CURED 2026-10-19 (fp-final r5) — L-BD 23b]` | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B452 | L634 | §13 | `[CURED 2026-10-19 (fp-final r5) — L-BD 23b]` | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B453 | L635 | §13 | `[CURED 2026-10-19 (fp-final r6) — B.3 · PL-Y1's Evidence-Law` | FOLDED | §13 | folded as the sentence's condition (the crown's own riders, Ashford's need; a fellow member's riders by right write no line); the ruling and finding tags removed |
| B454 | L635 | §13 | `[CURED 2026-10-19 (fp-final r5) — A.8 · STOP-PR-r4-1]` | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B455 | L636 | §13 | `[REFINED 2026-10-18 (fp-final r1) — PL-2's first-visible sig` | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B456 | L654 | §14 | `[REFINED 2026-10-17 (fp-final) — R4-2: no culture writer is ` | FOLDED | §14 | folded (no culture writer is minted); the research id removed |
| B457 | L658 | §14 | `[REFINED 2026-10-17 (fp-final) — R4-1: scaled by the LINK, n` | FOLDED | §14 | its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed) |
| B458 | L660 | §14 | `[REFINED 2026-10-17 (fp-final) — R4-3.]` | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B459 | L660 | §14 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-12: "sampled once pe` | FOLDED | §14 | folded as the reason the liege is read every tick (the measured `neighbourEndorsement` and `LAG`); the struck yearly-sample wording not restated |
| B460 | L666 | §14 | `[REFINED 2026-10-17 (fp-final) — R4-5.]` | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B461 | L668 | §14 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.1 (CH-r1-9's th` | FOLDED | §14 | a change note (two faith carriers → three; 3a CH's); the paragraph states THREE |
| B462 | L668 | §14 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-24: 'clergyDrag' ` | FOLDED | §14 | folded (`clergyDrag` and `chronicleMomentum` are no seat for a paragon); the seam id removed |
| B463 | L670 | §14 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-12 · PL-r1-13.]` | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B464 | L682 | §15 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-21.]` | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B465 | L686 | §15 | `[REFINED — R4-4]` | FOLDED | §15 | a research-id note (R4-4); the cell states the recognition act |
| B466 | L686 | §15 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-22]` | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B467 | L687 | §15 | `[CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-PL-93; RULINGS-` | FOLDED | §15 | folded (strained read on the PUBLIC record by name — the landed rebellion stressor or a standing `fealty_break`; never the stored resentment or the fealty record; the MARCH stays war-gated); the finding and ruling ids removed |
| B468 | L688 | §15 | `[REFINED — R4-7]` | FOLDED | §15 | a research-id note (R4-7) |
| B469 | L689 | §15 | `[REFINED — R4-8]` | FOLDED | §15 | a research-id note (R4-8) |
| B470 | L689 | §15 | `[CURED 2026-10-18 (fp-final r1) — PL-r1-19: the hearing had ` | FOLDED | §15 | a change note (the hearing had no producer); the cell names `APPOINT_TO_SEAT` as the producer and the verdict channel as the road |
| B471 | L691 | §15 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-15]` | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B472 | L691 | §15 | `[CURED 2026-10-20 (fp-final P5) — P5C-17]` | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B473 | L695 | §15 | `[REFINED 2026-10-17 (fp-final) — R4-12.]` | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B474 | L695 | §15 | `[REFINED 2026-10-18 (fp-final r2) — THE PATROLS' request (PR` | FOLDED | §15 | folded with B475–B477 as one statement of 15.9's closed list: its executed measurement (`riders_quartered` free and unmatched; `appointment_imposed` a wound, stated) KEPT; its registration of `riders_quartered` in the weave list SUPERSEDED by B476 (the list token with `riders_quartered` is in ALLOW-MISSING) |
| B475 | L695 | §15 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 · RULIN` | FOLDED | §15 | folded into the 15.9 statement (`riders_lent` registered as wear; its executed measurement; war lends wear nothing); its interim list (with `riders_quartered`) superseded by B476 (ALLOW-MISSING) |
| B476 | L695 | §15 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.8 ("F.6 (` | FOLDED | §15 | folded into the 15.9 statement: `riders_quartered` is the precedence friction's shape-3 row, never wear; the final list `… · riders_lent`; the routing of PR's cites removed |
| B477 | L695 | §15 | `[CURED 2026-10-20 (fp-final P5) — P5C-17: THE SITES' crown-g` | FOLDED | §15 | folded into the 15.9 statement (the garrison resentment priced by `riders_quartered`'s row, never as wear) |
| B478 | L701 | §15 | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E, PATRO` | FOLDED | §15 | folded as 15.12's body (PL mints nothing; the crown's riders priced as the friction ROW; the root's read; the sub-vassal reach never zero; the banner's right and THE PASSAGE's ladder; tolls only; the host's three channels); its five nested markers removed — the r3 struck sub-vassal condition kept as "no `crownReachAt(…).share01 > 0` test"; the brief's charter phrase and its routing removed (the charter's toll right named `toll_exemption`); the ruling-file and brief-item tags restated as THE PATROLS' items |
| N47 | L701 | §15 | `[CURED 2026-10-19 (fp-final r5) — A.8: "worn as 'riders_quar` | FOLDED | §15 | nested inside B478; disposed with it (its content folded or removed with the parent) |
| N48 | L701 | §15 | `[CURED 2026-10-18 (fp-final r3) — two PL-r2-verify minors: "` | FOLDED | §15 | nested inside B478; disposed with it (its content folded or removed with the parent) |
| N49 | L701 | §15 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND3 §F.3 · SEAM` | FOLDED | §15 | nested inside B478; disposed with it (its content folded or removed with the parent) |
| N50 | L701 | §15 | `↳ and PR14 / OD-PR-36 name them. H16 is the map's INBOUND do` | FOLDED | §15 | nested inside B478; disposed with it (its content folded or removed with the parent) |
| N51 | L701 | §15 | `[CURED 2026-10-18 (fp-final r3) — the PL-r2-verify minor ("l` | FOLDED | §15 | nested inside B478; disposed with it (its content folded or removed with the parent) |
| N52 | L701 | §15 | `↳ splits the channels, and PL-1 (a) itself sends polity fact` | FOLDED | §15 | nested inside B478; disposed with it (its content folded or removed with the parent) |
| B479 | L701 | §15 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-17: "the CROWN'S ` | FOLDED | §15 | folded (the crown's riders never "wardens" — the homonym's four senses); the other change notes (no second summons kind; H16 inbound; the routing to PR) dropped as stated elsewhere (§4.1, OD-PL-50, the paragraph above) |
| C480 | L911 | §16 | `[RE-RULED 2026-10-18 (fp-final r4)]` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H01 | L9 | header | `in §5.5 and §5.6. **Round 1 (2026-10-18, lane D-PL-r1):** ev` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| H02 | L9 | header | `/D-PL-r1-probe/'. **Round 2 (2026-10-18, lane D-PL-r2):** th` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| H03 | L9 | header | `/D-PL-r2-probe/'. **Round 2b (2026-10-18, lane D-PL-r2b):** ` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| H04 | L9 | header | `D-PL-r2b-probe/'. **Round 3 (2026-10-18, lane D-PL-r3):** th` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| H05 | L9 | header | `/D-PL-r3-probe/'. **Round 4 (2026-10-18, lane D-PL-r4):** th` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| H06 | L9 | header | `4 §E and carried in round 5; the measurements are in 'cure/D` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| H07 | L9 | header | `/D-PL-r4-probe/'. **Round 5 (2026-10-19, lane D-PL-r5):** th` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| S01 | L9 | header | ` RECORD; the two P2 STOPs (§5's ending arm, §5.6's owed prod` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| S02 | L9 | header | ` left to the chair, STOP PL-r4-S1 (the 'unopposed' arm after` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| S03 | L9 | header | `our L-BD 23b items, STOP-PR-r4-1's PL half), its NEW MAJOR P` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| S04 | L9 | header | `s round-5 block; no STOP; the measurements are in 'cure/D-PL` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| S05 | L9 | header | `LINGS-P5.md' §C; no STOP; the measurements are in 'cure/D-PL` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| F01 | L9 | header | `s: CURED 2026-10-17 (fp-final) from SPL/SX under the chair's` | MOVED | history | inside a header/status line moved to history (the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE)) |
| S06 | L44 | §0 | ` road IS a relabel (STOP-1, RULED (A′): the suit is refused ` | FOLDED | §0 | the STOP label removed; its ruling stands in the passage |
| A01 | L124 | §2 | `-r1-3; fold §3.1.10 ↳), over BOTH landed tails: 'powerStruct` | FOLDED | §2 | the ↳ reference removed; the read is cited by its section |
| S07 | L124 | §2 | `s DM card's option (STOP-2's precedent: the DM authored that` | FOLDED | §2 | the STOP label removed; its ruling stands in the passage |
| H08 | L162 | §2 | ` \| FREE — minted in round 1 \|` | FOLDED | §2 | the round label removed; the passage stands in final form |
| H09 | L163 | §2 | ` \| FREE — minted in round 2 [CURED 2026-10-18 (fp-final r2) ` | FOLDED | §2 | the round label removed; the passage stands in final form |
| H10 | L164 | §2 | ` §15.9; RE-HOMED in round 5 as a shape-3 kind, the precedenc` | FOLDED | §2 | the round label removed; the passage stands in final form |
| H11 | L164 | §2 | `REE — registered in round 2b [REFINED 2026-10-18 (fp-final r` | FOLDED | §2 | the round label removed; the passage stands in final form |
| H12 | L165 | §2 | `ed or registered in round 3 [CURED 2026-10-18 (fp-final r3) ` | FOLDED | §2 | the round label removed; the passage stands in final form |
| H13 | L166 | §2 | `ed or registered in round 4 [CURED 2026-10-18 (fp-final r4) ` | FOLDED | §2 | the round label removed; the passage stands in final form |
| H14 | L169 | §2 | ` \| FREE — minted in round 5 (RULINGS-ROUND5 A.7) [CURED 2026` | FOLDED | §2 | the round label removed; the passage stands in final form |
| H15 | L173 | §2 | ` / (no FP use after round 1) / the docket's 'allegiance_choi` | FOLDED | §2 | the round label removed; the passage stands in final form |
| H16 | L266 | §4 | `e door — and, since round 5, the crown's faith and a foreign` | FOLDED | §4 | the round label removed; the passage stands in final form |
| H17 | L278 | §4 | `ith its patch since round 5, never also wear (one path) [CUR` | FOLDED | §4 | the round label removed; the passage stands in final form |
| S08 | L300 | §5 | `n a suspended link (STOP-1 RULED (A′), §5.5) \| 370 \| — \|` | FOLDED | §5 | the STOP label removed; its ruling stands in the passage |
| S09 | L321 | §5 | `ARS** — the chair's STOP-1 ruling (A′), RULINGS-AFTER-COMPIL` | FOLDED | §5 | the STOP label removed; its ruling stands in the passage |
| S10 | L332 | §5 | `**STOP-1 — RULED (A′) by the chair** (RULI` | FOLDED | §5 | the STOP label removed; its ruling stands in the passage |
| S11 | L334 | §5 | `ss it. Vetoable.] **STOP-2 — RULED (RULINGS-AFTER-COMPILE §P` | FOLDED | §5 | the STOP label removed; its ruling stands in the passage |
| S12 | L419 | §9 | ` "ask the vassals" (STOP-2's ruling, §5.6) — the event field` | FOLDED | §9 | the STOP label removed ("STOP-2's ruling" → §5.6, where its ruling stands as THE DM'S KILL/ASSIGN); "§5.6's P5 bracket" → §5.6 |
| H18 | L476 | §10 | `UNMEASURED; PL-10); round 4's rows are bounded by their occa` | FOLDED | §10 | the round label removed; the passage stands in final form |
| H19 | L476 | §10 | `HE BODIES' routes]; round 5's rows are bounded the same way ` | FOLDED | §10 | the round label removed; the passage stands in final form |
| A02 | L477 | §10 | `\| ↳ shape 3's 'oathSince' [CURED 2026-10-1` | FOLDED | §10 | the ↳ row label of the lifecycle table (a sub-row for shape 3's summary field) restated as the row's own label "shape 3's summary field `oathSince`"; its lifecycle cell unchanged |
| A03 | L478 | §10 | `\| ↳ shape 2's 'truce?' — FALLBACK (B)'s ma` | FOLDED | §10 | the ↳ row label of the lifecycle table (a sub-row for shape 2's fallback field) restated as the row's own label "shape 2's field `truce?`"; "the chair rules (B) in" → "(B) is ruled in" |
| S13 | L544 | §11 | `THE DIRECT SUMMONS (STOP-PR-r4-1 as re-ruled) — H ← M ← L; H` | FOLDED | §11 | the STOP label removed from P53's title ("STOP-PR-r4-1 as re-ruled"); the row states the re-ruled direct summons |
| S14 | L548 | §11 | `ield nothing opens (STOP-2's accepted gap); 'politySuccessio` | FOLDED | §11 | the STOP label removed ("STOP-2's accepted gap" → "§5.6's accepted gap") |
| H20 | L593 | §12 | `nded (the chair's); round 1 adds no shape, only the sub-fiel` | FOLDED | §12 | the round label removed; the passage stands in final form |
| H21 | L609 | §12 | `r2) — SEAMS-r2-10]; ROUND 5: every summons row sits on the A` | FOLDED | §12 | the round label removed; the passage stands in final form |
| H22 | L611 | §12 | ` ∧ 'polityEnabled' (round 4 adds THE SITES' second den closi` | FOLDED | §12 | the round label removed; the passage stands in final form |
| H23 | L614 | §12 | `final r4) — PL-W1]; ROUND 5: once minted, the row IS the lin` | FOLDED | §12 | the round label removed; the passage stands in final form |
| H24 | L616 | §12 | `HE BODIES' routes]; ROUND 5 — THE CROWN'S FAITH (§4.8 (4)): ` | FOLDED | §12 | the round label removed; the passage stands in final form |
| H25 | L709 | §16 | `1-1 and re-ruled in round 1 (band map; no sphere) \|` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H26 | L712 | §16 | `e chair; carried in round 1 (PL-r1-20, §5.5) \|` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S15 | L712 | §16 | `\| SPL-B4 \| ⛔ STOP-1 for the ending arm (§5.5); decisi` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S16 | L712 | §16 | `ders, the walker) — STOP-1 RULED (A′) by the chair; carried ` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H27 | L715 | §16 | `option), carried in round 1 (PL-r1-20) \|` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S17 | L715 | §16 | `ucer recorded owed (STOP-2) — STOP-2 RULED (accepted; the KI` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S18 | L715 | §16 | `ded owed (STOP-2) — STOP-2 RULED (accepted; the KILL/ASSIGN ` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H28 | L749 | §16 | `ED (A′), carried in round 1 (PL-r1-20) \|` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S19 | L749 | §16 | `\| SX-20 \| ⛔ STOP-1 for the termination road (§5.5); ` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S20 | L749 | §16 | `e; 'lapsed' added — STOP-1 RULED (A′), carried in round 1 (P` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H29 | L758 | §16 | `### §16 — ROUND 1 (2026-10-18, lane D-PL-r1; the f` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S21 | L781 | §16 | `— (A′) with (B) and STOP-2's KILL/ASSIGN option carried in t` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S22 | L800 | §16 | ` (OD-PL-22/23 still STOPs) \| — \| CURED — OD-PL-22 and OD-PL-` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H30 | L802 | §16 | `REFINED in round 1 (each bracketed where it sits): ` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H31 | L804 | §16 | `### §16 — ROUND 2 (2026-10-18, lane D-PL-r2; the r` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S23 | L822 | §16 | `rb's 'of'; ST's two STOPs and four questions touch no PL pas` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H32 | L825 | §16 | `REFINED in round 2 (each bracketed where it sits): ` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H33 | L827 | §16 | `### §16 — ROUND 2b (2026-10-18, lane D-PL-r2b; eve` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| A04 | L833 | §16 | `s §3.1.26 and INBOX ↳ r1 (a) are the fold half, for P4 \|` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S24 | L833 | §16 | `e, so this is not a STOP (§2, §9 PL-1, OD-PL-42); the fold's` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S25 | L838 | §16 | `r its fast half, so STOP-PR-0/1/2, PR-r2-1/-2/-5, SEAMS-r2-2` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H34 | L840 | §16 | `REFINED in round 2b (each bracketed where it sits):` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H35 | L842 | §16 | `### §16 — ROUND 3 (2026-10-18, lane D-PL-r3; the r` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H36 | L863 | §16 | `REFINED in round 3 (each bracketed where it sits, v` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H37 | L865 | §16 | `### §16 — ROUND 4 (2026-10-18, lane D-PL-r4; the r` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S26 | L869 | §16 | `ection_failed') — ⛔ STOP PL-r4-S1 proposes the harm rule aft` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H38 | L885 | §16 | ` PL-V4 half held in round 3 (the verifier's holds) \|` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H39 | L886 | §16 | ` — PL-V4 applied in round 3 and held (the verifier's holds) ` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H40 | L901 | §16 | `⛔ STOP in round 4: PL-r4-S1 — the 'unopposed' arm ` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H41 | L901 | §16 | `md' §3). REFINED in round 4 (each bracketed where it sits, v` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S27 | L901 | §16 | `⛔ STOP in round 4: PL-r4-S1 — the 'unoppos` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H42 | L903 | §16 | `### §16 — ROUND 5 (2026-10-19, lane D-PL-r5; the r` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S28 | L903 | §16 | `n minor notes — its STOP PL-r4-S1 as RULINGS-ROUND4 §E ruled` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S29 | L910 | §16 | `\| STOP-PR-r4-1, PL half (FAIL; = SEAMS-r4-` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S30 | L911 | §16 | `\| PL-r4-S1 (STOP, RULED §E; = SEAMS-r4-2) \| MAJOR \| ` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| A05 | L912 | §16 | `, §4.6, §5.6, §10's ↳ row, §2 census, P52, OD-PL-34, OD-PL-5` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| A06 | L922 | §16 | ` PS's leaf routed — ↳ r6: the incursion arm WITHDRAWN by RUL` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S31 | L930 | §16 | `'lived' rows; (3) = STOP-PR-r4-1 \|` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| A07 | L934 | §16 | `sion (§4.7 F.6 (b); ↳ r6: off PR's own-need count 'swept', R` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H43 | L934 | §16 | `REFINED in round 5 (each bracketed where it sits, v` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H44 | L934 | §16 | `(§4.3; WITHDRAWN in round 6 by RULINGS-ROUND6 B.4); the fait` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H45 | L934 | §16 | `.8 (5)). No STOP in round 5.` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| S32 | L934 | §16 | `case (§4.8 (5)). No STOP in round 5.` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| H46 | L936 | §16 | `### §16 — ROUND 6 (2026-10-19, lane D-RESIDUE-r6 —` | MOVED | history | moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| L03 | L3 | header | `## First compiled by chair session 2fc13d59 (Opus 5.5), 2026` | MOVED | history | header/status line moved to history: compile header line (the compile credit and date) |
| L04 | L4 | header | `## under chair session a73343ed (Fable 5.1), 2026-10-17. Com` | MOVED | history | header/status line moved to history: compile header line (the cure credit; the owner's word restated in the new header) |
| L05 | L5 | header | `## nine virtual flags (§8); nothing scheduled. Bound by the ` | MOVED | history | header/status line moved to history: compile header line (the nine flags and the requirements line restated in the new header) |
| L06 | L6 | header | `## ('DESIGN_FP_SPINE.md' §1; 15–24's text of record is 'DESI` | MOVED | history | header/status line moved to history: compile header line (the requirements line restated in the new header) |
| L07 | L7 | header | `## '[CURED 2026-10-17 (fp-final) — <id>: …]', '[CURED 2026-1` | MOVED | history | header/status line moved to history: compile header line with the bracket template |
| L09 | L9 | header | `**Status: CURED 2026-10-17 (fp-final) from SPL/SX under the ` | MOVED | history | header/status line moved to history: the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER'S GUIDE) |
| R01 | L705 | §16 | `## §16 THE CURE RECORD (every SPL id and every SX id that na` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| R02 | L758 | §16 | `### §16 — ROUND 1 (2026-10-18, lane D-PL-r1; the findings of` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| R03 | L804 | §16 | `### §16 — ROUND 2 (2026-10-18, lane D-PL-r2; the round-1 ver` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| R04 | L827 | §16 | `### §16 — ROUND 2b (2026-10-18, lane D-PL-r2b; every id 'ske` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| R05 | L842 | §16 | `### §16 — ROUND 3 (2026-10-18, lane D-PL-r3; the round-2 ver` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| R06 | L865 | §16 | `### §16 — ROUND 4 (2026-10-18, lane D-PL-r4; the round-3 ver` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| R07 | L903 | §16 | `### §16 — ROUND 5 (2026-10-19, lane D-PL-r5; the round-4 ver` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| R08 | L936 | §16 | `### §16 — ROUND 6 (2026-10-19, lane D-RESIDUE-r6 — ONE resid` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |
| R09 | L954 | §16 | `### §16 — P5 (2026-10-20, lane D-PL-MN-RN-p5 — THE COMPLETEN` | MOVED | history | cure-record header, moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL |

## APPENDIX — THE BUILD, VERBATIM (scratchpad `cpl2/`; `cpl/` holds the first sitting's copy)

### `brackets.py`

````python
import re,sys,json,bisect,collections
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PL-bracketed-1beabdc85.md'
s=open(OLD,encoding='utf-8').read()
lines=s.split('\n')
offs=[0]
for l in lines: offs.append(offs[-1]+len(l)+1)
def lineof(pos): return bisect.bisect_right(offs,pos)
CURE0=705
BODY_END=offs[CURE0-1]
pat=re.compile(r'\[(CURED|REFINED|ADDED|RE-POINTED|OPENED|RE-RULED|STOP|CORRECTED|AMENDED|RULED|NOTED|CONFIRMED|RENAMED)\b')
out=[];i=0
while True:
    m=pat.search(s,i)
    if not m: break
    st=m.start(); depth=0; j=st
    while j<len(s):
        c=s[j]
        if c=='[': depth+=1
        elif c==']':
            depth-=1
            if depth==0: break
        j+=1
    out.append(dict(i=len(out),start=st,end=j+1,line=lineof(st),endline=lineof(j),kind=m.group(1),text=s[st:j+1],cure=st>=BODY_END))
    i=j+1
stamp=re.compile(r'^\[(CURED|REFINED|ADDED|RE-POINTED|OPENED|RE-RULED) \d{4}-\d\d-\d\d \([^()]*\)( — [^:\]]{0,90})?\]$')
for b in out: b['stamp']=bool(stamp.match(b['text']))
json.dump(out,open('brackets.json','w'),ensure_ascii=False,indent=0)
body=[b for b in out if not b['cure']]; cure=[b for b in out if b['cure']]
print('body',len(body),'cure',len(cure),'bytes body',sum(len(b['text'].encode()) for b in body))
print(collections.Counter(b['kind'] for b in body), collections.Counter(b['kind'] for b in cure))
print('multiline',sum(1 for b in out if b['line']!=b['endline']))
print('stamps body',sum(b['stamp'] for b in body))
print('nested', sum(1 for b in out if pat.search(b['text'],1)))
r=[b for b in body if b['line']<358]; print('in my range',len(r),'stamps',sum(b['stamp'] for b in r),'bytes',sum(len(b['text'].encode()) for b in r))
# unbracketed markers
inbr=bytearray(len(s))
for b in out:
    for k in range(b['start'],b['end']): inbr[k]=1
pats=[('A','↳'),('H',r'\bROUND \d[ab]?\b|\bRound \d[ab]?\b|\bround r?\d[ab]?\b'),('S',r'STOP'),('F',r'\(fp-final[^)]*\)')]
cnt=collections.Counter(); cntr=collections.Counter(); cntc=collections.Counter()
for k,p in pats:
    for m in re.finditer(p,s):
        if inbr[m.start()]: continue
        n=lineof(m.start())
        if n>=CURE0: cntc[k]+=1
        elif n<358: cntr[k]+=1
        else: cnt[k]+=1
print('outside brackets: myrange',dict(cntr),'seat2 body',dict(cnt),'cure',dict(cntc))
````

### `readcopy.py`

````python
import json,re
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PL-bracketed-1beabdc85.md'
s=open(OLD,encoding='utf-8').read()
B=json.load(open('brackets.json'))
out=[];p=0
for b in B:
    out.append(s[p:b['start']])
    out.append('⟦%d⟧'%b['i'] if b['stamp'] else '⟦%d: %s⟧'%(b['i'],b['text'][1:-1]))
    p=b['end']
out.append(s[p:])
t=''.join(out).split('\n')
open('read.md','w').write('\n'.join('%d\t%s'%(i+1,l) for i,l in enumerate(t)))
````

### `build.py`

````python
import json,re,sys,os
CPL=os.path.dirname(os.path.abspath(__file__))
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PL-bracketed-1beabdc85.md'
S=open(OLD,encoding='utf-8').read(); L=S.split('\n')
BR=json.load(open(CPL+'/brackets.json'))
X={}; DR={}; MV={}; SUBS=[]; LINE={}; INSERT_AFTER={}; NOTE={}; MV_LINES={}; ARROW_FOLD={}; MARK_NOTE={}
for f in sorted(x for x in os.listdir(CPL) if re.match(r'd\d\d\.py$',x)): exec(open(CPL+'/'+f).read())
exec(open(CPL+"/head.py").read()) if os.path.exists(CPL+"/head.py") else None
END=int(sys.argv[1]) if len(sys.argv)>1 else 357
def content(i,mode):
    t=BR[i]['text'][1:-1]; k=t.index(' — '); r=t[k+3:]
    if mode.startswith('after:'):
        k2=r.index(mode[6:]); return r[k2+len(mode)-6:]
    if mode=='colon':
        j=r.find(': '); r=r[j+2:] if j>=0 else r
    return r
offs=[0]
for l in L: offs.append(offs[-1]+len(l)+1)
byline={}
for b in BR: byline.setdefault(b['line'],[]).append(b)
def rep(i,atstart):
    v=X.get(i,'')
    if i in DR or i in MV: v=''
    if v is None: v=''
    if isinstance(v,tuple):
        mode=v[1]; subs=v[2]; pre=v[3] if len(v)>3 else ('' if atstart else ' ')
        c=content(i,mode)
        for a,bb in subs:
            assert c.count(a)==1,(i,a,c.count(a)); c=c.replace(a,bb)
        v=pre+c
    return v
out=[]; NL={}
for n in range(1,END+1):
    l=L[n-1]
    if n in byline:
        ls=offs[n-1]; seg=[];p=0
        for b in byline[n]:
            st=b['start']-ls; en=b['end']-ls
            pre=l[p:st]; atstart=(pre.strip()=='' and p==0)
            v=rep(b['i'],atstart)
            if v=='':
                nxt=l[en:en+1]
                if pre.endswith(' ') and (nxt in ('',' ','.',',',';',':',')','|')): pre=pre[:-1]
                elif atstart and nxt==' ': en+=1
            seg.append(pre); seg.append(v); p=en
        seg.append(l[p:]); l=''.join(seg)
        l=re.sub(r'\s*\x00','',l)
    for (sn,a,bb) in SUBS:
        if sn==n:
            assert l.count(a)==1,(n,a[:80],l.count(a)); l=l.replace(a,bb)
    if n in LINE:
        if LINE[n] is None: NL[n]=None; continue
        l=LINE[n]
    l=l.rstrip(' ')
    NL[n]=l
    out.append(l)
    if n in INSERT_AFTER: out.append(INSERT_AFTER[n])
incode=False
for k,l in enumerate(out):
    if l.startswith('```'): incode=not incode; continue
    if not incode and '\n' not in l: out[k]=re.sub(r'(?<=\S)  +(?=\S)',' ',l)
txt='\n'.join(out)
txt=re.sub(r'\n{3,}','\n\n',txt)
json.dump(NL,open(CPL+'/newlines.json','w'),ensure_ascii=False)
open(CPL+'/body_new.md','w').write(txt+'\n')
print('lines',len(out),'bytes',len(txt.encode()))
````

### `lint.py`

````python
import json,re,sys
a,b=int(sys.argv[1]),int(sys.argv[2])
NL={int(k):v for k,v in json.load(open('newlines.json')).items()}
pats=[r'↳',r'\bSTOP\b',r'fp-final',r'\b[Rr]ound\b',r'\bROUND\b',r'\br\d[ab]?\b',r'\bfinding',r'\bskeptic',r'\bthe chair\b',r"\bchair's\b",r'\blane\b',r'\bverifier',r'RULINGS',r'\b[A-Z]{2,5}(-[A-Za-z]+)?-r\d[ab]?-\d+',r'\b(CH|PL|MN|RN|PT|PS|ST|PR|BD|OP|MG|WS|FS|WC|SEAMS|HOST)-(V|W|X|PD-V)\d+',r'\bP5C?-\d+',r'\b[A-H]\.\d{1,2}\b',r'\bCHAIR-NOTES',r'\brouted\b|\bROUTED\b',r'\b20\d\d-\d\d-\d\d\b',r'\bSPL-[Mm]?\d+|\bSX-\d+|\bR4-\d+|\bHOST-r|\bSEAMS-r',r'\bCURED\b|\bREFINED\b|RE-RULED|\bstruck\b|\bSTRUCK\b|\bcorrected\b|\bwithdrawn\b|\bWITHDRAWN\b',r'⟦|⟧',r'\bD-PL',r'\bcure/D-|\bskeptic/']
for n in range(a,b+1):
    l=NL.get(n)
    if not l: continue
    l=re.sub(r'`cure/D-[A-Za-z0-9-]+-probe/[^`]*`','`PROBE`',l); l=re.sub(r'`cure/D-[A-Za-z0-9-]+\.md`','`CUREMD`',l)
    hits=[]
    for p in pats:
        for m in re.finditer(p,l): hits.append(l[max(0,m.start()-40):m.end()+40].replace('\n',' '))
    if hits: print(n,' || '.join(hits))
````

### `ledger.py`

````python
import json,re,sys,os,bisect
from collections import Counter,defaultdict
CPL=os.path.dirname(os.path.abspath(__file__))
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PL-bracketed-1beabdc85.md'
S=open(OLD,encoding='utf-8').read(); L=S.split('\n')
BR=json.load(open(CPL+'/brackets.json'))
X={}; DR={}; MV={}; SUBS=[]; LINE={}; INSERT_AFTER={}; NOTE={}; MV_LINES={}; ARROW_FOLD={}; MARK_NOTE={}
for f in sorted(x for x in os.listdir(CPL) if re.match(r'd\d\d\.py$',x)): exec(open(CPL+'/'+f).read())
END=int(sys.argv[1]); NL={int(k):v for k,v in json.load(open(CPL+'/newlines.json')).items()}
CURE0=705
sec={}
cur='header'
for i,l in enumerate(L,1):
    if 11<=i<=16: sec[i]="THE OWNER'S WORDS · THE ANSWER"; continue
    m=re.match(r'^(#{2,3}) (.*)',l)
    if m and i>=19:
        t=m.group(2); mm=re.match(r'(§\d+)\b',t); cur=mm.group(1) if mm else t[:28]
        if i>=CURE0: cur='§16 THE CURE RECORD'
    sec[i]=cur if i>=19 else ('header' if i<11 else sec.get(i,'header'))
offs=[0]
for l in L: offs.append(offs[-1]+len(l)+1)
def lineof(p): return bisect.bisect_right(offs,p)
inbr=bytearray(len(S)); owner=[-1]*0
par={}
for b in BR:
    for k in range(b['start'],b['end']): inbr[k]=1
rows=[]
def add(kind,line,text,disp,new,what): rows.append((kind,line,text,disp,new,what))
def first(t): return t[:60].replace('|','\\|').replace('`',"'").replace('\n',' ')
nestpat=re.compile(r'\[(CURED|REFINED|ADDED|RE-POINTED|OPENED|RE-RULED|STOP|CORRECTED|AMENDED|RULED|NOTED|CONFIRMED|RENAMED)\b|↳')
for b in BR:
    i=b['i'];n=b['line'];t=b['text']
    rid='B%03d'%i if not b['cure'] else 'C%02d'%i
    if b['cure']: add(rid,n,first(t),'MOVED' if END>=967 else 'PENDING','history' if END>=967 else '—','moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL' if END>=967 else 'inside §16 THE CURE RECORD (seat 2: MOVE verbatim to history)')
    elif n>END: add(rid,n,first(t),'PENDING','—','section not yet consolidated (seat 2)')
    elif i in MV: add(rid,n,first(t),'MOVED','history',MV[i])
    elif i in DR: s,note=DR[i]; add(rid,n,first(t),'DROPPED','—','superseded by B%03d: %s'%(s,note))
    elif i in NOTE: add(rid,n,first(t),'FOLDED',sec[n],NOTE[i])
    elif i in X and X[i] not in ('',None): add(rid,n,first(t),'FOLDED',sec[n],'its content folded into the sentence or cell it amended (latest ruling as stated; ids and ruling tags removed)')
    elif b['stamp']: add(rid,n,first(t),'FOLDED',sec[n],'a stamp: the cured text stands at the same place; the ids stay in the text of record')
    else: add(rid,n,first(t),'FOLDED',sec[n],'a change note: the text at the same place already carries the change; the note stays in the text of record')
    # nested markers
    for m in nestpat.finditer(t,1):
        k=len([r for r in rows if r[0].startswith('N')])+1
        disp=rows[-1][3] if rows[-1][3]!='MOVED' else 'MOVED'
        add('N%02d'%k,n,first(t[m.start():m.start()+60]),'PENDING' if disp=='PENDING' else disp,rows[-1][4],'nested inside %s; disposed with it (%s)'%(rid,'its content folded or removed with the parent' if disp!='PENDING' else 'seat 2'))
pats=[('A','↳'),('H',r'\bROUND \d[ab]?\b|\bRound \d[ab]?\b|\bround r?\d[ab]?\b'),('S',r'STOP'),('F',r'\(fp-final[^)]*\)')]
cnt=Counter()
for n in range(1,len(L)+1):
    l=L[n-1]; base=offs[n-1]
    for k,pat in pats:
        for m in re.finditer(pat,l):
            if inbr[base+m.start()]: continue
            cnt[k]+=1; rid='%s%02d'%(k,cnt[k]); ctx=first(l[max(0,m.start()-20):m.start()+40])
            if n>=CURE0: add(rid,n,ctx,'MOVED' if END>=967 else 'PENDING','history' if END>=967 else '—','moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL' if END>=967 else 'inside §16 THE CURE RECORD (seat 2: MOVE verbatim to history)'); continue
            if n in MV_LINES: add(rid,n,ctx,'MOVED','history','inside a header/status line moved to history (%s)'%MV_LINES[n]); continue
            if n>END: add(rid,n,ctx,'PENDING','—','section not yet consolidated (seat 2)'); continue
            nl=NL.get(n)
            if nl is not None and re.search(pat,nl) and not (k=='S' and 'STOP PL-C-' in nl and len(re.findall(pat,nl))==1):
                add(rid,n,ctx,'KEPT',sec[n],'KEPT — CHECK'); continue
            if k=='A' and n in ARROW_FOLD: add(rid,n,ctx,'FOLDED',sec[n],ARROW_FOLD[n]); continue
            if (k,n) in MARK_NOTE: add(rid,n,ctx,'FOLDED',sec[n],MARK_NOTE[(k,n)]); continue
            add(rid,n,ctx,'FOLDED',sec[n],{'A':'the ↳ reference removed; the read is cited by its section','H':'the round label removed; the passage stands in final form','S':'the STOP label removed; its ruling stands in the passage','F':'the stamp removed'}[k])
for n,why in sorted(MV_LINES.items()):
    add('L%02d'%n,n,first(L[n-1]),'MOVED','history','header/status line moved to history: '+why)
k=0
for n in range(CURE0,len(L)+1):
    if L[n-1].startswith('## §16') or L[n-1].startswith('### '):
        k+=1; add('R%02d'%k,n,first(L[n-1]),'MOVED' if END>=967 else 'PENDING','history' if END>=967 else '—','cure-record header, '+('moved verbatim with old §16 THE CURE RECORD to `history/PL-cure-record.md` Part 2 (old lines 705–967); the new §16 is THE REVIEW TRAIL' if END>=967 else '(seat 2: MOVE verbatim to history)'))
c=Counter(r[3] for r in rows)
print('rows',len(rows),dict(c))
for r in rows:
    if 'CHECK' in r[5]: print('CHECK',r)
json.dump(rows,open(CPL+'/ledger_rows.json','w'),ensure_ascii=False)
# per-section summary
summ=defaultdict(Counter)
for r in rows:
    if r[3]=='PENDING': continue
    summ[r[4] if r[4] not in ('history','—') else sec[r[1]]][r[3]]+=1
for s,cc in summ.items(): print(s,dict(cc))
````

### `render.py`

````python
import json,os,re
from collections import Counter
rows=json.load(open('ledger_rows.json'))
c=Counter(r[3] for r in rows); kinds=Counter(re.match(r'[A-Z]',r[0]).group(0) for r in rows)
sections=["header","THE OWNER'S WORDS · THE ANSWER","§0","§1","§2","§3","§4","§5","§6","§7","§8","§9","§10","§11","§12","§13","§14","§15","§16"]
def secof(r):
    if r[3]=='MOVED': return 'header' if r[1]<705 else '§16'
    if r[3]=='DROPPED': return '§3' if 179<=r[1]<=239 else ('§12' if 556<=r[1]<=623 else '?')
    return r[4]
def tally(s):
    return Counter(r[3] for r in rows if secof(r)==s and r[3]!='PENDING')
out=[]
SEAT2_CORRECTIONS=[
 "Ruling tags, finding ids and ruling-file cites removed from §7..§15's own sentences: \"(STOP-2's ruling, §5.6)\" and \"(§5.6's P5 bracket)\" → \"(§5.6)\" (§9); \"(§15.2; P5C-15)\", \"(PL-r1-7)\" removed (§9); \"(RULINGS-ROUND6 B.4; B.11 binds the siege)\" → \"(a siege's waits for its reliever's belief, §4.3)\" and \"(B.11)\" / \"(RULINGS-ROUND6 B.4)\" removed (§10); in §11 \"(A.2)\" → \"(THE MINT WAITS FOR THE WEEK)\", \"— A.1\", \"(STOP-PR-r4-1 as re-ruled)\", \"(B.11)\", \"(P5C-3)\", \"(P5C-20)\", \"(P5C-17)\", \"(P5C-24)\", \"(P5C-15)\" removed, \"(RULINGS-ROUND6 B.4 — B.11 binds siege relief only)\" → \"(the per-reliever window binds siege relief only)\", \"(STOP-2's accepted gap)\" → \"(§5.6's accepted gap)\"; in §15 \"(R4-10, …)\", \"(R4-11, …, PL-r1-27; …)\" trimmed to the OD rows. KEPT: research cites in the R4 H-form (R4 H1, H4, H7, Q3), the census and ODQ cites, the pins, the OD rows, PS/PR/ST/BD/MN/CH law and section cites, and every executed probe receipt under `cure/D-PL-*-probe/`.",
 "Round labels removed: §10's horizon (\"round 4's rows\" → \"the banner's and the bodies' rows\"; \"round 5's rows\" → \"the friction's and the faith rows\"; \"no longer depends\" → \"does not depend\"; \"P5's garrison arm\" → \"the garrison arm\"); §11's P52 (\"(the r4 rule read 0.053)\" and \"(the r4 rule read 0.009)\" — the superseded rule's readings — removed); §12 (\"round 1 adds no shape\", \"ROUND 5:\" ×2, \"ROUND 5 —\", \"round 4 adds\" restated as the design's own statement).",
 "\"the chair\", \"the lane\" and \"the skeptic\" removed: §10's `truce?` row (\"AND the chair rules (B) in\" → \"AND (B) is ruled in\"); §12 OD-PL-9 (\"the chair routes it to GRAMMAR's catalog\" → \"GRAMMAR's catalog holds it\"), OD-PL-12 (\"the chair's reading\" → \"a reading by delegation\"; \"the alternative the skeptic offered\" → \"the alternative\"), OD-PL-22/23 (\"RULED … by the chair (RULINGS-AFTER-COMPILE)\" → \"(A′), the ruled path\" / the ruling's own words), OD-PL-33 (\"the chair's 10-18 ruling\" removed), OD-PL-34 (\"(the chair's)\"), OD-PL-42 (\"the fold §3.1 rows are the chair's\" → \"the fold §3.1 holds the rows\"), and every \"… are the lane's, vetoable\" → \"… are readings by delegation, vetoable\" (OD-PL-52, -53, -55, -56, -57, -59); §15.6 (\"the chair's 10-18 ruling moved the slot\" → \"the slot moved\"); §15.12 (the brief's charter phrase \"is routed to the chair\" removed).",
 "§12 \"… executed\" ruling cites removed (\"RULINGS-ROUND3 A.5/A.6 executed\", \"RULINGS-ROUND4 A.1/A.2 executed\", \"RULINGS-ROUND3 §F executed for PL\", \"THE BODIES' three routes executed\", \"L-BD 23b's four items executed\", \"CHAIR-NOTES 17 (b)'s PL half\", \"under RULINGS-P5 C.20\", \"(RULINGS-P5 C.1 · …)\", \"C.17's … read against A.8's re-homing\" → \"a fealty-record row, never a weave incident\"); \"(the owner's ~19:2x word)\" → \"(the owner's word)\"; \"for the ODQ §934.93 P5 addendum's visible rows\" → \"among the visible rows of ODQ §934.93's addendum\"; \"(§4's sites bracket, §15.12)\" → \"(§4.6's SITES CONSIDERED paragraph, §15.12)\".",
 "Stale base text corrected by the row's own later brackets: OD-PL-35's \"one `changeAuthorityPolicy.js` row (`auto`); minor in `decisionTier.js`\" (B387 names it stale) → \"two … rows (`auto`) — the sealed `polity_verdict` a minor …, the engine's `polity_verdict_default` a major …\" (B388); OD-PL-41's \"`polityEnabled` split into it …; `polityBreakEnabled` added\" restated as \"nine (§8), `polityHoldEnabled` and `polityBreakEnabled` among them\"; OD-PL-4 \"κ struck\" → \"no κ\"; OD-PL-9 \"renamed from `narrowed_sphere`\" → \"never `narrowed_sphere`\"; OD-PL-29's \"has resentment ≥ DRAFT 0.5\" (STRUCK by B379) not restated.",
 "Superseded names kept as \"never\" statements, not dropped: `relief_answer` (§7: \"`relief_answer` is no PL kind\"), `polity_*` / `crown_*` (§7), `oathHolderEnabled` (§8), `readiness01`, `full · … · empty`, `STRENGTH_BANDS` (OD-PL-33), `crownReachAt(…).share01 > 0` (§15.12: \"no … test\"), `warden` (§15.12: \"never wardens\").",
 "Struck or withdrawn language restated as the design's own statement: §14.3's \"'sampled once per year … slow by construction' is struck\" → the reason the liege is read every tick (B459); §15.2's \"'strained' was the member↔liege RESENTMENT … The intervener now decides\" → \"'Strained' is never the member↔liege RESENTMENT …: the intervener decides on ITS OWN belief …\" (B467); §9 PL-1's map-supersession history (B261) → \"By the owner's word … PL carries no supersession of the map's chain rule anywhere\"; §9 PL-4's \"Hosts unchanged (…)\" → \"`warCapacityReads.js` (143) makes its one read …\"; PL-8's \"PL had never named the door. PL-8 builds it\" → \"PL-8 builds the door\".",
 "Re-rulings folded at their latest text (each re-ruling's marker removed, the withdrawn clause not restated): B285, B332, B340, B352 (the incursion's first-sight answer on the liege's inputs as they stand — the r6 withdrawal of the r5 belief condition for the incursion); B337 and B429 (the harm rule after EITHER answer — A.6's `kept` clause withdrawn); B268's nested RE-RULED; B427's nested RE-RULED and CURED. B413 (the r5 belief condition for the incursion, in OD-PL-48) DROPPED as superseded by B414.",
 "Dates removed from the running text of §7..§15 outside the owner's words and the rulings table: B261 (\"the owner's word of 2026-10-18 05:57\" → \"the owner's word\"), B399 (\"the owner's word of 05:57\" → \"the owner's word\"). THE OWNER'S QUESTION and THE OWNER'S WORDS headers of §14 and §15 keep their dates (the owner's words). The rulings table carries dates in its heading and its Ruled column only.",
 "Design marks carried by stamps KEPT: B348 (P52, \"DRAFT, UNMEASURED\") → \"; the age term is DRAFT, UNMEASURED\". Every PLAUSIBLE mark in §7..§15 stands (§9 PL-4's docket read, PL-8's two tail reads, §10's two round-trips, OD-PL-54).",
 "Review routing dropped (each a lane-to-lane instruction, never a design fact): B242's \"routed in `cure/D-PL-r2.md` §5\" (its design sentence kept: CH's crown ban needs `polityHoldEnabled`); B253's \"the chair amends fold 21(a)\"; B260's \"The fold §3.1 rows are the chair's\"; B261's \"The fold's two passages … are HOST-r2-4's fold half, for P4\"; B273's \"the SEAMS-r1-2 idiom\"; B476's \"THE PATROLS' cites of it as wear … are routed\"; B478's \"(… is routed to the chair, `cure/D-PL-r2.md` §5)\"; B479's \"(routed to PR)\" notes; pin provenance B303–B307 (which review id each pin answers).",
 "`↳` removed outside brackets in §10 (two table sub-row labels restated) and inside B478 (\"the fold's map-side INBOX (h) ↳\" → \"INBOX (h)\"). THE PATROLS' brief items are cited as \"THE PATROLS, item n\" (B478), as seat 1 cited THE BODIES' items.",
 "OD-PL-56 and OD-PL-51 — the two conflicts seat 1 flagged — are settled by the rows' own latest brackets (B434, B421), not decided anew; see §1's STOPs paragraph."]
out.append("# PL — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8, lane C-PL; seats 1 and 2 of 2, 2026-10-23) — COMPLETE: header..§16 (old lines 1–967); the volume replaced")
out.append("")
out.append("Old text: `history/PL-bracketed-1beabdc85.md` (414,769 bytes, 967 lines), byte-identical to `docs/DESIGN_FP_ARCH_PL.md` at the start of this seat (`cmp`, in `/home/user/fp-p8/docs`). New text so far: `consolidate/PL-new.md` (the new header + THE READER'S GUIDE + old lines 11–357 consolidated: THE OWNER'S WORDS, THE ANSWER, §0, §1, §2, §3, §4, §5, §6), built by one script over the old text (bracket spans found by balanced matching; every fold, substitution and line rewrite asserted to match exactly once), so every passage not named below is byte-faithful to `1beabdc85` minus its brackets. Seat 1 sat twice: its first sitting built the header..§3 (old lines 1–239) and was cut off by a container restart before §4; the resumed sitting checked that sitting's work (its scripts rebuild `PL-new.md` byte for byte; §3 ends at old line 239, complete; its 634 rows match the old text), kept it whole, and built §4, §5 and §6 (old lines 240–357) with the same scripts (scratchpad `cpl2/`, a copy of `cpl/` plus `d05.py`–`d07.py` and one whitespace marker in `build.py`; the header..§3 rebuild byte-identical). No fidelity error was found in the first sitting's sections. Seat 1's range is complete; seat 2 starts at `## §7 THE HEARINGS` (old line 358) and runs to the end. SEAT 2 (a cloud seat, after a usage-window pause and resume) built §7..§16 (old lines 358–967) with the same scripts (`cpl2/` plus `d08.py`–`d18.py`, `cure_record.py`, a `MARK_NOTE` hook in `build.py` and `ledger.py`, and the cure-record rows MOVED in `ledger.py`), wrote `history/PL-cure-record.md` (Part 1 = old lines 3–9, Part 2 = old §16, both verbatim, asserted), applied the chair's ruling on ⛔ STOP PL-C-1 in both seats' sections (`d17.py` and `head.py`), and confirmed by rebuild that seat 1's sections differ from seat 1's `PL-new.md` ONLY by that ruling (THE READER'S GUIDE item 8, PL8, §3.4's `armyTransitKernel.js` cell, §4.5). The finished text is `consolidate/PL-new.md`, copied once over `docs/DESIGN_FP_ARCH_PL.md`.")
out.append("")
out.append("## 1. THE COUNT (by script, before writing)")
out.append("The ratchet's MARKERS pattern (`tools/consolidate-ratchet.py`) finds **521** hits in the old text — the minimum. The ledger counts more finely and has **%d rows**, one per marker: **480** body brackets by balanced scan (`[CURED …]` 423 · `[REFINED …]` 46 · `[RE-RULED …]` 11) + **1** bracket inside §16 THE CURE RECORD + **%d** markers NESTED inside a body bracket (44 nested brackets + 8 `↳` inside brackets; each disposed with its parent) + **%d** `↳` outside brackets + **%d** round words outside brackets + **%d** `STOP` outside brackets + **%d** `(fp-final …)` stamp outside brackets + **%d** header/status lines + **%d** cure-record headers. Every MARKERS hit maps to one of these rows (a hit inside a bracket to that bracket's row or its nested row)."%(len(rows),kinds['N'],kinds['A'],kinds['H'],kinds['S'],kinds['F'],kinds['L'],kinds['R']))
out.append("")
out.append("**Dispositions: old markers %d · folded %d · dropped %d · moved %d · kept %d · PENDING %d**."%(len(rows),c['FOLDED'],c['DROPPED'],c['MOVED'],c['KEPT'],c['PENDING']))
out.append("")
out.append("| new section | folded | dropped (superseded) | moved | kept | STOPs |")
out.append("|---|---|---|---|---|---|")
for s in sections:
    t=tally(s); st={'header':'PL-C-1 (ruled; READER\'S GUIDE 8)','§1':'PL-C-1 (ruled; PL8)','§3':'PL-C-1 (raised; ruled)','§4':'PL-C-1 (ruled; §4.5)','§8':'PL-C-1 (ruled; flags row)','§9':'PL-C-1 (ruled; PL-5)'}.get(s,'0')
    out.append("| %s | %d | %d | %d | %d | %s |"%(s,t['FOLDED'],t['DROPPED'],t['MOVED'],t['KEPT'],st))
out.append("")
out.append("STOPs of this pass: **⛔ STOP PL-C-1** (one, raised by seat 1) — RULED by the chair on 2026-10-23 (by delegation, vetoable) and APPLIED by seat 2. The word \"passage\": B099 (the `armyTransitKernel.js` row of §3.4) said \"in PL, \\\"passage\\\" names only the charter's toll right (PL8, §4.5)\", while the later P5 class `passage_of_arms` (B068, B093, B100; the fold §5 register's P5 row) uses the word in THE PASSAGE's meaning (PS14). THE RULING: the latest wins and the fold §5 is the vocabulary law — in PL the bare word \"passage\" carries THE PASSAGE's meaning; the charter's toll right is always named by its registered term `toll_exemption` (the fold §3.1.1), never by the bare word. APPLIED: B099 folded into that sentence (§3.4's cell); every `⛔ STOP PL-C-1` mark removed (§3.4's cell, THE READER'S GUIDE item 8 — now \"in PL the bare word carries THE PASSAGE's meaning … the charter's toll right is always named by its registered term `toll_exemption`\"); the charter's toll right renamed wherever PL named it with the bare word: PL8's down-obligations (\"PASSAGE\" → \"the TOLL EXEMPTION (`toll_exemption`)\"), §4.5 (title \"Passage\" → \"The toll exemption and passage\"; \"Passage is a CHARTER TERM\" → \"The toll exemption (`toll_exemption`) is a CHARTER TERM\"; \"the CHARTER's passage is tolls only\" → \"the CHARTER's `toll_exemption` is tolls only\"), §8's `polityObligationsEnabled` row and PL-5 (\"passage\" → \"the toll exemption (`toll_exemption`)\"), and §15.12 (\"PL §4.5's charter carries tolls only (its `toll_exemption`)\"); every other bare \"passage\" (PL7, §2's register, §3.2's class row, §4.5's passage of ARMS and B138's `rival` \"for passage\", §4.6, §5.3, P40, P56) already carries THE PASSAGE's meaning and stands. Rows B099 and B138: \"FOLDED per the chair's ruling of PL-C-1 (2026-10-23)\". No OD row added: the ruling lives here and in the program's record. Seat 2 raised NO new STOP: the two conflicts seat 1 flagged for §12 are settled by their rows' OWN latest brackets — OD-PL-56's B434 (r5) gives F.2's lend `max(1, floor(n × s × hold01))` with \"a sub-vassal lending through its liege's line\", which §4.7 F.2 (B154, the same round) states as each member's own band toward its IMMEDIATE liege, \"never computed at the crown's own share\"; read per rung (the row's own \"`crownReachAt` per rung\"), `crownReachAt(liege, m).share01` IS that band share, so the row now reads \"`crownReachAt`'s `share01` per rung — a member's own band share toward its immediate liege, never the crown's own share — F.2's lend …, the crown's own `hold01` entering once\"; OD-PL-51's B421 (r5) RE-HOMES `riders_quartered` from §15.9's weave list to shape 3 (the precedence friction's row, one resentment patch) and keeps `riders_lent` as wear, so the row states that (as §4.6, F.6 (b), §15.9 and OD-PL-34 do). OD-PL-22/23's \"RULED … by the chair\" is restated in the house form (the Ruled column). Superseded brackets: B085 (seat 1; by B084) and B413 (seat 2; WITHDRAWN for the incursion by B414's re-ruling). The vetoable READINGS carried inline (each already vetoable in the old text): §0 the patron exclusion (B017); PL4's share map (⚑ OWNER-VISIBLE, OD-PL-12); §4's readings (seat 1's list in §3); §8's two family placements (B250); PL-8's every-settlement read (B275's nested REFINED); §12's readings by delegation (OD-PL-52, -53, -55, -56, -57, -59).")
out.append("")
out.append("## 2. THE SECTION MAP (old → new)")
out.append("Old lines 1–9 (title, compile header lines 3–7 with the bracket template, the STATUS block line 9) → the new 4-line header (title verbatim) + THE READER'S GUIDE (new, 8 items) + the dispatch-gate paragraph (restated from the STATUS block's last sentences); old lines 3–9 → `history/PL-cure-record.md` Part 1, verbatim (written by seat 2 with Part 2). Old line 11 (B009, the owner's doctrines of 2026-10-18) → its own paragraph after THE OWNER'S WORDS. Old §0–§15 keep their numbers and titles (every \"§x\" of the text resolves unchanged; references to other volumes cite their sections by title or code). Inside §4–§6: B150 (the SITES CONSIDERED bracket between §4.6 and §4.7) → §4.6's closing paragraph **SITES CONSIDERED** (so §3.5's \"§4's sites paragraph, item 2\", F.6 (iii)'s \"§4.6's SITES CONSIDERED paragraph, (3)\" and the request door's \"the SITES CONSIDERED paragraph below\" resolve); B161 → **The banner's readings** paragraph after F.7; B166 + B167 → **The routes from THE BODIES** paragraph after §4.8 (3); B175 → §5's naming line; old line 332 (the STOP-1 line) removed — its ruling stands as §5.5 THE MEMBER WARS (the ruled path (A′), FALLBACK (B)); §5.6's \"STOP-2 — RULED\" heading → **THE DM'S KILL/ASSIGN**. SEAT 2: old §7–§15 keep their numbers and titles (§4.5's bold title in seat 1's range becomes \"The toll exemption and passage\" under the PL-C-1 ruling); old §16 THE CURE RECORD (lines 705–967) → `history/PL-cure-record.md` Part 2, verbatim; the new §16 is THE REVIEW TRAIL (one line). Inside §7–§15: B218 → §7's opening WHERE sentence (with B217's \"relief is never a kind\" and B216's final names); B252 → §8's closing paragraph (the presets claim waits on the host-side check); B253 + B254 → §9's opening sentences; B257 → THE HOOKS PER HOST's opening; B282 + B283 → §10's opening statement; the two `↳` sub-rows of §10's table → rows with their own labels (`oathSince`, `truce?`); B301 → §10's closing paragraph; B308's closing sentence → §11's opening sentence; §12's table gains a fourth column **Ruled** (the row's date, its amendment dates read from its own brackets, \"by delegation · vetoable\", and the OWNER's part), ⭐ on OD-PL-5, OD-PL-12 and OD-PL-60 (the rows the old text marked THE OWNER'S ROW and ⚑ OWNER-VISIBLE) and the heading's \"⭐ marks the owner's own rows, each VISIBLE\"; after the table, THE OPEN STOPS line (none; PL-C-1 ruled and applied); B474–B477 → §15.9's one statement of the closed weave list; B478 → §15.12's body; B479 → §15.12's closing \"never wardens\" sentence. Inside header..§3: §1 the laws' brackets folded into the law paragraphs (PL4's rationale moved after its (a)/(b) sentence; PL12's circle sentence rewritten from its nested REFINED); §2 the token census's \"minted in round n\" provenance removed; §3.5 the `P` bullet rewritten from B109's three nested markers; `A`'s executed receipt (B111) kept with its `cure/` path.")
out.append("")
out.append("## 3. TEXT CORRECTIONS THAT ARE NOT MARKERS (each the latest ruling applied, or wording only)")
for t in ["\"the chair\" removed from the running text: THE OWNER'S WORDS (\"building the chair's idea\" → \"building on the idea\"); PL4 (\"the chair's reading\" → \"a reading by delegation\"); §0 (B017); PL10 (\"(the chair's)\" → \"the fold's §3.1.10 says so\"); §2's map register (\"is the chair's\" → \"holds them\"); §3.2/§3.3 (\"EC's volume takes the bracket — the chair's\" → \"the rung is written into EC's volume\").",
 "Finding ids, ruling tags and ruling-file citations removed from the running text (SPL-·, SX-·, R4-·, PL-r·, PL-V·, PL-X1, HOST-r·, SEAMS-r·, P5C-·, WC-PL-·, RULINGS-* §·, CHAIR-NOTES ·, A.n/B.n/C.n tags); kept: the owner's verbatim quotations, ODQ cites, research cites (R4 C5/C8, R4 H7), census cites (V §1.14, D §0), the pin ids (P3, P5, P28, P34, P37, P39, P53), the OD rows, and the executed probe receipts under `cure/` (evidence, not review labels).",
 "STOP labels outside brackets: §0's `PEACE_STEP` row (\"STOP-1, RULED (A′)\" → the ruling's own words); §2's `seatChangedSince` (\"STOP-2's precedent\" → \"§5.6's precedent\"); the doctrines paragraph (\"(STOP-2, §5.6)\" → \"(§5.6)\").",
 "Struck-language restated as the design's own statement: PL4 \"the old 'capped below an occupier's weight' clause stays dropped\" → \"no clause caps the share below an occupier's weight\"; PL11 `remnant` → \"never `remnant`\"; the hold's band words (`cohesion`, `sound` \"never\"); the autonomy charter (\"never `narrowed_sphere`\"); §3.5 `A` (the STRUCK old clause removed); `liegeStanceToward`, `swornLinkSuspended`, the deference prose (change notes removed).",
 "Dates removed from the running text outside the header, the owner's words and the dispatch-gate paragraph: §0 \"this program's delegation (10-16, 10-17)\" → \"the owner's delegation to this program\"; B099 \"the owner's word of 10-18\" → \"the owner's word\".",
 "B016 + B018 (the W-SEAT amendment): B016's \"`foreignSeatOf` and its four production readers are untouched\" read with B018 (later): `foreignSeatOf` reads the additive export with its choice unchanged → \"`foreignSeatOf`'s choice and its four production readers are untouched\".",
 "B044's nested REFINED (P5) narrows PL12's \"a subjugation that would close a circle is NAMED in its proposal\" to the `SWEAR_FEALTY` card PL stages; an engine subjugation is named by the stage's receipt after the fact — written into the circle sentence.",
 "B094 (\"no ninth class\", round 4) read with B068 (P5, \"said of the bodies, not of passage\") → \"the bodies add no class of their own\" in §3.2 and §2.",
 "B109 (§3.5 `P`): the r3 rule (outcome rows only), its nested r4 extension (every protection occasion, both directions), the nested r5 change note (a repelled answer) and the nested r6 stamp stated once; \"A.1's harm rule\" → \"the one harm rule\"; \"§4's sites bracket, item 2\" → \"§4's sites paragraph, item 2\" (it resolves: B150 is folded as §4.6's closing SITES CONSIDERED paragraph, whose (2) is the den occasion).",
 "B120's nested REFINED in §4.1 kept inline as \"(… — a reading by delegation, vetoable)\"; its opening restates the ruling's design sentence; \"The verifier's three gaps … are closed here and at F.6\" removed.",
 "§4.3 (B124–B136): B136's 13 nested markers resolved to the latest text — (1) the share on FIELD FORCE (the quoted PS §7.5 line, which carried a ruling tag, restated in reported form as PS's rule; two quotation re-cut notes removed; `cure/D-PL-r4-probe/measure.out` kept as the measurement); (2) the first-sight call: the r6 RE-RULED (RULINGS-ROUND6 B.4) WITHDRAWS the r5 extension of the per-candidate window to the incursion — its quoted withdrawn text is DROPPED and PS's first-sight default stands; THE MINT WAITS FOR THE WEEK; the line frozen at the mint; a decreed `kept` (the mirror and first-member tie rule kept as a reading, vetoable); (3) the outcome: the r4 RE-RULED harm rule after EITHER answer (A.6's `kept` clause WITHDRAWN, not restated), the r5 town-raid read and the P5 DARK harm read stated once (`concludedWarRecord` kept as \"no `concludedWarRecord` read\"); (4) the dark gates. B135's review sentence (the round-1 record, the fold's register routing) removed. B125's per-candidate window stated as the design with its measurement.",
 "Ruling and finding tags removed from §4–§6's own sentences: \"(A.5, below)\" → \"((1), below)\"; \"(A.2)\" → \"(THE MINT WAITS FOR THE WEEK)\"; \"§3.5's `P` bracket\" → \"§3.5's `P`\"; \"(PL-V5's principle)\", \"(PL-V2)\", \", RULINGS-ROUND5 B.2\", \" — RULINGS-ROUND6 B.5\", \"(RULINGS-ROUND3 §F; …\" removed; \"L-BD 23b\" → \"THE BODIES' item 23b\"; \"CHAIR-NOTES 18 (d)\" removed; B161's \"§F.4's\" and \"§F.7's\" (ruling-file sections) removed. KEPT: THE BANNER's own labels F.1–F.7, PR3/PR4/ST10/PS14 law ids, the pins (P14, P15, P39, P40, P41, P46, P47, P48, P53), the OD rows.",
 "\"the chair\" removed from §4–§6: B138 (\"its coupling row with PL is the chair's at P4\" → \"the fold holds its coupling row with PL\"); THE MEMBER WARS (\"the chair's STOP-1 ruling (A′), RULINGS-AFTER-COMPILE\" → \"the ruled path (A′)\"); FALLBACK (B) (\"named by the chair\" → \"the named fallback\"); B128 (\"(the fold/spine lane)\" → \"(in the fold and the spine)\").",
 "STOP labels outside brackets in §5: the §5.3 table's \"(STOP-1 RULED (A′), §5.5)\" → \"(§5.5)\"; THE MEMBER WARS; old line 332 removed; §5.6's \"**STOP-2 — RULED (RULINGS-AFTER-COMPILE §PL): …**\" → \"**THE DM'S KILL/ASSIGN — the gap is ACCEPTED AND RECORDED.**\". \"(A′)\" and \"(B)\" are kept as the names of the ruled path and its fallback (the `truce` clause says \"NEVER written under (A′), the ruled path\").",
 "Struck or withdrawn language restated as the design's own statement: §4.5 '\"Members' armies are not hostile on one another's roads\" is STRUCK' → \"No rule makes members' armies friendly on one another's roads\"; B122 \"is withdrawn from PL's side\" → \"is no PL kind\"; B161 (v) \"struck `warden` from PL\" → \"`warden` is no PL word\"; B147 the person-only ban form → \"never the person-only `polity_ban:<wnpcId>:<banTick>`\"; B175 \"renamed from 'crown war'\" → \"never 'crown war'\"; B198 \"the old guard dropped the polity as a `polity_circle`\" → \"never as a `polity_circle`\"; B132's replaced round-1 mapping and B143's \"'evicted reads 1' is STRUCK\" not restated; \"since round 5\" removed twice (§4.8's opening, §4.9 item 4).",
 "Evidence KEPT in §4–§6 (executed receipts and compile measurements behind a measured or CONFIRMED sentence): `cure/D-PL-r4.md` §1(a), §1(b) and open item 1 (so seat 1's allow line for it is withdrawn), `cure/D-PL-r3-probe/measure.out`, `cure/D-PL-r4-probe/measure.out`, `cure/D-PL-r5-probe/measure-r5.out`, `regex_r5.out`, `ageterm_r5.out`, `cure/D-PL-r2-probe/cycle.rerun.out`, `cure/D-PL-MN-RN-p5-probe/tokens-pl.out`, `cure/L-PL.md`, `cure/L-BD.md`, `vassalReaders.txt`, `channelReaders.txt`. DROPPED as review routing: `cure/D-BD-r4.md`, `cure/D-PR-r5.md`, `cure/D-PS-r3.md`, `cure/D-PS-r4.md`, `cure/D-PS-r5.md`, `cure/D-ST-r4.md`, `cure/D-ST-r5.md` (ALLOW-MISSING).",
 "Vetoable readings carried inline in §4–§6 as \"a reading by delegation, vetoable\" (each was REFINED or vetoable in the old text): B120 (the asked-and-refused lord), B125 (the no-row case), B136 (the mirror and tie rule), B143 (`oathSince` reads the standing oath), B156 (the late answer), B159/B160 (one kind for every arm of the friction), B161 (i)–(v), B167 (the order, never the stance, is priced), B169 (i)–(iii), B170, B171, B195 (two rows for one cause), B206 (the freshness clause).",
 "B159 and B160 (both on the one home of `riders_quartered`, P5 and r5) folded as ONE statement at B159's place; B141 + B142 (the two new kinds) folded as one clause after the kind list; B166 + B167 as one paragraph.",
 "Seat 1's first-sitting handoff checks, done: B109's \"§4's sites paragraph, item 2\" resolves to the SITES CONSIDERED paragraph's (2) (the den occasion); §3.5's \"(§4.9's one path)\" resolves to §4.9's \"One path per quantity\"."]:
    out.append("- "+t)
out.append("")
out.append("SEAT 2 (§7..§16):")
for t in SEAT2_CORRECTIONS:
    out.append("- "+t)
out.append("")
out.append("## 4. ALLOW-MISSING (`consolidate/PL-allow.txt` carries the same list, one token per line)")
out.append("- HEADER TEMPLATE (9): the compile header line's `[CURED … — <id>: …]` / `[RE-RULED …]` / `[REFINED …]` template tokens, moved with the header block.")
out.append("- REVIEW-TRAIL PATHS (33): the ruling files `briefs/RULINGS-ROUND1.md` … `RULINGS-ROUND5.md`, `briefs/RULINGS-P5.md`; the lane logs `cure/D-PL-r1.md` … `cure/D-PL-r5.md`, `cure/D-PL-r2b.md`, `cure/D-PL-MN-RN-p5.md`, `cure/D-ST-r4.md` and the probe folders `cure/D-PL-*-probe/` as folder names; `assessments/P5-COMPLETENESS-2026-10-20.md`; the skeptic and verifier reports `skeptic/…` with two verifier probes; the STATUS block's full path of `cure/L-PL.md` (the header now cites it in full). They stay in `history/PL-cure-record.md` and git.")
out.append("- REVIEW-TRAIL PATHS added for §4–§6 (6): `cure/D-BD-r4.md`, `cure/D-PR-r5.md`, `cure/D-PS-r3.md`, `cure/D-PS-r4.md`, `cure/D-PS-r5.md`, `cure/D-ST-r5.md` — the routes and lane logs named only inside brackets as the source of a change; withdrawn: `cure/D-PL-r4.md` (it stands in §4.3 and §4.8 as evidence).")
out.append("- SUPERSEDED NAME (1): `floor(n × share01 × hold01)` — the old banner lend formula, superseded by B154 (RULINGS-ROUND5 B.8): `lend(m) = max(1, floor(n(m) × s(m) × hold01))`, the sub-vassal's share its own band, the hold entering once.")
out.append("- BACKTICK-PARITY ARTEFACTS (2): not names. The ratchet's token pattern stops at 200 characters, and §4.6's `kind ∈ …` list is 210, so the pattern pairs the NEXT backticks in that line and reads the prose between two code spans as a token; both artefacts are the old B141/B142 prose (folded). The new text shows one artefact of the same kind as a NEW token. The whole-volume ratchet needs both lines.")
out.append("- PARTIAL-RATCHET ONLY (2), RESOLVED by seat 2: `faithCarriersOut` stands in §14.5 and `share01` in §12 OD-PL-56 (and §15.12), so both lines are deleted from `PL-allow.txt`. (Seat 1's note follows.) Partial: `faithCarriersOut` (backticked again at old line 664, §15) and `share01` (old line 615, §12 OD-PL-56) — absent from the new header..§6 but carried by seat 2's range; seat 2 deletes the line if its section keeps the token. The first sitting's `closeness01`, `falls`, `unopposed` lines are withdrawn: §4 and §5 keep them.")
out.append("- SEAT 2 — REVIEW-TRAIL PATHS (3): `briefs/L-PR.md` (B478's source brief), `cure/D-FOLD-r3.md` and `cure/D-ST-r3.md` (B382's nested receipt, a routing record) — named only inside brackets as the source of a change; they stay in `history/PL-cure-record.md` and git.")
out.append("- SEAT 2 — SUPERSEDED NAMES (2): the interim closed weave lists `recognition_withheld · appointment_imposed · faction_backed · charter_granted · riders_quartered` (B474) and `… · riders_quartered · riders_lent` (B475), superseded by B476's re-homing of `riders_quartered` to the fealty record; §15.9 states the final list `recognition_withheld · appointment_imposed · faction_backed · charter_granted · riders_lent`.")
out.append("- SEAT 2 — MOVED WITH THE CURE RECORD (53): every token backticked ONLY inside old §16 THE CURE RECORD (old lines 705–967) — lane logs and probe outputs (`cure/D-*-r3.md` … `cure/D-RESIDUE-r6.md`, `walk.out`, `cycle.rerun.out`, `measure-r5.out`, `ageterm_r5.out` …), skeptic reports, `briefs/RULINGS-ROUND6.md`, `assessments/WIRING-CENSUS-2026-10-20.md`, and names quoted only in the record's dispositions (`paragonGateEnabled`, `paragonLean`, `banKeys`, `mintDeed`, `drainQueuedEvents`, `polity_ban:corps:…` …); each stands verbatim in `history/PL-cure-record.md` Part 2. The list is in `PL-allow.txt` under its own heading.")
out.append("- No other superseded NAME was dropped in header..§6 (the superseded names `remnant`, `cohesion`, `sound`, `narrowed_sphere`, `crown_*`, the person-only `polity_ban:<wnpcId>:<banTick>` and \"crown war\" are kept as \"never\" statements).")
out.append("")
out.append("## 5. THE RATCHET (the whole volume: the text of record against the new text)")
out.append("`python3 tools/consolidate-ratchet.py history/PL-bracketed-1beabdc85.md consolidate/PL-new.md --allow-missing-file consolidate/PL-allow.txt` (the last run; exit 1 only for the explained count differences below):")
out.append("```")
out+= [l.rstrip('\n') for l in open('ratchet.out',encoding='utf-8')]
out.append("```")
out.append("- **tokens missing 0** (with `PL-allow.txt`) · **cites 64 = 64** · **laws 17 = 17** · **review markers left 0** · ⭐ 0 → 4 (OD-PL-5, -12, -60 marked, and the §12 heading's legend).")
out.append("- **OD rulings 70 → 67**: the ratchet counts every distinct `OD-XX-n` id. All 61 PL rows (OD-PL-1 … OD-PL-61) stand, each once in §12 (no ruling superseded another row, so none was folded away); the three ids lost are OTHER volumes' rows named ONLY inside the moved cure record — `OD-PR-27` (old line 831), `OD-PS-42` (old line 869), `OD-PT-28` (old line 838).")
out.append("- **DRAFT 31 → 26**: three are inside the moved cure record (old lines 705–967); one is B085 (seat 1, the superseded change note \"every DRAFT cell is marked UNMEASURED\"); one is B379's STRUCK threshold \"has resentment ≥ DRAFT 0.5\" (OD-PL-29), which the latest text does not restate. Every live DRAFT constant and cell stands; B348's \"DRAFT, UNMEASURED\" on P52 is kept.")
out.append("- **UNMEASURED 28 → 25**: two inside the moved cure record; one in B085 (seat 1). Every live UNMEASURED mark stands.")
out.append("- **wave ids 15 → 13**: the pattern `XX-n —` also matches the two STOP labels \"STOP-1 —\" and \"STOP-2 —\" (old lines 332, 334), not waves; both labels were removed by seat 1 (their rulings stand as §5.5 and §5.6). All thirteen waves PL-0 … PL-12 stand in §9.")
out.append("- **flags 36 → 35**: `paragonGateEnabled` (CH's flag) is named only inside the moved cure record (old line 792). PL's nine flags and every host flag stand.")
out.append("- **NEW tokens** (7): `1beabdc85`, the kit's history paths and `history/PL-cure-record.md` (the header and THE REVIEW TRAIL), `cure/` and `skeptic/` (THE REVIEW TRAIL's \"the kit's `skeptic/` and `cure/`\", CH's form), and one backtick-parity artefact (§4 above) — no mint.")
out.append("- Other counts, by script: hearing-kind rows 10 = 10 (nine PL kinds and `call_in_answer`); flag rows 9 + the shared channel = the same; persisted shapes FOUR = FOUR (§10); scenario rows P1 … P61 with P2b and P5b, 63 = 63; OD rows 61 = 61.")
out.append("")
out.append("## 6. THE STATE (both seats complete)")
out.append("- Every marker row is resolved: PENDING 0. The section map is complete (§2), every PL \"§x\" in the new text resolves to a section or sub-section that exists (checked by script, `xref.py`; the hits it lists are other volumes' sections — PR §10.x, PS §7.5, BD §7.1/§10.x, ST §2.4–§2.5, census V §1.14 — and the owner's §735.2/§741.1), and every reference to another volume names that volume.")
out.append("- `history/PL-cure-record.md` holds Part 1 (old lines 3–9) and Part 2 (old lines 705–967), both verbatim (asserted by `cure_record.py`).")
out.append("- The ratchet's last run is §5; every remaining count difference is explained there. Then `consolidate/PL-new.md` was copied once over `docs/DESIGN_FP_ARCH_PL.md` (in `/home/user/fp-p8/docs`).")
out.append("- Seat 1's handoff checks, done: OD-PL-56 and OD-PL-51 (§1); OD-PL-22/23's \"by the chair\" (the Ruled column); `faithCarriersOut` / `share01` deleted from `PL-allow.txt`.")
out.append("")
out.append("## 7. THE ROWS (one per marker; `B` = body bracket by index in old-text order · `C` = cure-record bracket · `N` = marker nested inside a bracket · `A` = `↳` outside brackets · `H` = round word outside brackets · `S` = `STOP` outside brackets · `F` = `(fp-final …)` outside brackets · `L` = header/status line · `R` = cure-record header)")
out.append("")
out.append("| id | old line | old section | first characters | disposition | new § | what happened |")
out.append("|---|---|---|---|---|---|---|")
import re as _r
L=open('../kit/history/PL-bracketed-1beabdc85.md',encoding='utf-8').read().split('\n')
sec={};cur='header'
for i,l in enumerate(L,1):
    m=_r.match(r'^(#{2,3}) (.*)',l)
    if m and i>=19: t=m.group(2); mm=_r.match(r'(§\d+)\b',t); cur=mm.group(1) if mm else t[:28]
    if i>=705: cur='§16'
    sec[i]=("THE OWNER'S WORDS" if 11<=i<=16 else cur) if i>=11 else 'header'
for (rid,line,first,disp,new,what) in rows:
    out.append("| %s | L%d | %s | `%s` | %s | %s | %s |"%(rid,line,sec[line],first,disp,new,what.replace('|','\\|')))
out.append("")
out.append("## APPENDIX — THE BUILD, VERBATIM (scratchpad `cpl2/`; `cpl/` holds the first sitting's copy)")
for f in ['brackets.py','readcopy.py','build.py','lint.py','ledger.py','render.py','head.py','d00.py','d01.py','d02.py','d03.py','d04.py','d05.py','d06.py','d07.py','d08.py','d09.py','d10.py','d11.py','d12.py','d13.py','d14.py','d15.py','d16.py','d17.py','d18.py','cure_record.py','missing_where.py','xref.py','patch_render2.py']:
    out.append(""); out.append("### `%s`"%f); out.append(""); out.append("````python"); out.append(open(f,encoding='utf-8').read().rstrip('\n')); out.append("````")
open('../kit/consolidate/PL-ledger.md','w',encoding='utf-8').write('\n'.join(out)+'\n')
print('rows',len(rows),dict(c),dict(kinds))
for s in sections: print(s,dict(tally(s)))
````

### `head.py`

````python
HEADER = '''# DESIGN_FP_ARCH_PL — THE POLITY: the kingdom above the settlement, built from the vassal chain

## Compiled on the owner's word of 2026-10-17 in the FP final architecture program (kit `settlement-engine-kits/fp-final-a73343ed-2026-10-17/`), the draft of that day cured in place; DARK behind nine virtual flags (§8); nothing scheduled.
## CONSOLIDATED 2026-10-23 from the bracketed text of record at `1beabdc85` — the review trail is in git and in `settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/PL-cure-record.md`; the compile's measurements (taken at master `81f1cd963`) are `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-PL.md`.
## Bound by the FP constitution's requirements 1–24 (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the coherence fold. The OWNER's rows are marked; every ruling is vetoable (§12).

---

## THE READER'S GUIDE

1. WHAT THIS IS. A polity — a kingdom in prose — is the closure of SWORN vassal links upward to a PARAMOUNT, the capital, derived per read and never stored (PL1). This volume says how a sworn town's decisions hear its liege (§3), which obligations bind the seam both ways (§4), how a crown passes and how a polity war is fought inside one kingdom (§5), the crown's peace (§6), and how faith, rites and government drift down the chain while the crown's instruments keep its vassals in line (§14, §15).
2. ITS ONE OWNER. PL owns the walk `polityOf` / `politiesOf` and the reads `polityHoldOf`, `crownReachAt`, `liegeStanceToward`, `swornLinkSuspended`, `seatChangedSince`, `seatEpisodeKeyOf` and `huntOrderOf` (§2); the one relief decider `reliefAnswerOf` (§4.3); the fealty record `relationshipState.fealtyRecord`; the contest record `spatialLedgers.polityContests`; the christening ledger `spatialLedgers.polityNames` (written only by the DM); the polity verdict channel `polityVerdict.js`; the nine `PRECEDENCE_CLASSES`.
3. WHAT IT READS. BELIEF for every observer's picture of a polity's state — strength, sieges, the hold (PL16, `readBeliefStrength`); TRUTH only for the CONTRACT (the sworn edges and their seat weights) read by the polity's own lord and members, for a liege's DECLARED label and open war and a court's `publicLegitimacy` (public by name, the `readBeliefRelationship` precedent), and in the omniscient preset. A fealty record is known to the two courts on its edge only.
4. WHAT IT WRITES, one writer each: fealty rows and their patches only through `relationshipEvolution.js :: applyRelationshipPatch`, the one relationship writer; labels only through the frozen applier, from the verdict channel minted before the fold in `coup.js :: coupVerdictOutcomes`; contests, receipts and recalls from THE POLITY STAGE; the polity's name only by the DM's `NAME_POLITY`.
5. WHERE IT MOUNTS. THE POLITY STAGE is a leaf called from `dispositionChannels.js :: advanceTreatiesWithDisposition`; the verdict channel is one call from `coup.js :: coupVerdictOutcomes`; each host above 740 lines takes ONE polity hook (§9's HOOKS table — `relationshipRulesCore.js`, `convergence.js`, `occupation.js`, `settlementStrategy.js` through WAR CIRCULATION's chooser's signal car, `generosityKernel.js` by a leaf-first car); zero lines in `pulseKernel.js`, `applyWorldPulse.js` and `warTermination.js` (PL14).
6. FLAGS: `polityEnabled` · `polityHoldEnabled` · `polityPrecedenceEnabled` · `polityBreakEnabled` · `polityObligationsEnabled` · `politySuccessionEnabled` · `polityContestEnabled` · `polityConversionEnabled` · `polityControlEnabled` (§8); PL-3 also waits on the owner-lit `foreignSeatEnabled`. HEARING KINDS: `fealty_question` · `polity_fallen` · `polity_claim` · `allegiance_choice` · `polity_war` (STANDING) · `polity_arbitration` · `fealty_break` · `polity_recognition` · `polity_appointment` (§7); the summons rides WC's `call_in_answer`, and relief is an input line on the `siege`, `menace_siege` and `armed_incursion` cards, never a kind. CHAIN: C9 THE CROWN in the fold's §6 — PL-10 THE MEASURE as car 0, then PL-0 to PL-12 (§9).
7. DEPENDS ON: W-SEAT (`foreignSeatOf`, the seat books), the relationship plane's vassal rules, the war layer and WC (summons, relief, recalls), GRAMMAR (charters, the treaty question), MN (the menace arm of relief), PS (THE PASSAGE's answer, the incursion), ST (the den occasion, the field force), PR (THE BANNER's riders), BD (`body_stance`), EC-6, W-COIN, the traditions and faith-spread modules, and the physical world through `mappedDistanceWeight`. READ BY: CH (`crownReachAt`, the crown's ban, `seatChangedSince`), PT (crown backing, `seatChangedSince`), RN (the `seat_change` door), GR's successors, PS (`passage_of_arms`, harbouring), PR (the banner stack), BD (`huntOrderOf`), MN (`reliefAnswerOf`), the host's political window (H13) and the map's borders lens.
8. THE WORDS NOT TO CONFUSE: "the crown" — the paramount's court in its polity role and the docket verdict word `crown` — never the landed `'crown'` generator data or `crown_jewel`; "sphere" (hegemony's treaty-only arm, never membership) versus "the hold" (`polityHold`, the crown's hold) versus the map's "sway" and "hold band"; "passage" — in PL the bare word carries THE PASSAGE's meaning, a foreign military unit's crossing read by the class `passage_of_arms`; the charter's toll right is always named by its registered term `toll_exemption` (§3.4, §4.5).

**The dispatch gate is the owner's.** Nothing here builds before the UI + prose release is pushed and deployed. The rulings in §12 are taken by delegation under the owner's words of 2026-10-16 ("i give my permission now and for whatever is emergent") and 2026-10-17 ("I defer all judgement and decisions to you"), each vetoable by one clause; the rows the owner reserved for himself are named as his.

---'''
LINE[1]=HEADER
````

### `d00.py`

````python
# header: old lines 2-11 replaced by the new header (head.py sets LINE[1]); bracket 9 folded into THE OWNER'S WORDS as its own paragraph
for n in range(2,12): LINE[n]=None
MV_LINES={3:'compile header line (the compile credit and date)',4:'compile header line (the cure credit; the owner\'s word restated in the new header)',5:'compile header line (the nine flags and the requirements line restated in the new header)',6:'compile header line (the requirements line restated in the new header)',7:'compile header line with the bracket template',9:'the STATUS block (the compile, rounds 1 to 5 and P5; its dispatch-gate and delegation sentences restated after THE READER\'S GUIDE)'}
for i in range(0,9): MV[i]='the bracket template inside the compile header line, moved with the header block to history'
X[9]=None
NOTE[9]="the owner's doctrines of 2026-10-18 read against this volume, folded as its own paragraph after THE OWNER'S WORDS (the ruling-file tag and \"No passage needed changing for them\" removed)"
INSERT_AFTER[13]='\n**The owner\'s doctrines of 2026-10-18 (verbatim on the kit\'s BOARD), read against this volume.** THE WORLD HOSTS THE CAMPAIGN, NEVER COMPETES: the crown, its contests and its verdicts are setting and consequence, and no PL kind involves the party (§7). MACRO OVER MICRO: PL\'s justice is the feud between towns and the landed verdicts, never a trial. NO ENGINE MORTALITY CLOCK: a crown passes only through the landed ruling-power transfers and the ladder\'s seat changes; a ruler\'s death is the DM\'s, and his KILL card offers "ask the vassals" (§5.6); P17 stays DARK by design. MEDIEVAL FOR MILLENNIA: no era changes how a crown holds its vassals. MENACES NEVER EMERGENT and PURPOSE ONLY BY THE DM: PL births no menace and gives no court a destiny; a claim is a court\'s own decision read from the field (§5.2).'
SUBS+=[(13,'and, building the chair\'s idea of "the realm layer above settlements":','and, building on the idea of "the realm layer above settlements":')]
````

### `d01.py`

````python
# §0 (old lines 19-73)
SUBS+=[(19,"the cure's own measurements `cure/L-PL.md`","the compile's measurements `cure/L-PL.md`"),
 (29,"(SPL-M8, executed over a substitute stream)","(executed over a substitute stream)"),
 (44,"(STOP-1, RULED (A′): the suit is refused on a suspended link, §5.5)","(the suit is refused on a suspended link, §5.5)"),
 (67,"this program's delegation (10-16, 10-17) is the authority for `polityContests` (SX-26).","the owner's delegation to this program is the authority for `polityContests`."),
]
X[11]=(None,'colon',[('the steps and their','The steps and their')])
X[12]=(None,'colon',[('the identity sub-term','The identity sub-term')])
X[13]=(None,'colon',[],': ')
X[14]=(None,'colon',[('not "the one" writer — ','It is not the only applicator of its name — ')])
X[15]=(None,'colon',[('attribution corrected; PL-1','PL-1')])
X[16]=(None,'colon',[("`foreignSeatOf` and its four production readers are untouched","`foreignSeatOf`'s choice and its four production readers are untouched")])
X[17]=(None,'colon',[('the patron exclusion','The patron exclusion'),("the chair's vetoable READING","a vetoable READING by delegation")])
X[18]=(None,'colon',[("`polityOf` could weigh a second overlord only by re-deriving its grip (W-SEAT: ONE RESOLVER PER QUANTITY). Cured by ONE additive export","`polityOf` weighs a second overlord without re-deriving its grip (W-SEAT: ONE RESOLVER PER QUANTITY) through ONE additive export")])
NOTE[19]='a change note (three banner facts corrected in place); the three facts stand in the §0 rows `faithCarriersOut`, `applyImposition` and `closenessBetween`'
````

### `d02.py`

````python
# §1 THE LAWS (old lines 74-111)
X[20]=(None,'colon',[("so the old predicate swallowed the sphere; the walk filters on basis and P34 pins it.","so the walk filters on basis, and P34 pins it.")])
X[21]=(None,'colon',[])
X[22]=(None,'colon',[('each step reads','Each step reads')])
X[23]=(None,'colon',[])
X[24]=(None,'colon',[('the walk is memoized','The walk is memoized')])
X[25]=(None,'after:"the walk\'s cycle guard covers BOTH bases"): ',[('the guard sees a cycle','The guard sees a cycle'),('and §5.1\'s "ONE polity for the contest\'s whole life" now holds','and §5.1\'s "ONE polity for the contest\'s whole life" holds')])
X[26]=(None,'colon',[('the engine never re-keys','The engine never re-keys')])
NOTE[27]='a change note (the struck κ); the law states that PL mints no loyalty quantity'
X[28]=''
NOTE[28]="its rationale folded as a sentence of PL4 after \"the obligation cascades (§4)\" (the hold never keys the share; the cite `warCoalitionLedger.js :: warCoalitionActive` kept); the replaced SPHERE and clip are named only there"
SUBS+=[(82,"and (b) the obligation cascades (§4).","and (b) the obligation cascades (§4). Keying the share to the hold would leave a frayed liege heard in no live decision (`warCoalitionLedger.js :: warCoalitionActive` needs `coalitionLedgerEnabled`, and the declaration reads no book), and a clip at `0.45` would flatten the owner's scaling above `strong`."),
 (82,"and the old \"capped below an occupier's weight\" clause stays dropped.","and no clause caps the share below an occupier's weight."),
 (82,"the share map is the chair's reading of","the share map is a reading by delegation of")]
X[29]=' There is NO FIFTH BOOK.'
NOTE[30]='a change note (the band-mapped reach, the named head and observer, the one read for CH and PT); PL5 states all three'
X[31]=(None,'colon',[('the liege is heard in every class; the hold no longer counts classes.','The liege is heard in every class; the hold never counts classes.')])
X[32]=(None,'colon',[('the act is PRICED AT ONCE','The act is PRICED AT ONCE')])
X[33]=(None,'colon',[('the definitional default reads','The definitional default reads')])
X[34]=(None,'after:RULINGS-ROUND2 A.14 · C.Q3: ',[('these two acts','These two acts')],' The landed vassal rule\'s `vassal_rebellion_quashed` ROLL is never the remedy for a separate peace; the default `quashed` on the `fealty_break` card is a HEARING verdict read from this war\'s fealty rows — two different things, and both stand. ')
X[35]=(None,'after:say the siege did not fall"): ',[('under the two facts','Under the two facts')])
X[36]=(None,'colon',[('keeping and failing are written','Keeping and failing are written')])
NOTE[37]='a change note (the base text restated to what the measured bracket says); PL8 states it'
X[38]=(None,'after:(RULINGS-ROUND3 A.6): ',[('the record keeps TWO facts','The record keeps TWO facts'),("(§3.5's `P` bracket)","(§3.5's `P`)")])
X[39]=(None,'colon',[('a polity of two is a PAIR','A polity of two is a PAIR')])
X[40]=(None,'colon',[('the fealty question is PL','The fealty question is PL'),(", fold §3.1.10 amended to say so (the chair's).",", and the fold's §3.1.10 says so.")])
X[41]=' The middle answer is `stand_by`, never `remnant`, which names the landed faction `legitimateRemnantOf`.'
X[42]=(None,'colon',[],' — ')
X[43]=(None,'colon',[("(§0's W-SEAT bracket)","(§0's W-SEAT paragraph)")],'; ')
SUBS+=[(98,'walk names ; the weights','walk names; the weights'),
 (98,"a subjugation that would close a circle is NAMED in its proposal (a suggestive guard — the DM decides).","the one subjugation PL stages for the DM, the `SWEAR_FEALTY` card, reads `polityOf` (pure) and says before his approval that the oath would close a circle (a suggestive guard — the DM decides); an ENGINE subjugation (the matured rung, a transfer) is auto-applied with no proposal and is named by the stage's receipt after the fact.")]
X[44]=(None,'after:"the `polity_circle` receipt\'s writer = the polity stage (PL names the step)"): ',[('the walk is pure and only DETECTS.','The walk is pure and only DETECTS.'),(' [REFINED 2026-10-20 (fp-final P5) — the PROPOSAL naming is narrowed to the one subjugation PL stages for the DM, the `SWEAR_FEALTY` card, whose line reads `polityOf` (pure) and says before his approval that the oath would close a circle; an ENGINE subjugation (the matured rung, a transfer) is auto-applied with no proposal and is named by the stage\'s receipt after the fact; vetoable.]','')])
NOTE[44]="its content folded after the circle sentence (the receipt's one writer, the polity stage); its nested REFINED (the proposal naming narrowed to the `SWEAR_FEALTY` card; an engine subjugation named by the receipt) folded into the circle sentence it amends"
X[45]=(None,'colon',[('"a circle" is an ALL-EDGE cycle','A circle is an ALL-EDGE cycle')])
X[46]=' — the measured home: it runs after this tick\'s treaties, holds snapshot, worldState, graph and tick, and returns worldState and news the kernel already reads'
X[47]=(None,'colon',[])
X[48]=(None,'after:(BOARD 00:41): ',[('the concrete carrier is','The concrete carrier is'),(' (HOST-r1 §1: AGREES)','')])
X[49]=(None,'colon',[('every observer reads','Every observer reads')])
X[50]=(None,'colon',[('the belief map holds','The belief map holds')])
X[51]=(None,'colon',[('the owner\'s "these conversions','The owner\'s "these conversions')])
````

### `d03.py`

````python
# §2 THE ONTOLOGY (old lines 112-178)
X[52]=(None,'colon',[('`root · sworn · held` are struck as values (`root` generic in 205 files, `sworn` = `treaty.sworn`, `held` three landed meanings);','`root · sworn · held` are never values (`root` is generic in 205 files, `sworn` = `treaty.sworn`, `held` has three landed meanings);')])
X[53]=(None,'colon',[('this tuple is what','This tuple is what')])
X[54]=(None,'after:which it is not. ',[])
NOTE[55]='a change note (the struck belief read); the line states the PUBLIC-truth read by name (PL16)'
NOTE[56]='a change note (the old disjunction); the line states the opposite-sides rule'
X[57]=(None,'after:(`observerId` went unused by the formula): ',[('the hold is read as the OBSERVER','The hold is read as the OBSERVER'),('; the signature CH and PT cite is unchanged.','; the signature is the one CH and PT cite.')])
X[58]=(None,'colon',[])
SUBS+=[(122,"(PL-r1-7; §0's W-SEAT bracket)","(§0's W-SEAT paragraph)"),
 (124,"(RULINGS-ROUND1 ADDENDUM SEAMS-r1-3; fold §3.1.10 ↳)","(fold §3.1.10)"),
 (124,"(STOP-2's precedent: the DM authored that change)","(§5.6's precedent: the DM authored that change)"),
 (125,"THE BANNER STACK (RULINGS-ROUND3 §F.1) is NO NEW READ","THE BANNER STACK is NO NEW READ"),
 (134,'(the institutional catalog already says "an independent polity", SPL-m6)','(the institutional catalog already says "an independent polity")'),
 (148,"(the draft's `crown_*` renamed: `crown` collides","(never `crown_*`: `crown` collides"),
 (162,"FREE — minted in round 1","FREE — minted"),
 (163,"FREE — minted in round 2","FREE — minted"),
 (164,"RE-HOMED in round 5 as a shape-3 kind","also a shape-3 kind"),
 (164,"§4.6 ; `cure/D-PL-r5-probe","§4.6; `cure/D-PL-r5-probe"),
 (164,"FREE — registered in round 2b","FREE — registered"),
 (165,"FREE — minted or registered in round 3","FREE — minted or registered"),
 (166,"FREE — minted or registered in round 4","FREE — minted or registered"),
 (168,"never PL's to mint (A.2, A.4)","never PL's to mint"),
 (169,"0 ledger `docs` before this round","0 ledger `docs` before its mint"),
 (169,"FREE — minted in round 5 (RULINGS-ROUND5 A.7)","FREE — minted"),
 (173,"(no FP use after round 1)","(no FP use)"),
 (173,"the fold §5 MAP REGISTER block is the chair's","the fold §5 MAP REGISTER block holds them"),
 (174,"FREE — minted or registered in P5; THE REGISTER PASS copies this row into fold §5 (RULINGS-P5 C.12)","FREE — minted or registered; the fold §5 carries this row"),
]
NOTE[59]="a change note (§4.6's key named and exported); the read's line states it"
X[60]=(None,'after:/ `fnv1a32`"): ',[('PL minted no `hashInt`, no `a␟b` and no `cut01`;','PL mints no `hashInt`, no `a␟b` and no `cut01` (the landed draws are `hash01` and `fnv1a32`);')])
NOTE[61]='a change note (the shared read absent before); its consumers are named in the line'
X[62]=' The derived stack is named over the two reads so THE PATROLS and THE PASSAGE cite one chain.'
X[63]=' The name is free on master (0 · 0, `cure/D-PL-r4-probe/measure.out`); THE BODIES ask for it (`cure/L-BD.md` §4).'
X[64]=(None,'colon',[('`cohesion` is landed three times','The word is never `cohesion`, which is landed three times')])
X[65]=(None,'dash',[("the chair's fourth word `sound` is LANDED","The fourth word is never `sound`, which is LANDED"),(" and takes its place.",".")])
NOTE[66]='a change note (an overstated prose line); the line carries the measured prose'
X[67]=(None,'colon',[('"sway" is the map','"Sway" is the map')])
X[68]=' THE PASSAGE\'s PS14 reads B\'s one foreign book with the class `passage_of_arms`, the fold §5 registers it as "PL\'s precedence class", §3.2\'s table carries its book seam and the paramount\'s reach, and §3.4 names THE PASSAGE\'s answer as the class\'s one call site. Free on master (0 `src` · 0 `tests`, `cure/D-PL-MN-RN-p5-probe/tokens-pl.out`). The king\'s peace stays inside `justice_at_home`; the bodies add no class of their own (§3.2).'
X[69]=' The owner\'s PASSAGE word (BOARD 00:47: foreign military units moving through a kingdom\'s or a settlement\'s territory) is THE PASSAGE volume\'s (`DESIGN_FP_ARCH_PS.md`); PL\'s part — the passage class, the liege\'s protection of a trespassed member, and the price on a member that harbours its crown\'s enemy\'s column — lands as PS\'s coupling rows.'
NOTE[69]="folded (the owner's PASSAGE word and PL's part of it); its \"the class at P4\" is superseded by B068, which adds the class"
X[71]='; `cure/D-PL-r5-probe/regex_r5.out`: none of the three regexes'
````

### `d04.py`

````python
# §3 PRECEDENCE (old lines 179-239)
NOTE[84]='a change note (the SPHERE and the clip replaced); the rule beneath every row states the band map and the reach'
DR[85]=(84,'the κ column → SPHERE column note, itself replaced by the band map (B084); the UNMEASURED marks it asked for stand on every DRAFT cell')
NOTE[86]='a change note (every site names its head and observer; the SPHERE keying superseded); 3.1 states each site'
NOTE[91]="a change note (§15.12's cite corrected to (e)); 3.1 (e) and §15.12 carry it"
NOTE[92]='a change note (the table restructured); the table stands in its final columns'
X[94]=(None,'after:THE BODIES\' route (3): ',[('one class, widened, no ninth class','one class, widened, and the bodies add no class of their own')],' — ')
NOTE[94]="folded into the `justice_at_home` cell; its \"no ninth class\" restated per B068 (the bodies add no class; the ninth class is `passage_of_arms`)"
NOTE[95]='a change note (the landed counterparty-blind term, stated in §0); 3.3 states the directional term'
NOTE[96]='a change note (the `0.45` ceiling replaced by the band map); 3.3 states the share'
X[98]=(None,'dash',[('with the sphere struck (PL-r1-1) the class no longer decides WHETHER','The class never decides WHETHER')])
X[99]=(None,'colon',[('"passage" is THE PASSAGE','"Passage" is THE PASSAGE'),("(`DESIGN_FP_ARCH_PS.md`, the owner's word of 10-18)","(`DESIGN_FP_ARCH_PS.md`, the owner's word)"),("; the fold §5 register row is the chair's","; the fold §5 registers the homonym ⛔ STOP PL-C-1")],' — ')
NOTE[99]='folded; its "in PL, "passage" names only the charter\'s toll right" stands against the later `passage_of_arms` class (B068 · B093 · B100), whose row uses "passage" in THE PASSAGE\'s meaning — ⛔ STOP PL-C-1, the passage left marked'
X[100]=(None,'colon',[("PS14's class has its call site; with","with")],' — ')
X[101]=(None,'after:is the idiom CHAIR-NOTES 18 (d) replaced. ',[('the fold §3.3.16 ↳ (11) and OD-FC-59 ↳ name it','the fold §3.3.16 (11) and OD-FC-59 name it')])
NOTE[103]='a change note (the second new consumer); the line names both new consumers'
X[104]=(None,'colon',[('the mean seat weight already carries','The mean seat weight already carries')])
X[105]=' No believed-legitimacy read exists, and recognition writes the MEMBER\'s legitimacy (§15.1), never the head\'s.'
X[106]=(None,'colon',[('the read is named; the map','The map')])
X[107]=' (the landed keys are `one_week · one_month · one_season · one_year`, `intervalWeeks.js :: INTERVAL_WEEKS`)'
X[108]=' No observer reads a third court\'s record.'
X[109]=(None,'after:trust by answer"): ',[
 ("`P` counts the OUTCOME rows only — `protection_kept` (the member stood) and `protection_failed` (it did not), §4.3 — never the liege's answer. [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.6 · SEAMS-r3-5 (MAJOR: the den occasion wrote `protection_failed` only, so `P` could only fall by it): `P` counts the OUTCOME rows of EVERY protection occasion in BOTH directions","`P` counts the OUTCOME rows only, never the liege's answer — `protection_kept` (the member stood) and `protection_failed` (it did not) — of EVERY protection occasion in BOTH directions"),
 ("by A.1's harm rule where never fought","by the one harm rule where never fought"),
 (" [CURED 2026-10-19 (fp-final r6) — PL-r5-verify F1 · SEAMS-r5-25]",""),
 ("(§4's sites bracket, item 2) [CURED 2026-10-19 (fp-final r5) — `cure/D-ST-r4.md` §5's route (the r4 verifier's ROUTED-UNAPPLIED FAIL) · RULINGS-ROUND5 A.8: \"the clock run out unanswered\" let a REPELLED answer write no row, so `P` turned on the answer, against §4.9's \"an answer never moves `P`\"]","(§4's sites paragraph, item 2)"),
 ("(§4.6).] The answer reaches","(§4.6). The answer reaches")])
NOTE[109]='folded with its three nested markers (r4: every occasion in both directions; r5: the den\'s closing on a repelled answer — a change note; r6: a stamp) — the latest text stated once'
NOTE[110]='a change note (two clauses of `A` made exact: OBLIGATION\'s `protection_kept`, §10\'s import fallback); the bullet states both'
X[111]=(None,'after:Re-run on the r5 rule (',[('(unchanged), ','')],' — executed (')
SUBS+=[(224,'; the old clause "an edge whose renewing rows the cap has evicted reads `1`" is STRUCK',''),
 (224,"C8's century soak measures it (CHAIR-NOTES 17 (d)).","C8's century soak measures it."),
 (193,"(DRAFT; EC's volume takes the bracket — the chair's)","(DRAFT; the rung is written into EC's volume)"),
 (199,"(DRAFT; EC's volume takes the bracket — the chair's)","(DRAFT; the rung is written into EC's volume)"),
 (213,"(SX-08: one context read","(one context read")]
X[112]=(None,'after:apexes change)"). ',[('It is no second decay law','The term answers the owner\'s word "kingdoms fall and are made" — no eternal capital. It is no second decay law'),(' (no mortality clock, CHAIR-NOTES 8)',' (no mortality clock)'),("(A.6's one path)","(§4.9's one path)"),(' Vetoable.','')])
NOTE[114]='a change note (the fear source moved to PL-2\'s flag); 3.6 states `polityHoldEnabled`'
X[116]=(None,'after:carried"): ',[('(W-COIN, WC and the fold had 0 rows;','(W-COIN, WC and the fold hold 0 rows;')])
X[117]=(None,'colon',[('fold §3.1.1 ↳ list only','fold §3.1.1 list only')])
X[118]=' — the fold §3.1.1 rules the lens as the producer and its row carries the occasion; `peaceTerms.js` (799/800) takes it through a leaf car named in PL-5'
X[119]=' The charter narrows the liege\'s VOICE, never a sphere: "sphere" names only hegemony\'s treaty arm (never `narrowed_sphere`).'
````

### `d05.py`

````python
# §4 OBLIGATIONS IN DETAIL (old lines 240-280) — seat 1 continued (resumed seat)
# helpers (shared by d06/d07): \x00 at the start of a fold eats the whitespace before it (build.py)
def _bal(t, st):
    d=0; j=st
    while j<len(t):
        if t[j]=='[': d+=1
        elif t[j]==']':
            d-=1
            if d==0: return j+1
        j+=1
    raise Exception('unbalanced')
def CUT(t, prefix, repl=''):
    assert t.count(prefix)==1,(prefix[:70],t.count(prefix))
    k=t.index(prefix); b=k+prefix.index('['); e=_bal(t,b)
    return t[:k]+repl+t[e:]
def SUB1(t,a,b):
    assert t.count(a)==1,(a[:70],t.count(a)); return t.replace(a,b)
def BODY(i): return BR[i]['text'][1:-1]
def AFTER(i,prefix):
    t=BODY(i); assert t.count(prefix)==1,(i,prefix[:60],t.count(prefix)); return t[t.index(prefix)+len(prefix):]

# 4.1 Service
_t=AFTER(120,'RULINGS-ROUND5 A.8 — ')
_t=SUB1(_t,"THE DIRECT SUMMONS AND ITS ROWS. (i)","THE DIRECT SUMMONS AND ITS ROWS: a direct summons under `unbroken` carries the riders' line to the member, and the MID-LORD'S row is written either way. (i)")
_t=CUT(_t,' [REFINED 2026-10-19 (fp-final r6)'," (a lord that was asked and refused, or let the call lapse, is read the same as one the crown rode past unasked: its men were not given, and the crown took its vassal's men over its head all the same — a reading by delegation, vetoable)")
_t=SUB1(_t," The verifier's three gaps (the mid-lord's row; an edge for a direct summons to write on; the ruled patch) are closed here and at F.6.","")
X[120]=' '+_t
NOTE[120]="folded: the direct summons and its rows (the ruling's design sentence opens it); the nested REFINED kept as a reading by delegation, vetoable; the closing review sentence removed"
_t=AFTER(122,'SEAMS-r2-10 (with PR-r2-17): ')
_t=SUB1(_t,"(PR's `patrol_order`, with its own `sent · kept`, is withdrawn from PL's side, §15.12)","(PR's `patrol_order`, with its own `sent · kept`, is no PL kind, §15.12)")
X[122]=' '+_t
_t=AFTER(123,"one clause for PL's summons: ")
X[123]=' '+SUB1(_t,"a HELD KEEP's","A HELD KEEP's")

# 4.3 Protection
NOTE[124]='a change note (relief was automatic and symmetric); 4.3 states the decided act'
X[125]=('\x00. The relief window is PER CANDIDATE, never the siege\'s first week absolute: measured, every rumor hop takes at least a tick '
 '(`rumorNetwork.js`: `const travelTicks = Math.max(1, finiteNumber(weeks, 1));`) and the rumor stage runs before every stage that asks '
 '(`cure/D-PL-r5-probe/measure-r5.out`), so a liege asked in the week the siege first appears could not yet believe it. Before the reliever believes '
 'there is no answer, no line and no share. A reliever that never comes to believe before the siege ends was never a relief candidate, and its edge gets NO '
 "outcome row: a liege is never blamed for a siege it had not heard of (THE SITES §6.6's rule for a den; this no-row case is a reading by delegation, vetoable)")
NOTE[125]='folded (the per-candidate window, its measurement and the no-row case; the nested REFINED kept as a reading by delegation, vetoable)'
NOTE[126]='a change note (the mint after the DM\'s word); 4.3 states THE MINT WAITS FOR THE WEEK'
X[127]=' '+AFTER(127,'PL-r1-11: ')
_t=AFTER(128,'visible)"): ')
X[128]='\x00. '+SUB1(_t,"SP-9 registers it on its docket row (the fold/spine lane).","SP-9 registers it on its docket row (in the fold and the spine).")
_t=AFTER(130,'MN-r4-verify m6 ("two named callers"): ')
X[130]=' '+SUB1(_t,'(the one corpus law, CHAIR-NOTES 18 (d); truth only','(the one corpus law; truth only')
SUBS+=[(246,"the liege's FIELD FORCE is the term it adds (A.5, below)","the liege's FIELD FORCE is the term it adds ((1), below)"),
 (246,"reads it); the generic symmetric ally relief","reads it). The generic symmetric ally relief"),
 (246,"minted the week the answer RESOLVES (A.2), and the OUTCOME row","minted the week the answer RESOLVES (THE MINT WAITS FOR THE WEEK), and the OUTCOME row"),
 (246,"(§3.5's `P` bracket, measured)","(§3.5's `P`, measured)")]
X[131]=" The hold's `P` moves by the outcome; trust by the answer."
X[132]=(" The siege arm (the war's and a menace's) takes the same two-fact rule as the incursion, so that one record word keeps one meaning and the hold's `P` "
 "reads one quantity: the outcome never maps from the answer, and a liege that sent too few to a town that fell writes `protection_failed` (a reading by delegation, vetoable).")
NOTE[132]='folded (the two-fact rule on the siege arm); the round-1 mapping it replaced is not restated'
NOTE[133]='a change note (the patch list); the list in 4.3 and 4.9 carries `riders_quartered`'
NOTE[134]='a change note (a patch on every row); 4.3 states the two facts'
_a=AFTER(135,'MN §4.7 cites PL\'s row"): ')
_first=_a[:_a.index(' The round-1 record')]
_second=SUB1(AFTER(135,'PS14 — THE INCURSION ARM: '),"(the episode is the unit's `unitKey`, PS's STABLE unit key — §4.6's round-2b bracket)","(the episode is the unit's `unitKey`, PS's STABLE unit key — §4.6)")
assert _first.endswith('for ANY siege.')
X[135]=' '+_first[:-1]+'; MN §4.7 cites this row. THE INCURSION ARM (PS14): '+_second
NOTE[135]="folded (the one decision; the incursion arm); the review sentence on the round-1 record and the fold's register routing removed"
_t=' The incursion arm is '+AFTER(136,'RULINGS-ROUND3 A.6, ')
_t=SUB1(_t,"(PS §7.5: \"as the defender's size, B's DEFENCE `passageDefenceOf` (§2.7): its FIELD FORCE `passageFieldForceOf(B)` = `homeDefense − siteDefense` (A.1: the ready keep stays at the walls, ST §4.1 — never on the road at the border) PLUS, where B is a member whose crossing's LIEGE LINE reads `sent` as it stands at the resolution, the liege's relief share as `computeAllyRelief` computes it\")",
 "(PS §7.5: the defender's size is B's DEFENCE `passageDefenceOf` (§2.7) — its FIELD FORCE `passageFieldForceOf(B)` = `homeDefense − siteDefense` (the ready keep stays at the walls, ST §4.1, never on the road at the border) PLUS, where B is a member whose crossing's LIEGE LINE reads `sent` as it stands at the resolution, the liege's relief share as `computeAllyRelief` computes it)")
_t=CUT(_t," [CURED 2026-10-19 (fp-final r5) — the r4 verifier's minor (§4.3 (1)",'')
_t=SUB1(_t,"The same sum is what PS's threshold reads (A.1, PS's half)","The same sum is what PS's threshold reads (PS's half of this joint row)")
_t=CUT(_t," [CURED 2026-10-18 (fp-final r4) — the PL-r3-verify FAIL (ROUTED-UNAPPLIED"," Measured: `computeAllyRelief` at master (`cure/D-PL-r4-probe/measure.out`).")
_t=CUT(_t," [CURED 2026-10-19 (fp-final r5) — MN-r4-verify m6]",'')
_t=CUT(_t," [CURED 2026-10-18 (fp-final r4) — the PL-r3-verify minor: §10's relight",'')
_t=SUB1(_t,"(RULINGS-ROUND3 §E.2: the call is \"the week the incursion is first seen\"; `reliefAnswerOf` reads","(the call is in the week the incursion is first seen; `reliefAnswerOf` reads")
_t=SUB1(_t,"— B.11's per-candidate window binds SIEGE relief only","— the per-candidate window binds SIEGE relief only")
_t=CUT(_t," [RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.4",": PS's first-sight default stands as PS writes it, and the outcome row follows (3) after that answer, so PL and PS give one rule for one border battle")
_t=SUB1(_t,"THE MINT WAITS FOR THE WEEK (RULINGS-ROUND4 A.2):","THE MINT WAITS FOR THE WEEK:")
_t=CUT(_t," [CURED 2026-10-19 (fp-final r5) — the r4 verifier's minor (\"After the mint",'')
_t=CUT(_t," [CURED 2026-10-18 (fp-final r4) — PL-W1 (MAJOR: with the DM decreeing"," A decreed `kept` mints `relief_kept` with its resentment patch, the contest is fought without the share, and the outcome's receipt reads \"did not come\" (P48). The mirror and the first-member tie rule are a reading by delegation, vetoable.")
_t=CUT(_t," [CURED 2026-10-18 (fp-final r4) — the PL-r3-verify FAIL PL-V5 (partial",'')
_t=CUT(_t," [RE-RULED 2026-10-18 (fp-final r4) — PL-r4-S1 (RULINGS-ROUND4 §E: \"the OUTCOME"," (the same rule after `sent` and after `kept`: the ANSWER moves trust, so an answer never moves `P`, §4.9)")
_t=SUB1(_t,"`protection_kept` otherwise (\"its walls held, nothing raided\", A.1)","`protection_kept` otherwise (\"its walls held, nothing raided\")")
_t=CUT(_t," [CURED 2026-10-19 (fp-final r5) — PL-V5 (the r4 verifier's FAIL, partial)"," — the raid upon a town is the registry's `raid` (the fold files a `supply_raid` under `road`, an army's supply road), and a raid BOUGHT OFF is harm (the member paid it); a siege the column opens at the member's walls is (c)'s own fact")
_t=CUT(_t," [CURED 2026-10-20 (fp-final P5) — P5C-20 (WC-PL-39","; THE HARM READ IS DARK until the war volume's `raid` and `supply_raid` kinds land — measured, no war record carries a raid at master (`supply_raid` has 0 hits in WC and on master, and `concludedWarRecord.js` is the close-road census of ENDED wars, never a border incident, so it is no `concludedWarRecord` read; neither kind is built on master, `cure/D-PL-r5-probe/measure-r5.out`) — and once they land the arm reads their RESOLVED verdicts on the engagement registry for the member within the crossing's span, the read PL-4's car-0 then names (PLAUSIBLE until it does)")
_t=SUB1(_t,"stand in every arm — A.1: \"the ANSWER moves trust either way\".","stand in every arm: the ANSWER moves trust either way.")
_t=CUT(_t," [RE-RULED 2026-10-18 (fp-final r4) — PL-r4-S1, the round-4 STOP"," The harm rule applies after EITHER answer, and the refusal is priced by `relief_kept`'s resentment patch (P47 (c), OD-PL-54).")
_t=SUB1(_t," The verifier's PLAUSIBLE half (\"through the trust patch, grip, and so deference\") is false at master — trust is not a grip term (§3.5) — and changes nothing in the cure.","")
X[136]=_t
NOTE[136]=("folded, its 13 nested markers resolved to the latest text: (1) the share on FIELD FORCE (the PS quotation restated as PS's rule; two re-cut notes removed, the probe receipt kept); "
 "(2) the first-sight call — the r6 RE-RULED (RULINGS-ROUND6 B.4) WITHDRAWS the r5 extension of the per-candidate window to the incursion: its quoted text is DROPPED as superseded, PS's first-sight default stands; "
 "THE MINT WAITS FOR THE WEEK; the line frozen at the mint; a decreed `kept` (the mirror and tie rule kept as a reading, vetoable); "
 "(3) the outcome — the r4 RE-RULED harm rule after EITHER answer (A.6's `kept` clause WITHDRAWN, not restated), the r5 town-raid read and the P5 DARK harm read stated once; (4) the dark gates; the verifier's PLAUSIBLE-half sentence removed (trust is not a grip term is stated in 4.3 and 4.9)")

# 4.5 Passage
SUBS+=[(250,"\"Members' armies are not hostile on one another's roads\" is STRUCK — feuding members may be hostile;","No rule makes members' armies friendly on one another's roads — feuding members may be hostile;")]
NOTE[137]='a change note (the toll waiver as an override); 4.5 states the charter term'
_t=AFTER(138,'(fp-final r1) — ')
_t=SUB1(_t,"the passage of ARMS (the owner's word of 10-18)","The passage of ARMS (the owner's word)")
_t=CUT(_t," [CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.14]",'')
_t=SUB1(_t,"its coupling row with PL is the chair's at P4 (§2's pointer).","the fold holds its coupling row with PL (§2's pointer).")
X[138]=' '+_t
NOTE[138]="folded (the passage of arms is THE PASSAGE's; the suspended link reads `rival`); \"the chair's at P4\" → the fold holds the coupling row; the bare word \"passage\" here in THE PASSAGE's sense is a further site of ⛔ STOP PL-C-1"

# 4.6 The fealty record
_t=AFTER(140,'(fp-final) — ')
_t=SUB1(_t,'measured (`cure/L-PL.md` §1b)','Measured (`cure/L-PL.md` §1b)')
_t=SUB1(_t," — the ruling's \"one writer in the polity module\" would have been a second writer of relationship state.",", so relationship state keeps its one writer.")
X[140]=' '+_t
X[141]=(" — `peace_unkept` is a member's default on keeping the peace (§4.8): free on master (0 · 0, `cure/D-PL-r4-probe/measure.out`) and matched by none of the landed "
 "hint and wound regexes (executed), with no new field (the body's kind rides its episode)")
X[142]=("\x00; `riders_quartered` is the PRECEDENCE FRICTION (§4.7 F.6 (b): the crown's sweep of a lord's roads unasked; the crown's direct summons riding past a lord), "
 "homed in this record, never among §15.9's weave incidents — 0 src · 0 tests and matched by none of `ESCALATION_HINT` · `DEESCALATION_HINT` · `WOUND_TYPE_RE` "
 "(executed, `cure/D-PL-r5-probe/regex_r5.out`); a persisted-vocabulary addition, declared (OD-PL-34)")
X[143]=(" (free on master, 0 · 0 · 0 · 0, `cure/D-PL-r5-probe/measure-r5.out`; a one-field addition to the fealty record, declared). A re-written `fealty_sworn` baseline "
 "after eviction is a bookkeeping row, never a renewal. The landed `lastTransitionTick` is no \"oath sworn\" tick: it has three writers, and a canon impact stamps it on any "
 "canon relabel (`canonRelationshipImpact.js`: `lastTransitionTick: tick,`). `oathSince` reads the STANDING oath — a `fealty_renewed` re-swears it (the fealty question "
 "follows a seat change: the vassal swears to the NEW lord), so a renewal survives eviction inside the summary (`cure/D-PL-r5-probe/ageterm_r5.out`: a crown renewed at "
 "year 20 whose renewal 30 failure rows a year evicted reads `A` 0.200, its true age, not 1.000) — a reading by delegation, vetoable")
NOTE[143]="folded (`oathSince` free on master; the baseline is bookkeeping; `lastTransitionTick` rejected as the oath tick; the standing-oath reading kept, vetoable); the ruling's \"'evicted reads 1' is STRUCK\" not restated (§3.5 states `A`)"
SUBS+=[(252,"; `rowId = [kind, relationshipKey, episodeId ?? tick].join('.')` (exact-once);",". `rowId = [kind, relationshipKey, episodeId ?? tick].join('.')` (exact-once);")]
NOTE[144]='a change note (one outcome per edge per episode); 4.6 states the rule'
_t=AFTER(145,'two additions inside shape 3, no new shape. ')
X[145]=CUT(_t,' [CURED 2026-10-19 (fp-final r5) — PL-X1 · A.7]','')+" The record's bounds:"
NOTE[145]='folded (the baseline row and the episode key inside shape 3; its nested r5 stamp removed)'
X[146]=' '+SUB1(AFTER(146,'RULINGS-ROUND3 A.5: '),'every row is written','Every row is written')
_t=AFTER(147,"PS open question 3's requests — ")
_t=SUB1(_t,"(1), (3) and, since round 5, (4)'s three faith rows [CURED 2026-10-19 (fp-final r5) — L-BD 23b]:","(1), (3) and (4)'s three faith rows:")
_t=CUT(_t," [CURED 2026-10-18 (fp-final r4) — THE BODIES' route (1): `body:` REGISTERED in PL's own commit"," (`body:` is registered in PL's own commit; 0 quoted `'body:` literals in master `src`)")
_t=CUT(_t," [CURED 2026-10-18 (fp-final r3) — PL-V4 (MAJOR: PS's `PASSAGE_MOVER_KINDS`",
 (". `patrol:` and `corps:` are registered in PL's commit: PS's `PASSAGE_MOVER_KINDS` are `army · column · patrol · corps`, with keys `'patrol:' + detachmentId` and "
  "`'corps:' + unitKey` (PS §2.1), and the owner's passage word is \"one military unit of any foreign settlement\" — riders and a retained company are units, so harbouring "
  "them is priced (P40). ONE BAN GRAMMAR: `polity_ban:<subjectKey>:<banTick>` over RN's two keys — `polity_ban:p:<wnpcId>:<banTick>` and `polity_ban:u:<unitKey>:<banTick>` — "
  "never the person-only `polity_ban:<wnpcId>:<banTick>`; CH's corps form `polity_ban:corps:<unitKey>:<banTick>` and its person episodes align to it, and nothing is renamed "
  "on master (`polity_ban` is 0 src · 0 tests). The party's key `party` is no member of the grammar: no volume requests a harbouring row for the party (PT prices none), so none is registered"))
_t=SUB1(_t,"(ST's occasion, the bracket below —","(ST's occasion, the SITES CONSIDERED paragraph below —")
X[147]=' '+_t
NOTE[147]="folded: THE REQUEST DOOR with its three nested markers (r5 the faith rows; r4 `body:` registered; r3 `patrol:` · `corps:` and ONE BAN GRAMMAR) stated once; the person-only ban form kept as a \"never\" statement"
_t=AFTER(148,'SEAMS-r2-10 (the door): ')
_t=CUT(_t," [CURED 2026-10-18 (fp-final r3) — PL-V4: `patrol:` and `corps:` added",'')
_t=CUT(_t," [CURED 2026-10-18 (fp-final r4) — THE BODIES' route (1): `body:` added]",'')
_t=CUT(_t," [CURED 2026-10-18 (fp-final r4) — A.7]",'')
_t=CUT(_t," [CURED 2026-10-19 (fp-final r5) — A.8]",'')
X[148]=' '+_t
NOTE[148]='folded (the one door; the closed prefix list; PL\'s own episodes); its four nested stamps removed'
_t=AFTER(149,'never `departTick`"): ')
_t=SUB1(_t,"the `army:` · `column:` · `patrol:` · `corps:` episode is PS's STABLE unit key,","The `army:` · `column:` · `patrol:` · `corps:` episode is PS's STABLE unit key (the unit's own stable id, the deployment id, never `departTick`),")
X[149]=' '+CUT(_t," [CURED 2026-10-18 (fp-final r3) — PL-V4: the bracket re-worded",'')
_t=AFTER(150,'L-ST item 20(c), ')
_t=SUB1(_t,'SITES CONSIDERED (THE SITES','**SITES CONSIDERED** (THE SITES')
_t=SUB1(_t,'(RULINGS-ROUND4 A.5; ST §4.1; PS §2.5) [CURED 2026-10-18 (fp-final r4) — A.5].','(ST §4.1; PS §2.5).')
_t=SUB1(_t,'· OD-ST-46 ↳ r5) [','· OD-ST-46) [')
_t=CUT(_t,' [CURED 2026-10-19 (fp-final r6) — PL-r5-verify F1 · SEAMS-r5-25','')
_t=CUT(_t," [CURED 2026-10-19 (fp-final r5) — `cure/D-ST-r4.md` §5's route to PL",'')
_t=CUT(_t,' [CURED 2026-10-18 (fp-final r4) — SEAMS-r3-5 (MAJOR: "the den occasion',
 " — ST supplies the two closings, and because both are REQUESTED rows, the OBLIGATION flag's darkness never leaves the den one-way")
X[150]=_t
NOTE[150]="folded as §4.6's closing paragraph **SITES CONSIDERED** (the paragraph §3.5's `P` cites as \"§4's sites paragraph, item 2\"); its five nested markers resolved: r4 FIELD FORCE, r6 the clearer-holds den (the `↳ r5` pointer removed), r5 the two closings and the opening tick, r4 both outcomes requested"

# 4.7 THE BANNER
SUBS+=[(256,"(RULINGS-ROUND3 §F; THE PATROLS own","(THE PATROLS own")]
NOTE[151]='a change note (the jurisdiction read at PS §5.5); the heading cites PS §5.5'
X[152]=(" PL's side of THE BANNER, below: F.1 the home and its stack of banners, F.2 the one share law, F.3 the hold read, F.4 the protection deed "
 "(the fealty record's rows), F.5 the break's effect on the stack, F.6 the grip and resentment counterforces.")
NOTE[152]="folded as the reading map of F.1–F.6 (F.n are this section's own design labels, kept); ruling and finding tags removed"
NOTE[153]="a change note (\"never skipping a lord's ROW\"); F.1 states it"
X[154]=" The hold enters the lend once: a sub-vassal's share is its own band toward its own liege."
NOTE[154]="folded (the hold enters once; the sub-vassal's own band); the superseded formula `floor(n × share01 × hold01)` is not restated (ALLOW-MISSING)"
SUBS+=[(260," (PL-V5's principle)","")]
NOTE[155]="a change note (PR's accessor is the one read); F.4 names `bannerCoverOf`"
X[156]=("\x00; the tally is PR's declared one-field addition (`weeksCovered`, PR's shape and lifecycle, read through `bannerCoverOf`), its season boundary the tally's own reset, "
 "`tick − (tick mod INTERVAL_WEEKS.one_season)` (the `yearStartTick` idiom), and the late-answer clause is a reading by delegation, vetoable")
NOTE[157]='a change note (the ruling quote: the lender\'s credit for a lord that let its men go); F.6 (a) states it'
X[158]=" (the sweep fires only on the lord's own need, read off PR's second count `swept` in the same season pair, PR §7.6/§2.7)"
SUBS+=[(262,"(a fief granted it, §4.6's sites bracket (3))","(a fief granted it, §4.6's SITES CONSIDERED paragraph, (3))")]
X[159]=(" `riders_quartered` is the word THE PATROLS asked for (PR §7.6, OD-PR-26), homed in shape 3's closed kinds (§4.6), never in §15.9's weave list, so the "
 "friction is priced where the weave is dark and never twice where it is lit (one path, §4.9): the garrison joins that ONE home, one word keeps one pricing, and "
 "§15.9 carries the pointer. One kind serves every arm of the friction, and the sweep is read off F.4's own tally with the opposite occasion — a member whose men "
 "went to the levy is COVERED (protection); one whose men stayed home is SWEPT (friction). Both are readings by delegation, vetoable.")
NOTE[159]='folded together with B160 at this place (the one home of `riders_quartered`; the garrison arm joins it; the readings kept, vetoable)'
NOTE[160]='folded with B159 (one statement at B159\'s place: the word re-homed to shape 3, priced once; one kind for every arm; the sweep off F.4\'s tally)'
_t=AFTER(161,'each vetoable — ')
_t=SUB1(_t,"so §F.4's \"a member whose riders went to the levy\" is","so \"a member whose riders went to the levy\" is")
_t=SUB1(_t,"(v) §F.7's sentence says \"the crown's wardens\", PL says \"riders\": SEAMS-r2-17 struck `warden` from PL (","(v) PL says \"riders\", never \"the crown's wardens\": `warden` is no PL word (")
X[161]="**The banner's readings (by delegation, each vetoable).** "+_t
NOTE[161]="folded as its own paragraph, THE BANNER's readings (i)–(v), each vetoable; the struck `warden` stated as \"no PL word\""

# 4.8 Keeping the peace
SUBS+=[(266,"Three pieces, one door — and, since round 5, the crown's faith and a foreign hand, (4) and (5):","Three pieces, one door — and with them the crown's faith and a foreign hand, (4) and (5):")]
X[163]="\x00; (4)(b) and (4)(a)'s unguarded cases ARE this row"
SUBS+=[(267,"this default — RULINGS-ROUND6 B.5;","this default;")]
_t=AFTER(166,'`body_stance` input"). ')
_t=SUB1(_t,"the families' rule (RULINGS-ROUND3 A.5: \"requested rows → the requester's flag ∧ `polityEnabled`\")","the families' rule (requested rows → the requester's flag ∧ `polityEnabled`)")
X[166]='**The routes from THE BODIES.** '+SUB1(_t,' Routed to BD.','')
NOTE[166]="folded as its own paragraph (`peace_unkept`'s family and its no-patch answer); \"Routed to BD\" removed"
_t=AFTER(167,'(fp-final r4) — ')
X[167]=' '+SUB1(_t,' Routed to BD. Vetoable.',' (A reading by delegation, vetoable.)')
SUBS+=[(271,"the owner's 18:28 word, L-BD 23b:","the owner's 18:28 word, THE BODIES' item 23b:"),
 (271,"(a `curbed`/`outlawed` flock raiding a fellow member, RULINGS-ROUND5 B.2)","(a `curbed`/`outlawed` flock raiding a fellow member)")]
NOTE[168]='a change note (the stance guard); (4)(a) states it'
X[169]=(" The door already returns rows of any closed kind (`cure/D-PL-r4.md` open item 1), so (4) adds no kind and no prefix. Three readings by delegation, each vetoable: "
 "(i) each edge is judged by its own liege's creed (§3.1's idiom); (ii) the rival creed's defiance is priced only on the court's own act of endowment — harbouring's "
 "rule (an act, never a stance by default, §4.8 (3)); (iii) the mirror is priced on the active stances, and its \"protection step\" is carried by deference, never a "
 "second input on the relief fork, which would count one defiance twice.")
NOTE[169]='folded (no kind and no prefix added; the three readings kept, vetoable); the BD route and its review label removed'
X[170]=" The `staunch` bound and the inside-sponsor case are readings by delegation, vetoable."

# 4.9 What moves the oath
X[171]=(" This section states once what PL8, §3.5's `P` and §4.3 say of the oath, and other volumes cite it as PL §4.9 (the fold's `fealty_*` row and THE BODIES §10.2 (b) among them). The \"deference patch\" of PL7 and §5.6 is the "
 "pair's RESENTMENT (up for a defiance, down for `renew`) — the one grip term a state patch moves (a reading by delegation, vetoable).")
NOTE[171]="folded (the section's purpose; the \"deference patch\" as resentment, vetoable); the citing finding and the fold's ↳ row pointer removed"
NOTE[173]='a change note (the ruled patch has its row); 4.9 item 1 lists `riders_quartered`'
SUBS+=[(278,"is a ROW with its patch since round 5, never also wear","is a ROW with its patch, never also wear")]
````

### `d06.py`

````python
# §5 THE POLITY WAR (old lines 283-350)
X[175]='Every code token names it the POLITY war, never "crown war"; prose says "civil war" and "the crown".'
NOTE[175]='folded as the section\'s naming line ("renamed" restated as the naming rule)'
_t=AFTER(176,'PL-r1-6: this now holds through a conquest of the crown too. ')
X[176]=' This holds through a conquest of the crown too: '+_t[0].lower()+_t[1:]
X[177]=' ('+AFTER(177,'SX-12: ')+')'
X[178]='\x00; '+AFTER(178,'PL-r1-30: ')
_t=AFTER(181,'(fp-final) — ')
_t=SUB1(_t,'measured (','Measured (')
X[181]=' '+SUB1(_t,"the ruling's nine readers are joined by five more war-side readers","nine readers are joined by five more war-side readers")
SUBS+=[(300,"the suit REFUSED on a suspended link (STOP-1 RULED (A′), §5.5)","the suit REFUSED on a suspended link (§5.5)")]
_t=AFTER(182,'PL-r1-5: ')
X[182]=' ('+SUB1(_t,'so the crown kept up to its full share','so unguarded the crown would keep up to its full share')+')'
X[184]=' — '+AFTER(184,'PL-r1-5: ')
X[187]=" (PS's ladder is GUARDED; the rung is PS's)"
NOTE[187]="folded (PS's ladder joins GUARDED; the rung is PS's half); the quoted struck PS clause is not restated"
NOTE[188]='a change note (the walker walks both the type and the channel types); the walker paragraph states it'
NOTE[191]="a change note (the polity stage is PL-9's stage; its writer named); 5.4 names `polity.js :: writePolityContest`"
X[193]=(" The writer never relabels — a relabel in this engine is four writes plus the cascade inside frozen `applyWorldPulse.js`, and `applyPulseMover` drops any "
 "graph the polity stage's host returns.")
NOTE[193]="folded (why the writer never relabels); the rest of the note (defaults, conquest, the ruled path with (B)) is stated by 5.5's own paragraphs"
X[194]=(" (an ENGINE DEFAULT — a crown passing, a partition, a vassalage formed or broken — meets the DM's majors pause on a month advance as the landed "
 "`occupation_vassalized`, the same structural shape, does: `decisionTier.js`: \"classifies a selected outcome on STRUCTURAL markers, never severity or applyMode … "
 "a vassalage\"; fold 24(c): the landed majors pause and its DM switch are UNTOUCHED)")
X[195]=(" The two rows, both auto, keep one cause's substance — auto-apply, never a proposal, the seal as the gate — and differ only in the majors marker "
 "(a reading by delegation, vetoable).")
SUBS+=[(317,"mint `polity_verdict_default` (PL-V2).","mint `polity_verdict_default`.")]
_t=AFTER(196,'PL-V2, ')
X[196]=' '+SUB1(_t,'writes its state as before.','writes its state as above.')
SUBS+=[(321,"**THE MEMBER WARS** — the chair's STOP-1 ruling (A′), RULINGS-AFTER-COMPILE. While","**THE MEMBER WARS** — the ruled path (A′). While"),
 (321,"**FALLBACK (B)**, named by the chair: if","**FALLBACK (B)**, the named fallback: if")]
NOTE[197]="a change note (`truce` declared in §10); THE MEMBER WARS cites §10"
_t=AFTER(198,'the round-1 guard kept the edge but not the walk. ')
X[198]=' '+SUB1(_t," — and the old guard dropped the polity as a `polity_circle` in the middle of the contest. The walk now reads that unbacked rung step as the crown in chains (PL2):",
 " — and the walk reads that unbacked rung step as the crown in chains (PL2), never as a `polity_circle` in the middle of the contest:")
NOTE[199]='a change note (`lapsed` added); the verdict list carries it'
X[200]=(" (the windows use the landed keys — `intervalWeeks.js :: INTERVAL_WEEKS` is `{ one_week: 1, one_month: 4, one_season: 13, one_year: 52 }`, the keys MN "
 "already cites; `INTERVAL_WEEKS.season` and `.year` do not exist and would read `undefined`)")
LINE[332]=None
NOTE[201]="a change note on the STOP-1 line; the line is removed and the ruling stands as THE MEMBER WARS (the ruled path (A′), FALLBACK (B) named)"
X[203]=' Measured (`cure/L-PL.md` §1e): no single landed record carries every seat change (there is no "rulingPowerHistory").'
X[204]=(" (never by position or label: `MAX_PREVIOUS_GOVERNMENTS = 6` and `.slice(-MAX_PREVIOUS_GOVERNMENTS)` shift every position, and the 24-row record could "
 "evict a guard the 6-row history still holds)")
X[205]=' '+SUB1(AFTER(205,'PL-V3: '),'the key is','The key is')
_t=AFTER(206,'for this family it needs one more clause, here. ')
_t=CUT(_t,' [CURED 2026-10-19 (fp-final r5) — PL-X1 · A.7]','')
_t=SUB1(_t,'P14, P15 and P39 are unchanged; P46 pins the relight.','P46 pins the relight; P14, P15 and P39 stand.')
X[206]=' '+SUB1(_t,' Vetoable.'," This clause is the family's dark-after-lit path (§10), a reading by delegation, vetoable.")
SUBS+=[(334,"**STOP-2 — RULED (RULINGS-AFTER-COMPILE §PL): the gap is ACCEPTED AND RECORDED.**","**THE DM'S KILL/ASSIGN — the gap is ACCEPTED AND RECORDED.**"),
 (334,"else it is `free`) (OFFERED ONLY","else it is `free`; OFFERED ONLY")]
X[208]=' '+AFTER(208,'(PL names the hook)"): ')
X[209]="(OFFERED ONLY while `polityContestEnabled` is lit; dark, it is absent from the decider's choice set and from the card, whose answers are then `renew · withhold · free`; P41 extends)"
````

### `d07.py`

````python
# §6 THE CROWN'S PEACE (old lines 352-357)
NOTE[213]="a change note (one rule for §3.2 and §6; head and observer named); §6 names the liege's own read"
X[214]=' '+SUB1(AFTER(214,'SPL-M12 · SX-13: '),"the finder's precedence rule","The finder's precedence rule")
X[215]=' '+SUB1(AFTER(215,"THE BODIES' route (3): "),"the crown's peace has a second face","The crown's peace has a second face")
````

### `d08.py`

````python
# §7 THE HEARINGS (old lines 358-382) and §8 THE FLAGS (old lines 383-416) — seat 2
# §7
X[216]="PL's kinds are named `polity_*`, never `crown_*`; the hearing is `fealty_break`, while the casus keeps `fealty_broken`."
NOTE[216]="folded as the final names (`polity_*`, never `crown_*`; the hearing `fealty_break`, the casus `fealty_broken`); `remnant` → `stand_by` and `lapsed` stand in the table (seat 1 keeps `remnant` as a \"never\"); the fold's routing removed"
X[217]=''
NOTE[217]="folded into the sentence that replaces line 362 (relief is no kind; `relief_answer` kept as a \"never\" statement); the per-kind defaults it names stand in the rows"
X[218]="Every PL kind is heard at a settlement (the WHERE column). Relief is never a kind (`relief_answer` is no PL kind): the liege's answer is an input line on another volume's card (below, §4.3)."
NOTE[218]="folded as the WHERE sentence (the host ruling's tags removed)"
X[220]=" — no second summons kind for the same men"
X[221]=" (requirement 24(b): \"a draw bias where it does; each kind declares which\")"
NOTE[222]="a change note (one place lists the input lines); the paragraph is that place"
# §8
X[223]=" (the hold, the fear source, the homonym cure and the casus are other flags', so PL-1 lights without PL-2's or PL-6's shifts)"
NOTE[224]="a change note (a flag of its own); the row is that flag"
NOTE[225]="a change note (the sphere and the ceiling gone; PL7's definitions under `polityBreakEnabled`); the row states the final gates"
NOTE[226]="a change note (a flag of its own, off the owner-lit seat); the row states it"
NOTE[230]="a change note (the fealty record's writes left this flag for the families); THE FEALTY RECORD'S FAMILIES states the rule"
X[231]=" (relief's gates are each arm's real relief; the menace arm's DECISION is lit by `menaceResponseEnabled` alone, OD-MN-21, MN §4.7 — this flag gates only its rows)"
NOTE[232]="a change note (the family's own flag); the paragraph after THE FEALTY RECORD'S FAMILIES states its consequence (P38, P41)"
X[233]=" (measured: `npcLadderKernel.js` appends an organic `seatTransitions` row only under `const warRulingsLit = … warLayerEnabled === true && … warTerminationEnabled === true`; elsewhere producer (1) answers alone, as `seatChangedSince`'s tick form says, §2)"
X[234]=" — PL's own decider needs no GR-4 host (never `oathHolderEnabled`)"
NOTE[234]="folded (PL's decider needs no GR-4 host; the draft's `oathHolderEnabled` kept as a \"never\")"
NOTE[236]="a change note (the channel moved to its own row; the claim's occasion (2) reads the hold); the host-flags cell names `polityHoldEnabled`"
NOTE[237]="a change note (why the channel left `polityContestEnabled`); the row states the final gate"
NOTE[239]="a change note (`riders_quartered` moved to the OBLIGATION family); the obligations row and the families table carry it"
NOTE[240]="a change note (`hearingWeekEnabled` named); the section heading names it"
NOTE[241]="a change note (the claim true once every shift had its own flag)"
X[242]="CH's crown ban (`polity_ban`) reads `polityHold` and `crownReachAt`, so it needs `polityHoldEnabled` (CH's flag row and CH-5's TIER line)."
NOTE[242]="folded as the design sentence (CH's crown ban needs `polityHoldEnabled`); the review routing to CH's lane removed"
NOTE[243]="a change note (the claim true for the fealty record by the families)"
NOTE[244]="a change note (the ruling's quotation); the families paragraph states the rule"
X[247]=" (the banner's two rows are the crown's own, so OBLIGATION's — with THE PATROLS lit, `patrolsEnabled`, and PL-5's summons)"
X[250]="(a reading by delegation, vetoable)"
SUBS+=[(409,"Two occasions that A.5 does not name are placed by the same rule, marked (a reading by delegation, vetoable):","Two occasions are placed by the same rule (a reading by delegation, vetoable):")]
X[251]=" (a member war closes only through the verdict writer, which never runs once its flag is dark; a war left on a link that reads `vassal` again could never close — `PEACE_STEP` has no `vassal` row, and \"A vassal/patron hierarchy edge is never a besiege candidate\")"
X[252]=("The \"presets it may light in\" column claims preset NAMES. A born campaign carries the default preset's name but none of its switches "
 "(`NEW_CAMPAIGN_SIMULATION_PRESET_ID = null`), so every lighting claim above waits on the fold's executed host-side check.")
NOTE[252]="folded as the closing paragraph (the host ruling's tags removed)"
````

### `d09.py`

````python
# §9 THE WAVES (old lines 417-459) — seat 2
def CAP(s): return s[0].upper()+s[1:]
X[253]=("Every wave carries L10's five-member EDITOR line (seal · direction row · counterparty · states at the chokepoint · the cause) and requirement 13's Alignment line; "
 "every child receipt names its `causedBy` parent; PL is a CARRIER across GRAMMAR · WAR · INTERIOR · TRADE · INFO; no wave that lands behaviour is called instrumentation.")
NOTE[253]="folded as the section's opening sentence (the EDITOR and Alignment lines, `causedBy`, PL a carrier, no behaviour called instrumentation); the fold's routing removed"
X[254]="Every TIER line names the omniscient default's arm (what a DM in `realistic_regional` gets) and the hearing pause (`hearingWeekEnabled`)."
NOTE[255]="a change note (the appointment's producer); `APPOINT_TO_SEAT` is that producer in the verb list"
SUBS+=[(419,'gains one option, "ask the vassals" (STOP-2\'s ruling, §5.6)','gains one option, "ask the vassals" (§5.6)'),
       (419,"through `openFealtyAsk` (§5.6's P5 bracket)","through `openFealtyAsk` (§5.6)")]
X[257]=("\x00. Each host takes ONE polity hook returning a bundle its sites read (PL14's \"ONE call into a leaf\"); the effective-line delta is measured ONCE at the first wave's car-0 against 800, "
 "and a host that would cross it gets a leaf-first car first.")
NOTE[257]="folded (one hook per host, the delta measured once at car-0); the count of the old separate changes removed"
SUBS+=[(426,"on the PUBLIC signs (§15.2; P5C-15) (never","on the PUBLIC signs (§15.2) (never"),
       (432,"the one additive export `vassalageSeatsOf` (PL-r1-7).","the one additive export `vassalageSeatsOf`.")]
NOTE[258]="a change note (\"owned by the first chain to land\" struck); the cell names WC's owned `WC-car-0`"
_t=AFTER(260,'HOST-r1-1 · HOST-r1-3: ')
_t=SUB1(_t,' The fold §3.1 rows are the chair\'s.','')
X[260]=' '+CAP(_t)
NOTE[260]="folded (the port export, the borders lens, the puppet seat ruled once, port messages first); the fold routing sentence removed"
_t=AFTER(261,"once §2's tuple bracket is re-worded. ")
_t=SUB1(_t,' The owner\'s word of 2026-10-18 05:57 ("i told the mapmaker i do as it suggested", recorded as H1–H30 ACCEPTED WORK, CHAIR-NOTES 9) outranks the round-1 ADDENDUM\'s clause "the map\'s own chain rule is superseded by that read when H13 lands" (HOST-r1-1), so PL carries no supersession anywhere.',
 ' By the owner\'s word ("i told the mapmaker i do as it suggested", the host document\'s H1–H30 ACCEPTED WORK) PL carries no supersession of the map\'s chain rule anywhere.')
_t=SUB1(_t,' The fold\'s two passages (§3.1.26 and INBOX ↳ r1 (a)) are HOST-r2-4\'s fold half, for P4.','')
X[261]=' '+_t
NOTE[261]="folded (H13 carries the tuple; the map MAY adopt it — an ask, never a supersession; the owner's word stands); the confirmation note, the superseded clause's history and the fold routing removed"
NOTE[262]="a change note (the band word left the surface; the homonym cure moved to PL-6); the FIRST-VISIBLE text states the outcome sentence"
NOTE[263]="a change note (the sphere and the ceiling struck; the call-site count); the text names the ten sites"
NOTE[264]="a change note (\"owned by the first chain to land\" struck)"
_t=AFTER(266,'PL-V5 · A.6: ')
_t=SUB1(_t,' [CURED 2026-10-19 (fp-final r5) — the r4 verifier\'s minor: the r3 line stood unqualified here while §13 limits it]','')
X[266]=' '+CAP(_t)
NOTE[266]="folded (the decider `reliefAnswerOf` and its two facts; the incursion's first sight; the outcome line, said only of a fought and lost contest); the nested CURED change note removed"
_t=AFTER(267,'PL-W1 · A.1 · A.2 · A.5 · A.7: ')
_t=SUB1(_t,' Hosts unchanged (the polity stage; `warCapacityReads.js` 143 its one read, now of the answer as it stands — PLAUSIBLE until car-0 names the docket read).',
 ' `warCapacityReads.js` (143) makes its one read of the answer as it stands — PLAUSIBLE until car-0 names the docket read.')
X[267]=' '+CAP(_t)
NOTE[267]="folded (the default from the decider, the mint at the week, the answer before the verdict, FIELD FORCE, the banner's protection deed and its line); \"Hosts unchanged\" restated as the host's read"
_t=AFTER(268,"the r4 verifier's carrier minor: ")
_t=SUB1(_t,' [RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.4]','')
X[268]=' '+CAP(_t)
NOTE[268]="folded (the per-reliever first belief; the incursion at first sight on the liege's inputs as they stand — the r6 re-ruling's text, its marker removed; four named callers; P55)"
X[270]=(None,'colon',[],' ')
_t=AFTER(271,'STOP-PR-r4-1 · A.8 · B.8 · B.9: ')
_t=SUB1(_t,' — RULINGS-ROUND6 B.3 [CURED 2026-10-19 (fp-final r6)]','')
X[271]=' '+_t
NOTE[271]="folded (the direct summons' rows, the sweep's `riders_quartered`, the cover from PR's season ledger; the friction line); the ruling tag and its nested stamp removed"
_t=AFTER(273,"THE BODIES' route (3): ")
_t=SUB1(_t,', whichever lands second — the SEAMS-r1-2 idiom)',', whichever lands second)')
X[273]=' '+_t
X[274]=(None,'colon',[],' ')
_t=AFTER(275,'`seatChangedSince`"): ')
_t=SUB1(_t,'and PL had never named the door. PL-8 builds it:','and PL-8 builds the door:')
_t=SUB1(_t,' [REFINED 2026-10-20 (fp-final P5) — every settlement is read, sworn or not: the read is pure and per settlement, and a town outside any polity changes hands too, so the slot is not confined to lords; PLAUSIBLE until PL-8\'s car-0 measures the stage\'s two tail reads per settlement; vetoable.]',
 ' Every settlement is read, sworn or not: the read is pure and per settlement, and a town outside any polity changes hands too, so the slot is not confined to lords (a reading by delegation, vetoable; PLAUSIBLE until PL-8\'s car-0 measures the stage\'s two tail reads per settlement).')
X[275]=' '+_t
NOTE[275]="folded (THE `seat_change` DEED DOOR, built by PL-8); the finding and ruling ids removed; the nested REFINED kept as a reading by delegation, vetoable, with its PLAUSIBLE mark"
NOTE[276]="a change note (\"one row\" corrected to two); the text names both rows"
NOTE[278]="a change note (the ending arm no longer waits on the ruled STOP); the car-0 sentence states the path"
_t=AFTER(279,'PL-V1 · PL-V2: ')
_t=SUB1(_t,' (§8\'s channel row), not by PL-9 alone;',' (§8\'s channel row);')
X[279]=' '+CAP(_t)
_t=AFTER(280,'PL-r1-13: ')
X[280]=' ('+_t+')'
NOTE[280]="folded as the parenthesis (requirement 16's sentence; the yearly rite draw with its UNMEASURED estimate)"
````

### `d10.py`

````python
# §10 THE LIFECYCLE (old lines 460-483) — seat 2
NOTE[281]="a change note (all four shapes declared here, in §12 and the fold's OD-FC-45); the routing removed"
X[282]=("The verdict's outcomes are transient: the applier's own relationship writes are the only state they leave. Shape 2 carries `pendingVerdict` (a one-tick carrier) "
 "and always records the crown and the claimant in `sides`; shape 3 carries the `fealty_sworn` kind and the `answer`/`toId` fields.")
NOTE[282]="folded as the section's opening statement (no new shape; the fields each shape carries; the outcomes transient)"
X[283]=("Shape 3's `episodeId` carries the request door's registered occasion prefixes (§4.6); a default verdict withheld at the majors pause leaves shapes 2 and 3 untouched (§5.5); "
 "`seatEpisodeKeyOf` and `seatChangedSince` are derived reads, never persisted.")
NOTE[283]="folded (no new shape or field; the prefixes, the withheld default, the two derived reads)"
SUBS+=[(466,"at first sight on the liege's inputs as they stand (RULINGS-ROUND6 B.4; B.11 binds the siege) — and minted as below","at first sight on the liege's inputs as they stand (a siege's waits for its reliever's belief, §4.3) — and minted as below")]
NOTE[285]="a re-ruling folded: the incursion's default is taken at first sight on the liege's inputs as they stand (the withdrawn r5 clause not restated); the ruling tags removed"
NOTE[287]="a change note (one rule for the answer row: minted at the week, never from the first-sight default); the cell states it once"
NOTE[291]="a change note (\"kept, unread\" was false); the cell states the per-family rule"
SUBS+=[(473,"a siege once the reliever believes it (B.11), an incursion on the liege's inputs as they stand (RULINGS-ROUND6 B.4) —","a siege once the reliever believes it, an incursion on the liege's inputs as they stand —")]
NOTE[294]="a change note (one rule with §4.3 (2)); the cell states it"
SUBS+=[(476,"round 4's rows are bounded by their occasions","the banner's and the bodies' rows are bounded by their occasions"),
       (476,"round 5's rows are bounded the same way","the friction's and the faith rows are bounded the same way"),
       (476,"and the age term no longer depends on what the cap keeps","and the age term does not depend on what the cap keeps"),
       (476,"P5's garrison arm adds","the garrison arm adds")]
SUBS+=[(477,"| ↳ shape 3's `oathSince` |","| shape 3's summary field `oathSince` |"),
       (478,"| ↳ shape 2's `truce?` — FALLBACK (B)'s mark (§5.5) |","| shape 2's field `truce?` — FALLBACK (B)'s mark (§5.5) |"),
       (478,"AND the chair rules (B) in","AND (B) is ruled in")]
NOTE[299]="a change note (the one summary field's own paths); the row is its lifecycle"
NOTE[300]="a change note (a shape field with no lifecycle row); the row is its lifecycle"
X[301]=CAP(AFTER(301,'(fp-final) — '))
````

### `d11.py`

````python
# §11 THE SCENARIO MATRIX (old lines 484-555) — seat 2
NOTE[302]="a change note (every row asserts; heir-dependent rows DARK); the heading states the rule"
for _i in (303,304,305,306,307):
    NOTE[_i]="pin provenance (which review id each pin answers); the pins stand in the rows; the ids stay in the text of record"
_t=AFTER(308,'P55 (the relief window per reliever). ')
X[308]='\x00'+SUB1(_t,'P55 pins the window itself (B.11).','P55 pins the window itself.')
NOTE[308]="pin provenance dropped; its closing design sentence (every relief pin reads its reliever as believing from the first week unless its row says otherwise; P55 pins the window) folded as the section's opening sentence"
NOTE[311]="a change note (the siege answer was minted before the DM's word); the row states the mint at the week"
NOTE[325]="a change note (P42's two outcomes are alternatives); the row states them as ALTERNATIVES"
NOTE[330]="a change note (the repelled and self-ending closings); the row states them"
SUBS+=[(533,"M's and N's cards showing ONE line (A.2);","M's and N's cards showing ONE line (THE MINT WAITS FOR THE WEEK);"),
       (536,"on H's inputs as they stand (RULINGS-ROUND6 B.4);","on H's inputs as they stand;"),
       (536,'its receipt "sent, but too few" (a fought and lost contest — A.1);','its receipt "sent, but too few" (a fought and lost contest);'),
       (539,"H answering at first sight on its inputs as they stand (RULINGS-ROUND6 B.4);","H answering at first sight on its inputs as they stand;"),
       (543,"`oathSince` stays at the first baseline (the r4 rule read 0.053);","`oathSince` stays at the first baseline;"),
       (543,"(`oathSince` moved to year 20 by the renewal; the r4 rule read 0.009);","(`oathSince` moved to year 20 by the renewal);"),
       (544,"| P53 | THE DIRECT SUMMONS (STOP-PR-r4-1 as re-ruled) — H ← M ← L;","| P53 | THE DIRECT SUMMONS — H ← M ← L;"),
       (546,"| P55 | THE RELIEF WINDOW IS PER RELIEVER (B.11) — a belief preset;","| P55 | THE RELIEF WINDOW IS PER RELIEVER — a belief preset;"),
       (546,"on H's inputs as they stand (RULINGS-ROUND6 B.4 — B.11 binds siege relief only);","on H's inputs as they stand (the per-reliever window binds siege relief only);"),
       (547,"| P56 | THE NINTH CLASS (P5C-3) —","| P56 | THE NINTH CLASS —"),
       (548,"| P57 | ASK THE VASSALS (P5C-20) —","| P57 | ASK THE VASSALS —"),
       (548,"without the field nothing opens (STOP-2's accepted gap);","without the field nothing opens (§5.6's accepted gap);"),
       (549,"| P58 | THE GARRISON QUARTERED (P5C-17) —","| P58 | THE GARRISON QUARTERED —"),
       (550,"| P59 | THE `seat_change` DOOR (P5C-24) —","| P59 | THE `seat_change` DOOR —"),
       (551,"| P60 | OUTSIDE PATRONS ON PUBLIC SIGNS (P5C-15) —","| P60 | OUTSIDE PATRONS ON PUBLIC SIGNS —"),
       (552,"| P61 | THE CIRCLE'S RECEIPT (P5C-20) —","| P61 | THE CIRCLE'S RECEIPT —")]
NOTE[332]="a re-ruling folded: H's answer is taken the week the crossing is witnessed on H's inputs as they stand (the withdrawn r5 clause not restated); the ruling tag removed"
NOTE[333]="a change note (\"M's `homeDefense`\" marched M's keep to the border); the row reads FIELD FORCE"
NOTE[334]="a change note (\"the same rows a week later\" was false); the row states the mint at the docket's resolution"
NOTE[337]="a re-ruling folded: the harm rule after either answer — (c) states `protection_kept`, the refusal priced by the answer alone"
NOTE[339]="a change note (the town `raid`, the supply raid, (c) flipped); the row states them"
NOTE[340]="a re-ruling folded: H answers at first sight on its inputs as they stand (the withdrawn r5 clause not restated); the ruling tag removed"
NOTE[345]="a change note (the lend, the season ledger, the friction row); the row states them"
X[348]="\x00; the age term is DRAFT, UNMEASURED"
NOTE[348]="a stamp carrying a design mark: its ids removed, its \"DRAFT, UNMEASURED\" kept in the row"
NOTE[349]="a change note (the busy-edge and relit worlds added); the row states them; the superseded rule's readings (0.053, 0.009) removed with their round label"
NOTE[352]="a re-ruling folded: (c) the incursion's `liegeAnswer` IS taken at first sight, its share in the contest and its outcome row after the answer (the withdrawn r5 clause not restated)"
````

### `d12.py`

````python
# §12 THE RULINGS (old lines 556-623) — seat 2. Every OD row is rewritten whole (LINE) from its old text with the brackets cut out,
# the folds applied by exact substitution, and a fourth column "Ruled" (the row's date, its amendment dates from its own brackets, by delegation, vetoable).
import re as _re
def STRIP(n):
    ls=sum(len(x)+1 for x in L[:n-1]); s=L[n-1]; out=[]; p=0
    for b in sorted((b for b in BR if b['line']==n), key=lambda b:b['start']):
        st=b['start']-ls; en=b['end']-ls; pre=s[p:st]
        if pre.endswith(' '): pre=pre[:-1]
        out.append(pre); p=en
    out.append(s[p:]); t=''.join(out)
    return _re.sub(r'(?<=\S)  +(?=\S)',' ',t)
def _dates(n):
    ds=set()
    for b in BR:
        if b['line']==n: ds|=set(_re.findall(r'20\d\d-\d\d-\d\d',b['text']))
    return ds
def RULED(n,base,extra=''):
    am=sorted(d for d in _dates(n) if d>base)
    s=base
    if am: s+=' · amended '+(am[0] if len(am)==1 else (', '.join(am[:-1])+' and '+am[-1]))
    s+=' · by delegation · vetoable'+extra
    return s
def ROW(n,subs=(),extra='',star=False):
    t=STRIP(n)
    for a,b in subs: t=SUB1(t,a,b)
    m=_re.match(r'\| OD-PL-(\d+) \|',t); k=int(m.group(1))
    base='2026-10-17' if k<=34 else ('2026-10-18' if k<=59 else '2026-10-20')
    if star: t=SUB1(t,'| OD-PL-%d |'%k,'| OD-PL-%d ⭐ |'%k)
    assert t.endswith(' |'),t[-20:]
    LINE[n]=t+' '+RULED(n,base,extra)+' |'
LINE[556]="## §12 THE RULINGS (by delegation under the 2026-10-16 and 2026-10-17 words, vetoable; ⭐ marks the owner's own rows, each VISIBLE; every DRAFT constant UNMEASURED and on the FP-46 roster)"
LINE[558]="| Row | The question | Ruling | Ruled |"
LINE[559]="|---|---|---|---|"
_simple={}
for _n in range(560,621): _simple[_n]=()
_S={}
_S[563]=[("no vetoes; κ struck","no vetoes and no κ")]
_S[566]=[("A1.2.15 amended by name","A1.2.15 amended by name; the weights through the additive `vassalageSeatsOf`; the book follows `polityOf`'s liege under `polityPrecedenceEnabled`")]
_S[568]=[("`narrowed_voice` (renamed from `narrowed_sphere`: it lowers","`narrowed_voice` (never `narrowed_sphere`: it lowers"),
         ("(the chair routes it to GRAMMAR's catalog; `autonom…` avoided, R4 H7)","(GRAMMAR's catalog holds it; `autonom…` avoided, R4 H7)")]
_S[571]=[("⚑ OWNER-VISIBLE: the chair's reading of §735.2","⚑ OWNER-VISIBLE: a reading by delegation of §735.2"),
         ("; the alternative the skeptic offered is W-SEAT's landed","; the alternative is W-SEAT's landed")]
_S[581]=[("| RULED (A′) by the chair (RULINGS-AFTER-COMPILE): the peace suit refused","| (A′), the ruled path: the peace suit refused")]
_S[582]=[("| RULED by the chair: the gap accepted and recorded;","| the gap accepted and recorded;")]
_S[588]=[("or a `fealty_break` standing at its seat (§15.2) — never the liege itself","or a `fealty_break` standing at its seat (§15.2); the intervener never reads a third pair's resentment — never the liege itself"),
         ("who may only back the incumbent (landed) |","who may only back the incumbent (landed; the landed `convergence.js` `const FRIENDLY_REL = new Set(['allied', 'trade_partner', 'vassal']);` would otherwise let the liege back a challenger in its own member) |")]
_S[592]=[("(`DESIGN_FP_ARCH_ST.md`; the chair's 10-18 ruling: a crown's fort","(`DESIGN_FP_ARCH_ST.md`: a crown's fort"),
         ("(persisted; the owner's sign-off) that no PL term reads; court bonds",
          "(persisted; the owner's sign-off) that no PL term reads. H13's held sites and their garrison band are THE SITES' record: H13's `PolitySite` reports a held site's READINESS WORD on the site's own closed set — THE SITES' `SITE_READINESS = at_strength · manned · sparse · skeleton · hollow`, read from the site's one value `siteReadiness01 = F × Q` (ST §2.4–§2.5) — never `readiness01` (a LANDED homonym, a town's or an army's martial readiness: 14 `src` files, `cure/D-PL-r4-probe/measure.out`; ST §2.5's row), never the words `full · … · empty` (`full`/`empty` collide), never `STRENGTH_BANDS`' words; PL reads neither. The SEAT's own force band and garrison presence have no FP owner yet, a slot the fold records; no PL term reads any of them, so PL needs neither owner; court bonds")]
_S[593]=[("the fold's OD-FC-45 amended (the chair's); round 1 adds no shape, only the sub-fields of shapes 2 and 3 declared in §10 |",
          "the fold's OD-FC-45 amended; no other shape — only the sub-fields of shapes 2 and 3 declared in §10: shape 2's `truce?` (fallback (B) only); shape 3's closed `kind` list with `peace_unkept` (THE BODIES') and `riders_quartered` (the precedence friction, §4.7 F.6 (b), never a weave incident), the ONE summary field `oathSince` on the sworn edge (§4.6; C8's age term), and its episodes' registered `body:` prefix and PL's own `riders_lent:`, `riders_quartered:<rootId>:<seasonStartTick>`, the garrison arm's `riders_quartered:<holderId>:<seasonStartTick>` and `ask:<lordId>:<eventRef>` forms; THE BODIES' faith rows (§4.8 (4)) use the closed kinds already declared (`service_answered` · `fealty_defied` · `peace_unkept`) under the registered `body:` prefix; THE PASSAGE's `liegeAnswer` is PS's declared sub-field on its own shape and THE PATROLS' `weeksCovered` is PR's declared field, each read, never PL's; two fields on OTHER records are declared OWNER-VISIBLE (OD-PL-60) |")]
_S[594]=[("one `changeAuthorityPolicy.js` row (`auto`); minor in `decisionTier.js`;",
          "two `changeAuthorityPolicy.js` rows (`auto`) — the sealed `polity_verdict` a minor in `decisionTier.js`, the engine's `polity_verdict_default` a major (`campaignAltering: true`, the `occupation_vassalized` idiom), so the DM's majors pause holds a default and never re-asks his own seal;"),
         ("vassal formations last (§5.5) |","vassal formations last (§5.5); the state pass writes only where the relabels landed; the channel is shared, active under any of its four owner flags, host flag `stressorsEnabled` |")]
_S[599]=[("`lapsed` unreachable while either side holds the other leader's seat |","`lapsed` unreachable while either side holds the other leader's seat; the windows are written `INTERVAL_WEEKS.one_season` and `INTERVAL_WEEKS.one_year`, the landed keys |")]
_S[600]=[("| nine: `polityEnabled` split into it and `polityHoldEnabled`; `polityBreakEnabled` added; a contest outlives its flag only until the wind-down (§8) |",
          "| nine (§8), `polityHoldEnabled` and `polityBreakEnabled` among them; `polityContestEnabled` needs `polityHoldEnabled`; the verdict channel is a flagless shared row lit by any of its four owner flags; the fealty record has no flag of its own — each row family has one owner flag (OD-PL-52); a contest outlives its flag only until the wind-down (§8) |")]
_S[601]=[("(§9 PL-1); the fold §3.1 rows are the chair's |","(§9 PL-1): the export is an additive offer the map MAY adopt for its sway, never a supersession of the map's owner-ruled derivation (HR:671, HR:499; the owner's word); the fold §3.1 holds the rows |")]
_S[603]=[("read by CH's crown retainer and PT's crown backing and bans |","read by CH's crown retainer and PT's crown backing and bans; RN cites it for the sub-vassal hold map and keeps none of its own; the hold term reads the observer's belief |")]
_S[605]=[("`den_unanswered:` · `body:`);","`den_unanswered:` · `body:` — `body:` BD's `bodyId` + the occasion's tick, for `peace_unkept` and a harbouring under a hunt order, one outcome per edge per episode; the one ban grammar `polity_ban:<subjectKey>:<banTick>`, `subjectKey` RN's `p:<wnpcId>` or `u:<unitKey>`; `army:` / `column:` episodes PS's stable unit key);"),
         ("PL7's two acts are the only break triggers (§4.6, PL7) |","PL7's two acts are the only break triggers (§4.6, PL7); `appendRelationshipFealtyRow` is the relationship writer's internal append, never a door; a summons row (its riders' line included) is PL's own, minted and never requested, so there is no `riders:` prefix |")]
_S[607]=[("rows per crossed sworn edge (§4.3) |",
          "rows per crossed sworn edge (§4.3); the `unitKey` is PS's stable unit id, never `departTick`, so a held week keeps one answer; a `sent` answer's share (`computeAllyRelief`'s per-ally term on the liege's FIELD FORCE, `(homeDefense − siteDefense)(liege) × ALLY_RELIEF_FRACTION`) enters the DEFENDER's size in PS §7.5's one contest at each crossed member's border — both sides are FIELD FORCE (the member at its border, `homeDefense − siteDefense`; the liege's share on its own field force), and the same sum is PS's `barred`/`unopposed` threshold; the answer is taken at first sight by PS's incursion leaf through the one decider `reliefAnswerOf`, before the contest, in every arm — \"at first sight\" the first week the unit is witnessed in the member's land, on the liege's own inputs as they stand (the per-reliever belief window binds siege relief only, OD-PL-55) — as the card's DEFAULT, and the row is minted at the week's resolution from the line as it stands (PS's `liegeAnswer`), one line per liege per unit (OD-PL-55); the outcome rows follow each crossing (OD-PL-53), and an `unopposed` crossing's outcome is by its harm (OD-PL-54) |")]
_S[608]=[("PL mints nothing for either (§4's sites bracket, §15.12) |","PL mints nothing for either (§4.6's SITES CONSIDERED paragraph, §15.12) |")]
_S[609]=[("(§4.1, §15.12); ROUND 5: every summons row","(§4.1, §15.12); every summons row")]
_S[610]=[("| `riders_quartered` is registered in §15.9's closed incident list in PL's own commit (THE PATROLS' request, PR §7.6, OD-PR-26); it is free on master and outside both the escalation hint and the revanchism wound set;",
          "| `riders_quartered` (THE PATROLS' request, PR §7.6, OD-PR-26) is a closed kind of shape 3, the fealty record — the PRECEDENCE FRICTION's row with ONE resentment patch (the crown's sweep of a lord's roads unasked, once a season; the crown's direct summons riding past a lord, once per call — §4.7 F.6 (b)), never a weave incident; it is free on master and outside both the escalation hint and the revanchism wound set; `riders_lent`, a peacetime lend to the banner, is the wear registered in §15.9's closed incident list in PL's own commit — free on master (0 · 0) and matched by none of `ESCALATION_HINT`, `DEESCALATION_HINT` and `WOUND_TYPE_RE` (executed, `cure/D-PL-r4-probe/measure.out`);")]
_S[611]=[("(round 4 adds THE SITES' second den closing `protection_kept`, THE BODIES' `peace_unkept` and harbouring under `body:`; the banner's cover outcome and the lender's credit are OBLIGATION's)",
          "(THE SITES' second den closing `protection_kept`, THE BODIES' `peace_unkept` and harbouring under `body:` among them; the banner's cover outcome and the lender's credit are OBLIGATION's)"),
         ("(§5.6) — RULINGS-ROUND3 A.5 executed; the two occasions A.5 did not name (the arbitration's price, the break's carrier) and the freshness clause are the lane's, vetoable (§8, §5.6, §10, P41, P46) |",
          "(§5.6); the two further occasions (the arbitration's price, the break's carrier) and the freshness clause are readings by delegation, vetoable (§8, §5.6, §10, P41, P46) |")]
_S[612]=[("(on the liege's inputs as they stand that week — RULINGS-ROUND6 B.4, OD-PL-55) — RULINGS-ROUND3 A.6 executed; the siege arm's adoption of the two facts is the lane's, so that one record word keeps one meaning, vetoable (§4.3, §3.5, PL8, P9, P10, P42, P45) |",
          "(on the liege's inputs as they stand that week, OD-PL-55); an incursion's outcome reads by the crossing as it RESOLVED — fought and lost: failed, \"sent, but too few\" said only there; never fought (`unopposed`): by its harm after EITHER answer (OD-PL-54); THE SITES' den writes BOTH outcomes (the clock run out with the den holding, answered and repelled or never answered; no row for a den that ends by its own course); the banner's cover of a levied member is a third protection occasion (§4.7 F.4); one outcome per edge per episode; what moves what is written once at §4.9; the siege arm's adoption of the two facts is a reading by delegation, so that one record word keeps one meaning, vetoable (§4.3, §3.5, PL8, P9, P10, P42, P45) |")]
_S[613]=[("(§4.3 (3)) — RULINGS-ROUND4 A.1 executed |","(§4.3 (3)) |")]
_S[614]=[("(§4.3 (2), §7's input lines) — RULINGS-ROUND4 A.2 executed; the mirror and the tie rule are the lane's, vetoable; ROUND 5: once minted,","(§4.3 (2), §7's input lines); the mirror and the tie rule are a reading by delegation, vetoable; once minted,"),
         ("— an incursion's at first sight on the liege's inputs as they stand (RULINGS-ROUND6 B.4); `reliefAnswerOf` reads belief and the tick's snapshot, so its four callers agree |",
          "— an incursion's at first sight on the liege's inputs as they stand; `reliefAnswerOf` reads belief and the tick's snapshot, so its four callers agree; the no-row cases are a reading by delegation, vetoable |")]
_S[615]=[("| THE BANNER (the owner's ~19:2x word) |","| THE BANNER (the owner's word) |"),
         ("ONE share law (`crownReachAt`'s `share01`; the net PR's composition × the crown's own `hold01`);",
          "ONE share law (`crownReachAt`'s `share01` per rung — a member's own band share toward its immediate liege, never the crown's own share — F.2's lend `max(1, floor(n × s × hold01))` above the home's minimum, a sub-vassal lending through its liege's line, the crown's own `hold01` entering once; the net PR's composition);"),
         ("on its own belief (§3.1 (e), (f));","on its own belief (§3.1 (e), (f)); F.1 never skipping a lord's ROW, with the direct summons under `unbroken` (§4.1 (i)(ii));"),
         ("none → `protection_failed`, on the summons' episode;","none → `protection_failed`, on the summons' episode, read from PR's season ledger `weeksCovered` at the season's end;"),
         ("(§4.7) — RULINGS-ROUND3 §F executed for PL; the occasion's reading as the summons, the no-occasion-below-`staunch` rule, the yearly credit and \"riders\" for §F.7's \"wardens\" are the lane's, vetoable |",
          "(§4.7); the occasion's reading as the summons, the no-occasion-below-`staunch` rule, the yearly credit and \"riders\" where THE BANNER's ruling said \"wardens\" are readings by delegation, vetoable |")]
_S[616]=[("(§4.8, §3.2) — THE BODIES' three routes executed; \"priced only under an ORDER\" is the lane's (a lawful liege's default `hunted` would price every tolerant member by default), vetoable; ROUND 5 — THE CROWN'S FAITH (§4.8 (4)):",
          "(§4.8, §3.2); \"priced only under an ORDER\" is a reading by delegation (a lawful liege's default `hunted` would price every tolerant member by default), vetoable; THE CROWN'S FAITH (§4.8 (4)):"),
         ("PL writing no row — L-BD 23b's four items executed; the per-edge liege's creed, the endowment rule, the active-stance mirror, the `staunch` bound and the inside-sponsor case are the lane's, vetoable |",
          "PL writing no row; the per-edge liege's creed, the endowment rule, the active-stance mirror, the `staunch` bound and the inside-sponsor case are readings by delegation, vetoable |")]
_S[617]=[("(§3.5, P52) — CHAIR-NOTES 17 (b)'s PL half |","(§3.5, P52; `oathSince` declared in OD-PL-34) |")]
_S[618]=[("— the target of RULINGS-ROUND3 §E.2's, the fold's and THE BODIES' \"PL §4.9\" citations, the lane's, vetoable |","— the target of the fold's and THE BODIES' \"PL §4.9\" citations, a reading by delegation, vetoable |")]
_S[619]=[("| ⚑ OWNER-VISIBLE — two declared persisted fields (P5) |","| ⚑ OWNER-VISIBLE — two declared persisted fields |"),
         ("declared by delegation under RULINGS-P5 C.20 (\"the owner's shape, visible\"), each vetoable by one clause; for the ODQ §934.93 P5 addendum's visible rows |",
          "declared by delegation (\"the owner's shape, visible\"), each vetoable by one clause; among the visible rows of ODQ §934.93's addendum |")]
_S[620]=[("| The P5 completeness cures (RULINGS-P5 C.1 · C.3 · C.12 · C.15 · C.17 · C.20 · C.24) |","| The completeness cures |"),
         ("(§4.7 F.6 (b) (iii)) — C.17's \"§15.9's closed list\" read against A.8's re-homing;","(§4.7 F.6 (b) (iii)), a fealty-record row, never a weave incident;")]
_EXTRA={564:" · THE OWNER'S ROW", 571:" · the OWNER's veto (VISIBLE)", 572:"; the depth pass the OWNER's call", 584:"; the default preset's lighting the OWNER's",
        592:"; the host state's sign-off and `hostage_exchange` the OWNER's", 596:"; the identity question the OWNER's", 619:" · the OWNER's shape (VISIBLE)"}
_STAR={564,571,619}
for _n in range(560,621):
    ROW(_n,_S.get(_n,()),_EXTRA.get(_n,''),_n in _STAR)
# ledger notes for the non-stamp brackets of §12
for _i in (361,362,364,365,367,370,373,374,375,376):
    NOTE[_i]="a review-id or mark note on the ruling row (finding ids / bare REFINED); the row states the final ruling; the ids stay in the text of record"
NOTE[363]="a change note (the sphere and the ceiling replaced); the row states the share in every class"
NOTE[366]="folded into OD-PL-7 (the weights through `vassalageSeatsOf`; the book follows `polityOf`'s liege)"
NOTE[371]="a change note (the map program's political regions struck); the row states genesis and the DM's verbs only"
NOTE[379]="folded into OD-PL-29 (the intervener never reads a third pair's resentment); the struck `≥ DRAFT 0.5` threshold not restated (one DRAFT word fewer, explained in §5)"
NOTE[380]="folded into OD-PL-29 as the landed evidence (`FRIENDLY_REL`) for the exclusion of the liege's chain"
NOTE[382]="folded into OD-PL-33 with its two nested brackets: H13's held sites are THE SITES' record, reported as ST's readiness word; `readiness01`, `full · … · empty` and `STRENGTH_BANDS` kept as \"never\" statements; routing ids, the review receipt and the ST line check removed"
NOTE[383]="folded into OD-PL-34 (`peace_unkept`, the `body:` and `riders_lent:` forms; `liegeAnswer` PS's)"
NOTE[384]="folded into OD-PL-34 (`oathSince`; `riders_quartered` a shape-3 kind; its episode form; the faith rows' kinds; `weeksCovered` PR's)"
NOTE[385]="folded into OD-PL-34 (`truce?`; the `ask:` and garrison episode forms; two OWNER-VISIBLE fields, OD-PL-60)"
NOTE[387]="a change note (the stale singular); OD-PL-35's base text corrected to TWO `auto` rows as B388 rules"
NOTE[388]="folded into OD-PL-35 (two `auto` rows — the sealed minor, the default a major; the state pass; the shared channel and its host flag)"
NOTE[394]="folded into OD-PL-40 (the windows written as the landed `INTERVAL_WEEKS` keys)"
NOTE[396]="folded into OD-PL-41 (`polityContestEnabled` needs `polityHoldEnabled`; the flagless shared channel)"
NOTE[397]="folded into OD-PL-41 (no flag for the fealty record; one owner flag per family)"
NOTE[399]="folded into OD-PL-42 (the export an additive offer, never a supersession); the fold's rows restated without \"the chair\""
NOTE[402]="folded into OD-PL-44 (RN cites it; the hold term reads belief)"
NOTE[404]="folded into OD-PL-46 (`body:`'s key and occasions)"
NOTE[405]="folded into OD-PL-46 (`patrol:` and `corps:` in the list; the one ban grammar)"
NOTE[407]="folded into OD-PL-46 (the internal append never a door; no `riders:` prefix; `army:`/`column:` PS's stable unit key)"
NOTE[410]="folded into OD-PL-48 (the `unitKey` PS's stable unit id)"
NOTE[411]="folded into OD-PL-48 (the share on FIELD FORCE in the defender's size; the first-sight answer before the contest in every arm); the ruling tag removed"
NOTE[412]="folded into OD-PL-48 (both sides FIELD FORCE; the threshold; the default and the mint at the week; one line per liege per unit; the harm rule)"
DR[413]=(414,"WITHDRAWN for the incursion by B414's re-ruling (the belief condition and its no-row case bind siege relief only); not restated")
NOTE[414]="a re-ruling folded into OD-PL-48: \"at first sight\" is the first week the unit is witnessed, on the liege's inputs as they stand; the per-reliever window binds siege relief only"
NOTE[420]="folded into OD-PL-51 (`riders_lent`, wear, free on master and matched by no hint or wound regex, executed)"
NOTE[421]="folded into OD-PL-51: `riders_quartered` is a shape-3 kind (the precedence friction's row), never a weave incident — the latest bracket on the row settles the conflict seat 1 flagged (§4.6 homes it in the fealty record); `riders_lent` stays wear in §15.9"
NOTE[427]="folded into OD-PL-53 with its nested re-ruling and stamp: an incursion's outcome by the crossing as it resolved; the den's two outcomes; the banner's cover a third occasion; one outcome per edge per episode"
NOTE[429]="a re-ruling folded: A.6's `kept` clause withdrawn — OD-PL-54 states the harm rule AFTER EITHER ANSWER; the closed STOP's label not restated"
NOTE[433]="folded into OD-PL-55 (\"the no-row cases are a reading by delegation, vetoable\"); the incursion's belief rule it names is withdrawn by the r6 re-ruling (OD-PL-48), so only the no-row cases are restated"
NOTE[434]="folded into OD-PL-56: F.1 (the direct summons), F.2's lend with `s` the member's own band toward its immediate liege (\"`crownReachAt`'s `share01` per rung … never the crown's own share\" — the row's own latest bracket, read with §4.7 F.2, settles the conflict seat 1 flagged), F.4 read from `weeksCovered`"
NOTE[437]="a review-id note (lane log and ruling tag); the row states THE CROWN'S FAITH and A FOREIGN HAND"
NOTE[439]="folded into OD-PL-58 (`oathSince` declared in OD-PL-34); the struck \"evicted reads 1\" not restated"
````

### `d13.py`

````python
# §13 WHAT A DM READS (old lines 624-649) — seat 2
NOTE[444]="a change note (the Evidence Law's \"name who\": the besieger named); the sentence names Brenmoor's host"
NOTE[445]="a change note (\"sent, but too few\" the receipt); the line states where it is said"
NOTE[446]="a change note (\"sent, but too few\" reserved for a fought and lost contest); the line says ONLY of a fought and lost contest"
X[453]=(" (it fires only when the riders ARE the crown's own and the need was Ashford's to meet, so \"the crown's riders\" and \"unbidden\" are both true; "
 "a fellow member's riders by right write no line)")
NOTE[453]="folded as the sentence's condition (the crown's own riders, Ashford's need; a fellow member's riders by right write no line); the ruling and finding tags removed"
````

### `d14.py`

````python
# §14 CONVERSION (old lines 650-677) — seat 2
X[456]=" No culture writer is minted."
NOTE[456]="folded (no culture writer is minted); the research id removed"
X[457]=" (scaled by the LINK, not the crown's hold)"
_t=AFTER(459,'"sampled once per year … slow by construction" is struck — ')
X[459]=' '+CAP(_t)
NOTE[459]="folded as the reason the liege is read every tick (the measured `neighbourEndorsement` and `LAG`); the struck yearly-sample wording not restated"
NOTE[461]="a change note (two faith carriers → three; 3a CH's); the paragraph states THREE"
_t=AFTER(462,'SEAMS-r1-24: ')
X[462]=' '+_t
NOTE[462]="folded (`clergyDrag` and `chronicleMomentum` are no seat for a paragon); the seam id removed"
````

### `d15.py`

````python
# §15 CONTROL AND COUNTERFORCES (old lines 678-704) — seat 2
NOTE[465]="a research-id note (R4-4); the cell states the recognition act"
SUBS+=[(687,"The zeroed `kinship` motive carries shared faith/culture (R4-10, OD-PL-30)","The zeroed `kinship` motive carries shared faith/culture (OD-PL-30)"),
       (687,"never the liege or a lord on the member's own chain (R4-11, OD-PL-29, PL-r1-27; `convergence.js` 764 → a leaf call)","never the liege or a lord on the member's own chain (OD-PL-29; `convergence.js` 764 → a leaf call)")]
_t=AFTER(467,'"the intervener decides on ITS OWN belief of the third pair"): ')
_t=SUB1(_t,'"strained" was the member↔liege RESENTMENT, a third pair\'s state that PL16 makes public to no one and the belief map cannot hold (`beliefMap.js` keeps observer↔subject labels only). The intervener now decides on what it can know of that pair, the PUBLIC record by name',
 '"Strained" is never the member↔liege RESENTMENT, a third pair\'s state that PL16 makes public to no one and the belief map cannot hold (`beliefMap.js` keeps observer↔subject labels only): the intervener decides on ITS OWN belief of the third pair, on what it can know of that pair, the PUBLIC record by name')
X[467]='\x00. '+CAP(_t)
NOTE[467]="folded (strained read on the PUBLIC record by name — the landed rebellion stressor or a standing `fealty_break`; never the stored resentment or the fealty record; the MARCH stays war-gated); the finding and ruling ids removed"
NOTE[468]="a research-id note (R4-7)"
NOTE[469]="a research-id note (R4-8)"
NOTE[470]="a change note (the hearing had no producer); the cell names `APPOINT_TO_SEAT` as the producer and the verdict channel as the road"
SUBS+=[(691,"held by the crown's garrison; the chair's 10-18 ruling moved the slot from WC's inbox)","held by the crown's garrison; the slot moved from WC's inbox)")]
# 15.9 Wear: B474 (r2, the measurement kept; the registration of riders_quartered superseded), B475 (r4, riders_lent), B476 (r5, the re-homing), B477 (P5, the garrison arm)
X[474]=(" THE BANNER's peacetime lend adds `riders_lent` — a member's riders composed by the crown's net onto another member's roads in a season of peace (§4.7 F.6 (c)) — "
 "so the closed list PL registers in its own commit into `MEMORY_WEAVE_INCIDENT_TYPES` — the landed frozen `relationshipEvolution.js :: MEMORY_WEAVE_INCIDENT_TYPES`, today `route_seized · rite_imposed · elite_feud · elite_amity` — "
 "is `recognition_withheld · appointment_imposed · faction_backed · charter_granted · riders_lent`. `riders_lent` is free on master (0 src · 0 tests); executed, it matches none of "
 "`ESCALATION_HINT`, `DEESCALATION_HINT` and `WOUND_TYPE_RE` (`cure/D-PL-r4-probe/measure.out`), so a lend is wear, not a wound and not an escalation — \"a crown that calls riders from every member in peace pays in resentment across the chain\"; "
 "in war a lend wears nothing (it is service, §4.7 F.6 (a)). `riders_quartered` (THE PATROLS' request, PR §7.6, OD-PR-26) is no weave incident: it is the precedence friction's ROW in shape 3 (§4.6) "
 "carrying its resentment patch (§4.7 F.6 (b)), so it is priced where the weave is dark and never twice where it is lit, and THE SITES' crown-garrison resentment (ST12, ST §4.4) is priced by that row's "
 "garrison arm (§4.7 F.6 (b) (iii)), never as wear here — one path. `riders_quartered` is free on master (0 src · 0 tests). Executed (`cure/D-PL-r2b-probe/regex.out`): it is matched neither by "
 "`ESCALATION_HINT` nor by the revanchism wound set, `grievanceRead.js :: WOUND_TYPE_RE` (`/war|betray|tribute|conquest|occupation|sack|raid|seiz|impos|contest_loss|contest_forestalled/i`). "
 "Measured beside it: `appointment_imposed` DOES match the wound set (`impos`). That is the landed set's stated intent (\"any future imposition/seizure incident\"): an imposed appointment is a wound "
 "that deepens the member's revanchism toward its liege where the weave and the revanchism read are lit. Stated, not changed.")
NOTE[474]="folded with B475–B477 as one statement of 15.9's closed list: its executed measurement (`riders_quartered` free and unmatched; `appointment_imposed` a wound, stated) KEPT; its registration of `riders_quartered` in the weave list SUPERSEDED by B476 (the list token with `riders_quartered` is in ALLOW-MISSING)"
X[475]=''
NOTE[475]="folded into the 15.9 statement (`riders_lent` registered as wear; its executed measurement; war lends wear nothing); its interim list (with `riders_quartered`) superseded by B476 (ALLOW-MISSING)"
X[476]=''
NOTE[476]="folded into the 15.9 statement: `riders_quartered` is the precedence friction's shape-3 row, never wear; the final list `… · riders_lent`; the routing of PR's cites removed"
X[477]=''
NOTE[477]="folded into the 15.9 statement (the garrison resentment priced by `riders_quartered`'s row, never as wear)"
# 15.12 Patrols considered: B478 (r2 REFINED) with five nested markers; B479 change notes
_t=AFTER(478,'items 5, 7, 12, 13, 15 and 18): ')
_t=SUB1(_t,'PL mints nothing for patrols and reads them only through the one reads.','PL mints nothing for patrols (THE PATROLS, `docs/DESIGN_FP_ARCH_PR.md`) and reads them only through the one reads.')
_t=SUB1(_t,"the raider row's counterforce (item 5)","the raider row's counterforce (THE PATROLS, item 5)")
_t=SUB1(_t,"a town's first belief of a war's shape (item 13)","a town's first belief of a war's shape (THE PATROLS, item 13)")
_t=SUB1(_t,"PR's law (item 15), never PL's","PR's law (THE PATROLS, item 15), never PL's")
_t=SUB1(_t,"(the brief's \"firm+\", in PL's hold words)","(THE PATROLS' \"firm+\", in PL's hold words)")
_t=CUT(_t,' [CURED 2026-10-19 (fp-final r5) — A.8:')
_t=SUB1(_t,"— so no second condition exists; PR's `staunch` threshold stays PR's.","— so no second condition exists (no `crownReachAt(…).share01 > 0` test); PR's `staunch` threshold stays PR's.")
_t=CUT(_t,' [CURED 2026-10-18 (fp-final r3) — two PL-r2-verify minors:')
_t=CUT(_t,' [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND3 §F.3 · SEAMS-r3-6:')
_t=SUB1(_t,"PL §4.5's charter carries tolls only, so no charter carries a patrol (the brief's \"by the polity-wide passage charter\" is routed to the chair, `cure/D-PL-r2.md` §5).",
 "PL §4.5's charter carries tolls only (its `toll_exemption`), so no charter carries a patrol.")
_t=SUB1(_t,"as the fold's map-side INBOX (h) ↳ and PR14 / OD-PR-36 name them.","as the fold's map-side INBOX (h) and PR14 / OD-PR-36 name them.")
_t=CUT(_t,' [CURED 2026-10-18 (fp-final r3) — the PL-r2-verify minor ("like every other host fact"')
X[478]=' '+_t
NOTE[478]="folded as 15.12's body (PL mints nothing; the crown's riders priced as the friction ROW; the root's read; the sub-vassal reach never zero; the banner's right and THE PASSAGE's ladder; tolls only; the host's three channels); its five nested markers removed — the r3 struck sub-vassal condition kept as \"no `crownReachAt(…).share01 > 0` test\"; the brief's charter phrase and its routing removed (the charter's toll right named `toll_exemption`); the ruling-file and brief-item tags restated as THE PATROLS' items"
X[479]=" The crown's riders are never \"wardens\": `warden` is a landed role label, CH's display noun, EC's `route_wardenship` and the map's \"wardens' terms\"."
NOTE[479]="folded (the crown's riders never \"wardens\" — the homonym's four senses); the other change notes (no second summons kind; H16 inbound; the routing to PR) dropped as stated elsewhere (§4.1, OD-PL-50, the paragraph above)"
````

### `d16.py`

````python
# old §16 THE CURE RECORD (old lines 705-967) — MOVED verbatim to history/PL-cure-record.md (Part 2); the new §16 is THE REVIEW TRAIL (one line) — seat 2
LINE[705]="## §16 THE REVIEW TRAIL"
LINE[706]=""
LINE[707]=("Reviewed in the first cure (the SPL and SX ids), in rounds r1, r2, r2b, r3, r4, r5 and r6 and in P5 (the kit's `skeptic/` and `cure/`), then by the seams seats and the fold; "
 "the bracketed text of record is `1beabdc85`; the cure record (the old compile header and status block, the round blocks, their findings and dispositions, the STOPs and their rulings, the refinements) is `history/PL-cure-record.md`.")
for _n in range(708,968): LINE[_n]=None
# THE OPEN STOPS line after the rulings table (CONSOLIDATE §2 item 8; CH's form)
INSERT_AFTER[620]=("\nTHE OPEN STOPS: none. Every STOP raised in review — the member wars on a suspended link (§5.5, the ruled path (A′)) and the DM's kill/assign (§5.6) among them — "
 "was ruled before the text of record, each ruling folded above; the one STOP this consolidation raised, on the word \"passage\", is ruled and applied (§3.4, §4.5).")
````

### `d17.py`

````python
# THE CHAIR'S RULING ON ⛔ STOP PL-C-1 (2026-10-23, by delegation, vetoable) — applied by seat 2, including in seat 1's sections.
# In PL the bare word "passage" carries THE PASSAGE's meaning (the later P5 class `passage_of_arms`, B068 · B093 · B100; the fold §5 register);
# the charter's toll right is always named by its registered term `toll_exemption` (the fold §3.1.1). B099 folded into that sentence; every STOP mark removed.
X[99]=(None,'colon',[('"passage" is THE PASSAGE','"Passage" is THE PASSAGE'),
                     ("(`DESIGN_FP_ARCH_PS.md`, the owner's word of 10-18)","(`DESIGN_FP_ARCH_PS.md`, the owner's word)"),
                     ('in PL, "passage" names only the charter\'s toll right (PL8, §4.5)','in PL the bare word "passage" carries THE PASSAGE\'s meaning, and the charter\'s toll right is always named by its registered term `toll_exemption` (PL8, §4.5)'),
                     ("; the fold §5 register row is the chair's","; the fold §5 registers the homonym")],' — ')
NOTE[99]=("FOLDED per the chair's ruling of PL-C-1 (2026-10-23): B099's \"in PL, 'passage' names only the charter's toll right\" is superseded by the later P5 class `passage_of_arms` (B068 · B093 · B100; the fold §5 register's P5 row), "
 "which uses the word in THE PASSAGE's meaning — folded as \"in PL the bare word 'passage' carries THE PASSAGE's meaning, and the charter's toll right is always named by its registered term `toll_exemption`\"; the ⛔ STOP PL-C-1 mark removed")
NOTE[138]=("FOLDED per the chair's ruling of PL-C-1 (2026-10-23): the passage of arms is THE PASSAGE's; the suspended link reads `rival` for passage (the bare word in THE PASSAGE's meaning, as ruled); "
 "\"the chair's at P4\" → the fold holds the coupling row; the CHARTER's toll right in the same paragraph is named `toll_exemption`")
SUBS+=[(90,"Down: PROTECTION, ARBITRATION, PASSAGE.","Down: PROTECTION, ARBITRATION, the TOLL EXEMPTION (`toll_exemption`)."),
       (250,"**4.5 Passage.** Passage is a CHARTER TERM:","**4.5 The toll exemption and passage.** The toll exemption (`toll_exemption`) is a CHARTER TERM:"),
       (250,"the CHARTER's passage is tolls only.","the CHARTER's `toll_exemption` is tolls only."),
       (391,"charters, passage, the common-liege mediator rule","charters, the toll exemption (`toll_exemption`), the common-liege mediator rule"),
       (442,"passage through EC-6's executor.","the toll exemption (`toll_exemption`) through EC-6's executor.")]
````

### `d18.py`

````python
# ledger notes only (seat 2): marker rows outside brackets in §7..§15 whose default note would mislead
NOTE[250]="a REFINED mark (vetoable) on the two occasions placed by the families' rule — kept inline as \"a reading by delegation, vetoable\"; the ruling tag (A.5) removed"
ARROW_FOLD[477]="the ↳ row label of the lifecycle table (a sub-row for shape 3's summary field) restated as the row's own label \"shape 3's summary field `oathSince`\"; its lifecycle cell unchanged"
ARROW_FOLD[478]="the ↳ row label of the lifecycle table (a sub-row for shape 2's fallback field) restated as the row's own label \"shape 2's field `truce?`\"; \"the chair rules (B) in\" → \"(B) is ruled in\""
MARK_NOTE[('S',419)]="the STOP label removed (\"STOP-2's ruling\" → §5.6, where its ruling stands as THE DM'S KILL/ASSIGN); \"§5.6's P5 bracket\" → §5.6"
MARK_NOTE[('S',544)]="the STOP label removed from P53's title (\"STOP-PR-r4-1 as re-ruled\"); the row states the re-ruled direct summons"
MARK_NOTE[('S',548)]="the STOP label removed (\"STOP-2's accepted gap\" → \"§5.6's accepted gap\")"
````

### `cure_record.py`

````python
# writes KIT/history/PL-cure-record.md: Part 1 = old lines 3-9 verbatim, Part 2 = old §16 THE CURE RECORD (old lines 705-967) verbatim
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PL-bracketed-1beabdc85.md'
L=open(OLD,encoding='utf-8').read().split('\n')
p1=L[2:9]; p2=L[704:967]
out=["# PL — THE CURE RECORD AND THE COMPILE HEADER, moved verbatim from `docs/DESIGN_FP_ARCH_PL.md` at `1beabdc85` by the consolidation pass (P8, lane C-PL, 2026-10-23)",
"",
"Part 1 is the old compile header and status block (old lines 3–9); Part 2 is the old §16 THE CURE RECORD (old lines 705–967). Both are byte-identical to the text of record (`history/PL-bracketed-1beabdc85.md`); the consolidated volume carries the design, this file carries the trail.",
"",
"## PART 1 — the old compile header and status block (old lines 3–9)",
""]+p1+["","## PART 2 — the old §16 THE CURE RECORD (old lines 705–967)",""]+p2
open('/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PL-cure-record.md','w',encoding='utf-8').write('\n'.join(out)+'\n')
# verify verbatim
t=open('/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PL-cure-record.md',encoding='utf-8').read()
assert '\n'.join(p1) in t and '\n'.join(p2) in t
print('cure record written', len(t.encode()), 'bytes; part1', len(p1), 'lines; part2', len(p2), 'lines')
````

### `missing_where.py`

````python
import re,json,bisect,sys
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PL-bracketed-1beabdc85.md'
s=open(OLD,encoding='utf-8').read(); new=open('body_new.md',encoding='utf-8').read()
BR=json.load(open('brackets.json'))
offs=[0]
for l in s.split('\n'): offs.append(offs[-1]+len(l)+1)
def lineof(p): return bisect.bisect_right(offs,p)
def tokens(x): return set(t for t in re.findall(r'`([^`\n]{1,200})`', x) if not t.startswith(' '))
allow=set(l.rstrip('\n') for l in open('../kit/consolidate/PL-allow.txt',encoding='utf-8') if l.strip() and not l.startswith('#'))
miss=sorted(t for t in tokens(s)-tokens(new) if t not in allow)
def brof(p):
    for b in BR:
        if b['start']<=p<b['end']: return b['i']
    return None
for t in miss:
    locs=[]
    for m in re.finditer(re.escape('`'+t+'`'),s):
        n=lineof(m.start()); locs.append('L%d%s'%(n,'' if brof(m.start()) is None else '/B%d'%brof(m.start())))
    print(repr(t)[:70], locs[:6])
# counts
for name,pat in [('OD',r'\bOD-[A-Z]{2,4}-\d{1,3}\b'),('wave',r'\b[A-Z]{2,4}-\d{1,2}\b(?= [—–-] )'),('flags',r'\b[a-z][A-Za-z]+Enabled\b')]:
    a=set(re.findall(pat,s,flags=re.M)); b=set(re.findall(pat,new,flags=re.M))
    print(name,'missing',sorted(a-b), [ [lineof(m.start()) for m in re.finditer(re.escape(x),s)][:5] for x in sorted(a-b)])
````

### `xref.py`

````python
import re
t=open('body_new.md',encoding='utf-8').read()
lines=t.split('\n')
defined=set()
for l in lines:
    m=re.match(r'^#{2,3} §(\d+)\b',l)
    if m: defined.add(m.group(1))
    for m in re.finditer(r'\*\*(\d+\.\d+[a-z]?)\b',l): defined.add(m.group(1))
    m=re.match(r'^#{2,4} (\d+\.\d+)\b',l)
    if m: defined.add(m.group(1))
    for m in re.finditer(r'^\| \*\*(\d+\.\d+)',l): defined.add(m.group(1))
print('defined', sorted(defined, key=lambda x:[int(p) if p.isdigit() else p for p in re.split(r'[.]',x)]))
bad={}
for i,l in enumerate(lines,1):
    for m in re.finditer(r'(?<![A-Za-z0-9-])(?:([A-Z][A-Za-z-]{1,12}|the fold|fold|ODQ|SPINE|CN|spine|ODQ)\s)?§(\d+(?:\.\d+)?[a-z]?)',l):
        vol=m.group(1); num=m.group(2)
        pre=l[max(0,m.start()-25):m.start()]
        if vol or re.search(r"(fold|ODQ|SPINE|spine|CN|[A-Z]{2,5}'s|[A-Z]{2,5}|volume's|`[^`]*\.md`|brief)\s*$",pre): continue
        base=num.split('.')[0]
        if num not in defined and base not in defined or ('.' in num and num not in defined):
            bad.setdefault(num,[]).append((i,l[max(0,m.start()-50):m.end()+10]))
for k,v in sorted(bad.items()):
    print(k, len(v), v[:3])
````

### `patch_render2.py`

````python
# seat 2's patch of render.py: the ledger for the whole volume (both seats complete), PL-C-1 ruled, the cure record moved
p='render.py'; s=open(p,encoding='utf-8').read()
def R(a,b):
    global s
    assert s.count(a)==1,(a[:90],s.count(a)); s=s.replace(a,b)
def RB(start,end,new):
    # replace from the line starting with `start` through the line starting with `end` (inclusive)
    global s
    i=s.index(start); j=s.index(end,i); j=s.index('\n',j)+1; s=s[:i]+new+s[j:]
R('sections=["header","THE OWNER\'S WORDS · THE ANSWER","§0","§1","§2","§3","§4","§5","§6"]',
  'sections=["header","THE OWNER\'S WORDS · THE ANSWER","§0","§1","§2","§3","§4","§5","§6","§7","§8","§9","§10","§11","§12","§13","§14","§15","§16"]')
R("""def tally(s):
    t=Counter(r[3] for r in rows if (r[4]==s or (r[4] in ('history','—') and s=='header' and r[3]=='MOVED') or (r[3]=='DROPPED' and s=='§3' and 179<=r[1]<=239)) and r[3]!='PENDING')
    return t""",
"""def secof(r):
    if r[3]=='MOVED': return 'header' if r[1]<705 else '§16'
    if r[3]=='DROPPED': return '§3' if 179<=r[1]<=239 else ('§12' if 556<=r[1]<=623 else '?')
    return r[4]
def tally(s):
    return Counter(r[3] for r in rows if secof(r)==s and r[3]!='PENDING')""")
R('out.append("# PL — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8, lane C-PL; seat 1 of 2, 2026-10-23) — SEAT 1 COMPLETE FOR header..§6 (old lines 1–357); SEAT 2 STARTS AT `## §7 THE HEARINGS` (old line 358)")',
  'out.append("# PL — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8, lane C-PL; seats 1 and 2 of 2, 2026-10-23) — COMPLETE: header..§16 (old lines 1–967); the volume replaced")')
R("Seat 1's range is complete; seat 2 starts at `## §7 THE HEARINGS` (old line 358) and runs to the end.\")",
  "Seat 1's range is complete; seat 2 starts at `## §7 THE HEARINGS` (old line 358) and runs to the end. SEAT 2 (a cloud seat, after a usage-window pause and resume) built §7..§16 (old lines 358–967) with the same scripts (`cpl2/` plus `d08.py`–`d18.py`, `cure_record.py`, a `MARK_NOTE` hook in `build.py` and `ledger.py`, and the cure-record rows MOVED in `ledger.py`), wrote `history/PL-cure-record.md` (Part 1 = old lines 3–9, Part 2 = old §16, both verbatim, asserted), applied the chair's ruling on ⛔ STOP PL-C-1 in both seats' sections (`d17.py` and `head.py`), and confirmed by rebuild that seat 1's sections differ from seat 1's `PL-new.md` ONLY by that ruling (THE READER'S GUIDE item 8, PL8, §3.4's `armyTransitKernel.js` cell, §4.5). The finished text is `consolidate/PL-new.md`, copied once over `docs/DESIGN_FP_ARCH_PL.md`.\")")
R("""· PENDING %d** (PENDING = old §7..§16, seat 2's range)."%(len(rows),c['FOLDED'],c['DROPPED'],c['MOVED'],c['KEPT'],c['PENDING']))""",
  """· PENDING %d**."%(len(rows),c['FOLDED'],c['DROPPED'],c['MOVED'],c['KEPT'],c['PENDING']))""")
R("""    t=tally(s); st='1 (PL-C-1)' if s=='§3' else '0'""","""    t=tally(s); st={'header':'PL-C-1 (ruled; READER\\'S GUIDE 8)','§1':'PL-C-1 (ruled; PL8)','§3':'PL-C-1 (raised; ruled)','§4':'PL-C-1 (ruled; §4.5)','§8':'PL-C-1 (ruled; flags row)','§9':'PL-C-1 (ruled; PL-5)'}.get(s,'0')""")
R("""out.append("| §7..§16 (PENDING, seat 2) | — | — | — | — | — |")\n""","")
RB('out.append("STOPs of this pass: **⛔ STOP PL-C-1** (one).','out.append("STOPs of this pass: **⛔ STOP PL-C-1** (one).',
 '''out.append("STOPs of this pass: **⛔ STOP PL-C-1** (one, raised by seat 1) — RULED by the chair on 2026-10-23 (by delegation, vetoable) and APPLIED by seat 2. The word \\"passage\\": B099 (the `armyTransitKernel.js` row of §3.4) said \\"in PL, \\\\\\"passage\\\\\\" names only the charter's toll right (PL8, §4.5)\\", while the later P5 class `passage_of_arms` (B068, B093, B100; the fold §5 register's P5 row) uses the word in THE PASSAGE's meaning (PS14). THE RULING: the latest wins and the fold §5 is the vocabulary law — in PL the bare word \\"passage\\" carries THE PASSAGE's meaning; the charter's toll right is always named by its registered term `toll_exemption` (the fold §3.1.1), never by the bare word. APPLIED: B099 folded into that sentence (§3.4's cell); every `⛔ STOP PL-C-1` mark removed (§3.4's cell, THE READER'S GUIDE item 8 — now \\"in PL the bare word carries THE PASSAGE's meaning … the charter's toll right is always named by its registered term `toll_exemption`\\"); the charter's toll right renamed wherever PL named it with the bare word: PL8's down-obligations (\\"PASSAGE\\" → \\"the TOLL EXEMPTION (`toll_exemption`)\\"), §4.5 (title \\"Passage\\" → \\"The toll exemption and passage\\"; \\"Passage is a CHARTER TERM\\" → \\"The toll exemption (`toll_exemption`) is a CHARTER TERM\\"; \\"the CHARTER's passage is tolls only\\" → \\"the CHARTER's `toll_exemption` is tolls only\\"), §8's `polityObligationsEnabled` row and PL-5 (\\"passage\\" → \\"the toll exemption (`toll_exemption`)\\"), and §15.12 (\\"PL §4.5's charter carries tolls only (its `toll_exemption`)\\"); every other bare \\"passage\\" (PL7, §2's register, §3.2's class row, §4.5's passage of ARMS and B138's `rival` \\"for passage\\", §4.6, §5.3, P40, P56) already carries THE PASSAGE's meaning and stands. Rows B099 and B138: \\"FOLDED per the chair's ruling of PL-C-1 (2026-10-23)\\". No OD row added: the ruling lives here and in the program's record. Seat 2 raised NO new STOP: the two conflicts seat 1 flagged for §12 are settled by their rows' OWN latest brackets — OD-PL-56's B434 (r5) gives F.2's lend `max(1, floor(n × s × hold01))` with \\"a sub-vassal lending through its liege's line\\", which §4.7 F.2 (B154, the same round) states as each member's own band toward its IMMEDIATE liege, \\"never computed at the crown's own share\\"; read per rung (the row's own \\"`crownReachAt` per rung\\"), `crownReachAt(liege, m).share01` IS that band share, so the row now reads \\"`crownReachAt`'s `share01` per rung — a member's own band share toward its immediate liege, never the crown's own share — F.2's lend …, the crown's own `hold01` entering once\\"; OD-PL-51's B421 (r5) RE-HOMES `riders_quartered` from §15.9's weave list to shape 3 (the precedence friction's row, one resentment patch) and keeps `riders_lent` as wear, so the row states that (as §4.6, F.6 (b), §15.9 and OD-PL-34 do). OD-PL-22/23's \\"RULED … by the chair\\" is restated in the house form (the Ruled column). Superseded brackets: B085 (seat 1; by B084) and B413 (seat 2; WITHDRAWN for the incursion by B414's re-ruling). The vetoable READINGS carried inline (each already vetoable in the old text): §0 the patron exclusion (B017); PL4's share map (⚑ OWNER-VISIBLE, OD-PL-12); §4's readings (seat 1's list in §3); §8's two family placements (B250); PL-8's every-settlement read (B275's nested REFINED); §12's readings by delegation (OD-PL-52, -53, -55, -56, -57, -59).")
''')
R('out.append("## 2. THE SECTION MAP (old → new; planned for the part seat 2 writes)")','out.append("## 2. THE SECTION MAP (old → new)")')
R("old lines 3–7 and 9 → `history/PL-cure-record.md` Part 1 (to be written by the seat that writes Part 2 — this seat owns no history file).",
  "old lines 3–9 → `history/PL-cure-record.md` Part 1, verbatim (written by seat 2 with Part 2).")
R("PLANNED for the next seat: old §16 THE CURE RECORD (lines 705–967) → `history/PL-cure-record.md` Part 2 verbatim; the new §16 is THE REVIEW TRAIL (one line).",
  "SEAT 2: old §7–§15 keep their numbers and titles (§4.5's bold title in seat 1's range becomes \\\"The toll exemption and passage\\\" under the PL-C-1 ruling); old §16 THE CURE RECORD (lines 705–967) → `history/PL-cure-record.md` Part 2, verbatim; the new §16 is THE REVIEW TRAIL (one line). Inside §7–§15: B218 → §7's opening WHERE sentence (with B217's \\\"relief is never a kind\\\" and B216's final names); B252 → §8's closing paragraph (the presets claim waits on the host-side check); B253 + B254 → §9's opening sentences; B257 → THE HOOKS PER HOST's opening; B282 + B283 → §10's opening statement; the two `↳` sub-rows of §10's table → rows with their own labels (`oathSince`, `truce?`); B301 → §10's closing paragraph; B308's closing sentence → §11's opening sentence; §12's table gains a fourth column **Ruled** (the row's date, its amendment dates read from its own brackets, \\\"by delegation · vetoable\\\", and the OWNER's part), ⭐ on OD-PL-5, OD-PL-12 and OD-PL-60 (the rows the old text marked THE OWNER'S ROW and ⚑ OWNER-VISIBLE) and the heading's \\\"⭐ marks the owner's own rows, each VISIBLE\\\"; B474–B477 → §15.9's one statement of the closed weave list; B478 → §15.12's body; B479 → §15.12's closing \\\"never wardens\\\" sentence.")
# §3 — seat 2's text corrections, appended after seat 1's list
R("""    out.append("- "+t)
out.append("")
out.append("## 4. ALLOW-MISSING""","""    out.append("- "+t)
out.append("")
out.append("SEAT 2 (§7..§16):")
for t in SEAT2_CORRECTIONS:
    out.append("- "+t)
out.append("")
out.append("## 4. ALLOW-MISSING""")
R("out=[]\n","""out=[]
SEAT2_CORRECTIONS=[
 "Ruling tags, finding ids and ruling-file cites removed from §7..§15's own sentences: \\"(STOP-2's ruling, §5.6)\\" and \\"(§5.6's P5 bracket)\\" → \\"(§5.6)\\" (§9); \\"(§15.2; P5C-15)\\", \\"(PL-r1-7)\\" removed (§9); \\"(RULINGS-ROUND6 B.4; B.11 binds the siege)\\" → \\"(a siege's waits for its reliever's belief, §4.3)\\" and \\"(B.11)\\" / \\"(RULINGS-ROUND6 B.4)\\" removed (§10); in §11 \\"(A.2)\\" → \\"(THE MINT WAITS FOR THE WEEK)\\", \\"— A.1\\", \\"(STOP-PR-r4-1 as re-ruled)\\", \\"(B.11)\\", \\"(P5C-3)\\", \\"(P5C-20)\\", \\"(P5C-17)\\", \\"(P5C-24)\\", \\"(P5C-15)\\" removed, \\"(RULINGS-ROUND6 B.4 — B.11 binds siege relief only)\\" → \\"(the per-reliever window binds siege relief only)\\", \\"(STOP-2's accepted gap)\\" → \\"(§5.6's accepted gap)\\"; in §15 \\"(R4-10, …)\\", \\"(R4-11, …, PL-r1-27; …)\\" trimmed to the OD rows. KEPT: research cites in the R4 H-form (R4 H1, H4, H7, Q3), the census and ODQ cites, the pins, the OD rows, PS/PR/ST/BD/MN/CH law and section cites, and every executed probe receipt under `cure/D-PL-*-probe/`.",
 "Round labels removed: §10's horizon (\\"round 4's rows\\" → \\"the banner's and the bodies' rows\\"; \\"round 5's rows\\" → \\"the friction's and the faith rows\\"; \\"no longer depends\\" → \\"does not depend\\"; \\"P5's garrison arm\\" → \\"the garrison arm\\"); §11's P52 (\\"(the r4 rule read 0.053)\\" and \\"(the r4 rule read 0.009)\\" — the superseded rule's readings — removed); §12 (\\"round 1 adds no shape\\", \\"ROUND 5:\\" ×2, \\"ROUND 5 —\\", \\"round 4 adds\\" restated as the design's own statement).",
 "\\"the chair\\", \\"the lane\\" and \\"the skeptic\\" removed: §10's `truce?` row (\\"AND the chair rules (B) in\\" → \\"AND (B) is ruled in\\"); §12 OD-PL-9 (\\"the chair routes it to GRAMMAR's catalog\\" → \\"GRAMMAR's catalog holds it\\"), OD-PL-12 (\\"the chair's reading\\" → \\"a reading by delegation\\"; \\"the alternative the skeptic offered\\" → \\"the alternative\\"), OD-PL-22/23 (\\"RULED … by the chair (RULINGS-AFTER-COMPILE)\\" → \\"(A′), the ruled path\\" / the ruling's own words), OD-PL-33 (\\"the chair's 10-18 ruling\\" removed), OD-PL-34 (\\"(the chair's)\\"), OD-PL-42 (\\"the fold §3.1 rows are the chair's\\" → \\"the fold §3.1 holds the rows\\"), and every \\"… are the lane's, vetoable\\" → \\"… are readings by delegation, vetoable\\" (OD-PL-52, -53, -55, -56, -57, -59); §15.6 (\\"the chair's 10-18 ruling moved the slot\\" → \\"the slot moved\\"); §15.12 (the brief's charter phrase \\"is routed to the chair\\" removed).",
 "§12 \\"… executed\\" ruling cites removed (\\"RULINGS-ROUND3 A.5/A.6 executed\\", \\"RULINGS-ROUND4 A.1/A.2 executed\\", \\"RULINGS-ROUND3 §F executed for PL\\", \\"THE BODIES' three routes executed\\", \\"L-BD 23b's four items executed\\", \\"CHAIR-NOTES 17 (b)'s PL half\\", \\"under RULINGS-P5 C.20\\", \\"(RULINGS-P5 C.1 · …)\\", \\"C.17's … read against A.8's re-homing\\" → \\"a fealty-record row, never a weave incident\\"); \\"(the owner's ~19:2x word)\\" → \\"(the owner's word)\\"; \\"for the ODQ §934.93 P5 addendum's visible rows\\" → \\"among the visible rows of ODQ §934.93's addendum\\"; \\"(§4's sites bracket, §15.12)\\" → \\"(§4.6's SITES CONSIDERED paragraph, §15.12)\\".",
 "Stale base text corrected by the row's own later brackets: OD-PL-35's \\"one `changeAuthorityPolicy.js` row (`auto`); minor in `decisionTier.js`\\" (B387 names it stale) → \\"two … rows (`auto`) — the sealed `polity_verdict` a minor …, the engine's `polity_verdict_default` a major …\\" (B388); OD-PL-41's \\"`polityEnabled` split into it …; `polityBreakEnabled` added\\" restated as \\"nine (§8), `polityHoldEnabled` and `polityBreakEnabled` among them\\"; OD-PL-4 \\"κ struck\\" → \\"no κ\\"; OD-PL-9 \\"renamed from `narrowed_sphere`\\" → \\"never `narrowed_sphere`\\"; OD-PL-29's \\"has resentment ≥ DRAFT 0.5\\" (STRUCK by B379) not restated.",
 "Superseded names kept as \\"never\\" statements, not dropped: `relief_answer` (§7: \\"`relief_answer` is no PL kind\\"), `polity_*` / `crown_*` (§7), `oathHolderEnabled` (§8), `readiness01`, `full · … · empty`, `STRENGTH_BANDS` (OD-PL-33), `crownReachAt(…).share01 > 0` (§15.12: \\"no … test\\"), `warden` (§15.12: \\"never wardens\\").",
 "Struck or withdrawn language restated as the design's own statement: §14.3's \\"'sampled once per year … slow by construction' is struck\\" → the reason the liege is read every tick (B459); §15.2's \\"'strained' was the member↔liege RESENTMENT … The intervener now decides\\" → \\"'Strained' is never the member↔liege RESENTMENT …: the intervener decides on ITS OWN belief …\\" (B467); §9 PL-1's map-supersession history (B261) → \\"By the owner's word … PL carries no supersession of the map's chain rule anywhere\\"; §9 PL-4's \\"Hosts unchanged (…)\\" → \\"`warCapacityReads.js` (143) makes its one read …\\"; PL-8's \\"PL had never named the door. PL-8 builds it\\" → \\"PL-8 builds the door\\".",
 "Re-rulings folded at their latest text (each re-ruling's marker removed, the withdrawn clause not restated): B285, B332, B340, B352 (the incursion's first-sight answer on the liege's inputs as they stand — the r6 withdrawal of the r5 belief condition for the incursion); B337 and B429 (the harm rule after EITHER answer — A.6's `kept` clause withdrawn); B268's nested RE-RULED; B427's nested RE-RULED and CURED. B413 (the r5 belief condition for the incursion, in OD-PL-48) DROPPED as superseded by B414.",
 "Dates removed from the running text of §7..§15 outside the owner's words and the rulings table: B261 (\\"the owner's word of 2026-10-18 05:57\\" → \\"the owner's word\\"), B399 (\\"the owner's word of 05:57\\" → \\"the owner's word\\"). THE OWNER'S QUESTION and THE OWNER'S WORDS headers of §14 and §15 keep their dates (the owner's words). The rulings table carries dates in its heading and its Ruled column only.",
 "Design marks carried by stamps KEPT: B348 (P52, \\"DRAFT, UNMEASURED\\") → \\"; the age term is DRAFT, UNMEASURED\\". Every PLAUSIBLE mark in §7..§15 stands (§9 PL-4's docket read, PL-8's two tail reads, §10's two round-trips, OD-PL-54).",
 "Review routing dropped (each a lane-to-lane instruction, never a design fact): B242's \\"routed in `cure/D-PL-r2.md` §5\\" (its design sentence kept: CH's crown ban needs `polityHoldEnabled`); B253's \\"the chair amends fold 21(a)\\"; B260's \\"The fold §3.1 rows are the chair's\\"; B261's \\"The fold's two passages … are HOST-r2-4's fold half, for P4\\"; B273's \\"the SEAMS-r1-2 idiom\\"; B476's \\"THE PATROLS' cites of it as wear … are routed\\"; B478's \\"(… is routed to the chair, `cure/D-PL-r2.md` §5)\\"; B479's \\"(routed to PR)\\" notes; pin provenance B303–B307 (which review id each pin answers).",
 "`↳` removed outside brackets in §10 (two table sub-row labels restated) and inside B478 (\\"the fold's map-side INBOX (h) ↳\\" → \\"INBOX (h)\\"). THE PATROLS' brief items are cited as \\"THE PATROLS, item n\\" (B478), as seat 1 cited THE BODIES' items.",
 "OD-PL-56 and OD-PL-51 — the two conflicts seat 1 flagged — are settled by the rows' own latest brackets (B434, B421), not decided anew; see §1's STOPs paragraph."]
""",)
# §4 allow-missing: seat 2's groups
R("""out.append("- PARTIAL-RATCHET ONLY (2):""","""out.append("- PARTIAL-RATCHET ONLY (2), RESOLVED by seat 2: `faithCarriersOut` stands in §14.5 and `share01` in §12 OD-PL-56 (and §15.12), so both lines are deleted from `PL-allow.txt`. (Seat 1's note follows.) Partial:""")
R("""out.append("- No other superseded NAME was dropped in header..§6""","""out.append("- SEAT 2 — REVIEW-TRAIL PATHS (3): `briefs/L-PR.md` (B478's source brief), `cure/D-FOLD-r3.md` and `cure/D-ST-r3.md` (B382's nested receipt, a routing record) — named only inside brackets as the source of a change; they stay in `history/PL-cure-record.md` and git.")
out.append("- SEAT 2 — SUPERSEDED NAMES (2): the interim closed weave lists `recognition_withheld · appointment_imposed · faction_backed · charter_granted · riders_quartered` (B474) and `… · riders_quartered · riders_lent` (B475), superseded by B476's re-homing of `riders_quartered` to the fealty record; §15.9 states the final list `recognition_withheld · appointment_imposed · faction_backed · charter_granted · riders_lent`.")
out.append("- SEAT 2 — MOVED WITH THE CURE RECORD (53): every token backticked ONLY inside old §16 THE CURE RECORD (old lines 705–967) — lane logs and probe outputs (`cure/D-*-r3.md` … `cure/D-RESIDUE-r6.md`, `walk.out`, `cycle.rerun.out`, `measure-r5.out`, `ageterm_r5.out` …), skeptic reports, `briefs/RULINGS-ROUND6.md`, `assessments/WIRING-CENSUS-2026-10-20.md`, and names quoted only in the record's dispositions (`paragonGateEnabled`, `paragonLean`, `banKeys`, `mintDeed`, `drainQueuedEvents`, `polity_ban:corps:…` …); each stands verbatim in `history/PL-cure-record.md` Part 2. The list is in `PL-allow.txt` under its own heading.")
out.append("- No other superseded NAME was dropped in header..§6""")
# §5 ratchet: whole volume
R('out.append("## 5. THE RATCHET (partial: old lines 1–357 against the new header..§6)")','out.append("## 5. THE RATCHET (the whole volume: the text of record against the new text)")')
R('out.append("`python3 tools/consolidate-ratchet.py <old lines 1–357> consolidate/PL-new.md --allow-missing-file consolidate/PL-allow.txt`:")',
  'out.append("`python3 tools/consolidate-ratchet.py history/PL-bracketed-1beabdc85.md consolidate/PL-new.md --allow-missing-file consolidate/PL-allow.txt` (the last run; exit 1 only for the explained count differences below):")')
RB('out.append("- **DRAFT 14 → 13 and UNMEASURED 11 → 10**','out.append("- tokens missing 0 · cites 53 = 53',
'''out.append("- **tokens missing 0** (with `PL-allow.txt`) · **cites 64 = 64** · **laws 17 = 17** · **review markers left 0** · ⭐ 0 → 4 (OD-PL-5, -12, -60 marked, and the §12 heading's legend).")
out.append("- **OD rulings 70 → 67**: the ratchet counts every distinct `OD-XX-n` id. All 61 PL rows (OD-PL-1 … OD-PL-61) stand, each once in §12 (no ruling superseded another row, so none was folded away); the three ids lost are OTHER volumes' rows named ONLY inside the moved cure record — `OD-PR-27` (old line 831), `OD-PS-42` (old line 869), `OD-PT-28` (old line 838).")
out.append("- **DRAFT 31 → 26**: three are inside the moved cure record (old lines 705–967); one is B085 (seat 1, the superseded change note \\"every DRAFT cell is marked UNMEASURED\\"); one is B379's STRUCK threshold \\"has resentment ≥ DRAFT 0.5\\" (OD-PL-29), which the latest text does not restate. Every live DRAFT constant and cell stands; B348's \\"DRAFT, UNMEASURED\\" on P52 is kept.")
out.append("- **UNMEASURED 28 → 25**: two inside the moved cure record; one in B085 (seat 1). Every live UNMEASURED mark stands.")
out.append("- **wave ids 15 → 13**: the pattern `XX-n —` also matches the two STOP labels \\"STOP-1 —\\" and \\"STOP-2 —\\" (old lines 332, 334), not waves; both labels were removed by seat 1 (their rulings stand as §5.5 and §5.6). All thirteen waves PL-0 … PL-12 stand in §9.")
out.append("- **flags 36 → 35**: `paragonGateEnabled` (CH's flag) is named only inside the moved cure record (old line 792). PL's nine flags and every host flag stand.")
out.append("- **NEW tokens** (7): `1beabdc85`, the kit's history paths and `history/PL-cure-record.md` (the header and THE REVIEW TRAIL), `cure/` and `skeptic/` (THE REVIEW TRAIL's \\"the kit's `skeptic/` and `cure/`\\", CH's form), and one backtick-parity artefact (§4 above) — no mint.")
out.append("- Other counts, by script: hearing-kind rows 10 = 10 (nine PL kinds and `call_in_answer`); flag rows 9 + the shared channel = the same; persisted shapes FOUR = FOUR (§10); scenario rows P1 … P61 with P2b and P5b, 63 = 63; OD rows 61 = 61.")
''')
# §6 the handoff → the state
RB('out.append("## 6. THE HANDOFF (for seat 2)")','out.append("- `PL-allow.txt`: keep the two BACKTICK-PARITY lines',
'''out.append("## 6. THE STATE (both seats complete)")
out.append("- Every marker row is resolved: PENDING 0. The section map is complete (§2), every PL \\"§x\\" in the new text resolves to a section or sub-section that exists (checked by script, `xref.py`; the hits it lists are other volumes' sections — PR §10.x, PS §7.5, BD §7.1/§10.x, ST §2.4–§2.5, census V §1.14 — and the owner's §735.2/§741.1), and every reference to another volume names that volume.")
out.append("- `history/PL-cure-record.md` holds Part 1 (old lines 3–9) and Part 2 (old lines 705–967), both verbatim (asserted by `cure_record.py`).")
out.append("- The ratchet's last run is §5; every remaining count difference is explained there. Then `consolidate/PL-new.md` was copied once over `docs/DESIGN_FP_ARCH_PL.md` (in `/home/user/fp-p8/docs`).")
out.append("- Seat 1's handoff checks, done: OD-PL-56 and OD-PL-51 (§1); OD-PL-22/23's \\"by the chair\\" (the Ruled column); `faithCarriersOut` / `share01` deleted from `PL-allow.txt`.")
''')
R("for f in ['brackets.py','readcopy.py','build.py','lint.py','ledger.py','render.py','head.py','d00.py','d01.py','d02.py','d03.py','d04.py','d05.py','d06.py','d07.py']:",
  "for f in ['brackets.py','readcopy.py','build.py','lint.py','ledger.py','render.py','head.py','d00.py','d01.py','d02.py','d03.py','d04.py','d05.py','d06.py','d07.py','d08.py','d09.py','d10.py','d11.py','d12.py','d13.py','d14.py','d15.py','d16.py','d17.py','d18.py','cure_record.py','missing_where.py','xref.py','patch_render2.py']:")
open(p,'w',encoding='utf-8').write(s); print('render patched')
````

## CURES AFTER FV-PL (2026-10-23, the cloud chair)
- F1 (THE READER'S GUIDE item 3, the pass's recurring guide pattern): "TRUTH only for" → "TRUTH for", naming the two reads the text makes: a polity war's default verdict condition, read from the field like every executing writer (§5), and THE BORDERS LENS, host truth over the seat territory (§9, PL-1). No new decision.
- F2 (row B099, §3.4's `armyTransitKernel.js` cell): the unsupported clause "the fold §5 registers the homonym" dropped; the ruling's sentence stands. The fold's §3.1.1 ↳ still calls the charter's toll term "PASSAGE": routed to the fold lane (P8d) to apply PL-C-1 there (`toll_exemption`).

## SEAMS CURES (2026-10-23, per SEAMS-P8, the chair's rulings)

- SEAMS-P8-13 · §4 L257 (quoting PS §7.5) · "B's DEFENCE `passageDefenceOf` (§2.7)" → "B's DEFENCE `passageDefenceOf` (PS §2.7)".
- SEAMS-P8-12 (a) · THE READER'S GUIDE, the dispatch-gate paragraph (L20) · "**The dispatch gate is the owner's.** Nothing here builds before … deployed. The rulings in §12 are taken by delegation under the owner's words of 2026-10-16 ("…") and 2026-10-17 ("…"), each vetoable by one clause;" → PT's undated form: "**The dispatch gate is the owner's:** nothing here builds before the UI + prose release is pushed and deployed; push · merge · deploy · migration · dispatch stay the owner's. The rulings in §12 are taken by delegation under the owner's words ("…"; "…"), each vetoable by one clause;" (the two verbatim quotes kept — they stand nowhere else in PL; only the dates dropped; the clause on the owner's reserved rows unchanged).
