RE-REFUTER (seat: Opus 5) · block DS-DEF-2 · pool `Disasters & Famine: granary AND parish care only`
Target: cure.md (the curer's five cured units). Instruments: card.md (whole) · recut/CONTRADICTION-TABLE.md §V and §1.4 · the chair's block rulings.
Dock reads (READ ONLY, no entry, no test run): laneRW-DEF2.
RESULT ON THE FIVE CURED UNITS: 4 PASS · 1 WITHHELD · 0 FAIL · CRAFT **PASS** (one systemic thinness named, measured) · 3 WIRING re-verified.

================================================================================
THE EXECUTED SCAN FIRST — because three of the five cures rest on it
================================================================================
All twelve `CLAUSE_DETECTORS` regexes (`src/domain/prose/moveGrammar.js:210-236`) were transcribed
and run over the 25 cured units, extracted from cure.md's THE ROWS section.

  ABSENCE 1 (u23) · CONTRADICTION 0 · **PROVENANCE 0** · OPEN 1 (u4) · CONSEQUENCE 2 (u11, u19)
  HISTORY 1 (u17, on the literal `after the` in "asking after the sick") · INSTITUTION 1 (u24)
  PERSON 0 · TRADITION 1 (u1, on `is kept in`) · GEOGRAPHY 0 · OBJECT 2 (u17, u23)
  = 9 match instances over 25 units.

**PROVENANCE reads ZERO.** The draft's one citing unit was the v3 spine and it is gone. The
detector's last alternative is the literal `|from the road)` (`moveGrammar.js:225`); `from outside`
appears in that alternation and in no other detector (checked individually against GEOGRAPHY's
`the road (to|from)` / `the way in`, OBJECT, HISTORY, TRADITION). The walker's integers at
`tests/lint/proseMoveGrammar.walker.test.js:856-859` — `expect(cited.length).toBe(7)`,
`expect(kindOnly).toBe(7)` — are therefore untouched, and the SHRINK-ONLY ceiling the packet
would have redded stays at 7. The curer's claim of "draft 10 → cured 9, PROVENANCE 0" is
CONFIRMED by execution, not accepted.

No cured clause gained a detector match. u2 (`to keep` is not `keeps`, and `is kept (here|in)`
is gone with the old wording), u10 (`nobody here has` does not match `\bnobody has\b`; `stand open`
does not match `stands open`), u18 (no institution word stands within 40 characters before
`hears`; `comes before` is not CONSEQUENCE's `comes out of`) and u21 (`is hard to keep here` is
not `is kept here`) are all clean, each checked against every row.

Mechanically clean over the 25 units: no digit, no em or en dash, no exclamation mark, no
semicolon, no contraction, no `{settlement}`, no self-citation token.

================================================================================
ONE LINE PER CURED UNIT
================================================================================

--- v1 · face 1 · hall · was FLOOR 2 (magnitude) · **PASS** ---
QUOTE "the town's to keep and not the town's to open"
FIELD `Town granary` → `"Grain storage": { on: true, p: 1.0, desc: "Municipal grain reserves.
Buffers the settlement against poor harvests." }` — `src/data/institutionServices.js:1429-1430`;
`Milling service` off p 0.5 `:1431`; `City granaries`' `Rationing` off p 0.6 and `Grain loans`
off p 0.4; `State granary complex`'s `Price stabilisation` off p 0.5 `:1473-1474`.
FINDING The proportion is gone and nothing replaces it. Nothing here is a magnitude: the face now
asserts WHOSE the store is and what the town does not do with it. The denial is not of a service
at or above the bar — every releasing service on every granary row of the preimage sits BELOW the
bar, so "not the town's to open" is the engine's own model rather than its contradiction, and it
is the card's own reading twice over (§7.6 "the stores are theirs to hold and not theirs to open";
§9 "the capacity is recorded and the town does not use it"). It is an ATTRIBUTED ACCOUNT by the
hall about AUTHORITY — who may open — and a source's opinion is never a finding.
⚠ THE ONE THING I CHECKED HARDEST AND LET STAND. `Grain storage`'s own description says the
reserve "Buffers the settlement against poor harvests", and `threatAssessment.js:181` prints
"Granary provides food buffer. The community can absorb a bad harvest without immediate
hardship." A store that is never opened buffers nothing. The face survives because it does not
say the store is never opened — it says opening it is not the TOWN's to do, which is a claim
about authority, and because the tie-break at §1.4 files a denial by engine PROSE as a WIRING row
and not as a floor. Read the face as "the door never opens" and it would be the v2/0 question
below; read it as written and it stands.
PAIR Pair 1 reinforce holds (both faces say the store is inert in the town's economy) and the
joint still reads: "…not the town's to open, and those who sell at the market say the store takes
no part in the price of the loaf." `joinable` stands.
CURE none required.

--- v2 · face 0 · spine · was FLOOR 2 (magnitude, aggravated) · **WITHHELD** ---
QUOTE "nobody here has seen it stand open"
FIELD Card (2b′), the observer's and the public's list: `Town granary` — "NOT SEEN is a claim
about: Grain storage", and the rule beneath it: "AN OBSERVATION AND A PUBLIC FACE ARE FACTS THEIR
SPEAKER CLAIMS … so neither may INFER INTO A SILENCE a required row denies." The row is
`src/data/institutionServices.js:1429-1430`. The engine moves grain through that door in BOTH
directions every tick: `src/domain/worldPulse/foodStockpile.js:360` and `:365` fill the store
(inflow and the reserve tithe), `:381` `storage -= spend` draws it down and records the released
share as `reliefPct` `:380`, and the whole object is written back at `:467`
(`economicState: { …, foodSecurity: nextFoodSecurity }`). The file's own comment at `:302-308`:
"the famine eats the granary exactly the way the siege does."
FINDING The named fault is cured — the proportion is gone, and the perfect now runs over a door
rather than over `storageMonths`. What replaces it is a UNIVERSAL NEGATIVE OBSERVATION in the one
register the card fences hardest. Its lawfulness turns on which of two readings of "stand open"
governs. Read as "be left standing open", the face says a grain store is kept locked — true,
backed by the v1 register face's door and lock, denying nothing. Read as "be open", the face says
no townsperson has ever seen grain go into or out of a store the pulse fills and empties, and at
a value the keys admit (none of the five key functions reads `config.stressTypes`, so the face
prints under a famine banner) that is 2b′'s own barred shape — the exact analogue of its example,
"no member of the watch has walked the wall" on a town carrying a required `Town watch`.
I WITHHOLD rather than fail: the record holds no field about what the town has SEEN, the
re-cut's governing sentence is that silence is permission, and the denial needs a two-step
inference (never open ⇒ never drawn down ⇒ the buffer does not buffer). The burden is mine and I
do not discharge it. But the chair should see it, because this is the second time this clause
POSITION has been charged, and because the sentence's own rhetoric — "Everyone here has seen the
store door" exists only to set up the negative — picks the stronger reading.
NOTE ON THE DECLARED DEVIATION: I ENDORSE IT. The curer kept the care clause the refuter had
passed, against the prescribed tail. The ground is right — the spine is the only line guaranteed
to render, this key fixes two facts, and a spine silent on the tending would sit as comfortably
on the sibling rung `granary, NO medical provision` (card 2d, ruling 35). The kept clause is
lawful on its own: "whoever the parish sends" names no office, `Healer` and `Parish Priest` are
both avoided, and the tending is the engine's own (`defenseDisplay.js:237-239`,
`threatAssessment.js:181`).
CURE IF THE CHAIR TAKES THE STRONGER READING — one word, and the deviation survives intact:
"Everyone here has seen the store door shut, and everyone here knows that a sickness in a house
is answered by whoever the parish sends." A positive seeing, no universal negative, no
elapsed course over anything the pulse moves, one clause shorter, and it stops sooner.

