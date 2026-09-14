#!/usr/bin/env python3
"""measure-block.py — THE BLOCK-GRAIN MEASUREMENT (ADDENDUM 18 ruling 1: reported with every round, never a refusal).
usage: measure-block.py <dock> <annex-path> '<block heading prefix>' [budget=1900] [base-rev=f2da5a3ee] [--json] [--json-only]
Prints, for the block: the SHIPPED rows at base-rev vs the rows in the WORKING TREE of the dock, at an equal token budget —
distinct words, content types, mean words per unit, the comma-and join rate, the {settlement} rate, and the per-pool content ratio
(distinct content words / content tokens, median over pools). Derived from the retro record's measure-prose.py (the audit that caused the re-cut).

⭐ ADDENDUM 18 RULING 35 — "A NUMBER THE READER SEES". Beneath the two legacy lines this prints the
POOL-GRAIN FINGERPRINT: per pool and summarised per block, ten measures for the refuter's eye.
⛔ IT REFUSES NOTHING. No exit code moves, no gate returns, no measure is a threshold. Ruling 1 binds:
the figure is reported with every round and is never a refusal. `--json` carries the whole of it.

⭐⭐ THE CHAIR'S CUT 7 (2026-09-13) — THE FOUR MEASURES. A fifth block below the fingerprint, and it
exists for a stated reason: at batch 5 the selector seat and both writer seats were the SAME MODEL,
and neither could see the repetition. A count does not need a better reader; it needs an instrument.
  1. VERB CONCENTRATION  — the share of ATTRIBUTED rows carried by the single commonest attribution
                           verb (lemma-grouped; the surface histogram printed beside it).
  2. SENTENCES PER FACE  — the distribution, and the share of faces carrying TWO sentences.
  3. OPENER TRIGRAM      — the commonest first-three-words and its count, PER VARIANT and per pool,
                           plus the faces sharing a trigram with a sibling in their own variant.
  4. SIBLING OVERLAP     — median pairwise content-token overlap in basis points, PER VARIANT, on the
                           estate's own ruler (`composedWalker.siblingDistance`, ported).
Each is printed beside the FABLE-SELECTED BENCHMARK, live from the tree and frozen at 57a75858b, the
same way the exemplars' attribution baseline is printed today. ⛔ THESE REFUSE NOTHING EITHER.
extra flags: --benchmark (print the benchmark derivation and stop)"""
import subprocess, re, sys, statistics, os, json
STOP = set('the a an and or of to in at is are was be been it its this that with no not nor neither what for on by has have had as from'.split())
def block_lines(text, head):
    t = text.split('\n'); s = [i for i,l in enumerate(t) if l.startswith(head)]
    if not s: return []
    s = s[0]; after = [i for i,l in enumerate(t) if i > s and l.startswith('### ')]
    return t[s:(after[0] if after else len(t))]
def pools_of(lines):
    pools, cur = {}, None
    for l in lines:
        m = re.match(r'^\*\*(.+)\*\*\s*$', l.strip())
        if m: cur = m.group(1); pools.setdefault(cur, []); continue
        m = re.match(r'\s*- `\[face\]` (.+)', l) or re.match(r'\d+\. `\[\w+\]` (.+)', l)
        if m and cur is not None: pools[cur].append(re.sub(r'<!--.*?-->', '', m.group(1)).strip())
    return pools
def variants_of(lines):
    """The same walk as `pools_of`, but KEEPING THE VARIANT BOUNDARY, which the four measures of
    cut 7 need and the legacy flattening throws away. Returns pool -> [{'n', 'spine', 'faces'}].
    A face is a `- `[face]`` row under the numbered spine that precedes it; a row before any
    spine (there are none in the annex today) is dropped rather than guessed at."""
    pools, cur, vs = {}, None, None
    for l in lines:
        m = re.match(r'^\*\*(.+)\*\*\s*$', l.strip())
        if m:
            cur = m.group(1); pools.setdefault(cur, []); vs = pools[cur]; continue
        if cur is None: continue
        m = re.match(r'(\d+)\. `\[\w+\]` (.+)', l)
        if m:
            vs.append({'n': int(m.group(1)),
                       'spine': re.sub(r'<!--.*?-->', '', m.group(2)).strip(), 'faces': []})
            continue
        m = re.match(r'\s*- `\[face\]` (.+)', l)
        if m and vs:
            vs[-1]['faces'].append(re.sub(r'<!--.*?-->', '', m.group(1)).strip())
    return pools
