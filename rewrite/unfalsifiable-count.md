# THE COUNT THAT SETS THE RATIO (ruling 41) — DS-DEF-2, 506 faces
*A measurement. Written outside the dock; nothing committed anywhere. Dock read at `310893244`, read-only.*

⚠ IN PROGRESS — checkpoint written as the first rows existed, per the brief's checkpoint law.
Method and pools 1–5 below; the remaining pools follow as they are judged.

## THE TEST APPLIED (strict, from each pool card's section 8)
A face is **COUPLED** if its CLAIM asserts or denies anything the engine records for this block:
- `config.monsterThreat` (the country, what is in it) — the family word and its content
- the walls bucket: a wall, line, works, perimeter, bank, ditch, palisade — and the gate/bar/way through
- the force buckets: garrison, militia/muster, watch, mercenary company, charter
- a required `institutionalCatalog` row or a service the engine turns on at p ≥ 0.8: mill/grinding, burial ground/burial/register of the dead, market square/weekly market/stalls, granary, inn/bed, taverns, craft guilds/apprenticeship, church/priest/rites, water source, farmland, town hall, dwellings
- a `compound.inst` civic flag: hasCourtSystem, hasPrison, hasHospital, hasChurch, hasGranary, hasPort, hasNavy, hasMagicInst
- a score or a BAND word (`STRONG`/`ADEQUATE`/`WEAK`/`CRITICAL`), `readiness`, `safetyLabel`, `guardEffectivenessDesc`
- the purse / the upkeep gates / a wage / a toll / a levy (`milUpkeepMult`, `economicGates.*`)
- a tier word, `structureKey`, `tradeRouteAccess`, `magicWorksAt`, `stress`
- **the key's own reads** — a face that says "nothing is built here", "the houses simply stop" asserts `perimeter=false`, which the key fixes

A face is **UNFALSIFIABLE IN CLAIM** if it asserts none of those: conduct, attitude, talk, manners,
timing by the light, opinion, a household's own arrangement, a non-typed object.

**SPEAKER-COUPLING is a separate column.** Only `stranger` and `elders` are universal sources
(`faceSources.js:81,:133` — the traveller and `ELDER_TIERS` seat on every town in every preimage).
Every other source is seated by a required row or a bucket: `hall` `tavern` `guild` `market` at town
(Town hall · Taverns 5-20 · Craft guilds · Market square), `register` at village and town only
(card correction (c): `faceSources.js:91-93` excludes the `access to` prefix), `court` on
`hasCourtSystem`, `watch`/`garrison`/`muster`/`gate` on their buckets. So a face whose claim is
unfalsifiable but whose speaker is seated **needs a tier tag in the shared bank**; one spoken by a
traveller or the elders does not.

Three buckets are therefore reported:
- **U — UNFALSIFIABLE**: claim unfalsifiable AND speaker universal. Drawable on any town of any block.
- **S — SPEAKER-COUPLED ONLY**: claim unfalsifiable, speaker seated. Bankable WITH a tier/roster tag.
- **C — COUPLED**: the claim asserts typed state. Keeps its card and its refuter.

