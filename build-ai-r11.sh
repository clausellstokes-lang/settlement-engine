#!/bin/sh
# build-ai-r11.sh — chair (session b43943b4, 2026-09-07 03:12): ONE command that builds ai r11 = the verify-only pass over the
# critic-named SKIPPED_TRIAGE rows (sweep/untriage-ai.json, two readers + a reconciler, wf_36047b28-91e) + the ONE new FIND angle the
# owner GO'd at 02:20 (sweep/extra-ai-procgen.json) → regrade → synth → critic. Nothing is launched; it prints the Workflow call.
# ⛔ TIMING LAW (chair JUDGMENT 03:02, refining the 02:1x "no run alive" rule by mechanism): the `summary` step rewrites kept-/merged-/
# partial-/state-<name>.json for EVERY sweep; a running research workflow reads those only in its REGRADE and SYNTH/CRITIC stages
# (its chunk verifiers read sweep/chunks/<name>-NN.json, which this script rewrites for `ai` ONLY). So this runs while the live runs are
# in their VERIFY stage and REFUSES if any live journal already shows a regrade/synth/critic agent (override: FORCE=1, only when every run is dead).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
K=$SC/prose-research; S=$K/sweep; W=/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/b43943b4-3b40-4fd9-bc63-9b9c9afb55b4/subagents/workflows
cd $K || exit 9
[ -f $S/untriage-ai.json ] || { echo "REFUSED: $S/untriage-ai.json does not exist yet (the extraction workflow writes it)"; exit 8; }
if [ "$FORCE" != "1" ]; then
  for j in $W/wf_43d098bf-eff/journal.jsonl $W/wf_543ddb3b-67c/journal.jsonl; do
    [ -f "$j" ] || continue
    if grep -qE '"label":"(regrade|synth|critic)' "$j" && ! grep -q '"type":"complete"\|"type":"done"\|"type":"return"' "$j"; then echo "REFUSED: $(basename $(dirname $j)) is past its VERIFY stage (a regrade/synth/critic agent is in its journal) — wait for it to complete, then FORCE=1 only if it is dead"; exit 8; fi
  done
fi
echo "== $(date) build ai r11 =="
echo "--- dry run:"; python3 $S/untriage.py ai || { echo "REFUSED by untriage.py (dry)"; exit 8; }
echo "--- apply:"; python3 $S/untriage.py ai --apply || exit 8
echo "--- merge ai only (no cross-sweep summary):"; node sweep-state.mjs merge ai --update-state | cut -c1-400
echo "--- mk-round ai r11 (no --triage, no angles):"; python3 $S/mk-round-one.py ai r11 --prev $S/args-ai-r10.json --cap 4 | tail -3
python3 - <<'PY'
import json,os
S='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep'
p=f'{S}/args-ai-r11.json'; a=json.load(open(p)); prev=json.load(open(f'{S}/args-ai-r10.json'))
a['extraAngles']=json.load(open(f'{S}/extra-ai-procgen.json'))          # the owner's GO of 02:20 — mk-round drops it unless passed via --extra
a['findAngles']=[]
a['regrade']=True; a['regradeTag']='r11'
a['regradeNotes']=(prev.get('regradeNotes') or '')+"\n\nR11 REGRADE (the r10 critic of 02:10, §5 and §7 Round A, under the owner's 01:45 delegation — the verify-only pass): [72] Mikros: regrade to VERIFIED_SUBSTANCE on the two figures (stTTR 47.79 vs 34.62) and the overlap finding from sweep/mikros-fqaf035.txt, or PARTIAL if the function-word limb is kept (§5.E). [15]–[20], [24]: regrade at the full texts arxiv.org/html/2309.14556v3 Table 5 and arxiv.org/html/2411.02316, or downgrade [13], [14] to match (§5.F). [1184] and [1183]: the AI authorship of the detention memorandum is Rettberg's INFERENCE from the glitch and the same post's first example was withdrawn ([1186]) — grade the 'measured in a legal record' limb PARTIAL as 'suspected' unless the provenance is verified (§5.B); likewise [1201], [1198], [1203], [956], [957], [1014]–[1016], [940]–[951]: 'suspected', not 'measured'. [1321]: it is a proposal page (a rough draft by user Ca, 2026-06-06), not 'the policy's own statement' — PARTIAL on that limb (§5.C). [1337], [1338]: the population is 178 Pangram-flagged STUDENT articles of 3,078 — carry the denominator in the note (§5.I). [1432] vs [1437]: different measurements (abstract corpus vs Table 1 test set) — note it (§5.J). [187]: NOT_FOUND on the full article — retire it (CONTRADICTED at that URL) unless the tell is found in Preston's n+1 essay (§5.M). [73] Bakhshi: the date mismatch is arXiv's own page — close the 'unresolved' note, keep the grade (§5.H). Relays [815], [816], [1288], [916], [594], [595], [870], [871], [1388], [1499], [739], [1094]: keep their grades but mark 'relay' in the note so the synth can print the split (§5.D)."
a['synthNotes']=(prev.get('synthNotes') or '')+"\n\nR11 SYNTH (the r10 critic of 02:10; the owner's 02:20 GO on the procgen angle; the 09-06 latent-grammar ruling): (1) THE PROCEDURAL-GENERATION BASELINE gets its OWN PART (a new feature or features), each finding stated with the REGISTER it was measured in (a generator's possibility space, a game's generated history, a level generator's expressive range) — this is the only literature that measured sameness in the program's own architecture (typed pools, seeded choice) rather than in a language model; connect it explicitly to the owner's 09-06 ruling that the structure is a latent grammar, never a visible template (Compton's perceptual differentiation vs mathematical uniqueness IS that problem), to feature 6's 'where do our dossiers sit in the space of possible dossiers' (Smith & Whitehead's expressive range is its name), and to Grinblat/Bucklew's and Ryan's mechanisms for making generated histories read as particular. (2) The verify-only pass's newly verified rows (Herbold, HC3, Nguyen/Schaeffer, the G15 live policy, Sato's word list, the worldbuilding-community rows, Dahl, the Kugel rows…) are cited where each feature's rule needed its witness — feature 37's table stops reading 'not verified, not citable' wherever a row now is; features 31/32 hold BOTH sides of the min-p dispute (Nguyen et al. and Schaeffer et al.) and say what the dossier's rule does with the disagreement. (3) Fix the six contradictions of the critic's §6 and say where. (4) The Part F two-column table marks suspicion-based rows 'suspected', never 'measured'. (5) Print a Supported-by N that EXCLUDES relays, readers, vendors and non-LLM rows beside the inclusive N. (6) Carry the population on [1337]/[1338] into the text. (7) Feature 11's [R] is still by substitution (no row measures sentence-length variance) — say so; if Herbold [1295] verified, cite its sentence-length table as the one record-adjacent measurement. (8) The random adversarial second pass over ≥17 unsuspected kept rows remains OWED (three rounds) — state it in the coverage table as owed, do not claim it."
json.dump(a,open(p,'w'),ensure_ascii=False)
print('args-ai-r11.json set: chunks',len(a.get('chunks') or []),'extraAngles',[e['key'] for e in a['extraAngles']],'regrade',a['regrade'],'cap',a['cap'],'regradeNotes',len(a['regradeNotes']),'synthNotes',len(a['synthNotes']))
PY
echo "--- embed:"; python3 mk-embedded.py $S/args-ai-r11.json | tail -1
echo "READY: Workflow({scriptPath: '$S/embedded/research-workflow-v3--ai-r11.js'}) — launch when a research slot frees; then record in LAST-RUNS.json (tag r11)."