def tok(xs): return [w.lower().strip('.,;:?!') for x in xs for w in x.split()]
def upto(xs, b):
    a, n = [], 0
    for x in xs:
        a.append(x); n += len(x.split())
        if n >= b: break
    return a
def report(label, pools, budget):
    p = [u for us in pools.values() for u in us]
    if not p: print(f'{label}: no units'); return
    q = upto(p, budget); t = tok(q); c = [w for w in t if w not in STOP]
    conj = sum(1 for x in q if re.search(r',\s+and\s', x)); sett = sum(x.count('{settlement}') for x in p)
    ratios = []
    for us in pools.values():
        ct = [w for w in tok(us) if w not in STOP]
        if ct: ratios.append(len(set(ct)) / len(ct))
    print(f"{label}: pools {len(pools)} | units {len(p)} | sample {len(q)}u/{len(t)}tok | DISTINCT {len(set(t))} | content types {len(set(c))} | mean words {statistics.mean([len(x.split()) for x in p]):.1f} | ',and' joins {100*conj/len(q):.0f}% | {{settlement}} per unit {sett/len(p):.2f} | pool content ratio median {statistics.median(ratios):.2f}")

# ════════════════════════════════════════════════════════════════════════════════════════════
# ⭐⭐ THE POOL-GRAIN FINGERPRINT (ADDENDUM 18 ruling 35). EVERYTHING BELOW REFUSES NOTHING.
# ════════════════════════════════════════════════════════════════════════════════════════════

# ── THE OPENER CLASSES ──────────────────────────────────────────────────────────────────────
# Re-implemented FAITHFULLY from the dock's kernel:
#   src/domain/display/stateProse/stateProseKernel.js  `openerClassOf` (ruling 29 (II)).
# The class NAMES are the kernel's, verbatim, and so is the ORDER of the tests — a classifier's
# order IS its semantics, and a re-implementation that reorders them is a different instrument.
OPENER_CLASSES = ['attributed', 'place', 'time', 'fronted', 'expletive', 'entry', 'subject']
# kernel: FACE_SOURCES minus ARCHIVER_SOURCE === ROLE_SLOTS
FACE_SOURCES = ['stranger', 'elders', 'hall', 'tavern', 'guild', 'register',
                'muster', 'watch', 'garrison', 'gate', 'market', 'court', 'public', 'archiver']
ARCHIVER_SOURCE = 'archiver'
ROLE_SLOTS = [s for s in FACE_SOURCES if s != ARCHIVER_SOURCE]
TIME_HEADS = ['since', 'after', 'before', 'when', 'while', 'once', 'until', 'whenever', 'each',
              'every', 'lately', 'nowadays', 'afterwards', 'meanwhile']
TIME_PHRASES = ['on the night', 'on the nights', 'at night', 'at dusk', 'at dawn', 'at nightfall',
                'in the season', 'in the years', 'in the winter', 'in the summer',
                'in living memory', 'by night', 'by day', 'through the winter',
                'through the season', 'on any night']
PLACE_HEADS = ['at', 'in', 'on', 'by', 'along', 'outside', 'inside', 'beyond', 'across', 'under',
               'over', 'behind', 'beside', 'near', 'within', 'above', 'below', 'around',
               'through', 'up', 'down', 'where', 'from']
ENTRY_HEADS = ['entered', 'recorded', 'noted', 'kept,', 'listed', 'filed']
ATTRIBUTION_NOUNS = ['account', 'accounts', 'reading', 'reckoning', 'telling', 'showing', 'own account']
ATTRIBUTION_RE = re.compile(r'^by\s+[^.?]{0,40}?\b(?:' + '|'.join(ATTRIBUTION_NOUNS) + r')\b', re.I)
DETERMINERS = ['the', 'a', 'an', 'this', 'that', 'these', 'those']
FINITE_HEADS = ['is', 'are', 'was', 'were', 'has', 'have', 'had', 'does', 'do', 'did', 'will',
                'would', 'can', 'could', 'may', 'might', 'must', 'stands', 'stand', 'keeps',
                'keep', 'says', 'say', 'holds', 'hold', 'runs', 'run', 'pays', 'pay', 'sits',
                'sit', 'goes', 'go', 'comes', 'come']

