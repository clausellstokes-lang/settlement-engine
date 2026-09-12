#!/usr/bin/env python3
"""mk-block-resume.py — rebuild a REWRITE block's state for rewrite-block-v2.workflow.js in a NEW session.
Usage: python3 mk-block-resume.py <journal.jsonl of the dead run> <args-<BLOCK>.launch.json> <dock path> <out.json> [fromRunId]
Reads the dead run's journal (every finished agent's return value), the dock's git log (the gate commits) and the packets on disk,
replays the script's own bookkeeping (draft state per pool; cure targets per round) and writes the launch args + a `resume` object
the script short-circuits on. Warns on a dirty dock (a dead gate's stage: restore with `git show HEAD:` never checkout) and on a
commit with no gate result (the gate died after committing: the round is counted done, its per-pool verdicts unknown)."""
import json, sys, os, re, subprocess
J, LA, DOCK, OUT = sys.argv[1:5]
RUNID = sys.argv[5] if len(sys.argv) > 5 else os.path.basename(os.path.dirname(J))
la = json.load(open(LA)); BLOCK = la['block']; POOLS = la['pools']; DIRS = [p['dir'] for p in POOLS]
PRIOR = la.get('resume') if isinstance(la.get('resume'), dict) else {}  # a run launched FROM a resume: its supplied phases left no journal results, so seed from them
SC = os.path.dirname(os.path.dirname(os.path.abspath(LA))) if os.path.basename(os.path.dirname(os.path.abspath(LA))) == 'rewrite' else None
PK = os.path.join(os.path.dirname(os.path.abspath(LA)), BLOCK)
warn = []
# --- the dock's commits ---
def git(*a): return subprocess.run(['git', '-C', DOCK] + list(a), capture_output=True, text=True).stdout
porc = git('status', '--porcelain').strip()
if porc: warn.append('DOCK DIRTY (a dead gate left its stage): restore each file with `git -C ' + DOCK + ' show HEAD:<path> > <path>` (never checkout), then porcelain 0, then launch. Files:\n' + porc)
log = [l.split(' ', 1) for l in git('log', '--format=%H %s', '-n', '60').splitlines()]
kinds = {}  # sha -> (kind, round)
for sha, msg in log:
    if not msg.startswith('REWRITE 8b ' + BLOCK): continue
    m = re.search(r'draft round (\d+)', msg)
    if m: kinds[sha] = ('draft', int(m.group(1))); continue
    if ' refine:' in msg: kinds[sha] = ('refine', 0); continue
    m = re.search(r'cure round (\d+)', msg)
    if m: kinds[sha] = ('cure', int(m.group(1))); continue
    if ' cured:' in msg: kinds[sha] = ('cured', 0); continue
    if 'judge rulings applied' in msg or 'cure target' in msg: kinds[sha] = ('judged', 0); continue
def kind_of(sha):
    if not sha: return (None, 0)
    for k in kinds:
        if k.startswith(sha) or sha.startswith(k): return kinds[k]
    return (None, 0)
# --- the journal's results, in order ---
res = []
for line in open(J):
    try: o = json.loads(line)
    except Exception: continue
    if o.get('type') == 'result': res.append(o['result'])
marks, dgates, rgates, refutes, rerefutes, curers, cgates = [], [], [], [], [], [], []
judge = applied = judgeCure = appliedCure = None
for r in res:
    if not isinstance(r, dict): continue
    if 'variants' in r and 'path' in r and 'dir' in r and 'cured' not in r: marks.append(r); continue
    if 'commit' in r and isinstance(r.get('pools'), list):
        items = r['pools']
        if items and 'applied' in items[0]: cgates.append(r); continue
        k, n = kind_of(r['commit'])
        if k == 'refine': rgates.append(r)
        elif k == 'draft': dgates.append((n, r))
        else:
            # no matching commit: order decides — a gate before any refute is a draft gate
            if not refutes and not rgates: dgates.append((len(dgates) + 1, r)); warn.append('a draft gate result with commit ' + str(r['commit'])[:10] + ' is not in the dock log; counted as round ' + str(len(dgates)))
            else: rgates.append(r); warn.append('a gate result with commit ' + str(r['commit'])[:10] + ' is not in the dock log; counted as the refine gate')
        continue
    if 'dir' in r and 'verdicts' in r and 'newFindings' in r: rerefutes.append(r); continue
    if 'dir' in r and 'verdicts' in r: refutes.append(r); continue
    if 'dir' in r and 'path' in r and 'cured' in r and 'refused' in r: curers.append(r); continue
    if 'judgmentPath' in r and 'variants' in r:
        if r.get('commit') == 'not-committed': judge = r
        else: applied = r
        continue
    if 'judgmentPath' in r and 'cured' in r:
        if r.get('commit') == 'not-committed': judgeCure = r
        else: appliedCure = r
        continue
