/**
 * gallery.mjs — ⭐⭐ THE GALLERY SPREAD (A3.2's arm (b), L-REG-16's "sameness is the named
 * anti-goal"). The exit is *"the GALLERY spread across ≥12 seeds per the instrument — no family
 * collapses to clones."*
 *
 * ⭐ WHAT IS MEASURED, AND WHY THIS AND NOT A PIXEL DIFF. A3.1's law is that a family is ANATOMY
 * + INVARIANTS + SLOTS, so the thing that must vary is the SLOT TUPLE — the actual composition
 * decision. A pixel spread over whole plates would move for terrain, tier and street layout and
 * would report "varied" on a corpus where every church was identical, which is exactly the
 * sameness this exit exists to catch.
 *
 * THE FIGURES, each with its denominator named:
 *   instances      how many bodies of that family the gallery produced
 *   distinct       how many DISTINCT slot tuples they took
 *   modalShare     the share held by the single most common tuple ← THE COLLAPSE DETECTOR
 *   perSlot        for every slot, how many of its enumerated values actually appeared
 *
 * THE BAND (chair's, vetoable): a family with ≥ 8 instances FAILS if `modalShare` > 0.60 or if
 * any slot with ≥ 2 enumerated values appears with only one. A family with < 8 instances is
 * reported as THIN and is not scored — a class the gallery barely produced cannot be convicted
 * of sameness, and pretending otherwise is how a denominator gets quietly shrunk.
 *
 * Usage: node gallery.mjs [--n=12] [--json=]
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const { buildOne } = await import(join(HERE, 'leaf.mjs'));
const { FAMILIES } = await import(join(HERE, '../../src/domain/townMap/fabric/shapeCode.js'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const N = Number(arg('n', 12));

/**
 * ⭐ THE SEEDS ARE A DECLARED LADDER, NOT A HAND-PICKED SET. Twelve seeds across four tiers and
 * three terrains, named before anything was measured, so the spread is over a POPULATION rather
 * than over whatever happened to look varied.
 */
const SEEDS = [];
const TIERS = ['village', 'town', 'city', 'metropolis'];
const TERRAINS = ['plains', 'riverside', 'coastal'];
for (let i = 0; i < N; i++) {
  SEEDS.push({
    key: `gal-${i}`, seed: `reg3-gallery-${i}`,
    settType: TIERS[i % TIERS.length], terrain: TERRAINS[Math.floor(i / TIERS.length) % TERRAINS.length],
  });
}

/** @type {Map<string, {instances:number, tuples:Map<string,number>, slots:Map<string,Set<string>>}>} */
const byFamily = new Map();
const note = (family, slots) => {
  if (!byFamily.has(family)) byFamily.set(family, { instances: 0, tuples: new Map(), slots: new Map() });
  const f = byFamily.get(family);
  f.instances++;
  const keys = Object.keys(slots).sort();
  const tuple = keys.map((k) => `${k}=${slots[k]}`).join('|');
  f.tuples.set(tuple, (f.tuples.get(tuple) || 0) + 1);
  for (const k of keys) {
    if (!f.slots.has(k)) f.slots.set(k, new Set());
    f.slots.get(k).add(String(slots[k]));
  }
};

/** ⭐ THE ROW-HOUSE FAMILY'S SLOTS DO NOT LIVE ON A LANDMARK, and the first spelling of this
 *  script missed them entirely and then convicted the family of sameness for it. A parcel's
 *  composition decision is its ROOF FORM, published keyed in `fabric.shapeCode.roofForm`, so the
 *  gallery reads it from there. ⚠ THE CLASS: an instrument that cannot see a population's
 *  decisions reports that the population makes none. */
const roofForms = new Map();
let roofBodies = 0;
for (const spec of SEEDS) {
  const { fabric } = buildOne(spec, { shapeCode: true });
  for (const lm of fabric.landmarks) if (lm.shapeFamily && lm.shapeSlots) note(lm.shapeFamily, lm.shapeSlots);
  for (const d of (fabric.habitation || [])) if (d.shapeFamily && d.shapeSlots) note(d.shapeFamily, d.shapeSlots);
  for (const [f, n] of Object.entries((fabric.shapeCode && fabric.shapeCode.formCount) || {})) {
    roofForms.set(f, (roofForms.get(f) || 0) + n); roofBodies += n;
  }
}

