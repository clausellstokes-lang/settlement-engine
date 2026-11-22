import shutil
R = '/home/user/settlement-engine/.claude/worktrees/wiring/'
S = R + "docs/chair/2026-11-20/content/page/build/CAUSES-WIRING-2/"
shutil.copy(S + 'tensionShown.wired.js.txt', R + 'src/domain/display/tensionShown.js')

def edit(rel, pairs):
    p = R + rel
    s = open(p).read()
    for old, new in pairs:
        assert s.count(old) == 1, (rel, old)
        s = s.replace(old, new)
    open(p, 'w').write(s)

edit('src/components/new/tabs/OverviewTab.jsx', [
    ("import { tensionSidesShown } from '../../../domain/display/tensionShown.js'; // PAGE-9 SIDES: a tension's sides through the one reader",
     "import { tensionSentenceShown, tensionSidesShown } from '../../../domain/display/tensionShown.js'; // PAGE-9 SIDES: a tension's sides through the one reader; CAUSES-WIRING-2: its sentence too"),
    ("margin:0}}>{typeof t==='object'?t.description:t}</p>",
     "margin:0}}>{typeof t==='object'?tensionSentenceShown(r,t):t}</p>"),
])
edit('src/components/new/tabs/HistoryTab.jsx', [
    ("// PAGE-9 SIDES: a tension's sides are printed through the one reader, from the document this tab was given.\nimport { tensionSidesShown } from '../../../domain/display/tensionShown.js';",
     "// PAGE-9 SIDES: a tension's sides are printed through the one reader, from the document this tab was given;\n// CAUSES-WIRING-2: and its sentence (the cause sentence where its kind has a table, else the stored description).\nimport { tensionSentenceShown, tensionSidesShown } from '../../../domain/display/tensionShown.js';"),
    ("<MentionText text={typeof t==='object'?t.description||t.issue||t.type:String(t)}/>",
     "<MentionText text={typeof t==='object'?tensionSentenceShown(settlement,t)||t.issue||t.type:String(t)}/>"),
])
vm = 'src/pdf/lib/viewModel.js'
p = R + vm
s = open(p).read()
old_imp = "import { tensionSidesShown } from '../../domain/display/tensionShown.js'; // PAGE-9 SIDES: a tension's sides through the one reader"
assert s.count(old_imp) == 1
s = s.replace(old_imp, "import { tensionSentenceShown, tensionSidesShown } from '../../domain/display/tensionShown.js'; // PAGE-9 SIDES: a tension's sides through the one reader; CAUSES-WIRING-2: its sentence too")
n = s.count("    description: t?.description,\n    parties: tensionSidesShown(active, t),")
assert n == 2, n
s = s.replace("    description: t?.description,\n    parties: tensionSidesShown(active, t),",
              "    description: tensionSentenceShown(active, t),\n    parties: tensionSidesShown(active, t),")
o3 = "      description: t?.description,\n      parties: tensionSidesShown(active, t),"
assert s.count(o3) == 1
s = s.replace(o3, "      description: tensionSentenceShown(active, t),\n      parties: tensionSidesShown(active, t),")
open(p, 'w').write(s)
print('wired')
