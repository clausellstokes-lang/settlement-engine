/**
 * domain/townMap/fabric/accessLaw.js — ⭐⭐⭐ §202 THE UNIVERSAL ACCESS LAW and §201 B THE
 * STREET-ATTACHMENT LAW (owner orders, chair directives ODQ §201/§202).
 *
 * The owner's words, sharpened: "every building has to have at least some space to get through
 * to our streets, whether that's directly or through an alley that's connected to the street."
 * ACCESS IS TRANSITIVE. A building fronting a court is served only if the court itself
 * percolates — through whatever chain of alleys, gaps and slots — to a street.
 *
 * ⭐⭐ AND THE HONEST INSTRUMENT IS THE COMPLEMENT OF THE DRAWING, NOT A GRAPH. A reachability
 * law measured by ADJACENCY passes a building fronting a hermetically sealed court, which is
 * exactly the case the owner sharpened the law to catch. A reachability law measured by a
 * hand-built adjacency graph inherits every judgement call in the graph builder. The
 * complement of the drawn bodies has no judgement calls in it at all — it is the ground a
 * person could walk on — so the census is over a rasterized complement, flooded from the
 * street web, and the question is simply what the flood reached.
 *
 * ⭐ THE SAME FLOOD ANSWERS §201 B. A street segment is ORPHANED when its own cells lie in a
 * different open component from the network's; alleys are exempt by law, and they are exempt
 * here by not being seeds. ⚠ THIS IS NOT MF-B5's CONNECTIVITY SHARE (the 0.710 city web
 * reading): that asks how much of the web hangs together, this asks whether any piece hangs
 * off it. A share can be excellent while one lane is severed.
 *
 * ⚠ THE RESOLUTION IS FIXED AND ARGUED, NOT TUNED — see GRID_N.
 *
 * PURITY: pure. Fixed grid, fixed scan order, integer labels — byte-stable across processes.
 */

/** Cells across the 1000-unit frame. See the header for why this number and not another. */
export const GRID_N = 1200;
const FRAME = 1000;

/** Scanline-fill a simple polygon into `buf` with `val`. Half-open cells, fixed rounding. */
function fillPoly(buf, n, cell, poly, val) {
  let y0 = Infinity, y1 = -Infinity;
  for (const p of poly) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  let j0 = Math.floor(y0 / cell), j1 = Math.floor(y1 / cell);
  if (j0 < 0) j0 = 0; if (j1 > n - 1) j1 = n - 1;
  const xs = [];
  for (let j = j0; j <= j1; j++) {
    const y = (j + 0.5) * cell;
    xs.length = 0;
    for (let i = 0, k = poly.length - 1; i < poly.length; k = i++) {
      const yi = poly[i][1], yk = poly[k][1];
      if ((yi > y) !== (yk > y)) xs.push((poly[k][0] - poly[i][0]) * (y - yi) / (yk - yi) + poly[i][0]);
    }
    xs.sort((a, b) => a - b);
    for (let s = 0; s + 1 < xs.length; s += 2) {
      let i0 = Math.floor(xs[s] / cell), i1 = Math.floor(xs[s + 1] / cell);
      if (i0 < 0) i0 = 0; if (i1 > n - 1) i1 = n - 1;
      for (let i = i0; i <= i1; i++) buf[j * n + i] = val;
    }
  }
}

/** Stamp the band of half-width `half` about a polyline into `buf` with `val`. */
function fillBand(buf, n, cell, line, half, val, closed = false) {
  const last = closed ? line.length : line.length - 1;
  for (let s = 0; s < last; s++) {
    const a = line[s], b = line[(s + 1) % line.length];
    const x0 = Math.min(a[0], b[0]) - half, x1 = Math.max(a[0], b[0]) + half;
    const y0 = Math.min(a[1], b[1]) - half, y1 = Math.max(a[1], b[1]) + half;
    let i0 = Math.floor(x0 / cell), i1 = Math.floor(x1 / cell);
    let j0 = Math.floor(y0 / cell), j1 = Math.floor(y1 / cell);
    if (i0 < 0) i0 = 0; if (j0 < 0) j0 = 0; if (i1 > n - 1) i1 = n - 1; if (j1 > n - 1) j1 = n - 1;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = dx * dx + dy * dy;
    const h2 = half * half;
    for (let j = j0; j <= j1; j++) {
      const py = (j + 0.5) * cell;
      for (let i = i0; i <= i1; i++) {
        const px = (i + 0.5) * cell;
        let t = L > 0 ? ((px - a[0]) * dx + (py - a[1]) * dy) / L : 0;
        if (t < 0) t = 0; else if (t > 1) t = 1;
        const qx = a[0] + dx * t, qy = a[1] + dy * t;
        if ((px - qx) * (px - qx) + (py - qy) * (py - qy) <= h2) buf[j * n + i] = val;
      }
    }
  }
}

