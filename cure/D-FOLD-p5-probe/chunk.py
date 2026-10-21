import sys
# usage: chunk.py file startline endline startbyteoffset_within_first_line maxchars
f, a, b = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
off = int(sys.argv[4]) if len(sys.argv) > 4 else 0
mx = int(sys.argv[5]) if len(sys.argv) > 5 else 28000
lines = open(f, encoding='utf-8').read().split('\n')
out = 0
for n in range(a, b + 1):
    s = lines[n - 1]
    if n == a and off:
        s = s[off:]
        pre = f"{n}@{off}: "
    else:
        pre = f"{n}: "
    if out + len(s) > mx:
        room = mx - out
        if room > 200:
            print(pre + s[:room])
            print(f"\n<<CONTINUE {n} {off + room if n == a else room}>>")
        else:
            print(f"\n<<CONTINUE {n} {off if n == a else 0}>>")
        sys.exit(0)
    print(pre + s)
    out += len(s) + len(pre) + 1
print("<<END>>")
