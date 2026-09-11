# §913 SKEPTIC — LENS: THE INSTRUMENTS (car 8, `2fd5a380e`)

⟦Seat: Opus 5 — Fable-unvalidated · refuting `receipt-l-mat.md` §"L-MAT-FIX (cars 7–9)"
· dock `laneLMAT`, tip `19642a9fce0817213040af0a0815ac5ced09fbbb`⟧

| gate | before | after |
|---|---|---|
| `git -C laneLMAT status --porcelain \| wc -l` | **0** | **0** |
| dock HEAD | `19642a9fc` | `19642a9fc` (unchanged) |

Nothing was written into any dock or tree. No plant was re-run (a plant is a WRITE).
Five focused vitest files were run one at a time from the dock.

⚠ **ONE FENCE READING TO RECORD.** The `pgrep -fl vitest | grep -v gate-mutex | wc -l`
taken immediately before the `publicSafe.test.js` launch read **38**, not 0 — six seconds
after my own `galleryDmFull.pglite` run had reported finish, so these were almost certainly
that run's own workers winding down. The count read **0** again on the next check and 0 on
every other launch. Recorded, not hidden; no further vitest was run after it.

---

## THE SIX SUB-CLAIMS

### (a) DEF-6 — was the deleted loop really a tautology? **CONFIRMED**

At `7d96e2b72`, `tests/lint/densityCreateBoundary.walker.test.js` built
`const scanned = [...new Set([...reachers, MINT_HOME, ...Object.keys(PIPELINE_REACHERS), …])]`
and then, two statements later, looped `for (const rel of Object.keys(PIPELINE_REACHERS))
expect(scanned).toContain(rel)`. Same frozen object, no mutation between the two statements —
**true for every possible tree**. Deleted at the tip, with the tautology named in place.

**And the kept assertion really can die** — I pressed this and it survives. `scanned` contains
`src/store/settlementGenerateAction.js` ONLY because the widening spreads
`Object.keys(PIPELINE_REACHERS)`: that file is not a pipeline reacher (my own scan of `src/`
for `generateSettlementPipeline` returns 23 files and it is not among them) and it is not
`MINT_HOME` (`src/domain/density/densityCreateBoundary.js`). Revert the widening and the
`toContain` reds. It is tautological with respect to the TREE and live with respect to the
TABLE — which is the guard the deleted loop pretended to be.

The stray-message fix is real: the tip builds a `matched` array from the mint and dial
separately and joins it, so a DIAL match no longer reports a mint symbol.

**Executed:** `densityCreateBoundary.walker` → **14 passed**, matching the receipt.

### (b) DEF-7 — key set derived from the real roster and anchored? **PARTLY**

CONFIRMED, the derivation is real. The 11-name hand literal is gone; the tip builds
`rosterKeys` from `ROSTER_KEY` + `Object.keys(roster)` + `rows.flatMap(row => Object.keys(row))`
off the world `litSettlement()` actually generates, and the count assertion is anchored on
`CUSTOM_DEFINITION_IDENTITY_KEYS.length + 2` (**5** keys, measured at
`src/domain/content/customDefinitionIdentityProjection.js:16-22`), so the threshold moves with
the identity projection instead of a typed number. That assertion is live: it can fail.

⛔ **BUT THE ARM LABELLED "Non-vacuity for the census itself" IS A TAUTOLOGY OF EXACTLY THE
SHAPE DEF-6 DELETED**, and it is the one line in the cure that claims to prove the identity
keys are covered:

```
for (const key of CUSTOM_DEFINITION_IDENTITY_KEYS) {
  if (rows.some(row => Object.hasOwn(row, key))) expect(rosterKeys).toContain(key);
}
```

`rosterKeys` is built from `rows.flatMap(row => Object.keys(row))`. Roster rows are plain
object literals plus `row[key] = authored` (`livingContentRoster.js`, `rosterRow`), and there
is no `defineProperty` anywhere under `src/domain/content/` — so every own property is
enumerable, and `Object.hasOwn(row, key)` being true ENTAILS `key ∈ rosterKeys`. The guard and
the assertion are computed from the same source: **the assertion cannot fail**. The regression
it reads as guarding — the identity projection ceasing to emit an account-scoped identifier —
turns the `if` false and the arm silently green. The live form is unconditional
(`expect(rosterKeys).toEqual(expect.arrayContaining(CUSTOM_DEFINITION_IDENTITY_KEYS))`).

