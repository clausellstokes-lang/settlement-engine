// Read-only probe: the cured parser (d0c1a777e) vs the pre-cure parser (7f974e855), on canned records.
function parsePorcelainPaths(raw) {
  return raw.split('\n').filter((line) => line !== '').map((line) => {
    if (line.length < 4 || line[2] !== ' ') {
      throw new Error('REFUSED: not a porcelain record: ' + JSON.stringify(line));
    }
    return line.slice(3);
  });
}
const oldParse = (out) => out.trim().split('\n').map((l) => l.slice(3).trim()).filter(Boolean);
const REG = 'tests/lint/.lighting-census-baseline.json';
const cases = {
  'unstaged-first':   ' M ' + REG + '\n',
  'staged-first':     'M  ' + REG + '\n',
  'foreign-first':    ' M ARCHITECTURE.md\n M ' + REG + '\n',
  'untracked-first':  '?? zz.txt\n M ' + REG + '\n',
  'clean':            '',
};
for (const [name, raw] of Object.entries(cases)) {
  let cured; try { cured = JSON.stringify(parsePorcelainPaths(raw).filter((p) => p !== REG)); } catch (e) { cured = 'THROW ' + e.message; }
  let old; try { old = JSON.stringify(oldParse(raw).filter((p) => p !== REG)); } catch (e) { old = 'THROW ' + e.message; }
  console.log(name.padEnd(16), 'OLD dirty=', old.padEnd(40), 'CURED dirty=', cured);
}
// Direction B: trim re-introduced in front of the cured parser
let b; try { b = JSON.stringify(parsePorcelainPaths(cases['unstaged-first'].trim())); } catch (e) { b = 'THROW ' + e.message; }
console.log('trim-reintroduced  CURED=', b);
