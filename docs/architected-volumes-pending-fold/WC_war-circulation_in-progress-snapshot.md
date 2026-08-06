# DESIGN_FP_ARCH_WC -- THE WAR-CIRCULATION VOLUME

Auxiliary contribution, composite armies, the people ledger, and the
domestic dividend: one system wearing four descriptions. This volume
architects the owner directive of 2026-08-06 (memory:
war-auxiliary-contribution-directive.md, 331 lines, sections (a)-(p)
plus chair refinements K1-K8 and the numbered refinements R1-R9) as ONE
WAR/WY amendment volume, per the directive's own fold instruction.

> **PROGRESS**: ARCHITECTED, NOT STARTED. No wave has landed. This
> volume was drafted against worktree
> /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold,
> branch claude/composite-r4, HEAD 3e2bd3092a7cc2d57e34b6f8ba0b7bc8d8b7196c
> (2026-08-06). AMENDED, ROUND 1 (2026-08-06): sixteen adversarial
> findings applied against the same sha -- fifteen repaired in place,
> ONE parked unresolved as CR-WC-21 (the cohort decay contradiction,
> where both candidate repairs edit an owner word). Section 1.9 (the
> call-in mechanism, R7) is NEW and the former 1.9-1.15 renumbered to
> 1.10-1.16; the chair question set grew to CR-WC-21.
> AMENDED, ROUND 2 (2026-08-06, same sha 3e2bd309): fifteen further
> adversarial findings applied in place. NEW model material: 1.1.5 (the
> elected dispatch -- chooser, executor, reservation), 1.6.4 (comrade
> accuracy, directive (h)'s dropped rider), and 1.17 (the coercion
> gradient and its inverse, R6 -- including the RELEASE arm that had no
> read site). NO renumbering of existing subsections. The estate-truth
> correction at 1.1 / 1.4.1 is the round's largest: the sender-elected
> contribution is a NEW road, not an extension of the receiver-side levy
> sweep, and the levy sweep is MEASURED SILENT. The chair question set
> grew to CR-WC-22 (CR-WC-8 gained a third part).
> Every symbol, line count, and law citation below was
> re-verified against that sha or carried from one of the six commissioned
> censuses (A: army lifecycle, B: settlement interior, C: diplomacy,
> D: movement/news/space, E: culture/identity, F: directive coordination),
> each of which recorded its own read provenance at d48224e3..3e2bd309.
> LIVE CODE OUTRANKS THIS TABLE: re-measure at the building commit.

Chair questions in this volume are numbered CR-WC-1.. and live in
section 6. Judgment rows minted during the build take J-WC-1.. .
Waves are WC-0 .. WC-16, grouped into four arcs (section 3).

Conventions in this document: "eff" means the eslint max-lines metric
(skipBlankLines + skipComments); the layer ceiling for src/domain is
800 eff. Punctuation is ASCII throughout; owner-directive quotations
preserve wording verbatim with typography normalized to ASCII (arrows
become "->", multiplication becomes "x", em dashes become "--"); no
wording has been altered.

---

# SECTION 0 -- OWNER INTENT AND THE LAW CHECKLIST

## 0.1 The owner's intent, verbatim

From memory/war-auxiliary-contribution-directive.md (owner, 2026-08-06,
in-chat; typography normalized, wording verbatim):

> an allied, vassalized, or occupied settlement may elect to send
> reinforcements and supplies (in the same vein as to their own army) to
> an ally's, overlord's, or occupier's army (the occupied case almost
> entirely coerced), at the cost of reinforcing their own --
> treaty-linked, creating "cost memory / charity / debt" (owner:
> "however you want to spin it, I'm just naming things"). Alternatively
> they contribute INSTEAD of fielding their own army: they have joined
> the war, but at minimum involvement -- and impact, good and bad, plus
> contributions are minimum to them as well. All of it enters STRATEGY
> (how much in vs out; relationships among all warring/hostile parties;
> own-troops-for-own-army vs supporting others; DISTANCE applies
> throughout). Allies form a mutually beneficial support network whose
> efficiency scales toward the LAWFUL side, depending on the efficiency
> of the nearest allied settlement.

The composite-armies extension (owner, same exchange, wording verbatim
in its load-bearing clauses):

> Armies become ORIGIN-TAGGED UNIT-BLOCK ROSTERS (extending the
> war-owned records the WY volume already projects -- the established
> seam pattern). THE PEOPLE LEDGER is the spine: census -> block ->
> composite army -> losses/returns/orphans -> census|defense|free-lance
> pool -- every person conserved end to end, walker-enforced;
> dissolution at war's end returns blocks home to RECONTRIBUTE to
> population and defense.

The later owner clauses this volume binds equally: realized stance
outranks declared (f); cultural scaling asymmetry (g); comradeship
between settlements that fight together (h); fission, free units, and
character drift (i); the concentration calculus and proportional
homecoming (j); brigand sieges, carrying capacity, and hop-and-shed (l);
the unified mover-absorption law (m: "They would be competing with
populations and population should have the same strategy... parking
people where they have capacity"); diaspora bonds with mortality as the
decay law (n); veterans and the next war (o); and the domestic order
dividend (p). The chair refinements R1-R9 and K1-K8 were accepted
in-chat 2026-08-06 and are binding design intent, each vetoable.

Where any clause of the directive collides with a constitutional law,
this volume PARKS the collision as a chair question in section 6 and
does not silently resolve it. Four such collisions were found; none is
resolved here by fiat (CR-WC-2, CR-WC-3, CR-WC-4, CR-WC-5). A FIFTH
collision sits INSIDE the directive itself -- mortality versus recency
as the cohort decay law, where either repair edits an owner word --
and it is parked the same way, at CR-WC-21, with both positions stated
and neither taken. A SIXTH is a collision with the BUILT TREE rather
than with a law: two live gates on the receiver-side levy sweep forbid
the directive's allied and self-deploying cases outright (1.1). This
volume routes around them rather than editing a war-layer subsystem,
and parks the question of whether they should also lift at CR-WC-22 --
again with both positions stated and neither taken.

## 0.2 The conservation constitution

This is the volume's spine and its most binding internal law.

THE PEOPLE LEDGER IS THE SPINE. A person in this volume is a COUNT, not
a name (section 6, CR-WC-2, carries the boundary argument; the model in
section 1 is written counts-first and does not change if the chair
rules otherwise, only its telemetry class does). Every count lives in
exactly one of a closed set of POOLS, carries AT MOST ONE COHORT TAG
PLUS AN OPTIONAL FREE-LANCE OVERLAY from a closed set of RESIDENCY
TAGS (the exact multiplicity law is below, and it is NOT "any number" --
an earlier drafting said that and thereby falsified its own totality
law), and moves only through a closed set of NAMED EVENTS; the
conservation walker (WC-6) enforces that no count is created or
destroyed except by a named event:

POOLS (closed, totality-exported from the people-ledger leaf). A pool
HOLDS people, and a person is counted in EXACTLY ONE pool at every
tick:

    census        settlement.population (the existing integer)
    block         an origin-tagged block inside a deployed army
                  (deployment.blocks[], extending leviedPopulationBySource)
    column        an in-transit column (the migration column ledger,
                  travelClass-discriminated; military and demographic
                  columns are ONE object class per directive (m))
    free_unit     a fissioned independent unit (spatialLedgers.freeUnits)

RESIDENCY TAGS (closed; NOT pools -- the ruling, parked vetoably as
CR-WC-20). A cohort and the free-lance roll are LABELS ON CENSUS
MEMBERS, not populations standing beside them: a veteran shed at
Thornhold is a Thornhold resident who is ALSO tagged (origin, kind).
The tag ledger (spatialLedgers.residentCohorts, 1.13.1) records
labels over census, never an addition to it:

    cohort        an origin-tagged resident cohort at a host settlement
                  ('veteran' | 'settled'); the diaspora/veteran read.
                  A PERSON CARRIES AT MOST ONE. Both origin and kind
                  are fixed at the crediting event and never re-keyed:
                  a person has exactly one origin, and `kind` records
                  HOW they arrived (under arms, or not), which is a
                  fact about a past event and cannot change afterwards.
    free_lance    the demobilized free-lance labelling: hireable
                  residents, the adventuring-class pool of (e). AN
                  OVERLAY, not a cohort: a free-lance resident may also
                  carry a cohort tag, and typically does.

TWO TOTALITY LAWS, NOT ONE -- AND THE NAMED OVERLAP. An earlier
drafting stated a single law, "sum(all tag counts) <= census", while
also letting a demobilized veteran carry BOTH a `veteran` cohort tag
(credited at `shed` / `arrive_home`) and the `free_lance` tag
(credited by `demobilize`, 1.12.5). Those cannot both be true: the
sum double-counts that person, so the WC-13 walker would red on the
volume's own designed behavior rather than on a mutant. The law is
restated as a per-tag law plus a joint bound, with the overlap named:

    LAW 1 (the cohort partition). For every settlement,
      sum over all (originId, kind) cohort rows of count
        <= census(settlement)
    Cohorts partition census because a person carries at most one.

    LAW 2 (the overlay bound). For every settlement,
      freeLance.count <= census(settlement)

    THE NAMED OVERLAP. A person counted in a cohort row MAY also be
    counted in freeLance. sum(ALL tag counts) may therefore legally
    EXCEED census, by at most freeLance.count. The joint bound is
      sum(cohort rows) + freeLance.count
        <= census(settlement) + freeLance.count
    which is LAW 1 restated, and is the reason the walker checks the
    two laws SEPARATELY rather than one sum. Any OTHER overlap is a
    defect: the walker's third arm asserts that free_lance is the only
    overlay, by construction of RESIDENCY_TAGS.

THIS RULING IS WHAT KEEPS WC-13 AND WC-15 THE SAME ARITHMETIC: a shed
credits census AND writes its tag in ONE event, so no later wave ever
moves a person from a pool into a tag (a move that would be
double-counting in one direction and an unnamed sink in the other).
The disjoint-pools alternative, with the extra events it forces, is
stated in full at CR-WC-20.

NAMED EVENTS. Two classes, both closed. COUNT EVENTS move people:
each is a debit from exactly ONE pool and a credit to exactly ONE pool
(or to a named SINK) -- never a two-hop signature. TAG EVENTS move no
people; they relabel census members or change a unit's state, and are
inert to the conservation identity. Tag events are named anyway,
because an unnamed branch is how a defect hides.

EVERY CENSUS-DEBITING COUNT EVENT CARRIES A TAG ARM. Tags are credited
by name everywhere in this volume, and an earlier drafting debited them
in exactly ONE place (`mortality`, 1.13.2) -- which left `muster`,
`dispatch` and `enlist` free to take people OUT of census while their
tag rows stood still. Two consequences, both fatal and both closed
here: sum(cohort rows) could exceed census the moment an army mustered
(LAW 1 reds on designed behavior), and -- worse -- WC-16's
field-or-garrison pin became UNPASSABLE, because veteranReads would
read the same veteran cohort whether the veterans marched or stayed,
making directive (p)'s "muster the veterans and you soften the walls,
embolden the alleys, and invite the brigands" arithmetically inert.

    THE RULE. Each of `muster`, `dispatch`, `enlist` and `mortality`
    carries, in EVENT_SIGNATURES beside its debit/credit pair, a TAG
    ARM naming which tag rows it debits and by what selection. The arm
    is part of the signature, so the walker derives its check from the
    same frozen object the movers obey (7.A.4) and a mover that debits
    census without running its tag arm reds.

    THE SELECTION IS A CLOSED VOCABULARY, NOT A PROSE CHOICE. This
    volume names three selections -- pro-rata, veterans-first, and the
    overlay-only retirement `enlist` runs -- and until this amendment
    none of them was a MEMBER of anything. There was no TAG_SELECTIONS
    export, no totality assertion, no throw-on-unknown, and no entry in
    0.3's finite-semantics compliance line, which enumerated twelve
    closed vocabularies and omitted this one; EVENT_SIGNATURES was said
    to carry "a TAG ARM naming which tag rows it debits and by what
    selection" with no stated data shape, and WC-0's LANDS row said
    "COUNT_EVENTS incl. their TAG ARMS" without ever saying what an arm
    IS. Every other vocabulary in this volume gets all three
    treatments; the first implementer of WC-0 would have had to invent
    this one, and because the walker derives its check from the SAME
    frozen object the movers obey, an invented shape becomes law
    silently. It is minted here, in peopleLedger.js, at WC-0:

        TAG_SELECTIONS = ['pro_rata', 'untag_only', 'veterans_first']

    Frozen, codepoint-sorted, totality-exported, throw-on-unknown, and
    a REQUIRED field of every CENSUS_DEBITING signature -- a signature
    whose selection name is not a member fails at MODULE LOAD, not at
    the first muster. WC-0 pins its totality and runs the
    planted-fourth-selection negative beside `untag`'s kind-totality
    pin. The mapping is fixed: `mortality` is `pro_rata`, `muster` and
    `dispatch` are `veterans_first` (which degrades to pro-rata when
    MUSTER_VETERAN_PREFERENCE is zero or no veteran row exists),
    `enlist` is `untag_only`.

    THE DEFAULT SELECTION is PRO-RATA across the settlement's tag rows
    by count, apportioned largest-remainder (the
    deploymentReturn.js:270-346 precedent), with the untagged remainder
    of census taking the balance. `mortality` uses exactly this, and
    already did.

    THE VETERANS-FIRST SELECTION (1.14.2) is the one stated exception
    and it is stated, not left to the implementer: a muster under
    MUSTER_VETERAN_PREFERENCE draws that fraction of the levy from the
    `veteran` cohort rows FIRST, apportioned across those rows by
    largest-remainder in codepoint origin order, then takes the balance
    from untagged census, and only then pro-rata from the remaining
    rows. The free_lance overlay is debited alongside for any drawn
    person who carried it (the `untag` arm below), because a resident
    under arms is not hireable.

    AND THE ARM BANKS WHAT IT DEBITED -- THE CLAUSE THAT KEEPS ORIGIN
    IMMUTABLE THROUGH A MUSTER. A tag arm does not merely subtract. Its
    debit is a per-origin COMPOSITION, and `muster` and `dispatch`
    RECORD that composition onto the block they raise
    (blocks[].drawnCohorts, 1.4.1) by the WR-8 reconstruction-
    attribution idiom this volume already binds itself to. Without that
    record, `arrive_home` has nothing to restore, and 1.13.1's rule
    that a homecoming's tag row keys on the settlement's OWN id would
    silently re-key every foreign-origin resident the town had sent out
    -- laundering an Emberford-born veteran resident of Thornhold into
    Thornhold's self-origin row on a muster-and-return cycle, against
    this section's own words ("a person has exactly one origin"). LAW 1
    still closes on that laundering because the SUM is unchanged, so
    the tag-ledger walker cannot see it: only the round trip can. THE
    ROUND-TRIP PIN (WC-16, with its WC-13 walker arm): muster then
    return leaves residentCohorts BYTE-IDENTICAL, and the
    composition-discarded mutant reds.

COUNT EVENTS:

    muster        census -> block          (levy/conscription; existing
                                            debit. TAG ARM: veterans-
                                            first per 1.14.2, else
                                            pro-rata)
    dispatch      census -> column         (an elected or levied
                                            contribution that TRAVELS:
                                            the spatial arm of 1.1.5's
                                            executor and 1.1.2's
                                            mobilization gap. TAG ARM:
                                            same selection as `muster`)
    arrival       column -> block          (a reinforcement column lands)
    depart        block -> column          (the homecoming road, leg 1.
                                            The block's banked
                                            drawnCohorts ride onto the
                                            column with the people)
    arrive_home   column -> census         (the homecoming road, leg 2.
                                            TAG ARM: it CREDITS BACK
                                            exactly the origin rows the
                                            muster debited, from the
                                            banked composition; the
                                            self-origin row takes only
                                            the untagged-census share.
                                            This is the arm that keeps
                                            origin immutable across a
                                            muster-and-return cycle,
                                            1.13.1)
    shed          free_unit|column -> census (hop-and-shed absorption;
                                            the cohort TAG is credited
                                            in the SAME event, 1.12.2)
    rejoin        free_unit -> block       (a free unit rejoins an army:
                                            1.7.3's first fate, through
                                            the shared join preference)
    enlist        census -> block          (a free-lance-tagged resident
                                            takes service in the hiring
                                            settlement's OWN roster --
                                            the veteran-pool hire of
                                            1.12.5 and 1.14.2, NOT the
                                            mercenary force market,
                                            which the owner parked.
                                            TAG ARM: `untag` of the
                                            free_lance overlay for
                                            every enlisted person, plus
                                            the cohort debit for any who
                                            carried one)
    defect        block -> block'          (a block joins another army;
                                            conserved, never a sink)
    orphan        block -> free_unit       (no home to return to; the
                                            free-lance labelling is
                                            reached ONLY through the
                                            ordinary shed road, 1.12.5)
    fission       block -> free_unit       (the composite breaks up)
    fell          block|free_unit|column -> SINK
                                           (combat, attrition, and
                                            starvation; columns die too --
                                            they are interdicted (1.3.4)
                                            and they starve on the
                                            hungrier road (1.12.3) --
                                            extending deploymentReturn's
                                            identity)
    mortality     census -> SINK           (the demographics death
                                            machinery. TAG ARM: the
                                            default pro-rata debit, in
                                            the same fold, 1.13.2)
    dm_removed    block|free_unit -> SINK  (the 7.D disposition verb: a
                                            THIRD DECLARED sink, so a DM
                                            removal is a named event and
                                            never a hole in the identity)

TAG EVENTS (no counts move):

    untag         tag -> (none), by kind   (THE ONE NAMED RETIREMENT,
                                            carrying a RESIDENCY_TAGS
                                            kind argument. kind
                                            'cohort' is naturalization
                                            -- the origin tag retires
                                            and the person stays exactly
                                            where they were already
                                            counted, the event the
                                            earlier drafting called
                                            `absorb`. kind 'free_lance'
                                            is the hireable label being
                                            consumed, which had NO named
                                            event at all: 1.12.5 and
                                            1.14.2 said "the tag is
                                            consumed in the same event"
                                            as `enlist` while 0.2's own
                                            standard says "an unnamed
                                            branch is how a defect
                                            hides". It also retires on
                                            `mortality` and on the
                                            `muster`/`dispatch` tag arms
                                            above -- three callers, one
                                            named branch.)
    demobilize    (none) -> free_lance_tag (a resident becomes hireable:
                                            the pulse of 1.12.5)
    brigand       free_unit state change   (counts unchanged)

WHY ONE `untag` AND NOT A FOURTH EVENT. A fourth member
(`absorb` plus, say, `retire_free_lance`) would have grown the closed
list to name a branch that is the same branch twice. One kinded event
keeps the list at three, is TOTAL over RESIDENCY_TAGS by construction
(a new tag cannot be added without appearing in `untag`'s kind
argument, and the walker asserts the kind set equals RESIDENCY_TAGS),
and follows the volume's own instinct at 1.12.5, where an arm was
DELETED rather than an event added. The cost is the loss of the word
`absorb` as an event name; it survives as EMBATTLED_RESOLUTIONS'
`absorption` (7.A.7), which is a different thing and no longer collides.

THE WALKER LAW: for a seeded world, at every tick,

    sum(census) + sum(blocks) + sum(columns) + sum(free_units)
      = initial total + births - fell - mortality - dm_removed

holds EXACTLY (integer arithmetic, largest-remainder rounding at every
apportionment, the deploymentReturn.js:270-346 precedent). A branch
that removes people without naming its event is a defect by
construction; the walker is written in WC-6 and every later wave adds
its events to the walker's closed event list IN THE SAME COMMIT as the
mechanism. THE TAG LEDGER CARRIES ITS OWN WALKER (WC-13), over the TWO
laws and the named overlap above: LAW 1 (cohort rows sum to at most
census), LAW 2 (the free-lance overlay is at most census), free_lance
is the ONLY overlay, tag events never appear in the people identity, a
tag write without its census credit reds, AND a census DEBIT without
its tag arm reds -- that last is the mutant class that made WC-16's
field-or-garrison pin unpassable before this amendment.
The hardest negative: a mutant that drops one count on any
branch (an unnamed sink) must redden the walker, and the walker must be
proven capable of reddening by running exactly that deletion mutant at
its own landing (the credit-side-enumeration-fails-open law: a guard
that cannot be reddened cannot be proven).

