# SKEPTIC — §912 / lane L-MAT — LENS: THE SECURITY BOUNDARY (car 4, 525ffa99b; R-A, R-D)
Seat: Opus 5 — Fable-unvalidated (skeptic). Dock READ-ONLY throughout.
HEAD before/after: 7d96e2b72245fa465182d59dade31621f31ecf2c / (see foot). Porcelain 0 / 0.

## EXECUTED
- `npx vitest run tests/security/livingContentRosterPublicDrop.test.js` → EXIT=0, 6 passed.
- `npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` → EXIT=0, 9 passed.
- node probe (read-only, no writes): manifest field keys of the four living-content
  buckets vs `PRIVATE_KEY_RE` → deities 13 / factions 13 / stressors 6 / traditions 4
  fields, ZERO denylist hits.
- node probe: `generateSettlementPipeline(LIT_CONFIG, …)` with the seam UNARMED →
  `THREW: [livingContentSeam] v2 world, roster payload not loaded`.

## 1. EVERY PROJECTION / SHARE / EXPORT PATH, AND WHETHER THE ROSTER CAN REACH IT
| path | gate | roster / provenance reach TODAY (dial 1) |
|---|---|---|
| `toPublicSafe(s)` default — anon result, pre-publish preview, DmScreen, briefs, audienceProjection, sceneProjection, worldBook player | root ALLOWLIST, fail-closed | NO. Pinned by car 4, executed. |
| `toPublicSafe(s,{full:true})` — gallery DM share | deep-clone + named delete list; NO allowlist | YES, carried. Lane measured it. |
| `buildWorldExport(w,{variant:'dm'})` → `toPublicSafe(dossier,{full:true})` | same full mode | YES, carried. **Not enumerated by the lane.** Inert for a different reason than the dial: `worldExport.js:37` records the in-app export control is NOT wired; the offline foundry/mcp packages read a pre-emitted file. |
| `fetchDossierForImport` → `stripImportConfidential(row.data)` (gallery IMPORT payload) | `{...data}` minus 7 named keys | YES, carried. **Not enumerated by the lane.** No allowlist anywhere on this path. |
| `importGallerySettlementImpl` → `normalizeSettlement({...src})` (gallery import INGEST) | `{...settlement}` passthrough; `scrubImportedConfig` drops 5 named keys | YES — a foreign roster lands in the importer's library with SOURCE-account identifiers, **no remap, no drop, no warning**, unlike the account-import path car 5 just built. **Unrecorded anywhere.** |
| account import (`accountImportBody.js:467`) | car 5's resolve-or-drop | remapped or dropped + warning. CURED. |
| import RECONCILIATION slice | none | carried verbatim. DECLARED in `livingContentRoster.js` header. |
| account export (`buildAccountExport`) | none | carried — the user's own data to the user. Not a leak; it is the remap's source. |
| PDF / worldbook DM mode / `generateSettlementPDF` | explicit field reads | NO — nothing reads the key, so no renderer emits it. |
| AI edge function (`ai.js:166` `body = { type, settlement, … }`) | none | the whole settlement is POSTed. Own-backend egress, not a cross-user leak; recorded. |
| URL / hash payload | none found | n/a. |

SERVER side (read, not executed): migration 120's `import_gallery_dossier` selects
`_gallery_dm_full_json(base.j)` when `gallery_share_dm`, and migration 129's body is a
`j - 'aiData' - … - '_config'` DELETE LIST. So both the DM-share VIEW and the IMPORT
payload carry the roster server-side. The default read uses
`_gallery_sanitize_public_json`, whose top-level allowlist is the SQL twin of
`PUBLIC_TOPLEVEL_KEYS` — the roster is dropped there.

EMPTY-SHAPE LEAK: none. `buildLivingContentRoster` returns `null` at `rows === 0`
(`livingContentRoster.js:219`), so the key is absent-or-populated and never `{}`.
No feature-existence leak by key presence.

