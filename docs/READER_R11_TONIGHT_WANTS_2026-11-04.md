# READER R11 — the Tonight sheet's wants in the house register, and R7's seam (2026-11-04)

Lane `lane/reader-tonight-wants-2026-11-04`, cut from `lane/window-rung2-2026-11-04` at its tip
`3bc72bc0c` (rung 2D; it contains the briefed base `6a9fb3cad`). A dated lane record: no signed
record, no golden re-recorded, nothing refrozen. Measured with `node scripts/audit/soak-review.mjs`
(the 60 and the 1,000) and the lane's probe (every "People to voice" line with its source).

## 1. The measure first (the 60 at the base)

Every "People to voice" line on the 60 (149 lines), by why the person is on the sheet and where
the line comes from:

| row | source | lines |
|---|---|---|
| cast | `CAST_WANTS` (F13) | 41 |
| seat | the registry's `goal.short` (`npcStructure.js`) | 35 |
| cleric | the registry's `goal.short` | 14 |
| seat · cleric | a role or stress goal (`npcGenerator.js :: generateNPCGoal`) | 5 · 9 |
| secret (the crisis secret's keeper) | `secret.what` | 33 |
| seat (also the crisis secret's keeper) | `secret.what` — printed after "Wants to" | **12** |

Verdicts in the DM's register: the 41 cast lines and the 33 secret rows are voiceable; 49 of the
49 registry lines are abstract ("Wants to convert governance instability into a restoration of
prerogatives that formal governance had constrained" ×8, "use current stability to address
structural vulnerabilities before conditions change" ×8, "extend the institution's civic role…"
×7, "restore enough perceived legitimacy…" ×7, …); 4 of the 14 role/stress goals are abstract
("preserve the institution's position through the transition…", "end the revolt without either full
suppression or formal negotiation: both options set precedents…", "position themselves before…");
the 12 seat-secret lines are a sentence, not a want.

**Sheets with at least one abstract line: 46 of 60. Sheets with the seam: 12 of 60** (by the
instrument, `reader:tonight-wants` sub-cases, §5).

The chair's named births at the base and after (seat / cleric / cast / secret rows):

| seed | row | base | after |
|---|---|---|---|
| soak1k-24 (Grüngrund) | seat, registry | convert governance instability into a restoration of prerogatives… — abstract | take back the old family rights the seat stripped away, while it is too weak to refuse. |
| soak1k-8 (Achileia) | seat, role goal | cover up a minor corruption scandal before the regional lord hears of it. — voiceable | unchanged |
| soak1k-22 (Frostås) | seat, secret | "Wants to Has been making personal side payments…" — the seam | Secret: Has been making personal side payments… |
| soak1k-22 | cleric, registry | build pastoral standing and institutional credibility… — abstract | serve their flock so faithfully that their superiors cannot pass them over again. |
| soak1k-28, -32 | seat, registry | restore enough perceived legitimacy… — abstract | get the seat obeyed again before the week is out, or find a quiet way out of it. |
| soak1k-8, -28, -32 | cast · secret | voiceable (F13 already moved their pasted secrets to the secret row) | unchanged |

## 2. The mechanism (R7's seam), measured, against the brief

The brief located the seam in "a writer that puts a sentence into `goal.short`". **At this base no
such writer exists**: 0 of 597 NPCs on the 60 carry a sentence in `goal.short`; the stress-driven
secret branch writes `secret.what`; `NPC_SECRETS` (the fallback of `generateNPCGoal`) holds goal-shaped
`{ short, long }` rows. The rung-1D seeds `soak1k-8`, `-28`, `-32` no longer seam: F13 voices their
pasted secrets on the secret row. **All 12 seams on the 60 are one mechanism in the sheet itself**:
`tonightSheet.js :: peopleOf`'s `add` voices the seat-holder who also keeps the crisis's own
secret once, with the secret, but kept `why: 'seat'`, and every renderer prints a non-`secret` row
after "Wants to". Cured there (unit 2): the person says what its line is (`says`), and the three
renderers ask `printsAsWant` / `secretLeadOf` (one home).

## 3. The cure, unit by unit

| unit | commit | what |
|---|---|---|
| 1 | `6ea19cf` | THE ONE SHAPE RULE `tonightSheet.js :: isVoiceableWant` / `wantRegisterFault` (lead verb not convert / build / maintain / advance / consolidate / leverage / position / demonstrate / navigate / sustain / formalize / deploy / redirect / stabilise / establish / cultivate / optimise; ≤ 18 words; none of `ABSTRACT_REGISTER_WORDS`; a capital / subject / auxiliary lead is a sentence). `readerBattery.js :: tonightWantsFindings` gains `[abstract-register]` beside `[sentence-not-a-want]`. |
| 1b | `7f06324` | The word list widened by the four OLD registry goals that still read voiceable (supply situation, commercial relationships, distribution network, parallel distribution, justification, triggering a response, consolidate). 0 of the 76 old strings read voiceable; every `CAST_WANTS` line does. |
| 2 | `2740764` | R7 at the source (§2). Renderers touched: `components/TonightSheet.jsx`, `pdf/sections/TonightAtTheTable.jsx`, `foundry/journalPages.js` (one condition each). |
| 3 | `73fa1a1` | The 76 registry goals rewritten (§4). Only `goal:` strings; the dead subordinate-fallback template reuses the dominant goal. |
| 4 | `a221447` | THE SHEET PREFERS THE CONCRETE: `tonightSheet.js :: voicedLineOf` — (b) own goal only when voiceable, else (c) secret, else (d) temperament; (a) the cast want stays first on the sheet. `settlementQuickGuide.js :: personDetail` reads the same function. |
| 4b | `63f35a1` | A crisis TARGET's own line never falls back to that crisis's secret (the 60 after unit 4 read `coh:crisis-cast-sense` 2: soak1k-26, -55 `target_runs_plot`; back to 0). |

The brief's "78 `goal:` strings" counts the dead fallback template and the `goal: updatedGoal`
key; the registry holds **76** strings in 38 `reg(...)` entries (economy and crafts share six
entries; `other` maps four conditions onto its stable pair).

**`position:` and `constraint:` print** — on the NPC card (`components/new/npcComponents.jsx`,
`structuralPosition` italic line and "Constraint:"), not on the Tonight sheet or the Quick Guide.
Kept unchanged: rewriting them is a second cause in the same 525 golden rows (the standard's
one-cause rule), and no instrument reads them. Open question 1.

**CENSUS-4**: this lane changes only the `goal:` string values in `npcStructure.js`, never an
entry's shape; a `tags` field added beside them merges cleanly line by line.

## 4. The 76 registry lines, old → new (recorded as the chair's ruling; the owner's veto after the fact)

Each new line: the same intention, as a thing the person would do tonight, ≤ 18 words, concrete,
presuming nothing the record may lack beyond its condition key (no walls, watch, market, temple,
river, guild hall, tier noun), and asserting no calm (a stable-condition goal is drawn under any
crisis: `Use current stability…` was rung 2D's crisis-blind row). Every one passes
`isVoiceableWant` (`tests/generators/npcStructureWantsVoiceable.test.js`).

| # | category · condition · rank | old (the registry, base) | new (the chair's ruling, R11) | words |
|---|---|---|---|---|
| 1 | government · governance fractured · dominant | Restore enough perceived legitimacy to make the governing role functional, or identify an exit before the gap between title and authority becomes irreversible. | Get the seat obeyed again before the week is out, or find a quiet way out of it. | 18 |
| 2 | government · governance fractured · subordinate | Keep the institutional position viable through the governance crisis without being visibly associated with either the failure or an opportunistic alternative. | Keep their office through the collapse without being seen with the failing seat or its rivals. | 16 |
| 3 | government · corruption · dominant | Maintain governance viability without forcing a confrontation with the informal arrangements it depends on. | Keep the seat running without crossing the people whose payments keep it running. | 13 |
| 4 | government · corruption · subordinate | Maintain credibility by demonstrating institutional function in areas the corruption has not reached. | Show their own books are clean while the people above them take payments. | 13 |
| 5 | government · food crisis · dominant | Stabilise the supply situation before the crisis opens political space for an alternative authority. | Get food to every door before a rival for the seat does it first. | 14 |
| 6 | government · food crisis · subordinate | Redirect accountability upward while demonstrating visible institutional effort that does not require resources this position controls. | Be seen handing out what little there is, and let the blame for the rest go upward. | 17 |
| 7 | government · economic stress · dominant | Demonstrate governance value through means that do not depend on economic conditions the settlement currently lacks. | Win the people back with things that cost nothing: fair hearings and quick answers. | 14 |
| 8 | government · economic stress · subordinate | Protect the institutional role by making it indispensable for whatever limited resources remain to be managed. | Become the one person who signs off on every coin the seat still spends. | 14 |
| 9 | government · contested · dominant | Convert contested authority into stable authority before the contest resolves in someone else's favor. | Win the doubters back before the challenger to the seat wins them first. | 13 |
| 10 | government · contested · subordinate | Navigate the political contest without committing to a side until the outcome is sufficiently clear to make the commitment worthwhile. | Stay off both sides of the fight for the seat until it is plain who wins. | 16 |
| 11 | government · stable · dominant | Use current stability to address structural vulnerabilities before conditions change. | Fix the weakness in the seat that nobody wants to talk about, before someone uses it. | 16 |
| 12 | government · stable · subordinate | Advance the faction's institutional standing through the credibility that comes from competent administration of current responsibilities. | Do every task the seat hands them so well that the seat cannot do without them. | 16 |
| 13 | military · governance fractured · dominant | Maintain operational cohesion and institutional loyalty while the political situation makes the chain of command ambiguous. | Keep the people under their command together, whoever ends up giving the orders. | 13 |
| 14 | military · governance fractured · subordinate | Keep the unit functional and loyal to the institution rather than to any individual faction competing to claim the enforcement apparatus. | Stop any faction buying their squad away from them while the seat is broken. | 14 |
| 15 | military · corruption · dominant | Determine which elements of the enforcement apparatus are reliable without triggering a response before that determination is complete. | Find out which of their own officers are on the take, before the payers notice. | 15 |
| 16 | military · corruption · subordinate | Maintain unit effectiveness and personal integrity without creating the kind of visibility that makes the unit a target for either the corrupt interests or those investigating them. | Keep their own hands clean without catching the eye of the bribers or the inquiry. | 15 |
| 17 | military · food crisis · dominant | Maintain order through the crisis without deploying force in ways that create grievances that outlast it. | Keep the hungry from rioting without striking anyone the crowd will remember. | 12 |
| 18 | military · food crisis · subordinate | Keep order in the assigned sector with the resources available, without creating incidents that escalate beyond the unit's capacity. | Hold their patch quiet with too few hands, and start no fight they cannot finish. | 15 |
| 19 | military · economic stress · dominant | Keep enforcement visible enough to deter disorder without making the enforcement apparatus the primary civic grievance. | Be seen enough to stop trouble, and not so much that people start to hate them. | 16 |
| 20 | military · economic stress · subordinate | Maintain unit effectiveness with reduced resources while preventing the visible deterioration in capacity from becoming an invitation. | Hide how short of pay and gear their squad has become before someone tests it. | 15 |
| 21 | military · contested · dominant | Keep the enforcement apparatus out of the political contest long enough for the contest to resolve. | Keep everyone under their command out of the fight for the seat until it is settled. | 16 |
| 22 | military · contested · subordinate | Keep the unit's loyalty to the institution intact through the contest rather than allowing it to fragment along factional lines. | Stop their squad splitting into two camps before the fight for the seat is over. | 15 |
| 23 | military · stable · dominant | Maintain the enforcement capacity and institutional culture that makes current stability possible. | Keep the drills, the patrols and the pay going, and the old hands in charge of them. | 17 |
| 24 | military · stable · subordinate | Build unit reputation and institutional standing through consistent performance of routine responsibilities. | Get their squad noticed for doing the dull work well, and earn a patron by it. | 16 |
| 25 | economy / crafts · governance fractured · dominant | Formalize the independent operational authority that governance failure has created in practice, before reconsolidation reasserts control. | Get their trade's new freedoms written down before whoever takes the seat next takes them back. | 16 |
| 26 | economy / crafts · governance fractured · subordinate | Use the governance instability to advance commercial standing relative to the dominant commercial interest without triggering a defensive response. | Take customers from the biggest house in the trade while the seat is too weak to care. | 17 |
| 27 | economy / crafts · corruption · dominant | Maintain commercial operations without becoming either a target of the criminal arrangements or a dependent of them. | Keep trading without paying the gangs, and without needing their protection either. | 12 |
| 28 | economy / crafts · corruption · subordinate | Distinguish the commercial position from the corruption without provoking retaliation from the interests that benefit from it. | Be known as the honest dealer without the crooks deciding to make an example of them. | 16 |
| 29 | economy / crafts · food crisis · dominant | Manage the supply situation in a way that preserves commercial relationships and reputation beyond this crisis. | Sell what food they hold at a price nobody will hold against them after the shortage. | 16 |
| 30 | economy / crafts · food crisis · subordinate | Find commercial position in the crisis that does not depend on controlling the critical shortage commodity. | Find something else to sell while the food runs short and the big dealers hold it. | 16 |
| 31 | economy / crafts · economic stress · dominant | Identify which commercial relationships will survive the current stress and consolidate around those. | Work out which buyers will still pay next year, and drop the rest before they drag them down. | 18 |
| 32 | economy / crafts · economic stress · subordinate | Find the commercial niche that larger interests do not find worth contesting. | Find the small trade the big houses will not bother to fight them for. | 14 |
| 33 | economy / crafts · contested · dominant | Position commercial interests to maintain relevance regardless of which faction prevails. | Lend to both sides of the fight for the seat, so whoever wins owes them. | 15 |
| 34 | economy / crafts · contested · subordinate | Maintain commercial relationships with all significant factions without being treated as an asset by any of them. | Keep selling to every faction without any of them treating their goods as its own. | 15 |
| 35 | economy / crafts · stable · dominant | Convert commercial leverage into more durable institutional advantages before conditions change. | Turn their hold on the trade into a charter, a seat at the table, or a monopoly. | 17 |
| 36 | economy / crafts · stable · subordinate | Grow commercial standing within the constraints the dominant commercial interest creates. | Win more custom without treading on the biggest house in the trade. | 12 |
| 37 | religious · governance fractured · dominant | Extend the institution's civic role in ways that survive whatever governance reconsolidation follows. | Settle the disputes the seat has stopped settling, in the faith's name, and keep doing it afterwards. | 17 |
| 38 | religious · governance fractured · subordinate | Maintain the position's relevance by demonstrating pastoral function that does not depend on the failing civic structures. | Keep marrying, burying and comforting their flock while the seat fails around them. | 13 |
| 39 | religious · corruption · dominant | Sustain the institution's credibility while navigating a civic environment where most institutions have accommodated compromise. | Keep the faith's name clean while every other office in the place takes payments. | 14 |
| 40 | religious · corruption · subordinate | Build pastoral trust at the community level that is not contingent on the credibility of the civic structures above it. | Earn their flock's trust face to face, so it outlasts their trust in the crooked seat. | 16 |
| 41 | religious · food crisis · dominant | Deploy welfare capacity in ways that address the crisis and reinforce the institution's civic indispensability. | Feed the hungry from the faith's stores, and make sure everyone knows who fed them. | 15 |
| 42 | religious · food crisis · subordinate | Connect the community under pastoral care to whatever relief infrastructure exists, maintaining pastoral standing as a reliable intermediary. | Get their own flock a share of whatever relief there is, and be thanked for it. | 16 |
| 43 | religious · economic stress · dominant | Preserve institutional resources through the economic pressure without appearing to prosper from conditions that are harming the population. | Keep the faith's lands and coin intact without looking rich while the people go short. | 15 |
| 44 | religious · economic stress · subordinate | Maintain the position's function with reduced resource support from institutional sources. | Keep their small charge going on half the alms and none of the help. | 14 |
| 45 | religious · contested · dominant | Delay public alignment until the outcome is clear enough to make the endorsement worthwhile rather than premature. | Give no blessing to either claimant until it is plain which one will hold the seat. | 16 |
| 46 | religious · contested · subordinate | Follow the institutional alignment when it is made without appearing to have advocated for it prematurely. | Back whichever claimant their superiors bless, and be seen to have waited for the word. | 15 |
| 47 | religious · stable · dominant | Maintain the institution's role in civic life through the legitimacy of pastoral service rather than political pressure. | Keep the faith at every naming, wedding and burial, and out of the seat's quarrels. | 15 |
| 48 | religious · stable · subordinate | Build pastoral standing and institutional credibility through consistent service in a context where the dominant institution sets the standard. | Serve their flock so faithfully that their superiors cannot pass them over again. | 13 |
| 49 | criminal · governance fractured · dominant | Extend operational scope while governance is weakened in ways that become embedded before reconsolidation. | Take over whatever the seat has stopped watching, and dig in before it recovers. | 14 |
| 50 | criminal · governance fractured · subordinate | Advance within the criminal hierarchy using the conditions of governance failure. | Climb over the boss's other lieutenants while nobody is enforcing anything. | 11 |
| 51 | criminal · corruption · dominant | Maintain the arrangements that allow current operations while managing the risk that they become a liability if political conditions change. | Keep the bribed officials paid and quiet, and keep proof of every payment in case they turn. | 17 |
| 52 | criminal · corruption · subordinate | Leverage the operational freedom the arrangements provide without becoming dependent on their continuation. | Use the bought protection while it lasts, and have a way out when it ends. | 15 |
| 53 | criminal · food crisis · dominant | Profit from the shortage through parallel distribution without triggering a response that uses the public interest as justification. | Sell food on the side at hungry prices, without becoming the face of the shortage. | 15 |
| 54 | criminal · food crisis · subordinate | Secure a reliable role in the crisis distribution network before the dominant criminal interest consolidates its position. | Get a cut of the black-market food before the boss shuts everyone else out. | 14 |
| 55 | criminal · economic stress · dominant | Convert expanded recruitment opportunity into operational capacity that persists after economic conditions ease. | Sign up the desperate while they are cheap, and keep them once times get better. | 15 |
| 56 | criminal · economic stress · subordinate | Build a stable position within the network that is not contingent on the economic conditions that created the opportunity. | Make themselves worth keeping to the crew for reasons that will survive good times. | 14 |
| 57 | criminal · contested · dominant | Expand operational positions during the political distraction that would face more resistance under settled conditions. | Move into new rackets while the claimants to the seat are busy with each other. | 15 |
| 58 | criminal · contested · subordinate | Consolidate personal position within the network during the expansion, independent of whether the expansion succeeds. | Grab their own share of the crew's new ground, so they keep it if the push fails. | 17 |
| 59 | criminal · stable · dominant | Maintain operations within the constraints that functional enforcement creates, without triggering focused attention. | Keep the rackets small and steady enough that the law never bothers to look. | 14 |
| 60 | criminal · stable · subordinate | Demonstrate reliability within the network sufficient to advance position without creating visibility that enforcement acts on. | Prove to the boss they can be trusted with more, without the law learning their name. | 16 |
| 61 | magic · governance fractured · dominant | Convert temporary crisis leverage into more durable institutional standing. | Turn every favour the seat now begs of their spells into a right it cannot take back. | 17 |
| 62 | magic · governance fractured · subordinate | Maintain operational position through the governance crisis without becoming associated with any faction competing to resolve it. | Keep working spells for anyone who pays while refusing to be counted on any side. | 15 |
| 63 | magic · corruption · dominant | Maintain institutional independence without becoming so embedded in the corruption that independence becomes unavailable. | Stop casting concealments for the crooks before the crooks own them outright. | 12 |
| 64 | magic · corruption · subordinate | Sustain the practice by providing arcane services that are not already dominated by the institutional position above. | Take the spellwork their seniors turn down, and ask no questions about why it was refused. | 16 |
| 65 | magic · food crisis · dominant | Deploy arcane capacity to address the crisis while establishing the institutional indispensability that justifies expanded authority. | Save what food magic can save, and make the seat pay for it in rights. | 15 |
| 66 | magic · food crisis · subordinate | Make the arcane contribution through institutional channels that increase rather than circumvent personal standing. | Offer their spells for the shortage through their seniors, and see their own name on it. | 16 |
| 67 | magic · economic stress · dominant | Identify which arcane services are structurally indispensable enough to be funded under economic pressure. | Work out which spells people will still pay for when the coin runs short, and keep those. | 17 |
| 68 | magic · economic stress · subordinate | Find the arcane service niche that survives economic pressure because it is necessary rather than convenient. | Find the plain, needed spellwork that people buy even when they buy nothing else. | 14 |
| 69 | magic · contested · dominant | Preserve the institution's autonomy through the political transition, regardless of which faction prevails. | Refuse every claimant who wants their spells, so whoever takes the seat cannot call them traitors. | 16 |
| 70 | magic · contested · subordinate | Position the practice to be valuable to whatever governance emerges from the contest without being committed to any specific outcome. | Be useful to whoever wins the seat, and promise nothing to anyone before then. | 14 |
| 71 | magic · stable · dominant | Maintain and extend the arcane institution's role in civic and commercial life. | Win more of the seat's work for their spells, and more of everyone else's. | 14 |
| 72 | magic · stable · subordinate | Build practical arcane standing through the quality of services rather than institutional authority. | Become the caster people ask for by name, whatever their seniors think of them. | 14 |
| 73 | other · governance fractured · dominant | Convert governance instability into a restoration of prerogatives that formal governance had constrained. | Take back the old family rights the seat stripped away, while it is too weak to refuse. | 17 |
| 74 | other · governance fractured · subordinate | Use the governance instability to close the gap between the secondary traditional position and the dominant one. | Catch up with the greater family while the seat is too busy to keep them apart. | 16 |
| 75 | other · stable · dominant | Maintain traditional standing within the constraints that stable institutional competition creates. | Keep the family's name honoured at every feast while the new offices take its old work. | 16 |
| 76 | other · stable · subordinate | Convert traditional standing into operational relevance through alliances that institutional actors find useful. | Marry, lend or befriend their way into the offices that now run things. | 13 |

## 5. The class: the 60 and the 1,000, before → after

`reader:tonight-wants`, settlements by sub-case (the before is the base generation read by the
final instrument, `6ea19cf` + `7f06324`'s list):

| corpus | sub-case | before | after | by tier before (thorp/hamlet/village/town/city/metro) |
|---|---|---|---|---|
| 60 | the class | 51 | **0** | 8/8/7/9/9/10 |
| 60 | abstract-register | 46 | **0** | 6/8/7/7/9/9 |
| 60 | sentence-not-a-want (the seam) | 12 | **0** | 2/1/3/2/2/2 |
| 1,000 | the class | 865 | **0** | 132/144/133/147/155/154 |
| 1,000 | abstract-register | 781 | **0** | 108/141/108/131/149/144 |
| 1,000 | sentence-not-a-want (the seam) | 128 | **0** | 24/15/31/24/17/17 |

After is 0 in every tier; no seed or line remains (the bar was the seam → 0 and the abstract
sub-case under 1 in 100). The 60 by unit: after unit 2 the seam 12 → 0; after unit 3 abstract 46 → 4
(soak1k-20, -57 "preserve the institution's position through the transition…", soak1k-26 "end the
revolt without either full suppression…", one more); after units 4 and 4b → 0.

Every other reader class holds its count at 1,000 (validation-on-page 985, relation-types 647,
daily-life-placeholder 495, traditions-water 150, rule-text 148, scale-lists 156, hook-pools 113,
possessive-slip 93, tension-memory 60). `coh:*` at 1,000: `coh:crisis-blind-prose` 278 → 126 (the
registry's "current stability" / "competent administration" / "stable institutional competition"
wants were rung 2D's widened phrases; the 126 left are rung 2D's other phrases, not this lane's);
every other `coh:*` class reads 0 before and after, `coh:crisis-cast-sense` included (unit 4b). On
the 60: crisis-blind 24 → 10, everything else 0. 0 errors on every run.

**ONE WANT, ONE HOME** (`wantsOnce`): sheets where two people share one want line, folded to "Wants
the same as": 0 of 60 and 0 of 1,000 after (0 and 0 before: since F13 the cast holds the first
slots, and the registry's dominant and subordinate lines differ in every cell, which the unit-3
test pins).

**What the people say after** (the 60, 149 lines): cast want 41 · registry goal 49 (all voiceable) ·
role/stress goal 10 (voiceable) · the crisis secret's keeper 33 · the seat keeping the crisis secret,
under "Secret:" 12 · a cleric's own secret 2 · a temperament 1 ("Dependable.", soak1k-55, a target) ·
nothing 1 (soak1k-26, §8 q6).

Run directories: the 60 `artifacts/r11-base` (base, old instrument), `artifacts/r11-u1` (unit 1b),
`artifacts/r11-u3`, `artifacts/r11-after`; the 1,000 before ran in a scratch worktree of `6ea19cf`
with `7f06324`'s list, after in `artifacts/r11-k-after` (artifacts are not committed).

## 6. Golden rows and what else moved

The 525 golden rows, hashed the golden suite's way (`generatorGoldenMaster.test.js :: hashFor`),
base → tip: **525 moved, one cause** (unit 3: every birth enriches at least two NPCs with a
registry goal). Units 1, 2, 4, 4b are render-time and move none. Not re-recorded. Note: at the base
the committed manifest already mismatches 525 of 525 under both node and vitest (a pre-existing
red; the lanes before this one moved rows unrecorded).

Proof nothing else moved: `soak1k-8`, `-22`, `-24` hashed with every `goal` held constant — the
NPCs' and their copies in `factions[].members[]` (the first hold, `npcs[]` alone, differed and
found those copies) — base `3ced4ba5 · 8e60e770 · 419de723` = tip `3ced4ba5 · 8e60e770 · 419de723`.

## 7. Reds

Caused by this lane (reported, not cured):
- `tests/domain/crisisBlindWidened.test.js` — 7 rows (`soak1k-604, -1804, -2404, -3604` "current
  stability"; `-3005` "competent administration"; `-3000` "stable institutional competition";
  `-1803` the control) find no NPC holding the old want: the rewrite removed the phrases the rows
  anchor on (the test's own header names R11 as the cure).
- `scripts/generate-landing-fixture.mjs --check` — `landingFixture.js` quotes the old "use current
  stability…" goal; already STALE at the base, one more cause.
- `tests/property/generatorGoldenMaster.test.js` — 525 rows moved (already 525/525 red at the base).

Red at the base and unchanged (messages identical): `tonightSheetOnce` X-51 (20 lines, F13's cast
wants), `repeatOnceTonightTraditions` soak1k-12 (no shared want since F13), `tabSentencesOnce`
X-50 ("Real decisions are being made informally." ×2), `heldKeyWriterCensus` A3, `npcProfile`
TE-CH-7, `worldFactRederive` A4/A7, `writerReach` (the density dark-register row).
`tsc --noEmit` 167 errors (= the ratchet ceiling; 0 in touched files); `typecheck:ratchet` OK.

## 8. Open questions for the chair

1. `position:` and `constraint:` print in management prose on the NPC card (`npcComponents.jsx`): rewrite them in the house register as their own cause (their own golden shift), or keep them as the card's structural register?
2. `npcGenerator.js`'s role and stress goals (`NPC_FACTION_GOALS`, `STRESS_GOALS`) still hold abstract lines ("preserve the institution's position through the transition…", "end the revolt without either full suppression or formal negotiation…" at 22 words, "position themselves before…"): the sheet and the Quick Guide now skip them, but the NPC card prints them. A pool lane under the census procedure?
3. `crisisBlindWidened.test.js`'s 7 rows now find no NPC holding the old wants: retire those rows (the phrases can no longer be drawn) or re-anchor them on a fixture? Rung 2D's test, not this lane's to cure.
4. `npcStructure.js :: getPrimaryCondition` ignores the active crisis, so a "stable" goal is drawn under a siege. The new lines assert no calm; should the condition key read the crisis (a design change)?
5. The shape rule does not mechanise "names a person, place, thing or sum" (no lexicon); it rests on the abstract list, the lead verbs and the 18-word cap. Wanted as a lexicon, or kept as review?
6. soak1k-26's seat (the revolt's target) is voiced with nothing: an abstract goal, the crisis secret withheld, `personality.dominant` null. Acceptable, or fall back to `goal.long` or the modifier?
7. The landing fixture (`landingFixture.js`) quotes the old "use current stability…" goal and was already stale at the base. Its re-emit is the owner's.
