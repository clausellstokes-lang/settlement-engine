/**
 * domain/townMap/fabric/partitionSeating.js — ⭐⭐⭐ CAR-SEATING · **THE INSTITUTIONS TAKE THEIR
 * PLACES ON THE PARTITION** (DESIGN_SPINE_COMPLETION §8, A2.4's decomposition).
 *
 * ⭐⭐ WHAT THIS FILE IS FOR, AND THE MEASUREMENT THAT MADE IT NECESSARY.
 * The partition has faces and the page has ink, and until this file existed it had **no
 * institutions at all**. Measured at `a58e19abf`, three ways and all three agree:
 *   · `grep -n landmark src/domain/townMap/fabric/partition*.js` returns **ZERO**;
 *   · `FACE_CLASSES` (`partitionArrangement.js:96`) is a closed roster of ten and none is
 *     institutional — there is no MONUMENT class and no monument register;
 *   · `partitionInputs` (`harness/laneSPINE1/partitionPerf.mjs:48`) is a nine-key whitelist
 *     — `{seed, ledger, extent, originForm, planMode, roadWidth, bodyTarget, water, wallForm}` —
 *     so the roster never crosses the bridge in the first place.
 * Meanwhile the LEGACY fabric seats them in full: `fabric.landmarks` is **91 seated bodies on
 * `town`**, 52 on `city`, 75 on `fjord`. ⛔ **The institutions were never missing. The bridge
 * dropped them**, and `seating.js` — a complete greedy pass — has been placing them on a raster
 * ownership grid (`organismFields.buildPartition`) that the drawn page does not consume.
 *
 * ⭐⭐ THE REFERENCE'S MECHANISM, FED OUR FACTS (the half a quota deck cannot be bought for).
 * The studied reference assigns ward kinds by **a fixed 36-card deck plus per-type greedy
 * location scorers**. We take the *mechanism* and refuse the *content*: our deck is not a fixed
 * mixture at all, it is **this settlement's own roster** — what its history, wealth and trade
 * actually support, already decided by the truth layer and merely *read* here. Concretely the
 * deck is `liveInstitutions(settlement)` projected through the ATLAS, and its size and shape move
 * with the world: thorp 10 · village 33 · town 58 · city 41 · metropolis 56, measured.
 *
 * ⛔⛔ THE ATLAS IS THE PLACEMENT AUTHORITY, NOT `priorityCategory`, AND THIS IS NOT A
 * PREFERENCE. `data/institutionAtlas.js`'s own header records that `priorityCategory` is
 * **mis-keyed for 43 craft and commerce entries filed 'government'** — Tannery, Fuller, Dyer,
 * Smelter, Brewery, Fish market among them — so a placer reading it *"would site the TANNERY AT
 * THE CIVIC CORE, next to the town hall, forever."* `institutionAssignment.js` reads
 * `priorityCategory` first and only; **this file never reads it.** It reads `atlasRow(name).family`
 * and `.ring`, and records a derivation when the atlas is silent.
 *
 * ⭐⭐ WEIGHTS AND VARIETIES, NEVER WALLS (§640.3, the standing law for anything dossier-grounded).
 * Every scorer below is a PULL or a REPULSION on a candidate's weight. Not one is a refusal.
 * §640.2 re-chartered exactly these rows against the corpus and the direction is one-way:
 *   · hospitals take an **edge-or-gate PULL** — two of four measured hospitals were INTRAMURAL,
 *     so intramural must stay reachable rather than being forbidden;
 *   · noxious trades take an **edge/water PULL with intramural LAWFUL** — York's Tanner Row,
 *     Norwich, Gloucester, Northampton, Nottingham; Newmarket 1472/3 sat its tanners beside the
 *     Guildhall. "Downstream" is a weight, never a hard fail;
 *   · fairs are a **hall-or-field DRAW** — Oxford moved its fair INTO the guildhall while
 *     Stourbridge's field is equally confirmed, so both sites score and neither is mandated;
 *   · inns take an **approach PULL** toward gates and arteries.
 * ⚠ A rule that FORBIDS where a hard rule was never proven is how a map becomes uniform, and a
 * uniform map is the failure this whole car exists to prevent. The only absolutes here are the
 * PHYSICAL ones (§161m), which are absolute because the ground itself is: a quay is on the water
 * or it is not a quay.
 *
 * ⭐⭐ WHY THERE IS NO RANDOMNESS IN THIS FILE, WHICH IS A DEPARTURE FROM THE REFERENCE.
 * The reference's variety comes from a deck shuffle and a seeded weighted roll, because its deck
 * is a CONSTANT and dice are the only thing that can move it. Ours is not a constant: two
 * settlements differ in roster, prosperity, trade, water, walls and gates before a single die is
 * cast, and that is where our variety is *supposed* to come from. So the pass is a **pure
 * deterministic greedy argmax with a total order** — face id breaks every tie. Three things fall
 * out, and the third is why it is written this way rather than merely allowed to be:
 *   · it is byte-stable by construction, so the same-seed contract needs no separate pin;
 *   · it mints no fork key and opens no stream, so `statefulForkSites` stays at its pinned 18 and
 *     S16's `randomNamespaces` does not move;
 *   · ⛔ **it cannot hide a flat deck behind noise.** If our facts do not actually differentiate
 *     two settlements, a seeded roll would scatter the seats and the map would *look* varied
 *     while the truth underneath was uniform. With the dice removed, sameness in equals sameness
 *     out — which is precisely what the distribution censuses are built to catch.
 *
 * ⭐ THE COMPOSITION-ORDER LAW IS INHERITED WHOLE (`seating.js:5-29`, §175.1). ONE greedy pass in
 * a FIXED order; each institution's affinity evaluates TOWARD ALREADY-SEATED INSTITUTIONS ONLY;
 * no relaxation loop to a fixpoint. That law's three reasons hold here unchanged — a fixpoint may
 * not converge, it couples every body to every other against the inertia law, and it AVERAGES a
 * town into a diagram. The greedy pass IS the path: the church was there first, so the market
 * went beside it, so the inn went beside THAT.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare, no rng.
 */