## 2. IS "INERT WHILE THE DIAL IS AT 1" TRUE?
**As written, NO — and the file refutes itself.** The roster's gate is
`materializesLivingContent(settlement.config)`, i.e. the WORLD'S OWN CONFIG, not the
dial. `birthConfig` spreads `newSettlementLivingContentLaw()` which returns `{}` at
dial 1 — a spread of `{}` DELETES NOTHING, so an incoming lit config passes through
unclamped. The car-4 file's own `litSettlement()` generates six worlds carrying a
roster with the dial at 1; the same file then asserts "no generated world carries a
roster at all". The distinguishing fact is reachability of a lit config, not the dial.

Reachable lit-config paths inspected:
- `SettlementsPanel.jsx:103` `updateConfig(migrateConfig(data.settlement?._config || data.config))`.
  `migrateSettlementConfig` is a shallow spread (5 lines, no filter) and
  `isAllowedConfigKey` admits the whole underscore family by prefix
  (`configSlice.js:101`). So a SAVE whose config carries the marker lights the wizard.
- The gallery-import ingest sets `config: null` and `stripImportConfidential` deletes
  `_config`, so THAT save cannot feed the wizard — but its `settlement.config` (scrubbed
  by a 5-key denylist) keeps the marker.
- Account import preserves `config._livingContentLawVersion` (the lane's own probe).
- `FoundingWorlds` / `LandingArtifacts` / `ForgeExactDemo` fork static in-repo fixtures.

**BUT THE PRODUCT IS INERT FOR A STRONGER REASON THE LANE NEVER STATES.** Nothing in
`src/` calls `loadLivingContentRoster()` — grep returns only the seam's own definition.
So in the shipped runtime a lit config does not mint a roster: it THROWS
(`[livingContentSeam] v2 world, roster payload not loaded`, executed above). An imported
world cannot light the mint on this account; it can only crash a generation.

⛔ **THE COROLLARY IS THE LANE'S BIGGEST UNRECORDED HAZARD.** Before car 2 the dial was
a no-op (the mint had no caller — that is §904's measurement). After car 2 every BIRTH
stamps the marker, so **flipping the dial makes every settlement generation throw** until
someone wires `loadLivingContentRoster()`. No test arms the seam globally
(`setupFiles: ['./tests/setup/fastCheckSeed.js']` only; four test files arm it by hand),
so the lighting commit reds loudly rather than shipping — the tripwire is loud, not
silent — but nothing in the receipt's five-item DEFERRED list, the commit messages, or
the boundary header says it. And the car-4 arm's own failure message tells the lighting
engineer the wrong thing: "Shipped worlds can now carry customContentRoster" is FALSE;
what they will actually see is a total generation outage.

## 3. R-D — `_livingContentLawVersion` ON THE PUBLIC PROJECTION
CONFIRMED harmless as ruled, and the lane's two supporting claims check out:
- It rides allowlisted `config`; no `PRIVATE_KEY_RE` token matches it (tokens are
  substring/word-boundary literals; there is NO underscore-prefix rule anywhere in
  `publicSafe.js`). The underscore-prefix admission the lane cites is
  `isAllowedConfigKey` in the STORE, a different mechanism — the receipt's phrasing
  invites the two to be conflated, but the lane applies each correctly.
- Disclosure: a lit world's roster is `null` when empty, so the marker is identical for
  a lit world with zero rows and one with fifty. It therefore discloses BIRTH-ERA law,
  never custom-content usage. R-D's ground is sound.
- CORRECTION: the arm is written as `expect(pub.config[KEY]).toBe(2)`. That is a PIN,
  not a recording — it makes stripping the marker later look like a regression. R-D says
  "RECORDED, not changed"; the code enforces "must stay public". The arm carries no note
  telling a future ruler to delete it.

## 4. THE CAR-4 ARMS, ONE BY ONE
- Arm 1 (allowlist membership) — genuinely anchored via `expectAbsentWithAnchor` with
  `config` as a live sibling; the helper asserts anchor-present THEN member-absent and
  refuses anchor === member. Strong.
- Arms 2/3 (behavioural drop) — `expect(KEY in pub).toBe(false)`. NOT the anchored helper
  and INVISIBLE to `negativeAssertionAnchor.walker` (its `BARE_NEGATIVE_RE` matches only
  `not.toContain|toMatch|toHaveProperty`), so the walker's 9-green says nothing about this
  file. Substantively anchored anyway: each arm asserts the roster is truthy and
  `rowCount > 0` first, and asserts allowlisted siblings survive. The world is REAL —
  `generateSettlementPipeline` with the reference pack, not a literal. Good.
- Arm 4 (`PRIVATE_KEY_RE` strips nothing) — **green for a weaker reason than it claims.**
  `rosterKeys` is a HAND-TRANSCRIBED list of 11 names. The real row also copies every
  manifest-declared authored field (`livingContentRoster.js:166-172`) — 36 more keys
  across the four buckets. I measured those separately: zero hits today, so the CLAIM
  holds. But the arm cannot see them: a future manifest field named `secretRite`,
  `dmGuidance` or `notes` would falsify the claim while the arm stays green, and the
  file already generates a real roster two arms above from which the keys could be
  derived. `expect(rosterKeys.length).toBeGreaterThan(6)` over an 11-element literal is
  an assertion that cannot fail.
- Arm 5 (R-D) — see §3.
- Arm 6 (DM-full) — the measurement is real and executed. The dormancy assertion
  (`NEW_… === DEFAULT_…`) does fire on the lighting commit as designed. Its premise
  sentence is wrong (§2) and its failure message misdescribes the symptom.

## 5. THE "SQL TWIN" — WHAT IT IS, AND WHETHER THE REFUSAL HOLDS
It would be a new `supabase/migrations/NNN_*.sql` re-issuing
`create or replace function public._gallery_dm_full_json(j jsonb)` with
`- 'customContentRoster' - 'customContentProvenance'` added to the delete chain, plus a
`galleryDmFull.pglite.test.js` arm. That is a migration file, hence owner-gated, and the
lane's no-migration law is real. **REFUSAL 2 is therefore right on the server half.**
PARTLY on the client half: I found NO field-for-field parity pin on FULL mode — the only
client twin arm in `galleryDmFull.pglite.test.js:143` is per-key (latentPantheon and the
faith embeds). A client-only `delete clone.customContentRoster` beside the existing
`delete clone.dmNotes` / `delete clone._seed` in `publicSafe.js` would have reddened
nothing and cost no migration. The lane's own cited precedent
(`townMapEditsPublicDrop.test.js`) also declines the client half, so the lane is
consistent with the estate — but "curing it needs an SQL twin" is not the whole truth;
the defense-in-depth half was landable.

IS THE DM-FULL PATH A LIVE HOLE TODAY? No — twice over: no shipped flow produces a lit
config, and a lit config throws before the roster exists (§2). It becomes live the moment
the loader is wired and the dial is lit. The lane's inertness CONCLUSION is right; its
stated MECHANISM (the dial) is the weaker of the two available.

## 6. WHAT THE LANE MISSED, RANKED
1. `loadLivingContentRoster()` has no caller in `src/` — lighting the dial throws on
   every generation. Unrecorded. (Also the true ground of the inertness claim.)
2. The gallery-import INGEST (`galleryImportSettlement.js`) carries a foreign roster into
   a second account's library unremapped and unwarned — the mirror of the boundary car 5
   built, and the only un-declared roster boundary in the estate. Unrecorded.
3. `stripImportConfidential` and `buildWorldExport`'s DM variant are two further
   un-allowlisted carriers of the same key; the deferral names only "the DM share", so its
   blast radius reads smaller than it is.
4. The car-4 file's own header still says "nothing in `src/` READS the key
   (livingContentRoster.js says so in its own header)". Car 5, in the SAME consist,
   created that reader and amended the roster header; the test file's citation was not
   re-read. A shipped comment refuted by its own consist.
5. Arm 4's transcribed key list (§4).
