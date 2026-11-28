# SURVEY-FINAL STATE (S-A "THE FINAL RECORD"; branch lane/survey-final-wip-2026-11-28, cut at 777733a2a)
- S-A built and accepted (b93768295). S-A-3 (170b26cdd): a DM-edited description is never re-answered (walkUserEdits).
- S-A-2: the stored lines are gated ONCE on the caller's thread (`display/printRecord.js :: printRecordOf`): the PDF
  export, Foundry (SettlementDetail), the campaign and world books (CampaignFolder), the Tonight sheet and search on
  screen; `collectPlotHooks` takes its gate injected (`collectPlotHooksShown`). Guard: tests/lint/finalLinesPrintGate.
- PROVEN: 55 towns, owner tab = PDF = Foundry = campaign book (0 differ; 3,753 descriptions, 3,951 hooks); PDF worker
  3,148,689 -> 3,148,821 B (+132); first paint +17 B; boot smoke PASS.
- OPEN, NAMED: writerReach red since ccbc2582b (two identities become READ: a shrink by its --write door; not
  re-recorded, the chair's word asked). verify:dist red on the base too.
- NEXT: "TIP?" sent; wait for the chair's word.
