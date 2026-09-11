# Receipt — §913 car 11 (lane L-MAT-FIX): the mutation-coverage entry the new security test owes

Seat: Opus 5 — implementer (Fable-unvalidated). Dock:
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT`
(detached HEAD worktree). The main tree was never touched.

**Dock tip started from** — `git log --format='%h %s' -3`, verbatim:

```
167887d38 §913 L-MAT landing (register car 3): the edge-shared bundles rebuild at the tip — aiGrounding's sourceHash 20a25783c91da70a -> 7f6db544ccb813f0; the four sibling hashes byte-identical, re-stamped in one build window
34fb45c38 §913 L-MAT landing (register car 2): writer-reach re-takes its provenance at the tip; no other register moved
62f201796 §913 L-MAT landing (register car 1): the lighting census refreezes at the tip — titles 23665 -> 23707 (+42 it() titles: the L-MAT cars' +28 in two new files and two grown ones, and the L-MAT-FIX cars' +14 in the same files), files 2543 -> 2545, credited 2170 -> 2172, suiteTitles 6335 -> 6342; parked unchanged
```

`git status --porcelain` at start: empty. `git rev-parse HEAD` = `167887d38a1de8291f1e8a2411aa9d2dd3fedf6c`.

Runner count before EVERY vitest run below (`ps -axo command | grep -E "[v]itest" | grep -v gate-mutex | wc -l`) printed `0`, measured immediately before each run. Five vitest invocations total, all single-file; no whole-suite run.

---

## 0. THE RED BEING CURED — measured in the dock, verbatim

`npx vitest run tests/lint/mutationCoverageManifest.test.js` (runners: 0):

```
 RUN  v4.1.11 /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT

 ❯ tests/lint/mutationCoverageManifest.test.js (10 tests | 1 failed) 35ms
     × TOTALITY: every enumerated invariant file has a manifest entry 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > TOTALITY: every enumerated invariant file has a manifest entry
AssertionError: 
Invariant test file(s) with NO mutation-coverage entry. For each: plant a regression in scripts/mutation-sweep.sh proving it reds (preferred), or add a rationale entry to scripts/mutation-coverage-manifest.json with a written reason. Do NOT add it as uncovered — the gap list only shrinks:
tests/security/livingContentRosterPublicDrop.test.js
: expected [ Array(1) ] to deeply equal []

- Expected
+ Received

- []
+ [
+   "tests/security/livingContentRosterPublicDrop.test.js",
+ ]

 ❯ tests/lint/mutationCoverageManifest.test.js:89:7
     87|       + `rationale entry to scripts/mutation-coverage-manifest.json wi…
     88|       + `Do NOT add it as uncovered — the gap list only shrinks:\n${mi…
     89|     ).toEqual([]);
       |       ^
     90|   });
     91|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 9 passed (10)
   Start at  20:46:08
   Duration  215ms (transform 27ms, setup 30ms, import 52ms, tests 35ms, environment 0ms)
```

Exactly the red the brief names, and no other arm was red.

---

## 1. THE PLANT CHOSEN — candidate (i), the chair's preferred one

`kind: "mutation"`. No rationale was needed: candidate (i) applied byte-exactly and
reds, so the fallback was never reached.

**Target line, quoted verbatim from `src/domain/display/publicSafe.js` at HEAD (line 60, inside `PUBLIC_TOPLEVEL_KEYS`):**

```
  'structuralViolations', 'thesis', 'tier',
```

Anchor uniqueness measured before use: `grep -c "'structuralViolations', 'thesis', 'tier'," src/domain/display/publicSafe.js` => `1`; the same grep across `src/` => `1`. The anchor exists verbatim at HEAD.

**The perl line as shipped:**

```
perl -0pi -e "s/'structuralViolations', 'thesis', 'tier',/'structuralViolations', 'thesis', 'tier', 'customContentRoster',/" src/domain/display/publicSafe.js
```

**Label (the join key, unique across the sweep):**

```
security/the living-content roster becomes an allowlisted public key
```

`grep -c '^check_caught' scripts/mutation-sweep.sh` => `88` before, `89` after.
`grep -c 'security/the living-content roster becomes an allowlisted public key' scripts/mutation-sweep.sh` => `1`.

---

## 2. (b) PLANTED — the mutation applied, and what it reds

`git diff --quiet -- src/domain/display/publicSafe.js; echo $?` => `1` (the plant applied).

`git diff -- src/domain/display/publicSafe.js`, verbatim:

```
diff --git a/src/domain/display/publicSafe.js b/src/domain/display/publicSafe.js
index bdeafe467..c5930e2aa 100644
--- a/src/domain/display/publicSafe.js
+++ b/src/domain/display/publicSafe.js
@@ -57,7 +57,7 @@ export const PUBLIC_TOPLEVEL_KEYS = Object.freeze([
   'npcs', 'population', 'populationHistory', 'powerStructure', 'pressureSentence',
   'prominentRelationship', 'relationships', 'resourceAnalysis', 'schemaVersion', 'settlementReason',
   'simulationVersion', 'spatialLayout', 'stress', 'stressors', 'structuralSuggestions',
-  'structuralViolations', 'thesis', 'tier',
+  'structuralViolations', 'thesis', 'tier', 'customContentRoster',
 ]);
