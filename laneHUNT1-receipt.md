# laneHUNT1-receipt.md — executor receipt for the HUNT-1 forensic lane (ODQ §355)

**Seat:** chair-tier forensic (§343.1(d)). **Repository writes: NONE.** Refs moved: NONE.
Full-suite runs spent: NONE. All writes confined to the session scratchpad
(`laneHUNT1-report.md`, this receipt, `laneHUNT1-runD-results.json` + `.flag` when the watcher
fires). All git operations were pure reads (`git show`, `git grep`, `git ls-tree`) against
`/Users/cstokes/Desktop/settlement-engine` at `5d18b4a0` and `refs/heads/claude/composite-r4`.

## Evidence trail (what was executed, in order)

1. **Read the three strays' gate outputs** — `laneTET2E-checktail.log` (Run B),
   `laneTET2E-baseratchet.log` (Run C), `laneTET2E-classify.log` (isolation ×3 both trees),
   `laneTET2E-receipt.md` §6n (the three-run table, machine loads), `laneTEWF1F-*` (Run A
   green). Confirmed: the ratchet prints IDENTITY ONLY — no assertion text survives.
2. **Read `scripts/check-test-ratchet.mjs` end-to-end at the build tip.** Found: vitest runs
   with `--reporter=json --outputFile=<mkdtemp>/results.json`; `rowsOf()` drops
   `failureMessages`; the temp dir does not survive the run. This is the instrument defect.
3. **Found Run D live** (`ps`): PID 5669 `vitest run --exclude=tests/build/** --reporter=json
   --outputFile=/var/folders/…/test-ratchet-lo7qjp/results.json`, started 00:15 under load
   50–99. **Planted a background watcher** (task `bvoqxpnq9`) that copies `results.json` to
   `laneHUNT1-runD-results.json` the moment it appears — the messages Runs B/C lost, captured
   for Run D at zero marginal compute.
4. **Read the vitest config** (`vite.config.js` test block at the tip): `testTimeout: 20000`
   with a comment naming `tests/domain/distribution.test.js` as the historical load-timeout
   victim; NO pool/isolate/workers overrides. Confirmed installed defaults: vitest **4.1.8**,
   `defaults.*.js` chunk carries `isolate: true`; `ps` shows `dist/workers/forks.js` workers.
   → per-file fresh module registry → in-memory cross-file leakage (H1) foreclosed.
5. **Read all three victim tests at `5d18b4a0`.** lawBandTable: overlay plants are in-memory;
   corpus() = full `src/` walk (1,600 .js files, measured by `git ls-tree`); failing arm ≈ 9
   walks ≈ 14k sync reads. npcAuthoringScope: failing test is the FIRST (cold lazy import;
   in-file comment documents the 1s→5s budget bump; prior stabilization `b19d69de`).
   distribution: seed-deterministic `generateMany` batteries per the config comment.
6. **Grepped every scratchpad lane log for failure text** (`Test timed out|EMFILE|Unable to
   find role|…`). Receipts found and quoted: `laneTENOTICES-baseproof-lint-docs.log` (8×20s +
   1×120s timeouts, incl. BOTH lawBandTable arms), `laneTENOTICES-sweep-lint-docs.log`,
   `laneTEOSR9-S2-lintsweep.log` (lawBandTable arm 4/5 timeout — second independent receipt),
   `laneTEWF1C-census-red/green.log` (sovereigntyLighting DOOR 3 at 32s wall, twice).
7. **Read `laneCG1-receipt.md`** §0b/§8/§9: the npcAuthoringScope stray already classified
   MACHINE/FLAKE on three legs at load 72.52; greens at 87.28 and 142.53; R0 names 9–18×
   oversubscription; R2 warns against banking. Read `laneTEWF1B-gate-test-ratchet.log`: the
   same test + an enforcement-claims meta-pin as a second stray.
8. **Closed the disk-plant channel** (the only route to a genuinely WRONG walker count):
   enumerated every source-phase test using fs writes at `5d18b4a0`; write targets are
   mkdtemp/tmpdir, `tests/**` baselines, or RECORD-mode goldens; `git grep` for writes
   targeting `src/` → one hit, a variable named `src` in testRatchet's fake-runner seam
   writing to a temp path. `tests/build/**` writers are excluded from the source phase.
9. **Briefed the chair mid-flight** (SendMessage ×1); received acceptance + orders; the report
   implements them: cures priority-ordered (evidence preservation → memoization → load
   stamps), reclassification list included (§6), watcher held (§3).
10. **Run D landed RED** (`REPEAT_MINE_TRUE_EXIT=1`, 00:29): one non-census stray —
    npcAuthoringScope's first test again; distribution did not recur. The watcher captured its
    report (`laneHUNT1-runD-results.json`): the stray row reads **duration 5377ms**,
    `Error: Unable to find role="button" and name /Mara/i` — the 5s cold-lazy query budget.
    The other 11 fails are the frozen census 11, intact AssertionErrors.
11. **⚠ RETRACTION + RECOVERY.** My mid-flight brief claimed the ratchet "deletes" its JSON —
    WRONG (a zsh no-match glob had printed nothing for `test-ratchet-*` while the dir existed).
    A `find` over TMPDIR showed hundreds of surviving `test-ratchet-*` dirs. All four runs'
    full reports were recovered by mtime and copied to the scratchpad
    (`laneHUNT1-runA/B/C/D-results.json`): Run B's stray = **56,955ms** vs the 20s budget
    (timeout kill, sync body overshoot); Run C's strays = **5,470ms** query-budget expiry +
    **20,528ms** timeout kill. Zero value-mismatch strays anywhere. Every per-instance label
    promoted to CONFIRMED; the retraction is recorded in the report §0.2 and was reported to
    the chair (SendMessage ×2).

## Judgment calls (vetoable)

- **J-HUNT1-0:** planted a read-only watcher on another lane's live temp output (copy-on-
  appearance, scratchpad destination). Chose this over asking T2E to preserve its own JSON
  because T2E's protocol was already in flight and the file's lifetime is seconds. Say "veto"
  and I kill task `bvoqxpnq9`.
- **J-HUNT1-1:** labeled the Run B/C instances PLAUSIBLE-high rather than CONFIRMED even
  though the class is CONFIRMED — their own messages are destroyed and honesty about the
  per-instance gap is what makes the class receipts trustworthy. The confirmatory arm (§3 of
  the report) is the promotion path.
- **J-HUNT1-2:** did NOT run any pair/forced-order experiments (method step 3) — the
  hypothesis they would discriminate (H1) fell to structural evidence first (isolate:true
  forks + in-memory overlays + closed disk channel), and the box must stay quiet for T2E's
  gate. Cheaper evidence replaced the experiment; nothing was skipped that the surviving
  hypothesis still needed.

## Deliverables

- `laneHUNT1-report.md` — the diagnosis, hypothesis disposition, chartered cures (never
  applied), stray-red classification protocol, §357 reclassification list.
- `laneHUNT1-runD-results.json` (+ `.flag`) — arrives when Run D's vitest finishes; contains
  the full per-test `failureMessages` for the confirming run.
- Memory: the banked `varying-cast-stray-protocol.md` row predates this lane and now has its
  mechanism; a memory update is the CHAIR's to order or a successor's housekeeping — this lane
  wrote nothing outside the scratchpad by charter.
