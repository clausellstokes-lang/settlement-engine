import sys, re
# usage: ctx.py file literal before after [maxhits]
f, pat = sys.argv[1], sys.argv[2]
b = int(sys.argv[3]) if len(sys.argv) > 3 else 300
a = int(sys.argv[4]) if len(sys.argv) > 4 else 300
mx = int(sys.argv[5]) if len(sys.argv) > 5 else 20
n = 0
for i, line in enumerate(open(f, encoding='utf-8').read().split('\n'), 1):
    start = 0
    while True:
        j = line.find(pat, start)
        if j < 0: break
        print(f"--- l.{i} @{j}: ..." + line[max(0, j-b): j+len(pat)+a] + "...")
        n += 1
        start = j + len(pat)
        if n >= mx: sys.exit(0)
print(f"[{n} hits]")
