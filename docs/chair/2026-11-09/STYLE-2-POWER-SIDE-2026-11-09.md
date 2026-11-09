# STYLE-2 POWER-SIDE (SW-7) — the power-side lines under the owner's style law (2026-11-09)

**Seat:** SW-7 POWER-SIDE (Claude Opus 5.5), session `session_01FbPLbd7aiAGgCz7CpasFhU`, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`) under the owner's full delegation. **Branch:** `lane/style-2-power-side-2026-11-09`, cut at `0f2e6c097` exactly (the merge train's pushed tip after its fourth point: cars 1, 2, 3 and WRITE-TITLES-14 merged). The cut was made as a separate worktree because the in-place `git checkout -b` in the seeded checkout was refused by the classifier; the seeded checkout was left untouched. **Law:** WIRING-RULINGS-2026-11-07 §5–§8; STYLE-RULINGS-2 A2, A3 (the catalogue law), A9, B7, B10(b), the block law, the census law and the refusal line; BRIEF-STYLE-2-WAVE §0 and its SW-7 rows. **Worklists:** STYLE-AUDIT-2-SOURCES §2.5 and the A9 / A3 rows naming SW-7's files; STYLE-AUDIT-2-SURFACES §2·A P6–P12, §2·D P45–P51, F19–F24 and §7·F F4/F5/F8.

Every line below is old → new for the owner's veto. Merged by STYLE-2-MERGE after the train; this lane signs nothing.

## 0. The measurement at the base (`0f2e6c097`)

- **The twelve** (the surfaces audit's §0 seeds `soak1k-0 … soak1k-11`): `node scripts/audit/soak-review.mjs --count 12 --workers 2` → exit 0, 12 settlements, 0 errors, 6 findings, CLIMB.
- **The 1,000:** `node scripts/audit/soak-review.mjs --count 1000 --workers 4` → exit 0 in 260 s, 1,000 settlements, 0 errors, 702 findings, CLIMB.
- **The generator golden master** re-hashed at the base by a scratch tool that calls the gm test's own `generateSettlementPipeline` over `tests/helpers/goldenMasterCorpus.js`: 0 of 525 rows differ from the committed fixture, so the tool is the test's measure. Every gm delta below is that tool at the parent and at the commit, with the top-level fields that moved.
- **The referee's twenty frames** (`aggregates/repetition-prose.json`, the non-chrome top twenty) at the base, and the power-side frames among the top forty:

| # | towns | writer | frame |
|---|---|---|---|
| 1 | 439 | general.generated.js | generations of patching and rebuilding have nearly hidden the plan @ was laid out to. |
| 2 | 367 | (unattributed) | the old families keep the peace, and anyone who breaks it answers to all the neighbours at once… |
| 3 | 306 | defenseDisplay.js | one criminal ring decides what crime is allowed here. |
| 4 | 306 | defenseDisplay.js | its rules are predictable and it can be bargained with… |
| 5 | 297 | power.generated.js (DS-POW-2, the governance block: OWNER-WORDS-DOSSIER's) | anything official at @ goes to @, and people say little more than that. |
| 6 | 293 | safetyProfile.js | a functioning court and prison mean crimes carry real consequences. |
| 7 | 263 | (unattributed) | everyone comes and goes by the gates, so smugglers have to get past the garrison and city watch. |
| 8 | 260 | (unattributed) | effective against opportunistic crime; less effective against organized operations… |
| 9 | 232 | general.generated.js | @ buys in what it cannot make… |
| 10 | 225 | economy.generated.js | @ is short more often than not. |
| 11 | 225 | economy.generated.js | some needs are met and some are postponed… |
| 12 | 208 | economy.generated.js | every month something it needs waits for money that does not come. |
| 13 | 206 | safetyProfile.js | a court exists, though the prison system is limited. |
| 14 | 203 | (unattributed) | few in @ hold an office. |
| 15 | 203 | crisisBlindFindings.js | it is not a subject anyone raises unprompted. |
| 16 | 199 | economy.generated.js | there is always something going out. |
| 17 | 199 | economy.generated.js | if one trade is quiet, another is not. |
| 18 | 195 | defense.generated.js | the defensive arrangements at @ are thin. |
| 19 | 195 | defense.generated.js | something is in place against most pressures and nothing is in place in depth. |
| 20 | 194 | economy.generated.js | the yards here are full of goods bound out and no two of them are the same. |
| P1 | 190 | **power.generated.js DS-POW-6 (this lane's)** | criminals are buying their way into the hall at @. |
| P2 | 168 | dmPowerLines.js (WRITE-PEOPLE's, the DM panel) | when @ wants something from @, @ is the one who asks for it. |
| P3 | 167 | power.generated.js (DS-POW-1/2, the governance block) | nobody at @ speaks for the whole place any more… |

None of the twenty is this lane's writer except through `safetyProfile.js` (#6, #13 — SW-B5's frames; this lane holds that file's one "rather than" row only). The frame of this lane's own is P1 (190).

## 1. The commits, one cause each (in print order: the Power tab below the governance block first)

| commit | cause | gm /525 | prose cells | other |
|---|---|---|---|---|
| `df6a9bb9c` | B7 P9 — the Web's merchant-craft line names the landholding power or none ("the landlords") | **212** (town 92, city 36, metropolis 84; `powerStructure` alone) | 0 | — |
| `e76cb0ab7` | B7 P10–P12 — 21 lines of DS-POW-4/5/6 through the annex door | 0 | **1,175 WORDING-ONLY** (525 towns) | the wiring census re-written through its door; seven walker figures re-keyed (§3) |
| `8957313b3` | B7 P10 — "The shape of authority" reads the SEAT (`cohesionWeave :: seatLensOf`), not the strongest power | 0 | 0 | red-first 2/3 → 3/3; PDF snapshot green |
| `44bea15c5` | B7 P11 — "Rule and succession" is silent on an empty seat | 0 | 0 | red-first 1 → green; the census re-stamped |
| `25b8d4067` | B7 P49 — the PDF power card drops "raw NN" | 0 | 0 | PDF snapshot 0 (goldenViewModel green) |
| `3728083ef` | A2 · B7 P51 — 31 lines of `factionStanding.js` (the power cards' standing sentences) | **429** (thorp 84, hamlet 60, village 12, town 105, city 84, metropolis 84; `powerStructure` alone) | 0 | — |
| `7c96f27aa` | the refusal line — eight DS-POW-4/5/6 lines take the town's own tier noun | 0 | **360 WORDING-ONLY** (178 towns) | the crisis-blind claim re-anchored |
| `d85a76def` | A2 — 7 rows of `rulingPower.js` (the transfer of power's government lines) | 0 | 0 | play-time only |
| `d77089fcb` | register — the observed-shape baseline re-frozen through its `--write` door for power.generated.js (the input of `e76cb0ab7` / `7c96f27aa`) | 0 | 0 | no product byte |
| `084149281` | B7 P10 — the seat's lens reads the birth roster's own categories (`economy` → the merchant seat; an unplaceable category → no line) | 0 | 0 | red-first; tsc 167 = 167 |
| `c1d64ef0f` | A2 · B7 P10 — the merchant seat's v3 loses "not being overthrown" (the pool, dark at the base, now prints on 171 towns) | 0 | 0 | — |
| `0d3a4259c` | register — the observed-shape baseline re-frozen through its door for `c1d64ef0f`'s input | 0 | 0 | no product byte |

## 2. Every line, old → new

### 2.1 `df6a9bb9c` — `src/generators/factionDynamics.js :: computeFactionRelationships` (the Web, Merchant ↔ Craft, ratio 0.7–1.8)

| OLD | NEW |
|---|---|
| `{merc} and {craft} vote together against the landlords, then fight over who keeps the profit.` | with a noble / gentry / manor power on the roster: `{merc} and {craft} vote together against {noble}, then fight over who keeps the profit.` · with none: `{merc} and {craft} vote together whenever trade is at stake, then fight over who keeps the profit.` |

Census law: `noble` is the roster read the function already makes (`find('noble', 'landed gentry', 'manor')`); no other clause added. Not taken: the "(dominant)" suffix in "Merchant Guilds (dominant)" (soak1k-10) is part of a minted faction NAME (SW-8's label map), not this line.

### 2.2 `e76cb0ab7` — `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` DS-POW-4/5/6 → `src/data/dossierStateProse/power.generated.js`

The slots each block fills are `{settlement}`, `{seat}` (the governing body's name), `{faction}` (the same name) and, in DS-POW-4, `{counterpart}` (the top challenger) — `powerStateProse.js :: powerStateProse`. No line names a slot outside its block's bag, and no pool's variant count moved.

| # | block | variant | OLD | NEW |
|---|---|---|---|---|
| 1 | DS-POW-4 | v1 `[ledger · succession settled · no crisis: unrest]` | Nobody at {settlement} is in a position to take the {seat}. {faction} has no rival for it, and the succession question is not a live one here. | Nobody at {settlement} is in a position to take {faction}'s place; it has no rival, and nobody is asking who comes next. |
| 2 | DS-POW-4 | v3 `[counterforce · succession settled · no unrest]` | People at {settlement} grumble, but nobody stands ready to lead them; the {seat} is safe for the plainest reason a seat can be safe. | People at {settlement} grumble, but nobody stands ready to lead them, so {faction} is safe in the hall. |
| 3 | DS-POW-4 | v6 `[ledger · succession settled · unrest]` | No rival stands at {settlement} to take the {seat}, and in a season of fighting that is small comfort: what threatens {faction} now is the fighting itself, not a contender for the hall. | No rival stands at {settlement} to take {faction}'s place, and in a season of fighting that is small comfort: what threatens {faction} now is the fighting itself. |
| 4 | DS-POW-4 | v1 `[ledger]` | {faction} outweighs everyone at {settlement} who wants the {seat}, and they make no secret of wanting it. The hold is real, and it is not comfortable. | {faction} outweighs everyone at {settlement} who wants its place, and they make no secret of wanting it. {faction} holds on, but has to watch them. |
| 5 | DS-POW-4 | v1 `[ledger]` | {counterpart} now outweighs the {seat} at {settlement}, and what keeps {faction} in the hall is the office rather than the strength behind it. | {counterpart} now has more people behind it than {faction} at {settlement}; {faction} keeps the hall only because the office is still its own. |
| 6 | DS-POW-4 | v4 `[visitor]` | Visitors to {settlement} are quietly told to stay polite to two houses, not one, and nobody explains why. | Visitors to {settlement} are quietly told to stay polite to {counterpart} as well as to {faction}, and nobody says why. |
| 7 | DS-POW-4 | v3 `[unfolding]` | Everyone at {settlement} can see the {seat} is exposed. What has not happened yet is a move by someone able to make it. | Everyone at {settlement} can see {faction} could lose the hall, and {counterpart} has not yet moved to take it. |
| 8 | DS-POW-5 | v2 `[street]` | The town does not wait long for an answer and does not always like the answer it gets, and has no procedure for getting a different one. | At {settlement} one person gives the answer, and gives it quickly, and there is nobody to ask for a different one. |
| 9 | DS-POW-5 | v3 `[unfolding]` | The {seat} at {settlement} answers to one person, and that person's danger is the people closest to them, not the town. | The {seat} at {settlement} answers to one person, and if that person falls it will be at the hands of someone close to them. |
| 10 | DS-POW-5 | v2 `[street]` | The town's business goes to a body rather than a person, and everybody has learned how long a body takes. | At {settlement} the town's business goes to the whole {seat}, and everybody has learned how long the answer takes. |
| 11 | DS-POW-5 | v2 `[street]` | The town takes its civic questions to the same place it takes its spiritual ones, and does not experience the two as separate. | The town takes its quarrels over land and law to the same people it takes its prayers to. |
| 12 | DS-POW-5 | v3 `[unfolding]` | What threatens the {seat} at {settlement} is heresy rather than opposition. A rival creed is a challenge to the right to govern, and everybody involved understands it that way. | What threatens the {seat} at {settlement} is heresy more than any rival: a rival creed challenges its right to govern, and everybody involved knows it. |
| 13 | DS-POW-5 | v2 `[street]` | The town is run by people who are also its creditors, and the two roles are not kept meaningfully apart. | The people who run {settlement} are also the people it owes money to, and they do not keep the two apart. |
| 14 | DS-POW-5 | v1 `[ledger]` | Nothing at {settlement} governs cleanly. The {seat} is an arrangement between kinds of power, and it decides at the pace of whichever of them is least willing. | Nothing at {settlement} governs cleanly: the {seat} is several kinds of power sitting together, and it moves only as fast as the most reluctant of them. |
| 15 | DS-POW-5 | v2 `[street]` | Power at {settlement} is shared between several kinds of people, and no one of them is in charge. | At {settlement} no one power is in charge; the {seat} decides only what its members can agree on. |
| 16 | DS-POW-5 | v3 `[unfolding]` | No part of the {seat} at {settlement} can rule alone, so they rule together. If one grows strong enough to go it alone, the arrangement ends. | No part of the {seat} at {settlement} can rule alone, so they rule together, and each watches for the day one of them can do without the others. |
| 17 | DS-POW-6 | v1 `[unfolding · dm-only]` | Criminals are buying their way into the hall at {settlement}. The town is poor and its streets poorly guarded, so a bribe goes a long way. | Criminal money is reaching the officials of {settlement} one at a time, because the town is poor and its streets are badly watched, and a bribe goes a long way here. |
| 18 | DS-POW-6 | v2 `[ledger · dm-only]` | Each season it gets easier to buy an official at {settlement}: the town stays poor, the streets stay badly guarded, and nobody is fixing either. | Each season it gets easier to buy an official at {settlement}: the town stays poor, the streets stay badly guarded, and nobody in the {seat} is mending either. |
| 19 | DS-POW-6 | v3 `[street · dm-only]` | Money is being spent at {settlement} on people who cannot account for having it, and the accounting is not being asked for. | Officials at {settlement} are spending money their posts never paid them, and nobody is asking where it came from. |
| 20 | DS-POW-6 | v1 `[ledger · dm-only · colour]` | Settle before play which officials of the {seat} at {settlement} have an understanding with {faction}, and what each one owes; every name is a thread the party can pull. | Some officials of the {seat} at {settlement} have an understanding with {faction}, and each owes it something different; every one of them is a thread the party can pull. |
| 21 | DS-POW-6 | v2 `[street · dm-only · colour]` | Some of the {seat}'s people at {settlement} are in {faction}'s pocket. Decide who they are and what they would lose if it came out, and the hooks write themselves. | Some of the {seat}'s people at {settlement} are in {faction}'s pocket, and each of them has something to lose if it comes out. |

**Struck under the census law** (the audit's proposals for P10–P12 named facts these pools do not receive): the seat-holder's personal name and title ("Everything in Portaminus waits on Tertullian Corvinus, the governor"), the challenger's speaker ("Chae Liu is working to change that"), "the nearest rival fact", "the bought member line" — the desk's bag holds no person; each was left out, and the lines speak of the bodies the bag names.

**The refusal line, P1:** "Criminals are buying their way into the hall at @." (190 towns) is reworded as ONE sentence that carries the tier noun ("the town" → the tier's own word), so the frame splits by tier; the before → after count on the 1,000 is in §4.

### 2.3 `8957313b3` — the seat's lens (no new words)

`src/domain/spatial/cohesionWeave.js :: seatLensOf` (new) reads the governing row (`isGoverning`) through the same `ARCHETYPE_TO_RULING` table; `PowerTab.jsx` and `src/domain/display/stateProse/printProse.js` (the PDF) read it for DS-POW-5 (and DS-POW-7's presence key, which reads the same lens). `structuralLensOf` and the generosity kernel are untouched. At the base the twelve printed: soak1k-10 "The Noble Governorship at Olympambelos rules by its faith"; soak1k-8 "The Headman's Authority at Achileia rules by its faith"; soak1k-5 "The Grand Merchant Oligarchy at Suryanagar answers to one person"; soak1k-11 the Grand Merchant Senate under the `mixed` arm. The files outside the lane's first list (cohesionWeave.js, printProse.js) were taken under the STOP's default sent to the chair.

**printProse.js against OWNER-WORDS-DOSSIER (the chair's sequencing ruling, read after the fact).** The ruling to make the PDF-caller change last, against the train's fifth point, reached this seat after `8957313b3` had landed. Read at the integration tip `8b75f466a`: OWNER-WORDS-DOSSIER's only hunk in `printProse.js` is at its lines 465–470 (`put('overview', 'overview.market', g.siteLines)`); this lane's two lines are the import (:92) and the power desk's `structuralLens: seatLensOf(r)` (:408). No overlapping hunk — for STYLE-2-MERGE, a clean compose. The chair's pin ("a planted empty seat never rules by its faith; the ruling arm reads the SEAT's category") is held by `powerStateProseDesk.test.js`'s seat-lens arms (the noble seat under a stronger clergy; the vacant `government` seat reads `council`).

**The follow-up, `084149281`.** Read on the twelve at `8957313b3`'s tip: the birth roster's categories are coarser than the table (soak1k-2 Elected Reeve `other`, soak1k-3 Guild Council `economy`, soak1k-5 Grand Merchant Oligarchy `economy`; `magic` elsewhere), and every unnamed category fell to the `mixed` default — "Nothing at Copanucan governs cleanly: the Elected Reeve is several kinds of power sitting together". `economy` now maps to the merchant seat, and a category the table cannot place answers no lens, so the ruling line is silent there.

### 2.4 `44bea15c5` — the empty seat (no new words)

`powerStateProse.js :: seatVacantOf` reads the governing row's `vacant` modifier (the fact `powerStrata.js :: rulingChainOf` prints "Stands empty; the succession is unsettled"); the DS-POW-4 risk key is null there. At the base soak1k-8 printed under "Stands empty": "Religious Authorities now outweighs the Headman's Authority at Achileia, and what keeps Headman's Authority in the hall is the office rather than the strength behind it." A vacancy POOL was drafted and withdrawn: a new pool moved some thirty corpus registers (pool and variant totals in the projection, the census, the move-grammar, the wave gate and the entry-contradiction walkers) for a sentence the ruling chain already says an inch above.

### 2.5 `25b8d4067` — `src/pdf/sections/PowerStructure.jsx` (the PDF power card's bar)

| OLD | NEW |
|---|---|
| `Power 100 · Dominant · raw 76` (BarMeter sublabel `raw ${rawPower}`) | `Power 100 · Dominant` (no sublabel) |

Census law: the audit's "on its own: strong" band is struck — the raw-to-effective gap mixes the legitimacy multipliers with the renormalisation to 100, so a band word on it would state a cause the card does not hold.

### 2.6 `3728083ef` — `src/generators/power/factionStanding.js :: annotateFactionStanding` (the power cards' standing sentences)

The audit's NEW was the draft, read against what the function holds (rank, the neighbours' powers, the roster's names, `force.body`). Rows 7–8 are the fallback names (the approved map's word). Rows 20 and 27 are the "arrangement" tic, not in the audit's list.

| # | OLD | NEW |
|---|---|---|
| 1 | The dominant order is genuinely contested; a single shift in circumstance could reorder everything. | No one clearly leads here; one scandal or one lost ally could change who does. |
| 2 |  but not comfortably: they are watching for leverage, not deferring. |  but not comfortably: they are waiting for a chance to push back. |
| 3 | Close enough to the top to resist, far enough behind to be cautious. | They are strong enough to resist those above them, but too far behind to risk an open fight. |
| 4 |  by enough margin that direct challenge is not viable: they route their influence through procedure, not confrontation. |  by too much to challenge openly, so they get their way through petitions and procedure instead. |
| 5 | The hierarchy is settled for now; their energy goes into consolidating second place, not chasing first. | The order is settled for now; they are busy holding on to second place and make no move on first. |
| 6 | Genuinely three-way territory: no faction has decisively broken from the pack; every council vote is negotiated. | Three powers stand almost level here, and no one leads; every council vote has to be bargained for. |
| 7 | (higherNeighbor ? higherNeighbor.faction : 'the second faction') | (higherNeighbor ? higherNeighbor.faction : 'the second power') |
| 8 | (factions[0] ? factions[0].faction : 'the top faction') | (factions[0] ? factions[0].faction : 'the leading power') |
| 9 | A reliable third presence: too significant to exclude from negotiations, not strong enough to set their own terms. | They are always at the table, but cannot set their own terms. |
| 10 | Their leverage is narrow and issue-specific; on broader questions they follow whoever is willing to deal with them that week. | They have a say on only a few matters; on everything else they side with whoever will deal with them that week. |
| 11 | The craft guilds currently outweigh them in raw political numbers. An uncomfortable inversion the merchants are working to correct. | The craft guilds currently carry more weight than they do, and the merchants are working to change that. |
| 12 | The merchants consistently outvote them on pricing and labour standards. Craft masters have learned to attach riders to deals rather than fight directly. | The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal. |
| 13 | The ${force.body} outweighs them institutionally. They survive by corrupting the lower ranks and making enforcement selectively unprofitable. | The ${force.body} is far stronger. They survive by bribing the lower ranks and making it costly to arrest the wrong people. |
| 14 | They currently outflank the military in real leverage; there are officers on payroll and commanders who know better than to ask questions. | They have more real pull than the military right now: officers on their payroll, and commanders who know better than to ask questions. |
| 15 | Running roughly even with the military in actual influence: the ${force.body} can arrest individuals, the guild can make the investigation expensive. | They are roughly even with the military: the ${force.body} can arrest their people, and the guild can make every investigation costly. |
| 16 | The guild has more real leverage than they do. Selective enforcement is the only tool that still works, and everyone knows it. | The guild is stronger than they are. They can only make arrests where it is safe to, and everyone knows it. |
| 17 | They outmatch the guild institutionally, which keeps the criminal operation suppressed rather than eliminated. There is a difference. | They are stronger than the guild, enough to keep it down but not to stamp it out. |
| 18 | Running a slow institutional war with the guild: arrests happen, networks rebuild, deals are struck and quietly violated. | A slow war with the guild: arrests are made, the gangs rebuild, deals are struck and quietly broken. |
| 19 | The criminal network has more operational reach than the merchant guilds right now. Some merchants are paying protection; others have become silent partners. | The criminal network reaches further than the merchant guilds right now. Some merchants are paying for protection; others have become silent partners. |
| 20 | They tolerate the guild's cut because fighting it costs more than paying it; the arrangement is not advertised. | They tolerate the guild's cut because fighting it costs more than paying it, and nobody says so aloud. |
| 21 | The merchant guilds now hold more functional leverage: the noble families retain title, hereditary land, and social precedence, but the money has moved. | The merchant guilds now have more say: the noble families keep their titles, their land and their precedence, but the money has moved. |
| 22 | The merchants are closing the gap; the noble families are using every legal and social mechanism to slow a transition that looks increasingly inevitable. | The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down. |
| 23 | The steward administers in the lord's name. The household is the source of that authority, not a rival to it, but the practical question of who signs what has become genuinely complicated. | The steward rules in the lord's name, and the household is where that right comes from, but who signs what has become a tangle. |
| 24 | The steward holds the day-to-day authority; the household provides the legitimacy. In practice the line between them blurs whenever a petitioner finds one more receptive than the other. | The steward runs things day to day; the household gives the steward the right to. When a petitioner finds one of them more willing than the other, the line between them blurs. |
| 25 | The steward nominally governs but defers here more than the arrangement was designed to allow. | The steward governs in name, but gives way to them more often than was ever intended. |
| 26 | Overlapping claims with the steward create an ambiguity that everyone exploits: petitioners approach whichever authority is more likely to give the answer they want. | They and the steward both claim the same authority, so petitioners go to whichever is likelier to say yes. |
| 27 | The steward and the household have developed a working arrangement, but its terms are renegotiated whenever something important is at stake. | The steward and the household have worked out who does what, but they bargain it again whenever something important is at stake. |
| 28 | The arcane orders currently hold more practical influence, which the clergy finds spiritually troubling and politically unacceptable. | The arcane orders have more say right now, and the clergy cannot accept it. |
| 29 | The clergy hold more civic influence: the arcane orders operate by navigating rather than challenging religious authority. | The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly. |
| 30 | The criminal network currently outweighs them. The clergy's moral authority is loud and largely unheeded. | The criminal network is stronger than they are. The clergy preach against it loudly, and few people listen. |
| 31 | They and the religious authorities operate parallel systems of social control. The ${force.body} handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume. | They and the religious authorities both keep people in line. The ${force.body} deals with bodies and the clergy with minds, and each wishes the other would keep quieter. |

**Not cured here (SW-B1's, B1 "the power cards"):** the sentences are written at `rulingStructure.js :: normalizeAndAnnotateFactions`, before the legitimacy multipliers and the later steps re-order the roster, so a "Behind the governing council" can stand on a card whose final power is higher (SURFACES P51, soak1k-3's Thieves' Guild 39 over the Guild Council's 37). The cure is a reader of the final order.

### 2.7 `7c96f27aa` — the refusal line (the annex again)

| # | OLD | NEW |
|---|---|---|
| 1 | Nobody at {settlement} is in a position to take {faction}'s place; it has no rival, and nobody is asking who comes next. | Nobody at {settlement} is in a position to take {faction}'s place; it has no rival, and nobody in the town is asking who comes next. |
| 2 | People at {settlement} grumble, but nobody stands ready to lead them, so {faction} is safe in the hall. | People at {settlement} grumble, but nobody in the town stands ready to lead them, so {faction} is safe in the hall. |
| 3 | No rival stands at {settlement} to take {faction}'s place, and in a season of fighting that is small comfort: what threatens {faction} now is the fighting itself. | No rival stands at {settlement} to take {faction}'s place, and in a season of fighting that is small comfort: what threatens {faction} now is the fighting across the town. |
| 4 | {faction} outweighs everyone at {settlement} who wants its place, and they make no secret of wanting it. {faction} holds on, but has to watch them. | {faction} outweighs everyone at {settlement} who wants its place, and the whole town knows who they are. {faction} holds on, but has to watch them. |
| 5 | Nothing at {settlement} governs cleanly: the {seat} is several kinds of power sitting together, and it moves only as fast as the most reluctant of them. | Nothing at {settlement} governs cleanly: the {seat} is several kinds of power sitting together, and the town waits on the most reluctant of them. |
| 6 | At {settlement} no one power is in charge; the {seat} decides only what its members can agree on. | At {settlement} no one power is in charge, and the town gets only what the {seat}'s members can agree on. |
| 7 | No part of the {seat} at {settlement} can rule alone, so they rule together, and each watches for the day one of them can do without the others. | No part of the {seat} at {settlement} can rule alone, so they rule the town together, and each watches for the day one of them can do without the others. |
| 8 | Officials at {settlement} are spending money their posts never paid them, and nobody is asking where it came from. | Officials at {settlement} are spending money their posts never paid them, and nobody in the town asks where it came from. |

### 2.8 `d85a76def` — `src/domain/rulingPower.js :: GOVERNMENT_DESCS` (dark: a transfer of power in play)

| # | OLD | NEW |
|---|---|---|
| 1 | Officers govern; security doctrine sets policy and the chain of command is the chain of authority. | Officers rule; orders come down the chain of command, and keeping the place safe comes first. |
| 2 | Clergy govern; doctrine legitimises political authority and the temple calendar shapes civic life. | Clergy rule; their faith gives them the right to, and the temple's calendar sets the year. |
| 3 | Commercial power governs; ledgers decide policy and civic access tracks net worth. | The merchants rule; money decides policy, and the richer you are, the more say you have. |
| 4 | A noble line governs; precedence, patronage, and inheritance structure every decision. | A noble family rules; rank, favour and inheritance decide everything. |
| 5 | Magical practitioners govern; arcane power legitimises political authority. | Mages rule, and their magic is what gives them the right to. |
| 6 | A foreign power administers the settlement through appointed intermediaries. | A foreign power rules here through officials it appoints. |
| 7 | Criminal influence governs openly; protection is policy and the racket is the treasury. | Criminals rule openly; protection money takes the place of taxes, and the gangs keep it. |

Census law: the audit's clergy NEW ("the town's year runs by the holy days") is struck to the line's own presumption (the temple's calendar), so `RULING_POWER_SIBLINGS`' `needs: ['temple']` stays true; the key and text move with the line. No tier word in a table line that does not read the tier.

### 2.9 Read under the law and left as they are (car 3's §10 words and labels, the DM panel)

`HANDLER_TIE_WORDS` ("a silent partnership", "a patron no one names", "sworn to the cause", "held over them: a debt / a secret / a past crime / someone they love"), `VIA_WORDS` ("protection and decisions", "a place for the money and the goods", "information and small favours") and the panel's labels ("Who really runs this {tier}", "For the DM only…", "The ruling three of {ruler}", "Who answers to whom", "led by", "handled by", "brings", "The fronts", "fronts for", "The hall", "The boosts", "answers to {guild} through {handler}", "also {rank} in {power}"): PASS — plain, concrete, people and ties named, no machinery word, no retired word. Two notes for the owner's veto, not changed (labels are the owner's, law §4; the lines are WRITE-PEOPLE's `dmPowerLines.js`): the hall block's rung LABEL prints the state token ("None", "Adversarial", "Equilibrium", "Corrupted", "Capture" — `dmPowerLines.js :: CAPTURE_RUNG_LABELS`), so the DM reads "None. Nobody at the head of Elder Council answers to a criminal house…"; and "The boosts" with "{base} on its own, +{boost}, {effective} in all" is a figure line on the DM's page. The DM panel's frame "when @ wants something from @, @ is the one who asks for it." (168 towns, `dmPowerLines.js`) is WRITE-PEOPLE's PATRONAGE_LINES and outside this lane's list: named in What stays.

## 3. Pins re-keyed by cause (never loosened)

- `src/domain/coherence/crisisBlindFindings.js` — coh:crisis-blind-prose's DS-POW-4 claims re-anchored to the new words: "the succession is not live" `/\bnobody is asking who comes next\b/` (`e76cb0ab7`), then `/\bis asking who comes next\b/` (`7c96f27aa`); "the seat is safe" `/\bis safe in the hall\b/` (succession and unrest). The claims and their families unchanged; `tests/domain/coherence/crisisBlindProse.test.js` and `tests/domain/seatSafetyUnrest.test.js` green on the re-anchored claims (their fixtures read the variant by vid).
- `docs/content/wiring-census.json` — re-written by `node scripts/wiring-census.mjs` at `e76cb0ab7` and `44bea15c5` (it stamps the desk file); `--check` verified 857 pools / 2,764 variants.
- `tests/lint/proseMoveGrammar.walker.test.js` — measured on the leaves: uniform segments 565 → 569 (share 0.659 → 0.664), repeated openers 119 → 120 (0.139 → 0.140), the R1 share figures 510 → 514 and 111 → 112.
- `tests/lint/proseWiringCensus.walker.test.js` — THIN 617 → 616, COVERED 240 → 241 (one DS-POW pool now names more than `{settlement}`).
- `scripts/.observed-shape-readers-baseline.json` — re-frozen by its own shrink-only `--write` door (`d77089fcb`): the walker read power.generated.js as a drifted INPUT; findings and identities unchanged in count (2,196 / 1,542); 47/47 green.
- The suite over every test naming the power desk or its leaf (30 files) at the base and at each commit: the one red at the base (`composeStateProse` "THE CELL ARM … 72 → 60", the base's own, MERGE-WAVE's level) is the only red at the tip.

## 4. The referee at the tip

Three 1,000-town runs at the lane's own commits, beside the base (each exit 0, 1,000 settlements, 0 errors, 702 findings, CLIMB): `44bea15c5` (the Power tab's first four causes), `7c96f27aa` (after the refusal-line cause) and `084149281` (the product tip but for `c1d64ef0f`'s one merchant line). Counts are towns per story skeleton (the soak's own `story` hashes; scratch `frames.mjs`), the largest single skeleton of each frame.

**The twenty frames: none raised.** All twenty read the same count at the base, at `44bea15c5` and at `7c96f27aa` (439, 367, 306, 306, 297, 293, 263, 260, 232, 225, 225, 208, 206, 203, 203, 199, 199, 195, 195, 194). No power-side frame is NEW or RISEN in the top forty.

**The refusal line on this lane's own frames (base → tip `7c96f27aa`):**

| frame (old words) | block | base | tip | verdict |
|---|---|---|---|---|
| "criminals are buying their way into the hall at @." | DS-POW-6 advancing v1 | 190 | 46 | falls |
| "money is being spent at @ on people who cannot account…" | DS-POW-6 advancing v3 | 156 | 38 | falls |
| "visitors to @ are quietly told to stay polite to two houses…" | DS-POW-4 Contested v4 | 102 | 95 | falls |
| "@ now outweighs the @ at @, and what keeps @ in the hall is the office rather than…" | DS-POW-4 Contested v1 | 99 | 86 | falls |
| "people at @ grumble… safe for the plainest reason a seat can be safe." | DS-POW-4 Stable v3 | 70 | 44 | falls |
| "no part of the @ at @ can rule alone, so they rule together." | DS-POW-5 mixed v3 | 70 | 26 | falls |
| "@ outweighs everyone at @ who wants the @…" | DS-POW-4 Holding v1 | 66 | 18 | falls |
| "@ has no rival for it, and the succession question is not a live one here." | DS-POW-4 Stable v1 | 60 | 32 | falls |
| "power at @ is shared between several kinds of people…" | DS-POW-5 mixed v2 | 60 | 32 | falls |
| "decide who they are … the hooks write themselves." | DS-POW-6 advisory v2 | 59 | 0 (new words, below the top) | falls |
| "everyone at @ can see the @ is exposed." | DS-POW-4 Critical v3 | 47 | 42 | falls |
| "no rival stands at @ to take the @, and in a season of fighting…" | DS-POW-4 Stable v6 | 45 | 27 | falls |
| "the @ is an arrangement between kinds of power…" | DS-POW-5 mixed v1 | 42 | 23 | falls |
| "the @ at @ rules by its faith…" | DS-POW-5 theocracy v1 (words kept) | 19 | 8 | falls (the seat lens) |
| "the @ at @ answers to one person, and that person's danger…" | DS-POW-5 autocrat v3 | 17 | 13 | falls |
| "the @ does not wait long for an answer…" | DS-POW-5 autocrat v2 | 16 | 13 | falls |
| "the @ takes its civic questions to the same place…" | DS-POW-5 theocracy v2 | 19 | 9 | falls |
| "the @'s business goes to a body rather than a person…" | DS-POW-5 council v2 | 31 | **33** | **RISES by 2 — for the chair** |
| "the @ is an arrangement between kinds of power…" / "shared between several kinds…" / "rule together" | DS-POW-5 `mixed` v1–v3 at `084149281` | 42 / 60 / 70 | **0 / 0 / 0** | the arm is silent: no birth seat is placed there (§2.3's follow-up) |
| `merchant_league` v1–v4 ("run by the houses that keep the account books…", v2, v3, v4) | DS-POW-5, dark at the base | 0 | 37 / 50 / 50 / 34 (171 towns) | NEW, lit by the record cure; four vantages; v3's balance struck at `c1d64ef0f` — for the chair as a new frame at 50 |

The one rise is not the wording's: `8957313b3` routes the towns whose seat is a council but whose strongest power is not into the `council` arm (the record cure), and the frame already carried the tier noun at the base (split six ways). Default: keep — the alternative is the old line with its struck "rather than", or the lens left wrong. The frames of `factionStanding.js` print on the PDF cards and the Foundry bullets, which the soak's story set (screen `<p>` sentences) does not count; their before/after is the twelve's PDF and Foundry text (§2.6, read on the twelve at the tip).

## 5. The deltas, for STYLE-2-MERGE's signing (UNSIGNED)

Measured in clean worktrees at each parent and commit (`/home/user/sw7-meas`, `/home/user/sw7-base`); this lane signs nothing.

| surface | moved | by cause | how measured |
|---|---|---|---|
| generator golden master (/525) | **441/525** at the tip | `df6a9bb9c` 212 (town 92, city 36, metropolis 84) · `3728083ef` 429 (thorp 84, hamlet 60, village 12, town 105, city 84, metropolis 84) · every other commit 0; every moved row in `powerStructure` alone | the gm corpus re-hashed by the test's own generator call at each commit (0/525 at the base against the committed fixture) |
| dormancy fence (/360) | **316/360** at the tip | `df6a9bb9c` 186 (village 26, town 56, city 44, metropolis 60) · `3728083ef` 314 (thorp 21, hamlet 57, village 56, town 60, city 60, metropolis 60) · the rest 0 | the fence's own corpus (360 rows: six tiers × four routes × fifteen seeds) re-driven row by row at each commit; `tests/property/espionageDormancyFence.test.js` THE DRIVEN GOLDEN red at the tip, green at the base |
| herald desk | **0** | — | `tests/property/heraldKnowledgeDeskGolden.test.js` green at the tip |
| composed prose (/1,050) | **1,535 cells WORDING-ONLY** (REPLACED, RE-INDEXED, ADDITIVE 0) | `e76cb0ab7` 1,175 (525 towns) · `7c96f27aa` 360 (178 towns) · the rest 0 | `node scripts/prose-manifest-cells.mjs --out` at each parent and commit → `prose-manifest-diff.mjs` |
| witness | **0** | — | `tests/simulation/presetLightingWitness.test.js` green at the tip |
| PDF snapshot (/18) | **0** | — | `tests/pdf/goldenViewModel.test.js` green at the tip (the fixture carries no raw sublabel and no DS-POW line) |

**The reds that move with the generator golden master and the fence** (each turns green with the merge seat's re-record of the two causes): `tests/property/generatorGoldenMaster.test.js`, `tests/property/espionageDormancyFence.test.js` (THE DRIVEN GOLDEN), `tests/generators/powerEconomyFreshness.test.js` A4, `tests/generators/pipelinePinnedChoosers.test.js` A1 (16 rows), and the other gm-stride pins SW-B2's record names (`dmLayerGoldenIsolation`, `worldFactRederive`, `nameHeldThroughAssembly`, `pipelinePinnedMode`, `rosterFinalUnderHeldRoster`). **The reds that are the base's own** (identical at `0f2e6c097`, untouched): `composeStateProse` "THE CELL ARM … 72 → 60"; `religionLegitimacyFactionKey` "reads the weak elected seat"; four arms in the rulingPower suite (the seat floor R15, the v1-vs-v2 differential, R20 THE WALKER, THE ID JOINS THE EVENT LAYER'S).

## 6. CONFIRMED against PLAUSIBLE

CONFIRMED: the base (`0f2e6c097`, verified), the twelve and the 1,000 at the base and at two lane commits (exit 0, 0 errors), every count in §4 and §5 (re-run from the soak's own hashes and the gm / fence / prose corpora at each commit), the red-firsts of `8957313b3` and `44bea15c5` (planted red, restored green), every walker figure re-keyed in §3, and the three record walkers at the push. PLAUSIBLE: that each new line reads better under the owner's law (the owner's veto decides), and that the council v2 rise of 2 is the seat lens's routing alone (the lens and the rewrite landed in different commits, but the 1,000 was not run at `e76cb0ab7` to isolate it).

## What stays (by file)

This lane's charge, not reached in this seat's budget — for a second seat, by file (each row is in the SOURCES audit's tables or the SURFACES ledger named):

- `src/generators/economy/prosperity.js` — 19 rows (SOURCES §2.5; A2: "arithmetic" and the per-cent slot go, a band word where the record holds the band). Dark at the twelve.
- `src/generators/legacyGenerator.js` — 19 rows (SOURCES §2.5), and the wrapper A11 names if SW-9 has not taken it.
- `src/generators/power/governingStressVignettes.js` — 1 row (:54). Note: the stability vignette is also the governance block's (OWNER-WORDS-DOSSIER); this row is the conversion vignette's sentence only.
- `src/domain/people/allegiance.js` :101 — the fanaticism goal "Bend every rule for the cause and call the corruption devotion." → "Bend every rule for the cause, and call it devotion." (the audit's `corruptionPass.js` row; that file does not exist at the base — the line lives here; the chair was told).
- `src/generators/steps/neighbourFactions.js` — 2 "faction" tokens (SW-8's map; the file's 0 REWRITE rows).
- `src/data/powerSiblings.js` :85 / :89 — 2 rows, with their keys and the originals in `rulingStructure.js` (SOURCES §2.6).
- `src/data/npcData.js` — B10(b): the dealing-style pool keyed to the card's own traits (three lines cover 371 cards in 11 towns), the secret frames (name a person or neighbour on the roster or none; no frame twice in one dossier), the relationship twist pool reading the names it receives; and its 13 "rather than" (A9). The largest remaining unit.
- `src/data/cultureProfiles.js` — 3 "rather than" (A9).
- `src/generators/safetyProfile.js` — 1 "rather than" (A9; the file is split by row with SW-B5/SW-B6).
- `src/data/institutionalCatalog.js` — 17 rows + 3 "rather than" (A3, the catalogue law: minimal swaps).
- SURFACES P50 (the Mixed Council government-type line "Power is distributed across multiple factions…" against a Dominant rival on the same chapter): its writer is `rulingStructure.js` (:409–410), outside this lane's list — for SW-B1 with P51's order fault (§2.6).
- RULED by the chair (08:5x): council v2 31 → 33 KEPT (the lens cure's routing; PLAUSIBLE attributed); the merchant arm's lighting ACCEPTED. Follow-up, not this lane's: DS-POW-5's `mixed` arm is silent at the tip (v1–v3 at 0: no birth seat is placed there) — either the lens's `mixed` definition is revisited or the three lines go to the post-deploy dead-code census.
- Named, not this lane's: the DM panel's rung labels and "The boosts" figure line, and the PATRONAGE_LINES frame "when @ wants something from @, @ is the one who asks for it." (168 towns) — `src/data/people/dmPowerLines.js`, WRITE-PEOPLE's (§2.9); the "(dominant)" suffix inside minted faction names (SW-8).


## 7. The second seat

**Seat:** SW-7 POWER-SIDE, second seat (Claude Opus 5.5), session `session_01FbPLbdMQQTVchJUyvHuFQJ`, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). It continues on the same lane from the first seat's hand-back, `dc5684e66` (verified as the checkout's HEAD), with nothing rebased or rewritten. **Worklist:** "What stays (by file)" above, in the chair's order, plus the chair's item 10 (`dmPowerLines.js`, WRITE-PEOPLE's file; that lane is closed and merged). Every line below is old → new for the owner's veto. Merged by STYLE-2-MERGE; this lane signs nothing.

### 7.0 The measurement at the base (`dc5684e66`)

- **The twelve** (`soak1k-0 … 11`, birthed by the soak's own `corpus.mjs :: birth`; scratch `npcmeas.mjs`): 405 NPC cards and 403 printed ties. "How they deal": **three lines on 371 of 405 cards in 11 towns** (128 / 123 / 120), confirming B10(b). Secret frames repeating twice or more in one dossier: **20** (the largest is "Knows something about @ that @ believes no one else knows …", 30 cards in 6 towns and ten times in one town), all four from `npcGenerator.js`'s inline CRIME_KNOWLEDGE pool, not npcData. Tie tension lines that name neither party: **81 of 403**.
- **The 1,000** at the base: exit 0, 1,000 settlements, 0 errors, 702 findings, CLIMB. The twenty frames read exactly as §0 records (439 … 194).
- **The full suite** at the base, run once in a clean worktree: 41 files / 63 tests red (3,133 files; 4,351 s). Every red named in this section is checked against that list.
- **tsc --noEmit**: 167 errors at the base and 167 at the npcData tip.
- **Golden-master tool**: a scratch re-hash over `tests/helpers/goldenMasterCorpus.js` with the test's own `generateSettlementPipeline` call, per top-level field (`gm.mjs`). At `dc5684e66` it differs from the committed fixture on 429 of 525 rows. These are the first seat's unsigned causes; §5 recorded 441, measured with a different tool. Every gm delta below is parent → commit with this one tool, so the base offset cancels. The fence corpus is driven row by row by its test's own loop (`fence.mjs`); prose cells come from `scripts/prose-manifest-cells.mjs --out` → `prose-manifest-diff.mjs`.

### 7.1 The commits, one cause each

| commit | file(s) | cause |
|---|---|---|
| `d41435ecd` | npcData.js · npcGenerator.js (pickTitle's argument) · generationForkCensus (a line re-key) | B10(b): "How they deal" keyed to the card's own traits, draw-free |
| `4c5614d27` | npcData.js · the CENSUS-4 ledger · criminalSecretsByHolder's sha | B10(b): two secrets name no neighbour the realm may not hold |
| `fb712a8d7` | npcGenerator.js :: generateCrimeLevel | B10(b): no secret frame twice in one dossier (the held refusal reads the frame) |
| `640378639` | npcData.js · the CENSUS-4 ledger | B10(b): the 26 nameless tie tension lines read the pair's names |
| `effda57d6` | npcData.js · four CENSUS-4 ledgers | A9: npcData's last five "rather than" |
| `4bf93741b` | institutionalCatalog.js | A3 · A9: 17 rows by minimal swaps + the ceiling reason's "rather than" |
| `6f340466f` | prosperity.js · foodRecord / foodModelSingleWriter pins | A2: 19 rows; "arithmetic" and the per-cent slot go (the band speaks) |
| `936d4ec06` | legacyGenerator.js | A2: the 19 SOURCES §2.5 rows only (the A11 wrapper left for SW-9) |
| `7e1009be5` | governingStressVignettes.js | A2: the conversion vignette's variant 0 only |
| `4296505ed` | cultureProfiles.js · CULTURE_PROFILES_DAILY ledger | A9: the two printed "rather than" |
| `ee5d994fb` | safetyProfile.js | A9: the revolt line's "rather than" (neither SW-B5 nor SW-B6 touches it) |
| `efe1294e4` | allegiance.js · the CORRUPT_SHORT_GOAL ledger | the fanaticism goal (the audit's corruptionPass.js row) |
| `d8739f6e3` | dmPowerLines.js | item 10(a): the hall's rung labels in plain words (a PROPOSAL) |
| `b26d35d0a` | dmPowerLines.js · WhoRunsThisTownPanel.jsx · pdf/sections/WhoRunsThisTown.jsx | item 10(b): the boosts row in words; "+N in strength" leaves three patron lines |
| `6cda3ce68` | dmPowerLines.js | item 10(c): the refusal line, the go-between frame split by the patron's place |
| `cbba52029` | legacyGenerator.js · generalStateProse.js (legacyPoolKey) · generalStateProseDesk test | A11: the annotation wrapper's three clauses in plain words (routed here 09:0x) |
| `969e95133` | npcGenerator.js | follow-up of `fb712a8d7`: the declarations folded onto one line; the size ratchet back at 1192 (behaviour byte-identical) |
| `c8c760142` | tonightConcreteFirst test | follow-up of `fb712a8d7`: soak1k-868's seat arm re-keyed by identity |
| `1d1369095` | worldFactRederive test | follow-up of `6f340466f`: prosperity.js leaves A4's culture-reader set (it matched only "agriculture") |
| `417acb424` | scripts/.writer-reach-baseline.json | register, its shrink-only `--write` door (cohort 1362 → 1362) |
| `8ab5972db` | docs/content/wiring-census.json | register, its door: generalStateProse.js re-stamped |

**Outside the first list, taken under the STOP's default sent to the chair:** `npcGenerator.js` (SW-5's file) for two draw-site edits B10(b) cannot be made without. One is pickTitle's personality argument; the other is the frame-keyed held refusal in generateCrimeLevel. SW-5's pushed hunks in that file (its goal longs, the CRIME_KNOWLEDGE stakes line, the wartime notes, NPC_GOAL_SIBLINGS) do not overlap either site. `WhoRunsThisTownPanel.jsx` and `src/pdf/sections/WhoRunsThisTown.jsx` get one call-site line each for item 10(b). The PDF file is in SW-B4's directory, and SW-B4's pushed tip leaves it unchanged, so it composes cleanly.

### 7.2 Every line, old → new

#### 7.2.1 `d41435ecd` — "How they deal" (`npcData.js :: dealingLineFor`, `NPC_DEALING_BY_TRAIT`, `DEALING_TRAIT_FAMILY`)

The line reads the card's disposition and the first of its traits (flaw, then dominant, then modifier) that names a family. A card whose traits name none keeps its disposition line, and the welcoming fallback loses its "rather than": "Offers information freely; asks questions that seem like interest rather than interrogation." → "Offers information freely, and asks questions that sound like interest, not prying." Census law: each line states only what the disposition and the trait word say. No roll is added or moved: the twelve's 809 card and tie rows are identical except for this line.

| disposition | family | NEW line |
|---|---|---|
| welcoming | straight | Glad to talk, and says plainly what they know and what they don't. |
| welcoming | warm | Makes you welcome, finds you a seat, and helps without counting the cost. |
| welcoming | careful | Friendly, but takes their time; hears the whole question before answering it. |
| welcoming | sharp | Friendly and quick; by the end of the talk they know more about you than you do about them. |
| welcoming | dutiful | Open with you until your business touches the people they answer for; then they close up. |
| welcoming | price | Free with talk and small favours, and remembers every one when they want something back. |
| welcoming | lofty | Gracious in the way of someone doing you a kindness, and expects to be thanked for it. |
| welcoming | guarded | Friendly on the surface, but soon asks where you are staying and who sent you. |
| welcoming | slippery | Tells you what you want to hear, and the story changes with who else is listening. |
| welcoming | hard | Pleasant until crossed; then the warmth goes at once and does not come back. |
| welcoming | shirking | Promises help easily, and is hard to find when the time comes to give it. |
| welcoming | dealmaker | Friendly and useful, and already working out what you might be worth to them. |
| transactional | straight | Names a fair price, keeps to it, and expects you to keep to yours. |
| transactional | warm | Strikes a bargain, then gives a little more than was agreed. |
| transactional | careful | Wants every term settled before anything changes hands, and writes it down. |
| transactional | sharp | Bargains well, and spots a weak offer before you finish making it. |
| transactional | dutiful | Deals fairly with you, but never against the people they serve. |
| transactional | price | Everything has a price, and the price rises the more you seem to need it. |
| transactional | lofty | Deals with you as a favour, and lets you know the terms are theirs to set. |
| transactional | guarded | Trades in coin, not talk; asks nothing about you and says nothing of their own business. |
| transactional | slippery | Agrees quickly, and the terms are never quite what you remember agreeing to. |
| transactional | hard | Holds you to every word of a deal and collects in full, whatever it costs you. |
| transactional | shirking | Takes the deal, then does as little as the deal allows. |
| transactional | dealmaker | Helps you as far as it pays them to, and no further. |
| cautious | straight | Answers what you ask truthfully, and offers nothing beyond it. |
| cautious | warm | Kind but careful; helps once they know who you are and why you came. |
| cautious | careful | Answers slowly, checks what you say against what they know, and gives little at a first meeting. |
| cautious | sharp | Says little, watches closely, and notices what you leave out. |
| cautious | dutiful | Asks your business first, and weighs it against the people they look after. |
| cautious | price | Says little until it is clear what you can offer. |
| cautious | lofty | Keeps you at a distance, and makes you prove you are worth their time. |
| cautious | guarded | Answers questions without volunteering anything, and watches who you talk to next. |
| cautious | slippery | Gives careful answers that are true as far as they go, and they never go far. |
| cautious | hard | Treats every question as a possible threat, and remembers who asked it. |
| cautious | shirking | Keeps out of trouble by keeping away from you, and sends you to someone else when they can. |
| cautious | dealmaker | Holds back until they see what knowing you might get them. |
| dismissive | straight | Brief and blunt; tells you what they think of your request and goes back to work. |
| dismissive | warm | Busy, but not unkind; points you to someone who can help. |
| dismissive | careful | Polite, brief and busy; asks you to come back when they have time. |
| dismissive | sharp | Hears you out for a moment, decides you are not worth more, and says so. |
| dismissive | dutiful | Has no time for strangers while their own people need them. |
| dismissive | price | Has no time for you unless you are buying. |
| dismissive | lofty | Barely looks up; you are plainly beneath their notice. |
| dismissive | guarded | Cuts the talk short and gives no reason. |
| dismissive | slippery | Agrees with everything you say, to be rid of you sooner. |
| dismissive | hard | Curt to the point of rudeness, and does not care how it lands. |
| dismissive | shirking | Waves you off; whatever you need is somebody else's job. |
| dismissive | dealmaker | Polite but brief, until you mention something they want. |

The families (trait words → family): **straight** honest, candid, forthright, plain-dealing, principled, incorruptible, fair-minded, equitable · **warm** compassionate, generous, warm-hearted, hospitable, merciful, magnanimous, good-humoured, gracious, courteous, charismatic, optimistic, humble · **careful** patient, methodical, prudent, level-headed, temperate, diligent, conscientious, dependable, steadfast, stalwart, tenacious, unflappable, perfectionist · **sharp** clever, astute, discerning, perceptive, intuitive, wise, scholarly, resourceful, diplomatic · **dutiful** loyal, protective, brave, pious, traditionalist, zealous · **price** greedy, self-serving, corrupt, hedonistic · **lofty** arrogant, vain, imperious, domineering, overbearing, dismissive, proud, theatrical · **guarded** suspicious, paranoid, secretive, cautious, reserved, inscrutable, detached · **slippery** deceitful, manipulative, mendacious, hypocritical · **hard** cruel, callous, cold-blooded, ruthless, vindictive, vengeful, wrathful, bitter · **shirking** lazy, cowardly, reckless, envious, stubborn, petty, volatile · **dealmaker** pragmatic, ambitious, calculating, opportunistic.


#### 7.2.2 `4c5614d27` — two secrets (`NPC_CRIMINAL_SECRETS_BY_HOLDER.any`)

| OLD | NEW |
|---|---|
| Has a second family in another settlement that neither family knows about | Has a second family elsewhere that neither family knows about |
| Has been feeding strategic intelligence to a rival settlement | Has been feeding strategic intelligence to outsiders who pay for it |

The writer (`factionLeaderSecret` → this table) reads no neighbour, so the line names none. "feeding" is kept because `getStressHistory`'s dangerous-surface key reads it. Re-keyed by cause: `criminalSecretsByHolder`'s flat-table sha `4b3d62d6…` → `ba46807b…`, shape and order unchanged.

#### 7.2.3 `fb712a8d7` — no secret frame twice in one dossier (`npcGenerator.js :: generateCrimeLevel`)

No new words. The CRIME_KNOWLEDGE draw's held refusal now reads the FRAME, with every roster name masked, where it used to read the full text, in which the other figure's name made every repeat look new. Each of the four frames prints at most once per dossier. With all four held the pool draws nothing, so no roll is spent, and the figure keeps its own secret. On the twelve: repeats in one town **20 → 0**; the largest frame **30 → 9** cards; cards with a secret 314 → 280, because a figure the pool refuses keeps its birth secret or none.


#### 7.2.4 `640378639` — the tie tension lines (STRESS_ECONOMIC_EFFECTS; `r` = the archetype's first end, `s` the second)

| # | OLD | NEW |
|---|---|---|
| 1 | If either is investigated, the other is implicated. Both know this. Neither mentions it. | If {r} is investigated, {s} is implicated, and the other way round. Both know it, and neither mentions it. |
| 2 | A clerk has begun cross-referencing the ledgers. Neither party has decided what to do about it. | A clerk has begun checking {r}'s ledgers against each other. Neither {r} nor {s} has decided what to do about it. |
| 3 | A new superior has started asking uncomfortable questions about clearance rates. One of them will have to act before the other does. | A new superior has started asking {r} awkward questions about how few arrests are made. {r} or {s} will have to act before the other does. |
| 4 | The payments have started arriving late. In this trade, late is a message. | {s}'s payments to {r} have started arriving late. In this trade, late is a message. |
| 5 | The last shipment was short, and each side privately blames the other. The next one will settle the question. | The last shipment was short, and {r} and {s} each privately blame the other. The next one will settle the question. |
| 6 | They disagree on a fundamental question of method that neither will put into writing. | {r} and {s} disagree on a question of method that neither will put into writing. |
| 7 | A penitent has brought a case that pits doctrine against order. It has not been resolved. It will not stay private. | A penitent has brought {r} a case that pits doctrine against {s}'s order. It has not been resolved, and it will not stay private. |
| 8 | An incident is coming that will force the issue. Both are positioning for it. | An incident is coming that will force the issue between {r} and {s}, and both are positioning for it. |
| 9 | A prisoner is currently held by both jurisdictions at once. Neither will release the paperwork first. | A prisoner is held under {r}'s authority and {s}'s at once, and neither will release the paperwork first. |
| 10 | A decision coming in the next season will advantage one significantly. The other knows this. | A decision coming next season will favour {r} or {s} heavily, and both of them know it. |
| 11 | A mutual patron has let it be known there is room for only one of them at the next table. | A patron they share has let it be known there is room for only {r} or {s} at the next table. |
| 12 | One of them has recently broken an unwritten rule of the contest. The other is deciding what that permits. | {r} has recently broken an unwritten rule of the contest. {s} is deciding what that permits. |
| 13 | The balance of leverage has recently shifted. One party has noticed; the other hasn't yet. | The balance between {r} and {s} has recently shifted. {s} has noticed; {r} has not, yet. |
| 14 | A document each believed only they possessed has surfaced in a third set of hands. | A document {r} and {s} each believed only they possessed has turned up in someone else's hands. |
| 15 | A third party is actively working to change that calculation. | Someone else is working to pull {r} and {s} apart. |
| 16 | The threat that made the alliance necessary is gone. Neither has said so aloud. | The threat that brought {r} and {s} together is gone. Neither has said so aloud. |
| 17 | They are about to be on opposite sides of a significant decision. | {r} and {s} are about to be on opposite sides of an important decision. |
| 18 | One of them is being pressured to act against the other, and has not yet mentioned it. | {r} is being pressed to act against {s}, and has not mentioned it. |
| 19 | The respect is real and the interests are diverging. Both can read a map. | {r} and {s} still respect each other, but what each of them wants is pulling apart, and both can see it. |
| 20 | A third party has learned what the original favour was. The debt just changed hands. | Someone else has learned what favour {r} owes {s}, and now has a hold on {r} too. |
| 21 | An inheritance, title, or secret is about to make the connection impossible to ignore. | An inheritance, a title or a secret is about to make the tie between {r} and {s} impossible to ignore. |
| 22 | A younger relative has begun trading on the connection both of them refuse to use. | A younger relative has begun trading on the connection {r} and {s} both refuse to use. |
| 23 | The family has taken a side in a dispute between them. It is the wrong side, in both their opinions. | The family has taken a side in a quarrel between {r} and {s}, and both of them think it is the wrong side. |
| 24 | The circumstances that caused the original rupture are repeating. Both of them know it. | What first broke {r} and {s} apart is happening again, and both of them know it. |
| 25 | An apology is owed in one direction and expected in the other, and they disagree about which. | {r} and {s} each think the other owes the apology. |
| 26 | A newcomer keeps trying to reconcile them, and is about to learn why nobody else does. | A newcomer keeps trying to reconcile {r} and {s}, and is about to learn why nobody else does. |

#### 7.2.5 `effda57d6` — npcData's last five "rather than" (A9)

| # | OLD | NEW |
|---|---|---|
| 1 | Asks rhetorical questions to make points rather than stating them | Makes every point as a question they do not expect answered |
| 2 | Relaxed in a way that reads as confidence rather than carelessness. | Relaxed and sure of themselves, and not careless with it. |
| 3 | Cautious with newcomers. The wariness is professional rather than personal. | Cautious with newcomers, because the work requires it; it is nothing personal. |
| 4 | Die in bed rather than in the street (unusual ambition for the role) | Die old, in their own bed (an unusual ambition for the role) |
| 5 | Accumulate enough to make legitimacy a choice rather than an aspiration | Put enough by that going straight is a choice they can make |

#### 7.2.6 `4bf93741b` — `institutionalCatalog.js` (A3, the catalogue law: minimal swaps)

The SOURCES audit's 17 rows (its NEW used as the draft) plus the hunter's lodge's ceiling reason (a "rather than"; the last row). **Struck under the census law:** the contract killer's "in a place too small to keep an assassins guild". The row stands at city and metropolis, and size is not a reason the record holds, so it becomes "with no guild behind it". The file's two remaining "rather than" are in comments.

| audit line | code | OLD | NEW |
|---|---|---|---|
| 116 | machinery-leak | Each household farms ~12-16 acres for survival. | Each household farms just enough land to feed itself. |
| 282 | machinery-leak | Central plaza for weekly markets and fairs. 50-100 yards per side. | Central plaza for weekly markets and fairs. |
| 368 | machinery-leak | The city-scale version: permanent offices where caravan masters, merchants, and armed escorts transact. Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resolution. | Permanent offices where caravan masters, merchants, and armed escorts transact. Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resolution. |
| 572 | machinery-leak | The guild form of the listening house: paid correspondents on several roads, an archive that cross-checks one road against another, and a standing rate for a written answer. Expensive to keep, and the only counter in the city where a claim is graded before it is sold. | A guild house for news: paid correspondents on several roads, an archive that cross-checks one road against another, and a standing rate for a written answer. Expensive to keep, and the only counter in the city where a claim is graded before it is sold. |
| 914 | machinery-leak | Walk 2-5km to the village house of worship for services. | A walk of a few miles to the village house of worship for services. |
| 915 | machinery-leak | Travel to the village house of worship. 2-5km distance typical. | Services mean the walk to the village house of worship, usually a few miles off. |
| 927 | retired-word | Consecrated ground beside the house of worship, on its own plot, with a resident priest to close it. The rite keeps to the day of the death rather than waiting on a clergyman who comes through, and the congregation has begun keeping the names in the same book as the births. The ground nearest the wall is spoken for generations ahead, and everyone here can say who holds it. | Consecrated ground beside the house of worship, on its own plot, with a resident priest to close it. The rite is held on the day of the death, with no wait for a travelling clergyman, and the congregation has begun keeping the names in the same book as the births. The ground nearest the wall is spoken for generations ahead, and everyone here can say who holds it. |
| 1234 | machinery-leak | Full-time law enforcement. ~1% of population. | Full-time law enforcement. About one officer for every hundred people. |
| 1504 | mechanism-first | A loft of message birds kept by people who file no returns. Word arrives unsigned and ahead of the watch. Only a standing criminal organization can protect a loft like this, so one never appears without that backing. | A loft of message birds kept by people who file no returns. Word arrives unsigned and ahead of the watch. Only a standing criminal organization can protect a loft like this. |
| 1514 | machinery-leak | The covert guild form: brokers who buy and sell knowledge by the piece, grade what they sell, and will manufacture a claim for a patron who pays enough. It sites itself where the talk already is, among the fences, the late houses, and the inns that ask nothing. | A covert guild of brokers who buy and sell knowledge by the piece, grade what they sell, and will manufacture a claim for a patron who pays enough. It sites itself where the talk already is, among the fences, the late houses, and the inns that ask nothing. |
| 371 | machinery-leak | Coordinates regional caravan assembly, departure schedules, and route intelligence. Merchants register goods, hire guards, and arrange joint ventures here. The town-scale predecessor to the city's Caravan masters' exchange. | Coordinates regional caravan assembly, departure schedules, and route intelligence. Merchants register goods, hire guards, and arrange joint ventures here. |
| 564 | mechanism-first | A licensed house that pays for road news and keeps the register: who arrived, from where, and what they carried word of. Cheap to run and openly taxed, which is why it appears wherever traffic does and nowhere that it does not. | A licensed house that pays for road news and keeps the register: who arrived, from where, and what they carried word of. Cheap to run and openly taxed, and found wherever the roads bring traffic. |
| 779 | retired-word | Cuts and sews finished cloth into garments. Serves the middle tier between home seamstress and master clothier. | Cuts and sews finished cloth into garments. Serves the middling sort between home seamstress and master clothier. |
| 926 | retired-word | A walled plot at the edge of the settlement, gated against livestock and kept by the households in turn. The rite is held when a priest comes through, and the burial itself does not wait for one. Families lie in rows by household rather than by standing, which is custom here rather than poverty. | A walled plot at the edge of the settlement, gated against livestock and kept by the households in turn. The rite is held when a priest comes through, and the burial itself does not wait for one. Families lie in rows by household, whatever their standing. That is the custom here, and has nothing to do with being poor. |
| 1044 | retired-word | A single respected figure acts as de facto authority. Not elected, not appointed, simply acknowledged. Decisions are practical rather than formal. | A single respected figure acts as de facto authority. Not elected, not appointed, simply acknowledged. Decisions are practical, made without ceremony. |
| 1140 | machinery-leak | Well or spring. 2-4 gallons/person/day minimum. | Well or spring. At least a bucketful a person each day. |
| 1528 | machinery-leak | An individual or small cell operating beneath the assassins guild threshold. Accepts contracts through criminal intermediaries. Less reliable but deniable. | An individual or small cell with no guild behind it. Accepts contracts through criminal intermediaries. Less reliable but deniable. |
| 271 (ceiling reason) | rather-than | Cities buy game and pelts through the furriers rather than keeping their own hunters. | Cities buy game and pelts through the furriers and keep no hunters of their own. |

#### 7.2.7 `6f340466f` — `prosperity.js :: deriveEconomicSituationDesc` (A2)

The function reads no tier word, so the audit's "the town" became "the settlement". The food line's per-cent slot became the record's band: `FOOD_SECURITY_CUTS`, "much of" over 40 and "part of" over 15. 96's "who takes (the governing name)" is a need the function does not read, so it is not written in. Dark at the twelve; every branch is lit by the scratch probe `prosprobe.mjs` (fourteen configs, each prints its new line). The occupation line's double "and" is mended to "…, with forced assessments on top".

| audit line | code | OLD | NEW |
|---|---|---|---|
| 63 | mannered,mechanism-first | All normal economic activity is suspended. Markets are closed, merchant caravans have stopped arriving, and whatever currency existed is being redirected toward survival. The only economic question is the arithmetic of remaining supplies. | The market is shut and the caravans have stopped coming. What coin there is goes on staying alive, and the only question anyone asks is how long the stores will last. |
| 65 | mechanism-first | The economy is structured around food scarcity. Those with grain have power. Those without are making increasingly desperate decisions. Normal market activity continues in a technical sense. Prices are simply at levels that exclude most of the population. | Food is short, and those with grain hold the power. The market still opens, but most people cannot afford what is on the stalls, and those without grain are growing desperate. |
| 72 | mechanism-first,aphorism | Revenue flows outward to the occupying authority via ${extractionChannel} and compulsory assessment. Local commerce continues under supervision. The officially stated economic situation differs from the experienced one. | The occupiers take their share through ${extractionChannel}, with forced assessments on top. Local trade goes on under their eye, and things are worse than the official word admits. |
| 75 | mechanism-first | Debt service obligations consume a meaningful share of revenue before any local investment is possible. The creditor's representative has effective veto power over fiscal decisions. Economic activity continues but its fruits are partly spoken for before they are earned. | Much of what the settlement takes in goes on its debts before anything can be spent at home, and the creditor's agent can block any spending. People still work and trade, but part of what they earn is owed before they earn it. |
| 77 | mechanism-first | Market activity is reduced by fear and quarantine measures. Supply chains for common goods are disrupted. The economic situation would be manageable if it weren't compounded by the medical crisis. As it is, each problem is making the other worse. | Fear of the sickness and the quarantine have emptied the market, and everyday goods are hard to come by. Either trouble alone could be borne; together each makes the other worse. |
| 79 | retired-word,mechanism-first | Economic activity requires navigating factional lines that did not exist a year ago. Some merchants have aligned with specific factions. Cross-faction trade continues but it is slower and more expensive than it should be. | Trading now means picking a way between rival powers that did not exist a year ago. Some merchants have taken sides. Trade between the sides goes on, but it is slower and dearer than it should be. |
| 85 | machinery-leak,mechanism-first | After imports, ${Math.round(foodGapPct)}% of daily need goes uncovered. Rationing and outside supply are economic necessities; commercial strength in other sectors cannot cover that gap. | Even with what is brought in, people here go short of ${foodGapPct > FOOD_SECURITY_CUTS.deficit ? 'much of' : 'part of'} the food they need each day. The settlement has to ration and buy from outside, and no other trade it has can make that up. |
| 92 | mechanism-first,machinery-leak | This settlement is too large to survive in true isolation. Without trade routes, specialist goods cannot be sourced, surpluses cannot be sold, and population density cannot be sustained. The economy is structurally broken. | The settlement is too big to live cut off. With no trade routes it cannot buy what it does not make or sell what it has spare, and it cannot keep this many people fed. |
| 94 | mechanism-first | Trade flows through magical channels. Teleportation circles and planar contacts replace roads. The economy functions but depends entirely on maintaining that arcane infrastructure. | Goods come and go by magic: teleportation circles and planar contacts do the work of roads. Trade works, but only as long as the circles do. |
| 96 | mechanism-first,mannered | Internal production is suppressed by institutional extraction. What little surplus exists flows upward rather than into communal welfare. | Those in power take so much that little gets made, and what little is left over goes to them. |
| 98 | mechanism-first | Despite isolation, internal production is well-organised. Skilled crafts, efficient agriculture, and communal resource management keep the settlement self-sufficient. | Cut off as it is, the settlement runs itself well: skilled crafts, well-worked fields and shared stores keep it fed and supplied. |
| 100 | mechanism-first | The settlement struggles to sustain itself without outside trade. Resources are tightly rationed and growth is impossible. | With no outside trade, the settlement struggles to feed and supply itself. Everything is rationed, and there is nothing to spare for growing. |
| 101 | mechanism-first | The settlement meets its own needs without external trade, though surpluses are modest and specialist goods are unavailable. | The settlement feeds and supplies itself without outside trade, but it has little to spare and cannot get what it does not make. |
| 107 | mannered | Commerce is vigorous and the distinction between legitimate trade and criminal enterprise is largely academic. The wealthiest operators play both sides. | Trade is brisk, and it is hard to say where honest business ends and crime begins. The richest traders work both sides. |
| 109 | mechanism-first | The official economy appears functional. The reality is that institutional extraction (confiscations, forced sales, and selective taxation) suppresses productive activity. | On paper the settlement's trade looks healthy. In fact, seizures, forced sales and unfair taxes keep people from making or selling much. |
| 111 | mannered | Commerce is the lifeblood of this settlement. Markets are active at all hours and guild influence reaches every trade. | Trade is what this settlement lives on. The markets are busy at all hours, and the guilds have a hand in every craft. |
| 113 | mechanism-first | Trade is vigorous and the guilds are well-organized, generating steady civic revenue. | Trade is brisk, the guilds are well run, and the settlement's coffers fill steadily. |
| 116 | mechanism-first | The economy is barely functional. Barter replaces coin and few outsiders bother to trade here. | Little coin changes hands here; people barter, and few outsiders bother to come and trade. |
| 118 | mechanism-first | Official commerce is moderate but a thriving shadow economy undercuts legitimate trade. | Honest trade gets by, but a busy black market undercuts it. |

#### 7.2.8 `936d4ec06` — `legacyGenerator.js` (A2, the 19 SOURCES §2.5 rows)

"the town" became "the settlement" or "here" (the function reads no tier word). 160's and 180's needs (the governing name, what the town came to depend on) are not read, so they are not written in.

| audit line | code | OLD | NEW |
|---|---|---|---|
| 83 | machinery-leak | The lasting consequence (${effect.charAt(0).toLowerCase() + effect.slice(1)}) remains structurally embedded. | What it left behind (${effect.charAt(0).toLowerCase() + effect.slice(1)}) is still part of the place. |
| 108 | machinery-leak,mechanism-first | the institutions founded in its wake carry embedded civic status that traces to the authority established then. | the institutions founded after it still hold the authority they were given then. |
| 114 | mechanism-first,machinery-leak | the settlement\'s relationship between the scholars who studied it and civic governance has been uncertain since. | the scholars who studied it and the settlement's rulers have never settled which of them has the say. |
| 160 | machinery-leak,mechanism-first | the governing authority\'s current legitimacy deficit has structural roots that precede the present situation. | people's distrust of those who rule today began here, before the present troubles. |
| 164 | machinery-leak,mannered | the present contestation of governing authority echoes rather than resolves that earlier disruption. | the quarrel over who should rule today is the same quarrel, never settled. |
| 168 | mechanism-first | the current stability was built partly through reconstruction following that disruption. | the present calm was partly built in the rebuilding that followed. |
| 172 | mechanism-first | the governing arrangements in place today carry the shape of what was settled then. | the way the settlement is ruled today was largely settled then. |
| 180 | machinery-leak,mechanism-first | current economic pressure has structural antecedents. The present situation reflects dependencies established then. | the present money troubles began then, in what the settlement came to depend on. |
| 184 | machinery-leak | the supply vulnerabilities visible today have historical antecedents in this disruption. | the food shortages of today began with it. |
| 188 | mechanism-first | current commercial strength is accumulated recovery. The present prosperity was built on what was reconstructed. | the trade that keeps the settlement prosperous today was rebuilt, piece by piece, after it. |
| 192 | machinery-leak,retired-word,mannered | commercial interests have held structural relevance since. The present merchant faction\'s strength is accumulated rather than sudden. | the merchants have mattered here ever since, and their power today was built up slowly over the years. |
| 196 | machinery-leak,mechanism-first | commercial interests have since lost the structural position they held. The present weakness reflects that displacement. | the merchants lost the place they held then, and have never won it back. |
| 204 | mechanism-first | the settlement has not fully insulated itself from the pressures that calamity revealed. | the settlement is still exposed to the hardships that calamity showed it. |
| 208 | machinery-leak | the institutional adaptations built during that crisis remain part of the settlement\'s structural character. | the changes made to get through that crisis are still how the place works today. |
| 218 | machinery-leak | the religious institution\'s structural prominence has declined significantly since. The settlement\'s current secular character reflects a long displacement. | the faith has lost much of its hold here since, and the settlement now runs its affairs with little say from the clergy. |
| 222 | machinery-leak,mannered | religious institutional prominence has been sustained since. The present strength is accumulated rather than recent. | the faith has kept its hold here ever since, and its strength today was built up over the years. |
| 226 | mechanism-first | the tension between religious and secular authority it created has not been conclusively settled. | the quarrel it started between the clergy and the settlement's rulers has never been settled. |
| 243 | machinery-leak | arcane institutions carry embedded civic status that traces to the authority established then. | the arcane houses still hold the standing in public affairs they were given then. |
| 249 | mechanism-first,machinery-leak | the settlement\'s relationship between arcane practitioners and civic governance has been uncertain since. | the mages and the settlement's rulers have never settled which of them has the say. |

#### 7.2.8a `cbba52029` — `legacyGenerator.js :: annotationBody`, the A11 wrapper (routed here by the chair, 09:0x)

| OLD | NEW |
|---|---|
| {event} ({n} years ago) created pressure that has not been fully resolved: … | {event} ({n} years ago) left trouble that has never been put right: … |
| … was a disruption the settlement has since moved through: … | … hit the settlement hard, and it has since recovered: … |
| … established conditions that have since shifted: … | … set up ways of doing things that have since changed: … |

"As of the founding survey, " stays: it is W0 cause 5's dated opening, pinned by `w0WriterAgreement`, and the first-survey vintage label is the owner's (queue #28). The one reader keyed on these words, `generalStateProse.js :: legacyPoolKey` (DS-GEN-16's pool key), matches the new clause OR the old one, so a saved world's annotation still keys. The desk never prints the annotation, and the key is unchanged, so no prose cell moves. `generalStateProseDesk`'s fixture is re-keyed to the new clauses, and a new arm pins that the old three still key.

#### 7.2.9 `7e1009be5` — the conversion vignette, variant 0 (A2)

| OLD | NEW |
|---|---|
| … The old institution has the building, the records, the accumulated donations, and a congregation that is quietly redistributing itself. Neither party is ready to force a confrontation. Both are watching the numbers. | … The old faith has the building, the records, the donations of generations, and a congregation that is quietly slipping away to the new one. Neither side is ready to force a confrontation, and both are counting who comes on holy days. |

#### 7.2.10 `4296505ed` · `ee5d994fb` · `efe1294e4` — the three single rows

| file | OLD | NEW |
|---|---|---|
| cultureProfiles.js (celtic builtForm) | … linked by lanes rather than a rigid grid. | … linked by winding lanes with no set grid. |
| cultureProfiles.js (steppe socialTexture) | The settlement is a meeting point between mobile and sedentary expectations rather than the whole society. | The settlement is where mobile and settled ways of life meet, and much of the society lives beyond it. |
| safetyProfile.js (revolt, public order) | Some residents have left rather than be forced to choose. | Some residents have already left, so they will not be forced to choose. |
| allegiance.js (fanaticism goal) | Bend every rule for the cause and call the corruption devotion. | Bend every rule for the cause, and call it devotion. |

safetyProfile.js: neither SW-B5's pushed tip (hunks at 356 / 400 / 839+) nor SW-B6's (180 / 816+) touches this line, so it was taken here and there is no collision. The file's other two "rather than" (the desperation-theft const and the territorial-gangs desc) do not print on the audit's twelve and are not this lane's rows.

#### 7.2.11 `d8739f6e3` · `b26d35d0a` · `6cda3ce68` — `dmPowerLines.js` (item 10)

**(a) The hall's rung labels: a PROPOSAL for the owner's veto.** The keys stay; only the printed labels move.

| key | OLD label | NEW label |
|---|---|---|
| none | None | Free of the criminals |
| adversarial | Adversarial | Fighting the criminals |
| equilibrium | Equilibrium | Living with the criminals |
| corrupted | Corrupted | Partly in criminal hands |
| capture | Capture | Run by the criminals |

**(b) The boosts.** The row "{power} · {base} on its own, +{boost}, {effective} in all" (screen and PDF) becomes "{power} · " + `boostWords(base, boost)`: "a little stronger" (boost under a fifth of base), "much stronger" (under three fifths), "about twice as strong as" (under one and a half times), or "far stronger than its own members could make it". The three patron lines keep their facts without the figure:

| line | OLD | NEW |
|---|---|---|
| open[0] | …, also holds {share} in {power}, and that lends {power} +{boost} in strength. | …, also holds {share} in {power}, and that lends {power} weight it would not have on its own. |
| hidden[0] | …, secretly answers to {power}, and that lends {power} +{boost} in strength that nobody outside the arrangement can see. | …, secretly answers to {power}, and that lends {power} strength nobody outside the arrangement can see. |
| hidden[2] | … Counting {name}, {power} stands +{boost} stronger. | … Counting {name}, {power} is stronger than it looks. |

**(c) The refusal line.** open[1], "When {power} wants something from {ruler}, {name} is the one who asks for it. {name} is {place} and holds {share} in {power}.", is now keyed by the patron's place:

| place | NEW |
|---|---|
| head | {name} heads {ruler} and also holds {share} in {power}, so what {power} wants from {ruler} goes straight to the top. |
| second | {power} brings its requests to {ruler} through {name}, second in {ruler}, who holds {share} in {power}. (The panel gives the second the third line, so this branch is reached only through the table.) |
| third | {name} is third in {ruler} and holds {share} in {power}, and carries {power}'s requests to the two above. |
| steward | While the seat of {ruler} stands empty, its steward {name} holds {share} in {power}, and {power}'s requests go through {name}. |

### 7.3 Pins and registers re-keyed by cause (never loosened)

- `tests/generators/generationForkCensus.test.js` — the hash-site row `npcData.js:1436` → `:1537`, a pure line move (`d41435ecd`).
- `tests/data/criminalSecretsByHolder.test.js` — the flat-table sha `4b3d62d6…` → `ba46807b…` (`4c5614d27`).
- `tests/generators/foodRecord.test.js` "the situation sentence names the gap …": `/18% of daily need/` → the Import-Dependent band words, with a Deficit arm added at 45; the anchor at the cut is kept. `tests/generators/foodModelSingleWriter.test.js` "keeps the audited isolated-village verdict …": the 26% → the band words, and the rationing clause re-anchored (`6f340466f`).
- `tests/domain/generalStateProseDesk.test.js` — the legacy clauses re-keyed, with an arm pinning the old three (`cbba52029`).
- The CENSUS-4 declaration ledgers (`docs/census/declarations/`), texts re-spelled with ids, needs and colour unchanged: `npcData.NPC_CRIMINAL_SECRETS` (2), `npcData.STRESS_ECONOMIC_EFFECTS` (26), `npcData.SPEECH_PATTERNS`, `.NPC_PLOT_HOOKS` (2), `.NPC_FACTION_GOALS`, `.NPC_SECRETS`, `CULTURE_PROFILES_DAILY` (2), `corruptionPass.CORRUPT_SHORT_GOAL`. `census4Ledger` and `census2dTables` are green. (`census4-extract-pools.mjs` throws at this base, so the ledgers were re-spelled row by row against the source's AST rendering, `{A}`/`{B}` for the pair.)
- `tests/domain/tonightConcreteFirst.test.js` soak1k-868 (`c8c760142`), `tests/domain/worldFactRederive.test.js` A4 (`1d1369095`), the size ratchet held by folding, not raising (`969e95133`), and the two registers through their doors (`417acb424`, `8ab5972db`).
- `node scripts/wiring-census.mjs --check` passes at the npcData tip (857 pools / 2,764 variants), so no census re-write is owed. The new exports `NPC_DEALING_BY_TRAIT` and `DEALING_TRAIT_FAMILY` are not enrolled in `scripts/lib/table-pools.mjs` (a hand list); this is named for the merge seat as an enrolment it may want.

### 7.4 The referee

**The twelve** (npc cards, scratch `npcmeas.mjs`): "How they deal" top three **371 → 81** cards (54 distinct lines; the largest single line 28). Secret frames twice or more in one dossier **20 → 0**; the largest frame **30 → 9**. Tie tension lines naming nobody: **81 → 0**. These lines print on the opened cards (`<div>` rows), which the soak's story set (`<p>` sentences) does not count, so the twelve is their measure.

**The 1,000** at `effda57d6` (after npcData) and at `6cda3ce68` (after item 10): exit 0, 1,000 settlements, 0 errors, 702 findings, CLIMB, both. **The twenty frames: none raised.** All twenty read exactly their base counts at both tips (439 … 194). **Nothing new or risen in the top forty** at `effda57d6`. At `6cda3ce68`, two frames enter the top forty at 166 (economy.generated.js "others want @ for what it controls."; defense.generated.js "if you are wronged at @, there is nowhere to take it …"). The base's top-forty list ends with a tie at 166, so neither is risen; they moved up when the 168-town frame below left. Neither is this lane's writer.

**The refusal line on this lane's own frame**, counted by the DM view's own builder (`patronage.js :: dmPowerViewOf`) over the 1,000 births at each sha, with every roster and power name masked (scratch `patron.mjs`):

| frame | base `dc5684e66` | tip `6cda3ce68` | verdict |
|---|---|---|---|
| "when @ wants something from @, @ is the one who asks for it." | 168 | 0 | falls |
| its largest successor ("@ heads @ and also holds a large share in @, so what @ wants from @ goes straight to the top.") | — | 64 | the split by place and share |
| "counting @, @ is stronger than it looks." (hidden[2]'s successor) | split by its figure at the base ("… stands +N stronger.") | 7 | the figure leaves; the line is now one frame of 7, far below the top forty |

### 7.5 The deltas, for STYLE-2-MERGE's signing (UNSIGNED)

Measured in clean detached worktrees at each parent and commit (`/home/user/sw7-base`, `/home/user/sw7-m-<sha>`), parent → commit, with the same tools as §7.0.

| commit | gm /525 (fields) | fence /360 | prose /1,050 | witness | herald · pdf |
|---|---|---|---|---|---|
| `d41435ecd` | 525 (npcs) | 360 | 0 | 0 | 0 · 0 |
| `4c5614d27` | 280 (npcs) | 196 | 0 | 0 | 0 · 0 |
| `fb712a8d7` | 272 (npcs) | 211 | 0 | 0 | 0 · 0 |
| `640378639` | 450 (relationships 450, prominentRelationship 138, pressureSentence 1) | 293 | 0 | 0 | 0 · 0 |
| `effda57d6` | 333 (npcs) | 230 | 0 | 0 | 0 · 0 |
| `4bf93741b` | 218 (institutions) | 192 | 0 | **2 of 8 rows** (`settlementUpdatesSha256`) | 0 · 0 |
| `6f340466f` | 74 (economicState) | 122 | 0 | 0 | 0 · 0 |
| `936d4ec06` | 525 (history 525, generationCoherenceReceipt 50) | 337 | 0 | 0 | 0 · 0 |
| `7e1009be5` | 0 | 1 | 0 | 0 | 0 · 0 |
| `4296505ed` · `ee5d994fb` · `efe1294e4` | 0 · 0 · 0 | 0 · 0 · 0 | 0 | 0 | 0 · 0 |
| `d8739f6e3` · `b26d35d0a` · `6cda3ce68` | 0 · 0 · 0 (the DM lines are composed at view time) | 0 | 0 | 0 | 0 · 0 |
| `cbba52029` | 525 (history) | 337 | 0 | 0 | 0 · 0 |

Per tier: `d41435ecd` thorp 84, hamlet 84, village 84, town 105, city 84, metropolis 84; `4c5614d27` 65 / 12 / 12 / 96 / 58 / 37; `fb712a8d7` town 104, city 84, metropolis 84; `640378639` 38 / 73 / 67 / 104 / 84 / 84; `effda57d6` hamlet 48, village 12, town 105, city 84, metropolis 84; `4bf93741b` thorp 84, town 62, city 28, metropolis 44; `6f340466f` 12 per tier (town 14); `936d4ec06` every row. The witness is green at `effda57d6` and red from `4bf93741b`; the tip carries the same two hashes, so no later cause moves it. Herald and PDF are green at the tip (`heraldKnowledgeDeskGolden`, `goldenViewModel`).

**The reds that move with these goldens** (green with the merge seat's re-record): `generatorGoldenMaster`, `espionageDormancyFence` THE DRIVEN GOLDEN, `presetLightingWitness`, and the gm-stride pins the first seat named (`pipelinePinnedChoosers` A1, `pipelinePinnedMode`, `generationForkCensus` A1, …), each already red at `dc5684e66`. **The full suite at the tip** against the base's 41 files / 63 tests: 44 files / 72 tests red at `cbba52029` against the base's 41 / 63. Of the ten tests red at the tip and not at the base: `presetLightingWitness` is the witness golden (`4bf93741b`, unsigned, above); the other nine were cured on the lane by cause in `969e95133` (sizeBaseline: npcGenerator.js 1195 > frozen 1192, folded back to 1192, never raised), `c8c760142` (tonightConcreteFirst soak1k-868), `1d1369095` (worldFactRederive A4), `417acb424` (writerReach, its shrink-only door) and `8ab5972db` (the wiring census stamp, which also turned `dossierStateProseProjection`'s two arms and `proseWiringCensus`'s two green). Three base reds are green at the tip (foodDiversity, ledgerCitationIntegrity with the ledger ref present, provenanceMap); none is this lane's cure. Every remaining red at the tip is in the base's list or moves with a golden this lane names..

### 7.6 Merge notes for STYLE-2-MERGE

- **npcGenerator.js** (SW-5's file, SW-5 closed): SW-5's hunks are at :478, :536, :752, :1143 and :1597; SW-7's sites are :160 and :697 (pickTitle) and the CRIME_KNOWLEDGE held key (around :740–:760, below SW-5's stakes line at :752). They do not overlap (the chair's ruling of 09:0x).
- **pdf/sections/WhoRunsThisTown.jsx** (SW-B4's directory): one line and the import. SW-B4's pushed tip leaves the file unchanged.
- **generalStateProse.js** (`legacyPoolKey`'s three regexes) and **generalStateProseDesk.test.js** (:1196): SW-B2's and SW-9's hunks in that test sit elsewhere (:116 / :823 / :1340 / :1349; :714 / :761).
- **safetyProfile.js**: split by row with SW-B5 and SW-B6. This lane's one row (the revolt line) is not in either lane's hunks.

### 7.7 CONFIRMED against PLAUSIBLE

CONFIRMED:
- The base `dc5684e66`, verified.
- The twelve's counts before and after, from the same births.
- The 1,000 at the base and at two lane tips (exit 0, 0 errors), the twenty frames, and the refusal-line count.
- Every gm / fence / prose / witness delta, from clean worktrees at parent and commit.
- Every pin re-key, run red and then green.
- Each suite's reds, matched to the base's full run.
- tsc 167 = 167 at the npcData tip.
- The three record walkers at the push.

PLAUSIBLE:
- That each new line reads better under the owner's law (the owner's veto decides), the rung labels above all.
- That the dealing families map each trait word as a reader would.

## What stays (by file), after the second seat

- `src/data/powerSiblings.js` :85 / :89 — **not landed (STOP, ruled 10:1x: to SW-B1).** The declaration census binds each key to the line `rulingStructure.js` prints (`census5bOffCensusDeclarations`, `census5dGarrisonReword` red when only this side moves). SW-B1 takes the four strings together with P50 / P51, re-spelled byte for byte: "Well-funded city watch; it keeps order reliably and is growing more sure of its own authority." and "A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them."
- `src/data/npcData.js` — a tension frame can still repeat for several pairs in one dossier. The tie pools hold eight lines and a town carries more ties of one archetype than that, so a cure is pool growth or the draw in `people/ties.js`, outside this lane.
- `tests/domain/tonightConcreteFirst.test.js` — the "voiced with nothing" branch (a seat with an abstract goal, no secret, no temperament) lost its natural witness at soak1k-868 (`c8c760142`); a planted witness, or a seed that still carries one, is owed.
- `scripts/lib/table-pools.mjs` — the enrolment of `NPC_DEALING_BY_TRAIT` / `DEALING_TRAIT_FAMILY`, if the merge seat wants the census to see them.
- Named, not this lane's (unchanged from the first seat): `neighbourFactions.js`'s two tokens and the "(dominant)" suffix (SW-8); `rulingStructure.js` P50 and P51 (SW-B1); DS-POW-5's `mixed` arm's silence (the follow-up).
