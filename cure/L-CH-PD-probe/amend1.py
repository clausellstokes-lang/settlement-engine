#!/usr/bin/env python3
"""L-CH-PD amendment, pass 1: header, owner's words, §0, §1, §2, §4, §6, §7, CH15. Anchored; every anchor asserted unique."""
import sys
P = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_CH.md'
t = open(P, encoding='utf-8').read()
TAG = '[ADDED 2026-10-20 (fp-final P6; L-CH-PD)'

def once(anchor):
    n = t.count(anchor)
    if n != 1:
        sys.exit(f'ANCHOR COUNT {n}: {anchor[:90]!r}')

def after_line_starting(prefix, new):
    """insert `new` as new line(s) after the (unique) line that starts with prefix"""
    global t
    lines = t.split('\n')
    hits = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    if len(hits) != 1:
        sys.exit(f'LINE PREFIX COUNT {len(hits)}: {prefix[:90]!r}')
    lines.insert(hits[0] + 1, new)
    t = '\n'.join(lines)

def append_to_line(prefix, extra):
    global t
    lines = t.split('\n')
    hits = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    if len(hits) != 1:
        sys.exit(f'LINE PREFIX COUNT {len(hits)}: {prefix[:90]!r}')
    lines[hits[0]] = lines[hits[0]] + extra
    t = '\n'.join(lines)

def replace_once(old, new):
    global t
    once(old)
    t = t.replace(old, new)

# E1 header line
after_line_starting('## and by the coherence fold. `[REFINED 2026-10-17 (fp-final) — …]`',
  '## ' + TAG + ' — AMENDED IN PLACE with THE PATRON DEITY on the owner\'s word of 2026-10-20 12:44 CDT: an optional sworn god on every champion and villain whose recorded character is ONE bounded lean inside the one roll (CH22, §10b, wave CH-11); no new flag, hearing kind or host line.]')

# E1b status blockquote: append to its first paragraph (the line beginning "> **STATUS:")
append_to_line('> **STATUS: COMPILED DRAFT; P3 ROUND 2 DISPOSED',
  ' **P6 AMENDED (2026-10-20, lane L-CH-PD):** THE PATRON DEITY (the owner\'s word of 12:44 CDT) is compiled into this volume in place — CH22, P1 `patronDeity`, §10b, §11 step 5b, CH-11, L1c, S60–S67, OD-CH-51..55 — and the fold\'s WC INBOX cite re-pointed "(13)" → "(14)" (RULINGS-P5 §D.5); §25\'s P6 block holds the record (`cure/L-CH-PD.md`). No STOP stands.')

# E2 owner's word of 2026-10-20, before THE ANSWER paragraph
replace_once('\n**THE ANSWER IN ONE PARAGRAPH.**',
  '\nAnd on 2026-10-20 (BOARD, the 12:44 CDT stamp, verbatim) ' + TAG + ' — the word THE PATRON DEITY answers, §10b]: "laslty, with the champion system champions and villains should also have a patron diety option that would also contribute to their decision makings"\n\n**THE ANSWER IN ONE PARAGRAPH.**')

# E3 answer paragraph addendum
after_line_starting('**THE ANSWER IN ONE PARAGRAPH.**',
  '\n' + TAG + ' — the patron deity, in one breath] A champion or a villain may also be sworn to a god the DM has made. What the world records of that god — good or evil, lawful or not, warlike or peaceful — leans the paragon\'s own choices a little and never more than its own nature: a merciful god\'s healer stays where the sick are, a lawful god\'s captain keeps her bargains longer, a warlike god\'s champion goes to a fight more readily. A town that seats the same god lets its sworn one in more easily; a town that has put that faith down watches it. The faithful remember what their sworn one does, warmly or bitterly. The god itself never acts.')

