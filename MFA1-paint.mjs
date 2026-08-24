/**
 * MFA1-paint.mjs — lane MF-A1: the PAINTED-FOLIO post-lens transform (prototype).
 *
 * Standalone module. Consumes a FROZEN b6 lens SVG + the exemplar's manifest seed;
 * emits the painted SVG. Deterministic: every stochastic choice (turbulence seeds,
 * foxing spots, fold line, stain phase) derives from fnv1a(`${seed}::a1-paint:v1`)
 * through mulberry32, drawn in fixed order. No Math.random, no Date, no ambient state.
 *
 * THE PAINTED-FOLIO STACK (each mechanic → the observed reference property):
 *   P1 paper base     → refs' ground is warm cream ~L228 (hf3 #F1DEC7), not b6's #ded5b8 L202
 *   P2 grain          → measured full-res grain sigma ≈ 11 (hf30/hf61); b6 has 5 (all AA)
 *   P3 stains         → measured LOW-FREQ stain amplitude 19–31 (all anchors); b6 8.5
 *   P4 vignette+fold  → corners −10..−22 L vs center (hf3 −18.6, hf14 −22.3); folds in hf3/hf30
 *   P5 foxing         → discrete brown spots, hf3/hf61
 *   W1 warm remap     → every anchor cluster is R>G>B warm; b6 field greens are grey-green
 *   W2 wash mottle    → pigment-density variation inside every wash (hf3 profile: ±9 L structure)
 *   W3 pooled edge    → dark tidemark rim at wash boundaries (hf3 fields, hf30 water)
 *   W4 wash slop      → wash boundary wanders a few px off the ink line (hf3 core)
 *   I1 ink warm       → hf30 ink cluster #432E22 (warm umber, not near-black)
 *   I2 weight ladder  → refs run block-perimeter ink FAR heavier than b6's uniform 0.84
 *   I3 seeded waver   → every ref line trembles ~1px (the hand; chartered at §11.12b)
 *   M1 mass shadow    → hard SE offset shadow under building masses (hf3 core, hf30 docks; §9.5 era-legal)
 *   A1 water banks    → heavy dark bank line under the water band (hf30 river)
 *
 * OP DISCIPLINE: all texture lands in defs (filters, applied per-GROUP); new drawn
 * elements are the aging overlay + water-bank dups + foxing (≈ +8..12 per leaf).
 * Stroke additions to existing paths are zero new ops.
 */
import { readFileSync, writeFileSync } from 'node:fs';

// ---------- seeded streams ----------
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- color helpers ----------
const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb2hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;

function darken(h, dL) {
  const c = hex2rgb(h);
  const k = Math.max(0, 1 - dL / Math.max(1, lum(c)));
  return rgb2hex(c[0] * k, c[1] * k, c[2] * k);
}

/** W1 THE WARM REMAP — pure function of (input hex, role). */
function warmRemap(h, role = 'fill') {
  let [r, g, b] = hex2rgb(h);
  const L = lum([r, g, b]);
  const isGreenish = g >= r - 4 && g > b + 10;
  const isCoolGrey = Math.abs(r - g) < 22 && Math.abs(g - b) < 22 && b >= r - 6;
  // boundary/hedge hairline strokes: refs draw every parcel bound in visible ink
  if (role === 'stroke' && L > 135 && L <= 205 && !isCoolGrey) {
    const k = Math.max(0, 1 - 26 / L);
    return rgb2hex((r * k) * 1.04 + 4, g * k, (b * k) * 0.92);
  }
  if (h.toLowerCase() === '#ded5b8') return '#F2E3C9';           // base sheet → paper (atlas §2.3.1 band #F7E1C8–#FEF9ED; sits at its warm floor so the aging overlay lands inside it)
  if (isCoolGrey && L > 90 && L < 200) return rgb2hex(r * 0.94 + 4, g * 0.97 + 2, b * 0.84 - 6);  // water → grey-green
  if (isGreenish && L > 120) return rgb2hex(r * 1.04 + 6, g * 0.99, b * 0.90 - 2);          // greens
  if (L > 195 && b < g && g < r + 6) return rgb2hex(r * 1.01 + 4, g + 1, b * 0.94 - 2);     // creams
  if (L < 60) return rgb2hex(r * 1.12 + 8, g * 1.02, b * 0.9);                              // inks → umber
  return rgb2hex(r * 1.02 + 2, g, b * 0.97);
}