import { atlasRow } from '../../../data/institutionAtlas.js';
import { liveInstitutions } from '../../institutions/institutionRoster.js';
import { pointInPolygon, distToSegment } from './fabricGeometry.js';
import { faceArea, faceCentroid, faceHalfEdges, liveFaces } from './partitionArrangement.js';

/** The page-view schema this pass publishes against. Bumped when the seat record changes shape. */
export const PARTITION_SEATING_SCHEMA_VERSION = 1;

/**
 * ⛔ FAMILIES THAT ARE NOT ARCHITECTURE, AND THIS RULE IS **INHERITED, NOT INVENTED**.
 * `nonBuilding` is the atlas's own column (§D): *"this entry is not architecture. Render nothing,
 * or a truth-layer service marker — NEVER an invented building. A 27-soul thorp's 'Household
 * elder' is a household, not a civic hall."* `OFF-MAP` is the family for facts about somewhere
 * else ("Access to parish church" — the church is in the next village).
 *
 * ⭐⭐ THE SHIPPED LAW WE ARE MATCHING IS §174.3, AT `institutions.js:612-621`: a nonBuilding
 * entry is skipped by the seating pass and recorded separately as *"NON-BUILDING — anchor kept,
 * no silhouette drawn"* (surfaced at `buildFabric.js:1495` as `nonBuildingInstitutions`). This
 * file behaves **identically**, so the two substrates cannot disagree about what is a building.
 * The names are carried out on `deck.dropped` rather than reduced to a count, precisely so the
 * census can see WHO — a count cannot tell a household from a cathedral.
 *
 * ⚠⚠ AND THE THING A READER MUST NOT "FIX" HERE — MEASURED, and it is REPORTED UPSTREAM, not
 * cured in the fabric. `nonBuilding` is **perfectly family-correlated**: it is 1 for 100% of
 * POLITY (22/22), PERSON (16/16), CIRCUIT (6/6), GROUND (8/8), MATRIX (6/6) and OFF-MAP (2/2),
 * and 0 for all 213 other rows. It is a FAMILY-level flag, not 60 per-entry judgments. The
 * consequence is that **`Town hall` and `City hall` are dropped and POLITY seats NOTHING on any
 * leaf.** That is not a bug in this file and must not be patched here:
 *   · `institutionAtlas.js` is a TRANSCRIPTION whose own header forbids hand edits — *"a hand
 *     edit here silently forks from the compile artifact"*;
 *   · un-dropping POLITY here would fork this pass from §174.3 and change legacy plate content;
 *   · whether a moot hall draws a silhouette is a content/product call, not a fabric call.
 * The reportable observation, recorded so it is not re-derived: §174.3's rationale enumerates why
 * each nonBuilding family is not architecture — the circuit is drawn by the wall member, the
 * matrix IS the fabric, land use is drawn by the ground dress, an off-map service is an exit-road
 * affordance, a village headman is a house with a person in it — and **POLITY is the one family
 * it never justifies.** 22 rows carry a flag whose own stated reason does not reach them.
 *
 * ⭐ THIS IS ALSO THE "NOTHING INVENTS A CATEGORY" CLAUSE. The deck can only ever contain what
 * the atlas already names; an institution the atlas has never heard of is recorded as an
 * UNATLASED derivation and seated by its ring alone, never by a family this file made up.
 */
export const NON_SEATING_FAMILIES = Object.freeze(['OFF-MAP']);

/**
 * ⭐⭐ THE PHYSICAL FAMILIES — absolute at any chaos, exactly as §161m defines them, and the ONLY
 * hard constraints in this file. A predicate returns whether a candidate face satisfies the
 * family's requirement. `physicalViolations` counts the seats that could not.
 * ⚠ Deliberately SHORT. A family belongs here only when the ground itself decides: a quay on
 * water, a working at its stone. Everything a *person* decided — where the hospital went, whether
 * the tanners were tolerated inside the wall — is a weight below, because people vary and the
 * corpus proves they varied.
 */
export const PHYSICAL_FAMILIES = Object.freeze({
  /** A waterfront body FRONTS THE WATER. Not near it — on it. */
  WATERFRONT: (c) => c.frontsWater,
  /** The circuit's works sit ON the boundary, which the wall band owns. */
  CIRCUIT: (c) => c.inBand || c.touchesBand,
});

/** Families whose seat is a VOID face (emptiness is the point) rather than a built plot. */
export const VOID_SEEKING_FAMILIES = Object.freeze(['COMMERCE', 'CIVIC', 'GROUND']);

/**
 * ⛔⛔ THE PHYSICAL PULL — THE CONSTRAINT MUST BE *SOUGHT*, NOT MERELY *CHECKED*, AND THIS
 * CONSTANT IS THE WHOLE DIFFERENCE. MEASURED, at `a58e19abf`, before it existed:
 *   · `town` carries **39 water-fronting faces** and its `Fishmonger` was seated on a dry one;
 *   · `fjord` carries 4, and they ranked **678th of 1348** under the family scorer alone
 *     (w=1.0000 against a winning 1.4602) — because `WATERFRONT`'s own scorer is
 *     `pull(toCentre)`, which drags a quay TOWARD THE MIDDLE and therefore AWAY from the only
 *     ground it may lawfully stand on. The pass validated the constraint at the chosen face and
 *     never once steered toward it, so `physicalViolations` could not reach zero on a leaf whose
 *     water was sitting right there.
 * ⭐ WHY A BIG FINITE NUMBER AND NOT A FILTER. A filter would make the physical families the only
 * WALLS in a file whose whole law is weights (§640.3) — and worse, it would make an institution
 * with no lawful ground SILENTLY VANISH instead of being seated and COUNTED. With a dominant but
 * finite pull: a lawful free face outranks every unlawful one (the ratio of the widest possible
 * unlawful weight to the narrowest lawful one is under 44, so 1000 dominates with room to spare),
 * and when no lawful face exists at all the term is a constant across every candidate, cancels,
 * and the pass seats the body at its best available ground and RECORDS THE VIOLATION. Absent
 * ground stays visible; it does not become a missing institution.
 */
