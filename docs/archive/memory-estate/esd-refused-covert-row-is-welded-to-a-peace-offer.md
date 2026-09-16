---
name: esd-refused-covert-row-is-welded-to-a-peace-offer
description: "⛔⛔ ES-D REFUSED FORWARD — seven measured refutations. The killer: a covert errand's ID and BOTH endpoints are derived from a peace OFFER (normalizeErrand:568,580,590), so a court can only spy on the court it is suing for peace with. mintCovertMission is a validated DEAD END (no writer accepts its `fields`; mintEnvoyErrand re-mints them itself). Smallest split = ES-Da, the composite rider — and it is OWNER-GATED new capability."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T17:53:52.560Z
---

**MEASURED 2026-08-11 at `ffc85a90`, branch `claude/composite-r4`.** Author/recon lane.
Draft: scratchpad `esd-packet-draft-ES-D.md` (657 lines). Nothing written into the repo.

## ⛔⛔ THE SEVEN REFUTATIONS OF THE ES-D CHARTER

The charter was *"`dispatchCadenceFor` × `castCovertOperative` × `mintCovertMission` wired to a
writer… every part exists; only the composition is missing."* **Two of the three named functions
are unusable.**

1. **`mintCovertMission`'s `fields` HAVE NO WRITER.** `mintErrandSpine` is a pure producer;
   `mintEnvoyErrand` is a **SIBLING over the same producer**, not a consumer — it calls
   `mintErrandSpine` itself (`envoyErrand.js:216`) and spreads `...spine.fields` (`:273`).
   **No function in `src/` accepts a pre-built spine block.** Any dispatcher calls
   `mintEnvoyErrand` directly and bypasses the ES-1 door entirely.
2. **EXECUTED:** `mintCovertMission` with its own default `purpose:''` → `covert_face_required`.
   Only `'sue'`/`'self_parlay'` mint. `PURPOSE_CLASS_BY_PURPOSE` has exactly two members
   (`envoyErrandVocabulary.js:147-150`).
3. ⭐⭐ **THE KILLER, STRONGER THAN R-ES1-1 EVER RECORDED.** `normalizeErrand` forces
   `id ∈ {envoyErrandIdForOffer(offer), envoyAttemptIdForOffer(offer)}` (`envoyErrandRecords.js:568-569,580`)
   **and `payload.offererId === from && payload.targetId === to` (`:590`).**
   **A covert mission cannot choose its own subject OR destination — both ARE the peace offer's
   parties.** §3.12's product intent (defer any decision pending a confirmation about any subject)
   **is not deliverable at this HEAD by any packet.**
4. **The only route producer is itself war-flag gated** (`buildEnvoyRoutePlan`,
   `envoyDiplomacy.js:283`) **and solves one origin→one destination only** (`:290,:315`) —
   a multi-stop covert itinerary has **NO producer**.
5. **`castCovertOperative` is unusable on the only reachable path**: `dispatchAcceptedPeaceEnvoy`
   already casts by the DIPLOMATIC law (`envoyCandidate`, `:409`, importance-DESCENDING).
   One traveller; the two casting laws cannot both cast him.
6. **`volunteerBandsFor` has ZERO producers** — `loyaltyBand`/`foreignTieBand` are consumed
   nowhere-produced. With no callback a `careful` seat accepts **everybody**, so
   `vetting_refused` (`espionageMissions.js:176`) is **unreachable**. ES-6b is NOT unblocked.
7. ⛔⛔ **BOTH PULSE MOUTHS ARE AT EXACT ZERO EFFECTIVE-LINE HEADROOM:**
   `applyWorldPulse.js` **941/941**, `pulseKernel.js` **1580/1580**, enforced **in BOTH
   directions** by `tests/lint/sizeBaseline.test.js:112-120`. And `grep -n espionage pulseKernel.js`
   returns **NO MATCH** — stages are INLINE, `pulseStageManifest.js` is *"not a plugin registry"*.
   The estate's workaround is the **name-swap idiom**.

## ⭐ THE ONLY BUILDABLE SHAPE: ES-Da, THE COMPOSITE RIDER — AND IT IS OWNER-GATED

Attach covert cargo to an already-accepted peace envoy at `envoyDiplomacy.js:482` (§3.4/§3.5's own
composite-mission shape). One new leaf **inside `src/domain/worldPulse/espionage/`**, ≤15 eff into
`envoyDiplomacy.js` (753/800, hot-file cap binds first at 15). ⭐ **ZERO new tuning values** —
every field derives (`stayTicks: 0` because the errand model has NO dwell: the return plan departs
at `outboundArrival + 1`, `envoyDiplomacy.js:337`).

⛔ **OWNER-GATED on three grounds:** it makes five landed-dark waves fire at once (new capability,
not repair); every accepted peace envoy becomes a potential spy (war-lane product behavior); and
§3.12's carve-out is adjacent enough that CR-ES5B-5's both-directions misread precedent applies.

## ⚠⚠ HAZARDS THAT GENERALISE

