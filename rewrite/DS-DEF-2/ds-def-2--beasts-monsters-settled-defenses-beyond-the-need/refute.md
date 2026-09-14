REFUTE — DS-DEF-2 · pool `Beasts & Monsters: settled, defenses beyond the need`
seat: opus (refuter) · test: ADDENDUM 14 as the Fable sitting re-cut it (ADDENDUM 18, CONTRADICTION-TABLE §V)
sitting 2 (re-refute). The prior sitting's packet stood at this path; I read it, VERIFIED IT AGAINST
THE ENGINE rather than ratifying it, and kept its three charges. Two things are new this sitting and
both are mine: the WITHHELD row's field is now NAMED, and the citation gate is MEASURED, not asserted.

rows read: laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md `### DS-DEF-2` — 3 spines + 35 faces,
  extracted and diffed against draft.md: IDENTICAL (12 · 12 · 11).
instruments: card.md (whole) · speakers.md · CONTRADICTION-TABLE.md §V · and, read in the dock:
  defenseStateProse.js:419-445 · defenseGenerator.js:176-192 · faceSources.js:35-37,139-141,178-180 ·
  moveGrammar.js:200-232 · tests/lint/proseMoveGrammar.walker.test.js:826-918.
  ⛔ NO TEST WAS RUN AND NO BYTE WAS WRITTEN IN ANY DOCK (the fence). Where I say a gate holds, that is
  a source-read prediction; where I say a shape is present or absent in the rows, I executed the match.

A FACE IS LAWFUL UNLESS IT CONTRADICTS THE RECORD. Silence is permission. Unlicensed is not a fault.
I hunted contradictions only. 31 of 35 faces stand.

