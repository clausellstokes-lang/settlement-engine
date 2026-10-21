// D-OP-r1 probe: the CURED missionSlack (OP §2.5) and the envoy `via` guard (OP §3.3) on the
// skeptic's own plan (skeptic/OP-r1-probe/slack.mjs). Landed pieces imported READ-ONLY from master.
import { normalizeRoutePlan } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/worldPulse/envoyErrandTransit.js';
const leg = (fromId, toId, departTick, arrivalTick, journey='outbound') => ({ fromId, toId, departTick, arrivalTick, journey, routeRef: { id: fromId+'-'+toId } });
const outbound = [leg('H','A',0,1), leg('A','D',2,3)];
const returnLegs = [leg('D','A',4,5,'return'), leg('A','H',6,7,'return')];
const expectedReturnTick = returnLegs.at(-1).arrivalTick;            // expectedRoundTripTick: return from outbound arrival + 1
const returnSpan = returnLegs.at(-1).arrivalTick - outbound.at(-1).arrivalTick; // the priced return, incl. the one-tick dwell
const projectedHome = (lastOutboundArrival) => lastOutboundArrival + returnSpan;  // dwell (1) + priced return
const slackCured = Math.max(0, expectedReturnTick - projectedHome(outbound.at(-1).arrivalTick));
const detoured = { legs: [leg('A','X',2,3), leg('X','D',4,5)], expectedReturnTick };
const normalizes = !!normalizeRoutePlan(detoured, { fromId: 'A', toId: 'D', journey: 'outbound', notBeforeTick: 2 });
const viaProjectedHome = projectedHome(detoured.legs.at(-1).arrivalTick);
const envoyViaRefused = viaProjectedHome > expectedReturnTick;       // OP §3.3: an envoy's `via` must fit its margin
const delayed = { legs: [leg('A','D',3,4)], expectedReturnTick };     // a rescue's one-week stay at A (`delay`)
const delayNormalizes = !!normalizeRoutePlan(delayed, { fromId: 'A', toId: 'D', journey: 'outbound', notBeforeTick: 3 });
const delayHome = projectedHome(4);
console.log(JSON.stringify({ expectedReturnTick, slackCured_weeks: slackCured, detourNormalizes_landedValidator: normalizes,
  envoyVia_projectedHome: viaProjectedHome, envoyViaRefusedByCuredGuard: envoyViaRefused,
  rescueStay_delayNormalizes: delayNormalizes, rescueStay_projectedHome: delayHome, rescueStay_lateBy: delayHome - expectedReturnTick,
  silenceEligibleFromTick: expectedReturnTick + 1 }, null, 1));
