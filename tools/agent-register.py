#!/usr/bin/env python3
"""PROGRESS PER AGENT — regenerates PROGRESS-AGENTS.md from the workflow journals.
Usage: python3 agent-register.py  (re-run at every milestone; append-safe: it rewrites the whole file from the journals)
"""
import json, os, glob, datetime
KIT = '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17'
# every chair session's workflow dir (a73343ed = the Fable chair of 10-17/18; 0a2e8bd9 = the chair from 10-18 17:0x)
SAS = ['/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/subagents/workflows',
       '/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/0a2e8bd9-d105-4669-96e3-338d7a30f3a0/subagents/workflows']
RUNS = [('wf_f557f88b-8c0', 'P1 research'), ('wf_679cbb90-c1d', 'P2 compile/cure'), ('wf_35efe181-3ef', 'P3 round 1'),
        ('wf_c23d628a-921', 'P3 round 2a'), ('wf_f56c599f-af9', 'P3 round 2b'), ('wf_d5a76087-ece', 'P3 round 3a'), ('wf_e51cd605-e05', 'P3 round 3b + L-BD'), ('wf_4c5795d2-bac', 'the assessment panel'), ('wf_9e43660b-8f5', 'P3 round 4a'), ('wf_8e78069a-143', 'P3 round 4b'), ('wf_9556d8bf-90b', 'P3 round 5a'), ('wf_5faf00fc-f04', 'P3 round 5b (narrowed)'), ('wf_8054a4b7-551', 'P3 round 6a (narrowed)'), ('wf_8d1ac54f-6ec', 'P4 the fold pass')]
def _find(run):
    for sa in SAS:
        if os.path.exists(os.path.join(sa, run, 'journal.jsonl')): return sa
    return SAS[0]
rows = []
for run, phase in RUNS:
    SA = _find(run)
    jp = os.path.join(SA, run, 'journal.jsonl')
    if not os.path.exists(jp):
        rows.append((phase, run, '(no journal)', '', '', '')); continue
    for line in open(jp):
        try: e = json.loads(line)
        except Exception: continue
        if e.get('type') != 'result': continue
        label = e.get('label') or e.get('agentLabel') or '?'
        aid = e.get('agentId')
        if label == '?' and aid:
            import re
            for f in glob.glob(os.path.join(SA, run, f'*{aid}*')):
                try:
                    head = open(f, errors='ignore').read(20000)
                    m = re.search(r'"label"\s*:\s*"([^"]+)"', head)
                    if m: label = m.group(1); break
                except Exception: pass
            if label == '?': label = f'agent {aid[:8]}'
        r = e.get('result') or e.get('value') or {}
        if isinstance(r, str):
            path, counts = '', r[:160].replace('\n', ' ')
        else:
            path = r.get('path', '')
            counts = r.get('counts') or (f"{r.get('blocking','?')}B/{r.get('major','?')}M/{r.get('minor','?')}m" if 'blocking' in r else '') or (f"holds {r.get('holds')} · fails {r.get('fails')} · new {r.get('newBlocking')}B/{r.get('newMajor')}M" if 'holds' in r else '') or (r.get('numstat','').replace('\n',' ') if 'numstat' in r else '') or ''
        status = 'stopped early' if (isinstance(r, dict) and r.get('stoppedEarly')) else 'done'
        stops = ''
        if isinstance(r, dict):
            st = r.get('stops') or []
            stops = f"{len(st)} STOP" if st else ''
        rows.append((phase, run, label, status, path, (counts + ('; ' + stops if stops else '')).strip()))
now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M %Z')
out = [f"# PROGRESS PER AGENT — regenerated {now} from the workflow journals (the per-agent transcripts are `<session>/subagents/workflows/<run>/agent-*.jsonl` (sessions a73343ed and 0a2e8bd9), copied to `logs/subagents-*/` at each save)", '',
       '| Phase | Run | Agent (label) | Status | Output file | Counts / notes |', '|---|---|---|---|---|---|']
for p, run, label, status, path, counts in rows:
    out.append(f"| {p} | `{run}` | `{label}` | {status} | `{path}` | {counts} |")
out.append('')
out.append('Pending or running agents do not appear until their result line lands in the journal; `BOARD.md` names what is in flight.')
open(os.path.join(KIT, 'PROGRESS-AGENTS.md'), 'w').write('\n'.join(out) + '\n')
print(f"wrote PROGRESS-AGENTS.md with {len(rows)} agent rows")
