---
name: absolute-path-pin-poisoned-by-scratch-dir-name
description: "⚠⚠ An ABSOLUTE-path pin is sensitive to the name of the directory the checkout sits in — tests/architecture/archViewWall.test.js asserts govPath.includes('/arch/') === false, so a scratch `git archive` materialised into a dir named `arch` produced a FALSE RED that read exactly like a real architectural regression; never name a scratch tree after a token any pin matches on"
metadata:
  node_type: memory
  type: project
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T23:35:48.055Z
---

# A census taken in a throwaway tree can be poisoned by that tree's own path

## What happened (CONFIRMED, 2026-08-07)

A full-suite `npm run test:ratchet` run inside an integrity-counted `git archive` of
`36e50c73` reported three regressions absent from the census. One of them —

```
tests/architecture/archViewWall.test.js :: the K-5 governor module is view-only …
  lives outside the arch/ determinism perimeter in the view-policy layer
AssertionError: expected true to be false
```

— was **produced by the measuring apparatus, not by the tree**. The pin is:

```js
const govPath = join(ROOT, 'src/lib/townScene/adaptiveQuality.js');   // ABSOLUTE
expect(govPath.includes('/arch/')).toBe(false);
```

The scratch archive had been extracted into `…/minifold-ratchet-lane/**arch**/`, so the
absolute path contained `/arch/` and the pin fired. Renaming the scratch directory to
`tree/` cleared it with no source change.

## Why it is dangerous

The false red is **indistinguishable from a real architectural regression** by its
message, and it arrived mixed in with two genuine reds in the same list — so the natural
reaction is to "fix" a perimeter violation that does not exist, or to bank an attributed
census row for a defect that was never there. A phantom census entry can never be burned
down (the recorded rule that `NO row is attributed to a TIMEOUT` exists for the same
reason).

## How to apply

- **Never name a scratch/archive directory after a token a pin matches on.** Reserved
  words seen in this estate's pins so far: `arch`, `dist`, `src`, `generators`, `domain`,
  `node_modules`. Prefer a neutral name — `tree/`, `snapshot/`, `wt/`.
- When an archive run reports a regression the live tree does not, **suspect the path
  before suspecting the code**: re-run that one test file in the real worktree first.
- The general class: any pin that reasons over an **absolute** path leaks the host
  filesystem into the assertion. The durable cure is for such pins to compare a
  **repo-relative** path (`relative(ROOT, p)`), which is what the negative-assertion and
  seed-loop walkers already do. `archViewWall`'s pin has NOT been changed — it is a real
  latent trap for the next lane that archives into a badly-named directory.

## Related

Sibling of the "archive-census law" family: an archive must be `git init`ed and committed
or `edgeSharedBundleReproducibility`, `committedSecretsScan` and
`sovereigntyLightingContract` lie. Integrity-count every archive (`git ls-tree -r
--name-only <sha> | wc -l` must equal the extracted file count) — and now also **check the
extraction path's own name**.
