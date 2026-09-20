# TOOL-21 report — the golden register's `proofForm` field, measured

**Lane** TOOL-21 (Opus 5, RECON, READ-ONLY) · **chair** Fable 5.1, session 4a1823e2 ·
**read tip** `$SP/read-tip-em-t7` at **`ee204c827`**, `git status --short` EMPTY at start and at end ·
**ledger** read by `git show review-fixes-2026-07-08:<path>` only ·
**stamps from `date`**: start **2026-09-20 14:43:30 EDT**, end **2026-09-20 14:50:45 EDT**.
**Nothing was written to any repository or worktree.** Every harness took its tree from
`TOOL21_TREE` and printed it.

---

## OUTCOME, FIRST

**The finding is CONFIRMED and it is worse-shaped than the charter says, in a way that changes the
remedy.** 47 of 50 frozen rows carry `proofForm: null`; a null row makes `PROOF_FORM_MISMATCH`
structurally unreachable, and I drove the real door end to end in a scratch sandbox to prove a
map-family re-record proving with the wrong form is **accepted and written**. But the three things
the charter assumes are each false by measurement: **§555.8 is not a register law** — it is a
car-specific instruction for CH-4 whose own factual premise §561.2 then refuted ("*False.* All
three stay green"), and it never names a surface, a register row, or the token `proofForm`; **no
ruling anywhere assigns a proof form to any surface**, so 44 of the 47 nulls have no authority to
back-fill *from*; and **no door verb can write `proofForm` at all** (`recordGolden` writes exactly
`sha256`, `rows`, `ownerRow`), while **no walker arm reads it**, so the field sits outside both the
door and the instrument. The honest defect is not "§555.8 is inert" but "**the genesis freeze act
did not fill a field the register's own FIELD MEANINGS says is 'Filled at the freeze act'**". I
recommend **neither** the back-fill nor the brief's option (b) — option (b) as written is proved to
**seal all 47 surfaces shut** — but a third shape, **trust-on-first-use**: the door learns a row's
form from the first owner-signed record that moves it. That changes what the door refuses, so it is
recommended and priced here, never applied.

---

## 1. THE REGISTER'S 50 ROWS, CLASSIFIED

`node classify-register.mjs` (harness: `$SP/lane-tool-21-scratch/classify-register.mjs`,
log `register-classified.txt`). **CONFIRMED by execution.**

```
TREE READ: …/read-tip-em-t7
frozenAt      : "2026-09-16T13:55:10Z"
frozenAtSha   : "d22ceff01fe3d55c4d4ad0e4cd414dcdbdadb6b8"
surfaces      : 50
proofForm null : 47
proofForm set  : 3
pins DRIFTED   : 0
files ABSENT   : 0
```

**No pin has drifted. All 50 `sha256` values equal the bytes of their `path` on disk at
`ee204c827`, and every `path` exists.** (The brief asked for a drifted pin as its own finding;
there is none.)

### Family × `proofForm`

| count | family | `proofForm` |
|---|---|---|
| 22 | dormancy | `null` |
| 13 | map / spatial | `null` |
| 5 | generator | `null` |
| 5 | other | `null` |
| 2 | prose | `null` |
| **3** | **in-file fence** | **`in-file corpus constant`** |

The only three filled rows are the espionage fences. Family is assigned by the surface's name and
its test home, as the brief asked; it is **my classification, not the register's** — the register
carries no family field.

### The 50 rows

`pin` = the row's `sha256` re-measured against the file on disk. `env` = `recordEnv`.

| # | surface | family | proofForm | env | sha256(12) | pin | rows | ownerRow | gov |
|---|---|---|---|---|---|---|---|---|---|
| 1 | belief-axes-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 200b2e79a9b4 | LIVE | 2 | §901 | |
| 2 | belief-map-golden | map/spatial | null | UPDATE_GOLDEN | 151171842ac5 | LIVE | 3 | §901 | |
| 3 | cartography-calibration-corpus | map/spatial | null | UPDATE_CARTOGRAPHY_CALIBRATION | f2a5edae77a8 | LIVE | 504 | §901 | |
| 4 | chroniclers-letter-golden | prose | null | UPDATE_LETTER_GOLDEN | 2009cf7f2e81 | LIVE | 4 | §901 | |
| 5 | contested-goals-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 0728b30f11c7 | LIVE | 2 | §901 | |
| 6 | corruption-web-dormancy-golden | dormancy | null | UPDATE_GOLDEN | fa351b5d2386 | LIVE | 3 | §901 | |
| 7 | demographics-lifecycle-golden | other | null | UPDATE_GOLDEN | 62329c24a314 | LIVE | 4 | §901 | |
| 8 | disposition-channels-dormancy-golden | dormancy | null | UPDATE_GOLDEN | cf3c11924d78 | LIVE | 2 | §901 | |
| 9 | **espionage-dormancy-fence** | in-file fence | **in-file corpus constant** | null | dbbc1e19c670 | LIVE | null | §934.22 | YES |
| 10 | **espionage-mission-dormancy-fence** | in-file fence | **in-file corpus constant** | null | 67aa679ef69d | LIVE | null | §901 | YES |
| 11 | **espionage-rider-dormancy-fence** | in-file fence | **in-file corpus constant** | null | 26937295e313 | LIVE | null | §901 | YES |
| 12 | generator-golden-master | generator | null | UPDATE_GOLDEN | 7177cd6e89eb | LIVE | 525 | §934.22 | |
| 13 | generosity-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 9b57f25d3d60 | LIVE | 3 | §901 | |
| 14 | information-statecraft-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 8fe9ad93d114 | LIVE | 3 | §901 | |
| 15 | intel-trade-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 978c88f8726b | LIVE | 3 | §901 | |
| 16 | interior-golden | other | null | null | 858f019a61e6 | LIVE | 48 | §901 | |
| 17 | intervention-dormancy-golden | dormancy | null | UPDATE_GOLDEN | bf5b05137939 | LIVE | 3 | §901 | |
| 18 | migration-rumors-dormancy-golden | dormancy | null | UPDATE_GOLDEN | f0148778c80a | LIVE | 2 | §901 | |
| 19 | momentum-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 277b599a588a | LIVE | 3 | §901 | |
| 20 | npc-credibility-dormancy-golden | dormancy | null | UPDATE_GOLDEN | b872e66a2f18 | LIVE | 3 | §901 | |
| 21 | npc-growth-dormancy-golden | dormancy | null | UPDATE_GOLDEN | fadc3d0e2fbe | LIVE | 3 | §901 | |
| 22 | npc-ladder-dormancy-golden | dormancy | null | UPDATE_GOLDEN | ced10cd34e32 | LIVE | 3 | §901 | |
| 23 | npc-ledger-dormancy-golden | dormancy | null | UPDATE_GOLDEN | ca58422d8f46 | LIVE | 2 | §901 | |
| 24 | pdf-golden-view-model-snapshot | other | null | null | 39447f53f8ba | LIVE | null | §901 | YES |
| 25 | peace-causal-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 0ce1cdc73440 | LIVE | 3 | §901 | |
| 26 | provenance-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 10432b43fe94 | LIVE | 3 | §901 | |
| 27 | resource-dynamics-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 7e0f3d48b05c | LIVE | 3 | §901 | |
| 28 | roads-dormancy-golden | map/spatial | null | UPDATE_GOLDEN | faa3bce9b09b | LIVE | 3 | §901 | |
| 29 | route-network-dormancy-golden | map/spatial | null | UPDATE_GOLDEN | ad12bd54e746 | LIVE | 6 | §901 | |
| 30 | rumor-ledger-golden | other | null | UPDATE_GOLDEN | 787c1b92f53e | LIVE | 3 | §901 | |
| 31 | sea-lanes-golden | map/spatial | null | UPDATE_GOLDEN | 23d65a476d18 | LIVE | 8 | §901 | |
| 32 | seasonal-overlay-golden | map/spatial | null | UPDATE_GOLDEN | e7e903361d8b | LIVE | 7 | §901 | |
| 33 | settlement-lifecycle-dormancy-golden | dormancy | null | UPDATE_GOLDEN | a0de1360a79d | LIVE | 5 | §901 | |
| 34 | settlement-politics-dormancy-golden | dormancy | null | UPDATE_GOLDEN | b5540cf47a38 | LIVE | 3 | §901 | |
| 35 | spatial-consequence-dormancy-golden | map/spatial | null | UPDATE_GOLDEN | b7e8b526a7c5 | LIVE | 3 | §901 | |
| 36 | spatial-digest-golden | map/spatial | null | UPDATE_GOLDEN | f38d9de4ee11 | LIVE | 9 | §901 | |
| 37 | supply-web-warfare-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 82966f36f634 | LIVE | 3 | §901 | |
| 38 | teleport-edges-golden | map/spatial | null | UPDATE_GOLDEN | efa945b42e6a | LIVE | 8 | §901 | |
| 39 | timeline-track-golden | generator | null | UPDATE_TIMELINE_GOLDEN | 80a708c583b4 | LIVE | 3 | §901 | |
| 40 | town-cartography-dormancy-golden | map/spatial | null | UPDATE_GOLDEN | 6edc064aca15 | LIVE | 54 | §901 | |
| 41 | **town-map-golden** | map/spatial | null | UPDATE_GOLDEN | 89ca6d4efc7f | LIVE | 14 | §901 | |
| 42 | **town-map-v2-golden** | map/spatial | null | UPDATE_GOLDEN | fd91116ff179 | LIVE | 10 | §901 | |
| 43 | traditions-dormancy-golden | dormancy | null | UPDATE_GOLDEN | b11c6b572832 | LIVE | 3 | §901 | |
| 44 | upswing-dormancy-golden | dormancy | null | UPDATE_GOLDEN | 09340560fb35 | LIVE | 3 | §901 | |
| 45 | urban-fabric-dormancy-golden | map/spatial | null | UPDATE_GOLDEN | bb93090a39c7 | LIVE | 3 | §901 | |
| 46 | worldpulse-golden-master | generator | null | UPDATE_GOLDEN | 6e5937d20203 | LIVE | 4 | §901 | |
| 47 | worldpulse-seasons-golden | generator | null | UPDATE_GOLDEN | 26eed82fd6c9 | LIVE | 3 | §901 | |
| 48 | worldpulse-spatial-golden | generator | null | UPDATE_GOLDEN | 4f22c7958630 | LIVE | 2 | §901 | |
| 49 | dossier-prose-manifest | prose | null | null | 88983938ddcf | LIVE | 2 | §934.71 | |
| 50 | preset-lighting-witness | other | null | null | 7f67ee8e6cda | LIVE | 15 | §934.15 | |

Row 49 is CURE-J's re-recorded row: `sha256 88983938…`, `ownerRow §934.71` — **and its `proofForm`
is still `null` after a completed, owner-signed door write.** That is the mechanism proved in §2.

### 1a. WHAT §555.8 ACTUALLY SAYS — and why the charter's framing needs correcting

**CONFIRMED.** `git -C <ledger> show review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md` →
32,918 lines; `grep -n 'proofForm'` returns **two** hits, both §934.47 addenda *about this lane*
(86 and 105). **§555.8 never uses the word.** Read whole (ODQ lines 24628–24639):

> **§555.8 THE ONE-REGEN URGENCY WAS INFLATED, WHICH REMOVES THE LAST ARGUMENT FOR RIDING R7.**
> … What CH-4 moves is the **map golden family**. Missing the ONE REGEN therefore costs a
> **map-family re-record, not a second full regen.** ⛔ **INSTRUCTION THE PACKET MUST CARRY: prove
> the shift against the DERIVED ARTEFACT — district-category tuples and `compileTownSceneManifest`
> output — NEVER a settlement-record hash.**

It is an **instruction to one car (CH-4)**, not a standing per-surface law. It names no surface
identity and no register row. §557.5 (24764–24772) repeats it as that car's instrument warning.
And **§561.2 (25031–25039) then refutes §555.8's own premise**:

> **§561.2 ⛔⛔ AND THE GOLDENS I NAMED AS THE PROOF ARE BLIND TOO.** §555.8 instructed that *"what
> CH-4 moves is the map golden family."* **False.** All three stay green **across a change that
> moves 668 rings and 332 wall-embraces** … ⭐ **New law: a golden that never exercises your code is
> not evidence — prove its fixtures REACH the change before citing its green.**

So the door's refusal text — "A map-family surface may not prove with a settlement-record hash (ODQ
§555.8)" — is the door's own **generalization** of a car instruction into a per-surface field.
**No ODQ row has ever populated that field for any surface** (`grep 'proofForm'` = 2 hits, both
this lane's charter). The register's FIELD MEANINGS says the field is *"Filled at the freeze act"*;
the genesis act of 2026-09-16 filled none of the 47.

---

## 2. THE DOOR'S REACH ON A `null` ROW — EXECUTED

Harness `door-reach.mjs` imports the **real** `verifyShiftRecord` from the read tip's
`tests/helpers/goldenRecordDoor.js`. Log: `door-reach.log`. **CONFIRMED by execution.**

### The mechanism, read from source

- `goldenRecordDoor.js:282` — `verifyShiftRecord(record, { surface, proofForm: row.proofForm ?? null })`
- `goldenRecordDoor.js:181` — `if (proofForm != null && entry.proofForm !== proofForm)`
- `goldenRecordDoor.js:176` — `if (!PROOF_FORMS.includes(entry.proofForm)) → RECORD_MALFORMED`

The record side is **always** constrained; the register side is the one that is null.

### Driven against the real `town-map-golden` row

```
register row town-map-golden: proofForm=null rows=14 sha256=89ca6d4efc7f
the door asks with: proofForm: row.proofForm ?? null  ->  null

  record proofForm 'settlement-hash'         -> ok:true  ACCEPTED
  record proofForm 'derived-artefact'        -> ok:true  ACCEPTED
  record proofForm 'in-file corpus constant' -> ok:true  ACCEPTED
  record proofForm 'map-hash' (not a form)   -> ok:false REFUSED [RECORD_MALFORMED]
  record proofForm null                      -> ok:false REFUSED [RECORD_MALFORMED]
  asked with NO proofForm key (undefined)    -> ok:true  ACCEPTED
```

**The field is ignored, not matched.** All three lawful forms pass. `undefined != null` is also
false, so an ask that omits the key skips the check too — which is how
`goldenFreeze.walker.test.js:714` calls it in arm 5.

### Which refusals CAN fire for a `null` row

```
  NO_SIGNATURE                         recordGolden env check (243-249) — reachable, independent of proofForm
  RECORD_UNREADABLE                    recordGolden fs read (253-274)   — reachable, independent
  RECORD_MALFORMED (not an object)     ok:false REFUSED [RECORD_MALFORMED]
  BLANK_PROVENANCE                     ok:false REFUSED [BLANK_PROVENANCE]
  SURFACE_NOT_IN_RECORD                ok:false REFUSED [SURFACE_NOT_IN_RECORD]
  UNKNOWN_ACTION                       ok:false REFUSED [UNKNOWN_ACTION]
  RECORD_MALFORMED (predictedRows)     ok:false REFUSED [RECORD_MALFORMED]
  PROOF_FORM_MISMATCH                  ok:true  ACCEPTED   ← STRUCTURALLY UNREACHABLE
```

`DIRTY_TREE`, `PREDICTION_MISS` and `SURFACE_NOT_REGISTERED` live in `recordGolden` and are
likewise unaffected by `proofForm`. **`PROOF_FORM_MISMATCH` is the one refusal of the ten that a
null row disarms**, and it is disarmed on 47 of 50 surfaces.

### The discrimination controls (the comparator is proven able to see)

```
--- the SAME asks against a BACK-FILLED row (proofForm: derived-artefact) ---
  'settlement-hash'         -> ok:false REFUSED [PROOF_FORM_MISMATCH]
  'derived-artefact'        -> ok:true  ACCEPTED
  'in-file corpus constant' -> ok:false REFUSED [PROOF_FORM_MISMATCH]

--- THE LIVE POSITIVE CONTROL: espionage-dormancy-fence carries a form TODAY ---
  'settlement-hash'         -> ok:false REFUSED [PROOF_FORM_MISMATCH]
  'derived-artefact'        -> ok:false REFUSED [PROOF_FORM_MISMATCH]
  'in-file corpus constant' -> ok:true  ACCEPTED
```

The arm works perfectly **where a row carries a form**. It is live on exactly 3 of 50 surfaces.

### 2b. THE FULL DOOR, DRIVEN END TO END IN A HERMETIC SANDBOX

Harness `sandbox-door.mjs`, log `sandbox-door.log`. **Safety, stated:** `root` is a scratch git
repo built by the script under `lane-tool-21-scratch/sandbox` (the script refuses any path outside
this lane's scratch); the signature env var was assigned on `process.env` **inside that node
process only** — never exported to a shell, never able to reach another command — and pointed at a
**sandbox** record file named `SIMULATED-tool21-never-signed.json`. The real register and the real
fixture were opened read-only to copy bytes out and were never written. The sandbox was removed at
the end. The read tip's `git status --short` was EMPTY immediately afterwards.

```
sandbox row town-map-golden BEFORE: proofForm=null rows=14 ownerRow=§901 sha256=89ca6d4efc7fb46f

=============== recordGolden DRIVEN END TO END (sandbox) ===============
THE DOOR ACCEPTED AND WROTE:
  golden RE-RECORDED through the signed door: surface 'town-map-golden', action 're-record',
  cause 'TOOL-21 sandbox simulation of a map-family re-record against a null proofForm row',
  row §934.47. sha256 89ca6d4e… -> 89ca6d4e…; rows 14 -> 14.

sandbox row town-map-golden AFTER : proofForm=null rows=14 ownerRow=§934.47 sha256=89ca6d4efc7fb46f

⭐ proofForm AFTER a completed door write: null
```

The record proved a **map-family** surface with `derived-artefact` against a null row and the door
**wrote** (`ownerRow` moved §901 → §934.47; the sha held only because the produced bytes were
byte-identical by construction). The control re-run against a back-filled row:

```
=============== CONTROL: the same record against a BACK-FILLED row ===============
  golden re-record REFUSED [PROOF_FORM_MISMATCH] for surface 'town-map-golden': … registered with
  proofForm 'settlement-hash' but the signed record proves with 'derived-artefact'. …
  register row sha256 UNMOVED — nothing was written
```

### ⭐ 2c. THE STRUCTURAL FACT THAT DECIDES THE REMEDY

**`recordGolden` never writes `proofForm`.** Its write set is exactly three fields
(`goldenRecordDoor.js:311-313`): `row.sha256`, `row.rows`, `row.ownerRow`. Proved by execution
above — a completed door write left `proofForm` null. **There is therefore no door verb that can
fill a null row**; `ACTIONS` is exactly `{re-record, retire, enroll}` and there is no refreeze verb
for this register. The field can only be moved by a hand edit or by changing the door.

---

## 3. WHAT A FILLED `proofForm` WOULD REFUSE — THE HISTORICAL REPLAY

Every record under `docs/shift-records/` replayed through the real predicate. **CONFIRMED.**

### What the owner has ever signed, per surface

| surface | forms signed | consistency |
|---|---|---|
| generator-golden-master | `settlement-hash` (×7) | CONSISTENT |
| espionage-dormancy-fence | `in-file corpus constant` (×5) | CONSISTENT |
| dossier-prose-manifest | `derived-artefact` (×2) | CONSISTENT |
| preset-lighting-witness | `derived-artefact` (×1) | CONSISTENT |

**Only four of the fifty surfaces have ever appeared in a signed record at all.**

### The replay

```
entries replayed: 17 · refused TODAY: 0 · refused under the back-fill: 0
```

All 17 surface-entries across the 10 real records accept both today and under a register
back-filled from signed precedent. **No past re-record would have been refused, and there is no
false positive** — a correct re-record refused for a wrong form never occurs, because each
surface's records are internally consistent.

### The counterfactual — what the arm WOULD have caught

Forging each entry's form to a different lawful value:

```
  2026-09-16-genesis-freeze…   generator-golden-master   'settlement-hash' -> 'derived-artefact':
                               TODAY ACCEPTS (blind) | BACKFILLED PROOF_FORM_MISMATCH
  2026-09-17-dossier-contradictions  dossier-prose-manifest  TODAY ACCEPTS (blind) | BACKFILLED MISMATCH
  2026-09-17-dossier-contradictions  espionage-dormancy-fence TODAY PROOF_FORM_MISMATCH | BACKFILLED MISMATCH
  … (17 rows in door-reach.log)
```

**11 of 17 forged entries are blind today and would be caught; 6 are already caught** — those six
are the `espionage-dormancy-fence` rows, the one surface whose row carries a form. The protection
is real where it is armed and absent everywhere else.

### The evidence tier for a back-fill

```
null rows WITH signed precedent (3): generator-golden-master, dossier-prose-manifest, preset-lighting-witness
null rows with NO precedent at all (44): a back-fill for these is INFERENCE, not transcription
```

### ⛔ AND THE OBVIOUS MECHANICAL RULE IS REFUTED

I tested the only cheap code-derived rule available — "a suite that reaches the settlement pipeline
proves with a `settlement-hash`" (`structure.mjs`, log `structure.log`):

```
  rows whose suite REACHES generateSettlement*:
    cartography-calibration-corpus  (proofForm null)
    espionage-dormancy-fence        (proofForm in-file corpus constant)
    generator-golden-master         (proofForm null)
    pdf-golden-view-model-snapshot  (proofForm null)
    preset-lighting-witness         (proofForm null)
```

**`preset-lighting-witness` reaches the pipeline and is owner-signed `derived-artefact`; so does
`espionage-dormancy-fence`, signed `in-file corpus constant`.** Reaching the generator does not
imply `settlement-hash`. **There is no mechanical rule in the tree that recovers a surface's proof
form.** Any value written for the 44 unsigned rows is a judgment, not a measurement.

---

## 4. THE THREE SHAPES, PRICED — AND A FOURTH I RECOMMEND

The frozen register's law, measured rather than assumed:

- **No walker arm reads `proofForm`.** Exhaustive scan of all 1,069 lines: the token appears at
  `:336`, `:339`, `:774`, `:775` only — the synthetic `GOOD_RECORD` plant and the unit test of
  `verifyShiftRecord`. **None of them reads `SURFACES`.** (CONFIRMED)
- **Arm 1's "recorded value" list deliberately excludes it** (`:414-416`: `sha256`, `rows`,
  `ownerRow`, `distinctFloor`, `seedSet`, `frozenConstants`). That is why the three fence rows could
  legally carry a form *before* the freeze. The register's own machinery classifies `proofForm` as a
  **declaration/inventory field**, not a recorded one — the same class as `constantSites`, which the
  `_doc` calls "an INVENTORY figure … live TODAY". The `_doc`'s "⛔ NEVER HAND-EDIT A MEASURED
  FIELD" therefore does **not** reach `proofForm`. (CONFIRMED by reading; the settling experiment
  for "and so the walker stays green" is a `tests/lint/goldenFreeze.walker.test.js` run at the gate,
  which this lane may not take — that inference is **PLAUSIBLE**.)
