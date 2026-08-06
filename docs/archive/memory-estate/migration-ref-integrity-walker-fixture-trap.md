---
name: migration-ref-integrity-walker-fixture-trap
description: "⚠️ tests/security/migrationRefIntegrity.meta.test.js fails any quoted `NNN_*.sql` literal in ANY tests/security file that does not resolve to a real migration — so an INLINE TEST FIXTURE must never use a migration-shaped name (a '999_planted.sql' label reds the walker); use a non-filename label like '<planted fixture>'"
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-27T18:02:19.832Z
  originSessionId: 88199162-811c-4be3-8912-b0f33c64d43d
---

`tests/security/migrationRefIntegrity.meta.test.js` is the anti-vacuity walker for the
60+ `describe.runIf(existsSync(<migration>))` security suites: it scans every
`tests/security/**/*.test.js` for the literal `MIG_REF_RE = /['"`](\d{3}[A-Za-z0-9_-]*\.sql)['"`]/g`
and fails if the named file is absent from `supabase/migrations/`. It skips only itself.

**The trap.** The walker cannot tell a real reference from a synthetic one. Naming an
inline test fixture with a migration-shaped basename — e.g. passing `'999_planted.sql'`
as a label to an extractor under test — reds the walker with
`references supabase/migrations/999_planted.sql — which does not exist`, once per
occurrence. This bit while hardening `moneyRpcNetCurrentGuards.test.js` on 2026-07-27:
three fixture labels, three walker failures, and the focused two-file gate was green the
whole time because the walker lives in a different file.

**How to apply.** Any fixture, plant, or negative-control label inside `tests/security/`
must not look like `NNN_name.sql` in quotes. Use something that cannot be a filename —
`'<planted fixture>'` works and still reads well in assertion messages. Corollary: a
focused per-file gate cannot clear a change to a `tests/security/` file; the directory
gate (`npx vitest run tests/security/ --no-file-parallelism`, ~12 min under load) is the
one that sees this walker. Related: [[unanchored-net-current-extractor-class]],
[[lane-end-gate-gotchas]].