ORIGIN-TAGGED ALL THE WAY: every pool entry above census level carries
its origin settlement id. The tag is identity and is IMMUTABLE
(directive (i): "origin = identity immutable, character = state
mutable"). Attribution at every apportionment is by RECONSTRUCTION from
the banked per-source map, never by splitting an id on "." (the WR-8
law, re-affirmed as binding here).

## 0.3 The law checklist

One compliance line per constitutional law. Each line states how the
volume complies; violations are parked, never shipped.

**THE PROMISE (constitutional, amended 2026-08-05).** A seed is a
starting world forever; lived history immutable; tuning owner-signed
and versioned. COMPLIANCE: every wave lands dark behind a virtual flag
(no DEFAULT_SIMULATION_RULES entry; byte-identity idiom, census A
section 13); contribution receipts are written at arrival and never
retro-edited; all integrals (share, blend, comradeship, drift) are
event-updated accumulators, append-forward, never recomputed against
revised history; every rng draw forks a stable composite key and is
conditional-on-nontrivial (the sizingFactor idiom, warArmyRecord.js:96),
so same-seed dark worlds are byte-identical and same-seed lit worlds
are replay-exact. This volume carries the LARGEST tuning surface in the
directive family (section 3 enumerates every constant per wave); ALL of
it is raw-authored and enters proposedSoakBands.js only after owner
signature at soak, per the versioned-tuning carve-out in the blanket
sign-off (owner, 2026-08-05).

**FINITE-SEMANTICS LAW.** Typed buckets; AI is clerk, never writer.
COMPLIANCE: every vocabulary this volume mints is closed and
totality-exported: WAR_STANCE_LADDER (5), CONTRIBUTION_KINDS (2),
BLOCK_FORK_OUTCOMES (4), COLUMN_CLASSES (the widened union),
COHORT_AGE_BANDS (3), FREE_UNIT_STATES (4), EMBATTLED_RESOLUTIONS (4),
CONTRIBUTION_DELIVERY_GRADES (3, at WC-1),
CONTRIBUTION_CLOSE_GRADES (4, at WC-9 -- per HABIT's graded-close
contract), CALL_IN_ANSWERS (4), CALL_IN_OUTCOMES (3), and the people
ledger's own POOLS (4) / RESIDENCY_TAGS (2) / COUNT_EVENTS /
TAG_EVENTS. Two vocabularies COMPOSE rather than multiplying:
CALL_IN_CLOSE_GRADES is the (outcome, honour) PAIR, never a flattened
cross-product ladder (1.9.3). The
realized contribution share is a continuous internal quantity that NO
surface exposes raw: every consumer reads it through the stance band or
a prose word (directive (f) + finite semantics, jointly). Introduction
attempts, blend records, and every receipt are typed rows; no free
prose is machine-authored outside the authored sentence families each
wave ships (K7's costs clause).

**THE LOADED-DICE LAW (DESIGN_COHESION_WEAVE section H).** A flat draw
where the fiction has an opinion is a reviewable design bug.
COMPLIANCE: every fork this volume mints -- the block fork (stay /
return / defect / resist), the host rejection fork, the join-preference
choice, the repel-or-embattled contest, the buy-off decision, partial
wick-apart selection, the field-or-garrison muster fork -- samples a
situation-weighted distribution whose loading factors double as the
receipt's typed reasons. Section 1 names the weights for each fork;
section 3 pins them.

**NEWS ADDRESS LAW.** Full address chain + typed action + names +
reason. COMPLIANCE: every newsworthy beat this volume mints (the
arrival credit, the stance crossing, each homecoming and shed, brigand
arrival, host rejection, embattlement, the muster fork, the amnesty and
jubilee terms) ships with its authored sentence family in the SAME wave
as the mechanism (K7), addressed through the existing Herald routing;
covert arms (composition intelligence, espionage porosity) fail closed
UPSTREAM so no covert fact ever reaches a public composer (the ES
section 5 row 7 discipline).

**FAITH AGNOSTICISM / DEITY DOCTRINE (owner law, 2026-08-06).** Faith
is culture; the engine is never theological. COMPLIANCE: cultural
blend and introduction attempts carry faiths as CULTURE through the
existing traditions adoption machinery (src/domain/traditions/
relations.js) and bounded religionState share nudges through the ONE
existing writer (traditionsKernel's sanctioned nudge); adoption is a
contest, most attempts fail; no outcome is ever attributed to divine
action except by DM edit with attribution.

**PRODUCT SCOPE, boundary 1 (world-only; no rival adventuring
parties).** COMPLIANCE WITH A PARKED EDGE: the mercenary/adventurer
pulse (e) writes INSTITUTION presence and a free-lance COUNT pool --
background texture, never party-facing actors, never a resolved rival
party. The exact line is CR-WC-3 (chair must rule; the recommendation
is pools-and-institutions-only, force market parked as the owner
already parked it).

**PRODUCT SCOPE, boundary 2 (sub-century).** COMPLIANCE WITH A PARKED
EDGE: diaspora and veteran cohorts decay by mortality with age BANDS
sized so the whole fade is legible inside a ~100-year horizon (a 20-40
year cohort arc, not a dynastic one). CR-WC-4 carries the ruling.

**PRODUCT SCOPE, boundary 6 (the cloud-world test).** Two directive
clauses are terrain-physics claims as written: the forage radius
((i)/(l)) and campaign seasons from winter burn ((j)). COMPLIANCE: both
are re-expressed in this volume as network abstractions -- carrying
capacity is what the settlement NETWORK can feed (settlements x tier x
stores, no terrain radius), and seasonal burn rides the EXISTING
seasonal-severity abstraction (whatever a given world's seasons mean).
CR-WC-5 parks the re-expression for chair confirmation; no terrain
constant is authored anywhere in this volume.

**NEVER RESOLVE A NAMED CHARACTER'S FATE.** COMPLIANCE by
construction: retaliation against defectors' families stays
institutional leverage (directive (c)); camps and unrest stay
stressor-mediated, never dramatized (directive (m)); the people ledger
is counts (CR-WC-2). Every prose site holds this line and the sentence
families are authored accordingly.

**LEGIBILITY LAW (glance -> sentence -> table).** COMPLIANCE: the
composite army surfaces as a glance chip (who really fields this force,
by stance band), a sentence (why it holds together -- the cohesion
word + the dominant origin), and a table (the block roster: origins,
banded shares, service bands). Every derived quantity in this volume
has its three-altitude read designed in section 1 and shipped in-wave.

**GAME-GRADE UX DOCTRINE.** Formulas are translated. COMPLIANCE: the
endurance envelope, realized share, drift depth, bond strength, credit
balance all surface as WORDS AND BANDS only; the proseNumerics walker
already enforces the no-decimal pin and every new surface registers
with it. Banding is lossy: one band per clause, comparisons in words
(the lossy-banding law, re-affirmed in section 5).

**FINAL FOLD LAW (news + certification).** Every new ledger this volume
mints gets its certification row (certification/subsystemRowsWar.js
precedent, e.g. the leviedPopulationBySource row at
subsystemRowsWar.js:199) and its spatialUsage.js manifest row IN THE
LANDING COMMIT; the manifest walker reds otherwise (census C Q1/Q10).

**WR-6 COALITION PERSISTENCE LAW (warCoalitionLedger.js:5-6, verified
at HEAD).** "No membership list and no stored expenditure total is
permitted here" -- scoped to the deployment record's joinLedger.
COMPLIANCE: this volume writes NO membership list and NO expenditure
total on any deployment record. Contribution credit lives in its own
ledger as typed arrival RECEIPTS (facts, not totals); every balance is
a DERIVED read (the readCoalitionExpenditure precedent,
warCoalitionExpenditure.js). The joinLedger single-anchor guard
(length !== 1 fails closed, warCoalitionLedger.js:95) is NOT reopened:
stance is derived, not anchored (section 1.2), so no second anchor kind
is ever needed. AND WR-6's OTHER CLAUSE IS ALSO HONORED, THE HARDER
ONE: warHomeCosts.js:115-116 removes free PEER LEVIES with the comment
"a canonical ally either joins with its own army or refuses". This
volume does not reopen it. An elected SEND and a levied TAKE are
different acts -- WR-6 says an ally is not freely taken from, not that
an ally may not give -- so the auxiliary road is a new mechanism beside
the levy sweep rather than a widening of it (1.1). Whether the levy
gates should ALSO lift is CR-WC-22, and nothing in this volume waits on
that ruling.

**THE THREE-EXHAUSTIONS CONTRACT (WY seam 1; DESIGN_FP_ARCH_WY.md:72,
:1319, :1522).** Low supply drags the army's OWN accumulatedAttrition,
never the realm's warExhaustion. COMPLIANCE, one clause, vetoable as
one clause: every supply consequence in this volume (relay shortfall,
skim, envelope exhaustion, free-unit starvation) writes the affected
ARMY or UNIT's own accumulatedAttrition or its own supply fields, and
NEVER writes realm warExhaustion; realm exhaustion moves only through
the existing warHomeCosts accrual whose severity the stance rung
scales (section 1.2.4) -- a scaling of the EXISTING accrual at its
existing write site, not a new writer.

**THE ONE-MOUTH LAWS.** razingSiegeEmission stays single-import;
applyRelationshipPatch stays the relationship plane's one writer;
advanceObligationDecay stays the one unconditional decay owner (every
mutation mover passes decayPerTick: 0); treatyEnforcement.treatyLedgerOf
stays the one treaty entry point. COMPLIANCE: this volume adds
consumers, never second mouths; each new writer it mints (the
contribution ledger, the cohort ledger, the free-unit ledger) is itself
declared single-writer with a source-scan fence in its landing wave.

---

# SECTION 1 -- THE MODEL

The full causal architecture. Each subsection names the mechanism, its
inputs and outputs, the existing surface it extends (census-verified),
its receipts, and its three-altitude read. Section 2 maps mechanisms to
modules; section 3 cuts them into waves.

## 1.1 Contribution credit: the arrival ledger (R1)

THE SENDER-ELECTED CONTRIBUTION IS A NEW ROAD, NOT A WIDENING OF THE
LEVY SWEEP. This is the single most load-bearing correction in the
volume and it is stated first, because an earlier drafting built the
whole ledger on `deployment.leviedPopulationBySource` as "the
origin-tagged precursor that already exists" and thereby inherited a
receiver-side sweep that cannot carry the owner's spine. MEASURED AT
3e2bd309, four facts, each verified:

1. THE DEPLOYER EXCLUSION. warHomeCosts.js:391 builds the exclude set
   as `new Set([...targets, ...Object.keys(deployments).map(String),
   ...leviedThisTick])`. ANY settlement fielding its own army is
   excluded from levy. That makes this volume's own `belligerent` rung
   (1.2.2: minority share AND an army of its own) and the directive's
   core strategy tension ("own-troops-for-own-army vs supporting
   others") STRUCTURALLY UNREACHABLE through the levy surface.
2. THE WR-6 PEER-LEVY REMOVAL. warHomeCosts.js:115-116 reads
   `if (coalitionLit && relState.relationshipType !== 'vassal')
   continue;`, with the in-file comment "WR-6 removes free peer levies:
   a canonical ally either joins with its own army or refuses." With
   the coalition layer lit, the ALLIED arm of the owner's verbatim
   spine ("an ALLIED ... settlement may elect to send reinforcements
   ... to an ALLY's ... army") and the `auxiliary` rung ("her blocks
   serve under another party's banner") have NO live road at all
   through the sweep.
3. NO OCCUPATION EDGE. LEVY_SUPPORT_TYPES (warHomeCosts.js:79) is
   `new Set(['vassal', 'allied', 'ally', 'defensive_pact'])`. There is
   no occupation edge in it, so the occupied -> occupier arm has no
   road through the sweep either; coercive requisition reads the
   occupation ladder instead (1.17).
4. THE PRECEDENT ROW SAYS THE OPPOSITE OF WHAT IT WAS CITED FOR. The
   certification row this volume cites as its own precedent records the
   mechanism as DEAD: subsystemRowsWar.js:55 states that "war_levy
   fires ZERO times in every case while its siblings fire", and the row
   at :196/:202 is titled MEASURED SILENT -- LEVY_POP_RATE_PER_TICK
   0.004 (:80) against LEVY_POP_FLOOR 300 (:81) means a source under
   roughly 550 people levies nobody at all, and every one of the seven
   completed release cases reads war_levy exactly zero.

WHAT FOLLOWS FROM THIS. The elected contribution is its OWN mechanism
with its own chooser (contributionMoves.js, WC-4), its own executor
(contributionDispatch.js, 1.1.5), and its own admission set (below).
leviedPopulationBySource is borrowed for its SHAPE and for
conservation reconciliation only -- it is the origin-tagged MAP this
volume's blocks[] must reconcile against (1.4.1) -- never for its
eligibility rules, never for its write path, and never as evidence
that the road already exists. Nothing in this volume is authored
against the levy sweep's corpus behavior, because that behavior is
measured absent.

THE ADMISSION SET FOR A SENDER-ELECTED CONTRIBUTION, enumerated
against the LIVE relationshipType vocabulary and the LIVE occupation
ladder, and deliberately NOT the levy sweep's:

    ALLIED / ALLY / DEFENSIVE_PACT   an elective send to a coalition
                                     partner's army. ADMITTED WHETHER
                                     OR NOT THE SENDER FIELDS ITS OWN
                                     ARMY -- that is the whole strategy
                                     tension, and it is exactly what
                                     the deployer exclusion forbids in
                                     the sweep.
    VASSAL (junior -> senior)        an elective send to the overlord's
                                     army, above and beyond any
                                     coerced requisition (1.17's
                                     overshoot).
    OCCUPIED (the occupied ->        admitted through the occupation
    the occupier)                    ladder, never through a
                                     relationship edge: occupation.js's
                                     STATE_LADDER (:117,
                                     ['contested', 'unstable',
                                     'extractive', 'stabilized',
                                     'vassalized'] -- verified) is the
                                     authority, per 4.4's one-authority
                                     rule. The occupied case is
                                     "almost entirely coerced" (owner):
                                     the elective arm is the OVERSHOOT
                                     of 1.17, not a free election.
    PATRON                           EXCLUDED, following the sweep's
                                     own reasoning at
                                     warHomeCosts.js:76 ("you levy
                                     subordinates"): a patron edge is
                                     the wrong direction for an
                                     obligation this volume prices as
                                     the junior's choice.

TWO GATES ARE NOT THIS VOLUME'S TO LIFT. The deployer exclusion (fact
1) and the WR-6 peer-levy removal (fact 2) are load-bearing gates for
two of the five stance rungs, and lifting either is a WAR-LAYER
BEHAVIOR CHANGE on a built subsystem. This volume routes AROUND them
by minting its own road rather than editing theirs, and raises the
question of whether they should also be lifted on the levy side as
CR-WC-22. If the chair rules they stay, nothing in this volume moves;
if the chair rules they lift, that is a separate war-layer wave with
its own golden record, not a WC wave.

### 1.1.1 The object

A contribution is a typed, conserved transfer from a sender settlement
to a receiver party's army, per war, written AT ARRIVAL and never at
pledge or dispatch. Two kinds, closed:

    CONTRIBUTION_KINDS = ['troops_lent', 'supplies_delivered']

The working ledger is a new spatial ledger, drop-when-empty:

    spatialLedgers.warContributions = {
      '<fromId>><toId>': {            // directed pair key, the
                                       // reasonPairKey spelling (a>b)
        '<warAnchorKey>': {            // targetId + sinceTick of the
                                       // SUPPORTED DEPLOYMENT: a
                                       // receipt is about a specific
                                       // army a specific column or
                                       // shipment reached. NOT the
                                       // stance key -- stance derives
                                       // per WAR EPISODE
                                       // (originAttackerId +
                                       // originSinceTick, 1.2.2), and
                                       // anchors NEST under episodes
          troopsBand,                  // banded, event-updated
          suppliesBand,                // banded, event-updated
          firstArrivalTick,
          lastArrivalTick,
          arrivalsCount,               // integer, capped at
                                       // CONTRIBUTION_ARRIVALS_CAP
          shortfallBand                // relay skim + interdiction losses,
                                       // banded; the grievance fact
        }
      }
    }

No raw amounts persist on this record beyond the conservation
arithmetic needs of the writer: the PHYSICAL quantities are conserved
by the systems that move them (people by the people ledger, grain by
the treaty-transfer / commodityFlow stock seams), and the credit record
is the banded MEMORY of those conserved transfers. Bands are authored
in this volume's tuning table and owner-signed at soak.

### 1.1.2 The arrival law, and what "arrival" is

Credit is written at the moment of EFFECT, never at pledge:

- SPATIAL WORLDS: troops-lent credit is written when the reinforcement
  column's arrivalTick fires and the headcount is banked into the
  receiving army's record; supplies-delivered credit is written when
  the shipment arrives at the army (WY F9 supplyCargo road when built;
  the supplyShipments link arrival before then). The arrival edge is
  detected by the kernel that steps the column (the
  releaseMigrationArrivals / hasArrived transition), the one existing
  first-arrival precedent being vassalizationOutcomes' arrivedThisTick
  set (census A section 14) -- this volume mints the army-side twin of
  that edge-detector, in the mover kernel, once.
- ASPATIAL WORLDS: there is no transit ledger and effect is immediate
  (the existing levy model banks at muster). Credit is written at the
  bank. The LAW is therefore stated as effect-time, which degrades
  gracefully: aspatial effect-time IS muster-time. This answers census
  A open question 3 without inventing an arrival event where no
  movement exists. Pinned both ways (section 3, WC-1 pins).
- THE MOBILIZATION/ARRIVAL GAP (census F hazard, verified: the live
  levy write is warHomeCosts.js:443-450, at mobilization). READ THIS
  BULLET AGAINST 1.1's estate truth: the gap is a SHAPE lesson, not an
  inherited road. This volume's own dispatched contributions (1.1.5)
  bank at arrival under compositeArmiesEnabled with a spatial canon.
  The RECEIVER-SIDE LEVY SWEEP's bank moves the same way IF it ever
  fires -- it is measured silent on the whole completed release corpus
  (subsystemRowsWar.js:55, :202), so the sweep's arm of this shift is
  pinned on a CONSTRUCTED fixture that forces a levy, never asserted
  against the seeded corpus, and no wave's value depends on it. Dark
  and aspatial behavior is untouched. The PEOPLE take the two-event road
  census -> column (`dispatch`) then column -> block (`arrival`), both
  named in section 0.2: a levy that travels is never an unnamed census
  outflow, and the aspatial world's single `muster` debit is the
  degenerate case where the two events collapse into one tick. This is
  a lit-only behavior shift, declared in WC-6's alignment line, never
  silent.

An interdicted or skimmed shipment that never arrives writes NO credit;
it writes shortfallBand instead. The shortfall is itself a receipt (the
grievance fact R4 needs) and the conservation identity still closes:
debited = delivered + consumed-en-route + skimmed + destroyed, every
term named (section 1.3.3).

### 1.1.3 The close fold: from working ledger to durable memory

At war termination (the existing readWarTerminations close, which the
contribution writer consumes, never re-derives), the working record for
that war folds into TWO durable homes and then drops:

1. THE EDGE ARCHIVE: one exact-once row per (pair, war) appended to a
   FOURTH bounded per-edge archive beside turningPoints, allianceCalls,
   and coalitionSettlements. THE ESTATE IDIOM, RE-MEASURED AT HEAD:
   there is no `appendExactOnce` helper anywhere in src/ (the earlier
   drafting of this paragraph named a function that does not exist).
   relationshipState.js (478 lines) carries THREE separate appenders --
   appendRelationshipAllianceCall (:189),
   appendRelationshipCoalitionSettlement (:273),
   appendRelationshipTurningPoint (:294) -- each with its own frozen cap
   (RELATIONSHIP_TURNING_POINT_CAP :136,
   RELATIONSHIP_ALLIANCE_CALL_CAP :141,
   RELATIONSHIP_COALITION_SETTLEMENT_CAP :145; all 24), and exact-once
   is carried by a SEPARATE recorded-action predicate,
   coalitionSettlementActionWasRecorded(state, actionId) (:266), which
   callers consult before applying a value-moving action -- it is not a
   property of an append helper. This volume follows that shape
   verbatim, minting three symbols where the estate has three:

       appendRelationshipContributionClose(state, raw)
                     the appender, modelled on :273 line for line
                     (normalize, dedupe on the close id, re-normalize)
       contributionCloseWasRecorded(state, closeId)
                     the exact-once predicate, modelled on :266
       RELATIONSHIP_CONTRIBUTION_CLOSE_CAP = 24
                     a NEW frozen cap beside the three

   keyed `contribution_close.<from>.<to>.<warAnchorKey>`, carrying
   {kinds, troopsBand, suppliesBand, shortfallBand, deliveryGrade} at
   WC-1 and gaining {grade} at WC-9, when the last of the four
   CONTRIBUTION_CLOSE_GRADES inputs finally exists (7.A.3). BOTH the
   appender AND the predicate are in the WC-1 lands list: in this
   estate exact-once is a second function, never a property of the
   first. The row is closed, persistence-safe, and is what the Herald
   and the doctrine page read years later.
2. THE OBLIGATION DEPOSIT: a war_contribution obligation minted through
   the EXISTING obligations sub-ledger (generosityReactions.js's
   obligationKey/foldObligations family, kind 'war_contribution'),
   inheriting the single decay owner (advanceObligationDecay), the cap,
   EPS pruning, and at-most-one-per-(pair,kind). This is the DEBT.
   Comradeship (section 1.6) is the FRIENDSHIP, on its own clock --
   the two-clock answer census C question 6 anticipated, adopted here
   deliberately: "obligation is the DEBT, the bond is the FRIENDSHIP;
   they decay on different clocks and that difference is the drama."

Credit therefore has EXITS from birth (K8): obligations decay; the
forgiveness road, the debt-to-vassalage conversion, and jubilee are
section 1.10.

### 1.1.4 What credit feeds

- Treaty-compliance grading: an unpaid call-in against live credit
  reads as breach-grade through the existing treatyBreach machinery
  (a consumer, not a new writer).
- Call-in rights (SECTION 1.9, the call-in errand -- the earlier
  drafting of this line pointed at 1.8, which is the brigand-siege
  section; R7 had no model section at all until this amendment): the
  request record's expectation, the answer fork's weight, and the
  two-axis graded close all read the balance.
- The peace table (section 1.2.4): terms weight scales with credit.
- The Herald: arrival and close beats, addressed.
- Believed doctrine (section 1.11): closes feed the reliability page.

Three-altitude read: GLANCE a credit chip on the relationship surface
(banded, one word); SENTENCE "Emberford's grain fed Thornhold's siege
lines through the winter; the debt stands"; TABLE the per-war rows from
the edge archive.

### 1.1.5 The elected dispatch: the chooser, the executor, the reservation

WC-4 lands the CHOOSER (contributionMoves.js: the three strategist
moves and their weights). Until this amendment the volume named no
EXECUTOR anywhere -- nothing turned a chosen `send_reinforcements_to`
into a people-ledger event, nothing said where it sat in pulse order,
and the owner's own cost clause ("at the cost of reinforcing their
own", "how much in vs out") had no arithmetic. An implementer could
not build WC-4 without asking. All three are stated here.

THE EXECUTOR IS ONE LEAF, contributionDispatch.js (2.2), and it is the
ONLY writer that turns a chosen move into a named count event. It is a
leaf re-exported through the warDeployment.js:158-162 block (the
thin-head rule of 2.1), so warDeployment.js gains no logic.

THE CALL SITE, NAMED. warDeployment.js:1263 calls applyHomeWarCosts
under the in-file comment "Steps 5 + 5b -- WHAT THE WAR COSTS THE
HOME" (verified at HEAD). The elected dispatch is STEP 5c: immediately
AFTER applyHomeWarCosts returns and BEFORE the tick's return
statement. That order is not arbitrary and is pinned:

- AFTER the home costs, because the sender's own conscription and any
  coerced requisition are charged first: an election spends what is
  left, never what is already owed.
- BEFORE the column stepper (armyTransitKernel /
  releaseMigrationArrivals), so a column dispatched this tick is
  stepped for the first time NEXT tick and can never arrive on its
  dispatch tick -- which is what makes 1.1.2's arrival-not-dispatch pin
  non-vacuous in a spatial world.
- The chooser (contributionMoves.js) is a pure read consulted by the
  executor at that one site; the strategist never writes.

EACH MOVE, BOUND TO ITS NAMED EVENTS. No move has an unnamed branch:

    send_reinforcements_to   ASPATIAL / no composite roster: `muster`
                             (census -> block) crediting the RECEIVER's
                             leviedPopulationBySource row for the
                             sender's origin -- effect-time is
                             muster-time, so the credit writes here
                             (1.1.2). SPATIAL + compositeArmiesEnabled:
                             `dispatch` (census -> column, travelClass
                             `reinforcement_column`, 7.A.8) and then
                             `arrival` (column -> block) at the
                             receiving army, which is where the credit
                             writes. The two arms are the SAME rule
                             stated at effect time; the aspatial arm is
                             the degenerate case where both events fall
                             in one tick.
    send_supplies_to         no people event. A stores consignment
                             through the relay (1.3), whose identity is
                             the STORES identity of 1.3.3; credit at
                             shipment arrival.
    recall_support           no people event of its own. It CLEARS the
                             sender's standing reservation from the
                             next tick forward and stops future
                             dispatches; blocks already serving return
                             by the ordinary road (`depart` +
                             `arrive_home`, 1.5.2's `return` shape) and
                             banked credit STANDS -- lived history is
                             not clawed back (WC-4 already states this;
                             it is repeated here because the executor
                             is where it is enforced).

THE RESERVATION ARITHMETIC -- the owner's "at the cost of reinforcing
their own", made a number. A settlement's per-tick mustering capacity
is the quantity the home-cost pass already computes for its own
conscription (`capacityFor`, threaded into applyHomeWarCosts at
warDeployment.js:1263, verified). An accepted
`send_reinforcements_to` writes a RESERVATION on the sender:

    reservedFraction   a banded fraction of the sender's own per-tick
                       muster capacity, held for RESERVATION_HORIZON
                       ticks; the sender's OWN muster in those ticks
                       draws against capacity x (1 - sum of live
                       reservedFractions), floored at zero
    cap                sum of a sender's live reservedFractions is
                       clamped at CONTRIBUTION_RESERVATION_CAP (< 1.0),
                       so a settlement can never reserve itself into
                       fielding nothing: over-commitment is a choice
                       with a floor, not a suicide switch
    release            `recall_support` clears the sender's live
                       reservations from the next tick; a reservation
                       also lapses on its own horizon, and the lapse is
                       silent (no beat -- a promise that simply ran out
                       is not news)

The reservation is bounded state on the contribution ledger,
drop-when-empty, and it is NOT a people pool: it reserves CAPACITY,
never headcount, so it appears in no conservation identity. That is
deliberate -- a reserved soldier who has not marched is still a
resident, counted in census exactly once.

THE WAVE ORDER, STATED. The executor lands at WC-4 with its ASPATIAL /
non-composite arm only (the `muster` road and the reservation), because
WC-4's dependency is WC-2 and the block roster does not exist until
WC-6. Its SPATIAL arm (`dispatch` -> `arrival`, the reinforcement
column) lands at WC-6 in the same commit as the arrival-edge detector.
Both arms use the event signatures frozen at WC-0, so WC-6's
conservation walker covers WC-4's events the day it lands without a
migration -- and WC-6's walker landing is the first commit in which
those events are PROVEN conserved, which WC-4's alignment line says in
terms.

## 1.2 The war-stance ladder, derived (R2 + f)

### 1.2.1 The vocabulary

    WAR_STANCE_LADDER = ['neutral', 'materiel', 'auxiliary',
                         'belligerent', 'principal']

Closed, codepoint-stable order is NOT the semantic order; the ladder is
exported in semantic order with an accompanying rank map (the
TAP_DEPTH lesson, espionageMath.js: rank by the map, never by array
index). This is a ROLE ladder, not an intensity ladder: the estate's
frozen intensity vocabulary {quiet, present, pressing, decisive} is not
touched, not shadowed, and not borrowed for stance (section 5.2).

### 1.2.2 Derivation, never declaration

There is NO persisted stance field (CR-WC-6 confirms; the
recommendation is pure-derived).

THE STANCE IS KEYED PER WAR EPISODE, NOT PER DEPLOYMENT -- THE
AGGREGATION RULE, STATED. An earlier drafting keyed warStanceOf on the
credit record's `warAnchorKey` while every consumer read "the war",
which produced three defects at once: a party in a war with two
coalition deployments carried TWO rungs; the WC-2 totality pin ("every
party in every seeded war maps to exactly ONE rung") was unsatisfiable
as written; and a coalition partner fielding a large SEPARATE army had
share ~0 of an anchor it did not serve in and could therefore NEVER
read `principal` however much force it fielded -- which inverts the
whole purpose of directive (f). The rule is now stated once:

    warEpisodeKey     `<originAttackerId>:<originSinceTick>` -- THE
                      ESTATE'S OWN war-episode identity, not a mint.
                      Every coalition join anchor already carries
                      originAttackerId + originSinceTick, and
                      warCoalitionLedger.js reasons over exactly this
                      pair (the originEpisodes construction at :230-243
                      and the 'origin_episode_dissolved' verdict at
                      :285 -- both verified at HEAD).
    warAnchorKey      targetId + sinceTick of the SUPPORTED deployment.
                      UNCHANGED, and still the credit record's key: a
                      receipt is about a specific army that a specific
                      shipment or column reached. Anchors NEST under
                      episodes; the anchor -> episode map is derived
                      from the deployments' targets and their join
                      anchors, never stored.

    warStanceOf(worldState, partyId, warEpisodeKey)

REALIZED SHARE IS DEFINED OVER THE EPISODE'S SIDE, NOT OVER ONE
ROSTER. For a party P in episode E, let S be the side P's people serve
(P's own coalition). Then

    share(P, E) = time-integral of
                    (headcount originating from P deployed on side S)
                  / (total headcount deployed on side S)
                  over the episode's span

summed across EVERY deployment on that side -- P's own army and every
foreign roster P's blocks serve in, one denominator. That is the
quantity directive (f) prices ("realized share ... time-integrated"),
and it is the only definition under which a big separate army and a
big lent contingent are commensurable, which is the comparison the
whole ladder exists to make.

SHARE IS THE PRIMARY KEY AND OWNERSHIP IS THE SECONDARY ONE. No
declared label appears anywhere in the derivation:

    principal    the MAJORITY episode-share contributor to its side --
                 OWNER OR REINFORCER ALIKE. Ties break toward the
                 holder of the side's ORIGIN ANCHOR (originAttackerId
                 for the offensive side, the defender for the
                 defensive). THERE IS NO ORIGINAL-DECLARER DISJUNCT.
    belligerent  fields troops in the episode at MINORITY share AND
                 fields an army of its own (its own deployment or a
                 joinLedger anchor) -- this is where the nominal owner
                 lands when it falls below majority, and where the
                 war's original declarer lands when its own
                 contribution thins
    auxiliary    fields troops in the episode at minority share WITHOUT
                 an army of its own: its blocks serve under another
                 party's banner (troops_lent credit live for this
                 episode)
    materiel     no troops in the episode at all; supplies_delivered
                 credit is live for it
    neutral      none of the above

NO-MAJORITY IS A REAL CASE AND THE LADDER COVERS IT. A three-way split
(0.40 / 0.35 / 0.25) leaves the episode's side with NO principal, and
that is a legal, pinned state, not a hole: all three parties read
`belligerent` (or `auxiliary`, by ownership), the side has no majority
voice at the peace table, and the terms weights divide by share exactly
as they would otherwise. The totality pin is written accordingly --
every party maps to exactly one rung, and AT MOST one principal per
side per episode, never AT LEAST one.

Ownership separates belligerent from auxiliary and breaks the principal
tie; it never outranks share. THE DELETED DISJUNCT IS THE POINT: an
"original declarer with a fielded army" clause is a DECLARED LABEL, and
a declared label in this table would make every declarer permanently
un-crossable -- buying principal standing once, at declaration, and
then shielding it by contributing nothing. Directive (f) forbids
exactly that ("never from a declared label"), and the declarer who has
drifted below majority is not an exception to mission creep but its
sharpest case: the war he started is now someone else's war, and the
crossing beat says so on both sides of the ledger.

Realized share is TIME-INTEGRATED (directive (f)) and accumulated at
TWO altitudes from ONE arithmetic: the per-roster integral above
(origin headcount / army headcount, the quantity blocks[].shareIntegral
carries and the one the blend and drift laws of 1.6 read) and the
per-EPISODE integral defined above (origin headcount / side headcount),
which is what warStanceOf reads. Both are maintained as event-updated
accumulators (updated at muster, dispatch, arrival, loss, fork,
fission -- the named people-ledger events -- never per tick, per K7),
and the episode accumulator is the roster accumulators summed over the
side's rosters at each event, never a second independently-advanced
quantity that could disagree. A reinforcer
whose integrated share crosses majority IS the principal: casus
exposure, terms weight, spoils, and exhaustion all re-derive from the
same read, so priced shielding is un-gameable by construction. THE
SWAP IS PINNED ON BOTH PARTIES (WC-7): the fixture is a reinforcer
crossing 0.50 against a DECLARER-OWNER, and it asserts that the two
rungs EXCHANGE at the same read -- the reinforcer to principal, the
declarer-owner to belligerent -- and that all four scalars (exhaustion,
casus exposure, terms weight, spoils) re-derive from that one read for
both parties. The crossing is edge-detected (previous band != current
band) and emits the mission-creep beat, addressed.

The raw share is never surfaced; every consumer reads the band.

### 1.2.3 The enemy reads its BELIEF of the share

The enemy's casus and terms reads take the share as BELIEVED, lagging
at news speed: the composition fact travels the existing rumor/belief
road (a composition news entry at each crossing, hop-worn per
degradeTelling; the belief consumer reads reportsBySubject /
believed-record machinery, census D section D). The update moment --
the enemy court learns who really fields the force -- is itself a
beat. Army-composition intelligence is an ES tap PRODUCT (a new
product, never a new tap level; TAP_LEVELS is closed at three, census
D section G): spies count banners (section 4.3).

### 1.2.4 What scales by rung

ALL FOUR CONSUMERS READ THE EPISODE RUNG, not a per-anchor one: each
takes (partyId, warEpisodeKey) and gets back exactly one rung (1.2.2).
Where a consumer holds only an anchor -- the credit fold, the terms
read -- it resolves the anchor to its episode through the derived map
before asking. A consumer that asks per anchor is a defect, and the
WC-2 source scan says so.

All three quantities below, in both directions, each at its EXISTING
write or read site, never a new writer:

- EXHAUSTION: warHomeCosts' accrual severity for the contributing home
  scales by its rung (materiel accrues a small fraction of a
  principal's EXHAUSTION_ACCRUE_PER_TICK share; the scaling multiplies
  the existing accrual at its existing site). The army-side supply
  consequences stay on accumulatedAttrition per the three-exhaustions
  clause (section 0.3).
- CASUS EXPOSURE: the enemy's grievance against a contributor scales by
  the contributor's BELIEVED rung: warFactorForCasusRead's read gains a
  stance multiplier. NO NEW CASUS TYPE IS MINTED by this volume:
  materiel-is-joining is expressed as scaled exposure on the EXISTING
  reason taxonomy, so warTermination.js (frozen at 818 eff, shrink-only)
  and the six-surfaces registration cost are never touched. If a later
  wave finds a genuine new grievance kind, it pays the full six-surface
  price in warTerminationCauseTables.js, not here (census A section 11).
- SPOILS AND TERMS WEIGHT: coalitionShares (peaceTermsCoalition.js:261,
  verified) today splits by current strength "by contribution" in name
  only. Under contributionLedgerEnabled it splits by CONTRIBUTION
  (integrated share for troops + banded supplies weight); dark, the
  strength split is byte-identical. This is a lit-only behavior shift,
  declared in WC-2's alignment line and recorded once (CR-WC-7 carries
  the golden-shift note). Priced shielding (R8) falls out: minimal
  involvement = minimal terms weight = safety at the cost of
  irrelevance, self-balancing.
- K5, ONE PEACE-TABLE SEAM: credit + realized stance + comradeship
  compose into a SINGLE terms-weights read (one exported function, one
  consumer chain into peaceTermsAppraisal), never three separate
  adjustments that could disagree.

Three-altitude read: GLANCE the stance word on the war chip; SENTENCE
"Millbrook has joined the war in materiel only; the grievance against
her is the weaker for it"; TABLE the per-party stance rows in the war
document.

## 1.3 The lawful relay and the chaotic skim (R4)

### 1.3.1 Composition, not invention

The relay is a COMPOSITION of three existing substrates (census D
section F), forking none of them:

1. ROUTING: candidateRoutes / shortestPath (distanceRead.js) pick the
   staging path -- deterministic Dijkstra, memoized, blocked-edge
   aware.
2. STAGING: the entrepot machinery (entrepots.js) is the only earned
   staging surface in the tree; auxiliary logistics stage through the
   NEAREST allied settlement on the path, and those crossings enter
   stepEntrepot's existing crossing accounting (relay traffic builds
   real entrepots -- the mutually-beneficial network the owner named,
   emergent).
3. LINKS: supplyShipments' link chain (rankSupplySources -> pickSource
   -> stepSupplyLink) carries the goods; interception rides its
   existing routeIntercepted surface.

### 1.3.2 Law-band efficiency

PER-HOP EFFICIENCY READS THE PARTICIPANTS' LAW BANDS, NOT THE
STAGER'S ALONE. Directive R4 is verbatim on this -- "per-hop efficiency
reads the PARTICIPANTS' law bands" -- and an earlier drafting read only
"the STAGING settlement's law band", which silently exempted a lawless
SENDER and a lawless RECEIVER from contributing anything to loss or
skim. The composition rule, stated:

    hopLawWord = WORSE-OF( lawWordFor(sender),
                           lawWordFor(stager),
                           lawWordFor(receiver) )

-- the worse-of discipline the estate already uses for security reads
(security01Of: take the worse of stored and live, never blend; census B
question 5, cited in 5.5 and honored here for the same reason). Blending
three law words would invent a fourth vocabulary; ordering them and
taking the worst does not. THE SKIM STILL BELONGS TO THE STAGER: the
worse-of word decides WHETHER a hop skims and how much it loses, but a
diverted consignment goes into the stores of the settlement that
physically handled it, so a lawless sender does not steal from itself
at a lawful barn. Where a hop has no distinct sender or receiver (the
first and last legs), the missing participant simply drops out of the
worse-of.

The law word itself comes from lawWordFor (lawWord.js:71, verified; the
estate default edges 0.67 / 0.33 unless the chair signs a
program-specific pair, the espionage J-ES-10 precedent -- CR-WC-8(i)),
and the three-word vocabulary is:

    lawful    standing compacts: low loss, no skim
    balanced  modest loss, no skim
    lawless   ad-hoc: higher loss PLUS skim -- a diverted fraction
              credited to the staging settlement's OWN stores (visible
              as theft: the transfer is real and readable, census D
              question 6's "credit to the skimming settlement" arm,
              chosen deliberately) and booked as shortfallBand on the
              contribution record (the grievance fact)

If the chair prefers a STAGER-ONLY read after all, that is a deliberate
NARROWING of an owner clause and is ruled at CR-WC-8(iii), never by
silence -- the same standard 1.3.2 applies to the comradeship term one
paragraph below.

AND A COMRADESHIP TERM. Directive (h) names relay efficiency as one of
comradeship's four consumers in so many words ("written into the
EXISTING relationship machinery, so it immediately feeds caravan
density (the WY law), alliance odds, call-in answer weights, and relay
efficiency"), so per-hop efficiency is NOT law-band-pure: the hop's
loss fraction is reduced by the comradeship banked on the
sender/stager edge, capped at RELAY_COMRADE_BONUS (7.B). Comrades run a
tighter road -- the men at the staging barn served together, and the
consignment loses less. THE SEAM: the term enters at WC-9, when the
comradeship integrals first exist; WC-3 lands the read with the term
present and NEUTRAL (zero bond = today's arithmetic exactly), which is
also what makes the WC-9 pin possible -- an identical relay run
between comrades and between strangers, strictly ordered. If the chair
prefers a law-band-pure relay, that is a deliberate NARROWING of an
owner clause and is ruled at CR-WC-8, not by silence.

There is ONE law-band modulation table for the whole program family
(HABIT r16's learning curves, relay efficiency, block cohesion, and
drift expression all read the same three-word vocabulary through one
frozen table of curves) -- the C3 collision, resolved by contract in
section 4.1: one dependency-free leaf, minted once, by whichever volume
builds first.

### 1.3.3 The two relay conservation identities

STORES AND PEOPLE DO NOT SHARE AN IDENTITY. The fork is stated here
because CONTRIBUTION_KINDS carries both kinds and 1.1.2 routes both
through transit, and because every term of the identity below is a
STORES term. For every dispatched STORES consignment:

    debited(sender stores)
      = arrived(army credit) + consumed(carriage cost)
        + skimmed(staging settlement stores) + destroyed(interdiction)

Every term is a named bucket on the shipment record (taught to the
arrive-loop rebuild IN THE SAME COMMIT as the stamp -- the
commodityFlow.js:558 smuggle:true loss class, section 5.7), and the pin
runs through at least one in-transit tick, never save/load only.

For every dispatched TROOP column the identity is the people ledger's,
and nothing else:

    dispatched(census debit)
      = arrived(block credit) + fell(the named sink)

TROOP COLUMNS ROUTE, BUT THEY NEITHER STAGE NOR SKIM. They take the
same road graph, the same blocked edges, and the same interdiction
exposure as the goods (1.3.4) -- distance is exposure for both -- but a
settlement cannot bank borrowed soldiers into its stores, so no hop
applies RELAY_LOSS_BY_BAND or RELAY_SKIM_FRACTION to a headcount. A
skimmed soldier would be an unnamed sink wearing an economic word, and
an unmodelled desertion/impressment event this volume has not
designed. PER-HOP ATTRITION ON A MARCHING COLUMN IS THEREFORE ZERO
HERE: a column loses people only to interdiction and to starvation,
both of which are the named `fell` event with their own resolvers and
their own receipts. WC-3 PIN: no relay hop changes a column's
headcount except through a named event -- the per-hop-loss-on-people
mutant reds this pin AND the conservation walker.

### 1.3.4 Interdiction (R3)

Auxiliary supply travels real wayfare roads and is a legitimate target.
Physical interdiction is WY's encounter-table instrument (the E14
army x caravan seizure row and, from this volume, the new rows E16
brigand x settlement and E17 column x host -- each row added IN THE
SAME COMMIT as its resolver, moving the table's anti-vacuity count by
one, per WY section 4's closed-table law). supplyWebWarfare's
interdiction stays the PRESSURE instrument it is; the twin-note in both
files is the established remedy (census F section 5). Distance =
exposure = physics: a longer relay is more interdictable because it
crosses more hops -- no new exposure constant, just the road.

## 1.4 Composite armies: the block roster (a)

### 1.4.1 One army, one record, blocks within

The one-army law SURVIVES (census A question 1, resolved as option
(a)): an army remains ONE deployment record keyed by its home
settlement id. Composite-ness is a conditional roster field whose
SHAPE follows the origin-tagged map that already exists
(deployment.leviedPopulationBySource, warHomeCosts.js:443-450,
verified). BORROWED FOR SHAPE AND RECONCILIATION, NOT FOR ROAD: per
1.1's estate truth, the levy sweep that writes that map admits neither
a self-deploying sender (the :391 exclusion), nor a lit-coalition peer
(the :115-116 WR-6 clause), nor an occupation edge (:79), and is
MEASURED SILENT on the completed release corpus. blocks[] therefore
reconciles to the map wherever the map has rows, and is filled by THIS
volume's own arrival road (1.1.5) wherever it does not:

    deployment.blocks = [ {
      originId,          // immutable identity
      headcount,         // integer; the conservation quantity
      joinTick,
      shareIntegral,     // event-updated accumulator (1.2.2)
      blend,             // banded, event-updated (1.6)
      driftBand,         // banded, hysteresis-expressed (1.6.3)
      cohesionWord       // law-band derived (1.5.2)
    } ]

drop-when-absent (the conditional-stamp idiom: a world without
composite armies is byte-identical). leviedPopulationBySource remains
the conservation map and blocks[] must always reconcile with it exactly
(a reconciliation pin, WC-6); the two are one quantity in two
projections, and the roster never becomes a second source of truth for
headcount. normalizeDeployments gains a fail-closed blocks[] arm IN THE
SAME COMMIT (census A hazard 3: an unvalidated persisted array is a
save-file smuggling surface).

armyTransit projection: the transit record gains the same conditional
blocks projection under the WY seam pattern (a new conditional field on
an existing war-owned record = one row in the owner's field-batch
table, C4; CR-WC-9 asks the owner to sign the batch as one table, the
WY section 2a precedent).

Free units (1.7) are the ONE exception to army-keyed records: they
belong to no settlement, so they get their own ledger and a minted
composite key -- they do not violate the one-army law because they are
not armies fielded by anyone.

### 1.4.2 The people-ledger join

The people ledger is NOT a new monolithic structure. It is the JOIN of
the pools in section 0.2, each of which is an existing structure or a
this-volume extension of one:

    census       existing (settlement.population)
    block        extension of deployment records (this section)
    column       extension of the migration column ledger (travelClass
                 widening, 1.12.2)
    free_unit    new ledger (1.7)

-- and the RESIDENCY TAG ledger stands BESIDE the join, partitioning
census rather than adding a fifth pool to it (section 0.2):

    cohort       new tag ledger (1.13.1)
    free_lance   a counts field on the same tag ledger's settlement row

The walker (section 0.2) is the enforcement, and the tag ledger's
sum(tags) <= census law is its sibling. Answering census D question 4
directly: the people ledger is the JOIN plus the walker, not a third
structure.

## 1.5 The block forks: news-gated, law-band-cohesive (c)

### 1.5.1 The news gate

When a block's HOME suffers a triggering event (occupied, liberated,
razed, sovereignty conveyed), the block's fork does not open until NEWS
of the event ARRIVES at the block -- belief at road speed; columns may
fight for coalitions their homes already left. The gate reads the
army's own staleness machinery (armyTransit's beliefStaleness /
stepBeliefStaleness, census D section B -- the army already models a
worn command picture; this volume adds no second latency law) joined
with the rumor arrival record for the event at the army's current
region. Under infoMode omniscient the gate is immediate; under
perfect_delayed it is latency-only; both are pinned. THE HARDEST
NEGATIVE (named here, pinned in WC-8): a defection fork that fires
before the news arrival record exists at the block's location is RED.

### 1.5.2 The fork and its loading

    BLOCK_FORK_OUTCOMES = ['stay', 'return', 'defect', 'resist']

- stay: keep fighting; the block still EARNS ITS HOME contribution
  credit toward the peace table (directive (c), verbatim intent) --
  occupied homes' blocks remain formally allied but WATCHED (an ES
  taint read, section 4.3).
- return: the block departs as a return column (a named people-ledger
  event).
- defect: the block joins another army (conserved, block -> block';
  never a sink; the family-fear driver stays institutional). WHICH
  ARMY IS A STATED RULE, not an implementer's guess. The candidate set
  is CLOSED: armies co-located with the block or within ONE hop, whose
  owner either holds the block's home (the occupier a frightened block
  buys peace from) or is at war with the block's current owner (the
  enemy a bitter block joins). The choice among candidates runs the
  SHARED JOIN-PREFERENCE READ -- joinPreference.js, the same
  drift-weighted slider the free units use at 1.7.3: home-alignment
  blended with drifted-self-alignment weighted by drift depth, plus the
  candidate's standing with the block's home. ONE SCORER, TWO
  CONSUMERS: the leaf lands WITH blockForks at WC-8 and freeUnits
  consumes it unchanged at WC-11, so the estate never grows two join
  scorers that can disagree (the alternative -- duplicating the
  1.7.3 read inside blockForks -- was rejected as a second mouth on the
  same question). An empty candidate set is not a defection: the fork
  re-normalizes over the remaining outcomes, never silently becoming a
  stay. WC-8 PIN: the receiving army is deterministic under the seed
  and the selection reasons are pinned with toEqual.
