# CURE — DS-DEF-2 · pool `Economic Survival: STRONG`

Curer: Opus (a different author from the writers), for the Fable chair · 2026-09-13.
Input: `draft.md` (the selected rows), `refute.md` (2 FAIL · 1 WITHHELD · 29 PASS), `card.md`, `speakers.md`,
`recut/EXEMPLAR-PACK.md`. Read-only throughout; nothing outside this file was written and no dock was entered.

STATUS: COMPLETE. 2 targets · 2 CURED · 0 REFUSED. Every other row is byte-identical to `draft.md`
(diffed line by line: 33 row lines, 2 changed, 31 unchanged).

**`Economic Survival`: `STRONG`**
1. `[ledger]` The town can be fed and supplied through a crisis. Nobody here has had to find the bottom of the stores.
   - `[face]` `[hall · pair 1 · disagree]` The hall says the wage is met as far as the purse reaches.
   - `[face]` `[watch · pair 1 · disagree]` The watch says the purse reaches further than the hall lets it.
   - `[face]` `[archiver · pair 1 · weigh]` Which of the two is right is argued in the town and is not settled anywhere.
   - `[face]` `[register]` The register holds that a town which puts grain by for its living should put something by for its dead, and says so to the hall.
   - `[face]` `[tavern]` At the tavern they say the people who would have to turn out in a crisis are the same people who are owed.
   - `[face]` `[guild]` The guilds say openly that what fills the granary is bought at the market and taxed at the same market, and that the trades pay at both ends.
   - `[face]` `[stranger]` A stranger sees the granary kept and nothing to say what the town is short of.
   - `[face]` `[garrison]` The soldiers say the town has never been short of anything to give them except the wage.
   - `[face]` `[archiver · observed]` The granary has been seen opened and has not been seen empty.
   - `[face]` `[market]` At the market they say the taking is done there and the deciding is done at the hall.
   - `[face]` `[hall · compromised]` The hall says there is nothing in its accounts worth a stranger's time, and that the granary is the thing worth looking at.
2. `[street]` Everyone in the town has seen the granary kept stocked, and takes it that a crisis would find the place ready.
   - `[face]` `[hall · pair 2 · disagree]` The hall says the trades are asked for no more than the trades can carry.
   - `[face]` `[guild · pair 2 · disagree]` The guilds say the carrying is theirs and the asking is not.
   - `[face]` `[archiver · pair 2 · weigh]` The guilds' account is the likelier, the hall having a purse to defend and the guilds only a bill.
   - `[face]` `[watch]` The watch says the rounds are kept by people who are owed for keeping them.
   - `[face]` `[gate]` At the gate they say a cart bound for the granary is not kept waiting, whatever else is.
   - `[face]` `[stranger]` A stranger who sits at the tavern hears the granary praised and the wage complained of, by the same people.
   - `[face]` `[tavern]` At the tavern they say the watch is a trade that drinks on what it is owed.
   - `[face]` `[garrison]` The garrison's account is that a town which can be fed through a crisis and does not meet its wage in full has decided something, and has not said what.
   - `[face]` `[market]` At the market they say the stallholders settle what the hall is owed before they settle anything of their own.
   - `[face]` `[register]` The register says the town keeps its word to the dead before it keeps its word to the living.
3. `[counterforce]` The hall holds that the town could be fed and supplied through a crisis, and at the tavern they say the people who would be paid through one are paid short already.
   - `[face]` `[watch · pair 2 · reinforce]` The watch says the purse that pays it is opened last.
   - `[face]` `[garrison · pair 2 · reinforce]` The soldiers say they are paid out of the same purse and in the same order.
   - `[face]` `[hall]` The hall's answer, when the wage is raised, is the granary.
   - `[face]` `[guild]` The guilds say openly that the provision is the trades' doing and the shortfall is the hall's.
   - `[face]` `[stranger]` A stranger smells grain at the granary door and hears the wage complained of at the tavern.
   - `[face]` `[register]` The register says it asks for nothing the town has not already promised it, and does not say what it has been given.
   - `[face]` `[hall · compromised]` Asked about the purse, the hall talks about the granary, and asked again, talks about the granary again.
   - `[face]` `[court]` The court says nobody has brought it the question of the watch's wage. It does not expect the hall to.

--- NOTES

### THE CURES

**F-1 · V1 face 3 · `[archiver · pair 1 · weigh]` · CURED**

- was: "It may be that both are right, and the one purse is full for one thing and short for another."
- now: "Which of the two is right is argued in the town and is not settled anywhere."
- the finding cured: FLOOR 4. `defenseProfile.economicGates.military` is ONE multiplier over garrison wages and
  wall maintenance together (`defenseGenerator.js:182`, `:189-192`), with the watch's wage inside the same gate
  (`fieldSynonyms.js:51`, F4-19); F4-02 (`CONTRADICTION-TABLE.md:287`) and F4-03 (`:288`) forbid two purses that
  differ in DIRECTION, and V-17 (`:416`) struck the same shape ("spending on repair rather than on holding") on
  the same two file:lines. The cured line splits nothing: it names no charge the purse meets, no direction, and
  no amount. Taken VERBATIM from the refuter's second cure, which is the selector's own HELD line
  (`draft.md`, HELD, "packet 2 V1 weigh alternate").
