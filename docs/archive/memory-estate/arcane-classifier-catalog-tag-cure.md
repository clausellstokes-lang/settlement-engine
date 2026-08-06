---
name: arcane-classifier-catalog-tag-cure
description: "Arcane-ness is a property of the ENTITY (the catalog's authored tag), never of the world — reading it from a name regex was wrong in BOTH directions; 8 unconverted classifiers are frozen in a shrink-only census walker"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T12:11:18.683Z
---

**THE CLASS.** Independent classifiers across the estate each answered "is this thing
arcane?" from their own name regex, and every regex mixed UNAMBIGUOUS tokens
(`mage|arcane|wizard|sorcer`) with AMBIGUOUS ones (`tower|academy|college|sage`). Measured
at commit `0150bd01`: `factionArchetype({name:"The Tower Cobblers' Guild"})` returned
`arcane`, and — the half the leak register never saw — `factionArchetype({name:'The
Enlightened'})`, a name authored into `FACTION_DESCRIPTORS.magic` by hand, returned
`other`. The regex was wrong in BOTH directions at once.

**THE CURE (chair ruling R-BLD-5, landed 2026-08-03 @ `a80c0be4` on `claude/composite-r4`).**
`src/domain/arcaneIdentity.js` is the canonical detector. The CATALOG'S AUTHORED TAG is
canonical and authoritative in both directions — the faction pools' category key
(`FACTION_DESCRIPTORS` / `FACTION_DESCRIPTORS_EXTRA`, both now in `src/data/powerData.js`)
and `institutionalCatalog`'s `tags:['arcane'|'planar'|'alchemy'|'enchanting']`. Name
patterns are a FALLBACK for non-catalog entities only, run in two tiers: certain tokens
classify alone, ambiguous tokens only when the text also asserts functional magic, and the
world law's `NEGATED_MAGIC_PATTERNS` are struck first (extracted to
`src/domain/magicAssertionText.js`, which `generationContext` now re-exports).

**Why:** the rejected design threaded each settlement's `magicLedger` into
`factionArchetype()` through an options bag. That makes arcane-ness a property of the
WORLD, which forces a 10+ site consumer census across `src/domain` and `src/generators` —
and most of those sites hold a faction row with no settlement in scope, so they would have
stayed unconverted (the N−1 sweep). Reading the catalog makes arcane-ness a property of the
ENTITY, which every consumer already holds. **No signature changes; every consumer correct
by inheritance.** A future session tempted to "finish the job" by threading world law is
re-implementing the rejected design.

**⚠️ EIGHT MORE SITES EXIST AND ARE DELIBERATELY UNCONVERTED.**
`tests/lint/arcaneClassifierCensus.walker.test.js` fires on any alternation mixing arcane
tokens with ambiguous ones; on its first run it found eight the register had never seen.
Four are TRUE members — `districtProfile.js:112`, `npcProfile.js:333` and `:374` (the same
table forked twice in one file), `stressorDynamics.js:53` (its arcane row is ENTIRELY
ambiguous tokens), `tierOutcomeApply.js:143`. Four are contextually scoped
(`factionRoles.js:57`, `isolationGenerator.js:97`, `contradictions.js:222`, plus
`lib/entities.js`'s `INSTITUTION_KEYWORD_TAGS` on the allowlist). They are frozen in that
walker's SHRINK-ONLY `KNOWN_UNCONVERTED` baseline with a disposition each. Not a bug to
re-find: each decides live generated output (district categories, NPC domains, stressor
subsystems, ruin fates), so converting them is a disclosed same-seed wave the chair must
schedule. Convert one → DELETE its line (that locks the win); never add one silently.

**⚠️ SUBSTRING HAZARD — `ARCANE_INST_KW` IS UNANCHORED: 'mage' matches inside
'PILGRIMAGE'.** Found live by MG-4's realm census: a mundane metropolis's CATHEDRAL
services ("Pilgrimage destination", "Pilgrimage services") read as arcane content.
`src/domain/arcaneInstitutionIdentity.js` anchors its derived fallback at word boundaries
(with `archmage` restored explicitly). `src/domain/magicFilter.js`'s own list is STILL
unanchored — latent, not live, because both of its callers key strictly on catalog
institution NAMES and no catalog institution name carries the substring (two DESCRIPTIONS
do). Anchoring it moves `filterCatalogForMagic` / `filterServicesForMagic` — outside
R-BLD-5's four sites.

**How to apply:** need to know whether an entity is arcane? Import
`isArcaneFaction` / `resolveArcaneIdentity` from `src/domain/arcaneIdentity.js`, or
`isArcaneInstitution` / `institutionCatalogArcaneTag` from
`src/domain/arcaneInstitutionIdentity.js`. Never write a fresh regex — the census walker
will red, and that is the point. Adding an arcane classifier to a NEW surface is a decision
to be made deliberately: route it through the detector, or allowlist it with a written
reason. Verification anchors: `tests/domain/arcaneIdentity.test.js` (39 pins, every one
proven non-vacuous by an individually-reverted source mutant) and the census walker (5).

Related: [[realm-magic-toggle-mg3h-mg4-landed]], [[faction-key-defect-class]],
[[unreachable-predicate-conjunction-class]].
