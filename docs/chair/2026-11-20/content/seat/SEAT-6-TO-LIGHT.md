# TO LIGHT: the seat law's flip, surveyed (SEAT-6, read-only)

Surveyed at `02f4af2d8`. HEAD is `50509b4fc`, two docs-only commits later, so the code is the same (`git diff --stat` shows docs only).

How I tested the flip: I copied the tree to `/tmp/claude-0/tolight/flip`, flipped the two dials there, and ran 13 single test files. The outputs are `/tmp/claude-0/tolight/run-*.txt`. The repo was not touched (`git status` is empty).

Labels: **C** = CONFIRMED (read in code, or run). **P** = PLAUSIBLE.

## 1. THE SWITCH

- **The key and its value.** The key is `_seatLawVersion`, and the value is `2`. Defined in `src/domain/seat/seatLaw.js :: SEAT_LAW_CONFIG_KEY` and `HOLDER_SEAT_LAW_VERSION`. **C**
- **Why a birth mints nothing today.** The cause is the dial, not the register row:
  - `seatLaw.js :: NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION`, which is 1.
  - So `newSettlementSeatLaw()` returns `{}`.
  - `densityCreateBoundary.js :: birthConfig` spreads that empty object last (`...newSettlementSeatLaw()`), and only after clamping away any incoming `_seatLawVersion`.
  - `GENERATION_LAWS.seat` is already `wiring: 'WIRED'`. The birth callers are `store/settlementGenerateAction.js` and `lib/instantWorld/composeInstantWorld.js` (`birthConfig({})`). **C**
- **The flip, minimally.** **C** (run on the copy)
  - `NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION`. That one line makes every new birth mint `{ _seatLawVersion: 2 }`.
  - Keep the clamp, as the living-content precedent did.
  - Rewrite the text of `GENERATION_LAWS.seat.why`, which still says "THE DIAL IS DARK". The module headers say DARK too, but they are comments only.
