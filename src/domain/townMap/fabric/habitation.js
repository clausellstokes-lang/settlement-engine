/**
 * domain/townMap/fabric/habitation.js — ⭐⭐⭐ §16.5 THE WORKSITE HABITATION LAW (owner order
 * ODQ §190c: "on each farmland plot at least one house for the on-site farmer… fisherman
 * near the river, huntsman near the forest, overseer near the mines — base it off historical
 * precedence") and §5.0e THE FAUBOURG LAW (owner order §190d).
 *
 * ⭐⭐ THE OWNER ASKED FOR A HOUSE ON EVERY PLOT AND HISTORY ANSWERS "THAT DEPENDS", WHICH IS
 * WHY THE CHARTER MADE IT A SELECTOR RATHER THAN A COUNT. §16.5's two patterns are two whole
 * countrysides:
 *
 *   NUCLEATED — the open-field village. The farmers live IN it and walk to their strips, so
 *     the fields carry NO dwellings; that is the entire logic of the form. They are not
 *     empty of building: field SHELTERS and hovels stand on holdings past easy carry, and
 *     the furthest worked land sprouts the occasional outlying FARMSTEAD or GRANGE.
 *   DISPERSED — enclosed, upland, frontier. Each holding carries its FARMSTEAD: house, barn
 *     and yard ON the land, with a lane to it. A countryside of scattered lights.
 *
 * ⛔⛔ AND THE CHARTER'S OWN FIELD-BARN CLAUSE WAS FACTUALLY WRONG UNTIL ODQ §194 CURED IT
 * (MF-R3's C1, folded mid-lane and honoured here). The field barn is NOT the open-field
 * system's outbuilding: it belongs to ENCLOSED and hay/upland regimes (the Dales field-barn
 * landscape is post-enclosure), because in champion country the sheaves came HOME to the
 * barns in the village tofts. **A field-barn-dotted open-field render is a pattern mix-up,
 * not richness.** So `barn` is emitted ONLY on the dispersed side, the nucleated side gets
 * `shelter`, and the far-holding answer on both sides is the outlying farmstead or grange.
 *
 * ⭐ §16.5.4 THE SPECIALIST KEEPERS RUN REGARDLESS OF PATTERN, where history put one: the
 * mine's COUNT HOUSE (the Cornish precedent), the forest's keeper's lodge, the miller's
 * house, the ferryman's cottage, the lone cottage at good isolated fishing water — while
 * SHORE FISHING CLUSTERS INTO A LANDING HAMLET, because fishermen lived at the LANDING and
 * not spread along the bank. Each is a real dwelling drawn at cottage rung.
 *
 * §5.0e THE FAUBOURG LAW is the same file's second half because it is the same question at
 * the other edge: WHERE DO THE BUILDINGS THE WALL DID NOT ENCLOSE STAND? The answer is not
 * "in a halo": growth CONCENTRATES AT THE BUSY GATES and strings along the approach roads.
 *
 * PURITY: no Date, no Math.random, no runtime trig (the frozen table only), no localeCompare.
 */

import { cosI, sinI, TRIG_N } from './trigTable.js';
import { bearingIndex, distToPolyline, pointInPolygon, rectAt } from './fabricGeometry.js';
import { hashUnit } from './fabricRng.js';
import { compareKeys } from './lineage.js';
import { isInWater } from './waterMode.js';
import { inCommons } from './commons.js';

/**
 * ⭐⭐ §16.5.3 THE TENURE SELECTOR. "Terrain (uplands and broken ground disperse; open plains
 * nucleate), safety (DANGER NUCLEATES), order/tenure and culture profile, with seeded
 * variety within historical proportions."
 *
 * The score runs 0 (wholly nucleated) → 1 (wholly dispersed) and the band is read off it, so
 * the two patterns are ends of one continuum rather than a coin flip — which is also §161f's
 * continuous-scale law applied to the countryside.
 *
 * @param {Object} args
 * @param {number} args.relief          measured substrate relief 0..1
 * @param {number} args.workableShare   share of the ground a plough can work
 * @param {boolean} args.danger         a monster-pressure / wartime state stands
 * @param {number} args.lawfulness      the §161m civic-order dial 0..1
 * @param {string} args.tier
 * @param {{seed:string|number}} args.seeding
 * @returns {{ pattern:string, score:number, reason:string }}
 */