def opener_class_of(text):
    """kernel stateProseKernel.js:openerClassOf — computed on the RAW text, slots and all."""
    raw = ('' if text is None else str(text)).strip()
    if raw == '': return 'subject'
    head = raw.lower()
    words = re.split(r'\s+', head)
    slot = re.match(r'^\{([a-zA-Z_][a-zA-Z0-9_]*)\}', raw)
    if slot and slot.group(1) in ROLE_SLOTS: return 'attributed'
    if re.match(r'^according to\b', head) or ATTRIBUTION_RE.match(head): return 'attributed'
    if re.match(r'^(it is|it was|there is|there are|there was|there were)\b', head): return 'expletive'
    if words[0] in ENTRY_HEADS: return 'entry'
    if words[0] in TIME_HEADS: return 'time'
    if any(head.startswith(p) for p in TIME_PHRASES): return 'time'
    if words[0] in PLACE_HEADS: return 'place'
    if words[0] in DETERMINERS:
        comma = next((i for i, w in enumerate(words) if w.endswith(',')), -1)
        if 0 < comma < 8:
            before = [re.sub(r'[^a-z]', '', w) for w in words[:comma + 1]]
            if not any(w in FINITE_HEADS for w in before): return 'fronted'
    return 'subject'

# ── THE CLOSE CLASSES ───────────────────────────────────────────────────────────────────────
# Re-implemented FAITHFULLY from the same kernel, `closeClassOf` (ADDENDUM 18 ruling 34).
# `reassurance` is tested FIRST for the kernel's stated reason (it is the only refusable shape,
# so a sentence that is both must report as that one) — though NOTHING is refused HERE.
CLOSE_CLASSES = ['which-tail', 'summary', 'antithesis', 'reassurance', 'question', 'plain']
REASSURANCE_RE = re.compile(r'(?:all is well|nothing to fear|in good order|as it should be|nothing amiss|no cause for alarm)[.?!]?\s*$', re.I)
WHICH_TAIL_RE  = re.compile(r',\s*which\b[^.?!]*[.?!]?\s*$', re.I)
SUMMARY_RE     = re.compile(r'(?:,\s*(?:and that is|which is to say|so)\b|\.\s+(?:and that is|which is to say)\b)[^.?!]*[.?!]?\s*$', re.I)
ANTITHESIS_RE  = re.compile(r',\s*(?:and not|but not|never|not)\b[^.?!]*[.?!]?\s*$', re.I)
QUESTION_RE    = re.compile(r',\s*(?:whether|who|what|where|why|how)\b[^.?!]*\.\s*$', re.I)

def close_class_of(text):
    raw = ('' if text is None else str(text)).strip()
    if raw == '': return 'plain'
    if REASSURANCE_RE.search(raw): return 'reassurance'
    if WHICH_TAIL_RE.search(raw):  return 'which-tail'
    if SUMMARY_RE.search(raw):     return 'summary'
    if ANTITHESIS_RE.search(raw):  return 'antithesis'
    if QUESTION_RE.search(raw):    return 'question'
    return 'plain'

