# usage: python3 -I kwic.py <file> <needle> [width] [max]
import sys
f, n = sys.argv[1], sys.argv[2]
w = int(sys.argv[3]) if len(sys.argv) > 3 else 250
mx = int(sys.argv[4]) if len(sys.argv) > 4 else 6
c = 0
for i, l in enumerate(open(f, encoding='utf-8'), 1):
    s = 0
    while True:
        k = l.find(n, s)
        if k < 0: break
        print(f"{f.split('/')[-1]}:{i}: …{l[max(0,k-w):k+len(n)+w].strip()}…")
        c += 1; s = k + len(n)
        if c >= mx: sys.exit(0)
print(f"[{c} hits shown]")