- **The register's own bytes are pinned by nothing.** No row claims `REGISTER_REL` (arm 2 asserts
  the opposite at `:584`), and no row's `sha256` equals the register's own digest. (CONFIRMED)
- **Blast radius of a `proofForm`-only edit:** 47 lines of 849; the file is 55,630 bytes.

> **Answer to the brief's question "how is a frozen register lawfully edited?"** — For `sha256`,
> `rows` and `ownerRow`: only through the door, and `re-record`/`retire` are the owner's verbs. For
> `proofForm`: **there is no lawful mechanized path at all.** The door cannot write it; the walker
> cannot see it; there is no refreeze verb. It is the one field in the register with a documented
> filling occasion ("Filled at the freeze act") and no machinery to fill it.

### (a) Back-fill the 47 rows in one register migration — **NOT RECOMMENDED**

- **Price.** 44 of 47 values would be invented with no authority to cite, and §3 proves no code-derived
  rule recovers them. Once written they become live refusals: a wrong value **blocks a legitimate
  owner-signed re-record at the door**, and the failure surfaces mid-landing when a golden must move.
- **Worse, nothing would catch a wrong value.** No walker arm reads the field; the register's own
  bytes are pinned by nothing. A mistaken back-fill is undetectable until it refuses something real.
- **Mechanically it is a hand edit of a frozen register** — not forbidden by the `_doc` (the field is
  not "measured"), but it is a protection *change* on an owner-signed surface, so by the estate's own
  asymmetry (`re-record`/`retire` = owner) it belongs to the pen, not the chair.
