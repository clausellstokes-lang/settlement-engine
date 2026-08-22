# WF / WF-1F — the shared deity-name floor, and two falsified sentences retired

- **Status:** LANDED
- **Compile note:** pre-executed as a COMPILE SEED by lane TC-WF1E (not a packet of its own);
  the split that created this member is ratified at ODQ **§333.1**, and its three micro-items
  are the chair appends of ODQ **§326.4**. BUILT AND VERIFIED by lane TE-WF1F. ⚠ The status
  value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line — trailing prose
  there leaves the status unparsed and makes the manifest disagree with the Markdown
  (J-TEWF1B-1, paid once already).
- **Verified base:** `claude/composite-r4` at `27c250f94bb7c5c799693a62985c5ddecd4b6c7c`
  (MF-T2D's landing). ⚠ Built and focused-proved at `3ac279db` (WF-1E's landing); when TE-T2D
  landed first the member was cherry-picked forward, the three shared meta files were
  BYTE-RESTORED from this base and the appends re-run, and every base-dependent figure —
  the census tuple above all — was RE-DERIVED here rather than carried.
- **Preamble:** `docs/implementation/preambles/WF-PREAMBLE.md`, cited **BY SHA-256
  `f4cd39fee756c3a192710ab9aa3fc208e18ef1f08ea9e9073bcdc8bfb55d871c`** (780 lines). Recomputed
  at this verified base and byte-identical to WF-1E's citation. Every refutation, disposition,
  register, STOP and census law in that file binds here and is not restated.
- **Design authority:** `docs/DESIGN_FP_ARCH_WF.md` §4-WF-1 (the patron-fall family) ·
  `src/domain/display/deityNames.js`'s own module header, which is the estate's standing
  ruling that ONE resolver owns deity display names.
- **Train:** `wf-1`, family **WF**, member **f**. WF-1A..WF-1E are all LANDED on the branch.
  This member shares **zero** paths, instruments or proofs with WF-1E (ODQ §333.1).
- **Census authority:** ODQ **§326.4** (the three micro-items) and **§333.1** (the split),
  under §299.4's binding-forward rule.
- **Declared shift:** **INCURRED.** See §4. Live campaigns' pantheon arc copy changes for
  uncarried deity refs whose last segment carries `_` or `-`. The shift is proved key-by-key
  against a pre-cure `git archive` tree, and exactly ONE committed pin re-records.
- **Constitutional law binding every line below:** the DEITY DOCTRINE — faith is CULTURAL,
  never theological. This member changes only how a REF IS SPELLED for a reader. It mints no
  deity, reads no catalogue, and says nothing about what a god did.

---

## §0 · WHAT THIS MEMBER IS, AND WHAT IT REFUSES

Three repairs the chair queued at §326.4, none of which widens behavioural scope:

1. **RAISED-B** — `realmEvents.js`'s private, lossy deity-name floor is replaced by the
   estate's shared one. This is the member's centre of gravity and its declared shift.
2. **WF-1D RAISED-4a** — one certification-row sentence that predicted the future wrongly.
3. **WF-1D RAISED-4b** — one walker justification comment falsified by WF-1D's own landing.

**IT REFUSES** to delegate `deityNameForRef` wholesale to `deityNameFromSnapshots`. That
resolver also reads `cultDeitySnapshots`, which would widen what the arc producer SCANS —
a behavioural change nobody chartered. The refusal is now enforced by a pin rather than by
prose: see §6 mutant (b), which passed 36/36 before that pin existed.

## §1 · THE DEFECT, MEASURED

