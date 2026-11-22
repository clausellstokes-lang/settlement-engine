# Settlement editor / wave 1 — EM-B3: SPLIT RECORD

- **Status:** `SUPERSEDED`
- **Packet version:** `1`
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Superseded by:** `EM-B3b` (lands first) and `EM-B3a` (lands second)
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

This file exists so the charter's `EM-B3` id is not orphaned. **It is not dispatchable.** Its
compile, its measurements and its four blocks are preserved in `EM-B3.evidence.md` (E0–E19),
which both successors cite; its manifest entry is kept beside it as
`EM-B3.superseded.manifest.json`.

## Why it split

Compiled BLOCKED on four measured contradictions. The chair ruled all four on 2026-09-19
(ODQ §934.36 addendum, consist `7aa769830`) and, in accepting **K2**, added the
rehearsal-train registration to EM-B3's charge with a standing instruction to split if that
overran the budget. **It overran three independent ceilings**, measured at the base:

| Ceiling | Budget | Combined EM-B3 | Measurement |
|---|---:|---:|---|
| Existing logic-bearing production files modified | `<=3` | **4** | `publicSafe.js` + `worldSnapshotPublic.js` + `accountData.js` + `scripts/ops/migrationRehearsalCore.mjs` (96 branch tokens, 9 exported functions incl. `buildMigrationRehearsalPlan`) |
| Acceptance cases | `<=8` | **9** | the veil/travel eight plus the rehearsal plan's own |
| Behaviour families | `1` | **2** | the veil-and-travel family, and the migration-train registration family — different reviewer (the owner's hand), different proof, different failure mode |

## The two halves, and why the order is what it is

| | Packet | Carries | Files |
|---|---|---|---:|
| **first** | **`EM-B3b`** | migration `202` (the third denylist mirror), its `MIGRATION_WAVES` row and repo head, the rehearsal test's figures, the three doc heads; `supabase/applied-head.json` stays **200** | 6 (3 DOC) |
| **second** | **`EM-B3a`** | the client `decrees` token, both public projections naming the keys, the export omit, the runtime travel test, the persistence round trip | 5 |

⭐ **B3b lands FIRST, and that is measured rather than stylistic.**
`tests/security/snapshotDenylistDrift.test.js` asserts only that every CLIENT token is denied
by the net-current SQL scanner — three tests read whole, no SQL-side subset arm (E6). So a SQL
alternative with no client token reds **nothing**, while a client token with no SQL alternative
reds. In this order the split costs **zero** interior reds; in the other it would carry a red
spanning two members.

The two manifests share **no change path** (checked), so neither reserves a path the other
needs and `validate:packets`' status-sequence simulation is clean at every intermediate state.

## The four rulings, as the successors carry them

- **K1 ACCEPTED** — `partializeStoreState` is a PRESERVE; the charter's `persistProjection` row is struck and ARCH §3's persisted-key-instrument claim withdrawn. No store-root key is minted. (EM-B3a §1, §5, §11.)
- **K2 ACCEPTED** — `decrees` joins the client denylist WITH migration `202`; the deploy is the owner's hand and `supabase/applied-head.json` stays 200. (EM-B3b, whole.)
- **K3 ACCEPTED** — the `EXPLAINED_WRITER_EXEMPTIONS` mint leaves EM-B3: EM-B2 owes `dmLayer on settlement`, EM-C1 owes `decrees on settlement`. (EM-B3a §1, §11.)
- **K4 RULED** — the `importScrub` strip is deferred defense-in-depth, recorded and not built. (EM-B3a §2 non-goals and §12 out-of-scope.)

**Judgment calls: NONE.**
