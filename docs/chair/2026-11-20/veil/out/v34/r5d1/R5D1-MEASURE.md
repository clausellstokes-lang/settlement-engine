# R5D-1 — the presence-picked bases, MEASURED FIRST (VEIL-34's MEASURE builder V34-R5D1, 2026-11-22)

Brief: `docs/chair/2026-11-20/veil/briefs/R5D-1-BRIEF.md` (VEIL-34 on the chair's E122). Nothing cured; nothing in `src/`,
`supabase/`, `tests/` changed; 212 applied to local templates, never read. Tree: worktree `/home/user/wt/r5d1`, branch
`lane/veil-34-2026-11-22-r5d1-wip`, cut at e1e5548cf. Template `r5d1tpl` (v27x211 + the tree's 212, sha256 0352a502…). The lit
run: detached worktree `/home/user/wt/r5d1-jp` at df7447e58, template `r5d1jptpl` (v27x211 + that ref's 212, sha256 8688ddb6…).
Local cluster only. "The pool" here is R5D-0's page set (tell-common.mjs :: pool, N=2: 140 births, 6,528 pages); the
`/var/tmp/v18/t2/pool-v34` signatures were not read (PLAUSIBLE: not this measure's page set).

**Instrument** (`measure/`): R5D-0's arm EXTENDED (`arm.probe.jsx`, everything kept; the `y` fields added), `pick.mjs` (THE PAGE'S
PICKER), `templates.mjs` (R5D-0's Q2 regexes byte for byte, ids T01..T14; T05+T06 are R5D-0's one row, T13 the mint's copy, read
by the record), `r5d1-an.mjs` (the tables; `out/r5d1-table.txt`), and the copied litsurf probe (`measure/lit/`, one addition: `y`
on each act T). Arm run 20:12:47..20:20:15 UTC, 4 shards rc=0; **R5D-0's `arm-table.txt` reproduces byte for byte** (header
timestamps aside; engine parity 0 differences) **and so does `r5d0-table.txt`** (0 diff lines): CONFIRMED. Lit run
20:10:55..20:12:04, 4 shards rc=0; **its `litsurf-table.txt` reproduces R5-DESC-MEASURE's byte for byte** (exit 1 is its
committed red verdict): CONFIRMED. Server and twin agree on every line of all three tables below (CONFIRMED).

**THE PICKER** (`pick.mjs`, the engine's own functions, called on the PAGE: the projected served document after
`rederiveForPage`, the hidden rows out — a masked row or a row stamped hidden): P1 `rulingStructure.js :: generatePowerStructure`
over the page (R5C2's / R5D-0's call), the late options the page holds; P2 each served card's base = B's card of the same name,
cut by R5D-0's standing table; else a minted rival: `applyDensityLaw.js :: rivalDescOf` (not exported: the engine's own source
text, evaluated) over its host's B card, or the host's copy, the host found by `contestsNiche` or, where none is served, as B's ONE
non-seat card of the rival's kind; P3 `claimStanding.js :: settleClergyToFinalRoster` and `settleArcaneToPractitioners` over the
served roster. **Read finding (CONFIRMED by read and by run): no engine picker for T02–T11 and T14 takes a roster: generatePowerStructure
derives the seat itself from `config` and the houses (`chooseGoverning` / `drawCouncilOfAKind`), so "over the served roster" means,
for these, "not reading the hidden row at all"; the roster readers are only `reeveToRoster` (T01, not exported), `rivalDescOf`
(T12/T13, not exported) and `settleClergyToFinalRoster`.**

## M1 — THE 13 (server, both reads; the 6,528 pages; served instances by the card's kind)

