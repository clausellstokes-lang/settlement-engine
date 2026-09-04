# SEALED — lane CENSUSHEADROOM (seat Opus 5)

- Dock (read-only): `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree`
- HEAD throughout: `c2f80ffc9` — "§891 cure: the capsule battery's runtime-tests fixture stops being a green with an expiry date"
- Sibling lane's dirty files, NEVER touched by me: `src/components/new/tabs/EconomicsGlance.jsx`, `src/domain/display/dossierViewModel.js`
- Acts taken: reads, one `node` import of a pure-data leaf, THREE single-file `npx vitest run`s.
  **No edit, no stage, no commit, no ref write, no register door, no subagent, no stash.**
- Predictions were written to this file BEFORE any instrument ran; the pre-run copy is
  preserved at `.receipt-partial-and-predictions.bak`. All four predictions confirmed exactly.

---

## HEADLINE

**None of the four war slots is a stale pin, and none of the eight extra families is an
accident.** The chair's working diagnosis was right that the pins are not protecting against
anything dangerous, but wrong about the direction and wrong about the remedy. The four
instruments are reporting **correctly and currently**: a chair-ruled corpus program authored
eight extra families into the annex documents and **never wired them into `src/`**. The
census `cause` prose states the arrow backwards.

Curing all four is worth **exactly 4 census slots**, and there is a fifth sibling
(`war_culture_suppressed`) with the identical defect that no instrument compares to its annex
at all — a dark door the same act should light.

---

## 1. VERIFYING THE DIAGNOSIS — the census cause is BACKWARDS

The census `cause`, shared verbatim by census entries 7/8/9, reads:

> "The receipt-annex family sets for 'war_trajectory_winning', 'war_trajectory_losing' and
> 'trajectory_misread' no longer retain exactly the five annex families verbatim (measured 6,
> 6 and 10). **Extra families were minted into the war-cost pools** without amending the
> registry pin."

**The counts are right. The attribution sentence is wrong.** The extras were minted into the
**ANNEX DOCUMENTS**, not into the pools. The pools hold exactly five and always have.

### The assertion, quoted

`tests/lint/warCostKindPools.walker.test.js:190-201` — the failing arm:

```js
test.each(WAR_COST_KIND_REGISTRY)(
  '$kind retains the five receipt-annex families verbatim',
  (row) => {
    const rendered = renderedPool(row);
    const annex = annexPool(row.kind);
    expect(rendered).toEqual(annex.lines);      // ← line 194, the failing line
```

`rendered` is the **`src/` registry pool**. `annex.lines` is the **markdown corpus**, read
through `tests/helpers/receiptAnnex.js`. Vitest prints ACTUAL first, EXPECTED second, so the
message `expected [ …(5) ] to deeply equal [ …(6) ]` means **`src` = 5, annex = 6** — the
opposite of what the cause sentence says. The diff direction settles it beyond argument:

```
- Expected
+ Received
-   "The lenders of Ashford have begun advancing against the victory, which is the surest sign the hall has convinced somebody.",
```

A `-`-prefixed line is present in **Expected (the annex)** and absent from **Received (the
pool)**. CONFIRMED.

### Executed receipts

**CONFIRMED** — `npx vitest run tests/lint/warCostKindPools.walker.test.js` @ `c2f80ffc9`:

```
 Test Files  1 failed (1)
      Tests  3 failed | 31 passed (34)
```
- `'war_trajectory_winning' … verbatim` — `expected [ …(5) ] to deeply equal [ …(6) ]`
- `'war_trajectory_losing' … verbatim` — `expected [ …(5) ] to deeply equal [ …(6) ]`
- `'trajectory_misread' … verbatim` — `expected [ …(5) ] to deeply equal [ …(10) ]`

**CONFIRMED** — `npx vitest run tests/lint/warRulingKindPools.walker.test.js`, `REAL_EXIT=1`:

