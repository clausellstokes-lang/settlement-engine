import * as L from './lib.mjs';
const has=(f,re)=>f.insts.some(n=>re.test(n));
const T=(x)=>x.crisis.types; const siege=f=>T(f).includes('under_siege'); const occ=f=>T(f).includes('occupied');
const threat=f=>T(f).some(t=>['under_siege','occupied','monster_pressure'].includes(t));
const force=f=>f.d.garrison||f.d.militia;
const fpImp=f=>f.chains.food_processing==='impaired'&&f.chainMod.economic<0;
const fpOk=f=>f.chains.food_processing&&f.chains.food_processing!=='impaired'&&f.chainMod.economic>0;
const charter=f=>(f.t.defenseProfile.institutions.charter||[]).length>0;
const {scoreBand:band}=await import(L.TREE+'/src/domain/display/defenseScoreBands.js');
export const CHECKS={
 0:{tests:'siege+famine in force, food_processing chain present and not impaired (econ chain mod>0)', fn:f=>siege(f)&&f.famine.band==='famine'&&fpOk(f)},
 1:{tests:'siege+famine in force, food_processing chain present and not impaired (econ chain mod>0)', fn:f=>siege(f)&&f.famine.band==='famine'&&fpOk(f)},
 2:{tests:'food_processing chain impaired (econ chain mod<0) and no siege', fn:f=>fpImp(f)&&!siege(f)},
 3:{tests:'food_processing chain impaired (econ chain mod<0) and no siege', fn:f=>fpImp(f)&&!siege(f)},
 4:{tests:'food_processing chain impaired (econ chain mod<0) and no siege', fn:f=>fpImp(f)&&!siege(f)},
 5:{tests:'siege in force and food_processing chain impaired', fn:f=>siege(f)&&fpImp(f)},
 6:{tests:'siege in force and food_processing chain impaired', fn:f=>siege(f)&&fpImp(f)},
 7:{tests:'monsterThreat plagued, live walls, gate, garrison or militia, no siege/occupation, and no beast crisis in force (the page then says the beasts give no rest and people grow afraid)', fn:f=>f.monster==='plagued'&&f.d.walls&&f.d.gate&&force(f)&&!siege(f)&&!occ(f)&&!T(f).includes('monster_pressure')},
 8:{tests:'heartland country, monster_pressure crisis, no walls, no watch/garrison/militia/mercenary, no charter', fn:f=>f.monster==='heartland'&&T(f).includes('monster_pressure')&&!f.d.walls&&!f.guard&&!charter(f)},
 9:{tests:'heartland country, monster_pressure crisis, no walls, no watch/garrison/militia/mercenary, no charter', fn:f=>f.monster==='heartland'&&T(f).includes('monster_pressure')&&!f.d.walls&&!f.guard&&!charter(f)},
 10:{tests:'heartland country, monster_pressure crisis, no walls, no watch/garrison/militia/mercenary, no charter', fn:f=>f.monster==='heartland'&&T(f).includes('monster_pressure')&&!f.d.walls&&!f.guard&&!charter(f)},
 11:{tests:'live walls and live garrison, no siege/occupation', fn:f=>f.d.walls&&f.d.garrison&&!siege(f)&&!occ(f)},
 12:{tests:'live walls and live garrison, no occupation', fn:f=>f.d.walls&&f.d.garrison&&!occ(f)},
 13:{tests:'live walls; no garrison, militia, watch or mercenary; no siege/occupation', fn:f=>f.d.walls&&!f.guard&&!siege(f)&&!occ(f)},
 14:{tests:'live walls; no garrison, militia, watch or mercenary; no siege/occupation', fn:f=>f.d.walls&&!f.guard&&!siege(f)&&!occ(f)},
 15:{tests:'live walls; no garrison, militia, watch or mercenary; no siege/occupation', fn:f=>f.d.walls&&!f.guard&&!siege(f)&&!occ(f)},
 16:{tests:'live walls and watch; no garrison, militia or mercenary; no siege/occupation', fn:f=>f.d.walls&&f.d.watch&&!f.d.garrison&&!f.d.militia&&!f.d.mercenary&&!siege(f)&&!occ(f)},
 17:{tests:'live walls and watch; no garrison, militia or mercenary; no siege/occupation; and the page does not say the patrols have stopped/abandoned', fn:(f,pg)=>f.d.walls&&f.d.watch&&!f.d.garrison&&!f.d.militia&&!f.d.mercenary&&!siege(f)&&!occ(f)&&!/patrols have stopped|abandoned normal patrol/i.test(pg)},
 18:{tests:'siege in force, live walls, no garrison/militia/watch/mercenary', fn:f=>siege(f)&&f.d.walls&&!f.guard},
 19:{tests:'threat crisis (not siege/occupation), no walls, no garrison/militia/watch/mercenary, no adventurers charter hall (nobody trained to send)', fn:f=>threat(f)&&!siege(f)&&!occ(f)&&!f.d.walls&&!f.guard&&!charter(f)},
 20:{tests:'threat crisis, no walls, watch present, no garrison/militia/mercenary/charter hall (so the watch IS all it has)', fn:f=>threat(f)&&!occ(f)&&!f.d.walls&&f.d.watch&&!f.d.garrison&&!f.d.militia&&!f.d.mercenary&&!charter(f)},
 21:{tests:'no crisis, economic defence score band STRONG', fn:f=>T(f).length===0&&band(f.econScore)==='STRONG'},
 22:{tests:'no walls, no garrison/mercenary (soldiers), no militia, watch present, no threat crisis, ruler not a military council', fn:f=>!f.d.walls&&!f.soldiers&&!f.d.militia&&f.d.watch&&!threat(f)&&!/milit/i.test(f.gov||'')},
 23:{tests:'econ band WEAK, no watch/garrison/militia/mercenary, no charter/bounty house (nobody paid to defend)', fn:f=>band(f.econScore)==='WEAK'&&!f.guard&&!charter(f)},
};
