# PS-r3-verify — the refuting verifier for THE PASSAGE, P3 round 3b (V-PS-r3, Opus 5.5; chair 0a2e8bd9 continuing a73343ed), 2026-10-18

**COUNTS: 27 holds · 3 fails · 0 stop · 1 new (0 BLOCKING · 1 MAJOR) · 4 ROUTED-UNAPPLIED.** That is 7 FAIL rows in all: PL-V5 and A.6 are one defect logged on two rows, plus minor 1, plus the four routed halves. The new MAJOR is PS-W1.

**What I judged.** The 30 rows of `cure/D-PS-r3.md`: 6 fail or new-MAJOR rows, 5 minors, 4 routed rows, A.1–A.7, A.13 and A.14, and the six NOTED rulings (A.8–A.12, A.15).
- §E.1 and §E.2 were checked as receipts.
- The ROUTES section of all nine `cure/D-*-r3.md` files was read (§E.4).
- I read the volume whole as it now stands (781 lines). I also checked the sibling text where a cure depends on it: PL §4.3 l.236, ST l.273/283/435, PR l.121/374, MN l.185.
- The code of record is master `81f1cd963`, read-only. My probes are under `skeptic/PS-r3-verify-probe/`. I did not run git or the test suite, and I edited no file except this one.

**The 27 rows that hold:**
- **PS-r2-15 (= A.2).** PS9 l.106–114, §4.1 l.250, P15 and OD-PS-15/35 carry the one helper with its two modes, the order written once, and Bound 2 only where PS is lit. PR l.121/374 and ST l.283/435 now cite it.
  - The lane's `holds.out` re-ran byte-identical.
  - I also checked the theorem by hand. A node entered this tick has ⌈x⌉ = t−d, so m = t−d−1 and the shift is +1, which is the same as FREEZE.
  - The leftover wording is in the ROUTED-UNAPPLIED rows below.
- **PS-r2-12.** PS12 l.120, P24 and OD-PS-33 carry the cure, and MN l.185 cites "as PS12 defines it".
- **PS-r2-13.** At master, `readBeliefRelationship` returns `b.record.allianceLabel || truthType` and `groundTruthBelief` writes `allianceLabel: allianceLabel || 'unknown'`. The table row at l.153 now covers both cases.
- **PS-V1.** The cure is at l.212, L3 and P25.
- **PS-V2.** `reroute.out` re-ran byte-identical. Banking the travel inputs means a reroute raises strength in 0 of 348,738 cases.
- **PS-V3.** The cure is in steps 2–3, the §9 rows, P5 and P15. One minor note is below.
- **Minors 2, 3, 4 and 5.**
  - For minor 5 I read the kernel at master: `rng.fork('army-transit')`, `const fought = new Set()`, `const nextDeployments = { ...deployments };`, `changed` and `if (armyTransit.changed)`. The prng fork derives the child as `${seed}::${label}`.
- **RN-V6 (= A.4), PL-V4, MN-V6 (= A.3), A.1, A.5, A.7, A.13 and A.14.**
- **The six NOTED rulings.** A grep of the volume finds `polity_ban`, `fundingBand`, `readiness01`, `party_voiced`, `believedWhereabouts`, `paragonLean`, `a␟b`, `hashInt` and `cut01` only in the cure record.
- **§E.1 holds.** The volume has no `full · … · empty` and no `readiness01`.

## FAILS