- Only the **3 rows with signed precedent** could be filled by transcription. That is a real but
  small option, and it is strictly dominated by (d).

### (b) Make `PROOF_FORM_MISMATCH` fire when the record carries a form and the row is null — **REFUTED BY EXECUTION**

**This would seal all 47 surfaces shut.** `goldenRecordDoor.js:176` already refuses any record whose
`proofForm` is not one of the three (`RECORD_MALFORMED`), and I drove it: `record proofForm null ->
REFUSED [RECORD_MALFORMED]`. **Every lawful record necessarily carries a form**, so "refuse when the
record carries a form and the row is null" fires on **every** record for **every** null row. There is
no record shape that could pass. The estate would lose its lawful re-record path on 47 of 50
surfaces — including `generator-golden-master`, which has moved through the door seven times. The
brief's parenthetical "the door learns 'unspecified ≠ any'" is the right instinct; this spelling of
it is a lockout.

### (c) Leave it and record §555.8 as inert — **acceptable only if the record is rewritten**

Leaving it costs nothing today: §3 proves the arm has never had anything to catch, and the other
nine refusals are undisturbed. But **"§555.8's map-family protection is inert" is not what is true.**
§555.8 is a car instruction whose premise §561.2 refuted; it never created a per-surface protection.
The accurate record is: *the door generalized a car instruction into a per-surface field, the
register's FIELD MEANINGS says that field is filled at the freeze act, the genesis act filled none of
the 47, and no ruling has ever assigned a value to any surface.* If the chair takes (c), that is the
sentence the ledger should carry, and it should also carry the two documentation defects in §5.