--- v2 · face 8 · court · was FLOOR 1 (a service at or above the bar denied) · **PASS** ---
QUOTE "over who sat up last comes before the hall"
FIELD `Town hall` → `"Dispute arbitration": { on: true, p: 0.8, desc: "Bring commercial and civil
disputes before a magistrate." }` `src/data/institutionServices.js:1625`; at city `City hall` →
`"Appeals court": { on: true, p: 0.8 }` `:1631`.
FINDING The denial is inverted and the face now affirms the service exactly. Nothing else in the
sentence denies a field: the main verb is the habitual present, so "who sat up last" is the type
of the quarrel and not an event the record ran (floor 2 clear), and the court source is closed
TRUE across the preimage by the card's (0) correction.
⚠ NOTED, NOT A FINDING: the service's own description seats the HEARING with a magistrate, and
this face's speaker is "a clerk who hears the town's disputes" — singular, and adjudicating. The
tier's `Chief Magistrate` is minted under `recently_betrayed` / `succession_void`, both admitted
by the keys. It clears floor 3 because "a clerk" is indefinite and is on the card's own safe list
(§7, the named-offices fence), and because the CLAIM the face makes is correct whoever says it.
The pool's own v3 face 6 carries the plural form, "Those who hear disputes say", which is the
safer shape if the chair wants it uniform.
⚠ The curer's refusal of the prescribed close ("…like any matter of trade") is CORRECT and I
would have refused it too: v2 face 3 already lands on `trade`, the two faces can co-render, and
curing one finding by manufacturing a second is not a cure. The shorter candidate that lands on
`hall` is the better one on the brief's own tie-break.
CURE none required.