# ── THE RATIONED PET WORDS ──────────────────────────────────────────────────────────────────
# SOURCE: the dock's own `scripts/check-pair.mjs` `RATION` table (the `RATIONED WORD ADDED` arm),
# which is the machine-readable form of the research's ration list. The research names the RATE
# but publishes no list: `prose-research/PROBE_ALL.md:343` ("rationed pet words / variant",
# corpus median 0.106 per variant) and `RULES-V2-PART-B.md` (R1 0.536 → ≤ 0.200, R12 0.176 → ≤ 0.10).
# ⚠ THE UNITS DIFFER FROM THE RESEARCH'S. The research counts per VARIANT; ruling 35 asks for
# occurrences PER HUNDRED WORDS, which is what is printed here. The two are not comparable without
# multiplying by the words-per-variant, and no conversion is attempted.
RATION = [
    re.compile(r'\brather than\b', re.I), re.compile(r'\bwhich (is|means)\b', re.I),
    re.compile(r'\b(nobody|no one|nothing)\b', re.I), re.compile(r'\bits own\b', re.I),
    re.compile(r'\bwhatever\b', re.I), re.compile(r'\benough (to|that)\b', re.I),
    re.compile(r'\b(kind|sort) of\b', re.I), re.compile(r'\bquiet(ly)?\b', re.I),
    re.compile(r'\b(still|yet|already)\b', re.I),
]

# ── THE PRESENCE LEXICON ────────────────────────────────────────────────────────────────────
# REUSED VERBATIM from the dock's published lexicon — NOT re-invented here:
#   src/domain/prose/presenceMeasure.js  `SENSORY_NOUNS` (Part B §13.2; 166 distinct nouns in
#   five sense buckets, a partition asserted by `bucketAudit()`).
# "The lexicon is the measure's whole honesty… the way to argue with a figure is to argue with
# the list." A noun not on the list is not counted.
SENSORY_NOUNS = {
    'sight': ['wall', 'walls', 'gate', 'gates', 'roof', 'roofs', 'thatch', 'shutter', 'shutters',
              'banner', 'banners', 'smoke', 'lamp', 'lamps', 'torch', 'torches', 'candle', 'candles',
              'stone', 'timber', 'brick', 'slate', 'mud', 'dust', 'rust', 'paint', 'whitewash',
              'ditch', 'palisade', 'tower', 'towers', 'quay', 'wharf', 'bridge', 'mill', 'kiln',
              'forge', 'cart', 'carts', 'wagon', 'boat', 'boats', 'net', 'nets', 'rope', 'sack',
              'sacks', 'barrel', 'barrels', 'cask', 'casks', 'crate', 'chest', 'ledger', 'roll',
              'rolls', 'seal', 'tally', 'coin', 'coins', 'scale', 'scales', 'field', 'fields',
              'furrow', 'hedge', 'orchard', 'wood', 'woods', 'river', 'ford', 'road', 'lane',
              'square', 'market', 'stall', 'stalls', 'well', 'trough', 'byre', 'barn', 'granary'],
    'hearing': ['bell', 'bells', 'horn', 'horns', 'drum', 'drums', 'hammer', 'hammering', 'creak',
                'clatter', 'shout', 'shouts', 'cry', 'cries', 'song', 'chant', 'murmur', 'silence',
                'quiet', 'noise', 'din', 'whistle', 'knock', 'tramp', 'hoofbeat', 'hoofbeats'],
    'smell': ['tar', 'pitch', 'tallow', 'dung', 'tannery', 'brine', 'rot', 'mould', 'incense',
              'malt', 'yeast', 'sweat', 'stench', 'reek', 'perfume', 'resin'],
    'touch': ['frost', 'ice', 'grit', 'splinter', 'damp', 'draught', 'heat', 'cold', 'wet',
              'wool', 'leather', 'hide', 'hides', 'linen', 'cloth', 'iron', 'nail', 'nails',
              'chain', 'chains', 'plank', 'planks', 'straw'],
    'taste': ['bread', 'ale', 'beer', 'wine', 'salt', 'grain', 'meal', 'porridge', 'cheese',
              'fish', 'meat', 'honey', 'vinegar', 'water', 'broth', 'loaf', 'loaves', 'cider', 'mead'],
}
SENSE_OF_NOUN = {}
for _sense, _nouns in SENSORY_NOUNS.items():
    for _n in _nouns: SENSE_OF_NOUN.setdefault(_n, _sense)

