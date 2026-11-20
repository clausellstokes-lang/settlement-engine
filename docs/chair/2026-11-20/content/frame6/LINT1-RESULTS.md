# FRAME-6 · LINT1 — results (three lint reds, one cure each)

Builder of unit LINT1, brief `LINT1-CURES.md`, worktree branch `frame6-lint1` from `6544bc887`. Every artefact named here
is a file in the scratchpad folder `LINT1/`; every test ran under `sh scripts/gate-mutex.sh --run --`, its output to a
file, never through a pipe.

## Cure 1 — `observedShapeReaders`: `creditorOf` reads the key the producer writes

**The red** (`red1.txt`, the walker on the base line): 2 failed of 47 — "SHRINK-ONLY…" (`violations: 1`) and "A1/A7…"
(`reads: 2215` against the register's 2214). The authority, `node scripts/check-observed-shape-readers.mjs --report` at
the base (`osr-report-base.txt`, exit 1): `src/domain/crisis/crisisPage.js:349 name on factions f.name`, beside the one
banked row at `:434` (`governing.name`, ceiling 1).

**The cure** (one line, `crisisPage.js :: creditorOf`): `(str(f.faction) || str(f.name)) === k.factionId` →
`str(f.faction) === k.factionId`. The generator writes `faction` on a power and never `name`, so the `name` arm was dead.
No register moved; no `--write`.

**Green**: the report exit 0 with only `:434` left (`osr-report-1.txt`); the walker 47 of 47 (`green1.txt`).

**Byte-identity (the chair's STOP condition of 17:25 UTC: all 232 owner pages that carry the creditor line).** P4A's
`run.mjs` (copied unchanged) at the base before the edit and at the tip after, on P4A's three pools that carry the line;
`same.mjs` compares base and tip: the stored digest, the full composed page of each of the ten readers, and the owner's
`creditor` line itself, each byte for byte (sanity: base against base, every figure equal).

| pool | towns | stored identical | pages identical (10 readers) | creditor lines (base) | creditor lines identical | moved |
|---|---|---|---|---|---|---|
| B7's crisis pool (indebted 24) | 360 | 360 | 3,600 of 3,600 | 24 | 24 | 0 |
| Crown search (forced indebted) | 200 | 200 | 2,000 of 2,000 | 199 | 199 | 0 |
| natural pool | 360 | 360 | 3,600 of 3,600 | 9 | 9 | 0 |

**232 of 232 creditor lines byte-identical**; no line appeared or vanished; 9,200 of 9,200 composed pages identical. The
cure changes no owner's word, so it is committed.

**Gates**: `tests/domain/crisis` whole 25 files, 190 of 190 (`crisis1.txt`); `eslint crisisPage.js` 0; `npm run
typecheck:domain:strict` exit 0; `npm run typecheck:ratchet` exit 0.
