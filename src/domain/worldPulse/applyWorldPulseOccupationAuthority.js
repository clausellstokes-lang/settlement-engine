// applyWorldPulseOccupationAuthority — the occupier-authority install: the disarm,
// governing and civic cuts a conquest writes onto the occupied roster. Split verbatim out
// of applyWorldPulse.js by THE DECOMPOSITION WAVE (war tranche, file 4); every body here
// is byte-identical to its pre-split declaration.
// THE TYPE SURFACE IS PART OF THE PUBLIC SURFACE (R-BLD-9 / the file-2 lesson):
// these aliases are re-declared in every member of the family that names them, so a
// split never silently drops a typedef and lands strict errors on a consumer.
/** @typedef {import('./pulseShapes.js').WorldState} PulseWorldState */
/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {import('../settlement.schema.js').SimFaction} SimFaction */
/** @typedef {import('../settlement.schema.js').SimInstitution} SimInstitution */

// Occupation-parity multipliers — the GENERATOR's `occupied`-stress transform
// (`generators/power/stressFactions.js`, the `ke('occupied')` arm): the conqueror
// disarms the locals so a PULSE-conquered town looks like a GENERATION-occupied
// one, not a town that merely swapped a flag. A local military/guard faction is
// gutted (×0.3 — the "disarm"); the deposed governing seat is humbled (×0.6) +
// marked 'occupied'; every other local civic faction is suppressed (×0.82).
// Idempotent by the 'occupied'/'disarmed' modifier guard so a re-fired conquest
// never re-cuts.
//
// ⛔ THIS BLOCK ONCE SAID "mirror", AND IT WAS NOT TRUE. The claim is narrowed to
// what is MEASURED, because the estate's own §711.6 lesson is that a comment
// asserting a parity nobody re-measures is how two consumers of one quantity
// drift apart in silence. What IS mirrored, and what is NOT, both stated:
//
//   MIRRORED — the three multipliers (0.3 / 0.6 / 0.82) and, as of the WAR
//   landing's mini-window (R-T4-MINIWIN, cause :261), the MILITARY PREDICATE:
//   `isMilitaryFaction` below is now the generator's own name test, character for
//   character in effect. See its docblock for the measurement that forced it.
//
//   NOT MIRRORED, each measured rather than assumed, and each a deliberate,
//   DOCUMENTED deferral rather than a bug to re-find:
//     • COMPOUNDING. The generator's arms are four independent `&&` clauses, so a
//       GOVERNING military row takes 0.6 AND 0.3 (and a noble row takes a further
//       ×0.7). This install is an if/else-if ladder: exactly one cut per faction.
//     • THE TWO PROTECTED ROWS. The generator exempts its own 'Occupation
//       Authority' and 'Resistance Network' rows from the civic cut by name; this
//       install has no such exemption, so a generation-occupied town that is later
//       pulse-conquered suppresses the generator's two occupation rows. (Before the
//       :261 cure it DISARMED them: 20 → 6 and 8 → 2, measured.)
//     • THE NOBLE CUT (×0.7 on Noble Families / Noble Houses / Landed Gentry) and
//       its appended desc sentence have no expression here at all.
//     • THE MARKERS THEMSELVES ARE SIM-ONLY AND THAT IS ON PURPOSE. The generator
//       writes 'occupied' on the GOVERNING row alone and never writes 'disarmed';
//       this install marks every row it cuts, which is what makes the SEAT-5
//       un-install reversible. Widening the generator to match is a GENERATION-side
//       same-seed act (the owner's tuning carve-out), not this file's to take.
const OCCUPATION_DISARM = 0.3;
const OCCUPATION_GOVERNING_CUT = 0.6;
const OCCUPATION_CIVIC_CUT = 0.82;

import { clamp01 } from '../../kernel/math.js';

/**
 * The roster shapes SEAT-5 handles, spelled as REAL TYPES. ⚠ The escape-hatch cast idiom
 * the install below uses is DEBT, not house style: the `domainAnyCastBaseline` ratchet
 * counts every such token PER FILE against a frozen, monotone-down allowance this file had
 * already spent, so the un-install had to be typed or it could not land. `unknown` costs
 * zero against that counter and narrows honestly.
 *
 * ⛔ AND THE COUNTER READS COMMENTS. The first draft of this very paragraph SPELLED the
 * token while explaining why not to use it, and minted a sixth hole against an allowance
 * of five — the recorded `simulationRules` comment-scanning hazard, in a second scanner.
 * Describe the idiom; never spell it.
 * @typedef {{ faction?: unknown, name?: unknown, power?: unknown, isGoverning?: unknown, category?: unknown, modifiers?: unknown }} RosterFaction
 * @typedef {{ powerStructure?: { factions?: unknown } }} RosterSettlement
 */

