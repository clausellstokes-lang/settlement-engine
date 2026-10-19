// D-PT-r5 MODEL PROBE (the design is unbuilt): PT §8.4/§8.6's weekly fault fold applied to a HUNT
// (a bounty's quarry, need.bodyId), comparing round 4's rule (patience only: no target, never fell_short)
// with round 5's (the need's place each week = the anchor settlement(s) of the body's own `where`, truth,
// as PT §9.2's body half reads it). Journeys are a toy hop matrix (weeks); the fold is PT's text verbatim:
//   each week: earliestArrivalTick = min(earliestArrivalTick, tick + journeyWeeks(whereabouts -> needPlace(tick)))
//   reachedTick = first evaluation AFTER the answer's tick at which whereabouts ∩ needPlace(tick) ≠ ∅
//   verdict at T: made_good (body_ended by the party after the answer | KEEP_PLEDGE | reachedTick ≤ T)
//                 else fell_short if earliestArrivalTick ≤ T else came_to_nothing
const W = { Kell: { Kell: 0, Tolle: 1, Ashford: 2, Merewick: 6 }, Tolle: { Kell: 1, Tolle: 0, Ashford: 1, Merewick: 5 },
  Ashford: { Kell: 2, Tolle: 1, Ashford: 0, Merewick: 4 }, Merewick: { Kell: 6, Tolle: 5, Ashford: 4, Merewick: 0 } };
const anchorsOf = (where) => where.kind === 'road' || where.kind === 'trail' ? where.ids : [where.ids[0]];
const journey = (fromIds, toIds) => Math.min(...fromIds.flatMap(f => toIds.map(t => W[f][t])));
function judge({ answerTick, T, partyAt, bodyWhere, partyEnded = false, keep = false }, rule) {
  let eat = Infinity, reached = null;
  for (let tick = answerTick + 1; tick <= T; tick++) {           // the pass sees ticks after the answer
    const here = partyAt(tick); const need = anchorsOf(bodyWhere(tick));
    if (rule === 'r5') {
      eat = Math.min(eat, tick + journey(here, need));
      if (reached == null && here.some(s => need.includes(s))) reached = tick;
    }
  }
  if (partyEnded || keep || (reached != null && reached <= T)) return 'made_good';
  if (rule === 'r4') return 'came_to_nothing';                      // r4: patience only, never fell_short
  return eat <= T ? 'fell_short' : 'came_to_nothing';
}
const gangRoad = () => ({ kind: 'road', ids: ['Ashford', 'Tolle'] });
const cases = {
  'A yes at Kell, never rides; Kell\'s riders break the gang at week 6': { answerTick: 0, T: 6, partyAt: () => ['Kell'], bodyWhere: gangRoad },
  'B yes at Merewick, the gang on the Tolle road, broken at week 2 (four weeks away)': { answerTick: 0, T: 2, partyAt: () => ['Merewick'], bodyWhere: gangRoad },
  'C yes at Kell, the party rides to Tolle (week 2) and another hand breaks the gang at week 4': { answerTick: 0, T: 4, partyAt: (t) => t >= 2 ? ['Tolle'] : ['Kell'], bodyWhere: gangRoad },
  'D yes at Kell; the DM records END_BODY(gang, party) at week 3': { answerTick: 0, T: 3, partyAt: () => ['Kell'], bodyWhere: gangRoad, partyEnded: true },
  'E the gang moves away each week (Ashford, then Merewick country); party stays at Kell; bounty lapses week 3': { answerTick: 0, T: 3, partyAt: () => ['Kell'], bodyWhere: (t) => t < 2 ? { kind: 'country', ids: ['Ashford'] } : { kind: 'country', ids: ['Merewick'] } },
};
for (const [name, c] of Object.entries(cases)) console.log(`${name}\n  r4 (patience only): ${judge(c, 'r4')}\n  r5 (priced to the body's where): ${judge(c, 'r5')}`);
