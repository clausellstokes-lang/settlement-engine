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

# ════════════════════════════════════════════════════════════════════════════════════════════
# ⭐⭐ THE CHAIR'S CUT 7 — THE FOUR MEASURES. EVERYTHING IN THIS SECTION REFUSES NOTHING.
# ════════════════════════════════════════════════════════════════════════════════════════════
# WHY THEY EXIST, in the chair's own words: "a selector and its writers shared a model and neither
# could see the repetition." Each of the four is a COUNT the refuter had to make by hand.

# ── (1) VERB CONCENTRATION ──────────────────────────────────────────────────────────────────
# The table is LEMMA-LABELLED, and the labels are the refuter's own from the two DULL packets
# (`says says account holds says … has-it … takes-it`), so a chair can read the histogram against
# the hand tallies in `rerefute.md` without a translation step.
# ⚠ ONE DELIBERATE DIVERGENCE FROM THE HAND TALLY, AND IT IS THE INSTRUMENT'S WHOLE POINT.
# The `hold` limb requires a COMPLEMENT (`holds that` / `holds it that`), for the reason the
# attribution measure above already records: bare `holds` is possession far more often than
# report. On the `settled, defenses beyond the need` pool the hand tally reads the v1 gate face
# ("Whoever HOLDS the way through SAYS the bar goes down…") as `holds`; this instrument reads it
# as `says`, which is the verb actually doing the attributing. The hand tally's v1 line therefore
# shows one `holds` this table does not, and the difference is named here rather than reconciled
# away. NEITHER READING IS REFUSED; the histogram is printed in full so both are visible.
ATTRIB_VERB_TABLE = [
    # The noun set is ATTRIBUTION_NOUNS above — the kernel's own list — and not a shorter one of
    # this table's invention, so `by the elders' reckoning` and `by a traveller's account` count
    # as the one frame they are.
    ('account',  re.compile(r"\bby\s+(?:the\s+|a\s+|an\s+)?[a-z'’\- ]{0,30}?(?:'s|’s)?\s*(?:own\s+)?(?:" + '|'.join(ATTRIBUTION_NOUNS) + r")\b", re.I)),
    ('account',  re.compile(r"\b(?:the|a|an|its|their|his|her)\s+[a-z'’\-]+(?:'s|’s)\s+(?:own\s+)?(?:account|accounts|reckoning|reading|telling)\b", re.I)),
    ('has-it',   re.compile(r'\b(?:has|have|had)\s+it\s+that\b', re.I)),
    ('takes-it', re.compile(r'\b(?:takes|take|took)\s+it\s+that\b', re.I)),
    ('puts-it',  re.compile(r'\b(?:puts|put)\s+it\s+that\b', re.I)),
    ('hold',     re.compile(r'\b(?:holds|hold|held)\s+(?:that|it\s+that)\b', re.I)),
    ('say',      re.compile(r'\b(?:says|say|said)\b', re.I)),
    ('report',   re.compile(r'\b(?:reports|report|reported)\b', re.I)),
    ('claim',    re.compile(r'\b(?:claims|claim|claimed)\b', re.I)),
    ('reckon',   re.compile(r'\b(?:reckons|reckon|is\s+reckoned|are\s+reckoned|reckoned)\b', re.I)),
    ('tell',     re.compile(r'\b(?:tells|tell|told)\b', re.I)),
    ('ask',      re.compile(r'\b(?:is|are|was|were)\s+asked\b', re.I)),
    # ⚠ `is heard` TAKES A SAYING COMPLEMENT OR IT IS NOT COUNTED, on the `holds` precedent above.
    # MEASURED: the bare passive fires once in DS-DEF-2 and the hit is "when something IS HEARD" —
    # a noise in the country, not a source reporting. The refuter's own alternative ("a source is
    # heard") is still counted; a sound is not.
    ('hear',     re.compile(r'\b(?:is|are|was|were)\s+heard\s+to\s+(?:say|hold|put|tell)\b', re.I)),
    ('add',      re.compile(r'\b(?:adds|add)\s+that\b', re.I)),
    ('allow',    re.compile(r'\b(?:allows|allow)\s+that\b', re.I)),
    ('agree',    re.compile(r'\b(?:agrees|agree)\s+that\b', re.I)),
    ('note',     re.compile(r'\b(?:notes|note)\s+that\b', re.I)),
    ('refuse',   re.compile(r'\b(?:will|would)\s+not\s+say\b', re.I)),
]
# The surface form actually on the page, for the histogram printed beside the lemma figure.
SURFACE_RE = re.compile(r"\b(?:says|say|said|holds|hold|held|reports|report|claims|claim|"
                        r"reckons|reckon|reckoned|tells|tell|told|accounts?|has|have|had|"
                        r"takes|take|took|puts|put|asked|heard)\b", re.I)
