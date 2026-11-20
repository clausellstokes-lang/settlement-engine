# FRAME-2 · B5 — the names rule in the sheet, the crisis hooks, the crisis cast and the trouble cast: results

Builder B5 of FRAME-2, on `frame2-b5` from `79db75eb2`. Brief: `B5-NAMES-RULE.md` (this folder).

## The pool

120 born towns: per tier (thorp, hamlet, village, town, city, metropolis) ten CALM towns by
`generateSettlementPipeline({ settType }, null, { seed, customContent: {} })`, seeds `b5-names-calm-<tier>-<i>` (a birth
that drew a crisis is set aside; 60 calm kept), and ten IN CRISIS by `{ settType, stressTypes }` with one or two kinds
cycling the catalogue's fifteen, seeds `b5-names-crisis-<tier>-<i>` (60 crisis towns; natural births draw a crisis about
one time in six, so the crisis half is forced to cover every kind). The sheet is composed for the owner
(`{ audience: 'owner' }`), so a calm town's frame is drawn; the frame's sentences are read from whatever towns frame at
this tip (no reliance on `frame: null`).

Strings read (composed by the four files): the sheet's crisis line, its role wants (`CAST_WANTS` lines only), each side's
"why" and "Wants the same as" (302 at the tip); the trouble cast's side words and face reasons, on the frame and on the
sheet's people (714); the crisis hooks, `crisisHooksOf` and `crisisHookFor` (226); every string the crisis cast stores
on the record: `cast.roles[].reason`, `cast.absent[].reason`, `cast.stakes[].reason` (836).

Which strings are stored: only what `crisisCast.js :: deriveCrisisCast` writes on each crisis entry (`cast`; written at
generation by `generators/steps/resolveCrisisCast.js`). Everything else in the four files is composed at render: the
sheet (`composeTonightSheet`), the crisis hooks (`crisisHooksOf`, `crisisHookFor`: "NOTHING STORED", the module's own
law) and the trouble cast (`castTroubleFrame`: "NOTHING IS STORED", CF2).

## The census BEFORE (at `79db75eb2`)

| kind | tonightSheet.js | crisisHooks.js | troubleCast.js | crisisCast.js (stored) |
|---|---|---|---|---|
| (A) power not through `powerNameInProse` | 0 | **124** | 0 | 0 |
| (B) second mention by full name | 0 | 0 | 0 | 0 |
| (C) pronoun / role the only reference, stored | n/a (nothing stored) | n/a | n/a | **598** (of 836 strings; the detector reads 762, 164 of them a pronoun for the crisis, the seat or the role, not for a person or a power) |
| (D) pronoun against the person's `gender` | 0 | 0 | 0 | 18 (stored, inside the (C) count: "its" said of a person) |

