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

### cascade.chain_open (CW-1) `[POOL HANDLE]` — the braid body, first link (the named ancestor) — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. It began at {settlement}, and the reason on that first entry is {reason}.
2. The first of it was small enough that only the {settlement} clerks troubled to write it down.
3. The account opens where the record opens: {settlement}, {reason}, and nobody yet alarmed.
4. Everything below hangs from that one entry, and {counterpart} has never once been told so.
5. Start at {settlement}. Whatever you have heard since, the paper starts there.

### cascade.chain_forward_link (CW-1) `[POOL HANDLE]` — the braid body, a forward step — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {reason} {good} {route}
AUDIENCE: public
1. From that came {settlement}'s turn, and its own record gives the reason as {reason}.
2. The word reached {counterpart} next, and {counterpart} answered in its own coin.
3. The next entry stands in {settlement}'s book and names the last one as its cause.
4. Because of it the {good} stopped moving on the {route}, and towns that had never heard of the quarrel went short.
5. Then {counterpart}, which had no interest in any of it until it had no choice.

### cascade.chain_link_covert (CW-1) `[POOL HANDLE]` — the braid body, DM projection — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {npc} {faction} {reason}
AUDIENCE: dm-only
1. Between those two entries stands a thing neither town knows: {reason}, arranged at {settlement}.
2. The public telling steps over this join. Yours does not: {npc} carried the word, and was paid for carrying it.
3. {faction} is the hand between {settlement} and {counterpart}, unnamed in every telling the towns have.
4. Nothing in either town's book names it, and both books were kept honestly.
5. The towns will go on blaming each other for it, having nothing else to blame.

### cascade.chain_close (CW-1) `[POOL HANDLE]` — the braid body, the standing verdict — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {band} {reason}
AUDIENCE: public
1. That is where it stands: {settlement} the worse for it, and nobody yet answering for the first part.
2. The clerks closed the account this season; they did not say it was finished.
3. It has stopped moving, which is not the same as being over.
4. What began as {reason} is now the ordinary condition of {settlement}, and no one calls it news.
5. At {settlement} they blame the nearest name; the first entry names another.

### cascade.address_roll (CW-1) `[POOL HANDLE]` — the braid body, the roll of towns — significance: n/a (braid body line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. It touched {settlement}, {counterpart}, and {band} more before the season turned.
2. Ask at any of the towns named below and you get the same story from a different end.
3. The account is entered on every page it touches: {settlement} and {counterpart} both carry it, word for word.
4. {counterpart} was never party to a line of it and will carry the entry for as long as the book lasts.
5. The roll of towns is longer than the tale deserves, and every one of them is named in it.

### cascade.braid_partial_public (CW-1) `[POOL HANDLE]` — Herald, the braided lead item over a chain with a gap — significance: derived (routine | notable | major, per R5)
SLOTS: {settlement} {counterpart}
AUDIENCE: public
*(INDISTINGUISHABILITY POOL — R-CPL-B. Serves a covert seam and an honestly-unrecorded cause alike; seeded on the visible chain only; no variant may hint at concealment.)*
1. The gap changes nothing downstream: {counterpart} pays as though the join were written.
2. There is a step missing between {settlement} and {counterpart}, and the clerks were honest enough to leave the space.
3. The towns had joined these two events long before any book did.
4. Whatever crossed between them crossed without a witness who wrote.
5. The account runs {settlement}, then {counterpart}. What it does not run is why.

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

### walk.link (CW-2) `[POOL HANDLE]` — the cause-walk surface, a rendered step — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. Behind that stands {settlement}, where the recorded reason is {reason}.
2. Ask the same question at {settlement} and you get the same account with the blame moved a town over.
3. The step before is entered in {settlement}'s book, cause and season together, as {reason}.
4. It was {reason} at {settlement} that made the next thing possible, and the next thing has never said so.
5. Then {counterpart}, which is where most tellings of this stop.

### walk.link_person (CW-2) `[POOL HANDLE]` — the cause-walk surface, a step a named person made — significance: n/a (walk surface line)
SLOTS: {settlement} {npc} {band} {reason}
AUDIENCE: public
1. {npc} stands at this step, {band} in standing and named in the entry.
2. At {settlement} they still name {npc} for it, and {npc} has never troubled to deny it.
3. The entry names {npc} and gives the reason as {reason}, and gives no more than that.
4. Whatever {npc} does hereafter, a walk backward will find this page first.
5. One person, one decision, and {band} towns downstream of it.

