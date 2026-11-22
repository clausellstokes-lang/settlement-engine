# R5D-0 — R5-DESC's last measures before its cure (VEIL-34's MEASURE builder V34-R5D0, 2026-11-22)

Brief: `docs/chair/2026-11-20/veil/briefs/R5D-0-BRIEF.md` (the chair's E115), plus the seat's addition to Q3 (E116 3: the forms,
the tail, the standing elsewhere, sample bases, the fail-closed count). Nothing cured; nothing in `src/`, `supabase/`, `tests/`
changed; 212 applied to a local template, never read. Tree: worktree `/home/user/wt/r5d0`, branch
`lane/veil-34-2026-11-22-r5d0-wip`, cut at 606381cb5. Template `r5d0tpl` (v27x211 + the tree's 212, sha256 0352a502…). Local
cluster only. The pool `/var/tmp/v18/t2/pool-v34` holds page signatures, no documents: not read further (PLAUSIBLE: it is
not this measure's page set).

**Instrument** (`measure/`): R5-DESC-MEASURE's arm EXTENDED (`arm.probe.jsx`, everything it measured kept; `arm.sh`; its
analyzer `arm-an.mjs`), plus `standing-table.mjs` (factionStanding's closed table, transcribed by hand, with the cut) and
`r5d0-an.mjs` (the four questions; `out/r5d0-table.txt`). The same 6,528 pages: 140 births (tell-common.mjs :: pool, N=2),
both engines, every setting, Reveal off and DM. Run `full` 19:28..19:36 UTC, 4 shards rc=0, errors 0. **The prior run's
`arm-table.txt` reproduces byte for byte** (header timestamps aside), engine parity 0 differences: CONFIRMED. Every figure below
is the server's; where the analyzer reads both engines (Q1, Q4, the walker) the twin equals it on every line, and the reproduced engine parity (0 differences over every served string) covers Q2's and Q3's served descs (CONFIRMED). "Nothing-hidden" = R5-DESC-MEASURE's M3 set (no withheld
power, every stamped row served): 5,118 pages.

**THE WALKER (the table held equal to the engine):** every standing `annotateFactionStanding` wrote on every roster of the run
(each record's own and each page's served roster: 19,489 standings) cuts WHOLE into the table's forms: **19,489 / 19,489, 0
fails**. CONFIRMED on these rosters; that no other form exists is PLAUSIBLE by the read (11 forms are never written here).

## Q1 — `dmNote` on the DM door (power relation rows served; server; twin equal)

| set | rows served | with a dmNote | share | |
|---|---|---|---|---|
| DM, all pages (1,632) | 4,239 | 170 | **4.0%** | CONFIRMED |
| DM, nothing-hidden pages (1,322) | 3,389 | 170 | **5.0%** | CONFIRMED |
| DM by size: village / town / city / metropolis | 176 / 919 / 1,205 / 1,939 | 33 / 55 / 14 / 68 | 18.8% / 6.0% / 1.2% / 3.5% | CONFIRMED |
| DM nothing-hidden by size: village / town / city / metropolis | 176 / 769 / 995 / 1,449 | 33 / 55 / 14 / 68 | 18.8% / 7.2% / 1.4% / 4.7% | CONFIRMED |
| DM by setting: each gated (own, g:000..g:110, allOpen, off) | 351 | 11 | 3.1% | CONFIRMED |
| DM by setting: allShown (92 pages) / unmarked | 324 / 405 | 27 / 33 | 8.3% / 8.1% | CONFIRMED |
| pages: with relation rows / with any note / every row noted | 1,544 / 170 / 47 | | | CONFIRMED |
| Reveal off (every page) | 4,131 | 0 | 0% | CONFIRMED |
| the record (140 births) | 405 | 33 (in 33 births) | 8.1% | CONFIRMED |

**A card WITHOUT a note is the common case: 96% of the DM door's relation rows (95% on nothing-hidden pages) carry none**; no
size or setting comes near "nearly every card" (the highest, villages, 18.8%). E115's per-entry withhold stands on this ground.
The gated settings serve 11 of the record's 33 notes on 351 of its 405 rows: PLAUSIBLY the other 22 notes sit on the rows the
gate withholds (not read row by row).

## Q2 — the base sentences a power's PRESENCE picks or words (served on the 6,528 pages; server)

The brief's example is **not a base sentence**: "They and the religious authorities both keep people in line." is a STANDING,
`factionStanding.js :: annotateFactionStanding` (form `GR-line`: `hasMilitary && hasReligious`, the military's own card, the
clergy within 10 power), written over the roster of birth; the share cut (Q3) removes it with every standing. CONFIRMED (read).
Writers read by grep and by symbol: `rulingStructure.js`, `stressFactions.js`, `applyDensityLaw.js` (the rivals and the reeve),
`claimStanding.js` (the settlers). Counts by the template's own words over each served base (the desc less its cut standing).

| `path :: symbol` (template) | picked or worded by | record | served off / dm | on a page withholding a power | |
|---|---|---|---|---|---|
| `rulingStructure.js :: generatePowerStructure` govDescByLabel 'Elected Reeve' "…under noble oversight." | a NOBLE POWER seated (noblePower over the nobles' gate) or a noble house; kept by `applyDensityLaw.js :: reeveToRoster` while a noble power or house stands | 0 | 0 / 0 | 0 (lit 0) | CONFIRMED |
| same :: nobleDesc "Hereditary landowners behind the ${governingFaction}…" | the SEAT noble-kind; **prints the seat's NAME** | 3 | 35 / 35 | 0 | CONFIRMED |
| same :: nobleDesc (nobleGoverns rungs) | the seat noble-kind | 9 | 107 / 107 | 20 | CONFIRMED |
| same :: nobleDesc (merchantAligned) | the seat Merchant oligarchy / Democratic assembly / Guild Council | 3 | 36 / 36 | 20 | CONFIRMED |
| same :: nobleDesc (Royal Authority; "the elected council"/"the seat") | the seat | 0 | 0 / 0 | 0 | CONFIRMED |
| same :: merchantDesc "The ruling class and the merchant class are the same people…" | the seat a merchant council | 12 | 143 / 143 | 80 | CONFIRMED |
| same :: militaryDescFinal "Operationally distinct from the command council…" | the seat a military council / martial | 8 | 94 / 94 | 20 | CONFIRMED |
| same :: religiousDesc (Theocratic, Church Council, ecclesiastical) | the seat | 4 | 48 / 48 | 0 | CONFIRMED |
| `stressFactions.js :: applyStressEventFactions` (politically_fractured, indebted, succession_void; `P` = the seat's name) | the seat 'Royal Authority' or not (the injected power's name and desc; the nobles' crown-debt line) | 32 | 375 / 375 | 160 | CONFIRMED |
| same (religious_conversion) | the seat's NAME length mod 3 (the clergy's appended line and the new power) | 0 | 0 / 0 | 0 | CONFIRMED |
| `applyDensityLaw.js :: rivalDescOf` (RIVAL_DESC_OF_HOST: "A second armed company…", "A rival bloc…", "A rival criminal network… contests them with the established one.") | the HOST power's opening line (the rival is minted from a power on the roster) | 24 | 276 / 276 | 120; the criminal rival 4 served, **0 with its host withheld** | CONFIRMED |
| `applyDensityLaw.js :: resizePoliticalRoster` (the mint's `{ ...host }`: the host's base copied) | the HOST's presence | 178 descs share a base with another power of their record | – | **0** served copies whose twin-base power is withheld | CONFIRMED |
| `claimStanding.js :: settleClaimsToLabel` (SEAT_WORDS "the hall", ARCANE_ADVISORY_UNDER_ARCANE_SEAT, UNDERWORLD_UNDER_STRONGER_SEAT) / `settleClergyToFinalRoster` (CLERGY_WITH_WEIGHT) | the seat: council or not, magic, its label's rank, its power | 18 | 215 / 215 | 100 | CONFIRMED |

**Every presence-picked base here reads the SEAT, a density host, or a noble power; the seat is withheld or stamped on 0 of 140
births, no noble power is withheld on any page, and no served rival or copy has its host withheld: 0 base sentences on the 6,528
pages are picked or worded by a WITHHELD power.** CONFIRMED in this set. The withheld kinds here are criminal and the infiltrator;
a hide of a noble power (the reeve's line) or of a seat would make these live: PLAUSIBLE risk, not met here.
**LIT** (the lit probe's committed output, 60 births, `/var/tmp/v18/out/v34/r5dm/lit2`; it keeps hit strings only, 64 desc
strings): `GR-line` 16 (12 where the act hides Religious Authorities; jp6-city-2, jp6-city-8, jp6-village-6, jp6-metropolis-0)
— the brief's example, a standing; seat-picked bases riding in hit descs: stressFactions 4 ("Claims legitimate authority through
different means"), claimStanding 8 ("…access to the hall…"), each picked by the seat, none by the hidden power; the reeve 0.
CONFIRMED as a count of what the output keeps (a lower bound for served instances: PLAUSIBLE).

## Q3 — THE SERVER'S CUT (the stored descs; the table; the E116 3 additions)

| figure | value | |
|---|---|---|
| (a) the table: FORMS | **44**: 33 closed text; 7 take a power's NAME (R1-gap, R1-shadow, R1-behind: `{X}`; R2-buy: `{Y}` and `{Z}`; NM-more, RA-more, OC-named: `{S}` + have/has, carry/carries); 3 take the FORCE's body word (TG-far, TG-even, GR-line: garrison / hired company / watch / militia / guard); 1 takes a COUNT and the seat's kind (R2-level: Three..Many, "council vote"/"decision") | CONFIRMED (read whole) |
| the table's size | 44 sentences' templates, **4,912 characters** (slots as placeholders); a page's expansion is finite (its roster's prose names × the forms) | CONFIRMED |
| the record's descs (754 on 140 births) | **426 `<base> <standing>`**, **328 `<base>` (no tail row)**, 0 standing alone, **0 with a standing form anywhere but the tail** | CONFIRMED |
| the cut against the engine's own standing (record roster) | equal 751 / 754; the 3 others store NO standing where the engine would write one | CONFIRMED |
| (b) the stored standing is ALWAYS the desc's tail | yes: where one is stored (426), it is the tail; 0 inside a base; the engine's own sentence is the tail on 426 of 429 (the 3 store none: The Enlightened, a `claimStanding.js` rung rewrote the desc; The Shield Compact, a density rival whose desc is RIVAL_DESC_OF_HOST's; The Underground, cause not read) — so the cut is found from the document's own text | CONFIRMED |
| served descs (server) | off 8,281 (4,757 split, 3,524 base only); dm 8,410 (4,791 / 3,619); nothing-hidden off 6,237 (3,445 / 2,792), dm 6,741 (3,741 / 3,000); 108 rows per read carry no desc | CONFIRMED |
| **descs whose tail matches no table row** | **328 of 754 record descs (43.5%); served 3,524 off / 3,619 dm per engine.** Of the 328, the engine itself writes NO standing for 325: they are base-only by right, not a failed cut. A cut that withholds whole on "no row" would blank 43% of cards that hold nothing to cut; fail-closed must mean "no row: serve as is", the 3 aside | CONFIRMED |
| a standing that names a power | 137 record descs; **2 name a withheld power** (Thieves' Guild in R2-buy: r3m-town-none-0-17, r3m-city-none-1-117 — the 20 served lines per side of R5-DESC M1); 0 a stamped one. **The literal is a PATTERN**: `<fixed prefix> <powerSentenceName(any roster name)> <fixed suffix>` (R2-buy two names; three forms a name then an agreeing verb); the force forms a five-word slot | CONFIRMED |
| (c) the standing stored ELSEWHERE in the served document | **0 pages**: no other string leaf of any served document holds a served desc's standing literal (the strata hand the desc back on the PAGE, computed, not stored: R5-DESC M5) | CONFIRMED |
| forms seen / never seen | 33 of 44 seen; never: R1-nolead, R1-resist, R1-settled, MC-close, CM-running, ST-tangle, ST-dayto, ST-gives, ST-claim, ST-day, OC-none | CONFIRMED |

Five examples of the forms that do not split as `<base> <standing>` (every one is `<base>` alone, the class): "The local clergy
serve a real pastoral role; … Currently under pressure from both sides to publicly endorse the legitimate authority."
(Religious Authorities, a crisis note, no standing); "Elders guide the community by custom, not by formal authority, but fewer and
fewer people accept their word." (Elder Council); "The oldest heads of the community still decide things together, but fewer and
fewer people accept their word." (Elder Council); "The governing body is systematically compromised; offices are sold and justice
is purchasable." (Corrupt Council); "An external interest with its own people placed inside the settlement. Its presence is not known
to the settlement." (The Independent Bloc). CONFIRMED.
**(d) What a whole-entry withhold would lose (three bases, 116 distinct bases carry a standing):** "Emergency committee with
authority over rationing, conscription, and defence spending; not accountable to normal governance."; "Crown-appointed emergency
body with powers over requisition, conscription, and price controls. Unpopular. Accused of favouritism in contract awards.
Probably correct on the military decisions."; "Church authority is the formal source of governing legitimacy here; clergy hold
both spiritual and temporal jurisdiction." CONFIRMED (from the record).

## Q4 — THE TENSION'S MASKED PARTY (`history.currentTensions[].factions[]`)

| figure | value | |
|---|---|---|
| the town | r3m-village-infiltrated-0-2 (roster: Elder Council, seat; The Independent Bloc, stamped) | CONFIRMED |
| the stored party it masks | **"The Independent Bloc"**, `currentTensions[0]` (succession_crisis), party [2]: ["Elder Council", "Popular candidate", "The Independent Bloc"] | CONFIRMED |
| the writer of the hidden row | `stressFactions.js :: applyStressEventFactions`, `ke('infiltrated')`: `pushPoolNamed(factions, 'other', 15, …, { hidden: true })` (the infiltrator, named by `firstUnusedPoolName`) | CONFIRMED |
| the writer of the party | `historyGenerator.js` (the tensions' `substituteNames`): `historyData.js` succession_crisis's 'Power behind throne' becomes `altFaction = factions[1].faction`, the roster's SECOND row, here the infiltrator; no reader of `hidden` there | CONFIRMED (read and the record) |
| the mask's writer | `publicSafe.js :: maskHiddenNames` (`maskText`, every string leaf) and its server twin (210's walk, by its comment) | CONFIRMED (twin); server PLAUSIBLE by the comment |
| pages serving the masked party | **22** (11 per engine), every one Reveal off, a hiding page; DM 0 (the door serves the row and its name) | CONFIRMED |
| **NOTHING-HIDDEN pages serving a masked party** | **0** of 5,118; and 0 nothing-hidden pages print the mask at any path | CONFIRMED |

The masked party is the stamped infiltrator in the history step's "power behind the throne" slot, which takes the roster's second
row whatever it is; withholding it is the ruling's law, and no page that hides nothing serves one.

## THE PARAGRAPH (by the figures)

Q1: the DM door's relation rows carry a dmNote at **4.0%** (170 of 4,239; 5.0% on nothing-hidden pages): a card without a note
is common, so the per-entry withhold stands. Q2: **0** served base sentences picked or worded by a withheld power; the
presence-picked bases read the seat (never withheld here), a density host (never withheld under a served rival) or a noble power
(none withheld); the brief's example is a standing (`GR-line`), which the cut removes. Q3: every stored desc is `<base>` or
`<base> <standing>` (**426 split, 328 base only, 0 otherwise**), the standing always the tail, held nowhere else, cut by a
**44-form, 4,912-character table that the walker holds equal to the engine (19,489 / 19,489)**; 11 of its forms take a value
(7 a power's name, so the literal is a pattern over the roster's prose names; 3 the force's word; 1 a count), and a "no row" result is base-only by right in 325
of 328: fail-closed there would blank 43% of cards. Q4: the masked party is "The Independent Bloc", the infiltrator
(`stressFactions.js`) in the succession tension's second-row slot (`historyGenerator.js`); 22 pages, all hiding; nothing-hidden
pages serve **0**. CONFIRMED figures; the choice is the seat's.
