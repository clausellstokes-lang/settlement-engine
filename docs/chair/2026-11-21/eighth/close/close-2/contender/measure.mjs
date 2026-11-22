// CLOSE-2 contender measure. Usage: node measure.mjs <tree> [N] [sizes,comma]
// Counts what the Power tab PRINTS as contenders (derivePowerStrata -> ThePowers: every
// challenger entry, role 'contender', de-duplicated by name against the ruler; no filter, no limit
// in the component beyond coupContenders' own slice(0,3)) against the web's typed ties
// (powerStructure.factionRelationships, the rows TheWeb groups).
const T = process.argv[2];
const N = Number(process.argv[3] || 150);
const SIZES = (process.argv[4] || 'thorp,hamlet,village,town,city,metropolis').split(',');
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { derivePowerStrata } = await import(`${T}/src/domain/dossier/powerStrata.js`);
const { governingFactionOf, nameOf } = await import(`${T}/src/domain/rulingPower.js`);
const { factionArchetype } = await import(`${T}/src/domain/factionArchetypes.js`);
const { DEFAULT_CONFIG } = await import(`${T}/src/store/configSlice.js`);
await loadGenerationLawPayloads();

// NARROW = the bargain kinds factionDynamics.js names ("each props up the other", "each needs the other"): symbiotic, dependent.
// WIDE   = the settled/cooperative kinds (factionDynamics.js boycottReadsRelation; powerStrata.js RELATIONSHIP_KIND_ORDER's
//          "cooperative kinds last"): subordinate, dependent, symbiotic.
const NARROW = new Set(['dependent', 'symbiotic']);
const WIDE = new Set(['subordinate', 'dependent', 'symbiotic']);
const FRICTION = new Set(['corrupted', 'competitive', 'tense']);

const out = {};
const examples = [];
const typeCensus = {};
for (const size of SIZES) {
  const row = { n: 0, ruled: 0, withC: 0, firstN: 0, anyN: 0, firstW: 0, anyW: 0, allOthersN: 0, allOthersW: 0, allPrintedN: 0, allPrintedW: 0, cureNoneN: 0, cureNoneW: 0, mixed: 0, errors: 0 };
  for (let i = 0; i < N; i++) {
    const seed = `visitor-${size}-${i}`;
    let s;
    try {
      s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    } catch (e) { row.errors++; continue; }
    row.n++;
    const ps = s.powerStructure || {};
    const rels = Array.isArray(ps.factionRelationships) ? ps.factionRelationships : (Array.isArray(ps.relationships) ? ps.relationships : []);
    for (const r of rels) typeCensus[r?.type] = (typeCensus[r?.type] || 0) + 1;
    const gov = governingFactionOf(s);
    const { powers } = derivePowerStrata(s);
    const ruler = powers.find((p) => p.role === 'ruler');
    const contenders = powers.filter((p) => p.role === 'contender');
    if (!ruler) continue;
    row.ruled++;
    const R = ruler.name;
    const tiesWith = (other) => rels.filter((r) => Array.isArray(r?.pair) && r.pair.includes(R) && r.pair.includes(other) && r.pair[0] !== r.pair[1]).map((r) => r.type);
    const isIn = (other, set) => tiesWith(other).some((t) => set.has(t));
    if (contenders.length) {
      row.withC++;
      if (isIn(contenders[0].name, NARROW)) row.firstN++;
      if (isIn(contenders[0].name, WIDE)) row.firstW++;
      if (contenders.some((c) => isIn(c.name, NARROW))) row.anyN++;
      if (contenders.some((c) => isIn(c.name, WIDE))) row.anyW++;
      for (const c of contenders) {
        const ts = tiesWith(c.name);
        if (ts.some((t) => WIDE.has(t)) && ts.some((t) => FRICTION.has(t))) { row.mixed++; break; }
      }
      const hit = contenders.find((c) => isIn(c.name, NARROW));
      if (hit && examples.filter((e) => e.size === size).length < 2) {
        const rel = rels.find((r) => Array.isArray(r?.pair) && r.pair.includes(R) && r.pair.includes(hit.name) && NARROW.has(r.type));
        examples.push({ size, seed, ruler: R, contender: hit.name, first: contenders[0].name === hit.name, contenderLine: `Contender ${hit.name} · ${hit.archetype} · ${hit.powerLabel}  [roster: "Contests the seat"]`, web: `${rel.type}: ${rel.pair[0]} ↔ ${rel.pair[1]} (${rel.direction}) — ${rel.narrative}` });
      }
    }
    // Every non-ruling power is dependent/allied to the ruler.
    const others = (ps.factions || []).filter((f) => f && f !== gov && nameOf(f) && nameOf(f) !== R);
    // The pool coupContenders draws from (non-criminal, power >= 5), before its top-3 slice.
    const pool = others.filter((f) => factionArchetype(f) !== 'criminal' && Number(f.power) >= 5);
    if (others.length && others.every((f) => isIn(nameOf(f), NARROW))) row.allOthersN++;
    if (others.length && others.every((f) => isIn(nameOf(f), WIDE))) row.allOthersW++;
    if (contenders.length && contenders.every((c) => isIn(c.name, NARROW))) row.allPrintedN++;
    if (contenders.length && contenders.every((c) => isIn(c.name, WIDE))) row.allPrintedW++;
    // A contender printed today, and every power of the pool is dependent/allied: the cure prints none.
    if (contenders.length && pool.every((f) => isIn(nameOf(f), NARROW))) row.cureNoneN++;
    if (contenders.length && pool.every((f) => isIn(nameOf(f), WIDE))) row.cureNoneW++;
  }
  out[size] = row;
  console.log(size, JSON.stringify(row));
}
console.log('TYPES', JSON.stringify(typeCensus));
console.log('EXAMPLES');
for (const e of examples) console.log(JSON.stringify(e));
console.log('RESULT', JSON.stringify(out));