# --- MARK ---
markedDirs = [m['dir'].rstrip('/').split('/')[-1] for m in marks]
markedDirs = [d for d in markedDirs if d in DIRS and os.path.exists(os.path.join(PK, d, 'skeleton.md'))]
for d in (PRIOR.get('markedDirs') or []):
    if d in DIRS and d not in markedDirs and os.path.exists(os.path.join(PK, d, 'skeleton.md')): markedDirs.append(d)
# --- DRAFT state replay (the script's own rules) ---
state = {d: {'inBand': False, 'dry': 0, 'banked': False, 'rounds': 0, 'feedback': ''} for d in DIRS}
def feedback_of(v):
    f = '; '.join(m.get('measure', '') + ' = ' + str(m.get('value', '')) + ' (band ' + str(m.get('band', '')) + ')' for m in v.get('failing', []))
    rr = (' REFUSALS: ' + '; '.join(v.get('refusals', []))) if v.get('refusals') else ''
    return (f or 'no failing measure') + rr
dgates.sort(key=lambda t: t[0])
draftCommit = None
for n, g in dgates:
    for v in g['pools']:
        s = state.get(v.get('dir'))
        if not s: continue
        s['rounds'] += 1; s['feedback'] = feedback_of(v)
        if v.get('inBand'): s['inBand'] = True; s['dry'] = 0; continue
        if v.get('moved'): s['dry'] = 0
        else: s['dry'] += 1
        if s['dry'] >= 2: s['banked'] = True
    draftCommit = g['commit']
draftRoundsDone = len(dgates)
# draft commits in the log with no gate result (the gate died after committing)
logDraftRounds = sorted(n for (k, n) in kinds.values() if k == 'draft')
for n in logDraftRounds:
    if n > draftRoundsDone:
        sha = [k for k, v in kinds.items() if v == ('draft', n)][0]
        warn.append('draft round %d is COMMITTED (%s) but its gate never returned: counted done with the open pools carried (feedback unknown)' % (n, sha[:9]))
        for d, s in state.items():
            if not s['inBand'] and not s['banked']: s['rounds'] += 1
        draftRoundsDone = n; draftCommit = sha
refineCommit = rgates[-1]['commit'] if rgates else None
if not refineCommit:
    for k, v in kinds.items():
        if v == ('refine', 0): refineCommit = k; warn.append('the refine commit %s is in the log but its gate never returned: counted done' % k[:9])
# --- CURE replay ---
cureOpen = None; cureCommits = []; cureRoundsDone = 0
if judge and isinstance(judge.get('cureTargets'), list):
    openm = {d: {'targets': [dict(variant=t['variant'], face=t['face'], quote=t.get('quote', ''), finding=t.get('finding', ''), cure=t.get('cure', '')) for t in judge['cureTargets'] if t.get('dir') == d], 'history': []} for d in DIRS}
    # the re-refutes belong to rounds in order: after cure gate N and before gate N+1
    gate_pos, rr_pos = [], []
    for i, r in enumerate(res):
        if isinstance(r, dict) and 'commit' in r and isinstance(r.get('pools'), list) and r['pools'] and 'applied' in r['pools'][0]: gate_pos.append((i, r))
        if isinstance(r, dict) and 'dir' in r and 'verdicts' in r and 'newFindings' in r: rr_pos.append((i, r))
    for gi, (pos, g) in enumerate(gate_pos):
        rnd = gi + 1
        live = [d for d in DIRS if openm[d]['targets']]
        appliedSet = set(p['dir'] for p in g['pools'] if p.get('applied'))
        nxt = gate_pos[gi + 1][0] if gi + 1 < len(gate_pos) else 10**9
        rrs = {r['dir'].rstrip('/').split('/')[-1]: r for (p, r) in rr_pos if pos < p < nxt}
        for d in live:
            o = openm[d]
            if d not in appliedSet: o['history'].append({'round': rnd, 'note': 'packet refused by the gate; targets unchanged'}); continue
            x = rrs.get(d)
            if not x: o['history'].append({'round': rnd, 'note': 'refuter returned nothing (or died); targets carried unchanged'}); warn.append('cure round %d: no re-refutation for %s in the journal; its targets are carried' % (rnd, d)); continue
            fails = [v for v in x['verdicts'] if v.get('verdict') == 'FAIL']
            o['history'].append({'round': rnd, 'fail': len(fails), 'pass': len(x['verdicts']) - len(fails), 'newFindings': len(x['newFindings'])})
            o['targets'] = [dict(variant=v['variant'], face=v['face'], quote=v.get('quote', ''), finding=v.get('finding', '') + ' [' + v.get('law', '') + ']', cure=v.get('cure', '')) for v in fails] + \
                           [dict(variant=v['variant'], face=v['face'], quote=v.get('quote', ''), finding='NEW after the cure: ' + v.get('finding', '') + ' [' + v.get('law', '') + ']', cure=v.get('cure', '')) for v in x['newFindings']]
        cureCommits.append(g['commit']); cureRoundsDone = rnd
    cureOpen = openm
