# WF — SUBSTRATE PRE-VERIFICATION ANNEX (SPV, `DESIGN_PREVERIFICATION.md` §1)

**Volume:** `docs/DESIGN_FP_ARCH_WF.md` — WF-ARCHITECTURE, THE FAITH PROGRAM, COMPILED FOR BUILD.
**Lane:** TC-WF, read-only OPUS COMPILE lane under ODQ §291.5. Committed nothing, edited nothing,
staged nothing, ran no gate, no `npm run check*`, no `gate-mutex.sh`, no git write of any kind.
**Destination:** `docs/implementation/preverification/WF-SUBSTRATE.md`, landed by the chair.

---

## HEADER (per §1.3)

| Field | Value |
|---|---|
| **SWEEP SHA** | `f8d978dfeb08d26d0edfd30798d9401beaf4f05c` (`claude/composite-r4`, the build branch) — the CODE OF RECORD. Recorded at sweep start; every row below reads the COMMIT TREE via `git show <sha>:<path>` / `git grep <pattern> <sha>`, never the working tree, which matches no branch |
| **Volume sha swept (BUILD copy)** | `f2e5c935a3bc826e5b4b94a288216331cf57e719` — **774 lines** |
| **Second copy reconciled (LEDGER copy)** | `169c75e7596dc8dd44b2eaffd6df9a6190f5e53e` (`review-fixes-2026-07-08`) — **846 lines**. ⛔⛔ **THE TWO COPIES DIVERGE MATERIALLY, IN NINE HUNKS, AND EVERY HUNK IS A §78 CURE.** See THE COPY DIVERGENCE below. This is the single most consequential row in the annex |
| **CLAIM DENOMINATOR** | **102** graded rows, extracted by enumeration over the volume's own numbered rows (R1–R8, V1–V42) plus the substrate claims carried by its §2 flag law, its §3 canonical model, its §4 wave specs, its §5 seams and its §6 questions. ⚠ The granularity rule is a choice and is flagged in `laneTCWF-receipt.md` RAISED-6 |
| **GRADE TALLY** | **MEASURED-TRUE 79 · REFUTED 23 · UNVERIFIABLE-AT-BASE 0** (102 = 79 + 23 + 0), counted mechanically over the graded rows rather than asserted. Per §1.2 there is no fourth grade: a claim with a false component grades REFUTED with its surviving half stated in the evidence column. ⭐ **The third grade is EMPTY by construction, not by luck** — this sweep graded only claims the tree can answer, and the two rows carrying an unverifiable COMPONENT (WF-S018 and WF-S036, both raw-line or unbuilt-wave figures) are graded on their measured half with the component named |
| **Executions** | 1 eslint `Linter` measurement run over 30 blob-extracted files (effective lines, `max-lines {skipBlankLines:true, skipComments:true}`), exit captured in-shell; ~40 `git grep` / `git show` reads against the sweep sha. **ZERO vitest runs** — this lane runs no gate |
| **⭐⭐ FABLE-ROUND STAMP** | **STAMPED**, ODQ **§78** (2026-08-15, chair, vetoable; evidence `laneWFF-round.md` + `laneWFF-report.md`, all figures executed at `d5a6c009`). Absorption 42/54 annex-carried + 12 STRUCTURAL rows unabsorbed, **all 12 cured in the acceptance act**. **WF engine trains therefore cap at EIGHT members; WF prose/docs/dossier trains at TEN** |
| **Waves declared** | The volume charters **TEN** (WF-0 … WF-9, with WF-2 and WF-5 in two slices each = twelve slices). WF-1 split FOUR ways at compile (WF-1a/b/c/d), so the live ladder is **fifteen members**. **ONE has landed** (`WF-1A`, at `66fda66d`) |
| **Landed WF code at the sweep sha** | ONE leaf of ten declared (`patronFall.js`), ONE flag of eight (`faithUnseatingEnabled`), ZERO of the five remaining persisted additions — see §7 |

> **CONSUMPTION LAW (mirrored from the base-state capsule, §1.3).** Every row below is citable as
> executed by a compiler whose verified base is exactly `f8d978df` **or a docs-only descendant of it
> with every measured path byte-identical across that window**. **Any claim whose subject files have
> moved since the sweep is RE-VERIFIED BY THE CONSUMER.** A compiler citing a stale annex row
> inherits a STOP, not an excuse.

> **⚠⚠ STALENESS NOTE THAT ALREADY BINDS (§1.4).** This sweep VOIDS for WF the moment any WF wave
> lands, and it voids PER ROW for cross-family landings that touch a row's subject files. The rows
> most exposed, named rather than left to be discovered: everything keyed to
> `religiousContest.js` and `religionState.js` (WF-1b/c reserve both), everything keyed to
> `peaceTermsCatalog.js` / `peaceTerms.js` (a GR or TR landing moves them; `peaceTerms.js` sits at
> **797/800**), everything keyed to `simulationRules.js` and `subsystemRowsVirtual.js` (every flag
> mint in the estate moves both), and the five census/ratchet figures of §6, which move on any
> landing anywhere.

---

## ⛔⛔ THE COPY DIVERGENCE — READ THIS BEFORE ANY OTHER ROW

**The BUILD branch carries the PRE-CURE volume. The LEDGER branch carries the CURED one.**

| | build `f2e5c935` (774 lines) | ledger `169c75e7` (846 lines) |
|---|---|---|
| the §78 F-1 errand cure | **ABSENT** — still says "SP-1 absent at HEAD", "`spatialLedgers.errands`", "red-until-built existence probe" | PRESENT — "HARD PRECONDITION — DISCHARGED", names both reserved `ERRAND_CONSUMERS` rows and the `personal` typing |
| the §78 F-2 catalog cure | **ABSENT** — still says "GR-3's five faith rows land HERE", "peaceTerms.js 776 eff/800 — ~24 lines of headroom" | PRESENT — "GR-3's five faith rows are LANDED … WF-6 compiles as a CONSUMER and mints NO catalog row"; "ZERO-HEADROOM-CLASS file (797/800)" |
| the §78 F-3 three-site cure | **ABSENT** — still says "the two existing suppression transitions (`religionState.js:262/:277`)" | PRESENT — "stamped at EVERY suppression write site … three at the WF-F stamp: `:262/:277/:485` incl. the patron-siege loop", with a scan-count census pin |
| the §78 F-4 normalizer cure | **ABSENT** — still says "No load-time normalizer exists for religionStates or spatialLedgers sub-ledgers" | PRESENT — that sentence is **STRUCK**, replaced by the LIFECYCLE RE-DERIVATION LAW (four named obligations against `CONDITIONAL_LEDGER_KEYS` + `ensureWorldState`) |
| the §78 F-5 tuning-home law | **ABSENT** | PRESENT — **THE WF TUNING-HOME LAW**, eighteen lines, naming the eight measured tuning homes and the one-table-per-new-leaf rule |
| the `pilgrimageEnabled` lane row | "SPREAD + SP-1 lit" | "SPREAD + `errandSpineEnabled === true`" |
| the §5-1 catalog tripwire | "the pin … asserts `false` TODAY" | "FIRED at GR-3a's landing and is ASSERTED IN ITS FIRED STATE" |
| the §5-3 SP-1 seam | the probe clause | "DISCHARGED … the probe is DEAD — its trigger fired — and is STRUCK" |

⛔ **CONSEQUENCE, AND IT IS THE WHOLE REASON THIS ANNEX EXISTS.** A WF compiler who reads the volume
at the build branch — the ordinary act, since that is where the packets live — **inherits five dead
premises that the chair cured six days before this sweep.** Four of the five would have mis-built a
wave: WF-2b against a ledger that never existed, WF-6 minting catalog rows that would collide with
GR-3a's walkers, WF-1b stamping two of three suppression sites, and every persisted-addition wave
writing a lifecycle clause against a normalizer premise that is false.

**THE EXTRACTION SOURCE OF RECORD FOR THE WF FAMILY IS THE LEDGER COPY `169c75e7`.** Where the two
copies disagree, the ledger copy wins because it carries the chair's own signed cures; where the
ledger copy and this annex disagree on a SUBSTRATE FACT, this annex's executed receipt wins, on the
volume's own standing rule (its header: *"live code outranks the volume's … census — its own rule"*).

⚠ **AND THE CURED COPY IS ITSELF ALREADY STALE IN THREE PLACES**, measured below: its catalog figure
(WF-S011), its named grown-family set (WF-S063), and its `peaceTerms.js` figure (WF-S012, which
happens to be unmoved and is graded MEASURED-TRUE only because it was re-executed here).

---

## THE §78 STAMP AND ITS FIVE COMPILE OBLIGATIONS — QUOTED VERBATIM

*Source: `docs/OWNER_DECISION_QUEUE.md` (ledger branch `review-fixes-2026-07-08`, working tree),
§78, lines 2987–3017. Transcribed byte-for-byte from the ledger; line breaks preserved.*

