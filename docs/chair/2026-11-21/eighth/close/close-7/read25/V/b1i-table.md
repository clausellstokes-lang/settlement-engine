**V: 900 places** (by terrain: coastal 158, riverside 145, mountain 80, forest 102, plains 195, hills 168, desert 52; config terrain differs from the route's terrain in 0).

Each cell: places where the house stands and NOTHING gives its thing / places where it stands. Terrain factor = the terrain half of `getResourceMultiplier` for that row on that terrain (replicated).

| row | lives on | coastal | riverside | mountain | forest | plains | hills | desert | bare, all |
|---|---|---|---|---|---|---|---|---|---|
| Fishing community | fish | 0/22 | 0/21 | · | 0/2 | 0/4 | · | · | **0**/49 |
| Fisher's landing | fish | 0/50 | 0/30 | · | 0/1 | 0/10 | · | · | **0**/91 |
| Fishmonger | fish | 0/3 | 0/3 | **1**/1 ×0.70 | · | **1**/2 ×1.30 | **1**/1 ×0.90 | · | **3**/10 |
| Fish market | fish | 0/69 | 0/61 | **20**/20 ×0.70 | **23**/29 ×1.00 | **72**/83 ×1.30 | **55**/55 ×0.90 | **25**/25 ×1.80 | **195**/342 |
| Woodcutter's camp | timber | · | · | · | 0/26 | · | · | · | **0**/26 |
| Charcoal burner | timber | 0/24 | 0/37 | 0/17 | 0/26 | **36**/51 ×1.30 | 0/42 | **12**/13 ×1.80 | **48**/210 |
| Sawmill | timber | 0/5 | 0/7 | 0/3 | 0/4 | **7**/10 ×2.34 | 0/8 | · | **7**/37 |
| Sawmill (commercial) | timber | 0/44 | 0/58 | 0/19 | 0/36 | **49**/63 ×2.34 | 0/38 | **15**/17 ×1.80 | **64**/275 |
| Hunter's lodge | game | 0/5 | **2**/8 ×1.30 | · | 0/6 | **7**/16 ×1.30 | 0/9 | **3**/4 ×1.80 | **12**/48 |
| Furrier's district | game | 0/33 | **19**/41 ×1.30 | **12**/15 ×0.70 | 0/30 | **20**/49 ×1.30 | 0/39 | **13**/15 ×1.80 | **64**/222 |
| Wildfowler | wildfowl | · | 0/1 | · | 0/1 | **1**/1 ×1.30 | **4**/4 ×0.90 | · | **5**/7 |
| Mine | ore | **6**/9 ×1.50 | **5**/26 ×1.30 | 0/13 | **1**/14 ×1.00 | **2**/30 ×1.30 | 0/28 | **1**/6 ×1.80 | **15**/126 |
| Mine (open cast) | ore | **1**/1 ×1.50 | **1**/2 ×1.30 | 0/1 | · | 0/11 | 0/5 | 0/1 | **2**/21 |
| Smelter | ore | **36**/41 ×1.50 | **19**/56 ×1.30 | 0/25 | **4**/29 ×1.00 | **4**/71 ×1.30 | 0/49 | **5**/18 ×1.80 | **68**/289 |
| Stone quarry | stone | 0/28 | **14**/37 ×1.30 | 0/20 | **4**/21 ×1.00 | **17**/48 ×1.30 | 0/48 | 0/10 | **35**/212 |
| Salt works | salt | 0/72 | **27**/27 ×1.30 | · | **6**/6 ×1.00 | **14**/14 ×1.30 | **1**/1 ×0.90 | 0/3 | **48**/123 |
| Peat cutter | peat | **2**/2 ×1.50 | 0/3 | **1**/2 ×0.70 | · | **5**/6 ×1.30 | **2**/6 ×0.90 | **1**/1 ×1.80 | **11**/20 |
| Potter | clay | **39**/48 ×1.50 | 0/59 | **26**/26 ×0.70 | **26**/36 ×1.00 | 0/73 | **58**/58 ×0.90 | **21**/21 ×1.80 | **170**/321 |
| Brickmaker | clay | **38**/47 ×1.50 | 0/50 | **27**/27 ×0.70 | **22**/30 ×1.00 | 0/74 | **52**/52 ×0.90 | **20**/20 ×1.80 | **159**/300 |
| Docks/port facilities | harbour | 0/74 | 0/43 | **5**/5 ×0.70 | **3**/12 ×1.00 | **4**/20 ×1.30 | **8**/8 ×0.90 | · | **20**/162 |
| Harbour master's office | harbour | 0/61 | 0/28 | **1**/1 ×1.00 | **2**/10 ×1.00 | **1**/13 ×1.00 | **8**/8 ×1.00 | · | **12**/121 |
| Shipyard | harbour | 0/54 | · | · | · | · | · | · | **0**/54 |
| River boatyard | harbour | 0/24 | 0/59 | · | 0/12 | 0/14 | · | · | **0**/109 |
| River ferry | harbour | 0/65 | 0/69 | · | 0/8 | 0/18 | · | · | **0**/160 |
| Barge and river transport company | harbour | 0/11 | 0/23 | · | 0/8 | 0/7 | · | · | **0**/49 |
| Shepherd | pasture | **6**/6 ×1.50 | 0/5 | · | · | 0/12 | 0/13 | **1**/1 ×0.90 | **7**/37 |
| Shepherd collective | pasture | · | · | · | · | 0/18 | 0/15 | · | **0**/33 |
| Dairy farmer | pasture | **9**/10 ×1.95 | 0/9 | 0/2 | · | 0/27 | 0/13 | **2**/3 ×0.72 | **11**/64 |

Places holding at least one bare house, by terrain: coastal 64, riverside 63, mountain 38, forest 40, plains 113, hills 85, desert 30; all 433.
