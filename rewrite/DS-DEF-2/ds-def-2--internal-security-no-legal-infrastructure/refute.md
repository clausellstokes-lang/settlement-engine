# REFUTE — DS-DEF-2 · pool `Internal Security: no legal infrastructure`

Seat: REFUTER (opus), for the Fable chair · 2026-09-13.
Test: ADDENDUM 14 as re-worded by the Fable sitting (ADDENDUM 18, CONTRADICTION-TABLE §V).
A face is lawful unless it CONTRADICTS the record. Silence is permission. "Unlicensed" is not
a finding. Grounds: the four floors only. Read whole: `card.md`, `speakers.md`, `draft.md`,
`CONTRADICTION-TABLE.md` (header, §1.1, §1.4, §R, §V), and — in the dock, read-only — the
product's own seating reader and catalogue.

CHECKPOINT: complete. 27 rows judged (3 spines + 24 faces), craft verdict returned, 3 wiring
rows recorded. Nothing was pending when this file was last written.

## THE ONE MEASUREMENT THIS PASS RESTS ON

The preimage is THE WHOLE OF BELOW-TOWN AND NOTHING ELSE (card §1: thorp 128/128 · hamlet
128/128 · village 128/128; town, city, metropolis SILENT). Three of the draft's source tags
cannot be seated on ANY of those 384 towns, and the product's own reader says so by name:

  `src/domain/display/stateProse/faceSources.js` — the ONE reader of "which sources exist
  here" (ruling 15; car 8b-W-18c), whose `sourcesOf` seats
    watch     <- `standingDefenseForces(settlement).watch.present`
    garrison  <- `standingDefenseForces(settlement).garrison.present`
    guild     <- a row whose name carries `craft guild` (`GUILD_NAMES`, :~88)

  `src/domain/institutions/defenseInstitutionBuckets.js:88-101` — `DEFENSE_BUCKET_KEYWORDS`
    watch:    ['town watch','city watch','professional city watch']
    garrison: ['garrison','barracks','professional guard','professional city watch',
               'multiple garrison']

  `src/data/institutionalCatalog.js` — the row names at the three preimage tiers, read whole
  (thorp 6-161 · hamlet 162-450 · village 451-922). NOT ONE of those 137 row names carries
  `watch`, `garrison`, `barracks`, `professional guard`, `guild` or `craft guild`. `Town
  watch` and `Barracks` first appear at TOWN (`:923+`), which this key's preimage never
  reaches. `Veteran's lodge` (village) and `Bowyers & fletchers (guild)` (town) carry a
  guild TAG and no guild NAME, and both readers match on the NAME.

So `hasWatch`, `hasGarrison` and the guild seat are FALSE on all 384 towns, not conditionally
but structurally, and the page prints the denial beside the prose (`safetyProfile.js:300`,
`:309`). This is F1-01, F1-02 and F1-16 — each binding ALL — and V-23 in terms:
"any watch as a body below town contradicts `hasWatch` false … the 'local watch — use it'
permission WITHDRAWN". The card says it in its own hand at §7 and §8: "no watch as a body
below town", "no garrison", "a market below town is a finding unless the roster prints the
row" — and the market, the tavern, the gate and the muster DO print below town, which is why
those four stand and these three do not. Ruling 15's shelter ("a conditional source is lawful
where the key or the roster reader CAN seat it") is exactly the test, and these three fail it:
there is no town in the preimage where the reader can seat them.

## VERDICTS — one line per row (variant · face · verdict · floor · field · quote · finding · cure)

