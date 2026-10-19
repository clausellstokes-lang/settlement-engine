from edit import apply
R6 = '[CURED 2026-10-19 (fp-final r6) — '
pairs = [
("| the court's weekly line `pay · refuse · abandon` (LANDED `HOME_ANSWERS`); the race's closings, a PARTITION (B.7): `ransom_granted` (survived AND paid, at the end or early) · `captive_freed` (the body defeated first) · `captive_released` (the clock out, no payment, no defeat; or the body's own early release) | STANDING · CLOCKED (its close the CLIMAX) | the landed home leaf's answer (`homeRansomAnswer`) |",
 "| the court's weekly line `pay · refuse · abandon` (LANDED `HOME_ANSWERS`; the DM's choices A.1's `pay early · hunt · wait`); the race's closings (A.1): `ransom_granted` (the body SURVIVED the clock — its end PAYS whatever the court chose, only the DM's decision overriding; or the court paid early) · `captive_freed` (the body defeated first) · `captive_released` (ONLY the body's own early release when it cannot feed him, or the DM's decision — never automatic) " + R6 + "A.1 · BD-r5-1] | STANDING · CLOCKED (its close the CLIMAX) | the landed home leaf's answer (`homeRansomAnswer`) each week; at the clock's end, `ransom_granted` |"),
("| the party's road arm · CH's road arm | PT · CH — a body as the counterparty |",
 "| the party's road arm · CH's road arm | PT · CH — a body as the counterparty; and CH's road-arm ATTEMPT card for a NAMED gang that strikes at a warden (`person_at_the_gate`'s attempt arm: `withstood · bribed`, default `withstood`, ONE deed `warden_attempted`, §9.5) " + R6 + "CH-2] |"),
("while open the town carries the ONE `guild_war` condition (B.18) |",
 "while open the town carries the ONE `guild_war` condition (B.18; A.4 — the `war_pressure` channel and weight class, no crime term, re-asserted weekly on its lease, §6.8 (d)) |"),
("or EARLY the week the DM's act (pay · hunt · decree) closes it (B.6) [CURED 2026-10-19 (fp-final r5) — B.6];",
 "or EARLY the week the DM's act (pay · hunt · decide) closes it (B.6) [CURED 2026-10-19 (fp-final r5) — B.6] " + R6 + "FOLD-2 · SEAMS-r5-17];"),
("LIT WITH EFFECTS DARK: every ledger but `spatialLedgers.bodies`, the news and the docket is BYTE-IDENTICAL (B2);",
 "LIT WITH EFFECTS DARK: B2 — the effect arms ABSENT (no presence row, no criminal-power composition, no gate rows, no bounty band step, no hunt detachment, no call-board call), the record's own producer rows a DECLARED SAME-SEED SHIFT signed at its unit (BD22, A.3) " + R6 + "A.3 · B.16's fail (V-BD)]; the BYTE-IDENTICAL pin binds the DARK state (B1);"),
("THE BOUNTY (`body_bounty`, its funding-step input to ST's band, its CALL on CH's board) and THE HUNT LED (`hunt_taken`, PR's detachment, the deployments upkeep) (B.16)",
 "THE BOUNTY (`body_bounty`, its funding-step input to ST's band, its CALL on CH's board) and THE HUNT LED (`hunt_taken`, PR's detachment — no deployment upkeep, SEAMS-r5-5) (B.16); from round 6 the guild war's condition on the `war_pressure` channel and weight class (A.4)"),
("(BD11; the `body` token in `HIDDEN_PATH_KINDS` read only where this flag is lit),",
 "(BD11; the `body` token in `TRAVELLER_KINDS` and `HIDDEN_PATH_KINDS` read only where this flag is lit; the route ledger's WAY-MODE edges — `routeEdgeId(a, b, 'way')`, `wayRung`, `useCount` — written only where `routeLifecycleEnabled` is lit too, A.2 " + R6 + "A.2 · BD-r5-6]),"),
("the `peace_unkept` request and the crown's-faith service credit (§10.2 (b′)),",
 "the `peace_unkept` request and PL §4.8 (4)'s three faith rows — the service credit, the endowed rival's defiance, the mirror's `fealty_defied` (§10.2 (b′)) " + R6 + "PL-1],"),
("`bodiesEnabled` alone — none outside the bodies' own ledger, the news and the docket (pinned B2);",
 "`bodiesEnabled` alone — its producer rows' writes (a raid's deaths, ST's holders, PR's losses, the legitimacy on a defeat), SIGNED at its unit (A.3; B2 pins the effect arms absent);"),
]
apply(pairs, 'c9')
