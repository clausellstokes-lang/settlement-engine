# critique-truth.md — the TRUTH critic on ARCH-COMPOSED-PROSE v1
**Seat: Opus 5 — Fable-unvalidated (the adversary). Lens: LICENSING · COHERENCE · TRUTH.**
Read-only throughout. Product read at `$SC/laneB6` = `3b1c0eaa5` (`git log --oneline -1`, executed); instruments at `$SC/skepINSTR` = `74a1aa0e8` (executed). Nothing written outside `$SC/arch-prose/`.

**Provenance.** CONFIRMED = a command I ran in this pass whose output I saw. CITED = a `file:line` I read in this pass. Every figure below is one of the two. No exemplar prose is quoted.

**What I executed.**
`sed`/`grep` reads of `defenseStateProse.js:725-800, 300-325`, `corruption.js:620-720`, `contradictions.js` (`grep -n interesting_tension`), `defenseGenerator.js:183-196, 458-478` (path `src/generators/`, not `src/domain/generation/`), `stateProseKernel.js:1-60, 150-170, 240-310, 310-360`, `legibilityRung.js:1-60`, `generalStateProse.js:170-185, 1700-1730`, `dossierMounts.js:45-95, 320-365, 475-495, 540-586` (`wc -l` = 586), `causeConjunctionContent.js:182-200`, the instruments' `moveGrammar.js:80-165`, `entryWalker.js` (`grep -n siblings`, `grep -in digit`), `grammarWalker.js:328, 610`, `prose-research/check-pair.mjs:55-80`, `prose-research/REGISTER-CARD.md` whole ·
`node arch-prose/variants-per-pool.mjs $SC/laneB6` → `pools 708 variants 2266 mean 3.20`, histogram `2:33 3:547 4:96 5:17 6:15`, angles `visitor 403 · ledger 681 · street 609 · counterforce 170 · threshold 96 · unfolding 230 · elder 70 · canonical 7`, `blocks with pools below four: 58 of 68` ·
`node arch-prose/draw-reroll.mjs` → flatten preserves the semantic variant on `64018/141600 = 45.21%`, two-level on `141600/141600 = 100.00%`, face-0 share `25.05%` ·
a node census over the six leaves for the three worked blocks → `DS-DEF-11 pools 5 variants 12 one-sentence 12 no-semicolon 3`; `DS-DEF-2 pools 26 variants 78 one-sentence 65 no-semicolon 59`; `DS-GEN-3 pools 42 variants 128 one-sentence 125 no-semicolon 108` ·
a node draw of the flagship walk → `WALLED-STRAINED` index 0 `ledger` semicolon:true which:false 18 words; index 1 `unfolding` semicolon:false **which:true** 23 words; `avalanche32(fnv1a32('w-2917::DS-DEF-11::WALLED-STRAINED')) % 2 = 1` ·
a node recount of `_c-occ200.out.json` → `N 200 · cells 56 · ge5 47 · lt5 9 · le10 14 · le5 9 · le25 28 · below-ten-towns 9 · on-every-town 4 · on-one-town 2`.

**Overall.** v1's *measurements* are exact — I re-ran four of them and every number came back to the digit, including the flagship walk's seed, index, seat and `which` tail. Its *licensing* is where it breaks: the three modifiers in the owner's own worked block cite relation edges whose endpoints are not the spine's field, the clause seat is specified twice and concatenates to a malformed sentence, and the composed unit constructs owner-gated level-2 orders the document never names. Fourteen findings below, five of them HIGH.

---

## F1 · The clause seat is specified twice and concatenates to a broken sentence — BREAKS · HIGH

**The claim.** §2.5's annex example authors the fragment as a row beginning with the connective:
> `1. \`[plain]\` and the muster behind it is thinner than the wage roll says`

§4.5's `consequence` clause forms are `` `, and` · `, so` · `; ` `` — the comma and the connective are *in the leaf*. §4.2 step 8: "Clause seat: the spine's FINAL sentence loses its stop; `, ` + the drawn joint + ` ` + the fragment + `.`". §2.4 key #4 gives the joint its own seeded draw.

