# LANE R-MF-FLIPS — MF-CH3 three-place flip + MF-CH2B mint readiness (survey only, nothing executed)

**Bases:** every build-code fact below is resolved against build tip **`eba286607`** (branch `claude/composite-r4`, subject "W-SEAM rebase: re-derive the census WHOLE at the merged tip…") via `git show`/`git grep <sha>`; every docs/ledger fact against ledger **HEAD `8f208c46e`** (branch `review-fixes-2026-07-08`), with `docs/OWNER_DECISION_QUEUE.md` read from the working tree (verified identical in every quoted region). **Concurrent hazard:** lane TE-STRIP-2 is landing on top of `eba286607` — see §F STRIP-2-DELTA before executing anything from this report.

**Standing debt being surveyed** (HANDOFF_CURRENT.md:128, verbatim): *"MF-CH3 owes a three-place flip to LANDED — a landing act on TE-CH-3's car; its nine contested paths have since moved again."* MF-CH2B owes a MINT (ODQ §724.5 / §739.2; DESIGN_MAP_MODULE_SPLIT.md:63 "Landing-act residue: MF-CH3 three-place flip · MF-CH2B mint").

---

## §A · The three places, named exactly — with current values (CONFIRMED)

"Three places" is the estate's standard per-car flip (ODQ §516.2/§516.3 "the three-place flip per car"), and the validator enforces their agreement, which is what makes it three places and not one:

| # | Place | Value at `eba286607` | Value at HEAD `8f208c46e` | Validator arm enforcing it |
|---|---|---|---|---|
| 1 | Packet header — `docs/implementation/packets/catalog-hygiene/MF-CH3.md:3` | `- **Status:** DRAFT` (line 5: `- **Verified base:** \`claude/composite-r4\` at \`86794b5d2480d6bf7821aa390a82f99f4babeeca\``) | **file ABSENT at HEAD** — the ledger branch's `docs/implementation/` is an old 12-packet era (ids TC/SC/GR/IN/IA/ES only; no `catalog-hygiene/` dir) | `parsePacketHeader` (`scripts/implementation-packets.mjs:251`, EOL-anchored status row per J-TEWF1B-1); disagreement reds at :831 `status disagrees with packet Markdown` and :833 `verifiedBase disagrees with packet Markdown` |
| 2 | Manifest record — `docs/implementation/PACKET_MANIFEST.json` (at `eba286607` lines 27781–27784) | `"id": "MF-CH3", "status": "DRAFT", … "verifiedBase": "86794b5d2480d6bf7821aa390a82f99f4babeeca"` | **record ABSENT at HEAD** (HEAD manifest holds 12 packets, none MF-*) | the record IS the manifest's own truth; non-terminal status drives path reservation (`reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)`, :633; `TERMINAL_PACKET_STATUSES = {LANDED, SUPERSEDED}`, :43) |
| 3 | INDEX status cell — `docs/implementation/INDEX.md:1049` (at `eba286607`) | cell 3 of the MF-CH3 row opens `**DRAFT**; built by lane TE-CH-3; …` | **row ABSENT at HEAD** (`git grep "MF-CH" HEAD -- docs/implementation/INDEX.md` = 0 hits) | `parseIndexPacketStatuses` (:280) reads the cell AFTER the link cell; mismatch reds at ~:838 (`indexStatus !== status`) |

**Manifest census at `eba286607` (CONFIRMED by parsing the JSON):** 182 packets = **179 LANDED / 2 DRAFT / 1 SUPERSEDED (IA-2)**. The two DRAFTs are **MF-CH3** and **MF-CG2** (both `verifiedBase 86794b5d2`). Note the sibling: **MF-CG2 wears the identical landed-car-in-a-DRAFT-packet state** (its code landed as car 58 of the same TE-STACK-5, §548.1) and presumably owes its own flip — outside this lane's charter, flagged for the chair.

**⚠ The INDEX-cell token trap, measured (CONFIRMED).** `PACKET_STATUSES` order is `[BLOCKED, DRAFT, LANDED, READY, STALE, SUPERSEDED]` (`implementation-packets.mjs:21-28`), and the parser takes the FIRST array-order member matching anywhere in the **uppercased** cell (:292-294) — this is §556.4's "DRAFT beats LANDED". A case-insensitive status-token census of MF-CH3's status cell (INDEX.md:1049, cell 3): **DRAFT ×1** (the leading token), **LANDED ×1** ("both LANDED at this base"), **SUPERSEDED ×1** (lowercase "superseded figures", uppercased by the parser). Consequence: flipping the leading token to `**LANDED**` parses correctly (BLOCKED no → DRAFT no → LANDED yes), but **deleting** the leading token instead would silently parse the cell as SUPERSEDED. Edit by replacement, never removal.