def attrib_verbs_of(row):
    """The set of attribution-verb LEMMAS a row carries. A row carrying two counts in both, and
    counts ONCE in the attributed-row denominator."""
    txt = rendered(face_text(row))
    return {lemma for lemma, rx in ATTRIB_VERB_TABLE if rx.search(txt)}
def verb_concentration(rows):
    hits, attributed = {}, 0
    for r in rows:
        ls = attrib_verbs_of(r)
        if not ls: continue
        attributed += 1
        for l in ls: hits[l] = hits.get(l, 0) + 1
    if not attributed:
        return {'rows': len(rows), 'attributedRows': 0, 'commonestVerb': None,
                'commonestVerbRows': 0, 'concentration': 0.0, 'verbs': {}, 'distinctVerbs': 0}
    top = max(hits.items(), key=lambda kv: (kv[1], -ord(kv[0][0])))
    return {'rows': len(rows), 'attributedRows': attributed, 'commonestVerb': top[0],
            'commonestVerbRows': top[1], 'concentration': round(top[1] / attributed, 3),
            'verbs': hits, 'distinctVerbs': len(hits)}

# ── (2) SENTENCES PER FACE ──────────────────────────────────────────────────────────────────
# The splitter is `entryWalker.sentencesOf` ported (slots neutralised to 'X' FIRST, then split),
# because that is the counter the U2 ceiling and the gate's `sameSegments` both read. It differs
# from this file's legacy `sentences_of` only in the slot handling, and no face carries a slot
# (ruling 12), so the two agree on every face in the annex today.
ENTRY_SENT_RE = re.compile(r'(?<=[.?!])\s+(?=[A-Z"\'(])')
def sentences_of_entry(text):
    t = ROLE_ANY_SLOT_RE.sub('X', str(text or ''))
    if not t.strip(): return []
    return [s for s in ENTRY_SENT_RE.split(t) if s.strip()]
def sentences_per_face(faces):
    """⭐ THE LAW'S OWN EXEMPLAR OF RESTRAINT IS TWO SENTENCES AND A FULL STOP ('The works are
    kept. Nobody is paid to stand on them.'), so the TWO-sentence share is printed by name."""
    counts = [len(sentences_of_entry(face_text(f))) for f in faces]
    hist = {}
    for c in counts: hist[c] = hist.get(c, 0) + 1
    two = sum(1 for c in counts if c == 2)
    words = [len(bare_words(face_text(f))) for f in faces]
    return {'faces': len(counts), 'hist': hist,
            'twoSentenceFaces': two,
            'twoSentenceShare': round(two / len(counts), 3) if counts else 0.0,
            'multiSentenceFaces': sum(1 for c in counts if c >= 2),
            'shortestFaceWords': min(words) if words else 0,
            'longestFaceWords': max(words) if words else 0,
            'facesUnderElevenWords': sum(1 for w in words if w <= 10)}

# ── (3) OPENER TRIGRAM REPETITION ───────────────────────────────────────────────────────────
# The chair's own mechanical rule: "no face may open on the same three words as a sibling." A
# SIBLING is a face of the SAME VARIANT — the unit that co-renders — so the repeat count is taken
# per variant and then summed, and the pool-wide commonest trigram is printed beside it.
# ⚠ RECORDED, BECAUSE IT IS THE CHAIR'S OWN DOING: ruling 25's role construction ("one of the
# elders", "one of the aldermen") gave every force-seated source the same three opening words and
# the ruling never said to vary its SYNTAX. This measure is what would have shown that.
def opener_trigram(text, n=3):
    norm = ROLE_ANY_SLOT_RE.sub(lambda m: m.group(0)[1:-1], VERB_SLOT_RE.sub(r'\1', str(text)))
    parts = [re.sub(r"^[^a-z']+|[^a-z']+$", '', p.lower()) for p in re.split(r'\s+', norm.strip())]
    parts = [p for p in parts if p]
    return ' '.join(parts[:n]) if len(parts) >= n else ' '.join(parts)
