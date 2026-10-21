import sys, re
sys.path.insert(0, '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/L-FOLD3-probe')
import ins
T = '2026-10-20 (fp-final P7; L-FOLD3'
D = '/Users/cstokes/Desktop/settlement-engine/docs/'


def cells(line):
    # split a markdown table row on unescaped pipes
    parts = re.split(r'(?<!\\)\|', line.strip())
    assert parts[0] == '' and parts[-1] == '', line[:80]
    return [p.strip() for p in parts[1:-1]]


def register(vol, head_prefix):
    lines = open(D + f'DESIGN_FP_ARCH_{vol}.md', encoding='utf-8').read().split('\n')
    start = [i for i, l in enumerate(lines) if l.startswith(head_prefix)]
    assert len(start) == 1, (vol, len(start))
    i = start[0] + 1
    while not lines[i].startswith('|'):
        i += 1
    header = cells(lines[i]); i += 2  # skip header + separator
    rows = []
    while i < len(lines) and lines[i].startswith('|'):
        rows.append(cells(lines[i])); i += 1
    return header, rows


SURF = {
    'OP': 'SURFACE: identifiers, flags and code values are MACHINERY, never in a DM sentence; the DM reads the deed in the world\'s words ("broke the warden\'s son out of the cells", "stands in Tolle\'s debt" — OP §18); scrutiny words are shown in their prose forms',
    'MG': 'SURFACE: the DM reads the DEED ("turned back at the ford", "waited for the river to fall" — MG §18, MG13); the verb, the motive and every read are scrutiny (the unit\'s OWN court\'s page) or machinery, never pushed; `mounted` never a code token — prose says "rode"',
    'WS': 'SURFACE: the way is read as a dossier line in the court\'s habits ("Kell makes its wars long" — WS §16); `way_*`, the causes and the reads never appear in a DM sentence, and prose never says a bare "way" where the road rung `way` could be read',
    'FS': 'SURFACE: the DM reads taxes ("raised its taxes", "heavier than custom", "the new taxes", "remit them, ease them, or hold firm" — FS §18); no hand word, cause, read or `exaction` in a DM sentence',
}

out = []
out.append(f'| **— P7 (fp-final P7, 2026-10-20; lane L-FOLD3; `briefs/L-FOLD3.md` items 5, 12, 13 (c), 14 (b), 15 (c) — THE NEXT PROGRAM\'S REGISTER PASS: every row of the four volumes\' TOKEN REGISTER sections (OP §16 · MG §16 · WS §14 · FS §16), copied by script one row each with its cells VERBATIM, then THE PATRON DEITY\'s P6 row (CH §2.3) and the lanes\' tokens the registers do not carry; the census of record is each volume\'s (`cure/L-<V>-probe/`, the rounds\' probes), re-run by this lane for the P7 tokens in `cure/L-FOLD3-probe/census-p7.out` (every one FREE on master `81f1cd963` except the LANDED `patronDeity` · `covert` · `feint`-as-prose)) —** | each row: the volume\'s token cell; its meaning; the volume\'s status and note, then the SURFACE rule | each row REGISTERED as its volume states it; LANDED tokens never rename; a homonym is compound-scoped as its volume says |')

for vol, head, mapper in [
    ('OP', '## §16 THE TOKEN REGISTER', lambda c: (c[0], c[2], 'status: ' + c[1])),
    ('MG', '## §16 THE TOKEN REGISTER', lambda c: (c[0], c[2], 'status at master: ' + c[1])),
    ('WS', '## §14 THE TOKEN REGISTER', lambda c: (c[0], c[1], 'homonyms registered: ' + c[2])),
    ('FS', '## §16 THE TOKEN REGISTER', lambda c: (c[0], c[1], 'census: ' + c[2] + '; register note: ' + c[3])),
]:
    hdr, rows = register(vol, head)
    for k, c in enumerate(rows, 1):
        w, m, r = mapper(c)
        out.append(f'| {w} [ADDED {T}; `DESIGN_FP_ARCH_{vol}.md` {head.split(" ")[1]} row {k}, verbatim)] | {m} | REGISTERED ({vol}) — {r}. {SURF[vol]} |')

ch = open(D + 'DESIGN_FP_ARCH_CH.md', encoding='utf-8').read().split('\n')
chp6 = [l for l in ch if l.startswith('| P6 (2026-10-20, L-CH-PD; renamed in P6 r1):')]
assert len(chp6) == 1
c = cells(chp6[0])
out.append(f'| THE PATRON DEITY\'s tokens (CH) — {c[0][len("P6 (2026-10-20, L-CH-PD; renamed in P6 r1): "):]} [ADDED {T}; `DESIGN_FP_ARCH_CH.md` §2.3\'s P6 row, verbatim; RULINGS-P6 §F.3; `cure/D-CH-PD-r1.md` §5 route 10; `cure/BRACKETS-B-champions.md` §4)] | census: {c[1]} | {c[2]} — {c[3]}. `patronDeity` is REGISTERED IN ITS LANDED SENSE ONLY (the settlement\'s seated patron; W-LIVES\'s rung, `clergyTraitPlane.js`, `religionState.js` — read at `81f1cd963`, `census-p7.out` 4 src files) and never written or widened by an FP volume; the oath\'s W-LIVES rung is a NEW `swornDeity` rung (§3.1 INBOX ↳ P7 W-LIVES (1)). SURFACE: the page says "sworn to <god>" and "as her faith bids" (CH §10b), never "her god wills"; no god acts, speaks or wills (the deity doctrine) |')

