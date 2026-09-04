# VACUOUS ASSERTIONS — confirmed findings

Read tree HEAD `1223489c939667c5bfde083ae60b4431b9f05b20`. Measurement-only; nothing edited, staged or run.

Severity key — **does the vacuous line guard something load-bearing?**
- **LOAD-BEARING**: the stated claim has NO other guard in the file. The claim is unproven today.
- **PARTIAL**: another assertion covers part of the claim; the rest is unproven.
- **REDUNDANT**: a sibling assertion in the same test fully covers the claim. Dead line, no coverage lost.
- **BY DESIGN**: deliberately vacuous, honestly named. Not a defect — but a walker must be told.

---

## TIER 1 — SAME-BINDING (cannot fail under ANY behaviour of the code)

Both sides are the same binding, evaluated once. No change to the code under test can red these.

### V-1 · `tests/domain/magicSubstitutionReagents.test.js:301` — **LOAD-BEARING**
```js
expect(subsistence.worldState).toBe(subsistence.worldState);
```
Test: `it('the regime SCALES the demand (§7), and subsistence presses nothing at all')`

**Why it cannot fail.** `subsistence` is bound once at line 293; both operands read the same property of the same object in the same expression. It is `x === x`.

**Intended assertion.** The no-write claim — `accrueReagentDemand` under `subsistence` must hand back the worldState it was given. The input is an inline `world()` call with no binding, so there is nothing to compare against and the author compared the result to itself.

**Concrete broken scenario it survives.** `accrueReagentDemand` gains a subsistence branch that clones the worldState and writes a corridor tally into it. The line passes. `expect(subsistence.changed).toBe(false)` is the function's OWN self-report and passes too if the report is what drifted. `readRouteNetwork(...).toBe(null)` covers only the route network, not the corridor tally the test is about. The independent no-write check is the vacuous line, so the dormancy claim is unproven.

### V-2 · `tests/domain/sovereigntyMarketStageWr10w.test.js:251` — **LOAD-BEARING**
```js
expect(sitting.worldState, 'and writes nothing').toBe(sitting.worldState);
```
Test: `it('a settlement that CROSSES into a demanding band is a candidate; one that SITS in it is not')`

**Why it cannot fail.** `sitting` is bound at line 246; `x === x`. The assertion message states the claim (`'and writes nothing'`) that the assertion does not test.

**Concrete broken scenario it survives.** The stage writes a plan-ledger entry into a cloned worldState on the sitting path. `expect(sitting.receipts).toEqual([])` still passes (a ledger write is not a receipt) and `sitting.changed` is again the stage's own self-report. The write goes unseen.

### V-3 · `tests/domain/npcVerdictApply.test.js:468` — **PARTIAL**
```js
expect(result.worldState).toBe(result.worldState);
```
Test: `test('a covert (unexposed) corrupt NPC leaves the settlement byte-identical when LIT')`

**Why it cannot fail.** Same shape. Note line 467 immediately above is the correct form of exactly this idiom — `expect(result.settlement).toBe(settlement)` compares against the bound input — which makes the vacuity on 468 visible as a slip rather than a choice.

**Concrete broken scenario it survives.** `sentence()` on the covert path mints a fresh worldState carrying non-ledger state. Line 469 (`hasNpcLedger(...) === false`) catches a ledger specifically, so the finding is PARTIAL: any other write to worldState is unguarded.

### V-4 · `tests/domain/settlementMigrations.test.js:165` — **REDUNDANT**
```js
expect(list2.length).toBe(list2.length);
```
Test: `it('migrations are exported as a frozen list (cannot be mutated at runtime)')`

**Why it cannot fail.** `x === x`. The test's own comment states the intent — "Confirm by attempting to mutate the returned copy — it should NOT affect future listMigrations calls" — so the operand should have been `list1.length - 1` or a length captured before the `push`.

**Concrete broken scenario it survives.** `listMigrations()` returns the internal array by reference instead of a copy, so `list1.push(...)` grows the shared array and `list2.length` is one larger than it should be. The line passes. **But** line 166 (`expect(list2.some(m => m.from === 99)).toBe(false)`) reds on that exact defect, so no coverage is actually lost.