- the secondary cured with it: "full" as a volume word over the purse (F2-01) is gone with the clause.
- why this cure and not the other. The refuter offered the brief's licensed example ("the one purse is filled at
  the gate and spent by the hall") as the first option, and I REFUSED it here for two reasons the refuter could
  not have weighed without the roster: (a) the GATE IS CONDITIONAL on this preimage — a wall-or-gate row stands on
  83 of 102 towns (`draft.md`, the roster as the kernel seats it), so an archiver's conjecture that the purse is
  filled AT THE GATE is an invention on every town of the preimage that has no gate (floor 2), and unlike a
  `[gate]` face it is not projector-filtered by source; (b) the universal substitute ("filled by the trades and
  spent by the hall") lands on the hall as its noun and says what V1 face 10 already says at the market ("the
  taking is done there and the deciding is done at the hall"), which is the sibling-paraphrase bar. The dispute
  form is licensed by ruling 22 in as many words ("Which is right is a matter of debate in the town"), it opens
  and never closes, and between two lawful candidates the shorter one that stops sooner wins.
- what it costs, stated plainly: the pool's two weighings are now a DISPUTE (V1) and a LEAN (V2) rather than a
  conjecture and a lean. Two of ruling 22's three shapes still stand, and no source is favoured in either.
- checks on the new line: no em dash, no exclamation mark, no digit · one sentence · third person · no
  self-citation (no "survey", "office", "record", "entered") · no `{settlement}` · subject opener, landing noun
  "anywhere", shared with no sibling in V1 · no tell from the veto list (no which-clause closer: "Which of the
  two" opens the subject, it does not trail one) · the unit is 1 + 1 + 1 sentences, within three.

**F-2 · V2 face 8 · `[garrison]` · CURED**

- was: "The garrison's account is that a town with full stores and an unmet wage has decided something, and has
  not said what."
- now: "The garrison's account is that a town which can be fed through a crisis and does not meet its wage in
  full has decided something, and has not said what."
- the finding cured: FLOOR 2. `economicState.foodSecurity.stockpile` / `storageMonths` hands a BAND (the marker
  measured min 5 · median 7 · max 12 months, card.md §(7)); F2-01 (`CONTRADICTION-TABLE.md:255`) bars a VOLUME in
  a digit OR a word, and card.md §(8) applies it to this pool by name. "Full stores" is gone; "can be fed through
  a crisis" is the card's own re-cut of what STRONG selects (storage-first, never money) and states no volume.
  §V.0 floor 2's "everywhere" is respected: the cured clause carries no rate, date or magnitude in the garrison's
  mouth either.
- the lesser concern the refuter recorded but did not charge is cured with it: "an unmet wage" read as WHOLLY
  unmet where the gate's floor is 0.87, and F4-04 (`:289`) licenses only short, late and thin. "Does not meet its
  wage in full" is a shortfall and not a total.
- taken VERBATIM from the refuter's cure. The refuter's alternative (the selector's named swap, packet 1's V2
  garrison) was refused because it costs variant 2 its only non-`say` attribution frame — the draft records the
  ordering consequence itself, and the frame survives untouched in this cure ("The garrison's account is that").
- the row's value is kept: the WITHHELD DECISION is the point of the face, and both halves of it stand.
- checks on the new line: no em dash, no exclamation mark, no digit · one sentence · the shortfall rides in a
  SOURCE'S mouth, never the archiver's, which is the selector's standing mitigation for the 11 towns where
  `economicGates.military` sits at 1.0 · no `{settlement}` · subject opener, landing noun "what", shared with no
  sibling in V2 · no volume, count, share, sum, price or duration · no tell from the veto list.
- a repeat checked and cleared: "fed through a crisis" also stands in spine 1 and in spine 3, but this face
  renders under spine 2 (`[street]`, the public's granary), so no unit carries the clause twice.

### NOT A TARGET, CARRIED FORWARD UNCHANGED

- **W-1 · V3 face 7 · `[hall · compromised]` · WITHHELD by the refuter, and therefore NOT cured here.** The row
  stands byte-identical. The refuter holds it LAWFUL (the inverted test is satisfied exactly) and withholds only
  the CRAFT question of the picked-up word, which ruling 17 licenses as a notebook device and this is a player
  face. That is the chair's call and not a finding, so a curer does not spend a change on it. If the chair rules
  the device out, the refuter's replacement is on the desk and needs no further writing: "Asked about the purse,
  the hall talks about the granary, and asked a second time, talks about it still."
- The refuter's three CRAFT observations (the narrow wage-against-granary axis; spine 3 repeating spine 1's
  clause; the V2 disagree pair not meeting on one proposition) are POOL-grain craft at a PASS verdict, not
  findings, and none of them names one of my two targets. Changing a spine or a pair half to answer them would
  break the byte-identity the gate diffs. They stay for the chair.
- The one coverage gap (no `[public]` face in any variant) likewise stays: placing one is an addition, not a
  cure, and the HELD line is named in `draft.md` if the chair wants it in V1 or V3.
- The three wiring rows (W-DEF2-ES-1 the full-pay seam, W-DEF2-ES-2 the garrison-pay seam, W-DEF2-ES-3 the
  first-of-their-kind tokens) are the engine's, per the brief's disposition rule; no face moves for them.

### THE MECHANICAL SELF-CHECK ON THE CURED FILE, EXECUTED

- 33 row lines · 3 spines · 29 `[face]` rows · 11 + 10 + 8 faces across the three variants, unchanged from the draft.
- No em dash and no exclamation mark anywhere in the rows block, and no digit IN ANY PROSE: the eleven digits in
  the block are the three unit indices and the pair ids inside the source brackets, which the grammar writes and
  the page never prints (executed on this file: every line matching a digit was re-tested with the unit index and
  the bracket tokens stripped, and none kept a digit).
- `{settlement}` appears in no unit, unchanged.
- The two cured lines parse in the same FACE SYNTAX as before: the source bracket of each is untouched
  (`[archiver · pair 1 · weigh]`, `[garrison]`), so the pair, the weigh token and the speaker roster in
  `speakers.md` still describe the rows exactly.
- Diff against `draft.md` rows: exactly 2 lines changed, 31 byte-identical.

STATUS: COMPLETE.