const BLOCKED = 1, OPEN = 0;

/**
 * ⭐⭐⭐ MF-PERF1 · THE STREET SEED MASK — a fact about the CHANNELS, and the bodies are the only
 * thing the access pass ever moves. It is therefore computed ONCE per leaf and CARRIED, which is
 * MF-W0's own J-W0-1 shape: *the answer is computed once and carried, not computed twice from
 * one module.*
 *
 * ⛔ MEASURED BEFORE THE CURE (MFPERF1-acount.mjs): a walled leaf built the 1,200² grid **six
 * times** — four repair rounds, the census, and the permeability statistic — and stamped this
 * identical mask into all six. `fillBand` alone profiled at 6.2 % of the whole build.
 * ⭐ THE CLASS, and it is the one this estate keeps meeting from the other side: **A PURE
 * FUNCTION CALLED IN A LOOP OVER AN ARGUMENT THAT DOES NOT VARY IS A LOOP-INVARIANT NOBODY
 * NAMED** — and naming it is the whole cure.
 *
 * ⚠ IT IS A REQUIRED ARGUMENT EVERYWHERE BELOW AND IT HAS NO DEFAULT, DELIBERATELY. MF-W0's
 * standing hazard says a recomputation added "for safety" restores the defect silently; a
 * caller that forgets this throws on the first read instead.
 *
 * @param {any} fabric
 * @returns {{n:number, cell:number, street:Uint8Array}}
 */
export function streetSeeds(fabric) {
  const n = GRID_N, cell = FRAME / n;
  const street = new Uint8Array(n * n);
  // ── THE STREET SEEDS. Every channel of a CART rank — an alley is open space but it is not
  //    a street, which is exactly what §201 B's exemption says.
  for (const ch of (fabric.channels || [])) {
    if (ch.rank === 'alley') continue;
    fillBand(street, n, cell, ch.line, Math.max(ch.width / 2, cell), 1);
  }
  for (const sq of ((fabric.web && fabric.web.squares) || [])) if (sq.polygon && sq.polygon.length >= 3) fillPoly(street, n, cell, sq.polygon, 1);
  return { n, cell, street };
}

/**
 * Build the grid: BLOCKED where a drawn body or a wall band stands, OPEN elsewhere; with the
 * leaf's STREET seed mask carried in.
 * @param {any} fabric
 * @param {Array<{key:string, kind:string, poly:number[][]}>} bodies the DRAWN set (§195.0)
 * @param {{n:number, cell:number, street:Uint8Array}} seeds from `streetSeeds` — REQUIRED
 */
export function buildGrid(fabric, bodies, seeds) {
  const n = GRID_N, cell = FRAME / n;
  const blocked = new Uint8Array(n * n);
  for (const b of bodies) if (b.poly && b.poly.length >= 3) fillPoly(blocked, n, cell, b.poly, BLOCKED);
  // ⭐⭐⭐ THE WALL IS **NOT** IN §202's BLOCKED SET, AND THE DECISION IS A JUDGMENT WITH A
  // REASON (J-B7-6). The owner's law asks whether every building "has at least some space to
  // get through to our streets"; its subject is a building sealed by BUILDINGS. A wall seals
  // nobody: the house inside it stands on a street, and that street runs to a gate.
  //
  // ⛔ I BUILT IT THE OTHER WAY FIRST AND IT ANSWERED A DIFFERENT QUESTION. With the band
  // blocking, the metropolis's street network held 44.8% of the leaf's open ground and the
  // high-water leaf's 24.2%, and 232 intramural buildings were convicted of being landlocked
  // — by a circuit, which is not what landlocked means. ⭐ THE CLASS: **A CENSUS THAT
  // BLOCKS ON MORE THAN ITS LAW NAMES REDS FOR REASONS ITS LAW DOES NOT COVER, AND EVERY ONE
  // OF THOSE REDS IS A FALSE POSITIVE THE NEXT LANE WILL "CURE".**
  //
  // ⚠ THE QUESTION THE OTHER CONSTRUCTION WAS ACTUALLY ASKING IS REAL AND IS KEPT — as its
  // own statistic, `wallPermeable`, reported beside the census rather than folded into it.
  // See `circuitPermeability`.
  return { n, cell, blocked, street: seeds.street };
}

