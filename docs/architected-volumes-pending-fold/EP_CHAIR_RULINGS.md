# EP CHAIR RULINGS — the five open questions, the two chair-owed dispositions, the parked-row audit, and the fold obligation

**Date: 2026-08-06.**
**Prepared under Opus 5, NOT Fable 5.**
**⏳ OPUS-ERA — FABLE SURVEY OWED.**

**EVERY RULING IN THIS DOCUMENT IS VETOABLE.** One clause from the owner strikes any of
them. Each ruling carries a stated veto sentence written so a future session can reverse it
knowing what it is reversing, rather than re-deriving the question from scratch.

**Subject:** `docs/architected-volumes-pending-fold/EPOCH_living-futures_SEALED.md` (4,005
lines, measured), the owner-amendment volume for the advance-epoch / living-futures
directive.

**Authority, and its limits.** The owner's blanket queue sign-off (2026-08-05, recorded at
`docs/FABLE_VALIDATION_QUEUE.md` "THE BLANKET QUEUE SIGN-OFF" and in the memory estate at
`owner-blanket-queue-signoff.md`) signs every queued owner-gated item **per the chair's
recorded recommendation for that item** — the recommendation is the content of the
signature, the grant supplies the authority. Four carve-outs survive it: legal, the V5
aesthetic cull, the constitutional tuning signature, and per-push confirmation. This
document therefore prepares a recommended ruling for every question including owner-gated
ones, and **nothing here claims the owner specifically considered any individual item.**
Where a signature is consumed, the citation is given. Where I decline to consume one, the
reason is stated.

⛔ **NOTHING IN THIS DOCUMENT LIGHTS A FLAG, RUNS A GATE, MOVES A PRNG CALL ORDER, CHANGES A
STREAM IDENTITY, DELETES CODE, OR PUSHES.** No repo file outside this one was written. No
test or gate command was run — the gate is a machine mutex held by a concurrent build lane.
No state-mutating git command was run.

---

## §1 THE SEALED-VS-DRAFT CONTRADICTION — RESOLVED FIRST, BECAUSE EVERYTHING ELSE DEPENDS ON IT

### 1.1 The verdict

**The volume is a DRAFT. It is not sealed, it is not attested, and its `_SEALED` filename
provably did not come from any chair act.** This is reading **(b)** of the three offered,
sharpened by two findings the question did not anticipate: the filename has a *mechanical*
origin, and the volume's last content round has never been adversarially reviewed.

There is no attestation "merely missing its §9". There is no attestation anywhere in the
volume, in any section, under any spelling.

### 1.2 The evidence, quoted

**(a) The volume's own line 3, unamended through six revision rounds:**

> `## DRAFT for the validation chair, 2026-08-05.`

**(b) There is no §9 and no attestation block.** The volume's sections run `## §0 THE
PREMISE` (line 195) through `### ✅ 8.6 THE BUILD-BLOCKER IS RESOLVED` (line 3895) and then
close on an italic provenance paragraph (lines 3919–4005) whose final sentence is:

> *"Nothing here lights a flag, runs a soak, ratifies a band, re-records a golden, or
> pushes."*

A grep of the whole volume for `ATTEST|COHESIVE|VERDICT|SEALED|NEEDS-REVISION` returns no
attestation and no verdict line. The only `NEEDS-REVISION` hit (line 48) is the *cohesion
pass returning* NEEDS-REVISION at revision 2 — a finding, not a close.

**(c) ⭐⭐ THE FILENAME IS A COPY-SCRIPT TARGET, NOT A STATUS.** MEASURED at
`scripts/refresh-archive.sh` lines 44–45:

```sh
  [ -f "$SCRATCH/epoch-arch/DESIGN_EPOCH_ARCHITECTURE-DRAFT.md" ] && \
    cp "$SCRATCH/epoch-arch/DESIGN_EPOCH_ARCHITECTURE-DRAFT.md" "$VOLS/EPOCH_living-futures_SEALED.md"
```

**The source file is named `DESIGN_EPOCH_ARCHITECTURE-DRAFT.md`.** The word SEALED exists
only as the destination filename inside an automated archive-refresh script. No chair wrote
it, no pass earned it, and the authoring lane's own working copy has said DRAFT the whole
time.

**(d) The commit that introduced the file was wrong about the volume in the same breath.**
MEASURED, `82f06898` ("Durability: the architected volumes leave /private/tmp and enter
git", 2026-08-06) describes it as:

> "the EPOCH volume (16 waves, sealed)"

The volume declares **SIX** waves at `## §4 THE WAVES` and restates six in §5. The single
sentence that supplied the word "sealed" was simultaneously wrong by ten on the adjacent
count. It is not evidence of a seal; it is evidence of a hurried summary.

**(e) The directory's own README already ruled this, on 2026-08-06.**
`docs/architected-volumes-pending-fold/README.md` line 32 states verbatim: *"THE FILENAME
AND THE CONTENT DISAGREE… Treat it as a DRAFT that survived six rounds, not as sealed."*
This ruling agrees with it and supersedes nothing.

**(f) ⭐ A SEVENTH ROUND HAPPENED AND THE VOLUME'S OWN FRONT MATTER DOES NOT RECORD IT.**
The header revision blocks stop at `REVISION 6 — THE FASTENING ROUND (chair rulings
G1..G4 … the LAST content round)`. But the body carries exactly one round-7 mark, at line
2126, inside the DISPLAY-SURFACE RULE:

> *"(Chair fix, round 7: the F2/G1-law-2 class — a pin must never red a correct build —
> cured at its third address.)"*

So seven passes exist, six are documented in front matter, and a reader who trusts the
front matter will believe the volume is one round younger than it is.

**(g) The external record calls it attested; the volume does not.** The memory file
`advance-epoch-living-futures-directive.md` records: *"✅ ARCHITECTED COHESIVE —
CHAIR-ATTESTED after SIX adversarial rounds (findings 9→9→5→5→4→2 …) plus three
chair-executed one-line seals … Final draft ~3,300 lines."* Two things about that sentence
are worth stating rather than smoothing: it calls the artifact a **"Final draft"**, and its
line figure (~3,300) does not match the file (4,005). **A document is not sealed because a
memory file says so.** The repo is authoritative; the repo says DRAFT.

### 1.3 ⭐⭐ THE FINDING THAT MATTERS MORE THAN THE FILENAME

Read the revision blocks as a chain and a structural gap appears that no individual block
states:

- Revision 3 "confirmed all nine revision-2 findings closed."
- Revision 4 "confirmed all NINE revision-3 residuals genuinely closed."
- Revision 5 "confirmed ALL SIX revision-4 rulings closed."
- Revision 6 "confirmed ALL EIGHT revision-5 closures."
- **Revision 6's own four rulings are confirmed closed by nobody.**

Round 7 was a two-finding, one-line-fix pass. It engaged G1 — at line 2126 it cures "the
F2/G1-law-2 class" — but it engaged G1's **pin SPELLING**, not G1's architectural act.
And G1 is the largest ruling in the volume: HIGH, ARCHITECTURAL, it gave the family-1
accessor its source and **moved a slice boundary** (the writer, the leaf, seam edit 9, the
+1 import line and the manifest row all crossed from slice B into slice A, J-EP-14).

**A HIGH architectural ruling that moves a slice boundary has never been through a full
adversarial round.** That is the gate this volume is missing, and it is precisely the gate
a "sealed" label would have caused a build lane to skip. §6 of this document reports a
defect inside G1's own consequence set, found by this lane on the first look — which is
what an unreviewed round looks like from the outside.

### 1.4 RECOMMENDED FILENAME, AND THE TRAP IN CHANGING IT

**RECOMMENDED NAME: `EPOCH_living-futures_round7-snapshot.md`** — matching the directory's
existing convention for unclosed volumes (`HABIT_conditioning_round4-snapshot.md`,
`WC_war-circulation_in-progress-snapshot.md`), and naming the true round rather than the
front matter's six.

⛔ **RENAMING THE ARCHIVE FILE ALONE IS WORSE THAN DOING NOTHING.** `refresh-archive.sh`
line 45 is an unconditional `cp` to the literal name `EPOCH_living-futures_SEALED.md`. Its
next run recreates that file **beside** the renamed one, leaving two 332 KB copies of the
same volume in one directory, drifting apart, with no marker saying which is live. That is
the split-brain class the volume itself names.

**The rename is a THREE-PART change, all in one commit:**
1. `scripts/refresh-archive.sh` line 45 — the `cp` destination.
2. The file itself (`git mv`).
3. `docs/architected-volumes-pending-fold/README.md` line 32 — the Contents table address.

The scratchpad source (`DESIGN_EPOCH_ARCHITECTURE-DRAFT.md`) needs no change; it has been
correctly named throughout.