export function tenurePattern(args) {
  const { relief, workableShare, danger, lawfulness, tier, seeding } = args;
  // TERRAIN IS THE LEAD TERM, because it is the one history is least equivocal about.
  let score = 0.18 + relief * 0.95;
  // Broken ground with little workable land disperses further: the holdings ARE apart.
  score += (1 - Math.max(0, Math.min(1, workableShare))) * 0.30;
  // ⭐ DANGER NUCLEATES, and the phenomenon has a name worth carrying: *incastellamento* —
  // the 10th–11th-century Italian gathering of a scattered countryside onto defended hills.
  if (danger) score -= 0.34;
  // A strongly ordered, tenurially organized parish holds the open-field form together; a
  // weak one lets holdings consolidate and walk out to their own land.
  score -= (lawfulness - 0.5) * 0.16;
  // The bottom of the ladder has no parish to nucleate INTO: a thorp IS a dispersed hamlet.
  if (tier === 'thorp') score += 0.22;
  // Seeded variety WITHIN the historical proportions — a band, never a re-roll of the answer.
  score += (hashUnit(`${seeding.seed}|tenure`) - 0.5) * 0.22;
  score = Math.max(0, Math.min(1, score));
  const pattern = score >= 0.5 ? 'dispersed' : 'nucleated';
  return {
    pattern,
    score: Math.round(score * 1000) / 1000,
    reason: `${pattern} (${Math.round(score * 100)}%): relief ${relief.toFixed(2)},`
      + ` workable ${workableShare.toFixed(2)}, ${danger ? 'DANGER nucleates (incastellamento)' : 'no standing danger'},`
      + ` order ${lawfulness.toFixed(2)}`,
  };
}

/**
 * §42/§43 VALUES for the habitation pass, PROPOSED WITH RATIONALE (⚠ UNSOAKED; ride the
 * tuning signature):
 *  - `carryReach` 0.62 of the arable reach — beyond about two-thirds of the walk the sheaf
 *    stopped coming home the same day, which is the historical trigger for a field shelter.
 *  - `farmsteadReach` 0.86 — the far margin where a holding earns a house of its own.
 *  - `shelterRate` / `farmsteadRate` — how many qualifying furlongs actually carry one.
 *  - `cottage` 0.62 frontages — a farmstead house at cottage rung, its barn 0.8 by 0.42.
 */
export const HABITATION = Object.freeze({
  carryReach: 0.62,
  farmsteadReach: 0.86,
  shelterRate: 0.34,
  farmsteadRate: 0.30,
  dispersedRate: 0.72,
  cottage: 0.62,
  barnLong: 0.86,
  barnDeep: 0.40,
  yardOff: 0.95,
  // ⚠ THE CAP IS PER TIER, not absolute: a thorp whose countryside carried ninety
  // farmsteads would read as a suburb of the settlement it is supposed to be an incident in.
  maxDwellings: Object.freeze({ thorp: 14, hamlet: 20, village: 28, town: 40, city: 52, metropolis: 60 }),
});

/**
 * ⭐⭐ SEAT THE COUNTRYSIDE'S DWELLINGS (§16.5.1–2).
 *
 * @param {Object} args
 * @param {any} args.fields          the §16 field layout (parcels carry `polygon`, `furlong`)
 * @param {{x:number,y:number}} args.centre
 * @param {number} args.extent
 * @param {string} args.pattern      from tenurePattern
 * @param {number} args.frontage
 * @param {any} args.sub
 * @param {any} args.water
 * @param {(x:number,y:number)=>boolean} args.inTown
 * @param {{seed:string|number}} args.seeding
 * @returns {{ dwellings:Array<any>, counts:Record<string,number>, reason:string }}
 */
