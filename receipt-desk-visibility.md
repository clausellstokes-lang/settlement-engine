# RECEIPT — lane DESK-VISIBILITY — **COMPLETE** (four cars, porcelain 0)
⟦Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 · Lane: DESK-VISIBILITY⟧
⟦Dock: $SC/laneVIS, arrived detached at `8b9031f4c7c89304d66646412773638618ce911b`, porcelain 0⟧

## ARRIVAL (CONFIRMED)
- `git -C $SC/laneVIS rev-parse HEAD` = `8b9031f4c7c89304d66646412773638618ce911b` — matches the brief.
- `git status --porcelain | wc -l` = **0**.
- `node_modules`: **452 top-level symlinks, 0 real package dirs** — not materialised, untouched.

## THE CARS
    5ce6a8776  car 1  four sentences that were lit and unseen come out from behind their folds
    6825c18a5  car 2  the walker learns to follow a mount to the fold that hides it
    38d071d9e  car 3  a ⛔ inside a JSDoc @property tag is a TypeScript syntax error
    b4bb29f07  car 4  my own arm convicted a gate that was working

**THE HEADLINE. Of 46 mounted positions, SIX drew where a reader could not see them, and the
two loudest instruments in the estate had already met the defect and coded around it in their
own test files. Four are cured, two are declared with a measured argument and the layout
ruling behind them handed to the chair, and a walker arm now follows every mount from its id
to the fold that would hide it — proved by running it against this dock's own uncured base,
where it convicts exactly the six.** Every claim below is CONFIRMED (executed evidence quoted)
or PLAUSIBLE (reasoning only).

---

## ⛔ BRIEF PREMISE CORRECTIONS, measured at my own tip before any act

| the brief says | measured at `8b9031f4c` | verdict |
|---|---|---|
| `Primitives.jsx:114` renders a collapsible Section as `{open && children}` | **line 114 exactly**, and `Collapsible` does the same at **line 83** | ⭐ CONFIRMED, and the class is TWO primitives, not one |
| the registry carries "~50 rows" | **46 rows** (`DOSSIER_MOUNTS.length` = 46) | corrected |
| the composition carries GEN3's four mounts | ⛔ **IT DOES NOT.** `git merge-base --is-ancestor c48d24ba5 HEAD` → **false**; `f8e18e6f7`, `a4ce9f80f` and DESK-9 car 1 `0b0906a02` are all *"exists, NOT ancestor"*. `UNMOUNTED_BLOCKS` still holds `DS-GEN-8`, `DS-REL-1`, `DS-POP-3`, `DS-GEN-18` | ⛔ **the four mounts GEN3 landed are NOT in my denominator** — the chair replays them later and they are UNMEASURED by this lane |
| CLOSED means `defaultOpen={false}` | **`defaultOpen={false}` is only 2 of the 6 offences.** Four more hosts carry a DATA-DEPENDENT `defaultOpen={<expr>}` and are shut on every world that falls the wrong side of the cut | ⛔ **the class is bigger than the brief's definition** |

## THE CLASSIFICATION TABLE — all 46 rows, denominator first
Resolved by a static reader (`$SC/vis/visibility.mjs`) that follows each mount from its id
to every site that DRAWS it — the JSX `mount="…"` prop form, and the `drawnAtMount(…)` call
form through its carrier variables, closed transitively and **scoped to the top-level
declaration that owns them** — then walks OUT of the drawing component to every place that
component is rendered, up to `OutputContainer.jsx` (the dossier root). Verdicts below were
derived INDEPENDENTLY by hand first, per file, and the two agree on all 46 rows.

A host is FIRST-PAINT-OPEN only when it is not `collapsible`, or its `defaultOpen` is
statically true. `{false}` is shut for every reader; any other expression is shut for some
world, which is the same defect on the towns that fall the wrong side of it.

**COUNTS — 40 OPEN · 4 CONDITIONAL · 2 CLOSED · 0 UNRESOLVED** (sentence rungs only: 36 / 4 / 2 / 0)

| verdict | rung | mount | block | host, and why |
|---|---|---|---|---|
| ⛔ **CLOSED** | sentence | `overview.origin` | DS-GEN-6 | `OverviewTab.jsx:502` `<Section title="Settlement Origin" collapsible defaultOpen={false}>` — **no reader ever sees it on first paint, on any world** |
| ⛔ **CLOSED** | sentence | `defense.supportingCapabilities` | DS-DEF-6 | `DefenseTab.jsx:518` `<Section title="Supporting Capabilities" collapsible defaultOpen={false}>` — same |
| ⚠ CONDITIONAL | sentence | `economics.foodSecurity` | DS-ECO-9 | `EconomicsTab.jsx:463` `defaultOpen={!!fb.deficit}` — dark on every town that FEEDS ITSELF |
| ⚠ CONDITIONAL | sentence | `economics.shadowEconomy` | DS-ECO-6 | `EconomicsTab.jsx:649` `defaultOpen={bmc>=15}` — dark below 15% black-market capture |
| ⚠ CONDITIONAL | sentence | `defense.publicOrder` | DS-DEF-3 | `DefenseTab.jsx:352` `defaultOpen={orderElevated||crimStructure==='organized'}` — dark on a calm town with unorganised crime |
| ⚠ CONDITIONAL | sentence | `defense.criminalStructure` | DS-DEF-4 | same host as above |
| OPEN ×40 | — | the other forty | — | full machine output at `$SC/vis/classification-raw.txt` |

