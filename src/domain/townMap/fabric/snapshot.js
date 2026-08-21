/**
 * domain/townMap/fabric/snapshot.js — §11 THE DRIFT GRAMMAR, as SNAPSHOTS (§11.11/§161k).
 *
 * "Whenever the app views a settlement at a time — the present by default, any chronicled
 * year through the existing year affordances — the map renders the CORRECT SNAPSHOT for that
 * time under the full §11 grammar, and snapshots are CROSS-CONSISTENT by the Inertia Law."
 * No scrub, no interpolation, no slider: a snapshot is a PURE PROJECTION of the settlement
 * record onto a year, handed to the ordinary `buildFabric`.
 *
 * ⭐⭐⭐ THE HONEST SHAPE OF THIS MEMBER AT THIS BASE, STATED BEFORE ANYTHING ELSE, because it
 * is the finding rather than a limitation to apologise for. **THE FABRIC'S GEOMETRY READS
 * ALMOST NOTHING THAT IS YEAR-INDEXED, AND THE TWO THINGS IT DOES READ COME FROM DIFFERENT
 * PLACES THAN THE DATED EVENTS DO.** Measured at head:
 *   • `history.historicalEvents` is TYPED and DATED (`yearsAgo`, `type`, `severity`) and is
 *     the only real chronicle the record carries — 3 events on the town, 14 on the metropolis;
 *   • `compile.readFireYears` reads `fabricScars` / `eventLog`, both ABSENT at head, so the
 *     §15.7 fire-grain dating has no live source and every leaf's fire set is empty;
 *   • `compile.deriveWallVintage` derives a build year from the TRAJECTORY, and it is live.
 * So a year projection moves the marginalia, the countryside event marks and THE WALL, and it
 * moves nothing else — because nothing else is wired to a date. That is the true state of the
 * estate and the member is built to it rather than around it.
 *
 * ⛔⛔ AND THE POPULATION IS HELD CONSTANT ACROSS SNAPSHOTS, DECLARED. `populationHistory` is
 * null at head (F8's eleven-entry cap destroyed exactly this history — the cautionary tale
 * TC29's OB-3 cites), so the souls at year Y are NOT SOURCEABLE. §8.2 forbids expressing an
 * axis with no canonical field, so the snapshot does not invent a trajectory: it varies the
 * EVENT HORIZON, which is sourced, and says so. **MF-D5 / OB-3 is the member that mints the
 * year-indexed signal; until it does, a snapshot is a document re-issued with fewer events on
 * it, not a smaller town.** Inventing the curve would be a visual past the record never had,
 * which §11.10 forbids by name.
 *
 * ⭐⭐ THE INERTIA LAW IS WHAT THIS MODULE IS FOR (§11.0). Because the projection is PURE and
 * the fabric is a pure function of the record, two years with the same event horizon produce
 * BYTE-IDENTICAL fabric by construction, and two years either side of ONE event differ only
 * where that event reaches. The pins measure exactly that, on both arms.
 *
 * ⛔⛔⛔ THE STANDING RULE THIS MEMBER LEAVES BEHIND, and it bit TWICE in one afternoon:
 * **ANY DRIFT THRESHOLD EXPRESSED AS A FRACTION OF `history.age` IS A FRACTION OF *NOW*, NOT
 * A DATE — AND UNDER A SNAPSHOT IT SLIDES WITH THE YEAR AND CAN NEVER BE CROSSED.**
 *   • `compile.deriveWallVintage` computes `ageAtBuild = age × (TOWN_FLOOR / peak)`, so a
 *     year-18 leaf of a town walled in year 49 came back WITH ITS WALL, silently;
 *   • §18.4's colonization threshold is `age × (base + order)`, so an eighteen-year-old
 *     market came back already colonised.
 * The cure in both cases is the same shape: the CALLER stamps the present-day value
 * (`options.wallBuiltAtAge`, `options.presentAge`) and the derived date is then FIXED across
 * every snapshot of that settlement. A landing executor adding a third drift form must do the
 * same, and a threshold that reads `history.age` inside a year-projected derivation is the
 * defect wearing a new name.
 *
 * PURITY: pure functions. No Date, no Math.random, no runtime trig, no Math.pow.
 */

