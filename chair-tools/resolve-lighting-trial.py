# resolve-lighting-trial.py <dock> — the §901 replay's KNOWN conflict class (a WOPS car vs SEAT-78 on the flag manifest):
# set-merge (both sides kept, markers dropped) in the three files, dedupe the duplicated import line, and re-set the
# two toHaveLength literals in contributionLedgerShape to the MEASURED manifest length (node imports the merged module).
import re,io,sys,subprocess,os
D=sys.argv[1]; os.chdir(D)
FILES=['src/domain/worldPulse/simulationRules.js','tests/domain/contributionLedgerShape.test.js','tests/domain/subsystemRowsVirtual.test.js']
def both(path):
    if not os.path.exists(path): return
    s=io.open(path,encoding='utf-8').read()
    if '<<<<<<<' not in s: return
    out=re.sub(r'<<<<<<< [^\n]*\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n', lambda m: m.group(1)+m.group(2), s, flags=re.S)
    io.open(path,'w',encoding='utf-8').write(out); print('  merged both sides:',path)
for f in FILES: both(f)
# dedupe the import list line in subsystemRowsVirtual: "FOREIGN_SEAT, LEGITIMACY_UPHEAVAL, WAR_MEMORY," repeated
p='tests/domain/subsystemRowsVirtual.test.js'; s=io.open(p,encoding='utf-8').read()
s2=re.sub(r'(  FOREIGN_SEAT, LEGITIMACY_UPHEAVAL, IRREGULAR_FORCE, WAR_MEMORY,\n)  FOREIGN_SEAT, LEGITIMACY_UPHEAVAL, WAR_MEMORY,\n', r'\1', s)
if s2!=s: io.open(p,'w',encoding='utf-8').write(s2); print('  deduped the import line')
# measure the manifest length by importing the merged module
n=subprocess.check_output(['node','-e','import("./src/domain/worldPulse/simulationRules.js").then(m=>{const k=m.ENGINE_GATED_VIRTUAL_RULE_KEYS||m.ENGINE_GATED_RULE_KEYS;console.log(k.length)})'],text=True).strip()
print('  measured ENGINE_GATED_VIRTUAL_RULE_KEYS length:',n)
p='tests/domain/contributionLedgerShape.test.js'; s=io.open(p,encoding='utf-8').read()
s3=re.sub(r'expect\(ENGINE_GATED_VIRTUAL_RULE_KEYS\)\.toHaveLength\(\d+\);', f'expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toHaveLength({n});', s)
s3=re.sub(r'expect\(VIRTUAL_SUBSYSTEM_ROWS\)\.toHaveLength\(\d+\);', f'expect(VIRTUAL_SUBSYSTEM_ROWS).toHaveLength({n});', s3)
if s3!=s: io.open(p,'w',encoding='utf-8').write(s3); print('  contributionLedgerShape literals ->',n)
