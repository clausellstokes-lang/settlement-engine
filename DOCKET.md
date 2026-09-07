
## 2026-09-05 — an UNDECLARED, ad-hoc package the whole suite depends on
`tests/security/customContentLockOrder.postgres.test.js` does an UNGUARDED top-level
`import { Client } from 'pg'`, and **`pg` is not in `package.json`** at all. It only ever worked
because the lane docks carried an ad-hoc install; a dock built from the main repo's `node_modules`
(or any fresh checkout) fails to COLLECT that file, which trips the scope sentinel and blocks the
census totals with `TRUE_EXIT=1` and zero refusals — a confusing signature, because nothing is
actually failing.

Measured: the full suite reports exactly ONE uncollectable file, and `npx vitest list` reports zero
missing packages once `pg` is present. The test's own header says "CI supplies a disposable
PostgreSQL service for this test", so it is designed for an environment the local docks do not have.

**Cure shapes, none taken:** declare `pg` as a devDependency (⚠ a `package.json` byte change is a
MINT TRIGGER, so it is a landing act, not a casual one) · or make the import dynamic and skip the
suite when the driver or the service is absent, which is the honest shape for a CI-only test.
⛔ Do NOT paper over it with a per-dock `npm install --no-save`: that is what hid it, and running one
in the MAIN repo reconciles the whole tree (measured: added 23, removed 2, changed 162 packages,
434 → 452 entries) against a `node_modules` every dock symlinks. The byte budget survived that
(sizeBaseline 3/3, build exit 0, verify:dist clean) but it was verified AFTER the fact, not before.