/**
 * ⭐ THE YEAR AXIS IS YEARS SINCE FOUNDING, and it is the only axis the record supports:
 * `history.age` and every event's `yearsAgo` are present and typed; no absolute calendar
 * exists anywhere at head. Declared rather than invented.
 */
export function presentYear(settlement) {
  const h = (settlement && settlement.history) || {};
  return Number.isFinite(h.age) ? Math.trunc(h.age) : 0;
}

/**
 * ⭐⭐⭐ THE PROJECTION. A settlement record as it stood at year Y.
 *
 * ⚠ IT IS A COPY AT EXACTLY THE DEPTH IT CHANGES AND NO DEEPER. Everything else is shared by
 * reference, so a snapshot costs one object and one array rather than a deep clone of a
 * settlement — and, more importantly, so that a field this projection does NOT rule stays
 * IDENTICAL rather than being re-created into a structurally-equal but differently-ordered
 * copy. The inertia law rests on identity of inputs, and a deep clone is the classic way to
 * break it while every test still passes.
 */
export function settlementAtYear(settlement, year) {
  const s = settlement || {};
  const age = presentYear(s);
  const Y = Number.isFinite(year) ? Math.max(0, Math.min(age, Math.trunc(year))) : age;
  if (Y === age) return s;
  const h = s.history || {};
  const events = Array.isArray(h.historicalEvents) ? h.historicalEvents : [];
  const kept = [];
  for (const ev of events) {
    if (!ev || !Number.isFinite(ev.yearsAgo)) continue;
    const at = age - ev.yearsAgo;                       // the event's year since founding
    if (at > Y) continue;                               // it has not happened yet
    kept.push({ ...ev, yearsAgo: Y - at });             // re-dated against the new present
  }
  // ⚠ THE FOUNDING'S OWN `age` IS THE SETTLEMENT'S AGE AND IT MOVES WITH THE SNAPSHOT.
  // `compile.deriveWallVintage` reads `history.founding.age`, which is precisely how the
  // circuit's vintage becomes a year-indexed fact rather than a constant.
  // ⛔ ONE `history` KEY, BUILT ONCE. The first spelling wrote the key twice in one object
  // literal and let the second win — the exact silent-deletion hazard MF-B6 found in
  // `buildFabric`'s own return, two hours earlier in this same lane.
  const history = h.founding
    ? { ...h, age: Y, historicalEvents: kept, founding: { ...h.founding, age: Y } }
    : { ...h, age: Y, historicalEvents: kept };
  return { ...s, history };
}

/**
 * ⭐ THE YEARS WORTH RENDERING. A snapshot at every year would be a churn; the years that
 * MATTER are the ones where something the map can draw changed — an event's year, the
 * circuit's vintage, and the present. Anything between two of them is byte-identical to the
 * earlier one by the inertia law, so it is not a distinct leaf.
 * @returns {{ years:number[], reason:string }}
 */
export function snapshotYears(settlement, wallBuiltAtAge) {
  const age = presentYear(settlement);
  const h = (settlement && settlement.history) || {};
  const events = Array.isArray(h.historicalEvents) ? h.historicalEvents : [];
  const set = new Set([age]);
  for (const ev of events) {
    if (!ev || !Number.isFinite(ev.yearsAgo)) continue;
    const at = age - ev.yearsAgo;
    if (at >= 0) { set.add(at); if (at > 0) set.add(at - 1); }
  }
  if (Number.isFinite(wallBuiltAtAge) && wallBuiltAtAge > 0 && wallBuiltAtAge <= age) {
    set.add(wallBuiltAtAge);
    set.add(wallBuiltAtAge - 1);
  }
  const years = [...set].filter((y) => y >= 0 && y <= age).sort((a, b) => a - b);
  return {
    years,
    reason: `§11.11 snapshot years: ${years.length} distinct leaves over a ${age}-year life — `
      + `every event year and its eve, the circuit's vintage and its eve, and the present. `
      + `Years between two of these are BYTE-IDENTICAL to the earlier one by the inertia law, `
      + `so they are not distinct leaves.`,
  };
}