### ⛔ THE FIXTURE THAT WAS ALREADY CHOSEN TO DODGE THIS
`tests/ui/economicsTabFlow.test.js:100-104` states it in writing:
*"the food balance carries a real DEFICIT so the Food Security section is `defaultOpen` and
its mount is actually in the DOM rather than behind a collapsed header."*
**The estate already knew the hazard at one position and answered it by picking a fixture
that opens the fold, rather than by reporting the position.** That is the same shape GEN3
found one tab over, and it is why a walker arm is owed rather than another careful fixture.

---

## ⭐⭐ THE FINDING IS BIGGER THAN "NOBODY CHECKED" — IT WAS WORKED AROUND, TWICE, IN WRITING
The brief says *"nobody has checked the mounts landed before it"*. Measured, that is too kind
to the estate and too hard on the lanes: **two landed lanes met this exact fold, wrote it
down, and answered it in the TEST rather than in the product.**

1. `tests/ui/defenseTabFlow.test.js` lines 18-22, verbatim in its own docblock:
   *"⚠ THE SUPPORTING CAPABILITIES SECTION IS `collapsible defaultOpen={false}`, and
   `Section` renders `{open && children}` — so its contents are NOT in the DOM until the
   header is clicked. An arm that asserted against the closed tab would report a dark mount
   for a wiring that works."* It then ships an `openSection()` helper that **clicks the
   header** before every assertion.
2. `tests/ui/economicsTabFlow.test.js` lines 100-104: *"the food balance carries a real
   DEFICIT so the Food Security section is `defaultOpen` and its mount is actually in the DOM
   rather than behind a collapsed header."*

Both suites are green. Both readers were dark. **A cure that lives in a test fixture is not a
cure**, and that is the argument for putting the law in the walker rather than in a third
careful fixture.

## THE CURES — four, each a re-host ABOVE the fold, never a deleted collapsible
| # | position | block | what changed | reader reach, before → after |
|---|---|---|---|---|
| 1 | `defense.supportingCapabilities` | DS-DEF-6 | the two lenses move from the FIRST CHILD of `Supporting Capabilities` to directly ABOVE it, framing the fold (`DefenseTab.jsx`) | **0 of 60 → 60 of 60** |
| 2 | `overview.origin` | DS-GEN-6 | the route line + tier overlay leave the `Settlement Origin` fold and frame it; they also stop waiting on `r.settlementReason`, so a town with no origin paragraph now hears the sentence (`OverviewTab.jsx`) | **0 of 60 → 60 of 60** |
| 3 | `economics.foodSecurity` | DS-ECO-9 | the town's own account of how it eats moves above the `Food Security` fold (`EconomicsTab.jsx`) | 59 of 60 → 60 of 60 |
| 4 | `economics.shadowEconomy` | DS-ECO-6 | the corpus line **and its `scaleNote` fallback together** move above the `Shadow Economy` fold, so nothing is doubled and the fold's own reader loses nothing (`EconomicsTab.jsx`) | ⭐ **1 of 60 → 60 of 60** |

⭐ **MEASUREMENT OVERTURNED MY OWN RULING ON CURE 4.** I had classified `economics.shadowEconomy`
as a lawful declaration (its line REPLACES `scaleNote` inside the badge, so hoisting the line
alone would double the page). Then I measured the cut: `defaultOpen={bmc>=15}` is true on **1 of
60** generated towns (5 tiers × 4 cultures × 3 seeds; `$SC/vis/reach.mjs`, `blackMarketCapture`
min/median/max **1 / 8 / 17**). DS-ECO-6's ONE speaking position was reaching under two percent
of the worlds this generator builds — the worst of the six, worse than the two `defaultOpen={false}`
rows in reach terms is a tie at nearly-never. The cure is to move the fallback WITH the line.

## THE TWO DECLARATIONS — with the figure, and the ruling handed up
`defense.publicOrder` (DS-DEF-3) and `defense.criminalStructure` (DS-DEF-4) both draw inside
`DefenseTab.jsx:352` `defaultOpen={orderElevated||crimStructure==='organized'}`, measured **OPEN
on 43 of 60** generated towns. They are DECLARED rather than cured, and the argument is one both
rows carry in `visibilityReason`: **the datum each sentence stands beside is inside the SAME
fold.** The DS-DEF-3 rungs arrive already PROJECTED BESIDE the DM's own `safetyDesc`, and that
field, the `Internal Security · First Survey` headline, the order badge and the safety band word
are all inside that section (measured by reading `DefenseTab.jsx:352-402`); DS-DEF-4's sentence
sits three inches under the criminal-structure card it was handed the key of. So the page never
prints a fact and hides the sentence about it. ⚠ **Whether a calm town should open that fold is a
LAYOUT ruling and it is the chair's, not a lane's** — I did not take it.

## MEASURED REACH OF THE CUTS (60 generated towns, `$SC/vis/reach.mjs`)
    Shadow Economy fold OPEN (bmc>=15):            1/60
    Criminal Architecture fold OPEN:              43/60
    Food Security fold OPEN (a real deficit):     59/60
    safety severity keys: {"dangerous":8,"stable":39,"unsafe":11,"controlled":2}
    criminal structures:  {"diffuse":5,"null":19,"semi-organized":6,"organized":30}

