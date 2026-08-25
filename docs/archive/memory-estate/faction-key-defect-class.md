---
name: faction-key-defect-class
description: "The .faction-vs-.name faction-key defect class — three instances found and fixed, the canonical cure, and where to hunt the next one."
metadata: 
  node_type: memory
  type: project
  originSessionId: eca97455-647b-4f08-98cb-24c7d9979d0a
  modified: 2026-07-20T01:27:37.412Z
---

**THE DEFECT CLASS.** Real `powerStructure.factions` records carry the display name in
`.faction` and carry **no `.name` at all** — confirmed by executed `generateSettlementPipeline`
probes (361 records, all six tiers, zero exceptions; keys `[faction, modifier, power, desc,
isGoverning, category, rawPower, powerLabel, modifiers, legitimacyCrisis, crisisNote]`). Any
consumer reading `f.name` gets `undefined` on every record. Where a `.filter(Boolean)` follows,
the whole collection silently empties — **indistinguishable from legitimately having none**,
which is why every instance shipped unnoticed.

**⚠️ THE CLASS IS WIDER THAN `.name` — it is THREE dead keys.** Real records also carry **no
`.id`** and **no `.archetype`** (0 of 2158 records, executed). So the class covers not just name
lookups but archetype reads (`ARCHETYPE_LEAN[f.archetype]`, `f.archetype === 'religious'`) and
NPC joins (`linkedFactionIds.includes(f.id)`). Instances #4/#5 below are of those variants — grep
for all three keys, not only `.name`.

**FIVE INSTANCES (composite branch `claude/the-composite`) — four fixed, one OPEN:**
1. `npcLadder` faction key — `25749ae5` (fold) + `dc0b6e2b` (pin hardening). Ladder was fully
   INERT, not merely wrong.
2. `ChroniclePanel` full-entry modal snapshot rows — `29f7abc9`, pin
   `tests/ui/chronicleSnapshotShape.test.jsx`.
3. `personaSlicer.js:125` persona roster — `4c1143b9`, pin
   `tests/domain/personaSlicerFactionRoster.test.js`. Roster was always `[]`.
4. `worldPulse/religionLegitimacy.js` `rulerLens` — **all three keys at once** (`.name` seat find
   ×2, `.archetype` lean + factionDark, `.id` NPC join). `24f46337`, pin
   `tests/domain/religionLegitimacyFactionKey.test.js`. Carried a declared one-time behavior
   shift → [[religion-ruler-lens-faction-key-fix]].
5. ⛔ **OPEN** — `worldPulse/clergyTraitPlane.js` `readClergyPlane` (~160) and
   `targetedFootholds` (~241) both filter `f?.archetype === 'religious' && f?.id != null`. Both
   keys absent ⇒ the whole clergy subsystem (`CLERGY_SCANDAL_W` legitimacy drag + targeted
   footholds) is inert on 100% of real settlements. Fixing it ACTIVATES a dormant subsystem —
   closer to new capability than repair, so **owner-gated**. Task chip spawned with a full brief.

**THE CANONICAL CURE — one accessor per question, never a hand-rolled spelling:**
- name → `nameOf` (`src/domain/rulingPower.js`, reads `.faction || .name`)
- which record rules → `governingFactionOf` (`.isGoverning`, else nameOf === governingName)
- archetype → `factionArchetype(f)` (`src/domain/factionArchetypes.js`, derives from `.category`,
  which every real record DOES carry)
- does this NPC belong → `npcInFaction(npc, faction, fkey)` + `ladderFactionKey(faction)`
  (`worldPulse/npcLadderState.js`) — handles `factionAffiliation` / `linkedFactionIds`, both of
  which hold the DISPLAY NAME, plus `.id` for authored records

The count of hand-rolled spellings is how this class propagates. See
[[ladder-faction-key-fold-composite]].

**THREE RECORD SHAPES wear the name `factions`** — the reason `nameOf` is right and a per-arm
special case is wrong:
- `settlement.powerStructure.factions` — generator records, `.faction`.
- `settlement.factions` (TOP-LEVEL) — a genuinely **different type**: the NPC grouping list,
  keys `[name, members, dominantCategory, powerFaction*]`, legitimately `.name`. Probed present
  on **60 of 60** settlements, so any `powerStructure?.factions || factions` fallback
  short-circuits on arm 1 every time and arm 2 is unreachable on real data.
- `neighbour.factions` (top-level, on a neighbour) — powerStructure-**shaped** (`.faction`), per
  `neighbourGenerator.js:180` and its `:200` comment.

**⚠️ `typeof f === 'string'` ARMS ARE LOAD-BEARING.** `nameOf` reads properties, so it returns
`''` for a bare string and a following `.filter(Boolean)` drops it. Deleting such an arm as
"redundant now that we use nameOf" re-creates the bug. Pin it wherever it exists.

**⚠️ `.name`-SHAPED FIXTURES ARE WHAT HID EVERY INSTANCE.** `tests/domain/personaSlicer.test.js:28`
still declares `powerStructure: { factions: [{ name: 'The Guildhall' }] }` — a record no
generator makes. The ladder lane shipped against the same fixture shape. **Pins for this class
must run against real `generateSettlementPipeline` data with expectations DERIVED from the
object under test** — generation is not deterministic per call, so a hard-coded name or seed
pins nothing and flakes in CI.

**Why:** this class is silent by construction and fixture-invisible, so it is found only by
probing real generator output — not by reading tests or types.

**⚠️ PROBE THROUGH THE PIPELINE, NOT THE BARE POWER STEP.** `generatePowerStructure` alone yields
an unrepresentative corpus that can make a LIVE defect read as a harmless coincidence — it did
exactly that for instance #4, whose brief called it "latent" on bare-generator evidence when the
pipeline shows it wrong on 36.7% of fresh settlements. Full detail and the flipped measurements:
[[generator-probe-corpus-hazard]].

**How to apply:** when touching any faction read, grep the surface for `.name`, `.id`, AND
`.archetype` on faction records, and probe the real shape through `generateSettlementPipeline`
before trusting a fixture. Instances CLUSTER — check sibling modules in the same subsystem before
fixing only the reported one (#4 and #5 are both in `worldPulse/`, found together). Next hunting
grounds: instance #5, plus any remaining `f.name` / `f?.id` / `f?.archetype` over a factions
collection outside the fixed sites.
