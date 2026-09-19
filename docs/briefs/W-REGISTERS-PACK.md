# W-REGISTERS-PACK — every candidate vocabulary of the character program, compiled for the owner's pen

**Status:** DRAFT FOR MARKUP — **REFRESHED FROM THE BUILT CARS** (W-LIVES L6, 2026-08-31; ODQ §804
drafted, §849 first refresh, this the second). Nothing here is frozen; nothing freezes without the
owner's signature (tuning carve-out, §763). Sources: ODQ §§797–803.2 + DESIGN_W_LIVES /
DESIGN_W_FAITH / DESIGN_W_OPS + **the cars L1–L5 as actually built**. **How to mark it up:** strike a
row to kill it, write over a word to rename it, add rows freely — every word must be setting-agnostic
and survive any world. Everything is a proposal.

⭐ **WHAT THE SECOND REFRESH ADDED.** The first draft was written before any car existed, so it drafted
a world and guessed its own counts. Five cars have now been built and measured. Where a lane's
EXECUTED census disagrees with the draft, **the measurement wins and the draft is struck through in
place** — nothing is silently deleted. Every register row now carries an ADDRESS: the file, and the
commit of the stack that holds it.

**How to read a figure here.** Every number below is one of three things, and they are not
interchangeable: a figure a lane **EXECUTED** (a census run, a 300-season soak, a preset table
actually evaluated); a figure this refresh **re-counted from the committed source** at the sha named
in §0; or a **DRAFT** nobody has measured, which is said out loud. Where two leaves agree because one
declares it MIRRORS the other, that is transcription fidelity and it is labelled as such — it is not
a second opinion.

---

## §0 — WHERE THE REGISTERS ACTUALLY LIVE (read this before looking for anything)

⛔ **THE CHARACTER PROGRAM'S CODE IS IN TWO UNLANDED STACKS ON TWO DIFFERENT LINES.** Confirmed by
`git merge-base --is-ancestor`: L1's tip is **not** an ancestor of the L2–L5 stack tip, and neither is
an ancestor of the build branch. A reader who opens the wrong tree will conclude a register is
missing.

| register | code home | lives at | on |
|---|---|---|---|
| I, II (levels) | `src/domain/npc/paradigmAxisCatalog.js` | `1d03d552d` (car L1) | the F3c line |
| II (offsets, floor) | `src/domain/npc/characterDrift.js` | `2e4fc0ea0` | the **L-stack** |
| III | `src/domain/npc/livedExperienceCatalog.js` | `2e4fc0ea0` | the L-stack |
| III (tuning) | `src/domain/npc/livedExperienceFunnel.js` | `2e4fc0ea0` | the L-stack |
| III-b (adapters) | `src/domain/npc/livedExperienceSources.js` | `2e4fc0ea0` | the L-stack |
| VIII (seams) | `src/domain/npc/characterConsumers.js`, `knownCharacter.js` | `2e4fc0ea0` | the L-stack |
| VIII (branches) | `src/domain/worldPulse/npcGoalBranches.js` | `2e4fc0ea0` | the L-stack |
| IV, V, VII | **nothing built yet** — W-OPS and TE-DENSITY-1 have not run | — | — |

**Every one of them carries `signedBy: null` in its own provenance block.** No lane has signed
anything; the field is the pen's own slot, in the code, so a reader who arrives at the module before
the docs learns the status there.

---

## REGISTER I — THE PARADIGM CHART (every pool word dispositioned; nothing silently dropped)

Levels apply per side; sign = pole. † = reassigned from the neutral pool. **MINT** = a new word
the pools lack (five + one conditional). The LOCKSTEP law: any pool edit moves npcBank's mirror
in the same commit.

| # | Axis | Virtue pole — expressions | Vice pole — expressions |
|---|---|---|---|
| 1 | **CANDOR** | honest — forthright, candid, plain-dealing | deceitful — mendacious, manipulative |
| 2 | **MERCY** | compassionate — merciful, warm-hearted | cruel — callous, cold-blooded, ruthless |
| 3 | **COURAGE** | brave — stalwart | cowardly |
| 4 | **TEMPER** | patient — level-headed, unflappable | wrathful — volatile |
| 5 | **GENEROSITY** | generous — magnanimous, hospitable | greedy — self-serving |
| 6 | **HUMILITY** | humble — gracious | arrogant — vain, imperious, proud† |
| 7 | **FIDELITY** | loyal — dependable, steadfast | **treacherous (MINT)** — mercurial† |
| 8 | **INDUSTRY** | diligent — conscientious, tenacious | lazy |
| 9 | **JUSTICE** | principled — fair-minded, equitable, incorruptible | corrupt — hypocritical, petty |
| 10 | **PRUDENCE** | prudent — cautious† | reckless |
| 11 | **TRUST** | **trusting (MINT)** | paranoid — suspicious |
| 12 | **CHEER** | optimistic — good-humoured | bitter — melancholic†, brooding† |
| 13 | **FORBEARANCE** | **forgiving (MINT)** | vengeful — vindictive |
| 14 | **PROTECTION** | protective — courteous | domineering — overbearing, dismissive |
| 15 | **TEMPERANCE** | temperate | **indulgent (MINT)** — hedonistic† |
| 16 | **CONTENT** | **contented (MINT)** | envious |
| 17 | **DEVOTION** ⚠ owner ruling wanted (axis vs faith-relationship) | pious — zealous† | **worldly (conditional MINT)** |

**BUILT AND MEASURED** (`paradigmAxisCatalog.js` at `1d03d552d`; re-counted at L6 by static scan of
the committed file, not taken from a receipt): 17 axes, exactly this roster, ids codepoint-sortable ·
**6** pole words carry `minted: true` — `treacherous`, `trusting`, `forgiving`, `indulgent`,
`contented`, `worldly` — and all six are **deliberately kept OUT of every live pool**, pinned, because
a pool edit moves the LOCKSTEP mirror AND changes a seeded draw array's length · DEVOTION is the ONE
axis carrying `ownerRulingPending: true`.

**Capabilities (outside the chart — gifts, not moral spectra; drift never touches them):** wise,
clever, resourceful, scholarly, charismatic, intuitive, perceptive, astute, discerning,
diplomatic. ⚠ Where a capability word carries weight in a legacy table (e.g. `diplomatic` −0.8
pacific in TRAIT_AGGRESSION), that weight is preserved as a STATIC MODIFIER LEAN in the derived
columns — capabilities keep their legacy plane effects verbatim; only axis words gain spectrum
dynamics. This is a byte-identity requirement, not a choice.