export const PHYSICAL_PULL = 1000;

/**
 * ⭐ THE STANDING LADDER — four grades, and they are the wealth vocabulary the truth layer
 * already speaks (`economicState.prosperity`, `model.districts[].wealth`). Not a new axis.
 */
export const STANDING_GRADES = Object.freeze(['poor', 'modest', 'comfortable', 'wealthy']);

/**
 * ⭐ HOW MUCH OF ITS OWN GROUND A SETTLEMENT'S WEALTH CAN CARRY. The reference's overflow rule is
 * *"deck exhausted ⇒ every remaining piece is a slum"*, an emergent poverty law we keep and
 * re-source: the share of built ground that rises above `poor` is a function of the settlement's
 * OWN prosperity fact, and everything the wealth does not reach is poor **by residue**. There is
 * no slum quota, no "poor district" count, and no poverty input anywhere in this file — poverty
 * is what is left when the wealth runs out, which is what poverty is.
 * ⚠ These are the prosperity labels the economy generator actually emits, and the shares are the
 * chair-signed provisional weights-grade values (PA.4's pattern); the OWNER re-signs at tuning.
 */
export const PROSPERITY_REACH = Object.freeze({
  destitute: 0.10, struggling: 0.24, poor: 0.24, subsisting: 0.32,
  modest: 0.46, stable: 0.52, comfortable: 0.62, prosperous: 0.74,
  wealthy: 0.82, thriving: 0.82, rich: 0.88,
});
/** The honest default for a label this table has never seen — the middle, and recorded as a
 *  derivation rather than silently assumed. */
export const PROSPERITY_REACH_DEFAULT = 0.46;

/**
 * ⭐⭐ THE FAMILY SCORERS — §640's weights, and the reference's own, over partition faces.
 *
 * Each returns a MULTIPLIER on a candidate face's weight. 1.0 is indifference; above 1 is a pull,
 * below 1 a repulsion. ⛔ **No scorer returns 0 and none returns Infinity** — that is the
 * weights-not-walls law made structural rather than promised, and a reader can check it by
 * reading the returns.
 *
 * The candidate `c` carries, all normalised to the settlement's own bound radius:
 *   toCentre 0..1+ · toPlaza · toGate · toWater · toEdge   (0 = at it)
 *   intramural · inBand · touchesBand · frontsWater · onArtery · isVoid · areaRatio
 *   near(family) 0..1  — proximity to the NEAREST ALREADY-SEATED body of that family
 */
