# laneUICR — the three open chair rulings, re-verified at the live trees

**Lane:** UICR (read-only recon). Wrote nothing in the repo, moved no ref, touched no worktree.
**Date:** 2026-08-21. **Trees measured:** ledger `review-fixes-2026-07-08` @ `94f3aba8`;
build `claude/composite-r4` @ `f5332cf7`.

---

## ⛔⛔ HEADLINE — TWO OF THE THREE RULINGS ARE ALREADY RULED AND LANDED

The memory row "**3 chair rulings open**" is **STALE**. Measured at the build tip:

| # | Ruling | 08-11 state | **State at `f5332cf7`** |
|---|---|---|---|
| **A** | `stresses` — does class (b) admit a REGISTERED alias? | open | ⭐ **CLOSED — ruled YES, LANDED** (schema-6 mint) |
| **B** | `worldPulse on campaignState` — class (a) or (b)? | open | ⭐ **CLOSED — provisional (a) REFUTED, ruled (b), LANDED** |
| **C** | `eventLog` — leaf-name MERGING or EMPTY CONTAINER? | open | ⚠⚠ **STILL OPEN — 33 rows unmoved through three schema mints** |
| (H26) | bank-by-rule vs clear-outright | open | ⭐ **CLOSED — ruled BANK-BY-RULE, LANDED** (schema-7 mint) |

**Only Ruling C is genuinely awaiting the chair.** Sections 3–5 are the record for A/B/H26
(so a successor does not re-open them); **section 6 is the live one.**

---

## 1. ⚠⚠ THE TWO TREES HAVE DIVERGED — RULE AT THE BUILD TIP, NOT THE LEDGER TIP

`git merge-base --is-ancestor` in **both directions returns NO**; merge base is `4a9b6cf4`.
The OSR instrument's history **stops on the ledger branch**:

| | ledger `94f3aba8` | build `f5332cf7` |
|---|---|---|
| baseline schema | **4** | **8** |
| frozen | 2026-08-11 @ `1c295eca` | 2026-08-13 @ `3df85a3a` |
| total reads / identities | 2164 / 1499 | **1998 / 1412** |
| `EXPLAINED_WRITER_EXEMPTIONS` | ⛔ **absent** (0 occurrences) | present, 4 entries |
| newest detector commit | `894325ff` "Schema 4 minted (CODE HALF)" | `3df85a3a` AO-0 ← `d081feee` H26 ← `2fe94f77` schema 6 |

⚠ **The ledger branch's copy of the OSR instrument is stale by three mints.** Any ruling
read against `review-fixes-2026-07-08` will describe a world that no longer exists.
Cohort shrank **2164 → 1998 reads / 1499 → 1412 identities** across those mints.

---

## 2. ⛔ FINDING — THE NAMED TRIAGE ARTIFACTS NO LONGER EXIST

The memory row names `laneD-ui-cohort-triage.md`, `uicohort-ledger.json`, `uicohort-REPORT.md`
in session `c42c8924`'s scratchpad. **That scratchpad now contains ZERO regular files**
(`find … -type f` → `0`); only an empty `laneAA-base-caa6094a/node_modules` directory survives.
The `.claude` ledger/build branches carry no `uicohort*` artifact either — the only
cohort-named repo file is `tests/ui/uiCohortDisplayReaderRepairs.test.jsx`.