/** 4-connected component labels over the OPEN cells. Fixed scan order ⇒ stable labels. */
export function labelOpen(grid) {
  const { n, blocked } = grid;
  const lab = new Int32Array(n * n).fill(-1);
  const stack = new Int32Array(n * n);
  let next = 0;
  for (let start = 0; start < n * n; start++) {
    if (blocked[start] || lab[start] !== -1) continue;
    const id = next++;
    let sp = 0;
    stack[sp++] = start; lab[start] = id;
    while (sp > 0) {
      const c = stack[--sp];
      const i = c % n, j = (c - i) / n;
      if (i > 0 && !blocked[c - 1] && lab[c - 1] === -1) { lab[c - 1] = id; stack[sp++] = c - 1; }
      if (i < n - 1 && !blocked[c + 1] && lab[c + 1] === -1) { lab[c + 1] = id; stack[sp++] = c + 1; }
      if (j > 0 && !blocked[c - n] && lab[c - n] === -1) { lab[c - n] = id; stack[sp++] = c - n; }
      if (j < n - 1 && !blocked[c + n] && lab[c + n] === -1) { lab[c + n] = id; stack[sp++] = c + n; }
    }
  }
  return { lab, count: next };
}

/** The label set the STREET WEB occupies — the network every building must reach. */
export function streetLabels(grid, lab) {
  const { n, street, blocked } = grid;
  /** @type {Map<number, number>} */ const tally = new Map();
  for (let c = 0; c < n * n; c++) {
    if (!street[c] || blocked[c]) continue;
    const L = lab[c];
    if (L < 0) continue;
    tally.set(L, (tally.get(L) || 0) + 1);
  }
  // ⚠ THE NETWORK IS THE LARGEST STREET COMPONENT, NOT THE UNION OF THEM. A severed street
  // that kept its own pocket of open ground would otherwise define itself as attached — the
  // §195.0 shape, one law down: a census whose reference set is derived from the thing it
  // is measuring cannot fail.
  let best = -1, bestN = -1;
  for (const [L, k] of [...tally.entries()].sort((a, b) => a[0] - b[0])) if (k > bestN) { bestN = k; best = L; }
  return { main: best, tally };
}

/**
 * Does the body touch an open cell carrying label `main`?
 * ⚠ THE WINDOW IS LOCAL, and that is a correctness point as well as a cost one: the first
 * spelling rasterized each body into a FULL-FRAME scratch buffer (1.44M cells per body, a
 * thousand bodies a leaf) and clamped its window to the frame — so a body lying wholly
 * outside the frame produced an inverted window and threw. Bodies outside the frame are real
 * (a countryside steading at the margin), and a census that throws on them measures nothing.
 */
function bodyReaches(grid, lab, main, poly) {
  const { n, cell, blocked } = grid;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  let i0 = Math.floor(x0 / cell) - 2, i1 = Math.floor(x1 / cell) + 2;
  let j0 = Math.floor(y0 / cell) - 2, j1 = Math.floor(y1 / cell) + 2;
  if (i0 < 0) i0 = 0; if (j0 < 0) j0 = 0; if (i1 > n - 1) i1 = n - 1; if (j1 > n - 1) j1 = n - 1;
  if (i1 < i0 || j1 < j0) return true;   // wholly off the frame — never a landlocked claim
  const w = i1 - i0 + 1, h = j1 - j0 + 1;
  const own = new Uint8Array(w * h);
  // Scanline the polygon straight into the LOCAL window.
  const xs = [];
  for (let j = j0; j <= j1; j++) {
    const y = (j + 0.5) * cell;
    xs.length = 0;
    for (let a = 0, k = poly.length - 1; a < poly.length; k = a++) {
      const ya = poly[a][1], yk = poly[k][1];
      if ((ya > y) !== (yk > y)) xs.push((poly[k][0] - poly[a][0]) * (y - ya) / (yk - ya) + poly[a][0]);
    }
    xs.sort((a, b) => a - b);
    for (let s = 0; s + 1 < xs.length; s += 2) {
      let a0 = Math.floor(xs[s] / cell), a1 = Math.floor(xs[s + 1] / cell);
      if (a0 < i0) a0 = i0; if (a1 > i1) a1 = i1;
      for (let i = a0; i <= a1; i++) own[(j - j0) * w + (i - i0)] = 1;
    }
  }
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      if (!own[(j - j0) * w + (i - i0)]) continue;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ii = i + di, jj = j + dj;
        if (ii < 0 || jj < 0 || ii > n - 1 || jj > n - 1) continue;
        const c = jj * n + ii;
        if (!blocked[c] && lab[c] === main) return true;
      }
    }
  }
  return false;
}