export const FAMILY_SCORERS = Object.freeze({
  /** WORSHIP overlooks the square. The reference's temple prefers the largest plaza-bordering
   *  piece; ours prefers to border the plaza and to be large, and settles for the middle. */
  WORSHIP: (c) => pull(c.toPlaza, 1.9) * (1 + 0.5 * c.areaRatio) * pull(c.toCentre, 1.2),

  /** POLITY/CIVIC INSISTS on the square — the reference's administration scorer, which is the
   *  strongest positional preference in its whole deck, and the seat of a town is the one body
   *  every corpus plate puts on the market place. */
  POLITY: (c) => pull(c.toPlaza, 2.6) * pull(c.toCentre, 1.4),
  CIVIC: (c) => pull(c.toPlaza, 2.2) * pull(c.toCentre, 1.3),

  /** COMMERCE wants the middle and REFUSES TO DWARF THE PLAZA (the reference's area-ratio term),
   *  and markets repel each other — a second market goes to a second place or it is one market. */
  COMMERCE: (c) => pull(c.toPlaza, 1.7) * pull(c.toCentre, 1.3) * sizeAgreement(c.areaRatio)
    * repel(c.near.COMMERCE, 0.55),

  /** FINANCE follows the money to the middle, and wants respectable neighbours. */
  FINANCE: (c) => pull(c.toCentre, 1.8) * pull(c.toPlaza, 1.3) * repel(c.near.NOXIOUS, 0.5),
  /** LUXURY is the patriciate's trade: the middle, and away from the stink. */
  LUXURY: (c) => pull(c.toCentre, 1.6) * repel(c.near.NOXIOUS, 0.6) * repel(c.near.UNDERWORLD, 0.5),

  /** ⭐ §640.2 · HOSPITALS TAKE AN EDGE-OR-GATE PULL, AND INTRAMURAL STAYS LAWFUL.
   *  Two of four measured hospitals were intramural, so this is `max(edge, gate)` as a PULL with
   *  no intramural penalty at all — a leper house goes beyond the last gate, St Bartholomew's
   *  sits inside the wall, and both must be reachable from the same rule. */
  CARE: (c) => (1 + 0.9 * Math.max(near01(c.toEdge), near01(c.toGate))) * pull(c.toWater, 1.15),

  /** ⭐ §640.2 · NOXIOUS TAKES AN EDGE/WATER PULL WITH INTRAMURAL LAWFUL.
   *  The water pull is the mechanism (the trades need it and foul it); the edge pull is the
   *  tolerance. Neither forbids the intramural seat that York, Norwich, Gloucester, Northampton
   *  and Nottingham all record. And the stinking trades share one edge and one watercourse, so
   *  they ATTRACT each other — the noxious quarter is a quarter because of this line. */
  NOXIOUS: (c) => pull(c.toWater, 1.9) * (1 + 0.7 * near01(c.toEdge))
    * (1 + 0.6 * c.near.NOXIOUS) * repel(c.near.POLITY, 0.55) * repel(c.near.WORSHIP, 0.7),

  /** HEAVY trades want water power and room, and are unwelcome at the centre. */
  HEAVY: (c) => pull(c.toWater, 1.7) * (1 + 0.5 * near01(c.toEdge)) * (1 + 0.4 * c.areaRatio),

  /** ⭐ §8 · INNS ON THE APPROACHES. The gate is the approach's own end, and the artery is the
   *  approach continued inside — a coaching inn wants the traffic, wherever the traffic is. */
  HOSPITALITY: (c) => (1 + 1.0 * near01(c.toGate)) * (1 + 0.5 * (c.onArtery ? 1 : 0))
    * pull(c.toPlaza, 1.25),

  /** STREET-TRADE is the trafficked street by definition — the workshop wants passing feet. */
  'STREET-TRADE': (c) => (1 + 0.6 * (c.onArtery ? 1 : 0)) * pull(c.toPlaza, 1.35),

  /** MARTIAL mans the works and answers the seat (`seating.js`'s own supply edges). */
  MARTIAL: (c) => (1 + 1.1 * (c.touchesBand ? 1 : 0)) * (1 + 0.6 * c.near.POLITY)
    * (1 + 0.5 * near01(c.toGate)),

  /** ⭐ WATERFRONT is PHYSICAL above; the weight here only chooses AMONG lawful water frontages,
   *  preferring the stretch nearest the town that uses it — a quay is the town's own water. */
  WATERFRONT: (c) => pull(c.toCentre, 1.5) * (1 + 0.6 * c.near.COMMERCE),

  /** LEARNING belongs to the church that founded it. */
  LEARNING: (c) => (1 + 0.9 * c.near.WORSHIP) * pull(c.toCentre, 1.2),

  /** UNDERWORLD and VICE want the dark edge and the absence of authority. */
  UNDERWORLD: (c) => (1 + 0.8 * near01(c.toEdge)) * repel(c.near.POLITY, 0.4)
    * repel(c.near.MARTIAL, 0.45) * (1 + 0.5 * c.near.UNDERWORLD),
  VICE: (c) => (1 + 0.6 * near01(c.toGate)) * repel(c.near.WORSHIP, 0.55)
    * (1 + 0.5 * c.near.HOSPITALITY),

  /** ARCANE keeps to itself, near enough to the middle to matter. */
  ARCANE: (c) => pull(c.toCentre, 1.3) * (1 + 0.7 * c.near.ARCANE) * repel(c.near.WORSHIP, 0.75),

  /** CARE's civic cousins, and the plain ones. */
  ADVENTURING: (c) => (1 + 0.7 * near01(c.toGate)) * (1 + 0.4 * c.near.HOSPITALITY),
  MATRIX: (c) => pull(c.toCentre, 1.2),
  INFRA: (c) => 1 + 0.3 * near01(c.toEdge),
  GROUND: (c) => 1 + 0.4 * c.areaRatio,
  ORDINARY: () => 1,
  PERSON: () => 1,
  'EXOTIC-GEO': (c) => 1 + 0.6 * near01(c.toEdge),
});

/**
 * ⭐ THE FAIR IS THE ONE ENTRY WHOSE SCORER IS A **DRAW BETWEEN TWO SITES** rather than a
 * gradient (§640.2). Oxford moved its fair INTO the guildhall; Stourbridge's field is equally
 * confirmed. So a fair scores well at the market place AND well on open ground beyond the gate,
 * and badly in the ordinary tissue between them — which is the shape of the evidence, and is not
 * expressible as a single pull.
 * Keyed by atlas NAME because "fair" is a property of the entry, not of COMMERCE as a family.
 */
export const FAIR_NAMES = Object.freeze(['annual fair', 'major annual fairs', 'annual fairs']);
export function fairScorer(c) {
  const hall = pull(c.toPlaza, 2.0);
  const field = (c.intramural ? 0.85 : 1.6) * (1 + 0.8 * near01(c.toGate)) * (1 + 0.5 * c.areaRatio);
  return Math.max(hall, field);
}

/** A pull toward zero distance: 1 at the far end, `strength` at distance 0. */
function pull(d, strength) {
  const t = near01(d);
  return 1 + (strength - 1) * t;
}
/** A repulsion from an already-seated neighbour: 1 when far, `floor` when coincident. */
function repel(nearness, floor) { return 1 - (1 - floor) * clamp01(nearness); }
/** Distance (normalised, 0 = at it) → nearness 0..1, falling off over one bound radius. */
function near01(d) { return d == null ? 0 : clamp01(1 - clamp01(d)); }
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
/** The reference's market rule: a market should not dwarf the plaza. Peaks at parity. */
function sizeAgreement(ratio) {
  const r = ratio > 0 ? ratio : 0.001;
  const k = r > 1 ? 1 / r : r;
  return 0.6 + 0.5 * k;
}

/**
 * ⭐ THE DECK — the mixture, read off OUR ledger and never invented.
 *
 * @param {Array<{name:string, category?:string}>} roster the settlement's LIVE institutions
 * @returns {{ cards: Array<Object>, byFamily: Record<string, number>, dropped: Array<Object>,
 *             unatlased: string[] }}
 */