**Manner/stance modifiers (outside the chart, static leans where legacy tables carry them):**
pragmatic, calculating, secretive, eccentric, stoic, cynical, reserved, traditionalist,
iconoclast, opportunistic, perfectionist, fatalistic, idealistic, detached, inscrutable,
superstitious, nostalgic, theatrical, contrarian, restless, obsessive — and **ambitious**, which
additionally feeds the risk register's CENTER (§803.1 R6), and **stubborn**, unhomed by the
volume (owner call: PRUDENCE-vice expression, or modifier as drafted here). ⚠ `methodical`
appears in BOTH the positive and neutral pools (a live duplication) — dispositioned here as a
modifier; ~~the pools deduplicate at car 1~~ **THE DEDUP DID NOT HAPPEN AND MUST NOT HAPPEN SILENTLY**
(taste row 18; three measured behaviour costs).

**Count check (MEASURED by L1's executed census, §849 — supersedes the drafted figures):**
45 positive = **34** axis-homed + 10 capabilities + **1** (`methodical`; no word is shared
between axes at all); 30 negative = 29 axis-homed + 1 modifier (stubborn, pending the owner
call); 30 neutral = **7** reassigned (†) + **23** modifiers. Zero words silently dropped.

### ⭐ THE DRIFT LEANS AND THE CORRUPTION REACH — measured, and three of the four figures are new

Every lean in the catalog is **DERIVED from the vice-pole word's own legacy column, or `null`**. A
`null` is an honest gap awaiting the pen, never a zero — L1 refused to invent coherent per-axis
magnitudes, because an invented number is unsigned taste wearing the authority of code.

| column | null on | which axes |
|---|---|---|
| `planeLean` (the e/c conduct plane) | **9 of 17** | COURAGE, HUMILITY, FIDELITY, INDUSTRY, CHEER, PROTECTION, TEMPERANCE, CONTENT, DEVOTION |
| `aggressionLean` | **10 of 17** | ⭐ NEW FIGURE — the pack never carried it |
| `corruptionVector` | **10 of 17** | TEMPER, FIDELITY, INDUSTRY, PRUDENCE, CHEER, FORBEARANCE, PROTECTION, TEMPERANCE, CONTENT, DEVOTION |

⇒ **drifted-vice corruption reaches only 7 of 17 axes**, and this is the direct input to row 13(a):

| axis | vector a drifted vice opens |
|---|---|
| CANDOR | `forbidden_patron` |
| COURAGE, TRUST | `fear` |
| GENEROSITY, JUSTICE, MERCY | `greed` |
| HUMILITY | `hunger_for_status` |

A soul who drifts all the way into `lazy` or `treacherous` opens **no door however deep it runs**.
Widening that reach is a CATALOG act, not a gate act. ⚠ L5's `CORRUPTIBLE_AXIS_VECTORS` carries the
same seven axes and four vectors, but it says on its face that it **MIRRORS** L1 — so the agreement is
transcription fidelity, **not** independent corroboration. The reconcile pin at the consist landing is
what will actually check it.

⚠ **Nine legacy TRAIT_PLANE keys belong to NO pool** (capricious, disciplined, dutiful, erratic,
impulsive, orderly, rebellious, rigid, traditional) — undrawable, invisible to the pen, and carried
verbatim under a completeness pin so a tenth cannot appear silently.

---

## REGISTER II — LEVELS AND BAND WORDS

Per side, ascending: **a_touch → marked → defining**, with **neutral** the center ⇒ a 7-band
nominal ladder per axis. Drift band-crossing words ride the same three; the reversal (midpoint
crossing) is its own receipt kind ("his charity has curdled"); the displacement receipt names
both axes ("bitterness has overtaken his patience"). Alternatives if the three read wrong to
your ear: *a shade / plain / consuming*. Corruption's depth gate reads `marked`+ (ruled, §800.4) —
**restored to the pen at F13; see row 13(a) and Register VIII (j).**

**BUILT** (`characterDrift.js`, `livedExperienceFunnel.js` at `2e4fc0ea0`). Every magnitude below is
DERIVED; not one was authored, and the derivation is pinned so the draft cannot drift from its own
stated rule:

| quantity | value | derivation |
|---|---|---|
| bands per side | 3 | `AXIS_LEVELS.length` |
| the ladder | **7 rungs** | `vice_defining · vice_marked · vice_a_touch · neutral · virtue_a_touch · virtue_marked · virtue_defining` |
| widest clamp | **6** | 2 × half-span — one pole's extreme carried to the other's (F11 band-bounded) |
| materialization floor | **1/4 band** | F9's own candidate ("a quarter of `a_touch`") |
| persisted width | 4 decimals | 2,500× finer than the floor, coarse enough that FP noise cannot reach the bytes |
| pull `faint` | = the floor (1/4) | so the smallest thing a source may SAY is the smallest thing that can be RECORDED |
| pull `firm` | 1/2 | the floor doubled |
| pull `heavy` | **1 full band** | the floor quadrupled — the natural unit a chart is written in |
| family step | 0 / −1 / −2 | a mechanical **4/3/3 tercile** over this pack's own heaviest-first family order, clamped at `faint` |
| homeward decay band | `a_few_years` | CHOSEN from the estate's shared half-life ladder, never authored (taste row 1) |
| ambient cadence | **one season (13 weeks)** | `INTERVAL_WEEKS.one_season`; tick = week is the temporal constitution, not a convention |
| a bare legacy word reads at | **`marked`** | so an undrifted legacy word projects back to the IDENTICAL word |

✅ **ONE EARLIER OPEN ROW IS NOW CLOSED AND SHOULD NOT BE RE-ASKED.** The drift leaf asked whether F9
wanted a SUB-FLOOR ACCUMULATOR, since nothing sub-floor is stored and a per-tick sub-epsilon pull
therefore restarts from zero forever. **§853 answered it: the cure lives at the SOURCE, not the
store** — ambient sources emit at interval cadence with time-integrated magnitude, so a season of
exposure arrives as one quantum that crosses the floor or honestly does not. No sub-floor accumulator
state exists, and the funnel holds no state at all. A truly faint exposure never marks, and that is
truth rather than loss.

### ⛔⛔ THE NUMBER THE PEN MUST SEE BEFORE SIGNING ANY OF THE ABOVE — a 6% margin

Measured by L4 through the real funnel over **300 seasons**, not modelled:

```
quantum/cadence -> equilibrium   [the linear model's x* for contrast]
  q = 0.25 (faint) ->  0.2500     [4.454]   <- today
  q = 0.30         ->  5.3451     [5.345]
  q = 0.35         ->  6.0000     [the clamp]
LARGEST quantum whose equilibrium stays under one band: ~0.26487
```

**A pull that IS exactly one floor quantum can never accumulate past one floor quantum** — decay
always shrinks a stored offset, the offset falls back under the floor, and the floor's delete removes
the cell, so the next quantum starts from zero. That holds for **every** half-life band, so it does
not depend on which one you sign. **But `faint` = 0.2500 against a ceiling of ~0.2649 is a 6%
margin.** §9's risk 5 survives today ONLY because the milieu family's −2 step clamps every milieu pull
to `faint`. One rung softer — `firm` at cadence — gives an equilibrium of **8.9 bands**, which the
clamp truncates to the whole spectrum: every citizen of every town reaching `defining` on every axis
their host pulls.

⭐ **The corollary, and it is a design loss the tuning is hiding:** the host settlement's DEPTH is
**expressively dead today**. A `defining`-cruel city and an `a_touch`-cruel one teach identically,
because the family step collapses heavy/firm/faint onto the floor. The adapter carries the host's band
word honestly and the tuning erases it. (Taste row 12's real cost, stated in bands.)

---

## REGISTER III — THE EXPERIENCE TABLE (BUILT; 31 kinds, each with its measured source verdict)

Pull magnitudes are BAND WORDS (faint / firm / heavy), never floats; exact rates are Register II's
tuning rows under your signature. ⚠ The table names a **pole SIDE** in code, never a pole WORD — the
words are Register I's authority and naming them twice would fork them. They are spelled out here for
your reading; the code says `vice` / `virtue`.

**The verdict column is a WALK, not a guess.** Every row was walked against the tree and the verdict is
carried IN THE TABLE, so it can be checked rather than trusted:

- **DEFAULT-ON (5)** — lit with no flag or with a flag true in the defaults.
- **DEFAULT-ON, DATA-GATED (2)** — no rules flag exists anywhere in the chain, so **no preset can darken it**;
  the gate is `isSubsystemActive(snapshot,'religion')` (`subsystemActivation.js:42-48`), a predicate over
  AUTHORED content (`config.primaryDeitySnapshot` / `cultDeitySnapshots`). A deity-free realm emits nothing
  for 156 ticks in all seven presets; a realm with four co-religionist settlements emits on tick 2 in all
  seven. ⚠ `faithSpreadEnabled` changes the arc's SCORE (86→94 / 84→92) and NOT its existence — a flag-file
  read would have filed these as PRESET (2). [Measured by R-GODFORTUNES, 2026-08-31; verdict word adopted at §874.]
- **PRESET (n)** — receipted, lit in n of the six presets.
- **DARK (3)** — the receipt is real machinery; its flag is lit in NO preset. Wire it; nothing comes.
- **NO RECEIPT (12)** — nothing in the engine emits it. **The funnel REFUSES these at the door**
  (`source_unverified`) and the adapter module THROWS at load if one is wired. The row stays so the
  partition is honest and the gap is visible: marking is the only honest third option between wiring
  a phantom and deleting a row you drafted.
- ⛔ **BLOCKED (2)** — receipted and lit, and **emitting nothing** because §856's non-overlap ruling
  was honoured at the literal grain. See taste row 15; unblocking is one field per row.

| Kind | Plane | Family | Pulls (toward) | Verdict |
|---|---|---|---|---|
| betrayed_by_friend | PERSONAL | bond | TRUST→paranoid heavy · CHEER→bitter firm | **NO RECEIPT** — no NPC-to-NPC betrayal edge exists |
| bereavement_close | PERSONAL | bond | CHEER→bitter firm · DEVOTION→pious faint | **NO RECEIPT** — NPC records carry no kin, spouse or sibling |
| caught_lying_exposed | PERSONAL | repute | CANDOR→honest firm (chastening) · CHEER→bitter faint | **DARK** (double-dark: both flags absent everywhere) |
| corruption_exposed | PERSONAL | repute | JUSTICE→corrupt faint (residue) · TRUST→paranoid firm | **DEFAULT-ON**, ⛔ **BLOCKED** — and the persisted record drops `npcId` |
| turned_by_crime | PERSONAL | fall | JUSTICE→corrupt heavy · CANDOR→deceitful firm | **DARK** ⚠ corruption ONSET is not this; the verdict is the receipt |
| captured_held | PERSONAL | ordeal | TRUST→paranoid firm · ~~COURAGE→?~~ **ABSENT until row 10 is ruled** | **PRESET (3)** |
| ransomed_home | PERSONAL | ordeal | GENEROSITY→generous faint (gratitude) · FIDELITY→loyal firm | **PRESET (3)** |
| abandoned_unransomed | PERSONAL | ordeal | FIDELITY→treacherous firm · CHEER→bitter heavy | **NO RECEIPT — and UNREACHABLE**: roads resolves every captivity to a release |
| pardoned_released | PERSONAL | ordeal | MERCY→compassionate firm · DEVOTION→pious faint | **DARK** (DM-only: a UI button, no pulse call site) |
| promotion_won | PERSONAL | career | HUMILITY→arrogant faint · CHEER→optimistic firm | **PRESET (3)** |
| rung_lost | PERSONAL | career | CHEER→bitter firm · CONTENT→envious firm | **PRESET (3)** |
| refused_by_patron | PERSONAL | career | ⚠ taste row 6 — if kept: CHEER→bitter faint · HUMILITY→humble faint | **NO RECEIPT — and the tree has RULED against one** (see row 6) |
| goal_culminated | PERSONAL | career | CONTENT→contented firm · TEMPERANCE→indulgent faint | **DEFAULT-ON** ⭐ the cleanest source in the set |
| **took_holy_orders** ⭐NEW | PERSONAL | creed | DEVOTION→pious heavy · TEMPERANCE→temperate firm | **NO RECEIPT** — every hit in the tree is prose (taste row 17) |
| **converted_faith** ⭐NEW | PERSONAL | creed | DEVOTION→pious heavy | **NO RECEIPT** — the one conversion receipt is a SETTLEMENT changing patron |
| survived_battle | PERSONAL | ordeal | MERCY→callous firm · COURAGE→brave faint | **NO RECEIPT AT THIS GRAIN, BY LAW** — battle news is aggregate ("no npc named") |
| faction_captured | AFFILIATION | house | TRUST→paranoid firm · JUSTICE→corrupt faint | **DEFAULT-ON** ⚠ name trap: the real token is `faction_capture` |
| faction_cleansed | AFFILIATION | house | JUSTICE→principled firm · CHEER→optimistic faint | **DEFAULT-ON** — readable only from the record projection, never the news entry |
| house_power_rose | AFFILIATION | house | HUMILITY→arrogant faint · CHEER→optimistic faint | **NO RECEIPT** — a contest is receipted; a power LEVEL change is not |
| house_power_fell | AFFILIATION | house | HUMILITY→humble faint · CHEER→bitter faint | **NO RECEIPT** — same |
| home_occupied | AFFILIATION | realm | MERCY→callous firm · FIDELITY→loyal firm (siege solidarity) | **PRESET (2)** — the war layer is false in the defaults |
| home_liberated | AFFILIATION | realm | CHEER→optimistic heavy · FORBEARANCE→forgiving faint | **PRESET (2)**, ⛔ **BLOCKED** |
| coup_at_home | AFFILIATION | realm | TRUST→paranoid heavy · PRUDENCE→prudent faint | **DEFAULT-ON** ⭐ the fifth, and the only one on this plane |
| god_fortunes_rose | AFFILIATION | creed | DEVOTION→pious firm | **DEFAULT-ON (DATA-GATED)** — lit in all 7 presets; needs an authored patron deity |
| god_fortunes_fell | AFFILIATION | creed | DEVOTION→worldly firm | **DEFAULT-ON (DATA-GATED)** — same gate; fires with `rose` on the same tick |
| dwell_milieu (continuous) | WITNESS | milieu | all axes toward host's poles, faint × depth band — **the vector is the ADAPTER's, never the table's** | **PRESET (3)**, and it reaches **ONE dwell state** (see below) |
| news_believed_atrocity | WITNESS | word | MERCY→callous faint · TRUST→paranoid faint | **NO RECEIPT, NO HABITAT** — belief observers and subjects are both SETTLEMENTS |
| news_believed_triumph | WITNESS | word | CHEER→optimistic faint · COURAGE→brave faint | **NO RECEIPT, NO HABITAT** — the register's largest single gap |
| festival_kept | WITNESS | word | CHEER→optimistic faint · CONTENT→contented faint | **PRESET (3)** — ~~dark~~, corrected by an EXECUTED preset table |
| plague_season_survived | WITNESS | milieu | DEVOTION→pious faint · CHEER→bitter faint | **NO RECEIPT AT THIS GRAIN** — needs presence-at-home, the milieu gap |
| **ordinary_day** ⭐NEW | WITNESS | *(none)* | *(none — it teaches nothing)* | the SILENT KIND: any token outside the vocabulary collapses here |

**Counts, re-verified at L6 by counting the built table itself:** 31 kinds · planes personal **16**,
affiliation **9**, witness **6** · families ordeal 5, bond 2, fall 1, career 4, house 4, realm 3, creed
4, repute 2, word 3, milieu 2, silent 1 · **12** no-receipt · **3** dark · **5** default-on · **2** default-on-data-gated · **2**
blocked · **2** ambient (must declare a dwell span).

Family learn-rate ladder (candidate, heaviest first): **ordeal > bond > fall > career > house >
realm > creed > repute > word > milieu.** Commitment events (taking orders, conversion,
consecration) ride the creed family at heavy, per §800.4's ambient/commitment rule. ⚠ **Re-ordering
this list silently re-tunes every kind** — the funnel derives its family steps from the order
mechanically (taste row 12).

⚠ **THE DEVOTION CALL (row 4) HAS THE WIDEST BLAST RADIUS OF ANY TASTE ROW.** Counted at L6 from the
built table: **7 of the 31 kinds carry a DEVOTION pull** — `bereavement_close`, `pardoned_released`,
`took_holy_orders`, `converted_faith`, `god_fortunes_rose`, `god_fortunes_fell`,
`plague_season_survived`. Strike DEVOTION as a character axis and all seven lose a pull, and **three
of them go silent entirely** (`converted_faith`, `god_fortunes_rose`, `god_fortunes_fell` have no
other pull). Exactly **one** of the seven — `god_fortunes_fell` — needs DEVOTION's VICE word
`worldly`, which is itself the **conditional MINT** of Register I row 17. So row 4 and row 17 are one
decision with seven rows hanging off it.

⚠ **THE ONE CENSUS GAP L6 FOUND:** `god_fortunes_rose` / `god_fortunes_fell` are the only two
receipted rows whose PRESET LIGHTING **neither L3 nor L4 measured**. L3's four-bucket table did not
list them and L4's corrections did not reach them. Their lighting is therefore **unknown**, and it must
be measured by EXECUTING the preset table, not by reading the flag files — that distinction is what
moved four counts and one address at L4.
**→ CLOSED (2026-08-31, R-GODFORTUNES, ledger §874 rider):** measured by EXECUTING the chains — ten arms;
no rules flag exists in either chain; the only gate is authored deity data. Verdict rows above updated to
**DEFAULT-ON (DATA-GATED)**; the source census needs no new row.

### REGISTER III-b — THE ADAPTER ADDRESSES (built; 18 rows, each verified in the tree)

The kinds an adapter may honestly wire, with the surface it reads and how the SUBJECT is resolved.
Carried here so the pen sees what a mark on a row above actually costs.

| kind | surface | address | subject |
|---|---|---|---|
| goal_culminated | news | `impactKind npc_goal_culmination` | npcKey ⭐ the only `npcId` that survives history compaction |
| promotion_won / rung_lost | news | `impactKind npc_ladder` + tag `rise` / `failed` | npcKey (challenger slot) |
| caught_lying_exposed | news | ⚠ `kind` (not `impactKind`) `infowar_lie_exposed` | npcKey |
| turned_by_crime | news | `impactKind npc_verdict` + `verdict criminal_founding` | npcKey |
| pardoned_released | ledger | `spatialLedgers.npcRulings.entries` (`npc_pardon`) | ⭐ durableId, via the ledger's `originRef` run IN REVERSE |
| captured_held | ledger | `spatialLedgers.roads.ransoms`, `startedTick === tick` | npcKey |
| ransomed_home | ledger | `spatialLedgers.roads.missions`, `releasedFromRansom` | npcKey |
| corruption_exposed | record | `pulseRecord.corruptionEvents` | ⛔ displayName only — and **a shared name REFUSES** |
| faction_captured / faction_cleansed | record | `pulseRecord.factionCaptureEvents` (`to` / `from` = capture) | home |
| home_occupied | news | `impactKind conquest` | home (targetSaveId → roster join) |
| home_liberated | news | `impactKind occupation_lifted` | home ⛔ BLOCKED |
| coup_at_home | news | `impactKind coup_succeeded \| coup_suppressed` | home |
| god_fortunes_rose / fell | news | `impactKind pantheon_ascendancy` / `pantheon_twilight` | ⚠ `settlementIds: []` — reachable only through the settlement patron-deity join |
| dwell_milieu | ledger | roster `npc.whereabouts`, state `hostage` | npcKey |
| festival_kept | news | `impactKind tradition` × the roads `observance` journey | npcKey |

⛔⛔ **THE ONLY DWELL LONG ENOUGH TO TEACH IS CAPTIVITY, AND THE FIELD LIES FOR THE OTHER THREE
STATES.** An ordinary visit is one or two weeks against a thirteen-week cadence, so every visiting
emission is sub-floor and honestly refused; a ransom term is 13–39 weeks. So `dwell_milieu` reaches
exactly ONE of the four whereabouts states, `hostage` — which is also the only state whose `sinceTick`
means what its name says. For traveling / visiting / returning the field holds `departTick` (time
since leaving HOME), so a reader that treated it uniformly would over-count every visitor's dwell by
the whole outbound journey. **§800.4's "gentle man in a cruel city" cannot reach a resident at all
today**, because the whereabouts mirror is away-only and roads deletes the key when the NPC is home.

---

## REGISTER IV — THE VERB MATRIX (first draft; the 12-verb action grammar × R3b terms)

⚠ **UNTOUCHED BY ANY BUILT CAR.** W-OPS has not run; nothing below has been walked against the tree,
and the source-qualification law that emptied twelve of Register III's rows has **not** been applied
here. Read every row as a proposal with an unmeasured source.

Columns: actor-fit axes (virtue side helps unless noted v=vice side helps), counterparty-fit
(what makes the TARGET soft to it), context variables (existing causal reads only), failure mode.

| Verb | Actor fit | Counterparty soft if | Context | On failure |
|---|---|---|---|---|
| bargain | CANDOR, GENEROSITY | greedy, pragmatic | prosperity, trade | standing dented |
| suppress | v:MERCY, COURAGE | cowardly, restrained band | security, legitimacy | unrest + grievance |
| reform | JUSTICE, INDUSTRY | principled, house cleansed | legitimacy, piety | standing dented, rivals heartened |
| mobilize | COURAGE, PROTECTION | loyal, home threatened | war state, readiness | readiness spent, CHEER falls |
| protect | PROTECTION, FIDELITY | trusting, threatened | security | ward harmed → grievance on actor |
| expose | CANDOR, JUSTICE | corrupt (truly), careless | statecraft, credibility | liar's charge on actor (the LIE family) |
| undermine_rival | v:CANDOR, v:FORBEARANCE | arrogant, exposed flanks | rivalry window | feud minted, known character stains |
| seek_promotion | INDUSTRY, v:HUMILITY | patron generous, window open | ladder window | rung risk, envy minted |
| sabotage | v:CANDOR, v:PRUDENCE | trusting, low security | security (inverse) | EVIDENCE minted → known character |
| exploit | v:GENEROSITY, v:JUSTICE | desperate, indebted | prosperity (inverse) | grievance + repute charge |
| hoard | v:GENEROSITY, PRUDENCE | — (self-directed) | scarcity | standing dented when revealed |
| defect | v:FIDELITY, COURAGE | rival patron welcoming (known character read) | R1/R4 doors | burned — both sides' known character |

Envoy negotiation styles map onto **bargain / suppress-as-threaten / expose-as-appeal**, reading
the counterpart COURT's known character (§803's catalog); mission methods (place, observe,
extract) take their fits from CANDOR-vice (cover work) and PRUDENCE per the ES competence model.

⚠ One row is already partly ruled by a built car: the COURT's read of a man is a **three-word band on
FIDELITY alone** (Register VIII (d)). A seat that also weighed CANDOR would refuse a different set of
men — taste row 24.

## REGISTER V — OPERATIONS CATALOGS AND DEPTH RATES

⚠ **UNTOUCHED BY ANY BUILT CAR** except where marked.

**Mission kinds (each names its receipt family):** confirm_belief · acquire_intel · refute_claim
(the ES product triad) · place_agent (L3) · task_mole (L4, web-tasking family) · extract_agent ·
counter_lie (the REFUTE/contradict arm). **Envoy tasks:** negotiate_treaty · mediate ·
deliver_ultimatum · negotiate_ransom · arrange_tribute · trade_embassy · hostage_exchange ·
state_visit (⚠ awaits receipt verification at dispatch). **Depth exposure bands (milieu
multiplier, banded):** L0 faint · L1 light · L2 full · L3 deep · L4 immersed.

⛔ **THE FIVE DEPTH BANDS ARE EXPRESSIVELY DEAD UNDER TODAY'S DERIVED TUNING** (measured, L4): the
milieu family's −2 step clamps every milieu pull to `faint`, so L0 and L4 teach the same amount. The
bands are a real vocabulary with no current expressive range, and the fix is a signed tuning row —
which Register II's 6% margin says must be signed with the equilibrium table in view.

## REGISTER VII — THE DENSITY LADDER (ODQ §810; ROLL RANGES, values signed at the tuning pass)

⚠ **UNTOUCHED BY ANY BUILT CAR** — TE-DENSITY-1 dispatches after `R-DENSITY-CENSUS` is
chair-dispositioned. Carried verbatim.

Every cell is a seeded ROLL RANGE, never a constant — the tier gates the range, particulars
(prosperity, connectivity, war, corruption) tilt weights within it. The thorp's second faction
exists only when the top-influence power is not the ruling power (the gap is the story).

**The two-stage roll at EVERY tier (§810.2):** roll the settlement's named-NPC **MASS** within the
tier band, then **DISPERSE** it across factions by a second seeded weighted partition (all-in-one,
one-each, and everything between all reachable — concentration follows influence, never
determined by it; a distribution-shape fixture asserts real entropy per tier and ZERO mass
outside the band). Each roster then rolls **RUNG OCCUPANCY** (head / middle / lowest — any rung
may be vacant; the vacancy-plus-yearner pattern is over-weighted on purpose: the empty seat
registers as an open ladder window and the yearner arrives with seek_promotion pre-loaded). Rank
ceilings scale with tier (a thorp's head is at most notable; no pillars below town). **The band's
edges are believability assertions** — a thorp can never roll seven named figures (§810.2b).
**THE SEAT FLOOR (§810.3, hard gate):** the first named NPC always mints into the ruling power's
faction, on every generation path — lifted only under a typed missing-ruling-seat stressor,
which births the vacancy-and-yearner pattern at the throne itself (a succession story, never a
null); the density shrink arm may never dissolve the ruling faction (events only); a both-ways
fixture walks the invariant. **§810.4:** the rival's faction is a WEIGHTED ROLL scaling with the
influence gap, any archetype ("not bounded in blood"); a faction mints WITH ≥1 NPC or not at all
(the atomic mint — NPC-less factions unrepresentable); in play, an emptied roster DISSOLVES the
faction with a chronicle receipt — except the ruling faction, which becomes a typed INTERREGNUM
and engages the succession machinery. The walker asserts: roster ≥1, or ruling-under-missing-seat-stressor
(§810.5: one closed stressor family serves birth and play), or dissolved-with-receipt — no fourth
state. **§810.6:** a power gaining the seat in play without a faction has one MATERIALIZED —
faction + tier-rolled roster + fresh souls in one atomic act, the same versioned law's third
caller (birth · growth · ascension).

| Tier | Factions (roll) | Named-NPC MASS (roll) |
|---|---|---|
| Thorp | 1 (+1 conditional) | 1–3 |
| Hamlet | 1–2 | 2–4 |
| Village | 2–3 | 3–6 |
| Town | one per ranked power (3–5) | 6–10 |
| City | 5–8, incl. 1–2 doubled niches (intra-power rivals) | 12–20 |
| Metropolis | 7–10, incl. doubled niches | 18–30, full suites on select pillars |

**The ladder is ALIVE (§810.1):** the same ranges govern simulated tier growth — on promotion the
fabric thickens toward the new band at a slow rolled cadence (one receipted emergence per
interval), the spawn filling the largest representation gap first (a power strong in influence /
legitimacy / economics but unrepresented); on decline it thins, weakest standing first
(anti-ratchet — vetoable). New members roll their characters through the W-LIVES path.

---

## REGISTER VIII ⭐NEW — THE CONSUMER-SEAM VOCABULARIES (every closed word list cars L2–L5 minted)

These are **built and live in code**, each with `signedBy: null`. They are small, and every one of them
is a word a player will eventually read or a switch that changes who the world produces. Strike,
rename, or add.

⭐ **They all travel through ONE shape, so four call sites learned one vocabulary instead of four.**
The chokepoint is a **LENS** answering three optional questions — *whose drift map is this?* · *what
legacy word does this axis position claim?* · *what conduct lean does this axis carry?* — and **every
production caller passes a lens that answers none of them**, which is exactly the identity. A consumer
handed no projection gets **its own array back by reference**: the honest behaviour for a reader that
cannot yet read, and the whole byte-identity proof in one sentence. The projection is named as a
constant rather than left to a search, so **the consist landing binds ONE import and every re-route
below starts speaking at once**. That single binding is the moment this substrate goes from vocabulary
to behaviour — it is worth knowing which commit does it.

**(a) VIEWER KINDS — who is looking.** `deity` · `mortal`. TRUE sight belongs to `deity` alone; an
unknown viewer gets the MORTAL read, never the true one. Both clergy reads take the TRUE chart, ruled
not defaulted (the footholds reader is a deity; the clergy bench is a structural group projection, not
any observer's belief) — so **the KNOWN read has zero production consumers today**. Re-verified at L6:
its only occurrences in `src/` are its own definition and one internal call, and a closure walker
asserts that nothing outside the drift family names it, with an anti-vacuity anchor proving the family
it scans is really there. The known read lands where an OBSERVER is named — the vetting band and
W-OPS's acceptance door.

**(b) DISCLOSURE KINDS — what an observer can have learned.** `band_crossing` · `displacement` ·
`reversal`. (Taste row 22: whether a DISPLACEMENT should move belief at all — today it marks the axis
as spoken-of and changes no position.)

**(c) KNOWN-STATE FLAGS — beside the chart, not on it.** `lieStigma` · `revealedCorruption`.

**(d) VETTING TEMPER BANDS — a court's read of a man.** `self_serving` · `ordinary` · `dutiful`.
Three words because a court's read is a JUDGEMENT, not a score. An ABSENT chart reads `ordinary` and
no arm fires, which is what makes the term byte-identical on every world that has no charts. The band
reads **FIDELITY alone** — the axis whose vice pole had to be MINTED, which is what makes that mint
load-bearing rather than decorative.

**(e) DERIVED ALIGNMENT WORDS — eight cells over nine.** `lawful_good · neutral_good · lawful_neutral
· true_neutral · chaotic_neutral · lawful_evil · neutral_evil · chaotic_evil`.
⛔ **`chaotic_good` HAS NO WORD** — the roll table, the editor contract and both categorical parsers
all carry the other eight. A derived reading therefore cannot name *a good man who keeps no rules*.
The fallback drops the LAW half and keeps the MORAL one, because the headline claim ("he was a good
man once") is moral. Taste row 14.

**(f) THE RISK REGISTER'S TERMS.** CENTRE = `axes` (COURAGE + PRUDENCE, fixed by name at F15 — there
is no "ambition family") + `appetite` (the estate's existing `riskAppetiteOf`, of whose HIGH_RISK set
`ambitious` is already a member — the register EXTENDS that reader rather than minting a second
spelling) + `desperation`. BREADTH = a chaos projection.
⭐ **Two terms are DECLARED ABSENT rather than folded as silent zeros** — `desperation01` and
`disorder01` — because the estate's one desperation read is not exported and its one NPC disorder read
is the conduct plane's own column. A supplied ZERO reads apart from an absent term, and the register
says so on its face. Neutral centre = 1/2; each of the three centre terms may move it by 1/6 (derived
from their COUNT, so a fourth term re-divides the swing automatically); breadth runs 1/6 … 1/2.

**(g) THE FUNNEL'S REFUSAL VOCABULARY — twelve typed refusals, never a silent drop.**
`ambient_without_span · below_floor · dormant · no_durable_identity · no_evidence · no_pull_vector ·
plane_mismatch · pulls_not_overridable · silent_kind · source_unverified · sub_floor_pull ·
unknown_axis`. *"Nothing happened"* and *"nothing COULD happen here"* are different facts, and an
author debugging a soul that never moves needs the second.

**(h) THE RECEIPT KINDS — what the chart may say out loud.** Crossings · reversals · displacements
**only** (the wallpaper guard: a control emits ZERO receipts while two lessons apply). Stock kind
`character_axis`; the cause token when only the homeward walk moved it is `homeward_decay`; death
mints ONE typed chronicle record, `character_legacy`.
⚠ The **displacement rule is MAGNITUDES, not top-3 reordering** — the entrants-only reading loses the
lead changing hands, and literal reordering mints receipts that are FALSE (an untouched axis credited
with "overtaking" one it is still a full band behind, purely because a third collapsed).

**(i) THE GOAL-BRANCH TABLE — 13 branches, and one authored column.** Each branch now carries a
`nerve` value on 0..1 saying how BOLD it is, read against the soul's risk centre: `break_vassalage` is
the boldest thing a subject can want, `survive_tribute` the least. **They are the only numbers the
rule-tree conversion authored, and they change NOTHING while the tilt is absent.** The tilt span is
derived from two inequalities rather than chosen — a tilt must be able to swap NEIGHBOURS and must
never pass TWO — which pins it into (1/2, 1); the value is the midpoint. So the pen signs **the law**,
not the number. Widening it past 1 lets character overrule the world. Taste row 23.

| branch | nerve | branch | nerve |
|---|---|---|---|
| vassal_dissident | 1 | promotion_opportunist | 0.75 |
| crisis_predator | 0.9 | overlord | 0.7 |
| demotion_vengeful | 0.8 | rivalry | 0.65 |
| promotion_merchant / _military | 0.6 | promotion_seat | 0.5 |
| crisis_shepherd | 0.4 | demotion_shelter | 0.2 |
| crisis_survivor | 0.1 | vassal_enduring | 0 |

**(j) THE CORRUPTION DEPTH GATE — row 13(a)'s switch, built both ways.** One field, `threshold`,
carrying `marked` or `defining`. **It ships defaulted to `defining` — the SAFER reading** — because a
gate that opens too few doors is a feature that has not arrived, while one that opens too many is a
live behaviour change nobody signed. `signedBy: null` is the pen's own slot; flipping the field is the
whole edit and no consumer moves. The gate is **ADDITIVE, never subtractive** (a subtractive read
would silently un-corrupt live campaigns), and it REFUSES an unknown drifted vector rather than
defaulting it — the estate's flaw reader defaults an unmapped word to `greed`, which would have
recorded every `fear`-drifted soul as greedy.

**(k) THE DOOR — one flag, and there may never be a second.** `characterDriftEnabled`. Absent ⇒
DORMANT. It is named as a constant at its one read site so the flag car can find it by symbol and no
second reader can invent a second spelling. ⚠ It still has **no home**: TE-VIRT-1 owes it one, and
until then the whole substrate is dark by construction.

---

## REGISTER VI — THE ACCUMULATED TASTE ROWS (one-line calls)

⚠ **Rows 1–13 keep their numbers** — they are cited by number in the volumes, the packets and the
code. Measurement is added under a row, never in place of it. Rows 14+ are new, surfaced by the built
cars.

1. Drift half-life per axis class: `a_year` vs **`a_few_years` (chair lean)**.
   → *BUILT at `a_few_years`, chosen from the estate's shared half-life ladder rather than authored.
   ⚠ Sign it with Register II's equilibrium table in view: the property that saves §9 risk 5 holds for
   every band, but on a 6% margin.*
2. Populace drift v1: **clergy + named first (chair lean)** vs everyone.
3. Boon & bane may share a channel: **yes (chair lean)**.
4. DEVOTION: character axis vs faith-relationship only (Register I row 17).
   → *BUILT as the one axis carrying `ownerRulingPending: true`; nothing else in the catalog is
   flagged, so this row is the catalog's single open question.*
5. `stubborn` and `ruthless` homes (ruthless homed at MERCY-vice in Register I; veto freely).
   → *BUILT: `ruthless` is a MERCY-vice expression; `stubborn` is carried as a modifier.*
6. Does a refused seek/mission teach (humiliation kind)? **Chair lean: yes, faint.**
   → ⚠ *The tree has ALREADY ruled, in these words: **"A REFUSAL IS NOT AN EVENT"**, because
   receipting it "would let the knowledge lane certify itself off failures". This row asks whether it
   should TEACH; the engine has already answered whether it can be HEARD. Saying yes costs a new
   receipt and re-opens that ruling.*
7. Refused mission receipted to the principal? **Chair lean: yes — brave or career-fatal by the principal's character.**
8. Age-scaled drift rates (young drift faster): **excluded v1; revisit post-soak.**
9. Personal chaos as ESTIMATE noise (beyond window width): **excluded v1 (double-noise risk).**
10. captured_held: hardens or breaks? (Register III draft: seeded, weighted by current COURAGE.)
    → *BUILT with the TRUST half ONLY. A seeded fork needs a PRNG and the catalog leaf is pure, so
    **the COURAGE pull is ABSENT rather than guessed** and pinned so it cannot be quietly filled in.
    This row is blocking a real pull vector, not a nicety.*
11. Level words: `a_touch/marked/defining` vs `a shade/plain/consuming`.
    → *BUILT on the first set, and they are load-bearing: the 7-rung ladder tokens, the depth gate's
    threshold and the band-crossing receipts all spell them.*
12. The family learn-rate ladder order (Register III).
    → *BUILT as a mechanical 4/3/3 tercile over this pack's own order, so **re-ordering the list
    silently re-tunes every kind**. And under today's tuning the ladder is what flattens the milieu
    family onto the floor — which is both what saves §9 risk 5 and what kills the depth bands
    (Registers II and V).*
13. **(§806, panel-surfaced — two joined calls the chair may not make alone):** (a) drifted-vice
    corruption eligibility depth: `marked` vs `defining`-only (the chair's lean); (b) THE NOVICE
    CORNER: a first failed cruelty cannot make its actor characterologically LESS likely to
    repeat (chastening is bounded at the core) — failure's deterrent there is worldly (costs,
    reputation) with a faint stain remaining. Sign that, or flip to practice-marks-on-success-
    only (a failed atrocity then leaves no stain). The arithmetic forbids having both.
    → *(a) BOTH ARMS ARE BUILT AND PINNED; the live one is one field, **defaulted to `defining`, the
    safer**, and unsigned. The reach is the harder half of the same call: a drifted vice opens a door
    on **7 of 17 axes** (Register I), so ten axes stay silent however deep the drift runs.*

### ⭐ NEW ROWS — surfaced by cars L1–L5, each with a measured cost

14. **`chaotic_good` has no word.** Mint the ninth alignment word, or keep the fallback that drops the
    LAW half and reads him `neutral_good`? Minting touches the roll table, the editor contract and
    both categorical parsers. *(Register VIII (e).)*
15. ⛔ **THE §856 NON-OVERLAP GRAIN — the most expensive row here.** The ruling says "no SIGNAL may
    feed both funnels", honoured literally, which **BLOCKS `corruption_exposed`** — the only default-on
    personal-plane source, and the strongest row in Register III — **and `home_liberated`**. At the
    finer **(signal × soul)** grain both collisions dissolve: the growth kernel deposits on a
    settlement's OFFICE HOLDERS by domain, while these adapters teach the PERSON the thing happened
    to. Ruling the finer grain costs one field per row and buys back the table's best source.
16. ⛔ **A SECOND LIVED-EXPERIENCE FUNNEL ALREADY EXISTS.** `npcGrowthKernel` maps eight settlement
    signals onto learned NPC traits, is LIT in three presets today, and is keyed on the POSITIONAL
    slot id that car L2's recon refuted. **Extend its table, or stand beside it?** Two vocabularies
    over the same souls is the fork class the estate has already paid to end once. ⚠ Two of its eight
    signals are structurally DEAD (nothing ever writes them), so a footprint claim that assumed all
    eight would overstate it in both directions.
17. **The commitment kinds' plane.** `took_holy_orders` / `converted_faith` are BUILT on PERSONAL
    (taking orders happens TO you, whatever it happens through) rather than riding AFFILIATION with
    the rest of the creed family. Both are NO-RECEIPT today.
18. **`methodical`'s pool duplication — dedup costs behaviour THREE ways, all measured.** (1) the draw
    is length-indexed, so removing it re-hashes a 525-row generator golden manifest — a declared
    SHIFT, never a free edit; (2) mirroring the removal into the bank rejects already-stored facets
    and queued edits — a save-compat break; (3) the word reaches the conduct plane through EITHER
    pool, so removing one halves a live weight. Keep the duplication, or take the shift knowingly?
19. **The DIRECTION OF SUSPICION.** §12 R2 makes an observer's TRUST position a MULTIPLIER on the
    track record, and it is BUILT literally: a trusting observer believes the record, a suspicious one
    discounts it and falls back to the public persona (confidence 0 at defining-suspicion, 1/2 at
    neutral, 1 at defining-trust). The opposite reading — *a paranoid man believes the worst* — is
    equally sayable in English and would need a signed direction, not a guess.
20. **`god_fortunes_*` carry NO devotion scaling.** §14 says "the settlement patron SCALED BY
    DEVOTION", and **no per-NPC devotion or faith field exists anywhere in the tree**. Every adherent
    takes the table's vector unscaled. Ship it flat, or mint the field?
21. **Does an affiliation-plane realm event teach EVERY roster member of a settlement, or only its
    seated / important ones?** BUILT teaching everybody, which is the register's plain reading.
22. **F10 — the stored alignment.** RULED a PROJECTION CACHE with a reconcile pin rather than
    re-pointed, because the derived read makes NO CLAIM while the plane column is unbound, so
    re-pointing today would hand the war layer and bloc formation nothing on every existing campaign —
    and a stored write-once seeded roll is lived history under THE PROMISE. ⚠ Two corrections to the
    volume came with it: it says "its FOUR live consumers"; measured, there are **THREE read sites,
    TWO live** (the third has zero importers). And the `alignmentAxes` table has **TWO homes, inverted
    on the moral axis, agreeing only by coincidence of substrings** — named, not merged.
23. **The `nerve` column and the one-rung law** *(Register VIII (i))*: 13 ordinal values, inert while
    the tilt is absent, and the first thing a signed pass would tune.
24. **Which axes a COURT may read.** The vetting band reads FIDELITY alone; a seat that also weighed
    CANDOR would refuse a different set of men. Also here: R6's centre gives its three terms an EQUAL
    derived share, and R8's breadth runs from one band's share of the window to half of it — both ends
    derived, the curve between them unsigned.
25. **Does a dead soul CLOSE its chart or keep it?** Death mints one typed chronicle record (F6), but
    drift close-out is unruled: the offsets simply remain. Under THE PROMISE, lived history is
    immutable — so "keep" is the conservative reading and "close" needs a signature.

---

## WHAT IS STILL UNMEASURED (so the pen knows where the floor is soft)

1. **Registers IV, V and VII have never been walked against the tree.** The source-qualification law
   that emptied 12 of Register III's 31 rows has not been applied to the verb matrix, the mission
   catalogs or the density ladder. Expect a comparable attrition.
2. **`god_fortunes_rose` / `god_fortunes_fell` have no lighting verdict** (Register III's census gap).
3. **Nothing in the engine writes a character chart yet.** Not one generator, step or migration —
   measured across the whole tree. So every register above is a vocabulary for a substrate that is
   dark by construction, and the first world to carry a chart will be the first real test of these
   words. That is by design, and it is also why none of these figures is a behaviour claim.