/**
 * Read a faction's modifier list ONCE. ⚠ NOT TASTE — `check:observed-shape-readers` counts
 * `modifiers on factions` reads in this file against a FROZEN CEILING OF 2, and the
 * inline `Array.isArray(f?.modifiers) ? f.modifiers : []` idiom spends both on a single
 * expression. The install used them up; the un-install below needs one; the ratchet's law
 * is "never raise a number". One shared reader is the only shape that fits, and it is
 * strictly the better code besides.
 * @param {RosterFaction|null|undefined} f @returns {unknown[]}
 */
const modifiersOf = (f) => {
  const raw = f?.modifiers;
  return Array.isArray(raw) ? raw : [];
};

/** @param {import('../settlement.schema.js').SimFaction} f */
const factionNameOf = (f) => String(f?.faction || f?.name || '').trim();
/**
 * THE GENERATOR'S OWN MILITARY PREDICATE, and it is deliberately NOT a better one.
 *
 * ⛔ THIS FUNCTION IS THE :261 CURE (R-T4-MINIWIN, SHIFT RECORD SR-b). It used to read
 * `category === 'military' || /\b(milit|guard|garrison|warrior|legion|soldier)\b/`, which
 * is a DIFFERENT question from the one the generator asks one line above the multipliers
 * it shares. MEASURED over a 23-name corpus: 13 disagreed, and the regex was not even the
 * main cause — EVERY generated faction carries a `category`, written by
 * `rulingStructure.js:700` from `inferFactionCategory`, whose `military` bucket is sixteen
 * keywords wide (Garrison · Watch · Knight · Mercenary · Occupation · Resistance ·
 * Adventurer · Charter · Monster Hunter · Huscarl …). So the sim disarmed to ×0.3 a whole
 * class the generator only suppresses to ×0.82 — including, absurdly, the generator's OWN
 * 'Occupation Authority' and 'Resistance Network' rows, which the generator explicitly
 * exempts. Two towns with the same faction under the same occupation held different
 * rosters depending on WHEN the occupation happened.
 *
 * ⭐ THE GENERATOR'S SIDE WAS DECLARED TRUE, and the choice is recorded because it decides
 * which probe moves (SR-b): a generator-side cure moves the 600-settlement generation
 * corpus; the sim-side cure moves only the war path. Two reasons, in order:
 *   1. This file's entire chartered purpose is to reproduce the GENERATOR's occupied
 *      transform on a pulse-conquered town. When the two disagree, the generator is the
 *      reference by construction — the sim is the copy.
 *   2. A generated world's starting roster is the world's own truth (THE PROMISE), and
 *      widening the generator's matcher is a same-seed generation act in the owner's
 *      tuning carve-out. It is not a landing lane's to take.
 *
 * ⚠ DELIBERATELY DEFERRED, DOCUMENTED, NOT A BUG TO RE-FIND: the generator's predicate is
 * a lowercase SUBSTRING test, so it is narrow in its own right — it calls 'Military Order'
 * and 'City Guards' military but not 'City Watch', 'Mercenary Company', 'Knightly Order'
 * or 'The Garrison', and it does call 'Vanguard Consortium' military. Widening it is the
 * generation-side act named above: OWNER-GATED, and docketed rather than taken here.
 *
 * @param {import('../settlement.schema.js').SimFaction} f
 */
const isMilitaryFaction = (f) => {
  const nm = factionNameOf(f).toLowerCase();
  return nm.includes('military') || nm.includes('guard');
};

/**
 * Reproduce generation-time occupation RICHNESS on a faction roster that has just
 * been conquered via the pulse: disarm the local military, humble the deposed seat,
 * suppress the civic factions, then seed the foreign occupation authority that
 * transferRulingPower crowns (it only promotes an EXISTING faction). A no-op if the
 * named power already exists (idempotent re-fire) or there is no powerStructure.
 * Used ONLY on cause:'conquest', so every pre-existing (coup) transfer is untouched.
 */
