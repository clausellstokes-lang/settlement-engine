// OP-r1 probe: OP §2.5 missionSlack = expectedReturnTick − last scheduled outbound arrival.
// Landed: envoyDiplomacy.js :: expectedRoundTripTick builds the RETURN plan from outboundArrival+1
// and sets expectedReturnTick = its last arrival (a zero-slack round trip). So "slack" == the return
// journey. A detour plan that keeps expectedReturnTick (OP §3.3) still normalizes, yet the envoy
// cannot be home by expectedReturnTick.
import { normalizeRoutePlan } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/worldPulse/envoyErrandTransit.js';
const leg = (fromId, toId, departTick, arrivalTick, journey='outbound') => ({ fromId, toId, departTick, arrivalTick, journey, routeRef: { id: fromId+'-'+toId } });
// Home H -> A -> D (destination): two one-week hops; arrival at D tick 3 (depart 0).
const outbound = [leg('H','A',0,1), leg('A','D',2,3)];
// expectedRoundTripTick: return plan D -> A -> H from tick 4: arrive A 5, H 7 => expectedReturnTick 7
const returnLegs = [leg('D','A',4,5,'return'), leg('A','H',6,7,'return')];
const expectedReturnTick = returnLegs.at(-1).arrivalTick;
const slackAsWritten = expectedReturnTick - outbound.at(-1).arrivalTick; // OP §2.5
// Detour at A via X (one hop off): A -> X -> D, each one week; same expectedReturnTick (OP §3.3 guard)
const detoured = { legs: [leg('A','X',2,3), leg('X','D',4,5)], expectedReturnTick };
const ok = normalizeRoutePlan(detoured, { fromId: 'A', toId: 'D', journey: 'outbound', notBeforeTick: 2 });
const returnWeeks = returnLegs.at(-1).arrivalTick - returnLegs[0].departTick + 1; // depart day after arrival
const homeAfterDetour = 5 + returnWeeks; // arrive D at 5, return takes the same 4 ticks (depart 6 ... arrive 9)
console.log(JSON.stringify({ expectedReturnTick, slackAsWritten_weeks: slackAsWritten, detourAccepted: !!ok,
  detourExtraWeeks: 2, homeArrivalNoDetour: expectedReturnTick, homeArrivalAfterDetour: homeAfterDetour,
  lateBy: homeAfterDetour - expectedReturnTick,
  silenceEligibleRule: 'tick > Number(errand.expectedReturnTick) and not visibly home' }, null, 1));