Second, smaller correction: the receipt says "the count is read off the real row". It is not
read off; it is a THRESHOLD (`toBeGreaterThan`) against a derived number. Better than the old
`toBeGreaterThan(6)` over eleven literals, but the phrasing over-sells it.

**Executed:** `livingContentRosterPublicDrop` → **6 passed**, matching the receipt.

### (c) DEF-8 — a positive control that can fail, and the claim re-pointed? **CONFIRMED**

The BEFORE diagnosis reproduces: `regenNPCsPipeline`
(`src/generators/generateSettlementPipeline.js:474`) returns exactly
`{ npcs, relationships, factions, conflicts, _regenSeed, _preservation? }` — **no `config`**
and no roster key — so the STOP arm's three post-conditions were untouchable in either
direction, as the receipt says.

The control lands and can fail: `npcsBefore` is a `JSON.stringify` snapshot taken BEFORE the
call (so an in-place immer rewrite is still detected), and the assertion is
`expect(JSON.stringify(after.npcs), …).not.toBe(npcsBefore)`. A `regenSection` that did
nothing reds it.

The re-pointing is at an arm that genuinely can fail: `densityCreateBoundary.walker.test.js`
:562 requires `/settlement\.config \|\| config/` present in the stripped source of
`settlementSlice.js`, :567 requires `/\bconfig \|\| settlement\.config/` absent. Flip the read
order and both die. The comment concedes, correctly, that the STOP arm itself still cannot.

**Executed:** `livingContentLawWiring` → **12 passed**, matching the receipt.

### (d) DEF-9 — the helper form, and did any per-file budget move? **CONFIRMED**

Both arms go through `expectAbsentWithAnchor(…, 'config', …)` at the tip
(`livingContentRosterPublicDrop.test.js` :139 and :154), `config` being a live sibling on the
same root allowlist.

The budget claim is CONFIRMED by measurement, not taken on report. The walker's own
`BARE_NEGATIVE_RE` is `/not\.(?:toContain|toMatch|toHaveProperty)\(/g`. Counting that pattern
across every one of the eight test files cars 7–9 touched, at `7d96e2b72` and at `19642a9fc`:

| file | base | tip |
|---|---|---|
| tests/domain/livingContentLawWiring.test.js | 0 | 0 |
| tests/lib/accountSettlementContentPortability.test.js | 0 | 0 |
| tests/lib/importReconciliation.test.js | 1 | 1 |
| tests/lib/importScrub.test.js | 1 | 1 |
| tests/lint/densityCreateBoundary.walker.test.js | 0 | 0 |
| tests/security/livingContentRosterPublicDrop.test.js | 0 | 0 |
| **tests/store/accountImportSlice.test.js** | **9** | **9** |
| tests/store/campaignSlice.galleryImport.test.js | 0 | 0 |

`accountImportSlice.test.js` at 9 is exactly its frozen row
(`negativeAssertionAnchor.walker.test.js:734`), unmoved. Neither
`livingContentRosterPublicDrop.test.js` nor `livingContentLawWiring.test.js` carries a frozen
row at all, so no row could move for them. Note also that DEF-8's new `.not.toBe(…)` is not in
the walker's three matchers, so it adds nothing to any budget.

**Executed:** `negativeAssertionAnchor.walker` → **9 passed**, budgets EXACT.

### (e) R-G — the share model, the client half, the SQL twin **PARTLY (one citation wrong)**

**The quote is real.** `src/components/ShareToGallery.jsx:452` carries it verbatim: the toggle
tells the owner that secrets, plot hooks, NPC goals and relationships, DM notes and the DM
Compass become publicly visible to anyone who opens the gallery page. It is a PUBLICATION
switch, so R-G's refusal condition ("the DM's OWN other device") does not hold. The lane's
reasoning is sound and the drop lands correctly.

**The client half lands where claimed.** Inside the `if (full)` branch of `toPublicSafe`
(`publicSafe.js:254`), `delete clone.customContentRoster` / `delete clone.customContentProvenance`
sit at :308–309 — after `dmNotes` (:266) and the three seed carriers `_seed`/`_regenSeed`/`_config`
(:278–280), and before the `latentPantheon` strip (:322). Unconditional; no gate.

