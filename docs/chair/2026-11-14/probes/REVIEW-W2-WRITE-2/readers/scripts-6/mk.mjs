import lib from './lib.js';
const T='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/wt/tip';
const {isMarketInstitution}=await import(T+'/src/domain/facts/market.js');
const {isLiveInstitution}=await import(T+'/src/domain/institutions/institutionRoster.js');
export {isMarketInstitution,isLiveInstitution};