⚠ **I did not execute the rename.** It touches a shared script and a shared README on a
branch a sibling lane is working, and the brief scopes this lane to one new file. It is
proposed, not started.

### 1.5 What follows from the verdict, operationally

- **EP may not be dispatched as "an attested volume needing only queue insertion."** It
  needs the round-7 closure it never got, or an explicit chair decision to build without
  one.
- The volume's **own** standing rules already cover the risk if they are honoured: J-WR-13
  ("an implementer finding a further overstatement STOPS before building on it"), "LIVE
  CODE OUTRANKS EVERY TABLE HERE", and revision 6's generalized rule that every declared
  symbol must name its source, its body, and an executed pin proving a real caller got a
  real value. **§6 below applies that last rule to the volume's own newest pin and it
  fails.**

---

## §2 THE FIVE OPEN CHAIR QUESTIONS

### Q1 — THE YEAR-KEYED SIDE-CHANNEL ARM (blocks EP-3 slice B outright)

**The question, in one sentence.** Nine YEAR-KEYED stream compositions at eight read sites
draw tick-invariant, year-stable verdicts off the world seed by declared law: should they be
given a year-stable epoch anchor so an un-lived year draws fresh while a lived year keeps
its weather (Arm A), or declared permanently epoch-invariant (Arm B)?

**The arms as the volume states them.**

- **ARM A — THE YEAR ANCHOR.** `spatialLedgers.advanceEpoch = { byYear: { '<canonical
  1-based year>': '<epoch>' } }` — an L4-sanctioned conditional sub-key, ONE writer,
  drop-when-absent, bounded by product scope at roughly 100 rows. Accessor
  `yearStreamSeedOf(worldState, year, { absent, yearBase })`. The year-keyed family reads
  the epoch of the advance that FIRST ENTERED that year. Cost: the writer's `byYear` half,
  the accessor, eight read sites re-rooted plus RS-9's second argument, seam edits 7 and 8,
  two display seams.
- **ARM B — EPOCH-INVARIANT BY DESIGN.** "The climate belongs to the starting world." Zero
  new state, zero display seam. Cost: one visible coherence tell — a DM re-advancing a
  decade sees the same winters, the same festivals, the same NPC road rhythms.

### ⭐⭐ THE RULING: ARM A. CHAIR-RULED.

**And the decisive reason is one that did not exist before revision 6, so anyone ruling Q1
off revision 5's cost table is pricing an arm that is no longer for sale.**

**1. Arm A's price collapsed in revision 6 and nobody re-stated the trade.** Q1's own text
still carries the revision-3 warning: *"THE PRICE OF ARM A ROSE IN REVISION 3… the trade the
chair is signing is now 'one line on `pulseKernel.js`' and not 'no kernel cost'."* That is
now false. Chair ruling G1 / J-EP-14 moved the writer, the leaf, **seam edit 9, the +1
import line** and the `EXEMPT_LEDGER_KEYS` row into **slice A, which ships under EITHER
arm.** MEASURED from §4's slice-B budget block: slice B's kernel import edit is **+0**
("adds `yearStreamSeedOf` to the import line slice A bought"), seam edits 7 and 8 are both
+0, `src/lib/spatialUsage.js` is **ZERO EDITS**, and `worldState.js` is **ZERO EDITS**.
**Arm A no longer buys a single new line anywhere.** The one-line ratchet-up on the banked
pulse mouth that the chair was being asked to sign for Arm A is now bought by slice A
regardless of how Q1 rules. The question the chair is actually being asked has shrunk to:
*given that the ledger, the leaf, the writer and the import line are landing anyway, should
the second half of that ledger be written?*

**2. Arm B is not "no epoch" — it is a SPLIT world, and the split falls on the most visible
seam.** Under Arm B the fourteen tick-varying compositions plus the tick-free one still
re-draw: a DM who undoes and re-advances gets a different succession winner
(`npcLadderContest#tieBreak`), a different city response
(`demographicsResponses#selectResponse`), a different sovereignty buyer, different road
hazards and a different resettle outcome — **and the same winter.** The weather is the one
member of the year-keyed family that is *painted on the town map*
(`src/domain/townMap/mapDress.js`, CONFIRMED below). Arm B therefore ships a world where
everything the DM can measure changed and the one thing they can see did not. That reads as
a bug, not as a doctrine.

**3. The DISPLAY-SURFACE RULE has no referent under Arm B.** The volume's binding rule is
that a view-time re-derivation over lived state must read *the epoch the lived state was
drawn under*, or read none at all. Under Arm A that is a function of persisted state and is
therefore pinnable. Under Arm B, `mapDress.js` and `CauseWalkPanel.jsx` must be *declared*
permanently epoch-blind by fiat — a rule with no state to point at, which is a comment
rather than a guarantee.

**4. Arm A satisfies both halves of the directive; Arm B satisfies one.** The directive's
two clauses are "a lived history, once lived, forever" and "the un-lived future is alive."
Arm A's FIRST-WINS law plus the undo-restores-the-map mechanism gives both: a lived year
keeps its weather because the map was restored with the world, and only an un-lived year
draws fresh. Arm B honours the first clause and abandons the second across roughly a third
of the world's entropy.

**5. Lighting Arm A on a world with history is safe by construction, not by hope.** The
volume records the property and it is the one that makes this rulable at all: a year lived
BEFORE the flag was ever lit has no `byYear` key, so the accessor returns the bare root
exactly as today and **lighting the flag repaints NO already-lived year.**

**⛔ THE MIDDLE PATH IS DECLINED.** J-EP-11 records a veto path of "Arm B for row 1 alone" —
the weather belongs to the starting world while the rest of family 2 takes the year anchor.
I decline it. It splits one family's rationale across two arms, it needs its own pin that
the in-pulse and display readings still agree, and it buys nothing now that the +1 import
line is slice A's. The volume itself calls it coherent-but-costly; with the cost argument
gone, only the incoherence remains.

**Waves this unblocks or changes.** Unblocks **EP-3 slice B** outright and completely —
slice B is the only Q1-gated unit in the program. EP-0, EP-1, EP-2, EP-3 slice A, EP-4 and
EP-5 were never gated on Q1 and are unaffected.