--- v3 · face 0 · spine · was THE CITATION LAW (F1-24, the mechanical gate) · **PASS** ---
QUOTE "the town looks provided for from outside"
FIELD `moveGrammar.js:225`, the PROVENANCE alternation, whose twelve holder kinds are asserted
live by `tests/lint/proseMoveGrammar.walker.test.js`'s `KIND_CONTROLS` (the `road` kind's control
sentence is "from the road it looks prosperous").
FINDING MEASURED, NOT ACCEPTED. `from outside` matches no alternative of PROVENANCE and no other
detector; the pool's PROVENANCE count over all 25 units is ZERO (executed, above), so
`cited.length` and `kindOnly` both stay at the 7 the walker asserts and the packet is no longer
refused whole. The CONSEQUENCE clause "comes out of the church" is unchanged and was already
there, so the variant's move sequence loses PROVENANCE and gains nothing. No record is named
anywhere in the pool, by name or as a generic; the source is named through a role, and the
stranger is seated on every town of the preimage by the brief.
⚠ CRAFT, NOT A FLOOR, AND NOT INTRODUCED BY THE CURE: the spine's "looks provided for" and v3
face 5's "what a stranger takes for provision" share a root and a proposition inside one
co-rendering variant, against the rule that a phrase in a spine may not echo a phrase in any face
of that variant. The cure touched three words and left this where it found it. Face 5 is the
WITHHELD unit the chair already holds; if the chair re-cuts it, this is the second reason to.
CURE none required.

--- v3 · face 2 · market · was FLOOR 1 (a same-page field denied) · **PASS** ---
QUOTE "Grain is hard to keep here"
FIELD `stress` [SNAPSHOT] and `config.stressTypes` [CONFIG], both in the card's (3) same-page read
set; at famine the page prints `src/generators/safetyProfile.js:128`.
FINDING The absurd half is gone. What survives is true under every stress the page can carry — a
household with no storage of its own cannot hold what it buys — and it denies nothing: `Housing`
carries no service menu at or above the bar at any preimage tier, and the face makes no claim
about the granary, which is the one storage the key fixes. "Hard" is a difficulty and not one of
floor 2's magnitudes (count, share, size, distance, duration, frequency, proportion, age). The
object-fronted opener and the attribution-inside frame are kept, so the variant's opener mix is
unchanged, and it still lands on `town`, a noun no sibling in the variant closes on.
CURE none required.

================================================================================
CRAFT, AT THE POOL GRAIN: **PASS** — with the pool's one systemic thinness named
================================================================================
THE FINGERPRINT, MEASURED OVER THE 25 CURED UNITS (ruling 35): 551 words · 259 content tokens ·
**134 distinct content types = 51.7%**, against the ~32% of the flat licence-test rewrite the
ledger reverted at `f20532e18`. **Ten distinct sources** across 22 faces (hall · market · watch ·
register · guild · tavern · gate · garrison · stranger · court), against a floor of three. Three
spine shapes: a bare fact, the public as carrier, a source's account. Real stake on every page —
the parish does unpaid work, the guilds carry a bill nobody makes good, the hall defends a purse
with no line in it, the tavern does not know whose hand holds the key, the stranger finds out
that the church is also the hospital. It is not a camera and it is not one sentence twelve times.

