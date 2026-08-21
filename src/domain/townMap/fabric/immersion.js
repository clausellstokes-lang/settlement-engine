/**
 * domain/townMap/fabric/immersion.js — §12 THE IMMERSION SUITE, the DERIVED half.
 *
 * ⭐⭐ THE SPLIT THIS MODULE IS ONE HALF OF (§173, the lettering splice). Everything §12 adds
 * to a finished leaf is either a MARK (geometry: a device, a ring, a ghost, an event glyph)
 * or a LETTER (text: a note, a name, a date). The marks derive here, from settlement facts
 * and the §11.12a measure; the letters are laid out in `lettering.js` over the FINISHED draw
 * list, because text placement is the one decision that cannot be made until everything else
 * on the page exists. `injectFog`'s precedent is the shape: a pure fragment, spliced before
 * the closing tag, byte-identity preserved when the fragment is empty.
 *
 * ⭐ EVERY MARK CITES ITS SOURCE OR IS NOT DRAWN (§8.2, and §11.10 under time: "every drift
 * mark cites its event-log entry or is cut"). Each returned mark therefore carries a `cite`
 * — the typed identity of the fact that produced it — and the ration drops marks with no
 * citation before it drops anything else.
 *
 * ⛔ THE EVENT RECORD CARRIES NO ID AT HEAD, so the citation key is DERIVED from the event's
 * own typed fields (`yearsAgo|type|name`) and is stable under the inertia law exactly
 * because those three are what the generator wrote. ⚠ A landing executor that later mints a
 * real event id must switch `eventCite` to it and re-record; the derived key is a declared
 * bridge, not a design.
 *
 * PURITY: pure functions over the fabric and the settlement record. No Date, no Math.random,
 * no runtime trig (the frozen table only), no Math.pow.
 */

import { hashUnit } from './fabricRng.js';
import { cosI, sinI, TRIG_N, bearingIndex, centroid } from './fabricGeometry.js';
import { walkRings } from './measure.js';

/** The tier's ration of immersion marks. §9.3's accent law applied to chrome — §12's own
 *  clause says chrome is not exempt from the ration. */
export const IMMERSION_RATION = Object.freeze({
  thorp: { notes: 1, marks: 1 }, hamlet: { notes: 2, marks: 2 }, village: { notes: 2, marks: 2 },
  town: { notes: 3, marks: 3 }, city: { notes: 4, marks: 4 }, metropolis: { notes: 5, marks: 5 },
});

/**
 * ⭐ THE NOTE-LIFESPAN LAW (§12.1, MF-R2's inertia-compatible ration). A note lives for a
 * derived span from its event; the year-Y leaf shows the notes whose window contains Y.
 * NEVER a per-year top-K, which would churn every leaf annually on unchanged facts.
 *
 * SEVERITY sets the span because the span is a fact about the EVENT — a sack is remembered
 * for centuries and a bad harvest for a generation. TIER scales it DOWN because a great
 * city's document has more history competing for the same margin: the metropolis's minor
 * scandal is a footnote within a lifetime, the thorp's one fire is its whole story.
 * §42/§43 VALUES, PROPOSED-WITH-RATIONALE. ⚠ UNSOAKED; rides the tuning signature.
 */
export const NOTE_LIFESPAN = Object.freeze({ catastrophic: 260, major: 130, minor: 60 });
export const TIER_MEMORY = Object.freeze({
  thorp: 1.6, hamlet: 1.45, village: 1.3, town: 1.0, city: 0.82, metropolis: 0.68,
});