/**
 * ⭐⭐⭐ THE THREE-LAW CENSUS over one grid.
 * @returns {{landlocked:Array<string>, orphanStreets:Array<string>, courts:number,
 *            openComponents:number, reachedShare:number}}
 */
export function accessCensus(fabric, bodies, seeds) {
  const grid = buildGrid(fabric, bodies, seeds);
  const { lab } = labelOpen(grid);
  const { main } = streetLabels(grid, lab);
  const { n, cell, blocked } = grid;

  // §202 · EVERY BUILDING REACHES THE STREET WEB, through whatever chain of open space.
  /** @type {string[]} */ const landlocked = [];
  // ⭐⭐ AN ARRANGEMENT IS ONE BUILDING, AND ITS PARTS ARE NOT EACH OTHER'S JAILERS.
  // An institution draws as several SOLIDS — nave, tower, transept, range round a yard — and
  // an interior part is enclosed by its own building BY DESIGN. MEASURED: the last two
  // convictions on the town family were solid #1 of a guild hall and solid #0 of a parish
  // church, both walled in by their own arrangement. Convicting them reads the law as "every
  // POLYGON must front a street", which no building on earth satisfies. The access question
  // is asked of the ARRANGEMENT: if any part of it reaches the network, the building does.
  /** @type {Map<string, {keys:string[], reached:boolean}>} */ const groups = new Map();
  for (const b of bodies) {
    if (!b.poly || b.poly.length < 3) continue;
    const reached = bodyReaches(grid, lab, main, b.poly);
    const m = /^!inst\|([^|]+)\|/.exec(b.key);
    if (m) {
      const g = groups.get(m[1]) || { keys: [], reached: false };
      g.keys.push(b.key); g.reached = g.reached || reached;
      groups.set(m[1], g);
      continue;
    }
    if (!reached) landlocked.push(b.key);
  }
  for (const [inst, g] of [...groups.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    if (!g.reached) landlocked.push(`!inst|${inst}`);
  }

  // §201 B · EVERY STREET SEGMENT ATTACHES TO THE NETWORK. Per SEGMENT and BINARY — this is
  // not B5's connectivity SHARE, which asks how much of the web hangs together; this asks
  // whether any piece hangs off it at all.
  /** @type {string[]} */ const orphanStreets = [];
  for (const ch of (fabric.channels || [])) {
    if (ch.rank === 'alley') continue;               // exempt by law
    let attached = false, open = 0;
    for (let s = 0; s + 1 < ch.line.length && !attached; s++) {
      const a = ch.line[s], b = ch.line[s + 1];
      const steps = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / cell));
      for (let t = 0; t <= steps; t++) {
        const px = a[0] + (b[0] - a[0]) * (t / steps), py = a[1] + (b[1] - a[1]) * (t / steps);
        const i = Math.floor(px / cell), j = Math.floor(py / cell);
        if (i < 0 || j < 0 || i > n - 1 || j > n - 1) continue;
        const c = j * n + i;
        if (blocked[c]) continue;
        open++;
        if (lab[c] === main) { attached = true; break; }
      }
    }
    if (!attached && open > 0) orphanStreets.push(ch.key || ch.rank);
  }

  let openCells = 0, reached = 0;
  for (let c = 0; c < n * n; c++) { if (blocked[c]) continue; openCells++; if (lab[c] === main) reached++; }
  return {
    landlocked, orphanStreets,
    openComponents: new Set(Array.from(lab).filter((v) => v >= 0)).size,
    reachedShare: openCells ? Math.round((1000 * reached) / openCells) / 10 : 0,
  };
}

