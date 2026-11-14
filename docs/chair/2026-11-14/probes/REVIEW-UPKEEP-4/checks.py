# usage: python3 -I checks.py <outdir> <scan.ndjson> <facts.ndjson> <out.ndjson>
# Each stage line where it prints, against the town's own record and page: rows {id, seed, v: FALSE?|TRUE, why}
import sys, os, gzip, json, re, collections
D, SC, FA, OUT = sys.argv[1:5]
facts = {}
for l in open(FA):
    r = json.loads(l); facts[r['seed']] = r
prints = collections.defaultdict(lambda: collections.defaultdict(list))
for l in open(SC):
    r = json.loads(l)
    if 'id' in r: prints[r['seed']][r['id']].append((r['sec'], r['line']))
def band(x):
    x = x or 0
    return 'STRONG' if x >= 65 else 'ADEQUATE' if x >= 40 else 'WEAK' if x >= 20 else 'CRITICAL'
def low(xs): return [str(x).lower() for x in (xs or [])]
SACRED = re.compile(r'church|temple|shrine|chapel|cathedral|monaster|friary|abbey|priest|faith|worship|sanctu|oracle|druid|grove|mosque|wayside', re.I)
ARCANE = re.compile(r'wizard|mage|arcane|teleport|scroll|enchant|sorcer|magic|alchemist', re.I)
out = open(OUT, 'w')
def emit(i, seed, v, why, line=''): out.write(json.dumps({'id': i, 'seed': seed, 'v': v, 'why': why, 'line': line[:300]}) + '\n')
def threat_rows(txt):
    pdf = txt.split('== pdf ==', 1)[-1].split('== foundry ==', 1)[0].split('\n')
    rows = {}
    for k, ln in enumerate(pdf):
        if ln in ('Beasts & Monsters', 'Invasion & War', 'Internal Security', 'Economic Survival', 'Disasters & Famine') and k + 2 < len(pdf):
            rows.setdefault(ln, (pdf[k+1], pdf[k+2]))
    return rows