/**
 * The typed identity of a historical event — the citation every note and mark carries.
 *
 * ⛔⛔ IT IS KEYED ON THE EVENT'S ABSOLUTE YEAR, NOT ON `yearsAgo`, AND THE FIRST SPELLING GOT
 * THIS WRONG IN THE MOST INSTRUCTIVE WAY AVAILABLE. `yearsAgo` is measured FROM NOW, so under
 * a §11.11 snapshot the SAME EVENT carries a DIFFERENT citation in every year — the sack of
 * year 50 cites as `event:150` on the present leaf and `event:10` on the year-60 leaf. The
 * §11.0 inertia arm caught it immediately: two years with an identical event horizon produced
 * different citation sets, so the annotation appeared to churn on facts that had not moved.
 * ⭐ THE CLASS, and it is the third member of one family this lane kept meeting:
 * **AN IDENTITY MEASURED FROM THE OBSERVER IS NOT AN IDENTITY.** The year since founding is
 * absolute and the event carries it forever.
 * @param {{year:number, type?:string, name?:string}} ev
 */
export function eventCite(ev) {
  return `event:${ev.year}|${String(ev.type || 'unknown')}|${String(ev.name || '')}`;
}

/**
 * Every dated event the settlement carries, as {year, yearsAgo, type, name, severity, cite}.
 * `year` is YEARS SINCE FOUNDING, which is the only year axis the record actually supports:
 * `history.age` and `yearsAgo` are both present and both typed, and nothing at head carries
 * an absolute calendar. Declared rather than invented.
 */
export function datedEvents(settlement) {
  const h = (settlement && settlement.history) || {};
  const age = Number.isFinite(h.age) ? h.age : 0;
  const raw = Array.isArray(h.historicalEvents) ? h.historicalEvents : [];
  const out = [];
  for (const ev of raw) {
    if (!ev || !Number.isFinite(ev.yearsAgo)) continue;
    const year = age - ev.yearsAgo;
    out.push({
      year,
      yearsAgo: ev.yearsAgo,
      type: String(ev.type || 'unknown'),
      name: String(ev.name || ''),
      severity: String(ev.severity || 'minor'),
      description: String(ev.description || ''),
      cite: eventCite({ year, type: ev.type, name: ev.name }),
    });
  }
  // Oldest first — a stable order that is also the reading order of a chronicle.
  out.sort((a, b) => (a.year - b.year) || (a.cite < b.cite ? -1 : a.cite > b.cite ? 1 : 0));
  return { age, events: out };
}

/**
 * §12.1 — the notes ALIVE at year Y, rationed, each citing its event.
 * @returns {{ notes: Array<{cite:string, year:number, text:string, severity:string, lifespan:number}>, reason:string }}
 */
export function marginalia({ settlement, tier, year }) {
  const { age, events } = datedEvents(settlement);
  const Y = Number.isFinite(year) ? year : age;
  const memory = TIER_MEMORY[tier] == null ? 1 : TIER_MEMORY[tier];
  const ration = (IMMERSION_RATION[tier] || IMMERSION_RATION.town).notes;
  const alive = [];
  for (const ev of events) {
    // TIME-CORRECTNESS: a note may quote only events that have happened (§12.1).
    if (ev.year > Y) continue;
    const lifespan = Math.round((NOTE_LIFESPAN[ev.severity] == null ? NOTE_LIFESPAN.minor
      : NOTE_LIFESPAN[ev.severity]) * memory);
    if (Y > ev.year + lifespan) continue;
    alive.push({ ...ev, lifespan });
  }
  // The ration keeps the GRAVEST first, then the most recent — a margin with room for three
  // notes shows the sack and the fire, not three consecutive bad harvests.
  const rank = { catastrophic: 0, major: 1, minor: 2 };
  alive.sort((a, b) => ((rank[a.severity] == null ? 3 : rank[a.severity]) - (rank[b.severity] == null ? 3 : rank[b.severity]))
    || (b.year - a.year) || (a.cite < b.cite ? -1 : 1));
  const kept = alive.slice(0, ration);
  // Back into chronicle order for reading.
  kept.sort((a, b) => (a.year - b.year) || (a.cite < b.cite ? -1 : 1));
  return {
    notes: kept.map((ev) => ({
      cite: ev.cite,
      year: ev.year,
      severity: ev.severity,
      lifespan: ev.lifespan,
      text: `${ev.name.toUpperCase()} · IN THE YEAR ${ev.year} OF THIS PLACE`,
    })),
    reason: `§12.1 marginalia: ${events.length} dated events, ${alive.length} still within their `
      + `lifespan at year ${Y} (severity × ${memory} tier memory), ${kept.length} kept by the ${tier} ration of ${ration}`,
  };
}