**Why the flip was left owed (CONFIRMED, ODQ §556.3/§556.5/§556.10):** MF-CH3's code landed as car 57 of TE-STACK-5 (`86794b5d2 → 510c51b76`, §548.1 — 18 CH-3 commits are ancestors of the slot, its one CREATE file exists, 18 of 22 changeManifest rows already moved), but the packet was never flipped; the TE-STACK-6 lane's "I minted it at LANDED in all three places" meant CH-5's own packet (§556.5, pronoun checked at the data). §556.10 queued it: *"requiring its arms certified and its base re-stamped."* The stale DRAFT was what forced CH-5 to mint straight to LANDED (§556.4: at DRAFT, `TRUE_EXIT=1` with exactly nine `duplicate change path across packets` errors, every one `(MF-CH3, MF-CH5)`).

---

## §B · The nine contested paths — derivation and current state (CONFIRMED)

**Derivation (executed, not quoted):** intersection of the two packets' `changeManifest` path sets in `PACKET_MANIFEST.json` at `eba286607` — MF-CH3 22 paths ∩ MF-CH5 17 paths = **exactly 9**, matching §556.4's nine error count one-to-one:

| # | Path | CH3 action | CH5 action | Moved again AFTER MF-CH3's landing (`510c51b76..eba286607`, `git log --oneline -- <path>`) |
|---|---|---|---|---|
| 1 | `src/data/institutionalCatalog.js` | MODIFY | MODIFY | `ed96f0eba` (TE-CH-5 Shape F) → `17c4d75a1` (TE-CH-6, newest) |
| 2 | `tests/fixtures/generator-golden-master.json` | MODIFY | MODIFY | `ed96f0eba` (CH-5, 187/525 re-record) → `c1b93b657` (CH-6, newest) |
| 3 | `tests/property/generatorGoldenMaster.test.js` | MODIFY | MODIFY | `ed96f0eba` (CH-5 SHIFT RECORD) → `c1b93b657` (CH-6, newest) |
| 4 | `supabase/functions/_shared/aiCharterBundle.js` | DOC | MODIFY | `18dc99d1c` (CH-5) → `479992b6e` (MF-CH7) → `85a20b0b7` (CH-6, newest) |
| 5 | `supabase/functions/_shared/aiCharterBundle.meta.json` | DOC | MODIFY | `18dc99d1c` → `479992b6e` → `2011a5e18`/`e7ea1cbbc` (CH-4) → `85a20b0b7` (CH-6, newest) |
| 6 | `supabase/functions/_shared/aiGroundingBundle.js` | DOC | MODIFY | same chain as #5 |
| 7 | `supabase/functions/_shared/aiGroundingBundle.meta.json` | DOC | MODIFY | same chain as #5 |
| 8 | `supabase/functions/_shared/aiOutputSchemaBundle.js` | DOC | MODIFY | `18dc99d1c` → `479992b6e` → `85a20b0b7` (CH-6, newest) |
| 9 | `supabase/functions/_shared/aiOutputSchemaBundle.meta.json` | DOC | MODIFY | same chain as #5 |