/**
 * ⭐⭐ CIRCUIT PERMEABILITY — the question §202's first spelling was accidentally asking, kept
 * as its own honest statistic (it belongs to §161m.4 / §205 C, not to the access law).
 *
 * With the wall band treated as the solid it is, does the INTRAMURAL street web reach the
 * EXTRAMURAL one? A walled settlement whose gates are too few, all bricked, or all crowded on
 * one arc is a town the roads cannot serve, and that is a real defect — but it is a defect of
 * the CIRCUIT, not of any building, so it is reported and not folded into a building census.
 */
export function circuitPermeability(fabric, bodies, wallClaimRuns, seeds) {
  if (!wallClaimRuns || !wallClaimRuns.length) return { walled: false, permeable: true, share: 100, comps: 1 };
  const grid = buildGrid(fabric, bodies, seeds);
  for (const c of wallClaimRuns) fillBand(grid.blocked, grid.n, grid.cell, c.line, c.width / 2, BLOCKED);
  const { lab } = labelOpen(grid);
  const { main, tally } = streetLabels(grid, lab);
  let street = 0, inMain = 0;
  for (const [L, k] of tally) { street += k; if (L === main) inMain += k; }
  return {
    walled: true,
    permeable: tally.size <= 1,
    share: street ? Math.round((1000 * inMain) / street) / 10 : 0,
    comps: tally.size,
  };
}

/**
 * ⭐⭐⭐ THE ACCESS REPAIR (§202's own cure), and it is the §15.6 bounded-repair shape the
 * whole family already uses: try the smallest honest change, verify, and diagnose the rest.
 *
 * A landlocked building is one the packing sealed — its neighbours grew round it until no gap
 * on any side reached the street. The repair is the one the fabric itself would have made:
 * **the sealed body gives up a little of its own ground so a gap opens beside it.** That is
 * not a fudge; it is the §17.6 through-passage arriving by the only route left, and it is why
 * the inset ladder is shared with the demotion arm rather than invented here.
 *
 * ⚠ IT IS A FIXED LADDER AND A FIXED NUMBER OF ROUNDS. Shrinking one body can free several
 * (they were sealed by each other), so the flood is re-run between rounds; but the rounds are
 * bounded at MAX_ROUNDS and the insets are fixed, so this can never iterate to a tolerance.
 * A body still sealed after the last round is DROPPED and counted — §15.6: a missing building
 * with a diagnostic beats a building nobody can reach.
 *
 * @param {any} fabric
 * @param {Array<{key:string, kind:string, poly:number[][], ref?:any, field?:any}>} bodies
 *        the DRAWN set, each carrying a writable back-reference
 * @param {number} frontage
 */
export const ACCESS_INSETS = Object.freeze([0.14, 0.30, 0.55]);
const MAX_ROUNDS = 4;   // ⚠ 4 ROUNDS FOR 3 INSETS: the last round only VERIFIES, it does not shrink.

