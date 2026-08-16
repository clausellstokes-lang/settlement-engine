# SK / SK-6 — the sensitive-seed ledger and its durable home (member 3 of `sk-b`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `6c2bedad2064a523b9e7f61d7e0f6e61f0571650`
  (the `sk-a` terminal)
- **Train:** `sk-b`, family **SK**, member **3** of 5.
- **Depends on:** SK-4.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§143.4** · §42/§43 · §131 ·
  the banked-failure identity law.
- **Compile of record:** `laneTC28-SK-PLAN.md` §4.3, annex row `SK.U3`.

---

## §1 ⭐ THE HOME, NAMED AT COMPILE AND STAMPED IN EVERY REPORT HEADER

```
${XDG_STATE_HOME:-$HOME/.local/state}/settlementforge/soak/
    seed-ledger.json
    capsules/<capsule-id>/
```

Outside both trees, outside every archive (the archive is deleted after the run), outside
`/tmp` (a reboot does not take it), XDG-conventional so the owner can find, back up or
delete it deliberately, and overridable by `SETTLEMENTFORGE_SOAK_STATE` for a lane that
needs isolation.

⛔ **An unwritable home is a HARD REFUSAL at startup with the path NAMED** — never a silent
fallback. A ledger that silently relocates reports the density of whatever survived, and
nobody would know it had moved. (**SK.U3**'s signed fork, executed as designed.)

## §2 ⛔⛔ THE FAILURE MODE IS SURVIVORSHIP BIAS, AND IT IS SUBTLE

Every individual rule looks reasonable; together they can make the instrument measure its
own history. Three guards, each pinned with the fixture that would otherwise let it rot:

- **A cancelled or superseded run leaves the ledger BYTE-IDENTICAL** — not "mostly
  unchanged". A cancelled run has completed only the sensitive head, so crediting it
  inflates exactly the historic seeds and starves the never-fired tail: survivorship bias
  manufactured by the cancellation policy itself. The same run, COMPLETED, does credit, so
  the guard discriminates on status rather than never crediting anything.
- **A KNOWN finding never re-counts.** Same tripwire, same cell, same tick band, standing
  capsule open — counting it again ranks a cell by how long its one open bug has been open.
  A DIFFERENT tick band is a different finding and does count.
- **Ordering never truncates.** It is a PERMUTATION, not a filter: the full grid always
  completes behind the sensitive head, so a seed that has never fired can still earn its
  first entry. Truncating would make the ledger self-fulfilling.

## §3 ⛔ KEYS ARE THE FULL CELL IDENTITY

`seed × config row × shape`, never the bare seed string — bare-seed keys smear density
across configs and rank a seed for a finding that only happened under one configuration.
The key IS the census key.

## §4 · VALUES (§42/§43)

| value | band | home |
|---|---|---|
| density decay | `density × 0.5^(runsSince / HALF_LIFE)`, `HALF_LIFE` `[5, 20]` default 10 | DERIVED-WITH-RATIONALE: the decay exists so an early accident does not pin the order forever; at the default a single firing drops below a fresh one after ~10 clean runs — one full ladder cycle. ⚠ **MARKED UNSOAKED (§43)**: no observed firing distribution exists, because nothing has soaked. Signed provisionally and **re-derived at the first clean full instrument**, folded into the same chair-signed act SK-5's freeze already requires. |

## §5 · SCOPE AND BOUNDARY

Nothing under `src/`. No flag. Harness-side JSON, never engine state, never user state.
**Same-seed: NEUTRAL.**

## §6 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the home is outside both trees and every archive, is overridable, and an unwritable one is a hard refusal naming the path |
| A2 | keys are the full cell identity, and two config rows on one seed are different keys |
| A3 | a cancelled or superseded run leaves the ledger byte-identical, while the same run completed credits |
| A4 | a known finding deduplicates against its standing capsule; a different tick band still counts |
| A5 | density decays, and ordering is a permutation that never truncates the never-fired tail |

## §7 · CHECKS

```
npx vitest run tests/soak-harness/seedLedgerDensity.test.js
```

## §8 · MUTANTS AND HAZARDS

- ⚠ The unsoaked marker is ASSERTED, so the half-life cannot later be quoted as fitted.
- ⚠ §102.3: `seedLedgerDensity.test.js` matches no `NAME_PATTERN` token ⇒ no row owed.
- ⚠ Census: one new test file, five titles, one suite title.