| Id | Disposition | Verdict | Why / receipt |
|---|---|---|---|
| PL-V5 (= A.6) | CURED, PS's half | **FAILS (§E.2 receipt)** | §7.5 l.356 still carries the superseded sentence: "so the share is in the defender's size whenever the one contest is fought … (A.6's "polity before passage inside the week", as built)". The same paragraph says the polity stage runs AFTER army transit, so the text now contradicts itself. **Cure:** strike the parenthetical. |
| minor 1 (P7) | CURED: "AT THE SAME SEASON" | **FAILS (EXECUTED)** | P7 l.538 still pins the detour as "never less than the direct route's march AT THE SAME SEASON". At master, `pathCost` prices the route that is cheapest at base cost, multiplied by that route's own season factor. The probe (`p7-season.out`, landed `seasonalPathCost` and `buildSeasonalOverlay`) gives in winter a direct route over a mountain at 100×6 = 600 against a grass detour at 120×1.5 = 180. So the pin reds on a world where the game behaves correctly. The bracket admits this case ("the season can make a detour cheaper than the BASE route's winter march"). **Cure:** assert only that the detour is priced on its own path in season (`seasonalPathCost(detour)`), and drop the comparison. |
| R-CH (ROUTED-UNAPPLIED) | D-CH-r3 → PS | **FAILS** | Route: "'meets a town through CH's gate' (PS1 (d), l.578, OD-PS-34, l.725) should read 'CH's town's gate' (the word rule)". The text still reads "meets a town through CH's gate" at l.90, l.318, l.578 and l.661, "a FREE corps meets CH's gate" at l.725, and "(CH's gate)" at OD-PS-3 l.630. |
| R-PL (ROUTED-UNAPPLIED) | D-PL-r3 → PS | **FAILS** | Route: "carrying the answer on the crossing row as the card's line, which is one declared sub-field". PL l.236 says: "The answer rides the crossing as the card's input line (PS's row — routed). The polity stage MINTS … from that line" and "The DM may set the line on the card like any input."<br>In PS:<br>• The `crossings` row (l.211) has no liege-answer field: `answer?` is B's own answer.<br>• §12 L2 has no lifecycle for such a field.<br>• §9's `armed_incursion` row (l.390) has no liege line, and requirement 24's choices (l.397) do not offer one.<br>So PL's minter has nothing to read, and the DM has no handle on the line (§E.2). |
| R-ST-a (ROUTED-UNAPPLIED) | D-ST-r3 → PS | **FAILS** | Route: "the quoted ST §4.3 phrase 'as it holds at a refused border' is withdrawn". It is still quoted at PS9 l.114 (ST-2b's fort "as it holds at a refused border") and at §4.1 l.250 ("the unit HOLDS at the fort as it holds at a refused border", ST §4.3), next to the words "FREEZE mode". |
| R-ST-b (ROUTED-UNAPPLIED) | D-ST-r3 → PS | **FAILS** | Route: "'inside Bound 2' → 'inside Bound 1, and Bound 2 where THE PASSAGE is lit' (A.2)". SITES CONSIDERED l.586 still says "its hold the one helper's, inside Bound 2", and PATROLS CONSIDERED l.588 says "a registrant of the one stage inside Bound 2". Neither is qualified. |

No other routed half reached PS. MN, RN, PT and FOLD route none to it. PR's screen-parenthetical route is carried at §4.1 l.250 ("or crossing its land").

## NEW FINDINGS

| Id | Sev | Site | Claim / receipt | Cure |
|---|---|---|---|---|
| PS-W1 | MAJOR (left open by the PL-V5 cure) | §4.3 l.284; §9 l.390; §7.5 l.356; PL §4.3 (3) | **The liege's `sent` is still unread exactly where it matters: when the member alone is outmatched.**<br>• Under the enemy threshold, the default is `barred` only when "the unit's size band against B is below `decisive` (B's field force exceeds the unit)", and otherwise `unopposed`. The threshold reads B's field force ALONE, so a member weaker than the column defaults to `unopposed`.<br>• Then no contest is fought, so the share in §7.5 never enters.<br>• The column passes through, and PL writes `protection_failed` with the receipt "sent, but too few", although no contest ever weighed those men. That breaks the Evidence Law, and it is PL-V5's class surviving in this branch.<br>• §17 #17 can fire only when the member could already bar the column alone. | The enemy threshold (in §4.3 and §9's default) compares the unit with the field force PLUS the liege's `sent` share. The answer is already in hand at first sight that week. Pin it in P14. "Sent, but too few" may be written only after a fought contest. |

**Minor notes (not counted):**
- **(a)** The PS-V3 path lets the unit go on into B's land during its card's week, but the crossing's `state` for that week has no name. If it reads as `crossing`, a stranger with no permit has no width, and `passage_overstayed` could be minted the same week as a second card. Name the state (for example, `awaiting` with spending suspended until the seal).
- **(b)** OD-PS-14 l.641 still cuts the size band "of B's home defence". The A.1 cure says field force.
- **(c)** The signature is given as `passageFieldForceOf(B)` in §2.5 but `passageFieldForceOf(capacity)` in §2.7.
- **(d)** Two wordings disagree. §4.1 says "its one `battleInputs` call", but master has one `resolveFieldBattle` statement that calls `battleInputs` twice. PS11 says "its one `resolveFieldBattle` call", which is accurate.
- **(e)** The id of B's guard in the border `resolveFieldBattle` is never named. `armyId` is the settlement id, so the guard's id could alias B's own army in `mauled` and `fought`. Name it, for example `guard:<B>`.
- **(f)** Seam for PL and SEAMS: PL mints the relief row with its trust patch in the same tick, before the pause. §E.2 lets the DM tilt the line during the pause, which would contradict a row that has already been minted.

**CONFIRMED vs PLAUSIBLE.**
- **CONFIRMED by execution:** minor 1's fail (`p7-season.out`), and the lane's `holds.out` and `reroute.out`, both re-run byte-identical.
- **CONFIRMED by code read at `81f1cd963`:** `readBeliefRelationship`/`groundTruthBelief`, `battleInputs`, the COLLISIONS locals, `if (armyTransit.changed)`, prng `fork`, `resolveFieldBattle`'s fork key and its no-rng favourite, `computeAllyRelief`, and `pathCost`'s seasonal pricing of the cheapest-base route.
- **CONFIRMED from the volumes' own lines:** the §E.2 fail, the four ROUTED-UNAPPLIED rows, and PS-W1.
- **PLAUSIBLE:** how often PS-W1's branch occurs, and minor notes (a)–(f).
