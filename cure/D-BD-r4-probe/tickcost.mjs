// tickcost.mjs — L-BD item 49 (c): a PROXY measurement of the body step's per-tick cost at scale.
// The reads it stands for are UNBUILT (bodyRadius, believedWatch/trailWatchOf, patrolEncounter), so this
// times the SHAPE of the work they will do, never the reads themselves:
//   per body: a radius BFS over the overt+hidden graph to R hops; for every country in the radius,
//   a believed-coverage lookup on each of its stretches (a Map get per stretch, as PR's per-power
//   belief map would be); a weighted choice over <= 7 options; then ONE encounter test per patrol
//   standing in the body's current country (patrols placed ~2 per town).
// Graph: a jittered grid of N nodes, degree ~4 (the digest's primary hops), plus ~0.6 trails per node.
// Deterministic (a seeded LCG); no I/O inside the timed loop. Run: node tickcost.mjs
function lcg(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function buildWorld(N, rnd) {
  const side = Math.ceil(Math.sqrt(N));
  const adj = Array.from({ length: N }, () => []);
  const add = (a, b) => { if (a !== b && !adj[a].includes(b)) { adj[a].push(b); adj[b].push(a); } };
  for (let i = 0; i < N; i++) {
    const x = i % side, y = Math.floor(i / side);
    if (x + 1 < side && i + 1 < N) add(i, i + 1);
    if (i + side < N) add(i, i + side);
    if (rnd() < 0.6) { const j = Math.min(N - 1, i + side + 1); add(i, j); } // trails across cover
  }
  // believed coverage per (observer, stretch): sparse Map keyed "obs|a|b"
  const watch = new Map();
  for (let a = 0; a < N; a++) for (const b of adj[a]) if (rnd() < 0.5) watch.set(`${a}|${a}|${b}`, rnd());
  const patrolsAt = Array.from({ length: N }, () => (rnd() < 0.8 ? 2 : 1));
  return { adj, watch, patrolsAt };
}

function stepBodies(world, bodies, R, rnd) {
  let work = 0;
  for (const b of bodies) {
    // radius BFS
    const seen = new Set([b.at]); let frontier = [b.at];
    for (let h = 0; h < R; h++) {
      const next = [];
      for (const n of frontier) for (const m of world.adj[n]) if (!seen.has(m)) { seen.add(m); next.push(m); }
      frontier = next;
    }
    // believed coverage over every stretch in the radius (observer = the body's home tie town)
    let best = -1, bestScore = -Infinity;
    for (const c of seen) {
      let cov = 0;
      for (const m of world.adj[c]) { cov += world.watch.get(`${b.home}|${c}|${m}`) || 0; work++; }
      const score = (1 - Math.min(1, cov)) * (0.5 + rnd());
      if (score > bestScore) { bestScore = score; best = c; }
    }
    // weighted choice over 7 options
    let tot = 0; const w = []; for (let k = 0; k < 7; k++) { const x = 0.25 + rnd() * 3.75; w.push(x); tot += x; }
    let r = rnd() * tot, pick = 0; while (r > w[pick] && pick < 6) { r -= w[pick]; pick++; }
    // move one hop toward best (or stay), then encounter tests against patrols in the country
    if (best !== b.at && world.adj[b.at].length) b.at = world.adj[b.at][Math.floor(rnd() * world.adj[b.at].length)];
    for (let p = 0; p < world.patrolsAt[b.at]; p++) { if (rnd() < 0.1) work++; work++; }
    b.choice = pick;
  }
  return work;
}

const rows = [];
for (const N of [30, 300, 3000, 10000]) {
  const rnd = lcg(81963 + N);
  const world = buildWorld(N, rnd);
  const B = Math.max(3, Math.floor(N / 2)); // the volume's world cap: one body per two settlements, min 3
  const bodies = Array.from({ length: B }, (_, i) => ({ at: Math.floor(rnd() * N), home: Math.floor(rnd() * N), choice: 0, i }));
  for (const R of [2, 3]) {
    // warm up
    for (let t = 0; t < 3; t++) stepBodies(world, bodies, R, rnd);
    const T = N >= 3000 ? 10 : 50;
    const t0 = process.hrtime.bigint();
    let work = 0;
    for (let t = 0; t < T; t++) work += stepBodies(world, bodies, R, rnd);
    const ms = Number(process.hrtime.bigint() - t0) / 1e6 / T;
    rows.push({ settlements: N, bodies: B, radiusHops: R, msPerTick: Number(ms.toFixed(3)), lookupsPerTick: Math.round(work / T) });
  }
}
console.log(JSON.stringify({ node: process.version, rows }, null, 1));