for seed, P in prints.items():
    f = facts.get(seed)
    if not f: continue
    b = f['buckets']; R = low(f['roster']); st = f['stress']; siege = 'under_siege' in st
    has = lambda rx: any(re.search(rx, n) for n in R)
    forces = {k: bool(b.get(k)) for k in ['walls', 'garrison', 'militia', 'watch', 'mercenary', 'charter', 'magicDef']}
    txt = gzip.open(os.path.join(D, seed + '.txt.gz'), 'rt').read()
    tr = threat_rows(txt)
    # threat rows: the band the row prints is the score's band, and the sentence's words hold
    for lab, key in [('Beasts & Monsters', 'monster'), ('Invasion & War', 'military'), ('Economic Survival', 'economic')]:
        if lab in tr and tr[lab][0].upper() != band(f['scores'].get(key)):
            emit('TR-band', seed, 'FALSE?', f'{lab} prints {tr[lab][0]} but {key}={f["scores"].get(key)}', tr[lab][1])
    for sec, line in P.get('A2a', []):
        others = [k for k in ['garrison', 'watch', 'mercenary'] if forces[k]]
        emit('A2a', seed, 'FALSE?' if others or not forces['militia'] else 'TRUE', f'only walls+militia; also {others}; militia={b.get("militia")}', line)
    for sec, line in P.get('A2i', []):
        emit('A2i', seed, 'FALSE?' if forces['charter'] else 'TRUE', f'nobody organised; charter={b.get("charter")} walls={bool(b.get("walls"))}', line)
    for sec, line in P.get('A2e', []):
        any_ = [k for k, v in forces.items() if v and k != 'magicDef']
        emit('A2e', seed, 'FALSE?' if any_ else 'TRUE', f'nothing organised; holds {any_}', line)
    for i in ['A2b', 'A2c', 'A2d', 'A2f', 'A2l', 'A3a', 'A3b', 'A3c', 'A3d', 'A3e', 'A3f', 'A3g', 'A2g', 'A2h', 'A2j', 'A2k']:
        for sec, line in P.get(i, []):
            fs = {k for k, v in forces.items() if v}
            bad = []
            if i in ('A2c', 'A3c') and not ({'walls', 'watch'} <= fs): bad.append('no walls+watch')
            if i in ('A3b', 'A3g', 'A2g') and (fs & {'garrison', 'militia', 'watch', 'mercenary'} or 'walls' not in fs): bad.append('force stands or no walls')
            if i in ('A3e', 'A3f') and (fs & {'walls', 'garrison'}): bad.append('walls or garrison stand')
            if i == 'A3e' and not (fs & {'militia', 'watch', 'mercenary'}): bad.append('enough to turn raiders: no force')
            if i == 'A2b' and ('walls' in fs or not fs & {'garrison', 'militia'}): bad.append('walls or no force')
            if i in ('A2j',) and 'walls' in fs: bad.append('walls')
            if i == 'A3a' and not {'walls', 'militia'} <= fs: bad.append('no walls+militia')
            emit(i, seed, 'FALSE?' if bad else 'TRUE', f'{sorted(fs)} {bad}', line)
    for i in ['A1a', 'A1b']:
        for sec, line in P.get(i, []):
            m = re.search(r'laid by before (.+?)[:;]', line); named = m.group(1) if m else ''
            two = re.search(r"before the ([^;\n]+); [A-Za-z ]+ (?:while (?:it lasts|they last)|since)", txt); two = two and ("the " + two.group(1)) == named
            emit(i, seed, 'TRUE' if two else 'FALSE?', f'named={named} stress={st} two-label-on-page={bool(two)} prosperity={f["prosperity"]}/{f["standing"]}', line)
    # safety
    for sec, line in P.get('B1b', [])[:1]:
        g = f['safety'].get('guardEffectivenessDesc') or ''
        emit('B1b', seed, 'FALSE?' if forces['mercenary'] or forces['charter'] else 'TRUE', f'merc={b.get("mercenary")} charter={b.get("charter")} guard={g[:120]}', line)
    for sec, line in P.get('B1a', [])[:1]:
        m = re.search(r'(The garrison|The watch|The militia) is present', line)
        k = {'The garrison': 'garrison', 'The watch': 'watch', 'The militia': 'militia'}[m.group(1)]
        emit('B1a', seed, 'TRUE' if forces[k] else 'FALSE?', f'{k}={b.get(k)}', line)
    for sec, line in P.get('B11', [])[:1]:
        n = sum(2 if 'multiple criminal' in x else 1 if 'street gang' in x else 0 for x in R)
        emit('B11', seed, 'TRUE' if has(r'street gang') and n < 2 or (has('street gang') and f['tier'] in ('thorp', 'hamlet', 'village')) else 'FALSE?', f'gangs={n} roster gang={[x for x in R if "gang" in x or "criminal" in x]} tier={f["tier"]}', line)
    for sec, line in P.get('B9', [])[:1]:
        emit('B9', seed, 'TRUE' if forces['garrison'] or forces['watch'] else 'FALSE?', f'g={b.get("garrison")} w={b.get("watch")}', line)
    for sec, line in P.get('B8a', [])[:1]:
        emit('B8a', seed, 'FALSE?' if forces['watch'] or has('courthouse') else 'TRUE', f'watch={b.get("watch")} court={has("courthouse")}', line)
    for i in ['B18a', 'B18b', 'B18c']:
        for sec, line in P.get(i, [])[:1]:
            emit(i, seed, 'INFO', f'mil={f["scores"].get("military")} {band(f["scores"].get("military"))} pros={f["prosperity"]} forces={[k for k,v in forces.items() if v]}', line)
    for sec, line in P.get('B3', [])[:1]:
        emit('B3', seed, 'INFO', f'tier={f["tier"]} stress={st} forces={[k for k,v in forces.items() if v]}', line)
    # income
    for i, rx in [('C4', r'smith|forge|smelt|foundr|armou?r|weapon|metal'), ('C7', r'weav|fuller'), ('C5', r'weav|fuller'), ('C8', r'fisher|fishing'), ('C9', r'fish'), ('C1', r'alchemist'), ('C16a', r'alchemist'), ('C16b', r'alchemist'), ('C16e', r'weav'), ('C16h', r'quarr'), ('C16m', r'smith'), ('C14a', r'fisher|fishing'), ('C14b', r'woodcutter'), ('C14c', r'hunter'), ('C14d', r'\bmine\b'), ('C14e', r'quarr'), ('C10', SACRED.pattern), ('C16n', SACRED.pattern), ('R115', r"mages' guild|mages' district|arcane academy|academy of magic|magical academy")]:
        for sec, line in P.get(i, [])[:1]:
            ok = has(rx.lower() if isinstance(rx, str) else rx)
            emit(i, seed, 'TRUE' if ok else 'FALSE?', f'roster match {rx}: {[x for x in R if re.search(rx, x)][:3]}', line)
    for i in ['C1', 'C14a', 'C14b', 'C14c', 'C14d', 'C14e', 'C16c', 'C16d', 'C16f', 'C16g', 'C16h', 'C16i', 'C16k', 'C16l', 'C16o', 'C13', 'RT1', 'D2', 'D4a', 'D4b', 'D4c', 'G3']:
        for sec, line in P.get(i, [])[:1]:
            if siege and i != 'C1': emit(i + '-siege', seed, 'FALSE?', f'prints under siege {st}', line)
    for i, good in [('C16c', r'\biron\b'), ('C16d', r'\bgrain\b'), ('C16f', r'\bwool\b'), ('C16i', r'stone|masonry|marble')]:
        for sec, line in P.get(i, [])[:1]:
            m = re.search(r'\nImports\n([^\n]*)\n', txt); shown = m.group(1) if m else ''
            emit(i + '-imp', seed, 'TRUE' if re.search(good, shown, re.I) else 'FALSE?', f'Economics imports shown: {shown[:200]}', line)
    for sec, line in P.get('C16g', [])[:1]:
        m = re.search(r'\nExports\n([^\n]*)\n', txt); shown = m.group(1) if m else ''
        emit('C16g-exp', seed, 'TRUE' if re.search(r'salt(?:ed)? fish', shown, re.I) else 'FALSE?', f'exports shown: {shown[:200]}', line)
    for sec, line in P.get('C13', [])[:1]:
        m = re.search(r'\nExports\n([^\n]*)\n', txt); shown = m.group(1) if m else ''
        emit('C13-exp', seed, 'TRUE' if re.search(r'\bcoal\b', shown, re.I) else 'FALSE?', f'exports shown: {shown[:200]}', line)
    # outlook
    for sec, line in P.get('D3', [])[:1]:
        m = re.search(r'only while (.+?) (keep|keeps) arriving and the routes that bring (it|them)', line)
        if m: emit('D3', seed, 'INFO', f'goods={m.group(1)!r} verb={m.group(2)} pron={m.group(3)}', line)
    for sec, line in P.get('D2', [])[:1]:
        emit('D2', seed, 'INFO', f'imports={f["imports"]} pros={f["prosperity"]} food={f["food"].get("normalImportPct")} access={f["tradeAccess"]} stress={st}', line)
    # food endurance against the stores row
    for sec, line in P.get('E1', [])[:1]:
        m = re.search(r'\nStores: ([^\n]*)', txt)
        emit('E1', seed, 'INFO', f'stores={m.group(1) if m else None} siege={siege} months={f["food"].get("storageMonths")} granary={f["food"].get("hasGranary")}', line)
    # herald
    for sec, line in P.get('F1', [])[:1]:
        emit('F1', seed, 'TRUE' if 'wartime' in st and not siege else 'FALSE?', f'stress={st}', line)
    # viability warnings
    for sec, line in P.get('G4', [])[:1]:
        emit('G4', seed, 'FALSE?' if forces['walls'] or forces['garrison'] or has('barrack') else 'TRUE', f'walls={b.get("walls")} garrison={b.get("garrison")}', line)
    for sec, line in P.get('G5', [])[:1]:
        emit('G5', seed, 'FALSE?' if has(SACRED.pattern.lower()) else 'TRUE', f'{[x for x in R if SACRED.search(x)][:3]}', line)
    for i in ['G6a', 'G6b']:
        for sec, line in P.get(i, [])[:1]:
            emit(i, seed, 'FALSE?' if has(ARCANE.pattern.lower()) else 'TRUE', f'tier={f["tier"]} {[x for x in R if ARCANE.search(x)][:4]}', line)
    for sec, line in P.get('G7', [])[:1]:
        emit('G7', seed, 'INFO', f'{[k for k,v in forces.items() if v]} {[x for x in R if re.search("gang|thie|crim|smuggl|fence", x)]}', line)
    for sec, line in P.get('G8', [])[:1]:
        emit('G8', seed, 'TRUE' if has('bank|money') else 'FALSE?', f'{[x for x in R if re.search("bank|money|exchange", x)]}', line)
    for sec, line in P.get('G3', [])[:1]:
        emit('G3', seed, 'TRUE' if f['viable'] and not siege else 'FALSE?', f'viable={f["viable"]} stress={st}', line)
    # readiness label
    held = any(forces[k] for k in ['walls', 'garrison', 'militia', 'watch', 'mercenary'])
    if P.get('I1'):
        emit('I1', seed, 'FALSE?' if held else 'TRUE', f'held={held} label={f["readiness"].get("label")} score={f["readiness"].get("score")} surfaces={sorted({s for s,_ in P["I1"]})}', P['I1'][0][1])
    for sec, line in P.get('H3', [])[:1]:
        emit('H3', seed, 'FALSE?' if forces['walls'] else 'TRUE', f'walls={b.get("walls")}', line)
    if P.get('R216a'):
        emit('R216', seed, 'FALSE?' if P.get('R216b') else 'TRUE', f'food magicPct={f["food"].get("magicPct")} reliance none on page={bool(P.get("R216b"))}', P['R216a'][0][1])
    for sec, line in P.get('IS1', [])[:1]:
        emit('IS1', seed, 'TRUE' if has('courthouse|court') else 'FALSE?', f'court houses={[x for x in R if "court" in x]}', line)
    for sec, line in P.get('TG1', [])[:1]:
        emit('TG1', seed, 'TRUE' if has('court') else 'FALSE?', f'court houses={[x for x in R if "court" in x]}', line)
