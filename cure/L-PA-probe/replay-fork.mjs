// R-PA2 probe: the COST SHAPE of an event-driven, relationship-only replay over a composed realm's
// real dossier histories (a TOY model: a yearly regard half-life per pair + one link per linkable
// event to a counterpart that existed then). It measures the loop's size and time, not any program's
// rules (no relationship-only mode exists in the code of record). Also checks byte-identity of the
// dossiers before/after (the replay reads them only) and same-seed determinism of the output.
// Usage: [FORK=1] node replay-fork.mjs <realmSize>  (FORK=1: one labelled fork per dossier event)
import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
const base = new URL('./cor/src/', import.meta.url);
const { composeInstantWorld, loadGenerationLawPayloads } = await import(new URL('lib/instantWorld/composeInstantWorld.js', base));
const { createPRNG } = await import(new URL('kernel/prng.js', base));
const realmSize = process.argv[2] || 'large';
await loadGenerationLawPayloads();
const b = composeInstantWorld({ seed: 'pa2-probe', basicConfig: { realmSize } });
const h = (o) => createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 16);
const before = h(b.settlements.map(s => s.settlement));
const LINKABLE = new Set(['exile_return', 'occupation_infiltration', 'political', 'economic', 'religious', 'demographic', 'disaster', 'military', 'raid', 'siege']);

function replay(seed, pins = {}, forkPerEvent = process.env.FORK === "1") {
  const rng = createPRNG(`realmPast::${seed}`);
  const towns = b.settlements.map(s => ({ id: s.id, age: s.settlement.history.founding.age, events: s.settlement.history.historicalEvents }))
    .sort((x, y) => (y.age - x.age) || (x.id < y.id ? -1 : 1));          // oldest first, id tie-break
  const start = towns.length > 1 ? towns[1].age : 0;                        // the second-oldest founding
  const evs = [];
  for (const t of towns) for (const [i, e] of t.events.entries()) if (e.yearsAgo <= start) evs.push({ town: t.id, ref: `${t.id}#${i}`, ya: e.yearsAgo, type: e.type });
  evs.sort((x, y) => (y.ya - x.ya) || (x.ref < y.ref ? -1 : 1));
  const regard = new Map(); const links = []; let pairYears = 0;
  let ei = 0;
  for (let ya = start; ya >= 0; ya--) {                                     // one coarse yearly step
    const alive = towns.filter(t => t.age >= ya);
    for (let i = 0; i < alive.length; i++) for (let j = i + 1; j < alive.length; j++) {
      const k = `${alive[i].id}|${alive[j].id}`; regard.set(k, (regard.get(k) || 0) * 0.93); pairYears++;
    }
    while (ei < evs.length && evs[ei].ya === ya) {
      const e = evs[ei++];
      if (!LINKABLE.has(e.type)) continue;
      const pin = pins[e.ref];
      if (pin === 'struck') continue;
      const cands = alive.filter(t => t.id !== e.town).map(t => t.id).sort();
      if (!cands.length) continue;
      const other = typeof pin === 'string' && pin !== 'kept' ? pin : (forkPerEvent ? createPRNG(`realmPast::${seed}::${e.ref}`) : rng).pick(cands);  // chooseOrPin shape
      links.push({ ref: e.ref, ya, with: other });
      const k = [e.town, other].sort().join('|'); regard.set(k, (regard.get(k) || 0) + 1);
    }
  }
  return { start, events: evs.length, links, pairYears, regard: [...regard.entries()].sort() };
}
const t0 = performance.now(); const r1 = replay('pa2-probe'); const t1 = performance.now();
const r2 = replay('pa2-probe');
const struckRef = r1.links[0]?.ref;
const r3 = replay('pa2-probe', struckRef ? { [struckRef]: 'struck' } : {});
const after = h(b.settlements.map(s => s.settlement));
console.log(JSON.stringify({
  realmSize, members: b.settlements.length, startYearsAgo: r1.start, eventsInWindow: r1.events,
  links: r1.links.length, pairYears: r1.pairYears, ms: +(t1 - t0).toFixed(2),
  deterministic: JSON.stringify(r1) === JSON.stringify(r2),
  dossiersByteIdentical: before === after,
  strikeOne: { struck: struckRef, linksAfter: r3.links.length, laterLinksMoved: JSON.stringify(r3.links) !== JSON.stringify(r1.links.filter(l => l.ref !== struckRef)) },
}, null, 1));