# E4 §0 rows after PARADIGM_AXES row
after_line_starting('| `npc/paradigmAxisCatalog.js :: PARADIGM_AXES` |',
  '| `worldPulse/deityAxes.js :: evil01` · `chaos01` · `deityTemper` ' + TAG + '] | `const EVIL01 = Object.freeze({ evil: 1, neutral: 0.5, good: 0 });` · `const CHAOS01 = Object.freeze({ chaotic: 1, neutral: 0.5, lawful: 0 });`; `deityTemper`: "The READ-TIME temper seam — TWO arms … AUTHORED WINS … OTHERWISE DERIVE, from the two alignment axes"; "The retired stored `temperamentAxis` is consulted by NEITHER arm" | a SWORN god\'s recorded character as three coordinates (§10b); a zero-import leaf | any deity-bearing world | 153 raw | derived | CONFIRMED |\n'
  '| `deityCommitEmbed.js :: commitDeityEmbed(ref, snapshot)` · `worldPulse/pantheon.js :: deityIdOf` ' + TAG + '] | `_deityRef: ref, name: …, alignmentAxis: snapshot.alignmentAxis \\|\\| \'neutral\', … lawAxis: snapshot.lawAxis \\|\\| \'neutral\', …authoredCharacterEmbedKeys(snapshot)` — "a stored record is always fully specified"; zero `import` lines; `deityIdOf`: `const ref = deity._deityRef \\|\\| deity.primaryDeityRef;` | the ONE builder of P1\'s `patronDeity` (the landed embed shape; "THE EMBED IS WHAT THE ENGINE CAN SEE", `deitySnapshot.js`) and its identity read | — | — | inside the authored snapshot (L1c) | CONFIRMED |\n'
  '| `worldPulse/religionState.js :: ensureReligionState` (`patronRef` · `standing` · `suppressed`) ' + TAG + '] | `{ deities: {}, patronRef: null, … }`; a creed\'s entry `{ deityRef: ref, snapshot, …, standing: \'ascendant\', …, suppressed: false, legitimacy, … }`; "WF-1b ⛔ THE ONE WRITER of `deities[ref].suppressed`" — "the stamp records WHEN THE BELIEVERS\' CREED WAS PUT OUT OF THE LIGHT … It asserts nothing about a god" | the town\'s patron SEAT and a creed put down there — the two ends §11\'s creed step reads (§10b); READ, never written | the local faith lane | 794 raw | persisted `worldState.religionStates` (WF\'s) | CONFIRMED |\n'
  '| `corruption.js :: npcDeityDisfavor(deity, npc)` ' + TAG + '] | "the deity pressure is a SINGLE bounded multiplier … Each multiplier lies in [1 − span, 1 + span] … NEUTRAL / absent deity ⇒ both EXACTLY 1.0 (byte-identical)" | the LANDED idiom `patronLean` takes — one bounded multiplier centred on 1, identity for a neutral god; a different quantity (corruption\'s knobs), never reused | the corruption lane | — | derived | CONFIRMED |')

# E5 binding prior words
append_to_line('- THE DEITY DOCTRINE (ADDENDUM 15): the followers act, the god does not.',
  ' ' + TAG + ' — the carve-out\'s record (the owner, 2026-09-12, verbatim): "dieties can have prose that act according to their alignment position and related to their rank in the hierarchy of that settlement." and "or it would be correct to say that the followers of the diety acted that way." — the deity\'s axes (`alignmentAxis`, `lawAxis`), the DERIVED temper (`deityTemper`; the stored `temperamentAxis` INERT) and the pantheon rank (`rankAxis`) are one fact family, the creed\'s standing IN A TOWN (`cult · established · ascendant`, the one patron, `suppressed`) another: "TWO DIFFERENT RANKS". THE PATRON DEITY (CH22, §10b) reads them so.]')

# E6 §1 heading + CH22 after CH21 + CH15 bracket
replace_once('## §1 THE LAWS (CH1–CH21)', '## §1 THE LAWS (CH1–CH22)')
after_line_starting('**CH21 — EVERY VILLAIN\'S HIRE IS CLANDESTINE',
  '\n**CH22 — A SWORN GOD LEANS THE CHOICE; THE GOD NEVER ACTS (the owner, 2026-10-20: "champions and villains should also have a patron diety option that would also contribute to their decision makings").** ' + TAG + ' — the heading reads CH1–CH22 since this law] A paragon MAY be sworn to ONE god the DM has made — P1\'s optional `patronDeity`, a committed deity embed (§2.1; the OWNER\'s persisted shape, OD-CH-51). That god\'s RECORDED character — `alignmentAxis` and `lawAxis` read by `evil01` / `chaos01`, and the ONE temper read `deityTemper` (the stored `temperamentAxis` is inert) — enters the paragon\'s ONE roll as ONE bounded, named lean, `patronLean` (§10b), beside its chart and its habits and never above them: its bound (DRAFT 0.15) sits below a habit\'s landed span (`habitCurve.js :: habitFactor`, `HABIT_SPAN: 0.35`) and below the `defining` trait\'s doubled row, so the follower acts in its own character first. The pantheon RANK (`rankAxis`) leans nothing in a person\'s roll (the two ranks are different facts). The creed\'s STANDING in a town — its seat, its suppression — moves the paragon\'s welcome at that town\'s gate by at most ONE step (§11 step 5b); the faithful\'s REGARD of their sworn one moves by what it does (RN\'s lane, routed). No miracle, no omen, no blessing, no divine act; nothing is predicated of the god ("the followers of the diety acted that way"); the engine never writes a religion state, a pantheon entry or a deity embed for a paragon. With no sworn god every read is exactly identity; a NEUTRAL god leans no choice (its character carries no signal).')