- **The contest dial: L1, not D, not LP.** `seat/seatCircumstances.js :: SEAT_CONTEST_LIT` is `false` today. It is read only under the law (`rulingPowerCoup.js :: coupContenders` `lit = law && SEAT_CONTEST_LIT`, and `stressorDynamics.js:882`).
  - The three arms in `u4/measure-lit.md` mean:
    - **D**: the dial dark (today's kind read via `factionArchetype`, every factor 1).
    - **L1**: `SEAT_CONTEST_LIT = true` with `SEAT_CIRCUMSTANCE_TUNING` unchanged (every factor 1), so the CS4 kind read `contestKindOf` comes on.
    - **LP**: lit with the PROPOSED factors.
  - The chair's item 67 says "arm D, with the contest at today's figures: your L1". The hand-back glosses that as "contest at L1".
  - **So the flip sets `SEAT_CONTEST_LIT = true` and touches no factor.** Leave `SEAT_CIRCUMSTANCE_TUNING` at every factor 1 (the `// PROPOSED` comments are LP and must not be applied). **C** (read)
  - ⚠ **D and L1 are not the same world, so the chair should confirm "L1".** Their calm-contested rates are equal. But in `measure-lit.md` ("D → L1, for the record"), the field or the risk moves in 111 and 112 of 600 places on the two headline pools, and the top-three kinds move in 17 to 18 (craft −12/−13, criminal −5). **C** (read from the measure)
  - L1 also has a privacy merit (§4c).

## 2. THE FLIP'S WORKLIST

**Red at the flip: 10 tests.** I ran these on the copy with both dials flipped. **C**

| file | test title | what it pins |
|---|---|---|
| `tests/domain/seatLawWiring.test.js` | "the vocabulary: one key, two versions, the dial at the default" | `NEW_SETTLEMENT_SEAT_LAW_VERSION` is 1; `newSettlementSeatLaw()` is `{}` |
| same | "1. CREATE (dark): birthConfig carries no _seatLawVersion, and birthConfig(null) is byte-equal to its pinned value" | no key on a birth; `birthConfig(null)` is density plus living-content only |
| same | "2. CREATE (THE CLAMP): an incoming _seatLawVersion: 2 is clamped away — an imported marker never decides a birth" | the clamp, driven only on the product dial. It must move onto a mocked dark seam, as `livingContentLawWiring`'s clamp arm does (`boundaryWithDarkLaw`) |
| `tests/domain/livingContentLawWiring.test.js` | "⭐ CREATE (LIT, the product path): birthConfig writes the law marker and NOTHING else" | exact key set (density plus living-content) |
| same | "CREATE (dark, fired deliberately): at the dormant dial birthConfig still writes not one byte" | `{...CONFIG, ...density}` exactly |
| same | "⭐⭐ CREATE (THE SAME-SEED CONTROL, LIT): a birth through the boundary is the same world but the law it declares" | the raw arm lacks the seat marker; the raw needs `...newSettlementSeatLaw()` |
| same | "⛔ CREATE (THE CLAMP): a LIT marker arriving through the wizard form cannot birth a v2 world" | the key set after the clamp |
| `tests/domain/seat/seatContest.test.js` | "the dial is dark and every factor of the registered table reads 1" | `SEAT_CONTEST_LIT === false` (its factor half stays true) |
| same | "under the law, dark: the kind read is today's (a hidden power still contends, an economy craft guild reads merchant)" | the D kind read on the real module |
| same | "dark: today's read (a craft archetype has no row, so the plot reads palace_coup), with and without the law" | `stressorDynamics` variant `palace_coup` under the law |

**Green at the flip, but they will need edits. C** (run; the two conditional reds below are read)

- `seatLawWiring` "4. GENERATION_LAWS.seat is a WIRED row that says the dial is dark, and why". It requires `/\bdark\b/` in `why`, so it reds as soon as the flip rewrites that text (P).
- `seatContest` "the proposed figures are written beside the table, in its register row, as the owner's unsigned proposal". It pins `tests/lint/.tuning-register.json` row `SEAT_CIRCUMSTANCE_TUNING` `{status:'draft', signedAt:null}`, so it reds if the owner's "re-signing at the close" signs that row (P).
- `seatContest` "dark (the shipped dial): the craft guild stands fourth…" passes under L1 (same names), but its title says "dark".
- `seatTransfer.test.js` (12) "THE LAW DARK…" uses markerless fixtures and stays a valid old-law control.

**Registers:**
- `GENERATION_LAWS.seat.why`: the text needs rewriting.
- `.tuning-register.json` row: a draft row; signing it is the owner's.
- `.tuning-inventory.json`: no value moves.
- The walker's `MINT_SYMBOLS` / `MINT_HOMES`: unchanged.

`densityCreateBoundary.walker` (17/17), `writerReach.walker` (52/52, `dialConfigKeys` unaffected), `arcaneClassifierCensus.walker` (6/6), `holderOfSeat` (51/51), `seatTable` (45/45) and `seatTransfer` (39/39) are all green on the copy. **C**

**Golden master:** it does not move. `tests/helpers/goldenMasterCorpus.js` never calls `birthConfig`. **C** (grep)

**Born fixtures: the largest unknown.**
- 516 test files reach `birthConfig`, `settlementGenerateAction` or `composeInstantWorld`.
- Lit births move through `castPowers.js :: contendersOf` and `factionStanding.js :: annotateFactionStanding` (the "contestedBy" desc). Both read `coupContenders` at birth.
- Item 54 names 4 towns whose forced birth moves under D. L1 adds the kind-read moves, so expect more. **P**
- A sample of 4 born-seat tests is green on the copy: `powerSeatRender`, `powersReadTheRosterP31`, `seatHolderOnThePage`, `arcaneAdvisoryReadsTheSeat`. **C**
- The full census is U8's, and it needs a whole-suite run on the flipped tree.

## 3. SAVED TOWNS

- **Every read uses the town's own config.** `seatLaw.js :: resolveSeatLawVersion` reads the bag, then `settlement.config`, then `_config`. It never falls back to the dial. Every gate goes through `seatsByHolder(settlement)`: `coupContenders`, `transferRulingPower`, `factionCompetition.js:298`, `stressorDynamics.js:882`. So a markerless saved town keeps law 1 on every read, and `SEAT_CONTEST_LIT` cannot reach it (`lit = law && …`). **C**
- **Is there a test that a saved town keeps its law? None end to end.**
  - Partial arms:
    - `seatLawWiring` arm 5's tail ("READ (LIT dial): … markerless world as 1"), on bare objects with a mocked dial;
    - `seatContest` "a lit dial moves nothing under the old law" (on fixtures);
    - `seatTransfer` (12) digests (on fixtures).
  - What is missing is the seat analogue of `livingContentLawWiring.test.js` "⛔ a PERSISTED law-1 world survives load, section regen and the clone seam unstamped" (the NO-MIGRATION describe). That would take a markerless born town through JSON load, `regenSection`, `deepClone` and a pulse transfer on the lit build. **C** (grep)
- **Could a saved town gain the key?**
  - **Regen / re-derive: no.** `settlementRegenAction.js:180` reads `settlement.config || config`, and the walker guards that order. `settlementRederiveAction`, `economyReconciliation`, `settlementConfigMigration` and `saves.js` mint no law (no `LawVersion` / `NEW_SETTLEMENT_` reference). `birthConfig` has only the two BIRTH callers. **C**
  - Edge case: a legacy save with no `settlement.config` falls back to the store's form config. That config can carry `_seatLawVersion: 2` only if a lit world's `_config` was Library-loaded first. **P**
  - **Library "Apply Saved Configuration & Regenerate" (`SettlementsPanel.jsx :: onLoad` → Generate): yes, by design.** It is a birth. `birthConfig` clamps the incoming marker and the lit mint writes 2, so the regenerated same-seed world is born under the seat law (`densityLaw.js`'s header rule). **C**
  - **Import:** the gallery scrub (`importScrub.js :: scrubGalleryImportLivingContent`, `importReconciliationAdmission.js`) drops only `_livingContentLawVersion`. A gallery file carrying `_seatLawVersion: 2` keeps it. That is the honest outcome for a world born lit. A hand-edited file could also light an old world, but only in the importer's own estate. **C** (read)

## 4. PUBLIC OR SHARED SURFACES THE LIT LAW ADDS (for the security reader; nothing edited)

a. **`_seatLawVersion` rides into the public `config`.** `display/publicSafe.js :: toPublicSafe`: `config` is allowlisted, and `PRIVATE_KEY_RE` does not match the key. My client probe served it. This is harmless, and it is what lets the shared page recompute the contest under the law. **C** (client); server twin **P**.

b. **The contest on the shared Power tab.** `PowerTab.jsx` → `PowerStrata` → `powerStrata.js :: derivePowerStrata` → `coupContenders` runs on the served document; there is no `publicDossier` gate on the strata.
- Under the law, the holder (`holderOf`, audience `'owner'`, on the served document) leaves the field, and L1 reads veiled or criminal rows as criminal.
- Every input is the served document, where hidden rows are already dropped and masked. **No leak.** **C** (read)

c. **The `power:desk` public prose** (`publicProseCompose.js` → `powerDeskRead.js :: powerDeskReadings(s)`). This one is computed at save time on the **owner's full record, not the veiled one**. It ships DS-POW-4's top-challenger name and the risk label.
- **Under D:** a hidden non-criminal power stays in the field (seatContest pins "a hidden power still contends"). Its name is masked as "an unseen interest" by the projection, which is today's exposure. But the law's holder exit is computed from hidden facts: a hidden holder (by R1 or R2) leaving the field shifts the public risk label. That is a weak inference channel. **P**
- **Under L1:** `contestKindOf` takes every hidden or criminal row out of the field first, so a hidden holder's exit changes nothing. The circumstance reads skip veiled rows (`openPowersOf`). **C** (read)
- **This is a reason to ship L1, not D.**

d. **Faction `desc` "contestedBy"** (`factionStanding.js`, written at birth and served under `factions[]`). Under the law a different challenger can be named. Hidden names are masked; a hidden row's own desc is dropped. **C** (read)

e. **`recentConflict` kept-form wordings** (`holderOfSeat.js :: TRANSFER_WORDINGS` rows 4 and 5, written by `rulingPower.js :: transferRulingPower`). Rendered verbatim on the shared Summary (`SummaryTab.jsx:256`) and in the PDF view model.
- A hidden taker is masked: the probe served "Power passed to an unseen interest…". **C**
- A kept civic face never goes to a criminal or hidden winner: `keepsForm` → `pairLicense(contestKindOf(winner))` → `'none'`. So the "criminal behind a civic face" case cannot arise from a transfer. **C** (read)

f. **The retired-edge narrative** ("{from} held the {form} until {taker} took it.") in the served `factionRelationships[]`.
- Hidden names are masked in both slots. **C** (client probe)
- The retirement spreads the row (`...next`), so `captureState` survives and capture rows stay dropped. **C**
- One hole I could not reach: the retirement re-types the edge to `competitive`. A "power behind" edge typed `corrupted` without `captureState` would become served. I found no writer that produces one (only `transferRulingPower` writes that sentence, and it types it `symbiotic`). **P**

g. **`holderOf(…, {audience:'reader'})`:** no caller in `src`, so no surface yet. Its only caller is `rulingPowerCoup.js:101`, with audience `'owner'`. **C** (grep)

h. **The campaign PDF** (`printProse.js :: buildPrintProse`, audience `'dm'`) shows the contest under the law. It is the owner's document; sharing it is the owner's act. **C**

i. **World book, realm snapshot, Foundry:** `worldSnapshotPublic.js` allowlists realm aggregates only. Pulse headlines are not law wordings. **No new surface.** **P**

**The count: 8 surfaces add or change (a–f, h, plus g latent).** Each is held by the name mask and the hidden-row drop. One residual risk: c under D (P). I judge nothing a criminal or hidden power's name can leak through.

The server twin (`_gallery_sanitize_public_json`, migrations 206/207/210) is held equal by `tests/security/gallerySanitizer.pglite.test.js`. It has no arm for the new wordings. Recommended before the flip: a pglite arm with a hidden taker and a hidden retired holder.

## 5. FAIL-CLOSED PATHS AND LIVE PLAY

"Falls closed" means `keepsForm` gets no circumstances, so a `licensed` pair is not kept. The seat is then renamed to the winner's own form, which is today's behaviour. `own` and `civic` pairs are still kept. **C** (read; `seatTransfer` (11) green)

- **`eventChange`** (`mutateWorld.js :: changeRulingPower`). **Reachable:** by the owner/DM, through the settlement's Event Composer "change ruling power" (`EventComposer.jsx`). The targets are `affordanceManifest.js :: rulingPowerTargets`, meaning any non-governing faction, hidden ones included.
  - On a licensed pair (merchants into Royal Authority under trade wealth), the DM sees "Grand Merchant Senate": today's rename.
  - New under the law: a civic or own pair keeps the form ("…seized the Town Council and left the government as it stood."), and old holders' edges retire. Ruled a named survivor (item 65). **C**
- **`pulseTransfer`** (`applyWorldPulse.js:182`, the `power_transfer` outcome from `worldPulse/coup.js`, `applyMode 'auto'`). **Reachable:** in any campaign whose advance resolves a coup (`campaignAdvanceSession.js` / `campaignWorldPulseSlice.js`). Until U5-CURE2 lands (item 68, no move), licensed pairs rename, as above. **C**
- **`unattributedTransferOn`** ("nobody"). **Reachable** when the DM renames the seat after a transfer (`factionRename.js :: applyFactionRenameToSettlement`, from the Settlements panel or store rename): the pair is rewritten, the sentence is not.
  - Its only consumer is `coupContenders` (audience `'owner'`). The holder comes back null, so no power leaves the field, and the true holder may appear among its own seat's challengers. The player sees a contender list like today's.
  - No holder line is shown anywhere: there is no reader caller. **C** (read)
- **A licensed pair with no circumstances handed in.** That is exactly the two paths above. `applyWorldPulseFactionRoster.js:122` (`government_change`) hands in the thunk and is wired. **C**
