const {rec}=require("./lib.js");
module.exports=function f(t){const r=rec(t);const d=r.defenseProfile||{};const inst=d.institutions||{};
 const n=k=>(inst[k]||[]).map(x=>x.name);
 return {t,tier:r.tier,pop:r.population,st:(r.config.stressTypes||[]),stress:r.stress&&r.stress.type,rd:d.readiness&&d.readiness.score,rl:d.readiness&&d.readiness.label,
  walls:n("walls"),garrison:n("garrison"),militia:n("militia"),watch:n("watch"),merc:n("mercenary"),charter:n("charter"),magicDef:n("magicDef"),
  sc:d.scores||{},inst:(r.institutions||[]).map(i=>i.name),r};}
