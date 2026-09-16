---
name: es1-covert-mission-landed
description: "⭐ ES-1 LANDED DARK @ dda24851 — the covert mission's DOOR (mint, closed vocabulary, sub-record normalizer, casting law, hidden-path franchise) and deliberately NOT its traffic: no src module calls the mission head, so ES-0's import-closure fence stays green and true. ⚠⚠ R-ES1-1: the ES volume says SP-D freed the errand from the six-flag war weld — TRUE of the mint HEAD, FALSE of the ROW (normalizeErrand still requires a peace offer + acceptance + a purpose in ENVOY_PURPOSES; mintEnvoyErrand and buildEnvoyRoutePlan are still war-gated). A covert mission that becomes a persisted row rides a diplomatic errand wearing its face."
metadata: 
  node_type: memory
  type: project
  created: 2026-08-06
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-06T17:56:26.176Z
---

# ES-1 — the covert mission

Commit `dda24851`, branch `claude/composite-r4`, parent `db35bad6`. Dark behind
`espionageEnabled`, which ES-0 minted at `55674790` — ES-1 RIDES it and re-mints nothing.

## What exists now

- `envoyErrandVocabulary.js` owns the covert words: `ENVOY_COVERT_PRODUCTS`
  (acquire/confirm/refute), `_DEMANDS` (certain/confirm/corroborate), `_FACES`
  (covert/declared), `_LEG_REFS` (the SIX; **`pullBand` excluded BY RULE** — SP-B's
  populations road feeds it and no espionage product can), `MAX_COVERT_ITINERARY_STOPS`,
  `COVERT_KEYS`. `espionageMath.js` BORROWS `DEMAND_BANDS` and the cap from here rather
  than authoring copies.
- `envoyErrandRecords.js#normalizeCovertMission` is the ONE validation and returns
  `{covert, reason}` — the persist side heals to ABSENT, the mint refuses BY NAME.
- `errandMint.js` gains `covertMissionRefusal` and `covertFaceFor`.
- `envoyCasting.js` (NEW, GRAMMAR layer) — lifted out of `envoyDiplomacy.js` (797→753
  effective). Owns `rosterPersonAvailable`, the ONE dispatch-refusal predicate both
  casting laws read.
- `espionage/espionageMissions.js` (NEW) — `castCovertOperative` (importance-INVERSE,
  through `vetVolunteerEnvoy`, its first caller in the tree) and `mintCovertMission`.
- `routeNetworkConsumers.js` — `covert_envoy` in `TRAVELLER_KINDS` and
  `HIDDEN_PATH_KINDS`; ordinary `envoy` still refused the hidden ways.

## ⚠⚠ R-ES1-1 — the weld the volume says is gone

`mintErrandSpine` really is free of the six war flags. The ROW is not:
`normalizeErrand` requires a normalized peace offer, an acceptance, a snapshot and a
purpose in `ENVOY_PURPOSES`; `mintEnvoyErrand` and `buildEnvoyRoutePlan` both open with
`envoyDiplomacyActive`. So today a covert mission is a COVER-STORY RIDER on a diplomatic
errand — which is exactly §3.4's composite mission, so ES-1 is buildable as charted. The
free-standing spy row is owed by a later SP or ES slice. **No war gate was widened.**

## Behaviour shift, recorded

A `covert` row now carries a DERIVED public face. Before ES-1,
`errandSpineFields({purpose:'sue', purposeClass:'covert'})` returned `{purposeClass:
'covert'}` — a veil leak, because `declaredPurposeClassOf` falls back to the TRUE class
when no cover is written. A covert row that can derive no face is now REFUSED
(`covert_face_required`). Touches only the class nobody mints yet; every other class is
byte-identical.

## Traps for ES-2 / ES-3

- `gathered` and `standoff` are NOT in `COVERT_KEYS`, so a sub-record carrying either is
  REFUSED, loudly, rather than silently trimmed. Teach `COVERT_KEYS` AND
  `normalizeCovertMission` in the same commit as the amender, or the first round-trip reds.
- The espionage layer must NEVER spell `purposeClass`/`declaredPurpose`/`truePurpose`:
  SP-D's one-reader law scans all of `src/` in three spellings and would red. That is why
  the cover face is derived inside `errandMint.js` instead of passed down.
- `ERRAND_CONSUMERS`'s `couriers` row was SPLIT: ES-1 took its own row
  (`espionage/espionageMissions.js`, built:true); IN-4's pre-pin is intact and unbuilt.
- Domain-strict has 9 errors of headroom (1304 < 1313) that were deliberately NOT banked
  while a second lane was mid-flight — a ceiling measured without their work would red them.
