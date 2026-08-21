/**
 * domain/townMap/arch/flyingButtress.js -- K-0 SPIKE: ONE flying-buttress bay.
 *
 * Hand-constructed 3D: a stepped PIER standing in front of the wall, an arced FLYER springing
 * from the pier head up to the wall (the segmental arch that transfers the vault thrust), and
 * the WALL PANEL it braces (returned so the scene can carry the window on it). The pier is a
 * true 3D mass emitting quad FACES with model-space normals, so the axonometric projector shows
 * top + a lit side + the front and per-face Lambert reads as a solid volume. The flyer is a 3D
 * BAR (a cubic-Bezier centerline) the raster shades as a rounded stone member -- and it is the
 * element that casts the soft shadow onto the wall (the penumbra demonstration).
 *
 * Model frame: x = east, y = depth toward the viewer, z = up. Curves are cubic Beziers only.
 * PURITY: {+, -, *, /} + Math.sqrt (0 transcendental sites); deterministic in `place`.
 *
 * @typedef {import('./geom.js').P3} P3
 * @typedef {import('./geom.js').Subpath} Subpath
 * @typedef {{ id: string, ring: ReadonlyArray<P3>, normal: readonly [number, number, number] }} Face
 * @typedef {{ id: string, sub: Subpath, width: number }} Bar
 * @typedef {{ bx: number, wallY: number, groundZ: number }} Place
 */

/** @type {readonly [number,number,number]} */ const NX_POS = [1, 0, 0];
/** @type {readonly [number,number,number]} */ const NX_NEG = [-1, 0, 0];
/** @type {readonly [number,number,number]} */ const NY_POS = [0, 1, 0];
/** @type {readonly [number,number,number]} */ const NZ_POS = [0, 0, 1];

/**
 * A box mass between [x0,x1] x [y0,y1] x [z0,z1] -> its four potentially-visible faces (front
 * +y, top +z, west -x, east +x). Back faces are culled later by projected winding.
 * @param {string} id @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1
 * @returns {Face[]}
 */
function boxFaces(id, x0, x1, y0, y1, z0, z1) {
  return [
    { id: `${id}.front`, normal: NY_POS, ring: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]] },
    { id: `${id}.top`, normal: NZ_POS, ring: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] },
    { id: `${id}.west`, normal: NX_NEG, ring: [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]] },
    { id: `${id}.east`, normal: NX_POS, ring: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]] },
  ];
}

/**
 * Build ONE flying-buttress bay + the wall it braces at `place`. Fixed dimensions
 * (deterministic). Returns 3D faces (wall + pier + cap), 3D bars (the flyer + a pinnacle),
 * and the wall placement so the scene can mount the window on it.
 * @param {Place} place
 * @returns {{ wall: Face, faces: ReadonlyArray<Face>, bars: ReadonlyArray<Bar>, wallPlane: { oy: number, groundZ: number } }}
 */
export function buildFlyingButtress(place) {
  const wallY = place.wallY;
  const gz = place.groundZ;

  // WALL PANEL (the braced wall) -- a tall stone face at depth wallY, facing +y (the viewer).
  const wallX0 = place.bx - 40, wallX1 = place.bx + 360, wallTop = gz + 372;
  /** @type {Face} */
  const wall = { id: 'wall', normal: NY_POS, ring: [
    [wallX0, wallY, gz], [wallX1, wallY, gz], [wallX1, wallY, wallTop], [wallX0, wallY, wallTop],
  ] };

  // PIER -- a stepped mass standing in front of the wall (larger y = nearer the viewer).
  const pierFrontY = wallY + 150;  // the pier's near face (well forward, so its side face shows)
  const pierBackY = wallY + 60;    // set off the wall
  const pierCX = place.bx - 10;
  const baseHalf = 40, midHalf = 32, topHalf = 25;
  const baseTop = gz + 150, midTop = gz + 300, pierTop = gz + 362;

  /** @type {Face[]} */
  const faces = [];
  // three diminishing stages (the classic set-off buttress)
  for (const stage of [
    { z0: gz, z1: baseTop, h: baseHalf, id: 'pier.base' },
    { z0: baseTop, z1: midTop, h: midHalf, id: 'pier.mid' },
    { z0: midTop, z1: pierTop, h: topHalf, id: 'pier.top' },
  ]) {
    for (const f of boxFaces(stage.id, pierCX - stage.h, pierCX + stage.h, pierBackY, pierFrontY, stage.z0, stage.z1)) {
      faces.push(f);
    }
  }
  // a sloped weathering CAP (a shallow pyramid) closing the pier head -- two visible slopes.
  const capZ = pierTop + 26;
  const apex = /** @type {P3} */ ([pierCX, (pierBackY + pierFrontY) / 2, capZ]);
  faces.push({ id: 'pier.cap.front', normal: NY_POS, ring: [
    [pierCX - topHalf, pierFrontY, pierTop], [pierCX + topHalf, pierFrontY, pierTop], apex,
  ] });
  faces.push({ id: 'pier.cap.west', normal: NX_NEG, ring: [
    [pierCX - topHalf, pierBackY, pierTop], [pierCX - topHalf, pierFrontY, pierTop], apex,
  ] });

  // FLYER -- a segmental arch (cubic Bezier) from the pier head up to the wall, just below the
  // window springing. Springs at the pier top-inner corner, lands high on the wall.
  const flyStartX = pierCX + topHalf * 0.2, flyStartZ = pierTop + 6;
  const flyEndX = wallX0 + 150, flyEndZ = gz + 380;
  /** @type {Subpath} */
  const flyer = {
    start: [flyStartX, pierFrontY - 10, flyStartZ],
    segs: [{
      t: 'C',
      c1: [flyStartX + 20, pierFrontY - 10, flyStartZ + 70],
      c2: [flyEndX - 40, (pierFrontY + wallY) / 2, flyEndZ + 30],
      p: [flyEndX, wallY + 6, flyEndZ],
    }],
    closed: false,
  };

  // a slender PINNACLE spiking the pier head (weights the buttress -- the gothic idiom).
  /** @type {Subpath} */
  const pinnacle = {
    start: [pierCX, (pierBackY + pierFrontY) / 2, capZ],
    segs: [{ t: 'L', p: [pierCX, (pierBackY + pierFrontY) / 2, capZ + 60] }],
    closed: false,
  };

  return {
    wall,
    faces,
    bars: [
      { id: 'flyer', sub: flyer, width: 16 },
      { id: 'pinnacle', sub: pinnacle, width: 8 },
    ],
    wallPlane: { oy: wallY, groundZ: gz },
  };
}
