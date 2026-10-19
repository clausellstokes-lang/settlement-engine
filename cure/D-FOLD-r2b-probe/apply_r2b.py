# D-FOLD-r2b insertion engine (copied from cure/D-FOLD-r2-probe/apply_r2.py; insertions only). Usage:
#   python3 -I apply_r2b.py <docs dir> [--write]
# Every insertion is anchored on a substring that must occur on exactly ONE line of the
# ORIGINAL file; the new lines go after that line (+offset). Table rows must carry the same
# number of unescaped pipes as the anchor row's table. Without --write it only checks.
import os, re, sys, importlib.util, difflib
here = os.path.dirname(os.path.abspath(__file__))
tfile = next((a.split('=',1)[1] for a in sys.argv if a.startswith('--texts=')), 'texts_r2b.py')
spec = importlib.util.spec_from_file_location('texts_r2b', os.path.join(here, tfile))
T = importlib.util.module_from_spec(spec); spec.loader.exec_module(T)
docs = sys.argv[1]; write = '--write' in sys.argv
FILES = {'FOLD': 'DESIGN_FP_COHERENCE_FOLD.md', 'SPINE': 'DESIGN_FP_SPINE.md', 'CN': 'DESIGN_FP_ARCH_CN.md'}
CLAIM_RE = re.compile(r"promoted (?:from warn )?to (?:ERROR|error)|burned (?:down )?to zero|\b0 problems|machine-enforced|the gate now (?:covers|type-checks)|fails the gate|fails the build|zero violations")
CITATION = re.compile(r"(?<![\w/.\-])((?:[\w.\-]+/)*[\w.\-]+\.(?:js|jsx|mjs|cjs|ts|tsx)):(\d+)")
FORBID = ['@enforced-by', "SP-3 THE PACT GRAMMAR", "SP-3 IS this program's core", 'a flag lit out of order is an invalid config']
def pipes(line):
    return len(re.findall(r'(?<!\\)\|', line))
errors = []
report = []
pending = []
for key, fname in FILES.items():
    path = os.path.join(docs, fname)
    orig = open(path, encoding='utf-8').read()
    lines = orig.split('\n')
    plan = []
    for ins in [i for i in T.INS if i['file'] == key]:
        hits = [n for n, l in enumerate(lines) if ins['anchor'] in l]
        if len(hits) != 1:
            errors.append(f"{key}: anchor {ins['anchor'][:70]!r} matched {len(hits)} lines"); continue
        at = hits[0] + ins.get('offset', 0)
        if ins.get('expect') is not None and lines[at] != ins['expect']:
            errors.append(f"{key}: line {at+1} is {lines[at][:60]!r}, expected {ins['expect']!r}"); continue
        t = ins['text']
        t = t[1:] if t.startswith('\n') else t
        t = t[:-1] if t.endswith('\n') else t
        new = t.split('\n')
        ref = lines[hits[0]]
        for nl in new:
            if CLAIM_RE.search(nl): errors.append(f"{key}: CLAIM_RE hit in {nl[:80]!r}")
            m = CITATION.search(nl)
            if m: errors.append(f"{key}: path:line citation {m.group(0)!r}")
            for f in FORBID:
                if f in nl: errors.append(f"{key}: forbidden phrase {f!r}")
            if nl.startswith('|') and ref.startswith('|') and ins.get('table', True):
                if pipes(nl) != pipes(ref):
                    errors.append(f"{key}: pipe count {pipes(nl)} != {pipes(ref)} for row {nl[:70]!r}")
        plan.append((at, new, ins.get('id', '')))
    # apply bottom-up so earlier indices stay valid
    plan.sort(key=lambda x: x[0], reverse=True)
    out = list(lines)
    inserted_idx = []
    for at, new, _ in plan:
        out[at+1:at+1] = new
    text = '\n'.join(out)
    # insertions-only proof: the original's lines are a subsequence with nothing removed or changed
    sm = difflib.SequenceMatcher(a=lines, b=out, autojunk=False)
    dels = sum((i2 - i1) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag in ('delete', 'replace'))
    adds = sum((j2 - j1) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag in ('insert', 'replace'))
    report.append(f"{fname}: {len(plan)} insertions, +{adds} lines, -{dels} lines, {len(lines)} -> {len(out)} lines")
    if dels: errors.append(f"{fname}: {dels} original lines changed or removed")
    pending.append((path, text))
print('\n'.join(report))
if errors:
    print('ERRORS:'); print('\n'.join(errors)); sys.exit(1)
if write:
    for path, text in pending:
        open(path, 'w', encoding='utf-8').write(text)
print('WRITTEN' if write else 'CHECK OK (dry run)')
