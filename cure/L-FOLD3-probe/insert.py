import sys, json
# usage: insert.py target.md edits.json  -- each edit: {"after": "<unique line prefix>", "lines": [...]} or {"append": [...]}
tgt, ef = sys.argv[1], sys.argv[2]
text = open(tgt, encoding='utf-8').read()
assert not text.endswith('\n\n\n')
lines = text.split('\n')
edits = json.load(open(ef, encoding='utf-8'))
# resolve anchors against the ORIGINAL lines first
plan = []
for e in edits:
    if 'append' in e:
        plan.append((len(lines), e['append'], '<append>'))
        continue
    a = e['after']
    hits = [i for i, l in enumerate(lines) if l.startswith(a)]
    if len(hits) != 1:
        print(f"ANCHOR FAIL ({len(hits)} hits): {a[:120]}"); sys.exit(2)
    plan.append((hits[0] + 1, e['lines'], a))
# insert from the bottom up so indices stay valid
for idx, new, a in sorted(plan, key=lambda p: -p[0]):
    if a == '<append>':
        # file ends with '' after final newline -> insert before that trailing ''
        if lines and lines[-1] == '':
            lines[-1:-1] = new
        else:
            lines.extend(new)
    else:
        lines[idx:idx] = new
open(tgt, 'w', encoding='utf-8').write('\n'.join(lines))
print(f"applied {len(plan)} edits, +{sum(len(p[1]) for p in plan)} lines")