### V-5 · `tests/domain/treatyRenewalMemory.test.js:283` — **PARTIAL**
```js
expect(re, 'the polarity scanner must be a live regex').toBeInstanceOf(RegExp);
```
Test: `it('exactly three src files name treatyRenewalEnabled and the only gate is a strict === true read')`

**Why it cannot fail.** `re` is `new RegExp(...)` two lines above. A `new RegExp` is a `RegExp` for every input that does not throw at construction — and if it threw, the test dies before reaching this line. The assertion has no reachable failing input.

**Additionally:** `re` has no other consumer. The `hits` computation on line 282 builds its own separate `RegExp`. `re` exists solely to be asserted about, tautologically.

**Concrete broken scenario it survives.** The `forbidden` shape templates or the `.replace('SENTINEL','')` produce a syntactically valid pattern that matches nothing (e.g. an over-escaped `\\s*` chain). The census above — `expect(hits.map(...)).toEqual([])` — then passes because the scanner is dead, not because the estate is clean, and this "live regex" guard signs off on it. PARTIAL because the three-world gate check later in the test (`treatyRenewalActive` over LIT/FALSE_SET/ABSENT) independently proves the door works.

---

## TIER 2 — SAME-PRODUCER VIA A LOCAL HELPER (the seed class)

Both sides re-invoke the same producer, one of them through a local helper that makes the identity invisible at the call site. Fails only if the producer is nondeterministic — which it is contractually not.

### V-6 · `tests/domain/rumorFallbackPhrasePools.test.js:228` — **LOAD-BEARING** (SEED 1)
```js
expect(livePool(kind)[0], `${kind}: index 0 must remain the mutilated slug`).toBe(whatPhrase(kind));
```
Test: `it('each mutilated anchor is still the live computed string, unrepaired')`
Helper (line 129): `const livePool = (kind) => [whatPhrase(kind), ...(FALLBACK_PHRASE_POOLS[kind] || [])];`

**Why it cannot fail.** `livePool(kind)[0]` reduces to `whatPhrase(kind)`: index 0 of an array whose first element IS `whatPhrase(kind)` and whose only other elements arrive via a spread after it. The assertion is `whatPhrase(kind) === whatPhrase(kind)`. It tests that a seedless call is deterministic — which the file's own header already fixes by construction — and nothing about the VALUE.

**Concrete broken scenario it survives.** A future strip-prefix edit de-slugs the anchors, so `whatPhrase('coup_detat')` starts returning `coup d'état` instead of the mutilated slug. Both sides move together; the line passes. The owner-gated DEFECT-1/2/3 deferral — whose entire purpose per the surrounding comment is that "this pin is what makes the deferral visible instead of forgotten" — silently stops being pinned. `MUTILATED_ANCHORS` is frozen as a literal list of *kind names*, not of *phrase values*, so nothing else in the file catches the repair.

### V-7 · `tests/domain/rumorFallbackPhrasePools.test.js:338` — **LOAD-BEARING** (SEED 1)
```js
expect(whatPhrase(kind), `${kind} drifted on the seedless path`).toBe(livePool(kind)[0]);
```
Test: `it('every §4 kind returns its computed fallback when no seed is given')`, inside `describe('THE STRICT NO-OP — a seedless call is byte-identical to before the wiring')`

**Why it cannot fail.** The same reduction, operands reversed.

**Concrete broken scenario it survives.** This is the worse of the pair, because the describe block's claim is *byte-identity to a pre-wiring value* — a claim that can only be tested against a frozen literal captured before the wiring. It is tested against a live re-computation of the post-wiring code. If the wiring changed every §4 seedless phrase, the "STRICT NO-OP" suite goes green. Contrast the sibling arm at line 344, `expect(whatPhrase(kind)).toBe(phrase)` over `Object.entries(WHAT_PHRASES)`, which pins against the authored corpus and is a real test — the §3 arm is guarded and the §4 arm is not.

---

## TIER 3 — SAME-PRODUCER, RE-INVOKED DIRECTLY