## LAYER CEILINGS — eslint's OWN counter, before and after (`src/components/**/*.jsx` max 600)
| file | base | tip | headroom |
|---|---|---|---|
| `DefenseTab.jsx` | 435 | **435** (+0) | 165 |
| `EconomicsTab.jsx` | 589 | **591** (+2) | ⚠ **9** |
| `OverviewTab.jsx` | 501 | **505** (+4) | 95 |
`npx eslint` on all six touched files → **exit 0**. The brief's STOP condition (opening a Section
past a size ceiling) never fired, and it could not have: every cure is a re-host, not an opened
fold, so no fold default changed. ⚠ `EconomicsTab.jsx` has NINE effective lines left; the next car
that touches it should extract a leaf.

## THE WALKER ARM — what it follows, and the two defects the controls caught
`tests/lint/dossierMountRegistry.walker.test.js`, one new describe (**THE FIRST-PAINT LAW**),
five test titles, no new file. It follows each mount in three steps and grades every
`Section`/`Collapsible` enclosing any draw site:
1. **from the id** — a `mount="…"` JSX prop, or the first argument of `drawnAtMount(…)`,
   spelled literally or through a module-scope const;
2. **through the CARRIER variables** the call's value flows into, closed transitively over
   `const X = …carrier…` and **scoped to the top-level declaration that owns them**;