# ── THE ATTRIBUTION FRAME ───────────────────────────────────────────────────────────────────
# Ruling 35's third limb: a sentence is ATTRIBUTED if it carries a role slot, a report verb on a
# noun-phrase subject, or one of the two named idioms. APPROXIMATE by construction (there is no
# parser here); the false negative is the safe one.
ROLE_SLOT_RE  = re.compile(r'\{(?:' + '|'.join(ROLE_SLOTS) + r')\}')
REPORT_VERBS  = r'(?:says|say|holds|hold|reports|report|claims|claim)'
# a determiner- or possessive-headed noun phrase of one to three words, then a report verb
SUBJECT_VERB_RE = re.compile(r"\b(?:the|a|an|its|their|his|her|our|every|each|most)\s+(?:[a-z][a-z'’-]*\s+){0,2}" + REPORT_VERBS + r'\b', re.I)
POSS_ACCOUNT_RE = re.compile(r"\b[a-z][a-z'’-]*(?:'s|’s)\s+(?:account|accounts|reckoning|reading|telling)\b", re.I)
IDIOM_RE        = re.compile(r'\b(?:at the tavern they|it is said|according to)\b', re.I)
def is_attributed_sentence(s):
    return bool(ROLE_SLOT_RE.search(s) or SUBJECT_VERB_RE.search(s)
                or POSS_ACCOUNT_RE.search(s) or IDIOM_RE.search(s))
# ⚠ `holds` / `hold` IS THE ONE AMBIGUOUS VERB ON THE CHAIR'S LIST, AND IT OVER-FIRES BADLY.
# MEASURED over the whole annex (1,877 units): the subject+verb arm fires 79 times, and 49 of
# those are `holds`/`hold` — almost all POSSESSION ("the granary holds a working reserve"), not
# report. Only 3 take a clausal complement. So the loose figure above is printed AS THE CHAIR
# SPECIFIED IT, and this STRICT companion is printed beside it: `holds`/`hold` counts only where
# it takes a complement clause. Neither refuses anything; the refuter reads the pair.
STRICT_HOLD_RE = re.compile(r"\b(?:the|a|an|its|their|his|her|our|every|each|most)\s+(?:[a-z][a-z'’-]*\s+){0,2}(?:holds|hold)\s+(?:that\b|it\b|no view\b|no opinion\b|the matter\b)", re.I)
STRICT_SAY_RE  = re.compile(r"\b(?:the|a|an|its|their|his|her|our|every|each|most)\s+(?:[a-z][a-z'’-]*\s+){0,2}(?:says|say|reports|report|claims|claim)\b", re.I)
def is_attributed_sentence_strict(s):
    return bool(ROLE_SLOT_RE.search(s) or STRICT_SAY_RE.search(s) or STRICT_HOLD_RE.search(s)
                or POSS_ACCOUNT_RE.search(s) or IDIOM_RE.search(s))
# THE EXEMPLARS' BASELINE, printed beside the figure (the chair's, at ruling 35): the fourteen
# exemplar fingerprints carry NO attribution frame of this shape at all — 0 in 786 sentences.
ATTRIB_BASELINE_HITS, ATTRIB_BASELINE_SENTENCES = 0, 786

# ── THE OPEN SHARE (report only) ────────────────────────────────────────────────────────────
OPEN_FORMS = re.compile(r'\b(?:it may be|may be|a matter of debate|holds no view|holds no opinion|would sooner|it is to be hoped)\b', re.I)
# ── THE SELF-CITATION RATCHET (ruling 40, as a number) ──────────────────────────────────────
SELF_CITE = re.compile(r'\b(?:the survey|this office|the record has|entered as|set down here)\b', re.I)
# ── THE FORECAST (ruling 33) — " will " / " shall " standing before a verb ──────────────────
FORECAST = re.compile(r'\b(?:will|shall)\s+(?:not\s+|never\s+|no longer\s+)?[a-z]+\b', re.I)

# ── THE PERFECTION FLAG (ruling 35's seventh limb: the machine's signature) ──────────────────
# ⭐ THE BAND IS DECLARED HERE AND PRINTED WITH THE REPORT. A pool is flagged `perfect` when it
# has TWO OR MORE units and:
#   (a) ZERO DEVIATION — the within-pool words-per-sentence sd is exactly 0, every unit carries
#       the SAME opener class, and every unit carries the SAME close class; and
#   (b) every measured scalar sits inside the BLOCK MEDIAN ± the band for its kind.
# This is a SIGNATURE, not a fault: a human pool wobbles, a generated one does not. It refuses
# nothing and no round turns on it.
BAND_WPS   = 0.75   # words per sentence (mean)
BAND_RATE  = 0.05   # shares: same-opener, attributions/sentence, open share
BAND_PER100 = 0.5   # per-hundred-word rates: pet words, sensory nouns