Both sides are the same call with the same arguments, written out twice. These test determinism and nothing else. Listed here only where the test's own stated claim is something *other* than determinism, so the stated claim is untested.

### V-8 · `tests/domain/arcaneIdentity.test.js:282` — **LOAD-BEARING**
```js
expect(getBaseChance(0.4, cat, name, cfg(), null), name)
  .toBe(getBaseChance(0.4, cat, name, cfg(), null));
```
Test: `it('NO-DRIFT: a magical world is untouched by the new line')`

**Why it cannot fail (usefully).** Drift means "the value moved from what it was before the new line". Detecting that requires a value frozen from before. Both operands are computed by the post-change code, so they move together by construction. Only a nondeterministic `getBaseChance` could red it.

**Concrete broken scenario it survives.** The new magic-gate line halves the base chance for every institution in a magical world. Both sides halve; the line passes. The following `toBeGreaterThanOrEqual(0)` passes. The trailing `expect(getBaseChance(0.4,'Defense','Garrison',cfg({magicExists:false}),null)).toBeGreaterThan(0)` only proves non-zero on one un-listed pair. So the four `[cat, name]` pairs this test enumerates have NO drift protection at all.

**Sharpened by contrast.** The sibling test at line 270 — also titled `NO-DRIFT` — pins `.toBe(0)` against a literal. It is a real pin. Line 282 is the same author, the same file, the same intent, executed vacuously.

### V-9 · `tests/domain/negotiationPictures.test.js:377` — **LOAD-BEARING**
```js
expect(JSON.stringify(materializeCarriedTermSheet({ termSheet: agreed, homeTick: 40 })))
  .toBe(JSON.stringify(materializeCarriedTermSheet({ termSheet: agreed, homeTick: 40 })));
```
Test: `it('rejects pre-stamped authority clocks, malformed provenance, and arrival before agreement')`

**Why it cannot fail.** Same call, twice. **And the vacuity has a second floor**: `JSON.stringify(null)` is the string `'null'`, so the assertion passes as `'null' === 'null'` when the function returns null for both operands.

**Concrete broken scenario it survives — the sharpest finding in this report.** This line is positionally the LIVENESS ANCHOR for the three `toBeNull()` assertions above it (lines 374-376): `homeTick: 40` is the accepted case, proving the three refusals measure the guard rather than a function that refuses everything. Suppose a provenance check is inverted and `materializeCarriedTermSheet` returns `null` for every input. Line 376 (`homeTick: 11` → null) passes. Line 377 passes, because both sides stringify to `'null'`. The test reports that arrival-before-agreement is correctly rejected while the function has stopped working entirely. The anchor is the one line that exists to exclude precisely this, and it excludes nothing.

### V-10 · `tests/domain/brokerageServices.test.js:428` — **REDUNDANT**
```js
expect(JSON.stringify(advance(DARK_RULES).next)).toBe(JSON.stringify(advance(DARK_RULES).next));
```
Test: `test('DORMANCY — a dark advance hands the belief engine its own object, by identity')`

**Why it cannot fail.** Same call twice, and `JSON.stringify(undefined)` is `undefined` on both sides, so it passes even when `.next` does not exist.

**Concrete broken scenario it survives.** `advance()` stops returning a `next` at all on the dark path. Passes. The title's claim is *identity* (`toBe` against the input object), which a structural JSON comparison of two fresh calls cannot express.

**REDUNDANT** because the test's real work is done above by `expect(same).toBe(maps)` plus a correctly-built liveness anchor (`expect(moved).not.toBe(maps)`). That pair is a model of the idiom; line 428 is a dead appendix to it.

### V-11 · `tests/lint/hookThemeTotality.walker.test.js:145` — **REDUNDANT**
```js
expect(themeOfText(anchorTemplate), 'anchor: a real template must classify').toBe(
  themeOfText(anchorTemplate),
);
```
Test: `test('HK-LAW-3: free prose and near-miss prose are UNTYPED — the lookup is exact, never fuzzy')`

