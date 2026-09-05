import { marketPoolKey } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/laneINTEG-tree/src/domain/display/stateProse/generalStateProse.js';
const stalls = (extra) => [{ name: 'Grand Bazaar', ...extra }];
console.log('active market      ->', marketPoolKey({ institutions: stalls({}), tradeRouteAccess: 'road' }));
console.log('ruined  market     ->', marketPoolKey({ institutions: stalls({ status: 'ruined' }), tradeRouteAccess: 'road' }));
console.log('pulse-inactive mkt ->', marketPoolKey({ institutions: stalls({ _worldPulseInactive: true }), tradeRouteAccess: 'road' }));
console.log('no institutions    ->', marketPoolKey({ institutions: [], tradeRouteAccess: 'road' }));
console.log('non-array roster   ->', marketPoolKey({ institutions: 'nonsense', tradeRouteAccess: 'road' }));
console.log('null state         ->', marketPoolKey(null));