**Chair-ruled vs escalated.** **CHAIR-RULED.** Q1 is a design choice between two defensible
architectures and the volume assigns it to the chair, not to the owner (§7 is "OPEN CHAIR
QUESTIONS"; §7a is the owner-gated list and Q1 is not in it). The persisted-shape
consequence does not change that: the sub-key `spatialLedgers.advanceEpoch` **lands under
either arm** by J-EP-14, so Q1 does not decide whether new persisted state exists — it
decides whether an already-landing sub-key gains its second member. Arm A moves no PRNG
call order (it changes seed strings, never draw counts) and moves stream identity only when
the flag is LIT, which is the owner's own signed directive.

**⚠ THE OBLIGATIONS THAT TRAVEL WITH THIS RULING, none of them waived by it:** J-EP-13's
`yearBase` REQUIRED-with-no-default (three year derivations in two bases, CONFIRMED below —
omit it and rows 13 and 20 go silently epoch-blind forever while every pin stays green); the
RS-9 split-read discipline (slice A re-roots it to the tick anchor and row 20 stays
epoch-blind until slice B adds a separately-named second argument); and the STAMP-SURVIVAL
PIN's four mutants with their required RED/GREEN asymmetry.

**The one sentence a future session needs to veto this intelligently.**
> *Veto Q1=Arm A if you want zero persisted growth in this program: Arm B is coherent and
> costs nothing, and its price is that `mapDress` and `CauseWalkPanel` become permanently
> epoch-blind by declaration, and a re-advanced decade keeps its old winters, festivals and
> road rhythms while its successions, city responses and sovereignty buyers all change.*

---

### Q2 — THE BRANCHING MODEL

**The question.** LINEAR-WITH-DISCARD (the discarded future is not retained) versus
KEEP-BOTH-TIMELINES (a persisted branch tree).

**The arms.** The volume recommends linear-with-discard (J-EP-8): a tree needs a persisted
branch structure, a UI to navigate it, and a story about which branch a share code
addresses.

**THE RULING: LINEAR-WITH-DISCARD. CHAIR-RULED.** J-EP-8 stands, ratified.

Three reasons, one of them not in the volume. The volume's two: a timeline tree is a
different product, and the directive's own framing ("undo deletes the history entry") is
linear. **The third, which is the one that closes it:** the trust floor's entire value is
that there is exactly ONE lived past. A branch tree creates N lived pasts and then has to
answer which one a save, a share code, a gallery entry and an export address. Every one of
those surfaces currently assumes a single history, and the directive's stated purpose is to
make that history *more* trustworthy, not to fork it.

**Waves.** Gates nothing; ratifies J-EP-8 and §3c's five-row fork table. Changes no charter.

**Chair-ruled vs escalated.** CHAIR-RULED — it is a design ruling that builds nothing.

**Veto sentence.**
> *Veto Q2 only if you want a timeline tree as a product feature, which is a new capability
> with its own persisted branch structure, navigation UI and share-code semantics — not a
> variant of this program.*

### ⚠⚠ Q2's RIDER IS THE SHARPEST THING IN Q2, AND IT IS ESCALATED

Q2 carries a note the ruling does not dispose of:

> *"Related live limitation, INDEPENDENT of this program: `pulseUndoStack` is SESSION-ONLY
> (not in `partialize`), so the headline user story works only WITHIN a session unless the
> advance was paused. Whether to persist the undo ring is an owner-gated persistence-shape
> question — flagged, not decided here."*

**CONFIRMED by measurement.** `pulseUndoStack` is declared at
`src/store/campaignWorldPulseSlice.js` with the in-source comment *"NOT persisted — a reload
clears it"*, and the zustand `partialize` in `src/store/index.js` is an exhaustive object
literal listing `config`, `configExplicitFields`, `institutionToggles`, `categoryToggles`,
`goodsToggles`, `servicesToggles`, `displayPrefs`, `advanceAutoResolve` — and nothing else.
`pulseUndoStack` is not in it. It is reset to `[]` at the auth boundary
(`campaignSlice.js`). The carve-out is real too: a `preIntervalUndo` snapshot is parked on
`worldState.pausedAdvance`, which *does* persist, so a reload during a pause can still arm
Undo.

**WHY THIS IS NOT A FOOTNOTE.** The owner's directive is, verbatim, about *"the user that
backtracked because he didn't like the direction based on vibes. now he undos and advances
time again to see a different plausible history."* **If the undo ring dies on reload, the
headline user story dies on reload** — the DM who closes the tab and comes back cannot
backtrack at all unless they happened to pause mid-advance. EP can ship perfectly and the
feature the directive describes still will not be reachable the next morning.

**⛔ ESCALATED — PERSISTENCE SHAPE, AND IT IS NOT ONE OF THE §7a FOUR.** I do not rule it and
I explicitly do **not** consume the blanket sign-off for it. The sign-off's content is the
chair's recorded recommendation for an item, and **this item has no recorded recommendation
anywhere** — the volume flags it and declines. Consuming a signature for a recommendation I
invented in this document would be manufacturing the owner's consent, which is the one thing
the sign-off's own scope reading forbids.

**Offered for the owner's decision (a NEW recommendation, therefore NOT covered by the
2026-08-05 grant):** persist the undo ring, as its own small wave outside EP, on the
`displayPrefs` / `advanceAutoResolve` precedent — an additive top-level key whose absence
rehydrates to the slice default, so no persist version bump and no migrate branch is owed.
The costs to measure first are the ring's serialized size (`PULSE_UNDO_CAP = 10` snapshots
per campaign, each a `cloneJson` of a whole worldState plus member saves — this is the
objection, and it is large) and the interaction with the 2–4 MB already crossing every
Supabase upsert. **A cheaper alternative worth costing beside it:** persist only the newest
one or two entries rather than all ten.

**Gate it goes to:** the owner, as a persistence-shape decision, with the size measurement
in hand. **It blocks no EP wave** — EP is correct as written under either outcome.

---

### Q3 — THE REPLAY HORIZON

**The question.** `MAX_HISTORY = 80` evicts old records and their epochs, so byte-exact
replay is bounded to the newest 80 advances — for exactly the long-lived worlds most worth
debugging. Accept the bound, or build a parallel uncapped epoch log?

**THE RULING: ACCEPT AND DECLARE THE BOUND. CHAIR-RULED.** The volume's recommendation
stands.

**Reasoning, including the point that makes it cheap.** The alternative is a new persisted
structure whose own size story must then be told, on a ring already carrying 2–4 MB through
every Supabase upsert and every undo snapshot — it buys debug reach for the rarest case at a
cost paid on every save by every user. **And the bound costs replayability, never canon:**
the lived past is the RECORD, not the seed that drew it. An 81st-oldest advance whose epoch
has been evicted is still exactly as immutable, still shows the same history on load, and
still honours the trust floor. All that is lost is the ability to re-derive it bit-for-bit
in a debugger. That is a developer affordance, and it is the right thing to bound.

**MEASURED, CONFIRMED verbatim:** `src/domain/worldPulse/worldState.js` declares
`const MAX_HISTORY = 80;` and `appendPulseHistory` is

```js
export function appendPulseHistory(worldState, record) {
  const current = ensureWorldState(worldState);
  const next = [...current.pulseHistory, record].slice(-MAX_HISTORY);
  return { ...current, pulseHistory: next };
}
```

— an eviction by `slice(-MAX_HISTORY)`, exactly as the volume states, applied again in
`ensureWorldState`.

**Waves.** Gates nothing. Adds one in-file comment to EP-1's charter.

**⚠ TWO OBLIGATIONS THIS RULING CREATES, both VERIFY-AT-BUILD:**

1. **The in-file comment lands on `worldState.js`, and §4 declares `worldState.js` ZERO
   EDITS for EP-3 slice B.** The comment must therefore be budgeted in **EP-1**, not
   discovered in EP-3, and its size effect measured with the enforcer before the commit. A
   declared line is a budget; a discovered one is an incident.
2. **EP-5's promise amendment must not claim unbounded byte-exact replay.** §8.5's tier-4
   note keeps `tests/domain/advanceWorkerByteIdentity.test.js`'s "a seed IS a world,
   bit-for-bit" phrasing unedited, which is correct for the internal replay-grade claim —
   but any *new* sentence EP-5 writes about replay must carry the 80-advance bound or it
   states something the build cannot keep.

**Veto sentence.**
> *Veto Q3 only if byte-exact replay of advances older than the newest 80 is a requirement
> rather than a convenience, in which case the parallel epoch log needs its own size story
> on a ring already pushing 2–4 MB through every upsert.*

---

### Q4 — THE FLAG NAME

**The question.** `advanceEpochEnabled` (the seam) versus `livingFuturesEnabled` (the
product).

**THE RULING: `advanceEpochEnabled`. CHAIR-RULED.**

**MEASURED, CONFIRMED:** five greps across the entire build tree including `docs/` —
`advanceEpochEnabled`, `livingFuturesEnabled`, `advanceEpoch`, `livingFutures`,
`epochEnabled` — return **zero hits each**. There is no collision for either candidate and
no near-spelling a sweep could catch.

**Reasoning.** The volume's argument is right and I add a mechanical one it does not make.

The volume's: a flag named after the marketing claim invites a sweep to conflate the gate
with the copy, and the copy is EP-5's, gated separately. That risk is concrete here rather
than theoretical, because §8.3 makes the marketing claim a *pinned gate*
(`tests/copy/landingClaimsParity.test.js` reds on a reword by design) — so a flag called
`livingFuturesEnabled` would sit one careless sweep away from someone treating "the flag is
lit" as licence to reword bound copy, which is exactly the red that gate exists to force.

**The mechanical reason, which is decisive and costless:** §2.2 relies on
`advanceEpochEnabled` joining `ENGINE_GATED_VIRTUAL_RULE_KEYS` **in alphabetical position**,
and records that it *"sorts FIRST, before `beliefAxesEnabled`"*, with
`tests/lint/engineGatedRuleKeys.walker.test.js` asserting the exact one-key delta.
`livingFuturesEnabled` sorts elsewhere entirely. Renaming therefore invalidates §2.2's
stated insertion point and every downstream statement of it. The name is load-bearing in the
manifest, not merely in the prose.

**Waves.** **Unblocks EP-1**, which mints the flag, the manifest join, the certification
lane `subsystemRowsEpoch.js` and the first by-name gate read in one commit. EP-1 cannot land
without this ruling. Also settles the flag row's text at §5 item 1.

**Veto sentence.**
> *Veto Q4 only if you want the flag to read as the product promise rather than the
> mechanism; the cost is re-deriving §2.2's alphabetical insertion point and re-stating it
> everywhere, since `advanceEpochEnabled` sorting first is currently load-bearing.*

---

### Q5 — THE SAMPLE-FORK DISPOSITION (A4/A5) — "PARTLY SUPERSEDED"

**⭐ FIRST, WHAT ACTUALLY REMAINS OF IT.** The volume's supersession note says: *"Its subject
(A4/A5) is now an OWNER-GATED parked row (§7a row 1) rather than an EP-4 slice, per chair
ruling R7. The recommendation stands verbatim and travels with the parked row; what changed
is WHO signs it."*

