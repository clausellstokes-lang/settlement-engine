# UPKEEP-11: class each failing test of the tip (alone) against the base: tip-only (the lane's), both (carried from the base), and the files whose base run errored.
import re,sys
def fails(p):
    s=set()
    for l in open(p,errors='replace'):
        m=re.match(r'^ FAIL  (.+?)$',l.rstrip())
        if m: s.add(m.group(1).strip())
    return s
T=fails(sys.argv[1]); B=fails(sys.argv[2])
files=lambda S:{x.split(' > ')[0].split(' [')[0] for x in S}
only=sorted(T-B); both=sorted(T&B); gone=sorted(B-T)
print(f"tip-alone failing {len(T)}; base failing {len(B)}; tip-only {len(only)}; both {len(both)}; base-only {len(gone)}")
print("TIP-ONLY FILES:", len(files(set(only)))); [print("  ",f) for f in sorted(files(set(only)))]
print("BOTH FILES:", len(files(set(both)))); [print("  ",f) for f in sorted(files(set(both)))]
print("== TIP-ONLY TESTS"); [print("  ",x[:230]) for x in only]
