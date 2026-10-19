# D-ST-r5 arithmetic: ST's own DRAFT formulas, re-executed (no master code; the volume's numbers)
F={'unfunded':0.15,'meagre':0.45,'funded':0.8,'lavish':1.0}
Q={'sound':1,'worn':0.5,'ruined':0}
def word(r):
    return 'at_strength' if r>=0.75 else 'manned' if r>=0.40 else 'sparse' if r>=0.20 else 'skeleton' if r>0 else 'hollow'
print('== note 4: a conclave fortification holder (x1/2) under the patron\'s lift')
for band in ['meagre','funded','lavish']:
    for q in ['sound','worn']:
        r=F[band]*Q[q]*0.5
        print(f'  patron {band:8s} {q:5s} -> siteReadiness01 {r:.3f} {word(r)}  walls {18*r:.1f}')
print('== A.1: who may seize a conclave\'s site (stance x refused-within-year)')
for stance in ['permitted','endowed','curbed','outlawed']:
    for refused in [False,True]:
        if stance=='outlawed': ok='SEIZE when the fork moves'
        elif stance=='curbed': ok='SEIZE (after the refusal)' if refused else 'sale only (6b)'
        elif stance=='permitted': ok='sale only (6b)'
        else: ok='nothing (the patron keeps its flock)'
        print(f'  {stance:9s} refused={refused!s:5s} -> {ok}')
print('== A.4: the round-4 reclaim arithmetic that convicted (an unheard den)')
rank={'unfunded':0,'meagre':1,'funded':2,'lavish':3}
for band,post in [('lavish',0),('funded',1),('funded',0)]:
    sc=rank[band]+(-2)+post
    print(f'  r4: {band} posture {post:+d} -> reclaimScore {sc} -> {"moves" if sc>=1 else "declines"};  r5: no offer (the den is unheard)')
print('== A.3: S37 sides (latent points; DRAFT example)')
sides={"Kell's side (field force 30 + harboured modest gang 34)":30+34,'the Ashen Host (strong, 69)':69,'the rival gang (thin, 13)':13}
best=max(sides.items(), key=lambda kv:(kv[1],kv[0]))
for k,v in sides.items(): print(f'  {k}: {v}' + ('  <- contests the holder' if (k,v)==best else '  -> waits at the approach'))
