# PT-V2 probe: RN §6.2 lens one (a 1.0, b 0.5, c 0.4; K = max(0,1-2m) kind / 1-2m cruel) under
# round 1's mark formula (all three coordinates leaned by belief) vs round 2's (kind01 replaced only).
def lens_one(k, l, f, malice, lawful, aggr, a=1.0, b=0.5, c=0.4):
    K = max(0.0, 1 - 2*malice) if k > 0.5 else 1 - 2*malice
    return a*(k-0.5)*K + b*(l-0.5)*(2*lawful-1) + c*(f-0.5)*(2*aggr-1)
cases = {
  "verifier's case: act (0.5,0.5,0.5), holder balanced m=0.5, chaotic lawful=0, peaceful aggr=0, mark villainous 0.08, belief 0.6": ((0.5,0.5,0.5),(0.5,0.0,0.0),0.08,0.6),
  "orphanage row (0.1,0.3,0.75), same holder, mark villainous": ((0.1,0.3,0.75),(0.5,0.0,0.0),0.08,0.6),
  "orphanage row, good lawful peaceful holder (m=0.2,l=0.8,ag=0.3), mark admirable 0.73": ((0.1,0.3,0.75),(0.2,0.8,0.3),0.73,0.6),
}
for name,((k,l,f),(m,lw,ag),mk,bel) in cases.items():
    unmarked = lens_one(k,l,f,m,lw,ag)
    r1 = lens_one(k+(mk-k)*bel, l+(mk-l)*bel, f+(mk-f)*bel, m,lw,ag)
    r2 = lens_one(mk, l, f, m,lw,ag)
    print(f"{name}\n  unmarked={unmarked:+.4f}  r1(lean all three)={r1:+.4f}  r2(kind01 replaced)={r2:+.4f}")
