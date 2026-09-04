# LANE ANCHORS — receipt

**STATUS: FINAL.** Companion table: `anchor-map.md` (same directory).

Seat: Opus 5 — Fable-unvalidated. Phase: **MEASUREMENT ONLY.**
Read dock: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree` @ **1223489c9**.
Ledger: `/Users/cstokes/Desktop/settlement-engine` @ `review-fixes-2026-07-08`.

**Discipline held:** no file edited, staged, committed or deleted in either tree; no vitest,
`npm test`, `npm run check` or build invoked; no subagent spawned; no `node_modules` symlink
materialised; all writes confined to this scratch directory. A full gate held an exclusive
lock throughout and was not contended.

**Evidence class.** Every claim below labelled CONFIRMED rests on **reading the file at the
named line at this sha** — not on executing it. I could not execute anything this phase, so
no claim about how a suite *would behave after a repair* is CONFIRMED; those are PLAUSIBLE
and labelled. I have not marked any reasoning-only claim as executed evidence.

---

## 1. What "mutilated" means — quoted, not inferred

**CONFIRMED** (`docs/content/RECEIPT_POOLS_LEGACY.md:1437-1439`, ruling J-LEG-4):

> "TWELVE of these fallbacks are not merely plain, they are **mutilated** — the strip regex
> ate the meaningful half of the token, so `coup_detat` renders as *"detat"* and
> `institution_capture` as *"capture"*"

**CONFIRMED** the mechanism is a live computation, not a stored string: `whatPhrase()`
(`src/domain/display/settlementRumors.js:554-573`) strips a prefix via `WHAT_STRIP_PREFIX`
(`:491`) and de-underscores the remainder (`:569`). The §4 leaf explicitly does not store
variant 1 (`src/domain/display/rumorFallbackPhrasePools.js:32`). This is why the repair is a
code+corpus act and not a text edit — a fact the enumeration turns on.

**CONFIRMED** the class boundary is drawn in the source, so "mutilated" is not my
judgement call: `LEGACY.md:399` classes `corruption_exposed` as *"Plain, not mutilated: the
DEFECT-6 class"*, and `:1442` closes the set — *"the twelve inline tags are the whole list."*

## 2. The count — 12 found against 12 expected

**CONFIRMED** by two independent sources that the estate deliberately keeps apart
(`rumorFallbackPhrasePools.test.js:134-138`):

* the frozen literal `MUTILATED_ANCHORS` at `tests/domain/rumorFallbackPhrasePools.test.js:139-152`;
* twelve `⚠️ MUTILATED` inline tags in `docs/content/RECEIPT_POOLS_LEGACY.md` at lines
  1608, 1619, 1631, 2235, 2306, 2318, 2330, 2341, 2353, 2414, 2425, 2479.

I counted the annex tags mechanically: 15 total `MUTILATED` occurrences, of which 3 are
prose (`:60`, `:1442`, `:2655`) and **12 are inline row tags**. The two sources agree.
Full roster with file:line, rendered string and defect class: `anchor-map.md` §1.

## 3. LEG-7 — verified independently, CONFIRMED

I did not take the brief's word for this. My own greps:

* **CONFIRMED** LEG-7's only definitional home is `docs/content/RECEIPT_POOLS_LEGACY.md:2874`,
  as the seventh item in a list of **wiring notes** (LEG-3, LEG-5, LEG-6, LEG-7). Verbatim:
  *"LEG-7 — OWNER-GATED, SEPARATE COMMIT. The DEFECT-1/2/3 de-slugging and the DEFECT-8
  digit retirement… Do not bundle either into a pool-wiring wave."*
* **CONFIRMED** that document's own footer (`:2880-2882`) attributes it to *"Fable 5,
  2026-08-03"* — a model/lane authoring pass, not an owner sitting.
* **CONFIRMED** `grep LEG-7 LEDGER:docs/OWNER_DECISION_QUEUE.md` returns exactly three
  lines — `:32379` (§884.5, a design-lane report), `:32421` (§892) and `:32423` (§892.1).
  §892 and §892.1 both *characterise* LEG-7 as a lane note. **No owner-voiced ruling on the
  twelve exists anywhere in the owner queue.**
* **CONFIRMED** the §892 Fable sitting reached the same finding independently
  (`LEDGER:docs/FABLE_RETROVALIDATION_QUEUE.md:2665`): *"LEG-7 is a LANE-authored wiring
  note (`RECEIPT_POOLS_LEGACY.md:2874`, 2026-08-03)… no owner ruling on the twelve exists
  in the ledger (grep `LEG-7` → only §884.5)."* And `:3293` + `LEDGER:docs/HANDOFF_CURRENT.md:40`
  carry it forward as an **OPEN** owner row.

**Verdict: CONFIRMED.** LEG-7 is a lane-authored wiring note. It is real as a *gate* and
absent as a *ruling*. Repair is not owner-forbidden.

⚠ One correction to how this is being carried, offered because it changes what the repair
car may assume: LEG-7 gates the **de-slugging act**; it never spoke to the **wordings**.
Those are separately owner-gated by taste precedent, and the disclosed same-seed prose shift
carries its own LEG-5 golden obligation. Lifting LEG-7 unblocks the mechanism, not the words.
Recorded so nobody reads "LEG-7 is a lane note" as "the twelve are a lane's to author."

## 4. The entanglement — and three blockers that dissolve

This was the load-bearing half, and the headline is that folklore over-counted the trap.

**CONFIRMED — pins that genuinely move.** Ten assertion sites, of which nine sit in one
file, `tests/domain/rumorFallbackPhrasePools.test.js` (:139-152, :167-168, :171-181,
:213-217, :221, :232-238, :324-332, :407, :408, :418-433), plus the §3 census mirror in
`tests/domain/rumorPhrasePools.test.js` and the R1 register law in
`tests/lint/newsSubjectVocabulary.walker.test.js:436-455` — the last of which bans em
dashes in any phrase the repair authors. Two anchors carry single-anchor pins:
`coup_detat` (:407) and `institution_capture` (:408 **and** the exact-set
`CANONICAL_NESTS_IN_VARIANT` at :160, because `capture` nests in a variant precisely
because it is a bare verb).

**CONFIRMED — three named blockers are CLEAR for all twelve.** Each was measured, not assumed:

1. **The heraldRouting routing law** (`tests/lint/heraldRouting.walker.test.js:152-153`,
   *"every `WHAT_PHRASES` impactKind is explicitly routed"*). All twelve are **already** in
   `EXACT_SECTION` (`src/domain/realm/heraldRouting.js`, declared :81; rows at :101, :268,
   :284, :285, :286, :290), so `isExplicitlyRouted` (:514-525) already returns true. A new
   `WHAT_PHRASES` row needs no new routing row.
2. **The routed-but-unregistered census** (`tests/lint/kindPoolFloors.walker.test.js:331-335`).
   `unvoiced` is computed at :174 against `REGISTERED_KINDS`, which derives at :82 from the
   **eleven kind-pool registries** — not from `WHAT_PHRASES`. A `WHAT_PHRASES` row adds no
   registry row, so the census does not move. The famous trap recorded in
   `newsSubjectVocabulary.walker.test.js:334-350` is real but belongs to
   `route_chartered`/`route_revived`, which are **not yet routed**. The twelve already are.
   The two cases are not the same shape.
3. **The byte-twin assert** (`tests/helpers/receiptAnnex.js` → `faithKindPools.walker.test.js`).
   Its legacy road runs only for kinds the war volume forwards, selecting rows tagged
   `` `[live, verbatim]` ``. Measured for all twelve: `liveVerbatimRows=0`, `warHeading=0`.
   **It never reaches any of the twelve.** The hazard I was briefed on does not intersect
   this repair.

**CONFIRMED — one apparent pin is a false positive.** `tests/simulation/emergentArcSoak.test.js:184`
lists `'detat'` in a politics keyword set, which reads like a pin on the mutilated render.
`systemFamilyOf` (:191-199) tokenizes the **engine token** on `[._]` — `coup_detat` →
`{coup, detat}` — and never reads `whatPhrase` output. Clear. I record it because it would
cost the repair car a detour.

**CONFIRMED — the ~150 remaining citations do not move.** Sampled per token across `tests/`
and `src/`: they cite the tokens as `candidateType` / `archetype` / `stressor.type` engine
identifiers. The repair changes what `whatPhrase()` renders, never the token.

## 5. ⛔ The finding I would put in front of the repair car

**CONFIRMED, and it inverts the received picture.** The pin the whole deferral rests on is
**vacuous**. `tests/domain/rumorFallbackPhrasePools.test.js:222-230`, the test named *"each
mutilated anchor is still the live computed string, unrepaired"*, whose own comment (:230)
calls it *"what makes the deferral visible instead of forgotten"*:

```js
const livePool = (kind) => [whatPhrase(kind), ...(FALLBACK_PHRASE_POOLS[kind] || [])];  // :129
expect(livePool(kind)[0], `${kind}: index 0 must remain the mutilated slug`).toBe(whatPhrase(kind)); // :228
```

`livePool(kind)[0]` **is** `whatPhrase(kind)`. Seedless `whatPhrase` is deterministic
(`settlementRumors.js:554-573`; `widenedPhrase` returns the canonical unchanged when
`!seed`). The assertion compares a value to itself and cannot fail — repaired or not. The
identical tautology sits at `:337-339`.

The genuine detectors are `:180` (corpus join: code vs doc) and `:221` (doc tags vs frozen
literal). This matters twice over: a repair car reading test *names* will believe it holds a
guard it does not hold, and the §892 record describing these twelve as "pinned as
deliberately unrepaired" overstates what the pin actually enforces.

**PLAUSIBLE** (reasoning, not executed): both vacuous sites should be re-pointed at frozen
expected strings, or deleted, as part of the repair. That is a structural-prevention item in
its own right.

---

## RETROVALIDATION ROW

**What I judged.** (a) That "mutilated" is a *defined* class with an authored boundary, so
enumeration is a lookup rather than a classification exercise — I quoted the definition and
the boundary case instead of inferring either. (b) That the twelve are **all repairable and
none exempt**, because the one stated gate is lane-authored and the three named ratchets
measure clear. (c) That the impersonation pairs (2,7) and (3,8) are **one repair each, not
two**, on the register's own reasoning that the defect is misattribution *between* the pair.
(d) That **Route A** (authored `WHAT_PHRASES` rows) beats Route B (narrowing
`WHAT_STRIP_PREFIX`), because Route B provably cannot cure the impersonations and carries
measured collateral onto 3/5/5/5/9 sibling kinds. (e) That the wordings and the disclosed
prose shift remain owner-gated even though the mechanism is not — a distinction I drew
rather than found stated, and the most vetoable judgement here.

**What a reviewer re-derives, cheapest first.**
1. The roster: `sed -n '139,152p' tests/domain/rumorFallbackPhrasePools.test.js` against
   `grep -n 'MUTILATED' docs/content/RECEIPT_POOLS_LEGACY.md` (15 hits, 3 prose, 12 rows).
2. LEG-7's provenance: `grep -n 'LEG-7' docs/OWNER_DECISION_QUEUE.md` on the ledger branch →
   three lines, all lane rows or rows declaring it a lane note.
3. The blockers dissolving: `grep -n '<anchor>' src/domain/realm/heraldRouting.js` for all
   twelve (all present under `EXACT_SECTION`, declared :81); then
   `kindPoolFloors.walker.test.js:174` + `:82` to see `unvoiced` is registry-derived.
4. The byte-twin clearance: for each anchor, confirm no `[live, verbatim]` row under its
   legacy heading and no `### <anchor> ` heading in `RECEIPT_POOLS_WAR.md`.
