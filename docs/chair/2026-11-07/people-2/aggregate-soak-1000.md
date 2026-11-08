# PEOPLE-2 aggregate — before-soak.jsonl → after-soak.jsonl

_The cast, lever and seat table: all 1,000. The Tonight diff: the first 300 (the brief). Before = the base 8fa9de5b8; after = this lane at step 3._

| tier | settlements | cast roles filled before → after | of them people | people that are faces | absences | lever holders (of levers) | holders that are the lever house's face | lever houses with a face | seat row filled | seat row is rank 1 |
|---|---|---|---|---|---|---|---|---|---|---|
| thorp | 167 | 212 → 224 | 100 → 164 | 90 → 154 | 213 → 201 | 0 → 0 (of 60 → 60) | 0 → 0 | 0 → 0 | 68 → 167 | 68 → 167 |
| hamlet | 167 | 264 → 278 | 139 → 205 | 133 → 199 | 195 → 181 | 37 → 27 (of 102 → 102) | 10 → 27 | 27 → 27 | 30 → 167 | 30 → 167 |
| village | 167 | 319 → 327 | 229 → 305 | 223 → 298 | 105 → 97 | 55 → 88 (of 103 → 103) | 26 → 88 | 88 → 88 | 54 → 167 | 54 → 167 |
| town | 167 | 361 → 362 | 271 → 348 | 271 → 348 | 55 → 54 | 262 → 352 (of 425 → 425) | 67 → 352 | 352 → 352 | 23 → 167 | 18 → 167 |
| city | 166 | 342 → 345 | 283 → 333 | 283 → 333 | 68 → 65 | 360 → 503 (of 606 → 606) | 53 → 503 | 503 → 503 | 64 → 166 | 45 → 166 |
| metropolis | 166 | 368 → 370 | 302 → 353 | 302 → 353 | 51 → 49 | 432 → 546 (of 675 → 675) | 61 → 546 | 546 → 546 | 76 → 166 | 39 → 166 |
| all | 1000 | 1866 → 1906 | 1324 → 1708 | 1302 → 1685 | 687 → 647 | 1146 → 1516 (of 1971 → 1971) | 217 → 1516 | 1516 → 1516 | 315 → 1000 | 254 → 1000 |

## Tonight — 300 sheets, 258 moved; 11637 lines, 3185 moved

| class | lines |
|---|---|
| NAME (a roster name) | 784 |
| NAME (the moved person's own role, want, secret, source) | 1102 |
| NAME (a person named where none was, or no longer: the seat row filled, a cast role held by a person) | 994 |
| TITLE | 0 |
| OTHER — ORDER (the same values in another order: the roster's order is npcStructure's relevance order, step 3) | 218 |
| OTHER — LEVER (the lever hook names the first lever house with a holder: the house's face, step 1) | 32 |
| OTHER — CAST (a crisis hook's cast row moved: its person, power and the cast's own reason travel together, steps 1–2) | 10 |
| OTHER — GOAL (the same person's want: the structural template, step 3) | 45 |
| OTHER — PARTY (a hook's "of <power>": the first-rank power, step 3) | 0 |
| OTHER — STRUCTURE (a path on one side only) | 0 |
| OTHER — UNEXPLAINED | 0 |

Samples:

- CAST hooks[0].text: "In the migration, the brunt falls on Filippos Kamytzes of Religious Authorities: the leas → "In the migration, the brunt falls on Kyriakos Gregoraios of Noble Governorship: the least
- GOAL people[1].line: "preserve the institution's position through the transition without ei → "follow the institutional alignment when it is made without appearing 
- CAST hooks[0].text: "In the succession crisis, the hand stirring it is Tao Zhao of Merchant Guilds: outranks t → "In the succession crisis, the hand stirring it is Ming Xiao of Merchant oligarchy: outran
- GOAL people[2].line: "identify who among their junior clergy is accepting bribes from merch → "build pastoral standing and institutional credibility through consist
- GOAL people[2].line: "identify who among their junior clergy is accepting bribes from merch → "follow the institutional alignment when it is made without appearing 
- GOAL people[0].line: "train the next cohort to a standard that might actually keep people a → "keep the unit functional and loyal to the institution rather than to 
- GOAL people[0].line: "identify who among their junior clergy is accepting bribes from merch → "extend the institution's civic role in ways that survive whatever gov
- CAST hooks[0].text: "In the raids, the brunt falls on Deepa Jain of Military/Guard: the least powerful of the  → "In the raids, the brunt falls on Savita Dixit of Guild Council: its people stand guard."
- GOAL people[0].line: "build pastoral standing and institutional credibility through consist → "manage the influx without the old residents concluding the governing 
- GOAL people[1].line: "exploit the climate of suspicion to remove a rival under cover of the → "build pastoral standing and institutional credibility through consist
- GOAL people[0].line: "secure emergency funding to repair the east wall before it becomes a  → "keep the enforcement apparatus out of the political contest long enou
- GOAL people[1].line: "identify who among their junior clergy is accepting bribes from merch → "build pastoral standing and institutional credibility through consist
- GOAL people[0].line: "formalize the independent operational authority that governance failu → "use the governance instability to advance commercial standing relativ
- GOAL people[2].line: "obtain the resources needed for a desperately needed charitable proje → "follow the institutional alignment when it is made without appearing 
- GOAL people[0].line: "find out where the hoarded reserves are before the council does." → "restore enough perceived legitimacy to make the governing role functi
- GOAL people[2].line: "identify who among their junior clergy is accepting bribes from merch → "maintain the position's relevance by demonstrating pastoral function 
- GOAL people[2].line: "identify who among their junior clergy is accepting bribes from merch → "build pastoral standing and institutional credibility through consist
- GOAL people[0].line: "extend the institution's civic role in ways that survive whatever gov → "manage the influx without the old residents concluding the governing 
- GOAL people[0].line: "find a new route after the customs increase made the old one uneconom → "maintain the arrangements that allow current operations while managin
- GOAL people[2].line: "restore a desecrated shrine before the annual festival (quietly, with → "extend the institution's civic role in ways that survive whatever gov
- GOAL people[0].line: "maintain traditional standing within the constraints that stable inst → "convert traditional standing into operational relevance through allia
- GOAL people[2].line: "restore a desecrated shrine before the annual festival (quietly, with → "extend the institution's civic role in ways that survive whatever gov
- GOAL people[0].line: "identify the weak link before the weak link identifies itself in a cr → "keep the unit functional and loyal to the institution rather than to 
- GOAL people[0].line: "secure emergency funding to repair the east wall before it becomes a  → "maintain the enforcement capacity and institutional culture that make

