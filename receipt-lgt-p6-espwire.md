# RECEIPT — LGT-P6-ESPWIRE (L-HOMES CAR 5) — ⚠ PARTIAL → **CLOSED AS A MEASURED STOP, ZERO BYTES**

**Lane** L-HOMES-5 / `LGT-P6-ESPWIRE` · **Seat** Opus 5 — Fable-unvalidated · **Chair** Fable 5.1
**Dock** `$SC/laneLH5`, detached at `38474a59eba460f30d6596dcb65efda3a446738a`.
**Arrival verified:** HEAD == `38474a59e` ✅ · `git status --porcelain` = **0 lines** ✅ · `node_modules/vitest` is a
symlink into the owner tree ✅.
**Exit state:** HEAD `38474a59eba460f30d6596dcb65efda3a446738a` (UNCHANGED) · porcelain **0 lines** (re-verified after
every probe). **No commit. No file written into the dock. No register act. No vitest run.**
Scratch lives OUTSIDE the measured tree at `$SC/laneLH5-scratch/` (the "a probe that writes into the tree it measures is
a write" hazard) — three probes, all plain `node`, importing the dock by absolute `file://` path.

---

## 0 · THE HEADLINE

**The car as briefed cannot be built at this base, and the reason is not a missing hour — it is that every espionage
moment the design permits a reader to see has NO PRODUCER, and every espionage receipt that HAS a producer is one the
design forbids voicing.** The brief's own instrument premise is refuted twice over, and the car's charter (`ES-7`) is
blocked on two un-landed prerequisites plus an owner signature that does not exist.

**⭐ THE SCHEDULE-FREEING FINDING: `LGT-P6-ESPWIRE` DOES NOT GATE L-DEFAULT HUNK 6.** The docket's claim — *"Lit
espionage without it means silent machinery in the walk — a NEWS ADDRESS LAW breach by construction"* — is **REFUTED**.
A lit espionage layer that files no news is not a breach of the news address law; it is the ES design's own ruling
(§3.5 row 4 / §4 / ES-7's L6: covert work becomes news **only through exposure**, and the covert kinds are **dm-only,
fail-closed upstream**). The espionage flip may board without this car.

---

## 1 · PREMISE RE-DERIVATION — WHAT THE BRIEF SAID, WHAT THE TREE SAYS

| # | brief's premise | measured at `38474a59e` | verdict |
|---|---|---|---|
| 1 | "0 of 18 files under `src/domain/worldPulse/espionage/` write a news entry" | `ls` = **18 files** (7,023 lines). The walker's OWN census (`censusNewsAuthoringSites`, `tests/lint/newsAuthoringCensus.shared.mjs`) returns **0** authoring sites under `worldPulse/espionage/` **and 0 under `worldPulse/operations/`** | ✅ **HOLDS, and widens to 0 of 22** |
| 2 | "Wire missions, captures and products into the Herald/news seam" | the three receipt families exist and are handed back by `advanceEnvoyDiplomacyPulse` (`envoyPulse.js:563/564/568/569/570`) and are read by **NOBODY** — `git grep espionageDetections\|espionageLandings\|espionageGatherings\|espionageSkipped\|espionageProductsSkipped -- src tests` returns **only the five definition lines and the five empty-shell initialisers** (`envoyPulse.js:161–165`) | ✅ the gap is real — ⛔ but see §2: it is not fillable here |
| 3 | "`narrativeParity.test.js`'s CLAIMS-PARITY arm convicts a lit mechanism with no backing news — exercise it with the flag forced on" | ⛔ **REFUTED TWICE** — see §3 | ⛔ **REFUTED** |
| 4 | "Dark-inert" | trivially satisfied by zero bytes; and the flip's own dark-inertness is **not** provable on the fixture I had (see §5) | ⚠ qualified |
| 5 | (chair's dispatch note) "the pantheon/kindPoolFloors freezes now live in `tests/helpers/kindRegistryRoster.js` … NOT at your base" | at my base `tests/helpers/kindRegistryRoster.js` holds the **ROSTER LIST** (13 registries incl. `CHANCE_MEETING`), and its own header rules *"The FIGURES derived from this roster stay literal in each consumer"* — the figures `REGISTERED_KIND_COUNT = 114` and `ROUTED_TOKENS = 380` are literal in `tests/lint/kindPoolFloors.walker.test.js:158/:185` | ⚠ **PARTLY WRONG AT MY BASE** — the list moved, the figures did not. Moot here (I mint nothing) |

---

## 2 · ⛔ THE BLOCKER SET — EVERY ROAD, MEASURED, WITH ITS ADDRESS

### 2.1 The moments a reader may see have NO PRODUCER
`src/domain/worldPulse/espionage/operationsVoice.js` (614 lines) is **already the espionage voice**. Its own header,
verbatim: *"the wizard-news envelope (the banner field, the presentation weights, the desk registration) belongs to the
**wiring car that first mounts these beats on a feed** … Until that car lands, nothing here is routed, registered, or
visible anywhere."* **This car IS that wiring car.** Its three surfaces:

| surface | what it needs | measured at this base |
|---|---|---|
| **EXPOSURE NEWS** (`:391 exposureNewsBeat`, four moments `taken` / `price_named` / `pardoned` / `died_in_custody`) | a custody hold whose cause is `caught_spying` (`:338 COVERT_CAUSE_MIRROR`) | ⛔ **NOTHING WRITES ONE.** `caught_spying` is a *declared* member of the hold vocabulary (`foreignGuestHold.js:42`) with **zero writers**. ES-2's gauntlet computes the capture and refuses to persist it: `espionageGauntlet.js:576–578` ships `custodyWritten: false`, `custodyBlockedReason: 'encounter_required_by_errand_dto'` on **every** detection. Opening custody is a persisted-schema question and **owner-gated** |
| **MISSION BEATS** (`:273`-family, the acceptance walk) | the acceptance seam's row-seven receipt, i.e. `operations/missionDispatcher.js` | ⛔ **NO PRODUCTION CALLER.** Its own header: *"DARK: NO PRODUCTION CALLER, NO FLAG, AND BOTH ARE PINNED. Nothing under src/ imports this module; `tests/domain/missionDispatcher.test.js` walks the src tree and asserts the empty importer set."* Its `openOperations` supplier is **car O2's, unbuilt** |
| **GOING-NATIVE ARC** (`:562 goingNativeArcBeat`) | `infiltrationDepth.js` / `infiltrationDrift.js` | ⛔ doorless siblings — CAR 4's (`LGT-P5-WOPS`) subjects, and even lit they feed a surface whose reversal line is *"DELIBERATELY UNWRITTEN … Writing it is a ruling on the unsigned reversal fork"* |

### 2.2 The receipts that HAVE a producer are the ones the design forbids voicing
The layer's live traffic road is **ES-Da's rider**, not ES-1's mint. ⚠ I nearly filed the opposite finding and the tree
corrected me: `mintCovertMission` genuinely has zero `src/` importers (`envoyErrandVocabulary.js:200–205`, verbatim:
*"nothing under `src/` imports `espionageMissions.js` at all"*), **but** `envoyDiplomacy.js:481` calls
`covertRiderFor(...)` inside the accepted-peace dispatch, and the ES certification row
(`subsystemRowsBelief.js:178`) rules: *"ES-Da BUILT THE DISPATCH … **So a covert mission IS minted in a running world
and the product stage no longer walks an empty ledger — ONCE THE FLAG LIGHTS.**"* So the three families are reachable.

And each is unvoiceable **by the layer's own law**:
- a **DETECTION** is a computed capture the world did not persist (`custodyWritten: false`). Filing news for it would
  assert a capture no ledger carries — the fluent-and-false class, and a claims-parity conviction waiting to happen.
- a **GATHERING / LANDING** is a covert operation that *succeeded*. `operationsVoice.js` header, verbatim: *"A covert
  operation that succeeds mints **NO public word** — the engine models what is known, and an unseen spy is not yet a
  story."*

⇒ **A seed-selector built on ENC-3's precedent would reject 100 % of its inputs.** ENC-3's `heraldSeedsOf` is honest
because three of its six outcomes are voiceable (`envoyChanceMeetingStage.js:558–564`). Mine would have zero. **A seam
whose beat-selector can never select is a dead arm by construction**, and that is the one shape this estate convicts on
sight. **This is why I did not ship the seam.**

### 2.3 `ES-7`, the car's actual charter, is blocked on two named prerequisites
`docs/DESIGN_FP_ARCH_ES.md:1758` — *"**ES-7 — THE VOICE + THE MEASURE** (final slice; **after IN-5 for the knowledge
desk**…)"*; spine at `:1770` reads `→ ES-6a → ES-7 (IN-5)`.
- **IN-5 has not landed.** `src/domain/realm/heraldRouting.js:64` —
  `HERALD_SECTIONS = ['war','faith','trade','events','divination','adjudication']`, the **frozen six**. No knowledge
  desk. `informationNews.js:22–26` names the same wall: *"the section vocabulary is a frozen six and the seventh is
  IN-5's to mint."*
- **The six kinds are ES-7's by §4 and exist nowhere.** `git grep espionage_departed|espionage_confirmed|
  espionage_refuted|espionage_caught|espionage_exposed|espionage_betrayal -- src tests scripts schema` → **0 hits**
  (design `:246`; the C5 refutation at `:1274` says so in terms: *"`espionage_exposed` exists nowhere in the repo"*).
- **The pools are a CHAIR ANNEX ACT, not a lane's.** The freshest precedent, `envoyChanceMeetingReceiptPools.js:16–22`:
  *"⛔⛔ ANNEX-VERBATIM, AND THE WORDS ARE THE CHAIR'S … A corpus defect is a chair annex act, never an edit to this
  file: the owner handed the words to the chair in so many words."* ES-7's charter says the ES rows go in *"the ES annex
  **the chair assigns**"* — and `ls docs/content/` shows **no `RECEIPT_POOLS_ESPIONAGE.md`**.

### 2.4 ⛔ THE OWNER SIGNATURE THAT DOES NOT EXIST — and a LANDED TEST that reserves the wiring
`operationsVoice.js:602–614`, `OPERATIONS_VOICE_PROVENANCE`, verbatim:
> `status: 'CANDIDATE, OWNER-UNSIGNED (**every sentence in this file is voice-taste awaiting the pen**; the vocabularies are closed, the lines are candidates)'` · `signedBy: null`
> `ownerRows[0]`: *"every line and reason here is the pen's: the words are candidates, and none is signed"*
> `ownerRows[2]`: *"the audience split (mission beats and the long watch are the principal's; exposure moments are the town's) is a **recorded judgment, vetoable**"*

And the reservation is **enforced**, not merely written — `tests/domain/operationsVoice.test.js:630–635`:
```js
const namers = srcFiles(join(ROOT, 'src'))
  .filter((file) => relative(ROOT, file)… !== LEAF_REL)
  .filter((file) => /operationsVoice/.test(readFileSync(file, 'utf8')))
  .map((file) => relative(ROOT, file));
expect(namers).toEqual([]);
```
plus `:671` `expect(OPERATIONS_VOICE_PROVENANCE.consumers).toMatch(/NONE/)` and `:713–716`
`expect(signedBy).toBeNull()` / `status` matches `/OWNER-UNSIGNED/` / `ownerRows.length >= 5`.

**No `src/` module may so much as NAME this leaf — a comment mention reds it.** Per the brief's own CAR-7 rule, *"If the
landed test still reserves the funnel door, that is a STOP with the file:line, not a test to soften."* **This is that
STOP, and the file:line is `tests/domain/operationsVoice.test.js:630`.** Wiring these beats would publish five
owner-unsigned candidate-prose surfaces to a paid product surface and would settle the vetoable audience split by
shipping it — an owner-gated class an implementer lane must never take.

### 2.5 ⚠ ONE OVERSTATEMENT I CAUGHT IN MYSELF, RECORDED
I first read `tests/property/espionageDormancyFence.test.js:339–343` (*"the espionage set gained a SECOND src importer
… This fence admits exactly one"*) as covering the whole layer. **Measured, it does not:** `ESPIONAGE_SET` at `:124–128`
is exactly three files (`espionageGate.js`, `espionageDoctrine.js`, `espionageMath.js`) and `THE_CALLER` at `:184` is
`missionDispatcher.js`. `envoyPulse.js` already imports `espionageGauntlet.js` / `espionageProductStage.js` lawfully.
**A seam touching only the gauntlet/product receipts would NOT trip that fence.** Charter the permission, measure the
mechanism — recorded so the chair does not inherit my first reading.

---

## 3 · ⛔ THE BRIEF'S INSTRUMENT PREMISE IS REFUTED, TWICE

> "`narrativeParity.test.js`'s CLAIMS-PARITY arm convicts a lit mechanism with no backing news — exercise it with the
> flag forced on."

**(a) The walker cannot light espionage, and "the flag" is three flags.** `narrativeParity.test.js:112–115` builds its
world from `{ ...SIMULATION_RULE_PRESETS.full_simulation.rules, provenanceLedgerEnabled: true }`. **Measured, executed:**
```
full_simulation: errandSpineEnabled=undefined  espionageEnabled=undefined  beliefAxesEnabled=undefined
```
`espionageActive` (`espionageGate.js:75–82`) is a **three-door conjunction** — beliefs live, `errandSpineEnabled === true`,
`espionageEnabled === true`. All three are absent from **every one of the seven presets** and from
`DEFAULT_SIMULATION_RULES`. ⭐ And the host layer is dark too: measured,
`warLayerEnabled=true warTerminationEnabled=false peaceEngineEnabled=true envoyDiplomacyEnabled=false
npcConsequencesEnabled=false routeLifecycleEnabled=false` — **3 of the 6 `ENVOY_REQUIRED_RULES` are false in the
"everything-on ceiling" preset**, so that walker never mints an errand at all, covert or open.

**(b) Claims-parity convicts SURFACES, never silent mechanisms.** Read at source, every arm is of the form *a reader
surface asserted a beat that is not in the recorded substrate*: `:327` `if (!pulseHeadlines.has(hop.headline))
unbackedHops.push(...)`; `:392–400` letter lines vs `feedById`; `:404–412` book rows vs the feed multiset; `:420–424`
chronicle events vs `pulseProse`. **A mechanism that emits no news contributes nothing to any surface and is therefore
invisible to all three arms.** The instrument that would notice silent espionage is the **certification observation**
(`subsystemRowsBelief.js:178`: *"THE OBSERVATION NEEDED to move this row off UNOBSERVED is a completed mission in a soak
receipt"*), and it is an OBSERVATION status, not a red.

---

## 4 · WHAT I RAN — EVERY EXIT CAPTURED IN-SHELL

| # | act | command | exit | result |
|---|---|---|---|---|
| 1 | dock arrival | `git rev-parse HEAD; git status --porcelain \| wc -l` | 0 | `38474a59e…`, **0** |
| 2 | preset flag derivation | `node --input-type=module -e '…SIMULATION_RULE_PRESETS…'` | 0 | all 7 presets + DEFAULT: three espionage doors **undefined** |
| 3 | envoy gate derivation | `node --input-type=module -e '…ENVOY_REQUIRED_RULES…'` | 0 | 3 of 6 **false** in `full_simulation` |
| 4 | live sim, ESPIONAGE **LIT** (3 doors + all 6 envoy rules forced), 36 × `one_month`, 8 settlements, seed `espwire-probe-seed` | `node $SC/laneLH5-scratch/probe-esp.mjs` | 0 | `gateLit:true` · `errandRowsMax:0` · `covertRowSightings:0` · `feedEntries:240` · `distinctKinds:5` · `espionageKinds:[]` |
| 5 | the same, **DARK** control | `PROBE_LIT=0 …` | 0 | `gateLit:false` · everything else **byte-identical to (4)** |
| 6 | news-authoring census (the walker's own instrument) | `node $SC/laneLH5-scratch/probe-census.mjs` | 0 | `files 1101 · candidateSites 109 · sites 108 · distinctPaths 63 · excluded 1 · **espionage/ + operations/ authoring sites: 0**` |
| 7 | dock exit | `git status --porcelain \| wc -l; git rev-parse HEAD` | 0 | **0** lines, HEAD unchanged |

**⚠ HONEST LIMIT ON (4)/(5), STATED RATHER THAN HIDDEN.** The LIT arm **did not exercise the layer**: `errandRowsMax: 0`
means the fixture never reached an accepted-peace dispatch, so ES-Da's rider was never asked. (4) vs (5) is therefore a
proof that *this fixture cannot reach espionage*, **NOT** a dark-inert proof of the flip. **I am not offering it as one.**
A real dark-inert receipt for `espionageEnabled` needs a fixture that drives war → peace acceptance; that is L-PROBE's
per-preset battery and the soak's job, not a `-e` probe's. ⛔ The chair must not quote row 4/5 as the flip's control.

**`tests/lint/` WHOLE:** ⛔ **NOT RUN, AND NOT OWED.** The preamble owes it *"whenever your cars add, rename or delete
any file under `src/` or `tests/`."* This car adds, renames and deletes **nothing** — porcelain is 0. Running the
83-walker family against an unchanged tree would measure a sibling lane's tree state, not mine, and a whole-suite vitest
was in flight from `laneDESKPROOF4` (`sh scripts/gate-mutex.sh --run -- npx vitest run`, 7 min elapsed, 7 forks, load
avg 21) for most of my window. `typecheck:domain:strict`, eslint and plant-out are likewise not owed: **zero bytes**.

---

## 5 · PREDICTED REGISTER DELTAS — ALL ZERO, AND WHY

| register | predicted delta | derivation |
|---|---|---|
| lighting census (`titles` **and** `suiteTitles`) | **0 / 0** | no file added, renamed or deleted; no flag minted; no suite added |
| test ratchet `totalTests` / `totalFiles` / `entries` | **0 / 0 / 0** | no test file, no test case |
| voice magnitudes (`voiceMechanics`, `proseLeak`) | **0** | not one string added to `src/` |
| `sizeBaseline` | **0** | no line added to any measured file |
| writer-reach | **0** | no writer added |
| OSR (`schema`/`total`/`identities`/`minRows`) | **0** | no observed-shape read added |
| the four censuses per new `src/domain` leaf | **0** | **no new leaf** |
| `tests/lint/` scanner family (83 walkers) | **0** | no source motion |
| golden-freeze register | **0** | no golden-adjacent test file added; **nothing to enrol and nothing to exclude** |
| `kindPoolFloors` `REGISTERED_KIND_COUNT` 114 / `ROUTED_TOKENS` 380 / registered-minus-routed 8 | **0 / 0 / 0** | no registry row, no `EXACT_SECTION` row |
| `wizardNewsAuthoring` floors (999/99/98/58) + the exact `candidateSites === sites + 1` | **0**, relation holds | measured live at **1101 / 109 / 108 / 63**, `109 === 108 + 1` ✅ |
| engine-gated walker backlog (17 at ceiling 17) | **0** | no key manifested |

**⭐ EAGER BYTES = 0, and the reason is stronger than the usual one.** The consist's STOP is a hashed-chunk listing diff
over `(margin − 100 B)`. This car changes **no byte of any file**, so the built artifact is bit-identical by
construction — not "predicted 0" from a reachability argument, but **0 because the input is the same input**. The
`CLOSURE_BUDGET_BYTES = 1_048_000` margin at `tests/build/vendorPdfLazy.test.js:565` (CORRECTIONS §1) is untouched.

---

## 6 · THE RE-CUT I RECOMMEND (chair-vetoable, and I did NOT take it)

`LGT-P6-ESPWIRE` should be **struck from POSITION 2 and re-filed**, in three parts, because it is three different
classes of work wearing one id:

1. **`ESPWIRE-a` — REMOVE THE FALSE DEPENDENCY. Free.** L-DEFAULT hunk 6 (the espionage flip) boards **without** this
   car. Grounds: §3 above (no instrument convicts) and the ES design's own §3.5 row 4 / §4 / L6 (covert becomes news
   only through exposure; the covert kinds are dm-only, fail-closed upstream). The flip's real consequence is that the
   ES certification row moves toward OBSERVED — a status move, not a red.
2. **`ESPWIRE-b` — THE OWNER ROW.** `operationsVoice.js` holds five open `ownerRows` and `signedBy: null`. **The pen
   must sign the sentences, and the audience split must be ratified, before any wiring exists.** This is a
   voice-sitting item, not a build item. ⏱ **AND IT IS TIME-SENSITIVE, WHICH NOTHING ELSE HERE IS:**
   `tests/property/espionageDormancyFence.test.js:322–332` re-records its driven-corpus constant **only inside a NAMED
   CHARTERED WINDOW**, and *"exactly ONE remains: the LIGHTING WAVE (§881.4)"*. If espionage prose ever lands, it is
   cheapest **inside this wave**; after it, it costs a fresh owner word.
3. **`ESPWIRE-c` — THE REAL WIRING CAR, and it is `ES-7`, blocked.** Prerequisites, in order: **IN-5** (the knowledge
   desk — `HERALD_SECTIONS` is a frozen six), **the chair's ES annex** (`docs/content/RECEIPT_POOLS_ESPIONAGE.md` does
   not exist), the **six kind mints + `EXACT_SECTION` rows** (`ROUTED_TOKENS 380 → 386`, and the registered-minus-routed
   identity of 8 must be re-derived, not assumed), and — for the exposure surface alone — the **owner-gated custody
   question** (`custodyBlockedReason: 'encounter_required_by_errand_dto'`).

**Why I did not ship the ENC-3-shaped seam as a consolation.** It is the one thing that looked buildable, and it is not:
§2.2 shows its beat-selector would reject every reachable input, and its only consumer (ES-7) is blocked outside this
wave. Under the owner's *"never present a cheaper option as the best available"*, a seam that can never select and can
never be consumed is a cheaper option dressed as progress. **Zero bytes is the honest deliverable.**

---

## 7 · RETROVALIDATION ROW (for the Fable chair)

| what was judged | what the chair must re-derive | receipts, by path | priority |
|---|---|---|---|
| **The car is a STOP, not a build** — every voiceable espionage moment lacks a producer; every reachable receipt is unvoiceable by the layer's own law | that a seed-selector on ENC-3's shape really would select **zero** reachable receipts (the one judgment call in this receipt that is an inference rather than a quotation) | `operationsVoice.js` header + `:331–465`; `espionageGauntlet.js:576–578`; `envoyChanceMeetingStage.js:550–585` (the precedent that DOES select) | ⭐⭐ **HIGH** — it is the whole disposition |
| **`LGT-P6-ESPWIRE` does not gate L-DEFAULT hunk 6** | that no *other* instrument (soak envelope, certification observation, a `tests/lint/` arm) convicts a lit-but-silent espionage layer — I proved `narrativeParity` cannot and named the certification row as the real watcher; I did **not** sweep all 83 walkers | `narrativeParity.test.js:112–115`, `:327`, `:392–424`; `subsystemRowsBelief.js:178`; `docs/DESIGN_FP_ARCH_ES.md:693–695`, `:1274–1277` | ⭐⭐ **HIGH** — it frees POSITION 3 |
| **The wiring is OWNER-GATED at its content** (five unsigned `ownerRows`, `signedBy: null`, a vetoable audience split) and a landed test reserves it totally | nothing to re-derive — it is quoted verbatim. The chair must decide whether to put `ESPWIRE-b` to the pen **inside this wave**, while the chartered prose window is open | `operationsVoice.js:602–614`; `tests/domain/operationsVoice.test.js:630–635`, `:671`, `:713–716`; `espionageDormancyFence.test.js:322–332` | ⭐⭐ **HIGH, and time-boxed** |
| **ES-7's prerequisites** (IN-5's desk; the chair's ES annex; six kind mints) | the exact register bill of the six kinds when ES-7 finally boards — `ROUTED_TOKENS` 380 and the registered-minus-routed identity of 8 must be **re-measured**, never assumed from this receipt | `heraldRouting.js:64`, `:81`; `kindPoolFloors.walker.test.js:158`, `:185`, `:228`, `:369`; `DESIGN_FP_ARCH_ES.md:1758–1782` | ⚠ MEDIUM — a later wave's bill |
| **A brief figure is wrong** — the kindPoolFloors/pantheon **figures** are literal in their consumers at my base; only the roster LIST lives in `tests/helpers/kindRegistryRoster.js` | whether the §900 composition really moved the FIGURES; if not, the dispatch note should be corrected before another lane relies on it | `tests/helpers/kindRegistryRoster.js:16–19`; `kindPoolFloors.walker.test.js:158/:185` | ⚠ MEDIUM |
| **My probe's LIT arm is NOT a dark-inert control** | do not quote probe rows 4/5 as the flip's byte-identity proof; the real control is L-PROBE's per-preset battery | `$SC/laneLH5-scratch/probe-lit2.json`, `probe-dark2.json` | ⛔ **BLOCKING on misuse** |

---

## 8 · DOCK TIP

```
38474a59eba460f30d6596dcb65efda3a446738a   (UNCHANGED — no commit taken)
git status --porcelain  →  0 lines
```