def opener_trigrams(variants):
    per_variant, repeated_faces, allhist = [], 0, {}
    for v in variants:
        tg = [opener_trigram(face_text(f)) for f in v['faces']]
        h = {}
        for t in tg: h[t] = h.get(t, 0) + 1
        for t in tg: allhist[t] = allhist.get(t, 0) + 1
        rep = sum(c for c in h.values() if c > 1)
        repeated_faces += rep
        top = max(h.items(), key=lambda kv: (kv[1], kv[0])) if h else ('', 0)
        per_variant.append({'variant': v['n'], 'faces': len(tg), 'commonest': top[0],
                            'commonestCount': top[1], 'repeatedFaces': rep})
    faces = sum(len(v['faces']) for v in variants)
    top = max(allhist.items(), key=lambda kv: (kv[1], kv[0])) if allhist else ('', 0)
    return {'faces': faces, 'perVariant': per_variant,
            'poolCommonest': top[0], 'poolCommonestCount': top[1],
            'repeatedWithinVariantFaces': repeated_faces,
            'repeatedWithinVariantShare': round(repeated_faces / faces, 3) if faces else 0.0,
            'variantsBreached': sum(1 for r in per_variant if r['repeatedFaces'] > 0)}

# ── (4) SIBLING OVERLAP ─────────────────────────────────────────────────────────────────────
# PORTED VERBATIM from the dock's own ruler — `src/domain/prose/composedWalker.js`
# `contentWords` / `siblingDistance` and `scripts/prose-wave-gate.mjs` `siblingSpreadOf` — so the
# figure here and the figure in the wave-gate packet are the SAME figure and can be compared
# across sittings. A second ruler for the same quantity would be a second answer.
ALTERNATIVE_STOP = ['that', 'this', 'with', 'from', 'have', 'been', 'being', 'than', 'then',
                    'they', 'them', 'their', 'there', 'here', 'what', 'when', 'which', 'would',
                    'could', 'should', 'about', 'into', 'over', 'rather', 'anything',
                    'something', 'nothing', 'everything', 'more', 'most', 'much', 'only',
                    'also', 'just', 'such', 'other', 'same', 'town', 'settlement', 'place',
                    'thing', 'things']
def content_words(text):
    ws = re.sub(r'[^a-z ]', ' ', re.sub(r'\{[a-z_0-9]+\}', ' ', str(text or '').lower())).split()
    ws = [w for w in ws if len(w) >= 4 and w not in ALTERNATIVE_STOP]
    return list(dict.fromkeys(ws))
def sibling_distance(a, b):
    wa, wb = content_words(a), content_words(b)
    shared = len([w for w in wa if w in wb]); union = len(set(wa) | set(wb))
    return {'sameSegments': len(sentences_of_entry(a)) == len(sentences_of_entry(b)),
            'overlapBp': 10000 if union == 0 else round(shared * 10000 / union)}
def sibling_spread(faces):
    fs = [face_text(f) for f in faces]
    if len(fs) < 2:
        return {'pairs': 0, 'medianOverlapBp': None, 'maxOverlapBp': None,
                'sameSegmentPairs': 0, 'why': f'NOT-EXECUTABLE: a distance needs two faces and this variant carries {len(fs)}'}
    rows = [sibling_distance(fs[a], fs[b]) for a in range(len(fs)) for b in range(a + 1, len(fs))]
    ov = sorted(r['overlapBp'] for r in rows); mid = len(ov) // 2
    return {'pairs': len(rows),
            'medianOverlapBp': ov[mid] if len(ov) % 2 == 1 else (ov[mid - 1] + ov[mid]) // 2,
            'maxOverlapBp': ov[-1], 'minOverlapBp': ov[0],
            'sameSegmentPairs': sum(1 for r in rows if r['sameSegments']), 'why': ''}
