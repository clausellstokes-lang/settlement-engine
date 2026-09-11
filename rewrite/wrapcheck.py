import sys,subprocess,re,tempfile,os
p=sys.argv[1]; s=open(p).read()
s=re.sub(r'^export const meta','const meta',s,count=1,flags=re.M)
w='async function __wf(args,agent,parallel,pipeline,phase,log,budget,workflow){\n'+s+'\n}\n'
t=tempfile.NamedTemporaryFile('w',suffix='.mjs',delete=False); t.write(w); t.close()
r=subprocess.run(['node','--check',t.name],capture_output=True,text=True)
os.unlink(t.name)
print(('WRAP-CHECK OK ' if r.returncode==0 else 'WRAP-CHECK FAIL ')+p+('\n'+r.stderr if r.returncode else ''))
sys.exit(r.returncode)