**Reading:** the handoff's "have since moved again" is TRUE and UNDERSTATES — all nine were moved by CH-5 (§556.10's claim) and then again by CH-7, CH-4 and CH-6 (newest touch on every one is a CH-6 commit; zero touches by WSEAM or any strip — the strip lanes' footprints are disjoint). **What this means for the flip:** nothing in these paths blocks it. The flip does not edit contested paths; their motion only means MF-CH3's packet-interior figures (272/525 golden rows etc.) are a historical record of base `86794b5d2`, which is precisely why §556.10 requires **arms certified at the current tip + base re-stamped** rather than figure re-derivation. Once status is terminal the reservation dissolves (`:633`) and "a terminal packet reserves nothing" (§556.4).

**RequiredSymbols pre-flight at `eba286607` (CONFIRMED, 10/10 present — the arm that killed the CH2B one-file mint cannot kill this flip):** all six `lookups.js` symbols (`institutionAvailableAtTier` :67, `filterCatalogByTierGate` :95, `effectiveTierOf` :78, `getInstitutionalCatalog` :142, `getFullCatalogWithTierMeta` :162, `getInstitutionsForTier` :182), `tierAtLeast` (`src/data/constants.js:23`), both walker symbols (`tests/lint/catalogTierGateParity.walker.test.js:67,:74`), and `inst.exclusiveGroupCoexists` (`src/generators/steps/assembleInstitutions.js:348`).

---

## §C · MF-CH2B — what the mint consists of, and its inputs

**State at `eba286607` (all CONFIRMED):**
- Packet file EXISTS: `docs/implementation/packets/catalog-hygiene/MF-CH2B.md` — `Status: DRAFT`, `Verified base: b2852ccc3…` (lines 3/6), carrying its own `§0.0 ⛔ STOP` block (now stale — the STOP's cause was cured by CH-5, ruled §541.6).
- Manifest record **ABSENT** (182 packets, no MF-CH2B — §520.5/§542.8's deliberate orphan; the validator has no orphan-packet-file arm, §542.8).
- INDEX row **ABSENT** (`git grep MF-CH2B eba286607 -- docs/implementation/INDEX.md` = 3 hits, all inside sibling rows CH2A/CH3/CH5 at lines 1048–1050; zero own rows).
- **The car's CODE IS NOT IN THE TREE:** `tests/lint/magicShelfGateCensus.walker.test.js` does not exist at `eba286607` (`git cat-file -e` fatal); `NON_MAGIC_EXOTICS` — which arm B8 asserts deleted — is still live at `src/generators/institutionProbability.js:187`; the `@non-catalog-fallback MF-CH2` markers arm B2 pins at per-file counts 2/1/2/1 exist in only ONE file (`src/domain/arcaneInstitutionIdentity.js`, MF-CH2A's). §542.9 J4: "MF-CH2B stays DRAFT, held code not landed."
- **Where the held code lives:** `refs/preserve/ch2b-build-2026-08-25` = `2ccb20d59` (ref verified present in this repo; pinned §626.1 after the build tree was found gc-exposed as dangling commits). It is 8 commits over `b2852ccc3` (CH-1's tip); the MF-CH2B half is the last 4 (`a38cd3bb5` the five gates, `1a6ff1298` the walker + ratchets, `70bb64f23` the golden re-record 92/525, `2ccb20d59` the packet).

**The mint, itemized** (from §542.8, §556.4's CH-5 precedent, MF-CH5's INDEX anti-scope "needs a MINT rather than a three-place flip (it is an orphan packet file with one home) … requiring its nine acceptance arms certified", and §626.2):
1. **Land the held code first** — a build-branch landing through the gate. Footprint (CONFIRMED from `git diff --stat 90a12cd1b 2ccb20d59`, 12 paths): `institutionProbability.js`, `generationContext.js`, `magicFilter.js` (the three production files), CREATE `tests/lint/magicShelfGateCensus.walker.test.js` (nine arms B1–B8+B7b, eight mutants N1b–N8), re-records of `generator-golden-master.json` + SHIFT RECORD in `generatorGoldenMaster.test.js`, re-points of `magicLicenceCensus.walker.test.js` arm A7, `observedShapeReaders.walker.test.js` corpus meta, `mundaneRealmAcceptance.test.js` figures, `scripts/mutation-coverage-manifest.json`, `docs/DESIGN_REALM_MAGIC_TOGGLE.md`, the packet .md.
2. **Certify the nine acceptance arms** at the landed tip.
3. **Write the manifest record** (id/status/packetPath/verifiedBase/changeManifest/requiredSymbols/acceptanceCases ≤8/checks — §542.8 called this "a one-file edit" *conditional on the code existing*, because `requiredSymbols` existence is asserted at EVERY status, :745).
4. **Write the INDEX row** (currently zero).
5. **Flip the packet .md header** DRAFT → LANDED + re-stamp its base — i.e., the mint SUBSUMES a three-place act, but places 2 and 3 are creations, not flips.

**Inputs/blockers, in dependency order:**
- **(i) MF-CH3's flip must precede it — the "shared fixtures" of §626.2, mechanism CONFIRMED by path intersection:** DRAFT MF-CH3 reserves exactly FOUR of MF-CH2B's twelve paths (`tests/fixtures/generator-golden-master.json`, `tests/property/generatorGoldenMaster.test.js`, `tests/lib/instantWorld/mundaneRealmAcceptance.test.js`, `scripts/mutation-coverage-manifest.json`); a CH2B manifest row minted while CH-3 is non-terminal reds `duplicate change path across packets` ×4. MF-CG2's DRAFT collides with ZERO of them (checked). §626.2, verbatim: *"it can mint only after MF-CH3 lands (shared fixtures)."*
- **(ii) Every figure in the packet is stale** — §626.2: *"every figure in it is stale six catalog-moves later, its re-derivation is the dispatch's first act"* — and it is now MORE than six (CH-5/CH-7/CH-4/CH-6 landed after that count, plus the strips). The held code sits on `b2852ccc3`, which is **eight catalog-train landings behind** `eba286607`; the golden it re-records (92/525 at its base) and its census delta (+1/+0/+1/+8/+1, packet §6) must be re-derived wholesale at the rebased tip.
- **(iii) The car's own four reds** (packet §0.0) need re-pricing at the new base: `powerEconomyFreshness` pinned-scenario re-record, `intentAtlasSoakDistiller` artifact re-record, **`effectReachability.coverage` — a genuine coverage LOSS (2 of 12 authored effects stop firing) that "wants a corpus widening or a stated reason, not a re-record"** (the one open judgment), and the magicForms STOP — now expected GREEN since CH-5 removed its cause (§541.6; MF-CH5's INDEX anti-scope: the STOP arm "was ALREADY GREEN at this base and at two earlier ones, non-vacuously… must NOT be credited" to CH-5).
- **(iv) `ARCANE_INST_TAGS` post-CH-5/CH-6 shape** — the held code was written when `alchemy` was still in the list; §556.1 verified at tip `['arcane','planar','enchanting']` and `npcProfile.js` derives from the leaf. The rebase must re-verify arms B1/B7b against the moved vocabulary (PLAUSIBLE that diffs are mechanical; the walker reads live source, but its frozen expectations may pin stale members).

---

## §D · Docs-only or build-branch? (both answered, CONFIRMED)

**Both acts are BUILD-BRANCH acts. Neither can be a ledger-branch commit.** The three places exist ONLY on `claude/composite-r4` — at ledger HEAD the packet file, manifest record and INDEX row are all absent (§A table), and the ledger's `docs/implementation/` is a fossil of a 12-packet era. A "flip" committed on the ledger branch would edit nothing the validator reads.

- **MF-CH3 flip:** the DIFF is docs-only (3 files, all under `docs/implementation/`), so it moves no census (no new test file → the three-census law does not fire; no `package.json` byte → no mint trigger). But it is a **landing act** (§556.3/§556.10) whose certification requirement is executable only on the build tree: the packet's own `checks` rows (manifest, 8 argv rows) end with the two typecheckers and `npm run validate:packets`, and its acceptance is `tests/lint/catalogTierGateParity.walker.test.js` + `tests/generators/metropolisCatalogReachable.test.js` + the four TEST-action suites. Under the one-landing/one-gate law it takes the gate slot — a cheap occupant, but an occupant.
- **MF-CH2B mint:** unambiguously build-branch and unambiguously a FULL landing (held code + re-derived figures + gate), then the registration edits. The §542.8 "one-file edit" framing was conditional on CH-5 landing AND described only the manifest row; it never made the act docs-only, because the validator asserts requiredSymbols existence at every status and the symbols do not exist until the code lands (verified live at `eba286607`, §C).

---

## §E · The exact edits, ready to execute — and the one sequencing gate

**MF-CH3 flip (execute on the post-STRIP-2 tip `T`, not on `eba286607` — see §F):**
1. `docs/implementation/packets/catalog-hygiene/MF-CH3.md:3` — `- **Status:** DRAFT` → `- **Status:** LANDED` (status must stand ALONE on the line, EOL-anchored — the packet's own :6 warning). Line 5 — re-stamp `- **Verified base:**` to `` `claude/composite-r4` at `<T-40-hex>` `` (format must match `parsePacketHeader`'s `branch at sha` shape, :259-266).
2. `docs/implementation/PACKET_MANIFEST.json`, MF-CH3 record (at `eba286607`: lines 27782/27784) — `"status": "DRAFT"` → `"LANDED"`; `"verifiedBase"` → same `<T>`. ⚠ Edit surgically or re-serialize in the file's canonical form — MF-CH3's own landing canonicalised this file and TE-STACK-5 had to resolve it semantically (§548.4); precedent for the stamp value: every landed car stamps the base it was CERTIFIED against (MF-CH5 → `510c51b76`, MF-CH2A → `5055990a3`).
3. `docs/implementation/INDEX.md:1049` — replace the leading `**DRAFT**` token with `**LANDED**` (replacement, never deletion — §A's SUPERSEDED trap). Recommended same-act prose hygiene, chair's call: the cell still says "the census row is DEFERRED by the member (§417) and owed at the landing act" — the census was in fact walked and stamped at the TE-STACK-5 landing (§547.7 deferral, §548.3 tip walk `2,525/366/2,159/21,017/5,847`); amend to "discharged at the §548 landing" so the cell stops owing what is paid.
4. Certification, per the manifest's own `checks` rows: the two vitest walker/suite rows, the two typecheckers, `npm run validate:packets` — expect `valid: <N> packets (0 READY)` where N is the post-STRIP-2 count (183 if STRIP-2 mints one packet on top of 182 — re-derive by execution, never carry; §548.4's law).
5. Nothing else. The nine ex-contested paths are untouched by the flip; the reservation dissolves by the status change itself.

**Blocker status: NONE structural at `eba286607`** — all 10 requiredSymbols present, all three places mutually consistent (all say DRAFT), the walker exists, its census cost was paid at stack-5. The only gate is **sequencing behind TE-STRIP-2** (§F) and the gate slot itself.

**MF-CH2B mint — NOT executable as written; the precise blocker chain:** (1) MF-CH3 flip first (releases the four shared-path reservations, §C-i); (2) rebase `refs/preserve/ch2b-build-2026-08-25`'s four CH2B commits onto the then-tip and re-derive EVERY figure (golden, census delta, observed-shape meta, mundane-realm figures) — §626.2's ordered first act; (3) resolve the `effectReachability.coverage` loss by corpus widening or a stated reason (the packet's own §0.0 says a re-record is not the honest cure); (4) land through the gate, certify arms B1–B8+B7b; (5) then the three registration edits (manifest record + INDEX row + packet header flip/re-stamp). Chair should treat (2)–(4) as a lane dispatch, not a chair act — it is a full car landing.

---

## §F · STRIP-2-DELTA — every row above its charter could move

TE-STRIP-2 (checkpointed clean at `4ccbfe7d6`, 2 of ~7 cars landed, rebase target `eba286607` recorded but NOT yet executed — §750.1) carries: the PDF/export-libs strip, StyleOverhaulPanel disposition, the four PRE-SEVER re-homes (`downloadBlob`/`drawListToSvg`/`SHADOW_DIR`/`coerceStyleId`), **the 12 packet figure-pin edits (R-PINS-SWEEP.md)**, the gate-mutex lock-path fix, and the lighting-census re-freeze.

- **§A manifest line numbers + packet count (WILL move):** the 12 figure-pin edits are "all … confined to `docs/implementation/PACKET_MANIFEST.json`" (R-PINS-SWEEP.md §B/§C — packets GR-4D×2, EFF-M1A, GVF-1, WEB-8, GR-4E, CS-A2, AO-4/AO-5, SK-2A, GAP-1, AO-6, DOM-1, EFF-M3). **None touches MF-CH3, MF-CH5, MF-CH2A or MF-CH2B rows** (checked against the sweep's own packet list), but my quoted line numbers 27781–27784 and the 182/179-2-1 census go stale the moment STRIP-2's manifest edits and its own packet mint land. Re-locate by id, never by line.
- **§E's stamp target (WILL move):** the flip must certify and stamp against the post-STRIP-2 tip, not `eba286607`. Executing the flip between now and STRIP-2's landing would also collide both acts on `PACKET_MANIFEST.json` and force a semantic re-merge of a canonicalised file (§548.4's known trap) — land the flip AFTER STRIP-2, in the next gate slot.
- **§B "newest touch" column (stable):** none of STRIP-2's chartered paths intersects the nine contested paths or MF-CH2B's twelve (PDF/export/thumbnail/townMap surfaces vs catalog/golden/edge-bundle surfaces — disjoint by inspection of both charters). If STRIP-2's "declared golden shift (owner-ordered cause)" turns out to touch `generator-golden-master.json` rather than map/size goldens, rows B#2/B#3 and §C-ii re-open — PLAUSIBLE-low; nothing in §725.3 or §750.1 names the generator golden.
- **INDEX.md:1049 (line number only):** STRIP-2's INDEX row lands above or below; the MF-CH3 row content is untouched by its charter. Re-grep the row by `| MF-CH3 |` at execution.
- **Gate figures:** STRIP-2's landing re-earns the full gate and the lighting-census re-freeze moves the walked tuple again (§749.1 already moved it to `2493/364/2129/20862/5788`); any tuple this report cites is illustrative, never carry-forward.

## Labels
CONFIRMED above = executed `git show`/`git grep`/JSON-parse receipts at the named shas (denominators: manifest 182 records parsed both sides; INDEX grep hits quoted with counts; two-pass sweep run with `MF-CH3|MF-CH2B|CH-2B|CH-3|three-place|holding-ch2|ch2b` families across ODQ + HEAD docs + `eba286607` tree). PLAUSIBLE is marked inline where used (§C-iv, §F golden-shift caveat). Nothing was flipped, minted, staged, or gated by this lane.
