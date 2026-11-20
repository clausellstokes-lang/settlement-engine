# FRAME-7 · SR1 — the stakes' reason: the PROPOSAL (to the chair's eye before any builder is cut)

Rests on `frame7/SR0-RESULTS.md` (measured at `d8c2219fc`; E executed, I inferred). Vetoable by the owner. NOTHING BUILT.

## What the measure changed in the target

- **`untouched` (34% of stored rows) prints NOWHERE** (E: 112 stored, 0 printed on any audience; `crisisPage.js :: stakeShown` routes it to "must answer for it · it governs here", "is already at odds · …" or no row). It is stored sameness, not printed sameness: OUT of SR1.
- **The printed sameness is `loses`** ("its own people feel the crisis first": on the tab, the PDF, the journal, and after "because" in the first-loser hook on Plot Hooks and the Tonight sheet), and second **`split`** ("gains and loses by it at once": up to 77% of a village's crisis places).
- On ALL places of a size (the census's births): `loses` 18 / 32 / 22 / 22 / 30 / 28% (thorp to metropolis); `split` up to 22% (village). The other keys stay under about 15% on ALL places (I: gainsVacuum 18% of hamlets on the brief's births is the one to watch).

## The pattern (SR0 §7: the tree's own)

A new registered data file `src/data/crisis/stakeReasonLines.js`: authored rows `{ text, needs }` per stake key, chosen through `domain/facts/drawDeclared.js :: drawDeclared` with a keyed hash over the record's own identity (seed, crisis kind, the power's name): NO rng, no other town's or role's draw moves. Guards: `drawDeclaredKeys.walker`, a `…PoolsDeclared` test like `hookLinePoolsDeclared.test.js`, `declaredLineShape`. Birth only: a saved town keeps its stored sentence.

**`needs` (SR0 §5, none hideable):** the matched affected system (`catalogFor(kind).affectedSystems` × `SYSTEM_BASE`, the fact that made the row `loses`) and the crisis kind. NEVER a member's house or a power's `desc` (the veil hides both).

## `loses`: wordings by the matched system (each says why THIS power loses, from the record; distinct from the cast's brunt line `CAST_REASONS.bruntBase[sys]`, which the same power prints on the same page)

| system (rows whose loss it matched on CRISIS, of 543: SR0 §2) | wordings (the hash picks one) |
|---|---|
| public_legitimacy, by governing (235, 43%) | "it governs, and the crisis is laid at its door" · "its right to rule is what the crisis puts to the test" · "people look to it for an answer it does not yet have" · "every day the crisis lasts is counted against it" |
| defense_readiness (94, 17%) | "its people are the ones sent to hold the line" · "it has to find the hands to man the walls" · "the danger lands first on those it arms" |
| trade_connectivity (86, 16%) | "its trade is the first thing the crisis cuts" · "its goods sit unsold while this lasts" · "its routes and its custom are both at risk" |
| social_trust (64, 12%) | "it holds people together, and that is what the crisis frays" · "the neighbours it speaks for have stopped trusting each other" |
| tax_revenue, by governing (48, 9%) | "its coffers empty while the crisis drags on" · "it cannot collect what it is owed while this lasts" |
| law_order (12, 2%) | "the disorder falls on those who keep the peace" · "its people are stretched thin keeping order" |
| healing_capacity (4, 1%) | "its people tend the sick, and sicken in turn" |
| food_security, labor_capacity, housing_pressure, faction_stability, criminal_opportunity (0 born) | one each, same voice; the old line stays the fallback for an unknown system |

Ceiling (I, from SR0 §2's table): public_legitimacy holds at most 24% of a size's places on ALL; four wordings put any one sentence near 6%; every other system is under 15% before the split.

## `split`: two to three wordings, keyed the same way

"gains and loses by it at once" · "stands to win by it and to lose by it alike" · "has as much to gain from it as to lose". **A text reader keys on it:** `crisisCast.js :: bruntCandidates` reads `k.reason === STAKE_REASONS.split`. SR1 changes that reader to a closed set (`SPLIT_REASONS.has(k.reason)`, the old text first), so a saved town's stored split still reads as a split (I: no cast role moves; proof (b) checks it).

## Agreement and the two named items

- **The plural:** every wording opens on "it"/"its" so `crisisHooks.js :: loserClause` (its→their for a plural loser) still folds it, and C2b(b)'s birth-time plural possessive (the names lane's helper) applies to every row. **ORDER: C2b(b) merges FIRST**; SR1's builder runs its wordings through the same helper. (216 printed rows say "its" after a plural power: 150 are `loses`.)
- **`creditorAgent`** ("it speaks for the creditor the town owes", 24 rows on CRISIS, 9 on ALL) becomes "it speaks for the creditor the place owes". FINDING: today the page already re-speaks "the town" as the tier noun (`composeCrisisPage`'s `speak`): a hamlet reads "the creditor the hamlet owes". With "the place" the page prints "the place". Say which the chair wants.
- **The coherence receipt** (SR0 §6b): `resolveCrisisCast` writes the cast after `assembleSettlement`'s receipt; no battery reads a stake reason, except the hook text that carries `loses` through `hook-truth-record`, on the receipt rebuilt only when a temporary person is minted. Held as a finding.

## The proofs (stored unit: all three)

(a) byte-identity of every town with no `loses`, `split` or `creditorAgent` row, every calm town, and every non-reason field; (b) on a forced two-crisis pool, every OTHER role byte for byte (the `split` reader); (c) the two-tree confinement on the golden's 525 and the census's 720 (`tools/confinement/trees.mjs --words=none`): only `stress.cast.stakes[].reason` and the hook strings carrying it move. Pins that move: `crisisCast.test.js`, `crisisHooks.test.js`, `tailCrisisBatch3/4.test.js` (named, re-recorded by cause). Re-measured: the commonest printed reason's share by size, before and after, ALL and CRISIS.