# ── NORMALISATION ───────────────────────────────────────────────────────────────────────────
TAG_HEAD_RE = re.compile(r'^(?:`\[[^`\]]*\]`\s*)+')
VERB_SLOT_RE = re.compile(r'\{v:([a-z]+)\}')
ROLE_ANY_SLOT_RE = re.compile(r'\{[a-zA-Z_][a-zA-Z0-9_]*\}')
def face_text(unit):
    """Strip the annex's leading source tags — ``[face]`` rows arrive as '`[hall · pair 1]` {hall} …'
    and `pools_of` keeps the tag. The LEGACY measures above are left reading the tag (backward
    compatibility); every measure below reads the face itself."""
    return TAG_HEAD_RE.sub('', str(unit)).strip()
def rendered(text):
    """The face as the reader meets it: `{v:keep}` → 'keep' (the kernel's ROLE_OR_VERB_RE does
    exactly this), every other slot dropped. Used for the per-hundred-word denominators."""
    return ROLE_ANY_SLOT_RE.sub(' ', VERB_SLOT_RE.sub(r'\1', text))
def bare_words(text):
    return [w for w in re.split(r"[^a-z']+", rendered(text).lower()) if w]
# check-pair.mjs `sentencesIn`'s splitter (A11's spread and U2's ceiling read ONE counter),
# widened by `{` in the lookahead so a sentence that OPENS ON A SLOT still splits. The segments
# returned are the RAW text — slots intact — because the attribution measure below must see them.
SENT_SPLIT_RE = re.compile(r'(?<=[.?!])\s+(?=[A-Z"\'({])')
def sentences_of(text):
    return [s for s in SENT_SPLIT_RE.split(str(text).strip()) if s.strip()]
def first_word(text):
    """The opener AS THE READER MEETS IT, one word: `{elders}` → 'elders', `{v:keep}` → 'keep'.
    ⚠ THIS DIFFERS FROM check-pair.mjs's A11 `openerOf` DELIBERATELY — that one normalises every
    slot to `{}` and reads TWO words, which makes every role-slot face share one opener. Ruling 35
    asks for the FIRST WORD, and two different roles are two different words on the page."""
    norm = ROLE_ANY_SLOT_RE.sub(lambda m: m.group(0)[1:-1], VERB_SLOT_RE.sub(r'\1', str(text))).strip()
    parts = [p for p in re.split(r'\s+', norm) if p]
    if not parts: return ''
    return re.sub(r'^[^a-z]+|[^a-z]+$', '', parts[0].lower())

def hist_str(h):
    if not h: return '—'
    return ' · '.join(f'{k} {v}' for k, v in sorted(h.items(), key=lambda kv: (-kv[1], kv[0])))

