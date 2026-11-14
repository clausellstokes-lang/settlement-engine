# plants3.py <tree> <jsonout-dir>: each plant applied alone (saved and restored by content, never git), the stage's guard files run
import subprocess, sys, os, json
B=sys.argv[1]; O=sys.argv[2]; D='src/domain/display/stateProse/defenseStateProse.js'; Q='src/domain/display/stateProse/postureLineDisqualifiers.js'; T='src/components/new/tabs/DefenseTab.jsx'
G=('tests/components/defenseForceCardHouseLabel.test.jsx tests/components/defenseForceCardNoProvenance.test.jsx tests/domain/defenseInvasionWithinACriticalBand.test.js '
   'tests/domain/defensePostureAgainstItsFacts.test.js tests/domain/defenseWatchIsNotTheLevy.test.js tests/domain/defenseWithinTheBar.test.js '
   'tests/domain/defenseNoForceReadsEveryBody.test.js tests/domain/defenseSupplyUnderACrisis.test.js').split()
P=[('P0 none (control)',None,None,None),
 ('Pa the force card prints the raw key',T,"marginBottom:i.desc?2:0}}>{institutionDisplayName(i)}</div>","marginBottom:i.desc?2:0}}>{i.name}</div>"),
 ('Pc the occupation strike off',D,"(stressList(stress).some((entry) => entry?.type === 'occupied') ? null : poolKey)","(poolKey)"),
 ('Pc2 the occupation strike AFTER the fallback (the old order)',D,"posture: projected(withinTheBar(noStrongBesideAWeakBar(silentUnderAnOccupation(posturePoolKey(settlement?.defenseProfile?.readiness?.score), settlement?.stress),\n      settlement?.defenseProfile?.readiness?.score, settlement?.defenseProfile?.scores?.military), settlement?.defenseProfile?.scores?.military,\n    ), corpusAdmittingPostureLines(CORPUS, settlement)),",
   "posture: projected(withinTheBar(noStrongBesideAWeakBar(posturePoolKey(settlement?.defenseProfile?.readiness?.score),\n      settlement?.defenseProfile?.readiness?.score, settlement?.defenseProfile?.scores?.military), settlement?.defenseProfile?.scores?.military,\n    ), corpusAdmittingPostureLines(CORPUS, settlement)),"),
 ('Ph the Critical arm off',D,"  CRITICAL: new Set(['Invasion & War: walls AND professional garrison', 'Invasion & War: walls with citizen militia', 'Invasion & War: force with NO walls']),\n",""),
 ('Ph2 the Critical arm loses the force-with-no-walls pool',D,"'Invasion & War: walls with citizen militia', 'Invasion & War: force with NO walls']),","'Invasion & War: walls with citizen militia']),"),
 ('Ph3 the Critical arm loses the garrison pool',D,"CRITICAL: new Set(['Invasion & War: walls AND professional garrison', ","CRITICAL: new Set(["),
 ('Ph4 the arm reads the readiness score, not the bar',D,"withinTheBar(watchOnly ? null : invasionRowPoolKey(walls, garrison || contracted, militia), dp.scores?.military)","withinTheBar(watchOnly ? null : invasionRowPoolKey(walls, garrison || contracted, militia), settlement?.defenseProfile?.readiness?.score)"),
 ('Ph5 over-strike: the Critical arm also silences militia only',D,"'Invasion & War: walls with citizen militia', 'Invasion & War: force with NO walls']),","'Invasion & War: walls with citizen militia', 'Invasion & War: force with NO walls', 'Invasion & War: militia only']),"),
 ("Pe 'no walls' off",Q,"'no walls': !forces.walls.present,","'no walls': false,"),
]
os.makedirs(O,exist_ok=True)
for name,f,a,b in P:
  orig=None
  if f:
    p=os.path.join(B,f); orig=open(p).read(); assert orig.count(a)==1,(name,orig.count(a)); open(p,'w').write(orig.replace(a,b))
  try:
    jf=os.path.join(O,name.split()[0]+'.json')
    r=subprocess.run(['npx','vitest','run',*G,'--reporter=json','--outputFile='+jf],cwd=B,capture_output=True,text=True)
    j=json.load(open(jf)); red=sorted({t['name'].split('tests/')[-1] for t in j['testResults'] if t['status']!='passed'})
    titles=[a['title'] for t in j['testResults'] for a in t['assertionResults'] if a['status']!='passed']
    print(f"{name}: exit {r.returncode}, passed {j['numPassedTests']}, failed {j['numFailedTests']}, red files {red}, titles {titles}", flush=True)
  finally:
    if f: open(p,'w').write(orig)