def sibling_overlaps(variants):
    """⛔ THE UNIT IS THE SPINE PLUS ITS FACES, not the faces alone — because that is what the
    wave gate feeds `siblingSpreadOf` (its packet reports 7 · 9 · 9 where the annex carries 6 · 8
    · 8 faces), and a measure that cannot reproduce the packet it is meant to be compared with is
    a second answer wearing the same name. VERIFIED 2026-09-13 against
    `kit/packets/laneRW-DEF2/measure-cure-v3-sitting-5.json`: all six variant medians of the two
    DULL pools reproduce EXACTLY (588 · 500 · 556 and 477 · 455 · 646).
    ⚠ THE OTHER THREE MEASURES COUNT FACES ONLY, which is the grain their rules are written at
    ("no FACE may open on the same three words as a sibling"; the two-sentence exemplar is a face)."""
    per = [dict(variant=v['n'], **sibling_spread([v['spine']] + v['faces'])) for v in variants]
    meds = [p['medianOverlapBp'] for p in per if p['medianOverlapBp'] is not None]
    return {'perVariant': per,
            'medianOfVariantMediansBp': int(statistics.median(meds)) if meds else None,
            'worstVariantMedianBp': max(meds) if meds else None}

def cut7_measures(name, variants):
    rows = [v['spine'] for v in variants] + [f for v in variants for f in v['faces']]
    faces = [f for v in variants for f in v['faces']]
    return {'pool': name, 'variants': len(variants), 'rows': len(rows), 'faces': len(faces),
            'verbConcentration': verb_concentration(rows),
            'sentencesPerFace': sentences_per_face(faces),
            'openerTrigram': opener_trigrams(variants),
            'siblingOverlap': sibling_overlaps(variants)}

# ── THE FABLE-SELECTED BENCHMARK ────────────────────────────────────────────────────────────
# ⭐ PRINTED BESIDE EACH OF THE FOUR, exactly as the exemplars' attribution baseline is printed
# beside the attribution figure today, and for the same reason: a measure without a comparison is
# a number nobody can act on. THE POPULATION is the NINE pools of DS-DEF-2 whose packet was chosen
# by a FABLE selector (the v3 dry run + batches 2 and 3; `args-DEF2-v3.onepool.json`,
# `args-DEF2-v3.batch2.json`, `args-DEF2-v3.batch3.json`, each `selectModel: 'fable'`). The six of
# batch 4 and the six of batch 5 were selected by Opus and are NOT in it — that split is the whole
# comparison the selector measurement of 2026-09-13 16:0x was built on.
# ⛔ THE FROZEN FIGURES BELOW WERE MEASURED AT DOCK HEAD 57a75858b AND ARE NEVER SILENTLY
# REFRESHED. The LIVE figure is recomputed from the tree on every run and printed beside them, so
# drift is visible rather than re-recorded (the ruling of `brief-chair-cut-5-and-two-reds.md`).
FABLE_SELECTED_POOLS = [
    'Invasion & War: walls with NO force',
    'Invasion & War: force with NO walls',
    'Internal Security: no legal infrastructure',
    'Disasters & Famine: NO reserves, NO medical provision',
    'Invasion & War: walls AND professional garrison',
    'Internal Security: full legal chain (court AND prison)',
    'Economic Survival: STRONG',
    'Disasters & Famine: granary AND hospital',
    'Beasts & Monsters: frontier, credible deterrence',
]
FABLE_BENCHMARK_FROZEN_AT = '57a75858b'
# FROZEN 2026-09-13 by `measure-block.py <dock> docs/content/RECEIPT_POOLS_DOSSIER_STATE.md
# '### DS-DEF-2' --benchmark` at dock HEAD 57a75858b, all nine pools found, none missing. Each
# figure is the MEDIAN over the nine.
FABLE_BENCHMARK_FROZEN = {
    'pools': 9,
    'verbConcentration': 0.786,          # the commonest attribution verb carries ~4 of 5 attributed rows
    'twoSentenceShare': 0.067,           # about one face in fifteen stops and starts again
    'repeatedWithinVariantShare': 0.0,   # ⭐ ZERO: not one Fable-selected pool repeats an opener trigram
    'medianOfVariantMediansBp': 556,     # siblings share ~5.6% of their content tokens
}
# ⚠ A FIGURE THAT IS NOT A CEILING. The two DULL pools sit at 556 and 477 on measure 4 — AT and
# BELOW the Fable benchmark — so measure 4 is the one of the four that does NOT separate the two
# populations, and no cure should be steered by it alone. It is kept because the refuter's own
# finding was the MOVEMENT (v2 0 -> 500 bp inside one cure), which a level cannot show.
def _pool_key(name):
    """The annex heading carries backticks and the args carry none; match on the bare words."""
    return re.sub(r'[^a-z0-9]+', ' ', str(name).lower()).strip()
