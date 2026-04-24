/**
 * graphLayout.js — Layout algorithms for relationship-graph diagrams.
 *
 * Used by the PDF exporter to position settlement nodes on a page.
 * Two layout strategies:
 *   - circularLayout:  even angle distribution around a circle (1–8 nodes)
 *   - forceLayout:     spring-based force simulation (larger graphs)
 *
 * All layouts return nodes normalised to the [0,1] unit square.
 * The caller multiplies by the target pixel/mm dimensions.
 */

/**
 * Place nodes evenly around a circle.
 * @param {Array} nodes — [{id, label, ...}]
 * @returns {Array} — [{id, x, y, ...}]  (x,y in [0,1])
 */
export function circularLayout(nodes) {
  const n = nodes.length;
  if (n === 0) return [];
  if (n === 1) return [{ ...nodes[0], x: 0.5, y: 0.5 }];

  const cx = 0.5;
  const cy = 0.5;
  const r = 0.36;
  return nodes.map((node, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2; // start at top
    return {
      ...node,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

/**
 * Force-directed layout: springs on edges pulling connected nodes together,
 * repulsion between all pairs pushing them apart. Runs a fixed number of
 * iterations, no need for a library.
 *
 * @param {Array} nodes — [{id, ...}]
 * @param {Array} edges — [{from, to, ...}]
 * @param {Object} opts
 * @returns {Array} — [{id, x, y, ...}]
 */
export function forceLayout(nodes, edges, opts = {}) {
  const {
    iterations = 120,
    repulsion = 0.025,     // global repulsion strength
    springLength = 0.28,   // ideal edge length
    springK = 0.06,        // spring stiffness
    damping = 0.72,        // velocity damping per tick
    centering = 0.012,     // force pulling toward center
  } = opts;

  const n = nodes.length;
  if (n === 0) return [];
  if (n === 1) return [{ ...nodes[0], x: 0.5, y: 0.5 }];
  if (n <= 8) return circularLayout(nodes);

  // Seed deterministically from node IDs so the same graph produces the
  // same layout across runs (no jitter between re-renders).
  const seed = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return ((h & 0x7fffffff) % 1000) / 1000;
  };

  const positions = nodes.map((node, i) => ({
    id: node.id,
    data: node,
    x: 0.5 + (seed(`${node.id}-x`) - 0.5) * 0.5,
    y: 0.5 + (seed(`${node.id}-y`) - 0.5) * 0.5,
    vx: 0,
    vy: 0,
  }));

  const indexById = new Map(positions.map((p, i) => [p.id, i]));

  for (let iter = 0; iter < iterations; iter++) {
    // Pairwise repulsion
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = positions[i];
        const b = positions[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.001) {
          dx = (Math.random() - 0.5) * 0.01;
          dy = (Math.random() - 0.5) * 0.01;
          dist = 0.01;
        }
        const force = repulsion / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    // Spring forces on edges
    for (const edge of edges) {
      const i = indexById.get(edge.from);
      const j = indexById.get(edge.to);
      if (i == null || j == null) continue;
      const a = positions[i];
      const b = positions[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const force = springK * (dist - springLength);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }

    // Centering force
    for (const p of positions) {
      p.vx += (0.5 - p.x) * centering;
      p.vy += (0.5 - p.y) * centering;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= damping;
      p.vy *= damping;
    }
  }

  // Normalize to [0,1] with padding so nothing sits on the edge
  const padding = 0.08;
  const xs = positions.map(p => p.x);
  const ys = positions.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = Math.max(0.001, maxX - minX);
  const rangeY = Math.max(0.001, maxY - minY);

  return positions.map(p => ({
    ...p.data,
    x: padding + ((p.x - minX) / rangeX) * (1 - padding * 2),
    y: padding + ((p.y - minY) / rangeY) * (1 - padding * 2),
  }));
}

/**
 * Dispatch to the right layout based on node count.
 * @param {Array} nodes
 * @param {Array} edges
 */
export function autoLayout(nodes, edges) {
  if (!nodes || nodes.length === 0) return [];
  if (nodes.length <= 8) return circularLayout(nodes);
  return forceLayout(nodes, edges || []);
}