```

`npx vitest run tests/security/livingContentRosterPublicDrop.test.js` (runners: 0), verbatim:

```
 RUN  v4.1.11 /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT

 ❯ tests/security/livingContentRosterPublicDrop.test.js (6 tests | 2 failed) 418ms
     × the roster and the provenance receipt are NOT allowlisted top-level public keys 5ms
     × ⭐ BEHAVIOURAL: a LIT world really carries a roster, and the default projection drops it 144ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/security/livingContentRosterPublicDrop.test.js > O-11 path 1 — the living-content roster is dropped from the public projection > the roster and the provenance receipt are NOT allowlisted top-level public keys
AssertionError: EXCLUSION [PUBLIC_TOPLEVEL_KEYS]: the member is present in a collection that is supposed to exclude it (the anchor sibling proves the collection is live).: expected [ 'activeConditions', …(38) ] to not include 'customContentRoster'
 ❯ expectAbsentWithAnchor tests/helpers/anchoredNegatives.js:132:9
    130|     `EXCLUSION${where}: the member is present in a collection that is …
    131|     + ` it (the anchor sibling proves the collection is live).`,
    132|   ).not.toContain(member);
       |         ^
    133| }
    134|
 ❯ tests/security/livingContentRosterPublicDrop.test.js:120:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  tests/security/livingContentRosterPublicDrop.test.js > O-11 path 1 — the living-content roster is dropped from the public projection > ⭐ BEHAVIOURAL: a LIT world really carries a roster, and the default projection drops it
AssertionError: EXCLUSION [default public projection]: the member is present in a collection that is supposed to exclude it (the anchor sibling proves the collection is live).: expected [ 'activeConditions', …(32) ] to not include 'customContentRoster'
 ❯ expectAbsentWithAnchor tests/helpers/anchoredNegatives.js:132:9
    130|     `EXCLUSION${where}: the member is present in a collection that is …
    131|     + ` it (the anchor sibling proves the collection is live).`,
    132|   ).not.toContain(member);
       |         ^
    133| }
    134|
 ❯ tests/security/livingContentRosterPublicDrop.test.js:146:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 4 passed (6)
   Start at  20:46:48
   Duration  1.49s (transform 689ms, setup 24ms, import 953ms, tests 418ms, environment 0ms)
```

**planted => 2 red of 6**, titled:

1. `the roster and the provenance receipt are NOT allowlisted top-level public keys` (line 116)
2. `⭐ BEHAVIOURAL: a LIT world really carries a roster, and the default projection drops it` (line 128)

Green under the plant, and this is what makes the named red attributable rather than a
whole-file collapse: the provenance arm (155), the denylist-census arm (166), the
R-D recorded arm (218) and the DM-FULL arm (234). The chair's hypothesis for
candidate (i) was measured EXACTLY right — both predicted arms red, nothing else.

Candidate (ii) (striking the full-mode `delete clone.customContentRoster`) was NOT
shipped, per the brief's "choose (i) unless it fails to apply byte-exactly or fails to
red". It applied and it reds is untested — it was not needed and was not measured;
that is stated so it is not read as a measurement.

`grep -c '^ *FAIL ' <planted output>` => `2`, one per failing arm, each line ending in
its own distinct title — which is why the 4th argument (ONE title) matches exactly one
line, as check_caught demands.

**Title given as check_caught's 4th argument** (the BEHAVIOURAL arm, chosen over the
constant-only arm because it is the one that proves the projection's behaviour rather
than the shape of a frozen array):

```
⭐ BEHAVIOURAL: a LIT world really carries a roster, and the default projection drops it
```

---

## 3. (c) RESTORED — byte-identical, and green

`git checkout -- src/domain/display/publicSafe.js`; then:

- `git status --porcelain` => empty (publicSafe.js not listed)
- `git diff --quiet -- src/domain/display/publicSafe.js; echo $?` => `0`

`npx vitest run tests/security/livingContentRosterPublicDrop.test.js` (runners: 0), verbatim:

```
 RUN  v4.1.11 /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  20:47:01
   Duration  1.45s (transform 680ms, setup 22ms, import 937ms, tests 400ms, environment 0ms)