3. **out of the drawing component** to everywhere that component is itself rendered,
   recursively, stopping at `OutputContainer.jsx` (the frame a tab's first paint happens in).

⛔ **TWO DEFECTS IN MY OWN READER, BOTH FOUND BY MEASUREMENT RATHER THAN REVIEW:**
1. **A FILE-WIDE CARRIER READER IS WRONG BECAUSE A CARRIER IS FUNCTION-SCOPED.**
   `WarFaithDesk.jsx` declares a local `drawn` in `WarDormantNote` AND another in
   `FaithNicheGlance`. Read file-wide, each mount got the other's draw sites and both graded
   **UNRESOLVED**. Scoping to the declaration span fixed both.
2. ⭐ **`<Collapsible>` TAKES NO `collapsible` PROP, AND KEYING ON THE ATTRIBUTE MADE THE ARM
   BLIND TO AN ENTIRE PRIMITIVE.** `Section` is a plain header unless passed `collapsible`;
   `Collapsible` IS the fold. My first `hostOpenness` returned `open` whenever the attribute
   was absent, so every `<Collapsible defaultOpen={false}>` graded OPEN — **three exist in the
   tree today** (`HistoryTab.jsx:230`, `HistoryTab.jsx:252`, `NPCsTab.jsx:162`) and the first
   mount to land inside one would have passed the new arm in silence. **The guard-the-guard
   arm caught it on its first run** (`expected 'open' to be 'closed'`), which is the whole
   argument for driving a reader over spellings before trusting it.

## ⭐⭐ THE PLANT: THE ARM CONVICTS THE COMPOSITION IT WAS BUILT AGAINST
Rather than plant a synthetic defect, the arm was run against a `git archive` extraction of
this dock's own base `8b9031f4c` (`node_modules` **symlinked**, never materialised), which is
the uncured tree. It reds with **exactly the six rows measured by hand**, each named with its
host and its verdict — quoted verbatim from `/tmp/vis-plant.log`:

    "defense.criminalStructure (DS-DEF-4) draws inside src/components/new/tabs/DefenseTab.jsx:352
       <Section title=\"Criminal Architecture & Public Order\" collapsible defaultOpen={orderElevat,
       which is conditional on first paint, and the row declares no visibility",
    "defense.publicOrder (DS-DEF-3) … conditional …",
    "defense.supportingCapabilities (DS-DEF-6) draws inside …:518 <Section title=\"Supporting
       Capabilities\" collapsible defaultOpen={false}>, which is closed on first paint …",
    "economics.foodSecurity (DS-ECO-9) …:463 … defaultOpen={!!fb.deficit} … conditional …",
    "economics.shadowEconomy (DS-ECO-6) …:649 … defaultOpen={bmc>=15} … conditional …",
    "overview.origin (DS-GEN-6) …:502 <Section title=\"Settlement Origin\" collapsible
       defaultOpen={false} accent=\"#6b5340\">, which is closed on first paint …"

`Test Files 1 failed | Tests 2 failed | 26 passed (28)` at base (the other failure is the
inherited ARM 3 red); at my tip the same file is `1 failed | 27 passed (28)` with only that
inherited red left. **CONFIRMED.**

## ⛔ THE ROSTER SWEEP — one real hit, cured at cause before any instrument ran
Grepped `tests/` and `scripts/` for every hand-frozen roster keyed on anything this lane
mints. Five address my files:

| roster | keyed on | verdict |
|---|---|---|
| ⛔ `tests/copy/.voice-mechanics-baseline.json` | em dashes and `!` inside STRING LITERALS of every `.js` under `src/domain`, **shrink-only** | ⛔ **HIT.** `dossierMounts.js` has NO entry, meaning zero today. My `visibilityReason` string carried **one em dash** (`…'organized'} — open on 43 of 60…`), which would have MINTED a new baseline entry and reded `voiceMechanics.test.js`. Rewritten to a comma; re-measured with the test's own char scanner: **em 0, bang 0.** |
| `tests/copy/.voice-mechanics-jsx-baseline.json` | `OverviewTab.jsx {"em":1,"bang":0}` | does not move: the Tier-3 scan walks JSX **literals** through `jsxLiteralWalk`, and I added no reader-facing string — only comments and a `data-testid` |
| ⚠ `tests/lint/.prose-numerics-baseline.json` | **path-and-line**, 23 rows on my files | **11 of 23 relocate**, all in `EconomicsTab.jsx` below its line 478 (478→492, 479→493, 480→494, 488→502, 489→503, 649→672 ×2, plus three multi-line rows in the same span). **Net zero rows** — no numeric literal or interpolation changed. ⛔ **AND THE REGISTER IS ALREADY STALE AT THE §900 BASE, INDEPENDENTLY OF ME**: every one of the 23 frozen line numbers already disagrees with the base tree (frozen 294 vs base **424** on DefenseTab; frozen 190 vs base **194**; frozen 637 vs base **649**), and 12 of the 23 do not move at all under my cars |
| `scripts/.raw-button-baseline.json` | `OverviewTab.jsx` raw `<button>` count | unmoved: I added none |
| `scripts/.observed-shape-readers-baseline.json` | reads of settlement fields | **no entry for any file I touched**, and I added no field read; a `data-testid` is not a settlement field |
| `scripts/.size-baseline.json` | per-file `max-lines` overrides | **no entry for any file I touched** — the 600 layer rule governs, and eslint exits 0 |

## REGISTER DELTAS — **PREDICTED IN WRITING BEFORE THE CENSUS RAN.** ⛔ NO REGISTER ACT TAKEN.
The frozen figures at my tip are `files 2523 · parked 371 · credited 2152 · titles 23204 ·
suiteTitles 6217` (`tests/lint/.lighting-census-baseline.json`).

| register | predicted delta | why, counted |
|---|---|---|
| lighting census `files` | **+1** (measured: base 2534 → tip 2535; frozen 2523) | ⛔ **ONE NEW TEST FILE: `tests/ui/mountFirstPaint.test.jsx`** — named here so the chair re-takes the census. It is the honest home for a NEW LAW that spans three tabs; putting a defense arm in `defenseTabFlow` and two economics arms in `economicsTabFlow` would have scattered the law and left `overview.origin` with no home at all |
| lighting census `credited` | **+1** | the new file carries live test titles |
| lighting census `titles` | **+10** | +5 in the walker (`test(` 23 → 28, counted on both sides) and +5 in the new file (car 4 added the fold-reader guard). ⚠ the ABSOLUTE figure cannot be stated: the census throws on `files` first and never reaches `titles` |
| lighting census `suiteTitles` | **+2** | +1 describe in the walker (4 → 5), +1 in the new file |
| lighting census `parked` | **371, unmoved** | nothing parked |
| prose-numerics `.prose-numerics-baseline.json` | **225 rows both sides, net zero; 11 rows RELOCATE** (all `EconomicsTab.jsx`) | path-and-line addressed. ⚠ already stale at base, see the roster table |
| mounts baseline `.dossier-mounts-baseline.json` | **UNMOVED** | I added no mount row and struck no id from `UNMOUNTED_BLOCKS`; the two rows I amended gained fields, not identity |
| writer-reach `scripts/.writer-reach-baseline.json` | **UNMOVED** (PLAUSIBLE) | no new corpus read, no read moved behind a JSX prop; the four hoists move a `<p>` within one component |
| tuning register `.tuning-inventory.json` | **UNMOVED** (PLAUSIBLE) | the one new named constant, `REASON_FLOOR = 120`, lives in a `tests/lint/` file; the register inventories `src/` |
| observed-shape `scripts/.observed-shape-readers-baseline.json` | **UNMOVED** | no new field read |
| sizeBaseline | **UNMOVED** | none of my files carries an entry; eslint's 600 layer rule governs and exits 0 |
| test-ratchet collapse floors | **UNBREACHED** (PLAUSIBLE) | +9 titles RAISES totals; the floors are 90% collapse floors |
| `tests/fixtures/.golden-freeze-register.json` | **NO ROW OWED — measured, not assumed** | `goldenFreeze.walker.test.js`'s roster arm keys on ENV SPELLINGS (`GOLDEN_ENV_PATTERN = /^UPDATE_[A-Z_]+$/`) and on 64-hex fingerprint literals. `grep -nE 'process\.env|UPDATE_|_REFREEZE|[0-9a-f]{64}'` over `tests/ui/mountFirstPaint.test.jsx` returns **nothing**: it pins no same-seed fingerprint and opens no record door, so LGT-P14-WITNESS does not reach it. It is not golden-adjacent by that walker's own definition |

## ⛔ A FINDING I DID NOT GO LOOKING FOR: TWO DS-ECO-6 VARIANTS ARE BYTE-IDENTICAL TO THE COMPONENT'S OWN `scaleNote`
`EconomicsTab.jsx`'s docblock CLAIMS it (*"two of this block's variants are byte-identical
copies of scaleNote itself"*). **Measured live over six generated towns** (`economyDeskRead`
called directly, no fixture):

| town | `bmc` | the DS-ECO-6 sentence the desk drew |
|---|---|---|
| metropolis / mediterranean | 8 | `"Minor shadow activity. Petty theft and small-scale unlicensed trade. A…"` ⛔ **byte-identical to `scaleNote`** |
| city / norse | 8 | `"A little of Bjornbø's trade goes unrecorded, small enough to annoy the…"` distinct |
| town / germanic | 8 | `"What passes for a shadow economy here has never grown into one. There…"` distinct |
| village / celtic | 1 | **NULL** — the desk is silent |
| town / mediterranean | 27 | `"Significant off-book activity. Merchants operating in the shadow econo…"` ⛔ **byte-identical to `scaleNote`** |
| city / germanic | 8 | `"What passes for a shadow economy here has never grown into one. There…"` distinct |

