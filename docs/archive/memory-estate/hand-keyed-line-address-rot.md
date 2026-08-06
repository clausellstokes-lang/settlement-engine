---
name: hand-keyed-line-address-rot
description: "A `<module>.js:<n>` citation in prose or a comment is text ABOUT source that nothing compares TO source — all fifteen in src/domain/certification/ were stale and green, one PINNED by a test; cure = content anchor (module + backticked source token) + a zero-tolerance containment walker"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T21:02:51.589Z
---

# Hand-keyed line addresses rot silently, and a pin on one proves nothing

LANE KR, 2026-08-03, cured @ `51268f56` (+ ruling `f5582322`, ledger `1caf2fbe`).

## What bit

`src/domain/certification/` documents each subsystem row's gate by citing where
the pulse kernel reads it. Fifteen citations were spelled as LINE NUMBERS —
`pulseKernel.js:<n>` — in comments and in the rows' own `other` prose.

The cycle-16 K-2 verifier found ONE stale. **Re-reading each cited line against
the live kernel found the other fourteen: all fifteen were stale.**

- `:1838` (cited for the `allyIntel` gate, which lives at **1945**) is actually
  `settlementIds: thawDigest?.settlementIds || []`.
- `:422` (cited for the seasons gate at 438) is a bare `})`.
- `:392` (cited for the coup verdicts at 408) is a `@pulse-stage:` marker comment.

**The sharpest edge:** `tests/domain/subsystemRowsWar.test.js` asserted
`.other` `.toContain('pulseKernel.js:1838')` — a doc-text-to-doc-text comparison.
It was green for months while guarding nothing about the kernel it named. This is
the sibling of `[[filename-anchored-source-pin-vacuity]]`: there the pin broke on
relocation, here it never looked at the source at all.

## The cure (already the estate's idiom — ~45 sites)

`<module>.js` + a space + the source expression **in backticks**. Containment is
file-scoped, so any occurrence in the module satisfies it:

    pulseKernel.js `const seasonsOn = simulationRules.seasonsEnabled === true`

The war pin now asserts BOTH directions: the row carries the anchor, and
`sourceOf('…/pulseKernel.js')` contains the token.

## How to apply

- **Never write `<module>.js:<n>` in src or tests.** `tests/lint/pulseKernelLineAddress.walker.test.js`
  freezes the `pulseKernel.js:<digits>` shape at **ZERO** with no allowlist, and
  RULE 2 requires every content anchor to be contained in the module it names.
- Keep the marker **on one line** — the detector is `<base>[ \t]+\`token\``, so a
  comment prefix (` * `) between the basename and the backtick breaks recognition.
- To widen to another module, add one entry to the walker's `MODULES` map.
- **Self-exemption is not a hole here:** the walker builds the banned literal by
  CONCATENATION so it never appears verbatim in its own bytes, and discriminates
  containment against a plausible fiction (`seasonsDisabled`).

## Deliberately deferred — documented, not a bug to re-find

The wider `<module>.js:<n>` habit is live estate-wide (`seasons.js`,
`candidateEvents.js`, `warDeployment.js`, `navalKernel.js`, `generosityKernel.js`,
`roadsKernel.js`, `informationStatecraft.js`, `stressors.js`,
`moralInstitutionPressure.js`, `flows.js` — several in the very same files),
roughly **45 mixed literal/glob markers**. `pulseKernel` went first because THE
DECOMPOSITION WAVE churns it hardest.
