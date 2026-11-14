import subprocess, sys, re, os
B=sys.argv[1]; D='src/domain/display/stateProse/defenseStateProse.js'; Q='src/domain/display/stateProse/postureLineDisqualifiers.js'; H='src/domain/dossier/plotHooks.js'
G='tests/domain/defensePostureAgainstItsFacts.test.js tests/domain/defenseWatchIsNotTheLevy.test.js tests/domain/defenseSupplyUnderACrisis.test.js tests/domain/plotHooksEventLabelsHistory.test.js tests/domain/defenseNoForceReadsEveryBody.test.js tests/domain/defenseWithinTheBar.test.js'.split()
P=[('P1 occupation strike off',Q,"const occupied = types.includes('occupied');","const occupied = false;"),
 ('P2 reverse guard (strong beside a Weak bar) off',D,"if (poolKey !== 'readiness STRONG') return poolKey;","return poolKey;"),
 ('P3 guard on paper off',Q,"return Boolean(c?.inst?.hasMilitaryInst)","return false && Boolean(c?.inst?.hasMilitaryInst)"),
 ('P4 short supply off',Q,"const strikeWhole = occupied || guardOnPaper(settlement) || supplyShort;","const strikeWhole = occupied || guardOnPaper(settlement);"),
 ("P5 F3 'no walls' off",Q,"'no walls': !forces.walls.present,","'no walls': false,"),
 ("P6 'no watch or garrison' off",Q,"'no watch or garrison': !forces.watch.present && !forces.garrison.present,","'no watch or garrison': false,"),
 ('P7 watch back in the militia key',D,"withinTheBar(watchOnly ? null : invasionRowPoolKey(walls, garrison || contracted, militia), dp.scores?.military)","withinTheBar(invasionRowPoolKey(walls, garrison || contracted, militia || watch), dp.scores?.military)"),
 ('P8 held-perimeter filter off',D,"(poolKey && watchOnly && HELD_PERIMETER_POOLS.has(poolKey) ? null : poolKey)","(poolKey)"),
 ('P9 supply under a crisis off',D,"entry?.type === 'under_siege' || entry?.type === 'famine') ? null : poolKey);","false) ? null : poolKey);"),
 ('P10 Plot Hooks labels reverted',H,"exile_return: 'Occupation Legacy',","exile_return: 'Exile & Return',"),
 ('P11 ADEQUATE fallback re-admitted under occupation (N3 unguarded?)',D,"return linePool !== poolKey && CORPUS['DS-DEF-1'].pools[linePool] ? linePool : null;","return null;")]
for name,f,a,b in P:
  p=os.path.join(B,f); s=open(p).read(); assert s.count(a)==1,(name,s.count(a)); open(p,'w').write(s.replace(a,b))
  r=subprocess.run(['npx','vitest','run',*G,'--reporter=json','--outputFile=/tmp/claude-0/plant.json'],cwd=B,capture_output=True,text=True)
  import json; j=json.load(open('/tmp/claude-0/plant.json')); red=sorted({t['name'].split('tests/')[-1] for t in j['testResults'] if t['status']!='passed'}); n=j['numFailedTests']
  print(f"{name}: exit {r.returncode}, failed tests {n}, red files {red}", flush=True)
  subprocess.run(['git','checkout','--',f],cwd=B)