export function seatWorksiteHabitation(args) {
  const { fields, centre, extent, pattern, frontage, sub, water, inTown, seeding } = args;
  /** @type {Array<any>} */ const dwellings = [];
  /** @type {Record<string,number>} */ const counts = {};
  if (!fields || !Array.isArray(fields.parcels) || !fields.parcels.length) {
    return { dwellings, counts, reason: 'no worked land: no habitation to seat' };
  }
  const reach = Math.max(1, extent * 2.6);

  // ONE ENTRY PER FURLONG, not per land: a holding is the unit a house belongs to, and a
  // land is one strip of one holding. Grouping first is what stops a furlong of nine strips
  // sprouting nine farmsteads.
  /** @type {Map<string, { x:number, y:number, n:number, key:string }>} */ const holdings = new Map();
  for (const p of fields.parcels) {
    const poly = p.polygon || p.poly;
    if (!poly || poly.length < 3) continue;
    const key = String(p.furlong == null ? p.key : p.furlong);
    let cx = 0, cy = 0;
    for (const v of poly) { cx += v[0]; cy += v[1]; }
    cx /= poly.length; cy /= poly.length;
    const h = holdings.get(key);
    if (h) { h.x += cx; h.y += cy; h.n++; } else holdings.set(key, { x: cx, y: cy, n: 1, key });
  }
  const ordered = [...holdings.values()]
    .map((h) => ({ ...h, x: h.x / h.n, y: h.y / h.n }))
    .sort((a, b) => compareKeys(a.key, b.key));

  for (const h of ordered) {
    if (dwellings.length >= capFor(args.tier)) break;
    const d = Math.sqrt((h.x - centre.x) ** 2 + (h.y - centre.y) ** 2) / reach;
    const roll = hashUnit(`${seeding.seed}|hab|${h.key}`);
    let kind = null;
    if (pattern === 'dispersed') {
      // §16.5.2 — EVERY holding carries its farmstead, at the seeded rate that keeps the
      // countryside from reading as a grid of identical steadings.
      if (roll < HABITATION.dispersedRate) kind = 'farmstead';
    } else {
      // §16.5.1 (as CURED by ODQ §194 / MF-R3 C1) — the strips carry NO dwellings; past easy
      // carry a SHELTER, and at the far margin the occasional outlying farmstead or grange.
      if (d >= HABITATION.farmsteadReach && roll < HABITATION.farmsteadRate) kind = 'grange';
      else if (d >= HABITATION.carryReach && roll < HABITATION.shelterRate) kind = 'shelter';
    }
    if (!kind) continue;
    if (inTown(h.x, h.y)) continue;
    if (isInWater(water, h.x, h.y)) continue;
    const slope = sampleSlope(sub, h.x, h.y);
    if (slope > 0.42) continue;                     // a house is not built on a scarp
    dwellings.push(makeSteading(kind, h.x, h.y, h.key, frontage, pattern, seeding));
    counts[kind] = (counts[kind] || 0) + 1;
  }

  return {
    dwellings,
    counts,
    reason: pattern === 'dispersed'
      ? `§16.5.2 DISPERSED: ${counts.farmstead || 0} farmsteads on their own holdings — house, barn and yard`
        + ' ON the land, the enclosed/upland form; TRUE field barns belong to this side and only this side'
      : `§16.5.1 NUCLEATED: the strips carry no dwellings (the open-field form's whole logic) —`
        + ` ${counts.shelter || 0} field shelters past easy carry and ${counts.grange || 0} outlying farmsteads/granges`
        + ' at the far margin; the barns stand in the village tofts because the harvest came home (ODQ §194 / MF-R3 C1)',
  };
}

/**
 * ⭐ §16.5.4 THE SPECIALIST KEEPERS. Each worksite that history gave a resident keeper gets
 * one, REGARDLESS of the tenure pattern — and the shore-fishing case is the anti-sprawl rule
 * the audit singled out: fishermen lived at the LANDING, so shore fishing produces a landing
 * HAMLET rather than cottages spread along the bank.
 *
 * @param {Object} args
 * @param {Array<any>} args.landmarks   the seated institutions (the worksites)
 * @param {number} args.frontage
 * @param {any} args.water
 * @param {(x:number,y:number)=>boolean} args.inTown
 * @param {{seed:string|number}} args.seeding
 * @returns {{ dwellings:Array<any>, counts:Record<string,number>, reason:string }}
 */
export function seatKeepers(args) {
  const { landmarks, frontage, water, inTown, seeding } = args;
  /** @type {Array<any>} */ const dwellings = [];
  /** @type {Record<string,number>} */ const counts = {};
  const ordered = landmarks.slice().sort((a, b) => compareKeys(String(a.instanceKey), String(b.instanceKey)));
  for (const lm of ordered) {
    const spec = KEEPER_OF[lm.archetype];
    if (!spec) continue;
    // A worksite INSIDE the town needs no resident keeper — the miller who lives over his
    // own mill in the middle of a town is simply a townsman, and his house is fabric.
    if (inTown(lm.x, lm.y)) continue;
    if (spec.cluster) {
      // ⭐ THE LANDING HAMLET: a small cluster at the worksite, never a ribbon along the bank.
      const n = 2 + Math.floor(hashUnit(`${seeding.seed}|landing|${lm.instanceKey}`) * 3);
      for (let i = 0; i < n; i++) {
        const a = Math.floor(hashUnit(`${seeding.seed}|landing|${lm.instanceKey}|${i}|a`) * TRIG_N);
        const r = lm.size * (1.5 + hashUnit(`${seeding.seed}|landing|${lm.instanceKey}|${i}|r`) * 1.4);
        const x = lm.x + cosI(a) * r, y = lm.y + sinI(a) * r;
        if (isInWater(water, x, y)) continue;
        dwellings.push(makeSteading('cottage', x, y, `${lm.instanceKey}|landing|${i}`, frontage, 'keeper', seeding));
        counts.landing = (counts.landing || 0) + 1;
      }
      continue;
    }
    const a = Math.floor(hashUnit(`${seeding.seed}|keeper|${lm.instanceKey}`) * TRIG_N);
    const r = lm.size * 1.55;
    const x = lm.x + cosI(a) * r, y = lm.y + sinI(a) * r;
    if (isInWater(water, x, y)) continue;
    dwellings.push(makeSteading('cottage', x, y, `${lm.instanceKey}|keeper`, frontage, 'keeper', seeding, spec.name));
    counts[spec.name] = (counts[spec.name] || 0) + 1;
  }
  const named = Object.keys(counts).sort().map((k) => `${counts[k]} ${k}`).join(', ');
  return {
    dwellings,
    counts,
    reason: named
      ? `§16.5.4 the specialist keepers: ${named} — each a real dwelling at cottage rung beside its worksite`
      : '§16.5.4: no outlying worksite on this leaf earns a resident keeper',
  };
}

