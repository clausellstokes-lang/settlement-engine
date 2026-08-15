# Foreign Policy / GR-4B-II-W2 — the `reaffirmed` voice

- **Status:** LANDED
- **Packet version:** `1`
- **Train:** `gr-4b-ii`, member **W2 of 2**. Plan:
  `laneTC2-TRAIN-PLAN-draft.md`. ⛔ This packet is dispatched from **inside** the
  private ref `refs/trains/gr-4b-ii`, at promotion commit `P2`, whose parent is
  W1's implementation commit `I1`.
- **Family preamble:** [`GR-PREAMBLE.md`](../../preambles/GR-PREAMBLE.md), LANDED
  SHA-256 `ef96f8b63ab68690d22d9bbd44c7057b8c4c5256d1a95f8bd3f409c2d748b2e3`.
  ⭐ **RE-STAMPED AT PROMOTION**, as the draft header required: the draft hash
  `3b0fb860…` is superseded by the landed one above. Every obligation in
  §P1-§P9 of the preamble binds this packet and is **not** restated below; only
  wave-specific material appears here.
- **Verified base:** `claude/composite-r4` at `039f8380dbc4566d48b5faa8eef39813b6f42eb4`
- **On that base:** `039f8380` is W1's implementation commit `I1` — this member's
  own parent inside the train, and the sha its implementation `I2` is the direct
  child of. The packet was COMPILED at `d383aa3c` (I1's parent); I1 changes only
  `docs/content/RECEIPT_POOLS_GRAMMAR.md`, so every source and test seal in §4.1
  carried forward unchanged and the corpus seal was re-taken after W1 landed.
- **Base measured:** 2026-08-14 in the minifold worktree with a clean
  `git status --porcelain` (executed, §12a).
- **Depends on:** GR-4d at implementation `a17d0a02` for the durable pending
  proposal, its validator and the typed terminal map; GR-4b-α for the landed beat
  composer idiom; GR-4b-iii-a at implementation `7e7d5205` for the fallen-holder
  composer and the before/after identity-snapshot idiom; **W1 of this train** for
  the corrected `reaffirmed` corpus.
- **Collision group:** `pact-grammar-voice`, `world-pulse-proposal-store`,
  `sovereignty-lighting-census`. Serialize against every lane touching any of the
  thirteen manifest paths.
- **Commit authority:** edits only. The coding agent edits exactly the thirteen
  paths in §7 and leaves them unstaged and uncommitted. The coordinator owns
  proof, immutable commit construction, terminal promotion, and the single
  old-value CAS at `T`.
- **Baseline posture:** the verified tree is clean. Both CREATE targets are
  absent (executed, §12a). **No hot file enters this manifest** — the three
  standing hot files were measured at this base and none is touched (§4.3).

---

## 1. Reconciled authority and chair rulings

This is the successor authority for the `reaffirmed` half of GR-4b-ii. Terminal
`GR-4B.md`, `GR-4D.md`, `GR-4B-IIIA.md` and `GR-4B-IIIB.md` are history and must
not be amended or redispatched.

`GR-4B.md:146` defines GR-4b-ii as *"THE HONOR VOICE. `reaffirmed` +
`honored_by_silence`, and the noise question they raise"*.
`GR-4B-IIIA.md:41-46` widened the deferral to *"`honored_by_silence`,
`reaffirmed`, and every honor/terminal voice"* **and** *"any voice on Apply,
Dismiss, expiry, ring overflow, undo, or replay"*. **This packet is the release
of exactly one kind: `reaffirmed`, on exactly one road: Dismiss.**
`honored_by_silence`, expiry, ring overflow, undo and replay stay deferred.

### CR-GR4B-16 — the annex chair act (W1) is discharged and immutable

W1 of this train corrects both honor pools. The implementer consumes the
`reaffirmed` block **verbatim** and may not edit it. ⛔ Annex SHA-256 mismatch at
dispatch is a STOP.

The seven authored `reaffirmed` families and their required-slot vectors are
derived **by execution** through `tests/helpers/receiptAnnex.js` at P2 — never
transcribed — and pinned in the dispatch capsule.

`{npc}` means only the **fallen holder** recorded on the acting court's oath
stamp. No successor or roster lookup is permitted. `{band}` is absent. The pool
remains seven families, `notable` significance, `public` audience, in the
authored order.

### CR-GR4B-17 — scope override, exactly two rows (CHAIR GATE)

⛔⛔ **An override never transfers** (preamble §P2). GR-4b-α's `3 → 5` / `12 → 14`
does not reach this packet, and this packet claims none of it. It records its
own, measured, before dispatch:

| Default limit | This packet | Override |
|---|---:|---|
| Registration-only production files | **5** | ⛔ `3 → 5` |
| Handwritten files total | **13** | ⛔ `12 → 13` |

**Grounds, stated so the override is vetoable rather than assumed:**

1. **The five registration files carry no independent decision.** Each takes ONE
   frozen row in an existing table: a pool, a registry row, a routing section, a
   chronicler section, a rumor phrase. That is the estate's mechanical
   kind-registration protocol — exactly what the registration-only category
   exists to describe.
2. **The cost is per-DESK, not per-kind, and the desk is already open.**
   `disavowed_by_succession` and `succession_question_opened` both route
   `section: 'trade'` with `KIND_SECTION 'courts'` (executed, §12a).
   `reaffirmed` is the third kind at that same desk. It buys no new desk; it
   re-spends the same five files, because the estate's registration protocol is
   per-file, not per-desk-opening.
3. **The alternative delivers something the design did not ask for.** A
   `section: null` dossier line fits with no override, but the corpus block's own
   heading is *"the honor beat, answered aloud"* — a **beat**, not a dossier
   line. Rendering it as a dossier line would leave the docket the world already
   opened (`succession_question_opened`, landed) with no closing beat in the
   feed, which is precisely the silence this packet exists to end.
4. **`12 → 13` is one file, and it is a TEST file** —
   `treatySuccessionOpeningVoice.test.js`, which must be amended because it holds
   the landed pin asserting the very absence this packet removes (CR-GR4B-19).
   Refusing the override would mean landing the beat while leaving a pin whose
   title contradicts it.
5. **Every other row is inside budget with headroom** (§3).

⛔ A **fourteenth** handwritten file, a **sixth** registration file, a **second**
kind, a ninth acceptance title, or an inherited override is a STOP, not a further
override.

### CR-GR4B-18 — the beat mounts at the store-side dismiss transition (CHAIR GATE)

Ruled in full, with its evidence, at §5.2-§5.3. In one sentence: the beat is
minted **once, at the pending→dismissed transition, inside the store's existing
single-producer `set()`**, and **no new persisted key is written**, because
exactly-once is supplied structurally by the transition's compare-and-set rather
than derived from a timestamp.

### CR-GR4B-19 — the landed silence pin is RE-ADDRESSED, never deleted

`tests/domain/treatySuccessionOpeningVoice.test.js:310` carries the title
*"apply, dismiss, expiry, overflow, undo, and replay never mint terminal or
duplicate opening voice"*. Its assertions exercise only the **treaty-stage
resolver**, so a store-side dismiss beat leaves them **green while making the
title false** — a live vacuity, not a red.

⛔ The cure is **in place and census-neutral**: re-word that one title to name the
surface it actually guards, and **widen the same case's assertions** so the
dismiss leg asserts the store emitted exactly one `reaffirmed` entry. Registering
a ninth title in that file is a STOP. **VERIFIED**: the title is not banked in
`scripts/.test-ratchet-baseline.json` or any other baseline (executed grep,
§12a), so re-wording moves no census identity, and the lighting census counts
titles rather than their text.

---

## 2. Outcome and boundary

**Observable result:** when a DM dismisses a pending succession question — the
answer the world reads as HONOR, spoken aloud rather than left to lapse — the
feed gains exactly one public `reaffirmed` beat naming both courts, the fallen
holder, and the recorded reason. The docket the world opened at
`succession_question_opened` now closes there.

The proposal status write is mechanics and the beat is presentation. Missing
presentation data suppresses the beat and must **never** veto, alter, delay, or
rewrite the dismissal: an unaddressable dismissal is still a dismissal.

**Definition of done:** the exact thirteen paths pass A1-A8; no hot file is
touched; the receipt-pool registry moves by exactly one row and the routing
census by exactly one key; the whole lighting census becomes exactly
`2416/365/2051/20016/5642` **at the train terminal**; the runtime denominator
moves by exactly eleven; the `title=` census stays exactly `485`; all four
deep-craft kill-list ceilings stay exact; the `wizardNewsAuthoring` ledger stays
at or below 19 rows with no new row; eight disposable mutants fail by their
intended A-title and restore digest-exact; the sealed checks exit zero; and the
train terminal's bare full gate and separate boot smoke exit zero. No soak
starts.

In scope:

1. one pure `worldPulse` composer leaf that also owns the transition wrapper;
2. one store-side thread of that leaf's news into the existing feed;
3. one seven-family annex-verbatim `notable` grammar kind and its **five**
   mechanical registration homes;
4. one eight-case prevention file, the re-addressed silence pin, and the three
   already-governed walkers this necessarily updates.

Explicit non-goals:

- ⛔ **no new persisted key, state family, schema, or migration** — in
  particular no `dismissedTick`, no `reaffirmedAt`, and no `adjudicatedBy` on the
  dismiss road;
- no `honored_by_silence`, no expiry voice, no ring-overflow voice, no undo
  retraction, no lapse/`superseded` voice, no `repudiated` (GR-4b-β), no
  `credibility_charge` (GR-4c's);
- no new flag, tuning key, dependency, golden, baseline, ceiling, timeout,
  preset, icon, or route;
- no edit to `treatySuccessionDecision.js`, `treatySuccessionOpeningVoice.js`,
  `treatySuccessionVoice.js`, `treatyBreach.js`, `actorMajorApproval.js`,
  `peaceTerms.js`, `applyWorldPulse.js`, `worldState.js`, `src/pdf/**`, any
  terminal packet, or the receipt annex;
- no mutation-manifest, hazard-registry, coupling-registry, observed-shape
  baseline, size-baseline, test-ratchet, voice-mechanics-baseline,
  kill-list-ceiling, title-baseline, or pulse-stage edit;
- no UI mount and no `.jsx` file of any kind;
- no diagnostic, weekly, release, or research soak.

### 2.2 ⚠ THE FLAG CONJUNCTION — argued, not claimed absent

`GR-4B.md` §3.7 spent a section proving GR-4b added **no** new gate and **no**
new conjunction. **This packet cannot make that claim and does not.**

**VERIFIED** at this base: the docket exists only when
`routineMajorApprovalEnabled(simulationRules)` **and** `oathHolderActive(worldState)`
(`treatySuccessionDecision.js:145-148`; absent `routineMajorApproval` it delegates
verbatim to `answerSuccessionQuestions`, pinned at
`tests/domain/treatySuccessionApproval.test.js:173`), and `advanceTreaties`
itself is gated on `peaceCausalActive` (`peaceTerms.js:302`).

⇒ **`reaffirmed` is reachable only in a `peaceCausal` ∧ `oathHolder` ∧
`routineMajorApproval` world.** The argument that this is acceptable:

1. **This packet mints zero flags and reads zero flags.** The leaf contains no
   flag spelling at all. The conjunction is inherited whole from GR-4d's landed
   docket — the beat cannot be more reachable than the row it narrates, and it
   must not be less.
2. **Reading a flag in the composer would be the defect.** A presentation leaf
   that re-tested the gates would fork the reachability decision into a second
   home. The leaf's only gate is "does a validated pending succession-question
   row exist and is it transitioning to dismissed" — which is *already* the
   conjunction, expressed once, by the writer.
3. **Dark-mode dormancy is therefore free and is pinned** (A3): with any of the
   three gates absent or false, no pending succession row exists, the leaf is
   never reached, and the feed is byte-identical to the same world at base.

⚠ **The noise objection is re-measured, not inherited.** `GR-4B.md:225` and
`:1014` parked `reaffirmed` as *"a second, noisier behavior family"* against
`MAX_MECHANICAL_OUTCOMES_PER_PULSE = 8` and `FEED_CAP = 240` (`GR-4B.md:292`).
Measured at this base, the volume is far tighter than feared: a beat fires only
per **above-band DISAVOW-scored** question (`treatySuccession.js:90`
`DISAVOW_ABOVE: 0.5`, applied at `:200`; `treatySuccessionDecision.js:152`
`continue`s on `answer !== 'disavow'`) that a DM **actually dismissed** — one
beat per deliberate human click, never one per honored succession. ⭐ **A
DM-click-rate producer cannot flood a per-pulse mechanical cap**: the cap governs
mechanical outcomes inside one pulse, and this beat is minted between pulses. A8
asserts the beat count equals the dismissal count exactly.

---

## 3. Hard scope and line budgets

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | **`0`** |
| New persisted keys | **`0`** |
| New state writers | `0` — the proposal-status write stays in the store's existing single-producer `set()`; `wizardNews` is already written in this exact file at three sites |
| New feature flags / tuning keys | `0 / 0` |
| New public feed kinds | `1` — `impactKind: 'reaffirmed'` |
| New grammar registry rows | `1` |
| User-facing surfaces | `1` — the Herald/chronicle feed |
| Direct production consumers | `1` — `runDismissWorldPulseProposal` |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files modified | `1` — `campaignWorldPulseDeferred.js` |
| Registration-only production files | **`5`** under CR-GR4B-17 |
| Handwritten implementation files total | exactly **`13`** under CR-GR4B-17 |
| New/changed effective production lines | `<=150` |
| `treatySuccessionReaffirmedVoice.js` | `<=105` effective and `<=165` raw |
| `campaignWorldPulseDeferred.js` delta | `<=12` effective (`692 → <=704`, ceiling `800`) |
| `grammarReceiptPools.js` delta | `<=12` effective (`103 → <=115`) |
| `grammarNews.js` delta | `<=8` effective (`115 → <=123`) |
| `heraldRouting.js` delta | `<=2` effective (`266 → <=268`) |
| `chroniclersLetter.js` delta | `<=2` effective (`219 → <=221`) |
| `settlementRumors.js` delta | `<=2` effective (`507 → <=509`) |
| Acceptance cases | exactly `8` literal `it` registrations |

Comments that repair now-stale local counts or deferral prose inside one of the
thirteen paths are permitted and required for coherence. They authorize no new
path and no effective-line overrun.

---

## 4. Verified tree contract and fingerprints

### 4.1 Existing target seals

Both CREATE paths are absent (executed, §12a). Every existing implementation
target is clean at this exact raw/effective count and SHA-256. **Effective counts
were taken with eslint's own `Linter` under `max-lines`
`{ skipBlankLines: true, skipComments: true }` at this base — never `wc -l`,
never an inherited figure, never a delegated one** (§12a quotes the command).

| Path | Effective / raw | SHA-256 |
|---|---:|---|
| `src/domain/worldPulse/grammarReceiptPools.js` | `103 / 170` | `dcd36e08aac8966d5ee672943f79a04eb94557cecf1c892ebfc3359e81e6eefb` |
| `src/domain/worldPulse/grammarNews.js` | `115 / 256` | `8aa1ed496d0ac1ab4ed561eaa5ab0d0cd814b9566c51f6b575203d5af13191c7` |
| `src/domain/realm/heraldRouting.js` | `266 / 625` | `79e2568c1b506093d47f372bd470b01e0b0e352ff0f37b757e7f2497678da72d` |
| `src/domain/display/chroniclersLetter.js` | `219 / 415` | `a7a041a4781c3687a506bc3e5da8ae495115c4e707a0e5148471c136ac8dd28f` |
| `src/domain/display/settlementRumors.js` | `507 / 880` | `2b7d72ab413a3dae1b2e5be9be13bc9a306f6340734c98da2c3be1cd4d71937b` |
| `src/store/campaignWorldPulseDeferred.js` | `692 / 1103` | `4c8383035181dc95f8ba341fa8b72d31dea6b785f42b23b58201cd6e382ee2b0` |
| `tests/domain/treatySuccessionOpeningVoice.test.js` | `391 / 427` | `33b71078f0c1bb4f7b86276e72665a59738d8f640730d70883d6b33f8409c7c5` |
| `tests/domain/impactKindWalkers.test.js` | — | re-seal at P2 |
| `tests/lint/grammarLifecycleKindPools.walker.test.js` | `213 / 344` | `a1254fc01570ba70bf475aea5e190937806b383980bceed72235419a81f7b50a` |
| `tests/lint/kindPoolFloors.walker.test.js` | `183 / 324` | `e440d4fe389eb3d4fcc2cf398c7216f6982a931375de6ce6592bc0a760a36ac8` |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | `1336 / 4405` | `e085e2f962add7300220db952728c1934effbc5ddb2b5867bbbc6988b2220cb5` |

Anchor seals — read, never edited:

```text
0beee51479b0ffa22f4448506dca6cb85ab7f37b957a42acf1827c81e961520e  docs/content/RECEIPT_POOLS_GRAMMAR.md  (⚠ RE-SEALED AT P2 — W1 edits it)
c9cad6ffda48aec04ab3966bad085783ed21fb8f9f75f73b27353a60d468556d  src/domain/worldPulse/treatySuccessionDecision.js
67a38dd4a289a79dc4355f956828a25f6a1ce37a80cdcfb4de93727a30ee5450  src/domain/worldPulse/treatySuccessionOpeningVoice.js
1cf685802bedb8128adc57b37d84c1332922f15585bf56e0624321f4320649ff  src/domain/worldPulse/treatySuccessionVoice.js
d6b7e3b14ba98ce7806ffd83a06f0e30d0f7c8ed6e784d0f77e08a2bce7ec858  src/domain/worldPulse/actorMajorApproval.js
3e7af9f1da57ef6ec8ff4edb82bec37e1369bca117b3488d6e055f36448d8b24  src/domain/worldPulse/oathHolder.js
5d48a8b434a78739ce5954468f2446cd0d4f4be034d44d18978781016b58567e  src/domain/worldPulse/treatyOrientation.js
087ed97c432e2e4f8d832fff9c4b351af46064c03cd0b978e7d943447f63d084  src/domain/worldPulse/treatyEnforcement.js
cd15da4a74a8c8f04a9f42fff9b4064e72c44bc2d4fd6b6fb660f7ab41640885  src/domain/worldPulse/peaceTerms.js
```

Any mismatch, existing CREATE target, target dirt, or new foreign movement is a
dispatch STOP.

### 4.2 Required live symbols

| Symbol | Home | Role |
|---|---|---|
| `successionQuestionPayloadTuple` | `worldPulse/treatySuccessionDecision.js` | the closed outcome validator — the only admissible projection |
| `isSuccessionDisavowable` | `worldPulse/treatySuccession.js` | ⭐ **the exported eligibility predicate** — the liveness gate (§6 step 6) |
| `swornPartiesOf` | `worldPulse/oathHolder.js` | the total oath-stamp reader — the only source of `{npc}` |
| `treatyOrientationOf` | `worldPulse/treatyOrientation.js` | the one orientation reader, for both persisted court names |
| `treatyLedgerOf` | `worldPulse/treatyEnforcement.js` | the canonical treaty ledger reader |
| `grammarReceipt` | `worldPulse/grammarNews.js` | the seeded picker |
| `stablePart` | `worldPulse/stablePart.js` | ⛔ the `worldPulse` one, never `region/graph.js`'s same-named twin |
| `updateProposalStatus` | `worldPulse/worldState.js` | the existing status writer, called by the new wrapper — **unchanged** |
| `appendWizardNewsEntries` | `region/wizardNews.js` | the canonical feed append; ⭐ dedupes by entry `id` |

Required created production symbol: `dismissSuccessionQuestionWithVoice`.
Retired symbols: **NONE**.

### 4.3 Hot files — measured, and none is in the manifest

Measured at this exact base with eslint's own `Linter`, because the standard
requires an executed figure whenever a hot file could enter a manifest:

| File | Effective | Ceiling | Headroom | In this manifest |
|---|---:|---:|---:|---|
| `src/components/OutputContainer.jsx` | `599` | `600` | `1` | no |
| `src/domain/worldPulse/peaceTerms.js` | `797` | `800` | `3` | no |
| `src/domain/worldPulse/informationStatecraft.js` | `780` | `800` | `20` | no |

⭐ **Mounting store-side is what keeps `peaceTerms.js` out of this manifest.** The
treaty-stage alternative (§5.3) would have put a three-line-headroom hot file in
the change set.

**VERIFIED**: no manifest path carries a `scripts/.size-baseline.json` entry, and
none is added (executed, §12a). `campaignWorldPulseDeferred.js` sits under the
`src/store/**` layer ceiling of `800` at `692` (headroom `108`); the new leaf sits
under the `src/domain/**/*.js` ceiling of `800`.

### 4.4 Live and post-change census

All live figures executed at this base (§12a).

| Census | Live | Required post-change |
|---|---:|---:|
| receipt-pool registry rows (`GRAMMAR_KIND_REGISTRY`) | `11` | `12` |
| `GRAMMAR_RECEIPTS` pools | `11` | `12` |
| grammar Herald rows (`GRAMMAR_HERALD_KINDS`) | `5` | `6` |
| explicitly routed kinds (`EXACT_SECTION`) | `377` | `378` |
| routed and registered | `103` | `104` |
| estate registered kinds (`kindPoolFloors` `ALL_ROWS`) | `110` | `111` |
| registered minus routed-and-registered | `7` | **`7`** |
| deliberately unvoiced tokens | `274` | `274` |
| underfloor kinds (frozen backlog) | `28` | `28` |
| `REGISTRIES` | `9` | **`9`** |
| `title=` census (`TITLE_BASELINE`) | `485` | `485` |
| observed-shape reader findings | `1998` | `1998` |
| `wizardNewsAuthoring` ledger rows | `<=19` | `<=19`, **no new row** |

⭐ **`reaffirmed` carries a desk, so `REGISTERED_KIND_COUNT` and `ROUTED_TOKENS`
MOVE TOGETHER and the registered-minus-routed identity STAYS AT 7.** This is the
opposite of GR-4b-iii-b, whose `section: null` row moved the first without the
second and pushed the identity `6 → 7`. ⛔ A packet that copied iii-b's arithmetic
would predict `8` and red the walker.

The three `test.each(GRAMMAR_KIND_REGISTRY)` sites in
`grammarLifecycleKindPools.walker.test.js` add three runtime cases per registry
row — measured at this base as `42` tests over `11` rows, becoming `45` over
`12`. The new acceptance file adds eight literal cases. `impactKindWalkers.test.js`
(`4`) and `kindPoolFloors.walker.test.js` (`12`) gain zero: their new rows sit
inside existing loops. **The runtime denominator therefore moves exactly
`28021 → 28032`**; the frozen known-failure ceiling remains `16`.

**The whole lighting tuple moves exactly — AT THE TRAIN TERMINAL, NOT AT I2:**

```text
files / parked / credited / test titles / suite titles
2415 / 365 / 2050 / 20008 / 5641
2416 / 365 / 2051 / 20016 / 5642
```

Exactly `+1` file, `+0` parked, `+1` credited, `+8` test titles, `+1` suite title.
The new file has one literal `describe` and eight literal top-level `it` calls.
⛔ `.each`, looped or conditional registration, nested describes, `skip`, and
`todo` are forbidden. ⭐ The `treatySuccessionOpeningVoice.test.js` amendment is
**census-neutral** (CR-GR4B-19): one title re-worded, assertions widened, count
unchanged at `8`.

---

## 5. The producer contract — and the blockers, confronted

### 5.1 What the record carries, and what it does not

**Carried (VERIFIED at this base).** On the dismissed row: the complete
`SuccessionQuestion` (`treatyKey, settlementId, otherId, npcId, cause, kind,
answer, severity01, pressure01` — `treatySuccessionDecision.js:15`), `openedTick`
(`:74`), the exact terminal map (validated at `:84-86`, written at `:126`),
`status: 'dismissed'`, and `dismissedAt`. From the live ledger at fire time: both
court names (`treatyOrientationOf`) and the fallen holder's persisted name
(`swornPartiesOf`), by the reader path proven total for this exact shape at
`treatySuccessionOpeningVoice.js:50-67`.

⭐ **The dismissal is genuinely distinguishable from silence.**
`SUCCESSION_QUESTION_TERMINALS = Object.freeze({ applied: 'disavow',
dismissed: 'honor', expired: 'honor' })` (`actorMajorApproval.js:60`) types both
honor terminals, and `status` separates them. This is exactly the distinction
`GR-4B.md` §3.3 said did not exist and D2 re-filed here (`GR-4B.md:1028`).
**That premise is now satisfied**, and it is the corrected pool's spine
(`reaffirmed` v6: *"The question is closed by an answer and not by a lapse, and
the record keeps the difference."*).

**NOT carried (VERIFIED).** No world tick on the terminal. **No `adjudicatedBy`**
— the apply road writes one when supplied (`applyWorldPulse.js:1275`), the
dismiss road writes only `{ dismissedAt }`
(`campaignWorldPulseDeferred.js:1075`), so *who* said it aloud is unrecorded. No
words spoken, no place, no successor name, no duration. **W1's corrected corpus
asserts none of these** — which is why W1 precedes W2.

### 5.2 ⛔⛔ BLOCKER B2 CONFRONTED — the world-tick and exactly-once law for a dismiss beat

Lane II-R's B2 states: *no terminal carries a world tick, so exactly-once is not
derivable.* **That is true, and it does not bind this packet.** The reason is that
B2 is a property of a **re-derived** producer, not of a **transition-site** one.

**The distinction, stated exactly.** A producer mounted at `advanceTreaties` runs
**every tick** and must answer "have I already spoken about this row?" from the
row itself. That question needs a persisted discriminator, and II-R correctly
proved all three candidates fail: `p.tick + HOLD` is a function of advance
composition, not the record (`actorMajorApproval.js:141-147` against
`advanceInterval.js:455,472`); `expiredAt === now` repeats for every remaining
tick of an advance because `advanceInterval.js:469` passes **one `now` for the
whole advance**; `dismissedAt === now` never matches any tick's `now` at all. A
producer mounted **at the transition** never asks that question, because it runs
exactly when the transition runs.

**Exactly-once here is STRUCTURAL, in three independent layers — each VERIFIED:**

1. **The compare-and-set.** `campaignWorldPulseDeferred.js:1069`:
   `if (!currentProposal || currentProposal.status !== 'pending') return;` — inside
   the single `set()` producer, before any write. A delayed click, a second
   concurrent invocation, or an already-terminal proposal is a **no-op**. The
   pending→dismissed transition therefore occurs **at most once per proposal id**,
   and the source's own docblock says so: *"none may rewrite the authoritative
   terminal decision or its timestamp."*
2. **`dismissed` is terminal in the store.** **VERIFIED by grep**: no code path
   anywhere in `src/store/` transitions a proposal **out of** `dismissed`. The one
   undo path, `runUndoLastProposalApply` (`campaignWorldPulseDeferred.js:707`),
   returns only `applied → pending` — pinned at
   `treatySuccessionOpeningVoice.test.js:324`. So the CAS cannot be re-armed.
3. **The feed dedupes by id.** `appendWizardNewsEntries`
   (`region/wizardNews.js:840-848`) builds `new Map(entries.map(e => [e.id, e]))`
   and `byId.set`s each incoming entry. Two entries with one id collapse to one.

⇒ **No persisted key is owed.** ⛔ A `dismissedTick` would be a new persisted key,
a scope-budget row GR-4b deliberately spent at zero (`GR-4B.md:230`), **and** an
OSR schema-mint question this packet has no authority to answer.

**⚠ THE HONEST CAVEAT, RECORDED RATHER THAN GLOSSED.** The beat stamps
`tick: worldState.tick` — the tick the world last advanced to, read from the
normalized persisted field (`ensureWorldState`:
`const tick = Math.max(0, Math.floor(finite(raw?.tick, 0)))`). This is **a stamp
for feed ordering, not a derivation key**: nothing ever reads it back to decide
whether the beat should fire. It is honest because the DM acts *between*
advances, so the world genuinely is standing on that tick when the answer is
given — and the corrected corpus asserts **no** date, duration, or moment, so no
authored line depends on it.

⛔ **THE BOUNDARY THIS DRAWS, AND IT IS LOAD-BEARING FOR THE NEXT WAVE.** The
moment any future wave wants to **re-derive** this beat from state — a replay, a
migration backfill, a repair pass, or `honored_by_silence`'s expiry road — the
structural guarantee evaporates and the persisted key becomes owed. `expiry` has
**no** transition-site CAS (`expireStaleActorMajors` maps over every actor-major
inside the kernel's bootstrap stage, where no news accumulator exists until
`pulseKernel.js:1483`), which is exactly why `honored_by_silence` is **not** a
member of this train.

### 5.3 ⛔⛔ BLOCKER B3 CONFRONTED — where the voice mounts

**B3:** *dismiss has no news channel at all; the writer is `src/store/`, between
ticks.* **This is ordinary implementation with an exact landed mirror.**

**The mirror, VERIFIED.** `runApplyWorldPulseProposal` already does precisely this
shape: it `await import`s a domain function, calls it inside the `set()` producer,
and assigns the returned feed (`campaignWorldPulseDeferred.js:841`:
`campaign.wizardNews = result.wizardNews`). W2 mirrors it with
`appendWizardNewsEntries`, which is the canonical append and is already imported
in this file's module graph (`region/index.js`, line 25).

**Alternatives written down before choosing, per the design-record rule:**

| Mount | Verdict | Why |
|---|---|---|
| **A — store-side transition wrapper** (chosen) | ✅ | Exactly-once structural (§5.2); no new persisted key; no hot file; the leaf stays pure and testable; the store change is one call plus one append |
| **B — treaty stage (`advanceTreaties`)** | ⛔ REFUSED | Needs a persisted `dismissedTick` ⇒ scope-budget row **and** OSR schema mint; puts `peaceTerms.js` (3 lines headroom) in the manifest; and re-derivation means the beat fires on the *next advance*, so a DM who dismisses and never advances again never hears the answer |
| **C — `pulseKernel` bootstrap stage** | ⛔ REFUSED | No news accumulator exists at that stage (`pulseKernel.js:302` vs the first news channel at `:1483`); same persisted-key cost as B |

⛔ **The leaf holds no writer of its own.** It calls the existing
`updateProposalStatus` and returns a new `worldState` plus `newsEntries`; the
store remains the single producer of the campaign mutation, inside its existing
`set()`. `PACKET_STANDARD.md`'s "exactly one named writer **per state**" is
satisfied: proposal status keeps its one writer, and `wizardNews` keeps its
existing store-side writer (already three sites in this file).

---

## 6. Exact behavior and identity contract

Create the `worldPulse`-owned leaf
`src/domain/worldPulse/treatySuccessionReaffirmedVoice.js`. It exports:

```js
dismissSuccessionQuestionWithVoice(worldState, proposalId, tick, now)
```

returning `{ worldState, newsEntries }` — **`newsEntries` is always an array,
never null and never absent.**

Exact order. Any step's failure yields `newsEntries: []` and **never** vetoes,
delays, or alters the status write:

1. Read `worldState.proposals` when it is an array; otherwise return
   `{ worldState, newsEntries: [] }` with the **caller's own reference**.
2. Find the row by `proposal.id === proposalId`. Absent ⇒ unchanged reference,
   `[]`.
3. ⛔ **THE CAS, and it is the exactly-once guard.** Require
   `row.status === 'pending'` **exactly**. Anything else ⇒ unchanged reference,
   `[]`, **and no status write**. This mirrors the store's own guard and is
   asserted directly (A4).
4. `next = updateProposalStatus(worldState, proposalId, 'dismissed', { dismissedAt: now })`.
   ⛔ Byte-identical to today's call — same function, same patch object, same
   argument order.
5. Validate `row.outcome` through `successionQuestionPayloadTuple`. Not a
   succession question ⇒ `{ worldState: next, newsEntries: [] }`. ⭐ **The status
   write still happened**: an ordinary actor-major dismissal is byte-identical to
   base, which A4 pins.
6. ⭐ **THE LIVENESS GATE.** Read the treaty from
   `treatyLedgerOf(next)[question.treatyKey]`; absent or non-record ⇒ `[]`. Then
   require
   `isSuccessionDisavowable(treaty, question.settlementId, question.npcId, tick)`.
   **This one exported predicate supplies the whole honesty warrant for the
   corrected corpus's "the oath stands"**: it refuses a repudiation-breached
   record, refuses `complianceState === 'defaulted'`, requires at least one
   **live** term, and requires the acting court's `sworn` stamp to name the exact
   `npcId` (`treatySuccession.js:155-172`). ⛔ Do not re-implement any of its four
   checks — a second spelling of the eligibility rule is a STOP.
7. Resolve both persisted court names through `treatyOrientationOf(treaty)`;
   require `orientation.resolved` and
   `question.settlementId !== question.otherId`. An id echoed back as a name is
   unresolved and yields `[]`.
8. Resolve the fallen holder **only** through the selected treaty's total reader:

   ```js
   swornPartiesOf(treaty).find(
     (stamp) => stamp.settlementId === question.settlementId
       && stamp.npcId === question.npcId,
   )
   ```

   ⛔ No successor, ruler, standings, or roster lookup. ⛔ **The leaf must not
   contain the dotted roster token even in a comment**
   (`roadsParticipation.test.js` shells out to grep with exact set equality over
   this directory). ⛔ **It must not name the treaty-ledger write even in a
   comment** (`oathStampTotality.walker.test.js` matches inside comments).
9. Require a non-empty `outcome.reasons` array — **the recorded reason, read back
   off the row** rather than re-spelled here (news address law, part 4). Empty ⇒
   `[]`. ⚠ A producer shipping empty `reasons` passes every walker and then
   collides with its own siblings under the feed's repeat suppression.
10. Compose through
    `grammarReceipt('reaffirmed', outcomeId, { settlement, counterpart, npc })`
    with **no `context` argument**. The validated outcome ID is the seed;
    `grammarReceipt` namespaces every seed by kind, so this pool's pick is
    independent of the opening beat's pick on the same identity. ⛔ Court-pair,
    NPC, question-key-truncation, tick-only, and array-index seeds are forbidden.
    A null receipt ⇒ `[]`.
11. Return exactly one entry:

    ```js
    {
      id: `wizard_news.${tick}.reaffirmed.${stablePart(outcomeId)}`,
      kind: 'reaffirmed',
      impactKind: 'reaffirmed',   // ⛔ LITERAL, never a constant — the
                                  // SINGLE_PRODUCER_KEYS walker pins tokens to
                                  // one producer, so a shared constant would
                                  // inherit another desk in silence
      significance: receipt.significance,
      severity: 0.56,             // the landed `notable` GR pair, copied from
      score: 58,                  // treatySuccessionOpeningVoice.js:79-80 rather
                                  // than re-deriving a second weight spelling
      tick,
      scope: 'regional',
      headline: `${settlementName}'s new seat keeps the oath sworn to ${counterpartName}`,
      summary: receipt.line,
      reasons,
      settlementIds: [question.settlementId, question.otherId],
      settlementNames: [settlementName, counterpartName],
      parties,
      ending: 'reaffirmed',
      familyId: receipt.familyId,
      audience: receipt.audience,
      section: receipt.section,
      tags: ['world_pulse', 'pact_grammar', 'lifecycle'],
    }
    ```

    ⛔ `id`, `settlementIds` and `severity` are **mandatory** — an id-less entry is
    silently dropped by `normalizeEntry` from **both** the feed and the audit
    receipt, and a missing field adds a `wizardNewsAuthoring` debt row against a
    shrink-only 19-row ceiling.
12. `parties` comes from the treaty's own `parties` array and must contain both
    ids; otherwise `[]`. Use **no** locale operation, draw, clock, `Date`, or
    `Math.random`. The leaf mutates nothing.

### 6.1 The store thread

Inside `runDismissWorldPulseProposal`'s existing `set()` producer, replace the
direct `updateProposalStatus` call with the new leaf and append its news:

- add the leaf to the function's **existing** `await import(...)` prelude
  (it already dynamically imports `../lib/pulseFingerprint.js`), mirroring
  `runApplyWorldPulseProposal`'s `Promise.all` shape. ⛔ **No new static import
  edge into the store's eager chunk**;
- re-check `isSessionCurrent()` and the advance/pause guards after the yield, as
  the existing code already does;
- inside `set()`: keep the CAS, call
  `dismissSuccessionQuestionWithVoice(ensureWorldState(campaign.worldState, campaign), proposalId, tick, now)`,
  assign `campaign.worldState = result.worldState`, and
  `campaign.wizardNews = appendWizardNewsEntries(campaign.wizardNews, result.newsEntries, { now })`;
- ⛔ **the `wizardNews` assignment is skipped entirely when `newsEntries` is
  empty**, so an ordinary actor-major dismissal produces a byte-identical campaign
  (A4);
- `dismissDecision`, the `track(...)` telemetry call, `campaign.updatedAt`, and
  `cacheCampaignState` keep their exact current behavior and order.

⭐ `tick` is read as `campaign.worldState.tick` **inside** the producer, from the
normalized field. It is never defaulted to a wall clock and never computed.

---

## 7. Exact thirteen-path implementation manifest

| # | Action | Path | Region | Max effective delta | Coding instruction |
|--:|---|---|---|---:|---|
| 1 | `CREATE` | `src/domain/worldPulse/treatySuccessionReaffirmedVoice.js` | composer + transition wrapper | `<=105` | Perform the pending→dismissed transition through the existing status writer and return zero-or-one fully addressed beat; mutate nothing |
| 2 | `MODIFY` | `src/store/campaignWorldPulseDeferred.js` | `runDismissWorldPulseProposal` | `<=12` | Route the status write through the new leaf and append its news to the existing feed; skip the append when empty |
| 3 | `REGISTER` | `src/domain/worldPulse/grammarReceiptPools.js` | `GRAMMAR_RECEIPTS` | `<=12` | Add the seven annex-verbatim families and correct the stale local pool count |
| 4 | `REGISTER` | `src/domain/worldPulse/grammarNews.js` | `GRAMMAR_KIND_REGISTRY` | `<=8` | Add one exact `notable`/`public`/`trade` row, no contexts, no party-role override |
| 5 | `REGISTER` | `src/domain/realm/heraldRouting.js` | `EXACT_SECTION` | `<=2` | One `reaffirmed: 'trade'` row; no `KIND_SECTION_DIVERGENCES` entry |
| 6 | `REGISTER` | `src/domain/display/chroniclersLetter.js` | `KIND_SECTION` | `<=2` | One `reaffirmed: 'courts'` row, matching both landed siblings |
| 7 | `REGISTER` | `src/domain/display/settlementRumors.js` | `WHAT_PHRASES` | `<=2` | One phrase for the new minted `impactKind` |
| 8 | `CREATE` | `tests/domain/treatySuccessionReaffirmedVoice.test.js` | one describe, A1-A8 | `n/a` | Exactly eight literal top-level `it` cases; no registration indirection |
| 9 | `TEST` | `tests/domain/treatySuccessionOpeningVoice.test.js` | the `:310` case only | `n/a` | CR-GR4B-19: re-word that one title to name the resolver, widen its dismiss leg to assert exactly one `reaffirmed` entry. ⛔ No ninth title |
| 10 | `TEST` | `tests/domain/impactKindWalkers.test.js` | `EXPECTED_VOICE` | `n/a` | One `reaffirmed: null` row, matching both landed GR siblings |
| 11 | `TEST` | `tests/lint/grammarLifecycleKindPools.walker.test.js` | `EXPECTED`, `GR4_KINDS`, exact counts | `n/a` | Move the pool census `11 → 12`, add the exact registry tuple and slot vectors, move the Herald count `5 → 6`; add no title |
| 12 | `TEST` | `tests/lint/kindPoolFloors.walker.test.js` | `REGISTERED_KIND_COUNT`, `ROUTED_TOKENS` | `n/a` | Move `110 → 111` **and** `377 → 378` **together**; the registered-minus-routed identity stays `7`; unvoiced `274` and underfloor `28` do not move; `REGISTRIES` stays `9`; no title motion |
| 13 | `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | whole `CENSUS` | `n/a` | ⚠ **AT THE TRAIN TERMINAL ONLY.** Re-derive whole and record exactly `2416/365/2051/20016/5642` |

Generated artifacts: **NONE**.

### 7b. Reservations and pairwise disjointness

W1 reserves exactly `docs/content/RECEIPT_POOLS_GRAMMAR.md`. W2 reserves the
thirteen paths above. **The intersection is empty** — W2 never edits the corpus
(preamble §P1). Under the train, members are promoted just-in-time inside the
chain, so at any exposed state there is at most one READY packet and the
validator's pairwise-disjointness rule is never reached.

---

## 8. Ordered coding sequence and preflight

Dispatch at `P2`, from inside the private ref:

```sh
npm run implementation:dispatch -- GR-4B-II-W2
```

The capsule must prove exact authority bytes, the preamble SHA-256, branch and
base ancestry to `I1`, both CREATE targets absent, every pre-existing target
hash, required-symbol evidence, clean targets, and the **re-taken** corpus hash.
Then:

1. Capture the three hot-file effective counts, the `title=` census, the four
   kill-list counts, both TypeScript ratchets, the observed-shape count, the
   `wizardNewsAuthoring` row count, the focused green predecessor tests, and the
   whole census.
2. Create the one test file with the exact eight titles below and establish the
   intended missing-behavior reds **without registering a ninth title**.
3. Add the seven-family corpus pool and the one grammar registry row.
4. Add the three routing/chronicle/rumor registration rows.
5. Implement the leaf: pure composer first, then the transition wrapper.
6. Thread the store: import, call, append.
7. Re-address the silence pin (CR-GR4B-19).
8. Update `impactKindWalkers` and the two governed kind-pool walkers, then run
   focused checks. ⛔ **Do not touch the lighting census walker** — that is the
   terminal's act.
9. Execute the eight disposable mutants outside the shared worktree, restore
   every target digest exactly, and rerun focused green.
10. Run the attached sealed runner once. ⛔ **Do not run the bare full gate or
    the boot smoke here** — under `DESIGN_BUILD_EFFICIENCY.md` §2.2 both move to
    the train terminal `T`. Do not start soak or adjacent work.

---

## 9. Acceptance matrix — exactly eight titles

All cases live under one literal describe title:
`GR-4b-ii-W2 — the reaffirmed voice`.

| ID | Exact `it` title | Required observation |
|---|---|---|
| A1 | `dismissing a validated succession question mints exactly one fully addressed beat` | One pending validated row on an eligible treaty yields exactly one entry whose `id`, `kind`, `impactKind`, `tick`, `settlementIds`, `settlementNames`, `parties`, `reasons`, `severity`, `audience` and `section` are all present and exact; the summary is an exact member of the seven corrected families; the treaty, ledger and oath stamp are byte-identical before and after. |
| A2 | `all seven annex-verbatim families and slot vectors are reachable` | Real outcome identities deterministically reach all seven corrected lines and exact slot vectors; `{npc}` resolves to the fallen holder on the acting court's `sworn` stamp; **no successor name**, no `{band}`, no digit, no residual token, **no em dash and no exclamation point** appears in any rendered line — asserted **directly**, because the four `voiceMechanics` arms are banked and would absorb a new tell. |
| A3 | `a dark mechanism leaves the store byte-identical` | With `routineMajorApproval` absent, declared false, and with the oath holder dark, and with `peaceCausal` dark, no pending succession row exists; dismissing any proposal produces a campaign whose `JSON.stringify` is byte-identical to the same world at base; `wizardNews` is untouched by reference. |
| A4 | `a non-succession, terminal, or duplicate dismissal writes status and mints nothing` | An ordinary actor-major proposal, an already-`dismissed` row, an `applied` row, an `expired` row, a malformed or truncated payload, a mismatched outcome identity, and a foreign `proposalPayload.kind` each mint zero beats; the ordinary dismissal's status write and campaign bytes are identical to base; the terminal rows are **not re-written** and their timestamps are unchanged; none throws. |
| A5 | `an ineligible or unaddressable instrument mints nothing, never a partial beat` | A pruned/absent ledger entry, a repudiation-breached record, `complianceState: 'defaulted'`, a treaty with zero live terms, an unresolved court name, an id echoed as a name, an absent or half-written oath stamp, a stamp naming a different `npcId`, and an empty `reasons` array each yield zero beats **while the dismissal still lands**. |
| A6 | `the transition fires at most once and the feed never doubles` | Dismissing the same proposal twice mints one beat and the second call is a total no-op; two distinct questions on one treaty mint two distinct beats; appending the same beat twice through the canonical feed append collapses to one entry by `id`. |
| A7 | `the leaf is byte-stable, draws nothing, writes nothing, and reads no clock` | Repeated and JSON-round-tripped worlds produce identical bytes; draw and clock sentinels remain zero; the leaf returns the **caller's own `worldState` reference** when nothing qualifies; no input is mutated; `tick` comes from `worldState.tick` and never from a wall clock. |
| A8 | `a real GR-4d docket dismissal reaches the feed and no other surface` | A real late-treaty-stage run inserts one pending proposal and emits the landed opening beat; the store's real `dismissWorldPulseProposal` then emits exactly one `reaffirmed` entry into `wizardNews`; the beat count equals the dismissal count; **replaying the treaty stage over the dismissed world still mints nothing** (the landed silence pin's surviving claim); the apply, expiry, overflow and undo roads remain silent. |

Assertions may loop inside a case. **Test registration may not.**

---

## 10. Mutation proof — eight controlled mutants

Per preamble §P6: eight disposable source mutants in an isolated immutable
candidate; no standing mutation-manifest row is owed.

| Mutant | Controlled change | Required conviction |
|---|---|---|
| M1 | suppress the entry return (return `[]` unconditionally) | A1 and/or A8 |
| M2 | replace the receipt seed with one constant | A2 |
| M3 | ⛔ **drop the `status === 'pending'` CAS** so a terminal row re-transitions | **A4 and A6** — the exactly-once guard is the packet's load-bearing claim and must be convicted by two independent cases |
| M4 | skip `successionQuestionPayloadTuple` and hand-walk the payload | A4 |
| M5 | drop the `isSuccessionDisavowable` gate | A5 |
| M6 | resolve `{npc}` from the first `sworn` stamp instead of the exact `settlementId`+`npcId` match | A2 and/or A5 |
| M7 | omit `id` from the composed entry (the silent-drop class) | A1 |
| M8 | let a failed composition veto or skip the status write | A5 |

⚠ **Anti-vacuity notes specific to this wave.** M3 must be planted in the **leaf's**
CAS, not the store's — the store's own guard would otherwise subsume it and the
mutant would pass 7/7 (the redundant-second-guard class). M7 must be checked
against the **feed**, not the composer's return value, because `normalizeEntry`
drops it silently downstream. A no-op plant, zero exit, wrong-title red, broad
crash, dirty-tree override, or non-exact restoration is a STOP. ⛔ Do not run the
estate-wide shared-tree sweep.

---

## 11. Wave-specific coupling, OSR, hazard, and gate obligations

Preamble §P4, §P5 and §P7 bind in full and are not restated. Only the additions:

- **Coupling.** The leaf's `treaty*.js` filename places it in the existing GRAMMAR
  layer; its decision, grammar, stable-id, oath, orientation, ledger and
  world-state imports are existing GRAMMAR/shared substrate. ⚠ **The one new edge
  worth naming is `src/store/ → src/domain/worldPulse/`, and it already exists**
  (`campaignWorldPulseDeferred.js:28` statically imports `worldState.js`; `:805`
  dynamically imports `applyWorldPulse.js`). `src/store/**` is outside the
  `couplingInclusion` layer table, so no layer pair is minted. Run
  `couplingInclusion.walker.test.js`.
- **OSR.** The leaf's per-identity ceiling is **zero**. It uses only
  `successionQuestionPayloadTuple`, `treatyLedgerOf`, `isSuccessionDisavowable`,
  `swornPartiesOf` and `treatyOrientationOf`. ⛔ The reads of `proposal.status`,
  `proposal.id`, `outcome.reasons` and `treaty.parties` follow the landed opening
  voice's exact spellings (`treatySuccessionOpeningVoice.js:68-73,112-113`), which
  are already clean at `1998`. **Any** new finding is repaired in the leaf or the
  packet STOPs.
- **HZ-WIZARDNEWSAUTHORING (wave-critical).** This packet mints a **new authoring
  site**. The composed entry carries `id`, `settlementIds` and `severity` (§6
  step 11), so the ledger stays at or below 19 with no new row. ⛔ Never raise the
  ceiling.
- **HZ-DISTBOOT.** The store's new edge is a **dynamic** import, mirroring the
  apply road, so the eager store chunk does not grow. ⚠ A dynamic import still
  mints a rollup chunk, so the **separate boot smoke at the train terminal is
  mandatory**, not optional.
- **HZ-BANKEDVOICE.** Asserted directly in A2, per preamble §P5.
- **HZ-TITLEBASELINE / HZ-KILLLIST.** Not reachable: no `.jsx` and no
  `src/components/**` path is in this manifest. Both are still re-measured before
  and after, because "not reachable" is a claim, not a receipt.
- **Sealed checks.** The structured manifest owns exactly **eight** executable
  children — packet validation; hazard-registry validation; pre-mortem
  validation; scoped ESLint over the exact thirteen paths; the mutexed
  direct/predecessor/contract battery (which must include
  `treatySuccessionOpeningVoice.test.js`, `treatySuccessionApproval.test.js`,
  `treatySuccessionVoice.test.js`, `successionQuestion.test.js`,
  `impactKindWalkers.test.js`, `guidanceRegistry.walker.test.js`,
  `deepCraftKillList.test.js`, `wizardNewsAuthoring.walker.test.js`,
  `treatyLifecycleVoiceDormancyFence.test.js` and `couplingInclusion.walker.test.js`
  alongside the manifest's own test files); full TypeScript ratchet;
  strict-domain TypeScript ratchet; observed-shape reader validation.
  ⚠ **The bare full gate and the boot smoke are NOT children of this packet** —
  they are the train terminal's, run once at `T` (`DESIGN_BUILD_EFFICIENCY.md`
  §2.2). This is the only structural difference from a standalone GR packet.

---

## 12. Completion receipt and STOP conditions

The implementer returns everything in preamble §P9's member list, plus:

- the exact CAS-mutant (M3) evidence, both convicting titles named;
- the `wizardNewsAuthoring` row count before and after;
- an explicit statement that **no persisted key was added**, evidenced by a diff
  of the proposal record's key set across the transition;
- an explicit statement that the lighting census walker was **not** edited;
- explicit statement: **no soak started**.

Stop and return to the chair on any of preamble §P8, plus:

- a **fourteenth** handwritten file, a **sixth** registration file, a ninth
  acceptance title, or an inherited override;
- any new persisted key on the proposal record — in particular `dismissedTick`,
  `reaffirmedAt`, or `adjudicatedBy`;
- the registered-minus-routed identity landing anywhere but **7**, or
  `ROUTED_TOKENS` and `REGISTERED_KIND_COUNT` failing to move **together**;
- a beat minted on any road but Dismiss, or a second beat on one dismissal;
- a failed composition that vetoes, delays, or alters the status write;
- an edit to the lighting census walker at `I2`;
- a `voiceMechanics` arm changing status in either direction;
- any soak, tuning, deploy, push, or migration work.

This packet ends when the `reaffirmed` beat lands and its receipts are attached.
It does not continue into `honored_by_silence`, GR-4b-β, GR-5, or soak.

### 12a. Executed preflight receipts — 2026-08-14, base `d383aa3c`

Every figure above was measured in this drafting run. Commands and outputs are
quoted in `laneTC2-report.md`.

- `git rev-parse HEAD` → `d383aa3c3b4efb798f856505f7eb15e77b0c4d4b`;
  `git rev-parse --abbrev-ref HEAD` → `claude/composite-r4`;
  `git status --porcelain` printed nothing;
  `git diff --name-only 770167c5..HEAD` → four paths, all under `docs/`.
- `node scripts/implementation-packets.mjs validate` →
  `[implementation-packets] valid: 35 packets (0 READY)`, `TRUE_EXIT=0`.
- eslint `Linter` under `max-lines` `{skipBlankLines,skipComments}` → every
  effective/SHA-256 row in §4.1 and §4.3, `TRUE_EXIT=0`. Hot files:
  `peaceTerms.js 797`, `informationStatecraft.js 780`, `OutputContainer.jsx 599`
  — all three matching the capsule stamped at `770167c5`.
- `node scripts/check-observed-shape-readers.mjs` →
  `observed-shape readers: 1998 finding(s), exactly matching the frozen
  inventory.`, `TRUE_EXIT=0`.
- `npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` →
  `TRUE_EXIT=0`, `Test Files 1 passed (1) / Tests 33 passed (33)`, census
  `2415/365/2050/20008/5641`.
- `npx vitest run` over the five-file predecessor battery
  (`grammarLifecycleKindPools.walker`, `kindPoolFloors.walker`,
  `treatySuccessionOpeningVoice`, `treatySuccessionApproval`,
  `treatySuccessionVoice`) → `TRUE_EXIT=0`,
  `Test Files 5 passed (5) / Tests 88 passed (88)`.
- Per-file counts, each `TRUE_EXIT=0`:
  `grammarLifecycleKindPools.walker` `42`, `impactKindWalkers` `4`,
  `kindPoolFloors.walker` `12`, `treatySuccessionOpeningVoice` `8`.
- Live registry figures, executed against the real modules:
  `GRAMMAR_KIND_REGISTRY 11`, `EXACT_SECTION 377`, `GRAMMAR_HERALD_KINDS 5`,
  `GRAMMAR_RECEIPTS 11`, `KIND_SECTION_DIVERGENCES 9`;
  `disavowed_by_succession` and `succession_question_opened` both
  `section='trade'`, `EXACT_SECTION='trade'`.
- `grep -rn "honored_by_silence" src/ tests/ scripts/` → **zero hits**;
  `grep -rn "\breaffirmed\b" src/ tests/` → one unrelated comment at
  `generosityKernel.js:109`. Neither kind is registered anywhere.
- `grep -rn "never mint terminal or duplicate opening voice" tests/ scripts/ *.json`
  → one hit, the test title itself. **The title is not banked in any baseline.**
- `node -e` over `scripts/.size-baseline.json` → **no entry** for any manifest
  path.
- Both CREATE targets checked and **absent**.
- The exact `CLAIM_RE` and ±3-line `@enforced-by` window from
  `tests/docs/enforcement-claims.test.js` re-implemented and run over this packet
  draft, the preamble draft and the W1 annex draft → `NAKED: 0` on all three,
  `TRUE_EXIT=0`.

---

## 13. Executed landing receipt — 2026-08-14

**LANDED** as member **W2 of 2** of the `gr-4b-ii` train, the estate's first §28
train. Built by Lane TE2 on the private ref `refs/trains/gr-4b-ii`; the shared
branch ref moved once, by the chair's old-value CAS, only after the terminal's
bare full gate and separate boot smoke exited zero in-shell.

| Chain position | Commit | What it is |
|---|---|---|
| base | `d383aa3c3b4efb798f856505f7eb15e77b0c4d4b` | exposed, green |
| `I1` | `039f8380dbc4566d48b5faa8eef39813b6f42eb4` | W1, the A-23 / CR-GR4B-16 annex act (docs-only) |
| **`I2`** | **`b3602c15a2d2841b7ac999868502c23b113c09bc`** | **this packet's implementation** |
| `T` | `7b54c0385de3e82fc6b5042a4b2d9e047d731332` | train terminal: whole census, gate, smoke |

### 13.1 Per-member proof, executed

- **A1-A8: 8/8**, `TRUE_EXIT=0` — one literal `describe`, eight literal
  top-level `it`, no `.each`, no nested describe, no `skip`/`todo`.
- **Focused battery: `Test Files 21 passed (21) / Tests 270 passed (270)`,
  `TRUE_EXIT=0`**, covering every contract §11 names plus
  `negativeAssertionAnchor.walker`.
- **Mutants: 8/8 convicted** in an isolated candidate worktree with its own
  linked `node_modules`, each with bytes-changed proof and a digest-exact
  restore to `d1f9fe793cbe3b4ef9fe6adaf76adbfe25218197ab0e93328663d3af5d2b273f`;
  the restored tree re-ran green. ⭐ **M3** (the CAS drop) was convicted by
  **A4 and A6** — two independent cases, as §10 required, and the store's own
  guard cannot subsume it because both cases drive the leaf directly.
- **Both TypeScript ratchets at their exact floors**: `typecheck:ratchet`
  `173/173` (`tsconfig.full.json`) and `typecheck:domain:strict` `1134/1134`
  (`tsconfig.domain-strict.json`).
- **OSR exact at `1998`**, unmoved — the leaf's per-identity ceiling of zero held.
- **Scoped ESLint over the thirteen paths: clean, `TRUE_EXIT=0`, no output.**
- **Effective-line budgets, all held** (eslint's own `Linter` under `max-lines`
  `{skipBlankLines,skipComments}`): the new leaf `78 / 148` against `<=105/<=165`;
  `campaignWorldPulseDeferred.js` `700` against `<=704`; `grammarReceiptPools.js`
  `112` against `<=115`; `grammarNews.js` `118` against `<=123`;
  `heraldRouting.js` `268` against `<=268`; `chroniclersLetter.js` `220` against
  `<=221`; `settlementRumors.js` `508` against `<=509`.
- **No hot file was touched**: `OutputContainer.jsx` `599`, `peaceTerms.js` `797`,
  `informationStatecraft.js` `780`, all unmoved. `peaceTerms.js` is still
  byte-identical to its §4.1 anchor seal `cd15da4a…`, which is the measurable
  consequence of mounting store-side instead of at the treaty stage.
- **`wizardNewsAuthoring` ledger: 19 rows before and after**, no new row, ceiling
  untouched. **No baseline moved** — `.wizard-news-authoring-baseline.json`,
  `.size-baseline.json` and `.test-ratchet-baseline.json` were all clean.
- **No persisted key was added.** The transition routes through the same
  `updateProposalStatus` call with the same patch object; A3 and A4 prove it by
  byte-comparing the result against an independently computed
  `updateProposalStatus` output. No `dismissedTick`, `reaffirmedAt` or
  `adjudicatedBy`. **No soak started.**

### 13.2 The censuses, as landed

Both routing figures moved **together** and the identity held, exactly as §4.4
predicted and unlike GR-4b-iii-b's `section: null` row:

| Census | Live | Landed |
|---|---:|---:|
| `GRAMMAR_KIND_REGISTRY` rows | 11 | **12** |
| `GRAMMAR_RECEIPTS` pools | 11 | **12** |
| `GRAMMAR_HERALD_KINDS` | 5 | **6** |
| `EXACT_SECTION` (`ROUTED_TOKENS`) | 377 | **378** |
| `REGISTERED_KIND_COUNT` | 110 | **111** |
| registered − routed-and-registered | 7 | **7** |
| deliberately unvoiced tokens | 274 | **274** |
| `REGISTRIES` | 9 | **9** |
| `title=` census | 485 | **485** |

Whole lighting census, re-derived at the terminal `T` rather than here (§2.3 of
`DESIGN_BUILD_EFFICIENCY.md` makes the TRAIN the single non-terminal holder):
`2415/365/2050/20008/5641` → **`2416/365/2051/20016/5642`**. Runtime denominator
`28021` → **`28032`** (`+11` = this packet's eight literal titles plus three
`test.each(GRAMMAR_KIND_REGISTRY)` cases), frozen known failures held at **16**.

### 13.3 ⛔ CR-GR4B-19's §7 row 5 was DEFECTIVE, and the chair has ruled

Row 5 of the §7 manifest instructed *"no `KIND_SECTION_DIVERGENCES` entry"*. The
live code refutes it in two independent places:
`tests/lint/grammarLifecycleKindPools.walker.test.js` asserts
`KIND_SECTION_DIVERGENCES[kind]` is `'trade'` for **every** member of
`GRAMMAR_HERALD_KINDS`, and `src/domain/realm/heraldRouting.js` documents a
second walker pinning that table as the complete set of divergences from the
`KIND_SECTION` successor mapping. Because `reaffirmed` files `courts` in the
letter and `trade` at the Herald, omitting the row reds both walkers.

**RULED (chair, 2026-08-14): the walker is machine truth and the row-5
prohibition was the defect.** The landed implementation adds **both** rows to
`heraldRouting.js`. ⭐ No budget moved: that file is allowed `<=2` effective
lines and the two rows land it at exactly `268 = 266 + 2`, which is evidence the
two-row cost was always what the budget was sized for. Registration files stay
**5**, handwritten paths stay **13**, and no override was expanded.

### 13.4 The anchored-negative cure, and the one amended member commit

The terminal's first bare gate exited **1**, red at `test:ratchet` with two tests
outside the frozen census. Both were re-run at the base commit `d383aa3c` in a
separate worktree **before any repair** and both passed there
(`Tests 19 passed (19)`), so neither was pre-existing.

1. **`negativeAssertionAnchor.walker` — real, and cured.** The acceptance file
   carried **six un-anchored negative assertions**, and `tests/domain/**` is a
   swept tree held at an exact ceiling of zero that may not even take a frozen
   row. ⚠ **The marker's POSITION is the whole rule**: that walker's line scan
   reads only the assertion line or the one immediately above it, so a
   multi-line rationale whose last line lacks the marker does not count. Each of
   the six now carries a **single-line** `// anchored:` immediately above it,
   over a real liveness pin asserting the summary is a non-empty, terminally
   punctuated sentence — so each exclusion is read against a real sentence
   rather than an empty string.
2. **`implementationSession.test.js` — did not reproduce.** It passed on every
   direct re-run, at the base and at the tip, and inside the green gate that
   followed. No mechanism was confirmed, so it is recorded as **PLAUSIBLE**
   (an order- or concurrency-sensitive flake), never as CONFIRMED, and the
   chair's own verification watches for it.

⚠ **This member's implementation commit was AMENDED once, before any exposure**
(`e951448f` → `b3602c15`), because the first build carried that anchor red and
`DESIGN_BUILD_EFFICIENCY.md` §2.1 authorises only reds NAMED in the train plan
in advance. The private ref exists precisely so an unexposed member can be made
honest before exposure. After the cure the mutation proof was **re-executed in
full against the cured file — 8/8 convicted, restores digest-exact** — and the
21-file battery was executed so the commit's own claim is a receipt.

### 13.5 Terminal receipts (run once at `T`, per §2.2)

Run **bare**, never wrapped in `gate-mutex.sh --run`, with the exit captured
in-shell and no pipe on any gate read:

- **`npm run check:tail` → `TRUE_EXIT=0`**, and the gate's own tail line reads
  `exit: 0 (the gate's own status, not a pipe's)`. All 20 steps ran through
  `verify:dist`; none was blacked out by the `&&` chain. `test:ratchet` reported
  `no test regressions (16 known failure(s) of 28032 tests, ceiling 16)`; `lint`
  reported `28 problems (0 errors, 28 warnings)`, unmoved; `verify:dist` reported
  `STRICT DIST OK — 50 discovered/reported file(s), 403 test(s)`. Log SHA-256
  `7aa37c4fb4881c7614671618378029a7bbf616098b114f4e5c7869784e8ae54f`.
- **`npm run smoke:boot` → `TRUE_EXIT=0`**, `PASS — the built bundle boots`,
  `521/521` chunks initialised, 31,706-byte shell. Run **separately** because
  HZ-DISTBOOT is not subsumed by the full gate and this packet mints a new
  **dynamic** import edge into the store. Log SHA-256
  `d92b6e4bffeb6d1baa8ac6f401c8682a248164ee211e6909d1022785eefa306d`.

Full train receipt: Lane TE2's `laneTE2-train-receipt.md`. This packet is closed.
It does not continue into `honored_by_silence` (whose expiry road has no
transition site and therefore still owes the persisted key CR-GR4B-18 declined),
GR-4b-β, GR-5, or soak.
