# D-ST-r4 arithmetic receipts (design constants from ST §2.3/§3.2, DRAFT): body readiness under the repair ceiling; the sale's answer table
F={'unfunded':0.15,'meagre':0.45,'funded':0.8,'lavish':1.0}; Q={'sound':1,'worn':0.5,'ruined':0}
def word(r):
    return 'at_strength' if r>=0.75 else 'manned' if r>=0.40 else 'sparse' if r>=0.20 else 'skeleton' if r>0 else 'hollow'
supply={'provisioned':'meagre','strained':'unfunded','starving':'unfunded'}
print('# body holder readiness (gang: x1; conclave of a fortification: x0.5), defender walls = r x 18')
for sw,b in supply.items():
    for q in Q:
        for who,h in (('gang',1),('conclave',0.5)):
            r=F[b]*Q[q]*h
            print(f'{sw:12s} {b:9s} {q:7s} {who:9s} r={r:.3f} {word(r):11s} walls={18*r:.2f}')
print('# saleScore = law + good; sold when >= 0')
for law,l in (('lawful',1),('neutral',0),('chaotic',-1)):
    for good,g in (('good',1),('neutral',0),('evil',-1)):
        sc=l+g; print(f'{law:8s} {good:8s} score={sc:+d} {"sold" if sc>=0 else "refused"}')
