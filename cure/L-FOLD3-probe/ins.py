"""L-FOLD3 insertion helper (insert-after-unique-anchor only; never deletes or rewrites a line).

apply(target, edits): each edit {"after": "<unique line prefix>", "lines": [...]} or {"append": [...]}.
Anchors resolve against the file as it stands BEFORE the group; inserts run bottom-up.
quote(key): the owner's words of 2026-10-20 verbatim from cure/OWNER-WORDS-2026-10-20.md (key '0a','1',...,'10').
"""
import re

KIT = '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17'
FOLD = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_COHERENCE_FOLD.md'
SPINE = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_SPINE.md'
CN = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_CN.md'


def quote(key):
    src = open(KIT + '/cure/OWNER-WORDS-2026-10-20.md', encoding='utf-8').read().split('\n')
    for line in src:
        m = re.match(r'^' + re.escape(key) + r'\. \*\*[^*]+\*\* "(.*)"\s*$', line)
        if m:
            return m.group(1)
    raise SystemExit('NO QUOTE ' + key)


def apply(tgt, edits):
    text = open(tgt, encoding='utf-8').read()
    lines = text.split('\n')
    plan = []
    for e in edits:
        for l in e.get('lines', e.get('append', [])):
            assert '\n' not in l, l[:80]
        if 'append' in e:
            plan.append((len(lines), e['append'], '<append>'))
            continue
        a = e['after']
        hits = [i for i, l in enumerate(lines) if l.startswith(a)]
        if len(hits) != 1:
            raise SystemExit(f"ANCHOR FAIL ({len(hits)} hits): {a[:120]}")
        plan.append((hits[0] + 1, e['lines'], a))
    for idx, new, a in sorted(plan, key=lambda p: -p[0]):
        if a == '<append>':
            if lines and lines[-1] == '':
                lines[-1:-1] = new
            else:
                lines.extend(new)
        else:
            lines[idx:idx] = new
    open(tgt, 'w', encoding='utf-8').write('\n'.join(lines))
    print(f"{tgt.split('/')[-1]}: applied {len(plan)} edits, +{sum(len(p[1]) for p in plan)} lines")