# seed from the prior resume object where this run's journal shows nothing for a phase
if PRIOR:
    if not dgates and PRIOR.get('draftRoundsDone'):
        draftRoundsDone = max(draftRoundsDone, int(PRIOR['draftRoundsDone'])); draftCommit = draftCommit or PRIOR.get('draftCommit')
        if PRIOR.get('draftState'):
            for d, st in PRIOR['draftState'].items():
                if d in state: state[d].update({k: st.get(k, state[d][k]) for k in ('inBand', 'dry', 'banked', 'rounds', 'feedback')})
    refineCommit = refineCommit or PRIOR.get('refineCommit')
    prior_ref = {r['dir']: r for r in (PRIOR.get('refutes') or []) if isinstance(r, dict) and 'dir' in r}
    have = set(r['dir'].rstrip('/').split('/')[-1] for r in refutes)
    for d, r in prior_ref.items():
        if d not in have: refutes.append(r)
    judge = judge or PRIOR.get('judge'); applied = applied or PRIOR.get('applied')
    if not cgates and PRIOR.get('cureRoundsDone'):
        cureRoundsDone = int(PRIOR['cureRoundsDone']); cureCommits = list(PRIOR.get('cureCommits') or []); cureOpen = PRIOR.get('cureOpen')
    judgeCure = judgeCure or PRIOR.get('judgeCure'); appliedCure = appliedCure or PRIOR.get('appliedCure')
    warn.append('seeded from the prior resume object in ' + os.path.basename(LA) + ' (markedDirs ' + str(len(PRIOR.get('markedDirs') or [])) + ')')
out = dict(la)
out['resume'] = {
    'fromRunId': RUNID,
    'markedDirs': markedDirs,
    'draftRoundsDone': draftRoundsDone, 'draftCommit': draftCommit, 'draftState': state if draftRoundsDone else None,
    'refineCommit': refineCommit,
    'refutes': [{'dir': r['dir'].rstrip('/').split('/')[-1], 'verdicts': r['verdicts'], 'readAloud': r.get('readAloud', [])} for r in refutes if r['dir'].rstrip('/').split('/')[-1] in DIRS],
    'judge': judge, 'applied': applied,
    'cureRoundsDone': cureRoundsDone, 'cureCommits': cureCommits, 'cureOpen': cureOpen,
    'judgeCure': judgeCure, 'appliedCure': appliedCure,
}
out['_resume_summary'] = {
    'journal': J, 'dock_head': git('rev-parse', '--short', 'HEAD').strip(), 'dock_porcelain_lines': len(porc.splitlines()) if porc else 0,
    'results_total': len(res), 'marks': len(marks), 'marked_with_skeleton': len(markedDirs), 'draft_gates': len(dgates), 'refine_gate': bool(rgates),
    'refutes': len(out['resume']['refutes']), 'judge': bool(judge), 'applied': bool(applied), 'curers': len(curers), 'cure_gates': len(cgates), 'rerefutes': len(rerefutes),
    'judgeCure': bool(judgeCure), 'appliedCure': bool(appliedCure), 'warnings': warn,
}
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(json.dumps(out['_resume_summary'], indent=1))
