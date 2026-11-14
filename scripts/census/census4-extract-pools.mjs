// CENSUS-4 phase A: every line of the NPC and Institutions/Services pools, one row per line with a
// stable id, to <out-dir>/<pool-id>.json. The declaration ledger (docs/census/declarations/) keeps
// these ids and texts in this order; re-run it to prove the ledger still covers every line.
// Read-only over src/: imports the data modules, and reads the inline pools by AST.
import fs from 'node:fs';
import * as acorn from 'acorn';
const R = new URL('../../', import.meta.url).pathname;
const OUT = process.argv[2] ? (process.argv[2].endsWith('/') ? process.argv[2] : process.argv[2] + '/') : (() => { throw new Error('usage: census4-extract-pools.mjs <out-dir>'); })();
const pools = {};
const add=(pool, id, text, meta={})=>{ (pools[pool] ||= {file:meta.file, rows:[]}).rows.push({id, text}); };
function walk(pool, file, v, path){
  if (typeof v==='string') return add(pool, path, v, {file});
  if (Array.isArray(v)) return v.forEach((x,i)=>walk(pool,file,x,`${path}#${i}`));
  if (v && typeof v==='object') for (const [k,x] of Object.entries(v)) if (typeof x!=='number' && typeof x!=='boolean' && !['driven_by','disposition'].includes(k)) walk(pool,file,x,path?`${path}.${k}`:k);
}
// AST literal evaluator: template literals render ${expr} as {expr-source}
function lit(node, src){
  switch(node.type){
    case 'Literal': return node.value;
    case 'TemplateLiteral': return node.quasis.map((q,i)=>q.value.cooked + (node.expressions[i]?`{${src.slice(node.expressions[i].start,node.expressions[i].end)}}`:'')).join('');
    case 'ArrayExpression': return node.elements.map(e=>lit(e,src));
    case 'ObjectExpression': { const o={}; for (const p of node.properties){ const k = p.computed ? `[${src.slice(p.key.start,p.key.end)}]` : (p.key.name ?? p.key.value); o[k]=lit(p.value,src);} return o; }
    case 'CallExpression': return lit(node.arguments[0],src); // Object.freeze(...)
    case 'Identifier': return `{${node.name}}`;
    case 'BinaryExpression': return lit(node.left,src)+lit(node.right,src);
    default: return `<<${node.type}>>`;
  }
}
function inline(file, name){
  const src=fs.readFileSync(R+file,'utf8');
  const ast=acorn.parse(src,{ecmaVersion:'latest',sourceType:'module'});
  let found=null;
  (function visit(n){ if(!n||typeof n!=='object'||found) return; if(n.type==='VariableDeclarator'&&n.id?.name===name){found=n.init;return;} for(const k in n){const c=n[k]; if(Array.isArray(c)) c.forEach(visit); else if(c&&typeof c.type==='string') visit(c);} })(ast);
  if(!found) throw new Error(name);
  return lit(found,src);
}
const npc = await import(R+'src/data/npcData.js');
const sie = await import(R+'src/data/stressInstitutionEffects.js');
const cc = await import(R+'src/domain/crisis/crisisCast.js');
const ts = await import(R+'src/domain/summary/tonightSheet.js');
const idv = await import(R+'src/data/institutionDescVariants.js');
const isv = await import(R+'src/data/institutionServices.js');
for (const [ak,a] of Object.entries(npc.STRESS_ECONOMIC_EFFECTS)) { add('npcData.STRESS_ECONOMIC_EFFECTS',`${ak}.label`,a.label,{file:'src/data/npcData.js'}); for (const f of ['desc','tension']) for (let i=0;i<a[f].size;i++) add('npcData.STRESS_ECONOMIC_EFFECTS',`${ak}.${f}#${i}`,a[f]({name:'{A}'},{name:'{B}'},i),{file:'src/data/npcData.js'}); }
for (const k of ['MANNERISMS','SPEECH_PATTERNS','NPC_PERSONALITY_TRAITS','NPC_AGE_DATA','NPC_BUILDS','NPC_FEATURES','NPC_WANTS','NPC_PLOT_HOOKS','NPC_PLOT_HOOKS_DATA','NPC_FACTION_GOALS','NPC_CRIMINAL_SECRETS','NPC_FACTION_LOYALTY','NPC_SECRETS','NPC_PRESENTATION_MODES'] /* FACTION_CONFLICT_TYPES: a category table, no prose */)
  walk(`npcData.${k}`,'src/data/npcData.js',npc[k],'');
