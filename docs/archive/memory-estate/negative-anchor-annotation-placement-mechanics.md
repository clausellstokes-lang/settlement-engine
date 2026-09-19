---
name: negative-anchor-annotation-placement-mechanics
description: "The four non-obvious mechanics of the `// anchored:` escape hatch in negativeAssertionAnchor.walker — placement, self-conviction, cascade, and the ceiling trap"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7987e799-6091-4459-a738-834233f4840b
  modified: 2026-08-10T20:00:05.402Z
---

Re-armed `tests/lint/negativeAssertionAnchor.walker.test.js` on 2026-08-10 (47 new un-anchored
sites / 22 files → 0). **LANDED @ ca488ecf**, parent acb35412, 22 files, unpushed.
Four mechanics of the `// anchored:` hatch cost a full rework round each and are invisible
until they bite. The detector is a **plain line scan**:

```js
if (ANNOTATION_RE.test(line)) continue;              // same line
if (i > 0 && ANNOTATION_RE.test(lines[i - 1])) continue;  // ONE line of lookback
```
with `ANNOTATION_RE = /\/\/\s*anchored:/`.

⚠⚠ **1. THE TOKEN MUST BE ON THE *LAST* COMMENT LINE.** A multi-line rationale block whose
first line reads `// anchored: …` and whose continuation lines are ordinary prose does **NOT**
exempt the assertion — the line immediately above is the *continuation*, which carries no
token. This silently failed on 13 of 15 multi-line blocks in one pass. Write the prose
first and the `// anchored: <reason>` line LAST, directly above the assertion.

⚠⚠ **2. THE CURE CAN CONVICT ITSELF.** A comment that *spells* a scanned matcher with an open
paren — `not.toContain(`, `not.toMatch(`, `not.toHaveProperty(` — **is counted as a real site**
(the documented "matcher inside a comment" edge). Three of my own explanatory comments
("`expect(undefined).not.toHaveProperty(x)` passes") created brand-new violations. Say
"a negative property assertion against `undefined` passes" instead. This also convicted the
*other lane's* prose in the walker's own FROZEN map, which is how a 46-site brief measured 47.

⚠⚠ **3. AN INLINE ANNOTATION CASCADES DOWNWARD.** A trailing `// anchored:` on line N exempts
line N **and line N+1** (N+1's lookback sees it). Harmless in a ceiling-0 file; in a **ceiling
file it is the trap** — it silently anchors one more site than intended, the count falls BELOW
the frozen ceiling, and the *inventory-honesty* arm reds instead. In any file with a frozen row,
use a comment line ABOVE the target assertion, never an inline one.

⭐ **4. FIND THE *NEW* SITES IN A CEILING FILE BY LINE TEXT, NOT LINE NUMBER.** Ceilings are
per-file counts, so anchoring *any* N sites goes green — but anchoring the pre-existing ones
leaves the real newcomer unguarded. Diff the site list against the freeze sha (`36e50c73`,
the 2026-08-07 re-freeze) matching on trimmed **line text**; numbers churn. That located
exactly: envoyErrandLedgerSingleWriter 2 new of 3 (ceiling 1), testRatchet 1 of 3 (ceiling 2),
importReconciliationRpcProjection 1 of 5 (ceiling 4).

**MUTANT-PROVEN both directions** (2026-08-10): stripping three anchors reds the *new-site* arm
naming the exact file/lines; over-anchoring one pre-existing frozen site reds *inventory
honesty* ("LOWER the row to 3") **and** the non-vacuity arm (1563 < 1564). Run mutants inside a
held `gate-mutex --run` so the shared tree is never observably mutated by another lane, and
restore from checksummed copies verified with `cmp`.

⚠ After a full cure the totals sit at **exact equality** (live 1564 = frozen 1564). That is
correct but leaves zero slack: any further anchoring without lowering a row reds the
non-vacuity arm immediately.

⚠⚠ **THE COMMIT CARRIED A FOREIGN HUNK BY NECESSITY, AND IT WAS DISCLOSED.** ca488ecf's copy of
the walker also contains four lines from the step-15 ratchet-reconciliation lane lowering
`restoreFoodAnchorScope` 2 → 1. It could not be carved out (my annotation sits on the same
physical line as their note) and it is a **hard dependency**: at acb35412 that row said 2 while
the file held exactly 1 site, so inventory-honesty was ALREADY red, and 46 fresh anchors would
have driven live 1564 against frozen 1565 and reded non-vacuity too. Verified their lowering
correct before carrying it. ⭐ The general lesson: **before excluding a contested file from a
commit, compute whether the commit is GREEN without it** — here every exclusion option produced
a red commit, which is what forced the carry.

⚠⚠ **A PLUMBING COMMIT LEAVES THE SHARED INDEX ARMING A REVERSAL — it fired here.** After
`commit-tree` + `update-ref`, all 22 paths showed `MM`: the shared index still held the
PRE-commit blobs, so any other lane's `git commit -a` would have reverted the landing. Cure,
run immediately after the ref moves:
`git update-index --cacheinfo 100644,$(git rev-parse HEAD:<path>),<path>` for every path.
Status must then show your files ABSENT, not `M`/`MM`.

See [[epistemic-prevention-shipped]], [[unreachable-arm-and-self-supplied-anchor]],
[[walker-scan-textual-blindness-classes]], [[test-census-ceiling-forecloses-new-rows]].
