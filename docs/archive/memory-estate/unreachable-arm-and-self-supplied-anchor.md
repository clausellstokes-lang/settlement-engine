---
name: ""
metadata: 
  node_type: memory
  title: An unreachable arm reads as an unpinned one; and an anchor the test supplies itself
  date: 2026-08-07
  commits: "b28354f1, 0fbe14e6, 4269049a, 9d474834 (branch claude/composite-r4)"
  tags: 
    - hazard
    - pin-vacuity
    - dead-arm
    - anchored-negatives
    - ratchet
    - espionage
    - ES-5
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T09:20:40.245Z
---

# Two vacuity shapes the ES-5a repair round proved by execution

## 1. ⚠⚠ A DOOR ORDER CAN MAKE A CLOSED-VOCABULARY ARM STRUCTURALLY UNREACHABLE

`dispatchCadenceFor` (espionageDoctrineStage.js) tested an ALREADY-RUNNING door and
returned a hardcoded verdict for every `dispatched === true` call, BEFORE calling
`deliberationRead`. That read produces `wait_expired` ONLY for a dispatched court, so the
door consumed the entire population the arm can ever be computed for.

**A TERM THAT CAN ONLY EVER BE UNREACHABLE IS NOT AN UNPINNED ARM, AND A GREEN BATTERY
CANNOT TELL THE TWO APART.** "No test reaches it" and "no input CAN reach it" produce the
identical green. Every ES-5a pin passed over it without a word.

**How to apply.** When a function returns words from a closed vocabulary, pin a
REACHABILITY CENSUS derived from the vocabulary's own totality export (here
`DELIBERATION_VERDICTS`), not one more example: walk the input grid and assert the emitted
SET equals the totality. Executed evidence that this matters: at the shipped order a
4,860-cell grid returned `act_now` 2,808 / `dispatch_and_wait` 2,052 / `wait_expired`
**0**. Also run the two orders side by side and diff the OUTPUT, not just the counts —
here `dispatchDiffs: 0` proved the repair moved labels only.

## 2. ⚠⚠ AN ANCHOR THE TEST APPENDS TO THE SUBJECT IS A TAUTOLOGY

ES-5a wrote `expectAbsentWithAnchor([...TELL_TERMS_ABSENT, 'overdueForeignNotables'],
'overdueNotables', 'overdueForeignNotables', …)`. The anchor is added to the collection ON
THE ASSERTION LINE, so the liveness half can never fail.
`tests/helpers/anchoredNegatives.js` names this verbatim: *"A hardcoded constant that the
pipeline never touches is not an anchor — it re-introduces the vacuity one level up."*

**PROVED BY A PAIRED MUTANT, which is the technique worth reusing.** Empty the collection
at the source, then run BOTH assertion spellings against that same emptied world:
- new form (collection = a real pipeline read, anchor = a real member) → RED on the
  helper's own LIVENESS ANCHOR message.
- ES-5a's form → **10 passed / 10, GREEN against a register with nothing in it.**

One edit apart, only one can see it. That pair is what turns "the finding is real" from
reading into execution.

## 3. ⚠ THE `// anchored:` MARKER MUST BE ON THE IMMEDIATELY-PRECEDING LINE

`tests/lint/negativeAssertionAnchor.walker.test.js` tests
`ANNOTATION_RE.test(lines[i - 1])`. A two-line comment whose FIRST line carries
`// anchored:` does NOT count — the line immediately above the assertion is then ordinary
prose. Cost a full round-trip. Always end the comment block with the `// anchored:` line.

## 4. ⚠ A LOOP-BODY NEGATIVE IS VACUOUS OVER AN EMPTY COLLECTION

`for (const line of xs) expect(line).not.toMatch(/\d/)` asserts NOTHING when `xs` is
empty, and no annotation makes it true — the vacuity is in the LOOP, not the matcher.
Assert non-empty BEFORE iterating.

## 6. ⚠⚠ A PIN AUTHORED **PAST ITS OWN TRIGGER** IS GREEN FOREVER