walk('stressInstitutionEffects.STRESS_INSTITUTION_EFFECTS','src/data/stressInstitutionEffects.js',sie.STRESS_INSTITUTION_EFFECTS,'');
for (const k of ['CAST_REASONS','CAST_ABSENCES','STAKE_REASONS']) walk(`crisisCast.${k}`,'src/domain/crisis/crisisCast.js',cc[k],'');
walk('tonightSheet.CAST_WANTS','src/domain/summary/tonightSheet.js',ts.CAST_WANTS,'');
walk('npcGenerator.STRESS_GOALS','src/generators/npcGenerator.js',inline('src/generators/npcGenerator.js','STRESS_GOALS'),'');
walk('npcGenerator.STRESS_GOAL_OVERRIDES','src/generators/npcGenerator.js',inline('src/generators/npcGenerator.js','STRESS_GOAL_OVERRIDES'),'');
// Repaired (SW-6 second seat, 2026-11-09): RELATIONSHIP_STRENGTHS moved to people/ties.js (141383cd4) and CORRUPT_SHORT_GOAL to
// domain/people/allegiance.js (5902f1a4a, steps/corruptionPass.js deleted); both are exported there, so they are read as modules.
// The pool ids keep the ledger's file names.
const ties = await import(R+'src/generators/people/ties.js');
const allegiance = await import(R+'src/domain/people/allegiance.js');
walk('npcGenerator.RELATIONSHIP_STRENGTHS','src/generators/people/ties.js',ties.RELATIONSHIP_STRENGTHS,'');
walk('corruptionPass.CORRUPT_SHORT_GOAL','src/domain/people/allegiance.js',allegiance.CORRUPT_SHORT_GOAL,'');
walk('factionLeaderSecret.SAFE_SECRET_FALLBACK','src/generators/npc/factionLeaderSecret.js',inline('src/generators/npc/factionLeaderSecret.js','SAFE_SECRET_FALLBACK'),'');
// generateCrimeLevel inline: the anonymous array passed to pickRandom2
{ const src=fs.readFileSync(R+'src/generators/npcGenerator.js','utf8'); const i=src.indexOf('return pickRandom2(['); const ast=acorn.parseExpressionAt(src,i+'return pickRandom2('.length,{ecmaVersion:'latest'}); walk('npcGenerator.CRIME_LEVEL_OTHER_NPC','src/generators/npcGenerator.js',lit(ast,src),''); }
// npcStructure T: eval the reg() calls in a sandbox (import lines stripped, STANDING stubbed)
{ const src=fs.readFileSync(R+'src/generators/npcStructure.js','utf8'); const body='const STANDING={head:"head",inner:"inner_circle"};\n'+src.slice(0, src.indexOf('// ── Main export')).split('\n').filter((l)=>!/^import /.test(l)).join('\n'); /* repaired (SW-6 second seat): the module's imports cannot run in new Function, and the one name the registry body reads from them (STANDING, membership.js) is stubbed */ const T=new Function(body+'; return T;')(); walk('npcStructure.T','src/generators/npcStructure.js',T,''); }
// Part B
{ const seen=new Map(); for (const [k,arr] of Object.entries(idv.INSTITUTION_DESC_VARIANTS)) { if(seen.has(arr)) continue; seen.set(arr,k); arr.forEach((t,i)=>add('institutionDescVariants.INSTITUTION_DESC_VARIANTS',`${k}#${i}`,t,{file:'src/data/institutionDescVariants.js'})); } }
for (const [inst,defs] of Object.entries(isv.INSTITUTION_SERVICES)) for (const [svc,d] of Object.entries(defs)) if (d && typeof d.desc==='string') add('institutionServices.INSTITUTION_SERVICES',`${inst}|${svc}`,d.desc,{file:'src/data/institutionServices.js'});
let tot=0; for (const [p,{file,rows}] of Object.entries(pools)) { fs.writeFileSync(OUT+p+'.json', JSON.stringify({pool:p,file,rows},null,1)); console.log(rows.length.toString().padStart(5), p); tot+=rows.length; }
console.log(tot,'total');