- ⭐ **THE COUPLING DIRECTION INVERTS WHEN THE IMPORT DIRECTION INVERTS.** Every espionage row is
  `GRAMMAR→INFO` because the espionage file is the IMPORTER. ES-Da has `envoyDiplomacy.js`
  (GRAMMAR) importing the espionage leaf (INFO) ⇒ **`INFO→GRAMMAR`**. This draft had it backwards
  on its first pass. `direction = ${depLayer}→${importerLayer}`
  (`couplingInclusion.walker.test.js:568-578`), and **nothing cross-checks the `couplingId`'s
  `X_TO_Y` segment against `direction` — a wrong arrow ships GREEN.**
- ⭐⭐ **THE THREE-FILE COUPLING MANIFEST BUG IS PROVEN FROM GIT, NOT SUSPECTED.** ES-5b `6c0238ad`,
  ES-5c `c0447b8f`, ES-5d `954592c0`, ES-6a `53d538b4` **each declared only
  `couplingRegistryEspionage.js`** and **each also touched `couplingRegistry.js` (+1) and
  `tests/domain/couplingRegistry.test.js` (+4/+9/+10/+10).** A manifest naming only the leaf is
  **unbuildable as written**. Two EXACT lists red: `ES_ESPIONAGE_COUPLINGS` (`:625-646`) and
  `couplingRowsFor('CPL-19','INFO→GRAMMAR')` (`:571-577`, currently 4 members).
  ✅ There is **NO** exact assertion on `COUPLING_REGISTRY.length`; `ARGUED_ROSTER_CEILING` (13)
  and `UNLAYERED_BASELINE_CEILING` (179) are unmoved. A new `.js` under `/espionage/` is
  **auto-layered INFO** — no census edit.
- ⚠ **A CORRECTION TO THE RECORD: ES-5d did NOT ship the dead window.** `git log` shows one commit
  (`954592c0`); the landed code is same-tick (`espionageCareerCredit.js:192` writes `depositTick: now`,
  `:244` reads strict `!== now`). The dead `tick-1` lived in the **spec** and was caught before
  landing. The doctrine stands; the shipped defect does not.
- ⛔ **`tests/lint/pulseKernelLineAddress.walker.test.js:128-154` FORBIDS a `pulseKernel.js:<N>`
  literal anywhere in `src/` or `tests/`.** Pin pulse order with the **content-anchor idiom**
  (`indexOf('<call>(')` comparisons), the shape `espionageCareerCreditDormancy.test.js` A5 uses.
- ⭐ **THE LIGHTING-CENSUS PATH IS CURRENTLY FREE** (13 LANDED, 1 STALE, **zero READY**; LANDED
  packets release paths). ⚠ **But IA-2/STALE still reserves `docs/implementation/PACKET_MANIFEST.json`
  AND `INDEX.md`** — a new packet may not list either in its own change manifest.
  A coupling row moves the census by **zero**; only new test FILES or new literal titles move it.
- ⚠ **`mintErrandSpine`'s dark arm returns `ok: true`** (`errandMint.js:251`) while every other
  non-`spine` outcome returns `ok: false`. **Test `reason === 'spine'`, never `ok`** — the
  `pactTransportFor` idiom (`pactProposals.js:265`).
- ⚠ `espionageMissions.js:19-20`'s "three independent proofs" of dormancy is **two** —
  `espionageActive` already implies `errandSpineActive` (`espionageGate.js:80`).
- ✅ `espionageDormancyFence.test.js` FENCE 1's `ESPIONAGE_SET` is only the **three ES-0 leaves**
  and skips any path containing `/espionage/` — which is exactly why a new dispatch leaf **must**
  live in that directory.

Related: [[es7-refused-the-dispatcher-is-the-gate]] · [[espionage-ladder-handoff-is-same-tick]] ·
[[es5b-reconciliation-and-chair-rulings]] · [[es5c-chair-rulings]] ·
[[coupling-inclusion-argued-roster-13]] · [[espionage-confirmers-directive]].

## ⭐ SUPERSEDING STATUS 2026-08-11 (~18:05): ES-Da is AUTHORIZED under the refreshed grant

The seven refutations above STAND — they define why only the composite rider is lawful.
The owner's refreshed grant released §16 to chair judgment; the chair AUTHORIZED ES-Da
dark-built (OWNER_DECISION_QUEUE §17/§17a; rulings CR-ESDA-1..5). The compile recon
CONFIRMS the sizing and adds: the zero-headroom hazard belongs to the pulse MOUTHS —
`envoyDiplomacy.js` itself has 47 lines of headroom and the composition point
(`dispatchAcceptedPeaceEnvoy`'s single `mintEnvoyErrand` call) sits below the mouth, so
ES-Da adds ZERO pulse lines; dark-path byte-identity holds BY CONSTRUCTION (a declined
rider spreads `{}` into an argument list that already forwards `purposeClass`/`covert`
unread). ⚠ ES-5b/5c were NEVER covert-gated and light at endgame regardless of ES-Da
(§16's premise narrowed at §17a). Draft: session c42c8924 scratchpad laneQ-ES-Da-draft.md;
promotion serializes behind TC-5b-i (landed 9183d52c) per the census reservation.