`deityNameForRef` (`src/domain/worldPulse/realmEvents.js`, sole caller inside
`synthesizePantheonArcs`, whose sole production caller is the kernel's pantheon-arcs site)
resolved a name by scanning the pre-tick snapshot's `primaryDeitySnapshot` and, failing that,
fell back to `String(deityId).split(/[:_]/).filter(Boolean).pop()` — **the LAST token only**.

The branch is LIVE on unflagged surfaces. Ascendancy, twilight and extinction arcs run on
religion ACTIVITY alone, and **every extinction beat resolves through the fallback**, because
an extinct creed is by definition carried by no settlement and production hands the arcs THIS
tick's pre-tick snapshot (WF-1C §6.1). Executed at this base, the floor printed:

| ref | pre-cure | post-cure |
|---|---|---|
| `custom:war_father` | The Last Altar of **Father** | The Last Altar of **War Father** |
| `custom:sun_of_the_deep_forge` | The Last Altar of **Forge** | The Last Altar of **Sun Of The Deep Forge** |
| `custom:the-silent-queen` | The Last Altar of **The-silent-queen** | The Last Altar of **The Silent Queen** |
| `converted:aurelion_the_dawnfather` | The Last Altar of **Dawnfather** | The Last Altar of **Aurelion The Dawnfather** |
| `custom:lu_vael` | The Last Altar of **Vael** | The Last Altar of **Lu Vael** |
| `deity:The Pale Warden` | The Last Altar of The Pale Warden | *unchanged* |

## §2 · THE CURE IS A REUSE, NOT A NEW UN-SLUGIFY

`src/domain/display/deityNames.js` already exports `deityDisplayNameFromRef`, and its own
header records that `realmArcSummary.js` and `worldSnapshotPublic.js` BOTH converged on it
after paying the identical tail-pop defect. `realmEvents.js` was the **third** producer, still
carrying a private copy. It now reads the same resolver, so the three cannot drift apart.

- **The import.** `worldPulse → display` has FOUR landed precedents at this base —
  `chronicle.js:16`, `eventProse.js:36`, `pressureModel.js:2`, `settlementStrategy.js:53` —
  and `CENSUS_SCOPE_RE` is `/^src\/domain\/(?:worldPulse|spatial)\//`, measured live in
  `couplingInclusion.walker.test.js:615`, so `display/` is OUTSIDE it: **no coupling pair and
  no registry row is minted.** The walker is green untouched.
- **The arithmetic.** `+1` import line, `−2 +1` in the fallback ⇒ **net zero**.

### 2.1 Effective lines, measured on both instruments, both sides

| file | eff before | eff after | wc-l before | wc-l after |
|---|---:|---:|---:|---:|
| `src/domain/worldPulse/realmEvents.js` | 309 | **309** | 447 | 454 |
| `src/domain/certification/subsystemRowsVirtual.js` | 723 | **723** | 1300 | 1300 |

**Total new/changed effective production lines: ZERO of the 400 budget.** Both files sit under
the `src/domain/**.js` layer ceiling of 800 and neither is keyed in `scripts/.size-baseline.json`
(16 rows, re-derived at this base, zero hits).

### 2.2 The zero-headroom four — UNTOUCHED, and re-measured to say so

```
797	eff	1264	wc-l	src/domain/worldPulse/peaceTerms.js
818	eff	1045	wc-l	src/domain/worldPulse/warTermination.js
1581	eff	2865	wc-l	src/domain/worldPulse/pulseKernel.js
941	eff	1329	wc-l	src/domain/worldPulse/applyWorldPulse.js
```

Each equals the preamble's frozen table exactly. **`pulseKernel.js` appears in no hunk of this
member's diff at all**, so its net-zero obligation is discharged by absence rather than by
arithmetic — the strongest form available.

## §3 · THE TWO PROSE REPAIRS

**Item 2 — `src/domain/certification/subsystemRowsVirtual.js:1268`**, the `faithUnseatingEnabled`
row's `other:` value. ONE physical line, changed in place (`git diff --numstat` = `1 1`). Two
clauses were false at this base and a third was found false while measuring:

- the war-dissolution join has **LANDED** (WF-1D), so the future tense was wrong;
- ODQ **§309** re-filed the settlement obituary beat out of WF-1b and into **WF-8**;
- ⭐ **found, not chartered:** *"NOTHING IN PRODUCTION READS THE RING AT THIS WAVE"* was
  falsified by **WF-1E**, which landed at this very base — `religionState.js:644` projects the
  record and `faithPanelModel.js:197` renders it. Repaired on the same physical line, and
  RAISED at §9.

The row still grades **UNOBSERVED** and nothing about certification moves. `other.length` goes
**2,505 → 2,786** characters (measured at runtime on both trees, not counted off the source line) against the contract's `> 400` floor (`subsystemRowsVirtual.test.js:471`);
mutant (d) truncates it to prove that floor is live. No test pins the sentence verbatim (grepped),
and `tests/lint/.prose-numerics-baseline.json` (413 rows) keys this file NOWHERE, so no line
address can rot.

**§104.4, priced NOT INCURRED and re-derived rather than cited:** all five committed edge-bundle
metas were opened and their `inputs` arrays scanned (110 / 66 / 111 / 2 / 2 entries).
**Zero hits** for any member path.

**Item 3 — `tests/lint/couplingInclusion.walker.test.js:157`**, the FAITH exact-path row's
justification. The comment claimed `patronFall.js`'s "only importer is religiousContest.js";
WF-1D licensed a second one. The reworded block names both importers and the licensing row
`CPL-23.FAITH_TO_WAR.WF-1d.dissolution_names_the_fall` (`couplingRegistryWar.js:545`, verified
live), mirroring the language `patronFall.js`'s own header already landed at WF-1D M4. **The
ratio is UNAFFECTED** — it reads subject ownership, never importer count.

⛔ **The comment-lines-fire-ratchets hazard was priced BEFORE the edit.** Neither
`couplingInclusion.walker.test.js` nor `pantheon.test.js` carries a row in
`FROZEN_UNANCHORED_NEGATIVES`, so each sits at an EXACT ceiling of zero and any scanned
negative matcher spelled in prose reds the walker. Both files were scanned after the edits:
**zero sites.** Mutant (e) plants one deliberately and convicts, so the hazard is proved live
rather than assumed.

## §4 · THE DECLARED SHIFT (§P7.11) — PROVED KEY BY KEY

A probe reproducing `pantheon.test.js` A1's fixture verbatim, plus an eleven-ref sweep of every
ref FORM, was run against a **`git archive` tree of `3ac279db`** and against the wired tree,
same harness.

```
KEYSETS IDENTICAL: zero added, zero removed
```

Of **45** emitted keys, **0 added, 0 removed, and 14 moved** — every mover a name-bearing
string of a ref whose LAST segment carries `_` or `-`. Nothing else moved: the production `deity:<Name>` shape, the scan-resolved
arms, the empty ref, the beat's `id`, `score`, `tags`, `impactKind` and `settlementIds` are all
byte-identical across the two trees.

⚠ **ONE FURTHER DIFFERENCE, MEASURED AND PROVED UNREACHABLE.** On a `null` or `undefined`
`deityId` the old floor printed `'Null'` / `'Undefined'` and the shared one returns the empty
string. It cannot occur in production: `changes[].deityId` is an `Object.keys()` iteration
variable over the pantheon ledger at `pantheon.js:384` and `:441`, so it is always a non-empty
string, and the two upstream builders (`ratchetFaith`, `collectFaithDeltas`) each guard
`deityId == null` before a key is ever minted. `0`, `false` and `123` are byte-identical across
the cure. Stated because the declared-shift claim is about REACHABLE copy, and an unreachable
difference left unstated is the kind of thing a later lane re-finds as a defect.

⭐ **THE SHIFT WAS RE-PROVED AFTER THE REBASE, ON A FRESH `git archive` TREE OF THE NEW
BASE** — 45 keys, 0 added, 0 removed, **14 moved**, the identical set. And the pristine
transcripts at the two bases are byte-identical to each other, which is the affirmative
statement that MF-T2D changed nothing this member observes.

**Total agreement is now measured, not hoped:** for all eleven swept refs the beat's headline
equals `The Last Altar of ${deityDisplayNameFromRef(ref)}` — **11 matches, zero divergences.**

**Blast radius, executed rather than trusted.** Running the wired tree against the untouched
committed corpus, **exactly ONE assertion failed**:

```
FAIL tests/domain/pantheon.test.js > … > A1 the last-seat beat fires ONCE …
AssertionError: expected 'The Last Altar of Sun Of The Deep For…' to be 'The Last Altar of Forge'
Tests  1 failed | 40 passed (41)
```

That is the SEPARATELY LABELLED MEASURED-TRUTH ARM WF-1C authored for exactly this re-record,
whose own comment said *"if the chair takes the cure, exactly this arm re-records with a
declared cause."* It is now re-labelled as the cured pin with its cause declared inline.
`tests/property/worldpulseDeityGolden.test.js` is **GREEN on both sides** — the STOP the seed
set for golden motion does not fire. A grep of `tests/fixtures/` for the arc phrases returns
**zero**, and no preset declares `faithUnseatingEnabled`.

⛔ **The re-recorded value was derived by EXECUTING the cured helper**, never predicted: it is
read off both the probe transcript and the assertion message above.

⭐ **The `:419` control does NOT move and stays a live discriminator.** Handed the prior
snapshot, the same ref resolves by SCAN to the AUTHORED `'Sun of the Deep Forge'`, whose casing
the slug destroyed and no floor can recover; the cured floor returns `'Sun Of The Deep Forge'`.
The two differ by exactly that casing, so a floor that silently began winning over the scan
would red the control.

## §5 · CENSUS — STILL, AND CONVICTED RATHER THAN ASSERTED

Prediction: **+0/+0/+0/+0/+0**. The lighting walker is **GREEN UNTOUCHED** at the wired tip
(33 passed, exit 0), so **no re-record block is owed and none was written.**

The stillness is not inferred from that green alone. All five figures were re-derived at this
base by placeholder-and-convict — each zeroed in turn and the walker made to state its own
live measurement:

| # | figure | conviction message, verbatim |
|---|---|---|
| 1 | `files` | `the estate's file count moved — re-measure, do not re-word: expected 2492 to be +0` |
| 2 | `parked` | `the parked-file count moved from SP-C's measured 358 …: expected 364 to be +0` |
| 3 | `credited` | `the credited-file count moved from SP-C's measured 1,960: expected 2128 to be +0` |
| 4 | `titles` | `the live TEST-title count moved from SP-C's measured 18,471 …: expected 20677 to be +0` |
| 5 | `suiteTitles` | `the live SUITE-title count moved from SP-C's measured 5,260 …: expected 5780 to be +0` |

**`2492/364/2128/20677/5780` at this base → `2492/364/2128/20677/5780` measured at the tip.**
⛔ The tuple was RE-DERIVED at the new base after the rebase; the `2490/364/2126/20669/5778`
figure this member first measured at `3ac279db` was DISCARDED, never carried. The
walker file was restored `md5`-exact afterwards.

⭐ **`suiteTitles` proved SEPARATELY**, because a sequenced census that stops early never
executes its later figures: the member's whole diff over `tests/` was grepped for added and
removed `describe(` lines and both counts are **ZERO**; added `it(`/`test(` lines are **ZERO**
too. `pantheon.test.js` runs 36 tests before and 36 after.

## §6 · MUTANTS — EXECUTED, WITH THEIR MEASURED CONVICTIONS

Planted by `cp`, `node --check`ed, convicted, restored, and every restore **proved `md5`-exact**.
⛔ Never the `git checkout` family. Post-restore: **75/75 green**, `git status` showing exactly
the four intended files.

| mutant | predicted | **MEASURED** |
|---|---|---|
| (a) revert the cure to the tail-pop | the re-recorded arm alone | **A1 alone** (1 failed / 35 passed) ✓ |
| (b) delegate to `deityNameFromSnapshots` (the refused widening) | nothing pinned it | ⛔ **36/36 PASSED — the seed's own refusal was unenforced.** A guard was written; it now convicts **A1 alone** |
| (c) title-case only the first token (a plausible half-cure) | A1 | **A1 alone** (1 failed / 35 passed) ✓ |
| (d) truncate the certification row below its floor | the registry contract | **`each row conforms to the registry contract`** alone ✓ |
| (e) spell a scanned negative matcher in the new walker prose | the anchor walker | **`no NEW un-anchored negative assertion …`** alone ✓ |

⭐ **Mutant (b) is the one that earned its keep.** The seed forbade the wider delegation in
prose; the executed mutant proved nothing in the estate would have caught it. The new arm
builds the one world where the two resolvers disagree — a town whose PATRON is Harrow but which
still keeps the forge creed as a CULT — and pins the floor's casing, so widening the scan now
reds A1 immediately.

## §7 · ACCEPTANCE (closed denominator — 3 cases, all executed)

All three live INSIDE the existing `A1` test in `tests/domain/pantheon.test.js`, which is why
the census does not move. Each fixture was RUN AND PRINTED before its pin was written.

| id | case | convicted by |
|---|---|---|
| **A1** | THE DECLARED SHIFT, RE-RECORDED WITH ITS CAUSE. The measured-truth arm now pins the cured floor's output, derived by executing the helper. The stale-snapshot control does not move and stays a live discriminator — the two strings differ by exactly the casing the slug destroyed. | (a), (c) |
| **A2** | AGREEMENT WITH THE ONE SHARED RESOLVER. For five refs absent from the snapshot, the beat's headline, summary opening and first reason all equal what `deityDisplayNameFromRef` returns. Four carry `_`/`-` and return multi-word answers the old floor could never produce; the fifth carries neither, proving the arm is not counting spaces. | (a), (c) |
| **A3** | THE CURE REPLACED A FLOOR, NOT A SCAN. On a town whose patron is Harrow but which still keeps the forge creed as a CULT, the beat must render the FLOOR's casing. The fixture is asserted to really carry the cult snapshot before the arm consumes it. | (b) |

The two prose items carry no new acceptance case by design: item 2 is re-verified by the
existing registry-contract arm (mutant (d)) and item 3 by the anchor walker (mutant (e)).

## §8 · EXACT CHANGE MANIFEST

| action | path | what |
|---|---|---|
| MODIFY | `src/domain/worldPulse/realmEvents.js` | the import and the two fallback lines; net **0** effective |
| MODIFY | `src/domain/certification/subsystemRowsVirtual.js` | ONE physical line, in place; net **0** effective |
| TEST | `tests/domain/pantheon.test.js` | the re-recorded arm, the agreement arm and the scan-width guard — all inside the EXISTING `A1` test, so no title moves |
| TEST | `tests/lint/couplingInclusion.walker.test.js` | comment-only; the justification block names both importers and the licensing row |
| DOC | `docs/implementation/packets/fp/WF-1F.md` | this packet |

**Budget reconciliation:** existing logic files modified **2** of 3 · handwritten files **5** of
12 · new persisted record families **0** · user-facing components **0** · generated artefacts
**none** · overrides needed **NONE**. Every cap the seed priced holds as measured.

## §9 · JUDGMENT CALLS AND RAISED MATTERS

- **J-TEWF1F-1 — the agreement, re-record and scan-width arms are folded INSIDE the existing
  `A1` test rather than added as new `it()` calls.** The seed prices the census delta at exactly
  `+0/+0/+0/+0/+0` and "arm" is this estate's word for an assertion group, not a title
  (WF-1C's own "separately labelled measured-truth ARM" is a block inside `A1`). New titles
  would have moved figure 4. *Veto: split them into their own `it()` calls and re-record the
  tuple.*
- **J-TEWF1F-2 — a scan-width guard was written that the seed did not require.** Mutant (b)
  passed 36/36, proving the seed's ⛔ against `deityNameFromSnapshots` was prose with no
  machinery behind it. The guard costs zero titles and zero production lines. *Veto: drop the
  arm and accept that a future widening of the arc producer's scan goes unseen.*
- **RAISED-1 — a THIRD stale clause was found in the §326.4 row and repaired beyond the
  charter.** *"NOTHING IN PRODUCTION READS THE RING AT THIS WAVE"* is falsified by WF-1E, which
  landed at this member's own base. The repair sits on the same physical line the charter
  already opened and changes no behaviour, but the chair should know the charter was widened by
  one clause. *If the chair prefers the narrow charter, the clause reverts to its WF-1a wording
  in a one-line edit — but it will then be knowingly false.*
- **RAISED-2 — the cure changes `custom:lu_<name>` refs too**, which is the shape the test
  helper `deitySnapshot` mints throughout `pantheon.test.js` (`custom:lu_vael` → "Vael" becomes
  "Lu Vael"). No committed pin moved, because every such pin is scan-resolved, but a future
  fixture that lets one fall through the floor will read "Lu Vael". Recorded so it is not
  re-found as a defect.

## §10 · CHECKS — EXECUTED, EXITS CAPTURED IN-SHELL

Logs are self-named `laneTEWF1F-*.log`; every exit was captured in-shell, never from a pipe.

| step | result | TRUE_EXIT |
|---|---|---|
| `npm ci` (the worktree's OWN `node_modules`) | ok | **0** |
| baseline battery at the PRISTINE base, before the first edit | 6 files, **113 passed** | **0** |
| behaviour battery, 6 files | **91 passed** | **0** |
| walker battery, 6 files | **103 passed** | **0** |
| `npx eslint` × 2 production + 2 test files | clean | **0** |
| `npm run typecheck:ratchet` | `no type regressions (173 error(s), ceiling 173)` | **0** |
| `npm run typecheck:domain:strict` | `no strict-type regressions (1134 errors, ceiling 1134)` | **0** |
| `validate:packets` @ DRAFT | `valid: 137 packets (0 READY)` at `3ac279db`; **138** after the rebase | **0** |
| `validate:packets` @ READY | `valid: 137 packets (1 READY)` at `3ac279db` | **0** |
| `validate:packets` @ LANDED | `valid: **138** packets (0 READY)` at this base | **0** |

⚠ Both typechecks are reported at their exact floors with the config named, per §P5.

### The pre-existing reds — EARNED EMPIRICALLY, NEVER ASSUMED

`npx vitest run tests/lint tests/build` reports **5 failed of 2,114**: `warCostKindPools` ×3,
`warRulingKindPools` ×1, `clampPrimitiveBaseline` ×1. A sixth,
`tests/docs/enforcement-claims.test.js`, fails in the docs tree. All six carry rows in
`scripts/.test-ratchet-baseline.json` (7 entries, looked up rather than inferred), and the five
reproduce **identically — `5 failed | 76 passed`** at the **pristine `git archive` tree of
`3ac279db`**, a tree containing none of this member's edits.

⭐ The `enforcement-claims` offender list was compared LIST-TO-LIST rather than by count: the
**same six lines** in the **same three documents** at pristine and wired. This member's
contribution to that debt is **zero**, and a `CLAIM_RE` scan of this packet returns **0 hits**.