/**
 * ⭐⭐ §11.8 / §161d.4 THE WALL'S VINTAGE GATE — the one piece of GEOMETRY this base can date.
 *
 * `compile.deriveWallVintage` already derives the age at which the settlement crossed the
 * circuit-economy threshold. A snapshot BEFORE that age therefore has NO CIRCUIT — and with
 * it no gates, no ditch, no water gates, no faubourg (a faubourg is growth outside a wall)
 * and no lean-tos. That is the single most legible drift on the page and it is fully sourced.
 *
 * ⚠ THE PROJECTION ALONE DOES NOT DO IT. `hasWalls` comes from the landed MODEL, which is not
 * year-indexed, so the gate has to be applied where the model is read. That is why this
 * function exists rather than the truncation being enough on its own.
 * @returns {{ standing:boolean, builtAtAge:number|null, reason:string }}
 */
export function wallStandingAt(vintage, year, hasWalls) {
  if (!hasWalls) return { standing: false, builtAtAge: null, reason: 'this settlement carries no circuit at any year' };
  const built = vintage && Number.isFinite(vintage.ageAtBuild) ? vintage.ageAtBuild : null;
  if (built == null || !Number.isFinite(year)) {
    return { standing: true, builtAtAge: built, reason: 'no dated vintage — the circuit is drawn as standing (the present-day reading)' };
  }
  const standing = year >= built;
  return {
    standing,
    builtAtAge: built,
    reason: standing
      ? `the circuit was raised in year ${built} and this leaf is year ${year} — it stands`
      : `⭐ the circuit was raised in year ${built} and this leaf is year ${year}: NO WALL, and with it no `
        + `gates, no ditch, no water gates, no faubourg and no lean-tos — a faubourg is growth outside a wall`,
  };
}

/**
 * ⭐⭐ §18.4 MARKET COLONIZATION — the middle rows, as a DRIFT FORM.
 *
 * "Under §11 drift, a wide market place gradually INFILLS — the middle rows: permanent stalls
 * hardening into shops, then houses, splitting one great square into the two narrow streets
 * the §157 references show. An event-dated drift form under the encroachment grammar,
 * order-gated (lawful towns resist longer)."
 *
 * ⛔ THE GATE IS AGE × ORDER AND BOTH ARE SOURCED. There is no per-year encroachment signal
 * at head, so the honest derivation uses the two facts that ARE typed: how long the market has
 * stood, and how well the place is run. A lawful town clears its market and an ill-run one
 * lets the stalls harden — which is §11.2's order drift said about one square.
 * ⚠ THE ROWS ARE FILLED BODIES and join the §195.0 census in the same commit that draws them.
 * @returns {{ rows:Array<{key:string, polygon:number[][], kind:string, cite:string}>, reason:string }}
 */
export const COLONIZE = Object.freeze({
  /** The share of a settlement's life after which an UNGOVERNED market has hardened. */
  baseShare: 0.42,
  /** How much longer a perfectly lawful town resists, as a share of its life. */
  orderResist: 0.50,
  /** The share of the square's own width the middle rows take. */
  rowShare: 0.24,
});