**Why it cannot fail.** Same call twice. The test's own comment declares this line's job — "The liveness anchor for every negative below: a real template DOES classify through this same call, so 'untyped' here measures exactness rather than a dead lookup table" — and the line does not do that job.

**Concrete broken scenario it survives.** `themeOfText` returns `UNTYPED` for everything. Every negative below (three `toBe(UNTYPED)` assertions) passes, and this anchor passes too.

**REDUNDANT** because line 147 — `expect(isHookTheme(themeOfText(anchorTemplate))).toBe(true)` — is a correct anchor for the same claim and reds on that scenario. The negatives are anchored; the line labelled "anchor" is not the one doing it.

---

## BY DESIGN — vacuous and honest (5 sites, not defects)

Five `expect(true).toBe(true)` sites, each the terminal line of a test whose title declares it a diagnostics printer:

| File:line | Title |
|---|---|
| `tests/copy/spellBreakCensus.test.js:307` | `diagnostics (printed so the burn-down list can be re-checked)` |
| `tests/simulation/cacophonySoak.test.js:158` | `diagnostics (printed for the architect to sanity-check the band)` |
| `tests/simulation/discourseParity.test.js:245` | `diagnostics (printed so the architect can re-check the band and read sample prose)` |
| `tests/simulation/emergentArcSoak.test.js:306` | `diagnostics (printed so the architect can re-check the measured band)` |
| `tests/simulation/narrativeParity.test.js:530` | `diagnostics (printed so the architect can re-check the measured band)` |

These are a deliberate "run this body for its console output" idiom. No cure is wanted; they need an explicit exemption marker so a walker can hold the rest of the class at zero.

## DECLARED AND MITIGATED — empty-subject loops (2 sites, not defects)

Both iterate a `Object.freeze([])` manifest, so the loop body never runs.

- `tests/lint/engineTelemetryWall.walker.test.js:224` (`ARM_A_EXEMPTIONS`, declared empty at line 102). The test says so in prose — *"The live list is EMPTY by measurement, so the arm's proof is its controls"* — and supplies three CONTROL assertions that do execute. **This is the estate's existing cure idiom for the class and should be the model the walker's exemption marker formalises.**
- `tests/lint/sovereigntyLightingContract.walker.test.js:7547` (`UNBUILT_EVIDENCE_ADDRESSES`, declared empty at line 1719). The loop asserts a subset relation whose subject is empty — trivially true, and harmless: the surrounding assertions (the exact three-address literal, and the absent/unbuilt reconciliation at 7560) carry the door.

---

## SUSPECTED — cannot be confirmed without running the suite (forbidden this lane)

All are of the **gated-assertion** family: every `expect` in the test sits inside an `if`, so a fixture that never satisfies the gate asserts nothing. 43 such tests exist corpus-wide. Confirming any of them requires observing that the gate is never taken, which needs execution. These four are the ones with no visible anchor:

| Site | Gate | If the gate is never taken |
|---|---|---|
| `tests/domain/embattlement.test.js:122` | `if (rec) expect(rec.phase).toBe('calm')` | `stepEmbattlement` returning null for all 12 jitter steps makes the whole hysteresis test assert nothing. No anchor proves `rec` is ever truthy. |
| `tests/domain/guidanceRegistry.walker.test.js:148` | `if (w.glossaryRef != null)` | No whisper carries a `glossaryRef` ⇒ the string-anchor law is untested. |
| `tests/joins/mutationOrder.test.js:97` | `if (rosterAt[name] !== prev)` | The roster never changes across the traced chain ⇒ the "no undeclared mutator" fence is untested. |
| `tests/ui/compendiumMonsterThreat.test.jsx:52` | `if (m)` on a `/threat:\s*([a-z]+)/` match | No archetype condition mentions a threat ⇒ the phantom-arm check is untested. |

**The counter-idiom already exists in the estate** and is the recommended cure for all four: `tests/domain/townCartographyDefenses.test.js` gates its assertion the same way at line 147, and then adds a sibling test literally named *"the unwalled case is actually exercised by the corpus (anti-vacuity)"* which proves the gate is taken.
