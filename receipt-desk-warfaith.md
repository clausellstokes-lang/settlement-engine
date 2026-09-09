# RECEIPT — DESK-WARFAITH (DESK-4) — **COMPLETE** (car `7dba5508b`)
Seat: Opus 5 — Fable-unvalidated · Lane: DESK-WARFAITH · Chair: Fable 5.1
Dock: $SC/laneWARFAITH · start HEAD `940d161ca` · porcelain 0 at arrival (CONFIRMED, `git status --porcelain | wc -l` = 0)

## STATUS: LANDED. One car, `7dba5508b`, porcelain 0. Every claim below carries an executed receipt.

## Arrival receipts (CONFIRMED)
- `git rev-parse HEAD` = `940d161ca155ab2be76c9d15b9a8207d9c2f7c2f`
- `git status --porcelain | wc -l` = 0
- `node_modules/pg` is a symlink to the main repo (not materialised)
- `uptime` load-1 at arrival = 26.06 — a gate is presumed RUNNING; no vitest until the quiet window law is satisfied.

## RE-DERIVED PREMISES (before any build)
| Chair claim | My measurement | Verdict |
|---|---|---|
| 9 blocks DS-WAR-1..5 / DS-FTH-1..4 in UNMOUNTED_BLOCKS | present, lines 304-306 of dossierMounts.js | CONFIRMED |
| 138 pools, 418 authored variants | 138 / 418 exactly (node probe over the leaf) | CONFIRMED |
| no warFaith desk module | `ls src/domain/display/stateProse/` has none; 0 src importers of `DOSSIER_STATE_PROSE_WAR_FAITH` | CONFIRMED |
| darkness probe `PATRON: rankAxis` → 0 src files | 0 | CONFIRMED |
| darkness probe `WALLED-QUIET` → 0 src files | **2** — but both are the DEFENSE leaf (`defense.generated.js:2975`, `defenseStateProse.js:739`). The token is not a warFaith pool key at all. | **CHAIR CLAIM WRONG, conclusion unaffected** |
| war tab id `war`, faith tab id `faith` | both in OutputContainer's `renderTab` switch (l.724/725) | CONFIRMED |
| WarTab 470 wc-lines / FaithTab 227 wc-lines | 471 / 228 physical (`wc -l`) | CONFIRMED (off-by-one = trailing newline) |
| headroom 367 / 147 effective vs the 600 ceiling | **367 / 147 effective** (ESLint Linter, skipBlankLines+skipComments) | CONFIRMED at 940d161ca |
| "every other desk mounts only `sentence` rungs" | **FALSE** — `economics.economyTile/foodTile/seasonTile` are all `glance` rungs today | **CHAIR CLAIM WRONG** |
| the two-tab split needs a `glance` on the non-speaking tab | see THE SPLIT below — refused for the cross-tab case, with measurement | PARTIAL REFUSAL |

## MEASURED FACTS THE BRIEF DID NOT CARRY
- ⭐ **ZERO STATE DIMENSION MARKS IN THE WHOLE LEAF.** The only `marks` value across all 138 pools is `dm-only` (the audience mark). `poolDimensions` is `[]` for every warFaith pool, so **no mount row owes a `dimensions` declaration** and the walker's honesty arm is satisfied by omission. (Trap 3 does not apply to this leaf.)
- ⭐ **`war` and `faith` ALREADY receive `publicDossier`** from OutputContainer (l.724/725). **Zero OutputContainer edits are needed** — the physical-line-neutral fence is satisfied by not touching the file.
- ⛔ **The walker's ARM 2 admits EXACTLY ONE component file that calls `<desk>StateProse(`.** Two tabs cannot both call the desk. Cured architecturally: a single new draw leaf `WarFaithDesk.jsx` owns the one call and the one `publicDossier` gate, and both tabs render its components. This is STRICTER than the economy/power precedent (two hand-placed gates); one gate covers both tabs.

---
# STATUS: **COMPLETE** — one car, committed, porcelain 0.
**Car sha `7dba5508b`** (on `940d161ca`) · 7 files · `Seat: Opus 5 — Fable-unvalidated` · `Lane: DESK-WARFAITH`

## ⛔ CORRECTION TO MY OWN COMMIT MESSAGE (read this first)
The commit body says the mounts baseline "shrinks 37 -> 31". **The DELTA is right (−6); both
ABSOLUTES are wrong by one.** MEASURED after committing, from `HEAD~1` and the live module:
`UNMOUNTED_BLOCKS` **36 → 30**, `DOSSIER_MOUNTS` **33 → 40**. No `--amend` (it voids the
trailer the retrovalidation reads), so the correction lives here. Use these figures.

