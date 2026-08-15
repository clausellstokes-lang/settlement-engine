# RECEIPT POOLS — FP-COUPLINGS (the cross-wires' voice: the seeded variant corpus)

## Authored 2026-08-02 for the SP-6 CONTENT-DEPTH FLOOR (DESIGN_FP_SPINE.md §2,
## SP-6: "every phrased kind ships a seeded variant pool of AT LEAST FOUR
## templates, seeded per-entity so same-seed worlds keep their sentences …
## exemplar sentences in the volumes are the pool's FIRST member, never its
## whole"). Source volume: docs/DESIGN_FP_COUPLINGS.md (the 21-pair map; waves
## CW-0..CW-3). This annex is CONTENT, not architecture — it invents no
## mechanism, re-opens no ruling, and adds no coupling; its ONE minted token is
## the rendering slot `{layer}` (slot table below, and N-c) [VERIFIER 2026-08-02:
## the old text claimed "mints no token" while the slot table declared an
## extension — reconciled here, decision unchanged]. Where the volume names a
## sentence, that sentence is variant 1.

**DEEPENED 2026-08-03 to the spine's FREQUENCY-SCALED FLOOR** (SP-6 amendment:
chronic and routine kinds at EIGHT to TWELVE angle-distinct templates, notable at
SIX or more, major and rare at FOUR or more). The seventeen CHRONIC pools — the
braid's headline and body lines and all ten cause-walk lines, which a reader meets
on every braided item and every walk — now stand at TEN. The six signature-story
braids are major and stand at five or six. The deepening is APPEND ONLY; see N-j.