v1 · face 0 (spine 1, `[ledger]`) · PASS · — · — · "There is no court here, no prison and no
stocks" · the three denials are the key's own reads at their widest (`priorityHelpers.js:54`
`['prison','stocks',…]`, `:55` `['courthouse',…,'town hall']`), and "no judgement is written
down" is denied by no required row: the village parish's `Records` service is birth, marriage
and death, never a judgement · —
v1 · face 1 `[stranger]` · PASS · — · — · "the first thing he looks for in a place is the
stocks" · the stocks are named FALSE by `hasPrison`'s own keyword list, so the empty square is
licensed and not inferred; the stranger is seated by the road on every town · —
v1 · face 2 `[tavern]` · PASS · — · — · "At the tavern a quarrel is said to go out of the
door" · `tavern` seats on `Alehouse` / `Wayside inn` (hamlet) and `Travelers' inn` (village)
— `TAVERN_NAMES` + `INN_RE`; habitual present, no magnitude, no event · —
v1 · face 3 `[register]` · PASS · — · — · "the ground takes whoever is brought to it" ·
`register` seats only where a church STANDS (village `Parish church`, required); `Graveyard`
is required there too and `Burial` is p 1.0, so nothing is denied and no record is cited · —
v1 · face 4 `[elders]` · PASS · — · — · "what they decide has no room to be decided in" ·
F1-20 is the licence, not the bar: below town the governing institution is a consensus and
never a room, and the key independently rules out a town hall; plural, so F3-06 is clear · —
v1 · face 5 `[gate]` · PASS · — · — · "a man asked at the bar goes on through either way" ·
`gate` seats on `palisade` (`GATE_NAMES`; thorp `Palisade`, hamlet/village `Palisade or
earthworks`), and F1-08 cuts both ways — a gate there is the engine's own reading · —
v1 · face 6 `[muster]` · PASS · — · — · "it turns out for what the households cannot settle" ·
the militia bucket seats `muster` on `Citizen militia` (hamlet, village) and the class word is
free under §R-8; no roll is cited and no headcount given, so DS-DEF-5's cell is untouched · —
v1 · face 7 `[watch]` · **FAIL** · 1 · `inst.hasWatch` / the watch bucket —
`defenseInstitutionBuckets.js:98-100` against `institutionalCatalog.js` thorp/hamlet/village
(no `Town watch` row below town); `faceSources.js` `sourcesOf`; F1-01, V-23 · "The watch says
a man taken up is let go again" · the face asserts a watch as a standing body on a preimage
where the bucket is empty on every one of the 384 towns, and `safetyProfile.js:300`/`:309`
print the denial on the same page. THE ROSTER IS THE RECORD · re-seat the sentence on a source
the preimage can hold — the muster (militia bucket), whoever keeps the gate (palisade), or the
households through the elders — or drop it. The content survives the move: "a man taken up is
let go again" is the prison read and needs no watch to carry it
v1 · face 8 `[market]` · PASS · — · — · "a short weight is argued at the stall" · `market`
seats on `Periodic market` (hamlet) and `Weekly market` / `Fish market` (village) —
`MARKET_NAMES`; F1-10 is satisfied by the printed row, and "no board to take it to" denies a
body no roster seats · —
v1 · face 9 `[guild]` · **FAIL** · 1 · the guild seat — `faceSources.js` `GUILD_NAMES`
(`['craft guild']`) and `priorityHelpers.js:57` (`hasGuild`), against the below-town row names
(`institutionalCatalog.js` 6-922: no name carries `guild`); F1-16 · "The guilds' word is that
a debt here is the creditor's to collect" · a craft or merchant guild is a TOWN row; the
village's `Veteran's lodge` carries a guild tag and no guild name, and neither reader looks at
tags. THE ROSTER IS THE RECORD · give the line to `[market]` (seated at hamlet and village)
or to the households: "a debt here is the creditor's to collect" needs no guildhall behind it
v1 · face 10 `[garrison]` · **FAIL** · 1 · `inst.hasGarrison` / the garrison bucket —
`defenseInstitutionBuckets.js:92-95` against `institutionalCatalog.js` (no `Garrison`,
`Barracks` or `Professional guard` row below town; `Barracks` first appears at town, `:923+`);
F1-02 · "with no gaol to put a man in, what it does with him" · the face seats the town's own
professional body on a preimage that cannot hold one; the hamlet charter hall's DESC mentions
a garrison, but a desc is engine prose and seats no row · re-seat on the muster, which can
carry the same withheld thing ("what it does with him is done at once and not written down")
wherever `Citizen militia` resolves

v2 · face 0 (spine 2, `[street]`) · PASS · — · — · "it stays settled for as long as everyone
who was there goes on agreeing" · this is `safetyProfile.js:380` in the households' own mouth
— social pressure, established families, collective action; a standing condition with no clock,
so floor 2's elapsed-course bar is not reached · —
v2 · face 1 `[stranger]` · PASS · — · — · "a short payment here is argued out on the doorstep"
· universal source; a doorstep is profile-neutral furniture across the eleven culture profiles
(F3-05) and `Dwellings` is required at every preimage tier · —
v2 · face 2 `[garrison]` · **FAIL** · 1 · `inst.hasGarrison` / the garrison bucket (as v1 face
10); F1-02 · "what reaches the garrison is settled the garrison's way" · the same seating: no
garrison row stands anywhere in the preimage, so the body the sentence gives a jurisdiction to
does not exist on the page it prints on · re-seat on the muster, or write the jurisdiction as
the households' own — the sentence's stake (someone else's settling overrides yours) survives
either move
v2 · face 3 `[tavern]` · PASS · — · — · "the households which do the settling are the ones
with the most fields" · a superlative of standing, not a magnitude the record holds — and it
is the tavern's OPINION, which is never a finding; `safetyProfile.js:380` records "the
authority of established families", so the record agrees rather than denies · —
v2 · face 4 `[elders]` · PASS · — · — · "a boundary is walked and talked over until it is
agreed" · the elders are seated by TIER below town (`ELDER_TIERS`); `Farmland` /
`Subsistence farming` / `Common grazing land` are required rows, so the bearer of the dispute
stands; "in time neither can spare" is a cost, not a duration · —
v2 · face 5 `[muster]` · PASS · — · — · "it is expected to stand behind whatever the
households decide" · militia bucket as v1 face 6; a grievance about its own standing, denying
no field · —
v2 · face 6 `[gate]` · PASS · — · — · "A quarrel that starts inside is none of the gate's" ·
`gate` seats on the palisade rows; "whoever keeps the gate" is the brief's own safe formula
and names no office the tier emits (the village's singular office is the GUARD CAPTAIN, and
no palisade row prints a gatekeeper) · —
v2 · face 7 `[register]` · PASS · — · — · "they are told when to dig and not what was decided"
· the digger is the card's safe everywhere-formula and cites no book; the face draws where the
`register` seat resolves, and the `Graveyard` it works is a required village row · —

v3 · face 0 (spine 3, `[visitor]`) · PASS · — · — · "A traveller wronged here finds there is
nowhere to take it" · the key owns the absence of the machinery (court, assembly, hall, gaol,
stocks) and the sentence claims nothing about force or about people; generic present, no event
narrated · —
v3 · face 1 `[stranger]` · PASS · — · — · "is pointed at the door of the house that did it" ·
universal source; a door and a house are required-row furniture at every preimage tier · —
v3 · face 2 `[tavern]` · PASS · — · — · "should take it in goods and not wait on coin" ·
tavern seat as v1 face 2; advice, which is opinion, and payment in kind contradicts no field · —
v3 · face 3 `[elders]` · PASS · — · — · "a stranger who does not stay for the answer was not
much wronged" · the elders' own stake, plural and unnamed; "not much wronged" is a judgement of
worth, not a magnitude of anything the record counts · —
v3 · face 4 `[register]` · PASS · — · — · "the ground takes a stranger on the same terms as
anyone" · as v1 face 3; `Burial` p 1.0 on a required row is affirmed, not denied · —
v3 · face 5 `[gate]` · PASS · — · — · "a stranger is looked over on the way in" · gate seat as
v1 face 5; "nothing is kept of the looking" cites no keeper and denies no record the roster
resolves (F1-24 is satisfied by claiming no record at all) · —
v3 · face 6 `[watch]` · **FAIL** · 1 · `inst.hasWatch` / the watch bucket (as v1 face 7);
F1-01, V-23 · "A stranger who complains to the watch is told" · the same seating fault, and
here the watch is given a counter and a voice on towns where no watch row stands · re-seat on
the gate (the one place in a town with no law where somebody may stop a person) — the line's
threat, no gaol for either man, is the prison read and carries over whole
v3 · face 7 `[guild]` · **FAIL** · 1 · the guild seat — `GUILD_NAMES` / `hasGuild` against the
below-town row names; F1-16 · "a stranger cheated here has no board to go to" · as v1 face 9:
no craft or merchant guild stands anywhere in this preimage, so the source that offers itself
as the alternative forum does not exist · re-seat on `[market]` at hamlet and village, where
the same greed for the role is licensed by a printed row

## CRAFT (pool grain) — PASS

Ten distinct speakers across the pool (stranger · elders · register · gate · watch · muster ·
garrison · tavern · guild · market), well over the three-speaker floor, and six of them survive
the seating findings. There is real stake and real disagreement: the muster's grievance that it
is expected to stand behind a settling nobody asked it about, the guilds' greed for the forum,
the tavern's class note that the settlers are the households with the most fields, the elders'
pride that they need no room, the gate's two jurisdictions. The attribution verbs do not repeat
three times running, the openers do not run three in a class, no face is a paraphrase of a
sibling, and each stands alone after any spine. The three spines take three shapes (bare fact ·
attributed · subject-first), which is ruling 29 satisfied. Against the shipped rows this
replaces (three spines, no faces) it is not duller by any reading. No `dm-only` face is in the
rows, so the notebook register is not in evidence here. Mechanically clean: no digit, em dash,
exclamation mark, semicolon, contraction or `{settlement}` in any of the 27 rows.

The one reservation, recorded and NOT charged as DULL because it is a seating fact rather than
a writing fact: after the six floor-1 removals V1 holds seven faces, V2 six and V3 five, and on
a THORP the drawable set collapses to the stranger, the elders and (where a `Palisade` resolves)
the gate. See wiring row 1 — the draft's own arithmetic ("every variant carries all three") rests
on a register seat the product does not grant below village.

## WIRING (the instrument, not the face — no face is charged on these)

1. THE CARD'S §7 SEATS A REGISTER THE PRODUCT DOES NOT. Card §7 lists "the register (parish)"
   as seated at thorp by `Burial ground` and at hamlet by `Access to parish church`. The
   product's own reader refuses both: `faceSources.js` seats `register` only on a row whose
   name carries church/cathedral/temple/abbey/monastery/friary AND does not start with
   `access to` (`REGISTER_EXCLUDE_PREFIX`), and no burial row lends the seat at all. So the
   register resolves at VILLAGE ONLY — one third of the preimage. The three `[register]` faces
   are lawful at village and simply never draw below it; the draft's roster note ("UNIVERSAL —
   stranger · elders · register … every variant carries all three") is false, and a thorp's
   roster is the stranger, the public and the elders alone. The card's line should be corrected
   before the next pool is marked, or the same three variants will be written against a source
   that is not there.
2. "OPEN" IN CARD §5 / §7 IS A STATEMENT ABOUT THE KEY, NOT ABOUT THE TIER. "watch: OPEN ·
   garrison: OPEN" reads, to a writer, as "this may resolve here". It means only that the key
   fixes nothing about it — and the CATALOGUE fixes it absolutely: neither bucket has a row
   below town. Four of this pool's six floor-1 findings trace to that one word. The marker's
   own prose (§7, §8) gets it right; the two tables above it do not, and the tables are what a
   writer reaches for.
3. THE HAMLET CHARTER HALL'S DESC NAMES A GARRISON — "coordinates local defense when the
   garrison cannot" (`institutionalCatalog.js`, `Adventurers' charter hall`, hamlet). That is
   engine PROSE on a row whose tier can hold no garrison, and under the frozen-versus-live and
   producer-prose rule it denies nothing and licenses nothing. Recorded so a later refuter does
   not read it as a licence for a garrison face below town.
