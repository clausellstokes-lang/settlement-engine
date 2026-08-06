---
name: ""
metadata: 
  node_type: memory
  title: VISION LANE V-E shipped (V-11/12/13 + V-20/featured)
  date: 2026-07-20
  branch: claude/vision-e
  commit: 9d8d3411
  status: committed NOT folded/pushed
  tags: 
    - vision-wave
    - gallery
    - sharing
    - foundry
    - mcp
    - seed-post
    - ecosystem
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T16:03:42.566Z
---

# VISION LANE V-E — the ecosystem lane

Committed @ **9d8d3411** on `claude/vision-e` (base 212758ad). NOT folded, NOT
pushed — the manager folds. One commit, gate-green except the parked goldens.

## What shipped
- **V-11 Foundry bridge**: `src/lib/worldExport.js` — `buildWorldExport(world,{variant})`
  = the `settlementforge-world` format (DM/player variants). REUSES `toPublicSafe` +
  `serializeWorldSnapshotPublic` (no new redactor). Standalone `foundry-module/`
  top-level package (module.json + pure `build-journals.js` + `sf-world-import.js`)
  + `scripts/validate-foundry-module.mjs` wired into `check`.
- **V-12 Truth Server**: `mcp-server/` top-level package — dependency-free stdio
  JSON-RPC/MCP server over a LOCAL export. 4 read-only tools, receipts everywhere,
  `private:true` (owner flips to publish). `scripts/validate-mcp-server.mjs` (read-only
  tool-manifest + no write/network pin) wired into `check`.
- **V-13 Seed post**: `src/lib/worldCode.js` (versioned+checksummed encode/decode,
  fail-closed) + `/world/<code>` LAZY route (`WorldPage.jsx`) regenerating via
  `composeInstantWorld`. Same-digest pin is RELATIVE (no new golden family).
- **V-20 unlisted sharing + featured** (owner mid-lane amendment): migration
  `168_gallery_visibility_and_featured.sql` + `src/lib/galleryUnlisted.js` + UI.

## Load-bearing architecture facts
- **V-20 MODEL B** (the key decision): unlisted = `is_public=false` + a crypto-random
  `unlisted_slug`. So every existing browse/featured/curated RPC excludes it BY
  CONSTRUCTION — the migration edits NONE of the security-critical browse/sanitizer/
  publish RPCs, nor the shared `_gallery_public_tile_rows()` helper. Thin new by-slug
  reads REUSE `_gallery_sanitize_public_json`. This is why V-20 folded cleanly instead
  of splitting. **Campaigns add ZERO entities** — a shared campaign is a `saved_maps`
  row with `share_kind='map_with_campaign'` (there is NO campaigns table).
- The secrets seam is `toPublicSafe` (per-settlement, fail-closed allowlist) +
  `serializeWorldSnapshotPublic` (realm, covert-force-OFF, HARD-DENY ledgers). Reuse
  them; never hand-roll redaction. Player-variant leak pin = deep-scan of the
  serialized payload for secret tokens (roadsSecretsProbe idiom).
- Unlisted share URL = `/gallery?slug=<unlisted_slug>` (same route as public;
  `fetchPublicDossier` resolves public then unlisted). Reads: `get_unlisted_dossier` /
  `get_unlisted_map`. NOT in the sitemap — needs noindex + sitemap-exclusion (LANE V-J).

## Hazards hit this lane (all cost a gate cycle)
- **+1 migration trips ~5 doc/contract tests** with NO focused gate: ARCHITECTURE.md
  (migration count + "The gate" sub-step names), CONTRIBUTING.md (gate chain),
  docs/DEPLOY.md ("Current migration head" line), docCounts, AND
  `migrationRollbackDiscipline` (a migration matching `\bprofiles\b` etc. needs a
  `-- @rollback:` note or a `.down.sql`). +2 validate scripts also trip
  `ciCheckParity` (must mirror into `.github/workflows/ci.yml` check job).
- **pglite mass suite-level failures**: running many `*.pglite.test.js` under default
  vitest file-parallelism exhausts wasm resources → dozens of files fail in `beforeAll`
  (0 assertion failures). NOT regressions. Run `vitest run tests/security
  --no-file-parallelism` to confirm green (101/102 passed sequentially).
- **Design ratchets**: `title=` census (shrink-only, baseline 494 — new Button `title`
  props trip it; drop them, labels suffice) and the borderRadius kill-list
  (tolerance-0, ceiling 100 — the house uses hairline frames, NO radius).
- **Heavy sim flakes** under the 20s per-test cap during parallel load:
  `joins/ordering`, `store/advancePauseResume` — both pass in isolation.
- The 3 parked goldens (`beliefMapGolden` / `generatorGoldenMaster` /
  `worldpulseDeityGolden`) are RED on a clean base worktree @ 212758ad — pre-existing,
  not any lane's fault.

## Recorded follow-ons
Realm-level DM overlay in the world export; MapShareEditor unlisted UI toggle (DB+client
done); featured as a distinct visual band on the main gallery (helper + admin write +
browse done); unlisted-state persistence across reload via ShareToGallery props.