/**
 * ⭐ §12.4 DERIVED HERALDRY — the settlement's own device, from its own facts.
 *
 * ⛔⛔ CULTURE-NEUTRAL BY CONSTRUCTION, AND THIS IS A HARD BOUNDARY RATHER THAN A PREFERENCE.
 * The charge vocabulary below is NATURAL AND OCCUPATIONAL ONLY — water, height, grain, fish,
 * ore, timber, the wheel, the tower. There is no cross, crescent, star, eye or any other
 * mark that reads as a faith or as one people's tradition: §3's setting-agnosticism and the
 * DEITY DOCTRINE (faith is culture, never theology) both forbid baking one culture's
 * ornament into every settlement's arms. A device says what the place LIVES BY.
 */
export const CHARGES = Object.freeze({
  wave: 'a bar wavy — the water it stands on',
  peak: 'a peak — the height it holds',
  sheaf: 'a sheaf — the grain it grows',
  fish: 'a fish — the water it eats from',
  wheel: 'a wheel — the road and the mill',
  pick: 'a pick — the ore beneath it',
  tree: 'a tree — the wood it cuts',
  tower: 'a tower — the wall it keeps',
});

/**
 * @returns {{ field:string, charges:string[], blazon:string, cite:string[], reason:string }}
 */
export function deriveHeraldry({ settlement, meta, seeding }) {
  const key = `${String(seeding.seed)}|arms${seeding.variant ? `|v${seeding.variant}` : ''}`;
  const res = (settlement && settlement.resourceAnalysis && Array.isArray(settlement.resourceAnalysis.availableResources))
    ? settlement.resourceAnalysis.availableResources.map((r) => String(r)) : [];
  const has = (re) => res.some((r) => re.test(r));
  /** @type {Array<{k:string, w:number, cite:string}>} */ const cands = [];
  // WATER first, because a settlement's relationship to water is the fact that shapes it
  // most (the §5.0b mode is a whole law of its own).
  if (meta.waterMode && meta.waterMode !== 'dry') cands.push({ k: 'wave', w: 6, cite: `meta.waterMode=${meta.waterMode}` });
  if (meta.relief > 0.42) cands.push({ k: 'peak', w: 5, cite: `meta.relief=${meta.relief.toFixed(2)}` });
  if (has(/fish/)) cands.push({ k: 'fish', w: 5, cite: 'resourceAnalysis.availableResources~fish' });
  if (has(/ore|iron|copper|tin|silver|gold|precious_metals|gems|coal/)) cands.push({ k: 'pick', w: 4, cite: 'resourceAnalysis.availableResources~ore' });
  if (has(/grain|wheat|barley|rye|flour/)) cands.push({ k: 'sheaf', w: 4, cite: 'resourceAnalysis.availableResources~grain' });
  if (has(/timber|wood|grove|forest/)) cands.push({ k: 'tree', w: 3, cite: 'resourceAnalysis.availableResources~timber' });
  if (has(/trade_access|crossroads|caravan/)) cands.push({ k: 'wheel', w: 3, cite: 'resourceAnalysis.availableResources~trade' });
  if (meta.hasWalls) cands.push({ k: 'tower', w: 2, cite: 'meta.hasWalls' });
  // §8.2: a settlement whose facts say nothing gets NO arms rather than an invented one.
  if (!cands.length) {
    return { field: 'plain', charges: [], blazon: '', cite: [], reason: '§12.4: no sourced fact earns a charge — this settlement bears no device' };
  }
  cands.sort((a, b) => (b.w - a.w) || (a.k < b.k ? -1 : 1));
  const charges = cands.slice(0, 2).map((c) => c.k);
  // The FIELD DIVISION is the one seeded degree of freedom — it carries no meaning, so a
  // hash may choose it, exactly as the fabric's tone jitter may.
  const FIELDS = ['plain', 'perFess', 'perPale', 'perBend'];
  const field = charges.length > 1 ? FIELDS[1 + Math.floor(hashUnit(`${key}|field`) * 3)] : 'plain';
  return {
    field,
    charges,
    blazon: charges.map((c) => CHARGES[c]).join('; '),
    cite: cands.slice(0, 2).map((c) => c.cite),
    reason: `§12.4 heraldry: ${charges.length} charge(s) from ${cands.length} sourced facts, field ${field} (seeded; a division carries no meaning)`,
  };
}