export function repairAccess(fabric, bodies, frontage, seeds) {
  let shrunk = 0, dropped = 0;
  /** @type {string[]} */ const stillSealed = [];
  // ⭐⭐ THE LADDER'S OWN AUDIT, AND IT IS THE POINT OF THIS PASS BEING INSTRUMENTED AT ALL.
  // `sealedPerRound` is the census that convicted the published `freed` figure: it records
  // how many bodies the flood found sealed at the head of EVERY round, so a ladder that
  // shrinks the same set three times and frees none of them says so in its own output
  // instead of reporting a positive number derived from the wrong quantity. See the note
  // on `accessFreed` below.
  /** @type {number[]} */ const sealedPerRound = [];
  /** @type {Set<string>} */ const sealedAtEntry = new Set();
  for (let round = 0; round < MAX_ROUNDS; round++) {
    const grid = buildGrid(fabric, bodies.filter((b) => b.poly && b.poly.length >= 3), seeds);
    const { lab } = labelOpen(grid);
    const { main } = streetLabels(grid, lab);
    const reach = new Map();
    for (const b of bodies) if (b.poly && b.poly.length >= 3) reach.set(b, bodyReachesMain(grid, lab, main, b.poly));
    // The arrangement rule (see accessCensus): a part is served if its building is.
    const instReached = new Map();
    for (const [b, r] of reach) {
      const m = /^!inst\|([^|]+)\|/.exec(b.key);
      if (m) instReached.set(m[1], (instReached.get(m[1]) || false) || r);
    }
    const sealed = bodies.filter((b) => {
      if (!b.poly || b.poly.length >= 3 === false) return false;
      if (!reach.has(b)) return false;
      const m = /^!inst\|([^|]+)\|/.exec(b.key);
      if (m) return !instReached.get(m[1]);
      return !reach.get(b);
    });
    sealedPerRound.push(sealed.length);
    if (round === 0) for (const b of sealed) sealedAtEntry.add(b.key);
    if (!sealed.length) { stillSealed.length = 0; break; }
    stillSealed.length = 0;
    for (const b of sealed) stillSealed.push(b.key);
    if (round === MAX_ROUNDS - 1) break;
    const inset = ACCESS_INSETS[round];
    for (const b of sealed) {
      // ⭐⭐ A SEALED TRUTH ANCHOR IS FREED BY ITS NEIGHBOURS, NOT BY ITSELF (§8.1 + the
      // ground law's own precedence: "the ordinary fabric gives way to the monumental,
      // which is the historical direction of the transaction"). A guild hall nobody can
      // reach is a real defect and shrinking the hall would be the wrong repair twice over
      // — it would shrink a truth anchor to fit a cottage, and a monument does not get
      // smaller because the houses crowded it. The houses give way.
      if (b.kind === 'institution' || !b.ref || b.field == null) {
        // ⭐⭐⭐ AND WHERE THE SEAL IS DEEPER THAN ONE RANK, THE REPAIR IS A PASSAGE.
        // MEASURED on the town: a parish church standing at the centre of a solid mass of
        // building about 33 view units across — four ranks deep in every direction. Nudging
        // the bodies that touch it cannot reach open ground, because the ground is four
        // buildings away. So the repair cuts the thing history cut: a THROUGH-PASSAGE from
        // the sealed anchor to the nearest served ground, opened by the bodies along its
        // line each giving up a little of themselves. That is §17.6's own mechanism arriving
        // where the packer failed to derive one, and it is bounded — one corridor, one
        // direction, the fixed inset ladder.
        const corridor = corridorTo(grid, lab, main, bodies, b);
        for (const o of (corridor.length ? corridor : neighboursOf(bodies, b))) {
          const s = shrinkTowardCentroid(o.poly, frontage * inset);
          if (s.length >= 3) { o.poly = s; if (o.ref && o.field != null) { o.ref[o.field] = s; o.ref.accessRepaired = true; } shrunk++; }
        }
        continue;
      }
      const s = shrinkTowardCentroid(b.poly, frontage * inset);
      if (s.length >= 3) { b.poly = s; if (b.ref && b.field != null) { b.ref[b.field] = s; b.ref.accessRepaired = true; } shrunk++; }
    }
  }
  // Anything still sealed after the ladder cannot be reached and is not drawn.
  // ⚠ AND `b.poly` MUST BE EMPTIED TOO, not only the back-reference. The first spelling
  // cleared the owner's field and left the census's own view of the body intact, so the
  // audit that ran immediately afterwards still saw every dropped body and reported the
  // repair as having achieved nothing. ⭐ THE CLASS: **A REPAIR THAT WRITES THROUGH ONE OF
  // TWO ALIASES LEAVES THE OTHER TELLING THE OLD STORY**, and the census reads the other one.
  /** @type {string[]} */ const unreachable = [];
  for (const b of bodies) {
    if (!stillSealed.includes(b.key)) continue;
    // §8.1: an institution is a TRUTH ANCHOR and is never deleted to satisfy a layout law.
    // It is reported instead, which is the only honest handling of the conflict.
    if (b.kind === 'institution' || !b.ref || b.field == null) { unreachable.push(b.key); continue; }
    b.ref[b.field] = [];
    b.ref.accessRepaired = true;
    b.poly = [];
    dropped++;
  }
  // ⛔⛔ `freed = shrunk − dropped` WAS AN ARITHMETIC BETWEEN TWO DIFFERENT UNITS, AND IT
  // PUBLISHED A POSITIVE NUMBER FOR A LADDER THAT FREED NOBODY. `shrunk` counts SHRINK
  // OPERATIONS — one per body per round, so a body shrunk in three rounds counts three
  // times — and `dropped` counts BUILDINGS. Subtracting the second from the first gave
  // `town 45 − 15 = 30`, `city 102 − 34 = 68`, `metropolis 234 − 78 = 156`, and every one
  // of those was published under a name that says "freed". MEASURED (MF-PERF1 §7.1): the
  // sealed set does not move across the ladder on ANY walled leaf — `town sealed[15,15,15,15]`,
  // `city [34,34,34,34]`, `metropolis [78,78,78,78]` — so the true number of buildings the
  // repair freed was **ZERO on every walled leaf in the corpus**, and the figure said 30/68/156.
  //
  // ⭐⭐ THE CLASS, AND THIS ESTATE HAS NOW FOUND IT AT THREE SEPARATE SURFACES (the §230
  // docstring family, `accessFreed`, and MF-PERF1's own `q6` profile rows): **A FIGURE WHOSE
  // NAME NAMES ONE QUANTITY AND WHOSE BODY COMPUTES ANOTHER IS NOT A WRONG NUMBER — IT IS A
  // NUMBER NOBODY CAN CHECK**, because the name is what a reader checks it against. It
  // survived because it was never zero, and a plausible non-zero number is the hardest kind
  // of wrong to see.
  //
  // ⭐ THE CURE IS A DEFINITION, NOT A COEFFICIENT: a body is FREED if it was sealed when
  // the ladder began and is not sealed when it ends. That is countable, it is in the unit
  // its name claims, and it is bounded above by `sealedPerRound[0]`.
  const freed = sealedAtEntry.size - stillSealed.filter((k) => sealedAtEntry.has(k)).length;
  const shrinkOps = shrunk;
  return {
    // ⚠ `shrunk` KEEPS ITS NAME AND ITS VALUE — it was never wrong, only misused. It is
    // re-published as `shrinkOps` beside it so a consumer that wants OPERATIONS asks for
    // operations by name and can never again reach for it as a building count.
    shrunk, shrinkOps, dropped, freed, sealedPerRound, sealedAtEntry: sealedAtEntry.size,
    unreachable, stillSealed: stillSealed.slice(0, 12),
    reason: `§202 access repair: ${sealedAtEntry.size} bodies sealed at entry; ${shrinkOps} shrink `
      + `operation(s) over ${sealedPerRound.length} round(s) [sealed ${sealedPerRound.join(',')}] `
      + `FREED ${freed}; ${dropped} could not be reached at any inset and were dropped`
      + (freed === 0 && shrinkOps > 0
        ? ` — ⛔ THE LADDER FREED NOBODY: every shrink round is spent and the same set is dropped at the end (MF-PERF1 §7.1)`
        : '')
      + (unreachable.length ? `; ⚠ ${unreachable.length} TRUTH ANCHOR(S) remain sealed and are reported, never deleted (§8.1)` : ''),
  };
}

