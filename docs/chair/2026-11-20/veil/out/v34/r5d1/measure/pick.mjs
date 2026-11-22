// R5D-1 (VEIL-34's MEASURE builder V34-R5D1): THE PAGE'S PICKER, as the rule to be built would call it: the engine's own
// functions over a PAGE document (the projected served document after rederiveForPage), the hidden rows out. No src change.
//   P1  B = rulingStructure.js :: generatePowerStructure over the page (R5C2's rederiveB call, as R5D-0's m3 makes it), with the
//       late replay's options the page holds (lateOpts) or none; no seed, or a named seed (the seed-draw test).
//   P2  each served card's base: B's card of the same name (cut by the standing table); else, a minted rival (`contestsNiche`
//       served): applyDensityLaw.js :: rivalDescOf over its HOST's B card (the engine's own source text, evaluated: the function
//       is not exported), its copy where no row matches; else (no host link served) B's ONE card of the same kind as the host,
//       rivalDescOf over it or its copy; else none.
//   P3  the final-roster settlers over the SERVED roster (hidden rows out), with the P2 bases as descs:
//       claimStanding.js :: settleClergyToFinalRoster, settleArcaneToPractitioners (the pipeline's tail, 203-204).
import { readFileSync } from 'node:fs';
import { expand, cutTail } from '../../r5d0/measure/standing-table.mjs';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
const nameOf = (f) => String(f?.faction ?? f?.name ?? '');
export async function makePick(SRC, MASK) {
  const { generatePowerStructure } = await import(`${SRC}/src/generators/power/rulingStructure.js`);
  const { settleClergyToFinalRoster, settleArcaneToPractitioners } = await import(`${SRC}/src/generators/power/claimStanding.js`);
  const { createPRNG } = await import(`${SRC}/src/kernel/prng.js`);
  const { setActiveRng, clearActiveRng } = await import(`${SRC}/src/kernel/rngContext.js`);
  const { factsOf } = await import(`${SRC}/src/domain/facts/factsOf.js`);
  const { isAdversarialRelationship } = await import(`${SRC}/src/domain/relationships/canonicalRelationship.js`);
  const { inferFactionCategory } = await import(`${SRC}/src/generators/power/factionCategories.js`);
  const { seatKey } = await import(`${SRC}/src/domain/density/seatKey.js`);
  const { powerSentenceName } = await import(`${SRC}/src/domain/display/powerSentenceName.js`);
  const { pluralPowerName } = await import(`${SRC}/src/domain/display/governanceAccount.js`);
  // rivalDescOf: the engine's own text, from `const A_SECOND_WATCH` to the function's close (no import inside it)
  const src = readFileSync(`${SRC}/src/generators/density/applyDensityLaw.js`, 'utf8');
  const a = src.indexOf('const A_SECOND_WATCH'); const fi = src.indexOf('function rivalDescOf', a); const z = src.indexOf('\n}\n', fi);
  const rivalText = a >= 0 && fi > a && z > fi ? src.slice(a, z + 2) : null;
  // eslint-disable-next-line no-new-func
  const rivalDescOf = rivalText ? new Function(`${rivalText}\nreturn rivalDescOf;`)() : null;
  const lateOpts = (s) => {
    const dp = s.defenseProfile; let forces = null; try { forces = factsOf(s).defence; } catch { forces = null; }
    return { ...(dp?.readiness?.label ? { defenseLabel: dp.readiness.label } : {}), ...(dp?.economicGates?.military != null ? { militaryGate: dp.economicGates.military } : {}), ...(forces ? { forces } : {}) };
  };
  const runB = (s, { late = true, seed = null } = {}) => {
    const config = s.config; if (!isRec(config) || !isRec(s.powerStructure)) return { why: 'no config or powers' };
    const entries = recs(s.stressors).length ? recs(s.stressors) : isRec(s.stress) ? [s.stress] : recs(s.stress);
    const nb = s.neighborRelationship ?? config.neighborRelationship;
    const nr = isRec(nb) && isAdversarialRelationship(nb.relationshipType) ? nb : null;
    const prev = seed ? setActiveRng(createPRNG(seed)) : undefined;
    try { return { v: generatePowerStructure(s.tier, s.economicState || {}, nr, config, recs(s.institutions), { ...(late ? lateOpts(s) : {}), stressEntries: entries }) }; }
    catch (e) { return { why: `threw ${String(e?.message).slice(0, 80)}` }; } finally { if (seed) clearActiveRng(prev); }
  };
  /** the served roster with the hidden rows out (a masked row, a row stamped hidden) */
  const servedOf = (page) => recs(page?.powerStructure?.factions).filter((f) => nameOf(f) && !nameOf(f).includes(MASK) && f.hidden !== true);
  /** pick(page, opts) -> { seatB, seatS, rows: Map(name -> { base, how }) } ; `extraNames` widen the table (the record's names) */
  const pick = (page, { late = true, seed = null, extraNames = [] } = {}) => {
    const served = servedOf(page); const seatS = nameOf(served.find((f) => f.isGoverning === true) || {}) || null;
    const B = runB(page, { late, seed });
    if (!B.v) return { why: B.why, seatS, rows: new Map(served.map((f) => [nameOf(f), { base: null, how: `B ${B.why}` }])) };
    const Bf = recs(B.v.factions); const seatB = nameOf(Bf.find((f) => f.isGoverning === true) || {}) || null;
    const table = expand([...new Set([...served.map(nameOf), ...Bf.map(nameOf), ...extraNames])], powerSentenceName, pluralPowerName);
    const cut = (d) => cutTail(String(d ?? ''), table).base;
    const used = new Set(); const rows = new Map();
    for (const f of served) { const b = Bf.find((x) => nameOf(x) === nameOf(f)); if (b) { used.add(b); rows.set(nameOf(f), { base: cut(b.desc), how: 'name' }); } }
    for (const f of served) {
      const n = nameOf(f); if (rows.has(n)) continue;
      if (f.contestsNiche) {
        const host = served.find((x) => x !== f && seatKey(x) === f.contestsNiche);
        const hb = host ? Bf.find((x) => nameOf(x) === nameOf(host)) : null;
        if (hb) { const r = rivalDescOf ? rivalDescOf(hb.desc) : {}; rows.set(n, { base: r.desc !== undefined ? r.desc : cut(hb.desc), how: r.desc !== undefined ? 'rival:row' : 'rival:copy' }); continue; }
        rows.set(n, { base: null, how: host ? 'rival: host not in B' : 'rival: host not served' }); continue;
      }
      // no host link served: B's one card of the same kind is taken as the host (a minted rival takes its host's category),
      // rivalDescOf over it, or its copy
      const kind = f.category || inferFactionCategory(n);
      const ks = Bf.filter((x) => x.isGoverning !== true && (x.category || inferFactionCategory(nameOf(x))) === kind); // the seat is never a niche host (resizeSeats keeps it first)
      if (ks.length === 1) { const r = rivalDescOf ? rivalDescOf(ks[0].desc) : {}; const onPage = served.some((s) => nameOf(s) === nameOf(ks[0]));
        rows.set(n, { base: r.desc !== undefined ? r.desc : cut(ks[0].desc), how: `kind:${r.desc !== undefined ? 'row' : 'copy'}:${onPage ? 'host served' : 'host not served'}` }); continue; }
      rows.set(n, { base: null, how: ks.length ? 'kind: several B cards' : 'not minted by the picker' });
    }
    // P3: the tail's settlers over the served roster
    const roster = served.map((f) => ({ ...f, desc: rows.get(nameOf(f))?.base ?? '' }));
    try { settleClergyToFinalRoster(roster); settleArcaneToPractitioners(roster, page); } catch { /* the bases stand */ }
    for (const f of roster) { const r = rows.get(nameOf(f)); if (r && r.base !== null) r.base = f.desc; }
    return { seatB, seatS, rows };
  };
  return { pick, runB, servedOf, rivalOk: !!rivalDescOf, table: (names) => expand(names, powerSentenceName, pluralPowerName), cutTail };
}
