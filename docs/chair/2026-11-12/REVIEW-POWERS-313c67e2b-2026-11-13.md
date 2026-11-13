CLEAR

# REVIEW-POWERS-2, second reading — the fifth seat's cures at 313c67e2b (2026-11-13)

The chair asked for a reading of the cures pushed over 463eb0b04 (20 commits, 12 `src` files). Line = 3575cf061 (unchanged). RUN unless marked READ. Probes are scratch, never committed.

## 1. COLD, before PART 5: twenty fresh towns at the tip
Seeds outside the 720: `r2r-{thorp,hamlet,village,town,city,metropolis}-77`; `r2s-succession_void-{hamlet,town,city,metropolis}-7`; `r2s-occupied-{thorp,village,city}-7`; `r2s-politically_fractured-{hamlet,town,metropolis}-7`; `r2s-insurgency-village-7`, `r2s-plague_onset-city-7`, `r2s-famine-town-7`, `r2s-wartime-metropolis-7`. Rendered through the census walk (owner, premium, every disclosure open). Read: the seat row, the holder's card, the dots, the DM block, the claimants.
**Reads right:** every held seat's holder card opens "Holds the seat…" and adds the house second ("Still the senior guild master as well."). Every village-to-metropolis holder is ●●●. The DM block heads the keeper "Acting Elder · …" (was "Steward"). The claimant parties are faced by their minted claimants ("Lady", "Khatun", "Boyar").
**Reads wrong (none is the cures' own fault):**
- (a) A rival noble power in a succession town is still led by a tradesperson: `r2s-succession_void-metropolis-7` The Old Houses ← the mine-master; `-town-7` Landed Gentry ← a miller; `-city-7` Noble Families ← a miller (§5).
- (b) The minted claimants read ● (§5).
- (c) A keeper of the empty seat heads a contender: `r2s-succession_void-metropolis-7` "Acting Wali Nawal ibn Rushd", first of Noble Houses ("Contests the seat", 28); `-city-7`'s Acting Lord Mayor is first of Merchant Guilds ("Contests the seat"). That keeper sits in a contender's party, not a claimant's. The line had 7 such keepers on the 720; the tip has 9.
- (d) Where the condition's row is refused, the holder reads only "Holds the seat." (`r2s-politically_fractured-metropolis-7`, a fractured metropolis). True, but thin.

## 2. N1–N11 by this review's measure, on its 720 (line / e86d069be / 313c67e2b)
| | line | e86d069be | 313c67e2b |
|---|---|---|---|
| N1 the governing first says it holds the seat | 584 | 170 | **689 of 689 held seats** (the 31 others are vacancies, where no one holds the seat) |
| N1 a subordinate position on the governing first | 39 | 96 | **3**, all vacancy keepers, who hold no seat |
| N2 village–metropolis leader `low` | 0 | 295 | **0** (high 480 of 480); leader has the top `power` 427 / 246 / **447** |
| N3 a non-holder's card "Holds the seat…" | 21 | 52 | **0** |
| N4 noble claimant parties faced by a tradesperson (succession births) | — | 9 bodies | **0**: all faced by their minted claimant (17) |
| N4 the keeper in a claimant's party | — | 4 | **0** |
| N5 a title over a different number of names (every DM block, 720 dossiers) | — | 169 | **0**: three 511, two 51, "Who leads" 158 |
| N6 the leader's own house row with a second office word | — | 31 | **0** |
| N7 doubled office words on the seat row / the keeper labelled "Steward" | 0 / — | 29 / 31 | **0 / 0** |
| N8 the share pin | — | loosened | strict (§4) |
| N9 / N10 | — | — | the record states the capture class by its rule and names `coherenceNotes` (READ) |
| N11 enforcement-claims | — | 2 red | **green** (23 of 23, with seatWordsOnce, seatHolderCard and successionClaimants: 4 files, 43 of 43, exit 0) |
F4's class stays cured (powers with neither a member nor a line: 0). Every name the Power tab, the DM block and the Connection rows print is on the people list.

**THE NEW PAGE GUARD (`tests/components/seatHolderOnThePage.test.jsx`), planted OUTSIDE the cured sites.** A scratch tree at 313c67e2b with a post-pass after `enrichNPCsWithStructure` (`narrativeGenerator.js`), switched on by an environment variable. Run on the guard's review-towns arm:
- control: green.
- the holder's influence set low: **red**.
- the governing second given "Holds the seat in name…": **red**.
- **the holder's constraint replaced by "The family's say slowly shrinks beside the offices that run things.": GREEN, missed.**
- **the holder's position "Holds the seat, though the guild masters decide what it may do.": GREEN, missed.**
Why: check (2) reads only the first card paragraph that matches `Holds the seat` or the closed `SUBORDINATE` list, so a subordinating constraint, goal or clause passes.
**G1 (LOW):** the guard is weaker than its title. The page is right today. Cure: read every structural line of the holder's card (position, constraint, goal), not one paragraph.

## 3. N5: the census row 332 → 184
The tip's census against the line: **no row rises; no new row.** 16a 332 → 184; 4 103 → 94; 14 167 → 166; 16b 291 → 282. Thirty of the 184 read on the page (every sixth): **thirty of thirty print three names under "The ruling three of …"**. Over all 720 DM blocks the title matches the names beneath it in 720 of 720. The 184 are the counter's window, as the seat says; the class is 0.

## 4. The repetition guard; N8
`tests/lint/poolDominance.walker.test.js` green at the tip. `scripts/census/` is unchanged between 463eb0b04 and the tip, so nothing was banked.
N8 (`tests/generators/people/castPowers.test.js`): strict in substance. A zero share passes only for the dual-hat office (a house face, first of the governing power, role ≠ title); every other membership must be > 0, so a negative, NaN or stray zero fails (READ; the seat's plant of −0.5 red, READ). Its zero arm, `Object.is(m.share, 0)` inside `m.share === 0`, is a tautology (it catches only −0): strict in name on that one line.

## 5. The two things it did not cure
- **Rival noble powers in succession towns led by a tradesperson.** This is the line's own class, made smaller by the lane. Noble powers whose first is a miller, mine captain, college master or impresario: line 150 of 720 births' powers (succession births 21), e86d069be 145 (22), **313c67e2b 126 (9)**. In succession births only the roster's own Landed Gentry / Noble Families / Noble Houses and the density law's Landed Bloc remain (`r2s-succession_void-city-2`, `-metropolis-3`). The house catalogue backs these powers with mills and mines; that is the line's design. **How bad: LOW for this lane.** It reads oddest under The Landed Bloc's "Hereditary or institutional claim" (2 births of 720). The seat's recommendation (every noble power in a succession town faced by its line) is a fair design, the chair's.
- **The minted claimants read low influence**: 23 of 23 on the 720 (importance "pillar"). They follow the same keyword band as every other power's head: in towns and larger, heads of non-governing powers read low 967 / moderate 262 / high 497. **How bad: LOW**; it is the people list's general rule, not the claimant's alone. Cure, if wanted: the claimant mint takes the band of the seat it claims.

## 6. Did any cure remove a line that was true?
Cards that lost their position line, e86d069be → tip, on the 720: **62**.
- **56 were false:** the occupier's governor and the bloc speakers' "Holds the seat…" (52), and four vacancy keepers' "Holds the seat in name…" while the seat stands empty.
- **6 were true house lines** in succession births ("Belongs to a lesser family behind the leading one while the seat fails", "Leads a squad…", "Runs a smaller house…"). They fell off because each birth gains a minted claimant (village-3: 12 → 13 cards, cards with a line 5 → 4), so the enrichment cut moved. The cut predates the lane: LOW.
- No other line was lost. The keeper's party memberships are dropped by rule (N4, call 6), which changes the parties' ranks; READ, not a printed falsehood.
The occupier's governor now carries no position line at all: true by omission.

## VERDICT
**CLEAR.** N1 to N11 are cured on this review's own corpus, both trees measured. The page count rises nowhere. The repetition guard is green with nothing banked. No cure removed a true line except six house lines the enrichment cut drops (LOW).
Left for the chair, none blocking:
- **G1 (LOW):** the page guard misses a subordinating constraint or clause (planted, green).
- The line's tradesperson-led noble powers in succession towns (9 births).
- The minted claimants at low influence.
- Keepers who head a contender (9 of 31 vacancies; line 7).
- The six lines lost to the cut.

This file is born dated too: on this branch the citation walker's archival roster reads dated 239 against the frozen 237 (this file and the first). Whoever carries the two records onto the line bumps it by two.
