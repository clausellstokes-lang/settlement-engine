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

## Cure 2 — `factLayers` READERS: the crime kind key and the power-name comparison no longer share a line

**The red** (`red2.txt`, the walker on the base line): 1 failed of 15 — "READERS: every file reads exactly its banked
LINES…": `src/domain/tension/troubleCast.js` reads `crime` at F1's line
`const c = candidatesOf('criminal', side.archetype).find((x) => !side.named || (!!x.power && powerName(x.power) === powerName(side.named)));`.

**The brief's three questions, answered.**
- *Was the old line banked?* No, under no file and no reason. The pre-F1 line (`7ba96de11^`) was
  `const c = candidatesOf('criminal', side.archetype)[0];`: the same `'criminal'` literal, but no call the arm counts
  (`[0]` is not `find`/`filter`/`some`/…), so the arm never saw it. F1 added `.find(` to the line, and the arm
  (`readsFamily`: a counted call AND a crime-word literal on ONE line) fired.
- *May the door bank it?* No. `scripts/fact-layers-door.mjs` is shrink-only: a rise is refused ("cure the rise, never
  bank it"); there is no reasoned growth path in the door, so banking would be a register growth needing a signature.
  Not taken.
- *Can it be reshaped so the frame reads no layer it may not?* Yes, and truthfully. The line does not answer the crime
  fact by a name test: `'criminal'` is a `FaceKind` key into `candidatesOf`, whose `criminal` arm reads the crime fact
  through its home (`crimeSignalOf`, `crimeSignal.js`, a home of the `crime` family); the `.find` predicate compares a
  candidate power's name with the side's own named power, and holds no crime word. Splitting the call from the
  predicate restores the pre-F1 shape of the kind key's line, and the predicate's line holds no literal.

**The cure** (the one line, `troubleCast.js :: castTroubleFrame`, now two):
`const criminalCandidates = candidatesOf('criminal', side.archetype);` then
`const c = criminalCandidates.find((x) => !side.named || (!!x.power && powerName(x.power) === powerName(side.named)));`.
Same call, same predicate, same order. No register moved.

**Green**: `node scripts/fact-layers-door.mjs` 0 rises, 0 falls (`door2.txt`); the walker 15 of 15 (`green2.txt`).

**Byte-identity** (F1-F5-RESULTS.md's `tools/F/measure.mjs` and `cmp.mjs`, copied unchanged, the 330-town calm pool
`count/at-4971555c3/pool.json`, base before the edit and tip after): stranger 330/330; calm owner 267/267; **framed owner
63/63 equal, 0 moved** (`cmp2-sheets.txt`); the five counts' output identical line for line.

**Gates**: `tests/domain/tension` whole 5 files, 44 of 44 (`tension2.txt`); the other importers of `troubleCast.js`
(`frame2NamesRule.test.js`, `crisisOutsideHand.test.js`, `crisisKeeperBothDoors.test.js`,
`tests/security/frameShareVeil.test.jsx`) 4 files, 35 passed and 1 expected fail, 0 failed (`importers2-run.txt`;
`noLegacyFactionReaders`' core is a lint walker, run in the whole lint at the tip); `eslint troubleCast.js` 0;
`typecheck:domain:strict` exit 0; `typecheck:ratchet` exit 0.

## Cure 3 — `negativeAssertionAnchor`: the standing-ties negative goes through the repo's helper

**The red** (`red3.txt`, the walker on the base file): 1 failed of 9 — "no NEW un-anchored negative assertion…":
`tests/domain/tension/frameSheetRulings.test.js` line 93, ceiling 0:
`for (const never of [...]) expect(FRAME_STANDING_TIES, never).not.toContain(never);`.

**The cure**: the same loop now calls `expectAbsentWithAnchor(FRAME_STANDING_TIES, never, 'ally', never)` (and the file
imports it from `tests/helpers/anchoredNegatives.js`). The meaning is kept: each of the four kinds is still asserted
absent from the live constant, with its name as the context; the anchor `'ally'` is a member of the same constant (the
first tie of standing), so the negative can no longer pass on an emptied or renamed collection. No other line moved.

**Green**: the walker 9 of 9 (`green3.txt`); `tests/domain/tension` whole 5 files, 44 of 44 (`tension3.txt`);
`eslint frameSheetRulings.test.js` 0; `typecheck:ratchet` exit 0.

## `tests/lint` whole, at the tip's code (`lint-whole.txt`)

Run once on the working tree holding all three cures (the tip's code; this results file is the only byte the commit
adds after it): **219 of 220 files, 1 failed test of 3,271** (3,270 passed). The one red is `tuningRegister` ("the
measured tree matches the committed inventory exactly"), its three rows exactly as in the integrator's log at
`a170832e5` (`FRAME_TUNING` measured not in the inventory; `CRISIS_CAST_TUNING` and `WANT_MAX_WORDS` dependents moved):
the lane's known rows, not LINT1's. `observedShapeReaders`, `factLayers` and `negativeAssertionAnchor` are green.

Nothing stopped: no cure needed a signature or a register growth; no register was written.
