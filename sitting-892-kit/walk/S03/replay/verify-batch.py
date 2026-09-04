"""Dry-run a fold batch: report every anchor's count in the CURRENT volume; never writes."""
import sys, pathlib, foldlib
results = []
class DryFolder(foldlib.Folder):
    def rep(self, old, new, count=1):
        n = self.txt.count(old)
        results.append((n, count, old[:100]))
        if n == count:
            self.txt = self.txt.replace(old, new)
    def checkpoint(self, *a, **k): pass
    def save(self, label): print(f'[DRY {label}] would-apply reps: {sum(1 for n,c,_ in results if n==c)} / {len(results)}')
foldlib.Folder = DryFolder
foldlib.fold_json = lambda *a, **k: None
src = pathlib.Path(sys.argv[1]).read_text()
exec(compile(src, sys.argv[1], 'exec'), {'__name__': '__dry__'})
for i,(n,c,old) in enumerate(results, 1):
    print(f'{"OK " if n==c else "BAD"} #{i:02d} count={n} want={c} :: {old!r}')
