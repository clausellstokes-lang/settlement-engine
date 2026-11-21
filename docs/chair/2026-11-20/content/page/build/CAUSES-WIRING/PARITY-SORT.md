# CAUSES-WIRING: THE PARITY SORT (the chair's ruling of 21:47 UTC; PAGE-9's builder, 2026-11-20)

EXECUTED: `paritySort.mjs` -> `paritySort.out.txt` (one `PAIR` line per pair, one `ROW` line per owner row, the static
`DECLARED` list). The pairs are the 296 veiled crime_wave pairs of `parity.before.txt`: `toPublicSafe` and `toPublicSafe`
full, each through the gallery veil's default set, over the 300 and the 720. Nothing of PAGE-7's was edited, and nothing
is wired.

For each pair the script records four things:
- **owner row:** the owner's cause row.
- **declares:** the atoms that row's wordings declare, and whether each one flips between the owner's document and the
  served one.
- **reads hidden:** whether the row's predicate stops holding on the served document.
- **served row:** which row the served sentence comes from, and whether a place with nothing hidden prints it.
  - `member`: a plain line, or the wording of a row that also holds on the owner's document.
  - `SIGNATURE`: the wording of a row that holds only on the served document.

A **FAULT** is a row whose predicate reads a fact the owner can hide while none of its declared atoms flips with it.

## By the owner's row (296 pairs)

| owner row | pairs | declares | predicate reads a hidden fact | a declared atom flips | FAULT | served: member / SIGNATURE (by row) |
|---|---|---|---|---|---|---|
| rival_rings | 132 | `rival rings` | 132 | 132 | 0 | 132 / 0 (plain 118, criminal_power 14) |
| black_market | 60 | none | 60 | 0 | **60** | 60 / 0 (plain) |
| thieves_house | 32 | `house: thieves_guild` | 32 | 32 | 0 | 32 / 0 (plain) |
| assassins | 20 | none | 20 | 0 | **20** | 20 / 0 (plain) |
| underground | 18 | none | 18 | 0 | **18** | 18 / 0 (plain) |
| whisper_market | 12 | none | 12 | 0 | **12** | 12 / 0 (plain) |
| contraband_water | 10 | `house: smuggling`, `navigable` | 10 | 10 | 0 | 10 / 0 (plain) |
| criminal_power | 5 | none | 0 | 0 | 0 | 1 / **4** (force_unpaid_or_cut 1; rival_rings 4) |
| outlaws_near | 4 | none | 4 | 0 | **4** | 4 / 0 (plain) |
| law_thin | 2 | `law: ≤ critical` | 2 | 2 | 0 | 2 / 0 (force_unpaid_or_cut) |
| force_unpaid_or_cut | 1 | `force: kept` | 1 | 0 | **1** | 1 / 0 (criminal_power) |

## THE FAULTS, listed and not mended

Six rows read a fact the owner can hide without declaring it (115 pairs):
- `black_market` (`blackMarketHouse`): 60
- `assassins` (`assassinsHouse`): 20
- `underground` (`undergroundHouse`): 18
- `whisper_market` (`whisperMarketHouse`): 12
- `outlaws_near` (`outlawsHouse`): 4
- `force_unpaid_or_cut` (`forceUnpaidOrCut`): 1, at r2s-wartime-metropolis-2 under the default-veil `toPublicSafe`.
  - Its `force: kept` is still kept on the served document. The predicate's flip comes from the pay it reads.
  - The coordinator has already traced this read to `npcs[].settlementCondition`, which the public card never serves.

The static list agrees for five of these. Every crime_wave row is `hideable: true`. Six rows declare no atom at all:
`criminal_power`, `underground`, `assassins`, `black_market`, `whisper_market` and `outlaws_near`.

`criminal_power` is never the row that reads a hidden fact in these pairs: its predicate held on every served document.

## THE SIGNATURES: a served sentence true only because something is hidden

There are four pairs. In each, the owner prints `criminal_power` and the served document prints `rival_rings`, and
`rival_rings` does NOT hold on the owner's document. The default veil hides what makes one organisation rule, so on the
served page the town reads as having rival rings. The pairs:
- r2r-city-56: under the default-veil `toPublicSafe`, and under the default-veil `toPublicSafe` full.
- r2s-religious_conversion-metropolis-0: under the same two projections.

Every other served sentence (292 of 296) is a member: either a plain line, or a row that also holds on the owner's town.

## THE 3 PLAIN-toPublicSafe PAIRS (not part of this sort)

The coordinator has traced these: `force_unpaid_or_cut` reads `npcs[].settlementCondition`, which the public card never
serves (`parity.before.txt`).