**Evidence (arithmetic on the document's own three rules).** spine `…is sound` + `, ` + `, and` + ` ` + `and the muster behind it is thinner…` + `.` renders **`…is sound, , and and the muster behind it is thinner…`** — a doubled comma and a doubled connective. Even with the leaf's comma stripped it renders `…is sound, and and the muster…`.

**Why it is not a typo.** The two readings are architecturally opposed. If the fragment carries "and", the RELATION is fixed at authoring time, the connectives leaf is unreachable for the clause seat, key #4 draws nothing, and §2.2's B-CLAIM guarantee ("a connective may not add a claim") no longer applies to the word that carries the relation — it is inside a piece the walker treats as a claim-bearing entry. If the joint carries it, §2.5's example row is unlawful and every writer prompt built from it (car 8/9) will author the wrong shape.

**Fix.** State the seam contract exactly once, in §4.2, and make it a projector refusal: a `form: fragment` face MUST NOT begin with any member of the clause connective list nor with a comma; the joint list carries exactly one comma and one connective token; correct §2.5's example row to begin `the muster behind it…`. Add it to arm A9 (which already owns fragment form) with a planted control.

---

## F2 · The three flagship modifiers cite relation edges that do not touch the spine's field — BREAKS · HIGH

**The claim.** §4.5: "Arm A2 fails a `consequence` or `tension` joint whose pair has no row", where a row is `(fieldA, fieldB)`. §8.3's LICENCE CARD for `muster: short`:
> `relation: consequence ← edge: milUpkeepMult degrades scores.military (defenseGenerator.js:189-191)`

§6.3's `watch: bought (*)`: "`tension` (source d, edge `patronageSecurityDrag`)". §5.2 (d) requires "a sitting act citing the engine edge or generator rule per row".

**Evidence.**
- `src/generators/defenseGenerator.js:189-191` (CONFIRMED): `const milUpkeepMult = Math.min(1, 0.6 + (econOutput / 50) * 0.4); if (hasAnyDefense && milUpkeepMult < 1) { military = ... }`. The edge's endpoints are `econOutput → milUpkeepMult → scores.military`. **`walls` is not an endpoint.** The comment immediately above, at `:186`, says the floor is 0.6 because *built walls keep standing* and unpaid soldiers desert slowly — the code's own reasoning **exempts walls from this gate**. The spine under Phase 2 is `WALLED`, `reads` = {walls}. So the joint's pair is `(walls, economicGates.military)` and the cited edge does not carry it.
- `src/domain/corruption.js:702` (CONFIRMED) `patronageSecurityDrag` returns `{drag, covert, revealed}` from `compromisedSecurityInstitutions`; the docblock at `:695-700` names its endpoints as compromised security institutions → ONSET-side effective security. `walls` is not an endpoint here either.
- `country: pressed` cites an "axis pair walls × country, ratified at the sitting" — no edge at all yet, and §6.3 hedges "else `addition`".

**Consequence.** Under A2 as specified, all three of the owner's own block's joints FAIL. Under the fallback, all three become `addition`, whose only opener is empty (§4.5) — the composed unit degrades to two adjacent bare sentences, i.e. exactly the ten-assertions-in-a-row problem §6.5 identifies on DS-GEN-3. The 288 and 15,552 surface figures are priced with three openers; at `addition` they are 96 and 5,184, and the *relational* specificity the owner asked for is absent.

**Fix.** (1) A RELATION TABLE row is admissible only when the SPINE's declared field is one of its two endpoints — say so in §5.2 and make it A2's assertion. (2) Car 0 must PRINT the measured row count over the dossier-visible field set (how many `(fieldA, fieldB)` pairs sources (a)–(c) actually yield between two fields a desk reads) BEFORE any car authors a joint; §5.2 currently carries no such figure and §11 has no risk row for an empty table. (3) Re-price §6.3/§6.4/§6.5's arithmetic under `addition` as the honest floor, with the `consequence`/`tension` figures marked contingent on that count.

---

## F3 · `country: pressed` carries one relation across an attach set that spans both polarities of the spine's fact — BREAKS · HIGH

**The claim.** §6.3's Phase-1 table: `country: pressed` · relation `tension` · attach `STRAINED, UNWALLED-SMALL, UNWALLED-LARGE`.

**Evidence.** `defenseStateProse.js:747-757` (CONFIRMED): `WALLED-STRAINED` is reached only when `walls` is true; `UNWALLED-SMALL`/`UNWALLED-LARGE` only when `walls` is false. So one pool with one frozen `tension` attaches across `walls = true` and `walls = false`. A pressed country beside a standing wall and a pressed country beside no wall are not the same relation: one is (at best) opposition, the other is agreement — the exposure and the danger point the same way. A `tension` opener (`Yet`, `Even so,`, `Against that,` — §4.5) asserts contrariety the state does not hold on the unwalled half.

**This is v1's own diagnosis, unapplied.** §4.5's last paragraph identifies exactly this class ("The relation that flips with the spine's polarity"), rules that "a flipping relation is TWO pools with DISJOINT `attach` sets", and gives the projector a `whenA` predicate to check each attach set against. The document then ships a worked example its own projector would refuse.

**Fix.** Split `country: pressed` into two pools with disjoint attach sets (walled / unwalled) and a `whenA` on the ratified row; or, until source (d) ratifies anything, mark it `addition` and re-price §6.3's cell counts. Add a projector arm: every `attach` set of a relation-bearing modifier must lie inside one value class of the spine's polarity field, checked against `whenA`.

---

## F4 · Composition constructs LEVEL-2 orders, which are owner-gated under THE PROMISE — STRAINS · HIGH

**The claim.** §4.2 step 8 and Appendix A: "the unit's derived order is literally `spine.order ++ [modifier.move…]`"; §8.4: "the composed order is DERIVED (spine tag ++ modifier moves), so no tag vocabulary change (S20)".

**Evidence.** `skepINSTR/src/domain/prose/moveGrammar.js:90-99` (CONFIRMED): `LEVEL1_ORDERS` is closed at eight members, every one of length ≤ 2. `:272-274`: `orderIdOf` matches against `LEVEL1_ORDERS` only and returns null otherwise; `grammarWalker.js:328` then falls back to `classifyMoves(v.text).join('→')`, a synthetic label. `:102-113`: `LEVEL2_ORDERS` exists, and its docblock says level 2 is **"`changesShippedSurface: true` and OWNER-GATED under THE PROMISE until the fingerprint-inputs receipt exists (Part B §10 item 12), so nothing here draws anything."**

Arithmetic: a V2 spine (`[PRESENT, CONSEQUENCE]`) plus one modifier yields a 3-move order; the design admits up to two modifiers, so up to 4 moves. §2.2's modifier move set is {PRESENT, CONSEQUENCE, OBJECT, INSTITUTION, GEOGRAPHY, TRADITION} — which contains `LEVEL2_ORDERS.E3 = ['GEOGRAPHY','CONSEQUENCE','TRADITION']` exactly. So a composed unit can realise a named level-2 order the instruments declare owner-gated and undrawable.

**Consequence.** "No tag vocabulary change" is false: `orderIdOf` returns null for every composed unit above two moves, so arms F1/F2/F3 and B1–B3 lose their `orderId` classification precisely on the units composition creates. And the level-2 gate — an owner gate under THE PROMISE, matching the standing owner ruling that the level-2 draw stays the owner's — appears in no §13 row.

**Fix.** Add a §13 owner row: "composition realises level-2 move orders; the level-2 gate and its fingerprint-inputs receipt are the owner's." Extend `orderIdOf` (or a composed sibling) to classify against `LEVEL2_ORDERS` and print the share of composed units that fall outside both sets, at car 6 (the taste), before the sitting.

---

## F5 · Kernel law 2 is newly the composer's to keep and no arm keeps it; nothing forbids a covert-source modifier pool from mixing marks — BREAKS · HIGH

**The claim.** §0 step 5: "**The player's page over a bought watch is byte-identical to the page over an honest one** (kernel law 2)". §2.2: a turn "keyed on a covert source ⇒ `dm-only` on every face (W8)"; §6.3: `watch: bought (covert)` · "`dm-only` on every face (W8)".

**Evidence.** `stateProseKernel.js:22-27` (CONFIRMED) states law 2 in those words — a page over a covert seam must be byte-identical to a page over a state that lacks one. Today the kernel keeps it *within one pool*, per variant, at `:159-163`. Composition makes it a property of the ARRANGEMENT (which candidate is seated, at which rung, under the position budget), and:
- §8.4's gate table has **no audience row at all**. §11's guard is "the manifest's player face recorded and diffed; the 12 mixed pools pinned" — a drift detector, which pins whatever behaviour ships as the baseline and can never convict a leak that is present at record time.
- §2.3's `wordings?: string[]` are bare strings, so faces inherit the parent variant's `marks` structurally — the *face* half of W8 is safe. The *variant* half is not: nothing in §2.5's refusal table, §8.4's arms, or the projector requires that every variant of a pool whose `READS` path is a covert source carry `dm-only`. Twelve pools that mix `dm-only` with public variants already ship (v1's own census; consistent with `eligibleVariants` at `:264-268` filtering before `% eligible.length` at `:304`). One unmarked variant in a three-variant `watch: bought (covert)` puts the bought watch on the player's page one read in three.
- Car 11's proof line names "the audience arm on covert turns" — an arm defined nowhere in §8.4.

**Fix.** (1) A projector refusal: a pool whose `READS` path is on the census's COVERT-SOURCE list ⇒ every variant carries `dm-only`; a projector error otherwise. (2) A manifest control that can actually convict: a PAIRED-TOWN row — the same seed with the corruption impairment toggled — asserting the two player faces byte-equal across every mount. Without it §0's headline claim is PLAUSIBLE, not CONFIRMED, and should be labelled so.

---

## F6 · The register card forbids the clause seat flatly; §4.4 quotes that line to license one seat while the other seat breaks it — STRAINS · MEDIUM

**The claim.** §4.4: "the SENTENCE seat ← `tension`, `contrast`, `addition`, each its own sentence (R-DA-03 to the letter: a second fact takes its own sentence, never a tail)" — in the same bullet as "the CLAUSE seat ← `consequence` ONLY".

**Evidence.** `prose-research/REGISTER-CARD.md`, "What a sentence is for" (CITED, read whole): "A second fact takes its own sentence. A qualification is a sentence, never a tail." Wall 6 does **not** cover this: `moveGrammar.js:127` (CONFIRMED) reads `'QUALIFY never as a "which" tail; never a third sentence'` — it bans a *which* tail and a third sentence, nothing more. So the binding text is the card, and the card forbids the shape outright. A MODIFIER is by §2.2's own definition "keyed on ONE secondary fact" — a second fact — so putting it in a trailing clause is precisely what the card refuses. V2's licence ("state key + a STRUCTURAL-consequence field", `moveGrammar.js:92`) licenses one VARIANT realising two moves; it does not license joining a separate pool's fact as a tail.

v1 is not blind to this — §12 car 7 schedules "R-DA-03 + wall 6 read as 'two sentences, one joint' (S2)" as an amendment. But the amendment lands at car 7 and §0, §4.4, §6.3, §6.4 and §6.5 all compute as though it were already ratified, and the owner's ~22:30 rule was that everything follow all the voice work.

**Fix.** Mark every clause-seat figure CONTINGENT ON S2 and publish the sentence-seat-only fallback arithmetic beside it (on DS-DEF-11 Phase 2 that is 12 × 36 = 432, not 15,552). Put S2 to the owner as a §13 row in its own right — it amends the card, which is public-copy law.

---

## F7 · The fact budget is an accounting identity over a self-declared number, and v1 exercises the narrowing in its flagship — STRAINS · MEDIUM

**The claim.** §4.4: "`k ≤ 3 − |spine.reads|`, where `reads` is the spine's DECLARED claim set … the brief's DEPTH bound ('never four') made structural."

**Evidence.** §6.3 (v1's own text): "The census's `tests` per pool from the branch at `:747-757`: … THREATENED and QUIET {walls, gate (by exclusion), family} … Declared `reads`: … THREATENED/QUIET {walls, family} — two each, so `k ≤ 1` on every spine of this block today." `defenseStateProse.js:748-753` (CONFIRMED) shows the branch evaluating `militaryGate` before it reaches the family, so `tests` is three. Declaring two buys `k ≤ 1` where `tests` would give `k = 0`. The bound is therefore over a number the writer chooses.

The only named check on the semantic half is A0, listed in §8.4 as "**FAIL at projection**". A projector can compare sets (`reads ⊆ tests`); it cannot verify "the text claims every declared field and no other" — that is claim extraction from prose and belongs to a walker arm with a planted control, and none is specified.

**Fix.** `reads` defaults to `tests` (mechanically, from the census). Any narrowing is an explicit annex act carrying the sentence quoted and a chair ruling, listed in the car's receipt. Split A0 into A0a (projector: set containment, FAIL) and A0b (walker: claim reconciliation, FAIL, with a planted over-claim and a planted under-claim it must convict).

---

## F8 · The sentence-seam capitalisation rule covers one proper slot and breaks the rest — BREAKS · MEDIUM

**The claim.** §4.2 step 8: "Sentence seat: the spine text + ` ` + the drawn opener (may be empty; capitalised by the composer) + the modifier's sentence"; §0 step 7: "the composer owns the one capital at the seam because `fillSlots` cases nothing". §2.5's only face-initial refusal: "Sentence-form modifier faces may not open with `{settlement}` — wall 10 across the join".

**Evidence.** `stateProseKernel.js:280-289` (CONFIRMED): `fillSlots` substitutes verbatim and cases nothing. So with a non-empty opener the composer must DOWN-case the modifier's first character. §8.3's licence card types the bag per slot (`{settlement: proper, defwork: bare-common}`), so proper-typed slots other than `{settlement}` exist — `{faction}` on 13 blocks and `{institution}` on 10, per the brief's slot census. A sentence-form modifier face opening on any of them is down-cased into a broken proper noun after `Yet ` / `Even so, `.

**Fix.** Widen the §2.5 refusal from `{settlement}` to ANY slot the census types `proper` in that block's bag, and state the seam's casing rule as: the composer cases only a bare-common or non-slot first token; a proper-typed first token is a projection refusal, never a runtime down-case.

---

## F9 · The occurrence floor is presented as the bound and admits 84 % of the measured cells — STRAINS · MEDIUM

**The claim.** §6.1: "OCCURRENCE | a turn at ≥ 5 % of the sample (≥ 27 of 525) | C's executed distribution (56 cells; 9 below ten towns; 4 on every town)"; §4.4 calls it the answer to the owner's bounding danger.

**Evidence (recount of `_c-occ200.out.json`, CONFIRMED).** `N 200 · cells 56 · **ge5 47** · lt5 9 · le10 14 · le5 9 · le25 28`. Forty-seven of fifty-six cells — **84 %** — clear the 5 % floor. The floor excludes nine cells. v1 reports `47 at ≥ 5 %` once, in the §8 provenance list, and never carries it to §6.1 where the floor is set. Separately, the distribution is over SINGLE-fact cells, while the floor governs co-firing PAIRS whose rates are products — a category the document does not flag at §6.1 (it flags only that the six-desk figure is car 0's).

**What actually bounds turns** is `TURN_KEY_REGISTRY` (§5.3: tiers 1a–1c available, tier 2 REFUSED behind a 546,887 B import wall), not the floor.

**Fix.** Print `47 of 56 clear the floor` beside the number in §6.1 and §13 row 5, name the registry as the operative bound, and re-derive the floor from the PAIR distribution car 0 measures rather than from the single-cell one.

---

## F10 · The echo bound legalises one fact speaking two or three times on a page-set, reversing a shipped law without saying so — STRAINS · MEDIUM

**The claim.** §4.6 echo layer (iii): "≤ 3 mounts per page-set"; §6.5 works `purse: short` at "2 of ≤ 3 mounts per page-set"; §13 row 5 lists the number among those to veto.

**Evidence.** `dossierMounts.js:47-51` (CONFIRMED) states the shipped principle and its ONE written exception: the exception is lawful because "That is one fact reading at one position at one depth; **it is not one fact speaking twice.**" The register card's "What the record may do" (CITED): "Repeat the office's formula because it is the office's. The WORD may recur; the FACT must not." A ≤ 3-per-page-set bound is a licence for a fact to speak up to three times on one page-set, which both texts refuse.

**Fix.** §13 row 5 must state the reversal in the owner's own terms, not just the number. Car 0 must PRINT mounts-per-fact under the proposed bound over the 525 grid before the number is signed, so the owner vetoes a measured distribution rather than a ceiling.

---

## F11 · §4.6 repurposes `armC5` by changing its sibling population, with no re-validation control — STRAINS · MEDIUM

**The claim.** §4.6: "at the gate `armC5` runs with `ground.siblings` = every unit on the page-set for the sampled town, band-per-noun … the composed anti-vacuity control".

**Evidence.** `skepINSTR/src/domain/prose/entryWalker.js:121` (CONFIRMED) documents the field as "the OTHER variants of this pool cell". `:648-671` (CONFIRMED) is C5's contract: it "Fails ONLY on a CONFLICT: both siblings carry a value in one [noun's band]", and `:659` declares NOT-EXECUTABLE when the list is empty. That FAIL semantics is calibrated on *alternatives for one state*, which must agree by construction. Cross-block units on one page-set are about different facts and legitimately band different nouns; the arm's FAIL condition has never been validated on that population, and `:630` records that an earlier cross-sibling run "reported 42 'contradictions', of which the great majority were" false.

**Fix.** Leave C5 on its documented population. Name the cross-block check as a NEW arm (say C7) with its own planted convictions — one true cross-block conflict it must convict, one innocent cross-block pair it must pass — and let it report before it gates.

---

## F12 · A worked example attaches a restatement that the structural guard cannot see and the lexical guard does not yet exist — STRAINS · MEDIUM

**The claim.** §6.4: `stores: short` attaches to `granary AND hospital`, **`NO reserves, hospital present`**, **`NO reserves, NO medical provision`**; the row's cells go 5 → 11 on that arithmetic.

**Evidence.** §4.6's structural guard is field-based: "a modifier's one field may not be a field the attached spine's branch `tests`". The disaster branch tests `granary` (a building); the modifier reads `foodSecurity.label` (a stock) — different fields, so the guard passes by construction. But "there are no reserves" beside "the stores are short" is a restatement in meaning: the reader meets one fact twice, which is the register card's "the FACT must not [recur]" again. The only guard for it is arm A1's lexical half — new, unbuilt, and specified only as "`typedFactsOf` overlap on a governed noun with the same band class", which "reserves" and "stores" may or may not resolve to.

**Fix.** Hold the two `NO reserves` attach sites until A1 convicts a planted `no granary` + `stores short` pair on real text. Add a freeze-time guard the projector CAN run: refuse an attach where the spine's pool-key string and the modifier's pool-key string name the same civic object class, from a closed class list the census emits. Re-price §6.4's 5 → 11 under the reduced attach set.

---

## F13 · A modifier landing re-verdicts the block's existing spine variants, and car 9's acceptance samples — STRAINS · LOW-MEDIUM

**The claim.** §12 car 9 acceptance: "per block: the manifest diff proves ADDITIVE; the sampled composed walk; the repeat census …; no round past the second".

**Evidence.** `prose-research/check-pair.mjs:57-59` (CONFIRMED): `bandSiblingsOf` narrows a pool's siblings to the same axis via `axisOf`, which takes the leading LOWER-CASE word run of the pool key and returns `''` when the key opens on a capital — and every shipped spine key does (`WALLED-STRAINED`, `Invasion & War: …`). With no derivable axis it falls back to "A8's letter — every band of the same block". Modifier keys are lower-case by §2.5's idiom (`muster: short`). So adding modifier pools to a block enlarges the sibling set used by the R4 arm (`:75`, "CUT a word that names a SIBLING pool key") for every existing spine variant of that block, which can flip an already-passed verdict. A SAMPLED walk can miss it.

**Fix.** Make a modifier landing re-walk its whole block exhaustively (`check-pair` + `walkEntry` over every existing variant of the block), not by sample; the sample stays for the composed units.

---

## F14 · The no-digits wall is never named in the document — STRAINS · LOW

**The claim.** The brief's law list names "B-CLAIM / sibling coherence / no digits / no em dashes in prose" (`ARCH-BRIEF.md:43`); the register card forbids a digit outright.

**Evidence.** `grep -in digit ARCH-COMPOSED-PROSE.md` → **zero hits** (CONFIRMED). §11's refusal sentence names "no `which`, no em dash, no third sentence" and omits digits. §2.5's refusal row for `## §7b THE STATE CONNECTIVES` names "a relation outside the four; an em dash; a `which`" and omits digits. The wall does hold, but only by inheritance nobody states: `entryWalker.js:294-340` (CONFIRMED) is arm A4 — "A DIGIT is banned outright (A4) whatever it counts" — over the walked entry, which S17 makes the composed unit; and `check-pair.mjs:69` (CONFIRMED) checks `DIGIT in AFTER`, `PERCENT in AFTER`, `EM DASH in AFTER` for every face. So a digit in a connective phrase is caught at the gate and never at projection.

**Fix.** One sentence in §8.4 naming A4 and `check-pair:69` as the digit channel, and a digit/percent refusal added to §2.5's `§7b` row so the connectives leaf fails at projection like the rest.

---

## F15 · The two-level roll's headline number is tautological — HOLDS with a caveat · LOW

I re-ran `draw-reroll.mjs`: flatten `64018/141600 = 45.21 %`, two-level `141600/141600 = 100.00 %`, face-0 `25.05 %` — every figure CONFIRMED. But the 100.00 % is true by construction: the two-level roll leaves the parent key and its modulus untouched, so the semantic variant cannot move. Only the flatten's 45.21 % (equivalently, 54.79 % of reads changing angle and claim set) is an empirical finding, and it is the one that decides §13 row 2. **Fix:** say so in §13 row 2, so the owner is signing on the measurement and not on a pair of numbers that look like two measurements.

---

## F16 · Citation drift — LOW

- §0 and §4.1 cite `dossierMounts.js:581-587`, and §8's provenance list cites `:578-592`; `wc -l` on that file is **586** (CONFIRMED). The content is right — `drawnAtMount` nulls `sentence` and `provenance` on a non-sentence mount at `:583-586` — but the ranges over-run the file.
- §4.4 cites `moveGrammar.js:90` for "PRESENT → CONSEQUENCE is the register's own V2 order"; `:90` is the `LEVEL1_ORDERS` declaration and V2 is at `:92` (CONFIRMED).
- §8's provenance list places `defenseGenerator.js` without a path; it is `src/generators/defenseGenerator.js`, not under `src/domain/generation/` (CONFIRMED by `find`).
**Fix:** re-derive the three ranges at the tip before the sitting; a receipt's line numbers are read by writers who will not re-check them.

---

## What I checked and found sound (so the chair knows the attack was real)

| claim | verdict | how |
|---|---|---|
| §0's whole flagship walk on seed `w-2917` | **HOLDS, exact** | `WALLED-STRAINED` has 2 variants; `avalanche32(fnv1a32('w-2917::DS-DEF-11::WALLED-STRAINED')) % 2 = 1`; index 1 is the `unfolding` variant, carries **no** semicolon (clause seat open) and **does** carry a `which` tail. Every detail of §0 step 3 confirmed by execution. |
| the ten-rung correction at line 10 | **HOLDS** | `generalStateProse.js:177` `SCORE_AXES` is five; `:1714-1725` composes four status rungs + five axes + one food band = **ten**, and the comment says "DS-GEN-3's ten lenses". v1's correction of the reader maps is right. |
| "four classed `interesting_tension`" against read-explanations' three | **HOLDS** | `grep -n interesting_tension src/domain/contradictions.js` → classifications at `:142, :194, :270, :314`. |
| the `absent` semantics of `economicGates.military` | **HOLDS** | `defenseGenerator.js:467` emits `military` only under `hasAnyDefense`; `wallRationalePoolKey` (`:748`) requires `typeof === 'number' && Number.isFinite` before `< 1`, so an absent gate falls through to the family branch and never reads as 1.0. The `present AND < 1` predicate rule is correct and necessary. |
| the three worked blocks' censuses | **HOLDS, to the digit** | DS-DEF-11 5/12, all one sentence, 3 free clause seats (0/1/1/0/1 per pool), words 15–26, angles as listed; DS-DEF-2 26/78, 13 multi, 59 free clause, 65 free sentence; DS-GEN-3 42/128, 108 free clause, 125 free sentence. |
| corpus totals, histogram, angles | **HOLDS** | 708 pools · 2,266 variants · mean 3.20; `2:33 3:547 4:96 5:17 6:15`; angle counts exact. |
| `check-pair.mjs:70` is the LONGER arm | **HOLDS** | line 70 is `if (words(p.after) > words(p.before)) r.push('LONGER: …')`. |
| glance rows cannot leak `pieces[]` | **HOLDS** | `drawnAtMount` returns `{...rung, sentence: null, provenance: null}` for any non-sentence mount. |
| striking `MOVE: ABSENCE` | **HOLDS, and is better founded than v1 says** | the register card independently requires an absence be "flat; never as the opener; **replacing a sentence, never added**" — a modifier is by definition added, so the card refuses absence modifiers on its own terms, beside R-DA-08 and wall 3. Worth citing. |
