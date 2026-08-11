# `ESPIONAGE / ES-6` — compilation verdict and the ES-6a contract (DRAFT, rev 1)

- **Status:** READY
- **Status note:** promoted by the chair 2026-08-11; §13's ten open items are CLOSED below, INCLUDING O4's hard blocker. ES-6 as chartered was REFUSED as three packets; this is the first.
- **Verdict on ES-6 as chartered:** ⛔ **REFUSE FORWARD.** ES-6 as written at
  `docs/DESIGN_FP_ARCH_ES.md:1633-1646` is **four behavior families against a cap of one**, and
  **three of its six named mechanisms have no substrate in `src/` at all.** The measurement is
  §0; the smallest split is §0.5. **ES-6a — THE LEAK — IS COMPILABLE TODAY** and is the packet
  contracted from §1 onward.
- **Compiled:** 2026-08-11 by the ES-6 author/recon lane.
- **Verified base:** `claude/composite-r4` at `58436804982b41944478db6c728e579ac9853122`
- **Base note:** `git status --porcelain` was **EMPTY at compile start** and **NOT EMPTY at
  compile end** (both EXECUTED, exit 0). The whole ES-5 family is landed: ES-5b `6c0238ad`,
  ES-5c `c0447b8f`, ES-5d `954592c0`. Every sibling packet's "excluded: ES-6/7" fence has
  cleared.
