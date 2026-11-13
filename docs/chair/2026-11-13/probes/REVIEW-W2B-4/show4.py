# REVIEW-W2B-4: print drawn lines compactly for the read (python3 show4.py draw4.json from to)
import json,sys
d=json.load(open(sys.argv[1])); a,b=int(sys.argv[2]),int(sys.argv[3])
for e in d['drawn'][a-1:b]:
    t=e['town']
    print(f"#{e['n']} {','.join(e['families'])} {','.join(e['words'])} | {e['seed']} {t['tier']} {t['population']} crisis={t['crisis']} views={e['views']} src={e['source']} {e['file']}")
    print(f"   Q: {e['quote'][:300]}")
    print(f"   faith={t['faith']} sacred={t['sacredHouse']} guard={t['guard']} def={list(t['defence'].keys())} market={t['market']}")
    print(f"   powers={t['powers']} three={t['rulingThree']} pract={t['practitioners']} food={t['food']}")
    print(f"   roster: {'; '.join(t['roster'])[:600]}")
    print(f"   ctx: {' || '.join(c[:160] for c in e['context'])[:500]}")
