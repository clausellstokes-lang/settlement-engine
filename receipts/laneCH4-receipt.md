# TE-CH-4 RECEIPT

## STARTED 2026-08-24

Lane TE-CH-4. Slot `claude/composite-r4` = `c3289244d58b7259205d80594856e8e0cc520817`.
Worktree: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/695a70c5-80ee-4ebd-b806-a8c102244d16/scratchpad/laneCH4-tree` (detached at slot, created OK).
Disk at start: 21,199,952 KB free on `/` — well over the 2 GB floor.
`npm ci --no-audit --no-fund` launched in background (log: `../scratchpad/ch4-npmci.log`).

Cards read: LANE-LAW.md, SLOT-FACTS.md. NOTE both are STALE — LANE-LAW names slot
`510c51b766a4ef329a697d61f3006e23d4fb2325` (54 landings) and SLOT-FACTS names
`86794b5d2480d6bf7821aa390a82f99f4babeeca` (56 cars). My brief's slot `c3289244d5`
(60 cars, packets 179, census 2525/366/2159/21026/5848, ratchet 11 of 29,044) governs;
I will re-derive every figure by execution regardless.

## MEASUREMENTS EXECUTED (corpus 6 tiers x 84 seeds = 504 settlements, 1696 quarters, 0 gen errors)

Harness: `../ch4-corpus.mjs` -> `ch4-corpus.json`; `laneCH4-tree/ch4-canon.mjs` -> `ch4-canon.json`;
analysis `../ch4-baseline.mjs`, `../ch4-delta.mjs`, `../ch4-delta2.mjs`. All scratch-only, NOT committed.

### Item 5 — REGISTRY IS 14 (brief right, earlier brief's 12 refuted)
14 `quarters.push` sites; 14 plain-string `name:` literals; sha of the name block
`eb9662051721` byte-identical at e608542bd(2026-04-13), b76848c90, 62c5e8d67, 1fd128e3a,
c1ea091f7, c3289244d. 6/6 identical.

### Item 2 — the fold, re-derived
CANONICAL noble = **359** across **348** of 504 (brief said 396/363 — different corpus, same
structure). canonical government 411 + noble 359 = **770** = folded government EXACTLY.
`inferDominantFaction` can never see `noble`: CONFIRMED at factionProfile.js:128-134.
⚠ NEW: canonical vocabulary contains **NO `craft`** and **NO `civic`** instances at all (0 of 3038).

### Item 1 — THE DELETIONS, executed
Baseline rows WITH dominantFaction = **1423** of 1696.
- Shape D + SHIPPED CATEGORY_TO_ARCHETYPE = 1136 -> **NET -287** (brief guessed -333+44; real -287)
  losses: Common Residential 168->0, Noxious Trades 164->0; gain Mages' Quarter 90->135.
- Naive route (iii) adds a NEW regression: Government Quarter 211->118 (-93).
- **MY FIX** (canonical preference lists) = 1300 -> **NET -123**:
  rows LOST 168 / GAINED 45 / KEPT-RENAMED 340 / KEPT-SAME 915.
  Every surviving deletion is ONE earned class (Common Residential).

### Defects confirmed by measurement (all 168/168 or as noted)
- `den` unanchored: "Dense timber tenements" -> Common Residential classified **criminal** 168/168.
- Shadows District (the real criminal quarter) -> **merchant** 168/168 (via "hidden markets").
  The two are EXACTLY SWAPPED today.
- Noxious Trades -> **merchant** 164 (via "Trades" matching `trade`).
- Wealthy Residential -> **merchant** 168/168 (via landmark "Merchant Estates"), NOT residential.
- Mages' Quarter -> **craft** on 45 of 148 (a `guild`/`smith` landmark beats `arcane`, craft is
  pattern #4 vs arcane #7).
- Only **10 of 14** registry names ever appear in the corpus; Waterfront District, Fishing Landing,
  Woodcutters' Ground and **Artisan Quarter** are NEVER produced (0 occurrences).
- 5 of 12 categories are never produced today: residential, industrial, noble, foreign, military.

## RESUME POINT
- DONE: worktree+npm ci (468 pkgs, .husky/_ PRESENT so pre-commit RUNS), all corpus measurement
  above, instrument warning verified (districtProfile = 0 hits in generateSettlementPipeline.js),
  both panel paths confirmed one dir deeper (src/domain/townMap/{townLayoutV2,mapEdits}.js).
- NEXT: item 3 (§4.1 downstream figures: wealth/safety bands, map rings, wall-embrace,
  institution-class placement), item 4 (fabric-join direction), then the edit.
- EXACT NEXT COMMAND: measure band shifts with a variant of ../ch4-delta2.mjs.
