# gen212.py <frozen 211> <lane 211 at 28f52b1e4> <out 212> <out 212 down>
# Every function statement the lane's 211 added or changed since the frozen 211 is carried VERBATIM (its lead
# comments with it), in the lane file's order, then the grants the two restated reads take and section 7's revoke.
# The down file carries the frozen 211's statements of the five changed functions VERBATIM, then drops the ten new.
import sys, subprocess, os, re
here = os.path.dirname(os.path.abspath(__file__))
frozen_p, lane_p, out_p, down_p = sys.argv[1:5]
def load(p):
    L = open(p, encoding='utf8').read().split('\n')
    spans = []
    for s in filter(None, subprocess.run([sys.executable, '-I', os.path.join(here, 'spans.py'), p], capture_output=True, text=True).stdout.split('\n')):
        a, b, c, n = s.split(); spans.append((int(a), int(b), int(c), n))
    return L, spans
FL, FS = load(frozen_p); LL, LS = load(lane_p)
fst = {n: '\n'.join(FL[b-1:c]) for a, b, c, n in FS}
lst = {n: '\n'.join(LL[b-1:c]) for a, b, c, n in LS}
new = [n for a, b, c, n in LS if n not in fst]
changed = [n for a, b, c, n in LS if n in fst and fst[n] != lst[n]]
assert not [n for n in fst if n not in lst], 'a function left the lane file'
GRANTS = {
  'get_gallery_dossier': ['revoke execute on function public.get_gallery_dossier(text) from public;',
                          'grant execute on function public.get_gallery_dossier(text) to authenticated, anon;'],
  'import_gallery_dossier': ['revoke execute on function public.import_gallery_dossier(text) from public;',
                             'grant execute on function public.import_gallery_dossier(text) to authenticated;'],
}
for n, g in GRANTS.items():   # the grants as both files state them, right after the statement
    for L, S in ((FL, FS), (LL, LS)):
        c = [s for s in S if s[3] == n][0][2]
        assert L[c+1:c+3] == g, (n, L[c+1:c+3])
def block(L, S, n, lead=True):
    a, b, c, _ = [s for s in S if s[3] == n][0]
    return '\n'.join(L[(a if lead else b)-1:c]) + ('\n\n' + '\n'.join(GRANTS[n]) if n in GRANTS else '')
SEC4B = '\n'.join(LL[[i for i, l in enumerate(LL) if l.startswith('-- ── 4b.')][0]:][:5])
assert SEC4B.count('\n') == 4 and LL[LL.index(SEC4B.split('\n')[0]) + 5] == ''
REVOKE = '\n'.join(LL[[i for i, l in enumerate(LL) if l.startswith('-- ── 7. THE HELPERS')][0]:][:9])
assert REVOKE.endswith('end $do$;')
header = open(os.path.join(here, 'header212.sql'), encoding='utf8').read().rstrip('\n')
parts = [header]
for a, b, c, n in LS:
    if n not in new and n not in changed: continue
    if n == '_gallery_veil_pieces': parts.append(SEC4B)
    tag = 'NEW' if n in new else "RESTATED (211's statement, with the cure)"
    parts.append('-- [212: %s] public.%s' % (tag, n) + '\n' + block(LL, LS, n))
parts.append(REVOKE)
open(out_p, 'w', encoding='utf8').write('\n\n'.join(parts) + '\n')
# the down file
sigs = []
for n in new:
    m = re.match(r'create or replace function public\.(\w+)\((.*?)\)\s*$', lst[n].split('\n')[0]) or re.match(r'create or replace function public\.(\w+)\((.*?)\)\s*returns', lst[n].split('\n')[0])
    args = [re.sub(r'\s+default\s+.*$', '', x.strip()).split()[-1] for x in m.group(2).split(',')]
    sigs.append('drop function if exists public.%s(%s);' % (n, ', '.join(args)))
dh = open(os.path.join(here, 'header212down.sql'), encoding='utf8').read().rstrip('\n')
dparts = [dh, "-- ── 1. the five functions 212 restated, at the frozen 211's statements, verbatim ──────────────────────"]
for a, b, c, n in FS:
    if n in changed: dparts.append('-- [212 down: back to 211 at 333b33973] public.%s' % n + '\n' + block(FL, FS, n, lead=False))
dparts.append('-- ── 2. the ten helpers 212 created, by signature ──────────────────────────────────────────────────\n' + '\n'.join(sorted(sigs)))
open(down_p, 'w', encoding='utf8').write('\n\n'.join(dparts) + '\n')
print('new', len(new), new); print('changed', len(changed), changed)
