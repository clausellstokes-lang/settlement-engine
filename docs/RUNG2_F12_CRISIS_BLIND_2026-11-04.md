# F12 CRISIS-BLIND PROSE: calm lines printed under the crisis they deny (rung 2, 2026-11-04)

> A dated lane record. Branch `lane/rung2-f12-crisis-blind-2026-11-04`, cut from `lane/rung2-2026-11-04` at `d0068d35e`. It answers `docs/SOAK_10000_RUNG2_2026-11-04.md` §3c, pattern 1 (about 20 of 60 sampled pages print a stock calm sentence under an active crisis). Counts are settlements on the rung corpus (`soak1k-<i>`, i < 1000). The goldens, censuses and registers at this tip are red on purpose; §5 lists what this lane adds to them. Nothing here is re-recorded or signed.

## 1. Unit 1 — the instrument, `coh:crisis-blind-prose` (kind 10, crisis)

**Definition, as implemented** (`src/domain/coherence/crisisBlindFindings.js`). A finding is a rendered sentence, on any surface the soak reads (the 20 tabs, Tonight, PDF text, Foundry), that asserts calm, normality or the absence of a pressure, while the record carries an ACTIVE crisis of a family the claim denies. The crisis is read from the stress container (`settlement.stress`, one entry or a list; resolution removes the entry, so presence is activity) by the one reader both units share, `src/domain/crisis/crisisFacts.js`. Five families:

| family | active under | the calm it denies (examples) |
|---|---|---|
| threat | under_siege, occupied, monster_pressure | "Nothing presses", "never needed to think about what is outside it", the relaxed perimeter, "safety is its neighbours, its distance, and its unimportance" |
| hunger | famine, under_siege | "It is not a subject anyone raises unprompted", "fed and only just comfortably", "rests on the road staying open" |
| succession | succession_void, politically_fractured | "the succession question is not a live one", "safe for the plainest reason a seat can be safe" |
| unrest | insurgency, slave_revolt, wartime | "very little street violence", "random violence is put down" |
| crisis | any active crisis | "condition asks to be remarked on", "nothing striking … in either direction", "Things are fine." |