## THE SPLIT, PER BLOCK (the brief's central question)
| mount | tab | block | rung | why this tab, this depth |
|---|---|---|---|---|
| `war.standing` | war | DS-WAR-1 | **sentence** | its five producers are read by WarTab and by nothing on FaithTab |
| `war.treaties` | war | DS-WAR-2 | **sentence** | `renderTreatiesForSettlement` renders on the war tab (TreatyBlock) |
| `war.dormantNote` | war | DS-WAR-3 | **sentence** | THE cross-tab block. It speaks on WAR because war is the only tab that can EVALUATE it: the faith half is the absence of `primaryDeitySnapshot` (readable anywhere), the war half needs a worldState FaithTab holds none of by §805's constitution. A tab that can answer half a condition cannot host the sentence. |
| `faith.patronSeat` | faith | DS-FTH-1 | **sentence** | `faithPanelModel`'s live panel: rank, cults, devotion, arc, standings, sink, mandate |
| `faith.teaser` | faith | DS-FTH-2 | **sentence** | the patron-less town's own voice |
| `faith.creedStanding` | faith | DS-FTH-3 | **sentence** | standing / legitimacy / niche contest / patron fall |
| `faith.nicheRow` | faith | DS-FTH-3 | **glance** | the leaf's ONE glance: the niche row ALREADY prints the standing word those pools are keyed on, so the record appears here and must not speak here |

### ⛔ I REFUSED the brief's suggested cross-tab glance, with measurement (CONFIRMED)
The brief expected "a `glance` on the non-speaking tab". **No cross-tab glance on this leaf is
honest.** A glance rung draws a band word the surface ALREADY carries and no sentence
(`drawnAtMount` strips sentence + provenance). Neither tab carries the other's band, and a
`faith.dormantNote` row would have a **null rung in every world** — a position the registry
names and the tree can never fill, which is the citation shape the reachability arm exists to
refuse. Silence on the second tab is R-DST-K. The one honest glance is *within* the faith tab.

Two further chair claims corrected: `WALLED-QUIET` returns **2** src hits, not 0 (both on the
DEFENSE leaf — the probe token was misattributed; the darkness conclusion still holds), and
"every other desk mounts only `sentence` rungs" is **false** — `economics.economyTile/foodTile/
seasonTile` are all `glance` today, so the rung was not new ground even if the page-set was.

## WHAT A PATRON-LESS SETTLEMENT RENDERS (the brief's explicit question) — CONFIRMED
`faithPanelModel` answers `{ hasEmbed: false }`. Executed receipt, real producer, seed `greyford`:
> **"No faith holds the town. The observances are real, and they are nobody's in particular."**

- **Honest, non-empty, and it names no creed and no god** — all four PRIVATE DOSSIER variants are
  asserted deity-free in the desk test, not just the drawn one.
- Every other faith position is **silent**: no seat, no standing, no arc, no niche glance.
- Position by position on a patron-less town: `faith.patronSeat` **nothing** · `faith.creedStanding`
  **nothing** · `faith.nicheRow` **nothing** · `faith.teaser` **the line above**.
- On the **anonymous public dossier** all seven positions render **nothing** (O2GATE), so the
  corpus's own `PUBLIC / SHARED DOSSIER` pool is unreachable — see the findings.

## FINDINGS (each declared, pinned, with the ONE ACT that lights it)
1. **⛔ SLOT-ROLE INVERSION, and it shipped a fluent false sentence in the smoke render.** Every
   `occupierHoldings.*` variant is written from the OCCUPIED town's chair; the reader whose NAME
   matches is the HOLDER's dossier reading. Cured by taking the reading for this town's OCCUPIER.
   Mirror case (a town that occupies others) has no pool and stays dark. CONFIRMED, pinned.
2. **⛔ The mandate lens disagreed with its own producer.** Hand cut at 0.5/0.75; `divineMandateStatus`
   cuts at 0.4/0.6 AND is government-scoped. Now reads the canonical status. CONFIRMED, pinned.
3. **⛔ `templeWealth` HAS NO WRITER IN THE ENGINE** (WF-7 design-doc future; the estate's own
   `DESIGN_FP_ARCH_WF.md` V27 row records `grep templeWealth in src/domain: 0` as VERIFIED).
   DS-FTH-4 rests on it ⇒ DARK. ONE ACT: the banded temple stock + `tenure` in the projection.