- ⚠⚠ **HEAD MOVED MID-COMPILE, AND THE MOVE IS HARMLESS — MEASURED, NOT ASSUMED.** The
  concurrent **TC-5 author lane** landed `8738f5ea` ("TC-5 refused as four packets; TC-5a
  promoted…") while this draft was being written. EXECUTED:
  `git merge-base --is-ancestor 58436804 HEAD` → **exit 0**, and
  `git diff --stat 58436804..HEAD` → **three files, all documentation**
  (`docs/implementation/INDEX.md` +1, `docs/implementation/PACKET_MANIFEST.json` +36,
  `docs/implementation/packets/town-cartography/TC-5A.md` +735). **ZERO source files changed**,
  so every measurement in this draft stands and `8738f5ea` is an admissible verified-base
  descendant (`PACKET_STANDARD.md:35`). ⛔ **This lane wrote nothing into the repo** — its only
  output is this scratchpad file. ⚠ **Manifest item 7 touches `docs/implementation/INDEX.md`,
  which TC-5 has just written**: re-read it at dispatch and append; never overwrite.
  ⚠ Re-run the ancestry check at dispatch — a later HEAD move that touches `src/` is STOP 3.
- **Depends on:** `954592c0` (ES-5d, LANDED) — ES-6a reuses ES-5d's `operatives` Map verbatim.
- **Collision group:** the espionage module set (`src/domain/worldPulse/espionage/**`) — most
  recently written by ES-5d at `954592c0`. **A concurrent TC-5 author lane is live in this
  tree (scratchpad only); every path it touches is RESERVED.**
- **Commit authority:** none granted by this draft.
- **Packet law:** [`PACKET_STANDARD.md`](../PACKET_STANDARD.md)

---

## 0. THE DESIGN AUDIT — every ES-6 claim measured, four REFUTED

⚠⚠ This volume's prose has been wrong at four consecutive waves, each time differently. Every
claim below was re-measured against live code at `58436804`. **Four are refuted, two are
partial, and the refutations are what force the split.**

| # | Design claim (§3.13 :1194-1226 / §4 :1633-1646) | Verdict | Evidence, EXECUTED at `58436804` |
|---:|---|---|---|
| **C1** | "the leash read **at dispatch** (deterministic, keyed on the minted errand id)" | ⛔ **REFUTED — THERE IS NO DISPATCH SITE** | `espionageMissions.js:14-20` states it of itself: *"NOTHING UNDER src/ CALLS THIS FILE… the DISPATCHER — the per-tick stage that decides a court wants a confirmation and sends somebody — is a later wave's."* `espionageDoctrineStage.js:29-40` states the same of the cadence: *"the absence of a production caller is DECLARED here rather than discovered."* EXECUTED: `grep -rn "castCovertOperative\|mintCovertMission" src` returns the definitions plus one registry string and **zero call sites**. R-ES1-1 explains why (`mintEnvoyErrand` still demands the six war flags + a normalized peace offer), and it is unchanged at this build. ⭐ **The live seam where the operative, the errand and the errand id are ALL in hand is `advanceEspionageProducts`'s walk loop, `espionageProductStage.js:708-741`** — `walk.errandId` at `:721`, `walk.npc` at `:726`, ES-5d's `operatives` Map at `:706-707`/`:728`. The leash read is buildable; **"at dispatch" is not.** |
| **C2** | "the leak delivery (**magic two-address sends**…)" | ⛔ **REFUTED — the send is strictly single-address, and the writer refuses a second observer generically** | `landEspionageProduct` takes ONE `observerId` (`espionageProducts.js:437-439`) and both live call sites pass `homeId: walk.homeId` (`espionageProductStage.js:502-518` magic arm, `:621-635` home-mouth arm). The writer's own first guard is `if (!observer \|\| !subject \|\| observer === subject) return inert('invalid_pair')` (`espionageProducts.js:446`). ⇒ a second address is **new code at a second call site**, never a parameter widening. |
| **C3** | "mundane leaks travel by **enemy reach** (the leak lands when the agent next touches a node in the enemy's rumor range, hop-priced by the existing distance machinery)" | ⛔ **REFUTED on the reach half; PARTIAL on the pricing half** | **No symbol anywhere in `src/` answers "is settlement X inside settlement Y's rumor range."** `rumorNetwork.js:546` `advanceRumorLedgers` is an event-driven relay simulator with a hop BUDGET (`maxHopsFor`, `:133-136`), not a membership predicate. What exists is continuous PRICING: `hopWeeks` (`src/domain/spatial/distanceRead.js:639`), `hopDelayTicks` (`distancePricedNews.js:30`), `routeAwareHopDelayTicks` (`:65`) — all pure, all callable from an espionage leaf, none a boundary test. ⇒ **the mundane arm as specified cannot be built; it must be re-sited (O3).** |
| **C4** | "meta-intelligence … modeled as a confidence bump on the enemy's belief about the HOME court's **posture toward the subject** … **landing on the existing `allianceLabel`/`readiness` slots — zero new surfaces**" | ⛔ **REFUTED AS SPECIFIED — `BeliefRecord` is strictly TWO-PARTY** | The record (`beliefMap.js:335-343`) documents `allianceLabel` as *"believed relationship label (observer↔subject)"* (`:338`), and `groundTruthBelief` reads its truth from `neighbours.get(observerId)?.get(subjectId)` — the direct edge between exactly those two ids (`beliefMap.js:1181`, `:707-731`). `readiness` is the **subject's own** mobilization, `groundTruthReadiness(worldState, subjectId)` (`beliefMap.js:487`). Keying is exactly `beliefMaps[observerId][GOVERNING_SEAT_KEY][subjectId]` (`beliefMap.js:73`). **No field, no third id, no nesting can carry "subject S's stance toward third party X."** ⚠ The claim is *rescuable by narrowing* — see **O2**: a TWO-party version (observer = patron, subject = HOME) IS expressible with zero new surfaces and is what this packet proposes. The three-party version is a new key, which §1's zero-new-keys law and the owner gate both forbid a lane to take. |
| **C5** | "the Herald speaks RETROACTIVELY on exposure (**`espionage_exposed`** carries the double-agent clause when the web exposure names the leash)" | ⛔ **REFUTED TWICE OVER** | (a) `grep -rn "espionage_exposed" src tests scripts` → **exit 1, zero matches**; all six ES Herald kinds are unbuilt, and no ES receipt-pool annex exists under `docs/content/`. The design's own §4 assigns the six kinds **to ES-7** (`:1648-1655`). (b) **The exposure event ES-6 would attach to emits no news at all**: `applyForeignExposureBlowback` (`corruptionWeb.js:888-970`) returns `newsEntries: []` on **every** path (`:890`, `:894`, `:969`) — the typedef promises an array and nothing ever pushes into it. (c) The leash does **not** survive the tick in the persisted log: `pulseKernel.js:1773-1776` projects `corruptionEvents` down to five fields and drops `patronId`/`patronKind`/`npcId`. ⇒ a retroactive clause would have to **build the news producer in another volume's file** before it could speak. |
| **C6** | "vetting quality from home security × own-web health — `climate.security` band × (1 − own compromised-institution **share** via `compromisedSecurityInstitutions`)" | ⚠ **PARTIAL — every part exists, the SHAPE does not** | `vetVolunteerEnvoy` CONFIRMED at `sendTwoDivergence.js:173`, both arms real and **already pinned** (`tests/domain/sendTwoDivergenceWr7d.test.js:141-173`). `compromisedSecurityInstitutions` CONFIRMED at `corruption.js:602` — but it returns `{covert: string[], revealed: string[]}`, **names, not a share**; the denominator exists only by re-applying `SECURITY_INSTITUTION_RE` (`corruption.js:569`, exported). ⛔ **The decisive shape problem: `VETTING_QUALITIES` is a TWO-member closed set `['hurried','careful']` (`sendTwoDivergence.js:39`)** — so a continuous `security × webHealth` product must be THRESHOLDED to one of two words, which is a tuning decision no code answers. And the only consumer of `quality`, `castCovertOperative`, **has no production caller (C1)**, so the derived quality would feed a dark head. ⭐ Note `patronageSecurityDrag` (`corruption.js:641-649`) already composes the same count into a bounded scalar — better parity than inventing a share. |
| **C7** | "Dormancy: **web dark ⇒ no leash resolution** ⇒ leaf no-ops" | ⚠ **PARTIAL — true only if the LEAF gates it, and there is a house idiom to copy** | `resolveLeash` (`corruptionLeash.js:69`) is **not** web-gated: it normalizes `npc.corruptTies` unconditionally and a betrayal-seeded `foreignPatron` can exist in a world that never lit the web (`causeLifecycle.js:369`, in as many words). The estate's idiom is to gate the CALL: `const webLit = corruptionWebActive(worldState); const foreignLeash = webLit ? resolveLeash(npc, settlement) : null;` (`causeLifecycle.js:374-375`). ⇒ **copy that line, do not assume the resolver refuses.** `corruptionWebActive` (`corruptionWeb.js:225-230`) requires `beliefsActive` AND the virtual `corruptionWebEnabled === true`. |
| **C8** | "keyed on the minted errand id (deterministic)" | ✅ **CONFIRMED available** | `walk.errandId = text(errand.id)` (`espionageProductStage.js:721`); the estate's keyed-hash idiom is `hash01(key)` (`espionageDoctrineStage.js:304-305`). No PRNG needed and none permitted (L1). |
| **C9** | "`corruptionProfile.corrupted` leash resolves to an ENEMY court" | ✅ **CONFIRMED, with one narrowing** | `corruptionProfile: {corrupted, vector}` is written at six live sites (`npcAgency.js:465,551,777,829`, `corruptionWeb.js:730`, `applyWorldPulseBetrayal.js:64`). `resolveLeash` returns `{kind, settlementId, factionName, foreign, …}` and `isForeignLeashKind` covers three kinds — **but only `foreign_settlement` is ever WRITTEN**: `grep -rn "kind: 'foreign_faction'\|kind: 'foreign_org'" src` → **zero hits, including tests**; the three production writers of a foreign leash (`applyWorldPulseBetrayal.js:45`, `corruptionWeb.js:717`, `buildEvent.js:112`) all mint `foreign_settlement`. `foreign_faction` carries `settlementId: null` by the resolver's own contract (`corruptionLeash.js:50-52`) and no faction-name→settlement bridge exists. ⇒ **ES-6a handles `foreign_settlement` and declares the other two absent by measurement, not by omission.** |
| **C10** | (the identity worry this family has been bitten by) leash `settlementId` vs `beliefMaps` observer id | ✅ **CONFIRMED SAME ID SPACE — no bridge needed** | Both trace to `snapshot.settlements` / the same `regionalGraph.edges \|\| relationships` list: the leash endpoint via `hostileNeighborsOf` (`stressorDynamics.js:606-613`) and `mintLeashOnto`'s `patronIds` (`corruptionWeb.js:597-598`, which says *"the same id space"* inline); the belief observers via `relationshipNeighbourhood` (`beliefMap.js:707-731`, `:1247-1249`). ⚠ **Identity is not membership** — `beliefMaps` entries materialize only on arrival (`beliefMap.js:32-35`), so a leak may create a FIRST-EVER `(patron, home)` entry. That is **O10**. |

### 0.1 ⭐ THE ONE THING THE DESIGN DID NOT SAY, AND IT DECIDES THE SHAPE

**Espionage reads the corruption web SAME-TICK. There is no lag on this pair.** EXECUTED trace,
one thread of `worldState` inside one call of `simulateCampaignWorldPulse` (`pulseKernel.js:224`):

| Order | Stage | Site |
|---:|---|---|
| 1 | `advanceCorruptionWeb` | `pulseKernel.js:363-364` |
| 2 | `applyWorldPulseOutcomes` | `pulseKernel.js:1429-1440` |
| 3 | `advanceBeliefMaps` | `pulseKernel.js:1980-2023` |
| 4 | `advanceEnvoyDiplomacyPulse` → `advanceEspionageProducts` | `pulseKernel.js:2031` → `envoyPulse.js:415-441` |

⛔ **ES-6a MUST NOT SPECIFY A `tick - 1` WINDOW.** ES-5d shipped a `tick-1` handoff that was
**provably dead** for exactly this reason, and the recorded lesson is that *a lag is a property
of a WRITER/READER PAIR, never of a file or a volume — re-derive it per pair.* This lane
re-derived it: **corruption web → espionage products is same-tick, in that order, always.**
Case **A5** pins the pulse call ORDER at source so a future reorder REDS.

### 0.2 THE BUDGET ARITHMETIC THAT FORCES THE SPLIT

ES-6 as chartered carries **six mechanisms across four behavior families** against a cap of one
(`PACKET_STANDARD.md:118-120`, `:109-116`):

| Family | Mechanisms | State it touches | Verdict |
|---|---|---|---|
| **A — the leak** | leash read · leak delivery · silent success | `beliefMaps` (existing key) | **COMPILABLE** |
| **B — the intentions surface** | meta-intelligence as a three-party fact | a NEW belief field | ⛔ **needs a new key** — forbidden by §1's zero-new-keys law, and persistence shape is owner-gated (judgment-ledger §3) |
| **C — vetting quality** | quality from security × web health | none (a pure derivation feeding `castCovertOperative`) | separate family, separate file, **dead-headed** until a dispatcher exists |
| **D — the Herald clause** | `espionage_exposed` retroactive | news | ⛔ **ES-7 owns the six kinds by the design's own §4**, and the exposure producer emits no news at all |

Production files ES-6-as-chartered would modify: `espionageProductStage.js` (A) +
`espionageMissions.js` (C) + `corruptionWeb.js` (D's news producer, 453 eff, another volume's
surface) + `envoyErrandVocabulary.js`/`envoyErrandRecords.js` (any per-row leak marker — the
`COVERT_GATHERED_KEYS` exact-key envelope, `envoyErrandVocabulary.js:260-263`, refuses an
unknown key at `envoyErrandRecords.js:508-537`) ⇒ **5 of a cap of 3**, plus a new belief key,
plus a new content annex. **ES-6 as chartered is not compilable and no wording fixes it.**

### 0.5 ⭐ THE SMALLEST SPLIT — three slices, one of them shippable now

- **ES-6a — THE LEAK (this packet).** The leash read at the product stage, the leak's delivery
  through the existing `landEspionageProduct` road with `observerId` = the patron court, both
  world arms, and the silent-success negative. **One behavior family, zero new persisted
  families, zero new keys, one modified production file.**
- **ES-6b — THE VETTING QUALITY.** A pure `vettingQualityFor` leaf plus its one consumer. It is
  a second family and it is **dead-headed by C1** — recommend it ride the wave that builds the
  DISPATCHER, so the derivation lands with something that consumes it. **BLOCKED on the
  dispatcher, not on this lane.**
- **ES-6c — THE RETROACTIVE CLAUSE.** ⛔ **FOLD INTO ES-7.** It needs a Herald kind ES-7 owns,
  a content annex nobody has created, and a news producer built inside `corruptionWeb.js` where
  `newsEntries` is returned empty on every path. Nothing about it is ES-6-shaped.

⇒ **Everything from §1 down contracts ES-6a only.**

---

## 1. Reconciled authority

1. **Live git at `58436804`** — existence authority; it outranks every table in §0.
2. **`DESIGN_FP_ARCH_ES.md` §3.13 (:1194-1226)** and the ES-6 charter (:1633-1646), **as
   narrowed by §0's four refutations**, which the promotion commit records amended-in-place.
3. **The owner directive addition F** (`memory/espionage-confirmers-directive.md`) — LEAK-ONLY
   is owner law: *"false reporting home is deliberately excluded… the confirmation product
   stays honest."* J-ES-11 restates it at `:1223-1226`.
4. **J-ES-5 (the writer boundary, :695-707)** — products ride `reconcileBelief`, **never**
   `applyBeliefOverrides`. Pinned live: `tests/domain/espionageProducts.test.js:242-262`.
5. **CR-ES5B-6 / CR-ES5C-O4 / ES-5d O2** — an implementer may never author dark tuning; the
   chair does.
6. **PACKET_STANDARD.md :118-159** — budget, the eight-case cap, STOP law; **:125 reads
   PER-STATE**, sharpened by ES-5d's chair ruling O7.
7. **ES-5d (`ES-5D.md`, LANDED `954592c0`)** — the precedents this packet copies verbatim: the
   post-loop single call site, the `operatives` Map, the dependency-inverted leaf, the §9b
   declared-shift obligation, the standing landing discipline.

**Unreconciled and therefore excluded:** the three-party meta-intelligence surface (C4), the
mundane reach predicate (C3), the Herald clause (C5), the vetting quality (C6). Each is
recorded above with its measurement; **none is implicitly deferred.**

---

## 2. Outcome

Under `espionageEnabled` **and** `corruptionWebEnabled` (and the belief layer, which the web
gate already requires), **an operative whose corruption leash points at a foreign court delivers
that court a copy of what he learned** — written into the patron's own belief map through the
same `landEspionageProduct` road the home product uses, with the agent as `sourceId` and a
chair-authored fidelity discount. The mission still completes; **the home court's state is
byte-identical to a clean mission's, and no news is written.**

Two writes, both strictly two-party, both through the existing `beliefMaps` key:

1. **THE INTEL LEAK** — `(observer = patron, subject = the mission's subject)`. This is the
   design's "gathered intel" clause, verbatim, in the shape the record can hold.
2. **THE EXISTENCE LEAK** — `(observer = patron, subject = the HOME court)`, a CONFIRM-shaped
   confidence bump. ⭐ **This arm is NOT decoration and it is not optional.** When the patron
   **is** the mission's subject — the case §3.13 calls out by name (*"whether or not it is the
   target"*) — write (1) is refused generically by `landEspionageProduct`'s
   `observer === subject` guard (`espionageProducts.js:446`), so **without arm (2) the most
   dramatic case in the design writes nothing at all.** Arm (2) needs no new arithmetic: a
   CONFIRM's ground truth is the observer's own prior (`productGroundTruth`,
   `espionageProducts.js:259`), and a patron who has never heard of home gets the built-in
   honesty refusal rather than a manufactured belief. See **O2**.

Dark worlds — espionage-dark, web-dark, belief-dark, errand-spine-dark, or simply
leash-free — are **byte-identical**. The lit shift is disclosed in §9b.

**Explicit non-goals:**
- **Any false report home.** LEAK-ONLY is owner law (§1 authority 3). The scan in §8 item 6
  is the guard, and it is this packet's one prevention guard.
- **Any three-party belief surface, any new belief field, any new `spatialLedgers` key.** C4.
- **The mundane reach predicate.** C3 — the timing is re-sited by O3, not built.
- **Any Herald kind, any news entry, any receipt pool, any content annex.** C5; ES-7's.
- **Any vetting-quality derivation**, and **zero edits to `espionageMissions.js`**. C6.
- **Any edit to `corruptionWeb.js`, `corruptionLeash.js`, `npcAgency.js`
  (833/833 EXACT, zero headroom), `pulseKernel.js`, `applyWorldPulse.js`,
  `envoyErrandVocabulary.js`, `envoyErrandRecords.js`, `beliefMap.js`, `envoyPulse.js`.**
- **Any change to `landEspionageProduct`, `productGroundTruth`, `buildProductReport`,
  `landOne`, `gatherArm`, `homeMouthArm`, or `amendCovert`.** All are READ, none edited.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

---

## 3. Hard scope budget

### 3.1 This packet against the standard's caps

| Limit | Cap | This packet | Head-room |
|---|---:|---:|---|
| Behavior families | 1 | **1** — "a leashed operative's take reaches his patron" | at cap |
| New persisted record families | 1 | **0** — writes into the existing `beliefMaps` key through its existing writer | 1 |
| Named writers per changed state | 1 each | **1** — `landEspionageProduct` is and remains the espionage set's one belief writer (`ledgerOwnershipManifest.js:85`) | at cap |
| Feature flags | 1 | **0 new** (rides `espionageEnabled` × `corruptionWebEnabled`) | — |
| User-facing surfaces | 1 | **0** | — |
| Direct production consumers | 2 | **1** — `advanceEspionageProducts` | 1 |
| New logic-bearing leaves | 2 | **1** — `espionageLeak.js` | 1 |
| Existing logic-bearing files modified | 3 | **1** — `espionageProductStage.js` | 2 |
| Registration-only files touched | 3 | **1** — `couplingRegistryEspionage.js` | 2 |
| Handwritten files | 12 | **6** (leaf + 1 modified + 1 registration + 2 new tests + 1 verified-not-edited test) | 6 |
| New/changed effective production lines | 400 | **≈ 225** (leaf ≤ 190 · stage ≤ 15 · registry ≈ 20) | ~175 |
| New leaf effective lines | 250 | **≤ 190** — ⚠ **the CHARTER's budget is `espionageLeak.js` ≤ 200 and it BINDS below the standard's 250** | 60 |
| Shared/hot-file delta | 15 each | **≤ 15** `espionageProductStage.js` | at cap |
| Acceptance cases | 8 | **8** | **at cap** |

⇒ **NO FURTHER SPLIT IS REQUIRED FOR ES-6a.** ⚠ The packet sits at the acceptance cap and at
the one hot-file delta. A second modified production file, a new ledger key, or a second
consumer is a **re-slice, never a renegotiated cap** (STOP 8).

⭐ **The single biggest difference from ES-5d: ES-6a mints NO new persisted record family.**
The leak rides `beliefMaps`, whose key is already classified (`spatialUsage.js:235`) and whose
writer is already in the ownership manifest. `tests/lib/spatialLedgerCoverage.walker.test.js`
sees no new key and `src/lib/spatialUsage.js` is **not** in the manifest.

### 3.2 Measured effective line counts (EXECUTED at `58436804`)

```sh
npx eslint <files> --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' --format json
```
⚠ Read the COUNT in the message text, never the exit status: eslint's exit under this rule is
**1** by construction. This lane captured `TRUE_ESLINT_EXIT:1` directly, unpiped.

| File | Effective | Ceiling | Headroom | Δ this packet | After |
|---|---:|---:|---:|---:|---:|
| `espionage/espionageProductStage.js` | **546** | 800 | **254** | ≤ 15 | ≤ 561 |
| `espionage/espionageLeak.js` (NEW) | 0 | 800 / **charter 200** | — | ≤ 190 | ≤ 190 |
| `certification/couplingRegistryEspionage.js` | **182** | 800 | 618 | ≤ 20 | ≤ 202 |
| `espionage/espionageProducts.js` | **266** | 800 | 534 | **0** | 266 |
| `espionage/espionageGauntlet.js` | **298** | 800 | 502 | **0** | 298 |
| `espionage/espionageMath.js` | **163** | 800 | 637 | **0** | 163 |
| `espionage/espionageMissions.js` | **105** | 800 | 695 | **0** (ES-6b's) | 105 |
| `espionage/espionageCareerCredit.js` | **75** | 800 | 725 | **0** | 75 |
| `espionage/espionageDoctrineStage.js` | **115** | 800 | 685 | **0** | 115 |
| `espionage/espionageTap.js` | **95** | 800 | 705 | **0** | 95 |
| `espionage/espionageWariness.js` | **101** | 800 | 699 | **0** | 101 |
| `espionage/espionagePresence.js` | **46** | 800 | 754 | **0** | 46 |
| `espionage/espionageGate.js` | **8** | 800 | 792 | **0** | 8 |
| `envoyPulse.js` | **305** | 800 | 495 | **0** (O6) | 305 |
| `corruptionWeb.js` | **453** | 800 | 347 | **0** (ES-6c's) | 453 |
| `src/domain/corruptionLeash.js` | **47** | 800 | 753 | **0** | 47 |
| `src/domain/corruption.js` | **277** | 800 | 523 | **0** (ES-6b's) | 277 |
| `sendTwoDivergence.js` | **103** | 800 | 697 | **0** (ES-6b's) | 103 |
| `src/lib/spatialUsage.js` | **179** | src/lib default | ample | **0** | 179 |
| `npcAgency.js` | — | **833 EXACT** (`scripts/.size-baseline.json`) | **0** ⛔ | **0** | — |

**`scripts/.size-baseline.json` carries NO entry for any espionage, envoy, corruption or
certification file** (EXECUTED — the full key set is `App.jsx`, `explanation.js`,
`applyWorldPulse.js`, `npcAgency.js`, `pulseKernel.js`, `roadsKernel.js`,
`settlementStrategy.js`, `warTermination.js`, `npcGenerator.js`, `settlementSlice.js`).
Every file above rides the 800-line domain default.
⛔ `npcAgency.js` sits at an **EXACT** 833 with **zero** headroom; this packet does not touch
it and any edit there is STOP 6.

---

## 4. Sealed dispatch and preflight

```sh
cd /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold
git rev-parse --abbrev-ref HEAD                 # expect claude/composite-r4
git rev-parse HEAD                              # expect 58436804… or a pinned descendant
git merge-base --is-ancestor 58436804982b41944478db6c728e579ac9853122 HEAD; echo $?   # expect 0
git status --porcelain                          # every target file MUST be clean
git log --oneline -3 -- src/domain/worldPulse/espionage/ \
  src/domain/worldPulse/envoyPulse.js src/domain/corruptionLeash.js \
  src/domain/worldPulse/corruptionWeb.js       # CHECK-GIT-FIRST, per the ES-5 charter
```

**CHECK-GIT-FIRST result at compile time (EXECUTED, `58436804`):** the espionage family's newest
commit is `954592c0` (ES-5d); `58436804` touches only two UI/townmap test files and one line of
the lighting census walker. **No collision.** Re-run at dispatch; any espionage-family commit
newer than `954592c0` is STOP 3.

**⚠⚠ FOREIGN WORK RESERVED — do not touch, stage, restore, or attribute.** `git status
--porcelain` was empty at compile START, DIRTY mid-compile, and empty again at compile END
(all EXECUTED, exit 0) — the concurrent **TC-5 author lane** wrote and then COMMITTED
`8738f5ea` underneath this lane. The tree is clean at `8738f5ea` and the delta from the
verified base is **documentation only** (see the base note). ⚠ **Re-run the ancestry check and
`git status` at dispatch**: a HEAD move that touches `src/` is STOP 3, and any dirty or
untracked path not in §8's manifest is foreign. The OSR lane's paths
(`scripts/check-observed-shape-readers.mjs`, `scripts/lib/*`,
`scripts/.observed-shape-readers-baseline.json`, `tests/lint/observedShape*`) remain RESERVED,
as does everything under `docs/implementation/packets/town-cartography/`.

**Required live symbols** — verify each before editing; ⛔ **navigate by symbol, never by the
line numbers quoted here** (this volume has had two address rots):

| Symbol | Home |
|---|---|
| `advanceEspionageProducts` (the one hook site) | `espionage/espionageProductStage.js:661` |
| the `operatives` Map (ES-5d's, reused verbatim) | `espionage/espionageProductStage.js:706-707`, `:728` |
| `MissionWalk` fields `errandId`/`homeId`/`subjectId`/`sourceId` | `espionage/espionageProductStage.js:716-727` |
| `depositMissionCredits` (the post-loop precedent) | `espionage/espionageProductStage.js:747` |
| `landEspionageProduct` (the ONE belief writer) | `espionage/espionageProducts.js:437` |
| its `observer === subject` refusal | `espionage/espionageProducts.js:446` |
| `productGroundTruth` (CONFIRM = assert the prior) | `espionage/espionageProducts.js:259` |
| `buildProductReport` | `espionage/espionageProducts.js:346` |
| `beliefRecord` | `worldPulse/beliefMap.js:224` (already imported by `espionageProducts.js:70-76`) |
| `espionageActive` | `espionage/espionageGate.js:75` |
| `resolveLeash` / `isForeignLeashKind` | `src/domain/corruptionLeash.js:69` / `:44` |
| the web-gated resolve IDIOM to copy | `worldPulse/causeLifecycle.js:374-375` |
| `corruptionWebActive` | `worldPulse/corruptionWeb.js:225` |
| `hash01` (the keyed-hash idiom, if a roll is used) | `src/domain/region/contestMath.js` |
| `round4` / `clamp01` | `espionage/espionageMath.js:88` / `src/kernel/math.js` |
| the three ES-family scan pins that bind this leaf | `tests/domain/espionageProducts.test.js:242-262` (`applyBeliefOverrides`), `:264-307` (`ladderWritersOf`), `:311-315` (`amendersOf`) |

---

## 5. Verified tree contract

- **State authority — ONE state changes, and its writer does not move.**
  `worldState.spatialLedgers.beliefMaps[observerId][GOVERNING_SEAT_KEY][subjectId]`.
  **Sole writer: `landEspionageProduct`** (`espionageProducts.js:437`), unchanged in ownership
  and unedited by this packet. The new leaf **calls** it; it does not replace, wrap, or fork it.
  `ledgerOwnershipManifest.js:85` already records that ownership and needs no new row.
- ⚠⚠ **THREE LIVE SCANS OVER THE WHOLE ESPIONAGE DIRECTORY BIND THE NEW LEAF FROM THE MOMENT
  IT LANDS**, because each reads `readdirSync(ESPIONAGE_DIR)`:
  1. `overrideImporters(sources) === []` — **no espionage module may name
     `applyBeliefOverrides`** (`tests/domain/espionageProducts.test.js:242-262`). J-ES-5.
  2. `ladderWritersOf(sources) === []` — no espionage module may write the ladder ledger
     (`:264-307`).
  3. `amendersOf(sources) === ['espionageProductStage.js']` — **exactly one** espionage module
     may route `writeErrands` (`:311-315`).
  ⛔ **If any of the three moves, that is STOP 5 — never a pin edit.** ⚠ All three
  `stripComments` first, so an honest header naming the forbidden symbol is safe **in these
  three**; other walkers in this estate do not all strip, and the comment-convicts-itself
  hazard has fired twice. If a scan reds on a comment, **reword the comment, never widen the
  scan.**
- **The lag: NONE. SAME TICK.** §0.1. ⛔ Do not write a `tick - 1` window. Restate the
  same-tick fact in the leaf's header and pin the pulse ORDER (case A5).
- **Direct readers this packet adds:** none. The leaf is called, never read.
- **Absence rule:** espionage dark · web dark · beliefs dark · no covert errands · no landings ·
  an operative with no `corruptTies` · a `local_org` or `cutout` leash · a `foreign_faction`/
  `foreign_org` leash (no settlement endpoint, C9) · a patron id naming no live settlement ·
  a patron id equal to the home id ⇒ **zero leaks, zero writes, `beliefMaps` byte-identical**.
  Never a throw, never a `NaN`, never a partially-written map.
- **Persistence / regen / undo / migrate — THE FULL TRACE.** §5b.
- **Receipts:** none persisted. The leaf returns a `leaks[]` array of receipts from
  `advanceEspionageProducts` (**O6**). ⛔ **No news, no wizard-news entry, no Herald kind, no
  home-visible field.** The voice is ES-7's; the retroactive clause is ES-6c's.
- **Test shapes to copy:** `tests/property/espionageCareerCreditDormancy.test.js` (ES-5d's
  four-fence dormancy idiom + the declared-shift golden pair);
  `tests/domain/espionageCareerCredit.test.js` (ES-5d's leaf pins);
  `tests/domain/espionageProducts.test.js:242-320` (the three scans — **copied in SHAPE for
  item 6's new leak-only scan, and VERIFIED unmoved for the existing three**).
- **Forbidden homes:** every file in §2's non-goals list, plus `pulseKernel.js`/
  `applyWorldPulse.js` (L1, banked), `settlementStrategy.js` (IN-4's no-EDIT law),
  `roadsKernel.js`, `roads/state.js`. ⛔ **RESERVED BY CONCURRENT LANES:** the OSR paths above
  and anything the TC-5 lane has open.

### 5b. THE STATE LIFECYCLE TRACE

**State — `spatialLedgers.beliefMaps`, one extra observer slice.**

| Path | What must happen | Measured basis |
|---|---|---|
| **create** | A leak write materializes `beliefMaps[patronId]['seat'][subjectId]` through `landEspionageProduct`. ⚠ **This may be the FIRST-EVER entry for that observer** — the ledger is arrival-gated and never pre-populates all pairs (`beliefMap.js:32-35`). That is the intended semantics (the leak IS the arrival, and ES-4 already established espionage as the source of legs about non-neighbours) but it is a visible population change and must be pinned (**O10**, case A7). | `beliefMap.js:32-35`, `espionageProducts.js:504-511` |
| **read** | Unchanged. Every existing consumer (`generosityKernel.believedNeedScale`, the sovereignty appraisal, `settlementBeliefs.js`) reads the patron's slice exactly as it reads any other. | `generosityKernel.js:1020`, `display/settlementBeliefs.js:149` |
| **persist** | Unchanged — `setSpatialLedger` into the existing key, already classified TRACKED (`spatialUsage.js:235`). **No new key, so `spatialLedgerCoverage.walker` and `spatialUsage.js` are untouched.** | EXECUTED read of `spatialUsage.js:235` |
| **prune** | **NOT APPLICABLE and that is the point** — a belief is durable by design, and the leak writes a belief, not a deposit. ⛔ Do **not** copy ES-5d's one-tick prune here; there is no ledger of this packet's own to prune. | — |
| **regenerate** | A world regen re-derives settlements; belief maps follow the existing regen path unchanged. ⚠ **AUTHOR-TIME-UNMEASURED:** confirm a regen does not resurrect or duplicate a leaked belief. |  |
| **undo** | Belief maps ride the existing undo/snapshot surface. ⚠ **AUTHOR-TIME-UNMEASURED:** confirm an undo across the leak tick removes the patron's slice cleanly. |  |
| **migrate** | A legacy save carries no patron slice ⇒ `asObject(undefined)` ⇒ `{}` ⇒ cold-start prior ⇒ the CONFIRM arm takes the built-in honesty refusal. Additive-optional by construction. | `espionageProducts.js:461-463`, `:259` |
| **classify** | **NOTHING TO CLASSIFY.** No new `setSpatialLedger` key is minted. | — |

---

## 6. Exact contracts

### 6.1 The leaf's surface

`src/domain/worldPulse/espionage/espionageLeak.js` exports exactly three symbols:

```
LEAK_TUNING                                                    (frozen; the fidelity discount — O4)
leakTargetFor({ worldState, npc }) → { leaks: boolean, patronId: string, kind: string, reason: string }
deliverMissionLeaks({ worldState, tick, landings, operatives, byId }) → { worldState, changed, leaks }
```

**`leakTargetFor`** — the pure leash read, and the ONLY place the web gate is spelled:
1. `if (corruptionWebActive(worldState) !== true) return { leaks:false, …, reason:'web_dark' };`
   ⛔ **Copy `causeLifecycle.js:374-375` exactly — do not assume `resolveLeash` refuses on a
   dark web; it does not (C7).**
2. `const leash = resolveLeash(npc);` — the extra args are optional and Phase A reads the NPC
   alone (`corruptionLeash.js:60-63`).
3. Leak iff `leash.foreign === true` **and** `leash.kind === 'foreign_settlement'` **and**
   `leash.settlementId` is a non-empty string. ⚠ `foreign_faction`/`foreign_org` return
   `reason:'no_settlement_endpoint'` — **declared absent by measurement (C9), never silently
   skipped**, so the day a writer for either kind appears the reason is already on the receipt.

**`deliverMissionLeaks`** — the delivery, dependency-inverted so the leaf never reaches into the
errand family, the roster, or the ladder:
1. `if (espionageActive(worldState) !== true) return { worldState, changed:false, leaks:[] };`
   — the byte-identical dark path, one flag read.
2. For each landing that **changed** a home belief: recover the operative from the
   caller-supplied `operatives` Map keyed by `landing.errandId` (**ES-5d's Map, reused
   verbatim — no new join, no new import**); call `leakTargetFor`; skip with a reason when it
   refuses.
3. **ARM 1 — the intel leak.** `observerId = patronId`, `subjectId = landing.subjectId`,
   `groundTruth =` the home's post-landing record `beliefRecord(worldState, landing.observerId,
   landing.subjectId)`, one report from `buildProductReport` with `accuracy01 =
   landing.accuracy01 × LEAK_TUNING.FIDELITY_W` and `completeness01 = landing.completeness01 ×
   LEAK_TUNING.FIDELITY_W`, `sourceId =` the agent's composite `settlement#npc`. ⚠ Skipped with
   `reason:'patron_is_subject'` when `patronId === landing.subjectId` — the writer refuses that
   pair generically (`espionageProducts.js:446`) and a silent inert return would look like a
   write.
4. **ARM 2 — the existence leak.** `observerId = patronId`, `subjectId = landing.observerId`
   (the HOME court), product `confirm`, ground truth = the patron's **own prior** via
   `productGroundTruth({ product:'confirm', prior: beliefRecord(worldState, patronId, homeId),
   … })`. A patron with no prior about home takes that function's **built-in honesty refusal**
   and nothing is written — the design's own idiom, no new arithmetic (**O2**).
5. Return `{ worldState, changed, leaks }` where `leaks[]` is one receipt per landing
   considered, carrying `errandId, patronId, patronKind, arms: ['intel'|'existence'…],
   accuracy01, changed, reason`. ⛔ **Nothing is written to the errand row, to news, or to any
   home-visible field.**

⛔ The leaf must **never** import `npcLadder*`, `envoyErrand*`, `corruptionWeb.js`'s writers
(only `corruptionWebActive`), `disinformationPlant.js`, or `applyBeliefOverrides`.
⛔ The leaf must **never** call `writeErrands` (§5, the `amendersOf` pin).

### 6.2 The `advanceEspionageProducts` composition — THE HOOK

⭐ Written against live code read at `58436804`.

```js
// (1) new import — INFO leaf, INFO importer: NO cross-layer pair (§7)
import { deliverMissionLeaks } from './espionageLeak.js';

// (2) inside advanceEspionageProducts, IMMEDIATELY AFTER the ES-5d deposit call (:747-749),
//     ONCE per pass, never inside the walk loop:
const leaked = deliverMissionLeaks({ worldState: state, tick: now, landings, operatives, byId: ctx.byId });
state = leaked.worldState;
changed = changed || leaked.changed;

// (3) widen the return by ONE field:
return { worldState: state, changed, gatherings, landings, skipped, leaks: leaked.leaks };
```

**≤ 15 effective added lines.** ⛔ `gatherArm`, `homeMouthArm`, `landOne` and `amendCovert` are
**NOT** edited.

⭐ **WHY THE HOOK IS POST-LOOP ON `landings`, AND WHY THAT BUYS BOTH WORLD ARMS FOR FREE — the
load-bearing judgment.** A landing already encodes the world rule: in a **magic** world a
product lands at the stop's confirmation tick (`gatherArm`, `espionageProductStage.js:502-518`,
`world:'magic'`); in a **mundane** world nothing lands until the home mouth (`homeMouthArm`,
`:621-635`). **So leaking on landings gives the magic arm per-stop streaming and the mundane arm
close-of-mission delivery, from ONE call site, with zero new timing code** — and the receipt's
own `world` field labels which arm fired, so the charter's "leak timing both world arms" pin is
a partition of a field that already exists. Recorded so the chair can veto in one clause
(**O5**).

⚠ **The gate is inside the leaf, and it is two flags read `=== true`, strictly**, so absent and
false are identical. `deliverMissionLeaks` reads `espionageActive`; `leakTargetFor` reads
`corruptionWebActive`. Neither flag is read anywhere else in this packet.

### 6.3 THE FIDELITY DISCOUNT — AUTHOR-TIME-UNSET

**Home: the new leaf's own frozen `LEAK_TUNING`**, on the ES-5d O2 precedent (the value is
meaningless outside the leaf, and the single-home law outranks slot economy).

**Value: AUTHOR-TIME-UNSET — this lane does not author it (O4).** The parity evidence measured
for the chair's use, all EXECUTED:

- The home copy takes `accuracy01 = best` (the clearest look the agent got,
  `espionageProductStage.js:819`) and `completeness01 = coverage01` (`:825`) — a magic send
  passes `coverage01: 1` (`:517`).
- `PRODUCT_TUNING` (`espionageProducts.js:85`) and `ESPIONAGE_TUNING` (`espionageMath.js:136`)
  are the family's two frozen grids; `reconcileBelief`'s own `CAT_ADOPT_ACCURACY` is `0.6`
  (`DESIGN_FP_ARCH_ES.md:747`, and it is the threshold above which a categorical label is
  ADOPTED rather than kept).
- ⚠ **`CAT_ADOPT_ACCURACY = 0.6` is the sharp edge**: a discount that pushes the leak's
  accuracy under it means a leaked report can never flip the patron's `allianceLabel`, only
  nudge its confidence. That is a **product decision**, not an arithmetic one.

⇒ **The lane's recommendation, with its argument, for the chair to author or reject:** ONE
multiplicative `FIDELITY_W` applied to both `accuracy01` and `completeness01`, set **below**
`CAT_ADOPT_ACCURACY / 1.0` for a typical first-hand read — a leak is smuggled, unverifiable and
told by a man serving two masters, so it should firm what the patron already suspects and only
rarely re-anchor a label. ⛔ **The implementer may not tune it, and this lane deliberately does
not name the number.**

### 6.4 Bounds, rounding, order

`clamp01` then `round4` on both derived report fields, matching the family's idiom
(`espionageMath.js:88`). Landings are iterated in the order `advanceEspionageProducts` produced
them, which is already deterministic (errand order from `envoyErrandsOf`, then gather-arm before
home-mouth-arm per errand). At most **two** writes per landing, in the fixed order intel→
existence, so the fold is order-stable. `leaks[]` preserves that order.

### 6.5 Flag and dormancy

Gated `espionageActive(worldState) === true` **and** `corruptionWebActive(worldState) === true`,
both BY NAME, both strict. **Quadruple dormancy, every arm measurable:** espionage dark ⇒ the
delivery returns on one flag read; web dark ⇒ no leash is resolved at all (the
`causeLifecycle` idiom); belief layer dark ⇒ `corruptionWebActive` is already false because it
requires `beliefsActive` (`corruptionWeb.js:225-230`) **and** `landEspionageProduct` refuses
with `beliefs_dark` (`espionageProducts.js:448-450`) — a **double** fence, deliberately;
errand-spine dark ⇒ no covert rows ⇒ no landings ⇒ nothing to leak.
⭐ **A dark or leak-free tick must write NOTHING into `beliefMaps`**, or every dormancy golden
moves.

### 6.6 Alignment and edit story

Req 13: the employment-strictness consumption the ES-6 charter names is **declared empty for
this slice** — it is a targeting/vetting term and it belongs to ES-6b with the quality
derivation. Req 14: **engine-only** — the one player/DM verb is ES-7's.

---

## 7. THE COUPLING TRAP — ⚠ this has bitten SIX times; ES-6a is the ninth crossing, and it
## MINTS NO REAL PAIR

**Measured layer homes** (`tests/lint/couplingInclusion.walker.test.js`, EXECUTED):

| Module | Layer | Evidence |
|---|---|---|
| `src/domain/worldPulse/espionage/**` | **INFO** | walker `:143`, a DIRECTORY pattern — the new leaf is claimed the day it lands |
| `src/domain/worldPulse/corruptionWeb.js` | **UNLAYERED** | matches no `LAYER_PATTERNS` entry; `tests/lint/.coupling-unlayered-baseline.json:50` |
| `src/domain/corruptionLeash.js` | **OUT OF CENSUS SCOPE** | `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse\|spatial)\//` (`:458`) — the file is `src/domain/`, one level up |
| `src/domain/corruption.js` | **OUT OF CENSUS SCOPE** | same |
| `src/domain/spatial/distanceRead.js` | **UNLAYERED** | `.coupling-unlayered-baseline.json:5` |
| `src/domain/worldPulse/beliefMap.js` | **INFO** | walker `:137`, `belief[A-Z]`/`beliefMap` prefix |

**THE DECISIVE LAW, READ AT SOURCE.** `couplingInclusion.walker.test.js:807` —
`test('a NEW cross-layer import is either licensed by a registry row or REDS')`. `licensingRows`
(`:664-671`) joins a row to a pair when `row.direction === pair.direction` **and**
(`moduleOf(row.read) === pair.importer` **or** `moduleOf(row.counterforce) === pair.importer`).

⇒ **Chains for every import this packet mandates:**

1. **`espionageLeak.js` → `corruptionLeash.js` (`resolveLeash`, `isForeignLeashKind`).**
   The dependency is **out of census scope** ⇒ the scan never reaches it ⇒ **no pair.**
   Precedent chain: `npcAgency.js:12`, `corruptionWeb.js:57` and `causeLifecycle.js:55` all
   already import it.
2. **`espionageLeak.js` → `corruptionWeb.js` (`corruptionWebActive` ONLY).** The dependency is
   **UNLAYERED** ⇒ `if (!depLayer) continue` fires ⇒ **no pair is minted.**
   ⚠⚠ **THIS IS FAIL-OPEN INVISIBILITY, NOT ABSENCE — CR-ES5B-4 BINDS: MINT A ROW ANYWAY.**
   The edge is real (an INFO leaf conditioning on the corruption web's own lighting) and the
   walker cannot see it. **Manifest item 4 mints it.** Which `pairId` and which `direction` a
   row over an unlayered dependency should carry is **not settled by code** — see **O7**.
3. **`espionageLeak.js` → `espionageProducts.js` / `espionageGate.js` / `espionageMath.js` /
   `beliefMap.js`.** All **INFO** ⇒ `depLayer === layer` ⇒ **no pair.**
4. **`espionageProductStage.js` → `espionageLeak.js`.** Both INFO ⇒ **no pair.**
5. **No cycle.** `espionageLeak.js` imports nothing that imports it; the new edge is acyclic and
   one-directional. ⛔ The leaf must never import `espionageProductStage.js`.
6. ⚠ **The barrel-hop hazard is live here.** `corruptionWeb.js` is 453 effective lines and
   imports the web's whole family. ⛔ **Import `corruptionWebActive` ONLY**, and the implementer
   must confirm the first-paint budget is unmoved (`tests/build/*` — **AUTHOR-TIME-UNMEASURED**,
   §10). `corruptionLeash.js` exists as its own leaf precisely for this reason and says so
   (`corruptionLeash.js:11-17`).

**Cure order applied, in order:** dependency inversion FIRST (the leaf takes plain values, the
`operatives` Map and `byId` from the caller and reaches into no family), a registry row SECOND
for the invisible edge. **Nothing is baselined.**

---

## 8. Exact change manifest

| # | Action | Path | Symbol / region | Max Δ | Instruction |
|---:|---|---|---|---:|---|
| 1 | CREATE | `src/domain/worldPulse/espionage/espionageLeak.js` | `LEAK_TUNING`, `leakTargetFor`, `deliverMissionLeaks` | **≤ 190 eff** (charter cap 200) | Per §6.1. Imports ONLY: `resolveLeash` (`../../corruptionLeash.js`), `corruptionWebActive` (`../corruptionWeb.js` — **that symbol alone**), `espionageActive` (`./espionageGate.js`), `landEspionageProduct`/`productGroundTruth`/`buildProductReport` (`./espionageProducts.js`), `beliefRecord` (`../beliefMap.js`), `round4` (`./espionageMath.js`), `clamp01` (`../../../kernel/math.js`). ⛔ **No `applyBeliefOverrides`. No `writeErrands`. No ladder import. No errand-family import.** Header states: the SAME-TICK web read (§0.1), the leak-only law, the two arms and why arm 2 is mandatory, the web-gated resolve idiom, the `observer === subject` refusal, and the never-import list. ⚠ Reword any header line a non-stripping walker could convict. |
| 2 | MODIFY | `src/domain/worldPulse/espionage/espionageProductStage.js` | `advanceEspionageProducts`, immediately after `depositMissionCredits` (`:747-749`); the return at `:750` | **≤ 15 eff** | The composition VERBATIM per §6.2. ⛔ `gatherArm`, `homeMouthArm`, `landOne`, `amendCovert` are NOT edited. ⚠ 254 effective lines of headroom — measure before and after. |
| 3 | REGISTER | `src/domain/certification/couplingRegistryEspionage.js` | new `ES6A_DOUBLE_AGENT_LEAK_COUPLING`, appended to `ES_ESPIONAGE_COUPLINGS` in wave order | ≤ 20 eff | Row per the `ES5D_CAREER_CREDIT_COUPLING` template. **All ten required fields**; `read:` and `direction:` are **O7** (chair-set); `counterforce: 'src/domain/worldPulse/espionage/espionageLeak.js#leakTargetFor'`; `flags: ['errandSpineEnabled','espionageEnabled','corruptionWebEnabled']`; `owningVolume: 'ESPIONAGE'`; `owningWave: 'ES-6a'`; `receiptField:` and `intendedDesk:` **AUTHOR-TIME-UNMEASURED** (§10). Docstring MUST state that the edge is invisible to the walker because `corruptionWeb.js` is UNLAYERED, and that the row exists under CR-ES5B-4 for exactly that reason. |
| 4 | TEST | `tests/domain/espionageLeak.test.js` | A1, A3, A4, A6 | — | The leaf's pins: both arms, the leash vocabulary, the patron-is-subject refusal, the id-space edges. ⚠ New file ⇒ un-anchored-negative ceiling **ZERO**; anchor every negative, preferring `tests/helpers/anchoredNegatives.js` (`expectPresentThenAbsent`, `expectAbsentWithAnchor`). |
| 5 | TEST | `tests/property/espionageLeakDormancy.test.js` | A2, A5, A7, A8 | — | The four-fence dormancy idiom + the silent-success negative + the pulse-ORDER pin + the declared-shift golden pair. ⚠ New file ⇒ anchor ceiling **ZERO**. |
| 6 | TEST | `tests/domain/espionageProducts.test.js` | the three scan blocks (`:242-320`) | ≤ 25 lines added | ⭐ **TWO OBLIGATIONS.** (a) **VERIFY, do not edit**, that all three existing scans stay green with the new leaf present — `overrideImporters` `[]`, `ladderWritersOf` `[]`, `amendersOf` `['espionageProductStage.js']`. **If any moves, that is STOP 5.** (b) **ADD the packet's ONE prevention guard**: a fourth scan in the same shape proving **no espionage module writes a belief into its OWN home observer from a leak path** — i.e. the LEAK-ONLY law made mechanical. ⛔ It must be **behavioral or plant-proven**, run as at least two mutants (a leaf that writes home a falsified report; a leaf that routes `applyBeliefOverrides`), **both must red**. A scan that cannot be reddened is not a guard. Its exact shape is **O8**. |
| 7 | DOC | `docs/DESIGN_FP_ARCH_ES.md`, `docs/implementation/INDEX.md` | §3.13 (:1194-1226); the ES-6 charter (:1633-1646); §4's wave count | — | Record C1–C7 in the amended-in-place voice, and record the ES-6a/6b/6c split. Documentation receipts do not count as production lines. |

**⚠ THE STANDING LANDING DISCIPLINE, BINDING ON THIS PACKET.** It mints **two new test files**,
so the change **must ALSO re-derive the sovereignty lighting census WHOLE — all five figures in
one run, never patching one.** The row at `58436804` is
**`files: 2392, parked: 365, credited: 2027, titles: 19659, suiteTitles: 5552`**
(`tests/lint/sovereigntyLightingContract.walker.test.js:3621` — EXECUTED read).
⚠⚠ **THE FIVE FIGURES ARE ASSERTED IN SEQUENCE WITH `files` FIRST, so a red `files` arm stops
the run and the other four are never evaluated** — the walker says so at `:3106-3113` and again
at `:3618-3620`. ⭐ **Measure them the way ES-5c and ES-5d did: a `console.log` inside the
existing census test BEFORE its first assertion**, so the probe mints no title and cannot move
what it measures.
⚠ **A documentary staleness, recorded not fixed:** `docs/implementation/INDEX.md:36` and the
walker's own comment at `:3583-3584` both still read `19656`; HEAD `58436804` bumped the
ASSERTION to `19659` (+3) and left both prose sites behind (EXECUTED: `git show 58436804 --
tests/lint/sovereigntyLightingContract.walker.test.js` is a one-line change, and
`git show --summary` reports **no new files** — the two test files that commit touched already
existed). **Trust the assertion, never the prose.**

**Nothing else.** A target outside this table is out of scope even if the full gate finds an
adjacent defect.

---

## 9. Acceptance matrix — 8 cases (cap 8)

| # | Case | Assertion |
|---|---|---|
| **A1** | Main reachable behavior | Espionage + web + beliefs lit: a covert mission lands a product home for an operative whose `corruptTies` resolve to a `foreign_settlement` leash naming a live third court ⇒ **that court's belief map gains the mission's subject** with the discounted accuracy, **and** its record about the HOME court gains confidence. Both arms in one case; the reach is the claim. |
| **A2** | Absent / disabled — FOUR fences | On one fixture: (a) `espionageEnabled` false ⇒ no leak, `beliefMaps` byte-identical; (b) `corruptionWebEnabled` false ⇒ **no leash is resolved at all** and `beliefMaps` byte-identical **even though a `foreignPatron` is present on the NPC** (the `causeLifecycle` idiom's whole point — C7); (c) beliefs dark ⇒ both fences fire; (d) `errandSpineEnabled` false ⇒ no covert rows ⇒ no landings ⇒ no leak. **Every arm proves `beliefMaps` gained no observer key.** |
| **A3** | Counterforce / negative (anchored) | An operative with a **`local_org`** leash, a **`cutout`** leash, and **no `corruptTies` at all** leaks nothing, and the patron-side map is byte-identical — anchored against a live positive control **in the same fixture** (a `foreign_settlement` operative on the same tick DOES leak), so the negative cannot fail open. The leaking-kind set is asserted **derived from `isForeignLeashKind`/the resolver's own contract**, never re-typed. |
| **A4** | Sparse / malformed-but-supported | No landings · a landing that changed nothing · a `foreign_faction` leash (`settlementId: null` ⇒ `no_settlement_endpoint`) · a patron id naming no live settlement · **a patron id equal to the home id** · **a patron id equal to the mission's subject** (arm 1 refused with `patron_is_subject`, **arm 2 still fires** — this is the case that would silently write nothing without arm 2) ⇒ zero throws, zero `NaN`, zero partial writes, and **every refusal names its reason on the receipt.** |
| **A5** | ⭐ ORDERING — THE SAME-TICK PIN | Drive the REAL pulse: assert **at source** that `advanceCorruptionWeb` (`pulseKernel.js:363`) precedes `advanceEnvoyDiplomacyPulse` (`:2031`) in one `simulateCampaignWorldPulse` body, and assert behaviorally that a leash written **this tick** is visible to the leak **this tick**. ⛔ **A `tick - 1` window must FAIL this case.** This is the ES-5d D7 machinery, applied to a re-derived pair. |
| **A6** | Idempotency / repeat | Advancing twice with the same mission and no new landing leaks **once**: the second advance produces no landing, therefore no leak, and the patron's record is unchanged. A landing that repeats on a later tick leaks again **by design** (a second telling is a second report) and `reconcileBelief`'s own `independentSources` arithmetic — not this packet — decides what that is worth. **No persisted marker is minted.** |
| **A7** | ⭐ SILENT SUCCESS — the real writer-to-reader integration, and the hardest pin | Through `advanceEspionageProducts` on a real world, run the **same seed twice**: once with the operative clean, once with him leashed. Assert (i) the HOME observer's belief slice, the errand rows, `wizardNews` and every returned receipt except `leaks[]` are **byte-identical between the two runs**; (ii) the patron's slice differs; (iii) **the first-ever `(patron, home)` entry materializes** and that is the intended arrival semantics (**O10**). ⛔ Any home-visible difference is STOP. |
| **A8** | ⭐ THE DISCLOSED SHIFT — the golden pair + the leak-only guard | The ⟨F6⟩ pair: (i) a **dark** golden asserting byte-identity with the pre-change output on the same seed; (ii) a **lit** golden recording the NEW patron-side output, whose header names the shift, its cause and this packet. **The manifest item 6 leak-only scan rides here**, run as its two mutants (a leaf that writes a falsified report home; a leaf that routes `applyBeliefOverrides`) — **both must red.** |

No privacy case: no receipt, audience or news surface is minted (ES-7 owns the voice).

---

## 9b. THE DECLARED BEHAVIOR SHIFT — the implementer MUST measure it before editing

> **This packet changes lit-world simulation output.** A leaked belief moves the patron court's
> `confidence01` and (above `CAT_ADOPT_ACCURACY`) potentially its `allianceLabel`/`readiness`,
> which feed **every** existing belief consumer for that observer — `believedNeedScale`
> (`generosityKernel.js:1181-1225`), the sovereignty appraisal's legs, `settlementBeliefs.js`'s
> display projection, and any war/trade read downstream of them. It also **materializes belief
> entries for observer/subject pairs that would not otherwise exist** (`beliefMap.js:32-35`).
> **It is a DISCLOSED, one-time shift, and it may NOT ride silently.**
>
> **THE IMPLEMENTER'S OBLIGATION, before the first edit:** run the full gate at BASE and record
> which goldens and pins are green. Then, after the change, **enumerate every golden/pin that
> moved, name each one in the commit message, and state the cause.**
> ⛔ **Re-recording any golden without stating the cause is forbidden** (house non-negotiable 10).
> ⛔ **A golden that moves and is NOT on the enumerated list is STOP 7.**
>
> **Goldens and pins most likely to move — CANDIDATES, not a closed list; the implementer
> measures the real set (§10):**
> `tests/property/espionageProductsDormancyFence.test.js` ·
> `tests/property/espionageAbsenceDormancy.test.js` ·
> `tests/property/espionageCareerCreditDormancy.test.js` ·
> `tests/property/espionageDormancyFence.test.js` ·
> `tests/property/espionageGauntletDormancyFence.test.js` ·
> `tests/property/espionageMissionDormancyFence.test.js` ·
> `tests/domain/espionageProducts.test.js` · `tests/domain/beliefMap*.test.js` ·
> `tests/property/npcCredibilityDormancyGolden.test.js` ·
> `tests/domain/generosityKernel*.test.js` · `tests/perf/tickScanBudget.test.js` ·
> `tests/lint/spatialLedgerCoverage.walker.test.js` (expected UNMOVED — no new key) ·
> `tests/build/*` (first-paint, because of the `corruptionWeb.js` import — §7 chain 6).
> ⚠ Every *Dormancy* golden should be **unmoved**: they drive dark worlds, and a dark world
> writes nothing. **A moved dormancy golden is STOP 7**, not a re-record.
>
> ⭐ **ALL THREE SIBLINGS MOVED ZERO GOLDENS AND PROVED IT BY ARITHMETIC** against the frozen
> census, because every lit consumer was itself behind a dark flag. **ES-6a should expect the
> same and must prove it the same way** — not by absence of complaint. ⚠ If a golden DOES move,
> that is the first time in this grain and it deserves the chair's attention **before** the
> commit.

---

## 10. Verification commands

```sh
cd /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold

# Focused tests — acquire the one test slot in the SAME command. NEVER bare vitest.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/espionageLeak.test.js \
  tests/property/espionageLeakDormancy.test.js \
  tests/domain/espionageProducts.test.js \
  tests/domain/espionageCareerCredit.test.js \
  tests/property/espionageProductsDormancyFence.test.js

# The belief layer's own pins — the leak writes through its one writer.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lib/spatialLedgerCoverage.walker.test.js tests/lib/spatialUsage.test.js

# The coupling ratchet — MUST stay green. NEVER baselined.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/couplingDesk.walker.test.js \
  tests/domain/couplingRegistry.test.js

# The anchored-negative walker + the lighting census — BOTH move when new test files land.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js

# The dormancy goldens — §9b's most load-bearing arm.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/property/espionageAbsenceDormancy.test.js \
  tests/property/espionageDormancyFence.test.js \
  tests/property/npcCredibilityDormancyGolden.test.js

# First paint — a NEW import of corruptionWeb.js from an espionage leaf (§7 chain 6).
sh scripts/gate-tail.sh npm run build && \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/build/

# Scan-cost — a new per-pass pass over landings.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/perf/tickScanBudget.test.js tests/perf/tickOpBudget.test.js

# Effective-line check (read the COUNT in the message; never pipe for status).
npx eslint src/domain/worldPulse/espionage/espionageLeak.js \
  src/domain/worldPulse/espionage/espionageProductStage.js

# Both typecheckers, named per the two-typechecker receipt law.
sh scripts/gate-tail.sh npm run typecheck:domain:strict     # tsconfig.domain-strict.json
sh scripts/gate-tail.sh npm run typecheck:ratchet           # tsconfig.full.json

# Wave-end gate — NEVER through a pipe.
npm run check:tail
```

⚠ **A NAMED HOT-PATH RISK the implementer must measure, not discover.** `deliverMissionLeaks`
runs **once per espionage pass**, over `landings` — a set already bounded by the number of covert
errands. In a dark world the cost is two flag reads. **But that is a prediction, not a
measurement.** Run the perf pair at BASE and after. ⛔ If it reds, the cure is **NOT** a cache:
memoising on world contents is the recorded OSR resolver-state-identity hazard. The cure is a
STOP and a chair conversation.

⚠⚠ **TWO PRE-EXISTING GATE REDS ARE NOT THIS PACKET'S.** `generatorGoldenMaster`
(owner-approved SHIFT-2, registered not re-recorded) and `observedShapeReaders.walker` (the OSR
lane's declared blocker: violations 1, stale 4). **Attribute, never chase.**
⚠⚠ **TRUST NO EXIT STATUS YOU DID NOT CAPTURE YOURSELF** — the harness has reported a RED gate
as "exit code 0". Never read a gate through a pipe; use `npm run check:tail` or
`sh scripts/gate-tail.sh`.

**AUTHOR-TIME-UNMEASURED baselines** — the implementer measures each at preflight, against the
BASE, **before the first edit**. Do **not** inherit a number from this packet.

| Figure | Status | Exact preflight command |
|---|---|---|
| Standing full-gate red set at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run check` |
| `typecheck:ratchet` error count + ceiling | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run typecheck:ratchet` |
| `typecheck:domain:strict` count + ceiling | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run typecheck:domain:strict` |
| The GREEN-AT-BASE golden/pin set (the §9b denominator) | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-tail.sh npm run check` at BASE, then diff the pass list after |
| Lighting census five figures | **AUTHOR-TIME-UNMEASURED** (the assertion read `2392/365/2027/19659/5552` at compile — **re-derive, do not inherit**) | re-derive ALL FIVE in one run via a `console.log` before the census test's first assertion; never patch `files` |
| `negativeAssertionAnchor` rows/sites | **AUTHOR-TIME-UNMEASURED** | `sh scripts/ratchet-inventory.sh negativeAssertionAnchor HEAD` |
| `couplingInclusion` pass count at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/couplingInclusion.walker.test.js` |
| **First-paint byte budget at base and after** | **AUTHOR-TIME-UNMEASURED — load-bearing** (§7 chain 6: a new `corruptionWeb.js` import from an espionage leaf) | `sh scripts/gate-tail.sh npm run build` then `npx vitest run tests/build/`; ⚠ measure RENDERED bytes from `stats.html`, never `wc -c` |
| `tickScanBudget` scanOps ratio at base | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/perf/tickScanBudget.test.js` |
| Whether a SECOND caller of `landEspionageProduct` reds any ownership walker | **AUTHOR-TIME-UNMEASURED** | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/ledgerOwnership*.test.js tests/lib/spatialLedgerCoverage.walker.test.js` |
| The coupling row's `receiptField` / `intendedDesk` | **AUTHOR-TIME-UNMEASURED** — ⛔ the packet does **not** hand-key them (HAND-KEYED-ADDRESS ROT). A row naming NO Herald kind (like ES-5b/5c/5d's) avoids the desk-routing join entirely. | derive the live path, then `npx vitest run tests/lint/couplingDesk.walker.test.js` |
| `LEAK_TUNING.FIDELITY_W` | **AUTHOR-TIME-UNSET — O4** | the chair authors it |

⚠ `npm run check` is a 17-step `&&` chain: a red step blacks out every later step, so the
receipt must say which steps actually **ran**.

---

## 11. Mandatory STOP conditions

1. Packet status is not READY (**it is DRAFT today — do not dispatch**).
2. HEAD is not `58436804` or an explicitly pinned, ancestry-verified descendant.
3. Any target file is dirty, or any espionage-family file has a commit newer than `954592c0`.
4. `espionageLeak.js`, `deliverMissionLeaks`, `leakTargetFor` or `LEAK_TUNING` already exists
   (measured **zero** occurrences at `58436804`); presence means another lane landed the grain.
5. ⛔ **Any of the three existing scans in `tests/domain/espionageProducts.test.js:242-320`
   moves.** Never edit a pin to green it.
6. `npcAgency.js`, `corruptionWeb.js`, `corruptionLeash.js`, `beliefMap.js`, `envoyPulse.js`,
   `espionageMissions.js`, `pulseKernel.js`, `applyWorldPulse.js`, or any errand-family file
   would need **any** edit, or any `.size-baseline.json` entry would move.
7. **Any golden or pin moves that §9b did not name** — or any *Dormancy* golden moves at all.
8. Any hard scope limit in §3 would be exceeded — in particular a **second** modified production
   file, **any** new persisted record family or `spatialLedgers` key, **any** new belief field,
   or a second direct consumer.
9. `tests/lint/couplingInclusion.walker.test.js` reds. **Never baseline.** Cure order is
   dependency inversion, then a registry row (§7).
10. The first-paint byte budget moves (§7 chain 6). ⛔ The cure is to narrow the import, never
    to raise the budget.
11. **The leak-only guard (manifest item 6) cannot be made to red under both its mutants.** A
    guard that cannot be reddened is not a guard, and this is the packet's only one.
12. The lighting census cannot be re-derived WHOLE, or any new test file needs an
    un-anchored-negative ceiling row.
13. Any file reserved by the concurrent OSR or TC-5 lanes would need touching.
14. **Any open item in §13 is still open at dispatch.** **O4 is a hard blocker** — the packet
    cannot be implemented as written until the chair authors the fidelity discount.

The STOP report carries the smallest measured contradiction, its evidence, and a proposed split.
No speculative repair.

---

## 12. Recorded deviations from the ES-6 charter

| # | Charter text | This packet | Why |
|---|---|---|---|
| **D1** | ":1634 the leash read **at dispatch**, keyed on the minted errand id" | The leash is read **at the product stage**, keyed on `walk.errandId` | C1: no dispatch site exists in production and its absence is DECLARED in two files. The product stage is the one live seam holding the operative, the errand and the errand id together. The errand-id keying survives verbatim. |
| **D2** | ":1635 magic **two-address** sends; mundane **reach-priced**" | **One hook on `landings`**; the landing's own `world` field is the arm | C2 + C3: the writer is single-observer by construction, and no reach predicate exists anywhere in `src/`. Leaking on landings gives magic per-stop streaming and mundane close-of-mission delivery from one call site with zero new timing code. |
| **D3** | ":1636 meta-intelligence writes … :1203-1205 the enemy's belief about the HOME court's posture **toward the subject** … existing slots, **zero new surfaces**" | A **two-party** existence leak: `(patron, HOME)`, CONFIRM-shaped | C4: `BeliefRecord` cannot express a three-party fact. The two-party narrowing keeps "the enemy learns the court is active" with **genuinely** zero new surfaces, and it is what makes the patron-is-target case non-vacuous (§2). **O2.** |
| **D4** | ":1638 the retroactive Herald clause on web exposure" | **DROPPED to ES-6c / ES-7** | C5: the kind is unbuilt, the six kinds are ES-7's by the design's own §4, no ES content annex exists, the exposure producer returns `newsEntries: []` on every path, and the persisted exposure log has already dropped the leash. |
| **D5** | ":1637 vetting quality from home security × own-web health" | **DROPPED to ES-6b** | C6: a second behavior family, a second production file, a **two**-member quality vocabulary that needs a chair-authored threshold, and a consumer with no production caller. |
| **D6** | ":1645 web dark ⇒ **no leash resolution** ⇒ leaf no-ops" | The **leaf** gates the resolve, copying `causeLifecycle.js:374-375` | C7: `resolveLeash` is not web-gated and a betrayal-seeded `foreignPatron` survives in an unlit world. The charter's sentence is true only of a leaf that spells the gate. |
| **D7** | (unstated) the leak's timing relative to the corruption web | **SAME TICK, no lag**, and the pulse ORDER is pinned at source | §0.1. ES-5d's D7 shipped a `tick-1` window that was provably dead; the recorded lesson is that a lag belongs to a PAIR. This pair was re-derived, not transferred. |
| **D8** | ":1633 degraded-dark when the web is dark" — implying one flag | **Two flags, plus a double belief fence** | `corruptionWebActive` already requires `beliefsActive`, and `landEspionageProduct` refuses independently with `beliefs_dark`. Recorded so the redundancy reads as deliberate rather than as a missing gate. |

---

## 13. OPEN ITEMS — the chair closes each at promotion

⛔ **O1 decides whether there is a packet at all. O4 is a hard blocker: ES-6a cannot be
implemented as written until the chair authors the tuning.**

| # | Item | Recommendation |
|---:|---|---|
| **O1** | ⛔ **THE SPLIT.** ES-6 as chartered is four behavior families against a cap of one, and three of six mechanisms have no substrate. Does the chair accept the ES-6a / ES-6b / ES-6c split? | **ACCEPT.** The arithmetic is §0.2 and it is not close: the chartered wave needs 5 modified production files against a cap of 3, a new belief key (owner-gated persistence shape), a Herald kind ES-7 owns, and a news producer built in another volume's file. **ES-6a alone is a clean one-family packet at 1-of-3 modified files with zero new persisted state.** ES-6b should ride the DISPATCHER wave so its derivation lands with a consumer. ES-6c folds into ES-7 outright. ⚠ The charter's own §4 wave count and dependency spine (`:1675-1684`) need the same amendment ES-5b's split needed. |
| **O2** | ⛔ **IS THE EXISTENCE LEAK IN ES-6a?** §3.13's meta-intelligence clause is refuted as a three-party fact (C4). The two-party narrowing — a CONFIRM on `(patron, HOME)` — is expressible today. | **YES, INCLUDE IT.** Not for completeness but because **without it the design's headline case writes nothing**: when the patron IS the mission's subject, `landEspionageProduct` refuses the intel arm generically (`espionageProducts.js:446`), and §3.13 says the leak fires *"whether or not it is the target."* The arm costs no new arithmetic — `productGroundTruth`'s CONFIRM branch asserts the observer's own prior, and a patron who has never heard of home takes the built-in honesty refusal. **Alternative:** ship intel-only and defer the existence leak, accepting that the most dramatic case is silently inert. The lane recommends against and flags that case A4 pins whichever is chosen. |
| **O3** | ⛔ **THE MUNDANE ARM'S TIMING.** §3.13's "lands when the agent next touches a node in the enemy's rumor range" has **no substrate** (C3). | **THE MUNDANE LEAK RIDES THE MISSION'S OWN LANDING** — the agent reports to both masters when he gets home. Zero new spatial reads, zero new timing code, both arms pinnable from the landing's existing `world` field. **Argument:** it is also the more honest fiction — a mundane double agent carries everything in his head, and there is no mechanism by which paper reaches a patron mid-journey. **Alternative:** a hop-DELAYED delivery via `hopDelayTicks` (`distancePricedNews.js:30`, real and pure) — but a future-dated arrival needs a deferred-delivery carrier, which is **a new persisted record family and a second behavior family**, i.e. a re-slice. ⛔ Do not attempt the reach predicate: building one is a spatial-layer capability, not an espionage wave. |
| **O4** | ⛔ **THE FIDELITY DISCOUNT `LEAK_TUNING.FIDELITY_W`, and its home.** An implementer must not author it (CR-ES5B-6 / CR-ES5C-O4 / ES-5d O2). | **Home: the new leaf's own frozen `LEAK_TUNING`** (the ES-5d O2 precedent — the value is meaningless outside the leaf and the single-home law outranks slot economy). **Value: the chair authors it.** The measured grid is §6.3; the sharp edge is `CAT_ADOPT_ACCURACY = 0.6`, above which a leaked report can flip a categorical label and below which it can only firm confidence. **The lane's argument: set it so a typical first-hand leak lands BELOW the adoption threshold** — a leak is smuggled, unverifiable and told by a man serving two masters, so it should sharpen what the patron already suspects and only rarely re-anchor his picture. ⛔ The implementer may not tune it. |
| **O5** | **THE HOOK'S SITE.** Post-loop on `landings` (ES-5d's idiom, one call site) vs. per-stop inside `gatherArm`/`homeMouthArm` (two call sites, closer to the design's per-stop language). | **POST-LOOP.** One call site, ≤15 effective lines, both world arms free from the landing's own `world` field, and `gatherArm`/`homeMouthArm`/`landOne` stay unedited. The per-stop siting would need two hooks, would blow the hot-file delta, and would re-derive the magic/mundane decision a third time in a file that already derives it twice (`:457-459`, `:594-595`). Vetoable in one clause. |
| **O6** | **THE `leaks[]` RECEIPT — does it exist, and does it surface?** Silent success forbids home-visible STATE; a returned receipt is not state. | **RETURN IT FROM `advanceEspionageProducts`, AND DO NOT THREAD IT THROUGH `envoyPulse.js`.** Returning it gives the tests something to assert and ES-7 something to speak later; **not** threading it keeps `envoyPulse.js` out of the manifest and holds modified production files at **one**. ⭐ Precedent that this is safe: `espionageLandings` is already returned all the way to the pulse mouth and `pulseKernel.js:2031-2054` destructures seven other fields and never reads it — a returned receipt genuinely is inert. ⚠ Case A7 must therefore assert byte-identity of **`worldState` and every OTHER returned field**, explicitly excluding `leaks[]`. |
| **O7** | **THE COUPLING ROW'S `pairId`, `direction` AND `read` ADDRESS.** The only non-INFO dependency is `corruptionWeb.js`, which is **UNLAYERED**, so **no pair is minted and there is no direction to copy**. CR-ES5B-4 still binds: mint a row for the invisible edge. | **MINT THE ROW; the chair sets its `pairId` and `direction`.** The lane's reading: the corruption web is INTERIOR's subject matter in everything but its layer table entry, so **`pairId: 'CPL-20'` (the volume's own INFO × INTERIOR anchor) with `direction: 'INTERIOR→INFO'`** and `read: 'src/domain/worldPulse/espionage/espionageLeak.js#deliverMissionLeaks'` mirrors ES-3's `INTERIOR→INFO` row and mints no twenty-third anchor. ⚠ **The lane cannot settle this from code** — a row whose `direction` names a port the dependency does not belong to may or may not be admissible to `couplingDesk.walker`, and that is an **AUTHOR-TIME-UNMEASURED** check (§10). **Alternative:** widen `LAYER_PATTERNS` to claim the corruption family for INTERIOR — a genuinely better repair that would make the edge VISIBLE rather than merely recorded, but it re-censuses every existing corruption import in the estate and is **its own packet**, not a clause of this one. |
| **O8** | ⛔ **THE LEAK-ONLY GUARD'S EXACT SHAPE.** LEAK-ONLY is owner law and this packet is the first wave that could violate it, so the guard is mandatory — but a source scan for "a falsified report home" has no obvious token to match on, and this estate has been bitten by a scan that could not be reddened (CR-ES5C-5: three forbidden spellings that existed nowhere). | **A BEHAVIORAL GUARD, NOT A TOKEN SCAN — and the lane recommends the DIFFERENTIAL shape.** Drive one fixture twice on the same seed, clean operative vs leashed operative, and assert the HOME observer's belief slice is byte-identical; then plant a leaf that writes a falsified report home and assert the differential REDS. That guard cannot go vacuous the way a spelling list can, because its subject is the observable the law is about. **Keep the two token mutants as well** (`applyBeliefOverrides`; a home-observer write from the leak path) — they are cheap and they ride the existing scan block. ⛔ **If the differential cannot be made to red under its plant, that is STOP 11, not a weaker guard.** |
| **O9** | **THE GLOBAL CREDIBILITY BLEED.** The leaked report's `sourceId` draws on `spatialLedgers.npcCredibility`, which is keyed **by source id only, with no observer dimension** (`npcCredibility.js:137-138`) — so the patron's view of the agent and the home's view are the same number. | **ACCEPT IT AND RECORD IT.** A per-observer credibility surface is a new persisted record family and belongs to the information program, not to a double-agent wave. The shared stock is also arguably right: a man's reputation is one reputation. ⚠ **The consequence the chair should see:** if a future wave ever charges credibility for a detected leak, that charge will **bleed into the agent's home-side reputation too** — which may be exactly the drama wanted, or may be a bug, and it should be decided when it is built rather than discovered. |
| **O10** | **FIRST-EVER BELIEF ENTRIES.** `beliefMaps` is arrival-gated and never pre-populates all pairs (`beliefMap.js:32-35`). A leak may materialize the first-ever `(patron, home)` or `(patron, subject)` entry. | **CONFIRM IT AS INTENDED, AND PIN IT.** The leak **is** the arrival, and "espionage is the SOURCE of appraisal legs about non-neighbours" is the owner's stated reason this program exists (`memory/espionage-confirmers-directive.md`, and ES-4 discharged WR-10's lighting condition on exactly that reading). ⚠ But it is a visible change in belief-map POPULATION, not only in values, so case A7 must assert it explicitly rather than let it ride inside a byte-identity check that would never notice a new key appearing on the OTHER side. |

---

## 14. Marking-law note for the chair

Per the marking law at the `33aeea35` boundary, authoring a packet from a Fable-issued design
owes no queue row, and **this DRAFT lane appends nothing**. **Five items here go beyond that**
and in the compiling lane's judgment **owe a row at promotion**:

1. **§0 C1 — THE ESPIONAGE PROGRAM HAS NO DISPATCHER, AND TWO FILES DECLARE IT IN WRITING.**
   `castCovertOperative`, `mintCovertMission` and `dispatchCadenceFor` all have zero production
   callers, and R-ES1-1 (the six-war-flag weld on `mintEnvoyErrand`) is unchanged at this build.
   **Every ES wave from ES-1 forward has landed machinery that no world can reach.** That is a
   deliberate, declared shape — but it means ES-6's "at dispatch" clause, ES-6b's vetting
   quality, and any future wave keyed on dispatch are all blocked on a wave nobody has
   chartered. **The chair should decide whether the DISPATCHER is a wave.**
2. **§0 C4 — `BeliefRecord` IS STRICTLY TWO-PARTY, and the ES volume assumes otherwise in at
   least one place.** §3.13's meta-intelligence clause is written as a three-party fact and
   claims "zero new surfaces". It is not expressible. The narrowing works, but any future wave
   reaching for "A believes B's stance toward C" hits the same wall.
3. **§0 C5 — THE CORRUPTION WEB'S FOREIGN-EXPOSURE CONSEQUENCE EMITS NO NEWS AT ALL.**
   `applyForeignExposureBlowback` (`corruptionWeb.js:888-970`) declares `newsEntries` in its
   typedef and returns `[]` on every path; the persisted `corruptionEvents` projection
   (`pulseKernel.js:1773-1776`) drops `patronId` entirely. A foreign patron's exposure is
   currently a **silent** event. That is a live gap in another volume, found while measuring
   this one, and ES-6c/ES-7 will hit it.
4. **§0 C3 — THERE IS NO RUMOR-REACH PREDICATE IN THE ESTATE.** Several design volumes speak of
   "within X's rumor range" as though it were a fact one could ask for. It is not: rumor
   propagation is a relay simulation with a hop BUDGET, and only continuous hop PRICING is
   queryable. Any design clause phrased as a reach membership test is unbuildable today.
5. **§8 — A DOCUMENTARY STALENESS IN THE LIGHTING CENSUS.** `INDEX.md:36` and the walker's own
   comment block both read `19656`; the ASSERTION at `:3621` reads `19659` after HEAD
   `58436804`. Small, but this estate has been bitten by prose that outlived its assertion.

Also worth a row in the lane's judgment, though smaller: **the espionage set now has THREE
directory-wide scans** (`applyBeliefOverrides`, `ladderWritersOf`, `amendersOf`) that every
future ES leaf inherits the moment it lands, and only the third is recorded outside its own
test file. ES-6a adds a fourth. **They are the volume's real boundary, and they deserve to be
known where waves are planned rather than discovered where they red.**


## Chair rulings at the READY flip (2026-08-11) — all ten CLOSED, O4 included

Fable-issued; implementing them owes no post-boundary row. Reopen none.

- **O1 SPLIT RATIFIED.** ES-6 as chartered is four behavior families against a cap of one,
  **5 modified production files against a cap of 3**, plus a new belief key (owner-gated
  persistence shape AND a breach of §1's zero-new-keys law), a Herald kind the design's own
  §4 gives to ES-7, and a news producer that would have to be built inside another volume's
  file. **ES-6a** (the leak) now; **ES-6b** (vetting quality) rides the DISPATCHER wave
  since its consumer is dead-headed; **ES-6c** (the retroactive clause) folds into ES-7.
- **⛔ O4 DISCHARGED — `LEAK_TUNING.FIDELITY_W = 0.7`, and it is DERIVED, not chosen.**
  The sharp edge the lane measured is `CAT_ADOPT_ACCURACY = 0.6` — the threshold above
  which a categorical label is ADOPTED rather than merely noted. At `0.7`, an enemy court's
  copy crosses that threshold only when the home read was **above ~0.857**, i.e. only when
  the agent saw it clearly. **So a clear look leaks a conclusion the enemy can act on; a
  partial look leaks only that something happened.** That is exactly §3.13's "leak-only,
  silent success". `0.7` sits on the family's own 0.05 grid.
  ⚠⚠ **A pin must prove BOTH SIDES of that boundary** — a high-accuracy leak ADOPTS, a
  marginal one does NOT — so the value's meaning is machinery rather than prose. ⛔ The
  implementer may not tune it; chair-authored dark tuning, vetoable, owner-signed at soak.
- **O2 ACCEPTED — include the two-party existence leak.** Decisive: without it **the
  patron-is-target case writes NOTHING**, because `landEspionageProduct` refuses
  `observer === subject`. A leak that silently does nothing in its most interesting case is
  the vacuous-feature class this program has now caught twice.
- **O3 ACCEPTED** — the mundane leak rides the mission's own landing. The charter's "enemy
  rumor reach" is REFUTED (no reach predicate exists; only continuous pricing), and
  inventing one is a new derivation surface nobody commissioned.
- **O5 ACCEPTED** — the post-loop hook. **O6 ACCEPTED** — return `leaks[]` but do NOT
  thread it, which keeps `envoyPulse.js` out of the manifest entirely and holds the
  modified-file count at 1 of 3.
- **O7 RULED** — mint the coupling row under the existing `pairId: CPL-20` with
  `direction: 'INFO→INFO'`, recording in its docstring that the edge is
  **fail-open-invisible** (`corruptionWeb.js` is UNLAYERED and the corruption leash files
  are outside `CENSUS_SCOPE_RE`). CR-ES5B-4's precedent: record what the walker cannot see.
- **⭐ O8 ACCEPTED and it is the sharpest of the ten — the leak-only guard MUST be a
  DIFFERENTIAL, never a token scan.** A scan for a leak token is the
  comment-convicts-itself trap in another costume: it passes when the leak is absent for
  the wrong reason, and it convicts prose. Assert instead that the SUBJECT'S OWN outcome is
  byte-identical with and without the leak — that is the claim "silent success" actually
  makes.
- **O9 ACCEPTED** (credibility is global, not per-observer — do not fork it) and
  **O10 RULED**: a first-ever belief entry is CREATED by the leak like any other, with no
  special-casing; if that proves impossible, STOP and report rather than inventing a
  seeding rule.

**⭐ THE FINDING THAT REFRAMES THE VOLUME, and it is not a defect:** the charter says the
leash is read AT DISPATCH — **and no dispatch site exists.** `espionageMissions.js:14-20`
states outright that *"NOTHING UNDER src/ CALLS THIS FILE"*, and that this is the WR-10
dark-instrument shape ES-0 landed under, **deliberately preserved**: *"ES-1 builds the
DOOR, not the traffic through it."* The dispatcher is a later wave's. So D1's re-siting to
the product stage — the one live seam holding the operative, the errand and the errand id
together — is not a workaround; it is the only live seam that exists, and the errand-id
keying survives verbatim.

**⭐ THE D7 LESSON APPLIED PER-PAIR, and it held:** corruption web → espionage products is
**SAME TICK** (`pulseKernel.js:363` → `:2031` → `envoyPulse.js:415`, one thread of
`worldState`). A `tick-1` window here would have been dead exactly as ES-5d's was. Case A5
pins the pulse order AT SOURCE.


## ⚠⚠ Landing note added at promotion — the census path is NOT this packet's to reserve

The validator refused this packet's original manifest with
`duplicate change path across packets: tests/lint/sovereigntyLightingContract.walker.test.js
(TC-5A, ES-6A)` — and it was **right**, which surfaces a real conflict in the landing
discipline itself.

**The standing rule "any packet adding a test file re-derives the lighting census in its
own change" collides with the exclusive-path reservation the moment TWO packets are READY
at once.** Both would legitimately touch that one file, and the validator forbids it —
correctly, because two packets cannot both own a shared exact-pinned artifact.

**RULING: TC-5A holds the reservation (it claimed it first). ES-6a does NOT touch the
census file.** Instead its census re-derivation becomes a **CHAIR POST-LANDING STEP**, the
same shape as the observed-shape `--write`: the implementer measures and REPORTS all five
figures with its isolated delta, and the chair folds them in after the commit. The
implementer must still ANCHOR every negative in its two new test files — that obligation is
per-file and conflicts with nothing.

⚠ **The implementer must therefore NOT edit `sovereigntyLightingContract.walker.test.js`.**
Report the delta; do not fold it.