Plus one non-family claim: "families left this week" under mass migration, which the engine defines as an influx (generation-time, `power/governanceNarrative.js`; counted here, F13's to cure). Thirty claims in all, written phrase by phrase from the §3c quotes and from every state-prose variant the 1,000 corpus prints under a crisis that asserts calm (mined over the rendered pages at `d0068d35e`), never derived from the marks unit 2 adds. One finding per sentence. The battery runs it as a page check (`coherenceBattery.js`; the generation receipt never runs it, so no receipt or golden moves). `checks.mjs :: KIND_OF` gives it kind 10; `aggregate.mjs` names kind 10 "crisis"; the stop rule reads it (kind ≥ 1, ≠ 6).

**Left out on purpose (the chair's to overrule):** "runs smoothly, almost too smoothly" (`narrativeData.js`; the line is ominous, not calm: "nobody can quite tell you who settled them"), and "positioned to profit" (the wartime crisis's own summary variant, which names the war). §3c's "hollowing out" is not a string in `src/`.

**The 1,000 at unit 1** (`f344278`, `artifacts/f12-base`, 203 s of births, 304 s in all, 0 errors): **312 settlements, 469 findings.** Line: STOP (kind 10 in 312; A-12 self-vouch at 2.4%, because a page that vouches for itself while crisis-blind is now a false vouch).

| tier | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| settlements | 53 | 44 | 38 | 48 | 66 | 63 |

| crisis kind | settlements | first three seeds |
|---|---|---|
| mass_migration | 50 | `soak1k-0` "Three families left this week."; `-10` "Things are fine."; `-31` (families left) |
| monster_pressure | 40 | `-16` "Nothing presses Breitenfeld at present…"; `-29` "…comfortably over-provided against beasts."; `-43` "…plan for an army is to not be interesting to one…" |
| occupied | 37 | `-2` and `-27` "…has never needed to think about what is outside it…"; `-37` (not interesting to an army) |
| politically_fractured | 34 | `-35` "There is nothing striking about…"; `-48` "…no contender to carry it; the …"; `-93` "Nothing about Cobatzal's condition asks to be remarked on." |
| under_siege | 32 | `-24` "Grüngrund is too small to wall and knows it; the thorp's safety is its…"; `-47` (over-provided against beasts); `-71` "…rests on the road staying open." |
| succession_void | 24 | `-63` "Things are fine."; `-66` (no contender); `-106` (nothing striking) |
| wartime | 21 | `-5` "…random violence is put down…"; `-76` "There is very little street violence at Bayankher…"; `-81` (nothing to remark on) |
| insurgency | 18 | `-75` (nothing striking); `-94` (random violence put down); `-112` (nothing striking) |
| religious_conversion | 16 | `-17`, `-57` (nothing striking); `-124` "Things are fine." |
| infiltrated | 13 | `-18` "Things are fine."; `-51`, `-74` (nothing striking) |
| slave_revolt | 13 | `-65` (random violence); `-118` (street violence); `-324` (nothing striking) |
| indebted | 12 | `-33` (nothing striking); `-143` (nothing to remark on); `-244` (nothing striking) |
| recently_betrayed | 12 | `-125` "Things are fine."; `-202` (nothing to remark on); `-357` "Things are fine." |
| plague_onset | 6 | `-63` "Things are fine."; `-100` (nothing to remark on); `-134` "Things are fine." |

**By desk and block** (settlements; the crisis-blind pools):

| settlements | block · pool |
|---|---|
| 91 | DS-ECO-8 · MODERATE (economy tile and Daily Life) |
| 62 | DS-ECO-1 · COMBINATION C3: the middle rungs |
| 48 | DS-DEF-2 · Invasion & War: neither walls nor force |
| 45 | non-pool: `governanceNarrative.js` "families left" (F13) |
| 37 | DS-POW-4 · riskLabel: Stable (no challengers) |
| 35 | DS-DEF-2 · Beasts & Monsters: settled, nothing organized |
| 29 | DS-DEF-11 · UNWALLED-SMALL |
| 26 | DS-DEF-4 · structure organized |
| 21 | DS-DEF-2 · Beasts & Monsters: settled, defenses beyond the need |
| 15 | DS-DEF-6 · Naval Defense: Port only |
| 8 | DS-DEF-1 · readiness STRONG |
| 4 | DS-DEF-11 · WALLED-QUIET |
| 3 | DS-ECO-9 · IMPORT-DEPENDENT |

**Red first:** `tests/domain/coherence/crisisBlindProse.test.js` fails at `d0068d35e` (the instrument does not exist) and passes 9 of 9 at `f344278`.

## 2. Unit 2 — the cure, five crisis dimensions on the state-prose desks

**The dimension.** F10's house path, unchanged in mechanism: the kernel's fail-closed mark channel (`stateProseKernel.js :: STATE_MARK_DIMENSIONS`, law 5) gains five fact dimensions, one per family, each a crisis word and its `no …` twin (`threat`/`no threat`, `hunger`/`no hunger`, `succession open`/`succession settled`, `unrest`/`no unrest`, `crisis`/`no crisis`). Five dimensions rather than one, because the kernel answers a dimension with one word and a town can carry two crises of different families; a variant carrying `no threat` and nothing else speaks only where no threat-family crisis is active. Every desk entry that answered `walls` now also answers the five (`crisisFacts.js :: crisisAnswered`, 16 call sites in six desks), so a pool that carries a crisis mark is unreadable to a caller that has not asked which crises are on. The mount registry declares the new dimensions on the ten rows over the touched blocks.

**The tagged variants: 29** (desk: defence 17, economy 9, power 3).
- threat (`no threat`), 15: DS-DEF-1 STRONG v3 v4; DS-DEF-2 "settled, defenses beyond the need" v1 v2 v3; "settled, nothing organized" v1 v2 v3; "neither walls nor force" v2 v3; DS-DEF-6 "Port only" v2; DS-DEF-11 UNWALLED-SMALL v1; WALLED-QUIET v1 v2 v3.
- hunger (`no hunger`), 6: DS-ECO-9 SECURE v1 v2 v3; IMPORT-DEPENDENT v3; DS-ECO-8 POOR v2; DS-ECO-1 C1 v3.
- succession (`succession settled`), 3: DS-POW-4 "Stable (no challengers)" v1 v2 v3.
- unrest (`no unrest`), 2: DS-DEF-4 "structure organized" v1 v4.
- crisis (`no crisis`), 3: DS-ECO-8 MODERATE v2 v3; DS-ECO-1 C3 v3.

**The new lines: 13, VETOABLE (the owner's class).** Each is appended to its pool with the next row number, so no vid moves, and carries the crisis word, so a crisis-free place's eligible set is unchanged. Two per pool the marks emptied, one where the marks left a single voice (the thin-state ratchet holds: no state is left with one line).

| pool | vid | the line |
|---|---|---|
| DS-ECO-9 SECURE | 4 | `[street · hunger]` The town ate well enough until the hunger came, and the margin it had is the first thing the hunger has spent. |
| DS-ECO-9 SECURE | 5 | `[ledger · hunger]` {settlement}'s counts came out ahead before the hunger; they do not now, and nobody at {settlement} calls the town fed. |
| DS-ECO-8 MODERATE | 4 | `[visitor · crisis]` {settlement}'s accounts still balance, and that is the one thing about the town the crisis has not yet reached. |
| DS-POW-4 Stable (no challengers) | 4 | `[ledger · succession open]` No contender stands at {settlement} to take the {seat}, and the absence settles nothing: who governs is an open question, and nobody is strong enough to close it. |
| DS-POW-4 Stable (no challengers) | 5 | `[street · succession open]` The {seat} at {settlement} has no rival and no secure holder either; the town asks who governs and gets no answer it can act on. |
| DS-DEF-2 settled, defenses beyond the need | 4 | `[ledger · threat]` {settlement} built more against the country than the country ever asked for, and the threat now at hand is spending that margin. |
| DS-DEF-2 settled, defenses beyond the need | 5 | `[visitor · threat]` A stranger finds {settlement}'s works manned in earnest; what was built against nothing in particular is being held against something now. |
| DS-DEF-2 settled, nothing organized | 4 | `[street · threat]` {settlement} kept no defence because the country never asked for one, and the country is asking now; the town is improvising what it never built. |
| DS-DEF-2 settled, nothing organized | 5 | `[ledger · threat]` Nothing at {settlement} was organized against the country, and the threat now at hand has found the gap. |
| DS-DEF-2 neither walls nor force | 4 | `[counterforce · threat]` {settlement} has no line and no force, and the threat now at hand has noticed both. |
| DS-DEF-11 WALLED-QUIET | 4 | `[visitor · threat]` {settlement} kept its {defwork} through the quiet years, and the {defwork} is earning its keep now. |
| DS-DEF-11 WALLED-QUIET | 5 | `[ledger · threat]` What {settlement} spent on its {defwork} in the quiet years is what stands between the town and the threat at hand. |
| DS-DEF-11 UNWALLED-SMALL | 3 | `[street · threat]` {settlement} is too small to wall, and what has come for it now makes the smallness a danger rather than a protection. |

A family spans several crisis kinds, so the lines name the family's noun (the hunger, the threat at hand, the crisis, the open succession) rather than "the siege"; naming the kind would need a `{crisis}` slot the desks do not fill today.

**The projection.** `npm run gen:dossier-prose` refuses at this base on the stale wiring census (7 stamped files). The leaves were projected by a scratch copy of the projector with only `assertCensusCurrent` bypassed, and the copy was deleted, as F9 and F10 did. Only the three touched state leaves moved (2,310 → 2,323 variants: defence 388 → 396, economy 333 → 336, power 260 → 262); the causal, connectives, norms and relations leaves are byte-identical. The census re-take and `--check` are the landing's.

**Red first** (the cure is `e19e3e4`): `tests/domain/crisisBlindDossierProse.test.js` at `f344278` fails 3 of 5 by title (the vocabulary; the sweep names every calm variant unmarked; the births print "Nothing presses Rundfeld at present…" ×2 for `soak1k-5404`, "Grudets is too small to wall… the thorp's safety is its neighbours…" for `soak1k-3600`, "…never needed to think about what is outside it…" and "Nothing has come for Copanucan…" for `soak1k-2`); 5 of 5 pass after the cure. The sweep holds the rule going forward: a mounted variant that makes a calm claim must carry the mark of the family it denies, and no marked pool is mute or draws a claim under its crisis.

## 3. The count, 1,000 before → after

| | unit 1 (`artifacts/f12-base`) | unit 2 (`artifacts/f12-tip`) |
|---|---|---|
| `coh:crisis-blind-prose` | 312 (469 findings) | **45**, every one "Three families left this week." under mass migration (F13's writer) |
| from a state-prose pool | 280 (13 of them also carry the migration line) | **0** |
| `A-12:self-vouch-false` | 24 | 4 (pages vouching beside the migration line) |
| every other class | | unchanged, settlement for settlement |
| replay · render errors · generation errors | 100/0 · 0 · 0 | 100/0 · 0 · 0 |

The bar was 0. It is 0 for everything the desks select; the 45 that remain are the generation-time migration narrative, which the brief assigns to F13. Every remaining seed prints the one sentence "Three families left this week." (by tier: thorp 9, hamlet 8, village 6, town 9, city 8, metropolis 5): `soak1k-0`, `-31`, `-98`, `-168`, `-194`, `-201`, `-203`, `-247`, `-292`, `-316`, `-327`, `-354`, `-384`, `-432`, `-433`, `-445`, `-447`, `-449`, `-489`, `-496`, `-516`, `-526`, `-529`, `-573`, `-581`, `-596`, `-632`, `-637`, `-651`, `-714`, `-737`, `-762`, `-777`, `-782`, `-787`, `-826`, `-867`, `-881`, `-890`, `-910`, `-931`, `-942`, `-946`, `-987`, `-988`.

**The walled control.** The three crisis-free births `soak1k-11` (metropolis), `-44` (village), `-60` (thorp) render byte-identical on every surface before and after (sha256 of the tabs, and of tabs + Tonight + PDF + Foundry: `b97a6532cf3db1b3`/`dd459c4a2eacfe01`, `a6a712f668a34e1e`/`1852929b6329fc3b`, `3049d34d0092bcfd`/`481de73ff348f7f8`). Over the whole corpus, all 84 crisis-free places print exactly the sentences they printed before (the shards' sentence, story and hook hashes); 294 of the 916 crisis places moved, and 0 replays mismatched. Both figures were re-taken on the final tree. Positive controls `soak1k-5404`, `-3600`, `-2` moved.

**Goldens: 0 rows moved.** The record hash is identical before and after for all 1,000 settlements (the shards' `hashes.record`), so no generator golden row moves; the prose is render-time.

## 4. Pins moved with the mechanism (in this lane's own commits)

`coherenceBattery.test.js` check list (+ `crisis-blind-prose`); `stateProseKernel.test.js` vocabulary (9 → 19 words) and undimensioned-pool floor (730 → 716); `dossierStateProseProjection.contract.test.js` vocabulary length (9 → 19) and dimensioned block list (+ DS-DEF-1, -2, -4, -11, DS-ECO-1, DS-POW-4); `dossierMountRegistry.walker.test.js` control row DS-ECO-1 (now declares `crisis`, `hunger`); `economicsTabFlow.test.js`'s drawn-anchor spec answers the crisis dimensions as the desk does (the helper refused the fail-closed DS-ECO-1 read).

## 5. Reds this lane adds, for the landing (none re-recorded)

Attribution is by file and test title, against the unit-1 commit as a pristine copy (`git archive f344278`), over the 169 test files naming a changed module or a rendering tab: the base carries 83 red titles. The tip's first run carried two more: `economicsTabFlow` (its drawn-anchor spec read DS-ECO-1 without answering the new dimension; cured here, §4) and `economicsFoodStores` (a 20 s timeout while a soak shared the CPU; it passes alone). After the cure and the A0b rewording, the touched suites were re-run: **no title is red at the tip that is green at the base.** `navalLayer` and `proseMoveGrammar.walker` (anchoring the tagged pools by fixture) carry the same 5 red titles at both. The movement this lane adds under base-red titles (PLAUSIBLE additive, read from the assertion text):
- the prose shift register (`dossierStateProseProjection.contract` "recomputes every pin from the leaves", "MUTANT: a mechanism that moves without its row"): corpus 2,310 → 2,323;
- the prose byte ratchet (`proseCorpusBytes` RAW exact, GZIP band): defence, economy and power leaves; bytes owed;
- `proseEntryContradiction` loaders 2,778 → 2,791 and 2,069 → 2,082, trailing coordinate 336 → 339; its line-keyed anchors shift with the inserted rows;
- `proseComposed` corpus 2,310 → 2,323 and A0b under-claims 1,306 → 1,313 (the new lines' census reads; over-claims held at 55);
- `proseWaveGate` units 388 → 396; `proseWiringCensus` variant column 2,310 → 2,323 (the census re-take);
- the wiring census: the six desk files and `dossierMounts.js` change bytes (the stale stamp the base already carries).

`tsc --noEmit`: the base's 167 errors, none in a touched file; `typecheck:domain:strict`: 1,113 = ceiling; eslint: 0 errors on every touched file.

## 6. Open questions for the chair

1. Is "Things are fine." / "nothing striking…" under ANY crisis the right reach for the `crisis` family, or should an economy-standing line be licensed under crises that leave the economy alone (infiltration, religious conversion)?
2. Wartime is in `unrest` (as the brief grouped it) but not in `threat`; a distant war leaves "Nothing presses" true. Confirm.
3. "runs smoothly, almost too smoothly" and "positioned to profit" are left out of the instrument (§1). Overrule?
4. The new lines name the family's noun, not the kind; a `{crisis}` slot filled by the desks would let them say "the siege". Worth a later unit?
5. `soak1k-5` ("The metropolis eats…" under wartime with food prices doubled) is not a finding here: wartime is not in `hunger`. Should it be?

## 7. CONFIRMED vs PLAUSIBLE

**CONFIRMED:** both 1,000 counts and their breakdowns (read from `artifacts/f12-base` and `artifacts/f12-tip`); both red-firsts, red before and green after by title; the walled control on three births and on all 84 crisis-free places; record hashes unchanged on all 1,000; no new red title over 169 governing files; the type and lint readings. **PLAUSIBLE:** that the register movement listed in §5 is all this lane adds under base-red titles (read from the first failing assertion of each); that the food-stores timeout is load (it passed alone).