```
 Test Files  1 failed (1)
      Tests  1 failed | 44 passed (45)
```
- `'succession_demand_inherited' retains the five annex families without editorial
  cross-references` — `expected [ …(5) ] to deeply equal [ …(6) ]`

Both files' *other* arms pass, including `expect(row.pool).toHaveLength(5)`
(warCost:122, warRuling:72) — **an independent green witness that the pools are at five.**

### The independent static measurement

A `node` import of the pure-data leaf `src/domain/worldPulse/warReceiptPools.js` (no
imports, so importable directly) compared against a row-count walk of
`docs/content/RECEIPT_POOLS_WAR.md`:

```
WAR_RECEIPTS array kinds: 75
kinds present as non-pointer annex blocks: 41
MISMATCHES (src pool length != annex rows): 5
  war_culture_suppressed: src=5 annex=10      ← NOT IN THE CENSUS. See §5.
  war_trajectory_winning: src=5 annex=6
  war_trajectory_losing: src=5 annex=6
  trajectory_misread: src=5 annex=10
  succession_demand_inherited: src=5 annex=6
count src>5: 6   count src==5: 58
```

The six kinds already wired past five are the envoy family (`envoy_on_the_road` = 12/12),
proving **wiring past five has direct precedent inside this same data leaf.**

### The helper already recorded the true diagnosis

`tests/helpers/receiptAnnex.js`, module docblock:

> "**SCOPE FENCE.** This helper re-points and hardens. It does NOT reconcile the kinds whose
> annex was **DEEPENED past the walker's fixed-five assumption** (chronic-tier deepening,
> `1e8bf8a8`); those stay red under D-W3's Class B, which needs a chair ruling (cap raised vs
> corpus trimmed), not a parser."

`docs/DISPOSITION_WAVE_PROPOSAL.md`, D-W3:

> "Kind-pool Class B: **4 kinds** where CHRONIC-TIER DEEPENING (`1e8bf8a8`) authored 6th+
> variants past the walkers' 5-row assumption — the walker contract needs a ruling (cap
> raised vs corpus trimmed), distinct from Class A's relocation."

The count of four and the identity of the commit were already on the record. What the census
`cause` prose lost was the *direction*.

**VERDICT (CONFIRMED): all four are LIVE, CORRECT instruments reporting REAL unwired content.
None is a stale pin. Nothing is missing from the corpus; something is missing from `src/`.**

---

## 2. PER-FAMILY PROVENANCE — every one of the eight is LEGITIMATE

`git log -S "<sentence fragment>" -- docs/content/RECEIPT_POOLS_WAR.md`, run once per extra
family, returns **the same single commit for all eight**:

```
1e8bf8a87  THE CHRONIC-TIER DEEPENING: +2,462 variants under the frequency-scaled floor
           — the corpus doubles where the reader lives
```

`1e8bf8a87`, Mon Aug 3 2026, author **Clausell Stokes III** (the owner), body:

> "Run wf_80fbe739-a28 (13 agents, 0 errors): 479 chronic/notable kinds deepened across the 8
> annexes (WAR +116, …). Append-only proved by execution (existing variants byte-identical);
> three adversarial verifiers PASS with 50 fixes, zero pools below floor; **chair rulings
> A-16..A-19 recorded in GRAMMAR's register** (dossier lines ruled CHRONIC — the most-read
> sentences must never be the thinnest…)."

`git show --stat 1e8bf8a87` — **nine files changed, all `docs/content/*.md`, ZERO `src/`.**
This was a pure corpus-authoring commit by design; the wiring was always a later step that
was never taken for these five kinds.

**The direction of the remedy is ALREADY CHAIR-RULED — and not by D-W3.**
`tests/lint/kindPoolFloors.walker.test.js` docblock:

> "The measurement at this commit is 28 registered kinds under their own floor, every one of
> them at depth EXACTLY FIVE — **the fixed-five class chair ruling CR-FP-7 closed by
> countersigning the cap-raise arm.**"

D-W3 asked for a ruling "cap raised vs corpus trimmed". **CR-FP-7 answered it: CAP RAISED.**
The corpus is not to be trimmed.

