# fam1.py: the reviewer's step-1 families over plus.ndjson (every line the tip prints that the base does not)
import json,re,collections,sys
S='/tmp/claude-0/-home-user-settlement-engine/6df78bee-69c1-5d69-8635-8598a0eccd1d/scratchpad'
FAMS=[
 ('L01 readiness label (chip, posture, PDF, Foundry, AI)', r'^(Fortress|Well-[Dd]efended|Defensible|Lightly [Dd]efended|Vulnerable|Undefended)$|^Defense: |^- \*\*Readiness|^Defense posture:'),
 ('L02 readiness why-line', r'^\*?(Fortress|Well-[Dd]efended|Defensible|Lightly [Dd]efended|Vulnerable|Undefended): '),
 ('L03 score band chip (Threat Assessment, overview, PDF)', r'^(Critical|Weak|Adequate|Strong)( [▼▲])?$|^(Magical Capability|Economic Resilience|Monster Defense|Military Strength|Internal Security) (Critical|Weak|Adequate|Strong)$'),
 ('L04 substrate band chip', r'^(Defense readiness|Infrastructure condition|Law & order|Food|Economic capacity|Healing capacity|Religious authority|Trade connectivity|Labor capacity|Social trust|Strength of the powers|Public legitimacy) (Critical|Weak|Adequate|Strong|Surplus|Strained|Collapsed|Exceptional)$'),
 ('L05 score figure', r'^\d+(/100)?$|^\d+ (Legitimacy Crisis|Contested|Tolerated|Approved|Beloved|Legitimate|Endorsed)$'),
 ('L06 force-count header', r'^Armed Forces & Fortifications'),
 ('L07 arcane-defence house rows (scroll scribe, enchanter, heading, descriptions, FORCED badge)', r"Scroll scribe|Enchanter|[Ss]pell scrolls|Scrolls of spells|[Mm]agic item|^FORCED$|^Arcane defense$"),
 ('L08 money lines (Economic Survival band)', r"Money enough|money in hand|pay its way|bad season with its arrangements|short of money|pay for its own emergencies|fund a short crisis|crisis of the ordinary length|already owed|paid late|pay book|cannot fund|no money to meet|enough for the usual trouble"),
 ('L09 guard lines (Internal Security band)', r"exists on paper|take bribes|keeps what rounds it can|deal with a brawl|walk into the centre|struggle to hold|looks defended in the ordinary way|settles things itself|nowhere to take it|no watch"),
 ('L10 invasion lines (Invasion & War / PDF force line)', r"palisade|no walls|No walls|walls and|could not survive a serious attack|all but undefended|unfortified|line around|is walled|has a wall|armed citizens|armed townspeople|would see off"),
 ('L11 legitimacy and power (breakdown, label, faction power)', r"^Defense [+-]?\d|^[+-]?\d+ Defense$|Legitimacy|legitimacy|Tolerated|Endorsed|Contested|Approved|^Power \d|Contests the seat|Holds power|Contender|governs|Governing:|Factions \(|^(Guild Council|Military Council|Military/Guard|Merchant Guilds|Craft Guilds|Religious Authorities|Landed Gentry|Noble|Merchant|Military|Religious)\b.*\d|no stake yet|holds the seat"),
]
rows=[json.loads(l) for l in open(S+'/out/plus.ndjson')]
out=collections.defaultdict(list)
for r in rows:
    f=next((n for n,rx in FAMS if re.search(rx,r['line'])),'L99 other')
    out[f].append(r)
json.dump({k:v for k,v in out.items()},open(S+'/out/fam1.json','w'))
for k in sorted(out): print(len(out[k]), len({r['seed'] for r in out[k]}), k)
for r in out.get('L99 other',[])[:40]: print('   ',r['seed'],r['surface'],r['line'][:150])