| id | `path :: symbol` | picked by | reads (kind) | writes (kinds, by the read) | served off / dm | by card kind (served, both reads) | |
|---|---|---|---|---|---|---|---|
| T01 | `rulingStructure.js :: generatePowerStructure` govDescByLabel['Elected Reeve']; kept by `applyDensityLaw.js :: reeveToRoster` | noblePower over the gate or a noble house; then a noble power on the roster or a noble house | noble (power or house) | government (the reeve seat) | 0 / 0 | – | CONFIRMED |
| T02 | same :: nobleDesc "Hereditary landowners behind the ${governingFaction}…" | hasNobleInst && the seat noble-kind && military very_high; prints the seat's NAME | the SEAT | noble | 35 / 35 | noble 70 | CONFIRMED |
| T03 | same :: nobleDesc (nobleGoverns rungs) | the seat noble-kind, noblePower rung | the SEAT | noble | 107 / 107 | noble 214 | CONFIRMED |
| T04 | same :: nobleDesc (merchantAligned) | the seat Merchant oligarchy / Democratic assembly / Guild Council | the SEAT | noble | 36 / 36 | noble 72 | CONFIRMED |
| T05/06 | same :: nobleDesc (Royal Authority; council seat or not) | the seat | the SEAT | noble | 0 / 0 | – | CONFIRMED |
| T07 | same :: merchantDesc (merchantGoverns) | the seat a merchant council / oligarchy | the SEAT | economy | 143 / 143 | economy 286 | CONFIRMED |
| T08 | same :: militaryDescFinal "Operationally distinct from the command council…" | the seat a military council / martial | the SEAT | military | 94 / 94 | military 188 | CONFIRMED |
| T09 | same :: religiousDesc (Theocratic, Church Council, ecclesiastical) | the seat | the SEAT | religious | 48 / 48 | religious 96 | CONFIRMED |
| T10 | `stressFactions.js :: applyStressEventFactions` (politically_fractured, indebted, succession_void) | the seat 'Royal Authority' or not; S = hasNobleInst | the SEAT | noble, other (injected powers); noble (the crown-debt line) | 375 / 375 | other 726, noble 24 | CONFIRMED |
| T11 | same (religious_conversion) | the seat's NAME length mod 3 (a draw only where no seat) | the SEAT | religious, other | 0 / 0 | – | CONFIRMED |
| T12 | `applyDensityLaw.js :: rivalDescOf` (RIVAL_DESC_OF_HOST) | the HOST's opening line | the HOST (military, government, criminal, other) | the host's kind | 276 / 276 | military 548, criminal 4 | CONFIRMED |
| T13 | `applyDensityLaw.js :: resizePoliticalRoster` (the mint's `{ ...host }`) | the HOST's presence | the HOST (any) | the host's kind | 987 / 987 (minted rivals whose base copies another power's) | economy 740, religious 522, noble 336, magic 144, other 116, military 96, criminal 20 | CONFIRMED |
| T14 | `claimStanding.js :: settleClaimsToLabel` (SEAT_WORDS, ARCANE…UNDER_ARCANE_SEAT, UNDERWORLD_UNDER_STRONGER_SEAT) / `settleClergyToFinalRoster` (CLERGY_WITH_WEIGHT) | the seat: council or not, magic, its label's rank, its power | the SEAT | economy, noble, military; magic; criminal; religious | 215 / 215 | magic 144, economy 142, religious 72, noble 72 | CONFIRMED |