LANES = [
    ('`replanFromNode` (PS\'s re-plan helper; MG\'s and every leg-at-a-time mover\'s caller) · its refusal reasons `campaign_clock` · `off_node` · `early_by_weight` · `no_gain`', '`cure/BRACKETS-A2-program-volumes.md` §5 item 4; `cure/D-MG-r1.md` §5 FOLD', 'PS\'s ONE re-plan helper beside `holdBeforeNode`; a re-plan only from a node reached, only onto a changed path, at or after the node\'s hop-weighted due tick (OD-MG-18); the four refusal reasons are scrutiny words on the unit\'s own court\'s page', 'FREE (`census-p7.out`: `replanFromNode` 0 · 0 · 0); PS owns the helper, MG passes its `weeksOf` pricer'),
    ('the sighting subject kind `unit` with `heading?`', '`cure/BRACKETS-A2-program-volumes.md` §5 item 4; RULINGS-P6 A.4; ⭐ OD-MG-6', 'MN\'s ONE sighting store\'s new subject kind and field (§5 ↳ the sighting store P7)', 'a widening of MN\'s declared shape, the OWNER\'s, visible; `unit` compound-scoped under the ledger key'),
    ('`op_aside` (HB) · `lensOne` (RN) · `RIDING_LAPSE` and the body\'s `riding?` (BD) · the creed-keyed `courtStanceOf` read (BD, for CH §11 step 5b)', '`cure/BRACKETS-A2-program-volumes.md` §5 item 4', 'HB\'s person-grain habit row for an aside (OD-OP-21) · lens one\'s exported pure core (CH\'s `swornLean` reads it) · THE BODIES\' riding flag and its lapse clock (⭐ OD-MG-7) · a court\'s `outlawed` word per creed', 'FREE (`census-p7.out`: `op_aside` · `lensOne` · `RIDING_LAPSE` 0 · 0 · 0); each its owner volume\'s, placed by lane A2'),
    ('`captiveId` (ES)', 'P5 D.3 (b); lane A ES-1', 'the custody normalizer\'s key for an errand-less captive, flag-blind, ES-2b\'s own build step', 'FREE (`census-p7.out` 0 · 0 · 0); ⭐ the OWNER\'s shape, visible (§7 OD-FC-87)'),
    ('`covert` — THE RESCUE ERRAND\'S PURPOSE CLASS', 'RULINGS-P6 §I.3 (SEAMS-P6-3); OD-OP-33 ↳; `briefs/L-FOLD3.md` item 13 (c)', 'a bound champion\'s `court_errand` beyond its employer\'s lands to break a captive out rides the LANDED purpose class `covert` (ES\'s leak law applies); no class `order` exists', 'LANDED — `envoyErrandVocabulary.js :: ENVOY_PURPOSE_CLASSES` = `commercial · covert · diplomatic · factional · personal · religious` (read at `81f1cd963`, `census-p7b.out`); reused in its landed meaning, never a new class'),
    ('the EXERTION\'s source-kind key (CH)', '`cure/BRACKETS-B-champions.md` §4; RULINGS-P6 G.1; CH §2.2b', 'an exertion that answers a `captive_held` call carries that call\'s `source.kind`, so the calling stay, the seam leans and `paragon_exerted` stay off at the jailer\'s town (the rescue exert is the card only, OD-OP-36)', 'the key\'s NAME is fixed by CH-1\'s car-0 token census — a SLOT name, PLAUSIBLE until then'),
    ('`false_word_exposed` — ONE DEED KIND', 'RULINGS-P6 §J.5; `cure/LANE-D-verify.md` ROUTED 3; §3.3.28', 'the ONE deed of a lie, minted at EXPOSURE only, in the `opportunity_act` slot, with CH\'s paragon arm registered to it; no `paragon_act · false_word` kind', 'FREE (`census-p7.out` 0 · 0 · 0); ONE coordinate set (OP\'s 0.25 · 0.3 · 0.5, DRAFT), RN signs at the FP-46 roster'),
    ('`rescue_debt` (OP\'s deposit `rowKind`)', 'RULINGS-P6 §I.4 (SEAMS-P6-6); `cure/LANE-C-seams.md` ROUTED 2; `briefs/L-FOLD3.md` item 13 (c)', 'the deposit row kind renamed from `debt` (members `rescue · false_word · rescue_debt`) so no OP value repeats D-5\'s action word `debt` or reads as the withdrawn `debt` tie (OD-OP-1 ⭐)', 'FREE (`census-p7.out` 0 · 0 · 0; `cure/L-OP-probe/tokens-2.out`); D-5\'s `debt` unchanged'),
    ('`purse_empty` (CH) · `coffers_bare` (WS)', '`cure/BRACKETS-B-champions.md` §4; CH l.436 (lane B)', 'a PARAGON\'s own purse (CH §4.8\'s reason word) · a COURT\'s coffers as a way-of-war deviation cause (`WAY_DEVIATION_CAUSES`)', 'two identifiers, two grains; WS never uses `purse_empty`'),
    ('`warLevyMarks` · `markLevyRoom` (WS) · `pressedSteps` · `pressedHandOf` (FS) · `stranger_land` (MG)', '`cure/D-FOUR-r4.md` ROUTED P7; `cure/D-FS-r2.md` §5; `cure/D-MG-r3.md` §5', 'the room at the march and its one writer (⭐ OD-WS-40) · the refusal\'s completed band steps on the hand record (⭐ OD-FS-2) · a wing\'s refused split or re-plan onto a stranger\'s land (degraded arm only)', 'FREE (`census-p7.out` 0 · 0 · 0 each); each also a row of its volume\'s register above'),
]
for w, src, m, r in LANES:
    out.append(f'| {w} [ADDED {T}; {src})] | {m} | REGISTERED — {r}. SURFACE: machinery or scrutiny only, never a DM sentence |')

