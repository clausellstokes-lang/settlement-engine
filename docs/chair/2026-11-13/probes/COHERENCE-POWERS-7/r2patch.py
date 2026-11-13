import sys
root=sys.argv[1]
p=root+'/src/data/faceHonorifics.js'; s=open(p).read()
s=s.rstrip('\n')+'''

/**
 * THE STYLED TITLE (COHERENCE-POWERS-7, the chair's R2 from REVIEW-POWERS-FU F2): one home for the title a person is called
 * by in words ("the lord", "the lady"), read by every row that names a person by role. A title whose registry form is
 * gendered ({ male, female }) and whose last word is the masculine form's last word takes the feminine's for a woman:
 * "the lord" → "the lady", "the abbot" → "the abbess", "the high priest" → "the high priestess" — the word her card's
 * honorific already gives her. Any other title, and every man's, is returned as it is.
 * @param {unknown} title @param {unknown} gender @returns {string}
 */
export function styledTitleOf(title, gender) {
  const t = String(title ?? '');
  if (gender !== 'female' || !t) return t;
  const pool = FACE_HONORIFICS[t.trim()];
  const form = (pool || []).find((h) => typeof h !== 'string');
  if (!form || typeof form === 'string') return t;
  const male = form.male.split(' ').at(-1) || ''; const female = form.female.split(' ').at(-1) || '';
  const words = t.split(' ');
  const last = words.at(-1) || '';
  if (!male || male.toLowerCase() === female.toLowerCase() || last.toLowerCase() !== male.toLowerCase()) return t;
  words[words.length - 1] = female.toLowerCase();
  return words.join(' ');
}
'''
open(p,'w').write(s)
p=root+'/src/generators/people/ties.js'; s=open(p).read()
a="        npc1Role: from.role,"
assert s.count(a)==1; s=s.replace(a,"        npc1Role: styledTitleOf(from.role, from.gender), // COHERENCE-POWERS-7 (R2): the role word her card styles her by")
open(p,'w').write(s)
p=root+'/src/generators/generateSettlementPipeline.js'; s=open(p).read()
a="""      npc1Role: first?.role  ?? rel.npc1Role,"""
b="""      npc1Role: first ? styledTitleOf(first.role, first.gender) : rel.npc1Role, // COHERENCE-POWERS-7 (R2): the styled title, one home"""
assert s.count(a)==1; s=s.replace(a,b)
a="""      npc2Role: second?.role ?? rel.npc2Role,"""
b="""      npc2Role: second ? styledTitleOf(second.role, second.gender) : rel.npc2Role,"""
assert s.count(a)==1; s=s.replace(a,b)
open(p,'w').write(s)
print('ok')
p=root+'/src/generators/people/ties.js'; s=open(p).read()
a="        npc2Role: to.role,"
assert s.count(a)==1; s=s.replace(a,"        npc2Role: styledTitleOf(to.role, to.gender),")
s=s.replace("import { tieArchetype } from '../npc/tieKind.js';","import { tieArchetype } from '../npc/tieKind.js';\nimport { styledTitleOf } from '../../data/faceHonorifics.js';",1)
open(p,'w').write(s)
p=root+'/src/generators/generateSettlementPipeline.js'; s=open(p).read()
s=s.replace("import { takeAllegianceReceipts } from '../domain/people/allegiance.js';","import { takeAllegianceReceipts } from '../domain/people/allegiance.js';\nimport { styledTitleOf } from '../data/faceHonorifics.js';",1)
open(p,'w').write(s)
print('ok2')
