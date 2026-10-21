#!/usr/bin/env python3
"""PROGRESS PER AGENT — regenerates PROGRESS-AGENTS.md from the workflow journals.
Usage: python3 agent-register.py  (re-run at every milestone; append-safe: it rewrites the whole file from the journals)
"""
import json, os, glob, datetime
KIT = '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17'
# every chair session's workflow dir (a73343ed = the Fable chair of 10-17/18; 0a2e8bd9 = the chair from 10-18 17:0x)
SAS = ['/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/subagents/workflows',
       '/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/0a2e8bd9-d105-4669-96e3-338d7a30f3a0/subagents/workflows',
       '/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/6eb7b5b6-80cf-4cc0-a114-2e95f5dbc3d3/subagents/workflows']
RUNS = [('wf_f557f88b-8c0', 'P1 research'), ('wf_679cbb90-c1d', 'P2 compile/cure'), ('wf_35efe181-3ef', 'P3 round 1'),
        ('wf_c23d628a-921', 'P3 round 2a'), ('wf_f56c599f-af9', 'P3 round 2b'), ('wf_d5a76087-ece', 'P3 round 3a'), ('wf_e51cd605-e05', 'P3 round 3b + L-BD'), ('wf_4c5795d2-bac', 'the assessment panel'), ('wf_9e43660b-8f5', 'P3 round 4a'), ('wf_8e78069a-143', 'P3 round 4b'), ('wf_9556d8bf-90b', 'P3 round 5a'), ('wf_5faf00fc-f04', 'P3 round 5b (narrowed)'), ('wf_8054a4b7-551', 'P3 round 6a (narrowed)'), ('wf_8d1ac54f-6ec', 'P4 the fold pass'), ('wf_36e3e93b-86d', 'P5a the census (twelve seats)'), ('wf_138b6595-781', 'P5b the synthesis critic'), ('wf_31b52ec6-acf', 'P6a compiles OP · MG · WS · FS + skeptics'), ('wf_54affd92-789', 'P5c dispositions (seven lanes) + V-ALL-p5'), ('wf_01e58cbf-90a', 'P6b dispositions D-<V>-r1 + verifiers'), ('wf_9ac318be-7a1', 'P6b round 2: D-<V>-r2 + verifiers'), ('wf_6afb1966-af5', 'P5d the residue (MN-RN · PS-ST-PR · BD) + V-ALL-p5b'), ('wf_efb5b1a6-b25', 'L-CH-PD the patron deity + CH-PD-r1'), ('wf_532f0d21-5f6', 'P6b round 3: D-<V>-r3 + verifiers'), ('wf_6f84776f-7fd', 'D-CH-PD-r1 + V-CH-PD-r1 (the patron deity)'), ('wf_3f52e58b-726', 'P6d the residue lane D-FOUR-r4'), ('wf_a1c2c062-397', 'P6c brackets lanes A (landed war/roads) + A2 (the program volumes)'), ('wf_0333c9e3-4c7', 'SEAMS-P6 (one Fable seat)'), ('wf_78a722d1-7eb', 'P6c lane B (CH · one RN bracket · OP lines) + V-BRACKETS-p6c'), ('wf_a6871fc1-a39', 'P6c lane C (the seams: PS · MG · OP · BD · WC · WS · CH)'), ('wf_f6ce8f38-768', 'P6c lane D (§J: RN · PT · CH · OP · PS)'), ('wf_b754bb0e-6fb', 'P7 the fold pass L-FOLD3 (one Opus lane)'), ('wf_6b50ba6c-a9c', 'P8a the consolidation pilot (WS · FS + fidelity verifiers)'), ('wf_4f98f1fe-f4f', 'P8b wave 1 (OP · MG · CH + fidelity verifiers)'), ('wf_64ee67e4-a79', 'P8b the CH continuation (resume) + FV-CH')]
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
