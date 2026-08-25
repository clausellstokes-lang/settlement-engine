---
name: realm-magic-toggle-mg1-mg2-landed
description: ⭐ MG-1 + MG-2 (realm magic toggle) LANDED @ minifold 5fff5352 + 648fa634; carries two boolean-only-census hazards and the compendium-artifact freshness pin
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-03T09:04:07.313Z
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
---

Lane C of `docs/DESIGN_REALM_MAGIC_TOGGLE.md` is BUILT on `claude/composite-r4`
(minifold), dark-by-inheritance (a realm only goes mundane if the DM answers so).

- **MG-1 @ 5fff5352** — the fourth knob (`basicConfig.magic: 'yes' | 'no'`,
  `MAGIC_CHOICES` / `DEFAULT_MAGIC` / `isMagicChoice` in
  `src/domain/instantWorld/worldPlan.js`), the pre-generation `ChoiceDialog` in
  `InstantWorldEntry.jsx` (Esc cancels the generation, never defaults), and
  `displayPrefs.realmMagicChoice` + `setRealmMagicChoice`.
- **MG-2 @ 648fa634** — `memberConfigFor` in `composeInstantWorld.js` (ONE
  spelling of a member config, feeding both the pipeline input and the save
  entry's `config`), `simulationRules.realmMagicDefault:'mundane'` written only
  for a mundane realm, `realmMagicIsMundane` as its ONE reader,
  `useRealmMagicDefault` (the single-settlement wizard pre-selection), the
  read-only stance card in `SimulationRulesAxes.jsx`, plus the public-snapshot
  allowlist and both telemetry emitters.

## ⚠️ Three hazards this lane proved

1. **`tests/docs/compendiumDataFreshness.test.js` pins the generated artifact
   BYTE-IDENTICAL to a fresh generation.** Any new store action therefore REQUIRES
   `npm run gen:compendium-data` in the same commit. `tests/store/operationRegistry.walker.test.js`
   does NOT catch this (it builds the object fresh), so the registry walker going
   green is not evidence the artifact is current. The artifact was ALREADY STALE at
   HEAD from 7796954e (WR-2 changed `deityEffects.js` copy without regenerating);
   the regen in 648fa634 folded that repair in, disclosed in the commit body.
2. **`subsystemCertification.simulationRuleKeys()` censuses BOOLEAN rule values
   only.** A string-valued rule key declared in a preset is INVISIBLE to the
   certification totality walker — it neither demands a row nor counts as an
   unknown row. The design doc's MG-LAW-6 assumed declaring the key gives walker
   visibility; it does not.
3. **Both telemetry allowlists are boolean-only in the same way.**
   `spatialUsage.TRACKED_FLAGS` filters `r[k] === true` and
   `pulseFingerprint.RULE_TOGGLES` emits `=== true`. Adding a string key's NAME to
   either list emits nothing at all while looking measured. The stance rides both
   as an enum field (`realm_magic`) instead.

## How to apply

Reading a realm's magic stance is `realmMagicIsMundane(rules)` — never a raw
`rules.realmMagicDefault` compare, and NEVER from a generator, mover, or display
path (MG-LAW-1: a settlement's magic is its own `config.magicExists`, stamped at
mint). MG-3 (the 12-leak register) and MG-4 (the realm-scope measure) are NOT
built; they are the remaining slices of the design doc.