⭐ **RECOVERY PATH USED, AND IT WORKS.** The lane's 219 subagent transcripts survive at
`~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/c42c8924-…/subagents/*.jsonl`
(the scratchpad's `tasks/*.output` are symlinks into it). **Every quotation in this brief
below marked "Lane I" is recovered verbatim from `agent-a93343baa4193717f.jsonl` and
`agent-a8951b72d20578f74.jsonl`** — Lane I's SCHEMA-6 charter, which carried the three
rulings' measured answers. The dispatch briefs are in `agent-a5685353387152741.jsonl`.
Record this as the standing recovery route for any lost scratchpad deliverable.

---

## 3. RULING A — `stresses` registered alias · ⭐ CLOSED, RULED YES, LANDED

**The question as posed** (Lane I dispatch brief, verbatim):

> A. `stresses` — a REGISTERED alias: does the class-(b) "writer for that EXACT key" rule
> admit a registered alias? Find the alias registry/mechanism, quote it, and propose.

**Disposition: the chair ruled YES.** Live at `f5332cf7`,
`scripts/check-observed-shape-readers.mjs:1010-1020`:

```js
Object.freeze({
  identity: 'stresses on settlement',
  mechanism: 'admission-list',
  writer: 'src/domain/settlement.schema.js',
  ruling: 'CR-OSR-SCHEMA-6 / M8 — registered alias',
  why: 'A DECLARED historical alias in FIELD_ALIASES. normalizeSettlement reads from any'
    + ' alias and writes ONLY the canonical key, so nothing emits `stresses` BY DESIGN;'
    + ' the reads are inbound compatibility for saves authored before the rename. Gate 3'
    + ' admits FIELD_ALIASES values by name, and the entry names the DECLARATION rather'
    + ' than the adapter because the declaration IS the admission list.',
}),
```

Banked visibly under H26: `rowTags` carries **3 file-rows** tagged
`explained-writer / CR-OSR-SCHEMA-6 / M8 — registered alias`
(`EventComposer.jsx`, `canonicalAccessors.js`, `contentSampleCategoryFixtures.js`).

⚠ **ONE RESIDUE THE CHAIR MAY STILL WANT** — Lane I flagged it as deliberately NOT covered:

> 10. **`stresses on institutions`** (`src/pdf/lib/viewModelBodySlices.js:221`,
>     `inst?.pressures || inst?.stresses`) is an **undeclared ad-hoc alias on a different
>     shape** and is NOT covered by ruling A. It stays a finding and wants its own triage.

That row is a **different identity on a different shape** and was never in Ruling A's scope.
Unverified by this lane whether it survives at `f5332cf7` — cheap to check, low stakes.

---

## 4. RULING B — `worldPulse on campaignState` · ⭐ CLOSED, PROVISIONAL RULING REFUTED, LANDED

**The question as posed** (verbatim):

> B. `worldPulse on campaignState` — writer emits `{lastTick, lastInterval, updatedAt}`, a
> reader asks `.events`. The chair's provisional ruling is class (a) (the exact key is never
> written). Verify writer and reader sites and confirm or refute the provisional ruling.

**Disposition: the provisional class-(a) ruling was REFUTED; ruled class (b), and LANDED** —
but *conditionally*, and the condition is the interesting part. Live at
`check-observed-shape-readers.mjs:1021-1030`:

```js
Object.freeze({
  identity: 'worldPulse on campaignState',
  mechanism: 'save-time-writer',
  writer: 'src/store/campaignPulseHelpers.js',
  ruling: 'CR-OSR-SCHEMA-6 / M9',
  why: 'campaignStateForWorldPulse installs the key onto a real campaignState when a pulse'
    + ' is PERSISTED. The corpus executes generation plus the DOMAIN pulse and seeds'
    + ' campaignState itself, so the STORE-layer writer is never run — one lifecycle step'
    + ' further out than saves.js and the same class.',
}),
```

⭐⭐ **THE CHAIR ALSO ACCEPTED A NAMED BLIND SPOT IN WRITING** — the detector docstring at
`:973-987` is the record, and it is the sharpest thing in this whole file:

> ⚠⚠ H26 — GATE 0 PROBES THE CONTAINER KEY, NOT THE SUB-KEY, AND THE CHAIR HAS ACCEPTED
> THAT BLIND SPOT WITH A WRITTEN REASON. `worldPulse on campaignState` is the second live
> instance … the writer emits `{lastTick, lastInterval, updatedAt}`, both readers ask for
> `.events`, and gate 0 — a textual probe for the key `worldPulse` — passes on the container
> while saying nothing about the sub-key. **An exemption here would have made a genuinely
> broken read invisible, so the exemption was gated on the repair landing first**

**The gating repair LANDED and is CONFIRMED at the build tip.**
`src/store/aiChronicleContext.js:29-49` now reads:

```js
// `campaignState.worldPulse?.events`, which NO writer produces: the one writer
…
worldPulse: worldEntries.length ? worldEntries : campaignState.worldPulse?.events,
```

sourced from the campaign's `worldState.pulseHistory` (CR-S6-6). Commit `da31d170`
**verified an ancestor of `f5332cf7`** (`git merge-base --is-ancestor` → YES). The surviving
`campaignState.worldPulse` read is the deliberate legacy per-save fallback.
Banked under H26 as **2 tagged file-rows** (`OutputContainer.jsx`, + one sibling).

