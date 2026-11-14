import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src).read()
anchor = "        const ref = livePage210.get(key);\n"
assert s.count(anchor) == 1
dump = anchor + r"""        if (ref) {
          const byId = (pg) => new Map((Array.isArray(pg?.npcs) ? pg.npcs : []).filter((x) => x && typeof x.id === 'string').map((x) => [x.id, x]));
          for (const [which, A, B] of [['gallery', ref.gPage, now.gPage], ['link', ref.lPage, now.lPage]]) {
            const FA = flat(A); const FB = flat(B);
            const all = new Set([...FA.keys(), ...FB.keys()]);
            const NA = byId(A); const NB = byId(B);
            const tiesA = new Map((Array.isArray(A?.relationships) ? A.relationships : []).filter((t) => t && t.id).map((t) => [t.id, t]));
            for (const p of all) {
              const a = FA.has(p) ? FA.get(p) : '<absent>'; const b = FB.has(p) ? FB.get(p) : '<absent>';
              if (JSON.stringify(a) === JSON.stringify(b)) continue;
              const row = { town: seed, tag, read: which, path: p, at210: a, live: b };
              const m = /^relationships\[id=([^\]]+)\]\.(npc1Role|npc2Role)$/.exec(p);
              if (m) {
                const t = tiesA.get(m[1]) || {};
                const end = m[2] === 'npc1Role' ? (t.from ?? t.npc1Id) : (t.to ?? t.npc2Id);
                const ca = NA.get(String(end)); const cb = NB.get(String(end));
                row.end = end; row.endName = m[2] === 'npc1Role' ? t.npc1Name : t.npc2Name;
                row.card210 = ca ? { keys: Object.keys(ca).sort().join(','), role: ca.role ?? '<none>', name: ca.name ?? '<none>' } : '<no card>';
                row.cardLive = cb ? { keys: Object.keys(cb).sort().join(','), role: cb.role ?? '<none>', name: cb.name ?? '<none>' } : '<no card>';
                const rawP = (raw.npcs || []).find((x) => x && x.id === end);
                row.rawRole = rawP ? rawP.role : '<no raw person>';
                row.rawVeiled = rawP ? Object.keys(rawP).filter((k) => /veil|hidden|secret/i.test(k)).join(',') : '';
                row.revealOv = JSON.stringify(ov?.[String(end)] ?? null).slice(0, 60);
              }
              globalThis.__P14.push(row);
            }
          }
        }
"""
s = s.replace(anchor, dump)
end_anchor = "      expect(faults, faults.slice(0, 20).join('\\n')).toEqual([]);\n"
assert s.count(end_anchor) == 1
s = s.replace(end_anchor, "      require('node:fs').writeFileSync(`${process.env.P14_OUT}/p14-${seed}.json`, JSON.stringify({ faults, diffs: globalThis.__P14.filter((r) => r.town === seed) }));\n" + end_anchor)
s = s.replace("const H = vi.hoisted(", "globalThis.__P14 = [];\nconst require = (await import('node:module')).createRequire(import.meta.url);\nconst H = vi.hoisted(", 1)
open(dst, 'w').write(s)