Read precisely, **three things moved and one did not**:

| Component | Status |
|---|---|
| The disposition itself (ADDRESS door vs LIVING door) | **Unchanged and still live** — but no longer the chair's to rule |
| The signing authority | **MOVED: chair → owner** (PAID / FOUNDER SURFACE) |
| The build home | **MOVED: EP-4 slice → §7a row 1**, builds nowhere inside this program |
| **The H1 INDEPENDENCE CLAUSE** | **DID NOT MOVE — and it is the only part still chair-owed** |

That last row is the residue the supersession note does not name. §7a row 1 warns: *"if it
is DECLINED, H1's repair must still stand on its own."* That warning is addressed to the
chair, not to the owner, and it is the only piece of Q5 a chair can still rule.

**RULING PART 1 — the A4/A5 disposition: NOT CHAIR-RULABLE. OWNER-GATED (paid surface).**
I do not rule it. **It is already SIGNED, and the signature is recorded — that is the
finding.** The blanket sign-off's RELEASED TO BUILD list names it explicitly: *"EP-4's two
parked repairs (paid-surface + persisted-shape, rejoining the EP waves with their own
gates)."* Those are §7a rows 1 and 2 by description. The signature's content is the chair's
recorded recommendation, which for row 1 is **LIVING DOOR** — the fork button mints fresh;
the sample's own seed stays typeable in the `SeedField`, which is the address.

**MEASURED, CONFIRMED:** `forkSeedFor` is verbatim

```js
export function forkSeedFor(sample, userId) {
  if (!sample || !sample.config?.seed) return null;
  const suffix = (userId || 'anon').slice(0, 8);
  return `${sample.config.seed}-${suffix}`;
}
```

with exactly two callers, both tier-gated as the volume states: `FoundingWorlds.jsx` reads
`s.auth.tier`, and `SettlementsPanel.jsx#forkSample` calls `setPurchaseModalOpen(true)` when
a tier-gated city sample returns null. The paid-surface classification is correct.

**RULING PART 2 — the H1 independence clause: CHAIR-RULED, and CONFIRMED DISCHARGED.**
H1's repair stands whatever the owner decides about A4/A5. §3e argument 5 measures it: the
seed reaches generation through `generate(seed)` — the `seedOverride` door — not through
config, so after the admission is removed `updateConfig` drops the `seed` key and returns
`{ ok: true, ignoredKeys: ['seed'] }` and **the fork still works exactly as today**. H1 is
therefore a repair of a live product break (a fork click makes every subsequent generation on
that device throw) that neither depends on nor prejudges the paid-surface ruling.

**Waves.** The H1 clause unblocks **EP-4 slice 1**. Rows A4/A5 rejoin the program as their
own gated work per the sign-off, **not** as an EP-4 slice — see §4.3 below for the collision
this creates and its reconciliation.

**Veto sentence.**
> *Veto the H1 independence finding only if you believe removing `seed` from
> `CONFIG_PATCH_EXTRA_KEYS` is a persisted-shape change rather than an admission-predicate
> shrink; §3e's five-part measured argument (zero readers, patch-cannot-delete, partialize
> untouched, no byte-identity anchor, repair-stands-without-Q5) is what would have to fail.*

---

### THE RECORDED DEFERRAL — ROW A10 — LEFT DEFERRED

Row A10 (history reroll still rerolls authored entries inside `historicalEvents[]` /
`currentTensions[]` away — no id, no provenance marker) is marked *"deliberately deferred,
documented, not a bug to re-find."* **I leave it deferred.** The volume states the reason
(it predates the directive, it is already commented at the branch itself, and closing it
needs per-entry provenance ids — its own wave in the regen-preservation family), and nothing
in this lane's measurements disturbs that reasoning. Re-opening a recorded deferral is a
documented anti-pattern in this estate. It is not a question, it is not owed, and it is not
counted among the five.

---

## §3 THE §7b CHAIR-OWED DISPOSITIONS

### B1 — `src/domain/ai/personaSlicer.js`, the "dead module"

**⭐ THE DEAD-CODE CLAIM IS CONFIRMED — AND IT IS CONFIRMED HARDER THAN THE VOLUME CLAIMED
IT.** The volume's census was by filename. I extended it to every spelling that could hide a
consumer, and it survives all of them:

- `grep -rn "personaSlicer" src tests scripts`: the only `src` hits are the file's **own**
  header comment and an `@enforced-by` marker inside itself. Every import is a test file.
- **By exported symbol, not just by filename.** The module exports exactly three symbols —
  `buildPersonaSlice`, `sliceManifestKeys`, `sliceCoversManifest`. Grepping all three across
  `src` finds no `src` importer under any path spelling.
- **Barrel check:** `src/domain/ai/index.js` re-exports only from `stateSlicers.js`
  (`selectSlices`, `resolveAudience`, `isPlayerFramed`). `personaSlicer` is not in it.
- **Dynamic-import check:** no `import(` in `src` reaches the module.
- Repo-wide, only seven files mention it: itself, three test files, two lint tests,
  `docs/SETTLEMENT_CAPABILITY_ATLAS.md`, and one architecture doc-comment in
  `supabase/functions/parley/index.ts`.

**RULING B1: REPORT, NEVER DELETE — and reading (a) is the correct reading. CHAIR-RULED.**

The volume left two readings live: (a) staged-ahead AI-grounding infrastructure whose
consuming surface is not yet wired, or (b) a genuinely orphaned module. **The measurement
decides it for (a), and the volume did not have the evidence that decides it.** The module's
own header reads:

> *"PURE, lazy-only (rides the parley panel chunk), zero eager bytes."*

It names its consuming architecture (THE PARLEY, Surveyor S3,
`DESIGN_AI_CONTROL_SURFACE §2d`), `supabase/functions/parley/index.ts` carries a doc comment
describing it as part of that architecture, and its last commit is a **bug fix**
(`4c1143b9`, the faction-key repair) rather than an abandonment. This is a half-landed
feature with a deployed server side, not an orphan.

**The act:** a one-line in-file note at the top of `personaSlicer.js` recording that it has
no `src` importer yet and why, so the next auditor finds a ruling instead of a cleanup
target. That is the volume's own reading-(a) remedy.

**⚠ AND A NEW HAZARD THE NOTE MUST NAME, found by this lane.** There is a **same-named
`buildPersonaSlice` on the server side**, at `supabase/functions/parley/parleyCore.ts`,
exercised by `tests/domain/aiParley.test.js`. Anyone running a symbol-name census on
`buildPersonaSlice` hits both and can conclude the client module IS reached. The in-file note
must name the server twin explicitly, or the next census repeats today's confusion in the
opposite direction and "revives" a module nothing calls.

**⛔ WHO WRITES IT: NOT EP.** The volume is right that *"EP has no standing to touch it."*
The note is chair-owed and routes as its own one-line task outside every EP wave. Folding it
into an EP commit would put an unrelated file in a wave whose diff is pinned by an
edit-inventory rule.

**⚠ ONE COUNT CORRECTION TO THE VOLUME.** §7b B1 states that
`tests/lint/factionNamePrecedenceScan.test.js` carries *"two comment mentions."* **MEASURED:
THREE** (lines 40, 49, 177). Minor, but the volume's own honesty rule binds — *"a figure that
does not reproduce on re-run is treated as a defect in this volume, never as a tolerance"* —
so it is recorded rather than smoothed.

**Waves.** Unblocks nothing. **It does confirm an EP-0 dependency was correctly handled:**
chair ruling T6 re-anchored the entropy-root walker's MANDATORY negative control off
`personaSlicer.js` onto the live `economyReconciliation.js`, retaining personaSlicer's only
as a labelled WEAK secondary. That was the right call and the measurement above is exactly
why — a control anchored on a module with zero production reach passes by absence rather
than by discrimination.

**Veto sentence.**
> *Veto B1 only if you want the module removed rather than annotated, which requires its own
> consumer census, its own decision about the three test files and two walker manifest rows
> that move with it, and a ruling on whether the deployed server-side parley twin is
> orphaned too.*

---

### B2 — SHOULD A DM ORDER RE-ISSUED ON THE SAME WORLD DRAW FRESH?

#### ⛔⛔ B2's STATED PREMISE IS REFUTED BY LIVE CODE. STOP-AND-REPORT UNDER J-WR-13.

**The volume's words, quoted and struck:**

> ~~"MEASURED at HEAD, independent of this program: `mintRealmVerbProposal` composes
> `` `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}` `` off the COMMITTED world,
> so **two identical DM orders issued on the same tick already draw identically today**, and
> undoing an order and re-issuing it replays the same outcome."~~

**MEASURED at HEAD `cbd348a5`, read by symbol rather than by line address, quoted verbatim:**

