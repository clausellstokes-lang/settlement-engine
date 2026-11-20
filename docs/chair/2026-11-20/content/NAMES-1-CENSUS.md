# NAMES-1 — the census before the build (CN5 before; CN3's measure)

Written 2026-11-20 04:32 UTC, at base `85fccf898` (origin/lane/join-2026-11-14), assignment read at lane/chair-2026-11-08 `d3981afb2`.

## Method (scratch scripts, not committed; executed)

- **Stored pool:** the census's 720 (`tests/components/pageCensusWalk.shared.mjs :: censusPlan('r2')`, every tier, calm and the
  fifteen crises), born by `generateSettlementPipeline` as `lastVariety.test.js` births them. Every string of the record
  is walked (the trace, the receipt, the config and ids skipped); a string is prose when it has four or more words, a
  lower-case letter and ends a sentence; it is cut into sentences.
- **A bare power label:** a power of the town (`powerStructure.factions[].faction`), in its raw, `powerSentenceName` or
  `powerNameAfterArticle` spelling, inside a sentence and not after "the"/"The" (a lone label line excepted).
  **A mid-sentence "The":** a prose form that carries its own capital "The" ("The Guard") inside a sentence.
- **A repeated full name:** an NPC's full name twice or more in one sentence.
- **Render:** 120 of the 720 (every sixth row, every tier) rendered through the real `OutputContainer`, every view
  walked (the page census's own render and walk, lines saved); a sentence is render-composed when no stored string holds it.
- **The census of sites:** every offending sentence's skeleton (powers and persons cut out) traced to the source file
  whose literal text holds its fragments.

## The two counts, before (the stored 720)

| | occurrences | distinct sentences | towns of 720 |
|---|---|---|---|
| bare power label in a sentence | 20,449 | 13,992 | 617 |
| mid-sentence capital "The" ("in The Guard") | 1,802 | | |
| a full name repeated in one sentence | 12,115 | 9,853 | 584 |

Rendered 120: 1,603 sentences with a bare label (all 120 towns), 367 of them composed at render; 1,400 sentences with a
repeated name (93 towns), 1 composed at render.

## The census of sites, by file (occurrences in the stored 720; the render 120 below)

**Powers, stored (composed at generation):**
| occurrences | field | template home → composer |
|---|---|---|
| 14,142 | `npcs[].goal.short/long` | `data/people/goalFamilies.js` → `generators/people/goals.js :: cellCandidates` (fills `{power}`/`{rival}`/`{guild}` through `powerSentenceName`, no article) |
| 407 | `npcs[].goal.long` | `generators/npcStructure.js` |
| 2,513 + 279 | `powerStructure.factionRelationships[].narrative`, `.dmNote` | `generators/factionDynamics.js` (+ fragments shared with `domain/roles/roleClass.js`) |
| 1,678 (×2 copies) | `conflicts[].desc`, `powerStructure.conflicts[].desc` | `generators/power/conflictIssues.js`, `conflicts.js`; `data/historyData.js`; `generators/crossSettlementConflicts.js`; `domain/dossier/powerSupport.js` |
| 525 + 28 | `powerStructure.factions[].desc` | `generators/power/factionStanding.js`; `governingStressVignettes.js` |
| 242 | `pressureSentence` | `generators/narrativeText.js`; `power/governanceNarrative.js`; `power/settlementNarrative.js`; `data/powerSiblings.js` |
| 210 | `powerStructure.recentConflict` | `power/governanceNarrative.js`; `governingStressVignettes.js`; `data/powerSiblings.js` |
| 89 | `npcs[].secret.stakes` | `data/stressInstitutionEffects.js` |
| 48 | `conflicts[].plotHooks[]` | `domain/dossier/hookLines.js`; `power/conflicts.js` |
| 3 | `coherenceNotes[].note` | `generators/narrativeGenerator.js` |

**Powers, render (the 120; composed on the page):** `data/people/dmPowerLines.js` (188, the Power tab's strata lines:
"X heads Royal Authority and also holds…"); `data/dossierStateProse/power.generated.js` via
`domain/display/stateProse/powerStateProse.js` (99: "…no rival yet outweighs Royal Authority"); `domain/crisis/crisisHooks.js`
(17) and `crisisCast.js` (3); `power/governanceNarrative.js` (11); `generators/safetyLineTruth.js` (4); the Overview's
"Governed by X · Stable" (26, a status line: **ruled a label, left**, unless the chair says otherwise).
`src/domain/summary/tonightSheet.js` is FRAME-1's and is not touched.

**Persons (repeated name), stored:** `data/npcData.js` tie lines (9,782: `relationships[].description/tension`, copied
into `prominentRelationship` and one `pressureSentence`), all through `npcData.js :: pairProse`;
`data/people/handlerTieLines.js` (898); `data/people/goalFamilies.js` (154: "Take {above}'s place …, and keep it longer
than {above} did.").

## CN3's measure (the stored 720)

Every prose field that names a person or a power is ONE STRING per record (a field of an object in a list), many of
several sentences: `relationships[].description` 20,846 strings, 13,989 of more than one sentence; `.tension` 10,311 of
20,846; `factionRelationships[].narrative` 615 of 1,286; `secret.what` and `secret.stakes` every one; `conflicts[].desc`
one sentence each; goals one sentence each. **The one LIST OF STRINGS** that names a power is `conflicts[].plotHooks[]`
(584 lists; 14 strings name a power); no list of strings names a person. No stored string today opens on a bare pronoun
with no name in it (0 in the 720).

**The veil's fold** (read at `lane/veil-doors-2-2026-11-20` `eafece56a`, not on this base: `gallerySecondHomes.js ::
nameFold`, `buildNameSearch`): a name is lower-cased, every run of separators made one "_", and a trailing qualifier's
bare form added; the text is folded alike and searched for the folded name on word bounds. So "the Thieves' Guild",
"the Independent Bloc" and "the Thieves' Guild's" all still hold their names. Hideable powers in the 720: `hidden: true`
(The Independent Bloc, The Free Alliance, The Grey Council) and the criminal powers; none has a `PROSE_FORMS` entry, so
"the" + the name holds each. Four `PROSE_FORMS` entries drop their label's fold ("Military/Guard" → "the Guard"; the
claimant lines; "Third Bloc (Neutrals)" → "The Neutrals"); none of them is hideable today. The walker asserts it per town.

## The mechanism proposed

**CN1.** ONE body, `powerNameInProse(name, start)` (article + prose form). Generators reach it as they do now, but
data-layer composers (`dmPowerLines.js`, `npcData.js`) cannot import `domain/`. Proposal: its body moves to the data
leaf `data/people/powerSentenceName.js` as `powerNameWithArticle`, and `governanceAccount.js :: powerNameInProse` stays
where it is, under its name, and returns it (no symbol moves). Every site above fills its power slot through it: the
capital form where the slot opens a sentence; `powerNameAfterArticle` where the template already says "the"; possessives
through the article form. Only sentences change. Labels, chips, headings and keys stay.

**CN2.** One pure leaf, `data/people/personMention.js :: secondMentions(text, people)`, called where the text is
composed: `npcData.js :: pairProse` (every tie line, the handler ties included) and `goals.js` (the person slots). Per
sentence, the first mention keeps the full name and later ones change. A later mention becomes a pronoun from that
person's own `gender` when no other named person in the sentence shares that gender. The pronoun's case is set by
position: possessive before "'s"; subject after a clause opener ("and", "but", "than", a comma) when a verb follows;
otherwise object. Where a pronoun would be ambiguous, the mention becomes the surname if it is unique in the sentence,
else the role ("the gang boss"), else the given name. A person with no gender takes the surname or the role. The
pronoun never leaves the string that names its person (CN3(ii)).

## What I expect to move

The generator golden master (`tests/fixtures/generator-golden-master.json`) and every same-seed hash of town prose; the
dossier prose manifest golden and the reference corpus; the page census (`scripts/census/page-census.register.json`)
and the pool-dominance register where their counted lines change; every test that pins a goal, a tie, a conflict or a
relationship sentence by its text. Each is NAMED with before and after, and none is re-frozen without the chair's word.
