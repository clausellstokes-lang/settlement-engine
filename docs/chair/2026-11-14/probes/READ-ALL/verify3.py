#!/usr/bin/env python3
# READ-ALL-3: flags that rest on a LIMIT OF THE READERS' HEADER, verified against the record itself before any builder sees them.
#  (1) SEAT CLAIMS. The exports' packets (build_packets3.py as first built) printed NO seat on anyone: the builder read a key that a
#      membership does not have. Every flag that says "PEOPLE shows no seat" is checked here by the record's own `npcs[].memberships`
#      ({power, rank}): a claim the record bears is STRUCK (the header's artifact); a claim the record denies STANDS.
#  (2) ECHOES. A LACKS flag that says a party or an event "is not in GOVERNMENT / PAST / CRISIS" is checked against the whole record
#      of the town it was read in: where the record holds the thing named, the line echoes the record and the header did not carry
#      the field (the crisis's parties; tensions that are not historical events): SET APART, not struck.
# usage: verify3.py <merge dir (flags.all.json)> <census out-dir (corpus.ndjson.gz)> <out dir>   -> strikes.json, echoes.json
import io, re, os, sys, json, gzip, collections
MERGED, CENSUS, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
F = json.load(io.open(MERGED + '/flags.all.json', encoding='utf-8'))
rec = {}
for line in gzip.open(CENSUS + '/corpus.ndjson.gz', 'rt', encoding='utf-8'):
    o = json.loads(line); rec[o['seed']] = o['s']