FABLE_KEYS = {_pool_key(p) for p in FABLE_SELECTED_POOLS}
def benchmark_of(cut7_rows):
    rows = [r for r in cut7_rows if _pool_key(r['pool']) in FABLE_KEYS]
    if not rows:
        return {'pools': 0, 'found': [], 'missing': FABLE_SELECTED_POOLS,
                'verbConcentration': None, 'twoSentenceShare': None,
                'repeatedWithinVariantShare': None, 'medianOfVariantMediansBp': None}
    found = [r['pool'] for r in rows]
    meds = [r['siblingOverlap']['medianOfVariantMediansBp'] for r in rows
            if r['siblingOverlap']['medianOfVariantMediansBp'] is not None]
    return {
        'pools': len(rows), 'found': found,
        'missing': [p for p in FABLE_SELECTED_POOLS if _pool_key(p) not in {_pool_key(f) for f in found}],
        'verbConcentration': round(statistics.median([r['verbConcentration']['concentration'] for r in rows]), 3),
        'twoSentenceShare': round(statistics.median([r['sentencesPerFace']['twoSentenceShare'] for r in rows]), 3),
        'repeatedWithinVariantShare': round(statistics.median([r['openerTrigram']['repeatedWithinVariantShare'] for r in rows]), 3),
        'medianOfVariantMediansBp': int(statistics.median(meds)) if meds else None,
    }
def _bench_pair(live, frozen):
    l = '—' if live is None else live
    f = 'unfrozen' if frozen is None else frozen
    return f'benchmark live {l} / frozen {f}'

SCALARS = [('wordsPerSentenceMean', BAND_WPS), ('sameOpenerRate', BAND_RATE),
           ('petWordsPerHundredWords', BAND_PER100), ('sensoryNounsPerHundredWords', BAND_PER100),
           ('attributionsPerSentence', BAND_RATE), ('openShare', BAND_RATE)]

def fingerprint(label, pools, variants=None):
    rows = [pool_fingerprint(k, v) for k, v in pools.items() if v]
    empty = [k for k, v in pools.items() if not v]
    vmap = variants or {}
    # THE FOUR MEASURES ARE FACE MEASURES (a verb, a stop, an entrance, a sibling), so a pool of
    # BARE SPINES is skipped rather than reported as zeros — but it is COUNTED and NAMED, because
    # "no variants parsed" would read as an instrument failure on a block the REWRITE has not
    # reached yet (DS-DEF-5 is eleven such pools today).
    cut7 = [cut7_measures(k, vs) for k, vs in vmap.items() if vs and any(v['faces'] for v in vs)]
    skipped = [k for k, vs in vmap.items() if vs and not any(v['faces'] for v in vs)]
    bench = benchmark_of(cut7)
    if not rows:
        return {'label': label, 'pools': [], 'summary': None, 'cut7': cut7,
                'cut7Benchmark': {'live': bench, 'frozen': FABLE_BENCHMARK_FROZEN,
                                  'frozenAt': FABLE_BENCHMARK_FROZEN_AT},
                'cut7Summary': None, 'cut7SkippedPools': skipped}
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
    c7sum = None
    if cut7:
        meds = [c['siblingOverlap']['medianOfVariantMediansBp'] for c in cut7
                if c['siblingOverlap']['medianOfVariantMediansBp'] is not None]
        c7sum = {
            'pools': len(cut7),
            'rows': sum(c['rows'] for c in cut7), 'faces': sum(c['faces'] for c in cut7),
            'verbConcentrationMedian': round(statistics.median([c['verbConcentration']['concentration'] for c in cut7]), 3),
            'poolsOverHalfOnOneVerb': sum(1 for c in cut7 if c['verbConcentration']['concentration'] > 0.5),
            'twoSentenceShareMedian': round(statistics.median([c['sentencesPerFace']['twoSentenceShare'] for c in cut7]), 3),
            'poolsWithNoTwoSentenceFace': sum(1 for c in cut7 if c['sentencesPerFace']['twoSentenceFaces'] == 0),
            'repeatedOpenerFaces': sum(c['openerTrigram']['repeatedWithinVariantFaces'] for c in cut7),
            'poolsWithARepeatedOpener': sum(1 for c in cut7 if c['openerTrigram']['repeatedWithinVariantFaces'] > 0),
            'siblingOverlapMedianBp': int(statistics.median(meds)) if meds else None,
        }
    return {'label': label, 'pools': rows, 'summary': summary, 'cut7': cut7, 'cut7Summary': c7sum,
            'cut7SkippedPools': skipped,
            'cut7Benchmark': {'live': bench, 'frozen': FABLE_BENCHMARK_FROZEN,
                              'frozenAt': FABLE_BENCHMARK_FROZEN_AT}}

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

