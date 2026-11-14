"""For every row whose writer file a lane changed after the join took it: the commits (by -S on the needle, else by
file) and whether the needle's line moved; prints one line per (row, lane)."""
import json,subprocess,sys
J='origin/lane/join-2026-11-14'
def git(*a): return subprocess.run(['git',*a],capture_output=True,text=True).stdout
H=json.load(open(sys.argv[1])); out={}
for o in H:
    for w in o['writers']:
        for l,v in (w.get('lanes') or {}).items():
            if not v['post_join_hunks']: continue
            mbj=git('merge-base',J,'origin/lane/'+l).strip()
            rng=f'{mbj}..origin/lane/{l}'
            s=git('log','--format=%h %s','-S',w['needle'],rng,'--',w['file']).strip() if w['needle'] else ''
            f=git('log','--format=%h %s',rng,'--',w['file']).strip()
            rec=dict(lane=l,file=w['file'],touch_line=v['post_join_touch_line'],gone_at_tip=(w['needle'] is not None and not v['needle_at_tip']),S=s.splitlines(),commits=f.splitlines())
            out.setdefault(o['id'],[]).append(rec)
            print(o['id'],l.split('-20')[0],w['file'].replace('src/',''),'LINE' if rec['touch_line'] else '-','GONE' if rec['gone_at_tip'] else '-','| S:',(s.splitlines() or ['-'])[0][:110],'| n=',len(rec['commits']),(rec['commits'] or [''])[0][:100])
json.dump(out,open(sys.argv[2],'w'),indent=1)