```

**restored => 6 passed.**

---

## 4. WHAT WAS WRITTEN

Two files, both inside the fence. `git diff --numstat`:

```
4	0	scripts/mutation-coverage-manifest.json
26	0	scripts/mutation-sweep.sh
```

The manifest moved **4 lines** (≤ 6 as the brief requires) and was edited BY TEXT — no
re-serialization. `node -e` round-trip: parses, `uncoveredBaseline = 186` untouched,
`invariants["tests/security/livingContentRosterPublicDrop.test.js"]` =
`{"kind":"mutation","label":"security/the living-content roster becomes an allowlisted public key"}`.

Manifest diff, verbatim (inserted alphabetically between `ipPrivacy.test.js` and
`mapForkXssChain.test.js`):

```
@@ -1579,6 +1579,10 @@
     "tests/security/ipPrivacy.test.js": {
       "kind": "uncovered"
     },
+    "tests/security/livingContentRosterPublicDrop.test.js": {
+      "kind": "mutation",
+      "label": "security/the living-content roster becomes an allowlisted public key"
+    },
     "tests/security/mapForkXssChain.test.js": {
       "kind": "uncovered"
     },
```

The sweep moved 26 lines: **25 for the new `# 74.` area** (appended after the file's
last block, the `# 73.` TE-GOLDEN-1 golden-freeze area, immediately before the results
echo) and **1 for a MUTATED_FILES row**.

⚠ THE MUTATED_FILES ROW WAS NOT IN THE BRIEF AND IS LOAD-BEARING. `src/domain/display/publicSafe.js`
was absent from the sweep's dirty-tree refusal list. That list is machine-pinned both
ways by the same manifest test's `DIRTY-GUARD TOTALITY` arm ("the refusal guard names
exactly the files the sweep mutates"), so shipping the plant without the row would have
traded one red for another — and, worse, the sweep would then `git checkout --` a file
it never proved clean, which is the uncommitted-work destruction that guard exists to
prevent. The row is inside the brief's fence (it lives in `scripts/mutation-sweep.sh`)
and is appended in area order, after `tests/fixtures/.golden-freeze-register.json`.

Numbering: the dock's last numbered block is `# 73.` (line 1016), so the new one is
`# 74.`, per the brief. Note the file already carries a mid-file `# 74.`–`# 79.` run and
two earlier `# 72.`/`# 73.` pairs — duplicate numbering is the file's existing state
across its appended sections, not something this car introduced, and the brief rules the
number.

---

## 5. (d) THE MANIFEST SUITE, GREEN

`npx vitest run tests/lint/mutationCoverageManifest.test.js --reporter=verbose` (runners: 0), verbatim:

```
 RUN  v4.1.11 /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT

 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > guard-the-guard: enumeration and label parsing are not vacuous 1ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > TOTALITY: every enumerated invariant file has a manifest entry 1ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > no stale entries: every manifest invariant key is an enumerated, existing file 3ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > every entry is well-formed (kind, label, rationale resolution) 0ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > LABEL JOIN: manifest mutation claims and sweep labels match one-to-one 0ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > DIRTY-GUARD TOTALITY: the refusal guard names exactly the files the sweep mutates 0ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > guard-the-guard: every guarded path exists (a typo guards nothing, silently) 0ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > THE ADMITTED-TREE CLAIM: every member still scans or executes its subject and asserts 23ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > THE PLANTED CONTROL: the coupling predicate refuses a member that reaches nothing 0ms
 ✓ tests/lint/mutationCoverageManifest.test.js > mutation-coverage manifest — the totality contract (E-A) > SHRINK-ONLY: uncovered count equals uncoveredBaseline exactly 0ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  20:48:20
   Duration  192ms (transform 21ms, setup 23ms, import 52ms, tests 30ms, environment 0ms)
```

