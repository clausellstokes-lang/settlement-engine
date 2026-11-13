# VISIBLE-BUGS item 3(b) — the npc agency pairing rule, measured (STOP)

Rule: `src/domain/worldPulse/npcAgency.js :: candidateForAction` — headline = name + deed (`UNTARGETED_NPC_DEEDS`/`TARGETED_NPC_DEEDS` by actionFamily, heraldDeeds.js); body = `<name> is out to <aim>.` (`NPC_AIMS` by shortGoal). The two keys are chosen independently, so the body names a goal the headline's deed is not about (landing: "Caoilfhinn Gallagher pushes through reforms" / "Caoilfhinn Gallagher is out to come through the crisis.").

Corpus: the landing fixture region (scripts/generate-landing-fixture.mjs :: analyze), seeds lf-001..040, 12 weeks, applied wizard news. Applied lines 4986; npc agency lines 2757; of them goal_rebranch 774 (another producer, not this rule); deed-over-goal lines 1983.

| deed \ goal | bind_external_patron | control_institution | expand_influence | profit_from_change | protect_followers | restore_order | secure_office | settle_rivalry | survive_crisis | win_public_legitimacy | total |
|---|---|---|---|---|---|---|---|---|---|---|---|
| reform | 129 | 130 | 103 | 112 | 136 | 112 | 115 | 138 | 228 | 136 | 1339 |
| mobilize | 21 | 29 | 32 | 25 | 25 | 20 | 20 | 17 | 20 | 20 | 229 |
| protect | 11 | 14 | 11 | 13 | 20 | 11 | 7 | 6 | 59 | 13 | 165 |
| suppress | 6 | 7 | 5 | 11 | 9 | 4 | 8 | 14 | 8 | 10 | 82 |
| expose | 8 | 8 | 6 | 5 | 10 | 9 | 7 | 6 | 8 | 11 | 78 |
| exploit | 5 | 8 | 3 | 7 | 5 | 5 | 5 | 2 | 5 | 8 | 53 |
| bargain | 1 | 1 | 5 | 1 | 3 | 6 | 4 | 2 | 13 | 1 | 37 |
| total | 181 | 197 | 165 | 174 | 208 | 167 | 166 | 185 | 341 | 199 | 1983 |