**Nothing is owed the chair here.** Recorded only so the accepted blind spot is not
re-discovered and mistaken for an unruled defect.

---

## 5. H26 (the fourth question, often counted with the three) · ⭐ CLOSED — BANK-BY-RULE, LANDED

`docs/implementation/packets/infrastructure/H26.md` @ `f5332cf7`:

> - **Status:** LANDED
> - **Landed:** 2026-08-13 — code half `d081feee…`, schema-7 genesis `98729f79…`; do not redispatch.

and its reconciliation line: `clear explained-writer findings` → **`bank them as tagged
per-file ceilings`**. The machinery is live: the schema-8 baseline carries a `rowTags` map
with **31 tagged file-rows** across exactly 4 identities —
`neighbourNetwork on settlement` (24), `stresses on settlement` (3),
`worldPulse on campaignState` (2), `factions on locks` (2).

⭐ **This materially changes Ruling C's option set**, because bank-by-rule did **not** exist
as usable machinery when Lane I wrote its recommendation on 08-11. See §6.

---

## 6. ⚠⚠ RULING C — the `eventLog` mechanism · **STILL OPEN. THIS IS THE ONE TO RULE.**

### 6.1 The question awaiting the chair, verbatim

From the Lane I dispatch brief:

> C. The `eventLog` mechanism — is the corpus's `eventLog` row leaf-name MERGING (foldCorpus
> keys by leaf name, merging regional-graph and campaignState eventLog into one shape) or an
> EMPTY CORPUS CONTAINER? The answer decides whether ~35 estate-wide rows join the
> fixture-bounded bucket.

And as Lane I posed it back to the chair:

> 3. **Ruling C.** Merging or empty container? *(This charter: **NEITHER — leaf-name
>    CROSS-HOME substitution**. The 33 rows join no bucket in this mint; the corpus-coverage
>    cure is its own later mint. **There is no "fixture-bounded bucket" in the repo to join**.)*

### 6.2 Still open at the live tree — CONFIRMED by measurement

**The rows have not moved through three schema mints (4 → 6 → 7 → 8):**

| | ledger schema 4 | **build schema 8** |
|---|---|---|
| `… on eventLog` inventory rows | 33 | **33** |
| distinct identities | 26 | **26** |
| reads | 47 | **47** |
| files | 4 | **4** |
| **tagged in `rowTags`** | (no rowTags) | ⛔ **0** |

Lane I's correction of Lane D's "~35" to **33 rows / 26 identities / 47 reads / 4 files** is
**CONFIRMED exactly** at both tips. The per-file split, re-derived from the schema-8 baseline:

| file | rows | reads | keys probed |
|---|---|---|---|
| `src/domain/dossier/chronicleFeed.js` | 24 | 31 | appliedAt, cause, createdAt, created_at, date, description, detail, event, eventId, kind, label, name, narrativeSummary, note, partyCaused, scale, severity, summary, text, timestamp, title, type, weight, when |
| `src/domain/events/mutate.js` | 5 | 11 | deltas, event, narrativeSummary, targetId, type |
| `src/components/settlement/NarrativeArchivePanel.jsx` | 3 | 4 | event, narrativeSummary, type |
| `src/store/campaignCanonRelationshipSession.js` | 1 | 1 | event |

All four files **exist at `f5332cf7`** (169 / 226 / 181 / 95 lines). Zero rows tagged.

### 6.3 The mechanism verdict — CONFIRMED and unchanged

Lane I, having **executed `buildObservedCorpus()` in memory**:

> Keying **IS** by leaf name — `shapeNameOf` overwrites `name` on every `field:` segment so
> only the last survives (`observed-shape-corpus.mjs:323-330`), and `foldCorpus` pools by it
> … Merging is real and general: 1281 of 1321 labels have more than one origin node.
>
> **But `eventLog` is NOT an empty container.** The observed row is:
> `eventLog = {"rows":109,"keys":["changes","id","impactIds","recordedAt","sourceEvent","sourceSettlementId","sourceSettlementName"]}`
> Seven keys, 109 rows, from **exactly one record home**:
> `root:pulseResult/field:regionalGraph/field:eventLog/element` … **And not one of the
> flagged reads touches that object.** The other three observed `eventLog` array locations —
> including `root:save/field:campaignState/field:eventLog` — were observed **209 times and
> were ALWAYS EMPTY**.