/**
 * WHICH ARCHETYPES HISTORY GAVE A RESIDENT KEEPER, and what he is called. The names are
 * labels; the LAW is the function (§3's culture-neutral clause — an overseer's dwelling at a
 * mine is cross-cultural, "count house" is the Cornish instance of it).
 */
export const KEEPER_OF = Object.freeze({
  mill: { name: "miller's house" },
  extraction: { name: 'count house' },              // the mine's overseer dwelling
  kiln: { name: "kilnman's cottage" },
  waystation: { name: "keeper's lodge" },
  port: { name: 'landing hamlet', cluster: true },  // shore fishing clusters at the LANDING
});

/** A steading: a house, and for a farmstead a barn across its yard. */
function makeSteading(kind, x, y, key, frontage, pattern, seeding, label) {
  const a = Math.floor(hashUnit(`${seeding.seed}|stead|${key}|a`) * TRIG_N);
  const s = frontage * HABITATION.cottage * (kind === 'shelter' ? 0.62 : 1);
  /** @type {Array<Array<[number,number]>>} */ const solids = [rectAt(x, y, s * 1.15, s * 0.85, a)];
  // ⭐ ONLY THE DISPERSED SIDE GETS A BARN (ODQ §194 / MF-R3 C1). A grange is a distant
  // demesne farm and carries one too — it IS a farmstead, by a monastic landlord.
  if (kind === 'farmstead' || kind === 'grange') {
    const off = frontage * HABITATION.yardOff;
    solids.push(rectAt(
      x + cosI(a + TRIG_N / 4) * off, y + sinI(a + TRIG_N / 4) * off,
      frontage * HABITATION.barnLong, frontage * HABITATION.barnDeep, a,
    ));
  }
  return {
    key: `hab|${key}`, kind, x, y, rot: a, size: s, solids,
    label: label || kind,
    pattern,
  };
}

/** The countryside-dwelling cap for a tier. */
function capFor(tier) {
  const c = HABITATION.maxDwellings;
  return c[tier] == null ? c.village : c[tier];
}

function sampleSlope(sub, x, y) {
  if (!sub || !sub.slope) return 0;
  let i = Math.floor(x / sub.cell), j = Math.floor(y / sub.cell);
  if (i < 0) i = 0; else if (i >= sub.n) i = sub.n - 1;
  if (j < 0) j = 0; else if (j >= sub.n) j = sub.n - 1;
  return sub.slope[j * sub.n + i];
}

/**
 * ⭐⭐⭐ §5.0e THE FAUBOURG LAW (owner order §190d: "establishments outside a walled area…
 * most additions simply crowd around the wall and expand outward").
 *
 * ⛔ THE DEFAULT FAILURE THIS LAW EXISTS TO FORBID IS THE HALO. A suburb modelled as "some
 * buildings outside the wall" spreads evenly around the circuit, which is exactly what no
 * real walled town ever looked like: growth CONCENTRATED AT THE BUSY GATES and strung along
 * the approach roads, because that is where the traffic, the custom and the carts were. So
 * the derivation is gate-first by construction — every faubourg building belongs to a gate
 * and stands on that gate's road — and the check the chair asked for (does the render show
 * gate-crowding rather than halo sprawl?) is a measurable property of the output.
 *
 * ⭐⭐ AND THE WALL-FOOT TELL IS THE CHEAPEST ONE-GLANCE ORDER READ ON THE PAGE (§5.0e.3).
 * A militarily serious town keeps its glacis CLEAR — open ground before the stones. A lax,
 * poor or long-peaceful one lets lean-tos and stalls accrete against the wall itself. One
 * look at the wall foot tells the reader whether anyone still expects a siege.
 *
 * ⭐ §18.2 THE EXTRAMURAL INN BELT rides here as an anchor class: hospitality attracts the
 * gate's OUTSIDE face as strongly as its inside, because arrivals after curfew slept out.
 *
 * @param {Object} args
 * @param {Array<any>} args.walls
 * @param {Array<any>} args.channels
 * @param {any} args.umbrella
 * @param {number} args.frontage
 * @param {number} args.lawfulness
 * @param {number} args.prosperityRank
 * @param {any} args.sub
 * @param {any} args.water
 * @param {(x:number,y:number)=>boolean} args.forbidden
 * @param {{seed:string|number}} args.seeding
 * @returns {{ buildings:Array<any>, leanTos:Array<any>, gates:number, glacisClear:boolean, reason:string }}
 */
