import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
R = []
def rep(old, new): R.append((old, new))
rep(r'''| CURED — RULINGS-ROUND2 A.2: the mark REPLACES the derived band for every hearer that can see it (reason visible and the teller credited); REFINED (vetoable): the crediting test carries RN §6.2's credibility clause | §11.3, PT13, §2.1, the answer paragraph, OD-PT-20, P3, P38 |''',
r'''| CURED — RULINGS-ROUND2 A.2: the mark REPLACES the derived band for every hearer that can see it (its version shows the reason); round 1's belief scaling withdrawn, as RN's round 2 withdrew it (RN-V5(c)) | §11.3, §11.2, PT13, §2.1, the answer paragraph, OD-PT-20, P3, P38 |''')
rep(r'''| CURED — RN-3 precedes PT-1; PT's §3.3 rows register at RN-3's unit; PT-1 and PT-2 light only where RN-3 lights (the owner's alignment-25e/-25g); PT-0 does not wait | §15, §3.3, §14, OD-PT-17 |''',
r'''| CURED — RN-3 precedes PT-1 and PT-2; PT's §3.3 rows register at RN-3's unit; PT-0 does not wait; the owner-row wait the verifier asked about is moot — RULINGS-ROUND2 B (RN, HOST-r1-7) struck RN-3's lighting gate | §15, §3.3, §14, OD-PT-17 |''')
for old, new in R:
    c = s.count(old)
    if c != 1:
        print('MISMATCH count=%d for: %s' % (c, old[:140])); sys.exit(1)
    s = s.replace(old, new)
open(path, 'w', encoding='utf-8').write(s)
print('part6 applied', len(R))
