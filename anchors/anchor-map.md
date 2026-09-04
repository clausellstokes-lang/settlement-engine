# ANCHOR MAP — the twelve mutilated anchors

Read dock: `.../58f0a8e2-.../scratchpad/laneKERNELMARK-tree` @ **1223489c9** (porcelain clean at read).
Ledger: `/Users/cstokes/Desktop/settlement-engine` @ `review-fixes-2026-07-08`.
Phase: MEASUREMENT ONLY. **No file was edited, staged, committed or deleted; no test was run.**

All paths below are relative to the read dock unless prefixed `LEDGER:`.

---

## 0. What "mutilated" means (quoted, not inferred)

`docs/content/RECEIPT_POOLS_LEGACY.md:1437-1439`, ruling **J-LEG-4**:

> "TWELVE of these fallbacks are not merely plain, they are **mutilated** — the strip
> regex ate the meaningful half of the token, so `coup_detat` renders as *"detat"* and
> `institution_capture` as *"capture"*"

Mechanism, `src/domain/display/settlementRumors.js:491` + `:569`:

```js
const WHAT_STRIP_PREFIX = /^(npc_|stressor_birth_|stressor_|party_|flow_|faction_|faith_|war_|institution_|occupation_|coup_|resource_|pantheon_)/;
const stripped = key.replace(WHAT_STRIP_PREFIX, '').replace(/_/g, ' ').trim();
```

A §4 kind stores **no** variant 1. Index 0 is computed at call time, so the "mutilated"
string exists only as a live return value — never as a stored literal. That is why the
repair is a code+corpus act rather than a text edit.

Boundary: mutilated ≠ merely unvoiced. `RECEIPT_POOLS_LEGACY.md:399` calls
`corruption_exposed` *"Plain, not mutilated: the DEFECT-6 class"*. The twelve are the
twelve `⚠️ MUTILATED` inline tags and nothing else — `:1442`: *"the twelve inline tags
are the whole list."*

---

## 1. The roster — 12 found, 12 expected

Two independent sources agree, which is itself the design (`:134-138`).

* **Frozen literal:** `tests/domain/rumorFallbackPhrasePools.test.js:139-152`
* **Doc parse:** the twelve `⚠️ MUTILATED` inline tags in `docs/content/RECEIPT_POOLS_LEGACY.md`

| # | anchor (engine token) | annex row | renders as | defect | severity |
|---|---|---|---|---|---|
| 1 | `coup_detat` | LEGACY.md:2235 | `detat` | DEFECT-1 | high |
| 2 | `faction_institution_capture` | LEGACY.md:2306 | `institution capture` | DEFECT-2 **impersonation** | high |
| 3 | `faction_institution_suppression` | LEGACY.md:2318 | `institution suppression` | DEFECT-2 **impersonation** | high |
| 4 | `faction_law_preference_push` | LEGACY.md:2330 | `law preference push` | DEFECT-2 | high |
| 5 | `faction_power_shift` | LEGACY.md:2341 | `power shift` | DEFECT-2 | high |
| 6 | `faction_service_bolster` | LEGACY.md:2353 | `service bolster` | DEFECT-2 | high |
| 7 | `institution_capture` | LEGACY.md:2414 | `capture` | DEFECT-2 | high |
| 8 | `institution_suppression` | LEGACY.md:2425 | `suppression` | DEFECT-2 | high |
| 9 | `npc_action` | LEGACY.md:2479 | `action` | DEFECT-2 | high |
| 10 | `occupation_burden` | LEGACY.md:1608 | `burden` | DEFECT-3 | medium |
| 11 | `occupation_burden_cleared` | LEGACY.md:1619 | `burden cleared` | DEFECT-3 | medium |
| 12 | `occupation_resistance` | LEGACY.md:1631 | `resistance` | DEFECT-3 | medium |

Literal roster line numbers, in file order: 140 · 141 · 142 · 143 · 144 · 145 · 146 · 147 · 148 · 149 · 150 · 151.

**The impersonation pairs are ONE repair each, not two** (`LEGACY.md:2753-2761`):
`faction_institution_capture` renders the exact de-underscored spelling of the *distinct*
kind `institution_capture`, while `institution_capture` renders only `capture`. Repairing
either half alone leaves the misattribution standing or inverts it. Pairs: (2,7) and (3,8).