/**
 * ⭐ §12.3 THE WALK-SCALE RINGS, over the countryside, MEASURED FROM THE TOWN'S EDGE.
 *
 * ⚠ THE CHARTER SAYS "from the gates" AND THIS DRAWS FROM THE EDGE — a declared reading with
 * a reason. A ring struck from each gate would give a walled city eight overlapping circles
 * and a wall-less village none at all; the quantity the reader wants is "how far is that
 * from the town", and the town's edge is where the walking starts whether or not a gate
 * stands there. The rung's own radius is added to the built radius, so the mark stands at
 * one rung's walk BEYOND the last house.
 * @returns {{ rings:Array<{metres:number, r:number, label:string}>, reason:string }}
 */
export function deriveWalkRings({ measure, meta, view = 1000 }) {
  const edge = meta.builtRadius;
  // ⚠ THE CAP IS 0.66 OF THE FRAME, NOT ITS HALF-WIDTH, AND THE REASON IS THAT A RANGE
  // CIRCLE IS ALLOWED TO RUN OFF THE SHEET. A ring larger than the frame's half-width still
  // crosses the leaf as four corner arcs, which is exactly how a period itinerary circle
  // reads on a bounded plate; refusing it would have left the town, the city and the
  // metropolis with no range mark at all for the sake of a completeness nobody drew.
  const reach = view * 0.66 - edge;
  if (reach <= 0) {
    return { rings: [], reason: '§12.3: the built extent fills the frame — no countryside is left to measure' };
  }
  const w = walkRings(measure, reach);
  return {
    rings: w.rings.map((r) => ({ metres: r.metres, r: edge + r.radiusUnits, label: r.label })),
    reason: `§12.3 walk rings, struck from the built edge (${Math.round(edge)}u): ${w.reason}`,
  };
}

/**
 * ⭐⭐ §12.8 THE PENTIMENTO — the high-water ghost as earlier-survey underdrawing.
 *
 * ⛔ IT EXISTS ONLY WHERE THE RECORD SAYS THE PLACE WAS BIGGER, which is the whole of §8.2
 * applied to a mark that would otherwise be free decoration on every leaf. Two sourced
 * conditions qualify: a §161f/§161g DEMOTION (the extent tier outranks the living tier — the
 * stones of the larger town still stand and its houses do not), or a trajectory with more
 * than one peak (the settlement fell and rose again). Anywhere else the leaf carries NO
 * ghost, and the refusal is named.
 *
 * The ghost is the fabric that IS GONE: block-grain quads in the annulus between the living
 * built umbrella and the high-water extent, drawn at the ration's faintest. It is the
 * §161g ruin ring's cartographic echo, which is what the charter calls it.
 * @returns {{ ghosts:Array<Array<[number,number]>>, reason:string, cite:string|null }}
 */