### Per-family verdicts

| # | Kind | Extra family (annex row) | Verdict |
|---|---|---|---|
| 1 | `war_trajectory_winning` | 6. "The lenders of {settlement} have begun advancing against the victory…" | **LEGITIMATE — wire it** |
| 2 | `war_trajectory_losing` | 6. "The plate is going inland by cart, and the town has counted every cart." | **LEGITIMATE — wire it** |
| 3 | `trajectory_misread` | 6. "The clerk at {settlement} entered the report exactly as it came…" | **LEGITIMATE — wire it** |
| 4 | `trajectory_misread` | 7. "Every offer {settlement}'s hall prices this season is priced against a country that is no longer there." | **LEGITIMATE — wire it** |
| 5 | `trajectory_misread` | 8. "One arrival from the field closes the gap at {settlement}…" | **LEGITIMATE — wire it** |
| 6 | `trajectory_misread` | 9. "The captains who could correct the hall are the ones the hall has not heard from." | **LEGITIMATE — wire it** |
| 7 | `trajectory_misread` | 10. "Carters through {counterpart} have carried the truer picture for a season…" | **LEGITIMATE — wire it** |
| 8 | `succession_demand_inherited` | 6. "Should {npc} read the war some other way, the hall that opened for him is still a door." | **LEGITIMATE — wire it** |

**ZERO ACCIDENTAL. ZERO CANNOT-TELL.** Four independent supports, each CONFIRMED:
1. One owner commit, deliberate program title, 13-agent run, three adversarial verifiers.
2. Chair rulings A-16..A-19 recorded at the mint.
3. The *sizes* are not arbitrary — they land exactly on the frequency-scaled floor table in
   `tests/helpers/kindPoolWalker.js` (`routine: 8, notable: 6, major: 4`). `notable` kinds got
   6; `routine` kinds got 10 (≥ 8). The deepening was **authored to the floor**.
4. CR-FP-7 already countersigned the cap-raise arm for exactly this class.

**A pin protecting against accidental minting is not being asked to bless an accident. It is
reporting a wiring debt whose material is ruled, authored, and waiting.**

---

## 3. THE EXACT RE-PIN ACT

There is **no regeneration door**. `scripts/` contains only `generate-dossier-state-prose.mjs`
(a different corpus); nothing generates `warReceiptPools.js` from the annex, and no
`package.json` script mentions annex, pool or receipt. **Every edit below is a hand edit.**

The one door that exists anywhere in this cure is `npm run test:ratchet:update`
(`node scripts/check-test-ratchet.mjs --update`, wrapped in `gate-mutex.sh`). **NAMED, NOT
RUN.** Its `_doc` states it "can only REMOVE entries and LOWER magnitude ceilings", and it
re-runs the whole source-phase suite — a landing act, the chair's.

Full site list in `headroom-plan.md`. In short: two `src/` files (the pools leaf and the two
registry call-sites), three `tests/lint/` walkers, one `tests/domain/` news test, one
disclosed-shift entry, and — LAST, at the landing — the four census rows.

**⚠ The cure is same-seed behaviour-changing.** `eventProse.js:77`:

```js
const templateIndex = seed ? fnv1a32(seed) % pool.length : 0;
```