- resist: the block returns AND feeds the existing
  occupation-resistance quantity at home (occupation.js's resistance,
  a consumer write through its existing advance, not a new writer).

The draw is a seeded fork on a stable composite key
(wcfork:<originId>:<warAnchorKey>:<newsTick>), sampled ONCE per block
per triggering event, with loading factors that double as typed
receipt reasons: home relationship to the army's owner, occupation
state at home, distance home, the block's drift band, comradeship with
co-blocks, and fear (the enemy's believed atrocity record).

LAW-BAND COHESION: lawful blocks decide AS ONE (one draw, whole
headcount); chaotic blocks FRAGMENT (the draw yields a distribution
and the headcount apportions across outcomes by largest-remainder);
balanced sits between (majority + minority split). The cohesion curve
is a row in the ONE law-band modulation table (1.3.2). Every fragment
is conserved and origin-tagged.

## 1.6 The service integrals: blend, comradeship, drift (d, g, h, i)

### 1.6.1 One accumulator family, three quantities

All three ride the SAME event-updated roster integrals (never
per-tick): updated at the named people-ledger events plus engagement
closes (the attrition application, an existing event edge).

- BLEND ABSORBED (per block): scales with service duration x (1 - own
  share). The small block in a big foreign army comes home most
  changed.
- BLEND IMPARTED (per block): scales with own share. The dominant
  block spreads most, changes least. Long wars melt, short wars
  introduce. Drift (f) composes: a mid-war share shift moves the
  army's blend with it.
- COMRADESHIP (per contributing-settlement pair): shared service
  duration x shared hardship, where hardship is INTENSITY not victory
  (the engagement-close severity, read from the existing attrition
  band -- brothers of a lost siege still bond). Written into the
  EXISTING relationship machinery at fold points (war close, block
  departure) through applyRelationshipPatch -- the one writer -- as
  typed outcomes moving trust and pactStrength; PLUS one exact-once
  shared_service row in the edge archive at war close (through the same
  appender + recorded-predicate pair as 1.1.3, `shared_service` as the
  row kind). No new relationship axis is minted (census C C6 resolved:
  ride the seven axes + an archive row; diaspora bonds are DERIVED, not
  edge state -- 1.13.3).

THE FOUR CONSUMERS, NAMED WITH THEIR READ SITES. Directive (h) does
not merely say comradeship is written to the relationship plane; it
names what the writing must feed ("caravan density (the WY law),
alliance odds, call-in answer weights, and relay efficiency"). Two are
AUTOMATIC through the axes and two are EXPLICIT terms this volume
owes:

1. CARAVAN DENSITY -- automatic. WY's caravan law reads the
   relationship directly (DESIGN_FP_ARCH_WY.md, the "caravans read the
   relationship" law: partnership thickens the road), so warmth banked
   through applyRelationshipPatch reaches it with no WC code. GATED on
   WY-3's build; carried as a seam row, not a claim, until then.
2. ALLIANCE ODDS -- automatic, and checkable at HEAD: the coalition
   join appetite in readCoalitionJoinDecisions
   (warCoalitionDecision.js:59) is composed from
   clamp01(relation.pactStrength) * 0.5 + clamp01(relation.trust) * 0.3
   (:108-109, verified), which are exactly the two axes the
   comradeship patch moves. No new term; a WC-9 pin asserts the
   movement rather than assuming it.
3. CALL-IN ANSWER WEIGHTS -- explicit. The answer fork of section 1.9
   carries comradeship as a named loading factor beside the credit
   balance; comrades answer calls strangers refuse.
4. RELAY EFFICIENCY -- explicit. The per-hop loss fraction of 1.3.2
   gains its comradeship term with its own tuning row, landing at WC-9
   and pinned by an identical relay run between comrades and between
   strangers.

Consumers 3 and 4 are the ones a narrowing would silently drop, which
is why they are stated as terms with tuning rows rather than as
sentences.

### 1.6.2 Betrayal priced by intimacy

Skim against comrades, token contribution while comrades bled
(measurable via realized blood-share), and mid-war defection chill
MORE between comrades, in proportion to the bond: the relationship
patch for these outcomes scales its resentment magnitude by the
comradeship banked on the edge. The deepest feuds are born between old
friends. This is a magnitude modulation inside existing rule bodies
(relationshipRulesCore/Adversarial), not a new rule id family --
except one new typed outcome per betrayal kind, named in WC-9.

### 1.6.3 Character drift with hysteresis (i + K2)

Drift rides the blend integrals as one more blended axis (law/morality
lean). ORIGIN IS IDENTITY, IMMUTABLE; CHARACTER IS STATE, MUTABLE. The
accumulation is continuous internally; the EXPRESSED band moves through
DEAD ZONES (hysteresis: the band steps only when the accumulator
crosses the band edge plus a margin, and steps back only below the
edge minus the margin) so character changes reluctantly and receipts
stay stable (K2). The expressed band is what every fork reads via the
law-band modulation table -- zero new decision machinery (directive
(i), verbatim intent). Drifted character feeds: join preference
(1.7.3), fork loadings (1.5.2), and the homecoming introduction
attempt (1.12.4).

### 1.6.4 Comrades know each other: the fidelity rider (h)

The owner's words, verbatim: "COMRADES KNOW EACH OTHER -- former
co-belligerents hold unusually ACCURATE believed-doctrine of each other
(free mutual intelligence from shared service; former comrades turned
rivals anticipate like no strangers -- old brotherhoods make the
sharpest wars)."

Until this amendment the volume answered that with ONE clause inside a
coordination contract (4.1.3: "a fidelity modifier on the existing
belief reads ... not a new channel") -- no model subsection, no wave,
no pin, no tuning row, no beat. Its SIBLING rider in the same owner
sentence (betrayal priced by intimacy) got 1.6.2, a WC-9 landing, an
ordering pin, and BETRAYAL_INTIMACY_MULT_MAX 2.0. By 1.6.1's own
standard -- "a clause with named consumers and zero pinned reads is a
clause honored in prose only" -- the rider was honored in prose only.
It is architected here.

THE READ THAT GAINS THE TERM. Comradeship does not open a channel and
does not write a belief record; it reduces the ERROR of the reads that
already exist. The believed-doctrine read is HABIT r5's mint on SP-B's
believed-axes machinery (4.1.3, C2: HABIT mints, WC feeds and reads),
and every such read resolves a believed value against a truth with some
fidelity. The rider is one named term inside that resolution:

    comradeFidelity01(observerId, subjectId)
      = clamp01( bondOf(observerId, subjectId) )   -- the SAME
        comradeship integral 1.6.1 banks, no second quantity

    effective error = base error x (1 - COMRADE_FIDELITY_MAX
                                        x comradeFidelity01)

BOUNDED, AND THE BOUND IS THE POINT. COMRADE_FIDELITY_MAX (7.B) is
strictly below 1.0, so no bond ever yields a PERFECT read: the deepest
brotherhood narrows the error, never closes it. A comrade who could
read another comrade exactly would be an omniscience channel wearing a
friendship's name, and the fog laws forbid that as firmly as the news
laws forbid a free courier.

IT IS SYMMETRIC AND IT SURVIVES THE FRIENDSHIP. The bond is banked per
PAIR (1.6.1), so both parties read each other better, and the term
reads the BANKED integral, not the current relationship: two former
comrades now at war still anticipate each other -- which is the owner's
whole point ("old brotherhoods make the sharpest wars"). The betrayal
pricing of 1.6.2 and this fidelity term therefore pull in opposite
emotional directions on the same number, deliberately: the bond that
makes the feud bitterest is the bond that makes the war sharpest.

HOW IT COMPOSES WITH HABIT'S LEVEL-ONE ANTICIPATION BOUND. The rider's
payoff clause is ANTICIPATION, and the habit directive bounds
anticipation at level ONE (memory:
habit-conditioning-directive.md -- "anticipation bounded at level
ONE"). Those do not conflict and the composition is stated so no
builder has to guess: comradeship improves the ACCURACY of the level-one
read; it never raises the LEVEL. A comrade anticipates what the other
will do more truly; nobody ever anticipates what the other expects them
to anticipate. The bound is HABIT's to enforce and this volume's term
enters strictly inside it -- a fidelity multiplier on one read, not a
recursion depth. WC-9's pin asserts both halves: the comrade fixture's
belief error is strictly lower than the stranger fixture's, AND the
anticipation depth is identical in both.

WAVE AND SEAM. The term lands at WC-9, where the comradeship integrals
first exist, and is GATED on HABIT r5's axes like every other
believed-doctrine read in this volume (4.1.3): until HABIT lands it is
a pre-pinned seam row with its executed red-capability proof, exactly
as the reliability page's rows are (1.11). Three-altitude read: no new
surface -- the rider changes how well an existing read reads, and the
existing doctrine page is where it shows.

## 1.7 Fission, free units, and the map's carrying capacity (i, l)

### 1.7.1 The supply-derived cap

An army's MAXIMUM MASS is supply-derived physics, no arbitrary
constant: sustainable mass = carried supply + relay throughput, over
burn rate (mass-scaled, seasonal-severity-scaled). Lawful networks
sustain larger hosts; chaotic skim starves the center. The MAP CAP is
CARRYING CAPACITY: the owner's two framings (tied to supplies; scaled
by settlements x tier) are ONE LAW -- sustainable total unit mass is
what the settlement NETWORK can feed (the network read: reachable
settlements' stores and tier, distance-attenuated per the digest;
cloud-world safe, CR-WC-5). Excess upkeep shortens envelopes
everywhere, forcing wick-aparts and absorptions: clutter self-corrects
because everything on the map must eat. A renderer sanity ceiling MAY
exist as a never-hit guard rail (authored, documented as a guard, with
a pin proving it is not load-bearing at soak scales).

### 1.7.2 Fission cuts along the comradeship graph

When the cap forces break-up, fission cuts the WEAKEST comradeship
bonds first; origin blocks stay whole (a block never splits mid-block
except by the chaotic-cohesion fragmentation of 1.5.2). The (h)
integrals ARE the affinity matrix; the SAME mechanism reuses at
war-end dissolution. Fission products become FREE UNITS:

    spatialLedgers.freeUnits = {
      '<unitKey>': {                // unit.<rootOriginId>.<fissionTick>
        blocks: [...],              // same block shape as 1.4.1
        position,                   // army-style stepper (the
                                    // stepArmyPosition model)
        state,                      // FREE_UNIT_STATES
        supplyBand,
        driftBand,
        beliefStaleness             // free units may not know the war
                                    // ended: peace reaches them at
                                    // road speed
      }
    }

    FREE_UNIT_STATES = ['operating', 'foraging', 'brigand', 'dissolving']

### 1.7.3 The free unit's life and the three fates

Free units operate independently until resources run out, then seek to
rejoin: same-origin units first (general preference), else allies by
SLIDING STATE-ALIGNMENT PREFERENCE -- the join weight blends
home-alignment with drifted-self-alignment WEIGHTED BY DRIFT DEPTH
(loyalty vs affinity as a continuous slider, banded at the read). THE
READ IS joinPreference.js, minted at WC-8 for the block forks (1.5.2)
and consumed here UNCHANGED -- one scorer, two consumers -- and a
successful rejoin is the named `rejoin` event (free_unit -> block). An
unsupplied unit forages; a failed forage escalates: forage -> plunder
-> BRIGANDAGE (1.8). Peace reaches free units at road speed
(beliefStaleness): units fighting on after the peace are a structural
possibility, and the eventual news arrival is a beat. The three fates
of the unsustainable army -- predation, starvation, absorption -- are
all conserved (brigand is a state change; starvation deaths debit
through fell; absorption sheds through cohorts).

LAW-M COVERAGE, CORRECTED. Free units step positions army-style, and
this volume owes coverage for that stepper -- but the earlier drafting
of this paragraph mischaracterised the law, and the widening it
promised cannot be built as it was written. MEASURED AT HEAD:
MOVEMENT_SITES lives in
tests/lint/namedPersonTransitTotality.walker.test.js ("WR-7a law M's
movement-site guard"); its DISCOVERY_RE keys ENTIRELY on named-person
tokens (openNamedPersonLeg, namedPersonLegTicks, namedPersonLegPosition,
namedPersonPathPosition, namedPersonArrivalTick, advanceWanderer,
advanceLivedTraveller, advanceAssignedNpcTransits, walkLivedJourney,
legArrivalTick, normalizeRoutePlan); every manifest row carries a
named-person route token; and the file's own header states that it is
"intentionally a physics census, not a census of all entity placement
writes". armyTransit is therefore NOT EXEMPT from law M -- it is OUT OF
SCOPE, because it moves COUNTS and law M censuses NAMED-PERSON leg
physics. Widening MOVEMENT_SITES to stepArmyPosition-class steppers
would put a counts-mover inside a named-person manifest, against this
volume's own CR-WC-2 ruling that the people ledger is counts.

WHAT THIS VOLUME OWES INSTEAD: a SECOND totality manifest, for
COUNTS-MOVERS, with its own discovery signature (the counts-stepper
and column-release tokens, not the named-person ones), registering the
sites that exist today -- armyTransitKernel.js's stepArmyPosition calls
(:467, :502, :698, :742, the symbol imported at :33),
migrationKernel.js's releaseMigrationArrivals (:336) over
spatial/migration.js's releaseArrivals (:578) -- plus this volume's new
freeUnitKernel.js when it lands. Law M keeps its scope and its header;
the counts plane gains the coverage it never had. The manifest lands
in WC-11's opener, and CR-WC-10 asks the chair to approve a SECOND
manifest rather than a widening of WY's law.

## 1.8 Brigand sieges and the embattled state (l)

### 1.8.1 Located brigandage

Brigandage is LOCATED: the unit moves to the NEAREST settlement (road
graph + relationship warmth ordering; hostile settlements are prey,
never parking). Against the town's defense + internal security -- both
read through defenseLedger(settlement), the ONE read-point (census B
section D; the live veteran boost of 1.14 composes at the same read) --
the contest resolves:

- REPEL: brigands scatter and route onward, hungrier.
- EMBATTLED: a located stressor WITH A SOURCE BODY. The stressor is
  minted through the ordinary stressor machinery (normalizeStressor,
  canonical id, deduped) by the brigand resolver -- the
  pestilenceKernel precedent verbatim: "we drive that stressor, never
  a parallel one." Effects: local trade interdicted, fear in the risk
  register, the brigand envelope refilling by theft -- the relay
  network's dark mirror.

    EMBATTLED_RESOLUTIONS = ['suppression', 'attrition', 'absorption',
                             'buy_off']

Suppression is the mercenary market's demand side (1.12.5); attrition
starves the unit (deaths through fell); absorption sheds it into the
cohort ledger; BUY-OFF ends the siege and TEACHES RAIDING PAYS --
the buy-off close is a graded close feeding the habit system (section
4.1), the directive's own warning wired as designed.

The crisis-triple fence: if the embattled condition needs the full
settlement-stress-container / activeCondition / campaign-twin triple,
every transition routes through crisisLifecycle.js (the hard fence,
census B section F); WC-12 states whether embattled is expressible as
the existing APPLY_STRESSOR/RESOLVE_STRESSOR pair (the recommendation:
yes -- it is an ordinary stressor with a typed source reference) or
needs a third event type (CR-WC-11 parks the fallback).

### 1.8.2 Embattled breeds crime; the smuggling loop (p)

Fear + disrupted trade breed opportunists: the embattled stressor
joins the crime-pressure archetype set (a new member of the existing
CRIME_ARCHETYPES read, pressureModel.js -- an extension of a frozen
set, walked). SMUGGLING TO THE BESIEGERS: crime feeds the pressure
that bred it, broken only by suppression, relief, or absorption. The
espionage composition: crime eases infiltration (the EXISTING
COMP_CRIME_W term, espionageMath.js -- no second spelling minted), so
embattled regions turn espionage-porous when weakest: the spy walks in
behind the smuggler. The crime read for any new consumer here follows
the security01Of discipline: take the WORSE of stored and live, never
blend (census B question 5, honored).

## 1.9 Call-ins: the request, the answer fork, the two-axis close (R7)

Directive refinement R7 has a full shape -- "CALL-INS RIDE THE ERRAND
SPINE -- typed envoy errand; the answer is a decision fork,
habit-ready, graded at war close (did the supported side win; was
credit honored)" -- and, until this amendment, no model section at
all: call-ins lived in this volume as a broken pointer, one wave row,
one attachment row, and two appendix mentions, and the FIRST half of
the owner's grading ("did the supported side win") appeared nowhere in
the volume at any altitude. Both halves are architected here.

### 1.9.1 The request record: the only honest expectation

A call-in is an ASK, and the ask is a RECORD. This is also the object
7.A.3's `partial` grade needs and the one the volume otherwise lacked:
this architecture writes credit at ARRIVAL and refuses to write at
pledge (1.1.1), so a shortfall-versus-expectation has nothing to
measure against unless the expectation is itself a fact. The request
is that fact.

    CALL_IN_REQUEST = {
      fromId, toId,                 // directed pair, the reasonPairKey
                                    // spelling
      warAnchorKey,                 // the same ANCHOR identity as the
                                    // credit record; its EPISODE is
                                    // derived through 1.2.2's map when
                                    // the close reads a stance
      askedKind,                    // a CONTRIBUTION_KINDS member
      askedBand,                    // a credit band: THE EXPECTATION
      askedTick,
      horizonTicks,                 // when an unanswered ask lapses
      answer,                       // CALL_IN_ANSWERS; absent in flight
      answeredTick
    }

    CALL_IN_ANSWERS = ['answered', 'partial', 'refused', 'lapsed']

It rides the errand spine as a typed envoy PURPOSE CLASS. ESTATE
TRUTH, MEASURED AT HEAD: ENVOY_PURPOSES is closed at TWO members today
(envoyErrandVocabulary.js:119, ['sue', 'self_parlay']), and the
purpose-CLASS machinery is SP-D's mint -- errandMint.js is ABSENT at
HEAD. So the request record is the slice that lands FIRST and stands
alone: it is ordinary bounded state on the contribution ledger,
drop-when-empty, capped at CALL_IN_REQUESTS_CAP, and it needs no
errand to exist. The errand CARRIAGE is WC-5's pre-pinned seam row,
which reds when SP-D lands without consuming it. A call-in without the
errand is a standing ask that lapses on its horizon; a call-in with the
errand is an envoy at the gate. Nothing in the grading below depends on
which of the two the world has.

### 1.9.2 The answer is a fork, and the fork is loaded

The loaded-dice law binds here as everywhere: the answering court
samples a situation-weighted distribution whose loading factors double
as the receipt's typed reasons.

    credit balance        what the asker is OWED (contributionReads'
                          derived balance). A debtor who refuses reads
                          breach-grade through treatyBreach (1.1.4).
    comradeship           the bond banked on the edge -- directive (h)'s
                          third named consumer (1.6.1): comrades answer
                          calls that strangers refuse.
    own threat            the answerer's own exposure: the reason a real
                          ally says no and is not thereby a traitor.
    distance feasibility  hopWeeks-derived bands, per 5.3.
    treaty obligation     the live terms, through the existing grading.
    law band + habit      the one modulation table, plus the answering
                          court's learned habit where HABIT is lit,
                          neutral where dark.

Seeded on a stable composite key
(wccall:<fromId>:<toId>:<warAnchorKey>:<askedTick>), sampled ONCE per
request, writing its answer into the request record -- never a second
ledger, never a second writer.

### 1.9.3 The two-axis graded close

The owner named TWO grading questions and this volume had kept only
one: CONTRIBUTION_CLOSE_GRADES carries credit-honour terms and no
war-outcome term at all. Both axes grade at war close, independently,
so the habit system learns both lessons the owner asked for:

    OUTCOME AXIS   did the SUPPORTED SIDE win?
                   CALL_IN_OUTCOMES = ['prevailed', 'stalemated',
                   'lost'], derived from readWarTerminations' existing
                   close (a consumer read, never a re-derivation)
    HONOUR AXIS    was the credit honored?
                   the CONTRIBUTION_CLOSE_GRADES read of 7.A.3
                   (honored | partial | unanswered | betrayed)

CALL_IN_CLOSE_GRADES is the frozen PAIR (outcome, honour) -- a
two-tuple, never a flattened twelve-word ladder. Two closed
vocabularies compose; a cross-product mint would be a third vocabulary
nobody could keep total, and it would teach one lesson where the world
teaches two: answering a call for a side that then loses is a different
education from answering one that wins, and honouring credit to a
losing partner is different again.

`partial` gains its measurable meaning here and nowhere else: credit
real but BELOW the request's askedBand -- a shortfall against a stated
ask. That is the pledge-shaped expectation the grade vocabulary was
written against, now an actual object.

WAVE ORDER, STATED SO THE PAIR IS NEVER HALF-READ: the request, the
fork, and the OUTCOME axis land at WC-5; the HONOUR axis lands at WC-9
with CONTRIBUTION_CLOSE_GRADES' last input (7.A.3). Nothing consumes
CALL_IN_CLOSE_GRADES before both halves exist -- a half-pair is not
published, because a habit system fed one axis learns the wrong lesson
confidently.

Three-altitude read: GLANCE the answer word on the relationship chip;
SENTENCE "Thornhold called, and Emberford came -- though the war was
already lost by then"; TABLE the per-war call rows beside the credit
rows.

## 1.10 Debt needs exits (K8)

- FORGIVENESS as a diplomatic gesture: rides the existing
  forgiveCoalitionReimbursement / fogForgiveness precedents -- a typed
  gesture that extinguishes the war_contribution obligation and writes
  the exact-once forgiveness row (the coalitionSettlements archive
  already carries a 'forgiveness' action; the contribution archive
  mirrors it).
- DEBT-TO-VASSALAGE CONVERSION as a sovereignty-market transaction:
  the WR-10 market owns the transaction shape (census F contract 17);
  this volume adds the debt-consideration intent road (the indebted
  party's seat converts obligation into a vassal edge through the
  market's existing stage machinery) -- chosen, not accidental.
- JUBILEE as peace-grammar terms content beside AMNESTY (K3): two new
  TERM_CATALOG rows in peaceTermsCatalog.js (the family floor, the one
  mint site), each in its own family (the section-13 one-per-family
  stacking trap, census C hazard (d), respected by giving amnesty and
  jubilee their own families rather than sharing 'economic'), each
  WITHOUT a CLASS_TERM producer at registration (the proven
  byte-identical dark-landing recipe: no producer, never drafted,
  registration-only). PRODUCERS ARRIVE IN THEIR CONSUMING WAVES, AND
  "CONSUMING" MEANS THE WAVE THAT MINTS THE TERM'S SUBJECT. Jubilee's
  subject is contribution debt, which exists from WC-1, so its producer
  lands with the other exits at WC-5. AMNESTY'S SUBJECT IS FREE
  COMPANIES, which do not exist until WC-11 and live behind a DIFFERENT
  flag: its producer therefore lands at WC-11, gated on
  `freeCompaniesEnabled` BY NAME in conjunction with the arc's own
  flag, fail-closed. Landing it at WC-5 would let any world with
  contributionLedgerEnabled draft and agree an amnesty over a
  structurally empty population -- a vacuous term at the peace table,
  which is exactly what the no-producer-at-registration recipe exists
  to prevent, one wave later. Pinned at WC-11: with freeCompaniesEnabled
  dark, amnesty is never drafted anywhere on the seeded treaty corpus.
  COORDINATION: the queued TB tribute family also amends this catalog;
  CR-WC-12 assigns the order (recommendation: WC registers its two
  rows; TB proceeds independently; the catalog's one-owner discipline
  is preserved by both landing as catalog rows through the same floor).

## 1.11 The doctrine reliability page (R9)

Contribution closes feed believed-doctrine: who is an arsenal, who
skims, who answers the call. The axis family is HABIT's mint (r5, on
SP-B's believed-axes machinery); this volume CONSUMES it and mints no
axis (the C2 collision, resolved: HABIT mints, WC feeds and reads).
Until the HABIT axes land, the reliability rows are a deferred-with-
reason row in WC-5, pre-pinned as a seam (the TR-5 pattern: a pin that
reds when HABIT lands without consuming the contribution feed). Spies
steal ally-reliability as an ES tap PRODUCT (section 4.3).

## 1.12 Dissolution: homecoming, hop-and-shed, and the one absorption market (e, j, l, m)

### 1.12.1 Proportional homecoming: one arithmetic, two effects

DESTABILIZATION = returning drifted mass as a SHARE of the
then-population, x drift depth. The SAME share scales the defense
recontribution: one homecoming, two proportional effects -- garrisons
the walls AND unsettles the temple. The arithmetic is ONE exported
function (homecomingEffects) consumed by both the cohort writer and
the introduction-attempt roller, so the two effects cannot drift apart.

### 1.12.2 Hop-and-shed as widened wayfare, and the unified law (m)

A unit or column too starved or far to reach home parks at the nearest
NEUTRAL or ALLIED settlement with density capacity, shedding people
town by town until dissolved. Military shed-columns and migrant
populations are ONE OBJECT CLASS under the people ledger: the
migration column ledger's travelClass discriminator widens --

    DEMOGRAPHIC_COLUMN_CLASSES = ['refugee', 'voluntary']   (existing,
                                                             untouched)
    MILITARY_COLUMN_CLASSES    = ['veteran_return', 'shed_column']
    COLUMN_CLASSES             = the frozen union, totality-exported

-- preserving the class-in-the-key collision discipline
(migration.js:520, verified) so two lanes on the same origin/dest/tick
never collide. Same capacity-seeking strategy, same road-graph +
relationship routing, same foreign-homecoming arithmetic per shed,
same host rejection fork; military and civilian columns COMPETE for
one shared absorption-capacity market (the destinationMenuFor /
competeForDestinations lane, extended -- a bad peace floods it with
both at once; towns fill; later columns hop further). Differences by
uniform: what they carry (arms/drift/garrison value vs
size/faiths/skills), threat profile at the host's fork, and what
rejection breeds -- soldiers turn brigand; civilians raise
camps/unrest through the stressor machinery, never dramatized.

EMERGENT AND PROTECTED AS A DESIGN GOAL: the demographic signature of
a peace -- the post-war map resolves as a resettlement puzzle, receipts
throughout.

### 1.12.3 The host rejection fork

REJECTION is the host's habit-ready fork, loaded by density,
relationship, law band, and fear; rejected units move on HUNGRIER, and
hungry units turn brigand -- the town that turns away tired soldiers
may meet them as raiders. The fork is seeded, loaded, receipted; its
close (did the rejected column turn brigand within the horizon?) is a
graded close for the habit system.

### 1.12.4 Introduction attempts (d landing)

Every shed and every homecoming carries typed INTRODUCTION ATTEMPTS
rolled against home receptivity through the EXISTING tradition-claim
machinery: a fourth relation pass beside restoration / imposition /
adoption in src/domain/traditions/relations.js (census E's named
extension point), with adoptedFrom set to the block's origin mix and
mutationLog carrying the provenance. Exposure is an event, adoption is
a contest, most attempts fail. Faith exposure rides the same pass as
CULTURE (a bounded religionState share nudge through traditionsKernel's
one sanctioned writer); the engine adjudicates nothing theological.

### 1.12.5 The mercenary/adventurer pulse (e)

Demobilization scaled by disbanded mass raises mercenary + adventure
INSTITUTIONS where veterans pool (FOUNDED if absent, through the
existing institution machinery -- the INT leaves institutionCatalog.js
/ institutionRoster.js, census F C9), decaying through extended peace.
mercenaryMarket.js's supply side gains the veteran-pool term (census E
question 7's recommendation, adopted): the market that today only
HIRES force gains the world's reason there is force to hire.

THE EXISTING SUPPLEMENT STAYS A CAPABILITY READ -- THE RULING, AND WHY.
MEASURED AT HEAD (mercenaryMarket.js, 261 lines): the module is a PURE
CAPABILITY SUPPLEMENT and touches no census anywhere.
MERCENARY_MARKET_TUNING.SUPPLEMENT_MAX is 0.35 (:54), applied at :236
as `T.SUPPLEMENT_MAX * activity` and read through mercSupplementOf
(:163) beside nativeCapability01 (:140). Nothing in it moves a person.

1.14.2 rules that "the hire is the named `enlist` event, census ->
block ... never a strength number appearing from nowhere". Read
carelessly, that rule converts the live supplement into a people
movement judged by the conservation walker -- a LIT-ONLY BEHAVIOR SHIFT
on a built subsystem that NO wave in this volume declares (WC-14's
LANDS mention only the supply side; WC-16's "mercenary adjacency" has
no LANDS row at all). The narrower reading is the correct one and it is
stated here so no builder has to choose:

    THE SUPPLEMENT IS UNTOUCHED. mercSupplementOf keeps its meaning,
    its 0.35 cap, and its census-free arithmetic. Hiring FOREIGN force
    remains a capability read, exactly as it is today. That is also
    what the owner's own park requires: directive (e) records the
    "Hireable mercenary FORCE MARKET ... as a parked future-widening
    (owner question)", and turning the live supplement into people
    would be building the parked thing by accident.
    `enlist` HAS A DIFFERENT CALLER. It is the settlement's OWN muster
    drawing on its OWN free-lance-tagged residents (1.14.2's veteran
    -pool hire) -- census -> block inside one settlement, conserved,
    with the free_lance overlay retired by `untag` in the same event.
    It is a levy-shaped hire of local hands, not a force market.
    THE ONE EDIT TO mercenaryMarket.js IS THE SUPPLY SIDE: the
    veteran-pool term feeding what force EXISTS to hire. It is a read
    input, not a people mover, so it needs no walker arm.
    IF THE CHAIR LATER UNPARKS THE FORCE MARKET, it is its own wave
    with its own ALIGNMENT LINE declaring the lit-only shift, its own
    golden-shift record, and its own walker arm -- and it is an
    owner-gated widening, not a WC repair.

THE ORPHAN BRANCH, WITH ITS ADDRESS STATED: destroyed or occupied
homes leave no return target. The earlier drafting sent orphaned
counts straight to the free-lance pool "with zero extra machinery" --
but the pool is keyed PER SETTLEMENT on the tag ledger
(residentCohorts['<settlementId>'].freeLance), and the defining
property of an orphan is that it has no settlement; the destroyed home
keeps no row to receive them. THE RULE: an orphaned block converts to a
FREE UNIT first (`orphan`, block -> free_unit) and reaches the
free-lance labelling only through the ORDINARY hop-and-shed road --
`shed` at whichever host absorbs it (1.12.2), then `demobilize` tags
the new residents hireable. That needs no new address, reuses WC-13
wholesale, and lets the direct block -> free_lance arm be DELETED from
the event table entirely, shrinking the closed list rather than
growing it. It also reads better: the orphaned company does not
teleport into a hiring hall, it walks until a town takes it in, and the
towns that took them in are why that region's mercenaries all speak
with one accent. The
world thereby generates its own adventuring class WITH REASONS --
institutions and pools as texture, never party-facing actors
(CR-WC-3). The hireable force MARKET stays parked as the owner parked
it.

## 1.13 Diaspora bonds: embodied, mortality-decayed (n)

### 1.13.1 The cohort ledger IS A TAG LEDGER

Per the section 0.2 ruling: this ledger records LABELS ON CENSUS
MEMBERS. Its counts PARTITION each settlement's population; they never
stand beside it. Nothing here is a pool, so nothing here appears in the
people-conservation identity.

    spatialLedgers.residentCohorts = {
      '<settlementId>': {
        '<originId>:<kind>': {       // kind: 'veteran' | 'settled'
          count,                     // integer; a SUBSET of census here
          ageBand,                   // COHORT_AGE_BANDS
          lastEventTick
        },
        freeLance: { count }         // the hireable labelling, same law
      }
    }

    COHORT_AGE_BANDS = ['newly_arrived', 'settled', 'rooted']

THE TAG-LEDGER TOTALITY LAWS, pinned in their own right at WC-13, are
0.2's two laws and no longer the single sum an earlier drafting stated
(which its own multi-tagging rule falsified):

    LAW 1  for every settlement, sum over all (originId, kind) cohort
           rows of count <= census(settlement)
    LAW 2  for every settlement, freeLance.count <= census(settlement)
    LAW 3  free_lance is the ONLY overlay: no other pair of tags may
           name the same person, asserted by construction over
           RESIDENCY_TAGS

Every tag credit has a census credit in the SAME event (`shed` and
`arrive_home` do both at once), and every census DEBIT runs its tag arm
in the same event (0.2). A tag write without its census credit is a
double-count and reds; a census credit without its tag is a lost cohort
and reds the WC-15 read fixtures; a census debit without its tag arm
inflates the cohort and reds LAW 1 the moment the garrison marches.

THE SELF-ORIGIN ROW EXISTS, AND IT IS WHAT THE VETERAN READ CONSUMES.
Tags are keyed '<originId>:<kind>', and `arrive_home` credits census
AND the tag in one event -- so a settlement's OWN returning veterans
form a cohort row whose originId EQUALS the settlement id. Neither this
section, nor 1.13.3, nor WC-15, nor WC-16 said whether that row exists,
and the two waves need OPPOSITE answers. The rule, stated once:

    THE ROW EXISTS. residentCohorts['<S>']['<S>:veteran'] is a legal,
    ordinary row and it is precisely what veteranReads (1.14) consumes
    -- "the LIVING veteran cohort" at home is, by definition, the
    town's own people who came back. Without it WC-16 has nothing to
    read.
    diasporaBonds SKIPS IT. hostReadsResidents and originReadsDiaspora
    (1.13.3) both skip every row where origin === host, because a
    settlement feeling diaspora warmth toward ITSELF is the
    beliefRecord(x,x) self-comparison class the estate has already been
    bitten by (5.5) -- a number that is always maximal, always
    meaningless, and always contaminating whatever it is composed into.

    ONE FIXTURE PINS BOTH HALVES (WC-15): a settlement with a self-origin
    veteran row and one foreign-origin row asserts that veteranReads
    reads a NONZERO living cohort while hostReadsResidents(S, S) is
    ABSENT (not zero-valued: absent, so no consumer can average it in),
    and that hostReadsResidents(S, foreign) is nonzero. The
    self-row-skipped mutant (dropping the row itself) reds the veteran
    half; the self-row-admitted mutant (letting the bond read it) reds
    the diaspora half. 5.5 carries the clause beside its
    beliefRecord(x,x) sibling.

Counts only, origin ids only (settlement ids are addressable public
facts under the news law; no person is named). Single writer
(residentCohorts.js), drop-when-empty, normalize arm and spatialUsage
row in the landing commit. THE WRITER LANDS AT WC-13, not WC-15 --
that is what makes WC-13's shed and WC-15's cohort read the SAME
arithmetic instead of two arithmetics separated by a silent migration
(the earlier drafting had WC-13 crediting census with the tag "banked
in the column record" and WC-15 then moving those same counts into a
cohort ledger, a `census -> cohort` transfer that is a member of no
event list in this volume). WC-15 adds the mortality debit, the age
bands, and the derived bonds -- it moves no people and no tags that
WC-13 did not already write.

### 1.13.2 Mortality is the decay law -- and one unresolved contradiction

No new decay constant: cohorts shrink through the EXISTING demographics
death machinery -- at the year fold (the census cadence), each cohort
tag debits pro-rata by the settlement's own realized death fraction, in
the same fold as the census `mortality` event it partitions.
First-generation memory dies with the first generation, via funerals,
not constants. This is deliberately NOT a bandedStock decay (section
5.1): bandedStock owns half-life-toward-neutral shapes; mortality is a
population process and rides population machinery.

PARKED, NOT RESOLVED (CR-WC-21): WHAT STEPS THE AGE BAND. Two things
this volume says cannot both be true as written.

- The age band steps by CALENDAR: 7.A.9 and this section's ledger give
  newly_arrived within ~5 years, settled ~5..20, rooted beyond ~20,
  with AGE_BAND_EDGES_YEARS 5 / 20 (7.B); and 1.13.3 makes the bond
  "recency-weighted by age band" with RECENCY_WEIGHTS 1.0 / .6 / .25.
- WC-15's hardest negative asserts the opposite: "a world where the
  settlement's death rate is zero decays NO bond -- the calendar-decay
  mutant, which fades a cohort by elapsed time alone, must red."

In a zero-mortality world the cohort's COUNT never moves, but its band
still steps newly_arrived -> settled -> rooted on the calendar and the
derived bond falls to a quarter of its value. That is calendar decay by
any reading, so the wave's hardest negative is UNPASSABLE against the
design's own behavior.

This is a chair question and not an amendment because the owner's own
words cut both ways in one clause: directive (n) says "MORTALITY IS THE
DECAY LAW (no new constant -- first-generation memory dies with the
first generation)" AND that the bond scales with "how many came, how
far, how long ago -- 'long ago memory is not recent memory'". Each
candidate repair edits one of those owner words: banding by
mortality-realized composition narrows "how long ago"; keeping calendar
bands makes RECENCY_WEIGHTS a second, calendar-driven decay term and
falsifies both "no new constant" and section 5.1's "authors ZERO decay
constants". CR-WC-21 states both positions in full. Until it is ruled,
the WC-15 pin is carried in BOTH variants and the wave does not land on
a coin flip; no amendment is made here to 1.13.3, 5.1, 7.A.9, or 7.B's
RECENCY_WEIGHTS row. The volume's "zero new decay laws" claim is
therefore CONDITIONAL on that ruling, and section 5.1 says so.

### 1.13.3 The bond is derived, bidirectional, asymmetric

No stored bond value exists. hostReadsResidents(host, origin) and
originReadsDiaspora(origin, host) are DERIVED reads off the living
cohorts. BOTH RETURN ABSENT WHEN origin === host (1.13.1's self-origin
rule): the self row is real, is what veteranReads consumes, and is
skipped here -- an absent read, never a zero one, so no consumer can
average a meaningless maximum into a composition. They are scaled by
the directive's three terms: HOW MANY (the living
count, banded), HOW FAR (the origin's distance read through
calibration(digest)/hopWeeks at read time -- a far-flung cohort binds
harder than a neighboring one, per the owner's framing; the band
derives per-digest, section 5.3), and HOW LONG AGO (recency-weighted
by age band -- WHAT STEPS THAT BAND IS UNRULED: CR-WC-21): the
relationship fades with the
carriers, while the introduced traditions and faiths persist
independently (bonds embodied vs culture institutional -- sixty years
on: no special warmth, but a strange harvest rite remains).
Expressions, all riding existing systems as read-time modulations:
trade affinity, war reluctance (a strategist weight), aid warmth
(generosity), and ESPIONAGE EASE -- the infiltration read gains a
diaspora term (cover among one's own), composed into the existing
competence read, never a second spelling; diaspora as coercion
leverage stays institutional, never dramatized.

## 1.14 Veterans and the domestic order dividend (o, p)

### 1.14.1 Readiness reads the living cohort

READINESS reads the LIVING veteran cohort (size x age band; mortality
is the fade). The attachment is demographicsWar.warCapabilityOf (census
F's named site) plus martialReadiness's live readiness path -- NEVER
the generation-frozen defenseProfile.scores (the frozen/live split,
census B question 10: picking the frozen surface is silently wrong in
exactly these wartime scenarios; this volume's veteran boosts compose
only at LIVE read points).

### 1.14.2 Veterans-first muster, three consequences

- NEW ARMIES INHERIT OLD CHARACTER: veteran blocks carry their drifted
  temperament and habit-learned closes into the new roster -- war
  memory transmits through the bodies that remember it.
- REPEATED WARS BURN THE VETERAN CAPITAL: first-out is first-fallen;
  successive armies get GREENER -- war-weariness as demographic fact,
  the deepest emergent anti-war pressure in the layer. No constant
  enforces this; it falls out of the conservation arithmetic.
- THE FIELD-OR-GARRISON FORK: the same cohort is the home defense
  boost -- send them and soften the walls, or hold them and field
  green. A strategist weight every muster, loaded and receipted.

Veteran blocks REACTIVATE OLD COMRADESHIPS on re-muster: the new
war's affinity matrix seeds from the edge archive's shared_service
rows -- allied hosts knit along last war's seams. Mercenary adjacency:
a settlement short of willing veterans hires (the demand loop again).
THE SCOPE OF `enlist`, NARROWED (1.12.5 carries the measured argument):
`enlist` is the settlement hiring its OWN free-lance-tagged residents
into its OWN roster -- census -> block within one settlement, with the
free_lance overlay retired by `untag` in the same event. THOSE people
move through the conservation identity like any levy, never as a
strength number appearing from nowhere. The EXISTING foreign-force
supplement (mercenaryMarket.js's mercSupplementOf, SUPPLEMENT_MAX 0.35,
census-free at HEAD) is NOT converted by this volume and stays a
capability read; the hireable force market is the owner's own parked
widening.

THE SELECTION IS STATED, NOT LEFT TO THE IMPLEMENTER. A veterans-first
muster draws MUSTER_VETERAN_PREFERENCE of the levy from the `veteran`
cohort rows first, apportioned across those rows by largest-remainder
in codepoint origin order, balance from untagged census, then pro-rata
from what remains -- and it DEBITS those tag rows in the same event
(0.2's tag arm). That debit is what makes the field-or-garrison fork
real: the veterans who marched are no longer in the cohort veteranReads
reads, so the walls and the alleys feel it the same tick (1.14.3, and
WC-16's differentiated pin, which was unpassable until the tag arm
existed).

### 1.14.3 One cohort, three reads (p)

Veterans at home boost DEFENSE and INTERNAL SECURITY: one living
cohort read three ways -- anti-siege (the siege verdict's defense
read), the embattled contest (which already keys on defense + internal
security, 1.8.1), and CRIME SUPPRESSION (a suppression term at the
live crime-pressure read). The field-or-garrison fork gains its full
domestic cost: muster the veterans and you soften the walls, embolden
the alleys, and invite the brigands. THE SYMMETRY (recorded as design
intent): the war's returning people, WELCOMED, are the walls' strength
and the streets' peace; TURNED AWAY, the siege outside and the rot
within -- one population, two receptions, opposite worlds.

## 1.15 The concentration calculus and the siege as showcase (j, K4)

Every army has an ENDURANCE ENVELOPE: (carried supply + relay
throughput) / burn rate. Massing = short envelope + striking power;
dispersal = endurance. The strategist's fork is TEMPORAL -- mass for
the decisive window, wick apart before the envelope closes --
geometry-weighted by who the close settlements are and the distances
of every supporter. MASSING IS A TELL: a concentration is a map body
at news speed; habit-known early-massers telegraph intent (endurance,
surprise, and striking power traded as three currencies). CAMPAIGN
SEASONS EMERGE FREE: seasonal burn under the existing
seasonal-severity abstraction -- mass in summer, exhale for harvest,
unscripted, no season constant authored (CR-WC-5). PARTIAL WICK-APART:
selective block release by the natural selectors -- weakest
comradeship bonds, nearest homes, homes-under-threat per the block's
BELIEF, longest-served / most-drifted -- every exhale a small
homecoming running the 1.12.1 double arithmetic. K4: THE SIEGE IS
DUELING ENDURANCE ENVELOPES, wired deliberately as the showcase --
besieger burn vs defender stores through the existing siege verdict's
supply reads, surfaced in the siege document as two envelope words
racing.

## 1.16 K1: peace-capable primitives

Contribution credit, comradeship, and character drift are built as
ESTATE-WIDE primitives that war merely exercises hardest: the credit
ledger's kind vocabulary and the obligation deposit are not
war-conditioned in their SHAPES (a famine-aid arrival can write the
same receipt through the same writer; a joint venture can accrue the
same warmth), though this volume's WAVES light only the war exercisers.
The peace exercisers (famine aid, joint ventures, temple-raisings,
trade-partnership drift) are named census rows, deferred-with-reason,
so the war budget rebalances the whole ontology without this volume
tripling in scope. K7's deferred-but-named rows THE SEA (naval
transport / blockade / interdiction) and PRISONERS (captured blocks as
a conserved people-ledger branch: exchange / parole / absorption) are
recorded the same way: named, shaped (PRISONERS is one more named
event pair on the conservation walker's closed list when it lands),
not built.

## 1.17 The coercion gradient and its inverse (R6)

R6 had no model section: it lived in WC-4's LANDS list as three
clauses, and one of its three arms -- RELEASE -- had no read site, no
wave row and no pin anywhere in the volume. The directive is verbatim:
"ELECTIVE OVERSHOOT by vassals/occupied = loyalty signaling ->
standing toward better terms/RELEASE/conveyance value (sovereignty
market); chronic under-delivery feeds resistance narrative."

### 1.17.1 The three arms

    REQUISITION      the coerced baseline. An occupied settlement's
                     expected contribution reads the occupation
                     ladder's rung directly (occupation.js's
                     STATE_LADDER, :117, verified: contested /
                     unstable / extractive / stabilized / vassalized).
                     4.4's one-authority rule binds: coercion reads the
                     occupation surface, the RELAY does not, and
                     relations.js's imposition machinery keeps its sole
                     authority.
    OVERSHOOT        delivery above the requisition baseline by a
                     vassal or occupied settlement, past
                     OVERSHOOT_EDGE. Loyalty signaling: it buys
                     STANDING (1.17.2).
    UNDER-DELIVERY   chronic delivery below the baseline, under
                     UNDER_DELIVERY_EDGE. It feeds the EXISTING
                     occupation resistance quantity through
                     occupation.js's own advance -- a consumer input,
                     never a new writer.

### 1.17.2 What standing buys: three roads, and RELEASE is the one that was missing

An earlier drafting landed only "loyalty standing toward the
sovereignty market's existing conveyance-value read" -- one of the
directive's three named payoffs. BETTER TERMS and RELEASE were dropped
silently, and RELEASE is the load-bearing one: it is the thing an
occupied over-deliverer is actually buying, and the reason the occupied
case is "almost entirely coerced" yet still has an inverse worth
modelling. All three are named here with their read sites.

    BETTER TERMS     the K5 single terms-weights read (1.2.4). Standing
                     is one more input to the ONE composed read, never a
                     fourth separate adjustment.
    CONVEYANCE VALUE the WR-10 sovereignty market's existing appraisal
                     of what a held settlement is worth (4.4). The
                     volume adds the intent road only; the market owns
                     the transaction shape.
    RELEASE          THE ROAD, MEASURED. There is no "the occupier
                     elects to let go" verb in the estate, and this
                     volume does not mint one. The estate's actual
                     release-from-occupation is the ladder's TOP rung:
                     STATE_LADDER ends at `vassalized`, and
                     vassalizationOutcomes (occupation.js:724) is where
                     an occupation stops being a garrison and becomes a
                     formal subordination -- the release the occupied
                     can earn. Standing therefore composes into
                     stabilizationSuitability (:386), the EXISTING input
                     to advanceOccupationState (:442), raising the
                     suitability an over-deliverer's occupier reads and
                     so accelerating the climb toward `vassalized`.
                     For an already-VASSAL sender, release means the
                     vassal edge dissolving, which is the sovereignty
                     market's business and rides the same intent road as
                     1.10's debt-to-vassalage conversion, in the
                     opposite direction.

    WHAT IS DELIBERATELY NOT TOUCHED: the ladder's REGRESSION and
    LIBERATION arms (the collapse at suitability <= COLLAPSE_THRESHOLD,
    the regress-below-contested arm, and the MAX_CONTESTED_DWELL
    valve -- all inside advanceOccupationState). Those are
    RESISTANCE's, driven by the occupied throwing the occupier off, and
    nothing in this volume writes them. An over-deliverer is not
    rebelling; conflating the two would let loyalty and revolt push the
    same lever and cancel.

### 1.17.3 The pin, differentiated

WC-4 pins the coercion gradient on ONE fixture with THREE deliverers
against the same occupier: an OVER-deliverer, a NEUTRAL deliverer at
exactly the baseline, and a chronic UNDER-deliverer.

- the over-deliverer's release pressure MOVES (its occupier's
  stabilizationSuitability read is strictly higher, and on a long
  fixture its ladder rung reaches `vassalized` strictly sooner), its
  conveyance-value read moves, and its K5 terms weight moves;
- the neutral deliverer's three reads DO NOT MOVE -- the arm that makes
  the pin differentiated rather than a one-way assertion;
- the under-deliverer's resistance pressure moves and its release
  pressure does not.

The standing-deleted mutant reds all three arms. The
resistance-and-standing-share-a-lever mutant (routing standing into the
regression arm) reds the neutral arm, because it makes a loyal town's
occupation collapse.

---

# SECTION 2 -- THE MODULE MAP

Extend-never-fork. Every mechanism attaches to a census-named existing
surface; new leaves exist only where a mechanism has no home or a
ceiling forbids the home it has. Budgets are stated in eff lines
against the 800 domain ceiling; every figure for an existing file was
measured by a census at d48224e3..3e2bd309 and must be RE-MEASURED at
the building commit (the tree is live).

## 2.1 The ceiling ledger (why the leaves exist)

Measured near-ceiling files this volume must NOT grow:

    armyTransitKernel.js    798 eff / 800  (2 lines; NOT baselined)
    envoyDiplomacy.js       797 eff / 800  (3 lines)
    peaceTerms.js           785 eff / 800  (15 lines)
    warTermination.js       818 eff        (BASELINED, shrink-only, frozen)
    roadsKernel.js          838 eff        (BASELINED at exactly 838,
                                            zero headroom both directions)
    pulseKernel.js          1580 eff       (BASELINED; new tick machinery
                                            enters by name-swap composition
                                            only -- the traditionsKernel
                                            precedent)
    applyWorldPulse.js      941 eff        (BASELINED)
    settlementStrategy.js   over-ceiling with per-file override
    warDeployment.js        684 eff        (headroom exists but the head
                                            stays thin: new logic is leaves
                                            re-exported through the
                                            warDeployment.js:158-162 block)
    stressorDynamics.js     ~759 eff       (~40 lines; any new
                                            counterforce/synergy row needs
                                            a leaf extraction first)
    beliefMap.js            775 eff        (25 lines)
    relationshipRulesCore.js 740 eff       (60 lines)
    warCoalitionSettlement.js 742 eff      (58 lines)

RULE: no wave adds a net line to any file above without stating the
budget in its wave plan; WC-6 OPENS with the armyTransitKernel
decomposition (2.3) before any behavior lands.

## 2.2 New leaves (the complete list, with budgets)

All under src/domain/worldPulse/ unless noted; all lazy leaves reached
through the pulse chunk (pending task #47's eager-closure hazard: no
new module may join the first paint).

    warStance.js              ~120 eff  WAR_STANCE_LADDER + rank map,
                                        warStanceOf, stanceScalars
                                        (exhaustion/casus/terms
                                        multipliers). Dependency-light
                                        (reads ledgers via accessors).
    contributionLedger.js     ~300 eff  THE ONE WRITER of
                                        spatialLedgers.warContributions:
                                        arrival fold, shortfall booking,
                                        close fold (edge archive row +
                                        obligation deposit). Source-scan
                                        fenced single-writer.
    contributionReads.js      ~150 eff  derived balance/credit reads
                                        (the readCoalitionExpenditure
                                        idiom): creditBandFor,
                                        contributionCloseGrade, the K5
                                        single terms-weights read
                                        (termsWeightRead composing
                                        credit + stance + comradeship).
    callInErrand.js           ~200 eff  the R7 mechanism (1.9): the
                                        CALL_IN_REQUEST record + its
                                        cap, CALL_IN_ANSWERS, the
                                        loaded answer fork, and the
                                        two-axis close
                                        (CALL_IN_OUTCOMES x the honour
                                        grade). The errand purpose
                                        class attaches here when SP-D
                                        exists; the record does not
                                        wait for it.
    joinPreference.js         ~120 eff  the ONE join scorer, two
                                        consumers: blockForks' defect
                                        target (1.5.2, WC-8) and free
                                        units' rejoin (1.7.3, WC-11) --
                                        home-alignment blended with
                                        drifted-self-alignment by drift
                                        depth, typed reasons out.
    lawBandModulation.js       ~60 eff  ONE frozen modulation table's
                                        SHAPE ONLY: the closed key set
                                        (cohesion / relay / drift /
                                        learning), the three-word
                                        lawWord axis, throw-on-unknown,
                                        and the totality export. IT
                                        CARRIES NO CURVE VALUES. Each
                                        consumer wave SUPPLIES its own
                                        curve row through the table's
                                        registration entry point, so a
                                        curve is a constant that lands
                                        with its mover and enters 7.B
                                        under THAT wave (WC-0's "TUNING:
                                        none" is then true, which it was
                                        not while this leaf held four
                                        curves). Subject to the HB-1
                                        arbitration (4.1); zero imports
                                        by contract.
    contributionDispatch.js   ~180 eff  THE EXECUTOR of 1.1.5: turns a
                                        chosen contributionMoves move
                                        into named people-ledger events
                                        (`muster` aspatial / `dispatch`
                                        spatial) and stores
                                        consignments, holds the sender's
                                        capacity RESERVATION arithmetic,
                                        and is the ONLY writer that
                                        does. Called at
                                        warDeployment.js's step 5c
                                        (1.1.5); re-exported through the
                                        warDeployment.js:158-162 block
                                        so the head stays thin.
    relayNetwork.js           ~250 eff  staging composition over
                                        candidateRoutes + entrepots +
                                        supplyShipments; per-hop
                                        efficiency + skim accounting;
                                        the relay conservation identity.
    warBlockRoster.js         ~300 eff  block mint/normalize/reconcile
                                        (blocks[] vs
                                        leviedPopulationBySource),
                                        share-integral accumulator,
                                        apportionment (largest-remainder,
                                        reconstruction-attribution).
    peopleLedger.js           ~200 eff  the closed vocabularies POOLS /
                                        RESIDENCY_TAGS / COUNT_EVENTS /
                                        TAG_EVENTS / SINKS + the frozen
                                        EVENT_SIGNATURES the walker and
                                        the movers BOTH read, the join
                                        accessors, and the conservation
                                        arithmetic helpers the walker
                                        pins against.
    blockForks.js             ~300 eff  news-gated fork evaluator,
                                        law-band cohesion
                                        (whole/fragment/majority),
                                        loading factors as typed
                                        reasons.
    serviceIntegrals.js       ~250 eff  blend absorbed/imparted,
                                        comradeship pair integrals,
                                        drift accumulator + K2
                                        hysteresis banding.
    enduranceEnvelope.js      ~200 eff  envelope read (carried +
                                        relay throughput over burn),
                                        carrying-capacity network read,
                                        the dueling-envelopes siege
                                        read, massing-tell emission.
    freeUnits.js              ~350 eff  FREE_UNIT_STATES, fission
                                        cutter (comradeship-graph),
                                        unit records + normalizer, join
                                        preference (drift-weighted),
                                        forage escalation.
    freeUnitKernel.js         ~200 eff  the mover adapter: steps
                                        positions, staleness, peace
                                        news arrival; the ONLY stepper,
                                        covered by the widened law-M
                                        manifest (CR-WC-10).
    brigandContest.js         ~200 eff  nearest-settlement targeting,
                                        the repel/embattled contest
                                        (defenseLedger reads), the
                                        embattled stressor injection
                                        (normalizeStressor road),
                                        EMBATTLED_RESOLUTIONS + buy-off
                                        graded close.
    moverAbsorption.js        ~250 eff  hop-and-shed shared strategy
                                        for COLUMN_CLASSES: parking
                                        search, shed apportionment,
                                        host rejection fork, the shared
                                        absorption market read.
    residentCohorts.js        ~250 eff  THE ONE WRITER of the residency
                                        TAG ledger
                                        spatialLedgers.residentCohorts
                                        (+ freeLance counts): the tag
                                        credit that rides each shed and
                                        each homecoming IN THE SAME
                                        EVENT (lands WC-13, not WC-15),
                                        the tag-totality law, absorb/
                                        demobilize tag events, and at
                                        WC-15 the year-fold mortality
                                        debit and age-band steps.
    homecomingEffects.js      ~120 eff  the 1.12.1 double arithmetic
                                        (ONE function, two consumers) +
                                        introduction-attempt typed rows
                                        handed to the traditions pass.
    veteranReads.js           ~150 eff  the three reads of the living
                                        cohort (readiness term, defense
                                        term, crime-suppression term) +
                                        the field-or-garrison weight.
    diasporaBonds.js          ~150 eff  hostReadsResidents /
                                        originReadsDiaspora derived
                                        reads; espionage-ease term
                                        exported for ES composition.
    demobilizationPulse.js    ~180 eff  institution supply writes
                                        (mercenaryMarket + INT leaves),
                                        free-lance pool feeds, orphan
                                        branch routing.
    contributionMoves.js      ~150 eff  the three strategist moves
                                        (send-reinforcements-to /
                                        send-supplies-to /
                                        recall-support) + weights;
                                        subject to the HB-1 vocabulary
                                        contract (4.1).
    armyTransitEnvoy.js       ~200 eff  NOT new behavior: the WC-6
                                        decomposition target extracting
                                        createArmyCommandPicture,
                                        projectArmiesForEnvoyEncounters,
                                        applyArmyEnvoyIntent,
                                        applyEnvoyInterceptionDecision
                                        from armyTransitKernel.js,
                                        buying the kernel ~200 eff of
                                        headroom for the roster
                                        projection and arrival edge.

Display/news leaves (components ceiling 600):

    display/armyRoster.js     ~150 eff  glance chip + sentence + block
                                        table for composite armies.
    display/contributionVoice.js ~180 eff the authored sentence
                                        families (arrival, crossing,
                                        homecoming, shed, rejection,
                                        embattlement, amnesty/jubilee)
                                        -- pool-extracted, never
                                        hand-edited after extraction
                                        (the TR-1 pool law).

BUDGET, ADDED FROM THE TABLE ABOVE (an aggregate that disagrees with
its own table is a row a later wave will cite without re-adding, so
this one is stated as a sum with its parts):

    24 domain leaves     ~4,830 eff   (the 21 leaves of the original
                                       draft summing to 4,330, plus
                                       callInErrand 200 and
                                       joinPreference 120 from round 1,
                                       plus contributionDispatch 180
                                       from round 2)
     2 display leaves       ~330 eff   (armyRoster 150 +
                                       contributionVoice 180)
    ---------------------------------
    26 leaves            ~5,160 eff

Of that, ~4,960 eff is GENUINELY NEW CODE: armyTransitEnvoy.js's ~200
is an EXTRACTION from armyTransitKernel.js (2.3's decomposition), which
MOVES lines rather than adding them. The two figures are consumed
differently -- the ceiling ledger (2.1) cares about the extraction
because it buys headroom in a file at 798/800; the size ratchets care
about the ~4,780. No file is over 350 eff, and every leaf is under
half its layer ceiling at birth (the hot-file rule: new logic lands
with room to grow).

## 2.3 Extensions to existing surfaces (the attachment table)

    MECHANISM                  ATTACHES TO (verified symbol)          HOW
    THE ELECTED DISPATCH       warDeployment.js:1263 (the             STEP 5c: a leaf called
    (the executor, 1.1.5 --    applyHomeWarCosts call site, "Steps    AFTER home costs, BEFORE
    the road that did not      5 + 5b") + capacityFor, already        the column stepper;
    exist before round 2)      threaded there                         re-exported through
                                                                      warDeployment.js:158-162.
                                                                      NOT the levy sweep: its
                                                                      admission set is 1.1's,
                                                                      not computeLevySources'
    the sender's reservation   contributionLedger's own bounded       capacity held, never
                               state (drop-when-empty)                headcount: in no
                                                                      conservation identity
    arrival credit (troops)    THIS VOLUME's dispatch/arrival road    credit at effect time.
                               (1.1.5). leviedPopulationBySource      The SWEEP's own bank
                               (:443-450) is the RECONCILIATION map,  moves to arrival too IF
                               not the road -- its sweep excludes     it ever fires; it is
                               self-deployers (:391), lit-coalition   MEASURED SILENT
                               peers (:115-116) and occupation        (subsystemRowsWar.js:55,
                               edges (:79), and is MEASURED SILENT    :202), so that arm is
                                                                      pinned on a CONSTRUCTED
                                                                      fixture only
    arrival credit (supplies)  supplyShipments arrival /              consumer call at the
                               WY F9 armySupply.js when built         arrival edge
    stance scaling             warHomeCosts accrual site;             multiplier at existing
                               warFactorForCasusRead;                 sites, no new writers
                               coalitionShares
                               (peaceTermsCoalition.js:261)
    relay staging              entrepots.stepEntrepot crossing        crossings counted by the
                               accounting                             existing accountant
    relay links                supplyShipments.pickSource ranking     WORSE-OF law band across
                                                                      sender/stager/receiver
                                                                      (1.3.2, directive R4's
                                                                      "participants") + the
                                                                      comradeship term
                                                                      (neutral until WC-9)
    interdiction               WY encounter table (E14; new           row + resolver in the
                               E16/E17 from this volume)              same commit
    block roster               seedDeploymentState                    conditional blocks[] stamp
                               (warArmyRecord.js) +                   (drop-when-absent);
                               normalizeDeployments                   fail-closed arm same
                               (worldState.js:116)                    commit
    transit projection         ArmyTransitRecord                      conditional field, WY
                               (armyTransit.js:305 typedef)           field-batch table (C4)
    news gate                  armyTransit beliefStaleness /          joined read; no second
                               rumor arrival records                  latency law
    resist outcome             occupation.js advanceResistance        consumer input, existing
                                                                      writer
    comradeship               applyRelationshipPatch (the one         typed outcomes; a FOURTH
                               writer) + relationshipState's three    edge archive built as an
                               appenders (:189/:273/:294) and their   appender + a separate
                               recorded-action predicate (:266)       recorded predicate (1.1.3)
    comradeship consumers      warCoalitionDecision.js:59 join        (1) alliance odds and (2)
                               appetite (pactStrength/trust,          caravan density are
                               :108-109); WY's caravan law; 1.9's     AUTOMATIC via the axes;
                               answer fork; 1.3.2's per-hop read      (3) call-in weight and
                                                                      (4) relay efficiency are
                                                                      EXPLICIT terms (WC-9)
    obligation deposit         generosityReactions obligationKey      new kind
                               family + advanceObligationDecay        'war_contribution';
                                                                      decayPerTick: 0 in every
                                                                      mover
    debt-to-vassalage          WR-10 sovereignty market stage         new intent road through
                               machinery                              existing stages
    amnesty/jubilee            peaceTermsCatalog.js TERM_CATALOG      two rows, own families,
                                                                      no producer at
                                                                      registration
    embattled stressor         stressorsCore normalizeStressor +      injected ordinary
                               crisisLifecycle (if triple needed)     stressor (pestilenceKernel
                                                                      precedent)
    embattled crime            pressureModel CRIME_ARCHETYPES         one new member, walked
    introduction attempts      traditions/relations.js                a FOURTH relation pass;
                               advanceRelations                       adoptedFrom = origin mix
    faith exposure             traditionsKernel's sanctioned          bounded nudge, one writer
                               religionState share nudge
    columns                    spatial/migration.js                   MILITARY_COLUMN_CLASSES
                               DEMOGRAPHIC_COLUMN_CLASSES (:474),     (3 members incl.
                               columnOf's class stamp (:520/:545)     `reinforcement_column`) +
                               and the class-in-the-key suffix        the frozen union, ALL AT
                               (:553) -- all verified                 WC-0; the stamp/key
                                                                      predicates widen from the
                                                                      DEMOGRAPHIC list to the
                                                                      union in the same commit
                                                                      (byte-identical: no
                                                                      producer yet)
    absorption market          demographicsMigration                  military columns join the
                               competeForDestinations /               existing competition
                               destinationMenuFor
    veteran readiness          demographicsWar.warCapabilityOf +      new term at LIVE read
                               martialReadiness                       points only
    veteran defense/crime      defenseLedger read sites +             composition at the read,
                               pressureModel crime read               never a write to frozen
                                                                      defenseProfile.scores
    mercenary pulse            mercenaryMarket.js supply side +       veteran-pool term +
                               institutionCatalog/Roster (INT)        founding road. THE
                                                                      SUPPLEMENT IS NOT
                                                                      CONVERTED: mercSupplementOf
                                                                      (:163) / SUPPLEMENT_MAX
                                                                      0.35 (:54) stay a
                                                                      census-free CAPABILITY
                                                                      read (1.12.5); the force
                                                                      market is the owner's
                                                                      parked widening
    release standing (R6)      occupation.js stabilizationSuitability standing composes into an
                               (:386) -> advanceOccupationState       EXISTING input; the
                               (:442) -> the ladder's top rung        REGRESSION/LIBERATION arms
                               `vassalized` + vassalizationOutcomes   stay resistance's and are
                               (:724)                                 never written (1.17.2)
    doctrine page              HABIT r5 believed-doctrine axes        consumer only (C2);
                                                                      pre-pinned seam until
                                                                      HABIT lands
    call-ins (the record)      contributionLedger's own bounded       CALL_IN_REQUEST +
                               state (drop-when-empty)                CALL_IN_ANSWERS land with
                                                                      the fork; no SP-D gate
    call-ins (the carriage)    SP-D errand purpose classes            purpose class + registry
                               (ENVOY_PURPOSES closed at 2 today,     row; pre-pinned seam
                               envoyErrandVocabulary.js:119)          until SP-D lands
    call-in close              readWarTerminations' existing close    OUTCOME axis read; no
                                                                      re-derivation
    composition intel          ES tap products                        new PRODUCT, never a new
                               (espionageMath TAP_LEVELS closed)      tap level
    Herald                     heraldRouting + newsVoice              new kinds, wc_*-prefixed
                                                                      (no espionage_* collision)
    certification              certification/subsystemRowsWar.js      one row per new ledger
    telemetry manifest         src/lib/spatialUsage.js                TRACKED rows,
                                                                      counts-banded emission
                                                                      (census C Q10 honored)
    counts-mover coverage      a NEW tests/lint totality manifest     law M keeps its
                               for counts-movers (stepArmyPosition    named-person scope and
                               calls at armyTransitKernel.js:467/     its header; the second
                               502/698/742; releaseMigrationArrivals  manifest is minted in
                               at migrationKernel.js:336;             WC-11's opener
                               freeUnitKernel.js when it lands)       (CR-WC-10)

## 2.4 What this volume does NOT touch

Stated fences, each a one-line veto surface:

- warTermination.js: zero edits (frozen). Stance scaling reads happen
  in consumers.
- The casus taxonomy: zero new WAR_REASON_TYPES members (1.2.4).
- razingSiegeEmission: stays single-import.
- joinLedger: stays single-anchor; no second anchor kind.
- readAllianceWebRisk: stays at two consumers; any stance-aware risk
  read routes through the existing consumers or argues a widening in
  its own wave (census C Q7); the dead 'ally'/'defensive_pact' arms
  are recorded, not repaired here (CR-WC-13).
- pulseKernel/applyWorldPulse: name-swap composition only.
- defenseProfile.scores: never written by live machinery.
- relationshipRulesAdversarial's ambient lane: untouched (ES section 5
  row 13's declaration extends to this volume).
- The correction machinery, the hook 525-key record, the FP corpus:
  untouched (standing memory laws).

---

# SECTION 3 -- THE WAVE SPLIT

Seventeen waves, four arcs, honoring K6's CORE/EPIC split and
extending it for the (l)-(p) clauses that arrived after K6. Strict
dependencies are stated per wave; a wave with an unmet gate does not
build (it is a spec row, per the queue-rows-are-specs law).

ARC MAP:

    ARC A  THE CIRCULATION CORE   WC-0..WC-5   (R1-R9; rides existing
                                                machinery; ships value
                                                early -- K6 CORE)
    ARC B  THE COMPOSITE          WC-6..WC-12  (a-c, f-i + l's brigand
                                                half -- K6 EPIC)
    ARC C  THE PEACE'S PEOPLE     WC-13..WC-14 (d, e, j homecoming, l-m
                                                dissolution)
    ARC D  THE DOMESTIC DIVIDEND  WC-15..WC-16 (n, o, p)

FLAG FAMILY (all virtual -- no DEFAULT_SIMULATION_RULES entry; the
byte-identity idiom):

    warCirculationEnabled       the root conjunct (every WC gate reads
                                it first, by name, !== true fails
                                closed)
    contributionLedgerEnabled   ARC A engine (WC-1..WC-5)
    compositeArmiesEnabled      ARC B rosters/forks/integrals
                                (WC-6..WC-9)
    freeCompaniesEnabled        WC-10..WC-12 (envelopes, fission,
                                brigandage)
    moverAbsorptionEnabled      WC-13..WC-14
    veteranCohortsEnabled       WC-15..WC-16

Each flag lands under the CQ5 one-commit trio (flag + manifest row +
pending cert row + first gate read in ONE commit). CQ5 COLLISION LAW
(standing memory): the manifest, cert, and test surfaces are SHARED by
every flag wave -- FLAG WAVES SERIALIZE; one worktree per flag wave or
strict serialization; no-flag waves parallelize freely.

EVERY WAVE CARRIES (stated once here, specialized per wave below):

- DORMANCY: dark world byte-identical (FOUR-FENCE: the whole-world
  golden cannot tell a leak from evolution -- each wave fences its own
  ledger keys, its own rng stream, its own news kinds, and its own
  display surface separately; the dark-wave display hazard: fail
  closed on the AUTHORITY, not the flag).
- LIT-MUTANT: every guard door pinned INDIVIDUALLY (defense-in-depth
  blinds mutants; a conjunction over two doors is pinned per door);
  every new guard proven REDDENABLE by executing its deletion mutant
  at landing; reason SETS pinned with toEqual, never carries-booleans.
- RNG: identical draw counts dark vs lit wherever a seam exists in
  shared streams (the TR-1 law); new draws fork stable composite keys
  and are conditional-on-nontrivial.
- TUNING: every constant RAW-AUTHORED in-file with a one-line
  justification; owner-signed at soak (THE PROMISE); nothing enters
  proposedSoakBands.js before ratification.
- SENTENCES: the wave's authored sentence families ship in-wave (K7).
- DM PARITY: every engine-written surface a DM can edit gains its edit
  verb through the store-action lifecycle (operationRegistry +
  gen:compendium-data -- the standing store-action law), and
  DM-edited values are never machine-dropped.
- ALIGNMENT LINE: the wave's doc row lands in this volume's PROGRESS
  blockquote and FABLE_VALIDATION_QUEUE.md in the landing commit.

## ARC A -- THE CIRCULATION CORE

### WC-0 REGISTRATION (the vocabulary wave)

Dependencies: none. Buildable now.

LANDS: warStance.js (ladder + rank map, no consumers), peopleLedger.js
(POOLS / RESIDENCY_TAGS / COUNT_EVENTS incl. their TAG ARMS /
TAG_EVENTS / SINKS / EVENT_SIGNATURES, no consumers),
lawBandModulation.js -- THE TABLE'S SHAPE ONLY: the closed key set, the
three-word lawWord axis, throw-on-unknown, the totality export, and the
registration entry point through which each consuming wave supplies its
own curve row. NO CURVE VALUES LAND HERE (2.2; an earlier drafting
landed four curves in the wave whose closing line reads "TUNING: none",
which is exactly the unsigned-constant drift THE PROMISE's
versioned-tuning carve-out exists to stop -- curves are constants and
constants are owner-signature surface). OR the HB-1 import if HABIT
built first; the arbitration note lands either way, 4.1.
ALSO: the COLUMN CLASS VOCABULARY IN FULL (7.A.8) --
MILITARY_COLUMN_CLASSES with all three members including
`reinforcement_column`, and the frozen COLUMN_CLASSES union, with
migration.js's class-stamp and class-in-the-key predicates
(:520 / :545 / :553, verified) widened from DEMOGRAPHIC_COLUMN_CLASSES
to the union. THIS IS A VOCABULARY, SO IT LANDS IN THE VOCABULARY WAVE:
the union used to land at WC-13, seven waves after WC-6 needed
`veteran_return` and `reinforcement_column` to exist, which is a
wave-order violation the graph could not express. It is byte-identical
because no producer stamps a military class until WC-6 mints one.
Also contributionLedger.js record shapes +
normalizer (no writer calls yet), the normalizeDeployments blocks[]
fail-closed arm (rejecting, since nothing writes it), the two
TERM_CATALOG rows (amnesty, jubilee -- own families, no producers:
byte-identical registration, the proven recipe), spatialUsage TRACKED
rows for warContributions/freeUnits/residentCohorts (counts-banded
emission note), certification pending rows, the root
warCirculationEnabled + contributionLedgerEnabled CQ5 trios, and THE
TWO SINGLE-EXPORTER FENCES (the structural half of the HB-1
arbitration, 4.1): a source-scan walker asserting that the strategist
MOVE VOCABULARY has at most one exporter tree-wide, and its twin for
the LAW-BAND MODULATION TABLE. These land HERE, in the registration
wave, and not in WC-4 -- a fence that only exists as a consequence of
one volume's strategy wave cannot restrain the volume that builds
first, which is the whole failure mode 4.1 is trying to prevent.

PINS: totality exports (every vocabulary closed, codepoint-sorted
where order-free); module-load throws on unknown members; the
byte-identity pin (a seeded world with and without this commit is
byte-identical -- the strongest possible registration pin); TERM
catalog rows never drafted (no producer = zero treaty diff on the
seeded soak corpus). HARDEST NEGATIVE: a mutant adding a CLASS_TERM
producer for amnesty must move the treaty corpus -- proving the
no-producer fence is what holds byte-identity, not luck.

THE TERM_FAMILIES CONSUMER CENSUS -- BECAUSE THE FAMILY LIST IS
DERIVED, AND THE NO-PRODUCER RECIPE DOES NOT REACH IT. Verified at
HEAD, peaceTermsCatalog.js:192 is
`export const TERM_FAMILIES = Object.freeze([...new Set(TERM_TYPES.map(
(t) => TERM_CATALOG[t].family))].sort());`. Registering amnesty and
jubilee "each in its own family" (1.10) therefore MUTATES an exported
array -- two new members, re-sorted -- WITH NO PRODUCER INVOLVED, and
the no-producer fence says nothing about consumers that iterate,
length, or compare that array. Three consumers are MEASURED, and two of
them move:

    src/domain/worldPulse/sovereigntyBundle.js:156
      bundleComponentFamilies() returns
      [...new Set([...TERM_FAMILIES, ...SOVEREIGNTY_NON_CATALOG_
      COMPONENTS])].sort() -- a LIVE runtime array that grows by two.
      Behaviourally inert on the seeded corpus (a family with no term
      on the table contributes no bundle line), which the pin must
      ASSERT rather than assume.
    src/domain/worldPulse/sovereigntyBundle.js:167
      catalogGrewSinceWr10() returns
      TERM_FAMILIES.some((f) => !WR10_FAMILIES_AT_LANDING.includes(f))
      -- a TRIPWIRE that flips false -> true. Its own docstring calls a
      red here "an instruction, not a defect report".
    tests/domain/sovereigntyBundleWr10.test.js:322
      expect([...TERM_FAMILIES].sort()).toEqual(
        [...WR10_FAMILIES_AT_LANDING].sort()) -- AN EXACT-EQUALITY PIN
      THAT REDS OUTRIGHT. WR10_FAMILIES_AT_LANDING is the eight-member
      landing record at sovereigntyBundle.js:91.

WHAT WC-0 THEREFORE OWES, IN ITS OWN COMMIT: (a) the enumerated
consumer census above, taken at the BUILDING commit and recorded in the
wave's receipt, with a pin asserting each live consumer is INVARIANT to
the two rows on the seeded corpus, and a PLANTED-ITERATION negative
(a consumer that lengths or indexes TERM_FAMILIES) proving the census
can red; (b) WR10_FAMILIES_AT_LANDING widened by the two families and
sovereigntyBundleWr10's PIN 1b consumed as the instruction it says it
is -- IN THE SAME COMMIT, with the reason quoted. THE HONEST CLAIM,
RESTATED: the SEEDED WORLD is byte-identical; the RATCHET AND TRIPWIRE
surfaces move, deliberately and declaredly. A wave that said only
"byte-identical" here would be reporting a green it had not run.

THE
SINGLE-EXPORTER FENCES ARE PINNED AT AT-MOST-ONE, not exactly-one:
zero exporters is the legal state of the tree today (verified at HEAD:
settlementStrategy.js keeps enumerateMoves module-private at :634 with
a bare re-export at :1360, and no closed STRATEGIST move list is
exported anywhere), two is never legal, and the row that tightens the
walker to EXACTLY-ONE lands in whichever volume mints. The discovery
signature must exclude the battle-resolution vocabularies by name --
convergence.js's ENGAGEMENT_MOVES (:185) and REACTIVE_MOVES (:743) are
a different question and would red this walker on day one otherwise;
that exclusion is itself pinned, so a later strategist list cannot hide
behind it. Red proof executed at this landing: a second exporter
planted, caught, removed.

THE TWO DISCOVERY SIGNATURES, AUTHORED. 4.1.1 and 4.1.2 assert these
fences exist without ever saying what they match, and a source-scan
whose signature is unspecified is a walker nobody can build or refute.
Both scan src/ for EXPORTED declarations only (the `export const`
form), by NAME, over a frozen candidate list -- never by file path, so
a rename cannot silently empty them (the filename-anchored-vacuity
law):

    THE MOVE VOCABULARY FENCE
      MATCHES   an exported const whose identifier matches
                /^[A-Z0-9_]*(STRATEGIST|SETTLEMENT)?_?MOVES?$/ or is a
                member of the frozen alias list
                ['STRATEGY_MOVES', 'STRATEGIST_MOVES', 'MOVE_TYPES',
                 'SETTLEMENT_MOVES', 'MOVE_VOCABULARY']
      EXCLUDES  by exact identifier, and the exclusion list is itself
                pinned: ENGAGEMENT_MOVES (convergence.js:185) and
                REACTIVE_MOVES (convergence.js:743) -- battle
                resolution, a different question
      ASSERTS   at most one match tree-wide; the count is asserted with
                toEqual against a named list, never a bare `<= 1`, so a
                signature that has gone blind reads as an empty list
                rather than a pass
      NON-VACUITY the scan must FIND the excluded pair (proving it can
                see this shape of declaration at all) while reporting
                zero admitted matches

    THE LAW-BAND TABLE FENCE
      MATCHES   an exported const whose identifier matches
                /LAW_BAND[A-Z0-9_]*|[A-Z0-9_]*MODULATION_TABLE$/, plus
                any module exporting a function named
                registerLawBandCurve
      EXCLUDES  LAW_WORDS and LAW_WORD_EDGES (lawWord.js) -- the
                vocabulary and its edges are lawWord.js's, and this
                fence guards the CURVE TABLE, not the words
      ASSERTS   at most one exporting module; two is never legal
      NON-VACUITY the scan must FIND lawWord.js's excluded pair

Both are AT-MOST-ONE today and tighten to EXACTLY-ONE in whichever
volume mints (4.1). Both run the planted-second-exporter mutant at this
landing.

DORMANCY: total (nothing reads anything). TUNING: none, and NOW TRULY
NONE -- registration mints no constants, which is why
lawBandModulation.js lands as a shape with a registration entry point
and its four curves land with their movers (WC-3's relay row, WC-8's
cohesion row, WC-9's drift row, HABIT's learning row), each in that
wave's 7.B block. 7.B therefore carries no WC-0 row, correctly.

### WC-1 THE ARRIVAL LEDGER

Dependencies: WC-0.

CORPUS NOTE, BINDING ON EVERY PIN IN THIS WAVE AND ON WC-6's. THE LEVY
SWEEP IS MEASURED SILENT. subsystemRowsWar.js:55 records that "war_levy
fires ZERO times in every case while its siblings fire", and the row at
:196/:202 is titled MEASURED SILENT: every one of the seven completed
release cases reads war_levy exactly zero (against war_conscription 8,
army_deployed 7, conquest 2 in the 30-year 12-settlement seed1 case),
with LEVY_POP_RATE_PER_TICK 0.004 (warHomeCosts.js:80) against
LEVY_POP_FLOOR 300 (:81) meaning a source under roughly 550 people
levies nobody. CONSEQUENCE FOR THIS WAVE: no pin here may be authored
against levy-produced rows on the seeded corpus, because there are
none, and a pin whose fixture never fires is a green that proves
nothing (the empty-harness vacuity class). Every credit pin builds its
contribution through THIS VOLUME'S OWN dispatch road (1.1.5) or through
an explicitly CONSTRUCTED levy fixture, and each such fixture asserts
non-emptiness before asserting anything else. The volume's value does
not depend on the sweep ever firing; if a later hygiene wave revives
it, this volume's arithmetic already covers it.

LANDS: the contributionLedger.js writer live: troops-lent credit at
the levy/reinforcement effect edge (aspatial: the bank; spatial: the
arrival edge minted in the mover kernel), supplies credit at shipment
arrival, shortfall booking, arrivals cap, the close fold (the THREE archive
symbols of 1.1.3 -- appendRelationshipContributionClose,
contributionCloseWasRecorded, RELATIONSHIP_CONTRIBUTION_CLOSE_CAP = 24
-- plus the war_contribution obligation deposit with decayPerTick: 0 at
every mutation site), CONTRIBUTION_DELIVERY_GRADES
['delivered', 'shortfall', 'none'] as the close row's WC-1 grade (every
member computable from WC-1 facts alone; the four-member
CONTRIBUTION_CLOSE_GRADES vocabulary is NOT minted here -- three of its
four members have no inputs yet, 7.A.3), Herald arrival + close beats,
DM verbs (annotate/forgive-row), display credit chip.

PINS (hardest negatives named):

- THE ARRIVAL-NOT-DISPATCH PIN: a spatial world dispatches a
  contribution with transit > 0; assert ZERO credit rows exist at
  dispatch tick and at every tick before arrivalTick; assert exactly
  one row at arrival. The mutant that writes at dispatch must redden
  it. The aspatial twin pins credit at the bank tick.
- THE INTERDICTED-SHIPMENT PIN: an intercepted consignment writes NO
  credit and books shortfallBand; conservation closes (debited =
  consumed + skimmed + destroyed with arrived = 0).
- THE EXACT-ONCE CLOSE PIN: two termination reads of the same war fold
  ONE archive row. In THIS estate exact-once is two functions, so the
  pin is two pins: the predicate returns true after the first fold
  (contributionCloseWasRecorded), and the appender is itself idempotent
  on a repeated close id (the appendRelationshipCoalitionSettlement
  shape, :273). Each is mutated separately -- deleting the predicate
  call at the caller, and deleting the dedupe inside the appender --
  because a defence-in-depth pair pinned only at the outcome is blind
  to either door (the standing conjunction law).
- THE DECAY-SINGLE-OWNER PIN: a tick with N contribution mutations
  charges obligation decay exactly once (the obligationDecay law).
- FOUR-FENCE dormancy + rng draw-count parity dark/lit.

TUNING (raw-authored): CONTRIBUTION_ARRIVALS_CAP 24; the
troops/supplies band edges (4 bands each); OBLIGATION deposit
magnitude curve (rides the existing obligation cap 1.0).

### WC-2 THE DERIVED STANCE

Dependencies: WC-1.

LANDS: warStanceOf live (derivation over deployments + credit; the
share integral for non-composite worlds degenerates to own-army = 1.0,
so ARC A needs no roster), stanceScalars at the three sites
(warHomeCosts accrual multiplier, warFactorForCasusRead multiplier,
coalitionShares contribution split), the K5 termsWeightRead (credit +
stance; comradeship joins in WC-9), priced shielding through
peaceTermsAppraisal's existing consumer chain, stance chip + war
document rows, the crossing beat (band edge-detect).

PINS: STANCE TOTALITY, KEYED PER EPISODE (1.2.2): every party in every
seeded war EPISODE maps to exactly ONE rung -- the pin iterates
(partyId, warEpisodeKey) pairs, and a party in an episode carrying two
coalition deployments still reads one rung, which is the arm that was
unsatisfiable while the key was the anchor. Unknown facts -> neutral,
never a throw at read time. AT MOST ONE PRINCIPAL PER SIDE PER EPISODE,
never at least one: the three-way-split fixture (0.40 / 0.35 / 0.25)
asserts a legal no-principal side, and the at-least-one mutant reds it.
THE ANCHOR-KEYED MUTANT (re-keying warStanceOf on warAnchorKey) must
red the totality pin on the two-deployment fixture -- that mutant is
the defect this pin exists to hold closed. THE COMMENSURABILITY PIN: a
party fielding a large SEPARATE army on the side reads `principal` when
its episode share is majority, proving the denominator is the SIDE and
not one roster (the roster-denominator mutant reds it, because that
party's anchor share is ~0). PLUS DERIVED-NOT-DECLARED (grep-fence: no
persisted stance field anywhere; the source-scan pin) and a companion
scan asserting NO consumer calls warStanceOf with an anchor key;
the coalitionShares fork pin (dark = strength
split byte-identical; lit = contribution split; BOTH pinned with a
differentiated fixture where the two splits DISAGREE -- the hardest
negative: a fixture where strength and contribution orderings invert,
so a consumer reading the wrong split cannot pass); the
materiel-weaker-grievance pin (casus factor strictly ordered by rung
on a fixed pair). ALIGNMENT LINE: the lit-only coalitionShares
behavior shift is DECLARED here (CR-WC-7); any seeded lit corpus
re-records once, with cause stated.

TUNING: stance thresholds (auxiliary/belligerent share edges,
majority edge for principal), the three scalar curves (exhaustion /
casus / terms by rung -- 5 values each, raw).

### WC-3 THE RELAY

Dependencies: WC-1. Gate note: physical interdiction rows require the
WY encounter TABLE to exist (WY-6 unbuilt at architecture time); the
relay lands with the pressure-side shortfall only, and the E-row slice
is a pre-pinned seam that reds when the table lands without the rows.

LANDS: relayNetwork.js (staging path via candidateRoutes, nearest-ally
staging, entrepot crossing registration, law-band per-hop efficiency
via lawWordFor + the one modulation table, skim credited to staging
stores + booked as shortfall), THE COMRADESHIP TERM PRESENT AND
NEUTRAL in the per-hop read (zero bond = today's arithmetic exactly; it
lights at WC-9, 1.3.2), THE TROOP/STORES FORK (troop columns route the
same roads and take the same interdiction exposure but neither stage
nor skim, 1.3.3), the relay conservation identity taught
to the shipment rebuild IN THE SAME COMMIT (the smuggle:true class),
relay news beats, the twin-note in supplyWebWarfare.js and
relayNetwork.js (pressure vs physical instruments).

PINS: THE RELAY CONSERVATION WALKER (per consignment, debited = arrived
+ consumed + skimmed + destroyed, integer-exact, through at least one
in-transit tick -- never save/load only); the skim-is-theft pin (a
lawless staging hop moves real stores to the stager AND the shortfall
receipt exists -- both facts or red); THE PEOPLE-ARE-NOT- STORES PIN (a
troop column crossing N relay hops arrives with its headcount changed by
NAMED EVENTS ONLY: the per-hop-loss-on-people mutant and the
skim-on-people mutant each red this pin and the conservation walker, and
the walker alone would not name the cause); the lawful-no-skim negative
(a lawful chain produces zero skim across the whole soak corpus); the
entrepot pin (relay crossings move the existing crossing counter --
relay traffic builds entrepots); rebuild round-trip pin through an
in-transit tick.

TUNING: per-band loss fractions (3), skim fraction (1), staging search
depth; all raw, one-law-band-modulated pattern (K7).

### WC-4 STRATEGY AND COERCION

Dependencies: WC-2. Coordination gate: the move VOCABULARY contract
with HB-1 (4.1) -- if HABIT has minted, join; if not, this wave mints
the closed list and HABIT amends.

LANDS: contributionMoves.js -- THE CHOOSER (send-reinforcements-to /
send-supplies-to / recall-support), weighted by relationship, treaty
obligation, distance feasibility (hopWeeks-derived bands, 5.3), own
threat, favor balance, law band, contribution habit (a HABIT read
where lit, neutral where dark).

AND contributionDispatch.js -- THE EXECUTOR (1.1.5), which the volume
named nowhere before round 2 and without which this wave is
unbuildable. It lands with its ASPATIAL / non-composite arm: the
`muster` road (census -> the receiving army's block, effect-time credit
at the bank), the stores road for send-supplies-to through WC-3's
relay, `recall_support`'s reservation clearing, and the RESERVATION
ARITHMETIC (a banded fraction of the sender's own per-tick muster
capacity, held for RESERVATION_HORIZON ticks, summed and clamped at
CONTRIBUTION_RESERVATION_CAP). Its call site is warDeployment.js's STEP
5c -- after applyHomeWarCosts (:1263, verified) and before the tick
return, so a column dispatched this tick cannot arrive this tick. Its
SPATIAL arm (`dispatch` -> `arrival` over a `reinforcement_column`)
lands at WC-6 with the arrival-edge detector. Every event uses WC-0's
frozen EVENT_SIGNATURES, and this wave's ALIGNMENT LINE states that
WC-6's walker is the first commit in which they are PROVEN conserved.

AND THE COERCION GRADIENT AND ITS INVERSE, R6 IN FULL (1.17): occupied
requisition reads the occupation ladder rung
(occupation.js STATE_LADDER :117); elective OVERSHOOT writes loyalty
standing into ALL THREE of the directive's named payoffs -- better
terms (the K5 read), conveyance value (the WR-10 market's appraisal),
and RELEASE, which had no read site at all before round 2 and now
composes into stabilizationSuitability (:386), the existing input to
advanceOccupationState (:442), so a loyal town climbs sooner to the
ladder's top rung `vassalized` (vassalizationOutcomes, :724 -- the
estate's actual release-from-occupation). The REGRESSION and
LIBERATION arms stay resistance's and are never written. Chronic
under-delivery feeds the resistance narrative through occupation's
existing quantities. Plus recall-support as the clean exit (recall
stops future credit; banked credit stands -- lived history).

PINS: move-vocabulary totality + the HB-1 collision fence (a
source-scan pin that exactly ONE module exports the move list); THE
EXECUTOR PINS -- each of the three moves produces exactly its named
events and no others (the unnamed-branch mutant reds the WC-6 walker
once it lands and reds the signature pin here immediately), the step-5c
ordering pin (a contribution chosen at tick T never lands credit at
tick T in a spatial world; the before-home-costs mutant reds because
the sender's own conscription then draws against already-reserved
capacity), and THE RESERVATION PINS (a sender with a live reservation
musters strictly less for itself; the cap holds at
CONTRIBUTION_RESERVATION_CAP so a sender always keeps some capacity;
`recall_support` restores capacity from the NEXT tick and NOT the
current one; a lapsed reservation emits no beat); THE THREE-DELIVERER
COERCION PIN of 1.17.3 (over- / neutral- / under-deliverer against one
occupier: the over-deliverer's release pressure, conveyance read and
terms weight all move, the NEUTRAL deliverer's move not at all, the
under-deliverer's resistance moves and its release does not -- the
standing-deleted mutant reds all three arms, and the
standing-into-regression mutant reds the neutral arm by collapsing a
loyal town's occupation); distance-weight pin (a farther identical
ally is chosen less across the seeded corpus -- distribution pin, not
single-seed; the wave-E single-seed vacuity lesson).

TUNING: the seven move weights; overshoot/under-delivery edges;
CONTRIBUTION_RESERVATION_CAP; RESERVATION_HORIZON.

### WC-5 CALL-INS, EXITS, AND THE DOCTRINE PAGE

Dependencies: WC-1, WC-2. Gates: only the call-in CARRIAGE is gated.
SP-D is UNBUILT (errandMint.js absent at HEAD, verified) and
ENVOY_PURPOSES is closed at two members (envoyErrandVocabulary.js:119),
so the errand purpose class lands as a PRE-PINNED SEAM ROW (the TR-5
pattern: a pin that reds when SP-D lands without consuming it). The
call-in MECHANISM does not wait for it (1.9.1). The doctrine page rides
HABIT r5's axes -- same seam treatment (C2).

LANDS NOW: K8's exits -- the forgiveness gesture (typed, extinguishes
the obligation, archive row), the debt-to-vassalage intent road
through the sovereignty market's existing stages, THE JUBILEE PRODUCER
ALONE (its subject, contribution debt, has existed since WC-1;
AMNESTY'S PRODUCER MOVES TO WC-11, where its subject population is
first minted -- 1.10, F-gate `freeCompaniesEnabled`); and THE CALL-IN
MECHANISM OF SECTION 1.9: the CALL_IN_REQUEST record with its cap,
CALL_IN_ANSWERS, the loaded answer fork (credit balance, comradeship
where lit, own threat, distance, treaty obligation, law band, habit
where lit), the lapse horizon, call-in RIGHTS as a read (indebted
refusal reads breach-grade through treatyBreach's existing grading),
and the OUTCOME AXIS of the close (CALL_IN_OUTCOMES off
readWarTerminations). LANDS AT GATE: the errand purpose class +
registry row; the doctrine reliability rows. LANDS AT WC-9: the HONOUR
axis, when CONTRIBUTION_CLOSE_GRADES has its last input -- the pair is
complete there, and CALL_IN_CLOSE_GRADES is not read by anything
before it is.

PINS: forgiveness-extinguishes pin (obligation gone, archive row
exact-once through BOTH doors, relationship patch fired through the one
writer); the jubilee family-stacking pin (jubilee drafts beside any
economic term without displacing it -- its own family proven; the
amnesty half of this pin lands with the amnesty producer at WC-11); the
AMNESTY-STAYS-DARK pin (with only the jubilee producer live, amnesty is
never drafted anywhere on the seeded treaty corpus -- the vacuous-term
negative, which is the reason the producer moved); the breach-grade
pin (live credit + refused call = breach read; no credit + refusal =
no breach -- the differentiated pair); THE ANSWER-FORK PINS (the fork
is sampled once per request; its reasons are pinned with toEqual; a
comrade-vs-stranger differentiated fixture orders the answer
distribution strictly, and the flat-draw mutant reds); THE LAPSE PIN
(an unanswered ask past its horizon reads `lapsed`, never `refused` --
silence is not a refusal, and the grading must not teach that it is);
the two seam rows (SP-D, HABIT) each with an executed red-capability
proof.

TUNING: breach-grade threshold band; jubilee appraisal weights (raw,
unconsumed until drafted; amnesty's land with its producer at WC-11);
CALL_IN_REQUESTS_CAP 24; CALL_IN_HORIZON_TICKS; the six answer-fork
weights.

## ARC B -- THE COMPOSITE

### WC-6 BLOCK ROSTERS AND THE CONSERVATION WALKER

Dependencies: WC-1, WC-4 (this wave takes contributionDispatch.js's
SPATIAL arm; the aspatial arm landed at WC-4). OPENS with the
armyTransitKernel decomposition
(armyTransitEnvoy.js extraction, behavior-frozen, goldens before and
after -- a pure-motion commit distinct from the behavior commit;
CR-WC-9 coordinates the field batch with WY-8a's owner table).

LANDS: warBlockRoster.js + blocks[] on deployment records
(compositeArmiesEnabled), the transit projection field, the
blocks-vs-leviedPopulationBySource reconciliation, the arrival edge
detector in the mover kernel (the bank moves to arrival under the
flag + spatial canon -- THE DECLARED LIT-ONLY SHIFT), THE SPATIAL ARM
OF contributionDispatch.js (`dispatch` -> `arrival` over a
`reinforcement_column`, whose CLASS was registered at WC-0 and is used
here for the first time -- this wave is the first producer of any
military column), share-integral accumulators at BOTH altitudes
(per-roster and per-episode, 1.2.2, from one arithmetic), the
episode-share accumulator's anchor -> episode map,
peopleLedger.js live, and THE
CONSERVATION WALKER v1 over the census/block/column pools and their
events: muster, dispatch, arrival, depart, arrive_home, fell (with its
column arm), mortality, and dm_removed as a DECLARED sink -- EACH WITH
ITS TAG ARM where it debits census (0.2), so the walker checks the tag
selection in the same pass. Later waves
add the free_unit events (fission, orphan, rejoin, shed, enlist,
defect) to the same closed list, each IN THE COMMIT that mints its
mover.

PINS (hardest negatives):

- THE CONSERVATION WALKER ITSELF: seeded multi-war worlds, every
  tick, the section 0.2 identity integer-exact. Its RED-CAPABILITY is
  proven at landing by executing a one-count-drop mutant on each
  branch (a walker that cannot redden is not a guard).
- THE RECONCILIATION PIN: sum(blocks[].headcount) ===
  deployedPopulation AND per-origin equals leviedPopulationBySource,
  every tick, every seeded war.
- THE RECONSTRUCTION-ATTRIBUTION PIN: no call site splits an id on
  "." (source-scan, the WR-8 law); apportionment reconstructs from
  the banked map.
- THE BANK-MOVES pin pair: dark/aspatial = bank at muster
  (byte-identical to today); lit+spatial = bank at arrival; both
  executed. THE SWEEP'S ARM of this pair runs on a CONSTRUCTED levy
  fixture with a non-emptiness assertion first, per WC-1's corpus note:
  war_levy is MEASURED SILENT and a seeded-corpus assertion here would
  be vacuous.
- THE COLUMN KEY-COLLISION PIN, LANDING HERE (moved out of WC-13,
  where it sat seven waves after the first military column existed): a
  `reinforcement_column` and a demographic column on the SAME
  origin/dest/tick coexist without collision, because the class is in
  the key (migration.js:553, verified). The class-out-of-key mutant
  reds. WC-13 re-exercises the same pin for `shed_column`.
- normalizeDeployments fail-closed arm: a smuggled malformed blocks[]
  in a save file is dropped whole, never partially honored.

TUNING: none new (the roster carries no constants; bands come with
their readers).

### WC-7 REALIZED STANCE AND THE CROSSING

Dependencies: WC-2, WC-6.

LANDS: the time-integrated share feeding warStanceOf for composite
armies; the crossing edge-detect + mission-creep beat; DEPENDENCY RISK
(both strategists read the ratio via own-sheet truth -- the
outboundImpression zero-import template for "what do we know of our
own army" -- and get forks about it); the enemy's BELIEVED share
(composition news entries at crossings, hop-worn; the enemy casus read
takes the believed band); the ES composition-intelligence tap PRODUCT
row (spies count banners -- gated on espionageEnabled, the existing
gate conjunction).

PINS: THE RUNG-SWAP PIN (the flagship negative of the derived ladder,
1.2.2): a reinforcer's integrated share crosses 0.50 against a
DECLARER-OWNER, and the pin asserts that the two rungs EXCHANGE -- the
reinforcer reads `principal`, the declarer-owner reads `belligerent` --
and that ALL FOUR scalars (exhaustion accrual, casus exposure, terms
weight, spoils split) re-derive from that one read, for BOTH parties,
in the same tick. The declarer-disjunct mutant -- restoring "or is the
war's original declarer with a fielded army" -- must red it: that
mutant IS the priced-shielding hole the derived ladder exists to close;
THE INTEGRATION PIN (the share integral is event-updated only:
a tick with no roster events changes no accumulator -- the
per-tick-integral mutant reds); the crossing-beat exact-once pin
(band edge-detect fires once per crossing, not per tick spent across
the edge); THE BELIEF-LAG PIN (hardest negative: the enemy's casus
read moves ONLY after the composition news arrives -- a fixture where
truth crossed at tick T and news arrives at T+k pins the enemy read
flat through T+k-1; omniscient mode pins immediate); raw-share
non-exposure (proseNumerics + a grep fence: no surface renders the
raw integral).

TUNING: crossing margin (the hysteresis dead zone for the stance
band, shared shape with K2), composition-news significance class
(BORROWED from SIGNIFICANCE_CLASSES, never minted).

### WC-8 THE BLOCK FORKS

Dependencies: WC-6. (WC-7 not required: forks read stance only through
banked facts.)

LANDS: blockForks.js -- the news gate (rumor arrival + army staleness
join), BLOCK_FORK_OUTCOMES, law-band cohesion (one-draw / fragment /
majority-split), the four outcomes wired to people-ledger events
(stay; return = depart + arrive_home; defect = block transfer
conserved; resist = the same return pair plus the resistance feed),
PLUS joinPreference.js -- the shared join scorer (1.5.2) minted HERE
because WC-8 is the first consumer, with the closed defect-candidate
set (co-located or one hop; holds the block's home, or is at war with
the block's current owner) and its typed reasons; WC-11's free units
consume the same leaf unchanged, occupied-block WATCHED taint (ES read),
occupied-home credit continuation (a stay block still earns home
credit), fork receipts with loading factors as typed reasons, fork
beats.

PINS (hardest negatives):

- THE NEWS-GATE PIN: a defection fork evaluated before the triggering
  event's news arrival record exists at the block's location is RED
  (the pin constructs the in-flight window explicitly: occupation at
  tick T, hop-worn arrival at T+k, assert no fork in [T, T+k), fork at
  T+k). The omniscient-mode twin pins the immediate fork. The mutant
  that reads ground truth instead of the arrival record must redden
  the lagged pin.
- THE COHESION PIN: a lawful block's outcome is single-valued (whole
  headcount, one outcome); a chaotic block's fragments sum exactly
  (largest-remainder); the law-word is read through lawWordFor and a
  non-member word NULLS the row upstream (the closedValue discipline)
  rather than mis-grading.
- THE CONSERVED-DEFECTION PIN: defect moves the block whole into the
  receiving army's roster (blocks', leviedPopulationBySource'), and
  the walker still closes -- the defection-as-sink mutant reds the
  walker.
- THE DEFECT-TARGET PIN (the wave is unbuildable without it): the
  receiving army is DETERMINISTIC under the seed, drawn from the closed
  candidate set, and the selection reasons are pinned with toEqual. An
  empty candidate set re-normalizes the fork over the remaining
  outcomes -- the silent-stay mutant reds. The single-scorer fence is a
  source scan: joinPreference.js is the only module exporting a join
  weight, so WC-11 cannot grow a second one.
- Credit-continuation pin: occupied home, block stays, credit rows
  keep accruing to the home pair.

TUNING: fork loading weights (six factors); cohesion fragmentation
curve (the law-band table row).

### WC-9 THE SERVICE INTEGRALS

Dependencies: WC-3, WC-5, WC-6 -- CORRECTED IN ROUND 2 (7.F). WC-3
supplies `betrayed`'s skim input; WC-5 supplies `partial`'s askedBand
and `unanswered`'s live call-in. The old single WC-6 edge contradicted
this wave's own LANDS text. (Feeds WC-2's K5 read its comradeship
term.)

LANDS: serviceIntegrals.js -- blend absorbed/imparted (share-scaled
asymmetry), comradeship pair integrals (duration x hardship from the
engagement-close severity band), drift accumulator + K2 hysteresis
expression, betrayal-priced-by-intimacy (resentment magnitude scaled
by banked comradeship inside the existing rule bodies), the war-close
comradeship fold (relationship patch + shared_service archive row),
K5's termsWeightRead gains its comradeship term. AND THE TWO ROWS THAT
WAITED FOR THIS WAVE'S INPUTS: (1) CONTRIBUTION_CLOSE_GRADES
(honored | partial | unanswered | betrayed) is minted HERE, not at
WC-1 -- `betrayed` needs skim (WC-3) and comradeship (this wave),
`unanswered` needs a live call-in (WC-5), and `partial` needs the
request record's askedBand (WC-5); the close row gains its `grade`
field beside the WC-1 `deliveryGrade`, and CALL_IN_CLOSE_GRADES'
honour axis completes here (1.9.3). (2) THE RELAY COMRADESHIP TERM
lights: 1.3.2's neutral per-hop term takes its value, with
RELAY_COMRADE_BONUS authored in this wave's tuning. (3) THE COMRADE
FIDELITY RIDER of 1.6.4 -- directive (h)'s "COMRADES KNOW EACH OTHER",
which before round 2 lived as one sentence in a coordination contract
with no wave, no pin and no tuning row while its sibling rider
(betrayal by intimacy) had all three. comradeFidelity01 composes into
the believed-doctrine read as a bounded error reduction, capped by
COMRADE_FIDELITY_MAX (< 1.0, so no bond ever buys a perfect read), and
is GATED on HABIT r5's axes like every other believed-doctrine read
here: a pre-pinned seam row with its executed red-capability proof
until HABIT lands.

PINS: the asymmetry pin (a minority block's absorbed blend exceeds
the majority's on the same campaign; imparted inverts -- the
differentiated fixture); hardship-not-victory (a lost siege's
co-besiegers bond at the same rate as a won one's, intensity equal);
THE HYSTERESIS PIN (an accumulator oscillating within the dead zone
never moves the expressed band -- the band-flapping mutant reds);
betrayal-intimacy ordering (the same betrayal between comrades vs
strangers produces strictly ordered resentment); event-updated-only
(the per-tick mutant, as WC-7); THE FOUR-CONSUMER PINS of directive
(h), one per consumer, because a clause with four named consumers and
zero pinned reads is a clause honored in prose only: (a) the RELAY pin
-- an identical consignment over an identical chain loses strictly less
between comrades than between strangers, and the term-deleted mutant
reds; (b) the ANSWER-WEIGHT pin -- the 1.9.2 fork's comrade fixture
answers measurably more often than its stranger twin; (c) the
ALLIANCE-ODDS pin -- a comradeship fold moves
readCoalitionJoinDecisions' appetite through pactStrength/trust
(warCoalitionDecision.js:108-109), asserted as a real read, not
assumed; (d) the CARAVAN-DENSITY row -- a WY-3 seam row with its
executed red-capability proof, since the consumer does not exist yet.
THE COMRADE-FIDELITY PIN (1.6.4, differentiated and BOUNDED, both
halves in one fixture): the same subject read by a former co-belligerent
and by a stranger yields a STRICTLY LOWER belief error for the comrade,
AND the anticipation DEPTH is identical in both -- comradeship buys
accuracy, never a level, so the habit directive's level-ONE bound is
composed with rather than bent. Three mutants: the term deleted (the
ordering collapses), the cap removed (the comrade read becomes exact,
which the fog laws forbid), and the depth raised (the second assertion
reds). Its seam twin proves the pin CAN red before HABIT lands.
GRADE TOTALITY: every (pair, war) close maps to exactly one
CONTRIBUTION_CLOSE_GRADES member on the seeded corpus, all four members
reachable (the dead-arm census; `partial` is reachable only because the
request record exists, which is the whole reason it moved to this
wave).

TUNING: blend/comradeship accrual curves, THE LAW-BAND TABLE'S DRIFT
CURVE ROW (registered into WC-0's shape, per 2.2), hysteresis margins,
the betrayal intimacy multiplier curve, RELAY_COMRADE_BONUS,
COMRADE_FIDELITY_MAX, the call-in answer's comradeship weight. This is
the volume's densest tuning cluster; every constant carries its in-file
one-liner.

### WC-10 ENDURANCE AND CONCENTRATION

Dependencies: WC-3, WC-6. HARD GATE: WY-8a built (armySupply.js, F9
supplyCargo -- owner-SIGNED under the blanket sign-off of 2026-08-05,
but UNBUILT at architecture time; the envelope needs carried supply
to exist). This wave is a spec row until the gate clears (CR-WC-14).

LANDS: enduranceEnvelope.js (carried + relay throughput over
mass-and-season-scaled burn), the carrying-capacity network read, the
massing tell (a concentration is a map body at news speed -- a rumor
carrier entry per the additive-carrier shape), the temporal
strategist fork (mass / wick-apart), PARTIAL WICK-APART (selector-
ordered block release: weakest bonds, nearest homes, believed
homes-under-threat, longest-served -- each exhale a small homecoming
running the WC-13 arithmetic when that lands; before WC-13, wick-apart
routes blocks home whole through the existing return road), K4's
dueling-envelopes siege read + siege document surface.

PINS: the envelope monotonicity family (more relay throughput = never
shorter; more mass = never longer; seasonal severity = never longer);
the supply-consequence clause pin (envelope exhaustion drags the
army's OWN accumulatedAttrition and NEVER realm warExhaustion -- the
one-clause veto, executed as a write-set assertion); the massing-tell
pin (a concentration event exists in the rumor ledger at the
concentration tick, hop-priced); wick-apart selector ordering pin
(the selectors are a stated total order; the shuffle mutant reds).

TUNING: burn-rate curve, mass scaling, the never-hit renderer guard
ceiling (documented as a guard with its not-load-bearing pin).

### WC-11 FISSION AND FREE UNITS

Dependencies: WC-8, WC-9, WC-10 -- CORRECTED IN ROUND 2 (7.F): WC-8
mints the ONE joinPreference.js scorer this wave consumes unchanged,
and lay on no path to this wave under the old edges. OPENS with THE
COUNTS-MOVER MANIFEST -- a
SECOND totality manifest, not a widening of law M (1.7.3 corrects the
earlier framing: MOVEMENT_SITES is a named-person physics census by its
own header and discovery signature, and pushing a counts-mover into it
would contradict CR-WC-2). The new manifest carries its own discovery
signature over the counts steppers that exist today
(armyTransitKernel.js's stepArmyPosition calls at :467/:502/:698/:742,
migrationKernel.js's releaseMigrationArrivals at :336) and gains
freeUnitKernel.js in this wave, BEFORE the stepper lands. CR-WC-10
carries the chair ask.

LANDS: freeUnits.js + freeUnitKernel.js (the ledger, fission along
the comradeship graph with whole origin blocks, FREE_UNIT_STATES,
independent operation, join preference through WC-8's SHARED
joinPreference.js -- consumed, never re-minted -- forage -> plunder
escalation, peace-at-road-speed staleness), THE AMNESTY PRODUCER AND
ITS EXECUTOR TOGETHER (moved here from WC-5: the CLASS_TERM producer
lights the WC-0 catalog row, gated on `freeCompaniesEnabled` by name
in conjunction with the arc flag, fail-closed, and the free-unit
disposition hook is the executor -- producer and subject population
arrive in the same commit), dissolution reuse of the fission cutter at
war end.

PINS: fission-graph pin (the cut severs the weakest banked bond;
origin blocks never split at fission -- the block-split mutant reds
the walker AND this pin); the war-ended-unknown pin (hardest
negative: a free unit beyond news reach continues operating after
termination; assert its state unchanged until the arrival record
exists, then the stand-down fork fires -- and the ground-truth-read
mutant reds); join-preference slider pin (zero drift = pure home
alignment; deep drift = measurably shifted preference on a
differentiated fixture -- run against the SAME leaf WC-8 pinned, and a
second-scorer plant reds the source scan); THE COUNTS-MOVER MANIFEST
PINS (every discovered counts-stepper is a manifest row and every row
is still discoverable -- the same shape as law M, over a disjoint
signature; a stepper-without-row plant is caught, and a planted
named-person token does NOT enter this manifest, which is what proves
the two censuses stayed disjoint); THE AMNESTY GATE PINS (with
freeCompaniesEnabled dark, amnesty is never drafted on the seeded
treaty corpus; lit, it drafts and its executor disposes real free
units -- the vacuous-term negative and its positive, both executed).

TUNING: fission threshold slack, forage escalation bands, join
preference drift weighting.

### WC-12 BRIGANDAGE AND THE EMBATTLED STATE

Dependencies: WC-11. Encounter rows E16 (brigand x settlement) and
E17 (column x host) land in the SAME COMMIT as their resolvers if the
WY table exists; else pre-pinned seam rows (as WC-3).

LANDS: brigandContest.js (nearest-settlement targeting by road +
warmth; hostile = prey never parking; the repel/embattled contest on
defenseLedger military + internal; the embattled stressor injected
through normalizeStressor with a typed source reference;
EMBATTLED_RESOLUTIONS; buy-off as a graded close -- tribute teaches
raiding pays), embattled crime coupling (the CRIME_ARCHETYPES member +
the smuggling-to-besiegers loop; espionage porosity composes through
the EXISTING crime term), the carrying-capacity map cap live (excess
mass shortens envelopes network-wide), suppression demand into the
mercenary market.

PINS: the contest pin (repel and embattled both reachable on the
seeded corpus -- a dead-arm census; the capacity-ratio POINTS-GAP
lesson applied: band edges derived from the measured defense
distribution, 5.5); ONE-STRESSOR pin (the embattled stressor is the
ordinary catalog stressor, deduped by canonical id -- the
parallel-stressor mutant reds); the buy-off-teaches pin (a buy-off
close writes the graded close the habit system will read; the
no-close mutant reds the seam row); crime-composition pin (the worse-
of discipline holds -- no blended fourth spelling; source-scan).

TUNING: contest thresholds (derived-from-distribution, then frozen),
buy-off price bands, embattled trade-interdiction severity.

## ARC C -- THE PEACE'S PEOPLE

### WC-13 HOP-AND-SHED AND THE ONE ABSORPTION MARKET

Dependencies: WC-11. (Migrant-side machinery exists; the military
column classes join it.)

LANDS: (the COLUMN CLASS VOCABULARY AND THE FROZEN UNION MOVED TO
WC-0 in round 2 -- a closed vocabulary belongs in the vocabulary wave,
and leaving it here left WC-6 needing `reinforcement_column` and
`veteran_return` seven waves before they existed, a wave-order
violation the dependency graph could not express. This wave now
CONSUMES the union it once minted.) moverAbsorption.js (shared parking
strategy: capacity search, shed apportionment town by town, the host
rejection fork loaded by density/relationship/law/fear,
rejected-moves-on-hungrier escalation into WC-12's brigand branch),
the shared absorption market (military columns enter
competeForDestinations' existing competition), THE SHED EVENT IN ITS
FINAL FORM -- free_unit|column -> census WITH the cohort tag written in
the SAME event, which is why residentCohorts.js (the tag ledger's one
writer) lands HERE and not at WC-15: the earlier plan had WC-13 credit
census with a tag "banked in the column record" and WC-15 then move
those counts into a cohort ledger, a census -> cohort transfer that
appears in no event list this volume has (0.2's ruling closed it) --
and foreign-homecoming arithmetic per shed (homecomingEffects).

PINS: the key-collision pin RE-EXERCISED for `shed_column` (the pin
itself lands at WC-6 with the first military column); the competition
pin (a bad-peace fixture floods both
column kinds; assert later columns hop further -- the market is one);
the rejection-hunger pin (a rejected column's next contest is
strictly hungrier; the town-that-turned-them-away fixture ends in a
brigand arrival -- the directive's own sentence, executed); shed
conservation (every shed integer-apportioned, walker closes); THE
TAG-LEDGER TOTALITY WALKER over 1.13.1's THREE laws, not the single
sum an earlier drafting stated (which the volume's own multi-tagging
rule falsified): LAW 1 cohort rows sum to at most census, LAW 2 the
free-lance overlay is at most census, LAW 3 free_lance is the only
overlay. FOUR mutants are executed -- a tag written without its census
credit (the double-count), a census credit written without its tag (the
lost cohort), a census DEBIT run without its tag arm (the phantom
garrison, which is the mutant that used to be the DESIGN and made
WC-16's fork pin unpassable), and a second overlay planted (LAW 3).
This walker is what makes WC-15 a read-only wave over people.

TUNING: density-capacity edges (derived from the measured absorption
distribution), rejection loading weights, shed quantum bands.

### WC-14 HOMECOMING AND THE PULSE

Dependencies: WC-13. (Also lights the (d) landing and (e).)

LANDS: the full proportional-homecoming double effect (one function,
two consumers: destabilization = share x drift depth; defense
recontribution = same share), introduction attempts as the FOURTH
traditions relation pass (typed attempts, receptivity contest, most
fail; adoptedFrom = origin mix; faith exposure as the bounded
sanctioned nudge), demobilizationPulse.js (institution supply raises
where veterans pool, founding through INT leaves, peace decay;
orphan branch -> free-lance pool; the world generates its own
adventuring class as institutions + counts), the
demographic-signature-of-a-peace receipts (shed/homecoming rows
addressed and archived).

PINS: the double-effect pin (one fixture, both effects, SAME share
value read from ONE call -- the two-computations mutant reds); the
most-attempts-fail pin (across the seeded corpus, introduction
adoption rate lands inside an authored band; the always-adopt mutant
reds); the founding pin (an institution founds only above the pooled
threshold and decays through peace -- both directions executed); the
ORPHAN PIN, RE-AIMED at the routing this volume now states (1.12.5): a
destroyed-home block becomes a FREE UNIT (`orphan`), walks, and reaches
a settlement only through `shed` -- census credit plus a free-lance tag
at exactly ONE addressable host. The pin asserts the addressability (no
counts are ever written to a razed settlement's row, which does not
exist) and that the walker closes at every hop; the
block-straight-to-free_lance mutant reds, because that arm is no longer
in the event table.

TUNING: receptivity weights, pooling thresholds, peace-decay bands,
destabilization severity curve.

## ARC D -- THE DOMESTIC DIVIDEND

### WC-15 RESIDENT COHORTS AND DIASPORA BONDS

Dependencies: WC-13 (sheds; and the tag LEDGER itself, whose one
writer landed there under moverAbsorptionEnabled), WC-14 (returns).
veteranCohortsEnabled trio gates the READS this wave adds -- mortality
fade, age bands, and the four bond expressions -- not the ledger, which
already exists and is already conserved. GATED ON CR-WC-21 for the
age-band stepping rule (1.13.2).

LANDS: over the tag ledger WC-13 already writes (residentCohorts.js
gains no new people arithmetic here): the year-fold mortality debit
pro-rata by the settlement's own realized death fraction, in the same
fold as the census `mortality` event it partitions; COHORT_AGE_BANDS
steps -- WHOSE STEPPING RULE IS UNRULED, see the pin note below and
CR-WC-21; the `untag` and `demobilize` tag events (`untag` carrying
its RESIDENCY_TAGS kind: the naturalization the earlier drafting
called `absorb`, AND the free-lance retirement that had no named event
at all -- 0.2);
diasporaBonds.js derived reads (host/origin, asymmetric,
recency-weighted by band), the four expressions as read-time
modulations (trade affinity, war reluctance strategist weight, aid
warmth, espionage-ease term composed into the existing infiltration
read), cohort chips + tables.

PINS: MORTALITY-IS-THE-DECAY pin -- CARRIED IN BOTH VARIANTS UNTIL
CR-WC-21 IS RULED, because the two arms are mutually exclusive and the
volume will not pick by coin flip (1.13.2 states the contradiction in
full). VARIANT A (bands step on mortality-realized composition): the
hardest negative stands as written -- a world whose settlement death
rate is zero decays NO bond, and the calendar-decay mutant, which fades
a cohort by elapsed time alone, must red. VARIANT B (bands stay
calendar): the pin asserts only that the COUNT-driven term is
mortality-driven, the recency term is declared a second and
calendar-driven decay term, and 5.1's zero-decay-laws claim plus the
RECENCY_WEIGHTS row are amended in the same commit. Either way a
mortality spike measurably accelerates the fade -- that half is not in
dispute and is pinned now; the embodied-vs-institutional pin (sixty-year
fixture: cohort retired, bond reads neutral, the introduced tradition
STILL PRESENT in the traditions mirror -- both facts asserted); the
no-new-decay-law fence (source-scan: no Math.pow half-life and no
bandedStock call in the cohort path -- the decay is demographic, 5.1;
under variant B this fence keeps its source-scan shape but its DOC claim
narrows, which is the honest cost of that arm); cohort conservation at
the year fold (tag debits equal the pro-rata share, integer, the
tag-totality walker closes and the people walker never moved); THE
SELF-ORIGIN PIN, BOTH HALVES IN ONE FIXTURE (1.13.1): a settlement with
a self-origin veteran row and one foreign-origin row asserts that
veteranReads reads a NONZERO living cohort AND that
hostReadsResidents(S, S) is ABSENT -- absent, not zero, so no consumer
can average it in -- while hostReadsResidents(S, foreign) is nonzero.
The self-row-deleted mutant reds the veteran half; the
self-row-admitted mutant reds the diaspora half. Two waves needed
opposite answers about this row and the volume gave neither until round
2 (5.5 carries the class note); `untag`'s kind totality (its kind set
equals RESIDENCY_TAGS, with a planted fourth kind caught).

TUNING: age-band edges (year-denominated, inside the sub-century
ruling CR-WC-4), recency weights, the espionage-ease magnitude.

### WC-16 VETERANS AND THE ORDER DIVIDEND

Dependencies: WC-15.

LANDS: veteranReads.js (the three reads: readiness term at
warCapabilityOf + martialReadiness; defense term at the defenseLedger
read sites; crime-suppression term at the live crime read -- ALL THREE
over the SELF-ORIGIN cohort row that 1.13.1 now states exists and that
WC-13 already writes),
veterans-first muster WITH ITS SELECTION AND ITS TAG ARM STATED
(MUSTER_VETERAN_PREFERENCE of the levy drawn from the `veteran` cohort
rows first, largest-remainder in codepoint origin order, balance from
untagged census, then pro-rata -- AND those rows DEBITED in the same
event, plus the `untag` of any drawn person's free_lance overlay: 0.2's
tag arm, without which this wave's flagship pin is unpassable;
inherited character = drifted temperament rides the veteran blocks;
greener-armies falls out of conservation), the field-or-garrison
strategist fork (loaded, receipted), comradeship reactivation on
re-muster (affinity seeds from shared_service archive rows), the (p)
symmetry surfaced in prose (welcomed vs turned away).

PINS: the three-reads-one-cohort pin (one cohort mutation moves all
three reads coherently; the stale-read mutant -- one read caching
independently -- reds); LIVE-NOT-FROZEN fence (source-scan: no
veteran term touches defenseProfile.scores; census B question 10's
trap closed structurally); the greener-armies pin (two consecutive
seeded wars: the second muster's veteran fraction is strictly lower
when the first war's fell exceeded replacement -- the demographic
anti-war pressure, executed); THE FIELD-OR-GARRISON DIFFERENTIATED PIN,
NOW PASSABLE (same cohort, both fork arms, opposite home-defense
deltas): the FIELD arm debits the veteran cohort row, so veteranReads'
defense and crime-suppression terms both FALL in that tick, while the
GARRISON arm holds the row and both terms stand -- directive (p)'s
"muster the veterans and you soften the walls, embolden the alleys, and
invite the brigands", arithmetic at last. THE MUTANT THAT MUST RED IS
THE OLD DESIGN: a `muster` with its tag arm deleted leaves the cohort
untouched, both arms read identically, and the pin collapses -- which
is exactly why it could not be written before round 2. A companion arm
asserts the embattled contest (1.8.1) moves with the same read, since
it keys on defense + internal security;
reactivation pin (a re-muster between former co-belligerents seeds
nonzero affinity; strangers seed zero).

TUNING: the three read magnitudes, muster preference weights.

---

# SECTION 4 -- THE COORDINATION CONTRACTS

Explicit shared-vocabulary and shared-machinery contracts with the
three sibling volumes and the built WR surfaces. Each contract names
the OWNER of the shared thing, the CONSUMER, and the seam enforcement.
The directive's own instruction ("COORDINATE with HB-1's
move-vocabulary mint") is contract 4.1.1.

## 4.1 HABIT (the habit-conditioning directive; NOT YET ARCHITECTED)

### 4.1.1 The strategist move vocabulary (collision C1 -- the highest-value collision)

MEASURED FACT (verified at HEAD): settlementStrategy.js has NO closed
exported move vocabulary today -- enumerateMoves is module-private at
:634 with a bare re-export at :1360. Both volumes want to mint the
closed list.

THE CONTRACT: exactly ONE module exports the closed move vocabulary,
whichever volume BUILDS ITS STRATEGY WAVE FIRST mints it as a
dependency-free leaf (strategyMoveVocabulary.js or HB-1's chosen
name); the second volume AMENDS the same leaf (an additive, closed
widening) and does not mint. This volume does NOT mint move names the
habit volume also wants: the three auxiliary moves
(send_reinforcements_to / send_supplies_to / recall_support) are
registered in this volume's WC-4 ONLY through that shared leaf.

THE ENFORCEMENT MOVED, BECAUSE THE OLD ONE WAS ONE-SIDED. A
source-scan pin that only exists once WC-4 builds cannot restrain the
volume that builds FIRST: if HABIT mints before WC-4, nothing in the
tree stops a second mint, and the habit-conditioning directive is NOT
YET ARCHITECTED, so no sibling volume carries the reciprocal clause
today. Two repairs, both owed at this volume's fold:

- STRUCTURAL: the single-exporter source scan lands in WC-0, the
  registration wave, pinned at AT-MOST-ONE (zero is the tree's legal
  state today; two is never legal; the walker tightens to exactly-one
  in whichever volume mints). The fence therefore exists BEFORE either
  volume's strategy wave rather than as a consequence of one of them.
- ARTIFACT (the inbound half, owed by this volume, recorded here
  because this pass is read-only against the repo): the same
  arbitration must be written INTO the habit-conditioning directive's
  memory file as an INBOUND OBLIGATION on HB-1, and carried as a row in
  FABLE_VALIDATION_QUEUE.md so it is visible to whichever lane builds
  first. The owner's instruction is itself two-sided -- the auxiliary
  moves "must join that mint or amend it AT THIS DIRECTIVE'S FOLD" --
  and a contract written in only one of two volumes is a contract with
  one signature. Until both artifacts exist, the arbitration is a
  RECOMMENDATION with a fence, not a contract.

Arbitration rulings live with the chair
(CR-WC-1); the recommendation is HABIT mints (the chooser is habit's
subject matter; WC's three moves are an amendment), with WC-4
re-slotting after HB-1 if the build order says HABIT first.

### 4.1.2 The law-band modulation table (collision C3)

ONE frozen table, four consumer families: HABIT r16 learning
rate/decay, WC relay efficiency (1.3.2), WC block cohesion (1.5.2),
WC drift expression (1.6.3). Same mint-first arbitration as 4.1.1 AND
THE SAME TWO REPAIRS: its single-exporter source scan lands in WC-0
beside the move-vocabulary fence, and the inbound obligation on HB-1 is
written into the habit directive's memory file and the validation queue
at this volume's fold. The asymmetry is identical and so is the cure;
the table is a zero-import leaf either way (lawWordFor's three words
are the only vocabulary it may key on; no fourth word ever -- the
lawWord law). Each consumer may carry its own CURVE ROW in the one
table; none may carry a private table. AND THE ROW LANDS WITH ITS
CONSUMER, NOT WITH THE TABLE: WC-0 registers the table's SHAPE (closed
key set, throw-on-unknown, totality export, the registration entry
point) and NO VALUES, because a curve is a constant and constants are
owner-signature surface under THE PROMISE -- landing four of them in
the wave whose closing line reads "TUNING: none" is exactly the drift
the versioned-tuning carve-out exists to stop. WC-3 supplies the relay
curve, WC-8 the cohesion curve, WC-9 the drift curve, HABIT the
learning curve, each in that wave's 7.B block. The table's totality pin
therefore asserts that every REGISTERED key has a curve and every curve
names a registered key, never that the table is full at WC-0.

### 4.1.3 Believed doctrine (collision C2)

HABIT r5 MINTS the believed-doctrine axis family on SP-B's machinery;
this volume CONSUMES (R9's reliability page, (f)'s believed share,
(h)'s comrade accuracy) and mints no axis. COMRADE ACCURACY IS
ARCHITECTED AT 1.6.4, NOT HERE: this contract used to be its only home,
which made an owner rider with a named payoff into one sentence inside
a coordination note -- no model section, no wave, no pin, no tuning
row, while its sibling rider (betrayal by intimacy) had all four. It is
a bounded fidelity modifier on the existing belief reads
(comradeFidelity01, capped by COMRADE_FIDELITY_MAX < 1.0), not a new
channel, and it improves the ACCURACY of HABIT's level-one anticipation
without raising the LEVEL -- the composition with the habit directive's
"anticipation bounded at level ONE" is stated in 1.6.4 and pinned at
WC-9. Until HABIT lands: pre-pinned seam rows (WC-5 for the reliability
page, WC-9 for the fidelity term).

### 4.1.4 Graded closes

Every WC fork that should teach (the call-in answer, the block fork,
the host rejection, the buy-off, the muster fork) emits a HABIT-shaped
graded close where HABIT is lit, and a deferred-with-reason row where
it is not. HABIT r17's named-domain checklist gains the auxiliary
rows at ITS fold; this volume's closes are enumerated in WC-5, WC-8,
WC-12, WC-13, WC-16 for that checklist to consume.

## 4.2 WAYFARE (DESIGN_FP_ARCH_WY.md, 1654 lines, promoted; program unbuilt)

- SUPPLY IS WY'S: F9 supplyCargo on armyTransit records, ONE writer
  armySupply.js, flag armySupplyEnabled, wave WY-8a. F9 is
  owner-SIGNED under the blanket sign-off (2026-08-05) but UNBUILT.
  This volume's carried-supply consumers (WC-10 envelopes, WC-11
  starvation) HARD-GATE on WY-8a's build; the relay (WC-3) moves
  stores through supplyShipments and does not touch F9. Auxiliary
  supply rides the supplyShipments link chain for settlement-to-army
  consignments and F9 for what the army CARRIES -- two different
  conservation identities, deliberately not merged (census D question
  5, resolved: carrier = shipments, cargo = F9).
- THE THREE-EXHAUSTIONS CLAUSE: restated as this volume's one-clause
  veto in section 0.3; every supply consequence writes the army's own
  accumulatedAttrition, never realm warExhaustion.
- ENCOUNTER TABLE: every new co-location resolver adds its row IN ITS
  OWN COMMIT (E16 brigand x settlement, E17 column x host), moving
  the closed table's anti-vacuity count; the table is WY's; the rows
  are this volume's.
- DISTANCE: hopWeeks/calibration is the ONLY distance law (per-digest
  calibration; every WC band derives from the published calibration
  or carries the WY-1 ordering note, 5.3). kmScale does not exist at
  HEAD; if WC bands land before WY-1's spectrum surface, each carries
  an in-file derivation note and a shrink-only census row that WY-1
  closes (CR-WC-15).
- COLUMNS: MigrationColumn is WY/POP's object; this volume WIDENS the
  class list and adds no second column ledger (1.12.2). The
  travelClass-in-the-key discipline is preserved verbatim.
- THE MOVEMENT MANIFEST: law M is NOT widened. Measured at HEAD,
  MOVEMENT_SITES (tests/lint/namedPersonTransitTotality.walker.test.js)
  is a NAMED-PERSON leg-physics census by its own header and by its
  discovery signature; armyTransit is out of its scope, not exempt from
  it, because it moves counts. WC-11 therefore mints a SECOND,
  counts-mover manifest with its own signature (1.7.3), leaving WY's
  law and its header untouched. CR-WC-10 asks the chair to approve the
  second manifest; WY seam 6's filed candidate is answered by it, not
  by an edit to WY's guard.
- ARRIVAL EDGES: the army-side arrival edge detector minted in WC-6
  is offered back to WY-8a as the shared edge (one detector, two
  consumers), coordinated at the fold.

## 4.3 ESPIONAGE (DESIGN_FP_ARCH_ES.md; ES-0 landed, waves in flight)

- TAP PRODUCTS, NEVER TAP LEVELS: TAP_LEVELS is closed at three with
  the derived-assignment rule (J-ES-16). This volume adds PRODUCTS:
  ally-reliability (R9), army-composition intelligence ((f) -- spies
  count banners), and the WATCHED taint read on occupied-origin
  blocks ((c)). Each is a product row through ES's existing product
  registration, ranked by TAP_DEPTH, never by array index.
- THE CASUS DISCIPLINE (ES section 5 row 1): a new casus is a
  war-surface change costing the full six surfaces + scorer + mirror.
  This volume mints NO new casus (1.2.4) -- the discipline is
  honored by scaling existing reads.
- CRIME AND POROSITY: (p)'s crime-eases-infiltration composes through
  the EXISTING competence terms (COMP_CRIME_W / criminalStrength01Of);
  no second spelling of the catch model; the diaspora-ease term
  (1.13.3) enters the same composition as one more named term, and
  the worse-of discipline for security reads is preserved.
- KIND PREFIXES: every WC news/ledger kind is wc_*-prefixed; no
  espionage_* collision. Covert arms fail closed UPSTREAM (no covert
  fact reaches a public composer).
- GATES: every ES-coupled WC read sits behind the existing
  espionageActive conjunction (beliefsActive first), fail-closed by
  name.

## 4.4 THE BUILT WR SURFACES

- leviedPopulationBySource (writer warHomeCosts.js:443/450; readers
  warCosts.js:367, warCoalitionExpenditure.js:159,
  deploymentReturn.js:284; cert row subsystemRowsWar.js:199): the
  people ledger EXTENDS it (blocks[] reconciles to it exactly) and
  never forks it. Attribution by RECONSTRUCTION from the banked map,
  never id-splitting -- the WR-8 law, pinned in WC-6.
- deploymentReturn's conservation identity (fell the sole combat
  sink, largest-remainder apportionment, deploymentReturn.js:270-346
  verified): every new branch this volume adds (defect, orphan, shed,
  and the tag arms of the census-debiting events) preserves the
  identity by naming its event in the walker's closed list; the
  identity's statement WIDENS (section 0.2) and never weakens.
  `untag` moves no counts and is inert to this identity by
  construction.
- WR-6 (warCoalitionLedger.js:5-6): no membership list, no stored
  total on deployments; joinLedger stays single-anchor. Contribution
  is its own ledger; balances are derived reads.
- WR-10 sovereignty market: owns the debt-to-vassalage transaction
  shape; this volume adds the intent road only. Sale treaties keep
  buyerId/sellerId drop-when-absent and NEVER victor fields (the
  standing WR-10 law; the conveyance-value read the overshoot
  signaling feeds is the market's existing read).
- occupation.js: owns the five-rung ladder (STATE_LADDER :117,
  verified: contested / unstable / extractive / stabilized /
  vassalized) and resistance; this volume's R6 and resist-fork are
  consumer inputs to existing advances, never new writers. Requisition
  coercion reads the ladder rung; RELEASE STANDING (1.17.2) composes
  into stabilizationSuitability (:386), the existing input to
  advanceOccupationState (:442), so a loyal over-deliverer climbs
  sooner to `vassalized` -- the estate's real release-from-occupation,
  through vassalizationOutcomes (:724). THE REGRESSION AND LIBERATION
  ARMS ARE NOT TOUCHED: the collapse arm, the regress-below-contested
  arm and the MAX_CONTESTED_DWELL valve are RESISTANCE's, and routing
  loyalty standing into them would put loyalty and revolt on one lever
  where they cancel. relations.js's imposition machinery keeps its
  SOLE-authority read (vassalized via occupations only -- census E
  question 8: the relay does NOT read the occupation ladder; coercion
  does, through the occupation surface that owns it; one authority per
  question).
- warTermination: the close EVENT this volume folds on is
  readWarTerminations' existing output; the contribution fold is a
  consumer. Zero edits to the frozen file.

## 4.5 TRADITIONS, DEMOGRAPHICS, AND THE INTERIOR

- traditions/relations.js: the introduction attempt is a FOURTH pass
  in advanceRelations with its own mutationLog kind; the influx-read
  timing law (origin captured at max(departTick, arrivalTick-1)
  because release destroys origin) is inherited unchanged -- the
  cohort tag banked in the column record is the same pattern, stated
  in WC-13. DESIGN_TRADITIONS.md lives on the ledger branch only
  (census E hazard 1): the WC-14 build brief must carry the pointer.
- demographics: cohort mortality rides the settlement's realized
  death fraction at the year fold (1.13.2); the two-lane
  double-answer hazard (populationDynamics + demographics both moving
  people, census B question 2) is NOT worsened: every WC outflow is a
  people-ledger event through the column machinery, neither pressure
  lane; the wave P4 reconciliation stays deferred and untouched.
- pressureModel/stressors: the embattled member joins
  CRIME_ARCHETYPES; the stressor is catalog-ordinary; any counterforce
  row stressorDynamics needs (at ~759 eff) forces the leaf extraction
  FIRST (census B question 6's answer: extract, never baseline-grow).

---

# SECTION 5 -- HAZARD COMPLIANCE

The standing classes, each with this volume's compliance mechanism.
These are the classes that have BITTEN; compliance is structural, not
aspirational.

## 5.1 No new decay laws

bandedStock.js owns half-life decay (HALF_LIFE_BANDS closed at five;
decayTowardNeutral THROWS on unknown). This volume authors ZERO decay
constants: obligations decay through the existing obligation owner;
cohorts and diaspora bonds decay by MORTALITY (a population process on
demographics machinery -- explicitly not a bandedStock shape, and
explicitly not a new Math.pow site; the WC-15 source-scan fence
enforces both); comradeship folds at war close into relationship axes
whose decay is the relationship plane's existing business; blend and
drift do not decay at all (lived history: what a campaign made of a
block stays until events move it). Institution peace-decay (WC-14)
rides the mercenary market's existing decay shape. Any future WC
quantity that needs half-life decay uses decayTowardNeutral with a
named band, full stop.

CONDITIONAL ON CR-WC-21. This paragraph's headline claim is honest only
under variant A of the cohort-band ruling. If the chair rules that age
bands step by CALENDAR, then RECENCY_WEIGHTS (1.0 / .6 / .25 applied
over calendar-stepped bands) IS a decay constant by any reading, and
this claim narrows -- in the same commit as the ruling -- to "zero new
decay constants outside the declared recency term". The claim is
stated conditionally here rather than defended; 1.13.2 carries the
contradiction in full.

## 5.2 No new intensity ladder

{quiet, present, pressing, decisive} is declared NINE times in TWO
arities at HEAD; consolidation is a CHAIR DECISION OWED and this
volume does not add a tenth declaration. Where WC needs an intensity
word (news significance, pressure bands) it BORROWS: significance
from SIGNIFICANCE_CLASSES (bandFamilies.js), pressure from the
exported PRESSURE_BANDS (envoyNegotiationPictureBuilder.js:28,
verified 4-rung). WAR_STANCE_LADDER is a ROLE vocabulary, not an
intensity ladder -- its words (neutral/materiel/auxiliary/belligerent/
principal) collide with no existing ladder by construction, the
SEVERITY_LADDER mint precedent. The severity of engagements keeps
reading the attrition band vocabulary; nothing new.

AND NO NEW MAGNITUDE LADDER EITHER -- A CORRECTION. An earlier drafting
of 7.A.10 minted `token | modest | substantial | decisive` as "one
four-word magnitude vocabulary" while this section claimed the volume
adds no declaration. Both cannot stand, and the mint is the half that
goes. MEASURED AT HEAD: sovereigntyAppraisal.js:105 already carries a
magnitude ladder -- ['unknown', 'trifling', 'modest', 'substantial',
'great', 'crown_jewel'] -- of which the proposed mint duplicated TWO
members outright; and `decisive` is the top rung of the frozen
intensity ladder (PRESSURE_BANDS, envoyNegotiationPictureBuilder.js:28,
verified), which this volume BORROWS in the same appendix. The standing
law gives bandFamilies.js ownership of magnitude/severity/significance
scales and records the nine-times-declared intensity ladder's
consolidation as a CHAIR DECISION OWED; minting an overlapping tenth
under a paragraph claiming no new declaration is precisely the drift
that law exists to stop. THE CREDIT BAND THEREFORE DOES NOT MINT: it
either BORROWS the sovereigntyAppraisal magnitude words (using four of
six is a read-side concern, not a mint) or lands as a named ROW in
bandFamilies.js so the estate keeps one owner. CR-WC-19 asks the chair
to rule; this section does not resolve it in prose.

## 5.3 hopWeeks is per-digest; banding distance is a trap

Every distance-derived WC band (move feasibility WC-4, relay range
WC-3, endurance geometry WC-10, hop-and-shed reach WC-13) derives
from calibration(digest) at read time -- never an authored absolute
week literal, because a whole realm spans roughly 2..8 march weeks
under per-digest calibration and any authored band >= 9 refuses
nothing (the dead-band class). Until WY-1 publishes the min/median/max
spectrum surface, each WC band carries its in-file derivation note
and a shrink-only census row (CR-WC-15); when kmScale lights, the
one-time behavior shift is declared per the golden-shift law.

## 5.4 Banding is lossy

One band per clause; comparisons in WORDS, never band arithmetic
(same-band comparisons read as contradictions). Every WC prose
surface (credit chip, stance sentence, envelope words, cohort bands)
obeys the runtime no-decimal pin and registers with the proseNumerics
walker. The K5 terms read composes CONTINUOUS internal quantities and
bands ONLY at the surface -- never bands-of-bands.

## 5.5 Dead bands and the POINTS-GAP class

Every authored band edge in this volume is checked REACHABLE against
the measured distribution of its input at landing (the capacity-ratio
1.50-cap lesson: an edge above the input's attainable range is a dead
arm). The WC-12 contest thresholds are explicitly derived from the
measured defense distribution then frozen; the WC-13 density edges
likewise. Each such derivation is recorded in-file with the measured
range and date.

THE SELF-COMPARISON CLASS HAS TWO MEMBERS IN THIS VOLUME, NOT ONE. The
beliefRecord(x,x) sibling (a self-comparison never written) is guarded
by the WC-7 own-sheet read (below). ITS TWIN IS THE COHORT LEDGER: the
self-origin row residentCohorts['<S>']['<S>:veteran'] EXISTS and is
legal (1.13.1) -- it is the town's own returning veterans and it is
what veteranReads consumes -- so the guard here is not "never write it"
but "never READ it as a bond". hostReadsResidents / originReadsDiaspora
return ABSENT for origin === host, pinned in one WC-15 fixture that
asserts both halves at once (nonzero veteran read, absent bond read)
with a mutant on each side. A self-comparison that must exist for one
consumer and must never reach another is the harder shape of this
class, and it is stated here so nobody repairs it by deleting the row.

The WC-7 own-sheet read uses the
outbound template (derive from OWN ledgers, never read own belief of
self).

## 5.6 Fixture-mirrors-deriver and pin vacuity

Every WC pin builds its fixtures through REAL generation (the
anti-fallback discipline: rungs that read keys the pipeline never
writes are dead arms); anchored negatives + seeded failures via
tests/helpers/{anchoredNegatives,seedFailures}.js or the walkers red
(the epistemic-prevention law). Filename-anchored pins use module
SETS + non-empty + negative control. Absence pins run against
non-empty harness states (the empty-harness vacuity class).
Conjunction guards are pinned per-door (conjunction-blind pairs).
Loop pins compute BOUND/STEP first (the step-divides-bound class).
Single-seed distribution claims are forbidden: every distributional
pin (WC-4 distance weighting, WC-14 adoption rate) runs a seeded
corpus.

## 5.7 The reconstruction-loss and silent-key classes

- Every field stamped on a shipment/column/transit record is taught
  to its arrive-loop rebuild IN THE SAME COMMIT (commodityFlow.js:558
  is the in-file proof of the class), with a round-trip pin through
  an in-transit tick.
- Config-slot silent keys: every WC generator/kernel entry takes
  gen(config, seed)-shaped arguments per the standing trap
  (seed/tier/terrain in the config slot are IGNORED); harness pins
  assert the seed ARRIVED (_seed).
- The conditional-materialization law: every WC ledger key
  drop-when-empty; the dormancy oracle stays green on dark worlds.
- applyHomeWarCosts mutates its arguments by contract: WC consumers
  hand it per-tick copies only (no new caller passes live ledgers).
- Authored NUL bytes and grep -a discipline apply to every pool file
  this volume extracts; json round-trips use the raw-splice rule for
  the mutation manifest.
- First-match document pins: every WC doc pin is exactly-once
  guarded, point-don't-restate.
- Shared-tree discipline: WC lanes stage explicit files, never -A;
  the CQ5 flag waves serialize (section 3 head).

## 5.8 Size and paint

No WC module joins the eager first paint (pending task #47): every
leaf is reached through the lazy pulse chunk; VERIFY_DIST=1 and
smoke:boot guard the chunk graph (the TDZ class). No WC wave grows a
baselined file; the ceiling ledger (2.1) binds every commit; hot
files get lazy leaves (the standing rule), and the WC-6 decomposition
is budgeted BEFORE behavior.

---

# SECTION 6 -- OPEN QUESTIONS (chair-facing)

Every unresolved fork, parked with a recommendation. None blocks
WC-0; gates are stated where a later wave blocks.

CR-WC-1 THE MOVE-VOCABULARY MINT. Who mints the strategist move
vocabulary -- HB-1 or WC-4? RECOMMENDATION: build-order decides
(first builder mints the shared dependency-free leaf; the other
amends); if the chair schedules HABIT first, WC-4 re-slots after
HB-1. The directive itself defers; the contract (4.1.1) makes either
order safe.

CR-WC-2 COUNTS OR NAMES. The people ledger is architected as COUNTS
(world-only boundary; the sanctioned named-mover is the roads layer;
telemetry prop hygiene). The owner's "every person conserved" is
satisfied by integer conservation. RECOMMENDATION: counts; if the
chair rules named blocks-members, that is an owner-gated boundary
change and the cohort/roster telemetry class flips to EXEMPT with the
npcLedger reasoning.

CR-WC-3 THE ADVENTURING-CLASS LINE. Boundary 1 excludes rival
adventuring parties; directive (e) generates an adventuring class.
RECOMMENDATION: institutions + free-lance COUNT pools as background
texture, never party-facing actors or resolved rival parties; the
hireable force market stays parked (the owner already parked it).

CR-WC-4 THE SUB-CENTURY HORIZON. Diaspora/veteran generational fade
vs boundary 2. RECOMMENDATION: cohort age bands sized to a 20-40
year arc (newly_arrived < ~5y, settled < ~20y, rooted thereafter,
retired by mortality); the whole fade legible inside one campaign
lifetime; no dynastic clocks.

CR-WC-5 THE CLOUD-WORLD RE-EXPRESSIONS. Forage radius -> network
carrying capacity; campaign seasons -> existing seasonal-severity
abstraction. RECOMMENDATION: confirm both re-expressions; no terrain
constant anywhere in the volume (section 0.3 boundary-6 line).

CR-WC-6 STANCE PERSISTENCE. Persisted typed field or pure derived
band? RECOMMENDATION: pure derived (no schema surface, no migration,
no staleness; the derivation is cheap and the inputs are persisted
facts). If the owner wants a declared-stance DM dial later, it is a
separate owner-gated widening.

CR-WC-7 THE coalitionShares SHIFT. Lit-only replacement of the
strength split by the contribution split (WC-2). RECOMMENDATION:
approve as a declared lit-only behavior shift with a one-time golden
record at lighting; dark worlds untouched.

CR-WC-8 LAW-BAND EDGES, THE RELAY'S PARTICIPANTS, AND WHETHER THE RELAY
IS LAW-BAND-PURE. Three
parts. (i) Does WC read the estate default LAW_WORD_EDGES (0.67/0.33)
or sign a program pair (the espionage J-ES-10 precedent)?
RECOMMENDATION: estate default; the modulation table varies the
CURVES, not the word edges. (ii) Directive (h) names relay efficiency
as one of comradeship's four consumers, so 1.3.2 gives the per-hop
read a comradeship term (lighting at WC-9). RECOMMENDATION: keep the
term -- an owner clause with a named consumer should not be honored by
writing to an axis nobody reads for that purpose. If the chair prefers
a law-band-PURE relay, that is a deliberate narrowing of an owner
clause and is recorded HERE as such, never as silence in 1.3.2.
(iii) WHOSE LAW BAND THE HOP READS -- THE NARROWING THAT WAS UNPARKED.
Directive R4 is verbatim: "per-hop efficiency reads the PARTICIPANTS'
law bands", and the owner's spine adds "depending on the efficiency of
the nearest allied settlement". An earlier drafting of 1.3.2 read the
STAGING settlement's band ALONE, which exempted a lawless SENDER and a
lawless RECEIVER from contributing anything to loss or skim -- a
narrowing of an owner clause made by silence, in the very paragraph
that sets the opposite standard for the comradeship term one page
below. 1.3.2 now reads WORSE-OF(sender, stager, receiver) via
lawWordFor, on the estate's security01Of worse-of discipline (ordering
three law words and taking the worst invents no fourth vocabulary;
blending them would). The skim still belongs to the STAGER, because
the diverted goods physically sit in the barn that handled them.
RECOMMENDATION: keep the participants' read. IF THE CHAIR PREFERS THE
STAGER-ONLY READ, it is a deliberate narrowing and is recorded here as
one -- and 1.3.2's paragraph says so in terms, so the narrowing can
never again be made by silence.

CR-WC-9 THE FIELD BATCH. How many new persisted fields does WC
request, and signed how? The list: deployment.blocks[],
transit blocks projection, shipment relay buckets
(consumed/skimmed/destroyed), column cohort tag + military classes,
plus three new spatialLedgers (warContributions, freeUnits,
residentCohorts) and one edge archive (contribution closes).
RECOMMENDATION: one owner batch table per the WY section 2a
precedent, signed before WC-6 (WC-0/WC-1 touch only the new ledgers,
which the blanket sign-off's queue coverage arguably reaches --
chair to confirm whether a fresh table is owed given the blanket
sign-off's carve-outs).

CR-WC-10 THE SECOND (COUNTS-MOVER) MANIFEST. The earlier form of this
question asked whether to WIDEN MOVEMENT_SITES to army-style steppers.
That question was built on a mischaracterisation, corrected at 1.7.3:
MOVEMENT_SITES is a NAMED-PERSON leg-physics census (its discovery
signature is entirely named-person tokens; its header says so in
terms), so armyTransit is out of its scope rather than exempt from it,
and widening it would put a counts-mover inside a named-person manifest
against this volume's own CR-WC-2 ruling. THE QUESTION NOW: approve a
SECOND totality manifest for counts-movers, with its own discovery
signature, minted in WC-11's opener and registering
armyTransitKernel.js's stepArmyPosition sites, migrationKernel.js's
column release, and this volume's freeUnitKernel.js? RECOMMENDATION:
yes -- the counts plane has never had coverage, this volume is the one
adding a second counts stepper, and law M keeps its scope, its header,
and its signature untouched. Coordinate the NEW manifest's existence
with WY (seam 6's filed candidate is answered by it), but no edit to
WY's guard is requested.

CR-WC-11 THE CRISIS TRIPLE. Is embattled expressible as the existing
APPLY_STRESSOR/RESOLVE_STRESSOR pair? RECOMMENDATION: yes (an
ordinary catalog stressor with a typed source reference); if build
finds otherwise, the third event type is a store-consumer change and
comes back to the chair before landing.

CR-WC-12 CATALOG ORDER. Amnesty/jubilee rows vs the queued TB tribute
family (SOL_QUEUE row 23a). RECOMMENDATION: WC-0 registers its two
producer-less rows immediately (byte-identical); TB proceeds
independently through the same one-owner floor; whichever lands
second rebases trivially (rows are additive).

CR-WC-13 THE DEAD ARMS. readAllianceWebRisk's 'ally'/'defensive_pact'
weights are dead under normalizeRelationshipType (census C hazard).
RECOMMENDATION: record as a deliberate deferral in this volume;
repair in a hygiene wave outside WC (behavior-neutral today; not
this volume's scope).

CR-WC-14 THE WY-8a GATE. WC-10/WC-11 hard-gate on armySupply.js.
RECOMMENDATION: hold the gate (ARC A + WC-6..WC-9 deliver value
without it; WC-11..WC-16 queue behind it); if WY-8a slips
badly, the chair may re-scope WC-10 to a relay-throughput-only
envelope (declared as v1) -- but the recommendation is to wait.

CR-WC-15 THE WY-1 ORDERING. Distance bands before the calibration
spectrum surface exists. RECOMMENDATION: do not block; author bands
against calibration(digest) with in-file derivation notes + a
shrink-only census row WY-1 closes; declare the kmScale one-time
shift when it lights.

CR-WC-16 THE QUEUE SLOT. SOL_QUEUE has no war-auxiliary row.
RECOMMENDATION: slot ARC A after the current FP phase in flight and
the advance-epoch charter's integration point (the epoch queue-slot
note); ARC B behind WY-8a's build slot; the chair owns the queue.
RE-DERIVED IN ROUND 2 FROM THE CORRECTED 7.F GRAPH: WC-5 (call-ins and
the exits) is INSIDE the critical path, because WC-9 now depends on it
for two of CONTRIBUTION_CLOSE_GRADES' four members -- so ARC A must be
slotted WHOLE (WC-0..WC-5) rather than as a WC-0..WC-3 opener with
call-ins deferred, which the old graph would have permitted and which
would have stalled the entire composite arc at WC-9. Likewise WC-8 must
precede WC-11, so the block forks cannot be deferred past the fission
wave.

CR-WC-17 K1 SCOPE. Do the peace-capable exercisers (famine aid,
joint ventures, temple-raisings, trade drift) ship inside this
volume or as a successor program? RECOMMENDATION: successor program;
this volume builds the primitives peace-shaped (kind vocabularies
not war-conditioned) and names the exercisers as deferred census
rows -- the volume is already the family's largest.

CR-WC-18 PRISONERS AND THE SEA (K7). RECOMMENDATION: hold as named,
shaped, unbuilt census rows (PRISONERS = one event pair on the
walker's closed list when it lands; THE SEA = naval rows on the
encounter table); neither enters the wave plan until the owner
calls them.

CR-WC-19 THE CREDIT BAND'S MAGNITUDE WORDS (do NOT mint). 7.A.10
originally minted `token | modest | substantial | decisive` as a new
four-word magnitude vocabulary while 5.2 claimed the volume adds no
declaration. Measured at HEAD, sovereigntyAppraisal.js:105 already owns
a magnitude ladder ['unknown','trifling','modest','substantial',
'great','crown_jewel'] (the mint duplicated two of its members), and
`decisive` is the top rung of the frozen intensity ladder
(PRESSURE_BANDS, envoyNegotiationPictureBuilder.js:28) that this volume
borrows in the same appendix. The standing law makes bandFamilies.js
the owner of magnitude/severity/significance scales and records the
intensity ladder's consolidation as a chair decision owed. THE
QUESTION: does the credit band (a) BORROW sovereigntyAppraisal's
magnitude words -- reading four of six is a read-side concern, not a
mint -- or (b) land as a named ROW in bandFamilies.js, keeping one
owner for the estate's scales? RECOMMENDATION: (b), because
bandFamilies.js is the declared owner and a row there is the shape the
next volume can reuse without a third spelling; (a) is acceptable and
cheaper. WHAT IS RULED OUT EITHER WAY: a fresh four-word ladder in
contributionLedger.js.

CR-WC-20 POOLS OR TAGS: WHAT A COHORT IS. Section 0.2 rules that a
cohort and the free-lance pool are TAGS ON CENSUS MEMBERS -- a
partition of the host's population, not a population beside it -- so
`shed` credits census AND the tag in ONE event, `untag` (kind 'cohort')
is a tag retirement that moves nobody, and neither appears in the
conservation identity. This is the ruling because the alternative double-counts:
1.12.1's homecoming credits returning veterans to CENSUS while the
cohort ledger also counts them, and a `census -> cohort` transfer is a
member of no event list this volume can close. RECOMMENDATION: the tag
model as ruled. IF THE CHAIR RULES COHORTS DISJOINT FROM CENSUS
instead, three things follow and none is optional: (1) mint the missing
`enrol` event (census -> cohort) and re-sign `enlist` as
free_lance -> block; (2) forbid `return`/`arrive_home` from crediting
census for veterans, since they would then belong to the cohort pool;
(3) state explicitly which read sees which pool -- defence, density,
absorption capacity, taxation and every other census consumer -- because
under disjoint pools a settlement's "population" stops being its
population.

CR-WC-21 WHAT STEPS THE COHORT AGE BAND (the parked contradiction).
1.13.2 carries it in full: the volume bands cohorts by CALENDAR
(AGE_BAND_EDGES_YEARS 5 / 20; RECENCY_WEIGHTS 1.0 / .6 / .25) while
WC-15's hardest negative demands that a zero-mortality world decay NO
bond and that a calendar-decay mutant RED. In a world with no deaths
the count never moves but the band still steps and the bond falls to a
quarter: the pin is unpassable against the design's own behavior.
BOTH POSITIONS, NEITHER TAKEN:

  POSITION A -- BAND BY MORTALITY-REALIZED COMPOSITION. A cohort reaches
  `rooted` as its arrival generation is thinned, not as the calendar
  turns. Keeps "MORTALITY IS THE DECAY LAW (no new constant)" and 5.1's
  zero-decay-constants claim verbatim; keeps the WC-15 pin as written.
  COST: it narrows the owner's own "how long ago" / "long ago memory is
  not recent memory" to a thinning proxy, and in a low-mortality world
  a sixty-year-old cohort may still read `newly_arrived`, which is not
  what the sentence sounds like.

  POSITION B -- KEEP CALENDAR BANDS, DECLARE TWO TERMS. The count-driven
  term is mortality-driven; the recency term is calendar-driven and
  declared as such. Keeps "how long ago" literal and the age-band
  vocabulary intuitive. COST: RECENCY_WEIGHTS becomes a decay constant,
  so directive (n)'s "no new constant", 1.13.2's "no new decay law",
  and 5.1's "authors ZERO decay constants" must all be amended in the
  same commit, and the WC-15 pin must be rewritten to assert only that
  the COUNT-driven term is mortality-driven.

The chair rules; until then WC-15 carries the pin in both variants and
the wave does not land. The volume states no preference here, because
the directive's own sentence supports each arm and picking one is an
owner-facing narrowing either way.

CR-WC-22 THE TWO LEVY GATES (a war-layer question this volume routes
around rather than answers). 1.1's estate truth measured two live gates
on the receiver-side levy sweep that between them forbid the directive's
central cases:

  GATE 1 -- THE DEPLOYER EXCLUSION. warHomeCosts.js:391 excludes from
  levy any settlement that is itself fielding an army
  (`...Object.keys(deployments).map(String)` in the exclude set). Its
  in-file rationale (:386-390) is about DOUBLE-LEVY across overlords
  and skeleton/food floors, not about self-deployers, so the
  self-deployer arm reads as incidental rather than argued. While it
  stands, no settlement can both field its own army and send troops --
  which is this volume's `belligerent` rung and the owner's own
  "own-troops-for-own-army vs supporting others" tension.

  GATE 2 -- THE WR-6 PEER-LEVY REMOVAL. warHomeCosts.js:115-116, with
  the comment "WR-6 removes free peer levies: a canonical ally either
  joins with its own army or refuses." While the coalition layer is
  lit, no ALLIED edge can be levied at all -- which is the allied arm
  of the owner's verbatim spine and the whole `auxiliary` rung.

  THE VOLUME'S POSITION, AND IT DOES NOT NEED A RULING TO BUILD: WC
  routes AROUND both gates by minting its own sender-elected road with
  its own admission set (1.1), because an ELECTED send and a LEVIED
  take are different acts -- WR-6's law says an ally is not FREELY
  TAKEN FROM, and nothing in it says an ally may not GIVE. Under that
  reading the two mechanisms coexist and no war-layer behavior moves.

  THE QUESTION FOR THE CHAIR: should the gates ALSO lift on the levy
  side? POSITION LIFT: the sweep is measured silent anyway
  (subsystemRowsWar.js:55, :202), the deployer exclusion's stated
  rationale does not cover self-deployers, and one road is simpler than
  two. COST: it is a behavior change on a built subsystem with a golden
  record, it reopens a WR-6 law whose comment reads as deliberate, and
  it would make WC's arrival ledger inherit a corpus nobody has
  measured. POSITION HOLD (the recommendation): leave both gates
  exactly as they are; WC builds its own road; if a later hygiene wave
  revives the sweep, this volume's arithmetic already covers whatever
  it produces. EITHER WAY THIS IS NOT A WC WAVE -- lifting a war-layer
  gate is its own wave with its own declared shift.

---

# SECTION 7 -- APPENDICES

## 7.A The closed vocabularies, in full

Every vocabulary this volume mints, every member, one line each.
All are Object.freeze'd, totality-exported, and throw-on-unknown at
their rank/label lookups (the bandFamilies discipline). Semantic
order is carried by an explicit rank map wherever order matters
(the TAP_DEPTH lesson); the exported array is the coverage surface a
consumer proves totality against.

### 7.A.1 WAR_STANCE_LADDER (warStance.js) -- semantic order

KEYED PER (party, warEpisodeKey), NOT PER ANCHOR (1.2.2, corrected in
round 2). "Realized share" below always means EPISODE share: the
party's committed headcount over its SIDE's total committed headcount,
time-integrated, summed across every deployment on that side.

    neutral       not in this episode: no army, no troops, no live
                  credit
    materiel      joined in supplies only: the weakest grievance
                  against her, the thinnest terms weight
    auxiliary     joined in troops without fielding an army: her blocks
                  serve under another party's banner, at minority
                  realized share
    belligerent   fields her own army at minority realized share -- the
                  rung a nominal owner or an original declarer falls to
                  when its own contribution thins, AND the rung every
                  party on a no-majority side reads
    principal     the MAJORITY realized-share contributor to its SIDE
                  of the episode, owner or reinforcer alike; ties break
                  toward the holder of the side's origin anchor. AT
                  MOST ONE PER SIDE PER EPISODE, and a side may legally
                  have NONE (the three-way-split case, pinned at WC-2).
                  NO DECLARER DISJUNCT EXISTS
                  (1.2.2): a declared label in this row would make
                  priced shielding purchasable at declaration time,
                  which directive (f) forbids in terms.

### 7.A.2 CONTRIBUTION_KINDS (contributionLedger.js)

    troops_lent           headcount, conserved through the people
                          ledger; credit banded on integrated share
    supplies_delivered    stores, conserved through the shipment
                          identity; credit banded on storage-months

### 7.A.3 THE GRADE VOCABULARIES, AND WHEN EACH BECOMES COMPUTABLE

CONTRIBUTION_DELIVERY_GRADES (contributionLedger.js, WC-1). Every
member is computable from WC-1 facts alone, which is why the close row
can carry a grade from its first landing:

    delivered     credit written, no shortfall beyond the lawful floor
    shortfall     credit written AND a shortfall booked
    none          nothing arrived: shortfall only

CONTRIBUTION_CLOSE_GRADES (contributionReads.js, WC-9 -- NOT WC-1).
Graded at war close, per (pair, war); the grade is what the doctrine
page and the habit closes consume. THREE OF ITS FOUR MEMBERS HAVE NO
INPUTS AT WC-1, which is why the vocabulary lands at WC-9 and the close
row gains its `grade` field there:

    honored       credit acknowledged; call-ins ANSWERED (needs 1.9's
                  request record, WC-5); no shortfall beyond the lawful
                  loss floor
    partial       credit real but BELOW THE REQUEST'S askedBand -- a
                  shortfall against a stated ask (needs the request
                  record; this volume writes at arrival and refuses to
                  write at pledge, so the ASK is the only expectation it
                  may honestly measure against, 1.9.1), or shortfall
                  present without breach
    unanswered    a live call-in REFUSED against standing credit
                  (needs the request record and its fork, WC-5;
                  breach-grade through treatyBreach)
    betrayed      skim against comrades (needs WC-3), token contribution
                  while comrades bled, or mid-war defection -- the
                  intimacy-priced grade (needs comradeship, WC-9)

CALL_IN_ANSWERS (callInErrand.js, WC-5): answered | partial | refused |
lapsed -- `lapsed` is silence past the horizon and is NOT a refusal.

CALL_IN_OUTCOMES (callInErrand.js, WC-5): prevailed | stalemated |
lost -- did the SUPPORTED SIDE win, read off readWarTerminations'
existing close. This is the half of the owner's grading that appeared
nowhere in the volume before this amendment.

CALL_IN_CLOSE_GRADES (callInErrand.js, complete at WC-9): the frozen
PAIR (CALL_IN_OUTCOMES x CONTRIBUTION_CLOSE_GRADES), read as two axes
and never flattened into a cross-product ladder (1.9.3).

### 7.A.4 THE PEOPLE LEDGER (peopleLedger.js)

    POOLS        = ['block', 'census', 'column', 'free_unit']
                                                  (codepoint-sorted;
                                                   order-free)
    RESIDENCY_TAGS = ['cohort', 'free_lance']     (labels on census
                                                   members, NOT pools:
                                                   0.2's ruling,
                                                   CR-WC-20. A person
                                                   carries AT MOST ONE
                                                   `cohort` and
                                                   OPTIONALLY the
                                                   `free_lance` overlay
                                                   -- the multiplicity
                                                   law of 0.2, which
                                                   replaced an earlier
                                                   "any number" phrase
                                                   that falsified the
                                                   ledger's own totality
                                                   law)
    COUNT_EVENTS = ['arrival', 'arrive_home', 'defect', 'depart',
                    'dispatch', 'dm_removed', 'enlist', 'fell',
                    'fission', 'mortality', 'muster', 'orphan',
                    'rejoin', 'shed']             (codepoint-sorted;
                                                   order-free)
    CENSUS_DEBITING = ['dispatch', 'enlist', 'mortality', 'muster']
                                                  (the subset carrying a
                                                   TAG ARM in
                                                   EVENT_SIGNATURES:
                                                   veterans-first
                                                   selection for
                                                   muster/dispatch,
                                                   `untag` of the
                                                   free_lance overlay
                                                   for enlist, pro-rata
                                                   for mortality -- 0.2)
    TAG_EVENTS   = ['brigand', 'demobilize', 'untag']
                                                  (move no counts; named
                                                   anyway, because an
                                                   unnamed branch is how
                                                   a defect hides.
                                                   `untag` carries a
                                                   RESIDENCY_TAGS kind
                                                   and SUBSUMES the
                                                   earlier `absorb`
                                                   (kind 'cohort') while
                                                   finally naming the
                                                   free-lance retirement
                                                   (kind 'free_lance'),
                                                   which 1.12.5 and
                                                   1.14.2 described as
                                                   "consumed in the same
                                                   event" with no event
                                                   to name -- the one
                                                   unnamed branch this
                                                   volume had left)
    SINKS        = ['fell', 'mortality', 'dm_removed']
                                                  (three DECLARED sinks;
                                                   the identity subtracts
                                                   exactly these)

Each event's debit/credit signature is section 0.2's table, exported
as EVENT_SIGNATURES so the walker derives its checks from the same
frozen object the movers consult (never a fixture mirror -- the
walker reads the LAW, the movers obey it, and a divergence reds). Every
COUNT_EVENTS signature is exactly one debit and one credit: `return`
was split into `depart` + `arrive_home` because a two-hop row in a
one-debit-one-credit table is a law that exempts itself. THE TAG ARM IS
PART OF THE SIGNATURE, not a convention beside it: a mover that debits
census without running its arm diverges from the frozen object and
reds. `untag`'s kind set is asserted EQUAL to RESIDENCY_TAGS, so a new
tag cannot be minted without a retirement.

### 7.A.5 BLOCK_FORK_OUTCOMES (blockForks.js)

    stay     keep fighting; home credit continues accruing
    return   depart as a veteran_return column (`depart` then
             `arrive_home`)
    defect   join another army whole; conserved, never a sink. WHICH
             army: the closed candidate set of 1.5.2 (co-located or one
             hop; holder of the block's home, or at war with the block's
             current owner), chosen through the SHARED
             joinPreference.js scorer -- deterministic under the seed,
             reasons pinned with toEqual
    resist   return AND feed occupation resistance at home

### 7.A.6 FREE_UNIT_STATES (freeUnits.js)

    operating    supplied, independent, pursuing its war as believed
    foraging     unsupplied, drawing down the countryside
    brigand      the located predation state (WC-12's contest body)
    dissolving   hop-and-shed in progress; sheds until empty

### 7.A.7 EMBATTLED_RESOLUTIONS (brigandContest.js)

    suppression   force resolves it: the mercenary demand loop
    attrition     hunger resolves it: deaths through fell
    absorption    the town takes them: sheds into cohorts
    buy_off       tribute resolves it AND teaches raiding pays
                  (graded close into the habit system)

### 7.A.8 COLUMN CLASSES (spatial/migration.js widening) -- ALL AT WC-0

    DEMOGRAPHIC_COLUMN_CLASSES = ['refugee', 'voluntary']  (existing,
                                                            untouched;
                                                            migration.js
                                                            :474,
                                                            verified)
    MILITARY_COLUMN_CLASSES    = ['reinforcement_column', 'shed_column',
                                  'veteran_return']
    COLUMN_CLASSES             = frozen union of both, the totality
                                 export; the class is part of the
                                 column KEY (migration.js:553,
                                 verified -- the collision discipline)

THREE MEMBERS, NOT TWO. `reinforcement_column` was MISSING: 1.1.2 and
1.1.5 route an outbound contribution as census -> column (`dispatch`)
then column -> block (`arrival`), and WC-6's conservation walker covers
exactly those events, yet no member existed for an OUTBOUND
reinforcement. Since the class is part of the column key, a CLASSLESS
military column would have collided with a demographic column on the
same origin/dest/tick -- the precise failure the class-in-the-key
discipline exists to prevent, reintroduced by an incomplete union.

AND THE WHOLE VOCABULARY LANDS AT WC-0, not WC-13. WC-6 needs
`reinforcement_column` and (through the `return` fork's shape)
`veteran_return` SEVEN WAVES before WC-13 would have minted them --
a wave-order violation the dependency graph had no way to express.
This volume lands every other closed vocabulary in its registration
wave; this one is no exception. migration.js's class-stamp and key
predicates (:520 / :545 / :553) widen from the DEMOGRAPHIC list to the
union in the same WC-0 commit, byte-identically, because no producer
stamps a military class until WC-6 mints the first one. The
key-collision PIN lands at WC-6 with that first producer and is
re-exercised at WC-13 for `shed_column`.

### 7.A.9 COHORT_AGE_BANDS (residentCohorts.js)

    newly_arrived   the arrival generation, still itself
    settled         the working generation
    rooted          the generation that has become the town

WHAT STEPS THESE BANDS IS UNRULED (CR-WC-21). Under position A they
step as the arrival generation is thinned by mortality; under position
B they step on the calendar at AGE_BAND_EDGES_YEARS 5 / 20 (the values
7.B carries). The earlier wording of this appendix asserted BOTH -- "~5
years", "~20 years", and "retired from bond arithmetic by mortality,
never by calendar" -- which is the contradiction 1.13.2 parks. No
member's NAME changes under either ruling.

### 7.A.10 CREDIT BANDS -- BORROWED, NOT MINTED (CR-WC-19)

ONE magnitude vocabulary is shared by troopsBand, suppliesBand, and
shortfallBand (three fields, ONE vocabulary -- never three spellings).
It is NOT minted here. The earlier drafting of this appendix minted
`token | modest | substantial | decisive` while section 5.2 claimed the
volume adds no new declaration; measured at HEAD, that mint duplicated
two members of sovereigntyAppraisal.js:105's magnitude ladder
(['unknown','trifling','modest','substantial','great','crown_jewel'])
and took its top word from the frozen intensity ladder (PRESSURE_BANDS,
envoyNegotiationPictureBuilder.js:28). bandFamilies.js is the estate's
declared owner of magnitude/severity/significance scales.

    OPTION (a)  borrow sovereigntyAppraisal's magnitude words; reading
                four of six rungs is a read-side concern, not a mint
    OPTION (b)  add the credit band as a named ROW in bandFamilies.js,
                so one module still owns every scale in the estate

CR-WC-19 rules; the recommendation is (b). Edges are tuning (7.B).
Under either option the one-band-per-clause law still forbids a credit
band and a pressure band inside one composed sentence.

### 7.A.11 BORROWED vocabularies (minted elsewhere, consumed here)

    LAW_WORDS ['balanced','lawful','lawless']     lawWord.js -- relay,
                                                  cohesion, drift,
                                                  rejection loading
    SIGNIFICANCE_CLASSES ['routine','notable',    bandFamilies.js --
                          'major']                 every WC news kind
    PRESSURE_BANDS ['quiet','present',            envoyNegotiation-
                    'pressing','decisive']         PictureBuilder.js --
                                                  where intensity words
                                                  are needed
    attrition bands (hold..withdrawal)            attrition.js -- the
                                                  hardship input to
                                                  comradeship
    STATE_LADDER (occupation rungs)               occupation.js -- the
                                                  coercion gradient
    TERM_FAMILIES / TERM_CATALOG                  peaceTermsCatalog.js
                                                  -- amnesty + jubilee
                                                  rows
    HALF_LIFE_BANDS                               bandedStock.js --
                                                  deliberately UNUSED
                                                  by this volume
                                                  (section 5.1); listed
                                                  to make the non-use
                                                  auditable

## 7.B The tuning signature table

Every constant this volume authors, its wave, and its RAW-AUTHORED
proposed value. THIS TABLE IS THE OWNER'S SOAK SIGNATURE SURFACE (THE
PROMISE: tuning owner-signed and versioned; the blanket sign-off's
versioned-tuning carve-out applies -- NOTHING here is signed by the
blanket). Values are the architect's proposals with one-line
rationales; every one is vetoable at soak; none enters
proposedSoakBands.js before ratification. Derived-then-frozen entries
(marked DERIVE) are measured against the seeded corpus at their
wave's landing and recorded in-file with range and date (the
dead-band discipline, 5.5).

THERE IS NO WC-0 ROW AND THAT IS NOW TRUE RATHER THAN ASSERTED. WC-0's
closing line reads "TUNING: none (registration mints no constants)"
while an earlier drafting had it land lawBandModulation.js as "ONE
frozen modulation table (cohesion / relay / drift / learning curves)".
Curves are constants; under THE PROMISE constants are owner-signature
surface; and unsigned constants landing in the wave that also claims
the strongest byte-identity pin is exactly the drift the
versioned-tuning carve-out exists to stop. WC-0 now lands the table's
SHAPE and a registration entry point (2.2, 4.1.2), and each curve
appears in THIS table under its consuming wave: relay at WC-3, cohesion
at WC-8, drift at WC-9, learning at HABIT's own fold.

    WAVE  CONSTANT                        PROPOSED     RATIONALE
    WC-1  CONTRIBUTION_ARRIVALS_CAP       24           the estate's
                                                       bounded-archive
                                                       cap idiom
    WC-1  CREDIT_BAND_EDGES (troops)      .05/.20/.50  of receiving
                                                       army max
                                                       strength,
                                                       integrated
    WC-1  CREDIT_BAND_EDGES (supplies)    .5/2/6       storage-months
                                                       delivered
    WC-1  OBLIGATION_MINT_BASE            0.15         a decisive war
    WC-1  OBLIGATION_MINT_PER_BAND        0.20         of credit tops
                                                       near the 1.0
                                                       obligation cap
    WC-2  STANCE_MAJORITY_EDGE            0.50         majority is
                                                       majority
    WC-2  STANCE_CROSSING_MARGIN          0.06         hysteresis: no
                                                       band flapping
                                                       at the edge
    WC-2  EXHAUSTION_RUNG_SCALARS         0/.15/.40/   materiel pays a
                                          .75/1.0      seventh of a
                                                       principal's
                                                       accrual
    WC-2  CASUS_RUNG_SCALARS              0/.25/.50/   materiel IS
                                          .80/1.0      joining: never
                                                       zero above
                                                       neutral
    WC-2  TERMS_RUNG_SCALARS              0/.20/.45/   priced
                                          .80/1.0      shielding's
                                                       price curve
    WC-3  RELAY_LOSS_BY_BAND              lawful .03 / the lawful
                                          balanced .08 spread is the
                                          / lawless    network's whole
                                          .14          reason to exist.
                                                       The BAND is the
                                                       WORSE-OF sender /
                                                       stager / receiver
                                                       (1.3.2, directive
                                                       R4's
                                                       "participants");
                                                       this row is also
                                                       the relay CURVE
                                                       registered into
                                                       WC-0's table
                                                       shape (2.2)
    WC-3  RELAY_SKIM_FRACTION             0.12         lawless only;
                                                       visible theft
    WC-3  RELAY_STAGING_DEPTH             3            candidateRoutes'
                                                       K_CANDIDATES
                                                       sibling
    WC-4  MOVE_WEIGHTS (7)                rel .22 /    relationship
                                          treaty .18 / leads; habit
                                          dist .16 /   trails until
                                          threat .16 / HABIT deepens
                                          favor .12 /  it
                                          law .08 /
                                          habit .08
    WC-4  OVERSHOOT_EDGE                  1.25         a quarter past
                                                       requisition
                                                       signals loyalty
    WC-4  UNDER_DELIVERY_EDGE             0.60         chronic, not
                                                       episodic
    WC-4  CONTRIBUTION_RESERVATION_CAP    0.60         a sender may
                                                       promise away most
                                                       of its muster
                                                       capacity, never
                                                       all of it: the
                                                       owner's "at the
                                                       cost of
                                                       reinforcing their
                                                       own" with a floor
                                                       (1.1.5)
    WC-4  RESERVATION_HORIZON             13           a quarter-year
                                                       promise; a lapsed
                                                       reservation is
                                                       silent, not news
    WC-4  RELEASE_STANDING_MAX            0.20         of
                                                       stabilization-
                                                       suitability: a
                                                       loyal town climbs
                                                       sooner, never
                                                       instantly
                                                       (1.17.2)
    WC-5  BREACH_CREDIT_FLOOR             'modest'     token credit
                                                       buys no
                                                       call-in right
    WC-5  CALL_IN_REQUESTS_CAP             24           the bounded-
                                                       archive cap idiom
    WC-5  CALL_IN_HORIZON_TICKS            26           silence past
                                                       half a year is
                                                       `lapsed`, not
                                                       `refused`
    WC-5  CALL_IN_ANSWER_WEIGHTS (6)       credit .28 / the debt leads;
                                          comrade .20 / own threat is
                                          threat .20 /  the honest no
                                          treaty .16 /
                                          dist .10 /
                                          law .06
    WC-7  COMPOSITION_NEWS_CLASS          'notable'    borrowed
                                                       significance;
                                                       'major' at the
                                                       principal
                                                       crossing
    WC-8  FORK_LOADING_WEIGHTS (6)        rel .22 /    the block fork's
                                          occupation   loading, and its
                                          .20 / dist   receipt reasons
                                          .16 / drift
                                          .16 /
                                          comrade .14
                                          / fear .12
    WC-8  LAW_BAND_COHESION_CURVE         registered   the cohesion row
                                                       supplied INTO
                                                       WC-0's table
                                                       shape (2.2 /
                                                       4.1.2). WC-8's
                                                       two rows were
                                                       named in its
                                                       TUNING line and
                                                       absent from this
                                                       table before
                                                       round 2
    WC-9  BLEND_ACCRUAL_PER_CLOSE         0.04         per engagement
                                                       close, x
                                                       (1 - own share)
    WC-9  COMRADESHIP_ACCRUAL_PER_CLOSE   0.03         x hardship01
                                                       from the
                                                       attrition band
    WC-9  DRIFT_HYSTERESIS_MARGIN         0.08         K2's dead zone
    WC-9  RELAY_COMRADE_BONUS              0.35         of the hop's
                                                       loss fraction,
                                                       at full bond:
                                                       comrades run a
                                                       tighter road
                                                       (directive (h)'s
                                                       fourth consumer)
    WC-9  BETRAYAL_INTIMACY_MULT_MAX      2.0          the deepest
                                                       feuds are born
                                                       between old
                                                       friends
    WC-9  COMRADE_FIDELITY_MAX            0.45         of the belief
                                                       error, removed at
                                                       full bond.
                                                       STRICTLY BELOW
                                                       1.0 BY LAW: no
                                                       brotherhood buys
                                                       a perfect read
                                                       (1.6.4,
                                                       directive (h)'s
                                                       comrade-accuracy
                                                       rider -- the
                                                       sibling of
                                                       BETRAYAL_INTIMACY
                                                       _MULT_MAX, which
                                                       had a row while
                                                       this had none)
    WC-9  LAW_BAND_DRIFT_CURVE            registered   the drift row
                                                       supplied INTO
                                                       WC-0's table
                                                       shape (2.2 /
                                                       4.1.2): curves
                                                       land with their
                                                       movers, so WC-0
                                                       carries no
                                                       tuning row at all
    WC-10 BURN_BASE_PER_1000              0.05         storage-months
                                                       per tick per
                                                       1000 strength
    WC-10 MASS_BURN_EXPONENT              1.15         larger armies
                                                       burn FASTER,
                                                       superlinearly
    WC-10 RENDERER_GUARD_CEILING          512          never-hit guard
                                                       rail, with its
                                                       not-load-bearing
                                                       pin
    WC-11 FISSION_SLACK                   0.10         over-cap grace
                                                       before the cut
    WC-11 FORAGE_ESCALATE_TICKS           3            forage fails
                                                       thrice, then
                                                       plunder
    WC-12 CONTEST_EDGES                   DERIVE       from the
                                                       measured defense
                                                       distribution,
                                                       then frozen
    WC-12 EMBATTLED_TRADE_SEVERITY        0.30         local
                                                       interdiction
                                                       felt, not total
    WC-12 BUY_OFF_PRICE_BANDS             DERIVE       from stores
                                                       distribution
    WC-13 DENSITY_CAPACITY_EDGES          DERIVE       from the
                                                       absorption
                                                       corpus
    WC-13 REJECTION_WEIGHTS               density .30 /  the host's
                                          rel .25 /     fork loading
                                          law .20 /
                                          fear .25
    WC-13 SHED_QUANTUM_BANDS              100/200/400 the owner's own
                                                       figures ("100
                                                       here, 200
                                                       there")
    WC-14 ADOPTION_RATE_BAND              .05..0.20    most attempts
                                                       fail, corpus-
                                                       asserted
    WC-14 POOL_FOUND_THRESHOLD            300          veterans pooled
                                                       before an
                                                       institution
                                                       founds
    WC-14 DESTABILIZATION_SEVERITY        share x      no constant of
                                          driftDepth   its own: the
                                                       arithmetic IS
                                                       the tuning
    WC-15 AGE_BAND_EDGES_YEARS            5 / 20       CR-WC-4's
                                                       sub-century arc;
                                                       LIVE ONLY UNDER
                                                       CR-WC-21's
                                                       position B (under
                                                       A the band steps
                                                       on realized
                                                       thinning and this
                                                       row retires)
    WC-15 RECENCY_WEIGHTS                 1.0/.6/.25   by age band. UNDER
                                                       POSITION B THIS
                                                       ROW IS A DECAY
                                                       CONSTANT and 5.1's
                                                       claim narrows in
                                                       the same commit
                                                       (1.13.2)
    WC-15 ESPIONAGE_EASE_MAX              0.15         a term, never a
                                                       dominator
    WC-16 VETERAN_READINESS_MAX           0.25         caps beside
                                                       mercSupplement's
                                                       0.35
    WC-16 VETERAN_DEFENSE_MAX             0.20         the walls' share
    WC-16 CRIME_SUPPRESS_MAX              0.20         the streets'
                                                       share
    WC-16 MUSTER_VETERAN_PREFERENCE       0.70         veterans-first,
                                                       not
                                                       veterans-only

## 7.C The beat inventory (news kinds, address chains)

Every beat is wc_*-prefixed, carries the full address chain (actor
settlement, counterparty, war anchor where live), a typed action, and
a typed reason (the loading factors); significance is BORROWED. The
sentence families ship in the same wave as the kind (K7); pools are
script-extracted and never hand-edited after extraction (the TR-1
pool law).

    KIND                        WAVE   SHAPE (one authored family each)
    wc_contribution_arrival     WC-1   [sender] fed/reinforced
                                       [receiver]'s army before
                                       [target]; the kind and band
    wc_contribution_close       WC-1   the war done, the ledger read
                                       aloud: grade + band
    wc_relay_skim               WC-3   [stager] took a cut on the
                                       [sender] road; the shortfall
                                       stands in the book
    wc_stance_crossing          WC-2/7 [party] has become the war's
                                       [rung]; mission creep spoken
    wc_composition_revealed     WC-7   [enemy court] learns who truly
                                       fields the host
    wc_call_answered            WC-5   [ally] answered the call: the
                                       ask, the answer, and the reason
                                       that loaded it
    wc_call_refused             WC-5   [debtor] refused the call with
                                       the debt standing; breach-grade
                                       (a LAPSED call is a quieter beat
                                       of the same family: silence is
                                       not refusal)
    wc_debt_forgiven            WC-5   the gesture, named and priced
    wc_debt_conversion          WC-5   debt became vassalage, chosen
                                       at the market
    wc_block_fork               WC-8   [origin]'s companies chose:
                                       outcome + the reasons that
                                       loaded it
    wc_fission                  WC-11  the host broke along its
                                       weakest bonds
    wc_stand_down               WC-11  the peace finally reached
                                       [unit]; or it has not
    wc_brigand_arrival          WC-12  [unit] came down on [town]
    wc_embattled                WC-12  [town] is embattled; source
                                       body named
    wc_buy_off                  WC-12  [town] paid; the lesson taught
                                       is part of the sentence
    wc_shed_homecoming          WC-13  [count band] of [origin]'s
                                       people stopped at [host]
    wc_host_rejection           WC-13  [host] turned them away; they
                                       moved on hungrier
    wc_homecoming               WC-14  the double sentence: walls
                                       stronger, temple unsettled
    wc_introduction_attempt     WC-14  a strange rite offered;
                                       adopted or refused
    wc_institution_founded      WC-14  where the veterans pooled, a
                                       hall rose
    wc_muster_fork              WC-16  field the veterans or hold
                                       them: the choice, receipted

Covert kinds (composition intelligence, porosity reads) have NO beat:
they fail closed upstream and surface only through ES's own covert
channels.

## 7.D The DM verb inventory

Every engine-written surface a DM can touch gains its verb through
the store-action lifecycle (operationRegistry + gen:compendium-data
in the same commit -- the standing store-action law); DM-edited
values are never machine-dropped (the hook-nonredundancy precedent).

    VERB                          WAVE   SURFACE
    annotateContributionRow       WC-1   the edge archive row's DM note
    forgiveContributionDebt       WC-5   the forgiveness gesture,
                                         DM-invoked (mirrors the
                                         engine gesture; same
                                         extinguish path)
    editBlockRosterNote           WC-6   a block's DM annotation
                                         (never headcount: conservation
                                         is not editable)
    removeFreeUnit                WC-11  the dm_removed disposition.
                                         Its sink is now a DECLARED
                                         member of the conservation
                                         identity (0.2: three sinks,
                                         fell | mortality | dm_removed),
                                         not an undeclared exit hiding
                                         inside a DM verb. The verb
                                         offers two dispositions --
                                         absorb-to-nearest (a `shed`,
                                         conserved) or the declared sink
                                         -- and both are walker-visible
                                         and receipted
    resolveEmbattledState         WC-12  DM resolution choosing among
                                         EMBATTLED_RESOLUTIONS
    annotateCohort                WC-15  cohort DM note
    setVeteranPolicy              WC-16  the field-or-garrison
                                         standing preference (a
                                         strategist weight override,
                                         banded)

Existing DM tooling covers the rest: stressor tools already edit the
embattled stressor (it is catalog-ordinary); treaty tools already
edit amnesty/jubilee terms (catalog-ordinary); no parallel editors
are minted.

## 7.E The walker and red-capability inventory

Consolidated from section 3; every structural guard with its
executed-red obligation (a guard that cannot be reddened cannot be
proven -- the door-3 law, applied at every landing).

    GUARD                            WAVE   RED PROOF (executed at landing)
    conservation walker              WC-6   one-count-drop mutant per
                                            branch; per-event coverage
                                            grows with each wave's
                                            closed-list addition
    blocks/levied reconciliation     WC-6   headcount-skew mutant
    reconstruction-attribution scan  WC-6   an id-split call planted
                                            and caught
    arrival-not-dispatch pin         WC-1   dispatch-write mutant
    exact-once close, BOTH doors     WC-1   predicate-call-deleted mutant
                                            AND appender-dedupe-deleted
                                            mutant, separately (a
                                            defence-in-depth pair pinned
                                            only at the outcome is blind
                                            to either door)
    people-are-not-stores pin        WC-3   per-hop-loss-on-people and
                                            skim-on-people mutants
    rung-swap pin (both parties)     WC-7   declarer-disjunct mutant
                                            (restoring the deleted
                                            clause must red)
    stance totality, per EPISODE     WC-2   the anchor-keyed mutant
                                            (re-keying warStanceOf on
                                            warAnchorKey) reds on the
                                            two-deployment fixture; the
                                            roster-denominator mutant
                                            reds the commensurability
                                            arm; the at-least-one-
                                            principal mutant reds the
                                            three-way-split fixture
    column key-collision (FIRST)     WC-6   class-out-of-key mutant on a
                                            `reinforcement_column`; the
                                            pin moved here from WC-13,
                                            which now re-exercises it
    news-gate pin                    WC-8   ground-truth-read mutant
    cohesion apportionment pin       WC-8   fragment-sum mutant
    defect-target determinism        WC-8   silent-stay mutant; a second
                                            join scorer planted and
                                            caught by the source scan
    move-vocabulary single-exporter  WC-0   second-exporter plant (the
    law-band-table single-exporter   WC-0   fences land in REGISTRATION,
                                            before either volume's
                                            strategy wave -- 4.1)
    relay conservation walker        WC-3   bucket-drop mutant, through
                                            an in-transit tick
    skim-is-theft pin                WC-3   shortfall-without-transfer
                                            mutant (and its converse)
    hysteresis pin                   WC-9   band-flapping mutant
    per-tick-integral fence          WC-7/9 tick-accrual mutant
    envelope exhaustion write-set    WC-10  realm-exhaustion-write
                                            mutant (the one-clause
                                            veto, executed)
    counts-mover manifest            WC-11  stepper-without-row plant;
                                            plus the disjointness proof
                                            (a planted named-person token
                                            does NOT enter this manifest,
                                            and law M is unedited)
    amnesty gate                     WC-11  producer-with-dark-flag
                                            mutant (the vacuous-term
                                            negative) and its lit twin
    call-in fork + lapse             WC-5   flat-draw mutant;
                                            silence-as-refusal mutant
    one-stressor pin                 WC-12  parallel-stressor mutant
    column key-collision (RE-RUN)    WC-13  class-out-of-key mutant on a
                                            `shed_column`
    double-effect single-call pin    WC-14  two-computations mutant
    tag-ledger totality (3 LAWS)     WC-13  FOUR mutants:
                                            tag-without-census-credit
                                            (double-count),
                                            census-credit-without-tag
                                            (lost cohort),
                                            CENSUS-DEBIT-WITHOUT-TAG-ARM
                                            (the phantom garrison -- the
                                            mutant that used to be the
                                            design), and a second
                                            overlay planted (LAW 3)
    TERM_FAMILIES consumer census    WC-0   a planted iteration over
                                            TERM_FAMILIES caught; plus
                                            WR10_FAMILIES_AT_LANDING
                                            widened and
                                            sovereigntyBundleWr10's PIN
                                            1b consumed AS ITS OWN
                                            DOCSTRING INSTRUCTS -- the
                                            family list is DERIVED
                                            (peaceTermsCatalog.js:192),
                                            so the no-producer recipe
                                            does not reach it
    move/law-band discovery signatures WC-0 each signature runs its
                                            NON-VACUITY arm (it must
                                            FIND its own excluded pair)
                                            before its at-most-one
                                            assertion, so a blind
                                            signature reads as an empty
                                            list, never as a pass
    executor event signatures        WC-4   each move's produced event
                                            set pinned with toEqual; the
                                            unnamed-branch mutant reds
    reservation arithmetic           WC-4   reservation-ignored mutant
                                            (sender musters full
                                            capacity); cap-removed
                                            mutant (sender reserves
                                            itself to zero);
                                            recall-clears-this-tick
                                            mutant
    three-deliverer coercion pin     WC-4   standing-deleted mutant (all
                                            three arms) and
                                            standing-into-regression
                                            mutant (the neutral arm: a
                                            loyal town's occupation
                                            collapses)
    comrade-fidelity rider           WC-9   term-deleted, cap-removed,
                                            and depth-raised mutants --
                                            accuracy improves, the
                                            anticipation LEVEL never
                                            does (1.6.4 x HABIT's
                                            level-ONE bound)
    self-origin cohort row           WC-15  self-row-deleted mutant (the
                                            veteran read empties) AND
                                            self-row-admitted mutant
                                            (the diaspora bond reads
                                            itself) -- one fixture, two
                                            halves, opposite failures
    `untag` kind totality            WC-15  a planted fourth kind
                                            caught; the kind set is
                                            asserted EQUAL to
                                            RESIDENCY_TAGS
    mortality-decay fence            WC-15  calendar-decay mutant +
                                            zero-death-rate no-fade
                                            fixture -- CARRIED IN BOTH
                                            VARIANTS until CR-WC-21 is
                                            ruled; the wave does not land
                                            on a coin flip
    live-not-frozen fence            WC-16  frozen-score-write plant
    raw-share non-exposure           WC-7   a planted decimal render
                                            caught by proseNumerics +
                                            the grep fence

Every seam row (SP-D call-ins, HABIT doctrine/closes, WY encounter
rows, WY-8a arrival sharing) is pre-pinned with an executed proof
that the pin CAN red (the planted-consumption test), per the TR-5
pattern.

## 7.F The dependency graph

TWO EDGES WERE MISSING AND ARE RESTORED IN ROUND 2. The graph read
"WC-9 <- WC-6" while WC-9's own LANDS text says CONTRIBUTION_CLOSE_
GRADES' `betrayed` needs skim (WC-3), `unanswered` needs a live call-in
(WC-5), and `partial` needs the request record's askedBand (WC-5); and
it read "WC-11 <- WC-9, WC-10" while WC-11 LANDS "join preference
through WC-8's SHARED joinPreference.js -- consumed, never re-minted",
with WC-8 on no path to WC-11 under the old edges. Both are corrected
below, and the parallelization paragraph is re-derived from the
corrected graph rather than the old one.

    WC-0  <- (nothing)       [mints the COLUMN CLASS union too, moved
                              here from WC-13 in round 2]
    WC-1  <- WC-0
    WC-2  <- WC-1
    WC-3  <- WC-1            [E-row slice gated: WY encounter table]
    WC-4  <- WC-2            [vocabulary contract: HB-1 arbitration;
                              lands the EXECUTOR's aspatial arm]
    WC-5  <- WC-1, WC-2      [call-in slice gated: SP-D; doctrine
                              slice gated: HABIT r5]
    WC-6  <- WC-1, WC-4      [opens with armyTransitKernel
                              decomposition; field batch CR-WC-9;
                              takes the EXECUTOR's spatial arm, which
                              is why WC-4 is now an edge and not a
                              coincidence of ordering]
    WC-7  <- WC-2, WC-6
    WC-8  <- WC-6            [mints joinPreference.js, the shared join
                              scorer WC-11 consumes]
    WC-9  <- WC-3, WC-5, WC-6
                             [CORRECTED. WC-3 for `betrayed`'s skim
                              input and WC-5 for `partial`'s askedBand
                              and `unanswered`'s live call-in -- both
                              stated in WC-9's own LANDS and both
                              absent from the old graph. Feeds K5's
                              comradeship term back to WC-2's read;
                              mints CONTRIBUTION_CLOSE_GRADES and
                              completes CALL_IN_CLOSE_GRADES' honour
                              axis; lights the relay comradeship term
                              and the 1.6.4 fidelity rider]
    WC-10 <- WC-3, WC-6      [HARD GATE: WY-8a built]
    WC-11 <- WC-8, WC-9, WC-10
                             [CORRECTED: WC-8 mints the ONE join
                              scorer this wave consumes unchanged, and
                              lay on no path here before. Opens with
                              the SECOND (counts-mover) manifest;
                              carries the amnesty producer + its
                              executor together]
    WC-12 <- WC-11           [E16/E17 rows with resolvers]
    WC-13 <- WC-11           [lands residentCohorts.js as the TAG
                              ledger's one writer: shed credits census
                              and the tag in ONE event; CONSUMES the
                              column union WC-0 minted]
    WC-14 <- WC-13
    WC-15 <- WC-13, WC-14
    WC-16 <- WC-15

Parallelization, RE-DERIVED from the corrected graph. WC-2 and WC-3 may
still run as parallel lanes after WC-1; so may WC-5 (its only edges are
WC-1 and WC-2). WC-4 joins them once WC-2 lands. THE CORRECTION'S REAL
COST IS AT WC-9: it now waits on THREE waves (WC-3, WC-5, WC-6) rather
than one, so it can no longer run beside WC-5 -- which is correct,
because it consumes WC-5's request record. WC-8 must precede WC-11,
which removes the old graph's licence to defer WC-8 indefinitely.
WC-7 and WC-8 remain parallel after WC-6. Both flags and both trios are
unchanged, so the CQ5 serialization constraint still binds only the
five flag-landing commits (WC-0's two trios, WC-6's, WC-10's, WC-13's,
WC-15's), which serialize; all other wave commits parallelize under
the shared-tree discipline.

CR-WC-16'S QUEUE RECOMMENDATION IS RE-DERIVED FROM THIS GRAPH, not
from the old one: the ARC A slot still opens with WC-0..WC-3, but WC-5
is now firmly INSIDE ARC A's critical path (WC-9 waits on it), so a
queue that deferred call-ins as a nice-to-have would stall the whole
composite arc.

---

END OF VOLUME. Chair questions CR-WC-1..CR-WC-22 await rulings;
WC-0 is buildable on the rulings it needs none of (its pins are
registration-only, its world-level result is byte-identical, and its
one declared movement -- the TERM_FAMILIES ratchet and tripwire -- is
stated in the wave rather than discovered at the gate). The volume's
first behavior
commit is WC-1; its first owner-visible drama is WC-2's stance chip;
its showcase is K4's dueling envelopes at WC-10; its launch-copy
sentence is WC-14's: the world generates its own adventuring class,
with reasons.