append_to_line('**CH15 — THE FOLLOWERS ACT, THE GOD DOES NOT.**',
  ' ' + TAG + ' — a paragon of ANY calling may now be SWORN to one god (CH22, §10b); this law binds the oath: the sworn one acts by its god\'s recorded character, the god never acts; a saint\'s god is its creed]')

# E7 §2.1 P1 row after heldOffice row
after_line_starting('| `heldOffice` |',
  '| `patronDeity` | a COMMITTED DEITY EMBED — `deityCommitEmbed.js :: commitDeityEmbed(ref, snapshot)`\'s frozen record `{ _deityRef, name, alignmentAxis, temperamentAxis, rankAxis, lawAxis, domain?, …DEITY_AUTHORED_CHARACTER_KEYS }`, built at the DM\'s door from a DM-authored deity or a god this campaign\'s world carries (its state key verbatim); or absent (the default) | the god the paragon is SWORN to (the owner, 2026-10-20: "a patron diety option") — any calling, either side, a person or a corps; a faith CHAMPION\'s names its `creedRef` (§10b); its recorded character leans the one roll (CH22) | §10b, §4.3–§4.5, §7, §11 step 5b ' + TAG + ' — the brief\'s `patronDeityId` is replaced by the embed: the engine sees only embeds (`deitySnapshot.js`: "THE EMBED IS WHAT THE ENGINE CAN SEE") and deities are keyed by refs (`deityIdOf`); census `cure/L-CH-PD-probe/census-pd.out.tsv`; the OWNER\'s persisted shape, OD-CH-51] |')

# E8 §2.2 rows after purseBand/needsOf row
after_line_starting('| `purseBand` / `needsOf` |',
  '| `patronDeityOf` | `(view) → DeityEmbed \\| null` | the paragon\'s sworn god (P1 `patronDeity`) or null — the one reader of the field, inside `paragonOf`\'s view (no third dotted reader); a COURT reads it only as a PRESENCE fact at its own town\'s gate, and never under `secretKind: secret_faith` (§10b) ' + TAG + '] |\n'
  '| `patronLean` | `(view, { purpose, act }) → { act, commit, reason }` | THE ONE PATRON LEAN (§10b): `act = 1 + PATRON_LEAN_WEIGHT × lensOne(god, face) / LENS_ONE_MAX` over CH\'s own registered face of the act the candidate would make (§2.2b), `commit = 1 + PATRON_LEAN_WEIGHT × (2·lawfulness01 − 1)`; both exactly 1 with no sworn god, `act` exactly 1 for a neutral god or an act-less purpose; DRAFT, UNMEASURED ' + TAG + '] |')