/** Exported so the census and the repair ask the identical question. */
export function bodyReachesMain(grid, lab, main, poly) { return bodyReaches(grid, lab, main, poly); }

/** shrinkToward, restated here so accessLaw imports nothing from the ground law. */
function shrinkTowardCentroid(poly, eps) {
  let cx = 0, cy = 0;
  for (const p of poly) { cx += p[0]; cy += p[1]; }
  cx /= poly.length; cy /= poly.length;
  return poly.map(([x, y]) => {
    const dx = x - cx, dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const t = Math.max(0, (d - eps) / d);
    return [cx + dx * t, cy + dy * t];
  });
}

/** The ORDINARY bodies whose ground touches a sealed anchor's — the ones that closed it in. */
function neighboursOf(bodies, target) {
  const box = (poly) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of poly) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    return { x0, y0, x1, y1 };
  };
  const t = box(target.poly);
  const pad = Math.max(t.x1 - t.x0, t.y1 - t.y0) * 0.5 + 1;
  const out = [];
  for (const o of bodies) {
    if (o === target || o.kind === 'institution' || !o.ref || o.field == null) continue;
    if (!o.poly || o.poly.length < 3) continue;
    const b = box(o.poly);
    if (b.x1 < t.x0 - pad || b.x0 > t.x1 + pad || b.y1 < t.y0 - pad || b.y0 > t.y1 + pad) continue;
    out.push(o);
  }
  // Fixed order: the census's determinism law reaches into the repair.
  out.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return out;
}

/**
 * The ordinary bodies lying on the straight line from a sealed body to the nearest cell of
 * the served network — the rank the passage has to be cut through. Fixed construction: the
 * nearest main-component cell by squared distance with a fixed scan order, then every body
 * whose polygon the segment crosses.
 */
