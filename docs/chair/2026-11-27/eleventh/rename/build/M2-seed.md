# K1 MEASURE (ii): THE `_seed` SITES

RENAME-BUILD, 2026-11-28. Base tree 5ad631588; the K1 tree is the same commit with the K1 edits (`k1-wip.patch`, the code later committed as K1). Every count is a script's (CONFIRMED) unless marked PLAUSIBLE.

## Every view-time pick that keys on `_seed` (A-keys.tsv, re-read on 5ad631588)

| site | where | key today | re-keyed in K1? |
|---|---|---|---|
| A11 viability | `domain/display/dossierViewModel.js :: viabilitySeed` | `_seed ?? id ?? name` | yes |
| A12-A14 the state-prose desks (spine/turn/modifier draw, salience order, connective) | the desk seeds: `components/new/{defense,economy,general,magic,power,stressors,viability}DeskRead.js`, `powerDeskRead.js` (deskSeed), `tabs/WarFaithDesk.jsx`, `domain/display/stateProse/printProse.js` | `_seed ?? id` | yes |
| A21 governance arrangement | `domain/display/governanceAccount.js :: governanceAccountOf` | `_seed ?? id ?? name` | yes |
| A22 / A23 tradition draws | `domain/traditions/traditionDescription.js :: settlementSeedOf` | `_seed ?? id` | yes |
| A25 ring vantage | `domain/display/defenseDisplay.js :: withRingVantage` | `_seed` only | yes |
| A29 scope line | `domain/summary/settlementQuickGuide.js :: cultureScopeLine` | `_seed` only | yes |
| **A24 founding traditions preview** | `domain/traditions/genesis.js :: deriveFoundingTraditions` | `_seed ?? id ?? identity.seed` | **NO, named** |

Every re-keyed site reads `pickKeyOf(record, <today's key>)`: the id first, today's key where the record holds none.

**Why A24 cannot take the id.** It is not only a view-time pick. It is the FOUNDING DERIVATION of the record's traditions. The world tick mints it into the record at the first lit tick (`worldPulse/traditionsKernel.js:663`). Its own header says the view-time preview and the tick-time mint are identical by construction. The habit-fork registry calls it the "golden-pinned deriveFoundingTraditions leaf" (`worldPulse/habitForkRegistry.js`). Re-keying it would change what every advance mints, which is a simulation output and a golden (the owner's). It also chooses WHICH traditions a town has (their names and count), not a wording.

## What an import does to each site today, and after K1 (ten towns of C, every tab walked; RENAME-MEASURE's `roads-render.jsx`)

The owner's page of the town is compared against the owner's page of its imported copy. The copy is re-stamped as the importer's save stamps it. Analyses: `results/BR-base.analysis.txt`, `results/BR-k1.analysis.txt`.

| road | base 5ad631588: pages moved, lines | K1 tree: pages moved, lines | what is left after K1 |
|---|---|---|---|
| R2 JSON import | 10 / 10, 480 (PDF prose 166, Traditions 107, Defense 62, Economics 48, Power 26, Overview 24, History 14, Resources 10, Daily Life 7, Magic 7, Outlook) | 10 / 10, **107, all on World/Traditions** (3 to 20 a town) | A24 only: the copy's founding preview is derived from the id, so its traditions are other traditions |
| R4 gallery import | 10 / 10, 985 | 10 / 10, 621 | A24's 107, plus the public projection's own losses (NPC Foundry pages, veiled rows): not re-deals |

Keys before and after K1 (the pick log): A29 `dp-thorp-0::culture-scope-line` falls on the copy to a null key, the first frame. After K1 it is `s_83fa…::culture-scope-line` on both. A11 `dp-thorp-90|viability` becomes `s_5376…|viability` on the copy; after K1 it is on both. A25 (1 page): the key is gone on the copy; after K1 it is the same. A22/A23: after K1 the key is the same on both, but the copy's tradition records differ (A24).

So after K1 an imported copy prints the owner's page at every site but the founding traditions. A town whose traditions are LIT (minted into the record by a tick) carries its set into the copy. There, A22/A23 now print the owner's lines (PLAUSIBLE: a lit town was not walked).

## The decision rule: does every page move anyway at K1?

YES, by RENAME-MEASURE (E): the name sites alone move 900 / 900 pages of C and of V (Daily Life is on every page). Re-keying the `_seed` sites adds no page to that one move, so they are re-keyed in K1. The corpus counts of the combined K1 (base against the K1 tree, 900 + 900) are the K1 proof run itself: the same code, run once, in `K1-PROOF.md`.

## Named, not changed
- A24, as above: it takes the owner's word or a decision of its own (e.g. a copy keeps its founding seed under another name).
- The shared page's STAMP. A town saved before K1 keeps the desk lines drawn at its last save until its next save, while its Daily Life (derived at view on the share) moves at once. `PUBLIC_PROSE_VERSION` is NOT bumped: the stored shape did not change, and a bump would make every older share print silent at its desks until re-saved. PLAUSIBLE, by reading `publicProse.js`.