/** ⭐ §200/§5.0e.3 ONE THRESHOLD, ONE READING. The wall band's glacis and the wall-foot tell
 *  are the SAME decision seen from two sides, so the number is exported rather than restated:
 *  a band that reserved a glacis on a wall that carries lean-tos would refuse the lean-tos it
 *  is supposed to license. */
export const GLACIS_THRESHOLD = 0.52;
export function faubourgSeriousness(lawfulness, prosperityRank) {
  return lawfulness * 0.72 + Math.max(0, Math.min(1, prosperityRank / 5)) * 0.28;
}

export function buildFaubourgs(args) {
  const {
    walls, channels, umbrella, frontage, lawfulness, prosperityRank, sub, water, seeding,
  } = args;
  // ⭐⭐ THE FAUBOURG BUILDS ITS OWN REFUSAL PREDICATE, AND IT IS HERE BECAUSE THE QUESTION IS
  // HERE. MF-B5 handed this law the packer's `forbiddenGround`, which refuses everything
  // OUTSIDE the umbrella — its job for the packer — so a law whose entire subject is the
  // ground outside the wall refused every faubourg building on every leaf. ⭐ THE CLASS: A
  // PREDICATE NAMED "FORBIDDEN" ENCODES ONE STAGE'S QUESTION, and a later stage asking a
  // DIFFERENT question must not borrow it. The faubourg's own refusals are the carriageway,
  // the common and the compound — never the town's outline, which is the thing it is defined
  // as being beyond. Owning the predicate is what keeps that true by construction.
  const compounds = args.compounds || [];
  const forbidden = args.forbidden || ((x, y) => {
    if (inCommons(args.commons || [], x, y, 0)) return true;
    for (const c of compounds) {
      const dx = x - c.x, dy = y - c.y;
      if (dx * dx + dy * dy < c.r * c.r) return true;
    }
    for (const ch of (channels || [])) if (distToPolyline(x, y, ch.line) < ch.width * 0.5) return true;
    return false;
  });
  /** @type {Array<any>} */ const buildings = [];
  /** @type {Array<any>} */ const leanTos = [];
  /** §15.6: every refusal is reported. @type {Record<string,number>} */ const refused = {};
  const refuse = (why) => { refused[why] = (refused[why] || 0) + 1; };
  if (!walls || !walls.length) {
    return { buildings, leanTos, gates: 0, glacisClear: true, reason: 'unwalled: §5.0e does not apply — the fabric simply ends' };
  }

  // ── THE WALL-FOOT TELL (§5.0e.3). ORDER LEGISLATES IT, poverty and peace pull the other
  //    way. The threshold is a single comparison so the tell can never be half true.
  const seriousness = faubourgSeriousness(lawfulness, prosperityRank);
  const glacisClear = seriousness >= GLACIS_THRESHOLD;

  /** @type {Array<{x:number,y:number,dx:number,dy:number,ring:any}>} */ const gates = [];
  for (const ring of walls) for (const g of (ring.gates || [])) if (!g.bricked) gates.push({ ...g, ring });
  gates.sort((a, b) => compareKeys(`${Math.round(a.x)}|${Math.round(a.y)}`, `${Math.round(b.x)}|${Math.round(b.y)}`));

  // ⛔ THE GATE'S OWN IDENTITY JOINS EVERY KEY IT MINTS. Two gates can sit on ONE road (the
  // high street leaves a circuit twice), so keying a faubourg on the ROAD alone mints the
  // same key at both ends — MEASURED as four self-overlapping lean-to pairs on the city and
  // the metropolis, which is a duplicate identity showing up as a geometry defect. ⭐ THE
  // CLASS: A KEY THAT OMITS ONE OF THE FACTS THAT PRODUCED THE THING IS NOT AN IDENTITY, and
  // the §11.0 inertia law rests on these keys as hard as the census does.
  for (let gi = 0; gi < gates.length; gi++) {
    const g = gates[gi];
    // ⚠ THE ORDINAL JOINS THE COORDINATE. Two RINGS (a citadel inside a circuit, a
    // metropolis's old core inside its new) can carry gates that round to the same station,
    // so the coordinate alone is not unique — and a duplicate key renders one body twice and
    // reds the disjointness census against ITSELF, which is how this was found.
    const gateId = `${gi}@${Math.round(g.x)},${Math.round(g.y)}`;
    // THE GATE'S OWN ROAD. A faubourg strings along the approach, so the road IS the spine —
    // and a gate with no road outside it grows nothing, which is the correct answer for a
    // postern.
    const road = approachOf(g, channels, umbrella, frontage);
    if (!road) continue;
    // ⭐ THE GATE'S TRAFFIC SETS ITS FAUBOURG'S SIZE (§5.0e.2: "seeded by the gate's
    // traffic"), and traffic is the road's own rank — the market gate grows the market
    // faubourg because the market road is the wide one.
    const traffic = RANK_TRAFFIC[road.rank] == null ? 0.4 : RANK_TRAFFIC[road.rank];
    const depth = frontage * FAUBOURG.depthFrontages * (0.55 + traffic);
    const count = Math.round(FAUBOURG.perGate * traffic * (0.6 + hashUnit(`${seeding.seed}|faub|${road.key}`) * 0.8));
    for (let i = 0; i < count; i++) {
      const k = `${seeding.seed}|faub|${gateId}|${road.key}|${i}`;
      // Along the road, from the gate outward — never a ring around the town.
      const t = FAUBOURG.startFrontages * frontage + (i / Math.max(1, count - 1)) * depth
        + (hashUnit(`${k}|t`) - 0.5) * frontage * 1.4;
      const at = marchFromGate(road.line, road.gateS, road.outward, road.mouth + t);
      if (!at) { refuse('road ran out'); continue; }
      // Either side of the road, at a plot's own setback — a ribbon has two frontages.
      const side = hashUnit(`${k}|s`) < 0.5 ? 1 : -1;
      const nx = -at.dy * side, ny = at.dx * side;
      // ⛔ THE SETBACK IS FROM THE KERB, NOT FROM THE CENTRELINE. Offsetting by a frontage
      // from the ROAD'S AXIS puts a plot inside the carriageway of any road wider than two
      // frontages — which is every approach road worth growing a faubourg on. MEASURED: 9 of
      // 22 town candidates refused as "in a carriageway" by the very road they front.
      const off = road.width * 0.5 + frontage * (0.42 + hashUnit(`${k}|o`) * 0.55);
      const x = at.x + nx * off, y = at.y + ny * off;
      if (forbidden(x, y)) { refuse('carriageway, common or compound'); continue; }
      if (isInWater(water, x, y)) { refuse('in the water'); continue; }
      if (sampleSlope(sub, x, y) > 0.46) { refuse('too steep'); continue; }
      if (insideAnyRing(umbrella.components, x, y)) { refuse('already built fabric'); continue; }
      const rot = bearingIndex(at.dx, at.dy);
      // ⭐⭐ §18.2 THE EXTRAMURAL INN BELT (ODQ §194's second adopted rich). "Inns and stables
      // concentrate OUTSIDE the gates serving arrivals after curfew… hospitality attracts the
      // gate's OUTSIDE face as strongly as its inside." The belt is the FIRST TWO buildings
      // on every approach — the ones a traveller reaches before the gate closes — and an inn
      // is a bigger body than a cottage because it is a hall with a yard behind it.
      // ⚠ WHAT THIS IS **NOT**: it does not relocate a truth-layer hospitality INSTITUTION.
      // §8.1 says every institution keeps its anchor, and moving a seated one outside the
      // wall is a SEATING decision with its own affinity bill (seating.js's weight table) —
      // named in the receipt as a clean seam rather than done in passing here. What the belt
      // expresses is the ANONYMOUS hospitality fabric the law describes, which is what the
      // reference plates actually show at a gate.
      const inn = i < 2 && traffic >= 0.5;
      const w = frontage * (inn ? 1.55 + hashUnit(`${k}|w`) * 0.5 : 0.72 + hashUnit(`${k}|w`) * 0.5);
      const d = frontage * (inn ? 0.95 + hashUnit(`${k}|d`) * 0.4 : 0.62 + hashUnit(`${k}|d`) * 0.7);
      buildings.push({
        key: `faubourg|${gateId}|${road.key}|${i}`,
        gate: gateId, x, y, rot,
        kind: inn ? 'inn' : 'house',
        // The stable yard behind the inn — drawn as an enclosure, never as a building, so it
        // adds no filled body and the §195.0 census sees exactly what it should.
        yard: inn ? rectAt(x + (-at.dy * side) * d * 1.15, y + (at.dx * side) * d * 1.15, w * 0.92, d * 1.25, rot) : null,
        polygon: rectAt(x, y, w, d, rot),
        tone: hashUnit(`${k}|tone`),
      });
    }

    // ⭐⭐ THE LEAN-TOS (§5.0e.3). Only where the glacis is NOT kept clear. They stand ON the
    // outer wall face — that is the whole tell — so they are derived from the wall polygon
    // rather than from the road.
    if (!glacisClear) {
      const ring = g.ring;
      const n = Math.round(FAUBOURG.leanTosPerGate * (1 - seriousness));
      for (let i = 0; i < n; i++) {
        const k = `${seeding.seed}|lean|${gateId}|${road.key}|${i}`;
        const idx = Math.floor(hashUnit(`${k}|i`) * ring.polygon.length);
        const a = ring.polygon[idx], b = ring.polygon[(idx + 1) % ring.polygon.length];
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const l = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / l, uy = dy / l;
        // Outward: away from the umbrella's own body.
        let nx = -uy, ny = ux;
        if (insideAnyRing(umbrella.components, a[0] + nx * frontage, a[1] + ny * frontage)) { nx = -nx; ny = -ny; }
        const t = hashUnit(`${k}|t`);
        const px = a[0] + dx * t, py = a[1] + dy * t;
        const dpt = frontage * (0.34 + hashUnit(`${k}|d`) * 0.30);
        const wid = frontage * (0.42 + hashUnit(`${k}|w`) * 0.40);
        // ⭐⭐ §200.2 THE ABUTTING VARIANT, SPELLED AS AN ABUTMENT. The first spelling put the
        // lean-to's centre half its own depth from the wall's CENTRELINE, so its inner half
        // stood inside the stones — MEASURED, 13 lean-tos in the wall band at the city, 3 at
        // the metropolis. A lean-to leans on the wall's OUTER FACE: it starts where the
        // masonry ends. The face comes from the circuit's own published band, so a heavier
        // circuit pushes its lean-tos further out without anybody re-tuning anything.
        const face = (ring.bandParts ? ring.bandParts.stone : 0) / 2;
        const cx = px + nx * (face + dpt * 0.5), cy = py + ny * (face + dpt * 0.5);
        if (isInWater(water, cx, cy)) continue;
        leanTos.push({
          key: `lean|${gateId}|${road.key}|${i}`,
          x: cx, y: cy,
          // A lean-to takes the WALL's angle, because it is leaning on it.
          polygon: rectAt(cx, cy, wid, dpt, bearingIndex(ux, uy)),
        });
      }
    }
  }

  return {
    buildings,
    leanTos,
    gates: gates.length,
    glacisClear,
    refused,
    inns: buildings.filter((b) => b.kind === 'inn').length,
    reason: `§5.0e ${buildings.length} faubourg buildings strung on ${gates.length} gates' approach roads`
      + ` (§18.2: ${buildings.filter((b) => b.kind === 'inn').length} of them the INN BELT — the first`
      + ` bodies on each busy approach, drawn at hall size with a stable yard behind)`
      + ` (refused: ${Object.keys(refused).sort().map((k) => `${refused[k]} ${k}`).join(', ') || 'none'})`
      + ` (gate-concentrated by construction — never a halo);`
      + (glacisClear
        ? ` THE WALL FOOT IS CLEAR (seriousness ${seriousness.toFixed(2)} ≥ ${GLACIS_THRESHOLD}) — this town still expects a siege`
        : ` ${leanTos.length} LEAN-TOS accrete against the outer wall face (seriousness ${seriousness.toFixed(2)}) — nobody here expects a siege`),
  };
}

