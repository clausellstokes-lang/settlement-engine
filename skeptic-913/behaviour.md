# SKEPTIC §913 — LENS: THE BEHAVIOUR CURES (car 7 `f46ba7846`, DEF-1…DEF-5)
Seat: Opus 5 — Fable-unvalidated (verifier). Read-only on every tree and dock.
Dock `$SC/laneLMAT`, tip `19642a9fc`; `git status --porcelain | wc -l` = **0 BEFORE**, **0 AFTER**.
Every figure below came from a command executed in this session.

## METHOD
- Diffs read with `git diff 7d96e2b72..f46ba7846 -- <path>` and `git show f46ba7846:<path>`.
- Counterfactuals executed OUTSIDE the dock: `$SK/revert/src` is a full copy of the dock's `src`
  with ONE file replaced by its `7d96e2b72` content (md5-verified on write). No dock byte moved.
- Three focused vitest files were run one at a time (HOLD-VITEST absent, `pgrep` 0 before each).

## VERDICTS

### DEF-1 — the gallery ingest — **CONFIRMED, with ONE correction (PARTLY on the BEFORE row)**
- `scrubGalleryImportLivingContent` exists in the single-writer module and is applied on BOTH
  gallery paths: `galleryImportSettlement.js:71` and `galleryImportMap.js:293`. Grep found
  exactly two gallery importers in `src/store/`. Reference-identity is a real early return
  (`if (!hasRecord && !hasMarker) return settlement;`), pinned by an arm.
- **REFUSAL 5 — the mechanism CONFIRMED.** `scrubImportedConfig` really is shared by three
  import paths: `accountImport.js:610` (inside `prepareSettlementEntry`), `galleryImportMap.js:301`,
  `galleryImportSettlement.js:82`. The refusal's arm (`⛔ THE ACCOUNT PATH KEEPS THE MARKER`)
  calls `prepareSettlementEntry`, which is the function that calls the shared scrub — so adding
  the marker to that destructure WOULD red the arm. The arm can fail.
- **PARTLY — the BEFORE row is unconditional and the live path is not.** The default public
  projection is an ALLOWLIST (`_gallery_sanitize_public_json`, net-current in migration 189)
  whose 40 top-level keys contain neither record, so a plain public dossier never carried them.
  The leak the cure closes is real but reaches the ingest only through the DM-full opt-in:
  migration 120's `import_gallery_dossier` serves `_gallery_dm_full_json(base.j)` when
  `s.gallery_share_dm`, and that function (net-current in 129) is a DENYLIST
  (`j - 'aiData' - … - '_config'`) that names neither record — so both ride through server-side.
  Correction: "on a DM-shared dossier" belongs in the BEFORE row. The severity is unchanged
  (it is the same SQL twin the receipt already books as owed); the sentence is what over-reaches.

### DEF-2 — the birth clamp — **CONFIRMED, executed in both directions**
`skeptic-913/def2-counterfactual.mjs`, pre-cure file vs tip file, same probe:
```
PRE-CURE (7d96e2b72) | marker on born config = 2         | roster minted from born config = ROSTER
TIP     (f46ba7846)  | marker on born config = undefined | roster minted from born config = null
```
The receipt's BEFORE ("a LIT marker … minted a roster on a shipped dark build") and AFTER
reproduce exactly. The arm `⛔ CREATE (THE CLAMP)` carries its own positive control
(`buildLivingContentRoster(pack, hydrated)` must be non-null first), so it cannot go green by
the path disappearing; `⛔ THE CLAMP DOES NOT DEFEAT THE MINT` arms the other direction.
`npx vitest run tests/domain/livingContentLawWiring.test.js` → **exit 0, 12 passed**.

### DEF-3 — the RE-CUT (drop instead of remap) — **PARTLY: the ruling holds, two receipt
sentences over-reach**
1. **"the only constructible identity map is the empty `archiveBacked:false` default"** —
   CONFIRMED by reading: this boundary passes no archive, and `accountContentPortability.js:276`
   is the only non-archive-backed constructor.
