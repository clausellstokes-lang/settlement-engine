1. `[visitor]` The way into {settlement} runs over ground of the kind that favours the defender.
   - `[face]` Ground that is hard on an attacker lies about {settlement}.
   - `[face]` Whatever comes at {settlement} crosses the defender's ground.
   - `[face]` The advantage of the ground at {settlement} is the defender's.
2. `[ledger]` Part of what defends {settlement} is the site itself.
   - `[face]` What the site gives {settlement} is unbuilt defence.
   - `[face]` Among what holds {settlement} is the ground it stands on.
   - `[face]` In the reckoning at {settlement}, the ground stands to the defender's account.
3. `[counterforce]` An attempt on {settlement} meets the ground before it meets the town.
   - `[face]` Force brought against {settlement} has the country to get through.
   - `[face]` Ground stands against whatever comes at {settlement}.
   - `[face]` The country about {settlement} counts for the defender.

--- NOTES

**Packet.** DS-DEF-1 · pool `terrain FAVOURABLE to the defender` · DRAFT round 1 · seat Opus 5 (Fable-unvalidated), writing for the Fable chair. **3 variants, 12 wordings** (each variant's numbered row is its face 0; three `[face]` sub-rows follow). None added, none removed, none merged, none reordered; every variant keeps its own number and its own single bracketed angle tag exactly as the annex carries it (`[visitor]`, `[ledger]`, `[counterforce]`); no `[plain]` token anywhere; no typed line (ROLE, READS, RELATION, ATTACH, FORM, MOVE) is written or repeated (§22 a/b/e; ARCH §2.5's one-tag row grammar; the projector's `FACE_ROW_RE = /^\s*-\s+`\[face\]`\s+(.*)$/` at `scripts/lib/dossier-annex-grammar.mjs:107`, which the face rows above match).

**Sources read whole before a word was written.** `prose-research/REGISTER-CARD.md` (with S2 and S3); `RULES-V2-PART-B.md` §1 (R-DA-00 … R-DA-24 and 1.W), §16–§16.2, §18, §20, §21–§23 and §21.1–§21.4, §24; `sweep/MOVE-GRAMMAR.md` §1–§3, §4.4.1–§4.4.3 and §1.4.1 (THE THREAD); `sweep/CLERK-LAWS.md` §2.4/§2.4.1 and §2.6/§2.6.1; `arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 and §8.3. The card was printed with `node scripts/prose-licence-card.mjs DS-DEF-1 'terrain FAVOURABLE to the defender'` in the read-only dock `laneRW-DEF1`; the pool's shipped rows and the block's whole annex section were read at `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2500-2567`; the producing leaf at `src/domain/display/stateProse/defenseStateProse.js:610-695`; the detector definitions at `src/domain/prose/proseFingerprint.js:55-150`. Nothing was written outside this file; no dock byte moved; no test, build or git command was run.

**Word counts, in row order** (a `{settlement}` marker counts as one word): 14 · 10 · 8 · 10 / 9 · 8 · 10 · 12 / 12 · 10 · 7 · 8. Mean 9.8, min 7, max 14; one face under eight words, so the short line exists in the pool (REGISTER-CARD: *rhythm follows what is being said*). Hand-counted; no script was run, because the fence permits only the licence-card script in the dock.

---

## 1. THE ONE LICENSED CLAIM, AND WHY EVERY WORDING CARRIES IT AND NOTHING ELSE

The card licenses exactly one assertion:

```
may claim:  that `js)` (=== Mountain) holds, as a STANDING fact of the record
may NOT:    a count, a cause, a season, a future, a standpoint, a second fact
bag:        FILLED at this block's call sites: {settlement}
source:     (none) · standing SOURCE-UNRESOLVED — NO citation is licensed
```

So the twelve wordings each make **one claim** — *the ground this town stands in is of the kind that favours the defender*, as a standing fact — and each carries the one filled slot `{settlement}` exactly once. Face 0 and its three faces are therefore claim-equal to each other by construction (arm A6 reads across the faces), and the pool's variants differ in vocabulary, construction and rhythm, never in assertion (MOVE-GRAMMAR §3.4: a grammar may spend word order, punctuation and a rationed phrase; never a claim, a modality, a threat class or the pool's spread).

**The predicate is three terrains, not one** (the packet's governing finding, F1 below). The card prints `=== Mountain`, but `TERRAIN_DEFENCE_OF` (`defenseStateProse.js:629-637`) maps `Mountain`, `Hills` **and** `Forest` to this pool key; `Plains` and `Desert/Arid` go to the sibling pool `terrain EXPOSED`; `Coastal` and `Riverside` are absent on purpose and the lens is silent there. Every wording must therefore be true of a mountain town, a hill town and a forest town alike. That single fact is why **no wording names a landform** — no narrows, height, slope, ridge, defile, treeline, cover or long open approach — and why the set asserts the classification itself and leaves the landform to the terrain word the page already prints.

## 2. PER FACE — THE CARD CLAUSE THAT LICENSES EACH CLAIM

| row | wording | claims it makes | the clause that licenses each claim |
|---|---|---|---|
| all 12 | — | (i) the ground of this site favours the defender, as a standing fact | `may claim: that … (=== Mountain) holds, as a STANDING fact of the record`; the move is PRESENT (MOVE-GRAMMAR §1.2 row 1: a standing configuration field licenses a STRUCTURAL clause and never a historical one), the only move a terrain classification can license |
| all 12 | — | (ii) the town is named | `bag: … FILLED at this block's call sites: {settlement}`. `band` is RESERVED and `route`/`counterpart` are unfilled, so no other slot is lawful; every wording carries `{settlement}` exactly once, so each face's slot set is identical to its parent's (ARCH §2.5, T-F8) and **none opens on it** (same row; and R-DA-17 / wall 10 on the settlement token) |
| all 12 | "the defender" · "an attacker" | (iii) the two roles the advantage runs between | the POOL KEY's own predicate, `terrain FAVOURABLE **to the defender**`. Generic role terms of the classification: no office, no holding, no act, so this is not a PERSON move (R-DA-14) and not an INSTITUTION assertion (R-DA-15 — no office row is named); nobody sees, believes, knows or judges anything anywhere in the set, so `may NOT: a standpoint` is not engaged |
| 1 f0 | *runs over ground of the kind that favours the defender* | (i) only | `may claim`, in the card's own idiom: the licensed fact IS a kind-classification of the site, and "of the kind that" states it as one. `runs over` is a present locative, not an event (R-DST-B / A6); `that`, never `which` (R-DA-03, wall 6) |
| 1 f1 | *Ground that is hard on an attacker lies about {settlement}* | (i) as the converse | *favourable to the defender* and *hard on an attacker* are the same typed fact read from the two ends of the key; no second field is read. `lies about` is stative and locative (R-DA-11: nothing inanimate acts with intent) |
| 1 f2 | *crosses the defender's ground* | (i) as possession of the approach | `may claim`. The possessive attaches the advantage to the defending party, not to this town's works, so the line stays true where the readiness spine on the same header reads `CRITICAL` (§4) |
| 1 f3 | *The advantage of the ground … is the defender's* | (i) in nominal form | `may claim`. A comparison written as a measurement in words is the form R-DA-11 licenses in place of a figure; "advantage" is the key's relation named, not a magnitude (`may NOT: a count` is not engaged — no quantity, band or share is stated) |
| 2 f0 | *Part of what defends {settlement} is the site itself* | (i) as a partitive | `may claim`. "Part of" is a partitive with no number (R-DA-16: counts as words; none is used). It does not assert what the other part is, so no second field is read and nothing is presupposed about built works |
| 2 f1 | *What the site gives {settlement} is unbuilt defence* | (i) as the site's contribution | the STANDING half of `may claim`: a terrain classification is a fact of the site and of no event, so HISTORY (MOVE-GRAMMAR §1.2 row 2) is unreachable here and the eventless reading is the only licensed one. "unbuilt" states that this defence is not constructed; it presupposes nothing about what else exists |
| 2 f2 | *Among what holds {settlement} is the ground it stands on* | (i) as an item in a reckoning | `may claim`; the fronted predicate is word order, which B-CLAIM lets a grammar spend (MOVE-GRAMMAR §3.4) |
| 2 f3 | *the ground stands to the defender's account* | (i) in the ledger's idiom | `may claim`. **No holder is named**: a reckoning is a counting, not a keeper, and `source: (none) · SOURCE-UNRESOLVED` forbids naming one (§3 R3 below; arm A13; MOVE-GRAMMAR §4.4.3). The opening adverbial is one comma joint carrying no second fact (S2 is not engaged — nothing rides as a consequence clause) |
| 3 f0 | *meets the ground before it meets the town* | (i) as the order an approach runs in | `may claim`. The ordering is spatial — what an approach crosses first — not a comparison of strengths and not a mental act; the shipped row's *"has to weigh the approach first"* put the ordering inside an attacker's deliberation, which is the standpoint the card refuses (C5 below) |
| 3 f1 | *has the country to get through* | (i) as obstruction | `may claim`; `has … to get through` is necessity, not a future indicative (R-DA-07; A2; MOVE-GRAMMAR §1.3 FORECAST does not exist) |
| 3 f2 | *Ground stands against whatever comes at {settlement}* | (i) at seven words | `may claim`. `stands against` is stative, not an intent verb on an inanimate (R-DA-11's third class); the short line is the register card's own permission |
| 3 f3 | *The country about {settlement} counts for the defender* | (i) as a measurement | `may claim`; "counts for" is a measurement in words (R-DA-11) and carries no number (R-DA-16) |

**Close kinds, varied across the pool** (R-DA-04, and its five-member set): a role not further named (*the defender* ×3, *the defender's*) · an object (*ground*, *the town*, *the site itself*, *{settlement}* ×2) · a condition (*it stands on*, *to get through*) · an absence-shaped statement (*unbuilt defence*) · a standing item (*the defender's account*).

## 3. WHAT WAS DROPPED, AND WHAT WAS REFUSED BEFORE IT WAS WRITTEN

### 3.1 The claims the shipped wordings carried and the card does not license

Dropping them is the rewrite's purpose (the shipped breach is the corpus's known state); nothing is added in their place. The rule is R-DA-15's Obeys (6) — an unlicensed claim is not a claim the pool was entitled to hold, and ruling 5 requires its removal — with §22's confirmed edge: today's exact wording leaves the product when it fails the voice, its slot survives, and cutting words is editing while cutting sentences is trimming. Every slot, tag, number and order survives here; six claims do not.

| # | the shipped claim | the law that refuses it |
|---|---|---|
| C1 | v1 *"The ground does more for {settlement} than the town does"* | weighs the site against **the town's own works** — a second field this pool does not read (`may NOT: a second fact`), and it presupposes that works exist, which a composed Defense page can print beside `readiness CRITICAL` or beside DS-DEF-2's *neither walls nor force* rows |
| C2 | v1 *"The approach is narrow, and anything coming at it has to come the long way and in the open"* | a landform particular: true of a mountain town, **false of a forest town**, which draws this same pool (§1). Fault 24's shape; also a second fact, and the leaf's own docblock quotes this sentence as the reading it built the map from |
| C3 | v2 *"what the town has built is worth more here than the same works would be on flat ground"* | three refusals at once: the built works (a second fact, presupposed), a valuation of them (a second fact), and a counterfactual site (`flat ground`) that names the sibling pool's landform without naming its key — outside R-DA-02's contrast licence |
| C4 | v3 *"The ground here does the arguing"* | R-DA-11's third class outright: an inanimate acting with intent. A wall, not a band |
| C5 | v3 *"Anything weighing an attempt on {settlement} has to weigh the approach first"* | a standpoint — an attacker's deliberation — which `may NOT` names and MOVE-GRAMMAR §1.3 FEELING refuses. The licensed residue (that the ground is what an approach meets first) is kept in 3 f0 as a physical ordering |
| C6 | v3 *"the approach is the part that does not improve with numbers"* | a claim about force ratios in a siege: a second fact, count-shaped (`may NOT: a count`), and a generalising closer (R-DA-12) |

**No claim was added.** The claim set of each rewritten variant is `{(PRESENT, text(terrain), favourable-to-the-defender), (slot, {settlement})}` and nothing else, identical across all twelve wordings.

### 3.2 Five wordings refused before they were written

1. **Any wording naming a landform** (narrows, height, slope, ridge, defile, cover, treeline, level ground). §1: three terrains draw this pool and no landform word is true of all three. This also removes the tempting *"on level terms / on level ground"* family.
2. **The disjunction that IS true of the class** (*uphill or through cover*). Refused as two claims wearing one coat: the card licenses the classification, not its members, and the reader cannot resolve which holds.
3. **Any wording naming a keeper or a record** (*the surveyor's word*, *by the town's own reckoning of the ground*). The card is explicit — `source: (none) · standing SOURCE-UNRESOLVED`, **no citation licensed**, arm A13 refuses a holder here. S3 is unreachable from this pool until the holder census resolves it, and §24's ceiling of one citation per unit is not approached.
4. **Any wording carrying a perceiver** (*a stranger sees*, *a traveller finds*, *the town knows*). `may NOT: a standpoint`; the register card refuses a persona and an assigned reaction. The `[visitor]` angle survives as the outside vantage — the way in, what an approach crosses — with nobody standing in it. This is the one place a refuter may say the angle was thinned; the answer is that the tag is a shaping property, not a licence to assert a perceiver.
5. **Any wording taking the future or the season** (*would hold*, *will cost*, *in winter the passes*). `may NOT: a season, a future`; A2, R-DA-07, NL-6's census arm.

## 4. THE THREAD, THE SIBLINGS, AND THE MECHANICAL CHECKS

**THE THREAD (§1.4.1).** This pool is a **spine**, so the composer places it first and any modifier reads after it. Every wording therefore ends leaving at least two nouns a following sentence can carry forward — *the ground*, *the site*, *the country*, *the defender*, *the town* — and none ends on a construction that closes the passage off or turns outward. No wording is a turn outward, because a spine is never the passage's last sentence. Each is one sentence, so no internal thread joint is needed; the density law (§21.4) is met by compression inside the licensed fact, never by adding one.

**Arms A1 and A11 — neither restate nor contradict the spines this one sits beside.**
- *the readiness spine* (`STRONG` … `CRITICAL`) says what the town amounts to as a defended place. Nothing here asserts that the town is defended, well or badly: the faces assert only that the **ground** is on the defender's side. That is why 1 f2 says *the defender's ground* rather than *the town's*, and why no wording says well set, serious, thin or undefended.
- *the strategic-value spines* (`HIGH` / `LOW`) say whether the town is worth taking. Nothing here touches worth, prize, price or an army's season.
- *the `terrain EXPOSED` sibling* is this lens's other pool and the only rejected alternative R-DA-02 would license as a contrast. **The set uses no contrast at all** — no *rather than*, no *not X but Y*, no fronted antithesis — so the antithesis shape stays at zero for this pool and the contrast budget is left for the pools that need it.
- **One tension, stated rather than smoothed.** Where readiness reads `CRITICAL`, that spine says the town is effectively undefended while 2 f0 says part of what defends it is the site. Both are licensed, from different fields, and they are true together: the ground is carrying what little there is. §21.4 forbids trading the licensed line for a plainer one to soften it. Named for the refuter and the sitting.

**Mechanical checks, against the shipped detectors read verbatim at `proseFingerprint.js:113-149`** (evaluated by hand — the fence permits no script; a refuter should re-run them). Zero across the twelve on: a digit · a percent · an em dash · an exclamation · a question mark · a semicolon · a colon · a parenthesis · a quotation mark · `, which` (`whichTailRate` 0) · `will` / `shall` · `you` / `your` · `because` · `thereIsOpenerRate` 0 · `antithesisRate` 0 (no *not … but*, no *, not*, no *rather than*, no *less … than*) · `triadRate` 0 · `doubledAdjectiveRate` 0 (the pool contains no `and` at all) · `adverbsPerSentence` 0 (no `-ly` word) · `participialOpenerRate` 0 (no first word ends in `ing`) · `closers.pronounRate` 0 (no wording ends on `it, them, him, her, us, me, you, this, that, there, here` — the reason 2 f2 ends *it stands on* and not *stands on it*) · `sameOpenerAsPreviousRate` 0 (first words in row order: *The · Ground · Whatever · The · Part · What · Among · In · An · Force · Ground · The*, no two adjacent alike) · a citation · a slot-initial wording. Every wording is one sentence and carries `{settlement}` exactly once.

**Two figures declared rather than left for the walker to find.** (a) `closers.abstractNounRate` matches the `ence` suffix, so 2 f1's close on *defence* counts: **1 of 12 (0.083)**. R-DA-04's guard is a register-grain ceiling of 0.060 over a 2,914-sentence base, which twelve wordings cannot move; the face keeps its close because every alternative reintroduced either a built work or a pronoun. (b) `wordsPerSentence.neighbourVariation` over the twelve in row order is **0.185** by hand (mean length 9.8, mean neighbour delta 1.8), against R-DA-05's register-grain floor of 0.50 — a figure measured over the simulated reading sequence of 2,914 sentences and not satisfiable inside one twelve-wording pool whose every wording states one short standing fact. Reported as information (§16(5): a soft rule reports its distance), not claimed as passing.

**A11 / sibling distance.** The twelve first-two-word pairs are all distinct: *The way · Ground that · Whatever comes · The advantage · Part of · What the · Among what · In the · An attempt · Force brought · Ground stands · The country*. The head nouns spread over *way · ground · site · country · advantage · force · attempt*, and the verbs over *runs · lies · crosses · is · defends · gives · holds · stands · meets · has · counts*, so no two faces of one variant repeat a construction.

## 5. REFUSALS

**None.** All three variants were made lawful under the card and all three are written; no variant is banked, and the banked count for this pool stays at zero (§21.2).

## 6. FINDINGS CARRIED UP (not refusals; each a chair row)

- **F1 — the card's `predicate` line under-reports its own map.** It prints `=== Mountain` for a class of three (`Mountain`, `Hills`, `Forest` at `defenseStateProse.js:629-637`). A writer who trusted the card would have written a mountain set and shipped a false sentence on every hill and forest town — which is precisely how the shipped v1 came to say *the approach is narrow*. The card printer should emit the full key set for a pool whose map is many-to-one; the map is frozen and total against `TERRAIN_DATA` in both directions, so the set is there to print.
- **F2 — `move: (none declared)` on a spine that plainly takes PRESENT.** Every wording here is a PRESENT move by MOVE-GRAMMAR §1.2 row 1, the only move a standing configuration field licenses. This packet asserts that reading rather than leaving the column blank; if the projector expects a `MOVE:` line on spine pools, this pool has none today and one is owed.
- **F3 — the echo line's own warning applies here.** The card says the echo table is keyed on a producer-token root coarser than this pool's read, so `spine mounts 1` may be counting a sibling field of the same root. Not acted on; named because a second mount would change what a modifier may safely repeat after this spine.
- **F4 — the standpoint/angle tension is structural, not local.** The card's `may NOT: a standpoint` sits beside `angle: counterforce ledger visitor`. Three of this block's eight pools carry perceiver-shaped shipped rows for that reason. The chair may wish to rule once, block-wide, whether an angle tag licenses an outside vantage without a perceiver (this packet's reading) or whether the tags themselves want re-cutting.