def print_cut7(fp):
    """⭐ THE FOUR MEASURES (the chair's cut 7). REFUSES NOTHING — no threshold, no exit code."""
    cut7 = fp.get('cut7') or []
    sk = fp.get('cut7SkippedPools') or []
    if not cut7:
        why = (f"every one of its {len(sk)} pools is bare spines, with no `[face]` row for a verb, a"
               " stop, an entrance or a sibling to be measured on — the REWRITE has not reached this"
               " block" if sk else "no pool and no variant parsed under this heading")
        print(f"\n── THE FOUR MEASURES · {fp['label']}: NOT MEASURED, and the reason is not a"
              f" failure of the instrument: {why}. ──"); return
    b = fp['cut7Benchmark']; live, frozen = b['live'], b['frozen']
    print(f"\n── THE FOUR MEASURES (cut 7) · {fp['label']} — REFUSES NOTHING ──")
    for i, c in enumerate(cut7, 1):
        vc, sp, ot, so = (c['verbConcentration'], c['sentencesPerFace'],
                          c['openerTrigram'], c['siblingOverlap'])
        mark = ' ⟵ FABLE-SELECTED' if _pool_key(c['pool']) in FABLE_KEYS else ''
        print(f"  [M{i:02d}] {c['pool']}{mark}")
        print(f"        (1) VERB CONCENTRATION  {vc['concentration']} — '{vc['commonestVerb']}' on "
              f"{vc['commonestVerbRows']} of {vc['attributedRows']} attributed rows "
              f"({c['rows']} rows, {vc['distinctVerbs']} distinct verbs) · {_bench_pair(live['verbConcentration'], frozen['verbConcentration'])}")
        print(f"            verbs {hist_str(vc['verbs'])}")
        print(f"        (2) SENTENCES PER FACE  two-sentence share {sp['twoSentenceShare']} "
              f"({sp['twoSentenceFaces']} of {sp['faces']}) · hist {hist_str({str(k): v for k, v in sp['hist'].items()})} · "
              f"shortest {sp['shortestFaceWords']}w · longest {sp['longestFaceWords']}w · "
              f"≤10w {sp['facesUnderElevenWords']} · {_bench_pair(live['twoSentenceShare'], frozen['twoSentenceShare'])}")
        print(f"        (3) OPENER TRIGRAM      pool commonest '{ot['poolCommonest']}' ×{ot['poolCommonestCount']} · "
              f"faces sharing a trigram with a sibling {ot['repeatedWithinVariantFaces']} of {ot['faces']} "
              f"({ot['repeatedWithinVariantShare']}) in {ot['variantsBreached']} variant(s) · "
              f"{_bench_pair(live['repeatedWithinVariantShare'], frozen['repeatedWithinVariantShare'])}")
        for r in ot['perVariant']:
            print(f"            v{r['variant']}: '{r['commonest']}' ×{r['commonestCount']} of {r['faces']} faces · repeated {r['repeatedFaces']}")
        print(f"        (4) SIBLING OVERLAP     median of variant medians {so['medianOfVariantMediansBp']} bp · "
              f"worst variant {so['worstVariantMedianBp']} bp · {_bench_pair(live['medianOfVariantMediansBp'], frozen['medianOfVariantMediansBp'])}")
        for r in so['perVariant']:
            if r['medianOverlapBp'] is None:
                print(f"            v{r['variant']}: {r['why']}")
            else:
                print(f"            v{r['variant']}: median {r['medianOverlapBp']} bp · min {r['minOverlapBp']} · max {r['maxOverlapBp']} · "
                      f"pairs {r['pairs']} · sameSegmentPairs {r['sameSegmentPairs']}/{r['pairs']}")
    s = fp.get('cut7Summary')
    if s:
        print(f"  BLOCK SUMMARY (the four measures) {fp['label']}: pools {s['pools']} · rows {s['rows']} · faces {s['faces']}")
        print(f"    (1) verb concentration median {s['verbConcentrationMedian']} · pools over HALF the rows on one verb: {s['poolsOverHalfOnOneVerb']}/{s['pools']}")
        print(f"    (2) two-sentence share median {s['twoSentenceShareMedian']} · pools with NO two-sentence face: {s['poolsWithNoTwoSentenceFace']}/{s['pools']}")
        print(f"    (3) faces sharing an opener trigram with a sibling: {s['repeatedOpenerFaces']} · pools breached {s['poolsWithARepeatedOpener']}/{s['pools']}")
        print(f"    (4) sibling overlap, median over pools: {s['siblingOverlapMedianBp']} bp")
    print(f"    BENCHMARK — the {live['pools']} FABLE-SELECTED pools found in this block "
          f"(frozen figures taken at {b['frozenAt']}): verb-concentration {live['verbConcentration']} · "
          f"two-sentence share {live['twoSentenceShare']} · repeated-opener share {live['repeatedWithinVariantShare']} · "
          f"sibling overlap {live['medianOfVariantMediansBp']} bp")
    if sk:
        print(f"    ⚠ {len(sk)} pool(s) of bare spines NOT MEASURED (no `[face]` row): {' | '.join(sk)}")
    if live['missing']:
        print(f"    ⚠ not in this block: {' | '.join(live['missing'])}")

