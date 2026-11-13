# REVIEW-POWERS-3 plants.py — PLANT=<tip worktree copy> OUT=<dir> python3 plants.py [name ...]
# One plant per guard the stage added or changed: each puts the stage's cure back to the base's behaviour (or breaks it)
# in ONE place, runs the stage's guard files, records which files red, and restores the file from git.
import json, os, subprocess, sys
P = os.environ['PLANT']; OUT = os.environ['OUT']; os.makedirs(OUT, exist_ok=True)
GUARDS = """tests/components/legitimacyPlainWords.test.jsx tests/data/dmPowerLinesPossessive.test.js tests/data/midwifeHonorific.test.js
tests/domain/dossier/criminalHouseNoDefault.test.js tests/domain/people/patronageStyledTitle.test.js tests/domain/people/seatKeeperStyledName.test.js
tests/generators/conflictRulingIssue.test.js tests/generators/headOfItsPowerRow.test.js tests/generators/nobleLineNamesTheSeat.test.js
tests/generators/npcStructureHouseKind.test.js tests/generators/people/lordNotGovernment.test.js tests/generators/people/mintedFaceUnderworld.test.js
tests/generators/people/styledTitleOnRows.test.js tests/generators/people/titleLineDisqualifiers.test.js tests/generators/power/sovereignNoCrown.test.js
tests/generators/power/standingAgainstFigure.test.js tests/generators/powerDescClaimLabel.test.js tests/generators/stewardNoteReadsWhole.test.js
tests/generators/stressFactionNames.test.js tests/generators/regenPreservesUserCanon.test.js tests/generators/npcStructureWantsVoiceable.test.js
tests/components/powerTabSupport.test.jsx tests/components/powerGovernanceAccount.test.jsx""".split()
PLANTS = {
 'none': [],
 'breakdown-tab': [('src/components/new/tabs/PowerTab.jsx', "              {leg.governanceFractured && (", "              {Object.entries(leg.breakdown || {}).filter(([, v]) => Number(v) !== 0).length > 0 && (<div>Breakdown<div>{Object.entries(leg.breakdown || {}).filter(([, v]) => Number(v) !== 0).map(([k, v]) => <div key={k}>{k.charAt(0).toUpperCase() + k.slice(1)} {v > 0 ? `+${v}` : v}</div>)}</div></div>)}\n              {leg.governanceFractured && (")],
 'breakdown-pdf': [('src/pdf/sections/PowerStructure.jsx', "          tone={legitTone(p.legitimacy.score)}\n", "          tone={legitTone(p.legitimacy.score)}\n          breakdown={p.legitimacyBreakdown}\n")],
 'possessive-rank3': [('src/data/people/dmPowerLines.js', "and carries ${powerPossessive(f.power)} requests", "and carries ${f.power}'s requests")],
 'possessive-captured': [('src/data/people/dmPowerLines.js', "A case that touches ${powerPossessive(criminalsOf(f))} business", "A case that touches ${criminalsOf(f)}'s business")],
 'midwife': [('src/data/faceHonorifics.js', '"the midwife": ["Midwife", { male: "Goodman", female: "Goodwife" }]', '"the midwife": ["Midwife", "Goodwife"]')],
 'criminal-house-default': [('src/domain/dossier/powerSupport.js', "if (list.length === 0 && ruler && !isCriminalInstitution(inst))", "if (list.length === 0 && ruler)")],
 'patronage-styled': [('src/domain/people/patronage.js', "title: String(styledTitleOf(card.title ?? card.role ?? '', card.gender)),", "title: String(card.title ?? card.role ?? ''),")],
 'keeper-styled-bare': [('src/domain/people/seatKeeper.js', "return form ? `${form} ${String(keeper.name || '')}` : String(keeper.name || '');", "return String(keeper.name || '');")],
 'keeper-styled-doubled': [('src/domain/people/seatKeeper.js', "return form ? `${form} ${String(keeper.name || '')}` : String(keeper.name || '');", "return form ? `${form} ${String(keeper.name || '')}, ${String(keeper.title || '')}` : String(keeper.name || '');")],
 'ruling-issue-text': [('src/generators/power/conflictIssues.js', "issue: 'A ruling that one power refuses to obey'", "issue: 'A ruling one power refuses to obey'")],
 'ruling-issue-hookkey': [('src/generators/power/conflicts.js', "::${conflict?.id ?? conflict?.issue}`", "::${conflict?.issue}`")],
 'under-row': [('src/generators/npcStructure.js', "    if (!isHolder && UNDER_KINDS[cat] && standing.standing === STANDING.head && rank === 'subordinate') return { ...npc, structuralRank: standing.standing };\n", "")],
 'under-kinds-dominant': [('src/generators/npcStructure.js', "HOUSE_KINDS[cat] || UNDER_KINDS[cat]) ? 'dominant'", "HOUSE_KINDS[cat]) ? 'dominant'")],
 'house-kinds': [('src/generators/npcStructure.js', "headsItsKind(standing, powerFactions, HOUSE_KINDS[cat] || UNDER_KINDS[cat]) ? 'dominant' : ", "headsItsKind(standing, powerFactions, UNDER_KINDS[cat]) ? 'dominant' : ")],
 'noble-council': [('src/generators/power/rulingStructure.js', "['Town Council', 'City Council', 'Grand Council'].includes(String(governingFaction || ''))", "true")],
 'lord-government': [('src/data/stressPowerFaces.js', "role: 'Duke/Duchess', category: 'other', titleKey: 'noble' }", "role: 'Duke/Duchess', category: 'government', titleKey: 'noble' }")],
 'minted-underworld': [('src/generators/people/castPowers.js', "      if (card.secret && typeof card.secret === 'object') card.secret = { ...card.secret, what: withTownsOwnUnderworld(card.secret.what, crime.signal, crime.faction) };\n", "")],
 'underworld-names-power': [('src/domain/crimeSignal.js', ".replace(new RegExp(CRIMINAL_GUILD, 'gi'), 'the local underworld')));", ".replace(new RegExp(CRIMINAL_GUILD, 'gi'), String(crimeFaction || 'the local underworld'))));")],
 'ties-role': [('src/generators/people/ties.js', "npc1Role: styledTitleOf(from.role, from.gender),", "npc1Role: from.role,")],
 'refresh-role': [('src/generators/generateSettlementPipeline.js', "npc1Role: first?.role != null ? styledTitleOf(first.role, first.gender) : rel.npc1Role,", "npc1Role: first?.role ?? rel.npc1Role,")],
 'title-lines': [('src/generators/people/representatives.js', "    settleTitleLines(card, title, titleTown);", "    void settleTitleLines;")],
 'sovereign-vignette': [('src/generators/power/governingStressVignettes.js', "const sovereign = (institutionNames || []).some(", "const sovereign = false && (institutionNames || []).some(")],
 'sovereign-factions': [('src/generators/power/stressFactions.js', "sovereign = (institutions || []).some(", "sovereign = false && (institutions || []).some(")],
 'standing-level': [('src/generators/power/factionStanding.js', "? (standing = topTwoGap <= 5\n", "? (standing = true\n")],
 'standing-host': [('src/generators/power/rosterText.js', "const host = !before.get(name) && f?.contestsNiche ? String(f.contestsNiche) : null;", "const host = null;")],
 'standing-figures': [('src/generators/power/rosterText.js', "    const desc = String(f.desc || '');\n    const base = desc === old.standing", "    { const onPage = new Set(finalRoster.map((x) => x.faction)); const goneN = annotated.map((x) => x.faction).filter((n) => !onPage.has(n)); if (old.rank === now.rank && !goneN.some((n) => old.standing.toLowerCase().includes(String(n).toLowerCase()))) return f; }\n    const desc = String(f.desc || '');\n    const base = desc === old.standing")],
 'claims': [('src/generators/power/rulingStructure.js', "  settleClaimsToLabel(factions, tier);", "  void settleClaimsToLabel;")],
 'claims-minor-only': [('src/generators/power/claimStanding.js', "if (label !== 'Minor' && label !== 'Suppressed') continue;", "if (label !== 'Minor') continue;")],
 'steward-note': [('src/generators/power/factionStanding.js', "each would say it does.'", "both would say themselves.'")],
 'sovereign-plumbing': [('src/generators/power/governanceNarrative.js', "      institutionNames, // COHERENCE-POWERS-7: the roster's names, for the independent polity's crown\n", "")],
 'infiltrator': [('src/generators/power/stressFactions.js', "'An external interest with its own people placed inside the settlement. Its presence", "'An external interest with embedded assets in at least two powers. Its presence")],
}
names = sys.argv[1:] or list(PLANTS)
res = {}
for name in names:
    edits = PLANTS[name]; files = sorted({e[0] for e in edits})
    ok = True
    for f, old, new in edits:
        p = os.path.join(P, f); s = open(p).read()
        if s.count(old) != 1: print(name, 'PLANT DOES NOT APPLY', f, s.count(old)); ok = False; break
        open(p, 'w').write(s.replace(old, new))
    if ok:
        rep = os.path.join(OUT, f'{name}.json')
        subprocess.run(f'cd {P} && npx vitest run --maxWorkers=2 --reporter=json --outputFile={rep} {" ".join(GUARDS)} > {OUT}/{name}.log 2>&1', shell=True)
        try:
            j = json.load(open(rep)); red = {}
            for t in j['testResults']:
                fails = [a['fullName'] for a in t['assertionResults'] if a['status'] == 'failed']
                if t['status'] != 'passed': red[os.path.relpath(t['name'], P)] = fails[:6] or [t.get('message', '')[:200]]
            res[name] = {'red_files': red, 'passed': j['numPassedTests'], 'failed': j['numFailedTests']}
        except Exception as e:
            res[name] = {'error': str(e)}
        print(name, json.dumps({k: list(v) for k, v in res[name].get('red_files', {}).items()}) if 'red_files' in res[name] else res[name], flush=True)
    subprocess.run(['git', '-C', P, 'checkout', '--', *files])
    d = subprocess.run(['git', '-C', P, 'status', '--short', '--', 'src'], capture_output=True, text=True).stdout.strip()
    if d: print('RESTORE FAILED', d); sys.exit(1)
json.dump(res, open(os.path.join(OUT, 'plants.result.json'), 'a'), indent=1)
