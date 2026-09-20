# Lane 37 → lane 36: the one-line tier-noun patch for `src/components/new/tabs/PowerTab.jsx`

Lane 36 owns this file, so lane 37 did not edit it. NOT URGENT AND NOTHING IS RED: the power
desk's SCREEN is already correct, because `weaveBlock` still speaks the settlement's noun as
the documented backstop. What is missing is only desk↔screen AGREEMENT, which no arm measures
on this tab today. Apply whenever convenient.

Context: commit 79b143dae (`fix-run9-2026-09-19`). `composeStateProse` now speaks the
settlement's own tier noun when the caller's option bag carries `tierNoun`, so the sentence
the DESK returns is the sentence the screen renders. Every other reader-facing desk bag on the
dossier already carries it.

```diff
--- a/src/components/new/tabs/PowerTab.jsx
+++ b/src/components/new/tabs/PowerTab.jsx
@@ line 16
 import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
+import { tierNounFor } from '../../../domain/display/stateProse/weaveBlock.js';
@@ line 240
-    : powerStateProse(s, deskReadings, { seed: String(s?._seed ?? s?.id ?? ''), audience });
+    : powerStateProse(s, deskReadings, {
+      seed: String(s?._seed ?? s?.id ?? ''), audience, tierNoun: tierNounFor(s?.tier),
+    });
```

Proof it needs: `npx vitest run tests/ui/powerTabFlow.test.js` (or whichever tab-flow suite
covers PowerTab) plus `tests/domain/powerStateProseDesk.test.js`. Neither should move — the
desk test passes no `tierNoun`, so the desk answers in the corpus's own words there, and the
screen renders the same bytes it does today because `speakTierNoun` is idempotent.