/** §42/§43 VALUES for the faubourg, PROPOSED WITH RATIONALE. ⚠ UNSOAKED. */
export const FAUBOURG = Object.freeze({
  // The glacis threshold: a town at or above this on the order×wealth read keeps its foot
  // clear. Set at the middle of the dial so both readings occur across a real corpus.
  glacisThreshold: 0.52,
  perGate: 16,
  depthFrontages: 13,
  startFrontages: 1.8,
  // ⚠ RE-MEASURED UNDER THE RATION LAW (§9.3). At 9 per gate the coastal city's eight gates
  // put the leaf 60 primitives OVER the 2,200 op ceiling — and the ration law's own answer is
  // that an ACCENT gives way, never a building or a street. A lean-to is the smallest mark on
  // the page and it still tells its story at 5: the wall foot either has sheds against it or
  // it does not, and that is a BINARY read, not a count.
  leanTosPerGate: 5,
});

/** How much traffic a rank carries, as the faubourg's own size multiplier. */
const RANK_TRAFFIC = Object.freeze({ high: 1.0, artery: 0.86, seam: 0.5, quarter: 0.42, blockLane: 0.2, blockCross: 0.16, alley: 0.1 });

/** The road that leaves a gate: the channel passing nearest it, preferring the widest. */
function approachOf(g, channels, umbrella, frontage) {
  let best = null, bestScore = Infinity;
  for (const ch of channels) {
    if (ch.rank === 'passage' || ch.rank === 'alley') continue;
    const d = distToPolyline(g.x, g.y, ch.line);
    if (d > frontage * 3.5) continue;
    const traffic = RANK_TRAFFIC[ch.rank] == null ? 0.4 : RANK_TRAFFIC[ch.rank];
    const score = d - traffic * frontage * 3;
    if (score < bestScore) {
      bestScore = score;
      // ⛔ THE FAUBOURG MARCHES FROM THE GATE, NOT FROM THE END OF THE ROAD — and the first
      // spelling did the second, which is why it grew nothing. A high street runs THROUGH a
      // town, so BOTH its ends are outside the umbrella; marching a dozen frontages from
      // whichever end was nearer put the whole faubourg out in the fields, where the
      // umbrella test then refused nothing and the plots simply landed nowhere near a gate.
      // ⭐ THE GATE'S ARCLENGTH ON ITS OWN ROAD IS THE ORIGIN, and the outward SIGN is
      // decided by stepping a frontage each way and asking which step leaves the town.
      const gateS = arclengthAt(ch.line, g.x, g.y);
      const fwd = marchFromGate(ch.line, gateS, 1, frontage * 2);
      const outward = fwd && !insideAnyRing(umbrella.components, fwd.x, fwd.y) ? 1 : -1;
      // ⭐⭐ THE FAUBOURG BEGINS WHERE THE BUILT FABRIC ENDS, NOT AT THE GATE ARCH. By the
      // time a town has a wall its own umbrella usually reaches past it (the suburb the
      // packer already cut), so starting at the gate spends the whole ribbon on ground that
      // is already built — MEASURED, 3 of 32 candidates survived on the riverside town.
      // Walking OUT along the gate's own road until it leaves the umbrella gives the ribbon
      // the empty approach it is a fact about.
      let mouth = 0;
      for (let step = 0; step < 30; step++) {
        const at = marchFromGate(ch.line, gateS, outward, step * frontage);
        if (!at) break;
        if (!insideAnyRing(umbrella.components, at.x, at.y)) { mouth = step * frontage; break; }
      }
      best = {
        line: ch.line, rank: ch.rank, width: ch.width,
        key: ch.key || `${ch.rank}@${Math.round(g.x)},${Math.round(g.y)}`,
        gateS, outward, mouth,
      };
    }
  }
  return best;
}

