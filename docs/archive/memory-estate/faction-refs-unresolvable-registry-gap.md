---
name: faction-refs-unresolvable-registry-gap
description: "⚠️ CONFIRMED 2026-07-26: customRegistry has no 'factions' category, so factions.rivals is dead on BOTH ends — the picker can never list a rival, and a stored rivals ref renders as 'Deleted custom item' beside the faction it names"
metadata: 
  node_type: memory
  type: project
  originSessionId: 431a28af-ebce-4752-9063-ecb8c95bd339
  modified: 2026-07-26T18:35:15.456Z
---

`REGISTRY_CATEGORIES` in `src/lib/customRegistry.js` lists institutions, services,
resources, stressors, tradeGoods, deities, resourceChains — **not factions**.
`buildRegistry`'s `custom` map has no `factions` key either, so `listAll('factions')`
returns `[]` and `resolve('custom:<factionLocalUid>')` returns `null`.

The manifest declares exactly one faction→faction dependency, `factions.rivals`
("Rivals (conflicts with)", `category: 'factions'`). It is dead on both ends:

- **Authoring** — `DependenciesSection` mounts an `EntityPicker` whose suggestions come
  from `registry.listAll('factions')`. The list is permanently empty, so an author can
  never select a rival through the UI.
- **Display** — `DependencySummary` resolves each stored refId through the same registry.
  A `rivals` ref that arrived by content-pack import or legacy data renders as
  **"Deleted custom item"** plus "N linked items could not be found. Edit this item to
  repair the link." — while the named faction sits in the list directly beside it.

The tell is the asymmetry: the **reverse** link is fine. `DependencySummary`'s reverse
scan reads `other.name` off the raw store item and never touches the registry, so faction
B's card correctly shows `Rival of · Faction A`. Forward is broken, reverse works.

Every other dependency target bucket (institutions, services, resources, tradeGoods)
resolves — factions is the sole omission.

**Why:** `factions` was added to the content manifest after `customRegistry`'s category
list was written, and nothing cross-checks the two. See [[command-registry-consumer-evidence-walkers]]
for the sibling class — a declared contract with no enforced consumer.

**How to apply:** the cure is three aligned additions — `REGISTRY_CATEGORIES`,
`CUSTOM_SLICE_KEY_FOR` (`factions: 'factions'`), and `buildRegistry`'s `custom` object
(`factions: enumerateCustom('factions', customContent)`). There is no prebuilt faction
catalog, so `listPrebuilt('factions')` stays `[]` — the picker would list the author's own
factions only, which is the intended behaviour. The structural guard is a walker asserting
every `dependency.targetBuckets` entry in `schema/custom-content.manifest.json` appears in
`REGISTRY_CATEGORIES`; that closes the class rather than this one instance
([[structural-prevention]] shape). NOT fixed as of 2026-07-26 — found while writing
`tests/components/customContentSavedCard.test.jsx`, which deliberately does **not** assert
the broken side, so pinning it later needs no test rewrite. Related:
[[customregistry-deeagering-gated]] (the same file's owner-gated de-eagering lane).