`mintRealmVerbProposal` composes **no seed at all.** It calls `buildRealmVerbOutcome`, which
contains no `rngSeed` reference and stamps its outcome:

```js
      applyMode: 'proposal',
      forced: true,
      provenance: 'dm',
      proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb, args: a },
```

Inside `applyWorldPulseOutcomes`' per-outcome loop, a `'proposal'` outcome is short-circuited
before any verb arm is reached:

```js
    if (outcome.applyMode === 'proposal') {
      const proposal = { /* ... */ };
      state = upsertProposal(state, proposal);
      proposals.push(proposal);
      newsEntries.push(newsEntryForOutcome(outcome, tick, 'proposal'));
      continue;
    }
```

`applyRealmVerbOrder` — the only site where the realm-verb seeds are composed — is called
**after** that `continue`, in the same loop body, under the source's own comment naming the
precondition:

```js
    // W-COMPOSER-2 — THE REALM VERB ARM. An APPROVED realm_verb_order resolves
    // ...
    if (outcome.proposalPayload?.kind === REALM_VERB_PAYLOAD_KIND) {
      const armed = applyRealmVerbOrder({ state, snapshot, settlementUpdates, outcome, tick: tick ?? 0, now: now ?? null });
```

**I checked the one escape hatch.** Line 365 flips `applyMode` to `'auto'` when
`stateOnly` — but `isStateOnlyOutcome` tests `record?.recordMode === STATE_ONLY_RECORD_MODE`,
and `buildRealmVerbOutcome`'s literal carries no `recordMode`. The hatch does not fire. The
`continue` is unconditional for a minted realm-verb order.

The approval path is the one that reaches it: `applyWorldPulseProposal` calls
`resolveProposalToOutcome`, and `decisionTier.js` returns `{ ...(outcome || {}), applyMode:
'auto' }`, which falls past the proposal branch and into the verb arm.

#### ⭐⭐ THE COUNT CORRECTION: TWO → ONE

**J-EP-15's premise is refuted in the same measurement.** It states:

> ~~"`applyWorldPulseOutcomes` has FIVE call sites and only one is the pulse; **two of the
> others (`mintRealmVerbProposal`, `applyWorldPulseProposal`) reach `applyRealmVerbOrder`**
> and therefore family-1 rows 14/15/16 with a world the pulse did not compose."~~

**MEASURED: exactly ONE of the others reaches `applyRealmVerbOrder` — `applyWorldPulseProposal`.**
`mintRealmVerbProposal` does not. The five-call-site figure itself is CONFIRMED
(`pulseKernel.js`, `envoyPulse.js`, `applyWorldPulse.js` ×2, `partyImpact.js`); only the
"two of the others" sub-count is wrong. **The DM door count is ONE, not TWO, everywhere.**

#### ⛔ THE CONSEQUENCE THAT MATTERS MOST: ONE OF EP-3 SLICE A's PINS IS VACUOUS AS SPELLED

EP-3 slice A's charter lists, among its pins:

> ~~"the DM-DOOR pin (§3b.1b's J-EP-15): `mintRealmVerbProposal` on a NEVER-LIT world
> composes today's literal key, and on a lit world composes the key bearing that world's own
> `latest` epoch — both directions, so the door's behaviour is recorded rather than found."~~

**`mintRealmVerbProposal` composes no key in either flag state.** A pin driving that function
and asserting a composed key asserts nothing — it is green under the correct implementation,
green under a broken one, and green under a build that never wrote the accessor at all.

**This is the volume's own revision-6 rule failing on the volume's own newest pin.** That
rule reads: *"for every symbol this volume declares, name (a) where its value comes from,
(b) the body that produces it, and (c) the executed pin that proves a real caller got a real
value — three columns, no exceptions, and a declaration missing any one of them is a build
STOP."* The DM-door pin names a caller that is not one. It is the same shape as R11 and R13,
at a third address, introduced by the round that catalogued the class — and **it is exactly
the kind of thing an unreviewed revision 6 (§1.3) would still be carrying.**

**REQUIRED REPAIR, before EP-3 slice A builds:** re-aim the DM-DOOR pin at
`applyWorldPulseProposal` (mint a proposal, then APPROVE it, and assert the composed key at
the approval), and add the mutant that a pin driving only the mint stays green — so the
vacuity cannot come back.

#### THE SUBSTANTIVE RULING

**RULING B2: READING (a) — a DM order is an ACTION IN THE WORLD; replaying it identically is
correct and the current behaviour stands. EP changes it in neither flag state. CHAIR-RULED.**

**Reasoning.** The directive has two doors and a DM verb is neither: the engine clause
governs *time advances*, the generator clause governs *generate/reroll affordances*. A DM
verb is an authored act — the estate's own Req-14 edit-verb doctrine treats DM verbs as
authorship, and §3e's eighteen-affordance census does not carry it. Re-issuing an identical
order on an identical world and getting an identical outcome is what makes a DM's undo-and-
retry legible rather than a slot machine. The living-future door is the ADVANCE, and
J-EP-15 already gives it a fresh epoch.

**The conclusion survives the refutation, with a corrected mechanism** — and this is the
honest form of it, replacing the struck sentence:

> **CORRECTED, MEASURED:** two identical DM orders **approved on the same world at the same
> tick** draw identically today, because the composition happens in `applyRealmVerbOrder` at
> approval, keyed on the approval-time world's `rngSeed` and tick. The mint draws nothing.

**⭐ AND ONE BEHAVIOUR THE VOLUME NEVER ASKED ABOUT, which falls out of the correction.**
Because the draw happens at approval and not at mint, an order authored while the world is
living in epoch E1 and left pending across an advance **resolves under E2**. That is coherent
under J-EP-15's own principle — *"a DM order resolves in the epoch the world it acts on is
living in"*, and the world it acts on is the E2 world — so the ruling stands. But it should
be **stated**, because J-EP-15's stated rationale ("stable for a given world") is precise
only when no advance intervenes between mint and approval.

**Reading (b) is DECLINED and recorded as the escalation path.** Making a DM order mint fresh
entropy would need a mint at the store layer and a NINETEENTH row in the §3e affordance
manifest — **genuinely new capability, not repair**, and therefore not mine to grant even
under the blanket sign-off. If the owner reads the directive's "every click" clause as
reaching DM verbs, that is an owner ruling and it becomes its own wave.

**Waves.** B2 changes no EP charter. **It does change EP-3 slice A's pin set** (the
re-aiming above), and it corrects J-EP-15's premise and the DM-door count in every home.

**Veto sentence.**
> *Veto B2=reading (a) if you read the directive's "every click" clause as reaching DM verbs
> as well as advances and generate/reroll buttons; the cost is a store-layer mint, a
> nineteenth affordance row, and a new answer to what "undo a DM order and re-issue it"
> should mean.*

---

## §4 THE §7a AUDIT — THE FOUR OWNER-GATED PARKED ROWS

### 4.1 THE COUNT IS FOUR. CONFIRMED. NO FIFTH ROW EXISTS.

Chair ruling P4 pinned the count at FOUR "EVERYWHERE". I audited every statement of it in
the volume:

| Address | Statement | Reads |
|---|---|---|
| §0.2 item 4 (line 276) | "FOUR further rows are OWNER-PARKED" | FOUR |
| §4, EP-4 preamble (line 3084) | "TWO SLICES EXTRACTED, FOUR ROWS PARKED" | FOUR |
| §5 item 6 (line 3305) | "FOUR owner-gated parked rows" (⚠ lands VERBATIM in the parent volume) | FOUR |
| §7a intro (line 3662) | "The table below has FOUR rows" | FOUR |
| §7a row 3 (line 3669) | "all FOUR parked rows sit in one place" | FOUR |
| §7b intro (line 3676) | "its figure is FOUR (chair ruling P4, unchanged in revisions 4, 5 and 6)" | FOUR |
| Closing count (line 3954) | "FOUR owner-gated rows parked (§7a)" | FOUR |
| **The table itself** | rows numbered 1, 2, 3, 4 | **FOUR** |

A counter-sweep for `(five|three|two) … park` returns nothing. **Seven prose statements and
the table all agree at FOUR. No STOP is owed on the count.** P4's ruling held through three
subsequent revisions, which is what a well-made pin looks like.

### 4.2 THE FOUR ROWS, AND WHAT THE BLANKET SIGN-OFF ALREADY DOES TO THEM