# E9 §2.3 token register row before THE MAP REGISTER row
lines = t.split('\n')
hits = [i for i, l in enumerate(lines) if l.startswith('| THE MAP REGISTER (HOST-r1-5;')]
if len(hits) != 1: sys.exit('MAP REGISTER anchor')
lines.insert(hits[0], '| P6 (2026-10-20, L-CH-PD): the P1 field `patronDeity` (a committed deity embed, identity `_deityRef`) · the reads `patronDeityOf` and `patronLean` (leaf `paragon/paragonPatron.js`) · the constant `PATRON_LEAN_WEIGHT` · the reason word `keeps_the_faith` · the town\'s-gate reasons `patron_creed` · `suppressed_creed` · the door\'s refusal `patron_creed_conflict` · `secret_faith` given its first meaning; READ in their landed meanings: `patronRef`, `suppressed`, `deityTemper`, `evil01`, `chaos01`, `commitDeityEmbed`, `deityIdOf`; `rankAxis` NEVER read | `patronDeity` 4 src (1 quoted: W-LIVES\'s `SUBJECT_RESOLUTIONS` rung `\'patronDeity\'`) · 0 · 0 · 0 — LANDED in ONE sense, "the patron deity of a soul"; `patronDeityOf` · `patronLean` · `PATRON_LEAN_WEIGHT` · `keeps_the_faith` · `patron_creed` · `suppressed_creed` · `patron_creed_conflict` 0 · 0 · 0 · 0 · 0 each; `patron` LANDED three ways (291 src files, 61 quoted); `sworn` LANDED (GR-1\'s treaty stamp, PL\'s sworn edge) — `cure/L-CH-PD-probe/census-pd.out.tsv` | FREE / REUSED / HOMONYM registered | `patronDeity` names, on a paragon, the god it is sworn to — W-LIVES\'s rung and `clergyTraitPlane.js :: targetedFootholds`\'s parameter name the patron god of a soul or a town in the same sense; bare "patron" in this volume stays the TOWN\'s seated god (`patronRef`) and the court is never a `patron` (§7); "sworn" is prose only ("sworn to the Lantern"), never an identifier ' + TAG + '] |')
t = '\n'.join(lines)

# E10 §4.3 / §4.4 / §4.5 / §4.8
append_to_line('**4.3 Commitment and the clock.**',
  ' ' + TAG + ' — a SWORN paragon\'s `COMMIT_MARGIN` is multiplied by `patronLean(…).commit` (its god\'s law half, bounded ±`PATRON_LEAN_WEIGHT`, DRAFT): a lawful god\'s sworn holds an aim and a bargain longer, a chaotic god\'s yields to a better one sooner — never a forced break (§10b)]')
append_to_line('The `defining` position doubles its row\'s weight (the bolstered trait).',
  ' ' + TAG + ' — THE PATRON (§10b): each candidate\'s score is also multiplied by `patronLean(…).act` — its sworn god\'s reading of the act the candidate would make (exactly 1 for an act-less purpose, an unsworn paragon or a neutral god), bounded below a habit\'s span and below this doubled row; the pantheon rank is never read]')
append_to_line('**4.5 The exert decision and the moods.**',
  ' ' + TAG + ' — p(exert) is multiplied by `patronLean(…).act` for the exertion\'s own face (§10b); and `shame` gains one cause — an `exerted` week its own sworn god\'s reading condemns (`m ≤ −½`, §10b), one step on the same banded stock]')
replace_once('heard_of_party · line_held`), stored on `aim.reasons`.',
  'heard_of_party · line_held · keeps_the_faith`), stored on `aim.reasons` ' + TAG + ' — `keeps_the_faith`, §10b\'s reason word: the lean was among the three largest terms that raised the chosen aim; the page says "as her faith bids", never "her god wills"].')

# E11 §6.2 faith row
replace_once('a heretic lowers the creed it works against — the town\'s patron unless authored otherwise (DRAFT ×0.87); identity when none',
  'a heretic lowers the creed it works against — the town\'s patron unless authored otherwise (DRAFT ×0.87); identity when none ' + TAG + ' — a SWORN heretic\'s DEFAULT target skips its own god: where the town\'s patron is the god it is sworn to it works against no creed there by default; an AUTHORED `creedRef` still names its target — the DM\'s fallen one, who pays in its flock\'s regard and its `shame` (§10b); a saint\'s patron IS its `creedRef`; the multiplicands are unchanged]')

# E12 §7 values term
replace_once('its creed against the court\'s patron creed by `stanceOf`\'s consumed fields or RN\'s creed regard;',
  'its creed against the court\'s patron creed by `stanceOf`\'s consumed fields or RN\'s creed regard ' + TAG + ' — "its creed" is, for a paragon of ANY calling, its sworn god (`patronDeityOf`, §10b; a faith paragon\'s `creedRef` already is), read by this same test; an unsworn paragon of another calling brings no creed term];')

open(P, 'w', encoding='utf-8').write(t)
print('pass 1 ok', len(t.encode('utf-8')))
