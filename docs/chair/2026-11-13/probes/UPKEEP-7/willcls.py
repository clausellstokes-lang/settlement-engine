import json,sys
r=[json.loads(l) for l in open(sys.argv[1])]
bad=[o for o in r if o.get('willPay') is not None and o.get('willPay')!=o.get('willFull') and o.get('heldA') is None and o.get('heldB') is None and not o.get('crisis')]
print('pay reaches the will outside its hold:',len(bad),'of',len(r)); print([(o['seed'],o['willPay'],o['willFull']) for o in bad])
