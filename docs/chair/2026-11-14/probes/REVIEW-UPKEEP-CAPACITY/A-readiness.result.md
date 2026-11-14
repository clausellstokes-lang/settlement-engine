# A-readiness — cold read of the readiness label lines (TIP 9354d792a vs DEF 6e61d042a)

1942 rows, 604 towns, 14 templates. How I read them: a script (`/tmp/claude-0/agents/work-A-readiness/check.py`) checked every row against its record:
- the printed label against `defenseProfile.readiness.label`;
- the printed military score against `defenseProfile.scores.military`;
- the wall named against the roster's wall houses;
- the force named against the roster's armed houses (garrison, barracks, every watch, militia, levy, mercenary quarter, hired blades, charter hall, free company, warden's lodge);
- "no walls" and "no one under arms" against the full `institutions[]`;
- the magic suffix against `magicDependency`.

I also scanned all 972 DEF and TIP records for 'Undefended' beside walls plus a standing force, read by eye the smallest town (r2s-infiltrated-thorp-3, 6 people), the largest (r2r-metropolis-8, 344,689), and towns under siege, famine or occupation (rv5-under_siege+famine-town-2, rv5-famine-hamlet-1, r2s-occupied-town-2, rv5-famine-town-1, rv5-occupied-hamlet-4), and checked label moves against DEF.

**Mechanical checks.** In every one of the 1942 rows, the label is the record's and every printed military score equals `scores.military`. Every named wall and force is in the roster. "No walls and no one under arms" is true in all 40 towns where it prints. The magic suffix equals the record's flag in all 302 towns where it prints.

**The rosters did not change.** All 604 rosters are identical at DEF and TIP.
- 87 labels moved down: hamlets 32, towns 28, thorps 16, villages 11.
- 61 moved up: cities and metropolises 41, thorps 16 (household levy now counts as a militia), villages 2, hamlet 1, towns 0.

Most drops are in towns that have no walls and no one under arms, or only a charter hall. They lost the shrine or parish church that used to count as clergy, and the drop reads true there. **The drop reads false in 4 towns.** Each went from Vulnerable (score 12 to 16) to Undefended (10 or 11) while it keeps walls and a standing force.