A card may match two ids (a T13 copy of a T07/T09/T10 base counts under both). Minted rivals served: 2,550 (both reads); **the host
link `contestsNiche` is served on 0 of them** (the record carries it; the share strips it): CONFIRMED. The reads/writes columns are
the read of the writers (CONFIRMED by read; the served kinds column is the run's).

## M2 — FIDELITY on the nothing-hidden pages (5,118 pages; the picker over the served roster; count of count)

| id | server: reproduced byte for byte / served | twin | seeds r5d1-a vs r5d1-b | misses by cause (server; twin the same) | |
|---|---|---|---|---|---|
| T01 | 0 / 0 | 0 / 0 | – | – (but see below: the picker writes it where the engine withdrew it) | CONFIRMED |
| T02 | 70 / 70 | 70 / 70 | equal 70 / 70 | – | CONFIRMED |
| T03 | 194 / 194 | 194 / 194 | equal 194 / 194 | – | CONFIRMED |
| T04 | 52 / 52 | 52 / 52 | equal 52 / 52 | – | CONFIRMED |
| T05/06, T11 | 0 / 0 | 0 / 0 | – | – | CONFIRMED |
| T07 | 130 / 206 | 130 / 206 | equal 130 / 206, a≠b 0 | 76 **no host link served**: a minted rival (T13 copy of the merchants' base), its kind holds several B cards | CONFIRMED |
| T08 | 168 / 168 | 168 / 168 | equal 168 / 168 | – | CONFIRMED |
| T09 | 96 / 96 | 96 / 96 | equal 96 / 96 | – | CONFIRMED |
| T10 | 496 / 590 | 496 / 590 | equal 496 / 590, a≠b 0 | 94 no host link served (a rival copying an injected stress power) | CONFIRMED |
| T12 | 142 / 432 | 142 / 432 | equal 142 / 432, a≠b 0 | 290 no host link served (the rival's kind, military, holds several B cards) | CONFIRMED |
| T13 | 928 / 1,598 | 928 / 1,598 | a≠b 0 (866 checked) | 630 no host link served; 40 the host by kind, its base differs (2 births: the host itself rewritten after the power step, e.g. r3m-city-politically_fractured-1-120 The Devout Circle) | CONFIRMED |
| T14 | 258 / 306 | 258 / 306 | equal 258 / 306, a≠b 0 | 28 no host link served; 20 `assembleSettlement` rewrote it after the power step (r3m-metropolis-none-1-131 Merchant Guilds: a label rung) | CONFIRMED |

**The picker's seat equals the served seat on 2,559 / 2,559 nothing-hidden server pages; every presence-picked base the picker
finds BY NAME reproduces byte for byte (T02, T03, T04, T08, T09 whole; T07/T10/T12/T13/T14's name-found cards all but the 20
`assembleSettlement` rewrites). NO SEED DRAW SITS INSIDE a presence-picked base: under two named seeds the picked bases never
differ (0 of every id)** — CONFIRMED in this set (the rival's NAME and the doubled niche are draws; its base is not). **The misses
are one cause: the share serves no host link, and a minted rival's name is drawn, so where its kind holds more than one card the
page cannot tell its host.** Cards that would LOSE their base on a shared page under the rule as written (a presence-picked card
the picker does not reproduce), server: **980 of 12,933 cards (7.6%); 29.5% of the 3,322 presence-picked cards**; by how: no host
920, picked-and-differs 60. By kind: economy 484 / 3,421 (14.1%; 71.2% of its 680 presence-picked), military 362 / 2,972 (12.2%;
52.3% of 692), other 94 / 776 (12.1%; 16.0% of 588), noble 20 / 1,178 (1.7%), religious 20 / 2,266 (0.9%), criminal, magic,
government 0. By size: city 546 / 4,188 (13.0%; 37.7% of 1,448), metropolis 434 / 5,222 (8.3%; 29.8% of 1,458), town 0 / 2,584,
village 0 / 939. CONFIRMED. That serving `contestsNiche` (or the host's name) would close the 920: PLAUSIBLE (the picker's
`contestsNiche` branch exists; no served document carries the field to test it). **T01 outside the table:** on
r3m-village-none-0-1 the served reeve is the twin (`reeveToRoster` withdrew "under noble oversight"), and the picker, reading config,
writes T01 back: the rule needs `reeveToRoster` too (not exported). CONFIRMED (1 birth).

## M3 — THE DIFFERENTIAL on hand hides (the hiding read's picked base vs the same place with that power NEVER THERE)

"Never there" = the same record less the power's rows (both lists) and its relations, re-saved, served by both engines; the hide is
`hidden: true` on its rows (the act's own stamp). Read off (unmarked; lit: off and dm).

| set | reads | hidden row served / masked | cards (hidden row out) | picked equal / picked | no pick (cause) | picked vs the hiding read's served base | |
|---|---|---|---|---|---|---|---|
| PLANTS: a density HOST hidden by hand (77 births; 63 have no host) | off, server | 0 / 0 | 462 (75 presence-picked) | **412 / 412** | 50 (no host link served) | 20 differ: 19 a STANDING left on the served base naming the mask (the table does not cut "an unseen interest"), 1 truncated past 220 chars (PLAUSIBLE the same) | CONFIRMED |
| same | off, twin | 0 / 0 | 462 | 412 / 412 | 50 | the same | CONFIRMED |
| PLANTS: a NOBLE power hidden by hand (39 births; 101 have none) | off, server / twin | 0 / 0 | 234 (40 presence-picked) | **220 / 220** | 14 (no host link served) | 6, every one a standing naming the mask | CONFIRMED |
| LIT act T (40 acts of 60 births; jp6-city-8 hides Noble Families) | off server / twin (40 hiding reads) | 0 / 0 | 179 (27 presence-picked by the served base or the pick) | **146 / 146** | 33 (23 not minted by the picker: the act's renamed seat; 10 no host link) | 10 differ: 5 the act's NEW SEAT card kin-paired to an unserved B card (its served base is the seat line, no template); 5 a standing residue on one side, the base equal | CONFIRMED |
| same | dm server / twin (the row served) | 40 / 0 | 179 | 146 / 146 | 33 | 9 | CONFIRMED |

jp6-city-8 (Noble Families hidden, the taker): 6 cards, 5 equal hide vs never, the 6th "The Grey Council" (T10, no host link);
Religious Authorities T14 and The Independent Bloc T10 equal to the served base. **On every hand hide and every act T read, the
picked base on the hiding read equals the never-there base wherever the picker picks one (778 / 778): CONFIRMED.** Two cautions,
by the figures: (1) the equality is BY CONSTRUCTION for T02–T11 and T14 — the picker reads config, so the hidden power never enters
it, and generatePowerStructure re-mints a hidden power from config on both documents (R5D-0: 930 hiding pages): PLAUSIBLE that this
is what "never there" should mean; the measure cannot build a birth without the power. (2) After the DM's act the picker's seat is
the BORN seat on 0 / 40 matching the served seat (e.g. jp6-city-8 served Royal Authority, picked City Council); it still reproduces
the stored bases, which the born seat picked — fidelity to the record holds, truth to the new seat is not measured here: CONFIRMED
(count), PLAUSIBLE (consequence).

## THE PARAGRAPH (by the figures)

The rule can be exact for the seat-picked bases: the picker reproduces T02, T03, T04, T08, T09 whole (580 / 580) and every
name-found T07/T10/T12/T13/T14 card but 20, with no seed draw inside any presence-picked base (a≠b 0), and it reads no hidden row,
so the hiding read and the never-there place agree on 778 / 778 picked cards. It is NOT exact for the minted rivals: the share
serves no host link (`contestsNiche` 0 of 2,550), so 920 presence-picked cards (7.1% of all nothing-hidden cards, concentrated in
city and metropolis economy and military) get no base, and 60 more are picked wrong (40 copies of a host rewritten after the
power step; 20 `assembleSettlement` label rewrites). The rule also needs the two roster settlers the engine does not export
(`reeveToRoster`, `rivalDescOf`). What is left: whether serving the host link closes the 920 (not testable without the field);
the "never there" meaning for config-picked bases and the post-act seat (the owner's / chair's reading).