**⭐ THE FINDING WORTH SURFACING: three of the four are already SIGNED and the volume does
not know it.** The volume was written 2026-08-05 and says of §7a *"none builds inside this
program."* The blanket sign-off row landed 2026-08-06. Its scope reading is explicit: *"Every
item PARKED AWAITING OWNER SIGN-OFF anywhere in this program's queues — rows in this file,
`docs/OWNER_DECISION_QUEUE.md`, the integration fold's PARKED list above, **the EP volume's
parked rows**, and the volumes' own owner-gated arms — is now SIGNED, PER THE CHAIR'S
RECORDED RECOMMENDATION FOR THAT ITEM."*

| # | Row | Gated class | Recorded recommendation | Sign-off status |
|---|---|---|---|---|
| 1 | **A4/A5 — the sample-fork seed.** `forkSeedFor(sample, userId)` is a pure function of (card, user), so the same user forking the same card gets the same town forever | **PAID / FOUNDER SURFACE** | **LIVING DOOR** — the fork mints fresh; the sample's own seed stays typeable in the `SeedField`, which is the address | ⭐ **SIGNED — named explicitly** in the RELEASED TO BUILD list ("EP-4's two parked repairs (paid-surface + persisted-shape)") |
| 2 | **A11 — the town-map layout reroll.** `nextLayoutVariant(edits)` returns `readLayoutVariant(edits) + 1`; reset-then-reroll replays variant 1 forever | **PERSISTED SHAPE** | **MINT A SEED, DO NOT WIDEN THE COUNTER** | ⭐ **SIGNED — named explicitly** (same clause, the "persisted-shape" half) |
| 3 | **H5 — `_regenSeed` holds only the LAST reroll**, so an earlier reroll in a chain is unreplayable | **PERSISTED SHAPE on a DM-share blob** (migration 121 + `publicSafe.js`) | Widen to a per-action list at the ROOT only, with the gallery key-list impact measured FIRST | ⭐ **SIGNED by the general clause** ("the EP volume's parked rows"), not by the enumeration — H5 was never an EP-4 slice |
| 4 | **J-EP-10's FORCE_RESETTLE finding** — the stream is TICK-INVARIANT (`` `${rngSeed}:realm_verb` ``, no tick, no entity) | **SAME-SEED SHIFT / THE PROMISE** | Add the tick term as its OWN owner-signed change with a recorded golden shift. EP deliberately does not, in either flag state | ⛔ **I DECLINE TO CONSUME THE SIGNATURE — see 4.4** |

All four rows' factual premises were re-measured against live code and **all four CONFIRMED**
(see §7). Rows 1–3 are therefore *effectively signed and merely unrecorded as such* in §7a,
which still reads "none builds inside this program." That staleness is worth repairing when
the volume next moves.

**⚠ OBLIGATIONS THAT TRAVEL WITH ROWS 2 AND 3 AND ARE NOT WAIVED BY THE SIGNATURE.** The
signature's content is the recommendation, and both recommendations carry preconditions:
row 2 requires *"a `mapEdits` KEY-ORDER byte-identity proof and a migration story for
existing `layoutVariant` values"*; row 3 requires *"the gallery key-list impact measured
first"* — MEASURED, `_regenSeed` is stripped by `supabase/migrations/121_strip_regen_seed_gallery_dm.sql`,
by `src/domain/display/publicSafe.js`, and is a member of `FORBIDDEN_MANIFEST_KEYS` in
`src/domain/townScene/manifestContract.js`, so widening it touches three strip sites, not
one. **A signature releases the work; it does not discharge the work's own gates.**

### 4.3 ⚠ A DOCUMENT COLLISION I AM REPORTING RATHER THAN RESOLVING SILENTLY

- **The volume (2026-08-05)** says rows 1 and 2 *"leave EP entirely and become owner-queue
  entries"* and that §7a rows build *"nowhere in this program."*
- **The sign-off row (2026-08-06)** releases them *"rejoining the EP waves with their own
  gates."*

These disagree. **My reading, offered and vetoable:** the sign-off wins on **authority**
(rows 1 and 2 are signed and may be built), and the volume wins on **sequencing** (they are
not EP-4 slices and must not be smuggled back into EP-4's commit, whose dark-state claim —
*"with A11 and H5 extracted, NO slice here changes a persisted shape at all"* — is
load-bearing and would be falsified by re-absorbing them). They build as **their own small
waves with their own gates**, which is what "with their own gates" already says. That
reconciles both documents without either being wrong, and it preserves EP-4's strongest
claim.

### 4.4 ⛔ ROW 4 IS ESCALATED — I DECLINE TO READ THE BLANKET SIGN-OFF AS CONSUMING IT

Three reasons, and the first is the one that decides it:

1. **Its own recorded recommendation asks for a SEPARATE owner signature** — *"Add the tick
   term as its OWN owner-signed change with a recorded golden shift."* The sign-off's
   construction is that the recommendation IS the content of the signature. Here the
   recommendation's content is *"this needs its own signature."* Consuming a blanket grant to
   satisfy a recommendation that explicitly asks for a specific one inverts the instrument.
   **The grant signs the PROCESS — that a separate signature be sought — not the ACT.**
2. **It is a THE PROMISE event in BOTH flag states.** Adding the tick term is a same-seed
   shift for every existing world that has ever resettled, and no flag darkens it. Every
   other owner-gated item in this program is protected by an unlit flag; this one is not.
3. **It produces a recorded golden shift on shipped saves.** That is behaviour change to
   data users already have, which is the class the estate gates hardest.

**MEASURED, CONFIRMED — the finding itself is real.** `grep -n 'const seed = '
src/domain/worldPulse/realmVerbExecution.js` returns exactly three hits:

```
676:      const seed = `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}`;   // FORCE_CALAMITY
742:      const seed = `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}`;   // FORCE_FOUND_STEADING
809:      const seed = `${String(state.rngSeed ?? 'realm')}:realm_verb`;              // FORCE_RESETTLE — no tick term
```

**This escalation blocks NO EP wave.** J-EP-10 already rules that EP takes the epoch at
FORCE_RESETTLE and adds no tick term in either flag state, and slice A's re-root at RS-15 is
unaffected. Row 4 is a clean park with a clean reason.

**Gate it goes to:** the owner, as a THE PROMISE / same-seed-shift decision requiring its own
signature and a recorded golden shift.

---

## §5 THE VERIFY-AT-FOLD OBLIGATION — SPECIFIED, NOT PERFORMED

**⚠ I DID NOT COUNT ANYTHING. A separate census lane owns the numbers.** This section defines
the obligation precisely and states what it depends on; every figure below is either quoted
from a document or explicitly marked as owed.

### 5.1 The trigger has fired

§5 carries an executed banner: *"STALE BY EVENT, NOT WRONG — THE FOLD LANDED
MID-REVISION-6 AND THIS WHOLE SECTION IS NOW A VERIFY-AT-FOLD THAT HAS COME DUE."*
**CONFIRMED:** `docs/DESIGN_FP_ARCH_ES.md` and `docs/DESIGN_FP_ARCH_WY.md` now exist as repo
files in the build tree, and `docs/DESIGN_FP_ARCHITECTURE.md` exists at 158,501 bytes.

The binding text EP-0's charter must satisfy:

> *"At the moment EP's rows are composed, RE-COUNT the post-fold §5 wave rows and §9 seam
> rows in the landed `docs/DESIGN_FP_ARCHITECTURE.md` and write the arithmetic from THAT
> count… If the re-count disagrees with the fold's PLAUSIBLE 75/66, the tree wins and the
> disagreement is a STOP-and-report, not a silent re-base."*

### 5.2 ⭐⭐ THE OBLIGATION IS ASYMMETRIC, AND THE VOLUME DOES NOT SAY SO

MEASURED in the landed parent volume at HEAD `cbd348a5`:

- **§5's heading STATES a figure:** `## §5 THE WAVES (75 waves, dependency-ordered ACROSS
  programs; …)`.
- **§9's heading states NO figure at all:** `## §9 SEQUENCING RATIONALE + THE SEAM MATRIX` —
  no count anywhere in the heading, and the next non-blank line is body prose.

**This changes the shape of the work.** For WAVES there is a header figure to reconcile the
row count against. **For SEAMS there is nothing in the §9 heading to check** — so an
implementer who "re-counts the §9 seam rows and compares them to the header" finds no header
to compare to and can close the obligation having verified nothing. The parent volume's seam
count lives at *other* sites; the fold README names the class: *"the parent's header counts,
which are spelled at MULTIPLE sites (header + §2b digest + closing summary + §9 prose)."*

### 5.3 What EP-0 must re-derive, in order

1. **ENUMERATE the count-bearing sites first.** Sweep `docs/DESIGN_FP_ARCHITECTURE.md` for
   every site stating a WAVE count and every site stating a SEAM count — header, the §2b
   digest, the closing summary, and §9 prose at minimum. **This enumeration is itself a
   deliverable**, because §9's heading carries no count and a single-site check is vacuous.