**(A) in crisisHooks.js, 124 sentences** (111 a bare label, 13 a capital "The" mid-sentence), from three sites:
`holderWords` (a person's house, `${name} of ${powerSentenceName(house)}`: 78, cast hooks), the same function for a
POWER holding a line role (`row.name` raw: 2, cast hooks: "In the outbreak, Religious Authorities takes the worst of it",
"In the infiltration, Resistance Network is stirring it"), and `loserClause` (`powerSentenceName(loser.factionId)` after
"if it gives way,": 44, lever hooks). Examples:
- `b5-names-crisis-thorp-0`: "In the siege, Lofthæna Thorsson of Household Council, who holds the seat, is the one who would come to terms."
- `b5-names-crisis-thorp-8`: "In the succession crisis, Zagdaakhüü Borjigin of The Highborn Circle is stirring it: its power gains from the crisis."
- `b5-names-crisis-hamlet-1`: "The conversion turns on the wayside shrine: if it gives way, Free Elder Council loses most, because its own people feel the crisis first."
- `b5-names-crisis-metropolis-4`: "… run by Tun Batab: if it gives way, The Guard loses most, because its own people feel the crisis first."

The chair's figure from NAMES-1 is 92 bare-label sentences in crisisHooks.js. This census finds them under (A): 111 bare
labels and 13 capital articles, 124 in all. The two figures come from different pools (NAMES-1's pool is not mine:
120 towns, 60 of them forced into crisis), so they cannot be compared one for one. The sites are the same three.

**(C) in crisisCast.js, 598 stored strings** in all 60 crisis towns. The cast's reasons and stakes are a closed vocabulary
that NAMES NOBODY by design (`CAST_REASONS`, `STAKE_REASONS`, `CAST_ABSENCES`: "the words name no power, so a rename never
reaches them", factionRename.js's law). The row's name lives in its own field (`name`, `factionId`), and the page
prints the two side by side, but inside the stored string the person or power is only "it", "its", "this one" or a role.
Examples:
- `stakes[].reason`: "it could side with either camp" (214), "its own people feel the crisis first" (115), "the church gains while the seat struggles" (37), "the military gains in a vacuum of governance" (22), "crime gains from the disorder" (14).
- `roles[].reason`: "its power could go either way" (18, the waverer, a PERSON called "it": also (D)), "nobody here could, so this one stepped in for the crisis" (7), "its power gains from the crisis" (13), "the governing house" (6), "leads the military" (6).
- `absent[].reason`: "neither the seat's house nor the lever's loses by it" (4).

Not (C), though the detector reads them: "gains and loses by it at once" (91; "it" is the crisis), "holds the seat, and
the right to it is already in dispute" (24), "already carries more weight than whoever holds the seat…" (30), "holds the
seat" (8), "no one is named for it" (4), and five more (164 in all).

**Left as the record's own text (not these files' composition; not counted above):** 29 (A) in the sheet's people
lines that are the person's OWN goal copied verbatim (`npc.goal`, written by the people generator): "gain ground for
Occupation Authority at the expense of Elder Council before the season is out." (`b5-names-crisis-thorp-9`), "beat Elder
Council to the next opportunity, and win the credit for Merchant Guilds." (`b5-names-crisis-village-0`), "stop taking work
from Gaius Laenas without making an enemy of Thieves' Guild." (`b5-names-crisis-metropolis-2`). Also not read: the
tension's own sentence and hooks (`history.currentTensions`), the template crisis hook's own words (`crisisHook`), a
person's secret, the crisis vantage line (crisisSummaryVantage.js; 0 breaches read in the sheet's crisis line).

**The red test at the tip:** `tests/domain/frame2NamesRule.test.js`, 1 failed, 12 passed, 1 expected fail: crisisHooks (A)
**124**; every other file and kind 0; crisisCast (C) failing as expected (the open item below).

## What changed (one source file: `src/domain/crisis/crisisHooks.js`)

Every power a crisis hook names now goes through `display/governanceAccount.js :: powerNameInProse`, mid-sentence
(no hook opens on a power: the cast hook opens "In the {noun}, …", the lever hook "The {noun} turns on …"):
- `holderWords`, a person's house: "Lofthæna Thorsson of **the** Household Council", "Valerianus Severus of **the** Guard"
  (was "of Household Council", "of The Guard");
- `holderWords`, a POWER holding a line role: "In the infiltration, **the** Resistance Network is stirring it" (was the raw
  `row.name`);
- `loserClause`: "if it gives way, **the** Guard loses most", "**the** Free Elder Council loses most" (was "The Guard",
  "Free Elder Council"). The verb's number still reads the prose form without its article (`pluralPowerName`), as before.

What a sentence says is unchanged; only how it names a power. No helper for a person's second mention was added: the
census found no (B) to cure in any of the four files (each composed sentence names a person once).