---

## 2. Pins and walkers, per anchor

### 2a. The pins that MOVE on repair — all but one live in a single file

`tests/domain/rumorFallbackPhrasePools.test.js`:

| site | assertion | which anchors | why it moves |
|---|---|---|---|
| :139-152 | `MUTILATED_ANCHORS` frozen literal | all 12 | roster shrinks; must be hand-edited |
| :221 | `[...DOC_MUTILATED].sort()).toEqual([...MUTILATED_ANCHORS].sort())` | all 12 | annex inline tag + literal must change in **one act** |
| :171-181 | `PARSED[kind][0]).toBe(whatPhrase(kind))` (corpus join) | all 12 | annex **row 1** must be re-authored to the new computed string in the same act |
| :167-168 | `Object.keys(PARSED).length).toBe(107)` and `FALLBACK_WIRED_KINDS.length).toBe(107)` | all 12, Route A only | a repaired kind leaves §4 → 107 becomes 107−N |
| :213-217 | `'a §4 kind has NO WHAT_PHRASES row'` → `misfiled` must be `[]` | all 12, Route A only | **this is the on-purpose red.** Adding a `WHAT_PHRASES` row reds it by design |
| :407 | `expect(whatPhrase('coup_detat')).toBe('detat')` | **1 only** | hard-coded rendered literal |
| :408 | `expect(whatPhrase('institution_capture')).toBe('capture')` | **7 only** | hard-coded rendered literal |
| :160 + :324-332 | `CANONICAL_NESTS_IN_VARIANT = ['hostile','institution_capture','patron']`, pinned as an **exact set** | **7 only** | `capture` nests in a variant *because* it is a bare verb; repair changes the set. The comment names `'capture'` explicitly |
| :232-238 | widening: pool ≥ floor and `drawn.size > 1` | all 12 | pool composition changes when row 1 changes |
| :418-433 | repetition envelope per desk (`unused` empty, no member dominating) | all 12 | row 1 is a pool member; replacing it re-prices the envelope |

`tests/domain/rumorPhrasePools.test.js` — the §3 sibling. Under Route A the §3 census
(63) grows by N as §4 shrinks by N. Mirror of the `:167-168` row above.

`tests/lint/newsSubjectVocabulary.walker.test.js:436-455` — ARM 6 builds `SUBJECTS` from
`SCANNED_TOKENS.map((k) => whatPhrase(k))` and asserts every phrase satisfies
`R1_FORBIDDEN`, which here **includes an em-dash ban**
(`[/—/, 'an em dash — forbidden in any string literal this wave authors']`).
Any newly authored phrase must be a bare lowercase noun phrase with no terminal stop, no
digit, no underscore, no `{}$`, no opening connective and **no em dash**.

### 2b. Walkers that string-match the anchors but do NOT move — measured, not assumed

These looked like entanglements and are not. Each is a false positive worth recording so
the repair car does not spend a wave on them.

| surface | why it is clear |
|---|---|
| `tests/lint/heraldRouting.walker.test.js:152-153` — *"every `WHAT_PHRASES` impactKind is explicitly routed"* | **All twelve are ALREADY in `EXACT_SECTION`** (`src/domain/realm/heraldRouting.js`, declared :81; rows at :101, :268, :284, :285, :286, :290). `isExplicitlyRouted` (:514-525) returns true for all twelve today, so a new `WHAT_PHRASES` row needs **no** new routing row. |
| `tests/lint/kindPoolFloors.walker.test.js:331-335` — the routed-but-unregistered census | `unvoiced = Object.keys(EXACT_SECTION).filter((t) => !REGISTERED_KINDS.has(t))` (:174) and `REGISTERED_KINDS` derives from the **11 kind-pool registries** (:82), not from `WHAT_PHRASES`. A `WHAT_PHRASES` row adds no registry row, so `unvoiced` is unchanged at 274. |
| `tests/lint/faithKindPools.walker.test.js` + `tests/helpers/receiptAnnex.js` (the byte-twin family) | The legacy road in `receiptAnnex.js` runs only for kinds the **war** volume forwards, and selects only rows tagged `` `[live, verbatim]` ``. Measured across all twelve: `liveVerbatimRows=0` and `warHeading=0` for every one. **The byte-twin assert never reaches any of the twelve.** |
| `tests/domain/candidateTypeVoicePhrasing.walker.test.js:92-101` | Asserts the phrase carries no underscore. Already satisfied, and a repair keeps it satisfied. |
| `tests/simulation/emergentArcSoak.test.js:184` — `'detat'` in the politics keyword list | `systemFamilyOf` (:191-199) tokenizes the **engine token** on `[._]` and matches whole tokens. `coup_detat` → `{coup, detat}`. It never reads `whatPhrase` output, and the engine token is unchanged by the repair. Clear. |
| ~150 further citations of the twelve tokens across `tests/` and `src/` | Sampled per token: they cite the token as a `candidateType` / `archetype` / `stressor.type` engine identifier (e.g. `tests/domain/warMachineObeysPolitics.test.js`, `tests/fixtures/cl0-rogue-authority-pin.json`, `tests/domain/occupationRecordMode.test.js`). The repair changes only what `whatPhrase()` **renders**, never the token. Clear. |

