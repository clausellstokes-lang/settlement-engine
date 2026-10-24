# Applies the cured design's host edits to COPIES of the code of record (read-only source),
# writing them under proto/; the counts of proto/ vs the originals are the measured budgets.
import os, sys
M = '/home/user/master-code-of-record'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'proto')
def edit(rel, pairs):
    src = open(os.path.join(M, rel), encoding='utf8').read()
    for old, new in pairs:
        assert src.count(old) == 1, (rel, old[:60], src.count(old))
        src = src.replace(old, new)
    dst = os.path.join(OUT, rel); os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf8').write(src)
# V-PA-1: the save id into HistoryTab, as a prop on the existing line (the file stands AT its 600 ceiling).
edit('src/components/OutputContainer.jsx', [(
 "case 'history':    return <HistoryTab settlement={s} narrativeNote={null}",
 "case 'history':    return <HistoryTab settlement={s} saveId={saveId} narrativeNote={null}")])
# V-PA-1: HistoryTab takes the save id and mounts the strip only off the player and public views.
edit('src/components/new/tabs/HistoryTab.jsx', [
 ("import React, { useState, useMemo } from 'react';",
  "import React, { useState, useMemo, lazy, Suspense } from 'react';\nconst RealmPastStrip = lazy(() => import('../../realmPast/RealmPastStrip.jsx'));"),
 ("      <NarrativeNote note={narrativeNote} />\n",
  "      <NarrativeNote note={narrativeNote} />\n      {realmPastStrip}\n"),
 ("publicDossier = false, playerView = false}) {",
  "publicDossier = false, playerView = false, saveId = null}) {"),
 ("  const {identityLines, foundedLine, recordLine} = historyDesk;",
  "  const {identityLines, foundedLine, recordLine} = historyDesk;\n"
  "  const realmPastStrip = (saveId && !playerView && !publicDossier) ? <Suspense fallback={null}><RealmPastStrip saveId={saveId}/></Suspense> : null;"),
])
# X-PA-4: the card takes its prefill as initial state.
edit('src/components/settlementDetail/SettlementDetailLinkNeighbourCard.jsx', [
 ("export default function LinkNeighbourCard({currentSave, allSaves, onLink}){",
  "export default function LinkNeighbourCard({currentSave, allSaves, onLink, initialPartnerId = null, initialRelType = 'neutral'}){"),
 ("const[selected,setSelected]=useState(null);",
  "const[selected,setSelected]=useState(()=>allSaves.find(s=>initialPartnerId!=null&&String(s.id)===String(initialPartnerId))||null);"),
 ("const[relType,setRelType]=useState('neutral');",
  "const[relType,setRelType]=useState(initialRelType);"),
])
# X-PA-4: the detail threads the prefill to the card.
edit('src/components/SettlementDetail.jsx', [
 ("  linking, setLinking,\n  editNamesOpen",
  "  linking, setLinking, linkPrefill = null,\n  editNamesOpen"),
 ("<LinkNeighbourCard currentSave={detail} allSaves={saves} onLink={handleLink}/>",
  "<LinkNeighbourCard currentSave={detail} allSaves={saves} onLink={handleLink} initialPartnerId={linkPrefill?.partnerId} initialRelType={linkPrefill?.relType}/>"),
])
# X-PA-4: the panel turns the route's request into the open toggle and the prefill, then drops it from the address.
edit('src/components/SettlementsPanel.jsx', [
 ("  const [linking, setLinking] = useState(false);",
  "  const [linking, setLinking] = useState(false);\n  const [linkPrefill, setLinkPrefill] = useState(null);"),
 ("  // ── Link ────────────────────────────────────────────────────────────────\n",
  "  // ── Link ────────────────────────────────────────────────────────────────\n"
  "  useEffect(() => {\n"
  "    const q = new URLSearchParams(window.location.search);\n"
  "    if (!detail?.saveData?.id || !q.get('linkTo')) return;\n"
  "    // eslint-disable-next-line react-hooks/set-state-in-effect\n"
  "    setLinkPrefill({ partnerId: q.get('linkTo'), relType: q.get('linkAs') || 'neutral' });\n"
  "    setLinking(true);\n"
  "    navigate('settlements', { params: { id: String(detail.saveData.id) }, replace: true, scroll: false });\n"
  "    // eslint-disable-next-line react-hooks/exhaustive-deps\n"
  "  }, [detail?.saveData?.id]);\n"),
 ("      linking={linking} setLinking={setLinking}\n",
  "      linking={linking} setLinking={setLinking} linkPrefill={linkPrefill}\n"),
])
print('ok')