The seed is **still hardcoded empty at the build tip** —
`scripts/lib/observed-shape-corpus.mjs:763`:
`campaignState: { phase: 'canon', eventLog: [], locks: {} },`

Lane I's clincher, which still holds: `src/domain/region/wizardNews.js:303` — the one reader
of the *observed* home — has **zero** baseline rows.

### 6.4 ⭐⭐ NEW EVIDENCE THIS LANE ADDS — the 33 rows are DEMONSTRABLY NOT DEFECTS

Lane I established the rows sit on the wrong home. **This lane establishes what they actually
are, and it is decisive.**

**(a) The real writer exists, and writes four of the flagged keys outright.**
`src/domain/events/applyEvent.js:52-66` @ `f5332cf7` mints the `EventLogEntry`:

```js
const logEntry = /** @type {EventLogEntry} */ ({
  event,
  appliedAt,
  beforeState,
  afterState: result.afterSystemState,
  deltas: result.systemStateDeltas,
  factionResponses: result.factionResponses,
  narrativeSummary: result.narrativeSummary,
  causalStateDeltas: result.causalStateDeltas,
  factionRelationshipDeltas: result.factionRelationshipDeltas,
  ...(undo ? { undo } : {}),
});
```

`event`, `appliedAt`, `deltas`, `narrativeSummary` are **all four flagged identities and all
four provably written**. It reaches the log via `prepareCanonEvent.js:107` (`nextEventLog`) and
`drainQueuedEvents.js:179` (`eventLog: [...baseLog, ...newEntries]`), persisted through
`canonEventCommandTransaction.js:362` — **the STORE/command layer, precisely the lifecycle step
the corpus never executes.** That is the *identical* argument the chair already accepted for
Ruling B (M9, "one lifecycle step further out than saves.js").

**(b) The other 24 rows are a textbook POLYMORPHIC-PARAMETER MIS-BINDING.**
`chronicleFeed.js:92-99` feeds **four heterogeneous sources** through **one** normalizer:

```js
const tagged = [
  ...arr(manual).map((e, i) => normalizeEntry(e, `m${i}`, 'manual')),
  ...arr(worldPulse).map((e, i) => normalizeEntry(e, `wp${i}`, 'world')),
  ...arr(worldLog).map((e, i) => normalizeEntry(e, `wl${i}`, 'world')),
  ...arr(recent).map((e, i) => normalizeEntry(e, `r${i}`, 'world')),
];
```

(`manual` = `campaignState.eventLog`, `worldPulse` = `campaignState.worldPulse.events`,
`worldLog` = `campaignState.worldState.eventLog`, `recent` = `settlement.recentEvents`.)
Because `manual` is first, the detector binds the polymorphic `raw` parameter to shape
`eventLog` — then flags **every key the normalizer probes across all four shapes**.
`normalizeEntry` (`:53-74`) is one defensive OR-chain:

```js
const title = raw.title || raw.label || raw.name || raw.type || raw.kind || inner.type || inner.kind || 'Event';
const summary = raw.summary || raw.description || raw.detail || raw.text || raw.note || raw.narrativeSummary || …;
const at = raw.createdAt || raw.created_at || raw.timestamp || raw.at || raw.date || raw.when || raw.appliedAt || null;
const partyCaused = !!(raw.partyCaused || inner.partyCaused || raw.cause === 'party_action' || …);
id: raw.id || raw.eventId || inner.id || …,
severity: raw.severity || raw.weight || raw.scale || null,
```

⭐ **Those six chains account for ALL 24 chronicleFeed identities, exactly.** Not one is a
reader-without-writer defect; each is a deliberate cross-source compatibility arm.

**(c) M6 misses rescuing this by EXACTLY ONE KEY.** `check-observed-shape-readers.mjs:343`
sets `SHAPE_FAMILY_FILTER.minKeys: 8`, and `:432` returns own-keys-only when
`own.size < minKeys`. `eventLog` has **7** own keys. **7 < 8.** The M6 filter — whose real
mechanism the charter itself records as *"polymorphic-parameter mis-binding"*, the exact
defect here — is disarmed on this shape by a one-key margin.