`tonightSheet.js`, `troubleCast.js` and `crisisCast.js` are unchanged: the first two already name every power through
the helper (`castWantOf`, `FRAME_REASONS`' `{power}`, a criminal house's name, a side's words) and gave no breach; the
third's breaches are stored (below).

Pins of the old form, moved to the ruled form (tests, no source): `tests/domain/crisisHooks.test.js` (9 strings),
`tests/domain/tailCrisisBatch3.test.js` (10 strings of its FALSE and KEEP tables: "of the Household Council", "of the
Independent Bloc", "the Guard loses most", "of the Occupation Authority"), `tests/domain/plotHooks.test.js` (3 strings;
it reads the hooks through `collectPlotHooks`). Each was green at `79db75eb2` and red after the fix, on exactly these
strings and nothing else.

## The census AFTER

| kind | tonightSheet.js | crisisHooks.js | troubleCast.js | crisisCast.js (stored) |
|---|---|---|---|---|
| (A) | 0 | **0** (was 124) | 0 | 0 |
| (B) | 0 | 0 | 0 | 0 |
| (C) | n/a | n/a | n/a | 598, unchanged: OPEN, the seat rules |
| (D) | 0 | 0 | 0 | 18 stored, inside (C), unchanged |

`tests/domain/frame2NamesRule.test.js` at the fix: 13 passed, 1 expected fail (the (C) zero, held by `it.fails` until the
seat rules; flip it to `it` when the stored vocabulary names its referents).

## What is left, and why

1. **(C) and the stored (D): the crisis cast's stored vocabulary, 598 strings in every crisis town of the pool. STOPPED AT
   THE CENSUS (brief step 4: the stored change is large).** Curing it means writing the person's or the power's name (or
   a stored pronoun from the person's `gender`) into `cast.roles[].reason`, `cast.stakes[].reason` and
   `cast.absent[].reason`, which (a) changes the stored record of every crisis town, and (b) breaks the vocabulary's own
   law that its words name nobody, so no rename cascade has to reach them (`STAKE_REASONS`, `CAST_REASONS`: "the words
   name no power, so a rename never reaches them"; factionRename.js). The alternative that moves nothing stored is for
   the RENDER to carry the reference (the page already prints name and reason side by side). The seat rules which. The
   18 waverers' "its power could go either way" call a PERSON "it", the sharpest of them.
2. **The record's own text, 29 (A) in the pool:** a cast person's own goal printed on the sheet ("win the credit for
   Merchant Guilds", "an enemy of Thieves' Guild"), written by the people generator: the generator's or NAMES-1's.
   Likewise not read: the tension's own sentence and hooks, the catalogue's crisis-hook template, a person's secret.
3. **Latent, no breach in the pool:** the role wants (`tonightSheet.js :: CAST_WANTS`) say "their", "them",
   "themselves" and "they" of the person; voiced only for a cast person with no goal of their own, and no such person
   was drawn in the 120 towns (0 (D)). Gendering them in `castWantOf` alone would break the coherence battery's exact
   re-derivation (`coherence/crisisFactFindings.js`, want_not_role) and the oracle in
   `tests/components/tonightSheetOnce.test.jsx`, which call `castWantOf` without the person: another seat's file. Left.
4. **Not naming, left:** a plural power holding a line role keeps the clause's singular verb ("In the outbreak, the
   Religious Authorities takes the worst of it"): `LINE_ROLE_CLAUSE` is singular by construction, the same fault
   `pluralHouseHolder` cures for houses. One sentence in the pool. Agreement, not naming: outside this brief.

## The goldens that move

**None.** No string `crisisCast.js` stores was changed (the file is untouched), and the crisis hooks are composed at
render, never stored (`crisisHooks.js`: "NOTHING STORED"; `generators/steps/resolveCrisisCast.js` writes only the cast).
The tests that read crisis towns' stored records (`tests/generators/resolveCrisisCast.test.js`,
`tests/domain/crisisCast*.test.js`, `tests/domain/tailCrisisBatch7.test.js`, `tailCrisisBatch8.test.js`,
`tests/pdf/goldenViewModel.test.js`) are green; nothing was re-recorded.

## Gates (each to a file, read by `scripts/gate-tail.sh`)

- `tests/domain/frame2NamesRule.test.js`: red at `79db75eb2` (1 failed: crisisHooks (A) 124; 12 passed; 1 expected
  fail), green at the fix (13 passed, 1 expected fail).
- Every test that imports the four files (57 files): 469 passed, 1 expected fail. Plus `plotHooks.test.js`,
  `plotHookParties.test.js`, `hallDecidesUnderOccupation.test.js`, `corpusCureGuards.test.js`, `goldenViewModel.test.js`,
  `tests/domain/coherence/`: green.
- `npm run typecheck:ratchet`: OK (167, ceiling 167). `npm run typecheck:domain:strict`: OK (1113, ceiling 1113).
  `npm run lint`: 0 errors (38 warnings, none in these files).
- `tests/lint/` (not this unit's to repair; each red at `79db75eb2` too, measured with this unit's files set aside):
  `proseWiringCensus.walker` (2, stale register), `tuningRegister.walker` (FRAME_TUNING not in the inventory;
  CRISIS_CAST_TUNING's dependents), `proseNumerics` (SessionMode.jsx line moved), `seedLoopTotality.walker`
  (tests/security/frameShareVeil.test.jsx), `ledgerCitationIntegrity` (the ledger ref is absent from this checkout), and
  `sovereigntyLightingContract.walker` (the estate's test-file count: 3705 at the base against 3702 committed; this
  unit's one new test file makes it 3706).