export function buildQuotaDeck(roster) {
  const cards = []; const dropped = []; const unatlased = [];
  const list = Array.isArray(roster) ? roster : [];
  for (const inst of list) {
    const name = String((inst && inst.name) || '');
    if (!name) continue;
    const row = atlasRow(name);
    if (!row) {
      // ⚠ A DERIVATION, RECORDED AS ONE. The atlas is the authority; when it is silent (a custom
      // institution, or one minted after the transcription) the card still exists — it is the
      // settlement's own truth — but it carries no family, gets the neutral scorer, and is
      // COUNTED so a census can see how much of a leaf was placed without an authority.
      unatlased.push(name);
      cards.push({ name, family: null, ring: 'I', disp: 'D', founds: false, atlased: false });
      continue;
    }
    if (row.nonBuilding || NON_SEATING_FAMILIES.indexOf(row.family) >= 0) {
      // §174.3, in the legacy pass's own words — the anchor survives, the silhouette does not.
      dropped.push({
        name,
        family: row.family,
        why: row.nonBuilding ? 'nonBuilding' : 'off-map',
        via: 'NON-BUILDING — anchor kept, no silhouette drawn',
      });
      continue;
    }
    cards.push({
      name, family: row.family, ring: row.ring || 'I', disp: row.disp || 'D',
      founds: !!row.founds, atlased: true,
    });
  }
  const byFamily = {};
  for (const c of cards) { const k = c.family || 'UNATLASED'; byFamily[k] = (byFamily[k] || 0) + 1; }
  return { cards, byFamily, dropped, unatlased };
}

/**
 * ⭐⭐ THE ORDER, AND IT IS THE PATH RATHER THAN A PRIORITY.
 * Founders first (the atlas's own `founds` column — the bodies that FOUND their quarter claimed
 * their ground before the quarter existed), then the unique bodies, then by family weight, then
 * by name for a total order. A later arrival can never move an earlier one, which is the inertia
 * law and also the history.
 */
const FAMILY_CLAIM = Object.freeze({
  POLITY: 9, WORSHIP: 9, CIVIC: 8, MARTIAL: 8, CIRCUIT: 8, COMMERCE: 7, WATERFRONT: 7,
  FINANCE: 6, LEARNING: 6, ARCANE: 6, HEAVY: 5, CARE: 5, LUXURY: 5, INFRA: 5, GROUND: 5,
  NOXIOUS: 4, HOSPITALITY: 4, ADVENTURING: 3, MATRIX: 3, 'STREET-TRADE': 3, VICE: 2,
  UNDERWORLD: 2, PERSON: 1, 'EXOTIC-GEO': 1, ORDINARY: 1,
});
/**
 * ⛔⛔ A PRECONDITION OUTRANKS A PREFERENCE, AND THIS RANK EXISTS BECAUSE OF A MEASUREMENT.
 * `fjord` carries exactly **4** water-fronting faces. Before this key, ALL FOUR were gone by the
 * time the fish market's turn came at deck index 19 — taken by `Monastery or friary` (face 80),
 * `Sawmill` (92), `Mills (2-5)` (83) and `Potter` (2), every one of them a FOUNDER, and every one
 * of them a body for which water is a *pull* rather than a *requirement*. The quay lost its only
 * lawful ground to four neighbours who each had the rest of the leaf to choose from.
 * ⭐ So the physical families take first refusal on their own scarce ground. This is not a
 * departure from the composition-order law, it is that law read correctly: a fjord town EXISTS
 * because of its water, so the quay genuinely does predate the friary. It moves very little — the
 * physical families are WATERFRONT and CIRCUIT, and the corpus carries at most ONE such card per
 * leaf — and what it buys is that a violation now means *the ground is absent*, never *somebody
 * else got there first*, which is the only reading that makes the counter worth having.
 */