export function derivePentimento({ meta, umbrella, parcels, seeding, frontage, peaks }) {
  const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const demoted = TIERS.indexOf(String(meta.extentTier)) > TIERS.indexOf(String(meta.tier));
  const tworise = Number.isFinite(peaks) && peaks >= 2;
  if (!demoted && !tworise) {
    return { ghosts: [], cite: null, reason: '§12.8: no high water above the living town and no second peak — this leaf carries no pentimento' };
  }
  const key = `${String(seeding.seed)}|pentimento`;
  const cx = meta.centre ? meta.centre.x : 500, cy = meta.centre ? meta.centre.y : 500;
  const outer = meta.builtRadius;
  // ⛔ THE INNER EDGE IS WHERE THE LIVING FABRIC THINS, NOT WHERE THE UMBRELLA ENDS. The
  // umbrella is a boundary and it reaches the extent by construction on a demoted leaf, so
  // measuring against it gave a 21-unit annulus and a ghost crammed against the outline.
  // The ghost belongs where the HOUSES stopped: the radius holding two thirds of the living
  // buildings is the honest inner edge, and everything beyond it is ground the high-water
  // town filled and this one does not.
  let inner = outer * 0.55;
  const ds = [];
  for (const p of (parcels || [])) {
    const c = p.center || (p.polygon && p.polygon.length ? p.polygon[0] : null);
    if (!c) continue;
    ds.push(Math.sqrt((c[0] - cx) * (c[0] - cx) + (c[1] - cy) * (c[1] - cy)));
  }
  if (ds.length > 8) {
    ds.sort((a, b) => a - b);
    inner = ds[Math.floor(ds.length * 0.67)];
  }
  inner = Math.min(inner, outer * 0.90);
  const band = outer - inner;
  if (band < frontage * 2) {
    return { ghosts: [], cite: demoted ? 'meta.extentTier>meta.tier' : 'population-peaks', reason: `§12.8: the living fabric still fills its high-water extent (band ${Math.round(band)}u) — nothing to ghost` };
  }
  /** @type {Array<Array<[number,number]>>} */ const ghosts = [];
  // A ring of ghost blocks on the town's own grain: the earlier surveyor's rank runs, at the
  // module the living town still uses, so the ghost READS as the same town drawn earlier.
  const rings = Math.max(1, Math.min(3, Math.round(band / (frontage * 3.2))));
  for (let ri = 0; ri < rings; ri++) {
    const rad = inner + (band * (ri + 0.5)) / rings;
    const step = Math.max(6, Math.round((TRIG_N * frontage * 2.4) / (2 * Math.PI * rad)));
    for (let ai = 0; ai < TRIG_N; ai += step) {
      const k = `${key}|${ri}|${ai}`;
      // ⚠ RATIONED BY A HASH, not drawn all round: a ghost is what SURVIVED being forgotten,
      // and a complete ring of them would read as a second, solid town.
      if (hashUnit(`${k}|keep`) > 0.55) continue;
      const ca = cosI(ai), sa = sinI(ai);
      const w = frontage * (1.1 + hashUnit(`${k}|w`) * 1.5);
      const h = frontage * (0.8 + hashUnit(`${k}|h`) * 1.1);
      const px = cx + ca * rad, py = cy + sa * rad;
      // The block's own axis is the radius — the grain of a town that grew outward.
      ghosts.push([
        [px - ca * h - sa * w, py - sa * h + ca * w],
        [px + ca * h - sa * w, py + sa * h + ca * w],
        [px + ca * h + sa * w, py + sa * h - ca * w],
        [px - ca * h + sa * w, py - sa * h - ca * w],
      ]);
    }
  }
  return {
    ghosts,
    cite: demoted ? 'meta.extentTier>meta.tier' : 'population-peaks>=2',
    reason: `§12.8 pentimento: ${demoted ? 'a demoted extent' : 'a second population peak'} puts `
      + `${ghosts.length} ghost blocks in the ${Math.round(band)}u annulus the living fabric no longer fills`,
  };
}