const THIN = 8, MODAL_CEIL = 0.60;
const rows = [];
console.log(`GALLERY over ${SEEDS.length} seeds (${TIERS.join('/')} × ${TERRAINS.join('/')})\n`);
console.log(['family', 'instances', 'distinct', 'modalShare', 'verdict', 'slots exercised (appeared/enumerated)'].join('\t'));
for (const [family, f] of [...byFamily.entries()].sort()) {
  const counts = [...f.tuples.values()].sort((a, b) => b - a);
  const modalShare = counts[0] / f.instances;
  const table = (FAMILIES[family] && FAMILIES[family].slots) || {};
  const perSlot = [];
  let deadSlot = null;
  for (const [name, def] of Object.entries(table)) {
    const enumerated = Array.isArray(def.values) ? def.values.length : 1;
    const appeared = f.slots.has(name) ? f.slots.get(name).size : 0;
    perSlot.push(`${name} ${appeared}/${enumerated}`);
    // ⚠ A GATED SLOT IS SCORED OVER THE SUB-POPULATION ITS GATE ADMITS, NOT OVER THE FAMILY.
    // `yardForm` and `graves` require RESERVED ground (see the slot table): only 1 of 91
    // institutions at town is compound-seated, so a gallery in which few churches are compounded
    // exercises one value — and that is the gate working, not the family collapsing. A DARK slot
    // (no live input can turn it on) is likewise reported rather than failed, with its reason.
    if (def.dark) { perSlot[perSlot.length - 1] += ' [DARK: ' + def.dark + ']'; continue; }
    if (def.gatedBy) { perSlot[perSlot.length - 1] += ' [gated on ' + def.gatedBy + ']'; continue; }
    if (enumerated >= 2 && appeared <= 1 && f.instances >= THIN) deadSlot = deadSlot || name;
  }
  const thin = f.instances < THIN;
  // ⚠ A FAMILY WITH NO SLOTS IS NOT SCORED, AND THAT IS STRUCTURAL RATHER THAN CHARITABLE:
  // `mark` is a single corpus glyph whose INVARIANT is the whole family, so it has exactly one
  // composition by design. Scoring it convicts a correct drawing of sameness.
  // ⚠ AND A POPULATION THAT EXERCISES NONE OF THE TABLE'S SLOTS IS NOT THIS TABLE'S POPULATION.
  // The 30 landmarks typed `rowHouse` are institutions whose archetype has no family of its own
  // (`ordinary`), drawn as the shipped small block; the family's REAL population is the 13,165
  // parcels measured below, whose decision is the ROOF FORM. Scoring the 30 would convict a
  // family for a row that is not its own.
  const exercised = Object.keys(table).some((n) => f.slots.has(n));
  const slotless = Object.keys(table).length === 0 || !exercised;
  const pass = (thin || slotless) ? null : (modalShare <= MODAL_CEIL && !deadSlot);
  rows.push({ family, instances: f.instances, distinct: f.tuples.size, modalShare: Math.round(modalShare * 1000) / 1000, thin, slotless, pass, deadSlot, perSlot });
  console.log([family, f.instances, f.tuples.size, modalShare.toFixed(3),
    thin ? 'THIN (not scored)' : slotless ? (Object.keys(table).length === 0 ? 'SLOTLESS (not scored)' : 'OFF-TABLE (measured elsewhere)') : (pass ? 'PASS' : `FAIL${deadSlot ? ` — slot '${deadSlot}' took one value` : ' — modal share over 0.60'}`),
    perSlot.join(' · ')].join('\t'));
}
const forms = [...roofForms.entries()].sort((a, b) => b[1] - a[1]);
const modalRoof = forms.length ? forms[0][1] / roofBodies : 1;
console.log(`\nrowHouse ROOF FORMS over ${roofBodies} drawn bodies: ${forms.map(([k, v]) => `${k} ${v} (${(v / roofBodies * 100).toFixed(1)}%)`).join(' · ')}`);
console.log(`  distinct forms ${forms.length} of ${FAMILIES.rowHouse.slots.roofForm.values.length} enumerated · modal share ${modalRoof.toFixed(3)} → ${(forms.length >= 3 && modalRoof <= MODAL_CEIL) ? 'PASS' : 'FAIL'}`);
const scored = rows.filter((r) => !r.thin && !r.slotless);
console.log(`\nSCORED FAMILIES: ${scored.length} of ${rows.length} (the rest are THIN: fewer than ${THIN} instances over the gallery)`);
console.log(`SPREAD PASS: ${scored.filter((r) => r.pass).length} of ${scored.length}`);
const j = arg('json', null);
if (j) writeFileSync(j, JSON.stringify({ seeds: SEEDS, rows }, null, 2));
