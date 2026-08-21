/**
 * domain/townMap/townLayoutV3.js — LAYOUT LAW v3, THE MAP-FABRIC LAYOUT.
 *
 * ⛔ THIS IS THE MF-0 SNAPSHOT OF THIS FILE: a DECLARED-DORMANT DELEGATION. It exists
 * so that widening `LAYOUT_LAW_VERSIONS` to admit v3 leaves the tree in a LAWFUL state
 * from the very first commit — a v3 blob is storable, readable AND renderable, it just
 * renders exactly what v2 renders until the geometry members land behind it. A member
 * that widens a persistence dial with no renderer behind it ships a value that can be
 * saved and not drawn, which is the same lifecycle hole this family exists to close.
 *
 * The dormancy idiom is the estate's own (ageOverlay.js, mapDress.js, groundDress.js all
 * ship a declared-inert stage). SUCCESSION, in landing order:
 *   MF-1T  substrate + suitability   — layer zero, consumed by nobody yet
 *   MF-1D  district organisms        — grown, consumed by nobody yet
 *   MF-1U  umbrella + partition      — ⭐ THE DELEGATION BELOW IS REPLACED HERE
 *   MF-1W  streets + burgage parcels
 *   MF-3   walls, water modes, roads
 * Until MF-1U, `stable(build(s,{layoutLawVersion:3}))` is byte-identical to
 * `stable(build(s,{layoutLawVersion:2}))`, and that identity is pinned, not assumed.
 *
 * PURITY: no Date, no Math.random, no localeCompare (the townMap domain source-scan).
 */

import { buildTownLayoutV2 } from './townLayoutV2.js';

/**
 * Build the v3 town-map model. DORMANT: delegates verbatim to the v2 semantic
 * urban-planning engine, so v3 is lawful and inert at this member.
 *
 * @param {import('./townLayoutV2.js').TownV2Settlement} settlement
 * @param {import('./mapEdits.js').MapEdits | null | undefined} mapEdits
 * @returns {ReturnType<typeof buildTownLayoutV2>}
 */
export function buildTownLayoutV3(settlement, mapEdits) {
  return buildTownLayoutV2(settlement, mapEdits);
}