So on 2 of the 5 drawing towns the corpus prints the component's own fallback back at it: the
cure changes nothing for those readers, and it takes nothing from them either. **This is a
CORPUS row, not a component one, and it is not mine — no corpus sentence was changed (my
fence).** It is the same shape the desk records for `tradeFlow`, now confirmed on generated
worlds rather than asserted from a docblock.

⛔ **AND IT BROKE MY FIRST DRAFT OF THE UI ARM, which is the useful half.** The first draft
selected its fixture town by *"the position's node is in the DOM"*. For `economics.shadowEconomy`
that node ALWAYS exists — it carries `sentence || scaleNote` — so the arm picked town 1, where
the corpus had drawn a twin of the fallback, and then asserted the public gate against it:

    AssertionError: economics.shadowEconomy: the public dossier drew the SAME text — the paid
    gate did not survive the hoist: expected 'Minor shadow activity. Petty theft an…' not to be
    'Minor shadow activity. Petty theft an…'

The gate had survived perfectly; the ARM was wrong. **A position with a fallback cannot be
proved live by node presence** — the only available evidence that a corpus line was there is
that the anonymous render differs, so for that one position the selection and the gate proof
are the same act, and the file now says so instead of pretending to two proofs.

## THE VITEST RECEIPTS — every exit captured in-shell, through `sh scripts/gate-mutex.sh --run --`
⚠ THE MACHINE WAS CONTENDED ALL SESSION. The quiet-window law was probed continuously
(`$SC/vis/quiet-1.log`, `quiet-2.log`); the window opened at **11:51:51** after a 10-minute
wait (three consecutive probes, load-1 2.29/2.02/2.58 with 0 workers), closed again within
minutes, and a sibling then held the estate at 5-7 workers. One run of mine (12:01) was
**killed by its own 10-minute wall-clock while still WAITING on the mutex and produced no
output at all** — reported here rather than silently retried, because a timed-out wait is not
a result. Every later run was queued through the mutex, which serialises by design.

| # | tree | command | exit | result |
|---|---|---|---|---|
| P1 | tip (cures 1-3 only) | `… tests/ui/defenseTabFlow tests/ui/economicsTabFlow + the 3 walkers` | **1** | `4 passed / 1 failed` files — the ONE failure is ARM 3, proved inherited by P2 |
| P2 | **BASE `8b9031f4c`** (`git archive`, node_modules SYMLINKED) | `… tests/lint/dossierMountRegistry.walker.test.js` | **1** | `1 failed | 22 passed (23)`, the IDENTICAL `economyDeskRead.js` ARM 3 message ⇒ **INHERITED, not mine** |
| P3 | tip + the arm | `… tests/lint/dossierMountRegistry.walker.test.js` | **1** | `1 failed | 27 passed (28)` — the arm's 5 new titles all green; only the inherited ARM 3 red |
| P4 | **BASE + the arm** (the live plant) | same | **1** | `2 failed | 26 passed (28)` — the shipped-table arm convicts **exactly the six rows measured by hand**, by name, with host and verdict |
| R1 | tip | `… mountFirstPaint + defenseTabFlow + economicsTabFlow + tabs.smoke + the 3 walkers` | **1** | `2 failed | 101 passed (103)`. ⛔ ONE failure was MINE and it was the ARM, not the product: the `economics.shadowEconomy` fixture-selection defect above. The other is the inherited ARM 3 |
| R2 | tip | `npx vitest run tests/lint/` **WHOLE** | **1** | `Test Files 8 failed | 132 passed (140)`, `Tests 24 failed | 2158 passed (2182)` |
| R3 | **BASE `8b9031f4c`** | `npx vitest run tests/lint/` **WHOLE** | **1** | `Test Files 9 failed | 131 passed (140)`, `Tests 29 failed | 2148 passed (2177)` — **the base fails MORE than my tip** |
| R4 | tip | `npm run typecheck:domain:strict` (the REAL script) | **1** | ⛔ **`dossierMounts.js: 1 strict errors (baseline 0) — +1`, MINE**, cured in car 3 |
| R4b | tip, after car 3 | same | **1** | my file is GONE from the list; only `envoyChanceMeetingNews.js +2` remains, and R4c proves it inherited |
| R4c | **BASE** | `npx tsc --noEmit -p tsconfig.domain-strict.json` | — | `envoyChanceMeetingNews.js(505,24)` and `(655,24)` **TS7053 both present at base**, `dossierMounts.js` absent ⇒ **INHERITED** |

### ⛔⛔ THE TYPECHECK RED WAS MINE AND ONLY ONE INSTRUMENT IN THE ESTATE COULD SEE IT
    src/domain/display/stateProse/dossierMounts.js(152,46): error TS1127: Invalid character.
Column 46 is the **`⛔` inside `@property {'closed-section'} [visibility] ⛔ THE WRITTEN…`**.
The file is full of that character and always has been; the difference is WHERE — inside a
`@property` tag tsc is parsing a JSDoc TYPE ANNOTATION, and a non-ASCII symbol there is a
syntax error rather than prose. **eslint was green, all three mount walkers were green, every
vitest arm was green.** The one instrument that saw it is `npm run typecheck:domain:strict` —
exactly the script the desk law insists on because `domainStrictBaseline.test.js` passes on
injected inputs. ⚠ The declaration is also typed `string` and not the literal union, in
writing: `Object.freeze()` widens a string literal to `string`, so `{'closed-section'}` would
be unassignable from the very rows that declare it. `rung` is typed the same way for the same
reason.

