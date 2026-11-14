import { createRequire } from 'module';const require=createRequire(import.meta.url);
const {rec}=require('./facts.js');
const T='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/wt/tip';
const m=await import(T+'/src/domain/defense/defenseFacts.js');
export function df(town){return m.defenseFactsOf(rec(town));}
if(import.meta.url===`file://${process.argv[1]}`){for(const a of process.argv.slice(2))console.log(a,JSON.stringify(df(a)));}
