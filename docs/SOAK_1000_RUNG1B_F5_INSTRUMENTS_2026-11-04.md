# Soak 1000, rung 1B — fix lane F5 INSTRUMENTS: the count at the tip (2026-11-04)

> A dated archival record of lane `lane/rung1b-f5-instruments-2026-11-04`, cut from
> `lane/window-rung1-2026-11-04` at `f9ce225c5`. It compares the soak at the base
> (`artifacts/f5-base`, run at `f9ce225c5`) against the soak at the lane's last code commit
> (`artifacts/f5-tip`, run at `74a98acd`). Both runs used
> `node scripts/audit/soak-review.mjs --count 1000 --workers 4 --out <dir>`; both rendered every
> settlement with 0 errors. The record it answers is `docs/SOAK_1000_RUNG1B_2026-11-04.md` §5, F5.

## The classes, base against tip

| class | base | tip | cause |
|---|---|---|---|
| A-11:sea-words-landlocked | 14 | **6** | unit 1 (ledgers of lacks: 992, 353, 533, 605, 653, 947) and unit 4 (the dock-side hook: 105, 159) |
| A-14:guild-power-small | 1 | **0** | unit 3 (313: the Periodic market licenses its Merchant Guilds) |
| A-12:self-vouch-false | 1 | **1** | unchanged, and correct: see below |
| mediansOutsideBands | 6 rows | **none** | unit 2 (ruling I4's reading replaces the superseded count bands) |
| every other class | — | unchanged | coh:defense-words 534, A-05 977, info 808, X-50 30, A-06 16, A-09 7, coh:food-words 3 |

Findings fell from 5,117 to 5,108: 8 from A-11 and 1 from A-14. The dependence pass is unchanged:
1,858 residual pairs, 320 copies, 1,850 surprises of kind (a) and 6 of kind (b), with 418
candidates and 679 fields reported. The houses reading rides on its own row field, which keeps it
out of the field walk.

## The A-11 residue at the tip (6), by shape

- **"Harbor Master" ×4** (`soak1k-46`, `-706`, `-814`, `-874`; cities on road or isolated routes,
  in desert, hills or forest). The role carries `requiresPort` (`historyData.js`). But
  `npcGenerator.js`'s `hasPort` reads `/port|harbou?r/` against institution names, and the "port"
  inside **"Teleportation circle"** matches. This is an engine bug. **CONFIRMED** on all four:
  each one's only port-matching institution is the Teleportation circle. It goes to the hooks and
  roles intake. It is not an instrument fault.
- **"Master Shipwright" ×2** (`soak1k-377`, `-755`; isolated metropolises that hold airship
  docking, docks and a harbour master's office). The airship override (chair ruling, round 3, 1)
  licenses the docks and the harbour master's office, but not a shipwright. Whether an airship
  city's shipwright is licensed is **the chair's ruling**.

## A-12 on soak1k-313 does not follow A-14

`reviewSettlement` computes A-12 before it adds A-14, so A-14 was never one of A-12's
contradictions. The finding on 313 ("1 contradiction findings") is its **coh:defense-words**:
"The halls, the walls and the roads are all better than a hamlet this size strictly requires." It
sits on the daily-life tab of a hamlet without walls. That is kind 4, lane F1's class. It is a real
contradiction, so the check stays red. The record's "its A-12 follows" (PLAUSIBLE there) is
refuted. `tests/audit/soakReviewSmallGuildCheck.test.js` pins both halves.

## The institutions band at the tip

Non-fabric houses ÷ `expectedHousesAt` at each settlement's own population. Outside means beyond
±40%.

| tier | median ratio [p10–p90] | outside ±40% |
|---|---|---|
| thorp | 1.00 [0.63–1.41] | 27 of 167 (18 over, 9 under) |
| hamlet | 0.93 [0.55–1.40] | 38 of 167 (16 over, 22 under) |
| village | 1.02 [0.71–1.37] | 18 of 167 (12 over, 6 under) |
| town | 0.98 [0.76–1.31] | 5 of 167 (4 over, 1 under) |
| city | 1.05 [0.88–1.22] | 0 of 166 |
| metropolis | 1.00 [0.86–1.13] | 0 of 166 |

This agrees with the record's §3 table tier by tier: the same medians, and 88 settlements outside.

## The hooks (unit 4)

On the 1,000, 97 hook lines change in 74 landlocked settlements: 84 "lost at sea" and 13
"dock-side". No wet line remains. The change is draw-free (**CONFIRMED**): exactly 74 records
change bytes, and each is byte-identical to the base once the two strings are reversed.

## Addendum: the chair's two rulings, and the tip at `65a31af4`

The chair ruled on the two residue shapes:
- **(1) "Master Shipwright" in an airship city is LICENSED.** A-11's airship override now also
  removes ship, ships, shipwright, shipyard and shipping (`6c5381d2`).
- **(2) "Harbor Master" ×4 is an engine bug, cured as unit 6 (`65a31af4`).** The role is seated by
  `economy/upgradeOpportunities.js :: getUpgradeOpportunities`, whose `requiresPort` gate used
  `includes('port')`. The brief named the crafts-role `hasPort` in `npcGenerator.js`. That test
  has the same defect and is cured too, but measured alone it moves no roster on the 1,000.
  Both now match whole words only, so "Teleportation circle" is no longer a port.

What unit 6 moved:
- Harbor Masters on the 1,000 went from 25 to 21.
- 19 rosters move. Every one is a place whose only port-matching row is a Teleportation circle.
- No other record moves. Of seeds 0–59, only 46 moves.
- No golden-master row moves (0 of 525).

The soak at `65a31af4` (`artifacts/f5-tip2`) against the first tip (`artifacts/f5-tip`):
- **A-11 went from 6 to 0.**
- Every other class, `mediansOutsideBands` (still none) and the dependence pass are unchanged.
- Findings went from 5,108 to 5,102.