## R2 vs R3 — EVERY FAILING ARM AT MY TIP IS PRESENT AT BASE, AT THE SAME COUNT
| file | base | tip | mine? |
|---|---|---|---|
| `couplingInclusion.walker` | 1 | 1 | **no** — names `worldPulse/deploymentReturn.js → irregularForce.js (INTERIOR→WAR)`, a file I never opened |
| `negativeAssertionAnchor.walker` | 2 | 2 | **no** — names `chanceMeetingKindPools.walker.test.js` (3 un-anchored) and `engineChunkLazy.test.js` (a stale ceiling). ⭐ **my new test file is NOT named**, so its negatives are anchored |
| `dossierMountRegistry.walker` (ARM 3) | 1 | 1 | **no** — the identical `economyDeskRead.js` message, proved twice (P2 and R3) |
| `tuningRegister.walker` | **6** | 2 | **no** — my two are a SUBSET of the base's six, and both name files I never opened (`worldPulse/irregularForce.js#IRREGULAR_TUNING`, `stateProse/economyStateProse.js#LEADER_FROM` / `#SOLE_EARNER_FROM`). The four extra at base are that file's own refreeze-ritual meta-tests |
| `sovereigntyLightingContract.walker` | 1 | 1 | **the ARM is inherited; the FIGURE moves by my one file** — see below |
| `proseNumerics` | 2 | 2 | **the ARM is inherited** — and the base diff already names **all 23** `EconomicsTab.jsx` rows as moved, exactly as the tip does. My cars relocate 11 of them further; net zero rows both sides |
| `writerReach.walker` | 13 | 13 | **no** |
| `observedShapeReaders.walker` | 2 | 2 | **no** |
| `observedShapeSentinel` | **1** | **0** | ⚠ **an ARTEFACT OF THE SUBSTRATE, not a base red**: it shells out to `git log --all -S<key>` and the extraction is not a git repo (`fatal: not a git repository`). Recorded so nobody reads it as a win |
| **totals** | **29 failed / 9 files** | **24 failed / 8 files** | the 5-test difference is exactly the 4 tuningRegister ritual arms + the 1 sentinel artefact |

### ⚠ THE LIGHTING CENSUS — THE COMPOSITION IS ALREADY 11 FILES OFF ITS FROZEN FIGURE
    BASE: expected 2534 to be 2523      TIP: expected 2535 to be 2523