4. **⛔ DS-FTH-2's `PUBLIC / SHARED DOSSIER` pool is authored for the ONE reader §885.3 forbids.**
   The block names no deity by construction, which is exactly why a free viewer could see it
   safely — but O2GATE nulls every rung there. ONE ACT: an **owner-gated** carve-out of DS-FTH-2
   from the paid-surface line. Raised, not taken.
5. **DS-WAR-4 DARK.** Its 5 keys are the vocabulary of `aggressionPosture`, a module-PRIVATE
   function in `src/pdf/lib/liveWorld.js`. The one EXPORTED band reader, `aggressionChip`, spells
   two differently (`Aggressive`, `Pacifist`) and returns null for `Even-handed`. ONE ACT: hoist
   one posture ladder both read.
6. **DS-WAR-5 DARK.** Occupation pools restate DS-WAR-1 from the same datum; resistance pools exist
   only as PHRASES with no token (label trap); aftermath/blockade/burden need reads the tab does
   not perform. ONE ACT: a token-returning resistance ladder + an aftermath reader.
7. **`mobilization: COVERT` is reachable by the DESK and unreachable by the WIRING.** WarTab calls
   `settlementMobilization` with `includeCovert` defaulted false. Filed as a TAB-side finding, NOT
   in the corpus-unreachable ledger — the distinction cost one red and is now pinned. ONE ACT:
   `includeCovert: includeGroundTruth` at that call (a DM-truth disclosure decision, chair's).
8. **⛔ The observed-shape verdict was FALSE about the code and TRUE about the corpus.** The walker
   convicted `config.primaryDeitySnapshot` / `config.faithProfile` as "keys no writer produces".
   Both have real writers; the walker measures that **its deity-free observation corpus** carries
   neither — the same fact that blocks walking the faith mounts. Deleting on its word would have
   been the observation-ratchet trap. Cured by routing both through canonical readers.
9. **DS-FTH-2's `[street]` variant is a BYTE-IDENTICAL copy of FaithSection's teaser body.** The
   `canonical`-angle hazard the economy desk records. The position is placed in the one branch
   where FaithSection renders nothing, so they can never both print.
10. **DS-WAR-1 has no `Under siege` pool** (WarTab's ladder names four states, the corpus authored
    three). A besieged town draws nothing at that lens — silence, not the nearest neighbour.

## RECEIPTS — every exit captured in-shell
| proof | result |
|---|---|
| `tests/domain/warFaithStateProseDesk.test.js` (**NEW FILE**) | **28/28, exit 0** — CONFIRMED |
| `tests/components/dossierDepthTabs.test.jsx` (+7 arms) | **25/25, exit 0** — CONFIRMED |
| the three mount walkers | **35/35, exit 0** — CONFIRMED |
| `tests/data/dossierStateProseProjection.contract.test.js` | green, exit 0 — CONFIRMED |
| `npm run typecheck:domain:strict` (the REAL script) | **exit 0**, 1121/ceiling 1121 — CONFIRMED (was +9 in my file; all nine cured) |
| `npx eslint` on all 7 touched files | **exit 0** — CONFIRMED |
| `npx vitest run tests/lint/` WHOLE | **exit 1 — 2127/2131.** 4 arms, **ALL PRE-EXISTING** |
| effective lines vs the 600 layer ceiling | WarTab **367 → 407**, FaithTab **147 → 174**, WarFaithDesk **92** (new). No Glance-leaf extraction needed; no `.size-baseline.json` entry owed. |
| `OutputContainer.jsx` | **UNTOUCHED** — `war`/`faith` already receive `publicDossier` |

### The four remaining `tests/lint/` arms are pre-existing — PROVED, not assumed
Planted my two new src files OUT and re-ran: `observedShapeReaders` **stays red** at
`violations: 1` (`economyStateProse.js: isCriminal on incomeSources` — a file this car never
touched, `git diff --stat HEAD` empty) and `explainedWriters.banked 65 vs 64`.
`clampPrimitiveBaseline` is the banked-census row (62 banked vs 78 live) the brief already
excludes. The 4th is the lighting file census, which is **mine and is a register act** (below).

### ⭐ PLANT-OUT — the CITATION LAW proved in both directions (CONFIRMED)
With the desk drawing **NOTHING** but every mount literal still present:
- `dossierMountRegistry.walker` **passes 20/20** — structurally blind to a dead draw, exactly as
  its own docblock warns.
- **All SEVEN new UI arms go RED.** They are what makes these mounts real rather than cited.
With the new src files removed instead, the walker reds on **7 unreachable mounts + ARM 2**.
Both restores verified **byte-exact by `cmp`** against backups taken BEFORE the plant.

## PREDICTED REGISTER DELTAS — I took NONE; the chair takes all of them at the landing
| register | before | after | note |
|---|---|---|---|
| `tests/lint/.dossier-mounts-baseline.json` | banked **64**, live **36** | live **30** | a lawful SHRINK (−6). Passes today (30 ≤ 64); the chair may re-bank 64 → 30. |
| `DOSSIER_MOUNTS` rows | 33 | **40** | +7 (six blocks, one of them twice) |
| lighting census (`sovereigntyLightingContract`) file count | **2522** | **2523** | **+1, and it is the ONE new test file.** The only red this car owns. |
| test-ratchet `totalFiles` + the known-failure file list | — | +1 each | the other two of the three censuses a new test file reds |
| prose-numerics (path-and-line addressed) | — | net zero, rows RELOCATE | files carrying frozen rows that I edited: `WarTab.jsx`, `FaithTab.jsx` (neither carries a row today — grep of `.prose-numerics-baseline.json` returned none, so likely a true no-op) |
| writer-reach | — | possible FALSE DARK | two reads moved BEHIND a JSX prop (`hasPatron`, `patronFallCause` now arrive as readings). If the scanner grades them dark, absorb with plain `--write`; ⛔ never "cure" the component to appease it. |

**NEW TEST FILE, NAMED FOR THE THREE CENSUSES: `tests/domain/warFaithStateProseDesk.test.js`.**
It is the only new test file this car adds. UI coverage went into the EXISTING
`tests/components/dossierDepthTabs.test.jsx` precisely to avoid a second census hit.

## WHAT I COULD NOT MOUNT HONESTLY
**3 of 9 blocks stay dark** — DS-WAR-4, DS-WAR-5, DS-FTH-4 — findings 3/5/6 above. A block with
no pool that is both reachable and unspoken cannot be mounted: the position would be a citation
that cites nothing. **19 of the 98 pools** on the six MOUNTED blocks are likewise declared
unreachable in a ledger the desk test asserts as the EXACT complement of what the desk reaches,
so a pool that becomes reachable reds there instead of staying quietly dark. 79 pools are reached.

## RETROVALIDATION ROW
| what was judged | what the Fable chair must re-derive | receipts by path | priority |
|---|---|---|---|
| **The cross-tab glance was REFUSED** (brief asked for one) | that a `faith.dormantNote` glance would carry a null rung in EVERY world, and that no warFaith state is surfaced as a band on BOTH tabs | `dossierMounts.js` DESK CAR 4 comment; `warFaithStateProse.js` header | **HIGH** — it contradicts the brief |
| **Mounts figures in the commit message are wrong by one** (37→31 written; 36→30 true) | `git show HEAD~1:…/dossierMounts.js` vs live | the CORRECTION section above | **HIGH** — a stale figure in a landed message |
| **6 of 9 mounted, 3 dark** | that `templeWealth` has no writer (V27), that `aggressionPosture` is unexported, that DS-WAR-5's resistance ladder has no token | `warFaithStateProse.js` "DECLARED DARK" block; `DECLARED_UNREACHABLE` in the desk test | **HIGH** |
| **Two judgment cuts, vetoable** | the ramp splits at >2 ticks remaining; the leading term/document is "most strained, then earliest to lapse" | `mobilizationPoolKey`, `leadingTerm`, `leadingDocument` | MEDIUM |
| **DS-FTH-2's public pool is owner-gated** | that lighting it is a paid-surface behaviour change (§885.3) and therefore not a lane's call | finding 4 | MEDIUM — **owner queue** |
| **The mandate phrase map** is the one place this desk keys on a PHRASE | that `divineMandateStatus` offers no token that separates its two propping outcomes | `MANDATE_POOL_BY_PHRASE`; the totality arm drives the real reader | MEDIUM |
| **The single-call-site architecture** (`WarFaithDesk.jsx`) | that ARM 2 admits exactly one caller per desk, so two tabs cannot each call it | walker ARM 2; plant-out receipt | MEDIUM |
| **4 pre-existing `tests/lint/` reds** | the plant-out receipt, if the chair doubts the attribution | plant-out section above | LOW |
