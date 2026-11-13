// REVIEW-W2-FIX-DATA-2: the dominance arm's own measure (scripts/census/pool-dominance.mjs :: measureDominance and
// judge) on a tree, one prefix, written whole to OUT (JSON: every pool's draws/towns/lines/top1/top5, and the judge's
// findings against that tree's register). Read-only: no door is run.   TREE=<tree> PREFIX=<p> OUT=<file> node pools.mjs
import fs from 'node:fs';
const T=process.env.TREE; process.chdir(T);
const M=await import(T+'/scripts/census/pool-dominance.mjs');
const table=M.measureDominance({seedPrefix:process.env.PREFIX});
const reg=M.readRegister();
let findings=null; try{ findings=M.judge(table, reg, {exact: process.env.PREFIX===M.DEFAULT_SEED_PREFIX}); }catch(e){ findings={error:e.message}; }
const pools={}; for(const [k,v] of table){ pools[k]={draws:v.draws,towns:v.towns,lines:v.lines,top1:+v.top1.toFixed(4),top5:+v.top5.toFixed(4),se1:+M.shareError(v,'top1',reg.pools?.[k]?.top1??v.top1).toFixed(4)}; }
fs.writeFileSync(process.env.OUT, JSON.stringify({tree:T,prefix:process.env.PREFIX,pools,findings},null,1)); console.log('pools',table.size);