function isPhysical(card) { return !!(card.family && PHYSICAL_FAMILIES[card.family]); }
export function deckOrder(cards) {
  return cards.slice().sort((a, b) => (Number(isPhysical(b)) - Number(isPhysical(a)))
    || (Number(b.founds) - Number(a.founds))
    || ((a.disp === 'U' ? 0 : 1) - (b.disp === 'U' ? 0 : 1))
    || ((FAMILY_CLAIM[b.family] || 0) - (FAMILY_CLAIM[a.family] || 0))
    || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

/**
 * ⭐⭐⭐ THE SEATING PASS OVER THE PARTITION'S OWN FACES.
 *
 * ⚠ `geom` IS A PLAIN OBJECT, WHICH IS THE TEST SEAM AND NOT A GRAPH DODGE. Any `{candidates,
 * radius}` drives this pass — a fixture, a future zoom rung — so the seating law can be exercised
 * with no partition in sight. The *production* reader below imports the arrangement outright and
 * declares `S8>S16`; see `partitionSeatingReader` for why ⟦DRESS-1 §686.7⟧ forecloses the
 * injected-reader alternative.
 *
 * @param {Object} args
 * @param {Array<Object>} args.deck        `buildQuotaDeck(...).cards`
 * @param {Object} args.facts              the ledger facts: `{prosperity, tier, walled}`
 * @param {Object} args.geom               the injected reader (see `partitionSeatingReader`)
 * @returns {{seats:Array<Object>, standing:Array<Object>, physicalViolations:number,
 *            violations:Array<Object>, notes:string[], byFamily:Record<string,number>}}
 */
export function seatOnPartition(args) {
  const { deck, facts, geom } = args;
  const order = deckOrder(deck);
  const cands = geom.candidates();          // every seatable face, pre-measured
  const taken = new Set();
  /** @type {Array<Object>} */ const seats = [];
  /** @type {Array<Object>} */ const violations = [];
  /** @type {string[]} */ const notes = [];
  /** Nearest already-seated body per family, maintained incrementally — the loop-breaker. */
  const seatedBy = new Map();
  let physicalViolations = 0;

  for (const card of order) {
    const fam = card.family;
    const physical = fam ? PHYSICAL_FAMILIES[fam] : null;
    const scorer = pickScorer(card);
    const wantsVoid = fam ? VOID_SEEKING_FAMILIES.indexOf(fam) >= 0 : false;

    let best = null; let bestW = -1;
    for (const c of cands) {
      if (taken.has(c.face)) continue;
      // ⭐ THE RING IS A WEIGHT, NOT A WALL (§161c, and §640.3 generalised). An OUTLYING abbey
      //   seated in the core is WRONG, and it is not IMPOSSIBLE — the corpus records both.
      const ringW = ringWeight(card.ring, c);
      // A VOID-seeking body prefers emptiness; a built one prefers built ground. Preference.
      const voidW = c.isVoid ? (wantsVoid ? 1.6 : 0.35) : (wantsVoid ? 0.7 : 1);
      // ⛔ THE PHYSICAL GROUND IS SOUGHT HERE (see PHYSICAL_PULL). Dominant, finite, and — when
      //    no candidate on the leaf can satisfy it — a constant that cancels out of the argmax.
      const physW = physical ? (physical(c) ? PHYSICAL_PULL : 1) : 1;
      c.near = nearnessOf(seatedBy, c, geom.radius);
      const w = physW * ringW * voidW * scorer(c) * (0.25 + 0.75 * clamp01(c.areaRatio));
      // Total order: weight, then face id. No dice, so no tie is ever broken by chance.
      if (w > bestW || (w === bestW && best && c.face < best.face)) { bestW = w; best = c; }
    }

    if (!best) {
      notes.push(`${card.name} (${fam || 'UNATLASED'}) found no free face — RECORDED, never dropped`);
      continue;
    }
    // ⛔ THE PHYSICAL CHECK IS MADE AT THE CHOSEN FACE, NOT AT CANDIDATE TIME. A physical family
    //   whose ground does not exist on this leaf must be VISIBLE as a violation rather than
    //   quietly unseated — `physicalViolations` is the number B6 says must be zero, and a
    //   counter that can only be decremented by not looking is the defect it exists to catch.
    if (physical && !physical(best)) {
      physicalViolations++;
      violations.push({ name: card.name, family: fam, face: best.face, why: physicalFault(fam) });
      notes.push(`⚠ ${card.name} (${fam}) seated where its PHYSICAL constraint fails — ${physicalFault(fam)}`);
    }
    taken.add(best.face);
    const seat = {
      name: card.name, family: fam, ring: card.ring, atlased: card.atlased,
      face: best.face, x: best.cx, y: best.cy, area: best.area,
      why: whyOf(card, best),
    };
    seats.push(seat);
    if (fam) {
      if (!seatedBy.has(fam)) seatedBy.set(fam, []);
      seatedBy.get(fam).push(best);
    }
  }

  const standing = gradeStanding(cands, seats, facts, geom);
  const byFamily = {};
  for (const s of seats) { const k = s.family || 'UNATLASED'; byFamily[k] = (byFamily[k] || 0) + 1; }
  return { seats, standing, physicalViolations, violations, notes, byFamily };
}

/** The scorer a card takes: the fair's own draw, else its family's, else indifference. */
function pickScorer(card) {
  if (FAIR_NAMES.indexOf(card.name.toLowerCase()) >= 0) return fairScorer;
  return (card.family && FAMILY_SCORERS[card.family]) || FAMILY_SCORERS.ORDINARY;
}

/** ⭐ The ring as a disposition with a COST, never a refusal. The legacy pass spells the same
 *  law with the same shape (`seating.js:227-235`); the numbers are its numbers. */
function ringWeight(ring, c) {
  if (ring === 'I') return c.intramural ? 1 : 0.28;
  if (ring === 'E') return 1;                                   // the edge is legal either side
  if (ring === 'N' || ring === 'O') return c.intramural ? 0.28 : 1;
  if (ring === 'W') return (c.inBand || c.touchesBand) ? 1 : 0.35;
  return 1;
}

/**
 * Nearness to the nearest already-seated body of each family, 0..1 over one bound radius.
 * ⚠ EVERY SCORED FAMILY IS PRE-SEEDED TO 0 rather than left absent. A scorer reading an absent
 * key would get `undefined`, and `1 + 0.6 * undefined` is `NaN` — the silent-NaN class this
 * estate has now caught four times, and it costs one `Object.create` to make impossible.
 */
const NEAR_ZERO = Object.freeze(Object.keys(FAMILY_SCORERS)
  .concat(['CIRCUIT'])
  .reduce((o, k) => { o[k] = 0; return o; }, {}));
function nearnessOf(seatedBy, c, radius) {
  const out = { ...NEAR_ZERO };
  for (const [fam, list] of seatedBy) {
    let bestD = Infinity;
    for (const s of list) {
      const dx = s.cx - c.cx, dy = s.cy - c.cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestD) bestD = d;
    }
    out[fam] = near01(bestD / (radius || 1));
  }
  return out;
}

function physicalFault(fam) {
  return fam === 'WATERFRONT' ? 'no face on this leaf fronts water'
    : fam === 'CIRCUIT' ? 'this leaf carries no wall band' : 'physical ground absent';
}

function whyOf(card, c) {
  const bits = [];
  if (card.founds) bits.push('founds its quarter');
  if (c.isVoid) bits.push('on the open place');
  if (c.intramural) bits.push('within the wall'); else bits.push('outside the wall');
  if (c.onArtery) bits.push('on an artery');
  if (c.frontsWater) bits.push('fronting water');
  return bits.join('; ');
}

/**
 * ⭐⭐⭐ SLUM AS OVERFLOW — POVERTY AS EMERGENCE, AND THE WHOLE POINT OF THE CLAUSE.
 *
 * ⛔ There is no slum quota here and there is no poverty input. What there is: the settlement's
 * OWN prosperity fact says how far its wealth reaches (`PROSPERITY_REACH`), the ground says who
 * is near the middle and near the institutions that carry money, and **everything the wealth does
 * not reach is poor by residue.** A rich town has a small poor fringe; a struggling one is mostly
 * poor with a comfortable core; and a town that grows past what its wealth can carry grows slums
 * at its edge WITHOUT anyone deciding to put slums there. That is the reference's overflow law
 * re-sourced onto our facts, and it is the reason poverty on this map is a consequence rather
 * than a decoration.
 *
 * ⚠ THE ORDER IS SCORE-THEN-CUT, NOT CUT-THEN-SCORE. Every built face is scored on the same
 * ladder, the ladder is sorted, and the wealth reach draws the line. So the *shape* of the
 * distribution is the town's geography and the *position* of the line is the town's economy —
 * two independent facts, neither standing in for the other.
 */
export function gradeStanding(cands, seats, facts, geom) {
  const reach = prosperityReach(facts && facts.prosperity);
  const moneyed = seats.filter((s) => s.family === 'FINANCE' || s.family === 'LUXURY'
    || s.family === 'POLITY' || s.family === 'CIVIC' || s.family === 'WORSHIP');
  const squalid = seats.filter((s) => s.family === 'NOXIOUS' || s.family === 'UNDERWORLD'
    || s.family === 'HEAVY' || s.family === 'VICE');
  const built = cands.filter((c) => !c.isVoid);
  const scored = built.map((c) => {
    const centre = near01(c.toCentre);
    const up = nearestNearness(moneyed, c, geom.radius);
    const down = nearestNearness(squalid, c, geom.radius);
    // The reference's social scorer, both directions: a park neighbour attracts, a slum repels.
    return { face: c.face, score: 0.55 * centre + 0.30 * up - 0.35 * down + 0.15 * clamp01(c.areaRatio) };
  });
  // A total order with no dice: score, then face id.
  scored.sort((a, b) => (b.score - a.score) || (a.face - b.face));
  const n = scored.length;
  const out = [];
  // The wealth reaches `reach` of the built ground; inside that it grades by its own ladder.
  const wealthyEnd = Math.floor(n * reach * 0.18);
  const comfortableEnd = Math.floor(n * reach * 0.52);
  const modestEnd = Math.floor(n * reach);
  for (let i = 0; i < n; i++) {
    const grade = i < wealthyEnd ? 'wealthy' : i < comfortableEnd ? 'comfortable'
      : i < modestEnd ? 'modest' : 'poor';
    out.push({ face: scored[i].face, standing: grade });
  }
  return out;
}

function nearestNearness(list, c, radius) {
  let bestD = Infinity;
  for (const s of list) {
    const dx = s.x - c.cx, dy = s.y - c.cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < bestD) bestD = d;
  }
  return near01(bestD / (radius || 1));
}