RC = (f'| ↳ `REGARD_CAUSES` — P7: `served_with` AND `gift` STRUCK, `betrayed` DARK, `rescued_by` APPENDED [AMENDED {T}; `cure/D-MN-RN-p5b-p5.md` §5 route 4; RN §2.4 as cured in P5d (REFINED, vetoable); `DESIGN_FP_ARCH_OP.md` §6.5 and RN\'s lane-A2 bracket; `briefs/L-FOLD3.md` item 12)] '
      '| (a) RN STRUCK `served_with` and `gift` from `REGARD_CAUSES` (RN §2.4, P5d) — the mirror rows above drop both; (b) `betrayed` is DARK VOCABULARY: no door in any volume — its slot is CH\'s debts-and-favours unit, else it is struck at the next register pass (`ransomed_by` stays RN\'s, its door the ransom race\'s `pay` close); (c) THE OPPORTUNITY\'s `rescued_by` is APPENDED through RN\'s registration row (the freed person\'s regard for the rescuer; OP §6.5 — "regard, not a second gratitude store") '
      '| the causes as of P7: `heard_deed · met · pledge_kept · pledge_broken · ransomed_by · abandoned_to_captivity · refused_at_gate · banned_by · betrayed (DARK) · authored · condemned_a_good_deed · praised · condemned · paid_well · sheltered · slandered (DARK until IN\'s C1) · rescued_by`; each grows only by a registry row in its owner\'s wave |')
ST = (f'| ↳ `stance` — THE FISCAL SEAT\'S HAND IS NEVER A STANCE [AMENDED {T}; `DESIGN_FP_ARCH_FS.md` §2.4 and §16 row 1 (FS-r1-2))] '
      '| THE FISCAL SEAT\'s court decision (`fiscalHand` · `FISCAL_HANDS` `remitting · wonted · exacting · wringing`) beside WC\'s war stance, EC-6\'s trade stance and BD\'s `COMMONS_STANCES` '
      '| the fiscal decision is the HAND in every token and sentence, never "stance" (WC · EC-6 · BD own that word); never `customary` (the treasury\'s band); `wonted` is never persisted (absence); the DM reads taxes (FS §18) |')
SI = (f'| ↳ the sighting store — THE `unit` SUBJECT AND ITS `heading` [AMENDED {T}; RULINGS-P6 A.4 (MG-r1-8); ⭐ OD-MG-6; MN\'s lane-A2 bracket; `DESIGN_FP_ARCH_MG.md` §5.3–§5.4)] '
      '| `subjectKey`\'s kinds gain `unit` (an army, a wing or a fleet as a believed mover) and the row gains `heading?` (the believed heading a sighting records — MG\'s feint is by heading); `recordSighting`\'s caller list is widened BY DECLARATION with three UNIT producers: PR\'s look/screen, WC Arc A\'s contact, ES\'s product '
      '| ⭐ a widening of MN\'s declared shape, the OWNER\'s, visible (§7 OD-FC-96); THE ONE STORE and its one writer stand; until the first unit producer lands the feint, `believedHeadingOf` (bar the casus fallback) and `believedMotiveOf` are DARK |')

edits = [
    {'after': '| THE THREE SHAPES WITHOUT A LIFECYCLE ROW (P5C-12\'s three; C.12)', 'lines': out},
    {'after': '| ↳ `REGARD_CAUSES` — `abandoned_by` STRUCK; CH\'s THREE APPENDED', 'lines': [RC]},
    {'after': '| `stance` | WC\'s WAR stance ladder', 'lines': [ST]},
    {'after': '| the sighting store (MN; BD, ST and PR read it) [ADDED 2026-10-19', 'lines': [SI]},
]
ins.apply(ins.FOLD, edits)
print('register rows', len(out))
