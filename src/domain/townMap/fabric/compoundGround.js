/**
 * domain/townMap/fabric/compoundGround.js — ⭐⭐ §15.3 THE GROUND A MONUMENTAL COMPOUND RESERVES,
 * AS ONE PREDICATE.
 *
 * ⭐⭐⭐ THE OWNER'S LAW IT SERVES (§15.3, from the peer review): *"large institutional compounds
 * reserve land BEFORE parcel-cutting; ordinary institutions seat INTO already-cut compatible
 * parcels; housing/yards fill last. PARCELS NEVER BEND AROUND A HUNDRED LATE FOOTPRINTS."* The
 * precinct was walled before the street was laid out, which is exactly why real cathedral closes
 * interrupt their street grids.
 *
 * ⛔ WHAT THIS EXTRACTION FIXES, AND IT IS THIS PROGRAMME'S OWN CARDINAL DEFECT CLASS. The
 * assembly carried the compound disc test **FOUR TIMES** — in `forbiddenWithCompounds`, in
 * `forbiddenPhysical`, and twice more inside `forbiddenFor`'s two closures — as four literal
 * copies of `dx*dx + dy*dy < c.r*c.r`. ⭐ THE CLASS, which `wallCircuit`'s `n6`/`polyText`, the
 * gate split, the reroll salt and `wallClaims` have each supplied a member of: **A PRIVATE
 * SPELLING OF A SHARED RULE IS A DIVERGENCE WAITING FOR SOMEBODY TO EDIT ONE COPY.** Four copies
 * of one circle is four chances for a later lane to widen a compound in three places.
 *
 * ⚠ IT IS A MOVE, NOT A CHANGE, AND THE CORPUS IS BYTE-IDENTICAL ACROSS IT (MF-PERF1). The
 * arithmetic, the operand order and the strict `<` are the assembly's own; `over()` returns
 * `true`/`false` exactly as the four hand-written closures did, so a caller that treats the
 * result as anything but a boolean sees the same value it saw before.
 *
 * ⭐ AND IT RELIEVES THE ASSEMBLY'S LINE BUDGET, which is why it is this lane's business at all:
 * `buildFabric.js` stood at 791 effective lines against the 800 domain ceiling with MF-W0's
 * hazard reading *"the next member added to the assembly breaks the ratchet; W1's substrate
 * cannot land inside it."*
 *
 * PURITY: pure. No Date, no Math.random, no runtime trig, no localeCompare.
 */

/**
 * The compound each seated monumental claims: a disc at its own drawn footprint, plus its yard
 * or close. RESERVED ground, not a drawn shape — the lens draws the archetype inside it.
 *
 * @param {Array<{instanceKey:string, x:number, y:number, size:number}>} seated
 * @param {number} radiusShare  how much ground a compound reserves, in units of its drawn `size`
 * @returns {Array<{key:string, x:number, y:number, r:number}>}
 */
export function compoundDiscs(seated, radiusShare) {
  return seated.map((lm) => ({ key: lm.instanceKey, x: lm.x, y: lm.y, r: lm.size * radiusShare }));
}

/**
 * ⭐⭐ THE ONE COMPOUND PREDICATE, and the ONE way a stage-3 refusal is layered over it.
 *
 * `inside(x, y)` is the reservation itself. `over(base)` is the composition every consumer of
 * the reservation wants: *this ground is refused if the stage's own predicate refuses it OR if
 * a compound has already claimed it.* ⚠ THE ORDER IS THE ASSEMBLY'S — the base predicate is
 * asked FIRST and short-circuits, because it is the cheaper test and because that is the order
 * the four copies used.
 *
 * @param {Array<{x:number, y:number, r:number}>} compounds
 * @returns {{ inside:(x:number,y:number)=>boolean, over:(base:(x:number,y:number)=>any)=>(x:number,y:number)=>boolean }}
 */
export function compoundGround(compounds) {
  const inside = (x, y) => {
    for (const c of compounds) {
      const dx = x - c.x, dy = y - c.y;
      if (dx * dx + dy * dy < c.r * c.r) return true;
    }
    return false;
  };
  return { inside, over: (base) => (x, y) => (base(x, y) ? true : inside(x, y)) };
}
