# F2 REPEAT-ONCE — the X-50 residue of rung 1B, measured (2026-11-04)

Lane `lane/rung1b-f2-repeat-once-2026-11-04`, cut from `f9ce225c5`. The finding is
[`docs/SOAK_1000_RUNG1B_2026-11-04.md`](SOAK_1000_RUNG1B_2026-11-04.md) §2 (X-50, 30) and §5 F2;
the rule is X-50 in [`docs/UX_CONSOLIDATION_2026-10-30.md`](UX_CONSOLIDATION_2026-10-30.md): a fact
is printed once per tab.

## 1. The base count

`node scripts/audit/soak-review.mjs --count 1000 --workers 4 --out artifacts/f2-base` at
`f9ce225c5`: 1000 settlements, 5117 findings, 0 errors, 240 s. **X-50:boilerplate-twice 30
settlements, 30 occurrences**, every one a sentence printed exactly twice. Two surfaces, two
shapes:

| surface | shape | settlements | seeds |
|---|---|---|---|
| Tonight sheet | "Wants to {goal}." on two of the people to voice | 23 | 12, 101, 218, 258, 322, 324, 331, 336, 376, 452, 462, 480, 551, 666, 684, 724, 769, 802, 871, 942, 954, 961, 972 |
| Traditions tab | "Kept in {season}, the {nth} and {nth} weeks." on two tradition cards | 7 | 23, 48, 71, 245, 449, 641, 790 |

23 + 7 = 30. The rows are the `X-50:boilerplate-twice` findings in
`artifacts/f2-base/shards/*.jsonl` (not committed).

## 2. The writers

**Tonight — the want line.** `src/domain/summary/tonightSheet.js :: peopleOf` voices up to three
people and gives each `wantOf(npc)`, the NPC's own `goal.short`. Two of them carry the same
`goal.short`, so the sheet prints the sentence twice. The pairs, read from the model on every
seed: cast slot + the seat-holder (16), cast slot + the senior cleric (4), two cast slots (3:
322, 331, 802), 23 in all. The goal itself has one upstream source per NPC:

- 21 of 23: `src/generators/npcStructure.js :: enrichNPCsWithStructure` overwrites `goal.short`
  with the template of the NPC's `category × condition × rank`; two top NPCs that share the key
  share the sentence (e.g. `other__governance_fractured__dominant`: "Convert governance
  instability into a restoration of prerogatives that formal governance had constrained.").
  They are often in different factions (soak1k-324: Religious Authorities and Elder Council).
- 2 of 23 (101, 551): two NPCs drew the same crisis-pool goal (no structural rank).

Each NPC's goal is a true fact about that NPC; the repeat is the sheet's. The cure belongs to the
composer: the second person with the same want names the first instead of repeating it.

**Traditions — the calendar line.** `src/components/new/tabs/TraditionsTab.jsx :: TraditionRow`
prints `Kept in {describeTraditionWindow(rec.window)}.` on every card. In all 7 settlements two
distinct traditions hold the same two-week window (soak1k-48: The Common Procession and The Old
Greening Contest, both Seedtime weeks 11–12). That is the two-festivals-in-one-week pair: two
facts, which stand (no generation change). A one-week window ("Kept in Seedtime, the eleventh
week.") is seven words and below the instrument's eight-word floor, so it never counts. The cure
is at the tab: the second card kept in the same weeks names the first instead of repeating the
calendar line.

No other X-50 shape is in the 1000.

## 3. The count at the tip

The cure is `5f91b3540` (the Tonight composer's `wantsOnce` and the Traditions tab's
`sameWindowPlan`; no generation change, no pool text). `node scripts/audit/soak-review.mjs --count
1000 --workers 4 --out artifacts/f2-tip` at that commit: 1000 settlements, 5087 findings, 0
errors, 212 s.

| class | base (settlements / occurrences) | tip |
|---|---|---|
| **X-50:boilerplate-twice** | **30 / 30** | **0 / 0** |
| coh:defense-words | 534 / 3256 | 534 / 3256 |
| A-05:lacks-access-lines | 977 / 977 | 977 / 977 |
| info:battery-would-not-vouch | 808 / 808 | 808 / 808 |
| A-06:crime-absent-and-organised | 16 / 16 | 16 / 16 |
| A-11:sea-words-landlocked | 14 / 14 | 14 / 14 |
| coh:food-words | 3 / 7 | 3 / 7 |
| A-09:behaviour-line-share | 7 / 7 | 7 / 7 |
| A-12:self-vouch-false | 1 / 1 | 1 / 1 |
| A-14:guild-power-small | 1 / 1 | 1 / 1 |

5117 − 30 = 5087. No residue by shape: Tonight 23 → 0, Traditions 7 → 0. Record and config hashes
identical on 1000/1000 (a screen-only change).