**Verdict: ZERO of the 33 rows is a user-visible defect. All 33 are instrument artifacts.**
This is the reverse of the cohort's headline class and should be recorded as such.

### 6.5 Options, with consequences

| | Option | Consequence |
|---|---|---|
| **C1** | **Leave as-is** — 33 untagged rows stay banked as findings | Zero cost now. But the instrument keeps 33 rows that are *provably* not defects, unmarked, on a shape it never observed. The ceiling lies, and the next auditor re-derives this entire analysis. Contradicts the chair's own H26 rationale (a row should be *visible with its reason*, not silently wrong). |
| **C2** | **Bank-by-rule under H26** — tag the rows explained-writer | Uses machinery the chair already ruled into existence. Honest for the ~4 provably-written identities (`event`, `appliedAt`, `deltas`, `narrativeSummary`) under M9, writer `applyEvent.js`, the *same* argument as Ruling B. ⛔ But it is **dishonest for the other ~22**: their writer is not `applyEvent.js` at all — they belong to three *other* source shapes. Forcing them into M9 entries naming a writer that does not write them is exactly the **fit-motivated reduction CR-OSR-FREEZE-7 prohibits**. Cost: a schema mint (set-growing). |
| **C3** | **Corpus coverage** — execute a canon-event writer so `campaignState.eventLog` carries real entries | The principled cure Lane I recommended. ⚠ **But AO-0 already looked at this and DEFERRED it in writing**: "Flat flavor-event records and `campaign.chronicles[]` remain deferred because their shipped road needs AI prose, wall-clock, persistence, analytics, and store state." AO-0 instead added the canon event as a **scalar-only** root (`canonEventResult`, `AO-0.md:102-104`) deliberately kept *out* of `foldCorpus` — so it does not merge into the `eventLog` shape. The deferral reason is unchanged today. Cost: high; a store-layer corpus seam. |
| **C4** | **Fix the detector's shape identity** — path-qualified rather than leaf-name | Cures the whole *class* (Lane I: 1281 of 1321 labels have >1 origin node), not just eventLog. ⛔ Enormous blast radius across every shape; a schema mint plus a full re-freeze. Not a one-ruling act. |
| **C5** | **Lower `SHAPE_FAMILY_FILTER.minKeys` 8 → 7** so M6 absorbs eventLog | Smallest possible code delta, and it targets the *actual* mechanism (M6 exists for polymorphic mis-binding). ⛔ **A tuned-constant change with estate-wide blast radius** — it re-scopes every 7-key shape at once, not just this one. Requires measuring the estate-wide movement first, and it is a detector change ⇒ governed schema mint. |

### 6.6 ⭐ MY RECOMMENDATION (recommendation only — the chair rules)

**Rule C as: NEITHER option as posed — ratify "leaf-name cross-home substitution" as the
finding, and adopt a SPLIT disposition. Do not take C2 wholesale.**

1. **Ratify the mechanism verdict** (Lane I's, now independently re-confirmed at the build
   tip): leaf-name keying with exactly one observed home, and it is the wrong home.
   Record explicitly that **"the fixture-bounded bucket" does not exist in the repo** — the
   question as originally posed had no answerable form, which is why it outlived A and B.
2. **Record the new, stronger finding** from §6.4: the 33 rows are **not defects at all** —
   4 identities are provably written by `applyEvent.js:52-66`, and the other ~24 are one
   polymorphic normalizer's cross-source OR-chains. This is the fact the chair is actually
   ruling on, and it was not available on 08-11.
3. **Bank only the honest subset (C2, narrow):** the ~4 `applyEvent.js`-written identities
   earn M9 entries on the *identical* precedent as Ruling B. Refuse M9 for the other ~22 —
   naming a writer that does not write them would be the fit-motivated reduction the
   instrument exists to prevent.
4. **For the remaining ~22, prefer C5 over C3 — but gate it on measurement.** M6 is the
   filter *designed* for this mechanism and misses by one key. Commission a **read-only
   estate-wide measurement** of what `minKeys: 8 → 7` moves *before* charting any mint. If
   the blast radius is small and principled, it is by far the cleanest cure; if it is wide,
   fall back to C3 and accept that AO-0's deferral reason still binds.
5. **Do not schedule a mint for this alone.** Every path here is a governed detector change;
   ride the next mint the program is already taking.

