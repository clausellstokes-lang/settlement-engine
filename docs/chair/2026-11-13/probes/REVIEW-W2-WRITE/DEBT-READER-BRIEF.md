# Debt reader brief (REVIEW-W2-WRITE, part 2)
You read for an independent reviewer of a fantasy-settlement generator. You change nothing in any repository; you write ONE file.
Input: /home/user/rw/debt-corpus-now.json — the earlier cold list's corpus-owned false lines (fields: n, town, tab, sev, status,
sentence = the OLD false sentence, fact = why it was false, run = a fixed run of its words, atMbase = it printed before the lane's
writing, atTip = the whole old sentence still prints at the tip, runAtTip = its fixed run still prints, tipNewInTab = every sentence that
prints in that same tab at the tip and did NOT print there before the lane's writing: the candidates for "what the page says in its place").
Pages: /home/user/rw/rw3-tip/dumps/<town>.txt (tip) and /home/user/rw/rw3-mbase/dumps/<town>.txt (before the lane's writing); lines
"== Group/Tab ==" start a view. Records (the truth): /home/user/rw/rw3-tip/records/<town>.json (large: query by script, never print whole).
Source of the corpus: /home/user/rw/tip/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md (a line's tag in backticks lists its conditions).
Do NOT open anything under docs/chair/ in any tree.
Your entries: those with sev "MED" (do NOT redo the HIGH ones). For EACH:
1. Is the old false sentence still on the page at the tip (whole, or its false claim in other words)? Read the tab at the tip.
2. If gone: which sentence(s) in tipNewInTab took its place (the same pool's slot; judge by meaning and position), and is each TRUE of the
   town by its record and the rest of its own page? If none took its place, say "silent" and confirm nothing false now sits there.
3. Verdict, one of: "cured, true" (gone; what prints in its place is true) · "cured by silence" (gone; nothing in its place, nothing false) ·
   "reworded, still false" (gone, but its replacement carries the same or a new false claim) · "still prints" (old sentence or its false
   claim still prints) · "not reachable" (the town/tab no longer has it for a reason that is not the lane's; say why).
Write /home/user/rw/debt-med-read.json: a JSON array, one object per MED entry:
{"n":..,"town":"..","verdict":"..","replacement":"<the sentence now in its place, verbatim, or ''>","replacementTrue":true|false|null,
 "why":"<the record path and value, or the page line, that settles it>"}
Validate it parses with node. Be exact: a false sentence you call true is the costly error. Final message: the count by verdict, and the
three you are least sure of.