def pool_fingerprint(name, units):
    faces = [face_text(u) for u in units]
    sents = [s for f in faces for s in sentences_of(f)]
    lens = [len([w for w in s.split() if w]) for s in sents]
    words = sum(len(bare_words(f)) for f in faces)
    openers = [first_word(f) for f in faces]
    same = sum(1 for i in range(1, len(openers)) if openers[i] and openers[i] == openers[i - 1])
    ohist, chist = {}, {}
    for f in faces:
        ohist[opener_class_of(f)] = ohist.get(opener_class_of(f), 0) + 1
        chist[close_class_of(f)] = chist.get(close_class_of(f), 0) + 1
    pet = sum(len(rx.findall(rendered(f))) for rx in RATION for f in faces)
    sensory = sum(1 for f in faces for w in bare_words(f) if w in SENSE_OF_NOUN)
    attrib = sum(1 for s in sents if is_attributed_sentence(s))
    attrib_strict = sum(1 for s in sents if is_attributed_sentence_strict(s))
    return {
        'pool': name, 'units': len(faces), 'sentences': len(sents), 'words': words,
        'wordsPerSentenceMean': round(statistics.mean(lens), 2) if lens else 0.0,
        'wordsPerSentenceSd': round(statistics.pstdev(lens), 2) if len(lens) > 1 else 0.0,
        'sameOpenerRate': round(same / (len(openers) - 1), 3) if len(openers) > 1 else 0.0,
        'sameOpenerHits': same,
        'openerClasses': ohist, 'closeClasses': chist,
        'petWordsPerHundredWords': round(100.0 * pet / words, 2) if words else 0.0,
        'petWordHits': pet,
        'sensoryNounsPerHundredWords': round(100.0 * sensory / words, 2) if words else 0.0,
        'sensoryNounHits': sensory,
        'attributionsPerSentence': round(attrib / len(sents), 3) if sents else 0.0,
        'attributionSentences': attrib,
        'attributionsPerSentenceStrict': round(attrib_strict / len(sents), 3) if sents else 0.0,
        'attributionSentencesStrict': attrib_strict,
        'openShare': round(sum(1 for f in faces if OPEN_FORMS.search(rendered(f))) / len(faces), 3) if faces else 0.0,
        'selfCitations': sum(1 for f in faces if SELF_CITE.search(rendered(f))),
        'forecasts': sum(1 for f in faces if FORECAST.search(rendered(f))),
    }

SCALARS = [('wordsPerSentenceMean', BAND_WPS), ('sameOpenerRate', BAND_RATE),
           ('petWordsPerHundredWords', BAND_PER100), ('sensoryNounsPerHundredWords', BAND_PER100),
           ('attributionsPerSentence', BAND_RATE), ('openShare', BAND_RATE)]

def fingerprint(label, pools):
    rows = [pool_fingerprint(k, v) for k, v in pools.items() if v]
    empty = [k for k, v in pools.items() if not v]
    if not rows: return {'label': label, 'pools': [], 'summary': None}
    med = {k: statistics.median([r[k] for r in rows]) for k, _ in SCALARS}
    for r in rows:
        inside = all(abs(r[k] - med[k]) <= band for k, band in SCALARS)
        zero = (r['units'] >= 2 and r['wordsPerSentenceSd'] == 0.0
                and len(r['openerClasses']) == 1 and len(r['closeClasses']) == 1)
        r['perfect'] = bool(inside and zero)
    oall, call = {}, {}
    for r in rows:
        for k, v in r['openerClasses'].items(): oall[k] = oall.get(k, 0) + v
        for k, v in r['closeClasses'].items(): call[k] = call.get(k, 0) + v
    summary = {
        'pools': len(rows), 'emptyPools': len(empty), 'emptyPoolNames': empty,
        'units': sum(r['units'] for r in rows),
        'sentences': sum(r['sentences'] for r in rows), 'words': sum(r['words'] for r in rows),
        'median': {k: round(med[k], 3) for k, _ in SCALARS},
        'attributionsPerSentenceStrictMedian': round(statistics.median([r['attributionsPerSentenceStrict'] for r in rows]), 3),
        'wordsPerSentenceSdMedian': round(statistics.median([r['wordsPerSentenceSd'] for r in rows]), 2),
        'openerClasses': oall, 'closeClasses': call,
        'selfCitations': sum(r['selfCitations'] for r in rows),
        'forecasts': sum(r['forecasts'] for r in rows),
        'perfectPools': sum(1 for r in rows if r['perfect']),
        'perfectPoolNames': [r['pool'] for r in rows if r['perfect']],
        'attributionBaseline': {'hits': ATTRIB_BASELINE_HITS, 'sentences': ATTRIB_BASELINE_SENTENCES,
                                'perSentence': round(ATTRIB_BASELINE_HITS / ATTRIB_BASELINE_SENTENCES, 3)},
        'bands': {'wordsPerSentenceMean': BAND_WPS, 'rates': BAND_RATE, 'perHundredWords': BAND_PER100},
    }
    return {'label': label, 'pools': rows, 'summary': summary}