**If the chair wants one sentence:** *the rows are artifacts, not defects; bank the four that
have a real writer, and measure the one-key M6 threshold before spending a mint on the rest.*

### 6.7 ⚠ Confidence labels

- **CONFIRMED (executed/read at `f5332cf7`):** the 33/26/47/4 figures and zero tagging; both
  baselines' schema and totals; the four exemption entries; the `rowTags` contents; the
  `applyEvent.js` literal; the `chronicleFeed.js` normalizer and its OR-chains; `minKeys: 8`
  and the `:432` guard; the corpus's empty `campaignState` seed at `:763`; H26/AO-* LANDED
  statuses; `da31d170` ancestry; the branch divergence.
- **PLAUSIBLE (reasoned, not executed):** that lowering `minKeys` to 7 would in fact absorb
  these rows — the *guard* is confirmed but the resulting union was not computed; and the
  exact count of "provably written" identities (**~4**) — I verified the four literal keys but
  did not exhaustively diff all 26 identities against every writer. **Both are precisely what
  the §6.6-4 measurement should settle.** I did not run the detector (read-only lane).

---

## 7. ⭐ CARVE-OUT ASSESSMENT

**Ruling C is CHAIR-SCOPE. It grazes no owner carve-out** (legal · cull · tuning signature ·
each push · paid-surface behaviour · owner-parked items) **as recommended above.** It changes
no product behaviour, no same-seed output, no paid surface — every option touches instrument
classification only.

⚠ **Three adjacent tripwires the chair should keep off this ruling's plate:**

1. ⛔ **C5 is a TUNED CONSTANT.** `SHAPE_FAMILY_FILTER.minKeys` is an instrument threshold, not
   a product tuning signature, so it is *not* the owner's tuning carve-out — **but** it is
   estate-wide and exactly the shape of change that reads as tuning at a glance. Recommend the
   chair state that distinction explicitly in the ruling so a successor does not escalate it.
2. ⛔ **Any option here forces a GOVERNED SCHEMA MINT** (`--write` throws on the 11 governed
   paths; a detector change binds `scannerProvenance.detectorDigest`). The recorded mint laws
   apply in full: two-commit pair, **commit 1 is gate-RED by construction — prove it DETACHED**
   (the gate cannot pass pre-commit by design), and the genesis is generated, never hand-edited.
3. ⛔ **Owner-gated and NOT part of Ruling C** — Lane I's exclusion list, still standing:
   `ancientRuinsEnabled` (curing it **ENABLES A CAPABILITY**), and the **aiOverlayVerifier
   fence re-point**, which Lane I escalated as *"OWED TO THE OWNER"* because it "changes the
   behaviour of an anti-hallucination guard on **a paid AI surface**." Lane I recommended
   **REFUSE the re-point**; this lane did not re-verify its status and flags it as an open
   owner-docket item, not a chair one.

---

## 8. Corrections to memory this lane owes the record

1. ⛔ **`ui-cohort-triaged-31-true-positives.md` must lose "Three OPEN CHAIR RULINGS"** — two
   are landed. Ruling C alone is open, and its scale is **33 rows / 26 identities / 47 reads**,
   not "35 rows".
2. ⛔ **The 08-15 fold's "3 chair rulings open" + "schema-6 detector-mint candidates batched"
   is superseded** — the schema-6 mint LANDED (`2fe94f77` → genesis), and so did schema 7
   (H26) and schema 8 (AO-0), all on 2026-08-13.
3. ⚠ **`FABLE_VALIDATION_QUEUE.md` + `SOL_QUEUE.md` are on BOTH branches, not build-only** —
   the endgame row's claim is wrong as stated. `OWNER_DECISION_QUEUE.md` and
   `FABLE_RETROVALIDATION_QUEUE.md` are ledger-only, which is the real asymmetry.
4. ⭐ **NEW, worth its own topic file:** the **OSR instrument is STALE ON THE LEDGER BRANCH by
   three mints** (schema 4 vs 8). Reading it there silently describes a dead world.
5. ⭐ **NEW recovery law:** a lost scratchpad deliverable is **recoverable verbatim** from
   `~/.claude/projects/<project>/<session>/subagents/*.jsonl`, which outlive the scratchpad
   (the scratchpad's `tasks/*.output` are symlinks into that store). This brief is the proof.