export function installOccupationAuthority(/** @type {any} */ settlement, /** @type {any} */ powerName) {
  const name = String(powerName || '').trim();
  if (!name) return settlement;
  const ps = settlement?.powerStructure;
  if (!ps) return settlement;
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const exists = factions.some((/** @type {any} */ f) => factionNameOf(f).toLowerCase() === name.toLowerCase());
  if (exists) return settlement;
  // Disarm/suppress the locals first (idempotent: a faction already carrying the
  // 'occupied'/'disarmed' modifier is left alone, so a re-fired conquest is a no-op).
  const round = (/** @type {number} */ v) => Math.max(0, Math.round(v));
  const num = (/** @type {any} */ v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const disarmedFactions = factions.map((/** @type {any} */ f) => {
    const mods = modifiersOf(f);
    if (mods.includes('occupied') || mods.includes('disarmed')) return f;
    if (f?.isGoverning) {
      return { ...f, power: round(num(f.power) * OCCUPATION_GOVERNING_CUT), modifiers: [...mods, 'occupied'] };
    }
    if (isMilitaryFaction(f)) {
      return { ...f, power: round(num(f.power) * OCCUPATION_DISARM), modifiers: [...mods, 'disarmed'] };
    }
    return { ...f, power: round(num(f.power) * OCCUPATION_CIVIC_CUT), modifiers: [...mods, 'occupied'] };
  });
  // NOTE: the roster's power values are RELATIVE WEIGHTS, not a normalized 100-point
  // share — the sum≈100 seen at generation is a generation-time-only normalization
  // (pinned against the pipeline output), with no runtime consumer enforcing it.
  // Seeding the occupier at 90 without renormalizing matches the other sim-time
  // power writers (transferRulingPower's +6 coup bump, the thieves-guild floor-raise).
  const occupier = {
    faction: name,
    name,
    // category:'occupation' (not 'military') so factionArchetype — which resolves category BEFORE
    // the name rules — buckets the crowned occupier as OCCUPATION, reaching its rank/label/
    // disposition. CATEGORY_MAP already maps 'occupation'; modifiers:['occupier'] still tags it.
    // Dormant behind warLayerEnabled ⇒ golden-neutral.
    category: 'occupation',
    power: 90,
    isGoverning: false,
    desc: 'A foreign occupation authority installed by conquest.',
    modifiers: ['occupier'],
  };
  return {
    ...settlement,
    powerStructure: { ...ps, factions: [...disarmedFactions, occupier] },
  };
}

/**
 * The conquest's EXTRACTION condition, moved here VERBATIM from `applyWorldPulse.js`'s
 * conquest branch (THE DECOMPOSITION WAVE's own body-moves-unchanged discipline). Its
 * reasoning is unchanged and is the install's, not the mouth's:
 *
 *   Occupation parity — a GENERATION-occupied town carries the `vassal_extraction`
 *   condition (conditionPromotion maps the 'occupied' stress into it), so a PULSE-conquered
 *   town must too: that condition is what the substrate (deriveCausalState), the pressure
 *   model AND population flight all read as "occupation". It is stamped alongside the
 *   conquest's war_pressure so the two faces of an occupation (military strain + economic
 *   extraction) both land. Idempotent by id (`withActiveCondition` replaces same-id), so a
 *   re-fired conquest never double-stamps. Conquest-only ⇒ a coup is byte-identical.
 *
 * ⚠ THE CAST NAMES A TYPE LIE THIS CAR INHERITED RATHER THAN INTRODUCING ONE.
 * `ConditionTriggeredAt.tick` is declared `number`, and this site has always passed
 * `?? null` — invisible while `outcome.powerTransfer` was `any`, and visible the moment the
 * body was typed. The `null` is live behaviour on every conquest, so widening the typedef
 * or dropping the `?? null` would both be behaviour changes wearing a type fix's clothes.
 * Cast, named, and recorded — DELIBERATELY DEFERRED, not a bug to re-find.
 * @param {{ tick?: number|null, toPowerName: string }} powerTransfer
 * @param {number|undefined} severity
 * @param {unknown} saveId
 * @returns {import('../activeConditions.js').ActiveConditionInput}
 */
export function conquestExtractionCondition(powerTransfer, severity, saveId) {
  return /** @type {import('../activeConditions.js').ActiveConditionInput} */ ({
    archetype: 'vassal_extraction',
    severity: clamp01(0.55 + (severity || 0) * 0.15),
    triggeredAt: {
      tick: powerTransfer.tick ?? null,
      sourceEventType: 'WAR_LAYER_CONQUEST',
      sourceEventTargetId: String(saveId),
    },
    causes: [{
      source: powerTransfer.toPowerName,
      effect: 'occupation_extraction',
      reason: `${powerTransfer.toPowerName} extracts wealth, troops, and authority from the conquered settlement.`,
    }],
  });
}

/**
 * THE TYPED LIBERATION MARKER (W-SEAT D7 / SEAT-5). Carried on the liberation's
 * `powerTransfer` payload; its PRESENCE is what tells the un-install apart from any other
 * `appointment` transfer. Keying on the cause alone would fire this on every future
 * appointment, which is how a repair becomes a landmine.
 */
export const OCCUPATION_LIFT_KIND = 'occupation_lifted';

/**
 * THE UN-INSTALL — the mirror of `installOccupationAuthority`, and the repair W-SEAT §1
 * chartered as SEAT-5 after the census CONFIRMED the defect BY ABSENCE: both
 * `occupation_lifted` producers were condition-only, no writer anywhere removed the
 * crowned occupier row, stripped the `occupied`/`disarmed` modifiers or restored the cut
 * power — so a liberated town's roster showed the foreign authority forever while its own
 * prose said "the settlement reclaims its own authority". Measured: tree-wide, NO writer
 * removes a modifier from any faction; every modifier write in src/domain is an append.
 *
 * ⛔ THIS IS A DECLARED ESTIMATE AND IT IS SHAPED BY WHAT CANNOT BE KNOWN (A1.1.4b).
 * The install writes THREE cuts under TWO markers, and the discriminator is destroyed by
 * the same act:
 *
 *   `occupied`  ×0.6   the deposed governing seat   ─┐ one marker, two factors, and
 *   `occupied`  ×0.82  every other civic faction    ─┘ `isGoverning` — the only thing that
 *   `disarmed`  ×0.3   a military faction              told them apart — is exactly what
 *                                                      `transferRulingPower` then reshapes.
 *
 * The cut is also `Math.max(0, Math.round(…))`, so it is LOSSY in the small: a town guard
 * cut 25 → 8 divides back to 26.67, not 25. (The example says "town guard" and not
 * "garrison" since the :261 cure: a faction NAMED 'The Garrison' is no longer disarmed by
 * this install, because the generator does not disarm it either.) And the GENERATOR writes
 * `occupied` too
 * (`generators/power/stressFactions.js` — on the governing row only, with the civic and
 * noble cuts left UNMARKED), which means a town generation-occupied and later
 * pulse-conquered carries the marker for cuts the sim never made. The install's own
 * modifier guard closes double-CUTTING; nothing closes double-RESTORING, and a generated
 * cut is the world's starting truth (THE PROMISE), not damage to repair.
 *
 * SO THE RULE IS DELIBERATELY ASYMMETRIC, and each half is justified by a measurement:
 *   • `disarmed` — ONE factor, and the generator never writes it, so the marker names its
 *     own cut unambiguously. Power is divided back through `OCCUPATION_DISARM`.
 *   • `occupied` — TWO factors and a second author. The marker is STRIPPED (the town is
 *     genuinely no longer occupied) and the power is LEFT WHERE IT IS. Restoring it would
 *     mean inventing the discriminator, and on a generation-occupied roster it would hand
 *     back power nobody ever took.
 *   • the `occupier` row is removed by ITS OWN modifier rather than by archetype or name:
 *     the generator's occupation-flavoured rows carry no `occupier` modifier (measured),
 *     and the crowned seat's NAME is not stable (`resolveGovernmentLabel` picks an ALT
 *     label when the occupier's own name contains the preferred one — the probe produced
 *     "Martial Administration", not "Occupation Authority"). ⚠ Reading `modifiers` costs
 *     nothing on the observed-shape ratchet HERE and only here in this family: this file
 *     is already one of the five that carry `modifiers on factions` as accepted debt, and
 *     the ratchet's law is "never add a file, never add an identity".
 *
 * The seating is NOT done here: the caller's own `transferRulingPower` line does it, so
 * there is exactly one path that changes who governs.
 *
 * @template T
 * @param {T} settlement
 * @param {{ occupationLift?: unknown }|null|undefined} powerTransfer  the outcome payload;
 *   anything without the typed marker is a no-op returning the SAME REFERENCE, which is
 *   what makes the dark path byte-identical by construction rather than by arithmetic.
 * @returns {T}
 */
export function liftOccupationAuthority(settlement, powerTransfer) {
  if (powerTransfer?.occupationLift !== OCCUPATION_LIFT_KIND) return settlement;
  const shaped = /** @type {RosterSettlement|null|undefined} */ (settlement);
  const ps = shaped?.powerStructure;
  if (!ps) return settlement;
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const round = (/** @type {number} */ v) => Math.max(0, Math.min(100, Math.round(v)));
  const num = (/** @type {unknown} */ v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  let moved = false;
  /** @type {unknown[]} */
  const restored = [];
  for (const f of factions) {
    const mods = modifiersOf(f);
    if (mods.includes('occupier')) { moved = true; continue; }
    const disarmed = mods.includes('disarmed');
    if (!disarmed && !mods.includes('occupied')) { restored.push(f); continue; }
    moved = true;
    restored.push({
      ...f,
      ...(disarmed ? { power: round(num(f.power) / OCCUPATION_DISARM) } : {}),
      modifiers: mods.filter((m) => m !== 'occupied' && m !== 'disarmed'),
    });
  }
  if (!moved) return settlement;
  return /** @type {T} */ ({ ...shaped, powerStructure: { ...ps, factions: restored } });
}
