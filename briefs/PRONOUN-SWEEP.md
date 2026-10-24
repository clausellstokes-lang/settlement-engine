# THE OWNER-PRONOUN SWEEP — neutral wording for the owner in the consolidated FP volumes (the cloud chair, 2026-10-23, by delegation, vetoable)

THE RULE: the owner's pronouns have never been stated, so the corpus never uses a gendered pronoun for the owner. Write "the owner", "the owner's", "the owner's own", or rephrase. In-world persons (a captain, a ruler, a paragon, an NPC) keep their pronouns. A VERBATIM QUOTE (anything inside quotation marks that is the owner's or anyone's recorded words) is never edited.

## Your files
The fourteen consolidated program volumes, as they stand in `/home/user/fp-p8/docs`: `DESIGN_FP_ARCH_{PL,MN,RN,CH,PT,PS,ST,PR,BD,OP,MG,WS,FS,CN}.md`. The fold, the spine and PA are NOT yours; other seats own them.

## Do
1. For each file, write an amended COPY to `KIT/pa/pronoun/<file>`. Never edit `/home/user/fp-p8/docs`.
2. Change ONLY a he / him / his / himself (or she / her / herself) whose antecedent is THE OWNER ("the owner", "the owner's word", "OWNER", the owner's rows). Examples:
   - "the owner's word … his call" → "… the owner's call"
   - "THE OWNER'S, on his words" → "THE OWNER'S, on the owner's words"
   - "the rows the owner keeps for himself" → "the rows the owner keeps"
   - "are his" → "are the owner's"
3. When the antecedent is unclear, read the sentence and the one before it. If it is still unclear, LEAVE it and list it in your log as "left: ambiguous".
4. Log every change in `KIT/pa/pronoun/PRONOUN-SWEEP-log.md`, one row each (file · line · before, at most 15 words · after). Then list every left or ambiguous site, and every in-world pronoun you checked and kept.
5. Prove each copy with `python3 KIT/tools/consolidate-ratchet.py /home/user/fp-p8/docs/<file> KIT/pa/pronoun/<file>`. Expect no differences: tokens, cites, OD rulings, ⭐, DRAFT, UNMEASURED, flags and review markers all EQUAL. Quote each last line in the log, and explain any difference or revert the change that caused it.
6. Run a word diff (`diff <(tr -s ' ' '\n' < old) <(tr -s ' ' '\n' < new)`, or a python equivalent) per file. Confirm that the only changed words are pronouns and their neutral replacements.

## Rules
Never touch git beyond reading; never run the test suite; never edit outside `KIT/pa/pronoun/`. No model name anywhere.

Paths: KIT = /tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit.

FINAL MESSAGE (at most 200 words): sites changed per file, sites left ambiguous, each file's ratchet last line, and one CONFIRMED-vs-PLAUSIBLE sentence.