> ## §78 · THE WF FABLE ROUND ACCEPTED — WITH ITS ABSORPTION GAP CURED
> ## IN THIS ACT (2026-08-15, chair, vetoable; evidence in
> ## laneWFF-round.md + laneWFF-report.md, all figures executed at
> ## `d5a6c009`)
>
> 1. **The §70.4 stamp is ACCEPTED**: absorption 42/54 annex-carried +
>    12 STRUCTURAL rows unabsorbed (WF, unlike WC, had no cure lane, no
>    rulings file, no preamble — the sweep's five STOP items appeared in
>    no ruling); voided rows 13 intact / 2 superseded-as-predicted / 0
>    verdict changes over 7 landings; law pass 5 MATERIAL / 8 DRIFT /
>    8 HOLDS. **Per the §73 mechanism, the chair's signature HERE adopts
>    the round's five architected cures, completing absorption of all 12
>    structural rows in this act.**
> 2. **The five cures are ADOPTED as compile obligations**: F-1 WF-2b
>    builds on the LANDED errand spine (the volume's §5-3 probe clause
>    is superseded — pilgrims are typed `personal`, and the reserved
>    exact paths govern); F-2 WF-6 re-scopes to CONSUME the
>    already-landed GR-3 rows (headroom is 3 lines, not ~24); F-3 WF-1
>    stamps all THREE suppression sites (the `:485` patron-siege loop
>    included); F-4 the four persisted-addition waves re-derive their
>    lifecycle clauses against the EXISTING normalizer
>    (`CONDITIONAL_LEDGER_KEYS` + `ensureWorldState` + the pinned key
>    order — §3's no-normalizer premise is dead); F-5 THE WF TUNING-HOME
>    LAW — every dial (520w/156w/260w, caps, bands) gets a derivation
>    home table and a chair signature under §42/§43 BEFORE any WF band
>    lands (the HB-2 STOP shape, pre-cured).
> 3. Volume Q2/Q3 are CLOSED in the tree's direction as the round found;
>    Q1 (five realm arcs) and Q4 (DS-FTH binding) stay open for the WF
>    family sitting, both recommendations validated on measured
>    substrate. WF's first train inherits the §77 premise-map obligation
>    from birth.

**INDEPENDENT CONFIRMATION OF ALL FIVE, EXECUTED AT `f8d978df`.** Each cure's factual premise was
re-measured by this lane without reading the round's own receipts:

| cure | its premise, re-measured here | row |
|---|---|---|
| **F-1** | the spine is BUILT (`errandMint.js`, flag `errandSpineEnabled` live in the manifest); `ERRAND_CONSUMERS` reserves `legateErrand.js`/`religious` and `pilgrimErrand.js`/**`personal`** by exact path, both `built:false`; `ENVOY_PURPOSES` still closed at two | WF-S030, WF-S031, WF-S032 |
| **F-2** | five `family:'faith'` rows LANDED at `peaceTermsCatalog.js:228/:231/:236/:240/:245`; `peaceTerms.js` measures **797** effective against the 800 layer ceiling ⇒ **3 lines of headroom, exactly as §78 says** | WF-S011, WF-S012 |
| **F-3** | exactly THREE `suppressed: true` write sites — `religionState.js:262`, `:277`, `:485` — the third inside `resolvePatronContest`'s siege-resolution loop | WF-S001, WF-S002 |
| **F-4** | `religionStates` is `CONDITIONAL_LEDGER_KEYS` member **2** (`worldState.js:440`) and there is additionally a live per-record migration at `:259-287` that rewrites religionStates keys and stamps `schemaVersion: 2` | WF-S040, WF-S041 |
| **F-5** | the eight named tuning homes all resolve; `pilgrimage.js` really does carry six BARE module constants (`:32`, `:33`, `:34`, `:38`, …) with no frozen table — the volume's own counter-example is real | WF-S050 |

⚠ **Q1 AND Q4 REMAIN OPEN FOR THE WF FAMILY SITTING.** This annex grades their PREMISES (both
reproduce — WF-S008, WF-S045) and touches their DISPOSITION not at all.

---

## §1 · THE UNSEATING SUBSTRATE — WF-1b's OWN GROUND

| # | Claim (volume site) | Grade | Executed evidence at `f8d978df` |
|---|---|---|---|
| WF-S001 | `suppressedAtTick` is genuinely new — no suppression transition carries a tick stamp (V4, §3) | **MEASURED-TRUE** | `git grep -n suppressedAtTick f8d978df -- src` → **ZERO hits.** Tree-wide it exists in exactly five files, all `docs/**` plus `WF-1A.md`: `DESIGN_FP_ARCHITECTURE.md`, `DESIGN_FP_ARCH_WF.md`, `DESIGN_FP_FAITH.md`, `implementation/INDEX.md`, `packets/fp/WF-1A.md`. **The field does not exist in code in any spelling** |
| WF-S002 | ⛔ **THE BUILD COPY'S "two existing suppression transitions (`religionState.js:262/:277`)" IS REFUTED — THERE ARE THREE** | ⛔ **REFUTED** | `git grep -n "suppressed" f8d978df -- src/domain/worldPulse/religionState.js` returns exactly three `suppressed: true` WRITES: **`:262`** (`attemptEntry`, the `same_niche_pushout` branch, evicting `sameNiche`), **`:277`** (`attemptEntry`, the `cross_niche_eviction` branch, evicting `weakest`), **`:485`** (`resolvePatronContest`, inside `if (state.patronSiegeTicks >= T.PATRON_FLIP_TICKS)`, suppressing every same-niche rival of the winner). The three addresses are EXACT at this base. The LEDGER copy already carries this cure; the build copy does not |
| WF-S003 | The `:485` site is "the `resolvePatronContest` schism resolution" (WF-1A §13) / "the patron-siege loop" (§78 F-3) | **MEASURED-TRUE — both descriptions name the same code** | the loop is guarded by the siege hysteresis `state.patronSiegeTicks >= T.PATRON_FLIP_TICKS` and sits inside `resolvePatronContest`; the two descriptions are the same site read from two sides |
| WF-S004 | ⛔ **None of the three sites has a `tick` in scope** (WF-1A §13) | **MEASURED-TRUE** | signatures verbatim: `export function attemptEntry(state, deity, newcomerStrength, opts = {})` (`:242`) and `export function resolvePatronContest(state, rng)` (`:444`). Neither takes a tick; `state` is the per-settlement religion record and carries `patronRef`, `deities`, `capacity`, `contestedTicks`, `patronSiegeRef`, `patronSiegeTicks`, `noneShare` — no tick field |
| WF-S005 | ⭐ **THE PRICE OF THREADING THE TICK, MEASURED — the census WF-1b must pay** | **MEASURED-TRUE (new; the volume prices this nowhere)** | `attemptEntry`: **ONE** `src` caller (`religiousContest.js:763`) + **8** test call sites (`religionState.test.js` ×6, `religionTier2.test.js` ×2). `resolvePatronContest`: **ONE** `src` caller (`religiousContest.js:811`) + **ONE SCRIPT** caller with TWO call sites (`scripts/audit/religion-balance.mjs:36`, `:51`) + **7** test call sites (`patronContest.test.js` ×4, `religionTier2.test.js` ×3). ⚠ **The script caller is the one a `src`-only census misses** |
| WF-S006 | `pruneSuppressed` keeps ≤3 and deletes in codepoint order (V4) | **MEASURED-TRUE** | `religionState.js:353-357`: `const supp = Object.keys(state.deities).filter(k => state.deities[k].suppressed).sort(codepoint); const KEEP = 3; if (supp.length > KEEP) for (const k of supp.slice(KEEP)) delete state.deities[k];` — verbatim |
| WF-S007 | ⛔ **`pruneSuppressed` IS NOT EXPORTED, and its only caller is `advanceShares`** | **MEASURED-TRUE (new; WF-1b's narrative prune key lands inside a private function)** | `function pruneSuppressed(state)` at `:353` — no `export`. Its ONE call site is `religionState.js:312`, the last statement of `export function advanceShares(state, strengthByRef)`. `KEEP = 3` is a function-local const, not a `RELIGION_TUNING` member. ⇒ **the flag-forked narrative sort key cannot be reached from the fold without either threading the flag through `advanceShares` or lifting the prune out** — an architectural fork WF-1b must price, and neither copy of the volume names it |
| WF-S008 | Q1's premise: no realm-scale schism arc exists (R2) | **MEASURED-TRUE, ADDRESSES EXACT** | `COMPOUND_SIGNATURES` (`realmEvents.js:24`, an ARRAY) holds exactly five keys: `gods_abandonment` **:26**, `the_wasting` **:37**, `starving_city` **:47**, `calling_of_debts` **:57**, `shadow_court` **:67`. `git grep -c schism f8d978df -- realmEvents.js pantheon.js` → **zero**. R2 reproduces exactly, addresses included |
| WF-S009 | The realm tier-change beats WF-1c joins sit at `realmEvents.js:270-294` | **REFUTED (address)** | the beats are `pantheon_ascendancy` at **`:284`** and `pantheon_twilight` at **`:307`**, inside a block running `:246-320`. The volume's range covers the first and misses the second |
| WF-S010 | `PATRON_HOLD` 0.35, decay 0.02, `PATRON_FLIP_MARGIN` 6 × `PATRON_FLIP_TICKS` 3, `SHARE_STEP_MAX` 6 (V3, and WF-1A's fixture hazard) | **MEASURED-TRUE, EVERY FIGURE AND ADDRESS EXACT** | `religionState.js` `SHARE_STEP_MAX: 6` **:43**, `PATRON_HOLD: 0.35` **:49**, `PATRON_HOLD_DECAY: 0.02` **:50**, `PATRON_FLIP_MARGIN: 6` **:51**, `PATRON_FLIP_TICKS: 3` **:52**. ⚠⚠ **The fixture hazard is therefore live and unchanged: a fixture advanced fewer than ~4 ticks, or whose rival cannot gain 6 share points per tick, yields base == cure and a silently vacuous pin** |

---

## §2 · THE CATALOG, THE TERMS AND THE BUNDLE — WF-6's GROUND

| # | Claim | Grade | Evidence |
|---|---|---|---|
| WF-S011 | Build copy: "GR-3's faith rows land in `peaceTermsCatalog.js`"; catalog holds "TWELVE terms across EIGHT families" (R1). Ledger copy: "24 terms / 11 families" | ⛔ **REFUTED, BOTH COPIES** | at `f8d978df` the catalog holds **26 terms across 13 families**, and the five `family:'faith'` rows **ARE ALREADY LANDED**: `shared_rite` **:228**, `pilgrimage_right` **:231**, `tolerance_guarantee` **:236**, `missionary_access` **:240**, `temple_restitution` **:245**. The 13 families are `amnesty · commercial · economic · faith · informational · jubilee · political · population · relational · security · sovereignty · sovereignty_transfer · territorial`. ⇒ **WF-6 mints NO catalog row** (§78 F-2), and the cured copy's own figure has drifted +2/+2 since the stamp |
| WF-S012 | `peaceTerms.js` is "776 eff/800 — ~24 lines of headroom" (build copy) / "797/800" (ledger copy) | **REFUTED as to the build copy; MEASURED-TRUE as to the ledger copy** | eslint `Linter`, `max-lines {skipBlankLines:true, skipComments:true}`, over the blob: **797**. ⇒ **THREE lines of headroom, exactly as §78 F-2 states.** ⛔ `peaceTerms.js` is a ZERO-HEADROOM-CLASS file for WF purposes: net-zero seam lines only, re-measured at the compile's own base |
| WF-S013 | `TERM_FAMILIES` is DERIVED from the catalog at `peaceTermsCatalog.js:192` (R1) | **REFUTED (address); the mechanism STANDS** | derivation is at **`:328`**: `export const TERM_FAMILIES = Object.freeze([...new Set(TERM_TYPES.map(t => TERM_CATALOG[t].family))].sort())`, with `TERM_TYPES` at **`:325`**. Derived-from-the-catalog reproduces; the address moved 136 lines |
| WF-S014 | `catalogGrewSinceWr10()` lives at `sovereigntyBundle.js:166` and the pin `sovereigntyBundleWr10.test.js:321` asserts `false` TODAY (§5 seam 1, build copy) | ⛔ **REFUTED IN BOTH HALVES — THE TRIPWIRE ALREADY FIRED AND HAS BEEN DISCHARGED** | the function is at **`sovereigntyBundle.js:191`**; the pin is at **`sovereigntyBundleWr10.test.js:336`** and asserts **`true`**. The module's own header carries the discharge in prose: *"THE TRIPWIRE FIRED, AND THIS IS ITS DISCHARGE (GR-3, 2026-08-06) … the three new families became composable consideration the moment they landed, with no edit here and no rename sweep anywhere"* |
| WF-S015 | Volume Q3 ("compose, or exclude faith families from the bundle?") is an OPEN question | ⛔ **REFUTED — IT IS SETTLED IN THE TREE, AND THE RECOMMENDED ANSWER IS THE MEASURED FACT** | the component set derives from `TERM_FAMILIES` at call time, so `faith` became bundle-composable at GR-3's landing with no edit. §78.3 records Q3 CLOSED "in the tree's direction"; this row is the independent confirmation |
| WF-S016 | `WR10_FAMILIES_AT_LANDING` is a LANDING RECORD, never widened | **MEASURED-TRUE** | `sovereigntyBundle.js:116-119` — eight members, and `sovereigntyBundleWr10.test.js:354` pins `expect(WR10_FAMILIES_AT_LANDING.length).toBe(8)`. The module says so in terms at `:74`/`:113-115`. ⛔ **A WF wave that widens it is a STOP** |
| WF-S017 | Per-term compliance vocabulary `{honored, strained, defaulted, expired}` + trueState twin lives at `peaceTermsCatalog.js:122-123` (V32) | **REFUTED (address); the union MEASURED-TRUE** | the union is at **`:134-135`**: `@property {'honored'\|'strained'\|'defaulted'\|'expired'} complianceState` and `@property {'honored'\|'strained'\|'defaulted'} trueState`. `:122-123` is a different typedef's `value` property. ⛔ **WF-6 cites this union, never re-mints it — and cites it BY SYMBOL** |
| WF-S018 | `negotiationPictures.js` (618) / `sovereigntyTransfer.js` (399) / `treatyOrientation.js` (178) / `foreignGuestHold.js` (527) are BUILT (R5) | **MEASURED-TRUE (existence)**; **UNVERIFIABLE-AT-BASE (the raw-line figures)** | all four resolve as files. The volume's figures are RAW lines, a unit no instrument in the estate pins; they are not re-derived here because no WF budget depends on them |

---

## §3 · THE ERRAND SPINE — WF-2b's GROUND (the §78 F-1 substrate)

| # | Claim | Grade | Evidence |
|---|---|---|---|
| WF-S030 | Build copy: "**SP-1 … remains ABSENT tree-wide** (grep: zero hits)" and "WF-2b does not build until `spatialLedgers.errands` exists" (R5, V40, §5 seam 3) | ⛔ **REFUTED — THE SPINE IS BUILT, AND THE LEDGER IT WAS PREDICTED TO USE NEVER EXISTED** | `src/domain/worldPulse/errandMint.js` exists; `errandSpineEnabled` is live in `ENGINE_GATED_VIRTUAL_RULE_KEYS`; twelve errand modules sit under `src/domain/worldPulse/`. `git grep -n errands f8d978df -- src/lib/spatialUsage.js` → **zero** — `spatialLedgers.errands` does not exist and the substrate is `worldState.envoyErrands` instead |
| WF-S031 | ⭐⭐ **WF-2b's TWO MODULES ARE RESERVED BY EXACT PATH IN A LIVE FROZEN REGISTRY, AND THE PILGRIM HALF IS TYPED `personal`** | **MEASURED-TRUE — the §78 F-1 obligation, confirmed independently** | `envoyErrandVocabulary.js:295` `ERRAND_CONSUMERS` carries verbatim: `{ consumer: 'legates', purposeClass: 'religious', module: 'src/domain/worldPulse/legateErrand.js', wave: 'WF-2b', built: false }` and `{ consumer: 'pilgrims', purposeClass: 'personal', module: 'src/domain/worldPulse/pilgrimErrand.js', wave: 'WF-2b', built: false }`. Neither module exists yet |
| WF-S032 | `ENVOY_PURPOSES` is closed at `['sue','self_parlay']` and must not be widened (R5) | **MEASURED-TRUE, and the volume's conclusion is right for a reason it does not give** | `envoyErrandVocabulary.js:119` verbatim. ⭐ The lawful join is one layer up: `ENVOY_PURPOSE_CLASSES` (`:130`) is a SIX-member frozen vocabulary — `commercial · covert · diplomatic · factional · personal · religious` — whose own header says *"the classes are what five unbuilt volumes (TRADE's factors, **FAITH's legates and pilgrims**, INFO's couriers, INTERIOR's emigres) will mint against"*. **WF's two classes already exist; nothing is widened at all** |
| WF-S033 | ⛔ **THE REGISTRY IS A TWO-WAY WALKER AND IT REDS IN BOTH DIRECTIONS ON A WF-2b LANDING** | **MEASURED-TRUE** | `tests/lint/errandConsumerRegistry.walker.test.js`: DIRECTION 1 (`:352`) — *"a module mints errands with no row in `ERRAND_CONSUMERS`"* reds; DIRECTION 2 (`:369`) — *"`!row.built && isMinter`"* reds with the message *"flip `built:true` in the same commit as `WF-2b`'s landing"*. ⇒ **each module lands WITH its one-word `built` flip in the SAME commit** |
| WF-S034 | ⚠ **A THIRD ARM NAMES THE BUILT SET EXACTLY, AND ITS TITLE COUNTS** | **MEASURED-TRUE (new)** | `:421` `expect(builtModules).toEqual(['…/emigreErrand.js','…/envoyErrand.js','…/espionage/espionageMissions.js','…/pactProposals.js'])`, under a test **titled** *"the FOUR built consumers today are …"*. WF-2b moves the list to six and the title to SIX; a title RENAME keeps census cardinality still, which is the cheap door and the one to take |
| WF-S035 | ⚠ **AND A FOURTH ARM EXPIRES.** `:378-383` asserts `ERRAND_CONSUMERS.filter(r => !r.built).length > 0` with the message *"every consumer is built — the pre-pin toward the unbuilt volumes has expired, which is a real event and wants a look"* | **MEASURED-TRUE** | at this base four rows are unbuilt (`factorErrand` TR-8, `legateErrand` WF-2b, `pilgrimErrand` WF-2b, `covertErrand` IN-4). WF-2b leaves two, so the arm survives — but a WF compiler should know the arm exists |
| WF-S036 | `foreignGuestHold.js` is WR-7b's ONE writer, consumed read-only by WF-2b (R5, §5 seam 6) | **MEASURED-TRUE (existence and singleness of the module)**; the read-only consumption pattern is **UNVERIFIABLE-AT-BASE** (it describes an unbuilt wave) | the module resolves; nothing faith-side imports it |

---

## §4 · THE PERSISTED MODEL AND ITS LIFECYCLE (the §78 F-4 substrate)

| # | Claim | Grade | Evidence |
|---|---|---|---|
| WF-S040 | Build copy §3: **"No load-time normalizer exists for religionStates or spatialLedgers sub-ledgers — shape discipline is pinned AT the writer"** | ⛔⛔ **REFUTED — THE PREMISE IS DEAD, AND FOUR WAVES' LIFECYCLE CLAUSES REST ON IT** | `worldState.js:439-471` `CONDITIONAL_LEDGER_KEYS` lists **`religionStates` as member 2** and `spatialLedgers` as member 11; the loop head is **`:518`** and it materializes each present key through one of three branches — a DEDICATED normalizer at **`:524`** (today only `envoyErrands`), a FROZEN by-reference share for `spatialDigest`, and `deepCloneConditionalLedger` for everything else, `religionStates` and `spatialLedgers` included — with the drop-when-empty filter at **`:528-530`**. The array's own in-file comment says **"the array order IS the serialized key order"**, APPEND-ONLY. The ledger copy strikes the sentence and replaces it with the LIFECYCLE RE-DERIVATION LAW |
| WF-S041 | ⭐ **AND THERE IS ALSO A LIVE PER-RECORD MIGRATION ON `religionStates`, WHICH NEITHER COPY MENTIONS** | **MEASURED-TRUE (new)** | `worldState.js:259-287`, `WORLD_STATE_MIGRATIONS` entry `{ to: 2 }`: it walks `raw.religionStates` per settlement and renames `chiefRef/chiefHeld/chiefChallengeTicks` → `patronRef/patronHeld/patronChallengeTicks`, returning `{ ...raw, religionStates: next, schemaVersion: 2 }`. **It is IDEMPOTENT and it spreads `...rest`, so a new conditional sub-key survives it** — but a WF wave asserting "no migration touches this record" would be asserting something false |
| WF-S046 | ⭐ **THE DEDICATED-NORMALIZER SEAM IS INJECTABLE, AND THE LEDGER COPY'S `normalizeEnvoyRows` CITATION IS CORRECT** | **MEASURED-TRUE** | `worldState.js:496` binds `normalizeEnvoyRows = cloneAdmittedEnvoyErrands` as a DEFAULT PARAMETER, consumed at `:524`. ⇒ a WF wave that needs a dedicated normalizer follows the same shape: an injectable default-parameter seam, not a hard import. **The cured volume's F-4 precedent resolves; the build copy names nothing at all here** |
| WF-S042 | `worldState.spatialLedgers.omenReadings` is "the ONE new sub-ledger" WF-4 mints (§3) | **MEASURED-TRUE as an absence; the registration cost is REFUTED as unstated** | `git grep omenReadings f8d978df -- src` → zero. ⛔ **The volume prices no registration for it.** `src/lib/spatialUsage.js:238` `TRACKED_LEDGER_KEYS` + its `EXEMPT_LEDGER_KEYS` map are asserted EQUAL to the source-scanned written-key set by `tests/lib/spatialLedgerCoverage.walker.test.js` — so a `setSpatialLedger('omenReadings', …)` writer that lands without its registration row reds, and a row that lands without its writer reds. **The row and the writer are ONE ATOMIC ACT** |
| WF-S043 | `templeWealth` (WF-7) and `creedRef` (WF-5a) do not exist (§3) | **MEASURED-TRUE** | `git grep templeWealth f8d978df -- src/domain` → zero; the only tree-wide occurrence is the DS-FTH-3 prose title. `creedRef` → zero in `src/domain` |
| WF-S044 | Zero new top-level `worldState.*` keys anywhere in the program (§3, "the fight, won") | **MEASURED-TRUE as a design claim about the six additions listed** | all six ride `religionStates`, `settlement.institutions[]` or `spatialLedgers`, each of which is an existing home. ⭐ **This is now a claim WF can ASSERT rather than assume**: the top-level serialized order is `CONDITIONAL_LEDGER_KEYS`' array order, so a pin that the array is unchanged across a WF landing is available and cheap |
| WF-S045 | Q4's premise: DS-FTH-3's title binds the WF state spellings verbatim (R8, §5 seam 7) | **MEASURED-TRUE** | `src/data/dossierStateProse/warFaith.generated.js:2586` carries `worldState.religionStates[cid] {patronRef, deities{share, standing, legitimacy, niche, tenure, suppressed, covert}, patronFalls[]}` × `templeWealth`. `git grep -c "DS-FTH-"` on that file → **7** blocks, exactly as R8 says |

---

## §5 · THE TUNING SUBSTRATE (the §78 F-5 law's ground)

| # | Claim | Grade | Evidence |
|---|---|---|---|
| WF-S050 | F-5's counter-example: `pilgrimage.js` carries bare module dials rather than a frozen table | **MEASURED-TRUE** | `src/domain/traditions/pilgrimage.js`: `PILGRIM_ACTS` **:32**, `GRAND_SCALE_MIN = 3` **:33**, `SPECTACLE_SCALE = 5` **:34**, `PILGRIM_MAX = 0.1` **:38** — four bare `const`s with no `*_TUNING` wrapper, in a 41-effective-line module |
| WF-S051 | F-5's EIGHT named tuning homes exist | **MEASURED-TRUE — ALL EIGHT, EACH AT AN EXACT ANCHOR** | `RELIGION_TUNING` `religionState.js:40` · `RELIGION_LEGITIMACY_TUNING` `religionLegitimacy.js:74` · `PIETY_TUNING` `piety.js:41` · `PANTHEON_TUNING` `pantheon.js:405` · `SACRED_CLAIM_TUNING` `sacredClaim.js:67` · `STANCE_TUNING` `deityStance.js:53` · `STANCE_LANE_TUNING` `deityStanceLane.js:51` · `CRISIS_CONVERSION_TUNING` `religiousContest.js:143`. ⇒ **F-5's "join that module's existing table" arm is fully resolvable at this base; no WF wave may plead that it has nowhere to put a dial** |
| WF-S052 | ⛔ **THE VOLUME AUTHORS DIALS IN ITS WAVE SPECS, AND UNDER F-5 EVERY ONE IS A COMPILE-TIME STOP UNTIL SIGNED** | **MEASURED-TRUE (enumeration of the volume's own text)** | the volume's own authored numbers: WF-5's growth half-life **520w** and assimilation **156w**; WF-8's Reformation window **260w**, **≥3 settlements**, **≥3×** narration multiple; WF-7's **13-week** quarterly fold; WF-8's program-local pacing caps; WF-5's covert-size band words. **Each enters its wave's compile as a RECOMMENDATION carrying an executed derivation, or the compile STOPs at promotion** |
| WF-S053 | `INTERVAL_WEEKS` canonical home with two local frozen copies (V34) | **MEASURED-TRUE, ALL THREE ADDRESSES EXACT** | canonical `intervalWeeks.js:7`; local copies `foodStockpile.js:66` and `populationDynamics.js:18`. ⛔ **A WF clock imports the canonical leaf; a fourth copy is a STOP** |

---

## §6 · THE INSTRUMENTS A WF WAVE MEETS — measured, with their exact arms

| # | Claim | Grade | Evidence |
|---|---|---|---|
| WF-S060 | `ENGINE_GATED_VIRTUAL_RULE_KEYS` holds five keys (V36) | ⛔ **REFUTED** | **24** at `f8d978df` (`simulationRules.js:185`). Of the eight WF flags exactly **ONE** is present — `faithUnseatingEnabled`, WF-1a's, at array position 10 |
| WF-S061 | ⚠ **THE ARRAY IS NO LONGER ALPHABETICAL, AND NOTHING PINS THAT IT IS** | **MEASURED-TRUE (new)** | the tail reads `… 'underwaysOrganicFoundingEnabled', 'warCirculationEnabled', 'contributionLedgerEnabled'` — WC-0E landed its pair together and out of order. The only comparison in the estate is `expect([...ENGINE_GATED_VIRTUAL_RULE_KEYS].sort()).toEqual([...VIRTUAL_RULES].sort())` (`subsystemRowsVirtual.test.js:454`), which sorts BOTH sides. ⇒ **"insert at the alphabetical position" is a house convention, not a pinned law**; a WF packet may state it as a courtesy but must not price it as an obligation |
| WF-S062 | ⛔⛔ **THE FLAG-MINT BILL IS FIVE OBLIGATIONS, NOT FOUR, AND THE FIFTH LIVES IN A SUITE NO FAITH BATTERY RUNS** | **MEASURED-TRUE** | `tests/soak-harness/coveringArrayCoverage.test.js` pins the flag-domain census SEQUENCED: `governed` **25** (`:165`), `ungoverned` **32** (`:166`), `virtual` **24** (`:167`), the closure `governed+ungoverned+virtual == union` (`:170`), `union` **81** (`:169`), and `union − governed` **56** (`:174`). A WF flag mint moves virtual 24→25, union 81→82, union−governed 56→57 — **and curing only the first reds the next line** |
| WF-S063 | The bundle's grown-family set is `['commercial','faith','population']` (ledger copy §5-1) | ⛔ **REFUTED — IT IS FIVE** | `sovereigntyBundleWr10.test.js:348`: `expect([...grown].sort()).toEqual(['amnesty','commercial','faith','jubilee','population'])` — WC-0D's two producer-less exits each took their own family. **A sixth family reds this exact-set arm** |
| WF-S064 | ⛔⛔ **THE COUPLING CENSUS SPLITS THE WF FAMILY DOWN THE MIDDLE, AND SEVEN OF EIGHT NAMED LEAVES FALL ON THE COSTLY SIDE** | **MEASURED-TRUE — the family's sharpest registration fact** | `tests/lint/couplingInclusion.walker.test.js:150-165`, `LAYER_PATTERNS.FAITH` is TWO regexes: `/^src\/domain\/worldPulse\/(?:faith\|sacred\|religion\|pantheon\|conversion\|piety\|deity\|temple)/` — **eight SUBJECT-NOUN prefixes** — plus WF-1a's cure `/^src\/domain\/worldPulse\/patronFall\.js$/`, an EXACT-PATH regex. Of the volume's remaining named leaves, only `faithTermExecutors.js` matches. `pilgrimSeason.js`, `stanceConsequences.js`, `omenReading.js`, `covertCongregation.js`, `tithe.js`, `realmFaithArcs.js`, `legateErrand.js`, `pilgrimErrand.js` match NOTHING |
| WF-S065 | The census's arms and their exactness | **MEASURED-TRUE** | `UNLAYERED_BASELINE_CEILING = 179` (`:646`) is asserted `.toBe`, **exact in both directions** (`:1160`); `ARGUED_ROSTER_CEILING = 20` (`:612`) likewise (`:889`); plus an escaped-module arm (`:1134`) and a stale-baseline arm (`:1143`), which are jointly an exact-set equality (`:1170`). ⛔ **The size arm exists precisely because a new module PLUS a matching baseline line used to move both sides together and pass green** |
| WF-S066 | The `ARGUED_UNLAYERED` door is not safe ahead of its leaf | **MEASURED-TRUE** | `:864` `expect(DOMAIN_MODULES, '<module> vanished — re-aim the exclusion').toContain(module)` ⇒ **an argued entry must land in the SAME commit as its leaf**, exactly as the WC family recorded |
| WF-S067 | ⚠ **FOUR MODULES THE VOLUME NAMES BARE ARE OUTSIDE `src/domain/worldPulse/` — AND THREE ARE OUTSIDE THE COUPLING CENSUS ENTIRELY** | **MEASURED-TRUE (new)** | `settlementRumors.js` → **`src/domain/display/`**; `heraldRouting.js` → **`src/domain/realm/`**; `pilgrimage.js` → **`src/domain/traditions/`**; `generosityEV.js` → **`src/domain/spatial/`**; `institutionRoster.js` → **`src/domain/institutions/`**. `CENSUS_SCOPE_RE` is `/^src\/domain\/(?:worldPulse\|spatial)\//` (`:615`), so the first three cost NO coupling row and `generosityEV.js` does |
| WF-S068 | ⭐ **AND THAT MAKES WF-2a's LEAF PLACEMENT A REAL DESIGN FORK NEITHER COPY NAMES** | **MEASURED-TRUE (new)** | `pilgrimSeason.js` beside `pilgrimage.js` in `src/domain/traditions/` costs no coupling row and no `LAYER_PATTERNS` edit; in `src/domain/worldPulse/` it owes an exact-path regex on the `patronFall.js` precedent. **The choice is the packet's and must be made at compile, not discovered at the terminal gate** |
| WF-S069 | The five instrument files a WF wave meets exist | **MEASURED-TRUE** | `tests/lint/{negativeAssertionAnchor.walker,mutationCoverageManifest,engineGatedRuleKeys.walker,sovereigntyLightingContract.walker,couplingInclusion.walker,errandConsumerRegistry.walker,sizeBaseline}.test.js` and `tests/lib/spatialLedgerCoverage.walker.test.js` all resolve |
| WF-S070 | The live pinned lighting-census tuple | **MEASURED-TRUE (PINNED read, per the capsule's provenance law)** | `tests/lint/sovereigntyLightingContract.walker.test.js:4848`: `files: 2484, parked: 364, credited: 2120, titles: 20598, suiteTitles: 5767`. ⛔ **RE-READ AT THE COMPILE'S OWN BASE — this figure moves on any landing anywhere** |
| WF-S071 | Herald routing: 'faith' + 'divination' sections, ~17 faith kinds (V20, R6) | **MEASURED-TRUE, count corrected UP** | `HERALD_SECTIONS` at `heraldRouting.js:64` — six members, exactly as V20 says. Faith-routed kinds in the token map: **18** (`:138-150`), divination: **8**. ⚠ `sovereignty_sale_judged: 'faith'` is at **`:149`**, not `:143` |
| WF-S072 | ⭐ **AND THERE IS A PREFIX ROUTER THE VOLUME NEVER MENTIONS** | **MEASURED-TRUE (new)** | `heraldRouting.js:357-358`: `['faith_', 'faith'], ['pantheon_', 'faith']`. A new kind spelled `faith_*` routes with no token-map row at all — which is the cheap door AND the trap for WF-8's totality census, since the census must count such a kind once and only once |
| WF-S073 | Size law: 800 effective ceiling for domain, shrink-only baseline map (V39) | **MEASURED-TRUE (mechanism); addresses moved** | `scripts/.size-baseline.json` holds **nine** `src/` entries. ⛔ **Of every file WF names, exactly ONE has a baseline entry: `warTermination.js` at 818** |
| WF-S074 | ⛔ **`warTermination.js` MEASURES EXACTLY 818 AGAINST ITS FROZEN 818 — ZERO HEADROOM, SHRINK-ONLY** | **MEASURED-TRUE** | eslint `Linter` over the blob: **818**; baseline literal **818**. WF-1d's join is net-zero or it STOPS |
| WF-S075 | `pulseKernel.js` is FROZEN at 1580 effective (R4) | ⛔ **REFUTED (figure)** | the baseline literal is **1581** and the measurement is **1581**. The R-BLD-10 rationale text still says "BANKED PERMANENTLY AT ITS MEASURED 1580" and is itself stale by one. ⚠ `sizeBaseline.test.js` reds a SHRINK below the literal as well as growth, so quoting 1580 in a WF packet is quoting a number that would red |

### §6a · THE MEASURED EFFECTIVE-LINE TABLE (eslint `Linter`, `max-lines {skipBlankLines:true, skipComments:true}`, over the `f8d978df` blob)

| module | eff at `f8d978df` | volume's figure | verdict |
|---|---:|---:|---|
| `src/domain/worldPulse/religionState.js` | **356** | 356 | STANDS |
| `src/domain/worldPulse/religiousContest.js` | **468** | (WF-1A: 453 @ `0cf18bed`) | MOVED +15 — WF-1a's own edit |
| `src/domain/worldPulse/peaceTerms.js` | **797** | 776 (build) / 797 (ledger) | build REFUTED · ledger STANDS |
| `src/domain/worldPulse/peaceTermsCatalog.js` | **115** | 80 | MOVED +35 — GR-3a's rows |
| `src/domain/worldPulse/warTermination.js` | **818** | 818 frozen | STANDS · **ZERO headroom** |
| `src/domain/worldPulse/realmEvents.js` | **283** | 283 | STANDS |
| `src/domain/display/settlementRumors.js` | **508** | 482 | MOVED +26 |
| `src/domain/realm/heraldRouting.js` | **268** | 246 | MOVED +22 |
| `src/domain/worldPulse/religionLegitimacy.js` | **227** | 222 | MOVED +5 |
| `src/domain/worldPulse/deityStanceLane.js` | **235** | 235 | STANDS |
| `src/domain/worldPulse/deityStance.js` | **60** | 60 | STANDS |
| `src/domain/worldPulse/sacredClaim.js` | **85** | 85 | STANDS |
| `src/domain/traditions/pilgrimage.js` | **41** | 41 | STANDS |
| `src/domain/spatial/generosityEV.js` | **401** | 401 | STANDS |
| `src/domain/institutions/institutionRoster.js` | **10** | 10 | STANDS |
| `src/domain/worldPulse/foundingCatalog.js` | **57** | 57 | STANDS |
| `src/domain/worldPulse/institutionTolerance.js` | **123** | 123 | STANDS |
| `src/domain/worldPulse/simulationRules.js` | **310** | (WF-1A: 309) | MOVED +1 |
| `src/domain/certification/subsystemRowsVirtual.js` | **723** | (WF-1A: 698) | MOVED +25 |
| `src/domain/worldPulse/pulseKernel.js` | **1581** | 1580 | REFUTED |
| `src/domain/worldPulse/warDeployment.js` | **684** | — | ⭐ **116 lines of headroom — WF-7's declared STOP condition is NOT met at this base** |
| `src/domain/worldPulse/patronFall.js` | **28** | (WF-1A budget ≤120) | landed well under |
| `src/domain/worldPulse/pantheon.js` | **160** | — | measured |
| `src/domain/worldPulse/piety.js` | **216** | — | measured |
| `src/domain/worldPulse/strategicPosture.js` | **136** | — | measured |
| `src/domain/worldPulse/sovereigntyBundle.js` | **164** | — | measured |

---

## §7 · THE ARCHITECTED-vs-BUILT CENSUS (module census, NEVER commit subjects)

*Method per the recorded ES-4/EP false-positive law: measured by MODULE PRESENCE and FLAG PRESENCE
over the volume's own declared deliverables, never by reading commit titles.*

| declared new leaf | wave | at `f8d978df` |
|---|---|---|
| `patronFall.js` | WF-1a | ⭐ **PRESENT** (`src/domain/worldPulse/`, 28 eff) |
| `pilgrimSeason.js` | WF-2a | ABSENT |
| `legateErrand.js` | WF-2b | ABSENT (reserved by exact path in `ERRAND_CONSUMERS`) |
| `pilgrimErrand.js` | WF-2b | ABSENT (reserved by exact path in `ERRAND_CONSUMERS`) |
| `stanceConsequences.js` | WF-3 | ABSENT |
| `omenReading.js` | WF-4 | ABSENT |
| `covertCongregation.js` | WF-5b | ABSENT |
| `faithTermExecutors.js` | WF-6 | ABSENT |
| `tithe.js` | WF-7 | ABSENT |
| `realmFaithArcs.js` | WF-8 (fallback) | ABSENT |

| declared flag | wave | at `f8d978df` |
|---|---|---|
| `faithUnseatingEnabled` | WF-1 | ⭐ **PRESENT** — manifest row + 3 `src` files |
| `pilgrimageEnabled` · `faithStanceConsequencesEnabled` · `omenReadsEnabled` · `faithSchismEnabled` · `faithTermsEnabled` · `titheEnabled` · `faithNarrationEnabled` | WF-2a/3/4/5a/6/7/8 | **ZERO `src` hits each** |

| declared persisted addition | wave | at `f8d978df` |
|---|---|---|
| `religionStates[cid].patronFalls[]` | WF-1a | ⭐ **PRESENT** |
| `.deities[ref].suppressedAtTick` | WF-1b | ABSENT (zero hits in `src`) |
| `.deities[ref].covert` | WF-5b | ABSENT |
| `.templeWealth` | WF-7 | ABSENT |
| `institutions[].creedRef` | WF-5a | ABSENT |
| `spatialLedgers.omenReadings` | WF-4 | ABSENT |

**MEASURED VERDICT: WF IS ONE-FIFTEENTH BUILT.** One of fifteen live ladder members has landed; one
of ten declared leaves; one of eight flags; one of six persisted additions.

⚠ **AND MODULE PRESENCE NEVER PROMOTES A WAVE — several modules the volume names are already in
`src/` because they are pre-existing MODIFY targets**, not WF deliverables: `religionState.js`,
`religiousContest.js`, `religionLegitimacy.js`, `piety.js`, `pantheon.js`, `sacredClaim.js`,
`deityStance.js`, `deityStanceLane.js`, `realmEvents.js`, `peaceTerms.js`, `peaceTermsCatalog.js`,
`warTermination.js`, `pilgrimage.js`, `generosityEV.js`, `settlementRumors.js`, `heraldRouting.js`.

---

## §8 · THE §1b VERIFIED TABLE (V1–V42), RE-SWEPT

*Rows the sweep re-executed. A row graded MEASURED-TRUE reproduces in substance; where only the
ADDRESS moved, the row still grades MEASURED-TRUE and the address is corrected in §9's two-anchor
table, because the estate navigates by symbol.*

| V | subject | Grade | note |
|---|---|---|---|
| V1 | two-lane gate; `isSubsystemActive(snapshot,'religion')` short-circuit | **MEASURED-TRUE** | `subsystemActivation.js:68` EXACT; the fold's head gate reproduces |
| V2 | `faithSpreadEnabled` is a REAL default-false key with a legacy `religionDynamicsEnabled` alias — **the WF flags do NOT copy its shape** | **MEASURED-TRUE** | `simulationRules.js:76` / `:83` defaults; preset lockstep at `:535-541`, `:599-600` |
| V3 | PATRON_HOLD / decay / flip margin × ticks | **MEASURED-TRUE** | WF-S010 |
| V4 | `pruneSuppressed` KEEP 3, codepoint order, no timestamp | **MEASURED-TRUE** | WF-S006, WF-S001 |
| V5 | SINK_MAX 45; revival 0.06 outpaces drift 0.02 | **MEASURED-TRUE** | `:77`, `:78`, `:79` — every address EXACT |
| V6 | legitimacy weights 0.42/0.20/0.30/0.08; `W_INSTITUTION` 0.12; stain decay 0.06 | **MEASURED-TRUE** | `:85`, `:92`, `:79`; consumed at `:495` (volume said `:484-489`) |
| V7 | piety lag 0.06, DRIFT_ASYMMETRY 2, W_INSTITUTION 0.35 | **MEASURED-TRUE** | `:61`, `:70`, `:44` — all EXACT |
| V8 | one conversion vehicle; MIN_CARRIER 0.15; warbound ×1.35; CONTEST_LEGIT_W 0.78 | **MEASURED-TRUE** | `religiousContest.js:92`, `:122` (volume said `:89`, `:119`); `religionState.js:58` EXACT |
| V9 | `SLOTS_BY_TIER` thorp 1 → metropolis 7 | **MEASURED-TRUE** | `cultImpositionApply.js:42` + default 2 at `:46` — both EXACT |
| V10 | temper `W_EVIL` 0.7 / `W_CHAOS` 0.3, dead-band 0.15; rank→authority 18/10/5 | **MEASURED-TRUE** | `deityAxes.js:61-63` EXACT. ⚠ `DEITY_RANK_AUTHORITY` is at **`src/domain/deityConstants.js:29`** — NOT under `worldPulse/` |
| V11 | deity minting custom-content only; `latentPantheon` legacy-save reader only | **MEASURED-TRUE** | `latentPantheon.js:1-15` carries the LEGACY-ONLY seam comment verbatim |
| V12 | stance `aggression` + `treatyDurability` UNCONSUMED, owner-gated, G1c ledger | **MEASURED-TRUE — WF-3's premise holds** | the DEFERRED CONSUMPTION comment reproduces verbatim at `deityStance.js:163-174`, naming *"an OWNER-GATED new-capability / deferred-wave resurrection"* and `docs/GOLDEN_SHIFT_LEDGER.md` G1c |
| V13 | cooldowns 8/6/6, realm caps, named minister recruit | **MEASURED-TRUE, EXACT** | `deityStanceLane.js:52`, `:58`, `:59` |
| V14 | `sacred_claim` quadrant tables; both-patrons guard | **MEASURED-TRUE** | `CLAIM_BY_QUADRANT` `:69`, `RITE_BY_QUADRANT` `:76`, `patronRefOf` `:126`, `faithProximityOf` `:115`, the both-patrons guard `:152` |
| V15 | Amendment-C dissolution; `sacredAnchors`; `anchor_unavailable` legacy arm; `warTerminationEnabled` read | **MEASURED-TRUE, addresses moved** | mint `warTermination.js:246-259`; `anchor_unavailable` at `:345`, `:349`, `:468`; re-read at `:328`; the flag read is `applyWorldPulse.js:534` (volume said `:536`) |
| V16 | realm pantheon promote/demote 2/4/2; **no deletion path** | **MEASURED-TRUE** | `:54`, `:56`, `:57`; `grep -c "delete "` over `pantheon.js` → **0**. J-WF-1's ground holds |
| V17 | church agency: `CHURCH_OBJECTIVE`, `temple_authority`, `tithe_rights` | **MEASURED-TRUE** | `scoringObjective.js:86` EXACT; `factionCompetition.js:32`, `:65`, `:77` (volume said `:29/:62/:74`) |
| V18 | divine mandate → `publicLegitimacy`; theocracy 1.0 / royal 0.45 | **MEASURED-TRUE** | `religionState.js`: `MANDATE_GOV_WEIGHT` `{theocracy: 1, royal: 0.45}` **:563**, `MANDATE_RANGE 30` **:564**, `MANDATE_PULL 0.15` **:565**, `MANDATE_STEP 2` **:566** |
| V19 | `beliefMap` `faithLabel` + `observanceLabel` | **MEASURED-TRUE** | `beliefAxes.js:11-12` |
| V20 | Herald 'faith' + 'divination' sections; divination = forecast-shaped, structural | **MEASURED-TRUE** | see WF-S071 and WF-S072 — `HERALD_SECTIONS` `heraldRouting.js:64` (six members), **18** faith kinds, **8** divination kinds, plus a prefix router the volume never mentions |
| V21 | `FaithSection` ACTIVE/TEASER/HIDDEN + `faithPanelModel` | **MEASURED-TRUE (existence)** | `src/components/settlement/FaithSection.jsx` + `faithPanelModel.js` |
| V22 | `FAITH_EVENT_TYPES` filters DM EVENT-LOG entry types only | **MEASURED-TRUE** | `src/domain/display/faithEventFilter.js:27` `Object.freeze(['SET_PRIMARY_DEITY','IMPOSE_CULT'])`; consumers `journalPages.js:355` and `SessionMode.jsx` |
| V23 | D.0 LOCKED: premium by pulse inheritance; client-only fail-open accepted; composer-lane UI-only gate residual | **MEASURED-TRUE** | the R-4 deferral comment reproduces verbatim at **`src/store/settlementDeityHelpers.js:48-56`** — *"this is NOT the only lane that writes deity events … Single-sourcing the premium check across BOTH lanes is Wave R-4's premium-gate scan"*. ⚠ the module is under `src/store/`, not the domain tree |
| V24 | `pilgrimage.js` deity-agnostic draw; aspatial ⇒ 0; bounded [0, 0.1] | **REFUTED as to the qualifying bar** | dials reproduce (WF-S050), **but `drawsPilgrims` at `:59-62` is `scaleBand >= GRAND_SCALE_MIN && (PILGRIM_ACTS.has(act) \|\| scaleBand >= SPECTACLE_SCALE)`** — a metropolis-grade spectacle qualifies on ANY act. The volume's WF-0 acceptance quotes only the act-set half as *"pilgrimage.js's own bar"*, which is the narrower half. **A WF-0 negative arm built on "wrong act ⇒ no pilgrims" is VACUOUS at scaleBand ≥ 5** |
| V25 | institution rows creed-agnostic; backing lends to the SEAT; no congregation concept | **REFUTED as stated; conclusion survives** | `INSTITUTION_SCALE` `:181`, `STANDING_BACKING` `:184`, "creed-agnostic" `:177`/`:93` all reproduce. ⚠ the sub-claim *"grep congregation over worldPulse/institutions: zero"* does not survive a wider grep: **two** hits under `src/domain/worldPulse/` (`brokerageServicesFeed.js`, `stressorGates.js`). Neither is a faith concept, so WF-5a's anti-entrenchment premise holds |
| V26 | `clandestineFacet` criminal-only, zero faith references | **MEASURED-TRUE, EXACT** | 0 hits for `faith\|deity\|religio`; **53 lines**, exactly as the volume says |
| V27 | the only "tithe" is the granary reserve; no temple wealth anywhere | **MEASURED-TRUE** | `foodStockpile.js` carries 20 `tithe` occurrences; `templeWealth` → zero in `src/domain` |
| V28 | `gods_abandonment` = three co-present stressors | **MEASURED-TRUE, EXACT** | `realmEvents.js:26-35`, `types: ['famine','disease_outbreak','religious_conversion_fracture']` |
| V29 | five dedicated religion soaks; certification names the missing observation | **MEASURED-TRUE** | `scripts/audit/religion-{balance,coup-soak,plane-soak,soak}.mjs` + `simulate-religion.mjs` = five. `FAITH_SPREAD_OTHER` at `subsystemRowsBaseline.js:60`, verdict **UNOBSERVED**, naming the needed soak case and the *"v5 subsystems.stateKeys census"*. ⚠ **that certification prose still cites `whole-world-soak.mjs:112`, an address dead twice over** — see V-R7 |
| V30 | D3 crown-commitment amplifier deferred | **MEASURED-TRUE** | the seam comment reproduces at **`religiousContest.js:798`** — `// D3 SEAM (DELIBERATELY DEFERRED — DESIGN_SIM_DEPTH_R2 D3 …` — not the volume's `:773-781` |
| V31 | temple mediation narrow + scalar; `faithTerm` temple 0.4 | **MEASURED-TRUE** | `generosityEV.js` (at `src/domain/spatial/`) 401 eff, unmoved; `peaceTerms.js` imports `faithProximityOf` from `sacredClaim.js` |
| V32 | per-term compliance union owned by the peaceTerms family | **MEASURED-TRUE (union); REFUTED (address)** | the union is at `peaceTermsCatalog.js:134-135` — `complianceState` `'honored'\|'strained'\|'defaulted'\|'expired'` and its `trueState` fog twin `'honored'\|'strained'\|'defaulted'` — NOT `:122-123`, which is an unrelated `@property {number} value` line |
| V33 | `ROUTE_FLOW_SOURCES` frozen one-line table | **MEASURED-TRUE, EXACT** | `routeNetworkFlows.js:82` |
| V34 | `INTERVAL_WEEKS` canonical home + two local copies | **MEASURED-TRUE, ALL THREE EXACT** | WF-S053 |
| V35 | `hash01` keyed-hash idiom home | **MEASURED-TRUE, EXACT** | `src/domain/region/contestMath.js:45` |
| V36 | `ENGINE_GATED_VIRTUAL_RULE_KEYS` five keys | ⛔ **REFUTED** | WF-S060 — **24** |
| V37 | Herald totality walkers + `WHAT_PHRASES` home | **MEASURED-TRUE** | the three walkers exist at `tests/lint/{heraldRouting.walker,phrasedKindPools.walker,wizardNewsAuthoring.walker}.test.js`; `WHAT_PHRASES` is at **`src/domain/display/settlementRumors.js:116`** |
| V38 | `mutationCoverageManifest` exists | **MEASURED-TRUE** | `tests/lint/mutationCoverageManifest.test.js` |
| V39 | 800 effective domain ceiling; shrink-only JSON map | **MEASURED-TRUE (mechanism)** | `eslint.config.js:520-522` states the rule; `scripts/.size-baseline.json` holds nine `src/` entries |
| V40 | SP substrate ABSENT — no SP-1, no `postureOf` | ⛔ **REFUTED, TWICE** | SP-1 is BUILT (WF-S030). **SP-4 posture is BUILT**: `src/domain/worldPulse/strategicPosture.js` (136 eff) exports `strategicPostureActive` `:143`, `courtPostureOf` `:222`, `courtRiskAppetiteOf` `:303`, `POSTURE_TERMS` `:104`, `POSTURE_TUNING` `:320`, behind the virtual flag `strategicPostureEnabled` |
| V41 | spine reqs 13/14 exist as chair amendments | **MEASURED-TRUE** | `docs/DESIGN_FP_SPINE.md:76+` carries req 13 verbatim |
| V42 | `riskToleranceOf` already exports from `src/domain/roads/state.js:319` (npc-scoped) | **MEASURED-TRUE, EXACT — the collision is real** | ⭐ **and now moot in the direction that matters**: SP-4 landed spelling its reads `courtPostureOf` / `courtRiskAppetiteOf`, so the name never collides. §6 Q2's *"declared-dark arms"* recommendation is superseded by a built module behind a SECOND flag |

### §8a · THE §1a ROWS (R1–R8)

| R | Grade | note |
|---|---|---|
| R1 | **REFUTED (figures); mechanism MEASURED-TRUE** | WF-S011, WF-S013 |
| R2 | **MEASURED-TRUE, ADDRESSES EXACT** | WF-S008 |
| R3 | **MEASURED-TRUE** | `warReasonTaxonomy.js`: `WAR_REASON_TYPES` `:24` (**16** entries), `PEACE_REASON_TYPES` `:44` (**16**), `REASON_MIRRORS` `:106`; `warReasons.js` re-exports at `:112`/`:166`/`:201`; `schism_axis` → **zero** hits in `warReasons.js`, **3** in `sacredClaim.js` |
| R4 | **MEASURED-TRUE as to symbols; REFUTED as to the 1580 figure** | WF-S075 |
| R5 | ⛔ **REFUTED in its central claim** | WF-S030 |
| R6 | **MEASURED-TRUE** | `deity_war_pressure` / `deity_peace_pressure` at `settlementRumors.js:140-141` — EXACT. The faith desk carries **18** kinds, not ~17 |
| R7 | ⛔ **REFUTED — THE ONE ADDRESS THE VOLUME BOASTED HAD NOT ROTTED, HAS ROTTED** | R7 closes *"journalPages.js:345 is EXACT at HEAD (`gateFaithEvents`) — one census row that did not rot"*. At `f8d978df` the call is at **`:355`** (import at `:31`). Two further R7 addresses are dead in both directions: `whole-world-soak.mjs`'s empty `customContent: {}` is at **`:210`** and **`:680`**, neither the original `:112` nor R7's correction `:131`; `mutateEntities.js` is at **`src/domain/events/`** with `SET_PRIMARY_DEITY` at **`:810`** and `IMPOSE_CULT` at **`:854`**, not `:820`/`:864`. ⭐ **THE LESSON IS THE VOLUME'S OWN, TURNED ON ITSELF: a line-rot correction rots too** |
| R8 | **MEASURED-TRUE** | WF-S045 |

---

## §9 · THE TWO-ANCHOR ADDRESS TABLE (the WC lesson: every address a packet cites, cites two)

*Symbols do not rot; addresses do. A WF packet cites the SYMBOL plus TWO line anchors, or it cites
the symbol alone.*

| symbol | home | anchor 1 | anchor 2 |
|---|---|---:|---:|
| `advanceReligionStates` | `src/domain/worldPulse/religiousContest.js` | `:54` (import list) | `:811` (the `contestOwned` capture) |
| the WF-1a fall block | `src/domain/worldPulse/religiousContest.js` | `:695` (`priorPatron` capture) | `:815-822` (the gated `recordPatronFall`) |
| `attemptEntry` | `src/domain/worldPulse/religionState.js` | `:242` (definition) | `:262` / `:277` (its two suppression writes) |
| `resolvePatronContest` | `src/domain/worldPulse/religionState.js` | `:444` (definition) | `:485` (the siege-resolution suppression) |
| `pruneSuppressed` | `src/domain/worldPulse/religionState.js` | `:353` (definition, unexported) | `:312` (its one call, in `advanceShares`) |
| `RELIGION_TUNING` | `src/domain/worldPulse/religionState.js` | `:40` (declaration head) | `:51-52` (`PATRON_FLIP_MARGIN`/`_TICKS`) |
| `ENGINE_GATED_VIRTUAL_RULE_KEYS` | `src/domain/worldPulse/simulationRules.js` | `:185` (declaration head) | `:366` (array close) |
| `TERM_CATALOG` faith rows | `src/domain/worldPulse/peaceTermsCatalog.js` | `:228` (`shared_rite`) | `:245` (`temple_restitution`) |
| `TERM_FAMILIES` | `src/domain/worldPulse/peaceTermsCatalog.js` | `:325` (`TERM_TYPES`) | `:328` (the derivation) |
| `catalogGrewSinceWr10` | `src/domain/worldPulse/sovereigntyBundle.js` | `:191` (definition) | `:55-62` (the discharge note) |
| `WR10_FAMILIES_AT_LANDING` | `src/domain/worldPulse/sovereigntyBundle.js` | `:116` (declaration) | `:74` (the never-widen sentence) |
| `ERRAND_CONSUMERS` | `src/domain/worldPulse/envoyErrandVocabulary.js` | `:295` (declaration head) | `:325` / `:332` (the two WF-2b module paths) |
| `ENVOY_PURPOSE_CLASSES` | `src/domain/worldPulse/envoyErrandVocabulary.js` | `:130` (declaration) | `:147` (`PURPOSE_CLASS_BY_PURPOSE`) |
| `CONDITIONAL_LEDGER_KEYS` | `src/domain/worldPulse/worldState.js` | `:439` (declaration) | `:518` (the materialization loop) |
| the religionStates migration | `src/domain/worldPulse/worldState.js` | `:259` (`WORLD_STATE_MIGRATIONS`) | `:286` (the `schemaVersion: 2` return) |
| `LAYER_PATTERNS.FAITH` | `tests/lint/couplingInclusion.walker.test.js` | `:150` (family head) | `:164` (WF-1a's exact-path row) |
| `UNLAYERED_BASELINE_CEILING` | `tests/lint/couplingInclusion.walker.test.js` | `:646` (the constant) | `:1160` (its `.toBe` arm) |
| `ARGUED_ROSTER_CEILING` | `tests/lint/couplingInclusion.walker.test.js` | `:612` (the constant) | `:889` (its `.toBe` arm) |
| `COMPOUND_SIGNATURES` | `src/domain/worldPulse/realmEvents.js` | `:24` (array head) | `:67` (the fifth key) |
| the realm tier beats | `src/domain/worldPulse/realmEvents.js` | `:284` (`pantheon_ascendancy`) | `:307` (`pantheon_twilight`) |
| `HERALD_SECTIONS` | `src/domain/realm/heraldRouting.js` | `:64` (declaration) | `:138-150` (the faith token rows) |
| the herald prefix router | `src/domain/realm/heraldRouting.js` | `:357` (`['faith_', 'faith']`) | `:358` (`['pantheon_', 'faith']`) |
| `WHAT_PHRASES` | `src/domain/display/settlementRumors.js` | `:116` (declaration) | `:140-141` (the deity-pressure rows) |
| `TRACKED_LEDGER_KEYS` | `src/lib/spatialUsage.js` | `:238` (declaration) | `:234` (the both-ways contract note) |
| the flag-domain census | `tests/soak-harness/coveringArrayCoverage.test.js` | `:167` (`virtual` 24) | `:174` (`union − governed` 56) |
| the lighting census tuple | `tests/lint/sovereigntyLightingContract.walker.test.js` | `:4848` (the live tuple) | `:4254` (the prior ancestry row) |
| `strategicPostureActive` | `src/domain/worldPulse/strategicPosture.js` | `:143` (definition) | `:222` / `:303` (`courtPostureOf` / `courtRiskAppetiteOf`) |
| `riskToleranceOf` (the collision) | `src/domain/roads/state.js` | `:319` (the npc-scoped export) | — (no second home; that is the point) |

---

## EXECUTION LOG

All reads were against the COMMIT TREE at `f8d978df`, never the working tree. No vitest run, no
gate, no `npm run check*`, no `gate-mutex.sh`, no git write.

1. **The effective-line measurement** — a scratchpad script (`laneTCWF-measure-eff.mjs`) importing
   the repo's own `node_modules/eslint/lib/api.js` `Linter` and feeding it source text from
   `git show f8d978df:<path>`, under `max-lines { max: 1, skipBlankLines: true, skipComments: true }`,
   reading the actual count out of the rule's own message. **30 files, `TRUE_EXIT=0` captured
   in-shell.** ⚠ Reading the blob rather than a checkout is what makes the figures the BUILD
   BRANCH's rather than the working tree's, which matches no branch.
2. **The copy reconciliation** — `diff <(git show f8d978df:…WF.md) <(git show review-fixes-2026-07-08:…WF.md)`,
   **141 diff lines across NINE hunks**, saved to `laneTCWF-volume-copies.diff`.
3. **The symbol sweeps** — roughly forty `git grep -n <pattern> f8d978df -- <paths>` and
   `git show f8d978df:<path> | sed -n` reads. ⚠ **A ZSH TRAP THIS LANE HIT AND RECORDS**: an
   unquoted `$SHA:src/...` in zsh triggers a history modifier on the `:s` and silently mangles the
   ref into a different, wrong path; two sweeps returned empty and one returned a mangled-path
   error before it was caught. **Quote the whole ref: `git show "<sha>:<path>"`.** An empty grep
   result from a mangled ref reads exactly like a true zero.

**WHAT THIS SWEEP DID NOT DO, STATED AFFIRMATIVELY.** It ran no test and therefore graded no claim
about test OUTCOMES. It did not re-derive raw-line figures (a unit no instrument pins). It did not
grade the DISPOSITION of Q1 or Q4 — only their premises. It did not open `laneWFF-round.md` or
`laneWFF-report.md`; every §78 confirmation above is independent. And it did not locate any document
titled "engine queue" at `f8d978df` or in the ledger working tree, so the §27 dispatch gate is taken
from the dispatching brief and is not independently verified here.
