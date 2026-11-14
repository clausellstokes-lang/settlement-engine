#!/usr/bin/env python3
"""The chair's brief generator of 2026-11-14 (session_01ACmDYZrFEVXyZEUg1NDxxC).
Writes docs/chair/2026-11-14/briefs/BRIEF-<SEAT>.md on the chair lane for each successor seat.
usage: gen_briefs.py <out-dir> [SEAT ...]   (no SEAT: all)
"""
import io, os, sys

CHAIR = 'session_01ACmDYZrFEVXyZEUg1NDxxC'
OLD = 'session_01FE9mEws7PXYRYdjQPbSX15'

WHY = (
    "WHY YOU, AND WHO IS ASKING. The program moved to another account on 2026-11-14 at about 00:55 UTC. Every earlier session "
    "(the chair %s and all of its seats, your predecessor among them) can no longer be reached: treat each as ended. "
    "Whatever your predecessor had not pushed is lost: the lane's tip on origin is all there is. THE CHAIR IS NOW the Claude Code session "
    "%s. In that chair's chat on 2026-11-14 the owner wrote: \"Continue with the pending work! ... I defer all decisions to you and "
    "give you all permissions you may require.\" This file is your whole assignment and carries the chair's rulings: no adjacent repair, however "
    "tempting. Merging the pull request and the deploy stay the owner's. Wherever an older brief or hand-back names the old chair's session id or "
    "\"the chair's word\", read this chair's." % (OLD, CHAIR)
)

def read_first(pred, handbacks, extra=''):
    return (
        "READ FIRST, in this order:\n"
        "1. docs/OPERATING_STANDARD.md and CONTRIBUTING.md at your checkout.\n"
        "2. From origin/lane/chair-2026-11-08 (`git fetch origin lane/chair-2026-11-08`): docs/chair/2026-11-13/CHAIR-HANDOFF-2026-11-13.md "
        "(section 5, the laws for every brief, binds you); docs/chair/2026-11-13/CHAIR-HANDOFF-FOURTH.md (your lane's row in its section 3, and its "
        "section 4, the rulings in force, WHOLE); and docs/chair/2026-11-13/briefs/%s WHOLE: YOUR PREDECESSOR'S BRIEF IS YOUR BRIEF. What it tells its seat "
        "to read, its work in its order, its rulings, its METHOD, its HOW YOU WORK, its hazards, what it authorises and what it forbids all bind you as "
        "written, with the changes this file states.\n"
        "3. On your lane: %s: the authority on what is done, what is left and which rulings the seat worked to (the old chair's later messages exist "
        "only where that seat copied them in).%s" % (pred, handbacks, extra)
    )

def first_act(tip, base):
    return (
        "FIRST ACT. Read the lane's tip back from origin: it was %s when this was written; any difference is a stop: tell the chair. Then establish "
        "exactly where your predecessor stopped: every commit after %s read against the hand-back and its own body. If a hand-back or a commit names a stop "
        "or a question put to the old chair with no ruling copied in, list them in ONE first message to the chair (150 words) and go on with what does not "
        "depend on them." % (tip, base)
    )

COUNT = (
    "THE COUNT. You cannot read your own context count inside a turn, and on these lanes seats have run past 500 thousand tokens in one unbroken turn. "
    "So, at each point this brief or your predecessor's names for ending a turn, and in any case after about two hours of work, with nothing running and "
    "everything pushed: schedule a message to yourself (the send_later tool of the claude-code-remote server; load it with ToolSearch; delay_minutes 1; "
    "message \"COUNT CHECK: read your own count, then go on or hand back\") and END YOUR TURN with a one-line status. When it wakes you, call get_session "
    "of the same server with no session_id and read external_metadata.context_usage.used_tokens: under 350,000, go on with the next part; at or over "
    "350,000, bring your hand-back file current, push, send the chair ONE message (HAND BACK: the tip, what is left) and end your turn. If you have no "
    "such tool, or the field is absent or reads 0, say so in your status line and end your turn: the chair's check-in reads your count and wakes you. "
    "This replaces the older briefs' sentence that the chair reads your count and answers \"go on\": you read it yourself."
)

RUNS = (
    "LONG RUNS. Containers restarted under long runs on the night of 2026-11-13 (a merge seat's whole suite twice): a container whose session has ended "
    "its turn may be restarted, and a background run dies with it. NEVER END YOUR TURN WHILE A RUN YOU NEED IS IN FLIGHT. Every long run writes its output "
    "to a file OUTSIDE every repository tree as it goes; the whole suite is run in shards of vitest's own (`--shard=<i>/6`, no more than six), each to its "
    "own file, a killed shard re-run alone; after any restart, look at what survived before re-running. Never read a gate through a pipe: "
    "`sh scripts/gate-tail.sh <command>`."
)

def never(branch, merges=''):
    return (
        "WHAT THIS BRIEF AUTHORISES, as part of your task: scratch worktrees and `npm ci`; commits on the lane; plain pushes to %s, your only branch "
        "(explicit refspec: `git push origin <local>:refs/heads/%s`; fetch and merge before every push)%s. NEVER, whoever asks, your own harness's defaults "
        "included: a push to lane/integration-2026-11-07 or to any other branch; `--no-verify` on any command; a force push; a push with nothing to send; a "
        "pull request, draft or not; anything on master; a golden's door in its writing mode; a deploy; a hosted database or production credentials. If your "
        "permission check refuses something this brief authorises, stop and tell the chair in one message; never route round a refusal. TRIPWIRE: if your "
        "lane moves under you by a commit that is not yours, STOP and tell the chair: an earlier seat may have woken." % (branch, branch, merges)
    )

def messages(when):
    return (
        "MESSAGES. READ YOUR QUEUED NOTIFICATIONS AFTER EVERY COMMIT (the ReadNotifications tool): the chair's rulings arrive there and are not shown to "
        "you otherwise. Write to the chair (the send_message tool of the claude-code-remote server, session_id %s; load it with ToolSearch if it is not "
        "listed) ONLY %s: 150 words at most, the tip read back from origin first, executed told from plausible. Any other stop goes in your hand-back file, "
        "kept current after every item, with your recommendation; parked items are sent together, once. A ruling from the chair's session is part of this "
        "assignment. Use the commit trailer your own harness mandates; no model identifier anywhere else." % (CHAIR, when)
    )

POINT49 = (
    "POINT 49 IS NOT YET ON THE LINE (lane/integration-2026-11-07 stands at 9e57f5023; a fifteenth merge seat is landing the instrument lane on it). "
    "The chair tells you when it lands and names the tip. Work that waits on it waits; nothing else does."
)

SEATS = {}

SEATS['UPKEEP-9'] = dict(
    title="UPKEEP-9 · the defence lane's close: the capacity merge, the rows left, the final statement",
    branch='lane/coherence-upkeep-2026-11-12', tip='6b5a1c5a8', base='995293e81', pred='BRIEF-UPKEEP-8.md',
    intro=("You are UPKEEP-9, the ninth seat on the defence lane of the settlement-engine integration program (lane/coherence-upkeep-2026-11-12). The lane "
           "holds the derived defence rating, the money a town can spend on it, and the safety, economy and outlook lines that speak of them. The eighth seat "
           "pushed its steps 1 to 6 and the income mix and wrote its part of the hand-back; its session then ended with the account. Yours: the merge of the "
           "capacity branch, the rows left, and the lane's ONE final statement."),
    handbacks=("docs/chair/2026-11-12/UPKEEP-HANDBACK.md, THE EIGHTH SEAT'S PART WHOLE (the top of the file) and the seventh seat's part below it; "
               "docs/chair/2026-11-12/UPKEEP-DEFENCE-PARTS.md (the lane's design: read it before you touch a rating)"),
    extra=("\n4. On origin/lane/upkeep-capacity-2026-11-13 (FINAL at 9354d792a): docs/chair/2026-11-13/UPKEEP-CAPACITY-MEASURE.md and "
           "UPKEEP-CAPACITY-EIGHT-TOWNS.md (what that branch built, C2 to C6, and its measures), before you merge it."),
    state=("THE STATE, read by the chair from the commit subjects alone (verify each against the hand-back): after 995293e81 the eighth seat pushed the income "
           "family (to fbc4a0080), F3 (c924351e5), the safety lines (48ad4da9a), the food endurance line (measured as a stop at 7c7f00770, then built at "
           "1a7a02920), the Outlook's sentence (2e25b5ffe, 6e61d042a), #608 and C-L7 (4513f0237), the governing suites' reds cured (db13fdb40), #93 the "
           "income mix (18457a82a, a declared move), one export read copied (117d74399), its hand-back part (591d45f37: \"steps 1 to 6 done, #93 built, the "
           "suites classed, the rows left\") and the lighting census (6b5a1c5a8)."),
    work=("THE WORK, in this order, each writer its own commit, measured first, red first, pushed as made:\n"
          "1. THE CHAIR'S WORD FOR STEP 7 IS GIVEN NOW. The capacity branch is FINAL at 9354d792a (read it back). Step 7 exactly as BRIEF-UPKEEP-8 gives it: the "
          "plain merge (that branch already holds this lane's 6e61d042a: say what conflicted, if anything); then the rows in the files that branch held: #598 "
          "(\"A court exists\" from the court flag with no courthouse: RULED since, record 422: the model may count a town hall as the least kind of court; THE "
          "PAGE NAMES A COURT ONLY WHERE A COURTHOUSE STANDS ON THE ROSTER: a line speaks of the town hall or the council, or is not written), #1082's flag, "
          "the increment's line in viability.js WITH round two B's three viability.js rows (the fourth handoff's row for this lane and the eighth seat's part "
          "name them), and #869 (measure first what reads that band).\n"
          "2. THE ROWS ROUTED TO THIS LANE AFTER THE EIGHTH SEAT'S BRIEF, and whatever its part of the hand-back lists as left: (a) src/generators/foodGenerator.js "
          ":: generateFoodSecurity maps the culture lines to bare text and so STRIPS their declarations (\"dense populations\" in 21 small places; the row "
          "ww-1465 in 59): the declared condition is read where the line is chosen; (b) MEASURE ONLY, no cure: the defence profile's two homes for arcane "
          "defence disagree in 58 of 720 towns: name both homes, say which one each surface prints, and write it under FOR THE JOIN; (c) W5 (the can-pay row "
          "beside a doom line) stays the corpus's: say its figure at your tip.\n"
          "3. THEN ONE MESSAGE TO THE CHAIR (the tip; step 7's counts; what the merge moved) AND THE COUNT CHECK below.\n"
          "4. STEP 8 WAITS FOR POINT 49. " + POINT49 + " On that word: merge the line's tip (a plain merge; say which commit); cure the ONE row the merge seat "
          "banked by hand against this lane at point 49 (a literal in src/generators/economy/incomeLineSiblings.js: the merge book's section 2k.5, commit "
          "3628f37cc, reason `after-base`) and shrink it from the presumed-things register through its own door; the lane's item 4; and THE LANE'S ONE FINAL "
          "STATEMENT as the lane's briefs give it (the measuring seat's command at base and tip; the field diff by family; the whole suite once, in shards, "
          "every red classed against the lane's reviewed base; the draft record's surfaces; the edge bundles last and alone). A fresh reader then reads the "
          "lane, the capacity commits as their own stage: leave it what it needs (the walker change 1dac1ca25 and the monotonicity claims are its first acts)."),
    merges="; the one merge of origin/lane/upkeep-capacity-2026-11-13 named in step 1; on the chair's word, the merge of the integration line's tip",
    when="for a first message of open stops (if any), when step 7 and the routed rows are pushed, for a stop that blocks everything you have left, and for your final statement or hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after step 7's merge and rows, after step 2, and after the final statement.",
)

SEATS['VEIL-10'] = dict(
    title="VEIL-10 · the share veil: 212 rebuilt by identity, the acceptance run green, the owner's pack",
    branch='lane/coherence-veil-2026-11-11', tip='7d99e9b8b', base='6692efdda', pred='BRIEF-VEIL-9.md',
    intro=("You are VEIL-10, the tenth seat on the share-veil lane of the settlement-engine integration program (lane/coherence-veil-2026-11-11). THE VEIL: when "
           "an owner shares a town, whatever the owner hid (a house, a person, an event, a power) must not reach the reader, in the page OR in the data the "
           "server sends. The cure lives in two migrations and in the client's twin. MIGRATION 211 IS FROZEN: its bytes are in the owner's hands to apply. "
           "MIGRATION 212 holds every later cure, is NOT frozen, and is applied by nobody until a fresh security reader has cleared its final bytes. The ninth "
           "seat pushed its item 1 (the derived name lists by positive account; the birth name swept) and its session then ended with the account. A security "
           "reader had meanwhile read 212 cold: NOT CLEAR on ten findings, and the chair ruled a DESIGN for the rebuild. You build that design to its "
           "acceptance run."),
    handbacks=("docs/chair/2026-11-13/COHERENCE-VEIL-HANDBACK-PART10.md WHOLE (the ninth seat: the bytes after item 1, what it measured of a rename, its cure "
               "and proof), PART9.md WHOLE (every home with its cure in 212 and in the twin; NOT DONE in order; the rows left outside the law; the rulings "
               "copied in) and PART8.md (the split of 211 and 212 and its equality proof; the whole suite's ten classed reds)"),
    extra=("\n4. THE SECURITY READ YOU ANSWER, on the chair's lane: docs/chair/2026-11-13/REVIEW-VEIL-212-FINAL-2026-11-13.md WHOLE (V7-1 to V7-10, each "
           "executed; its section 7, the owner's step; its section 8: what the next reader will do and EIGHT SHAPES FOR THE BUILDER). And its PLANT LIBRARY on "
           "origin/lane/review-veil-3-2026-11-12 (61a253a79): docs/chair/2026-11-13/probes/REVIEW-VEIL-7/ (run-all.sh: one command, about sixty seconds, 37 "
           "expected results, the server against the twin, a deep row and a large row timed against 211; born/run-born.sh: the born towns in both shapes, about "
           "75 minutes). Copy it out with git archive; never commit it to your lane.\n"
           "5. The chair's records that rule this lane, by their headings in docs/chair/2026-11-07/ODQ-934.105-DRAFT.md on the chair's lane (find each by "
           "script; the file has very long lines): \"THE VEIL HANDED OVER\" (positive account), \"THE FRESH SECURITY READER'S FIRST HIGH FINDING IN 212\" (every "
           "script), \"TWO MORE SECURITY FINDINGS\" (by id alone; a second home by identity), \"THE SECURITY READER'S WRITTEN ANSWER\" (THE DESIGN), \"THE SECURITY "
           "READ OF 212 FILED\" (the acceptance run)."),
    state=("THE BYTES, as the ninth seat's PART 10 states them at 7d99e9b8b (prove each at your first commit): supabase/migrations/211_server_side_share_veil.sql "
           "eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01 and supabase/rollback/211_server_side_share_veil.down.sql "
           "ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f: FROZEN: you never change either file; prove both checksums at your first commit "
           "and at your last. 212 after item 1: a222b83dc0d05a03d0de88106be2e573f8ebf4a3ca5b08a1a871c4c143ed78f3, its rollback "
           "5e85b349b82305ef3033ea8bfc0abc51dcfac0a81113458504223a4a5b2c4c01: these change only for the work below, each change with its proof, the new "
           "checksum in every commit message that moves them."),
    work=("THE DESIGN, RULED (the chair's record of 2026-11-14 00:18 UTC, binding; open to the owner's veto). The eighth seat's cure searched every string for "
          "every hidden name: the reader showed it BOTH LEAKY AND TOO SLOW. IN ORDER OF PREFERENCE: (i) BY WHAT A THING IS BUILT FROM, wherever the record says: "
          "everything the engine derives from a house, a person, an event or a power is withheld or derived again BY IDENTITY when its source is hidden: the two "
          "name lists (positive account: done in item 1; check it against V7-5); EVERY existence flag, not five (V7-8); an income row by its house, whether or "
          "not its groupings are shut; a trace entry by its house; the legacy annotation by its event; a tie's copy by its person. A second home follows its "
          "source's eye BY IDENTITY, never by matching text (V7-2); where only the words tie a copy to its source, the row is listed with its count and matched "
          "on the current and the stored wording both. (ii) FREE PROSE ONLY, where no identity exists: ONE search per string for all hidden names at once, by "
          "whole name on word boundaries IN ANY SCRIPT (V7-1: the fold keeps the letters and digits of every script, by one definition both engines apply "
          "identically; no prefilter that can miss), each house's every name (current, born, and without its bracketed qualifier: that IS the name), never a "
          "prefix of a longer open name; an open house's own name and a shown power's name are never taken (V7-7). (iii) A HOUSE HIDDEN WHOLE IS REMOVED WHOLE, "
          "BY ITS ID ALONE (V7-3): the set of ids is decided before the eyes trim anything and is not tested again; cured in 212's _gallery_veil_apply and in "
          "the twin's applyVeil; 211's two files are NOT touched. (iv) THE COST IS A LAW: a read with houses hidden costs no more than TWICE the same read on "
          "the frozen 211 alone, on the reader's 300 KB row and on the largest born town, both figures in the commit (V7-6); if the law of names cannot be met "
          "inside that cost, STOP with the numbers. (v) A READ NEVER FAILS WHERE 211 SERVES (V7-10): the walk is bounded or iterative, and at the bound the "
          "reader receives the closed answer, never the unfiltered document. (vi) THE CLIENT'S TWIN THE SAME, rule for rule; the booleans' derivation agrees "
          "between the server and the twin (the ninth seat's item 2). A TOKEN THAT IS BOTH A HOUSE'S NAME IN CAMEL CASE AND THE ENGINE'S NAME FOR A QUANTITY "
          "(V7-4's trace target): MEASURE FIRST: count the towns whose trace carries the token against whether the roster holds the house: where it appears "
          "with no such house it is the engine's quantity and OUTSIDE the law (listed with both counts); only where the house stands: withheld by identity; "
          "mixed: withheld only where the entry is tied to the house.\n"
          "THE WORK, in this order, each its own commit, red first, pushed as made:\n"
          "1. V7-3, then V7-1, then V7-2 (the old chair's order), each built in the design's form, not as a patch on the eighth seat's sweep; then the rest of the "
          "design (i) to (vi) with V7-4 to V7-10 each answered: cured with its proof, or shown outside the law by measure and listed.\n"
          "2. THE ACCEPTANCE RUN, RULED: the cures are done when the reader's run-all.sh exits 0 AND its born run is green, at ONE named checksum of 212, with "
          "the cost law met (the timed rows are that law's test). Run it red first at your starting tip and keep both outputs.\n"
          "3. BRIEF-VEIL-9's item 3, (a) to (e), at the FINAL bytes (the red pin re-keyed by identity; the planted proofs; the lane's other pins; THE REHEARSAL: "
          "212 applied twice without error or change, its rollback returning the catalogue to the frozen 211's exactly, then 212 again; THE ROLLBACK ORDER IS "
          "212's FIRST; the whole suite once, in shards, classed against PART 8's ten).\n"
          "4. LAST, THE OWNER'S PACK docs/chair/2026-11-13/veil-212/ rebuilt for the FINAL bytes, as BRIEF-VEIL-9's item 4 gives it (it still describes old "
          "bytes and must not be used as it is). It is handed to NOBODY by you.\n"
          "A FRESH SECURITY READER judges your final bytes with that library: when the acceptance run is green, send the chair ONE message (the tip, both "
          "checksums of 212, what the reader must read) and stop changing 212 until the chair answers.\n"
          "THE LAWS OF THIS LANE bind you as BRIEF-VEIL-9 states them: 212 stays ONE transaction, create-or-replace, idempotent, after the frozen 211; every cure "
          "proved by the planted-marker run, red first, AND by markers the earlier guards lacked (other scripts, symbols only, a dotted capital I, a sharp s); a "
          "guard or pin re-keyed by identity, never loosened; NOTHING IS APPLIED TO ANY HOSTED DATABASE BY ANY SEAT: local chains only; never `supabase db "
          "push`, never a production credential, never `migration repair`. Your hand-back is a new file, docs/chair/2026-11-13/COHERENCE-VEIL-HANDBACK-PART11.md, "
          "kept current after every item: each home again as PART 9's table gives it, with what you changed, and the rows left outside the law, row by row."),
    merges="; a local database cluster in your container",
    when="for a first message of open stops (if any), for the cost law if it cannot be met (the numbers), when the acceptance run is green at a named checksum, for a stop that blocks everything you have left, and for a hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after V7-3, V7-1 and V7-2 together; after the design's rest; after the acceptance run; and after the rehearsal and the suite. On this lane a tired seat's slip is a leak: hand back at 300,000, not 350,000.",
)