export function marketColonization({ squares, channels, year, age, lawfulness, frontage, tier, seedKey, hashUnit }) {
  const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  if (TIERS.indexOf(String(tier)) < 3) {
    return { rows: [], reason: '§18.4: below town there is no market PLACE to colonise — a green or a cross is not a square' };
  }
  if (!squares || !squares.length || !Number.isFinite(age) || age <= 0) {
    return { rows: [], reason: '§18.4: no market place on this leaf' };
  }
  const order = Number.isFinite(lawfulness) ? Math.max(0, Math.min(1, lawfulness)) : 0.5;
  const threshold = age * Math.min(0.95, COLONIZE.baseShare + order * COLONIZE.orderResist);
  const Y = Number.isFinite(year) ? year : age;
  if (Y < threshold) {
    return {
      rows: [],
      reason: `§18.4: the market place is still open at year ${Math.round(Y)} — an order of `
        + `${order.toFixed(2)} holds the middle rows off until year ${Math.round(threshold)}`,
    };
  }
  const sq = squares[0];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of sq.polygon) {
    if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
    if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
  }
  const w = x1 - x0, h = y1 - y0;
  if (Math.min(w, h) < frontage * 3) {
    return { rows: [], reason: '§18.4: the market place is too narrow to carry a middle row and still be a street' };
  }
  // The rows run ALONG the square's long axis and stand in the MIDDLE of it, which is what
  // splits one great square into two narrow streets.
  //
  // ⛔⛔ AND THE MIDDLE OF A SQUARE IS WHERE THE STREETS CROSS IT, which is why the first
  // spelling lost four rows of five to the ground law. MF-B5's J-B5-7 ruled that A SQUARE IS
  // A CROSSING — every void joins the channels that front it — so the carriageways run
  // straight through the centre and a band laid on the centre line is a band laid in the
  // road. ⭐ THE HISTORY SAYS THE SAME THING: market colonization SPLITS one great square
  // into two narrow streets, so the rows stand BETWEEN the through-routes by definition, not
  // across them. The band therefore SEARCHES for the clearest offset — the perpendicular
  // position with the greatest clearance from every channel crossing the place — which is a
  // derivation from the web rather than a nudge away from a failure.
  const along = w >= h;
  const rowT = (along ? h : w) * COLONIZE.rowShare;
  const cross = [];
  for (const ch of (channels || [])) {
    if (!ch.line) continue;
    for (const p of ch.line) {
      if (p[0] >= x0 - frontage && p[0] <= x1 + frontage && p[1] >= y0 - frontage && p[1] <= y1 + frontage) {
        cross.push(along ? p[1] : p[0]);
      }
    }
  }
  const cMidRaw = along ? (y0 + y1) / 2 : (x0 + x1) / 2;
  const span = (along ? h : w);
  let cMid = cMidRaw, bestClear = -Infinity;
  for (let sIdx = -4; sIdx <= 4; sIdx++) {
    const cand = cMidRaw + (sIdx / 10) * span;
    if (cand - rowT / 2 < (along ? y0 : x0) || cand + rowT / 2 > (along ? y1 : x1)) continue;
    let clear = Infinity;
    for (const c of cross) { const d = Math.abs(c - cand); if (d < clear) clear = d; }
    // Ties break toward the TRUE middle: a colonised market's rows sit in the middle of the
    // place, and only a crossing may move them.
    const score = clear - Math.abs(cand - cMidRaw) * 0.001;
    if (score > bestClear) { bestClear = score; cMid = cand; }
  }
  const n = Math.max(2, Math.round((along ? w : h) / (frontage * 2.6)));
  const rows = [];
  for (let i = 0; i < n; i++) {
    const k = `${seedKey}|colonize|${i}`;
    const gap = frontage * (0.30 + hashUnit(`${k}|g`) * 0.35);
    const t0 = (along ? x0 : y0) + ((along ? w : h) * i) / n + gap * 0.5;
    const t1 = (along ? x0 : y0) + ((along ? w : h) * (i + 1)) / n - gap * 0.5;
    if (t1 - t0 < frontage * 0.6) continue;
    const a0 = cMid - rowT / 2, a1 = cMid + rowT / 2;
    rows.push({
      key: `colonize.${i}`,
      kind: 'middleRow',
      cite: `§18.4 age ${Math.round(Y)} ≥ ${Math.round(threshold)} at order ${order.toFixed(2)}`,
      polygon: along
        ? [[t0, a0], [t1, a0], [t1, a1], [t0, a1]]
        : [[a0, t0], [a1, t0], [a1, t1], [a0, t1]],
    });
  }
  return {
    rows,
    reason: `§18.4 MARKET COLONIZATION: at year ${Math.round(Y)} the square has stood past its `
      + `year-${Math.round(threshold)} threshold (order ${order.toFixed(2)}) — ${rows.length} middle rows `
      + `harden in the middle of the place, splitting it into two narrow streets`,
  };
}