`pool.length` is the modulus. Deepening 5→6 (or 5→10) **re-maps every seed** for these kinds.
This is a legitimate, disclosed one-time shift, and `1e8bf8a87`'s own body shows the program
already carries that idiom ("wiring = pure widening; the disclosed-shift header carries the
ruling"). It must be written into `docs/GOLDEN_SHIFT_LEDGER.md`, never allowed to ride
silently.

---

## 4. HOW MANY SLOTS, AND IN WHAT ORDER

**4 slots — the full four. Not fewer.** Each of the three `warCostKindPools` census entries
is one `test.each` case keyed on its interpolated `$kind`; wiring that kind turns that case
green and repays exactly that row. The fourth is the single `warRulingKindPools` case.

### The order, proved from the gate's own source

**`scripts/check-test-ratchet.mjs:1292`** — remove the row FIRST and the still-failing test
becomes a REGRESSION:

```js
const regressions = [...liveFailingIds].filter((id) => !entries[id]).sort();
```
→ `'[test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):'` — **the gate REDS.**

**`scripts/check-test-ratchet.mjs:1429-1440`** — cure FIRST and leave the row, and the gate
**stays green** and merely advises:

```js
const repaired = Object.keys(entries).filter((id) => !liveFailingIds.has(id));
…
`[test-ratchet] OK — no regressions, and ${repaired.length} baselined test(s) no longer fail `
+ `(${liveFailingIds.size} < ${Object.keys(entries).length}). RATCHET DOWN: run `
+ '`npm run test:ratchet:update` to bank the win.'
…
return 0;
```

**So "remove the census row LAST" is not merely program convention here — it is the only
order the instrument permits.** CONFIRMED both directions from the source.

**⚠ AND THE CURE MUST BE ALL-OR-NOTHING PER ROW.** `check-test-ratchet.mjs:1374` measures
magnitude only for rows still failing (`if (!liveFailingIds.has(id)) continue;`), and each war
row's magnitude pattern hard-codes the ACTUAL five:

```
"pattern": "expected \\[ …\\(5\\) \\] to deeply equal \\[ …\\((\\d+)\\) \\]"
```

A **partial** deepening (say `trajectory_misread` to 6 instead of 10) changes the message to
`expected [ …(6) ] to deeply equal [ …(10) ]`, the pattern stops matching, the magnitude
becomes `unmeasured`, and the gate takes the fail-closed road:

> "An unmeasured magnitude is an UNKNOWN one, not a small one." → `return fail(lines)`.

Either wire a kind to its full annex depth, or leave it entirely alone.

**⚠ A SECOND, GREEN INSTRUMENT IS COUPLED TO THIS ACT.**
`tests/lint/kindPoolFloors.walker.test.js` carries all four kinds in its frozen
`LEGACY_UNDER_FLOOR` backlog (lines 118, 119, 121, 122) and asserts, at lines 250-256:

```js
expect(violations.map((v) => v.kind)).toEqual([...LEGACY_UNDER_FLOOR]);
expect(LEGACY_UNDER_FLOOR).toHaveLength(28);
```

plus, per row, that every member sits at depth **exactly five**, with the message:

> "a backlogged pool changed depth. **DEEPER than five is a win — remove its backlog entry.**"

So deepening without striking the entries REDS a test that is green today, and striking them
without deepening REDS it too. **They move in one commit.** The literal `28` must become `24`
(or `23` — see §5) by hand. This is a test-file hand edit, **not** a register door.

---

## 5. THE FIFTH SIBLING — a genuinely DARK door

`war_culture_suppressed` has `src=5, annex=10` — the identical defect — and is **not in the
census**, because **no instrument compares it to its annex.** The only readers of
`WAR_ANNEX_URL` are `receiptAnnex.js` itself and the four kind-pool walkers
(`envoy`, `sovereignty`, `warCoalition`, `warCost`, `warRuling`).
`war_culture_suppressed` lives in `WAR_DISPOSITION_KIND_REGISTRY`, whose walker is
`tests/lint/phrasedKindPools.walker.test.js` — which **reads no annex at all** and simply
asserts `expect(row.pool).toHaveLength(5)` (line 76).

Its only visibility anywhere is the `kindPoolFloors` backlog comment
`'war_culture_suppressed', //  routine, 5 of 8` — a shortfall note, not a verbatim witness.

**This is a lighting-wave finding, not a census one.** It costs no census slot and frees none;
it is five more authored sentences that should ride the same act, and afterwards the
`phrasedKindPools` walker should be given the same annex comparison its four siblings have —
otherwise the WR-2 cohort stays dark to a defect its neighbours all detect.

---

## 6. SINGLETON TRIAGE

### `tests/docs/enforcement-claims.test.js` — REAL DEBT, but **HALF OF IT IS AN INSTRUMENT DEFECT**

**CONFIRMED** — `npx vitest run tests/docs/enforcement-claims.test.js`, `REAL_EXIT=1`,
`Tests 1 failed | 20 passed (21)`. The six naked claims, verbatim from the run:

```
docs/FABLE_VALIDATION_QUEUE.md:179   "| 2026-08-03 | ⭐ CHAIR RULING R-BLD-10 …"   (matched: machine-enforced)
docs/FABLE_VALIDATION_QUEUE.md:3017  "`pactTriggers.js`; `npm run lint` 30 problems / 3 errors. …"  (matched: 0 problems)
docs/FABLE_VALIDATION_QUEUE.md:3886  "4. `npm run lint` — **30 problems / 3 errors**, executed at HEAD…"  (matched: 0 problems)
docs/FABLE_VALIDATION_QUEUE.md:5663  "(3 errors / 30 problems), none in a touched file. …"  (matched: 0 problems)
docs/GOLDEN_SHIFT_LEDGER.md:2128     "can. The rule is PHRASE vs CLAUSE, and it is now machine-enforced by"  (matched: machine-enforced)
docs/implementation/packets/foreign-policy/IN-0C.md:484  "| Acceptance cases | **8** | 8 | ✓ — and the cap is **machine-enforced**…"  (matched: machine-enforced)
```

The census `cause` (corrected in place 2026-09-01) names these six sites at these six line
numbers, and they still match exactly — so the cause is **CURRENT, not stale**, and the
sibling `FROZEN_NAKED` per-claim pin is confirmed green (it is among the 20 passes).

**⭐ THE FINDING: three of the six are false positives of the detector, not documentation
debt.** `tests/docs/enforcement-claims.test.js:40`:

```js
const CLAIM_RE = /promoted (?:from warn )?to (?:ERROR|error)|burned (?:down )?to zero|0 problems|machine-enforced|…/;
```

`0 problems` carries **no left boundary**, so it matches inside `30 problems`. All three
`FABLE_VALIDATION_QUEUE` hits are lines reporting **30 problems / 3 errors** — the exact
opposite of a completeness claim. Narrowing the alternative to `(?<![\d.])0 problems` is a
strictly-correct tightening (a real claim reads " — 0 problems", space-prefixed), and would
take the naked count **6 → 3**. It needs a two-direction control (`"0 problems"` still
matches; `"30 problems"` no longer does) — the file already has a
`resolver discriminates (negative + positive controls)` describe block to house it.

The remaining three are genuine untagged claims, two of which (`GOLDEN_SHIFT_LEDGER.md:2128`,
`IN-0C.md:484`) already name their enforcer in prose and need only the `@enforced-by` tag
form; `FABLE_VALIDATION_QUEUE.md:179` is a historical chair-ruling ledger row, and the honest
options are tag it or scope the corpus walk off append-only history.

⚠ Coupled act: burning any claim down without lowering the matching `FROZEN_NAKED` row
(lines 510-515) reds the *shrink* arm of a currently-green test. **1 census slot.**

### `tests/lint/clampPrimitiveBaseline.test.js` — REAL DEBT, cause CURRENT, and the most expensive of the ten

**CONFIRMED** by replicating the test's own scan (`DEF_RE`, comment-stripped, `src/**`, kernel
home exempt) at `c2f80ffc9`:

