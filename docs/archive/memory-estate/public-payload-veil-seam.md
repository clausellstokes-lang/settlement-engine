---
name: public-payload-veil-seam
description: "Every public payload builder must RETURN through veilPublicPayload (domain/display/publicSafe.js); veiling inside toPublicSafe alone is outrun by the raw name each builder hoists beside it"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T13:03:43.261Z
---

Landed 2026-08-03 as VH-1, commit `5283557a` on `claude/composite-r4` in the
minifold worktree (committed, NOT pushed; migration 195 and the whole civility
lane are DARK/undeployed).

THE LAW: a value that leaves privacy leaves through `veilPublicPayload` — the one
exported seam in `src/domain/display/publicSafe.js`, which delegates to
`veilDeep` in `src/lib/civility.js`. Every builder of a public / anonymous /
shared / exported payload returns the result of that call: `toPublicSafe` itself,
`src/lib/gallery.js`'s `sanitizeTile`, `sanitizeDossier` and
`fetchDossierForImport`, and `src/lib/worldExport.js`'s `buildWorldExport`.
Deliberately EXEMPT: `gallery.js` `sanitizeReport` — a moderator must read a
report verbatim, and that surface is admin-gated.

**Why:** the veil was never missing; its SEAM was in the wrong place. `veilDeep`
already ran inside `toPublicSafe`, and a comment there claimed the gallery read
and the world export "both already flow through this one function". They did not
— only the settlement SUB-OBJECT did. Each builder hoists a raw display name
beside the projection (`row.name`; worldExport's member and realm names), and the
raw sibling is the one the page renders: GalleryDetail reads
`{dossier.name || dossier.settlement?.name}`, so the veiled copy was only ever the
FALLBACK. Executed probe before the fix (buildWorldExport, player variant, a term
from `TERMS`): `settlements[0].name` = "Port of fuck" beside
`.dossier.name` = "Port of ▒▒▒", `realm.name` plain — 3 plain occurrences in one
payload. Fixing the three fields would leave the fourth field somebody adds next
month; only the payload BOUNDARY cures the class.

IDENTIFIERS ARE VEILED TOO, on purpose. The mask is deterministic, so both sides
of an in-payload join still match. This is only safe because the two identifiers
that round-trip to the server verbatim cannot carry a flaggable token by
construction: `public_slug` is 12 hex chars from `_make_public_slug()` (migration
008) and the row `id` is a uuid. ⚠️ If a NAME-DERIVED slug ever becomes a
server-facing identifier, this needs an explicit round-trip exemption.

**How to apply:** adding any new public payload builder — return through
`veilPublicPayload`. To verify, run
`npx vitest run tests/security/publicPayloadVeilTotality.test.js`: it stamps a
vector term into EVERY string-bearing input of every builder and asserts the
serialized payload carries zero plain occurrences, so a newly hoisted raw field
reds on arrival. Its catching power is a standing sweep plant —
`civility-veil/public payload boundary unveiled` in `scripts/mutation-sweep.sh`
(area 63), which strips the seam from worldExport.js; executed 2026-08-03 at
4 failed / 9 passed mutated, 13/13 clean.

KNOWN ASYMMETRY, deliberate: the SERVER's `_gallery_sanitize_public_json` does
NOT veil. Migration 195 mirrors BLOCK mode only; masking inside JSON prose in
PL/pgSQL is recorded as its own wave and its own owner ruling. The veil is
client-side defense-in-depth on every path this client serves.

Related: [[migration-searchpath-baselined-name-blindness]],
[[git-checkout-discards-uncommitted-work]].