──────────────────────────────────────────────────────────────────────────────
WHAT THIS SITTING VERIFIED IN THE ENGINE (the prior packet asserted these; I read them)
──────────────────────────────────────────────────────────────────────────────
V-A  THE KEY DOES NOT READ THE FORCE — verbatim, `defenseStateProse.js:419-422`: "`settled country,
     perimeter` deliberately does not consult the force at all". `beastsRowSituation` returns this pool
     on `perimeter` alone (:436). CONFIRMED — and it is the ground under v3 f10.
V-B  ONE PURSE, AND THE WALL'S KEEPING IS INSIDE IT — `defenseGenerator.js:181-192`, the gate's own
     comment: "Economic-upkeep gate (garrison wages, wall maintenance)"; one multiplier
     `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)`; floor 0.6 so "built walls keep standing and
     unpaid soldiers desert slowly"; and the exempt part is named — "The community baseline (armed
     households, terrain alarm) is unpaid and exempt". THE WALL'S KEEPING IS NOT THE EXEMPT PART.
     CONFIRMED — and it is the ground under v2 f12.
V-C  THE MUSTER IS SEATED ON A LIVE FIELD — `faceSources.js:139` seats `muster` on
     `forces.militia.present`, and card §6 measures `institutions[bucket=militia]` at 38 pulse writers.
     `standingDefenseForces` carries 0 DIRECT writers but derives over that live bucket, so the muster
     is LIVE at the field grain. A perfect over it is refused unless it is the key's own read — and by
     V-A it is not. CONFIRMED.
V-D  THE TABLE ROWS THE PRIOR SEAT CITED ARE REAL AND SAY WHAT IT SAID — F2-05 (line 259, "no longer"
     VERBATIM on the bar list), F2-09 (263), F1-34 (120, and "ease at the town's own grain is free"),
     F4-02 (287, "TWO PURSES SPLIT AT BIRTH — the wall kept and the muster not"), F4-19 (304), F1-24
     (103). CONFIRMED. Two §V rows TIGHTEN the charges and the prior seat did not cite them:
       V-07 (407) STRUCK ENTIRE — "the kept half charged a TRUE sentence: the military upkeep gate DOES
         pay the watch". So v2 f7's late wage on the round is MODEL-AFFIRMED. Its PASS is stronger than
         the prior packet claimed, not weaker.
       V-04 / §R-9 (403) — "a thinning muster is licensed as a STANDING STATE only ('the muster is
         thin', 'posts stand unfilled'); never a course". This is the exact licence v3 f10 steps
         outside of, and it is also the shape of the cure.

──────────────────────────────────────────────────────────────────────────────
⭐ THE CITATION GATE — MEASURED, NOT ASSERTED (the batch-3 packet-killer; clean here)
──────────────────────────────────────────────────────────────────────────────
The chair's standing warning is that the PROVENANCE shape in `moveGrammar.js` raised a corpus ceiling
from 7 to 8 in batch 3 and THE GATE REFUSED THE WHOLE PACKET. The prior sitting wrote "No citation
spent" without measuring it. I measured it.

THE GATE: `tests/lint/proseMoveGrammar.walker.test.js:853` — `expect(cited.length).toBe(7)` over
`loadStateLeaves()`, the LIVE corpus, repeated at :917. It is an EXACT pin, not a shrink-only ceiling:
a 36th citing variant reds it and a 6th reds it too.

THE MEASUREMENT: I ran the detector's own regex (`moveGrammar.js:225`, copied verbatim) over all 38
current rows and over the 3 shipped rows at `f2da5a3ee`.
    PROVENANCE — current 0 · shipped 0.   ⇒ THIS POOL SPENDS NO CITATION. The gate does not move.
The near miss is real and worth the chair's eye: the detector carries a VERB LIMB
`the elders (?:say|hold|remember|keep)\b`, and three faces are within one letter of it — v1 f11 "One of
the elders says", v2 f12 "One of the elders takes it", v3 f11 "The elders take it". All three survive
ONLY on the trailing `\b`: "says" and "take" are not "say", "hold", "remember" or "keep". A curer who
normalises any of these to "The elders say …" SPENDS A CITATION AND REDS THE GATE. Say so in the cure
brief. Likewise `from the road` is a limb and the pool says "on the road" / "off the road" six times
and "from the road" never — that is a hair's breadth too.

THE WIDER MOVE CENSUS (current vs shipped at f2da5a3ee), since the rule's general form is a ceiling:
    CONSEQUENCE 9/0 · INSTITUTION 4/0 · PERSON 3/0 · HISTORY 1/0 · TRADITION 1/0 · OBJECT 0/1
    ABSENCE · CONTRADICTION · PROVENANCE · OPEN · GEOGRAPHY — 0/0 both sides.
Five shapes are NEW to this pool. I read every exact-integer pin in the walker to see whether any of
them gates a shape other than PROVENANCE, and none does: :168-171 (`shipped.*`) measure the frozen ref
f2da5a3ee and cannot move; :468-469 and :761 pin `level1.untagged` to the corpus length itself, which is
self-referential; :762 pins `spread.pools` to 786 and this pool ALREADY EXISTS, so faces added under an
existing key add no pool. ⇒ the five new shapes are ungated. PLAUSIBLE (read, not executed — the fence
bars running the suite in the dock); the PROVENANCE zero is CONFIRMED by executed match.
The PERSON hits are all one construction — `whoever (holds|sits)` firing on the three `[gate]` faces'
"Whoever holds the way through". That is the brief's own prescribed gate-source wording, so it is the
law's shape and not the writer's invention. Recorded so the chair is not surprised by it in a census.

──────────────────────────────────────────────────────────────────────────────
PER-FACE VERDICTS  (variant · face · verdict · floor · field · quote · finding · cure)
──────────────────────────────────────────────────────────────────────────────

v1 f1  hall      PASS  —  a source's account of who bears the charge; the guild half disagrees, which is licensed.
v1 f2  guild     PASS  —  "say openly" is ruling 20's plain replacement for "were public in stating"; an opinion is never a finding.
v1 f3  stranger  PASS  —  a reported account of the road, not a claim about the country. Not F1-34: it says what the drover saw, not that nothing is out there. It also states the pool key's own fact (:94 "substantially more than the threat level requires").
v1 f4  court     PASS  —  hasCourtSystem seats at the required Town/City hall (card §5 ⚠); a boundary-and-owed-work dispute is the civil arbitration the engine records (Town hall, Dispute arbitration p0.8).
v1 f5  tavern    PASS  —  "every household pays" is the carter's account, and the community-baseline exemption (defenseGenerator.js:186-188) is about the SCORE, not about who is taxed. "Every" is a distributive universal, not a band magnitude.
v1 f6  watch     PASS  —  tagged `[watch]`, so it draws only where the watch bucket resolves; `Town watch` carries Night patrol p1.0, so a round along the works is the row's own service. "has built" is a perfect over the WORKS, which are the key's own read and carry the §V.0 licence.
v1 f7  register  PASS  —  a comparative of upkeep, not a denial of Burial (p1). Floor 3 clear: "a local priest" is indefinite and is not the tier's High Priest. (Craft note below on the class word.)
v1 f8  garrison  PASS  —  boots are not fabric, so F4-01's decay bar does not reach them; it locates the garrison's wear, it does not deny Defence services (p1).
v1 f9  market    PASS  —  the lee of the works is the card's own domestic vein (§9); no magnitude, and it is not one of the four placements §2c bars.
v1 f10 muster    PASS  —  habitual present throughout; `Citizen militia` is "part-time soldiers with their own tools", so the tools are the row's own words. No wage predicated (V-09 clear).
v1 f11 elders    WITHHELD  floor 2 (F2-09 via §V row V-05; F2-05's comparative-against-a-past)
        field:  THE FIELD IS NOW NAMED, and the prior sitting said it could not name one. §V row V-05
                (CONTRADICTION-TABLE:405) rules: "on a pool whose key reads no history field ALL
                AGE-FLAVOUR is F2-09". This key reads `config.monsterThreat` and `institutions[bucket=
                walls]` and no history field (defenseStateProse.js:436, :444); F2-09's ground is
                `historyPreservation.js:1-30`, "Reroll history replaces `settlement.history` wholesale".
                The town's age is free across the preimage, and `historyGenerator.js:848` prints
                "newly founded" at age 0.
        quote:  "nobody now asks where the custom came from"
        finding: two faults in one clause, neither individually decisive. "now" is a comparative-against-
                a-past (F2-05), and "where the custom came from" is age-flavour on a key that reads no
                age: on a newly-founded town the custom came from last year and everyone knows. The
                defence is real and is why I withhold rather than charge — the clause asserts only that
                nobody POSES the question, which is a present-tense observation, and a source's opinion
                is free. I am not confident enough to charge it and the burden is mine. THE CHAIR SHOULD
                RULE IT: the fault, if it is one, is one word, and the cure costs nothing.
        cure:   drop the adverb — "…and that nobody asks where the custom came from."
v1 f12 gate      PASS  —  the gate source is seated by GATE_NAMES; "barred at dusk" is the brief's own lawful example shape, a habitual and not a rate.

v2 f1  hall      PASS  —  agrees with its own spine; the tavern half carries the disagreement.
v2 f2  tavern    PASS  —  "met last" is an ordering complaint, not a denial that the purse meets it.
v2 f3  stranger  PASS  —  no magnitude, no sum; the cost is named without being counted.
v2 f4  court     PASS  —  a neighbour-brought mending suit is the civil arbitration hasCourtSystem records.
v2 f5  guild     PASS  —  a naming dispute about a charge, not a denial of the charge.
v2 f6  market    PASS  —  the stallholders' account of incidence; no share word, no proportion.
v2 f7  watch     PASS, AND STRONGER THAN THE PRIOR PACKET HAD IT  —  §V row V-07 STRUCK the old bar
        ENTIRE, in these words: "the kept half charged a TRUE sentence: the military upkeep gate DOES
        pay the watch (= F4-19)". `hasAnyDefense` counts `hasWatch` (defenseGenerator.js:177-178). So a
        thin or late wage on the round is the engine's own model. I tested it a second way, against its
        own co-rendering spine: the spine claims SCOPE ("one purse meets the keeping of that work AND
        whatever else the town's defence costs"), not sufficiency, so "reaches the round late" does not
        contradict it. The shortfall is bounded (floor 0.6) and this face does not total it. See W-2.
v2 f8  register  PASS  —  "the register" is the closed vocabulary's SOURCE word, not a cited record; it does not match the PROVENANCE kind limb (measured). The parish register is licensed wherever a church stands, and the source seats only there.
v2 f9  garrison  PASS, AND IT IS THE CLOSEST CALL IN THE POOL  —  pride against grudging is a FEELING sized to the source's standing, which ruling 18 licenses. F4-02 bars an ALLOCATION ("the wall kept and the muster not"), and this face predicates two ATTITUDES and never says the wages are short or the wall preferred. It passes on silence-is-permission. But it is the one face a later seat will re-open, because the plain reading a game master takes is the split purse. The chair should know that it stands by a hair and by the letter.
v2 f10 muster    PASS  —  `Citizen militia` / `Household levy` carry no pay in the catalog ("no pay", institutionVocabulary.js:153-154), so "costs the town nothing" is the row's own fact; V-09 is satisfied, not breached.
v2 f11 gate      PASS  —  a toll funding the keeping names the ONE purse's inflow, not a second purse. It is the brief's own licensed shape ("the one purse is filled at the gate and spent by the hall").
v2 f12 elders    FAIL  floor 1 (self-contradiction on the page) + floor 4 (F4-02)
        field:  its own co-rendering spine, variant 2 `[ledger]`: "One purse meets the keeping of that
                work and whatever else the town's defence costs." — and behind the spine,
                `defenseGenerator.js:181-192`, whose own comment reads "Economic-upkeep gate (garrison
                wages, wall maintenance)", with `hasAnyDefense` true on every town of this preimage
                (walls are fixed by the key). THE EXEMPT PART IS NAMED IN THE SOURCE AND IT IS NOT THIS
                ONE: "The community baseline (armed households, terrain alarm) is unpaid and exempt —
                only the funded portion above it is gated." The wall's keeping is the funded portion.
        quote:  "the keeping is work owed and not work paid for"
        finding: THE RECORD IS THE SPINE AND THE MODEL BEHIND IT, and the face is the thing that yields.
                A spine co-renders with every face of its variant, so this face prints directly beneath
                a sentence saying one purse meets the keeping, and then denies the keeping is paid at
                all. I tested it against the chair's GENERAL FORM and it is not rescued: the general
                form needs the face's OWN neighbouring sentence to FORCE the lawful reading, as
                "The households make up the difference" forces it in the ruled BILL. Here the second
                clause ("written down nowhere") is compatible with both readings and forces neither,
                while "not work paid for" has only the one. F4-02 is the named row. No source asserts a
                field's opposite, and this pool seats no compromised candidate (card §2c: the hall,
                watch and court table does not mark this pool).
        cure:   keep the custom, drop the denial — "One of the elders takes it that the households mend
                their own stretch before the hall is asked, and that what is owed is written down nowhere."

v3 f1  tavern    PASS  —  a source's judgment of another source's report; opinion.
v3 f2  watch     PASS  —  a claim about what reaches the watch, not a denial of any row's service.
v3 f3  hall      PASS  —  the hall defending its purse is the card's own interest for it.
v3 f4  court     PASS  —  boundary and not defence is exactly the card's stated court interest.
v3 f5  register  PASS  —  Burial fires at p1.0 on every preimage tier, so a stranger buried is affirmed, not denied; habitual, no event narrated.
v3 f6  gate      PASS (lawful; see CRAFT)  —  no floor reached.
v3 f7  market    PASS (lawful; see CRAFT)  —  no floor reached.
v3 f8  guild     FAIL  floor 2 (F2-05)
        field:  no licensing read exists. §V.0 floor 2 licenses the perfect and the durative over THE
                POOL KEY'S OWN READS (`config.monsterThreat`, `institutions[bucket=walls]`) and over a
                ZERO-WRITER read (card §6 census). The guilds' stance is neither: the faction roster is
                moved under `src/domain/worldPulse/` (`applyWorldPulseFactionRoster.js:146` and 37 more,
                card §6). F2-05's ground is the `ageBands.js` pin, `HISTORICIZE_BAND = 'years-past'`.
        quote:  "the trades no longer argue the keeping and have not agreed to it either"
        finding: "no longer" is on F2-05's named list VERBATIM (CONTRADICTION-TABLE:259), and "have not
                agreed" is a second perfect in the same sentence. Both assert a prior state the engine
                does not hold: a birth-time state carries no origin stamp, so it can bear no temporal
                register. This row is decidable from the grammar alone and needs no world model, which
                is why I am charging it at full confidence. (The card's §9 flavour note — "the town
                stopped noticing years back" minus the dating — is the marker's, and §V governs where
                it and an earlier row disagree.)
        cure:   present tense, same grievance — "A guild factor holds that the trades pay the keeping,
                and that the hall takes their silence for consent."
v3 f9  garrison  PASS  —  belonging weighed against the purse; a feeling, reported. The clever last beat is on the selector's veto list, never a refuter's finding.
v3 f10 muster    FAIL  floor 2 (F2-05, the perfect over a live field)
        field:  `institutions[bucket=militia]` — LIVE, 38 writers (card §6;
                `applyWorldPulseFactionRoster.js:146`, `blockadeTransport.js:72`,
                `calamityKernel.js:290`, `:399` +34) — reached through `faceSources.js:139`
                (`forces.militia.present`). And it is NOT one of this key's own reads: the engine says
                so in its own words at `defenseStateProse.js:419-422`, "`settled country, perimeter`
                deliberately does not consult the force at all", the key fixing `monsterThreat` and a
                standing walls row only (:436, :444).
        quote:  "they know their places well enough and have not been put in them"
        finding: this is the brief's own licensed example shape ("nobody has been asked to stand on the
                works") aimed at the FORCE — and the brief licenses that shape only "where the works AND
                THE FORCE are FROZEN reads". Here the works are the key's own read and carry the
                licence; the force does not. A pulse writer can seat a militia row after generation, and
                a muster that arrived last year cannot carry a perfect saying it has never been called
                out. The claim outlives a state the key does not hold. §V row V-04 / §R-9 names the
                licensed alternative exactly: a muster's condition is available as A STANDING STATE and
                never as a course.
        cure:   habitual, and land on what IS — "One of the muster says they know their places on the
                works, and that the knowing is the whole of what the town asks of them."
v3 f11 elders    PASS  —  the households bearing the mending is the chair's own canonical BILL construction (the state, then who pays); "least to spare" is a comparative of means, not a magnitude.

SPINES (all three): PASS.
  v1 `[counterforce]` — "quiet" sits inside the engine's own ceiling word for heartland, "minimal
     creature activity" (threatAssessment.js:96), which prints on the same tab. Not F1-34: it does not
     say nothing comes out of the country, and F1-34's own row frees "ease at the town's own grain".
     {settlement} appears in this one unit and in no `[face]` row — measured: 1 in spines, 0 in faces
     (ruling 12 satisfied).
  v2 `[ledger]` — states the one-purse model straight; a bare recorded fact in the archiver's own hand,
     no self-citation (ruling 40 satisfied).
  v3 `[visitor]` — carried by a source rather than bare, which ruling 29 licenses; the three spines take
     three different shapes.

SOURCE CHECKS (rulings 13, 15): twelve sources, every one in the closed vocabulary and seated by the
card's own table — hall, guild, court, tavern, market, register, watch, garrison, muster, gate
(conditional), stranger (universal), elders. No crown's assessor, no mercenary, no charter hall. Both
halves of every pair are different sources. No `[compromised]` tag anywhere, which is CORRECT: card §2c
prints the closed table (hall · watch · court) and says of each "this pool is NOT one of them". No named
office speaks. No covert fact on a player face; no dm-only face in the pool at all. Four pair kinds
check out as written: v1 hall/guild disagree, v2 hall/tavern disagree, v3 tavern/watch disagree, v3
gate/market reinforce.

MECHANICAL (executed over the extracted rows): em dash 0 · exclamation 0 · digits 0 · semicolons 0 ·
contractions 0 · {settlement} 1 (spine only) · no {band}/{route}/{defmaterial}, so no variant is dropped
by anchored liveness and no material word is chosen for the pool (V-06 clear).

──────────────────────────────────────────────────────────────────────────────
CRAFT — POOL GRAIN:  DULL
──────────────────────────────────────────────────────────────────────────────
Twelve speakers, real stakes (who bears the keeping, and whether anyone can say what it buys), and a
genuine dispute in every variant. This is NOT a camera with no speaker and it is NOT duller than the
three shipped rows it replaces. It fails on MEASURE, not on design — and three of the four measures are
ones the chair has already had measured against a previous batch, which is the reason the verdict is
DULL rather than PASS-with-notes: the same failure survived a cure once already.

THE COLLAPSE, NAMED (every figure below executed over the extracted rows, not eyeballed):
 (1) ONE CONSTRUCTION. 25 of 35 faces are the attributed two-clause compound — "[source] says/holds A
     and B" — with the joint carrying the whole of the design. v2 runs 10 of 12 that way, v1 9 of 12.
     Read down a variant and the page has one rhythm.
 (2) THE NEGATION LANDING, MEASURED: 18 of 35 faces land their final clause on what is NOT there
     (v1 5/12, v2 7/12, v3 6/11) — 51%, against the stated bar of one third (11 of 35). This is the
     batch-4 failure rate almost exactly (16 of 27), and it is the measure batch 4's cure did not move.
 (3) THE SAME FEW NOUNS. "the keeping" carries 9 faces and a spine; "the works" carries 13 faces and a
     spine. Between them, 22 of 35 faces land on one of two nouns.
 (4) A PAIR THAT IS ONE SENTENCE TWICE. v3 pair 2 is a paraphrase with two nouns swapped: "the only
     people who look up at the works are the ones arriving" / "the only people who stop in front of the
     works are the ones with nothing to buy". A reinforce pair may agree; it may not be the same sentence.
 (5) THE SELECTOR'S ATTRIBUTION VETO IS ALREADY BREACHED: v1 f10, f11, f12 run "says" three times in a
     row (muster, elders, gate).
 (6) ⭐ NEW THIS SITTING — THE OPENER RULE IS BREACHED IN v2, AND THE PRIOR PACKET MISSED IT. The
     mechanical law is that no face may open on the same three words as a sibling. v2 f7, f9 and f12 all
     open "One of the" (watch, garrison, elders). Three faces, one variant, one opener. Measured across
     all three variants: v1 none, v2 {"one of the": 3}, v3 none.
 (7) A SPINE-FACE ECHO: spine 3 "he saw nothing on the road" against v3 f5 "a stranger who dies on the
     road", and "a stranger's account of the road" in BOTH halves of pair 5.
MINOR, not a floor and not counted in the verdict: v1 f7 writes the ROLE ("a local priest") where ruling
25 says keep the CLASS WORD until car 18l lands, and the closed vocabulary for this source is "the
register" or "the sexton". It is the projector's business, not a finding of mine, but the curer should
normalise it. v1 f6's "hen-coop" is domestic furniture I cannot check against the eleven culture
profiles; I default to PASS because I cannot name the profile field that denies it.

──────────────────────────────────────────────────────────────────────────────
WIRING (the face stands; the seam is the chair's)
──────────────────────────────────────────────────────────────────────────────
W-1  THE CARD IS NARROWER THAN THE LAW ON THIS POOL'S RICHEST VEIN. card.md §8 rules that "'the works
     have stood unasked' is NOT [lawful], the walls bucket carrying 38 pulse writers". CONTRADICTION-
     TABLE §V.0 floor 2 licenses the elapsed course over THE POOL KEY'S OWN READS *as a ground separate
     from* the zero-writer ground — and `institutions[bucket=walls]` IS this key's own read (`perimeter`,
     defenseStateProse.js:436). §V governs where it and an earlier row disagree, so the durative over the
     wall is LICENSED and the marker's card refused it. No landed face uses it, so nothing failed for
     this — but the pool's single best vein (a kept thing with no occasion) was fenced off from the
     writers by the instrument rather than by the law. The next card for a perimeter key should print the
     key's own reads as a LICENCE COLUMN.
W-2  THE PURSE FACES PRINT BESIDE "Full pay". v2 f7 and v2 f9 draw on every economic state, because this
     key reads no economic gate. On a town with econScore >= 65, `defenseDisplay.js:221` prints "Full
     pay, maintained equipment, reserve capacity." on the same tab. The denier is engine PROSE projecting
     `defenseProfile.scores.economic`, so the faces STAND and this is a seam, not a contradiction — but
     the pool has no way to see the gate, and DS-DEF-11's WALLED-QUIET / WALLED-STRAINED split turns on
     exactly that field. If the chair wants the purse vein at all, it wants a key that reads
     `economicGates.military`.
W-3  THE QUIET SPINE PRINTS BESIDE MONSTER PRESSURE. F1-34 is real and spine v1 stays inside the engine's
     ceiling word. But `heartland` only multiplies threat DOWN (×0.3), so a monster_pressure strain can
     stand on these towns and `safetyProfile.js:197` prints "Monster pressure from the surrounding region
     has changed how the settlement operates after dark" beside `threatAssessment.js:96`'s "Safe
     heartland with minimal creature activity". THE ENGINE ALREADY CONTRADICTS ITSELF ON THAT PAGE,
     before any face is written. Recorded as the seam, not charged against the spine.
W-4  THE SELECTOR VETO DID NOT FIRE, TWICE. v1 f10/f11/f12 landed with three consecutive "says", and v2
     f7/f9/f12 landed with three identical three-word openers. Whatever enforces the attribution veto and
     the opener rule either did not run on this landing or does not run at the variant grain. Two
     independent rules, one landing, both breached — that reads like an unrun gate rather than two
     lapses, and it is worth the chair's minute before the next block lands.
W-5  ⭐ THE CITATION GATE IS AN EXACT PIN AND THE BRIEF DESCRIBES IT AS A CEILING. The chair's standing
     words are "raised a SHRINK-ONLY corpus ceiling from 7 to 8". The assertion is
     `expect(cited.length).toBe(7)` (proseMoveGrammar.walker.test.js:853, again :917) — EXACT, so it reds
     in BOTH directions. A curer who REMOVES a citation elsewhere in the corpus reds it just as a curer
     who adds one does. This pool carries 0 and is not exposed either way, but the brief's wording would
     let a future lane believe deletion is always safe. It is not.