function corridorTo(grid, lab, main, bodies, target) {
  const { n, cell, blocked } = grid;
  let cx = 0, cy = 0;
  for (const p of target.poly) { cx += p[0]; cy += p[1]; }
  cx /= target.poly.length; cy /= target.poly.length;
  const ci = Math.floor(cx / cell), cj = Math.floor(cy / cell);
  let best = null, bestD = Infinity;
  const R = 140;                                   // fixed search radius in cells
  for (let dj = -R; dj <= R; dj++) {
    for (let di = -R; di <= R; di++) {
      const i = ci + di, j = cj + dj;
      if (i < 0 || j < 0 || i > n - 1 || j > n - 1) continue;
      const c = j * n + i;
      if (blocked[c] || lab[c] !== main) continue;
      const d = di * di + dj * dj;
      if (d < bestD) { bestD = d; best = [(i + 0.5) * cell, (j + 0.5) * cell]; }
    }
  }
  if (!best) return [];
  const out = [];
  for (const o of bodies) {
    if (o === target || o.kind === 'institution' || !o.ref || o.field == null) continue;
    if (!o.poly || o.poly.length < 3) continue;
    if (segmentCrossesPoly(cx, cy, best[0], best[1], o.poly)) out.push(o);
  }
  out.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return out;
}

/** Does the segment a→b touch the polygon (crossing an edge, or starting inside it)? */
function segmentCrossesPoly(ax, ay, bx, by, poly) {
  for (let i = 0, k = poly.length - 1; i < poly.length; k = i++) {
    const cx = poly[k][0], cy = poly[k][1], dx = poly[i][0], dy = poly[i][1];
    const r0 = bx - ax, r1 = by - ay, s0 = dx - cx, s1 = dy - cy;
    const den = r0 * s1 - r1 * s0;
    if (den === 0) continue;
    const t = ((cx - ax) * s1 - (cy - ay) * s0) / den;
    const u = ((cx - ax) * r1 - (cy - ay) * r0) / den;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
  }
  return false;
}

/**
 * ⭐⭐ THE ACCESS SET — the DRAWN bodies, each carrying a writable back-reference so the repair
 * can act on the real fabric rather than on a copy. It is `footprints()`'s sibling and it is
 * built HERE rather than in the compile for the §195.0 reason: a set that lives beside the law
 * that consumes it is a set somebody maintains when a new body kind arrives.
 *
 * ⚠ INSTITUTION SOLIDS ENTER AS CLAIMS, NOT CANDIDATES — no `ref`, so the repair can never
 * shrink one. §8.1: a cathedral is a truth anchor and does not give way to a cottage; when an
 * anchor is the thing that is sealed, its NEIGHBOURS give way (see repairAccess).
 */
export function collectAccessBodies(a) {
  const out = [];
  const merged = a.merged || new Set();
  for (const p of (a.parcels || [])) {
    if (!merged.has(p.key) && p.polygon && p.polygon.length >= 3) out.push({ key: p.key, kind: 'parcel', poly: p.polygon, ref: p, field: 'polygon' });
    if (p.backHouse && p.backHouse.length >= 3) out.push({ key: `${p.key}#back`, kind: 'backHouse', poly: p.backHouse, ref: p, field: 'backHouse' });
  }
  for (const m of (a.masses || [])) if (m.polygon && m.polygon.length >= 3) out.push({ key: m.key || 'mass', kind: 'mass', poly: m.polygon, ref: m, field: 'polygon' });
  for (const h of (a.huts || [])) if (h.polygon && h.polygon.length >= 3) out.push({ key: h.key || 'hut', kind: 'hut', poly: h.polygon, ref: h, field: 'polygon' });
  const fb = a.faubourgs || { buildings: [], leanTos: [] };
  for (const b of (fb.buildings || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'faubourg', poly: b.polygon, ref: b, field: 'polygon' });
  for (const b of (fb.leanTos || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'leanTo', poly: b.polygon, ref: b, field: 'polygon' });
  for (const lm of (a.institutions || [])) {
    for (let i = 0; i < (lm.solids || []).length; i++) {
      if (lm.solids[i].length >= 3) out.push({ key: `!inst|${lm.instanceKey}|${i}`, kind: 'institution', poly: lm.solids[i] });
    }
  }
  return out;
}
