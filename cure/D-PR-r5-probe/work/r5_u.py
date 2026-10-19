p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
s=open(p,encoding='utf-8').read()
old_head = r"""## §19 OPEN QUESTIONS FOR THE CHAIR (round 4a first; each also in `cure/D-PR-r4.md` §6; the round-3a list kept below as history)"""
new_head = r"""## §19 OPEN QUESTIONS FOR THE CHAIR (round 5a first; each also in `cure/D-PR-r5.md` §6; the round-4a and round-3a lists kept below as history)

ROUND 5a (none blocking; each vetoable):
1. **The riders' hidden franchise** (OD-PR-51, §5.5): B.4 re-points PR's seams to master's rung, whose access law "fails CLOSED"; PR declares ONE token, `patrol`, passed only for a `pursue` detachment within capacity on a way its town knows (the owner's 18:33 warden word, 22:19 gleaning word), the form B.4 gave THE BODIES' `body`. The alternative: no patrol rides a way at all (a warden-led hunt waits at the junctions; the warden's word then reaches knowledge only) — PS §5.5's "it never takes a hidden way" would then read as written.
2. **The sweep counts a threat need too** (§7.6): PL's F.6 (b) (i) reads the ONE season tally, so the banner's riders on a lord's halves in a season with no cover occasion are friction whatever placed them — the crown's help with a threat the lord's own riders could not reach included (a lord that wants help without the grudge asks, `patrol_joins`). The alternative needs a second field (help weeks apart from sweep weeks), beyond B.9's one-field addition.
3. **The tally counts the whole season** (§2.7, §10.3 (f)): a net rider placed on another need in the weeks BEFORE a member's men went to the levy counts toward that season's `protection_kept`; PL's late-answer clause covers only an occasion opened in the season's last month. The alternative: the pair also carries the first covered tick and PL counts only weeks after the answer (a second sub-field).
4. **The root's home minimum** (REFINED, §10.3 (c)): the crown keeps `NET_HOME_MIN` of its own riders on its round like any member; the alternative lets `hold01` 1.0 lend them all.
5. **The hunt among a body's friends** (REFINED, §7.5): BD §7.6 says a hunt where the commons support the body costs the court the commons' grievance through PR's `W_HARASS`; PR carries it as a second arm of its ONE input (the greater of the two, never their sum). The alternative: BD strikes the clause and such a hunt costs nothing.
6. PL's own question (`cure/D-PL-r5.md` §7, not PR's to answer): F.6 (c)'s peacetime lend is priced only as `riders_lent` WEAR, and the weave is lit nowhere; with B.8 the lend now fires. PR's composition is unchanged by either answer.

ROUND 4a (history; Q1 RULED in RULINGS-ROUND4 §E and APPLIED in round 5a — §10.3 (b), R42):"""
assert s.count(old_head)==1
s=s.replace(old_head,new_head)
s=s.replace("""\nROUND 4a (none blocking; each vetoable):\n""","\n",1)
open(p,'w',encoding='utf-8').write(s)
print('ok')