```
LIVE files defining a local clamp/clamp01: 78
BASELINE json entries: 62
baseline entries NOT live (stale): []
live NOT in baseline (growth): 16
```

The sixteen are **exactly** the sixteen the census `cause` names. **Zero stale entries — the
entire gap is growth.** So the cause is fully current and this is not a stale pin in any sense.

The re-freeze road is closed by a second, currently-green arm. `clampPrimitiveBaseline.test.js`:

```js
const BASELINE_CEILING = 62; // committed max — lower it as copies migrate; never raise it
…
test('baseline never grows past its committed ceiling', () => {
  expect(baseline.length).toBeLessThanOrEqual(BASELINE_CEILING);
});
```

`baseline.length === 62 === BASELINE_CEILING`, so re-freezing to 78 breaches it — the
mechanical form of the STRIP-never-raise ruling. And D-W3's chair pre-ruling forbids the cheap
road on semantics, not just bookkeeping:

> "**NONE is byte-identical to the kernel** (5 NaN-passthrough, 4 Number-coerce, 2 coerce:
> +Infinity→1 where the kernel yields 0). Unification is therefore BEHAVIOR-TOUCHING and
> belongs here, per-site … Register-and-freeze without that review would freeze semantic drift."

**1 census slot, at the price of 16 per-site behaviour-touching migrations**, each needing
`tests/kernel/clampPrimitive.parity.test.js` to prove byte-neutrality or an in-file registered
divergence. Two of the sixteen (`characterConsumers.js`, `knownCharacter.js`) are
pre-attributed SUBSTRATE work. **This is the poorest slot-per-effort ratio of the three
groups I examined and should be scheduled last.**

