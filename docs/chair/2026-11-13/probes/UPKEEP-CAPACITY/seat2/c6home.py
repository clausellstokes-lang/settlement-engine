# c6home.py <wt>: C6's arcane opener read at the roster's defence home (the walker: no name test outside the home)
import sys
W=sys.argv[1]
p=W+'/src/domain/institutions/defenseInstitutionBuckets.js'; s=open(p).read()
old="""  arcane: Object.freeze(['wizard', 'mages', 'arcane', 'enchant', 'spellcasting', 'academy of magic', "mages' district"]),\n"""
new="""  arcane: Object.freeze(['wizard', 'mages', 'arcane', 'enchant', 'spellcasting', 'academy of magic', "mages' district", 'mage', 'scroll scribe']), // UPKEEP-CAPACITY C6 (G5): the casters, with no alchemist\n"""
assert s.count(old)==1; s=s.replace(old,new); open(p,'w').write(s)
p=W+'/src/generators/defenseGenerator.js'; s=open(p).read()
i=s.index("/**\n * THE ARCANE OPENER'S HOUSES"); j=s.index("/** The scaled parts one house opens, alone")
s=s[:i]+s[j:]
old="import { nativeSemanticName } from '../domain/content/customContentSemanticAuthority.js';\n"
assert s.count(old)==1; s=s.replace(old,'')
old="    hasArcane: magicOn && magPri >= G.arcane && (holdsCasterHouse(institutions) || names.arcane),"
new="""    // UPKEEP-CAPACITY C6 (the chair's G5): the alchemist's shop and quarter are a trade, not retained casters, so the
    // arcane opener is the roster's casters alone (the defence home's `arcane` names, which hold every magic house of the
    // roster flags but the alchemist's); `hasMagicInst` itself is unchanged (other generators read it).
    hasArcane: magicOn && magPri >= G.arcane && names.arcane,"""
assert s.count(old)==1; s=s.replace(old,new); open(p,'w').write(s)