### walk.link_belief (CW-2) `[POOL HANDLE]` — the cause-walk surface, a step that is a record of belief — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. Here the record is of a belief and not a fact: {settlement} held that {reason}, and acted on it.
2. A later entry marks it mistaken; the walk leaves the mistake where it was made.
3. The entry reads believed and not confirmed — the clerks marked it so at the time, and it stands marked.
4. {settlement} moved on what it took to be true, and the page after this one answers for the taking.
5. The reason on this step is not what {settlement} was, but what {counterpart} took it for.

### walk.link_covert (CW-2) `[POOL HANDLE]` — the cause-walk surface, DM projection (`includeCovert`) — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {npc} {faction} {reason}
AUDIENCE: dm-only
1. This step is covert: {faction} moved between {settlement} and {counterpart}, and neither town's record says so.
2. A player walking this chain stops at the step above. You do not.
3. The covert entry names {npc} and a patron in {counterpart}, and the reason entered is {reason}.
4. Take this step out and the public chain still reads, which is exactly why it holds.
5. The join the towns cannot see is the join that carried the whole weight.

### walk.crossing (CW-2) `[POOL HANDLE]` — the cause-walk surface, a step that crosses layers — significance: n/a (walk surface line)
SLOTS: {settlement} {counterpart} {layer} {reason}
AUDIENCE: public
1. Here the account passes out of {layer} and into another hand entirely: the same cause, a different set of clerks.
2. It stopped being a matter for {layer} at this step, and nobody at {settlement} noticed the crossing.
3. The entry appears in two books at once — {layer}'s and the one that follows — with one reason between them, {reason}.
4. From here on it is not the same kind of trouble, and the towns that answer for it are new ones.
5. {layer} handed it on and did not follow it. The walk does.

### walk.chain_end (CW-2) `[POOL HANDLE]` — the cause-walk surface, the end of the trail — significance: n/a (walk surface line)
SLOTS: {settlement}
AUDIENCE: public
*(INDISTINGUISHABILITY POOL — R-CPL-A. This ONE pool serves both a genuine origin and a covert truncation; it is seeded on the VISIBLE chain only. Every variant is true in both cases; none asserts a beginning and none hints at concealment. Forking this pool breaks J-CPL-5's byte-identity pin.)*
1. And there the trail is cold; the record carries nothing before this.
2. Ask at {settlement} what came before and you get a shrug and the name of a season.
3. The book opens here, and a book's opening is not always a beginning.
4. Whatever made this, it was made out of the walk's sight, and the walk says so plainly.
5. This is as far back as anyone can honestly take you.

### walk.horizon (CW-2) `[POOL HANDLE]` — the cause-walk surface, the retention horizon — significance: n/a (walk surface line)
SLOTS: {settlement}
AUDIENCE: public
*(Retention only — never at a covert seam, per R-CPL-C.)*
1. The trail runs past living memory; the walk stops here rather than invent the rest. *(Herald-contract promise's rendered clause — R-CPL-D)*
2. Old men at {settlement} remember something before this, and the clerks of the day did not write it down.
3. The town keeps its books only so long, and the earlier entries have been let go.
4. Whatever caused this is older than the record, and the record will not guess on your behalf.
5. It goes further back. The paper does not.

### walk.depth_capped (CW-2) `[POOL HANDLE]` — the cause-walk surface, the rendered-link cap — significance: n/a (walk surface line)
SLOTS: {band}
AUDIENCE: public
1. The chain runs {band} steps further; the page shows what a page can hold.
2. Ask further back at the taproom and you will get {band} steps more, told worse.
3. The stop here is the page's and not the record's — the entries continue below it.
4. Follow it further and you will be in another generation's business.
5. The rest is entered and unread, which is the ordinary fate of entries.

### walk.table_caption (CW-2) `[POOL HANDLE]` — the cause-walk surface, the table tier — significance: n/a (walk surface line)
SLOTS: {band}
AUDIENCE: public
1. Step, town, reason — the whole chain, in the order the clerks entered it.
2. Read the table backward and you read the cause; read it forward and you read the ruin.
3. The bottom row is the oldest, and it is the one still costing.
4. What follows is the table the sentence above was made of.
5. {band} steps, {band} towns, and one cause holding them together.

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