---

## 7. WHAT I DID NOT DO

- Did not analyse the four `voiceMechanics` arms (another lane owns them; brief item 6).
- Did not run `npm run check`, `npm run build`, or any full suite.
- Did not run `--update`, `--write`, `--genesis`, `--rebank`, or any `UPDATE_*`/`*_REFREEZE`.
- Did not edit, stage, commit, or write any ref. Did not touch the sibling lane's two files.
- Did not materialise `node_modules` symlinks; did not spawn a subagent; did not `git stash`.

## 8. THE ONE THING I COULD NOT SETTLE

The `requiredSlots` value for each of the eight new families is an **authorial/epistemic
judgment**, not a mechanical derivation. `requiredSlots` names the **evidence a sentence
claims**, not the `{slots}` it interpolates — `trajectory_misread`'s existing family 1 carries
`['fieldReport']` while interpolating nothing. Several new families assert source details the
receipt has not proven (lenders advancing; plate moving inland by cart; carters carrying a
truer picture), so each needs an evidence slot or the no-fabrication contract weakens
silently. A proposed table with per-family rationale is in `headroom-plan.md` §C, explicitly
marked as a proposal for the authoring lane, not a finding.

---

## RETROVALIDATION ROW

**What I judged.**
1. That all four war census rows are live, correct instruments and none is a stale pin —
   the census `cause` states the arrow backwards (annex grew, pools did not).
2. That all eight extra families are LEGITIMATE and must be wired, none removed — on four
   independent supports, the strongest being that the extra depths land exactly on the
   frequency-floor table and that CR-FP-7 already countersigned the cap-raise arm.
3. That the cure frees exactly 4 slots, all-or-nothing per row, with the row removal LAST —
   proved from the gate's own regression and repaired branches.
4. That `war_culture_suppressed` is a fifth instance with **no annex-comparing instrument** —
   a dark door, worth zero census slots and worth lighting anyway.
5. That 3 of the 6 `enforcement-claims` naked claims are a **detector false positive**
   (`0 problems` matching inside `30 problems`), not documentation debt.
6. That `clampPrimitiveBaseline` is fully-current real debt with the re-freeze road closed by
   a green sibling arm — 1 slot for 16 behaviour-touching migrations.

**What a reviewer re-derives, and how.**
- The direction (§1): run `npx vitest run tests/lint/warCostKindPools.walker.test.js` and read
  which side of the diff carries the `-` prefix. It is the annex.
- Provenance (§2): `git log -S "have begun advancing against the victory" -- docs/content/RECEIPT_POOLS_WAR.md`
  → `1e8bf8a87`; then `git show --stat 1e8bf8a87` → nine files, all `docs/`, zero `src/`.