THE THINNESS, NAMED AND MEASURED, AND WHY IT IS NOT A COLLAPSE. **Thirteen of the twenty-five
units turn on one rhetorical pivot** — assert a thing, then negate its counterpart (units 1, 2, 4,
5, 7, 9, 10, 17, 20, 22, 23, 24, 25); eleven of the thirteen spend a `nobody`, a `not` or a
`neither` on the hinge, and `nobody` appears seven times pool-wide. **The attribution verb is
`says`/`say` on 23 of the 25 units.** Two of the five cures preserved the pivot rather than
breaking it (v1/1 keeps "the town's to keep and not the town's to open"; v2/0 sharpens it to
"everyone here has seen … nobody here has seen"), so the cure pass ran neutral-to-slightly-worse
on this axis.
I do not vote DULL on it, for a measured reason: **the key itself is a contrast**, and the SHIPPED
rows this pool replaces run the same pivot in three of three ("something better than nothing and
well short of a hospital"; "which of the two the town has spent its thinking on"; "knows which of
the two it fears"). A contrast-shaped pool on a contrast-shaped key is the subject, not a
collapse, and the faces are twelve different propositions rather than permutations of one. The
pool is better than what it replaces on every axis I can measure.
CARRIED FORWARD, UNCURED, AND STILL TRUE — variant 2's local collapse. Five phrasings of one noun
phrase in the co-rendering variant: the spine's "a sickness in a house", the market's "a household
with somebody ill in it" AND "a sick house", the guild's "a sick house", the watch's "a house with
somebody ill in it"; and two faces (hall, market) landing on `parish`. The curer declined it as
out of scope, correctly. The cure ADDED one item to the same variant's echo count: the spine now
carries "the store door", and face 6 carries "the door left on the latch" — a door and its
openness, in the spine and in a face of the same variant. Two of the five to vary if the chair
re-opens v2: the market's "a household with somebody ill in it" and the guild's "a sick house".
NOTED AGAIN, NOT A FINDING, AS THE FIRST REFUTER NOTED IT: the selector read the three-times-
running attribution veto as binding the FRAME and varied that instead. That is a reading, it is
defensible under ruling 20's naming of `says` as the plain form, and 23 of 25 is a long way past
three. The chair may take the veto literally; it is the chair's word, not the refuter's.

================================================================================
WIRING ROWS — re-verified by execution, not carried on trust
================================================================================
W1. **THE CARD'S CENSUS IS WRONG AT THE STOCKPILE GRAIN — CONFIRMED.** Card (6) prints
    `economicState.foodSecurity.stockpile  writers 0  FROZEN [SNAPSHOT]`, and the same for
    `stockpile.blockaded` and `stockpile.blockadeBypass`. `src/domain/worldPulse/foodStockpile.js`
    builds that object at `:404-420` — `famished`, `blockaded`, `blockadeBypass`, `reliefPct`,
    `tithed`, `capacityMonths` — and writes it back into the settlement at `:467`. The field is
    LIVE. A writer trusting card (6) spends the perfect over a moving field believing it
    licensed, which is precisely what produced the two floor-2 findings the cure pass answered.
W2. **THE GRANARY'S STOCK IS ON THE PAGE AND IN NO LINE OF THE READ SET.**
    `economicState.foodSecurity.storageMonths` is clamped at `foodStockpile.js:297`, filled at
    `:360` and `:365`, drawn down at `:381`, and drives `resilienceScore`, which becomes the
    disaster band a reader sees beside this very row. Card (3) lists `resilienceScore` and
    `stockpile` and never `storageMonths`, so the card gives a writer no way to learn that the
    granary holds a live, drainable quantity. Every writer on this pool reached for the stock.
    The card should print the field, its clamp and its two directions.
W3. **THE PROVENANCE DETECTOR'S ROAD KIND IS INVISIBLE TO THE CARD.** Card (8)'s F1-24 paragraph
    enumerates the accounts, the register, the parish rolls, the toll book, the muster roll and
    "the books" — and not "from the road", the one alternative in `moveGrammar.js:225` that reads
    as ordinary English rather than as a citation. It has now redded a packet twice. The card
    should print the detector's twelve holder kinds verbatim, the road among them.
