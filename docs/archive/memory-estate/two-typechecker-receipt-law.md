---
name: two-typechecker-receipt-law
description: "⭐⭐ LAW landed 2026-08-07 at a223d368 in CONTRIBUTING.md + both ratchet script headers: `npm run check` runs TWO typecheckers (step 9 tsconfig.full.json, step 10 tsconfig.domain-strict.json) and THEY DISAGREE — the idiom sweep introduced 0 rows under one and 31 under the other. A typecheck figure without its config named is not a receipt; and a GREEN ratchet is NOT evidence nothing was introduced, because these ratchets compare PER-FILE COUNTS."
metadata:
  type: project
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T10:57:56.683Z
---

# A typecheck figure must name its config — and green ≠ nothing introduced

`npm run check` step 9 is `typecheck:ratchet` (`tsconfig.full.json`), step 10 is
`typecheck:domain:strict` (`tsconfig.domain-strict.json`). Measured across the
2026-08-06 idiom sweep's own window, both ends in integrity-counted archives of
the committed shas, diagnostics compared MESSAGE-NORMALIZED:

| `eca65c8a` → `1977db07` | errors | removed | introduced |
| --- | --- | --- | --- |
| `tsconfig.full.json` | 351 → 188 | 163 | **0** |
| `tsconfig.domain-strict.json` | 1303 → 1159 | 175 | **31** |

The sweep's `introducedCount: 0` was true of the config it measured and false of
the one it did not. Two of the 31 crossed a per-file ceiling and turned step 10
RED, which (the chain is `&&`) took lint/test/build/verify:dist dark behind it.

**Two separate traps, and the second is the subtle one:**

1. A figure with no config named reads as total and is not.
2. **29 of those 31 reddened NOTHING** — these ratchets compare PER-FILE COUNTS,
   so introduced rows that fit inside a file's existing slack are invisible.
   `introducedCount: 0` and "the ratchet is green" are different claims and
   neither implies the other. Report the exit status AND the introduced set.

**Blast radius is the whole compilation.** The file that reddened the gate,
`src/domain/worldPulse/peaceTerms.js`, appears in NO commit of that sweep. JSDoc
added to one file narrows inferred types that flow into files nobody opened, so
"I only touched my files" is not a safety argument — it is the signature of this
bug class.

**How to apply:** run BOTH `node scripts/check-domain-strict.mjs` and
`node scripts/check-full-typecheck.mjs` (each exit code read directly, never
through a pipe) before claiming a typecheck outcome; quote both totals; state
the WINDOW (`base → head` shas) alongside the introduced/removed counts, since a
wider window silently absorbs other lanes' commits. Full text lives in
CONTRIBUTING.md under "The gate" as THE TWO-TYPECHECKER RECEIPT LAW, with
pointers from the header of both ratchet scripts. Related:
[[receipt-vacuity-and-shared-ratchet-rules]], [[piped-gate-exit-masking]],
[[cycle2-lighting-road-recon]] (a red ratchet's contents grow invisibly).