/** The settlement's own wealth fact → the share of its built ground the wealth reaches. */
export function prosperityReach(prosperity) {
  const key = String(prosperity || '').toLowerCase();
  for (const k of Object.keys(PROSPERITY_REACH)) {
    if (key.indexOf(k) >= 0) return PROSPERITY_REACH[k];
  }
  return PROSPERITY_REACH_DEFAULT;
}

/**
 * ⭐ THE READER. Everything the pass needs to know about the partition, measured ONCE and handed
 * over as plain data.
 *
 * ⛔⛔ THE ARRANGEMENT IS IMPORTED DIRECTLY, AND THAT IS A DELIBERATE REVERSAL — ⟦DRESS-1 §686.7⟧
 * ALREADY RULED ON THIS EXACT QUESTION AND RULED AGAINST THE INJECTED READER. When
 * `wallPublication.js` needed the same access, handing it `{facesOf, ringOf, centroidOf}` "would
 * have kept the roster at five — **by making a real, direct dependency INVISIBLE to the very graph
 * this manifest exists to expose.** A smaller roster bought with a hidden edge is the wrong trade
 * in a file whose stated law is *moves zero bytes as a GRAPH FACT*." This pass reads the
 * arrangement for exactly the same reason (it seats bodies on the FACES themselves), so it takes
 * the same answer: **the edge `S8>S16` is DECLARED in `NODE_EDGES`, not routed around.** It runs
 * FORWARD (S8 precedes S16 in the stage order), so it creates no inversion and does not enlarge
 * the SCC — the graph gains an honest edge and loses a hidden one.
 * ⭐ THE TEST SEAM SURVIVES INTACT, because it never lived here: `seatOnPartition` takes `geom` as
 * a plain object, so a fixture — or a future zoom rung — still drives the whole pass without a
 * partition. What this changes is only whether the *production* reader lies to the stage graph.
 *
 * @param {Object} P the built partition (`buildSettledPartition` result)
 * @param {Object} page the projected page (`projectPage` result) — for `bound`, `gates`, `voids`
 * @param {Object} [arrApi] optional override of the arrangement accessors, for a fixture substrate
 */