ORD = {'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'fifth': 5, 'sixth': 6, 'seventh': 7, 'eighth': 8, 'ninth': 9, 'tenth': 10}
STOP = {'the', 'of', 'a', 'an', 'and', "s"}
def toks(s): return {t for t in re.findall(r"[a-z]+", str(s).lower()) if t not in STOP}
def members(s):
    out = []
    for n in (s.get('npcs') or []):
        if not isinstance(n, dict): continue
        for m in (n.get('memberships') or []):
            if isinstance(m, dict) and m.get('power'): out.append((str(n.get('name') or ''), str(m['power']), m.get('rank')))
    return out
def powmatch(text_tokens, power):
    pt = toks(power)
    return bool(pt) and (pt <= text_tokens or len(pt & text_tokens) >= max(1, len(pt) - 1))
SEATWHY = re.compile(r'bracket|\bseat|council|member|sits\b|first of|second of|third of|\brank|standing|power', re.I)
SEXWHY = re.compile(r"\(m\)|\(f\)|\bsex\b|\bmale\b|\bfemale\b|does not fit|gender|masculine|feminine", re.I)   # NOT "her"/"his": an ordinary reason says "shows her only at Midwife"
strikes = []; kept = []; echoes = []
LOST = collections.Counter()
c = collections.Counter()
for f in F:
    if f.get('artifact') or f['packet'].startswith('cal'): continue
    why = str(f.get('why', '')); text = f.get('text') or ''; town = f.get('block_town') or f.get('town')
    s = rec.get(town)
    if not s or not text: continue
    # ---- (1) seat claims
    if 'PEOPLE' in why and SEATWHY.search(why) and not SEXWHY.search(why):
        M = members(s); tt = toks(text); ok = None
        named = [(n, p, r) for (n, p, r) in M if n and n in text]
        row = re.match(r'\|\s*([^|]+?)\s*\|\s*[^|]*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|', text)
        ordm = re.search(r'\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) of ([A-Z][^.,;:()|]*)', text)
        if row:                                   # the journal's quick-reference row: | name | title | power | rank |
            nm, pw, rk = row.group(1), row.group(2), int(row.group(3))
            ok = any(n == nm and powmatch(toks(pw), p) for (n, p, r) in M)   # the fourth cell is the person's own power score, not the rank (checked on 116 rows: it equals npcs[].power in every one)
        elif ordm:                                # "<ordinal> of <power>", with or without the person named
            rk = ORD[ordm.group(1).lower()]; pt = toks(ordm.group(2))
            pool = named if named else M
            ok = any(r == rk and powmatch(pt, p) for (n, p, r) in pool)
        elif re.search(r'holds the seat', text):  # the one who would come to terms: the head of the power named
            ok = any(r == 1 and powmatch(tt, p) for (n, p, r) in named) if named else None
        elif re.search(r'Member of', text):
            ok = any(powmatch(tt, p) for (n, p, r) in (named if named else M))
        elif named:                               # any other line that names a person beside a power they do sit on
            ok = any(powmatch(tt, p) for (n, p, r) in named)
        if ok:
            strikes.append({'packet': f['packet'], 'id': str(f['id']), 'rwhy': why[:80], 'why': 'the header carried no seats (the chair\'s builder); the record gives the seat the line states', 'sev': f['sev']}); c['seat: borne by the record, STRUCK'] += 1
        elif ok is False:
            kept.append({'packet': f['packet'], 'id': str(f['id']), 'sev': f['sev'], 'town': town, 'text': text[:200], 'why': why[:200]}); c['seat: DENIED by the record, stands'] += 1
        else: c['seat: form not recognised, stands'] += 1
        continue
    # ---- (2) echoes
    NOTREC = r"(?:PAST|CRISIS|GOVERNMENT|QUARRELS)[^.;]*(?:\bno\b|\bnot\b|never|none|lacks?|doesn't|don't|does not|do not|without|only)|(?:\bno\b|\bnot\b|never|none|absent|unrecorded|isn't|is not|nor)[^.;]*(?:PAST|CRISIS|GOVERNMENT|QUARRELS)"
    if f['kind'] in ('LACKS', 'STATE') and re.search(NOTREC, why):
        HEAD = {'GOVERNMENT', 'PAST', 'CRISIS', 'QUARRELS', 'PEOPLE', 'HOUSES', 'LAND', 'TRADE', 'FOOD', 'DEFENCE', 'STATE', 'FOUNDING', 'The', 'A', 'An', 'In', 'No', 'Not', 'It', 'This', 'But', 'And', 'Yet'}
        terms = set(re.findall(r"['\"“‘]([A-Z][^'\"”’]{2,40})['\"”’]", why))
        terms |= set(re.findall(r"\b([A-Z][a-z]+(?:[ -][A-Z][a-z]+)+)\b", why))            # Market Crash, Great Flood, Wild Magic
        terms |= set(re.findall(r"\b([A-Z][a-z]{3,} [a-z]{4,})\b", why))                    # Popular candidate, Complicit beneficiaries
        terms |= {w for w in re.findall(r"\b([A-Z][a-z]{4,})\b", why)}                      # Vigilantes, Reformers
        terms = {t for t in terms if t in text and t.split()[0] not in HEAD and t != (s.get('name') or '')}
        # the longest forms only (a word inside a longer term that is also tested says nothing more)
        terms = {t for t in terms if not any(t != u and t in u for u in terms)}
        people = {str(n.get('name')) for n in (s.get('npcs') or []) if isinstance(n, dict)}
        terms = {t for t in terms if not any(t in nm for nm in people)}
        if not terms: c['echo: no term to test, stands'] += 1; continue
        blob = json.dumps(s, ensure_ascii=False).lower()
        # a label the exports print in title case may be a key of the record (great_flood, wildMagic)
        def held(t): l = t.lower(); return l in blob or l.replace(' ', '_') in blob or l.replace(' ', '') in blob or l.replace('-', '_') in blob
        found = sorted(t for t in terms if held(t)); lost = sorted(t for t in terms if not held(t))
        if found and not lost:
            echoes.append({'packet': f['packet'], 'id': str(f['id']), 'rwhy': why[:80], 'sev': f['sev'], 'kind': f['kind'], 'town': town, 'in_the_record': found, 'text': text[:200], 'why': why[:200]}); c['echo: the record holds what the line names, SET APART'] += 1
        else:
            c['echo: not in the record, stands'] += 1
            for t in lost: LOST[t] += 1
json.dump(strikes, io.open(OUT + '/strikes.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
json.dump(echoes, io.open(OUT + '/echoes.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
json.dump(kept, io.open(OUT + '/seat-denied.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
for k, v in sorted(c.items()): print('  %-58s %d' % (k, v))
print('SEAT CLAIMS THE RECORD DENIES (first 8):')
for k in kept[:8]: print('   %s %s %s %s | %s || %s' % (k['packet'], k['id'], k['sev'], k['town'], k['text'][:120], k['why'][:120]))
print('ECHOES (most common terms):', collections.Counter(t for e in echoes for t in e['in_the_record']).most_common(14))
print('NAMED ON THE PAGE AND NOWHERE IN THE RECORD (most common):', LOST.most_common(24))
