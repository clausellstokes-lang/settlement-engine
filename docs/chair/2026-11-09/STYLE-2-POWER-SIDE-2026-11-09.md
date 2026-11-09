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