/**
 * ⭐ §12.5 COUNTRYSIDE EVENT MARKS — the interspace gains history.
 *
 * Each mark is a TYPED event drawn where that KIND of event happens: a siege on an approach
 * road (an army camps on the road it came by), a flood at the water, a migration on the
 * busiest approach, the founding at the settlement's own nucleus. An event whose type has no
 * countryside expression is NOT drawn (§8.2) rather than given a generic glyph.
 * @returns {{ marks:Array<{kind:string,x:number,y:number,label:string,year:number,cite:string}>, reason:string }}
 */
/**
 * ⛔ TWO KINDS, NOT FOUR, AND THE REASON IS THAT THE RECORD ONLY CARRIES A TYPE. §12.5 names
 * "battle sites with period cross + date" — but `historicalEvents` gives `type: 'disaster'`
 * for a siege, a fire and a flood alike, with the difference living only in a prose `name`.
 * Reading the name to choose a glyph would be a localisation trap and a claim the data does
 * not support, so the honest mark for a dated calamity is the DATED STONE — the period's own
 * "something happened here and it is remembered" — and the honest mark for an arrival is the
 * CAMP GROUND. ⭐ THE CLASS: **A GLYPH VOCABULARY MAY NOT BE FINER THAN THE TYPED FIELD THAT
 * SELECTS IT**; the moment it is, the extra distinctions are invented.
 */
export const EVENT_MARK_KIND = Object.freeze({
  disaster: 'stone',               // the sack, the fire, the flood — a dated memorial stone
  occupation_infiltration: 'stone',
  demographic: 'camp',
  political: null,                 // a scandal leaves no mark on the ground
  economic: null,
  religious: null,
  magical: null,
  exile_return: 'camp',
});