/** The arclength along a polyline of the point nearest (px,py) — the gate's own station. */
function arclengthAt(line, px, py) {
  let acc = 0, best = 0, bd = Infinity;
  for (let i = 0; i + 1 < line.length; i++) {
    const ax = line[i][0], ay = line[i][1];
    const dx = line[i + 1][0] - ax, dy = line[i + 1][1] - ay;
    const L = dx * dx + dy * dy;
    const l = Math.sqrt(L);
    let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    const d = Math.sqrt((px - ax - dx * t) ** 2 + (py - ay - dy * t) ** 2);
    if (d < bd) { bd = d; best = acc + l * t; }
    acc += l;
  }
  return best;
}

/** March `t` units OUTWARD from the gate's own station, returning position and direction. */
function marchFromGate(line, gateS, sign, t) {
  const target = gateS + sign * t;
  let acc = 0;
  for (let i = 0; i + 1 < line.length; i++) {
    const dx = line[i + 1][0] - line[i][0], dy = line[i + 1][1] - line[i][1];
    const l = Math.sqrt(dx * dx + dy * dy);
    if (l < 1e-9) continue;
    if (acc + l >= target) {
      const u = Math.max(0, (target - acc) / l);
      return { x: line[i][0] + dx * u, y: line[i][1] + dy * u, dx: (dx / l) * sign, dy: (dy / l) * sign };
    }
    acc += l;
  }
  return null;
}

function insideAnyRing(rings, x, y) {
  for (const r of rings) if (pointInPolygon(x, y, r)) return true;
  return false;
}