- The ruling (§2): grep `CR-FP-7` in `tests/lint/kindPoolFloors.walker.test.js`.
- Order (§4): read `scripts/check-test-ratchet.mjs:1292` against `:1429-1440`.
- The dark fifth (§5): `grep -rln 'WAR_ANNEX_URL' tests/` and confirm
  `phrasedKindPools.walker.test.js` is absent from the list.
- The false positive (§6): read `CLAIM_RE` at `tests/docs/enforcement-claims.test.js:40` and
  note `0 problems` has no left boundary.
- Clamp (§6): re-run the scan replication; expect `78 / 62 / 0 stale / 16 growth`.

**Receipts by path.**
- `.../censushead/receipt-censushead.md` (this file)
- `.../censushead/headroom-plan.md` (the per-slot plan)
- `.../censushead/.receipt-partial-and-predictions.bak` (predictions as written PRE-RUN)
- `.../censushead/warruling.run.txt` (full warRuling run, `REAL_EXIT=1`)
- `.../censushead/enfclaims.run.txt` (full enforcement-claims run, `REAL_EXIT=1`)
- `.../censushead/measure.mjs` (the pool-vs-annex measurement script)

**Priority.**
1. **HIGH — the war wiring.** 4 of 10 slots, the largest single group, material already
   authored and ruled. The only real work is 8 `requiredSlots` judgments and a disclosed shift.
2. **MEDIUM — `enforcement-claims`.** 1 slot; half of it is a one-line detector narrowing with
   controls the file already has scaffolding for.
3. **LOW — `clampPrimitiveBaseline`.** 1 slot for 16 behaviour-touching migrations. Schedule
   last; it will not unblock anything sooner than the other two.
4. **NOT A SLOT, DO IT ANYWAY — `war_culture_suppressed`** and the `phrasedKindPools` annex
   blindness, folded into the war act.

---

## ADDENDUM — THE DOCK MOVED MID-LANE, AND THE FINDINGS SURVIVE IT

At close, the dock HEAD was **no longer** the `c2f80ffc9` I opened on. The sibling lane landed
three commits while I measured, and the tree is now clean:

```
f537ce47e §891 car 27: the corpus stops describing a split that no longer exists
f35df9517 §891 register 11/11: the voice JSX baseline banks a fallen row by hand, because its own door would have thrown
6936f0daa §891 cure: the season tile stops re-parsing a joined string, and the banked voice row stops growing
```

`git diff --stat c2f80ffc9..HEAD` — **four files, none of them mine:**

```
 docs/content/RECEIPT_POOLS_DOSSIER_STATE.md   |  8 +++++---
 src/components/new/tabs/EconomicsGlance.jsx   |  4 ++--
 src/domain/display/dossierViewModel.js        | 15 +++++++++++----
 tests/copy/.voice-mechanics-jsx-baseline.json |  4 ----
```

**Every file my findings rest on is untouched by those three commits** —
`RECEIPT_POOLS_WAR.md`, `RECEIPT_POOLS_LEGACY.md`, `warReceiptPools.js`, `eventProse.js`, the
three walkers, `receiptAnnex.js`, `scripts/.test-ratchet-baseline.json`,
`scripts/.clamp-primitive-baseline.json`, `enforcement-claims.test.js`,
`clampPrimitiveBaseline.test.js`. The `RECEIPT_POOLS_` file that did move is the **DOSSIER_STATE**
volume, a different corpus from the WAR and LEGACY volumes this lane read.

**⚠ Two consequences the chair should carry forward.**
1. **Every figure in these two documents is anchored to `c2f80ffc9`**, and that is the sha to
   re-derive against — not "the dock", which has moved twice since and will move again.
2. `f35df9517` banked a voiceMechanics row **by hand, "because its own door would have
   thrown."** That is the OTHER lane's four slots being *re-banked*, not repaid. It does not
   change the census count (`scripts/.test-ratchet-baseline.json` is not in the diff, so the
   census is still **10 of 10**), but it means the prose group's slots moved further from
   release while this lane was measuring. **The four war slots are, as of this sha, the only
   near-term headroom on the board.**
