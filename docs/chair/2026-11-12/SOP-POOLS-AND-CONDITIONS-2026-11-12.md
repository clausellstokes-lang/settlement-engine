# SOP — WRITING A POOL AND ITS CONDITIONS (version 1, 2026-11-12)

**Whose this is.** The chair's, on the owner's design of 2026-11-12. It binds every lane and every seat that writes or changes a line a reader can see. Version 1 states the rules. The names of the code's own parts (section 9) are confirmed, and a worked example is added, by the first lane that follows it (W2-B-DECLARE), which installs the living copy beside the prose corpus and links it from the contributing guide.

**The owner's words it is built on (verbatim).**
- "Can't you just make a bunch of if dossier has this, then x can or can't be in the pool with multiple per each pool item? Added lines then add to those checks for the next?"
- "So you also need to come up with a structure, primary lines: those that pull from the base cinfiguration. Secindsry lines: tgise that pull from base configurations plus primary. Tertiary and so forth until we're satisfied to divide up the effort. These ultimately select the base pool of which a prose can be called. Then after all of this a reconciler can make it flow better as text and prose."
- "Change 2 should be weighted not gaursbtedd because then you allow for increased chance of repition. For me, I have a preference of checking for disqualifiers rather than qualifiers."
- "Also make a sop for writing new pools and the conditions for each. And where you see combinations for lacking pools, fill those one"

## 1. The model in seven lines

1. THE BASE is what a town is before any sentence: its size, terrain, access, culture and resources, the houses it has, its form of government, the crises in force.
2. A FACT has one home (a leaf) and a LAYER: one above the highest thing it reads. Primary facts read the base; secondary facts read the base and primary facts; and so on.
3. A LINE reads facts, and the ledger of claims already made. It never reads another line's wording, and never a fact at or above its own layer.
4. A GATE IS A DISQUALIFIER: a line is in its pool unless something about the town makes it false.
5. FIT IS A WEIGHT, never a win: the draw among the lines left is seeded and weighted.
6. A POOL NEVER RUNS DRY: one line in it presumes nothing.
7. THE RECONCILER runs last and adds no claim.

## 2. Before you write a pool

1. **The job.** One sentence: what does the reader learn at this place on the page? If another pool already tells them, stop. Two pools for one job is how one fact gets two answers.
2. **The facts.** List every fact the pool's lines may state or presume. Each must have a home. A fact with no home is not written around: its leaf comes first, and the pool waits.
3. **The layer.** One above the highest fact on that list. Write it down beside the list; the walker reads both.
4. **The case table.** Write out the combinations of those facts (a value by its bands, never by a number). Strike the cases no town can reach, each with its reason. What is left is the table the pool must cover.

## 3. Writing a line

1. Say what is true in the cases you are writing for. Fewer claims in a line keep the pool wide.
2. FOR EVERY THING, STATE, SIZE, COUNT OR VALUE THE LINE STATES OR PRESUMES, DECLARE ITS DISQUALIFIER: the town lacks the thing; the state is not in force; the size is another; the value sits in another band. A line that denies a thing is disqualified where the thing exists. A line true in one band only may be written as that band; it is checked as the disqualifier of the others.
3. GATE ONLY FOR TRUTH. Never disqualify a line because it suits another town better. That is fit, and fit is the weight's.
4. NEVER SET A WEIGHT BY HAND to make a line appear. The weight comes from the pool's rule (how much of the town the line reads, bounded; the rule is set by measure and recorded). The line that presumes nothing weighs least.
5. A name, a number or a list in a line comes through a placeholder filled from the fact's leaf. It is never typed into the line.
6. No internal text: no catalogue name with a range, no identifier, no diagnostic.
7. The style law holds as for every line.
8. A line that differs from a sibling by one swapped word is not a new line.

## 4. The line that presumes nothing

Every pool has exactly one. It is true in every reachable case, it still tells the reader something, and it is the only line with no disqualifier. If you cannot write one, the pool's job is wrong (section 2, step 1).

## 5. Where a line lives and how it is drawn

1. In its pool's source: the prose corpus or the pool's data file. Never in a component or a composer. A sentence that must be written in code is a pool of one: the same declarations, checked at its print site.
2. Generated files are re-made through their door, never edited by hand.
3. The draw goes through the declared door. No bare pick from a pool that carries declarations; no stripping a declaration before a draw.
4. NEW WORDS JOIN THE CHECKS. If a line speaks of something the vocabulary does not know, add its words to the vocabulary, with the leaf they read and the disqualifier they imply, in the same commit. This is the owner's "added lines then add to those checks for the next".
5. A new pool is banked in the repetition guard through its narrow door. No ceiling is raised.

## 6. Filling a gap

The gap list names, per pool, the reachable cases with too few lines left: none left must be filled; under three is the target (the chair's number; the repetition guard is the judge).

1. Write lines true IN THAT CASE. Their disqualifiers are the other cases.
2. Prefer a line that speaks to what makes the case different: it will carry more weight there.
3. Never fill a hole by loosening a disqualifier on a line that exists, and never by copying a line with a word changed.
4. A case that needs a fact with no home goes back to section 2, step 2.

## 7. Done means

1. The walker is green: every registered word in every new line carries its disqualifier; the pool declares its layer and its facts, and reads nothing at or above its layer.
2. The case table is covered: no reachable case with no line; the cases under three are listed.
3. The page measure by vocabulary shows no finding from this pool on the corpus (six sizes and forced crises).
4. The census counter, base against tip: no count rises, no new row.
5. The repetition guard: the pool's top share is inside its row under the weighted draw.
6. The golden surfaces that move are declared by measure, and signed at the merge point by the merge seat, never by the writer.
7. The new lines are listed for the owner's veto.

## 8. Never

A line gated for flavour. A guaranteed line. A line that reads another line's wording. A pool with no line that presumes nothing. A generated file edited by hand. A matcher loosened to pass a line. A disqualifier dropped to fill a hole. A weight set by hand.

## 9. The code's names (as the measuring seats reported them on 2026-11-12; to be confirmed from source)

- The declared door: drawDeclared and filterDeclared.
- The vocabulary of conditions: factVocabulary, 51 dimensions (43 of presence, 7 banded values, 1 crisis).
- The words of each registered thing: the presumed-things walker's shared list.
- The fact homes: the leaves under the domain's facts folder (24).
- The prose corpus and its door: the dossier-state receipt pools document and its generator script.
- The repetition guard: the pool-dominance census and its bank-new door.