| template | towns | verdict | evidence |
|---|---|---|---|
| T1 ai-layer `Defense posture: <L>, military score N/100` | 370 | **FALSE MED** in 4 of 370 (kind g/c) | Label and score equal the record in all 370. Four towns are new 'Undefended' beside walls and a force, with a high military score in the same line. rv5-famine-hamlet-1: "Defense posture: Undefended, military score 71/100" (palisade + citizen militia; its own Invasion & War bar reads Strong). rv5-famine-hamlet-5: Undefended, 45/100 (palisade + militia + charter hall). r2s-occupied-town-2: Undefended, 32/100 (town walls + town watch). rv5-famine-town-1: Undefended, 31/100 (town walls + town watch). Carried: the same pattern stands in 19 other towns at both DEF and TIP (e.g. r2r-hamlet-16, r2r-thorp-27, r2s-famine-village-3, rv5-under_siege+famine-town-5). |
| T2 foundry `- **Readiness:** <L>` | 143 | **FALSE MED** in 4 of 143 | The same four towns read "Undefended" while the roster has walls plus a watch or militia. Carried as for T1. |
| T3 tab:overview `<L>` | 143 | **FALSE MED** in 4 of 143 | The same four towns. Brief rule: 'Undefended' beside walls or a standing watch is false (kind c/d). |
| T3 tab:defense `<L>` | 143 | **FALSE MED** in 4 of 143 | The same four. In r2s-occupied-town-2 the label sits above "The town watch maintains standard patrol coverage." |
| T3 pdf bare `<L>` | 143 | **FALSE MED** in 4 of 143 | The same four. |
| T4 pdf `Defense: <L>` | 143 | **FALSE MED** in 4 of 143 | The same four. |
| T5a `<L>: <wall>, held by the <force>.` (pdf + foundry) | 357 | **FALSE HIGH** in 4 of 357 (kind c/g: the label denies the force the same sentence names) | "Undefended: town walls, held by the town watch." (r2s-occupied-town-2, occupied; rv5-famine-town-1, famine, with "It leans on magic to hold."). "Undefended: palisade or earthworks, held by the citizen militia." (rv5-famine-hamlet-1 and rv5-famine-hamlet-5, famine). At DEF all four read "Vulnerable: …". Carried in 19 other towns (DEF and TIP alike). The other 353 are true: the wall and force are the record's, cities now name "the garrison" and metropolises "the multiple garrisons", and both houses exist. LOW, carried, not listed as false: in 14 towns "held by the town watch" stands on the same page as "walls and nobody to put on them"; it was identical at DEF. |
| T5b `<L>: <wall>, and no one trained to hold it.` | 3 | TRUE | r2s-indebted-thorp-2, rv5-calm-hamlet-0 and rv5-occupied-thorp-0 each have a palisade and no armed house. 'Vulnerable' reads true. |
| T5c `<L>: no walls; the <force> is all that stands guard.` | 26 | **FALSE MED** in 6 of 26 (kind b), carried; plus 1 LOW | "No walls; the barracks is all that stands guard." prints in r2r-town-19, r2r-town-38, r2s-politically_fractured-town-2, rv5-famine-town-0 and rv5-under_siege+famine-town-2. Each also has a Town watch, and pf-town-2 also has a charter hall and hired blades, so "all" denies them. In r2s-monster_pressure-town-2, "the town watch is all that stands guard" sits beside a Free company hall ("professional soldiers"). All carried: the DEF clause is identical, and all 13 DEF towns with the barracks clause have a watch. LOW: rv5-occupied-hamlet-4 reads "Undefended: no walls; the adventurers' charter hall is all that stands guard.", but its own page says "no line and no force". LOW: in rv5-under_siege+famine-town-2 (under siege) 'Undefended' is supported by its page ("exists on paper", "all but undefended"). |
| T5d `<L>: no walls and no one under arms.` | 40 | TRUE | No wall house and no armed house in any of the 40 (checked against the full roster, including hired blades, veterans, free companies and wardens). The labels are Vulnerable or Undefended: thorps, hamlets and villages of 8 to 368 people. |
| T5 suffix `It leans on magic to hold.` | 302 | TRUE to the record; LOW, carried | It always equals `magicDependency`. It is unchanged from DEF, so not this stage's. It is doubtful in r2r-village-13, r2s-indebted-village-0 and rv5-calm-village-2 (magical score 0) and in rv5-famine-town-1 (no magic house, no tradition). |
| S1 foundry `Military Council governs, with Military/Guard pressing close behind.` | 2 | TRUE | rv5-monster_pressure-town-5 has 34 v 27 and r2s-monster_pressure-town-1 has 43 v 34; the runner-up is the record's 'Military/Guard'. The faction name with a slash prints in 97 DEF towns (carried; not a fault of this stage). |
| S2 foundry `N hooks to pull; most of them belong to the people (M).` | 2 | TRUE (LOW confidence) | The count went 35→34 and 102→104. The plot-hook tab also loses one hook in rv5-monster_pressure-town-5; the tally is mechanical. |
| S3 foundry `62 people worth knowing; Vasileios Kalojan, the company captain, member of Merchant Guilds…` | 1 | TRUE | In r2r-city-55 the NPC's memberships are Military/Guard 0.5 and Merchant Guilds 0.5. |

## Other checks
- **Label vs town size.** There is no Fortress in any thorp, hamlet or village. Cities and metropolises are Fortress (209) or Well-Defended (105). The one thorp at Defensible is r2s-monster_pressure-thorp-2 (21 people, palisade and household levy, raised by C3). LOW stretch: its own page says "could not hold off a raid", but also "Invasion & War: Strong".
- **Drops that read true.** The 83 other drops in unchanged rosters read true. Examples: a hamlet with nothing reads Vulnerable or Undefended; a town with no walls, only a watch, reads Vulnerable. LOW stretches: towns with walls and a watch that fell to Vulnerable (r2r-town-55, r2s-monster_pressure-town-0, rv5-monster_pressure-town-2, rv5-monster_pressure-town-3). That pattern already existed at DEF (r2s-under_siege-town-3, rv5-calm-town-0), and each page says "walls and nobody to put on them".
- **`&#39;` in the foundry output.** It is how the foundry surface writes every apostrophe, at DEF and TIP alike: format, not broken text.