SEATS['W2-C-LEAVES-6'] = dict(
    title="W2-C-LEAVES-6 · the third leaves lane: the Economics tab's rows left, the added rows, the final statement",
    branch='lane/w2-c-leaves-2026-11-13', tip='beae4ef71', base='303abbf67', pred='BRIEF-W2-C-LEAVES-5.md',
    intro=("You are W2-C-LEAVES-6, the sixth seat on the third leaves lane of the settlement-engine integration program (lane/w2-c-leaves-2026-11-13). The lane "
           "cures false lines the page itself writes (the Economics tab and its twins on the PDF and the Foundry journal). The fifth seat did its items 4 and 5 "
           "and merged the side seat's branch twice, the second time at its FINAL tip; its session then ended with the account. Yours: the items it left, the "
           "rows the old chair added, and the lane's ONE final statement."),
    handbacks=("docs/chair/2026-11-13/W2-C-LEAVES-HANDBACK.md: PART 5 WHOLE (the fifth seat: items 4 and 5, both merges, the rulings and the chair's added rows "
               "copied in) and PART 4 WHOLE (\"NOT DONE, LINE BY LINE\" with its line numbers; the probes and how each is run); and "
               "docs/chair/2026-11-13/W2-C-LEAVES-SIDE-HANDBACK.md WHOLE (the side seat's eight items, its registers, what it parked and passed on: its files "
               "are now YOURS)"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone (verify each against PART 5): after 303abbf67 the fifth seat pushed the seven food-sentence "
           "pins re-keyed (7adbe1d3), item 4 the food balance row (fb312866), the early merge of the side branch at 777b81bdb (1c36c1717), item 5 the clergy's "
           "provision (56f73d7e0), the merge of the side branch's FINAL tip df51100b1 (6a42e039) and PART 5 (beae4ef71). The side seat is ended and its branch "
           "is final: there is no side seat any more."),
    work=("THE WORK, in this order, each writer its own commit, measured first, red first, pushed as made:\n"
          "1. BRIEF-W2-C-LEAVES-5's items 6 to 10 exactly as it gives them (\"Needs X · affects\"; the outputs pills; the PDF's and the journal's trade lists on "
          "the tab's ONE reader; the chain state under a crisis as ONE leaf, with the PDF's chain flow written up FOR THE JOIN; the measuring seat's command at "
          "your tip and at 4534ea5e3).\n"
          "2. THE ROWS THE OLD CHAIR ADDED after the side seat's hand-back (record 422; PART 5 copies them: follow its wording where it is fuller): #1013: a town "
          "whose only criminal house is a gambling house prints no structure note and no structure label (12 towns); Arcane \"None\" is not printed beside an "
          "arcane power of ANY standing (9 more towns); the PDF's \"Abundant\" kicker does not print for the grounds round a besieged town (31); the four timber "
          "pills: read each in its town, cure or name.\n"
          "3. Item 11's merge of the side branch is DONE. Re-make through their own doors any register the second merge left behind (the side hand-back's list), "
          "if PART 5 does not show it done.\n"
          "4. THEN ONE MESSAGE TO THE CHAIR (the tip; the counts) AND WAIT FOR POINT 49. " + POINT49 + " On that word: merge the line's tip (a plain merge; say "
          "which commit); cure the TWO rows the merge seat banked by hand against src/domain/display/defenseDisplay.js at point 49 (the merge book's section "
          "2k.5, commit 3628f37cc, reason `after-base`: they were the side seat's and are yours now) and shrink them from the presumed-things register through "
          "its own door; the instrument's page census on this lane's lines read, each hit cured or declared; then THE LANE'S ONE FINAL STATEMENT as PART 4's "
          "item 10 and Part 3 give it (the whole suite once, in shards)."),
    merges="; on the chair's word, the merge of the integration line's tip",
    when="for a first message of open stops (if any), when items 6 to 10 and the added rows are pushed, for a stop that blocks everything you have left, and for your final statement or hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after items 6 and 7, after items 8 to 10, after the added rows, and after the final statement.",
)

SEATS['W2-WRITE-7'] = dict(
    title="W2-WRITE-7 · the corpus lane's main seat: the DS-DEF block, then the merge of the three and the final statement",
    branch='lane/w2-write-2026-11-13', tip='2f1ff0e7a', base='dcd4759b0', pred='BRIEF-W2-WRITE-6.md',
    intro=("You are W2-WRITE-7, the seventh seat on the corpus lane of the settlement-engine integration program (lane/w2-write-2026-11-13). The corpus is the "
           "dossier's written lines: one source document, docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, from which src/data/dossierStateProse/*.generated.js are "
           "generated. The lane is SPLIT BY BLOCK among three seats: YOU, the main seat, hold DS-DEF; two side seats hold DS-ECO and every other block, each on "
           "its own branch cut from dcd4759b0. The sixth seat began part B of your block (four commits) and its session then ended with the account; it wrote "
           "no hand-back file: its commit bodies are its record. Yours: the rest of B, then C to F, then on the chair's word THE MERGE and the lane's ONE final "
           "statement."),
    handbacks=("docs/chair/2026-11-13/W2-WRITE-HANDBACK-5.md WHOLE (the method; part A; the fifth seat's two calls; THE SPLIT; THE MERGE in eight steps; B BY "
               "BLOCK: the table \"DS-DEF (27)\") and docs/chair/2026-11-13/probes/W2-WRITE-5/README.md (the instruments); and the BODIES of the sixth seat's four "
               "commits (a17d1461, 47f8bdd8, 94c1d5dc, 2f1ff0e7a): which of the 27 each settled, with its towns"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone: after dcd4759b0 the sixth seat pushed: five last rows the read proposed for strike, struck "
           "(a17d1461); DS-DEF-1 readiness STRONG v5 and v6 reworded (47f8bdd8); DS-DEF-2 the chain food-trades clauses said as the record's chain, working v1 off "
           "a famine (94c1d5dc); and, on the old chair's court ruling (record 422: THE PAGE NAMES A COURT ONLY WHERE A COURTHOUSE STANDS), the Internal Security "
           "lines name a hearing, not a court (2f1ff0e7a)."),
    work=("THE WORK, in this order, each cause its own commit, red first, pushed as made:\n"
          "0. YOUR HAND-BACK FILE: docs/chair/2026-11-13/W2-WRITE-HANDBACK-6.md (the sixth seat made none): begin it with the table of B's 27 against the sixth "
          "seat's four commits (settled, with what prints after; left), then keep it current after every item.\n"
          "B to F. BRIEF-W2-WRITE-6's parts B (what is left of the 27), C, D, E and F exactly as it gives them, under its METHOD (a line is READ WHERE IT PRINTS "
          "before it is pushed; a middle row of a pool is never struck: reworded true or declared off; only a pool's last rows are struck).\n"
          "G. THEN ONE MESSAGE TO THE CHAIR AND WAIT. The two side seats hand their tips to the chair; the chair then gives the word for THE MERGE of both, "
          "exactly as HANDBACK-5's section THE MERGE gives it, then the merge of the integration line's tip, then the items that wait on it: THE SEVEN FAITH POOLS "
          "the merge seat re-based by name at point 49 (DS-GEN-7 power_economic temple economy, DS-GEN-17 cathedral, DS-FTH-4 crusaderSynthesis, "
          "heresySuppression hunted and preached, religiousFraud, mageTheocracy: they must read the faith reading; the merge book's section 2k.5, commits "
          "b4c3640bf and a7bf9aa0e, the layer walker's REBASED_49D list: shrink-only, each pool leaves it as it is cured), then THE LANE'S ONE FINAL STATEMENT. "
          + POINT49),
    merges="; on the chair's word, the merges of lane/w2-write-side-eco-2026-11-13, lane/w2-write-side-rest-2026-11-13 and the integration line's tip",
    when="for a first message of open stops (if any), when B is pushed (one line: lines struck, reworded, declared, kept as true), at step G, for a stop that blocks everything you have left, and for a hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after every part (B, C, D, E, F).",
)

SEATS['W2-WRITE-SIDE-ECO-2'] = dict(
    title="W2-WRITE-SIDE-ECO-2 · the corpus lane's DS-ECO block",
    branch='lane/w2-write-side-eco-2026-11-13', tip='632dd125f', base='dcd4759b0', pred='BRIEF-W2-WRITE-SIDE-ECO.md',
    intro=("You are W2-WRITE-SIDE-ECO-2, the second seat on the corpus lane's DS-ECO side branch of the settlement-engine integration program "
           "(lane/w2-write-side-eco-2026-11-13, cut from the corpus lane at dcd4759b0). The corpus is the dossier's written lines: one source document, "
           "docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, from which src/data/dossierStateProse/*.generated.js are generated. The lane is split by block among "
           "three seats; YOUR BLOCK is DS-ECO and nothing else. The first seat pushed six commits of part B and its session then ended with the account; it wrote "
           "no hand-back file: its commit bodies are its record."),
    handbacks=("docs/chair/2026-11-13/W2-WRITE-HANDBACK-5.md WHOLE (the method; the fifth seat's two calls; THE SPLIT; B BY BLOCK: the DS-ECO table) and "
               "docs/chair/2026-11-13/probes/W2-WRITE-5/README.md (the instruments); and the BODIES of the first seat's six commits (58aaaed2, 6bca7992, "
               "0a90a979, 3f46ef5b, 10e765d6, 632dd125f): which of B's 15 each settled, with its towns, and the old chair's ruling of 00:23 UTC that 3f46ef5b "
               "carries (DS-ECO-12 house needs v2 no longer says the good comes in)"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone: after dcd4759b0: DS-ECO-12 INCOME WEIGHT religious houses, the no-house case (58aaaed2); "
           "DS-ECO-12 CRITICAL IMPORT a house needs what the land lacks (6bca7992); DS-ECO-12 CRITICAL IMPORT the land cannot give it (0a90a979); DS-ECO-12 "
           "house needs v2, on the old chair's ruling (3f46ef5b: record 422: a critical-import line is declared off towns whose record does not import the good "
           "it names); DS-ECO-10 POSTURE entrepot v4 (10e765d6); DS-ECO-10 POSTURE established v10 struck and v7 re-said (632dd125f)."),
    work=("THE WORK, in this order, each cause its own commit, red first, pushed as made:\n"
          "0. YOUR HAND-BACK FILE: docs/chair/2026-11-13/W2-WRITE-SIDE-ECO-HANDBACK.md (the first seat made none): begin it with the table of B's 15 against the "
          "first seat's six commits (settled, with what prints after; left), then keep it current after every item.\n"
          "B to the end. BRIEF-W2-WRITE-SIDE-ECO's parts exactly as it gives them: what is left of B; C; D (about 43 rows, four HIGH: the high first); E (about "
          "25, two HIGH; the measuring seat's candidates DS-ECO-10, -11, -12); the three notes from other lanes (the exploitation pool's Full variants under a "
          "crisis; the can-pay row beside a doom line, 238 births by the defence lane's measure; the house-needs pool's false premise); the measuring seat's "
          "command over your file at dcd4759b0 and at your tip. Under the brief's METHOD: a line is READ WHERE IT PRINTS before it is pushed; a middle row of a "
          "pool is never struck.\n"
          "LAST: bring the hand-back current, say for the main seat's merge which shared files your branch moved, and send the chair ONE message: your tip, the "
          "counts, no statement. The main seat merges your branch on the chair's word."),
    merges='',
    when="for a first message of open stops (if any), for a stop that blocks everything you have left, when your block is done (the tip), and for a hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after every part (B, C, D, E).",
)