def print_fingerprint(fp):
    if not fp['pools']:
        print(f"{fp['label']}: no units"); return
    s = fp['summary']
    print(f"\n── POOL-GRAIN FINGERPRINT · {fp['label']} (ADDENDUM 18 ruling 35; REFUSES NOTHING) ──")
    for i, r in enumerate(fp['pools'], 1):
        print(f"  [P{i:02d}] {r['pool']}")
        print(f"        units {r['units']} · sentences {r['sentences']} · words {r['words']} | "
              f"wps {r['wordsPerSentenceMean']} ±{r['wordsPerSentenceSd']} | "
              f"same-opener {r['sameOpenerRate']} ({r['sameOpenerHits']}) | "
              f"pet {r['petWordsPerHundredWords']}/100w ({r['petWordHits']}) | "
              f"sensory {r['sensoryNounsPerHundredWords']}/100w ({r['sensoryNounHits']}) | "
              f"attrib/sent {r['attributionsPerSentence']} ({r['attributionSentences']}, strict {r['attributionsPerSentenceStrict']}) | "
              f"open-share {r['openShare']} | self-cite {r['selfCitations']} | "
              f"forecast {r['forecasts']} | {'PERFECT' if r['perfect'] else 'varied'}")
        print(f"        openers {hist_str(r['openerClasses'])}   closes {hist_str(r['closeClasses'])}")
    m = s['median']
    print(f"  BLOCK SUMMARY {fp['label']}: pools {s['pools']}"
          + (f" (+{s['emptyPools']} with no units)" if s['emptyPools'] else '')
          + f" · units {s['units']} · sentences {s['sentences']} · words {s['words']}")
    print(f"    medians over pools: wps {m['wordsPerSentenceMean']} (sd median {s['wordsPerSentenceSdMedian']}) | "
          f"same-opener {m['sameOpenerRate']} | pet {m['petWordsPerHundredWords']}/100w | "
          f"sensory {m['sensoryNounsPerHundredWords']}/100w | attrib/sent {m['attributionsPerSentence']} "
          f"(strict {s['attributionsPerSentenceStrictMedian']}) | "
          f"open-share {m['openShare']}")
    print(f"    openers: {hist_str(s['openerClasses'])}")
    print(f"    closes:  {hist_str(s['closeClasses'])}")
    b = s['attributionBaseline']
    print(f"    self-citations {s['selfCitations']} (ruling 40) | forecasts {s['forecasts']} (ruling 33) | "
          f"attribution baseline (exemplars) {b['hits']} per {b['sentences']} = {b['perSentence']}/sentence")
    print(f"    PERFECT pools {s['perfectPools']}/{s['pools']}"
          + (f" — {' | '.join(s['perfectPoolNames'])}" if s['perfectPoolNames'] else '')
          + f"  [band: wps ±{BAND_WPS}, shares ±{BAND_RATE}, per-100w ±{BAND_PER100}; sd 0 and one opener + one close class, units ≥ 2]")

if __name__ == '__main__':
    argv = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = {a for a in sys.argv[1:] if a.startswith('--')}
    dock, annex, head = argv[0:3]
    budget = int(argv[3]) if len(argv) > 3 else 1900
    base = argv[4] if len(argv) > 4 else 'f2da5a3ee'
    shipped = subprocess.run(['git','-C',dock,'show',base+':'+annex],capture_output=True,text=True).stdout
    tree = open(os.path.join(dock, annex)).read()
    sp = pools_of(block_lines(shipped, head)); tp = pools_of(block_lines(tree, head))
    quiet = '--json-only' in flags
    if not quiet:
        report('SHIPPED  ' + base, sp, budget)
        report('TREE     ' + dock.rstrip('/').split('/')[-1], tp, budget)
    fps = fingerprint('SHIPPED ' + base, sp)
    fpt = fingerprint('TREE ' + dock.rstrip('/').split('/')[-1], tp)
    if not quiet:
        print_fingerprint(fps); print_fingerprint(fpt)
    if '--json' in flags or quiet:
        print(json.dumps({'block': head, 'dock': dock, 'annex': annex, 'baseRev': base,
                          'budget': budget, 'shipped': fps, 'tree': fpt}, indent=1))