---

## 3. Disposition

**Ledger line:** *Found 12; repairable 12; exempt 0. LEG-7 as an owner gate does not
survive contact with the ledger, and the three ratchets folklore named as blockers
(heraldRouting routing law, the `kindPoolFloors` routed-but-unregistered census, the
receiptAnnex byte-twin assert) are each measured CLEAR for all twelve. What remains is
not a permission problem but a coordination problem: one atomic act across
`settlementRumors.js`, `RECEIPT_POOLS_LEGACY.md` and one test file, plus two impersonation
pairs that must move together and two anchors carrying extra single-anchor pins.*

| anchor | disposition | extra cost beyond the common act |
|---|---|---|
| `coup_detat` | repairable | hard literal at :407; wants a real word (`coup d'état` — check the apostrophe/accent against `tests/lint/controlBytes.test.js` before authoring) |
| `institution_capture` | repairable — **pair with #2** | hard literal at :408; `CANONICAL_NESTS_IN_VARIANT` exact set at :160 |
| `faction_institution_capture` | repairable — **pair with #7** | must disambiguate from #7 in the same act |
| `institution_suppression` | repairable — **pair with #3** | — |
| `faction_institution_suppression` | repairable — **pair with #8** | must disambiguate from #8 in the same act |
| `faction_law_preference_push` | repairable | — |
| `faction_power_shift` | repairable | — |
| `faction_service_bolster` | repairable | — |
| `npc_action` | repairable | ⚠ product-scope check: `npc_action` names a NAMED character's act; keep the phrase world-facing, never fate-bearing |
| `occupation_burden` | repairable | — |
| `occupation_burden_cleared` | repairable | — |
| `occupation_resistance` | repairable | — |

**Exempt: none.** No anchor is exempt on LEG-7 grounds. Two things remain genuinely
owner-gated and are NOT this map's to lift:

1. **The words themselves.** Every precedent in the estate routes phrase wordings to the
   owner as taste (`FABLE_RETROVALIDATION_QUEUE.md:2497` routes "the twelve phrase and six
   frame wordings" to the owner). Enumerating is a lane act; authoring twelve reader-facing
   phrases is not.
2. **The disclosed prose shift.** These are live strings on a shipped surface. Retiring one
   *replaces* a live string rather than widening a pool, so it moves same-seed prose and
   owes its own golden (LEG-5's per-kind golden plan, `LEGACY.md:1433-1436`).

---

## 4. The exact repair the later car should make

### Choose the route deliberately — they have very different blast radii

**Route A — author a `WHAT_PHRASES` row per anchor.** The repair the defect register itself
recommends (*"Repair: an authored `WHAT_PHRASES` row"*, `LEGACY.md:2871`).
Consequence: the kind **leaves §4 and joins §3** by definition (`:213-217`), so the annex
block must physically move from a `## §4x` section to a `## §3` section, and the 107/63
censuses move in two test files. Precise, per-anchor, no collateral on other kinds.

**Route B — narrow `WHAT_STRIP_PREFIX`** (`settlementRumors.js:491`). Keeps every kind in
§4 and keeps 107 intact. **But it changes the computed string for every kind sharing the
prefix, not just the mutilated one.** Measured collateral across the annex's 170 `### … —
R1 subject phrase` headings: `coup_` 3 · `institution_` 5 · `occupation_` 5 · `npc_` 5 ·
`faction_` 9. Every affected kind's annex row 1 must be re-authored too, or the corpus join
at :180 reds. Route B also cannot fix the impersonation pairs — dropping `faction_` makes
`faction_institution_capture` render `institution capture` *still*.

**Recommendation (PLAUSIBLE, a judgment the chair may veto): Route A**, because the
impersonation pairs are the highest-severity members and Route B provably cannot cure them.

### The atomic act, Route A, per anchor

One commit must carry all of these or a gate reds mid-way:

1. `src/domain/display/settlementRumors.js` — add the `WHAT_PHRASES` row.
2. `docs/content/RECEIPT_POOLS_LEGACY.md` — rewrite **row 1** to the new computed string;
   **strip the `⚠️ MUTILATED, DEFECT-N` inline tag**; move the `### <kind> — R1 subject
   phrase` block from its `## §4x` section into `## §3`.
   ⛔ Keep the heading text byte-identical apart from its position. `receiptAnnex.js`
   anchors on `^### <kind>(?= )` and asserts **exactly one** match file-wide
   (`anchoredOnce`, :95-104); the §4 parser is section-aware on `^## (§\d[a-z]?) — `
   (`rumorFallbackPhrasePools.test.js:100`). A block landing on the wrong side of a
   section heading silently changes corpus membership.
3. `tests/domain/rumorFallbackPhrasePools.test.js` — remove the anchor from
   `MUTILATED_ANCHORS` (:139-152); lower `107` → `107−N` (:167-168); for `coup_detat`
   delete or re-point :407; for `institution_capture` delete or re-point :408 **and**
   amend `CANONICAL_NESTS_IN_VARIANT` (:160).
4. `tests/domain/rumorPhrasePools.test.js` — raise the §3 census by N.
5. Author the golden LEG-5 owes for the kind, and **state the same-seed prose shift
   explicitly** in the commit body. Per program law a legitimate behaviour shift is
   declared, never allowed to ride silently.

### Do NOT do these

* Do **not** sed the annex's em dashes or heading punctuation. 2,250 annex em dashes live
  in headings that walkers match by literal string; the two readers here anchor on
  `^### <kind>(?= )` and `^### (\S+) — R1 subject phrase`. A sweep retargets them silently.
* Do **not** "fix" a corpus-join red by re-recording row 1 to match new code without
  re-reading the tag. The test says so in its own failure message (:175-179): the computed
  string is the byte-identity anchor.
* Do **not** add an `EXACT_SECTION` row. All twelve are already routed; adding one would
  grow the `unvoiced` census and red `kindPoolFloors:331-335` for no gain.

---

## 5. ⛔ The trap that will actually bite — the guard is VACUOUS

`tests/domain/rumorFallbackPhrasePools.test.js:222-230`, the test named
*"each mutilated anchor is still the live computed string, unrepaired"* — the pin the whole
deferral was recorded on, described at :230 as *"what makes the deferral visible instead of
forgotten"*:

```js
const livePool = (kind) => [whatPhrase(kind), ...(FALLBACK_PHRASE_POOLS[kind] || [])];   // :129
expect(livePool(kind)[0], `${kind}: index 0 must remain the mutilated slug`).toBe(whatPhrase(kind)); // :228
```

`livePool(kind)[0]` **is** `whatPhrase(kind)`. `whatPhrase` is deterministic and seedless
here (`settlementRumors.js:554-573` — pure string ops plus object lookups; `widenedPhrase`
returns the canonical unchanged when `!seed`). The assertion compares a value to itself.

**It cannot fail, repaired or not.** Whatever the repair car does to these twelve, this test
stays green — including if it repairs all twelve and forgets the annex. The same tautology
sits at `:337-339` (`'every §4 kind returns its computed fallback when no seed is given'`).

The **real** detectors are `:180` (corpus join, code vs doc) and `:221` (doc tags vs frozen
literal). A repair car that trusts the test *names* will believe it has a guard on the
deferral that it does not have. Both vacuous sites should be re-pointed at frozen expected
strings — or deleted — as part of the repair, and that is itself a structural-prevention
item worth its own note.