export function partitionSeatingReader(P, page, arrApi) {
  const arr = P.arrangement;
  const A = arrApi || { faceArea, faceCentroid, faceHalfEdges, liveFaces };
  const { faceArea: fArea, faceCentroid: fCentroid, faceHalfEdges: fHalfEdges, liveFaces: fLive } = A;
  const bound = page.bound || { cx: 0, cy: 0, radius: 1 };
  const radius = bound.radius > 0 ? bound.radius : 1;

  // The innermost live wrap decides intramural; a leaf with no wrap has no inside.
  const wraps = (P.wraps || []).filter((w) => w && Array.isArray(w.inner) && w.inner.length > 2);
  const innerRings = wraps.map((w) => w.inner);
  const gates = (page.gates || []).map((g) => g.at).filter((a) => Array.isArray(a));
  const plaza = (page.voids || []).find((v) => v.kind === 'market' || v.kind === 'green') || null;
  const plazaAt = plaza ? fCentroid(arr, plaza.face) : null;
  const plazaArea = plaza ? Math.abs(fArea(arr, plaza.face)) : 0;
  const waterRings = (page.water || []).map((w) => w.ring).filter((r) => Array.isArray(r) && r.length > 2);

  /** Twin walk — the arrangement's only adjacency, and it is not exported anywhere else. */
  const neighbours = (fid) => {
    const out = [];
    for (const h of fHalfEdges(arr, fid)) {
      const tw = arr.halfEdges[h] && arr.halfEdges[h].twin;
      if (tw == null) continue;
      const nf = arr.halfEdges[tw] && arr.halfEdges[tw].face;
      if (nf != null && nf !== fid) out.push(nf);
    }
    return out;
  };

  const dTo = (pt, rings) => {
    let best = Infinity;
    for (const ring of rings) {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i]; const b = ring[(i + 1) % ring.length];
        const d = distToSegment(pt[0], pt[1], a[0], a[1], b[0], b[1]);
        if (d < best) best = d;
      }
    }
    return best;
  };

  let built = null;
  const candidates = () => {
    if (built) return built;
    built = [];
    let areaSum = 0; let areaN = 0;
    for (const f of fLive(arr)) {
      if (f.cls !== 'PLOT' && f.cls !== 'VOID') continue;
      const a = Math.abs(fArea(arr, f.id));
      if (!(a > 0)) continue;
      areaSum += a; areaN++;
    }
    const meanArea = areaN ? areaSum / areaN : 1;
    for (const f of fLive(arr)) {
      if (f.cls !== 'PLOT' && f.cls !== 'VOID') continue;
      const c = fCentroid(arr, f.id);
      if (!c) continue;
      const a = Math.abs(fArea(arr, f.id));
      if (!(a > 0)) continue;
      const nbs = neighbours(f.id);
      let onArtery = false; let frontsWater = false; let touchesBand = false;
      for (const nf of nbs) {
        const nb = arr.faces[nf];
        if (!nb || !nb.alive) continue;
        if (nb.cls === 'WAY') {
          const rk = nb.attrs && nb.attrs.rank;
          if (rk === 'artery' || rk === 'street') onArtery = true;
        } else if (nb.cls === 'WATER') frontsWater = true;
        else if (nb.cls === 'WALLBAND') touchesBand = true;
      }
      if (f.attrs && f.attrs.moored) frontsWater = true;
      const intramural = innerRings.some((r) => pointInPolygon(c[0], c[1], r));
      const dx = c[0] - bound.cx, dy = c[1] - bound.cy;
      const toCentre = Math.sqrt(dx * dx + dy * dy) / radius;
      built.push({
        face: f.id, cx: c[0], cy: c[1], area: a,
        areaRatio: plazaArea > 0 ? a / plazaArea : a / meanArea,
        isVoid: f.cls === 'VOID',
        intramural,
        inBand: !!(f.attrs && f.attrs.inBand),
        touchesBand,
        onArtery,
        frontsWater,
        toCentre,
        toEdge: Math.max(0, 1 - toCentre),
        toPlaza: plazaAt ? Math.sqrt((c[0] - plazaAt[0]) ** 2 + (c[1] - plazaAt[1]) ** 2) / radius : 1,
        toGate: gates.length ? Math.min(...gates.map((g) => Math.sqrt((c[0] - g[0]) ** 2 + (c[1] - g[1]) ** 2))) / radius : 1,
        toWater: waterRings.length ? dTo(c, waterRings) / radius : 1,
        near: {},
      });
    }
    // A total order before the greedy pass ever runs — the pass's determinism starts here.
    built.sort((p, q) => p.face - q.face);
    return built;
  };

  return { candidates, radius, neighbours, plazaFace: plaza ? plaza.face : -1 };
}

/**
 * ⭐ THE WHOLE PASS, FROM A BUILT PARTITION AND ITS PAGE.
 *
 * ⛔⛔ THE ROSTER IS TAKEN THROUGH `liveInstitutions()`, AND THE LIVENESS RULE LIVES HERE RATHER
 * THAN AT THE CALL SITE ON PURPOSE. A calamity-ruined or economically-closed institution is
 * **stamped `_worldPulseInactive`, never spliced out of `settlement.institutions`**
 * (`institutionRoster.js:30-49`), so a raw `.institutions` read seats burnt-out shells on the best
 * ground in the town and the smithy that replaced them gets nothing. Putting the filter in this
 * one place means no future caller can forget it.
 * ⚠ THIS IS A KNOWN, DELIBERATE DIVERGENCE FROM THE LEGACY PASS, which reads
 * `rawInstitutions` (`buildFabric.js:288`, unfiltered) and therefore does seat ruined bodies. The
 * two rosters will differ on any leaf carrying a ruin; that difference is this pass being right.
 *
 * @param {Object} P the built partition   @param {Object} page the projected page
 * @param {Object} settlement the settlement — filtered to its LIVE roster here
 * @param {Object} facts `{prosperity, tier}`  @param {Object} [arrApi] fixture-substrate override
 */
export function seatPartition(P, page, settlement, facts, arrApi) {
  const deck = buildQuotaDeck(liveInstitutions(settlement));
  const geom = partitionSeatingReader(P, page, arrApi);
  const result = seatOnPartition({ deck: deck.cards, facts, geom });
  return {
    schemaVersion: PARTITION_SEATING_SCHEMA_VERSION,
    deck: {
      byFamily: deck.byFamily,
      cards: deck.cards.length,
      // ⚠ THE NAMES, NOT A COUNT. A census that can only see "8 dropped" cannot tell a household
      //   elder from a town hall, and telling them apart is the whole content question here.
      dropped: deck.dropped,
      unatlased: deck.unatlased,
    },
    ...result,
  };
}