if __name__ == '__main__':
    argv = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = {a for a in sys.argv[1:] if a.startswith('--')}
    dock, annex, head = argv[0:3]
    budget = int(argv[3]) if len(argv) > 3 else 1900
    base = argv[4] if len(argv) > 4 else 'f2da5a3ee'
    shipped = subprocess.run(['git','-C',dock,'show',base+':'+annex],capture_output=True,text=True).stdout
    tree = open(os.path.join(dock, annex)).read()
    sl, tl = block_lines(shipped, head), block_lines(tree, head)
    sp, tp = pools_of(sl), pools_of(tl)
    sv, tv = variants_of(sl), variants_of(tl)
    fps = fingerprint('SHIPPED ' + base, sp, sv)
    fpt = fingerprint('TREE ' + dock.rstrip('/').split('/')[-1], tp, tv)
    if '--benchmark' in flags:
        b = fpt['cut7Benchmark']['live']
        print(f"THE FABLE-SELECTED BENCHMARK, recomputed from the tree of {dock} at "
              f"{subprocess.run(['git','-C',dock,'rev-parse','--short','HEAD'],capture_output=True,text=True).stdout.strip()}")
        print(json.dumps(b, indent=1)); sys.exit(0)
    quiet = '--json-only' in flags
    if not quiet:
        report('SHIPPED  ' + base, sp, budget)
        report('TREE     ' + dock.rstrip('/').split('/')[-1], tp, budget)
        print_fingerprint(fps); print_fingerprint(fpt)
        print_cut7(fps); print_cut7(fpt)
    if '--json' in flags or quiet:
        print(json.dumps({'block': head, 'dock': dock, 'annex': annex, 'baseRev': base,
                          'budget': budget, 'shipped': fps, 'tree': fpt}, indent=1))
