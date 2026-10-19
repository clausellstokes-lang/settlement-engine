p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
s=open(p,encoding='utf-8').read()
reps=[
(r"""when the points ACTUALLY drawn exceed zero [CURED 2026-10-18 (fp-final r4) — PR-W2 · PR-W3] |""",
 r"""WHENEVER the court keeps riders (`points` the strength actually drawn, 0 where there was nothing to draw) [CURED 2026-10-18 (fp-final r4) — PR-W2 · PR-W3] [CURED 2026-10-19 (fp-final r5) — PR-X5: r4 wrote it only when `points > 0`] |"""),
(r"""PL's `riders_quartered` incidents (PL's shape, PL's writer; the riders' service is PL's own summons rows — PR-r2-17);""",
 r"""PL's `riders_quartered` ROWS (PL's shape 3, a closed kind with its one resentment patch, PL's writer — never a weave incident since round 5, A.8; the riders' service is PL's own summons rows — PR-r2-17);"""),
(r"""(§0.4's homonym row above)""", r"""(this table's first row: a registered homonym)"""),
]
for a,b in reps:
    assert s.count(a)==1,a[:60]
    s=s.replace(a,b)
anchor = "**Rows added to landed shapes (no new shape):** `patrol_report` feed entries"
assert s.count(anchor)==1
table = r"""**The round-5 field** (drop-when-absent; declared as the owner's shape, ⭐ OD-PR-50) [CURED 2026-10-19 (fp-final r5) — PR-X2 · RULINGS-ROUND5 B.9: "a one-field addition, declared"]:

| Path | `placement[member].weeksCovered` — `{ seasonStartTick, weeks }` |
|---|---|
| create | only `patrolLedger.js`, from the stage (§4.1 step 5): the first week of a season in which a rider of another power stood placed on one of the member's halves (from that week's `lived` rows) writes `{ seasonStartTick: tick − (tick mod INTERVAL_WEEKS.one_season), weeks: 1 }`, REPLACING a pair of an earlier season |
| read | only `bannerCoverOf` (§2.6) — by PL's protection outcome (F.4) and the sweep arm of its precedence friction (F.6 (b) (i)) at the season's last tick (after PR's stage, §4.1's clock) or at the member's riders' return; a pair of another season reads 0 |
| persist | on the member's placement row inside `spatialLedgers` (the row kept for the pair alone where the member fields none — its riders at the levy) |
| regenerate | dropped with the row for an id that no longer exists |
| undo | the advance ring's snapshot restores it with the row |
| import | the normalizer DELETES a pair whose `weeks` is not an integer in 1..`one_season` or whose `seasonStartTick` is not a multiple of `one_season` or lies after the row's tick (fail-closed: that season's tally restarts) |
| migrate | none — a new field; absent ⇒ 0 weeks (a season before PR-4 lit has no cover recorded, so PL opens no occasion there either, PL F.4) |
| dark-after-lit | `patrolsEnabled` dark ⇒ inert, no week counted (no placement exists); relit in the SAME season ⇒ the lit weeks already counted stand and the dark weeks add nothing (no rider stood); relit in a LATER season ⇒ the stale pair reads 0 and the first counted week replaces it (EXECUTED `cure/D-PR-r5-probe/season-r5.out` (e)) |
| death | dropped with the town; a member that leaves the polity keeps a pair no PL row reads (it has no edge to judge) until the season turns |
| veil | DM-only machinery; the card says "the crown's riders kept the hills this season", never the count |
| horizon (requirement 23) | one season — one pair, replaced at the season's turn |

"""
s=s.replace(anchor, table+anchor)
open(p,'w',encoding='utf-8').write(s)
print('ok')
