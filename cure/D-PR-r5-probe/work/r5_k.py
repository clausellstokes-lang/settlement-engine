import json
reps = [
(r"""where a warden HOLDS the town's public-security office, the town knows the hidden ways of its land (the office's knowledge, §5.5; L-BD 41), and a warden may LEAD a hunt (§5.5; L-BD 40);""",
 r"""where a person of the warden archetype HOLDS the town's public-security office (CH's `isWardenParagon`, or an office-holder's roster role `warden`), the town knows the hidden ways of its land (the office's knowledge in BD's one known set `knownTrailsOf`, §5.5; L-BD 41) — a warden merely RETAINED by the court and holding no office adds no way (RULINGS-ROUND5 B.13) [CURED 2026-10-19 (fp-final r5) — B.13] — and a warden may LEAD a hunt (§5.5; L-BD 40);"""),
]
json.dump(reps, open('/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PR-r5-probe/work/r5_k.json','w',encoding='utf-8'), ensure_ascii=False)
