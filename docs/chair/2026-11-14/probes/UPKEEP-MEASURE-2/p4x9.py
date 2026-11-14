# applies P4 (the military score full at its people's measure) and/or X9 (printed figures read at hundredths) to a tree
#   python3 p4x9.py <tree> P4|X9|P4,X9 [milPerHead]
import sys
T=sys.argv[1]; what=sys.argv[2].split(','); k=sys.argv[3] if len(sys.argv)>3 else '1'
g=f'{T}/src/generators/defenseGenerator.js'; w=f'{T}/src/data/defenceWeights.js'
s=open(g).read()
def rep(a,b):
    global s
    assert s.count(a)==1, a[:70]; s=s.replace(a,b)
if 'P4' in what:
    rep("""  const full = Object.fromEntries(Object.entries(dims).map(([d, v]) => [d, Math.min(100, Math.max(0, v))]));""",
"""  // UPKEEP-MEASURE-2 P4: A FORCE IS NO GREATER THAN ITS PEOPLE. The military score is full at its people's measure (the
  // people times `W.people.milPerHead`, and never above 100); what stands and is built beyond it is held in reserve, on
  // the fullness line's own words. A record with no population keeps the 100.
  const pop = Number(settlement.population);
  /** @type {Record<string, number>} */
  const top = { mil: Number.isFinite(pop) && pop > 0 ? Math.min(100, pop * W.people.milPerHead) : 100 };
  const topOf = (/** @type {string} */ d) => (Object.hasOwn(top, d) ? top[d] : 100);
  const full = Object.fromEntries(Object.entries(dims).map(([d, v]) => [d, Math.min(topOf(d), Math.max(0, v))]));""")
    if 'const bare =' in s:
        rep("""  const bare = Object.entries(dims).reduce((a, [d, v]) => a + Math.min(100, Math.max(0, v - (sustPos[d] || 0))), 0) / n;""",
            """  const bare = Object.entries(dims).reduce((a, [d, v]) => a + Math.min(topOf(d), Math.max(0, v - (sustPos[d] || 0))), 0) / n;""")
    ws=open(w).read()
    a="""  houseScale: Object.freeze({ least: 0.8, greatest: 1.2 }),"""
    assert ws.count(a)==1
    import re as _r; ln=[l for l in ws.split(chr(10)) if l.startswith(a)][0]; ws=ws.replace(ln, ln + f"""\n  people: Object.freeze({{ milPerHead: {k} }}), // UPKEEP-MEASURE-2 P4: the military score is full at the people times this (a force is no greater than its people); the starting value, for the owner's veto""",1)
    b="""  houseScale: 'a house counts by"""
    assert ws.count(b)==1
    ws=ws.replace(b, """  people: 'a force is no greater than its people: the military score is full at the place\\'s people times `milPerHead` (never above 100), the rest held in reserve (UPKEEP-MEASURE-2 P4; the starting value, for the owner\\'s veto)',\n"""+b,1)
    open(w,'w').write(ws)
if 'X9' in what:
    rep("""    ...Object.fromEntries(SCORE_KEYS.map((d) => [SCORE_NAMES[d], Math.round(r.full[d] ?? 0)])),""",
        """    // UPKEEP-MEASURE-2 X9: read at hundredths before the whole point, so a sum held at the same value (a hold's parts
    // re-scaled) never prints two figures through the float's last digit.
    ...Object.fromEntries(SCORE_KEYS.map((d) => [SCORE_NAMES[d], Math.round(Math.round((r.full[d] ?? 0) * 100) / 100)])),""")
    rep("""  const score = Math.round(r.total);""", """  const score = Math.round(Math.round(r.total * 100) / 100); // UPKEEP-MEASURE-2 X9: read at hundredths first""")
open(g,'w').write(s)
print('applied', what, 'milPerHead', k if 'P4' in what else '-')