Found at the HB+WC+EP fold, 2026-08-07. WC §7.E specified a seam pre-pin in the TR-5 pattern:
*"a pin that reds when SP-D lands without consuming it."* **SP-D had ALREADY LANDED**
(`errandSpineEnabled` live at `errandMint.js:76`), so a pin authored that day was authored
past the event it watches for — it can never fire, and it certifies nothing while looking
like coverage. The cure was to REPLACE the pre-pin with a discharge obligation naming the
counterpart that exists and what consumes it, not to write the pin the document asked for.

**This is the temporal sibling of §1.** There the arm was unreachable in the INPUT space;
here it is unreachable in TIME. Both produce the identical green, and a document that
specifies a pin is not evidence the pin is still writable.

**How to apply.** Before authoring any "reds when X lands" pin, **check whether X has already
landed.** If it has, the pin is dead on arrival — convert it to a discharge obligation that
asserts the counterpart's presence, which is a claim that can actually fail. ⚠ An architecture
document written before a dependency landed keeps specifying the pre-pin forever; the document
is not wrong, it is STALE, and only the tree can tell you which.

## 5. THE RED-RATCHET DIFF CAUGHT THIS ROUND GROWING ITS OWN RATCHET

The round that REPAIRED an anchored-negative vacuity added five un-anchored negatives.
`negativeAssertionAnchor` is red at both ends, so its row was byte-identical throughout
while its contents went 75 → 77. `sh scripts/ratchet-inventory.sh <walker> <base>` named
both rows and every line. Run it at wave end, always — and note it is BLIND on
`seedLoopTotality` and `proseNumerics`; for those, diff the cardinality out of two
full-suite logs archive-vs-archive (413 vs 413 and 8/1 vs 8/1 here).

## 6. THE WALKER RECOGNISES THE HELPER, NOT THE IDEA (2026-08-12, schema-6 mint)

A hand-rolled pair is NOT accepted, however correct it is. The schema-6 code half
wrote the right thought as two adjacent lines:

```js
expect(CLASS_A_PROTECTED_IDENTITIES).not.toContain('factions on locks');
expect(CLASS_A_PROTECTED_IDENTITIES).toContain('institutions on locks');  // the anchor
```

`negativeAssertionAnchor.walker.test.js` convicted the first line anyway and reported
`1 un-anchored negative assertion(s) at line(s) 997 (frozen ceiling 0)`. It matches on
the CALL SHAPE, so only three things clear it:

- `expectAbsentWithAnchor(collection, member, anchor, context)` — a SELECTION;
- `expectPresentThenAbsent(before, after, member, context)` — a TRANSITION;
- `// anchored: <reason>` on the assertion line or the one IMMEDIATELY above.

**Reach for the helper before the escape hatch.** Rewriting the pair above as
`expectAbsentWithAnchor(CLASS_A_PROTECTED_IDENTITIES, 'factions on locks',
'institutions on locks', 'CR-OSR-SCHEMA-6 re-triage')` was strictly stronger than the
hand-rolled version — the helper also refuses a subject that cannot answer `toContain`
at all, which the hand-rolled pair silently tolerated.

⚠ **IT IS A FULL-GATE-ONLY RED IF YOU DO NOT LOOK FOR IT.** This walker is not in the
OSR family, so a lane running only its own focused suites lands green and discovers it
20+ minutes later inside `test:ratchet`, reported as `TEST REGRESSIONS … NOT in the
frozen census`. **Any commit that adds a `not.toContain` / `not.toMatch` /
`not.toHaveProperty` should run `npx vitest run
tests/lint/negativeAssertionAnchor.walker.test.js` before landing** — it costs 400 ms.

⚠ The cure commit is safe to land ON TOP of an OSR mint rather than amended into it:
`tests/` is not one of the eleven `scannerToolFiles()` paths, so no test edit can move
`detectorTreeDigest`. Amending would have been the real hazard — the genesis baseline
content-addresses the code half's sha in both `frozenAtSha` and
`migrationReview.subjectSha`.