### ⭐ (d) TRUST-ON-FIRST-USE: the door LEARNS the form from the first signed record — **RECOMMENDED**

When the row's `proofForm` is null and the record's entry carries a lawful form, `recordGolden`
writes `row.proofForm` alongside the three fields it already writes; when the row is non-null the
existing mismatch check governs unchanged.

**Why this is the shape that fits the estate's own laws:**

1. **No value is ever invented.** Every `proofForm` is set by an **owner-signed record** at the moment
   it is first used — the same standard the estate already holds for `sha256`, `rows` and `ownerRow`.
   The 44 unsigned rows stay null until someone signs for them, and then they are signed.
2. **Protection grows, never shrinks** — exactly the asymmetry the README names for the `enroll`
   verb ("protection is *growing*; a new instrument's genesis hash is its own provenance").
3. **Zero historical false positives, proved.** §3's replay: all 17 entries per-surface consistent, so
   under TOFU every past record would have set the value its successors already carry, and every
   successor would have matched. 0 refusals either way.
4. **It arms 11 of the 17 counterfactual forgeries** that are blind today, from each surface's second
   re-record onward.
5. **It needs no hand edit of a frozen register**, and it closes the gap that the door's write set can
   never reach the one field its own refusal depends on.

**The price, stated honestly.** (i) It is a **code change to what the door refuses**, so by this
lane's dispatch it is the **owner's signature** — recommended here, never applied. (ii) A wrong form
in a surface's *first* signed record locks in a wrong value; mitigated because that first write is
itself owner-signed, and correctable by a superseding record (the README's own stated remedy) or the
`retire`+`enroll` path. (iii) It should ship with a **walker arm** that pins the behaviour — a plant
asserting that a null row + a lawful record sets the row, and that a set row still refuses a
mismatch — because today the field has no instrument at all; that arm is what makes the protection a
claim rather than an archive. (iv) Size: roughly one line in `recordGolden` beside `:311-313`, plus
the walker arm and its plant. (v) It touches `tests/helpers/` and `tests/lint/`, so
`tests/lint` runs WHOLE before the commit (LANE-PARALLEL addendum 104), and a new test title moves
the lighting census by its own delta.

**Recommendation to the chair: (d), paired with the (c) record correction and the §5 documentation
fixes.** If the owner declines the door change, take **(c)** with the corrected wording; do **not**
take (a), and do not take (b) as written.

---

## 5. ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **The README states the law as unconditional and the code does not implement it that way.**
   `docs/shift-records/README.md:62` — "**Must equal the register row's `proofForm`**: a map-family
   surface may not prove with a settlement-record hash." The door enforces this only when the row is
   non-null, i.e. on 3 of 50 surfaces. **Slot:** a one-paragraph doc correction, or it is cured
   automatically by taking (d). Until then the README overstates a live guarantee.
2. **The README claims the register pins every record by hash; it pins one.**
   `README.md:118` — "the register pins each one by hash". Measured: `genesis.signedRecordSha256`
   pins `2026-09-16-genesis-freeze-generator-golden-master.json` (sha MATCHES); **the other 9 real
   records are pinned by nothing**, so a landed record could be edited after the fact and no
   instrument would see it — which is precisely the "records are never edited after the fact" rule
   the same paragraph states. **Slot:** a FIX item to record each signed record's sha256 on the
   register row it moved (the door already has `record.odqRow` and the record bytes in hand at write
   time), plus a walker arm. This is the same class as the `proofForm` gap: a stated law with no
   machinery.
3. **The genesis freeze act left an obligation it named.** Register `genesis.note`: "The six
   fixtureless `*DormancyGolden` suites stay on the unresolved roster: their ruling (**a register row
   with a `proofForm` of their own**, or a written exclusion) is owed at the first landing that
   touches them." Six suites are listed in `unresolvedRoster.fixturelessDormancyGoldens.suites` and
   the walker asserts the list still matches the tree (`:395-402`). **Slot:** the ruling is still
   owed; it is the same field this lane measured, so it should be decided in the same act as (d).
4. **`espionage-rider-dormancy-fence` carries an OWNER STOP that a register row may quietly
   downgrade.** Its `governance` block: "⛔ THIS NUMBER MOVING IS A STOP, NEVER A RE-RECORD — it is
   the owner's condition… whether it is enrolled as door traffic, enrolled with a STOP flag the door
   honors, or excluded … is a GOVERNANCE RULING the freeze act must make explicitly." The freeze act
   enrolled it as ordinary door traffic and made no such ruling. **Slot:** an owner decision; the
   door has no STOP flag today, so the row as written admits a signed re-record of a surface the
   owner said may not be re-recorded.
5. **`pdf-golden-view-model-snapshot` is enrolled but the door cannot refuse it.** Its own
   `governance` block says so: the writer is vitest's `-u`, which carries no env spelling and no
   `writeFileSync`. It carries `proofForm: null` like the rest, but for this row a back-fill would be
   decorative — nothing routes through the door. **Slot:** noted for whoever rules (d)'s scope; it is
   the one surface where `proofForm` can never do work.
6. **The register's `_doc` still opens with "⛔ THIS REGISTER IS UNFROZEN"** (lines 11–17). Line 64
   retains it deliberately as history, so this is not a defect — recorded so a future reader does not
   re-find it as one. (CURE-J §7 item 3 noted the sibling staleness in row 49's `note`.)
7. **`inventory.totalSurfaces` is 48 and `ROSTER_FLOOR.surfaces` is 48; the register now carries 50.**
   Both are floors/as-of figures and neither is wrong, but the inventory block describes
   `8b07ce45f` while the roster has grown by two (rows 49 and 50). Recorded, not a bug.
8. **The `_TEMPLATE.json` carries `proofForm: "settlement-hash"`** — a real form in a file whose whole
   safety story is that every provenance field is blank. The door refuses it on `BLANK_PROVENANCE`
   first, so it is safe today; under (d) the template's form would never be reached either. Recorded
   for completeness.

---

## 6. EPISTEMIC LEDGER

**CONFIRMED (executed this turn; command and output quoted above):** the 50-row classification and
its family crosstab; 47 null / 3 set; zero pin drift and zero absent files; the door accepts all
three forms against a null row and ignores the field; `PROOF_FORM_MISMATCH` is the one refusal of
ten that a null row disarms; the full `recordGolden` accepts and writes a map-family re-record
proving with `derived-artefact`, and refuses it with `PROOF_FORM_MISMATCH` against a back-filled
row; `recordGolden` never writes `proofForm`; the live positive control on
`espionage-dormancy-fence`; the 17-entry replay with 0 refusals today and 0 under the back-fill;
11 of 17 counterfactual forgeries blind today; only 4 of 50 surfaces have ever been signed; the
"reaches the pipeline" inference rule is refuted by `preset-lighting-witness`; `proofForm` appears
in the walker only in synthetic plants; arm 1's recorded-value list excludes it; the register's own
bytes are pinned by nothing; 1 of 11 shift records is pinned by hash; §555.8's text and §561.2's
refutation; `grep 'proofForm'` over the 4.1 MB ODQ returns two hits, both this lane's charter.

**PLAUSIBLE (reasoned, with the settling experiment named):** that a `proofForm`-only register edit
would leave `tests/lint/goldenFreeze.walker.test.js` green — it follows from no arm reading the
field, but the settling experiment is a gated run of that walker, which this lane may not take.
That option (d) needs "roughly one line" in `recordGolden` — the shape is clear from `:311-313` but
no patch was written or compiled.

**NOT DONE / NOT CHECKED, stated affirmatively:** no vitest, eslint, tsc, npm script or build was
run (dispatch). No file in any repository or worktree was created, edited or deleted. No door verb
was set outside a hermetic scratch sandbox, and that sandbox was removed. I did not attempt to
classify the 44 unsigned surfaces into proof forms — §3 shows that is a judgment with no
measurement behind it, and it is the chair's or the owner's, not this lane's. No rate limit was hit.

**Read tip at end:** `ee204c827`, `git status --short` **EMPTY**.

---

### Harnesses and logs (all under `$SP/lane-tool-21-scratch/`)

`classify-register.mjs` → `register-classified.txt` · `door-reach.mjs` → `door-reach.log` ·
`sandbox-door.mjs` → `sandbox-door.log` · `structure.mjs` → `structure.log` ·
`read-records.mjs` → `shift-records.txt` · `odq.md` (4.1 MB, extracted) → `odq-sections.txt`.