2. **COUNT the §5 wave rows** in the landed file. Reconcile against every site from step 1
   and against the fold's PLAUSIBLE **75**. Any disagreement is a STOP-and-report.
3. **COUNT the §9 seam-matrix rows** in the landed file. Reconcile against every site from
   step 1 and against the fold's PLAUSIBLE **66**. Any disagreement is a STOP-and-report.
4. **WRITE the arithmetic from THAT count:** waves = re-count **+ 6**; seams = re-count
   **+ 10**. Never from an inherited 75 + 6 = 81 or 66 + 10 = 76.
5. **UPDATE the EP volume's §5 items 3 and 5**, which currently name 81 and 76 as the
   PLAUSIBLE-derived totals, and §5 item 6's "FOUR owner-gated parked rows" sentence, which
   lands VERBATIM in the parent volume.
6. **RE-CONFIRM THE FLAG ARITHMETIC TOO — the volume does not schedule this and it should.**
   §5 item 1 states "MEASURED: 43 live + 1 ES + 8 WY = 52; EP is next" → row 53, and calls it
   "MEASURED-AT-BOTH-ENDS". That measurement was taken **pre-fold at `32cc17f7`**. Post-fold
   it must be re-confirmed by counting the §3 flag-table rows in the landed file. The volume
   asserts the arithmetic survives; it does not assert anyone re-counted it after the fold.
7. **⭐ THE RE-COUNT IS NOT A ONE-TIME ACT WITH A FIRED TRIGGER.** The obligation binds *"at
   the moment EP's rows are composed."* The ES+WY fold has already moved these numbers once.
   **Any further fold that lands before EP's rows are composed — HB, WC, or EP itself —
   moves them again.** The trigger has fired once; it re-fires on every intervening fold, and
   a count taken today is stale the moment another volume lands.

### 5.4 What it depends on

A live read of `docs/DESIGN_FP_ARCHITECTURE.md` **on the build branch at the moment of
composition** — not on this document, not on the EP volume's §5, and not on the fold
package's own figures, which the fold labels PLAUSIBLE by its own anomaly A6. The census
lane's numbers are inputs to steps 2 and 3 and carry the same expiry.

---

## §6 REFUTED PREMISES FOUND BY THIS LANE

Recorded in the volume's own struck-premise discipline: original wording quoted and struck,
measured replacement stated, impact named. Under J-WR-13 an implementer meeting any of these
STOPS before building on it.

| # | Premise, as the volume states it | Measured | Impact |
|---|---|---|---|
| **X1** | ~~"`mintRealmVerbProposal` composes `` `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}` `` off the COMMITTED world"~~ (§7b B2) | **REFUTED.** `mintRealmVerbProposal` composes no seed. `buildRealmVerbOutcome` stamps `applyMode: 'proposal'`; the outcome loop `continue`s before the verb arm. Composition lives in `applyRealmVerbOrder`, reached only at APPROVAL | B2's conclusion survives with a corrected mechanism (§3) |
| **X2** | ~~"two of the others (`mintRealmVerbProposal`, `applyWorldPulseProposal`) reach `applyRealmVerbOrder`"~~ (J-EP-15) | **REFUTED. ONE does**, `applyWorldPulseProposal`. The five-call-site total is CONFIRMED; only the sub-count is wrong | **The DM-door count is ONE everywhere.** J-EP-15's ruling stands; its premise and count do not |
| **X3** | ~~EP-3 slice A's "DM-DOOR pin: `mintRealmVerbProposal` … composes the key bearing that world's own `latest` epoch"~~ (§4) | **VACUOUS AS SPELLED** — it drives a function that composes nothing | ⛔ **Slice A pin repair required before build.** Re-aim at `applyWorldPulseProposal`; add the mutant that a mint-only pin stays green |
| **X4** | ~~"`appendPulseHistory` … is the only append"~~ (§8.1 row 9 / §1.2(a)) | **PARTIAL.** The ONE-SEAM *append* claim holds, but `collapseIntervalHistory` (`advanceInterval.js`) is a second real writer of `pulseHistory` on the persisted world, via `{ ...worldState, pulseHistory: composed }` | Low. The volume knows this path (§1.5, §8.4) and rules it; the §8.1 wording should say "the only APPEND", which is what it means |
| **X5** | ~~§7b B1: `factionNamePrecedenceScan.test.js` has "two comment mentions"~~ | **THREE** (lines 40, 49, 177) | Cosmetic; recorded per the volume's no-tolerance rule |
| **X6** | Front matter records six revision rounds | **SEVEN passes exist.** Round 7 is marked once, at the DISPLAY-SURFACE RULE, and nowhere in front matter | A reader trusting front matter believes the volume is a round younger than it is (§1.2f) |

**⚠ ONE FURTHER OBSERVATION, not yet a refutation — flagged for the build lane.** At the
approval door the tick is sourced as `tick: campaign.worldState?.tick || proposal.tick || 0`.
That is a `||` chain, so a **live tick of 0 falls through to the proposal's stored mint-time
tick.** `tickStreamSeedOf`'s CURRENT-TICK SELECTION RULE selects on `latest.tick ===
worldState.tick`. On a tick-0 world carrying a proposal minted at a nonzero tick, the seed's
`nowTick` and the ledger's selection tick therefore disagree. This is precisely the
`||`-versus-`??` coercion class §3b.3 catalogues. It is narrow and may be unreachable in
practice; **EP-3 slice A's pin set should cover it or declare it unreachable with a measured
reason.**

---

## §7 VERIFY-AT-BUILD PREMISES — EVERY LIVE-CODE CLAIM MY RULINGS LEAN ON

All measurements read-only against the build tree
`/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold` at HEAD `cbd348a5`.
**Live code outranks every table here, including this one.** Every row is re-measurable at
build; a disagreement is a STOP-and-report, not a tolerance.

⚠ **THE TREE WAS NOT CLEAN WHEN I MEASURED IT, AND TWO FILES I READ CARRY ANOTHER LANE'S
UNCOMMITTED EDITS.** `git status --porcelain` on the build tree at measurement time showed a
concurrent lane mid-build (the errand-spine / SP-D work: 14 modified files and 6 untracked).
Two of them are files this document's findings rest on:

- **`src/domain/worldPulse/simulationRules.js` (MODIFIED)** — the source of the Q4
  manifest-sortedness row. The finding survives it (the array is alphabetically sorted and
  `advanceEpochEnabled` sorts before `beliefAxesEnabled` regardless of what the lane appends),
  but **the array is actively growing under another lane**, so EP-1's "exact one-key delta"
  assertion must be re-measured against whatever has landed by then, never against this
  reading.
- **`docs/FABLE_VALIDATION_QUEUE.md` (MODIFIED)** — the source of the blanket sign-off text
  quoted throughout §2 and §4. The sign-off row itself is COMMITTED (`3e2bd309`, "Row slice:
  the blanket sign-off row…"), so the quotations are of committed content; the dirty hunks are
  the concurrent lane appending its own row at the tail.

Every other file quoted here was clean at read time. **None of the lane's WIP is mine; I
wrote nothing in that tree.**

| Premise | Ruling that leans on it | Status |
|---|---|---|
| Zero collisions for `advanceEpochEnabled`, `livingFuturesEnabled`, `advanceEpoch`, `livingFutures`, `epochEnabled` | **Q4** | **CONFIRMED** — five greps, zero hits each, whole tree including `docs/` |
| `advanceEpochEnabled` sorts before `beliefAxesEnabled` in the alphabetical manifest position | **Q4** (my added reason) | **CONFIRMED** — `ENGINE_GATED_VIRTUAL_RULE_KEYS` in `src/domain/worldPulse/simulationRules.js` is a sorted frozen array opening `'beliefAxesEnabled'`, `'believedConditionsEnabled'`, `'believedDevotionEnabled'`, `'believedScarcityEnabled'`, `'casusCommerciiEnabled'`, `'conquestDoctrineEnabled'`; `advanceEpochEnabled` sorts first |
| `seasonalSeverityFor` has a DISPLAY caller in `src/domain/townMap/mapDress.js` | **Q1** | **CONFIRMED** — `mapDress.js:137`; its consumers are a React hook, a thumbnail lib and `sceneLiving.js`, all view-time |
| `realizeCauseWalk`'s `pick` is `pool[fnv1a32(...)% pool.length]` on `seedId` from `CauseWalkPanel.jsx` | **Q1** (display-surface rule) | **CONFIRMED** verbatim, both ends |
| RS-9 is ONE read feeding family 1 AND year-keyed row 20 | **Q1** (the slice A/B split) | **CONFIRMED** — one `seed` at `npcLadderKernel.js` threaded to `resolveFactionChallenges` and `advanceContests`, reaching `ladder-support:...:${year}` via `convertSupporters` |
| Three year derivations in two bases (`seasonForTick.year` = `floor(w/52)+1`; `intelYearOf` and `npcLadderContest#yearOf` = `floor(w/52)`) | **Q1** (J-EP-13 `yearBase` required) | **CONFIRMED** verbatim, all three |
| `pulseUndoStack` is session-only, absent from `partialize` | **Q2 rider** | **CONFIRMED** — `partialize` is an exhaustive literal of eight keys; `pulseUndoStack` is not among them |
| `MAX_HISTORY = 80`, eviction by `slice(-MAX_HISTORY)` in `appendPulseHistory` | **Q3** | **CONFIRMED** verbatim |
| `appendPulseHistory` is the only *append* to `pulseHistory` | **Q3 / §8.1 row 9** | **PARTIAL** — see X4 |
| `forkSeedFor` = `` `${sample.config.seed}-${suffix}` ``; two tier-gated callers | **Q5 / §7a row 1** | **CONFIRMED** verbatim, including `s.auth.tier` and `setPurchaseModalOpen(true)` |
| `nextLayoutVariant` = `readLayoutVariant(edits) + 1`; reset-then-reroll replays variant 1 | **§7a row 2** | **CONFIRMED**, with one precision: `doReset` commits `null` for the whole `mapEdits` container, not just the field; `readLayoutVariant(null)` returns 0, so the consequence holds |
| `_regenSeed` holds only the last reroll; stripped by migration 121, `publicSafe.js`, `FORBIDDEN_MANIFEST_KEYS` | **§7a row 3** | **CONFIRMED** — and the strip sites are THREE, which the row's "measure the gallery impact first" precondition should name |
| FORCE_RESETTLE composes `` `${rngSeed}:realm_verb` `` with no tick term | **§7a row 4** | **CONFIRMED** — three `const seed =` hits, only the third lacks `:${nowTick}` |
| `personaSlicer.js` has zero `src` importers, by filename, by all three exported symbols, via barrel, and via dynamic import | **B1** | **CONFIRMED** on all four spellings |
| `applyWorldPulseOutcomes` has five call sites, one being the pulse | **B2 / J-EP-15** | **CONFIRMED** — `pulseKernel.js`, `envoyPulse.js`, `applyWorldPulse.js` ×2, `partyImpact.js` |
| `mintRealmVerbProposal` does NOT reach `applyRealmVerbOrder`; `applyWorldPulseProposal` does | **B2 / J-EP-15 / slice A pin** | **CONFIRMED — read by symbol, by me, with the `stateOnly` escape hatch checked and excluded** |
| `setSpatialLedger` creates the namespace when absent and preserves siblings by spread | **Q1** (the M3 dormancy arm) | **CONFIRMED** verbatim |
| `buildPausedAdvanceCursor` is hand-built field-by-field (a new field must be threaded) | **Q1/Q2 context, §1.3 of the volume** | **CONFIRMED** — explicit object literal, no wholesale spread |
| `docs/DESIGN_FP_ARCHITECTURE.md` §5 header states 75 waves; §9 header states no count | **§5 of this document** | **CONFIRMED** |
| The parent volume's §5 and §9 **row counts** | **§5 of this document** | ⛔ **NOT MEASURED — deliberately.** A separate census lane owns them; step 2/3 of §5.3 is owed |
| Every count inside the EP volume other than the parked-row four | — | ⛔ **NOT RE-VERIFIED by this lane.** I audited the §7a count exhaustively and spot-checked no other. The volume's own re-run discipline applies |

