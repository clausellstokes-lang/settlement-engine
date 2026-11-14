# ctx.py <regex> [n] [surface-prefix]: for up to n new lines (plus.ndjson) matching regex, print seed, surface, and 3 lines of context at the tip
import sys, json, re, gzip
S = '/tmp/claude-0/-home-user-settlement-engine/6df78bee-69c1-5d69-8635-8598a0eccd1d/scratchpad'
rx = re.compile(sys.argv[1]); n = int(sys.argv[2]) if len(sys.argv) > 2 else 3; pre = sys.argv[3] if len(sys.argv) > 3 else ''
k = 0; seen = set()
for l in open(S + '/out/plus.ndjson'):
    r = json.loads(l)
    if not rx.search(r['line']) or not r['surface'].startswith(pre) or (r['seed'], r['surface']) in seen: continue
    seen.add((r['seed'], r['surface'])); k += 1
    if k > n: break
    cur = None; lines = []
    for x in gzip.open(f"{S}/out/tip/{r['seed']}.txt.gz", 'rt'):
        x = x.rstrip('\n'); m = re.match(r'^== (.*) ==$', x)
        if m: cur = m.group(1); continue
        if cur == r['surface']: lines.append(x)
    i = next((j for j, x in enumerate(lines) if x.strip() == r['line']), None)
    print(f"--- {r['seed']} [{r['surface']}]")
    if i is not None:
        for x in lines[max(0, i - 3): i + 3]: print('   ' + x[:220])
