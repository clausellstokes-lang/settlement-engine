# FRAME-7 · SR1 — the stakes' reason: the PROPOSAL (to the chair's eye before any builder is cut)

Rests on `frame7/SR0-RESULTS.md` (measured at `d8c2219fc`; E executed, I inferred). Revised after the chair's answers of 19:12 and 19:30 UTC. Vetoable by the owner. NOTHING BUILT.

## What the measure changed in the target

- **`untouched` (34% of stored rows) prints NOWHERE** (E: 112 stored, 0 printed; `crisisPage.js :: stakeShown` routes it to "must answer for it · it governs here", "is already at odds · …" or no row): stored sameness, not printed. Its TEXT is not reworded by SR1; only its reader moves to a key.
- **The printed sameness is `loses`** ("its own people feel the crisis first", now "their own people…" after a plural power, C2b(b)): on the Crisis tab, the PDF, the Foundry journal, and after "because" in the first-loser hook (Plot Hooks, the Tonight sheet). Then **`split`** ("gains and loses by it at once": up to 77% of a village's crisis places).
- On ALL places of a size (the census's births): `loses` 18 / 32 / 22 / 22 / 30 / 28% (thorp to metropolis); `split` up to 22% (village).

## The shape (the chair's 19:12 and 19:30 rulings)

1. **A new registered data file, `src/data/crisis/stakeReasonLines.js`**: every stake reason's wordings move there from `crisisCast.js :: STAKE_REASONS` (which becomes a re-export of the old literal set, for the readers and pins that import it), so **`crisisCast.js` gets SHORTER** (it sits at its 800-line shrink-only ceiling; no ceiling is raised).
2. **Each wording declares its `needs`** (the matched affected system; for `split`, none) and is written in its **agreement form**, filled by the people lane's one helper (`data/people/powerSentenceName.js :: fillAgreement`, through `domain/display/powerSentenceName.js`) with the stake's own power: `{power|its|their}`, `{power|it governs|they govern}`. No second agreement rule.
3. **The pick**: `domain/facts/drawDeclared.js :: drawDeclared` with a keyed hash over the record's own identity (the seed, the crisis kind, the power's name): NO rng, nothing else moves. Guards as `dossier/hookLines.js` has them: `drawDeclaredKeys.walker`, a `stakeReasonLinesDeclared` test like `hookLinePoolsDeclared.test.js`, `declaredLineShape`.
4. **THE TWO TEXT READERS COMPARE A KEY, NEVER A SENTENCE**: the data file exports `stakeReasonKey(reason)`, a closed reverse map from EVERY text a stake row can hold (each wording in each number, and every pre-SR1 literal a saved town holds) to its key. `crisisCast.js :: bruntCandidates` reads `stakeReasonKey(k.reason) === 'split'`; `crisisPage.js :: stakeShown` reads `stakeReasonKey(k.reason) === 'untouched'`. A saved town's stored split or untouched still maps to its key (I: no cast role moves; proof (b) checks it).
5. **At birth only**: a saved town keeps its stored sentence; no read-time rewrite.
6. **`needs` names no hideable fact** (SR0 §5): the matched system and the crisis kind are not cards; a member's house and a power's `desc` are never needed.

## `loses`: the wordings, by the matched system (each says why THIS power loses, from the record; none repeats the cast's brunt line `CAST_REASONS.bruntBase[sys]`, which the same power prints on the same page)

The shares are of the 543 CRISIS rows whose loss matched that system (SR0 §2; E). Each wording below is shown in its agreement form and then as printed for one singular power.

| system | wordings (the keyed hash picks one) |
|---|---|
| public_legitimacy, by governing (235, 43%) | 1. "{power\|it governs\|they govern}, and the crisis is laid at {power\|its\|their} door" (the Elder Council loses · it governs, and the crisis is laid at its door) · 2. "{power\|its\|their} right to rule is what the crisis puts to the test" · 3. "people look to {power\|it\|them} for an answer {power\|it does\|they do} not yet have" · 4. "every day the crisis lasts is counted against {power\|it\|them}" |
| defense_readiness (94, 17%) | 1. "{power\|its\|their} people are the ones sent to hold the line" · 2. "{power\|it has\|they have} to find the hands to man the walls" · 3. "the danger lands first on those {power\|it arms\|they arm}" |
| trade_connectivity (86, 16%) | 1. "{power\|its\|their} trade is the first thing the crisis cuts" · 2. "{power\|its\|their} goods sit unsold while this lasts" · 3. "{power\|its\|their} routes and custom are both at risk" |
| social_trust (64, 12%) | 1. "{power\|it holds\|they hold} people together, and that is what the crisis frays" · 2. "the neighbours {power\|it speaks\|they speak} for have stopped trusting each other" |
| tax_revenue, by governing (48, 9%) | 1. "{power\|its\|their} coffers empty while the crisis drags on" · 2. "{power\|it cannot\|they cannot} collect what {power\|it is\|they are} owed while this lasts" |
| law_order (12, 2%) | 1. "the disorder falls on those who keep the peace" · 2. "{power\|its\|their} people are stretched thin keeping order" |
| healing_capacity (4, 1%) | 1. "{power\|its\|their} people tend the sick, and sicken in turn" |
| food_security, labor_capacity, housing_pressure, faction_stability (0 born; one each, same voice) | "{power\|its\|their} people go hungry first" · "{power\|its\|their} people are worked hardest" · "{power\|its\|their} people take in those with nowhere to go" · "{power\|its\|their} own ranks start to quarrel" |
| an unknown system | the pre-SR1 line, "{power\|its\|their} own people feel the crisis first" |

Ceiling (I, from SR0 §2): public_legitimacy reaches at most 24% of a size's places on ALL; four wordings put any one sentence near 6%; every other system is under 15% before its split. SR1's builder re-measures it (E) before and after.

## `split`: three wordings (no `needs`)

1. "gains and loses by it at once" (today's; "it" is the crisis, no agreement) · 2. "stands to win by it and to lose by it alike" (with the agreement fill: "{power|stands|stand} to win…") · 3. "has as much to gain from it as to lose" ("{power|has|have} as much…").

## Where a stake reason is spoken, and "the town"

- **The speak pass** (`crisisPage.js :: composeCrisisPage`'s `speak`, `speakTierNoun` with the tier's noun) runs over every Stakes row's reason on the **Crisis tab**, the **PDF** (`crisisPrint.js :: stakeLines` reads the composed page) and the **Foundry journal** (the same `stakeLines`). It does **NOT** run on the first-loser hook (`crisisHooks.js :: loserClause`, Plot Hooks and the Tonight sheet), which carries only a `loses` reason.
- **No SR1 wording says "the town"**, so no wording depends on the pass. `creditorAgent` stays as it is (the chair, 19:30: the pass prints the tier's own noun, "the creditor the hamlet owes").

## Order and the next unit

- C2b(b) is merged (90874e392): its one-line `fillAgreement` call for `loses` is replaced by the data file's form (same output for the old wording).
- **SR2 after SR1** (the chair, 19:30): the 172 other plural rows (88 possessives in the `RAISED_BY_CRISIS` `adds` reasons, 84 "it" pronouns in the K24 rows) move to the data file with the agreement fill: agreement only, no new wording; `crisisCast.js` shorter again.
- The coherence receipt (SR0 §6b; held as a finding): no battery reads a stake reason except the hook text carrying `loses` through `hook-truth-record`, on the receipt rebuilt only when a temporary person is minted.

## The proofs (stored unit: all three)

(a) byte-identity of every town with no `loses` or `split` row, every calm town, and every non-reason field; (b) on a forced two-crisis pool, every OTHER role byte for byte (the `split` reader now reads a key); (c) the two-tree confinement on the golden's 525 and the census's 720 (`tools/confinement/trees.mjs --words=none`): only `stress.cast.stakes[].reason` (and its `stressors` alias) and the hook strings carrying it move, 0 non-string differences. Pins that move: `crisisCast.test.js`, `crisisHooks.test.js`, `tailCrisisBatch3/4.test.js`, `crisisStakeFollowups.test.jsx` (named, re-recorded by cause). The stored figures it moves named, unsigned. Re-measured: the commonest printed reason's share by size, before and after, on ALL and CRISIS.