5. The vacuity: read `:129` beside `:228`. It is a two-line read and it is the one finding
   here that changes what the repair car must build.

**Receipts by path.**
* `tests/domain/rumorFallbackPhrasePools.test.js` — roster :139-152; corpus parser :81-122;
  detectors :171-181, :221; on-purpose red :213-217; single-anchor pins :407, :408, :160;
  **vacuous pins :228, :338**
* `docs/content/RECEIPT_POOLS_LEGACY.md` — definition :1437-1439; boundary :399; closure
  :1442; twelve tags (12 lines listed in §2); defect register :2740-2790; **LEG-7 :2874-2877**;
  authorship footer :2880-2882
* `src/domain/display/settlementRumors.js` — `WHAT_STRIP_PREFIX` :491; `whatPhrase` :554-573;
  the on-purpose comment :562-565
* `src/domain/realm/heraldRouting.js` — `EXACT_SECTION` :81; anchor rows :101, :268, :284-286,
  :290; `isExplicitlyRouted` :514-525
* `tests/lint/kindPoolFloors.walker.test.js` :82, :174, :331-335 ·
  `tests/lint/heraldRouting.walker.test.js` :152-153 ·
  `tests/lint/newsSubjectVocabulary.walker.test.js` :334-350, :436-455 ·
  `tests/helpers/receiptAnnex.js` :95-104 and the legacy road ·
  `tests/simulation/emergentArcSoak.test.js` :184, :191-199
* LEDGER: `docs/OWNER_DECISION_QUEUE.md` :32379, :32421, :32423 ·
  `docs/FABLE_RETROVALIDATION_QUEUE.md` :2483, :2497, :2655, :2665, :3293 ·
  `docs/HANDOFF_CURRENT.md` :16, :40

**Priority.**
* **P0 — the vacuous pins (:228, :338).** Independent of whether the repair ever happens: a
  guard believed to exist and absent is worse than a known gap, and this one is cited in the
  ledger as the thing making the deferral visible.
* **P1 — record that the three blockers are clear.** The cost of the twelve has been
  overstated on the record; the repair car should not re-pay a survey already done here.
* **P2 — the repair itself**, Route A, impersonation pairs together, one atomic act per the
  five-step recipe in `anchor-map.md` §4. Needs the owner for the **words** and the
  disclosed prose shift, not for permission to act.
* **P3 — a scope check on `npc_action`.** Its phrase touches a NAMED character's act;
  keep the wording world-facing under the standing product-scope law.

**Confidence.** High on enumeration, provenance and entanglement (all read at this sha).
Moderate on the Route A recommendation — it is a design judgement, stated so it can be
vetoed. **Unexecuted throughout:** no suite was run, so every "would red" is PLAUSIBLE.