2. **"every non-null record refuses anyway, byte for byte the same outcome" — REFUTED for one
   constructible case.** Executed (`skeptic-913/remap-vs-drop.mjs`) against the empty map:
   - roster w/ account-identity row → `..._identity_incomplete` (refuse) ✔
   - roster w/ local-only row → `..._identity_incomplete` (refuse) ✔
   - roster w/ empty bucket arrays → `..._shape_unreadable` (refuse) ✔
   - provenance w/ ONE definition → `settlement_content_provenance_invalid` (refuse) ✔
   - **provenance with ZERO `materializedDefinitions` → `{ok:true}` and the receipt is CARRIED
     back unchanged (same `receiptHash` 76a0494a…)**. `admitSettlementContentProvenance` caps the
     array at 2 000 and sets no minimum, so a hand-written import file can hold one. The remap
     would keep that record; the shipped drop deletes it and reports an issue. The DROP is the
     STRICTER of the two — the ruling is not weakened — but "byte for byte the same outcome" is
     false as written.
3. **"the remapper import added three modules to `web-transitive`" — PARTLY (mis-attribution).**
   Executed `surfaceClosures` probe (`skeptic-913/closure-probe.mjs`) over the dock tree:
   tip `web-transitive` = **898**; adding ONLY the portability edge to
   `importReconciliationAdmission.js` (which IS in web-transitive; portability and provenance are
   NOT) gives **900**, added = exactly
   `accountSettlementContentPortability.js` + `settlementContentProvenance.js` — **two, not three**.
   `livingContentLawVersion.js` is car 7's own DEF-1 edge (`importScrub.js:6`), the only
   web-transitive importer of that leaf; the frozen baseline's `closureSizes["web-transitive"]`
   is **897**, so the receipt's other sentence — "closure diff vs HEAD = `livingContentLawVersion.js`
   alone" (898 = 897 + 1) — is CONFIRMED. Three is the car's total against HEAD, not the
   remapper's.
4. **The `source on stress` flip — CONFIRMED by execution.** `scanSurfaceReads` over the two
   would-be-added files grades `source on stress` **R** from
   `src/domain/content/settlementContentProvenance.js`; the same identity is frozen at
   `web-transitive=N` in `scripts/.writer-reach-baseline.json`. The red the lane reports is the
   red that mechanism produces. (The counterfactual walker RUN itself is UNTESTED — reproducing it
   needs a dock edit, which the fences forbid.)
5. **Does `Object.hasOwn` change a case? YES — one, and it is not called out.** A settlement
   carrying `customContentRoster: null` (key present, value null) is deleted AND reported as
   `settlement_content_record_unmappable`, where a `!= null` read would leave it and say nothing.
   Harmless (a null carries no source id) but it is a behaviour difference, not a pure
   instrument-avoidance choice. Note also that `Object.hasOwn(x,'k')` is invisible to BOTH
   instruments (neither counts a call argument), which the site comment states openly.
6. **The drop's placement — CONFIRMED.** `prepareSettlementEntry` is called once in the file
   (`:606`), the drop runs at `:631`, and `normalizedInput: detachedRecord(prepared.entry)` is at
   `:677`; `importReconciliationExecution.js:53` hands that to `create-and-attach`. Single path.
7. **A hole I looked for and did NOT find.** DEF-4 proves snapshots are a write path, and the
   reconciliation drop touches only `entry.settlement` — so I tested whether a foreign roster
   could ride reconciliation inside `versionHistory`. It cannot: `prepareSettlementEntry` restores
   a lifecycle only on `meta.restoreLifecycle === true` (`accountImport.js:639`), and the
   reconciliation call does not pass it. Executed: the reconciliation meta yields
   `versionHistory.length = 0` while the live settlement still carries `"src-secret-def"` (which is
   exactly what the drop then removes). The DEF-3 BEFORE ("reached `normalizedInput` … unwarned")
   is therefore reproduced at its first hop by execution.
