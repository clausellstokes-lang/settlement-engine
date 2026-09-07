#!/usr/bin/env python3
"""lprobe2-compare.py — L-PROBE-2: diff the cheap battery's outputs across consecutive landing tips (lprobe-out-905/<tip>/), per instrument,
per preset / key, so every same-seed movement is attributed to the landing that caused it. Reads only; prints markdown. Chair, 2026-09-06."""
import json, os, sys
O='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/lprobe-out-905'
TIPS=['899-control','900-desk','901-lightdark','902-osr18','903-litdefault','904-tip']
def J(t,f):
    p=f'{O}/{t}/{f}'
    return json.load(open(p)) if os.path.exists(p) else None
present=[t for t in TIPS if J(t,'g-pulse-hashes.json')]
print(f'# L-PROBE-2 cheap-arm comparison over {len(present)} tips: {" → ".join(present)}\n')
# (g) pulse hashes
print('## (g) 52-tick pulse hashes per preset — which hash fields moved between consecutive tips')
HF=['resultHash','worldStateHash','regionalGraphHash','wizardNewsHash']
rows={t:{r['presetId']:r for r in J(t,'g-pulse-hashes.json')['rows']} for t in present}
print('| step | preset | moved fields | observedTicks | epochLit |'); print('|---|---|---|---|---|')
for a,b in zip(present,present[1:]):
    for pid in rows[b]:
        ra,rb=rows[a].get(pid),rows[b][pid]
        if ra is None: print(f'| {a}→{b} | {pid} | NEW PRESET | {rb["observedTicks"]} | {rb["epochLit"]} |'); continue
        mv=[h for h in HF if ra.get(h)!=rb.get(h)]
        if mv or ra.get('epochLit')!=rb.get('epochLit'): print(f'| {a}→{b} | {pid} | {", ".join(mv) or "—"} | {ra["observedTicks"]}→{rb["observedTicks"]} | {ra["epochLit"]}→{rb["epochLit"]} |')
print('\nUnmoved across every step: ' + ', '.join(sorted(pid for pid in rows[present[-1]] if all(rows[a][pid].get(h)==rows[b][pid].get(h) for a,b in zip(present,present[1:]) for h in HF if pid in rows[a]))) or '(none)')
# (f) birth fixtures
print('\n## (f) REAL-birth fixtures per preset — hash / key counts / lit counts')
fx={t:{f['presetId']:f for f in J(t,'f-birth-fixtures.json')['fixtures']} for t in present}
print('| step | preset | hash moved | resolvedRuleKeyCount | litBooleanCount | darkBooleanCount | keys added | keys removed | value changes |'); print('|---|---|---|---|---|---|---|---|---|')
for a,b in zip(present,present[1:]):
    for pid in fx[b]:
        fa,fb=fx[a].get(pid),fx[b][pid]
        if fa is None: print(f'| {a}→{b} | {pid} | NEW | | | | | | |'); continue
        ka,kb=set(fa['resolvedRules']),set(fb['resolvedRules'])
        vc=[k for k in ka&kb if fa['resolvedRules'][k]!=fb['resolvedRules'][k]]
        vcs=', '.join('%s:%s→%s'%(k,fa['resolvedRules'][k],fb['resolvedRules'][k]) for k in sorted(vc)) or '—'
        if fa['hash']!=fb['hash'] or ka!=kb or vc:
            print(f'| {a}→{b} | {pid} | {fa["hash"]!=fb["hash"]} | {fa["resolvedRuleKeyCount"]}→{fb["resolvedRuleKeyCount"]} | {fa["litBooleanCount"]}→{fb["litBooleanCount"]} | {fa["darkBooleanCount"]}→{fb["darkBooleanCount"]} | {", ".join(sorted(kb-ka)) or "—"} | {", ".join(sorted(ka-kb)) or "—"} | {vcs} |')
print('\ndefaultRuleKeyCount per tip: ' + ', '.join(f'{t}={J(t,"f-birth-fixtures.json")["defaultRuleKeyCount"]}' for t in present))
# (d) census
print('\n## (d) lighting-census tuple (live) per tip')
print('| tip | files | parked | credited | titles | suiteTitles | verdict |'); print('|---|---|---|---|---|---|---|')
for t in present:
    d=J(t,'d-lighting-census.json'); l=d['live']; print(f'| {t} | {l["files"]} | {l["parked"]} | {l["credited"]} | {l["titles"]} | {l["suiteTitles"]} | {d["verdict"][:40]} |')
# (e) rosters
print('\n## (e) stability rosters — sizes and lit counts per tip')
for t in present:
    e=J(t,'e-stability-rosters.json'); print(f'- {t}: sizes {e["rosterSizes"]} · litCounts {e["litCounts"]}')
for a,b in zip(present,present[1:]):
    ea,eb=J(a,'e-stability-rosters.json')['rosters'],J(b,'e-stability-rosters.json')['rosters']
    for k in eb:
        if set(ea.get(k,[]))!=set(eb[k]): print(f'  - {a}→{b} {k}: +{sorted(set(eb[k])-set(ea.get(k,[])))} −{sorted(set(ea.get(k,[]))-set(eb[k]))}')
# eager
print('\n## STOP arm 1 — eager?'); print(', '.join(f'{t}={J(t,"stop-eager.json")["verdict"][:12]} (closure {J(t,"stop-eager.json")["sourceArm"]["closureSize"]})' for t in present))
# (c) presence
print('\n## (c) OSR per-parent presence — counts per tip, and shapes crossing MIN_ROWS between tips')
print('| tip | parents | shapes | shapes ≥ MIN_ROWS | shapes < MIN_ROWS | simulationFlagsLit | shapeCount(meta) |'); print('|---|---|---|---|---|---|---|')
for t in present:
    c=J(t,'c-presence-dump.json'); print(f'| {t} | {c["counts"]["parents"]} | {c["counts"]["shapes"]} | {c["counts"]["shapesAtOrAboveMinRows"]} | {c["counts"]["shapesBelowMinRows"]} | {c["corpusMeta"].get("simulationFlagsLit")} | {c["corpusMeta"].get("shapeCount")} |')
for a,b in zip(present,present[1:]):
    sa={s['name']:s for s in J(a,'c-presence-dump.json')['shapes']}; sb={s['name']:s for s in J(b,'c-presence-dump.json')['shapes']}
    cross=[n for n in sb if n in sa and sa[n]['crossesMinRows']!=sb[n]['crossesMinRows']]
    new=[n for n in sb if n not in sa]; gone=[n for n in sa if n not in sb]
    keych=[n for n in sb if n in sa and set(sa[n]['keys'])!=set(sb[n]['keys'])]
    print(f'- {a}→{b}: shapes new {len(new)} gone {len(gone)} crossing-MIN_ROWS flips {len(cross)} key-set changes {len(keych)}' + (f' — flips: {cross[:12]}' if cross else '') + (f' — new: {new[:8]}' if new else '') + (f' — keyset: {keych[:8]}' if keych else ''))