---

## §8 DISPATCH STATE — HOW MANY OF THE SIX WAVES BECOME DISPATCHABLE

**All six waves become chair-dispatchable. Two carry a required repair first.**

| Wave | Was blocked by | Now |
|---|---|---|
| **EP-0** — the pure segment + the root census | Nothing (no flag; dark by construction) | **DISPATCHABLE.** Its charter gains the §5.3 re-count obligation, which must be discharged when EP's rows are composed |
| **EP-1** — the kernel seam + the flag | **Q4** (the flag name) | **DISPATCHABLE** — Q4 ruled `advanceEpochEnabled`. ⚠ Gains Q3's in-file comment on `worldState.js`, which must be budgeted here |
| **EP-2** — the fork semantics | Nothing | **DISPATCHABLE** (needs EP-1) |
| **EP-3 slice A** — family 1 + the writer + the stamp | Nothing (ships under either arm) | **DISPATCHABLE AFTER ONE REPAIR** — ⛔ the DM-DOOR pin is vacuous as spelled (X3) and must be re-aimed at `applyWorldPulseProposal` before build |
| **EP-3 slice B** — family 2, the year anchor | **Q1** — "both arms, neither taken" | ⭐ **UNBLOCKED. Q1 = ARM A.** Slice B builds |
| **EP-4** — the generator-side law | **Q5**'s H1 independence clause | **DISPATCHABLE.** Slice 1 (H1) stands independent of the A4/A5 ruling. Rows A4/A5 and A11 build as their own gated waves, NOT as EP-4 slices (§4.3) |
| **EP-5** — the promise amendment | Nothing | **DISPATCHABLE** at the terminal gate. ⚠ Gains Q3's bound (no unbounded replay claim) and §8.4's account-import clause |

**The two serialization laws are untouched by every ruling here:** EP-1 is a CQ5 flag wave
and EP-3 **slice A** carries the `src/lib/spatialUsage.js` manifest row — neither may build
concurrently with another flag wave or another ledger-minting wave in the same worktree.
Serialize, or one worktree each; CHECK-GIT-FIRST before every stage on a shared file.

**⚠ AND THE STANDING CAVEAT FROM §1:** "dispatchable" here means *the chair questions no
longer block them.* It does not mean the volume has the adversarial closure its revision 6
never received. §1.3 and X3 are the argument that it does not.

---

## §9 ESCALATIONS — EVERY ONE, WITH ITS REASON AND ITS GATE

| # | Item | Why it is not mine | Gate |
|---|---|---|---|
| **E1** | **Persisting `pulseUndoStack`** (Q2's rider) | Persistence shape, **and no recorded chair recommendation exists** — so the blanket sign-off has no content to supply. Consuming it would mean manufacturing the owner's consent for a recommendation I wrote in this document | **Owner**, as a persistence-shape decision, with the ring's serialized size measured first. Blocks no EP wave |
| **E2** | **§7a row 4 — the FORCE_RESETTLE tick term** | Its own recorded recommendation asks for a SEPARATE owner signature; it is a THE PROMISE event in BOTH flag states with no flag to darken it; it produces a recorded golden shift on shipped saves | **Owner**, as a same-seed-shift / THE PROMISE decision. Blocks no EP wave (J-EP-10 already declines it in-program) |
| **E3** | **B2 reading (b)** — making DM orders mint fresh entropy | Genuinely new capability, not repair: a store-layer mint plus a nineteenth §3e affordance row | **Owner**, only if he reads "every click" as reaching DM verbs. Declined here; recorded so the path exists |
| **E4** | **The `_SEALED` → `round7-snapshot` rename** | Touches a shared script and a shared README on a branch a sibling lane is working, and is outside this lane's one-file scope. **Proposed, not started** | **Chair**, as a three-part single commit (§1.4). ⛔ A file-only rename is worse than none |
| **E5** | **Whether EP builds without a round-7 closure** | This is the gate a "sealed" label would have caused a lane to skip. It is a process decision about the volume as a whole, not a question inside it | **Chair.** §1.3 is the argument that revision 6's four rulings — one of them HIGH and architectural — have never been adversarially reviewed, and X3 is what that looks like from outside |

**Not escalated, and stated so the absence is deliberate:** Q1 (chair design ruling; the
persisted sub-key lands under either arm and no PRNG call order moves), Q2's main question,
Q3, Q4, Q5's H1 clause, B1, and B2 reading (a). **Q5's A4/A5 disposition is neither ruled nor
escalated** — it is already signed, and this document records the signature and its content
rather than re-deciding it.

---

*Prepared 2026-08-06 under Opus 5 for the validation chair. Read-only against the build tree
at HEAD `cbd348a5` and against the EP volume on the ledger branch `review-fixes-2026-07-08`;
zero repo files written outside this one, zero gates run, zero test commands issued, zero
git state-mutating commands. ⏳ **OPUS-ERA — FABLE SURVEY OWED**: every ruling here is
banked for the next Fable session to survey and validate before it is treated as chair
canon. Every ruling is VETOABLE; one clause from the owner or the chair strikes any of them.
Where this document disagrees with live code, live code wins and the disagreement is a
STOP-and-report. Nothing here lights a flag, runs a soak, ratifies a band, re-records a
golden, deletes a module, or pushes.*