`npx vitest run tests/lib/importReconciliation.test.js` → **exit 0, 18 passed**.

### DEF-4 — undo / version history — **CONFIRMED**
- `entry.versionHistory = lifecycle.versionHistory` (`accountImport.js:654`), and the car-7 loop
  iterates `preparedResult.entry.versionHistory` — the right array.
- Every `versionHistory[i].settlement` takes the same remap-or-drop, including the no-archive
  case: with the empty map every non-null roster refuses (measured above) and the loop `delete`s
  it. Both envelopes are armed in `accountImportSlice.test.js` (`a v3 ARCHIVE envelope remaps the
  SNAPSHOT roster too` and the no-archive twin, which pins the exact two warning strings).
- The loop's `!= null` guards leave an explicit-null snapshot key in place — no source id, no
  consequence.
`npx vitest run tests/store/accountImportSlice.test.js` → **exit 0, 26 passed**.

### DEF-5 — the local-only roster row — **CONFIRMED, executed**
`skeptic-913/def5-counterfactual.mjs`, pre-cure file vs tip file, a fully localUid-mapped roster:
```
PRE-CURE (7d96e2b72) => {"ok":false,"code":"settlement_living_content_roster_identity_incomplete"}
TIP     (f46ba7846)  => {"ok":true, … deities:[{… "localUid":"dest-lu-1", "name":"Local Patron"}]}
```
The receipt's BEFORE/AFTER row reproduces exactly. Four fixture arms exist, not one
(LOCAL-ONLY · MIXED · UNRESOLVABLE localUid · EMPTY-STRING `customDefinitionId`).
The local-only branch is safe: `CUSTOM_DEFINITION_IDENTITY_KEYS` names all five
`customDefinition*` keys, so a row reaches that branch only when every one of them is
absent/null/empty — no source-account identifier can ride through it.
`npx vitest run tests/lib/accountSettlementContentPortability.test.js` → **exit 0, 17 passed**.

### THE PROMISE TABLE — **CONFIRMED** (every named arm exists and asserts what the row says)
| path | arm | present |
|---|---|---|
| create | `⛔ CREATE (THE CLAMP)` + `⛔ THE CLAMP DOES NOT DEFEAT THE MINT` | ✔ `livingContentLawWiring.test.js:178`, `:224` |
| read / regenerate | dark arms + same-seed control | ✔ `:152`, `:163`, `:261`, `:271` |
| persist | `DEF-3 — reconciliation drops what it cannot re-address` | ✔ `importReconciliation.test.js:507` (2 arms) |
| undo | archive twin + no-archive twin | ✔ `accountImportSlice.test.js:1225` describe |
| import (gallery) | `⛔ DEF-1: a foreign scope record never lands in the importer's library` | ✔ `campaignSlice.galleryImport.test.js:119` |
| import (account) | `⛔ THE ACCOUNT PATH KEEPS THE MARKER` + the DEF-5 quartet | ✔ `importScrub.test.js`, `accountSettlementContentPortability.test.js:447-533` |

## THE THREE CORRECTIONS THE RECEIPT SHOULD TAKE
1. DEF-1 BEFORE: qualify it — the ingest carried the records from a **DM-shared** dossier; the
   default public projection is an allowlist that already dropped them.
2. DEF-3: "every non-null record refuses anyway, byte for byte the same outcome" → a
   zero-definition provenance receipt is CARRIED by the remap and DROPPED by the cure. Say the
   drop is stricter, not identical.
3. DEF-3: the remapper import adds **two** modules to `web-transitive` (897→899 against HEAD);
   the third, `livingContentLawVersion.js`, is DEF-1's own edge and is present at the shipped tip.