**The DM-full arm names the SQL twin.** The failure message at
`livingContentRosterPublicDrop.test.js:256-267` names `_gallery_dm_full_json`, the migrations,
and the R-J outage. And the twin claim itself is true: I read
`129_strip_latent_pantheon_gallery_dm_full.sql`, the net-current
`create or replace function public._gallery_dm_full_json`, and its delete chain is
`- 'aiData' - 'aiDailyLife' - 'aiSettlement' - 'dossierNotes' - 'dmNotes' - 'notes' -
'narrativeNotes' - '_seed' - '_regenSeed' - '_config'`. Neither custom-content key is in it, so
a DM-shared dossier read back from the server does still carry both.

⛔ **THE CITATION IS WRONG. "migrations 120/129" should be 121/129**, and it is wrong in three
places this car shipped: the `publicSafe.js` comment, the test's failure message, and the
receipt row. `120_gallery_import_premium_gate.sql` does not define the function — it only CALLS
it (two `public._gallery_dm_full_json(base.j)` call sites, :54 and :55). The body a future
migration must amend is 121's (recreated verbatim by 129). The same file already says
"migration 121/129" **fifteen lines above** the new comment (`publicSafe.js:275` and again
:323), so the car ships two citations that disagree with each other about the same function,
and the wrong one is the one handed to the engineer told to "add them to that function's
delete chain".

**Executed (regression controls the commit message claims):** `galleryDmFull.pglite` →
**6 passed**; `publicSafe` → **26 passed**.

### (f) U1 — is the md5 table reproducible in reasoning? **PARTLY**

The COVER is reproducible and exact. `MINT_SYMBOLS` (walker :53-57) contains
`newSettlementLivingContentLaw`, and `mintsIn(rel)` word-matches it against comment- and
string-stripped source. `src/workers/customContentPreview.worker.js` is declared **PREVIEW** in
`PIPELINE_REACHERS` and is not one of the three `MINT_HOMES`. So a plant of that symbol reds:

- **:251** `every BIRTH mints the law, and nothing else does` — via `nonBirthsMinting`
  (`class !== 'BIRTH' && mintsIn(rel)`);
- **:280** `the mint is not named outside its homes and its declared BIRTH callers` — via
  `strays` (not in `allowed`, `mintsIn` true).

And it reds **only** those two, which is why the count is 12/2 and not 11/3: the
`offTheBoundary` stray arm cannot fire, because `GENERATION_LAWS.livingContent` carries
`wiring: 'WIRED'` at the tip, so the law is not in the off-the-boundary set. The receipt's
"12 passed / 2 FAILED" and its two named arms are therefore derivable without the plant, and
they are right.

**The CLEAN digest reproduces exactly.** `md5 -q src/workers/customContentPreview.worker.js`
in the dock and `git show 19642a9fc:… | md5 -q` both return
`ad11078ef07775df072388722646f0f9` — the receipt's clean-and-restored value, so the restore
really did land and nothing of the plant survives in the tree.

⚠ **The PLANTED digest `25475df5a41a40a99aeb835ad534a3c5` is UNTESTED and unverifiable from
here.** It is a hash of a file that never existed in git, and reproducing it needs a WRITE into
the dock, which my fences forbid. It is a claim, not a receipt — the surrounding table is
otherwise sound, so nothing turns on it, but a successor should not read that one cell as
verified.

---

## SUMMARY

| claim | verdict |
|---|---|
| DEF-6 the deleted loop was a tautology | CONFIRMED |
| DEF-6 the kept `toContain` can die | CONFIRMED |
| DEF-7 the key set is derived from the real roster + anchored | PARTLY — anchored count is live, but the "Non-vacuity" loop is a NEW tautology of the DEF-6 shape |
| DEF-8 positive control that would fail; claim re-pointed at a failable arm | CONFIRMED |
| DEF-9 helper form, and no per-file budget moved | CONFIRMED (measured base vs tip on all 8 touched test files) |
| R-G share-model quote real; client half beside the named strips; SQL twin named | CONFIRMED |
| R-G "migrations 120/129" | REFUTED — 120 only CALLS the function; the body is 121/129, as the same file says fifteen lines up |
| U1 the `:251`/`:280` cover, and 12/2 | CONFIRMED by derivation |
| U1 the planted md5 | UNTESTED (reproducing it requires a forbidden write) |