(vitest prints ACTUAL first.) The frozen figure is **2523**; the §900 composition arrives at
**2534** before this lane touches it, and my ONE new test file takes it to **2535**. **My delta
is exactly +1, as predicted.** ⚠ The census asserts `files` FIRST and throws there, so the
`titles` and `suiteTitles` figures were never reached by either run — my predictions for them
(+9 titles, +2 suiteTitles, counted on both sides of `test(` 23 → 28 and `describe(` 4 → 5 plus
the new file's 4 and 1) stand UNEXECUTED and the chair should re-take the census rather than
trust them. **I opened no register door.**

## FORWARD RISKS FOR THE CHAIR
1. ⚠ **`EconomicsTab.jsx` has NINE effective lines left against the 600 layer ceiling** (591/600
   by eslint's own counter). The next car that touches it should extract a position leaf.
2. ⚠ **The §900 composition arrives with the lighting census 11 files off its frozen figure**
   (2534 measured vs 2523 frozen) and with `.prose-numerics-baseline.json` ALREADY STALE on
   `EconomicsTab.jsx`, `DefenseTab.jsx` and `SummaryTab.jsx` — every one of the 23 rows on my
   files disagreed with the base tree BEFORE this lane edited anything. Both registers are the
   chair's to re-take, and neither red can be read as a lane's.
3. ⛔ **The four positions GEN3 landed are NOT in this dock's history** (`c48d24ba5`, `f8e18e6f7`,
   `a4ce9f80f`, `0b0906a02` all exist and are NOT ancestors of `8b9031f4c`) — so
   `economics.craftReason`, `overview.steadings`, `relationships.network` and
   `overview.populationDirection` are **UNMEASURED by this lane**. When the chair replays them,
   the visibility arm judges them automatically; GEN3's own receipt says it hoisted DS-GEN-18
   above the `Supply Chains` fold, so the arm should be green over it, but that is a prediction
   and not a measurement.
4. ⚠ **`<Collapsible>` is a second habitat and it is currently empty.** Three exist
   (`HistoryTab.jsx:230`, `:252`, `NPCsTab.jsx:162`), all `defaultOpen={false}`, and no mount
   draws inside one today. The arm now grades them; before car 2 it could not.
5. ⚠ **The two declared rows are a LAYOUT question parked, not answered.** If the chair rules
   that `Criminal Architecture & Public Order` should open by default, both declarations become
   stale and the arm will say so on the next run — which is the point of the two-sided check.
6. ⚠ **DS-ECO-6 carries variants byte-identical to `EconomicsTab.jsx`'s own `scaleNote`**,
   measured on 2 of 5 drawing towns. A corpus row for whoever owns the economy leaf.

## WHAT THE ARM DELIBERATELY DOES CONSERVATIVELY (declared, so nobody re-discovers it as a bug)
- **A mount is CLOSED if ANY of its draw sites sits under a shut host.** Over-collecting sites
  can only ADD open hosts, never hide a shut one, so the rule fails toward a red. The failure a
  false GREEN would cause is the one this arm exists to prevent.
- **The component hop matches `<Name` across the whole component tree**, so two components
  sharing a name in different files would union their hosts. That direction is also a red, not
  a green. No such collision exists today.
- **GLANCE rows are out of scope by law, not by accident**: a glance draws no sentence, so
  there is no sentence for a fold to hide. The controls drive that case explicitly.
- **A mount the arm can follow to NO draw site is CONVICTED**, not passed over — this arm's own
  blindness has to be loud, or a rename would quietly retire the guard.

| **R7** | **BASE `8b9031f4c`** (the extraction, `node_modules` symlinked) | ⭐ **THE EXECUTED BEFORE-PROOF** — a scratch arm, never committed, that renders the UNCURED `DefenseTab` for a generated metropolis and asserts the DS-DEF-6 logistics sentence the desk PRODUCED is absent from the first paint | **0** | `Test Files 1 passed (1)`, `Tests 1 passed (1)`. So at base: the desk returns the sentence (`typeof … === 'string'`), the header reads `aria-expanded="false"`, `container.textContent` does **NOT** contain it, and after ONE click on that header it does. **The sentence existed and the reader got no bytes** |
| R6 | **FINAL tip `b4bb29f07`** | `npx vitest run tests/lint/` **WHOLE** (the dir run the desk law owes for a test-adding train) | **1** | `Test Files 8 failed | 132 passed (140)`, `Tests 24 failed | 2158 passed (2182)` — **byte-identical totals to R2 and the SAME EIGHT FILES**, so cars 3 and 4 moved nothing. The failing-arm list, in full: `couplingInclusion` (1) · `dossierMountRegistry` ARM 3 (1) · `negativeAssertionAnchor` (2) · `observedShapeReaders` (2) · `proseNumerics` (2) · `sovereigntyLightingContract` (1) · `tuningRegister` (2) · `writerReach` (13). Every one is present at base at the same count |
| R5 | tip (after the car-4 cure) | `… mountFirstPaint + defenseTabFlow + economicsTabFlow + tabs.smoke + the 3 walkers` | **1** | ⭐ `Test Files 1 failed | 6 passed (7)`, `Tests 1 failed | 103 passed (104)` — **all five first-paint arms GREEN**; the one failure is the inherited ARM 3 |

## THE OUTCOME TABLE
| step | outcome | sha |
|---|---|---|
| 1 — measure with a denominator, all 46 rows, confirmed by rendering | **DONE.** 40 OPEN · 4 CONDITIONAL · 2 CLOSED · 0 UNRESOLVED, by hand and by machine independently, agreeing on all 46 | (no car; the table is this receipt's, the code is `$SC/vis/`) |
| 3 — cure the CLOSED ones | **DONE, four of six**, each a re-host above the fold with a DOM proof | **`5ce6a8776`** |
| 2 — the walker arm + the registry's one exemption | **DONE**, proved by a live plant against the uncured base | **`6825c18a5`** |
| — the strict-typecheck red my own car minted | **CURED** | **`38d071d9e`** |
| — my own UI arm's fixture-selection defect, and a second guard for the fold reader | **CURED** | **`b4bb29f07`** |
| STOPPED ON | nothing forced a stop. The brief's stop condition (a size ceiling) never fired, because every cure is a RE-HOST and no fold default changed. **Two rows are DECLARED rather than cured** and the layout ruling behind them is handed to the chair, which is a deliberate refusal to take an owner/chair-shaped call, not a blocked step |


## ⭐ RETROVALIDATION ROW (for the Fable 5.1 chair)
| # | what an Opus seat JUDGED | what the chair must RE-DERIVE | receipts by path | priority |
|---|---|---|---|---|
| 1 | ⛔⛔ **The CLASS is bigger than the brief's definition.** The brief defines CLOSED as `defaultOpen={false}` and would have found 2 rows. A DATA-DEPENDENT `defaultOpen={<expr>}` hides the sentence on every world the wrong side of the cut, which is the same defect on those towns — and it caught 4 more, including the worst one | that a conditional fold is the same defect and not a lesser one; the 1/60, 43/60 and 59/60 figures | `$SC/vis/reach.mjs`; the classification table | ⭐⭐⭐ the whole shape of the act rests on it |
| 2 | ⭐⭐ **Measurement overturned my own ruling on `economics.shadowEconomy`.** I had it as a lawful declaration; 1-of-60 made it the worst offender and I cured it by moving the FALLBACK with the LINE | that moving `scaleNote` out of the badge with the corpus line is right, and that the badge reads well without its paragraph | `EconomicsTab.jsx` shadow section; car 1 | ⭐⭐⭐ product-facing |
| 3 | **Two rows DECLARED rather than cured** (`defense.publicOrder`, `defense.criminalStructure`) on the argument that the datum folds WITH the sentence | that the argument holds, and the LAYOUT ruling it defers — should a calm town open that fold? **That call is the chair's and I did not take it** | `dossierMounts.js` `visibilityReason` ×2 | ⭐⭐ chair-facing |
| 4 | **A NEW REGISTRY FIELD PAIR** (`visibility` / `visibilityReason`) and a new law paragraph in the registry docblock | that a `dimensions`-shaped optional declaration is the right escape hatch, and that a length floor (120 chars) is the right non-vacuity guard rather than a vocabulary | `dossierMounts.js` typedef + FIRST-PAINT LAW section | ⭐⭐ |
| 5 | **A NEW TEST FILE**, `tests/ui/mountFirstPaint.test.jsx` (4 titles, 1 describe) | that a new file is the honest home for a law spanning three tabs, versus scattering three arms into two existing flow suites and leaving `overview.origin` homeless. **The chair re-takes the lighting census either way** | the file; the census prediction | ⭐⭐ landing |
| 6 | **The arm's DRAW-SITE resolver** — a lexical def-use walk with a cross-component hop | that following carriers and hopping out of a component is sound, and that the `OutputContainer.jsx` stop is the right root | the arm's helpers; the base plant convicting six rows | ⭐⭐ |
| 7 | ⭐ **The `<Collapsible>` blindness my own guard-the-guard caught**, and the fix that keys openness on the TAG | that `Section`-without-`collapsible` really is a plain header, so grading it `open` is right | `Primitives.jsx:62,83,90,114`; the guard arm | ⭐⭐ |
| 8 | ⛔ **A `⛔` inside a JSDoc `@property` tag is TS1127**, and only `typecheck:domain:strict` could see it | that moving the character into the description body is the cure, and that `string` (not the literal union) is the right annotation under `Object.freeze` | car 3; `R4.log` / `/tmp/vis-tc2.log` | ⭐⭐ |
| 9 | ⛔ **The em-dash the ROSTER SWEEP caught before any instrument ran** — one `—` in a `visibilityReason` would have minted a new `voice-mechanics-baseline` entry on a shrink-only register | that `dossierMounts.js` really carried em 0 / bang 0 before and after | the roster table | ⭐⭐ |
| 10 | **The brief error: my dock does NOT carry GEN3's four mounts**, so the denominator is 46 rows and not ~50, and GEN3's positions are unmeasured here | that the chair's replay order is what the brief assumed, and that the arm judges them on arrival | `git merge-base --is-ancestor` results | ⭐⭐ |
| 11 | **Every red at my tip attributed to the base by an executed run**, including the `observedShapeSentinel` red that is a SUBSTRATE ARTEFACT and not a base red | that a `git archive` extraction is an acceptable attribution substrate given that one walker and one sentinel refuse to run outside a repo | R2 vs R3 | ⭐⭐ |
| 12 | ⛔ **A position with a FALLBACK cannot be proved live by node presence** — my first UI arm made that mistake and convicted a gate that was working | that "the private render differs from the public one" is the right liveness test for such a position, and that saying so beats faking two proofs | `mountFirstPaint.test.jsx` `provePosition` docblock | ⭐⭐ |

## WHAT THIS LANE DID NOT DO
No register act — no `--update`, `--write`, `--genesis`, `--rebank`, no `*_REFREEZE` or
`UPDATE_*` env var, no baseline edited by hand. No corpus sentence changed. No fold DEFAULT
changed and no collapsible deleted. No `npm run build`, no `npm install`, no `node_modules`
touched (452 top-level symlinks, 0 real package dirs, on arrival and at the tip), no `git
stash`, no `git add -A`, no `--amend`, no push, no ref write, no rebase. No subagent.

## REPRODUCING THE PROOFS
The base substrate is a `git archive` extraction of `8b9031f4c` with `node_modules`
**SYMLINKED**, never materialised (264 MB; delete and rebuild in seconds):

```sh
git -C <dock> archive 8b9031f4c | tar -x -C <dir>
ln -s <dock>/node_modules <dir>/node_modules          # SYMLINK, never materialise
cp <dock>/tests/lint/dossierMountRegistry.walker.test.js <dir>/tests/lint/   # for the plant
cd <dir> && npx vitest run tests/lint/dossierMountRegistry.walker.test.js    # convicts 6 rows
```

The measurement tools are kept beside the receipt and are read-only over the tree:
`$SC/vis/visibility.mjs` (the resolver, the prototype of the walker arm),
`$SC/vis/drive.mjs` (the 46-row classification),
`$SC/vis/reach.mjs` (the 60-town fold-reach measurement),
`$SC/vis/sections.mjs` (the per-file Section-stack probe used for the hand pass),
with the run logs at `$SC/vis/R1.log` … `R7.log`, the never-committed before-proof at
`$SC/vis/base/tests/ui/__visBeforeProof.test.jsx`, `$SC/vis/classification-{base,tip}.txt`,
and the quiet-window logs at `$SC/vis/quiet-1.log` / `quiet-2.log`.


---

## ⛔ THE ONE RED THAT IS MINE, AND IT IS NOT A DEFECT — SAID PLAINLY
Nothing at my tip is red because of a defect this lane shipped. Two registers move and both
are the chair's to take at the landing:
- the **lighting census** `files` figure, by exactly **+1** (my one new test file), on a
  composition that already arrives 11 files off its frozen number;
- **prose-numerics**, where 11 of the 23 rows on my files relocate — on a register that was
  ALREADY stale for all 23 before this lane opened a file.
Every other failing arm in `tests/lint/` at my tip is present at the base at the same count,
proved by an executed run rather than by argument.

**DOCK TIP: `b4bb29f07d9eb76e3651dec6041cf4ccc6b3835c`** — porcelain **0**, `node_modules`
**452 symlinks / 0 real package dirs** (unchanged from arrival), all four cars carrying
`Seat: Opus 5 — Fable-unvalidated` and `Lane: DESK-VISIBILITY`.
