# catalogue.py — writes ../CATALOGUE.md from inputs/classified.json (the catalogue read off the chain,
# classified by inputs/classify.py), the caller lists in inputs/, and the harness outcomes in out/.
import json, subprocess, os
H = os.path.dirname(os.path.abspath(__file__))
cat = json.load(open(f'{H}/inputs/classified.json'))
revs = set(l.strip() for l in open(f'{H}/inputs/revoke_list.txt'))
pre = {(a, b): c for a, b, c in (l.rstrip('\n').split('\t') for l in open(f'{H}/out/harness-pre.tsv'))}
edgeuser = {'has_surveyor_entitlement','spend_credits','list_my_tickets','list_ticket_thread','surveyor_byok_status',
            'my_transfer_case_status','current_user_is_privileged','get_gallery_dossier','surveyor_settings_get'}
edgesvc = set(x.split('\t')[2].strip().strip('\'"') for x in open(f'{H}/inputs/edge_rpc_all.txt')
              if x.split('\t')[1] not in ('supabaseUser', 'userClient', 'owner', 'client'))
apin = {'get_gallery_dossier', 'get_unlisted_dossier'}
rows, counts = [], {}
for s, c in sorted(cat.items()):
    n = c['name']
    if s in revs: cl = 'INTERNAL — revoked now'
    elif n == 'account_is_active': cl = 'DOOR THAT TRUSTS A PARAMETER'
    elif c['browser'] or n in edgeuser: cl = 'DELIBERATE DOOR'
    elif c['k'] == 'TRIGGER': cl = 'TRIGGER — left alone'
    elif c['k'] in ('VISITOR_SQL', 'INVOKER_BODY'): cl = 'VISITOR-NEEDED — left alone'
    elif not c['definer']: cl = 'INTERNAL — invoker helper, for 213'
    else: raise SystemExit('unclassified ' + s)
    counts[cl] = counts.get(cl, 0) + 1
    callers = []
    if c['browser']: callers.append('browser' + ('+api' if n in apin else ''))
    if n in edgeuser: callers.append('edge(user token)')
    if n in edgesvc: callers.append('edge(service)')
    if 'scripts' in c['m']: callers.append('scripts(service)')
    o = c['objrefs']
    if 'pg_policy' in o: callers.append('RLS policy')
    if 'pg_constraint' in o: callers.append('check constraint')
    if 'pg_trigger' in o: callers.append('trigger')
    if c['bodycallers']: callers.append('sql: ' + c['bodycallers'][:80])
    if c['definer']: chk = ', '.join(c['checks']) or 'none (trusts its parameters)'
    else: chk = ', '.join(c['checks']) or 'n/a: runs as the caller'
    a = pre.get((s, 'anon'), '(trigger: not callable)')
    rows.append((s, 'DEFINER' if c['definer'] else 'invoker', 'Y' if c['anon'] else '-', 'Y' if c['authd'] else '-', cl,
                 '; '.join(callers) or '—', chk, ', '.join(c['writes'])[:90] or '—', ', '.join(c['reads'])[:90] or '—', a[:60]))
esc = lambda x: str(x).replace('|', '\\|')
now = subprocess.check_output(['date', '-u', '+%Y-%m-%d %H:%M UTC']).decode().strip()
order = {'INTERNAL — revoked now': 0, 'DOOR THAT TRUSTS A PARAMETER': 1, 'DELIBERATE DOOR': 2,
         'VISITOR-NEEDED — left alone': 3, 'INTERNAL — invoker helper, for 213': 4, 'TRIGGER — left alone': 5}
with open(f'{H}/../CATALOGUE.md', 'w') as f:
    f.write(f"""# Function grants catalogue — chain 001..203 (origin/master), {now}

Every function of schema `public` that `anon` or `authenticated` may EXECUTE (`has_function_privilege`) on a scratch
PostgreSQL 16 holding origin/master's migrations 001..203 (db832c892) under the Supabase-like scaffold
(`proof/scaffold.sql`). Extension members (pgcrypto) are excluded. **{len(rows)} functions.**

Counts by class: """ + '; '.join(f'**{k}** {v}' for k, v in sorted(counts.items(), key=lambda kv: order[kv[0]])) + """.

How each column was read (the catalogue of the chain, and the tree at origin/master):
* **callers**: `browser` = a `.rpc('name'` call in `src/` or `api/` (multi-line aware, `proof/inputs/browser_rpc_all.txt`);
  `edge(user token)` = an edge function's client built with the caller's own JWT, which runs as `authenticated`;
  `edge(service)` = an edge client built with the service key (`proof/inputs/edge_rpc_all.txt`); `scripts(service)` =
  `scripts/`, which use the service key; `RLS policy` / `check constraint` / `trigger` = a catalogue dependency
  (`pg_depend`); `sql:` = another function whose body names it (`[D]` definer, `[I]` invoker: an invoker caller runs as
  the visitor, so the visitor needs the grant).
* **caller check**: a text scan of the body (comments stripped) for `auth.uid()`, a role or JWT test, or a privilege
  helper (`current_user_is_privileged`, `has_role`, `_assert_service_admin_actor`, …). "none" on a DEFINER function
  means nothing inside stops a caller who names any user or row.
* **writes / reads**: tables named after `insert into` / `update` / `delete from`, and after `from` / `join` (text scan).
* **anon before**: calling it as `anon` with placeholder arguments on the chain BEFORE the script (`proof/harness.sh`,
  each call rolled back). `OK` = it ran to completion as anon.

| function | sec | anon | auth | class | callers | caller check | writes | reads | anon before |
|---|---|---|---|---|---|---|---|---|---|
""")
    for r in sorted(rows, key=lambda r: (order[r[4]], r[0])):
        f.write('| ' + ' | '.join(esc(x) for x in ('`' + r[0] + '`',) + r[1:]) + ' |\n')
print(counts)