export function deriveEventMarks({ settlement, meta, umbrella, water, roads, seeding, year }) {
  const { age, events } = datedEvents(settlement);
  const Y = Number.isFinite(year) ? year : age;
  const ration = (IMMERSION_RATION[meta.tier] || IMMERSION_RATION.town).marks;
  const key = `${String(seeding.seed)}|eventmark`;
  const cx = meta.centre ? meta.centre.x : 500, cy = meta.centre ? meta.centre.y : 500;
  /** @type {Array<any>} */ const marks = [];
  // ⛔⛔ "OUTSIDE THE BUILT UMBRELLA" IS NOT "IN THE COUNTRYSIDE", AND THE FORENSIC ZOOM
  // CAUGHT IT. The umbrella is the union of the rank runs the packer cut, so it has HOLES —
  // the water corridor, the interior greens, the market voids. A predicate that only asked
  // "not inside any component" therefore declared the middle of the river crossing to be open
  // country, and the town's leaf came back with a besieging army's CAMP GROUND drawn between
  // its two bridges, in the heart of the fabric. ⭐ THE CLASS: **A NEGATIVE PREDICATE OVER A
  // SET WITH HOLES ADMITS THE HOLES**, and a countryside mark needs a POSITIVE claim about
  // where it stands. The radius test is that claim: past the built radius there is no fabric
  // to be inside a hole of.
  const outside = (x, y) => {
    const dx = x - cx, dy = y - cy;
    if (Math.sqrt(dx * dx + dy * dy) < meta.builtRadius * 1.05) return false;
    for (const comp of umbrella.components) {
      let inside = false;
      for (let i = 0, j = comp.length - 1; i < comp.length; j = i++) {
        const xi = comp[i][0], yi = comp[i][1], xj = comp[j][0], yj = comp[j][1];
        if ((yi > y) !== (yj > y)) { const qx = (xj - xi) * (y - yi) / (yj - yi) + xi; if (x < qx) inside = !inside; }
      }
      if (inside) return false;
    }
    return x > 40 && y > 40 && x < 960 && y < 960;
  };
  const candidates = events.filter((ev) => ev.year <= Y && EVENT_MARK_KIND[ev.type]);
  // The GRAVEST and the OLDEST are the ones that leave stones: rank by severity, then age.
  const rank = { catastrophic: 0, major: 1, minor: 2 };
  const ordered = candidates.slice().sort((a, b) =>
    ((rank[a.severity] == null ? 3 : rank[a.severity]) - (rank[b.severity] == null ? 3 : rank[b.severity]))
    || (a.year - b.year) || (a.cite < b.cite ? -1 : 1));
  for (const ev of ordered) {
    if (marks.length >= ration) break;
    const kind = EVENT_MARK_KIND[ev.type];
    let x = null, y = null;
    if (kind === 'stone' || kind === 'camp') {
      // ON A ROAD. An army and a migration both arrive by the road, and the mark stands
      // where the road left the fabric — which is a fact about the web, not a free position.
      const road = roads.length ? roads[Math.floor(hashUnit(`${key}|${ev.cite}|road`) * roads.length)] : null;
      if (road && road.line && road.line.length > 1) {
        for (let t = road.line.length - 1; t >= 0; t--) {
          const p = road.line[t];
          if (outside(p[0], p[1])) {
            const off = meta.builtRadius * 0.10;
            const nx = -(p[1] - cy), ny = p[0] - cx;
            const L = Math.sqrt(nx * nx + ny * ny) || 1;
            const s = hashUnit(`${key}|${ev.cite}|side`) < 0.5 ? 1 : -1;
            const qx = p[0] + (nx / L) * off * s, qy = p[1] + (ny / L) * off * s;
            if (outside(qx, qy)) { x = qx; y = qy; break; }
          }
        }
      }
    }
    if (x == null && kind === 'stone' && water && water.line && water.line.length) {
      const p = water.line[Math.floor(water.line.length * 0.25)];
      if (outside(p[0], p[1])) { x = p[0]; y = p[1]; }
    }
    if (x == null) continue;                       // §8.2: no place, no mark
    marks.push({ kind, x, y, label: ev.name.toUpperCase(), year: ev.year, cite: ev.cite, severity: ev.severity });
  }
  return {
    marks,
    reason: `§12.5 event marks: ${events.length} dated events, ${candidates.length} of a type that marks the `
      + `ground, ${marks.length} placed on a road or a bank (ration ${ration}); `
      + `types with no countryside expression are CUT rather than given a generic glyph`,
  };
}

/**
 * ⭐⭐ §12.2 / §164a THE NEIGHBOUR EDGE — and its DECLARED STANDALONE FALLBACK.
 *
 * ⛔⛔ THE OWNER'S SECOND CONSTRAINT IS AN ABSOLUTE AND IT IS THE REASON THIS FUNCTION MOSTLY
 * RETURNS NOTHING: "ONLY WHEN CONNECTED IN A CAMPAIGN, NEVER BEFORE — a settlement with no
 * campaign neighbour link shows NO neighbour edges (no speculative names, no placeholder
 * roads-to-nowhere annotations)". A standalone settlement is the DEFAULT case in this
 * product, so the default behaviour of this member is silence, and the silence is REPORTED
 * rather than looking like an unbuilt feature.
 *
 * ⛔ THE FIRST CONSTRAINT IS THE BEARING: the annotated road must exit on the neighbour's
 * TRUE bearing in the realm's layout, never a decorative direction. So a link with no
 * bearing is REFUSED — a named road pointing the wrong way is worse than no road, because
 * the map and the world map would disagree and the reader would believe the map.
 *
 * ⚠ THE TRAVEL TIME COMES FROM THE LINK, NOT FROM THE LEAF'S OWN MEASURE. Converting a realm
 * hop into kilometres needs a realm-scale constant this family has no business signing
 * (measure.js's header names the seam); where the link carries a time this prints it, and
 * where it does not the edge prints the NAME alone.
 * @returns {{ edges:Array<any>, reason:string }}
 */