**What this file covers, and what it deliberately does not.** The coupling map
builds NOTHING per-pair (J-CPL-1): every per-pair receipt in §4 is minted by
another volume's wave and is pooled in that volume's annex. This volume builds
only the four cross-wires, and only TWO of them speak: **CW-1** (the cascade
governor's braided item) and **CW-2** (the cause-walk surface). Those two
families are the whole of this annex's census. The §9 Herald contract lines
that belong to other volumes are cross-referenced in the notes, never
duplicated here — a second pool for a sibling's kind is exactly the
double-writer defect C-LAW-1 forbids, in content form.

**Pool ids are POOL HANDLES.** The volume specs CW-1 and CW-2 as surfaces and
names their sentences; it registers no kind ids for them. Every block below is
marked `[POOL HANDLE]` for the implementer to reconcile against the real
`WHAT_PHRASES` registration at mint time.

## The slot convention

| Slot | Fills with |
|---|---|
| `{settlement}` | the subject settlement, BY NAME (the address law) |
| `{counterpart}` | a second named settlement — the next town in the chain, the other end of a crossing |
| `{npc}` | a named person the chain's receipts name (the braid never drops a name the address law carried) |
| `{faction}` | the acting faction, seat, or court |
| `{house}` | the named merchant house (a faction with books) |
| `{temple}` | the named temple or cult |
| `{band}` | a band word from the closed quantity vocabulary — never a count |
| `{reason}` | the RECORDED reason, typed, from the receipt's own reason field |
| `{good}` | the named trade good |
| `{route}` | the named road, lane, or pass |
| `{layer}` | **volume-local extension, declared here** — one of the seven layers rendered in the chronicle's own nouns (the camp · the market · the temple · the road · the word · the paper · the hall). The cause-walk's crown promise is "across every layer the cause crossed"; the corpus ten carry no slot for a layer, and a baked "the temple" would be a bake of the crossing itself. Flagged for the chair. |

Every proper noun and every cause is a slot; nothing is baked.

## The laws these pools were written against

- **NO DIGITS.** Counts speak in `{band}` or in band words (a handful, a score,
  many, most). Season and generation words are prose, not counts.
- **HEADLINE HONESTY (R-28).** The braid's verb is entailed by the chain's own
  member receipts — the braid summarizes, it never adds a fact no member
  carries. Where a variant asserts a join, the join is `causes[]`, not
  resemblance (CW-1's identity pin: two unrelated same-window misfortunes do
  not braid).
- **BELIEF ATTRIBUTION.** The walk renders records of being wrong AS records of
  being wrong (CW-2: "the walk never retro-corrects history to truth; dramatic
  irony is the product"). `walk.link_belief` carries its attribution in every
  variant and asserts no truth the record did not hold.
- **LAW ONE.** No god acts; no named person's fate resolves. A house's name is
  ruined, a factor is named, a congregation splits — nobody dies here.
- **AUDIENCE / FAIL-CLOSED.** `dm-only` blocks never reach a player surface
  (J-CPL-5). Two public pools below are additionally **INDISTINGUISHABILITY
  POOLS** — see the resolutions; they are the content half of the fail-closed
  pin and must not be forked.
- **THE FAMILY RULE.** Two variants differing only in slot fills are ONE. Every
  pool spans the angle palette: the event plain · the street's view · the
  ledger's/institution's view · the consequence forward · the understatement.
- **SIGNIFICANCE** is an assignment from SP-6a's one family (routine / notable
  / major) per R5 — the braid DERIVES a class from its top member and mints no
  scale of its own.

## Authoring resolutions (recorded, vetoable)

- **R-CPL-A — `walk.chain_end` is ONE pool for the genuine origin AND the
  covert truncation.** J-CPL-5 and CW-2's hardest pin require a player walk
  over a covert chain to be BYTE-IDENTICAL to a walk over a chain that
  genuinely ends there. Two pools would leak the covert seam through wording
  alone, and a shared pool seeded on the hidden link would leak through variant
  selection. The pool is therefore single, and its seed derives from the
  VISIBLE chain only. Every variant is written to be TRUE in both cases — none
  says "it began here" (false at a covert seam) and none hints at concealment.
  This is the sharpest constraint in the volume and it is a content constraint,
  not only a code one.
- **R-CPL-B — `cascade.braid_partial_public` is the same shape, one layer up.**
  A public braid whose chain has a gap renders identically whether the gap is a
  covert seam or an honestly-unrecorded cause. One pool, seeded on the visible
  chain, every variant true of both.
- **R-CPL-C — `walk.horizon` may NEVER render at a covert seam.** The
  retention-horizon line asserts that records existed and aged out; using it to
  paper over a covert link would be both a lie and a tell (it distinguishes the
  covert case from the genuine end, which R-CPL-A exists to prevent). Horizon
  fires on retention only.
- **R-CPL-D — the two §9 promises are epigraphs, not pool members.** "One
  misfortune, told once, with its whole tail" (CW-1) and "Ask the town why, and
  the town can answer — or tell you honestly that the trail runs past living
  memory" (CW-2) describe what the surfaces PROMISE; they are not lines either
  surface renders. Both are quoted as section epigraphs. The CW-2 promise's
  second clause IS a rendered line and seeds `walk.horizon` variant 1; the
  first clause's shape informs `walk.glance`.
- **R-CPL-E — the six signature stories are authored as SHAPE-KEYED braid
  headline pools.** §5's six stories are CW-2's acceptance fixtures and CW-3
  measures their chain SHAPES ("each observed at least once across the seed
  family, or the drama the program promised is vacant"). A shape a measure
  counts is a shape the paper can lead with, so each story gets its own braid
  pool with its §9 line as variant 1; `cascade.braid_headline` is the fallback
  for cascades matching no named shape. If the chair rules braids are
  shape-blind, the six retire into the generic pool and the census is
  seventeen.
- **R-CPL-F — exemplars are variant 1 in structure, with proper nouns slotted
  and pronouns de-gendered.** The brief asks for the exemplar verbatim;
  constraint 2 forbids a baked name and a pronoun agreeing with a slot is a
  bake. Slotting won, per the TRADE and FAITH annexes' identical ruling. Two
  §9 lines changed: "The house of Marrow could not pay what it never owed" →
  `{house} could not pay…` (the article dropped so `{house}` may render its own
  form, matching TRADE's bare usage), and "**He** cornered the grain…" →
  `{npc} cornered the grain…`. Four §9 lines carry no proper noun and stand
  word-for-word.
- **R-CPL-G — "ten years on" is retained verbatim, on CORRECTED grounds
  [VERIFIER 2026-08-02].** Story 1's §9 line carries a numeral WORD, not a
  digit; constraint 1 bans DIGITS and bands COUNTS OF THINGS, and a duration in
  words is neither. The drafting note cited the voice contract's own exemplars
  as blessing word-counts — they do not: none of the eight carries a count, and
  "They left in the famine year" names a season, not a number. The real warrant
  is corpus precedent, verified on disk this date: every sibling annex spends
  numeral words freely (FAITH "It took a decade and a change of seat"; GRAMMAR
  "It was written for {band} years and it kept every one of them"; POPULATIONS
  "twice at one"), and TRADE de-digited "the spring of '43" to "the spring"
  while retaining its word-counts. Decision unchanged, justification repaired.
- **R-CPL-H — story 5's "bought a mitre" is the street's figure, and the pool
  carries the receipt-honest siblings.** The volume's own fp-audit correction
  (§5 story 5 step 3) closed TR-2's act set with no endowment verb: influence
  rides `extend_credit` and `relief_grant`, not a purchase of an office. The
  §9 line is the chair's own acceptance sentence and stands as variant 1; the
  remaining variants name the credit and the contest so the pool as a whole
  satisfies R-28. Flagged for the chair as the one exemplar where the figure
  outruns the ledger.
- **R-CPL-I — CW-0 and CW-3 mint NOTHING and it is declared, not omitted.**
  The volume says so in its own words: CW-0 — "**Narration/endings/pacing:**
  none minted — the walkers' output is gate reds, not news"; CW-3 — "none
  minted — measurement, not news (declared empty, not omitted)". Neither wave
  appears in the census below and neither is missing from it.
- **R-CPL-J — the braid BODY lines carry no significance of their own.** The
  braided item is one feed item; `cascade.chain_*` and `cascade.address_roll`
  are its body, marked `significance: n/a (braid body line)` on the GRAMMAR
  annex's dossier-line precedent. Only the headline pools carry a class.

## The census (23 phrased kinds)

| Wave | Kinds | Of which DM-only |
|---|---|---|
| CW-0 the registry + walkers | 0 — declared, per R-CPL-I | 0 |
| CW-1 the cascade governor (braid headline + body) | 7 | 1 |
| CW-1 the six signature-story braid shapes (§5 / §9) | 6 | 0 |
| CW-2 the cause-walk surface | 10 | 1 |
| CW-3 the coupling measure | 0 — declared, per R-CPL-I | 0 |

---

# CW-1 — THE CASCADE GOVERNOR (`cascadeGovernorEnabled`)

> *"One misfortune, told once, with its whole tail."* — §9, the governor's
> promise (epigraph; see R-CPL-D)

Display-side composition only (J-CPL-4): the braid edits the paper, never the
world. Member beats keep their own kinds, their own pools, their own ids and
their own feed presence — nothing below replaces a member's sentence. The
braid is itself a receipt: id, full address chain across every member
settlement, typed action `cascade`, reason = the chain.

### cascade.braid_headline (CW-1) `[POOL HANDLE]` — Herald, the braided lead item — significance: derived (routine | notable | major — the cascade's top member class, per R5)
SLOTS: {settlement} {counterpart} {band} {reason}
AUDIENCE: public
1. One thing happened at {settlement} — {reason} — and {band} towns have been answering for it since.
2. They are still arguing in the {settlement} taprooms over which part of it came first.
3. The chroniclers have entered it as one account and not {band}: {reason} at {settlement}, and everything that followed from it.
4. {counterpart} had no part in the beginning and will be paying for it into the next generation.
5. Nothing new happened this season. What happened is that the old thing finished arriving.
6. A carter who has never seen {settlement} can tell you what happened there, and tells it out of order.
7. It began in one season and has not finished in the seasons since.
8. The children at {counterpart} were born into the middle of it and take it for weather.
9. The cost is spread across {band} books, and no single book carries enough of it to alarm a clerk.
10. The reason on the first entry and the reason on the last are the same words; everything between them is towns.

### cascade.chain_open (CW-1) `[POOL HANDLE]` — the braid body, first link (the named ancestor) — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. It began at {settlement}, and the reason on that first entry is {reason}.
2. The first of it was small enough that only the {settlement} clerks troubled to write it down.
3. The account opens where the record opens: {settlement}, {reason}, and nobody yet alarmed.
4. Everything below hangs from that one entry, and {counterpart} has never once been told so.
5. Start at {settlement}. Whatever you have heard since, the paper starts there.
6. In {settlement} that season it was one item among many, and not the item anyone discussed.
7. Travellers came through {settlement} that season carrying no word of it, having seen nothing worth carrying.
8. The clerk who entered it has been asked about it in every season since.
9. What is written first is {reason}; what is remembered first is whatever hurt most.
10. The opening entry cost {settlement} nothing, which is the part that has aged worst.

### cascade.chain_forward_link (CW-1) `[POOL HANDLE]` — the braid body, a forward step — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {reason} {good} {route}
AUDIENCE: public
1. From that came {settlement}'s turn, and its own record gives the reason as {reason}.
2. The word reached {counterpart} next, and {counterpart} answered in its own coin.
3. The next entry stands in {settlement}'s book and names the last one as its cause.
4. Because of it the {good} stopped moving on the {route}, and towns that had never heard of the quarrel went short.
5. Then {counterpart}, which had no interest in any of it until it had no choice.
6. The news went up the {route} faster than the {good} it concerned.
7. By the next season it was {counterpart}'s trouble, and {counterpart} had its own name for it.
8. The hands at the {settlement} scales knew the price had moved before the seat did.
9. The seat at {settlement} answered the way a seat answers: it wrote to {counterpart}, and it doubled the watch.
10. One town's remedy is the next town's cause, and {counterpart}'s book carries both on one page.

### cascade.chain_link_covert (CW-1) `[POOL HANDLE]` — the braid body, DM projection — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {npc} {faction} {reason}
AUDIENCE: dm-only
1. Between those two entries stands a thing neither town knows: {reason}, arranged at {settlement}.
2. The public telling steps over this join. Yours does not: {npc} carried the word, and was paid for carrying it.
3. {faction} is the hand between {settlement} and {counterpart}, unnamed in every telling the towns have.
4. Nothing in either town's book names it, and both books were kept honestly.
5. The towns will go on blaming each other for it, having nothing else to blame.
6. The money for it sits in {faction}'s book under a heading no clerk from either town would think to question.
7. {npc} was paid for a small errand and told nothing of what the errand joined.
8. The towns will publish this account for a generation, and it will always be missing this line.
9. Nobody lied to the chroniclers; the chroniclers were simply never told.
10. Pull this thread at your table and both towns' account of themselves comes apart.

### cascade.chain_close (CW-1) `[POOL HANDLE]` — the braid body, the standing verdict — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {band} {reason}
AUDIENCE: public
1. That is where it stands: {settlement} the worse for it, and nobody yet answering for the first part.
2. The clerks closed the account this season; they did not say it was finished.
3. It has stopped moving, which is not the same as being over.
4. What began as {reason} is now the ordinary condition of {settlement}, and no one calls it news.
5. At {settlement} they blame the nearest name; the first entry names another.
6. A stranger arriving now would take the state of {settlement} for its natural one.
7. It is a season's work to undo, and {settlement} has no season to spare for it.
8. The men who carried the worst of it are back at their trades and do not speak of it there.
9. {counterpart} still carries the cost in its ledger, under a heading nobody now can explain.
10. The account is closed and the habit is not: {settlement} still does what {reason} first required of it.

### cascade.address_roll (CW-1) `[POOL HANDLE]` — the braid body, the roll of towns — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. It touched {settlement}, {counterpart}, and {band} more before the season turned.
2. Ask at any of the towns named below and you get the same story from a different end.
3. The account is entered on every page it touches: {settlement} and {counterpart} both carry it, word for word.
4. {counterpart} was never party to a line of it and will carry the entry for as long as the book lasts.
5. The roll of towns is longer than the tale deserves, and every one of them is named in it.
6. The roll reads like a carter's route, because for a season that is what it was.
7. It is read out at {settlement} on the season's accounting, and it is longer each time it is read.
8. Some of these towns are a day apart and some a month, and the trouble did not notice.
9. Children at {counterpart} can recite the roll and could not tell you what the first name on it did.
10. The clerks name every town, including the ones that only ever heard about it.

### cascade.braid_partial_public (CW-1) `[POOL HANDLE]` — Herald, the braided lead item over a chain with a gap — significance: derived (routine | notable | major, per R5)
SLOTS: {settlement} {counterpart}
AUDIENCE: public
*(INDISTINGUISHABILITY POOL — R-CPL-B. Serves a covert seam and an honestly-unrecorded cause alike; seeded on the visible chain only; no variant may hint at concealment.)*
1. The gap changes nothing downstream: {counterpart} pays as though the join were written.
2. There is a step missing between {settlement} and {counterpart}, and the clerks were honest enough to leave the space.
3. The towns had joined these two events long before any book did.
4. Whatever crossed between them crossed without a witness who wrote.
5. The account runs {settlement}, then {counterpart}. What it does not run is why.
6. The two ends are certain and the middle is a matter of opinion.
7. Every telling supplies its own middle, and no two tellings supply the same one.
8. {counterpart}'s book carries the consequence and no cause, which is common enough and comfortable to nobody.
9. A traveller riding between them that season would tell you the road was ordinary.
10. The unwritten part costs nothing to guess at, and the guessing has cost {counterpart} plenty.

---

# CW-1 (continued) — THE SIX SIGNATURE-STORY BRAIDS (§5's shapes; §9's lines)

Per R-CPL-E. Each pool's variant 1 is the story's §9 Herald contract line.
These are the shapes CW-3's envelope must observe at least once across the seed
family, and the chains CW-2 must render end to end or the program has failed
its own crown law.

### cascade.braid.reformation (CW-1; §5 story 1 — CPL-15 × CPL-7 × CPL-2 × CPL-13) `[POOL HANDLE]` — Herald, the braided lead item — significance: major (derived; the shape carries a major member)
SLOTS: {settlement} {counterpart} {temple} {faction}
AUDIENCE: public
1. The tithe was disputed at law; ten years on, the altars are strangers to each other. *(Herald-contract exemplar, verbatim; "ten" is a word and not a digit — flagged for the verifier per R-CPL-G)*
2. It started as a quarrel over {temple}'s books at {settlement} and ended with two congregations who will not share a door.
3. The chancery entered it as a revenue matter; {temple} entered it as the beginning of the end.
4. {counterpart} has not forgiven the split, and {counterpart} was never in the room where it happened.
5. What the seat wanted was the money. What the seat has now is a creed of its own and neighbours who will not eat with it.
6. {faction} pressed the claim, won it, and has been explaining the win at every assize since.

### cascade.braid.pilgrim_road (CW-1; §5 story 2 — CPL-12 × CPL-1 × CPL-2 × CPL-5) `[POOL HANDLE]` — Herald, the braided lead item — significance: major (derived; the shape carries a major member)
SLOTS: {settlement} {counterpart} {route} {temple}
AUDIENCE: public
1. The road to the shrine ran red, and the faithful called it war. *(Herald-contract exemplar, verbatim)*
2. {settlement} took the {route} for {counterpart}'s artery and cut it; the cutting is what the sermons are about now.
3. The season's tally at {counterpart}: fewer pilgrims at {temple}, more grievance entries against {settlement}, one war opened on the road's account.
4. Whatever pact reopens the {route} will cost more than the tolls nobody would pay for it.
5. It was a raid on wagons. It became a matter of the god the wagons were going to see.

### cascade.braid.house_run (CW-1; §5 story 3 — CPL-9 × CPL-4 × CPL-11 × CPL-20) `[POOL HANDLE]` — Herald, the braided lead item — significance: major (derived; the shape carries a major member)
SLOTS: {settlement} {house} {band} {good}
AUDIENCE: public
1. {house} could not pay what it never owed. *(Herald-contract exemplar, slotted per R-CPL-F; the article dropped so `{house}` renders its own form)*
2. The word went round the {settlement} quays that {house}'s next {good} would not arrive, and the word was enough.
3. Every refusal was reasonable on its own page; the book shows {band} of them inside one season.
4. The creditors who broke {house} are the same men who will need a borrower next season.
5. Nothing was ever proved against {house}, and nothing needed to be.

### cascade.braid.diaspora_return (CW-1; §5 story 4 — CPL-3 × CPL-16 × CPL-18 × CPL-8) `[POOL HANDLE]` — Herald, the braided lead item — significance: major (derived; the shape carries a major member)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. They left in the famine year; their grandsons' silver raised the walls. *(Herald-contract exemplar, verbatim)*
2. {settlement} emptied toward {counterpart} in a bad season and has been quietly funded from there ever since.
3. The ledgers at {counterpart} carry the old country under obligations, generation upon generation.
4. What went out as refugees is coming back as creditors, and the debt is not only silver.
5. The generation that left kept the grudge better than it kept the rite.
6. {band} houses at {counterpart} still enter {settlement} as home, and none of them has seen it.

### cascade.braid.corner_and_mitre (CW-1; §5 story 5 — CPL-9 × CPL-7 × CPL-15 × CPL-20) `[POOL HANDLE]` — Herald, the braided lead item — significance: major (derived; the shape carries a major member)
SLOTS: {settlement} {npc} {house} {temple} {good}
AUDIENCE: public
1. {npc} cornered the grain in the hungry season, and bought a mitre with the profit. *(Herald-contract exemplar; "He" → `{npc}` per R-CPL-F; the mitre is the street's figure and the siblings below carry the ledger — R-CPL-H)*
2. The {good} of {settlement} sat in shut granaries while the queues formed, and men counted whose granaries they were.
3. {house}'s book shows the corner, the credit extended to {temple}, and the contest {temple} won, in that order and on facing pages.
4. {temple} will be answering for whose money raised it long after the hungry season is forgotten.
5. Nothing in it was unlawful, which is the part the {settlement} pews find hardest.

### cascade.braid.rush_and_war (CW-1; §5 story 6 — CPL-16 × CPL-4 × CPL-3 × CPL-5 × CPL-1) `[POOL HANDLE]` — Herald, the braided lead item — significance: major (derived; the shape carries a major member)
SLOTS: {settlement} {counterpart} {band} {route}
AUDIENCE: public
1. There was gold in the river, men said. There was war in the spring. *(Herald-contract exemplar, verbatim; carries its own attribution)*
2. {band} came over the {route} on the strength of a story, and {settlement} turned most of them back at the wall.
3. The tally at the creek and the tally in the taprooms are not the same tally, and the courts marched on the second.
4. Both courts read the same river, and each read it as the other's advantage.
5. Nobody ordered the rush and nobody priced the war; both arrived on time.

---

# CW-2 — THE CAUSE-WALK SURFACE (no flag; a read-only DM surface)

> *"Ask the town why, and the town can answer — or tell you honestly that the
> trail runs past living memory."* — §9, the walk's promise (epigraph; see
> R-CPL-D)

Pure read over persisted receipts, rendered glance → sentence → table
(LEGIBILITY LAW). The walk renders what RECORDS say, including records of being
wrong. Player walks FAIL CLOSED at covert seams (J-CPL-5).

### walk.glance (CW-2) `[POOL HANDLE]` — the cause-walk surface, the glance tier — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {reason} {band}
AUDIENCE: public
1. Ask {settlement} why, and {settlement} can answer: it runs back to {reason}, at {counterpart}.
2. The short of it, for a reader who wants no more: {reason}, and every season since.
3. The clerks give one sentence and then the table — {counterpart}, {reason}, {band} steps between.
4. Whatever {settlement} does next, it will be doing it about {reason}.
5. It is not a mystery. It is only long.
6. Ask in the {settlement} market and you get the same answer as at the seat, with worse manners.
7. It is a matter of seasons and not of one bad week, and {settlement} will tell you so in that order.
8. The road to {counterpart} carries a shorter version of this, and it is not wrong, only thin.
9. The oldest hands at {settlement} start the account a generation before the clerks do; the walk keeps to what was written.
10. The whole of it fits in a sentence, and not one of the towns in it will accept that sentence.

### walk.link (CW-2) `[POOL HANDLE]` — the cause-walk surface, a rendered step — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. Behind that stands {settlement}, where the recorded reason is {reason}.
2. Ask the same question at {settlement} and you get the same account with the blame moved a town over.
3. The step before is entered in {settlement}'s book, cause and season together, as {reason}.
4. It was {reason} at {settlement} that made the next thing possible, and the next thing has never said so.
5. Then {counterpart}, which is where most tellings of this stop.
6. A season lies between this step and the next, and the season is the part nobody entered.
7. The clerk at {settlement} wrote it up as ordinary business, and at the time it was.
8. On the road this step is remembered as a bad month; the book gives it a line.
9. What {settlement} did here it did for its own reasons, and those reasons are {reason} and no larger.
10. From here the account belongs to {counterpart}, which received it without asking for it.

### walk.link_person (CW-2) `[POOL HANDLE]` — the cause-walk surface, a step a named person made — significance: n/a (walk surface line)
SLOTS: {settlement} {npc} {band} {reason}
AUDIENCE: public
1. {npc} stands at this step, {band} in standing and named in the entry.
2. At {settlement} they still name {npc} for it, and {npc} has never troubled to deny it.
3. The entry names {npc} and gives the reason as {reason}, and gives no more than that.
4. Whatever {npc} does hereafter, a walk backward will find this page first.
5. One person, one decision, and {band} towns downstream of it.
6. The entry gives {npc}'s office and not {npc}'s reasons; the reasons are the town's guess.
7. It took {npc} an afternoon and it has taken {settlement} seasons.
8. Riders carried {npc}'s name further than {npc} has ever travelled.
9. {npc} signed where {npc} was expected to sign, and the signature is what the walk has.
10. Whether {npc} understood what it would come to is not in the record; that {npc} did it is.

### walk.link_belief (CW-2) `[POOL HANDLE]` — the cause-walk surface, a step that is a record of belief — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. Here the record is of a belief and not a fact: {settlement} held that {reason}, and acted on it.
2. A later entry marks it mistaken; the walk leaves the mistake where it was made.
3. The entry reads believed and not confirmed — the clerks marked it so at the time, and it stands marked.
4. {settlement} moved on what it took to be true, and the page after this one answers for the taking.
5. The reason on this step is not what {settlement} was, but what {counterpart} took it for.
6. What {settlement} had was a report, and a report was enough to move a seat.
7. The {settlement} market believed it by the afternoon, and a market is not required to check.
8. Both towns entered accounts of that season as certain, and the two accounts do not agree.
9. The belief cost {settlement} what a fact would have cost, and cost it in the same season.
10. The clerk wrote down what was brought to the door, and noted who brought it.

### walk.link_covert (CW-2) `[POOL HANDLE]` — the cause-walk surface, DM projection (`includeCovert`) — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {npc} {faction} {reason}
AUDIENCE: dm-only
1. This step is covert: {faction} moved between {settlement} and {counterpart}, and neither town's record says so.
2. A player walking this chain stops at the step above. You do not.
3. The covert entry names {npc} and a patron in {counterpart}, and the reason entered is {reason}.
4. Take this step out and the public chain still reads, which is exactly why it holds.
5. The join the towns cannot see is the join that carried the whole weight.
6. The arrangement was made a season before it was needed, which is the part that is not accident.
7. The towns have a telling of this step they like better, and years in which to smooth it.
8. A handful at {settlement} could tell you the truth of it, and none of them has a reason to.
9. The word travelled by a road neither town would have thought to watch.
10. This step is the difference between what happened and what is known to have happened.

### walk.crossing (CW-2) `[POOL HANDLE]` — the cause-walk surface, a step that crosses layers — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {layer} {reason}
AUDIENCE: public
1. Here the account passes out of {layer} and into another hand entirely: the same cause, a different set of clerks.
2. It stopped being a matter for {layer} at this step, and nobody at {settlement} noticed the crossing.
3. The entry appears in two books at once — {layer}'s and the one that follows — with one reason between them, {reason}.
4. From here on it is not the same kind of trouble, and the towns that answer for it are new ones.
5. {layer} handed it on and did not follow it. The walk does.
6. The hands that held it in {layer} would not recognise what it became.
7. It changed hands the way goods change hands, and lost its papers in the changing.
8. {counterpart} met it in its second form and has never seen the first.
9. A season stands between the two entries, and the later book enters it as a fresh matter.
10. The reason travels whole and the manner of it does not: {reason}, argued now in a room that keeps different books.

### walk.chain_end (CW-2) `[POOL HANDLE]` — the cause-walk surface, the end of the trail — significance: n/a (walk surface line)
SLOTS: {settlement}
AUDIENCE: public
*(INDISTINGUISHABILITY POOL — R-CPL-A. This ONE pool serves both a genuine origin and a covert truncation; it is seeded on the VISIBLE chain only. Every variant is true in both cases; none asserts a beginning and none hints at concealment. Forking this pool breaks J-CPL-5's byte-identity pin.)*
1. And there the trail is cold; the record carries nothing before this.
2. Ask at {settlement} what came before and you get a shrug and the name of a season.
3. The book opens here, and a book's opening is not always a beginning.
4. Whatever made this, it was made out of the walk's sight, and the walk says so plainly.
5. This is as far back as anyone can honestly take you.
6. {settlement} has had a long while to invent something earlier, and has not troubled to.
7. Whatever came earlier left no entry in any book {settlement} keeps.
8. Ask a carter and the account starts further back, with nothing written under the starting.
9. The oldest hands at {settlement} agree on a season and on nothing inside it.
10. What lies further back is somebody's telling and not the town's record.

### walk.horizon (CW-2) `[POOL HANDLE]` — the cause-walk surface, the retention horizon — significance: n/a (walk surface line)
SLOTS: {settlement}
AUDIENCE: public
*(Retention only — never at a covert seam, per R-CPL-C.)*
1. The trail runs past living memory; the walk stops here rather than invent the rest. *(Herald-contract promise's rendered clause — R-CPL-D)*
2. Old men at {settlement} remember something before this, and the clerks of the day did not write it down.
3. The town keeps its books only so long, and the earlier entries have been let go.
4. Whatever caused this is older than the record, and the record will not guess on your behalf.
5. It goes further back. The paper does not.
6. The earlier books were kept until the room was wanted, and then they were not.
7. What is missing here was written once, and the keeping of it was another generation's charge.
8. Books this old go for the ordinary reasons: damp, a move, a clerk with no room for them.
9. Travellers still repeat what the older entries said, and the repeating is all that is left of them.
10. {settlement} remembers the shape of what it no longer holds the paper for.

### walk.depth_capped (CW-2) `[POOL HANDLE]` — the cause-walk surface, the rendered-link cap — significance: n/a (walk surface line)
SLOTS: {band}
AUDIENCE: public
1. The chain runs {band} steps further; the page shows what a page can hold.
2. Ask further back at the taproom and you will get {band} steps more, told worse.
3. The stop here is the page's and not the record's — the entries continue below it.
4. Follow it further and you will be in another generation's business.
5. The rest is entered and unread, which is the ordinary fate of entries.
6. There is more, and the more of it is the same shape as this.
7. Any clerk with an afternoon can take it back another {band} steps.
8. The deeper entries belong to grandfathers, and grandfathers keep their own order.
9. The rest of the account keeps; it has kept this long.
10. The deeper part gets told on long roads, and lengthens with the road.

### walk.table_caption (CW-2) `[POOL HANDLE]` — the cause-walk surface, the table tier — significance: n/a (walk surface line)
SLOTS: {band}
AUDIENCE: public
1. Step, town, reason — the whole chain, in the order the clerks entered it.
2. Read the table backward and you read the cause; read it forward and you read the ruin.
3. The bottom row is the oldest, and it is the one still costing.
4. What follows is the table the sentence above was made of.
5. {band} steps, {band} towns, and one cause holding them together.
6. Each row was somebody's ordinary season before it was a step in this.
7. The order is the clerks' and not the town's; the town would put itself last.
8. Nothing in the table is argued; the argument starts after it.
9. Take the table on the road and any town named in it will add to it.
10. The columns are short because the entries were short. The trouble was not.

---

## §N AUTHORING NOTES — ambiguities resolved in the writing

*Deliberately UNNUMBERED: a pool extractor scans `^<digit>. ` inside a `###`
block, and a numbered list here would be scooped as variants of the last kind.*

**N-a. The census is small on purpose, and the smallness is the discipline.**
   The coupling map's crown law is J-CPL-1 — one owning wave, one volume, per
   coupling. Every per-pair receipt in §4 belongs to another volume's wave, so
   a per-pair pool here would be a second writer for a sibling's kind. The
   twenty-three kinds below are exactly the sentences CW-1 and CW-2 mint and
   nobody else can.

**N-b. The §9 Herald contract lines that are NOT this volume's, cross-
   referenced.** Four of the twelve are already pooled by siblings and are not
   duplicated: "The court knew, and sat still" is IN-5's `court_sat_still`
   (RECEIPT_POOLS_INFORMATION.md); "The priests read the famine as wrath…" is
   WF-4's `faith.reading.wrath` (RECEIPT_POOLS_FAITH.md); "Grain is dear in the
   east, they say…" belongs with TR-3's `market.believed_dear`
   (RECEIPT_POOLS_TRADE.md); "Sworn under the old Margrave; broken by the new"
   belongs with GR-1's `oath_stamp.*` (RECEIPT_POOLS_GRAMMAR.md). The two CW
   promises are epigraphs (R-CPL-D). The remaining six are the story braids
   above. **VERIFIER 2026-08-02 — all four checked against the sibling annexes
   on disk; the drafting note named the wrong two.** SEEDED: INFORMATION's
   `court_sat_still` variant 1 carries the line ("The court knew, and sat
   still; the knowing is part of the account now"), and TRADE's
   `market.believed_dear` variant 1 IS the §9 sentence slotted ("{good} is
   dear in {counterpart}, they say — and dearer for the saying"). NOT SEEDED:
   the FAITH pool `faith.reading.wrath` exists but no member carries "the
   granaries emptied all the same", and GRAMMAR's `oath_stamp.person`/`.seat`
   carry the kind but not the Margrave sentence. So the placements-by-subject
   are the SECOND and FOURTH, not the third and fourth: if the chair wants
   every §9 line seeded verbatim somewhere, FAITH and GRAMMAR each need a
   one-line addition in their owning annexes — never a pool here.

**N-c. `{layer}` is the volume's one minted slot** and it is a rendering slot,
   not a new vocabulary: the seven layers are the map's own closed set, spoken
   in the chronicle's nouns rather than the architecture's. If the chair
   prefers the crossing line to name institutions concretely instead, the pool
   loses one slot and gains nothing else. [VERIFIER 2026-08-02] The extension
   is corpus-consistent and stays: the FAITH annex mints four volume-local
   slots (`{creed}`, `{rival_creed}`, `{calamity}`, `{when}`) in the same
   declare-and-justify shape, so a local slot with a written rationale is the
   established pattern, not this volume's invention.

**N-d. The braid never summarizes a name away.** CW-1's own rule ("no
   summarization ever drops a name the address law carried") makes
   `cascade.address_roll` a required body line rather than an optional
   flourish — the roll is where the members' settlements survive the braid.
   Recorded because a composer that renders headline + chain and skips the roll
   would satisfy every pin and quietly break the address law.

**N-e. Damped members mint nothing.** J-CPL-4 keeps damped member beats
   individually present with their own ids and their own pools; there is no
   "this was damped" sentence and there must not be one, since a damping notice
   would make the governor visible in the world it is only allowed to edit on
   the page. Declared, not omitted.

**N-f. `walk.link` renders the CONNECTIVE, not the member's own sentence.** A
   walked step shows the member receipt's own pooled line; these variants are
   the walk's frame around it. An implementer who renders both this line and
   the member's line as peers will produce doubled prose — the frame carries
   `{settlement}` and `{reason}` precisely so it can stand alone where a
   member's own pool is dark.

**N-g. Two pools are load-bearing for a SECURITY pin, not only for voice.**
   `walk.chain_end` (R-CPL-A) and `cascade.braid_partial_public` (R-CPL-B) are
   the content half of J-CPL-5's fail-closed law. A future editor who "improves"
   either pool by adding a variant that reads like a beginning, or one that
   hints at something withheld, breaks a pin that lives in another file. Both
   blocks carry the warning inline for that reason.

**N-h. Significance for the six story braids is asserted, not derived from a
   receipt.** Each named shape is claimed to carry a major member (a schism, a
   war, a ruin, a refounding, a scandal, a war). That is a reading of §5, not a
   measurement; CW-3's aliveness floors will settle it. If a shape turns out to
   braid without a major member, its class derives down like any other cascade
   and this line is the record of the assumption.

**N-i. THE VERIFIER PASS, 2026-08-02 — what an adversarial read changed, and
   what it let stand.** The census was re-derived from the volume and HOLDS at
   twenty-three: CW-0 and CW-3 mint nothing by the volume's own words (R-CPL-I),
   CW-1's seven plus the six story braids and CW-2's ten are each entailed by a
   named line of §6 or §9, and no kind was added or removed. Mechanically clean
   on the first four constraints: zero digits, zero baked proper nouns, zero
   exclamation marks, zero archaisms, every block at five or six variants, both
   covert blocks carrying `AUDIENCE: dm-only`. FIFTEEN variants were rewritten,
   in five classes, and four claims in the notes and rulings were corrected. (1) TRUTH ASSERTED BEYOND THE RECORD — `walk.link_belief`
   said "They were wrong" and "it was never so" on a PUBLIC surface, which
   states as engine truth a falsity only a confirmed misjudgment record
   entails; one pool serves every belief-side step, so both now attribute the
   wrongness to a later entry or frame the reason as a taking. (2) THE
   INDISTINGUISHABILITY POOL LEAKED BY ASSERTION — `walk.chain_end`'s "There is
   no earlier entry" is FALSE at a covert seam and so fails R-CPL-A's own
   standard that every variant be true in both cases; it now says the book
   opens here without claiming a beginning. (3) CROSS-POOL TWINS —
   `cascade.chain_link_covert` variants 4 and 5 were near-copies of
   `walk.link_covert` 4 and 5, and both surfaces render to the same DM over the
   same chain; the braid's two were replaced on the ledger and consequence
   angles. (4) ARCHITECTURE VOCABULARY IN RENDERED PROSE — "the rings",
   "capped by the surface", "the public braid", "every row is a receipt" name
   the machinery a reader must never see (GAME-GRADE UX: translate, never
   show); all four now speak in books, pages, tellings and rows. (5) ANGLE
   FLOOR AND LENGTH — `walk.depth_capped` had three meta-about-the-page
   variants and no street's view, `cascade.chain_close` and
   `cascade.braid_partial_public` each carried an angle twin, and
   `cascade.braid_headline` variant 1 ran to three clauses; each pool now
   spans four or more angles at one to two clauses. Two forward-angle
   variants that asserted a future EVENT rather than a continuing condition
   (a pact that will come, creditors who will find nobody) were reframed
   conditionally under R-28. LET STAND, deliberately: "ten years on" and the
   corpus's ordinary "one"/"two" (R-CPL-G, justification repaired, decision
   kept); `{layer}` (N-c, precedented in FAITH); the six story braids as
   shape-keyed pools (R-CPL-E — a chair veto retires them into the generic
   pool and the census becomes seventeen, exactly as drafted).

**N-j. THE DEEPENING PASS, 2026-08-03 — the frequency-scaled floor applied.**
   *This note supersedes N-i's clause "every block at five or six variants" and
   nothing else in it.* The spine's SP-6 amendment scales the floor to how often
   a reader meets a kind, and both CW families are CHRONIC: a braid renders its
   headline plus a body line for every member, and the cause-walk is a surface a
   DM opens on every question, so a reader meets these seventeen sentences more
   often than any other in this volume. All seventeen were raised to TEN
   variants, IN PLACE and BY APPEND: no existing variant was renumbered,
   reworded or dropped, and no `SLOTS:` line changed, so a same-seed world that
   already drew variant three still draws variant three. The six signature-story
   braids were left at five and six — a named shape is a once-a-generation lead
   item (R-CPL-E, N-h) and sits at its own class floor. The census stays at
   twenty-three kinds; only depth moved, from one hundred seventeen variants to
   two hundred two.

   **The angles the deepening used.** The original five (event plain · street ·
   ledger · consequence forward · understatement) were spent at five, so the
   appended lines run on the widened palette: *the traveller's report* (the
   carter who has the shape of it and not the reason; the road that carries a
   thinner version), *the season's frame* (a season lying between two entries;
   an account that began in one season and has not finished in the seasons
   since), and *the small human detail* (the clerk who has been asked about it
   every season since; the hands at the scales who knew before the seat; the
   children born into the middle of it). The two DM-only pools took the palette
   hardest, since the street's view is not available to a covert line: their new
   variants run on the money's heading, the errand-runner told nothing, the
   timing that is not accident, and what a table does with the thread.

   **The two SECURITY pools were deepened under their own constraints, not
   relaxed by them (N-g stands).** Every appended `walk.chain_end` variant is
   true both at a genuine origin and at a covert truncation and none asserts a
   beginning — the town's failure to invent an earlier cause, the carter's
   unwritten start, the oldest hands agreeing on a season and nothing inside it,
   what lies further back being somebody's telling. Every appended
   `cascade.braid_partial_public` variant is likewise true of a covert seam and
   an honestly-unrecorded cause alike, and the traveller variant was written so
   that an ordinary road is what a rider would report in BOTH cases. No appended
   variant in either pool hints at anything withheld. `walk.horizon` kept
   R-CPL-C: all five new lines assert retention and only retention (books kept
   until the room was wanted, a charge that belonged to another generation, damp
   and a move and a clerk with no room), and not one of them could stand at a
   covert seam.

   **Mechanically verified over the whole file after the pass (CONFIRMED — all
   twenty-three blocks parsed):** numbering contiguous from one in every block;
   the pre-deepening variant list is a byte-exact prefix of every block's new
   list; every `SLOTS:` line unchanged; zero digits, zero engine number words and
   zero exclamation marks in the eighty-five new variants; every slot token used
   is declared by its own pool's `SLOTS:` line; maximum pairwise similarity
   inside any pool, slots blanked, is 0.38 against the corpus's 0.45 family-rule
   ceiling, and the worst cross-pool pair is 0.39. Two appended variants were
   rewritten during the pass for restating a pool-mate's rhetorical move rather
   than its subject — a belief-side line that reprised variant five's "not what
   it was but what it was taken for", and a chain-end line that reprised variant
   one's plain absence. Angle distinctness itself is an authored judgment and is
   recorded here as one; the similarity number is only its proxy.