All ten arms green — TOTALITY (the red is cured), LABEL JOIN (the label exists once in
the sweep and is claimed by exactly one entry), DIRTY-GUARD TOTALITY (the new
MUTATED_FILES row), SHRINK-ONLY at 186 (the baseline did not move — the entry is
`mutation`, never `uncovered`), well-formedness and both guard-the-guard arms.

---

## 6. (e) THE SCRIPT IS STILL A SCRIPT

```
$ sh -n scripts/mutation-sweep.sh
$ echo $?
0
$ [ -s scripts/mutation-sweep.sh ] && echo "non-empty: yes"
non-empty: yes
```

---

## 7. (f) THE PLANT RUN THROUGH check_caught ITSELF — end-to-end attribution

The brief's inline idiom failed on this machine's `/bin/bash` (GNU bash 3.2.57): a
`source <(sed -n …)` process substitution left `check_caught` undefined ("check_caught:
command not found", PASS=0 FAIL=0, and the plant was left applied — it was restored
immediately with `git checkout --` and the tree re-verified clean before continuing).
Extracting the function to a temp file and sourcing THAT works. Same function text,
same arguments; `MUTATION_SWEEP_ALLOW_DIRTY` explicitly unset so both of check_caught's
own git guards were live.

```
$ /bin/bash e2e-check.sh          # sed -n '/^check_caught()/,/^}/p' → temp file → . file
CAUGHT  ok   security/the living-content roster becomes an allowlisted public key
PASS=1 FAIL=0
porcelain for publicSafe.js: []
```

`CAUGHT` is the strong result, not merely a red: it means check_caught measured
mutated=red AND clean=green AND — because the 4th argument was given — that exactly ONE
`FAIL … > <title>` line ended in the named title. Attribution is proved end to end, and
the function's own byte-identical-restore check passed (`porcelain … []`).

---

## 8. FENCES HELD

- Files changed: `scripts/mutation-sweep.sh`, `scripts/mutation-coverage-manifest.json`. Nothing else.
- `src/domain/display/publicSafe.js` was mutated transiently four times and restored four times; at commit `git diff --quiet -- src/domain/display/publicSafe.js` => `0` (byte-identical to HEAD).
- The test file was not edited. `supabase/`, `tests/lint/.lighting-census-baseline.json`, `scripts/.writer-reach-baseline.json` and every other register untouched.
- No whole-suite run. No `git stash`, no `git add -A/-u/.`, no rebase, no amend, no push.
- The main tree `/Users/cstokes/Desktop/settlement-engine` was never touched.
- `git status --porcelain --untracked-files=all` before staging listed exactly the two intended files and zero untracked files.

---

## 9. THE CAR

Staged explicitly: `git add scripts/mutation-sweep.sh scripts/mutation-coverage-manifest.json`.

**Car sha: `85cb87928` (`85cb879286f2fc95893086c0e5fa46a0e96d6f03`), one car over the
dock tip `167887d38`.**

`git show --stat --format='' HEAD`, verbatim:

```
 scripts/mutation-coverage-manifest.json |  4 ++++
 scripts/mutation-sweep.sh               | 26 ++++++++++++++++++++++++++
 2 files changed, 30 insertions(+)
```

Trailers on the car, verbatim (`git log -1 --format='%B' | tail -5`):

```

Seat: Opus 5 — Fable-unvalidated
Lane: L-MAT-FIX
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

`git status --porcelain --untracked-files=all` after the commit: **empty** — porcelain
clean, zero untracked files. No push, no stash, no rebase, no amend; the dock stays
detached at this car.

---

## 10. WHAT COULD NOT BE DONE

- **Nothing in the brief was left undone.** Steps (a)–(f) all executed, (f) included.
- The only deviation is the one recorded in §7: the brief's inline `source <(…)` idiom
  for step (f) does not work under this machine's `/bin/bash` 3.2.57, so the same
  function text was extracted to a temp file and sourced from there. The proof is the
  brief's proof, not a weaker substitute — same function, same four arguments, both git
  guards live, `CAUGHT ok` returned.
- Candidate plant (ii) (striking the full-mode `delete clone.customContentRoster`) was
  never measured — candidate (i) applied byte-exactly and red, which the brief makes the
  stopping condition. Recorded so no one reads (ii) as tested.
- Out of scope by fence and NOT addressed by this car (already recorded in the test file
  and unchanged by it): the SERVER twin of the DM-full drop, `_gallery_dm_full_json`
  (supabase migrations 121/129), still re-issues both keys. It is a migration and is
  owner-gated. This car adds no coverage for it and makes no claim about it.