export function deriveNeighbourEdges({ settlement, meta, roads }) {
  const links = readNeighbourLinks(settlement);
  if (!links.length) {
    return {
      edges: [],
      reason: '§164a STANDALONE FALLBACK, DECLARED: this settlement carries no campaign neighbour link, '
        + 'so NO neighbour edge is drawn — no speculative name, no placeholder road-to-nowhere. '
        + 'The edge is born the moment the link is (§11 renders its arrival).',
    };
  }
  const cx = meta.centre ? meta.centre.x : 500, cy = meta.centre ? meta.centre.y : 500;
  /** @type {Array<any>} */ const edges = [];
  let refusedNoBearing = 0;
  for (const link of links) {
    if (!Number.isFinite(link.bearing)) { refusedNoBearing++; continue; }
    // The road whose EXIT bearing is nearest the neighbour's true bearing. The map edge and
    // the world map must agree, so the annotation goes on the road that already points there
    // — never on a road invented to carry it.
    let best = null, bestD = Infinity;
    for (const r of roads) {
      if (!r.line || r.line.length < 2) continue;
      const end = r.line[r.line.length - 1];
      const b = bearingIndex(end[0] - cx, end[1] - cy);
      let d = Math.abs(b - link.bearing);
      if (d > TRIG_N / 2) d = TRIG_N - d;
      if (d < bestD) { bestD = d; best = end; }
    }
    if (!best || bestD > TRIG_N / 12) { refusedNoBearing++; continue; }
    edges.push({ name: link.name, travel: link.travel, x: best[0], y: best[1], bearing: link.bearing, cite: link.cite });
  }
  return {
    edges,
    reason: `§12.2 neighbour edges: ${links.length} campaign link(s), ${edges.length} annotated on a road that `
      + `already exits on the true bearing, ${refusedNoBearing} REFUSED (no bearing, or no road within a `
      + `${Math.round(360 / 12)}° window — a named road pointing the wrong way is worse than none)`,
  };
}

/** The neighbour-link reader. One home, so a landing executor re-points ONE function when
 *  the campaign shape lands. Every accepted shape must carry a NAME and a BEARING. */
export function readNeighbourLinks(settlement) {
  const s = settlement || {};
  const raw = Array.isArray(s.neighbors) ? s.neighbors
    : (s.neighborRelationship && Array.isArray(s.neighborRelationship.links) ? s.neighborRelationship.links
      : (s.campaign && Array.isArray(s.campaign.neighbors) ? s.campaign.neighbors : []));
  const out = [];
  for (const n of raw) {
    if (!n || !n.name) continue;
    out.push({
      name: String(n.name),
      bearing: Number.isFinite(n.bearingIndex) ? n.bearingIndex
        : (Number.isFinite(n.bearing) ? Math.round((n.bearing / 360) * TRIG_N) % TRIG_N : NaN),
      travel: typeof n.travel === 'string' ? n.travel : null,
      cite: `neighbour:${String(n.id || n.name)}`,
    });
  }
  return out;
}

/** A convenience the lens uses: the whole immersion set for one leaf, in one call. */
export function buildImmersion(args) {
  const { fabric, settlement, seeding, year } = args;
  const meta = fabric.meta;
  const roads = fabric.web.roads.concat(fabric.web.highStreet ? [{ line: fabric.web.highStreet }] : []);
  return {
    heraldry: deriveHeraldry({ settlement, meta, seeding }),
    rings: deriveWalkRings({ measure: fabric.measure, meta }),
    pentimento: derivePentimento({
      meta, umbrella: fabric.umbrella, parcels: fabric.parcels, seeding, frontage: meta.plotFrontage,
      peaks: meta.populationPeaks,
    }),
    eventMarks: deriveEventMarks({ settlement, meta, umbrella: fabric.umbrella, water: fabric.water, roads, seeding, year }),
    neighbours: deriveNeighbourEdges({ settlement, meta, roads }),
    notes: marginalia({ settlement, tier: meta.tier, year }),
  };
}

void centroid;