SEATS['W2-WRITE-SIDE-REST-2'] = dict(
    title="W2-WRITE-SIDE-REST-2 · the corpus lane's other blocks: parts D and E",
    branch='lane/w2-write-side-rest-2026-11-13', tip='7e5d7f79d', base='dcd4759b0', pred='BRIEF-W2-WRITE-SIDE-REST.md',
    intro=("You are W2-WRITE-SIDE-REST-2, the second seat on the corpus lane's second side branch of the settlement-engine integration program "
           "(lane/w2-write-side-rest-2026-11-13, cut from the corpus lane at dcd4759b0). The corpus is the dossier's written lines: one source document, "
           "docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, from which src/data/dossierStateProse/*.generated.js are generated. The lane is split by block among "
           "three seats; YOUR BLOCKS are every block but DS-DEF and DS-ECO (DS-POW, DS-GEN, DS-SUP, DS-STR, DS-WAR, DS-FTH, DS-REL, DS-POP, DS-CND, DS-HK). The "
           "first seat pushed its parts B and C and wrote its hand-back (\"C done; D and E left by pool with their rows\"); its session then ended with the "
           "account."),
    handbacks=("docs/chair/2026-11-13/W2-WRITE-SIDE-REST-HANDBACK.md WHOLE (B line by line; C; D AND E LEFT BY POOL WITH THEIR ROWS: that is YOUR LIST; for the "
               "merge: which shared files the branch moved); docs/chair/2026-11-13/W2-WRITE-HANDBACK-5.md (the method; the two calls; THE SPLIT) and "
               "docs/chair/2026-11-13/probes/W2-WRITE-5/README.md (the instruments)"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone: after dcd4759b0 the first seat pushed nine commits of B (DS-POW-5, DS-POW-6 twice and the "
           "GM ADVISORY rows, DS-FTH-4 heresySuppression, DS-GEN-18 BOUGHT-IN v10 struck, DS-SUP-2 UPSTREAM WEAK v1 and v2), one of C (DS-GEN-17 GARRISONED v1 "
           "and v2 off an occupation, bc81c24f) and its hand-back (7e5d7f79d)."),
    work=("THE WORK, in this order, each cause its own commit, red first, pushed as made:\n"
          "D and E. BRIEF-W2-WRITE-SIDE-REST's parts D (about thirty rows) and E (about 29) exactly as it gives them, pool by pool as the hand-back lists them, "
          "the high first; the siege Overview's road lines; the crown named in self-governing wartime towns (declared off where a registered condition allows, "
          "else listed as waiting on the parked sovereignty word); the measuring seat's command over your files at dcd4759b0 and at your tip. Under the brief's "
          "METHOD: a line is READ WHERE IT PRINTS before it is pushed; a middle row of a pool is never struck.\n"
          "THE SEVEN FAITH POOLS (DS-GEN-7 power_economic temple economy, DS-GEN-17 cathedral, DS-FTH-4 crusaderSynthesis, heresySuppression hunted and preached, "
          "religiousFraud, mageTheocracy) are NAMED by you for the main seat, with each pool's rows and towns: the main seat cures them after it merges the "
          "integration line (they must read the faith reading, which arrives with that merge). Do not rebuild them here.\n"
          "LAST: bring the hand-back current, say for the main seat's merge which shared files your branch moved, and send the chair ONE message: your tip, the "
          "counts, no statement. The main seat merges your branch on the chair's word."),
    merges='',
    when="for a first message of open stops (if any), for a stop that blocks everything you have left, when your blocks are done (the tip), and for a hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after D and after E.",
)

SEATS['W2-FIX-DATA-8'] = dict(
    title="W2-FIX-DATA-8 · the data lane: rows 3 to 7, the history branch's merge, the final statement",
    branch='lane/w2-fix-data-2026-11-13', tip='8e79b0230', base='bfadaa767', pred='BRIEF-W2-FIX-DATA-7.md',
    intro=("You are W2-FIX-DATA-8, the eighth seat on the data lane of the settlement-engine integration program (lane/w2-fix-data-2026-11-13). The lane cures "
           "false lines written by the catalogue and the data tables: the institutions' descriptions and services, the stress summaries, the finished-goods and "
           "import tables. Its side branch (the history, culture and arrival files, lane/w2-fix-data-history-2026-11-13) is FINAL at 864948c8b and its seat is "
           "ended. The seventh seat did rows 1 and 2 and opened its hand-back; its session then ended with the account. Yours: rows 3 to 7, the census, the "
           "merge of the history branch with what it left, and the lane's ONE final statement."),
    handbacks=("docs/chair/2026-11-13/W2-FIX-DATA-HANDBACK-7.md WHOLE (the seventh seat: row 1 read true by measure, row 2 cured, the old chair's added row for "
               "row 4 copied in) and W2-FIX-DATA-HANDBACK-6.md WHOLE (section 8, \"THE EXACT NEXT STEP ... line by line\", is still YOUR LIST: rows 3 to 7; "
               "section 2, the lane's own six named reds; section 9, the rulings). On origin/lane/w2-fix-data-history-2026-11-13: "
               "docs/chair/2026-11-13/W2-FIX-DATA-HISTORY-HANDBACK.md WHOLE (its items, its red guards with their doors, the other lane's rows each marked, the "
               "old chair's succession ruling: RULED, NOT BUILT)"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone: after bfadaa767 the seventh seat pushed row 2 (745c05a1: the catalogue's stored crisis hook "
           "and note resolve through their declared sets at rerenderStressSummary; 82a7c600: the stress cells' resolution pool takes its row by the narrow door) "
           "and its hand-back (8e79b0230: row 1 read TRUE by measure: the Town hall is the court)."),
    work=("THE WORK, in this order, each writer its own commit, measured first, red first, pushed as made:\n"
          "1. BRIEF-W2-FIX-DATA-7's rows 3 to 7 exactly as HANDBACK-6's section 8 writes them, with HANDBACK-7's added row for row 4; then its step 8, the "
          "measuring seat's command at your tip and at the lane's base.\n"
          "2. THE CHAIR'S WORD FOR THE HISTORY BRANCH IS GIVEN NOW (the old chair gave it; record of 2026-11-14 00:34 UTC): merge "
          "origin/lane/w2-fix-data-history-2026-11-13 at 864948c8b (a plain merge; the wiring census, the presumed-things door and the pin count re-run after "
          "it, each through its own door). Then WHAT THAT SEAT LEFT, RULED: (a) THE SUCCESSION CRISIS EVENT in a town a council governs today is NOT a fault by "
          "itself (\"the ruler of the time\" is a past ruler): the event stays and its selection is not changed; a fault IS a variant, a description or a lasting "
          "effect that speaks of a ruler in the PRESENT in such a town: declared off, or put into the past; (b) the succession hooks under a priest-ruled "
          "council (10 of 115 towns): read, and declared off what is false of a council of clergy; (c) the one hook left under an elders' rule (\"A would-be heir "
          "approaches outsiders\"): read it in three elders' towns and SAY whether \"heir\" is false of a council's seat; the succession hook pool's dominance "
          "(top1 0.81 against a ceiling of 0.64) is CARRIED RED TO THE CLOSING ACTS, named: no hand edit, no new line written for it.\n"
          "3. THEN ONE MESSAGE TO THE CHAIR AND WAIT FOR POINT 49. " + POINT49 + " On that word: the merge of the line's tip (say which commit); the instrument's "
          "page census on this lane's lines read, each hit cured or declared; and THE LANE'S ONE FINAL STATEMENT as BRIEF-W2-FIX-DATA-7's step 9 gives it (the "
          "whole suite once, in shards; the lane's own named reds, six or fewer)."),
    merges="; the merge of origin/lane/w2-fix-data-history-2026-11-13 named in step 2; on the chair's word, the merge of the integration line's tip",
    when="for a first message of open stops (if any), when step 2 is pushed (the tip, the counts), for a stop that blocks everything you have left, and for your final statement or hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after rows 3 and 4, after rows 5 to 7, after the census, and after the history merge and its rows.",
)

SEATS['POWERS-11'] = dict(
    title="POWERS-11 · the powers lane: its own red guards first, then the reader's findings and the lines left",
    branch='lane/powers-follow-up-2026-11-13', tip='ec72918d4', base='2f016b7b4', pred='BRIEF-POWERS-10.md',
    intro=("You are POWERS-11, the sixth seat on the powers lane of the settlement-engine integration program (lane/powers-follow-up-2026-11-13). The lane cures "
           "false lines about a town's powers, their people, goals and ties. Its stage read (NOT CLEAR at 96a6ced46: M4, eleven of the lane's own test titles "
           "red; M1, five commanding claims beside a Minor or Suppressed label) set the fifth seat's order. That seat pushed two commits of M4 and its session "
           "then ended with the account."),
    handbacks=("docs/chair/2026-11-13/POWERS-FOLLOW-UP-HANDBACK-2.md: PART 4 WHOLE (the fourth seat's stage hand-back, line by line: done; the reader's findings "
               "all not started; the 44 lines left of the 78; its instruments under docs/chair/2026-11-13/probes/POWERS-9/) and the earlier parts as it points "
               "to them; and the BODIES of the fifth seat's two commits (1bf74bd1, ec72918d4): which of M4's eleven titles each settled. The stage read itself, on "
               "the chair's lane: docs/chair/2026-11-13/REVIEW-POWERS-96a6ced46-2026-11-13.md"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone: after 2f016b7b4 the fifth seat pushed: the phone chrome floor's three dossier rows "
           "re-recorded for a59796dda's two cut sites (1bf74bd1); the legacy-faction-readers walker reads the lane's two sites: a tension's parties re-keyed, "
           "the crime signal named (ec72918d4). The other titles of M4's eleven are NOT known to be done: run all eleven at your tip first."),
    work=("THE WORK, in BRIEF-POWERS-10's order, each cause its own commit, red first, pushed as made:\n"
          "1. M4: the eleven red titles, each at its cause through its own door (a red is classed against the LANE'S REVIEWED BASE 714381934, not against a "
          "seat's own base: the third seat's wrong classing corrected; the each-family park debt 115 against 108 named).\n"
          "2. M1: the five commanding claims beside Minor or Suppressed, to zero. The lows L4, L5, L7.\n"
          "3. The rows other lanes named to this lane's files, as BRIEF-POWERS-10 lists them (patronage; the symbiotic row beside a conflict; the subordinate "
          "church; a Merchant Guilds power with no guild; the six mentor rows; #693: a seat-holder \"first of\" two powers at once; the craft faces ranked in "
          "noble powers; the conflict issue's words). Then the 44 lines left of the 78. Then the measuring seat's command at base and tip.\n"
          "4. THEN ONE MESSAGE TO THE CHAIR AND WAIT FOR POINT 49. " + POINT49 + " On that word: the merge of the line's tip (say which commit); #312 "
          "(people/goals.js reads the chain leaf, which arrives with the merge); THE THREE ROWS the merge seat banked by hand against this lane at point 49 (two "
          "literals in dmPowerLines.js, one strip site in rulerKin.js: the merge book's section 2k.5, commit 3628f37cc, reason `after-base`) cured and shrunk "
          "from the presumed-things register through its own door; and the stage's statement. THE NEXT READ of this lane is a diff from 96a6ced46 to your final "
          "tip, the eleven titles re-run at both trees: leave it what it needs."),
    merges="; on the chair's word, the merge of the integration line's tip",
    when="for a first message of open stops (if any), when M4 and M1 are pushed (the tip; the eleven titles green or named), for a stop that blocks everything you have left, at step 4, and for a hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after M4, after M1 and the lows, after the named rows, and after the 44 lines.",
)

SEATS['R2-CODE-A-6'] = dict(
    title="R2-CODE-A-6 · round two's first code lane: the rows left, its own reds, the final statement",
    branch='lane/r2-code-a-2026-11-13', tip='ff71e26cf', base='11f35224d', pred='BRIEF-R2-CODE-A-5.md',
    intro=("You are R2-CODE-A-6, the sixth seat on round two's first code lane of the settlement-engine integration program (lane/r2-code-a-2026-11-13). The lane "
           "cures false lines in the founding paragraph, the history's origin, the arrival scenes and the people data. The fifth seat did its items 1 to 3 (the "
           "founding rows and the founder line; the roster's secret naming a thieves' guild) and brought the hand-back current; its session then ended with the "
           "account."),
    handbacks=("docs/chair/2026-11-13/R2-CODE-A-HANDBACK.md: SECTION 14 WHOLE (the fifth seat: the brief's rulings and the old chair's later row copied in; items 1 "
               "to 3 with their commits and counts; what is left), SECTION 13 (the fourth seat: steps 1 to 3 done, step 4 partly, the reds classed) and SECTION 12 "
               "(the medium rows)"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone: after 11f35224d the fifth seat pushed: the founding rows read the record: the History tab's "
           "Origin row and the founder line (299e79cc: #488 #594 #845 ww-890 ww-915; #571/#916); the presumed-things register through its own door (ecc6ad8b); "
           "the roster's informant: a secret names a thieves' guild only where one stands (05e5d24b); section 14 of the hand-back (ff71e26cf)."),
    work=("THE WORK, in BRIEF-R2-CODE-A-5's order from where section 14 says it stands, each writer its own commit, measured first, red first, pushed as made:\n"
          "1. Step 4's rows and section 12's medium rows; the stage read's low 8 (three office twins take their siblings' tier).\n"
          "2. The lane's own two reds through their doors (the wiring census's alias draft; a new pool's row). The two golden surfaces the founding cure moved "
          "are the merge seat's doors: NAME them with their measured figures; open no golden's door.\n"
          "3. The measuring seat's command at base and tip, every hit in the lane's files read.\n"
          "4. THEN ONE MESSAGE TO THE CHAIR AND WAIT FOR POINT 49. " + POINT49 + " On that word: the merge of the line's tip (say which commit); the instrument's "
          "page census on this lane's lines read, each hit cured or declared; THE LANE'S ONE FINAL STATEMENT as the lane's briefs give it (the whole suite once, "
          "in shards). PARKED and not yours: the six mentor rows (the powers lane); four lines that never print."),
    merges="; on the chair's word, the merge of the integration line's tip",
    when="for a first message of open stops (if any), for a stop that blocks everything you have left, at step 4, and for your final statement or hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after step 1, after steps 2 and 3, and after the final statement.",
)

SEATS['R2-CODE-B-5'] = dict(
    title="R2-CODE-B-5 · round two's second code lane: the rows left, the side branch's merge, the final statement",
    branch='lane/r2-code-b-2026-11-13', tip='5063298a2', base='db61f66fc', pred='BRIEF-R2-CODE-B-4.md',
    intro=("You are R2-CODE-B-5, the fifth seat on round two's second code lane of the settlement-engine integration program (lane/r2-code-b-2026-11-13). The lane "
           "cures false lines on the Tonight sheet, the cast cards, the crisis cast and hooks, and the Services and Daily Life tabs. It was split by file with a "
           "side seat (lane/r2-code-b-side-2026-11-13: the chain card's facts, PowerStrata, the quick guide, the traditions, the faith reading), whose items 1 to "
           "7b are pushed with a zero field diff. The fourth seat committed item 4 (the crisis cast) and brought the hand-back current; both sessions then ended "
           "with the account. THERE IS NO SIDE SEAT ANY MORE: you take both branches."),
    handbacks=("docs/chair/2026-11-13/R2-CODE-B-HANDBACK.md: PART 4 WHOLE (the fourth seat: item 4 committed, the five reds classed, the draw on the cast's own "
               "fork declared; what is left) and PART 3; FOR THE JOIN. On origin/lane/r2-code-b-side-2026-11-13 (5975515a3): "
               "docs/chair/2026-11-13/R2-CODE-B-SIDE-HANDBACK.md WHOLE (its eight items; the register doors it moved, which YOU re-make after the merge; its stops "
               "and parked items; FOR THE JOIN; its new words)"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone: after db61f66fc the fourth seat pushed item 4 (77ed210a: the crisis cast reads the empty "
           "seat, the roster and the road; a hook names a house in prose), the fork census re-measured through its own door (32438f8d: the cast step draws its "
           "temporary person on its own fork), the fork register's entropy tally (01ee0bac) and PART 4 (5063298a2). The side branch stands at 5975515a3: items 1 "
           "to 7b and the 720 field diff (0) are in its hand-back; its item 8 (the measuring seat's command over its files at base and tip) was NOT run."),
    work=("THE WORK, in this order, each writer its own commit, measured first, red first, pushed as made:\n"
          "1. What BRIEF-R2-CODE-B-4 leaves after item 4, as PART 4 says it stands: the two small tabs; the trait chips apart; the page re-count; the lighting "
          "census.\n"
          "2. THE CHAIR'S WORD FOR THE SIDE BRANCH IS GIVEN NOW: merge origin/lane/r2-code-b-side-2026-11-13 at 5975515a3 (a plain merge; say what conflicted); "
          "re-make through their own doors the registers its hand-back lists (the raw-colour budget, the phone chrome floor routes, the dossier phone floors, "
          "the lighting census); then the quick guide's food line onto the ONE home (tonightSheet.js :: foodBandOf).\n"
          "3. The measuring seat's command ONCE on the merged tree, over both seats' files, at the lane's base and at your tip: every hit read against its town, "
          "cured or named. The 720 field diff, base against tip, by family.\n"
          "4. THEN ONE MESSAGE TO THE CHAIR AND WAIT FOR POINT 49. " + POINT49 + " On that word: the merge of the line's tip (say which commit); the instrument's "
          "page census on this lane's lines read, each hit cured or declared; THE LANE'S ONE FINAL STATEMENT as the lane's briefs give it (the whole suite once, "
          "in shards). The side seat's stops (the fair's act; the PDF's Traditions chapter; items 1 and 2 at the join) are NAMED in your statement under FOR THE "
          "JOIN: not built."),
    merges="; the merge of origin/lane/r2-code-b-side-2026-11-13 named in step 2; on the chair's word, the merge of the integration line's tip",
    when="for a first message of open stops (if any), when the side branch is merged and its registers re-made (the tip), for a stop that blocks everything you have left, at step 4, and for your final statement or hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after step 1, after step 2, after step 3, and after the final statement.",
)

SEATS['R3-CODE-C-5'] = dict(
    title="R3-CODE-C-5 · round three's code lane: the close",
    branch='lane/r3-code-c-2026-11-13', tip='e2aa8e278', base='e2aa8e278', pred='BRIEF-R3-CODE-C-4.md',
    intro=("You are R3-CODE-C-5, the fifth seat on round three's code lane of the settlement-engine integration program (lane/r3-code-c-2026-11-13). The lane "
           "cures false lines in domain, generator and display files no other lane held. The third seat did its seven items and handed back by file; a fourth "
           "seat was seated for the lane's close and pushed NOTHING before its session ended with the account. Yours: the whole of the fourth seat's brief."),
    handbacks=("docs/chair/2026-11-13/R3-CODE-C-HANDBACK.md: the third seat's sections WHOLE (items 4 to 7; the stage read's LOW findings; THE SUCCESSOR'S LIST) "
               "and the earlier seats' as it points to them"),
    extra='',
    state=("THE STATE: the lane's tip is the third seat's hand-back commit; the lane already holds the line at 9e57f5023 (merged at 8e9046124). Nothing of the "
           "fourth seat's brief is done."),
    work=("THE WORK: BRIEF-R3-CODE-C-4's list exactly as it gives it, each writer its own commit, measured first, red first, pushed as made: the measuring seat's "
          "command at base and tip with every hit in the lane's files read; ONE rewording pass of crisisSummaryVantage.js's table (\"those who keep order\" with "
          "no force, 30 prints; \"the merchants\", 10; \"streets\" in small places, 33); the two manifest entries; then ONE MESSAGE TO THE CHAIR AND WAIT FOR "
          "POINT 49. " + POINT49 + " On that word: the merge of the line's new tip (say which commit); the instrument's findings on this lane's lines cured or "
          "declared; THE LANE'S ONE FINAL STATEMENT (the whole suite once, in shards)."),
    merges="; on the chair's word, the merge of the integration line's tip",
    when="for a first message of open stops (if any), for a stop that blocks everything you have left, when the close is pushed and you wait for point 49, and for your final statement or hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after the census and the rewording pass, and after the final statement.",
)


SEATS['R3-TABS-3'] = dict(
    title="R3-TABS-3 · round three's tabs lane: the close",
    branch='lane/r3-tabs-2026-11-13', tip='a19a0ee1', base='fdfd471d9', pred='BRIEF-R3-TABS-2.md',
    intro=("You are R3-TABS-3, the third seat on round three's tabs lane of the settlement-engine integration program (lane/r3-tabs-2026-11-13). The lane cures "
           "the false lines and badges the Defense, History and Substrate tabs write themselves, and the defence posture's selector. The second seat did its "
           "item 1 (the severity chips) and item 2 (the measuring seat's command), and then, on a ruling the old chair sent it (\"the port's two homes\": a line "
           "of the sea or a harbour's approaches is offered only where the route is the sea, the defence desk's pool key too), cured the defence desk's naval "
           "line with its register doors; its session then ended with the account. Yours: the lane's close and its ONE final statement."),
    handbacks=("docs/chair/2026-11-13/R3-TABS-HANDBACK.md WHOLE (the first seat's part: every item, its stops, FOR THE JOIN, STATUS; THE SECOND SEAT's part, which "
               "stops at its item 2); and the BODIES of the second seat's last four commits (9f95d404, 02a53907, 96c82245, a19a0ee1): the naval-line cure, the "
               "wiring census re-taken over the moved defence composer, the walker's pins re-keyed by identity, the lighting census re-frozen: they are recorded "
               "nowhere else"),
    extra='',
    state=("THE STATE, read by the chair from the commit subjects alone: after fdfd471d9 the second seat pushed the severity chips (b2682f74, d6b0526c), its "
           "hand-back and the lighting census (58a7b648, 76641eda), the census's reading (2dc3fe61), then the naval line (9f95d404) and its three register "
           "commits (02a53907, 96c82245, a19a0ee1). The lane holds the line at 9e57f5023 (point 48)."),
    work=("THE WORK, in this order, pushed as made:\n"
          "0. THE HAND-BACK, under a heading THE THIRD SEAT: first the naval-line cure written up from its four commit bodies and YOUR OWN RUN (what it changed; "
          "its measure on the 720; its guard green; the lane's governing suites green at the tip; the births byte-identical to the base, or the difference "
          "named).\n"
          "1. THE FINAL STATEMENT'S PARTS THAT NEED NO SUITE, as BRIEF-R3-TABS-2's item 3 lists them: the first census's counter at the base aac79b808 against the "
          "tip (re-run outside its pipe, its own exit read); the births byte-identical to the base (say how you measured); the reader's own instrument at the "
          "tip for the acceptance figures (classes A, A1, B, D, E, F, K at the line and at your tip; the 22 left in class E named with their holder); ONE draft "
          "shift record naming the six golden surfaces as moved or unmoved by measure.\n"
          "2. THEN ONE MESSAGE TO THE CHAIR AND WAIT FOR POINT 49. " + POINT49 + " On that word: the merge of the line's tip (a plain merge; say which commit); the "
          "instrument's page census on this lane's lines read, each hit cured or declared; the whole suite ONCE, in shards, every red classed against the base "
          "(the five files the first seat left unclassed re-run at the base: siteCoherenceRatchet, undercitySewerDerivation, foundingWorldBones, "
          "stressSummaryName, landingFixtureFreshness); the lighting census re-frozen through its door if you add a test file; the edge bundles checked last and "
          "committed alone if they differ; THE LANE'S ONE FINAL STATEMENT. What is NOT this lane's stays as BRIEF-R3-TABS-2 lists it."),
    merges="; on the chair's word, the merge of the integration line's tip",
    when="for a first message of open stops (if any), for a stop that blocks everything you have left, when steps 0 and 1 are pushed and you wait for point 49, and for your final statement or hand-back",
    turns="END YOUR TURN (by THE COUNT's way) after step 1 and after the final statement.",
)


# ---------------------------------------------------------------------------------------------------------------------
# THE SECOND GENERATION (2026-11-14, after the first hand-back by THE COUNT): a brief that is SELF-CONTAINED. A seat's
# onboarding reading (the brief chain, the handoffs, the hand-backs whole) was about a third of its mark. A second-generation
# brief carries the laws, the way of working and the statement's form in itself, and names only the sections a seat must open.
# ---------------------------------------------------------------------------------------------------------------------

WHY2 = (
    "WHO IS ASKING. The chair is the Claude Code session %s (your parent). The program moved to this account on 2026-11-14; no earlier session "
    "can be reached, and whatever a seat did not push is lost. In the chair's chat on 2026-11-14 the owner wrote: \"Continue with the pending work! ... I defer "
    "all decisions to you and give you all permissions you may require.\" This file is your whole assignment and carries the chair's rulings: no adjacent "
    "repair, however tempting. Merging the pull request and the deploy stay the owner's." % CHAIR
)

LAWS2 = (
    "THE LAWS FOR EVERY BRIEF (the program's, binding): Measure first. Never read a gate through a pipe. One cause per commit, red first. Registers only "
    "through their doors; pins re-keyed by identity, never loosened; never bank a baseline row or skip a test. A seat works in a scratch worktree of its lane and "
    "pushes plainly. Query big files by script. A count falling is not a cure. A claim of zero names the instrument that looked everywhere the words can print. "
    "A bound is proved on births the builder did not tune on. A rising row is origin (stop) or exposure (declared). A red is classed against the lane's reviewed "
    "base as well as the seat's own. The page shows ratings, never the machinery. A line is in its pool unless the town makes it false. A classifier's refusal "
    "is never routed round. A hand-back carries the rulings its seat worked to: the chair's messages are not on the branch.\n"
    "THE METHOD for every line you write or reword: (1) a line is READ WHERE IT PRINTS before it is pushed: three towns of its own cells, a siege, a famine or an "
    "occupation among them wherever it can print under one, the smallest and the largest size it reaches, the towns and what printed in the commit body; (2) a "
    "twin carries every condition its siblings carry; (3) a line that names a house, a role, a force or a good reads the roster; (4) a line that cannot be made "
    "true by its conditions is not written: silence is not a false sentence; (5) every cure that takes a line off some towns has its guard town; (6) a seat that "
    "rewords a sentence owns the whole sentence as it prints. No new key in the settlement record; no new word in the vocabulary file (a row that needs one is "
    "PARKED with its word); a name a user can hide by hand is never written into a stored, composed sentence; a claim of zero is counted on every surface (the "
    "tabs, the Tonight sheet, the PDF's text, the Foundry journal, the exports). A cure in generator or data code is a DECLARED MOVE: its field diff confined to "
    "the family you name, with counts; no draw added or moved unless declared."
)

def how2(branch):
    return (
        "HOW YOU WORK: a scratch worktree on a local branch at the lane's tip, `npm ci` there; plain pushes with the explicit refspec `git push origin "
        "<local>:refs/heads/%s` (the lane hook runs three fast gates), `git fetch` and merge BEFORE every push (a push git rejects falls into the whole check); "
        "PUSH AFTER EVERY ITEM AND BEFORE ANY LONG RUN. At every commit that touches src/: the strict-domain gate, the type ratchet and eslint on the touched "
        "files, each through `sh scripts/gate-tail.sh <command>`, never a pipe. A register moves only through its own door, in its own commit; where the door is "
        "the merge seat's, name the row and go on. Long runs to a file outside every repository tree; no dumps into your context. HAZARD: `npm ci` writes "
        "`core.hooksPath=.husky/_` into the shared local config, and tests that run git inside a hook from a linked worktree act on the real repository: snapshot "
        "refs and local config before and after every suite and every push, and compare. The ledger ref for the suite: `git fetch origin "
        "review-fixes-2026-07-08:review-fixes-2026-07-08`. Your clone is shallow (1,200 commits): deepen with `git fetch --deepen` if a merge base is missing." % branch
    )

STATEMENT2 = (
    "THE FINAL STATEMENT'S FORM (the program's, as the lanes' first briefs give it), once, at the final tip, in the lane's hand-back file: each count before and "
    "after on the census's 720 and on fresh seeds; the measuring seat's command (CENSUS-2: `git fetch origin lane/census-2-2026-11-13`; `mkdir -p <scratch>/c2 && "
    "git archive origin/lane/census-2-2026-11-13 docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>/c2`; `sh "
    "<scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree root> <an out-dir outside the repository> 4 --files <the lane's files, comma-separated>`, "
    "to a file) at the lane's base and at the tip, the count per kind, every hit in the lane's files read against its town (a hit is a candidate), its limits said "
    "beside any zero (the dossier's views only; it cannot see two lines disagreeing); the 720-birth field diff by family, each family one the lane declares; ONE "
    "draft shift record named for the lane, declaring moved or unmoved BY MEASURE the six golden surfaces AND every other registered surface that the whole "
    "suite's red titles pin (the register is tests/fixtures/.golden-freeze-register.json); the whole suite once, IN SIX SHARDS, every red classed against the "
    "line's own failing set at the lane's base (a red new on the lane is the lane's to cure through its door, or is named with its owner); the new words with "
    "their towns, for the owner's veto; FOR THE JOIN, whatever the lane names for the seat that joins the lanes; the edge bundles checked last and committed "
    "alone if they differ. Signing is the merge seat's: you run no golden's door in its writing mode."
)

COUNT2 = (
    "THE COUNT. You cannot read your own context count inside a turn, and seats on these lanes have run far past their mark in one unbroken turn. So AFTER "
    "EVERY ITEM (every pushed cure), and never more than forty-five minutes apart, with nothing running and everything pushed: schedule a message to yourself "
    "(the send_later tool of the claude-code-remote server; load it with ToolSearch; delay_minutes 1; message \"COUNT CHECK: read your own count, then go on or "
    "hand back\") and END YOUR TURN with a one-line status. When it wakes you, call get_session of the same server with no session_id and read "
    "external_metadata.context_usage.used_tokens: under %s, go on with the next item; at or over %s, bring your hand-back file current (what is done with its "
    "commits and counts; WHAT IS LEFT, line by line; how your instruments are re-made), push, send the chair ONE message (HAND BACK: the tip, what is left) and "
    "end your turn. If you have no such tool, or the field is absent or reads 0, say so in ONE line to the chair and end your turn: the chair reads your count "
    "and wakes you."
)


SEATS2 = {}

SEATS2['R2-CODE-A-7'] = dict(
    title="R2-CODE-A-7 · round two's first code lane: the nine rows left, its own reds, the final statement",
    branch='lane/r2-code-a-2026-11-13', tip='7175ec17', statement=True,
    intro=("You are R2-CODE-A-7, the seventh seat on round two's first code lane of the settlement-engine integration program (lane/r2-code-a-2026-11-13). The lane "
           "cures false lines in the founding paragraph, the history's origin, the arrival scenes, the pressure sentences and the people data: a line a page "
           "prints that the town's own record makes false (it names a house, a role, a force or a good the town lacks; it speaks of streets in a thorp; it buys "
           "by road under a siege). The sixth seat cured three writers and handed back at its context mark with its list written out. Yours: that list, the "
           "lane's own reds, and the lane's ONE final statement."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-13/R2-CODE-A-HANDBACK.md: SECTION 15 WHOLE (the sixth seat: its three commits with their measures and guards; its "
          "miss; the siblings its redraw exposed; \"Step 1 — NOT YET DONE\", items 1 to 9: THAT IS YOUR LIST; how the instruments are re-made) and, only where "
          "section 15 points you: section 12's list of MEDIUM rows (your item 9) and section 13's paragraphs on the census's writers and on the lane's own reds. "
          "The file is long: read those sections by line range, by script.\n"
          "3. THE LISTS the row numbers refer to: `git fetch origin lane/round-3-cut-2026-11-13`: docs/chair/2026-11-13/ROUND-3-CUT.json and "
          "ROUND-3-CUT-INCREMENT.json (key `lines`: each line's number, town, sentence, fact, writer; query by script, never print)."),
    work=("THE WORK, in this order, each writer its own commit, MEASURED FIRST on births in the app's own shape (section 15 says how the sixth seat built its 764 "
          "and its 160 crisis pairs), red first (a collected arm, never a bare seed loop), pushed as made:\n"
          "1. SECTION 15's ITEMS 1 TO 9, in its order, with these rulings: (item 1) THE PAGE NAMES A COURT ONLY WHERE A COURTHOUSE STANDS ON THE ROSTER (a line "
          "speaks of the town hall or the council, or is not written); a magistrate likewise. (item 3, the reeve row) if the row's own data in powerSiblings.js "
          "can carry the condition, cure it there; if the cure needs governanceNarrative.js, do NOT touch that file: write it under FOR THE JOIN (file, function, "
          "the one-line change, a test that reds until it is made) and go on: it is not a stop. (item 4) the roster's sanitiser, npcGenerator.js :: mergeNPCLists, "
          "beside the informant rule the fifth seat put there: a secret names merchants, a market or a guild only where the roster holds them. (item 7) under a "
          "siege nothing is brought in by road. THE SIBLINGS THE SIXTH SEAT'S REDRAW EXPOSED (\"They signed an order … whose seal is on it\" in three thorps; \"A "
          "petition … half their street\" in a hamlet of 20): RULED: a twin carries every condition its siblings carry: the same tier condition, in the item's own "
          "commit that touches that pool. (item 9) section 12's MEDIUM rows by file, then the increment's rows in the lane's files.\n"
          "A HAZARD THE SIXTH SEAT MET: the presumed-things walker reads EVERY literal under src/, not the files a governing set names: run "
          "tests/lint/presumedThings.walker.test.js at every commit that adds, splits or rewords a literal, and move its register only through its own door.\n"
          "2. THE LANE'S OWN TWO REDS through their doors (the wiring census's alias draft; a new pool's row), as section 13 names them. The two golden surfaces "
          "the fifth seat's founding cure moved are the merge seat's doors: NAME them with their measured figures in the draft shift record; open no golden's "
          "door.\n"
          "3. THEN ONE MESSAGE TO THE CHAIR (the tip; the counts) AND WAIT FOR POINT 49. " + POINT49 + " On that word: the merge of the line's tip (a plain "
          "merge; say which commit); the instrument's page census on this lane's lines read, each hit cured or declared; THE LANE'S ONE FINAL STATEMENT in the "
          "form below. PARKED and not yours: the six mentor rows (the powers lane); four lines that never print; the wayside shrine as a house of worship (ruled: "
          "the line stays; section 15 holds its FOR THE JOIN row)."),
    merges="; on the chair's word, the merge of the integration line's tip",
    when="for a stop that blocks everything you have left, when steps 1 and 2 are pushed and you wait for point 49 (the tip; the counts), and for your final statement or hand-back",
    turns='',
)


SEATS2['W2-C-LEAVES-7'] = dict(
    title="W2-C-LEAVES-7 · the third leaves lane: the twins on the PDF and the journal, the chain-state leaf, the added rows, the final statement",
    branch='lane/w2-c-leaves-2026-11-13', tip='2ae97291', statement=True,
    intro=("You are W2-C-LEAVES-7, the seventh seat on the third leaves lane of the settlement-engine integration program (lane/w2-c-leaves-2026-11-13). The lane "
           "cures false lines the page itself writes: the Economics tab and its twins on the PDF and the Foundry journal, and the display leaves its merged side "
           "branch held (the Defense tab's display, the Magic tab's role rows, the Resources tab). The sixth seat did its items 6 and 7 (the chain card's need "
           "sentence; the Outputs pills) and handed back at its context mark with its list written out. Yours: that list, and the lane's ONE final statement."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-13/W2-C-LEAVES-HANDBACK.md: PART 6 WHOLE (the sixth seat: its items, its six calls, which the chair ACCEPTS as "
          "written; \"Found, not mine\"; the reds classed; STATUS AT THE HAND-BACK, \"NOT STARTED, for the successor\", rows 1 to 6: THAT IS YOUR LIST; its probes and "
          "how each is run) and, only where PART 6 points you: PART 5's wording of the four added rows, and PART 4's item 9 (the measuring seat's command as this "
          "lane runs it) and item 10 (what this lane's statement adds to the form below). The file is long: read those parts by line range, by script."),
    work=("THE WORK, in PART 6's order, each writer its own commit, MEASURED FIRST on the lane's 720 births in the app's own shape and on the earlier seats' fresh "
          "180, red first, pushed as made:\n"
          "1. ITEM 8: the PDF's (src/pdf/sections/EconomicsTrade.jsx) and the Foundry journal's (src/foundry/journalPages.js) trade lists read the tab's ONE reader "
          "(tradeListDisplay.js), one call site each; both files are SHARED with other lanes: name every changed line in the hand-back; the pills counted on the "
          "720 on the three surfaces before and after: they must agree after.\n"
          "2. ITEM 9: the tab's crisis reader of a chain's state moves out of EconomicsTab.jsx into chainStateShown.js, exported, NO SECOND READER; the journal's "
          "chain line reads it (one call site); the PDF's chain flow (src/pdf/sections/SupplyChainFlow.jsx) is another lane's file: do not touch it: write the "
          "call site under FOR THE JOIN (file, function, expression, the one-line change, a test that reds until it is made). Cure there the file's one `any` "
          "(the domain any-cast baseline allows none). The sixth seat's read for this item: a River Mill card prints \"Running\" where the only mill is \"Access "
          "to external mill\" (r2r-hamlet-18, -29): RULED (record 375): a chain run only through an \"Access to ...\" row is not run here.\n"
          "3. ITEM 10: the measuring seat's command at your tip and at 4534ea5e3, every hit on the lane's writers read against its town, cured or named. WITH IT, "
          "THE COURT ROWS, RULED NOW: the page names a court only where a courthouse stands on the roster (record 422), and that reaches the 33 \"Legal "
          "Infrastructure · Court only\" rows that print beside a Town hall with a drawn \"Dispute arbitration\" (defenseDisplay.js :: courtOnRoster counts a "
          "drawn court service; they were judged true before that record): where no courthouse stands the row does not say \"Court\": it speaks of the town "
          "hall's hearings or the council's, in your words, READ WHERE IT PRINTS in three towns, or it is not written; display only; red first; a guard town; the "
          "new words listed for the owner's veto.\n"
          "4. THE FOUR ADDED ROWS (record 422; PART 5's wording): (a) #1013: a town whose only criminal house is a gambling house prints no structure note and no "
          "structure label (12 towns); (b) Arcane \"None\" is not printed beside an arcane power of any standing (9 more towns); (c) the PDF's \"Abundant\" kicker "
          "does not print for the grounds round a besieged town (src/pdf/sections/ResourcesProduction.jsx, 31 towns, one line, a shared file: named); (d) the four "
          "timber pills: read each in its town, cure or name.\n"
          "5. PART 6's row 5: the second merge's registers verified by their doors.\n"
          "6. THEN ONE MESSAGE TO THE CHAIR (the tip; the counts) AND WAIT FOR POINT 49. " + POINT49 + " On that word: the merge of the line's tip (a plain merge; "
          "say which commit); the TWO rows the merge seat banked by hand against src/domain/display/defenseDisplay.js at point 49 (the merge book, "
          "docs/INTEGRATION_STYLE_2_2026-11-09.md on the line, section 2k.5, commit 3628f37cc, reason `after-base`) cured and shrunk from the presumed-things "
          "register through its own door; the instrument's page census on this lane's lines read, each hit cured or declared; THE LANE'S ONE FINAL STATEMENT in "
          "the form below.\n"
          "THIS LANE'S OWN LIMITS, binding: NO RECORD BYTE MOVES ON THIS LANE (no generator is touched: every disagreement inside the record is counted and NAMED "
          "for the seat after the merges); EconomicsTab.jsx is AT its 600-line ceiling (eslint max-lines): THE CEILING IS NOT RAISED and no row is banked: new "
          "reading lives in the lane's display leaves; the prose-numerics baseline keys that file BY LINE: replace lines in place where you can; where a row "
          "falls, regenerate the baseline by the test's own scanner and LOWER the reviewed ceilings; never raise one. HAZARDS: remove a probe directory from the "
          "tree before a push (the hook lints the working tree); the first census's census.sh exits 0 when its counter fails: read the counter's own rows."),
    merges="; on the chair's word, the merge of the integration line's tip",
    when="for a stop that blocks everything you have left, when rows 1 to 5 are pushed and you wait for point 49 (the tip; the counts), and for your final statement or hand-back",
    turns='',
)


SEATS2['R2-CODE-B-6'] = dict(
    title="R2-CODE-B-6 · round two's second code lane: the side branch's merge, the census on the merged tree, the final statement",
    branch='lane/r2-code-b-2026-11-13', tip='14be74cf', statement=True,
    intro=("You are R2-CODE-B-6, the sixth seat on round two's second code lane of the settlement-engine integration program (lane/r2-code-b-2026-11-13). The lane "
           "cures false lines on the Tonight sheet, the cast cards, the crisis cast and hooks, the NPCs, Relationships, Services and Daily Life tabs and the "
           "stress summaries. It was split by file with a side seat (lane/r2-code-b-side-2026-11-13, at 5975515ad: the chain card's facts, PowerStrata, the "
           "quick guide, the traditions, the faith reading), whose seat is ended with its items pushed and a zero field diff. The fifth seat finished the main "
           "branch's rows and the chair's two added rows and handed back at its context mark. THERE IS NO SIDE SEAT: you merge that branch and close the lane."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-13/R2-CODE-B-HANDBACK.md: PART 5 WHOLE (the fifth seat: its items with their measures; FOR THE JOIN; THE PAGE "
          "RE-COUNT; \"Rows NOT reached\", rows 1 to 3: THAT IS YOUR LIST; its instruments and how they are re-made). The file is long: read PART 5 by line "
          "range, by script; open an earlier PART only where PART 5 points you.\n"
          "3. On origin/lane/r2-code-b-side-2026-11-13: docs/chair/2026-11-13/R2-CODE-B-SIDE-HANDBACK.md WHOLE (short: its eight items; THE REGISTER DOORS IT "
          "MOVED, which you re-make after the merge; its stops and parked items; FOR THE JOIN; its new words)."),
    work=("THE WORK, in this order, each writer its own commit, measured first, red first, pushed as made:\n"
          "0. ONE ROW RULED NOW, the fifth seat named it and left it: the wartime summary's LOSS text (src/generators/stressNarrative.js :: RENDERERS.wartime, "
          "this lane's file) says \"Supply caravans pass through on crown requisition\" in the 4 isolated wartime towns of the 800 (r2s-wartime-thorp-1 and "
          "-hamlet-3 among them): an isolated place has no caravans passing through: a declared twin of that sentence off an isolated route, true of the town, "
          "or the clause left out; a DECLARED MOVE of the stored summary (its field diff the stress summary only, with counts); a guard town.\n"
          "1. PART 5's ROW 1, THE CHAIR'S WORD GIVEN: merge origin/lane/r2-code-b-side-2026-11-13 at 5975515ad (a plain merge; say what conflicted); re-make "
          "through their own doors the registers its hand-back lists (the raw-colour budget, the phone chrome floor routes, the dossier phone floors, the "
          "lighting census); then the quick guide's food line onto the ONE home (tonightSheet.js :: foodBandOf). ONE message to the chair with the tip.\n"
          "2. PART 5's ROW 2: the measuring seat's command ONCE on the merged tree, over both seats' files, at the lane's base and at your tip: every hit read "
          "against its town, cured or named; the 720 field diff, base against tip, by family (the side branch's own was zero).\n"
          "3. THEN ONE MESSAGE TO THE CHAIR AND WAIT FOR POINT 49. " + POINT49 + " On that word: the merge of the line's tip (a plain merge; say which commit); "
          "the instrument's page census on this lane's lines read, each hit cured or declared; THE LANE'S ONE FINAL STATEMENT in the form below. Under FOR THE "
          "JOIN it names, not built: the side seat's stops (the fair's act and the Traditions tab's ELEMENT_NEEDS; the PDF's Traditions chapter; the chain "
          "card's items 1 and 2 once the card is handed the town's chains and imports); THE STORES' SPAN'S TWO HOMES (this lane's tonightSheet.js :: "
          "storesSpanWords and the defence lane's defenseDisplay.js :: monthsInWords, which disagree at a month and a half: one home at the join, measured on "
          "the 720 first); the wartime summary's one path through the data lane's rerenderStressSummary; the Power tab's seat line that prints a title twice "
          "(governanceAccount.js: sent to the powers lane by the chair)."),
    merges="; the merge of origin/lane/r2-code-b-side-2026-11-13 named in step 1; on the chair's word, the merge of the integration line's tip",
    when="for a stop that blocks everything you have left, when the side branch is merged and its registers re-made (the tip), when step 2 is pushed and you wait for point 49, and for your final statement or hand-back",
    turns='',
)


CORPUS2 = (
    "THE CORPUS, AND ITS OWN LAWS (binding; they add to the laws below). The corpus is the dossier's written lines: ONE source document, "
    "docs/content/RECEIPT_POOLS_DOSSIER_STATE.md, from which src/data/dossierStateProse/*.generated.js are generated. The source is edited; the generated files "
    "are regenerated ONLY by the doors, never by hand. The files every corpus commit moves (the wiring census, the prose shift register, the byte baseline, the "
    "count pins, the projection contract's silent lists) move through their own doors with every commit, as the lane's instruments do it (iterate.sh, doors.sh, "
    "bytes.mjs, push.sh: docs/chair/2026-11-13/probes/W2-WRITE-5/README.md on the lane: copy the folder out with git archive as the README says and run them "
    "from there; pin the directory in every helper; the main checkout's `git status` stays empty). In tests/domain/corpusCureGuards.test.js you only APPEND rows. "
    "A MIDDLE ROW OF A POOL IS NEVER STRUCK (the kernel pins ids to rows): it is reworded true in its case or declared off where false; only a pool's LAST rows "
    "are struck. NO DRAW ADDED OR MOVED; no new key in the record, no change of its shape. THE CORPUS METHOD, beside the method below: a line that names a "
    "house, a role, a force, a good or a place reads the record through a REGISTERED condition; a slot never prints a catalogue label and never breaks "
    "agreement; a line that says how the model works is not written; a line true somewhere is declared off the towns that make it false; a case left empty "
    "gets a line only if read true in three towns; every disqualifier cure has its guard, a fixed town in which the cured line must not print, its row added "
    "red BEFORE the cure in the same commit. RULED, the lane's list: parked rows stay parked (a row that waits on a word the vocabulary does not hold: "
    "practitioner, worked-here, capture, a council's member count, a chain's status, the survival band, the wayside shrine: listed with its word and left); "
    "every sentence that says what a town can pay reads ONE home, the economic survival row's band; never \"at peace\" of a town whose own pages say it is "
    "fighting; a force is a garrison, a militia (a household levy is one), a watch or a contracted company: \"no force\" where one stands is false; the "
    "hired-only place is another lane's reader: do not write round it; under a siege nothing comes in or goes out by road; the size words (plural streets, a "
    "square, quarters, districts) are an error in a small place; THE PAGE NAMES A COURT ONLY WHERE A COURTHOUSE STANDS ON THE ROSTER; plain words, never the "
    "machinery; every new or changed line goes on the lane's list of new lines with its towns. A walker that refuses a declaration is not routed round: the "
    "line is reworded, as the seventh seat did."
)

SEATS2['W2-WRITE-8'] = dict(
    title="W2-WRITE-8 · the corpus lane's main seat: the DS-DEF block's parts B to F, then the merge of the three and the final statement",
    branch='lane/w2-write-2026-11-13', tip='8e3526be', statement=True,
    intro=("You are W2-WRITE-8, the eighth seat on the corpus lane of the settlement-engine integration program (lane/w2-write-2026-11-13). The lane cures the "
           "false lines an independent reader found in the dossier's written corpus (59 of 151 new lines were false where they print). It is SPLIT BY BLOCK among "
           "three seats: YOU, the main seat, hold the DS-DEF block; two side seats hold DS-ECO and every other block, each on its own branch cut from dcd4759b0. "
           "The seventh seat cured eight of the ten rows left of part B and handed back at its context mark with its list written out. Yours: the rest, and later, "
           "on the chair's word, THE MERGE of the three and the lane's ONE final statement."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane: docs/chair/2026-11-13/W2-WRITE-HANDBACK-6.md WHOLE (95 lines: B's 27 against what is done; the seventh seat's items with their "
          "towns; WHAT IS LEFT, line by line; how the instruments are re-made; \"Found while reading\"); docs/chair/2026-11-13/probes/W2-WRITE-5/README.md (the "
          "instruments); and, only when a part needs it: W2-WRITE-HANDBACK-4.md's items 4 and 5 (part C's rows); W2-WRITE-HANDBACK-5.md's section THE MERGE "
          "(part G, on the chair's word: not before).\n"
          "3. THE LISTS: `git fetch origin lane/round-3-cut-2026-11-13`: docs/chair/2026-11-13/ROUND-3-CUT.json and ROUND-3-CUT-INCREMENT.json (key `lines`: each "
          "line's town, sentence, fact, writer; query by script, never print): a row is YOURS where its writer's file is "
          "src/data/dossierStateProse/defense.generated.js, or where its true writer is a DS-DEF pool."),
    work=("YOUR BLOCK: the `### DS-DEF-…` sections of the source document, and the generated twin defense.generated.js. You change NO other block's text.\n"
          "THE WORK, in this order, each cause its own commit, red first, pushed as made:\n"
          "B. THE TWO ROWS LEFT of the 27 (HANDBACK-6): #19 DS-DEF-9 NAMED chain v1 (the seventh seat's plan is in the file; v2 and v3 read with it) and #27 "
          "DS-DEF-2 neither walls nor force v8 (the style point). Then ONE line to the chair: B pushed (lines struck, reworded, declared, kept as true, over "
          "both seats).\n"
          "C. RE-READ UNDER THE METHOD the fourth seat's unreviewed rewordings in your block, as HANDBACK-6 lists them (HANDBACK-4's items 4 and 5; commit "
          "30895bb67's CHAIN defence supplied v1 to v3 and v5): a line that fails is cured.\n"
          "D. ROUND THREE'S REST in your block: the cut's rows in defense.generated.js (about forty, nine of them HIGH: the high first; #1075 and #1170 if they "
          "are DS-DEF's), by pool, the widest pool first. WITH THEM the two the seventh seat found while reading: DS-DEF-5 NO organized force at all v1 to v3 "
          "under an occupation; DS-DEF-11 WALLED-STRAINED v2 under an occupation, its slot printing a catalogue label.\n"
          "E. THE NEWLY FOUND LINES in your block: the increment's rows in defense.generated.js (about 23, three HIGH), and the measuring seat's candidates in "
          "DS-DEF (DS-DEF-3 Moderate v3 is the widest): for every pool you touch, ALL its firing variants are read. The cut's writer is a script's trace: find "
          "the true writer first; a line whose true writer is not the corpus (a selector, a renderer, a slot filler) is NAMED with its file and left.\n"
          "F. The measuring seat's command over defense.generated.js at dcd4759b0 and at your tip (the form below gives the command): every hit read against "
          "its town, cured or named.\n"
          "G. THEN ONE MESSAGE TO THE CHAIR AND WAIT. The two side seats hand their tips to the chair; the chair then gives the word for THE MERGE of both, "
          "exactly as HANDBACK-5's section THE MERGE gives it (eight steps; the proof that every pool's ids and draws equal the side that holds its block; the "
          "check that each side moved no block but its own), then the merge of the integration line's tip, then THE SEVEN FAITH POOLS the merge seat re-based by "
          "name at point 49 (DS-GEN-7 power_economic temple economy, DS-GEN-17 cathedral, DS-FTH-4 crusaderSynthesis, heresySuppression hunted and preached, "
          "religiousFraud, mageTheocracy: they must read the faith reading; the merge book's section 2k.5 on the line; the layer walker's REBASED_49D list is "
          "shrink-only: each pool leaves it as it is cured), then THE LANE'S ONE FINAL STATEMENT in the form below. " + POINT49 + "\n" + CORPUS2),
    merges="; on the chair's word, the merges of lane/w2-write-side-eco-2026-11-13, lane/w2-write-side-rest-2026-11-13 and the integration line's tip",
    when="for a stop that blocks everything you have left, when B is pushed (one line), at step G, and for a hand-back",
    turns='',
)


SEATS2['W2-WRITE-SIDE-REST-3'] = dict(
    title="W2-WRITE-SIDE-REST-3 · the corpus lane's other blocks: what is left of D and E, the census",
    branch='lane/w2-write-side-rest-2026-11-13', tip='eac3498e', statement=False,
    intro=("You are W2-WRITE-SIDE-REST-3, the third seat on the corpus lane's second side branch of the settlement-engine integration program "
           "(lane/w2-write-side-rest-2026-11-13, cut from the corpus lane at dcd4759b0). The lane cures the false lines an independent reader found in the "
           "dossier's written corpus. It is split by block among three seats; YOUR BLOCKS are every block but DS-DEF and DS-ECO (DS-POW, DS-GEN, DS-SUP, DS-STR, "
           "DS-WAR, DS-FTH, DS-REL, DS-POP, DS-CND, DS-HK). The second seat did most of part D and began E, and handed back at its context mark with every row "
           "left written out with its reading. Yours: those rows and the census; then you hand your tip to the chair. You make no statement: the main seat "
           "merges your branch."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your branch, docs/chair/2026-11-13/W2-WRITE-SIDE-REST-HANDBACK.md: the section \"SEAT 2\" WHOLE (how the instruments are re-made from nothing; "
          "the second seat's items with their towns; the rows already cured on a lane; the rows whose true writer is not the corpus; D LEFT; E LEFT, LINE BY "
          "LINE WITH ITS READINGS: THAT IS YOUR LIST; F LEFT; the shared files moved, for the merge) and the sections \"Instruments\" and \"For the main seat "
          "before it merges\" above it; and docs/chair/2026-11-13/probes/W2-WRITE-5/README.md (the instruments).\n"
          "3. THE LISTS: `git fetch origin lane/round-3-cut-2026-11-13`: docs/chair/2026-11-13/ROUND-3-CUT.json and ROUND-3-CUT-INCREMENT.json (key `lines`: each "
          "line's town, sentence, fact, writer; query by script, never print)."),
    work=("THE WORK, in this order, each cause its own commit, red first, pushed as made:\n"
          "1. D LEFT: #489 DS-GEN-14 FOUNDED-YOUNG v3 (re-said without the claim of one trade); #1076 DS-POW-4 Contested v3 with E's Contested rows. #72 (a "
          "one-member Elder Council) waits on the PARKED council member count: listed, left.\n"
          "2. E LEFT, pool by pool as the hand-back lists it, the high first. THE SECOND SEAT'S READINGS AND RECOMMENDATIONS ARE ACCEPTED BY THE CHAIR AS THE FORM "
          "OF EACH CURE, and each line is still READ WHERE IT PRINTS before it is pushed: DS-POW-4 Contested v1 and v3 say what the label holds (the challenger "
          "could now take the hall), never who has more people or more power; DS-POW-5 council v1, v2, v4 declared off a seat that is one person (`no ruler: "
          "lord`, a guard at a Royal Authority town), the headman and the one-member council left on the parked word; council v3 off a succession crisis, the "
          "religious conversion towns read before any second declaration; theocracy v3: no registered condition reads a rival creed: re-said without the creed, "
          "and NAMED for the main seat's faith reading; DS-POW-6 capture ADVANCING v1 to v3 read at this tip first, any line that asserts buying under way "
          "re-said as a disposition; RECOVERING v1 declared on organised crime through a registered condition, or re-said; the AGENT rung read in its town; "
          "DS-GEN-16 LEGACY-UNRESOLVED v1 and v2 and DS-WAR-5's Tonight line: FIND THE TRUE WRITER FIRST (a slot filler or another surface is named with its "
          "file and left); DS-GEN-13 craft guilds v1 re-said without the denial; \"a market, no guild\" v2 and v3 read in their towns; DS-GEN-17 GARRISONED v2 "
          "re-said without the payment (the survival band is parked); DS-FTH-4 hunted v2's armed men and DS-GEN-18 BOUGHT-IN v8's carts read where they print "
          "(a port; an isolated village; a town with no force).\n"
          "3. F LEFT: the measuring seat's command over your generated files (power, general, stressors, warFaith, and economy for DS-SUP-2) at dcd4759b0 and "
          "at your tip (`git fetch origin lane/census-2-2026-11-13`; `mkdir -p <scratch>/c2 && git archive origin/lane/census-2-2026-11-13 "
          "docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>/c2`; `sh <scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree root> <an "
          "out-dir outside the repository> 4 --files <your files, comma-separated>`, to a file, about twelve minutes each): every hit read against its town (a "
          "hit is a candidate), cured or named; the count per kind at both.\n"
          "THE SEVEN FAITH POOLS the hand-back names are NOT yours to change: the main seat cures them after it merges the integration line. The crown lines in "
          "self-governing wartime towns are not corpus lines (the hand-back names their four files): left.\n"
          "LAST: bring the hand-back current under a heading SEAT 3 (every row with what prints after; what is left; the shared files your branch moved, for the "
          "merge) and send the chair ONE message: your tip, the counts, no statement.\n" + CORPUS2),
    merges='',
    when="for a stop that blocks everything you have left, when your blocks are done (the tip, the counts), and for a hand-back",
    turns='',
)


SEATS2['W2-WRITE-SIDE-ECO-3'] = dict(
    title="W2-WRITE-SIDE-ECO-3 · the corpus lane's DS-ECO block: what is left of D and E, the three notes, the census",
    branch='lane/w2-write-side-eco-2026-11-13', tip='e0c1f8b6', statement=False,
    intro=("You are W2-WRITE-SIDE-ECO-3, the third seat on the corpus lane's DS-ECO side branch of the settlement-engine integration program "
           "(lane/w2-write-side-eco-2026-11-13, cut from the corpus lane at dcd4759b0). The lane cures the false lines an independent reader found in the "
           "dossier's written corpus. It is split by block among three seats; YOUR BLOCK is DS-ECO and nothing else (the `### DS-ECO-…` sections of the source "
           "document and the generated twin economy.generated.js). The second seat finished parts B and C, cured part D's high rows and handed back at its "
           "context mark with every row left written out. Yours: those rows, the three notes and the census; then you hand your tip to the chair. You make no "
           "statement: the main seat merges your branch."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your branch, docs/chair/2026-11-13/W2-WRITE-SIDE-ECO-HANDBACK.md WHOLE (64 lines: the rulings; B's and C's tables with what prints after; "
          "\"Named, not the corpus's\"; \"What is left, line by line\": THAT IS YOUR LIST; \"How the instruments are re-made\"; the shared files moved, for the "
          "merge) and docs/chair/2026-11-13/probes/W2-WRITE-5/README.md (the instruments).\n"
          "3. THE LISTS: `git fetch origin lane/round-3-cut-2026-11-13`: docs/chair/2026-11-13/ROUND-3-CUT.json and ROUND-3-CUT-INCREMENT.json (key `lines`: each "
          "line's town, sentence, fact, writer; query by script, never print): a row is YOURS where its writer's file is "
          "src/data/dossierStateProse/economy.generated.js, or where its true writer is a DS-ECO pool."),
    work=("THE WORK, in this order, each cause its own commit, red first, pushed as made:\n"
          "1. E's TWO HIGH ROWS FIRST: ww500 (DS-ECO-10 POSTURE vulnerable v3 under a siege) and ww1298 (DS-ECO-11 unexploited medium v2 beside a running timber "
          "chain): for each pool you touch, ALL its firing variants are read.\n"
          "2. D LEFT: the cut's MEDIUM rows by pool, the widest pool first, as the hand-back lists them (DS-ECO-9 SECURE v1 v3; DS-ECO-11 STRATEGIC v3; DS-ECO-11 "
          "unexploited medium v1 to v3; DS-ECO-12 INCOME WEIGHT religious v1, the house case; DS-ECO-10 entrepot v2; DS-ECO-12 house needs v2, re-read; "
          "DS-ECO-1 C5 v2 under a famine; DS-ECO-8 WEALTHY v1, STRUGGLING v3, MODERATE v4; DS-ECO-9 ACTIVE FAMINE v1 v3).\n"
          "3. E LEFT: the increment's other rows in economy.generated.js (about 23), and the measuring seat's candidates: DS-ECO-10 established v6 and none v2 "
          "(\"merchant\" with none on the roster), DS-ECO-12 INCOME WEIGHT religious v2, DS-ECO-11 fullyExploited v1. The cut's writer is a script's trace: find "
          "the true writer first; a line whose true writer is not the corpus (a selector, a renderer, a slot filler, the generator) is NAMED with its file "
          "under \"Named, not the corpus's\" and left.\n"
          "4. THE THREE NOTES: (i) DS-ECO-11, the exploitation pool: fullyExploited v2 and v4 under a siege (v1 and v3 are declared off it now): declare them "
          "off the crises that make them false, or re-say them; \"what it lacks is {institution}\" naming a house the town keeps, and \"takes the easy half\" "
          "beside a fuller, a dyer and weavers (partially v4: \"this trade\" has no referent): read them at your tip, cure what is false there, and say what "
          "can only be seen when the lanes are joined (another lane changed which variants the selector offers); (ii) THE CAN-PAY ROW BESIDE A DOOM LINE (the "
          "Defense tab's row \"… can pay its way through it\" beside \"may not come through this crisis\"; the defence lane counted it): FIND THE POOL. If it "
          "is DS-ECO's it is yours under the ruling \"every sentence that says what a town can pay reads ONE home, the economic survival row's band\"; if it "
          "is another block's, write its pool and variants under a heading FOR THE MAIN SEAT in the hand-back and leave it; (iii) DS-ECO-12's house-needs pool "
          "reads a false premise wherever the critical import's reason is itself false: do not write round a generator's fault: declare the pool off where its "
          "premise can be read false from the record, or leave it and say so.\n"
          "5. The measuring seat's command over economy.generated.js at dcd4759b0 and at your tip (`git fetch origin lane/census-2-2026-11-13`; `mkdir -p "
          "<scratch>/c2 && git archive origin/lane/census-2-2026-11-13 docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>/c2`; `sh "
          "<scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree root> <an out-dir outside the repository> 4 --files "
          "src/data/dossierStateProse/economy.generated.js`, to a file, about twelve minutes each): every hit read against its town (a hit is a candidate), "
          "cured or named; the count per kind at both.\n"
          "LAST: bring the hand-back current under a heading SEAT 3 (every row with what prints after; what is left; the shared files your branch moved, for the "
          "merge) and send the chair ONE message: your tip, the counts, no statement. THE MAIN SEAT WAITS ON YOUR TIP TO MERGE THE THREE: if your count nears "
          "its mark with rows of step 2 or 3 unread, the hand-back says which, and the chair decides whether they travel with the merge.\n" + CORPUS2),
    merges='',
    when="for a stop that blocks everything you have left, when your block is done (the tip, the counts), and for a hand-back",
    turns='',
)


# R3-CODE-C-6 is seated only when point 49 is on the line: LINE49 is then set to the line's tip (read from origin) and the brief generated.
LINE49 = '976db5b1'  # the line's tip with point 49, read from origin by the chair at 03:08 UTC on 2026-11-14

def _r3c6():
    assert LINE49, 'set LINE49 to the line tip that holds point 49 before generating this brief'
    return dict(
    title="R3-CODE-C-6 · round three's code lane: point 49's merge and the final statement",
    branch='lane/r3-code-c-2026-11-13', tip='dbe379c1', statement=True,
    intro=("You are R3-CODE-C-6, the sixth seat on round three's code lane of the settlement-engine integration program (lane/r3-code-c-2026-11-13). The lane "
           "cures false lines in domain, generator and display files no other lane held (the crisis vantage table, the outlook hooks, the foodways, the "
           "services' fallbacks). Its list is DONE: the fifth seat closed it and ended. What is left is the lane's landing work, and it is yours whole: the "
           "merge of the integration line, which now holds point 49 (the instrument lane), the instrument's findings on this lane's lines, and the lane's ONE "
           "final statement."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-13/R3-CODE-C-HANDBACK.md: the section \"THE FIFTH SEAT\" WHOLE (its items with their measures; the 108 census hits "
          "read; found on the way; what the fresh seat takes; the census's counts at base and tip, which serve your statement unless the merge changes what the "
          "lane's files print) and the third seat's \"FOR THE JOIN\". The file is long: read those sections by line range, by script.\n"
          "3. On origin/lane/merge-15-point-49-wip-2026-11-14 (the merge seat's save branch: `git fetch origin lane/merge-15-point-49-wip-2026-11-14`), the merge "
          "book docs/INTEGRATION_STYLE_2_2026-11-09.md: SECTION 2m ONLY, \"FOR EVERY LANE THAT MERGES THE LINE AFTER POINT 49\" (the instrument's walkers "
          "and registers, each door's checking and writing command, what a lane may never do). The merge seat was still writing it when this brief was "
          "written: THE CHAIR TELLS YOU WHEN IT IS PUSHED; if it is not there when you reach step 2, do step 1 and start the suite's shards meanwhile. The "
          "file has very long lines: find the section by script and read it by range."),
    work=("THE WORK, in this order, pushed as made:\n"
          "1. THE MERGE: `git fetch origin lane/integration-2026-11-07`; the line's tip was " + LINE49 + " when this was written (point 49 landed): merge the "
          "tip you read back (a plain merge commit; never a rebase; say which commit and what conflicted; a register or a bundle that conflicts is taken from "
          "one side and re-derived through its own script or door, never merged by hand; a conflict in src/ is listed with its resolution; one that needs a "
          "choice between two behaviours is a STOP). The edge bundles by `npm run build:edge-shared`, in their own commit.\n"
          "2. THE INSTRUMENT'S FINDINGS ON THIS LANE'S LINES, as the book's 2m gives the doors: each of the instrument's walkers run at your merged tip; every "
          "red that names a line, a literal, a pool row or a page line of THIS lane's files is cured (the line made true or declared through a registered "
          "condition) or leaves by the door's own shrink; a red on another lane's or the line's own carried set is NAMED with its owner and left; nothing is "
          "banked by hand.\n"
          "3. The measuring seat's command again ONLY IF the merge changed what the lane's files print (say how you know); otherwise the fifth seat's counts "
          "stand in the statement.\n"
          "4. THE LANE'S ONE FINAL STATEMENT in the form below (the whole suite once, in six shards, every red classed against the line's carried set and "
          "against the lane's base; the draft shift record; the new words of the whole lane gathered from the hand-back's sections; FOR THE JOIN; the edge "
          "bundles last and alone). Then ONE message to the chair: the tip, the suite's reds by class, the statement's place. A fresh reader then reads the "
          "lane: leave it what it needs."),
    merges="; the merge of the integration line's tip named in step 1",
    when="for a stop that blocks everything you have left, and with your final statement or hand-back",
    turns='',
    )


SEATS2['JOIN-REHEARSAL'] = dict(
    title="JOIN-REHEARSAL · every builder lane merged onto the line on a save branch, as a rehearsal: the conflicts, the gates, the count",
    branch='lane/join-rehearsal-2026-11-14', tip='976db5b1', statement=False,
    intro=("You are JOIN-REHEARSAL, a merge seat of the settlement-engine integration program. Ten builder lanes are curing false lines on the generated town "
           "pages, each on its own branch; when they are final they will be JOINED and landed on the integration line (lane/integration-2026-11-07, at "
           "976db5b19 with point 49). YOUR JOB IS A REHEARSAL OF THAT JOIN, NOW, at the lanes' tips as they stand, on a save branch of your own that starts at "
           "the line's tip: NOTHING reaches the line or any lane, nothing is signed. It buys three things: the join's real conflicts resolved once and recorded "
           "so the true join replays them; one tree that holds every lane's cures, on which the chair has fresh towns read; and one count of what the cures did "
           "together."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6) and CONTRIBUTING.md at your checkout.\n"
          "2. The chair's join map, on origin/lane/chair-2026-11-08 (`git fetch origin lane/chair-2026-11-08`): "
          "docs/chair/2026-11-14/probes/CHAIR/joinmap-0318.json (every pair of lanes merged in memory at 03:18 UTC on 2026-11-14: `pairs` gives each pair's "
          "conflicted files, `files` gives for each file the pairs that meet on it, `tips` the tips it used) and joinmap.py beside it (run it again yourself in a "
          "clone with FULL history to see the map at the tips you merge). Query the JSON by script.\n"
          "3. The merge book at your checkout, docs/INTEGRATION_STYLE_2_2026-11-09.md: section 5 (the gate per point) and, when it is pushed, section 2m on "
          "origin/lane/merge-15-point-49-wip-2026-11-14 (the instrument's doors, by command). Long lines: by script, in ranges. Do NOT read the rest of the book."),
    work=("FIRST: FULL HISTORY. A shallow clone gives WRONG merge bases and conflicts that are not real (measured by the chair: 31 false hunks in one file). "
          "`git fetch --depth=2147483647 origin` for the line and every lane below; `git rev-parse --is-shallow-repository` must print false before any merge.\n"
          "THE LANES, at their tips on origin when you merge each (read each tip back and write it down): lane/r3-code-c-2026-11-13, lane/r3-tabs-2026-11-13, "
          "lane/r2-code-a-2026-11-13, lane/powers-follow-up-2026-11-13, lane/w2-fix-data-2026-11-13 and then lane/w2-fix-data-history-2026-11-13 (if the data "
          "lane has not merged it yet), lane/w2-write-2026-11-13 then lane/w2-write-side-eco-2026-11-13 then lane/w2-write-side-rest-2026-11-13 (the corpus's "
          "three blocks), lane/w2-c-leaves-2026-11-13, lane/r2-code-b-2026-11-13, lane/coherence-upkeep-2026-11-12 (the defence lane, last: it meets the most). "
          "NOT the veil lane (lane/coherence-veil-2026-11-11): it lands alone after its security read. The lanes are being worked on while you merge: that is "
          "expected; a lane that has itself merged the line meanwhile is merged as it stands.\n"
          "THE WORK, in this order:\n"
          "1. YOUR SAVE BRANCH lane/join-rehearsal-2026-11-14 at the line's tip; a scratch worktree, `npm ci`, `git config rerere.enabled true` in that clone "
          "(so each resolution is recorded: say in your hand-back where the rerere cache is and commit a copy of your resolutions as patches under "
          "docs/chair/2026-11-14/probes/JOIN-REHEARSAL/).\n"
          "2. MERGE EACH LANE IN THE ORDER ABOVE, one merge commit a lane (never a rebase). BY THE CHAIR'S MAP only about nine CODE files truly conflict "
          "(src/domain/display/defenseDisplay.js and dossierViewModel.js; src/domain/generation/generationForkRegistry.js; src/domain/goods.schema.js; "
          "src/pdf/sections/EconomicsTrade.jsx, Services.jsx and SupplyChainFlow.jsx; src/components/new/tabs/EconomicsTab.jsx; scripts/lib/table-pools.mjs): "
          "each resolved BY HAND AT THE CAUSE so that BOTH lanes' cures stand, read whole first, listed in your hand-back with the hunks and what you kept; a "
          "conflict that needs a choice between two behaviours is written down with both sides and resolved to the side whose lane holds the file by its own "
          "commits, marked FOR THE CHAIR. EVERYTHING ELSE that conflicts is a register, a baseline, a pinned test, a generated file or a bundle (the wiring "
          "census, the lighting census, the presumed-things registers, the pool-dominance and page-census registers, the byte baseline, the phone floors, the "
          "tuning inventory, the mutation manifest, the writer-reach baseline, the walkers' pins, the edge bundles and their meta files, "
          "src/data/dossierStateProse/*.generated.js): IN THIS REHEARSAL take the side already on your branch and LIST the file: do not re-derive registers "
          "lane by lane. The corpus's source document (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md) is merged as text (one hunk against the line by the map: "
          "resolve it so both sides' lines stand); corpusCureGuards.test.js takes BOTH sides' appended rows.\n"
          "3. AT THE JOINED TREE, once: regenerate the corpus's generated files from the merged source document by the corpus's own generator (the corpus "
          "lane's docs/chair/2026-11-13/probes/W2-WRITE-5/README.md names it) and the edge bundles by `npm run build:edge-shared`; then the three gates, each "
          "through `sh scripts/gate-tail.sh`: `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`: a red here that comes of a merge "
          "resolution is cured; any other is LISTED with its lane, not cured. Then prove the tree GENERATES AND RENDERS: the measuring seat's command once, as "
          "a count (`git fetch origin lane/census-2-2026-11-13`; `mkdir -p <scratch>/c2 && git archive origin/lane/census-2-2026-11-13 "
          "docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>/c2`; `sh <scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <tree root> <an "
          "out-dir outside the repository> 4`, to a file, about twelve to twenty-five minutes): its eight kinds a to h on the JOINED tree beside the line's own "
          "figures (docs/chair/2026-11-13/CENSUS-2-2026-11-13.md on the chair's lane): THAT TABLE IS THE COUNT THE CHAIR WANTS.\n"
          "4. PUSH the save branch (the lane hook's three gates must pass: that is why step 3 comes first) and send the chair ONE message: the tip; the lanes' "
          "tips you merged; the code conflicts by file with one line each; the census's eight kinds, the line against the joined tree; what you listed and "
          "did not cure. DO NOT run the whole suite; DO NOT re-derive the registers; DO NOT sign anything: the true join does those once.\n"
          "5. THE HAND-BACK, docs/chair/2026-11-14/JOIN-REHEARSAL-HANDBACK.md on your branch: for the seat that makes the true join: the order that worked; "
          "every code resolution; EVERY register, baseline, pin, generated file and bundle you took one side of, with the door or script that re-derives it and "
          "the order the doors must run in (as far as the book's 2m and section 5 give it: name what you could not find); what the three gates met; how long "
          "each step took."),
    merges="; the merges of the lanes named above INTO your save branch",
    first=("FIRST ACT. Read the LINE's tip back from origin (lane/integration-2026-11-07): it was 976db5b1 when this was written. A later tip that adds "
           "documents only is not a stop: say so and start your save branch from it; any other difference: tell the chair before you start."),
    when="for a stop that blocks the whole rehearsal, and when the joined tree is pushed (step 4)",
    turns='',
)


SEATS2['W2-FIX-DATA-9'] = dict(
    title="W2-FIX-DATA-9 · the data lane: the rows left, the history branch's merge, the line's merge, the final statement",
    branch='lane/w2-fix-data-2026-11-13', tip='fb00318d', statement=True,
    intro=("You are W2-FIX-DATA-9, the ninth seat on the data lane of the settlement-engine integration program (lane/w2-fix-data-2026-11-13). The lane cures "
           "false lines written by the catalogue and the data tables: the institutions' descriptions and services, the stress summaries, the finished-goods and "
           "import tables. Its side branch (the history, culture and arrival files, lane/w2-fix-data-history-2026-11-13) is FINAL at 864948c8b and waits to be "
           "merged by this lane's seat. The eighth seat cured rows 3 and 4 and handed back at its context mark with its list written out. Yours: that list, the "
           "two merges, and the lane's ONE final statement."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane: docs/chair/2026-11-14/W2-FIX-DATA-HANDBACK-8.md WHOLE (60 lines: the instruments, re-made in minutes; the rows done, each with its "
          "measure; SECTION 2, WHAT IS LEFT, LINE BY LINE: THAT IS YOUR LIST; section 9, the rulings copied) and, only where its section 2 points you: "
          "docs/chair/2026-11-13/W2-FIX-DATA-HANDBACK-6.md section 8 (rows 5 to 7 as first written) and section 2 (the lane's own six named reds).\n"
          "3. On origin/lane/w2-fix-data-history-2026-11-13, when you reach the merge: docs/chair/2026-11-13/W2-FIX-DATA-HISTORY-HANDBACK.md (its red guards "
          "with their doors; the other lane's rows each marked; what it left).\n"
          "4. When you reach the line's merge: the merge book's section 2m on origin/lane/merge-15-point-49-wip-2026-11-14 "
          "(docs/INTEGRATION_STYLE_2_2026-11-09.md, the section headed \"## 2m.\": the instrument's walkers and doors, by command; about forty lines, by script)."),
    work=("THE WORK, in the hand-back's order, each writer its own commit, MEASURED FIRST on the lane's births in the app's own shape and on the reader's own town, "
          "red first (each a collected arm, never a bare seed loop), pushed as made:\n"
          "1. SECTION 2's ROWS 1 TO 6, with these rulings: THE FARRIER, CONFIRMED: the stable district's \"farriery\" is the house's own trade (a house's "
          "description speaks of the house): READ TRUE, the line stays, the measuring seat's hit is named as not a fault. \"HUNDREDS OF HOUSES OF WORSHIP\" for "
          "50 to 100 and more: a figure true of the range, reworded WITHOUT the district words or declared through the lane's twin table, then the "
          "presumed-things door's `--shrink`: the door banks no new line and that refusal is final. The river boatyard's fishing boats: NAMED for the seat after "
          "the merges (the food record is born after the draw): accepted, left. The Mine's patch (docs/chair/2026-11-13/W2-FIX-DATA-5-item1229.patch): apply, "
          "measure, read, red first. Row 5 (the services under a siege or a famine: read each first: a coastal siege may still land fish). Row 6 (the "
          "finished-goods and import tables: each a disqualifier read from the chain model's leaf or the roster, or parked with its word). Row 7 (read, then "
          "cure or name). THE SLAVE REVOLT'S NOTE (src/data/stressTypes.js, \"everyone who keeps order is busy containing the revolt\"): measured first (which "
          "surfaces print it; in how many slave-revolt towns no force stands: a garrison, a militia or household levy, a watch, a contracted company); the "
          "lane's form for a stored crisis note: through its declared sets at assembleSettlement.js :: rerenderStressSummary ONLY, a twin true of the town or "
          "nothing; that note's own lines only (the crown lines there stay parked).\n"
          "2. STEP 8: the measuring seat's command at your tip and at the lane's base, every hit in the lane's files read against its town, cured or named "
          "(the hand-back lists four hits in PAIRS not yet in any row).\n"
          "3. THE HISTORY BRANCH, THE WORD GIVEN: FIRST make your history whole (`git fetch --depth=2147483647 origin lane/integration-2026-11-07 "
          "lane/w2-fix-data-2026-11-13 lane/w2-fix-data-history-2026-11-13`; `git rev-parse --is-shallow-repository` prints false: a shallow clone gives WRONG "
          "merge bases and false conflicts). Merge origin/lane/w2-fix-data-history-2026-11-13 at 864948c8b (a plain merge: the chair's in-memory merge of the "
          "two is CLEAN; the wiring census, the presumed-things door and the pin count re-run after it, each through its own door). THEN WHAT THAT SEAT LEFT, "
          "RULED: (a) the Succession Crisis event in a town a council governs today is not a fault by itself (\"the ruler of the time\" is a past ruler): the "
          "event stays and its selection is not changed; a fault IS a variant, a description or a lasting effect that speaks of a ruler in the PRESENT in such "
          "a town: declared off, or put into the past; (b) the succession hooks under a priest-ruled council (10 of 115 towns): read, and declared off what is "
          "false of a council of clergy; (c) the one hook left under an elders' rule (\"A would-be heir approaches outsiders\"): read it in three elders' towns "
          "and SAY whether \"heir\" is false of a council's seat; the succession hook pool's dominance (0.81 against a ceiling of 0.64) is CARRIED RED TO THE "
          "CLOSING ACTS, named: no hand edit, no line written for it. ONE message to the chair: the tip, the counts.\n"
          "4. THE LINE, THE WORD GIVEN: point 49 is on the line (lane/integration-2026-11-07 = 976db5b19 when this was written). Merge the line's tip as you "
          "read it back (a plain merge; say which commit). BY THE CHAIR'S IN-MEMORY MERGE the conflicts are 15 files and NO CODE: wiring-census.json, "
          ".prose-byte-baseline.json, pool-dominance.register.json, the two presumed-things registers, and the edge bundles with their meta files: each taken "
          "from ONE side and re-derived through its own door or script (the bundles by `npm run build:edge-shared`, alone, last), never merged by hand. IF "
          "registeredWords.js, vocabularyPageFindings.js or the door's script conflict, your history is not whole: STOP and fix the fetch. Then every check "
          "section 2m lists, each red on this lane's lines cured or declared through its door; the page census on this lane's lines.\n"
          "5. THE LANE'S ONE FINAL STATEMENT in the form below.\n"
          "THIS LANE'S OWN LIMITS, binding: PARKED ROWS STAY PARKED (a row that needs a word the vocabulary does not hold: a tannery, a cloth trade, a monarch, a "
          "marsh, a crown: listed with its word and its towns, and left). THE POOL GUARD'S ONE ROW (resource_scarcity) is CARRIED RED to the closing acts, "
          "named: no hand edit of the register, no new mode in the guard. THE THREE customContentPresentationClaims titles stay red and named until the lanes "
          "are joined (their cause is src/domain/dossier/faithReading.js, cured on another lane): do not touch that file; do not weaken the test. THE LANE DOES "
          "NOT GO TO THE MERGE SEAT RED ON ITS OWN GUARDS: when you move a guard's ground, the guard moves through its own door in the same or the next commit; "
          "at the end the lane's own red count is the six named, or fewer. A HAZARD an earlier seat met: if a push of yours reads back anything but `<your "
          "previous tip>..<your new tip>`, stop and tell the chair with both lines."),
    merges="; the merge of origin/lane/w2-fix-data-history-2026-11-13 named in step 3; the merge of the integration line's tip named in step 4",
    when="for a stop that blocks everything you have left, when step 3 is pushed (the tip, the counts), and for your final statement or hand-back",
    turns='',
)


# THE REHEARSAL OF THE BAR: a reader seat on the joined rehearsal tree. JOINED is set to that tree's tip (read from origin) before generating.
JOINED = None

def build_bar():
    assert JOINED, 'set JOINED to the join rehearsal branch tip before generating this brief'
    head = (
        "# BRIEF: REVIEW-BAR-0 · a rehearsal of the bar: the known list placed on the joined tree, and ten fresh towns read cold\n\n"
        "The seat's assignment, written by the chair as a file on 2026-11-14 and named in the seat's first message. The chair is the Claude Code session "
        "%s. Checked out at `lane/join-rehearsal-2026-11-14`; the seat's own branch `lane/review-bar-0-2026-11-14`; a clone of 1200 commits; effort high; the "
        "model as the chair's records of that day give the mix. A SELF-CONTAINED brief. Rulings sent after it are in the chair's records.\n\n---\n\n" % CHAIR
    )
    body = '\n\n'.join([
        ("You are REVIEW-BAR-0, an independent reader of the settlement-engine integration program. You fix nothing and you change nothing on any branch you "
         "read. THE RELEASE IS HELD until a fresh round of thirty generated towns, read thoroughly and cold, shows NO high and NO medium false sentence (the "
         "bar). Ten builder lanes have been curing false sentences, each on its own branch; a rehearsal seat has merged them all onto one tree: "
         "lane/join-rehearsal-2026-11-14 at " + JOINED + ". YOUR JOB IS TO MEASURE THAT TREE AGAINST THE BAR, as a rehearsal: how many false sentences a town "
         "still prints, of what kinds, and whose files write them. The count you return decides where the next week's work goes. A false sentence you miss "
         "is the costly error; a true sentence you list wastes a builder's hour."),
        WHY2,
        ("READ FIRST, and no more than this:\n"
         "1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6) at your checkout.\n"
         "2. THE READERS' SCALE AND TOOLS, on origin/lane/round-3-cut-2026-11-13 (`git fetch origin lane/round-3-cut-2026-11-13`): "
         "docs/chair/2026-11-13/probes/REVIEW-R2-STAGES/READER-BRIEF.md WHOLE (the kinds a to h, the three severities, what is NOT a fault, the output's form: "
         "your scale and your readers' brief) and the tools beside it (births.mjs, render.sh and its render file, merge-cold.mjs: how a town is born in the app's "
         "own configuration shape and its whole owner view rendered to a text file, every group, sub-tab and disclosure opened); "
         "docs/chair/2026-11-13/ROUND-3-CUT-2026-11-13.md, THE HEADLINE and section 1 \"PLACE\" only (how a list of sentences is placed on a tree's pages by "
         "script, and the re-deal caveat), with its probes under docs/chair/2026-11-13/probes/ROUND-3-CUT/ (place.mjs, matrix.mjs, redeal.mjs) and its data "
         "docs/chair/2026-11-13/ROUND-3-CUT.json and ROUND-3-CUT-INCREMENT.json (key `lines`; query by script, never print). Copy the tools out with git archive; "
         "run them from outside every repository tree.\n"
         "DO NOT open any lane's hand-back, any other file under docs/chair/, or any commit message: THIS READ IS COLD."),
        ("FIRST ACT. Read your checkout's tip back from origin (lane/join-rehearsal-2026-11-14): it was " + JOINED + " when this was written. If it has moved, "
         "read the tree at the tip you find and say which in your report."),
        ("THE WORK, in this order:\n"
         "A. THE KNOWN LIST, PLACED (cheap; first; push its table before B). Render the cut's twenty towns (its own seeds and render) at the joined tree and "
         "at the line's tip (origin/lane/integration-2026-11-07) and place the cold list's lines on both with the cut's own matcher: HIGH, MED and LOW still "
         "printing at each, beside the cut's own figures (189 HIGH and 652 MED at the line on 2026-11-13; its forecast 101 and 449). THE RE-DEAL CAVEAT, "
         "measured: how many of the twenty towns keep their identity on the joined tree (the same cast, powers and roster as on the line): a listed sentence "
         "that no longer prints in a re-dealt town is NOT counted as cured: give the table for the towns that kept their identity, and the rest apart. The same "
         "for the increment's list and its seeds.\n"
         "B. TEN FRESH TOWNS, READ COLD AND WHOLE, at the joined tree. Ten seeds nobody has read, born the way the app births them (the configuration panel's "
         "shape; every other dial random as shipped): a thorp (calm); two hamlets (calm; under siege); two villages (famine; calm); two towns (occupied; calm); "
         "two cities (under siege with famine; wartime); a metropolis (calm). Name the seeds in the reader's pattern with the prefix `bar0`. For each town: the "
         "whole owner view rendered to one text file, and its record beside it. EVERY LINE OF EVERY PAGE is read as the town's owner reads it and each candidate "
         "is VERIFIED AGAINST THE RECORD by a query before it is listed, by the READER-BRIEF's kinds and severities, ONE version (the joined tree). Spread the "
         "towns over helper agents of your own if your harness offers them (each given the READER-BRIEF adapted to one version, its towns, and nothing else: "
         "they are cold); check a sample of what each returns (a listed sentence that is true; a page region nobody listed anything in: read one yourself). "
         "Merge their lists into ONE (the reader's merge tool), each row: town, tab, the sentence exactly as printed, kind, mechanism, the fact against it, "
         "severity.\n"
         "C. WHOSE LINES. For every HIGH and MED row of B: the writer (the source file and the function or pool id: `git grep -n -F` a fixed run of the "
         "sentence in the joined tree; a composed sentence is traced to the leaf that wrote the false part) and the lane that holds that file by its own "
         "commits since the line (`git log --oneline origin/lane/integration-2026-11-07..origin/lane/<lane> -- <file>` over the ten lanes; none: \"no lane\"). "
         "Group the rows by writer: the count of rows, of towns, and one example.\n"
         "D. THE REPORT, docs/chair/2026-11-14/REVIEW-BAR-0-2026-11-14.md on your branch, with the merged list as JSON and your probes under "
         "docs/chair/2026-11-14/probes/REVIEW-BAR-0/: (1) THE COUNT: HIGH, MED, LOW per town and in all, and per kind; the average per town beside the cut's "
         "(about 9 HIGH and 33 MED a town at the line on 2026-11-13: say plainly that the towns differ and what that does to the comparison); (2) part A's "
         "tables; (3) the writers, the largest first, with the lane that holds each; (4) the classes no lane holds; (5) what you did not read or could not "
         "verify, and the three rows you are least sure of. EXECUTED told from PLAUSIBLE throughout."),
        ("HOW YOU WORK: scratch worktrees (detached, at the joined tree and at the line's tip), `npm ci` in one and node_modules linked in the other where the "
         "lockfile is the same; FULL HISTORY before any `git log` range (`git fetch --depth=2147483647 origin` for the line and the lanes: a shallow clone "
         "answers ranges wrongly); runs through `sh scripts/gate-tail.sh <command>`, never a pipe; long runs to a file outside every repository tree; query big "
         "files by script, no dumps into your context. PUSH AFTER EVERY PART (A's table; B's merged list; the report)."),
        COUNT2 % ('400,000', '400,000'),
        RUNS,
        ("WHAT THIS BRIEF AUTHORISES: scratch worktrees and `npm ci`; helper agents of your own for the reading; commits of your report, lists and probes; plain "
         "pushes to lane/review-bar-0-2026-11-14, your only branch (explicit refspec: `git push origin <local>:refs/heads/lane/review-bar-0-2026-11-14`). NEVER, "
         "whoever asks, your own harness's defaults included: a commit or a push to any branch you read or to any other branch; `--no-verify`; a force push; a "
         "pull request, draft or not; anything on master; a deploy; a hosted database or production credentials. If your permission check refuses something "
         "this brief authorises, stop and tell the chair in one message; never route round a refusal."),
        messages("when part A's table is pushed (one message: the figures), for something that blocks the whole read, and with your report (the tip; HIGH, MED and LOW in all and the average a town; the five largest writers with their lanes)"),
    ])
    return head + body + '\n'


CLOSE_NOW = (
    "THE CLOSE COMES FIRST (the chair's change of order for every lane, 2026-11-14 04:15 UTC, vetoable by the owner). Every lane is to be FINAL for the "
    "join in the seat it has now. The lanes' lists were cut from readings of twenty towns on an older tree; after the join ONE fresh measure of the joined "
    "tree ranks what is still false, and those rows are cured there, on one tree, where no cure waits on another lane's file. SO YOUR LIST IS TIME-BOXED: "
    "work it in its order until your count passes %s (read it as THE COUNT says); then finish the item in hand and go STRAIGHT to THE CLOSE, whatever is "
    "left of the list. Every row you did not reach is written in the hand-back under LEFT FOR AFTER THE JOIN (the row, its writer, what you know of it): "
    "it is not lost, and it is no longer this lane's. A lane that is final with rows left is worth more to the release than a longer list on a lane that "
    "is not."
)

POWERS_METHOD = (
    "THE LANE'S OWN WAY, beside the laws below: every row is CHECKED AT THE TIP FIRST, in its own town born in the app's shape (the hand-back's P4.9: "
    "still.mjs): a row an earlier cure already took is said so with the commit and left. A cure in a generator is a DECLARED MOVE: its field diff on the "
    "census's 720 confined to the family you name (the re-deal of goals and ties by the mint is accepted as DECLARED: say its counts). ONE CAUSE, ONE "
    "COMMIT. Every possessive of a power through the lane's one leaf (never \"Guilds's\"); the page shows ratings, never the machinery (no identifier, no "
    "modifier key). HAZARD, bitten by the last seat: a push with nothing to send, or one git rejects, falls into the pre-push hook's WHOLE suite, and a "
    "test in it that runs git from a linked worktree rewrote the local branch and the shared config: use the last seat's push.sh "
    "(docs/chair/2026-11-13/probes/POWERS-11/: it refuses a push with nothing to send), and compare refs and config after every push."
)

SEATS2['POWERS-12'] = dict(
    title="POWERS-12 · the powers lane's close: M1, the raw modifier, one guard, then the line's merge and the stage's statement",
    branch='lane/powers-follow-up-2026-11-13', tip='57cdd341', statement=True,
    intro=("You are POWERS-12, the seventh seat on the powers lane of the settlement-engine integration program (lane/powers-follow-up-2026-11-13). The lane "
           "holds who rules a town and who contests it: the powers' standing and claims, titles and honorifics, people's goals, ties and secrets. A reader "
           "found its last stage NOT CLEAR on four medium findings; the sixth seat cured the lane's own red tests and the claim table's low rows, designed "
           "and measured the largest medium (M1) and handed back at its context mark. Yours: M1 built, two more items, and THE LANE'S CLOSE."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-13/POWERS-FOLLOW-UP-HANDBACK-2.md, BY LINE RANGE, BY SCRIPT (the file is 1,100 lines; open only these): PART 5 "
          "WHOLE (from the line \"# PART 5\" to the end: the rulings in force, what the sixth seat cured, L2's RungContext, the hazard, P5.10 WHAT IS LEFT, "
          "P5.11 the instruments) and P4.9 (the instruments). P4.8's four rows of the raw modifier only (ww#639 ww#980 pf#1 pf#23).\n"
          "3. The reader's findings you close: on origin/lane/chair-2026-11-08 (`git fetch origin lane/chair-2026-11-08`), "
          "docs/chair/2026-11-13/REVIEW-POWERS-96a6ced46-2026-11-13.md, the sections headed L4, L5 and L7 only.\n"
          "4. At THE CLOSE: the merge book's section 2m on origin/lane/merge-15-point-49-wip-2026-11-14 (docs/INTEGRATION_STYLE_2_2026-11-09.md, the "
          "section headed \"## 2m.\": about forty lines; by script)."),
    work=(CLOSE_NOW % '180,000' + "\n"
          "THE LIST, in this order, measured first, red first (a collected arm, never a bare seed loop), pushed as made:\n"
          "1. M1, AS P5.10's ITEM 1 DESIGNS IT (the five commanding claims beside Minor or Suppressed: 122 towns of the 720; five rows of "
          "power/claimStanding.js :: CLAIM_RUNGS on the context L2 built). THE DESIGN IS ACCEPTED BY THE CHAIR AS THE FORM OF THE CURE; each rung is still "
          "READ WHERE IT PRINTS before it is pushed, and the class is counted to zero on the 720 and on the lane's 4,305. One line to the chair when it is "
          "pushed.\n"
          "2. THE RAW MODIFIER on the Power tab (\"arcane-advised\", \"military-dominated\", \"theocratic-aligned\": P4.8's ww#639 ww#980 pf#1 pf#23). COUNT "
          "IT FIRST on the 720 (every page that prints a modifier key). RULED: an identifier is never printed; a modifier prints in plain words only where "
          "the town's own record bears it out (an arcane house stands; a force stands; the faith is not subordinate to the seat), else nothing. Measure "
          "what reads the stored modifier: the cure is at DISPLAY unless nothing else reads it.\n"
          "3. L4: the guard the reader found missing (its section names the cure and its plant).\n"
          "THE CLOSE, each step its own commit or commits:\n"
          "4. The measuring seat's command at the stage's base 96a6ced46 and at your tip (the form below gives it), every hit in the lane's files read.\n"
          "5. THE MERGE OF THE LINE (the word is given): full history first (`git fetch --depth=2147483647 origin lane/integration-2026-11-07 "
          "lane/powers-follow-up-2026-11-13`; `git rev-parse --is-shallow-repository` prints false; the base is e969a75b7); the line's tip as you read it back "
          "(976db5b19 when this was written; a plain merge; say which commit and what conflicted). BY THE CHAIR'S TRIAL MERGE OF 57cdd341: 10 conflicted "
          "files, NO CODE (wiring-census.json, pool-dominance.register.json, the edge bundles and their meta files): each taken from ONE side and re-derived "
          "through its own door or script (the bundles by `npm run build:edge-shared`, alone, last); a code conflict means the base is wrong or a side "
          "moved: look before resolving. THEN: every check section 2m lists; the THREE ROWS BANKED AGAINST THIS LANE (2m's part (3): dmPowerLines.js "
          "rulingFaces \"The ruling three of \" and \"The ruling two of \"; rulerKin.js, the strip site FACTION_LABEL_SIBLINGS['Military/Guard']) cured and "
          "shrunk out as 2m gives it; THE TUNING INVENTORY'S SIX ROWS (corruption.js's tables, \"dependents moved\", cause 59f877e58) by the inventory's own "
          "ritual as 2m's part (4) gives it: THE CHAIR NAMES THE POINT NOW: on the clean committed tree right after the merge's registers. A door's "
          "refusal you cannot cure is a STOP to the chair with the door's output: nothing is banked by hand.\n"
          "6. ONLY IF YOUR COUNT IS UNDER 300,000 THEN: #312 (people/goals.js reads the chain leaf, which arrived with the merge) and ww#656 with it (the "
          "chair's ruling in P5.0), each its own commit; else both are LEFT FOR AFTER THE JOIN.\n"
          "7. THE STAGE'S STATEMENT in the form below, for the stage 96a6ced46 to your tip: L5 closed in it (the declaration names the three families the "
          "tie re-deal moves: conflicts, prominentRelationship, pressureSentence, with their counts) and L7 (the draft record's figures for the generator "
          "golden master and the Herald desk measured at YOUR tip); L1, L3 and L6 listed as low and left; the new words with their towns; FOR THE JOIN "
          "gathered whole (P4.2b, the seat line's doubled title, table-pools.mjs's one row); and LEFT FOR AFTER THE JOIN: P4.8's 40 other lines by file as "
          "they stand there (say only which of them your cures took), P4.7's rows, the card's title on a man, P5.10's rows not reached. A fresh reader "
          "then reads the stage as a diff from 96a6ced46: leave it what it needs.\n" + POWERS_METHOD),
    merges="; the merge of the integration line's tip named in step 5",
    when="for a stop that blocks everything you have left, when M1 is pushed (one line: the count), when the line's merge and its registers are pushed (the tip; what conflicted), and with your statement or hand-back",
    turns='',
)


SEATS2['W2-C-LEAVES-8'] = dict(
    title="W2-C-LEAVES-8 · the third leaves lane's close: its own rising row, the court rows, the added rows, the line's merge, the final statement",
    branch='lane/w2-c-leaves-2026-11-13', tip='4576cfc6', statement=True,
    intro=("You are W2-C-LEAVES-8, the eighth seat on the third leaves lane of the settlement-engine integration program (lane/w2-c-leaves-2026-11-13). The "
           "lane cures false lines the display leaves write: the Economics tab's chain cards, goods pills and food sentences, the PDF's and the Foundry "
           "journal's trade lists, and the Defense tab's supporting rows. The seventh seat made the three surfaces print one trade list and one chain state, "
           "ran the measuring seat's command at both ends and handed back at its context mark with its list written out. Yours: a short list inside a "
           "time-box, and THE LANE'S CLOSE."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-13/W2-C-LEAVES-HANDBACK.md, BY LINE RANGE, BY SCRIPT (the file is 1,130 lines; open only these): PART 7 WHOLE "
          "(from the line \"# PART 7\" to the end: the rulings in force, items 8 and 9, the calls taken, FOR THE JOIN, CENSUS-2's counts at both ends and "
          "ITS RISING ROW, STATUS with WHAT IS LEFT line by line, the instruments); in PART 6 the section \"STATUS AT THE HAND-BACK\" (its row 5); in PART "
          "5 the section of the chair's rulings (the four added rows in their own words).\n"
          "3. At THE CLOSE: the merge book's section 2m on origin/lane/merge-15-point-49-wip-2026-11-14 (docs/INTEGRATION_STYLE_2_2026-11-09.md, the "
          "section headed \"## 2m.\": about forty lines; by script)."),
    work=(CLOSE_NOW % '180,000' + "\n"
          "THE LIST, in this order, each cause its own commit, measured first on the 720 and the fresh 180, red first (a collected arm, never a bare seed "
          "loop), pushed as made:\n"
          "1. THE LANE'S OWN RISING ROW (PART 7's census: chainNeedShown.js, kind d, 0 -> 13 towns, every one under a siege: \"Operating at minimal capacity "
          "or shut down.· covers Grain, Livestock / game, ...\"). A rising row of the lane's own origin is cured before anything else: READ IT WHERE IT "
          "PRINTS first. RULED: the page shows no chip row of machinery (\"covers X, Y\" is one): where the need box prints the record's impact sentence, "
          "nothing is run on to it; if \"covers\" is a line the tab means the owner to read, it is its own line in plain words, true of the town.\n"
          "2. THE COURT ROWS (record 422, ruled): the 33 \"Legal Infrastructure · Court only\" rows beside a Town hall with a drawn \"Dispute arbitration\" "
          "(defenseDisplay.js :: courtOnRoster counts a drawn court service). THE PAGE NAMES A COURT ONLY WHERE A COURTHOUSE STANDS ON THE ROSTER: where "
          "none stands the row speaks of the town hall's or the council's hearings, read where it prints in three towns, or it is not written; display "
          "only; a guard town; the new words listed for the owner's veto.\n"
          "3. THE FOUR ADDED ROWS, as PART 7's STATUS lists them: (a) #1013, the lone gambling house; (b) Arcane \"None\" beside an arcane power or a named "
          "mage; (c) the PDF's \"Abundant\" kicker under a siege (src/pdf/sections/ResourcesProduction.jsx is shared: ONE line, named in the commit); (d) "
          "the charcoal burner's four \"timber\" pills read, cured or named.\n"
          "4. CENSUS-2's OTHER HITS on the lane's writers (PART 7's table; the out-dirs are lost: re-run it only at your tip, at THE CLOSE): RANK the "
          "lane's writers by towns hit; read the widest; cure or name, while the time-box lasts.\n"
          "THE CLOSE, each step its own commit or commits:\n"
          "5. PART 6's row 5 (the second merge's registers verified by their doors).\n"
          "6. THE MERGE OF THE LINE (the word is given): full history first (`git fetch --depth=2147483647 origin lane/integration-2026-11-07 "
          "lane/w2-c-leaves-2026-11-13`; `git rev-parse --is-shallow-repository` prints false; `git merge-base --all origin/lane/integration-2026-11-07 HEAD` "
          "prints TWO bases, 817980b33 and 69b53decd); the line's tip as you read it back (976db5b19 when this was written; a plain merge; say which commit "
          "and what conflicted). BY THE CHAIR'S TRIAL MERGE OF 4576cfc6: 11 conflicted files. CODE, by hand at the cause, the file read whole, both sides' "
          "cures standing: src/domain/goods.schema.js ONLY. THE REST (docs/content/wiring-census.json, tests/components/phoneChromeFloor.census.test.js, the "
          "edge bundles and their meta files): each taken from ONE side and re-derived through its own door or script (the bundles by `npm run "
          "build:edge-shared`, alone, last), never merged by hand; a conflict outside this list means the base is wrong or a side moved. THEN every check "
          "section 2m lists; THE TWO ROWS BANKED AGAINST THIS LANE in defenseDisplay.js (2m's part (3): the siege line \"under siege the outlying fields "
          "would be lost\"; the crime desk's ring line with \"streets\"; reason `after-base: leaves-3`) cured and shrunk out as 2m gives it; the page census "
          "on this lane's lines (2m's door, the 720). A door's refusal you cannot cure is a STOP to the chair with the door's output: nothing is banked by "
          "hand.\n"
          "7. THE LANE'S ONE FINAL STATEMENT in the form below (the lane's base is 4534ea5e3; the stage a reader has not read begins at d79ea4c70): CENSUS-2 "
          "per kind at the base and at your final tip (PART 7 holds the base's counts: re-run the tip); the first census's counter at both, its own exit "
          "read; the whole suite ONCE at the tip in six shards, each red FILE re-run at the base to class it; the draft record "
          "docs/chair/2026-11-13/W2-C-LEAVES-SHIFT-RECORD-DRAFT.md brought current; the new words of the whole lane; FOR THE JOIN gathered whole from "
          "every part (the house-label leaf's call sites; SupplyChainFlow.jsx's ChainRow; EconomicsTab.jsx and EconomicsTrade.jsx's shared lines; the "
          "arcane defence's two homes); LEFT FOR AFTER THE JOIN (every row not reached; each part's \"Found, not mine\"). A fresh reader then reads the lane "
          "from d79ea4c70: leave it what it needs."),
    merges="; the merge of the integration line's tip named in step 6",
    when="for a stop that blocks everything you have left, when the list's time-box closes (one line: the tip; what was cured, what is left), when the line's merge and its registers are pushed, and with your final statement or hand-back",
    turns='',
)


SEATS2['R2-CODE-A-8'] = dict(
    title="R2-CODE-A-8 · round two's first code lane's close: the widest rows left, its own reds, the line's merge, the final statement",
    branch='lane/r2-code-a-2026-11-13', tip='ae12d68d', statement=True,
    intro=("You are R2-CODE-A-8, the eighth seat on round two's first code lane of the settlement-engine integration program (lane/r2-code-a-2026-11-13). The "
           "lane cures false lines in the founding paragraph, the history's origin, the arrival scenes, the pressure sentences and the people data: a line a "
           "page prints that the town's own record makes false. The seventh seat cured four writers, named what it could not cure and handed back at its "
           "context mark with its list written out. Yours: the widest rows left, inside a time-box, and THE LANE'S CLOSE."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-13/R2-CODE-A-HANDBACK.md, BY LINE RANGE, BY SCRIPT (the file is long; open only these): SECTION 16 WHOLE (the "
          "seventh seat: the rulings, its four cures with their measures and guards, what it named and parked, \"WHAT IS LEFT\", the reds it ran with, how "
          "the instruments are re-made); in section 12 the two paragraphs \"Round three's list\" (its NOT STARTED rows) and \"The increment\"; in section 13 "
          "the paragraphs on the lane's own reds.\n"
          "3. THE LISTS the row numbers refer to: `git fetch origin lane/round-3-cut-2026-11-13`: docs/chair/2026-11-13/ROUND-3-CUT.json and "
          "ROUND-3-CUT-INCREMENT.json (key `lines`: each line's number, town, sentence, fact, writer; query by script, never print).\n"
          "4. At THE CLOSE: the merge book's section 2m on origin/lane/merge-15-point-49-wip-2026-11-14 (docs/INTEGRATION_STYLE_2_2026-11-09.md, the "
          "section headed \"## 2m.\": about forty lines; by script)."),
    work=(CLOSE_NOW % '180,000' + "\n"
          "THE LIST, in this order, each writer its own commit, measured first on births in the app's own shape (section 16 says how the seventh seat built "
          "its corpora), red first (a collected arm, never a bare seed loop), pushed as made:\n"
          "1. ITEM 7: foodBalance.js :: deriveSupplyRiskAnalysis, \"One importer now brings in all the grain\" under a siege (the cut's #208, with #1004 and "
          "#1336 of the same function: a grain importer where no grain is imported; \"the forest the timber comes from\" where none supplies it). RULED: "
          "under a siege nothing is brought in by road; a line names an import or a source only where the record holds it.\n"
          "2. RANK BEFORE YOU CURE: for every other row left (section 16's item 9: section 12's medium rows and the increment's rows in the lane's files), "
          "ONE script over your births that counts the towns printing each row's sentence at the tip; cure the widest causes first, one cause a commit, "
          "until the time-box closes. A row that needs a word the vocabulary does not hold is PARKED with its word; a row whose true writer is another "
          "lane's file goes under FOR THE JOIN (file, function, the one-line change). The table of counts goes in the hand-back: it serves the seat after "
          "the join.\n"
          "3. ITEM 4's READ, RULED: \"selling the game in the market\" in a place with no market is NOT a figure of speech: the roster's merchant rule the "
          "seventh seat built (1ddf992e2) takes it too (where no market stands the secret is not dealt, or a twin says the game is sold on the quiet), IF "
          "that can be done through the doors; a door's refusal is written under FOR THE JOIN with its output, and the line stays.\n"
          "NOT YOURS, AS THE SEVENTH SEAT LEFT THEM: item 2's clergy row (faithReading.js is round two B's file: FOR THE JOIN as written; the chair adds for "
          "the join that `^abbot` does not match \"senior abbot\" even with the article gone: to be measured on the joined tree); item 3 (FOR THE JOIN); "
          "item 4's minted faces (FOR THE JOIN); item 6 (PARKED with its two words); item 8's reads (record each as read, no more); the six mentor rows; "
          "the wayside shrine.\n"
          "THE CLOSE, each step its own commit or commits:\n"
          "4. THE LANE'S OWN TWO REDS through their doors (section 16's step 2): the wiring census's alias draft re-keyed by identity once its new rows are "
          "read; the pool-dominance register's new pool row (ARRIVAL_SENSES.stone.lines) through the register's `--tighten` form, the one door for a new "
          "pool (no re-base), as the powers lane's seat used it. The two golden surfaces the fifth seat's founding cure moved (generationForkCensus A1, "
          "worldFactRederive A7) are the merge seat's doors: NAMED with their measured figures in the draft shift record; open no golden's door.\n"
          "5. THE MERGE OF THE LINE (the word is given): full history first (`git fetch --depth=2147483647 origin lane/integration-2026-11-07 "
          "lane/r2-code-a-2026-11-13`; `git rev-parse --is-shallow-repository` prints false; the base is e969a75b7); the line's tip as you read it back "
          "(976db5b19 when this was written; a plain merge; say which commit and what conflicted). BY THE CHAIR'S TRIAL MERGE OF ae12d68d: 2 conflicted "
          "files, NO CODE (docs/content/wiring-census.json, tests/lint/presumedThings.register.json): each taken from the LINE's side and re-derived through "
          "its own door after the merge, never merged by hand; a code conflict means the base is wrong or a side moved. THEN every check section 2m "
          "lists: each red that names a line, a literal, a pool row or a page line of THIS lane's files is cured or declared through its door; a red on the "
          "line's carried set or another lane's file is NAMED with its owner; nothing is banked by hand: a door's refusal you cannot cure is a STOP to the "
          "chair with the door's output. The page census on this lane's lines (2m's door, the 720).\n"
          "6. THE LANE'S ONE FINAL STATEMENT in the form below (the base is e969a75b7; the stage a reader has not read begins at 0d3972d8f): with the "
          "declared re-deals of every seat gathered from the hand-back's sections by script (section 12's step 4 lists them), the new words of the whole "
          "lane, FOR THE JOIN gathered whole, and LEFT FOR AFTER THE JOIN (step 2's table and every row not reached). A fresh reader then reads the lane "
          "from 0d3972d8f: leave it what it needs.\n"
          "A HAZARD THE SIXTH SEAT MET: the presumed-things walker reads EVERY literal under src/: run tests/lint/presumedThings.walker.test.js at every "
          "commit that adds, splits or rewords a literal, and move its register only through its own door."),
    merges="; the merge of the integration line's tip named in step 5",
    when="for a stop that blocks everything you have left, when the list's time-box closes (one line: the tip; what was cured, what is left), when the line's merge and its registers are pushed, and with your final statement or hand-back",
    turns='',
)


# ---------------------------------------------------------------------------------------------------------------------
# THE FRESH READERS of the lanes that have made their final statement. One entry per reader, filled when its lane is final:
#   seat, title, lane (the branch read), own (the reader's own branch), base (where the stage begins: the tip the last read
#   read, or the lane's base), tip (the final tip), what (what the lane cures, one clause), before (what the last read found,
#   or ''), stmt (the lane's statement file), tools (an earlier reader's instruments to reuse), rulings (the chair's rulings the
#   stage was built to, to judge it against), extra (lane-specific steps), mark.
READERS = {}

def build_reader(seat):
    r = READERS[seat]
    head = (
        "# BRIEF: %s\n\n"
        "The seat's assignment, written by the chair as a file on 2026-11-14 and named in the seat's first message. The chair is the Claude Code session "
        "%s. Checked out at `%s` (the lane it reads); the seat's own branch `%s`; a clone of 1200 commits; effort high; the model as the chair's records of "
        "that day give the mix. A SELF-CONTAINED brief. Rulings sent after it are in the chair's records.\n\n---\n\n" % (r['title'], CHAIR, r['lane'], r['own'])
    )
    body = '\n\n'.join([
        ("You are %s, an independent reviewer of the settlement-engine integration program. You fix nothing and you change nothing on the lane you read. You "
         "read ONE STAGE of %s (%s): from %s (%s) to %s, where its last seat made the lane's final statement. You return CLEAR or NOT CLEAR for the lane at "
         "%s. Read the tip named, not the branch's newest." % (seat, r['lane'], r['what'], r['base'], r['before'], r['tip'], r['tip'])),
        ("WHY THIS READ MATTERS. The release is held until a fresh round of thirty generated towns reads with no high and no medium false sentence. A read of "
         "another lane found 59 of its 151 new or reworded lines FALSE where they print, because each had been read in one town or none. So the heart of this "
         "read is step 1: every new or reworded line READ WHERE IT PRINTS. A false sentence you miss is the costly error; a true sentence you list wastes a "
         "builder's hour. A lane read CLEAR is joined to the integration line; your findings on a lane read NOT CLEAR become a builder's list, row by row."),
        WHY2.replace("This file is your whole assignment and carries the chair's rulings: no adjacent repair, however tempting.",
                     "This file is your whole assignment."),
        ("READ FIRST, and no more than this:\n"
         "1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) at your checkout.\n"
         "2. THE READERS' SCALE (`git fetch origin lane/round-3-cut-2026-11-13`): docs/chair/2026-11-13/probes/REVIEW-R2-STAGES/READER-BRIEF.md, its section "
         "\"What you do\": the kinds (a) to (h), the three severities and what is NOT a fault: your scale.\n"
         "3. A PATTERN FOR STEP 1 AND INSTRUMENTS TO REUSE, not to rewrite: " + r['tools'] + "\n"
         "DO NOT open the lane's hand-back or statement (" + r['stmt'] + "), any other file under docs/chair/ on the lane, or any commit message of the range "
         "until step 1's list is committed and pushed. You may read the DIFFS themselves: that is how you find the lines."),
        ("FIRST ACT. FULL HISTORY (`git fetch --depth=2147483647 origin " + r['lane'] + " lane/integration-2026-11-07`; `git rev-parse "
         "--is-shallow-repository` prints false: a shallow clone answers ranges and merge bases wrongly). Read the lane's tip back from origin: it was " + r['tip'] +
         " when this was written; if it has moved, read the tip NAMED and say in one line to the chair what moved. THE STAGE'S OWN CHANGE is what the lane's own "
         "commits after " + r['base'] + " changed (`git log --first-parent --no-merges " + r['base'] + ".." + r['tip'] + "` and, where the lane merged a side "
         "branch of its own, that branch's commits), plus how each merge of the integration line resolved its conflicts (`git show --remerge-diff <merge>`): "
         "never the line's own changes that arrived by a merge."),
        ("THE WORK, in order:\n"
         "1. COLD FIRST: EVERY NEW OR REWORDED LINE OF THE STAGE, READ WHERE IT PRINTS. From the diff (the code and data, not the messages) list every sentence, "
         "clause, label, chip, title form or pool variant the stage added or reworded, with its file and function and the conditions it is declared under. Birth "
         "towns IN THE APP'S OWN CONFIGURATION SHAPE (`selectedStresses` with `selectedStressesRandom:false`): the census's 720 are a start "
         "(origin/lane/second-wave-census-2026-11-12: docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/), and add births until each line prints. For each line "
         "find where it prints at the tip (every surface: the tabs, the Tonight sheet, the PDF's text, the Foundry journal, the exports) and READ IT against the "
         "town's own record in AT LEAST THREE TOWNS, the smallest and the largest size it reaches, a siege, a famine or an occupation among them where it can "
         "print under one; better, by script in every town it prints in. Each line: TRUE in every town read; FALSE (high, medium or low by the scale) with the "
         "town, the sentence and the fact against it; or NEVER PRINTS (say how many births you tried). Also: a twin that lacks a condition its siblings carry; "
         "a slot that prints a catalogue label or breaks agreement; a line that says how the model works. Commit and push this list before you read any claim.\n"
         "2. THEN THE LANE'S STATEMENT (" + r['stmt'] + ": only the parts of the seats inside the stage). EVERY ROW THE STAGE SAYS IT CURED: the false sentence "
         "gone on the row's own town AND on your births, and what prints in its place TRUE, read in its town: cured and true, cured by silence, or still false. "
         "A count falling is not a cure: for each removal, read thirty of the removed lines (or all, if fewer) and say how many were true. Its headline counts "
         "by your own run.\n"
         "3. THE LAWS. A cure in generator or data code is a DECLARED MOVE: by a field diff over the census's 720 births, the stage's base against its tip, say "
         "which families of the record moved, whether each is one the statement declares, and that nothing else moved. Its draft shift record against the "
         "registered surfaces (tests/fixtures/.golden-freeze-register.json): measure the ones it declares moved and sample the ones it declares unmoved. No "
         "draw added or moved unless declared; no new key in the settlement record; no new word in the vocabulary file; no name a user can hide written into a "
         "stored composed sentence; the page shows ratings, never the machinery.\n"
         "4. A PLANT OF YOUR OWN for each guard the stage added or changed: does it red on its fault, and only on it? And where a cure took a line off some "
         "towns by a condition: is there a guard at all? List the cures with none.\n"
         "5. THE MERGE OF THE LINE inside the stage: each conflicted code file's resolution keeps BOTH sides' cures (read the remerge diff; a cure of the "
         "line's that the resolution dropped is a HIGH finding); each register and pin was re-derived through its own door or re-measured, never merged or "
         "banked by hand (for each register file the stage touched: do the rows it added equal what the door's own checking run gives at the tip?).\n"
         "6. THE GATES the stage's commits name (the strict-domain gate, the type ratchet, eslint on the touched files) by your own run at the tip, and the "
         "governing test files it names. Its whole suite's classing: check the reds it names as its own and as carried, by running those FILES at the tip and "
         "at the stage's base, not the whole suite.\n"
         "7. THE MEASURING SEAT'S COMMAND, as a second eye: `git fetch origin lane/census-2-2026-11-13`; `mkdir -p <scratch>/c2 && git archive "
         "origin/lane/census-2-2026-11-13 docs/chair/2026-11-13/probes/CENSUS-2 | tar -x -C <scratch>/c2`; `sh "
         "<scratch>/c2/docs/chair/2026-11-13/probes/CENSUS-2/census2.sh <the tip's tree> <an out-dir outside the repository> 4 --files <the stage's files, "
         "comma-separated>` and the same at the stage's base: each kind's count at base and at tip; a kind that RISES is a finding." +
         (("\n" + r['extra']) if r.get('extra') else '')),
        (("THE CHAIR'S RULINGS THE STAGE WAS BUILT TO (judge it against them; say where you would rule differently, row by row: the owner may veto any): " +
          r['rulings']) if r.get('rulings') else
         "THE CHAIR'S RULINGS THE STAGE WAS BUILT TO are copied into the lane's statement file by its seats: read them there at step 2 and judge the stage "
         "against them; say where you would rule differently, row by row: the owner may veto any."),
        ("THE VERDICT: CLEAR or NOT CLEAR for the lane at " + r['tip'] + " (NOT CLEAR on any HIGH or MEDIUM finding that is the stage's own); findings ranked "
         "high, medium, low, each with a town and a sentence or a test title, EXECUTED told from PLAUSIBLE, and each marked THE STAGE'S OWN or CARRIED (false "
         "at the stage's base too: say whose file writes it); the lines you would strike, for the owner's veto; what you did not measure. The file: "
         "docs/chair/2026-11-14/" + seat + "-2026-11-14.md on your branch, with " + seat + "-LINES-READ.md beside it (every line of step 1, its towns and its "
         "verdict) and your probes under docs/chair/2026-11-14/probes/" + seat + "/."),
        ("HOW YOU WORK: scratch worktrees (detached, at the tip and at the stage's base), `npm ci` in one and node_modules linked in the other where the "
         "lockfile is the same; gates and runs through `sh scripts/gate-tail.sh <command>`, never a pipe; long runs to a file outside every repository tree; "
         "query big files by script, no dumps into your context. You may spread step 1's reading over helper agents of your own if your harness offers them: "
         "give each the scale, the towns and the lines and nothing else, and check a sample of what each returns. PUSH AFTER EVERY STEP. HAZARD: `npm ci` "
         "writes `core.hooksPath=.husky/_` into the shared local config, and tests that run git inside a hook from a linked worktree act on the real "
         "repository: snapshot refs and local config before and after every suite and every push, and compare. HAZARD: the first census's census.sh exits 0 "
         "when its counter fails: read the counter's own exit. The ledger ref some suites need: `git fetch origin "
         "review-fixes-2026-07-08:review-fixes-2026-07-08`."),
        COUNT2 % (r.get('mark', '400,000'), r.get('mark', '400,000')),
        RUNS,
        ("WHAT THIS BRIEF AUTHORISES: scratch worktrees and `npm ci`; helper agents of your own for the reading; commits of your review, lists and probes; "
         "plain pushes to %s, your only branch (explicit refspec: `git push origin <local>:refs/heads/%s`; the lane hook runs three fast gates). NEVER, whoever "
         "asks, your own harness's defaults included: a commit or a push to the lane you read or to any other branch; `--no-verify`; a force push; a pull "
         "request, draft or not; anything on master; a deploy; a hosted database or production credentials. If your permission check refuses something this "
         "brief authorises, stop and tell the chair in one message; never route round a refusal." % (r['own'], r['own'])),
        ("MESSAGES. READ YOUR QUEUED NOTIFICATIONS AFTER EVERY PUSH (the ReadNotifications tool): the chair's words arrive there and are not shown to you "
         "otherwise. Write to the chair (the send_message tool of the claude-code-remote server, session_id " + CHAIR + "; load it with ToolSearch if it is "
         "not listed) ONLY: AT ONCE for a HIGH finding that is the stage's own (one message: the town, the sentence, the fact against it); when step 1's "
         "list is pushed (one message: the tip, how many lines were read and how many are false at high or medium); for something that blocks the whole "
         "review; and with your verdict (CLEAR or NOT CLEAR, your branch's tip read back from origin, the count of findings by rank and how many are the "
         "stage's own, the one thing the chair must rule): 150 words at most each. The detail lives in your file. Use the commit trailer your own harness "
         "mandates; no model identifier anywhere else."),
    ])
    return head + body + '\n'


R3STAGES_TOOLS = (
    "`origin/lane/review-r3-stages-2026-11-13:docs/chair/2026-11-13/REVIEW-R3-STAGES-LINES-READ.md` (another reader's read of two stages line by line, by "
    "script in every town a line prints in: `git fetch origin lane/review-r3-stages-2026-11-13`) and its probes under "
    "docs/chair/2026-11-13/probes/REVIEW-R3-STAGES/ on the same branch (births.mjs, find.mjs, facts.mjs, fielddiff.mjs, governing.sh: copy them out with "
    "git archive and run them from outside every repository tree)."
)

# Filled when the lane is final: set 'tip' to the lane's final tip as read from origin, then generate.
READERS['REVIEW-R3-TABS'] = dict(
    title="REVIEW-R3-TABS · round three's tabs lane read whole, from its base to its final statement",
    lane='lane/r3-tabs-2026-11-13', own='lane/review-r3-tabs-2026-11-14', base='aac79b80', tip=None,
    what="round three's tabs lane: it cures the false lines and badges the Defense, History and Substrate tabs write themselves, and the defence posture's selector",
    before="the lane's base on the integration line: no reader has read this lane",
    stmt='docs/chair/2026-11-13/R3-TABS-HANDBACK.md', tools=R3STAGES_TOOLS,
    extra=("8. THE LANE SAYS ITS CURES ARE DISPLAY ONLY AND ITS BIRTHS BYTE-IDENTICAL TO ITS BASE: prove or refute it on the census's 720 by your own run (the "
           "merge of the line apart: compare the lane's tip with the line's tip it merged). A severity word printed for a tension whose record holds a RANGE of "
           "severities is a finding (ruled: a range is not a rating): count it on every surface."),
)


SEATS2['R2-CODE-B-7'] = dict(
    title="R2-CODE-B-7 · round two's second code lane: the line's merge and the final statement",
    branch='lane/r2-code-b-2026-11-13', tip='c40da4ec', statement=True,
    intro=("You are R2-CODE-B-7, the seventh seat on round two's second code lane of the settlement-engine integration program (lane/r2-code-b-2026-11-13). The "
           "lane cures false lines on the Tonight sheet, the cast cards, the crisis cast and hooks, the NPCs, Relationships, Services and Daily Life tabs, the "
           "chain card's facts, the quick guide, the traditions, the faith reading and the stress summaries. ITS LIST IS DONE: the sixth seat closed it (the side "
           "branch is merged; the measuring seat's command and the field diff are taken) and handed back before the landing work, which is yours whole: the "
           "merge of the integration line, which now holds point 49 (the instrument lane), the instrument's findings on this lane's lines, and the lane's ONE "
           "final statement."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-13/R2-CODE-B-HANDBACK.md: PART 6 WHOLE (the sixth seat: its items; FOR THE JOIN; ROW 3 MEASURED, NOT BEGUN; the "
          "census's counts at base and tip and the field diff by family, which serve your statement; \"Rows NOT reached\" row 3 (i) to (v): THAT IS YOUR LIST) "
          "and PART 5's FOR THE JOIN and new words. The file is long: read those parts by line range, by script.\n"
          "3. The merge book's section 2m on origin/lane/merge-15-point-49-wip-2026-11-14 (docs/INTEGRATION_STYLE_2_2026-11-09.md, the section headed "
          "\"## 2m.\": the instrument's walkers and doors, by command; about forty lines; by script)."),
    work=("THE WORK, in this order, pushed as made:\n"
          "1. FULL HISTORY FIRST (`git fetch --depth=2147483647 origin lane/integration-2026-11-07 lane/r2-code-b-2026-11-13`; `git rev-parse "
          "--is-shallow-repository` prints false; the base with the line is e969a75b7): a shallow clone gives wrong merge bases and false conflicts.\n"
          "2. THE MERGE of the line's tip as you read it back (976db5b19 when this was written; a plain merge commit, never a rebase; say which commit and what "
          "conflicted). BY THE CHAIR'S AND THE SIXTH SEAT'S TRIAL MERGES: 9 conflicted files. CODE, resolved BY HAND AT THE CAUSE, each file read whole first, "
          "so that BOTH sides' cures stand (the line's changes of points 47 and 48, and this lane's removals: the upstream note, the \"Import: <a chain's "
          "label>\" From line, the template house list): src/pdf/sections/EconomicsTrade.jsx, Services.jsx, SupplyChainFlow.jsx; list every hunk and what you "
          "kept; a hunk that needs a choice between two behaviours is a STOP with both sides. THE OTHER SIX are registers and pins (wiring-census.json, "
          ".writer-reach-baseline.json, the lighting census, the tuning inventory, dossierPhoneFloorAllViews, institutionBudgetPromise): each taken from ONE "
          "side in the merge and then re-derived through its own door, each its own commit (a pin re-keyed by identity with its cause), never merged by hand. "
          "The edge bundles by `npm run build:edge-shared`, alone, last.\n"
          "3. EVERY CHECK SECTION 2m LISTS, right after the merge: each red that names a line, a literal, a pool row or a page line of THIS lane's files is "
          "cured or declared through its door; a red on the line's own carried set or on another lane's file is NAMED with its owner and left; nothing is "
          "banked by hand. The page census on this lane's lines (2m's door, the 720).\n"
          "4. THE LANE'S ONE FINAL STATEMENT in the form below: the sixth seat's census counts and field diff stand in it unless your merge changed what the "
          "lane's files print (say how you know); the whole suite once, in six shards, every red classed against the line's carried set and the lane's base; "
          "the draft shift record; the new words of the whole lane gathered from the hand-back's parts; FOR THE JOIN gathered whole (the side seat's stops; "
          "the stores' span's two homes; the wartime summary's one path; the quick guide that no surface calls; the Power tab's seat line; your lines in "
          "EconomicsTab.jsx and EconomicsTrade.jsx, which the third leaves lane also changes). Then ONE message to the chair: the tip, the suite's reds by "
          "class, where the statement is. A fresh reader then reads the lane: leave it what it needs."),
    merges="; the merge of the integration line's tip named in step 2",
    when="for a stop that blocks everything you have left, when the merge and its registers are pushed (the tip; what conflicted), and with your final statement or hand-back",
    turns='',
)


SEATS2['UPKEEP-10'] = dict(
    title="UPKEEP-10 · the defence lane's close: three rows, the line's merge, the banked row, the final statement",
    branch='lane/coherence-upkeep-2026-11-12', tip='1bdf565e', statement=True,
    intro=("You are UPKEEP-10, the tenth seat on the defence lane of the settlement-engine integration program (lane/coherence-upkeep-2026-11-12). The lane "
           "holds the derived defence rating, the money a town can spend on it, and the safety, economy and outlook lines that speak of them. The ninth seat "
           "merged the capacity branch (a house counts by its size), cured its rows and handed back at its context mark with its list written out. Yours: "
           "three rows, the merge of the integration line, which now holds point 49 (the instrument lane), the one row banked against this lane, and the "
           "lane's ONE final statement."),
    read=("1. docs/OPERATING_STANDARD.md (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and CONTRIBUTING.md at your checkout.\n"
          "2. On your lane, docs/chair/2026-11-12/UPKEEP-HANDBACK.md: THE NINTH SEAT'S PART WHOLE (the top of the file, down to the first line of three "
          "dashes: about a hundred lines, long ones: by script). It holds every ruling in force (#869's among them), what the ninth seat did with its "
          "measures, its FOR THE JOIN rows, LEFT (THAT IS YOUR LIST) and how the instruments are re-made (its probes: docs/chair/2026-11-14/probes/UPKEEP-9/). "
          "The file is 1,200 lines: the older parts are opened ONLY where this brief names a heading, by script, by heading.\n"
          "3. The merge book's section 2m on origin/lane/merge-15-point-49-wip-2026-11-14 (docs/INTEGRATION_STYLE_2_2026-11-09.md, the section headed "
          "\"## 2m.\": the instrument's walkers and doors, by command, and how a banked row is cured and shrunk; about forty lines; by script), before the "
          "first register you touch after the merge.\n"
          "4. docs/chair/2026-11-13/UPKEEP-DEFENCE-PARTS.md (the lane's design) ONLY if a hunk of the merge touches how a rating is derived."),
    work=("THE WORK, in this order, each writer its own commit, measured first, red first (a collected arm, never a bare seed loop), pushed as made:\n"
          "1. #869 AT DISPLAY, as the ninth seat's part gives the ruling (the band is NOT moved; the page tells the siege's truth): measure which surfaces "
          "still print trade connectivity as \"Adequate\" (or better) under a siege in force at the tip, on the census's 720 and on siege births; if the "
          "printing leaf is a file this lane holds: a display-only cure, a guard town, its own commit; if another lane's: FOR THE JOIN (file, function, the "
          "one-line change, a test that reds until it is made) and go on. The Substrate tab's row was cured on round three's tabs lane: do not rebuild it.\n"
          "2. THE GRAIN LINE and THE COAL LINES UNDER A SIEGE (LEFT 1 (a) and (b), as written there: a condition at the choice; measure what still prints "
          "first; each a DECLARED MOVE confined to the income lines, with its field diff on the lane's 1,490).\n"
          "3. ONE MESSAGE TO THE CHAIR (the tip; the three rows' counts), then THE COUNT.\n"
          "4. FULL HISTORY, THEN THE MERGE. `git fetch --depth=2147483647 origin lane/integration-2026-11-07 lane/coherence-upkeep-2026-11-12`; `git rev-parse "
          "--is-shallow-repository` prints false; `git merge-base --all origin/lane/integration-2026-11-07 HEAD` prints 69b53decd (a shallow clone gives a "
          "WRONG base and false conflicts). Then the merge of the line's tip as you read it back (976db5b19 when this was written; a plain merge commit, "
          "never a rebase; say which commit and what conflicted). BY THE CHAIR'S TRIAL MERGE OF 1bdf565ec WITH 976db5b19: 12 conflicted files; a conflict "
          "outside this list means the base is wrong or a side moved: look before resolving.\n"
          "   (i) CODE, BY HAND AT THE CAUSE, each file read whole first, so that BOTH sides' cures stand: src/domain/display/defenseDisplay.js (3 hunks), "
          "src/domain/display/dossierViewModel.js (1: two additions at the same place: both stand), src/domain/generation/generationForkRegistry.js (1: a "
          "measured figure, see (iii)). List every hunk and what you kept; a hunk that needs a choice between two BEHAVIOURS is a STOP with both sides.\n"
          "   (ii) TESTS, by hand, both sides' rows standing: tests/domain/foodEnduranceHeldStores.test.js (the line's re-keyed comment and this lane's "
          "besieged arm both stand), tests/lint/heldKeyWriterCensus.walker.test.js (both lists of rows).\n"
          "   (iii) TWO MEASURED PINS MEET (tests/generators/generationForkCensus.test.js with the registry's fnv1a32External: the line re-keyed 17 -> 16, "
          "this lane 17 -> 18 -> 42; tests/lint/institutionTable.walker.test.js: the line re-measured 1,849 -> 1,843, this lane 1,849 -> 1,834 -> 1,837). "
          "NEITHER side's figure is taken and none is computed: each is MEASURED at the merge by the pin's own instrument and re-keyed by identity, both "
          "sides' causes kept in the comment and the merge named as the third; a measured figure the two causes together do not explain is a STOP.\n"
          "   (iv) REGISTERS, each taken from ONE side in the merge and then re-derived through its own door, each its own commit, never merged by hand: "
          "docs/content/wiring-census.json, tests/lint/.lighting-census-baseline.json, tests/lint/.tuning-inventory.json, "
          "tests/lint/presumedThings.register.json (take THE LINE's: point 49 changed its form; this lane's old rows are not carried over by hand: whatever "
          "its checking run then names in this lane's files is cured or declared through the door as section 2m gives it). "
          "scripts/mutation-coverage-manifest.json is a hand-written register: both sides' entries stand.\n"
          "5. EVERY CHECK SECTION 2m LISTS, right after the merge: each red that names a line, a literal, a pool row or a page line of THIS lane's files is "
          "cured or declared through its door; a red on the line's own carried set or on another lane's file is NAMED with its owner and left; nothing is "
          "banked by hand. THE ONE ROW BANKED AGAINST THIS LANE at point 49 (src/generators/economy/incomeLineSiblings.js, \"smith\", the coal line, reason "
          "`after-base: defence`, in tests/lint/presumedThings.widened.register.json; section 2m's part (3); banked by the merge seat in 3628f37cc): cured "
          "at its cause and SHRUNK from that register through its door. The page census on this lane's lines (2m's door, the 720).\n"
          "6. THE LANE'S ITEM 4 (declarations, nothing built): (i) ONE LADDER FOR ONE NUMBER: the posture line "
          "(src/domain/display/stateProse/defenseStateProse.js :: posturePoolKey, another lane's file) bands readiness on the aspects' ladder, not the "
          "badge's: bring the measure current at your tip (the births where the posture line's pool and the badge's band disagree; the sixth seat's "
          "docs/chair/2026-11-13/probes/UPKEEP-6/one-ladder.txt shows how) and write it under FOR THE JOIN; do not touch that file. (ii) The Services and "
          "Magic tabs keep the shown label this release (the lows L3 and C11): LISTED, not built. (iii) The first read's corpus lines (M1, M2, M3, M5, L2) "
          "and the fourth read's C-M1 six births: DECLARED AS EXPOSURE, town by town, at your tip (find each by its label in the older parts, by script).\n"
          "7. THE LANE'S ONE FINAL STATEMENT in the form below, with this lane's own parts: the base is 69b53decd (the lane's reviewed base); EVERY RATING "
          "MOVE of the lane declared with its count and its bands, gathered by script from the parts' own tables (the ninth and eighth seats' \"What this "
          "seat did, in commit order\"; the seventh's \"LEFT, AND THE FINAL STATEMENT\": W1 and W3; the capacity branch's cumulative move); the count of "
          "births where the Output figure and the prosperity word stand one band apart, and \"the word alone everywhere\" listed as the owner's open choice "
          "(#608); THE EIGHT TOWNS owed to the owner: docs/chair/2026-11-13/UPKEEP-CAPACITY-EIGHT-TOWNS.md gives them before and after the capacity build: "
          "under a new heading there, each town AT YOUR FINAL TIP in the same plain words (the readiness figure and band word, the five scores; what moved "
          "since and why, in the world's terms; no machinery: no page shows a part); EVERY NEW OR CHANGED READER SENTENCE of the whole lane with the town it "
          "was read in, gathered from the sections so headed in each seat's part (the owner vetoes by exception); FOR THE JOIN gathered whole from every "
          "part. Then ONE message to the chair: the tip, the suite's reds by class, where the statement is. A fresh reader then reads the lane, the "
          "capacity commits as their own stage: leave it what it needs (the walker change 1dac1ca25 and the monotonicity claims are its first acts)."),
    merges="; the merge of the integration line's tip named in step 4",
    when="for a stop that blocks everything you have left, at step 3 (the tip; the rows' counts), when the merge and its registers are pushed (the tip; what conflicted; the two measured pins), and with your final statement or hand-back",
    turns='',
)


def build2(seat):
    s = _r3c6() if seat == 'R3-CODE-C-6' else SEATS2[seat]
    head = (
        "# BRIEF: %s\n\n"
        "The seat's assignment, written by the chair as a file on 2026-11-14 and named in the seat's first message. The chair is the Claude Code session "
        "%s. Checked out at `%s`, which is also the seat's own branch; a clone of 1200 commits; effort high; the model as the chair's records of that day give "
        "the mix. A SELF-CONTAINED brief of the second generation: it carries the laws and the forms itself. Rulings sent after it are in the chair's records.\n\n---\n\n"
        % (s['title'], CHAIR, s['branch'])
    )
    body = '\n\n'.join([
        s['intro'],
        WHY2 + ' Never rewrite a commit at or below %s.' % s['tip'],
        "READ, AND NO MORE THAN THIS (the laws and forms the older briefs carried are written out below: do not open the brief chain or the chair's handoffs):\n" + s['read'],
        s.get('first') or ("FIRST ACT. Read the lane's tip back from origin: it was %s when this was written; any difference is a stop: tell the chair." % s['tip']),
        s['work'],
        LAWS2,
        how2(s['branch']),
    ] + ([STATEMENT2] if s.get('statement') else []) + [
        COUNT2 % (s.get('mark', '400,000'), s.get('mark', '400,000')),
        RUNS,
        never(s['branch'], s['merges']),
        messages(s['when']),
    ])
    return head + body + '\n'


QUOTED_FROM_OLD_DOCS = {'4534ea5e3', 'a59796dda'}  # hashes quoted from the old chair's documents, deeper than this clone

def exact_hashes(text, seat):
    """Every 8- or 9-hex commit token is rewritten to its exact 9-character abbreviation, read from git (never guessed)."""
    import re, subprocess
    def fix(m):
        t = m.group(0)
        if not re.search(r'[a-f]', t) or not re.search(r'[0-9]', t):
            return t
        r = subprocess.run(['git', '-C', '/home/user/settlement-engine', 'rev-parse', '--verify', '--quiet', t[:8] + '^{commit}'],
                           capture_output=True, text=True)
        if r.returncode != 0:
            assert t in QUOTED_FROM_OLD_DOCS, (seat, 'unresolved hash', t)
            return t
        return r.stdout.strip()[:9]
    return re.sub(r'(?<![0-9a-zA-Z_])[0-9a-f]{8,9}(?![0-9a-zA-Z_])', fix, text)


def build(seat):
    s = SEATS[seat]
    head = (
        "# BRIEF: %s\n\n"
        "The seat's assignment, written by the chair as a file on 2026-11-14 and named in the seat's first message. The chair is the Claude Code session "
        "%s. Checked out at `%s`, which is also the seat's own branch; a clone of 1200 commits; effort high; the model as the chair's records of that day give "
        "the mix. Rulings sent after it are in the chair's records.\n\n---\n\n" % (s['title'], CHAIR, s['branch'])
    )
    body = '\n\n'.join([
        s['intro'],
        WHY + ' Never rewrite a commit at or below %s.' % s['tip'],
        read_first(s['pred'], s['handbacks'], s.get('extra', '')),
        s['state'],
        first_act(s['tip'], s['base']) if s['tip'] != s['base'] else
            "FIRST ACT. Read the lane's tip back from origin: it was %s when this was written; any difference is a stop: tell the chair." % s['tip'],
        s['work'],
        COUNT + ' ' + s['turns'],
        RUNS,
        never(s['branch'], s['merges']),
        messages(s['when']),
    ])
    return head + body + '\n'


if __name__ == '__main__':
    out = sys.argv[1]
    seats = sys.argv[2:] or list(SEATS)
    os.makedirs(out, exist_ok=True)
    for seat in seats:
        text = build_bar() if seat == 'REVIEW-BAR-0' else (build_reader(seat) if seat in READERS else (build2(seat) if (seat in SEATS2 or seat == 'R3-CODE-C-6') else build(seat)))
        for bad in ('claude-opus', 'claude-fable', 'claude-sonnet', 'claude-haiku', 'Opus', 'Fable', 'Sonnet', 'Haiku'):
            assert bad not in text, (seat, bad)
        text = exact_hashes(text, seat)
        p = os.path.join(out, 'BRIEF-%s.md' % seat)
        io.open(p, 'w', encoding='utf-8').write(text)
        print('%s %d bytes' % (p, len(text.encode('utf-8'))))