// ---------- structural group wrapping ----------
/** find [start, endAfterClose) of <g id="X" ...>...</g> by depth walk */
function groupSpan(t, id) {
  const start = t.indexOf(`<g id="${id}"`);
  if (start < 0) return null;
  const re = /<g[\s>]|<\/g>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(t))) {
    if (m[0] === '</g>') { depth--; if (depth === 0) return [start, m.index + 4]; }
    else depth++;
  }
  throw new Error(`a1-paint: unbalanced <g> hunting ${id}`);
}
function wrapGroup(t, id, openTags, closeTags) {
  const span = groupSpan(t, id);
  if (!span) return t;
  const [s, e] = span;
  return t.slice(0, s) + openTags + t.slice(s, e) + closeTags + t.slice(e);
}

// ---------- the transform ----------
export function paint(svgText, manifestSeed) {
  const rng = mulberry32(fnv1a(`${manifestSeed}::a1-paint:v1`));
  const ri = (lo, hi) => Math.floor(lo + rng() * (hi - lo + 1));
  const rf = (lo, hi) => lo + rng() * (hi - lo);
  // fixed draw order — never reorder (determinism)
  const sGrain = ri(1, 9999), sStain = ri(1, 9999), sWaver = ri(1, 9999),
        sMottle = ri(1, 9999), sSlop = ri(1, 9999);
  const foxN = ri(2, 4);
  const fox = [];
  for (let i = 0; i < foxN; i++) {
    fox.push({ x: ri(60, 940), y: ri(60, 940), r: rf(2.5, 6.5), ry: rf(0.7, 1.05), o: rf(0.08, 0.16) });
  }
  const foldX = ri(300, 700), foldTilt = rf(-2.5, 2.5);
  const stainAlpha = (0.10 + rf(-0.015, 0.015)).toFixed(3);

  let t = svgText;

  // --- W3 + parcel-paint pass FIRST, on ORIGINAL hexes (water detection is only
  //     reliable pre-remap: the warm remap deliberately destroys coolness) ---
  const prng = mulberry32(fnv1a(`${manifestSeed}::a1-parcel:v1`));
  const fabricStart0 = t.indexOf('<g id="fabric"');
  if (fabricStart0 < 0) throw new Error('a1-paint: no fabric group');
  let head0 = t.slice(0, fabricStart0), tail0 = t.slice(fabricStart0);
  head0 = head0.replace(/<path d="([^"]+)" fill="(#[0-9A-Fa-f]{6})" stroke="none"\/>/g, (m, d, f) => {
    const c = hex2rgb(f);
    const L = lum(c);
    const water = Math.abs(c[0] - c[1]) < 12 && Math.abs(c[1] - c[2]) < 14 && c[2] >= c[0] - 6;
    if (water && L > 100 && L < 210) {      // the sea / still water: true coastline rim (hf30 banks)
      return `<path d="${d}" fill="${f}" stroke="#45331F" stroke-opacity="0.8" stroke-width="3.2"/>`;
    }
    if (L < 118 || L > 246) return m;
    // per-parcel tone + HUE-FAMILY jitter (§2.2: the patchwork runs 4–6 muted tones —
    // sage/olive/cream/umber — not one khaki band) with paper-breathing bias
    let dL = (prng() - 0.5) * 14;
    if (L > 205) dL += 5;                    // pale creams drift toward bare paper (§9.2 restraint)
    const fam = prng();
    let [r2, g2, b2] = c;
    if (fam < 0.28) { g2 += 9; r2 -= 4; }                 // sage pull
    else if (fam < 0.5) { r2 += 9; g2 -= 1; b2 -= 5; }    // umber pull
    else if (fam < 0.62) { r2 += 4; g2 += 3; b2 += 7; dL += 6; }  // pale cream
    const k = Math.max(0.2, 1 + dL / L);
    const nf = rgb2hex(r2 * k, g2 * k, b2 * k);
    return `<path d="${d}" fill="${nf}" stroke="${darken(nf, 26)}" stroke-opacity="0.5" stroke-width="2.1"/>`;
  });
  t = head0 + tail0;

  // --- A1: water banks on ORIGINAL hexes — dup wide cool strokes: bank under, heart over ---
  let bankDups = 0;
  t = t.replace(/<path d="([^"]+)"([^>]*?)stroke="(#[0-9A-Fa-f]{6})"([^>]*?)stroke-width="([0-9.]+)"([^>]*?)\/>/g,
    (m, d, a, sc, b2, w, c) => {
      const v = parseFloat(w);
      const rgb = hex2rgb(sc);
      const L = lum(rgb);
      const coolish = Math.abs(rgb[0] - rgb[1]) < 22 && rgb[2] > rgb[1] - 8 && L > 110 && L < 200;
      if (v >= 8 && coolish) {
        bankDups++;
        const heart = darken(sc, -14);       // negative dL lightens
        return `<path d="${d}"${a}stroke="#45331F"${b2}stroke-width="${(v * 1.18).toFixed(2)}"${c}/>` + m
          + `<path d="${d}"${a}stroke="${heart}"${b2}stroke-width="${(v * 0.5).toFixed(2)}"${c}/>`;
      }
      return m;
    });

  // --- W1/I1: global palette remap (role-aware) ---
  t = t.replace(/(fill|stroke)="(#[0-9A-Fa-f]{6})"/g, (m, role, h) => `${role}="${warmRemap(h, role)}"`);

  // --- defs ---
  const defs = `<defs id="a1defs">
<filter id="a1grain" x="0%" y="0%" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${sGrain}" result="n"/>
<feColorMatrix in="n" type="matrix" values="0 0 0 0 0.33  0 0 0 0 0.26  0 0 0 0 0.15  0.30 0.30 0.30 0 -0.34" result="g"/>
<feComposite in="g" in2="SourceGraphic" operator="in"/>
</filter>
<filter id="a1stain" x="-5%" y="-5%" width="110%" height="110%">
<feTurbulence type="fractalNoise" baseFrequency="0.0095" numOctaves="4" seed="${sStain}" result="n"/>
<feComponentTransfer in="n" result="nt"><feFuncA type="discrete" tableValues="0 0 0 0.3 0.6 0.85"/></feComponentTransfer>
<feColorMatrix in="nt" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.31  0 0 0 0 0.16  0 0 0 ${stainAlpha} 0" result="s"/>
<feComposite in="s" in2="SourceGraphic" operator="in"/>
</filter>
<filter id="a1vig" x="-40%" y="-40%" width="180%" height="180%">
<feGaussianBlur stdDeviation="34"/>
</filter>
<filter id="a1hand" x="-4%" y="-4%" width="108%" height="108%">
<feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="${sWaver}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="a1mottle" x="0%" y="0%" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.062" numOctaves="3" seed="${sMottle}" result="n"/>
<feColorMatrix in="n" type="matrix" values="0 0 0 0 0.24  0 0 0 0 0.18  0 0 0 0 0.09  0.45 0.45 0.45 0 -0.52" result="m"/>
<feComposite in="m" in2="SourceGraphic" operator="in" result="mi"/>
<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="mi"/></feMerge>
</filter>
<filter id="a1slop" x="-4%" y="-4%" width="108%" height="108%">
<feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="2" seed="${sSlop}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="5.5" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="a1shadow" x="-8%" y="-8%" width="116%" height="116%">
<feFlood flood-color="#2E2013" flood-opacity="0.34" result="f"/>
<feComposite in="f" in2="SourceAlpha" operator="in" result="sh"/>
<feOffset in="sh" dx="2" dy="2" result="osh"/>
<feMerge><feMergeNode in="osh"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="a1block" x="-8%" y="-8%" width="116%" height="116%">
<feFlood flood-color="#2E2013" flood-opacity="0.34" result="f"/>
<feComposite in="f" in2="SourceAlpha" operator="in" result="sh"/>
<feOffset in="sh" dx="2" dy="2" result="osh"/>
<feMorphology in="SourceAlpha" operator="dilate" radius="0.9" result="dil"/>
<feFlood flood-color="#33231A" flood-opacity="0.85" result="bf"/>
<feComposite in="bf" in2="dil" operator="in" result="blk"/>
<feMerge><feMergeNode in="osh"/><feMergeNode in="blk"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
</defs>`;
  t = t.replace(/(<svg[^>]*>)/, `$1\n${defs}`);

  // --- I2: the weight ladder (after bank dup so dups keep their computed widths) ---
  t = t.replace(/stroke-width="([0-9.]+)"/g, (m, w) => {
    const v = parseFloat(w);
    let k = 1;
    if (v >= 3 && v < 8) k = 1.3;           // walls, heavy silhouettes
    else if (v >= 1.2 && v < 3) k = 1.35;   // landmark outlines, text halos
    else if (v >= 0.6 && v < 1.2) k = 1.5;  // fabric outlines (block pass adds the perimeter weight)
    else if (v < 0.6) k = 1.6;              // field/parcel hairlines — visible bounds in refs
    return `stroke-width="${(v * k).toFixed(2)}"`;
  });

  // --- W2/W4: wrap wash groups; I3/M1: wrap ink groups (structural, innermost-first not needed
  //     since ids are unique and wrappers carry no id) ---
  // ground washes: the run of pre-group paths after the base rect
  const baseRectEnd = t.indexOf('/>', t.indexOf('<rect x="0" y="0"')) + 2;
  const firstG = t.indexOf('<g', baseRectEnd);
  t = t.slice(0, baseRectEnd)
    + '\n<g id="a1groundwash" filter="url(#a1slop)"><g filter="url(#a1mottle)">'
    + t.slice(baseRectEnd, firstG) + '</g></g>\n' + t.slice(firstG);
  // fields carries ink (hedges/trees/river) so it takes mottle only; squares/yards are
  // pure wash and take the mis-registration slop too (atlas §2.3.3.4 — the decisive tell)
  t = wrapGroup(t, 'fields', '<g filter="url(#a1mottle)" data-a1="wash-fields">', '</g>');
  for (const id of ['squares', 'yards']) {
    t = wrapGroup(t, id, `<g filter="url(#a1slop)" data-a1="slop-${id}"><g filter="url(#a1mottle)">`, '</g></g>');
  }
  // fabric: GAP-D block-perimeter pass (feMorphology dilate under source = heavy connected-mass
  // silhouette, thin interior party seams) + shadow + hand; landmarks: shadow + hand
  t = wrapGroup(t, 'fabric', '<g filter="url(#a1block)" data-a1="mass-fabric"><g filter="url(#a1hand)">', '</g></g>');
  t = wrapGroup(t, 'landmarks', '<g filter="url(#a1shadow)" data-a1="mass-landmarks"><g filter="url(#a1hand)">', '</g></g>');

  // --- P2–P5: the aging overlay ---
  const overlay = `<g id="a1aging" pointer-events="none">
<rect x="0" y="0" width="1000" height="1000" fill="#EDDCBB" filter="url(#a1grain)" opacity="0.9"/>
<rect x="0" y="0" width="1000" height="1000" fill="#EDDCBB" filter="url(#a1stain)" opacity="0.75"/>
<rect x="14" y="14" width="972" height="972" fill="none" stroke="#5C452C" stroke-width="46" opacity="0.14" filter="url(#a1vig)"/>
<path d="M${foldX} 0 L${foldX + Math.round(foldTilt * 10)} 1000" stroke="#6B5433" stroke-width="1.1" opacity="0.07" fill="none"/>
${fox.map((f) => `<ellipse cx="${f.x}" cy="${f.y}" rx="${f.r.toFixed(1)}" ry="${(f.r * f.ry).toFixed(1)}" fill="#7A5B33" opacity="${f.o.toFixed(2)}"/>`).join('\n')}
</g>`;
  t = t.replace(/<\/svg>\s*$/, `${overlay}\n</svg>`);

  // --- structure check ---
  const opens = (t.match(/<g[\s>]/g) || []).length;
  const closes = (t.match(/<\/g>/g) || []).length;
  if (opens !== closes) throw new Error(`a1-paint: unbalanced groups after wrap (${opens} vs ${closes})`);
  return { svg: t, stats: { bankDups, foxN } };
}

// ---------- CLI ----------
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , inPath, outPath, seed] = process.argv;
  if (!inPath || !outPath || !seed) {
    console.error('usage: node MFA1-paint.mjs <in.svg> <out.svg> <manifestSeed>');
    process.exit(2);
  }
  const src = readFileSync(inPath, 'utf8');
  const { svg, stats } = paint(src, seed);
  writeFileSync(outPath, svg);
  console.log(`painted ${outPath} bankDups=${stats.bankDups} fox=${stats.foxN} bytes=${svg.length}`);
}
